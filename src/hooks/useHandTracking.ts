import { useCallback, useEffect, useRef, useState } from 'react';
import {
  HandLandmarker,
  FilesetResolver,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision';
import type { HandLandmarks } from '@/types/sign';

const WASM_PATH = '/mediapipe';
const MODEL_PATH = '/mediapipe/hand_landmarker.task';
const MAX_HANDS = 2;

export type TrackerState = 'idle' | 'loading' | 'ready' | 'error';

export interface UseHandTracking {
  state: TrackerState;
  error: string | null;
  detect: (video: HTMLVideoElement, timestamp: number) => HandLandmarks[] | null;
  ensureLoaded: () => Promise<void>;
}

export function useHandTracking(): UseHandTracking {
  const [state, setState] = useState<TrackerState>('idle');
  const [error, setError] = useState<string | null>(null);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const loadingPromise = useRef<Promise<void> | null>(null);

  const ensureLoaded = useCallback(async () => {
    if (landmarkerRef.current) return;
    if (loadingPromise.current) return loadingPromise.current;

    setState('loading');
    setError(null);

    loadingPromise.current = (async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          WASM_PATH,
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: MODEL_PATH,
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: MAX_HANDS,
          minHandDetectionConfidence: 0.65,
          minHandPresenceConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });
        landmarkerRef.current = landmarker;
        setState('ready');
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to load hand tracking model.';
        setError(msg);
        setState('error');
      }
    })();

    return loadingPromise.current;
  }, []);

  const detect = useCallback(
    (video: HTMLVideoElement, timestamp: number): HandLandmarks[] | null => {
      const landmarker = landmarkerRef.current;
      if (!landmarker || video.readyState < 2) return null;
      try {
        const result: HandLandmarkerResult = landmarker.detectForVideo(
          video,
          timestamp,
        );
        if (!result.landmarks || result.landmarks.length === 0) return [];

        return result.landmarks
          .map((lms, i) => ({
            landmarks: lms as unknown as HandLandmarks['landmarks'],
            handedness:
              (result.handedness?.[i]?.[0]?.categoryName as 'Left' | 'Right') ??
              'Unknown',
            score: result.handedness?.[i]?.[0]?.score ?? 0,
          }))
          .filter((hand) => hand.landmarks.length === 21)
          .sort((a, b) => b.score - a.score);
      } catch {
        return null;
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
    };
  }, []);

  return { state, error, detect, ensureLoaded };
}
