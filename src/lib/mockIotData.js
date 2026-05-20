export const DASHBOARD_PERIODS = [
  { id: '1j', label: '1 jour', days: 1 },
  { id: '7j', label: '7 jours', days: 7 },
  { id: '14j', label: '14 jours', days: 14 },
  { id: '30j', label: '30 jours', days: 30 },
];

export const DASHBOARD_FILTER_DEFAULTS = {
  period: '30j',
  zone: 'all',
  usage: 'all',
  status: 'all',
};

export const USAGE_TYPES = [
  { id: 'beton', label: 'Béton', color: '#0072ce' },
  { id: 'bases-vie', label: 'Bases-vie', color: '#00a9e0' },
  { id: 'vrd', label: 'VRD', color: '#ff6200' },
  { id: 'lavage', label: 'Lavage', color: '#f59e0b' },
  { id: 'technique', label: 'Réseaux', color: '#007a63' },
  { id: 'paysage', label: 'Paysage', color: '#2cb1a6' },
  { id: 'qa', label: 'Laboratoire', color: '#64748b' },
];

export const IOT_ZONES = [
  {
    id: 'zone-beton',
    label: 'Centrale béton & cure',
    usage: 'beton',
    manager: 'GOE',
    area: 'Lot Gros Oeuvre',
    thresholdDaily: 1420,
    targetReduction: 26,
    reuseRate: 18,
  },
  {
    id: 'zone-bases-nord',
    label: 'Bases-vie Nord',
    usage: 'bases-vie',
    manager: 'QHSE',
    area: 'Vie chantier',
    thresholdDaily: 2280,
    targetReduction: 34,
    reuseRate: 4,
  },
  {
    id: 'zone-vrd',
    label: 'VRD & voiries internes',
    usage: 'vrd',
    manager: 'VRD',
    area: 'Circulations',
    thresholdDaily: 520,
    targetReduction: 38,
    reuseRate: 12,
  },
  {
    id: 'zone-lavage',
    label: 'Lavage engins et roues',
    usage: 'lavage',
    manager: 'Matériel',
    area: 'Portails chantier',
    thresholdDaily: 360,
    targetReduction: 32,
    reuseRate: 28,
  },
  {
    id: 'zone-tech',
    label: 'Réseaux techniques',
    usage: 'technique',
    manager: 'CET',
    area: 'Mises en eau',
    thresholdDaily: 340,
    targetReduction: 28,
    reuseRate: 2,
  },
  {
    id: 'zone-facade',
    label: 'Façade & finitions',
    usage: 'beton',
    manager: 'Façade',
    area: 'Tours et façades',
    thresholdDaily: 245,
    targetReduction: 24,
    reuseRate: 6,
  },
  {
    id: 'zone-paysage',
    label: 'Arrosage paysager',
    usage: 'paysage',
    manager: 'CES',
    area: 'Espaces extérieurs',
    thresholdDaily: 760,
    targetReduction: 36,
    reuseRate: 16,
  },
  {
    id: 'zone-labo',
    label: 'Laboratoire QA',
    usage: 'qa',
    manager: 'Qualité',
    area: 'Essais et contrôles',
    thresholdDaily: 48,
    targetReduction: 18,
    reuseRate: 0,
  },
];

