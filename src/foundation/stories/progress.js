import { STORY_TYPES } from "../constants.js";

export function createStoryProgress(storyId) {
  return {
    storyId,
    currentChapter: null,
    discoveredChapters: [],
    completed: false,
    flags: [],
  };
}

export function advanceStory(progress, chapterId, storyDef) {
  const next = {
    ...progress,
    discoveredChapters: progress.discoveredChapters.includes(chapterId)
      ? progress.discoveredChapters
      : [...progress.discoveredChapters, chapterId],
    currentChapter: chapterId,
  };
  const chapter = storyDef.chapters?.find((c) => c.id === chapterId);
  if (chapter?.completesStory) next.completed = true;
  return next;
}

export function eligibleChapters(player, storyDef) {
  const progress = player.stories[storyDef.id] ?? createStoryProgress(storyDef.id);
  if (progress.completed) return [];
  return (storyDef.chapters ?? []).filter((ch) => {
    if (progress.discoveredChapters.includes(ch.id) && ch.once) return false;
    if (ch.stage && ch.stage !== player.stage) return false;
    if (ch.minAge != null && player.age < ch.minAge) return false;
    if (ch.requireFlags?.length && !ch.requireFlags.every((f) => player.flags.includes(f))) {
      return false;
    }
    if (ch.forbidFlags?.length && ch.forbidFlags.some((f) => player.flags.includes(f))) {
      return false;
    }
    return true;
  });
}

export function storyTypeLabel(type) {
  const labels = {
    [STORY_TYPES.MAIN]: "Historia principal",
    [STORY_TYPES.SECONDARY]: "Historia secundaria",
    [STORY_TYPES.SPECIAL]: "Historia especial",
    [STORY_TYPES.LIFE_EVENT]: "Evento de vida",
  };
  return labels[type] ?? type;
}
