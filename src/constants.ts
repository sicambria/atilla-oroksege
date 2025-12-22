import type { RegionName, CityName, ThreatType, CardSubType, CrisisType, BlessingType } from './types';

export const REGIONS: RegionName[] = [
    'Pannónia', 'Szkítia', 'Alánföld', 'Jazygföld', 'Bolgárföld', 'Gepidaföld', 'Dákia', 'Mözia', 'Atilla Udvara',
    'Turán-alföld', 'Mongólia', 'Ujgur Tartomány'
];

// Define Cities and their Regions
export const CITIES: Record<CityName, { region: RegionName; x: number; y: number }> = {
    // Row 1 (y: ~20%) - Northern cities
    'Dnyeszter': { region: 'Szkítia', x: 17, y: 20 },
    'Kolozsvár': { region: 'Dákia', x: 33, y: 17 },
    'Várhely': { region: 'Dákia', x: 40, y: 19 },
    'Kasgár': { region: 'Ujgur Tartomány', x: 63, y: 18 },
    'Kobdo': { region: 'Mongólia', x: 72, y: 20 },
    'Karakorum': { region: 'Mongólia', x: 84, y: 17 },

    // Row 2 (y: ~40%) - North-Central cities
    'Szombathely': { region: 'Pannónia', x: 14, y: 38 },
    'Gyulafehérvár': { region: 'Dákia', x: 31, y: 34 },
    'Boriszténész': { region: 'Szkítia', x: 45, y: 37 },
    'Buhara': { region: 'Turán-alföld', x: 59, y: 36 },
    'Turfán': { region: 'Ujgur Tartomány', x: 75, y: 39 },
    'Ordosz': { region: 'Mongólia', x: 87, y: 35 },

    // Row 3 (y: ~60%) - South-Central cities (including capital)
    'Buda': { region: 'Pannónia', x: 25, y: 47 },
    'Szerém': { region: 'Gepidaföld', x: 28, y: 57 },
    'Etil': { region: 'Atilla Udvara', x: 40, y: 56 },
    'Don': { region: 'Alánföld', x: 55, y: 48 },
    'Szamarkand': { region: 'Turán-alföld', x: 79, y: 55 },
    'Kubán': { region: 'Alánföld', x: 83, y: 67 },

    // Row 4 (y: ~80%) - Southern cities
    'Pécs': { region: 'Pannónia', x: 10, y: 72 },
    'Szeged': { region: 'Jazygföld', x: 26, y: 78 },
    'Nándorfehérvár': { region: 'Gepidaföld', x: 41, y: 79 },
    'Temesvár': { region: 'Mözia', x: 56, y: 77 },
    'Várna': { region: 'Bolgárföld', x: 67, y: 78 },
    'Ódesszosz': { region: 'Bolgárföld', x: 82, y: 80 },

    // Additional cities (slightly off-grid for better spacing)
    'Partiskum': { region: 'Jazygföld', x: 21, y: 68 },
    'Nikápoly': { region: 'Mözia', x: 60, y: 65 },
    'Aracsa': { region: 'Mözia', x: 70, y: 68 }

};

