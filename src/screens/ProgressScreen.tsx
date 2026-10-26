import type { GameState } from '../types';
import ProgressBar from '../components/ProgressBar';
import { questionBank } from '../data/questionBank';
import { getDueReviews } from '../game/reviewScheduler';
import styles from './ProgressScreen.module.css';

interface Props {
  state: GameState;
}

export default function ProgressScreen({ state }: Props) {
  const { player, worlds, reviewQueue } = state;
  const totalMissions = worlds.reduce((s, w) => s + w.missions.filter((m) => m.completed).length, 0);
  const dueReviews = getDueReviews(reviewQueue);

  // Calculate mastery per skill
  const grammarDone = worlds.find((w) => w.skill === 'grammar')?.missions.filter((m) => m.completed).length ?? 0;
  const listeningDone = worlds.find((w) => w.skill === 'listening')?.missions.filter((m) => m.completed).length ?? 0;
  const readingDone = worlds.find((w) => w.skill === 'reading')?.missions.filter((m) => m.completed).length ?? 0;

  const vocabPct = Math.min(100, (player.totalWordsLearned / 30) * 100);
  const grammarPct = Math.min(100, (grammarDone / 3) * 100);
  const readingPct = Math.min(100, (readingDone / 2) * 100);
  const listeningPct = Math.min(100, (listeningDone / 2) * 100);

  const dueQs = dueReviews.map((item) => questionBank.find((q) => q.id === item.questionId)).filter(Boolean);

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>Learning Progress</h1>
        <p className={styles.subtitle}>Track your English journey!</p>
      </div>

      {totalMissions === 0 ? (
        <div className={styles.empty}>
          <span style={{ fontSize: 64 }}>🌱</span>
          <h2 className={styles.emptyTitle}>Your journey starts now!</h2>
          <p className={styles.emptyText}>Complete your first mission to see your progress here.</p>
        </div>
      ) : (
        <>
          {/* Skill mastery */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Skill Mastery</h2>
            <div className={styles.skillList}>
              <div className={styles.skill}>
                <div className={styles.skillHeader}>
                  <span>📚 Vocabulary</span>
                  <span className={styles.pct}>{Math.round(vocabPct)}%</span>
                </div>
                <ProgressBar value={vocabPct} color="var(--forest-green)" height={10} />
                <span className={styles.skillNote}>{player.totalWordsLearned} words learned</span>
              </div>
              <div className={styles.skill}>
                <div className={styles.skillHeader}>
                  <span>⚡ Grammar</span>
                  <span className={styles.pct}>{Math.round(grammarPct)}%</span>
                </div>
                <ProgressBar value={grammarPct} color="var(--lavender)" height={10} />
                <span className={styles.skillNote}>{player.totalGrammarChallenges} challenges done</span>
              </div>
              <div className={styles.skill}>
                <div className={styles.skillHeader}>
                  <span>📖 Reading</span>
                  <span className={styles.pct}>{Math.round(readingPct)}%</span>
                </div>
                <ProgressBar value={readingPct} color="var(--gold)" height={10} />
                <span className={styles.skillNote}>{readingDone} missions done</span>
              </div>
              <div className={styles.skill}>
                <div className={styles.skillHeader}>
                  <span>🎧 Listening</span>
                  <span className={styles.pct}>{Math.round(listeningPct)}%</span>
                </div>
                <ProgressBar value={listeningPct} color="var(--electric-cyan)" height={10} />
                <span className={styles.skillNote}>{player.totalListeningActivities} activities done</span>
              </div>
            </div>
          </div>

          {/* Summary stats */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Summary</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📋</span>
                <span className={styles.statNum}>{totalMissions}</span>
                <span className={styles.statLbl}>Missions Completed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>📚</span>
                <span className={styles.statNum}>{player.totalWordsLearned}</span>
                <span className={styles.statLbl}>Words Learned</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🌍</span>
                <span className={styles.statNum}>{player.totalWorldsExplored}</span>
                <span className={styles.statLbl}>Worlds Explored</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statIcon}>🧠</span>
                <span className={styles.statNum}>{player.totalRecallSuccess}</span>
                <span className={styles.statLbl}>Reviews Done</span>
              </div>
            </div>
          </div>

          {/* Review queue */}
          {dueQs.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>🔄 Review Queue ({dueQs.length})</h2>
              <div className={styles.reviewList}>
                {dueQs.slice(0, 5).map((q) => q && (
                  <div key={q.id} className={styles.reviewItem}>
                    <span className={styles.reviewSkill}>{SKILL_EMOJI[q.skill]} {q.skill}</span>
                    <span className={styles.reviewQ}>{q.text.slice(0, 60)}...</span>
                  </div>
                ))}
                {dueQs.length > 5 && (
                  <p className={styles.reviewMore}>+{dueQs.length - 5} more due for review</p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ height: 80 }} />
    </div>
  );
}

const SKILL_EMOJI: Record<string, string> = {
  vocabulary: '📚',
  grammar: '⚡',
  reading: '📖',
  listening: '🎧',
  speaking: '🎤',
  boss: '💎',
};
