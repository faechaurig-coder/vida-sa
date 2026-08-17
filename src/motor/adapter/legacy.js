import { mapLegacyStage } from "../requirements.js";
import { EVENT_TYPES } from "../constants.js";
import { EVENT_KINDS, normalizeCategory } from "../../content/catalog/taxonomy.js";

const LEGACY_CATEGORY = {
  el_atajo: "escuela",
  el_finde: "oportunidad",
  el_techo: "dinero",
  primer_contrato: "trabajo",
  synergy: "trabajo",
  semaforo: "dinero",
  la_entrevista: "trabajo",
  la_hipoteca: "dinero",
  la_cuota: "dinero",
  la_factura: "salud",
  el_acta: "especial",
};

/** Convierte eventos legacy (slice capitalismo) al schema del motor mensual. */
export function adaptLegacyEvents(legacyEvents, worldId = "capitalismo") {
  return legacyEvents.map((ev) => ({
    id: ev.id,
    worldId,
    _legacy: true,
    stage: mapLegacyStage(ev.stage),
    category: normalizeCategory(LEGACY_CATEGORY[ev.id] ?? "especial"),
    kind: ev.beat ? EVENT_KINDS.IMPORTANT : EVENT_KINDS.WORLD,
    eventType: ev.storyId ? EVENT_TYPES.STORY : EVENT_TYPES.LIFE,
    title: ev.title,
    description: ev.body,
    requirements: {
      requireFlags: ev.requireFlags,
      forbidFlags: ev.forbidFlags,
      stage: mapLegacyStage(ev.stage),
    },
    options: ev.options.map((o) => ({
      id: o.id,
      text: o.label,
      hint: o.hint,
      effects: mapLegacyEffects(o.immediate),
      resultText: o.punchline,
      deferred: o.deferred
        ? { type: o.deferred.type, id: o.deferred.id, after: o.deferred.after }
        : undefined,
      nextEvent: o.nextEvent,
    })),
    weight: ev.beat ? 1.4 : 1,
    cooldown: ev.beat ? 12 : 6,
    tags: [mapLegacyStage(ev.stage)],
    exclusive: false,
    repeatable: true,
    storyId: ev.storyId,
  }));
}

function mapLegacyEffects(immediate = {}) {
  if (!immediate) return {};
  return {
    health: immediate.health,
    happiness: immediate.happiness,
    money: immediate.money,
    influence: immediate.status,
    evil: immediate.maldad ?? immediate.evil,
    job: immediate.job,
    home: immediate.home,
    car: immediate.car,
    debt: immediate.debt,
    income: immediate.income,
    expenses: immediate.expenses,
    partner: immediate.partner,
    flagsAdd: immediate.flagsAdd,
    flagsRemove: immediate.flagsRemove,
  };
}

export function seedToGameConfig(seed, worldId = "capitalismo") {
  const s = seed.start;
  return {
    worldId,
    originId: seed.id,
    stats: {
      salud: s.health,
      felicidad: s.happiness,
      dinero: s.money,
      influencia: s.status,
      maldad: 0,
    },
    job: s.job,
    home: s.home,
    car: s.car,
    debt: s.debt,
    income: s.income,
    expenses: s.expenses,
    flags: [...s.flags],
    birthYear: new Date().getFullYear() - s.age,
    birthMonth: 1,
    startYear: 2026,
    startMonth: 1,
  };
}
