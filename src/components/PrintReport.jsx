import { formatCurrency, formatNumber } from '../lib/formatters';
import { DASHBOARD_PERIODS, IOT_ZONES, USAGE_TYPES } from '../lib/mockIotData';

const STATUS_LABELS = {
  all: 'Tous appareils',
  online: 'En ligne',
  warning: 'A surveiller',
  offline: 'Hors ligne',
};

const REPORT_COLORS = {
  actual: '#4f8cc9',
  threshold: '#b66a42',
  model: '#5bb7c8',
  reuse: '#d7c49a',
  grid: '#d6dedb',
  text: '#111827',
};

function getFilterSummary(filters) {
  return {
    period: DASHBOARD_PERIODS.find((period) => period.id === filters.period)?.label ?? filters.period,
    zone: filters.zone === 'all'
      ? 'Toutes zones'
      : IOT_ZONES.find((zone) => zone.id === filters.zone)?.label ?? filters.zone,
    usage: filters.usage === 'all'
      ? 'Tous usages'
      : USAGE_TYPES.find((usage) => usage.id === filters.usage)?.label ?? filters.usage,
    status: STATUS_LABELS[filters.status] ?? filters.status,
  };
}

function getScale(data, keys) {
  return Math.max(
    1,
    ...data.flatMap((item) => keys.map((key) => Number(item[key]) || 0)),
  );
}

