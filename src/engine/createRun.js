import { getSeed } from "../content/seeds.js";
import { applyPerkToRun } from "../systems/perks.js";

export function createRun(seedId, equipped = null) {
  const seed = getSeed(seedId);
  if (!seed) throw new Error("Semilla desconocida: " + seedId);
  const s = seed.start;
  let run = {
    seedId,
    age: s.age,
    stage: "formacion",
    stageCards: 0,
    money: s.money,
    income: s.income,
    expenses: s.expenses,
    happiness: s.happiness,
    health: s.health,
    bonds: s.bonds,
    status: s.status,
    job: s.job,
    home: s.home,
    car: s.car,
    debt: s.debt,
    partner: false,
    flags: [...s.flags],
    seen: [],
    deferred: [],
    log: [],
    currentEventId: null,
    punchline: "",
    ended: false,
    collapse: false,
    cardsPlayed: 0,
    collapseMoney: null,
    equippedPerk: null,
  };
  if (equipped?.id && equipped.tier > 0) {
    run = applyPerkToRun(run, equipped.id, equipped.tier);
  }
  return run;
}
