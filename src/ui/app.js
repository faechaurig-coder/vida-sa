import { choose, hudOf, startLife } from "../engine/play.js";
import { LIFE_MARKS, lifeProgress, yearsLine } from "../content/present.js";
import { carLabel, homeLabel } from "../systems/assets.js";
import { getPerk } from "../content/perks.js";
import { emptyMeta, loadSave, rememberLife, saveAll } from "../systems/persist.js";
import { equipPerk, perkTier, tierLabel, upgradePerk } from "../systems/perks.js";
import { formatMoney, juiceDeltas, juiceHero, juiceTone, snap } from "./juice.js";
import { renderBoot, renderIntro, renderLife, renderPost, renderSeeds } from "./render.js";

const stageEl = document.getElementById("stage");
const hud = document.getElementById("hud");
const reveal = document.getElementById("reveal");
const juice = document.getElementById("juice");
const topbar = document.getElementById("topbar");
const fineprint = document.getElementById("fineprint");

const state = {
  screen: "boot",
  introBeat: 0,
  run: null,
  view: null,
  beat: 0,
  meta: emptyMeta(),
  busy: false,
  pending: null,
};

const CORP = {
  boot: "Tu vida",
  intro: "Así se juega",
  seed: "Tu origen",
  life: "En curso",
  post: "El final",
};

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function boot() {
  const saved = loadSave();
  state.meta = saved.meta;
  if (saved.session?.run && !saved.session.run.ended) {
    state.run = saved.session.run;
    state.view = saved.session.view;
    state.screen = "life";
  } else {
    state.screen = "boot";
    state.introBeat = 0;
  }
  paintMarks();
  render();
}

function persist() {
  saveAll(state.meta, state.run && !state.run.ended ? { run: state.run, view: state.view } : null);
}

function paintMarks() {
  const el = document.getElementById("life-marks");
  if (el) el.innerHTML = LIFE_MARKS.map((m) => "<span>" + m.icon + "</span>").join("");
}

function paintHud() {
  if (!state.run || (state.screen !== "life" && !juice.classList.contains("is-on"))) {
    hud.hidden = true;
    return;
  }
  const h = hudOf(state.run);
  hud.hidden = false;
  document.getElementById("hud-age").textContent = h.age + " años";
  document.getElementById("hud-job").textContent = h.job;
  const cash = document.getElementById("hud-money");
  cash.textContent = formatMoney(h.money);
  cash.classList.toggle("is-neg", h.money < 0);
  document.getElementById("hud-hap").textContent = h.happiness;
  document.getElementById("hud-hp").textContent = h.health;
  document.getElementById("home-tier").textContent = homeLabel(h.home);
  document.getElementById("car-tier").textContent = carLabel(h.car);
  document.getElementById("rel-tier").textContent = h.partner ? "alguien" : "—";
  const debt = document.getElementById("debt-tier");
  debt.hidden = h.debt <= 0;
  const p = lifeProgress(h.age);
  document.getElementById("life-fill").style.width = p * 100 + "%";
  document.getElementById("life-dot").style.left = p * 100 + "%";
}

function paintPerkChip() {
  const chip = document.getElementById("perk-chip");
  const eq = state.run?.equippedPerk;
  if (!eq || state.screen !== "life") {
    chip.hidden = true;
    return;
  }
  const perk = getPerk(eq.id);
  chip.hidden = false;
  chip.textContent = "🎁 " + (perk?.name ?? "Extra") + " · " + tierLabel(eq.tier);
}

function equippedForLife() {
  const id = state.meta.equippedPerk;
  if (!id) return null;
  const tier = perkTier(state.meta, id);
  return tier < 1 ? null : { id, tier };
}

function showJuice(pack, before, years, deferred) {
  const deltas = juiceDeltas(before, pack.run);
  const hero = juiceHero(deltas);
  const tone = juiceTone(deltas);
  const card = juice.querySelector(".juice-card");
  card.className = "overlay-card juice-card is-" + tone;
  document.getElementById("juice-years").textContent = yearsLine(years);
  document.getElementById("juice-hero").textContent = hero.icon + " " + hero.text;
  document.getElementById("juice-line").textContent = pack.view.punchline || "Tu vida cambió.";
  document.getElementById("juice-deltas").innerHTML = deltas
    .filter((d) => d.key !== "money" || deltas.length < 2)
    .slice(0, 4)
    .map((d) => {
      if (d.text) return '<div class="delta">' + d.icon + " " + d.label + "<span>" + d.text + "</span></div>";
      const sign = d.delta > 0 ? "+" : "";
      const val = d.money ? sign + formatMoney(d.delta).replace("-", "") : sign + d.delta;
      return (
        '<div class="delta ' +
        (d.good ? "up" : "down") +
        '">' +
        d.icon +
        " " +
        d.label +
        "<span>" +
        (d.delta < 0 && d.money ? "-" : "") +
        val +
        "</span></div>"
      );
    })
    .join("");
  const hook = document.getElementById("juice-hook");
  hook.hidden = !deferred;
  hook.textContent = deferred ? "😬 Esto todavía te puede costar…" : "";
  juice.classList.add("is-on");
  if (tone === "loss") hud.classList.add("shake");
  setTimeout(() => hud.classList.remove("shake"), 400);
}

