import type { PlayerLevel } from '../types';

export const LEVEL_THRESHOLDS: Record<PlayerLevel, number> = {
  Explorer: 0,
  Rookie: 200,
  Adventurer: 500,
  Champion: 1000,
  MasterExplorer: 2000,
};

export const LEVEL_ORDER: PlayerLevel[] = [
  'Explorer',
  'Rookie',
  'Adventurer',
  'Champion',
  'MasterExplorer',
];

export const LEVEL_LABELS: Record<PlayerLevel, string> = {
  Explorer: 'Explorer',
  Rookie: 'Rookie',
  Adventurer: 'Adventurer',
  Champion: 'Champion',
  MasterExplorer: 'Master Explorer',
};

export const LEVEL_COLORS: Record<PlayerLevel, string> = {
  Explorer: '#39D8F2',
  Rookie: '#3DBE7A',
  Adventurer: '#FF852F',
  Champion: '#B8A4FF',
  MasterExplorer: '#FFD700',
};

export function getLevelFromXP(xp: number): PlayerLevel {
  let current: PlayerLevel = 'Explorer';
  for (const level of LEVEL_ORDER) {
    if (xp >= LEVEL_THRESHOLDS[level]) {
      current = level;
    }
  }
  return current;
}

export function getXPForNextLevel(currentLevel: PlayerLevel): number {
  const idx = LEVEL_ORDER.indexOf(currentLevel);
  if (idx >= LEVEL_ORDER.length - 1) return LEVEL_THRESHOLDS['MasterExplorer'];
  return LEVEL_THRESHOLDS[LEVEL_ORDER[idx + 1]];
}

export function getXPProgress(xp: number): { current: number; nextLevelXP: number; progress: number } {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelXP = LEVEL_THRESHOLDS[currentLevel];
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  const progress = Math.min(100, Math.round((current / needed) * 100));
  return { current, nextLevelXP: needed, progress };
}

// World unlock requirements: number of missions completed
// Total missions in game: world-1(4) + world-2(3) + world-3(2) + world-4(2) + world-5(2) + world-6(1) + world-7(1) = 15
export const WORLD_UNLOCK_REQUIREMENTS: Record<string, number> = {
  'world-1': 0,    // Always unlocked
  'world-2': 3,    // Complete most of world-1
  'world-3': 5,    // Complete world-1 + start world-2
  'world-4': 7,    // Complete world-1 + world-2 (4+3=7)
  'world-5': 9,    // Complete through world-3 (4+3+2=9)
  'world-6': 11,   // Complete through world-4 (4+3+2+2=11)
  'world-7': 13,   // Complete through world-5 (4+3+2+2+2=13)
};
