import { SEEDS } from "../content/seeds.js";
import { PERKS } from "../content/perks.js";
import {
  BOOT,
  INTRO_BEATS,
  POST_BEATS,
  SEED_SCREEN,
} from "../content/intro.js";
import {
  canUpgrade,
  perkSummary,
  perkTier,
  tierLabel,
  upgradeCost,
} from "../systems/perks.js";
import { axisLine } from "./juice.js";
import { cityBg, icon, radar, seedArt } from "./art.js";
import { listPlayableWorlds } from "../content/worlds/index.js";
import { categoryVis, discoveryHints, lifeIdentity } from "./life-view.js";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function dots(total, current) {
  return (
    '<div class="progress-dots">' +
    Array.from({ length: total }, (_, i) =>
      '<span class="dot' + (i === current ? " is-on" : "") + '"></span>',
    ).join("") +
    "</div>"
  );
}

export function renderBoot(meta) {
  const returning = (meta.lives ?? 0) > 0;
  return (
    '<section class="screen screen-hero fade-in">' +
    '<div class="hero-bg">' +
    cityBg() +
    '</div><div class="hero-shade"></div>' +
    '<div class="hero-content">' +
    icon("crown") +
    '<p class="eyebrow">' +
    esc(BOOT.eyebrow) +
    "</p>" +
    "<h1>" +
    esc(BOOT.title) +
    "</h1>" +
    '<p class="lead">' +
    esc(BOOT.lead) +
    "</p>" +
    (returning
      ? '<div class="hero-stats"><div class="hero-stat"><b>' +
        (meta.pv ?? 0) +
        '</b><span>puntos</span></div><div class="hero-stat"><b>' +
        (meta.lives ?? 0) +
        "</b><span>vidas</span></div></div>"
      : "") +
    (meta.lastEpitaph
      ? '<p class="last-life">La última vez: <em>' + esc(meta.lastEpitaph) + "</em></p>"
      : "") +
    '<button type="button" class="btn btn-xl" data-act="worlds">' +
    esc(returning ? BOOT.ctaReturn : BOOT.cta) +
    "</button>" +
    '<button type="button" class="link-btn" data-act="intro">¿Cómo se juega?</button>' +
    '<div class="world-lock">' +
    icon("globe") +
    icon("lock") +
    "<span>Mundo 2 · cerrado por ahora</span></div>" +
    '<p class="motto">' +
    esc(BOOT.motto) +
    "</p></div></section>"
  );
}

export function renderIntro(beat) {
  const b = INTRO_BEATS[beat];
  const last = beat >= INTRO_BEATS.length - 1;
  return (
    '<section class="screen fade-in">' +
    dots(INTRO_BEATS.length, beat) +
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
    (beat > 0 ? '<button type="button" class="btn ghost" data-act="intro-back">Atrás</button>' : "") +
    '<button type="button" class="btn" data-act="' +
    (last ? "seeds" : "intro-next") +
    '">' +
    (last ? "Elegir origen" : "Continuar") +
    "</button></div>" +
    '<button type="button" class="link-btn" data-act="seeds">Saltar</button></section>'
  );
}

export function renderSeeds(meta) {
  const returning = (meta.lives ?? 0) > 0;
  return (
    '<section class="screen fade-in">' +
    '<p class="eyebrow">' +
    esc(SEED_SCREEN.eyebrow) +
    "</p>" +
    "<h2>" +
    esc(SEED_SCREEN.title) +
    "</h2>" +
    '<p class="lead">' +
    esc(SEED_SCREEN.lead) +
    "</p>" +
    (returning ? renderPerkSlot(meta) : "") +
    '<div class="seed-grid">' +
    SEEDS.map((s) => {
      const tags = s.tags ?? [];
      return (
        '<button type="button" class="seed-card" data-act="seed" data-id="' +
        s.id +
        '"><div class="seed-head"><span class="seed-emoji">' +
        seedArt(s.id) +
        '</span><div><span class="seed-title">' +
        esc(s.title) +
        '</span><span class="seed-tension">' +
        esc(s.tension) +
        "</span></div></div><p class=\"seed-body\">" +
        esc(s.body) +
        '</p><div class="seed-tags">' +
        tags
          .map((t) => '<span class="tag tag-' + t.kind + '">' + esc(t.icon + " " + t.text) + "</span>")
          .join("") +
        '</div><span class="seed-cta">Elegir →</span></button>'
      );
    }).join("") +
    "</div></section>"
  );
}

