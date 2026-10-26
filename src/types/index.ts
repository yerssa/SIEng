// SIEng — Shared TypeScript Interfaces and Types

export type PlayerLevel =
  | 'Explorer'
  | 'Rookie'
  | 'Adventurer'
  | 'Champion'
  | 'MasterExplorer';

export type Skill =
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'listening'
  | 'speaking'
  | 'boss';

export type QuestionType =
  | 'multiple-choice'
  | 'word-arrangement'
  | 'fill-in-blank'
  | 'match'
  | 'short-text';

export interface Question {
  id: string;
  skill: Skill;
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
}

export interface Mission {
  id: string;
  worldId: string;
  name: string;
  description: string;
  stars: 0 | 1 | 2 | 3;
  completed: boolean;
  firstCompletionRewarded: boolean;
  questionIds: string[];
}

export interface World {
  id: string;
  name: string;
  description: string;
  skill: Skill;
  unlocked: boolean;
  missions: Mission[];
}

export interface MissionResult {
  missionId: string;
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  coinsEarned: number;
  stars: 0 | 1 | 2 | 3;
  wordsLearned: string[];
  isFirstCompletion: boolean;
}

export interface ReviewItem {
  questionId: string;
  nextReviewAt: number;
  intervalDays: number;
  correctStreak: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface PlayerProfile {
  nickname: string;
  avatarId: string;
  level: PlayerLevel;
  xp: number;
  coins: number;
  totalWordsLearned: number;
  totalMissionsCompleted: number;
  totalGrammarChallenges: number;
  totalListeningActivities: number;
  totalWorldsExplored: number;
  totalRecallSuccess: number;
}

export type Screen =
  | 'intro'
  | 'setup'
  | 'placement'
  | 'dashboard'
  | 'worldMap'
  | 'worldDetail'
  | 'mission'
  | 'missionResults'
  | 'bossBattle'
  | 'profile'
  | 'achievements'
  | 'leaderboard'
  | 'progress'
  | 'settings';

export interface Settings {
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface GameState {
  player: PlayerProfile;
  worlds: World[];
  achievements: Achievement[];
  reviewQueue: ReviewItem[];
  currentScreen: Screen;
  currentWorldId?: string;
  currentMissionId?: string;
  placementDone: boolean;
  settings: Settings;
}

export interface AvatarOption {
  id: string;
  label: string;
  svgPath: string;
}

export type FoxyMood =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'surprised'
  | 'explaining'
  | 'celebrating'
  | 'encouraging';
