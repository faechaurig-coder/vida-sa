import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { STAT_KEYS } from "../../src/foundation/constants.js";
import { createStats } from "../../src/foundation/stats.js";
import { createGame, startMonth, resolveDecision, finishMonth, endLife, startNewLife, hudFromGame } from "../../src/motor/loop.js";
import { meetsRequirements } from "../../src/motor/requirements.js";
import { tickEconomy } from "../../src/motor/effects.js";
import {
  beginRelationship,
  setPartnerStatus,
  breakUp,
  reconcile,
  addChild,
  isChildPlayable,
  PARTNER_STATUS,
} from "../../src/motor/relationships/people.js";
import { addMemory, shouldRecordMemory, topMemories } from "../../src/motor/relationships/memories.js";
import { mergeGlobalLegacy, buildLifeSummary, sentenceFromFacts } from "../../src/motor/relationships/legacy.js";
import { getCatalog } from "../../src/content/worlds/index.js";
import { emptyMeta } from "../../src/systems/persist.js";

function force(game, eventId) {
  const ev = getCatalog(game.worldId).find((e) => e.id === eventId);
  assert.ok(ev, eventId);
  return { ...game, pendingEvent: ev, phase: "awaiting_decision" };
}

describe("fase 9 · familia, memoria y legado", () => {
  it("crea familia de origen", () => {
    const g = createGame({ worldId: "clasico" });
    assert.ok(g.player.family.origin.mother);
    assert.ok(g.player.family.origin.father);
    assert.equal(g.player.family.origin.mother.playable, false);
  });

  it("crear pareja / dating", () => {
    let p = createGame({ worldId: "clasico" }).player;
    p = beginRelationship(p, { name: "Luna Vega", traits: { empatia: 80 } });
    assert.equal(p.partner.active, true);
    assert.equal(p.family.partner.status, PARTNER_STATUS.DATING);
    assert.equal(p.family.partner.name, "Luna Vega");
  });

  it("cohabiting y matrimonio", () => {
    let p = beginRelationship(createGame({ worldId: "clasico" }).player, {});
    p = setPartnerStatus(p, PARTNER_STATUS.COHABITING);
    assert.ok(p.flags.includes("vive_con_pareja"));
    p = setPartnerStatus(p, PARTNER_STATUS.MARRIED);
    assert.equal(p.family.partner.status, "married");
    assert.ok(p.flags.includes("casado"));
  });

  it("separación y expareja", () => {
    let p = beginRelationship(createGame({ worldId: "clasico" }).player, { name: "Noah" });
    p = breakUp(p);
    assert.equal(p.partner, null);
    assert.equal(p.family.exPartners.length, 1);
    assert.equal(p.family.exPartners[0].status, "ex");
  });

  it("reconciliación", () => {
    let p = beginRelationship(createGame({ worldId: "clasico" }).player, {});
    p = breakUp(p);
    p = reconcile(p);
    assert.ok(p.partner?.active);
    assert.equal(p.family.partner.status, "dating");
  });

  it("infidelidad y descubrimiento diferido", () => {
    let g = createGame({ worldId: "clasico" });
    g.player = beginRelationship(g.player, {});
    const ev = getCatalog("clasico").find((e) => e.id === "c_uni_infidelidad");
    g = { ...g, pendingEvent: ev, phase: "awaiting_decision" };
    g = resolveDecision(g, "bajar");
    assert.ok(g.player.flags.includes("fue_infiel"));
    assert.ok(g.deferred.some((d) => d.id === "c_adu_descubierto"));
  });

  it("crear hijo y máximo 3", () => {
    let p = beginRelationship(createGame({ worldId: "clasico" }).player, {});
    p = addChild(p, { name: "A" });
    p = addChild(p, { name: "B" });
    p = addChild(p, { name: "C" });
    p = addChild(p, { name: "D" });
    assert.equal(p.family.children.length, 3);
    assert.equal(isChildPlayable(), false);
    assert.equal(p.family.children[0].playable, false);
  });

  it("eventos de hijo por edad", () => {
    const p = {
      stage: "adultez",
      age: 35,
      calendar: { year: 2040, month: 1 },
      stats: createStats(),
      flags: [],
      partner: { active: true, traits: {} },
      family: {
        origin: {},
        partner: { status: "married" },
        children: [{ birthYear: 2035, name: "A", playable: false }],
        exPartners: [],
      },
    };
    const caja = getCatalog("clasico").find((e) => e.id === "c_rel_hijo_caja");
    assert.equal(meetsRequirements(p, caja.requirements), true);
    p.family.children[0].birthYear = 2020;
    assert.equal(meetsRequirements(p, caja.requirements), false);
  });

  it("memoria importante y no trivial", () => {
    let p = createGame({ worldId: "clasico" }).player;
    p = addMemory(p, { text: "trivial", importance: 1, type: "moral" });
    assert.equal((p.memories ?? []).length, 0);
    assert.equal(shouldRecordMemory({ importance: 1 }), false);
    p = addMemory(p, { text: "Grande a los {age}", importance: 4, type: "family" });
    assert.equal(p.memories.length, 1);
    assert.ok(topMemories(p)[0].text.includes(String(p.age)));
  });

  it("eco: diferido de infidelidad existe en catálogo", () => {
    const ev = getCatalog("clasico").find((e) => e.id === "c_adu_descubierto");
    assert.ok(ev.requirements.requireFlags.includes("fue_infiel"));
  });

  it("pareja modifica consecuencias / rasgos filtran", () => {
    const ambicion = getCatalog("clasico").find((e) => e.id === "c_adu_pareja_ambicion");
    const low = {
      stage: "adultez",
      stats: createStats(),
      partner: { active: true, traits: { ambicion: 20, empatia: 50, carrino: 50, riesgo: 50 } },
      flags: [],
    };
    const high = { ...low, partner: { active: true, traits: { ambicion: 80, empatia: 50, carrino: 50, riesgo: 50 } } };
    assert.equal(meetsRequirements(low, ambicion.requirements), false);
    assert.equal(meetsRequirements(high, ambicion.requirements), true);
  });

  it("casa y coche desbloquean eventos", () => {
    const casa = getCatalog("clasico").find((e) => e.id === "c_adu_casa_vecinos");
    const coche = getCatalog("clasico").find((e) => e.id === "c_adu_coche_deportivo");
    assert.ok(casa.requirements.homeMin >= 1);
    assert.ok(coche.requirements.carMin >= 2);
    assert.equal(meetsRequirements({ stats: createStats(), home: 0, flags: [], partner: null }, casa.requirements), false);
  });

  it("negocio genera ingreso mensual", () => {
    const p = {
      stats: createStats({ dinero: 100 }),
      home: 0,
      car: 0,
      income: 0,
      expenses: 0,
      debt: 0,
      business: { id: "tienda", monthlyIncome: 40 },
    };
    const next = tickEconomy(p);
    assert.equal(next.stats.dinero, 140);
  });

  it("final de vida, resumen y nueva vida", () => {
    let g = createGame({ worldId: "clasico", name: "Alex" });
    g.player.age = 82;
    g.player.stats.dinero = 5000;
    g = endLife(g);
    assert.equal(g.ended, true);
    assert.ok(g.lifeSummary.sentence.length > 10);
    assert.equal(g.lifeSummary.age, 82);
    const meta = mergeGlobalLegacy(emptyMeta(), g.lifeSummary);
    assert.equal(meta.lives, 1);
    const n = startNewLife(g, meta, { worldId: "clasico", name: "Alex" });
    assert.equal(n.player.stats.dinero, 0);
    assert.equal(n.player.partner, null);
    assert.equal(n.player.family.children.length, 0);
    assert.equal(n.ended, false);
  });

  it("HUD conserva exactamente 5 stats", () => {
    const g = createGame({ worldId: "clasico" });
    const hud = hudFromGame(g);
    const keys = STAT_KEYS.filter((k) => k in hud);
    assert.deepEqual(STAT_KEYS, ["salud", "felicidad", "dinero", "influencia", "maldad"]);
    assert.equal(keys.length, 5);
    assert.equal("amor" in hud, false);
    assert.equal("vinculo" in hud, false);
  });

  it("persistencia conserva familia", () => {
    let p = beginRelationship(createGame({ worldId: "clasico" }).player, { name: "Camila" });
    p = addChild(p, { name: "Leo" });
    const round = JSON.parse(JSON.stringify({ player: p }));
    assert.equal(round.player.family.partner.name, "Camila");
    assert.equal(round.player.family.children[0].name, "Leo");
    assert.equal(round.player.family.children[0].playable, false);
  });

  it("meta permanece y legado se copia", () => {
    const summary = buildLifeSummary(createGame({ worldId: "clasico" }).player);
    const meta = mergeGlobalLegacy({ ...emptyMeta(), pv: 12, maxHome: 2 }, { ...summary, homes: 1 });
    assert.equal(meta.pv, 12);
    assert.equal(meta.maxHome, 2);
    assert.equal(meta.lives, 1);
  });

  it("sin pareja no hay eventos hasPartner", () => {
    const p = createGame({ worldId: "clasico" }).player;
    const ev = getCatalog("clasico").find((e) => e.id === "c_rel_distante");
    assert.equal(meetsRequirements(p, ev.requirements), false);
  });

  it("conocer pareja vía evento", () => {
    let g = createGame({ worldId: "clasico" });
    g.player.stage = "adolescencia";
    g.player.age = 15;
    g = force(g, "c_ado_conocer");
    g = resolveDecision(g, "si");
    assert.ok(g.player.partner?.active);
  });

  it("frase de legado no es genérica vacía", () => {
    const s = sentenceFromFacts({ family: "family", business: true, musicLeft: true });
    assert.match(s, /familia/i);
    assert.match(s, /negocio|música/i);
  });
});