export const IOT_SENSORS = [
  {
    id: 'IOT-BTN-01',
    zoneId: 'zone-beton',
    name: 'Débitmètre gâchage béton',
    device: 'AquaNode DN80',
    status: 'online',
    battery: 92,
    signal: 98,
    accuracy: 97,
    lastReading: '15/05/2026 14:42',
  },
  {
    id: 'IOT-BTN-02',
    zoneId: 'zone-beton',
    name: 'Capteur cure dalle niveau 4',
    device: 'PulseMeter C40',
    status: 'online',
    battery: 78,
    signal: 92,
    accuracy: 94,
    lastReading: '15/05/2026 14:39',
  },
  {
    id: 'IOT-BVN-01',
    zoneId: 'zone-bases-nord',
    name: 'Compteur sanitaire Nord',
    device: 'AquaNode DN50',
    status: 'online',
    battery: 88,
    signal: 96,
    accuracy: 96,
    lastReading: '15/05/2026 14:45',
  },
  {
    id: 'IOT-BVN-02',
    zoneId: 'zone-bases-nord',
    name: 'Cuisine collective',
    device: 'KitchenFlow K25',
    status: 'warning',
    battery: 41,
    signal: 72,
    accuracy: 89,
    lastReading: '15/05/2026 13:58',
  },
  {
    id: 'IOT-BVN-03',
    zoneId: 'zone-bases-nord',
    name: 'Douches temporaires',
    device: 'PulseMeter C25',
    status: 'online',
    battery: 83,
    signal: 91,
    accuracy: 95,
    lastReading: '15/05/2026 14:47',
  },
  {
    id: 'IOT-VRD-01',
    zoneId: 'zone-vrd',
    name: 'Arrosage voies internes',
    device: 'DustFlow D32',
    status: 'online',
    battery: 69,
    signal: 88,
    accuracy: 93,
    lastReading: '15/05/2026 14:18',
  },
  {
    id: 'IOT-VRD-02',
    zoneId: 'zone-vrd',
    name: 'Compactage plateforme',
    device: 'AquaNode DN40',
    status: 'offline',
    battery: 12,
    signal: 0,
    accuracy: 0,
    lastReading: '15/05/2026 08:21',
  },
  {
    id: 'IOT-LAV-01',
    zoneId: 'zone-lavage',
    name: 'Portique lave-roues Est',
    device: 'WashLoop WL60',
    status: 'warning',
    battery: 55,
    signal: 64,
    accuracy: 90,
    lastReading: '15/05/2026 14:05',
  },
  {
    id: 'IOT-LAV-02',
    zoneId: 'zone-lavage',
    name: 'Station lavage bennes',
    device: 'AquaNode DN32',
    status: 'online',
    battery: 81,
    signal: 89,
    accuracy: 94,
    lastReading: '15/05/2026 14:33',
  },
  {
    id: 'IOT-TEC-01',
    zoneId: 'zone-tech',
    name: 'Mise en eau plomberie',
    device: 'HydroTest H100',
    status: 'online',
    battery: 96,
    signal: 90,
    accuracy: 98,
    lastReading: '15/05/2026 14:26',
  },
  {
    id: 'IOT-TEC-02',
    zoneId: 'zone-tech',
    name: 'Boucle CVC provisoire',
    device: 'HydroTest H80',
    status: 'online',
    battery: 74,
    signal: 83,
    accuracy: 93,
    lastReading: '15/05/2026 14:12',
  },
  {
    id: 'IOT-FAC-01',
    zoneId: 'zone-facade',
    name: 'Façade zone A',
    device: 'PulseMeter C25',
    status: 'online',
    battery: 86,
    signal: 94,
    accuracy: 95,
    lastReading: '15/05/2026 14:43',
  },
  {
    id: 'IOT-FAC-02',
    zoneId: 'zone-facade',
    name: 'Finitions humidification',
    device: 'AquaNode DN25',
    status: 'online',
    battery: 77,
    signal: 81,
    accuracy: 92,
    lastReading: '15/05/2026 14:20',
  },
  {
    id: 'IOT-PAY-01',
    zoneId: 'zone-paysage',
    name: 'Arrosage espaces verts',
    device: 'GreenFlow G50',
    status: 'online',
    battery: 90,
    signal: 93,
    accuracy: 96,
    lastReading: '15/05/2026 14:49',
  },
  {
    id: 'IOT-PAY-02',
    zoneId: 'zone-paysage',
    name: 'Cuve eaux pluviales',
    device: 'RainTank RT20',
    status: 'online',
    battery: 84,
    signal: 87,
    accuracy: 94,
    lastReading: '15/05/2026 14:31',
  },
  {
    id: 'IOT-LAB-01',
    zoneId: 'zone-labo',
    name: 'Laboratoire béton',
    device: 'LabFlow L15',
    status: 'online',
    battery: 73,
    signal: 92,
    accuracy: 97,
    lastReading: '15/05/2026 14:37',
  },
];

