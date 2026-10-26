import type { GameState, Screen } from '../types';
import FoxyCharacter from '../components/FoxyCharacter';
import ProgressBar from '../components/ProgressBar';
import { LEVEL_LABELS, LEVEL_COLORS, getXPProgress } from '../game/progression';
import styles from './ProfileScreen.module.css';

interface Props {
  state: GameState;
  onNavigate: (screen: Screen) => void;
}

const AVATAR_MAP: Record<string, string> = {
  'avatar-1': '🦁',
  'avatar-2': '🐸',
  'avatar-3': '🐧',
  'avatar-4': '🦋',
  'avatar-5': '🐬',
  'avatar-6': '🦊',
};

const COSMETICS = [
  { id: 'hat-explorer', name: 'Explorer Hat', emoji: '🎩', req: 200, reqLabel: '200 XP' },
  { id: 'hat-crown', name: 'Golden Crown', emoji: '👑', req: 1000, reqLabel: '1000 XP' },
  { id: 'pack-blue', name: 'Blue Backpack', emoji: '🎒', req: 500, reqLabel: '500 XP' },
  { id: 'frame-star', name: 'Star Frame', emoji: '⭐', req: 5, reqLabel: '5 missions' },
];

export default function ProfileScreen({ state, onNavigate }: Props) {
  const { player, worlds, achievements } = state;
  const xpProgress = getXPProgress(player.xp);
  const totalMissions = worlds.reduce((s, w) => s + w.missions.filter((m) => m.completed).length, 0);
  const totalStars = worlds.reduce((s, w) => s + w.missions.reduce((ms, m) => ms + m.stars, 0), 0);
  const unlockedAchs = achievements.filter((a) => a.unlocked).length;

  return (
    <div className={styles.screen}>
      {/* Profile header */}
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <span className={styles.avatarEmoji}>{AVATAR_MAP[player.avatarId] ?? '🦊'}</span>
          <div className={styles.levelBadge} style={{ background: LEVEL_COLORS[player.level], color: 'white' }}>
            {LEVEL_LABELS[player.level]}
          </div>
        </div>
        <h1 className={styles.nickname}>{player.nickname}</h1>
        <div className={styles.xpRow}>
          <span className={styles.xpText}>✨ {player.xp} XP</span>
          <span className={styles.coinsText}>🪙 {player.coins}</span>
        </div>
        <div className={styles.xpBar}>
          <ProgressBar value={xpProgress.progress} color={LEVEL_COLORS[player.level]} height={8} />
          <p className={styles.xpHint}>{xpProgress.current}/{xpProgress.nextLevelXP} XP to next level</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{totalMissions}</span>
          <span className={styles.statLbl}>Missions</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{totalStars}⭐</span>
          <span className={styles.statLbl}>Stars</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{player.totalWordsLearned}</span>
          <span className={styles.statLbl}>Words</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{unlockedAchs}/{achievements.length}</span>
          <span className={styles.statLbl}>Achievements</span>
        </div>
      </div>

      {/* Foxy */}
      <div className={styles.foxySection}>
        <FoxyCharacter mood="happy" size={90} animate />
        <div className={styles.foxySpeech}>
          "You're doing great, {player.nickname}! Keep exploring and learning! 🌟"
        </div>
      </div>

      {/* Cosmetics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Cosmetics</h2>
        <div className={styles.cosmeticGrid}>
          {COSMETICS.map((c) => {
            const unlocked = player.xp >= c.req || totalMissions >= c.req;
            return (
              <div key={c.id} className={`${styles.cosmetic} ${unlocked ? styles.cosmeticUnlocked : styles.cosmeticLocked}`}>
                <span className={styles.cosmeticEmoji}>{c.emoji}</span>
                <span className={styles.cosmeticName}>{c.name}</span>
                {!unlocked && <span className={styles.cosmeticReq}>{c.reqLabel}</span>}
                {unlocked && <span className={styles.cosmeticAvail}>Unlocked!</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className={styles.section}>
        <button className={styles.link} onClick={() => onNavigate('achievements')}>
          🏆 View All Achievements →
        </button>
        <button className={styles.link} onClick={() => onNavigate('leaderboard')}>
          🥇 Leaderboard →
        </button>
        <button className={styles.link} onClick={() => onNavigate('settings')}>
          ⚙️ Settings →
        </button>
      </div>

      <div style={{ height: 80 }} />
    </div>
  );
}
