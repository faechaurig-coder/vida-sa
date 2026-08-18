import { listStoriesForUI, chapterDisplay, statusLabel } from "../motor/stories.js";
import { getStoryDef } from "../content/stories/definitions.js";
import { collectionView } from "../motor/collection.js";
import { missionsView } from "../motor/missions.js";
import { formatMoney } from "./juice.js";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderBottomNav(tab) {
  const tabs = [
    { id: "life", label: "Vida", icon: "🏠" },
    { id: "stories", label: "Historias", icon: "📖" },
    { id: "collection", label: "Colección", icon: "🏆" },
    { id: "missions", label: "Misiones", icon: "🎯" },
  ];
  return tabs
    .map(
      (t) =>
        '<button type="button" class="nav-tab' +
        (tab === t.id ? " is-on" : "") +
        '" data-act="tab" data-tab="' +
        t.id +
        '" aria-current="' +
        (tab === t.id ? "page" : "false") +
        '"><span class="nav-icon" aria-hidden="true">' +
        t.icon +
        '</span><span class="nav-label">' +
        esc(t.label) +
        "</span></button>",
    )
    .join("");
}

export function renderStories(game, selectedStoryId = null) {
  if (selectedStoryId) return renderStoryDetail(game, selectedStoryId);

  const items = listStoriesForUI(game.player, game.worldId);
  if (!items.length) {
    return (
      '<section class="screen screen-sub fade-in">' +
      '<p class="eyebrow">Historias</p>' +
      "<h2>Tus caminos</h2>" +
      '<p class="lead">Este mundo aún no tiene historias descubribles.</p></section>'
    );
  }
  return (
    '<section class="screen screen-sub screen-stories fade-in">' +
    '<p class="eyebrow">Historias</p>' +
    "<h2>Caminos por descubrir</h2>" +
    '<p class="lead">Cada vida esconde una historia. La mayoría empieza con una decisión pequeña.</p>' +
    '<div class="story-grid">' +
    items
      .map((item) => {
        const locked = item.status === "locked";
        const canOpen = !locked;
        const chapters = item.def.chapters?.length ?? 0;
        const done = item.def.chapters
          ? Math.round((item.progress / 100) * chapters)
          : 0;
        return (
          '<article class="story-card is-' +
          item.status +
          (canOpen ? " is-open" : "") +
          '" ' +
          (canOpen ? 'data-act="story" data-id="' + item.def.id + '"' : "") +
          ">" +
          '<div class="story-head"><span class="story-emoji">' +
          (locked ? "❓" : item.def.emoji) +
          '</span><div><strong class="story-title">' +
          esc(item.displayTitle) +
          '</strong><span class="story-status">' +
          esc(statusLabel(item.status)) +
          "</span></div></div>" +
          '<p class="story-desc">' +
          esc(item.displayDesc) +
          "</p>" +
          (item.status !== "locked"
            ? '<div class="progress-bar"><span style="width:' +
              item.progress +
              '%"></span></div><p class="story-count">' +
              done +
              "/" +
              chapters +
              "</p>"
            : '<p class="story-mystery">Todavía no sabes qué es esto.</p>') +
          "</article>"
        );
      })
      .join("") +
    "</div></section>"
  );
}

export function renderStoryDetail(game, storyId) {
  const def = getStoryDef(storyId);
  if (!def) return renderStories(game);

  const chapters = [...(def.chapters ?? [])].sort((a, b) => a.order - b.order);
  return (
    '<section class="screen screen-sub fade-in">' +
    '<button type="button" class="link-btn back-link" data-act="stories-back">← Historias</button>' +
    '<p class="eyebrow">' +
    def.emoji +
    " " +
    esc(def.title) +
    "</p>" +
    "<h2>Tu camino</h2>" +
    '<div class="story-path">' +
    chapters
      .map((ch, i) => {
        const d = chapterDisplay(game.player, def, ch);
        const line =
          i < chapters.length - 1 ? '<div class="path-line">↓</div>' : "";
        return (
          '<div class="path-step is-' +
          d.state +
          '"><span class="path-emoji">' +
          d.emoji +
          '</span><span class="path-label">' +
          esc(d.label) +
          "</span></div>" +
          line
        );
      })
      .join("") +
    "</div></section>"
  );
}

