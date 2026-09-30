// Shared, time-pure building blocks for scenes. Each factory returns an object with
// DOM handles plus a set(...) method you call from your scene update(t).
(function () {
  const { el, svg, clamp, E } = Film;

  // Suede mark (inline so it inherits color)
  Film.mark = (size = 40, color = 'currentColor') =>
    `<img src="../assets/mark.svg" width="${size}" height="${size}" style="display:block">`;

  // Surface node: icon tile + name + descriptor
  Film.node = (parent, { x, y, name, desc = '', icon = '', iconBg, iconColor, anchor = 'center' }) => {
    const n = el('div', 'node', parent);
    const ic = el('div', 'ic', n, icon);
    if (iconBg) ic.style.background = iconBg;
    if (iconColor) ic.style.color = iconColor;
    const tx = el('div', '', n);
    el('div', 'nm', tx, name);
    if (desc) el('div', 'ds', tx, desc);
    n.style.left = x + 'px'; n.style.top = y + 'px';
    const tr = anchor === 'center' ? 'translate(-50%,-50%)' : anchor === 'left' ? 'translate(0,-50%)' : 'translate(-100%,-50%)';
    return {
      el: n,
      set(p, lit = 0) {
        n.style.opacity = p;
        n.style.transform = `${tr} translate3d(0,${(1 - p) * 18}px,0) scale(${.96 + .04 * p})`;
        n.classList.toggle('lit', lit > .5);
      },
    };
  };

  // iPhone frame; returns {el, screen}
  Film.phone = (parent, { x, y, scale = 1, time = '9:41' }) => {
    const p = el('div', 'phone', parent);
    p.style.left = x + 'px'; p.style.top = y + 'px';
    const scr = el('div', 'scr', p);
    el('div', 'island', scr);
    el('div', 'sb', scr, `<span>${time}</span><span style="letter-spacing:2px">●●● ▮</span>`);
    el('div', 'home', scr);
    const content = el('div', '', scr); content.style.cssText = 'position:absolute;inset:0;padding:58px 20px 24px';
    return {
      el: p, screen: content,
      set(prog, extra = '') {
        p.style.opacity = prog;
        p.style.transform = `translate(-50%,-50%) translate3d(0,${(1 - prog) * 60}px,0) scale(${scale * (.94 + .06 * prog)}) ${extra}`;
      },
    };
  };

  // Chrome browser window with extension icon + optional popup
  Film.browser = (parent, { x, y, w = 1100, h = 640, url = 'app.suedeai.ai' }) => {
    const b = el('div', 'browser', parent);
    Object.assign(b.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
    const tb = el('div', 'tb', b);
    el('div', 'dots', tb, '<i></i><i></i><i></i>');
    const u = el('div', 'url', tb, url);
    const ext = el('div', 'ext', tb, `<img src="../assets/mark.svg" width="20" height="20">`);
    const body = el('div', '', b); body.style.cssText = 'position:absolute;top:52px;left:0;right:0;bottom:0;overflow:hidden';
    return {
      el: b, body, ext, url: u,
      set(prog) {
        b.style.opacity = prog;
        b.style.transform = `translate(-50%,-50%) translate3d(0,${(1 - prog) * 50}px,0) scale(${.96 + .04 * prog})`;
      },
    };
  };

  // Connector: SVG path drawn by progress, with packets travelling along it.
  // layer = an <svg> element covering the stage (use Film.layer).
  Film.layer = (parent, z = 1) => {
    const s = svg('svg', { width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, parent);
    s.style.cssText = `position:absolute;inset:0;z-index:${z}`;
    return s;
  };
  Film.link = (layer, d, { color = 'var(--accent)', width = 2, dim = 'rgba(58,70,112,.9)', packets = 3 } = {}) => {
    const base = svg('path', { d, fill: 'none', stroke: dim, 'stroke-width': width, 'stroke-linecap': 'round' }, layer);
    const hot = svg('path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', opacity: 0 }, layer);
    const len = base.getTotalLength();
    base.style.strokeDasharray = hot.style.strokeDasharray = `${len} ${len}`;
    const dots = [];
    for (let i = 0; i < packets; i++) {
      const g = svg('g', { opacity: 0 }, layer);
      svg('circle', { r: 11, fill: 'rgba(6,207,239,.18)' }, g);
      svg('circle', { r: 4.5, fill: '#fff' }, g);
      dots.push(g);
    }
    return {
      len,
      // draw: 0..1 path reveal; heat: 0..1 highlight; flow: packet phase (seconds), flowOn: 0..1 packet opacity
      set({ draw = 1, heat = 0, flow = 0, flowOn = 0, speed = .45, reverse = false } = {}) {
        base.style.strokeDashoffset = len * (1 - draw);
        hot.style.strokeDashoffset = len * (1 - draw);
        hot.setAttribute('opacity', heat);
        dots.forEach((g, i) => {
          let ph = ((flow * speed + i / dots.length) % 1 + 1) % 1;
          if (reverse) ph = 1 - ph;
          const pt = base.getPointAtLength(ph * len);
          const edge = Math.min(ph, 1 - ph) * 8; // fade near ends
          g.setAttribute('transform', `translate(${pt.x},${pt.y})`);
          g.setAttribute('opacity', flowOn * clamp(edge) * (draw >= .999 ? 1 : 0));
        });
      },
    };
  };

  // Split text into masked lines for rise-in. Pass HTML with lines separated by '|'.
  Film.lines = (parent, cls, html) => {
    const wrap = el('div', cls, parent);
    const spans = html.split('|').map(l => { const m = el('span', 'line-mask', wrap); return el('span', '', m, l); });
    return {
      el: wrap,
      set(t, start, stagger = .12, dur = .9) {
        spans.forEach((s, i) => {
          const p = Film.prog(t, start + i * stagger, dur, E.out);
          s.style.transform = `translate3d(0,${(1 - p) * 105}%,0)`;
          s.style.opacity = clamp(p * 1.4);
        });
      },
      out(p) { wrap.style.opacity = 1 - p; wrap.style.transform = `translate3d(0,${-p * 20}px,0)`; },
    };
  };

  // Typewriter mono text (deterministic)
  Film.type = (node, text, p) => { node.textContent = text.slice(0, Math.round(text.length * clamp(p))); };
})();
