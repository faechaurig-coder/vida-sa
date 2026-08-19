import { createStats } from "../foundation/stats.js";
import { createCalendar, computeAge, advanceMonth as nextMonth, formatMonthYear } from "../foundation/time.js";
import { stageForAge } from "../foundation/stages.js";
import { partnerMonthlyEffect } from "../foundation/relationships/partner.js";
import { applyStatDelta } from "../foundation/stats.js";
import { pickEvent, registerEventPlayed, ageDeferred, cooldownForEvent, applyPickResult } from "./picker.js";
import { applyOptionEffects, tickEconomy, snapPlayer, deltaFromSnap } from "./effects.js";
import { meetsRequirements } from "./requirements.js";
import { getCatalog, getWorldDef, getWorldMissions } from "../content/worlds/index.js";
import { checkMissionProgress } from "./missions.js";
import { initGameCollection, syncCollectionFromPlayer } from "./collection.js";
import { detectUnlocks } from "./unlocks.js";
import { scheduleDeferred } from "./narrative/deferred.js";
import { recordDecisionEntry, appendDecisionHistory } from "./narrative/history.js";
import { optionForUI } from "./narrative/visibility.js";
import {
  seedOriginFamily,
  beginRelationship,
  applyRelationshipEffects,
  syncPartnerMirror,
  addMemory,
  shouldEndLife,
  buildLifeSummary,
} from "./relationships/index.js";

export function createGame(config = {}) {
  const birth = createCalendar(config.birthYear ?? 2018, config.birthMonth ?? 1);
  const calendar = createCalendar(config.startYear ?? 2026, config.startMonth ?? 1);
  const age = computeAge(birth, calendar);
  const worldId = config.worldId ?? "clasico";
  const worldDef = getWorldDef(worldId);
  const basePlayer = {
    name: config.name ?? "Tú",
    worldId,
    birth,
    calendar,
    age,
    stage: stageForAge(age),
    stats: createStats(config.stats ?? {}),
    job: config.job ?? null,
    careerId: config.careerId ?? null,
    partner: config.partner ?? null,
    fame: null,
    flags: [...(config.flags ?? [])],
    stories: config.stories ?? {},
    collection: config.collection ?? initGameCollection(worldDef?.collectibles),
    decisions: [],
    decisionHistory: config.decisionHistory ?? [],
    home: config.home ?? 0,
    car: config.car ?? 0,
    houseId: config.houseId ?? null,
    carId: config.carId ?? null,
    business: config.business ?? null,
    relationships: config.relationships ?? {},
    debt: config.debt ?? 0,
    income: config.income ?? 0,
    expenses: config.expenses ?? 0,
    originId: config.originId ?? null,
    family: config.family ?? seedOriginFamily({ birth: birth, calendar }, config.rng ?? Math.random),
    memories: config.memories ?? [],
  };

  return {
    worldId,
    player: syncCollectionFromPlayer(basePlayer),
    pendingEvent: null,
    storyContext: null,
    forcedEventId: null,
    deferred: [],
    recentEvents: [],
    recentCategories: [],
    cooldowns: {},
    seenExclusive: [],
    lastResult: null,
    phase: "idle",
    monthsPlayed: 0,
    missions: config.missions ?? {
      completed: [],
      active: getWorldMissions(worldId)[0]?.id ?? null,
    },
    ended: false,
    lifeSummary: null,
  };
}

/** START MONTH → GENERATE EVENT */
export function startMonth(game, rng = Math.random) {
  if (game.ended) return game;
  const catalog = getCatalog(game.worldId);
  let player = game.player;

  const partnerFx = partnerMonthlyEffect(player.partner);
  player = { ...player, stats: applyStatDelta(player.stats, partnerFx) };
  player = tickEconomy(player);
  player = refreshAge(player);

  if (shouldEndLife(player)) {
    return endLife({ ...game, player });
  }

  let session = { ...game, player, catalog };
  session = ageDeferred(session);

  const pickResult = pickEvent(session, catalog, rng);
  const { event, source } = pickResult;
  if (!event) throw new Error("Sin eventos elegibles para " + game.worldId);

  session = applyPickResult(session, pickResult);

  return {
    ...session,
    pendingEvent: event,
    storyContext: event.storyId ? { storyId: event.storyId, chapterId: event.chapterId } : null,
    phase: "awaiting_decision",
    eventSource: source,
    monthLabel: formatMonthYear(player.calendar),
  };
}

