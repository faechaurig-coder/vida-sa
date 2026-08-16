import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { shouldCollapse, tickYears } from "../src/engine/tick.js";

describe("tick", () => {
  it("avanza 1–4 años y mueve dinero sin exponer fórmula", () => {
    const run = {
      age: 20,
      money: 100,
      income: 20,
      expenses: 5,
      home: 0,
      car: 0,
      debt: 0,
      health: 50,
    };
    const next = tickYears(run, 2);
    assert.equal(next.age, 22);
    assert.ok(next.money !== run.money);
  });

  it("colapsa con salud 0 o quiebra", () => {
    assert.equal(shouldCollapse({ health: 0, money: 10 }), true);
    assert.equal(shouldCollapse({ health: 10, money: -400 }), true);
    assert.equal(shouldCollapse({ health: 10, money: 0 }), false);
  });
});
