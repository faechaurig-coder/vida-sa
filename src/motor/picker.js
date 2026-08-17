import { filterEligible } from "./requirements.js";
import { EVENT_TYPES } from "./constants.js";

const DEFAULT_COOLDOWN = 6;

/**
 * Selección de evento mensual obligatorio.
 * Prioridad: forzado → diferido → continuación de historia → vida normal.
 * Las semillas de historia (sin flags) compiten con eventos cotidianos.
 * Cooldown y capítulos ya vistos se respetan siempre.
 */
export function pickEvent(session, catalog, rng = Math.random) {
  const { player, forcedEventId, deferred } = session;

  if (forcedEventId) {
    const ev = catalog.find((e) => e.id === forcedEventId);
    if (ev && isPlayable(ev, player, session, { ignoreCooldown: true })) {
      return { event: ev, source: "forced" };
    }
  }

  const dueDeferred = (deferred ?? []).find((d) => d.monthsLeft <= 0 && d.type === "event");
  if (dueDeferred) {
    const ev = catalog.find((e) => e.id === dueDeferred.id);
    if (ev && isPlayable(ev, player, session, { ignoreCooldown: true })) {
      return { event: ev, source: "deferred" };
    }
  }

  const followUps = catalog.filter((e) => isStoryFollowUp(e, player) && isPlayable(e, player, session));
  if (followUps.length) {
    const pick = weightedPick(applyWeights(followUps, player, session), rng);
    if (pick) return { event: pick, source: "story" };
  }

  let pool = catalog.filter((e) => isPlayable(e, player, session));
  if (!pool.length) {
    pool = catalog.filter((e) => filterEligible([e], player).length && !chapterAlreadySeen(e, player));
  }
  if (!pool.length) {
    pool = catalog.filter((e) => filterEligible([e], player).length);
  }

  const pick = weightedPick(applyWeights(pool, player, session), rng);
  return { event: pick ?? pool[0] ?? null, source: "life" };
}

function isStoryEvent(ev) {
  return ev.eventType === EVENT_TYPES.STORY || ev.kind === "story";
}

function chapterAlreadySeen(ev, player) {
  if (!ev.storyId || !ev.chapterId) return false;
  return (player.stories?.[ev.storyId]?.discoveredChapters ?? []).includes(ev.chapterId);
}

/** Continuación: la historia ya empezó o el evento exige un flag. */
function isStoryFollowUp(ev, player) {
  if (!isStoryEvent(ev) || !ev.storyId) return false;
  const req = ev.requirements ?? {};
  const gated = (req.flags?.length ?? 0) > 0 || (req.requireFlags?.length ?? 0) > 0;
  const started = !!(player.stories?.[ev.storyId]?.discovered || (player.stories?.[ev.storyId]?.discoveredChapters?.length ?? 0));
  return gated || started;
}

function isPlayable(ev, player, session, opts = {}) {
  if (ev.exclusive && session.seenExclusive?.includes(ev.id)) return false;
  if (!opts.ignoreCooldown && isOnCooldown(session, ev.id)) return false;
  if (chapterAlreadySeen(ev, player)) return false;
  return filterEligible([ev], player).length > 0;
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
    if (recent.has(ev.id)) w *= 0.12;
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
