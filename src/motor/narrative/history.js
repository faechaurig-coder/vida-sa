import { deltaFromSnap, snapPlayer } from "../effects.js";

/** Registro estructurado de cada decisión (además del log legacy). */
export function recordDecisionEntry({ event, option, player, beforePlayer, afterPlayer, storyChanges }) {
  const before = snapPlayer(beforePlayer);
  const after = snapPlayer(afterPlayer);
  const raw = option.effects ?? option.immediate ?? {};

  return {
    eventId: event.id,
    optionId: option.id,
    month: player.calendar?.month ?? null,
    year: player.calendar?.year ?? null,
    profile: option.profile ?? null,
    effects: deltaFromSnap(before, after),
    flagsActivated: raw.flagsAdd ?? [],
    flagsRemoved: raw.flagsRemove ?? [],
    storyChanges: storyChanges ?? null,
    category: event.category ?? null,
    kind: event.kind ?? null,
  };
}

export function appendDecisionHistory(player, entry) {
  const history = [...(player.decisionHistory ?? []), entry];
  const legacy = [...(player.decisions ?? []), `${entry.eventId}:${entry.optionId}`];
  return { ...player, decisionHistory: history, decisions: legacy };
}
