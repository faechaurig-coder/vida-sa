import { AXIS_PLAYER } from "../content/present.js";

export function snap(run) {
  return {
    money: run.money,
    happiness: run.happiness,
    health: run.health,
    bonds: run.bonds,
    status: run.status,
    home: run.home,
    car: run.car,
    job: run.job,
    debt: run.debt,
    age: run.age,
  };
}

const FIELDS = [
  { key: "money", art: "money", label: "Dinero", money: true },
  { key: "happiness", art: "hap", label: "Ánimo" },
  { key: "health", art: "hp", label: "Salud" },
  { key: "bonds", art: "family", label: "Gente" },
  { key: "status", art: "spark", label: "Cómo te ven" },
  { key: "debt", art: "lock", label: "Deuda", money: true, invert: true },
];

export function juiceDeltas(before, after) {
  const out = [];
  for (const f of FIELDS) {
    const d = Math.round((after[f.key] ?? 0) - (before[f.key] ?? 0));
    if (!d) continue;
    const good = f.invert ? d < 0 : d > 0;
    out.push({
      key: f.key,
      art: f.art,
      label: f.label,
      delta: d,
      from: before[f.key],
      to: after[f.key],
      good,
      money: !!f.money,
    });
  }
  if (before.job !== after.job) {
    out.push({
      key: "job",
      art: "job",
      label: "Tu trabajo",
      text: after.job,
      good: true,
    });
  }
  return out;
}

export function juiceHero(deltas) {
  const money = deltas.find((d) => d.key === "money" || d.key === "dinero");
  if (money) {
    const sign = money.delta > 0 ? "+" : "";
    return {
      art: "money",
      text: sign + "$" + Math.abs(money.delta),
      tone: money.good ? "gain" : "loss",
    };
  }
  const first = deltas[0];
  if (!first) return { art: "spark", text: "Tu vida cambió", tone: "mix" };
  if (first.text) return { art: first.art, text: first.text, tone: "mix" };
  const sign = first.delta > 0 ? "+" : "";
  return {
    art: first.art,
    text: sign + first.delta,
    tone: first.good ? "gain" : "loss",
  };
}

export function juiceTone(deltas) {
  if (!deltas.length) return "mix";
  const goods = deltas.filter((d) => d.good).length;
  if (goods === deltas.length) return "gain";
  if (goods === 0) return "loss";
  return "mix";
}

export function juiceOutcomeEmoji(tone) {
  if (tone === "gain") return "😊";
  if (tone === "loss") return "😔";
  return "🤔";
}

export function juiceKicker(tone) {
  if (tone === "gain") return "¡Buena decisión!";
  if (tone === "loss") return "Tuvo sus costos";
  return "Vida en equilibrio";
}

export function deltaOutcomeEmoji(isUp) {
  return isUp ? "📈" : "📉";
}

export function formatMoney(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(Math.round(n));
}

const MOTOR_FIELDS = [
  { key: "salud", art: "hp", label: "Salud" },
  { key: "felicidad", art: "hap", label: "Felicidad" },
  { key: "dinero", art: "money", label: "Dinero", money: true },
  { key: "influencia", art: "spark", label: "Influencia" },
  { key: "maldad", art: "lock", label: "Maldad", invert: true },
];

export function snapMotor(player) {
  const s = player.stats;
  return {
    salud: s.salud,
    felicidad: s.felicidad,
    dinero: s.dinero,
    influencia: s.influencia,
    maldad: s.maldad,
    job: player.job,
  };
}

export function juiceMotorDeltas(before, after) {
  const out = [];
  for (const f of MOTOR_FIELDS) {
    const d = Math.round((after[f.key] ?? 0) - (before[f.key] ?? 0));
    if (!d) continue;
    const good = f.invert ? d < 0 : d > 0;
    out.push({
      key: f.key,
      art: f.art,
      label: f.label,
      delta: d,
      from: before[f.key],
      to: after[f.key],
      good,
      money: !!f.money,
    });
  }
  if (before.job !== after.job && after.job) {
    out.push({ key: "job", art: "job", label: "Trabajo", text: after.job, good: true });
  }
  return out;
}

export function monthTransitionLine(fromLabel, toLabel) {
  return toLabel || fromLabel;
}

export function axisLine(dominant, neglected) {
  const d = AXIS_PLAYER[dominant];
  const n = AXIS_PLAYER[neglected];
  return {
    high: (d?.icon ?? "") + " " + (d?.high ?? dominant),
    low: (n?.icon ?? "") + " " + (n?.low ?? neglected),
  };
}
