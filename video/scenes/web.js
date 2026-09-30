// Scene 5 · Web — app.suedeai.ai: Create → IP Registry proof → Distro release → Agent Studio publishes an x402 endpoint.
(function () {
  const { el, svg, prog, clamp, lerp, E } = Film;
  const css = `
.scene-web .col{position:absolute;left:120px;top:176px;width:460px}
.scene-web .stack{position:relative;font-family:var(--serif);font-size:88px;line-height:1.04;letter-spacing:-.015em}
.scene-web .w{position:relative;display:block;height:1.04em;overflow:hidden}
.scene-web .w span{position:absolute;left:0;top:0;white-space:nowrap}
.scene-web .w .off{color:var(--ink)}
.scene-web .w .on{font-style:italic;color:var(--accent)}
.scene-web .sub{position:absolute;left:120px;top:604px;width:420px;font-size:28px;line-height:1.45;color:var(--body)}
.scene-web .sub span{position:absolute;left:0;top:0}
.scene-web .sub b{color:var(--ink);font-weight:600}
.scene-web .browser .url{font-size:18px;color:var(--body);gap:10px;position:relative}
.scene-web .browser .url::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--accent)}
.scene-web .browser .url span{position:absolute;left:34px;top:50%;transform:translateY(-50%)}
.scene-web .app,.scene-web .studio{position:absolute;inset:0;background:radial-gradient(110% 80% at 100% 0%,#12234f 0%,#0c1127 55%,#080c1d 100%)}
.scene-web .nav{position:absolute;left:0;top:0;bottom:0;width:216px;padding:28px 20px;border-right:1px solid var(--hairline);background:rgba(8,12,29,.55)}
.scene-web .nav .br{display:flex;align-items:center;gap:12px;font-family:var(--mono);font-weight:500;font-size:18px;letter-spacing:.18em;margin:0 0 32px 8px}
.scene-web .nav .ni{height:44px;display:flex;align-items:center;padding:0 14px;border-radius:8px;font-size:20px;color:var(--muted);margin-bottom:4px}
.scene-web .nav .ni.on{background:var(--accent-soft);color:var(--ink)}
.scene-web .main{position:absolute;left:216px;right:0;top:0;bottom:0;padding:32px}
.scene-web .prompt{height:68px;border-radius:12px;background:var(--ground-deep);border:1px solid var(--hairline-2);display:flex;align-items:center;padding:0 12px 0 22px;gap:16px}
.scene-web .prompt .tx{flex:1;font-size:22px;color:var(--ink);white-space:nowrap;overflow:hidden}
.scene-web .prompt .ph{color:var(--muted)}
.scene-web .caret{display:inline-block;width:2px;height:26px;background:var(--accent);vertical-align:-5px;margin-left:2px}
.scene-web .btn{height:46px;padding:0 22px;border-radius:8px;background:#fff;color:var(--ground);font-weight:600;font-size:20px;display:flex;align-items:center}
.scene-web .grid{position:absolute;left:32px;right:32px;top:124px;bottom:32px}
.scene-web .cd{position:absolute;border-radius:12px;background:var(--surface);border:1px solid var(--hairline);box-shadow:0 30px 60px -30px rgba(0,0,0,.7);padding:22px 24px}
.scene-web .cd.hot{border-color:rgba(6,207,239,.4);background:var(--surface-2)}
.scene-web .hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
.scene-web .tag{font-family:var(--mono);font-size:18px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.scene-web .cd.hot .tag.k{color:var(--accent)}
.scene-web .ttl{font-size:26px;font-weight:600;letter-spacing:-.01em}
.scene-web .wave{position:relative;height:96px;display:flex;align-items:center;gap:3px;margin:20px 0 26px}
.scene-web .wave i{flex:1;border-radius:2px;background:var(--hairline-2)}
.scene-web .stem{display:flex;align-items:center;gap:14px;height:52px;border-top:1px solid var(--hairline)}
.scene-web .stem b{width:96px;font-weight:500;font-size:20px;color:var(--body)}
.scene-web .stem .sw{flex:1;height:18px;display:flex;align-items:center;gap:2px}
.scene-web .stem .sw i{flex:1;border-radius:1px;background:var(--hairline-2)}
.scene-web .row{display:flex;align-items:center;justify-content:space-between;height:46px;border-top:1px solid var(--hairline)}
.scene-web .row .v{font-family:var(--mono);font-size:20px;color:var(--ink)}
.scene-web .row .s{font-size:20px;color:var(--ink);display:flex;align-items:center;gap:8px}
.scene-web .av{display:flex}.scene-web .av i{width:28px;height:28px;border-radius:50%;border:2px solid var(--surface-2);margin-left:-8px}
.scene-web .chips{display:flex;gap:10px;margin-top:16px}
.scene-web .chip{display:inline-flex;align-items:center;gap:10px;height:34px;padding:0 14px;border-radius:999px;border:1px solid var(--hairline-2);font-family:var(--mono);font-size:18px;color:var(--body);white-space:nowrap}
.scene-web .chip::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--muted)}
.scene-web .chip.cy{border-color:rgba(6,207,239,.4);background:var(--accent-soft);color:var(--accent)}
.scene-web .chip.cy::before{background:var(--accent)}
.scene-web .dia{position:absolute;width:14px;height:14px;border-radius:2px;background:var(--accent);box-shadow:0 0 14px var(--accent-glow);transform:rotate(45deg)}
.scene-web .bar{height:6px;border-radius:3px;background:var(--hairline);overflow:hidden;margin-top:14px}
.scene-web .bar i{display:block;height:100%;background:linear-gradient(90deg,var(--accent),#7ce9fa);transform-origin:0 50%}
/* Agent Studio canvas */
.scene-web .studio{background-color:#0a0f24;background-image:radial-gradient(rgba(58,70,112,.55) 1.2px,transparent 1.4px);background-size:28px 28px}
.scene-web .shd{position:absolute;left:0;right:0;top:0;height:84px;display:flex;align-items:center;gap:16px;padding:0 32px;border-bottom:1px solid var(--hairline);background:rgba(8,12,29,.8)}
.scene-web .shd .t{font-size:26px;font-weight:600;letter-spacing:-.01em}
.scene-web .shd .btn{margin-left:auto}
.scene-web .fn{position:absolute;width:236px;padding:20px 22px;border-radius:12px;background:var(--surface);border:1px solid var(--hairline-2);box-shadow:0 30px 60px -30px rgba(0,0,0,.8)}
.scene-web .fn .n{font-size:24px;font-weight:600;margin-top:10px;white-space:nowrap}
.scene-web .fn.hot{border-color:rgba(6,207,239,.4);background:var(--surface-2)}
.scene-web .ep{position:absolute;display:flex;align-items:center;gap:14px;height:56px;padding:0 22px;border-radius:999px;border:1px solid rgba(6,207,239,.4);background:var(--accent-soft);
  font-family:var(--mono);font-size:20px;color:var(--accent);white-space:nowrap;box-shadow:0 0 0 8px rgba(6,207,239,.06),0 0 44px rgba(6,207,239,.3)}
.scene-web .ep i{width:9px;height:9px;border-radius:50%;background:var(--accent)}
.scene-web .ep b{font-weight:400;color:var(--body)}
`;
  const WORDS = ['Create.', 'Prove.', 'Release.', 'Publish.'];
  const SUBS = [
    '<b>app.suedeai.ai</b> turns a prompt into music and stems.',
    '<b>IP Registry</b> fingerprints the file and records a wallet-signed claim.',
    '<b>Suede AI Distro</b> handles release and distribution.',
    '<b>Agent Studio</b> publishes agent flows as x402 pay-per-call endpoints.',
  ];
  Film.scene({
    id: 'web', dur: 13, chapter: ['04', 'Web'],
    build(root) {
      el('style', '', root, css);
      // ---------- left column: stage words + one line of context ----------
      const col = el('div', 'col', root);
      const stack = el('div', 'stack', col);
      const words = WORDS.map(w => { const m = el('div', 'w', stack); return { off: el('span', 'off', m, w), on: el('span', 'on', m, w) }; });
      const sub = el('div', 'sub', root);
      const subs = SUBS.map(s => el('span', '', sub, s));

      // ---------- browser ----------
      const B = Film.browser(root, { x: 1230, y: 560, w: 1140, h: 720, url: '' });
      const u1 = el('span', '', B.url, 'app.suedeai.ai'), u2 = el('span', '', B.url, 'agents.suedeai.ai');
      const app = el('div', 'app', B.body);
      const nav = el('div', 'nav', app);
      el('div', 'br', nav, `<img src="../assets/mark.svg" width="28" height="28"><span>SUEDE AI</span>`);
      ['Create', 'Rewards', 'Developers', 'ERC-8004'].forEach((n, i) => el('div', 'ni' + (i ? '' : ' on'), nav, n));
      const main = el('div', 'main', app);
      const prompt = el('div', 'prompt', main);
      const ptx = el('div', 'tx', prompt);
      const btn = el('div', 'btn', prompt, 'Create');
      const grid = el('div', 'grid', main);

      // Track card (Create)
      const track = el('div', 'cd', grid); Object.assign(track.style, { left: 0, top: 0, width: '440px', height: '512px' });
      el('div', 'hd', track, `<span class="tag k">Track</span><span class="tag">Music · Stems</span>`);
      el('div', 'ttl', track, 'Rainy Night');
      const wave = el('div', 'wave', track);
      const r = Film.rand(51);
      const bars = [];
      for (let i = 0; i < 56; i++) {
        const env = Math.sin(Math.PI * (i + .5) / 56) ** .6;
        const h = 14 + 74 * env * (.45 + .55 * Math.abs(Math.sin(i * .77) * .6 + r() * .4));
        const b = el('i', '', wave); b.style.height = h + 'px'; bars.push(b);
      }
      el('div', 'tag', track, 'Stems').style.marginBottom = '10px';
      const stems = ['Vocals', 'Guitar', 'Drums', 'Bass'].map((n, k) => {
        const s = el('div', 'stem', track, `<b>${n}</b>`);
        const sw = el('div', 'sw', s);
        const rr = Film.rand(90 + k);
        for (let i = 0; i < 40; i++) { const b = el('i', '', sw); b.style.height = (3 + 15 * rr() * (k === 2 ? (i % 4 === 0 ? 1 : .35) : .8)) + 'px'; }
        return s;
      });

      // Proof card (IP Registry)
      const proof = el('div', 'cd', grid); Object.assign(proof.style, { left: '464px', top: 0, width: '396px', height: '320px' });
      el('div', 'hd', proof, `<span class="tag k">IP Registry</span><span class="tag" style="letter-spacing:.04em;text-transform:none">ip.suedeai.ai</span>`);
      const pRows = [
        ['Fingerprint', `<span class="v fp"></span>`],
        ['Claim', `<span class="s"><svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9.5l4 4 8-9" fill="none" stroke="#06cfef" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>Wallet-signed</span>`],
        ['Contributors', `<span class="av"><i style="background:#5b6796"></i><i style="background:#8a94b8"></i><i style="background:#b4bcd6"></i></span>`],
        ['Timestamp', `<span class="v">2026-09-30</span>`],
      ].map(([k, v]) => el('div', 'row', proof, `<span class="tag">${k}</span>${v}`));
      const fp = proof.querySelector('.fp');
      const pChips = el('div', 'chips', proof, `<span class="chip cy">Base</span><span class="chip cy">Avalanche</span>`);

      // Distro card
      const distro = el('div', 'cd', grid); Object.assign(distro.style, { left: '464px', top: '344px', width: '396px', height: '168px' });
      el('div', 'hd', distro, `<span class="tag k">Suede AI Distro</span><span class="tag">Release</span>`);
      const dRow = el('div', '', distro); dRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between';
      el('div', 'ttl', dRow, 'Rainy Night').style.fontSize = '24px';
      const dStat = el('span', 'chip', dRow, 'Ready');
      const dBar = el('div', 'bar', distro, '<i></i>').firstChild;
      const dMeta = el('div', '', distro, `<span class="tag">Distribution</span><span class="tag dp">0%</span>`);
      dMeta.style.cssText = 'display:flex;justify-content:space-between;margin-top:16px';
      const dPct = dMeta.querySelector('.dp');
      const dia = el('div', 'dia', grid);

      // ---------- Agent Studio canvas ----------
      const studio = el('div', 'studio', B.body);
      const shd = el('div', 'shd', studio, `<img src="../assets/mark.svg" width="32" height="32"><span class="t">Agent Studio</span><span class="tag" style="margin-left:8px">Flow · draft</span>`);
      const pub = el('div', 'btn', shd, 'Publish');
      const FN = [['Input', 'Prompt'], ['Suede', 'Create music'], ['Output', 'track.mp3']];
      const fx = [72, 432, 792], fy = 250;
      const flayer = svg('svg', { width: 1140, height: 668, viewBox: '0 0 1140 668' }, studio);
      flayer.style.cssText = 'position:absolute;inset:0';
      const flines = [0, 1].map(i => {
        const x0 = fx[i] + 236, x1 = fx[i + 1], y = fy + 52;
        const p = svg('path', { d: `M${x0} ${y}L${x1} ${y}`, stroke: '#3a4670', 'stroke-width': 1.5, fill: 'none' }, flayer);
        p.style.strokeDasharray = x1 - x0; return { p, L: x1 - x0 };
      });
      // endpoint drop line from the Output node down to the published endpoint
      const dropL = svg('path', { d: `M${fx[1] + 118} ${fy + 106}L${fx[1] + 118} ${fy + 196}`, stroke: '#06cfef', 'stroke-width': 1.5, fill: 'none', opacity: .7 }, flayer);
      dropL.style.strokeDasharray = 90;
      const fns = FN.map(([k, n], i) => { const f = el('div', 'fn', studio, `<div class="tag">${k}</div><div class="n">${n}</div>`); f.style.left = fx[i] + 'px'; f.style.top = fy + 'px'; return f; });
      const ep = el('div', 'ep', studio, `<i></i>x402 endpoint <b>· pay-per-call · USDC on Base</b>`);
      ep.style.left = (fx[1] + 118) + 'px'; ep.style.top = (fy + 196) + 'px';

      const PROMPT = 'warm lo-fi guitar, rainy night';
      const HASH = '7f3a…c91e';
      const T0 = 0, T1 = 4.4, T2 = 6.9, T3 = 9.1; // Create · Prove · Release · Publish

      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .8, .8);
        const TS = [T0, T1, T2, T3];
        // headline words: past = ink, current = italic cyan, future = dim
        words.forEach((w, i) => {
          const p = prog(t, .5 + i * .09, .9, E.out);
          const y = (1 - p) * 105;
          w.off.style.transform = w.on.style.transform = `translateY(${y}%)`;
          const inA = i === 0 ? prog(t, .5, .45) : prog(t, TS[i], .45);
          const outA = i < 3 ? prog(t, TS[i + 1], .45) : 0;
          const act = inA * (1 - outA);
          w.off.style.opacity = clamp(p * 1.4) * (1 - act) * lerp(.26, 1, outA);
          w.on.style.opacity = clamp(p * 1.4) * act;
        });
        subs.forEach((s, i) => {
          const a = i === 0 ? 1.2 : TS[i] + .15, b = i < 3 ? TS[i + 1] - .1 : 99;
          const pin = prog(t, a, .6, E.out), pout = prog(t, b, .3, E.in);
          s.style.opacity = pin * (1 - pout);
          s.style.transform = `translateY(${(1 - pin) * 12 - pout * 8}px)`;
        });
        // headline swap: left column exits before the next scene's headline rises
        const hx = prog(t, dur - 1.2, .4, E.in);
        col.style.opacity = sub.style.opacity = 1 - hx;
        col.style.transform = sub.style.transform = `translateY(${-hx * 20}px)`;
        // browser enter (after headline) + gentle drift
        const bp = prog(t, .95, 1.2, E.out);
        B.set(bp);
        B.el.style.transform += ` scale(${1 + .012 * prog(t, 0, dur, E.inOut)})`;

        // ---- Create
        const typ = clamp((t - 1.5) / (PROMPT.length * .034));
        const n = Math.round(PROMPT.length * typ);
        const caretOn = t > 1.1 && t < 3.0 && (typ > 0 && typ < 1 || Math.floor(t * 2.4) % 2 === 0);
        ptx.innerHTML = (n ? PROMPT.slice(0, n) : '<span class="ph">Describe a track…</span>') + (caretOn ? '<span class="caret"></span>' : '');
        const press = prog(t, 2.75, .12) * (1 - prog(t, 2.95, .2));
        btn.style.transform = `scale(${1 - .05 * press})`;
        const tp = prog(t, 2.9, .7, E.out);
        track.style.opacity = tp * lerp(1, .5, prog(t, T1 + .3, .5));
        track.style.transform = `translateY(${(1 - tp) * 20}px)`;
        track.classList.toggle('hot', t > 3.0 && t < T1 + .4);
        const head = .38 * prog(t, 3.4, 1.0, E.inOut); // playhead: lit portion stays ≤ 40%
        bars.forEach((b, i) => {
          const p = prog(t, 3.1 + i * .016, .45, E.out);
          b.style.transform = `scaleY(${.06 + .94 * p})`;
          b.style.background = (i / 56 < head && t < T1 + .3) ? '#06cfef' : '#3a4670';
        });
        stems.forEach((s, i) => { const p = prog(t, 3.5 + i * .09, .6); s.style.opacity = p; s.style.transform = `translateY(${(1 - p) * 10}px)`; });

        // ---- Prove
        const dp = prog(t, T1 - .1, 1.0, E.inOut);
        const x0 = 440 - 7, y0 = 150, x1 = 464 + 24, y1 = 24 + 11;
        dia.style.left = lerp(x0, x1, dp) + 'px'; dia.style.top = (lerp(y0, y1, dp) - Math.sin(Math.PI * dp) * 40) + 'px';
        dia.style.opacity = (t > T1 - .1 ? clamp(dp * 10) : 0) * (1 - prog(t, T1 + .85, .2));
        const pp = prog(t, T1 + .2, .8, E.out);
        proof.style.opacity = pp * lerp(1, .55, prog(t, T2 + .3, .5));
        proof.style.transform = `translateY(${(1 - pp) * 20}px) scale(${.98 + .02 * pp})`;
        proof.classList.toggle('hot', t > T1 + .7 && t < T2 + .4);
        pRows.forEach((rw, i) => { const p = prog(t, T1 + .6 + i * .09, .5); rw.style.opacity = p; rw.style.transform = `translateY(${(1 - p) * 8}px)`; });
        const hp = clamp((t - (T1 + .7)) / .45);
        fp.textContent = HASH.slice(0, Math.round(HASH.length * hp)) || ' ';
        const cp = prog(t, T1 + 1.2, .5); pChips.style.opacity = cp; pChips.style.transform = `translateY(${(1 - cp) * 8}px)`;

        // ---- Release
        const rp = prog(t, T2, .8, E.out);
        distro.style.opacity = rp;
        distro.style.transform = `translateY(${(1 - rp) * 20}px) scale(${.98 + .02 * rp})`;
        distro.classList.toggle('hot', t > T2 + .3);
        const bpr = prog(t, T2 + .5, 1.1, E.inOut);
        dBar.style.transform = `scaleX(${bpr})`;
        dPct.textContent = Math.round(bpr * 100) + '%';
        const done = t > T2 + 1.6;
        dStat.textContent = done ? 'Released' : 'Ready';
        dStat.classList.toggle('cy', done);

        // ---- Publish: URL + body cross-fade to Agent Studio canvas
        const sw = prog(t, T3, .5, E.inOut);
        u1.style.opacity = 1 - sw; u2.style.opacity = sw;
        app.style.opacity = 1 - sw;
        studio.style.opacity = sw;
        fns.forEach((f, i) => {
          const p = prog(t, T3 + .35 + i * .09, .7, E.out);
          f.style.opacity = p; f.style.transform = `translateY(${(1 - p) * 16}px)`;
          f.classList.toggle('hot', t > T3 + 1.0 + i * .35 && t < T3 + 1.5 + i * .35);
        });
        flines.forEach((l, i) => {
          const d = prog(t, T3 + .8 + i * .35, .5, E.inOut);
          l.p.style.strokeDashoffset = l.L * (1 - d);
          l.p.setAttribute('stroke', t > T3 + 1.3 + i * .35 ? '#06cfef' : '#3a4670');
        });
        const pb = prog(t, T3 + 1.85, .12) * (1 - prog(t, 2 + T3, .2));
        pub.style.transform = `scale(${1 - .05 * pb})`;
        pub.style.boxShadow = `0 20px 40px -16px rgba(6,207,239,${.5 * prog(t, T3 + 1.7, .3)})`;
        dropL.style.strokeDashoffset = 90 * (1 - prog(t, T3 + 2.0, .45, E.inOut));
        const ee = prog(t, T3 + 2.35, .7, E.out);
        ep.style.opacity = ee; ep.style.transform = `translate(-50%,0) translateY(${(1 - ee) * 12}px) scale(${.96 + .04 * ee})`;
      };
    },
  });
})();
