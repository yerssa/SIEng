import { useState } from 'react';
import type { GameState } from '../types';
import Button from '../components/Button';
import Modal from '../components/Modal';
import styles from './SettingsScreen.module.css';

interface Props {
  state: GameState;
  onUpdateSettings: (settings: Partial<import('../types').Settings>) => void;
  onReset: () => void;
}

export default function SettingsScreen({ state, onUpdateSettings, onReset }: Props) {
  const [showResetModal, setShowResetModal] = useState(false);
  const { settings } = state;

  const handleReset = () => {
    setShowResetModal(false);
    onReset();
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </div>

      <div className={styles.content}>
        {/* Audio */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Audio & Display</h2>
          <ToggleRow
            label="Sound Effects & TTS"
            description="Enable sounds and text-to-speech for listening exercises"
            value={settings.soundEnabled}
            onChange={(v) => onUpdateSettings({ soundEnabled: v })}
            id="sound"
          />
          <ToggleRow
            label="Reduced Motion"
            description="Disable animations for accessibility"
            value={settings.reducedMotion}
            onChange={(v) => onUpdateSettings({ reducedMotion: v })}
            id="motion"
          />
        </div>

        {/* Privacy */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Privacy Information</h2>
          <div className={styles.privacyCard}>
            <p>🔒 <strong>Data Storage:</strong> This app stores your game progress locally on your device only, using localStorage. No data is sent to any server.</p>
            <p>👤 <strong>Personal Information:</strong> We only ask for a nickname — not your real name, school, address, or contact details.</p>
            <p>🎭 <strong>Leaderboard:</strong> The leaderboard shows fictional sample players only — no real players are listed.</p>
            <p>🎤 <strong>Microphone:</strong> Speech features are optional and use your browser's built-in capabilities only. No audio is recorded or stored.</p>
            <p>📊 <strong>Analytics:</strong> No tracking, analytics, or advertising code is included.</p>
          </div>
        </div>

        {/* About */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>About SIEng</h2>
          <div className={styles.aboutCard}>
            <p><strong>SIEng — English Adventure</strong></p>
            <p>Version 1.0 MVP</p>
            <p>A gamified English learning experience for children aged 6–13.</p>
            <p style={{ marginTop: 8, color: 'var(--gray-500)', fontSize: 13 }}>
              SIEng is an educational prototype. Results and level estimates are approximate and for motivation only — they are not official language certifications.
            </p>
          </div>
        </div>

        {/* Danger zone */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle} style={{ color: 'var(--error)' }}>Danger Zone</h2>
          <Button
            onClick={() => setShowResetModal(true)}
            variant="danger"
            fullWidth
          >
            🗑️ Reset All Progress
          </Button>
          <p className={styles.resetHint}>
            This will permanently delete all your progress, achievements, and saved data.
          </p>
        </div>
      </div>

      <Modal open={showResetModal} onClose={() => setShowResetModal(false)} title="Reset Progress?">
        <p style={{ color: 'var(--gray-700)', marginBottom: 20, textAlign: 'center', lineHeight: 1.6 }}>
          This will delete <strong>all</strong> your progress, XP, achievements, and missions. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button onClick={handleReset} variant="danger" fullWidth>Yes, Reset Everything</Button>
          <Button onClick={() => setShowResetModal(false)} variant="secondary" fullWidth>Cancel</Button>
        </div>
      </Modal>

      <div style={{ height: 80 }} />
    </div>
  );
}

function ToggleRow({ label, description, value, onChange, id }: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <label htmlFor={id} className={styles.toggleLabel}>{label}</label>
        <p className={styles.toggleDesc}>{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
        aria-label={label}
      >
        <span className={styles.toggleThumb} />
      </button>
    </div>
  );
}
