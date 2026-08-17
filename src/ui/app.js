import { createGame, startMonth, resolveDecision, finishMonth, hudFromGame, eventForUI } from "../motor/loop.js";
import { seedToGameConfig } from "../motor/adapter/legacy.js";
import { SEEDS, getSeed } from "../content/seeds.js";
import { emptyMeta, loadSave, saveAll } from "../systems/persist.js";
import { hasActiveSession, sessionPreview, sessionPreviewFromSave } from "../systems/session.js";
import { character, logoMark, moodFromTone } from "./art.js";
import { formatMoney, juiceHero, juiceTone, juiceOutcomeEmoji, juiceKicker, deltaOutcomeEmoji } from "./juice.js";
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
  savePreview: null,
  confirmNew: false,
};

const CORP = {
  boot: "Tu vida",
  worlds: "Mundos",
  create: "Personaje",
  seed: "Tu origen",
  life: "En curso",
  stories: "Historias",
  collection: "Colección",
  menu: "Menú",
};

const AUTO_ADVANCE_MS = 1500;
const AUTO_UNLOCK_MS = 1800;

let decisionTimer = null;

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function clearDecisionTimer() {
  if (decisionTimer) {
    clearTimeout(decisionTimer);
    decisionTimer = null;
  }
}

function scheduleAutoAdvance(ms = AUTO_ADVANCE_MS) {
  clearDecisionTimer();
  decisionTimer = setTimeout(() => completeResultFlow(), ms);
}

function completeResultFlow() {
  clearDecisionTimer();
  hideJuice();
  if (!state.game || state.game.phase !== "showing_result") return;
  if (showNextUnlock()) {
    scheduleAutoAdvance(AUTO_UNLOCK_MS);
    return;
  }
  advanceAfterResult();
}

function isInGame() {
  return IN_GAME_SCREENS.has(state.screen);
}

function boot() {
  try {
    const saved = loadSave();
    state.meta = saved.meta;
    state.savePreview = sessionPreviewFromSave(saved.session);
    state.confirmNew = false;
    state.screen = "boot";
    state.game = null;
    state.view = null;
    state.tab = "life";
  } catch {
    state.screen = "boot";
    state.game = null;
    state.savePreview = null;
  }
  render();
}

function persist() {
  if (!state.game) return;
  const { catalog, ...motorGame } = state.game;
  saveAll(state.meta, { motorGame, tab: state.tab, screen: state.screen });
  state.savePreview = sessionPreview(motorGame);
}

function goToMenu() {
  if (state.game) persist();
  clearDecisionTimer();
  hideJuice();
  hideUnlock();
  state.unlockQueue = [];
  state.confirmNew = false;
  state.savePreview = state.game ? sessionPreview(state.game) : state.savePreview;
  state.game = null;
  state.view = null;
  state.tab = "life";
  state.screen = "boot";
  render();
}

function continueLife() {
  const saved = loadSave();
  const motor = saved.session?.motorGame;
  if (!hasActiveSession(saved.session)) return;
  let game = motor;
  try {
    if (game.phase === "showing_result") {
      game = startMonth(finishMonth(game));
    } else if (!game.pendingEvent) {
      game = startMonth(game);
    }
  } catch (err) {
    console.error(err);
    state.confirmNew = false;
    state.savePreview = sessionPreviewFromSave(saved.session);
    state.screen = "boot";
    return render();
  }
  state.game = game;
  state.view = { event: eventForUI(game.pendingEvent) };
  state.screen = "life";
  state.tab = saved.session?.tab === "life" || !saved.session?.tab ? "life" : saved.session.tab;
  if (state.tab !== "life") state.screen = state.tab;
  state.confirmNew = false;
  persist();
  render();
}

function startNewGameFlow(force = false) {
  if (state.savePreview && !force) {
    state.confirmNew = true;
    state.screen = "boot";
    return render();
  }
  saveAll(state.meta, null);
  state.savePreview = null;
  state.confirmNew = false;
  state.game = null;
  state.view = null;
  state.selectedWorld = null;
  state.screen = "worlds";
  render();
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
  if (kicker) kicker.textContent = juiceOutcomeEmoji(tone) + " " + juiceKicker(tone);
  const years = currentLabel && nextMonthLabel && currentLabel !== nextMonthLabel
    ? currentLabel + " → " + nextMonthLabel
    : nextMonthLabel
      ? "Siguiente: " + nextMonthLabel
      : "";
  document.getElementById("juice-years").textContent = years;
  document.getElementById("juice-char").innerHTML = character(moodFromTone(tone));
  document.getElementById("juice-hero").textContent = juiceOutcomeEmoji(tone) + " " + hero.text;
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
        '</span><span class="delta-val">' +
        deltaOutcomeEmoji(cls === "up") +
        " " +
        val +
        "</span></div>"
      );
    })
    .join("");
  document.getElementById("juice-hook").hidden = true;
  juice.classList.add("is-on");
  juice.setAttribute("aria-hidden", "false");
}

