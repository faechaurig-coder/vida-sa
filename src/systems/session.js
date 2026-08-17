import { formatMonthYear } from "../foundation/time.js";
import { LIFE_STAGE_LABELS } from "../content/catalog/taxonomy.js";
import { getWorldDef } from "../content/worlds/index.js";

export function hasActiveSession(session) {
  return !!(session?.motorGame?.player);
}

export function sessionPreview(game) {
  const p = game?.player;
  if (!p) return null;
  const worldId = game.worldId ?? p.worldId ?? "clasico";
  const world = getWorldDef(worldId);
  return {
    name: p.name || "Tú",
    worldId,
    worldName: world?.name ?? worldId,
    age: p.age ?? 0,
    stage: p.stage ?? "",
    stageLabel: LIFE_STAGE_LABELS[p.stage] ?? p.stage ?? "",
    monthYear: p.calendar ? formatMonthYear(p.calendar) : "",
    dinero: p.stats?.dinero ?? 0,
    eventTitle: game.pendingEvent?.title ?? null,
  };
}

export function sessionPreviewFromSave(session) {
  return hasActiveSession(session) ? sessionPreview(session.motorGame) : null;
}
