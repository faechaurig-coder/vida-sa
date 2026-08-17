import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGame, startMonth } from "../src/motor/loop.js";
import { hasActiveSession, sessionPreview, sessionPreviewFromSave } from "../src/systems/session.js";
import { renderBoot } from "../src/ui/render.js";
import { emptyMeta } from "../src/systems/persist.js";

describe("sesión · continuar / nueva partida", () => {
  it("detecta una partida activa", () => {
    const game = startMonth(createGame({ worldId: "clasico", name: "Ana" }));
    assert.equal(hasActiveSession({ motorGame: game }), true);
    assert.equal(hasActiveSession(null), false);
    assert.equal(hasActiveSession({}), false);
  });

  it("arma un resumen para Continuar", () => {
    const game = startMonth(createGame({ worldId: "clasico", name: "Ana" }));
    const preview = sessionPreview(game);
    assert.equal(preview.name, "Ana");
    assert.equal(preview.worldName, "Clásico");
    assert.equal(preview.stageLabel, "Infancia");
    assert.ok(preview.monthYear);
    assert.ok(preview.eventTitle);
  });

  it("el menú muestra Continuar si hay guardado", () => {
    const game = startMonth(createGame({ worldId: "clasico", name: "Ana" }));
    const html = renderBoot(emptyMeta(), sessionPreview(game), false);
    assert.match(html, /Continuar/);
    assert.match(html, /Nueva partida/);
    assert.match(html, /Ana/);
    assert.doesNotMatch(html, />EMPEZAR</);
  });

  it("sin guardado muestra Empezar", () => {
    const html = renderBoot(emptyMeta(), null, false);
    assert.match(html, /EMPEZAR/);
    assert.doesNotMatch(html, /Continuar/);
  });

  it("pide confirmación antes de borrar la vida", () => {
    const game = startMonth(createGame({ worldId: "clasico", name: "Ana" }));
    const html = renderBoot(emptyMeta(), sessionPreview(game), true);
    assert.match(html, /Empezar de cero/);
    assert.match(html, /Cancelar/);
  });

  it("sessionPreviewFromSave no inventa partida", () => {
    assert.equal(sessionPreviewFromSave(null), null);
    assert.equal(sessionPreviewFromSave({ motorGame: { pendingEvent: {} } }), null);
  });
});
