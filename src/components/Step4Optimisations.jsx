import AnimatedNumber from './AnimatedNumber';
import OptimizationCard from './OptimizationCard';
import WaterFillLoader from './WaterFillLoader';
import { OPTIMIZATIONS } from '../lib/calculations';

export default function Step4Optimisations({
  selectedOptimizationIds,
  results,
  isCalculating,
  onToggleOptimization,
}) {
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Étape 04</p>
        <h2 className="section-title">Optimisations</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {OPTIMIZATIONS.map((optimization) => (
          <OptimizationCard
            key={optimization.id}
            optimization={optimization}
            selected={selectedOptimizationIds.includes(optimization.id)}
            onToggle={onToggleOptimization}
          />
        ))}
      </div>

      <div className="savings-preview">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="eyebrow">Économie potentielle</p>
            <p>
              <AnimatedNumber
                value={results.totals.savings_m3}
                decimals={1}
                className="font-mono text-3xl text-cyan"
              />
              <span className="ml-2 font-mono text-secondary">m3</span>
            </p>
          </div>
          <div>
            <p className="eyebrow">Économie financière estimée</p>
            <p>
              <AnimatedNumber
                value={results.totals.savings_mad}
                className="font-mono text-3xl text-gold"
              />
              <span className="ml-2 font-mono text-secondary">MAD</span>
            </p>
          </div>
          <div>
            <p className="eyebrow">Réduction CO2 estimée</p>
            <p>
              <AnimatedNumber
                value={results.totals.savings_co2_kg}
                className="font-mono text-3xl text-gold"
              />
              <span className="ml-2 font-mono text-secondary">kg</span>
            </p>
          </div>
        </div>

        {isCalculating ? (
          <div className="mt-7">
            <WaterFillLoader />
          </div>
        ) : null}
      </div>
    </div>
  );
}
