import { createGame, startMonth, resolveDecision, finishMonth, hudFromGame, eventForUI } from "../motor/loop.js";
import { seedToGameConfig } from "../motor/adapter/legacy.js";
import { SEEDS, getSeed } from "../content/seeds.js";
import { emptyMeta, loadSave, saveAll } from "../systems/persist.js";
import { character, moodFromTone } from "./art.js";
import { formatMoney, juiceHero, juiceTone } from "./juice.js";
import { renderBoot, renderCreate, renderIntro, renderLife, renderSeeds, renderWorlds } from "./render.js";
import {
  renderBottomNav,
  renderStories,
  renderCollection,
  renderMissions,
} from "./render-progress.js";
import { unlockPresentation } from "../motor/unlocks.js";
import { characterMood, lifeIdentity, vitalsForHud } from "./life-view.js";
import { FX, playFx } from "./fx.js";

const stageEl = document.getElementById("stage");
const hud = document.getElementById("hud");
const juice = document.getElementById("juice");
const unlockEl = document.getElementById("unlock");
const bottomNav = document.getElementById("bottom-nav");
const topbar = document.getElementById("topbar");
const fineprint = document.getElementById("fineprint");

const IN_GAME_SCREENS = new Set(["life", "stories", "collection", "missions"]);

const state = {
  screen: "boot",
  tab: "life",
  introBeat: 0,
  game: null,
  view: null,
  meta: emptyMeta(),
  selectedWorld: null,
  selectedStoryId: null,
  busy: false,
  unlockQueue: [],
};

const CORP = {
  boot: "Tu vida",
  worlds: "Mundos",
  create: "Personaje",
  seed: "Tu origen",
  life: "En curso",
  stories: "Historias",
  collection: "Colección",
  missions: "Misiones",
};

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isInGame() {
  return IN_GAME_SCREENS.has(state.screen);
}

function boot() {
  try {
    const saved = loadSave();
    state.meta = saved.meta;
    const motor = saved.session?.motorGame;
    if (motor?.pendingEvent && motor.phase === "awaiting_decision") {
      state.game = motor;
      state.view = { event: eventForUI(motor.pendingEvent) };
      state.screen = "life";
      state.tab = saved.session?.tab ?? "life";
    } else if (motor && motor.player) {
      state.game = motor;
      state.screen = saved.session?.screen ?? "life";
      state.tab = saved.session?.tab ?? "life";
      if (motor.pendingEvent) {
        state.view = { event: eventForUI(motor.pendingEvent) };
      }
    } else {
      state.screen = "boot";
    }
  } catch {
    state.screen = "boot";
    state.game = null;
  }
  render();
}

function persist() {
  const session =
    state.game && isInGame()
      ? { motorGame: state.game, tab: state.tab, screen: state.screen }
      : null;
  saveAll(state.meta, session);
}

function paintWorld() {
  const phone = document.querySelector(".phone");
  if (!phone) return;
  phone.classList.toggle("is-playing", isInGame());
  phone.classList.toggle("is-capitalismo", state.game?.worldId === "capitalismo");
  phone.classList.toggle("is-clasico", state.game?.worldId === "clasico");
}

function paintHud() {
  const show = isInGame() || juice.classList.contains("is-on");
  hud.hidden = !show;
  if (!show || !state.game) return;
  const h = hudFromGame(state.game);
  const id = lifeIdentity(state.game.player, state.game.worldId);
  const mood = characterMood(state.game.player);
  document.getElementById("hud-avatar").innerHTML = character(mood);
  document.getElementById("hud-name").textContent = id.name;
  document.getElementById("hud-life").textContent = h.age + " años · " + id.stageLabel;
  const role = document.getElementById("hud-role");
  if (id.occupation) {
    role.hidden = false;
    role.textContent = id.occupation;
  } else {
    role.hidden = true;
    role.textContent = "";
  }
  document.getElementById("hud-date").textContent = h.monthYear;
  const extra = [];
  if (id.partner) extra.push("❤️ Relación");
  if (id.fame) extra.push("⭐ Fama");
  document.getElementById("hud-extra").textContent = extra.join(" · ");
  const cash = document.getElementById("hud-money");
  cash.textContent = formatMoney(h.dinero);
  cash.classList.toggle("is-neg", h.dinero < 0);
  const vitals = vitalsForHud(state.game.player.stats);
  const vitalEls = {
    salud: document.getElementById("hp-vital"),
    felicidad: document.getElementById("hap-vital"),
    influencia: document.getElementById("inf-vital"),
    maldad: document.getElementById("evil-vital"),
  };
  for (const v of vitals) {
    const el = vitalEls[v.key];
    if (!el) continue;
    const prev = el.dataset.val;
    el.innerHTML = '<span class="vital-emoji">' + v.emoji + "</span><b>" + v.value + "</b>";
    el.setAttribute("title", v.label);
    if (prev != null && prev !== String(v.value)) {
      el.classList.remove("is-pop");
      void el.offsetWidth;
      el.classList.add(Number(prev) < v.value ? "is-pop-up" : "is-pop-down");
      el.classList.add("is-pop");
    }
    el.dataset.val = String(v.value);
  }
  const prevCash = cash.dataset.val;
  if (prevCash != null && prevCash !== String(h.dinero)) {
    cash.classList.remove("is-pop");
    void cash.offsetWidth;
    cash.classList.add("is-pop");
  }
  cash.dataset.val = String(h.dinero);
}

