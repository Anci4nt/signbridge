import { useCallback, useEffect, useRef, useState } from 'react';
import CameraView from '@/components/CameraView';
import PredictionCard from '@/components/PredictionCard';
import SignHistory from '@/components/SignHistory';
import { useCamera } from '@/hooks/useCamera';
import { useHandTracking } from '@/hooks/useHandTracking';
import { useSignClassifier } from '@/hooks/useSignClassifier';
import { speak, isSpeechAvailable } from '@/services/speech';
import type { HandLandmarks, HistoryEntry, SignLabel } from '@/types/sign';
import { labelDisplayName } from '@/ml/labels';

const CONFIRM_THRESHOLD = 0.8;
const CONFIRM_FRAMES = 6; // consecutive stable non-NONE frames before logging
const DEDUP_MS = 1500; // don't re-log the same sign within this window

export default function Translator() {
  const { videoRef, state: cameraState, error: cameraError, start, stop } = useCamera();
  const { state: trackerState, error: trackerError, detect, ensureLoaded } = useHandTracking();
  const { status, error: classifierError, stable, processFrame, reset } = useSignClassifier();

  const [hands, setHands] = useState<HandLandmarks[] | null>(null);
  const [fps, setFps] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const rafRef = useRef<number | null>(null);
  const lastFrameTime = useRef(performance.now());
  const fpsBufRef = useRef<number[]>([]);
  const confirmCountRef = useRef(0);
  const lastLoggedRef = useRef<{ label: SignLabel; ts: number } | null>(null);

  const speechAvailable = isSpeechAvailable();

  const logSign = useCallback((label: SignLabel, confidence: number) => {
    if (label === 'NONE') return;
    const now = Date.now();
    const last = lastLoggedRef.current;
    if (last && last.label === label && now - last.ts < DEDUP_MS) return;
    lastLoggedRef.current = { label, ts: now };
    const entry: HistoryEntry = {
      id: `${now}-${Math.random().toString(36).slice(2, 7)}`,
      label,
      confidence,
      timestamp: now,
    };
    setHistory((h) => [entry, ...h].slice(0, 50));
  }, []);

  // Main render loop.
  useEffect(() => {
    if (cameraState !== 'live') {
      setHands(null);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    let running = true;

    const loop = () => {
      if (!running) return;
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const now = performance.now();
        const detected = detect(video, now);

        // FPS calc.
        const dt = now - lastFrameTime.current;
        lastFrameTime.current = now;
        const inst = 1000 / Math.max(1, dt);
        fpsBufRef.current.push(inst);
        if (fpsBufRef.current.length > 30) fpsBufRef.current.shift();
        const avg = fpsBufRef.current.reduce((a, b) => a + b, 0) / fpsBufRef.current.length;
        setFps(avg);

        setHands(detected);

        processFrame(detected).then((pred) => {
          if (!pred) return;
          if (pred.label !== 'NONE' && pred.confidence >= CONFIRM_THRESHOLD) {
            confirmCountRef.current += 1;
            if (confirmCountRef.current >= CONFIRM_FRAMES) {
              logSign(pred.label, pred.confidence);
              confirmCountRef.current = 0;
            }
          } else {
            confirmCountRef.current = 0;
          }
        });
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cameraState, detect, processFrame, logSign, videoRef]);

  const handleStart = useCallback(async () => {
    reset();
    confirmCountRef.current = 0;
    lastLoggedRef.current = null;
    await ensureLoaded();
    await start();
  }, [ensureLoaded, start, reset]);

  const handleStop = useCallback(() => {
    stop();
    setHands(null);
    setFps(0);
  }, [stop]);

  const handleSpeak = useCallback(() => {
    if (stable && stable.label !== 'NONE') {
      speak(labelDisplayName(stable.label));
    }
  }, [stable]);

  const handleSpeakEntry = useCallback((entry: HistoryEntry) => {
    speak(labelDisplayName(entry.label));
  }, []);

  const handleClear = useCallback(() => setHistory([]), []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Translator</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Allow camera access and perform one of the supported signs. Recognition runs locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: camera */}
        <div className="space-y-4">
          <CameraView
            videoRef={videoRef}
            cameraState={cameraState}
            cameraError={cameraError}
            trackerState={trackerState}
            trackerError={trackerError}
            hands={hands}
            fps={fps}
            onStart={handleStart}
            onStop={handleStop}
          />
          {classifierError && (
            <div className="glass px-4 py-3 text-sm text-danger-400 border-danger-500/30">
              Classifier error: {classifierError}
            </div>
          )}
        </div>

        {/* Right: prediction + history */}
        <div className="space-y-4">
          <PredictionCard
            prediction={stable}
            status={status}
            onSpeak={handleSpeak}
            speechAvailable={speechAvailable}
          />
          <SignHistory
            history={history}
            onClear={handleClear}
            onSpeak={handleSpeakEntry}
          />
        </div>
      </div>
    </div>
  );
}
