import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  createSession,
  beginMonth,
  decide,
  closeMonth,
  playMonth,
  hudFromPlayer,
} from "../../src/foundation/loop.js";
import { clearWorlds, bootstrapDefaultWorld } from "../../src/foundation/worlds/registry.js";
import { MONTH_KINDS } from "../../src/foundation/constants.js";

const sampleCatalog = {
  events: [
    {
      id: "test_decision",
      stage: "adultez",
      monthKind: MONTH_KINDS.DECISION,
      title: "Prueba",
      body: "¿Qué haces?",
      options: [
        {
          id: "a",
          label: "Opción A",
          consequence: { stats: { dinero: 100, maldad: 2 } },
        },
      ],
    },
  ],
};

describe("foundation · loop mensual", () => {
  beforeEach(() => {
    clearWorlds();
    bootstrapDefaultWorld();
  });

  it("crea sesión con mundo capitalismo", () => {
    const s = createSession({ startYear: 2028, startMonth: 3, stats: { dinero: 500 } });
    assert.equal(s.worldId, "capitalismo");
    assert.equal(s.player.stats.dinero, 500);
  });

  it("avanza mes y cambia etiqueta temporal", () => {
    let s = createSession({ startYear: 2028, startMonth: 3 });
    s = beginMonth(s, {}, () => 0);
    s = closeMonth(s);
    assert.equal(s.player.calendar.month, 4);
    assert.equal(s.history[0].from, "MARZO 2028");
    assert.equal(s.history[0].to, "ABRIL 2028");
  });

  it("resuelve decisión y aplica consecuencias", () => {
    let s = createSession({
      startYear: 2028,
      startMonth: 3,
      stats: { dinero: 0, maldad: 0 },
    });
    s = {
      ...s,
      player: { ...s.player, stage: "adultez", age: 30 },
      month: { kind: MONTH_KINDS.DECISION },
      pendingEvent: sampleCatalog.events[0],
      phase: "awaiting_decision",
    };
    s = decide(s, "a");
    assert.equal(s.player.stats.dinero, 100);
    assert.equal(s.player.stats.maldad, 2);
    s = closeMonth(s);
    assert.equal(s.player.calendar.month, 4);
  });

  it("HUD expone las 5 stats universales", () => {
    const hud = hudFromPlayer(createSession().player);
    assert.ok("salud" in hud && "felicidad" in hud && "dinero" in hud);
    assert.ok("influencia" in hud && "maldad" in hud);
  });

  it("playMonth con rng fijo puede cerrar mes tranquilo", () => {
    const s = playMonth(createSession(), {}, null, () => 0.01);
    assert.ok(s.history.length >= 1);
  });
});