function paintNav() {
  if (!bottomNav) return;
  const show = isInGame() && state.game;
  bottomNav.hidden = !show;
  if (!show) return;
  bottomNav.innerHTML = renderBottomNav(state.tab);
}

function showJuiceMotor(result, nextMonthLabel, currentLabel) {
  const STAT_UI = {
    salud: { emoji: "❤️", label: "Salud" },
    felicidad: { emoji: "😊", label: "Felicidad" },
    dinero: { emoji: "💰", label: "Dinero" },
    influencia: { emoji: "👑", label: "Influencia" },
    maldad: { emoji: "😈", label: "Maldad" },
  };
  const deltas = (result.deltas ?? []).map((d) => ({
    key: d.key,
    art: d.key === "dinero" ? "money" : d.key === "felicidad" ? "hap" : d.key === "salud" ? "hp" : "spark",
    label: STAT_UI[d.key]?.label ?? d.key,
    delta: d.delta,
    good: d.key === "maldad" ? d.delta < 0 : d.delta > 0,
    money: d.key === "dinero",
  }));
  const hero = juiceHero(deltas);
  const tone = juiceTone(deltas);
  const card = juice.querySelector(".juice-card");
  card.className = "overlay-card juice-card is-" + tone;
  const kicker = document.getElementById("juice-kicker");
  if (kicker) kicker.textContent = "Decisión tomada";
  const years = currentLabel && nextMonthLabel && currentLabel !== nextMonthLabel
    ? currentLabel + " → " + nextMonthLabel
    : nextMonthLabel
      ? "Siguiente: " + nextMonthLabel
      : "";
  document.getElementById("juice-years").textContent = years;
  document.getElementById("juice-char").innerHTML = character(moodFromTone(tone));
  document.getElementById("juice-hero").textContent = hero.text;
  document.getElementById("juice-line").textContent = result.text ?? "Decidiste.";
  document.getElementById("juice-deltas").innerHTML = (result.deltas ?? [])
    .map((d) => {
      const cls = d.key === "maldad" ? (d.delta > 0 ? "down" : "up") : d.delta > 0 ? "up" : "down";
      const meta = STAT_UI[d.key] ?? { emoji: "✨", label: d.key };
      const val = d.key === "dinero" ? (d.delta > 0 ? "+" : "") + formatMoney(d.delta) : (d.delta > 0 ? "+" : "") + d.delta;
      return (
        '<div class="delta ' +
        cls +
        '"><span class="delta-left">' +
        '<span class="delta-emoji">' +
        meta.emoji +
        "</span>" +
        meta.label +
        '</span><span>' +
        val +
        "</span></div>"
      );
    })
    .join("");
  document.getElementById("juice-hook").hidden = true;
  juice.classList.add("is-on");
}

function hideJuice() {
  juice.classList.remove("is-on");
}

function queueUnlocks(unlocks = []) {
  if (!unlocks?.length) return;
  state.unlockQueue.push(...unlocks);
}

function showNextUnlock() {
  if (!state.unlockQueue.length || !unlockEl) return false;
  const item = state.unlockQueue.shift();
  const pres = unlockPresentation(item, state.game);
  document.getElementById("unlock-kicker").textContent = pres.kicker;
  document.getElementById("unlock-emoji").textContent = pres.emoji;
  document.getElementById("unlock-title").textContent = pres.title;
  document.getElementById("unlock-copy").textContent = pres.body;
  unlockEl.classList.add("is-on");
  playFx(FX.UNLOCK);
  return true;
}

function hideUnlock() {
  unlockEl?.classList.remove("is-on");
  if (state.unlockQueue.length) {
    setTimeout(() => showNextUnlock(), 120);
  }
}

function beginLife(config) {
  state.game = startMonth(createGame(config));
  state.view = { event: eventForUI(state.game.pendingEvent) };
  state.screen = "life";
  state.tab = "life";
  state.selectedStoryId = null;
  persist();
  render();
}

function switchTab(tab) {
  if (!state.game) return;
  state.tab = tab;
  state.screen = tab === "life" ? "life" : tab;
  state.selectedStoryId = null;
  persist();
  render();
}

function fallbackBoot() {
  return (
    '<section class="screen screen-hero fade-in"><div class="hero-content">' +
    "<h1>¿Qué vida te toca?</h1>" +
    '<button type="button" class="btn btn-xl" data-act="worlds">EMPEZAR</button></div></section>'
  );
}

