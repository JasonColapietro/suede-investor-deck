// Scene 8 · Value — three streams converge into one Suede account; partner row.
(function () {
  const { el, svg, prog, clamp, lerp, E } = Film;
  const MONO = 'filter:brightness(0) invert(1);opacity:.7';
  const css = `
.scene-economy .hl{position:absolute;left:120px;top:168px;font-family:var(--serif);font-size:64px;line-height:1.05;letter-spacing:-.015em;white-space:nowrap}
.scene-economy .hl em{font-style:italic;color:var(--accent)}
.scene-economy .src{position:absolute;left:120px;width:420px;height:128px;margin-top:-64px;display:flex;align-items:center;gap:20px;padding:0 24px;border-radius:12px;
  background:var(--surface);border:1px solid var(--hairline);box-shadow:0 30px 60px -30px rgba(0,0,0,.7)}
.scene-economy .src.hot{border-color:rgba(6,207,239,.4);background:var(--surface-2)}
.scene-economy .src .ic{width:56px;height:56px;border-radius:12px;flex:none;background:var(--ground);border:1px solid var(--hairline-2);display:grid;place-items:center;
  font-family:var(--mono);font-weight:600;font-size:18px;color:var(--ink);letter-spacing:.02em}
.scene-economy .src .tag{font-family:var(--mono);font-size:18px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
.scene-economy .src .n{font-size:28px;font-weight:600;letter-spacing:-.01em;margin-top:6px;white-space:nowrap}
.scene-economy .src .m{font-family:var(--mono);font-size:18px;color:var(--body);margin-top:6px;white-space:nowrap}
.scene-economy .port{position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:var(--surface);border:1px solid var(--hairline-2)}
.scene-economy .hub{position:absolute;width:176px;height:176px;margin:-88px 0 0 -88px;border-radius:50%;background:var(--ground);border:1px solid var(--hairline-2);
  display:grid;place-items:center;box-shadow:0 30px 60px -30px rgba(0,0,0,.7)}
.scene-economy .halo{position:absolute;width:420px;height:420px;margin:-210px 0 0 -210px;border-radius:50%;background:radial-gradient(circle,rgba(6,207,239,.2),transparent 65%);filter:blur(20px)}
.scene-economy .hring{position:absolute;width:176px;height:176px;margin:-88px 0 0 -88px;border-radius:50%;border:1px solid var(--accent)}
.scene-economy .orbit{position:absolute;width:260px;height:260px;margin:-130px 0 0 -130px;border-radius:50%;border:1px dashed rgba(42,51,84,.9)}
.scene-economy .hlab{position:absolute;transform:translateX(-50%);text-align:center;white-space:nowrap}
.scene-economy .hlab .n{font-size:30px;font-weight:600;letter-spacing:-.01em}
.scene-economy .hlab .m{font-family:var(--mono);font-size:18px;letter-spacing:.06em;color:var(--muted);margin-top:10px}
.scene-economy .pay{position:absolute;width:60px;height:6px;margin:-3px 0 0 -30px;border-radius:3px;background:radial-gradient(closest-side,#fff,var(--accent),transparent)}
.scene-economy .partners{position:absolute;left:120px;top:808px;width:1680px}
.scene-economy .partners .label{display:flex;align-items:center;gap:16px;margin-bottom:22px;font-weight:500;letter-spacing:.16em}
.scene-economy .partners .label::after{content:"";flex:1;height:1px;background:var(--hairline)}
.scene-economy .row{display:grid;grid-template-columns:repeat(8,1fr);gap:1px;background:var(--hairline);border:1px solid var(--hairline);border-radius:12px;overflow:hidden}
.scene-economy .cell{height:88px;background:var(--surface);display:flex;align-items:center;justify-content:center;gap:12px;font-size:20px;font-weight:500;color:var(--body);white-space:nowrap}
.scene-economy .cell img{width:30px;height:30px;object-fit:contain}
`;
  const SRC = [
    ['People', 'Stripe credits', 'credits for humans & agents', `<img src="../assets/partners/stripe.svg" width="28" height="28" style="${MONO}">`],
    ['Agents', 'x402 USDC', 'pay-per-call on Base', 'x402'],
    ['Holders · Solana', '$SUEDE rewards', 'app.suedeai.ai/rewards', `<img src="../assets/mark.svg" width="56" height="56" style="border-radius:12px">`],
  ];
  const PARTNERS = [
    ['Base', 'mono/base.png', 1], ['Stripe', 'stripe.svg'], ['Chainlink', 'chainlink.svg'], ['LayerZero', 'mono/layerzero.png', 1],
    ['Virtuals', 'mono/virtuals.png', 1], ['AgentCash', 'mono/agentcash.png', 1], ['Google Cloud', 'google-cloud.svg'], ['ChainGPT', 'chaingpt.svg'],
  ];
  Film.scene({
    id: 'economy', dur: 10, chapter: ['07', 'Value'],
    build(root) {
      el('style', '', root, css);
      const hl = Film.lines(root, 'hl', 'Every stream, <em>one account.</em>');
      const HX = 1480, HY = 500, HR = 88;
      const YS = [340, 500, 660];
      const layer = Film.layer(root, 0);
      const paths = YS.map(y => {
        const d = `M540 ${y} C 900 ${y}, 1040 ${HY + (y - HY) * .25}, ${HX - HR - 6} ${HY + (y - HY) * .12}`;
        const glow = svg('path', { d, fill: 'none', stroke: '#06cfef', 'stroke-width': 6, opacity: 0, style: 'filter:blur(4px)' }, layer);
        const p = svg('path', { d, fill: 'none', stroke: '#3a4670', 'stroke-width': 1.5, 'stroke-linecap': 'round' }, layer);
        const L = p.getTotalLength();
        p.style.strokeDasharray = glow.style.strokeDasharray = L;
        return { p, glow, L };
      });
      const srcs = SRC.map(([tag, n, m, ic], i) => {
        const s = el('div', 'src', root); s.style.top = YS[i] + 'px';
        el('div', 'ic', s, ic);
        el('div', '', s, `<div class="tag">${tag}</div><div class="n">${n}</div><div class="m">${m}</div>`);
        const port = el('div', 'port', root); port.style.left = '540px'; port.style.top = YS[i] + 'px';
        return { s, port };
      });
      const hubG = el('div', '', root); hubG.style.cssText = 'position:absolute;inset:0;transform-origin:' + HX + 'px ' + HY + 'px';
      const halo = el('div', 'halo', hubG); halo.style.left = HX + 'px'; halo.style.top = HY + 'px';
      const orbit = el('div', 'orbit', hubG); orbit.style.left = HX + 'px'; orbit.style.top = HY + 'px';
      const rings = [0, 1, 2].map(() => { const r = el('div', 'hring', hubG); r.style.left = HX + 'px'; r.style.top = HY + 'px'; return r; });
      const hub = el('div', 'hub', hubG, `<img src="../assets/mark.svg" width="106" height="106">`);
      hub.style.left = HX + 'px'; hub.style.top = HY + 'px';
      const hlab = el('div', 'hlab', root, `<div class="n">One Suede account</div><div class="m">app.suedeai.ai</div>`);
      hlab.style.left = HX + 'px'; hlab.style.top = (HY + 156) + 'px';
      // payment packets: 3 per stream, staggered so ≤3 are in flight
      const HOP = 1.4;
      const sched = [];
      for (let k = 0; k < 2; k++) for (let i = 0; i < 3; i++) sched.push({ i, a: 2.5 + k * 1.5 + i * .5 });
      const packets = sched.map(() => el('div', 'pay', root));
      const partners = el('div', 'partners', root);
      const plab = el('div', 'label', partners, 'Partners');
      const row = el('div', 'row', partners);
      const cells = PARTNERS.map(([n, f]) => el('div', 'cell', row, `<img src="../assets/partners/${f}" style="${f.startsWith('mono') ? 'opacity:.85' : MONO}">${n}`));

      const GL = 8.1; // hub glides to finale's hub position (960,540) at its size
      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .8, .8);
        hl.set(t, .5);
        const ex = prog(t, GL - .3, .6, E.in); // everything but the hub exits
        hl.out(prog(t, dur - 1.2, .4, E.in));
        const dimAll = lerp(1, .6, prog(t, 5.4, .6)) * (1 - ex);
        const g = prog(t, GL, 1.1, E.inOut);
        hubG.style.transform = `translate(${(960 - HX) * g}px,${(540 - HY) * g}px) scale(${1 + (200 / 176 - 1) * g})`;
        srcs.forEach((o, i) => {
          const p = prog(t, .6 + i * .09, .9, E.out);
          o.s.style.opacity = p * dimAll; o.s.style.transform = `translateY(${(1 - p) * 20}px)`;
          o.port.style.opacity = prog(t, 1.2, .3) * dimAll;
          o.s.classList.toggle('hot', sched.some(s => s.i === i && t > s.a - .3 && t < s.a + .25));
        });
        paths.forEach((o, i) => {
          const d = prog(t, 1.3 + i * .12, 1.4, E.inOut);
          o.p.style.strokeDashoffset = o.L * (1 - d);
          o.glow.style.strokeDashoffset = o.L * (1 - d);
          // a curve lights only while its own pill is travelling
          let live = 0;
          sched.forEach(s => { if (s.i === i) live = Math.max(live, prog(t, s.a - .15, .2) * (1 - prog(t, s.a + HOP, .3))); });
          o.p.setAttribute('stroke', live > .5 ? '#06cfef' : '#3a4670');
          o.p.setAttribute('opacity', (live > .5 ? .7 : 1) * dimAll);
          o.glow.setAttribute('opacity', .2 * live * dimAll);
        });
        const hp = prog(t, .9, 1.0, E.out);
        hub.style.opacity = hp; hub.style.transform = `scale(${.92 + .08 * hp})`;
        orbit.style.opacity = hp * .9; orbit.style.transform = `rotate(${t * 4.5}deg)`;
        const hlp = prog(t, 1.3, .8, E.out);
        hlab.style.opacity = hlp * (1 - prog(t, GL - .4, .4, E.in)); hlab.style.transform = `translateX(-50%) translateY(${(1 - hlp) * 12}px)`;
        // packets
        let glowHub = 0;
        packets.forEach((pk, k) => {
          const { i, a } = sched[k];
          const u = prog(t, a, HOP, E.inOut);
          const on = t > a && t < a + HOP;
          const o = paths[i];
          const pt = o.p.getPointAtLength(u * o.L), pt2 = o.p.getPointAtLength(Math.min(o.L, u * o.L + 1));
          const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
          const sc = clamp(Math.min(u, 1 - u) / .08);
          pk.style.left = pt.x + 'px'; pk.style.top = pt.y + 'px';
          pk.style.opacity = on ? sc : 0;
          pk.style.transform = `rotate(${ang}deg) scale(${sc})`;
          const since = t - (a + HOP);
          if (since > 0 && since < .7) glowHub = Math.max(glowHub, 1 - since / .7);
        });
        hub.style.borderColor = glowHub > .05 ? 'rgba(6,207,239,.5)' : 'var(--hairline-2)';
        hub.style.boxShadow = `0 0 0 ${8 * glowHub}px rgba(6,207,239,.08),0 0 ${44 * glowHub}px rgba(6,207,239,${.4 * glowHub}),0 30px 60px -30px rgba(0,0,0,.7)`;
        halo.style.opacity = hp * (.55 + .45 * clamp(prog(t, 2.6, 4)));
        // one ping ring per arrival (use the 3 ring elements round-robin)
        rings.forEach((r, j) => {
          let best = -1;
          sched.forEach((s, k) => { if (k % 3 === j) { const d = t - (s.a + HOP); if (d >= 0 && d < .7) best = d; } });
          const q = best < 0 ? 1 : best / .7;
          r.style.opacity = best < 0 ? 0 : .55 * (1 - q);
          r.style.transform = `scale(${1 + .16 * q * 1.2})`;
        });
        // partners
        const pl = prog(t, 5.4, .45);
        plab.style.opacity = pl * (1 - ex);
        const rp = prog(t, 5.4, .8, E.out);
        row.style.opacity = rp * (1 - ex); row.style.transform = `translateY(${(1 - rp) * 16 + ex * 12}px)`;
        cells.forEach((c, i) => { const p = prog(t, 5.55 + i * .06, .6); c.style.opacity = .15 + .85 * p; });
      };
    },
  });
})();
