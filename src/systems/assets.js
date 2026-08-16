import { CARS, HOMES } from "../engine/constants.js";

export function homeName(tier) {
  return HOMES[tier] ?? "ninguna";
}

export function carName(tier) {
  return CARS[tier] ?? "ninguno";
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
