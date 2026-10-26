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
export const WORLD_UNLOCK_REQUIREMENTS: Record<string, number> = {
  'world-1': 0,     // Always unlocked
  'world-2': 3,     // 3 missions
  'world-3': 6,
  'world-4': 10,
  'world-5': 14,
  'world-6': 18,
  'world-7': 22,
};
