/**
 * Reglas de fama — atributo especial desbloqueable, NO stat principal.
 */
export const FAME_RULES = {
  description:
    "La fama se desbloquea cuando una historia especial lo justifica. Abre eventos, trabajos y coleccionables exclusivos.",
  lines: {
    cantante: { storyId: "cantante", label: "Fama musical" },
    futbolista: { storyId: "futbolista", label: "Fama deportiva" },
    actor: { storyId: "actor", label: "Fama en pantalla" },
    escritor: { storyId: "escritor", label: "Fama literaria" },
  },
  unlockVia: ["storyProgress", "unlock.fame en opción de evento"],
  gates: ["fameLine en requirements", "flags fame_*"],
};

export function fameLineForStory(storyId) {
  return FAME_RULES.lines[storyId] ? storyId : null;
}
