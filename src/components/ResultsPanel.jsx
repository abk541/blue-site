import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';
import CategoryBarChart from './CategoryBarChart';
import ExportButton from './ExportButton';
import KPICards from './KPICards';
import OperationalDashboard from './OperationalDashboard';
import OptimizationDonut from './OptimizationDonut';
import OptimizationTable from './OptimizationTable';
import PrintReport from './PrintReport';
import TopConsumers from './TopConsumers';
import { buildDashboardData, DASHBOARD_FILTER_DEFAULTS } from '../lib/mockIotData';

export default function ResultsPanel({ form, results, onOpenCalculator }) {
  const [dashboardFilters, setDashboardFilters] = useState(DASHBOARD_FILTER_DEFAULTS);
  const dashboard = useMemo(
    () => buildDashboardData(results, dashboardFilters),
    [dashboardFilters, results],
  );

  const updateDashboardFilter = (key, value) => {
    setDashboardFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <motion.section
      className="results-section"
      initial={{ opacity: 0, x: 38, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2 className="section-title">Tableau de pilotage eau chantier</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">
            Vue de pilotage par défaut. Le calculateur complet est disponible dans un espace dédié.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <button
            type="button"
            className="calculator-entry-button"
            onClick={onOpenCalculator}
          >
            <Calculator size={18} />
            Ouvrir le calculateur
          </button>
          <ExportButton />
        </div>
      </div>

      <OperationalDashboard
        dashboard={dashboard}
        filters={dashboardFilters}
        onFilterChange={updateDashboardFilter}
      />

      <div className="model-dashboard-section">
        <div>
          <p className="eyebrow">Modèle Blue Site</p>
          <h2 className="section-title">Bilan de consommation d'eau</h2>
        </div>

        <KPICards totals={results.totals} />

        <div className="mt-6 grid gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <CategoryBarChart data={results.categories} />
          </div>
          <div className="space-y-6 xl:col-span-2">
            <OptimizationDonut totals={results.totals} />
            <TopConsumers consumers={results.topConsumers} />
          </div>
        </div>

        <div className="mt-6">
          <OptimizationTable optimizations={results.optimizations} />
        </div>
      </div>

      <PrintReport
        form={form}
        results={results}
        dashboard={dashboard}
        dashboardFilters={dashboardFilters}
      />
    </motion.section>
  );
}
