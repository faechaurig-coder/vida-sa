/**
 * Taxonomía del catálogo de contenido — Fase 6.
 * Fuente única de verdad para etapas, categorías y tipos de evento.
 */

/** Etapas de vida (5). Alineadas con foundation/constants LIFE_STAGES. */
export const LIFE_STAGE_IDS = [
  "infancia",
  "adolescencia",
  "universidad",
  "adultez",
  "madurez",
];

export const LIFE_STAGE_LABELS = {
  infancia: "Infancia",
  adolescencia: "Adolescencia",
  universidad: "Universidad / Juventud",
  adultez: "Adultez",
  madurez: "Madurez",
};

/**
 * Categorías canónicas (10).
 * Mantener pocas — no agregar sin necesidad estricta.
 */
export const CONTENT_CATEGORIES = [
  "familia",
  "amistad",
  "escuela",
  "trabajo",
  "dinero",
  "salud",
  "relaciones",
  "personalidad",
  "oportunidad",
  "especial",
];

export const CATEGORY_LABELS = {
  familia: "Familia",
  amistad: "Amistad",
  escuela: "Escuela / Universidad",
  trabajo: "Trabajo",
  dinero: "Dinero",
  salud: "Salud",
  relaciones: "Relaciones",
  personalidad: "Personalidad",
  oportunidad: "Oportunidad",
  especial: "Especial",
};

/** Alias legacy → categoría canónica. */
export const CATEGORY_ALIASES = {
  social: "amistad",
  ocio: "oportunidad",
  estudios: "escuela",
  historias: "especial",
  eventos: "especial",
};

/**
 * Tipos de evento (metadata, no sistema de gameplay separado).
 * A: normal | B: important | C: story | D: special | E: world
 */
export const EVENT_KINDS = {
  NORMAL: "normal",
  IMPORTANT: "important",
  STORY: "story",
  SPECIAL: "special",
  WORLD: "world",
};

export const EVENT_KIND_LABELS = {
  normal: "Normal",
  important: "Importante",
  story: "Historia",
  special: "Especial",
  world: "Mundo",
};

/** Niveles de trabajo (5). */
export const JOB_TIERS = ["normal", "especial", "raro", "elite", "legendario"];

export const JOB_TIER_LABELS = {
  normal: "Normal",
  especial: "Especial",
  raro: "Raro",
  elite: "Élite",
  legendario: "Legendario",
};

/** Rasgos internos de pareja — no visibles al jugador. */
export const PARTNER_TRAITS = ["empatia", "carrino", "ambicion", "riesgo"];

export const PARTNER_TRAIT_LABELS = {
  empatia: "Empatía",
  carrino: "Cariño",
  ambicion: "Ambición",
  riesgo: "Riesgo",
};

export function normalizeCategory(category) {
  if (!category) return "especial";
  const key = String(category).toLowerCase();
  if (CONTENT_CATEGORIES.includes(key)) return key;
  return CATEGORY_ALIASES[key] ?? key;
}

export function isValidStage(stage) {
  return LIFE_STAGE_IDS.includes(stage);
}

export function isValidCategory(category) {
  return CONTENT_CATEGORIES.includes(normalizeCategory(category));
}

export function isValidKind(kind) {
  return Object.values(EVENT_KINDS).includes(kind);
}
