import type { GameState, Screen } from '../types';
import StarRating from '../components/StarRating';
import Button from '../components/Button';
import styles from './WorldDetailScreen.module.css';

interface Props {
  state: GameState;
  onNavigate: (screen: Screen, worldId?: string, missionId?: string) => void;
}

const WORLD_COLORS: Record<string, string> = {
  'world-1': '#3DBE7A',
  'world-2': '#B8A4FF',
  'world-3': '#39D8F2',
  'world-4': '#FF852F',
  'world-5': '#FFD700',
  'world-6': '#FF6B6B',
  'world-7': '#39D8F2',
};

const WORLD_EMOJIS: Record<string, string> = {
  'world-1': '🌲',
  'world-2': '🪐',
  'world-3': '🌊',
  'world-4': '⛰️',
  'world-5': '📜',
  'world-6': '⚔️',
  'world-7': '💎',
};

export default function WorldDetailScreen({ state, onNavigate }: Props) {
  const worldData = state.worlds.find((w) => w.id === state.currentWorldId);
  if (!worldData) {
    return (
      <div className={styles.screen}>
        <p>World not found.</p>
        <Button onClick={() => onNavigate('worldMap')} variant="secondary">← Back</Button>
      </div>
    );
  }

  const color = WORLD_COLORS[worldData.id] ?? '#FF852F';
  const emoji = WORLD_EMOJIS[worldData.id] ?? '🌍';
  const allDone = worldData.missions.every((m) => m.completed);
  const totalStars = worldData.missions.reduce((s, m) => s + m.stars, 0);
  const maxStars = worldData.missions.length * 3;

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.header} style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)`, borderColor: `${color}40` }}>
        <button className={styles.backBtn} onClick={() => onNavigate('worldMap')} aria-label="Back to map">
          ← Map
        </button>
        <div className={styles.worldTitle}>
          <span className={styles.worldEmoji}>{emoji}</span>
          <div>
            <h1 className={styles.worldName}>{worldData.name}</h1>
            <p className={styles.worldDesc}>{worldData.description}</p>
          </div>
        </div>
        <div className={styles.worldStats}>
          <span className={styles.statBadge} style={{ color, borderColor: `${color}50` }}>
            ⭐ {totalStars}/{maxStars} stars
          </span>
          <span className={styles.statBadge} style={{ color, borderColor: `${color}50` }}>
            {worldData.missions.filter((m) => m.completed).length}/{worldData.missions.length} done
          </span>
        </div>
      </div>

      {/* Mission list */}
      <div className={styles.missions}>
        <h2 className={styles.missionsTitle}>Missions</h2>
        {worldData.missions.map((mission, i) => (
          <div key={mission.id} className={`${styles.missionCard} ${mission.id === 'w7-boss' ? styles.bossCard : ''}`}>
            <div className={styles.missionLeft}>
              <div className={`${styles.missionNum} ${mission.completed ? styles.missionNumDone : ''}`}
                style={mission.completed ? { background: color } : {}}>
                {mission.completed ? '✓' : i + 1}
              </div>
              <div className={styles.missionInfo}>
                <span className={styles.missionName}>{mission.name}</span>
                <span className={styles.missionDesc}>{mission.description}</span>
                <StarRating stars={mission.stars} size={20} />
              </div>
            </div>
            {mission.id === 'w7-boss' ? (
              <Button
                onClick={() => onNavigate('bossBattle', worldData.id, mission.id)}
                variant="primary"
                size="sm"
              >
                ⚔️ Battle!
              </Button>
            ) : (
              <Button
                onClick={() => onNavigate('mission', worldData.id, mission.id)}
                variant={mission.completed ? 'secondary' : 'primary'}
                size="sm"
              >
                {mission.completed ? '↺ Replay' : '▶ Play'}
              </Button>
            )}
          </div>
        ))}
      </div>

      {allDone && (
        <div className={styles.completeBanner}>
          🎉 World complete! All missions done!
        </div>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}
