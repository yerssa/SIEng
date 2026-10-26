import type { FoxyMood } from '../types';
import styles from './FoxyCharacter.module.css';

interface Props {
  mood?: FoxyMood;
  size?: number;
  animate?: boolean;
  className?: string;
}

// Expression configs per mood
const MOODS: Record<FoxyMood, {
  eyeShape: string;
  mouthPath: string;
  eyebrowLeft: string;
  eyebrowRight: string;
  blush: boolean;
  sparkles: boolean;
  tailWag: boolean;
}> = {
  idle: {
    eyeShape: 'M-6,0 Q0,-6 6,0 Q0,6 -6,0',
    mouthPath: 'M-8,0 Q0,4 8,0',
    eyebrowLeft: 'M-14,-2 Q-10,-5 -6,-2',
    eyebrowRight: 'M6,-2 Q10,-5 14,-2',
    blush: false,
    sparkles: false,
    tailWag: false,
  },
  happy: {
    eyeShape: 'M-6,2 Q0,-8 6,2',
    mouthPath: 'M-10,0 Q0,10 10,0',
    eyebrowLeft: 'M-14,-4 Q-10,-8 -6,-4',
    eyebrowRight: 'M6,-4 Q10,-8 14,-4',
    blush: true,
    sparkles: false,
    tailWag: true,
  },
  thinking: {
    eyeShape: 'M-6,0 Q0,-4 6,0',
    mouthPath: 'M-6,2 Q2,-2 8,2',
    eyebrowLeft: 'M-14,-2 Q-10,-6 -6,0',
    eyebrowRight: 'M6,-4 Q10,-2 14,-2',
    blush: false,
    sparkles: false,
    tailWag: false,
  },
  surprised: {
    eyeShape: 'M-7,0 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0',
    mouthPath: 'M-6,2 a6,6 0 0,0 12,0',
    eyebrowLeft: 'M-14,-6 Q-10,-10 -6,-6',
    eyebrowRight: 'M6,-6 Q10,-10 14,-6',
    blush: false,
    sparkles: false,
    tailWag: false,
  },
  explaining: {
    eyeShape: 'M-6,0 Q0,-5 6,0 Q0,5 -6,0',
    mouthPath: 'M-8,-1 L-4,3 L4,3 L8,-1',
    eyebrowLeft: 'M-14,-3 Q-10,-7 -6,-3',
    eyebrowRight: 'M6,-5 Q10,-8 14,-3',
    blush: false,
    sparkles: false,
    tailWag: false,
  },
  celebrating: {
    eyeShape: 'M-6,2 Q0,-8 6,2',
    mouthPath: 'M-10,-1 Q0,12 10,-1',
    eyebrowLeft: 'M-14,-5 Q-10,-9 -6,-5',
    eyebrowRight: 'M6,-5 Q10,-9 14,-5',
    blush: true,
    sparkles: true,
    tailWag: true,
  },
  encouraging: {
    eyeShape: 'M-6,1 Q0,-6 6,1',
    mouthPath: 'M-8,0 Q0,7 8,0',
    eyebrowLeft: 'M-14,-3 Q-10,-6 -6,-3',
    eyebrowRight: 'M6,-3 Q10,-6 14,-3',
    blush: true,
    sparkles: false,
    tailWag: false,
  },
};

