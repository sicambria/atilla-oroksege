import type { GameState, CityName } from '../types';
import { ADJACENCY, THREAT_DETAILS, LEGACY_LOCATIONS } from '../constants';
import type { Action } from './gameReducer';

// Helper to find path to nearest target
const findPath = (start: CityName, targets: CityName[], avoidCity?: CityName): CityName | null => {
    if (targets.includes(start)) return null;

    const queue: { city: CityName; path: CityName[] }[] = [{ city: start, path: [] }];
    const visited = new Set<string>([start]);
    if (avoidCity) visited.add(avoidCity);

    while (queue.length > 0) {
        const { city, path } = queue.shift()!;

        if (targets.includes(city)) {
            return path[0]; // First step towards target
        }

        const neighbors = ADJACENCY[city];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push({ city: neighbor as CityName, path: [...path, neighbor as CityName] });
            }
        }
    }
    return null;
};

export const getNextBestAction = (state: GameState): Action | null => {
    const activePlayer = state.players[state.activePlayerIndex];

    // 0. End Turn if no actions
    if (activePlayer.actionsRemaining <= 0) {
        return { type: 'END_TURN' };
    }

    const currentCity = state.cities[activePlayer.currentCity];

    // 1. Resolve Threats in current city (Always top priority if possible)
    if (currentCity.threats.length > 0) {
        for (let i = 0; i < currentCity.threats.length; i++) {
            const threat = currentCity.threats[i];
            const details = THREAT_DETAILS[threat];
            const requiredType = details.counter;
            const requiredAmount = details.amount;

            const matchingCards = activePlayer.hand.filter(c => c.subType === requiredType);
            if (matchingCards.length >= requiredAmount) {
                return {
                    type: 'RESOLVE_THREAT',
                    payload: {
                        city: activePlayer.currentCity,
                        threatIndex: i,
                        cardIds: matchingCards.slice(0, requiredAmount).map(c => c.id)
                    }
                };
            }
        }
    }

    // 2. Claim Legacy (High Priority)
    const legacyEntry = Object.entries(LEGACY_LOCATIONS).find(([_, loc]) => loc === activePlayer.currentCity);
    if (legacyEntry) {
        const [legacyType, _] = legacyEntry;
        const isCollected = state.legaciesCollected[legacyType as keyof typeof state.legaciesCollected];
        if (!isCollected && activePlayer.hand.length >= 5) {
            return {
                type: 'CLAIM_LEGACY',
                payload: { playerId: activePlayer.id, legacyType: legacyType as any }
            };
        }
    }

    // 3. Strategic Movement: Find Solvable Threats
    // Look for threats where we HAVE the cards to solve them
    const solvableCities = Object.entries(state.cities)
        .filter(([name, c]) => {
            if (c.threats.length === 0 || name === activePlayer.currentCity) return false;
            // Check if we can solve ANY threat in this city
            return c.threats.some(threat => {
                const details = THREAT_DETAILS[threat];
                const matchingCards = activePlayer.hand.filter(card => card.subType === details.counter);
                return matchingCards.length >= details.amount;
            });
        })
        .map(([name, _]) => name as CityName);

    if (solvableCities.length > 0) {
        let nextStep = findPath(activePlayer.currentCity, solvableCities, activePlayer.lastCity);
        if (!nextStep) nextStep = findPath(activePlayer.currentCity, solvableCities);

        if (nextStep) {
            return {
                type: 'MOVE_PLAYER',
                payload: { playerId: activePlayer.id, destination: nextStep }
            };
        }
    }

    // 4. Critical Defense: Move to Cities with 3 Threats (Impending Riot) or Capital
    const criticalCities = Object.entries(state.cities)
        .filter(([name, c]) => (c.threats.length >= 3 || name === 'Etil') && c.threats.length > 0 && name !== activePlayer.currentCity)
        .map(([name, _]) => name as CityName);

    if (criticalCities.length > 0) {
        let nextStep = findPath(activePlayer.currentCity, criticalCities, activePlayer.lastCity);
        if (!nextStep) nextStep = findPath(activePlayer.currentCity, criticalCities);

        if (nextStep) {
            return {
                type: 'MOVE_PLAYER',
                payload: { playerId: activePlayer.id, destination: nextStep }
            };
        }
    }

    // 5. Move to Legacy Locations (if not collected)
    const uncollectedLegacies = Object.entries(LEGACY_LOCATIONS)
        .filter(([type, loc]) => !state.legaciesCollected[type as keyof typeof state.legaciesCollected] && loc !== activePlayer.currentCity)
        .map(([_, loc]) => loc);

    if (uncollectedLegacies.length > 0) {
        let nextStep = findPath(activePlayer.currentCity, uncollectedLegacies, activePlayer.lastCity);
        if (!nextStep) nextStep = findPath(activePlayer.currentCity, uncollectedLegacies);

        if (nextStep) {
            return {
                type: 'MOVE_PLAYER',
                payload: { playerId: activePlayer.id, destination: nextStep }
            };
        }
    }

    // 6. Passive Defense (End Turn)
    // If we are in a city with threats, STAY there to use the passive reduction at end of round.
    // Especially if we are the last player or close to it.
    // Or if we just moved here (lastCity check) and found we can't solve it, stay to draw cards.
    if (currentCity.threats.length > 0) {
        return { type: 'END_TURN' };
    }

    // 7. General Patrol: Move to ANY threat if nothing else
    const allThreatCities = Object.entries(state.cities)
        .filter(([name, c]) => c.threats.length > 0 && name !== activePlayer.currentCity)
        .map(([name, _]) => name as CityName);

    if (allThreatCities.length > 0) {
        let nextStep = findPath(activePlayer.currentCity, allThreatCities, activePlayer.lastCity);
        if (!nextStep) nextStep = findPath(activePlayer.currentCity, allThreatCities);

        if (nextStep) {
            return {
                type: 'MOVE_PLAYER',
                payload: { playerId: activePlayer.id, destination: nextStep }
            };
        }
    }

    // 8. Random Move (Wander)
    const neighbors = ADJACENCY[activePlayer.currentCity];
    const validNeighbors = neighbors.filter(n => n !== activePlayer.lastCity);
    const options = validNeighbors.length > 0 ? validNeighbors : neighbors;

    const randomNeighbor = options[Math.floor(Math.random() * options.length)];
    return {
        type: 'MOVE_PLAYER',
        payload: { playerId: activePlayer.id, destination: randomNeighbor as CityName }
    };
};

