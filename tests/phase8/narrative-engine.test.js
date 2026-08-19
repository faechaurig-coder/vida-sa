import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createStats } from "../../src/foundation/stats.js";
import { createPartner } from "../../src/foundation/relationships/partner.js";
import { createGame, startMonth, resolveDecision, finishMonth, eventForUI } from "../../src/motor/loop.js";
import { meetsRequirements, filterEligible } from "../../src/motor/requirements.js";
import { pickEvent, isPlayable, registerEventPlayed } from "../../src/motor/picker.js";
import { ageDeferred, scheduleDeferred } from "../../src/motor/narrative/deferred.js";
import { explainEventEligibility } from "../../src/motor/narrative/debug.js";
import { visibleEffectsForOption } from "../../src/motor/narrative/visibility.js";
import { simulatePicks, createRng } from "../../src/motor/narrative/simulate.js";
import { validateCatalogDeep } from "../../src/content/catalog/validate.js";
import { getCatalog } from "../../src/content/worlds/index.js";
import { FIXTURE_EVENTS } from "../../src/content/fixtures/narrative-v2.js";

function player(overrides = {}) {
  return {
    stage: "adultez",
    age: 25,
    stats: createStats({ dinero: 1000, influencia: 50, maldad: 10, salud: 80, felicidad: 70 }),
    flags: [],
    decisions: [],
    decisionHistory: [],
    stories: {},
    job: null,
    partner: null,
    home: 0,
    car: 0,
    houseId: null,
    carId: null,
    business: null,
    relationships: {},
    calendar: { year: 2026, month: 1 },
    ...overrides,
  };
}

function ev(id) {
  return FIXTURE_EVENTS.find((e) => e.id === id);
}

