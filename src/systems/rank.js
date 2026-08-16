import { AXES } from "../engine/constants.js";
import { homeName, carName } from "./assets.js";

function moneyAxis(money) {
  return Math.max(0, Math.min(100, Math.round((money + 100) / 8)));
}

export function axesOf(run) {
  return {
    dinero: moneyAxis(run.money),
    felicidad: run.happiness,
    salud: run.health,
    vinculos: run.bonds,
    estatus: run.status,
  };
}

const IDENTITY = {
  dinero: {
    felicidad: "KPI excelente. Humano pendiente.",
    salud: "Extracto sano. Cuerpo en mora.",
    vinculos: "Rico de agenda. Pobre de mesa.",
    estatus: "Dinero sin vitrina. El club no te llama.",
  },
  felicidad: {
    dinero: "Rico en domingo. Pobre en extracto.",
    salud: "Feliz y frágil.",
    vinculos: "Quería a todos. Se olvidó de sí.",
    estatus: "Risas en casa. Nadie en la foto oficial.",
  },
  salud: {
    dinero: "Cuerpo entero. Bolsillo en ayunas.",
    felicidad: "Sano y solo con su disciplina.",
    vinculos: "Se cuidó. No cuidó a nadie.",
    estatus: "Vitalidad sin marca.",
  },
  vinculos: {
    dinero: "Mesa llena. Cuenta en rojo.",
    felicidad: "Quería y no descansó.",
    salud: "Amó hasta el desgaste.",
    estatus: "Amado en privado. Invisible en público.",
  },
  estatus: {
    dinero: "Aplauso fiado.",
    felicidad: "Foto perfecta. Domingo vacío.",
    salud: "Imagen cara. Cuerpo barato.",
    vinculos: "Todos saben tu nombre. Nadie te espera.",
  },
};

export function computeRank(run) {
  const axes = axesOf(run);
  const sorted = AXES.slice().sort((a, b) => axes[b] - axes[a]);
  const dominant = sorted[0];
  const neglected = sorted[sorted.length - 1];
  const identity =
    IDENTITY[dominant]?.[neglected] ?? "Una vida. Varias facturas. Un acta firmada.";
  return {
    axes,
    dominant,
    neglected,
    identity,
    got: snapshotGot(run),
    sacrificed: snapshotSacrificed(run, dominant, neglected),
  };
}

function snapshotGot(run) {
  return [run.job, homeName(run.home), carName(run.car), run.partner ? "alguien en casa" : null]
    .filter(Boolean)
    .join(" · ");
}

function snapshotSacrificed(run, dominant, neglected) {
  if (neglected === "felicidad") return "el domingo";
  if (neglected === "salud") return "el cuerpo";
  if (neglected === "vinculos") return "a quien te esperaba";
  if (neglected === "dinero") return "el margen";
  if (dominant === "estatus") return "la calma";
  return "tiempo que no vuelve";
}

export function questionFor(run, rank, near) {
  if (near?.kind === "home") return "¿Y si ibas por el techo?";
  if (near?.kind === "study") return "¿Qué habría pasado si estudiabas?";
  if (near?.kind === "car") return "¿Y si no comprabas el estatus?";
  if (near?.kind === "bonds") return "¿Y si contestabas esa llamada?";
  if (rank.neglected === "felicidad") return "¿Y si priorizabas el domingo?";
  if (rank.dominant === "dinero") return "¿Y si no optimizabas el KPI?";
  return "¿Y si elegías la otra semilla?";
}
