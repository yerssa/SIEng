import { useState, useEffect } from 'react';
import FoxyCharacter from '../components/FoxyCharacter';
import Button from '../components/Button';
import styles from './IntroScreen.module.css';

interface Props {
  hasSave: boolean;
  onStart: () => void;
  onContinue: () => void;
}

const DIALOGUE = [
  "Hey, Explorer! I'm Foxy! 🦊",
  "Ready to unlock a whole new world with English?",
  "Every word you learn gives you a new power!",
  "Let's discover your English level and begin your adventure!",
];

export default function IntroScreen({ hasSave, onStart, onContinue }: Props) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);
  const [foxyIn, setFoxyIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFoxyIn(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const text = DIALOGUE[dialogueIndex];
    setDisplayed('');
    setTyping(true);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(iv);
        setTyping(false);
      }
    }, 28);
    return () => clearInterval(iv);
  }, [dialogueIndex]);

  const advance = () => {
    if (typing) {
      setDisplayed(DIALOGUE[dialogueIndex]);
      setTyping(false);
      return;
    }
    if (dialogueIndex < DIALOGUE.length - 1) {
      setDialogueIndex((i) => i + 1);
    }
  };

  const showButtons = dialogueIndex === DIALOGUE.length - 1 && !typing;

  return (
    <div className={styles.screen}>
      {/* Background landscape */}
      <div className={styles.landscape} aria-hidden="true">
        {/* Sky */}
        <div className={styles.sky} />
        {/* Stars / particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${(i * 37 + 11) % 100}%`,
              top: `${(i * 23 + 7) % 60}%`,
              animationDelay: `${(i * 0.3) % 3}s`,
              width: i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2,
            }}
          />
        ))}
        {/* Floating islands */}
        <svg viewBox="0 0 400 300" className={styles.islands} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          {/* Distant mountains */}
          <path d="M0,200 Q80,100 160,180 Q240,100 320,160 Q380,100 430,170 L430,300 L0,300 Z"
            fill="#1E3A6E" opacity="0.6" />
          {/* Middle layer */}
          <path d="M0,230 Q60,160 130,210 Q200,150 280,200 Q340,155 400,190 L400,300 L0,300 Z"
            fill="#10203D" opacity="0.8" />
          {/* Ground */}
          <path d="M0,260 Q100,240 200,255 Q300,238 400,252 L400,300 L0,300 Z"
            fill="#0A1628" />
          {/* Glowing portal */}
          <ellipse cx="310" cy="175" rx="38" ry="55" fill="rgba(57,216,242,0.08)"
            className={styles.portalGlow} />
          <ellipse cx="310" cy="175" rx="28" ry="42" fill="none" stroke="#39D8F2" strokeWidth="3"
            opacity="0.7" className={styles.portalRing} />
          <ellipse cx="310" cy="175" rx="18" ry="28" fill="rgba(57,216,242,0.15)"
            className={styles.portalInner} />
          {/* Portal symbols */}
          <text x="306" y="162" fill="#39D8F2" fontSize="10" opacity="0.8" fontFamily="sans-serif">A</text>
          <text x="306" y="182" fill="#C8F45B" fontSize="10" opacity="0.8" fontFamily="sans-serif">B</text>
          <text x="303" y="202" fill="#FF852F" fontSize="10" opacity="0.8" fontFamily="sans-serif">abc</text>
          {/* Trees */}
          <circle cx="60" cy="225" r="20" fill="#2D6A4F" />
          <circle cx="60" cy="210" r="15" fill="#40916C" />
          <rect x="57" y="232" width="6" height="15" fill="#1B4332" rx="2" />
          <circle cx="340" cy="235" r="16" fill="#2D6A4F" />
          <circle cx="340" cy="222" r="12" fill="#40916C" />
          <rect x="337" y="241" width="6" height="12" fill="#1B4332" rx="2" />
          {/* Glowing plants */}
          <ellipse cx="100" cy="258" rx="8" ry="12" fill="#C8F45B" opacity="0.4" />
          <ellipse cx="100" cy="256" rx="5" ry="8" fill="#C8F45B" opacity="0.6" />
          <ellipse cx="270" cy="260" rx="7" ry="10" fill="#39D8F2" opacity="0.4" />
          {/* Floating island */}
          <ellipse cx="80" cy="130" rx="45" ry="18" fill="#2D6A4F" />
          <ellipse cx="80" cy="138" rx="45" ry="12" fill="#1B4332" />
          <circle cx="68" cy="120" r="10" fill="#40916C" />
          <circle cx="80" cy="115" r="13" fill="#52B788" />
          <circle cx="93" cy="121" r="9" fill="#40916C" />
          {/* Stars in sky */}
          <circle cx="50" cy="40" r="2" fill="white" opacity="0.8" />
          <circle cx="130" cy="25" r="1.5" fill="white" opacity="0.6" />
          <circle cx="200" cy="50" r="2" fill="white" opacity="0.7" />
          <circle cx="250" cy="30" r="1.5" fill="white" opacity="0.8" />
          <circle cx="370" cy="45" r="2" fill="white" opacity="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg viewBox="0 0 160 48" width="160" height="48" xmlns="http://www.w3.org/2000/svg" aria-label="SIEng">
            <text x="4" y="38" fontFamily="'Fredoka One',sans-serif" fontSize="42" fill="white"
              fontWeight="bold">SIEng</text>
            {/* Fox tail motif */}
            <path d="M148,8 Q158,20 148,32 Q144,26 150,20 Q144,14 148,8 Z"
              fill="#FF852F" opacity="0.9" />
          </svg>
          <p className={styles.tagline}>Play smart. Speak English.</p>
        </div>

        {/* Foxy */}
        <div className={`${styles.foxyWrap} ${foxyIn ? styles.foxyIn : ''}`}>
          <FoxyCharacter mood={showButtons ? 'celebrating' : 'explaining'} size={150} animate />
        </div>

        {/* Dialogue */}
        <button className={styles.dialogue} onClick={advance} aria-live="polite">
          <p className={styles.dialogueText}>{displayed}</p>
          {!typing && dialogueIndex < DIALOGUE.length - 1 && (
            <span className={styles.tapHint}>Tap to continue ›</span>
          )}
          <div className={styles.dots}>
            {DIALOGUE.map((_, i) => (
              <span key={i} className={`${styles.dot} ${i === dialogueIndex ? styles.dotActive : ''}`} />
            ))}
          </div>
        </button>

        {/* Buttons */}
        {showButtons && (
          <div className={styles.actions}>
            <Button onClick={onStart} variant="primary" size="lg" fullWidth>
              🚀 Start My Adventure
            </Button>
            {hasSave && (
              <Button onClick={onContinue} variant="secondary" size="md" fullWidth>
                ▶ Continue My Journey
              </Button>
            )}
            <Button onClick={onStart} variant="ghost" size="sm">
              Skip Intro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