function renderPerkSlot(meta) {
  const pv = meta.pv ?? 0;
  const equipped = meta.equippedPerk;
  return (
    '<div class="perk-panel">' +
    '<div class="perk-panel-head"><span>Extra para esta vida</span><span class="perk-panel-pv">' +
    pv +
    " pts</span></div>" +
    '<p class="perk-panel-lead">Gasta puntos. Equipa uno. No te gana la vida.</p>' +
    '<div class="perk-grid">' +
    PERKS.map((p) => {
      const tier = perkTier(meta, p.id);
      const isEquipped = equipped === p.id;
      const nextCost = tier < 3 ? upgradeCost(tier + 1) : null;
      const canUp = canUpgrade(meta, p.id);
      return (
        '<div class="perk-card' +
        (isEquipped ? " is-equipped" : "") +
        '"><div class="perk-card-top"><strong>' +
        esc(p.name) +
        '</strong><span class="perk-tier">' +
        (tier > 0 ? "Nivel " + tierLabel(tier) : "Cerrado") +
        '</span></div><p class="perk-tagline">' +
        esc(tier > 0 ? perkSummary(p.id, tier) : p.tagline) +
        '</p><div class="perk-actions">' +
        (tier >= 1
          ? '<button type="button" class="btn perk-btn' +
            (isEquipped ? " is-on" : "") +
            '" data-act="equip" data-id="' +
            p.id +
            '">' +
            (isEquipped ? "Puesto" : "Usar") +
            "</button>"
          : "") +
        (tier < 3
          ? '<button type="button" class="btn ghost perk-btn" data-act="upgrade" data-id="' +
            p.id +
            '"' +
            (canUp ? "" : " disabled") +
            ">" +
            (tier === 0 ? "Abrir" : "Subir") +
            " · " +
            nextCost +
            "</button>"
          : '<span class="perk-maxed">Al máximo</span>') +
        "</div></div>"
      );
    }).join("") +
    "</div></div>"
  );
}

export function renderLife(game, view) {
  const ev = view.event;
  const player = game?.player ?? {};
  const cat = categoryVis(ev.category);
  const body = ev.body ?? ev.description ?? "";
  const identity = lifeIdentity(player, game?.worldId);
  const hints = discoveryHints(player);
  const tones = ["choice-a", "choice-b", "choice-c", "choice-d"];
  const isStory = ev.kind === "story" || ev.storyId;

  const chips = [];
  if (identity.partner) chips.push('<span class="life-chip is-heart">❤️ Relación</span>');
  if (identity.fame) chips.push('<span class="life-chip is-star">⭐ Fama</span>');
  if (identity.career?.tierLabel && identity.occupation) {
    chips.push('<span class="life-chip is-job">' + esc(identity.career.tierLabel) + "</span>");
  }

  return (
    '<section class="screen screen-life fade-in" data-world="' +
    esc(identity.worldId) +
    '">' +
    (chips.length ? '<div class="life-chips">' + chips.join("") + "</div>" : "") +
    '<article class="event-card' +
    (isStory ? " is-story" : "") +
    " cat-" +
    esc(ev.category || "especial") +
    '">' +
    '<p class="event-cat"><span class="event-cat-ico">' +
    cat.emoji +
    "</span>" +
    esc(cat.label) +
    "</p>" +
    "<h2>" +
    esc(ev.title) +
    '</h2><p class="card-body">' +
    esc(body) +
    "</p></article>" +
    '<p class="choose-prompt">¿Qué haces?</p>' +
    '<div class="choices">' +
    ev.options
      .map((o, i) => {
        const hint = o.hint ? '<small class="choice-hint">' + esc(o.hint) + "</small>" : "";
        return (
          '<button type="button" class="choice ' +
          tones[i % 4] +
          '" data-act="opt" data-id="' +
          o.id +
          '"><span class="choice-mark">' +
          (i + 1) +
          '</span><span class="choice-copy"><span class="choice-label">' +
          esc(o.label) +
          "</span>" +
          hint +
          "</span></button>"
        );
      })
      .join("") +
    "</div>" +
    (hints.length
      ? '<div class="discover-row">' +
        hints
          .map((h) => '<span class="discover-chip">' + (h.kind === "fame" ? "⭐ " : "✨ ") + esc(h.text) + "</span>")
          .join("") +
        "</div>"
      : "") +
    "</section>"
  );
}

