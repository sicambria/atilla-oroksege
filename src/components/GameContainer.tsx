import React, { useReducer, useCallback, useState, useEffect } from 'react';
import { gameReducer } from '../logic/gameReducer';
import { getInitialState } from '../logic/initialState';
import { Board } from './Board';
import { PlayerDashboard } from './PlayerDashboard';
import { GameStatusModal } from './GameStatusModal';
import { BottomToolbar } from './BottomToolbar';
import { TutorialOverlay } from './TutorialOverlay';
import { CharacterIntroModal } from './CharacterIntroModal';
import { HelpModal } from './HelpModal';
import { CardOverviewModal } from './CardOverviewModal';
import { LEGACY_LOCATIONS, THREAT_DETAILS } from '../constants';
import type { CityName, ThreatType } from '../types';
import { getNextBestAction } from '../logic/simulation';

interface GameContainerProps {
    playerCount: number;
    difficulty: string;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({ playerCount, difficulty, theme, toggleTheme }) => {
    const [state, dispatch] = useReducer(gameReducer, getInitialState(playerCount, difficulty));
    const [tutorialStep, setTutorialStep] = useState(0);
    const [showTutorial, setShowTutorial] = useState(true);
    const [showCharacterIntro, setShowCharacterIntro] = useState(true);
    const [currentIntroCharacter, setCurrentIntroCharacter] = useState(0);
    const [showHelp, setShowHelp] = useState(false);
    const [showCardOverview, setShowCardOverview] = useState(false);
    // Helper function to calculate initial map position centered on capital city
    // Accounts for right sidebar (320px width) by shifting center to the left
    const getInitialMapTransform = () => {
        const capitalPos = { x: 43, y: 56 }; // Etil (capital city) position in percentage

        const MAP_WIDTH = 2000; // Board map width in pixels
        const MAP_HEIGHT = 1500; // Board map height in pixels
        const INITIAL_SCALE = 0.5; // Initial zoom level

        const SIDEBAR_WIDTH = 320; // Right sidebar width in pixels
        const SCREEN_WIDTH = window.innerWidth;
        const SCREEN_HEIGHT = window.innerHeight;

        // Calculate the visual center, accounting for sidebar
        const visualCenterX = (SCREEN_WIDTH - SIDEBAR_WIDTH) / 2;
        const visualCenterY = SCREEN_HEIGHT / 2;

        // Calculate capital position in pixels on the map
        const capitalPixelX = (capitalPos.x / 100) * MAP_WIDTH;
        const capitalPixelY = (capitalPos.y / 100) * MAP_HEIGHT;

        // Calculate offset needed to center capital at visual center
        // The map starts at -25% offset (top: -25%, left: -25%)
        const mapOffsetX = MAP_WIDTH * 0.25;
        const mapOffsetY = MAP_HEIGHT * 0.25;

        // Calculate transform needed (inverted because we're moving the map, not the viewport)
        const x = visualCenterX - (capitalPixelX + mapOffsetX) * INITIAL_SCALE;
        const y = visualCenterY - (capitalPixelY + mapOffsetY) * INITIAL_SCALE;

        return { x, y, scale: INITIAL_SCALE };
    };

    const [mapTransform, setMapTransform] = useState(getInitialMapTransform());

    // Simulation State
    const [isSimulationMode, setIsSimulationMode] = useState(false);
    const [simStartTime, setSimStartTime] = useState<number | null>(null);
    const [simStepCount, setSimStepCount] = useState(0);
    const [simSpeed, setSimSpeed] = useState(90);

    // Background Wallpaper Configuration
    const BACKGROUND_CONFIG = {
        enabled: false,                   // Set to false to disable background (using Board background instead)
        image: '/map-background.png',     // Path to background image
        opacity: 0.4,                     // Transparency (0.0 = invisible, 1.0 = opaque)
        position: { x: 50, y: 50 },       // Position in % (50, 50 = centered)
        scale: 1.0,                       // Zoom level (1.0 = original size)
    };

    // Toggle Simulation Mode
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'KeyS') {
                e.preventDefault();
                setIsSimulationMode(prev => {
                    const newState = !prev;
                    console.log(`Simulation Mode: ${newState ? 'ON' : 'OFF'}`);
                    if (newState && !simStartTime) {
                        setSimStartTime(Date.now());
                    }
                    return newState;
                });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [simStartTime]);

