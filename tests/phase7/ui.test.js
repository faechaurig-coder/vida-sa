import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGame, startMonth, resolveDecision, finishMonth, eventForUI, hudFromGame } from "../../src/motor/loop.js";
import {
  occupationForPlayer,
  fameForPlayer,
  partnerForPlayer,
  lifeIdentity,
  vitalsForHud,
  allStats,
  stageLabel,
} from "../../src/ui/life-view.js";
import { renderLife } from "../../src/ui/render.js";
import { renderBottomNav, renderStories, renderCollection, renderMissions } from "../../src/ui/render-progress.js";
import { juiceHero } from "../../src/ui/juice.js";

function childGame(extra = {}) {
  return createGame({ worldId: "clasico", name: "Ana", ...extra });
}

describe("fase 7 · experiencia de juego", () => {
  it("etapa visible sigue la edad real, no la del evento", () => {
    const game = startMonth(childGame());
    assert.equal(game.player.stage, "infancia");
    assert.ok(game.player.age < 12);
    const id = lifeIdentity(game.player, "clasico");
    assert.equal(id.stageLabel, "Infancia");
    const html = renderLife(game, { event: eventForUI(game.pendingEvent) });
    assert.match(html, /event-cat/);
    assert.doesNotMatch(html, />Adultez</);
    assert.doesNotMatch(html, /stage-pill/);
  });

  it("no muestra profesión adulta en infancia", () => {
    const player = childGame().player;
    player.job = "Artista";
    player.careerId = "cantante";
    player.stage = "infancia";
    player.age = 9;
    assert.equal(occupationForPlayer(player), "Estudiante");
    const id = lifeIdentity(player, "clasico");
    assert.equal(id.occupation, "Estudiante");
    assert.equal(id.career, null);
  });

  it("muestra trabajo en adultez cuando existe", () => {
    const player = childGame().player;
    player.stage = "adultez";
    player.age = 27;
    player.job = "Artista";
    player.careerId = "cantante";
    assert.equal(occupationForPlayer(player), "Artista");
    assert.equal(lifeIdentity(player, "clasico").career?.tierLabel, "Especial");
  });

  it("fama solo aparece cuando está desbloqueada", () => {
    const player = childGame().player;
    assert.equal(fameForPlayer(player), null);
    player.fame = { line: "cantante", level: 1 };
    assert.equal(fameForPlayer(player).label, "Fama");
  });

  it("pareja solo aparece cuando existe", () => {
    const player = childGame().player;
    assert.equal(partnerForPlayer(player), null);
    player.partner = { active: true, traits: {} };
    assert.equal(partnerForPlayer(player).label, "Relación");
  });

  it("los 5 stats canónicos están representados", () => {
    const stats = createGame().player.stats;
    const all = allStats(stats);
    assert.deepEqual(
      all.map((s) => s.key),
      ["salud", "felicidad", "dinero", "influencia", "maldad"],
    );
    const vitals = vitalsForHud(stats);
    assert.equal(vitals.length, 4);
    assert.ok(vitals.every((v) => v.emoji));
    assert.ok(all.find((s) => s.key === "dinero").emoji === "💰");
    assert.ok(all.find((s) => s.key === "influencia").emoji === "👑");
    assert.ok(all.find((s) => s.key === "maldad").emoji === "😈");
  });

  it("navegación tiene etiquetas escritas", () => {
    const html = renderBottomNav("life");
    assert.match(html, /Vida/);
    assert.match(html, /Historias/);
    assert.match(html, /Colección/);
    assert.match(html, /Misiones/);
    assert.match(html, /is-on/);
  });

  it("historias ocultan nombres bloqueados", () => {
    const game = childGame();
    const html = renderStories(game);
    assert.match(html, /\?\?\?/);
    assert.doesNotMatch(html, /Cantante/);
  });

  it("colección marca objetos especiales ocultos", () => {
    const game = createGame({ worldId: "capitalismo" });
    const html = renderCollection(game);
    assert.match(html, /Objeto especial/);
    assert.doesNotMatch(html, /Baño de oro/);
  });

  it("misiones muestran objetivo actual", () => {
    const game = createGame({ worldId: "capitalismo" });
    const html = renderMissions(game);
    assert.match(html, /primer millón/i);
    assert.match(html, /MISIÓN ACTUAL/);
  });

  it("evento pendiente se conserva al pintar vida", () => {
    const game = startMonth(childGame());
    const id = game.pendingEvent.id;
    const html = renderLife(game, { event: eventForUI(game.pendingEvent) });
    assert.match(html, new RegExp(game.pendingEvent.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.equal(game.pendingEvent.id, id);
    assert.equal(game.phase, "awaiting_decision");
  });

  it("transición mensual sigue exigiendo decisión", () => {
    let g = startMonth(childGame());
    const month = g.player.calendar.month;
    g = resolveDecision(g, g.pendingEvent.options[0].id);
    assert.equal(g.phase, "showing_result");
    g = finishMonth(g);
    assert.equal(g.player.calendar.month, month === 12 ? 1 : month + 1);
    g = startMonth(g);
    assert.ok(g.pendingEvent);
  });

  it("HUD del motor expone etapa del jugador", () => {
    const game = startMonth(childGame());
    const h = hudFromGame(game);
    assert.equal(h.stage, game.player.stage);
    assert.equal(stageLabel(h.stage), "Infancia");
    assert.ok(h.salud != null && h.felicidad != null && h.dinero != null);
    assert.ok(h.influencia != null && h.maldad != null);
  });

  it("juice prioriza dinero también con clave canónica", () => {
    const hero = juiceHero([{ key: "dinero", delta: 90, good: true, money: true }]);
    assert.match(hero.text, /\+\$90/);
  });

  it("eventForUI expone categoría para la tarjeta", () => {
    const game = startMonth(childGame());
    const ui = eventForUI(game.pendingEvent);
    assert.ok(ui.category);
    assert.ok(ui.title);
  });
});
