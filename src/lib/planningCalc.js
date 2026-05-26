import {
  CO2_PER_M3_KG,
  COST_PER_M3_MAD,
  FACTEUR_AJUSTEMENT,
  RATIOS,
  computeOptimizationCoeff,
} from './calculations';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDate(value) {
  if (value instanceof Date) return value;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function diffDaysInclusive(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, Math.round((startOfDay(end) - startOfDay(start)) / MS_PER_DAY) + 1);
}

export function getPeriodRange(periodKind, anchor) {
  const date = startOfDay(toDate(anchor) ?? new Date());

  if (periodKind === 'day') {
    return { start: date, end: date, label: formatHumanDate(date) };
  }

  if (periodKind === 'week') {
    const day = date.getDay();
    // ISO week: Monday = 0
    const offset = (day + 6) % 7;
    const start = new Date(date);
    start.setDate(date.getDate() - offset);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      start,
      end,
      label: `Semaine du ${formatHumanDate(start)} au ${formatHumanDate(end)}`,
    };
  }

  if (periodKind === 'month') {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      start,
      end,
      label: start.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    };
  }

  if (periodKind === 'project') {
    return { start: null, end: null, label: 'Sur tout le planning' };
  }

  return { start: date, end: date, label: formatHumanDate(date) };
}

function formatHumanDate(date) {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function computeTaskWaterM3(task) {
  const ratio = RATIOS[task.activity] ?? 0;
  const litres = task.quantity * ratio * FACTEUR_AJUSTEMENT;
  return litres / 1000;
}

// ---------------------------------------------------------------------------
// Daily variation profiles per activity.
//   shape: how consumption is distributed across the task duration
//          'bell'      — ramp-up / plateau / ramp-down (default)
//          'frontLoad' — heavier in early days (e.g. concrete cure)
//          'backLoad'  — heavier near the end (e.g. MEE tests, finishings)
//          'flat'      — uniform
//   dow: weekly weighting Mon..Sun. Site work is normally Mon-Fri full,
//        Saturday partial, Sunday off; base-vie also runs partial weekends.
// A deterministic noise (±20 %) is layered on top so identical activities
// on different days don't look mechanically identical.
// ---------------------------------------------------------------------------

const DEFAULT_PROFILE = { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.35, 0.05] };

