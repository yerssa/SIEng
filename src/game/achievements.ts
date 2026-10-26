import type { Achievement, GameState } from '../types';

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your very first mission.',
    icon: '👣',
  },
  {
    id: 'word-explorer',
    name: 'Word Explorer',
    description: 'Learn 10 new words.',
    icon: '📖',
  },
  {
    id: 'grammar-guardian',
    name: 'Grammar Guardian',
    description: 'Complete 5 grammar challenges.',
    icon: '⚡',
  },
  {
    id: 'listening-star',
    name: 'Listening Star',
    description: 'Complete 3 listening activities.',
    icon: '🎧',
  },
  {
    id: 'curious-mind',
    name: 'Curious Mind',
    description: 'Explore 3 different worlds.',
    icon: '🌍',
  },
  {
    id: 'perfect-mission',
    name: 'Perfect Mission',
    description: 'Complete a mission with 100% accuracy.',
    icon: '🌟',
  },
  {
    id: 'recall-champion',
    name: 'Recall Champion',
    description: 'Successfully review 5 items from memory.',
    icon: '🧠',
  },
  {
    id: 'crystal-seeker',
    name: 'Crystal Seeker',
    description: 'Complete the first boss challenge.',
    icon: '💎',
  },
];

export function initAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.map((def) => ({
    ...def,
    unlocked: false,
  }));
}

export function checkAchievements(state: GameState): string[] {
  const newlyUnlocked: string[] = [];
  const { player, worlds, achievements } = state;

  const check = (id: string, condition: boolean) => {
    const ach = achievements.find((a) => a.id === id);
    if (ach && !ach.unlocked && condition) {
      newlyUnlocked.push(id);
    }
  };

  const totalMissions = worlds.reduce(
    (sum, w) => sum + w.missions.filter((m) => m.completed).length,
    0,
  );

  check('first-steps', totalMissions >= 1);
  check('word-explorer', player.totalWordsLearned >= 10);
  check('grammar-guardian', player.totalGrammarChallenges >= 5);
  check('listening-star', player.totalListeningActivities >= 3);
  check('curious-mind', player.totalWorldsExplored >= 3);
  check(
    'perfect-mission',
    worlds.some((w) =>
      w.missions.some((m) => m.completed && m.stars === 3),
    ),
  );
  check('recall-champion', player.totalRecallSuccess >= 5);

  return newlyUnlocked;
}
