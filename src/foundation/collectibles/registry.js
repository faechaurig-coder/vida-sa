import { COLLECTIBLE_KINDS, COLLECTIBLE_SLOTS } from "../constants.js";

function makeSlots(kind, count, hiddenDefault = false) {
  return Array.from({ length: count }, (_, tier) => ({
    kind,
    tier,
    id: null,
    unlocked: false,
    discovered: !hiddenDefault,
    hidden: hiddenDefault,
  }));
}

export function createEmptyCollection() {
  return {
    [COLLECTIBLE_KINDS.HOUSE]: makeSlots(COLLECTIBLE_KINDS.HOUSE, COLLECTIBLE_SLOTS.houses),
    [COLLECTIBLE_KINDS.VEHICLE]: makeSlots(COLLECTIBLE_KINDS.VEHICLE, COLLECTIBLE_SLOTS.vehicles),
    [COLLECTIBLE_KINDS.SPECIAL]: makeSlots(
      COLLECTIBLE_KINDS.SPECIAL,
      COLLECTIBLE_SLOTS.specialObjects,
      true,
    ),
  };
}

export function collectionFromWorld(worldCollection = {}) {
  const base = createEmptyCollection();
  for (const kind of Object.keys(base)) {
    const defs = worldCollection[kind] ?? [];
    base[kind] = base[kind].map((slot, i) => {
      const def = defs[i];
      if (!def) return slot;
      return {
        ...slot,
        id: def.id,
        hidden: def.hidden ?? slot.hidden,
        discovered: def.discovered ?? false,
        unlocked: def.unlocked ?? false,
      };
    });
  }
  return base;
}

export function visibleCollectibles(collection) {
  const out = { houses: [], vehicles: [], special: [] };
  for (const slot of collection.house ?? []) {
    out.houses.push(slot.discovered || slot.unlocked ? slot : { ...slot, id: "???" });
  }
  for (const slot of collection.vehicle ?? []) {
    out.vehicles.push(slot.discovered || slot.unlocked ? slot : { ...slot, id: "???" });
  }
  for (const slot of collection.special ?? []) {
    out.special.push(
      slot.unlocked ? slot : { kind: slot.kind, tier: slot.tier, hidden: true, id: null },
    );
  }
  return out;
}
