import { validateCatalog } from "./schema.js";
import {
  CONTENT_CATEGORIES,
  EVENT_KINDS,
  LIFE_STAGE_IDS,
  isValidCategory,
  isValidKind,
  isValidStage,
} from "./taxonomy.js";
import { RARITY_LEVELS, EMOTION_PROFILES, DECISION_PROFILES } from "../../motor/narrative/taxonomy.js";

/**
 * Validación profunda del catálogo — errores bloqueantes + warnings.
 */
export function validateCatalogDeep(events, { storyIds = [], knownFlags = [] } = {}) {
  const errors = validateCatalog(events);
  const warnings = [];
  const ids = new Set();
  const flagSet = new Set(knownFlags);

  for (const ev of events) {
    for (const f of ev.requireFlags ?? []) flagSet.add(f);
    for (const f of ev.forbidFlags ?? []) flagSet.add(f);
    for (const opt of ev.options ?? []) {
      for (const f of opt.effects?.flagsAdd ?? []) flagSet.add(f);
      for (const f of opt.effects?.flagsRemove ?? []) flagSet.add(f);
    }
  }

  for (const ev of events) {
    if (ids.has(ev.id)) errors.push(`ID duplicado: ${ev.id}`);
    ids.add(ev.id);

    if (!ev.options?.length) errors.push(`${ev.id}: sin opciones`);

    for (const opt of ev.options ?? []) {
      const fx = opt.effects ?? opt.immediate;
      if (!fx || (!hasAnyEffect(fx) && !opt.deferred && !opt.storyProgress && !opt.nextEvent)) {
        warnings.push(`${ev.id}/${opt.id}: opción sin consecuencias aparentes`);
      }
      if (opt.profile && !DECISION_PROFILES.includes(opt.profile)) {
        warnings.push(`${ev.id}/${opt.id}: perfil de decisión inválido "${opt.profile}"`);
      }
    }

    if (ev.storyId && storyIds.length && !storyIds.includes(ev.storyId)) {
      warnings.push(`${ev.id}: storyId "${ev.storyId}" no registrado`);
    }

    if (ev.rarity && !RARITY_LEVELS.includes(ev.rarity)) {
      warnings.push(`${ev.id}: rareza inválida "${ev.rarity}"`);
    }

    if (ev.emotionProfile?.length) {
      for (const em of ev.emotionProfile) {
        if (!EMOTION_PROFILES.includes(em)) {
          warnings.push(`${ev.id}: emotionProfile inválido "${em}"`);
        }
      }
    }

    if (ev.exclusive && !ev.cooldown && ev.cooldown !== 0) {
      warnings.push(`${ev.id}: exclusivo sin cooldown explícito`);
    }

    if ((ev.weight ?? 1) > 5) {
      warnings.push(`${ev.id}: peso muy alto (${ev.weight}) — podría dominar el picker`);
    }

    if (ev.kind === EVENT_KINDS.STORY && !ev.storyId) {
      errors.push(`${ev.id}: historia sin storyId`);
    }

    if (!isValidCategory(ev.category)) {
      errors.push(`${ev.id}: categoría inválida`);
    }
    if (!isValidKind(ev.kind)) {
      errors.push(`${ev.id}: kind inválido`);
    }
    if (ev.stage && !isValidStage(ev.stage)) {
      errors.push(`${ev.id}: etapa inválida`);
    }
  }

  return { errors, warnings, valid: errors.length === 0 };
}

function hasAnyEffect(fx) {
  if (!fx) return false;
  const keys = Object.keys(fx).filter((k) => fx[k] != null);
  return keys.length > 0;
}

export { CONTENT_CATEGORIES, EVENT_KINDS, LIFE_STAGE_IDS };
