import type { HandLandmarks } from '@/types/sign';
import { normalizeLandmarks, emptyFeatureVector } from './normalize';

export const FEATURE_SIZE = 63;

/**
 * Convert MediaPipe hand landmarks into a normalized feature vector.
 * Returns a zero vector (NONE) when no hand is supplied.
 */
export function extractFeatures(hand: HandLandmarks | null): number[] {
  if (!hand || hand.landmarks.length < 21) {
    return emptyFeatureVector();
  }
  return normalizeLandmarks(hand.landmarks);
}

/**
 * Choose the most reliable detected hand for a single-hand classifier.
 * The tracker may return hands in either order, so ranking by detection score
 * prevents the prediction stream from jumping between hands.
 */
export function selectClassificationHand(
  hands: HandLandmarks[] | null,
): HandLandmarks | null {
  if (!hands?.length) return null;
  return hands.reduce((best, hand) =>
    hand.score > best.score ? hand : best,
  );
}
