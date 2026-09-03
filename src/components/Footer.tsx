import { Link } from 'react-router-dom';
import { Hand, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="rounded-xl bg-brand-400/10 p-2 ring-1 ring-brand-400/30">
              <Hand className="w-4 h-4 text-brand-300" aria-hidden />
            </span>
            <div>
              <p className="font-display font-semibold text-white">SignBridge AI</p>
              <p className="text-xs text-slate-400">A simple sign-language assistant.</p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/translate" className="hover:text-white">Translator</Link>
            <Link to="/learn" className="hover:text-white">Learn</Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>Prototype tool for learning and accessibility.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-red-400" aria-hidden /> for accessibility
          </p>
        </div>
      </div>
    </footer>
  );
}
