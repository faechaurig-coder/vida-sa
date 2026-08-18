import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { ev, opt } from "./helpers.js";

export const MADUREZ_EVENTS = [
  ev({
    id: "c_mad_salud_rutina",
    stage: "madurez",
    category: "salud",
    title: "La rutina del médico",
    description: "El médico insiste en caminar todos los días. Suena aburrido pero funciona.",
    options: [
      opt("caminar", "Caminar cada mañana", { health: 8, happiness: 3 }, {
        hint: "Aburrido hoy, agradecido mañana.",
        resultText: "El aire fresco se volvió ritual.",
      }),
      opt("ignorar", "Seguir como estás", { health: -5 }, {
        resultText: "El sofá ganó otra vez.",
      }),
    ],
  }),
  ev({
    id: "c_mad_familia_nietos",
    stage: "madurez",
    category: "familia",
    title: "Visita familiar",
    description: "Te invitan a una reunión grande. Hay niños, comida y opiniones.",
    options: [
      opt("ir", "Ir y participar", { happiness: 10, health: -2 }, {
        resultText: "Riste más de lo que esperabas.",
      }),
      opt("faltar", "Inventar excusa", { happiness: -4, influence: -2 }, {
        resultText: "La casa quedó silenciosa. Tú también.",
      }),
      opt("corto", "Ir un rato y salir", { happiness: 5, health: -1 }, {
        hint: "Aparecer sin quedarte atrapado.",
        resultText: "Apareciste, abrazaste y desapareciste.",
      }),
    ],
  }),
  ev({
    id: "c_mad_trabajo_legacy",
    stage: "madurez",
    category: "trabajo",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { hasJob: true },
    title: "Tu legado profesional",
    description: "Puedes formar a alguien más o enfocarte en terminar fuerte.",
    options: [
      opt("mentor", "Ser mentor", { influence: 10, happiness: 6, money: -20 }, {
        resultText: "Compartiste lo que tardaste años en aprender.",
        hook: "Ese día parecía insignificante.",
      }),
      opt("cerrar", "Cerrar ciclos", { money: 100, happiness: 4 }, {
        resultText: "Dejaste las cosas en orden.",
      }),
    ],
  }),
  ev({
    id: "c_mad_dinero_herencia",
    stage: "madurez",
    category: "dinero",
    title: "Una herencia inesperada",
    description: "Llega dinero de un familiar. Viene con emociones mezcladas.",
    options: [
      opt("ahorrar", "Ahorrarlo", { money: 500, happiness: 2 }, {
        resultText: "Lo guardaste. No supo a victoria ni a derrota.",
      }),
      opt("familia", "Usarlo para la familia", { money: -200, happiness: 8, influence: 4 }, {
        hint: "El dinero duele menos cuando une.",
        resultText: "Hubo abrazos. También deudas emocionales saldadas.",
      }),
      opt("viaje", "Darte un gusto", { money: -300, happiness: 10, health: 3 }, {
        resultText: "Viajaste. Recordaste por qué vivir.",
      }),
    ],
  }),
  ev({
    id: "c_mad_relacion_reencuentro",
    stage: "madurez",
    category: "relaciones",
    title: "Reencuentro",
    description: "Cruzas con alguien importante de tu pasado.",
    options: [
      opt("hablar", "Hablar", { happiness: 6, influence: 3 }, {
        resultText: "El tiempo se sintió extraño y familiar.",
        hook: "Algo cambió después de esa conversación.",
      }),
      opt("evitar", "Evitarlo", { happiness: -2 }, {
        resultText: "Cruzaste la calle. El pasado quedó atrás.",
      }),
    ],
  }),
  ev({
    id: "c_mad_fama_evento",
    stage: "madurez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    requirements: { fameLine: "cantante" },
    title: "Te piden un último show",
    description: "La gente quiere verte en el escenario otra vez.",
    options: [
      opt("si", "Subir al escenario", { happiness: 12, influence: 8, health: -4 }, {
        hint: "La voz puede recordar lo que el cuerpo olvidó.",
        resultText: "Cantaste como si tuvieras veinte otra vez.",
      }),
      opt("no", "Decir que ya pasó", { happiness: 3, influence: -2 }, {
        resultText: "Aplaudieron tu honestidad.",
      }),
    ],
  }),
  ev({
    id: "c_mad_reflexion",
    stage: "madurez",
    category: "personalidad",
    title: "Mirar atrás",
    description: "Tienes un momento para pensar en cómo fue tu vida hasta ahora.",
    options: [
      opt("orgullo", "Sentir orgullo", { happiness: 8, influence: 4 }, {
        resultText: "No todo salió bien. Pero fue tuyo.",
      }),
      opt("arrepentir", "Pensar en lo que faltó", { happiness: -4, influence: 2 }, {
        resultText: "Las otras opciones pesaron un poco.",
        hook: "¿Qué hubiera pasado si elegía la otra?",
      }),
    ],
  }),
  ev({
    id: "c_mad_pareja_jubilacion",
    stage: "madurez",
    category: "relaciones",
    requirements: { hasPartner: true },
    title: "Planes de jubilación",
    description: "Tu pareja quiere hablar de cómo quieren vivir los próximos años.",
    options: [
      opt("juntos", "Planear juntos", { happiness: 8, money: -50 }, {
        hint: "El futuro también es una decisión.",
        resultText: "Hicieron números y promesas en la misma mesa.",
      }),
      opt("solo", "Decidir por tu cuenta", { happiness: -5, influence: 3 }, {
        resultText: "Dijiste que aún no era el momento. El tema volvió.",
      }),
    ],
  }),
  ev({
    id: "c_mad_salud_checkup",
    stage: "madurez",
    category: "salud",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Los resultados del chequeo",
    description: "El médico te llama para revisar tus análisis. Suena serio.",
    options: [
      opt("ir", "Ir de inmediato", { health: 6, happiness: -2, money: -80 }, {
        hint: "Enterarte pronto suele ser mejor.",
        resultText: "No fue lo peor. Pero sí fue una señal.",
      }),
      opt("ignorar", "Posponer la cita", { health: -8, happiness: 2 }, {
        resultText: "El sobre quedó en el mostrador. La duda también.",
      }),
    ],
  }),
  ev({
    id: "c_mad_maldad_arrepentimiento",
    stage: "madurez",
    category: "personalidad",
    requirements: { evilMin: 40 },
    title: "Lo que hiciste",
    description: "Un recuerdo incómodo vuelve sin avisar. Podrías repararlo o seguir adelante.",
    options: [
      opt("reparar", "Intentar repararlo", { evil: -8, happiness: 4, influence: 3, money: -50 }, {
        hint: "Tarde también cuenta.",
        resultText: "No borró el pasado. Pero lo alivió.",
      }),
      opt("seguir", "Dejarlo enterrado", { evil: 2, happiness: -3 }, {
        resultText: "Cerraste el cajón mental otra vez.",
      }),
    ],
  }),
  ev({
    id: "c_mad_fama_escritor",
    stage: "madurez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    requirements: { fameLine: "escritor" },
    title: "Releer tu primer libro",
    description: "Encuentras una copia gastada de tu primer libro. Las páginas te miran.",
    options: [
      opt("firmar", "Firmar ejemplares en una librería", { happiness: 9, influence: 6, money: 80 }, {
        resultText: "Alguien dijo que ese libro le cambió la vida.",
      }),
      opt("guardar", "Guardarlo en casa", { happiness: 6 }, {
        hint: "A veces el legado cabe en un estante.",
        resultText: "Lo pusiste donde lo ves cada mañana.",
      }),
    ],
  }),
  ev({
    id: "c_mad_fama_futbol",
    stage: "madurez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    requirements: { fameLine: "futbolista" },
    title: "Te invitan al vestuario",
    description: "Un club te pide que hables al equipo antes de un partido importante.",
    options: [
      opt("hablar", "Dar el discurso", { happiness: 10, influence: 8, health: -2 }, {
        resultText: "Los miraste a los ojos. Supieron que hablabas en serio.",
      }),
      opt("no", "Declinar con respeto", { happiness: 3 }, {
        resultText: "Dijiste que tu tiempo en el campo ya pasó.",
      }),
    ],
  }),
  ev({
    id: "c_mad_dinero_jubilacion",
    stage: "madurez",
    category: "dinero",
    requirements: { moneyMin: 200000 },
    title: "¿Basta para jubilarte?",
    description: "Haces cuentas. Tal vez podrías dejar de trabajar. Tal vez no.",
    options: [
      opt("retirarse", "Bajar el ritmo", { money: -100, happiness: 8, influence: -3 }, {
        hint: "Menos ingresos, más tiempo.",
        resultText: "El reloj dejó de mandar tanto.",
      }),
      opt("seguir", "Seguir activo", { money: 150, happiness: -2, health: -3 }, {
        resultText: "El trabajo siguió llamando.",
      }),
    ],
  }),
  ev({
    id: "c_mad_oportunidad_voluntariado",
    stage: "madurez",
    category: "oportunidad",
    title: "Enseñar lo que sabes",
    description: "Un centro comunitario busca a alguien con experiencia para orientar jóvenes.",
    options: [
      opt("si", "Ofrecer tu tiempo", { happiness: 7, influence: 8, evil: -3, money: -20 }, {
        hint: "Tu vida ya tiene lecciones.",
        resultText: "Un chico te preguntó algo que tú también te hiciste de joven.",
        hook: "¿Te acuerdas de mí?",
      }),
      opt("no", "No tienes tiempo", { happiness: -1 }, {
        resultText: "Pasaste de largo frente al cartel.",
      }),
    ],
  }),
  ev({
    id: "c_mad_familia_secreto",
    stage: "madurez",
    category: "familia",
    title: "El secreto familiar",
    description: "Un pariente mayor te confiesa algo que cambia cómo ves tu infancia.",
    options: [
      opt("escuchar", "Escuchar sin juzgar", { happiness: 3, influence: 4, evil: -2 }, {
        resultText: "El silencio después pesó más que las palabras.",
        hook: "Ese día parecía insignificante.",
      }),
      opt("alejarse", "Alejarte del tema", { happiness: -4 }, {
        resultText: "Cambiaste de conversación. Algo quedó sin cerrar.",
      }),
    ],
  }),
  ev({
    id: "c_mad_cierre_vida",
    stage: "madurez",
    category: "personalidad",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Lo que dejas",
    description: "Piensas en qué quedará de ti cuando ya no estés en el centro de la escena.",
    options: [
      opt("legado", "Cuidar tu legado", { influence: 10, happiness: 6, money: -100 }, {
        hint: "No es fama — es lo que recordarán.",
        resultText: "Escribiste cartas que tal vez lean algún día.",
      }),
      opt("presente", "Vivir el presente", { happiness: 8, influence: 2 }, {
        resultText: "Decidiste que hoy también importa.",
      }),
    ],
  }),
];
