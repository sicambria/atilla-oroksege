import React from 'react';

interface BottomToolbarProps {
    onEndTurn: () => void;
    onClaimLegacy?: () => void;
    onOpenCardOverview?: () => void;
    canClaimLegacy: boolean;
    actionsRemaining: number;
    activePlayerName: string;
    deckSize: number;
    turnNumber: number;
    threatCount: number;
    legaciesCollected: {
        sword: boolean;
        seal: boolean;
        bow: boolean;
        chalice: boolean;
    };
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
    onEndTurn,
    onClaimLegacy,
    onOpenCardOverview,
    canClaimLegacy,
    actionsRemaining,
    activePlayerName,
    deckSize,
    turnNumber,
    threatCount,
    legaciesCollected
}) => {
    return (
        <div className="ornate-frame" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            margin: '0 20px 20px 20px',
            borderRadius: '12px'
        }}>
            {/* Left Section - Player Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>
                        {activePlayerName}
                    </div>
                    <div style={{ color: 'var(--color-text-secondary)' }}>
                        Akciók: <span style={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>{actionsRemaining}</span>
                    </div>
                </div>

                {/* Card Overview Button */}
                {onOpenCardOverview && (
                    <button
                        onClick={onOpenCardOverview}
                        style={{
                            background: 'var(--color-bg-panel)',
                            border: '2px solid var(--color-accent-gold)',
                            borderRadius: '8px',
                            padding: '0.6rem 1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--color-accent-gold)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                        }}
                        title="Kártyák és Fenyegetések Áttekintése"
                    >
                        <span style={{ fontSize: '1.3rem' }}>🎴</span>
                        <span>Áttekintés</span>
                    </button>
                )}
            </div>

            {/* Center Section - Game Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Kör:</span>
                    <span style={{ color: 'var(--color-accent-gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{turnNumber}</span>
                </div>

                <div style={{ width: '1px', height: '24px', background: 'var(--color-border)' }}></div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Veszély:</span>
                    <span style={{ color: '#ff4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{threatCount}</span>
                </div>

                <div style={{ width: '1px', height: '24px', background: 'var(--color-border)' }}></div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>🎴 Pakli:</span>
                    <span style={{ color: deckSize < 10 ? '#ff4444' : 'var(--color-text-primary)', fontWeight: 'bold' }}>{deckSize}</span>
                </div>

                <div style={{ width: '1px', height: '24px', background: 'var(--color-border)' }}></div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span title="Atilla Kardja" style={{ filter: legaciesCollected.sword ? 'none' : 'grayscale(1) brightness(0.5)', fontSize: '1.5rem' }}>⚔️</span>
                    <span title="Turulpecsét" style={{ filter: legaciesCollected.seal ? 'none' : 'grayscale(1) brightness(0.5)', fontSize: '1.5rem' }}>🔏</span>
                    <span title="Arany Íj" style={{ filter: legaciesCollected.bow ? 'none' : 'grayscale(1) brightness(0.5)', fontSize: '1.5rem' }}>🏹</span>
                    <span title="Táltos Kehely" style={{ filter: legaciesCollected.chalice ? 'none' : 'grayscale(1) brightness(0.5)', fontSize: '1.5rem' }}>🏆</span>
                </div>
            </div>

            {/* Right Section - Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
                {canClaimLegacy && onClaimLegacy && (
                    <button
                        onClick={onClaimLegacy}
                        style={{
                            padding: '0.8rem 1.5rem',
                            background: 'var(--color-accent-gold)',
                            color: 'var(--color-bg-dark)',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        ÖRÖKSÉG MEGSZERZÉSE
                    </button>
                )}

                <button
                    onClick={onEndTurn}
                    style={{
                        padding: '0.8rem 1.5rem',
                        background: '#8b0000',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    KÖR VÉGE
                </button>
            </div>
        </div>
    );
};
