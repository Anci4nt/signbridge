import type { HandLandmarks } from '@/types/sign';
import { normalizeLandmarks, emptyFeatureVector } from './normalize';

export const FEATURE_SIZE = 63;

export function extractFeatures(hand: HandLandmarks | null): number[] {
  if (!hand || hand.landmarks.length < 21) {
    return emptyFeatureVector();
  }
  return normalizeLandmarks(hand.landmarks);
}

export function selectClassificationHand(
  hands: HandLandmarks[] | null,
): HandLandmarks | null {
  if (!hands?.length) return null;
  return hands.reduce((best, hand) =>
    hand.score > best.score ? hand : best,
  );
}
