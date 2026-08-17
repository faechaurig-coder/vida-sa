import { getCareer } from "./careers/registry.js";
import { getStory } from "./stories/registry.js";

export function checkUnlocks(player, world) {
  const unlocks = [];

  for (const careerDef of world.catalogs?.careers ?? []) {
    if (player.careerId === careerDef.id) continue;
    if (careerDef.requiresStory) {
      const prog = player.stories[careerDef.requiresStory];
      const story = getStory(careerDef.requiresStory);
      if (prog?.completed && story) {
        unlocks.push({ type: "career", id: careerDef.id, tier: careerDef.tier });
      }
    }
  }

  if (player.fame && !player.flags.includes("fame_" + player.fame.line)) {
    unlocks.push({ type: "fame", line: player.fame.line });
  }

  return unlocks;
}

export function applyUnlocks(player, unlocks) {
  let next = { ...player, flags: [...player.flags] };
  for (const u of unlocks) {
    if (u.type === "career" && !next.careerId) {
      const career = getCareer(u.id);
      if (career) {
        next.careerId = career.id;
        next.job = career.title ?? next.job;
        next.flags.push("career_" + career.id);
      }
    }
    if (u.type === "fame") {
      next.flags.push("fame_" + u.line);
    }
  }
  return next;
}
