import { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useHandTracking } from '@/hooks/useHandTracking';
import { useSignClassifier } from '@/hooks/useSignClassifier';
import CameraView from '@/components/CameraView';
import ConfidenceBar from '@/components/ConfidenceBar';
import { PRACTICABLE_SIGNS, SIGN_META, labelDisplayName } from '@/ml/labels';
import type { HandLandmarks, SignLabel } from '@/types/sign';
import { Check, X, ArrowLeft, Target, RotateCcw } from 'lucide-react';

type Feedback =
  | { kind: 'idle' }
  | { kind: 'correct'; confidence: number; detected: SignLabel }
  | { kind: 'incorrect'; detected: SignLabel; confidence: number };

export default function Learn() {
  const { videoRef, state: cameraState, error: cameraError, start, stop } = useCamera();
  const { state: trackerState, error: trackerError, detect, ensureLoaded } = useHandTracking();
  const { processFrame, reset } = useSignClassifier();

  const [selected, setSelected] = useState<SignLabel | null>(null);
  const [hands, setHands] = useState<HandLandmarks[] | null>(null);
  const [fps, setFps] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'idle' });
  const [currentPred, setCurrentPred] = useState<{ label: SignLabel; confidence: number } | null>(null);

  const rafRef = useRef<number | null>(null);
  const lastFrameTime = useRef(performance.now());
  const fpsBuf = useRef<number[]>([]);
  const holdFrames = useRef(0);

  const runPractice = useCallback(
    async () => {
      reset();
      holdFrames.current = 0;
      setFeedback({ kind: 'idle' });
      await ensureLoaded();
      await start();
    },
    [ensureLoaded, start, reset],
  );

  useEffect(() => {
    if (cameraState !== 'live' || !selected) {
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
        const dt = now - lastFrameTime.current;
        lastFrameTime.current = now;
        const inst = 1000 / Math.max(1, dt);
        fpsBuf.current.push(inst);
        if (fpsBuf.current.length > 30) fpsBuf.current.shift();
        setFps(fpsBuf.current.reduce((a, b) => a + b, 0) / fpsBuf.current.length);

        const detected = detect(video, now);
        setHands(detected);

        processFrame(detected).then((pred) => {
          if (!pred || !selected) return;
          setCurrentPred({ label: pred.label, confidence: pred.confidence });
          if (pred.label === selected && pred.confidence >= 0.8) {
            holdFrames.current += 1;
            if (holdFrames.current >= 5) {
              setFeedback({ kind: 'correct', confidence: pred.confidence, detected: pred.label });
              stop();
            }
          } else if (pred.label !== 'NONE' && pred.label !== selected && pred.confidence >= 0.8) {
            holdFrames.current = 0;
            setFeedback({ kind: 'incorrect', detected: pred.label, confidence: pred.confidence });
          } else {
            holdFrames.current = 0;
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
  }, [cameraState, selected, detect, processFrame, stop, videoRef]);

  const handleBack = useCallback(() => {
    stop();
    setSelected(null);
    setFeedback({ kind: 'idle' });
    setCurrentPred(null);
  }, [stop]);

  if (selected) {
    const meta = SIGN_META[selected];
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <button onClick={handleBack} className="btn-ghost mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to signs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <CameraView
              videoRef={videoRef}
              cameraState={cameraState}
              cameraError={cameraError}
              trackerState={trackerState}
              trackerError={trackerError}
              hands={hands}
              fps={fps}
              onStart={runPractice}
              onStop={stop}
            />
          </div>

          <div className="space-y-4">
            <div className="glass p-6">
              <div className="flex items-center gap-2 text-brand-300 text-sm mb-2">
                <Target className="w-4 h-4" /> Target Sign
              </div>
              <p className="font-display text-4xl font-bold gradient-text mb-2">
                {labelDisplayName(selected)}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">{meta.description}</p>
              <span className="chip mt-3 text-slate-300">{meta.difficulty}</span>
            </div>

            <div className="glass p-5">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Your Prediction
              </h3>
              {currentPred ? (
                <div>
                  <p className="font-display text-2xl font-semibold text-white">
                    {labelDisplayName(currentPred.label)}
                  </p>
                  <div className="mt-3">
                    <ConfidenceBar value={currentPred.confidence} />
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Start the camera and perform the sign.</p>
              )}
            </div>

            {feedback.kind === 'correct' && (
              <div className="glass p-6 border-accent-400/40 animate-fade-up">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full bg-accent-500/20 p-2 ring-1 ring-accent-400/40">
                    <Check className="w-6 h-6 text-accent-400" aria-hidden />
                  </span>
                  <p className="font-display text-2xl font-bold text-accent-400">Great job!</p>
                </div>
                <p className="text-slate-300">
                  You performed <strong className="text-white">{labelDisplayName(selected)}</strong> with {Math.round(feedback.confidence * 100)}% confidence.
                </p>
                <button onClick={runPractice} className="btn-ghost mt-4 text-sm">
                  <RotateCcw className="w-4 h-4" /> Try again
                </button>
              </div>
            )}

            {feedback.kind === 'incorrect' && (
              <div className="glass p-6 border-warn-400/40 animate-fade-up">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full bg-warn-500/20 p-2 ring-1 ring-warn-400/40">
                    <X className="w-6 h-6 text-warn-400" aria-hidden />
                  </span>
                  <p className="font-display text-2xl font-bold text-warn-400">Not quite.</p>
                </div>
                <p className="text-slate-300">
                  Detected <strong className="text-white">{labelDisplayName(feedback.detected)}</strong>.
                  Try the <strong className="text-white">{labelDisplayName(selected)}</strong> gesture again.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">Learn Signs</h1>
        <p className="mt-2 text-slate-400 max-w-2xl">
          Pick one of your {PRACTICABLE_SIGNS.length} trained signs to practice. The camera will check your gesture against the recognition pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRACTICABLE_SIGNS.map((label, i) => {
          const meta = SIGN_META[label];
          return (
            <div
              key={label}
              className="glass p-5 hover:border-brand-400/30 transition-all animate-fade-up flex flex-col"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-display text-xl font-semibold text-white">{meta.name}</h3>
                <span className={`chip ${
                  meta.difficulty === 'Beginner' ? 'text-accent-400 border-accent-400/30' :
                  meta.difficulty === 'Intermediate' ? 'text-warn-400 border-warn-400/30' :
                  'text-danger-400 border-danger-400/30'
                }`}>
                  {meta.difficulty}
                </span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed flex-grow">{meta.description}</p>
              <button
                onClick={() => setSelected(label)}
                className="btn-primary mt-4 text-sm self-start"
                aria-label={`Practice ${meta.name}`}
              >
                <Target className="w-4 h-4" /> Practice
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
