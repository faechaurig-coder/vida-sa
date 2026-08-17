import { defineEvent, normalizeEvent, validateCatalog } from "./schema.js";
import { buildCatalogIndex, buildContentMatrix, matrixSummary } from "./matrix.js";

export * from "./taxonomy.js";
export * from "./schema.js";
export * from "./matrix.js";
export * from "./fame.js";
export * from "./careers.js";
export * from "./partner.js";

const _cache = new Map();

/**
 * Construye el catálogo completo de un mundo.
 * @param {string} worldId
 * @param {object[]} rawEvents — array plano de eventos
 */
export function buildWorldCatalog(worldId, rawEvents) {
  const events = rawEvents.map((e) => normalizeEvent({ ...e, worldId }));
  const errors = validateCatalog(events, { worldId });
  if (errors.length) {
    console.warn(`[catalog] ${worldId}:`, errors);
  }
  return {
    worldId,
    events,
    index: buildCatalogIndex(events),
    matrix: buildContentMatrix(events),
    summary: matrixSummary(buildContentMatrix(events))[worldId],
  };
}

export function getWorldCatalog(worldId, rawEvents) {
  if (!_cache.has(worldId)) {
    _cache.set(worldId, buildWorldCatalog(worldId, rawEvents));
  }
  return _cache.get(worldId);
}

export function clearCatalogCache() {
  _cache.clear();
}

export { defineEvent };
