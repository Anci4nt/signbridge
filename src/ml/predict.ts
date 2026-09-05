import * as tf from '@tensorflow/tfjs';
import type { PredictionResult, SignLabel } from '@/types/sign';
import { LABELS } from './labels';

export async function predict(
  model: tf.LayersModel,
  features: number[],
  threshold = 0.8,
): Promise<PredictionResult> {
  const probs = tf.tidy(() => {
    const input = tf.tensor2d([features]);
    const logits = model.predict(input) as tf.Tensor;
    return Array.from(logits.dataSync());
  });
  return resolvePrediction(probs, threshold);
}

export function resolvePrediction(
  probabilities: number[],
  threshold = 0.8,
): PredictionResult {
  let bestIdx = 0;
  let bestProb = probabilities[0];
  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > bestProb) {
      bestProb = probabilities[i];
      bestIdx = i;
    }
  }

  let label = LABELS[bestIdx] as SignLabel;
  if (label !== 'NONE' && bestProb < threshold) {
    label = 'NONE';
  }

  return { label, confidence: bestProb, probabilities };
}