const CURRENT_DATE = new Date('2026-05-15T12:00:00');

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function dayLabel(date) {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  });
}

function round(value, precision = 1) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function deterministicNoise(seed, amplitude = 0.08) {
  const raw = Math.sin(seed * 12.9898) * 43758.5453;
  return 1 + (raw - Math.floor(raw) - 0.5) * 2 * amplitude;
}

function campaignFactor(dayNumber, campaigns, fallback = 1) {
  const match = campaigns.find((campaign) => dayNumber >= campaign.from && dayNumber <= campaign.to);
  return match?.factor ?? fallback;
}

function plannedActivityFactor(zoneId, dayNumber) {
  const pourDays = [2, 3, 8, 12, 13, 17, 23, 24, 29];
  const cureDays = [4, 5, 9, 14, 15, 18, 25, 26, 30];

  if (zoneId === 'zone-beton') {
    if (pourDays.includes(dayNumber)) return 1.72;
    if (cureDays.includes(dayNumber)) return 1.28;
    return campaignFactor(dayNumber, [
      { from: 1, to: 6, factor: 1.04 },
      { from: 10, to: 18, factor: 1.18 },
      { from: 22, to: 30, factor: 1.12 },
    ], 0.62);
  }

  if (zoneId === 'zone-bases-nord') {
    return campaignFactor(dayNumber, [
      { from: 1, to: 7, factor: 0.9 },
      { from: 8, to: 15, factor: 1.14 },
      { from: 16, to: 22, factor: 1.02 },
      { from: 23, to: 30, factor: 1.24 },
    ], 1);
  }

  if (zoneId === 'zone-vrd') {
    return campaignFactor(dayNumber, [
      { from: 5, to: 9, factor: 1.58 },
      { from: 18, to: 22, factor: 1.86 },
      { from: 27, to: 29, factor: 1.35 },
    ], 0.42);
  }

  if (zoneId === 'zone-lavage') {
    if ([3, 4, 8, 13, 18, 19, 24, 28, 29].includes(dayNumber)) return 1.55;
    return campaignFactor(dayNumber, [
      { from: 10, to: 15, factor: 1.16 },
      { from: 23, to: 30, factor: 1.22 },
    ], 0.76);
  }

  if (zoneId === 'zone-tech') {
    return campaignFactor(dayNumber, [
      { from: 1, to: 12, factor: 0.28 },
      { from: 13, to: 20, factor: 0.62 },
      { from: 21, to: 24, factor: 1.85 },
      { from: 25, to: 28, factor: 1.38 },
      { from: 29, to: 30, factor: 0.92 },
    ], 0.5);
  }

  if (zoneId === 'zone-facade') {
    return campaignFactor(dayNumber, [
      { from: 1, to: 8, factor: 0.4 },
      { from: 9, to: 16, factor: 1.44 },
      { from: 17, to: 23, factor: 0.72 },
      { from: 24, to: 30, factor: 1.22 },
    ], 0.64);
  }

  if (zoneId === 'zone-paysage') {
    return campaignFactor(dayNumber, [
      { from: 1, to: 6, factor: 0.55 },
      { from: 7, to: 14, factor: 0.92 },
      { from: 15, to: 22, factor: 1.38 },
      { from: 23, to: 30, factor: 1.64 },
    ], 0.9);
  }

  if (zoneId === 'zone-labo') {
    if (pourDays.includes(dayNumber)) return 2.1;
    if ([6, 16, 20, 27].includes(dayNumber)) return 1.35;
    return 0.42;
  }

  return 1;
}

