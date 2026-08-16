/** Kit visual vectorial. Un solo estilo, sin imágenes de IA. */

const svg = (inner, vb = "0 0 64 64", cls = "") =>
  '<svg class="art' +
  (cls ? " " + cls : "") +
  '" viewBox="' +
  vb +
  '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  inner +
  "</svg>";

export const ICONS = {
  money: svg(
    '<rect x="8" y="16" width="48" height="32" rx="6" fill="#3D9A55"/><rect x="12" y="20" width="40" height="24" rx="4" fill="#5FBF73"/><circle cx="32" cy="32" r="8" fill="#E8F8EC"/><text x="32" y="36" text-anchor="middle" font-size="11" font-weight="700" fill="#2A7A3E">$</text>',
  ),
  hap: svg(
    '<path d="M32 54C32 54 10 38 10 24a12 12 0 0 1 22-6 12 12 0 0 1 22 6c0 14-22 30-22 30z" fill="#E2556A"/>',
  ),
  hp: svg(
    '<circle cx="32" cy="32" r="22" fill="#3D8A7A"/><path d="M18 32h10l4-10 6 20 4-10h10" fill="none" stroke="#E8F8F4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
  ),
  job: svg(
    '<rect x="12" y="24" width="40" height="28" rx="4" fill="#8B5A2B"/><rect x="22" y="16" width="20" height="10" rx="2" fill="#C48A4A"/><rect x="28" y="34" width="8" height="6" rx="1" fill="#F0D2A8"/>',
  ),
  home: svg(
    '<path d="M8 30 L32 12 L56 30 V54 H8Z" fill="#E08A2A"/><rect x="26" y="36" width="12" height="18" fill="#F6D7A8"/><rect x="16" y="34" width="10" height="10" fill="#7EC8E3"/><rect x="38" y="34" width="10" height="10" fill="#7EC8E3"/>',
  ),
  car: svg(
    '<rect x="8" y="30" width="48" height="16" rx="6" fill="#3A6EA5"/><path d="M16 30 L22 20 H42 L48 30Z" fill="#5B8EC4"/><circle cx="20" cy="48" r="6" fill="#2A2A2A"/><circle cx="44" cy="48" r="6" fill="#2A2A2A"/><circle cx="20" cy="48" r="2.5" fill="#D0D0D0"/><circle cx="44" cy="48" r="2.5" fill="#D0D0D0"/>',
  ),
  study: svg(
    '<path d="M8 28 L32 16 L56 28 L32 40Z" fill="#3A6EA5"/><path d="M16 31 V44 c8 6 24 6 32 0 V31" fill="#5B8EC4"/><rect x="54" y="28" width="3" height="16" fill="#C4922A"/>',
  ),
  family: svg(
    '<circle cx="22" cy="20" r="8" fill="#F0C27A"/><circle cx="42" cy="20" r="8" fill="#E8B86A"/><circle cx="32" cy="28" r="7" fill="#F6D7A0"/><path d="M8 54c0-10 8-16 14-16s14 6 14 16" fill="#E08A2A"/><path d="M28 54c0-10 8-16 14-16s14 6 14 16" fill="#C4922A"/>',
  ),
  lock: svg(
    '<rect x="16" y="28" width="32" height="26" rx="5" fill="#C4922A"/><path d="M22 28 V22 a10 10 0 0 1 20 0 V28" fill="none" stroke="#8A6418" stroke-width="5"/><circle cx="32" cy="40" r="4" fill="#F6E7C2"/>',
  ),
  crown: svg(
    '<path d="M10 40 L16 18 L28 32 L32 14 L36 32 L48 18 L54 40Z" fill="#E8B84A"/><rect x="10" y="40" width="44" height="10" rx="3" fill="#C4922A"/><circle cx="16" cy="18" r="4" fill="#F6E7C2"/><circle cx="32" cy="14" r="5" fill="#FFF3C4"/><circle cx="48" cy="18" r="4" fill="#F6E7C2"/>',
    "0 0 64 64",
    "art-crown",
  ),
  globe: svg(
    '<circle cx="32" cy="32" r="22" fill="#3A6EA5"/><ellipse cx="32" cy="32" rx="10" ry="22" fill="none" stroke="#7EC8E3" stroke-width="3"/><path d="M12 32h40M16 22h32M16 42h32" stroke="#7EC8E3" stroke-width="2.5"/>',
  ),
  spark: svg(
    '<path d="M32 6 L36 26 L56 32 L36 38 L32 58 L28 38 L8 32 L28 26Z" fill="#E8B84A"/>',
  ),
  tools: svg(
    '<rect x="28" y="8" width="8" height="36" rx="2" fill="#8B5A2B" transform="rotate(35 32 32)"/><rect x="28" y="8" width="8" height="36" rx="2" fill="#C48A4A" transform="rotate(-35 32 32)"/><circle cx="32" cy="44" r="10" fill="#6A6A6A"/>',
  ),
};

