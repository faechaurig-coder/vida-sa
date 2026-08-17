import { filterEligible } from "./requirements.js";
import { EVENT_TYPES } from "./constants.js";

const DEFAULT_COOLDOWN = 6;

/**
 * Selección de evento mensual obligatorio.
 * Prioridad: forzado → historia activa → peso/cooldown/anti-repetición.
 */
export function pickEvent(session, catalog, rng = Math.random) {
  const { player, forcedEventId, deferred } = session;

  if (forcedEventId) {
    const ev = catalog.find((e) => e.id === forcedEventId);
    if (ev && filterEligible([ev], player).length) return { event: ev, source: "forced" };
  }

  const dueDeferred = (deferred ?? []).find((d) => d.monthsLeft <= 0 && d.type === "event");
  if (dueDeferred) {
    const ev = catalog.find((e) => e.id === dueDeferred.id);
    if (ev) return { event: ev, source: "deferred" };
  }

  const storyEvents = catalog.filter(
    (e) => e.eventType === EVENT_TYPES.STORY && filterEligible([e], player).length,
  );
  if (storyEvents.length) {
    const weighted = applyWeights(storyEvents, player, session);
    const pick = weightedPick(weighted, rng);
    if (pick) return { event: pick, source: "story" };
  }

  let pool = catalog.filter((e) => {
    if (e.exclusive && session.seenExclusive?.includes(e.id)) return false;
    if (isOnCooldown(session, e.id)) return false;
    return filterEligible([e], player).length;
  });

  pool = pool.filter((e) => e.eventType !== EVENT_TYPES.STORY || e.storyId);
  if (!pool.length) {
    pool = catalog.filter((e) => filterEligible([e], player).length);
  }

  const weighted = applyWeights(pool, player, session);
  const pick = weightedPick(weighted, rng);
  return { event: pick ?? pool[0] ?? null, source: "life" };
}

function isOnCooldown(session, eventId) {
  const cd = session.cooldowns?.[eventId] ?? 0;
  return cd > 0;
}

function applyWeights(events, player, session) {
  const recent = new Set(session.recentEvents ?? []);
  return events.map((ev) => {
    let w = ev.weight ?? 1;
    if (ev.rarity === "rare") w *= 0.6;
    if (recent.has(ev.id)) w *= 0.15;
    if (ev.tags?.includes(player.stage)) w *= 1.2;
    return { ev, w: Math.max(0.01, w) };
  });
}

function weightedPick(weighted, rng) {
  if (!weighted.length) return null;
  const total = weighted.reduce((s, x) => s + x.w, 0);
  let roll = rng() * total;
  for (const { ev, w } of weighted) {
    roll -= w;
    if (roll <= 0) return ev;
  }
  return weighted[weighted.length - 1].ev;
}

export function registerEventPlayed(session, eventId, cooldown = DEFAULT_COOLDOWN, exclusiveIds = null) {
  const recent = [eventId, ...(session.recentEvents ?? [])].slice(0, 8);
  const cooldowns = { ...(session.cooldowns ?? {}) };
  cooldowns[eventId] = cooldown;
  for (const k of Object.keys(cooldowns)) {
    if (k !== eventId) cooldowns[k] = Math.max(0, (cooldowns[k] ?? 0) - 1);
  }
  const seenExclusive =
    eventId && exclusiveIds?.includes(eventId)
      ? [...(session.seenExclusive ?? []), eventId]
      : session.seenExclusive ?? [];
  return { ...session, recentEvents: recent, cooldowns, seenExclusive };
}

export function ageDeferred(session) {
  const deferred = (session.deferred ?? [])
    .map((d) => ({ ...d, monthsLeft: d.monthsLeft - 1 }))
    .filter((d) => d.monthsLeft > 0 || d.type === "event");
  return { ...session, deferred };
}