function fieldRealityFactor(zoneId, dayNumber, rainMm) {
  const unplannedEvents = {
    'zone-beton': { 11: 1.22, 21: 0.66, 28: 1.18 },
    'zone-bases-nord': { 9: 1.24, 10: 1.18, 24: 1.28, 25: 1.2 },
    'zone-vrd': { 6: 1.25, 19: 1.22, 20: 1.34, 26: 0.58 },
    'zone-lavage': { 8: 1.18, 18: 1.28, 24: 1.26 },
    'zone-tech': { 22: 1.32, 23: 1.24, 27: 0.72 },
    'zone-facade': { 14: 1.2, 15: 1.16, 22: 0.7 },
    'zone-paysage': { 17: 1.18, 18: 1.22, 23: 1.15 },
    'zone-labo': { 12: 1.24, 23: 1.22 },
  };
  const rainImpact =
    zoneId === 'zone-paysage'
      ? Math.max(0.38, 1 - rainMm / 13)
      : zoneId === 'zone-vrd'
        ? Math.max(0.68, 1 - rainMm / 28)
        : 1;

  return (unplannedEvents[zoneId]?.[dayNumber] ?? 1) * rainImpact;
}

function improvementPressureFactor(zoneId, dayNumber) {
  const pressureByZone = {
    'zone-beton': 1.13,
    'zone-bases-nord': 1.24,
    'zone-vrd': 1.34,
    'zone-lavage': 1.28,
    'zone-tech': 1.2,
    'zone-facade': 1.18,
    'zone-paysage': 1.36,
    'zone-labo': 1.14,
  };
  const endOfMonthRush = dayNumber >= 23 ? 1.08 : 1;
  const coordinationDip = [7, 16, 26].includes(dayNumber) ? 0.78 : 1;

  return (pressureByZone[zoneId] ?? 1) * endOfMonthRush * coordinationDip;
}

function buildReadings() {
  const rows = [];

  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date(CURRENT_DATE);
    date.setDate(CURRENT_DATE.getDate() - index);
    const dayNumber = 30 - index;
    const weekdayFactor = [0.42, 0.96, 1.08, 1.02, 1.12, 1.0, 0.74][date.getDay()];
    const rainMm = Math.max(
      0,
      Math.sin(dayNumber / 2.1) * 3.4 +
        ([7, 8, 16, 26].includes(dayNumber) ? 8.5 : 0) +
        ([19, 20].includes(dayNumber) ? 3.2 : 0),
    );

    IOT_ZONES.forEach((zone, zoneIndex) => {
      const planned = plannedActivityFactor(zone.id, dayNumber);
      const fieldReality = fieldRealityFactor(zone.id, dayNumber, rainMm);
      const jitter = deterministicNoise(dayNumber * 31 + zoneIndex * 17, 0.14);
      const thresholdWeather =
        zone.usage === 'paysage'
          ? Math.max(0.5, 1 - rainMm / 20)
          : zone.id === 'zone-vrd'
            ? Math.max(0.78, 1 - rainMm / 38)
            : 1;
      const threshold = zone.thresholdDaily * planned * thresholdWeather;
      const model = threshold * (0.88 + zoneIndex * 0.018 + deterministicNoise(dayNumber + zoneIndex, 0.035) * 0.08);
      const actual =
        threshold *
        weekdayFactor *
        fieldReality *
        improvementPressureFactor(zone.id, dayNumber) *
        jitter *
        (zone.usage === 'lavage' ? 1.08 : 1) *
        (zone.id === 'zone-labo' && planned > 1.8 ? 1.18 : 1);
      const reuse = actual * (zone.reuseRate / 100);

      rows.push({
        id: `${zone.id}-${formatDate(date)}`,
        date: formatDate(date),
        label: dayLabel(date),
        zoneId: zone.id,
        zone: zone.label,
        usage: zone.usage,
        threshold: round(threshold),
        model: round(model),
        actual: round(actual),
        optimized: round(model * (1 - zone.targetReduction / 100)),
        reuse: round(reuse),
        loss: round(Math.max(0, actual - threshold)),
        rainMm: round(rainMm),
      });
    });
  }

  return rows;
}

