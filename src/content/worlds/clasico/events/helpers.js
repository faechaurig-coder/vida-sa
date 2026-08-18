import { defineEvent } from "../../../catalog/schema.js";

/** Factory corta para eventos del mundo clásico. */
export const ev = (spec) => defineEvent({ worldId: "clasico", ...spec });

export function opt(id, text, effects, extra = {}) {
  return { id, text, effects, ...extra };
}
