export { STAT_KEYS, LIFE_STAGES, STORY_TYPES, CAREER_TIERS, MONTH_NAMES } from "../foundation/constants.js";
export {
  CONTENT_CATEGORIES,
  EVENT_KINDS,
  LIFE_STAGE_IDS,
  CATEGORY_LABELS,
  EVENT_KIND_LABELS,
} from "../content/catalog/taxonomy.js";

/** @deprecated Usar CONTENT_CATEGORIES del catálogo. */
export const CATEGORIES = [
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

export const EVENT_TYPES = {
  LIFE: "life",
  STORY: "story",
};

/** Claves de efecto en contenido (inglés) → stats internos. */
export const EFFECT_MAP = {
  health: "salud",
  happiness: "felicidad",
  money: "dinero",
  influence: "influencia",
  evil: "maldad",
  salud: "salud",
  felicidad: "felicidad",
  dinero: "dinero",
  influencia: "influencia",
  maldad: "maldad",
};

export const STAGE_LABELS = {
  infancia: "Infancia",
  adolescencia: "Adolescencia",
  universidad: "Universidad",
  adultez: "Adultez",
  madurez: "Madurez",
};
