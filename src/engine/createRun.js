import { getSeed } from "../content/seeds.js";

export function createRun(seedId) {
  const seed = getSeed(seedId);
  if (!seed) throw new Error("Semilla desconocida: " + seedId);
  const s = seed.start;
  return {
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
  };
}