export function renderCollection(game) {
  const view = collectionView(game);
  const section = (title, emoji, items, kind) =>
    '<div class="collect-section" data-kind="' +
    kind +
    '"><h3>' +
    emoji +
    " " +
    esc(title) +
    '</h3><div class="collect-grid">' +
    items
      .map((slot) => {
        const hidden = slot.state === "hidden";
        return (
          '<article class="collect-card is-' +
          slot.state +
          '">' +
          '<span class="collect-emoji">' +
          (hidden ? "✨" : slot.emoji) +
          "</span>" +
          "<strong>" +
          esc(slot.displayName) +
          "</strong>" +
          '<span class="collect-state">' +
          esc(hidden ? "Objeto especial" : slot.stateLabel) +
          "</span>" +
          (slot.price && slot.state !== "hidden" && slot.state !== "locked"
            ? '<span class="collect-price">' + formatMoney(slot.price) + "</span>"
            : slot.price && slot.state === "available"
              ? '<span class="collect-price">' + formatMoney(slot.price) + "</span>"
              : slot.price && slot.state === "locked" && !hidden
                ? '<span class="collect-price">' + formatMoney(slot.price) + "</span>"
                : "") +
          (slot.displayDesc && !hidden ? '<p class="collect-desc">' + esc(slot.displayDesc) + "</p>" : "") +
          "</article>"
        );
      })
      .join("") +
    "</div></div>";

  return (
    '<section class="screen screen-sub screen-collection fade-in" data-world="' +
    esc(game.worldId) +
    '">' +
    '<p class="eyebrow">Colección · ' +
    esc(view.worldName) +
    "</p>" +
    "<h2>Lo que es tuyo</h2>" +
    '<p class="lead">Casas, vehículos y rarezas de este mundo.</p>' +
    section("Casas", "🏠", view.houses, "houses") +
    section("Vehículos", "🚗", view.vehicles, "vehicles") +
    section("Especiales", "✨", view.special, "special") +
    "</section>"
  );
}

export function renderMissions(game) {
  const view = missionsView(game);
  if (!view.current && !view.previous) {
    return (
      '<section class="screen screen-sub fade-in">' +
      '<p class="eyebrow">Misiones</p>' +
      "<h2>Sin misiones</h2>" +
      '<p class="lead">Este mundo no tiene objetivos de misión todavía.</p></section>'
    );
  }

  const card = (label, m, kind) => {
    if (!m) return "";
    const progress = m.progress ?? 0;
    const progressLabel = m.progressLabel;
    return (
      '<article class="mission-card is-' +
      kind +
      '">' +
      '<span class="mission-tag">' +
      esc(label) +
      "</span>" +
      "<h3>" +
      (m.type === "money" ? "💰 " : m.type === "job" ? "💼 " : m.type === "fame" ? "⭐ " : m.type === "story" ? "📖 " : "🏆 ") +
      esc(m.title) +
      "</h3>" +
      '<p class="mission-desc">' +
      esc(m.description) +
      "</p>" +
      (kind === "current"
        ? '<div class="progress-bar mission-bar"><span style="width:' +
          progress +
          '%"></span></div>' +
          (m.type === "money"
            ? '<p class="mission-money">' +
              formatMoney(view.money) +
              " / " +
              formatMoney(m.target) +
              "</p>"
            : progressLabel
              ? '<p class="mission-money">' + esc(progressLabel) + "</p>"
              : "")
        : "") +
      (kind === "previous" ? '<p class="mission-done">✓ Completada</p>' : "") +
      (kind === "next" && m.locked ? '<p class="mission-lock">Se desbloquea al completar la misión actual.</p>' : "") +
      "</article>"
    );
  };

  return (
    '<section class="screen screen-sub screen-missions fade-in">' +
    '<p class="eyebrow">Misiones · ' +
    esc(view.worldName) +
    "</p>" +
    "<h2>Tu objetivo</h2>" +
    card("MISIÓN ACTUAL", view.current, "current") +
    card("COMPLETADA", view.previous, "previous") +
    card("SIGUIENTE", view.next, "next") +
    "</section>"
  );
}
