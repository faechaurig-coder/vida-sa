/** Módulo inicial: copy de arranque, onboarding y post-vida. */

export const BOOT = {
  eyebrow: "Departamento de Existencias",
  title: "Tu vida ya está en el catálogo.",
  lead: "VIDA S.A. no vende sueños. Los empaqueta, los mide y te cobra el envío.",
  sub: "Una vida comprimida. Decisiones reales. Consecuencias que regresan. Al final, un balance que no perdona.",
  cta: "Firmar contrato",
  ctaReturn: "Nueva vida",
};

export const INTRO_BEATS = [
  {
    id: "producto",
    kicker: "Cláusula 1",
    title: "Eres un activo en revisión.",
    body: "Cada elección mueve dinero, salud, vínculos y estatus. No hay barra de guardado dentro de la vida. Lo que eliges, se queda.",
    note: "El juego no te explica el manual. Te cobra el aprendizaje.",
  },
  {
    id: "consecuencias",
    kicker: "Cláusula 2",
    title: "Lo que hoy parece barato, mañana factura.",
    body: "Algunas decisiones vuelven años después. Otras te suben de piso, de auto o de deuda. La sátira no está en el texto: está en las reglas.",
    note: "No hay una build perfecta. Solo trade-offs con recibo.",
  },
  {
    id: "meta",
    kicker: "Cláusula 3",
    title: "Al morir, recibes un informe.",
    body: "Tu vida termina con un epitafio, un rango y Puntos de Vida. Los PV no compran el final: compran comodines para la siguiente.",
    note: "Tres semillas. Mismo mundo. Vidas que no se repiten igual.",
  },
];

export const SEED_SCREEN = {
  eyebrow: "Asignación de origen",
  title: "Elige de dónde arrancas.",
  lead: "No es un buff. Es la tensión que te persigue toda la vida.",
};

export const STAGE_LABELS = {
  formacion: "Formación",
  arranque: "Arranque",
  construccion: "Construcción",
  costo: "Costo",
  balance: "Balance",
};

export const POST_BEATS = [
  {
    kicker: "Acta de cierre",
    titleKey: "identity",
    bodyCollapsed: "El cuerpo o la cuenta cerraron el expediente antes de tiempo.",
    bodyNormal: "La vida terminó. El informe, no.",
  },
  {
    kicker: "Lectura de balance",
    titleKey: "axes",
    bodyKey: "tradeoff",
  },
  {
    kicker: "Casi",
    titleKey: "near",
    bodyNear: "Una decisión lo dejó a un paso. Otra vida podría haberlo cruzado.",
    bodyNone: "Esta vez no hubo casi. Solo lo que quedó escrito.",
  },
  {
    kicker: "Siguiente expediente",
    titleKey: "question",
    bodyKey: "pv",
    cta: true,
  },
];
