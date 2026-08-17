import { MONTH_KINDS } from "../constants.js";
import { registerStory } from "../stories/registry.js";
import { registerCareer } from "../careers/registry.js";
import { collectionFromWorld } from "../collectibles/registry.js";

const worlds = new Map();

export function registerWorld(def) {
  if (!def?.id) throw new Error("Mundo sin id");
  worlds.set(def.id, def);
  for (const story of def.catalogs?.stories ?? []) registerStory(story);
  for (const career of def.catalogs?.careers ?? []) registerCareer(career);
  return def;
}

export function getWorld(id) {
  return worlds.get(id) ?? null;
}

export function listWorlds() {
  return [...worlds.values()];
}

export function clearWorlds() {
  worlds.clear();
}

/** Mundo por defecto — referencia al vertical slice actual sin duplicar motor. */
export function bootstrapDefaultWorld() {
  return registerWorld({
    id: "capitalismo",
    name: "Capitalismo",
    identity: { theme: "vida-sa-slice" },
    rules: {
      monthDistribution: {
        [MONTH_KINDS.QUIET]: 0.28,
        [MONTH_KINDS.NORMAL]: 0.34,
        [MONTH_KINDS.DECISION]: 0.26,
        [MONTH_KINDS.SPECIAL]: 0.08,
        [MONTH_KINDS.STORY]: 0.04,
      },
      legacyEventCatalog: "events.js",
      legacySeedCatalog: "seeds.js",
    },
    catalogs: {
      events: [],
      decisions: [],
      stories: [
        {
          id: "artista",
          type: "special",
          worldId: "capitalismo",
          title: "Línea artística",
          chapters: [
            { id: "musica_infancia", stage: "infancia", requireFlags: ["clases_musica"] },
            { id: "evento_universidad", stage: "universidad", requireFlags: ["clases_musica"] },
            { id: "primer_trabajo_arte", stage: "adultez", requireFlags: ["clases_musica"] },
          ],
          rewards: { fameLine: "artista" },
        },
      ],
      careers: [
        {
          id: "artista",
          worldId: "capitalismo",
          tier: "especial",
          title: "Artista",
          requiresStory: "artista",
        },
      ],
      collectibles: {
        house: [
          { id: "caja" },
          { id: "cuarto" },
          { id: "depto" },
          { id: "casa" },
          { id: "mansion" },
        ],
        vehicle: [
          { id: "ninguno" },
          { id: "usado" },
          { id: "sedan" },
          { id: "suv" },
          { id: "lujo" },
        ],
        special: [{ id: "talento_oculto", hidden: true }, { id: "contacto_viejo", hidden: true }, { id: "herencia", hidden: true }],
      },
    },
    mission: { main: null, secondary: [] },
  });
}

export function initialCollectionForWorld(worldId) {
  const world = getWorld(worldId);
  if (!world) return null;
  return collectionFromWorld(world.catalogs?.collectibles);
}
