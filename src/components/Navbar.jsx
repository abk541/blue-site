import { BarChart3, Calculator } from 'lucide-react';
import bouyguesLogo from '../assets/bouygues-construction-logo-clean.png';

export default function Navbar({ mode, onModeChange, dashboardEnabled }) {
  return (
    <header className="app-navbar sticky top-0 z-40 border-b border-border bg-card bg-opacity-95 backdrop-blur-xl">
      <div className="nav-inner mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
        <button
          className="brand-home"
          type="button"
          onClick={() => onModeChange('calculator')}
          aria-label="Blue Site accueil"
        >
          <img className="nav-logo" src={bouyguesLogo} alt="Bouygues Construction" />
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-copy">
            <span className="brand-title">Blue Site</span>
            <span className="brand-subtitle">Pilotage eau chantier</span>
          </span>
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
      </div>
    </header>
  );
}
