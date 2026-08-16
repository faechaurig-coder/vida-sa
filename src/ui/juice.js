import { AXIS_PLAYER, ICO } from "../content/present.js";

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
  { key: "money", icon: ICO.money, label: "Dinero", money: true },
  { key: "happiness", icon: ICO.hap, label: "Ánimo" },
  { key: "health", icon: ICO.hp, label: "Salud" },
  { key: "bonds", icon: ICO.family, label: "Gente" },
  { key: "status", icon: ICO.status, label: "Cómo te ven" },
  { key: "debt", icon: "📉", label: "Deuda", money: true, invert: true },
];

export function juiceDeltas(before, after) {
  const out = [];
  for (const f of FIELDS) {
    const d = Math.round((after[f.key] ?? 0) - (before[f.key] ?? 0));
    if (!d) continue;
    const good = f.invert ? d < 0 : d > 0;
    out.push({
      key: f.key,
      icon: f.icon,
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
      icon: ICO.job,
      label: "Tu trabajo",
      text: after.job,
      good: true,
    });
  }
  return out;
}

export function juiceHero(deltas) {
  const money = deltas.find((d) => d.key === "money");
  if (money) {
    const sign = money.delta > 0 ? "+" : "";
    return {
      icon: ICO.money,
      text: sign + "$" + Math.abs(money.delta),
      tone: money.good ? "gain" : "loss",
    };
  }
  const first = deltas[0];
  if (!first) return { icon: ICO.spark, text: "Tu vida cambió", tone: "mix" };
  if (first.text) return { icon: first.icon, text: first.text, tone: "mix" };
  const sign = first.delta > 0 ? "+" : "";
  return {
    icon: first.icon,
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

export function formatMoney(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(Math.round(n));
}

export function axisLine(dominant, neglected) {
  const d = AXIS_PLAYER[dominant];
  const n = AXIS_PLAYER[neglected];
  return {
    high: (d?.icon ?? "") + " " + (d?.high ?? dominant),
    low: (n?.icon ?? "") + " " + (n?.low ?? neglected),
  };
}
