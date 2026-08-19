import { filterEligible } from "./requirements.js";
import { EVENT_TYPES } from "./constants.js";
import { EVENT_KINDS } from "../content/catalog/taxonomy.js";
import { consumeDeferredEvent, dueDeferredEvents } from "./narrative/deferred.js";

export { ageDeferred } from "./narrative/deferred.js";

const DEFAULT_COOLDOWN = 4;
const STORY_COOLDOWN = 24;
const RECENT_BLOCK = 2;
const STORY_PRIORITY_CHANCE = 0.38;
const SURPRISE_SLOT_CHANCE = 0.07;

/** Ritmo orientativo: ~70% vida, ~20% oportunidad, ~10% especial/historia. */
const RHYTHM = {
  life: 2.2,
  opportunity: 1.1,
  heavy: 0.55,
};

/**
 * Selección de evento mensual.
 * Capas: forzado → diferido → historia activa → sorpresa → normal.
 */
export function pickEvent(session, catalog, rng = Math.random) {
  const { player, forcedEventId } = session;

  if (forcedEventId) {
    const ev = catalog.find((e) => e.id === forcedEventId);
    if (ev && isPlayable(ev, player, session, { ignoreCooldown: true, ignoreRecent: true })) {
      return { event: ev, source: "forced" };
    }
  }

  const due = dueDeferredEvents(session);
  if (due.length) {
    const target = due[0];
    const ev = catalog.find((e) => e.id === target.id);
    if (ev && isPlayable(ev, player, session, { ignoreCooldown: true, ignoreRecent: true })) {
      return { event: ev, source: "deferred", consumeDeferredId: target.id };
    }
  }

  const pools = partitionPools(catalog, player, session);

  if (pools.story.length && rng() < STORY_PRIORITY_CHANCE) {
    const pick = weightedPick(applyWeights(pools.story, player, session, catalog), rng);
    if (pick) return { event: pick, source: "story" };
  }

  if (pools.surprise.length && rng() < SURPRISE_SLOT_CHANCE) {
    const pick = weightedPick(applyWeights(pools.surprise, player, session, catalog), rng);
    if (pick) return { event: pick, source: "surprise" };
  }

  let pool = pools.normal.length ? pools.normal : buildPool(catalog, player, session);
  const pick = weightedPick(applyWeights(pool, player, session, catalog), rng);
  return { event: pick ?? pool[0] ?? null, source: pickSource(pick, player) };
}

function partitionPools(catalog, player, session) {
  const playable = catalog.filter((e) => isPlayable(e, player, session));
  const story = [];
  const surprise = [];
  const normal = [];

  for (const ev of playable) {
    if (isSurpriseEvent(ev)) surprise.push(ev);
    else if (isStoryContinuation(ev, player)) story.push(ev);
    else normal.push(ev);
  }

  return { story, surprise, normal: normal.length ? normal : playable };
}

function isSurpriseEvent(ev) {
  return ev.kind === EVENT_KINDS.SURPRISE || ev.surprise === true || ev.tags?.includes("surprise");
}

function buildPool(catalog, player, session) {
  let pool = catalog.filter((e) => isPlayable(e, player, session));
  if (pool.length >= 6) return pool;

  pool = catalog.filter((e) => isPlayable(e, player, session, { ignoreCooldown: true }));
  if (pool.length >= 4) return pool;

  pool = catalog.filter(
    (e) => filterEligible([e], player).length && !chapterAlreadySeen(e, player),
  );
  if (pool.length) return pool;

  return catalog.filter((e) => filterEligible([e], player).length);
}

function pickSource(ev, player) {
  if (!ev) return "life";
  if (isStoryContinuation(ev, player)) return "story";
  if (isSurpriseEvent(ev)) return "surprise";
  if (ev.kind === EVENT_KINDS.SPECIAL || ev.rarity === "rare") return "special";
  return "life";
}

function isStoryEvent(ev) {
  return ev.eventType === EVENT_TYPES.STORY || ev.kind === "story";
}

function chapterAlreadySeen(ev, player) {
  if (!ev.storyId || !ev.chapterId) return false;
  return (player.stories?.[ev.storyId]?.discoveredChapters ?? []).includes(ev.chapterId);
}