export function icon(name, cls = "") {
  const raw = ICONS[name] ?? ICONS.spark;
  return cls ? raw.replace('class="art', 'class="art ' + cls) : raw;
}

const HOUSES = [
  svg(
    '<rect x="14" y="22" width="36" height="28" rx="3" fill="#C4A574"/><path d="M14 22h36l-6-8H20z" fill="#A88858"/><path d="M20 28h8v6h-8zM36 28h8v6h-8zM28 40h8v10h-8z" fill="#8A6A3A"/>',
  ),
  svg(
    '<rect x="16" y="20" width="32" height="34" fill="#E8C9A0"/><rect x="16" y="16" width="32" height="6" fill="#C4922A"/><rect x="26" y="36" width="12" height="18" fill="#8B5A2B"/><rect x="20" y="26" width="10" height="8" fill="#7EC8E3"/>',
  ),
  svg(
    '<rect x="12" y="14" width="40" height="40" fill="#D9B48A"/><rect x="12" y="10" width="40" height="6" fill="#8A6418"/><rect x="18" y="20" width="8" height="8" fill="#7EC8E3"/><rect x="38" y="20" width="8" height="8" fill="#7EC8E3"/><rect x="18" y="34" width="8" height="8" fill="#7EC8E3"/><rect x="38" y="34" width="8" height="8" fill="#7EC8E3"/><rect x="28" y="40" width="8" height="14" fill="#5A3A20"/>',
  ),
  svg(
    '<path d="M8 30 L32 12 L56 30 V54 H8Z" fill="#E08A2A"/><rect x="26" y="36" width="12" height="18" fill="#F6D7A8"/><rect x="14" y="34" width="10" height="10" fill="#7EC8E3"/><rect x="40" y="34" width="10" height="10" fill="#7EC8E3"/><rect x="4" y="48" width="8" height="8" fill="#3D9A55"/><rect x="52" y="46" width="8" height="10" fill="#3D9A55"/>',
  ),
  svg(
    '<path d="M6 32 L32 8 L58 32 V56 H6Z" fill="#C4922A"/><rect x="24" y="36" width="16" height="20" fill="#F6E7C2"/><rect x="12" y="34" width="10" height="10" fill="#7EC8E3"/><rect x="42" y="34" width="10" height="10" fill="#7EC8E3"/><circle cx="32" cy="18" r="3" fill="#FFF3C4"/>',
  ),
  svg(
    '<rect x="8" y="28" width="48" height="26" fill="#E8B84A"/><path d="M4 28 L32 8 L60 28Z" fill="#C4922A"/><rect x="18" y="14" width="8" height="12" fill="#C4922A"/><rect x="28" y="36" width="8" height="18" fill="#5A3A20"/><rect x="12" y="34" width="10" height="8" fill="#7EC8E3"/><rect x="42" y="34" width="10" height="8" fill="#7EC8E3"/><rect x="2" y="48" width="10" height="8" fill="#2A7A3E"/>',
  ),
];

