import { useState } from 'react';
import type { PlayerLevel } from '../types';
import { questionBank } from '../data/questionBank';
import FoxyCharacter from '../components/FoxyCharacter';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import styles from './PlacementQuizScreen.module.css';

interface Props {
  nickname: string;
  onComplete: (level: PlayerLevel) => void;
}

// 10 placement questions spanning difficulty 1-3
const PLACEMENT_IDS = ['v001', 'v009', 'v014', 'v019', 'v023', 'g001', 'g005', 'g004', 'r001', 'g008'];

function calcLevel(score: number): PlayerLevel {
  if (score >= 9) return 'Champion';
  if (score >= 7) return 'Adventurer';
  if (score >= 5) return 'Rookie';
  if (score >= 3) return 'Explorer';
  return 'Explorer';
}

const LEVEL_INFO: Record<PlayerLevel, { label: string; desc: string; color: string; emoji: string }> = {
  Explorer: { label: 'Explorer', desc: 'You\'re starting your journey — perfect! We\'ll build your English from the ground up.', color: '#39D8F2', emoji: '🌱' },
  Rookie: { label: 'Rookie', desc: 'Great start! You know some English and we\'ll help you learn a lot more!', color: '#3DBE7A', emoji: '⭐' },
  Adventurer: { label: 'Adventurer', desc: 'Impressive! You have solid English skills and exciting challenges await!', color: '#FF852F', emoji: '🚀' },
  Champion: { label: 'Champion', desc: 'Wow, excellent work! You\'re already a strong English learner!', color: '#FFD700', emoji: '🏆' },
  MasterExplorer: { label: 'Master Explorer', desc: 'Outstanding! Advanced challenges await you in the Crystal Castle!', color: '#B8A4FF', emoji: '💎' },
};

export default function PlacementQuizScreen({ nickname, onComplete }: Props) {
  const questions = PLACEMENT_IDS.map((id) => questionBank.find((q) => q.id === id)!).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [level, setLevel] = useState<PlayerLevel>('Explorer');

  const current = questions[index];
  const isCorrect = selected === current?.correctAnswer;

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === current.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const lvl = calcLevel(score + (isCorrect ? 1 : 0));
      setLevel(lvl);
      setDone(true);
    }
  };

  if (done) {
    const info = LEVEL_INFO[level];
    return (
      <div className={styles.screen}>
        <div className={styles.resultScreen}>
          <FoxyCharacter mood="celebrating" size={130} animate />
          <div className={styles.resultBadge} style={{ background: `${info.color}20`, borderColor: info.color }}>
            <span style={{ fontSize: 40 }}>{info.emoji}</span>
            <span className={styles.resultLevel} style={{ color: info.color }}>{info.label}</span>
          </div>
          <h1 className={styles.resultTitle}>Your Level: {info.label}</h1>
          <p className={styles.resultScore}>You answered {score + (isCorrect ? 1 : 0)} out of {questions.length} correctly!</p>
          <p className={styles.resultDesc}>{info.desc}</p>
          <p className={styles.disclaimer}>
            This is an approximate estimate. The game will adjust as you learn!
          </p>
          <Button onClick={() => onComplete(level)} variant="primary" size="lg" fullWidth>
            🌍 Start My Adventure, {nickname}!
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1 className={styles.quizTitle}>Placement Quiz</h1>
          <span className={styles.counter}>{index + 1}/{questions.length}</span>
        </div>
        <ProgressBar value={index + 1} max={questions.length} color="var(--electric-cyan)" />
      </div>

      <div className={styles.content}>
        <div className={styles.foxyRow}>
          <FoxyCharacter
            mood={answered ? (isCorrect ? 'happy' : 'encouraging') : 'explaining'}
            size={80}
            animate
          />
          <div className={styles.bubble}>
            {!answered
              ? "Let's see what you know!"
              : isCorrect
              ? 'Brilliant! That\'s correct! ✨'
              : `Almost! The answer is: ${current.correctAnswer}`}
          </div>
        </div>

        <div className={styles.questionCard}>
          <div className={styles.questionBadge}>
            {current.skill === 'vocabulary' ? '📚 Vocabulary' : current.skill === 'grammar' ? '⚡ Grammar' : '📖 Reading'}
          </div>
          <p className={styles.questionText}>{current.text}</p>
        </div>

        <div className={styles.options} role="group" aria-label="Answer choices">
          {current.options?.map((opt) => {
            let state = '';
            if (answered) {
              if (opt === current.correctAnswer) state = 'correct';
              else if (opt === selected) state = 'wrong';
            }
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={answered}
                className={`${styles.option} ${answered && opt === selected ? styles.selected : ''} ${styles[state]}`}
                aria-pressed={selected === opt}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={styles.explanation}>
            <p>💡 {current.explanation}</p>
          </div>
        )}

        {answered && (
          <Button onClick={handleNext} variant="primary" size="md" fullWidth>
            {index < questions.length - 1 ? 'Next Question →' : 'See My Results!'}
          </Button>
        )}
      </div>
    </div>
  );
}
