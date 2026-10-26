import { useReducer, useEffect } from 'react';
import type { GameState, Screen, MissionResult, Settings, PlayerLevel } from '../types';
import { initAchievements, checkAchievements } from '../game/achievements';
import { INITIAL_WORLDS } from '../data/worlds';
import { getLevelFromXP } from '../game/progression';
import { WORLD_UNLOCK_REQUIREMENTS } from '../game/progression';
import { addToReviewQueue, advanceReviewItem } from '../game/reviewScheduler';

const SAVE_KEY = 'sieng_save_v1';
const SCHEMA_VERSION = 1;

function defaultState(): GameState {
  return {
    player: {
      nickname: '',
      avatarId: 'avatar-1',
      level: 'Explorer',
      xp: 0,
      coins: 0,
      totalWordsLearned: 0,
      totalMissionsCompleted: 0,
      totalGrammarChallenges: 0,
      totalListeningActivities: 0,
      totalWorldsExplored: 0,
      totalRecallSuccess: 0,
    },
    worlds: INITIAL_WORLDS,
    achievements: initAchievements(),
    reviewQueue: [],
    currentScreen: 'intro',
    currentWorldId: undefined,
    currentMissionId: undefined,
    placementDone: false,
    settings: {
      soundEnabled: false,
      reducedMotion: false,
    },
  };
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ version: SCHEMA_VERSION, state }));
  } catch {
    // silent
  }
}

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== SCHEMA_VERSION) return defaultState();
    const loaded: GameState = parsed.state;
    // Merge any missing achievements
    const known = initAchievements();
    const merged = known.map((def) => {
      const existing = loaded.achievements?.find((a) => a.id === def.id);
      return existing ?? def;
    });
    // Ensure worlds have all fields
    const mergedWorlds = INITIAL_WORLDS.map((world) => {
      const saved = loaded.worlds?.find((w) => w.id === world.id);
      if (!saved) return world;
      return {
        ...world,
        unlocked: saved.unlocked,
        missions: world.missions.map((m) => {
          const sm = saved.missions?.find((sm) => sm.id === m.id);
          return sm ? { ...m, ...sm } : m;
        }),
      };
    });

    // Re-evaluate world unlock status based on current thresholds.
    // This ensures that if thresholds were lowered (e.g. after a patch), previously
    // locked worlds become available without requiring a full save reset.
    const totalCompleted = mergedWorlds.reduce(
      (sum, w) => sum + w.missions.filter((m) => m.completed).length,
      0,
    );
    const revalidatedWorlds = mergedWorlds.map((world) => {
      const req = WORLD_UNLOCK_REQUIREMENTS[world.id] ?? 0;
      return { ...world, unlocked: totalCompleted >= req };
    });

    return {
      ...defaultState(),
      ...loaded,
      achievements: merged,
      worlds: revalidatedWorlds,
    };
  } catch {
    return defaultState();
  }
}

