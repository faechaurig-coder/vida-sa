import { meetsRequirements } from "../requirements.js";
import { EVENT_KINDS } from "../../content/catalog/taxonomy.js";

const RECENT_BLOCK = 2;

/** Explica por qué un evento puede o no aparecer. Solo desarrollo. */
export function explainEventEligibility(event, session, catalog = []) {
  const { player } = session;
  const checks = [];

  const reqOk = meetsRequirements(player, event.requirements);
  checks.push({
    id: "requirements",
    label: "Requisitos",
    passed: reqOk,
    detail: reqOk ? "Cumplidos" : "No cumplidos",
  });

  const exclusive = event.exclusive && session.seenExclusive?.includes(event.id);
  checks.push({
    id: "exclusive",
    label: "Exclusividad",
    passed: !exclusive,
    detail: exclusive ? "Ya visto (exclusivo)" : "Disponible",
  });

  const cd = session.cooldowns?.[event.id] ?? 0;
  checks.push({
    id: "cooldown",
    label: "Cooldown",
    passed: cd <= 0,
    detail: cd > 0 ? `${cd} mes(es) restante(s)` : "Listo",
    value: cd,
  });

  const recent = (session.recentEvents ?? []).slice(0, RECENT_BLOCK).includes(event.id);
  checks.push({
    id: "recent",
    label: "Historial reciente",
    passed: !recent,
    detail: recent ? "Jugado muy recientemente" : "OK",
  });

  const chapterSeen = chapterAlreadySeen(event, player);
  checks.push({
    id: "chapter",
    label: "Capítulo de historia",
    passed: !chapterSeen,
    detail: chapterSeen ? "Capítulo ya descubierto" : "OK",
  });

  const eligible = checks.every((c) => c.passed);
  const weight = estimateWeight(event, player, session, catalog);

  return {
    eventId: event.id,
    eligible,
    checks,
    metadata: {
      stage: player.stage,
      category: event.category,
      kind: event.kind,
      priority: event.priority ?? 0,
      weight: event.weight ?? 1,
      estimatedWeight: weight,
      rarity: event.rarity ?? "normal",
      storyId: event.storyId ?? null,
      flags: [...(player.flags ?? [])],
    },
    summary: eligible
      ? "Este evento PUEDE aparecer."
      : "Este evento NO puede aparecer.",
  };
}

function chapterAlreadySeen(ev, player) {
  if (!ev.storyId || !ev.chapterId) return false;
  return (player.stories?.[ev.storyId]?.discoveredChapters ?? []).includes(ev.chapterId);
}

function estimateWeight(ev, player, session, catalog) {
  let w = ev.weight ?? 1;
  const recent = new Set(session.recentEvents ?? []);
  if (!recent.has(ev.id)) w *= 1.85;
  else w *= 0.08;
  if (ev.kind === EVENT_KINDS.STORY) w *= 2.2;
  if (ev.rarity === "rare" || ev.rarity === "legendary") w *= 0.5;
  if (ev.priority) w *= 1 + ev.priority * 0.1;
  const recentCats = session.recentCategories ?? [];
  if (recentCats.slice(0, 2).includes(ev.category)) w *= 0.35;
  return Math.round(w * 100) / 100;
}

export function explainAllEvents(session, catalog) {
  return catalog.map((ev) => explainEventEligibility(ev, session, catalog));
}
