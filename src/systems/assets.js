import { CARS, HOMES } from "../engine/constants.js";

const HOME_LABELS = ["Sin casa", "Tu pieza", "Tu depto", "Tu casa", "Casa premium", "Tu mansión"];
const CAR_LABELS = ["A pie", "Tu primer auto", "Auto usado", "Auto nuevo", "Auto premium", "Auto de lujo"];

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
    const titles = ["", "¡Tu primer techo!", "¡Tu departamento!", "¡TU CASA!", "Casa que se nota", "La mansión"];
    const copies = [
      "",
      "Cierras la puerta. Eso ya es tuyo.",
      "Ya no es un sofá. Es TU depto.",
      "Por fin. El mantenimiento también te tiene a ti.",
      "Ahora el barrio te mira distinto.",
      "Llegaste. La cuenta de luz también.",
    ];
    return { title: titles[to] ?? homeLabel(to), copy: copies[to] ?? "Esto es tuyo." };
  }
  const titles = ["", "¡TU PRIMER COCHE!", "Ya es tuyo", "Huele a nuevo", "Ahora te ven", "Lujo con llave"];
  const copies = [
    "",
    "Ya no esperas el camión. Es TUYO.",
    "Ya no es nuevo. Pero es tuyo.",
    "El semáforo ya sabe quién eres.",
    "La foto queda bien. El taller también cobra.",
    "Bajas y la gente se da cuenta.",
  ];
  return { title: titles[to] ?? carLabel(to), copy: copies[to] ?? "Esto es tuyo." };
}
