import { PERK_TIER_COST } from "../data/balance.js";
import { PERKS, getPerk, tierEffect } from "../content/perks.js";
import { applyEffect } from "../engine/resolve.js";

export function emptyPerkTiers() {
  return Object.fromEntries(PERKS.map((p) => [p.id, 0]));
}

export function perkTier(meta, perkId) {
  return meta.perkTiers?.[perkId] ?? 0;
}

export function upgradeCost(tier) {
  return PERK_TIER_COST[tier] ?? null;
}

export function canUpgrade(meta, perkId) {
  const cur = perkTier(meta, perkId);
  if (cur >= 3) return false;
  const cost = upgradeCost(cur + 1);
  return cost !== null && (meta.pv ?? 0) >= cost;
}

export function upgradePerk(meta, perkId) {
  const cur = perkTier(meta, perkId);
  if (cur >= 3) return { meta, ok: false, reason: "max" };
  const next = cur + 1;
  const cost = upgradeCost(next);
  if (cost === null || (meta.pv ?? 0) < cost) {
    return { meta, ok: false, reason: "pv" };
  }
  return {
    meta: {
      ...meta,
      pv: meta.pv - cost,
      perkTiers: { ...(meta.perkTiers ?? emptyPerkTiers()), [perkId]: next },
    },
    ok: true,
    tier: next,
    spent: cost,
  };
}

export function equipPerk(meta, perkId) {
  const tier = perkTier(meta, perkId);
  if (tier < 1) return { meta, ok: false, reason: "locked" };
  const equipped = meta.equippedPerk === perkId ? null : perkId;
  return { meta: { ...meta, equippedPerk: equipped }, ok: true, equipped };
}

export function applyPerkToRun(run, perkId, tier) {
  const effect = tierEffect(perkId, tier);
  if (!effect) return run;
  let next = applyEffect(run, effect);
  if (effect.collapseMoney) {
    next = { ...next, collapseMoney: effect.collapseMoney };
  }
  next.equippedPerk = { id: perkId, tier };
  next.flags = [...next.flags, "comodin_" + perkId];
  return next;
}

export function perkSummary(perkId, tier) {
  const perk = getPerk(perkId);
  const fx = tierEffect(perkId, tier);
  if (!perk || !fx) return "";
  const parts = [];
  if (fx.money) parts.push("+" + fx.money + " al inicio");
  if (fx.income) parts.push("+" + fx.income + " ingreso");
  if (fx.health) parts.push("+" + fx.health + " salud");
  if (fx.status) parts.push("+" + fx.status + " estatus");
  if (fx.happiness && fx.happiness < 0) parts.push(fx.happiness + " felicidad");
  if (fx.bonds && fx.bonds < 0) parts.push(fx.bonds + " vínculos");
  if (fx.collapseMoney) parts.push("quiebra a " + fx.collapseMoney);
  return parts.join(" · ") || perk.tagline;
}

export function tierLabel(tier) {
  return tier === 1 ? "I" : tier === 2 ? "II" : tier === 3 ? "III" : "—";
}
