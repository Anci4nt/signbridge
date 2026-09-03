import { Link, NavLink } from 'react-router-dom';
import { Hand, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      isActive ? 'text-brand-300 bg-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="SignBridge AI home">
          <span className="rounded-xl bg-brand-400/10 p-2 ring-1 ring-brand-400/30 group-hover:ring-brand-400/50 transition">
            <Hand className="w-4 h-4 text-brand-300" aria-hidden />
          </span>
          <span className="font-display font-semibold text-white tracking-tight">
            SignBridge <span className="text-brand-300">AI</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/translate" className={linkClass}>Translator</NavLink>
          <NavLink to="/learn" className={linkClass}>Learn Signs</NavLink>
        </div>

        <div className="hidden md:block">
          <Link to="/translate" className="btn-primary text-sm px-4 py-2.5">Start translating</Link>
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-slate-300 hover:bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 space-y-1 bg-slate-900/90">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/translate" className={linkClass} onClick={() => setOpen(false)}>Translator</NavLink>
          <NavLink to="/learn" className={linkClass} onClick={() => setOpen(false)}>Learn Signs</NavLink>
        </div>
      )}
    </header>
  );
}
