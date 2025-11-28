import React from 'react';

interface GameStatusModalProps {
    status: 'playing' | 'won' | 'lost';
    onRestart: () => void;
}

export const GameStatusModal: React.FC<GameStatusModalProps> = ({ status, onRestart }) => {
    if (status === 'playing') return null;

    const isWin = status === 'won';

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{
                maxWidth: '500px',
                textAlign: 'center',
                padding: '2rem',
                border: `2px solid ${isWin ? 'var(--color-accent-gold)' : 'var(--color-accent-red)'}`
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    color: isWin ? 'var(--color-accent-gold)' : 'var(--color-accent-red)',
                    marginBottom: '1rem'
                }}>
                    {isWin ? 'GYŐZELEM!' : 'VERESÉG'}
                </h2>

                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    {isWin
                        ? 'Sikerült megvédeni Atilla örökségét! A birodalom egységes maradt.'
                        : 'A birodalom szétesett. A hunok dicsősége a múlté.'}
                </p>

                <button
                    onClick={onRestart}
                    style={{
                        background: isWin ? 'var(--color-accent-gold)' : 'var(--color-accent-red)',
                        color: 'white',
                        border: 'none',
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    ÚJ JÁTÉK
                </button>
            </div>
        </div>
    );
};
