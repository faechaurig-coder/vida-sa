/** Comodines del vertical slice. Schema DATA; valores en balance. */

export const PERKS = [
  {
    id: "colchon",
    name: "Colchón",
    tagline: "Empiezas con más plata. El resto, igual de caro.",
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
    tagline: "Alguien te abre una puerta. Después cobra en favores.",
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
    tagline: "Aguantas un poco más cuando todo se pone feo.",
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
