import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { EVENT_TYPES } from "../../../../motor/constants.js";
import { ev, opt } from "./helpers.js";

/**
 * Contenido narrativo V2 — situaciones, ramas y diferidos.
 * No reemplaza IDs existentes; los extiende.
 */
export const V2_EVENTS = [
  // ——— INFANCIA: semillas ———
  ev({
    id: "c_inf_padres_pelea",
    stage: "infancia",
    category: "familia",
    kind: EVENT_KINDS.IMPORTANT,
    emotionProfile: ["drama", "tension"],
    title: "La puerta cerrada",
    description: "Tus padres discuten en la cocina. La puerta está entreabierta. Nadie te pidió que escuchara.",
    options: [
      opt("escuchar", "Acercarte a escuchar", { happiness: -4, influence: 2, flagsAdd: ["conflicto_familiar"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Entendiste más de lo que querías. Guardaste silencio.",
        hook: "Ese secreto no era tuyo, pero ahora lo es.",
      }),
      opt("irse", "Irte a tu cuarto y taparte los oídos", { happiness: -1, health: 1 }, {
        profile: "safe",
        resultText: "No supiste qué pasó. Dormiste mal igual.",
      }),
      opt("entrar", "Entrar y preguntar si están bien", { happiness: 2, influence: 3, evil: -1, flagsAdd: ["conflicto_familiar"] }, {
        profile: "ambiguous",
        resultText: "Se callaron. Te abrazaron. Nadie explicó nada.",
      }),
    ],
  }),
  ev({
    id: "c_inf_secreto_amigo",
    stage: "infancia",
    category: "amistad",
    emotionProfile: ["moral_conflict", "curiosity"],
    title: "El secreto del recreo",
    description: "Tu mejor amigo te cuenta que rompió algo de la escuela y te pide que no lo delates.",
    options: [
      opt("guardar", "Guardar el secreto", { happiness: 3, evil: 2, flagsAdd: ["guardo_secreto_infancia"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Asentiste. El nudo en el estómago no se fue.",
      }),
      opt("contar", "Contárselo a la maestra", { influence: 4, happiness: -3, evil: -2, flagsAdd: ["delato_amigo_infancia"] }, {
        profile: "risky",
        resultText: "Tu amigo no te habló en una semana. La maestra sí.",
      }),
      opt("mitad", "Ayudarlo a arreglarlo en secreto", { happiness: 2, money: -5, influence: 2 }, {
        profile: "safe",
        resultText: "Pegaron el jarrón torcido. Nadie preguntó.",
      }),
    ],
  }),
  ev({
    id: "c_inf_examen_respuestas",
    stage: "infancia",
    category: "escuela",
    emotionProfile: ["risk", "moral_conflict"],
    title: "Las respuestas en el baño",
    description: "En el baño de la escuela alguien escribió las respuestas del examen de mañana.",
    options: [
      opt("copiar", "Anotarlas", { influence: 2, evil: 4, happiness: 1, flagsAdd: ["trampa_nino"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Sacaste diez. No se sintió como un diez.",
      }),
      opt("borrar", "Borrarlas para que nadie copie", { influence: 3, evil: -2, happiness: -1 }, {
        profile: "safe",
        resultText: "Usaste agua y las manos. Alguien se enojó.",
      }),
      opt("avisar", "Avisar a la maestra", { influence: 5, happiness: -2 }, {
        profile: "ambiguous",
        resultText: "Hubo un examen nuevo. Nadie supo quién avisó… o eso crees.",
      }),
    ],
  }),
  ev({
    id: "c_inf_actor_obra",
    stage: "infancia",
    category: "escuela",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "actor",
    chapterId: "teatro_infantil",
    emotionProfile: ["curiosity", "opportunity"],
    title: "El papel que nadie quiere",
    description: "En la obra de fin de año falta un árbol parlante. La maestra te mira como si ya lo hubieras aceptado.",
    options: [
      opt("aceptar", "Aceptar el papel", { happiness: 5, influence: 4, flagsAdd: ["actor_nino"] }, {
        profile: "risky",
        storyProgress: { storyId: "actor", chapterId: "teatro_infantil", flag: "actor_nino" },
        resultText: "Dijiste tu única línea. Alguien se rió. Te gustó.",
        hook: "Algo en las luces te llamó.",
      }),
      opt("prota", "Pedir el papel del príncipe", { influence: 5, happiness: 2, evil: 1 }, {
        profile: "ambiguous",
        storyProgress: { storyId: "actor", chapterId: "teatro_infantil", flag: "actor_nino" },
        resultText: "Te lo dieron. Un compañero se quedó mirando el suelo.",
      }),
      opt("no", "Decir que no te interesa", { happiness: 1 }, {
        profile: "safe",
        resultText: "Otro niño fue el árbol. Aplaudiste desde atrás.",
      }),
    ],
  }),
  ev({
    id: "c_inf_limonada",
    stage: "infancia",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "emprendedor",
    chapterId: "limonada",
    emotionProfile: ["opportunity", "humor"],
    title: "El puesto de limonada",
    description: "Un sábado caluroso. Tienes limones, un cartel torcido y vecinos que pasan.",
    options: [
      opt("vender", "Poner el puesto", { money: 15, happiness: 5, influence: 2, flagsAdd: ["espiritu_emprendedor"] }, {
        profile: "risky",
        storyProgress: { storyId: "emprendedor", chapterId: "limonada", flag: "espiritu_emprendedor" },
        resultText: "Vendiste tres vasos. El cuarto se lo tomó tu hermano gratis.",
        hook: "La primera ganancia sabe distinto.",
      }),
      opt("caro", "Cobrar más de lo justo", { money: 25, evil: 3, influence: 1, flagsAdd: ["espiritu_emprendedor"] }, {
        profile: "ambiguous",
        visibility: "partial",
        revealedEffects: ["dinero"],
        resultText: "Un vecino pagó y no volvió. Tu hermano sí.",
      }),
      opt("no", "Usar los limones para hacer un pastel", { happiness: 4 }, {
        profile: "safe",
        resultText: "Olió rico. No ganaste nada.",
      }),
    ],
  }),

  // ——— ADOLESCENCIA ———
  ev({
    id: "c_ado_cantante_profesor",
    stage: "adolescencia",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "talento_ado",
    requirements: { requireAnyFlag: ["clases_musica", "musica_solo", "canto_escuela"] },
    emotionProfile: ["opportunity", "tension"],
    title: "Tu profesor cree que tienes talento",
    description: "Después de clase, el profesor de música te detiene. Dice que podrías ir a un concurso… o que también podrías quemarte.",
    options: [
      opt("seguir", "Seguir estudiando en serio", { money: -30, happiness: 4, influence: 4, flagsAdd: ["musica_seria"] }, {
        profile: "safe",
        storyProgress: { storyId: "cantante", chapterId: "talento_ado" },
        resultText: "Ensayaste hasta que la voz te tembló. Mejoró.",
      }),
      opt("concurso", "Presentarte al concurso", { happiness: 6, influence: 6, health: -2, flagsAdd: ["musica_concurso"] }, {
        profile: "risky",
        visibility: "hidden",
        storyProgress: { storyId: "cantante", chapterId: "talento_ado", flag: "musica_concurso" },
        resultText: "No ganaste. Alguien del jurado pidió tu nombre.",
        hook: "Todavía no sabías para qué serviría.",
      }),
      opt("dejar", "Dejarlo: ya no es un juego", { happiness: -3, flagsAdd: ["musica_abandonada"], flagsRemove: ["musica_seria"] }, {
        profile: "ambiguous",
        resultText: "Cerraste el cuaderno de partituras. El silencio fue raro.",
      }),
    ],
  }),
  ev({
    id: "c_ado_rumor_novia",
    stage: "adolescencia",
    category: "relaciones",
    emotionProfile: ["romance", "tension", "curiosity"],
    title: "Los mensajes que no eran para ti",
    description: "En el recreo, alguien te muestra una captura: la persona que te gusta escribe con otra. Podría ser broma. Podría no serlo.",
    options: [
      opt("confrontar", "Confrontarla ya", { happiness: -3, influence: 2, flagsAdd: ["celos_ado"] }, {
        profile: "risky",
        resultText: "Hubo lágrimas. También una explicación. No sabes si creérla.",
      }),
      opt("investigar", "Investigar antes de hablar", { influence: 3, evil: 2, flagsAdd: ["investigó_pareja"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Leíste más de lo necesario. Dormiste menos.",
      }),
      opt("nada", "No decir nada y guardar la captura", { happiness: -2, evil: 1, flagsAdd: ["guardo_evidencia"] }, {
        profile: "safe",
        resultText: "La foto quedó en tu galería. Pesaba.",
      }),
      opt("exponer", "Publicarla en el grupo del salón", { influence: 4, evil: 8, happiness: -4 }, {
        profile: "special",
        visibility: "hidden",
        requirements: { evilMin: 12 },
        resultText: "El salón explotó. Tú también, por dentro.",
      }),
    ],
  }),
  ev({
    id: "c_ado_trabajo_amigos",
    stage: "adolescencia",
    category: "trabajo",
    emotionProfile: ["risk", "moral_conflict"],
    title: "Turno extra o el concierto",
    description: "Tu jefe del verano te ofrece un turno extra el mismo día que tus amigos compraron boletos. Si faltas, alguien más se queda con el puesto.",
    options: [
      opt("turno", "Cubrir el turno", { money: 80, happiness: -5, influence: 3, flagsAdd: ["priorizo_dinero"] }, {
        profile: "safe",
        resultText: "El concierto pasó sin ti. El sobre, no.",
      }),
      opt("concierto", "Ir al concierto y inventar una disculpa", { happiness: 8, money: -20, evil: 3, flagsAdd: ["mintio_trabajo"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Gritaste la canción. El lunes te miraron distinto.",
      }),
      opt("repartir", "Conseguir a alguien que cubra y pagar parte", { money: -15, happiness: 4, influence: 4 }, {
        profile: "ambiguous",
        resultText: "Saliste. El puesto sobrevivió. Tu bolsillo, menos.",
      }),
    ],
  }),
  ev({
    id: "c_ado_curriculum_falso",
    stage: "adolescencia",
    category: "personalidad",
    emotionProfile: ["risk", "moral_conflict"],
    title: "La experiencia que no tuviste",
    description: "Para un casting escolar te piden «experiencia previa». Un compañero dice: pon teatro aunque no hayas hecho nada.",
    options: [
      opt("mentir", "Inventar un papel", { influence: 5, evil: 5, flagsAdd: ["actor_mentira"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Te dieron el callback. El nudo en la garganta también.",
        hook: "Las mentiras pequeñas a veces crecen.",
      }),
      opt("verdad", "Escribir la verdad: ninguna", { influence: 2, evil: -1, happiness: 1 }, {
        profile: "safe",
        resultText: "No te llamaron. Dormiste tranquilo.",
      }),
      opt("ensayar", "Pedir un día para preparar una escena real", { happiness: 3, influence: 4, health: -2 }, {
        profile: "ambiguous",
        resultText: "Llegaste con una escena. No era famosa. Era tuya.",
      }),
    ],
  }),
  ev({
    id: "c_ado_grupo_silencio",
    stage: "adolescencia",
    category: "amistad",
    emotionProfile: ["drama", "moral_conflict"],
    title: "El grupo te pide que ignores a alguien",
    description: "Tus amigos dejaron de hablarle a una chica del salón. Te piden que tú también lo hagas «si quieres seguir aquí».",
    options: [
      opt("obedecer", "Hacer como ellos", { influence: 4, happiness: -4, evil: 4, flagsAdd: ["excluyo_gente"] }, {
        profile: "safe",
        resultText: "Te quedaste en el grupo. Ella comió sola.",
      }),
      opt("hablarle", "Hablarle igual", { happiness: 3, influence: -3, evil: -2, flagsAdd: ["defiende_gente"] }, {
        profile: "risky",
        resultText: "Perdiste dos invitaciones. Ganaste una mirada de alivio.",
      }),
      opt("negociar", "Decir que no te metas, pero no participar", { happiness: -1, influence: 1 }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Quedaste en el medio. Nadie te debió nada.",
      }),
    ],
  }),

  // ——— UNIVERSIDAD ———
  ev({
    id: "c_uni_futbol_scouting",
    stage: "universidad",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "futbolista",
    chapterId: "scouting_uni",
    requirements: { requireAnyFlag: ["futbol_juvenil", "futbol_nino", "futbol_entrena"] },
    emotionProfile: ["opportunity", "risk"],
    title: "Hay un ojeador en las gradas",
    description: "En el partido interno alguien con chaqueta del club se sienta solo. El entrenador te pregunta si quieres jugar los 90 minutos aunque arrastres una molestia.",
    options: [
      opt("jugar", "Jugar completo", { health: -6, influence: 8, happiness: 4, flagsAdd: ["futbol_ojeado"] }, {
        profile: "risky",
        visibility: "hidden",
        storyProgress: { storyId: "futbolista", chapterId: "scouting_uni" },
        resultText: "Corriste. El ojeador anotó algo. La rodilla también.",
      }),
      opt("decir", "Decir la verdad sobre la rodilla", { health: 2, influence: 3, happiness: 1 }, {
        profile: "safe",
        resultText: "Te cambiaron al 60'. El ojeador se fue antes.",
      }),
      opt("banco", "Ceder el puesto a un compañero más fresco", { influence: 4, evil: -2, happiness: 2 }, {
        profile: "ambiguous",
        resultText: "Él brilló. Tú fuiste el que decidió.",
      }),
    ],
  }),
  ev({
    id: "c_uni_actor_obra",
    stage: "universidad",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "actor",
    chapterId: "obra_uni",
    requirements: { requireAnyFlag: ["actor_teatro", "actor_nino"] },
    emotionProfile: ["opportunity", "drama"],
    title: "El director quiere improvisación",
    description: "En el taller de teatro el director pide una escena de celos. Puedes usar algo real… o inventarlo.",
    options: [
      opt("real", "Usar algo que te pasó", { happiness: -2, influence: 7, flagsAdd: ["actor_crudo"] }, {
        profile: "risky",
        storyProgress: { storyId: "actor", chapterId: "obra_uni" },
        resultText: "La sala se quedó muda. El director sonrió.",
      }),
      opt("inventar", "Inventar una mentira convincente", { influence: 5, evil: 3, flagsAdd: ["actor_mentira"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        storyProgress: { storyId: "actor", chapterId: "obra_uni" },
        resultText: "Aplaudieron la ficción. Tú recuerdas que no era tuya.",
      }),
      opt("pasar", "Pasar el turno", { happiness: 1, influence: -2 }, {
        profile: "safe",
        resultText: "Otro alumno se quebró en escena. Tú respiraste.",
      }),
    ],
  }),
  ev({
    id: "c_uni_negocio_companero",
    stage: "universidad",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    emotionProfile: ["risk", "curiosity"],
    title: "«Es solo para arrancar»",
    description: "Un compañero de clase te ofrece entrar a un negocio de apps. Habla rápido. El contrato cabe en una servilleta.",
    options: [
      opt("todo", "Meter el dinero que te queda", { money: -180, flagsAdd: ["invirtio_negocio"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Durante un mes no pasó nada. Él dejó de contestar tan rápido.",
        deferred: { type: "event", id: "c_adu_inversion_cae", after: 4 },
      }),
      opt("preguntar", "Pedir números y referencias", { influence: 4, money: -10 }, {
        profile: "safe",
        revealedEffects: ["dinero"],
        visibility: "partial",
        resultText: "Las referencias no existían. El café se enfrió.",
      }),
      opt("confiar", "Confiar en él: es de tu salón", { money: -80, happiness: 2, flagsAdd: ["confio_socio"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Firmaste con una sonrisa. La duda llegó al dormitorio.",
        deferred: { type: "event", id: "c_uni_socio_pide_mas", after: 2 },
      }),
      opt("recomendar", "Recomendar a un amigo con más dinero", { influence: 3, evil: 4 }, {
        profile: "special",
        visibility: "hidden",
        requirements: { influenceMin: 35 },
        resultText: "Él entró. Tú te salvaste. O lo empujaste.",
      }),
    ],
  }),
  ev({
    id: "c_uni_socio_pide_mas",
    stage: "universidad",
    category: "dinero",
    kind: EVENT_KINDS.SPECIAL,
    exclusive: true,
    cooldown: 24,
    requirements: { requireFlags: ["confio_socio"] },
    emotionProfile: ["tension", "risk"],
    title: "Tu socio necesita más",
    description: "El mismo compañero reaparece. Dice que el servidor se cayó y que si no ponen más, pierden lo invertido.",
    options: [
      opt("poner", "Poner más", { money: -120, happiness: -3, flagsAdd: ["invirtio_negocio"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Pagaste. Él prometió un reporte. El reporte nunca llegó del todo.",
        deferred: { type: "event", id: "c_adu_inversion_cae", after: 5 },
      }),
      opt("cortar", "Cortar y asumir la pérdida", { happiness: -5, influence: 2, evil: -1 }, {
        profile: "safe",
        resultText: "Duele. También se siente como control.",
      }),
      opt("amenazar", "Exigir el dinero de vuelta", { influence: 3, evil: 5, happiness: -2 }, {
        profile: "ambiguous",
        resultText: "Hubo un mensaje largo. Luego, silencio.",
      }),
    ],
  }),
  ev({
    id: "c_uni_recomendar",
    stage: "universidad",
    category: "trabajo",
    exclusive: true,
    cooldown: 18,
    emotionProfile: ["moral_conflict", "ambition"],
    title: "La vacante que pediste para él",
    description: "Recomendaste a un amigo. Consiguió la entrevista. Ahora el reclutador te pregunta, en privado, si tú también quieres el puesto.",
    options: [
      opt("ceder", "Dejarle la oportunidad", { happiness: 4, influence: 5, evil: -2, flagsAdd: ["cedio_oportunidad"] }, {
        profile: "safe",
        resultText: "Él firmó. Te invitó a una cerveza. Sabía a algo raro y bueno.",
      }),
      opt("pedir", "Pedirle algo a cambio si entra", { money: 40, evil: 4, influence: 2 }, {
        profile: "ambiguous",
        visibility: "partial",
        revealedEffects: ["dinero"],
        resultText: "Aceptó, incómodo. La amistad cambió de precio.",
      }),
      opt("tomar", "Decir que tú encajas mejor", { influence: 6, evil: 7, happiness: -3, flagsAdd: ["robo_oportunidad"] }, {
        profile: "risky",
        visibility: "hidden",
        unlock: { careerId: "ayudante", careerTitle: "Practicante" },
        resultText: "Te contrataron. Él dejó de responder stories.",
      }),
      opt("compartir", "Proponer que te contraten a los dos a media jornada", { influence: 4, money: 30 }, {
        profile: "special",
        requirements: { influenceMin: 40 },
        resultText: "El reclutador se rió. Luego lo pensó.",
      }),
    ],
  }),
  ev({
    id: "c_uni_infidelidad",
    stage: "universidad",
    category: "relaciones",
    exclusive: true,
    cooldown: 18,
    weight: 0.55,
    requirements: { hasPartner: true },
    emotionProfile: ["romance", "moral_conflict", "tension"],
    title: "La fiesta y el mensaje a las 2 a.m.",
    description: "Alguien que te gustaba antes te escribe: «estoy abajo». Tu pareja duerme en el otro cuarto del depa.",
    options: [
      opt("ignorar", "No responder y quedarte", { happiness: -1, evil: -2 }, {
        profile: "safe",
        resultText: "El teléfono brilló una vez más. Lo volteaste.",
      }),
      opt("bajar", "Bajar «solo a hablar»", { happiness: 3, evil: 6, flagsAdd: ["fue_infiel"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Hablaste. También cruzaste una línea. El ascensor subió pesado.",
        deferred: { type: "event", id: "c_adu_descubierto", after: 6 },
      }),
      opt("contar", "Contárselo a tu pareja al día siguiente", { happiness: -4, influence: 2, evil: -1, flagsAdd: ["confeso_tentacion"] }, {
        profile: "ambiguous",
        resultText: "La conversación duró hasta el amanecer. No hubo gritos. Hubo distancia.",
      }),
    ],
  }),
  ev({
    id: "c_uni_etica_practicas",
    stage: "universidad",
    category: "escuela",
    exclusive: true,
    emotionProfile: ["moral_conflict", "tension"],
    title: "El informe que no es tuyo",
    description: "En prácticas te piden firmar un informe con números que no coinciden con lo que viste. El supervisor sonríe como si fuera rutinario.",
    options: [
      opt("firmar", "Firmar y seguir", { money: 50, evil: 6, influence: 2, flagsAdd: ["firmo_falso"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "El mes siguió. El sello, también.",
      }),
      opt("negar", "Negarte", { influence: 4, evil: -2, happiness: -3, money: -20 }, {
        profile: "safe",
        resultText: "Te cambiaron de área. El rumor fue más rápido que tú.",
      }),
      opt("copias", "Firmar y guardar una copia", { influence: 3, evil: 2, flagsAdd: ["guardo_evidencia"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "El PDF quedó en una carpeta llamada «varios».",
        hook: "Todavía no sabías a dónde llevaba esto.",
      }),
    ],
  }),

  // ——— ADULTEZ ———
  ev({
    id: "c_adu_inversion_cae",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.SPECIAL,
    exclusive: true,
    cooldown: 36,
    requirements: { requireAnyFlag: ["invirtio_negocio", "confio_socio"] },
    emotionProfile: ["loss", "surprise", "tension"],
    title: "Lo de la inversión",
    description: "Meses después, un correo. Tres versiones distintas de lo que pasó. Ninguna es completa.",
    options: [
      opt("cobrar", "Intentar recuperar el dinero", { money: 80, happiness: -4, influence: 2 }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Recuperaste una parte. La otra se llama experiencia.",
      }),
      opt("tragar", "Asumirlo y no hablar más", { happiness: -6, evil: -1 }, {
        profile: "safe",
        resultText: "Cerraste la carpeta. A veces el orgullo cuesta menos que el juicio.",
      }),
      opt("exponer", "Contarlo en redes con nombres", { influence: 5, evil: 5, happiness: -2 }, {
        profile: "ambiguous",
        resultText: "Hubo likes. También un abogado.",
      }),
    ],
  }),
  ev({
    id: "c_adu_descubierto",
    stage: "adultez",
    category: "relaciones",
    kind: EVENT_KINDS.SPECIAL,
    exclusive: true,
    requirements: { requireFlags: ["fue_infiel"], hasPartner: true },
    emotionProfile: ["drama", "tension"],
    title: "«¿Quién es?»",
    description: "Tu pareja deja el teléfono sobre la mesa. En la pantalla, un hilo que reconoces. Te mira sin parpadear.",
    options: [
      opt("confesar", "Contar todo", { happiness: -8, evil: -4, flagsAdd: ["fue_descubierto"] }, {
        profile: "safe",
        resultText: "La verdad salió fea. También salió.",
      }),
      opt("negar", "Negar y pedir contexto", { evil: 6, happiness: -5, flagsAdd: ["fue_descubierto"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Ganaste una noche. Perdiste algo que no se nombra.",
      }),
      opt("invertir", "Acusar primero", { evil: 8, influence: -3, happiness: -6 }, {
        profile: "ambiguous",
        resultText: "La pelea cambió de dueño. Nadie ganó.",
      }),
    ],
  }),
  ev({
    id: "c_adu_casa_vecinos",
    stage: "adultez",
    category: "familia",
    kind: EVENT_KINDS.SPECIAL,
    requirements: { homeMin: 1, homeMax: 1 },
    emotionProfile: ["humor", "tension"],
    title: "El vecino de arriba",
    description: "Desde que tienes departamento, alguien arrastra muebles a las 11:40. Hoy dejó una nota: «¿hablamos o llamo al administrador?»",
    options: [
      opt("hablar", "Subir a hablar", { happiness: 3, influence: 2, evil: -1 }, {
        profile: "safe",
        resultText: "Era un piano. Llegaron a un horario. Casi amigos.",
      }),
      opt("admin", "Ir directo al administrador", { influence: 3, happiness: -2, evil: 2 }, {
        profile: "risky",
        resultText: "Paró el ruido. Empezó la guerra fría en el elevador.",
      }),
      opt("grabar", "Grabar una semana y luego decidir", { influence: 2, flagsAdd: ["guardo_evidencia"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Tienes pruebas. También insomnio documentado.",
      }),
    ],
  }),
  ev({
    id: "c_adu_casa_fiesta",
    stage: "adultez",
    category: "relaciones",
    kind: EVENT_KINDS.SPECIAL,
    requirements: { homeMin: 2 },
    emotionProfile: ["humor", "opportunity"],
    title: "La casa aguanta una fiesta",
    description: "Con más espacio, tus amigos proponen «algo chico». Ya conoces esa frase.",
    options: [
      opt("si", "Abrir la casa", { happiness: 8, money: -60, influence: 5, health: -3 }, {
        profile: "risky",
        resultText: "Alguien durmió en el sofá. El vecino no.",
      }),
      opt("limite", "Poner hora de cierre y lista corta", { happiness: 4, influence: 3, money: -25 }, {
        profile: "safe",
        resultText: "Se fueron a las doce. Quedó vino y dignidad.",
      }),
      opt("no", "Prestarla solo si pagan daños", { money: 20, influence: -2, evil: 2 }, {
        profile: "ambiguous",
        resultText: "Nadie organizó nada. Tu casa quedó impecable y sola.",
      }),
    ],
  }),
  ev({
    id: "c_adu_casa_circulo",
    stage: "adultez",
    category: "oportunidad",
    kind: EVENT_KINDS.SPECIAL,
    surprise: true,
    rarity: "rare",
    requirements: { homeMin: 3, influenceMin: 45 },
    emotionProfile: ["opportunity", "surprise"],
    title: "Cena en tu casa",
    description: "Alguien con agenda llena acepta cenar «en tu lugar». No es casualidad: tu dirección ahora abre puertas.",
    options: [
      opt("impresionar", "Tirar la casa por la ventana", { money: -200, influence: 10, happiness: 4 }, {
        profile: "risky",
        resultText: "Hablaron de proyectos. También de quién paga el vino.",
      }),
      opt("simple", "Cocinar simple y ser honesto", { happiness: 6, influence: 5, money: -40 }, {
        profile: "safe",
        resultText: "La conversación duró más que el postre.",
      }),
      opt("grabar", "Pedir una foto para redes", { influence: 7, evil: 2, happiness: 2 }, {
        profile: "ambiguous",
        resultText: "El like llegó. La invitación de vuelta, no.",
      }),
    ],
  }),
  ev({
    id: "c_adu_coche_deportivo",
    stage: "adultez",
    category: "oportunidad",
    kind: EVENT_KINDS.SURPRISE,
    surprise: true,
    rarity: "rare",
    requirements: { hasPartner: true, carMin: 2, influenceMin: 40, moneyMax: 120000 },
    emotionProfile: ["surprise", "risk", "humor"],
    title: "«Ese auto no es de alguien con esa cuenta»",
    description: "En un semáforo, alguien que conoces mira tu auto y luego tu cara. Tu pareja está al lado. El comentario no es un cumplido.",
    options: [
      opt("reir", "Reírte y cambiar de tema", { happiness: -2, influence: 2 }, {
        profile: "safe",
        resultText: "El semáforo cambió. El comentario se quedó.",
      }),
      opt("flex", "Inventar que va bien el mes", { influence: 4, evil: 3, happiness: 1 }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Sonó bien. Tu pareja no preguntó. Aún.",
      }),
      opt("verdad", "Decir que el auto es un lujo a crédito", { happiness: 2, evil: -1, influence: -2 }, {
        profile: "ambiguous",
        resultText: "Hubo un silencio honesto. Raro. Bueno.",
      }),
    ],
  }),
  ev({
    id: "c_adu_negocio_abrir",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { moneyMin: 8000, hasBusiness: false },
    emotionProfile: ["opportunity", "risk"],
    title: "Un local chico, un letrero grande",
    description: "Puedes poner un negocio pequeño: comida, una tienda o un servicio. El local no espera. Tu vida, tampoco.",
    options: [
      opt("comida", "Comida", { money: -8000, income: 60, happiness: -3, business: { id: "comida", tier: 1, monthlyIncome: 60 }, flagsAdd: ["tiene_negocio"] }, {
        profile: "risky",
        resultText: "Olor a aceite. Clientes reales. Cansancio real.",
      }),
      opt("tienda", "Tienda", { money: -8000, income: 50, influence: 2, business: { id: "tienda", tier: 1, monthlyIncome: 50 }, flagsAdd: ["tiene_negocio"] }, {
        profile: "safe",
        resultText: "El inventario es un personaje más en tu vida.",
      }),
      opt("digital", "Servicio digital", { money: -5000, income: 40, influence: 4, business: { id: "digital", tier: 1, monthlyIncome: 40 }, flagsAdd: ["tiene_negocio"] }, {
        profile: "ambiguous",
        visibility: "partial",
        revealedEffects: ["dinero"],
        resultText: "Empieza lento. El servidor no duerme. Tú tampoco.",
      }),
      opt("no", "No ahora", { happiness: 1 }, {
        profile: "safe",
        resultText: "El local se lo quedó otro. Te quedó la pregunta.",
      }),
    ],
  }),
  ev({
    id: "c_adu_negocio_crecer",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { hasBusiness: true, moneyMin: 15000 },
    emotionProfile: ["ambition", "risk"],
    title: "Tu negocio pide $15,000",
    description: "Para crecer hay que poner dinero. El encargado dice que si no, se quedan como están… o se mueren lento.",
    options: [
      opt("invertir", "Invertir lo tuyo", { money: -15000, income: 80, happiness: -2 }, {
        profile: "risky",
        resultText: "El letrero nuevo brilla. El saldo, menos.",
      }),
      opt("prestamo", "Pedir préstamo", { money: 5000, income: 50, evil: 2, flagsAdd: ["deuda_negocio"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Creció. También la letra pequeña.",
      }),
      opt("no", "No crecer", { happiness: 2, income: -10 }, {
        profile: "safe",
        resultText: "Siguieron igual. El mercado no.",
      }),
      opt("socio", "Buscar un socio", { influence: 5, money: -4000, flagsAdd: ["socio_negocio"] }, {
        profile: "special",
        visibility: "hidden",
        requirements: { influenceMin: 40 },
        resultText: "Entra dinero. Entra alguien más en las decisiones.",
        deferred: { type: "event", id: "c_adu_socio_tension", after: 3 },
      }),
    ],
  }),
  ev({
    id: "c_adu_socio_tension",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.SPECIAL,
    exclusive: true,
    requirements: { requireFlags: ["socio_negocio"] },
    emotionProfile: ["tension", "moral_conflict"],
    title: "Tu socio quiere vender",
    description: "Tres meses después: quiere salir. Ofrece comprarte barato o que tú lo compres caro. Hay una tercera: alguien de afuera.",
    options: [
      opt("comprar", "Comprar su parte", { money: -12000, influence: 4, flagsRemove: ["socio_negocio"] }, {
        profile: "risky",
        resultText: "El negocio es tuyo. El silencio también.",
      }),
      opt("vender", "Vender y salir", { money: 9000, happiness: 3, flagsRemove: ["tiene_negocio", "socio_negocio"], business: null, income: -40 }, {
        profile: "safe",
        resultText: "Cerraste un capítulo. El letrero sigue, con otro nombre.",
      }),
      opt("tercero", "Dejar entrar a un tercero", { money: 2000, influence: 3, evil: 2 }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Ahora son tres. Las votaciones son una telenovela.",
      }),
    ],
  }),
  ev({
    id: "c_adu_mensajes_pareja",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    emotionProfile: ["curiosity", "tension", "romance"],
    title: "Mensajes con alguien que conoces",
    description: "El teléfono de tu pareja queda desbloqueado. Ves un chat con una persona que ustedes dos saludan en fiestas.",
    options: [
      opt("confrontar", "Confrontar ahora", { happiness: -4, influence: 2 }, {
        profile: "risky",
        resultText: "Hubo una pelea de cocina. También una versión.",
      }),
      opt("investigar", "Leer más antes", { evil: 4, happiness: -2, flagsAdd: ["investigó_pareja"] }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Ahora sabes de más. Eso no se deslee.",
      }),
      opt("telefono", "Revisar todo el teléfono", { evil: 7, happiness: -3, flagsAdd: ["reviso_telefono"] }, {
        profile: "special",
        visibility: "hidden",
        requirements: { partnerTraitMin: { riesgo: 40 } },
        resultText: "Encontraste más chats. O encontraste tu propio miedo.",
      }),
      opt("guardar", "No decir nada y guardar lo que viste", { happiness: -2, evil: 2, flagsAdd: ["guardo_evidencia"] }, {
        profile: "safe",
        resultText: "Sonreíste en la cena. El dato quedó en un cajón mental.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_ambicion",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true, partnerTraitMin: { ambicion: 70 } },
    emotionProfile: ["ambition", "tension"],
    title: "«Podrías ganar más»",
    description: "Tu pareja no lo dice como insulto. Lo dice como plan. Quiere que cambies de trabajo porque «se te nota el techo».",
    options: [
      opt("cambiar", "Buscar algo mejor pagado", { money: 120, happiness: -6, influence: 5, health: -3 }, {
        profile: "risky",
        resultText: "El sueldo subió. Las cenas se volvieron juntas de estrategia.",
      }),
      opt("quedarte", "Explicar que te gusta lo que haces", { happiness: 4, money: -20, influence: -2 }, {
        profile: "safe",
        resultText: "Escuchó. No se convenció. El tema volverá.",
      }),
      opt("pacto", "Poner una meta de seis meses", { influence: 4, happiness: 1 }, {
        profile: "ambiguous",
        resultText: "Hay fecha. Hay presión. Hay un calendario en la nevera.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_apoyo_empatico",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true, partnerTraitMin: { empatia: 70, carrino: 70 } },
    emotionProfile: ["romance", "loss"],
    title: "Cuando el mes sale mal",
    description: "Perdiste horas, clientes o el humor. Tu pareja llega con comida y una pregunta que no es «¿y el dinero?».",
    options: [
      opt("aceptar", "Dejar que te cuide", { happiness: 8, health: 3, money: 40 }, {
        profile: "safe",
        resultText: "Comieron en el suelo. El mes pesó menos.",
      }),
      opt("orgullo", "Decir que estás bien", { happiness: -2, influence: 2 }, {
        profile: "ambiguous",
        resultText: "Sonreíste. Guardó la comida en el refri, por si acaso.",
      }),
      opt("plan", "Pedir ayuda para un plan concreto", { influence: 4, happiness: 4, money: 20 }, {
        profile: "risky",
        resultText: "Hicieron números juntos. Eso también es cariño.",
      }),
    ],
  }),

  // ——— MADUREZ: ecos ———
  ev({
    id: "c_mad_trampa_vuelve",
    stage: "madurez",
    category: "personalidad",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    requirements: { requireAnyFlag: ["trampa_examen", "trampa_nino", "vendio_respuestas"] },
    emotionProfile: ["nostalgia", "moral_conflict"],
    title: "Un alumno te pregunta cómo aprobar",
    description: "Alguien joven te pide «el truco». Tú sabes uno. También sabes el precio.",
    options: [
      opt("truco", "Contarle el atajo", { evil: 4, influence: 2, happiness: -2 }, {
        profile: "risky",
        resultText: "Se rió. Tú recordaste el baño de la escuela.",
      }),
      opt("honesto", "Contarle cómo se estudia de verdad", { influence: 6, evil: -2, happiness: 3 }, {
        profile: "safe",
        resultText: "Se decepcionó un segundo. Luego tomó nota.",
      }),
      opt("historia", "Contarle lo que te costó a ti", { happiness: 5, influence: 4 }, {
        profile: "ambiguous",
        resultText: "No dio un consejo. Dio una vida.",
      }),
    ],
  }),
  ev({
    id: "c_mad_musica_olvidada",
    stage: "madurez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    requirements: { requireFlags: ["musica_abandonada"] },
    emotionProfile: ["loss", "curiosity"],
    title: "La grabación en una caja",
    description: "Encuentras una grabación tuya de adolescente. La voz es joven. La decisión de dejarlo, también.",
    options: [
      opt("subir", "Subirla sin decir quién eres", { influence: 5, happiness: 4 }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Alguien preguntó si era un cover. No lo era.",
      }),
      opt("guardar", "Dejarla en la caja", { happiness: 3 }, {
        profile: "safe",
        resultText: "Cerraste la tapa. El «qué hubiera pasado» se quedó adentro.",
      }),
      opt("nieto", "Ponérsela a alguien de la familia", { happiness: 8, influence: 3 }, {
        profile: "ambiguous",
        resultText: "Se rieron. Después pidieron otra canción.",
      }),
    ],
  }),
];
