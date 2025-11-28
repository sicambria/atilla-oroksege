export type RegionName =
  | 'Pannónia'
  | 'Szkítia'
  | 'Alánföld'
  | 'Jazygföld'
  | 'Bolgárföld'
  | 'Gepidaföld'
  | 'Dákia'
  | 'Mözia'
  | 'Atilla Udvara'
  | 'Turán-alföld'
  | 'Mongólia'
  | 'Ujgur Tartomány';

export type CityName = string;

export type ThreatCategory = 'Internal' | 'External';

export type ThreatType =
  | 'Rossz termés'
  | 'Rablóbanda'
  | 'Járvány'
  | 'Belviszály'
  | 'Nomád támadás'
  | 'Római intrika'
  | 'Germán felkelés'
  | 'Perzsa portyázók';

export type CrisisType = 'Nagy éhínség' | 'Fekete halál' | 'Birodalom felbomlása';

export type BlessingType = 'Nimród áldása' | 'Turul látomása' | 'Üstengri kegyelme' | 'Ősök tanácsa' | 'Táltos gyógyítás';

export type CardType = 'Action' | 'Threat' | 'Storm' | 'Blessing' | 'Crisis';

export type CardSubType = 'Harci' | 'Védelmi' | 'Kereskedelem' | 'Gyógyítás' | 'Diplomácia' | 'Lovas' | 'Szertartás' | 'Stratégia';

export type Difficulty = 'beginner' | 'normal' | 'master' | 'legendary';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  description: string;
  subType?: CardSubType;
  targetCity?: CityName;
  cost?: number;
  threatType?: ThreatType; // For Threat cards
  crisisType?: CrisisType; // For Crisis cards
  blessingType?: BlessingType; // For Blessing cards
}

export interface City {
  name: CityName;
  region: RegionName;
  neighbors: CityName[];
  threats: ThreatType[];
  isLost: boolean;
  hasCapital?: boolean;
  isLegacyLocation?: boolean;
}

export interface Player {
  id: string;
  name: string;
  role: 'Ellák' | 'Aranka' | 'Baján' | 'Réka' | 'Dengizik' | 'Onegeszius';
  currentCity: CityName;
  lastCity?: CityName;
  hand: Card[];
  actionsRemaining: number;
  specialAbilityUsed: boolean;
}

export interface GameState {
  cities: Record<CityName, City>;
  players: Player[];
  activePlayerIndex: number;
  actionDeck: Card[];
  actionDiscard: Card[];
  threatDeck: Card[];
  threatDiscard: Card[];
  stormCount: number;
  outbreakCount: number;
  legaciesCollected: {
    sword: boolean;
    seal: boolean;
    bow: boolean;
    chalice: boolean;
  };
  gameStatus: 'playing' | 'won' | 'lost';
  turnPhase: 'action' | 'threat' | 'replenish';
  messages: string[];
  tutorialStep: number; // Added for Tutorial
}
