import { getWorldMissions } from "../content/worlds/index.js";

function missionProgress(game, mission) {
  const p = game.player;
  const type = mission.type ?? "money";
  if (type === "money") {
    const target = mission.target ?? 1;
    const money = p.stats?.dinero ?? 0;
    return { done: money >= target, progress: Math.min(100, Math.round((money / target) * 100)), label: null };
  }
  if (type === "job") {
    return { done: !!p.job, progress: p.job ? 100 : 0, label: p.job ? "✓ " + p.job : "Sin trabajo" };
  }
  if (type === "story") {
    const discovered = Object.values(p.stories ?? {}).some(
      (s) => s.discovered || (s.discoveredChapters?.length ?? 0) > 0,
    );
    return { done: discovered, progress: discovered ? 100 : 0, label: discovered ? "Historia descubierta" : "Sin historias" };
  }
  if (type === "fame") {
    const has = !!p.fame;
    return { done: has, progress: has ? 100 : 0, label: has ? "⭐ Fama activa" : "Sin fama" };
  }
  if (type === "collectibles") {
    const target = mission.target ?? 3;
    let count = 0;
    for (const kind of Object.keys(p.collection ?? {})) {
      count += (p.collection[kind] ?? []).filter((s) => s.unlocked).length;
    }
    return {
      done: count >= target,
      progress: Math.min(100, Math.round((count / target) * 100)),
      label: count + " / " + target + " objetos",
    };
  }
  return { done: false, progress: 0, label: null };
}

export function checkMissionProgress(game) {
  const missions = getWorldMissions(game.worldId);
  if (!missions?.length) return game;

  let completed = [...(game.missions?.completed ?? [])];
  let active = game.missions?.active ?? missions[0]?.id ?? null;

  for (const m of missions) {
    if (completed.includes(m.id)) continue;
    const { done } = missionProgress(game, m);
    if (done) {
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

  const enrich = (m, kind) => {
    if (!m) return null;
    const prog = missionProgress(game, m);
    return {
      ...m,
      progress: prog.progress,
      progressLabel: prog.label,
      done: completed.includes(m.id) || prog.done,
      kind,
    };
  };

  return {
    worldName: game.worldId === "clasico" ? "Clásico" : game.worldId,
    money,
    current: enrich(current, "current"),
    previous: enrich(previous, "previous"),
    next: next
      ? {
          ...enrich(next, "next"),
          locked: !completed.includes(current?.id),
        }
      : null,
  };
}
