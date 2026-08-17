import { createStats } from "../foundation/stats.js";
import { createCalendar, computeAge, advanceMonth as nextMonth, formatMonthYear } from "../foundation/time.js";
import { stageForAge } from "../foundation/stages.js";
import { createEmptyCollection } from "../foundation/collectibles/registry.js";
import { partnerMonthlyEffect } from "../foundation/relationships/partner.js";
import { applyStatDelta } from "../foundation/stats.js";
import { pickEvent, registerEventPlayed, ageDeferred } from "./picker.js";
import { createPartner } from "../foundation/relationships/partner.js";
import { applyOptionEffects, tickEconomy, snapPlayer, deltaFromSnap } from "./effects.js";
import { meetsRequirements } from "./requirements.js";
import { getCatalog } from "../content/worlds/index.js";
import { checkMissionProgress } from "./missions.js";

export function createGame(config = {}) {
  const birth = createCalendar(config.birthYear ?? 2018, config.birthMonth ?? 1);
  const calendar = createCalendar(config.startYear ?? 2026, config.startMonth ?? 1);
  const age = computeAge(birth, calendar);

  return {
    worldId: config.worldId ?? "clasico",
    player: {
      name: config.name ?? "Tú",
      worldId: config.worldId ?? "clasico",
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
      stories: {},
      collection: config.collection ?? createEmptyCollection(),
      decisions: [],
      home: config.home ?? 0,
      car: config.car ?? 0,
      debt: config.debt ?? 0,
      income: config.income ?? 0,
      expenses: config.expenses ?? 0,
      originId: config.originId ?? null,
    },
    pendingEvent: null,
    storyContext: null,
    forcedEventId: null,
    deferred: [],
    recentEvents: [],
    cooldowns: {},
    seenExclusive: [],
    lastResult: null,
    phase: "idle",
    monthsPlayed: 0,
    missions: { completed: [], active: null },
    ended: false,
  };
}

/** START MONTH → GENERATE EVENT */
export function startMonth(game, rng = Math.random) {
  const catalog = getCatalog(game.worldId);
  let player = game.player;

  const partnerFx = partnerMonthlyEffect(player.partner);
  player = { ...player, stats: applyStatDelta(player.stats, partnerFx) };
  player = tickEconomy(player);
  player = refreshAge(player);

  let session = { ...game, player, catalog };
  session = ageDeferred(session);

  const { event, source } = pickEvent(session, catalog, rng);
  if (!event) throw new Error("Sin eventos elegibles para " + game.worldId);

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

  const before = snapPlayer(game.player);
  const raw = option.effects ?? option.immediate ?? {};
  let player = applyOptionEffects(game.player, raw);
  player.decisions = [...player.decisions, event.id + ":" + optionId];

  if (option.storyProgress) {
    player = applyStoryProgress(player, option.storyProgress);
  }
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
    player.partner = createPartner(option.partnerTraits ?? {});
  }

  const deferred = [...(game.deferred ?? [])];
  if (option.deferred) {
    deferred.push({
      type: option.deferred.type ?? "event",
      id: option.deferred.id,
      monthsLeft: option.deferred.after ?? option.deferred.monthsLeft ?? 3,
    });
  }
  if (option.nextEvent) {
    deferred.push({ type: "event", id: option.nextEvent, monthsLeft: 0 });
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
        deltas: deltaFromSnap(before, after),
        before,
        after,
      },
    },
    event.id,
    event.cooldown ?? 6,
    event.exclusive ? [event.id] : null,
  );

  next = checkMissionProgress(next);
  return next;
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
  const prev = player.stories[id] ?? { storyId: id, discoveredChapters: [], currentChapter: null, completed: false };
  const chapters = prog.chapterId
    ? [...new Set([...prev.discoveredChapters, prog.chapterId])]
    : prev.discoveredChapters;
  return {
    ...player,
    stories: {
      ...player.stories,
      [id]: {
        ...prev,
        currentChapter: prog.chapterId ?? prev.currentChapter,
        discoveredChapters: chapters,
        completed: !!prog.completed,
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
    fame: p.fame,
    careerId: p.careerId,
    home: p.home,
    car: p.car,
  };
}

export function eventForUI(event) {
  if (!event) return null;
  return {
    id: event.id,
    title: event.title,
    body: event.description ?? event.body ?? "",
    stage: event.stage,
    category: event.category,
    options: (event.options ?? []).map((o) => ({
      id: o.id,
      label: o.text ?? o.label,
      hint: o.hint ?? "",
    })),
  };
}
