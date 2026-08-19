import { applyOptionEffects } from "../effects.js";
import { applyFlagChanges } from "./flags.js";

/** Envejece la cola diferida y aplica efectos/flags vencidos. */
export function ageDeferred(session) {
  const deferred = session.deferred ?? [];
  let player = session.player;
  const nextQueue = [];

  for (const item of deferred) {
    const monthsLeft = item.monthsLeft - 1;
    if (monthsLeft <= 0) {
      if (item.type === "effects") {
        player = applyOptionEffects(player, item.effects ?? {});
      } else if (item.type === "flags") {
        player = applyFlagChanges(player, { add: item.add ?? [], remove: item.remove ?? [] });
      } else {
        nextQueue.push({ ...item, monthsLeft: 0 });
        continue;
      }
    } else {
      nextQueue.push({ ...item, monthsLeft });
    }
  }

  return { ...session, player, deferred: nextQueue };
}

export function scheduleDeferred(deferred = [], item) {
  const entry = {
    type: item.type ?? "event",
    id: item.id ?? null,
    monthsLeft: item.after ?? item.monthsLeft ?? 3,
    effects: item.effects,
    add: item.add,
    remove: item.remove,
    sourceEventId: item.sourceEventId ?? null,
    sourceOptionId: item.sourceOptionId ?? null,
  };
  return [...deferred, entry];
}

/** Elimina un evento diferido ya disparado. */
export function consumeDeferredEvent(session, eventId) {
  const deferred = (session.deferred ?? []).filter(
    (d) => !(d.type === "event" && d.id === eventId && d.monthsLeft <= 0),
  );
  return { ...session, deferred };
}

export function dueDeferredEvents(session) {
  return (session.deferred ?? []).filter((d) => d.type === "event" && d.monthsLeft <= 0);
}
