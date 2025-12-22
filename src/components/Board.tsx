import React, { useState, useRef } from 'react';
import type { GameState, CityName, ThreatType } from '../types';
import { ADJACENCY, CITIES, THREAT_DETAILS } from '../constants';
import clsx from 'clsx';
import { Crown, ShieldAlert, Skull, Wheat, Swords } from 'lucide-react';

interface BoardProps {
    gameState: GameState;
    onCityClick: (city: CityName) => void;
    onResolveThreat: (city: CityName, threatIndex: number, threatType: ThreatType) => void;
    transform: { x: number; y: number; scale: number };
    setTransform: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number }>>;
}

// Colors for regions (Subtle gradients/tints)
const REGION_COLORS: Record<string, string> = {
    'Atilla Udvara': '#d2691e', // Chocolate (was #8b4513)
    'Pannónia': '#2e8b57',      // SeaGreen (was #2f4f4f)
    'Szkítia': '#6b8e23',       // OliveDrab (was #556b2f)
    'Alánföld': '#b22222',      // FireBrick (was #800000)
    'Jazygföld': '#ffd700',     // Gold (was #daa520)
    'Bolgárföld': '#9370db',    // MediumPurple (was #4b0082)
    'Gepidaföld': '#1e90ff',    // DodgerBlue (was #4682b4)
    'Dákia': '#ba55d3',         // MediumOrchid (was #800080)
    'Mözia': '#cd5c5c',         // IndianRed (was #a52a2a)
    'Ujgur Tartomány': '#20b2aa', // LightSeaGreen
    'Mongólia': '#daa520',      // GoldenRod
    'Turán-alföld': '#f4a460'   // SandyBrown
};