type Action =
  | { type: 'NAVIGATE'; screen: Screen; worldId?: string; missionId?: string }
  | { type: 'SET_PLAYER'; nickname: string; avatarId: string }
  | { type: 'SET_PLACEMENT_LEVEL'; level: PlayerLevel }
  | { type: 'COMPLETE_MISSION'; result: MissionResult; worldId: string }
  | { type: 'COMPLETE_BOSS'; missionId: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; id: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<Settings> }
  | { type: 'ADD_REVIEW'; questionId: string }
  | { type: 'ADVANCE_REVIEW'; questionId: string }
  | { type: 'RESET' };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NAVIGATE': {
      return {
        ...state,
        currentScreen: action.screen,
        currentWorldId: action.worldId ?? state.currentWorldId,
        currentMissionId: action.missionId ?? state.currentMissionId,
      };
    }

    case 'SET_PLAYER': {
      return {
        ...state,
        player: {
          ...state.player,
          nickname: action.nickname,
          avatarId: action.avatarId,
        },
      };
    }

    case 'SET_PLACEMENT_LEVEL': {
      return {
        ...state,
        placementDone: true,
        player: {
          ...state.player,
          level: action.level,
        },
      };
    }

    case 'COMPLETE_MISSION': {
      const { result, worldId } = action;
      const newXP = state.player.xp + result.xpEarned;
      const newCoins = state.player.coins + result.coinsEarned;
      const newLevel = getLevelFromXP(newXP);

      const updatedWorlds = state.worlds.map((world) => {
        if (world.id !== worldId) return world;
        return {
          ...world,
          missions: world.missions.map((mission) => {
            if (mission.id !== result.missionId) return mission;
            return {
              ...mission,
              completed: true,
              stars: Math.max(mission.stars, result.stars) as 0 | 1 | 2 | 3,
              firstCompletionRewarded: true,
            };
          }),
        };
      });

      // Unlock worlds based on total completed missions
      const totalCompleted = updatedWorlds.reduce(
        (sum, w) => sum + w.missions.filter((m) => m.completed).length,
        0,
      );

      const unlockedWorlds = updatedWorlds.map((world) => {
        const req = WORLD_UNLOCK_REQUIREMENTS[world.id] ?? 0;
        return { ...world, unlocked: totalCompleted >= req };
      });

      // Update skill counters
      const world = state.worlds.find((w) => w.id === worldId);
      const mission = world?.missions.find((m) => m.id === result.missionId);
      const wasAlreadyCompleted = mission?.completed ?? false;

      const skillInc = !wasAlreadyCompleted ? 1 : 0;
      const isGrammar = world?.skill === 'grammar' ? skillInc : 0;
      const isListening = world?.skill === 'listening' ? skillInc : 0;
      const worldsSet = new Set([
        ...unlockedWorlds.filter((w) => w.missions.some((m) => m.completed)).map((w) => w.id),
      ]);

      const updatedPlayer = {
        ...state.player,
        xp: newXP,
        coins: newCoins,
        level: newLevel,
        totalMissionsCompleted: state.player.totalMissionsCompleted + skillInc,
        totalWordsLearned: state.player.totalWordsLearned + result.wordsLearned.length,
        totalGrammarChallenges: state.player.totalGrammarChallenges + isGrammar,
        totalListeningActivities: state.player.totalListeningActivities + isListening,
        totalWorldsExplored: worldsSet.size,
      };

      // Check achievements against the fully updated state so counters are correct
      const updatedStateForAch = {
        ...state,
        player: updatedPlayer,
        worlds: unlockedWorlds,
      };
      const newlyUnlocked = checkAchievements(updatedStateForAch);
      const updatedAchievements = state.achievements.map((a) =>
        newlyUnlocked.includes(a.id) ? { ...a, unlocked: true, unlockedAt: Date.now() } : a,
      );

      return {
        ...state,
        player: updatedPlayer,
        worlds: unlockedWorlds,
        achievements: updatedAchievements,
      };
    }

    case 'COMPLETE_BOSS': {
      const updatedWorlds = state.worlds.map((world) =>
        world.id === 'world-7'
          ? {
              ...world,
              missions: world.missions.map((m) =>
                m.id === action.missionId
                  ? { ...m, completed: true, stars: 3 as const, firstCompletionRewarded: true }
                  : m,
              ),
            }
          : world,
      );
      return {
        ...state,
        player: {
          ...state.player,
          xp: state.player.xp + 50,
          coins: state.player.coins + 30,
        },
        worlds: updatedWorlds,
      };
    }

    case 'UNLOCK_ACHIEVEMENT': {
      return {
        ...state,
        achievements: state.achievements.map((a) =>
          a.id === action.id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a,
        ),
      };
    }

    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };
    }

    case 'ADD_REVIEW': {
      return {
        ...state,
        reviewQueue: addToReviewQueue(state.reviewQueue, action.questionId),
      };
    }

    case 'ADVANCE_REVIEW': {
      return {
        ...state,
        reviewQueue: advanceReviewItem(state.reviewQueue, action.questionId),
        player: {
          ...state.player,
          totalRecallSuccess: state.player.totalRecallSuccess + 1,
        },
      };
    }

    case 'RESET': {
      return defaultState();
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const navigate = (screen: Screen, worldId?: string, missionId?: string) =>
    dispatch({ type: 'NAVIGATE', screen, worldId, missionId });

  const setPlayer = (nickname: string, avatarId: string) =>
    dispatch({ type: 'SET_PLAYER', nickname, avatarId });

  const setPlacementLevel = (level: PlayerLevel) =>
    dispatch({ type: 'SET_PLACEMENT_LEVEL', level });

  const completeMission = (result: MissionResult, worldId: string) => {
    dispatch({ type: 'COMPLETE_MISSION', result, worldId });
    // Achievement check happens inside COMPLETE_MISSION reducer with the updated state
  };

  const completeBoss = (missionId: string) => {
    dispatch({ type: 'COMPLETE_BOSS', missionId });
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id: 'crystal-seeker' });
  };

  const unlockAchievement = (id: string) =>
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', id });

  const updateSettings = (settings: Partial<Settings>) =>
    dispatch({ type: 'UPDATE_SETTINGS', settings });

  const addReview = (questionId: string) =>
    dispatch({ type: 'ADD_REVIEW', questionId });

  const advanceReview = (questionId: string) =>
    dispatch({ type: 'ADVANCE_REVIEW', questionId });

  const resetGame = () => {
    localStorage.removeItem(SAVE_KEY);
    dispatch({ type: 'RESET' });
  };

  return {
    state,
    navigate,
    setPlayer,
    setPlacementLevel,
    completeMission,
    completeBoss,
    unlockAchievement,
    updateSettings,
    addReview,
    advanceReview,
    resetGame,
  };
}
