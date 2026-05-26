export const FIELD_SOURCES = {
  project: {
    id: 'project',
    label: 'Projet',
    tone: 'green',
  },
  planning: {
    id: 'planning',
    label: 'Planning',
    tone: 'yellow',
  },
  boq: {
    id: 'boq',
    label: 'BoQ',
    tone: 'orange',
  },
};

export const DEFAULT_FORM = {
  project_name: 'Prestigia - Rabat',
  semaines_totales: 104,
  jours_ouvres_total: 624,
  effectif: 188,
  volume_beton: 89559,
  volume_mortier: 5099,
  surface_chapes: 49971,
  surface_beton_cure: 179118,
  nb_camions_toupie: 11195,
  jours_pompage: 169,
  surface_enduits: 127417,
  surface_humidifier: 127417,
  longueur_sciage: 32154,
  nb_carottages: 322,
  surface_compacter: 153055,
  surface_base_vie: 803,
  volume_reseau_plomberie: 10.17,
  volume_reseau_chauffage: 0,
  volume_reseau_sprinkler: 0.64,
  nb_essais_beton: 1792,
  nb_nettoyages_labo: 1792,
  surface_plants: 9472,
  semaines_arrosage_paysager: 17,
  nb_lavages_bennes: 3399,
};

const projectSource = FIELD_SOURCES.project;
const planningSource = FIELD_SOURCES.planning;
const boqSource = FIELD_SOURCES.boq;

export const STEPS = [
  { id: 'project', label: 'Projet', title: 'Informations Projet' },
  { id: 'work', label: 'BoQ', title: 'Quantités BoQ' },
  { id: 'welfare', label: 'Base-vie', title: 'Base-vie' },
  { id: 'optimizations', label: 'Optimisations', title: 'Optimisations' },
];

export const PROJECT_FIELDS = [
  {
    name: 'project_name',
    label: 'Nom du projet',
    unit: 'Projet',
    description: 'Référence chantier affichée dans le rapport',
    type: 'text',
    source: projectSource,
  },
  {
    name: 'semaines_totales',
    label: 'Durée totale',
    unit: 'sem',
    description: 'Durée globale issue du planning',
    source: planningSource,
  },
  {
    name: 'jours_ouvres_total',
    label: 'Jours ouvrés total',
    unit: 'j',
    description: 'Total calculé depuis le planning',
    source: planningSource,
  },
  {
    name: 'effectif',
    label: 'Effectif moyen',
    unit: 'pers',
    description: 'Moyenne pondérée des effectifs du planning',
    source: planningSource,
  },
];

export const ACTIVITY_CATEGORIES = [
  {
    id: 'concrete',
    title: 'Béton & Mortiers',
    resultCategories: ['Béton & mortiers'],
    summary: 'Volumes, cure et lavages liés au béton',
    icon: 'HardHat',
    fields: [
      { name: 'volume_beton', label: 'Volume de béton', unit: 'm3', source: boqSource },
      { name: 'volume_mortier', label: 'Volume de mortier', unit: 'm3', source: boqSource },
      { name: 'surface_chapes', label: 'Surface chapes/ragréages', unit: 'm2', source: boqSource },
      { name: 'surface_beton_cure', label: 'Surface béton à curer', unit: 'm2', source: projectSource },
      { name: 'nb_camions_toupie', label: 'Camions toupie à laver', unit: 'camions', source: boqSource },
      { name: 'jours_pompage', label: 'Jours pompe à béton', unit: 'j', source: planningSource },
    ],
  },
  {
    id: 'masonry',
    title: 'Maçonnerie & Enduits',
    resultCategories: ['Maçonnerie & enduits'],
    summary: 'Enduits, mortiers et humidification des supports',
    icon: 'BrickWall',
    fields: [
      { name: 'surface_enduits', label: 'Surface enduits', unit: 'm2', source: boqSource },
      { name: 'surface_humidifier', label: 'Surface à humidifier', unit: 'm2', source: boqSource },
    ],
  },
  {
    id: 'cutting',
    title: 'Sciage & Forage',
    resultCategories: ['Sciage & forage'],
    summary: 'Sciage béton et carottages',
    icon: 'Cog',
    fields: [
      { name: 'longueur_sciage', label: 'Longueur de sciage', unit: 'ml', source: boqSource },
      { name: 'nb_carottages', label: 'Nb carottages', unit: 'nb', source: boqSource },
    ],
  },
  {
    id: 'earthworks',
    title: 'Terrassement & VRD',
    resultCategories: ['Terrassement & VRD'],
    summary: 'Compactage et surfaces VRD issues du BoQ',
    icon: 'Construction',
    fields: [
      { name: 'surface_compacter', label: 'Surface à compacter', unit: 'm2', source: boqSource },
    ],
  },
  {
    id: 'systems',
    title: 'Réseaux Techniques',
    resultCategories: ['Techniques'],
    summary: 'Mises en eau plomberie, CVC et sprinklers',
    icon: 'Wrench',
    fields: [
      { name: 'volume_reseau_plomberie', label: 'Volume réseau plomberie', unit: 'm3', source: boqSource },
      { name: 'volume_reseau_chauffage', label: 'Volume circuits chauffage/clim', unit: 'm3', source: boqSource },
      { name: 'volume_reseau_sprinkler', label: 'Volume réseau sprinklers', unit: 'm3', source: boqSource },
    ],
  },
  {
    id: 'qa-landscape',
    title: 'QA, Paysage & Déchets',
    resultCategories: ['Laboratoire & QA', 'Paysage', 'Déchets & recyclage'],
    summary: 'Essais, laboratoire, plantations et lavages de bennes',
    icon: 'Factory',
    fields: [
      { name: 'nb_essais_beton', label: 'Nb essais béton', unit: 'nb', source: boqSource },
      { name: 'nb_nettoyages_labo', label: 'Nb nettoyages labo', unit: 'nb', source: boqSource },
      { name: 'surface_plants', label: 'Surface plantations', unit: 'm2', source: boqSource },
      { name: 'semaines_arrosage_paysager', label: 'Semaines arrosage paysager', unit: 'sem', source: planningSource },
      { name: 'nb_lavages_bennes', label: 'Nb lavages bennes', unit: 'nb', source: boqSource },
    ],
  },
];

export const WELFARE_FIELDS = [
  {
    name: 'surface_base_vie',
    label: 'Surface base-vie',
    unit: 'm2',
    description: 'Surface de la base-vie à nettoyer',
    source: projectSource,
  },
];

export const STEP_FIELD_NAMES = [
  PROJECT_FIELDS.map((field) => field.name),
  ACTIVITY_CATEGORIES.flatMap((category) => category.fields.map((field) => field.name)),
  WELFARE_FIELDS.map((field) => field.name),
  [],
];

export const ALL_FIELD_NAMES = STEP_FIELD_NAMES.flat();
