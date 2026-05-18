import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Battery,
  ChevronRight,
  CircuitBoard,
  Droplets,
  Filter,
  Gauge,
  RadioTower,
  ShieldAlert,
  Target,
  X,
  Zap,
} from 'lucide-react';
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  DASHBOARD_PERIODS,
  getEntityDetails,
  IOT_ZONES,
  USAGE_TYPES,
} from '../lib/mockIotData';
import { formatNumber } from '../lib/formatters';

function chartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const title = label ?? payload[0]?.payload?.label ?? payload[0]?.payload?.name ?? 'Détail';

  return (
    <div className="chart-tooltip">
      <p className="font-sans text-sm text-primary">{title}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="font-mono text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatNumber(entry.value, 1)} {entry.payload?.unit ?? 'm³'}
        </p>
      ))}
    </div>
  );
}

function LiveKpi({ icon: Icon, label, value, unit, tone = 'cyan', onClick }) {
  return (
    <motion.button
      type="button"
      className={`live-kpi live-kpi-${tone}`}
      onClick={onClick}
      whileHover={{ y: -2, borderColor: 'rgba(79,140,201,0.38)' }}
    >
      <span className="metric-icon">
        <Icon size={18} />
      </span>
      <span className="mt-5 block font-sans text-sm text-secondary">{label}</span>
      <span className="mt-2 block font-mono text-2xl text-primary">
        {value}
        <span className="ml-2 text-sm text-muted">{unit}</span>
      </span>
    </motion.button>
  );
}

