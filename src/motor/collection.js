import { createEmptyCollection } from "../foundation/collectibles/registry.js";
import { COLLECTIBLE_KINDS } from "../foundation/constants.js";
import { getWorldDef } from "../content/worlds/index.js";

export function initGameCollection(worldCollectibles) {
  if (!worldCollectibles) return createEmptyCollection();
  const base = createEmptyCollection();
  for (const kind of Object.keys(base)) {
    const defs = worldCollectibles[kind] ?? [];
    base[kind] = base[kind].map((slot, i) => {
      const def = defs[i];
      if (!def) return slot;
      return {
        ...slot,
        id: def.id,
        name: def.name ?? def.id,
        price: def.price ?? 0,
        description: def.description ?? "",
        emoji: def.emoji ?? (kind === COLLECTIBLE_KINDS.HOUSE ? "🏠" : kind === COLLECTIBLE_KINDS.VEHICLE ? "🚗" : "🎁"),
        hidden: def.hidden ?? slot.hidden,
        discovered: def.discovered ?? kind !== COLLECTIBLE_KINDS.SPECIAL,
        unlocked: def.unlocked ?? false,
      };
    });
  }
  return base;
}

export function syncCollectionFromPlayer(player) {
  const collection = player.collection ?? createEmptyCollection();
  const home = player.home ?? 0;
  const car = player.car ?? 0;

  const syncKind = (kind, level) => ({
    ...collection,
    [kind]: (collection[kind] ?? []).map((slot) => {
      if (slot.hidden) return slot;
      const acquired = level > 0 && slot.tier < level;
      const current = level > 0 && slot.tier === level - 1;
      return {
        ...slot,
        discovered: slot.discovered || acquired || current,
        unlocked: slot.unlocked || acquired,
        current,
      };
    }),
  });

  let next = syncKind(COLLECTIBLE_KINDS.HOUSE, home);
  next = syncKind(COLLECTIBLE_KINDS.VEHICLE, car);
  return { ...player, collection: next };
}

export function slotState(slot, money = 0) {
  if (slot.hidden && !slot.unlocked) return "hidden";
  if (slot.unlocked) return "acquired";
  if (slot.discovered && money >= (slot.price ?? 0)) return "available";
  if (slot.discovered) return "locked";
  return "locked";
}

export function slotStateLabel(state) {
  const labels = {
    hidden: "???",
    locked: "🔒 Bloqueado",
    available: "💰 Disponible",
    acquired: "✓ Adquirido",
  };
  return labels[state] ?? state;
}

export function collectionView(game) {
  const world = getWorldDef(game.worldId);
  const money = game.player.stats?.dinero ?? 0;
  const collection = game.player.collection ?? createEmptyCollection();

  const mapSlots = (kind) =>
    (collection[kind] ?? []).map((slot) => {
      const state = slotState(slot, money);
      const hidden = state === "hidden";
      return {
        ...slot,
        state,
        stateLabel: slotStateLabel(state),
        displayName: hidden ? "???" : slot.name ?? slot.id,
        displayDesc: hidden ? "Objeto desconocido" : slot.description ?? "",
      };
    });

  return {
    worldName: world?.name ?? game.worldId,
    houses: mapSlots(COLLECTIBLE_KINDS.HOUSE),
    vehicles: mapSlots(COLLECTIBLE_KINDS.VEHICLE),
    special: mapSlots(COLLECTIBLE_KINDS.SPECIAL),
  };
}

export function findCollectibleMeta(game, kind, tier) {
  const slot = game.player.collection?.[kind]?.find((s) => s.tier === tier);
  return slot ?? null;
}
