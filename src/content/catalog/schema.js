import { EVENT_TYPES } from "../../motor/constants.js";
import {
  EVENT_KINDS,
  normalizeCategory,
  isValidStage,
  isValidCategory,
  isValidKind,
  LIFE_STAGE_IDS,
} from "./taxonomy.js";

const DEFAULT_COOLDOWN = 6;
const DEFAULT_WEIGHT = 1;

/**
 * Define un evento del catálogo con defaults y validación ligera.
 * WORLD → STAGE → CATEGORY → EVENT
 */
export function defineEvent(spec) {
  const worldId = spec.worldId;
  if (!worldId) throw new Error("defineEvent: worldId requerido");

  const stage = spec.stage;
  if (stage && !isValidStage(stage)) {
    throw new Error(`defineEvent: etapa inválida "${stage}" en ${spec.id}`);
  }

  const category = normalizeCategory(spec.category);
  if (!isValidCategory(category)) {
    throw new Error(`defineEvent: categoría inválida "${spec.category}" en ${spec.id}`);
  }

  const kind = inferKind(spec);
  if (!isValidKind(kind)) {
    throw new Error(`defineEvent: tipo inválido "${kind}" en ${spec.id}`);
  }

  const eventType =
    spec.eventType ?? (kind === EVENT_KINDS.STORY ? EVENT_TYPES.STORY : EVENT_TYPES.LIFE);

  const requirements = buildRequirements(spec, stage);
  const exclusive = !!spec.exclusive;
  const repeatable = spec.repeatable ?? !exclusive;

  return {
    ...spec,
    worldId,
    stage,
    category,
    kind,
    eventType,
    requirements,
    weight: spec.weight ?? DEFAULT_WEIGHT,
    cooldown: spec.cooldown ?? DEFAULT_COOLDOWN,
    exclusive,
    repeatable,
    options: (spec.options ?? []).map(normalizeOption),
  };
}

function inferKind(spec) {
  if (spec.kind) return spec.kind;
  if (spec.eventType === EVENT_TYPES.STORY || spec.storyId) return EVENT_KINDS.STORY;
  if (spec.worldId === "capitalismo" && spec._legacy) return EVENT_KINDS.WORLD;
  if (spec.rarity === "rare" || spec.beat) return EVENT_KINDS.IMPORTANT;
  return EVENT_KINDS.NORMAL;
}

function buildRequirements(spec, stage) {
  const base = { ...(spec.requirements ?? {}) };
  if (stage && !base.stage && !base.stages?.length) {
    base.stage = stage;
  }
  if (spec.requireFlags?.length) {
    base.requireFlags = [...new Set([...(base.requireFlags ?? []), ...spec.requireFlags])];
  }
  if (spec.forbidFlags?.length) {
    base.forbidFlags = [...new Set([...(base.forbidFlags ?? []), ...spec.forbidFlags])];
  }
  return Object.keys(base).length ? base : stage ? { stage } : null;
}

function normalizeOption(opt) {
  return {
    ...opt,
    effects: opt.effects ?? opt.immediate ?? {},
    text: opt.text ?? opt.label,
    resultText: opt.resultText ?? opt.punchline,
  };
}

/** Normaliza un evento ya existente (legacy/adaptado) al schema canónico. */
export function normalizeEvent(raw, worldId = raw.worldId) {
  const stage =
    raw.stage ??
    raw.requirements?.stage ??
    (raw.requirements?.stages?.length === 1 ? raw.requirements.stages[0] : null);

  if (raw.kind && raw.category && raw.requirements) {
    return { ...raw, worldId: worldId ?? raw.worldId, stage: stage ?? raw.stage };
  }

  return defineEvent({
    ...raw,
    worldId: worldId ?? raw.worldId,
    stage,
    _legacy: raw._legacy ?? worldId === "capitalismo",
  });
}

/** Valida un array de eventos — útil en tests y CI. */
export function validateCatalog(events, { worldId } = {}) {
  const errors = [];
  const ids = new Set();

  for (const ev of events) {
    if (ids.has(ev.id)) errors.push(`ID duplicado: ${ev.id}`);
    ids.add(ev.id);

    if (worldId && ev.worldId !== worldId) {
      errors.push(`${ev.id}: worldId ${ev.worldId} ≠ ${worldId}`);
    }
    if (!ev.title) errors.push(`${ev.id}: sin título`);
    if (!ev.options?.length) errors.push(`${ev.id}: sin opciones`);
    if (ev.stage && !isValidStage(ev.stage)) errors.push(`${ev.id}: etapa inválida`);
    if (!isValidCategory(ev.category)) errors.push(`${ev.id}: categoría inválida`);
    if (!isValidKind(ev.kind)) errors.push(`${ev.id}: tipo inválido`);

    if (ev.kind === EVENT_KINDS.STORY && !ev.storyId) {
      errors.push(`${ev.id}: historia sin storyId`);
    }
    if (ev.exclusive && ev.repeatable) {
      errors.push(`${ev.id}: exclusivo no puede ser repetible`);
    }
  }

  return errors;
}

export function stagesWithEvents(events) {
  const map = Object.fromEntries(LIFE_STAGE_IDS.map((s) => [s, 0]));
  for (const ev of events) {
    const st = ev.stage ?? ev.requirements?.stage;
    if (st && map[st] != null) map[st]++;
  }
  return map;
}
