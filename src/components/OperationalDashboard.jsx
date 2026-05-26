import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  Battery,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Droplets,
  Filter,
  Gauge,
  PowerOff,
  RadioTower,
  ShieldAlert,
  SignalHigh,
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

function ZoneComparisonTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const zone = payload[0]?.payload;
  const actual = zone?.actual ?? 0;
  const threshold = zone?.threshold ?? 0;
  const gap = actual - threshold;

  return (
    <div className="chart-tooltip zone-tooltip">
      <p className="font-sans text-sm font-bold text-primary">{label ?? zone?.label}</p>
      <div className="zone-tooltip-row">
        <span>
          <i style={{ background: 'var(--accent-cyan)' }} />
          Réel IoT
        </span>
        <strong>{formatNumber(actual, 1)} m³</strong>
      </div>
      <div className="zone-tooltip-row">
        <span>
          <i style={{ background: 'var(--accent-sand)' }} />
          Seuil
        </span>
        <strong>{formatNumber(threshold, 1)} m³</strong>
      </div>
      <div className="zone-tooltip-row">
        <span>Écart</span>
        <strong className={gap > 0 ? 'text-gold' : 'text-cyan'}>
          {gap > 0 ? '+' : ''}
          {formatNumber(gap, 1)} m³ · {formatNumber(zone?.variancePct ?? 0, 1)}%
        </strong>
      </div>
      <p className="mt-2 font-mono text-xs text-muted">
        Économie atteignable: {formatNumber(zone?.savingsPotential ?? 0, 1)} m³
      </p>
    </div>
  );
}

