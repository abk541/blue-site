import { memo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useIsMobile } from '../hooks/useIsMobile';
import { formatNumber } from '../lib/formatters';

function CategoryBarChart({ data }) {
  const isMobile = useIsMobile();
  const chartData = data.map((item) => ({
    ...item,
    label: item.category,
  }));

  return (
    <div className="chart-panel">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Répartition</p>
          <h3 className="panel-title">Consommation par catégorie</h3>
        </div>
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 12, bottom: 0, left: isMobile ? 0 : 36 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="var(--accent-blue)" />
                <stop offset="100%" stopColor="var(--accent-cyan)" />
              </linearGradient>
            </defs>
            {!isMobile ? (
              <CartesianGrid stroke="rgba(22,43,61,0.08)" horizontal={false} />
            ) : null}
            {!isMobile ? (
              <XAxis
                type="number"
                tick={{ fill: 'rgba(20,32,51,0.52)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
            ) : null}
            {!isMobile ? (
              <YAxis
                dataKey="label"
                type="category"
                width={142}
                tick={{ fill: 'rgba(20,32,51,0.64)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
            ) : null}
            <Tooltip
              cursor={{ fill: 'rgba(0,114,206,0.07)' }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) {
                  return null;
                }

                const item = payload[0].payload;

                return (
                  <div className="chart-tooltip">
                    <p className="font-sans text-sm text-primary">{item.category}</p>
                    <p className="font-mono text-cyan">{formatNumber(item.m3, 1)} m3</p>
                    <p className="font-mono text-xs text-muted">{formatNumber(item.pct, 1)}%</p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="m3"
              radius={[0, 6, 6, 0]}
              fill="url(#barGradient)"
              barSize={isMobile ? 16 : 22}
              animationBegin={150}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(CategoryBarChart);