function isStoryContinuation(ev, player) {
  if (!isStoryEvent(ev) || !ev.storyId) return false;
  const req = ev.requirements ?? {};
  const gated =
    (req.flags?.length ?? 0) > 0 ||
    (req.requireFlags?.length ?? 0) > 0 ||
    (req.requireAnyFlag?.length ?? 0) > 0 ||
    req.careerId != null ||
    req.storyId != null;
  if (!gated) return false;
  const prog = player.stories?.[ev.storyId];
  if (!prog?.discovered && !(prog?.discoveredChapters?.length)) return false;
  return filterEligible([ev], player).length > 0;
}

export function isPlayable(ev, player, session, opts = {}) {
  if (ev.exclusive && session.seenExclusive?.includes(ev.id)) return false;
  if (!opts.ignoreCooldown && isOnCooldown(session, ev.id)) return false;
  if (
    !opts.ignoreRecent &&
    (session.recentEvents ?? []).slice(0, RECENT_BLOCK).includes(ev.id)
  ) {
    return false;
  }
  if (chapterAlreadySeen(ev, player)) return false;
  return filterEligible([ev], player).length > 0;
}

function isOnCooldown(session, eventId) {
  return (session.cooldowns?.[eventId] ?? 0) > 0;
}

function applyWeights(events, player, session, catalog) {
  const recent = new Set(session.recentEvents ?? []);
  const recentCats = session.recentCategories ?? [];
  const heavyStreak = countRecentHeavy(session, catalog);
  const heavyPenalty = heavyStreak >= 2 ? 0.12 : heavyStreak === 1 ? 0.35 : 1;

  return events.map((ev) => {
    let w = ev.weight ?? 1;
    const bucket = eventBucket(ev);
    w *= RHYTHM[bucket] ?? 1;
    if (bucket === "heavy") w *= heavyPenalty;
    if (isStoryContinuation(ev, player)) w *= 2.2;
    if (ev.rarity === "rare" || ev.rarity === "legendary") w *= 0.5;
    if (ev.rarity === "epic") w *= 0.35;
    if (ev.priority) w *= 1 + ev.priority * 0.08;
    if (!recent.has(ev.id)) w *= 1.85;
    else w *= 0.08;
    if (recentCats.slice(0, 2).includes(ev.category)) w *= 0.35;
    if (ev.tags?.includes(player.stage)) w *= 1.12;
    return { ev, w: Math.max(0.01, w) };
  });
}

function eventBucket(ev) {
  if (ev.kind === EVENT_KINDS.STORY || ev.storyId) return "heavy";
  if (ev.kind === EVENT_KINDS.SPECIAL || ev.rarity === "rare" || ev.rarity === "epic") return "heavy";
  if (ev.category === "oportunidad" || ev.kind === EVENT_KINDS.IMPORTANT) return "opportunity";
  return "life";
}

function countRecentHeavy(session, catalog) {
  const ids = (session.recentEvents ?? []).slice(0, 3);
  if (!ids.length || !catalog) return 0;
  const byId = new Map(catalog.map((e) => [e.id, e]));
  return ids.filter((id) => {
    const ev = byId.get(id);
    return ev && eventBucket(ev) === "heavy";
  }).length;
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

export function cooldownForEvent(event) {
  if (!event) return DEFAULT_COOLDOWN;
  if (event.exclusive || (event.storyId && event.chapterId)) return STORY_COOLDOWN;
  if (event.kind === EVENT_KINDS.SPECIAL || event.kind === EVENT_KINDS.SURPRISE) return 12;
  if (event.rarity === "legendary") return 36;
  return event.cooldown ?? DEFAULT_COOLDOWN;
}

export function registerEventPlayed(
  session,
  eventId,
  cooldown = DEFAULT_COOLDOWN,
  exclusiveIds = null,
  category = null,
) {
  const recent = [eventId, ...(session.recentEvents ?? [])].slice(0, 12);
  const recentCategories = category
    ? [category, ...(session.recentCategories ?? [])].slice(0, 8)
    : session.recentCategories ?? [];
  const cooldowns = { ...(session.cooldowns ?? {}) };
  cooldowns[eventId] = cooldown;
  for (const k of Object.keys(cooldowns)) {
    if (k !== eventId) cooldowns[k] = Math.max(0, (cooldowns[k] ?? 0) - 1);
  }
  const seenExclusive =
    eventId && exclusiveIds?.includes(eventId)
      ? [...(session.seenExclusive ?? []), eventId]
      : session.seenExclusive ?? [];
  return { ...session, recentEvents: recent, recentCategories, cooldowns, seenExclusive };
}

export function applyPickResult(session, pickResult) {
  if (pickResult?.consumeDeferredId) {
    return consumeDeferredEvent(session, pickResult.consumeDeferredId);
  }
  return session;
}
