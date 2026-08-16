import { SEEDS } from "../content/seeds.js";
import { choose, hudOf, startLife } from "../engine/play.js";
import { CARS, HOMES } from "../engine/constants.js";
import { emptyMeta, loadSave, rememberLife, saveAll } from "../systems/persist.js";

const stageEl = document.getElementById("stage");
const hud = document.getElementById("hud");
const reveal = document.getElementById("reveal");

const state = {
  screen: "boot",
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
  document.getElementById("home-tier").textContent = HOMES[h.home];
  document.getElementById("car-tier").textContent = CARS[h.car];
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

function render() {
  paintHud();
  const meta = document.getElementById("corp-meta");
  if (state.screen === "boot") {
    meta.textContent = "Playtest";
    stageEl.innerHTML =
      '<p class="eyebrow">VIDA S.A. · vertical slice</p>' +
      "<h1>Tu vida es un producto. Tú eres el KPI.</h1>" +
      '<p class="lead">Una vida comprimida. Mismo motor que el juego. Elige, paga, termina, vuelve.</p>' +
      (state.meta.lastEpitaph
        ? '<p class="tick">Última acta: ' + state.meta.lastEpitaph + "</p>"
        : "") +
      '<p class="lead">Puntos de Vida: ' +
      (state.meta.pv ?? 0) +
      ". Solo sirven para comodines. No están en la vida.</p>" +
      '<button type="button" class="btn" data-act="seeds">Nueva vida</button>';
    return;
  }
  if (state.screen === "seed") {
    meta.textContent = "Origen";
    stageEl.innerHTML =
      '<p class="eyebrow">Esta va a ser tu vida</p>' +
      "<h2>Elige una tensión. No un modificador.</h2>" +
      '<div class="choices">' +
      SEEDS.map(
        (s) =>
          '<button type="button" class="choice" data-act="seed" data-id="' +
          s.id +
          '"><strong>' +
          s.title +
          "</strong><small>" +
          s.tension +
          "</small></button>",
      ).join("") +
      "</div>";
    return;
  }
  if (state.screen === "life") {
    const ev = state.view.event;
    meta.textContent = ev?.stage ?? "Vida";
    if (!ev) {
      state.screen = "post";
      return render();
    }
    stageEl.innerHTML =
      '<p class="stage-tag">' +
      ev.stage +
      " · " +
      state.run.age +
      " años</p>" +
      "<h2>" +
      ev.title +
      "</h2>" +
      '<p class="card-body">' +
      ev.body +
      "</p>" +
      '<p class="tick">' +
      (state.view.punchline || "") +
      "</p>" +
      '<div class="choices">' +
      ev.options
        .map(
          (o) =>
            '<button type="button" class="choice" data-act="opt" data-id="' +
            o.id +
            '">' +
            o.label +
            "<small>" +
            o.hint +
            "</small></button>",
        )
        .join("") +
      "</div>";
    return;
  }
  if (state.screen === "post") {
    const v = state.view;
    const r = v.rank;
    const beats = [
      {
        kicker: "Beat 1 · Epitafio",
        title: r.identity,
        body: state.run.collapse ? "El cuerpo o la cuenta cerraron el acta antes." : "El juego observa. Tú interpretas.",
      },
      {
        kicker: "Beat 2 · Identidad",
        title: r.dominant + " alto · " + r.neglected + " bajo",
        body: "Conseguiste " + r.got + ". Sacrificaste " + r.sacrificed + ".",
      },
      {
        kicker: "Beat 3 · Estuviste cerca",
        title: v.near ? v.near.text : "Esta vida no estuvo cerca de nada relevante.",
        body: v.near ? "Una decisión lo dejó a un paso." : "A veces no hay casi. Hay lo que hay.",
      },
      {
        kicker: "Beat 4 · ¿Y si…?",
        title: v.question,
        body:
          "+" +
          (v.pvAward ?? 0) +
          " PV esta vida · total " +
          (state.meta.pv ?? 0) +
          ". No compran el final. Otra semilla. Una más.",
        cta: true,
      },
    ];
    const b = beats[state.beat] ?? beats[3];
    meta.textContent = "Balance";
    stageEl.innerHTML =
      '<p class="eyebrow">' +
      b.kicker +
      "</p>" +
      "<h2>" +
      b.title +
      "</h2>" +
      '<p class="lead">' +
      b.body +
      "</p>" +
      (b.cta
        ? '<button type="button" class="btn" data-act="again">Nueva vida</button><button type="button" class="btn ghost" data-act="boot">Inicio</button>'
        : '<button type="button" class="btn" data-act="beat">Continuar</button>');
  }
}

stageEl.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act]");
  if (!btn) return;
  const act = btn.getAttribute("data-act");
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
    const pack = startLife(btn.getAttribute("data-id"));
    state.run = pack.run;
    state.view = pack.view;
    state.screen = "life";
    persist();
    return render();
  }
  if (act === "opt") {
    const pack = choose(state.run, btn.getAttribute("data-id"));
    state.run = pack.run;
    state.view = pack.view;
    if (pack.view.upgrade) {
      showReveal(pack.view.upgrade);
    }
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
