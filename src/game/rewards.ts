import type { MissionResult } from '../types';

// ===== CENTRAL REWARD FUNCTION =====
// All XP/coins/stars logic lives here only — never duplicated elsewhere.

export const REWARD_CONFIG = {
  XP_PER_CORRECT: 10,
  XP_MISSION_BONUS: 20,
  COINS_FIRST_COMPLETION: 15,
  XP_BOSS_VICTORY: 50,
  COINS_BOSS_VICTORY: 30,
  COINS_REVIEW_BONUS: 5,
  STAR_2_THRESHOLD: 0.7,   // 70%
  STAR_3_THRESHOLD: 0.9,   // 90%
} as const;

export function calculateStars(correctCount: number, totalCount: number): 0 | 1 | 2 | 3 {
  if (totalCount === 0) return 0;
  const ratio = correctCount / totalCount;
  if (ratio >= REWARD_CONFIG.STAR_3_THRESHOLD) return 3;
  if (ratio >= REWARD_CONFIG.STAR_2_THRESHOLD) return 2;
  if (correctCount > 0) return 1;
  return 0;
}

export function calculateMissionReward(
  missionId: string,
  correctCount: number,
  totalCount: number,
  isFirstCompletion: boolean,
  wordsLearned: string[] = [],
): MissionResult {
  const baseXP = correctCount * REWARD_CONFIG.XP_PER_CORRECT;
  const bonusXP = totalCount > 0 ? REWARD_CONFIG.XP_MISSION_BONUS : 0;
  const xpEarned = baseXP + bonusXP;
  const coinsEarned = isFirstCompletion ? REWARD_CONFIG.COINS_FIRST_COMPLETION : 0;
  const stars = calculateStars(correctCount, totalCount);

  return {
    missionId,
    correctCount,
    totalCount,
    xpEarned,
    coinsEarned,
    stars,
    wordsLearned,
    isFirstCompletion,
  };
}

export function calculateAccuracy(correctCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((correctCount / totalCount) * 100);
}
