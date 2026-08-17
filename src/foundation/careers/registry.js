import { CAREER_TIERS } from "../constants.js";

const careers = new Map();

export function registerCareer(def) {
  if (!def?.id) throw new Error("Carrera sin id");
  if (!CAREER_TIERS.includes(def.tier)) throw new Error("Tier de carrera inválido: " + def.tier);
  careers.set(def.id, { ...def });
  return def;
}

export function getCareer(id) {
  return careers.get(id) ?? null;
}

export function careersForWorld(worldId) {
  return [...careers.values()].filter((c) => c.worldId === worldId);
}

export function clearCareers() {
  careers.clear();
}