const CARS = [
  svg(
    '<circle cx="32" cy="32" r="20" fill="none" stroke="#C43B32" stroke-width="5"/><path d="M20 20 L44 44" stroke="#C43B32" stroke-width="5"/>',
  ),
  svg(
    '<rect x="14" y="30" width="36" height="14" rx="5" fill="#8A8A8A"/><path d="M20 30 L24 22 H40 L44 30Z" fill="#A8A8A8"/><circle cx="22" cy="46" r="5" fill="#2A2A2A"/><circle cx="42" cy="46" r="5" fill="#2A2A2A"/>',
  ),
  svg(
    '<rect x="8" y="30" width="48" height="16" rx="6" fill="#6B7C8A"/><path d="M16 30 L22 20 H42 L48 30Z" fill="#8A9AAA"/><circle cx="20" cy="48" r="6" fill="#2A2A2A"/><circle cx="44" cy="48" r="6" fill="#2A2A2A"/>',
  ),
  svg(
    '<rect x="6" y="30" width="52" height="16" rx="6" fill="#3A6EA5"/><path d="M16 30 L24 18 H42 L50 30Z" fill="#5B8EC4"/><circle cx="20" cy="48" r="6" fill="#222"/><circle cx="46" cy="48" r="6" fill="#222"/>',
  ),
  svg(
    '<rect x="6" y="32" width="52" height="14" rx="7" fill="#C43B32"/><path d="M14 32 L26 18 H44 L54 32Z" fill="#E2556A"/><circle cx="20" cy="48" r="6" fill="#111"/><circle cx="46" cy="48" r="6" fill="#111"/>',
  ),
  svg(
    '<rect x="4" y="32" width="56" height="13" rx="7" fill="#E8B84A"/><path d="M12 32 L26 16 H46 L58 32Z" fill="#F6D56A"/><circle cx="20" cy="48" r="6" fill="#111"/><circle cx="48" cy="48" r="6" fill="#111"/>',
  ),
];

export function houseArt(tier, cls = "art-lg") {
  return (HOUSES[tier] ?? HOUSES[0]).replace('class="art"', 'class="art ' + cls + '"');
}

export function carArt(tier, cls = "art-lg") {
  return (CARS[tier] ?? CARS[0]).replace('class="art"', 'class="art ' + cls + '"');
}

export function seedArt(id) {
  if (id === "apellido") return icon("family", "art-seed");
  if (id === "beca") return icon("study", "art-seed");
  return icon("tools", "art-seed");
}

export function character(mood = "idle") {
  const mouth =
    mood === "happy"
      ? '<path d="M26 40 Q32 46 38 40" fill="none" stroke="#5A3A20" stroke-width="2.4" stroke-linecap="round"/>'
      : mood === "rich"
        ? '<path d="M26 39 Q32 47 38 39" fill="none" stroke="#5A3A20" stroke-width="2.6" stroke-linecap="round"/><circle cx="44" cy="22" r="5" fill="#E8B84A"/>'
        : mood === "tired"
          ? '<path d="M26 42 Q32 38 38 42" fill="none" stroke="#5A3A20" stroke-width="2.2" stroke-linecap="round"/>'
          : mood === "worry"
            ? '<path d="M27 42 L37 42" stroke="#5A3A20" stroke-width="2.2" stroke-linecap="round"/>'
            : '<path d="M27 41 Q32 44 37 41" fill="none" stroke="#5A3A20" stroke-width="2" stroke-linecap="round"/>';
  const brow =
    mood === "worry"
      ? '<path d="M22 26 L28 28M36 28 L42 26" stroke="#5A3A20" stroke-width="2" stroke-linecap="round"/>'
      : mood === "tired"
        ? '<path d="M22 28 L28 28M36 28 L42 28" stroke="#5A3A20" stroke-width="2" stroke-linecap="round"/>'
        : "";
  const shirt = mood === "rich" ? "#C4922A" : mood === "tired" ? "#6A6A6A" : "#3A6EA5";
  return svg(
    '<ellipse cx="32" cy="58" rx="20" ry="8" fill="#D9C4A0" opacity=".35"/>' +
      '<path d="M16 58c0-14 8-20 16-20s16 6 16 20" fill="' +
      shirt +
      '"/>' +
      '<circle cx="32" cy="28" r="14" fill="#F0C27A"/>' +
      '<circle cx="27" cy="27" r="2" fill="#3A2A18"/><circle cx="37" cy="27" r="2" fill="#3A2A18"/>' +
      brow +
      mouth +
      (mood === "happy" || mood === "rich"
        ? '<circle cx="22" cy="34" r="2.2" fill="#E2556A" opacity=".45"/><circle cx="42" cy="34" r="2.2" fill="#E2556A" opacity=".45"/>'
        : ""),
    "0 0 64 64",
    "art-char",
  );
}

