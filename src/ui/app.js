import { choose, hudOf, startLife } from "../engine/play.js";
import { yearsLine } from "../content/present.js";
import { getPerk } from "../content/perks.js";
import { emptyMeta, loadSave, rememberLife, saveAll } from "../systems/persist.js";
import { equipPerk, perkTier, tierLabel, upgradePerk } from "../systems/perks.js";
import { carArt, character, houseArt, icon, moodFromTone } from "./art.js";
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
  try {
    const saved = loadSave();
    state.meta = saved.meta;
    const run = saved.session?.run;
    const view = saved.session?.view;
    if (run && !run.ended && view?.event) {
      state.run = run;
      state.view = view;
      state.screen = "life";
    } else {
      state.screen = "boot";
      state.introBeat = 0;
    }
  } catch {
    state.screen = "boot";
    state.run = null;
    state.view = null;
  }
  render();
}

function persist() {
  saveAll(state.meta, state.run && !state.run.ended ? { run: state.run, view: state.view } : null);
}

function setIcon(id, name, on = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = icon(name);
  el.classList.toggle("is-off", !on);
}

function paintHud() {
  const show = !!state.run && (state.screen === "life" || juice.classList.contains("is-on"));
  hud.hidden = !show;
  if (!show) return;
  const h = hudOf(state.run);
  document.getElementById("hud-avatar").innerHTML = character("idle");
  document.getElementById("hud-age").textContent = h.age + " años";
  document.getElementById("hud-job").textContent = h.job;
  const cash = document.getElementById("hud-money");
  cash.textContent = formatMoney(h.money);
  cash.classList.toggle("is-neg", h.money < 0);
  document.getElementById("hap-vital").innerHTML = icon("hap") + "<b>" + h.happiness + "</b>";
  document.getElementById("hp-vital").innerHTML = icon("hp") + "<b>" + h.health + "</b>";
  document.getElementById("home-ico").innerHTML = houseArt(h.home, "");
  document.getElementById("car-ico").innerHTML = carArt(h.car, "");
  setIcon("study-ico", "study", state.run.flags?.includes("estudio"));
  setIcon("fam-ico", "family", !!h.partner);
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
  chip.textContent = (perk?.name ?? "Extra") + " · " + tierLabel(eq.tier);
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
  document.getElementById("juice-char").innerHTML = character(
    hero.art === "money" && tone === "gain" ? "rich" : moodFromTone(tone),
  );
  document.getElementById("juice-hero").textContent = hero.text;
  document.getElementById("juice-line").textContent = pack.view.punchline || "Tu vida cambió.";
  document.getElementById("juice-deltas").innerHTML = deltas
    .slice(0, 4)
    .map((d) => {
      const cls = d.good ? "up" : "down";
      if (d.text) {
        return (
          '<div class="delta"><span class="delta-left">' +
          icon(d.art) +
          d.label +
          "</span><span>" +
          d.text +
          "</span></div>"
        );
      }
      const from = d.money ? formatMoney(d.from) : d.from;
      const to = d.money ? formatMoney(d.to) : d.to;
      return (
        '<div class="delta ' +
        cls +
        '"><span class="delta-left">' +
        icon(d.art) +
        d.label +
        "</span><span>" +
        from +
        " → " +
        to +
        "</span></div>"
      );
    })
    .join("");
  const hook = document.getElementById("juice-hook");
  hook.hidden = !deferred;
  hook.textContent = deferred ? "Esto todavía te puede costar…" : "";
  juice.classList.add("is-on");
  if (tone === "loss") hud.classList.add("shake");
  setTimeout(() => hud.classList.remove("shake"), 400);
}

function hideJuice() {
  juice.classList.remove("is-on");
}

function showReveal(upgrade) {
  document.getElementById("reveal-kicker").textContent =
    upgrade.kind === "home" ? "¡NUEVO HOGAR!" : "¡NUEVO COCHE!";
  document.getElementById("reveal-title").textContent = upgrade.title;
  document.getElementById("reveal-copy").textContent = upgrade.copy;
  document.getElementById("reveal-art").innerHTML =
    upgrade.kind === "home" ? houseArt(upgrade.to, "art-xl") : carArt(upgrade.to, "art-xl");
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

function fallbackBoot() {
  return (
    '<section class="screen screen-hero fade-in"><div class="hero-content">' +
    "<h1>¿Qué vida te toca?</h1>" +
    '<button type="button" class="btn btn-xl" data-act="seeds">EMPEZAR</button></div></section>'
  );
}

function render() {
  try {
    paintHud();
    paintPerkChip();
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
    if (state.screen === "seed") {
      stageEl.innerHTML = renderSeeds(state.meta);
      return;
    }
    if (state.screen === "life") {
      if (!state.view?.event) {
        state.screen = "boot";
        state.run = null;
        stageEl.innerHTML = renderBoot(state.meta);
        return;
      }
      stageEl.innerHTML = renderLife(state.run, state.view);
      return;
    }
    if (state.screen === "post") {
      if (!state.view?.rank) {
        state.screen = "boot";
        stageEl.innerHTML = renderBoot(state.meta);
        return;
      }
      stageEl.innerHTML = renderPost(state.view, state.meta, state.beat, state.run?.collapse);
    }
  } catch {
    state.screen = "boot";
    state.busy = false;
    hideJuice();
    hideReveal();
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
    try {
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
    } catch {
      state.screen = "boot";
      state.run = null;
      render();
    } finally {
      state.busy = false;
    }
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
