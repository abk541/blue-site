import { memo } from 'react';
import { formatNumber } from '../lib/formatters';

function TopConsumers({ consumers }) {
  const max = consumers[0]?.m3 || 1;

  return (
    <div className="chart-panel">
      <p className="eyebrow">Priorités</p>
      <h3 className="panel-title">Top 3 consommateurs</h3>
      <div className="mt-6 space-y-4">
        {consumers.map((consumer, index) => (
          <div className="rank-card" key={consumer.category}>
            <span className="rank-badge">{index + 1}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="truncate font-sans text-sm text-primary">{consumer.category}</p>
                <p className="font-mono text-sm text-cyan">{formatNumber(consumer.m3, 1)} m3</p>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-elevated">
                <div
                  className="h-full rounded-full bg-blue"
                  style={{ width: `${Math.max((consumer.m3 / max) * 100, 4)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(TopConsumers);
