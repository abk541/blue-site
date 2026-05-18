import { memo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import AnimatedNumber from './AnimatedNumber';
import { formatNumber } from '../lib/formatters';

function OptimizationDonut({ totals }) {
  const data = [
    { name: 'Optimisée', value: totals.total_optimise_m3, color: 'var(--accent-cyan)' },
    { name: 'Économie', value: totals.savings_m3, color: 'var(--accent-gold)' },
  ];
  const percent = totals.coeff_global_opt * 100;

  return (
    <div className="chart-panel">
      <p className="eyebrow">Impact</p>
      <h3 className="panel-title">Avant / Après optimisation</h3>
      <div className="relative mt-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius="70%"
              outerRadius="92%"
              startAngle={90}
              endAngle={-270}
              paddingAngle={3}
              animationDuration={900}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="rgba(255,255,255,0.08)" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const item = payload[0].payload;

                return (
                  <div className="chart-tooltip">
                    <p className="font-sans text-sm text-primary">{item.name}</p>
                    <p className="font-mono text-cyan">{formatNumber(item.value, 1)} m3</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-label">
          <span className="font-mono text-4xl text-cyan">
            -
            <AnimatedNumber value={percent} decimals={1} />
            %
          </span>
          <span className="mt-2 text-xs uppercase tracking-widest text-muted">
            gain global
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(OptimizationDonut);
