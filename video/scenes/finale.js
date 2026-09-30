// Scene 9 · Finale — the full constellation lights in a wave, then recedes into the end card.
(function () {
  const { el, svg, prog, clamp, lerp, E } = Film;
  const CX = 960, CY = 540;
  const LENS = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b4bcd6" stroke-width="1.75" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>`;
  const css = `
.scene-finale .world{position:absolute;inset:0;transform-origin:960px 540px}
.scene-finale .ico{position:absolute;width:64px;height:64px;margin:-32px 0 0 -32px;border-radius:15px;overflow:hidden;background:var(--ground);border:1px solid var(--hairline-2);
  display:grid;place-items:center;box-shadow:0 20px 40px -20px rgba(0,0,0,.8)}
.scene-finale .ico img{width:100%;height:100%;display:block}
.scene-finale .icl{position:absolute;transform:translateX(-50%);white-space:nowrap;font-size:18px;color:var(--muted)}
.scene-finale .nd{position:absolute;width:0;height:0}
.scene-finale .nd i{position:absolute;left:-6px;top:-6px;width:12px;height:12px;border-radius:50%;background:var(--surface);border:1px solid var(--hairline-2)}
.scene-finale .nd span{position:absolute;white-space:nowrap;font-size:20px;line-height:24px;color:var(--body)}
.scene-finale .hubc{position:absolute;left:${CX - 100}px;top:${CY - 100}px;width:200px;height:200px;border-radius:50%;background:var(--ground);border:1px solid var(--hairline-2);box-shadow:0 30px 60px -30px rgba(0,0,0,.7)}
.scene-finale .halo{position:absolute;left:${CX - 260}px;top:${CY - 260}px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(6,207,239,.22),transparent 65%);filter:blur(20px)}
.scene-finale .orbit{position:absolute;left:${CX - 150}px;top:${CY - 150}px;width:300px;height:300px;border-radius:50%;border:1px dashed rgba(42,51,84,.9)}
.scene-finale .pulse{position:absolute;left:${CX - 100}px;top:${CY - 100}px;width:200px;height:200px;border-radius:50%;border:1px solid var(--accent)}
.scene-finale .mk{position:absolute;left:0;top:0;width:100px;height:100px;filter:drop-shadow(0 0 40px rgba(6,207,239,.25))}
.scene-finale .dia{position:absolute;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:2px;background:var(--accent);box-shadow:0 0 12px var(--accent-glow)}
.scene-finale .floor{position:absolute;inset:0;background:radial-gradient(60% 70% at 50% 110%,rgba(6,207,239,.18),transparent 70%)}
.scene-finale .title{position:absolute;left:0;right:0;top:452px;text-align:center;font-family:var(--serif);font-size:116px;line-height:.98;letter-spacing:-.015em}
.scene-finale .title .line-mask{padding-bottom:.12em}
.scene-finale .title em{font-style:italic;color:var(--accent)}
.scene-finale .url{position:absolute;left:0;right:0;top:760px;text-align:center;font-family:var(--mono);font-weight:500;font-size:26px;letter-spacing:.18em;color:var(--ink)}
.scene-finale .url::before,.scene-finale .url::after{content:"";display:inline-block;width:48px;height:1px;background:var(--hairline-2);vertical-align:middle;margin:0 24px}
.scene-finale .black{position:absolute;inset:-2px;background:#000;z-index:60}
`;
  const ICONS = ['suede-ai-generator', 'suede-studio-muse', 'suede-guitar-tuner-studio', 'suede-voice', 'fretpulse', 'guitarhub',
    'suede-social', 'suede-agent-studio', 'agentix', 'suede-sing', null /* Suede Lens */];
  const OUTER = ['app.suedeai.ai', 'IP Registry', 'Suede AI Distro', 'Studio Music', 'Agent Studio', 'x402 API', 'x402.json', 'MCP',
    'llms.txt', 'A2A card', 'ERC-8004', 'Producer · ACP', 'suede-ai SDK', '$SUEDE', 'Stripe credits', 'Stripe Agentic Commerce',
    'Telegram', 'X @AISUEDE', '3 Android apps', 'Strumly', 'Suede AI SEO', 'suedeai.org', 'suedeai.ai'];
  const ICON_LABEL = { 'suede-sing': 'Suede Sing', null: 'Suede Lens' };
  const RI = [300, 244], RO = [630, 380];
  const at = (a, r) => [CX + r[0] * Math.sin(a), CY - r[1] * Math.cos(a)];
  Film.scene({
    id: 'finale', dur: 13, chrome: false,
    build(root) {
      el('style', '', root, css);
      const floor = el('div', 'floor', root);
      const world = el('div', 'world', root);
      const layer = Film.layer(world, 0);
      const halo = el('div', 'halo', world);
      const orbit = el('div', 'orbit', world);
      const pulses = [0, 1, 2].map(() => el('div', 'pulse', world));
      const hubc = el('div', 'hubc', world);
      // nodes
      const nodes = [];
      const mkLine = (x, y, rStart, rEnd) => {
        const dx = x - CX, dy = y - CY, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
        const x0 = CX + ux * rStart, y0 = CY + uy * rStart, x1 = x - ux * rEnd, y1 = y - uy * rEnd;
        const p = svg('path', { d: `M${x0} ${y0}L${x1} ${y1}`, fill: 'none', stroke: '#3a4670', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, layer);
        const L = Math.hypot(x1 - x0, y1 - y0); p.style.strokeDasharray = L;
        return { p, L, x0, y0, x1, y1 };
      };
      const spokeDir = OUTER.map((_, i) => { const [x, y] = at((i + .5) / OUTER.length * Math.PI * 2, RO); return Math.atan2(y - CY, x - CX); });
      const angDist = (u, v) => { const d = Math.abs(u - v) % (Math.PI * 2); return Math.min(d, Math.PI * 2 - d); };
      let OFFS = 0, best = -1;
      for (let k = 0; k < 120; k++) {
        const off = k / 120 * Math.PI * 2 / ICONS.length;
        let m = 9;
        ICONS.forEach((_, i) => { const [x, y] = at(i / ICONS.length * Math.PI * 2 + off, RI); const d = Math.atan2(y - CY, x - CX); spokeDir.forEach(sd => { m = Math.min(m, angDist(d, sd) * Math.hypot(x - CX, y - CY)); }); });
        if (m > best) { best = m; OFFS = off; }
      }
      ICONS.forEach((ic, i) => {
        const a = i / ICONS.length * Math.PI * 2 + OFFS;
        const [x, y] = at(a, RI);
        const line = mkLine(x, y, 104, 40);
        const n = el('div', 'ico', world, ic ? `<img src="icons/${ic}.jpg">` : LENS);
        n.style.left = x + 'px'; n.style.top = y + 'px';
        const lbl = ICON_LABEL[ic];
        if (lbl) { const l = el('div', 'icl', n.parentNode, lbl); l.style.left = x + 'px'; l.style.top = (y + 42) + 'px'; n._lbl = l; }
        nodes.push({ kind: 'ico', a, el: n, line, x, y });
      });
      OUTER.forEach((lab, i) => {
        const a = (i + .5) / OUTER.length * Math.PI * 2;
        const [x, y] = at(a, RO);
        const line = mkLine(x, y, 104, 10);
        const n = el('div', 'nd', world, `<i></i><span>${lab}</span>`);
        n.style.left = x + 'px'; n.style.top = y + 'px';
        // label sits radially outward from the hub so spokes never cross text
        const sp = n.lastChild, ux = Math.sin(a), uy = -Math.cos(a);
        if (Math.abs(ux) > .8) { sp.style.top = '-12px'; if (ux > 0) sp.style.left = '18px'; else { sp.style.right = '18px'; } }
        else { sp.style.left = '0'; sp.style.transform = 'translateX(-50%)'; sp.style.top = uy < 0 ? '-40px' : '16px'; }
        nodes.push({ kind: 'nd', a, el: n, dot: n.firstChild, lab: n.lastChild, line, x, y });
      });
      // proof packets (diamonds) travel node → hub; ≤3 in flight
      const HOP = 1.2;
      const PK = [[12, 3.9], [20, 4.32], [28, 4.74], [15, 5.16], [24, 5.58], [31, 6.0]].map(([k, s]) => ({ n: nodes[k], s, e: el('div', 'dia', world) }));
      // mark (outside world: it survives the recede and becomes the end-card mark)
      const mk = el('img', 'mk', root); mk.src = '../assets/mark.svg';
      const title = Film.lines(root, 'title', 'The ownership layer|for the <em>AI media era.</em>');
      const em = title.el.querySelector('em');
      const url = el('div', 'url', root, 'suedeai.ai');
      const black = el('div', 'black', root);

      const RC = 7.2; // recede start
      return (t, dur) => {
        root.style.opacity = prog(t, 0, .8);
        black.style.opacity = prog(t, dur - .5, .5, E.inOut);
        // build
        const hp = prog(t, .2, 1.0, E.out);
        hubc.style.opacity = hp; halo.style.opacity = hp * (.75 + .25 * Math.sin(t * Math.PI / 3));
        orbit.style.opacity = hp; orbit.style.transform = `rotate(${t * 4.5}deg)`;
        pulses.forEach((p, i) => {
          const ph = ((t - .6 - i * 1.33) / 4) % 1;
          const on = t > .6 + i * 1.33;
          p.style.opacity = on ? .45 * (1 - ph) : 0;
          p.style.transform = `scale(${.9 + .6 * ph})`;
        });
        const sweep = t < 2.9 ? -9 : prog(t, 2.9, 2.4, E.inOut) * (Math.PI * 2 + 1.2) + .0001;
        let hubGlow = 0;
        nodes.forEach((o) => {
          const frac = o.a / (Math.PI * 2);
          const d0 = (o.kind === 'ico' ? .5 : 1.0) + frac * 1.0;
          const dr = prog(t, d0, .8, E.inOut);
          o.line.p.style.strokeDashoffset = o.line.L * (1 - dr);
          const np = prog(t, d0 + .55, .6, E.out);
          o.el.style.opacity = np;
          if (o.el._lbl) o.el._lbl.style.opacity = np;
          // wave light
          const da = sweep - o.a;
          const lit = da > 0 ? Math.exp(-(da * da) / .18) : 0;
          const visited = da > 0 ? .35 : 0;
          const carry = PK.some(k => k.n === o && t > k.s - .2 && t < k.s + HOP + .1);
          const L = Math.max(lit, carry ? 1 : 0);
          o.line.p.setAttribute('stroke', L > .3 ? '#06cfef' : '#3a4670');
          const base = o.kind === 'ico' ? .8 : .5;
          o.line.p.setAttribute('opacity', L > .3 ? (o.kind === 'ico' ? .45 : .3) + .6 * lit : base);
          if (o.kind === 'ico') {
            o.el.style.transform = `scale(${(.9 + .1 * np) * (1 + .08 * lit)})`;
            o.el.style.boxShadow = lit > .05 ? `0 0 0 ${6 * lit}px rgba(6,207,239,.1),0 0 ${36 * lit}px rgba(6,207,239,${.45 * lit})` : '0 20px 40px -20px rgba(0,0,0,.8)';
            o.el.style.borderColor = lit > .3 ? 'rgba(6,207,239,.6)' : 'var(--hairline-2)';
          } else {
            o.el.style.transform = `translateY(${(1 - np) * 10}px)`;
            const on = lit > .3 || visited > 0;
            o.dot.style.background = on ? '#06cfef' : 'var(--surface)';
            o.dot.style.borderColor = on ? '#06cfef' : 'var(--hairline-2)';
            o.dot.style.boxShadow = lit > .05 ? `0 0 ${16 * lit}px rgba(6,207,239,${.6 * lit})` : 'none';
            o.lab.style.color = lit > .4 ? '#fff' : 'var(--body)';
          }
        });
        // packets
        PK.forEach(({ n, s, e }) => {
          const u = prog(t, s, HOP, E.inOut);
          const on = t > s && t < s + HOP;
          const { x0, y0, x1, y1 } = n.line;
          const sc = clamp(Math.min(u, 1 - u) / .08);
          e.style.left = lerp(x1, x0, u) + 'px'; e.style.top = lerp(y1, y0, u) + 'px';
          e.style.opacity = on ? sc : 0;
          e.style.transform = `rotate(45deg) scale(${sc})`;
          const since = t - (s + HOP);
          if (since > 0 && since < .7) hubGlow = Math.max(hubGlow, 1 - since / .7);
        });
        hubc.style.borderColor = hubGlow > .05 ? 'rgba(6,207,239,.5)' : 'var(--hairline-2)';
        hubc.style.boxShadow = `0 0 0 ${8 * hubGlow}px rgba(6,207,239,.08),0 0 ${44 * hubGlow}px rgba(6,207,239,${.4 * hubGlow}),0 30px 60px -30px rgba(0,0,0,.7)`;
        // recede
        // constellation collapses into the hub; the hub mark carries on as the end-card mark
        const rc = prog(t, RC, 1.0, E.inOut);
        world.style.opacity = 1 - prog(t, RC + .35, .6, E.in);
        world.style.transform = `translateY(${(340 - CY) * prog(t, RC, 1.3, E.inOut)}px) scale(${1 - .9 * rc})`;
        // mark: hub centre → end-card position
        const mp = prog(t, RC, 1.3, E.inOut);
        const size = lerp(120, 112, mp);
        const my = lerp(CY, 340, mp);
        mk.style.opacity = prog(t, .1, .9, E.out);
        mk.style.transform = `translate(${CX - size / 2}px,${my - size / 2}px) scale(${size / 100})`;
        mk.style.transformOrigin = '0 0';
        // end card
        floor.style.opacity = prog(t, RC + .3, 1.4, E.inOut);
        title.set(t, RC + .8, .1);
        const ep = prog(t, RC + 1.1, 1.2);
        em.style.textShadow = `0 0 24px rgba(6,207,239,${.35 * ep * (1 - prog(t, RC + 2.3, 1.2))})`;
        const up = prog(t, RC + 1.5, .8, E.out);
        url.style.opacity = up; url.style.transform = `translateY(${(1 - up) * 8}px)`;
      };
    },
  });
})();
