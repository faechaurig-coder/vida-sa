/** Pareja — 4 rasgos internos. No se muestran al jugador en Fase 1. */

const TRAIT_KEYS = ["empatia", "carrino", "ambicion", "riesgo"];

export function createPartner(traits = {}) {
  return {
    active: true,
    traits: {
      empatia: clampTrait(traits.empatia ?? 50),
      carrino: clampTrait(traits.carrino ?? 50),
      ambicion: clampTrait(traits.ambicion ?? 50),
      riesgo: clampTrait(traits.riesgo ?? 50),
    },
  };
}

function clampTrait(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Efectos pasivos mínimos — sin simulación compleja (diseño Fase 1). */
export function partnerMonthlyEffect(partner) {
  if (!partner?.active) return {};
  const t = partner.traits;
  const delta = {};
  if (t.empatia >= 70) delta.felicidad = 1;
  if (t.empatia <= 30) delta.felicidad = -1;
  if (t.carrino >= 70) delta.salud = 1;
  if (t.ambicion >= 70) delta.influencia = 1;
  if (t.riesgo >= 70) delta.maldad = 1;
  if (t.riesgo <= 25 && t.ambicion >= 60) delta.dinero = -5;
  return delta;
}

export function partnerTraitKeys() {
  return [...TRAIT_KEYS];
}
