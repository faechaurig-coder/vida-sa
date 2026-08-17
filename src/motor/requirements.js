/**
 * Requisitos condicionales — pocas variables, muchas situaciones.
 */
export function meetsRequirements(player, req = {}) {
  if (!req) return true;
  const s = player.stats;

  if (req.stage && player.stage !== req.stage) return false;
  if (req.stages?.length && !req.stages.includes(player.stage)) return false;

  if (req.ageMin != null && player.age < req.ageMin) return false;
  if (req.ageMax != null && player.age > req.ageMax) return false;

  if (req.moneyMin != null && s.dinero < req.moneyMin) return false;
  if (req.moneyMax != null && s.dinero > req.moneyMax) return false;
  if (req.influenceMin != null && s.influencia < req.influenceMin) return false;
  if (req.influenceMax != null && s.influencia > req.influenceMax) return false;
  if (req.evilMin != null && s.maldad < req.evilMin) return false;
  if (req.evilMax != null && s.maldad > req.evilMax) return false;
  if (req.healthMin != null && s.salud < req.healthMin) return false;
  if (req.happinessMin != null && s.felicidad < req.happinessMin) return false;

  if (req.hasJob === true && !player.job) return false;
  if (req.hasJob === false && player.job) return false;
  if (req.hasPartner === true && !player.partner?.active) return false;
  if (req.hasPartner === false && player.partner?.active) return false;
  if (req.careerId && player.careerId !== req.careerId) return false;

  if (req.flags?.length && !req.flags.every((f) => player.flags.includes(f))) return false;
  if (req.flagsNot?.length && req.flagsNot.some((f) => player.flags.includes(f))) return false;
  if (req.requireFlags?.length && !req.requireFlags.every((f) => player.flags.includes(f))) return false;
  if (req.forbidFlags?.length && req.forbidFlags.some((f) => player.flags.includes(f))) return false;

  if (req.decisions?.length) {
    const log = player.decisions ?? [];
    if (!req.decisions.every((d) => log.includes(d))) return false;
  }

  if (req.storyId) {
    const prog = player.stories?.[req.storyId];
    if (!prog) return false;
    if (req.storyChapter && prog.currentChapter !== req.storyChapter) return false;
    if (req.storyActive && prog.completed) return false;
  }

  if (req.fameLine && player.fame?.line !== req.fameLine) return false;

  if (req.collectible != null) {
    const { kind, tier, unlocked } = req.collectible;
    const slot = player.collection?.[kind]?.find((c) => c.tier === tier);
    if (!slot) return false;
    if (unlocked && !slot.unlocked) return false;
  }

  return true;
}

export function filterEligible(events, player) {
  return events.filter((ev) => meetsRequirements(player, ev.requirements ?? buildLegacyReq(ev)));
}

/** Compatibilidad con eventos legacy (requireFlags en raíz). */
function buildLegacyReq(ev) {
  const r = {};
  if (ev.requireFlags) r.requireFlags = ev.requireFlags;
  if (ev.forbidFlags) r.forbidFlags = ev.forbidFlags;
  if (ev.stage) r.stage = mapLegacyStage(ev.stage) ?? ev.stage;
  return Object.keys(r).length ? r : null;
}

const LEGACY_STAGE = {
  formacion: "adolescencia",
  arranque: "universidad",
  construccion: "adultez",
  costo: "adultez",
  balance: "adultez",
};

export function mapLegacyStage(stage) {
  return LEGACY_STAGE[stage] ?? stage;
}
