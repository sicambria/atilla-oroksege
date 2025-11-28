import type {
    GameState,
    City,
    Card,
    Player,
    CityName,
    CardSubType,
    ThreatType
} from '../types';
import { CITIES, ADJACENCY, ROLES, THREAT_DETAILS, CRISIS_CARDS, BLESSING_CARDS } from '../constants';

const ACTION_SUBTYPES: CardSubType[] = ['Harci', 'Védelmi', 'Kereskedelem', 'Gyógyítás', 'Diplomácia', 'Lovas', 'Szertartás', 'Stratégia'];

const createDeck = (stormCount: number): Card[] => {
    // Standard Action Cards
    const actions = Array.from({ length: 60 }, (_, i) => {
        const subType = ACTION_SUBTYPES[i % ACTION_SUBTYPES.length];
        return {
            id: `action-${i}`,
            name: `${subType} Kártya`,
            type: 'Action' as const,
            description: `Használható ${subType} típusú fenyegetések ellen.`,
            subType
        };
    });

    // Storm Cards
    const storms = Array.from({ length: stormCount }, (_, i) => ({
        id: `storm-${i}`,
        name: 'Vihar',
        type: 'Storm' as const,
        description: 'Eszkaláció! Új fenyegetések jelennek meg.',
    }));

    // Blessing Cards (Rare)
    const blessings = BLESSING_CARDS.map((b, i) => ({
        id: `blessing-${i}`,
        name: b.type,
        type: 'Blessing' as const,
        description: b.description,
        blessingType: b.type
    }));

    return [...actions, ...storms, ...blessings].sort(() => Math.random() - 0.5);
};

const createThreatDeck = (difficulty: string): Card[] => {
    const cityNames = Object.keys(CITIES);
    const threatTypes = Object.keys(THREAT_DETAILS) as ThreatType[];

    // Standard Threats
    const threats = Array.from({ length: 40 }, (_, i) => ({
        id: `threat-${i}`,
        name: 'Fenyegetés',
        type: 'Threat' as const,
        description: 'Új veszély a birodalomban.',
        targetCity: cityNames[i % cityNames.length],
        threatType: threatTypes[i % threatTypes.length]
    }));

    // Crisis Cards (based on difficulty)
    let crisisCount = 1;
    if (difficulty === 'master') crisisCount = 2;
    if (difficulty === 'legendary') crisisCount = 3;

    const crises = Array.from({ length: crisisCount }, (_, i) => {
        const crisis = CRISIS_CARDS[i % CRISIS_CARDS.length];
        return {
            id: `crisis-${i}`,
            name: crisis.type,
            type: 'Crisis' as const,
            description: crisis.description,
            crisisType: crisis.type
        };
    });

    return [...threats, ...crises].sort(() => Math.random() - 0.5);
};

export const getInitialState = (playerCount: number = 4, difficulty: string = 'normal'): GameState => {
    const cities: Record<CityName, City> = {} as Record<CityName, City>;

    Object.entries(CITIES).forEach(([name, data]) => {
        cities[name] = {
            name,
            region: data.region,
            neighbors: ADJACENCY[name] || [],
            threats: [],
            isLost: false,
            hasCapital: name === 'Etil',
            isLegacyLocation: false
        };
    });

    // Difficulty Modifiers
    let initialThreats = 0;
    let stormCards = 2;

    switch (difficulty) {
        case 'beginner':
            stormCards = 2;
            initialThreats = 0;
            break;
        case 'normal':
            stormCards = 3;
            initialThreats = 2;
            break;
        case 'master':
            stormCards = 4;
            initialThreats = 4;
            break;
        case 'legendary':
            stormCards = 6;
            initialThreats = 8;
            break;
    }

    // Place initial threats
    const cityNames = Object.keys(cities);
    const threatTypes = Object.keys(THREAT_DETAILS) as ThreatType[];

    for (let i = 0; i < initialThreats; i++) {
        const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)];
        const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
        cities[randomCity].threats.push(randomThreat);
    }

    // Helper to create starting cards
    const createStartingCard = (name: string, idPrefix: string): Card => {
        let subType: CardSubType = 'Harci';
        if (name.includes('Lovas')) subType = 'Lovas';
        else if (name.includes('szertartás')) subType = 'Szertartás';
        else if (name.includes('Kereskedelem')) subType = 'Kereskedelem';
        else if (name.includes('Gyógyító')) subType = 'Gyógyítás';
        else if (name.includes('Tanácsadás')) subType = 'Diplomácia';
        else if (name.includes('védelem')) subType = 'Védelmi';
        else if (name.includes('Stratégia')) subType = 'Stratégia';

        return {
            id: `${idPrefix}-${Math.random().toString(36).substr(2, 9)}`,
            name: name,
            type: 'Action',
            description: `Kezdő kártya (${subType})`,
            subType: subType
        };
    };

    // Initialize players
    const roleKeys = Object.keys(ROLES) as (keyof typeof ROLES)[];
    const players: Player[] = Array.from({ length: playerCount }, (_, i) => {
        const roleKey = roleKeys[i % roleKeys.length];
        const role = ROLES[roleKey];

        const startingHand = role.startHand.map((cardName, idx) =>
            createStartingCard(cardName, `start-${i}-${idx}`)
        );

        return {
            id: `player-${i}`,
            name: role.name,
            role: role.name as any,
            currentCity: 'Etil',
            hand: startingHand,
            actionsRemaining: 4,
            specialAbilityUsed: false
        };
    });

    return {
        cities,
        players,
        activePlayerIndex: 0,
        actionDeck: createDeck(stormCards),
        actionDiscard: [],
        threatDeck: createThreatDeck(difficulty),
        threatDiscard: [],
        stormCount: 0,
        outbreakCount: 0,
        legaciesCollected: {
            sword: false,
            seal: false,
            bow: false,
            chalice: false
        },
        gameStatus: 'playing',
        turnPhase: 'action',
        messages: [`Játék kezdődik! Nehézség: ${difficulty.toUpperCase()}`],
        tutorialStep: 0
    };
};
