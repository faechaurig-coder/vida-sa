/** Kit visual vectorial con degradados y profundidad. */

const DEFS =
  '<defs>' +
  '<linearGradient id="g-green" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EE08A"/><stop offset="1" stop-color="#249A52"/></linearGradient>' +
  '<linearGradient id="g-green-dark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4AC878"/><stop offset="1" stop-color="#1E7A42"/></linearGradient>' +
  '<linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE08A"/><stop offset=".5" stop-color="#E8B84A"/><stop offset="1" stop-color="#C4922A"/></linearGradient>' +
  '<linearGradient id="g-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8090"/><stop offset="1" stop-color="#D04050"/></linearGradient>' +
  '<linearGradient id="g-blue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6AAEE8"/><stop offset="1" stop-color="#3A6EA5"/></linearGradient>' +
  '<linearGradient id="g-teal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5AC8B8"/><stop offset="1" stop-color="#2A7A6A"/></linearGradient>' +
  '<linearGradient id="g-skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE0B0"/><stop offset="1" stop-color="#E8B070"/></linearGradient>' +
  '<linearGradient id="g-orange" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0A050"/><stop offset="1" stop-color="#C06028"/></linearGradient>' +
  '<radialGradient id="g-sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF8C0"/><stop offset=".6" stop-color="#FFE08A"/><stop offset="1" stop-color="#F0A040"/></radialGradient>' +
  '<filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1A1010" flood-opacity="0.25"/></filter>' +
  '<filter id="deep-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#1A1010" flood-opacity="0.35"/></filter>' +
  "</defs>";

const svg = (inner, vb = "0 0 64 64", cls = "") =>
  '<svg class="art' +
  (cls ? " " + cls : "") +
  '" viewBox="' +
  vb +
  '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  DEFS +
  inner +
  "</svg>";

