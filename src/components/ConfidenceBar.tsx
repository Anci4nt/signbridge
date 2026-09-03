interface ConfidenceBarProps {
  value: number; // 0..1
  label?: string;
}

export default function ConfidenceBar({ value, label }: ConfidenceBarProps) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>{label}</span>
          <span className="font-mono text-brand-300">{pct}%</span>
        </div>
      )}
      <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-400 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
