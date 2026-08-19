import { createGame, startMonth, resolveDecision, finishMonth } from "../loop.js";
import { pickEvent } from "../picker.js";
import { getCatalog } from "../../content/worlds/index.js";

/** RNG determinista con seed (Mulberry32). */
export function createRng(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simula vidas completas sin UI.
 * @param {object} opts
 * @param {string} opts.worldId
 * @param {number} opts.lives
 * @param {number} opts.monthsPerLife
 * @param {number} opts.seed
 * @param {function} opts.catalogFn - () => events[]
 */
export function simulateLives({
  worldId = "clasico",
  lives = 100,
  monthsPerLife = 24,
  seed = 42,
  catalogFn,
} = {}) {
  const rng = createRng(seed);
  const report = {
    lives,
    monthsPerLife,
    seed,
    eventCounts: {},
    categoryCounts: {},
    storyStarts: {},
    neverSelected: new Set(),
    decisionsPerLife: [],
    repeatedEvents: 0,
    partners: 0,
    married: 0,
    breakups: 0,
    children: 0,
    memories: 0,
    ended: 0,
    infidelity: 0,
    sources: {},
  };

  const allEventIds = new Set((catalogFn?.() ?? []).map((e) => e.id));

  for (let life = 0; life < lives; life++) {
    let game = createGame({ worldId, name: `Sim-${life}` });
    const catalog = catalogFn ? catalogFn() : getCatalog(worldId);
    let decisions = 0;
    const seenThisLife = new Set();

    for (let m = 0; m < monthsPerLife; m++) {
      try {
        game = startMonth(game, rng);
        if (game.ended) {
          report.ended++;
          break;
        }
        const ev = game.pendingEvent;
        if (!ev) break;

        report.eventCounts[ev.id] = (report.eventCounts[ev.id] ?? 0) + 1;
        report.categoryCounts[ev.category] = (report.categoryCounts[ev.category] ?? 0) + 1;
        if (game.eventSource) {
          report.sources[game.eventSource] = (report.sources[game.eventSource] ?? 0) + 1;
        }
        if (seenThisLife.has(ev.id)) report.repeatedEvents++;
        seenThisLife.add(ev.id);

        if (ev.storyId && ev.chapterId === 1) {
          report.storyStarts[ev.storyId] = (report.storyStarts[ev.storyId] ?? 0) + 1;
        }

        const opt = ev.options[rng() < 0.5 ? 0 : Math.min(1, ev.options.length - 1)];
        if (opt) {
          game = resolveDecision(game, opt.id);
          decisions++;
        }
        game = finishMonth(game);
      } catch {
        break;
      }
    }
    if (game.player.family?.partner) report.partners++;
    if (game.player.family?.partner?.status === "married") report.married++;
    if (game.player.family?.exPartners?.length) report.breakups++;
    report.children += game.player.family?.children?.length ?? 0;
    report.memories += game.player.memories?.length ?? 0;
    if (game.player.flags?.includes("fue_infiel")) report.infidelity++;
    report.decisionsPerLife.push(decisions);
  }

  for (const id of allEventIds) {
    if (!report.eventCounts[id]) report.neverSelected.add(id);
  }

  return formatReport(report);
}

function formatReport(raw) {
  const totalEvents = Object.values(raw.eventCounts).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(raw.eventCounts).sort((a, b) => b[1] - a[1]);
  const avgDecisions =
    raw.decisionsPerLife.reduce((a, b) => a + b, 0) / Math.max(1, raw.decisionsPerLife.length);

  return {
    lives: raw.lives,
    monthsPerLife: raw.monthsPerLife,
    seed: raw.seed,
    totalEventsPlayed: totalEvents,
    avgDecisionsPerLife: Math.round(avgDecisions * 10) / 10,
    topEvents: sorted.slice(0, 15),
    categoryDistribution: raw.categoryCounts,
    storyStarts: raw.storyStarts,
    eventSources: raw.sources,
    neverSelectedCount: raw.neverSelected.size,
    neverSelectedSample: [...raw.neverSelected].slice(0, 20),
    repeatedEventsInSameLife: raw.repeatedEvents,
    tooFrequent: sorted.filter(([, c]) => c > raw.lives * 0.4).map(([id, c]) => ({ id, count: c })),
    family: {
      livesWithPartner: raw.partners,
      marriages: raw.married,
      breakups: raw.breakups,
      avgChildren: Math.round((raw.children / raw.lives) * 100) / 100,
      avgMemories: Math.round((raw.memories / raw.lives) * 100) / 100,
      infidelity: raw.infidelity,
      livesEnded: raw.ended,
    },
  };
}

/** Simula solo picks mensuales (sin resolver decisiones). */
export function simulatePicks(session, catalog, months, seed = 1) {
  const rng = createRng(seed);
  const picks = [];
  let s = { ...session };

  for (let i = 0; i < months; i++) {
    s = { ...s, deferred: (s.deferred ?? []).map((d) => ({ ...d, monthsLeft: d.monthsLeft - 1 })) };
    const { event, source } = pickEvent(s, catalog, rng);
    if (!event) break;
    picks.push({ month: i + 1, eventId: event.id, category: event.category, source });
    s = {
      ...s,
      recentEvents: [event.id, ...(s.recentEvents ?? [])].slice(0, 12),
      recentCategories: [event.category, ...(s.recentCategories ?? [])].slice(0, 8),
    };
  }
  return picks;
}
