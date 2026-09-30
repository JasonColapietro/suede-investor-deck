// 02 · The map — the spine from the open collapses into the hub; six surfaces
// light up on an orbit around one Suede account. Facts: STORYBOARD only.
(function () {
  const { el, svg, prog, clamp, lerp, E } = Film;

  const ARCS = [
    [16.45, 'M86.40 202.96A113.10 113.10 0 0 1 282.03 122.32'],
    [16.45, 'M312.50 196.24A113.10 113.10 0 0 1 116.87 276.88'],
    [17.15, 'M113.44 203.02A86.08 86.08 0 0 1 262.12 140.59'],
    [17.15, 'M285.46 196.18A86.08 86.08 0 0 1 136.78 258.61'],
    [16.4, 'M141.49 203.35A58.08 58.08 0 0 1 242.36 160.46'],
    [16.4, 'M257.41 195.85A58.08 58.08 0 0 1 156.54 238.74'],
  ];

  // 24px line icons, 1.75 stroke, round caps
  const I = (d) => `<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICONS = {
    web: I('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 3.8 5.6 3.8 9s-1.2 6.4-3.8 9c-2.6-2.6-3.8-5.6-3.8-9S9.4 5.6 12 3z"/>'),
    ios: I('<rect x="6.5" y="2.5" width="11" height="19" rx="2.6"/><path d="M10.5 18.2h3"/>'),
    chrome: I('<rect x="2.5" y="4" width="19" height="16" rx="2.2"/><path d="M2.5 8.5h19"/><circle cx="5.6" cy="6.25" r=".5"/><circle cx="7.8" cy="6.25" r=".5"/>'),
    api: I('<path d="M8 7.5 3.5 12 8 16.5"/><path d="M16 7.5 20.5 12 16 16.5"/><path d="M13.4 5.5 10.6 18.5"/>'),
    chain: I('<path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z"/><path d="M4 7.4 12 12l8-4.6"/><path d="M12 12v9.2"/>'),
    econ: I('<ellipse cx="12" cy="6.5" rx="7.5" ry="3"/><path d="M4.5 6.5v5.5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6.5"/><path d="M4.5 12v5.5c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V12"/>'),
  };

  const C = { x: 960, y: 560 };
  const CW = 400, CH = 96;
  const SX = 600, DX = 360, DY = 290;          // side / diagonal card offsets from the hub
  const RX = SX, RY = DY / Math.sqrt(1 - (DX / SX) ** 2); // orbit ellipse passes through every card centre
  // clockwise from 12 o'clock
  const NODES = [
    { th: 30, name: 'Web', desc: 'suedeai.ai · suedeai.org', ic: 'web' },
    { th: 90, name: 'iOS', desc: '9 apps', ic: 'ios' },
    { th: 150, name: 'Chrome', desc: '2 extensions', ic: 'chrome' },
    { th: 210, name: 'Agents &amp; API', desc: 'x402 · MCP · SDKs', ic: 'api' },
    { th: 270, name: 'On-chain', desc: 'ERC-8004 · 23 identities', ic: 'chain' },
    { th: 330, name: 'Economy', desc: 'Stripe · x402 · $SUEDE', ic: 'econ' },
  ].map(n => {
    const side = n.th === 90 || n.th === 270;
    const sx = Math.sign(Math.round(Math.sin(n.th * Math.PI / 180) * 1000));
    const sy = side ? 0 : (n.th < 90 || n.th > 270 ? -1 : 1);
    return { ...n, x: C.x + sx * (side ? SX : DX), y: C.y + sy * DY };
  });

  const css = `
  .scene-map .cam{position:absolute;inset:0;transform-origin:960px 560px}
  .scene-map .hub{position:absolute;left:${C.x}px;top:${C.y}px;width:0;height:0}
  .scene-map .hub>*{position:absolute;left:0;top:0}
  .scene-map .hub .halo{width:560px;height:560px;margin:-280px 0 0 -280px;border-radius:50%;
    background:radial-gradient(circle,rgba(6,207,239,.14),rgba(18,35,79,.4) 40%,transparent 68%)}
  .scene-map .hub .disc{width:236px;height:236px;margin:-118px 0 0 -118px;border-radius:50%;
    background:radial-gradient(circle at 50% 35%,#18244a,#0e1532 70%);border:1px solid var(--hairline-2);
    box-shadow:0 30px 70px -30px rgba(0,0,0,.9)}
  .scene-map .hub .dash{width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;border:1px dashed rgba(58,70,112,.8)}
  .scene-map .hub .pulse{width:236px;height:236px;margin:-118px 0 0 -118px;border-radius:50%;border:1px solid var(--accent);opacity:0}
  .scene-map .hub svg.mk{width:124px;height:124px;margin:-62px 0 0 -62px;overflow:visible}
  .scene-map .hub .lbl{top:172px;white-space:nowrap;transform:translateX(-50%);font:500 20px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--body)}
  .scene-map .spine{position:absolute;left:120px;top:${C.y - 1}px;width:1680px;height:2px;transform-origin:50% 50%;
    background:linear-gradient(90deg,transparent,var(--accent) 18%,var(--accent) 82%,transparent)}
  .scene-map .card{position:absolute;width:${CW}px;height:${CH}px;margin:${-CH / 2}px 0 0 ${-CW / 2}px;border-radius:12px;
    display:flex;align-items:center;gap:20px;padding:0 24px 0 20px;
    background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--hairline);
    box-shadow:0 30px 60px -30px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.04)}
  .scene-map .card .ic{flex:none;width:56px;height:56px;border-radius:12px;display:grid;place-items:center;
    background:var(--ground);border:1px solid var(--hairline-2);color:var(--ink)}
  .scene-map .card .nm{font:600 28px/1.1 var(--sans);letter-spacing:-.01em;color:var(--ink)}
  .scene-map .card .ds{font:400 19px/1 var(--mono);letter-spacing:.02em;color:var(--body);margin-top:9px;white-space:nowrap}
  .scene-map .card .ds b{font-weight:500;color:var(--ink)}
  .scene-map .pk{position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:2px;
    background:var(--accent);box-shadow:0 0 12px var(--accent-glow)}
  `;
  function styleOnce() {
    if (document.getElementById('st-map')) return;
    const s = el('style', '', document.head); s.id = 'st-map'; s.textContent = css;
  }

  Film.scene({
    id: 'map', dur: 11, chapter: ['01', 'The map'],
    build(root) {
      styleOnce();
      const cam = el('div', 'cam', root);
      const spine = el('div', 'spine', cam);

      // orbit + spokes layer
      const lay = Film.layer(cam, 1);
      const orbit = svg('ellipse', { cx: C.x, cy: C.y, rx: RX, ry: RY, fill: 'none', stroke: 'rgba(58,70,112,.55)', 'stroke-width': 1.25, 'stroke-dasharray': '3 9' }, lay);

      const spokes = NODES.map(n => {
        const dx = n.x - C.x, dy = n.y - C.y, L = Math.hypot(dx, dy);
        const ux = dx / L, uy = dy / L;
        const s = Math.max(Math.abs(dx) / (CW / 2), Math.abs(dy) / (CH / 2));
        const a = { x: C.x + ux * 150, y: C.y + uy * 150 };
        const b = { x: n.x - dx / s, y: n.y - dy / s };
        const glow = svg('path', { d: `M${a.x} ${a.y}L${b.x} ${b.y}`, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0 }, lay);
        glow.style.filter = 'blur(4px)';
        const p = svg('path', { d: `M${a.x} ${a.y}L${b.x} ${b.y}`, fill: 'none', stroke: 'var(--hairline-2)', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, lay);
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        p.style.strokeDasharray = `${len} ${len}`;
        const port = svg('circle', { cx: b.x, cy: b.y, r: 4.5, fill: '#161f3c', stroke: 'var(--hairline-2)', 'stroke-width': 1.25 }, lay);
        const ring = svg('circle', { cx: b.x, cy: b.y, r: 5, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.5, opacity: 0 }, lay);
        return { a, b, p, glow, len, port, ring };
      });

      // hub
      const hub = el('div', 'hub', cam);
      const halo = el('div', 'halo', hub);
      const pulses = [0, 1, 2].map(() => el('div', 'pulse', hub));
      const dash = el('div', 'dash', hub);
      const disc = el('div', 'disc', hub);
      const mk = svg('svg', { viewBox: '70 70 260 260', class: 'mk' }, hub);
      const g = svg('g', { fill: 'none', stroke: '#fff', 'stroke-linecap': 'round' }, mk);
      const arcs = ARCS.map(([w, d]) => svg('path', { d, 'stroke-width': w }, g));
      const lens = arcs.map(a => a.getTotalLength());
      arcs.forEach((a, i) => { a.style.strokeDasharray = `${lens[i]} ${lens[i] + 40}`; });
      const bar = svg('path', { d: 'M140 188.9H250V211.9H140Z', fill: '#06cfef' }, mk);
      bar.style.transformBox = 'fill-box'; bar.style.transformOrigin = '50% 50%';
      const lbl = el('div', 'lbl', hub, 'One Suede account');

      // cards
      const cards = NODES.map(n => {
        const c = el('div', 'card', cam, `<div class="ic">${ICONS[n.ic]}</div><div><div class="nm">${n.name}</div><div class="ds">${n.desc}</div></div>`);
        c.style.left = n.x + 'px'; c.style.top = n.y + 'px';
        return c;
      });

      // packets: one leaves every 0.62s, clockwise, 1.1s per hop → ≤2 in flight
      const PK0 = 3.9, PKGAP = .62, PKDUR = 1.1, PKN = 9;
      const pks = [0, 1, 2].map(() => el('div', 'pk', cam));

      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .6, .8);
        // slow drift, felt not seen
        const drift = prog(t, 0, dur, E.inOut);
        cam.style.transform = `scale(${1 + .03 * drift})`;

        // spine from the open collapses into the hub
        const sc = prog(t, 0, .8, E.inOut);
        spine.style.transform = `scaleX(${1 - sc})`;
        spine.style.opacity = t < .05 ? 0 : clamp(1 - sc * 1.15) * clamp(t / .15);

        // hub
        const pd = prog(t, .3, 1.1, E.out);
        disc.style.opacity = pd;
        disc.style.transform = `scale(${.86 + .14 * pd})`;
        const pdash = prog(t, .9, 1.2, E.out);
        dash.style.opacity = pdash * .9;
        dash.style.transform = `rotate(${t * 4.5}deg) scale(${.9 + .1 * pdash})`;
        halo.style.opacity = prog(t, .5, 1.6) * (.85 + .15 * Math.sin(t * Math.PI / 3));
        arcs.forEach((a, i) => {
          const p = prog(t, .4 + i * .08, 1.4, E.out);
          a.style.strokeDashoffset = lens[i] * (1 - p);
          a.style.opacity = p > .002 ? 1 : 0;
        });
        const pb = prog(t, .55, .7, E.out);
        bar.style.transform = `scaleX(${pb})`;
        bar.style.opacity = pb > 0 ? 1 : 0;
        const pl = prog(t, 1.5, .45);
        lbl.style.opacity = pl;
        lbl.style.letterSpacing = lerp(.26, .16, pl) + 'em';
        // pulse rings (hub is the subject) — 4s cycle, 3 staggered
        pulses.forEach((r, i) => {
          const ph = t - 1.6 - i * 1.33;
          if (ph < 0) { r.style.opacity = 0; return; }
          const q = (ph % 4) / 4;
          r.style.opacity = .22 * (1 - q) * clamp(ph / .3);
          r.style.transform = `scale(${1 + .55 * E.brand(q)})`;
        });

        // orbit
        orbit.setAttribute('opacity', prog(t, 1.3, 1.2));
        orbit.style.strokeDashoffset = -t * 6;

        // spokes draw outward (clockwise, 90ms stagger), cards land at the tip
        const hot = prog(t, 9.0, .45);  // hand-off: iOS goes hot for the next chapter
        spokes.forEach((s, i) => {
          const pdw = prog(t, 1.75 + i * .09, .9, E.inOut);
          s.p.style.strokeDashoffset = s.len * (1 - pdw);
          s.port.setAttribute('opacity', prog(t, 2.45 + i * .09, .3));
          const pc = prog(t, 2.3 + i * .09, .9, E.brand);
          const n = NODES[i];
          const ux = (n.x - C.x) / Math.hypot(n.x - C.x, n.y - C.y), uy = (n.y - C.y) / Math.hypot(n.x - C.x, n.y - C.y);
          const c = cards[i];
          const isHot = i === 1;
          const dim = isHot ? 1 : 1 - .45 * hot;
          c.style.opacity = pc * dim;
          c.style.transform = `translate(${-ux * 24 * (1 - pc)}px,${-uy * 24 * (1 - pc)}px) scale(${.98 + .02 * pc})`;
          if (isHot) {
            c.style.borderColor = `rgba(6,207,239,${.4 * hot})`;
            c.style.boxShadow = `0 0 0 8px rgba(6,207,239,${.08 * hot}),0 0 44px rgba(6,207,239,${.4 * hot}),0 30px 60px -30px rgba(0,0,0,.8)`;
            s.p.setAttribute('stroke', hot > .5 ? 'var(--accent)' : 'var(--hairline-2)');
            s.glow.setAttribute('opacity', .25 * hot);
          }
          s.p.setAttribute('opacity', isHot ? 1 : 1 - .4 * hot);
        });

        // packets (proof diamonds) travel hub → port; port pings on arrival
        const arrivals = new Array(6).fill(-1);
        pks.forEach(pk => { pk.style.opacity = 0; });
        let slot = 0;
        for (let k = 0; k < PKN; k++) {
          const t0 = PK0 + k * PKGAP, li = k % 6, s = spokes[li];
          const q = (t - t0) / PKDUR;
          if (q >= 1) arrivals[li] = Math.max(arrivals[li], t0 + PKDUR);
          if (q < 0 || q >= 1 || slot >= pks.length) continue;
          const e = E.inOut(q);
          const pk = pks[slot++];
          const x = lerp(s.a.x, s.b.x, e), y = lerp(s.a.y, s.b.y, e);
          const sc2 = Math.min(clamp(q / .08), clamp((1 - q) / .08));
          pk.style.opacity = sc2 * (1 - hot);
          pk.style.transform = `translate(${x}px,${y}px) rotate(45deg) scale(${sc2})`;
        }
        spokes.forEach((s, i) => {
          const da = arrivals[i] < 0 ? 99 : t - arrivals[i];
          const q = clamp(da / .7);
          const on = da >= 0 && da < .7;
          s.ring.setAttribute('opacity', on ? .55 * (1 - q) : 0);
          s.ring.setAttribute('r', 5 + 14 * E.brand(q));
          const lit = (on ? 1 - q : 0);
          const hotPort = i === 1 ? hot : 0;
          s.port.setAttribute('fill', lit > .3 || hotPort > .5 ? '#06cfef' : '#161f3c');
          s.port.setAttribute('stroke', lit > .3 || hotPort > .5 ? '#06cfef' : 'var(--hairline-2)');
        });
      };
    },
  });
})();