// Define Adjacency Graph
export const ADJACENCY: Record<CityName, CityName[]> = {
    'Etil': ['Buda', 'Szerém', 'Gyulafehérvár', 'Boriszténész', 'Don', 'Várna', 'Temesvár', 'Szeged', 'Szamarkand'],

    // Pannónia
    'Buda': ['Etil', 'Szombathely', 'Pécs', 'Szerém'],
    'Szombathely': ['Buda', 'Pécs'],
    'Pécs': ['Buda', 'Szombathely', 'Szeged', 'Szerém'],

    // Gepidaföld
    'Szerém': ['Etil', 'Buda', 'Pécs', 'Nándorfehérvár'],
    'Nándorfehérvár': ['Szerém', 'Temesvár'],

    // Dákia
    'Gyulafehérvár': ['Etil', 'Kolozsvár', 'Várhely', 'Boriszténész'],
    'Kolozsvár': ['Gyulafehérvár', 'Várhely'],
    'Várhely': ['Gyulafehérvár', 'Kolozsvár', 'Temesvár'],

    // Szkítia
    'Boriszténész': ['Etil', 'Dnyeszter', 'Gyulafehérvár', 'Don'],
    'Dnyeszter': ['Boriszténész'],

    // Alánföld
    'Don': ['Etil', 'Boriszténész', 'Kubán', 'Szamarkand', 'Karakorum'],
    'Kubán': ['Don', 'Várna', 'Szamarkand'],

    // Bolgárföld
    'Várna': ['Etil', 'Kubán', 'Ódesszosz', 'Nikápoly'],
    'Ódesszosz': ['Várna'],

    // Mözia
    'Temesvár': ['Etil', 'Nándorfehérvár', 'Aracsa', 'Várhely', 'Nikápoly'],
    'Aracsa': ['Temesvár', 'Nikápoly'],
    'Nikápoly': ['Temesvár', 'Aracsa', 'Várna'],

    // Jazygföld
    'Szeged': ['Etil', 'Pécs', 'Partiskum'],
    'Partiskum': ['Szeged', 'Temesvár'],

    // Turán-alföld
    'Szamarkand': ['Etil', 'Don', 'Kubán', 'Buhara', 'Karakorum', 'Turfán'],
    'Buhara': ['Szamarkand', 'Turfán'],

    // Mongólia
    'Karakorum': ['Szamarkand', 'Ordosz', 'Turfán'],
    'Ordosz': ['Karakorum', 'Kobdo'],
    'Kobdo': ['Ordosz', 'Kasgár'],

    // Ujgur Tartomány
    'Turfán': ['Buhara', 'Karakorum', 'Kasgár'],
    'Kasgár': ['Turfán', 'Kobdo']
};

export const THREAT_DETAILS: Record<ThreatType, { type: 'Internal' | 'External'; counter: CardSubType; amount: number; color: string }> = {
    'Rossz termés': { type: 'Internal', counter: 'Kereskedelem', amount: 2, color: '#e67e22' },
    'Rablóbanda': { type: 'Internal', counter: 'Harci', amount: 2, color: '#7f8c8d' },
    'Járvány': { type: 'Internal', counter: 'Gyógyítás', amount: 3, color: '#27ae60' },
    'Belviszály': { type: 'Internal', counter: 'Diplomácia', amount: 4, color: '#9b59b6' },
    'Nomád támadás': { type: 'External', counter: 'Védelmi', amount: 3, color: '#e74c3c' },
    'Római intrika': { type: 'External', counter: 'Diplomácia', amount: 3, color: '#2980b9' },
    'Germán felkelés': { type: 'External', counter: 'Harci', amount: 4, color: '#d35400' },
    'Perzsa portyázók': { type: 'External', counter: 'Lovas', amount: 3, color: '#16a085' }
};

export const CRISIS_CARDS: { type: CrisisType; description: string }[] = [
    { type: 'Nagy éhínség', description: '2 tartományban azonnal megjelenik egy Rossz termés.' },
    { type: 'Fekete halál', description: 'Húzz 3 további Fenyegetést azonnal.' },
    { type: 'Birodalom felbomlása', description: 'Minden tartományban +1 Fenyegetés.' }
];

export const BLESSING_CARDS: { type: BlessingType; description: string }[] = [
    { type: 'Nimród áldása', description: 'Eltávolíthatsz 2 Fenyegetést azonnal.' },
    { type: 'Turul látomása', description: 'Nézd meg a következő 5 Fenyegetés kártyát, 2-t tegyél a pakli aljára.' },
    { type: 'Üstengri kegyelme', description: 'Minden játékos húz 2 kártyát.' },
    { type: 'Ősök tanácsa', description: '1 elveszett tartomány visszaszerzése ingyen.' },
    { type: 'Táltos gyógyítás', description: 'Minden Járvány eltávolítása a tábláról.' }
];

