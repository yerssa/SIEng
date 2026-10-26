import type { Screen } from '../types';
import styles from './Navigation.module.css';

interface Props {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const NAV_ITEMS = [
  { screen: 'dashboard' as Screen, label: 'Home', icon: HomeIcon },
  { screen: 'worldMap' as Screen, label: 'Map', icon: MapIcon },
  { screen: 'progress' as Screen, label: 'Progress', icon: ChartIcon },
  { screen: 'profile' as Screen, label: 'Profile', icon: ProfileIcon },
];

export default function Navigation({ currentScreen, onNavigate }: Props) {
  const showNav = !['intro', 'setup', 'placement'].includes(currentScreen);
  if (!showNav) return null;

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {NAV_ITEMS.map(({ screen, label, icon: Icon }) => (
        <button
          key={screen}
          className={`${styles.item} ${currentScreen === screen ? styles.active : ''}`}
          onClick={() => onNavigate(screen)}
          aria-current={currentScreen === screen ? 'page' : undefined}
          aria-label={label}
        >
          <span className={styles.iconWrap} aria-hidden="true">
            <Icon active={currentScreen === screen} />
          </span>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
        fill={active ? 'var(--fox-orange)' : 'none'}
        stroke={active ? 'var(--fox-orange)' : 'currentColor'}
        strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 6L8 3L16 7L23 4V18L16 21L8 17L1 20V6Z"
        fill={active ? 'rgba(57,216,242,0.2)' : 'none'}
        stroke={active ? 'var(--electric-cyan)' : 'currentColor'}
        strokeWidth="2" strokeLinejoin="round" />
      <line x1="8" y1="3" x2="8" y2="17" stroke={active ? 'var(--electric-cyan)' : 'currentColor'} strokeWidth="2" />
      <line x1="16" y1="7" x2="16" y2="21" stroke={active ? 'var(--electric-cyan)' : 'currentColor'} strokeWidth="2" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="4" height="9"
        fill={active ? 'var(--vivid-lime)' : 'none'}
        stroke={active ? 'var(--forest-green)' : 'currentColor'}
        strokeWidth="2" rx="1" />
      <rect x="10" y="6" width="4" height="15"
        fill={active ? 'var(--vivid-lime)' : 'none'}
        stroke={active ? 'var(--forest-green)' : 'currentColor'}
        strokeWidth="2" rx="1" />
      <rect x="17" y="3" width="4" height="18"
        fill={active ? 'var(--vivid-lime)' : 'none'}
        stroke={active ? 'var(--forest-green)' : 'currentColor'}
        strokeWidth="2" rx="1" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4"
        fill={active ? 'rgba(184,164,255,0.3)' : 'none'}
        stroke={active ? 'var(--lavender)' : 'currentColor'}
        strokeWidth="2" />
      <path d="M4 20C4 16.7 7.6 14 12 14C16.4 14 20 16.7 20 20"
        stroke={active ? 'var(--lavender)' : 'currentColor'}
        strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
