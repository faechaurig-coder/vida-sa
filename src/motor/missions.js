import { getWorldMissions } from "../content/worlds/index.js";

export function checkMissionProgress(game) {
  const missions = getWorldMissions(game.worldId);
  if (!missions?.length) return game;

  const money = game.player.stats.dinero;
  let completed = [...(game.missions?.completed ?? [])];
  let active = game.missions?.active ?? missions[0]?.id ?? null;

  for (const m of missions) {
    if (completed.includes(m.id)) continue;
    if (money >= m.target) {
      completed.push(m.id);
      const idx = missions.findIndex((x) => x.id === m.id);
      active = missions[idx + 1]?.id ?? null;
    }
  }

  return { ...game, missions: { completed, active } };
}

export function activeMission(game) {
  const missions = getWorldMissions(game.worldId);
  const id = game.missions?.active;
  return missions?.find((m) => m.id === id) ?? null;
}

export function missionsView(game) {
  const missions = getWorldMissions(game.worldId);
  if (!missions.length) {
    return { worldName: game.worldId, money: 0, current: null, previous: null, next: null };
  }

  const completed = game.missions?.completed ?? [];
  const activeId = game.missions?.active;
  const money = game.player.stats?.dinero ?? 0;
  const currentIdx = missions.findIndex((m) => m.id === activeId);
  const current = currentIdx >= 0 ? missions[currentIdx] : null;
  const previous = completed.length
    ? missions.find((m) => m.id === completed[completed.length - 1])
    : null;
  const next = currentIdx >= 0 && currentIdx + 1 < missions.length ? missions[currentIdx + 1] : null;

  return {
    worldName: game.worldId,
    money,
    current: current
      ? {
          ...current,
          progress: Math.min(100, Math.round((money / current.target) * 100)),
          done: completed.includes(current.id),
        }
      : null,
    previous: previous ? { ...previous, done: true } : null,
    next: next
      ? {
          ...next,
          locked: !completed.includes(current?.id),
        }
      : null,
  };
}
