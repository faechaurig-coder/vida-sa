/** Definiciones de historias — capítulos y copy para UI. Sin spoilers en bloqueados. */

export const STORY_DEFS = {
  cantante: {
    id: "cantante",
    emoji: "🎤",
    title: "Cantante",
    mystery: "Tal vez algún día descubras un camino distinto…",
    teaser: "Algo en la música te llama la atención.",
    hintFlags: ["clases_musica", "music_interest"],
    arc: {
      infancia: { eventIds: ["c_inf_musica"], flag: "clases_musica" },
      universidad: { eventIds: ["c_uni_cantante_juegos", "c_uni_cantante_productor"] },
      trabajo: { eventIds: ["c_adu_cantante_primer_show"], careerId: "cantante" },
      progresion: { chapters: ["carrera_especial", "carrera_legendaria"] },
      desenlace: { fameLine: "cantante" },
    },
    chapters: [
      { id: "interes_musica", label: "Primer contacto con la música", emoji: "🎵", order: 0 },
      { id: "clases_musica", label: "Clases de música", emoji: "🎵", order: 1, requireFlags: ["clases_musica"] },
      { id: "juegos_uni", label: "Juegos universitarios", emoji: "🎤", order: 2 },
      { id: "productor", label: "Un productor te escucha", emoji: "🎤", order: 3 },
      { id: "primer_show", label: "Primer trabajo artístico", emoji: "⭐", order: 4 },
      { id: "carrera_especial", label: "Carrera artística", emoji: "⭐", order: 5 },
      { id: "carrera_legendaria", label: "Carrera legendaria", emoji: "🏆", order: 6 },
    ],
  },
  futbolista: {
    id: "futbolista",
    emoji: "⚽",
    title: "Futbolista",
    mystery: "Un camino que empieza con un balón…",
    teaser: "El deporte podría cambiar tu rumbo.",
    hintFlags: ["futbol_nino"],
    arc: {
      infancia: { eventIds: ["c_inf_futbol"], flag: "futbol_nino" },
      trabajo: { eventIds: ["c_adu_futbol_prueba"], careerId: "futbolista" },
      desenlace: { fameLine: "futbolista" },
    },
    chapters: [
      { id: "primer_balón", label: "Primer partido", emoji: "⚽", order: 0 },
      { id: "prueba", label: "Prueba semiprofesional", emoji: "⭐", order: 1 },
      { id: "carrera_pro", label: "Carrera deportiva", emoji: "🏆", order: 2 },
    ],
  },
  escritor: {
    id: "escritor",
    emoji: "✍️",
    title: "Escritor",
    mystery: "Las palabras guardan secretos…",
    teaser: "Escribir podría ser más que un hobby.",
    hintFlags: ["escribe_diario"],
    arc: {
      adolescencia: { eventIds: ["c_ado_escritor_diario"], flag: "escribe_diario" },
      desenlace: { fameLine: "escritor" },
    },
    chapters: [
      { id: "primer_diario", label: "El cuaderno secreto", emoji: "✍️", order: 0 },
      { id: "primer_texto", label: "Primer texto publicado", emoji: "📖", order: 1 },
      { id: "carrera_literaria", label: "Carrera literaria", emoji: "🏆", order: 2 },
    ],
  },
  actor: {
    id: "actor",
    emoji: "🎬",
    title: "Actor",
    mystery: "Detrás del escenario hay otra vida…",
    teaser: "Las cámaras podrían estar esperándote.",
    hintFlags: ["actor_casting"],
    arc: {
      adultez: { eventIds: ["c_adu_actor_casting"], flag: "actor_casting" },
      desenlace: { fameLine: "actor" },
    },
    chapters: [
      { id: "casting", label: "El casting", emoji: "🎬", order: 0 },
      { id: "primer_rol", label: "Primer rol", emoji: "⭐", order: 1 },
      { id: "carrera_actor", label: "Carrera en pantalla", emoji: "🏆", order: 2 },
    ],
  },
  emprendedor: {
    id: "emprendedor",
    emoji: "💼",
    title: "Emprendedor",
    mystery: "Una idea puede cambiarlo todo…",
    teaser: "Algo grande podría empezar en una servilleta.",
    hintFlags: ["tiene_idea"],
    arc: {
      universidad: { eventIds: ["c_uni_emprendedor_idea"], flag: "tiene_idea" },
      desenlace: { careerId: "emprendedor" },
    },
    chapters: [
      { id: "idea", label: "La idea", emoji: "💡", order: 0 },
      { id: "primer_cliente", label: "Primer cliente", emoji: "💼", order: 1 },
      { id: "empresa", label: "Tu empresa", emoji: "🏆", order: 2 },
    ],
  },
};

export function storiesForWorld(worldId) {
  if (worldId === "clasico") return Object.values(STORY_DEFS);
  return [];
}

export function getStoryDef(id) {
  return STORY_DEFS[id] ?? null;
}
