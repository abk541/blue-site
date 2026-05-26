import { LINE_ITEMS } from './calculations';

const REQUIRED_COLUMNS_LEGACY = ['task', 'activity', 'start', 'end'];
const REQUIRED_COLUMNS_PHASE = ['phase', 'type', 'start', 'end'];
const VALID_ACTIVITIES = new Set(LINE_ITEMS.map((item) => item.id));

const ACTIVITY_LABELS = LINE_ITEMS.reduce((acc, item) => {
  acc[item.id] = item.label;
  return acc;
}, {});

const ACTIVITY_CATEGORIES = LINE_ITEMS.reduce((acc, item) => {
  acc[item.id] = item.category;
  return acc;
}, {});

export function getActivityCatalog() {
  return LINE_ITEMS.map(({ id, label, category }) => ({ id, label, category }));
}

// =====================================================================
// PHASE CATALOG — maps construction phase types to the water-consuming
// activities they generate. Quantities are inferred from phase metadata
// (surface, volume béton, effectif, durée…). Each generator returns an
// array of { activity, quantity, suffix } entries.
// =====================================================================

function betonExpansion({ volume_beton_m3 = 0, days = 1 }) {
  if (volume_beton_m3 <= 0) return [];
  const trucks = Math.max(1, Math.ceil(volume_beton_m3 / 8));
  const pumpUses = Math.max(1, Math.ceil(days / 2));
  return [
    { activity: 'BETON_GACH', quantity: volume_beton_m3, suffix: 'gâchage' },
    { activity: 'BETON_CURE', quantity: volume_beton_m3, suffix: 'cure' },
    { activity: 'BETON_NETTOYAGE', quantity: volume_beton_m3, suffix: 'nettoyage coffrage' },
    { activity: 'TOUPIE_LAVAGE', quantity: trucks, suffix: 'lavage toupies' },
    { activity: 'POMPE_BETON', quantity: pumpUses, suffix: 'pompe à béton' },
  ];
}

