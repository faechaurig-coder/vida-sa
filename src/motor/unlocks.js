import { getStoryDef } from "../content/stories/definitions.js";
import { getWorldMissions } from "../content/worlds/index.js";
import { findCollectibleMeta } from "./collection.js";
import { COLLECTIBLE_KINDS } from "../foundation/constants.js";

export function detectUnlocks(before, after) {
  const unlocks = [];
  const storyIds = new Set([
    ...Object.keys(before.player.stories ?? {}),
    ...Object.keys(after.player.stories ?? {}),
  ]);

  for (const storyId of storyIds) {
    const was = before.player.stories?.[storyId];
    const now = after.player.stories?.[storyId];
    const wasDiscovered = was?.discovered || (was?.discoveredChapters?.length ?? 0) > 0;
    const nowDiscovered = now?.discovered || (now?.discoveredChapters?.length ?? 0) > 0;

    if (!wasDiscovered && nowDiscovered) {
      unlocks.push({ type: "story", id: storyId });
    }

    const prevCh = was?.discoveredChapters ?? [];
    for (const ch of now?.discoveredChapters ?? []) {
      if (!prevCh.includes(ch)) {
        unlocks.push({ type: "chapter", storyId, chapterId: ch });
      }
    }
  }

  const completedBefore = before.missions?.completed ?? [];
  const completedAfter = after.missions?.completed ?? [];
  for (const id of completedAfter) {
    if (!completedBefore.includes(id)) {
      unlocks.push({ type: "mission", id });
    }
  }

  if ((after.player.home ?? 0) > (before.player.home ?? 0)) {
    unlocks.push({ type: "house", tier: after.player.home });
  }
  if ((after.player.car ?? 0) > (before.player.car ?? 0)) {
    unlocks.push({ type: "vehicle", tier: after.player.car });
  }

  for (const kind of [COLLECTIBLE_KINDS.HOUSE, COLLECTIBLE_KINDS.VEHICLE, COLLECTIBLE_KINDS.SPECIAL]) {
    const beforeSlots = before.player.collection?.[kind] ?? [];
    const afterSlots = after.player.collection?.[kind] ?? [];
    for (const slot of afterSlots) {
      const prev = beforeSlots.find((s) => s.tier === slot.tier);
      if (!prev?.unlocked && slot.unlocked) {
        if (kind === COLLECTIBLE_KINDS.SPECIAL) {
          unlocks.push({ type: "special", kind, tier: slot.tier, id: slot.id });
        }
      }
    }
  }

  return filterUnlocksForUI(unlocks);
}

/** Evita spam: si hay historia nueva, no mostrar capítulo del mismo turno. */
export function filterUnlocksForUI(unlocks) {
  const hasStory = unlocks.some((u) => u.type === "story");
  if (!hasStory) return unlocks;
  return unlocks.filter((u) => u.type !== "chapter");
}

export function unlockPresentation(unlock, game) {
  const worldId = game?.worldId ?? "clasico";

  if (unlock.type === "story") {
    const def = getStoryDef(unlock.id);
    return {
      kicker: "Algo se abre",
      title: def?.teaser ?? "Un camino nuevo",
      body: def?.mystery ?? "Has descubierto un nuevo camino.",
      emoji: def?.emoji ?? "📖",
    };
  }

  if (unlock.type === "chapter") {
    const def = getStoryDef(unlock.storyId);
    const ch = def?.chapters?.find((c) => c.id === unlock.chapterId);
    return {
      kicker: "Sigue tu camino",
      title: ch?.label ?? "Capítulo",
      body: "Tal vez deberías seguir haciendo esto.",
      emoji: ch?.emoji ?? "⭐",
    };
  }

  if (unlock.type === "mission") {
    const m = getWorldMissions(worldId).find((x) => x.id === unlock.id);
    return {
      kicker: "🏆 MISIÓN COMPLETADA",
      title: m?.title ?? unlock.id,
      body: (m?.completeText ?? m?.description ?? "Has superado este objetivo.") + " Pero todavía queda mucho por descubrir.",
      emoji: "🏆",
    };
  }

  if (unlock.type === "house" || unlock.type === "vehicle") {
    const kind = unlock.type === "house" ? COLLECTIBLE_KINDS.HOUSE : COLLECTIBLE_KINDS.VEHICLE;
    const meta = findCollectibleMeta(game, kind, unlock.tier);
    return {
      kicker: "NUEVO DESBLOQUEO",
      title: meta?.name ?? (unlock.type === "house" ? "Nueva casa" : "Nuevo vehículo"),
      body: meta?.description || "Algo nuevo es tuyo.",
      emoji: meta?.emoji ?? (unlock.type === "house" ? "🏠" : "🚗"),
    };
  }

  if (unlock.type === "special") {
    const meta = findCollectibleMeta(game, COLLECTIBLE_KINDS.SPECIAL, unlock.tier);
    return {
      kicker: "NUEVO DESBLOQUEO",
      title: meta?.name ?? unlock.id,
      body: meta?.description ?? "Un objeto especial entra en tu vida.",
      emoji: meta?.emoji ?? "🎁",
    };
  }

  return { kicker: "NUEVO DESBLOQUEO", title: "Descubrimiento", body: "", emoji: "✨" };
}