describe("Motor narrativo V2", () => {
  it("1. evento con 2 opciones", () => {
    assert.equal(ev("fx_two_opts").options.length, 2);
  });

  it("2. evento con 3 opciones", () => {
    assert.equal(ev("fx_three_opts").options.length, 3);
  });

  it("3. evento con 4 opciones", () => {
    assert.equal(ev("fx_four_opts").options.length, 4);
  });

  it("4. requisito por edad", () => {
    assert.equal(meetsRequirements(player({ age: 20 }), ev("fx_age_gate").requirements), false);
    assert.equal(meetsRequirements(player({ age: 35 }), ev("fx_age_gate").requirements), true);
  });

  it("5. requisito por dinero", () => {
    const p = player({ stats: createStats({ dinero: 6000 }) });
    assert.equal(meetsRequirements(p, ev("fx_money_gate").requirements), true);
  });

  it("6. requisito por flag", () => {
    assert.equal(meetsRequirements(player(), ev("fx_flag_gate").requirements), false);
    assert.equal(
      meetsRequirements(player({ flags: ["fx_test_flag"] }), ev("fx_flag_gate").requirements),
      true,
    );
  });

  it("7. requisito por pareja", () => {
    const withPartner = player({ partner: createPartner({}) });
    assert.equal(meetsRequirements(withPartner, ev("fx_partner_gate").requirements), true);
  });

  it("8. requisito por coche", () => {
    assert.equal(meetsRequirements(player({ car: 2 }), ev("fx_car_gate").requirements), true);
  });

  it("9. requisito por casa", () => {
    assert.equal(meetsRequirements(player({ home: 2 }), ev("fx_house_gate").requirements), true);
  });

  it("10. requisito por influencia", () => {
    const p = player({ stats: createStats({ influencia: 45 }) });
    assert.equal(meetsRequirements(p, ev("fx_influence_gate").requirements), true);
  });

  it("11. requisito por maldad", () => {
    const p = player({ stats: createStats({ maldad: 35 }) });
    assert.equal(meetsRequirements(p, ev("fx_evil_gate").requirements), true);
  });

  it("12. consecuencia inmediata", () => {
    let game = createGame({ worldId: "clasico" });
    game = { ...game, pendingEvent: ev("fx_immediate"), phase: "awaiting_decision" };
    const before = game.player.stats.salud;
    game = resolveDecision(game, "ok");
    assert.equal(game.player.stats.salud, before + 10);
  });

  it("13. consecuencia diferida", () => {
    let game = createGame({ worldId: "clasico" });
    game = {
      ...game,
      pendingEvent: ev("fx_deferred_follow"),
      phase: "awaiting_decision",
      player: { ...game.player, stage: "adultez", age: 30 },
    };
    game = resolveDecision(game, "invest");
    assert.ok(game.deferred.some((d) => d.id === "fx_deferred_payoff"));

    game = ageDeferred(game);
    game = ageDeferred(game);
    const { event, source } = pickEvent({ ...game, catalog: FIXTURE_EVENTS }, FIXTURE_EVENTS);
    assert.equal(event?.id, "fx_deferred_payoff");
    assert.equal(source, "deferred");
  });

  it("14. activar flag", () => {
    let game = createGame({ worldId: "clasico" });
    game = { ...game, pendingEvent: ev("fx_flag_add"), phase: "awaiting_decision" };
    game = resolveDecision(game, "set");
    assert.ok(game.player.flags.includes("fx_activated"));
  });

  it("15. eliminar flag", () => {
    let game = createGame({ worldId: "clasico", flags: ["fx_activated"] });
    game = { ...game, pendingEvent: ev("fx_flag_remove"), phase: "awaiting_decision" };
    game = resolveDecision(game, "clear");
    assert.ok(!game.player.flags.includes("fx_activated"));
  });

  it("16. iniciar historia", () => {
    let game = createGame({ worldId: "clasico" });
    game = {
      ...game,
      pendingEvent: ev("fx_story_start"),
      phase: "awaiting_decision",
      player: { ...game.player, stage: "adolescencia" },
    };
    game = resolveDecision(game, "begin");
    assert.ok(game.player.stories.fx_story?.discovered);
    assert.ok(game.player.flags.includes("fx_story_on"));
  });

  it("17. continuar historia", () => {
    const eligible = filterEligible(
      [ev("fx_story_continue")],
      player({ flags: ["fx_story_on"], stories: { fx_story: { discovered: true, discoveredChapters: [1] } } }),
    );
    assert.equal(eligible.length, 1);
  });

  it("18. evento sorpresa", () => {
    const surprise = ev("fx_surprise");
    const p = player({
      partner: createPartner({}),
      car: 2,
      stats: createStats({ dinero: 200, influencia: 60 }),
    });
    assert.equal(meetsRequirements(p, surprise.requirements), true);
    assert.equal(surprise.kind, "surprise");
  });

  it("19. cooldown", () => {
    const session = { player: player(), cooldowns: { fx_cooldown: 3 }, recentEvents: [], seenExclusive: [] };
    assert.equal(isPlayable(ev("fx_cooldown"), session.player, session), false);
  });

  it("20. recentEvents", () => {
    const session = {
      player: player(),
      cooldowns: {},
      recentEvents: ["fx_cooldown", "fx_exclusive"],
      seenExclusive: [],
    };
    assert.equal(isPlayable(ev("fx_cooldown"), session.player, session), false);
  });

  it("21. evento exclusivo", () => {
    const session = {
      player: player(),
      cooldowns: {},
      recentEvents: [],
      seenExclusive: ["fx_exclusive"],
    };
    assert.equal(isPlayable(ev("fx_exclusive"), session.player, session), false);
  });

  it("22. trade-off", () => {
    const opt = ev("fx_tradeoff").options.find((o) => o.id === "money");
    assert.ok(opt.effects.dinero > 0);
    assert.ok(opt.effects.felicidad < 0);
  });

  it("23. información incompleta", () => {
    const hidden = ev("fx_ambiguous").options.find((o) => o.id === "trust");
    const partial = ev("fx_ambiguous").options.find((o) => o.id === "research");
    assert.deepEqual(visibleEffectsForOption(hidden), {});
    assert.ok("dinero" in visibleEffectsForOption(partial));
    assert.ok(!("felicidad" in visibleEffectsForOption(partial)));
  });

  it("24. diversidad de categorías", () => {
    const session = {
      player: player(),
      cooldowns: {},
      recentEvents: [],
      recentCategories: ["escuela", "escuela"],
      seenExclusive: [],
    };
    const pool = FIXTURE_EVENTS.filter((e) => isPlayable(e, session.player, session));
    const { event } = pickEvent({ ...session, catalog: pool }, pool, createRng(99));
    assert.ok(event);
    assert.notEqual(event.category, "escuela");
  });

  it("25. persistencia del historial", () => {
    let game = createGame({ worldId: "clasico" });
    game = { ...game, pendingEvent: ev("fx_immediate"), phase: "awaiting_decision" };
    game = resolveDecision(game, "ok");
    assert.equal(game.player.decisionHistory.length, 1);
    assert.equal(game.player.decisions[0], "fx_immediate:ok");
    assert.equal(game.player.decisionHistory[0].eventId, "fx_immediate");
  });

  it("debug: explica elegibilidad", () => {
    const game = createGame({ worldId: "clasico" });
    const report = explainEventEligibility(getCatalog("clasico")[0], game, getCatalog("clasico"));
    assert.ok(report.checks.length >= 4);
    assert.ok(report.summary);
  });

  it("validación profunda del catálogo clásico", () => {
    const catalog = getCatalog("clasico");
    const { valid, errors } = validateCatalogDeep(catalog);
    assert.equal(valid, true, errors.join("; "));
  });

  it("mundos clásico y capitalismo siguen teniendo eventos", () => {
    assert.ok(getCatalog("clasico").length > 50);
    assert.ok(getCatalog("capitalismo").length > 10);
  });

  it("diferido tipo effects aplica al vencer", () => {
    let session = {
      player: player({ stats: createStats({ dinero: 100 }) }),
      deferred: scheduleDeferred([], { type: "effects", after: 1, effects: { dinero: 50 } }),
    };
    session = ageDeferred(session);
    assert.equal(session.player.stats.dinero, 150);
    assert.equal(session.deferred.length, 0);
  });
});
