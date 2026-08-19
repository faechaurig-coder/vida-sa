#!/usr/bin/env node
/**
 * Simulador de partidas — solo desarrollo.
 * Uso: node scripts/simulate.mjs [vidas] [meses] [seed] [worldId]
 */
import { simulateLives } from "../src/motor/narrative/simulate.js";
import { getCatalog } from "../src/content/worlds/index.js";

const lives = Number(process.argv[2] ?? 100);
const months = Number(process.argv[3] ?? 24);
const seed = Number(process.argv[4] ?? 42);
const worldId = process.argv[5] ?? "clasico";

const report = simulateLives({
  worldId,
  lives,
  monthsPerLife: months,
  seed,
  catalogFn: () => getCatalog(worldId),
});

console.log(JSON.stringify(report, null, 2));
