import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { getCatalog, getWorldMissions } from "../../src/content/worlds/index.js";
import { CLASSIC_COLLECTIBLES } from "../../src/content/worlds/clasico/meta.js";
import { validateCatalog } from "../../src/content/catalog/schema.js";
import { EVENT_KINDS } from "../../src/content/catalog/taxonomy.js";
import { createGame, startMonth, resolveDecision, finishMonth } from "../../src/motor/loop.js";
import { checkMissionProgress, missionsView } from "../../src/motor/missions.js";
import { STORY_DEFS } from "../../src/content/stories/definitions.js";

describe("fase 7 · capítulo 1 clásico", () => {
  it("catálogo clásico cumple mínimos del capítulo 1", () => {
    const events = getCatalog("clasico");
    assert.equal(validateCatalog(events, { worldId: "clasico" }).length, 0);
    assert.ok(events.length >= 90);

    const normal = events.filter((e) => e.kind === EVENT_KINDS.NORMAL);
    const important = events.filter((e) => e.kind === EVENT_KINDS.IMPORTANT);
    const opportunity = events.filter((e) => e.category === "oportunidad");
    const story = events.filter((e) => e.kind === EVENT_KINDS.STORY);
    const special = events.filter((e) => e.kind === EVENT_KINDS.SPECIAL);

    assert.ok(normal.length >= 40);
    assert.ok(important.length >= 10);
    assert.ok(opportunity.length >= 15);
    assert.ok(story.length >= 25);
    assert.ok(special.length >= 8);
  });

  it("cada historia tiene al menos 5 eventos", () => {
    const events = getCatalog("clasico");
    for (const id of Object.keys(STORY_DEFS)) {
      const count = events.filter((e) => e.storyId === id).length;
      assert.ok(count >= 5, id + " tiene " + count + " eventos");
    }
  });

  it("eventos tienen resultText en al menos una opción", () => {
    const events = getCatalog("clasico");
    const withNarrative = events.filter((e) =>
      e.options.some((o) => o.resultText || o.hook),
    );
    assert.ok(withNarrative.length >= events.length * 0.8);
  });

  it("mundo clásico tiene misiones y colección", () => {
    const missions = getWorldMissions("clasico");
    assert.equal(missions.length, 5);
    assert.ok(CLASSIC_COLLECTIBLES.house.length === 5);
    assert.ok(CLASSIC_COLLECTIBLES.vehicle.length === 5);
    assert.ok(CLASSIC_COLLECTIBLES.special.length === 3);
  });

  it("misión de primer trabajo se completa al conseguir empleo", () => {
    let game = createGame({ worldId: "clasico" });
    game.player.job = "Ayudante";
    game = checkMissionProgress(game);
    assert.ok(game.missions.completed.includes("primer_trabajo"));
  });

  it("arco cantante llega a fama sin romper el motor", () => {
    let g = createGame({ worldId: "clasico", name: "Luna" });
    const steps = [
      ["c_inf_musica", "clases"],
      ["c_inf_musica_escuela", "presentar"],
      ["c_uni_cantante_juegos", "cantar"],
      ["c_uni_cantante_productor", "demo"],
      ["c_adu_cantante_primer_show", "show"],
      ["c_adu_cantante_contrato", "firmar"],
      ["c_adu_cantante_fama", "aceptar"],
    ];
    for (const [eventId, optId] of steps) {
      const ev = getCatalog("clasico").find((e) => e.id === eventId);
      assert.ok(ev, "falta evento " + eventId);
      g = { ...g, pendingEvent: ev, phase: "awaiting_decision", player: { ...g.player, stage: ev.stage, age: ev.stage === "adultez" ? 28 : ev.stage === "universidad" ? 20 : 9 } };
      if (eventId === "c_inf_musica") {
        g.player.flags = [];
        g.player.stories = {};
      }
      g = resolveDecision(g, optId);
      g = finishMonth(g);
    }
    assert.equal(g.player.fame?.line, "cantante");
    assert.equal(g.player.careerId, "cantante");
  });

  it("vista de misiones clásicas muestra objetivo actual", () => {
    const game = createGame({ worldId: "clasico" });
    const view = missionsView(game);
    assert.equal(view.current?.id, "primer_trabajo");
    assert.match(view.current?.title, /primer paso/i);
  });
});
