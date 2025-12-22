
import React, { useState } from 'react';

interface MainMenuProps {
    onStartGame: (config: { playerCount: number; difficulty: string }) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
    const [showStory, setShowStory] = useState(false);
    const [playerCount, setPlayerCount] = useState(4);
    const [difficulty, setDifficulty] = useState('normal');

    const handleStart = () => {
        onStartGame({ playerCount, difficulty });
    };

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${import.meta.env.BASE_URL}tronterem.jpg")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-primary)',
            fontFamily: 'serif'
        }}>
            <h1 style={{
                fontSize: '5rem',
                marginBottom: '0.5rem',
                color: 'var(--color-accent-gold)',
                textShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
                textAlign: 'center'
            }}>
                ATILLA ÖRÖKSÉGE
            </h1>

            <h2 style={{
                fontSize: '1.5rem',
                color: '#e8dcc0',
                marginBottom: '3rem',
                fontWeight: 'normal',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
                Együttműködő stratégiai társasjáték
            </h2>

            <div style={{
                background: 'var(--color-bg-panel)',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                width: '400px',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                opacity: 0.95
            }}>

                {/* Player Count Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--color-accent-gold)', fontWeight: 'bold' }}>Játékosok száma: {playerCount}</label>
                    <input
                        type="range"
                        min="2"
                        max="6"
                        value={playerCount}
                        onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--color-accent-gold)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                        <span>2</span><span>6</span>
                    </div>
                </div>

                {/* Difficulty Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ color: 'var(--color-accent-gold)', fontWeight: 'bold' }}>Nehézségi szint:</label>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        style={{
                            padding: '0.5rem',
                            background: 'var(--color-bg-panel)',
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="beginner">Kezdő - Nincs kezdő fenyegetés, 2 vihar kártya</option>
                        <option value="normal">Normál - 2 kezdő fenyegetés, 3 vihar kártya</option>
                        <option value="master">Mester - 4 kezdő fenyegetés, 4 vihar kártya</option>
                        <option value="legendary">Legendás - 8 kezdő fenyegetés, 6 vihar kártya</option>
                    </select>
                </div>

                <button
                    onClick={handleStart}
                    style={{
                        padding: '1.2rem',
                        fontSize: '1.5rem',
                        background: 'rgba(139, 0, 0, 0.8)',
                        color: '#fff',
                        border: '2px solid var(--color-accent-gold)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        marginTop: '1rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Játék Indítása
                </button>

                <button
                    onClick={() => setShowStory(true)}
                    style={{
                        padding: '1rem',
                        fontSize: '1.1rem',
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
                >
                    Történet és Szabályok
                </button>

                {/* GitHub és Honlap linkek */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    alignItems: 'center'
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
                        ❤️-el készült, forrás: GitHub
                    </a>
                    <a
                        href="https://osiorokseg.hu/atilla/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: 'var(--color-text-secondary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            transition: 'color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-accent-gold)'}
                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                    >
                        🌐 osiorokseg.hu/atilla
                    </a>
                </div>
            </div>

            {showStory && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowStory(false)}>
                    <div style={{
                        width: '900px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        background: 'var(--color-bg-dark)',
                        border: '2px solid var(--color-accent-gold)',
                        padding: '3rem',
                        borderRadius: '8px',
                        position: 'relative',
                        boxShadow: '0 0 50px rgba(0,0,0,0.9)'
                    }} onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowStory(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-text-secondary)',
                                fontSize: '2rem',
                                cursor: 'pointer'
                            }}
                        >
                            ✕
                        </button>

                        <div className="story-content" style={{ lineHeight: '1.8', color: 'var(--color-text-primary)' }}>
                            <h2 style={{ color: 'var(--color-accent-gold)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginTop: 0 }}>BEVEZETŐ</h2>
                            <blockquote style={{ borderLeft: '4px solid var(--color-accent-gold)', paddingLeft: '1rem', fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                                "Én vagyok a magyarok legelső királya, utolsó világrészről én kihozója!"<br />
                                — Zrínyi Miklós: Atilla király
                            </blockquote>
                            <p><strong>Kr. u. 453. tavasz</strong></p>
                            <p>
                                A Nagy Folyó partján, Atilla király pompás sátrában gyertyák égnek. Az egyik legnagyobb uralkodó, akit a világ valaha látott, méltósággal lehelte ki lelkét.
                                A hatalmas kiterjedésű Hun Birodalom megreszket.
                            </p>
                            <p>
                                A fővárosban összegyűlt a Főurak Tanácsa. Hat Vezér ül a kerekasztal mellett. Előttük füstölög a szent tűz, az ősök szellemei figyelnek.
                                <strong> Nincs idő gyászra. A birodalom felbomlik, ha nem cselekszetek!</strong>
                            </p>
                            <p>
                                Belső viszályok törnek felszínre: rossz termés, rablóbandák, járványok. Kívülről a leigázott népek lázadnak, rómaiak intrikálnak.
                                <strong> Ti vagytok Atilla örökösei.</strong> Nem egy új királyt kell választanotok, hanem együtt kell megőriznetek azt, amit a nagykirály teremtett.
                            </p>

                            <h2 style={{ color: 'var(--color-accent-gold)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>A JÁTÉK CÉLJA</h2>
                            <p>A játékosok együttműködve védik meg Atilla örökségét. <strong>Közös győzelem vagy közös vereség.</strong></p>

                            <h3 style={{ color: 'var(--color-text-primary)' }}>GYŐZELMI FELTÉTELEK</h3>
                            <ul>
                                <li><strong>Négy Szent Örökség megszerzése:</strong> Atilla kardja, Turulpecsét, Arany íj, Táltos kehely.</li>
                                <li><strong>A Főváros (Atilla udvarhelye) védelmének fenntartása.</strong></li>
                                <li><strong>Legalább 4 tartomány uralmának megtartása a 6-ból.</strong></li>

                            </ul>

                            <h3 style={{ color: 'var(--color-text-primary)' }}>VERESÉGI FELTÉTELEK</h3>
                            <ul>
                                <li><strong>Három tartomány elvesztése</strong> (lázadás miatt).</li>
                                <li><strong>A Főváros elesése.</strong></li>
                                <li><strong>Nyolc Fenyegetés egyszerre a táblán.</strong></li>
                                <li><strong>A Viharkártya-pakli második kimerülése.</strong></li>
                            </ul>

                            <h2 style={{ color: 'var(--color-accent-gold)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>JÁTÉKMENET</h2>
                            <p>A játék körökre oszlik. Minden kör 4 fázisból áll:</p>
                            <ol>
                                <li><strong>Tanácskozás:</strong> Stratégia megbeszélése (kártyák konkrét megmutatása nélkül).</li>
                                <li><strong>Cselekvés:</strong> Minden játékos 4 akciót hajt végre:
                                    <ul>
                                        <li><strong>Utazás:</strong> 1 Útkártya eldobása (max 2/kör).</li>
                                        <li><strong>Fenyegetés elhárítása:</strong> Kártyák eldobása a fenyegetés típusának megfelelően.</li>
                                        <li><strong>Tudás átadása:</strong> Kártya átadása azonos helyen lévő játékosnak (1 akció).</li>
                                        <li><strong>Örökség megszerzése:</strong> 5 megfelelő kártya eldobása a megfelelő helyen.</li>
                                        <li><strong>Áldás kérése:</strong> 2 akció + 3 kártya (csak a Fővárosban).</li>
                                    </ul>
                                </li>
                                <li><strong>Fenyegetés:</strong> Új veszélyek megjelenése. Ha 3 fenyegetés gyűlik össze &rarr; LÁZADÁS.</li>
                                <li><strong>Feltöltés:</strong> Kártyahúzás (max 7 kézben).</li>
                            </ol>

                            <h2 style={{ color: 'var(--color-accent-gold)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginTop: '2rem' }}>NEHÉZSÉGI SZINTEK</h2>
                            <ul>
                                <li><strong>Kezdő:</strong> Nincs kezdő fenyegetés, 2 vihar kártya, 1 krízis. Ideális az első játékhoz.</li>
                                <li><strong>Normál:</strong> 2 kezdő fenyegetés, 3 vihar kártya, 1 krízis. Kiegyensúlyozott kihívás.</li>
                                <li><strong>Mester:</strong> 4 kezdő fenyegetés, 4 vihar kártya, 2 krízis. Komoly koordinációt igényel.</li>
                                <li><strong>Legendás:</strong> 8 kezdő fenyegetés, 6 vihar kártya, 3 krízis. Csak a legjobbaknak - Isten ostora!</li>
                            </ul>
                            <p style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
                                💡 <strong>Tipp:</strong> A vihar kártyák súlyosbítják a fenyegetéseket - minden 4. vihar után egyre több veszély jelenik meg!
                            </p>

                            <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                                <button
                                    onClick={() => setShowStory(false)}
                                    style={{
                                        padding: '1rem 3rem',
                                        background: 'var(--color-accent-gold)',
                                        color: 'var(--color-bg-dark)',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        fontSize: '1.2rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    VISSZA A MENÜBE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
