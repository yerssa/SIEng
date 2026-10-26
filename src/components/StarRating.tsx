import styles from './StarRating.module.css';

interface Props {
  stars: 0 | 1 | 2 | 3;
  size?: number;
  animate?: boolean;
}

export default function StarRating({ stars, size = 32, animate = false }: Props) {
  return (
    <div className={styles.row} role="img" aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 32 32"
          className={`${styles.star} ${n <= stars ? styles.earned : styles.empty} ${animate && n <= stars ? styles.animate : ''}`}
          style={animate ? { animationDelay: `${(n - 1) * 0.15}s` } : {}}
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M16 2 L19.6 11.6 L30 11.6 L21.8 17.8 L24.9 27.4 L16 21.8 L7.1 27.4 L10.2 17.8 L2 11.6 L12.4 11.6 Z"
            fill={n <= stars ? '#FFD700' : 'none'}
            stroke={n <= stars ? '#E6C200' : '#D0D0D0'}
            strokeWidth="2"
          />
        </svg>
      ))}
    </div>
  );
}
