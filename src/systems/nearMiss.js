export function computeNearMiss(run) {
  if (run.flags.includes("deuda") && run.home < 3) {
    return {
      kind: "home",
      text: "Estuviste a un peldaño de la casa. El banco ya tenía tu nombre.",
    };
  }
  if (run.flags.includes("atajo") && !run.flags.includes("estudio")) {
    return {
      kind: "study",
      text: "Una entrevista pidió título. Tú tenías oficio y una historia.",
    };
  }
  if (run.flags.includes("casi_lujo") && run.car < 5) {
    return {
      kind: "car",
      text: "El lease de lujo estuvo en la mesa. Firmaste otra cosa.",
    };
  }
  if (run.flags.includes("llamada_perdida")) {
    return {
      kind: "bonds",
      text: "Alguien llamó dos veces. La tercera no existió.",
    };
  }
  if (run.money >= 280 && run.money < 420 && run.home < 3) {
    return {
      kind: "home",
      text: "Te alcanzó para soñar el techo. No para firmarlo.",
    };
  }
  return null;
}