    // Simulation Loop
    useEffect(() => {
        if (!isSimulationMode || state.gameStatus !== 'playing') return;

        const timer = setInterval(() => {
            // Double check inside interval in case state changed
            if (state.gameStatus !== 'playing') {
                clearInterval(timer);
                return;
            }

            const action = getNextBestAction(state);
            if (action) {
                dispatch(action);
                setSimStepCount(prev => prev + 1);
            } else {
                // If no action returned (shouldn't happen with current logic, but safety net)
                dispatch({ type: 'END_TURN' });
            }
        }, simSpeed);

        return () => clearInterval(timer);
    }, [isSimulationMode, state.gameStatus, state.activePlayerIndex, state.players, simSpeed]);

    const handleCityClick = useCallback((city: CityName) => {
        const activePlayer = state.players[state.activePlayerIndex];
        // If simulation is on, ignore clicks
        if (isSimulationMode) return;

        if (activePlayer.currentCity === city) return;

        dispatch({
            type: 'MOVE_PLAYER',
            payload: { playerId: activePlayer.id, destination: city }
        });
    }, [state.players, state.activePlayerIndex, isSimulationMode]);


    const handleGiveCard = (targetId: string, cardId: string) => {
        dispatch({
            type: 'GIVE_CARD',
            payload: { playerId: state.players[state.activePlayerIndex].id, targetPlayerId: targetId, cardId }
        });
    };

    const handleEndTurn = () => {
        dispatch({ type: 'END_TURN' });
    };

    const handleRestart = () => {
        window.location.reload();
    };

    const handleClaimLegacy = (legacyType: 'sword' | 'seal' | 'bow' | 'chalice') => {
        dispatch({
            type: 'CLAIM_LEGACY',
            payload: { playerId: state.players[state.activePlayerIndex].id, legacyType }
        });
    };

    const handleResolveThreat = useCallback((city: CityName, threatIndex: number, _threatType: ThreatType) => {
        const activePlayer = state.players[state.activePlayerIndex];
        const cardsToPlay = activePlayer.hand.map(c => c.id);

        dispatch({
            type: 'RESOLVE_THREAT',
            payload: { city, threatIndex, cardIds: cardsToPlay }
        });
    }, [state.players, state.activePlayerIndex]);

    const handlePlayCard = useCallback((cardId: string) => {
        const activePlayer = state.players[state.activePlayerIndex];
        const card = activePlayer.hand.find(c => c.id === cardId);

        if (!card) return;

        if (activePlayer.actionsRemaining < 1 && card.type !== 'Blessing') {
            dispatch({ type: 'LOG_MESSAGE', payload: { message: `Nincs elég akciópontod ${card.name} kijátszásához!` } });
            return;
        }

        if (card.type === 'Blessing') {
            dispatch({ type: 'PLAY_CARD', payload: { playerId: activePlayer.id, cardId } });
        } else if (card.type === 'Action') {
            const currentCity = state.cities[activePlayer.currentCity];
            if (!currentCity) return;

            if (currentCity.threats.length === 0) {
                dispatch({ type: 'LOG_MESSAGE', payload: { message: `Nincs fenyegetés ${activePlayer.currentCity} városában!` } });
                return;
            }

            // Find if there's any threat this card could potentially address
            const matchingThreat = currentCity.threats.find(t => THREAT_DETAILS[t]?.counter === card.subType);

            if (!matchingThreat) {
                dispatch({ type: 'LOG_MESSAGE', payload: { message: `${card.name} (${card.subType}) nem használható az itteni fenyegetések ellen.` } });
                return;
            }

            const details = THREAT_DETAILS[matchingThreat];
            const matchingCardsCount = activePlayer.hand.filter(c => c.subType === details.counter).length;

            if (matchingCardsCount < details.amount) {
                dispatch({ type: 'LOG_MESSAGE', payload: { message: `Nincs elég ${details.counter} kártyád! Ehhez (${matchingThreat}) ${details.amount} db kell.` } });
                return;
            }

            const threatIndex = currentCity.threats.indexOf(matchingThreat);
            handleResolveThreat(activePlayer.currentCity, threatIndex, matchingThreat);
        }
    }, [state.players, state.activePlayerIndex, state.cities, handleResolveThreat]);

