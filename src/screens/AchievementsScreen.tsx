import type { GameState } from '../types';
import styles from './AchievementsScreen.module.css';

interface Props {
  state: GameState;
}

export default function AchievementsScreen({ state }: Props) {
  const { achievements } = state;
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>Achievements</h1>
        <div className={styles.badge}>{unlocked}/{achievements.length} Unlocked</div>
      </div>

      <div className={styles.grid}>
        {achievements.map((ach) => (
          <div key={ach.id} className={`${styles.card} ${ach.unlocked ? styles.unlocked : styles.locked}`}>
            <div className={`${styles.icon} ${ach.unlocked ? styles.iconUnlocked : ''}`}>
              {ach.unlocked ? ach.icon : '🔒'}
            </div>
            <div className={styles.info}>
              <span className={styles.name}>{ach.name}</span>
              <span className={styles.desc}>{ach.description}</span>
              {ach.unlockedAt && (
                <span className={styles.date}>
                  Earned {new Date(ach.unlockedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {ach.unlocked && <span className={styles.check} aria-label="Earned">✅</span>}
          </div>
        ))}
      </div>
      <div style={{ height: 80 }} />
    </div>
  );
}
