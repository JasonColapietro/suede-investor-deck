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
      if ((window.MATCH_IN || []).includes(s.id)) s.matchIn = true;
      s.update = s.build(s.root, s) || (() => {});
      t0 += s.dur - (s.overlap ?? 0.8);
    }
    const last = list[list.length - 1];
    const filmDur = last ? last.start + last.dur : 0;
    const chrome = window.FilmChrome ? window.FilmChrome(stage, list, filmDur) : null;

    // ---- time warp: output time -> film time (piecewise linear knots [out, film]).
    // Lets the cut timing lock to musical bars without retiming each scene.
    const K = (window.WARP || [[0, 0], [filmDur, filmDur]]).slice().sort((a, b) => a[0] - b[0]);
    const toFilm = (o) => {
      if (o <= K[0][0]) return K[0][1];
      for (let i = 1; i < K.length; i++) if (o <= K[i][0]) {
        const [o0, f0] = K[i - 1], [o1, f1] = K[i];
        return f0 + (o - o0) * (f1 - f0) / (o1 - o0);
      }
      return K[K.length - 1][1];
    };
    const toOut = (f) => {
      for (let i = 1; i < K.length; i++) if (f <= K[i][1]) {
        const [o0, f0] = K[i - 1], [o1, f1] = K[i];
        return o0 + (f - f0) * (o1 - o0) / (f1 - f0);
      }
      return K[K.length - 1][0];
    };
    const duration = K[K.length - 1][0];

    // ---- camera: slow push on every scene, zoom-blur through non-matched cuts,
    // plus a light sweep at each such cut. Match cuts (declared per scene) stay untouched.
    const OV = .8;
    const sweep = Film.el('div', 'lightsweep', stage);
    const cam = (s, i, lt) => {
      const mIn = i > 0 && (s.matchIn || list[i - 1].matchOut);
      const mOut = i < list.length - 1 && (s.matchOut || list[i + 1].matchIn);
      const u = clamp(lt / s.dur), A = .035;
      // push: anchored at 1 on any matched edge
      let sc = mIn && mOut ? 1 : mOut ? 1 + A * (1 - E.inOut(u)) : 1 + A * E.inOut(u);
      let blur = 0;
      if (!mIn && i > 0) { const p = clamp(lt / OV); sc *= lerp(.94, 1, E.out(p)); blur = Math.max(blur, (1 - E.out(p)) * 14); }
      if (!mOut && i < list.length - 1) { const p = clamp((lt - (s.dur - OV)) / OV); sc *= lerp(1, 1.1, E.in(p)); blur = Math.max(blur, E.in(p) * 14); }
      s.root.style.transform = sc === 1 ? '' : `scale(${sc.toFixed(5)})`;
      s.root.style.filter = blur > .05 ? `blur(${blur.toFixed(2)}px)` : '';
    };
    const sweepAt = (t) => {
      // active if t is within a non-matched cut window
      for (let i = 1; i < list.length; i++) {
        const s = list[i];
        if (s.matchIn || list[i - 1].matchOut) continue;
        const p = (t - s.start + .15) / 1.1;
        if (p > 0 && p < 1) {
          const x = lerp(-60, 160, E.inOut(p));
          sweep.style.opacity = Math.sin(Math.PI * p) * .55;
          sweep.style.background = `linear-gradient(105deg, transparent ${x - 22}%, rgba(6,207,239,.10) ${x - 8}%, rgba(255,255,255,.22) ${x}%, rgba(6,207,239,.10) ${x + 8}%, transparent ${x + 22}%)`;
          return;
        }
      }
      sweep.style.opacity = 0;
    };

    window.__duration = duration;
    window.__filmDuration = filmDur;
    window.__scenes = list.map(s => ({ id: s.id, start: +s.start.toFixed(2), dur: s.dur, out: +toOut(s.start).toFixed(3), matched: !!(s.matchIn || (list[list.indexOf(s) - 1] || {}).matchOut) }));
    window.__seekFilm = (t) => {
      list.forEach((s, i) => {
        const lt = t - s.start;
        const on = lt >= -0.001 && lt <= s.dur + 0.001;
        s.root.style.display = on ? '' : 'none';
        if (on) { s.update(lt, s.dur); cam(s, i, lt); }
      });
      sweepAt(t);
      if (chrome) chrome(t);
    };
    window.__seek = (o) => window.__seekFilm(toFilm(o));
    await document.fonts.ready;
    // decode all images
    await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
    const q = new URLSearchParams(location.search);
    window.__seek(+(q.get('t') || 0));
    if (q.has('play')) { const st = performance.now() - (+(q.get('t') || 0)) * 1000; const loop = () => { window.__seek(((performance.now() - st) / 1000) % duration); requestAnimationFrame(loop); }; loop(); }
    window.__ready = true;
  });
})();
