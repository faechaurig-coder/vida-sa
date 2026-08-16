import { clampStat } from "./tick.js";

export function applyEffect(run, effect = {}) {
  const next = { ...run, flags: [...run.flags] };
  if (effect.money) next.money += effect.money;
  if (effect.income) next.income = Math.max(0, next.income + effect.income);
  if (effect.expenses) next.expenses = Math.max(0, next.expenses + effect.expenses);
  if (effect.happiness) next.happiness = clampStat(next.happiness + effect.happiness);
  if (effect.health) next.health = clampStat(next.health + effect.health);
  if (effect.bonds) next.bonds = clampStat(next.bonds + effect.bonds);
  if (effect.status) next.status = clampStat(next.status + effect.status);
  if (effect.debt) next.debt = Math.max(0, next.debt + effect.debt);
  if (effect.job) next.job = effect.job;
  if (typeof effect.home === "number") next.home = Math.max(0, Math.min(5, effect.home));
  if (typeof effect.car === "number") next.car = Math.max(0, Math.min(5, effect.car));
  if (effect.dHome) next.home = Math.max(0, Math.min(5, next.home + effect.dHome));
  if (effect.dCar) next.car = Math.max(0, Math.min(5, next.car + effect.dCar));
  if (effect.partner === true) next.partner = true;
  if (effect.partner === false) next.partner = false;
  for (const f of effect.flagsAdd ?? []) {
    if (!next.flags.includes(f)) next.flags.push(f);
  }
  next.flags = next.flags.filter((f) => !(effect.flagsRemove ?? []).includes(f));
  return next;
}

export function resolveChoice(run, event, optionId) {
  const option = event.options.find((o) => o.id === optionId);
  if (!option) throw new Error("Opción desconocida: " + optionId);
  const before = { home: run.home, car: run.car };
  let next = applyEffect(run, option.immediate);
  next.punchline = option.punchline ?? "";
  next.seen = [...run.seen, event.id];
  next.currentEventId = event.id;
  next.cardsPlayed = run.cardsPlayed + 1;
  next.stageCards = run.stageCards + 1;
  next.log = [...run.log, event.id + ":" + optionId];
  if (option.deferred) {
    next.deferred = [...run.deferred, { ...option.deferred, left: option.deferred.after }];
  } else {
    next.deferred = run.deferred.map((d) => ({ ...d }));
  }
  return {
    run: next,
    option,
    upgrade:
      next.home > before.home
        ? { kind: "home", from: before.home, to: next.home }
        : next.car > before.car
          ? { kind: "car", from: before.car, to: next.car }
          : null,
  };
}

export function ageDeferred(run) {
  const due = [];
  const waiting = [];
  for (const item of run.deferred) {
    const left = item.left - 1;
    if (left <= 0) due.push(item);
    else waiting.push({ ...item, left });
  }
  return { due, run: { ...run, deferred: waiting } };
}
