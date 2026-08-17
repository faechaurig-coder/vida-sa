/** Constantes de diseño aprobado — Fase 1. No agregar stats universales aquí. */

export const STAT_KEYS = ["salud", "felicidad", "dinero", "influencia", "maldad"];

export const MONTH_KINDS = {
  QUIET: "quiet",
  NORMAL: "normal",
  DECISION: "decision",
  SPECIAL: "special",
  STORY: "story",
};

export const STORY_TYPES = {
  MAIN: "main",
  SECONDARY: "secondary",
  SPECIAL: "special",
  LIFE_EVENT: "life_event",
};

export const CAREER_TIERS = ["normal", "especial", "raro", "elite", "legendario"];

/** Etapas de vida — extensible sin romper guardados. */
export const LIFE_STAGES = [
  { id: "infancia", label: "Infancia", minAge: 0, maxAge: 11 },
  { id: "adolescencia", label: "Adolescencia", minAge: 12, maxAge: 17 },
  { id: "universidad", label: "Universidad", minAge: 18, maxAge: 24 },
  { id: "adultez", label: "Adultez", minAge: 25, maxAge: 59 },
  { id: "madurez", label: "Madurez", minAge: 60, maxAge: 999 },
];

export const COLLECTIBLE_KINDS = {
  HOUSE: "house",
  VEHICLE: "vehicle",
  SPECIAL: "special",
};

export const COLLECTIBLE_SLOTS = {
  houses: 5,
  vehicles: 5,
  specialObjects: 3,
};

export const MONTH_NAMES = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];
