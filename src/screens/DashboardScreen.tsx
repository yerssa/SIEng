import type { GameState } from '../types';
import FoxyCharacter from '../components/FoxyCharacter';
import ProgressBar from '../components/ProgressBar';
import { LEVEL_LABELS, LEVEL_COLORS, getXPProgress } from '../game/progression';
import { getReviewDueCount } from '../game/reviewScheduler';
import styles from './DashboardScreen.module.css';

interface Props {
  state: GameState;
  onNavigate: (screen: import('../types').Screen, worldId?: string, missionId?: string) => void;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getNextMission(state: GameState) {
  for (const world of state.worlds) {
    if (!world.unlocked) continue;
    const m = world.missions.find((m) => !m.completed);
    if (m) return { world, mission: m };
  }
  return null;
}

export default function DashboardScreen({ state, onNavigate }: Props) {
  const { player, worlds, achievements, reviewQueue } = state;
  const xpProgress = getXPProgress(player.xp);
  const dueReviews = getReviewDueCount(reviewQueue);
  const next = getNextMission(state);
  const recentAchs = achievements.filter((a) => a.unlocked).slice(-3).reverse();
  const completedMissions = worlds.reduce((s, w) => s + w.missions.filter((m) => m.completed).length, 0);

  return (
    <div className={styles.screen}>
      {/* Top banner */}
      <div className={styles.banner}>
        <div className={styles.foxyRow}>
          <FoxyCharacter mood="happy" size={90} animate />
          <div className={styles.greeting}>
            <p className={styles.greetingSmall}>{getGreeting()},</p>
            <h1 className={styles.greetingName}>{player.nickname}! 👋</h1>
            <div className={styles.levelBadge} style={{ background: `${LEVEL_COLORS[player.level]}20`, borderColor: LEVEL_COLORS[player.level] }}>
              <span style={{ color: LEVEL_COLORS[player.level], fontWeight: 800 }}>
                {LEVEL_LABELS[player.level]}
              </span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className={styles.xpSection}>
          <div className={styles.xpHeader}>
            <span className={styles.xpLabel}>✨ {player.xp} XP</span>
            <span className={styles.xpNext}>{xpProgress.current}/{xpProgress.nextLevelXP} to next level</span>
          </div>
          <ProgressBar value={xpProgress.progress} color={LEVEL_COLORS[player.level]} height={10} />
        </div>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statNum}>{player.coins}</span>
          <span className={styles.statLabel}>🪙 Coins</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{completedMissions}</span>
          <span className={styles.statLabel}>📋 Missions</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{player.totalWordsLearned}</span>
          <span className={styles.statLabel}>📚 Words</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNum}>{worlds.filter((w) => w.unlocked).length}</span>
          <span className={styles.statLabel}>🌍 Worlds</span>
        </div>
      </div>

      {/* Review alert */}
      {dueReviews > 0 && (
        <button className={styles.reviewAlert} onClick={() => onNavigate('progress')}>
          🧠 {dueReviews} word{dueReviews > 1 ? 's' : ''} due for review! Practice now →
        </button>
      )}

      {/* Continue adventure */}
      {next && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Continue Adventure</h2>
          <button
            className={styles.continueCard}
            onClick={() => onNavigate('mission', next.world.id, next.mission.id)}
          >
            <div className={styles.continueIcon}>{WORLD_ICONS[next.world.id]}</div>
            <div className={styles.continueInfo}>
              <span className={styles.continueMission}>{next.mission.name}</span>
              <span className={styles.continueWorld}>{next.world.name}</span>
            </div>
            <span className={styles.continueArrow}>▶</span>
          </button>
        </div>
      )}

      {/* World map shortcut */}
      <button className={styles.mapBtn} onClick={() => onNavigate('worldMap')}>
        🗺️ Open World Map
      </button>

      {/* Recent achievements */}
      {recentAchs.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Recent Achievements</h2>
          <div className={styles.achList}>
            {recentAchs.map((a) => (
              <div key={a.id} className={styles.achChip}>
                <span>{a.icon}</span>
                <span className={styles.achName}>{a.name}</span>
              </div>
            ))}
          </div>
          <button className={styles.viewAll} onClick={() => onNavigate('achievements')}>
            View all achievements →
          </button>
        </div>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}

const WORLD_ICONS: Record<string, string> = {
  'world-1': '🌲',
  'world-2': '🪐',
  'world-3': '🌊',
  'world-4': '⛰️',
  'world-5': '📜',
  'world-6': '⚔️',
  'world-7': '💎',
};
