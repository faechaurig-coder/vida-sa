import { CLASSIC_EVENTS } from "./clasico/events.js";
import { CLASSIC_STORIES, CLASSIC_CAREERS, CLASSIC_MISSIONS, CLASSIC_COLLECTIBLES } from "./clasico/meta.js";
import { CAPITALISMO_EVENTS } from "./capitalismo/events.js";
import { CAPITALISMO_MISSIONS, CAPITALISMO_COLLECTIBLES } from "./capitalismo/meta.js";
import { SEEDS } from "../seeds.js";
import { buildWorldCatalog } from "../catalog/index.js";

const WORLDS = {
  clasico: {
    id: "clasico",
    name: "Clásico",
    description: "Una vida normal. Familia, escuela, trabajo, amor.",
    events: CLASSIC_EVENTS,
    stories: CLASSIC_STORIES,
    careers: CLASSIC_CAREERS,
    missions: CLASSIC_MISSIONS,
    collectibles: CLASSIC_COLLECTIBLES,
    origins: null,
  },
  capitalismo: {
    id: "capitalismo",
    name: "Capitalismo",
    description: "VIDA S.A. — el precio real del éxito.",
    events: CAPITALISMO_EVENTS,
    stories: [],
    careers: [],
    missions: CAPITALISMO_MISSIONS,
    collectibles: CAPITALISMO_COLLECTIBLES,
    origins: SEEDS,
  },
};

const CATALOGS = {
  clasico: buildWorldCatalog("clasico", CLASSIC_EVENTS),
  capitalismo: buildWorldCatalog("capitalismo", CAPITALISMO_EVENTS),
};

export function getCatalog(worldId) {
  return CATALOGS[worldId]?.events ?? WORLDS[worldId]?.events ?? [];
}

export function getCatalogIndex(worldId) {
  return CATALOGS[worldId]?.index ?? null;
}

export function getContentMatrix(worldId) {
  return CATALOGS[worldId]?.matrix ?? [];
}

export function getWorldDef(worldId) {
  return WORLDS[worldId] ?? null;
}

export function listPlayableWorlds() {
  return Object.values(WORLDS).map((w) => ({
    id: w.id,
    name: w.name,
    description: w.description,
  }));
}

export function getWorldMissions(worldId) {
  return WORLDS[worldId]?.missions ?? [];
}

export function getWorldOrigins(worldId) {
  return WORLDS[worldId]?.origins ?? null;
}

export { WORLDS, CATALOGS };
