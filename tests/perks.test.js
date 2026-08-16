import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRun } from "../src/engine/createRun.js";
import { shouldCollapse } from "../src/engine/tick.js";
import { emptyMeta } from "../src/systems/persist.js";
import {
  applyPerkToRun,
  canUpgrade,
  equipPerk,
  perkTier,
  upgradePerk,
} from "../src/systems/perks.js";
import { PERK_TIER_COST } from "../src/data/balance.js";

describe("comodín · 1 slot", () => {
  it("gasta PV para subir tier I→II→III", () => {
    let meta = { ...emptyMeta(), pv: 50 };
    const u1 = upgradePerk(meta, "colchon");
    assert.equal(u1.ok, true);
    assert.equal(u1.spent, PERK_TIER_COST[1]);
    assert.equal(perkTier(u1.meta, "colchon"), 1);
    meta = u1.meta;
    const u2 = upgradePerk(meta, "colchon");
    assert.equal(u2.ok, true);
    assert.equal(perkTier(u2.meta, "colchon"), 2);
  });

  it("no permite equipar sin tier", () => {
    const meta = emptyMeta();
    const res = equipPerk(meta, "colchon");
    assert.equal(res.ok, false);
  });

  it("solo un comodín equipado a la vez", () => {
    let meta = { ...emptyMeta(), pv: 40, perkTiers: { colchon: 1, contacto: 1, red: 0 } };
    meta = equipPerk(meta, "colchon").meta;
    assert.equal(meta.equippedPerk, "colchon");
    meta = equipPerk(meta, "contacto").meta;
    assert.equal(meta.equippedPerk, "contacto");
    meta = equipPerk(meta, "contacto").meta;
    assert.equal(meta.equippedPerk, null);
  });

  it("aplica efecto al crear run", () => {
    const base = createRun("beca");
    const boosted = createRun("beca", { id: "colchon", tier: 1 });
    assert.ok(boosted.money > base.money);
    assert.equal(boosted.equippedPerk.id, "colchon");
    assert.ok(boosted.flags.includes("comodin_colchon"));
  });

  it("red tier II amplía quiebra sin tocar salud 0", () => {
    const run = applyPerkToRun(createRun("oficio"), "red", 2);
    assert.equal(run.collapseMoney, -450);
    assert.equal(shouldCollapse({ ...run, health: 1, money: -420 }), false);
    assert.equal(shouldCollapse({ ...run, health: 0, money: 100 }), true);
  });

  it("canUpgrade respeta PV disponible", () => {
    const poor = { ...emptyMeta(), pv: 2 };
    assert.equal(canUpgrade(poor, "colchon"), false);
    const rich = { ...emptyMeta(), pv: 20 };
    assert.equal(canUpgrade(rich, "colchon"), true);
  });
});