export const PHASE_TYPES = {
  terrassement: {
    label: 'Terrassement',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, days = 1, vehicules_jour = 0 }) => {
      const list = [];
      if (surface_m2 > 0) {
        list.push({ activity: 'COMPACTAGE', quantity: surface_m2, suffix: 'compactage' });
        list.push({
          activity: 'ARROS_VOIES',
          quantity: Math.round(surface_m2 * (days / 7)),
          suffix: 'arrosage pistes',
        });
      }
      if (vehicules_jour > 0) {
        list.push({
          activity: 'LAVAGE_ROUES',
          quantity: vehicules_jour * days,
          suffix: 'lavage roues',
        });
      }
      return list;
    },
  },
  fondations: { label: 'Fondations', requires: ['volume_beton_m3'], generate: betonExpansion },
  radier: { label: 'Radier', requires: ['volume_beton_m3'], generate: betonExpansion },
  voiles_poteaux: {
    label: 'Voiles & poteaux',
    requires: ['volume_beton_m3'],
    generate: betonExpansion,
  },
  dalle: {
    label: 'Dalle béton',
    requires: ['volume_beton_m3'],
    generate: (p) => {
      const list = betonExpansion(p);
      if (p.linear_m > 0) {
        list.push({ activity: 'SCIAGE_EAU', quantity: p.linear_m, suffix: 'sciage joints' });
      }
      return list;
    },
  },
  carottage: {
    label: 'Carottages techniques',
    requires: [],
    generate: ({ nb_unites = 0 }) =>
      nb_unites > 0
        ? [{ activity: 'CAROTTAGE', quantity: nb_unites, suffix: 'carottages' }]
        : [],
  },
  maconnerie: {
    label: 'Maçonnerie',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0 }) =>
      surface_m2 > 0
        ? [
            { activity: 'MACONN_ENDUIT', quantity: surface_m2, suffix: 'enduits' },
            { activity: 'MACONN_HUMIDIF', quantity: surface_m2, suffix: 'humidification' },
          ]
        : [],
  },
  chapes: {
    label: 'Chapes & ragréages',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0 }) =>
      surface_m2 > 0
        ? [{ activity: 'CHAPES_RAGREAGES', quantity: surface_m2, suffix: 'chapes' }]
        : [],
  },
  carrelage: {
    label: 'Carrelage / mortier',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, volume_beton_m3 = 0 }) => {
      const v = volume_beton_m3 > 0 ? volume_beton_m3 : Math.round(surface_m2 * 0.02);
      return v > 0 ? [{ activity: 'MORTIER_GACH', quantity: v, suffix: 'mortier' }] : [];
    },
  },
  vrd: {
    label: 'VRD & voiries',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, days = 1 }) =>
      surface_m2 > 0
        ? [
            { activity: 'COMPACTAGE', quantity: surface_m2, suffix: 'compactage' },
            {
              activity: 'ARROS_VOIES',
              quantity: Math.round(surface_m2 * (days / 7)),
              suffix: 'arrosage',
            },
          ]
        : [],
  },
  plomberie_mee: {
    label: 'Mise en eau plomberie',
    requires: ['reseau_m3'],
    generate: ({ reseau_m3 = 0 }) =>
      reseau_m3 > 0
        ? [{ activity: 'PLOMBERIE_MEE', quantity: reseau_m3, suffix: 'plomberie' }]
        : [],
  },
  cvc_mee: {
    label: 'Mise en eau CVC',
    requires: ['reseau_m3'],
    generate: ({ reseau_m3 = 0 }) =>
      reseau_m3 > 0
        ? [{ activity: 'CHAUFFAGE_MEE', quantity: reseau_m3, suffix: 'CVC' }]
        : [],
  },
  sprinklers_mee: {
    label: 'Essais sprinklers',
    requires: ['reseau_m3'],
    generate: ({ reseau_m3 = 0 }) =>
      reseau_m3 > 0
        ? [{ activity: 'SPRINKLER_MEE', quantity: reseau_m3, suffix: 'sprinklers' }]
        : [],
  },
  bases_vie: {
    label: 'Bases-vie (continu)',
    requires: ['effectif'],
    generate: ({ effectif = 0, days = 1, surface_m2 = 0, repas_jour = 0 }) => {
      if (effectif <= 0) return [];
      const semaines = days / 7;
      const joursOuvres = days * (5 / 7);
      const list = [
        {
          activity: 'WC_CHASSE',
          quantity: Math.round(effectif * 4 * joursOuvres),
          suffix: 'chasses',
        },
        {
          activity: 'DOUCHE',
          quantity: Math.round(effectif * 3 * semaines),
          suffix: 'douches',
        },
        {
          activity: 'LAVABO',
          quantity: Math.round(effectif * 5 * joursOuvres),
          suffix: 'lavabos',
        },
        {
          activity: 'CUISINE',
          quantity: Math.round((repas_jour > 0 ? repas_jour : effectif) * joursOuvres),
          suffix: 'cantine',
        },
      ];
      if (surface_m2 > 0) {
        list.push({
          activity: 'NETTOYAGE_BASEVIE',
          quantity: Math.round(surface_m2 * semaines),
          suffix: 'nettoyage',
        });
      }
      return list;
    },
  },
  paysage: {
    label: 'Aménagements paysagers',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, days = 1 }) =>
      surface_m2 > 0
        ? [
            {
              activity: 'PAYSAGE',
              quantity: Math.round(surface_m2 * (days / 7)),
              suffix: 'arrosage',
            },
          ]
        : [],
  },
  essais_labo: {
    label: 'Essais laboratoire',
    requires: [],
    generate: ({ nb_essais = 0, days = 1 }) => {
      const list = [];
      if (nb_essais > 0) {
        list.push({ activity: 'ESSAIS_BETON', quantity: nb_essais, suffix: 'essais' });
      }
      list.push({
        activity: 'NETTOYAGE_LABO',
        quantity: Math.max(1, Math.round(days / 7)),
        suffix: 'nettoyages',
      });
      return list;
    },
  },
  nettoyage_engins: {
    label: 'Nettoyage engins',
    requires: [],
    generate: ({ vehicules_jour = 5, days = 1 }) => [
      {
        activity: 'NETTOYAGE_ENGINS',
        quantity: Math.max(1, Math.round(vehicules_jour * (days / 7))),
        suffix: 'lavages',
      },
    ],
  },
  brumisation: {
    label: 'Brumisation poussières',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, days = 1 }) =>
      surface_m2 > 0
        ? [
            {
              activity: 'BRUMISATION',
              quantity: Math.round(surface_m2 * (days / 4)),
              suffix: 'brumisation',
            },
          ]
        : [],
  },

  // ------- Extended catalog for large infrastructure (stadiums, hospitals…) -------

  demolition: {
    label: 'Démolition',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, days = 1, vehicules_jour = 0 }) => {
      const list = [];
      if (surface_m2 > 0) {
        // Heavy dust suppression while demolishing
        list.push({
          activity: 'BRUMISATION',
          quantity: Math.round(surface_m2 * (days / 3)),
          suffix: 'abattage poussières',
        });
        list.push({
          activity: 'ARROS_VOIES',
          quantity: Math.round(surface_m2 * (days / 5)),
          suffix: 'arrosage gravats',
        });
      }
      if (vehicules_jour > 0) {
        list.push({
          activity: 'LAVAGE_ROUES',
          quantity: vehicules_jour * days,
          suffix: 'lavage roues',
        });
      }
      return list;
    },
  },
  pieux: {
    label: 'Pieux & fondations profondes',
    requires: ['nb_unites'],
    generate: ({ nb_unites = 0, volume_beton_m3 = 0, days = 1 }) => {
      const list = [];
      // Bentonite slurry for drilling: ~ 8 m³ per pile on average
      if (nb_unites > 0) {
        list.push({
          activity: 'BENTONITE',
          quantity: Math.round(nb_unites * 8),
          suffix: 'boue bentonite',
        });
      }
      if (volume_beton_m3 > 0) {
        list.push(...betonExpansion({ volume_beton_m3, days }));
      }
      return list;
    },
  },
  gros_oeuvre: {
    label: 'Gros œuvre béton',
    requires: ['volume_beton_m3'],
    generate: betonExpansion,
  },
  voiles_periph: {
    label: 'Voiles périphériques',
    requires: ['volume_beton_m3'],
    generate: betonExpansion,
  },
  gradins_prefa: {
    label: 'Pose gradins préfabriqués',
    requires: ['nb_unites'],
    generate: ({ nb_unites = 0, surface_m2 = 0 }) => {
      const list = [];
      // Mortar joints between precast elements
      const jointVolume = Math.max(1, Math.round(nb_unites * 0.05));
      list.push({ activity: 'MORTIER_GACH', quantity: jointVolume, suffix: 'mortier joints' });
      if (surface_m2 > 0) {
        list.push({
          activity: 'BETON_NETTOYAGE',
          quantity: Math.round(surface_m2 * 0.05),
          suffix: 'nettoyage pose',
        });
      }
      return list;
    },
  },
  charpente_metallique: {
    label: 'Charpente métallique',
    requires: [],
    generate: ({ vehicules_jour = 4, days = 1 }) => [
      // Almost no process water — only logistics & cleaning
      {
        activity: 'NETTOYAGE_ENGINS',
        quantity: Math.max(1, Math.round(vehicules_jour * (days / 7))),
        suffix: 'lavages engins',
      },
    ],
  },
  couverture: {
    label: 'Couverture / étanchéité',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0 }) =>
      surface_m2 > 0
        ? [
            {
              activity: 'SECURITE_TESTS',
              quantity: Math.max(1, Math.round(surface_m2 / 500)),
              suffix: 'essais étanchéité',
            },
          ]
        : [],
  },
  facade: {
    label: 'Façade & bardage',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0 }) =>
      surface_m2 > 0
        ? [
            // Mostly dry, but small water for cleaning panels
            {
              activity: 'BETON_NETTOYAGE',
              quantity: Math.round(surface_m2 * 0.02),
              suffix: 'nettoyage panneaux',
            },
          ]
        : [],
  },
  second_oeuvre: {
    label: 'Second œuvre / cloisons',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0 }) =>
      surface_m2 > 0
        ? [
            {
              activity: 'MORTIER_GACH',
              quantity: Math.max(1, Math.round(surface_m2 * 0.015)),
              suffix: 'colle/mortier',
            },
          ]
        : [],
  },
  peinture: {
    label: 'Peinture & finitions',
    requires: [],
    generate: ({ surface_m2 = 0, days = 1 }) =>
      surface_m2 > 0
        ? [
            {
              activity: 'NETTOYAGE_LABO',
              quantity: Math.max(1, Math.round(days / 7)),
              suffix: 'nettoyage matériel',
            },
          ]
        : [],
  },
  pelouse: {
    label: 'Pose & arrosage pelouse',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, days = 1 }) =>
      surface_m2 > 0
        ? [
            // Establishment irrigation: ~ 6 L/m²/day during install phase
            // Modeled via PAYSAGE ratio + intensified frequency
            {
              activity: 'PAYSAGE',
              quantity: Math.round(surface_m2 * (days / 2)),
              suffix: 'arrosage pelouse',
            },
          ]
        : [],
  },
  amenagement_exterieur: {
    label: 'Aménagements extérieurs',
    requires: ['surface_m2'],
    generate: ({ surface_m2 = 0, days = 1 }) =>
      surface_m2 > 0
        ? [
            { activity: 'COMPACTAGE', quantity: surface_m2, suffix: 'compactage' },
            {
              activity: 'ARROS_VOIES',
              quantity: Math.round(surface_m2 * (days / 7)),
              suffix: 'arrosage',
            },
          ]
        : [],
  },
  electricite: {
    label: 'Électricité (sans eau process)',
    requires: [],
    noWater: true,
    generate: () => [],
  },
  centrale_beton: {
    label: 'Centrale à béton sur site',
    requires: ['volume_beton_m3'],
    generate: ({ volume_beton_m3 = 0 }) =>
      volume_beton_m3 > 0
        ? [
            // Centrale water for plant operations (separate from gâchage)
            {
              activity: 'CENTRALE_BETON',
              quantity: Math.max(1, Math.round(volume_beton_m3 / 30)),
              suffix: 'opérations centrale',
            },
          ]
        : [],
  },
};

