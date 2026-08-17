/**
 * Reglas de pareja — 4 rasgos internos.
 * Generan consecuencias sobre los 5 stats y eventos futuros.
 * NO se muestran al jugador como hoja RPG.
 */
export const PARTNER_RULES = {
  traits: {
    empatia: {
      high: "Puede ayudar económicamente o apoyar decisiones (+felicidad pasiva).",
      low: "Prioriza sus propios intereses (-felicidad pasiva).",
      thresholdHigh: 70,
      thresholdLow: 30,
    },
    carrino: {
      high: "Más eventos positivos de relación (+salud pasiva).",
      low: "Más distancia o conflicto.",
      thresholdHigh: 70,
      thresholdLow: 30,
    },
    ambicion: {
      high: "Impulsa profesionalmente (+influencia) pero puede exigir más.",
      low: "Prioriza estabilidad.",
      thresholdHigh: 70,
      thresholdLow: 30,
    },
    riesgo: {
      high: "Oportunidades peligrosas (+maldad leve pasiva).",
      low: "Evita decisiones arriesgadas; con alta ambición puede costar dinero.",
      thresholdHigh: 70,
      thresholdLow: 25,
    },
  },
  implementation: "src/foundation/relationships/partner.js → partnerMonthlyEffect",
  visibleToPlayer: false,
};

export { partnerTraitKeys, createPartner, partnerMonthlyEffect } from "../../foundation/relationships/partner.js";
