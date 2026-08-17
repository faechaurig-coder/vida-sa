import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { registerStory, clearStories } from "../../src/foundation/stories/registry.js";
import { eligibleChapters, advanceStory, createStoryProgress } from "../../src/foundation/stories/progress.js";
import { STORY_TYPES } from "../../src/foundation/constants.js";

describe("foundation · historias", () => {
  it("filtra capítulos por etapa y flags", () => {
    clearStories();
    const story = registerStory({
      id: "demo",
      type: STORY_TYPES.SPECIAL,
      worldId: "capitalismo",
      chapters: [
        { id: "c1", stage: "infancia", requireFlags: ["clases_musica"] },
        { id: "c2", stage: "universidad", requireFlags: ["clases_musica"] },
      ],
    });
    const player = {
      stage: "infancia",
      age: 8,
      flags: ["clases_musica"],
      stories: {},
    };
    const eligible = eligibleChapters(player, story);
    assert.equal(eligible.length, 1);
    assert.equal(eligible[0].id, "c1");
  });

  it("avanza progreso de capítulo", () => {
    const story = { id: "demo", chapters: [{ id: "c1", completesStory: true }] };
    const next = advanceStory(createStoryProgress("demo"), "c1", story);
    assert.ok(next.discoveredChapters.includes("c1"));
    assert.equal(next.completed, true);
  });
});
