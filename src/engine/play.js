import { createRun } from "./createRun.js";
import { resolveChoice, ageDeferred, applyEffect } from "./resolve.js";
import { nextStage, selectEvent } from "./select.js";
import { shouldCollapse, tickYears } from "./tick.js";
import { STAGES } from "./constants.js";
import { EVENTS, getEvent } from "../content/events.js";
import { computeRank, questionFor } from "../systems/rank.js";
import { computeNearMiss } from "../systems/nearMiss.js";
import { assetCopy } from "../systems/assets.js";
import { awardPv } from "../systems/pv.js";

export function startLife(seedId) {
  return present(fillEvent(createRun(seedId)));
}

export function choose(run, optionId, catalog = EVENTS) {
  if (run.ended) return present(run);
  const event = getEvent(run.currentEventId, catalog);
  if (!event) throw new Error("No hay evento activo");
  const resolved = resolveChoice(run, event, optionId);
  let next = tickYears(resolved.run, event.years);
  const aged = ageDeferred(next);
  next = aged.run;
  for (const item of aged.due) {
    if (item.type === "effect") next = applyEffect(next, item.immediate ?? {});
    if (item.type === "event") next.forceEventId = item.id;
  }
  if (shouldCollapse(next)) {
    return finish({ ...next, ended: true, collapse: true }, resolved.upgrade);
  }
  next = fillEvent(nextStage(next), catalog);
  if (next.stageDone || !next.currentEventId) {
    return finish({ ...next, ended: true }, resolved.upgrade);
  }
  return pack(next, resolved);
}

function fillEvent(run, catalog = EVENTS) {
  let cur = { ...run };
  for (let i = 0; i < STAGES.length + 1; i++) {
    cur = selectEvent(cur, catalog);
    if (cur.currentEventId) return { ...cur, stageDone: false };
    if (cur.stage === STAGES[STAGES.length - 1]) return { ...cur, stageDone: true };
    const idx = STAGES.indexOf(cur.stage);
    cur = { ...cur, stage: STAGES[idx + 1], stageCards: 0 };
  }
  return { ...cur, stageDone: true };
}

function finish(run, upgrade) {
  const rank = computeRank(run);
  const near = computeNearMiss(run);
  const ended = { ...run, ended: true, currentEventId: null };
  const pvAward = awardPv(ended);
  return {
    run: ended,
    view: {
      screen: "post",
      beat: 0,
      event: null,
      punchline: run.punchline,
      upgrade: upgrade ? { ...upgrade, ...assetCopy(upgrade.kind, upgrade.to) } : null,
      rank,
      near,
      pvAward,
      question: questionFor(ended, rank, near),
    },
  };
}

function pack(run, resolved) {
  return {
    run,
    view: {
      screen: "life",
      event: getEvent(run.currentEventId),
      punchline: resolved.option.punchline,
      upgrade: resolved.upgrade
        ? { ...resolved.upgrade, ...assetCopy(resolved.upgrade.kind, resolved.upgrade.to) }
        : null,
      rank: null,
      near: null,
      question: "",
    },
  };
}

export function present(run) {
  if (run.ended) return finish(run, null);
  const filled = run.currentEventId ? run : fillEvent(run);
  return {
    run: filled,
    view: {
      screen: "life",
      event: getEvent(filled.currentEventId),
      punchline: "",
      upgrade: null,
      rank: null,
      near: null,
      question: "",
    },
  };
}

export function hudOf(run) {
  return {
    age: run.age,
    money: run.money,
    job: run.job,
    happiness: run.happiness,
    health: run.health,
    home: run.home,
    car: run.car,
    partner: run.partner,
    debt: run.debt,
  };
}
