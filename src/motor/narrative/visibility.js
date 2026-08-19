import { EFFECT_MAP } from "../constants.js";

const STAT_KEYS = new Set(["salud", "felicidad", "dinero", "influencia", "maldad"]);

/** Filtra efectos visibles según perfil de información incompleta. */
export function visibleEffectsForOption(option) {
  const effects = option.effects ?? option.immediate ?? {};
  const visibility = option.visibility ?? "partial";

  if (visibility === "hidden") return {};
  if (visibility === "full") return pickStatEffects(effects);

  const revealed = new Set(option.revealedEffects ?? []);
  const out = {};
  for (const [key, val] of Object.entries(effects)) {
    const mapped = EFFECT_MAP[key] ?? key;
    if (revealed.has(key) || revealed.has(mapped)) out[key] = val;
  }
  return out;
}

function pickStatEffects(effects) {
  const out = {};
  for (const [key, val] of Object.entries(effects)) {
    const mapped = EFFECT_MAP[key] ?? key;
    if (STAT_KEYS.has(mapped) && typeof val === "number") out[key] = val;
  }
  return out;
}

export function optionForUI(option, player, meetsReq = true) {
  return {
    id: option.id,
    label: option.text ?? option.label,
    hint: option.hint ?? "",
    profile: option.profile ?? null,
    available: meetsReq,
    effects: visibleEffectsForOption(option),
  };
}
