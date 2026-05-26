import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Calendar,
  CalendarDays,
  CalendarRange,
  Check,
  Coins,
  Download,
  Droplets,
  FileText,
  Leaf,
  ListChecks,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  buildCsvTemplate,
  getActivityCatalog,
  parsePlanningCsv,
} from '../lib/planningParser';
import {
  computePlanningResults,
  getPeriodRange,
  getPlanningDateBounds,
} from '../lib/planningCalc';
import { OPTIMIZATIONS } from '../lib/calculations';
import { formatNumber } from '../lib/formatters';
import { useLocalStorage } from '../hooks/useLocalStorage';

const PLANNING_STORAGE_KEY = 'blue-site-planning-v1';
const PERIOD_OPTIONS = [
  { id: 'day', label: 'Jour', icon: Calendar },
  { id: 'week', label: 'Semaine', icon: CalendarDays },
  { id: 'month', label: 'Mois', icon: CalendarRange },
  { id: 'project', label: 'Tout le planning', icon: ListChecks },
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatPeriodValue(periodKind, anchor) {
  if (periodKind === 'month') return anchor.slice(0, 7);
  if (periodKind === 'week' || periodKind === 'day') return anchor;
  return anchor;
}

function downloadFile(filename, content, mimeType = 'text/csv') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function PlanningView() {
  const [stored, setStored] = useLocalStorage(PLANNING_STORAGE_KEY, {
    tasks: [],
    fileName: '',
    selectedOptIds: [],
  });
  const [tasks, setTasks] = useState(stored.tasks ?? []);
  const [fileName, setFileName] = useState(stored.fileName ?? '');
  const [selectedOptIds, setSelectedOptIds] = useState(stored.selectedOptIds ?? []);
  const [periodKind, setPeriodKind] = useState('week');
  const [periodAnchor, setPeriodAnchor] = useState(todayIso());
  const [parseErrors, setParseErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setStored({ tasks, fileName, selectedOptIds });
  }, [tasks, fileName, selectedOptIds, setStored]);

  const bounds = useMemo(() => getPlanningDateBounds(tasks), [tasks]);

  // Auto-anchor to planning bounds the first time tasks load
  useEffect(() => {
    if (!bounds) return;
    const anchorDate = new Date(`${periodAnchor}T00:00:00`);
    if (Number.isNaN(anchorDate.getTime()) || anchorDate < bounds.start || anchorDate > bounds.end) {
      setPeriodAnchor(bounds.start.toISOString().slice(0, 10));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bounds?.start?.getTime(), bounds?.end?.getTime()]);

  const periodRange = useMemo(
    () => getPeriodRange(periodKind, periodAnchor),
    [periodKind, periodAnchor],
  );

  const selectedOpts = useMemo(
    () => OPTIMIZATIONS.filter((opt) => selectedOptIds.includes(opt.id)),
    [selectedOptIds],
  );

  const results = useMemo(
    () => computePlanningResults(tasks, periodRange, selectedOpts),
    [tasks, periodRange, selectedOpts],
  );

  const catalog = useMemo(() => getActivityCatalog(), []);

  const handleFileSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = String(event.target?.result ?? '');
      const { tasks: parsedTasks, errors } = parsePlanningCsv(text);
      setParseErrors(errors);
      if (parsedTasks.length > 0) {
        setTasks(parsedTasks);
        setFileName(file.name);
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleClear = () => {
    setTasks([]);
    setFileName('');
    setParseErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleOptimization = (id) => {
    setSelectedOptIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  };

  const onDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const hasTasks = tasks.length > 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="dashboard-hero">
        <div>
          <p className="eyebrow">Planning chantier</p>
          <h2 className="section-title">Importez votre planning, pilotez la consommation d'eau</h2>
        </div>
      </div>

      {!hasTasks ? (
        <div
          className={`planning-dropzone ${isDragging ? 'planning-dropzone-active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
          />
          <Upload size={32} className="text-gold" />
          <p className="font-display text-xl text-primary">
            Glissez un fichier CSV ou cliquez pour parcourir
          </p>
          <p className="text-sm text-secondary">
            Format planning chantier — colonnes : <code>phase</code>, <code>type</code>, <code>start</code>, <code>end</code>, plus les métriques utiles (<code>surface_m2</code>, <code>volume_beton_m3</code>, <code>effectif</code>, <code>vehicules_jour</code>, <code>reseau_m3</code>…). L'app déduit automatiquement les consommations d'eau correspondantes.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              className="secondary-button"
              onClick={(e) => {
                e.stopPropagation();
                downloadFile('blue-site-planning-template.csv', buildCsvTemplate());
              }}
            >
              <Download size={14} />
              Télécharger le modèle CSV
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowCatalog((v) => !v);
              }}
            >
              <FileText size={14} />
              {showCatalog ? 'Masquer' : 'Voir'} le catalogue d'activités
            </button>
          </div>
        </div>
      ) : (
        <div className="planning-loaded-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Planning importé</p>
              <p className="font-display text-lg text-primary">{fileName || 'planning.csv'}</p>
              <p className="mt-1 text-sm text-secondary">
                {tasks.length} tâches ·{' '}
                {bounds
                  ? `du ${bounds.start.toLocaleDateString('fr-FR')} au ${bounds.end.toLocaleDateString('fr-FR')}`
                  : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="secondary-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={14} />
                Remplacer
              </button>
              <button type="button" className="secondary-button" onClick={handleClear}>
                <Trash2 size={14} />
                Vider
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
              />
            </div>
          </div>
        </div>
      )}

      {parseErrors.length > 0 ? (
        <div className="planning-errors">
          <div className="flex items-center gap-2 font-sans text-sm font-bold text-rose-700">
            <AlertTriangle size={16} />
            Anomalies détectées ({parseErrors.length})
          </div>
          <ul className="mt-2 space-y-1 text-sm text-rose-700">
            {parseErrors.slice(0, 8).map((err, idx) => (
              <li key={idx}>• {err}</li>
            ))}
            {parseErrors.length > 8 ? <li>… et {parseErrors.length - 8} autres.</li> : null}
          </ul>
        </div>
      ) : null}

      {showCatalog ? (
        <div className="planning-catalog">
          <p className="font-display text-base text-primary">
            Codes activité acceptés ({catalog.length})
          </p>
          <div className="planning-catalog-grid">
            {catalog.map((item) => (
              <div key={item.id} className="planning-catalog-item">
                <code className="planning-code">{item.id}</code>
                <span className="text-sm text-primary">{item.label}</span>
                <span className="text-xs text-secondary">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {hasTasks ? (
        <>
          <div className="planning-controls">
            <div className="planning-period-tabs">
              {PERIOD_OPTIONS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`period-pill ${periodKind === id ? 'period-pill-active' : ''}`}
                  onClick={() => setPeriodKind(id)}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            {periodKind !== 'project' ? (
              <div className="planning-date-picker">
                <label className="text-xs uppercase tracking-widest text-secondary">
                  {periodKind === 'month' ? 'Mois' : periodKind === 'week' ? 'Semaine de' : 'Date'}
                </label>
                <input
                  type={periodKind === 'month' ? 'month' : 'date'}
                  className="planning-input"
                  value={formatPeriodValue(periodKind, periodAnchor)}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPeriodAnchor(periodKind === 'month' ? `${v}-01` : v);
                  }}
                  min={bounds?.start.toISOString().slice(0, 10)}
                  max={bounds?.end.toISOString().slice(0, 10)}
                />
              </div>
            ) : null}
          </div>

          <p className="planning-period-label">
            <CalendarRange size={14} className="inline" /> {periodRange.label}
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiTile
              icon={ListChecks}
              label="Tâches actives"
              value={formatNumber(results.totals.taskCount, 0)}
              unit=""
            />
            <KpiTile
              icon={Droplets}
              label="Eau consommée"
              value={formatNumber(results.totals.totalOptM3, 1)}
              unit="m³"
              hint={
                results.totals.savingsM3 > 0
                  ? `−${formatNumber(results.totals.savingsM3, 1)} m³ grâce aux optimisations`
                  : undefined
              }
            />
            <KpiTile
              icon={Coins}
              label="Coût eau"
              value={formatNumber(results.totals.costMad, 0)}
              unit="MAD"
              hint={
                results.totals.savingsMad > 0
                  ? `Économie: ${formatNumber(results.totals.savingsMad, 0)} MAD`
                  : undefined
              }
            />
            <KpiTile
              icon={Leaf}
              label="Empreinte CO₂"
              value={formatNumber(results.totals.co2Kg, 0)}
              unit="kg"
              hint={
                results.totals.savingsCo2Kg > 0
                  ? `−${formatNumber(results.totals.savingsCo2Kg, 0)} kg CO₂`
                  : undefined
              }
            />
          </div>

          <div className="planning-section">
            <p className="font-display text-base text-primary">Optimisations appliquées</p>
            <p className="text-xs text-secondary">
              Sélectionnez les optimisations actives sur le chantier — leurs gains s'appliquent à la
              consommation calculée pour la période.
            </p>
            <div className="planning-opt-grid">
              {OPTIMIZATIONS.map((opt) => {
                const active = selectedOptIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`planning-opt-card ${active ? 'planning-opt-active' : ''}`}
                    onClick={() => toggleOptimization(opt.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm text-primary">{opt.name}</span>
                      <span className="planning-opt-badge">−{opt.gain_pct}%</span>
                    </div>
                    <p className="mt-1 text-xs text-secondary">{opt.description}</p>
                    {active ? (
                      <span className="planning-opt-check">
                        <Check size={12} /> Activée
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="planning-section">
            <div className="flex items-center justify-between">
              <p className="font-display text-base text-primary">
                Détail des tâches actives ({results.activeTasks.length})
              </p>
            </div>
            {results.activeTasks.length === 0 ? (
              <p className="mt-3 text-sm text-secondary">
                Aucune tâche n'est active sur cette période.
              </p>
            ) : (
              <div className="planning-table-wrap">
                <table className="planning-table">
                  <thead>
                    <tr>
                      <th>Tâche</th>
                      <th>Activité</th>
                      <th>Catégorie</th>
                      <th>Début</th>
                      <th>Fin</th>
                      <th title="Avancement de la tâche par rapport à aujourd'hui">
                        Avancement
                      </th>
                      <th>Quantité<br />(prorata)</th>
                      <th>Eau (m³)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.activeTasks.map((task) => {
                      // Use the selected period anchor as the "now" reference,
                      // so the POC stays meaningful even on future-dated plannings.
                      const today = new Date(`${periodAnchor}T00:00:00`);
                      today.setHours(0, 0, 0, 0);
                      const taskStart = new Date(`${task.start}T00:00:00`);
                      const taskEnd = new Date(`${task.end}T00:00:00`);
                      const MS = 86400000;
                      let pct = 0;
                      let label = 'À venir';
                      let toneColor = '#94a3b8';
                      if (today < taskStart) {
                        pct = 0;
                        label = 'À venir';
                        toneColor = '#94a3b8';
                      } else if (today > taskEnd) {
                        pct = 100;
                        label = 'Terminée';
                        toneColor = '#16a34a';
                      } else {
                        const passed = Math.round((today - taskStart) / MS) + 1;
                        pct = Math.min(100, Math.max(0, Math.round((passed / task.taskDays) * 100)));
                        label = 'En cours';
                        toneColor = '#ff6200';
                      }
                      return (
                        <tr key={task.id}>
                          <td className="font-sans text-primary">{task.task}</td>
                          <td>
                            <code className="planning-code">{task.activity}</code>
                            <div className="text-xs text-secondary">{task.activityLabel}</div>
                          </td>
                          <td className="text-sm text-secondary">{task.category}</td>
                          <td className="font-mono text-xs text-secondary">
                            {taskStart.toLocaleDateString('fr-FR')}
                          </td>
                          <td className="font-mono text-xs text-secondary">
                            {taskEnd.toLocaleDateString('fr-FR')}
                          </td>
                          <td>
                            <div className="progress-cell">
                              <div className="progress-track">
                                <div
                                  className="progress-fill"
                                  style={{ width: `${pct}%`, background: toneColor }}
                                />
                              </div>
                              <div className="progress-meta">
                                <span style={{ color: toneColor }}>{label}</span>
                                <span className="font-mono">{pct}%</span>
                              </div>
                            </div>
                          </td>
                          <td className="font-mono text-sm">
                            {formatNumber(task.proratedQuantity, 1)}
                          </td>
                          <td className="font-mono text-sm font-bold text-primary">
                            {formatNumber(task.m3, 1)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {results.categories.length > 0 ? (
            <div className="planning-section">
              <p className="font-display text-base text-primary">Répartition par catégorie</p>
              <div className="planning-cat-list">
                {results.categories.map((cat) => (
                  <div key={cat.category} className="planning-cat-row">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-primary">{cat.category}</span>
                      <span className="font-mono text-sm text-primary">
                        {formatNumber(cat.m3, 1)} m³ · {formatNumber(cat.pct, 0)}%
                      </span>
                    </div>
                    <div className="planning-cat-bar">
                      <span style={{ width: `${Math.min(100, cat.pct)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </motion.section>
  );
}

function KpiTile({ icon: Icon, label, value, unit, hint }) {
  return (
    <div className="planning-kpi">
      <div className="flex items-center justify-between">
        <p className="eyebrow">{label}</p>
        <span className="metric-icon">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl text-primary">
        {value} <span className="text-base text-secondary">{unit}</span>
      </p>
      {hint ? <p className="mt-1 text-xs text-secondary">{hint}</p> : null}
    </div>
  );
}
