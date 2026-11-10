/*
 * SiteProof — illustrated stand-ins for site photos in the demo data.
 * They are drawn as SVG so the repo contains no real photographs.
 * Red dashed rings mark the problem, the way people mark up photos on site.
 */
(function (root) {
  'use strict';
  const cache = {};
  const W = 800, H = 600;

  const frame = (bg, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient>
<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset="60%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".38"/></radialGradient>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .16 0"/></filter>
</defs>
<rect width="${W}" height="${H}" fill="url(#bg)"/>
${body}
<rect width="${W}" height="${H}" filter="url(#grain)"/>
<rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;

  const mark = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#E53935" stroke-width="7" stroke-dasharray="18 11" stroke-linecap="round" opacity=".95"/>`;

  const scenes = {
    window: () => frame(['#d8cfc2', '#c4b9aa'], `
<rect x="140" y="70" width="520" height="440" fill="#eceae6" stroke="#a9adb0" stroke-width="4"/>
<rect x="165" y="95" width="225" height="390" fill="#f7f7f5" stroke="#9ea3a7" stroke-width="3"/>
<rect x="185" y="115" width="185" height="350" fill="#a8c8e6"/>
<path d="M185 115 L370 115 L370 300 Z" fill="#d4e5f3" opacity=".7"/>
<g transform="rotate(2.4 635 485)"><rect x="410" y="95" width="225" height="390" fill="#f7f7f5" stroke="#9ea3a7" stroke-width="3"/>
<rect x="430" y="115" width="185" height="350" fill="#9dbfdf"/><path d="M430 115 L615 115 L615 280 Z" fill="#cfe1f1" opacity=".7"/></g>
<rect x="398" y="270" width="8" height="60" rx="3" fill="#8b9196"/>
<rect x="120" y="505" width="560" height="22" fill="#d9d6d0"/>
${mark(628, 108, 46)}`),

    cable: () => frame(['#bdbfbc', '#a5a7a4'], `
<rect x="0" y="0" width="800" height="70" fill="#8d918f"/>
<rect x="80" y="70" width="640" height="10" fill="#7d8180"/>
<rect x="300" y="150" width="200" height="160" rx="6" fill="#d7d9da" stroke="#8f9496" stroke-width="4"/>
<rect x="318" y="168" width="164" height="124" rx="4" fill="#4a4f53"/>
<path d="M350 290 C 340 360, 300 400, 290 470" stroke="#7a4b2a" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M400 290 C 410 370, 430 410, 420 480" stroke="#2d63b8" stroke-width="12" fill="none" stroke-linecap="round"/>
<path d="M445 290 C 470 350, 520 380, 540 450" stroke="#55585a" stroke-width="12" fill="none" stroke-linecap="round"/>
<circle cx="290" cy="474" r="7" fill="#c8843f"/><circle cx="420" cy="484" r="7" fill="#c8843f"/><circle cx="540" cy="454" r="7" fill="#c8843f"/>
<rect x="560" y="520" width="150" height="40" rx="4" fill="#d1d3d4" transform="rotate(-8 635 540)"/>
${mark(410, 330, 140)}`),

    crack: () => frame(['#ebe8e3', '#d9d5cf'], `
<rect x="250" y="210" width="300" height="390" fill="#f4f2ee" stroke="#b9b5ae" stroke-width="6"/>
<rect x="268" y="228" width="264" height="372" fill="#e2ded7"/>
<circle cx="505" cy="420" r="9" fill="#9a9690"/>
<path d="M550 210 L575 186 L571 170 L596 148 L592 132 L618 106 L629 82" stroke="#4d4944" stroke-width="4" fill="none" stroke-linejoin="round"/>
<path d="M592 132 L608 128" stroke="#4d4944" stroke-width="2.5" fill="none"/>
${mark(592, 146, 78)}`),

    leak: () => frame(['#6b5440', '#4e3c2d'], `
<rect x="60" y="0" width="680" height="40" fill="#cfcac3"/>
<rect x="60" y="40" width="680" height="560" fill="#5c4836"/>
<rect x="60" y="520" width="680" height="80" fill="#7a6450"/>
<path d="M330 40 L330 170 Q330 220 380 220 L470 220 Q510 220 510 180 L510 150" stroke="#b7bcbf" stroke-width="22" fill="none"/>
<rect x="490" y="40" width="40" height="110" fill="#aeb3b6"/>
<rect x="318" y="150" width="24" height="26" fill="#8f9598"/>
<path d="M420 238 q6 14 0 22 q-6 -8 0 -22z" fill="#9bd0f2"/><path d="M432 290 q6 14 0 22 q-6 -8 0 -22z" fill="#9bd0f2"/>
<ellipse cx="420" cy="545" rx="210" ry="34" fill="#7fb6dc" opacity=".55"/>
<ellipse cx="400" cy="540" rx="120" ry="16" fill="#cbe6f7" opacity=".45"/>
${mark(424, 230, 62)}`),

    railing: () => frame(['#c9ccce', '#b3b6b8'], `
<path d="M0 600 L0 520 L120 520 L120 460 L240 460 L240 400 L360 400 L360 340 L480 340 L480 280 L600 280 L600 220 L800 220 L800 600 Z" fill="#9fa3a6"/>
<path d="M0 520 L120 520 L120 460 L240 460 L240 400 L360 400 L360 340 L480 340 L480 280 L600 280 L600 220 L800 220" stroke="#7d8184" stroke-width="5" fill="none"/>
<line x1="40" y1="380" x2="760" y2="70" stroke="#3d4246" stroke-width="16" stroke-linecap="round"/>
<rect x="180" y="300" width="18" height="40" fill="#5b6064"/><rect x="186" y="336" width="40" height="10" fill="#5b6064"/>
<rect x="560" y="140" width="40" height="10" fill="#8a8e91" opacity=".6"/>
<circle cx="567" cy="145" r="4" fill="#4c5054"/><circle cx="593" cy="145" r="4" fill="#4c5054"/>
${mark(578, 140, 70)}`),

    tiles: () => {
      let t = '';
      for (let r = 0; r < 6; r++) {
        const off = r === 2 ? 22 : 0;
        for (let c = -1; c < 7; c++) {
          t += `<rect x="${c * 130 + off + 4}" y="${r * 100 + 4}" width="122" height="92" fill="#f3f4f2" stroke="#cfd2d0" stroke-width="2"/>`;
        }
      }
      return frame(['#d8dad8', '#c9ccca'], `<rect width="800" height="600" fill="#bfc3c1"/>${t}${mark(420, 250, 90)}`);
    },

    socket: () => frame(['#e4e1dc', '#cfcbc4'], `
<rect x="250" y="180" width="300" height="190" rx="6" fill="#bdb8b0" stroke="#a29d95" stroke-width="3"/>
<circle cx="335" cy="275" r="60" fill="#55534f"/><circle cx="465" cy="275" r="60" fill="#55534f"/>
<path d="M330 280 C 320 340, 360 380, 340 430" stroke="#7a4b2a" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M470 280 C 490 340, 450 380, 470 440" stroke="#2d63b8" stroke-width="9" fill="none" stroke-linecap="round"/>
<circle cx="340" cy="433" r="6" fill="#c8843f"/><circle cx="470" cy="443" r="6" fill="#c8843f"/>
${mark(400, 330, 150)}`),

    paint: () => frame(['#eceeea', '#dcdfda'], `
<rect x="520" y="60" width="220" height="540" fill="#9da3a6"/><rect x="626" y="60" width="6" height="540" fill="#7f8588"/>
<rect x="0" y="560" width="800" height="40" fill="#cfd2cd"/>
<path d="M120 400 C 220 380, 320 395, 440 372" stroke="#4b4b48" stroke-width="7" fill="none" stroke-linecap="round" opacity=".55"/>
<path d="M150 420 C 260 410, 330 418, 470 398" stroke="#4b4b48" stroke-width="4" fill="none" stroke-linecap="round" opacity=".45"/>
<path d="M300 440 C 360 430, 420 438, 500 425" stroke="#4b4b48" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>
${mark(330, 410, 175)}`),

    radiator: () => frame(['#e7e5e1', '#d4d1cc'], `
<rect x="140" y="80" width="520" height="140" fill="#b9d3e8" stroke="#eef0ef" stroke-width="16"/>
<rect x="160" y="300" width="480" height="220" rx="8" fill="#f2f2f0" stroke="#c7c9c8" stroke-width="3"/>
${Array.from({ length: 15 }, (_, i) => `<rect x="${176 + i * 31}" y="312" width="18" height="196" rx="5" fill="#e3e4e2"/>`).join('')}
<rect x="640" y="470" width="40" height="22" rx="4" fill="#c9cbca"/><circle cx="700" cy="481" r="18" fill="#efefed" stroke="#b5b7b6" stroke-width="3"/>
${mark(400, 410, 170)}`),

    light: () => frame(['#f1efea', '#c9c5be'], `
<ellipse cx="400" cy="200" rx="150" ry="40" fill="#f9f8f5" stroke="#d4d0c9" stroke-width="4"/>
<ellipse cx="400" cy="195" rx="110" ry="24" fill="#fff6d6"/>
<g stroke="#e0b84a" stroke-width="5" stroke-linecap="round" opacity=".8">
<line x1="260" y1="270" x2="230" y2="300"/><line x1="400" y1="280" x2="400" y2="320"/><line x1="540" y1="270" x2="570" y2="300"/></g>
${mark(400, 200, 175)}`),

    door: () => frame(['#d9d3ca', '#c3bcb2'], `
<rect x="230" y="40" width="340" height="560" fill="#ece9e4" stroke="#b7b2aa" stroke-width="5"/>
<rect x="258" y="68" width="284" height="532" fill="#a7835f"/>
<rect x="258" y="68" width="284" height="532" fill="url(#bg)" opacity=".15"/>
<rect x="500" y="330" width="60" height="14" rx="6" fill="#c4c7c9"/>
<g stroke="#5d5048" stroke-width="3" stroke-linecap="round"><line x1="560" y1="290" x2="574" y2="368"/><line x1="566" y1="300" x2="578" y2="350"/><line x1="556" y1="320" x2="566" y2="380"/></g>
${mark(568, 336, 64)}`),

    insulation: () => frame(['#ddd8d0', '#c8c2b9'], `
<rect x="120" y="60" width="560" height="480" fill="#c9c4bb"/>
<rect x="200" y="110" width="400" height="380" fill="#f5f5f3" stroke="#a7abad" stroke-width="4"/>
<rect x="224" y="134" width="352" height="332" fill="#a9c7e2"/>
<rect x="600" y="110" width="30" height="380" fill="#6a6f73"/>
<rect x="604" y="150" width="22" height="300" fill="#d6dbe0"/>
<g fill="#f2d36b"><circle cx="612" cy="170" r="12"/><circle cx="618" cy="196" r="10"/><circle cx="610" cy="222" r="9"/></g>
${mark(615, 300, 110)}`)
  };

  function scene(name) {
    if (!cache[name]) {
      const fn = scenes[name] || scenes.crack;
      cache[name] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fn());
    }
    return cache[name];
  }

  root.SP = root.SP || {};
  root.SP.scene = scene;
})(typeof self !== 'undefined' ? self : this);
