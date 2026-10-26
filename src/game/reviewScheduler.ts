import type { ReviewItem } from '../types';

// Spaced repetition intervals (in days)
const INTERVALS = [0, 1, 3, 7, 14];

export function addToReviewQueue(queue: ReviewItem[], questionId: string): ReviewItem[] {
  const existing = queue.find((item) => item.questionId === questionId);
  if (existing) {
    // Reset if answer was wrong
    return queue.map((item) =>
      item.questionId === questionId
        ? { ...item, intervalDays: 0, nextReviewAt: Date.now() + 1000 * 60 * 5, correctStreak: 0 }
        : item,
    );
  }
  return [
    ...queue,
    {
      questionId,
      nextReviewAt: Date.now() + 1000 * 60 * 5, // review in 5 minutes
      intervalDays: 0,
      correctStreak: 0,
    },
  ];
}

export function advanceReviewItem(queue: ReviewItem[], questionId: string): ReviewItem[] {
  return queue.map((item) => {
    if (item.questionId !== questionId) return item;
    const newStreak = item.correctStreak + 1;
    const intervalIndex = Math.min(newStreak, INTERVALS.length - 1);
    const days = INTERVALS[intervalIndex];
    const nextReviewAt = Date.now() + days * 24 * 60 * 60 * 1000;
    return { ...item, correctStreak: newStreak, intervalDays: days, nextReviewAt };
  });
}

export function getDueReviews(queue: ReviewItem[]): ReviewItem[] {
  const now = Date.now();
  return queue.filter((item) => item.nextReviewAt <= now);
}

export function getReviewDueCount(queue: ReviewItem[]): number {
  return getDueReviews(queue).length;
}
