/** Copy de jugador. Cero jerga de diseño. */

export const BOOT = {
  eyebrow: "VIDA S.A.",
  title: "¿Qué vida te toca?",
  lead: "Cada decisión cambia tu historia.",
  motto: "Tu vida es un producto. Tú eres el KPI.",
  cta: "🚀  Empezar mi vida",
  ctaReturn: "🚀  Otra vida",
};

export const INTRO_BEATS = [
  {
    id: "elige",
    kicker: "Así se juega",
    title: "Ves una situación. Eliges.",
    body: "No hay respuesta correcta. Cada camino da algo… y quita otra cosa.",
    note: "Toca. Mira qué pasa. Eso es todo.",
  },
  {
    id: "vuelve",
    kicker: "Ojo",
    title: "Lo de hoy puede volver mañana.",
    body: "A veces cobras ya. A veces la factura llega años después.",
    note: "Si algo suena demasiado bueno… probablemente lo es.",
  },
  {
    id: "otra",
    kicker: "Al final",
    title: "Vas a querer otra vida.",
    body: "Al terminar verás quién fuiste. Y qué habría pasado si elegías distinto.",
    note: "Tres formas de empezar. Ninguna es fácil.",
  },
];

export const SEED_SCREEN = {
  eyebrow: "Tu origen",
  title: "¿Cómo quieres empezar?",
  lead: "Cada comienzo tiene una ventaja… y un problema.",
};

export const STAGE_LABELS = {
  formacion: "Tus primeros años",
  arranque: "Estás arrancando",
  construccion: "Estás construyendo",
  costo: "Llegó la factura",
  balance: "El cierre",
};

export const POST_BEATS = [
  {
    kicker: "Así terminó tu vida",
    titleKey: "identity",
    bodyCollapsed: "Se acabó antes. El cuerpo o la cuenta dijeron basta.",
    bodyNormal: "Esta fuiste tú. Ni más ni menos.",
  },
  {
    kicker: "Lo que te definió",
    titleKey: "axes",
    bodyKey: "tradeoff",
  },
  {
    kicker: "Estuviste cerca",
    titleKey: "near",
    bodyNear: "Una decisión lo dejó a un paso.",
    bodyNone: "Esta vez no hubo un «casi». Hubo lo que hubo.",
  },
  {
    kicker: "¿Y si…?",
    titleKey: "question",
    bodyKey: "pv",
    cta: true,
  },
];