function DashboardFilters({ filters, onChange }) {
  return (
    <div className="dashboard-controls">
      <div className="filter-section-title">
        <Filter size={16} />
        <span className="font-mono text-xs uppercase tracking-widest">Filtres live</span>
      </div>

      <div className="filter-field filter-period-field">
        <span>Période</span>
        <div className="segmented-control">
          {DASHBOARD_PERIODS.map((period) => (
            <button
              type="button"
              key={period.id}
              className={filters.period === period.id ? 'segmented-active' : ''}
              onClick={() => onChange('period', period.id)}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <label className="filter-field">
        <span>Zone</span>
        <select value={filters.zone} onChange={(event) => onChange('zone', event.target.value)}>
          <option value="all">Toutes zones</option>
          {IOT_ZONES.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Usage</span>
        <select value={filters.usage} onChange={(event) => onChange('usage', event.target.value)}>
          <option value="all">Tous usages</option>
          {USAGE_TYPES.map((usage) => (
            <option key={usage.id} value={usage.id}>
              {usage.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Appareils</span>
        <select value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="all">Tous appareils</option>
          <option value="online">En ligne</option>
          <option value="warning">A surveiller</option>
          <option value="offline">Hors ligne</option>
        </select>
      </label>
    </div>
  );
}

function ThresholdControlChart({ data, onSelect }) {
  return (
    <div className="chart-panel xl:col-span-3">
      <div className="mb-5">
        <p className="eyebrow">Contrôle seuil vs réel IoT</p>
        <h3 className="panel-title">Consommation réelle relevée par appareils IoT</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            onClick={(event) => {
              if (event?.activeLabel) {
                const day = data.find((item) => item.label === event.activeLabel);
                if (day) {
                  onSelect({ type: 'day', id: day.date });
                }
              }
            }}
          >
            <defs>
              <linearGradient id="actualArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.36" />
                <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0.03" />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'rgba(239,248,245,0.48)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(239,248,245,0.48)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={chartTooltip} />
            <Bar dataKey="reuse" name="Réutilisée" fill="var(--accent-sand)" radius={[5, 5, 0, 0]} barSize={14} />
            <Area type="monotone" dataKey="actual" name="Réel IoT" stroke="var(--accent-cyan)" fill="url(#actualArea)" strokeWidth={3} />
            <Line type="monotone" dataKey="threshold" name="Seuil" stroke="var(--accent-gold)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="model" name="Modèle" stroke="var(--accent-blue)" strokeDasharray="6 6" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function UsagePie({ data, onSelect }) {
  return (
    <div className="chart-panel">
      <p className="eyebrow">Mix usages</p>
      <h3 className="panel-title">Répartition réelle</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius="58%"
              outerRadius="86%"
              paddingAngle={3}
              onClick={(entry) => onSelect({ type: 'usage', id: entry.id })}
            >
              {data.map((entry) => (
                <Cell key={entry.id} fill={entry.color} stroke="rgba(255,255,255,0.08)" />
              ))}
            </Pie>
            <Tooltip content={chartTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="legend-grid">
        {data.map((usage) => (
          <button type="button" key={usage.id} onClick={() => onSelect({ type: 'usage', id: usage.id })}>
            <span style={{ background: usage.color }} />
            {usage.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DeviceHealth({ data, onStatusFilter }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-panel">
      <p className="eyebrow">IoT health</p>
      <h3 className="panel-title">État des appareils</h3>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart innerRadius="38%" outerRadius="92%" data={data} startAngle={90} endAngle={-270}>
            <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'rgba(255,255,255,0.04)' }}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </RadialBar>
            <Tooltip content={chartTooltip} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="donut-label">
          <span className="font-mono text-3xl text-cyan">{total}</span>
          <span className="mt-1 text-xs uppercase tracking-widest text-muted">capteurs</span>
        </div>
      </div>
      <div className="legend-grid">
        {data.map((status) => (
          <button
            type="button"
            key={status.name}
            onClick={() =>
              onStatusFilter(
                status.name === 'En ligne'
                  ? 'online'
                  : status.name === 'A surveiller'
                    ? 'warning'
                    : 'offline',
              )
            }
          >
            <span style={{ background: status.color }} />
            {status.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function ZoneComparison({ data, onSelect }) {
  return (
    <div className="chart-panel xl:col-span-2">
      <p className="eyebrow">Zones</p>
      <h3 className="panel-title">Réel, seuil et potentiel</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 10 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'rgba(239,248,245,0.48)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="label" type="category" width={130} tick={{ fill: 'rgba(239,248,245,0.58)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={chartTooltip} />
            <Bar dataKey="threshold" name="Seuil" fill="rgba(246,201,111,0.36)" radius={[0, 5, 5, 0]} />
            <Bar dataKey="actual" name="Réel" fill="var(--accent-cyan)" radius={[0, 5, 5, 0]} onClick={(entry) => onSelect({ type: 'zone', id: entry.id })} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PowerRank({ zones, onSelect }) {
  return (
    <div className="chart-panel xl:col-span-2">
      <p className="eyebrow">PowerRank</p>
      <h3 className="panel-title">Priorité d’action</h3>
      <div className="mt-5 space-y-3">
        {zones.slice(0, 6).map((zone) => (
          <button
            type="button"
            key={zone.id}
            className="power-row"
            onClick={() => onSelect({ type: 'zone', id: zone.id })}
          >
            <span className="rank-badge">{zone.powerRank}</span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-3">
                <span className="truncate font-sans text-sm text-primary">{zone.label}</span>
                <span className="font-mono text-xs text-gold">{formatNumber(zone.priorityScore, 1)} pts</span>
              </span>
              <span className="mt-2 block h-1 overflow-hidden rounded-full bg-elevated">
                <span
                  className="block h-full rounded-full bg-gold"
                  style={{ width: `${Math.min(zone.priorityScore, 100)}%` }}
                />
              </span>
            </span>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

function PerformanceRadar({ zones }) {
  const data = zones.slice(0, 6).map((zone) => ({
    zone: zone.label.split(' ')[0],
    score: Math.max(0, 100 - Math.max(0, zone.variancePct) * 2 - zone.sensorIssues * 12),
    reuse: zone.reuseRate,
    savings: Math.min(100, zone.targetReduction * 4),
  }));

  return (
    <div className="chart-panel">
      <p className="eyebrow">Performance</p>
      <h3 className="panel-title">Radar opérationnel</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis dataKey="zone" tick={{ fill: 'rgba(239,248,245,0.58)', fontSize: 11 }} />
            <Radar name="Maîtrise seuil" dataKey="score" stroke="var(--accent-cyan)" fill="var(--accent-cyan)" fillOpacity={0.22} />
            <Radar name="Potentiel" dataKey="savings" stroke="var(--accent-gold)" fill="var(--accent-gold)" fillOpacity={0.12} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function SensorFleet({ sensors, onSelect }) {
  return (
    <div className="chart-panel xl:col-span-3">
      <p className="eyebrow">Appareils IoT</p>
      <h3 className="panel-title">Capteurs terrain cliquables</h3>
      <div className="sensor-grid">
        {sensors.map((sensor) => (
          <button
            type="button"
            key={sensor.id}
            className={`sensor-card sensor-${sensor.status}`}
            onClick={() => onSelect({ type: 'sensor', id: sensor.id })}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="metric-icon">
                <RadioTower size={16} />
              </span>
              <span className="sensor-status">{sensor.status}</span>
            </span>
            <span className="mt-4 block text-left font-sans text-sm font-bold text-primary">{sensor.name}</span>
            <span className="mt-2 block text-left font-mono text-xs text-muted">{sensor.id} · {sensor.device}</span>
            <span className="mt-4 grid grid-cols-3 gap-2 text-left font-mono text-xs text-secondary">
              <span><Battery size={13} /> {sensor.battery}%</span>
              <span><Zap size={13} /> {sensor.signal}%</span>
              <span><Gauge size={13} /> {sensor.accuracy}%</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AlertsPanel({ alerts, onSelect }) {
  return (
    <div className="chart-panel">
      <p className="eyebrow">Alertes</p>
      <h3 className="panel-title">Dépassements et mesures</h3>
      <div className="mt-5 space-y-3">
        {alerts.length ? (
          alerts.map((alert) => (
            <button
              type="button"
              key={alert.id}
              className={`alert-row alert-${alert.severity}`}
              onClick={() => onSelect({ type: 'zone', id: alert.zoneId })}
            >
              <AlertTriangle size={16} />
              <span>
                <strong>{alert.title}</strong>
                <small>{alert.body}</small>
              </span>
            </button>
          ))
        ) : (
          <div className="alert-row">
            <ShieldAlert size={16} />
            <span>
              <strong>Aucune alerte active</strong>
              <small>Les seuils filtrés sont sous contrôle.</small>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailPanel({ entity, details, onClose }) {
  if (!entity || !details) {
    return null;
  }

  const title =
    entity.type === 'sensor'
      ? details.name
      : entity.type === 'usage'
        ? details.label
        : entity.type === 'day'
          ? details.label
          : details.label;

  return (
    <AnimatePresence>
      <motion.aside
        className="detail-drawer"
        initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer le détail">
          <X size={16} />
        </button>
        <p className="eyebrow">Détail sélection</p>
        <h3 className="mt-2 font-display text-2xl text-primary">{title}</h3>

        {entity.type === 'sensor' ? (
          <div className="detail-grid">
            <span>Statut <strong>{details.status}</strong></span>
            <span>Batterie <strong>{details.battery}%</strong></span>
            <span>Signal <strong>{details.signal}%</strong></span>
            <span>Précision <strong>{details.accuracy}%</strong></span>
            <span>Dernier relevé <strong>{details.lastReading}</strong></span>
            <span>Appareil <strong>{details.device}</strong></span>
          </div>
        ) : entity.type === 'usage' ? (
          <div className="detail-grid">
            <span>Réel IoT <strong>{formatNumber(details.value, 1)} m³</strong></span>
            <span>Seuil <strong>{formatNumber(details.threshold, 1)} m³</strong></span>
            <span>Écart <strong>{formatNumber(details.value - details.threshold, 1)} m³</strong></span>
          </div>
        ) : entity.type === 'day' ? (
          <div className="detail-grid">
            <span>Réel IoT <strong>{formatNumber(details.actual, 1)} m³</strong></span>
            <span>Seuil <strong>{formatNumber(details.threshold, 1)} m³</strong></span>
            <span>Modèle <strong>{formatNumber(details.model, 1)} m³</strong></span>
            <span>Réutilisée <strong>{formatNumber(details.reuse, 1)} m³</strong></span>
            <span>Écart seuil <strong>{formatNumber(details.variancePct, 1)}%</strong></span>
          </div>
        ) : (
          <div className="detail-grid">
            <span>Réel IoT <strong>{formatNumber(details.actual, 1)} m³</strong></span>
            <span>Seuil <strong>{formatNumber(details.threshold, 1)} m³</strong></span>
            <span>Écart <strong>{formatNumber(details.variancePct, 1)}%</strong></span>
            <span>Jours hors seuil <strong>{details.breachDays}</strong></span>
            <span>Capteurs <strong>{details.sensorCount}</strong></span>
            <span>Potentiel <strong>{formatNumber(details.savingsPotential, 1)} m³</strong></span>
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

export default function OperationalDashboard({ dashboard, filters, onFilterChange }) {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const details = getEntityDetails(selectedEntity, dashboard);

  const updateFilter = (key, value) => {
    onFilterChange(key, value);
    setSelectedEntity(null);
  };

  return (
    <div className="space-y-6">
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Contrôle consommation réelle</p>
          <h2 className="section-title">Seuils, relevés IoT et décisions terrain</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-secondary">
            Les données ci-dessous sont un jeu cohérent de simulation: elles comparent le modèle Blue Site, les seuils opérationnels et les relevés réels captés par appareils IoT.
          </p>
        </div>
        <DashboardFilters filters={filters} onChange={updateFilter} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <LiveKpi icon={Droplets} label="Réel IoT" value={formatNumber(dashboard.kpis.actualTotal, 0)} unit="m³" onClick={() => setSelectedEntity({ type: 'day', id: dashboard.daily.at(-1)?.date })} />
        <LiveKpi icon={Target} label="Seuil cumulé" value={formatNumber(dashboard.kpis.thresholdTotal, 0)} unit="m³" tone="sand" />
        <LiveKpi icon={Gauge} label="Écart seuil" value={`${formatNumber(dashboard.kpis.variancePct, 1)}%`} unit="" tone={dashboard.kpis.variancePct > 0 ? 'gold' : 'cyan'} />
        <LiveKpi icon={AlertTriangle} label="Jours hors seuil" value={dashboard.kpis.breachDays} unit="j" tone="gold" />
        <LiveKpi icon={CircuitBoard} label="Capteurs actifs" value={`${dashboard.kpis.activeSensors}/${dashboard.kpis.sensorCount}`} unit="" />
        <LiveKpi icon={Activity} label="Eau réutilisée" value={formatNumber(dashboard.kpis.reuseTotal, 0)} unit="m³" tone="sand" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <ThresholdControlChart data={dashboard.daily} onSelect={setSelectedEntity} />
        <div className="space-y-6 xl:col-span-2">
          <UsagePie data={dashboard.usageBreakdown} onSelect={setSelectedEntity} />
          <DeviceHealth data={dashboard.deviceHealth} onStatusFilter={(status) => updateFilter('status', status)} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <ZoneComparison data={dashboard.zones} onSelect={setSelectedEntity} />
        <PowerRank zones={dashboard.powerRank} onSelect={setSelectedEntity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <SensorFleet sensors={dashboard.sensors} onSelect={setSelectedEntity} />
        <div className="space-y-6">
          <AlertsPanel alerts={dashboard.alerts} onSelect={setSelectedEntity} />
          <PerformanceRadar zones={dashboard.powerRank} />
        </div>
      </div>

      <DetailPanel
        entity={selectedEntity}
        details={details}
        onClose={() => setSelectedEntity(null)}
      />
    </div>
  );
}
