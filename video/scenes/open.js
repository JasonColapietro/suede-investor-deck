// 01 · Cold open — the Suede mark draws on, the headline lands, and the mark's
// cyan bar stretches into the horizontal "spine" that the map scene grows from.
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

  const css = `
.scene-open .cam{position:absolute;inset:0;transform-origin:960px 540px}
  .scene-open .mk{position:absolute;left:0;top:0;width:260px;height:260px;transform-origin:50% 50%}
  .scene-open .mk svg{display:block;width:100%;height:100%;overflow:visible}
  .scene-open .halo{position:absolute;left:0;top:0;width:640px;height:640px;margin:-320px 0 0 -320px;border-radius:50%;
    background:radial-gradient(circle,rgba(6,207,239,.16),rgba(18,35,79,.35) 38%,transparent 68%)}
  .scene-open .ring{position:absolute;left:0;top:0;border-radius:50%;border:1px solid var(--accent)}
  .scene-open .spine{position:absolute;left:0;top:0;background:var(--accent);opacity:0}
  .scene-open .copy{position:absolute;left:0;right:0;top:0;text-align:center}
  .scene-open .eb{display:inline-flex;align-items:center;gap:22px;font:500 22px/1 var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
  .scene-open .eb i{display:block;width:64px;height:1px;background:linear-gradient(90deg,transparent,var(--accent));transform-origin:100% 50%}
  .scene-open .eb i+span+i{background:linear-gradient(90deg,var(--accent),transparent);transform-origin:0 50%}
  .scene-open .eb .dim{color:var(--muted)}
  .scene-open .hl{font:400 128px/.98 var(--serif);letter-spacing:-.015em;color:var(--ink);margin-top:44px}
  .scene-open .hl .line-mask{padding-bottom:.1em}
  .scene-open .hl em{font-style:italic;color:var(--accent)}
  `;
  function styleOnce() {
    if (document.getElementById('st-open')) return;
    const s = el('style', '', document.head); s.id = 'st-open'; s.textContent = css;
  }

  Film.scene({
    id: 'open', dur: 8, chrome: false,
    build(root) {
      styleOnce();
      const cam = el('div', 'cam', root);
      const halo = el('div', 'halo', cam);
      const ring = el('div', 'ring', cam);
      const mk = el('div', 'mk', cam);
      const s = svg('svg', { viewBox: '70 70 260 260' }, mk);
      const g = svg('g', { fill: 'none', stroke: '#fff', 'stroke-linecap': 'round' }, s);
      const arcs = ARCS.map(([w, d]) => svg('path', { d, 'stroke-width': w }, g));
      const lens = arcs.map(a => a.getTotalLength());
      arcs.forEach((a, i) => { a.style.strokeDasharray = `${lens[i]} ${lens[i] + 40}`; });
      const bar = svg('path', { d: 'M140 188.9H250V211.9H140Z', fill: '#06cfef' }, s);
      bar.style.transformBox = 'fill-box'; bar.style.transformOrigin = '50% 50%';
      const spine = el('div', 'spine', root);

      const copy = el('div', 'copy', cam);
      const ebWrap = el('div', '', copy);
      const eb = el('div', 'eb', ebWrap, '<i></i><span>Suede AI <span class="dim">·</span> Ecosystem</span><i></i>');
      const ebRules = eb.querySelectorAll('i');
      const ebText = eb.querySelector('span');
      const hl = Film.lines(copy, 'hl', 'Every surface.|<em>One spine.</em>');
      const hlSpans = hl.el.querySelectorAll('.line-mask > span');
      const em = hl.el.querySelector('em');

      // layout constants
      const CX = 960;
      const HERO = { y: 540, size: 300 };   // mark alone, centred
      const REST = { y: 330, size: 188 };   // mark above the headline
      const COPY_TOP = 482;                  // eyebrow top
      const SPINE_Y = 560;                   // matches the map hub centre

      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .5, .8);

        // --- mark: draw on (outer pair → inner pair), 1.8s expo, 120ms stagger
        arcs.forEach((a, i) => {
          const p = prog(t, .35 + i * .12, 1.8, E.out);
          const u = prog(t, 6.0 + (5 - i) * .04, .42, E.in);   // un-draw, inner arcs first
          a.style.strokeDashoffset = lens[i] * (1 - p) - lens[i] * u;
          a.style.opacity = p > .002 && u < .998 ? 1 : 0;
        });
        const pb = prog(t, 1.35, .9, E.out);
        // --- hero → rest move (camera-like, ease-in-out)
        const pm = prog(t, 2.55, 1.3, E.inOut);
        let my = lerp(HERO.y, REST.y, pm), ms = lerp(HERO.size, REST.size, pm);

        // --- ending: copy exits, arcs fade, bar becomes the spine
        const px = prog(t, 6.15, .45, E.in);               // copy exit
        const pf = prog(t, 6.25, .7, E.inOut);              // arcs fade
        const pmv = prog(t, 6.25, 1.0, E.inOut);            // mark slides to the spine line
        my = lerp(my, SPINE_Y, pmv);
        const pst = prog(t, 6.5, 1.1, E.out);              // bar stretch

        mk.style.transform = `translate(${CX - ms / 2}px,${my - ms / 2}px) scale(${ms / 260})`;
        mk.style.transformOrigin = '0 0';
        

        // slow drift under the hold (felt, not seen); the spine hand-off uses screen coords
        const cs = 1 + .03 * prog(t, 2.4, 4.0, E.inOut);
        cam.style.transform = `scale(${cs})`;
        // bar geometry in screen px (bar centre is (-5,+0.4) units from mark centre)
        const k = ms / 260 * cs;
        const bw = 110 * k, bh = 23 * k;
        const bcx = CX - 5 * k, bcy = 540 + (my - 540) * cs + .4 * k;
        // until the stretch starts, the SVG bar is shown; then the HTML spine takes over seamlessly
        if (pst <= 0) {
          bar.style.opacity = pb > 0 ? 1 : 0;
          bar.style.transform = `scaleX(${pb})`;
          spine.style.opacity = 0;
        } else {
          bar.style.opacity = 0;
          const w = lerp(bw, 1680, pst), h = lerp(bh, 2, prog(t, 6.5, .7, E.out));
          const cx = lerp(bcx, 960, pst);
          spine.style.opacity = 1;
          spine.style.width = w + 'px'; spine.style.height = h + 'px';
          spine.style.borderRadius = Math.min(h / 2, 2) + 'px';
          spine.style.transform = `translate(${cx - w / 2}px,${lerp(bcy, SPINE_Y, pst) - h / 2}px)`;
          spine.style.background = pst > .02 ? `linear-gradient(90deg,transparent,var(--accent) 18%,var(--accent) 82%,transparent)` : 'var(--accent)';
          spine.style.boxShadow = `0 0 ${14 * pst}px rgba(6,207,239,${.45 * pst})`;
        }

        // halo breathes under the mark
        const ph = prog(t, .6, 2.2, E.brand);
        const breathe = 1 + .03 * Math.sin(t * Math.PI / 3);
        halo.style.opacity = ph * (1 - pf) * .9;
        halo.style.transform = `translate(${CX}px,${my}px) scale(${(ms / 300) * breathe})`;

        // one pulse ring when the bar lands
        const pr = clamp((t - 2.05) / 1.6);
        const rs = ms * (1.05 + .55 * E.brand(pr));
        ring.style.width = ring.style.height = rs + 'px';
        ring.style.transform = `translate(${CX - rs / 2}px,${my - rs / 2}px)`;
        ring.style.opacity = pr > 0 && pr < 1 ? .5 * (1 - pr) : 0;

        // --- copy: eyebrow → headline (masked rise) → cyan em lands last
        copy.style.top = COPY_TOP + 'px';
        const pe = prog(t, 3.2, .45, E.brand);
        ebText.style.opacity = pe;
        ebText.style.letterSpacing = lerp(.32, .2, pe) + 'em';
        ebRules.forEach(r => { r.style.transform = `scaleX(${prog(t, 3.3, .45, E.brand)})`; });
        hlSpans.forEach((sp, i) => {
          const p = prog(t, 3.4 + i * .18, .9, E.out);
          sp.style.transform = `translate3d(0,${(1 - p) * 105}%,0)`;
          sp.style.opacity = clamp(p * 1.6);
        });
        const glow = 1 - prog(t, 4.3, 1.4, E.brand);
        em.style.textShadow = `0 0 24px rgba(6,207,239,${.35 * glow * (t > 3.6 ? 1 : 0)})`;
        copy.style.opacity = 1 - px;
        copy.style.transform = `translate3d(0,${-px * 28}px,0)`;
      };
    },
  });
})();
