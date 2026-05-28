export const FACTEUR_AJUSTEMENT = 2;
export const COST_PER_M3_MAD = 20;
export const CO2_PER_M3_KG = 0.5;

export const RATIOS = {
  BETON_GACH: 180,
  BETON_CURE: 2,
  BETON_NETTOYAGE: 10,
  TOUPIE_LAVAGE: 200,
  POMPE_BETON: 400,
  MACONN_ENDUIT: 8,
  MACONN_HUMIDIF: 1,
  SCIAGE_EAU: 15,
  CAROTTAGE: 40,
  BRUMISATION: 1.5,
  COMPACTAGE: 3,
  ARROS_VOIES: 5,
  LAVAGE_ROUES: 120,
  NETTOYAGE_ENGINS: 150,
  WC_CHASSE: 6,
  DOUCHE: 40,
  LAVABO: 1.5,
  CUISINE: 8,
  NETTOYAGE_BASEVIEE: 0.3,
  NETTOYAGE_BASEVIE: 0.3,
  PLOMBERIE_MEE: 1000,
  CHAUFFAGE_MEE: 900,
  SPRINKLER_MEE: 1100,
  BASSIN: 1000,
  ESSAIS_BETON: 8,
  NETTOYAGE_LABO: 15,
  PAYSAGE: 12,
  SECURITE_TESTS: 30,
  CENTRALE_BETON: 1500,
  BENTONITE: 1000,
  LAVAGE_BENNES: 120,
};

export const OPTIMIZATIONS = [
  {
    id: 'OPT01',
    name: 'Réutilisation eau lavage béton',
    description:
      "Décantation + réutilisation de l'eau de lavage des camions toupie et pompes",
    gain_pct: 10,
    icon: 'RefreshCw',
  },
  {
    id: 'OPT02',
    name: 'Cure béton optimisée',
    description:
      "Utilisation de bâches de protection ou produits de cure liquide au lieu de l'arrosage",
    gain_pct: 15,
    icon: 'ShieldCheck',
  },
  {
    id: 'OPT03',
    name: 'Optimisation bases-vie',
    description: 'Robinets temporisés, mousseurs, réducteurs de pression',
    gain_pct: 20,
    icon: 'Users',
  },
  {
    id: 'OPT04',
    name: 'Arrosage voiries optimisé',
    description: "Arrosage ciblé aux heures fraîches, capteurs d'humidité",
    gain_pct: 25,
    icon: 'Gauge',
  },
  {
    id: 'OPT05',
    name: 'Récupération eaux pluviales',
    description:
      'Cuves de récupération pour usages non potables (lavage, arrosage, compactage)',
    gain_pct: 15,
    icon: 'CloudRain',
  },
];

export const CATEGORY_ORDER = [
  'Béton & mortiers',
  'Maçonnerie & enduits',
  'Sciage & forage',
  'Terrassement & VRD',
  'Poussières & propreté',
  'Bases-vie',
  'Techniques',
  'Laboratoire & QA',
  'Paysage',
  'Spéciaux',
  'Déchets & recyclage',
];

const numberOrZero = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function withDerivedProjectValues(params) {
  const semaines_totales = numberOrZero(params.semaines_totales);
  const jours_ouvres_semaine = clamp(numberOrZero(params.jours_ouvres_semaine), 0, 7);

  return {
    ...params,
    semaines_totales,
    jours_ouvres_semaine,
    effectif: numberOrZero(params.effectif),
    jours_ouvres_total: semaines_totales * jours_ouvres_semaine,
  };
}

