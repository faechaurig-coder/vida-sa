import { STAGE_BUDGET, STAGES } from "./constants.js";
import { EVENTS, getEvent } from "../content/events.js";

export function eligible(event, run) {
  if (event.stage !== run.stage) return false;
  if (run.seen.includes(event.id)) return false;
  for (const f of event.requireFlags ?? []) {
    if (!run.flags.includes(f)) return false;
  }
  for (const f of event.forbidFlags ?? []) {
    if (run.flags.includes(f)) return false;
  }
  return true;
}

export function nextStage(run) {
  const budget = STAGE_BUDGET[run.stage] ?? 1;
  if (run.stageCards < budget) return run;
  const i = STAGES.indexOf(run.stage);
  if (i < 0 || i >= STAGES.length - 1) return { ...run, stageDone: true };
  return { ...run, stage: STAGES[i + 1], stageCards: 0 };
}

export function selectEvent(run, catalog = EVENTS) {
  const forced = run.forceEventId ? getEvent(run.forceEventId, catalog) : null;
  if (forced && !run.seen.includes(forced.id)) {
    return { ...run, currentEventId: forced.id, forceEventId: null };
  }
  const pool = catalog.filter((e) => eligible(e, run));
  const beat = pool.find((e) => e.beat);
  const pick = beat ?? pool[0];
  if (!pick) return { ...run, currentEventId: null };
  return { ...run, currentEventId: pick.id, forceEventId: null };
}
