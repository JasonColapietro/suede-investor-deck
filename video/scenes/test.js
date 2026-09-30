Film.scene({ id: 'test', dur: 4, chapter: ['00', 'Test'], build(root) {
  const L = Film.layer(root);
  const a = Film.node(root, { x: 500, y: 540, name: 'Suede Studio', desc: 'iOS', icon: 'S' });
  const b = Film.node(root, { x: 1400, y: 540, name: 'app.suedeai.ai', desc: 'Web', icon: 'W' });
  const l = Film.link(L, 'M 620 540 C 900 400, 1100 400, 1280 540');
  const ph = Film.phone(root, { x: 960, y: 700, scale: .6 });
  const t1 = Film.lines(root, 'h2', 'Every surface.|<em>One spine.</em>'); t1.el.style.cssText = 'position:absolute;left:120px;top:160px';
  return t => { a.set(Film.prog(t, 0, .8)); b.set(Film.prog(t, .3, .8), t > 2); l.set({ draw: Film.prog(t, .6, 1), heat: Film.prog(t, 1.6, .5), flow: t, flowOn: Film.prog(t, 1.6, .5) }); ph.set(Film.prog(t, .5, 1)); t1.set(t, .2); };
}});
