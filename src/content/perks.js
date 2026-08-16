/** Comodines del vertical slice. Schema DATA; valores en balance. */

export const PERKS = [
  {
    id: "colchon",
    name: "Colchón",
    tagline: "Más liquidez al firmar. El estilo de vida llega después.",
    category: "start",
    cannot: ["abrir mundos", "saltar Costo", "borrar deuda"],
    tiers: {
      1: { money: 70 },
      2: { money: 140, happiness: -4 },
      3: { money: 200, happiness: -6, expenses: 3 },
    },
  },
  {
    id: "contacto",
    name: "Contacto",
    tagline: "Alguien te abre una puerta. La comisión es social.",
    category: "chance",
    cannot: ["éxito garantizado", "saltar Costo"],
    tiers: {
      1: { income: 4, status: 3 },
      2: { income: 8, status: 5, bonds: -4 },
      3: { income: 12, status: 8, bonds: -8, health: -4 },
    },
  },
  {
    id: "red",
    name: "Red de contención",
    tagline: "El sistema te deja caer un poco más antes del acta.",
    category: "protect",
    cannot: ["salud infinita", "evitar colapso por salud"],
    tiers: {
      1: { health: 8 },
      2: { health: 14, collapseMoney: -450 },
      3: { health: 18, collapseMoney: -520 },
    },
  },
];

export function getPerk(id) {
  return PERKS.find((p) => p.id === id);
}

export function tierEffect(perkId, tier) {
  const perk = getPerk(perkId);
  if (!perk || tier < 1) return null;
  return perk.tiers[Math.min(3, tier)] ?? null;
}
