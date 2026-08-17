import { createGame, startMonth, resolveDecision, finishMonth, hudFromGame, eventForUI } from "../motor/loop.js";
import { seedToGameConfig } from "../motor/adapter/legacy.js";
import { SEEDS, getSeed } from "../content/seeds.js";
import { emptyMeta, loadSave, saveAll } from "../systems/persist.js";
import { carArt, character, houseArt, icon, moodFromTone } from "./art.js";
import { formatMoney, juiceHero, juiceTone } from "./juice.js";
import { renderBoot, renderCreate, renderIntro, renderLife, renderSeeds, renderWorlds } from "./render.js";
import { STAGE_LABELS } from "../motor/constants.js";

const stageEl = document.getElementById("stage");
const hud = document.getElementById("hud");
const juice = document.getElementById("juice");
const topbar = document.getElementById("topbar");
const fineprint = document.getElementById("fineprint");

const state = {
  screen: "boot",
  introBeat: 0,
  game: null,
  view: null,
  meta: emptyMeta(),
  selectedWorld: null,
  busy: false,
};

const CORP = {
  boot: "Tu vida",
  worlds: "Mundos",
  create: "Personaje",
  seed: "Tu origen",
  life: "En curso",
};

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
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
  const session = state.game && state.screen === "life" ? { motorGame: state.game } : null;
  saveAll(state.meta, session);
}

function setIcon(id, name, on = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = icon(name);
  el.classList.toggle("is-off", !on);
}

function paintHud() {
  const show = state.screen === "life" || juice.classList.contains("is-on");
  hud.hidden = !show;
  if (!show || !state.game) return;
  const h = hudFromGame(state.game);
  document.getElementById("hud-avatar").innerHTML = character("idle");
  document.getElementById("hud-date").textContent = h.monthYear;
  document.getElementById("hud-age").textContent = h.age + " años · " + (STAGE_LABELS[h.stage] ?? h.stage);
  document.getElementById("hud-job").textContent = h.job ?? (h.partner ? "En pareja" : "—");
  const cash = document.getElementById("hud-money");
  cash.textContent = formatMoney(h.dinero);
  cash.classList.toggle("is-neg", h.dinero < 0);
  document.getElementById("hp-vital").innerHTML = icon("hp") + "<b>" + h.salud + "</b>";
  document.getElementById("hap-vital").innerHTML = icon("hap") + "<b>" + h.felicidad + "</b>";
  document.getElementById("inf-vital").innerHTML = icon("spark") + "<b>" + h.influencia + "</b>";
  document.getElementById("evil-vital").innerHTML = icon("lock") + "<b>" + h.maldad + "</b>";
  const p = state.game.player;
  document.getElementById("home-ico").innerHTML = houseArt(p.home ?? 0, "");
  document.getElementById("car-ico").innerHTML = carArt(p.car ?? 0, "");
  setIcon("study-ico", "study", p.flags?.includes("estudio"));
  setIcon("fam-ico", "family", h.partner);
}

function showJuiceMotor(result, nextMonthLabel) {
  const deltas = (result.deltas ?? []).map((d) => ({
    key: d.key,
    art: d.key === "dinero" ? "money" : d.key === "felicidad" ? "hap" : d.key === "salud" ? "hp" : "spark",
    label: d.key,
    delta: d.delta,
    good: d.key === "maldad" ? d.delta < 0 : d.delta > 0,
    money: d.key === "dinero",
  }));
  const hero = juiceHero(deltas);
  const tone = juiceTone(deltas);
  const card = juice.querySelector(".juice-card");
  card.className = "overlay-card juice-card is-" + tone;
  document.getElementById("juice-years").textContent = nextMonthLabel ? "Siguiente: " + nextMonthLabel : "";
  document.getElementById("juice-char").innerHTML = character(moodFromTone(tone));
  document.getElementById("juice-hero").textContent = hero.text;
  document.getElementById("juice-line").textContent = result.text ?? "Decidiste.";
  document.getElementById("juice-deltas").innerHTML = (result.deltas ?? [])
    .map((d) => {
      const cls = d.key === "maldad" ? (d.delta > 0 ? "down" : "up") : d.delta > 0 ? "up" : "down";
      const label =
        d.key === "salud"
          ? "Salud"
          : d.key === "felicidad"
            ? "Felicidad"
            : d.key === "dinero"
              ? "Dinero"
              : d.key === "influencia"
                ? "Influencia"
                : "Maldad";
      const val = d.key === "dinero" ? (d.delta > 0 ? "+" : "") + formatMoney(d.delta) : (d.delta > 0 ? "+" : "") + d.delta;
      return (
        '<div class="delta ' +
        cls +
        '"><span class="delta-left">' +
        icon(d.key === "dinero" ? "money" : d.key === "felicidad" ? "hap" : d.key === "salud" ? "hp" : "spark") +
        label +
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

function beginLife(config) {
  state.game = startMonth(createGame(config));
  state.view = { event: eventForUI(state.game.pendingEvent) };
  state.screen = "life";
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
    paintHud();
    topbar.classList.toggle("is-hidden", state.screen === "boot");
    fineprint.classList.toggle("is-hidden", state.screen === "life" || state.screen === "boot");
    document.getElementById("corp-meta").textContent = CORP[state.screen] ?? "VIDA S.A.";

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
      stageEl.innerHTML = renderLife(state.game?.player ?? {}, state.view);
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
    if (!state.game?.pendingEvent) return;
    state.busy = true;
    btn.classList.add("is-picking");
    try {
      await wait(380);
      const resolved = resolveDecision(state.game, btn.getAttribute("data-id"));
      state.game = resolved;
      const preview = finishMonth(resolved);
      const nextLabel = hudFromGame(preview).monthYear;
      state._nextMonthLabel = nextLabel;
      paintHud();
      showJuiceMotor(resolved.lastResult, nextLabel);
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

document.getElementById("juice-ok").addEventListener("click", () => {
  hideJuice();
  if (!state.game || state.game.phase !== "showing_result") return;
  state.game = startMonth(finishMonth(state.game));
  state.view = { event: eventForUI(state.game.pendingEvent) };
  state._nextMonthLabel = null;
  persist();
  render();
});

boot();
