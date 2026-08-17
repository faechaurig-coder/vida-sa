import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createStats, applyStatDelta } from "../../src/foundation/stats.js";
import { STAT_KEYS } from "../../src/foundation/constants.js";

describe("foundation · stats", () => {
  it("solo expone las 5 stats universales", () => {
    const s = createStats();
    assert.deepEqual(Object.keys(s).sort(), [...STAT_KEYS].sort());
  });

  it("clampa 0-100 excepto dinero", () => {
    const s = applyStatDelta(createStats(), { salud: 200, maldad: -5, dinero: 150 });
    assert.equal(s.salud, 100);
    assert.equal(s.maldad, 0);
    assert.equal(s.dinero, 150);
  });
});