export const LINE_ITEMS = [
  {
    id: 'BETON_GACH',
    label: 'Eau de gâchage béton',
    category: 'Béton & mortiers',
    ratioKey: 'BETON_GACH',
    quantity: (params) => params.volume_beton,
  },
  {
    id: 'MORTIER_GACH',
    label: 'Eau de gâchage mortier',
    category: 'Béton & mortiers',
    ratioKey: 'BETON_GACH',
    quantity: (params) => params.volume_mortier,
  },
  {
    id: 'CHAPES_RAGREAGES',
    label: 'Chapes et ragréages',
    category: 'Béton & mortiers',
    ratioKey: 'MACONN_ENDUIT',
    quantity: (params) => params.surface_chapes,
  },
  {
    id: 'BETON_CURE',
    label: 'Cure du béton',
    category: 'Béton & mortiers',
    ratioKey: 'BETON_CURE',
    quantity: (params) => params.surface_beton_cure * params.jours_cure,
  },
  {
    id: 'BETON_NETTOYAGE',
    label: 'Nettoyage outils béton',
    category: 'Béton & mortiers',
    ratioKey: 'BETON_NETTOYAGE',
    quantity: (params) => params.volume_beton,
  },
  {
    id: 'TOUPIE_LAVAGE',
    label: 'Lavage camions toupie',
    category: 'Béton & mortiers',
    ratioKey: 'TOUPIE_LAVAGE',
    quantity: (params) => params.nb_camions_toupie,
  },
  {
    id: 'POMPE_BETON',
    label: 'Lavage pompe à béton',
    category: 'Béton & mortiers',
    ratioKey: 'POMPE_BETON',
    quantity: (params) => params.jours_pompage,
  },
  {
    id: 'CENTRALE_BETON',
    label: 'Centrale à béton temporaire',
    category: 'Béton & mortiers',
    ratioKey: 'CENTRALE_BETON',
    quantity: (params) => params.jours_centrale_beton,
  },
  {
    id: 'MACONN_ENDUIT',
    label: 'Eau enduits et mortiers',
    category: 'Maçonnerie & enduits',
    ratioKey: 'MACONN_ENDUIT',
    quantity: (params) => params.surface_enduits,
  },
  {
    id: 'MACONN_HUMIDIF',
    label: 'Humidification supports',
    category: 'Maçonnerie & enduits',
    ratioKey: 'MACONN_HUMIDIF',
    quantity: (params) => params.surface_humidifier,
  },
  {
    id: 'SCIAGE_EAU',
    label: 'Sciage béton',
    category: 'Sciage & forage',
    ratioKey: 'SCIAGE_EAU',
    quantity: (params) => params.longueur_sciage,
  },
  {
    id: 'CAROTTAGE',
    label: 'Carottages',
    category: 'Sciage & forage',
    ratioKey: 'CAROTTAGE',
    quantity: (params) => params.nb_carottages,
  },
  {
    id: 'COMPACTAGE',
    label: 'Arrosage compactage',
    category: 'Terrassement & VRD',
    ratioKey: 'COMPACTAGE',
    quantity: (params) => params.surface_compacter,
  },
  {
    id: 'ARROS_VOIES',
    label: 'Arrosage voies internes',
    category: 'Terrassement & VRD',
    ratioKey: 'ARROS_VOIES',
    quantity: (params) => params.longueur_voies * params.jours_arrosage_voies,
  },
  {
    id: 'BRUMISATION',
    label: 'Brumisation anti-poussière',
    category: 'Poussières & propreté',
    ratioKey: 'BRUMISATION',
    quantity: (params) => params.surface_brumisation * params.jours_brumisation,
  },
  {
    id: 'LAVAGE_ROUES',
    label: 'Lavage roues',
    category: 'Poussières & propreté',
    ratioKey: 'LAVAGE_ROUES',
    quantity: (params) => params.nb_passages_lavage_roues,
  },
  {
    id: 'NETTOYAGE_ENGINS',
    label: 'Nettoyage engins',
    category: 'Poussières & propreté',
    ratioKey: 'NETTOYAGE_ENGINS',
    quantity: (params) => params.nb_lavages_engins,
  },
  {
    id: 'WC_CHASSE',
    label: "Chasses d'eau",
    category: 'Bases-vie',
    ratioKey: 'WC_CHASSE',
    quantity: (params) =>
      params.chasses_par_pers * params.effectif * params.jours_ouvres_total,
  },
  {
    id: 'DOUCHE',
    label: 'Douches',
    category: 'Bases-vie',
    ratioKey: 'DOUCHE',
    quantity: (params) =>
      params.douches_par_pers_semaine * params.effectif * params.semaines_totales,
  },
  {
    id: 'LAVABO',
    label: 'Lavages mains',
    category: 'Bases-vie',
    ratioKey: 'LAVABO',
    quantity: (params) =>
      params.lavabos_par_pers * params.effectif * params.jours_ouvres_total,
  },
  {
    id: 'CUISINE',
    label: 'Repas servis',
    category: 'Bases-vie',
    ratioKey: 'CUISINE',
    quantity: (params) => params.repas_par_jour * params.jours_ouvres_total,
  },
  {
    id: 'NETTOYAGE_BASEVIE',
    label: 'Nettoyage bases-vie',
    category: 'Bases-vie',
    ratioKey: 'NETTOYAGE_BASEVIE',
    quantity: (params) =>
      params.surface_base_vie * (params.freq_nettoyage * params.semaines_totales),
  },
  {
    id: 'PLOMBERIE_MEE',
    label: 'Mise en eau plomberie',
    category: 'Techniques',
    ratioKey: 'PLOMBERIE_MEE',
    quantity: (params) => params.volume_reseau_plomberie,
  },
  {
    id: 'CHAUFFAGE_MEE',
    label: 'Mise en eau chauffage/clim',
    category: 'Techniques',
    ratioKey: 'CHAUFFAGE_MEE',
    quantity: (params) => params.volume_reseau_chauffage,
  },
  {
    id: 'SPRINKLER_MEE',
    label: 'Réseau sprinklers',
    category: 'Techniques',
    ratioKey: 'SPRINKLER_MEE',
    quantity: (params) => params.volume_reseau_sprinkler,
  },
  {
    id: 'BASSIN',
    label: 'Bassins et piscines',
    category: 'Techniques',
    ratioKey: 'BASSIN',
    quantity: (params) => params.volume_bassin,
  },
  {
    id: 'ESSAIS_BETON',
    label: 'Essais béton',
    category: 'Laboratoire & QA',
    ratioKey: 'ESSAIS_BETON',
    quantity: (params) => params.nb_essais_beton,
  },
  {
    id: 'NETTOYAGE_LABO',
    label: 'Nettoyages laboratoire',
    category: 'Laboratoire & QA',
    ratioKey: 'NETTOYAGE_LABO',
    quantity: (params) => params.nb_nettoyages_labo,
  },
  {
    id: 'PAYSAGE',
    label: 'Arrosage paysager',
    category: 'Paysage',
    ratioKey: 'PAYSAGE',
    quantity: (params) =>
      params.surface_plants * params.semaines_arrosage_paysager,
  },
  {
    id: 'BENTONITE',
    label: 'Boue bentonite',
    category: 'Spéciaux',
    ratioKey: 'BENTONITE',
    quantity: (params) => params.volume_bentonite,
  },
  {
    id: 'LAVAGE_BENNES',
    label: 'Lavage bennes',
    category: 'Déchets & recyclage',
    ratioKey: 'LAVAGE_BENNES',
    quantity: (params) => params.nb_lavages_bennes,
  },
];

