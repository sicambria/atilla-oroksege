import React from 'react';

interface TutorialOverlayProps {
    step: number;
    onNext: () => void;
    onSkip: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ step, onNext, onSkip }) => {
    const steps = [
        {
            title: "Üdvözöllek, Vezér!",
            text: "A birodalom veszélyben van. Ez a térkép mutatja Atilla örökségét. A feladatod megvédeni a városokat és összegyűjteni a szent ereklyéket.",
            position: { top: '20%', left: '50%', transform: 'translateX(-50%)' }
        },
        {
            title: "Szent Örökségek",
            text: "Gyűjts össze 5 kártyát, majd menj a megfelelő városba: Kard (Szombathely), Pecsét (Kubán), Íj (Dnyeszter), Kehely (Partiskum). Ott 1 akciópontért megszerezheted!",
            position: { top: '20%', left: '50%', transform: 'translateX(-50%)' }
        },
        {
            title: "Navigáció",
            text: "Használd az egérgörgőt a nagyításhoz/kicsinyítéshez. Kattints és húzd a térképet a mozgatáshoz. A bal felső sarokban találod a zoom gombokat is.",
            position: { top: '30%', left: '50%', transform: 'translateX(-50%)' }
        },
        {
            title: "Mozgás",
            text: "Kattints egy szomszédos városra (vonalakkal összekötve), hogy odalépj. Ez 1 Akciópontba kerül.",
            position: { top: '40%', left: '40%' }
        },
        {
            title: "Fenyegetések",
            text: "A piros körök jelzik a veszélyt. Ha egy városban 3 fenyegetés gyűlik össze, a város fellázad! Használd a kártyáidat a fenyegetések elhárítására.",
            position: { top: '30%', right: '20%' }
        },
        {
            title: "Akciók és Kártyák",
            text: "Itt látod a kezedben lévő kártyákat és a megmaradt akciópontjaidat. Minden körben 4 akciót hajthatsz végre.",
            position: { bottom: '150px', right: '20px' }
        },
        {
            title: "Kártyacsere",
            text: "Ha egy városban vagy társaddal, átadhatsz neki kártyát (1 AP). Réka bárhová küldhet kártyát! Kattints a kártyán megjelenő gombra az átadáshoz.",
            position: { bottom: '150px', right: '20px' }
        },
        {
            title: "Kör Vége",
            text: "Ha végeztél, kattints a 'Kör Vége' gombra. De vigyázz: ilyenkor új fenyegetések jelennek meg!",
            position: { bottom: '100px', left: '50%', transform: 'translateX(-50%)' }
        }
    ];

    const currentStep = steps[step];

    if (!currentStep) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1000,
            pointerEvents: 'none' // Allow clicking through to see context, but overlay box captures clicks
        }}>
            {/* Darken background slightly to focus attention */}
            <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.4)',
                pointerEvents: 'auto'
            }} />

            <div className="ornate-frame" style={{
                position: 'absolute',
                ...currentStep.position,
                width: '400px',
                padding: '2rem',
                pointerEvents: 'auto',
                animation: 'fadeIn 0.5s'
            }}>
                <h2 style={{ color: 'var(--color-accent-gold)', marginTop: 0 }}>{currentStep.title}</h2>
                <p style={{ lineHeight: '1.6', fontSize: '1.1rem' }}>{currentStep.text}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                    <button
                        onClick={onSkip}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                    >
                        Kihagyás
                    </button>
                    <button
                        onClick={onNext}
                        style={{
                            background: 'var(--color-accent-gold)',
                            color: 'var(--color-bg-dark)',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        {step === steps.length - 1 ? 'Kezdés!' : 'Tovább'}
                    </button>
                </div>
            </div>
        </div>
    );
};
