import type { MissionResult, GameState } from '../types';
import FoxyCharacter from '../components/FoxyCharacter';
import StarRating from '../components/StarRating';
import Button from '../components/Button';
import { calculateAccuracy } from '../game/rewards';
import styles from './MissionResultsScreen.module.css';

interface Props {
  result: MissionResult;
  state: GameState;
  onContinue: () => void;
  onReturnToMap: () => void;
}

export default function MissionResultsScreen({ result, state, onContinue, onReturnToMap }: Props) {
  const { correctCount, totalCount, xpEarned, coinsEarned, stars, wordsLearned, isFirstCompletion } = result;
  const accuracy = calculateAccuracy(correctCount, totalCount);
  const world = state.worlds.find((w) => w.id === state.currentWorldId);
  const mission = world?.missions.find((m) => m.id === result.missionId);

  const newAchs = state.achievements.filter((a) => a.unlocked && a.unlockedAt && Date.now() - a.unlockedAt < 5000);

  return (
    <div className={styles.screen}>
      {/* Celebration header */}
      <div className={styles.celebHeader}>
        <FoxyCharacter mood="celebrating" size={140} animate />
        <h1 className={styles.title}>Mission Complete!</h1>
        <p className={styles.missionName}>{mission?.name}</p>
      </div>

      {/* Stars */}
      <div className={styles.starsWrap}>
        <StarRating stars={stars} size={48} animate />
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{correctCount}/{totalCount}</span>
          <span className={styles.statLabel}>Correct</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{accuracy}%</span>
          <span className={styles.statLabel}>Accuracy</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: 'var(--fox-orange)' }}>+{xpEarned}</span>
          <span className={styles.statLabel}>✨ XP</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: '#b8860b' }}>+{coinsEarned}</span>
          <span className={styles.statLabel}>🪙 Coins</span>
        </div>
      </div>

      {isFirstCompletion && (
        <div className={styles.firstClear}>
          🌟 First Clear Bonus! +{coinsEarned} coins earned!
        </div>
      )}

      {/* Words learned */}
      {wordsLearned.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Words Learned</h2>
          <div className={styles.chips}>
            {wordsLearned.map((w) => (
              <span key={w} className={styles.chip}>{w}</span>
            ))}
          </div>
        </div>
      )}

      {/* New achievements */}
      {newAchs.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🏆 New Achievement{newAchs.length > 1 ? 's' : ''}!</h2>
          {newAchs.map((a) => (
            <div key={a.id} className={styles.achCard}>
              <span style={{ fontSize: 28 }}>{a.icon}</span>
              <div>
                <p style={{ fontWeight: 800, color: 'var(--deep-midnight)' }}>{a.name}</p>
                <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Foxy message */}
      <div className={styles.foxyMessage}>
        "Adventure complete! You made real progress today. Want to try one more short mission, or take a break?"
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <Button onClick={onContinue} variant="primary" size="lg" fullWidth>
          🚀 Continue Adventure
        </Button>
        <Button onClick={onReturnToMap} variant="secondary" size="md" fullWidth>
          🗺️ Return to Map
        </Button>
      </div>
    </div>
  );
}
