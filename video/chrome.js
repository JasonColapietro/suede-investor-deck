// Persistent film chrome: brand lockup, chapter label, progress hairline.
// Chapter labels crossfade at scene boundaries; chrome eases out before scenes with chrome:false.
window.FilmChrome = (stage, list, duration) => {
  const { el, clamp, E } = Film;
  const c = el('div', 'fchrome', stage);
  const brand = el('div', 'brand', c, `<img src="../assets/mark.svg"><span>SUEDE AI <span class="dim">/ ECOSYSTEM</span></span>`);
  const chap = el('div', 'chap', c);
  const bar = el('div', 'prog', c);
  const F = .5; // fade seconds
  // chrome visibility: 1 inside scenes that allow chrome, easing across boundaries
  const shown = s => s.chrome !== false;
  const vis = t => {
    let v = 0;
    for (const s of list) {
      if (!shown(s)) continue;
      const a = s.start + .9, b = s.start + s.dur - .3; // chrome settles after the scene's own entrance
      v = Math.max(v, Math.min(clamp((t - a) / F), clamp((b - t) / F)));
      // hold through overlaps with the next chrome-enabled scene
      const nx = list[list.indexOf(s) + 1];
      if (nx && shown(nx) && t >= s.start + 1 && t <= nx.start + 1.5) v = 1;
    }
    return E.inOut(v);
  };
  return (t) => {
    const v = vis(t);
    brand.style.opacity = v;
    // chapter: the scene whose start is latest <= t; crossfade label around each boundary
    const idx = list.reduce((k, s, i) => (t >= s.start + .4 ? i : k), 0);
    const cur = list[idx];
    const since = t - (cur.start + .4), next = list[idx + 1];
    const until = next ? next.start + .4 - t : 99;
    const lv = cur.chapter ? clamp(Math.min(since / F, until / (F * .6))) : 1;
    const lab = cur.chapter || (list.slice(0, idx).reverse().find(s => s.chapter) || {}).chapter;
    chap.innerHTML = lab ? `<b>${lab[0]}</b> &nbsp;${lab[1]}` : '';
    chap.style.opacity = v * E.inOut(lv);
    chap.style.transform = `translate3d(0,${(1 - E.out(clamp(since / F))) * 8}px,0)`;
    bar.style.transform = `scaleX(${t / duration})`; bar.style.opacity = v * .9;
  };
};
