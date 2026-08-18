import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { EVENT_TYPES } from "../../../../motor/constants.js";
import { ev, opt } from "./helpers.js";

export const UNIVERSIDAD_EVENTS = [
  ev({
    id: "c_uni_estudio_beca",
    stage: "universidad",
    category: "escuela",
    title: "La beca complicada",
    description: "Puedes postular a una beca exigente o trabajar medio tiempo.",
    options: [
      opt("beca", "Ir por la beca", { happiness: -4, influence: 8, money: 50 }, {
        resultText: "Dormiste poco. Pero la carta de aceptación llegó.",
      }),
      opt("trabajo", "Trabajar ya", { money: 120, happiness: -2, health: -3 }, {
        resultText: "El sueldo ayudó. El cansancio también se notó.",
      }),
      opt("mixto", "Intentar ambas cosas", { money: 80, happiness: -5, health: -4, influence: 5 }, {
        resultText: "Casi no te da el día. Pero avanzaste en las dos.",
      }),
    ],
  }),
  ev({
    id: "c_uni_carrera_elegir",
    stage: "universidad",
    category: "escuela",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Elegir carrera",
    description: "Debes decidir qué estudiar. Tus padres tienen opiniones. Tú también.",
    options: [
      opt("arte", "Algo creativo", { happiness: 6, influence: 4, money: -20 }, {
        resultText: "Elegiste seguir tu instinto. No fue el camino fácil.",
      }),
      opt("negocios", "Negocios o economía", { money: 30, influence: 5, happiness: -2 }, {
        resultText: "Pensaste en estabilidad. Las cifras te convencieron.",
      }),
      opt("ciencias", "Ciencias o salud", { health: 3, influence: 6, happiness: -3 }, {
        resultText: "El material era denso. Pero tenía sentido.",
      }),
    ],
  }),
  ev({
    id: "c_uni_dinero_compartir",
    stage: "universidad",
    category: "dinero",
    title: "Compartir departamento",
    description: "Puedes mudarte con compañeros para ahorrar o quedarte donde estás.",
    options: [
      opt("mudar", "Mudarte con compañeros", { money: -40, happiness: 4, influence: 3 }, {
        resultText: "Aprendiste a convivir. Y a poner candado a tu comida.",
      }),
      opt("quedarse", "Quedarte donde estás", { money: 20, happiness: -2 }, {
        resultText: "Pagaste más, pero tenías tu espacio.",
      }),
    ],
  }),
  ev({
    id: "c_uni_dinero_crisis",
    stage: "universidad",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Se acaba el dinero",
    description: "Este mes no te alcanza. Tienes que decidir qué sacrificar.",
    options: [
      opt("trabajar", "Conseguir trabajo extra", { money: 100, happiness: -5, health: -4 }, {
        resultText: "Dormiste poco. Pero pagaste lo justo.",
      }),
      opt("pedir", "Pedir ayuda familiar", { money: 80, happiness: -3, influence: -2 }, {
        resultText: "Te ayudaron. También te recordaron la deuda emocional.",
      }),
      opt("recortar", "Recortar gastos al mínimo", { money: 30, happiness: -6, health: -2 }, {
        resultText: "Comiste barato y caminaste mucho.",
      }),
    ],
  }),
  ev({
    id: "c_uni_relacion_inicio",
    stage: "universidad",
    category: "relaciones",
    title: "Café después de clase",
    description: "Alguien te invita a tomar un café. Podría ser el inicio de algo.",
    options: [
      opt("si", "Ir al café", { happiness: 8, money: -15 }, {
        unlock: { partner: true },
        resultText: "La conversación duró más que el café.",
        hook: "Algo cambió después de esa conversación.",
      }),
      opt("no", "Tienes que estudiar", { influence: 3, happiness: -2 }, {
        resultText: "Te quedaste en la biblioteca. La ventana seguía abierta.",
      }),
    ],
  }),
  ev({
    id: "c_uni_relacion_fin",
    stage: "universidad",
    category: "relaciones",
    requirements: { hasPartner: true },
    title: "Terminar o seguir",
    description: "Tu relación llegó a un punto difícil. Hay que decidir.",
    options: [
      opt("seguir", "Intentar arreglarlo", { happiness: 4, money: -30, influence: 2 }, {
        resultText: "Hablaron hasta tarde. No quedó perfecto, pero siguieron.",
      }),
      opt("terminar", "Terminar la relación", { happiness: -8, influence: -2 }, {
        resultText: "Fue doloroso. También honesto.",
      }),
    ],
  }),
  ev({
    id: "c_uni_fiesta",
    stage: "universidad",
    category: "amistad",
    title: "La fiesta universitaria",
    description: "Hay una fiesta enorme este fin de semana. Todos van.",
    options: [
      opt("ir", "Ir y disfrutar", { happiness: 9, health: -4, money: -25, influence: 4 }, {
        resultText: "Bailaste hasta que te dolieron los pies.",
      }),
      opt("estudiar", "Quedarte estudiando", { influence: 5, happiness: -3 }, {
        resultText: "Aprobaste algo importante. Te perdiste las fotos.",
      }),
      opt("rato", "Aparecer un rato y irte", { happiness: 5, influence: 3, money: -10 }, {
        resultText: "Saludaste a todos y desapareciste.",
      }),
    ],
  }),
  ev({
    id: "c_uni_examen_trampa",
    stage: "universidad",
    category: "escuela",
    title: "Copiar en el examen",
    description: "Un compañero te ofrece copiar en un examen difícil.",
    options: [
      opt("copiar", "Copiar", { influence: 2, evil: 8, happiness: 1 }, {
        resultText: "Pasaste. El silencio después fue incómodo.",
      }),
      opt("no", "Rechazar", { influence: 4, evil: -2, happiness: -2 }, {
        resultText: "Estudiaste más. No fue glamuroso.",
      }),
    ],
  }),
  ev({
    id: "c_uni_defender",
    stage: "universidad",
    category: "personalidad",
    title: "Defender a un compañero",
    description: "Un profesor trata injustamente a alguien del salón.",
    options: [
      opt("defender", "Defenderlo", { influence: 7, happiness: 3, evil: -2, health: -1 }, {
        resultText: "Hablaste cuando otros callaron. Costó, pero valió.",
      }),
      opt("callar", "Quedarte callado", { happiness: -3, evil: 2 }, {
        resultText: "Te quedaste mirando el piso.",
      }),
    ],
  }),
  ev({
    id: "c_uni_profesor",
    stage: "universidad",
    category: "oportunidad",
    kind: EVENT_KINDS.IMPORTANT,
    title: "El profesor te recomienda",
    description: "Un profesor ve potencial en ti y te ofrece una oportunidad especial.",
    options: [
      opt("aceptar", "Aceptar", { influence: 10, happiness: 4, money: -20 }, {
        resultText: "Dedicaste horas extra. Alguien importante lo notó.",
        hook: "Ese día parecía insignificante.",
      }),
      opt("rechazar", "Rechazar por miedo", { happiness: -2, influence: -3 }, {
        resultText: "Dijiste que no estabas listo. Tal vez tenías razón.",
      }),
    ],
  }),
  ev({
    id: "c_uni_cantante_juegos",
    stage: "universidad",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "juegos_uni",
    requirements: { requireAnyFlag: ["clases_musica", "musica_solo", "canto_escuela"] },
    title: "Los juegos universitarios",
    description: "Te invitan a cantar en los juegos de la universidad. El escenario es pequeño pero real.",
    options: [
      opt("cantar", "Subir al escenario", { happiness: 10, influence: 6 }, {
        storyProgress: { storyId: "cantante", chapterId: "juegos_uni" },
        nextEvent: "c_uni_cantante_productor",
        resultText: "Tu voz tembló al principio. Al final, aplaudieron.",
        hook: "Alguien del público no dejó de mirarte.",
      }),
      opt("no", "Rechazar", { happiness: -3 }, {
        resultText: "Te quedaste en la grada. La música sonó lejos.",
      }),
    ],
  }),
  ev({
    id: "c_uni_cantante_productor",
    stage: "universidad",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "productor",
    requirements: { requireAnyFlag: ["clases_musica", "musica_solo"] },
    title: "El productor",
    description: "Un productor te escuchó cantar. Quiere una demo. Cuesta tiempo y un poco de dinero.",
    options: [
      opt("demo", "Grabar la demo", { money: -80, influence: 10 }, {
        storyProgress: { storyId: "cantante", chapterId: "productor" },
        nextEvent: "c_adu_cantante_primer_show",
        resultText: "La grabación tomó toda la noche. Sonó mejor de lo esperado.",
        hook: "Guardaste aquella demo como un secreto.",
      }),
      opt("no", "No estoy listo", { happiness: -4 }, {
        resultText: "Dijiste que necesitabas tiempo. Él asintió, decepcionado.",
      }),
    ],
  }),
  ev({
    id: "c_uni_emprendedor_idea",
    stage: "universidad",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "emprendedor",
    chapterId: "idea",
    title: "La idea en una servilleta",
    description: "En la cafetería dibujas una idea de negocio. Un amigo dice que podría funcionar.",
    options: [
      opt("seguir", "Desarrollar la idea", { money: -50, influence: 4 }, {
        storyProgress: { storyId: "emprendedor", chapterId: "idea", flag: "tiene_idea" },
        nextEvent: "c_uni_emprendedor_prototipo",
        resultText: "La servilleta terminó llena de flechas y números.",
        hook: "La primera ganancia sabe distinto.",
      }),
      opt("contar", "Contárselo a un amigo y olvidarlo", { happiness: 2, influence: 2 }, {
        resultText: "Se rieron. La idea quedó en una anécdota.",
      }),
      opt("olvidar", "Dejarlo como idea", { happiness: 1 }, {
        resultText: "Tiraste la servilleta. Algo se perdió.",
      }),
    ],
  }),
  ev({
    id: "c_uni_emprendedor_prototipo",
    stage: "universidad",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "emprendedor",
    chapterId: "prototipo",
    requirements: { flags: ["tiene_idea"] },
    title: "El primer prototipo",
    description: "Tu idea necesita forma. Puedes invertir tiempo y dinero en un prototipo.",
    options: [
      opt("hacer", "Construirlo", { money: -120, influence: 6, happiness: 4 }, {
        storyProgress: { storyId: "emprendedor", chapterId: "prototipo", flag: "tiene_prototipo" },
        nextEvent: "c_adu_emprendedor_cliente",
        resultText: "Funcionó a medias. Pero funcionó.",
      }),
      opt("esperar", "Esperar más fondos", { happiness: -2, money: 20 }, {
        resultText: "La idea se enfrió un poco.",
      }),
    ],
  }),
  ev({
    id: "c_uni_escritor_publica",
    stage: "universidad",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "escritor",
    chapterId: "publicar",
    requirements: { flags: ["escribe_diario"] },
    title: "Publicar o guardar",
    description: "Tienes un texto que te gusta. Puedes publicarlo en un blog pequeño o guardarlo.",
    options: [
      opt("publicar", "Publicarlo", { happiness: 7, influence: 6 }, {
        storyProgress: { storyId: "escritor", chapterId: "publicar", flag: "escritor_publico" },
        nextEvent: "c_adu_escritor_editor",
        resultText: "Alguien comentó. Fue aterrador y emocionante.",
        hook: "Ese día parecía insignificante.",
      }),
      opt("guardar", "Guardarlo", { happiness: 2 }, {
        resultText: "Lo guardaste en una carpeta olvidada.",
      }),
    ],
  }),
  ev({
    id: "c_uni_abandonar",
    stage: "universidad",
    category: "escuela",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Abandonar temporalmente",
    description: "El estrés es demasiado. Podrías tomarte un semestre libre.",
    options: [
      opt("pausa", "Tomar un descanso", { happiness: 8, influence: -5, money: -50 }, {
        resultText: "Respiraste. El mundo no se acabó.",
      }),
      opt("seguir", "Seguir a pesar de todo", { happiness: -6, influence: 4, health: -4 }, {
        resultText: "Apretaste los dientes. Llegaste al final del semestre.",
      }),
    ],
  }),
  ev({
    id: "c_uni_trabajo_carrera",
    stage: "universidad",
    category: "trabajo",
    title: "Trabajo relacionado con tu carrera",
    description: "Te ofrecen un trabajo poco pagado pero útil para tu futuro.",
    options: [
      opt("aceptar", "Aceptar la experiencia", { money: 60, influence: 7, happiness: -3 }, {
        resultText: "Aprendiste más que en varias clases.",
        hook: "Algo empezó a sentirse real.",
      }),
      opt("rechazar", "Buscar algo mejor pagado", { money: 100, influence: 2, happiness: 1 }, {
        resultText: "El sueldo ayudó. La experiencia tardó.",
      }),
    ],
  }),
];
