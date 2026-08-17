import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGame, startMonth, resolveDecision, finishMonth } from "../../src/motor/loop.js";
import { getCatalog } from "../../src/content/worlds/index.js";
import { meetsRequirements } from "../../src/motor/requirements.js";

describe("motor · fase 3", () => {
  it("cada mes genera un evento obligatorio", () => {
    const g = startMonth(createGame({ worldId: "clasico", name: "Ana" }));
    assert.ok(g.pendingEvent);
    assert.equal(g.phase, "awaiting_decision");
    assert.ok(g.pendingEvent.options.length >= 2);
  });

  it("decisión avanza al siguiente mes", () => {
    let g = startMonth(createGame({ worldId: "clasico" }));
    const monthBefore = g.player.calendar.month;
    const opt = g.pendingEvent.options[0].id;
    g = resolveDecision(g, opt);
    assert.equal(g.phase, "showing_result");
    g = finishMonth(g);
    assert.equal(g.player.calendar.month, monthBefore === 12 ? 1 : monthBefore + 1);
    g = startMonth(g);
    assert.ok(g.pendingEvent);
  });

  it("catálogo clásico tiene eventos por etapa", () => {
    const cat = getCatalog("clasico");
    assert.ok(cat.some((e) => e.stage === "infancia"));
    assert.ok(cat.some((e) => e.stage === "adultez"));
  });

  it("capitalismo preserva eventos legacy adaptados", () => {
    const cat = getCatalog("capitalismo");
    assert.ok(cat.some((e) => e.id === "el_atajo"));
    assert.ok(cat.some((e) => e.id === "el_acta"));
  });

  it("requisitos filtran por flags", () => {
    const player = createGame({ worldId: "clasico" }).player;
    player.flags = ["clases_musica"];
    player.stage = "universidad";
    const ev = getCatalog("clasico").find((e) => e.id === "c_uni_cantante_juegos");
    assert.ok(meetsRequirements(player, ev.requirements));
  });

  it("infancia no se queda solo en eventos de historia", () => {
    const seen = new Set();
    let g = startMonth(createGame({ worldId: "clasico" }), () => 0.42);
    for (let i = 0; i < 5; i++) {
      seen.add(g.pendingEvent.id);
      g = resolveDecision(g, g.pendingEvent.options[0].id);
      g = startMonth(finishMonth(g), () => (0.17 * (i + 3)) % 1);
    }
    assert.ok(seen.size >= 3, "esperaba variedad, vi: " + [...seen].join(", "));
  });

  it("el evento del parque no se repite el mes siguiente", () => {
    let g = startMonth(createGame({ worldId: "clasico" }));
    const park = getCatalog("clasico").find((e) => e.id === "c_inf_futbol");
    g = { ...g, pendingEvent: park, phase: "awaiting_decision" };
    g = resolveDecision(g, "jugar");
    g = startMonth(finishMonth(g), () => 0.5);
    assert.notEqual(g.pendingEvent.id, "c_inf_futbol");
  });
});
