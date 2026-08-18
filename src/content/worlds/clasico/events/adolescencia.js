import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { EVENT_TYPES } from "../../../../motor/constants.js";
import { ev, opt } from "./helpers.js";

export const ADOLESCENCIA_EVENTS = [
  ev({
    id: "c_ado_estudio_fiesta",
    stage: "adolescencia",
    category: "escuela",
    title: "Fiesta o examen",
    description: "Te invitan a una fiesta la noche antes del examen más difícil del trimestre.",
    options: [
      opt("fiesta", "Ir a la fiesta", { happiness: 8, health: -3, influence: 4 }, {
        resultText: "Bailaste hasta tarde. El examen fue un desastre glorioso.",
      }),
      opt("estudiar", "Quedarte estudiando", { happiness: -3, influence: 5, health: -1 }, {
        resultText: "Te dolió ver las fotos al día siguiente. Pero aprobaste.",
      }),
      opt("rato", "Ir un rato y volver temprano", { happiness: 4, influence: 3, health: -1 }, {
        hint: "Ni todo ni nada — el clásico equilibrio imposible.",
        resultText: "Llegaste, saludaste y te fuiste. Nadie quedó del todo contento.",
      }),
    ],
  }),
  ev({
    id: "c_ado_amistad_salidas",
    stage: "adolescencia",
    category: "amistad",
    title: "Salidas cada fin de semana",
    description: "Tu grupo empieza a salir todos los fines de semana. Gastan más de lo que ganan.",
    options: [
      opt("unirse", "Unirte a todo", { happiness: 7, money: -40, health: -2 }, {
        resultText: "Fue divertido hasta que viste tu saldo.",
      }),
      opt("selectivo", "Salir solo a veces", { happiness: 3, money: -15, influence: 2 }, {
        resultText: "Te perdiste algunas historias, pero dormiste mejor.",
      }),
      opt("quedarse", "Quedarte en casa", { happiness: -2, money: 20, health: 3 }, {
        resultText: "Viste series solo. Tranquilo, pero un poco fuera.",
      }),
    ],
  }),
  ev({
    id: "c_ado_familia_dinero",
    stage: "adolescencia",
    category: "familia",
    title: "Dinero semanal",
    description: "Tus padres te ofrecen una mesada si cumples con tus responsabilidades.",
    options: [
      opt("aceptar", "Aceptar y cumplir", { money: 50, happiness: 3, influence: 2 }, {
        resultText: "Cada semana llegaba el mismo monto. Aprendiste a planear.",
      }),
      opt("negociar", "Negociar más a cambio de más tareas", { money: 80, happiness: -2, influence: 4 }, {
        resultText: "Ganaste más, pero tu lista de quehaceres creció.",
      }),
      opt("rechazar", "Rechazarla", { happiness: 1, influence: -1 }, {
        resultText: "Dijiste que no la necesitabas. A veces fue verdad.",
      }),
    ],
  }),
  ev({
    id: "c_ado_trabajo_verano",
    stage: "adolescencia",
    category: "trabajo",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Trabajo de verano",
    description: "Una tienda del barrio busca ayudante. Paga poco pero es tu primer sueldo.",
    options: [
      opt("tomar", "Aceptar el trabajo", { money: 120, happiness: -2, influence: 2 }, {
        unlock: { careerId: "ayudante", careerTitle: "Ayudante" },
        hint: "Poco dinero, pero es tu primer sueldo real.",
        resultText: "Tu primer cheque olía a cartón y esfuerzo.",
        hook: "Algo empezó a sentirse real.",
      }),
      opt("rechazar", "Disfrutar el verano", { happiness: 6, money: -20 }, {
        resultText: "Dormiste tarde y nadaste en la alberca de un amigo.",
      }),
    ],
  }),
  ev({
    id: "c_ado_romance_nota",
    stage: "adolescencia",
    category: "relaciones",
    title: "La nota anónima",
    description: "Alguien dejó una nota en tu casillero. No sabes quién es.",
    options: [
      opt("buscar", "Investigar quién fue", { happiness: 5, influence: 2 }, {
        resultText: "Preguntaste a todos. Al final supiste la verdad.",
      }),
      opt("responder", "Dejar una nota de vuelta", { happiness: 7, influence: 3, money: -5 }, {
        resultText: "Empezó una conversación de papelitos doblados.",
        hook: "Algo cambió después de esa conversación.",
      }),
      opt("ignorar", "Ignorarla", { happiness: -1 }, {
        resultText: "La guardaste en el fondo del casillero.",
      }),
    ],
  }),
  ev({
    id: "c_ado_romance_primero",
    stage: "adolescencia",
    category: "relaciones",
    title: "Tu primer enamoramiento",
    description: "Te gusta alguien de tu escuela. Todo el mundo parece haberlo notado.",
    options: [
      opt("hablar", "Hablarle directamente", { happiness: 8, influence: 3, health: -2 }, {
        resultText: "Te tembló la voz, pero lo intentaste.",
      }),
      opt("esperar", "Esperar una señal", { happiness: -2, influence: -1 }, {
        resultText: "Pasaron semanas. La señal nunca llegó.",
      }),
      opt("amigo", "Pedirle ayuda a un amigo", { happiness: 4, influence: 2 }, {
        resultText: "Tu amigo habló por ti. Fue incómodo y adorable.",
      }),
    ],
  }),
  ev({
    id: "c_ado_moral_cartera",
    stage: "adolescencia",
    category: "personalidad",
    kind: EVENT_KINDS.IMPORTANT,
    title: "La cartera encontrada",
    description: "Encuentras una cartera con dinero en el pasillo del colegio.",
    options: [
      opt("devolver", "Devolverla", { influence: 8, happiness: 4, evil: -2 }, {
        resultText: "El dueño te agradeció frente a otros. Te sonrojaste.",
      }),
      opt("quedarte", "Quedarte el dinero", { money: 60, evil: 8, influence: -5 }, {
        resultText: "Compraste cosas. El silencio pesó después.",
      }),
    ],
  }),
  ev({
    id: "c_ado_maldad_dudoso",
    stage: "adolescencia",
    category: "maldad",
    title: "La propuesta dudosa",
    description: "Alguien te ofrece dinero por hacer algo que no suena del todo bien.",
    options: [
      opt("aceptar", "Aceptar", { money: 100, evil: 10, happiness: 2, influence: -3 }, {
        hint: "Dinero fácil suele cobrar intereses morales.",
        resultText: "Lo hiciste rápido. No preguntaste demasiado.",
        hook: "Todavía no sabías a dónde llevaba esto.",
      }),
      opt("rechazar", "Rechazar", { evil: -2, influence: 3, happiness: 1 }, {
        resultText: "Te alejaste. Durmió mejor esa noche.",
      }),
      opt("denunciar", "Contárselo a un adulto", { evil: -3, influence: 5, happiness: -2 }, {
        resultText: "Hubo consecuencias. No todas fueron para ti.",
      }),
    ],
  }),
  ev({
    id: "c_ado_amistad_pelea",
    stage: "adolescencia",
    category: "amistad",
    title: "La discusión fuerte",
    description: "Tienes una pelea seria con un amigo cercano. Ambos dijeron cosas feas.",
    options: [
      opt("disculparse", "Disculparte primero", { happiness: 3, influence: 4, evil: -2 }, {
        resultText: "Costó tragar orgullo. Pero volvieron a hablarse.",
      }),
      opt("esperar", "Esperar a que él lo haga", { happiness: -4, influence: -2 }, {
        resultText: "Pasaron días en silencio. El vacío creció.",
      }),
      opt("cortar", "Cortar la amistad", { happiness: -6, influence: -3, evil: 3 }, {
        resultText: "Lo bloqueaste de todo. Duele menos y más a la vez.",
      }),
    ],
  }),
  ev({
    id: "c_ado_escuela_competencia",
    stage: "adolescencia",
    category: "escuela",
    kind: EVENT_KINDS.IMPORTANT,
    title: "La competencia escolar",
    description: "Un profesor te recomienda una competencia académica. Requiere preparación extra.",
    options: [
      opt("entrar", "Participar", { happiness: -2, influence: 8, health: -3 }, {
        resultText: "Estudiaste de más. Llegaste preparado.",
        hook: "Ese esfuerzo no se olvidó.",
      }),
      opt("no", "Declinar", { happiness: 2, influence: -2 }, {
        resultText: "Otro compañero fue en tu lugar.",
      }),
    ],
  }),
  ev({
    id: "c_ado_club_escolar",
    stage: "adolescencia",
    category: "oportunidad",
    title: "El club escolar",
    description: "Puedes entrar a un club: teatro, deportes o tecnología.",
    options: [
      opt("teatro", "Teatro", { happiness: 6, influence: 5 }, {
        resultText: "Aprendiste a proyectar la voz. Te gustó el escenario.",
        hook: "Algo en las luces te llamó.",
      }),
      opt("deportes", "Deportes", { health: 6, happiness: 4, influence: 3 }, {
        resultText: "Entrenaste hasta sudar la camiseta.",
      }),
      opt("tech", "Tecnología", { influence: 6, happiness: 3, money: -10 }, {
        resultText: "Armaste algo que casi funciona. Casi.",
      }),
    ],
  }),
  ev({
    id: "c_ado_negocio_amigo",
    stage: "adolescencia",
    category: "oportunidad",
    title: "El negocio con tu amigo",
    description: "Un amigo quiere vender algo en la escuela contigo. Podría funcionar o salir mal.",
    options: [
      opt("si", "Hacerlo juntos", { money: 40, happiness: 4, influence: 3, evil: 2 }, {
        resultText: "Vendieron todo en una tarde. Se sintieron invencibles.",
        hook: "La primera ganancia sabe distinto.",
      }),
      opt("no", "Negarte", { happiness: 1 }, {
        resultText: "Él lo hizo solo. Te contó después cómo le fue.",
      }),
    ],
  }),
  ev({
    id: "c_ado_maldad_mentira",
    stage: "adolescencia",
    category: "maldad",
    title: "Te descubren mintiendo",
    description: "Mentiste sobre algo importante y ahora todos lo saben.",
    options: [
      opt("asumir", "Asumirlo y disculparte", { evil: -3, influence: 2, happiness: -4 }, {
        resultText: "Fue humillante. Pero recuperaste algo de confianza.",
      }),
      opt("negar", "Seguir negándolo", { evil: 5, influence: -5, happiness: -2 }, {
        resultText: "La mentira creció. Ya casi no la controlas.",
      }),
    ],
  }),
  ev({
    id: "c_ado_escuela_trampa",
    stage: "adolescencia",
    category: "escuela",
    title: "La oportunidad de hacer trampa",
    description: "Alguien te ofrece las respuestas del examen.",
    options: [
      opt("trampa", "Aceptarlas", { influence: 3, evil: 6, happiness: 2 }, {
        resultText: "Aprobaste sin estudiar. El vacío fue ruidoso.",
      }),
      opt("estudiar", "Estudiar por tu cuenta", { happiness: -2, influence: 4, evil: -2 }, {
        resultText: "Te costó, pero lo lograste limpio.",
      }),
      opt("avisar", "Avisar al profesor", { influence: 6, evil: -3, happiness: -3 }, {
        resultText: "Hubo consecuencias. No todas cayeron sobre ti.",
      }),
    ],
  }),
  ev({
    id: "c_ado_futbol_equipo",
    stage: "adolescencia",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "futbolista",
    chapterId: "equipo_juvenil",
    requirements: { requireAnyFlag: ["futbol_nino", "futbol_entrena"] },
    title: "El equipo juvenil",
    description: "Un equipo juvenil busca jugadores. La prueba es este fin de semana.",
    options: [
      opt("ir", "Presentarte", { health: -4, happiness: 8, influence: 6 }, {
        storyProgress: { storyId: "futbolista", chapterId: "equipo_juvenil", flag: "futbol_juvenil" },
        resultText: "Corriste hasta que viste estrellas. Te quedaste en el equipo.",
        hook: "El entrenador te miró diferente.",
      }),
      opt("no", "No ir", { happiness: -3 }, {
        resultText: "Te quedaste en casa. El partido pasó sin ti.",
      }),
    ],
  }),
  ev({
    id: "c_ado_escritor_diario",
    stage: "adolescencia",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "escritor",
    chapterId: "primer_diario",
    title: "El cuaderno secreto",
    description: "Empiezas a escribir tus pensamientos en un cuaderno. Alguien podría leerlo.",
    options: [
      opt("escribir", "Seguir escribiendo cada noche", { happiness: 5 }, {
        storyProgress: { storyId: "escritor", chapterId: "primer_diario", flag: "escribe_diario" },
        resultText: "Cada página era un pedazo de ti que nadie veía.",
        hook: "Guardaste aquel cuaderno bajo la cama.",
      }),
      opt("compartir", "Leerle un fragmento a alguien de confianza", { happiness: 6, influence: 4 }, {
        storyProgress: { storyId: "escritor", chapterId: "primer_diario", flag: "escribe_diario" },
        resultText: "Se quedó en silencio. Luego dijo que era bueno.",
      }),
      opt("parar", "Dejarlo por vergüenza", { happiness: -2 }, {
        resultText: "El cuaderno quedó medio vacío.",
      }),
    ],
  }),
  ev({
    id: "c_ado_escritor_concurso",
    stage: "adolescencia",
    category: "escuela",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "escritor",
    chapterId: "concurso",
    requirements: { flags: ["escribe_diario"] },
    title: "El concurso de escritura",
    description: "Tu escuela abre un concurso de cuentos. Podrías enviar algo tuyo.",
    options: [
      opt("enviar", "Enviar tu texto", { happiness: 6, influence: 5 }, {
        storyProgress: { storyId: "escritor", chapterId: "concurso", flag: "escritor_concurso" },
        resultText: "Publicaron tu nombre en el tablón. No ganaste, pero apareciste.",
        hook: "Alguien lo leyó dos veces.",
      }),
      opt("no", "No participar", { happiness: -1 }, {
        resultText: "El tablón se llenó de otros nombres.",
      }),
    ],
  }),
  ev({
    id: "c_ado_familia_crisis",
    stage: "adolescencia",
    category: "familia",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Problemas en casa",
    description: "Tu familia pasa por un momento económico difícil. Se nota en todo.",
    options: [
      opt("ayudar", "Buscar formas de ayudar", { money: 30, happiness: -3, influence: 4, health: -2 }, {
        resultText: "Hiciste más de lo que te tocaba. Creciste un poco.",
      }),
      opt("quejarse", "Quejarte en silencio", { happiness: -6, evil: 2 }, {
        resultText: "Nadie lo supo. Pero tú sí lo sentiste.",
      }),
      opt("apoyo", "Apoyar emocionalmente", { happiness: 2, influence: 3, evil: -2 }, {
        resultText: "A veces un abrazo vale más que un sueldo.",
      }),
    ],
  }),
  ev({
    id: "c_ado_popular_amigo",
    stage: "adolescencia",
    category: "amistad",
    title: "El chico popular",
    description: "Alguien popular de la escuela quiere ser tu amigo. Suena bien, pero no es simple.",
    options: [
      opt("si", "Aceptar", { influence: 8, happiness: 5, evil: 1 }, {
        resultText: "De repente te invitaban a todo. También te miraban más.",
      }),
      opt("dudar", "Ser cauteloso", { influence: 3, happiness: 2 }, {
        resultText: "Fuiste amable sin entregarte del todo.",
      }),
      opt("no", "Rechazar", { influence: -2, happiness: 1, evil: -1 }, {
        resultText: "Dijiste que preferías tu círculo. Respetaron eso.",
      }),
    ],
  }),
  ev({
    id: "c_ado_actor_club",
    stage: "adolescencia",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "actor",
    chapterId: "teatro_escolar",
    title: "El club de teatro",
    description: "En la escuela montan una obra. Te invitan a probar un papel pequeño.",
    options: [
      opt("probar", "Probar el papel", { happiness: 6, influence: 4 }, {
        storyProgress: { storyId: "actor", chapterId: "teatro_escolar", flag: "actor_teatro" },
        resultText: "Dijiste tu primera línea frente a veinte personas.",
        hook: "Algo en las luces te llamó.",
      }),
      opt("no", "Quedarte en el público", { happiness: 1 }, {
        resultText: "Aplaudiste desde la última fila.",
      }),
    ],
  }),
  ev({
    id: "c_ado_talento_inesperado",
    stage: "adolescencia",
    category: "oportunidad",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Bueno en algo inesperado",
    description: "Descubres que eres sorprendentemente bueno en algo que no habías probado.",
    options: [
      opt("seguir", "Seguir explorándolo", { happiness: 7, influence: 6, money: -15 }, {
        resultText: "Dedicaste horas. Mejoraste rápido.",
        hook: "Todavía no sabías para qué serviría.",
      }),
      opt("presumir", "Presumirlo en redes", { influence: 5, happiness: 4, evil: 2 }, {
        resultText: "Llegaron likes. También expectativas.",
      }),
      opt("ignorar", "No darle importancia", { happiness: 0 }, {
        resultText: "Lo dejaste como anécdota.",
      }),
    ],
  }),
];