function render() {
  try {
    paintWorld();
    paintHud();
    paintNav();
    topbar.classList.toggle("is-hidden", state.screen === "boot");
    fineprint.classList.toggle("is-hidden", isInGame() || state.screen === "boot");
    document.getElementById("corp-meta").textContent = CORP[state.screen] ?? CORP[state.tab] ?? "VIDA S.A.";

    if (state.screen === "boot") {
      stageEl.innerHTML = renderBoot(state.meta);
      return;
    }
    if (state.screen === "intro") {
      stageEl.innerHTML = renderIntro(state.introBeat);
      return;
    }
    if (state.screen === "worlds") {
      stageEl.innerHTML = renderWorlds();
      return;
    }
    if (state.screen === "create") {
      stageEl.innerHTML = renderCreate(state.selectedWorld);
      return;
    }
    if (state.screen === "seed") {
      stageEl.innerHTML = renderSeeds(state.meta);
      return;
    }
    if (state.screen === "life") {
      if (!state.view?.event) {
        state.screen = "boot";
        stageEl.innerHTML = renderBoot(state.meta);
        return;
      }
      stageEl.innerHTML = renderLife(state.game, state.view);
      return;
    }
    if (state.screen === "stories") {
      stageEl.innerHTML = renderStories(state.game, state.selectedStoryId);
      return;
    }
    if (state.screen === "collection") {
      stageEl.innerHTML = renderCollection(state.game);
      return;
    }
    if (state.screen === "missions") {
      stageEl.innerHTML = renderMissions(state.game);
    }
  } catch {
    state.screen = "boot";
    state.busy = false;
    hideJuice();
    stageEl.innerHTML = fallbackBoot();
  }
}

stageEl.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn || state.busy) return;
  const act = btn.getAttribute("data-act");

  if (act === "tab") {
    return switchTab(btn.getAttribute("data-tab"));
  }
  if (act === "story") {
    state.selectedStoryId = btn.getAttribute("data-id");
    return render();
  }
  if (act === "stories-back") {
    state.selectedStoryId = null;
    return render();
  }

  if (act === "intro") {
    state.screen = "intro";
    state.introBeat = 0;
    return render();
  }
  if (act === "intro-next") {
    state.introBeat = Math.min(2, state.introBeat + 1);
    return render();
  }
  if (act === "intro-back") {
    state.introBeat = Math.max(0, state.introBeat - 1);
    return render();
  }
  if (act === "worlds") {
    state.screen = "worlds";
    return render();
  }
  if (act === "boot") {
    state.screen = "boot";
    state.game = null;
    state.tab = "life";
    persist();
    return render();
  }
  if (act === "world") {
    state.selectedWorld = btn.getAttribute("data-id");
    state.screen = state.selectedWorld === "capitalismo" ? "seed" : "create";
    return render();
  }
  if (act === "start-game") {
    const name = document.getElementById("player-name")?.value?.trim() || "Tú";
    beginLife({ worldId: state.selectedWorld ?? "clasico", name });
    return;
  }
  if (act === "seed") {
    const seed = getSeed(btn.getAttribute("data-id"));
    if (!seed) return;
    beginLife({ ...seedToGameConfig(seed), name: "Tú" });
    return;
  }
  if (act === "opt") {
    if (!state.game?.pendingEvent || state.tab !== "life") return;
    state.busy = true;
    btn.classList.add("is-picking");
    try {
      await wait(380);
      const currentLabel = hudFromGame(state.game).monthYear;
      const resolved = resolveDecision(state.game, btn.getAttribute("data-id"));
      state.game = resolved;
      const preview = finishMonth(resolved);
      const nextLabel = hudFromGame(preview).monthYear;
      state._nextMonthLabel = nextLabel;
      queueUnlocks(resolved.lastResult?.unlocks ?? []);
      paintHud();
      playFx(FX.DECISION);
      showJuiceMotor(resolved.lastResult, nextLabel, currentLabel);
      persist();
    } catch (err) {
      console.error(err);
      state.screen = "boot";
      render();
    } finally {
      state.busy = false;
    }
  }
});

bottomNav?.addEventListener("click", (e) => {
  const btn = e.target.closest('[data-act="tab"]');
  if (!btn || state.busy) return;
  switchTab(btn.getAttribute("data-tab"));
});

document.getElementById("juice-ok").addEventListener("click", () => {
  hideJuice();
  if (!state.game || state.game.phase !== "showing_result") return;
  if (showNextUnlock()) return;
  state.game = startMonth(finishMonth(state.game));
  state.view = { event: eventForUI(state.game.pendingEvent) };
  state._nextMonthLabel = null;
  playFx(FX.MONTH);
  persist();
  render();
});

document.getElementById("unlock-ok")?.addEventListener("click", () => {
  hideUnlock();
  if (state.unlockQueue.length) {
    setTimeout(() => showNextUnlock(), 120);
    return;
  }
  if (state.game?.phase === "showing_result" && !juice.classList.contains("is-on")) {
    state.game = startMonth(finishMonth(state.game));
    state.view = { event: eventForUI(state.game.pendingEvent) };
    persist();
    render();
  }
});

boot();
