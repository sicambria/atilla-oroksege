import React from 'react';
import type { Player } from '../types';
import { ROLES } from '../constants';

interface CharacterIntroModalProps {
    players: Player[];
    currentIndex: number;
    onNext: () => void;
    onSkip: () => void;
}

export const CharacterIntroModal: React.FC<CharacterIntroModalProps> = ({
    players,
    currentIndex,
    onNext,
    onSkip
}) => {
    const player = players[currentIndex];
    const roleKey = Object.keys(ROLES).find(key => ROLES[key as keyof typeof ROLES].name === player.role);
    const roleData = roleKey ? ROLES[roleKey as keyof typeof ROLES] : null;

    if (!roleData) return null;

    const isLast = currentIndex === players.length - 1;

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
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="ornate-frame" style={{
                maxWidth: '600px',
                width: '90%',
                padding: '2rem',
                background: 'var(--color-bg-panel)',
                border: '3px solid var(--color-accent-gold)',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
                position: 'relative'
            }}>
                {/* Character Number Indicator */}
                <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-accent-gold)',
                    color: 'var(--color-bg-dark)',
                    padding: '0.25rem 1rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                }}>
                    {currentIndex + 1}. Játékos
                </div>

                {/* Character Name & Title */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{
                        color: 'var(--color-accent-gold)',
                        fontSize: '2rem',
                        margin: '0 0 0.5rem 0',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {roleData.name}
                    </h2>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: '1.2rem',
                        margin: 0,
                        fontStyle: 'italic'
                    }}>
                        {roleData.title}
                    </p>
                </div>

                {/* Symbol */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '3rem',
                    margin: '1rem 0',
                    opacity: 0.8
                }}>
                    {roleData.symbol === 'Villámnyíl' && '⚡'}
                    {roleData.symbol === 'Világfa' && '🌳'}
                    {roleData.symbol === 'Aranymérleg' && '⚖️'}
                    {roleData.symbol === 'Fonott kötél' && '🔗'}
                    {roleData.symbol === 'Pajzs' && '🛡️'}
                    {roleData.symbol === 'Pergamen' && '📜'}
                </div>

                {/* Description */}
                <div style={{
                    background: 'var(--color-bg-dark)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--color-border)'
                }}>
                    <h3 style={{
                        color: 'var(--color-accent-gold)',
                        fontSize: '1rem',
                        marginTop: 0,
                        marginBottom: '0.5rem'
                    }}>
                        Különleges Képesség
                    </h3>
                    <p style={{
                        color: 'var(--color-text-primary)',
                        fontSize: '0.95rem',
                        lineHeight: '1.5',
                        margin: 0
                    }}>
                        {roleData.description}
                    </p>
                </div>

                {/* Starting Hand */}
                <div style={{
                    background: 'var(--color-bg-dark)',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1.5rem',
                    border: '1px solid var(--color-border)'
                }}>
                    <h3 style={{
                        color: 'var(--color-accent-gold)',
                        fontSize: '1rem',
                        marginTop: 0,
                        marginBottom: '0.5rem'
                    }}>
                        Kezdő Kártyák
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {player.hand.map((card, idx) => (
                            <div key={idx} style={{
                                background: 'var(--color-bg-panel)',
                                border: '2px solid var(--color-accent-gold)',
                                borderRadius: '8px',
                                padding: '0.5rem 1rem',
                                color: 'var(--color-text-primary)',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                                {card.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center'
                }}>
                    <button
                        onClick={onSkip}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'rgba(92, 77, 66, 0.5)',
                            border: '2px solid var(--color-border)',
                            borderRadius: '8px',
                            color: 'var(--color-text-secondary)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(92, 77, 66, 0.8)';
                            e.currentTarget.style.borderColor = 'var(--color-accent-gold)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(92, 77, 66, 0.5)';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                        }}
                    >
                        Ugrás
                    </button>
                    <button
                        onClick={onNext}
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'var(--color-accent-gold)',
                            border: '2px solid var(--color-accent-gold)',
                            borderRadius: '8px',
                            color: 'var(--color-bg-dark)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 8px rgba(212, 175, 55, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 12px rgba(212, 175, 55, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(212, 175, 55, 0.3)';
                        }}
                    >
                        {isLast ? 'Játék Kezdése' : 'Következő'}
                    </button>
                </div>
            </div>
        </div>
    );
};
