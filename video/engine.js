// Suede film engine: deterministic, seekable timeline. No CSS transitions/animations —
// every visual is a pure function of time t so frame capture is exact.
(function () {
  const scenes = [];
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  // cubic-bezier solver (matches CSS)
  function bezier(x1, y1, x2, y2) {
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      let lo = 0, hi = 1, t = x;
      for (let i = 0; i < 30; i++) {
        const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
        if (Math.abs(cx - x) < 1e-5) break;
        if (cx < x) lo = t; else hi = t; t = (lo + hi) / 2;
      }
      return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
    };
  }
  const E = {
    brand: bezier(.2, .7, .2, 1),      // deck --ease
    out: bezier(.16, 1, .3, 1),        // expo-ish out
    inOut: bezier(.65, 0, .35, 1),
    in: bezier(.55, 0, 1, .45),
    linear: x => x,
  };
  // progress of t within [a, a+d], eased
  const prog = (t, a, d, ease = E.brand) => ease(clamp((t - a) / d));
  // fade-in then fade-out envelope
  const env = (t, a, b, fi = .6, fo = .6) => Math.min(prog(t, a, fi), 1 - prog(t, b - fo, fo, E.inOut));

  const Film = {
    E, clamp, lerp, prog, env, bezier,
    W: 1920, H: 1080,
    // register: {id, dur, overlap (s crossfade into next), build(root) => update(localT, dur)}
    scene(def) { scenes.push(def); },
    el(tag, cls, parent, html) {
      const n = document.createElement(tag); if (cls) n.className = cls;
      if (html != null) n.innerHTML = html; if (parent) parent.appendChild(n); return n;
    },
    svg(tag, attrs, parent) {
      const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n;
    },
    // set opacity + translate for a "masked rise" reveal
    rise(node, p, dist = 28) {
      node.style.opacity = p; node.style.transform = `translate3d(0,${(1 - p) * dist}px,0)`;
    },
    // deterministic pseudo-random
    rand(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); },
  };
  window.Film = Film;

  window.addEventListener('load', async () => {
    const stage = document.getElementById('stage');
    let t0 = 0;
    const order = (window.SCENE_ORDER || scenes.map(s => s.id));
    const list = order.map(id => scenes.find(s => s.id === id)).filter(Boolean);
    for (const s of list) {
      s.start = t0;
      s.root = Film.el('section', 'scene scene-' + s.id, stage);
      s.update = s.build(s.root, s) || (() => {});
      t0 += s.dur - (s.overlap ?? 0.8);
    }
    const last = list[list.length - 1];
    const duration = last ? last.start + last.dur : 0;
    const chrome = window.FilmChrome ? window.FilmChrome(stage, list, duration) : null;
    window.__duration = duration;
    window.__scenes = list.map(s => ({ id: s.id, start: +s.start.toFixed(2), dur: s.dur }));
    window.__seek = (t) => {
      for (const s of list) {
        const lt = t - s.start;
        const on = lt >= -0.001 && lt <= s.dur + 0.001;
        s.root.style.display = on ? '' : 'none';
        if (on) s.update(lt, s.dur);
      }
      if (chrome) chrome(t);
    };
    await document.fonts.ready;
    // decode all images
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    const q = new URLSearchParams(location.search);
    window.__seek(+(q.get('t') || 0));
    if (q.has('play')) { const st = performance.now() - (+(q.get('t') || 0)) * 1000; const loop = () => { window.__seek(((performance.now() - st) / 1000) % duration); requestAnimationFrame(loop); }; loop(); }
    window.__ready = true;
  });
})();
