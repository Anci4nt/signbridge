import { Volume2, Trash2, History } from 'lucide-react';
import type { HistoryEntry } from '@/types/sign';
import { labelDisplayName } from '@/ml/labels';

interface SignHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  onSpeak: (entry: HistoryEntry) => void;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function SignHistory({ history, onClear, onSpeak }: SignHistoryProps) {
  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-brand-300" aria-hidden />
          Detection History
        </h3>
        <button
          onClick={onClear}
          disabled={history.length === 0}
          className="btn-ghost px-3 py-1.5 text-xs"
          aria-label="Clear detection history"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden />
          Clear
        </button>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-slate-500 py-6 text-center">
          Confirmed signs will appear here.
        </p>
      ) : (
        <ul className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin pr-1">
          {history.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2 animate-fade-in"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-slate-500 shrink-0">
                  {formatTime(entry.timestamp)}
                </span>
                <span className="font-display font-semibold text-white truncate">
                  {labelDisplayName(entry.label)}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-xs text-brand-300">
                  {Math.round(entry.confidence * 100)}%
                </span>
                <button
                  onClick={() => onSpeak(entry)}
                  className="rounded-md p-1.5 text-slate-400 hover:text-brand-300 hover:bg-white/5 transition-colors"
                  aria-label={`Speak ${labelDisplayName(entry.label)}`}
                >
                  <Volume2 className="w-4 h-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
