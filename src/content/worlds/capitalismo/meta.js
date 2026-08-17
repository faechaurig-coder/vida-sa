export const CAPITALISMO_MISSIONS = [
  {
    id: "millon",
    title: "Mi primer millón",
    target: 1_000_000,
    description: "Consigue $1,000,000 en tu cuenta.",
    completeText: "Has conseguido tu primer millón.",
  },
  {
    id: "diez_millones",
    title: "Diez millones",
    target: 10_000_000,
    description: "Escala a diez millones.",
    completeText: "Diez millones. El club se nota.",
  },
  {
    id: "cincuenta_millones",
    title: "Cincuenta millones",
    target: 50_000_000,
    description: "Entra al club de los cincuenta.",
    completeText: "Cincuenta millones. Casi otro planeta.",
  },
];

export const CAPITALISMO_COLLECTIBLES = {
  house: [
    { id: "cuarto", name: "Cuarto alquilado", price: 100_000, emoji: "🏠", description: "Pequeño, pero es tuyo." },
    { id: "depto", name: "Departamento", price: 500_000, emoji: "🏢", description: "Vista a la ciudad." },
    { id: "casa", name: "Casa propia", price: 2_000_000, emoji: "🏡", description: "Jardín y privacidad." },
    { id: "penthouse", name: "Penthouse", price: 10_000_000, emoji: "🌆", description: "Arriba de todo." },
    { id: "mansion", name: "Mansión", price: 50_000_000, emoji: "🏰", description: "Demasiadas habitaciones." },
  ],
  vehicle: [
    { id: "metro", name: "Metro y caminata", price: 0, emoji: "🚇", description: "Barato y eficiente." },
    { id: "usado", name: "Coche usado", price: 80_000, emoji: "🚗", description: "Arranca… a veces." },
    { id: "sedan", name: "Sedán", price: 400_000, emoji: "🚙", description: "Presentable." },
    { id: "premium", name: "Premium", price: 2_000_000, emoji: "🏎️", description: "Se nota el motor." },
    { id: "lujo", name: "Lujo total", price: 12_000_000, emoji: "🛻", description: "El aparcacoches te saluda." },
  ],
  special: [
    {
      id: "bano_oro",
      name: "Baño de oro",
      emoji: "🚽",
      description: "Absurdo. Brillante. Tuyo.",
      hidden: true,
    },
    {
      id: "tarjeta_negra",
      name: "Tarjeta negra",
      emoji: "💳",
      description: "Sin límite visible.",
      hidden: true,
    },
    {
      id: "reloj_subasta",
      name: "Reloj de subasta",
      emoji: "⌚",
      description: "Más caro que tu primer sueldo.",
      hidden: true,
    },
  ],
};