export const IOT_READINGS = buildReadings();

function sum(rows, key) {
  return rows.reduce((total, row) => total + row[key], 0);
}

function percent(part, total) {
  return total > 0 ? (part / total) * 100 : 0;
}

export function buildDashboardData(results, filters) {
  const period =
    DASHBOARD_PERIODS.find((item) => item.id === filters.period) ??
    DASHBOARD_PERIODS.find((item) => item.id === DASHBOARD_FILTER_DEFAULTS.period) ??
    DASHBOARD_PERIODS.at(-1);
  const cutoff = new Date(CURRENT_DATE);
  cutoff.setDate(CURRENT_DATE.getDate() - period.days + 1);
  const allowedZoneIds =
    filters.zone === 'all' ? IOT_ZONES.map((zone) => zone.id) : [filters.zone];
  const allowedUsageIds =
    filters.usage === 'all' ? USAGE_TYPES.map((usage) => usage.id) : [filters.usage];

  const filteredRows = IOT_READINGS.filter((row) => {
    const rowDate = new Date(`${row.date}T12:00:00`);
    return (
      rowDate >= cutoff &&
      allowedZoneIds.includes(row.zoneId) &&
      allowedUsageIds.includes(row.usage)
    );
  });

  const filteredSensors = IOT_SENSORS.filter((sensor) => {
    const zone = IOT_ZONES.find((item) => item.id === sensor.zoneId);
    return (
      allowedZoneIds.includes(sensor.zoneId) &&
      (!zone || allowedUsageIds.includes(zone.usage)) &&
      (filters.status === 'all' || sensor.status === filters.status)
    );
  });

  const dailyMap = new Map();
  filteredRows.forEach((row) => {
    const current =
      dailyMap.get(row.date) ??
      {
        date: row.date,
        label: row.label,
        actual: 0,
        threshold: 0,
        model: 0,
        optimized: 0,
        reuse: 0,
        loss: 0,
      };

    current.actual += row.actual;
    current.threshold += row.threshold;
    current.model += row.model;
    current.optimized += row.optimized;
    current.reuse += row.reuse;
    current.loss += row.loss;
    dailyMap.set(row.date, current);
  });

  const daily = [...dailyMap.values()].map((row) => ({
    ...row,
    actual: round(row.actual),
    threshold: round(row.threshold),
    model: round(row.model),
    optimized: round(row.optimized),
    reuse: round(row.reuse),
    loss: round(row.loss),
    variancePct: round(percent(row.actual - row.threshold, row.threshold), 1),
  }));

  const zoneRows = IOT_ZONES.filter(
    (zone) => allowedZoneIds.includes(zone.id) && allowedUsageIds.includes(zone.usage),
  ).map((zone) => {
    const rows = filteredRows.filter((row) => row.zoneId === zone.id);
    const sensors = IOT_SENSORS.filter((sensor) => sensor.zoneId === zone.id);
    const actual = sum(rows, 'actual');
    const threshold = sum(rows, 'threshold');
    const loss = sum(rows, 'loss');
    const reuse = sum(rows, 'reuse');
    const breachDays = rows.filter((row) => row.actual > row.threshold).length;
    const sensorIssues = sensors.filter((sensor) => sensor.status !== 'online').length;
    const priorityScore =
      percent(loss, threshold) * 2.2 +
      breachDays * 3 +
      sensorIssues * 18 +
      zone.targetReduction * 0.8;

    return {
      ...zone,
      actual: round(actual),
      threshold: round(threshold),
      model: round(sum(rows, 'model')),
      optimized: round(sum(rows, 'optimized')),
      reuse: round(reuse),
      loss: round(loss),
      variancePct: round(percent(actual - threshold, threshold), 1),
      breachDays,
      sensorCount: sensors.length,
      sensorIssues,
      priorityScore: round(priorityScore, 1),
      powerRank: 0,
      savingsPotential: round(Math.max(0, actual - sum(rows, 'optimized'))),
    };
  });

  const powerRank = [...zoneRows]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map((zone, index) => ({ ...zone, powerRank: index + 1 }));

  const usageBreakdown = USAGE_TYPES.map((usage) => {
    const rows = filteredRows.filter((row) => row.usage === usage.id);
    return {
      ...usage,
      value: round(sum(rows, 'actual')),
      threshold: round(sum(rows, 'threshold')),
    };
  }).filter((usage) => usage.value > 0);

  const deviceHealth = [
    {
      name: 'En ligne',
      value: filteredSensors.filter((sensor) => sensor.status === 'online').length,
      color: '#007a63',
      unit: 'capteurs',
    },
    {
      name: 'A surveiller',
      value: filteredSensors.filter((sensor) => sensor.status === 'warning').length,
      color: '#ff6200',
      unit: 'capteurs',
    },
    {
      name: 'Hors ligne',
      value: filteredSensors.filter((sensor) => sensor.status === 'offline').length,
      color: '#ff4d6d',
      unit: 'capteurs',
    },
  ].filter((item) => item.value > 0);

  const alerts = powerRank
    .filter((zone) => zone.variancePct > 3 || zone.sensorIssues > 0)
    .slice(0, 6)
    .map((zone) => ({
      id: `alert-${zone.id}`,
      zoneId: zone.id,
      title:
        zone.sensorIssues > 0
          ? `${zone.sensorIssues} appareil IoT à vérifier`
          : `Dépassement seuil ${zone.variancePct}%`,
      body:
        zone.sensorIssues > 0
          ? `${zone.label} présente une qualité de mesure dégradée.`
          : `${zone.label} dépasse son seuil sur ${zone.breachDays} relevés.`,
      severity: zone.variancePct > 8 || zone.sensorIssues > 0 ? 'high' : 'medium',
    }));

  const kpis = {
    actualTotal: round(sum(filteredRows, 'actual')),
    thresholdTotal: round(sum(filteredRows, 'threshold')),
    modelTotal: round(sum(filteredRows, 'model')),
    optimizedTotal: round(sum(filteredRows, 'optimized')),
    reuseTotal: round(sum(filteredRows, 'reuse')),
    lossTotal: round(sum(filteredRows, 'loss')),
    variancePct: round(
      percent(sum(filteredRows, 'actual') - sum(filteredRows, 'threshold'), sum(filteredRows, 'threshold')),
      1,
    ),
    breachDays: daily.filter((row) => row.actual > row.threshold).length,
    activeSensors: filteredSensors.filter((sensor) => sensor.status === 'online').length,
    sensorCount: filteredSensors.length,
  };

  return {
    period,
    daily,
    zones: zoneRows,
    powerRank,
    usageBreakdown,
    deviceHealth,
    sensors: filteredSensors,
    alerts,
    kpis,
  };
}

export function getEntityDetails(entity, dashboardData) {
  if (!entity) {
    return null;
  }

  if (entity.type === 'zone') {
    return dashboardData.powerRank.find((zone) => zone.id === entity.id);
  }

  if (entity.type === 'sensor') {
    return dashboardData.sensors.find((sensor) => sensor.id === entity.id);
  }

  if (entity.type === 'usage') {
    return dashboardData.usageBreakdown.find((usage) => usage.id === entity.id);
  }

  if (entity.type === 'day') {
    return dashboardData.daily.find((day) => day.date === entity.id);
  }

  return null;
}
