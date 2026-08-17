import { MONTH_KINDS } from "../constants.js";
import { eligibleChapters } from "../stories/progress.js";
import { storiesForWorld } from "../stories/registry.js";

/**
 * Selecciona tipo de mes y evento si aplica.
 * Pesos vienen del mundo — no inventados aquí.
 */
export function pickMonthKind(world, rng = Math.random) {
  const weights = world.rules?.monthDistribution ?? {};
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let roll = rng() * total;
  for (const [kind, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return kind;
  }
  return MONTH_KINDS.NORMAL;
}

export function selectMonthContent(player, world, catalogs = {}, rng = Math.random) {
  const kind = pickMonthKind(world, rng);
  const stage = player.stage;
  const flags = player.flags;

  if (kind === MONTH_KINDS.STORY) {
    const storyHit = pickStoryChapter(player, world);
    if (storyHit) return { kind, story: storyHit.story, chapter: storyHit.chapter, event: storyHit.event };
  }

  const pool = filterEvents(catalogs.events ?? [], { stage, flags, kind });
  if (pool.length === 0 && kind === MONTH_KINDS.DECISION) {
    return { kind: MONTH_KINDS.QUIET, event: null };
  }
  if (pool.length === 0) {
    return { kind, event: null };
  }

  const event = pool[Math.floor(rng() * pool.length)];
  return { kind, event };
}

function pickStoryChapter(player, world) {
  for (const story of storiesForWorld(world.id)) {
    const chapters = eligibleChapters(player, story);
    if (chapters.length === 0) continue;
    const chapter = chapters[0];
    return {
      story,
      chapter,
      event: chapter.event ?? { id: chapter.id, title: chapter.title ?? chapter.id, body: "", options: [] },
    };
  }
  return null;
}

function filterEvents(events, { stage, flags, kind }) {
  return events.filter((ev) => {
    if (ev.stage && ev.stage !== stage) return false;
    if (ev.monthKind && ev.monthKind !== kind) return false;
    if (ev.requireFlags?.length && !ev.requireFlags.every((f) => flags.includes(f))) return false;
    if (ev.forbidFlags?.length && ev.forbidFlags.some((f) => flags.includes(f))) return false;
    return true;
  });
}
