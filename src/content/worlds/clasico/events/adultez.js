import { EVENT_KINDS } from "../../../catalog/taxonomy.js";
import { EVENT_TYPES } from "../../../../motor/constants.js";
import { ev, opt } from "./helpers.js";

export const ADULTEZ_EVENTS = [
  ev({
    id: "c_adu_trabajo_extra",
    stage: "adultez",
    category: "trabajo",
    title: "Horas extra",
    description: "Tu jefe te ofrece trabajar horas extra este mes.",
    options: [
      opt("si", "Aceptar", { money: 150, happiness: -6, health: -4 }, {
        resultText: "Llegaste tarde a casa todos los días. Pero el sueldo subió.",
      }),
      opt("no", "Rechazar", { happiness: 5, health: 2 }, {
        resultText: "Cenaste a tiempo. Tu jefe lo anotó.",
      }),
    ],
  }),
  ev({
    id: "c_adu_trabajo_oferta",
    stage: "adultez",
    category: "trabajo",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { hasJob: true },
    title: "Oferta de otro trabajo",
    description: "Otra empresa te ofrece más dinero. Tu trabajo actual es más tranquilo.",
    options: [
      opt("dinero", "Ir por el dinero", { money: 200, happiness: -8, influence: 4 }, {
        resultText: "El sueldo mejoró. El estrés también.",
      }),
      opt("felicidad", "Quedarte donde estás", { happiness: 8, money: -50, influence: 2 }, {
        resultText: "Elegiste paz sobre cifras.",
      }),
      opt("riesgo", "Negociar con tu jefe actual", { money: 80, influence: 6, happiness: -2 }, {
        resultText: "Puso cara difícil. Pero cedió un poco.",
      }),
    ],
  }),
  ev({
    id: "c_adu_trabajo_jefe",
    stage: "adultez",
    category: "trabajo",
    title: "El jefe difícil",
    description: "Tu jefe te presiona con plazos imposibles.",
    options: [
      opt("cumplir", "Cumplir a toda costa", { money: 50, happiness: -7, health: -5, influence: 3 }, {
        resultText: "Lo lograste. Pagaste con sueño y paciencia.",
      }),
      opt("hablar", "Hablar con él", { influence: 5, happiness: 2 }, {
        resultText: "No fue amable, pero ajustó expectativas.",
      }),
      opt("renunciar", "Buscar salida", { happiness: 4, money: -80, influence: -2 }, {
        resultText: "Dejaste un ambiente tóxico. El vacío llegó después.",
      }),
    ],
  }),
  ev({
    id: "c_adu_dinero_prestamo",
    stage: "adultez",
    category: "dinero",
    title: "Tu amigo necesita dinero",
    description: "Un amigo cercano te pide prestado una suma importante.",
    options: [
      opt("prestar", "Prestarle", { money: -100, happiness: 3, influence: 4 }, {
        resultText: "Te lo agradeció con lágrimas. Esperas que pague.",
      }),
      opt("negar", "Negarte", { happiness: -4, evil: 2 }, {
        resultText: "Se fue en silencio. La amistad se enfrió.",
      }),
      opt("mitad", "Ofrecer la mitad", { money: -50, happiness: 1, influence: 2 }, {
        resultText: "Aceptó. Nadie quedó del todo contento.",
      }),
    ],
  }),
  ev({
    id: "c_adu_dinero_deuda",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Las deudas aprietan",
    description: "Tus gastos superan tus ingresos. Algo tiene que ceder.",
    options: [
      opt("recortar", "Recortar gastos", { money: 80, happiness: -6, health: -2 }, {
        resultText: "Aprendiste a decir no a cosas pequeñas.",
      }),
      opt("prestamo", "Pedir un préstamo", { money: 200, happiness: -4, evil: 3 }, {
        resultText: "El alivio fue inmediato. La letra pequeña, no.",
      }),
      opt("extra", "Trabajar más", { money: 150, health: -6, happiness: -5 }, {
        resultText: "Dormiste poco. Sobreviviste el mes.",
      }),
    ],
  }),
  ev({
    id: "c_adu_salud_checkup",
    stage: "adultez",
    category: "salud",
    title: "El chequeo anual",
    description: "Llevas meses posponiendo un chequeo médico. Cuesta dinero pero podría evitar problemas.",
    options: [
      opt("ir", "Ir al médico", { money: -60, health: 10 }, {
        resultText: "Todo salió bien. El alivio valió el precio.",
      }),
      opt("posponer", "Posponer otra vez", { health: -6, money: 20 }, {
        resultText: "Lo dejaste para después. Otra vez.",
      }),
    ],
  }),
  ev({
    id: "c_adu_salud_estres",
    stage: "adultez",
    category: "salud",
    title: "Demasiado estrés",
    description: "Llevas semanas con el cuerpo tenso y la cabeza llena.",
    options: [
      opt("descansar", "Tomarte un descanso", { health: 8, happiness: 6, money: -40 }, {
        resultText: "Dormiste, caminaste, respiraste. Volviste distinto.",
      }),
      opt("aguantar", "Seguir aguantando", { money: 50, health: -8, happiness: -5 }, {
        resultText: "Cumpliste. Pero algo se rompió por dentro.",
      }),
    ],
  }),
  ev({
    id: "c_adu_coleccion_casa",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { moneyMin: 50000, homeMax: 0 },
    title: "Tu primera casa",
    description: "Después de años ahorrando, podrías comprar tu primera casa.",
    options: [
      opt("comprar", "Comprar ahora", { money: -50000, happiness: 12, influence: 6, home: 1 }, {
        hint: "Un techo propio. También una hipoteca emocional.",
        resultText: "Las llaves pesaron más de lo que imaginabas.",
        hook: "Ese día parecía insignificante.",
      }),
      opt("esperar", "Seguir ahorrando", { money: 100, happiness: -3, influence: 2 }, {
        hint: "El mercado no espera, pero tú puedes.",
        resultText: "El mercado siguió subiendo. Tú también.",
      }),
    ],
  }),
  ev({
    id: "c_adu_coleccion_auto",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { moneyMin: 20000, carMax: 0 },
    title: "Tu primer auto",
    description: "Podrías comprar un auto que te cambie la movilidad.",
    options: [
      opt("comprar", "Comprarlo", { money: -20000, happiness: 8, influence: 4, car: 1 }, {
        hint: "Libertad con cuatro ruedas y un tanque medio vacío.",
        resultText: "El olor a nuevo duró una semana. La libertad, más.",
      }),
      opt("esperar", "Usar transporte público", { money: 50, happiness: -2 }, {
        hint: "Ahorras hoy. Llegas mañana.",
        resultText: "Ahorraste. Llegaste tarde varias veces.",
      }),
    ],
  }),
  ev({
    id: "c_adu_coleccion_casa_2",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { moneyMin: 150000, homeMin: 1, homeMax: 1 },
    title: "Un hogar más grande",
    description: "Tu departamento ya se quedó pequeño. Podrías mudarte a una casa familiar.",
    options: [
      opt("comprar", "Hacer el cambio", { money: -150000, happiness: 10, influence: 8, home: 2 }, {
        hint: "Más espacio, más responsabilidad.",
        resultText: "Las cajas tardaron semanas. El jardín valió la pena.",
      }),
      opt("esperar", "Quedarte donde estás", { money: 80, happiness: -2 }, {
        hint: "Lo conocido también es cómodo.",
        resultText: "Decidiste esperar. El mercado no se detuvo.",
      }),
    ],
  }),
  ev({
    id: "c_adu_coleccion_auto_2",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.IMPORTANT,
    requirements: { moneyMin: 80000, carMin: 1, carMax: 1 },
    title: "Cambiar de auto",
    description: "Tu auto actual ya no impresiona a nadie — ni a ti. Un modelo moderno está en oferta.",
    options: [
      opt("comprar", "Actualizar", { money: -80000, happiness: 7, influence: 6, car: 2 }, {
        hint: "Menos averías, más cuotas.",
        resultText: "Arrancó a la primera. Te sonreíste como el primer día.",
      }),
      opt("reparar", "Reparar el tuyo", { money: -5000, happiness: 2 }, {
        resultText: "Le diste una oportunidad más. A veces alcanza.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_viaje",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    title: "El viaje sorpresa",
    description: "Tu pareja propone un viaje que no estaba en el presupuesto.",
    options: [
      opt("si", "Ir de viaje", { money: -200, happiness: 12 }, {
        hint: "Recuerdos que no caben en el presupuesto.",
        resultText: "Fotos, risas y deudas. Valió la pena.",
      }),
      opt("no", "Ahorrar este mes", { money: 50, happiness: -6 }, {
        hint: "La cuenta agradece. La relación, no tanto.",
        resultText: "Se enfrió el ambiente unos días.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_apoyo",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    title: "Perdiste tu empleo",
    description: "Te despidieron. Tu pareja reacciona de formas distintas según cómo es.",
    options: [
      opt("aceptar", "Aceptar su ayuda", { money: 150, happiness: 5, influence: -2 }, {
        resultText: "Te sostuvo mientras buscabas algo nuevo.",
      }),
      opt("solo", "Resolverlo solo", { happiness: -4, influence: 4, money: -50 }, {
        resultText: "Orgullo y miedo compartieron cama.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_mudanza",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    title: "Mudarse por una oportunidad",
    description: "Tu pareja quiere mudarse por trabajo. Cambiaría muchas cosas.",
    options: [
      opt("si", "Ir juntos", { influence: 6, happiness: 4, money: -100 }, {
        resultText: "Nueva ciudad, nuevas cajas, nueva vida.",
      }),
      opt("no", "Quedarse", { happiness: -5, influence: -3, money: 30 }, {
        resultText: "La discusión duró semanas.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_estabilidad",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true, partnerTraitMax: { ambicion: 45 } },
    title: "Quedarse o arriesgar",
    description: "Tu pareja prefiere mantener la estabilidad aunque aparezca una oportunidad lejana.",
    options: [
      opt("quedarse", "Priorizar la calma", { happiness: 6, money: 40, influence: -2 }, {
        hint: "Menos estrés, menos cambio.",
        resultText: "Elegiste lo conocido. Dormiste en paz.",
      }),
      opt("arriesgar", "Empujar el cambio", { happiness: -4, influence: 5, money: -80 }, {
        resultText: "Discutieron hasta tarde. Nadie ganó del todo.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_meta",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true, partnerTraitMin: { ambicion: 60 } },
    title: "La meta en común",
    description: "Tu pareja quiere fijar una meta ambiciosa: mudarse, ahorrar o cambiar de vida.",
    options: [
      opt("unirse", "Sumarte al plan", { happiness: 5, influence: 6, money: -100 }, {
        hint: "Crecer juntos cuesta esfuerzo.",
        resultText: "Hicieron una lista en la nevera. Parecía un contrato de amor.",
      }),
      opt("frenar", "Pedir más tiempo", { happiness: -3, money: 30 }, {
        resultText: "Dijiste que aún no estabas listo. El silencio duró un rato.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_inversion",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true, partnerTraitMin: { riesgo: 55 } },
    title: "La oportunidad arriesgada",
    description: "Tu pareja quiere invertir sus ahorros en algo que suena demasiado bueno.",
    options: [
      opt("si", "Apoyar la inversión", { money: -300, happiness: 4, influence: 6 }, {
        hint: "Alto riesgo. Alta emoción.",
        resultText: "Firmaste sin leer todo el contrato.",
        hook: "Algo cambió después de esa conversación.",
      }),
      opt("no", "Frenar el impulso", { happiness: -5, money: 50 }, {
        resultText: "Dijiste que esperaran. La discusión duró días.",
      }),
    ],
  }),
  ev({
    id: "c_adu_pareja_cariño",
    stage: "adultez",
    category: "relaciones",
    requirements: { hasPartner: true },
    title: "Un día difícil",
    description: "Llegas agotado. Tu pareja reacciona a tu estado de ánimo.",
    options: [
      opt("abrir", "Contarle qué pasa", { happiness: 8, health: 3 }, {
        hint: "Vulnerabilidad que puede acercar.",
        resultText: "Hablar ayudó más que dormir.",
      }),
      opt("cerrar", "Guardártelo", { happiness: -4, health: -2 }, {
        resultText: "La distancia creció un poco más.",
      }),
    ],
  }),
  ev({
    id: "c_adu_relacion_seria",
    stage: "adultez",
    category: "relaciones",
    title: "Relación seria",
    description: "Alguien especial quiere dar el siguiente paso contigo.",
    options: [
      opt("si", "Comprometerte", { happiness: 10, influence: 4, money: -30 }, {
        unlock: { partner: true, partnerTraits: { carrino: 75, empatia: 60 } },
        resultText: "Dijiste que sí. El mundo se sintió más pequeño.",
      }),
      opt("no", "Pedir tiempo", { happiness: -3, influence: 1 }, {
        resultText: "Necesitabas espacio. Lo respetaron… con dolor.",
      }),
    ],
  }),
  ev({
    id: "c_adu_familia_hijo",
    stage: "adultez",
    category: "familia",
    kind: EVENT_KINDS.IMPORTANT,
    title: "Un nuevo miembro",
    description: "La familia crece. Todo cambia.",
    options: [
      opt("celebrar", "Abrazar el cambio", { happiness: 12, money: -80, health: -3 }, {
        resultText: "Dormiste poco. Sonreíste mucho.",
      }),
      opt("preocupar", "Preocuparte por el dinero", { money: 50, happiness: -4 }, {
        resultText: "Los números no dejaban de girar en tu cabeza.",
      }),
    ],
  }),
  ev({
    id: "c_adu_maldad_atajo",
    stage: "adultez",
    category: "especial",
    kind: EVENT_KINDS.SPECIAL,
    requirements: { evilMin: 15 },
    title: "El atajo sucio",
    description: "Conoces una forma rápida de ganar dinero. No es exactamente legal.",
    options: [
      opt("si", "Tomar el atajo", { money: 300, evil: 10, influence: -5 }, {
        resultText: "El dinero llegó rápido. El miedo también.",
      }),
      opt("no", "Mantener el rumbo", { evil: -3, influence: 3 }, {
        resultText: "Elegiste dormir tranquilo.",
      }),
    ],
  }),
  ev({
    id: "c_adu_maldad_traicion",
    stage: "adultez",
    category: "personalidad",
    requirements: { evilMin: 10 },
    title: "Traicionar para ganar",
    description: "Puedes adelantarte a un colega y quedarte con el mérito.",
    options: [
      opt("si", "Hacerlo", { money: 100, influence: 8, evil: 12, happiness: 2 }, {
        resultText: "Ganaste. Alguien lo recordará.",
        hook: "Todavía no sabías quién era.",
      }),
      opt("no", "Ser justo", { influence: 4, evil: -4, happiness: 3 }, {
        resultText: "Compartiste el crédito. Dormiste mejor.",
      }),
    ],
  }),
  ev({
    id: "c_adu_cantante_primer_show",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "primer_show",
    requirements: { requireAnyFlag: ["clases_musica", "musica_solo"] },
    title: "Tu primer show pagado",
    description: "Te ofrecen cantar en un bar pequeño. Pagan poco pero es tu primer trabajo artístico.",
    options: [
      opt("show", "Aceptar el show", { money: 200, happiness: 12, influence: 8 }, {
        hint: "Es poco dinero, pero puede ser tu primera oportunidad.",
        storyProgress: { storyId: "cantante", chapterId: "primer_show" },
        nextEvent: "c_adu_cantante_contrato",
        unlock: { careerId: "cantante", careerTitle: "Artista" },
        resultText: "Fue un show pequeño. Pero alguien del público tomó nota de tu nombre.",
        hook: "Quizá esto no sea lo último que escuches de él.",
      }),
      opt("no", "No es el momento", { happiness: -5 }, {
        resultText: "El escenario quedó vacío. Tú también, un poco.",
      }),
    ],
  }),
  ev({
    id: "c_adu_cantante_contrato",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "contrato",
    requirements: { careerId: "cantante" },
    title: "Trabajar de tiempo completo",
    description: "Te ofrecen un contrato para cantar profesionalmente. Es emocionante y aterrador.",
    options: [
      opt("firmar", "Firmar el contrato", { money: 300, happiness: 8, influence: 10, health: -4 }, {
        storyProgress: { storyId: "cantante", chapterId: "contrato" },
        nextEvent: "c_adu_cantante_fama",
        resultText: "Tu firma tembló. La música dejó de ser hobby.",
      }),
      opt("hobby", "Seguir como hobby", { happiness: 4, money: -20 }, {
        resultText: "Elegiste la seguridad. A veces la extrañas.",
      }),
    ],
  }),
  ev({
    id: "c_adu_cantante_fama",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "cantante",
    chapterId: "fama",
    requirements: { careerId: "cantante" },
    title: "La gente empieza a reconocerte",
    description: "Alguien te pide una foto en la calle. Tu voz ya no es un secreto.",
    options: [
      opt("aceptar", "Abrazar la fama", {
        happiness: 10,
        influence: 12,
        money: 150,
        collectibleUnlock: { kind: "special", tier: 0, id: "guitarra_vieja" },
      }, {
        storyProgress: { storyId: "cantante", chapterId: "fama", completed: true },
        unlock: { fame: "cantante" },
        hint: "Las luces, el ruido, las fotos.",
        resultText: "Sonreíste para la foto. Por dentro, algo se encendió.",
        hook: "Yo construí esto.",
      }),
      opt("humilde", "Mantener los pies en tierra", { happiness: 5, influence: 6, evil: -2 }, {
        resultText: "Agradeciste y seguiste caminando.",
      }),
    ],
  }),
  ev({
    id: "c_adu_futbol_prueba",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "futbolista",
    chapterId: "prueba",
    requirements: { requireAnyFlag: ["futbol_nino", "futbol_juvenil", "futbol_entrena"] },
    title: "La prueba semiprofesional",
    description: "Un club local abre pruebas. Es ahora o nunca.",
    options: [
      opt("ir", "Presentarte", { health: -5, happiness: 10, influence: 10 }, {
        storyProgress: { storyId: "futbolista", chapterId: "prueba" },
        nextEvent: "c_adu_futbol_firma",
        resultText: "Corriste como si te fuera la vida. Pasaste.",
        hook: "El entrenador te miró diferente.",
      }),
      opt("no", "Quedarte en tu trabajo", { happiness: -3 }, {
        resultText: "El silbato sonó lejos. Tú seguiste en la oficina.",
      }),
    ],
  }),
  ev({
    id: "c_adu_futbol_firma",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "futbolista",
    chapterId: "contrato_pro",
    requirements: { flags: ["futbol_juvenil"] },
    title: "El contrato profesional",
    description: "Te ofrecen firmar con un club. El sueño está a un paso.",
    options: [
      opt("firmar", "Firmar", { money: 250, happiness: 12, influence: 10, health: -6 }, {
        unlock: { careerId: "futbolista", careerTitle: "Futbolista" },
        storyProgress: { storyId: "futbolista", chapterId: "contrato_pro" },
        nextEvent: "c_adu_futbol_fama",
        resultText: "El bolígrafo pesó como un trofeo.",
      }),
      opt("fallar", "No estar listo", { happiness: -8, health: 3 }, {
        resultText: "Lesión, nervios o mala suerte. La puerta se cerró.",
        hook: "El fracaso no terminó la partida.",
      }),
    ],
  }),
  ev({
    id: "c_adu_futbol_fama",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "futbolista",
    chapterId: "fama",
    requirements: { careerId: "futbolista" },
    title: "El estadio te aplaude",
    description: "Tu nombre suena por los altavoces. La multitud corea.",
    options: [
      opt("fama", "Vivir el momento", {
        happiness: 12,
        influence: 14,
        money: 200,
        collectibleUnlock: { kind: "special", tier: 2, id: "trofeo" },
      }, {
        unlock: { fame: "futbolista" },
        storyProgress: { storyId: "futbolista", chapterId: "fama", completed: true },
        resultText: "Levantaste los brazos. Todo valió la pena.",
      }),
    ],
  }),
  ev({
    id: "c_adu_actor_casting",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "actor",
    chapterId: "casting",
    title: "El casting",
    description: "Ves un casting para un comercial local. No pagará mucho pero te ven miles.",
    options: [
      opt("ir", "Ir al casting", { happiness: 5, influence: 6, money: -20 }, {
        storyProgress: { storyId: "actor", chapterId: "casting", flag: "actor_casting" },
        nextEvent: "c_adu_actor_rol",
        resultText: "Leíste el guion en voz alta. Temblaste un poco.",
      }),
      opt("mentir", "Mentir sobre experiencia", { influence: 4, evil: 5, happiness: 2 }, {
        storyProgress: { storyId: "actor", chapterId: "casting", flag: "actor_mentira" },
        nextEvent: "c_adu_actor_rol",
        resultText: "Inventaste un currículum. Funcionó… por ahora.",
        hook: "Las mentiras pequeñas a veces crecen.",
      }),
      opt("no", "No es para ti", { happiness: -2 }, {
        resultText: "Pasaste de largo frente al cartel.",
      }),
    ],
  }),
  ev({
    id: "c_adu_actor_rol",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "actor",
    chapterId: "primer_rol",
    requirements: { requireAnyFlag: ["actor_casting", "actor_mentira"] },
    title: "Tu primer rol",
    description: "Te llaman para un papel pequeño. Pocas líneas, mucha emoción.",
    options: [
      opt("aceptar", "Aceptar", { money: 150, happiness: 10, influence: 8 }, {
        storyProgress: { storyId: "actor", chapterId: "primer_rol" },
        nextEvent: "c_adu_actor_agente",
        unlock: { careerId: "actor", careerTitle: "Actor" },
        resultText: "Di tu línea sin tropezar. Casi.",
      }),
    ],
  }),
  ev({
    id: "c_adu_actor_agente",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "actor",
    chapterId: "agente",
    requirements: { careerId: "actor" },
    title: "Un representante",
    description: "Alguien quiere representarte. Firmar significa más trabajo y menos control.",
    options: [
      opt("firmar", "Firmar", { money: 100, influence: 10, happiness: 4 }, {
        storyProgress: { storyId: "actor", chapterId: "agente" },
        nextEvent: "c_adu_actor_fama",
        resultText: "Tu firma en un contrato que no leíste del todo.",
      }),
      opt("solo", "Seguir solo", { happiness: 6, influence: 2, money: -30 }, {
        resultText: "Mantuviste el control. También las puertas cerradas.",
      }),
    ],
  }),
  ev({
    id: "c_adu_actor_fama",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "actor",
    chapterId: "fama",
    requirements: { careerId: "actor" },
    title: "Te reconocen en la calle",
    description: "Alguien te para por una serie o comercial que hiciste.",
    options: [
      opt("fama", "Disfrutar la fama", { happiness: 10, influence: 12, money: 180 }, {
        unlock: { fame: "actor" },
        storyProgress: { storyId: "actor", chapterId: "fama", completed: true },
        resultText: "Firmaste un autógrafo torpe. Sonreíste igual.",
      }),
    ],
  }),
  ev({
    id: "c_adu_escritor_editor",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "escritor",
    chapterId: "editor",
    requirements: { flags: ["escritor_publico"] },
    title: "Un editor te contacta",
    description: "Alguien leyó tu texto y quiere hablar contigo.",
    options: [
      opt("reunion", "Ir a la reunión", { influence: 8, happiness: 6, money: -30 }, {
        storyProgress: { storyId: "escritor", chapterId: "editor" },
        nextEvent: "c_adu_escritor_libro",
        resultText: "Hablaron de palabras como si fueran moneda.",
      }),
      opt("no", "Ignorar el mensaje", { happiness: -3 }, {
        resultText: "El correo quedó sin respuesta.",
      }),
    ],
  }),
  ev({
    id: "c_adu_escritor_libro",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "escritor",
    chapterId: "libro",
    requirements: { flags: ["escritor_publico"] },
    title: "La oferta del libro",
    description: "Te proponen publicar un libro. Firmar significa plazos y presión.",
    options: [
      opt("firmar", "Firmar el contrato", { money: 200, happiness: 8, influence: 10, health: -4 }, {
        storyProgress: { storyId: "escritor", chapterId: "libro" },
        nextEvent: "c_adu_escritor_fama",
        unlock: { careerId: "escritor", careerTitle: "Escritor" },
        resultText: "Escribiste hasta que dolieron los ojos.",
      }),
      opt("control", "Conservar el control", { happiness: 4, influence: 4, money: -50 }, {
        resultText: "Publicaste por tu cuenta. Más lento, más tuyo.",
      }),
    ],
  }),
  ev({
    id: "c_adu_escritor_fama",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "escritor",
    chapterId: "fama",
    requirements: { careerId: "escritor" },
    title: "Tu nombre en la portada",
    description: "Tu libro aparece en una librería. Es real.",
    options: [
      opt("fama", "Firmar ejemplares", {
        happiness: 11,
        influence: 12,
        money: 120,
        collectibleUnlock: { kind: "special", tier: 1, id: "manuscrito" },
      }, {
        unlock: { fame: "escritor" },
        storyProgress: { storyId: "escritor", chapterId: "fama", completed: true },
        resultText: "Alguien te dijo que lloró leyendo. No supiste qué decir.",
      }),
    ],
  }),
  ev({
    id: "c_adu_emprendedor_cliente",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "emprendedor",
    chapterId: "primer_cliente",
    requirements: { flags: ["tiene_prototipo"] },
    title: "Tu primer cliente",
    description: "Alguien quiere pagar por lo que creaste.",
    options: [
      opt("vender", "Cerrar el trato", { money: 250, happiness: 8, influence: 6 }, {
        storyProgress: { storyId: "emprendedor", chapterId: "primer_cliente" },
        nextEvent: "c_adu_emprendedor_socio",
        resultText: "La transferencia llegó. Sonó a victoria.",
      }),
    ],
  }),
  ev({
    id: "c_adu_emprendedor_socio",
    stage: "adultez",
    category: "oportunidad",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "emprendedor",
    chapterId: "socio",
    requirements: { flags: ["tiene_prototipo"] },
    title: "Un posible socio",
    description: "Alguien con dinero quiere entrar a tu proyecto.",
    options: [
      opt("aceptar", "Aceptar socio", { money: 400, influence: 8, happiness: 4, evil: 2 }, {
        storyProgress: { storyId: "emprendedor", chapterId: "socio" },
        nextEvent: "c_adu_emprendedor_empresa",
        resultText: "Firmaron. Ahora hay dos dueños.",
      }),
      opt("solo", "Seguir solo", { happiness: 6, influence: 4, money: -50 }, {
        resultText: "Mantuviste el control. También el riesgo.",
      }),
    ],
  }),
  ev({
    id: "c_adu_emprendedor_empresa",
    stage: "adultez",
    category: "trabajo",
    eventType: EVENT_TYPES.STORY,
    kind: EVENT_KINDS.STORY,
    storyId: "emprendedor",
    chapterId: "empresa",
    requirements: { flags: ["tiene_idea"] },
    title: "Tu empresa crece",
    description: "Lo que empezó en una servilleta ahora tiene empleados.",
    options: [
      opt("expandir", "Expandir con riesgo", { money: 300, happiness: 6, influence: 12, health: -5 }, {
        unlock: { careerId: "emprendedor", careerTitle: "Emprendedor" },
        storyProgress: { storyId: "emprendedor", chapterId: "empresa", completed: true },
        resultText: "Abriste otra oficina. El miedo y el orgullo compartieron escritorio.",
      }),
      opt("estable", "Crecer despacio", { money: 150, happiness: 8, influence: 6 }, {
        unlock: { careerId: "emprendedor", careerTitle: "Emprendedor" },
        storyProgress: { storyId: "emprendedor", chapterId: "empresa", completed: true },
        resultText: "Elegiste estabilidad. También es una victoria.",
      }),
    ],
  }),
  ev({
    id: "c_adu_reencuentro",
    stage: "adultez",
    category: "amistad",
    kind: EVENT_KINDS.SPECIAL,
    title: "Un amigo de infancia",
    description: "Alguien que no veías desde niño aparece con una propuesta inesperada.",
    options: [
      opt("confiar", "Confiar en él", { happiness: 6, influence: 4, money: -30 }, {
        resultText: "Recordaron viejos tiempos. La propuesta sonaba real.",
        hook: "¿Te acuerdas de mí?",
      }),
      opt("dudar", "Ser cauteloso", { happiness: 1, influence: 2 }, {
        resultText: "Escuchaste sin comprometerte.",
      }),
    ],
  }),
];