export const ICONS = {
  money: svg(
    '<rect x="8" y="16" width="48" height="32" rx="6" fill="url(#g-green-dark)" filter="url(#soft-shadow)"/>' +
      '<rect x="12" y="20" width="40" height="24" rx="4" fill="url(#g-green)"/>' +
      '<circle cx="32" cy="32" r="8" fill="#E8F8EC"/>' +
      '<text x="32" y="36" text-anchor="middle" font-size="11" font-weight="700" fill="#1E7A42">$</text>',
  ),
  hap: svg(
    '<path d="M32 54C32 54 10 38 10 24a12 12 0 0 1 22-6 12 12 0 0 1 22 6c0 14-22 30-22 30z" fill="url(#g-red)" filter="url(#soft-shadow)"/>' +
      '<path d="M32 54C32 54 14 40 14 26a10 10 0 0 1 18-5 10 10 0 0 1 18 5c0 12-18 28-18 28z" fill="url(#g-red)" opacity=".5"/>',
  ),
  hp: svg(
    '<circle cx="32" cy="32" r="22" fill="url(#g-teal)" filter="url(#soft-shadow)"/>' +
      '<path d="M18 32h10l4-10 6 20 4-10h10" fill="none" stroke="#E8F8F4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
  ),
  job: svg(
    '<rect x="12" y="24" width="40" height="28" rx="4" fill="url(#g-orange)" filter="url(#soft-shadow)"/>' +
      '<rect x="22" y="16" width="20" height="10" rx="2" fill="#D49858"/>' +
      '<rect x="28" y="34" width="8" height="6" rx="1" fill="#F6E0C0"/>',
  ),
  home: svg(
    '<path d="M8 30 L32 12 L56 30 V54 H8Z" fill="url(#g-orange)" filter="url(#soft-shadow)"/>' +
      '<path d="M8 30 L32 14 L56 30" fill="none" stroke="#F6D080" stroke-width="2" opacity=".6"/>' +
      '<rect x="26" y="36" width="12" height="18" fill="#8B5A2B"/>' +
      '<rect x="16" y="34" width="10" height="10" rx="1" fill="#9AD8F0" opacity=".9"/>' +
      '<rect x="38" y="34" width="10" height="10" rx="1" fill="#9AD8F0" opacity=".9"/>',
  ),
  car: svg(
    '<rect x="8" y="30" width="48" height="16" rx="6" fill="url(#g-blue)" filter="url(#soft-shadow)"/>' +
      '<path d="M16 30 L22 20 H42 L48 30Z" fill="#7AAEE8"/>' +
      '<circle cx="20" cy="48" r="6" fill="#1A1A1A"/><circle cx="44" cy="48" r="6" fill="#1A1A1A"/>' +
      '<circle cx="20" cy="48" r="2.5" fill="#C8C8C8"/><circle cx="44" cy="48" r="2.5" fill="#C8C8C8"/>',
  ),
  study: svg(
    '<path d="M8 28 L32 16 L56 28 L32 40Z" fill="url(#g-blue)" filter="url(#soft-shadow)"/>' +
      '<path d="M16 31 V44 c8 6 24 6 32 0 V31" fill="#5B8EC4"/>' +
      '<rect x="54" y="28" width="3" height="16" fill="url(#g-gold)"/>',
  ),
  family: svg(
    '<circle cx="22" cy="20" r="8" fill="url(#g-skin)"/>' +
      '<circle cx="42" cy="20" r="8" fill="url(#g-skin)"/>' +
      '<circle cx="32" cy="28" r="7" fill="url(#g-skin)"/>' +
      '<path d="M8 54c0-10 8-16 14-16s14 6 14 16" fill="url(#g-orange)"/>' +
      '<path d="M28 54c0-10 8-16 14-16s14 6 14 16" fill="#C4922A"/>',
  ),
  lock: svg(
    '<rect x="16" y="28" width="32" height="26" rx="5" fill="url(#g-gold)" filter="url(#soft-shadow)"/>' +
      '<path d="M22 28 V22 a10 10 0 0 1 20 0 V28" fill="none" stroke="#8A6418" stroke-width="5"/>' +
      '<circle cx="32" cy="40" r="4" fill="#FFF8E8"/>',
  ),
  crown: svg(
    '<path d="M10 40 L16 18 L28 32 L32 14 L36 32 L48 18 L54 40Z" fill="url(#g-gold)" filter="url(#soft-shadow)"/>' +
      '<rect x="10" y="40" width="44" height="10" rx="3" fill="#C4922A"/>' +
      '<circle cx="16" cy="18" r="4" fill="#FFF8E8"/>' +
      '<circle cx="32" cy="14" r="5" fill="#FFFDE0"/>' +
      '<circle cx="48" cy="18" r="4" fill="#FFF8E8"/>',
    "0 0 64 64",
    "art-crown",
  ),
  globe: svg(
    '<circle cx="32" cy="32" r="22" fill="url(#g-blue)" filter="url(#soft-shadow)"/>' +
      '<ellipse cx="32" cy="32" rx="10" ry="22" fill="none" stroke="#A8D8F8" stroke-width="3"/>' +
      '<path d="M12 32h40M16 22h32M16 42h32" stroke="#A8D8F8" stroke-width="2.5"/>',
  ),
  spark: svg(
    '<path d="M32 6 L36 26 L56 32 L36 38 L32 58 L28 38 L8 32 L28 26Z" fill="url(#g-gold)" filter="url(#soft-shadow)"/>',
  ),
  tools: svg(
    '<rect x="28" y="8" width="8" height="36" rx="2" fill="#8B5A2B" transform="rotate(35 32 32)"/>' +
      '<rect x="28" y="8" width="8" height="36" rx="2" fill="#D49858" transform="rotate(-35 32 32)"/>' +
      '<circle cx="32" cy="44" r="10" fill="#7A7A7A" filter="url(#soft-shadow)"/>',
  ),
};

export function icon(name, cls = "") {
  const raw = ICONS[name] ?? ICONS.spark;
  return cls ? raw.replace('class="art', 'class="art ' + cls) : raw;
}

