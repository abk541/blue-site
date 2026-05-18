export const DASHBOARD_PERIODS = [
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
  { id: 'beton', label: 'Béton', color: '#35dcc0' },
  { id: 'bases-vie', label: 'Bases-vie', color: '#32b8f2' },
  { id: 'vrd', label: 'VRD', color: '#f6c96f' },
  { id: 'lavage', label: 'Lavage', color: '#e75113' },
  { id: 'technique', label: 'Réseaux', color: '#8ddf95' },
  { id: 'paysage', label: 'Paysage', color: '#00a888' },
  { id: 'qa', label: 'Laboratoire', color: '#a6b3ff' },
];

export const IOT_ZONES = [
  {
    id: 'zone-beton',
    label: 'Centrale béton & cure',
    usage: 'beton',
    manager: 'GOE',
    area: 'Lot Gros Oeuvre',
    thresholdDaily: 1420,
    targetReduction: 14,
    reuseRate: 18,
  },
  {
    id: 'zone-bases-nord',
    label: 'Bases-vie Nord',
    usage: 'bases-vie',
    manager: 'QHSE',
    area: 'Vie chantier',
    thresholdDaily: 2280,
    targetReduction: 20,
    reuseRate: 4,
  },
  {
    id: 'zone-vrd',
    label: 'VRD & voiries internes',
    usage: 'vrd',
    manager: 'VRD',
    area: 'Circulations',
    thresholdDaily: 520,
    targetReduction: 25,
    reuseRate: 12,
  },
  {
    id: 'zone-lavage',
    label: 'Lavage engins et roues',
    usage: 'lavage',
    manager: 'Matériel',
    area: 'Portails chantier',
    thresholdDaily: 360,
    targetReduction: 18,
    reuseRate: 28,
  },
  {
    id: 'zone-tech',
    label: 'Réseaux techniques',
    usage: 'technique',
    manager: 'CET',
    area: 'Mises en eau',
    thresholdDaily: 340,
    targetReduction: 10,
    reuseRate: 2,
  },
  {
    id: 'zone-facade',
    label: 'Façade & finitions',
    usage: 'beton',
    manager: 'Façade',
    area: 'Tours et façades',
    thresholdDaily: 245,
    targetReduction: 11,
    reuseRate: 6,
  },
  {
    id: 'zone-paysage',
    label: 'Arrosage paysager',
    usage: 'paysage',
    manager: 'CES',
    area: 'Espaces extérieurs',
    thresholdDaily: 760,
    targetReduction: 24,
    reuseRate: 16,
  },
  {
    id: 'zone-labo',
    label: 'Laboratoire QA',
    usage: 'qa',
    manager: 'Qualité',
    area: 'Essais et contrôles',
    thresholdDaily: 48,
    targetReduction: 8,
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

function buildReadings() {
  const rows = [];

  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date(CURRENT_DATE);
    date.setDate(CURRENT_DATE.getDate() - index);
    const dayNumber = 30 - index;
    const weekdayFactor = [0.86, 0.98, 1.03, 1.05, 1.02, 0.92, 0.52][date.getDay()];
    const rainMm = Math.max(0, Math.sin(dayNumber / 2.8) * 4 + (dayNumber % 9 === 0 ? 6 : 0));

    IOT_ZONES.forEach((zone, zoneIndex) => {
      const commissioningBoost =
        zone.id === 'zone-tech' && dayNumber > 21 ? 1.38 : 1;
      const baseWave = 1 + Math.sin(dayNumber / 3 + zoneIndex * 0.7) * 0.08;
      const pressure =
        zone.id === 'zone-bases-nord' && [9, 10, 11, 24, 25].includes(dayNumber)
          ? 1.16
          : 1;
      const dustEvent =
        zone.id === 'zone-vrd' && [6, 7, 18, 19, 20].includes(dayNumber)
          ? 1.22
          : 1;
      const lowRain =
        zone.usage === 'paysage' ? Math.max(0.72, 1 - rainMm / 24) : 1;
      const threshold = zone.thresholdDaily * (zone.usage === 'paysage' ? lowRain : 1);
      const model = threshold * (0.94 + zoneIndex * 0.012);
      const actual =
        threshold *
        weekdayFactor *
        baseWave *
        pressure *
        dustEvent *
        commissioningBoost *
        (zone.usage === 'lavage' ? 1.05 : 1);
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
  const period = DASHBOARD_PERIODS.find((item) => item.id === filters.period) ?? DASHBOARD_PERIODS[2];
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
      color: '#35dcc0',
      unit: 'capteurs',
    },
    {
      name: 'A surveiller',
      value: filteredSensors.filter((sensor) => sensor.status === 'warning').length,
      color: '#f6c96f',
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
    optimizedTotal: round(results.totals.total_optimise_m3),
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
