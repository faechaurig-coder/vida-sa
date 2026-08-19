#!/usr/bin/env node
/**
 * Debug de elegibilidad de eventos — solo desarrollo.
 * Uso: node scripts/debug-event.mjs <eventId> [worldId]
 */
import { createGame } from "../src/motor/loop.js";
import { getCatalog } from "../src/content/worlds/index.js";
import { explainEventEligibility } from "../src/motor/narrative/debug.js";

const eventId = process.argv[2];
const worldId = process.argv[3] ?? "clasico";

if (!eventId) {
  console.error("Uso: node scripts/debug-event.mjs <eventId> [worldId]");
  process.exit(1);
}

const catalog = getCatalog(worldId);
const event = catalog.find((e) => e.id === eventId);
if (!event) {
  console.error(`Evento no encontrado: ${eventId}`);
  process.exit(1);
}

const game = createGame({ worldId });
const report = explainEventEligibility(event, game, catalog);
console.log(JSON.stringify(report, null, 2));
