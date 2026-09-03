import { Volume2, Sparkles, AlertCircle } from 'lucide-react';
import type { PredictionResult } from '@/types/sign';
import { labelDisplayName } from '@/ml/labels';
import ConfidenceBar from './ConfidenceBar';

interface PredictionCardProps {
  prediction: PredictionResult | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  onSpeak: () => void;
  speechAvailable: boolean;
}

export default function PredictionCard({
  prediction,
  status,
  onSpeak,
  speechAvailable,
}: PredictionCardProps) {
  const isNone = !prediction || prediction.label === 'NONE';
  const confidence = prediction?.confidence ?? 0;

  return (
    <div className="glass p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Detected Sign
        </h2>
        <span
          className={`chip ${
            status === 'ready' ? 'text-accent-400 border-accent-400/30' : 'text-warn-400 border-warn-400/30'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'ready' ? 'bg-accent-400' : 'bg-warn-400'} animate-pulse`} />
          {status === 'ready' ? 'AI Active' : status}
        </span>
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        {isNone ? (
          <div className="text-center">
            <p className="font-display text-2xl text-slate-500 mb-1">Show me a supported sign…</p>
            <p className="text-sm text-slate-600">Waiting for a confident, recognized gesture.</p>
          </div>
        ) : (
          <div className="text-center animate-fade-up">
            <p className="font-display text-5xl sm:text-6xl font-bold gradient-text mb-2">
              {labelDisplayName(prediction!.label)}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              {Math.round(confidence * 100)}% confidence
            </p>
            <div className="max-w-sm mx-auto">
              <ConfidenceBar value={confidence} />
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onSpeak}
          disabled={isNone || !speechAvailable}
          className="btn-primary flex-1"
          aria-label="Speak the detected sign aloud"
        >
          <Volume2 className="w-4 h-4" aria-hidden />
          Speak
        </button>
        {!speechAvailable && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Speech unsupported in this browser
          </p>
        )}
      </div>

      {!isNone && (
        <p className="mt-3 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-300" aria-hidden />
          Prediction is smoothed over the last few frames for stability.
        </p>
      )}
    </div>
  );
}
