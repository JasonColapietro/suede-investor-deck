// 04 · Chrome — Part A: Suede Sing side panel over a video page with a live pitch
// meter. Hairline wipe. Part B: Suede Lens audits suedeai.ai and exports a Page Passport.
(function () {
  const { el, svg, prog, clamp, lerp, E } = Film;

  const BW = 1440, BH = 724, BX = 960, BY = 596;       // browser centre
  const VW = BW, VH = BH - 52;                           // viewport
  const PANEL_W = 440;
  const MARK = '<img src="../assets/mark.svg" alt="">';
  const SING = '<img src="icons/suede-sing.jpg" alt="">';
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5l4 4 8-9"/></svg>';

  const css = `
  .scene-chrome .lab{position:absolute;left:${BX - BW / 2}px;top:156px;height:36px;display:flex;align-items:center;gap:16px;
    font:500 20px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--ink);white-space:nowrap}
  .scene-chrome .lab img{width:36px;height:36px;border-radius:8px;display:block}
  .scene-chrome .lab .dim{color:var(--muted)}
  .scene-chrome .browser{border-radius:12px;background:#0b1128}
  .scene-chrome .browser .url{font-size:18px;color:var(--body);gap:12px}
  .scene-chrome .browser .url::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--hairline-2);flex:none}
  .scene-chrome .browser .ext{width:36px;height:36px;border:1px solid transparent}
  .scene-chrome .browser .ext img{width:22px;height:22px;border-radius:5px;display:block}
  .scene-chrome .browser .ext.on{background:var(--accent-soft);box-shadow:none;border-color:rgba(6,207,239,.4)}
  .scene-chrome .vp{position:absolute;inset:0;overflow:hidden}
  .scene-chrome .sk{position:absolute;border-radius:6px;background:#1a2446}
  .scene-chrome .sk.d{background:#141d3b}
  /* page A — video */
  .scene-chrome .vid{position:absolute;left:36px;top:28px;width:916px;height:515px;border-radius:12px;overflow:hidden;background:#070b1a}
  .scene-chrome .vid .lt{position:absolute;border-radius:50%;filter:blur(40px)}
  .scene-chrome .vid .fl{position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(0deg,rgba(7,11,26,.95),transparent)}
  .scene-chrome .vid .bar{position:absolute;left:24px;right:24px;bottom:22px;height:4px;border-radius:2px;background:rgba(255,255,255,.18)}
  .scene-chrome .vid .bar i{position:absolute;left:0;top:0;bottom:0;border-radius:2px;background:var(--ink)}
  .scene-chrome .vid .bar b{position:absolute;top:-5px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:var(--ink)}
  .scene-chrome .vid .play{position:absolute;left:24px;bottom:44px;width:0;height:0;border-left:16px solid #fff;border-top:10px solid transparent;border-bottom:10px solid transparent;opacity:.9}
  .scene-chrome .vid .mic{position:absolute;left:50%;top:44%;width:120px;height:120px;margin:-60px;border-radius:50%;
    border:1px solid rgba(255,255,255,.14)}
  /* side panel */
  .scene-chrome .panel{position:absolute;top:0;right:0;bottom:0;width:${PANEL_W}px;background:#111a36;border-left:1px solid var(--hairline-2);
    box-shadow:-40px 0 80px -40px rgba(0,0,0,.8);padding:0 28px}
  .scene-chrome .panel .ph{height:68px;display:flex;align-items:center;gap:14px;border-bottom:1px solid var(--hairline)}
  .scene-chrome .panel .ph img{width:34px;height:34px;border-radius:8px;display:block}
  .scene-chrome .panel .ph .t{font:600 22px/1 var(--sans);color:var(--ink);flex:1}
  .scene-chrome .panel .ph .x{font:400 24px/1 var(--sans);color:var(--muted)}
  .scene-chrome .panel .tabs{display:flex;gap:26px;height:54px;align-items:flex-end;border-bottom:1px solid var(--hairline)}
  .scene-chrome .panel .tabs span{font:500 18px/1 var(--sans);color:var(--muted);padding-bottom:16px;position:relative}
  .scene-chrome .panel .tabs span.on{color:var(--ink)}
  .scene-chrome .panel .tabs span.on::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent)}
  .scene-chrome .panel .note{text-align:center;margin-top:26px}
  .scene-chrome .panel .note .n{font:400 124px/.9 var(--serif);color:var(--ink);letter-spacing:-.02em}
  .scene-chrome .panel .note .hz{font:500 22px/1 var(--mono);color:var(--body);margin-top:14px;letter-spacing:.04em}
  .scene-chrome .panel .gauge{position:relative;height:150px;margin-top:18px}
  .scene-chrome .panel .gauge svg{position:absolute;left:0;top:0}
  .scene-chrome .panel .rd{display:flex;justify-content:space-between;align-items:center;margin-top:-6px}
  .scene-chrome .panel .rd .c{font:500 22px/1 var(--mono);color:var(--ink);font-variant-numeric:tabular-nums}
  .scene-chrome .chip{display:inline-flex;align-items:center;gap:9px;font:500 18px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;
    color:var(--muted);border:1px solid var(--hairline-2);border-radius:999px;padding:8px 13px}
  .scene-chrome .chip::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--hairline-2)}
  .scene-chrome .chip.on{color:var(--accent);background:var(--accent-soft);border-color:rgba(6,207,239,.4)}
  .scene-chrome .chip.on::before{background:var(--accent)}
  .scene-chrome .panel .trace{position:relative;height:120px;margin-top:22px;border-radius:10px;background:#0b1128;border:1px solid var(--hairline);overflow:hidden}
  /* page B — suedeai.ai */
  .scene-chrome .pb{background:radial-gradient(90% 90% at 90% 0%,#12234f 0%,#0c1127 55%,#080c1d 100%)}
  .scene-chrome .pb .nav{position:absolute;left:56px;right:56px;top:28px;height:40px;display:flex;align-items:center;gap:14px;
    font:500 17px/1 var(--mono);letter-spacing:.18em;color:var(--ink)}
  .scene-chrome .pb .nav img{width:30px;height:30px}
  .scene-chrome .pb .hero{position:absolute;left:56px;top:150px;font:400 76px/1 var(--serif);letter-spacing:-.015em;color:var(--ink)}
  .scene-chrome .pb .hero em{font-style:italic;color:var(--accent)}
  .scene-chrome .pb .scan{position:absolute;left:0;width:${VW - 420}px;height:90px;margin-top:-90px;
    background:linear-gradient(180deg,transparent,rgba(6,207,239,.07));border-bottom:1px solid rgba(6,207,239,.55)}
  .scene-chrome .pb .scrim{position:absolute;inset:0;background:rgba(8,12,29,.74)}
  .scene-chrome .wipe{position:absolute;top:0;bottom:0;width:1px;background:var(--accent);box-shadow:0 0 16px 2px var(--accent-glow)}
  /* popup */
  .scene-chrome .pop{position:absolute;top:14px;right:14px;width:410px;border-radius:12px;padding:22px 24px 24px;
    background:rgba(22,31,60,.97);border:1px solid var(--hairline-2);box-shadow:0 40px 80px -30px rgba(0,0,0,.9),0 0 0 1px rgba(0,0,0,.4);transform-origin:92% 0}
  .scene-chrome .pop::before{content:"";position:absolute;top:-7px;right:24px;width:12px;height:12px;transform:rotate(45deg);
    background:#161f3c;border-left:1px solid var(--hairline-2);border-top:1px solid var(--hairline-2)}
  .scene-chrome .pop .hd{display:flex;align-items:center;gap:12px;padding-bottom:18px;border-bottom:1px solid var(--hairline)}
  .scene-chrome .pop .hd img{width:30px;height:30px;display:block}
  .scene-chrome .pop .hd .t{font:600 22px/1 var(--sans);color:var(--ink);flex:1}
  .scene-chrome .pop .hd .v{font:500 18px/1 var(--mono);color:var(--muted);letter-spacing:.06em}
  .scene-chrome .pop .au{display:flex;justify-content:space-between;align-items:baseline;padding:18px 0 6px}
  .scene-chrome .pop .au .k{font:500 18px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
  .scene-chrome .pop .au .u{font:500 18px/1 var(--mono);color:var(--ink)}
  .scene-chrome .pop .row{display:flex;align-items:center;gap:14px;height:58px;border-bottom:1px solid var(--hairline)}
  .scene-chrome .pop .row .ix{font:500 18px/1 var(--mono);color:var(--muted);width:24px}
  .scene-chrome .pop .row .l{font:500 20px/1 var(--sans);color:var(--body);flex:1}
  .scene-chrome .pop .row .st{position:relative;width:28px;height:28px}
  .scene-chrome .pop .row .st svg{position:absolute;inset:0}
  .scene-chrome .pop .row .ok{position:absolute;inset:0;border-radius:50%;background:var(--accent);color:var(--on-fill,#0c1127);display:grid;place-items:center}
  .scene-chrome .pop .row .ok svg{position:static;width:18px;height:18px}
  .scene-chrome .pop .prog{height:3px;border-radius:2px;background:var(--hairline);margin-top:20px;overflow:hidden}
  .scene-chrome .pop .prog i{display:block;height:100%;background:var(--accent);transform-origin:0 50%}
  .scene-chrome .pop .cta{margin-top:20px;height:54px;border-radius:8px;background:#fff;color:#0c1127;display:flex;align-items:center;justify-content:center;
    font:600 20px/1 var(--sans);box-shadow:0 20px 40px -16px rgba(6,207,239,.5)}
  /* passport */
  .scene-chrome .pass{position:absolute;left:0;top:0;width:560px;border-radius:12px;padding:30px 32px 32px;
    background:linear-gradient(160deg,rgba(6,207,239,.14),rgba(6,207,239,0) 60%),#161f3c;border:1px solid rgba(6,207,239,.4);
    box-shadow:0 0 0 8px rgba(6,207,239,.06),0 0 60px -10px rgba(6,207,239,.3),0 50px 100px -40px rgba(0,0,0,.95);transform-origin:0 0}
  .scene-chrome .pass .top{display:flex;justify-content:space-between;align-items:center}
  .scene-chrome .pass .eb{font:500 18px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--accent)}
  .scene-chrome .pass .top img{width:40px;height:40px;display:block}
  .scene-chrome .pass .dom{font:400 56px/1 var(--serif);letter-spacing:-.015em;color:var(--ink);margin-top:22px}
  .scene-chrome .pass .by{font:500 18px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:14px}
  .scene-chrome .pass .grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--hairline);border:1px solid var(--hairline);border-radius:12px;overflow:hidden;margin-top:26px}
  .scene-chrome .pass .grid div{background:#141c38;height:64px;display:flex;align-items:center;gap:12px;padding:0 18px;font:500 20px/1 var(--sans);color:var(--ink)}
  .scene-chrome .pass .grid i{width:22px;height:22px;border-radius:50%;background:var(--accent);color:#0c1127;display:grid;place-items:center;flex:none}
  .scene-chrome .pass .grid i svg{width:14px;height:14px}
  `;
  function styleOnce() {
    if (document.getElementById('st-chrome')) return;
    const s = el('style', '', document.head); s.id = 'st-chrome'; s.textContent = css;
  }

  Film.scene({
    id: 'chrome', dur: 13, chapter: ['03', 'Chrome'],
    build(root) {
      styleOnce();
      // labels (swap at the wipe)
      const labA = el('div', 'lab', root, `${SING}<span>Suede Sing <span class="dim">· Chrome Web Store</span></span>`);
      const labB = el('div', 'lab', root, `${MARK}<span>Suede Lens <span class="dim">· v1.0</span></span>`);

      const br = Film.browser(root, { x: BX, y: BY, w: BW, h: BH, url: 'youtube.com/watch' });
      const extSing = el('div', 'ext', null, SING);
      br.ext.parentNode.insertBefore(extSing, br.ext);
      br.ext.innerHTML = MARK;
      const urlText = document.createTextNode('youtube.com/watch');
      br.url.textContent = ''; br.url.appendChild(urlText);

      // ---------- page A
      const A = el('div', 'vp', br.body);
      const vid = el('div', 'vid', A);
      const lights = [
        { c: 'rgba(18,60,140,.9)', s: 520, x: .3, y: .35 },
        { c: 'rgba(6,207,239,.22)', s: 360, x: .62, y: .3 },
        { c: 'rgba(58,70,112,.8)', s: 420, x: .75, y: .7 },
      ].map(l => { const d = el('div', 'lt', vid); Object.assign(d.style, { width: l.s + 'px', height: l.s + 'px', background: l.c }); return { d, ...l }; });
      el('div', 'fl', vid);
      el('div', 'play', vid);
      const vbar = el('div', 'bar', vid, '<i></i><b></b>');
      const vfill = vbar.querySelector('i'), vknob = vbar.querySelector('b');
      // title + meta skeletons
      const skA = [[36, 564, 560, 22], [36, 598, 360, 14, 'd'], [36, 624, 32, 32], [80, 628, 220, 12, 'd'], [80, 646, 140, 10, 'd']];
      skA.forEach(([x, y, w, h, d]) => { const s = el('div', 'sk' + (d ? ' d' : ''), A); Object.assign(s.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }); if (w === h) s.style.borderRadius = '50%'; });
      // recommendations column (gets covered by the panel)
      for (let i = 0; i < 5; i++) {
        const y = 28 + i * 124;
        [[1004, y, 190, 106], [1210, y + 8, 200, 16], [1210, y + 36, 150, 12, 'd'], [1210, y + 58, 110, 12, 'd']].forEach(([x, yy, w, h, d]) => {
          const s = el('div', 'sk' + (d ? ' d' : ''), A); Object.assign(s.style, { left: x + 'px', top: yy + 'px', width: w + 'px', height: h + 'px' });
        });
      }

      // side panel
      const panel = el('div', 'panel', A);
      el('div', 'ph', panel, `${SING}<span class="t">Suede Sing</span><span class="x">×</span>`);
      el('div', 'tabs', panel, '<span>Tuner</span><span>Range</span><span>Warmups</span><span class="on">Sing-along</span>');
      el('div', 'note', panel, '<div class="n">A4</div><div class="hz">440 Hz</div>');
      // gauge
      const GW = PANEL_W - 56, GH = 150, gcx = GW / 2, gcy = 140, R = 124;
      const gauge = el('div', 'gauge', panel);
      const gs = svg('svg', { width: GW, height: GH, viewBox: `0 0 ${GW} ${GH}` }, gauge);
      const ang = c => (-90 + c * 1.6) * Math.PI / 180;       // ±50¢ → ±80°
      const pt = (c, r) => [gcx + r * Math.cos(ang(c)), gcy + r * Math.sin(ang(c))];
      const arcD = (c0, c1, r) => { const [x0, y0] = pt(c0, r), [x1, y1] = pt(c1, r); return `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}`; };
      svg('path', { d: arcD(-50, 50, R), fill: 'none', stroke: 'var(--hairline)', 'stroke-width': 2 }, gs);
      const zone = svg('path', { d: arcD(-5, 5, R), fill: 'none', stroke: 'var(--accent)', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: .35 }, gs);
      for (let c = -50; c <= 50; c += 5) {
        const major = c % 25 === 0;
        const [x0, y0] = pt(c, R - (major ? 22 : 12)), [x1, y1] = pt(c, R - 4);
        svg('line', { x1: x0, y1: y0, x2: x1, y2: y1, stroke: major ? 'var(--body)' : 'var(--hairline-2)', 'stroke-width': major ? 2 : 1.25, 'stroke-linecap': 'round' }, gs);
      }
      const needle = svg('line', { x1: gcx, y1: gcy, x2: gcx, y2: gcy - R + 6, stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }, gs);
      svg('circle', { cx: gcx, cy: gcy, r: 7, fill: '#fff' }, gs);
      const rd = el('div', 'rd', panel, '<span class="c">0 ¢</span><span class="chip">In tune</span>');
      const cents = rd.querySelector('.c'), chipT = rd.querySelector('.chip');
      // sing-along trace
      const trace = el('div', 'trace', panel);
      const TW = PANEL_W - 58, TH = 118;
      const ts = svg('svg', { width: TW, height: TH, viewBox: `0 0 ${TW} ${TH}` }, trace);
      const notesG = svg('g', {}, ts);
      const MEL = [0, 0, 2, 4, 2, 0, -1, 0, 2, 2, 4, 5, 4, 2, 0, 0];   // semitone steps (target line)
      const NW = 64, noteY = s => TH / 2 - s * 8;
      const notes = MEL.map((s, i) => svg('rect', { x: i * NW, y: noteY(s) - 5, width: NW - 6, height: 10, rx: 5, fill: 'rgba(58,70,112,.9)' }, notesG));
      const live = svg('path', { d: '', fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ts);
      const PHX = TW * .62;
      svg('line', { x1: PHX, x2: PHX, y1: 8, y2: TH - 8, stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1 }, ts);
      const head = svg('circle', { cx: PHX, cy: TH / 2, r: 5, fill: '#fff' }, ts);

      // ---------- page B
      const B = el('div', 'vp pb', br.body);
      el('div', 'nav', B, `${MARK}<span>SUEDE AI</span>`);
      el('div', 'hero', B, 'The ownership layer<br>for the <em>AI media era.</em>');
      [[56, 348, 520, 16], [56, 378, 440, 16], [56, 438, 190, 52], [262, 438, 190, 52, 'd'],
        [56, 540, 280, 120, 'd'], [352, 540, 280, 120, 'd'], [648, 540, 280, 120, 'd']].forEach(([x, y, w, h, d]) => {
        const s = el('div', 'sk' + (d ? ' d' : ''), B); Object.assign(s.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
        if (h === 52) s.style.borderRadius = '8px';
        if (h === 120) s.style.borderRadius = '12px';
      });
      const scan = el('div', 'scan', B);
      const scrim = el('div', 'scrim', B);
      const pop = el('div', 'pop', B);
      el('div', 'hd', pop, `${MARK}<span class="t">Suede Lens</span><span class="v">v1.0</span>`);
      el('div', 'au', pop, '<span class="k">Auditing</span><span class="u">suedeai.ai</span>');
      const CHECKS = ['Rights', 'Provenance', 'JSON-LD', 'AI-search signals'];
      const rows = CHECKS.map((c, i) => {
        const r = el('div', 'row', pop, `<span class="ix">0${i + 1}</span><span class="l">${c}</span><span class="st"></span>`);
        const st = r.querySelector('.st');
        const sp = svg('svg', { viewBox: '0 0 28 28' }, st);
        svg('circle', { cx: 14, cy: 14, r: 11, fill: 'none', stroke: 'var(--hairline-2)', 'stroke-width': 2 }, sp);
        const arc = svg('circle', { cx: 14, cy: 14, r: 11, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-dasharray': '17 52' }, sp);
        arc.style.transformOrigin = '14px 14px';
        const ok = el('div', 'ok', st, CHECK);
        return { r, l: r.querySelector('.l'), sp, arc, ok };
      });
      const pbar = el('div', 'prog', pop, '<i></i>').firstChild;
      const cta = el('div', 'cta', pop, 'Export Page Passport');
      const pass = el('div', 'pass', B, `<div class="top"><span class="eb">Page Passport</span>${MARK}</div>
        <div class="dom">suedeai.ai</div><div class="by">Issued by Suede Lens · v1.0</div>
        <div class="grid">${CHECKS.map(c => `<div><i>${CHECK}</i>${c}</div>`).join('')}</div>`);
      const wipe = el('div', 'wipe', br.body);

      const CT = [7.75, 8.3, 8.85, 9.4];   // check completion times
      const PASS_AT = { x: 220, y: 142 };

      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .6, .8);
        br.set(prog(t, .1, 1.2, E.out));

        // labels
        const pw = prog(t, 6.15, .75, E.inOut);                 // wipe progress
        const la = prog(t, .6, .45), lx = prog(t, 6.1, .35, E.in), lb = prog(t, 6.45, .45);
        labA.style.opacity = la * (1 - lx);
        labA.style.transform = `translateY(${(1 - la) * 8 - lx * 8}px)`;
        labB.style.opacity = lb;
        labB.style.transform = `translateY(${(1 - lb) * 8}px)`;

        // wipe (reveal page B from the left)
        const X = pw * VW;
        A.style.clipPath = `inset(0 0 0 ${X}px)`;
        B.style.clipPath = `inset(0 ${VW - X}px 0 0)`;
        B.style.visibility = pw > 0 ? 'visible' : 'hidden';
        wipe.style.left = X + 'px';
        wipe.style.opacity = pw > 0 && pw < 1 ? 1 : 0;
        urlText.textContent = pw < .5 ? 'youtube.com/watch' : 'suedeai.ai';
        extSing.classList.toggle('on', t > 1.3 && pw < .5);
        br.ext.classList.toggle('on', t > 6.95);

        // ---------- A: video + panel
        lights.forEach((l, i) => {
          const x = l.x * 916 + 60 * Math.sin(t * .35 + i * 2.1) - l.s / 2;
          const y = l.y * 515 + 30 * Math.cos(t * .28 + i * 1.3) - l.s / 2;
          l.d.style.transform = `translate(${x}px,${y}px)`;
        });
        const vp = .31 + t * .012;
        vfill.style.width = vp * 100 + '%'; vknob.style.left = vp * 100 + '%';
        const pp = prog(t, 1.35, .9, E.out);
        panel.style.transform = `translateX(${(1 - pp) * (PANEL_W + 40)}px)`;
        // cents: settles from sharp, then a small natural wobble
        const d = Math.max(0, t - 2.1);
        const c = 34 * Math.exp(-d / .85) * Math.cos(d * 3.1) + 2.2 * Math.sin(t * 4.3) + 1.3 * Math.sin(t * 7.9 + 1);
        needle.setAttribute('transform', `rotate(${c * 1.6} ${gcx} ${gcy})`);
        const cr = Math.round(c);
        cents.textContent = (cr > 0 ? '+' : cr < 0 ? '−' : '') + Math.abs(cr) + ' ¢';
        const inTune = Math.abs(c) < 5 && d > 1.2;
        chipT.classList.toggle('on', inTune);
        chipT.textContent = inTune ? 'In tune' : (c > 0 ? 'Sharp' : 'Flat');
        zone.setAttribute('opacity', inTune ? .9 : .35);
        // trace: notes scroll left under a fixed playhead; the live pitch follows the target
        const scroll = (t - 1.6) * 70;
        notesG.setAttribute('transform', `translate(${PHX - scroll - 40},0)`);
        const pts = [];
        for (let k = 0; k <= 40; k++) {
          const x = PHX - k * 6;
          const s = scroll + 40 - (PHX - x);           // position along the melody (px)
          if (s < 0 || t < 2.0 + k * 6 / 70) break;
          const ni = Math.min(MEL.length - 1, Math.max(0, Math.floor(s / NW)));
          const tt = t - k * 6 / 70;
          const err = 14 * Math.exp(-Math.max(0, tt - 2.1) / .85) * Math.cos(tt * 3.1) + 1.2 * Math.sin(tt * 4.3);
          pts.push([x, noteY(MEL[ni]) - err * .5]);
        }
        live.setAttribute('d', pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(''));
        if (pts.length) { head.setAttribute('cy', pts[0][1]); head.setAttribute('opacity', 1); } else head.setAttribute('opacity', 0);

        // ---------- B: Lens popup, audit, passport
        const po = prog(t, 7.0, .45, E.brand);
        pop.style.opacity = po;
        pop.style.transform = `translateY(${(1 - po) * -8}px) scale(${.96 + .04 * po})`;
        const sy = prog(t, 7.25, 2.3, E.inOut);
        scan.style.top = lerp(0, VH + 90, sy) + 'px';
        scan.style.opacity = sy > 0 && sy < 1 ? 1 : 0;
        let done = 0;
        rows.forEach((r, i) => {
          const start = CT[i] - .55;
          const running = t >= start && t < CT[i];
          const ok = t >= CT[i];
          if (ok) done++;
          r.sp.style.opacity = ok ? 0 : (running ? 1 : .5);
          r.arc.style.opacity = running ? 1 : 0;
          r.arc.style.transform = `rotate(${t * 540}deg)`;
          const pk = prog(t, CT[i], .2, E.brand);
          r.ok.style.opacity = pk;
          r.ok.style.transform = `scale(${.6 + .4 * pk})`;
          r.l.style.color = ok || running ? 'var(--ink)' : 'var(--body)';
        });
        pbar.style.transform = `scaleX(${clamp((t - (CT[0] - .55)) / (CT[3] - CT[0] + .55))})`;
        const ready = prog(t, 9.45, .3);
        const press = prog(t, 9.8, .12) - prog(t, 9.95, .2);
        cta.style.opacity = .45 + .55 * ready;
        cta.style.transform = `scale(${1 - .03 * press})`;
        // passport flies out of the CTA to the page
        const pf = prog(t, 10.0, 1.0, E.out);
        const popRect = { x: VW - 14 - 410 + 24, y: 14 + 470 };
        const px = lerp(popRect.x, PASS_AT.x, pf), py = lerp(popRect.y, PASS_AT.y, pf);
        pass.style.opacity = clamp(pf * 2.2);
        pass.style.transform = `translate(${px}px,${py}px) scale(${lerp(.72, 1, pf)})`;
        scrim.style.opacity = prog(t, 10.0, .6) * 1;
      };
    },
  });
})();
