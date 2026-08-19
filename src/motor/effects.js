import { applyStatDelta, createStats } from "../foundation/stats.js";
import { EFFECT_MAP } from "./constants.js";
import { createPartner } from "../foundation/relationships/partner.js";

/** Normaliza efectos del contenido a deltas de stats universales. */
export function normalizeEffects(raw = {}) {
  const stats = {};
  for (const [key, val] of Object.entries(raw)) {
    if (val == null || typeof val !== "number") continue;
    const mapped = EFFECT_MAP[key];
    if (mapped) stats[mapped] = (stats[mapped] ?? 0) + val;
  }
  return stats;
}

export function applyOptionEffects(player, raw = {}) {
  let next = { ...player, flags: [...(player.flags ?? [])], decisions: [...(player.decisions ?? [])] };
  const stats = normalizeEffects(raw);
  next.stats = applyStatDelta(next.stats, stats);

  if (raw.job != null) next.job = raw.job;
  if (raw.careerId != null) next.careerId = raw.careerId;
  if (raw.partner === true) next.partner = createPartner(raw.partnerTraits ?? {});
  if (raw.partner === false) next.partner = null;
  if (raw.home != null) next.home = raw.home;
  if (raw.car != null) next.car = raw.car;
  if (raw.debt != null) next.debt = Math.max(0, (next.debt ?? 0) + raw.debt);
  if (raw.income != null) next.income = Math.max(0, (next.income ?? 0) + raw.income);
  if (raw.expenses != null) next.expenses = Math.max(0, (next.expenses ?? 0) + raw.expenses);

  for (const f of raw.flagsAdd ?? []) {
    if (!next.flags.includes(f)) next.flags.push(f);
  }
  next.flags = next.flags.filter((f) => !(raw.flagsRemove ?? []).includes(f));

  if (raw.fame) next.fame = raw.fame;
  if (raw.collectibleUnlock) {
    next.collection = unlockCollectible(next.collection, raw.collectibleUnlock);
  }
  if (raw.houseId != null) next.houseId = raw.houseId;
  if (raw.carId != null) next.carId = raw.carId;
  if (raw.business !== undefined) next.business = raw.business;
  if (raw.relationships) {
    next.relationships = { ...(next.relationships ?? {}), ...raw.relationships };
  }

  return next;
}

function unlockCollectible(collection, { kind, tier, id }) {
  if (!collection?.[kind]) return collection;
  return {
    ...collection,
    [kind]: collection[kind].map((s) =>
      s.tier === tier ? { ...s, id: id ?? s.id, unlocked: true, discovered: true } : s,
    ),
  };
}

export function tickEconomy(player) {
  const biz = player.income ? 0 : (player.business?.monthlyIncome ?? 0);
  const upkeep = (player.home ?? 0) * 5 + (player.car ?? 0) * 4;
  const flow = (player.income ?? 0) + biz - (player.expenses ?? 0) - upkeep;
  let next = { ...player };
  next.stats = applyStatDelta(next.stats, { dinero: flow });
  if (player.debt > 0) {
    next.debt = Math.round(player.debt * 1.002);
  }
  return next;
}

export function snapPlayer(player) {
  return {
    salud: player.stats.salud,
    felicidad: player.stats.felicidad,
    dinero: player.stats.dinero,
    influencia: player.stats.influencia,
    maldad: player.stats.maldad,
    job: player.job,
    home: player.home,
    car: player.car,
  };
}

export function deltaFromSnap(before, after) {
  const keys = ["salud", "felicidad", "dinero", "influencia", "maldad"];
  return keys
    .map((k) => ({ key: k, delta: (after[k] ?? 0) - (before[k] ?? 0) }))
    .filter((d) => d.delta !== 0);
}
