import { EVENTS as LEGACY_EVENTS } from "../../events.js";
import { adaptLegacyEvents } from "../../../motor/adapter/legacy.js";
import { defineEvent } from "../../catalog/schema.js";
import { EVENT_KINDS } from "../../catalog/taxonomy.js";
import { EVENT_TYPES } from "../../../motor/constants.js";

/** Eventos capitalismo — texto y decisiones del slice original, formato mensual. */
export const CAPITALISMO_EVENTS = [
  ...adaptLegacyEvents(LEGACY_EVENTS, "capitalismo"),
  defineEvent({
    id: "cap_mision_hint",
    worldId: "capitalismo",
    stage: "adultez",
    category: "dinero",
    kind: EVENT_KINDS.WORLD,
    eventType: EVENT_TYPES.LIFE,
    title: "El primer millón",
    description: "Un mentor te dice: «Aquí no se gana sobreviviendo. Se gana acumulando.»",
    options: [
      { id: "ok", text: "Entendido", effects: { influence: 3, evil: 1 }, resultText: "Tienes un norte. No es bonito." },
    ],
    weight: 0.5,
    cooldown: 24,
  }),
];
