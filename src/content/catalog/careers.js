import { JOB_TIERS, JOB_TIER_LABELS } from "./taxonomy.js";
import { CLASSIC_CAREERS } from "../worlds/clasico/meta.js";

/**
 * Catálogo de trabajos — 5 niveles.
 * Cada trabajo: dinero, felicidad, eventos exclusivos (futuro).
 * Sin productividad, jefe, estrés ni habilidades.
 */
export const CAREER_CATALOG = {
  clasico: CLASSIC_CAREERS.map((c) => ({
    ...c,
    tierLabel: JOB_TIER_LABELS[c.tier] ?? c.tier,
    storyId: storyForCareer(c.id),
    legendaryStory: c.requiresStory ?? null,
  })),
  capitalismo: [],
};

function storyForCareer(careerId) {
  const map = {
    cantante: "cantante",
    futbolista: "futbolista",
    escritor: "escritor",
    actor: "actor",
    emprendedor: "emprendedor",
    cantante_legend: "cantante",
  };
  return map[careerId] ?? null;
}

export function careersForWorld(worldId) {
  return CAREER_CATALOG[worldId] ?? [];
}

export function careerByTier(worldId, tier) {
  return careersForWorld(worldId).filter((c) => c.tier === tier);
}

export function isValidJobTier(tier) {
  return JOB_TIERS.includes(tier);
}
