import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computeRank } from "../src/systems/rank.js";
import { computeNearMiss } from "../src/systems/nearMiss.js";

const base = {
  money: 100,
  happiness: 50,
  health: 50,
  bonds: 50,
  status: 50,
  job: "X",
  home: 1,
  car: 0,
  partner: false,
  flags: [],
};

describe("rank", () => {
  it("no devuelve un score numérico", () => {
    const r = computeRank(base);
    assert.equal(typeof r.identity, "string");
    assert.ok(!/\d{3}/.test(r.identity));
    assert.ok(r.dominant);
    assert.ok(r.neglected);
  });

  it("elige dinero como dominante si el extracto manda", () => {
    const r = computeRank({ ...base, money: 800, happiness: 20, bonds: 10 });
    assert.equal(r.dominant, "dinero");
  });
});

describe("near miss", () => {
  it("no inventa cerca si no hay evidencia", () => {
    assert.equal(computeNearMiss({ flags: [], money: 50, home: 0 }), null);
  });

  it("reconoce atajo sin estudio", () => {
    const n = computeNearMiss({ flags: ["atajo"], money: 100, home: 1 });
    assert.equal(n.kind, "study");
  });
});
