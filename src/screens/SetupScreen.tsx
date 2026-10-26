import { useState } from 'react';
import FoxyCharacter from '../components/FoxyCharacter';
import Button from '../components/Button';
import styles from './SetupScreen.module.css';

const AVATARS = [
  { id: 'avatar-1', emoji: '🦁', label: 'Lion' },
  { id: 'avatar-2', emoji: '🐸', label: 'Frog' },
  { id: 'avatar-3', emoji: '🐧', label: 'Penguin' },
  { id: 'avatar-4', emoji: '🦋', label: 'Butterfly' },
  { id: 'avatar-5', emoji: '🐬', label: 'Dolphin' },
  { id: 'avatar-6', emoji: '🦊', label: 'Fox' },
];

const SUGGESTIONS = ['StarExplorer', 'CosmicFox', 'WordWizard', 'ReadingRacer', 'GrammarGuru', 'BraveLeaner'];

interface Props {
  onComplete: (nickname: string, avatarId: string) => void;
}

export default function SetupScreen({ onComplete }: Props) {
  const [nickname, setNickname] = useState('');
  const [avatarId, setAvatarId] = useState('avatar-6');
  const [error, setError] = useState('');

  const validate = (): boolean => {
    const n = nickname.trim();
    if (n.length < 2) { setError('Nickname must be at least 2 characters'); return false; }
    if (n.length > 20) { setError('Nickname must be 20 characters or less'); return false; }
    if (!/^[a-zA-Z0-9 _-]+$/.test(n)) { setError('Only letters, numbers, spaces, _ and - allowed'); return false; }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      onComplete(nickname.trim(), avatarId);
    }
  };

  const randomSuggestion = () => {
    const s = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
    setNickname(s);
    setError('');
  };

  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <FoxyCharacter mood="happy" size={100} animate />
        <div>
          <h1 className={styles.title}>Create Your Explorer!</h1>
          <p className={styles.subtitle}>Choose a nickname and avatar to begin your adventure.</p>
        </div>
      </div>

      <div className={styles.card}>
        {/* Nickname */}
        <div className={styles.field}>
          <label htmlFor="nickname" className={styles.label}>Your Explorer Name</label>
          <div className={styles.inputRow}>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setError(''); }}
              placeholder="e.g. StarExplorer"
              maxLength={20}
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              aria-describedby={error ? 'nickname-error' : undefined}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              type="button"
              onClick={randomSuggestion}
              className={styles.diceBtn}
              aria-label="Suggest a nickname"
              title="Suggest a random name"
            >🎲</button>
          </div>
          {error && <p id="nickname-error" className={styles.error} role="alert">{error}</p>}
          <p className={styles.hint}>
            Don't use your real name — pick a fun explorer name! ({nickname.trim().length}/20)
          </p>
        </div>

        {/* Avatar */}
        <div className={styles.field}>
          <p className={styles.label}>Choose Your Avatar</p>
          <div className={styles.avatarGrid} role="radiogroup" aria-label="Avatar selection">
            {AVATARS.map((av) => (
              <button
                key={av.id}
                type="button"
                role="radio"
                aria-checked={avatarId === av.id}
                aria-label={av.label}
                onClick={() => setAvatarId(av.id)}
                className={`${styles.avatar} ${avatarId === av.id ? styles.avatarSelected : ''}`}
              >
                <span className={styles.avatarEmoji}>{av.emoji}</span>
                <span className={styles.avatarLabel}>{av.label}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          fullWidth
          disabled={nickname.trim().length < 2}
        >
          🌍 Let's Explore!
        </Button>

        <p className={styles.privacy}>
          🔒 We only save your nickname and game progress locally. No real names needed.
        </p>
      </div>
    </div>
  );
}
