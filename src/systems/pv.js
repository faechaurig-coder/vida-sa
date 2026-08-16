import { PV_BALANCE } from "../data/balance.js";

export function awardPv(run, balance = PV_BALANCE) {
  let n = balance.base + Math.floor((run.happiness ?? 0) / balance.happinessDiv);
  if (run.collapse) n -= balance.collapsePenalty;
  return Math.max(balance.min, Math.min(balance.max, n));
}

export function addPv(meta, gained) {
  return {
    ...meta,
    pv: (meta.pv ?? 0) + gained,
    lastPvGain: gained,
  };
}
