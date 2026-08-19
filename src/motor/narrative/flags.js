/** Flags = hechos del historial. No son estadísticas. */

export function hasFlag(player, flag) {
  return (player?.flags ?? []).includes(flag);
}

export function hasAllFlags(player, flags = []) {
  return flags.every((f) => hasFlag(player, f));
}

export function addFlags(player, flags = []) {
  if (!flags.length) return player;
  const set = new Set(player.flags ?? []);
  for (const f of flags) set.add(f);
  return { ...player, flags: [...set] };
}

export function removeFlags(player, flags = []) {
  if (!flags.length) return player;
  const drop = new Set(flags);
  return { ...player, flags: (player.flags ?? []).filter((f) => !drop.has(f)) };
}

export function applyFlagChanges(player, { add = [], remove = [] } = {}) {
  return removeFlags(addFlags(player, add), remove);
}
