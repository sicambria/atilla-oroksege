import type { GameState, CityName } from '../types';
import { ADJACENCY, THREAT_DETAILS, MAX_THREATS_ON_BOARD } from '../constants';

export type Action =
    | { type: 'MOVE_PLAYER'; payload: { playerId: string; destination: CityName } }
    | { type: 'PLAY_CARD'; payload: { playerId: string; cardId: string } }
    | { type: 'DRAW_CARDS'; payload: { playerId: string; count: number } }
    | { type: 'END_TURN' }
    | { type: 'CLAIM_LEGACY'; payload: { playerId: string; legacyType: 'sword' | 'seal' | 'bow' | 'chalice' } }
    | { type: 'RESOLVE_THREAT'; payload: { city: CityName; threatIndex: number; cardIds: string[] } }
    | { type: 'GIVE_CARD'; payload: { playerId: string; targetPlayerId: string; cardId: string } }
    | { type: 'LOAD_GAME'; payload: GameState };

export const gameReducer = (state: GameState, action: Action): GameState => {
    switch (action.type) {
        case 'MOVE_PLAYER': {
            const { playerId, destination } = action.payload;
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            if (playerIndex === -1) return state;

            const player = state.players[playerIndex];
            const currentCity = player.currentCity;

            // 1. Strict Adjacency Check
            if (!ADJACENCY[currentCity].includes(destination)) {
                return {
                    ...state,
                    messages: [...state.messages, `Nem léphetsz oda! ${destination} nem szomszédos ${currentCity}-val.`]
                };
            }

            if (player.actionsRemaining < 1) return state;

            const newPlayers = [...state.players];
            newPlayers[playerIndex] = {
                ...player,
                currentCity: destination,
                lastCity: currentCity,
                actionsRemaining: player.actionsRemaining - 1
            };

            return {
                ...state,
                players: newPlayers,
                messages: [...state.messages, `${player.name} átlépett ide: ${destination}`]
            };
        }

        case 'RESOLVE_THREAT': {
            const { city, threatIndex, cardIds } = action.payload;
            const activePlayer = state.players[state.activePlayerIndex];
            const targetCity = state.cities[city];

            if (!targetCity || !targetCity.threats[threatIndex]) return state;

            const threat = targetCity.threats[threatIndex];
            const requiredCardType = THREAT_DETAILS[threat].counter;
            const requiredAmount = THREAT_DETAILS[threat].amount;

            // Validate player is in the city
            if (activePlayer.currentCity !== city) return state;

            // Validate cards
            const cardsToPlay = activePlayer.hand.filter(c => cardIds.includes(c.id));
            const validCards = cardsToPlay.filter(c => c.subType === requiredCardType);

            if (validCards.length < requiredAmount) {
                return {
                    ...state,
                    messages: [...state.messages, `Nincs elég ${requiredCardType} kártyád a fenyegetés elhárításához!`]
                };
            }

            // Remove threat and cards
            const newThreats = [...targetCity.threats];
            newThreats.splice(threatIndex, 1);

            const newHand = activePlayer.hand.filter(c => !cardIds.includes(c.id));
            const newDiscard = [...state.actionDiscard, ...cardsToPlay];

            const newPlayers = [...state.players];
            newPlayers[state.activePlayerIndex] = {
                ...activePlayer,
                hand: newHand,
                actionsRemaining: activePlayer.actionsRemaining - 1
            };

            const newCities = {
                ...state.cities,
                [city]: { ...targetCity, threats: newThreats }
            };

            return {
                ...state,
                cities: newCities,
                players: newPlayers,
                actionDiscard: newDiscard,
                messages: [...state.messages, `${activePlayer.name} elhárította: ${threat} (${city})`]
            };
        }

        case 'PLAY_CARD': {
            const { playerId, cardId } = action.payload;
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            const player = state.players[playerIndex];
            const card = player.hand.find(c => c.id === cardId);

            if (!card) return state;

            // Handle Blessing Cards
            if (card.type === 'Blessing') {
                let newState = { ...state };
                const newHand = player.hand.filter(c => c.id !== cardId);
                const newPlayers = [...state.players];
                newPlayers[playerIndex] = { ...player, hand: newHand };
                newState.players = newPlayers;
                newState.messages = [...state.messages, `${player.name} kijátszotta: ${card.name}`];

                // Implement Blessing Effects
                if (card.blessingType === 'Nimród áldása') {
                    // Remove 2 random threats
                    const cityNames = Object.keys(newState.cities);
                    let removed = 0;
                    for (const name of cityNames) {
                        if (removed >= 2) break;
                        if (newState.cities[name].threats.length > 0) {
                            newState.cities[name].threats.pop();
                            removed++;
                        }
                    }
                } else if (card.blessingType === 'Üstengri kegyelme') {
                    // Draw 2 cards for everyone
                    newState.players = newState.players.map(p => {
                        const drawn = newState.actionDeck.slice(0, 2);
                        newState.actionDeck = newState.actionDeck.slice(2);
                        return { ...p, hand: [...p.hand, ...drawn] };
                    });
                }
                else if (card.blessingType === 'Táltos gyógyítás') {
                    // Remove all 'Járvány'
                    Object.values(newState.cities).forEach(city => {
                        city.threats = city.threats.filter(t => t !== 'Járvány');
                    });
                }

                return newState;
            }

            return state; // Default play logic handled in RESOLVE_THREAT for now
        }

        case 'END_TURN': {
            let newState = { ...state };
            const activePlayer = newState.players[newState.activePlayerIndex];

            // 1. Draw 2 Action Cards
            const drawnCards = newState.actionDeck.slice(0, 2);
            newState.actionDeck = newState.actionDeck.slice(2);

            // Handle Storm Cards drawn
            const stormsDrawn = drawnCards.filter(c => c.type === 'Storm');
            const actionsDrawn = drawnCards.filter(c => c.type !== 'Storm');

            newState.stormCount += stormsDrawn.length;

            const newHand = [...activePlayer.hand, ...actionsDrawn];

            // Update player hand
            const newPlayers = [...newState.players];
            newPlayers[newState.activePlayerIndex] = {
                ...activePlayer,
                hand: newHand,
                actionsRemaining: 4, // Reset actions
                specialAbilityUsed: false
            };
            newState.players = newPlayers;

            // 2. Draw Threat Cards (Amount based on Storm level)
            const cardsToDraw = 1 + Math.floor(newState.stormCount / 4);
            const drawnThreats = newState.threatDeck.slice(0, cardsToDraw);
            newState.threatDeck = newState.threatDeck.slice(cardsToDraw);

            drawnThreats.forEach(card => {
                if (card.type === 'Crisis') {
                    newState.messages.push(`VÁLSÁG: ${card.name}! ${card.description}`);
                    // Implement Crisis Logic
                    if (card.crisisType === 'Birodalom felbomlása') {
                        // Add threat to 3-5 random cities instead of all
                        const cityNames = Object.keys(newState.cities);
                        const affectedCount = 3 + Math.floor(Math.random() * 3); // 3-5 cities
                        for (let i = 0; i < affectedCount; i++) {
                            const rnd = cityNames[Math.floor(Math.random() * cityNames.length)];
                            if (!newState.cities[rnd].isLost) {
                                newState.cities[rnd].threats.push('Belviszály');
                            }
                        }
                    } else if (card.crisisType === 'Nagy éhínség') {
                        // Add 'Rossz termés' to 2 random cities
                        const cityNames = Object.keys(newState.cities);
                        for (let i = 0; i < 2; i++) {
                            const rnd = cityNames[Math.floor(Math.random() * cityNames.length)];
                            newState.cities[rnd].threats.push('Rossz termés');
                        }
                    }
                } else if (card.targetCity && card.threatType) {
                    const city = newState.cities[card.targetCity];
                    if (!city.isLost) {
                        city.threats.push(card.threatType);
                        newState.messages.push(`Új fenyegetés: ${card.threatType} itt: ${city.name}`);

                        // Check Outbreak (3+ threats)
                        if (city.threats.length >= 3) {
                            newState.outbreakCount++;
                            newState.messages.push(`LÁZADÁS KITÖRT: ${city.name}!`);
                            // Chain Reaction Logic could go here
                        }
                    }
                }
            });

            // 3. Check Special Rules
            // Nimród Ünnepe: All players in same city
            const firstCity = newState.players[0].currentCity;
            const allTogether = newState.players.every(p => p.currentCity === firstCity);
            if (allTogether) {
                newState.messages.push("NIMRÓD ÜNNEPE! Az ősök megáldanak titeket.");
                // Draw a blessing card if available (simplified: just give random benefit)
                newState.players.forEach(p => p.actionsRemaining += 1); // Bonus action next turn
            }

            // 4. Check Loss Conditions
            const totalThreats = Object.values(newState.cities).reduce((sum, c) => sum + c.threats.length, 0);
            if (totalThreats >= MAX_THREATS_ON_BOARD) {
                newState.gameStatus = 'lost';
                newState.messages.push("A birodalom összeomlott a fenyegetések súlya alatt!");
            }

            // 5. Passive Threat Reduction (End of Round)
            if (newState.activePlayerIndex === newState.players.length - 1) {
                const occupiedCities = new Set(newState.players.map(p => p.currentCity));
                let reducedCount = 0;

                Object.entries(newState.cities).forEach(([cityName, city]) => {
                    if (occupiedCities.has(cityName as CityName) && city.threats.length > 0) {
                        city.threats.pop(); // Remove one threat
                        reducedCount++;
                    }
                });

                if (reducedCount > 0) {
                    newState.messages.push(`A hősök jelenléte ${reducedCount} fenyegetést hárított el a kör végén.`);
                }
            }

            // 6. Next Player
            newState.activePlayerIndex = (newState.activePlayerIndex + 1) % newState.players.length;

            return newState;
        }

        case 'CLAIM_LEGACY': {
            const { legacyType } = action.payload;

            // Magyar örökség nevek
            const legacyNames: Record<string, string> = {
                sword: 'Atilla Kardja',
                seal: 'Turulpecsét',
                bow: 'Arany Íj',
                chalice: 'Táltos Kehely'
            };

            const legacyName = legacyNames[legacyType] || legacyType;

            const newLegaciesCollected = {
                ...state.legaciesCollected,
                [legacyType]: true
            };

            const allCollected = Object.values(newLegaciesCollected).every(collected => collected);
            const newGameStatus = allCollected ? 'won' : state.gameStatus;
            const victoryMessage = allCollected ? 'MINDEN SZENT ÖRÖKSÉGET MEGSZEREZTETEK! GYŐZELEM!' : `MEGSZEREZTÉTEK: ${legacyName}!`;

            const activePlayer = state.players[state.activePlayerIndex];
            const newPlayers = [...state.players];
            newPlayers[state.activePlayerIndex] = {
                ...activePlayer,
                actionsRemaining: activePlayer.actionsRemaining - 1
            };

            return {
                ...state,
                players: newPlayers,
                legaciesCollected: newLegaciesCollected,
                gameStatus: newGameStatus as 'playing' | 'won' | 'lost',
                messages: [...state.messages, victoryMessage]
            };
        }

        case 'GIVE_CARD': {
            const { playerId, targetPlayerId, cardId } = action.payload;
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            const targetIndex = state.players.findIndex(p => p.id === targetPlayerId);

            if (playerIndex === -1 || targetIndex === -1) return state;

            const player = state.players[playerIndex];
            const targetPlayer = state.players[targetIndex];

            // 1. Check Action Points
            if (player.actionsRemaining < 1) return state;

            // 2. Check Location (unless Réka)
            if (player.role !== 'Réka' && player.currentCity !== targetPlayer.currentCity) {
                return {
                    ...state,
                    messages: [...state.messages, `Csak egy városban lévő játékosnak adhatsz át kártyát! (Kivéve Réka)`]
                };
            }

            // 3. Check Card Ownership
            const cardIndex = player.hand.findIndex(c => c.id === cardId);
            if (cardIndex === -1) return state;

            const card = player.hand[cardIndex];

            // 4. Transfer Card
            const newHand = [...player.hand];
            newHand.splice(cardIndex, 1);

            const newTargetHand = [...targetPlayer.hand, card];

            const newPlayers = [...state.players];
            newPlayers[playerIndex] = {
                ...player,
                hand: newHand,
                actionsRemaining: player.actionsRemaining - 1
            };
            newPlayers[targetIndex] = {
                ...targetPlayer,
                hand: newTargetHand
            };

            return {
                ...state,
                players: newPlayers,
                messages: [...state.messages, `${player.name} átadott egy kártyát (${card.name}) neki: ${targetPlayer.name}`]
            };
        }

        case 'LOAD_GAME': {
            return {
                ...action.payload,
                messages: [...action.payload.messages, 'Játék sikeresen betöltve!']
            };
        }

        default:
            return state;
    }
};
