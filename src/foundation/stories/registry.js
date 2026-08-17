import { STORY_TYPES } from "../constants.js";

const stories = new Map();

export function registerStory(def) {
  if (!def?.id) throw new Error("Historia sin id");
  if (!Object.values(STORY_TYPES).includes(def.type)) {
    throw new Error("Tipo de historia inválido: " + def.type);
  }
  stories.set(def.id, { chapters: [], ...def });
  return def;
}

export function getStory(id) {
  return stories.get(id) ?? null;
}

export function storiesForWorld(worldId) {
  return [...stories.values()].filter((s) => s.worldId === worldId);
}

export function clearStories() {
  stories.clear();
}