export const ROLES = {
    Ellak: {
        name: 'Ellák',
        title: 'Atilla legidősebb fia',
        symbol: 'Villámnyíl',
        description: 'Atilla elsőszülött fia, aki apja tüzét és villámgyors döntéshozatalát örökölte. Ellák sosem habozik, amikor cselekedni kell - a birodalom minden sarkában ismerik lendületes természetét és páratlan lovasságát. Különleges képessége: Körönként egyszer ingyen mozoghat egy szomszédos városba, mintha a szél szárnyán repülne.',
        startHand: ['Lovasroham', 'Lovasroham']
    },
    Aranka: {
        name: 'Aranka',
        title: 'A Táltos Gyógyító',
        symbol: 'Világfa',
        description: 'Az ősi tudás őrzője, aki a Világfa gyökerei között tanulta a gyógyítás titkait. Aranka keze alatt a legmélyebb sebek is begyógyulnak, és ahol megfordul, ott remény virágzik a kétségbeesés helyén. A nép "Életadónak" hívja, mert képes visszahozni az életet a halál küszöbéről. Különleges képessége: Gyógyítás kártyáit dupla erővel használhatja - egy kártya kettőt ér.',
        startHand: ['Gyógyító rítus', 'Gyógyító rítus']
    },
    Bajan: {
        name: 'Baján',
        title: 'A Bölcs Tanácsos',
        symbol: 'Aranymérleg',
        description: 'Évtizedeken át szolgálta Atillát tanácsadóként, és senki sem ismeri jobban a diplomácia finom szálait nála. Baján szavai aranyat érnek - egy jól időzített tanácsa képes megfordítani a legkilátástalanabb helyzeteket is. A birodalom minden népének nyelvét beszéli, és minden kultúrájukat tiszteli. Különleges képessége: Diplomácia kártyáit bármilyen fenyegetés ellen felhasználhatja, mert a szavak erősebbek a kardoknál.',
        startHand: ['Kereskedelem', 'Kereskedelem']
    },
    Reka: {
        name: 'Réka',
        title: 'A Történetmesélő',
        symbol: 'Fonott kötél',
        description: 'Réka emlékezete élő krónika - minden történetet, minden legendát ismer, amely a hun nép dicsőségéről szól. Szavai összekötik a múltat a jelennel, és történetei erőt adnak a leggyengébb pillanatokban is. Amikor mesél, még az ellenségek is megállnak hallgatni. Különleges képessége: Kártyákat adhat át más játékosoknak távolról is, mert szavai áthidalják a távolságot.',
        startHand: ['Tanácsadás', 'Tanácsadás']
    },
    Dengizik: {
        name: 'Dengizik',
        title: 'A Harcedzett Vezér',
        symbol: 'Pajzs',
        description: 'Atilla leghűségesebb hadvezére, aki minden csatában az első sorban harcolt. Dengizik pajzsa még sosem tört össze, és ahol ő áll, ott a védelem áthatolhatatlan. A katonák vakon követik, mert tudják: amíg Dengizik él, addig van remény. Különleges képessége: Védelmi kártyáit dupla erővel használhatja - egy pajzs kettőt ér a csatában.',
        startHand: ['Határvédelem', 'Határvédelem']
    },
    Onegeszius: {
        name: 'Onegeszius',
        title: 'A Harcos Költő',
        symbol: 'Pergamen',
        description: 'Ritka kombináció: egyszerre briliáns stratéga és érzékeny lélek. Onegeszius nappal harcol, éjjel pedig verseket ír a hősökről és az elveszett szerelmekről. Tudja, hogy a birodalom nemcsak kardokkal, hanem kultúrával is fennmarad. Különleges képessége: Láthatja a pakli tetején lévő 2 kártyát, mert aki ismeri a múltat, az látja a jövőt is.',
        startHand: ['Stratégiai terv', 'Stratégiai terv']
    },
};


export const INITIAL_THREAT_LIMIT = 3;
export const MAX_THREATS_ON_BOARD = 30;
export const MAX_LOST_CITIES = 5;

export const LEGACY_LOCATIONS: Record<string, CityName> = {
    sword: 'Szombathely',
    seal: 'Kubán',
    bow: 'Dnyeszter',
    chalice: 'Partiskum'
};
