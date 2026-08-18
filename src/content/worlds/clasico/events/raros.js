import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { ev, opt } from "./helpers.js";

/** Eventos raros memorables — pueden aparecer en varias etapas. */
export const RAROS_EVENTS = [
  ev({
    id: "c_raro_carta",
    stage: "adultez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.4,
    title: "La carta misteriosa",
    description: "Un desconocido te deja una carta sin remitente.",
    options: [
      opt("leer", "Leerla", { happiness: 4, influence: 3 }, {
        resultText: "Eran pocas palabras. Pero te quedaron dando vueltas.",
        hook: "Todavía no sabías quién era.",
      }),
      opt("tirar", "Tirarla", { happiness: -1 }, {
        resultText: "La botaste. La curiosidad no.",
      }),
    ],
  }),
  ev({
    id: "c_raro_casa_vieja",
    stage: "adultez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.35,
    title: "Algo en la casa vieja",
    description: "Al limpiar encuentras un objeto que no recuerdas.",
    options: [
      opt("guardar", "Guardarlo", { happiness: 5, influence: 2 }, {
        resultText: "Lo pusiste en un cajón. A veces lo miras.",
        hook: "Guardaste aquella carta.",
      }),
      opt("vender", "Venderlo", { money: 80, happiness: 1 }, {
        resultText: "Alguien pagó más de lo que esperabas.",
      }),
    ],
  }),
  ev({
    id: "c_raro_famoso",
    stage: "adultez",
    category: "oportunidad",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.3,
    requirements: { hasJob: true },
    title: "Una persona famosa",
    description: "Alguien famoso aparece donde trabajas.",
    options: [
      opt("hablar", "Acercarte", { influence: 8, happiness: 6 }, {
        resultText: "Fue breve. Pero lo contarás mil veces.",
      }),
      opt("normal", "Actuar con normalidad", { happiness: 3, influence: 2 }, {
        resultText: "Hiciste tu trabajo. Eso también impresiona.",
      }),
    ],
  }),
  ev({
    id: "c_raro_profesor",
    stage: "adultez",
    category: "amistad",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.35,
    title: "Tu antiguo profesor",
    description: "Un profesor de tu juventud te busca después de años.",
    options: [
      opt("cafe", "Tomar un café", { happiness: 7, influence: 5 }, {
        resultText: "Recordaron quién eras antes de ser quien eres.",
        hook: "¿Te acuerdas de mí?",
      }),
      opt("prisa", "Decir que vas con prisa", { happiness: -2, influence: -1 }, {
        resultText: "Se fue. Te quedó un sabor amargo.",
      }),
    ],
  }),
  ev({
    id: "c_raro_ayuda_nino",
    stage: "madurez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.3,
    requirements: { decisions: ["c_inf_escuela_amigo:invitar"] },
    title: "Te reconocen",
    description: "Un joven empresario dice que lo ayudaste cuando era niño.",
    options: [
      opt("abrazar", "Abrazar el momento", { happiness: 10, influence: 8, money: 50 }, {
        resultText: "«¿Te acuerdas de mí?» Sí. Ahora sí.",
        hook: "La vida recuerda.",
      }),
      opt("modesto", "Minimizarlo", { happiness: 4, influence: 4, evil: -2 }, {
        resultText: "Dijiste que cualquiera lo habría hecho.",
      }),
    ],
  }),
  ev({
    id: "c_raro_inversion",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.35,
    title: "La propuesta de inversión",
    description: "Un desconocido te ofrece invertir en algo demasiado bueno para ser verdad.",
    options: [
      opt("invertir", "Invertir", { money: -200, happiness: 2, evil: 3 }, {
        resultText: "Sonó bien al principio. Luego, menos.",
      }),
      opt("rechazar", "Rechazar", { happiness: 2, influence: 2 }, {
        resultText: "Te alejaste. A veces la intuición paga.",
      }),
      opt("investigar", "Investigar primero", { influence: 5, happiness: 1, money: -20 }, {
        resultText: "Encontraste grietas. Te salvaste.",
      }),
    ],
  }),
  ev({
    id: "c_raro_loteria",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.25,
    title: "El billete de lotería",
    description: "Encuentras un boleto viejo en el bolsillo de un abrigo.",
    options: [
      opt("revisar", "Revisar si ganó", { money: 500, happiness: 12 }, {
        resultText: "No era el gran premio. Pero sonreíste como si lo fuera.",
      }),
      opt("tirar", "Tirarlo", { happiness: 0 }, {
        resultText: "Nunca supiste si ganó.",
      }),
    ],
  }),
  ev({
    id: "c_raro_sueno",
    stage: "universidad",
    category: "personalidad",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.4,
    title: "Un sueño extraño",
    description: "Soñaste con una versión de ti que tomó otras decisiones.",
    options: [
      opt("cambiar", "Cambiar algo en tu vida", { happiness: 5, influence: 3 }, {
        resultText: "Hiciste un ajuste pequeño. Se sintió grande.",
      }),
      opt("ignorar", "Ignorarlo", { happiness: -1 }, {
        resultText: "El sueño se desvaneció. La duda, no del todo.",
      }),
    ],
  }),
  ev({
    id: "c_raro_mascota",
    stage: "infancia",
    category: "familia",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.35,
    title: "La mascota perdida",
    description: "Encuentras un animal perdido en la calle.",
    options: [
      opt("ayudar", "Ayudarlo a volver a casa", { happiness: 6, influence: 3, evil: -2 }, {
        resultText: "El dueño lloró de alegría. Tú también, un poco.",
      }),
      opt("quedarte", "Quedártelo en secreto", { happiness: 4, evil: 3, money: -15 }, {
        resultText: "Ganaste un amigo peludo. Perdiste algo de sueño.",
      }),
    ],
  }),
  ev({
    id: "c_raro_festival",
    stage: "adolescencia",
    category: "oportunidad",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.35,
    title: "El festival del pueblo",
    description: "Hay un festival con comida, música y gente de todas partes.",
    options: [
      opt("bailar", "Perderte en la música", { happiness: 9, money: -20, influence: 3 }, {
        resultText: "Bailaste con desconocidos. Fue perfecto.",
      }),
      opt("comer", "Probar todo", { happiness: 6, money: -15, health: -2 }, {
        resultText: "Comiste demasiado. No te arrepientes.",
      }),
    ],
  }),
  ev({
    id: "c_raro_actor_mentira",
    stage: "adultez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.3,
    requirements: { flags: ["actor_mentira"] },
    title: "La mentira vuelve",
    description: "Alguien pregunta en público por tu «experiencia» anterior. La sala espera.",
    options: [
      opt("confesar", "Decir la verdad", { happiness: 4, influence: -4, evil: -5 }, {
        resultText: "Hubo un murmullo. También alivio.",
        hook: "Las mentiras pequeñas a veces crecen.",
      }),
      opt("sostener", "Mantener la ficción", { influence: 5, evil: 6, happiness: -3 }, {
        resultText: "Sonreíste como si supieras. Por dentro, no.",
      }),
    ],
  }),
  ev({
    id: "c_raro_dinero_devuelto",
    stage: "adultez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.3,
    requirements: { decisions: ["c_inf_personalidad_dinero:entregar"] },
    title: "Te devuelven el favor",
    description: "Un desconocido te devuelve una cartera que perdiste. Dice que tú hiciste lo mismo de niño.",
    options: [
      opt("aceptar", "Agradecer", { happiness: 8, influence: 6, money: 40 }, {
        resultText: "No recordabas su cara. Él sí recordaba tu gesto.",
        hook: "La vida recuerda.",
      }),
    ],
  }),
  ev({
    id: "c_raro_emprendedor_regreso",
    stage: "madurez",
    category: "oportunidad",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.35,
    requirements: { careerId: "emprendedor" },
    title: "Tu primer cliente otra vez",
    description: "Alguien que te compró al inicio quiere contratarte para algo grande.",
    options: [
      opt("aceptar", "Aceptar el proyecto", { money: 300, happiness: 8, influence: 10 }, {
        resultText: "«Sabía que llegarías lejos», dijo. Casi creíste que siempre lo supo.",
      }),
      opt("pasar", "Recomendar a alguien más", { influence: 5, happiness: 4 }, {
        resultText: "Ayudaste a otro. El círculo se cerró distinto.",
      }),
    ],
  }),
  ev({
    id: "c_raro_amigo_infancia",
    stage: "adultez",
    category: "amistad",
    kind: EVENT_KINDS.SPECIAL,
    rarity: "rare",
    weight: 0.35,
    requirements: { decisions: ["c_inf_escuela_amigo:invitar"] },
    title: "Tu amigo de la infancia",
    description: "El niño al que invitaste a jugar aparece con una propuesta inesperada.",
    options: [
      opt("escuchar", "Escuchar la propuesta", { happiness: 7, influence: 6, money: 50 }, {
        resultText: "«¿Te acuerdas del recreo?» Sí. Ahora hablaban de negocios.",
        hook: "Quizá esto no sea lo último que escuches de él.",
      }),
      opt("rechazar", "Decir que no es buen momento", { happiness: -2 }, {
        resultText: "Se fue con una sonrisa triste.",
      }),
    ],
  }),
];
