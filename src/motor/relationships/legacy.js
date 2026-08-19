import { topMemories } from "./memories.js";
import { childAge, ensureFamily } from "./people.js";

export function shouldEndLife(player) {
  if (!player) return false;
  if ((player.age ?? 0) >= 75) return true;
  if ((player.stats?.salud ?? 100) <= 0) return true;
  return false;
}

export function buildLifeSummary(player) {
  const family = ensureFamily(player);
  const year = player.calendar?.year;
  const children = (family.children ?? []).map((c) => ({
    name: c.name,
    age: childAge(c, year),
    playable: false,
  }));
  const stories = Object.values(player.stories ?? {}).filter((s) => s.discovered);
  const facts = collectFacts(player, family, stories);
  return {
    age: player.age,
    name: player.name,
    dinero: player.stats?.dinero ?? 0,
    homes: player.home ?? 0,
    cars: player.car ?? 0,
    business: player.business ? 1 : 0,
    partner: family.partner?.name ?? null,
    partnerStatus: family.partner?.status ?? null,
    children,
    childrenCount: children.length,
    storiesDiscovered: stories.map((s) => s.storyId),
    storiesCount: stories.length,
    memories: topMemories(player, 5),
    sentence: sentenceFromFacts(facts),
    facts,
  };
}

function collectFacts(player, family, stories) {
  const flags = player.flags ?? [];
  return {
    family: childrenOrPartner(family),
    musicLeft: flags.includes("musica_abandonada"),
    musicFame: player.fame?.line === "cantante" || flags.includes("fame_cantante"),
    business: !!player.business || flags.includes("tiene_negocio") || player.careerId === "emprendedor",
    football: player.fame?.line === "futbolista",
    writer: player.fame?.line === "escritor",
    actor: player.fame?.line === "actor",
    infidelity: flags.includes("fue_infiel"),
    rich: (player.stats?.dinero ?? 0) >= 200000,
    poor: (player.stats?.dinero ?? 0) < 5000,
    storyId: stories[0]?.storyId ?? null,
  };
}

function childrenOrPartner(family) {
  if ((family.children ?? []).length) return "family";
  if (family.partner) return "partner";
  return "alone";
}

export function sentenceFromFacts(f) {
  const bits = [];
  if (f.family === "family") bits.push("Formaste una familia");
  else if (f.family === "partner") bits.push("Construiste una relación");
  else bits.push("Recorriste el camino principalmente solo");

  if (f.musicFame) bits.push("la música te reconoció");
  else if (f.musicLeft) bits.push("abandonaste la música");
  else if (f.football) bits.push("el fútbol marcó tu nombre");
  else if (f.writer) bits.push("las palabras te sobrevivieron");
  else if (f.actor) bits.push("el escenario te cambió");

  if (f.business) bits.push("un negocio quedó en pie");
  else if (f.rich) bits.push("el dinero sobró");
  else if (f.poor) bits.push("el dinero nunca sobró");

  if (f.infidelity) bits.push("hubo secretos que no contaste");

  if (bits.length === 1) return bits[0] + ".";
  const last = bits.pop();
  return bits.join(", ") + " y " + last + ".";
}

export function mergeGlobalLegacy(meta, summary) {
  const stories = [...new Set([...(meta.storiesDiscovered ?? []), ...(summary.storiesDiscovered ?? [])])];
  return {
    ...meta,
    lives: (meta.lives ?? 0) + 1,
    storiesDiscovered: stories,
    maxHome: Math.max(meta.maxHome ?? 0, summary.homes ?? 0),
    maxCar: Math.max(meta.maxCar ?? 0, summary.cars ?? 0),
    lastEpitaph: summary.sentence,
    lastIdentity: summary.name,
  };
}

export function newLifeConfigFromMeta(meta, { worldId = "clasico", name = "Tú" } = {}) {
  return {
    worldId,
    name,
    stats: { dinero: 0 },
    partner: null,
    home: 0,
    car: 0,
    business: null,
    flags: [],
    stories: {},
    carryStories: meta.storiesDiscovered ?? [],
  };
}
