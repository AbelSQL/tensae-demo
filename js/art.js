/* ============================================================
   Hand-drawn SVG product illustrations (no image files needed)
   drawProduct(product) -> SVG string, viewBox 0 0 200 200
   ============================================================ */

let __artId = 0;

function shade(hex, amt) {
  // amt -1..1 : negative = darker, positive = lighter
  const n = parseInt(hex.replace("#", ""), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// Tensae cup label: a small rectangular tag with a woven (tilet) zigzag stripe.
function leafMark(cx, cy, r, fill = "#0f2a4a") {
  const w = r * 2.3, h = r * 1.25, x = cx - w / 2, y = cy - h / 2, step = w / 8;
  let zig = `M${x + step * 0.5} ${cy + r * 0.12}`;
  for (let i = 1; i <= 7; i++) zig += ` L${x + step * (i + 0.5)} ${cy + (i % 2 ? -r * 0.18 : r * 0.12)}`;
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r * 0.22}" fill="${fill}"/>
    <rect x="${x + r * 0.25}" y="${y + r * 0.22}" width="${w - r * 0.5}" height="${r * 0.08}" fill="#fff" opacity=".85"/>
    <rect x="${x + r * 0.25}" y="${y + h - r * 0.3}" width="${w - r * 0.5}" height="${r * 0.08}" fill="#fff" opacity=".85"/>
    <path d="${zig}" fill="none" stroke="#f2c84b" stroke-width="${r * 0.13}" stroke-linejoin="round" stroke-linecap="round"/>`;
}

const ART = {
  hot(a) {
    const id = ++__artId;
    return `
    <defs>
      <linearGradient id="cup${id}" x1="0" x2="1">
        <stop offset="0" stop-color="#e9e6df"/><stop offset=".35" stop-color="#ffffff"/><stop offset="1" stop-color="#dcd8cf"/>
      </linearGradient>
      <linearGradient id="slv${id}" x1="0" x2="1">
        <stop offset="0" stop-color="${shade(a.sleeve, -0.12)}"/><stop offset=".4" stop-color="${a.sleeve}"/><stop offset="1" stop-color="${shade(a.sleeve, -0.2)}"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="186" rx="44" ry="6" fill="#000" opacity=".12"/>
    <path d="M58 52 L142 52 L130 182 Q100 188 70 182 Z" fill="url(#cup${id})"/>
    <path d="M62 92 L138 92 L133 140 L67 140 Z" fill="url(#slv${id})"/>
    ${leafMark(100, 116, 15)}
    <rect x="52" y="40" width="96" height="14" rx="5" fill="#f4f2ee"/>
    <path d="M56 40 Q58 26 74 24 L126 24 Q142 26 144 40 Z" fill="#fbfaf7"/>
    <rect x="52" y="48" width="96" height="6" rx="3" fill="#e2ded6"/>
    <ellipse cx="116" cy="30" rx="9" ry="3" fill="#e2ded6"/>`;
  },

  iced(a) {
    const id = ++__artId;
    const top = a.top || a.color;
    const fruit = a.fruit
      ? [[84, 160], [110, 168], [98, 150], [118, 140], [78, 132], [106, 120]].map(([x, y]) =>
          `<rect x="${x}" y="${y}" width="9" height="9" rx="2" fill="${a.fruit}" transform="rotate(${x % 40} ${x} ${y})" opacity=".9"/>`).join("")
      : "";
    const drizzle = a.accent
      ? `<path d="M68 70 Q80 78 92 68 T116 70 T134 68" stroke="${a.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>
         <path d="M70 66 Q86 60 100 66 T132 64" stroke="${a.accent}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>`
      : "";
    return `
    <defs>
      <linearGradient id="drk${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/><stop offset=".28" stop-color="${top}"/>
        <stop offset=".42" stop-color="${a.color}"/><stop offset="1" stop-color="${shade(a.color, -0.18)}"/>
      </linearGradient>
      <linearGradient id="gls${id}" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".2" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="188" rx="40" ry="5" fill="#000" opacity=".12"/>
    <rect x="108" y="4" width="8" height="70" rx="3" fill="#1f5fae" transform="rotate(10 112 40)"/>
    <path d="M60 58 L140 58 L130 184 Q100 190 70 184 Z" fill="url(#drk${id})"/>
    ${fruit}
    <g opacity=".55">
      <rect x="74" y="72" width="20" height="18" rx="4" fill="#fff" transform="rotate(-12 84 81)"/>
      <rect x="104" y="80" width="20" height="18" rx="4" fill="#fff" transform="rotate(14 114 89)"/>
      <rect x="86" y="96" width="18" height="16" rx="4" fill="#fff" transform="rotate(6 95 104)"/>
    </g>
    ${drizzle}
    <path d="M60 58 L140 58 L130 184 Q100 190 70 184 Z" fill="url(#gls${id})" stroke="#ffffff" stroke-opacity=".6" stroke-width="1.5"/>
    <rect x="54" y="50" width="92" height="10" rx="4" fill="#fff" opacity=".85" stroke="#d9d6cf"/>
    <path d="M58 50 Q100 38 142 50 Z" fill="#fff" opacity=".7" stroke="#d9d6cf"/>
    ${leafMark(100, 140, 12)}`;
  },

  blended(a) {
    const id = ++__artId;
    return `
    <defs>
      <linearGradient id="bld${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${shade(a.color, 0.15)}"/><stop offset="1" stop-color="${shade(a.color, -0.15)}"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="188" rx="38" ry="5" fill="#000" opacity=".12"/>
    <rect x="104" y="0" width="9" height="70" rx="3" fill="#1f5fae" transform="rotate(8 108 35)"/>
    <path d="M62 78 L138 78 L128 184 Q100 190 72 184 Z" fill="url(#bld${id})"/>
    <path d="M70 120 Q84 112 98 122 T130 118" stroke="${a.accent}" stroke-width="3" fill="none" opacity=".6"/>
    <path d="M72 156 Q86 148 100 158 T128 154" stroke="${a.accent}" stroke-width="3" fill="none" opacity=".5"/>
    <path d="M62 78 L138 78 L128 184 Q100 190 72 184 Z" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
    <rect x="56" y="72" width="88" height="9" rx="4" fill="#fff" opacity=".9" stroke="#d9d6cf"/>
    <path d="M60 72 Q60 30 100 28 Q140 30 140 72 Z" fill="#fff" opacity=".45" stroke="#d9d6cf"/>
    <path d="M66 72 Q64 54 80 52 Q78 40 96 40 Q100 30 112 38 Q128 38 124 52 Q138 56 134 72 Z" fill="#fffaf2"/>
    <path d="M76 58 Q92 50 104 58 T128 56" stroke="${a.accent}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M86 46 Q98 42 112 48" stroke="${a.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${leafMark(100, 146, 11)}`;
  },

  mug(a) {
    const whip = a.whip
      ? `<path d="M56 74 Q52 58 70 56 Q72 42 92 46 Q104 34 118 46 Q138 44 136 60 Q150 64 144 76 Z" fill="#fffaf2"/>
         <path d="M68 62 Q84 54 98 62 T132 60" stroke="${shade(a.color, -0.2)}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      : `<g stroke="#c9c4b8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7">
           <path d="M84 50 Q78 38 86 28 T84 8"/><path d="M104 50 Q98 36 106 26 T104 6"/><path d="M124 50 Q118 40 126 30"/>
         </g>`;
    return `
    <ellipse cx="100" cy="182" rx="66" ry="9" fill="#000" opacity=".12"/>
    <path d="M150 96 Q182 96 180 124 Q178 150 146 152" stroke="#ece9e2" stroke-width="12" fill="none"/>
    <path d="M150 96 Q182 96 180 124 Q178 150 146 152" stroke="#fff" stroke-width="6" fill="none"/>
    <path d="M48 72 L152 72 L146 166 Q144 180 128 180 L72 180 Q56 180 54 166 Z" fill="#fff"/>
    <path d="M48 72 L152 72 L146 166 Q144 180 128 180 L120 180 Q136 176 138 160 L144 72 Z" fill="#e9e6df"/>
    <ellipse cx="100" cy="74" rx="52" ry="10" fill="${a.color}"/>
    <ellipse cx="100" cy="72" rx="52" ry="10" fill="none" stroke="#f1eee8" stroke-width="3"/>
    ${whip}
    ${leafMark(98, 126, 16)}`;
  },

  espresso() {
    return `
    <ellipse cx="100" cy="160" rx="74" ry="16" fill="#ece9e2"/>
    <ellipse cx="100" cy="156" rx="74" ry="16" fill="#fff"/>
    <ellipse cx="100" cy="156" rx="40" ry="8" fill="#ece9e2"/>
    <path d="M134 100 Q160 100 158 120 Q156 138 132 138" stroke="#fff" stroke-width="9" fill="none"/>
    <path d="M62 90 L138 90 L132 140 Q130 156 112 156 L88 156 Q70 156 68 140 Z" fill="#fff"/>
    <path d="M62 90 L138 90 L132 140 Q130 156 112 156 L104 156 Q120 152 122 138 L128 90 Z" fill="#ebe7df"/>
    <ellipse cx="100" cy="91" rx="38" ry="7" fill="#7a4a2a"/>
    <ellipse cx="96" cy="90" rx="22" ry="3.5" fill="#c58d5a" opacity=".8"/>
    <g stroke="#c9c4b8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7">
      <path d="M90 76 Q84 64 92 54 T90 34"/><path d="M110 76 Q104 62 112 52 T110 34"/>
    </g>`;
  },

  plate(inner) {
    return `
    <ellipse cx="100" cy="150" rx="84" ry="26" fill="#000" opacity=".08"/>
    <ellipse cx="100" cy="144" rx="84" ry="26" fill="#fff"/>
    <ellipse cx="100" cy="144" rx="62" ry="17" fill="#f4f2ee"/>
    ${inner}`;
  },

  /* ---------- Tensae specials ---------- */
  macchiato() {
    const id = ++__artId;
    return `
    <defs>
      <linearGradient id="mac${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fffaf2"/><stop offset=".3" stop-color="#fbf3e6"/>
        <stop offset=".42" stop-color="#e9cfae"/><stop offset=".62" stop-color="#b98457"/>
        <stop offset=".78" stop-color="#6e3f22"/><stop offset="1" stop-color="#4a2814"/>
      </linearGradient>
      <linearGradient id="mgl${id}" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".25" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".4"/>
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="170" rx="70" ry="15" fill="#e6e2d8"/>
    <ellipse cx="100" cy="166" rx="70" ry="15" fill="#fff"/>
    <ellipse cx="100" cy="166" rx="38" ry="7" fill="#eeeae1"/>
    <path d="M66 62 L134 62 L126 162 Q100 168 74 162 Z" fill="url(#mac${id})"/>
    <path d="M70 66 Q100 54 130 66" fill="#fff" opacity=".9"/>
    <path d="M86 64 Q100 74 114 64 Q104 68 100 64 Q96 68 86 64Z" fill="#c58d5a" opacity=".55"/>
    <path d="M66 62 L134 62 L126 162 Q100 168 74 162 Z" fill="url(#mgl${id})" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>
    <ellipse cx="100" cy="62" rx="34" ry="5" fill="none" stroke="#e8e4da" stroke-width="2"/>
    <g stroke="#c9c4b8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6">
      <path d="M90 48 Q84 36 92 26 T90 8"/><path d="M110 48 Q104 34 112 24 T110 8"/>
    </g>`;
  },

  jebena() {
    return `
    <ellipse cx="100" cy="184" rx="78" ry="9" fill="#000" opacity=".1"/>
    <path d="M74 100 Q54 76 44 50" stroke="#5a2e1a" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M74 100 Q54 76 44 50" stroke="#7a4128" stroke-width="8" stroke-linecap="round" fill="none"/>
    <ellipse cx="43" cy="48" rx="7" ry="4" fill="#3b1d10" transform="rotate(-25 43 48)"/>
    <path d="M108 64 Q132 62 130 92 Q128 112 112 116" stroke="#5a2e1a" stroke-width="7" fill="none" stroke-linecap="round"/>
    <rect x="86" y="30" width="22" height="46" rx="8" fill="#6a351f"/>
    <ellipse cx="97" cy="30" rx="13" ry="5" fill="#8a4a2c"/>
    <ellipse cx="97" cy="28" rx="10" ry="4" fill="#c9a46a"/>
    <path d="M97 22 L97 14" stroke="#c9a46a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="97" cy="124" r="52" fill="#6a351f"/>
    <path d="M52 112 Q97 96 142 112" stroke="#c9a46a" stroke-width="3" fill="none"/>
    <path d="M50 124 Q97 108 144 124" stroke="#c9a46a" stroke-width="1.5" fill="none" stroke-dasharray="3 4"/>
    <ellipse cx="78" cy="104" rx="14" ry="20" fill="#fff" opacity=".1"/>
    <path d="M60 152 Q97 168 134 152" stroke="#4a2414" stroke-width="5" fill="none" opacity=".5"/>
    <g transform="translate(150 150)">
      <ellipse cx="0" cy="26" rx="26" ry="6" fill="#e6e2d8"/>
      <path d="M-16 0 L16 0 L12 24 Q0 28 -12 24 Z" fill="#fff"/>
      <path d="M-16 0 L16 0 L12 24 Q6 26 2 26 Q10 20 10 0 Z" fill="#e9e6df"/>
      <ellipse cx="0" cy="1" rx="16" ry="3.5" fill="#3b2216"/>
      <path d="M-8 -8 Q-12 -16 -6 -22 M6 -8 Q2 -16 8 -24" stroke="#c9c4b8" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>`;
  },

  slice(a) {
    const layers = [0, 1, 2].map((i) => {
      const y = 104 + i * 22;
      return `<path d="M30 ${y} L130 ${y + 22} L130 ${y + 36} L30 ${y + 14} Z" fill="${a.sponge}"/>
              <path d="M30 ${y + 14} L130 ${y + 36} L130 ${y + 42} L30 ${y + 20} Z" fill="${a.cream}"/>
              <path d="M130 ${y + 22} L176 ${y + 4} L176 ${y + 18} L130 ${y + 36} Z" fill="${shade(a.sponge, -0.12)}"/>
              <path d="M130 ${y + 36} L176 ${y + 18} L176 ${y + 24} L130 ${y + 42} Z" fill="${shade(a.cream, -0.05)}"/>`;
    }).join("");
    return `
    <ellipse cx="102" cy="184" rx="86" ry="12" fill="#000" opacity=".08"/>
    <ellipse cx="102" cy="176" rx="90" ry="18" fill="#fff"/>
    <ellipse cx="102" cy="176" rx="68" ry="12" fill="#f4f2ee"/>
    <g transform="translate(-4 -40)">
      ${layers}
      <path d="M30 98 L130 120 L176 102 L84 84 Z" fill="${a.top}"/>
      <path d="M30 98 L130 120 L130 126 L30 104 Z" fill="${shade(a.top, -0.06)}"/>
      <path d="M130 120 L176 102 L176 108 L130 126 Z" fill="${shade(a.top, -0.1)}"/>
      <g fill="${a.cream}" stroke="${shade(a.cream, -0.08)}" stroke-width="1">
        <circle cx="70" cy="96" r="7"/><circle cx="98" cy="102" r="7"/><circle cx="126" cy="108" r="7"/><circle cx="150" cy="100" r="6"/>
      </g>
      <circle cx="98" cy="96" r="6" fill="${a.fruit}"/><circle cx="96" cy="94" r="2" fill="#fff" opacity=".6"/>
      <path d="M98 90 Q102 82 108 80" stroke="#5e8c3a" stroke-width="2" fill="none"/>
    </g>`;
  },

  puff() {
    const flakes = [0, 1, 2, 3, 4].map((i) => `<path d="M46 ${104 + i * 6} Q100 ${98 + i * 6} 154 ${104 + i * 6}" stroke="#c98234" stroke-width="1.5" fill="none" opacity=".5"/>`).join("");
    return ART.plate(`
      <path d="M40 110 Q38 96 54 94 L146 94 Q162 96 160 110 L160 140 Q160 148 150 148 L50 148 Q40 148 40 140 Z" fill="#e2a85a"/>
      <path d="M40 120 L160 120 L160 128 L40 128 Z" fill="#fff6e6"/>
      <path d="M40 120 Q60 126 80 120 T120 121 T160 120" stroke="#fffaf2" stroke-width="5" fill="none"/>
      ${flakes}
      <path d="M44 100 Q100 84 156 100 Q150 90 140 88 L60 88 Q50 90 44 100 Z" fill="#f0c27a"/>
      <g fill="#fff" opacity=".9">
        <circle cx="66" cy="92" r="1.8"/><circle cx="84" cy="88" r="1.6"/><circle cx="102" cy="90" r="1.8"/><circle cx="120" cy="88" r="1.6"/>
        <circle cx="138" cy="92" r="1.8"/><circle cx="76" cy="96" r="1.4"/><circle cx="112" cy="95" r="1.4"/><circle cx="130" cy="96" r="1.4"/>
      </g>`);
  },

  cake(a) {
    const deco = a.fruit
      ? `<circle cx="74" cy="66" r="8" fill="#d9334f"/><circle cx="98" cy="60" r="8" fill="#f2a43a"/><circle cx="122" cy="64" r="8" fill="#6aa84f"/>
         <circle cx="86" cy="72" r="7" fill="#7a3fa0"/><circle cx="112" cy="72" r="7" fill="#d9334f"/><circle cx="136" cy="70" r="6" fill="#f2a43a"/>`
      : `<g fill="${a.deco}"><circle cx="66" cy="70" r="4"/><circle cx="82" cy="64" r="4"/><circle cx="100" cy="62" r="4"/><circle cx="118" cy="64" r="4"/><circle cx="134" cy="70" r="4"/></g>
         <rect x="97" y="34" width="6" height="24" rx="2" fill="#fff" stroke="${a.deco}" stroke-width="1.5"/>
         <path d="M100 22 Q106 30 100 34 Q94 30 100 22 Z" fill="#f2a43a"/>`;
    const drips = [56, 72, 90, 108, 126, 142].map((x, i) => `<path d="M${x - 5} 82 L${x - 5} ${92 + (i % 3) * 8} Q${x} ${100 + (i % 3) * 8} ${x + 5} ${92 + (i % 3) * 8} L${x + 5} 82 Z" fill="${a.frost}"/>`).join("");
    return `
    <ellipse cx="100" cy="186" rx="70" ry="8" fill="#000" opacity=".1"/>
    <rect x="94" y="160" width="12" height="22" fill="#e6e2d8"/>
    <ellipse cx="100" cy="182" rx="34" ry="6" fill="#e6e2d8"/>
    <ellipse cx="100" cy="160" rx="82" ry="14" fill="#fff" stroke="#e6e2d8" stroke-width="2"/>
    <path d="M42 80 L42 150 Q100 166 158 150 L158 80 Z" fill="${a.body}"/>
    <path d="M42 112 Q100 126 158 112" stroke="${shade(a.body, a.body === "#5a3424" ? 0.25 : -0.15)}" stroke-width="5" fill="none"/>
    <path d="M128 84 L128 154 Q146 152 158 150 L158 80 Z" fill="#000" opacity=".08"/>
    <ellipse cx="100" cy="80" rx="58" ry="14" fill="${a.frost}"/>
    ${drips}
    ${deco}
    <path d="M44 150 Q100 166 156 150" stroke="${a.frost}" stroke-width="6" fill="none" stroke-dasharray="1 9" stroke-linecap="round"/>`;
  },

  danish() {
    return ART.plate(`
      <path d="M100 74 L118 92 L144 92 L130 114 L140 138 L114 132 L100 152 L86 132 L60 138 L70 114 L56 92 L82 92 Z" fill="#dc9a48"/>
      <path d="M100 82 L114 96 L134 96 L124 114 L132 132 L112 128 L100 144 L88 128 L68 132 L76 114 L66 96 L86 96 Z" fill="#eab567"/>
      <circle cx="100" cy="113" r="22" fill="#fff6e6"/>
      <circle cx="92" cy="108" r="7" fill="#d9334f"/><circle cx="106" cy="104" r="6" fill="#3d4a8a"/><circle cx="104" cy="118" r="7" fill="#d9334f"/>
      <circle cx="91" cy="106" r="2" fill="#fff" opacity=".5"/>`);
  },

  breakfast() {
    return ART.plate(`
      <ellipse cx="100" cy="128" rx="66" ry="22" fill="#d9c4a0"/>
      <g fill="#c4a97e">${Array.from({ length: 22 }, (_, i) => `<circle cx="${50 + ((i * 37) % 100)}" cy="${116 + ((i * 13) % 24)}" r="1.6"/>`).join("")}</g>
      <ellipse cx="80" cy="120" rx="24" ry="10" fill="#b5502b"/>
      <ellipse cx="78" cy="117" rx="16" ry="6" fill="#cf6a3c"/>
      <ellipse cx="124" cy="122" rx="20" ry="11" fill="#fff"/>
      <circle cx="124" cy="120" r="7" fill="#f2b632"/>
      <path d="M96 136 Q104 130 112 136" stroke="#6aa84f" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M140 108 L150 98 M146 112 L156 104" stroke="#6aa84f" stroke-width="3" stroke-linecap="round"/>`);
  },

  sandwich(a) {
    const filling = a.green ? "#7fa84a" : a.red ? "#d9442f" : "#f2c84b";
    return ART.plate(`
      <path d="M36 118 Q36 92 100 90 Q164 92 164 118 L162 124 L38 124 Z" fill="${a.color}"/>
      <path d="M44 104 Q100 96 156 104" stroke="${shade(a.color, 0.25)}" stroke-width="3" fill="none"/>
      <path d="M34 124 Q60 132 80 124 T120 126 T166 124 L166 132 L34 132 Z" fill="${filling}"/>
      <rect x="36" y="130" width="128" height="8" rx="3" fill="#e8a0a0"/>
      <path d="M36 138 L164 138 Q164 156 100 158 Q36 156 36 138 Z" fill="${shade(a.color, -0.08)}"/>`);
  },

  bites(a) {
    const one = (x) => `
      <path d="M${x - 22} 136 L${x - 20} 108 Q${x} 96 ${x + 20} 108 L${x + 22} 136 Q${x} 142 ${x - 22} 136 Z" fill="${a.color}"/>
      <ellipse cx="${x}" cy="108" rx="20" ry="7" fill="${shade(a.color, 0.2)}"/>
      <circle cx="${x - 8}" cy="122" r="3" fill="#c0522f"/><circle cx="${x + 7}" cy="128" r="3" fill="#c0522f"/><circle cx="${x + 4}" cy="114" r="2.5" fill="#c0522f"/>`;
    return ART.plate(one(74) + one(126));
  },

  wrap(a) {
    return ART.plate(`
      <g transform="rotate(-14 100 120)">
        <rect x="36" y="100" width="70" height="36" rx="16" fill="${a.color}"/>
        <ellipse cx="106" cy="118" rx="12" ry="18" fill="#f5efe1"/>
        <ellipse cx="106" cy="118" rx="9" ry="14" fill="#7fa84a"/><circle cx="104" cy="114" r="4" fill="#fff"/><circle cx="108" cy="124" r="3" fill="#d9442f"/>
      </g>
      <g transform="rotate(10 120 120)">
        <rect x="96" y="104" width="70" height="36" rx="16" fill="${shade(a.color, -0.05)}"/>
        <ellipse cx="96" cy="122" rx="12" ry="18" fill="#f5efe1"/>
        <ellipse cx="96" cy="122" rx="9" ry="14" fill="#7fa84a"/><circle cx="94" cy="118" r="4" fill="#fff"/><circle cx="98" cy="128" r="3" fill="#d9442f"/>
      </g>`);
  },

  croissant(a) {
    const c = a.color;
    return ART.plate(`
      <path d="M30 128 Q40 92 70 88 L130 88 Q160 92 170 128 Q150 130 140 118 Q120 140 100 140 Q80 140 60 118 Q50 130 30 128 Z" fill="${c}"/>
      <path d="M70 88 Q74 112 80 136 M100 86 L100 140 M130 88 Q126 112 120 136" stroke="${shade(c, -0.25)}" stroke-width="3" fill="none"/>
      <path d="M62 96 Q100 84 138 96" stroke="${shade(c, 0.3)}" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${a.choc ? `<path d="M50 112 Q52 104 58 104 M146 112 Q148 104 142 104" stroke="#3b2216" stroke-width="6" stroke-linecap="round"/>` : ""}`);
  },

  muffin(a) {
    const dots = [[82, 70], [100, 62], [118, 72], [92, 84], [112, 86], [74, 86], [126, 88]]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${a.dots}"/>`).join("");
    return ART.plate(`
      <path d="M62 100 L138 100 L130 146 L70 146 Z" fill="#f1e3c8"/>
      <path d="M68 100 L72 146 M82 100 L84 146 M96 100 L97 146 M110 100 L109 146 M124 100 L122 146" stroke="#d8c6a2" stroke-width="2"/>
      <path d="M52 102 Q46 70 72 60 Q86 44 104 50 Q126 46 138 64 Q156 76 148 102 Z" fill="${a.color}"/>
      <path d="M60 92 Q80 86 100 92 T144 92" stroke="${shade(a.color, 0.3)}" stroke-width="4" fill="none"/>
      ${dots}`);
  },

  loaf(a) {
    const c = a.color;
    return ART.plate(`
      <path d="M44 100 L84 82 L84 140 L44 140 Z" fill="${shade(c, -0.12)}"/>
      <rect x="84" y="82" width="74" height="58" fill="${shade(c, 0.35)}"/>
      <path d="M84 82 L158 82 L118 64 L44 100 Z" fill="${c}" opacity="0"/>
      <rect x="84" y="82" width="74" height="58" fill="none" stroke="${c}" stroke-width="6"/>
      ${a.icing ? `<path d="M80 78 L162 78 L162 90 Q150 98 140 88 Q128 100 116 88 Q104 98 92 88 Q86 96 80 90 Z" fill="#fffbe9"/>`
                : `<g fill="${shade(c, -0.3)}"><circle cx="102" cy="104" r="4"/><circle cx="130" cy="118" r="4"/><circle cx="114" cy="126" r="3"/><circle cx="142" cy="100" r="3"/></g>`}`);
  },

  box() {
    return ART.plate(`
      <rect x="38" y="80" width="124" height="66" rx="10" fill="#fff" stroke="#d9d6cf" stroke-width="2"/>
      <line x1="98" y1="82" x2="98" y2="144" stroke="#d9d6cf" stroke-width="2"/>
      <line x1="40" y1="112" x2="96" y2="112" stroke="#d9d6cf" stroke-width="2"/>
      <ellipse cx="58" cy="96" rx="10" ry="8" fill="#fff" stroke="#e8e0cf"/><circle cx="58" cy="96" r="4.5" fill="#f2c84b"/>
      <ellipse cx="80" cy="96" rx="10" ry="8" fill="#fff" stroke="#e8e0cf"/><circle cx="80" cy="96" r="4.5" fill="#f2c84b"/>
      <rect x="48" y="120" width="16" height="14" rx="2" fill="#f2c26b"/><rect x="70" y="120" width="16" height="14" rx="2" fill="#f2c26b"/>
      <g fill="#9cbf4a"><circle cx="114" cy="96" r="6"/><circle cx="126" cy="94" r="6"/><circle cx="120" cy="104" r="6"/></g>
      <path d="M134 112 Q150 96 154 120 Q150 138 134 132 Z" fill="#d9442f"/><path d="M138 116 Q148 112 150 124" stroke="#fff" stroke-width="3" fill="none"/>
      <rect x="108" y="118" width="22" height="20" rx="3" fill="#b5844f"/>`);
  },

  cookie(a) {
    const chips = [[80, 100], [104, 92], [124, 108], [92, 124], [116, 130], [74, 120], [136, 124]]
      .map(([x, y]) => `<path d="M${x} ${y - 5} L${x + 5} ${y + 4} L${x - 5} ${y + 4} Z" fill="#3b2216"/>`).join("");
    return ART.plate(`
      <ellipse cx="100" cy="116" rx="54" ry="34" fill="${shade(a.color, -0.15)}"/>
      <ellipse cx="100" cy="112" rx="54" ry="34" fill="${a.color}"/>
      <path d="M62 104 Q80 96 92 106 M108 98 Q124 96 132 106" stroke="${shade(a.color, 0.25)}" stroke-width="3" fill="none"/>
      ${chips}`);
  },

  pop(a) {
    const spr = Array.from({ length: 14 }, (_, i) => {
      const ang = (i / 14) * Math.PI * 2, r = 18 + (i % 3) * 6;
      const x = 100 + Math.cos(ang) * r, y = 70 + Math.sin(ang) * r;
      return `<rect x="${x}" y="${y}" width="6" height="2.2" rx="1" fill="#fff" transform="rotate(${i * 37} ${x} ${y})"/>`;
    }).join("");
    return `
      <ellipse cx="100" cy="186" rx="30" ry="5" fill="#000" opacity=".1"/>
      <rect x="96" y="96" width="8" height="90" rx="3" fill="#f7f4ee" stroke="#e0dbd0"/>
      <circle cx="100" cy="70" r="40" fill="${shade(a.color, -0.1)}"/>
      <circle cx="96" cy="66" r="38" fill="${a.color}"/>
      <ellipse cx="84" cy="52" rx="12" ry="7" fill="#fff" opacity=".4"/>
      ${spr}`;
  },

  brownie(a) {
    return ART.plate(`
      <path d="M48 104 L100 84 L152 104 L152 132 L100 152 L48 132 Z" fill="${shade(a.color, -0.2)}"/>
      <path d="M48 104 L100 84 L152 104 L100 124 Z" fill="${a.color}"/>
      <path d="M100 124 L152 104 L152 132 L100 152 Z" fill="${shade(a.color, -0.35)}"/>
      <g fill="#2a160d"><rect x="76" y="98" width="9" height="7" rx="2"/><rect x="104" y="96" width="8" height="7" rx="2"/><rect x="118" y="106" width="9" height="6" rx="2"/><rect x="92" y="108" width="7" height="6" rx="2"/></g>
      <path d="M58 104 L100 88 L142 104" stroke="${shade(a.color, 0.25)}" stroke-width="2" fill="none"/>`);
  },
};

function drawProduct(p, extraClass = "") {
  const art = p.art || { type: "hot", sleeve: "#d4e9e2" };
  const fn = ART[art.type] || ART.hot;
  return `<svg class="product-art ${extraClass}" viewBox="0 0 200 200" role="img" aria-label="${p.name}" xmlns="http://www.w3.org/2000/svg">${fn(art)}</svg>`;
}
