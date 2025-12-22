import React from 'react';
import type { GameState } from '../types';
import { THREAT_DETAILS, CITIES } from '../constants';

interface CardOverviewModalProps {
    gameState: GameState;
    onClose: () => void;
}

export const CardOverviewModal: React.FC<CardOverviewModalProps> = ({ gameState, onClose }) => {
    // Get all cities with threats
    const citiesWithThreats = Object.entries(gameState.cities)
        .filter(([_, city]) => city.threats.length > 0)
        .sort((a, b) => b[1].threats.length - a[1].threats.length);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem'
        }} onClick={onClose}>
            <div className="ornate-frame" style={{
                maxWidth: '1200px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2rem',
                background: 'var(--color-bg-panel)',
                borderRadius: '12px',
                boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)'
            }} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    paddingBottom: '1rem',
                    borderBottom: '2px solid var(--color-accent-gold)'
                }}>
                    <h2 style={{
                        margin: 0,
                        color: 'var(--color-accent-gold)',
                        fontSize: '1.8rem'
                    }}>
                        🎴 Játék Áttekintése
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: '2px solid var(--color-accent-gold)',
                            color: 'var(--color-accent-gold)',
                            fontSize: '1.5rem',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem'
                }}>
                    {/* Players Section */}
                    <div>
                        <h3 style={{
                            color: 'var(--color-accent-gold)',
                            marginTop: 0,
                            marginBottom: '1rem',
                            fontSize: '1.3rem',
                            borderBottom: '1px solid var(--color-border)',
                            paddingBottom: '0.5rem'
                        }}>
                            Játékosok Kártyái
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {gameState.players.map((player) => (
                                <div key={player.id} style={{
                                    background: 'var(--color-bg-dark)',
                                    border: player.id === gameState.players[gameState.activePlayerIndex].id
                                        ? '2px solid var(--color-accent-gold)'
                                        : '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    padding: '1rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.75rem'
                                    }}>
                                        <div>
                                            <div style={{
                                                fontWeight: 'bold',
                                                color: player.id === gameState.players[gameState.activePlayerIndex].id
                                                    ? 'var(--color-accent-gold)'
                                                    : 'var(--color-text-primary)',
                                                fontSize: '1.1rem'
                                            }}>
                                                {player.name}
                                            </div>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: 'var(--color-text-secondary)',
                                                marginTop: '0.25rem'
                                            }}>
                                                {player.currentCity}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: 'var(--color-accent-gold)',
                                            color: 'var(--color-bg-dark)',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            fontSize: '1rem'
                                        }}>
                                            {player.hand.length}
                                        </div>
                                    </div>

                                    {/* Cards */}
                                    {player.hand.length > 0 ? (
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '0.5rem'
                                        }}>
                                            {player.hand.map((card) => (
                                                <div key={card.id} style={{
                                                    background: 'var(--color-bg-panel)',
                                                    border: '1px solid var(--color-border)',
                                                    borderRadius: '4px',
                                                    padding: '0.4rem 0.6rem',
                                                    fontSize: '0.85rem',
                                                    color: 'var(--color-text-primary)'
                                                }}>
                                                    {card.subType || card.name}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{
                                            color: 'var(--color-text-secondary)',
                                            fontSize: '0.85rem',
                                            fontStyle: 'italic'
                                        }}>
                                            Nincs kártya
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Threats Section */}
                    <div>
                        <h3 style={{
                            color: 'var(--color-accent-gold)',
                            marginTop: 0,
                            marginBottom: '1rem',
                            fontSize: '1.3rem',
                            borderBottom: '1px solid var(--color-border)',
                            paddingBottom: '0.5rem'
                        }}>
                            Fenyegetések Városokban
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {citiesWithThreats.length > 0 ? (
                                citiesWithThreats.map(([cityName, city]) => (
                                    <div key={cityName} style={{
                                        background: 'var(--color-bg-dark)',
                                        border: city.isLost ? '2px solid #ff4444' : '1px solid var(--color-border)',
                                        borderRadius: '8px',
                                        padding: '1rem'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <div>
                                                <div style={{
                                                    fontWeight: 'bold',
                                                    color: city.isLost ? '#ff4444' : 'var(--color-text-primary)',
                                                    fontSize: '1.1rem'
                                                }}>
                                                    {cityName}
                                                    {city.isLost && ' 💀'}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: 'var(--color-text-secondary)',
                                                    marginTop: '0.25rem'
                                                }}>
                                                    {CITIES[cityName]?.region}
                                                </div>
                                            </div>
                                            <div style={{
                                                background: '#ff4444',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                fontSize: '1rem'
                                            }}>
                                                {city.threats.length}
                                            </div>
                                        </div>

                                        {/* Threats */}
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem'
                                        }}>
                                            {city.threats.map((threat, idx) => {
                                                const details = THREAT_DETAILS[threat];
                                                return (
                                                    <div key={idx} style={{
                                                        background: 'var(--color-bg-panel)',
                                                        border: '1px solid var(--color-border)',
                                                        borderLeft: `4px solid ${details.color}`,
                                                        borderRadius: '4px',
                                                        padding: '0.5rem',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                    }}>
                                                        <div style={{
                                                            fontSize: '0.85rem',
                                                            color: 'var(--color-text-primary)'
                                                        }}>
                                                            {threat}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.8rem',
                                                            color: 'var(--color-accent-gold)',
                                                            fontWeight: 'bold',
                                                            background: 'rgba(212, 175, 55, 0.1)',
                                                            padding: '0.2rem 0.5rem',
                                                            borderRadius: '3px'
                                                        }}>
                                                            {details.amount}× {details.counter}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{
                                    background: 'var(--color-bg-dark)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '8px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: 'var(--color-text-secondary)',
                                    fontStyle: 'italic'
                                }}>
                                    🎉 Nincs aktív fenyegetés!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div style={{
                    marginTop: '2rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    gap: '2rem',
                    fontSize: '0.85rem',
                    color: 'var(--color-text-secondary)'
                }}>
                    <div>
                        <strong style={{ color: 'var(--color-accent-gold)' }}>Aranyszegély:</strong> Aktív játékos
                    </div>
                    <div>
                        <strong style={{ color: '#ff4444' }}>Vörös szegély:</strong> Elveszett város
                    </div>
                    <div>
                        <strong style={{ color: 'var(--color-accent-gold)' }}>Számok:</strong> Szükséges kártyák száma
                    </div>
                </div>
            </div>
        </div>
    );
};
