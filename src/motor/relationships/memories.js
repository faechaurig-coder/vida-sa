const MAX_MEMORIES = 16;
const MIN_IMPORTANCE = 3;

export function addMemory(player, spec) {
  if (!spec || (spec.importance ?? 0) < MIN_IMPORTANCE) return player;
  const year = player.calendar?.year ?? null;
  const month = player.calendar?.month ?? null;
  const entry = {
    id: spec.id ?? "mem_" + (player.memories?.length ?? 0) + "_" + (spec.type ?? "life"),
    year,
    month,
    text: interpolateMemory(spec.text, player, year),
    type: spec.type ?? "family",
    importance: spec.importance,
    echoEventId: spec.echoEventId ?? null,
  };
  let memories = [...(player.memories ?? []), entry];
  if (memories.length > MAX_MEMORIES) {
    memories = [...memories].sort((a, b) => b.importance - a.importance).slice(0, MAX_MEMORIES);
  }
  return { ...player, memories };
}

function interpolateMemory(text, player, year) {
  if (!text) return "";
  const age = player.age ?? "";
  const partner = player.family?.partner?.name ?? "tu pareja";
  return text
    .replace("{age}", String(age))
    .replace("{year}", String(year ?? ""))
    .replace("{partner}", partner);
}

export function topMemories(player, n = 5) {
  return [...(player.memories ?? [])].sort((a, b) => b.importance - a.importance).slice(0, n);
}

export function shouldRecordMemory(spec) {
  return !!spec && (spec.importance ?? 0) >= MIN_IMPORTANCE;
}
