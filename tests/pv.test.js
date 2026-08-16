import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { addPv, awardPv } from "../src/systems/pv.js";
import { emptyMeta, rememberLife } from "../src/systems/persist.js";
import { choose, startLife } from "../src/engine/play.js";

describe("PV", () => {
  it("queda entre min y max y no usa dinero de la vida", () => {
    const poor = awardPv({ happiness: 10, money: -80, collapse: false });
    const rich = awardPv({ happiness: 90, money: 900, collapse: false });
    assert.ok(poor >= 4 && poor <= 24);
    assert.ok(rich >= 4 && rich <= 24);
    assert.ok(rich >= poor);
  });

  it("el colapso recorta pero no deja en cero", () => {
    const a = awardPv({ happiness: 40, collapse: false });
    const b = awardPv({ happiness: 40, collapse: true });
    assert.ok(b < a);
    assert.ok(b >= 4);
  });

  it("se acumula en meta, no en el run", () => {
    const meta = addPv(emptyMeta(), 10);
    const next = rememberLife(meta, { seedId: "beca", home: 1, car: 0 }, { identity: "x", dominant: "dinero", neglected: "salud" }, 8);
    assert.equal(next.pv, 18);
    assert.equal(next.lastPvGain, 8);
    assert.equal(next.lives, 1);
  });

  it("el final de una vida entrega pvAward", () => {
    let pack = startLife("oficio");
    let guard = 0;
    while (!pack.run.ended && guard < 20) {
      pack = choose(pack.run, pack.view.event.options[0].id);
      guard += 1;
    }
    assert.ok(pack.view.pvAward >= 4);
    assert.equal(pack.run.pv, undefined);
  });
});
