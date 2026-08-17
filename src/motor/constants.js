export { STAT_KEYS, LIFE_STAGES, STORY_TYPES, CAREER_TIERS, MONTH_NAMES } from "../foundation/constants.js";

/** Categorías de decisión — extensible sin tocar motor. */
export const CATEGORIES = [
  "familia",
  "estudios",
  "trabajo",
  "dinero",
  "relaciones",
  "salud",
  "social",
  "ocio",
  "eventos",
  "historias",
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
