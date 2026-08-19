import { createPartner } from "../../foundation/relationships/partner.js";

const FIRST = ["Luna", "Mateo", "Sofía", "Diego", "Valentina", "Leo", "Camila", "Noah", "Emma", "Gael"];
const LAST = ["Ríos", "Vega", "Cruz", "Mora", "Solís", "Paz", "Núñez", "Reyes"];
const CHILD_TRAITS = ["curious", "steady", "restless"];

export const PARTNER_STATUS = {
  DATING: "dating",
  COHABITING: "cohabiting",
  MARRIED: "married",
  SEPARATED: "separated",
  EX: "ex",
};

function pick(list, n) {
  return list[Math.abs(n) % list.length];
}

export function emptyFamily() {
  return {
    origin: { mother: null, father: null, sibling: null },
    partner: null,
    exPartners: [],
    children: [],
    friend: null,
  };
}

export function createPerson({ id, name, type, role = "secundario", status = "active", extra = {} }) {
  return {
    id,
    name,
    type,
    role,
    status,
    flags: [],
    playable: false,
    ...extra,
  };
}

export function seedOriginFamily(player, rng = Math.random) {
  const n = Math.floor(rng() * 9999);
  const mother = createPerson({
    id: "origin_madre",
    name: pick(FIRST, n) + " " + pick(LAST, n + 1),
    type: "madre",
    extra: { birthYear: (player.birth?.year ?? 2018) - 28 },
  });
  const father = createPerson({
    id: "origin_padre",
    name: pick(FIRST, n + 3) + " " + pick(LAST, n + 2),
    type: "padre",
    extra: { birthYear: (player.birth?.year ?? 2018) - 30 },
  });
  const sibling =
    rng() < 0.5
      ? createPerson({
          id: "origin_hermano",
          name: pick(FIRST, n + 7) + " " + pick(LAST, n + 2),
          type: "hermano",
          extra: { birthYear: (player.birth?.year ?? 2018) + (rng() < 0.5 ? 2 : -2) },
        })
      : null;
  return {
    ...emptyFamily(),
    origin: { mother, father, sibling },
  };
}

export function partnerName(rng = Math.random) {
  const n = Math.floor(rng() * 9999);
  return pick(FIRST, n + 11) + " " + pick(LAST, n + 4);
}

export function beginRelationship(player, { name, traits, status = PARTNER_STATUS.DATING, rng = Math.random } = {}) {
  const engine = createPartner(traits ?? {});
  const person = createPerson({
    id: "partner_current",
    name: name ?? partnerName(rng),
    type: "pareja",
    role: "principal",
    status,
    extra: {
      traits: engine.traits,
      sinceYear: player.calendar?.year ?? null,
      sinceMonth: player.calendar?.month ?? null,
    },
  });
  return syncPartnerMirror({
    ...player,
    partner: engine,
    flags: uniqueFlags(player.flags, ["tiene_pareja"]),
    family: {
      ...ensureFamily(player),
      partner: person,
    },
  });
}

export function setPartnerStatus(player, status) {
  const family = ensureFamily(player);
  if (!family.partner) return player;
  const partner = { ...family.partner, status };
  const flags = [...(player.flags ?? [])];
  const add = {
    [PARTNER_STATUS.COHABITING]: "vive_con_pareja",
    [PARTNER_STATUS.MARRIED]: "casado",
    [PARTNER_STATUS.DATING]: "tiene_pareja",
  }[status];
  if (add && !flags.includes(add)) flags.push(add);
  if (status === PARTNER_STATUS.MARRIED && !flags.includes("tiene_pareja")) flags.push("tiene_pareja");
  return {
    ...player,
    flags,
    family: { ...family, partner },
    partner: player.partner ? { ...player.partner, active: true } : player.partner,
  };
}

export function breakUp(player) {
  const family = ensureFamily(player);
  const current = family.partner;
  if (!current) {
    return { ...player, partner: null, flags: stripPartnerFlags(player.flags) };
  }
  const ex = { ...current, status: PARTNER_STATUS.EX, id: "ex_" + (family.exPartners?.length ?? 0) };
  const exPartners = [...(family.exPartners ?? []), ex].slice(-3);
  return {
    ...player,
    partner: null,
    flags: stripPartnerFlags(player.flags).concat(["tuvo_expareja"]),
    family: { ...family, partner: null, exPartners },
  };
}

export function reconcile(player) {
  const family = ensureFamily(player);
  const last = family.exPartners?.[family.exPartners.length - 1];
  if (!last) return player;
  const engine = createPartner(last.traits ?? {});
  const partner = { ...last, id: "partner_current", status: PARTNER_STATUS.DATING, type: "pareja", role: "principal" };
  return {
    ...player,
    partner: engine,
    flags: uniqueFlags(stripPartnerFlags(player.flags), ["tiene_pareja", "reconciliado"]),
    family: {
      ...family,
      partner,
      exPartners: family.exPartners.slice(0, -1),
    },
  };
}

export function addChild(player, { name, personality, rng = Math.random } = {}) {
  const family = ensureFamily(player);
  if ((family.children ?? []).length >= 3) return player;
  const n = Math.floor(rng() * 99);
  const child = createPerson({
    id: "child_" + family.children.length,
    name: name ?? pick(FIRST, n + 20),
    type: "hijo",
    role: "principal",
    extra: {
      birthYear: player.calendar?.year ?? 2026,
      personality: personality ?? CHILD_TRAITS[n % CHILD_TRAITS.length],
      playable: false,
    },
  });
  return {
    ...player,
    flags: uniqueFlags(player.flags, ["tuvo_hijo"]),
    family: { ...family, children: [...family.children, child] },
  };
}

export function childAge(child, calendarYear) {
  if (child.birthYear == null) return 0;
  return Math.max(0, (calendarYear ?? 2026) - child.birthYear);
}

export function ensureFamily(player) {
  return player.family ?? emptyFamily();
}

export function syncPartnerMirror(player) {
  const family = ensureFamily(player);
  if (player.partner?.active && !family.partner) {
    return beginRelationship(player, { traits: player.partner.traits });
  }
  if (!player.partner && family.partner && family.partner.status !== PARTNER_STATUS.EX) {
    return breakUp(player);
  }
  return { ...player, family };
}

export function applyRelationshipEffects(player, fx = {}) {
  let next = player;
  if (fx.beginPartner) next = beginRelationship(next, fx.beginPartner === true ? {} : fx.beginPartner);
  if (fx.partnerStatus) next = setPartnerStatus(next, fx.partnerStatus);
  if (fx.breakUp) next = breakUp(next);
  if (fx.reconcile) next = reconcile(next);
  if (fx.addChild) next = addChild(next, typeof fx.addChild === "object" ? fx.addChild : {});
  if (fx.friendName) {
    const family = ensureFamily(next);
    next = {
      ...next,
      family: {
        ...family,
        friend: createPerson({
          id: "amigo",
          name: fx.friendName,
          type: "amigo",
          extra: { playable: false },
        }),
      },
    };
  }
  return next;
}

export function isChildPlayable() {
  return false;
}

function uniqueFlags(flags = [], add = []) {
  return [...new Set([...flags, ...add])];
}

function stripPartnerFlags(flags = []) {
  const drop = new Set(["tiene_pareja", "vive_con_pareja", "casado"]);
  return flags.filter((f) => !drop.has(f));
}
