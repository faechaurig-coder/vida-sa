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

const PARTNER_EVENT_BODY = {
  c_adu_pareja_apoyo: (partner) => {
    const e = partner.traits.empatia;
    if (e >= 60) return "Te despidieron. Tu pareja propone ayudarte mientras encuentras algo nuevo.";
    if (e <= 40) return "Te despidieron. Tu pareja dice que deberías resolverlo por tu cuenta.";
    return "Te despidieron. El silencio en casa pesa más que las palabras.";
  },
  c_adu_pareja_mudanza: (partner) => {
    const a = partner.traits.ambicion;
    if (a >= 60) return "Tu pareja consiguió una oferta en otra ciudad y quiere que vayan juntos.";
    return "Tu pareja habla de mudarse, pero no parece tan segura de la oportunidad.";
  },
  c_adu_pareja_viaje: (partner) => {
    const r = partner.traits.riesgo;
    if (r >= 60) return "Tu pareja reservó un viaje sorpresa sin consultar el presupuesto.";
    return "Tu pareja propone un viaje modesto para desconectar un rato.";
  },
  c_adu_pareja_inversion: (partner) => {
    const r = partner.traits.riesgo;
    if (r >= 60) return "Tu pareja quiere invertir sus ahorros en una oportunidad arriesgada.";
    return "Tu pareja sugiere guardar el dinero en algo seguro por ahora.";
  },
  c_adu_pareja_cariño: (partner) => {
    const c = partner.traits.carrino;
    if (c >= 60) return "Tu pareja nota que estás mal y cancela sus planes para acompañarte.";
    return "Tu pareja está demasiado distante últimamente.";
  },
  c_adu_pareja_estabilidad: (partner) => {
    const a = partner.traits.ambicion;
    if (a <= 45) return "Tu pareja prefiere quedarse y mantener la estabilidad.";
    return "Tu pareja habla de estabilidad, pero no suena convencida.";
  },
  c_adu_pareja_meta: (partner) => {
    const a = partner.traits.ambicion;
    if (a >= 60) return "Tu pareja quiere mudarse o cambiar de vida para aprovechar una oportunidad.";
    return "Tu pareja menciona metas grandes. Te miran esperando respuesta.";
  },
};

/** Personaliza copy según rasgos internos de la pareja (sin mostrarlos al jugador). */
export function contextualizeEventForPlayer(event, player) {
  if (!event || !player?.partner?.active) return event;
  const flavor = PARTNER_EVENT_BODY[event.id];
  if (!flavor) return event;
  const body = flavor(player.partner);
  if (!body) return event;
  return { ...event, body };
}

export function optionSubtitle(option) {
  if (option?.hint) return option.hint;
  const fx = option?.effects ?? {};
  const bits = [];
  if (fx.money > 80) bits.push("Buen dinero");
  else if (fx.money > 0) bits.push("Algo de dinero");
  else if (fx.money < -50) bits.push("Cuesta dinero");
  else if (fx.money < 0) bits.push("Gasto pequeño");
  if (fx.happiness >= 6) bits.push("Te hará feliz");
  else if (fx.happiness <= -4) bits.push("Puede doler");
  if (fx.evil >= 5 || fx.maldad >= 5) bits.push("Mala decisión");
  else if (fx.evil <= -2 || fx.maldad <= -2) bits.push("Buen acto");
  if (fx.influence >= 6 || fx.influencia >= 6) bits.push("Más influencia");
  if (fx.health <= -4 || fx.salud <= -4) bits.push("Cuidado con la salud");
  return bits.slice(0, 2).join(" · ") || "Un camino distinto";
}

export function optionIcon(option, index = 0) {
  const fx = option?.effects ?? {};
  if (fx.evil > 0 || fx.maldad > 0) return "😈";
  if (fx.money > 0) return "💰";
  if (fx.money < 0) return "💸";
  if (fx.happiness > 0 || fx.felicidad > 0) return "😊";
  if (fx.influence > 0 || fx.influencia > 0) return "👑";
  if (fx.health < 0 || fx.salud < 0) return "⚠️";
  return String(index + 1);
}
