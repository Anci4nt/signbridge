import type { Landmark } from '@/types/sign';

export function normalizeLandmarks(landmarks: Landmark[], mirrorX = true): number[] {
  if (landmarks.length < 21) {
    throw new Error(`Expected 21 landmarks, got ${landmarks.length}`);
  }

  const wrist = landmarks[0];

  const translated = landmarks.map((l) => ({
    x: l.x - wrist.x,
    y: l.y - wrist.y,
    z: (l.z ?? 0) - (wrist.z ?? 0),
  }));

  const ref = translated[9];
  const scale = Math.sqrt(ref.x * ref.x + ref.y * ref.y + ref.z * ref.z) || 1;

  const features: number[] = [];
  for (const l of translated) {
    features.push((mirrorX ? -l.x : l.x) / scale, l.y / scale, l.z / scale);
  }
  return features;
}

export function emptyFeatureVector(): number[] {
  return new Array(63).fill(0);
}