const HOUSES = [
  svg(
    '<rect x="14" y="22" width="36" height="28" rx="3" fill="#C4A574" filter="url(#soft-shadow)"/>' +
      '<path d="M14 22h36l-6-8H20z" fill="#A88858"/>' +
      '<path d="M20 28h8v6h-8zM36 28h8v6h-8zM28 40h8v10h-8z" fill="#8A6A3A"/>',
  ),
  svg(
    '<rect x="16" y="20" width="32" height="34" fill="#F0D8B8" filter="url(#soft-shadow)"/>' +
      '<rect x="16" y="16" width="32" height="6" fill="url(#g-gold)"/>' +
      '<rect x="26" y="36" width="12" height="18" fill="#8B5A2B"/>' +
      '<rect x="20" y="26" width="10" height="8" rx="1" fill="#9AD8F0"/>',
  ),
  svg(
    '<rect x="12" y="14" width="40" height="40" fill="#E8C8A0" filter="url(#soft-shadow)"/>' +
      '<rect x="12" y="10" width="40" height="6" fill="#8A6418"/>' +
      '<rect x="18" y="20" width="8" height="8" rx="1" fill="#9AD8F0"/><rect x="38" y="20" width="8" height="8" rx="1" fill="#9AD8F0"/>' +
      '<rect x="18" y="34" width="8" height="8" rx="1" fill="#9AD8F0"/><rect x="38" y="34" width="8" height="8" rx="1" fill="#9AD8F0"/>' +
      '<rect x="28" y="40" width="8" height="14" fill="#5A3A20"/>',
  ),
  svg(
    '<path d="M8 30 L32 12 L56 30 V54 H8Z" fill="url(#g-orange)" filter="url(#soft-shadow)"/>' +
      '<rect x="26" y="36" width="12" height="18" fill="#F6D7A8"/>' +
      '<rect x="14" y="34" width="10" height="10" rx="1" fill="#9AD8F0"/><rect x="40" y="34" width="10" height="10" rx="1" fill="#9AD8F0"/>' +
      '<rect x="4" y="48" width="8" height="8" fill="url(#g-green)"/><rect x="52" y="46" width="8" height="10" fill="url(#g-green)"/>',
  ),
  svg(
    '<path d="M6 32 L32 8 L58 32 V56 H6Z" fill="url(#g-gold)" filter="url(#soft-shadow)"/>' +
      '<rect x="24" y="36" width="16" height="20" fill="#F6E7C2"/>' +
      '<rect x="12" y="34" width="10" height="10" rx="1" fill="#9AD8F0"/><rect x="42" y="34" width="10" height="10" rx="1" fill="#9AD8F0"/>' +
      '<circle cx="32" cy="18" r="3" fill="#FFFDE0"/>',
  ),
  svg(
    '<rect x="8" y="28" width="48" height="26" fill="url(#g-gold)" filter="url(#soft-shadow)"/>' +
      '<path d="M4 28 L32 8 L60 28Z" fill="#D4A030"/>' +
      '<rect x="18" y="14" width="8" height="12" fill="#C4922A"/>' +
      '<rect x="28" y="36" width="8" height="18" fill="#5A3A20"/>' +
      '<rect x="12" y="34" width="10" height="8" rx="1" fill="#9AD8F0"/><rect x="42" y="34" width="10" height="8" rx="1" fill="#9AD8F0"/>' +
      '<rect x="2" y="48" width="10" height="8" fill="url(#g-green)"/>',
  ),
];

const CARS = [
  svg(
    '<circle cx="32" cy="32" r="20" fill="none" stroke="#E05050" stroke-width="5" filter="url(#soft-shadow)"/>' +
      '<path d="M20 20 L44 44" stroke="#E05050" stroke-width="5"/>',
  ),
  svg(
    '<rect x="14" y="30" width="36" height="14" rx="5" fill="#9A9A9A" filter="url(#soft-shadow)"/>' +
      '<path d="M20 30 L24 22 H40 L44 30Z" fill="#B8B8B8"/>' +
      '<circle cx="22" cy="46" r="5" fill="#1A1A1A"/><circle cx="42" cy="46" r="5" fill="#1A1A1A"/>',
  ),
  svg(
    '<rect x="8" y="30" width="48" height="16" rx="6" fill="#7A8A9A" filter="url(#soft-shadow)"/>' +
      '<path d="M16 30 L22 20 H42 L48 30Z" fill="#9AAABA"/>' +
      '<circle cx="20" cy="48" r="6" fill="#1A1A1A"/><circle cx="44" cy="48" r="6" fill="#1A1A1A"/>',
  ),
  svg(
    '<rect x="6" y="30" width="52" height="16" rx="6" fill="url(#g-blue)" filter="url(#soft-shadow)"/>' +
      '<path d="M16 30 L24 18 H42 L50 30Z" fill="#7AAEE8"/>' +
      '<circle cx="20" cy="48" r="6" fill="#111"/><circle cx="46" cy="48" r="6" fill="#111"/>',
  ),
  svg(
    '<rect x="6" y="32" width="52" height="14" rx="7" fill="url(#g-red)" filter="url(#soft-shadow)"/>' +
      '<path d="M14 32 L26 18 H44 L54 32Z" fill="#F07080"/>' +
      '<circle cx="20" cy="48" r="6" fill="#111"/><circle cx="46" cy="48" r="6" fill="#111"/>',
  ),
  svg(
    '<rect x="4" y="32" width="56" height="13" rx="7" fill="url(#g-gold)" filter="url(#soft-shadow)"/>' +
      '<path d="M12 32 L26 16 H46 L58 32Z" fill="#FFE080"/>' +
      '<circle cx="20" cy="48" r="6" fill="#111"/><circle cx="48" cy="48" r="6" fill="#111"/>',
  ),
];

