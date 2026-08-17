import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGame, startMonth, resolveDecision, finishMonth } from "../../src/motor/loop.js";
import { pickEvent } from "../../src/motor/picker.js";
import { getCatalog } from "../../src/content/worlds/index.js";
import { renderLife } from "../../src/ui/render.js";

function playDecision(game, optionIndex = 0) {
  const ev = game.pendingEvent;
  assert.ok(ev, "debe haber evento pendiente");
  const opt = ev.options[optionIndex];
  assert.ok(opt, "opción válida");
  let next = resolveDecision(game, opt.id);
  assert.equal(next.phase, "showing_result");
  assert.equal(next.pendingEvent, null);
  next = finishMonth(next);
  assert.equal(next.phase, "idle");
  return startMonth(next);
}

describe("fase 7 · flujo de decisiones sin trabarse", () => {
  it("c_inf_escuela_amigo avanza al mes siguiente", () => {
    let g = startMonth(createGame({ worldId: "clasico", name: "Ana" }));
    while (g.pendingEvent?.id !== "c_inf_escuela_amigo") {
      g = playDecision(g);
    }
    assert.equal(g.pendingEvent.title, "El nuevo de la clase");
    const month = g.player.calendar.month;
    g = playDecision(g, 0);
    assert.ok(g.pendingEvent);
    assert.notEqual(g.pendingEvent.id, "c_inf_escuela_amigo");
    assert.ok(g.player.calendar.month !== month || g.player.calendar.year !== 2018);
  });

  it("todas las opciones de infancia resuelven sin error", () => {
    const catalog = getCatalog("clasico");
    const infancy = catalog.filter((e) => e.stage === "infancia");
    for (const ev of infancy) {
      let g = createGame({ worldId: "clasico" });
      g.pendingEvent = ev;
      g.phase = "awaiting_decision";
      for (const opt of ev.options) {
        const base = createGame({ worldId: "clasico" });
        base.pendingEvent = ev;
        base.phase = "awaiting_decision";
        const resolved = resolveDecision(base, opt.id);
        assert.equal(resolved.phase, "showing_result", ev.id + " / " + opt.id);
        assert.equal(resolved.pendingEvent, null);
      }
    }
  });

  it("renderLife muestra estado pendiente tras decidir", () => {
    const game = startMonth(createGame({ worldId: "clasico" }));
    const ui = { event: { id: game.pendingEvent.id, title: game.pendingEvent.title, body: "", category: "amistad", options: [] }, resolved: true };
    const html = renderLife(game, ui);
    assert.match(html, /decision-pending/);
    assert.match(html, /is-resolved/);
    assert.doesNotMatch(html, /data-act="opt"/);
  });

  it("no repite el mismo evento los 3 meses siguientes", () => {
    let g = startMonth(createGame({ worldId: "clasico" }));
    const first = g.pendingEvent.id;
    g = playDecision(g);
    const catalog = getCatalog("clasico");
    for (let i = 0; i < 3; i++) {
      const { event } = pickEvent(g, catalog, () => 0.99);
      assert.notEqual(event?.id, first, "mes " + (i + 1));
      g = playDecision(g);
    }
  });
});
