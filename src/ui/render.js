import { SEEDS } from "../content/seeds.js";
import { PERKS } from "../content/perks.js";
import {
  BOOT,
  INTRO_BEATS,
  POST_BEATS,
  SEED_SCREEN,
  STAGE_LABELS,
} from "../content/intro.js";
import {
  canUpgrade,
  perkSummary,
  perkTier,
  tierLabel,
  upgradeCost,
} from "../systems/perks.js";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function progressDots(total, current) {
  return (
    '<div class="progress-dots" role="tablist" aria-label="Progreso">' +
    Array.from({ length: total }, (_, i) =>
      '<span class="dot' + (i === current ? " is-on" : "") + '" aria-hidden="true"></span>',
    ).join("") +
    "</div>"
  );
}

export function renderBoot(meta) {
  const returning = (meta.lives ?? 0) > 0;
  return (
    '<section class="screen screen-hero fade-in">' +
    '<p class="eyebrow">' +
    esc(BOOT.eyebrow) +
    "</p>" +
    "<h1>" +
    esc(BOOT.title) +
    "</h1>" +
    '<p class="lead">' +
    esc(BOOT.lead) +
    "</p>" +
    '<p class="sub">' +
    esc(BOOT.sub) +
    "</p>" +
    (returning
      ? '<div class="stat-strip">' +
        '<div class="stat"><b>' +
        (meta.pv ?? 0) +
        '</b><span>PV acumulados</span></div>' +
        '<div class="stat"><b>' +
        (meta.lives ?? 0) +
        '</b><span>vidas registradas</span></div>' +
        "</div>"
      : "") +
    (meta.lastEpitaph
      ? '<blockquote class="epitaph">Última acta: <em>' + esc(meta.lastEpitaph) + "</em></blockquote>"
      : "") +
    '<button type="button" class="btn" data-act="' +
    (returning ? "seeds" : "intro") +
    '">' +
    esc(returning ? BOOT.ctaReturn : BOOT.cta) +
    "</button>" +
  (returning
    ? '<button type="button" class="btn ghost" data-act="intro">Releer contrato</button>'
    : "") +
    "</section>"
  );
}

export function renderIntro(beat) {
  const b = INTRO_BEATS[beat];
  const last = beat >= INTRO_BEATS.length - 1;
  return (
    '<section class="screen screen-intro fade-in">' +
    progressDots(INTRO_BEATS.length, beat) +
    '<p class="eyebrow">' +
    esc(b.kicker) +
    "</p>" +
    "<h2>" +
    esc(b.title) +
    "</h2>" +
    '<p class="card-body">' +
    esc(b.body) +
    "</p>" +
    '<p class="note">' +
    esc(b.note) +
    "</p>" +
    '<div class="row-actions">' +
    (beat > 0
      ? '<button type="button" class="btn ghost" data-act="intro-back">Atrás</button>'
      : "") +
    '<button type="button" class="btn" data-act="' +
    (last ? "seeds" : "intro-next") +
    '">' +
    (last ? "Elegir origen" : "Continuar") +
    "</button>" +
    "</div>" +
    '<button type="button" class="link-btn" data-act="seeds">Saltar introducción</button>' +
    "</section>"
  );
}

export function renderSeeds(meta) {
  const equipped = meta.equippedPerk;
  return (
    '<section class="screen screen-seeds fade-in">' +
    '<p class="eyebrow">' +
    esc(SEED_SCREEN.eyebrow) +
    "</p>" +
    "<h2>" +
    esc(SEED_SCREEN.title) +
    "</h2>" +
    '<p class="lead">' +
    esc(SEED_SCREEN.lead) +
    "</p>" +
    renderPerkSlot(meta) +
    '<div class="seed-grid">' +
    SEEDS.map(
      (s) =>
        '<button type="button" class="seed-card" data-act="seed" data-id="' +
        s.id +
        '">' +
        '<span class="seed-title">' +
        esc(s.title) +
        "</span>" +
        '<span class="seed-tension">' +
        esc(s.tension) +
        "</span>" +
        '<p class="seed-body">' +
        esc(s.body) +
        "</p>" +
        '<div class="seed-tags">' +
        '<span class="tag tag-ok">' +
        esc(s.opportunity) +
        "</span>" +
        '<span class="tag tag-warn">' +
        esc(s.restriction) +
        "</span>" +
        "</div></button>",
    ).join("") +
    "</div></section>"
  );
}

