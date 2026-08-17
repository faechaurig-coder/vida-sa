/**
 * Puente de referencia — mapea el vertical slice legacy al modelo Fase 1.
 * No reemplaza el motor actual; sirve para migración futura de contenido.
 */
import { createStats } from "../stats.js";
import { createCalendar } from "../time.js";
import { stageForAge } from "../stages.js";

export function legacyRunToFoundation(run) {
  const birthYear = new Date().getFullYear() - run.age;
  return {
    worldId: "capitalismo",
    birth: createCalendar(birthYear, 1),
    calendar: createCalendar(new Date().getFullYear(), new Date().getMonth() + 1),
    age: run.age,
    stage: mapLegacyStage(run.stage),
    stats: createStats({
      salud: run.health,
      felicidad: run.happiness,
      dinero: run.money,
      influencia: run.status,
      maldad: 0,
    }),
    job: run.job,
    partner: run.partner ? { active: true, traits: { empatia: 50, carrino: 50, ambicion: 50, riesgo: 50 } } : null,
    flags: [...run.flags],
    legacy: {
      seedId: run.seedId,
      bonds: run.bonds,
      home: run.home,
      car: run.car,
      debt: run.debt,
      income: run.income,
      expenses: run.expenses,
    },
  };
}

function mapLegacyStage(stage) {
  const table = {
    formacion: "adolescencia",
    arranque: "universidad",
    construccion: "adultez",
    costo: "adultez",
    balance: "adultez",
  };
  return table[stage] ?? stageForAge(16);
}

export function foundationToLegacyStats(stats) {
  return {
    health: stats.salud,
    happiness: stats.felicidad,
    money: stats.dinero,
    status: stats.influencia,
  };
}
