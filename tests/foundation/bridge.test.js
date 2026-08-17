import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { legacyRunToFoundation, foundationToLegacyStats } from "../../src/foundation/bridge/legacy.js";
import { createRun } from "../../src/engine/createRun.js";

describe("foundation · puente legacy", () => {
  it("mapea run del slice a stats Fase 1 sin inventar maldad", () => {
    const run = createRun("apellido");
    const f = legacyRunToFoundation(run);
    assert.equal(f.stats.salud, run.health);
    assert.equal(f.stats.felicidad, run.happiness);
    assert.equal(f.stats.dinero, run.money);
    assert.equal(f.stats.influencia, run.status);
    assert.equal(f.stats.maldad, 0);
    assert.ok(f.legacy.bonds === run.bonds);
  });

  it("revierte stats a nombres legacy para compatibilidad", () => {
    const mapped = foundationToLegacyStats({
      salud: 80,
      felicidad: 60,
      dinero: 400,
      influencia: 42,
      maldad: 3,
    });
    assert.equal(mapped.health, 80);
    assert.equal(mapped.money, 400);
  });
});