function renderPerkSlot(meta) {
  const pv = meta.pv ?? 0;
  const equipped = meta.equippedPerk;
  return (
    '<div class="perk-panel">' +
    '<div class="perk-panel-head">' +
    '<span class="perk-panel-title">1 slot · comodín</span>' +
    '<span class="perk-panel-pv">' +
    pv +
    " PV</span></div>" +
    '<p class="perk-panel-lead">Gasta PV para subir tier. Equipa uno para la próxima vida. No compra el final.</p>' +
    '<div class="perk-grid">' +
    PERKS.map((p) => {
      const tier = perkTier(meta, p.id);
      const isEquipped = equipped === p.id;
      const nextCost = tier < 3 ? upgradeCost(tier + 1) : null;
      const canUp = canUpgrade(meta, p.id);
      return (
        '<div class="perk-card' +
        (isEquipped ? " is-equipped" : "") +
        (tier < 1 ? " is-locked" : "") +
        '">' +
        '<div class="perk-card-top">' +
        '<strong>' +
        esc(p.name) +
        "</strong>" +
        '<span class="perk-tier">' +
        (tier > 0 ? "Tier " + tierLabel(tier) : "Sin desbloquear") +
        "</span></div>" +
        '<p class="perk-tagline">' +
        esc(tier > 0 ? perkSummary(p.id, tier) : p.tagline) +
        "</p>" +
        '<div class="perk-actions">' +
        (tier >= 1
          ? '<button type="button" class="btn perk-btn' +
            (isEquipped ? " is-on" : "") +
            '" data-act="equip" data-id="' +
            p.id +
            '">' +
            (isEquipped ? "Equipado" : "Equipar") +
            "</button>"
          : "") +
        (tier < 3
          ? '<button type="button" class="btn ghost perk-btn' +
            (canUp ? "" : " is-disabled") +
            '" data-act="upgrade" data-id="' +
            p.id +
            '"' +
            (canUp ? "" : " disabled") +
            ">" +
            (tier === 0 ? "Desbloquear" : "Subir") +
            " · " +
            nextCost +
            " PV</button>"
          : '<span class="perk-maxed">Tier máximo</span>') +
        "</div></div>"
      );
    }).join("") +
    "</div></div>"
  );
}

export function renderLife(run, view) {
  const ev = view.event;
  const stage = STAGE_LABELS[ev.stage] ?? ev.stage;
  return (
    '<section class="screen screen-life fade-in">' +
    '<p class="stage-tag"><span class="stage-pill">' +
    esc(stage) +
    "</span> · " +
    run.age +
    " años</p>" +
    '<article class="event-card">' +
    "<h2>" +
    esc(ev.title) +
    "</h2>" +
    '<p class="card-body">' +
    esc(ev.body) +
    "</p>" +
    (view.punchline ? '<p class="punchline">' + esc(view.punchline) + "</p>" : "") +
    "</article>" +
    '<div class="choices">' +
    ev.options
      .map(
        (o) =>
          '<button type="button" class="choice" data-act="opt" data-id="' +
          o.id +
          '"><span class="choice-label">' +
          esc(o.label) +
          '</span><small class="choice-hint">' +
          esc(o.hint) +
          "</small></button>",
      )
      .join("") +
    "</div></section>"
  );
}

export function renderPost(view, meta, beat, collapsed) {
  const r = view.rank;
  const cfg = POST_BEATS[beat] ?? POST_BEATS[3];
  let title = "";
  let body = "";

  if (cfg.titleKey === "identity") title = r.identity;
  else if (cfg.titleKey === "axes") title = r.dominant + " alto · " + r.neglected + " bajo";
  else if (cfg.titleKey === "near") title = view.near ? view.near.text : "Sin casi.";
  else title = view.question;

  if (cfg.titleKey === "identity") body = collapsed ? cfg.bodyCollapsed : cfg.bodyNormal;
  else if (cfg.bodyKey === "tradeoff") body = "Conseguiste " + r.got + ". Sacrificaste " + r.sacrificed + ".";
  else if (view.near && cfg.bodyNear) body = cfg.bodyNear;
  else if (cfg.bodyNone && cfg.titleKey === "near") body = cfg.bodyNone;
  else if (cfg.bodyKey === "pv")
    body =
      "+" +
      (view.pvAward ?? 0) +
      " PV esta vida · total " +
      (meta.pv ?? 0) +
      ". Los PV no compran el final. Solo la siguiente oportunidad de equivocarte distinto.";

  return (
    '<section class="screen screen-post fade-in">' +
    '<p class="eyebrow">' +
    esc(cfg.kicker) +
    "</p>" +
    "<h2>" +
    esc(title) +
    "</h2>" +
    '<p class="lead">' +
    esc(body) +
    "</p>" +
    (cfg.cta
      ? '<button type="button" class="btn" data-act="again">Nueva vida</button><button type="button" class="btn ghost" data-act="boot">Inicio</button>'
      : '<button type="button" class="btn" data-act="beat">Continuar</button>') +
    "</section>"
  );
}
