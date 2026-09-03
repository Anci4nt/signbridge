import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Hand,
  ScanFace,
  Brain,
  Volume2,
  ShieldCheck,
  Sparkles,
  Activity,
} from 'lucide-react';
import { PRACTICABLE_SIGNS, SIGN_META } from '@/ml/labels';

export default function Home() {
  const signs = PRACTICABLE_SIGNS;

  const steps = [
    { icon: ScanFace, title: 'Camera', text: 'Start your webcam and begin signing.' },
    { icon: Brain, title: 'Predict', text: 'Hand landmarks are interpreted in real time.' },
    { icon: Volume2, title: 'Speak', text: 'The sign can be turned into text or voice.' },
  ];

  const features = [
    { icon: ShieldCheck, title: 'Private', text: 'Everything stays on-device in your browser.' },
    { icon: Activity, title: 'Live', text: 'A smoother output keeps the result stable and readable.' },
    { icon: Sparkles, title: 'Simple', text: 'A clean flow built for quick learning and practice.' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <section className="mb-10">
        <div className="glass p-6 sm:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="chip mb-5">
                <Sparkles className="w-3.5 h-3.5 text-brand-300" aria-hidden />
                Real-time sign recognition
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Sign language, made simple.
              </h1>
              <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
                SignBridge AI helps you recognize common sign-language gestures with a lightweight,
                browser-based experience built for learning and accessibility.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link to="/translate" className="btn-primary text-base px-6 py-3.5">
                  Open translator
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
                <Link to="/learn" className="btn-ghost text-base px-6 py-3.5">
                  <Hand className="w-4 h-4" aria-hidden />
                  Learn signs
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-pulse-ring" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  Live AI
                </div>
                <span>Local processing</span>
                <span>Webcam ready</span>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-slate-950/80 border border-white/10 p-5">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-medium text-slate-300">Recognition</span>
                <span className="chip">Live</span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-900 border border-white/10 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Detected</div>
                  <div className="mt-2 text-3xl font-display font-bold text-white">HELLO</div>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-white/10 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Confidence</span>
                    <span>94%</span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-400" style={{ width: '94%' }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
                  <div className="rounded-xl bg-slate-900 border border-white/10 p-3">Camera ready</div>
                  <div className="rounded-xl bg-slate-900 border border-white/10 p-3">On device</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <div key={title} className="glass-soft p-5" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 border border-white/10">
                <Icon className="w-5 h-5 text-brand-300" aria-hidden />
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-8 text-center">
          <h2 className="section-title">Built for straightforward learning</h2>
          <p className="mt-3 max-w-2xl mx-auto text-slate-300">
            A streamlined sign recognition experience designed to stay clear, responsive, and easy to use.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-400/10 ring-1 ring-brand-400/20 text-brand-300">
                <Icon className="w-5 h-5" aria-hidden />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="glass p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">Supported signs</h2>
              <p className="mt-2 text-slate-300">A simple set of trained gestures for quick practice.</p>
            </div>
            <p className="text-sm text-slate-400">{signs.length} gestures available</p>
          </div>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {signs.map((label) => {
              const meta = SIGN_META[label];
              return (
                <div key={label} className="glass-soft p-3">
                  <p className="font-display font-semibold text-white">{meta.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-400">{meta.difficulty}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