    const handleNextCharacter = () => {
        if (currentIntroCharacter < state.players.length - 1) {
            setCurrentIntroCharacter(prev => prev + 1);
        } else {
            setShowCharacterIntro(false);
        }
    };

    const handleSkipIntro = () => {
        setShowCharacterIntro(false);
    };

    const activePlayer = state.players[state.activePlayerIndex];

    // Check if player can claim legacy
    const currentCity = activePlayer.currentCity;
    const availableLegacy = Object.entries(LEGACY_LOCATIONS).find(([_, loc]) => loc === currentCity);
    const canClaim = !!(availableLegacy
        && !state.legaciesCollected[availableLegacy[0] as keyof typeof state.legaciesCollected]
        && activePlayer.hand.length >= 5
        && activePlayer.actionsRemaining > 0);

    // Calculate available targets for card trading
    const availableTargets = state.players.filter(p => {
        if (p.id === activePlayer.id) return false; // Can't give to self
        if (activePlayer.role === 'Réka') return true; // Réka can give to anyone
        return p.currentCity === activePlayer.currentCity; // Others must be in same city
    });

    // Save Game (Download JSON)
    const saveGame = async () => {
        const gameStateString = JSON.stringify(state, null, 2);

        // Generate timestamp for filename
        const date = new Date();
        const timestamp = date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0') + '_' +
            String(date.getHours()).padStart(2, '0') + '-' +
            String(date.getMinutes()).padStart(2, '0') + '-' +
            String(date.getSeconds()).padStart(2, '0');
        const filename = `atilla-oroksege-mentes-${timestamp}.json`;

        try {
            // @ts-ignore - showSaveFilePicker might not be in TS definitions yet
            if (window.showSaveFilePicker) {
                // @ts-ignore
                const handle = await window.showSaveFilePicker({
                    suggestedName: filename,
                    types: [{
                        description: 'JSON File',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(gameStateString);
                await writable.close();
                alert('Játék sikeresen mentve!');
                return;
            }
        } catch (err) {
            // User cancelled or not supported, fallback to download
            if ((err as Error).name === 'AbortError') {
                return; // User cancelled
            }
            console.log('File picker not supported or error, falling back to download');
        }

        // Fallback to classic download
        try {
            const blob = new Blob([gameStateString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Hiba a mentés során:', error);
            alert('Hiba történt a mentés során!');
        }
    };

    // Load Game (Upload JSON)
    const loadGame = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.style.display = 'none';

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const content = event.target?.result as string;
                    const parsedState = JSON.parse(content);

                    // Validation & Sanitization
                    if (!parsedState || typeof parsedState !== 'object') {
                        throw new Error('Érvénytelen fájlformátum.');
                    }

                    // Check critical fields
                    const requiredFields = ['players', 'cities', 'gameStatus', 'activePlayerIndex', 'legaciesCollected'];
                    const missingFields = requiredFields.filter(field => !(field in parsedState));

                    if (missingFields.length > 0) {
                        throw new Error(`Hiányzó adatok a mentésből: ${missingFields.join(', ')}`);
                    }

                    // Basic type checks (Sanitization)
                    if (!Array.isArray(parsedState.players) || typeof parsedState.cities !== 'object') {
                        throw new Error('Sérült adatstruktúra.');
                    }

                    dispatch({ type: 'LOAD_GAME', payload: parsedState });
                } catch (error) {
                    console.error('Hiba a betöltés során:', error);
                    alert(`Hiba történt a betöltés során: ${error instanceof Error ? error.message : 'Ismeretlen hiba'}`);
                }
            };
            reader.readAsText(file);
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    };

    // Simulation Stats Calculation
    const getSimulationStats = () => {
        if (!simStartTime) return null;
        const elapsedSeconds = (Date.now() - simStartTime) / 1000;
        const estimatedGameTimeMinutes = (simStepCount * 7.5) / 60;

        return {
            elapsed: elapsedSeconds.toFixed(1),
            steps: simStepCount,
            estimatedTime: estimatedGameTimeMinutes.toFixed(1)
        };
    };

    const simStats = state.gameStatus !== 'playing' && simStartTime ? getSimulationStats() : null;

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: 'var(--color-bg-dark)' }}>
            {/* Background Wallpaper */}
            {BACKGROUND_CONFIG.enabled && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: `${BACKGROUND_CONFIG.position.y}%`,
                        left: `${BACKGROUND_CONFIG.position.x}%`,
                        transform: `translate(-50%, -50%) scale(${BACKGROUND_CONFIG.scale})`,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${BACKGROUND_CONFIG.image})`,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: BACKGROUND_CONFIG.opacity,
                        filter: 'sepia(0.2) contrast(0.9)'
                    }} />
                </div>
            )}

            <GameStatusModal status={state.gameStatus} onRestart={handleRestart} />

            {/* Simulation Stats Overlay */}
            {simStats && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '2px solid var(--color-accent-gold)',
                    padding: '2rem',
                    borderRadius: '12px',
                    zIndex: 3000,
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 0 50px rgba(212, 175, 55, 0.5)'
                }}>
                    <h2 style={{ color: 'var(--color-accent-gold)', marginTop: 0 }}>Szimuláció Eredménye</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'left', margin: '1.5rem 0' }}>
                        <div style={{ color: 'var(--color-text-secondary)' }}>Eltelt idő (valós):</div>
                        <div style={{ fontWeight: 'bold' }}>{simStats.elapsed} mp</div>

                        <div style={{ color: 'var(--color-text-secondary)' }}>Lépések száma:</div>
                        <div style={{ fontWeight: 'bold' }}>{simStats.steps}</div>

                        <div style={{ color: 'var(--color-text-secondary)' }}>Becsült játékidő:</div>
                        <div style={{ fontWeight: 'bold' }}>{simStats.estimatedTime} perc</div>

                        <div style={{ color: 'var(--color-text-secondary)' }}>Kimenetel:</div>
                        <div style={{ fontWeight: 'bold', color: state.gameStatus === 'won' ? '#4caf50' : '#ff4444' }}>
                            {state.gameStatus === 'won' ? 'GYŐZELEM' : 'VERESÉG'}
                        </div>
                    </div>

                    <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        background: 'rgba(0,0,0,0.5)',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        textAlign: 'left',
                        border: '1px solid var(--color-border)'
                    }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-accent-gold)', fontSize: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Eseménynapló</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                            {state.messages.slice().reverse().map((msg, idx) => (
                                <li key={idx} style={{ padding: '0.25rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={handleRestart} className="btn-primary">Új Szimuláció</button>
                </div>
            )}

            {/* Simulation Indicator */}
            {isSimulationMode && state.gameStatus === 'playing' && (
                <div style={{
                    position: 'fixed',
                    top: '100px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    zIndex: 2000,
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px red',
                    pointerEvents: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <div>🤖 SZIMULÁCIÓ AKTÍV ({simStepCount} lépés)</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <span>Gyors</span>
                        <input
                            type="range"
                            min="10"
                            max="1000"
                            step="100"
                            value={simSpeed}
                            onChange={(e) => setSimSpeed(Number(e.target.value))}
                            style={{ width: '100px', cursor: 'pointer' }}
                        />
                        <span>Lassú ({simSpeed}ms)</span>
                    </div>
                </div>
            )}

            {showCharacterIntro && (
                <CharacterIntroModal
                    players={state.players}
                    currentIndex={currentIntroCharacter}
                    onNext={handleNextCharacter}
                    onSkip={handleSkipIntro}
                />
            )}

            {!showCharacterIntro && showTutorial && (
                <TutorialOverlay
                    step={tutorialStep}
                    onNext={() => {
                        if (tutorialStep >= 5) setShowTutorial(false);
                        else setTutorialStep(s => s + 1);
                    }}
                    onSkip={() => setShowTutorial(false)}
                />
            )}

            {showCardOverview && (
                <CardOverviewModal gameState={state} onClose={() => setShowCardOverview(false)} />
            )}

            {showHelp && (
                <HelpModal onClose={() => setShowHelp(false)} />
            )}

            {/* Full Screen Map Layer */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <Board
                    gameState={state}
                    onCityClick={handleCityClick}
                    onResolveThreat={handleResolveThreat}
                    transform={mapTransform}
                    setTransform={setMapTransform}
                />
            </div>

            {/* Help & Zoom Controls - Top Left */}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '20px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center'
            }}>
                {/* Zoom Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <button
                        onClick={() => setMapTransform(prev => ({ ...prev, scale: Math.min(prev.scale + 0.1, 3) }))}
                        style={{
                            width: '40px',
                            height: '40px',
                            fontSize: '1.5rem',
                            background: 'var(--color-bg-panel)',
                            color: 'var(--color-accent-gold)',
                            border: '1px solid var(--color-accent-gold)',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        +
                    </button>
                    <button
                        onClick={() => setMapTransform(prev => ({ ...prev, scale: Math.max(prev.scale - 0.1, 0.4) }))}
                        style={{
                            width: '40px',
                            height: '40px',
                            fontSize: '1.5rem',
                            background: 'var(--color-bg-panel)',
                            color: 'var(--color-accent-gold)',
                            border: '1px solid var(--color-accent-gold)',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        -
                    </button>
                </div>

                {/* Save Game Button */}
                <button
                    onClick={saveGame}
                    style={{
                        background: 'var(--color-bg-panel)',
                        border: '2px solid var(--color-accent-gold)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        color: 'var(--color-accent-gold)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    title="Játék Mentése"
                >
                    💾
                </button>

                {/* Load Game Button */}
                <button
                    onClick={loadGame}
                    style={{
                        background: 'var(--color-bg-panel)',
                        border: '2px solid var(--color-accent-gold)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        color: 'var(--color-accent-gold)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    title="Játék Betöltése"
                >
                    📂
                </button>

                {/* Help Button */}
                <button
                    onClick={() => setShowHelp(true)}
                    style={{
                        background: 'var(--color-accent-gold)',
                        border: '2px solid var(--color-border)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        color: 'var(--color-bg-dark)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    title="Súgó"
                >
                    ?
                </button>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        background: 'var(--color-accent-gold)',
                        border: '2px solid var(--color-border)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.1)';
                        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                    title={theme === 'light' ? 'Sötét mód' : 'Világos mód'}
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>




            {/* Right Sidebar Overlay (Player & Log) */}
            <div className="overlay-panel" style={{ top: '20px', right: '20px', bottom: '100px', width: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', pointerEvents: 'none' }}>

                {/* Active Player Dashboard */}
                <div style={{ pointerEvents: 'auto' }}>
                    <PlayerDashboard
                        player={activePlayer}
                        isActive={true}
                        onPlayCard={handlePlayCard}
                        onGiveCard={handleGiveCard}
                        availableTargets={availableTargets}
                    />
                </div>

                {/* Game Log (Collapsible/Scrollable) */}
                <div className="ornate-frame" style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', pointerEvents: 'auto', minHeight: '0' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', color: 'var(--color-accent-gold)', fontSize: '1rem' }}>Események</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {state.messages.slice().reverse().map((msg, idx) => (
                            <li key={idx} style={{
                                marginBottom: '0.5rem',
                                fontSize: '0.85rem',
                                borderBottom: '1px solid var(--color-border)',
                                paddingBottom: '0.25rem',
                                color: idx === 0 ? 'var(--color-accent-gold)' : 'var(--color-text-primary)',
                                fontWeight: idx === 0 ? 'bold' : 'normal',
                                opacity: idx === 0 ? 1 : 0.85
                            }}>
                                {msg}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Toolbar Overlay */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 100 }}>
                <BottomToolbar
                    onEndTurn={handleEndTurn}
                    onClaimLegacy={canClaim ? () => handleClaimLegacy(availableLegacy![0] as any) : undefined}
                    onOpenCardOverview={() => setShowCardOverview(true)}
                    canClaimLegacy={canClaim}
                    actionsRemaining={activePlayer.actionsRemaining}
                    activePlayerName={activePlayer.name}
                    deckSize={state.actionDeck.length}
                    turnNumber={state.activePlayerIndex + 1}
                    threatCount={Object.values(state.cities).reduce((sum, city) => sum + city.threats.length, 0)}
                    legaciesCollected={state.legaciesCollected}
                />
            </div>
        </div>
    );
};