export function renderPost(view, meta, beat, collapsed) {
  const r = view.rank;
  const cfg = POST_BEATS[beat] ?? POST_BEATS[3];
  const axes = axisLine(r.dominant, r.neglected);
  let title = "";
  let body = "";
  let extra = "";

  if (cfg.titleKey === "identity") title = r.identity;
  else if (cfg.titleKey === "axes") title = "Así te fue";
  else if (cfg.titleKey === "near") title = view.near ? view.near.text : "Sin un «casi» esta vez.";
  else title = view.question;

  if (cfg.titleKey === "identity") body = collapsed ? cfg.bodyCollapsed : cfg.bodyNormal;
  else if (cfg.bodyKey === "tradeoff") {
    body = "Conseguiste " + r.got + ". Dejaste " + r.sacrificed + ".";
    extra =
      radar(r.axes) +
      '<div class="axes-box"><div class="axis-row">' +
      esc(axes.high) +
      '</div><div class="axis-row">' +
      esc(axes.low) +
      "</div></div>";
  } else if (view.near && cfg.bodyNear) body = cfg.bodyNear;
  else if (cfg.bodyNone && cfg.titleKey === "near") body = cfg.bodyNone;
  else if (cfg.bodyKey === "pv")
    body =
      "Ganaste " +
      (view.pvAward ?? 0) +
      " puntos. Llevas " +
      (meta.pv ?? 0) +
      ". No compran el final. Sirven para la siguiente.";

  const art =
    beat === 0
      ? icon("crown", "art-lg")
      : beat === 2
        ? icon("spark", "art-lg")
        : beat === 3
          ? icon("globe", "art-lg")
          : "";

  return (
    '<section class="screen screen-post fade-in">' +
    '<div class="post-card">' +
    art +
    '<p class="eyebrow">' +
    esc(cfg.kicker) +
    "</p>" +
    "<h2>" +
    esc(title) +
    "</h2>" +
    '<p class="lead">' +
    esc(body) +
    "</p>" +
    extra +
    "</div>" +
    (cfg.cta
      ? '<button type="button" class="btn btn-xl" data-act="again">Nueva vida</button><button type="button" class="btn ghost" data-act="boot">Inicio</button>'
      : '<button type="button" class="btn" data-act="beat">Continuar</button>') +
    "</section>"
  );
}

export function renderWorlds() {
  const worlds = listPlayableWorlds();
  return (
    '<section class="screen fade-in">' +
    '<p class="eyebrow">Elige tu mundo</p>' +
    "<h2>¿Qué vida quieres vivir?</h2>" +
    '<p class="lead">Cada mundo tiene sus propias decisiones y historias.</p>' +
    '<div class="seed-grid">' +
    worlds
      .map(
        (w) =>
          '<button type="button" class="seed-card" data-act="world" data-id="' +
          w.id +
          '"><div class="seed-head"><span class="seed-emoji">' +
          icon(w.id === "capitalismo" ? "crown" : "globe", "art-seed") +
          '</span><div><span class="seed-title">' +
          esc(w.name) +
          '</span><span class="seed-tension">' +
          esc(w.id === "capitalismo" ? "Sátira · dinero · estatus" : "Vida cotidiana") +
          "</span></div></div><p class=\"seed-body\">" +
          esc(w.description) +
          '</p><span class="seed-cta">Jugar →</span></button>',
      )
      .join("") +
    '</div><button type="button" class="link-btn" data-act="boot">Volver</button></section>'
  );
}

export function renderCreate(worldId, name = "Tú") {
  return (
    '<section class="screen fade-in">' +
    '<p class="eyebrow">Tu personaje</p>' +
    "<h2>¿Cómo te llamas?</h2>" +
    '<p class="lead">Un nombre para esta vida.</p>' +
    '<input type="text" class="name-input" id="player-name" maxlength="24" value="' +
    esc(name) +
    '" placeholder="Tu nombre" />' +
    '<button type="button" class="btn btn-xl" data-act="start-game" data-world="' +
    esc(worldId) +
    '">Comenzar en enero</button>' +
    '<button type="button" class="link-btn" data-act="worlds">Cambiar mundo</button></section>'
  );
}
