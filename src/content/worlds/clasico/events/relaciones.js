import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { ev, opt } from "./helpers.js";

/** Pocos eventos de relación/familia — calidad, no volumen. */
export const RELACIONES_EVENTS = [
  ev({
    id: "c_ado_conocer",
    stage: "adolescencia",
    category: "relaciones",
    requirements: { hasPartner: false },
    cooldown: 10,
    title: "Alguien se queda después de clase",
    description: "Te espera en la puerta. No es una broma de grupo. Te pregunta si quieres caminar a casa por el otro lado.",
    options: [
      opt("si", "Aceptar el desvío", { happiness: 6 }, {
        profile: "risky",
        unlock: { partner: true, partnerTraits: { carrino: 62, empatia: 55, ambicion: 40, riesgo: 48 } },
        relationshipEffects: { beginPartner: { status: "dating" } },
        resultText: "Hablaron de todo menos de la escuela. El camino se hizo corto.",
        memory: { type: "relationship", importance: 3, text: "A los {age} años alguien te esperó después de clase." },
      }),
      opt("grupo", "Inventar que vas con el grupo", { influence: 2, happiness: -1 }, {
        profile: "safe",
        resultText: "Asintió. No insistió. La puerta se quedó vacía al día siguiente.",
      }),
      opt("numero", "Dar tu número y no caminar", { happiness: 3, influence: 2 }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Escribió. Tú tardaste en responder. Algo quedó a medias.",
      }),
    ],
  }),
  ev({
    id: "c_rel_convivir",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true, partnerStatus: "dating" },
    exclusive: true,
    title: "Las llaves sobre la mesa",
    description: "Tu pareja deja un juego de llaves. No es un ultimátum. Es una pregunta que cabe en metal.",
    options: [
      opt("si", "Proponer vivir juntos", { happiness: 7, money: -80 }, {
        profile: "risky",
        relationshipEffects: { partnerStatus: "cohabiting" },
        resultText: "El departamento se volvió de dos. También las cuentas.",
        memory: { type: "relationship", importance: 4, text: "A los {age} años empezaste a vivir con {partner}." },
      }),
      opt("esperar", "Pedir más tiempo", { happiness: -2 }, {
        profile: "safe",
        resultText: "Las llaves volvieron al bolsillo. El tema no murió.",
      }),
      opt("ocultar", "Sonreír y no decir que ya buscaste otro depa", { evil: 4, happiness: -3 }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Guardaste el anuncio. Dormiste mal.",
      }),
    ],
  }),
  ev({
    id: "c_rel_matrimonio",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    exclusive: true,
    cooldown: 24,
    title: "Una pregunta que no cabe en un mensaje",
    description: "Están en la cocina. Tu pareja no habla de planes: habla de ‘nosotros’ en futuro. El anillo no está. La pregunta, sí.",
    options: [
      opt("si", "Proponer matrimonio", { happiness: 10, money: -200, influence: 4 }, {
        profile: "risky",
        relationshipEffects: { partnerStatus: "married" },
        resultText: "Dijeron que sí sin escenario. El arroz se quemó.",
        memory: { type: "family", importance: 5, text: "A los {age} años te casaste." },
      }),
      opt("no", "Decir que aún no", { happiness: -4, influence: 1 }, {
        profile: "safe",
        resultText: "Hubo un silencio largo. Siguieron cenando.",
      }),
      opt("broma", "Cambiar de tema como si no hubieras oído", { happiness: -3, evil: 2 }, {
        profile: "ambiguous",
        visibility: "hidden",
        resultText: "Rieron. Uno de los dos fingió mejor.",
      }),
    ],
  }),
  ev({
    id: "c_rel_distante",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    cooldown: 8,
    emotionProfile: ["tension", "curiosity"],
    title: "Desde ayer no te mira igual",
    description: "Tu pareja está distante. El teléfono boca abajo. No sabes si es trabajo, un secreto o tú.",
    options: [
      opt("preguntar", "Preguntar directamente", { happiness: 2 }, {
        profile: "safe",
        visibility: "hidden",
        resultText: "Habló. No era simple. Pero al menos era verdad a medias.",
      }),
      opt("esperar", "Esperar a que lo diga", { happiness: -1 }, {
        profile: "ambiguous",
        resultText: "Pasaron días. El silencio hizo su trabajo.",
      }),
      opt("revisar", "Revisar discretamente el teléfono", { evil: 5, happiness: -2, flagsAdd: ["reviso_telefono"] }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Encontraste un chat. O encontraste tu propio miedo.",
        deferred: { type: "event", id: "c_adu_descubierto", after: 4 },
      }),
      opt("nada", "Hacer como si nada", { happiness: -2, evil: 1 }, {
        profile: "special",
        visibility: "hidden",
        requirements: { evilMin: 20 },
        resultText: "Sonreíste en el desayuno. El nudo no.",
      }),
    ],
  }),
  ev({
    id: "c_rel_ruptura",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    exclusive: true,
    title: "La conversación que nadie quiere empezar",
    description: "Hace semanas que la casa pesa. Alguien dice: ‘tenemos que hablar’. Esta vez no es sobre la cena.",
    options: [
      opt("terminar", "Terminarlo", { happiness: -8 }, {
        profile: "risky",
        relationshipEffects: { breakUp: true },
        resultText: "Duele. También se siente como aire.",
        memory: { type: "relationship", importance: 4, text: "A los {age} años se acabó una relación." },
      }),
      opt("quedarse", "Pedir otra oportunidad", { happiness: 3, money: -40 }, {
        profile: "safe",
        resultText: "Siguieron. El silencio cambió de forma.",
      }),
      opt("pausa", "Proponer una pausa", { happiness: -3 }, {
        profile: "ambiguous",
        relationshipEffects: { partnerStatus: "separated" },
        resultText: "No es un adiós. Tampoco es un hogar.",
      }),
    ],
  }),
  ev({
    id: "c_rel_reconcilia",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: false, hasEx: true },
    exclusive: true,
    title: "Un mensaje a las 11:40",
    description: "Tu ex escribe: ‘¿podemos hablar, sin pelear?’ No promete nada. Tampoco tú.",
    options: [
      opt("si", "Verle", { happiness: 5 }, {
        profile: "risky",
        relationshipEffects: { reconcile: true },
        resultText: "Fue raro y familiar. Volvieron a intentar.",
        memory: { type: "relationship", importance: 3, text: "A los {age} años volviste con alguien del pasado." },
      }),
      opt("no", "Dejar el mensaje visto", { happiness: -1, influence: 1 }, {
        profile: "safe",
        resultText: "El hilo quedó ahí. Tú, un poco más lejos.",
      }),
    ],
  }),
  ev({
    id: "c_rel_hijo",
    stage: "adultez",
    category: "familia",
    requirements: { hasPartner: true, hasChild: false },
    exclusive: true,
    title: "Una conversación que cambia el mapa",
    description: "Tu pareja no habla de ‘algún día’. Habla de ahora. Un hijo. El miedo y las ganas llegan juntos.",
    options: [
      opt("si", "Intentarlo", { happiness: 6, money: -120, health: -2 }, {
        profile: "risky",
        relationshipEffects: { addChild: true },
        resultText: "Nueve meses caben en una frase. El llanto, no.",
        memory: { type: "family", importance: 5, text: "A los {age} años nació tu hijo." },
      }),
      opt("esperar", "Pedir esperar", { happiness: -2 }, {
        profile: "safe",
        resultText: "Aceptó, cansada. El tema volverá.",
      }),
      opt("no", "Decir que no quieres", { happiness: -5, influence: -1 }, {
        profile: "ambiguous",
        resultText: "La relación no se rompió esa noche. Algo sí.",
      }),
    ],
  }),
  ev({
    id: "c_rel_hijo_caja",
    stage: "adultez",
    category: "familia",
    requirements: { hasChild: true, childMinAge: 5, childMaxAge: 10 },
    exclusive: true,
    title: "La caja de fotografías",
    description: "Tu hijo encontró una caja vieja. Hay fotos que no son de este departamento. Te pregunta quiénes son esas personas.",
    options: [
      opt("contar", "Contarle la historia de verdad", { happiness: 5, influence: 2 }, {
        profile: "safe",
        resultText: "Escuchó sin parpadear. Guardó una foto en el bolsillo.",
        memory: { type: "family", importance: 3, text: "Le contaste a tu hijo de dónde venía la familia." },
      }),
      opt("guardar", "Guardarlas y cambiar de tema", { happiness: -1 }, {
        profile: "ambiguous",
        resultText: "La caja volvió arriba del clóset. La pregunta, no.",
      }),
      opt("inventar", "Inventar una historia más suave", { evil: 2, happiness: 2 }, {
        profile: "risky",
        visibility: "hidden",
        resultText: "Sonrió. Tú no.",
      }),
    ],
  }),
  ev({
    id: "c_rel_hijo_actividad",
    stage: "adultez",
    category: "familia",
    requirements: { hasChild: true, childMinAge: 11, childMaxAge: 16 },
    exclusive: true,
    title: "Quiere dejarlo",
    description: "Tu hijo quiere abandonar lo que practica desde hace años. Dice que ya no es suyo. Tú recuerdas lo que costó.",
    options: [
      opt("apoyar", "Apoyarlo aunque duela", { happiness: 4, money: -20 }, {
        profile: "safe",
        resultText: "Dejó el uniforme en una bolsa. Durmió mejor.",
        memory: { type: "family", importance: 3, text: "Dejaste que tu hijo eligiera dejar algo." },
      }),
      opt("trabajo", "Decirle que busque un trabajo si suelta eso", { money: 10, happiness: -3 }, {
        profile: "risky",
        resultText: "Asintió. La conversación se enfrió.",
      }),
      opt("convencer", "Convencerlo de seguir ‘un año más’", { influence: 2, happiness: -2 }, {
        profile: "ambiguous",
        resultText: "Aceptó a regañadientes. El entusiasmo no.",
      }),
    ],
  }),
  ev({
    id: "c_rel_gira_cantante",
    stage: "adultez",
    category: "relaciones",
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    requirements: { hasPartner: true, requireAnyFlag: ["clases_musica", "musica_solo", "canto_escuela"] },
    exclusive: true,
    title: "La gira y la mesa",
    description: "Te ofrecen meses de gira. Tu pareja acaba de acomodar su vida aquí. Las maletas y el hogar no caben en la misma frase.",
    options: [
      opt("gira", "Irte de gira", { influence: 8, happiness: -4, money: 200 }, {
        profile: "risky",
        visibility: "partial",
        revealedEffects: ["dinero"],
        resultText: "El escenario llenó. La mesa, no.",
        memory: { type: "story", importance: 4, text: "Elegiste la gira por encima de quedarte." },
      }),
      opt("quedarte", "Rechazar la gira", { happiness: 6, influence: -3, money: -50 }, {
        profile: "safe",
        resultText: "Se quedó la casa. La duda, también.",
        memory: { type: "family", importance: 4, text: "A los {age} años rechazaste una gira para quedarte." },
      }),
      opt("pedir", "Pedir que te acompañe", { happiness: 2, money: -80 }, {
        profile: "ambiguous",
        visibility: "hidden",
        requirements: { partnerTraitMin: { carrino: 55 } },
        resultText: "Dijo que lo pensaría. Empezó a empacar una bolsa, no dos.",
      }),
    ],
  }),
  ev({
    id: "c_rel_cierre",
    stage: "madurez",
    category: "personalidad",
    kind: EVENT_KINDS.IMPORTANT,
    exclusive: true,
    requirements: { ageMin: 70 },
    title: "El cuaderno abierto",
    description: "Hoy el cuerpo pide menos prisa. Puedes seguir un año más… o cerrar esta vida con lo que ya es.",
    options: [
      opt("cerrar", "Cerrar el cuaderno", { happiness: 4 }, {
        profile: "safe",
        endLife: true,
        memory: { type: "family", importance: 5, text: "Decidiste cerrar esta vida a los {age} años." },
        resultText: "No hubo funeral en la cabeza. Hubo un resumen.",
      }),
      opt("seguir", "Seguir un poco más", { health: -2, happiness: 1 }, {
        profile: "risky",
        resultText: "Aún hay un mes. Aún hay una decisión.",
      }),
    ],
  }),
];
