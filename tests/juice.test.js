import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { juiceDeltas, juiceHero, juiceTone, snap } from "../src/ui/juice.js";

describe("juice", () => {
  it("muestra solo cambios reales", () => {
    const before = snap({
      money: 100,
      happiness: 50,
      health: 70,
      bonds: 40,
      status: 20,
      home: 0,
      car: 0,
      job: "Ayudante",
      debt: 0,
      age: 16,
    });
    const after = { ...before, money: 190, happiness: 46, job: "Operativo" };
    const d = juiceDeltas(before, after);
    assert.ok(d.some((x) => x.key === "money" && x.delta === 90 && x.good));
    assert.ok(d.some((x) => x.key === "happiness" && x.good === false));
    assert.ok(d.some((x) => x.key === "job" && x.text === "Operativo"));
    assert.equal(d.some((x) => x.key === "health"), false);
  });

  it("el héroe prioriza el dinero", () => {
    const hero = juiceHero([{ key: "money", icon: "💰", delta: 90, good: true, money: true }]);
    assert.match(hero.text, /\+\$90/);
    assert.equal(juiceTone([{ good: true }, { good: false }]), "mix");
  });
});