function hideJuice() {
  juice.classList.remove("is-on");
  juice.setAttribute("aria-hidden", "true");
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
  unlockEl.setAttribute("aria-hidden", "false");
  playFx(FX.UNLOCK);
  return true;
}

function hideUnlock() {
  unlockEl?.classList.remove("is-on");
  unlockEl?.setAttribute("aria-hidden", "true");
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
      stageEl.innerHTML = renderBoot(state.meta, state.savePreview, state.confirmNew);
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
        stageEl.innerHTML = renderBoot(state.meta, state.savePreview, state.confirmNew);
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
  if (act === "menu" || act === "boot") {
    state.confirmNew = false;
    goToMenu();
    return;
  }
  if (act === "continue") {
    continueLife();
    return;
  }
  if (act === "new-game") {
    startNewGameFlow(false);
    return;
  }
  if (act === "new-game-yes") {
    startNewGameFlow(true);
    return;
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
    if (state.game?.phase === "showing_result" && !state.game.pendingEvent) {
      return completeResultFlow();
    }
    if (!state.game?.pendingEvent || state.tab !== "life") return;
    state.busy = true;
    const eventUi = state.view?.event;
    btn.classList.add("is-picking");
    try {
      await wait(220);
      const currentLabel = hudFromGame(state.game).monthYear;
      const resolved = resolveDecision(state.game, btn.getAttribute("data-id"));
      state.game = resolved;
      state.view = { event: eventUi, resolved: true };
      const preview = finishMonth(resolved);
      const nextLabel = hudFromGame(preview).monthYear;
      state._nextMonthLabel = nextLabel;
      queueUnlocks(resolved.lastResult?.unlocks ?? []);
      render();
      paintHud();
      playFx(FX.DECISION);
      showJuiceMotor(resolved.lastResult, nextLabel, currentLabel);
      persist();
      scheduleAutoAdvance();
    } catch (err) {
      console.error(err);
      state.view = state.game?.pendingEvent
        ? { event: eventForUI(state.game.pendingEvent) }
        : state.view;
      state.screen = state.game?.pendingEvent ? "life" : "boot";
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

topbar?.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn || state.busy) return;
  const act = btn.getAttribute("data-act");
  if (act === "menu" && isInGame()) goToMenu();
});

function advanceAfterResult() {
  clearDecisionTimer();
  if (!state.game || state.game.phase !== "showing_result") return;
  try {
    state.game = startMonth(finishMonth(state.game));
    state.view = { event: eventForUI(state.game.pendingEvent) };
    state._nextMonthLabel = null;
    playFx(FX.MONTH);
    persist();
    render();
  } catch (err) {
    console.error(err);
    state.busy = false;
    hideJuice();
    hideUnlock();
    persist();
    render();
  }
}

document.getElementById("juice-ok").addEventListener("click", (e) => {
  e.stopPropagation();
  completeResultFlow();
});

juice?.addEventListener("click", (e) => {
  if (!juice.classList.contains("is-on")) return;
  if (e.target.closest("#juice-ok")) return;
  if (e.target.closest(".juice-card")) completeResultFlow();
});

document.getElementById("unlock-ok")?.addEventListener("click", (e) => {
  e.stopPropagation();
  hideUnlock();
  if (state.unlockQueue.length) {
    setTimeout(() => {
      showNextUnlock();
      scheduleAutoAdvance(AUTO_UNLOCK_MS);
    }, 120);
    return;
  }
  if (state.game?.phase === "showing_result" && !juice.classList.contains("is-on")) {
    completeResultFlow();
  }
});

unlockEl?.addEventListener("click", (e) => {
  if (!unlockEl.classList.contains("is-on")) return;
  if (e.target.closest("#unlock-ok")) return;
  if (e.target.closest(".unlock-card")) {
    hideUnlock();
    if (state.unlockQueue.length) {
      setTimeout(() => {
        showNextUnlock();
        scheduleAutoAdvance(AUTO_UNLOCK_MS);
      }, 120);
      return;
    }
    if (state.game?.phase === "showing_result") completeResultFlow();
  }
});

boot();

const logoEl = document.getElementById("logo-mark");
if (logoEl) logoEl.innerHTML = logoMark();
