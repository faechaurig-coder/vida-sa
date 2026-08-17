import { STAT_KEYS } from "./constants.js";

export function clampStat(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function createStats(overrides = {}) {
  const base = {
    salud: 80,
    felicidad: 60,
    dinero: 0,
    influencia: 30,
    maldad: 0,
  };
  const stats = { ...base, ...overrides };
  for (const key of STAT_KEYS) {
    if (key === "dinero") stats.dinero = Math.round(stats.dinero);
    else stats[key] = clampStat(stats[key]);
  }
  return stats;
}

/** Aplica deltas de consecuencia. Solo stats universales + campos explícitos. */
export function applyStatDelta(stats, delta = {}) {
  const next = { ...stats };
  for (const key of STAT_KEYS) {
    if (delta[key] == null) continue;
    if (key === "dinero") next.dinero = Math.round(next.dinero + delta[key]);
    else next[key] = clampStat(next[key] + delta[key]);
  }
  return next;
}

export function statsSnapshot(stats) {
  return STAT_KEYS.reduce((acc, k) => {
    acc[k] = stats[k];
    return acc;
  }, {});
}
