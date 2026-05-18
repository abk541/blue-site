import { memo } from 'react';
import { formatCurrency, formatNumber } from '../lib/formatters';

function OptimizationTable({ optimizations }) {
  return (
    <div className="chart-panel overflow-hidden">
      <p className="eyebrow">Plan retenu</p>
      <h3 className="panel-title">Synthèse des optimisations</h3>
      <div className="mt-6 overflow-x-auto">
        <table className="technical-table">
          <thead>
            <tr>
              <th>Optimisation</th>
              <th>Gain</th>
              <th>Économie m3</th>
              <th>Économie MAD</th>
            </tr>
          </thead>
          <tbody>
            {optimizations.length ? (
              optimizations.map((optimization) => (
                <tr key={optimization.id}>
                  <td>{optimization.name}</td>
                  <td>{optimization.gain_pct}%</td>
                  <td>{formatNumber(optimization.savings_m3, 1)}</td>
                  <td>{formatCurrency(optimization.savings_mad)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-secondary">
                  Aucune optimisation sélectionnée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(OptimizationTable);
