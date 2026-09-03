import type { Landmark } from '@/types/sign';

/**
 * Normalize a single hand's 21 landmarks into a translation- and
 * scale-invariant feature vector of length 63 (21 × {x,y,z}).
 *
 * Steps:
 *  1. Translate so the wrist (landmark 0) is at the origin.
 *  2. Scale by the distance from the wrist to the middle-finger MCP
 *     (landmark 9) so the vector is independent of hand size in frame.
 *  3. Flatten to [x0, y0, z0, x1, y1, z1, ...].
 */
export function normalizeLandmarks(landmarks: Landmark[], mirrorX = true): number[] {
  if (landmarks.length < 21) {
    throw new Error(`Expected 21 landmarks, got ${landmarks.length}`);
  }

  const wrist = landmarks[0];

  // Translate to wrist origin.
  const translated = landmarks.map((l) => ({
    x: l.x - wrist.x,
    y: l.y - wrist.y,
    z: (l.z ?? 0) - (wrist.z ?? 0),
  }));

  // Scale by wrist → middle finger MCP distance (landmark 9).
  const ref = translated[9];
  const scale = Math.sqrt(ref.x * ref.x + ref.y * ref.y + ref.z * ref.z) || 1;

  const features: number[] = [];
  for (const l of translated) {
    // The Python collector mirrors webcam frames before extracting landmarks.
    // Match that coordinate system in the browser so inference sees the same
    // left/right orientation it was trained on.
    features.push((mirrorX ? -l.x : l.x) / scale, l.y / scale, l.z / scale);
  }
  return features;
}

/** A zero vector used for the NONE class when no hand is present. */
export function emptyFeatureVector(): number[] {
  return new Array(63).fill(0);
}
