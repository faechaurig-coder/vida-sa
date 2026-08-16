/** Capa de presentación. No cambia reglas. */

export const ICO = {
  money: "💰",
  hap: "❤️",
  hp: "🫀",
  job: "💼",
  home: "🏠",
  car: "🚗",
  study: "🎓",
  spark: "✨",
  risk: "😬",
  fire: "🔥",
  loss: "💔",
  status: "😎",
  family: "👨‍👩‍👧",
  time: "⏳",
  up: "📈",
  down: "📉",
  gift: "🎁",
  lock: "🔒",
  trophy: "🏆",
  crown: "👑",
  play: "🚀",
};

export const AXIS_PLAYER = {
  dinero: { icon: "💰", high: "Te fue muy bien con el dinero.", low: "El dinero no te alcanzó." },
  felicidad: { icon: "❤️", high: "Supiste disfrutar.", low: "Te faltó tiempo para ti." },
  salud: { icon: "🫀", high: "Cuidaste tu cuerpo.", low: "El cuerpo pagó la cuenta." },
  vinculos: { icon: "👨‍👩‍👧", high: "Alguien te esperaba.", low: "Te quedaste solo." },
  estatus: { icon: "😎", high: "Ahora todos te miran distinto.", low: "Nadie te veía." },
};

export const STAGE_PLAYER = {
  formacion: "Tus primeros años",
  arranque: "Estás arrancando",
  construccion: "Estás construyendo",
  costo: "Llegó la factura",
  balance: "El cierre",
};

export const HOME_PLAYER = ["Sin casa", "Tu pieza", "Tu depto", "Tu casa", "Casa premium", "Tu mansión"];
export const CAR_PLAYER = ["A pie", "Tu primer auto", "Auto usado", "Auto nuevo", "Auto premium", "Auto de lujo"];
export const HOME_EMOJI = ["📦", "🚪", "🏢", "🏡", "🏠✨", "🏰"];
export const CAR_EMOJI = ["🚫", "🛴", "🚗", "🚘", "🏎️", "🚗✨"];

export const LIFE_MARKS = [
  { age: 16, icon: "👶" },
  { age: 20, icon: "🎓" },
  { age: 26, icon: "💼" },
  { age: 34, icon: "🏠" },
  { age: 42, icon: "❤️" },
  { age: 50, icon: "🌅" },
];

export function lifeProgress(age) {
  return Math.max(0, Math.min(1, (age - 16) / 34));
}

export function yearsLine(years) {
  if (years <= 1) return "Un año después…";
  return years + " años después…";
}
