import { LIFE_STAGE_LABELS, CATEGORY_LABELS, JOB_TIER_LABELS } from "../content/catalog/taxonomy.js";
import { careersForWorld } from "../content/catalog/careers.js";
import { STAGE_LABELS } from "../motor/constants.js";

const ADULT_CAREER_IDS = new Set([
  "cantante",
  "futbolista",
  "escritor",
  "actor",
  "emprendedor",
  "cantante_legend",
]);

export const CATEGORY_VIS = {
  familia: { emoji: "🏠", label: "Familia" },
  amistad: { emoji: "🤝", label: "Amistad" },
  escuela: { emoji: "📚", label: "Escuela" },
  trabajo: { emoji: "💼", label: "Trabajo" },
  dinero: { emoji: "💰", label: "Dinero" },
  salud: { emoji: "❤️", label: "Salud" },
  relaciones: { emoji: "💕", label: "Relaciones" },
  personalidad: { emoji: "🎭", label: "Personalidad" },
  oportunidad: { emoji: "✨", label: "Oportunidad" },
  especial: { emoji: "⭐", label: "Especial" },
};

export const STAT_META = [
  { key: "salud", emoji: "❤️", label: "Salud" },
  { key: "felicidad", emoji: "😊", label: "Felicidad" },
  { key: "dinero", emoji: "💰", label: "Dinero", money: true },
  { key: "influencia", emoji: "👑", label: "Influencia" },
  { key: "maldad", emoji: "😈", label: "Maldad" },
];

export function stageLabel(stage) {
  return LIFE_STAGE_LABELS[stage] ?? STAGE_LABELS[stage] ?? stage ?? "";
}

/** Ocupación visible. Nunca muestra una profesión adulta en infancia. */
export function occupationForPlayer(player) {
  const stage = player?.stage;
  const job = player?.job || null;
  const careerId = player?.careerId || null;

  if (stage === "infancia") return "Estudiante";

  if (stage === "adolescencia") {
    if (job && !ADULT_CAREER_IDS.has(careerId)) return job;
    return "Estudiante";
  }

  if (stage === "universidad") {
    if (job && !ADULT_CAREER_IDS.has(careerId)) return job;
    if (job && ADULT_CAREER_IDS.has(careerId)) return job;
    return "Estudiante";
  }

  return job || null;
}

export function fameForPlayer(player) {
  if (!player?.fame) return null;
  const line = player.fame.line ?? player.fame;
  if (!line) return null;
  return { line: String(line), label: "Fama" };
}

export function partnerForPlayer(player) {
  if (!player?.partner?.active) return null;
  return { label: "Relación", active: true };
}

export function careerTierForPlayer(player, worldId) {
  const job = occupationForPlayer(player);
  if (!job) return null;
  if (player.stage === "infancia") return null;
  const career = careersForWorld(worldId).find((c) => c.id === player.careerId);
  if (!career) return null;
  return {
    title: career.title,
    tier: career.tier,
    tierLabel: JOB_TIER_LABELS[career.tier] ?? career.tier,
  };
}

export function categoryVis(category) {
  const key = category || "especial";
  return CATEGORY_VIS[key] ?? { emoji: "✨", label: CATEGORY_LABELS[key] ?? key };
}

export function vitalsForHud(stats = {}) {
  return STAT_META.filter((s) => !s.money).map((s) => ({
    ...s,
    value: stats[s.key] ?? 0,
  }));
}

export function allStats(stats = {}) {
  return STAT_META.map((s) => ({
    ...s,
    value: stats[s.key] ?? 0,
  }));
}

export function discoveryHints(player) {
  const hints = [];
  const stories = Object.values(player?.stories ?? {}).filter((s) => s.discovered && !s.completed);
  if (stories.length === 1) hints.push({ kind: "story", text: "Un camino se abre" });
  else if (stories.length > 1) hints.push({ kind: "story", text: stories.length + " caminos abiertos" });
  if (player?.fame) hints.push({ kind: "fame", text: "Fama" });
  return hints;
}

export function characterMood(player) {
  const h = player?.stats?.felicidad ?? 50;
  const hp = player?.stats?.salud ?? 50;
  if (hp < 30) return "tired";
  if (h >= 70) return "happy";
  if (h < 30) return "worry";
  return "idle";
}

export function lifeIdentity(player, worldId) {
  return {
    name: player?.name || "Tú",
    age: player?.age ?? 0,
    stage: player?.stage ?? "infancia",
    stageLabel: stageLabel(player?.stage),
    occupation: occupationForPlayer(player),
    fame: fameForPlayer(player),
    partner: partnerForPlayer(player),
    career: careerTierForPlayer(player, worldId),
    worldId: worldId ?? player?.worldId ?? "clasico",
  };
}
