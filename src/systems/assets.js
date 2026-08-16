import { CARS, HOMES } from "../engine/constants.js";

const HOME_LABELS = ["Sin techo", "Pieza", "Depto.", "Casa", "Premium", "Lujo"];
const CAR_LABELS = ["A pie", "Básico", "Usado", "Nuevo", "Premium", "Lujo"];

export function homeName(tier) {
  return HOMES[tier] ?? "ninguna";
}

export function carName(tier) {
  return CARS[tier] ?? "ninguno";
}

export function homeLabel(tier) {
  return HOME_LABELS[tier] ?? "—";
}

export function carLabel(tier) {
  return CAR_LABELS[tier] ?? "—";
}

export function assetCopy(kind, to) {
  if (kind === "home") {
    return {
      title: homeName(to),
      copy: "Por fin tienes esto. El mantenimiento también te tiene a ti.",
    };
  }
  return {
    title: carName(to),
    copy: "El semáforo ya sabe quién eres. El taller, también.",
  };
}
