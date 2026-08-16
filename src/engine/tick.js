import { CAR_COST, HOME_COST } from "./constants.js";

export function clampStat(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function tickYears(run, years) {
  const y = Math.max(1, Math.min(4, years || 1));
  const upkeep = HOME_COST[run.home] + CAR_COST[run.car] + Math.round(run.debt * 0.08);
  const flow = (run.income - run.expenses - upkeep) * y;
  return {
    ...run,
    age: run.age + y,
    money: Math.round(run.money + flow),
    debt: Math.max(0, Math.round(run.debt * (1 + 0.02 * y))),
  };
}

export function shouldCollapse(run) {
  return run.health <= 0 || run.money <= -400;
}
