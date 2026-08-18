import { filterEligible } from "./requirements.js";
import { EVENT_TYPES } from "./constants.js";
import { EVENT_KINDS } from "../content/catalog/taxonomy.js";

const DEFAULT_COOLDOWN = 4;
const STORY_COOLDOWN = 24;
const RECENT_BLOCK = 2;

/** Ritmo orientativo: ~70% vida, ~20% oportunidad, ~10% especial/historia. */
const RHYTHM = {
  life: 2.2,
  opportunity: 1.1,
  heavy: 0.55,
};

/**
 * Selección de evento mensual obligatorio.
 * Prioridad: forzado → diferido → pool ponderado (vida + historias + especiales).
 */
export function pickEvent(session, catalog, rng = Math.random) {
  const { player, forcedEventId, deferred } = session;

  if (forcedEventId) {
    const ev = catalog.find((e) => e.id === forcedEventId);
    if (ev && isPlayable(ev, player, session, { ignoreCooldown: true, ignoreRecent: true })) {
      return { event: ev, source: "forced" };
    }
  }

  const dueDeferred = (deferred ?? []).find((d) => d.monthsLeft <= 0 && d.type === "event");
  if (dueDeferred) {
    const ev = catalog.find((e) => e.id === dueDeferred.id);
    if (ev && isPlayable(ev, player, session, { ignoreCooldown: true, ignoreRecent: true })) {
      return { event: ev, source: "deferred" };
    }
  }

  let pool = buildPool(catalog, player, session);
  const pick = weightedPick(applyWeights(pool, player, session, catalog), rng);
  return { event: pick ?? pool[0] ?? null, source: pickSource(pick, player) };
}

function buildPool(catalog, player, session) {
  let pool = catalog.filter((e) => isPlayable(e, player, session));
  if (pool.length >= 6) return pool;

  pool = catalog.filter((e) =>
    isPlayable(e, player, session, { ignoreCooldown: true }),
  );
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

/** Solo capítulos con requisitos cumplidos — no monopolizar el picker. */
function isStoryContinuation(ev, player) {
  if (!isStoryEvent(ev) || !ev.storyId) return false;
  const req = ev.requirements ?? {};
  const gated =
    (req.flags?.length ?? 0) > 0 ||
    (req.requireFlags?.length ?? 0) > 0 ||
    (req.requireAnyFlag?.length ?? 0) > 0 ||
    req.careerId != null;
  if (!gated) return false;
  const prog = player.stories?.[ev.storyId];
  if (!prog?.discovered && !(prog?.discoveredChapters?.length)) return false;
  return filterEligible([ev], player).length > 0;
}

function isPlayable(ev, player, session, opts = {}) {
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
  const heavyStreak = countRecentHeavy(session, catalog);
  const heavyPenalty = heavyStreak >= 2 ? 0.12 : heavyStreak === 1 ? 0.35 : 1;

  return events.map((ev) => {
    let w = ev.weight ?? 1;
    const bucket = eventBucket(ev);
    w *= RHYTHM[bucket] ?? 1;
    if (bucket === "heavy") w *= heavyPenalty;
    if (isStoryContinuation(ev, player)) w *= 2.2;
    if (ev.rarity === "rare") w *= 0.5;
    if (!recent.has(ev.id)) w *= 1.85;
    else w *= 0.08;
    if (ev.tags?.includes(player.stage)) w *= 1.12;
    return { ev, w: Math.max(0.01, w) };
  });
}

function eventBucket(ev) {
  if (ev.kind === EVENT_KINDS.STORY || ev.storyId) return "heavy";
  if (ev.kind === EVENT_KINDS.SPECIAL || ev.rarity === "rare") return "heavy";
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
  if (event.kind === EVENT_KINDS.SPECIAL) return 12;
  return event.cooldown ?? DEFAULT_COOLDOWN;
}

export function registerEventPlayed(session, eventId, cooldown = DEFAULT_COOLDOWN, exclusiveIds = null) {
  const recent = [eventId, ...(session.recentEvents ?? [])].slice(0, 12);
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