export default function FoxyCharacter({ mood = 'idle', size = 120, animate = true, className = '' }: Props) {
  const cfg = MOODS[mood];

  return (
    <div
      className={`${styles.container} ${animate ? styles.animate : ''} ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Foxy the fox, looking ${mood}`}
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id={`furGrad-${mood}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFB347" />
            <stop offset="100%" stopColor="#FF852F" />
          </radialGradient>
          <radialGradient id={`bellyGrad-${mood}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF0D8" />
            <stop offset="100%" stopColor="#FFDDAA" />
          </radialGradient>
        </defs>

        {/* Tail */}
        <g className={cfg.tailWag ? styles.tailWag : ''}>
          <ellipse cx="148" cy="155" rx="32" ry="22" transform="rotate(-30 148 155)"
            fill={`url(#furGrad-${mood})`} />
          <ellipse cx="152" cy="148" rx="14" ry="10" transform="rotate(-30 152 148)"
            fill="#FFF0D8" />
        </g>

        {/* Body */}
        <ellipse cx="100" cy="145" rx="42" ry="38"
          fill={`url(#furGrad-${mood})`} />
        {/* Belly */}
        <ellipse cx="100" cy="150" rx="26" ry="26"
          fill={`url(#bellyGrad-${mood})`} />

        {/* Left ear */}
        <polygon points="54,60 44,20 74,52"
          fill={`url(#furGrad-${mood})`} />
        <polygon points="57,56 50,30 70,52"
          fill="#FF6B6B" opacity="0.7" />

        {/* Right ear */}
        <polygon points="146,60 156,20 126,52"
          fill={`url(#furGrad-${mood})`} />
        <polygon points="143,56 150,30 130,52"
          fill="#FF6B6B" opacity="0.7" />

        {/* Head */}
        <ellipse cx="100" cy="85" rx="50" ry="46"
          fill={`url(#furGrad-${mood})`} />

        {/* Muzzle */}
        <ellipse cx="100" cy="102" rx="22" ry="16"
          fill={`url(#bellyGrad-${mood})`} />

        {/* Nose */}
        <ellipse cx="100" cy="94" rx="5" ry="3.5"
          fill="#5C2A00" />

        {/* Eyes */}
        <g transform="translate(76,80)">
          <path d={cfg.eyeShape} fill="#3A2000" stroke="none" />
          <circle cx="-2" cy="-2" r="2" fill="white" opacity="0.9" />
        </g>
        <g transform="translate(124,80)">
          <path d={cfg.eyeShape} fill="#3A2000" stroke="none" />
          <circle cx="-2" cy="-2" r="2" fill="white" opacity="0.9" />
        </g>

        {/* Eyebrows */}
        <g transform="translate(76,75)">
          <path d={cfg.eyebrowLeft} fill="none" stroke="#5C3000" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g transform="translate(124,75)">
          <path d={cfg.eyebrowRight} fill="none" stroke="#5C3000" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Mouth */}
        <g transform="translate(100,103)">
          <path d={cfg.mouthPath} fill="none" stroke="#5C2A00" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Blush */}
        {cfg.blush && (
          <>
            <ellipse cx="68" cy="92" rx="9" ry="6" fill="#FF8C69" opacity="0.4" />
            <ellipse cx="132" cy="92" rx="9" ry="6" fill="#FF8C69" opacity="0.4" />
          </>
        )}

        {/* Backpack (turquoise) */}
        <rect x="112" y="125" width="24" height="28" rx="5"
          fill="#39D8F2" />
        <rect x="112" y="120" width="24" height="8" rx="3"
          fill="#1CB8D0" />
        <circle cx="124" cy="137" r="3"
          fill="#1CB8D0" />
        {/* Backpack strap */}
        <path d="M112,128 Q108,140 112,150" fill="none" stroke="#1CB8D0" strokeWidth="3" strokeLinecap="round" />

        {/* Sparkles on celebrating */}
        {cfg.sparkles && (
          <>
            <g className={styles.sparkle} transform="translate(30,30)">
              <path d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z"
                fill="#FFD700" />
            </g>
            <g className={styles.sparkle} style={{ animationDelay: '0.2s' }} transform="translate(170,25)">
              <path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5 Z"
                fill="#C8F45B" />
            </g>
            <g className={styles.sparkle} style={{ animationDelay: '0.4s' }} transform="translate(160,160)">
              <path d="M0,-5 L1.2,-1.2 L5,0 L1.2,1.2 L0,5 L-1.2,1.2 L-5,0 L-1.2,-1.2 Z"
                fill="#FF852F" />
            </g>
            <g className={styles.sparkle} style={{ animationDelay: '0.1s' }} transform="translate(35,160)">
              <path d="M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z"
                fill="#B8A4FF" />
            </g>
          </>
        )}
      </svg>
    </div>
  );
}
