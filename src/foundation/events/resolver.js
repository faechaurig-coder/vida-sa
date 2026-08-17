import { applyConsequences } from "../effects.js";
import { advanceStory, createStoryProgress } from "../stories/progress.js";

export function resolveDecision(player, event, optionId, context = {}) {
  const option = event.options?.find((o) => o.id === optionId);
  if (!option) throw new Error("Opción desconocida: " + optionId);

  let next = applyConsequences(player, option.consequence ?? option.immediate ?? {});
  next.seenEvents = [...next.seenEvents, event.id];
  next.log = [...next.log, event.id + ":" + optionId];

  if (context.story && context.chapter) {
    const progress = next.stories[context.story.id] ?? createStoryProgress(context.story.id);
    next.stories = {
      ...next.stories,
      [context.story.id]: advanceStory(progress, context.chapter.id, context.story),
    };
    if (context.story.rewards?.fameLine && context.chapter.unlocksFame) {
      next.fame = { line: context.story.rewards.fameLine, level: 1 };
    }
  }

  return {
    player: next,
    option,
    summary: option.summary ?? option.punchline ?? "",
  };
}
