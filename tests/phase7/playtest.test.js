import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getCatalog } from "../../src/content/worlds/index.js";
import { createGame, startMonth, resolveDecision, finishMonth } from "../../src/motor/loop.js";
import { EVENT_KINDS } from "../../src/content/catalog/taxonomy.js";

function seededRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function playMonths(game, months, rng) {
  let g = game;
  const seen = new Set();
  for (let i = 0; i < months; i++) {
    if (!g.pendingEvent) g = startMonth(g, rng);
    assert.ok(g.pendingEvent, "mes " + i + " sin evento");
    assert.equal(g.phase, "awaiting_decision");
    seen.add(g.pendingEvent.id);
    const opt = g.pendingEvent.options[Math.floor(rng() * g.pendingEvent.options.length)];
    g = resolveDecision(g, opt.id);
    assert.equal(g.phase, "showing_result");
    g = finishMonth(g);
    assert.equal(g.phase, "idle");
  }
  return { game: g, uniqueEvents: seen.size };
}

describe("fase 7 · playtest simulado", () => {
  it("120 meses sin trabarse y con variedad", () => {
    const rng = seededRng(7);
    let g = createGame({ worldId: "clasico", name: "Tester" });
    g = startMonth(g, rng);
    const { uniqueEvents } = playMonths(g, 120, rng);
    assert.ok(uniqueEvents >= 30, "poca variedad: " + uniqueEvents);
  });

  it("colección casa/auto progresa con requisitos de tier", () => {
    let g = createGame({ worldId: "clasico" });
    g.player.stats.dinero = 60000;
    g.player.home = 0;
    const casa1 = getCatalog("clasico").find((e) => e.id === "c_adu_coleccion_casa");
    g = { ...g, pendingEvent: casa1, phase: "awaiting_decision", player: { ...g.player, stage: "adultez", age: 30 } };
    g = resolveDecision(g, "comprar");
    assert.equal(g.player.home, 1);
    g.player.stats.dinero = 200000;
    const casa2 = getCatalog("clasico").find((e) => e.id === "c_adu_coleccion_casa_2");
    g = { ...g, pendingEvent: casa2, phase: "awaiting_decision" };
    g = resolveDecision(g, "comprar");
    assert.equal(g.player.home, 2);
  });

  it("madurez tiene suficiente contenido propio", () => {
    const madurez = getCatalog("clasico").filter((e) => e.stage === "madurez");
    assert.ok(madurez.length >= 12);
    const important = madurez.filter((e) => e.kind === EVENT_KINDS.IMPORTANT || e.kind === EVENT_KINDS.SPECIAL);
    assert.ok(important.length >= 4);
  });

  it("callbacks raros exigen decisiones previas", () => {
    const callbacks = ["c_raro_ayuda_nino", "c_raro_amigo_infancia", "c_raro_dinero_devuelto", "c_raro_actor_mentira"];
    const catalog = getCatalog("clasico");
    for (const id of callbacks) {
      const ev = catalog.find((e) => e.id === id);
      assert.ok(ev, id);
      assert.ok(ev.requirements?.decisions?.length || ev.requirements?.flags?.length, id + " sin gancho");
    }
  });
});
