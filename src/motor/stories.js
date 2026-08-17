import { getStoryDef, storiesForWorld } from "../content/stories/definitions.js";

export const STORY_STATUS = {
  LOCKED: "locked",
  UNKNOWN: "unknown",
  IN_PROGRESS: "in_progress",
  UNLOCKED: "unlocked",
  COMPLETED: "completed",
};

function mapCareerToStory(careerId) {
  const map = {
    cantante: "cantante",
    futbolista: "futbolista",
    escritor: "escritor",
    actor: "actor",
    emprendedor: "emprendedor",
  };
  return map[careerId] ?? null;
}

export function getStoryStatus(player, def) {
  const prog = player.stories?.[def.id];
  const hasHint = def.hintFlags?.some((f) => player.flags?.includes(f));
  const discovered = prog?.discovered || (prog?.discoveredChapters?.length ?? 0) > 0;

  if (prog?.completed) return STORY_STATUS.COMPLETED;
  if (discovered || prog?.discovered) {
    if (player.careerId && mapCareerToStory(player.careerId) === def.id) {
      return STORY_STATUS.UNLOCKED;
    }
    return STORY_STATUS.IN_PROGRESS;
  }
  if (hasHint) return STORY_STATUS.UNKNOWN;
  return STORY_STATUS.LOCKED;
}

export function statusLabel(status) {
  const labels = {
    locked: "🔒 Sin descubrir",
    unknown: "❔ Rumbo desconocido",
    in_progress: "🟡 En progreso",
    unlocked: "🟢 Desbloqueada",
    completed: "🏆 Completada",
  };
  return labels[status] ?? status;
}

export function storyProgressPct(player, def) {
  const total = def.chapters?.length ?? 1;
  const done = player.stories?.[def.id]?.discoveredChapters?.length ?? 0;
  return Math.round((done / total) * 100);
}

export function chapterDisplay(player, def, chapter) {
  const discovered = player.stories?.[def.id]?.discoveredChapters ?? [];
  const isOn = discovered.includes(chapter.id);
  const orderSeen = discovered.length;
  const isNext = !isOn && chapter.order === orderSeen;
  if (isOn) return { emoji: chapter.emoji, label: chapter.label, state: "done" };
  if (isNext) return { emoji: "❔", label: "Próximo paso…", state: "next" };
  return { emoji: "?", label: "???", state: "hidden" };
}

export function listStoriesForUI(player, worldId) {
  return storiesForWorld(worldId).map((def) => {
    const status = getStoryStatus(player, def);
    return {
      def,
      status,
      progress: storyProgressPct(player, def),
      displayTitle: status === STORY_STATUS.LOCKED ? "???" : def.title,
      displayDesc:
        status === STORY_STATUS.LOCKED
          ? def.mystery
          : status === STORY_STATUS.UNKNOWN
            ? def.teaser
            : def.title + " — " + statusLabel(status),
    };
  });
}

export function applyStoryDiscovery(player, storyId, chapterId) {
  const prev = player.stories[storyId] ?? {
    storyId,
    discoveredChapters: [],
    discovered: false,
    completed: false,
  };
  const chapters = chapterId
    ? [...new Set([...prev.discoveredChapters, chapterId])]
    : prev.discoveredChapters;
  return {
    ...player,
    stories: {
      ...player.stories,
      [storyId]: {
        ...prev,
        discovered: true,
        discoveredChapters: chapters,
        currentChapter: chapterId ?? prev.currentChapter,
      },
    },
  };
}
