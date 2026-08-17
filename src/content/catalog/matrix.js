import {
  LIFE_STAGE_IDS,
  CONTENT_CATEGORIES,
  CATEGORY_LABELS,
  EVENT_KIND_LABELS,
  LIFE_STAGE_LABELS,
} from "./taxonomy.js";

/**
 * Índice WORLD → STAGE → CATEGORY → [events]
 * Permite localizar cualquier evento sin carpetas infinitas.
 */
export function buildCatalogIndex(events) {
  const index = {};
  for (const ev of events) {
    const world = ev.worldId ?? "unknown";
    const stage = ev.stage ?? ev.requirements?.stage ?? "_any";
    const category = ev.category ?? "especial";

    index[world] ??= {};
    index[world][stage] ??= {};
    index[world][stage][category] ??= [];
    index[world][stage][category].push(ev.id);
  }
  return index;
}

export function lookupEvents(index, worldId, stage, category) {
  return index[worldId]?.[stage]?.[category] ?? [];
}

/** Filas para matriz maestra de contenido. */
export function buildContentMatrix(events) {
  return events
    .map((ev) => ({
      world: ev.worldId,
      stage: ev.stage ?? ev.requirements?.stage ?? "—",
      stageLabel: LIFE_STAGE_LABELS[ev.stage] ?? ev.stage,
      category: ev.category,
      categoryLabel: CATEGORY_LABELS[ev.category] ?? ev.category,
      kind: ev.kind,
      kindLabel: EVENT_KIND_LABELS[ev.kind] ?? ev.kind,
      id: ev.id,
      title: ev.title,
      storyId: ev.storyId ?? "",
      requirements: formatRequirements(ev.requirements),
      repeatable: ev.repeatable !== false && !ev.exclusive,
      exclusive: !!ev.exclusive,
      cooldown: ev.cooldown ?? 6,
      weight: ev.weight ?? 1,
    }))
    .sort((a, b) => {
      const ws = a.world.localeCompare(b.world);
      if (ws) return ws;
      const st = LIFE_STAGE_IDS.indexOf(a.stage) - LIFE_STAGE_IDS.indexOf(b.stage);
      if (st) return st;
      return a.category.localeCompare(b.category) || a.id.localeCompare(b.id);
    });
}

function formatRequirements(req) {
  if (!req) return "—";
  const parts = [];
  if (req.stage) parts.push(`etapa:${req.stage}`);
  if (req.flags?.length) parts.push(`flags:${req.flags.join("+")}`);
  if (req.requireFlags?.length) parts.push(`req:${req.requireFlags.join("+")}`);
  if (req.forbidFlags?.length) parts.push(`!${req.forbidFlags.join("+")}`);
  if (req.evilMin != null) parts.push(`maldad≥${req.evilMin}`);
  if (req.hasPartner) parts.push("pareja");
  if (req.careerId) parts.push(`carrera:${req.careerId}`);
  if (req.fameLine) parts.push(`fama:${req.fameLine}`);
  return parts.length ? parts.join(", ") : "—";
}

export function matrixSummary(matrix) {
  const byWorld = {};
  for (const row of matrix) {
    byWorld[row.world] ??= { total: 0, byStage: {}, byKind: {}, stories: new Set() };
    const w = byWorld[row.world];
    w.total++;
    w.byStage[row.stage] = (w.byStage[row.stage] ?? 0) + 1;
    w.byKind[row.kind] = (w.byKind[row.kind] ?? 0) + 1;
    if (row.storyId) w.stories.add(row.storyId);
  }
  for (const w of Object.values(byWorld)) {
    w.stories = [...w.stories];
  }
  return byWorld;
}

export function formatMatrixMarkdown(matrix) {
  const header =
    "| Mundo | Etapa | Categoría | Tipo | ID | Evento | Historia | Requisitos | Repetible |\n" +
    "|-------|-------|-----------|------|-----|--------|----------|------------|-----------|";
  const rows = matrix.map(
    (r) =>
      `| ${r.world} | ${r.stageLabel} | ${r.categoryLabel} | ${r.kindLabel} | ${r.id} | ${r.title} | ${r.storyId || "—"} | ${r.requirements} | ${r.repeatable ? "sí" : "no"} |`,
  );
  return [header, ...rows].join("\n");
}

export function emptyIndexShell(worldId) {
  const index = { [worldId]: {} };
  for (const stage of LIFE_STAGE_IDS) {
    index[worldId][stage] = {};
    for (const cat of CONTENT_CATEGORIES) {
      index[worldId][stage][cat] = [];
    }
  }
  return index;
}
