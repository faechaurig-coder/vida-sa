export const CLASSIC_STORIES = [
  { id: "cantante", type: "special", title: "Cantante", careerTier: "especial" },
  { id: "futbolista", type: "special", title: "Futbolista", careerTier: "especial" },
  { id: "escritor", type: "special", title: "Escritor", careerTier: "especial" },
  { id: "actor", type: "special", title: "Actor", careerTier: "especial" },
  { id: "emprendedor", type: "special", title: "Emprendedor", careerTier: "raro" },
];

export const CLASSIC_CAREERS = [
  { id: "ayudante", tier: "normal", title: "Ayudante de tienda" },
  { id: "cantante", tier: "especial", title: "Artista" },
  { id: "futbolista", tier: "especial", title: "Futbolista" },
  { id: "escritor", tier: "especial", title: "Escritor" },
  { id: "actor", tier: "especial", title: "Actor" },
  { id: "emprendedor", tier: "raro", title: "Emprendedor" },
  { id: "cantante_legend", tier: "legendario", title: "Ícono musical", requiresStory: "cantante" },
];

export const CLASSIC_MISSIONS = [
  {
    id: "primer_trabajo",
    type: "job",
    title: "Primer paso",
    description: "Consigue tu primer trabajo.",
    completeText: "Ya no eres solo un estudiante. Tienes un sueldo.",
  },
  {
    id: "millon",
    type: "money",
    target: 1_000_000,
    title: "Primer millón",
    description: "Alcanza $1,000,000 en tu cuenta.",
    completeText: "Un millón. Suena distinto cuando es tuyo.",
  },
  {
    id: "historia",
    type: "story",
    title: "Vida extraordinaria",
    description: "Descubre una historia especial.",
    completeText: "Tu vida dejó de ser solo normal.",
  },
  {
    id: "fama",
    type: "fame",
    title: "Fama",
    description: "Desbloquea fama en una historia.",
    completeText: "La gente empieza a reconocerte.",
  },
  {
    id: "coleccionista",
    type: "collectibles",
    target: 3,
    title: "Coleccionista",
    description: "Obtén 3 objetos de tu colección.",
    completeText: "Lo tuyo empieza a acumularse.",
  },
];

export const CLASSIC_COLLECTIBLES = {
  house: [
    { id: "depto", name: "Departamento pequeño", price: 50_000, emoji: "🏢", description: "Pequeño, pero es tuyo." },
    { id: "casa_fam", name: "Casa familiar", price: 150_000, emoji: "🏠", description: "Espacio para crecer." },
    { id: "moderna", name: "Casa moderna", price: 400_000, emoji: "🏡", description: "Diseño y comodidad." },
    { id: "mansion", name: "Mansión", price: 1_500_000, emoji: "🏰", description: "Demasiadas habitaciones." },
    { id: "lujo", name: "Casa de lujo", price: 5_000_000, emoji: "✨", description: "El pináculo del hogar." },
  ],
  vehicle: [
    { id: "usado", name: "Auto usado", price: 20_000, emoji: "🚗", description: "Arranca… a veces." },
    { id: "moderno", name: "Auto moderno", price: 80_000, emoji: "🚙", description: "Presentable y confiable." },
    { id: "deportivo", name: "Deportivo", price: 250_000, emoji: "🏎️", description: "Se nota el motor." },
    { id: "lujo", name: "Vehículo de lujo", price: 800_000, emoji: "🛻", description: "El aparcacoches te saluda." },
    { id: "super", name: "Superdeportivo", price: 3_000_000, emoji: "⚡", description: "Demasiado rápido para el tráfico." },
  ],
  special: [
    { id: "guitarra_vieja", name: "Guitarra de tu infancia", emoji: "🎸", description: "La que nunca vendiste.", hidden: true },
    { id: "manuscrito", name: "Manuscrito original", emoji: "📜", description: "Tus primeras palabras impresas.", hidden: true },
    { id: "trofeo", name: "Trofeo olvidado", emoji: "🏆", description: "De cuando aún no sabías que podías.", hidden: true },
  ],
};