/** PLAYER DECISION → RESOLVE */
export function resolveDecision(game, optionId) {
  const event = game.pendingEvent;
  if (!event) throw new Error("No hay evento pendiente");

  const option = event.options.find((o) => o.id === optionId);
  if (!option) throw new Error("Opción desconocida: " + optionId);
  if (!meetsRequirements(game.player, option.requirements)) {
    throw new Error("Opción no disponible");
  }

  const beforeSnap = {
    player: game.player,
    missions: game.missions,
  };
  const before = snapPlayer(game.player);
  const raw = option.effects ?? option.immediate ?? {};
  let player = applyOptionEffects(game.player, raw);
  let storyChanges = null;

  if (option.storyProgress) {
    player = applyStoryProgress(player, option.storyProgress);
    storyChanges = option.storyProgress;
  }

  const historyEntry = recordDecisionEntry({
    event,
    option,
    player,
    beforePlayer: game.player,
    afterPlayer: player,
    storyChanges,
  });
  player = appendDecisionHistory(player, historyEntry);
  player = syncCollectionFromPlayer(player);
  if (option.unlock?.fame) {
    player.fame = { line: option.unlock.fame, level: 1 };
    if (!player.flags.includes("fame_" + option.unlock.fame)) {
      player.flags.push("fame_" + option.unlock.fame);
    }
  }
  if (option.unlock?.careerId) {
    player.careerId = option.unlock.careerId;
    if (!player.flags.includes("career_" + option.unlock.careerId)) {
      player.flags.push("career_" + option.unlock.careerId);
    }
    const careerTitle = option.unlock.careerTitle;
    if (careerTitle) player.job = careerTitle;
  }
  if (option.unlock?.partner) {
    player = beginRelationship(player, {
      traits: option.unlock.partnerTraits ?? option.partnerTraits ?? {},
    });
  }
  if (option.relationshipEffects) {
    player = applyRelationshipEffects(player, option.relationshipEffects);
  }
  if (option.memory) {
    player = addMemory(player, option.memory);
  }
  if (raw.endLife || option.endLife) {
    player = { ...player };
  }
  player = syncPartnerMirror(player);

  let deferred = [...(game.deferred ?? [])];
  if (option.deferred) {
    deferred = scheduleDeferred(deferred, {
      ...option.deferred,
      sourceEventId: event.id,
      sourceOptionId: optionId,
    });
  }
  if (option.nextEvent) {
    deferred = scheduleDeferred(deferred, {
      type: "event",
      id: option.nextEvent,
      after: 0,
      sourceEventId: event.id,
      sourceOptionId: optionId,
    });
  }

  const after = snapPlayer(player);
  let next = registerEventPlayed(
    {
      ...game,
      player,
      deferred,
      pendingEvent: null,
      forcedEventId: option.nextEvent ?? null,
      phase: "showing_result",
      lastResult: {
        eventId: event.id,
        optionId,
        text: option.resultText ?? option.punchline ?? "Decidiste.",
        hook: option.hook ?? null,
        deltas: deltaFromSnap(before, after),
        before,
        after,
        profile: option.profile ?? null,
      },
    },
    event.id,
    event.cooldown ?? cooldownForEvent(event),
    event.exclusive ? [event.id] : null,
    event.category,
  );

  next = checkMissionProgress(next);
  const unlocks = detectUnlocks(beforeSnap, next);
  next = {
    ...next,
    lastResult: {
      ...next.lastResult,
      unlocks,
    },
  };
  if (option.endLife || raw.endLife) {
    next = endLife(next);
  }
  return next;
}

export function endLife(game) {
  const summary = buildLifeSummary(game.player);
  return {
    ...game,
    pendingEvent: null,
    phase: "life_ended",
    ended: true,
    lifeSummary: summary,
  };
}

export function startNewLife(previousGame, meta = {}, config = {}) {
  const worldId = config.worldId ?? previousGame?.worldId ?? "clasico";
  const name = config.name ?? previousGame?.player?.name ?? "Tú";
  return createGame({
    worldId,
    name,
    stats: { dinero: 0 },
    partner: null,
    home: 0,
    car: 0,
    business: null,
    flags: [],
    stories: {},
  });
}

/** SHOW RESULT → ADVANCE MONTH (llamar tras UI) */
export function finishMonth(game) {
  const player = refreshAge({
    ...game.player,
    calendar: nextMonth(game.player.calendar),
  });

  return {
    ...game,
    player,
    phase: "idle",
    forcedEventId: null,
    monthsPlayed: game.monthsPlayed + 1,
    lastResult: null,
  };
}

function refreshAge(player) {
  const age = computeAge(player.birth, player.calendar);
  return { ...player, age, stage: stageForAge(age) };
}

function applyStoryProgress(player, prog) {
  const id = prog.storyId;
  const prev = player.stories[id] ?? {
    storyId: id,
    discoveredChapters: [],
    currentChapter: null,
    discovered: false,
    completed: false,
  };
  const chapters = prog.chapterId
    ? [...new Set([...prev.discoveredChapters, prog.chapterId])]
    : prev.discoveredChapters;
  return {
    ...player,
    stories: {
      ...player.stories,
      [id]: {
        ...prev,
        discovered: true,
        currentChapter: prog.chapterId ?? prev.currentChapter,
        discoveredChapters: chapters,
        completed: !!prog.completed || prev.completed,
      },
    },
    flags:
      prog.flag && !player.flags.includes(prog.flag) ? [...player.flags, prog.flag] : player.flags,
  };
}

export function hudFromGame(game) {
  const p = game.player;
  return {
    name: p.name,
    monthYear: formatMonthYear(p.calendar),
    age: p.age,
    stage: p.stage,
    salud: p.stats.salud,
    felicidad: p.stats.felicidad,
    dinero: p.stats.dinero,
    influencia: p.stats.influencia,
    maldad: p.stats.maldad,
    job: p.job,
    partner: p.partner?.active ?? false,
    partnerName: p.family?.partner?.name ?? null,
    fame: p.fame,
    careerId: p.careerId,
    home: p.home,
    car: p.car,
  };
}

export function eventForUI(event, player = null) {
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
    body: event.description ?? event.body ?? "",
    stage: event.stage,
    category: event.category,
    kind: event.kind ?? event.eventType ?? null,
    storyId: event.storyId ?? null,
    rarity: event.rarity ?? "normal",
    options: (event.options ?? []).map((o) => {
      const ok = player ? meetsRequirements(player, o.requirements) : true;
      return optionForUI(o, player, ok);
    }),
  };
}