const ACTIVITY_PROFILES = {
  // Concrete pours — Mon-Fri only, slight Sat, bell across phase
  BETON_GACH: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.25, 0] },
  BETON_NETTOYAGE: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.25, 0] },
  TOUPIE_LAVAGE: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.25, 0] },
  POMPE_BETON: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.25, 0] },
  CENTRALE_BETON: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  BENTONITE: { shape: 'frontLoad', dow: [1, 1, 1, 1, 1, 0.25, 0] },
  // Curing — heavier right after pour, then tapers
  BETON_CURE: { shape: 'frontLoad', dow: [1, 1, 1, 1, 1, 0.9, 0.7] },
  // Masonry / chapes — workday weighted, bell
  MACONN_ENDUIT: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  MACONN_HUMIDIF: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  CHAPES_RAGREAGES: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  MORTIER_GACH: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  SCIAGE_EAU: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  CAROTTAGE: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  // Earthworks / dust — every day during phase
  COMPACTAGE: { shape: 'bell', dow: [1, 1, 1, 1, 1, 0.4, 0] },
  ARROS_VOIES: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.7, 0.4] },
  BRUMISATION: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.7, 0.3] },
  LAVAGE_ROUES: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.4, 0] },
  NETTOYAGE_ENGINS: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.5, 0] },
  // Base-vie — daily occupancy, partial weekend
  WC_CHASSE: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.4, 0.2] },
  DOUCHE: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.4, 0.2] },
  LAVABO: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.4, 0.2] },
  CUISINE: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.3, 0.15] },
  NETTOYAGE_BASEVIE: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.5, 0.3] },
  // Mises en eau — concentrated near end of phase
  PLOMBERIE_MEE: { shape: 'backLoad', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  CHAUFFAGE_MEE: { shape: 'backLoad', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  SPRINKLER_MEE: { shape: 'backLoad', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  BASSIN: { shape: 'backLoad', dow: [1, 1, 1, 1, 1, 0.5, 0.2] },
  SECURITE_TESTS: { shape: 'backLoad', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  // Landscape / irrigation — continuous, weekend included
  PAYSAGE: { shape: 'flat', dow: [1, 1, 1, 1, 1, 1, 1] },
  // Lab
  ESSAIS_BETON: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.3, 0] },
  NETTOYAGE_LABO: { shape: 'flat', dow: [1, 1, 1, 1, 1, 0.3, 0] },
};

function shapeWeight(shape, idx, total) {
  if (total <= 1) return 1;
  const t = idx / (total - 1); // 0..1
  switch (shape) {
    case 'frontLoad':
      // 1.6 at start → 0.4 at end
      return 0.4 + 1.2 * (1 - t);
    case 'backLoad':
      return 0.4 + 1.2 * t;
    case 'flat':
      return 1;
    case 'bell':
    default:
      if (t < 0.2) return 0.4 + 3 * t; // 0.4 → 1.0
      if (t > 0.8) return 0.4 + 3 * (1 - t); // 1.0 → 0.4
      return 1;
  }
}

// Deterministic ±45% jitter so identical activities on different days
// produce visibly varied (but reproducible) daily volumes. We mix two
// independent hashes + a slow sinusoidal wave so consecutive days don't
// look monotone.
function dailyNoise(dateMs, activity) {
  const dayIdx = Math.floor(dateMs / MS_PER_DAY);
  // Hash A — high-frequency jitter
  const keyA = `${dayIdx}|${activity}|A`;
  let hA = 2166136261;
  for (let i = 0; i < keyA.length; i += 1) {
    hA ^= keyA.charCodeAt(i);
    hA = Math.imul(hA, 16777619);
  }
  const rA = ((hA >>> 0) % 10000) / 10000; // 0..1
  // Hash B — used to phase a slower wave
  const keyB = `${activity}|B`;
  let hB = 2166136261;
  for (let i = 0; i < keyB.length; i += 1) {
    hB ^= keyB.charCodeAt(i);
    hB = Math.imul(hB, 16777619);
  }
  const phaseB = ((hB >>> 0) % 1000) / 1000;
  // Slow wave (~14-day cycle) ±15%
  const wave = 1 + 0.15 * Math.sin((dayIdx / 14 + phaseB) * Math.PI * 2);
  // High-frequency jitter ±35%
  const jitter = 0.65 + rA * 0.7;
  // Occasional outlier days (10% chance) ±25%
  const spike = rA > 0.9 ? 1.25 : rA < 0.1 ? 0.75 : 1;
  return jitter * wave * spike;
}

function dayWeight(date, activity, idx, totalDays) {
  const profile = ACTIVITY_PROFILES[activity] ?? DEFAULT_PROFILE;
  const dow = (date.getDay() + 6) % 7; // Mon=0..Sun=6
  const shape = shapeWeight(profile.shape, idx, totalDays);
  const dowW = profile.dow[dow] ?? 1;
  if (shape === 0 || dowW === 0) return 0;
  return shape * dowW * dailyNoise(date.getTime(), activity);
}

export function computePlanningResults(tasks, periodRange, selectedOpts = []) {
  const { start: pStart, end: pEnd } = periodRange;
  const pStartDay = pStart ? startOfDay(pStart) : null;
  const pEndDay = pEnd ? startOfDay(pEnd) : null;
  const activeTasks = [];

  let totalBrutM3 = 0;

  tasks.forEach((task) => {
    const tStart = toDate(task.start);
    const tEnd = toDate(task.end);
    if (!tStart || !tEnd) return;

    // Quick reject if no overlap at all
    if (pStartDay && tEnd < pStartDay) return;
    if (pEndDay && tStart > pEndDay) return;

    const taskDays = diffDaysInclusive(tStart, tEnd);
    if (taskDays <= 0) return;

    let totalW = 0;
    let periodW = 0;
    const cursor = startOfDay(tStart);
    for (let i = 0; i < taskDays; i += 1) {
      const d = new Date(cursor.getTime() + i * MS_PER_DAY);
      const w = dayWeight(d, task.activity, i, taskDays);
      totalW += w;
      const inPeriod =
        (!pStartDay || d >= pStartDay) && (!pEndDay || d <= pEndDay);
      if (inPeriod) periodW += w;
    }

    if (totalW <= 0) return;
    const fraction = periodW / totalW;
    if (fraction <= 0) return;

    const proratedQuantity = task.quantity * fraction;
    const fullM3 = computeTaskWaterM3(task);
    const proratedM3 = fullM3 * fraction;

    totalBrutM3 += proratedM3;

    activeTasks.push({
      ...task,
      overlapDays: diffDaysInclusive(
        pStartDay && tStart < pStartDay ? pStartDay : tStart,
        pEndDay && tEnd > pEndDay ? pEndDay : tEnd,
      ),
      taskDays,
      fraction,
      proratedQuantity,
      m3: proratedM3,
    });
  });

  activeTasks.sort((a, b) => b.m3 - a.m3);

  const optCoeff = computeOptimizationCoeff(selectedOpts);
  const totalOptM3 = totalBrutM3 * (1 - optCoeff);
  const savingsM3 = totalBrutM3 - totalOptM3;

  // Category breakdown
  const categoryMap = new Map();
  activeTasks.forEach((task) => {
    categoryMap.set(task.category, (categoryMap.get(task.category) ?? 0) + task.m3);
  });
  const categories = [...categoryMap.entries()]
    .map(([category, m3]) => ({
      category,
      m3,
      pct: totalBrutM3 > 0 ? (m3 / totalBrutM3) * 100 : 0,
    }))
    .sort((a, b) => b.m3 - a.m3);

  return {
    activeTasks,
    categories,
    totals: {
      taskCount: activeTasks.length,
      totalBrutM3,
      totalOptM3,
      savingsM3,
      costMad: totalOptM3 * COST_PER_M3_MAD,
      savingsMad: savingsM3 * COST_PER_M3_MAD,
      co2Kg: totalOptM3 * CO2_PER_M3_KG,
      savingsCo2Kg: savingsM3 * CO2_PER_M3_KG,
      coeffOpt: optCoeff,
    },
  };
}

export function getPlanningDateBounds(tasks) {
  if (!tasks.length) return null;
  let min = null;
  let max = null;
  tasks.forEach((task) => {
    const s = toDate(task.start);
    const e = toDate(task.end);
    if (s && (!min || s < min)) min = s;
    if (e && (!max || e > max)) max = e;
  });
  return min && max ? { start: min, end: max } : null;
}