function buildLinePath(data, key, width, height, padding, max) {
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  return data
    .map((item, index) => {
      const x = padding + (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
      const y = height - padding - ((Number(item[key]) || 0) / max) * plotHeight;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function PrintLegend({ items }) {
  return (
    <div className="print-legend">
      {items.map((item) => (
        <span key={item.label}>
          <i style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function PrintTrendChart({ data }) {
  const width = 760;
  const height = 280;
  const padding = 38;
  const max = getScale(data, ['actual', 'threshold', 'model']);
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const barWidth = data.length ? Math.max(4, plotWidth / data.length / 2.3) : 0;

  return (
    <section className="print-card print-wide">
      <h3>Contrôle seuil vs réel IoT</h3>
      <svg className="print-svg-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Graphique de consommation IoT">
        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = height - padding - tick * plotHeight;

          return (
            <g key={tick}>
              <line x1={padding} x2={width - padding} y1={y} y2={y} stroke={REPORT_COLORS.grid} strokeWidth="1" />
              <text x="6" y={y + 4} fontSize="10" fill="#6b7280">
                {formatNumber(max * tick, 0)}
              </text>
            </g>
          );
        })}

        {data.map((item, index) => {
          const x = padding + (data.length === 1 ? plotWidth / 2 : (index / (data.length - 1)) * plotWidth);
          const reuseHeight = ((Number(item.reuse) || 0) / max) * plotHeight;

          return (
            <g key={item.date}>
              <rect
                x={x - barWidth / 2}
                y={height - padding - reuseHeight}
                width={barWidth}
                height={reuseHeight}
                rx="2"
                fill={REPORT_COLORS.reuse}
              />
              {index % Math.ceil(data.length / 7 || 1) === 0 ? (
                <text x={x} y={height - 10} textAnchor="middle" fontSize="9" fill="#6b7280">
                  {item.label}
                </text>
              ) : null}
            </g>
          );
        })}

        <path d={buildLinePath(data, 'actual', width, height, padding, max)} fill="none" stroke={REPORT_COLORS.actual} strokeWidth="3" />
        <path d={buildLinePath(data, 'threshold', width, height, padding, max)} fill="none" stroke={REPORT_COLORS.threshold} strokeWidth="2.2" />
        <path d={buildLinePath(data, 'model', width, height, padding, max)} fill="none" stroke={REPORT_COLORS.model} strokeWidth="2" strokeDasharray="6 5" />
      </svg>
      <PrintLegend
        items={[
          { label: 'Réel IoT', color: REPORT_COLORS.actual },
          { label: 'Seuil', color: REPORT_COLORS.threshold },
          { label: 'Modèle Blue Site', color: REPORT_COLORS.model },
          { label: 'Eau réutilisée', color: REPORT_COLORS.reuse },
        ]}
      />
    </section>
  );
}

function PrintUsageDonut({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <section className="print-card">
      <h3>Répartition réelle par usage</h3>
      <div className="print-donut-wrap">
        <svg viewBox="0 0 180 180" className="print-donut" role="img" aria-label="Répartition réelle par usage">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#edf2f0" strokeWidth="28" />
          {data.map((item) => {
            const dash = total ? (item.value / total) * circumference : 0;
            const segment = (
              <circle
                key={item.id}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="28"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 90 90)"
              />
            );
            offset += dash;
            return segment;
          })}
          <text x="90" y="86" textAnchor="middle" fontSize="20" fontWeight="700" fill={REPORT_COLORS.text}>
            {formatNumber(total, 0)}
          </text>
          <text x="90" y="106" textAnchor="middle" fontSize="11" fill="#6b7280">
            m³ réels
          </text>
        </svg>
        <div className="print-usage-list">
          {data.map((item) => (
            <span key={item.id}>
              <i style={{ background: item.color }} />
              {item.label} · {formatNumber(item.value, 0)} m³
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrintZoneBars({ zones }) {
  const max = getScale(zones, ['actual', 'threshold']);

  return (
    <section className="print-card">
      <h3>Zones: réel vs seuil</h3>
      <div className="print-bars">
        {zones.slice(0, 8).map((zone) => (
          <div key={zone.id} className="print-bar-row">
            <div>
              <strong>{zone.label}</strong>
              <span>{formatNumber(zone.actual, 0)} m³ · écart {formatNumber(zone.variancePct, 1)}%</span>
            </div>
            <div className="print-bar-track">
              <span className="print-bar-threshold" style={{ width: `${Math.max((zone.threshold / max) * 100, 1)}%` }} />
              <span className="print-bar-actual" style={{ width: `${Math.max((zone.actual / max) * 100, 1)}%` }} />
            </div>
          </div>
        ))}
      </div>
      <PrintLegend
        items={[
          { label: 'Réel IoT', color: REPORT_COLORS.actual },
          { label: 'Seuil', color: REPORT_COLORS.reuse },
        ]}
      />
    </section>
  );
}

function PrintKpiGrid({ dashboard, results }) {
  const kpis = [
    ['Réel IoT', `${formatNumber(dashboard.kpis.actualTotal, 0)} m³`],
    ['Seuil cumulé', `${formatNumber(dashboard.kpis.thresholdTotal, 0)} m³`],
    ['Écart seuil', `${formatNumber(dashboard.kpis.variancePct, 1)}%`],
    ['Jours hors seuil', `${dashboard.kpis.breachDays} j`],
    ['Capteurs actifs', `${dashboard.kpis.activeSensors}/${dashboard.kpis.sensorCount}`],
    ['Eau réutilisée', `${formatNumber(dashboard.kpis.reuseTotal, 0)} m³`],
    ['Conso. brute modèle', `${formatNumber(results.totals.total_brut_m3, 0)} m³`],
    ['Après optimisations', `${formatNumber(results.totals.total_optimise_m3, 0)} m³`],
  ];

  return (
    <section className="print-kpi-grid">
      {kpis.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

export default function PrintReport({ form, results, dashboard, dashboardFilters }) {
  const printedAt = new Date().toLocaleDateString('fr-FR');
  const filterSummary = getFilterSummary(dashboardFilters);

  return (
    <div className="print-report">
      <header className="print-cover">
        <p>Bouygues Construction · Blue Site</p>
        <h1>Rapport de pilotage eau chantier</h1>
        <span>
          Projet {form.project_name} · Généré le {printedAt}
        </span>
      </header>

      <section className="print-filter-grid">
        <div>
          <span>Période</span>
          <strong>{filterSummary.period}</strong>
        </div>
        <div>
          <span>Zone</span>
          <strong>{filterSummary.zone}</strong>
        </div>
        <div>
          <span>Usage</span>
          <strong>{filterSummary.usage}</strong>
        </div>
        <div>
          <span>Appareils</span>
          <strong>{filterSummary.status}</strong>
        </div>
      </section>

      <PrintKpiGrid dashboard={dashboard} results={results} />

      <PrintTrendChart data={dashboard.daily} />

      <div className="print-chart-grid">
        <PrintUsageDonut data={dashboard.usageBreakdown} />
        <PrintZoneBars zones={dashboard.zones} />
      </div>

      <section className="print-card">
        <h3>PowerRank opérationnel</h3>
        <table>
          <thead>
            <tr>
              <th>Rang</th>
              <th>Zone</th>
              <th>Score</th>
              <th>Écart seuil</th>
              <th>Jours hors seuil</th>
              <th>Potentiel</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.powerRank.slice(0, 8).map((zone) => (
              <tr key={zone.id}>
                <td>{zone.powerRank}</td>
                <td>{zone.label}</td>
                <td>{formatNumber(zone.priorityScore, 1)} pts</td>
                <td>{formatNumber(zone.variancePct, 1)}%</td>
                <td>{zone.breachDays}</td>
                <td>{formatNumber(zone.savingsPotential, 1)} m³</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-card">
        <h3>Alertes et parc IoT filtré</h3>
        <table>
          <thead>
            <tr>
              <th>Alerte</th>
              <th>Détail</th>
              <th>Sévérité</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.alerts.length ? (
              dashboard.alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.title}</td>
                  <td>{alert.body}</td>
                  <td>{alert.severity === 'high' ? 'Haute' : 'Moyenne'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Aucune alerte active sur le périmètre filtré.</td>
              </tr>
            )}
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th>Capteur</th>
              <th>Statut</th>
              <th>Batterie</th>
              <th>Signal</th>
              <th>Dernier relevé</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.sensors.map((sensor) => (
              <tr key={sensor.id}>
                <td>{sensor.name}</td>
                <td>{sensor.status}</td>
                <td>{sensor.battery}%</td>
                <td>{sensor.signal}%</td>
                <td>{sensor.lastReading}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-card print-page-break">
        <h2>Bilan du modèle Blue Site</h2>
        <table>
          <tbody>
            <tr>
              <td>Consommation brute</td>
              <td>{formatNumber(results.totals.total_brut_m3, 1)} m³</td>
            </tr>
            <tr>
              <td>Consommation optimisée</td>
              <td>{formatNumber(results.totals.total_optimise_m3, 1)} m³</td>
            </tr>
            <tr>
              <td>Économie financière</td>
              <td>{formatCurrency(results.totals.savings_mad)}</td>
            </tr>
            <tr>
              <td>CO2 évité</td>
              <td>{formatNumber(results.totals.savings_co2_kg, 1)} kg</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="print-card">
        <h3>Répartition par catégorie</h3>
        <table>
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>m³</th>
              <th>% total</th>
            </tr>
          </thead>
          <tbody>
            {results.categories.map((category) => (
              <tr key={category.category}>
                <td>{category.category}</td>
                <td>{formatNumber(category.m3, 1)}</td>
                <td>{formatNumber(category.pct, 1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-card">
        <h3>Optimisations</h3>
        <table>
          <thead>
            <tr>
              <th>Optimisation</th>
              <th>Gain</th>
              <th>Économie m³</th>
              <th>Économie MAD</th>
            </tr>
          </thead>
          <tbody>
            {results.optimizations.length ? (
              results.optimizations.map((optimization) => (
                <tr key={optimization.id}>
                  <td>{optimization.name}</td>
                  <td>{optimization.gain_pct}%</td>
                  <td>{formatNumber(optimization.savings_m3, 1)}</td>
                  <td>{formatCurrency(optimization.savings_mad)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aucune optimisation sélectionnée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
