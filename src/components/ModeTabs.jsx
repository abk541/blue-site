import { BarChart3, Calculator } from 'lucide-react';

export default function ModeTabs({ mode, onModeChange, dashboardEnabled }) {
  return (
    <div className="mx-auto flex max-w-7xl justify-center px-4 py-6 md:hidden">
      <div className="inline-flex rounded-full border border-border bg-card p-1">
        <button
          type="button"
          className={`mobile-mode ${mode === 'calculator' ? 'mobile-mode-active' : ''}`}
          onClick={() => onModeChange('calculator')}
        >
          <Calculator size={14} />
          Calculateur
        </button>
        <button
          type="button"
          className={`mobile-mode ${mode === 'dashboard' ? 'mobile-mode-active' : ''}`}
          onClick={() => onModeChange('dashboard')}
          disabled={!dashboardEnabled}
        >
          <BarChart3 size={14} />
          Dashboard
        </button>
      </div>
    </div>
  );
}
