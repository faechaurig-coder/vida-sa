/** Ganchos de feedback. Sin audio todavía — listos para click / decisión / unlock / mes. */

export const FX = {
  CLICK: "click",
  DECISION: "decision",
  REWARD: "reward",
  UNLOCK: "unlock",
  MONTH: "month",
};

export function playFx(kind) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.fx = kind;
  window.clearTimeout(playFx._t);
  playFx._t = window.setTimeout(() => {
    if (root.dataset.fx === kind) delete root.dataset.fx;
  }, 220);
}
