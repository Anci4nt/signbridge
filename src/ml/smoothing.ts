import type { SignLabel } from '@/types/sign';

export function smoothPredictions(
  window: SignLabel[],
): { label: SignLabel; confidence: number } {
  if (window.length === 0) {
    return { label: 'NONE', confidence: 0 };
  }

  const counts = new Map<SignLabel, number>();
  for (const l of window) {
    counts.set(l, (counts.get(l) ?? 0) + 1);
  }

  let best: SignLabel = 'NONE';
  let bestCount = -1;
  // Iterate in reverse so ties resolve to the most recent label.
  for (let i = window.length - 1; i >= 0; i--) {
    const l = window[i];
    const c = counts.get(l)!;
    if (c > bestCount) {
      best = l;
      bestCount = c;
    }
  }

  return { label: best, confidence: bestCount / window.length };
}
