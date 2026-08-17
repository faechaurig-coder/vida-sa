import { createStats, applyStatDelta } from "./stats.js";
import { partnerMonthlyEffect } from "./relationships/partner.js";

/**
 * Consecuencias — solo campos definidos en diseño.
 * stats: deltas a stats universales
 * flagsAdd / flagsRemove
 * unlockStory / unlockFame / setCareer / setPartner / discoverCollectible
 */
export function applyConsequences(player, consequence = {}) {
  let next = {
    ...player,
    stats: applyStatDelta(player.stats, consequence.stats ?? consequence),
    flags: [...player.flags],
    log: [...player.log],
  };

  for (const f of consequence.flagsAdd ?? []) {
    if (!next.flags.includes(f)) next.flags.push(f);
  }
  next.flags = next.flags.filter((f) => !(consequence.flagsRemove ?? []).includes(f));

  if (consequence.job != null) next.job = consequence.job;
  if (consequence.careerId != null) next.careerId = consequence.careerId;
  if (consequence.partner != null) next.partner = consequence.partner;
  if (consequence.fame != null) next.fame = consequence.fame;

  if (consequence.collectibleUnlock) {
    next.collection = unlockCollectibleSlot(next.collection, consequence.collectibleUnlock);
  }

  if (consequence.storyProgress) {
    next.stories = {
      ...next.stories,
      [consequence.storyProgress.storyId]: {
        ...(next.stories[consequence.storyProgress.storyId] ?? {}),
        ...consequence.storyProgress.patch,
      },
    };
  }

  if (consequence.logEntry) next.log.push(consequence.logEntry);

  return next;
}

export function applyMonthlyPassive(player) {
  const partnerFx = partnerMonthlyEffect(player.partner);
  return applyConsequences(player, { stats: partnerFx });
}

function unlockCollectibleSlot(collection, { kind, tier, id, discovered = true }) {
  const next = { ...collection, [kind]: [...collection[kind]] };
  const slot = next[kind].find((s) => s.tier === tier);
  if (!slot) return collection;
  next[kind] = next[kind].map((s) =>
    s.tier === tier ? { ...s, id: id ?? s.id, discovered, unlocked: true } : s,
  );
  return next;
}

export function createConsequenceFromLegacyEffect(effect = {}) {
  const stats = {};
  if (effect.health != null) stats.salud = effect.health;
  if (effect.happiness != null) stats.felicidad = effect.happiness;
  if (effect.money != null) stats.dinero = effect.money;
  if (effect.status != null) stats.influencia = effect.status;
  if (effect.maldad != null) stats.maldad = effect.maldad;
  return {
    stats,
    flagsAdd: effect.flagsAdd ?? [],
    flagsRemove: effect.flagsRemove ?? [],
    job: effect.job,
  };
}
