import styles from './ProgressBar.module.css';

interface Props {
  value: number; // 0-100
  max?: number;
  label?: string;
  color?: string;
  height?: number;
  showLabel?: boolean;
  animate?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  color = 'var(--fox-orange)',
  height = 12,
  showLabel = false,
  animate = true,
}: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={styles.wrapper}>
      {(label || showLabel) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showLabel && <span className={styles.value}>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={styles.track}
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
      >
        <div
          className={`${styles.fill} ${animate ? styles.animate : ''}`}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
