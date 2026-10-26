import type { GameState, Screen } from '../types';
import styles from './WorldMapScreen.module.css';

interface Props {
  state: GameState;
  onNavigate: (screen: Screen, worldId?: string) => void;
}

const WORLDS_META = [
  { id: 'world-1', name: 'Wordwood Forest', emoji: '🌲', color: '#3DBE7A', bg: '#E8F8EE', desc: 'Vocabulary & Spelling', unlockReq: 0 },
  { id: 'world-2', name: 'Grammar Galaxy', emoji: '🪐', color: '#B8A4FF', bg: '#F0ECFF', desc: 'Grammar & Sentences', unlockReq: 3 },
  { id: 'world-3', name: 'Listening Lagoon', emoji: '🌊', color: '#39D8F2', bg: '#E5FAFE', desc: 'Listening Skills', unlockReq: 5 },
  { id: 'world-4', name: 'Speaking Summit', emoji: '⛰️', color: '#FF852F', bg: '#FFF2E8', desc: 'Speaking Practice', unlockReq: 7 },
  { id: 'world-5', name: 'Reading Ruins', emoji: '📜', color: '#FFD700', bg: '#FFFBE6', desc: 'Reading Comprehension', unlockReq: 9 },
  { id: 'world-6', name: 'Battle of Wits', emoji: '⚔️', color: '#FF6B6B', bg: '#FFEDED', desc: 'Mixed Challenges', unlockReq: 11 },
  { id: 'world-7', name: 'Crystal Castle', emoji: '💎', color: '#39D8F2', bg: '#E5FAFE', desc: 'Boss Challenge', unlockReq: 13 },
];

export default function WorldMapScreen({ state, onNavigate }: Props) {
  const { worlds } = state;
  const totalCompleted = worlds.reduce((s, w) => s + w.missions.filter((m) => m.completed).length, 0);

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>World Map</h1>
        <p className={styles.subtitle}>Choose your next adventure!</p>
      </div>

      {/* World list */}
      <div className={styles.list}>
        {WORLDS_META.map((meta, i) => {
          const worldData = worlds.find((w) => w.id === meta.id);
          const unlocked = worldData?.unlocked ?? false;
          const missions = worldData?.missions ?? [];
          const completed = missions.filter((m) => m.completed).length;
          const total = missions.length;
          const stars = missions.reduce((s, m) => s + m.stars, 0);
          const maxStars = total * 3;
          const needMore = meta.unlockReq - totalCompleted;

          return (
            <button
              key={meta.id}
              className={`${styles.worldCard} ${!unlocked ? styles.locked : ''}`}
              onClick={() => unlocked && onNavigate('worldDetail', meta.id)}
              disabled={!unlocked}
              aria-label={unlocked ? `Enter ${meta.name}` : `${meta.name} — locked, complete ${needMore} more mission${needMore !== 1 ? 's' : ''} to unlock`}
            >
              {/* Connector line */}
              {i < WORLDS_META.length - 1 && (
                <div className={`${styles.connector} ${unlocked ? styles.connectorActive : ''}`} aria-hidden="true" />
              )}

              {/* World number */}
              <div
                className={styles.worldNum}
                style={unlocked ? { background: meta.color, color: 'white' } : {}}
              >
                {i + 1}
              </div>

              {/* Icon */}
              <div
                className={styles.worldIcon}
                style={unlocked ? { background: meta.bg, borderColor: meta.color } : {}}
              >
                <span className={styles.worldEmoji}>{meta.emoji}</span>
                {!unlocked && <div className={styles.lockOverlay}>🔒</div>}
              </div>

              {/* Info */}
              <div className={styles.worldInfo}>
                <span className={styles.worldName}>{meta.name}</span>
                <span className={styles.worldDesc}>{meta.desc}</span>
                {unlocked ? (
                  <div className={styles.progressRow}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: total > 0 ? `${(completed / total) * 100}%` : '0%', background: meta.color }}
                      />
                    </div>
                    <span className={styles.progressLabel}>{completed}/{total}</span>
                    {stars > 0 && <span className={styles.starsLabel}>⭐ {stars}/{maxStars}</span>}
                  </div>
                ) : (
                  <span className={styles.lockMsg}>
                    Complete {needMore} more mission{needMore !== 1 ? 's' : ''} to unlock
                  </span>
                )}
              </div>

              {/* Arrow */}
              {unlocked && <span className={styles.arrow} aria-hidden="true" style={{ color: meta.color }}>›</span>}
            </button>
          );
        })}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