export function cityBg() {
  return svg(
    '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6B56A"/><stop offset=".45" stop-color="#E07A3A"/><stop offset="1" stop-color="#3A2030"/></linearGradient></defs>' +
      '<rect width="200" height="160" fill="url(#sky)"/>' +
      '<circle cx="150" cy="38" r="18" fill="#FFE08A"/>' +
      '<rect x="8" y="88" width="22" height="72" fill="#2A2230"/>' +
      '<rect x="34" y="70" width="28" height="90" fill="#241C28"/>' +
      '<rect x="66" y="96" width="18" height="64" fill="#2E2434"/>' +
      '<rect x="88" y="60" width="36" height="100" fill="#1E1824"/>' +
      '<rect x="128" y="84" width="24" height="76" fill="#2A2230"/>' +
      '<rect x="156" y="74" width="32" height="86" fill="#241C28"/>' +
      '<rect x="40" y="78" width="4" height="4" fill="#F6D56A"/><rect x="98" y="70" width="4" height="4" fill="#F6D56A"/><rect x="166" y="82" width="4" height="4" fill="#F6D56A"/>',
    "0 0 200 160",
    "art-city",
  );
}

export function radar(axes) {
  const order = ["dinero", "felicidad", "salud", "vinculos", "estatus"];
  const cx = 80;
  const cy = 80;
  const r = 56;
  const pts = (scale) =>
    order
      .map((k, i) => {
        const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const v = r * scale;
        return [cx + Math.cos(a) * v, cy + Math.sin(a) * v].join(",");
      })
      .join(" ");
  const data = order
    .map((k, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      const v = r * Math.max(0.08, Math.min(1, (axes[k] ?? 0) / 100));
      return [cx + Math.cos(a) * v, cy + Math.sin(a) * v].join(",");
    })
    .join(" ");
  const labels = ["💰", "❤️", "🫀", "👨‍👩‍👧", "😎"];
  const labelPts = order.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    return { x: cx + Math.cos(a) * 70, y: cy + Math.sin(a) * 70, t: labels[i] };
  });
  return (
    '<svg class="art art-radar" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<polygon points="' +
    pts(1) +
    '" fill="#2A2430" stroke="#4A4050" stroke-width="2"/>' +
    '<polygon points="' +
    pts(0.66) +
    '" fill="none" stroke="#3A3240" stroke-width="1"/>' +
    '<polygon points="' +
    pts(0.33) +
    '" fill="none" stroke="#3A3240" stroke-width="1"/>' +
    '<polygon points="' +
    data +
    '" fill="rgba(232,184,74,.45)" stroke="#E8B84A" stroke-width="2"/>' +
    labelPts
      .map((p) => '<text x="' + p.x + '" y="' + (p.y + 4) + '" text-anchor="middle" font-size="12">' + p.t + "</text>")
      .join("") +
    "</svg>"
  );
}

export function moodFromTone(tone) {
  if (tone === "gain") return "happy";
  if (tone === "loss") return "tired";
  return "worry";
}