function LiveKpi({ icon: Icon, label, value, unit, tone = 'cyan', onClick }) {
  return (
    <motion.button
      type="button"
      className={`live-kpi live-kpi-${tone}`}
      onClick={onClick}
      whileHover={{ y: -2, borderColor: 'rgba(255,98,0,0.34)' }}
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
            <CartesianGrid stroke="rgba(22,43,61,0.08)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: 'rgba(20,32,51,0.52)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(20,32,51,0.52)', fontSize: 11 }} axisLine={false} tickLine={false} />
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
                <Cell key={entry.id} fill={entry.color} stroke="rgba(255,255,255,0.82)" />
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

function DeviceHealth({ data, onStatusFilter, activeStatus }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const STATUS_META = {
    'En ligne': { id: 'online', icon: CheckCircle2, accent: '#16a34a' },
    'A surveiller': { id: 'warning', icon: AlertTriangle, accent: '#f59e0b' },
    'Hors ligne': { id: 'offline', icon: PowerOff, accent: '#dc2626' },
  };

  return (
    <div className="chart-panel">
      <p className="eyebrow">IoT health</p>
      <h3 className="panel-title">État des appareils</h3>
      <p className="mt-1 text-xs text-secondary">
        Cliquez une ligne pour filtrer la flotte ({total} capteurs).
      </p>
      <div className="health-table">
        {data.map((status) => {
          const meta = STATUS_META[status.name] ?? { id: 'all', icon: SignalHigh, accent: status.color };
          const Icon = meta.icon;
          const pct = total > 0 ? (status.value / total) * 100 : 0;
          const isActive = activeStatus === meta.id;
          return (
            <button
              type="button"
              key={status.name}
              className={`health-row ${isActive ? 'health-row-active' : ''}`}
              onClick={() => onStatusFilter(meta.id)}
              style={{ '--row-accent': meta.accent }}
            >
              <span className="health-icon" style={{ background: `${meta.accent}1f`, color: meta.accent }}>
                <Icon size={16} />
              </span>
              <span className="health-label">
                <strong>{status.name}</strong>
                <small>{formatNumber(pct, 0)}% de la flotte</small>
              </span>
              <span className="health-bar">
                <span style={{ width: `${pct}%`, background: meta.accent }} />
              </span>
              <span className="health-count">{status.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ZoneComparison({ data, onSelect }) {
  return (
    <div className="chart-panel xl:col-span-2">
      <p className="eyebrow">Zones</p>
      <h3 className="panel-title">Réel IoT vs seuil opérationnel</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 10 }}>
            <CartesianGrid stroke="rgba(22,43,61,0.08)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'rgba(20,32,51,0.52)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="label" type="category" width={130} tick={{ fill: 'rgba(20,32,51,0.62)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={ZoneComparisonTooltip} cursor={{ fill: 'rgba(0,114,206,0.05)' }} />
            <Bar
              dataKey="threshold"
              name="Seuil"
              fill="rgba(255,178,91,0.58)"
              radius={[0, 5, 5, 0]}
              activeBar={{ fill: 'rgba(255,178,91,0.82)' }}
              onClick={(entry) => onSelect({ type: 'zone', id: entry.id })}
            />
            <Bar dataKey="actual" name="Réel" fill="var(--accent-cyan)" radius={[0, 5, 5, 0]} onClick={(entry) => onSelect({ type: 'zone', id: entry.id })} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="inline-legend">
        <span><i style={{ background: 'rgba(255,178,91,0.58)' }} />Seuil</span>
        <span><i style={{ background: 'var(--accent-cyan)' }} />Réel IoT</span>
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

function OpportunityChart({ zones, onSelect }) {
  const data = zones.slice(0, 6);

  return (
    <div className="chart-panel xl:col-span-2">
      <p className="eyebrow">Économies</p>
      <h3 className="panel-title">Gisements d’économie par zone</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 12, right: 10 }}>
            <CartesianGrid stroke="rgba(22,43,61,0.08)" horizontal={false} />
            <XAxis type="number" tick={{ fill: 'rgba(20,32,51,0.52)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="label" type="category" width={130} tick={{ fill: 'rgba(20,32,51,0.62)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={chartTooltip} cursor={{ fill: 'rgba(255,98,0,0.05)' }} />
            <Bar
              dataKey="loss"
              name="Surconsommation"
              fill="rgba(255,98,0,0.42)"
              radius={[0, 5, 5, 0]}
              onClick={(entry) => onSelect({ type: 'zone', id: entry.id })}
            />
            <Bar
              dataKey="savingsPotential"
              name="Économie atteignable"
              fill="var(--accent-cyan)"
              radius={[0, 5, 5, 0]}
              onClick={(entry) => onSelect({ type: 'zone', id: entry.id })}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="inline-legend">
        <span><i style={{ background: 'rgba(255,98,0,0.42)' }} />Surconsommation</span>
        <span><i style={{ background: 'var(--accent-cyan)' }} />Économie atteignable</span>
      </div>
    </div>
  );
}

function ZoneLimitTable({ zones, onSelect }) {
  const rows = zones.slice(0, 6).map((zone) => {
    const ratio = zone.threshold > 0 ? (zone.actual / zone.threshold) * 100 : 0;
    let status = 'ok';
    if (ratio >= 100) status = 'over';
    else if (ratio >= 85) status = 'warn';
    return { ...zone, ratio, status };
  });

  const STATUS_LABEL = {
    ok: { label: 'Sous seuil', color: '#16a34a' },
    warn: { label: 'À surveiller', color: '#f59e0b' },
    over: { label: 'Dépassement', color: '#dc2626' },
  };

  return (
    <div className="chart-panel">
      <p className="eyebrow">Seuil IoT</p>
      <h3 className="panel-title">Réel vs limite par zone</h3>
      <p className="mt-1 text-xs text-secondary">
        Les zones les plus contraintes apparaissent en tête. Cliquez pour le détail.
      </p>
      <div className="limit-table">
        {rows.map((zone) => {
          const meta = STATUS_LABEL[zone.status];
          return (
            <button
              type="button"
              key={zone.id}
              className={`limit-row limit-${zone.status}`}
              onClick={() => onSelect({ type: 'zone', id: zone.id })}
              style={{ '--row-accent': meta.color }}
            >
              <span className="limit-zone">
                <strong>{zone.label}</strong>
                <small>
                  Réel <em>{formatNumber(zone.actual, 0)} m³</em> / Seuil{' '}
                  <em>{formatNumber(zone.threshold, 0)} m³</em>
                </small>
              </span>
              <span className="limit-bar">
                <span
                  className="limit-fill"
                  style={{
                    width: `${Math.min(100, zone.ratio)}%`,
                    background: meta.color,
                  }}
                />
                {zone.ratio > 100 ? (
                  <span
                    className="limit-overflow"
                    style={{
                      width: `${Math.min(60, zone.ratio - 100)}%`,
                      background: '#dc262680',
                    }}
                  />
                ) : null}
              </span>
              <span className="limit-pct" style={{ color: meta.color }}>
                {formatNumber(zone.ratio, 0)}%
              </span>
              <span className="limit-status" style={{ color: meta.color }}>
                {meta.label}
              </span>
            </button>
          );
        })}
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
  const popupRef = useRef(null);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!entity) {
      setPosition(null);
      return;
    }
    const anchor = entity.anchor ?? { x: window.innerWidth / 2, y: 120 };
    const node = popupRef.current;
    const width = node?.offsetWidth ?? 360;
    const height = node?.offsetHeight ?? 280;
    const margin = 12;
    let x = anchor.x + 16;
    let y = anchor.y + 16;
    if (x + width + margin > window.innerWidth) {
      x = Math.max(margin, anchor.x - width - 16);
    }
    if (y + height + margin > window.innerHeight) {
      y = Math.max(margin, window.innerHeight - height - margin);
    }
    if (x < margin) x = margin;
    if (y < margin) y = margin;
    setPosition({ x, y });
  }, [entity]);

  // Close on Escape and outside click
  useEffect(() => {
    if (!entity) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const onClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
    };
    window.addEventListener('keydown', onKey);
    // delay to avoid catching the same click that opened it
    const timer = window.setTimeout(() => {
      window.addEventListener('mousedown', onClick, true);
    }, 0);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(timer);
      window.removeEventListener('mousedown', onClick, true);
    };
  }, [entity, onClose]);

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
        ref={popupRef}
        className="detail-popup"
        style={
          position
            ? { left: position.x, top: position.y, opacity: 1 }
            : { opacity: 0, pointerEvents: 'none' }
        }
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: position ? 1 : 0, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 4 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
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
            <span>Économie atteignable <strong>{formatNumber(details.savingsPotential, 1)} m³</strong></span>
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

export default function OperationalDashboard({ dashboard, filters, onFilterChange }) {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const details = getEntityDetails(selectedEntity, dashboard);

  useEffect(() => {
    const capture = (event) => {
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointerdown', capture, true);
    return () => window.removeEventListener('pointerdown', capture, true);
  }, []);

  const handleSelect = (entity) => {
    if (!entity) {
      setSelectedEntity(null);
      return;
    }
    setSelectedEntity({ ...entity, anchor: { ...lastPointerRef.current } });
  };

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

        </div>
        <DashboardFilters filters={filters} onChange={updateFilter} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <LiveKpi icon={Droplets} label="Réel IoT" value={formatNumber(dashboard.kpis.actualTotal, 0)} unit="m³" onClick={() => handleSelect({ type: 'day', id: dashboard.daily.at(-1)?.date })} />
        <LiveKpi icon={Target} label="Seuil cumulé" value={formatNumber(dashboard.kpis.thresholdTotal, 0)} unit="m³" tone="sand" />
        <LiveKpi icon={Gauge} label="Écart seuil" value={`${formatNumber(dashboard.kpis.variancePct, 1)}%`} unit="" tone={dashboard.kpis.variancePct > 0 ? 'gold' : 'cyan'} />
        <LiveKpi icon={AlertTriangle} label="Jours hors seuil" value={dashboard.kpis.breachDays} unit="j" tone="gold" />
        <LiveKpi icon={CircuitBoard} label="Capteurs actifs" value={`${dashboard.kpis.activeSensors}/${dashboard.kpis.sensorCount}`} unit="" />
        <LiveKpi icon={Activity} label="Eau réutilisée" value={formatNumber(dashboard.kpis.reuseTotal, 0)} unit="m³" tone="sand" />
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <ThresholdControlChart data={dashboard.daily} onSelect={handleSelect} />
        <div className="space-y-6 xl:col-span-2">
          <UsagePie data={dashboard.usageBreakdown} onSelect={handleSelect} />
          <DeviceHealth
            data={dashboard.deviceHealth}
            activeStatus={filters.status}
            onStatusFilter={(status) => updateFilter('status', status)}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-6">
        <ZoneComparison data={dashboard.zones} onSelect={handleSelect} />
        <OpportunityChart zones={dashboard.powerRank} onSelect={handleSelect} />
        <PowerRank zones={dashboard.powerRank} onSelect={handleSelect} />
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <SensorFleet sensors={dashboard.sensors} onSelect={handleSelect} />
        <div className="space-y-6">
          <AlertsPanel alerts={dashboard.alerts} onSelect={handleSelect} />
          <ZoneLimitTable zones={dashboard.powerRank} onSelect={handleSelect} />
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