export function houseArt(tier, cls = "art-lg") {
  return (HOUSES[tier] ?? HOUSES[0]).replace('class="art', 'class="art ' + cls + '"');
}

export function carArt(tier, cls = "art-lg") {
  return (CARS[tier] ?? CARS[0]).replace('class="art', 'class="art ' + cls + '"');
}

export function seedArt(id) {
  if (id === "apellido") return icon("family", "art-seed");
  if (id === "beca") return icon("study", "art-seed");
  return icon("tools", "art-seed");
}

export function logoMark(cls = "art-logo") {
  return svg(
    '<rect x="6" y="6" width="52" height="52" rx="16" fill="url(#g-gold)" filter="url(#deep-shadow)"/>' +
      '<rect x="8" y="8" width="48" height="48" rx="14" fill="url(#g-gold)" opacity=".35"/>' +
      '<path d="M32 16 C24 28 18 34 18 40 a6 6 0 0 0 12 0 C30 36 32 34 32 34 C32 34 34 36 38 40 a6 6 0 0 0 12 0 C46 34 40 28 32 16Z" fill="#FFF8E8" filter="url(#soft-shadow)"/>' +
      '<path d="M22 44 L32 36 L42 44" fill="none" stroke="#C4922A" stroke-width="2.5" stroke-linecap="round" opacity=".55"/>' +
      '<circle cx="32" cy="30" r="3" fill="#FFFDE0"/>',
    "0 0 64 64",
    cls,
  );
}

export function character(mood = "idle") {
  const mouth =
    mood === "happy"
      ? '<path d="M25 41 Q32 48 39 41" fill="none" stroke="#4A3020" stroke-width="2.6" stroke-linecap="round"/>'
      : mood === "rich"
        ? '<path d="M25 40 Q32 49 39 40" fill="none" stroke="#4A3020" stroke-width="2.8" stroke-linecap="round"/><circle cx="46" cy="20" r="5.5" fill="url(#g-gold)" filter="url(#soft-shadow)"/>'
        : mood === "tired"
          ? '<path d="M26 43 Q32 39 38 43" fill="none" stroke="#4A3020" stroke-width="2.4" stroke-linecap="round"/>'
          : mood === "worry"
            ? '<path d="M27 43 L37 43" stroke="#4A3020" stroke-width="2.4" stroke-linecap="round"/>'
            : '<path d="M27 42 Q32 45 37 42" fill="none" stroke="#4A3020" stroke-width="2.2" stroke-linecap="round"/>';
  const brow =
    mood === "worry"
      ? '<path d="M21 27 L28 29M36 29 L43 27" stroke="#4A3020" stroke-width="2.2" stroke-linecap="round"/>'
      : mood === "tired"
        ? '<path d="M21 29 L28 29M36 29 L43 29" stroke="#4A3020" stroke-width="2.2" stroke-linecap="round"/>'
        : '<path d="M21 28 Q27 25 29 28M35 28 Q37 25 43 28" stroke="#4A3020" stroke-width="1.8" stroke-linecap="round" fill="none" opacity=".7"/>';
  const shirtGrad =
    mood === "rich" ? "g-gold" : mood === "tired" ? "g-orange" : "g-blue";
  const hair =
    mood === "rich"
      ? '<path d="M18 28 C18 14 26 10 32 10 C38 10 46 14 46 28 C44 20 38 16 32 16 C26 16 20 20 18 28Z" fill="#3A2820"/>'
      : '<path d="M17 30 C17 15 24 11 32 11 C40 11 47 15 47 30 C45 22 39 17 32 17 C25 17 19 22 17 30Z" fill="#4A3428"/>';
  const cheeks =
    mood === "happy" || mood === "rich"
      ? '<ellipse cx="22" cy="35" rx="3" ry="2" fill="#E2556A" opacity=".35"/><ellipse cx="42" cy="35" rx="3" ry="2" fill="#E2556A" opacity=".35"/>'
      : mood === "worry"
        ? '<ellipse cx="22" cy="36" rx="2.5" ry="1.8" fill="#C4922A" opacity=".2"/>'
        : "";
  const sparkle =
    mood === "happy" || mood === "rich"
      ? '<path d="M50 14 L51 17 L54 18 L51 19 L50 22 L49 19 L46 18 L49 17Z" fill="#FFE08A" opacity=".9"/>'
      : "";
  return svg(
    '<ellipse cx="32" cy="58" rx="22" ry="7" fill="#1A1010" opacity=".22"/>' +
      '<path d="M14 36 C10 44 10 54 14 58 L50 58 C54 54 54 44 50 36 Z" fill="url(#' +
      shirtGrad +
      ')" filter="url(#soft-shadow)"/>' +
      '<path d="M22 38 L22 52 M42 38 L42 52" stroke="rgba(0,0,0,.12)" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="32" cy="30" r="15" fill="url(#g-skin)" filter="url(#soft-shadow)"/>' +
      hair +
      '<circle cx="26" cy="30" r="2.4" fill="#2A1A10"/><circle cx="38" cy="30" r="2.4" fill="#2A1A10"/>' +
      '<circle cx="27" cy="29" r=".9" fill="#FFF8F0" opacity=".8"/><circle cx="39" cy="29" r=".9" fill="#FFF8F0" opacity=".8"/>' +
      brow +
      mouth +
      cheeks +
      sparkle,
    "0 0 64 64",
    "art-char",
  );
}

