import { createStats } from "./stats.js";
import { createCalendar, computeAge } from "./time.js";
import { stageForAge } from "./stages.js";
import { createEmptyCollection } from "./collectibles/registry.js";

/** Estado del jugador — Fase 1. Sin stats extra universales. */
export function createPlayerState(config = {}) {
  const birth = createCalendar(config.birthYear ?? 2012, config.birthMonth ?? 3);
  const calendar = createCalendar(config.startYear ?? 2028, config.startMonth ?? 3);
  const age = computeAge(birth, calendar);

  return {
    worldId: config.worldId ?? "capitalismo",
    birth,
    calendar,
    age,
    stage: stageForAge(age),
    stats: createStats(config.stats),
    job: config.job ?? null,
    careerId: config.careerId ?? null,
    partner: config.partner ?? null,
    fame: null,
    flags: [...(config.flags ?? [])],
    stories: {},
    collection: createEmptyCollection(),
    seenEvents: [],
    log: [],
  };
}

export function refreshPlayerDerived(player) {
  const age = computeAge(player.birth, player.calendar);
  const stage = stageForAge(age);
  return { ...player, age, stage };
}
