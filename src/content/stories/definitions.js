/** Definiciones de historias — capítulos y copy para UI. Sin spoilers en bloqueados. */

export const STORY_DEFS = {
  cantante: {
    id: "cantante",
    emoji: "🎤",
    title: "Cantante",
    mystery: "Tal vez algún día descubras un camino distinto…",
    teaser: "Algo en la música te llama la atención.",
    hintFlags: ["clases_musica", "musica_solo", "canto_escuela"],
    arc: {
      infancia: { eventIds: ["c_inf_musica", "c_inf_musica_escuela"], flag: "clases_musica" },
      universidad: { eventIds: ["c_uni_cantante_juegos", "c_uni_cantante_productor"] },
      adultez: { eventIds: ["c_adu_cantante_primer_show", "c_adu_cantante_contrato", "c_adu_cantante_fama"], careerId: "cantante" },
      desenlace: { fameLine: "cantante" },
    },
    chapters: [
      { id: "interes_musica", label: "Primer contacto con la música", emoji: "🎵", order: 0 },
      { id: "evento_escolar", label: "Cantar en la escuela", emoji: "🎤", order: 1, requireFlags: ["clases_musica", "musica_solo"] },
      { id: "juegos_uni", label: "Juegos universitarios", emoji: "🎤", order: 2 },
      { id: "productor", label: "Un productor te escucha", emoji: "🎧", order: 3 },
      { id: "primer_show", label: "Primer show pagado", emoji: "⭐", order: 4 },
      { id: "contrato", label: "Contrato profesional", emoji: "📝", order: 5 },
      { id: "fama", label: "Reconocimiento", emoji: "🏆", order: 6 },
    ],
  },
  futbolista: {
    id: "futbolista",
    emoji: "⚽",
    title: "Futbolista",
    mystery: "Un camino que empieza con un balón…",
    teaser: "El deporte podría cambiar tu rumbo.",
    hintFlags: ["futbol_nino", "futbol_entrena", "futbol_juvenil"],
    arc: {
      infancia: { eventIds: ["c_inf_futbol_rapido", "c_inf_futbol"], flag: "futbol_nino" },
      adolescencia: { eventIds: ["c_ado_futbol_equipo"], flag: "futbol_juvenil" },
      adultez: { eventIds: ["c_adu_futbol_prueba", "c_adu_futbol_firma", "c_adu_futbol_fama"], careerId: "futbolista" },
      desenlace: { fameLine: "futbolista" },
    },
    chapters: [
      { id: "velocidad", label: "Corres muy rápido", emoji: "🏃", order: 0 },
      { id: "primer_balón", label: "Primer partido", emoji: "⚽", order: 1 },
      { id: "equipo_juvenil", label: "Equipo juvenil", emoji: "👟", order: 2 },
      { id: "prueba", label: "Prueba semiprofesional", emoji: "⭐", order: 3 },
      { id: "contrato_pro", label: "Contrato profesional", emoji: "📝", order: 4 },
      { id: "fama", label: "El estadio te aplaude", emoji: "🏆", order: 5 },
    ],
  },
  escritor: {
    id: "escritor",
    emoji: "✍️",
    title: "Escritor",
    mystery: "Las palabras guardan secretos…",
    teaser: "Escribir podría ser más que un hobby.",
    hintFlags: ["escribe_diario", "escritor_concurso", "escritor_publico"],
    arc: {
      adolescencia: { eventIds: ["c_ado_escritor_diario", "c_ado_escritor_concurso"], flag: "escribe_diario" },
      universidad: { eventIds: ["c_uni_escritor_publica"] },
      adultez: { eventIds: ["c_adu_escritor_editor", "c_adu_escritor_libro", "c_adu_escritor_fama"] },
      desenlace: { fameLine: "escritor" },
    },
    chapters: [
      { id: "primer_diario", label: "El cuaderno secreto", emoji: "✍️", order: 0 },
      { id: "concurso", label: "Concurso escolar", emoji: "📖", order: 1 },
      { id: "publicar", label: "Publicar algo", emoji: "📰", order: 2 },
      { id: "editor", label: "Un editor te contacta", emoji: "📚", order: 3 },
      { id: "libro", label: "Tu primer libro", emoji: "📕", order: 4 },
      { id: "fama", label: "Reconocimiento literario", emoji: "🏆", order: 5 },
    ],
  },
  actor: {
    id: "actor",
    emoji: "🎬",
    title: "Actor",
    mystery: "Detrás del escenario hay otra vida…",
    teaser: "Las cámaras podrían estar esperándote.",
    hintFlags: ["actor_teatro", "actor_casting", "actor_mentira"],
    arc: {
      adolescencia: { eventIds: ["c_ado_actor_club"], flag: "actor_teatro" },
      adultez: { eventIds: ["c_adu_actor_casting", "c_adu_actor_rol", "c_adu_actor_agente", "c_adu_actor_fama"], careerId: "actor" },
      desenlace: { fameLine: "actor" },
    },
    chapters: [
      { id: "teatro_escolar", label: "Teatro escolar", emoji: "🎭", order: 0 },
      { id: "casting", label: "El casting", emoji: "🎬", order: 1 },
      { id: "primer_rol", label: "Primer rol", emoji: "⭐", order: 2 },
      { id: "agente", label: "Un representante", emoji: "📋", order: 3 },
      { id: "fama", label: "Fama en pantalla", emoji: "🏆", order: 4 },
    ],
  },
  emprendedor: {
    id: "emprendedor",
    emoji: "💼",
    title: "Emprendedor",
    mystery: "Una idea puede cambiarlo todo…",
    teaser: "Algo grande podría empezar en una servilleta.",
    hintFlags: ["tiene_idea", "tiene_prototipo"],
    arc: {
      universidad: { eventIds: ["c_uni_emprendedor_idea", "c_uni_emprendedor_prototipo"], flag: "tiene_idea" },
      adultez: { eventIds: ["c_adu_emprendedor_cliente", "c_adu_emprendedor_socio", "c_adu_emprendedor_empresa"], careerId: "emprendedor" },
      desenlace: { careerId: "emprendedor" },
    },
    chapters: [
      { id: "idea", label: "La idea", emoji: "💡", order: 0 },
      { id: "prototipo", label: "El prototipo", emoji: "🔧", order: 1 },
      { id: "primer_cliente", label: "Primer cliente", emoji: "💼", order: 2 },
      { id: "socio", label: "Un socio", emoji: "🤝", order: 3 },
      { id: "empresa", label: "Tu empresa", emoji: "🏆", order: 4 },
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
