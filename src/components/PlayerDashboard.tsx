import React from 'react';
import type { Player } from '../types';

import { ROLES } from '../constants';
import { Sword, Shield, Zap, Heart, Scroll, Scale } from 'lucide-react';

interface PlayerDashboardProps {
    player: Player;
    isActive: boolean;
    onPlayCard: (cardId: string) => void;
    onGiveCard: (targetId: string, cardId: string) => void;
    availableTargets: Player[];
}

const RoleIcon = ({ role }: { role: string }) => {
    switch (role) {
        case 'Ellák': return <Zap color="var(--color-accent-gold)" />;
        case 'Aranka': return <Heart color="var(--color-accent-gold)" />;
        case 'Baján': return <Scale color="var(--color-accent-gold)" />;
        case 'Réka': return <Scroll color="var(--color-accent-gold)" />;
        case 'Dengizik': return <Shield color="var(--color-accent-gold)" />;
        case 'Onegeszius': return <Sword color="var(--color-accent-gold)" />;
        default: return <Shield />;
    }
};

export const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ player, isActive, onPlayCard, onGiveCard, availableTargets }) => {
    const roleInfo = Object.values(ROLES).find(r => r.name === player.role);

    return (
        <div className={`player-dashboard ornate-frame ${isActive ? 'active' : ''}`} style={{
            padding: '1rem',
            opacity: isActive ? 1 : 0.8,
            transition: 'opacity 0.3s'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'var(--color-bg-panel)', padding: '0.5rem', borderRadius: '50%' }}>
                    <RoleIcon role={player.role} />
                </div>
                <div>
                    <h3 style={{ margin: 0 }}>{player.name}</h3>
                    <div style={{ fontSize: '0.9rem', color: '#a89c90' }}>{roleInfo?.title}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent-gold)' }}>
                        {player.actionsRemaining} AP
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>Akciópont</div>
                </div>
            </div>

            <div className="hand" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {player.hand.length === 0 && <div style={{ color: '#5c4d42', fontStyle: 'italic' }}>Nincs kártya a kézben</div>}
                {player.hand.map(card => (
                    <div
                        key={card.id}
                        className="card-mini"
                        style={{
                            minWidth: '100px',
                            height: 'auto',
                            minHeight: '140px',
                            background: '#3d3430',
                            border: '1px solid #5c4d42',
                            borderRadius: '4px',
                            padding: '0.5rem',
                            fontSize: '0.8rem',
                            cursor: isActive ? 'pointer' : 'default',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '0.5rem'
                        }}
                        onClick={() => isActive && onPlayCard(card.id)}
                    >
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#e8dcc0' }}>{card.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#a89c90' }}>{card.subType}</div>
                        </div>

                        {isActive && availableTargets.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }} onClick={e => e.stopPropagation()}>
                                {availableTargets.map(target => (
                                    <button
                                        key={target.id}
                                        onClick={() => onGiveCard(target.id, card.id)}
                                        style={{
                                            background: 'var(--color-accent-gold)',
                                            color: 'black',
                                            border: 'none',
                                            borderRadius: '3px',
                                            padding: '0.25rem',
                                            fontSize: '0.7rem',
                                            cursor: 'pointer',
                                            fontWeight: 'bold'
                                        }}
                                        title={`Átadás neki: ${target.name}`}
                                    >
                                        ➜ {target.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