export function computeOptimizationCoeff(selectedOpts = []) {
  return (
    1 -
    selectedOpts.reduce(
      (acc, opt) => acc * (1 - numberOrZero(opt.gain_pct) / 100),
      1,
    )
  );
}

export function calculateLineItem(definition, params) {
  const ratio = RATIOS[definition.ratioKey] ?? 0;
  const quantity = numberOrZero(definition.quantity(params));
  const conso_brute_L = quantity * ratio;
  const conso_nette_L =
    conso_brute_L * FACTEUR_AJUSTEMENT * (1 - 0) * (1 - 0) * 1;

  return {
    ...definition,
    quantity,
    ratio,
    conso_brute_L,
    conso_nette_L,
    m3: conso_nette_L / 1000,
  };
}

function buildCategoryBreakdown(lineItems) {
  const totals = new Map(CATEGORY_ORDER.map((category) => [category, 0]));

  lineItems.forEach((item) => {
    totals.set(item.category, (totals.get(item.category) ?? 0) + item.m3);
  });

  const total = [...totals.values()].reduce((sum, value) => sum + value, 0);

  return CATEGORY_ORDER.map((category) => {
    const value = totals.get(category) ?? 0;

    return {
      category,
      m3: value,
      pct: total > 0 ? (value / total) * 100 : 0,
    };
  });
}

function buildOptimizationSummary(totalBrut, selectedOpts) {
  let remaining = totalBrut;

  return selectedOpts.map((opt) => {
    const savings_m3 = remaining * (numberOrZero(opt.gain_pct) / 100);
    remaining -= savings_m3;

    return {
      ...opt,
      savings_m3,
      savings_mad: savings_m3 * COST_PER_M3_MAD,
    };
  });
}

export function calculateWaterConsumption(params, selectedOpts = []) {
  const normalizedParams = withDerivedProjectValues(params);
  const numericParams = Object.fromEntries(
    Object.entries(normalizedParams).map(([key, value]) => [
      key,
      key === 'project_name' ? value : numberOrZero(value),
    ]),
  );

  const lineItems = LINE_ITEMS.map((definition) =>
    calculateLineItem(definition, numericParams),
  );
  const categories = buildCategoryBreakdown(lineItems);
  const total_brut_m3 = categories.reduce((sum, item) => sum + item.m3, 0);
  const coeff_global_opt = computeOptimizationCoeff(selectedOpts);
  const total_optimise_m3 = total_brut_m3 * (1 - coeff_global_opt);
  const savings_m3 = total_brut_m3 - total_optimise_m3;
  const optimizationSummary = buildOptimizationSummary(total_brut_m3, selectedOpts);

  return {
    derived: {
      jours_ouvres_total: numericParams.jours_ouvres_total,
      semaines_totales: numericParams.semaines_totales,
    },
    lineItems,
    categories,
    topConsumers: [...categories]
      .filter((item) => item.m3 > 0)
      .sort((a, b) => b.m3 - a.m3)
      .slice(0, 3),
    optimizations: optimizationSummary,
    totals: {
      total_brut_m3,
      total_optimise_m3,
      coeff_global_opt,
      savings_m3,
      savings_mad: savings_m3 * COST_PER_M3_MAD,
      savings_co2_kg: savings_m3 * CO2_PER_M3_KG,
    },
  };
}

export function calculateBasesVieConsumption(params) {
  const result = calculateWaterConsumption(params, []);

  return result.categories.find((item) => item.category === 'Bases-vie')?.m3 ?? 0;
}