export function getPhaseCatalog() {
  return Object.entries(PHASE_TYPES).map(([id, def]) => ({
    id,
    label: def.label,
    requires: def.requires,
  }));
}

// =====================================================================
// CSV PARSING
// =====================================================================

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',' || ch === ';') {
      cells.push(current);
      current = '';
    } else {
      current += ch;
    }
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseDate(value) {
  if (!value) return null;
  const trimmed = String(value).trim();

  const ddmmyyyy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/.exec(trimmed);
  if (ddmmyyyy) {
    let [, d, m, y] = ddmmyyyy;
    if (y.length === 2) y = `20${y}`;
    const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(trimmed);
  if (iso) {
    const [, y, m, d] = iso;
    const date = new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const fallback = new Date(trimmed);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function toNumber(raw) {
  if (raw === '' || raw === undefined || raw === null) return 0;
  const cleaned = String(raw).replace(/\s/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function diffDays(start, end) {
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
}

export function parsePlanningCsv(text) {
  const errors = [];
  const cleanText = text.replace(/^\uFEFF/, '');
  const lines = cleanText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return { tasks: [], errors: ['Fichier vide.'] };
  }

  const headerCells = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
  const headerIndex = {};
  headerCells.forEach((name, idx) => {
    headerIndex[name] = idx;
  });

  const isPhaseMode = 'type' in headerIndex && 'phase' in headerIndex;
  const required = isPhaseMode ? REQUIRED_COLUMNS_PHASE : REQUIRED_COLUMNS_LEGACY;
  const missing = required.filter((col) => !(col in headerIndex));
  if (missing.length > 0) {
    return {
      tasks: [],
      errors: [`Colonnes manquantes: ${missing.join(', ')}. Attendu: ${required.join(', ')}.`],
    };
  }

  const get = (cells, col) => {
    const idx = headerIndex[col];
    return idx === undefined ? '' : (cells[idx] ?? '').trim();
  };

  const tasks = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cells = parseCsvLine(lines[i]);
    const rowNum = i + 1;

    if (isPhaseMode) {
      const phase = get(cells, 'phase');
      const type = get(cells, 'type').toLowerCase();
      const startRaw = get(cells, 'start');
      const endRaw = get(cells, 'end');
      if (!phase && !type && !startRaw && !endRaw) continue;
      if (!phase) {
        errors.push(`Ligne ${rowNum}: nom de phase manquant.`);
        continue;
      }
      const def = PHASE_TYPES[type];
      if (!def) {
        errors.push(
          `Ligne ${rowNum}: type de phase "${type}" inconnu. Types acceptés: ${Object.keys(PHASE_TYPES).join(', ')}.`,
        );
        continue;
      }
      const start = parseDate(startRaw);
      const end = parseDate(endRaw);
      if (!start) {
        errors.push(`Ligne ${rowNum}: date de début invalide ("${startRaw}").`);
        continue;
      }
      if (!end) {
        errors.push(`Ligne ${rowNum}: date de fin invalide ("${endRaw}").`);
        continue;
      }
      if (end < start) {
        errors.push(`Ligne ${rowNum}: la date de fin précède la date de début.`);
        continue;
      }
      const days = diffDays(start, end);
      const params = {
        days,
        surface_m2: toNumber(get(cells, 'surface_m2')),
        volume_beton_m3: toNumber(get(cells, 'volume_beton_m3')),
        linear_m: toNumber(get(cells, 'linear_m')),
        effectif: toNumber(get(cells, 'effectif')),
        vehicules_jour: toNumber(get(cells, 'vehicules_jour')),
        reseau_m3: toNumber(get(cells, 'reseau_m3')),
        nb_essais: toNumber(get(cells, 'nb_essais')),
        nb_unites: toNumber(get(cells, 'nb_unites')),
        repas_jour: toNumber(get(cells, 'repas_jour')),
      };
      const generated = def.generate(params);
      if (generated.length === 0) {
        if (!def.noWater) {
          errors.push(
            `Ligne ${rowNum}: phase "${phase}" — aucune donnée exploitable (vérifiez ${def.requires.join(', ') || 'les paramètres'}).`,
          );
        }
        continue;
      }
      generated.forEach((g, idx) => {
        if (!VALID_ACTIVITIES.has(g.activity) || g.quantity <= 0) return;
        tasks.push({
          id: `P${i}-${idx}`,
          phaseId: `P${i}`,
          phaseName: phase,
          phaseType: type,
          phaseLabel: def.label,
          task: g.suffix ? `${phase} · ${g.suffix}` : phase,
          activity: g.activity,
          activityLabel: ACTIVITY_LABELS[g.activity],
          category: ACTIVITY_CATEGORIES[g.activity],
          start: start.toISOString().slice(0, 10),
          end: end.toISOString().slice(0, 10),
          quantity: g.quantity,
        });
      });
    } else {
      const task = get(cells, 'task');
      const activity = get(cells, 'activity');
      const startRaw = get(cells, 'start');
      const endRaw = get(cells, 'end');
      const quantityRaw = get(cells, 'quantity');
      if (!task && !activity && !startRaw && !endRaw) continue;
      if (!task) {
        errors.push(`Ligne ${rowNum}: nom de tâche manquant.`);
        continue;
      }
      if (!VALID_ACTIVITIES.has(activity)) {
        errors.push(`Ligne ${rowNum}: activité "${activity}" inconnue.`);
        continue;
      }
      const start = parseDate(startRaw);
      const end = parseDate(endRaw);
      if (!start) {
        errors.push(`Ligne ${rowNum}: date de début invalide ("${startRaw}").`);
        continue;
      }
      if (!end) {
        errors.push(`Ligne ${rowNum}: date de fin invalide ("${endRaw}").`);
        continue;
      }
      if (end < start) {
        errors.push(`Ligne ${rowNum}: la date de fin précède la date de début.`);
        continue;
      }
      const quantity = toNumber(quantityRaw);
      if (quantity < 0) {
        errors.push(`Ligne ${rowNum}: quantité invalide ("${quantityRaw}").`);
        continue;
      }
      tasks.push({
        id: `T${i}`,
        task,
        activity,
        activityLabel: ACTIVITY_LABELS[activity],
        category: ACTIVITY_CATEGORIES[activity],
        start: start.toISOString().slice(0, 10),
        end: end.toISOString().slice(0, 10),
        quantity,
      });
    }
  }

  return { tasks, errors };
}

export function buildCsvTemplate() {
  const header =
    'phase,type,start,end,surface_m2,volume_beton_m3,linear_m,effectif,vehicules_jour,reseau_m3,nb_essais,repas_jour';
  const sample = [
    'Installation chantier & bases-vie,bases_vie,2026-06-01,2026-08-28,300,,,60,,,,75',
    'Terrassement plateforme bât. A,terrassement,2026-06-01,2026-06-19,8500,,,,18,,,',
    'Coulage radier B1,radier,2026-06-15,2026-06-26,,420,,,,,,',
    'Voiles RDC bât. B1,voiles_poteaux,2026-06-29,2026-07-17,,310,,,,,,',
    'Dalle haute R+1,dalle,2026-07-13,2026-07-31,,260,640,,,,,',
    'Maçonnerie cloisons R+1,maconnerie,2026-07-20,2026-08-14,1850,,,,,,,',
    'Chapes étage R+1,chapes,2026-08-03,2026-08-21,920,,,,,,,',
    'VRD & voiries finales,vrd,2026-08-10,2026-08-28,3200,,,,,,,',
    'Mise en eau plomberie B1,plomberie_mee,2026-08-17,2026-08-21,,,,,,28,,',
    'Mise en eau CVC B1,cvc_mee,2026-08-24,2026-08-28,,,,,,42,,',
    'Essais sprinklers parking,sprinklers_mee,2026-08-24,2026-08-28,,,,,,18,,',
    'Essais béton laboratoire,essais_labo,2026-06-15,2026-08-21,,,,,,,140,',
    'Aménagements paysagers,paysage,2026-08-17,2026-08-28,1200,,,,,,,',
  ];
  return [header, ...sample].join('\n');
}

export const PLANNING_REQUIRED_COLUMNS_PHASE = REQUIRED_COLUMNS_PHASE;
export const PLANNING_REQUIRED_COLUMNS_LEGACY = REQUIRED_COLUMNS_LEGACY;
