import { useCallback, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import type {
  ClassifierStatus,
  PredictionResult,
  SignLabel,
} from '@/types/sign';
import { loadModel, type LoadedModel } from '@/ml/loadModel';
import { extractFeatures, selectClassificationHand } from '@/ml/features';
import { predict } from '@/ml/predict';
import { smoothPredictions } from '@/ml/smoothing';
import type { HandLandmarks } from '@/types/sign';

const WINDOW_SIZE = 9;
const CONFIDENCE_THRESHOLD = 0.8;

export interface UseSignClassifier {
  status: ClassifierStatus;
  error: string | null;
  /** Latest raw per-frame prediction (un-smoothed). */
  raw: PredictionResult | null;
  /** Smoothed, stable prediction shown to the user. */
  stable: PredictionResult | null;
  /** Process one frame of landmarks. Returns the smoothed prediction. */
  processFrame: (hands: HandLandmarks[] | null) => Promise<PredictionResult | null>;
  reset: () => void;
}

/**
 * Orchestrates the full pipeline: feature extraction → inference →
 * temporal smoothing. Loads the trained TF.js model on mount.
 */
export function useSignClassifier(): UseSignClassifier {
  const [status, setStatus] = useState<ClassifierStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [raw, setRaw] = useState<PredictionResult | null>(null);
  const [stable, setStable] = useState<PredictionResult | null>(null);

  const modelRef = useRef<LoadedModel | null>(null);
  const windowRef = useRef<SignLabel[]>([]);
  const preferredHandRef = useRef<HandLandmarks['handedness'] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus('loading');
      try {
        await tf.ready();
        const loaded = await loadModel();
        if (cancelled) return;
        modelRef.current = loaded;
        setStatus(loaded.status);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load classifier.');
        setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const processFrame = useCallback(
    async (hands: HandLandmarks[] | null): Promise<PredictionResult | null> => {
      const model = modelRef.current?.model;
      if (!model) return null;

      const bestHand = selectClassificationHand(hands);
      // When two hands are visible, retain the selected side while it stays
      // visible. This prevents the classifier stream from alternating hands
      // because MediaPipe's confidence scores vary slightly frame to frame.
      const hand = preferredHandRef.current
        ? hands?.find((candidate) => candidate.handedness === preferredHandRef.current) ?? bestHand
        : bestHand;
      if (hand) preferredHandRef.current = hand.handedness;
      const features = extractFeatures(hand);

      let result: PredictionResult;
      if (!hand) {
        // No hand → force NONE without wasting an inference pass.
        result = {
          label: 'NONE',
          confidence: 1,
          probabilities: [],
        };
      } else {
        result = await predict(model, features, CONFIDENCE_THRESHOLD);
      }

      setRaw(result);

      // Rolling window smoothing.
      windowRef.current.push(result.label);
      if (windowRef.current.length > WINDOW_SIZE) {
        windowRef.current.shift();
      }
      const smoothed = smoothPredictions(windowRef.current);
      const stableResult: PredictionResult = {
        label: smoothed.label,
        confidence: smoothed.label === result.label ? result.confidence : smoothed.confidence,
        probabilities: result.probabilities,
      };
      setStable(stableResult);
      return stableResult;
    },
    [],
  );

  const reset = useCallback(() => {
    windowRef.current = [];
    preferredHandRef.current = null;
    setRaw(null);
    setStable(null);
  }, []);

  return { status, error, raw, stable, processFrame, reset };
}
