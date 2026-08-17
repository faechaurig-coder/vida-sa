import { LIFE_STAGES } from "./constants.js";

export function stageForAge(age) {
  const hit =
    LIFE_STAGES.find((s) => age >= s.minAge && age <= s.maxAge) ??
    LIFE_STAGES[LIFE_STAGES.length - 1];
  return hit.id;
}

export function getStageDef(stageId) {
  return LIFE_STAGES.find((s) => s.id === stageId) ?? null;
}

export function stageChanged(prevStage, nextStage) {
  return prevStage !== nextStage;
}
