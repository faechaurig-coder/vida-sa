const KEY = "vida-sa-slice";

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { meta: emptyMeta(), session: null };
    const data = JSON.parse(raw);
    return {
      meta: { ...emptyMeta(), ...data.meta },
      session: data.session ?? null,
    };
  } catch {
    return { meta: emptyMeta(), session: null };
  }
}

export function saveAll(meta, session) {
  localStorage.setItem(KEY, JSON.stringify({ meta, session }));
}

export function emptyMeta() {
  return {
    lives: 0,
    pv: 0,
    lastPvGain: 0,
    lastEpitaph: "",
    lastIdentity: "",
    seeds: [],
    maxHome: 0,
    maxCar: 0,
  };
}

export function rememberLife(meta, run, rank, gained = 0) {
  return {
    ...meta,
    lives: (meta.lives ?? 0) + 1,
    pv: (meta.pv ?? 0) + gained,
    lastPvGain: gained,
    lastEpitaph: rank.identity,
    lastIdentity: rank.dominant + " / " + rank.neglected,
    seeds: [...new Set([...(meta.seeds ?? []), run.seedId])],
    maxHome: Math.max(meta.maxHome ?? 0, run.home),
    maxCar: Math.max(meta.maxCar ?? 0, run.car),
  };
}
