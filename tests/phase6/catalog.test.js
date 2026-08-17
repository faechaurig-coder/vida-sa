import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  defineEvent,
  validateCatalog,
  normalizeEvent,
  stagesWithEvents,
} from "../../src/content/catalog/schema.js";
import {
  CONTENT_CATEGORIES,
  EVENT_KINDS,
  LIFE_STAGE_IDS,
  normalizeCategory,
} from "../../src/content/catalog/taxonomy.js";
import {
  buildCatalogIndex,
  buildContentMatrix,
  lookupEvents,
  matrixSummary,
} from "../../src/content/catalog/matrix.js";
import { buildWorldCatalog } from "../../src/content/catalog/index.js";
import { getCatalog, CATALOGS, getContentMatrix } from "../../src/content/worlds/index.js";
import { filterEligible } from "../../src/motor/requirements.js";
import { registerEventPlayed, pickEvent } from "../../src/motor/picker.js";
import { createGame, startMonth, resolveDecision, finishMonth } from "../../src/motor/loop.js";
import { STORY_DEFS } from "../../src/content/stories/definitions.js";

describe("fase 6 · catálogo de contenido", () => {
  it("defineEvent exige worldId y normaliza categoría", () => {
    const ev = defineEvent({
      id: "test",
      worldId: "clasico",
      stage: "infancia",
      category: "social",
      title: "Test",
      options: [{ id: "a", text: "A", effects: {} }],
    });
    assert.equal(ev.category, "amistad");
    assert.equal(ev.kind, EVENT_KINDS.NORMAL);
    assert.equal(ev.requirements.stage, "infancia");
  });

  it("catálogo clásico valida sin errores", () => {
    const cat = CATALOGS.clasico;
    assert.equal(validateCatalog(cat.events, { worldId: "clasico" }).length, 0);
    assert.equal(cat.events.length, 25);
  });

  it("catálogo capitalismo incluye 11 legacy + hint", () => {
    const cat = CATALOGS.capitalismo;
    assert.equal(validateCatalog(cat.events, { worldId: "capitalismo" }).length, 0);
    assert.equal(cat.events.length, 12);
    assert.ok(cat.events.every((e) => e.kind === EVENT_KINDS.WORLD || e.kind === EVENT_KINDS.IMPORTANT));
  });

  it("índice WORLD → STAGE → CATEGORY localiza eventos", () => {
    const index = CATALOGS.clasico.index;
    const ids = lookupEvents(index, "clasico", "infancia", "familia");
    assert.ok(ids.includes("c_inf_familia_cena"));
  });

  it("matriz resume eventos por etapa y tipo", () => {
    const summary = CATALOGS.clasico.summary;
    assert.ok(summary.total >= 25);
    assert.ok(summary.byStage.infancia >= 5);
    assert.ok(summary.byKind.story >= 5);
    assert.equal(summary.stories.length, 5);
  });

  it("filtra eventos por etapa vía requirements", () => {
    const catalog = getCatalog("clasico");
    const player = createGame({ worldId: "clasico" }).player;
    player.stage = "infancia";
    player.age = 8;
    const eligible = filterEligible(catalog, player);
    assert.ok(eligible.every((e) => e.requirements?.stage === "infancia" || e.stage === "infancia"));
    assert.ok(!eligible.some((e) => e.id === "c_adu_trabajo_extra"));
  });

  it("historia cantante requiere flag clases_musica en universidad", () => {
    const ev = getCatalog("clasico").find((e) => e.id === "c_uni_cantante_juegos");
    const sinFlag = createGame({ worldId: "clasico" }).player;
    sinFlag.stage = "universidad";
    const conFlag = { ...sinFlag, flags: ["clases_musica"] };
    assert.equal(filterEligible([ev], sinFlag).length, 0);
    assert.equal(filterEligible([ev], conFlag).length, 1);
  });

  it("cooldown impide repetición inmediata", () => {
    let session = createGame({ worldId: "clasico" });
    session = registerEventPlayed(session, "c_inf_familia_cena", 6);
    assert.equal(session.cooldowns.c_inf_familia_cena, 6);
    const catalog = getCatalog("clasico");
    const pool = catalog.filter((e) => {
      const cd = session.cooldowns?.[e.id] ?? 0;
      return cd <= 0;
    });
    assert.ok(!pool.some((e) => e.id === "c_inf_familia_cena"));
  });

  it("eventos recientes reducen peso en picker", () => {
    const session = {
      ...createGame({ worldId: "clasico" }),
      recentEvents: ["c_inf_familia_cena"],
    };
    const catalog = getCatalog("clasico");
    const player = { ...session.player, stage: "infancia", age: 8 };
    const picked = pickEvent({ ...session, player }, catalog, () => 0.99);
    assert.notEqual(picked.event?.id, "c_inf_familia_cena");
  });

  it("eventos de historia tienen storyId y kind story", () => {
    const stories = getCatalog("clasico").filter((e) => e.kind === EVENT_KINDS.STORY);
    assert.equal(stories.length, 9);
    assert.ok(stories.every((e) => e.storyId && STORY_DEFS[e.storyId]));
  });

  it("transición mensual sigue requiriendo decisión", () => {
    let g = startMonth(createGame({ worldId: "clasico" }));
    const opt = g.pendingEvent.options[0].id;
    g = resolveDecision(g, opt);
    assert.equal(g.phase, "showing_result");
    g = finishMonth(g);
    g = startMonth(g);
    assert.equal(g.phase, "awaiting_decision");
    assert.ok(g.pendingEvent);
  });

  it("categorías canónicas son exactamente 10", () => {
    assert.equal(CONTENT_CATEGORIES.length, 10);
    for (const ev of CATALOGS.clasico.events) {
      assert.ok(CONTENT_CATEGORIES.includes(ev.category), ev.id);
    }
  });

  it("etapas de vida son 5", () => {
    assert.equal(LIFE_STAGE_IDS.length, 5);
    const counts = stagesWithEvents(CATALOGS.clasico.events);
    assert.ok(counts.infancia > 0);
    assert.ok(counts.madurez > 0);
  });

  it("getContentMatrix exporta filas ordenadas", () => {
    const matrix = getContentMatrix("capitalismo");
    assert.equal(matrix.length, 12);
    assert.ok(matrix[0].world === "capitalismo");
  });
});