function hideJuice() {
  juice.classList.remove("is-on");
}

function showReveal(upgrade) {
  const kicker = upgrade.kind === "home" ? "🏠 ¡NUEVO HOGAR!" : "🚗 ¡NUEVO COCHE!";
  document.getElementById("reveal-kicker").textContent = kicker;
  document.getElementById("reveal-title").textContent = upgrade.title;
  document.getElementById("reveal-copy").textContent = upgrade.copy;
  const art = document.getElementById("reveal-art");
  art.className = "reveal-art " + upgrade.kind;
  art.textContent = upgrade.kind === "home" ? "🏡" : "🚗";
  reveal.classList.add("is-on");
}

function hideReveal() {
  reveal.classList.remove("is-on");
}

function commitPending() {
  const pack = state.pending;
  state.pending = null;
  if (!pack) return render();
  if (pack.run.ended) {
    state.screen = "post";
    state.beat = 0;
    state.meta = rememberLife(state.meta, pack.run, pack.view.rank, pack.view.pvAward ?? 0);
  } else {
    state.screen = "life";
  }
  persist();
  render();
}

function render() {
  paintHud();
  paintPerkChip();
  topbar.classList.toggle("is-hidden", state.screen === "boot");
  fineprint.classList.toggle("is-hidden", state.screen === "life");
  document.getElementById("corp-meta").textContent = CORP[state.screen] ?? "VIDA S.A.";

  if (state.screen === "boot") {
    stageEl.innerHTML = renderBoot(state.meta);
    return;
  }
  if (state.screen === "intro") {
    stageEl.innerHTML = renderIntro(state.introBeat);
    return;
  }
  if (state.screen === "seed") {
    stageEl.innerHTML = renderSeeds(state.meta);
    return;
  }
  if (state.screen === "life") {
    if (!state.view?.event) {
      state.screen = "post";
      return render();
    }
    stageEl.innerHTML = renderLife(state.run, state.view);
    return;
  }
  if (state.screen === "post") {
    stageEl.innerHTML = renderPost(state.view, state.meta, state.beat, state.run?.collapse);
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
  if (act === "seeds") {
    state.screen = "seed";
    return render();
  }
  if (act === "boot") {
    state.screen = "boot";
    state.run = null;
    persist();
    return render();
  }
  if (act === "again") {
    state.screen = "seed";
    state.run = null;
    persist();
    return render();
  }
  if (act === "beat") {
    state.beat = Math.min(3, state.beat + 1);
    return render();
  }
  if (act === "seed") {
    const pack = startLife(btn.getAttribute("data-id"), equippedForLife());
    state.run = pack.run;
    state.view = pack.view;
    state.screen = "life";
    persist();
    return render();
  }
  if (act === "equip") {
    const res = equipPerk(state.meta, btn.getAttribute("data-id"));
    if (res.ok) state.meta = res.meta;
    persist();
    return render();
  }
  if (act === "upgrade") {
    const res = upgradePerk(state.meta, btn.getAttribute("data-id"));
    if (res.ok) state.meta = res.meta;
    persist();
    return render();
  }
  if (act === "opt") {
    if (!state.run || state.run.ended) return;
    state.busy = true;
    btn.classList.add("is-picking");
    const before = snap(state.run);
    const ev = state.view.event;
    const option = ev.options.find((o) => o.id === btn.getAttribute("data-id"));
    await wait(420);
    const pack = choose(state.run, btn.getAttribute("data-id"));
    state.run = pack.run;
    state.view = pack.view;
    state.pending = pack;
    paintHud();
    showJuice(pack, before, ev.years ?? 2, !!option?.deferred);
    persist();
    state.busy = false;
  }
});

document.getElementById("juice-ok").addEventListener("click", () => {
  hideJuice();
  const pack = state.pending;
  if (pack?.view.upgrade) {
    showReveal(pack.view.upgrade);
    return;
  }
  commitPending();
});

document.getElementById("reveal-ok").addEventListener("click", () => {
  hideReveal();
  commitPending();
});

boot();
