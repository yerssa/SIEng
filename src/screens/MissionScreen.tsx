import { useState, useCallback } from 'react';
import type { GameState, Question } from '../types';
import { questionBank } from '../data/questionBank';
import FoxyCharacter from '../components/FoxyCharacter';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { calculateMissionReward } from '../game/rewards';
import styles from './MissionScreen.module.css';

interface Props {
  state: GameState;
  onComplete: (result: ReturnType<typeof calculateMissionReward>, worldId: string) => void;
  onBack: () => void;
}

type Stage = 'introduce' | 'show' | 'practice' | 'challenge' | 'recall' | 'reward';

export default function MissionScreen({ state, onComplete, onBack }: Props) {
  const worldId = state.currentWorldId!;
  const missionId = state.currentMissionId!;
  const world = state.worlds.find((w) => w.id === worldId);
  const mission = world?.missions.find((m) => m.id === missionId);

  const questions = (mission?.questionIds ?? [])
    .map((id) => questionBank.find((q) => q.id === id))
    .filter((q): q is Question => !!q);

  const [stage, setStage] = useState<Stage>('introduce');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wordsLearned, setWordsLearned] = useState<string[]>([]);
  const [showExit, setShowExit] = useState(false);

  const totalQuestions = questions.length;
  const currentQ = questions[questionIndex];
  const isCorrect = selected === currentQ?.correctAnswer;

  // TTS — always active for listening skill questions; respects soundEnabled for others
  const speak = (text: string, forcePlay = false) => {
    if (!forcePlay && !state.settings.soundEnabled) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const handleAnswer = useCallback((answer: string) => {
    if (answered) return;
    setSelected(answer);
    setAnswered(true);
    const correct = answer === currentQ?.correctAnswer;
    if (correct) {
      setCorrectCount((c) => c + 1);
      if (currentQ?.skill === 'vocabulary') {
        setWordsLearned((w) => [...w, currentQ.correctAnswer]);
      }
    }
  }, [answered, currentQ]);

  const handleNext = useCallback(() => {
    setSelected(null);
    setAnswered(false);

    if (questionIndex < totalQuestions - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      // Move to reward stage
      const isFirst = !mission?.firstCompletionRewarded;
      const result = calculateMissionReward(
        missionId,
        correctCount + (isCorrect ? 1 : 0),
        totalQuestions,
        isFirst,
        wordsLearned,
      );
      onComplete(result, worldId);
    }
  }, [questionIndex, totalQuestions, correctCount, isCorrect, wordsLearned, missionId, worldId, mission, onComplete]);

  if (stage === 'introduce') {
    return (
      <div className={styles.screen}>
        <div className={styles.stageHeader}>
          <button onClick={() => setShowExit(true)} className={styles.exitBtn} aria-label="Exit mission">✕</button>
          <span className={styles.stageName}>1/6 Introduce</span>
        </div>
        <div className={styles.introduceContent}>
          <FoxyCharacter mood="explaining" size={130} animate />
          <div className={styles.missionTitle}>
            <h1>{mission?.name ?? 'Mission'}</h1>
            <p>{mission?.description}</p>
          </div>
          <div className={styles.missionInfo}>
            <span className={styles.infoBadge}>
              {SKILL_EMOJI[world?.skill ?? 'vocabulary']} {SKILL_NAMES[world?.skill ?? 'vocabulary']}
            </span>
            <span className={styles.infoBadge}>📝 {totalQuestions} questions</span>
            <span className={styles.infoBadge}>⏱ ~3-5 min</span>
          </div>
          <div className={styles.foxySpeech}>
            "Let's explore {world?.name}! I'll help you learn every step of the way! 🦊"
          </div>
          <Button onClick={() => setStage('show')} variant="primary" size="lg" fullWidth>
            ▶ Start Mission!
          </Button>
        </div>
        {showExit && <ExitConfirm onLeave={onBack} onStay={() => setShowExit(false)} />}
      </div>
    );
  }

  if (stage === 'show') {
    const q = questions[0];
    return (
      <div className={styles.screen}>
        <div className={styles.stageHeader}>
          <button onClick={() => setShowExit(true)} className={styles.exitBtn}>✕</button>
          <span className={styles.stageName}>2/6 Example</span>
        </div>
        <div className={styles.showContent}>
          <FoxyCharacter mood="happy" size={100} animate />
          <div className={styles.exampleCard}>
            <p className={styles.exampleLabel}>Here's an example:</p>
            <p className={styles.exampleQ}>{q?.text}</p>
            <div className={styles.exampleAnswer}>
              <span className={styles.answerLabel}>Answer:</span>
              <span className={styles.answerValue}>{q?.correctAnswer}</span>
            </div>
            <p className={styles.exampleExp}>{q?.explanation}</p>
            {q?.skill === 'listening' && (
              <button className={styles.listenBtn} onClick={() => speak(q.text, true)} aria-label="Listen to question">
                🎧 Listen
              </button>
            )}
          </div>
          <Button onClick={() => setStage('practice')} variant="primary" size="md" fullWidth>
            I'm Ready to Practice!
          </Button>
        </div>
        {showExit && <ExitConfirm onLeave={onBack} onStay={() => setShowExit(false)} />}
      </div>
    );
  }

  // Main question stages (practice, challenge)
  if (!currentQ) return null;

  return (
    <div className={styles.screen}>
      {/* Header */}
      <div className={styles.questionHeader}>
        <button onClick={() => setShowExit(true)} className={styles.exitBtn} aria-label="Exit mission">✕</button>
        <div className={styles.progressWrap}>
          <ProgressBar value={questionIndex} max={totalQuestions} color="var(--fox-orange)" height={8} />
        </div>
        <span className={styles.questionCount}>{questionIndex + 1}/{totalQuestions}</span>
      </div>

      {/* Foxy feedback row */}
      <div className={styles.foxyFeedback}>
        <FoxyCharacter
          mood={!answered ? 'idle' : isCorrect ? 'celebrating' : 'encouraging'}
          size={72}
          animate
        />
        <div className={styles.foxyBubble} aria-live="polite">
          {!answered
            ? getFoxyPrompt(currentQ.skill)
            : isCorrect
            ? getCorrectMessage()
            : `Almost! The answer is: "${currentQ.correctAnswer}"`}
        </div>
      </div>

      {/* Question */}
      <div className={styles.questionArea}>
        {currentQ.skill === 'listening' && (
          <button className={styles.listenBtn} onClick={() => speak(currentQ.text, true)} aria-label="Listen to this question">
            🎧 Listen to question
          </button>
        )}
        <div className={styles.questionBox}>
          <span className={styles.skillTag}>
            {SKILL_EMOJI[currentQ.skill]} {SKILL_NAMES[currentQ.skill]}
          </span>
          <p className={styles.questionText}>{currentQ.text}</p>
        </div>

        {/* Options */}
        {currentQ.options && (
          <div className={styles.optionsGrid} role="group" aria-label="Answer options">
            {currentQ.options.map((opt) => {
              let cls = styles.option;
              if (answered) {
                if (opt === currentQ.correctAnswer) cls = `${styles.option} ${styles.correct}`;
                else if (opt === selected) cls = `${styles.option} ${styles.wrong}`;
                else cls = `${styles.option} ${styles.dim}`;
              }
              return (
                <button
                  key={opt}
                  className={cls}
                  onClick={() => handleAnswer(opt)}
                  disabled={answered}
                  aria-pressed={selected === opt}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Explanation */}
        {answered && (
          <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`} aria-live="polite">
            <span className={styles.feedbackIcon}>{isCorrect ? '✅' : '💡'}</span>
            <p>{currentQ.explanation}</p>
          </div>
        )}

        {answered && (
          <Button onClick={handleNext} variant="primary" size="md" fullWidth>
            {questionIndex < totalQuestions - 1 ? 'Next →' : '🎉 Finish!'}
          </Button>
        )}
      </div>

      {showExit && <ExitConfirm onLeave={onBack} onStay={() => setShowExit(false)} />}
    </div>
  );
}

function ExitConfirm({ onLeave, onStay }: { onLeave: () => void; onStay: () => void }) {
  return (
    <div className={styles.exitBackdrop} role="dialog" aria-modal="true" aria-label="Exit mission?">
      <div className={styles.exitPanel}>
        <h2 className={styles.exitTitle}>Leave mission?</h2>
        <p className={styles.exitText}>Your progress on this mission will be lost.</p>
        <div className={styles.exitBtns}>
          <Button onClick={onLeave} variant="danger" size="md">Leave</Button>
          <Button onClick={onStay} variant="secondary" size="md">Keep Playing</Button>
        </div>
      </div>
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

const SKILL_NAMES: Record<string, string> = {
  vocabulary: 'Vocabulary',
  grammar: 'Grammar',
  reading: 'Reading',
  listening: 'Listening',
  speaking: 'Speaking',
  boss: 'Boss Challenge',
};

const CORRECT_MESSAGES = [
  'Brilliant! You unlocked a new word! ✨',
  'Excellent! You\'re on fire! 🔥',
  'Perfect! Keep it up! 🌟',
  'Amazing work, Explorer! 🦊',
  'Yes! You\'ve got it! 💪',
];

const PROMPTS: Record<string, string> = {
  vocabulary: 'What\'s the right answer?',
  grammar: 'Choose the grammatically correct option!',
  reading: 'Read carefully and choose!',
  listening: 'Listen and choose the correct answer!',
  speaking: 'Which phrase is correct?',
  boss: 'This is a tough one — think carefully!',
};

function getCorrectMessage() {
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}

function getFoxyPrompt(skill: string) {
  return PROMPTS[skill] ?? 'What\'s the right answer?';
}
