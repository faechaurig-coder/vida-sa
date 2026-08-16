import { choose, hudOf, startLife } from "../engine/play.js";
import { homeLabel, carLabel } from "../systems/assets.js";
import { getPerk } from "../content/perks.js";
import { emptyMeta, loadSave, rememberLife, saveAll } from "../systems/persist.js";
import { equipPerk, perkTier, tierLabel, upgradePerk } from "../systems/perks.js";
import {
  renderBoot,
  renderIntro,
  renderLife,
  renderPost,
  renderSeeds,
} from "./render.js";

const stageEl = document.getElementById("stage");
const hud = document.getElementById("hud");
const reveal = document.getElementById("reveal");

const state = {
  screen: "boot",
  introBeat: 0,
  run: null,
  view: null,
  beat: 0,
  meta: emptyMeta(),
};

function money(n) {
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(Math.round(n));
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
  render();
}

function persist() {
  saveAll(state.meta, state.run && !state.run.ended ? { run: state.run, view: state.view } : null);
}

function paintHud() {
  if (!state.run || state.screen !== "life") {
    hud.hidden = true;
    return;
  }
  const h = hudOf(state.run);
  hud.hidden = false;
  document.getElementById("hud-age").textContent = h.age + " años";
  document.getElementById("hud-job").textContent = h.job;
  document.getElementById("hud-money").textContent = money(h.money);
  document.getElementById("hud-hap").textContent = h.happiness;
  document.getElementById("hud-hp").textContent = h.health;
  document.getElementById("bar-hap").style.width = h.happiness + "%";
  document.getElementById("bar-hp").style.width = h.health + "%";
  document.getElementById("home-tier").textContent = homeLabel(h.home);
  document.getElementById("car-tier").textContent = carLabel(h.car);
  document.getElementById("rel-tier").textContent = h.partner ? "alguien" : "—";
  const debt = document.getElementById("debt-tier");
  debt.hidden = h.debt <= 0;
  debt.textContent = h.debt > 0 ? "deuda" : "";
}

function showReveal(upgrade) {
  document.getElementById("reveal-title").textContent = upgrade.title;
  document.getElementById("reveal-copy").textContent = upgrade.copy;
  document.getElementById("reveal-art").className = "reveal-art " + upgrade.kind;
  reveal.classList.add("is-on");
}

function hideReveal() {
  reveal.classList.remove("is-on");
}

const CORP_META = {
  boot: "Expediente",
  intro: "Onboarding",
  seed: "Origen",
  life: "En curso",
  post: "Balance",
};

function equippedForLife() {
  const id = state.meta.equippedPerk;
  if (!id) return null;
  const tier = perkTier(state.meta, id);
  if (tier < 1) return null;
  return { id, tier };
}

function paintPerkChip() {
  const chip = document.getElementById("perk-chip");
  if (!chip) return;
  const eq = state.run?.equippedPerk;
  if (!eq || state.screen !== "life") {
    chip.hidden = true;
    return;
  }
  const perk = getPerk(eq.id);
  chip.hidden = false;
  chip.textContent = (perk?.name ?? "Comodín") + " · " + tierLabel(eq.tier);
}

function render() {
  paintHud();
  paintPerkChip();
  const meta = document.getElementById("corp-meta");
  meta.textContent = CORP_META[state.screen] ?? "VIDA S.A.";

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
    const ev = state.view.event;
    if (!ev) {
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

stageEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
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
    const pack = choose(state.run, btn.getAttribute("data-id"));
    state.run = pack.run;
    state.view = pack.view;
    if (pack.view.upgrade) showReveal(pack.view.upgrade);
    if (pack.run.ended) {
      state.screen = "post";
      state.beat = 0;
      state.meta = rememberLife(state.meta, pack.run, pack.view.rank, pack.view.pvAward ?? 0);
    } else {
      state.screen = "life";
    }
    persist();
    return render();
  }
});

document.getElementById("reveal-ok").addEventListener("click", hideReveal);

boot();
