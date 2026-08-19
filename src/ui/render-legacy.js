import { childAge, ensureFamily } from "../motor/relationships/people.js";
import { topMemories } from "../motor/relationships/memories.js";

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function node(person, fallback, kind) {
  if (!person) {
    return (
      '<div class="life-node is-empty is-' +
      kind +
      '"><span class="life-avatar">·</span><span class="life-who">' +
      esc(fallback) +
      "</span></div>"
    );
  }
  const status = person.status && person.status !== "active" ? person.status : "";
  return (
    '<div class="life-node is-' +
    kind +
    '"><span class="life-avatar">' +
    avatar(kind) +
    '</span><strong>' +
    esc(person.name) +
    "</strong><span class="life-who">' +
    esc(label(kind, status)) +
    "</span></div>"
  );
}

function avatar(kind) {
  return { mom: "👩", dad: "👨", you: "⭐", partner: "💕", kid: "🧒", friend: "🤝" }[kind] ?? "•";
}

function label(kind, status) {
  const base = { mom: "Madre", dad: "Padre", you: "Tú", partner: "Pareja", kid: "Hijo", friend: "Amigo" }[kind] ?? "";
  if (status === "married") return "Cónyuge";
  if (status === "dating") return "Salen";
  if (status === "cohabiting") return "Conviven";
  if (status === "separated") return "En pausa";
  return base;
}

export function renderLegacy(game) {
  const p = game.player;
  const f = ensureFamily(p);
  const year = p.calendar?.year;
  const kids = (f.children ?? []).map((c) => ({ ...c, status: childAge(c, year) + " años" }));
  const memories = topMemories(p, 5);

  return (
    '<section class="screen screen-sub screen-legacy fade-in">' +
    '<p class="eyebrow">Legado</p>' +
    "<h2>Mapa de vida</h2>" +
    '<p class="lead">No es un árbol de datos. Es quién te acompaña.</p>' +
    '<div class="life-map">' +
    '<div class="life-row life-row-up">' +
    node(f.origin?.mother, "Madre", "mom") +
    node(f.origin?.father, "Padre", "dad") +
    "</div>" +
    '<div class="life-row life-row-mid">' +
    node({ name: p.name, status: "active" }, p.name, "you") +
    node(f.partner, "Pareja", "partner") +
    "</div>" +
    '<div class="life-row life-row-down">' +
    (kids.length
      ? kids.map((c) => node(c, "Hijo", "kid")).join("")
      : node(null, "Hijos", "kid")) +
    "</div>" +
    '<div class="life-row life-row-side">' +
    node(f.friend, "Amigo", "friend") +
    "</div>" +
    "</div>" +
    '<h3 class="legacy-moments-title">Momentos que definieron tu vida</h3>' +
    (memories.length
      ? '<ul class="legacy-moments">' +
        memories.map((m) => "<li>" + esc(m.text) + "</li>").join("") +
        "</ul>"
      : '<p class="muted">Aún no hay un momento que pese. Las decisiones grandes se quedan aquí.</p>') +
    "</section>"
  );
}

export function renderLifeEnded(game) {
  const s = game.lifeSummary;
  if (!s) return '<section class="screen"><h2>Tu vida</h2></section>';
  return (
    '<section class="screen screen-ended fade-in">' +
    '<p class="eyebrow">TU VIDA</p>' +
    "<h2>Viviste " +
    s.age +
    " años</h2>" +
    '<p class="epitaph">' +
    esc(s.sentence) +
    "</p>" +
    '<ul class="ended-facts">' +
    "<li>💰 " +
    esc(String(s.dinero)) +
    "</li>" +
    "<li>🏠 Casas " +
    s.homes +
    "</li>" +
    "<li>🚗 Coches " +
    s.cars +
    "</li>" +
    "<li>💼 Negocios " +
    s.business +
    "</li>" +
    "<li>❤️ Familia " +
    s.childrenCount +
    "</li>" +
    "<li>🎤 Historias " +
    s.storiesCount +
    "</li>" +
    "</ul>" +
    '<button type="button" class="btn btn-xl" data-act="new-life">NUEVA VIDA</button>' +
    "</section>"
  );
}
