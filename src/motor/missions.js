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
