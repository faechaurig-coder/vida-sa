import { MONTH_KINDS } from "./constants.js";
import { createPlayerState, refreshPlayerDerived } from "./player.js";
import { applyMonthlyPassive, applyConsequences } from "./effects.js";
import { advanceMonth, formatMonthYear } from "./time.js";
import { selectMonthContent } from "./events/selector.js";
import { resolveDecision } from "./events/resolver.js";
import { checkUnlocks, applyUnlocks } from "./unlocks.js";
import { getWorld, bootstrapDefaultWorld, initialCollectionForWorld } from "./worlds/registry.js";
import { stageChanged } from "./stages.js";

/**
 * Estado de sesión mensual — motor Fase 1.
 * El vertical slice legacy sigue en src/engine/ sin cambios.
 */
export function createSession(config = {}) {
  const worldId = config.worldId ?? "capitalismo";
  if (!getWorld(worldId)) bootstrapDefaultWorld();
  const world = getWorld(worldId);
  const collection = initialCollectionForWorld(worldId);
  const player = refreshPlayerDerived({
    ...createPlayerState({ ...config, worldId }),
    collection: collection ?? createPlayerState(config).collection,
  });

  return {
    worldId,
    player,
    month: null,
    pendingEvent: null,
    storyContext: null,
    phase: "idle",
    history: [],
  };
}

/** INICIO DEL MES */
export function beginMonth(session, catalogs = {}, rng = Math.random) {
  const world = getWorld(session.worldId);
  if (!world) throw new Error("Mundo no registrado: " + session.worldId);

  let player = applyMonthlyPassive(session.player);
  const prevStage = player.stage;
  player = refreshPlayerDerived(player);

  const content = selectMonthContent(player, world, catalogs, rng);
  const month = {
    kind: content.kind,
    label: formatMonthYear(player.calendar),
    stage: player.stage,
    stageChanged: stageChanged(prevStage, player.stage),
  };

  const needsDecision =
    content.kind === MONTH_KINDS.DECISION ||
    content.kind === MONTH_KINDS.SPECIAL ||
    content.kind === MONTH_KINDS.STORY;

  return {
    ...session,
    player,
    month,
    pendingEvent: needsDecision ? content.event : null,
    storyContext: content.story
      ? { story: content.story, chapter: content.chapter }
      : null,
    phase: needsDecision && content.event ? "awaiting_decision" : "month_resolved",
    lastResult: needsDecision ? null : { kind: content.kind, passive: true },
  };
}

/** Jugador toma decisión */
export function decide(session, optionId) {
  if (!session.pendingEvent) throw new Error("No hay decisión pendiente");
  const resolved = resolveDecision(
    session.player,
    session.pendingEvent,
    optionId,
    session.storyContext ?? {},
  );
  return {
    ...session,
    player: resolved.player,
    phase: "decision_resolved",
    lastResult: {
      kind: session.month?.kind,
      summary: resolved.summary,
      optionId,
    },
  };
}

/** CERRAR MES — avanza calendario */
export function closeMonth(session) {
  const unlocks = checkUnlocks(session.player, getWorld(session.worldId));
  let player = applyUnlocks(session.player, unlocks);
  const prevLabel = formatMonthYear(player.calendar);
  player = refreshPlayerDerived({
    ...player,
    calendar: advanceMonth(player.calendar),
  });
  const nextLabel = formatMonthYear(player.calendar);

  return {
    ...session,
    player,
    month: null,
    pendingEvent: null,
    storyContext: null,
    phase: "idle",
    history: [
      ...session.history,
      {
        from: prevLabel,
        to: nextLabel,
        result: session.lastResult,
        unlocks,
      },
    ],
    lastResult: null,
  };
}

/** Loop completo: mes sin decisión o tras decidir */
export function playMonth(session, catalogs = {}, decision = null, rng = Math.random) {
  let s = beginMonth(session, catalogs, rng);
  if (s.phase === "awaiting_decision" && decision) {
    s = decide(s, decision);
  } else if (s.phase === "awaiting_decision" && !decision) {
    return s;
  }
  return closeMonth(s);
}

export function hudFromPlayer(player) {
  return {
    salud: player.stats.salud,
    felicidad: player.stats.felicidad,
    dinero: player.stats.dinero,
    influencia: player.stats.influencia,
    maldad: player.stats.maldad,
    age: player.age,
    stage: player.stage,
    monthYear: formatMonthYear(player.calendar),
    job: player.job,
    partner: player.partner?.active ?? false,
    fame: player.fame,
    careerId: player.careerId,
  };
}
