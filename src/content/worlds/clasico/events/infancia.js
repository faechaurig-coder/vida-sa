import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { EVENT_TYPES } from "../../../../motor/constants.js";
import { ev, opt } from "./helpers.js";

export const INFANCIA_EVENTS = [
  ev({
    id: "c_inf_familia_cena",
    stage: "infancia",
    category: "familia",
    title: "La cena familiar",
    description: "En la mesa todos hablan a la vez. Te piden que cuentes cómo te fue en la escuela.",
    options: [
      opt("hablar", "Contar todo con entusiasmo", { happiness: 5, influence: 2 }, {
        resultText: "Todos se rieron con tus historias. Te sentiste escuchado.",
      }),
      opt("callar", "Quedarte callado", { happiness: -2, influence: -1 }, {
        resultText: "La cena siguió sin ti. Te quedaste mirando el plato.",
      }),
      opt("mentir", "Inventar algo para impresionar", { influence: 3, evil: 2, happiness: 1 }, {
        resultText: "Funcionó… por ahora. Algo en tu estómago no se siente bien.",
        hook: "Las mentiras pequeñas a veces crecen.",
      }),
    ],
  }),
  ev({
    id: "c_inf_fam_cumple",
    stage: "infancia",
    category: "familia",
    title: "Tu cumpleaños",
    description: "Tus padres te preguntan qué quieres de regalo este año.",
    options: [
      opt("juguete", "Un juguete que viste en la tele", { happiness: 8, money: -15 }, {
        resultText: "Lo abriste con una sonrisa enorme. Valió cada peso.",
      }),
      opt("aprender", "Algo para aprender", { happiness: 5, influence: 4, money: -25 }, {
        resultText: "Te regalaron un kit de ciencias. Te tardaste horas en armarlo.",
        hook: "Tal vez deberías seguir haciendo esto.",
      }),
      opt("fiesta", "Una fiesta con amigos", { happiness: 10, influence: 5, money: -30 }, {
        resultText: "Fue ruidosa, pegajosa y perfecta.",
      }),
    ],
  }),
  ev({
    id: "c_inf_fam_hermano",
    stage: "infancia",
    category: "familia",
    title: "Lo que rompió tu hermano",
    description: "Tu hermano rompió algo tuyo por accidente. Te mira con miedo.",
    options: [
      opt("perdonar", "Perdonarlo", { happiness: 4, influence: 3, evil: -2 }, {
        resultText: "Te abrazó fuerte. Tus padres sonrieron aliviados.",
      }),
      opt("exigir", "Exigir que lo pague", { money: 20, happiness: -2, influence: 1 }, {
        resultText: "Te dio su alcancía. Quedó casi vacía.",
      }),
      opt("vengarse", "Vengarte rompiendo algo suyo", { evil: 6, happiness: 2, influence: -3 }, {
        resultText: "Por un momento te sentiste justo. Después, no tanto.",
        hook: "Ese día parecía insignificante.",
      }),
    ],
  }),
  ev({
    id: "c_inf_escuela_amigo",
    stage: "infancia",
    category: "amistad",
    title: "El nuevo de la clase",
    description: "Un niño nuevo no tiene con quién jugar en el recreo.",
    options: [
      opt("invitar", "Invitarlo a jugar", { happiness: 6, influence: 3, evil: -1 }, {
        resultText: "Al final del recreo ya parecían amigos de años.",
        hook: "Quizá esto no sea lo último que escuches de él.",
      }),
      opt("ignorar", "Seguir con tus amigos", { happiness: 1, evil: 1 }, {
        resultText: "Nadie dijo nada. Pero lo viste solo en la esquina.",
      }),
      opt("broma", "Hacerle una broma de bienvenida", { influence: 2, evil: 4, happiness: 3 }, {
        resultText: "Algunos se rieron. Él no.",
      }),
    ],
  }),
  ev({
    id: "c_inf_escuela_actividad",
    stage: "infancia",
    category: "escuela",
    title: "La actividad del salón",
    description: "La maestra pregunta quién quiere participar en una presentación frente a todos.",
    options: [
      opt("mano", "Levantar la mano", { happiness: 4, influence: 6, health: -1 }, {
        resultText: "Te temblaron las piernas, pero lo hiciste.",
      }),
      opt("esperar", "Esperar a que alguien más vaya", { happiness: 0, influence: -1 }, {
        resultText: "Otro niño lo hizo. Te quedaste aliviado y un poco invisible.",
      }),
      opt("interrumpir", "Interrumpir para llamar la atención", { influence: 4, happiness: 2, evil: 2 }, {
        resultText: "Todos te miraron. La maestra no sonrió.",
      }),
    ],
  }),
  ev({
    id: "c_inf_personalidad_dinero",
    stage: "infancia",
    category: "personalidad",
    kind: EVENT_KINDS.IMPORTANT,
    title: "El billete en el patio",
    description: "Encuentras dinero en el patio de la escuela. Nadie parece haberlo perdido.",
    options: [
      opt("entregar", "Entregarlo a la maestra", { influence: 8, happiness: 4, evil: -3 }, {
        resultText: "Te felicitaron frente al salón. Te sonrojaste.",
      }),
      opt("quedarte", "Quedártelo en silencio", { money: 25, evil: 5, happiness: 2 }, {
        resultText: "Compraste dulces. El sabor tenía algo amargo.",
      }),
      opt("buscar", "Buscar al dueño", { influence: 5, happiness: 3, evil: -1 }, {
        resultText: "Un niño mayor lo reconoció. Te agradeció con seriedad.",
        hook: "Algo cambió después de esa conversación.",
      }),
    ],
  }),
  ev({
    id: "c_inf_amistad_tarea",
    stage: "infancia",
    category: "amistad",
    title: "La tarea de tu mejor amigo",
    description: "Tu mejor amigo no hizo la tarea y te pide que lo dejes copiar la tuya.",
    options: [
      opt("dejar", "Dejarlo copiar", { happiness: 3, influence: 2, evil: 2 }, {
        resultText: "Os rieron juntos cuando la maestra no se dio cuenta.",
      }),
      opt("negarte", "Negarte con claridad", { influence: 4, happiness: -2, evil: -1 }, {
        resultText: "Se enojó un rato. Pero al día siguiente volvió a hablarte.",
      }),
      opt("favor", "Cobrarle un favor a cambio", { influence: 5, money: 10, evil: 3 }, {
        resultText: "Aceptó. Ahora te debe una.",
      }),
    ],
  }),
  ev({
    id: "c_inf_fam_verdad",
    stage: "infancia",
    category: "familia",
    title: "Lo que rompiste",
    description: "Tus padres descubren que rompiste algo valioso en casa.",
    options: [
      opt("verdad", "Decir la verdad", { happiness: -3, influence: 5, evil: -3 }, {
        resultText: "Te regañaron, pero al final dijeron que valoraban tu honestidad.",
      }),
      opt("culpar", "Culpar a alguien más", { evil: 8, happiness: 1, influence: -4 }, {
        resultText: "Funcionó unos días. Luego llegó la culpa.",
      }),
      opt("arreglar", "Intentar arreglarlo antes de que lo sepan", { money: -10, influence: 3, happiness: -1 }, {
        resultText: "No quedó perfecto, pero lo intentaste.",
      }),
    ],
  }),
  ev({
    id: "c_inf_ocio_patio",
    stage: "infancia",
    category: "oportunidad",
    title: "El partido del recreo",
    description: "Te eligen capitán. Puedes incluir a todos o jugar solo con los mejores.",
    options: [
      opt("todos", "Que jueguen todos", { happiness: 4, influence: 4, evil: -1 }, {
        resultText: "Perdiste el partido, pero ganaste respeto.",
      }),
      opt("ganar", "Solo los que corren más", { influence: 2, happiness: -2, evil: 1 }, {
        resultText: "Ganaste. Algunos niños se fueron al banco enojados.",
      }),
    ],
  }),
  ev({
    id: "c_inf_oportunidad_deporte",
    stage: "infancia",
    category: "oportunidad",
    title: "La clase de deportes",
    description: "Te invitan a probar una actividad deportiva después de clases.",
    options: [
      opt("probar", "Probarla con entusiasmo", { health: 5, happiness: 5, influence: 2 }, {
        resultText: "Te cansaste mucho, pero te divertiste más.",
      }),
      opt("rechazar", "Rechazarla", { happiness: 1 }, {
        resultText: "Te quedaste en casa viendo dibujos.",
      }),
      opt("forzar", "Ir aunque no te interese", { health: 2, happiness: -3, influence: 1 }, {
        resultText: "Cumpliste. No fue tu mejor tarde.",
      }),
    ],
  }),
  ev({
    id: "c_inf_musica",
    stage: "infancia",
    category: "escuela",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "interes_musica",
    title: "Te interesa la música",
    description: "En la escuela ofrecen clases extras de música. Cuesta dinero y tiempo de juego.",
    options: [
      opt("clases", "Pedir clases", { money: -40, happiness: 6 }, {
        hint: "Cuesta dinero, pero algo te llama.",
        storyProgress: { storyId: "cantante", chapterId: "interes_musica", flag: "clases_musica" },
        resultText: "La primera clase te hizo sentir algo raro en el pecho.",
        hook: "Tal vez deberías seguir haciendo esto.",
      }),
      opt("solo", "Aprender por tu cuenta con videos", { happiness: 4, influence: 2 }, {
        hint: "Sin maestro, pero con curiosidad.",
        storyProgress: { storyId: "cantante", chapterId: "interes_musica", flag: "musica_solo" },
        resultText: "Cantaste frente al espejo hasta que te dolió la garganta.",
        hook: "Guardaste aquella melodía en la cabeza.",
      }),
      opt("no", "Dejarlo por ahora", { happiness: 2 }, {
        resultText: "Saliste a jugar. La música puede esperar.",
      }),
    ],
  }),
  ev({
    id: "c_inf_musica_escuela",
    stage: "infancia",
    category: "escuela",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "evento_escolar",
    requirements: { requireAnyFlag: ["clases_musica", "musica_solo"] },
    title: "Cantar en el evento escolar",
    description: "La escuela busca a alguien para cantar en una actividad. Te miran esperando.",
    options: [
      opt("presentar", "Presentarte", { happiness: 8, influence: 6, health: -2 }, {
        storyProgress: { storyId: "cantante", chapterId: "evento_escolar", flag: "canto_escuela" },
        resultText: "Tu voz tembló al principio. Al final, aplaudieron.",
        hook: "Alguien del público no dejó de mirarte.",
      }),
      opt("no", "No hacerlo", { happiness: -2 }, {
        resultText: "Otro niño cantó. Te quedaste con las palmas en las manos.",
      }),
      opt("recomendar", "Recomendar a alguien más", { influence: 4, happiness: 1 }, {
        resultText: "Tu amigo lo hizo. Te sentiste útil y un poco en las sombras.",
      }),
    ],
  }),
  ev({
    id: "c_inf_futbol_rapido",
    stage: "infancia",
    category: "escuela",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "futbolista",
    chapterId: "velocidad",
    title: "Corres muy rápido",
    description: "Tu profesor de educación física dice que corres más rápido que el resto.",
    options: [
      opt("entrenar", "Entrenar en serio", { health: 5, happiness: 4, influence: 3 }, {
        storyProgress: { storyId: "futbolista", chapterId: "velocidad", flag: "futbol_entrena" },
        resultText: "Cada tarde corrías hasta que te ardían las piernas.",
        hook: "Algo en ti empezó a competir.",
      }),
      opt("otro", "Probar otro deporte", { happiness: 3, health: 3 }, {
        resultText: "Probaste básquet. No fue malo, pero no era lo mismo.",
      }),
      opt("no", "No te interesa", { happiness: 0 }, {
        resultText: "Volviste a jugar como siempre.",
      }),
    ],
  }),
  ev({
    id: "c_inf_futbol",
    stage: "infancia",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "futbolista",
    chapterId: "primer_balón",
    title: "El balón nuevo",
    description: "En el parque hay un grupo jugando fútbol. Te miran como diciendo «¿te unes?».",
    options: [
      opt("jugar", "Unirte al partido", { health: 4, happiness: 5 }, {
        storyProgress: { storyId: "futbolista", chapterId: "primer_balón", flag: "futbol_nino" },
        resultText: "Marcaste un gol torpe y celebraste como si fuera la final.",
        hook: "Ese balón pesaba más de lo que parecía.",
      }),
      opt("ver", "Solo mirar", { happiness: -1 }, {
        resultText: "Te quedaste en la banca imaginaria.",
      }),
    ],
  }),
  ev({
    id: "c_inf_personalidad_escribir",
    stage: "infancia",
    category: "personalidad",
    title: "Descubres que te gusta escribir",
    description: "Empiezas a escribir historias en un cuaderno viejo.",
    options: [
      opt("diario", "Comenzar un diario", { happiness: 5, influence: 1 }, {
        resultText: "Cada noche escribías lo que nadie más escucharía.",
        hook: "Guardaste aquel cuaderno bajo la cama.",
      }),
      opt("historia", "Escribir una historia inventada", { happiness: 6, influence: 2 }, {
        resultText: "Creaste un mundo con dragones y vecinos gruñones.",
      }),
      opt("secreto", "Guardarlo como secreto", { happiness: 3, evil: 1 }, {
        resultText: "Nadie lo supo. Eso te hizo sentir dueño de algo.",
      }),
    ],
  }),
  ev({
    id: "c_inf_personalidad_burla",
    stage: "infancia",
    category: "personalidad",
    title: "Se burlan de ti",
    description: "Alguien se ríe de ti frente a otros en el recreo.",
    options: [
      opt("ignorar", "Ignorarlo", { happiness: -2, influence: 1, evil: -1 }, {
        resultText: "Te dolió, pero no les diste el gusto.",
      }),
      opt("responder", "Responder con firmeza", { influence: 4, happiness: 1, health: -2 }, {
        resultText: "Hubo tensión. Pero dejaste claro que no eras un blanco fácil.",
      }),
      opt("ayuda", "Pedir ayuda a un adulto", { happiness: 2, influence: 3, evil: -2 }, {
        resultText: "Intervinieron. No fue épico, pero te sentiste protegido.",
      }),
    ],
  }),
  ev({
    id: "c_inf_escuela_talento",
    stage: "infancia",
    category: "escuela",
    kind: EVENT_KINDS.IMPORTANT,
    title: "La maestra ve algo en ti",
    description: "Un profesor nota que tienes facilidad para algo. Te ofrece ayuda extra.",
    options: [
      opt("aprovechar", "Aprovechar la oportunidad", { happiness: 4, influence: 7, money: -10 }, {
        resultText: "Te esforzaste más que el resto. Se notó.",
        hook: "Todavía no sabías para qué serviría.",
      }),
      opt("restar", "Restarle importancia", { happiness: 1, influence: -2 }, {
        resultText: "Dijiste que no era para tanto. El profesor asintió, decepcionado.",
      }),
      opt("cambio", "Pedir algo a cambio", { money: 15, influence: 3, evil: 3 }, {
        resultText: "Negociaste. Ganaste algo, pero algo se enfrió.",
      }),
    ],
  }),
  ev({
    id: "c_inf_salud_fiebre",
    stage: "infancia",
    category: "salud",
    title: "Una semana en cama",
    description: "Te enfermas y debes quedarte en casa varios días.",
    options: [
      opt("descansar", "Descansar de verdad", { health: 8, happiness: -2 }, {
        resultText: "Viste mucha tele y poco sol. Pero mejoraste.",
      }),
      opt("aburrir", "Aburrirte y quejarte", { health: 5, happiness: -5, influence: -1 }, {
        resultText: "Todos estuvieron pacientes. Tú, menos.",
      }),
    ],
  }),
];
