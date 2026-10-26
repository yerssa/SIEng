import { useState } from 'react';
import type { GameState } from '../types';
import { questionBank } from '../data/questionBank';
import FoxyCharacter from '../components/FoxyCharacter';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import styles from './BossBattleScreen.module.css';

interface Props {
  state?: GameState;
  onVictory: () => void;
  onBack: () => void;
}

const BOSS_QUESTION_IDS = ['b001', 'b002', 'b003', 'b004', 'b005'];

export default function BossBattleScreen({ onVictory, onBack }: Props) {
  const questions = BOSS_QUESTION_IDS
    .map((id) => questionBank.find((q) => q.id === id))
    .filter(Boolean) as typeof questionBank;

  const [phase, setPhase] = useState<'intro' | 'battle' | 'victory' | 'defeat'>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [bossHP, setBossHP] = useState(100);
  const [playerHP, setPlayerHP] = useState(100);

  const currentQ = questions[questionIndex];
  const isCorrect = selected === currentQ?.correctAnswer;

  const handleAnswer = (opt: string) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    const correct = opt === currentQ?.correctAnswer;
    if (correct) {
      setBossHP((hp) => Math.max(0, hp - 20));
    } else {
      setPlayerHP((hp) => Math.max(0, hp - 15));
    }
  };

  const handleNext = () => {
    setSelected(null);
    setAnswered(false);

    const bossWillDie = isCorrect && bossHP - 20 <= 0;
    const playerWillDie = !isCorrect && playerHP - 15 <= 0;

    if (bossWillDie || (questionIndex >= questions.length - 1 && bossHP <= playerHP)) {
      setPhase('victory');
      onVictory();
      return;
    }

    if (playerWillDie) {
      setPhase('defeat');
      return;
    }

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      setPhase('victory');
      onVictory();
    }
  };

  if (phase === 'intro') {
    return (
      <div className={styles.screen}>
        <div className={styles.intro}>
          <BossIllustration shake={false} />
          <h1 className={styles.bossName}>Crystal Guardian</h1>
          <p className={styles.bossDesc}>
            The ancient guardian of Crystal Castle stands before you. Answer its questions to defeat it!
          </p>
          <FoxyCharacter mood="surprised" size={100} animate />
          <div className={styles.foxyMessage}>
            "This is the hardest challenge! Use everything you've learned. I believe in you! 🦊"
          </div>
          <div className={styles.introBtns}>
            <Button onClick={() => setPhase('battle')} variant="primary" size="lg" fullWidth>
              ⚔️ Begin Battle!
            </Button>
            <Button onClick={onBack} variant="ghost">← Back</Button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'victory') {
    return (
      <div className={styles.screen}>
        <div className={styles.victory}>
          <FoxyCharacter mood="celebrating" size={140} animate />
          <h1 className={styles.victoryTitle}>🏆 Victory!</h1>
          <p className={styles.victoryText}>You defeated the Crystal Guardian! Crystal Castle is yours!</p>
          <div className={styles.rewards}>
            <div className={styles.reward}><span>+50 XP</span> ✨</div>
            <div className={styles.reward}><span>+30 Coins</span> 🪙</div>
            <div className={styles.reward}><span>Crystal Seeker</span> 💎</div>
          </div>
          <Button onClick={onBack} variant="primary" size="lg" fullWidth>
            🗺️ Return to Map
          </Button>
        </div>
      </div>
    );
  }

  if (phase === 'defeat') {
    return (
      <div className={styles.screen}>
        <div className={styles.defeat}>
          <FoxyCharacter mood="encouraging" size={120} animate />
          <h1 className={styles.defeatTitle}>Keep Trying!</h1>
          <p className={styles.defeatText}>
            The guardian was too strong this time — but that's okay! Review your lessons and come back stronger!
          </p>
          <div className={styles.introBtns}>
            <Button onClick={() => {
              setPhase('intro');
              setQuestionIndex(0);
              setSelected(null);
              setAnswered(false);
              setBossHP(100);
              setPlayerHP(100);
            }} variant="primary" size="lg" fullWidth>
              🔄 Try Again
            </Button>
            <Button onClick={onBack} variant="secondary" size="md" fullWidth>
              ← Return to Map
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Battle phase
  return (
    <div className={styles.screen}>
      {/* HP bars */}
      <div className={styles.battleHeader}>
        <div className={styles.hpRow}>
          <div className={styles.hpBlock}>
            <span className={styles.hpLabel}>👤 You</span>
            <ProgressBar value={playerHP} color="var(--success)" height={10} />
            <span className={styles.hpValue}>{playerHP}%</span>
          </div>
          <div className={styles.vs}>⚔️</div>
          <div className={styles.hpBlock}>
            <span className={styles.hpLabel}>💎 Guardian</span>
            <ProgressBar value={bossHP} color="var(--electric-cyan)" height={10} />
            <span className={styles.hpValue}>{bossHP}%</span>
          </div>
        </div>
        <div className={styles.questionCounter}>
          Question {questionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Boss */}
      <div className={styles.bossArea}>
        <BossIllustration shake={answered && !isCorrect} />
      </div>

      {/* Foxy */}
      <div className={styles.foxyRow}>
        <FoxyCharacter
          mood={!answered ? 'thinking' : isCorrect ? 'celebrating' : 'encouraging'}
          size={70}
          animate
        />
        <div className={styles.foxyBubble} aria-live="polite">
          {!answered
            ? 'Careful — this one is tough!'
            : isCorrect
            ? '💪 Direct hit! Keep going!'
            : `💡 Hint: ${currentQ?.explanation.slice(0, 60)}...`}
        </div>
      </div>

      {/* Question */}
      <div className={styles.questionArea}>
        <div className={styles.questionBox}>
          <span className={styles.bossTag}>💎 Boss Challenge</span>
          <p className={styles.questionText}>{currentQ?.text}</p>
        </div>

        <div className={styles.options} role="group" aria-label="Answer options">
          {currentQ?.options?.map((opt) => {
            let cls = styles.option;
            if (answered) {
              if (opt === currentQ.correctAnswer) cls = `${styles.option} ${styles.correct}`;
              else if (opt === selected) cls = `${styles.option} ${styles.wrong}`;
              else cls = `${styles.option} ${styles.dim}`;
            }
            return (
              <button key={opt} className={cls} onClick={() => handleAnswer(opt)} disabled={answered}>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
            <span>{isCorrect ? '✅' : '💡'}</span>
            <p>{currentQ?.explanation}</p>
          </div>
        )}

        {answered && (
          <Button onClick={handleNext} variant="primary" size="md" fullWidth>
            {questionIndex < questions.length - 1 ? 'Next Attack →' : '⚔️ Final Blow!'}
          </Button>
        )}
      </div>
    </div>
  );
}

function BossIllustration({ shake }: { shake: boolean }) {
  return (
    <div className={`${styles.boss} ${shake ? styles.shake : ''}`} aria-hidden="true">
      <svg viewBox="0 0 160 180" width="140" height="157" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="crystalGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A0ECFF" />
            <stop offset="100%" stopColor="#0099CC" />
          </radialGradient>
        </defs>
        {/* Body */}
        <polygon points="80,10 130,60 120,130 80,160 40,130 30,60" fill="url(#crystalGrad)" opacity="0.9" />
        {/* Crystal shards */}
        <polygon points="80,10 95,35 80,30" fill="#E0F8FF" opacity="0.8" />
        <polygon points="130,60 115,75 120,55" fill="#E0F8FF" opacity="0.6" />
        <polygon points="30,60 45,75 40,55" fill="#E0F8FF" opacity="0.6" />
        {/* Eyes */}
        <ellipse cx="65" cy="80" rx="12" ry="14" fill="#10203D" />
        <ellipse cx="95" cy="80" rx="12" ry="14" fill="#10203D" />
        <ellipse cx="62" cy="76" rx="5" ry="6" fill="#39D8F2" />
        <ellipse cx="92" cy="76" rx="5" ry="6" fill="#39D8F2" />
        <circle cx="61" cy="74" r="2" fill="white" />
        <circle cx="91" cy="74" r="2" fill="white" />
        {/* Mouth */}
        <path d="M65,105 Q80,115 95,105" fill="none" stroke="#10203D" strokeWidth="3" strokeLinecap="round" />
        {/* Crown */}
        <polygon points="50,20 65,5 80,18 95,5 110,20 105,35 55,35" fill="#FFD700" opacity="0.9" />
        <circle cx="65" cy="10" r="5" fill="#FF852F" />
        <circle cx="80" cy="8" r="5" fill="#FF6B6B" />
        <circle cx="95" cy="10" r="5" fill="#B8A4FF" />
        {/* Glow */}
        <ellipse cx="80" cy="90" rx="65" ry="75" fill="rgba(57,216,242,0.06)" />
      </svg>
    </div>
  );
}
