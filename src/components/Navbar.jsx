import { BarChart3, Calculator, Droplets } from 'lucide-react';
import bouyguesLogo from '../assets/bouygues-construction-logo-dark.svg';

export default function Navbar({ mode, onModeChange, dashboardEnabled }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-base bg-opacity-90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <button
          className="flex items-center gap-3"
          type="button"
          onClick={() => onModeChange('calculator')}
          aria-label="Blue Site accueil"
        >
          <span className="logo-drop">
            <Droplets size={22} />
          </span>
          <span className="font-display text-xl font-bold text-blue">Blue Site</span>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            className={`mode-pill ${mode === 'calculator' ? 'mode-pill-active' : ''}`}
            onClick={() => onModeChange('calculator')}
          >
            <Calculator size={15} />
            Calculateur
          </button>
          <button
            type="button"
            className={`mode-pill ${mode === 'dashboard' ? 'mode-pill-active' : ''}`}
            onClick={() => onModeChange('dashboard')}
            disabled={!dashboardEnabled}
          >
            <BarChart3 size={15} />
            Dashboard
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="brand-lockup" aria-label="Bouygues Construction">
            <span className="brand-chip">
              <img src={bouyguesLogo} alt="" />
            </span>
            <span className="hidden font-sans text-xs font-bold uppercase tracking-widest text-secondary lg:inline">
              Bouygues Construction
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
