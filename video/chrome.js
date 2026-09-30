// Persistent film chrome: brand lockup, chapter label, progress hairline.
window.FilmChrome = (stage, list, duration) => {
  const { el, prog, clamp, E } = Film;
  const c = el('div', 'fchrome', stage);
  const brand = el('div', 'brand', c, `<img src="../assets/mark.svg"><span>SUEDE AI <span class="dim">/ ECOSYSTEM</span></span>`);
  const chap = el('div', 'chap', c);
  const bar = el('div', 'prog', c);
  return (t) => {
    const cur = [...list].reverse().find(s => t >= s.start) || list[0];
    const hide = cur.chrome === false;
    const vis = hide ? 0 : clamp(Math.min(t - 1.5, duration - 1 - t) / .6);
    brand.style.opacity = chap.style.opacity = vis;
    chap.innerHTML = cur.chapter ? `<b>${cur.chapter[0]}</b> &nbsp;${cur.chapter[1]}` : '';
    bar.style.transform = `scaleX(${t / duration})`; bar.style.opacity = vis * .9;
  };
};