export function cityBg() {
  const win = (x, y) =>
    '<rect x="' + x + '" y="' + y + '" width="4" height="4" rx="1" fill="#FFE8A0" opacity=".9"/>';
  return svg(
    '<defs>' +
      '<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#FFD898"/><stop offset=".25" stop-color="#F8B060"/>' +
      '<stop offset=".5" stop-color="#E87848"/><stop offset=".75" stop-color="#8A3858"/><stop offset="1" stop-color="#1E1420"/>' +
      "</linearGradient>" +
      '<linearGradient id="bldg-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3A3040"/><stop offset="1" stop-color="#1E1824"/></linearGradient>' +
      '<linearGradient id="bldg-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#342C38"/><stop offset="1" stop-color="#18141C"/></linearGradient>' +
      '<radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF8D0"/><stop offset=".5" stop-color="#FFE08A"/><stop offset="1" stop-color="#F0A040" stop-opacity="0"/></radialGradient>' +
      "</defs>" +
      '<rect width="200" height="160" fill="url(#sky)"/>' +
      '<ellipse cx="155" cy="42" rx="28" ry="24" fill="url(#sun)"/>' +
      '<circle cx="155" cy="38" r="16" fill="#FFE8A0" opacity=".95"/>' +
      '<rect x="8" y="88" width="22" height="72" fill="url(#bldg-a)"/>' +
      '<rect x="34" y="70" width="28" height="90" fill="url(#bldg-b)"/>' +
      '<rect x="66" y="96" width="18" height="64" fill="url(#bldg-a)"/>' +
      '<rect x="88" y="60" width="36" height="100" fill="url(#bldg-b)"/>' +
      '<rect x="128" y="84" width="24" height="76" fill="url(#bldg-a)"/>' +
      '<rect x="156" y="74" width="32" height="86" fill="url(#bldg-b)"/>' +
      win(40, 78) + win(98, 70) + win(166, 82) + win(14, 100) + win(100, 78) +
      '<rect x="0" y="148" width="200" height="12" fill="#141018" opacity=".6"/>',
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
    '<defs>' +
    '<linearGradient id="radar-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3448"/><stop offset="1" stop-color="#1E1824"/></linearGradient>' +
    '<linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E8B84A" stop-opacity=".6"/><stop offset="1" stop-color="#C4922A" stop-opacity=".35"/></linearGradient>' +
    "</defs>" +
    '<polygon points="' +
    pts(1) +
    '" fill="url(#radar-bg)" stroke="#5A5068" stroke-width="2"/>' +
    '<polygon points="' +
    pts(0.66) +
    '" fill="none" stroke="#4A4058" stroke-width="1"/>' +
    '<polygon points="' +
    pts(0.33) +
    '" fill="none" stroke="#4A4058" stroke-width="1"/>' +
    '<polygon points="' +
    data +
    '" fill="url(#radar-fill)" stroke="#E8B84A" stroke-width="2.5"/>' +
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