export const Board: React.FC<BoardProps> = ({ gameState, onCityClick, onResolveThreat, transform, setTransform }) => {
    const { cities, players, activePlayerIndex } = gameState;
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reset interaction state on turn change
    React.useEffect(() => {
        setHasInteracted(false);
    }, [activePlayerIndex]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleAdjustment = -e.deltaY * 0.001;
        const newScale = Math.min(Math.max(transform.scale + scaleAdjustment, 0.4), 3);
        setTransform(prev => ({ ...prev, scale: newScale }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMousePosition.x;
        const deltaY = e.clientY - lastMousePosition.y;
        setTransform(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
        setLastMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Generate connections for SVG lines
    const connections: { start: CityName; end: CityName }[] = [];
    const processed = new Set<string>();

    Object.entries(ADJACENCY).forEach(([start, neighbors]) => {
        neighbors.forEach(end => {
            const key = [start, end].sort().join('-');
            if (!processed.has(key)) {
                connections.push({ start: start as CityName, end: end as CityName });
                processed.add(key);
            }
        });
    });

    return (
        <div
            className="board-container"
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Background Layer */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url("${import.meta.env.BASE_URL}tronterem.jpg")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: 'sepia(0.4) contrast(1.1) brightness(0.8)',
                zIndex: 0
            }} />

            <div style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                transformOrigin: 'center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                width: '2000px',
                height: '1500px',
                position: 'absolute',
                top: '-25%',
                left: '-25%',
                zIndex: 1
            }}>

                {/* Connections Layer */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {connections.map(({ start, end }) => {
                        const startPos = CITIES[start];
                        const endPos = CITIES[end];
                        if (!startPos || !endPos) return null;

                        return (
                            <line
                                key={`${start}-${end}`}
                                x1={`${startPos.x}%`}
                                y1={`${startPos.y}%`}
                                x2={`${endPos.x}%`}
                                y2={`${endPos.y}%`}
                                stroke="var(--color-accent-gold)"
                                strokeWidth="6"
                                strokeOpacity="0.8"
                                strokeLinecap="round"
                                strokeDasharray="12,6"
                            />
                        );
                    })}
                </svg>

                {/* Cities Layer */}
                {Object.entries(cities).map(([name, city]) => {
                    const pos = CITIES[name as CityName];
                    if (!pos) return null;

                    const playersHere = players.filter(p => p.currentCity === name);
                    const regionColor = REGION_COLORS[city.region] || '#2c2420';

                    return (
                        <div
                            key={name}
                            className={clsx('city-node', { 'is-lost': city.isLost })}
                            style={{
                                position: 'absolute',
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                zIndex: 10,
                                cursor: 'pointer'
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent drag start
                                setHasInteracted(true);
                                onCityClick(name as CityName);
                            }}
                        >
                            {/* City Marker */}
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: `radial-gradient(circle at 30% 30%, ${regionColor}, var(--color-bg-dark))`,
                                border: `3px solid ${city.isLost ? '#8b0000' : city.hasCapital ? '#ffd700' : 'var(--color-border)'}`,
                                boxShadow: `0 0 15px ${city.isLost ? '#8b0000' : city.hasCapital ? '#ffd700' : 'rgba(0,0,0,0.5)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                {city.hasCapital && <Crown size={24} color="#ffd700" />}
                                {!city.hasCapital && <div style={{ width: '12px', height: '12px', background: '#fff', borderRadius: '50%', opacity: 0.5 }} />}

                                {/* Threat Badges - Stacked */}
                                {city.threats.length > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-30px',
                                        display: 'flex',
                                        gap: '5px',
                                        flexWrap: 'wrap',
                                        justifyContent: 'center',
                                        width: '100px'
                                    }}>
                                        {city.threats.map((threat, idx) => {
                                            const details = THREAT_DETAILS[threat];
                                            const color = details?.color || '#daa520';

                                            return (
                                                <div
                                                    key={idx}
                                                    className="pulsing-threat"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHasInteracted(true);
                                                        onResolveThreat(name, idx, threat);
                                                    }}
                                                    title={`${threat} (Elhárítás: ${details?.amount} ${details?.counter})`}
                                                    style={{
                                                        background: color,
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold',
                                                        border: '2px solid white',
                                                        boxShadow: '0 0 5px black',
                                                        cursor: 'pointer',
                                                        zIndex: 20
                                                    }}
                                                >
                                                    {/* Simple icons based on threat type */}
                                                    {threat.includes('Járvány') ? <Skull size={14} /> :
                                                        threat.includes('termés') ? <Wheat size={14} /> :
                                                            threat.includes('támadás') ? <Swords size={14} /> :
                                                                <ShieldAlert size={14} />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* City Label */}
                            <div style={{
                                marginTop: '5px',
                                background: 'var(--color-bg-panel)',
                                border: '1px solid var(--color-border)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                color: city.isLost ? '#ff4444' : 'var(--color-text-primary)',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none'
                            }}>
                                {name}
                            </div>

                            {/* Players */}
                            {playersHere.length > 0 && (
                                <div style={{
                                    display: 'flex',
                                    marginTop: '4px',
                                    gap: '8px', // Increased gap for names
                                    background: 'rgba(0,0,0,0.5)',
                                    padding: '4px',
                                    borderRadius: '10px',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    minWidth: '60px'
                                }}>
                                    {playersHere.map(p => {
                                        const isActive = players[activePlayerIndex].id === p.id;
                                        const showHighlight = isActive && !hasInteracted;

                                        return (
                                            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <div title={p.name} style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    background: '#4682b4',
                                                    border: '2px solid white',
                                                    boxShadow: showHighlight ? '0 0 0 4px rgba(255, 215, 0, 0.6), 0 0 10px rgba(255, 215, 0, 0.8)' : '0 0 5px #4682b4',
                                                    animation: showHighlight ? 'pulse-ring 1.5s infinite' : 'none',
                                                    zIndex: isActive ? 25 : 24
                                                }} />
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    textShadow: '0 1px 2px black',
                                                    marginTop: '2px',
                                                    fontWeight: isActive ? 'bold' : 'normal',
                                                    color: isActive ? 'var(--color-accent-gold)' : 'white'
                                                }}>
                                                    {p.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <style>{`
                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(255, 215, 0, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(255, 215, 0, 0); }
                }
            `}</style>
        </div>
    );
};
