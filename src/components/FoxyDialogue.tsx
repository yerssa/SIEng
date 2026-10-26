import { useState, useEffect } from 'react';
import styles from './FoxyDialogue.module.css';

interface Props {
  lines: string[];
  onComplete?: () => void;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export default function FoxyDialogue({ lines, onComplete, autoAdvance = false, autoAdvanceDelay = 2500 }: Props) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    setCurrentLine(0);
    setDisplayed('');
    setTyping(true);
  }, [lines]);

  useEffect(() => {
    if (currentLine >= lines.length) return;
    const text = lines[currentLine];
    setDisplayed('');
    setTyping(true);

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setTyping(false);
        if (autoAdvance) {
          setTimeout(() => advance(), autoAdvanceDelay);
        }
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentLine, lines]);

  const advance = () => {
    if (typing) {
      // Complete current line instantly
      setDisplayed(lines[currentLine]);
      setTyping(false);
      return;
    }
    const next = currentLine + 1;
    if (next >= lines.length) {
      onComplete?.();
    } else {
      setCurrentLine(next);
    }
  };

  if (lines.length === 0) return null;

  return (
    <button
      className={styles.bubble}
      onClick={advance}
      aria-live="polite"
      aria-label={`Foxy says: ${displayed}`}
    >
      <p className={styles.text}>{displayed}</p>
      {!typing && currentLine < lines.length - 1 && (
        <span className={styles.tap} aria-hidden="true">Tap to continue ›</span>
      )}
      {!typing && currentLine === lines.length - 1 && (
        <span className={styles.tap} aria-hidden="true">Tap ›</span>
      )}
      {/* Progress dots */}
      {lines.length > 1 && (
        <div className={styles.dots} role="presentation">
          {lines.map((_, i) => (
            <span key={i} className={`${styles.dot} ${i === currentLine ? styles.dotActive : ''}`} />
          ))}
        </div>
      )}
    </button>
  );
}
