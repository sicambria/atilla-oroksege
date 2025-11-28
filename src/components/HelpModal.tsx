import React, { useState, useEffect } from 'react';
import { ROLES } from '../constants';

interface HelpModalProps {
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'navigation' | 'roles' | 'rules' | 'legend'>('navigation');

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const tabButtonStyle = (isActive: boolean) => ({
        padding: '0.75rem 1.5rem',
        background: isActive ? 'var(--color-accent-gold)' : 'transparent',
        color: isActive ? 'var(--color-bg-dark)' : 'var(--color-text-secondary)',
        border: '2px solid var(--color-accent-gold)',
        borderRadius: '8px 8px 0 0',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: 'all 0.2s'
    });

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
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div style={{
                maxWidth: '900px',
                width: '90%',
                maxHeight: '90vh',
                background: 'var(--color-bg-panel)',
                border: '3px solid var(--color-accent-gold)',
                borderRadius: '12px',
                boxShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
            }} onClick={(e) => e.stopPropagation()}>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-secondary)',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    ✕
                </button>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '1rem 1rem 0 1rem',
                    borderBottom: '2px solid var(--color-accent-gold)'
                }}>
                    <button onClick={() => setActiveTab('navigation')} style={tabButtonStyle(activeTab === 'navigation')}>
                        Navigáció
                    </button>
                    <button onClick={() => setActiveTab('roles')} style={tabButtonStyle(activeTab === 'roles')}>
                        Szerepek
                    </button>
                    <button onClick={() => setActiveTab('rules')} style={tabButtonStyle(activeTab === 'rules')}>
                        Szabályok
                    </button>
                    <button onClick={() => setActiveTab('legend')} style={tabButtonStyle(activeTab === 'legend')}>
                        Jelmagyarázat
                    </button>
                </div>

                {/* Tab Content */}
                <div style={{
                    padding: '2rem',
                    overflowY: 'auto',
                    flexGrow: 1,
                    color: 'var(--color-text-primary)'
                }}>
                    {activeTab === 'navigation' && (
                        <div>
                            <h2 style={{ color: 'var(--color-accent-gold)', marginTop: 0 }}>Navigáció és Irányítás</h2>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.2rem' }}>Térkép Navigáció</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li><strong>Nagyítás/Kicsinyítés:</strong> Egérgörgő vagy a jobb alsó sarokban lévő +/- gombok</li>
                                <li><strong>Térkép mozgatása:</strong> Kattints és húzd az egérrel</li>
                                <li><strong>Alaphelyzet:</strong> Indításkor a térkép az egész birodalmat mutatja</li>
                            </ul>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.2rem' }}>Mozgás</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li><strong>Szomszédos városba lépés:</strong> Kattints egy szomszédos városra (arany vonallal összekötve)</li>
                                <li><strong>Költség:</strong> 1 Akciópont városonként</li>
                                <li><strong>Korlátozás:</strong> Csak szomszédos városokba léphetsz</li>
                            </ul>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.2rem' }}>Fenyegetések Elhárítása</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li><strong>Fenyegetés kiválasztása:</strong> Kattints a város feletti piros fenyegetés ikonra</li>
                                <li><strong>Kártyák használata:</strong> Válaszd ki a megfelelő típusú kártyákat a kezedből</li>
                                <li><strong>Típusok:</strong> Minden fenyegetéshez meghatározott kártyatípus szükséges</li>
                            </ul>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.2rem' }}>Akciók</h3>
                            <p>Minden körben <strong>4 Akciópontod</strong> van. Használd őket bölcsen!</p>
                        </div>
                    )}

                    {activeTab === 'roles' && (
                        <div>
                            <h2 style={{ color: 'var(--color-accent-gold)', marginTop: 0 }}>Szerepek és Képességek</h2>

                            {Object.entries(ROLES).map(([key, role]) => (
                                <div key={key} style={{
                                    marginBottom: '2rem',
                                    padding: '1.5rem',
                                    background: 'var(--color-bg-dark)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <h3 style={{
                                        color: 'var(--color-accent-gold)',
                                        fontSize: '1.5rem',
                                        marginTop: 0,
                                        marginBottom: '0.5rem'
                                    }}>
                                        {role.name}
                                    </h3>
                                    <p style={{
                                        color: 'var(--color-text-secondary)',
                                        fontStyle: 'italic',
                                        marginTop: 0,
                                        marginBottom: '1rem'
                                    }}>
                                        {role.title}
                                    </p>
                                    <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                                        <strong>Különleges képesség:</strong> {role.description}
                                    </p>
                                    <div>
                                        <strong>Kezdő kártyák:</strong>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                                            {role.startHand.map((card, idx) => (
                                                <span key={idx} style={{
                                                    background: 'var(--color-bg-panel)',
                                                    border: '1px solid var(--color-accent-gold)',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '4px',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {card}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'rules' && (
                        <div>
                            <h2 style={{ color: 'var(--color-accent-gold)', marginTop: 0 }}>Játékszabályok</h2>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.3rem' }}>Cél</h3>
                            <p style={{ lineHeight: '1.8' }}>
                                Szerezzétek meg mind a <strong>4 Szent Örökséget</strong> (Atilla Kardja, Turulpecsét, Arany Íj, Táltos Kehely)
                                mielőtt a birodalom összeomlana!
                            </p>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.3rem' }}>Győzelmi Feltételek</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li><strong>Szent Örökségek Megszerzése:</strong> Gyűjts össze <strong>5 kártyát</strong> a kezedben, majd menj el a megfelelő <strong>Szent Helyre</strong> és költs el <strong>1 akciópontot</strong>. Helyszínek: <strong>Kard (Szombathely)</strong>, <strong>Pecsét (Kubán)</strong>, <strong>Íj (Dnyeszter)</strong>, <strong>Kehely (Partiskum)</strong>.</li>
                                <li><strong>Túlélés:</strong> A birodalomnak nem szabad összeomlania a küldetés alatt.</li>
                            </ul>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.3rem' }}>Vereségi Feltételek</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li><strong>Birodalom Összeomlása:</strong> Ha 30 vagy több fenyegetés van egyszerre a táblán.</li>
                                <li><strong>Főváros Eleste:</strong> Ha Etilben (a fővárosban) 3 fenyegetés gyűlik össze (Lázadás tör ki).</li>
                                <li><strong>Túl Sok Lázadás:</strong> Ha 5 vagy több város elveszik (Lázadás miatt lezárul).</li>
                                <li><strong>Idő Lejárta (A Végzet Órája):</strong> A játékosoknak korlátozott idejük van! Ha a <strong>Húzópakli elfogy</strong>, és még nem szereztétek meg az összes Örökséget, a birodalom sorsa megpecsételődik, és a <strong>játéknak azonnal vége</strong> (Vereség). Ne vesztegessétek a köröket!</li>
                            </ul>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.3rem' }}>Kör Menete</h3>
                            <ol style={{ lineHeight: '1.8' }}>
                                <li><strong>Akciók (4 pont):</strong> Mozgás, fenyegetés elhárítása, kártya átadása, Örökség megszerzése</li>
                                <li><strong>Kör vége:</strong> Új fenyegetések megjelenése</li>
                                <li><strong>Kártyahúzás:</strong> Feltöltés 2 kártyával</li>
                                <li><strong>Következő játékos</strong></li>
                            </ol>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.3rem' }}>Különleges Szabályok</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li><strong>Nimród Ünnepe:</strong> Ha minden játékos ugyanabban a városban van, bónusz akciót kaptok</li>
                                <li><strong>Atilla Szelleme:</strong> Ha a Fővárosban (Etil) <strong>2 vagy több fenyegetés</strong> van, a birodalom vészhelyzetbe kerül. Ilyenkor minden játékos <strong>Különleges Képessége</strong> felerősödik (pl. dupla sebzés, ingyen mozgás), hogy megvédhessétek a központot.</li>
                                <li><strong>Láncreakció:</strong> 3 fenyegetés egy városban → Lázadás → Fenyegetések terjednek</li>
                            </ul>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.3rem' }}>Nehézségi Szintek</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li><strong>Kezdő:</strong> Nincs kezdő fenyegetés, 2 vihar kártya a pakliban, 1 krízis kártya. Ideális az első játékhoz.</li>
                                <li><strong>Normál:</strong> 2 kezdő fenyegetés, 3 vihar kártya, 1 krízis kártya. Kiegyensúlyozott kihívás tapasztalt játékosoknak.</li>
                                <li><strong>Mester:</strong> 4 kezdő fenyegetés, 4 vihar kártya, 2 krízis kártya. Komoly stratégiát és koordinációt igényel.</li>
                                <li><strong>Legendás:</strong> 8 kezdő fenyegetés, 6 vihar kártya, 3 krízis kártya. Csak a legjobbak számára - Isten ostora!</li>
                            </ul>
                            <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                                <strong>Vihar kártyák:</strong> Amikor vihar kártyát húzol, a fenyegetések eszkalálódnak. Minden 4. vihar után egyre több fenyegetés jelenik meg köröként.
                            </p>

                            <h3 style={{ color: 'var(--color-accent-gold)', fontSize: '1.3rem' }}>Tippek</h3>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li>Kommunikáljatok és tervezzetek együtt!</li>
                                <li>Osszátok meg a kártyákat stratégiailag</li>
                                <li>Figyeljetek a fenyegetések típusaira</li>
                                <li>Ne hagyjátok, hogy 3 fenyegetés gyűljön össze egy városban</li>
                            </ul>
                        </div>
                    )}

                    {activeTab === 'legend' && (
                        <div>
                            <h2 style={{ color: 'var(--color-accent-gold)', marginTop: 0 }}>Jelmagyarázat</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ color: 'var(--color-accent-gold)' }}>Fenyegetések</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#daa520', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</div>
                                            <div>
                                                <strong>Belső Viszály</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Elhárítás: Diplomácia kártya</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#8b0000', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚔️</div>
                                            <div>
                                                <strong>Külső Támadás</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Elhárítás: Hadsereg kártya</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#daa520', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🌾</div>
                                            <div>
                                                <strong>Rossz Termés</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Elhárítás: Ellátmány kártya</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#daa520', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💀</div>
                                            <div>
                                                <strong>Járvány</strong>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Elhárítás: Gyógyítás kártya</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ color: 'var(--color-accent-gold)' }}>Térkép Ikonok</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4682b4', border: '2px solid white', boxShadow: '0 0 5px #4682b4' }}></div>
                                            <div><strong>Játékos</strong> - A te hősöd és társaid</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#4682b4', border: '2px solid white', boxShadow: '0 0 0 4px rgba(255, 215, 0, 0.6)' }}></div>
                                            <div><strong>Aktív Játékos</strong> - Te következel!</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'radial-gradient(circle, #ffd700, var(--color-bg-dark))', border: '2px solid #ffd700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👑</div>
                                            <div><strong>Főváros (Etil)</strong> - Védjétek meg minden áron!</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'radial-gradient(circle, #8b0000, var(--color-bg-dark))', border: '2px solid #8b0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
                                            <div><strong>Elveszett Város</strong> - Lázadás tört ki, nem léphettek ide</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Links */}
                <div style={{
                    padding: '1rem',
                    borderTop: '1px solid var(--color-accent-gold)',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '2rem',
                    background: 'var(--color-bg-dark)',
                    borderRadius: '0 0 9px 9px'
                }}>
                    <a
                        href="https://github.com/sicambria/atilla-oroksege"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--color-text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent-gold)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    >
                        Szeretettel ❤️ GitHub
                    </a>
                    <a
                        href="https://osiorokseg.hu/atilla/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--color-text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent-gold)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    >
                        🌐 osiorokseg.hu/atilla
                    </a>
                </div>
            </div>
        </div>
    );
};
