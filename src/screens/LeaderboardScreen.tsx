import styles from './LeaderboardScreen.module.css';

const SAMPLE_DATA = [
  { rank: 1, name: 'StarExplorer99', avatar: '🦁', xp: 2840, level: 'Master Explorer', flag: '🇺🇸' },
  { rank: 2, name: 'GrammarGuru', avatar: '🐬', xp: 2510, level: 'Champion', flag: '🇬🇧' },
  { rank: 3, name: 'WordWizard', avatar: '🦋', xp: 2200, level: 'Champion', flag: '🇯🇵' },
  { rank: 4, name: 'BraveLeaner', avatar: '🐸', xp: 1950, level: 'Adventurer', flag: '🇧🇷' },
  { rank: 5, name: 'CosmicFox', avatar: '🦊', xp: 1780, level: 'Adventurer', flag: '🇩🇪' },
  { rank: 6, name: 'ReadingRacer', avatar: '🐧', xp: 1540, level: 'Adventurer', flag: '🇫🇷' },
  { rank: 7, name: 'LexiconKid', avatar: '🦁', xp: 1320, level: 'Rookie', flag: '🇰🇷' },
  { rank: 8, name: 'PhrasePilot', avatar: '🦋', xp: 1100, level: 'Rookie', flag: '🇲🇽' },
  { rank: 9, name: 'SpeakStar', avatar: '🐸', xp: 980, level: 'Rookie', flag: '🇨🇳' },
  { rank: 10, name: 'EnglishEagle', avatar: '🐬', xp: 820, level: 'Explorer', flag: '🇮🇳' },
];

export default function LeaderboardScreen() {
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leaderboard</h1>
        <p className={styles.subtitle}>Weekly Learning Points</p>
        <div className={styles.notice}>
          📋 Sample data — fictional players for demonstration only
        </div>
      </div>

      {/* Top 3 podium */}
      <div className={styles.podium}>
        {[SAMPLE_DATA[1], SAMPLE_DATA[0], SAMPLE_DATA[2]].map((p, i) => {
          const heights = ['80px', '100px', '70px'];
          const medals = ['🥈', '🥇', '🥉'];
          return (
            <div key={p.rank} className={styles.podiumItem}>
              <span className={styles.podiumAvatar}>{p.avatar}</span>
              <span className={styles.podiumName}>{p.name}</span>
              <span className={styles.podiumXP}>{p.xp} XP</span>
              <div
                className={`${styles.podiumBar} ${i === 1 ? styles.podiumFirst : i === 0 ? styles.podiumSecond : styles.podiumThird}`}
                style={{ height: heights[i] }}
              >
                <span className={styles.podiumMedal}>{medals[i]}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full list */}
      <div className={styles.list}>
        {SAMPLE_DATA.map((p) => (
          <div key={p.rank} className={`${styles.row} ${p.rank <= 3 ? styles.topRow : ''}`}>
            <span className={styles.rank}>{p.rank <= 3 ? ['🥇', '🥈', '🥉'][p.rank - 1] : p.rank}</span>
            <span className={styles.avatar}>{p.avatar}</span>
            <div className={styles.info}>
              <span className={styles.name}>{p.name} {p.flag}</span>
              <span className={styles.level}>{p.level}</span>
            </div>
            <span className={styles.xp}>{p.xp} XP</span>
          </div>
        ))}
      </div>

      <p className={styles.footer}>
        All player names and scores are fictional and used for demonstration only. No real player data is shown.
      </p>

      <div style={{ height: 80 }} />
    </div>
  );
}
