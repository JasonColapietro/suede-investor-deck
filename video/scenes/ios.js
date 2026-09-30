// 03 · iOS — nine real app icons land into the creator-journey grid; three of them
// fly down to become the labels of three rebuilt, in-brand phone screens; the icons
// regroup into the closing line "9 iOS apps · +3 on Android".
(function () {
  const { el, svg, prog, clamp, lerp, E } = Film;

  const APPS = {
    tuner: { name: 'Suede Guitar Tuner &amp; Studio', img: 'suede-guitar-tuner-studio', line: 'Polyphonic strobe tuner &amp; session capture' },
    voice: { name: 'Suede Voice', img: 'suede-voice', line: 'Vocal range test &amp; warmups' },
    fret: { name: 'FretPulse', img: 'fretpulse', line: 'Guitar practice with <span style="white-space:nowrap">real-time</span> notation' },
    hub: { name: 'GuitarHub', img: 'guitarhub', line: '21 guided beginner lessons' },
    muse: { name: 'Suede Studio Muse', img: 'suede-studio-muse', line: 'Nightly songwriting prompts' },
    gen: { name: 'Suede AI Generator', img: 'suede-ai-generator', line: 'AI music ideas &amp; saved creative records' },
    social: { name: 'Suede Social', img: 'suede-social', line: 'Guitar community forum' },
    studio: { name: 'Suede Agent Studio', img: 'suede-agent-studio', line: 'Track agents &amp; their earnings' },
    agentix: { name: 'Agentix', img: 'agentix', line: 'AI agent portfolio dashboard' },
  };
  const GROUPS = [
    ['Practice', ['tuner', 'voice', 'fret', 'hub']],
    ['Write', ['muse']],
    ['Make', ['gen']],
    ['Share', ['social']],
    ['Agents', ['studio', 'agentix']],
  ];
  const ANDROID = ['Suede: AI Music Generator', 'Suede: Guitar Forum &amp; Gear', 'Suede AI Agents: Directory'];

  // --- layout
  const IS = 128, GAP_IN = 32, GAP_GRP = 80, ROW_Y = 492;
  const order = [];            // flat list of {key, gi, j, x (centre)}
  {
    let x = 160;
    GROUPS.forEach(([, keys], gi) => {
      keys.forEach((k, j) => { order.push({ key: k, gi, j, x: x + IS / 2 }); x += IS + (j < keys.length - 1 ? GAP_IN : 0); });
      x += GAP_GRP;
    });
  }
  const FEAT = [{ key: 'tuner', x: 540 }, { key: 'muse', x: 960 }, { key: 'studio', x: 1380 }];
  const PH_Y = 472, PH_SCALE = .97, LBL_ICON_Y = 821, LBL_ICON = 48;
  const MINI = 64, MINI_GAP = 18, MINI_Y = 420;
  const miniX = (i) => 960 - (9 * MINI + 8 * MINI_GAP) / 2 + MINI / 2 + i * (MINI + MINI_GAP);

  const css = `
  .scene-ios .ico{position:absolute;left:0;top:0;width:${IS}px;height:${IS}px;border-radius:22.5%;overflow:hidden;transform-origin:0 0;
    box-shadow:0 24px 48px -22px rgba(0,0,0,.85)}
  .scene-ios .ico img{display:block;width:100%;height:100%}
  .scene-ios .ico::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.1)}
  .scene-ios .grp{position:absolute;top:${ROW_Y - IS / 2 - 76}px;height:40px}
  .scene-ios .grp .gl{font:500 20px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--muted);white-space:nowrap}
  .scene-ios .grp .rule{position:absolute;left:0;right:0;top:34px;height:1px;background:var(--hairline-2);transform-origin:0 50%}
  .scene-ios .grp .rule i{position:absolute;inset:0;background:var(--accent);transform-origin:0 50%;transform:scaleX(0)}
  .scene-ios .nm{position:absolute;top:${ROW_Y + IS / 2 + 24}px;width:156px;margin-left:-78px;text-align:center;
    font:500 20px/1.3 var(--sans);color:var(--body);text-wrap:balance}
  .scene-ios .ol{position:absolute;top:${ROW_Y + IS / 2 + 24 + 66}px;width:156px;margin-left:-78px;text-align:center;
    font:400 18px/1.35 var(--sans);color:var(--muted);text-wrap:balance}
  .scene-ios .phone{box-shadow:0 0 0 1.5px #4a5680,0 40px 90px -30px rgba(0,0,0,.85)}
  .scene-ios .phone.hero{box-shadow:0 0 0 1.5px #4a5680,0 40px 90px -30px rgba(0,0,0,.85),0 0 90px -40px var(--accent-glow)}
  .scene-ios .phone .scr{background:radial-gradient(120% 70% at 100% 0%,#12234f 0%,#0c1127 55%,#080c1d 100%)}
  .scene-ios .lbl{position:absolute;top:${LBL_ICON_Y + LBL_ICON / 2 + 14}px;width:400px;margin-left:-200px;text-align:center}
  .scene-ios .lbl .n{font:600 24px/1.2 var(--sans);color:var(--ink);letter-spacing:-.01em}
  .scene-ios .lbl .l{font:400 20px/1.35 var(--sans);color:var(--body);margin-top:6px}
  /* screens (UI inside devices; small type is texture, key readouts are large) */
  .scene-ios .s{position:absolute;inset:58px 20px 26px;display:flex;flex-direction:column}
  .scene-ios .s .hd{display:flex;align-items:center;justify-content:space-between;font:600 17px/1 var(--sans);color:var(--ink);padding:6px 2px 14px}
  .scene-ios .s .chip{font:500 11px/1 var(--mono);letter-spacing:.14em;text-transform:uppercase;color:var(--accent);
    background:var(--accent-soft);border:1px solid rgba(6,207,239,.4);border-radius:999px;padding:6px 9px}
  .scene-ios .s .k{font:500 11px/1 var(--mono);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
  .scene-ios .s .cardx{border-radius:12px;background:linear-gradient(180deg,var(--surface-2),var(--surface));border:1px solid var(--hairline);padding:14px}
  /* tuner */
  .scene-ios .tn .big{display:flex;align-items:baseline;gap:6px;margin-top:6px}
  .scene-ios .tn .big b{font:400 64px/1 var(--serif);color:var(--ink);font-variant-numeric:tabular-nums}
  .scene-ios .tn .big span{font:400 30px/1 var(--serif);color:var(--muted)}
  .scene-ios .tn .rows{display:flex;flex-direction:column;gap:9px;margin-top:18px}
  .scene-ios .tn .row{display:flex;align-items:center;gap:10px;height:32px}
  .scene-ios .tn .row .nt{width:18px;font:500 15px/1 var(--mono);color:var(--body);text-align:center}
  .scene-ios .tn .band{position:relative;flex:1;height:100%;border-radius:7px;overflow:hidden;background:#0a1026;border:1px solid var(--hairline)}
  .scene-ios .tn .band i{position:absolute;top:0;bottom:0;left:-40px;right:-40px;
    background:repeating-linear-gradient(90deg,rgba(180,188,214,.42) 0 5px,transparent 5px 13px)}
  .scene-ios .tn .band.ok i{background:repeating-linear-gradient(90deg,rgba(6,207,239,.4) 0 5px,transparent 5px 13px)}
  .scene-ios .tn .dot{width:9px;height:9px;border-radius:50%;background:var(--hairline-2)}
  .scene-ios .tn .ok .dot,.scene-ios .tn .row.ok .dot{background:var(--accent);box-shadow:0 0 8px var(--accent-glow)}
  .scene-ios .tn .caphd{margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding-bottom:12px;border-top:1px solid var(--hairline);padding-top:14px}
  .scene-ios .tn .caphd .tm{font:500 13px/1 var(--mono);color:var(--body);font-variant-numeric:tabular-nums}
  .scene-ios .tn .cap{display:flex;align-items:center;gap:10px}
  .scene-ios .tn .rec{width:30px;height:30px;border-radius:50%;border:1.5px solid var(--body);display:grid;place-items:center}
  .scene-ios .tn .rec::after{content:"";width:12px;height:12px;border-radius:50%;background:var(--ink)}
  .scene-ios .tn .wv{flex:1;height:30px;display:flex;align-items:center;gap:2px}
  .scene-ios .tn .wv i{flex:1;border-radius:1px;background:var(--hairline-2)}
  /* muse */
  .scene-ios .mu .q{font:400 27px/1.18 var(--serif);color:var(--ink);margin-top:12px}
  .scene-ios .mu .q em{font-style:italic;color:var(--accent)}
  .scene-ios .mu .q .line-mask{padding-bottom:.08em}
  .scene-ios .mu .tags{display:flex;gap:6px;margin-top:14px}
  .scene-ios .mu .tags span{font:500 11px/1 var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--body);border:1px solid var(--hairline-2);border-radius:999px;padding:6px 9px}
  .scene-ios .mu .pad{margin-top:14px;display:flex;flex-direction:column;gap:14px;padding:16px 14px}
  .scene-ios .mu .pad i{display:block;height:8px;border-radius:4px;background:var(--hairline-2);transform-origin:0 50%}
  .scene-ios .mu .caret{width:2px;height:16px;background:var(--accent);margin-top:-4px}
  .scene-ios .mu .ft{display:flex;align-items:center;gap:8px;margin-top:auto;padding-bottom:4px;font:500 12px/1 var(--mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
  /* agent studio */
  .scene-ios .ag .ch{position:relative;height:196px;margin-top:10px}
  .scene-ios .ag .rows{display:flex;flex-direction:column;gap:8px;margin-top:14px}
  .scene-ios .ag .ar{display:flex;align-items:center;gap:10px;padding:11px 12px;border-radius:10px;background:rgba(22,31,60,.8);border:1px solid var(--hairline)}
  .scene-ios .ag .ar .d{width:8px;height:8px;border-radius:50%;background:var(--accent)}
  .scene-ios .ag .ar .an{flex:1;font:500 14px/1 var(--sans);color:var(--ink)}
  .scene-ios .ag .ar .tg{font:500 11px/1 var(--mono);letter-spacing:.08em;color:var(--muted)}
  .scene-ios .ag .ar svg{display:block}
  /* closing */
  .scene-ios .close{position:absolute;left:0;right:0;top:${MINI_Y + MINI / 2 + 56}px;text-align:center}
  .scene-ios .close .h{font:400 96px/1 var(--serif);letter-spacing:-.015em;color:var(--ink)}
  .scene-ios .close .h .line-mask{padding-bottom:.12em}
  .scene-ios .close .h .dim{color:var(--hairline-2)}
  .scene-ios .close .h .sec{color:var(--body)}
  .scene-ios .close .and{display:inline-flex;align-items:center;gap:22px;margin-top:34px;font:500 20px/1 var(--mono);letter-spacing:.06em;color:var(--body)}
  .scene-ios .close .and .t{letter-spacing:.16em;text-transform:uppercase;color:var(--muted)}
  .scene-ios .close .and b{width:4px;height:4px;border-radius:50%;background:var(--hairline-2)}
  `;
  function styleOnce() {
    if (document.getElementById('st-ios')) return;
    const s = el('style', '', document.head); s.id = 'st-ios'; s.textContent = css;
  }

  function tunerScreen(scr) {
    const s = el('div', 's tn', scr);
    el('div', 'hd', s, '<span>Tuner &amp; Studio</span><span class="chip">Strobe</span>');
    el('div', 'k', s, 'Polyphonic');
    const big = el('div', 'big', s, '<b>0</b><span>/ 6</span>');
    el('div', 'k', s, 'Strings in tune').style.marginTop = '8px';
    const rowsWrap = el('div', 'rows', s);
    const rows = ['E', 'A', 'D', 'G', 'B', 'E'].map(n => {
      const r = el('div', 'row', rowsWrap, `<span class="nt">${n}</span><div class="band"><i></i></div><span class="dot"></span>`);
      return { r, band: r.querySelector('.band'), stripes: r.querySelector('.band i') };
    });
    const capHd = el('div', 'caphd', s, '<span class="k">Session capture</span><span class="tm">00:00</span>');
    const tm = capHd.querySelector('.tm');
    const cap = el('div', 'cap', s, '<span class="rec"></span>');
    const wv = el('div', 'wv', cap);
    const rnd = Film.rand(11);
    const bars = Array.from({ length: 36 }, () => { const b = el('i', '', wv); b._h = .25 + .75 * rnd(); return b; });
    const T0 = 7.3;
    const taus = [.45, .95, .6, 1.25, .75, 1.05];
    const amp = [30, -24, 36, -20, 28, -34];
    return (t) => {
      let n = 0;
      rows.forEach((row, i) => {
        const d = Math.max(0, t - T0), tau = taus[i];
        // phase = ∫ speed; speed decays to zero as the string comes into tune
        const ph = amp[i] * tau * 6 * (1 - Math.exp(-d / tau)) + (t < T0 ? amp[i] * .8 * (t - T0) : 0);
        row.stripes.style.transform = `translateX(${((ph % 13) + 13) % 13}px)`;
        const ok = d > tau * 3.2;
        if (ok) n++;
        row.r.classList.toggle('ok', ok);
        row.band.classList.toggle('ok', ok);
      });
      big.firstChild.textContent = n;
      const secs = Math.max(0, Math.floor((t - 8.2) * 1));
      tm.textContent = '00:' + String(Math.min(59, secs)).padStart(2, '0');
      bars.forEach((b, i) => {
        const on = i / bars.length < prog(t, 8.2, 3.2, E.linear);
        b.style.height = (on ? b._h * 28 : 3) + 'px';
        b.style.background = on ? 'var(--body)' : 'var(--hairline-2)';
      });
    };
  }

  function museScreen(scr) {
    const s = el('div', 's mu', scr);
    el('div', 'hd', s, '<span>Studio Muse</span><span class="chip">Tonight</span>');
    const card = el('div', 'cardx', s);
    el('div', 'k', card, 'Tonight’s prompt');
    const q = Film.lines(card, 'q', 'Write the chorus|you’d sing on the|<em>drive home.</em>');
    el('div', 'tags', s, '<span>Chorus</span><span>Minor key</span><span>Night</span>');
    const pad = el('div', 'cardx pad', s);
    const widths = [.92, .78, .86, .64, .9, .74, .82, .4];
    const lines = widths.map(w => { const i = el('i', '', pad); i.style.width = w * 100 + '%'; return i; });
    el('div', 'ft', s, '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/></svg>New prompt nightly');
    return (t) => {
      q.set(t, 7.7, .1, .9);
      let last = 0;
      lines.forEach((l, i) => {
        const p = prog(t, 8.6 + i * .36, .5, E.inOut);
        l.style.transform = `scaleX(${p})`;
        l.style.opacity = p > 0 ? 1 : 0;
        if (p > 0) last = i;
      });
    };
  }

  function studioScreen(scr) {
    const s = el('div', 's ag', scr);
    el('div', 'hd', s, '<span>Agent Studio</span><span class="chip">Live</span>');
    const card = el('div', 'cardx', s);
    el('div', 'k', card, 'Earnings · USDC on Base');
    const chW = 196, chH = 186;
    const ch = el('div', 'ch', card);
    const sv = svg('svg', { width: chW, height: chH, viewBox: `0 0 ${chW} ${chH}` }, ch);
    for (let i = 1; i < 4; i++) svg('line', { x1: 0, x2: chW, y1: i * chH / 4, y2: i * chH / 4, stroke: 'rgba(42,51,84,.8)', 'stroke-width': 1 }, sv);
    const rnd = Film.rand(7);
    const pts = []; let v = .14;
    for (let i = 0; i <= 12; i++) { v += .035 + .06 * rnd(); pts.push([i * chW / 12, chH - 8 - Math.min(v, .95) * (chH - 16) * (i === 12 ? 1 : 1)]); }
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
    const defs = svg('defs', {}, sv);
    const lg = svg('linearGradient', { id: 'agfill', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    svg('stop', { offset: 0, 'stop-color': '#06cfef', 'stop-opacity': .28 }, lg);
    svg('stop', { offset: 1, 'stop-color': '#06cfef', 'stop-opacity': 0 }, lg);
    const area = svg('path', { d: d + `L${chW} ${chH}L0 ${chH}Z`, fill: 'url(#agfill)' }, sv);
    const line = svg('path', { d, fill: 'none', stroke: '#06cfef', 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, sv);
    const L = line.getTotalLength(); line.style.strokeDasharray = `${L} ${L}`;
    const end = svg('circle', { cx: pts[12][0], cy: pts[12][1], r: 4, fill: '#fff' }, sv);
    const ping = svg('circle', { cx: pts[12][0], cy: pts[12][1], r: 4, fill: 'none', stroke: '#06cfef', 'stroke-width': 1.5 }, sv);
    const rows = el('div', 'rows', s);
    const ar = ['Music agent', 'Image agent', 'Video agent'].map((n, i) => {
      const r = el('div', 'ar', rows, `<span class="d"></span><span class="an">${n}</span><span class="tg">x402</span>`);
      return r;
    });
    return (t) => {
      const p = prog(t, 7.9, 1.8, E.inOut);
      line.style.strokeDashoffset = L * (1 - p);
      area.setAttribute('opacity', prog(t, 8.9, 1.0));
      end.setAttribute('opacity', p > .98 ? 1 : 0);
      const q = ((t - 9.8) % 2.4 + 2.4) % 2.4 / 2.4;
      ping.setAttribute('r', 4 + 10 * E.brand(q));
      ping.setAttribute('opacity', t > 9.8 ? .55 * (1 - q) : 0);
      ar.forEach((r, i) => Film.rise(r, prog(t, 8.3 + i * .09, .9), 14));
    };
  }

  Film.scene({
    id: 'ios', dur: 16, chapter: ['02', 'iOS apps'],
    build(root) {
      styleOnce();
      // group labels + rules
      const grps = GROUPS.map(([label, keys], gi) => {
        const items = order.filter(o => o.gi === gi);
        const x0 = items[0].x - IS / 2, x1 = items[items.length - 1].x + IS / 2;
        const g = el('div', 'grp', root, `<div class="gl">${label}</div><div class="rule"><i></i></div>`);
        g.style.left = x0 + 'px'; g.style.width = (x1 - x0) + 'px';
        return { g, gl: g.querySelector('.gl'), rule: g.querySelector('.rule'), fill: g.querySelector('.rule i') };
      });
      const names = order.map(o => { const n = el('div', 'nm', root, APPS[o.key].name); n.style.left = o.x + 'px'; return n; });
      const olines = order.map(o => { const n = el('div', 'ol', root, APPS[o.key].line); n.style.left = o.x + 'px'; return n; });

      // phones (built before icons so icons fly over them)
      const phones = FEAT.map((f, i) => {
        const ph = Film.phone(root, { x: f.x, y: PH_Y, scale: PH_SCALE });
        if (i === 1) ph.el.classList.add('hero');
        ph.screen.style.padding = '0';
        const upd = [tunerScreen, museScreen, studioScreen][i](ph.screen);
        const lbl = el('div', 'lbl', root, `<div class="n">${APPS[f.key].name}</div><div class="l">${APPS[f.key].line}</div>`);
        lbl.style.left = f.x + 'px';
        return { ph, upd, lbl, x: f.x };
      });
      // centre phone on top
      root.appendChild(phones[1].ph.el);

      const icons = order.map(o => {
        const d = el('div', 'ico', root, `<img src="icons/${APPS[o.key].img}.jpg" alt="">`);
        return d;
      });

      const close = el('div', 'close', root);
      const head = Film.lines(close, 'h', '9 iOS apps <span class="dim">·</span> <span class="sec">+3 on Android</span>');
      const and = el('div', 'and', close, '<span class="t">Android</span>' + ANDROID.map(a => `<b></b><span>${a}</span>`).join(''));

      const placeIcon = (d, cx, cy, size, op) => {
        d.style.transform = `translate(${cx - size / 2}px,${cy - size / 2}px) scale(${size / IS})`;
        d.style.opacity = op;
      };

      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .6, .8);

        // ---------- A: grid (0 → 6.6)
        const exA = prog(t, 6.2, .45, E.in);
        grps.forEach((g, gi) => {
          const pr = prog(t, .9 + gi * .09, .45);
          g.rule.style.transform = `scaleX(${pr})`;
          const pl = prog(t, 1.0 + gi * .09, .45);
          g.gl.style.opacity = pl;
          g.gl.style.transform = `translateY(${(1 - pl) * 8}px)`;
          // journey sweep: each group's rule fills cyan in turn, then releases
          const a = 2.7 + gi * .62;
          const pin = prog(t, a, .45, E.brand), pout = prog(t, a + .75, .45, E.inOut);
          g.fill.style.transform = `scaleX(${pin})`;
          g.fill.style.opacity = 1 - pout;
          g.gl.style.color = pin > .5 && pout < .5 ? 'var(--accent)' : 'var(--muted)';
          g.g.style.opacity = 1 - exA;
        });
        names.forEach((n, i) => {
          const p = prog(t, 1.45 + i * .035, .5);
          n.style.opacity = p * (1 - exA);
          n.style.transform = `translateY(${(1 - p) * 8}px)`;
          const o = olines[i], po = prog(t, 1.85 + i * .035, .5);
          o.style.opacity = po * (1 - exA);
          o.style.transform = `translateY(${(1 - po) * 8}px)`;
          // the lit cluster's one-liners brighten with its rule
          const a = 2.7 + order[i].gi * .62;
          const lit = prog(t, a, .3) * (1 - prog(t, a + .75, .45, E.inOut));
          o.style.color = `rgb(${lerp(138, 180, lit)},${lerp(148, 188, lit)},${lerp(184, 214, lit)})`;
        });

        // ---------- icons: land → (featured) fly to phone labels → regroup into mini row
        const exC = prog(t, dur - 1.4, .6, E.in);    // closing card clears before chrome arrives
        const flyB = prog(t, 6.25, 1.15, E.inOut);   // featured icons → labels
        const flyC = prog(t, 11.7, 1.1, E.inOut);    // featured icons → mini row
        order.forEach((o, i) => {
          const d = icons[i];
          const fi = FEAT.findIndex(f => f.key === o.key);
          // match cut: every icon emerges from the lit iOS card tile of the map and flies to its slot
          const src = Film.__iosTile || { x: 1435, y: 560, size: 58 };
          const pl = prog(t, .15 + o.gi * .09 + o.j * .05, 1.35, E.inOut);
          let cx = lerp(src.x, o.x, pl), cy = lerp(src.y, ROW_Y, pl), size = lerp(src.size, IS, pl), op = clamp(pl * 6);
          const mx = miniX(i);
          if (fi >= 0) {
            const lx = FEAT[fi].x, ly = LBL_ICON_Y;
            cx = lerp(cx, lx, flyB); cy = lerp(cy, ly, flyB); size = lerp(size, LBL_ICON, flyB);
            cx = lerp(cx, mx, flyC); cy = lerp(cy, MINI_Y, flyC); size = lerp(size, MINI, flyC);
          } else {
            const pout = prog(t, 6.3 + o.gi * .03, .45, E.in);
            const pin = prog(t, 11.95 + i * .05, .8, E.out);
            if (pin > 0) { cx = mx; cy = MINI_Y + (1 - pin) * 18; size = MINI; op = pin; }
            else { cy += pout * 18; op *= 1 - pout; }
          }
          placeIcon(d, cx, cy - exC * 24, size, op * (1 - exC));
        });

        // ---------- B: phones fan in (6.9 → 12.2)
        const exB = prog(t, 11.55, .45, E.in);
        phones.forEach((p, i) => {
          const side = i - 1;
          const pr = prog(t, 6.95 + (i === 1 ? 0 : .14), 1.4, E.out);
          const px = lerp(960, p.x, side === 0 ? 1 : pr);
          p.ph.el.style.left = px + 'px';
          const ry = side * -8 * (1 - pr);
          p.ph.set(pr * (1 - exB), `perspective(1600px) rotateY(${ry}deg) translateY(${exB * 40}px)`);
          p.upd(t);
          const pl = prog(t, 7.7 + i * .09, .5);
          p.lbl.style.opacity = pl * (1 - exB);
          p.lbl.style.transform = `translateY(${(1 - pl) * 8 + exB * 20}px)`;
        });

        // ---------- C: closing line
        head.set(t, 12.0, .12, .9);
        close.style.opacity = 1 - exC;
        close.style.transform = `translate3d(0,${-exC * 24}px,0)`;
        const pa = prog(t, 12.5, .5);
        and.style.opacity = pa;
        and.style.transform = `translateY(${(1 - pa) * 8}px)`;
      };
    },
  });
})();
