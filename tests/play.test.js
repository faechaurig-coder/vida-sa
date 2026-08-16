import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { choose, startLife } from "../src/engine/play.js";
import { SEEDS } from "../src/content/seeds.js";

function play(seedId, pick = 0) {
  let pack = startLife(seedId);
  let guard = 0;
  while (!pack.run.ended && guard < 20) {
    const ev = pack.view.event;
    assert.ok(ev, "siempre hay carta o final");
    assert.ok(ev.options.length >= 2 && ev.options.length <= 3);
    const opt = ev.options[Math.min(pick, ev.options.length - 1)];
    pack = choose(pack.run, opt.id);
    guard += 1;
  }
  assert.equal(pack.run.ended, true);
  assert.ok(pack.view.rank.identity);
  assert.equal(pack.view.screen, "post");
  return pack;
}

describe("vertical slice", () => {
  for (const seed of SEEDS) {
    it("completa una vida con semilla " + seed.id, () => {
      const pack = play(seed.id, 0);
      assert.ok(pack.run.age > seed.start.age);
      assert.ok(pack.run.cardsPlayed >= 6);
    });
  }

  it("la segunda semilla produce otra historia", () => {
    const a = play("apellido", 0);
    const b = play("oficio", 1);
    assert.ok(a.run.seedId !== b.run.seedId);
    assert.ok(a.run.log.join() !== b.run.log.join());
  });

  it("una decisión deja semilla diferida", () => {
    let pack = startLife("beca");
    pack = choose(pack.run, "take");
    assert.ok(pack.run.deferred.some((d) => d.id === "la_entrevista"));
  });
});
