// Scene 6 · Creator flow — Practice → Write → Make → Prove → Release → Share on one rail.
(function () {
  const { el, prog, clamp, lerp, E } = Film;
  const WEB = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b4bcd6" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9h18"/><circle cx="6" cy="6.8" r=".4" fill="#b4bcd6"/></svg>`;
  const css = `
.scene-creator .hl{position:absolute;left:120px;top:168px;font-family:var(--serif);font-size:64px;line-height:1.05;letter-spacing:-.015em;white-space:nowrap}
.scene-creator .hl em{font-style:italic;color:var(--accent)}
.scene-creator .st{position:absolute;top:0;width:256px}
.scene-creator .nm{position:absolute;left:0;top:344px;height:52px;width:256px;font-family:var(--serif);font-size:44px;line-height:1;letter-spacing:-.01em}
.scene-creator .nm span{position:absolute;left:0;top:0;white-space:nowrap}
.scene-creator .nm .on{font-style:italic;color:var(--accent)}
.scene-creator .ix{position:absolute;left:0;top:306px;font-family:var(--mono);font-size:18px;letter-spacing:.16em;color:var(--muted)}
.scene-creator .dot{position:absolute;top:431px;left:0px;width:18px;height:18px;border-radius:50%;background:var(--surface);border:1px solid var(--hairline-2)}
.scene-creator .dot i{position:absolute;inset:4px;border-radius:50%;background:var(--accent)}
.scene-creator .stamp{position:absolute;top:433px;left:2px;width:14px;height:14px;border-radius:2px;background:var(--accent);box-shadow:0 0 12px var(--accent-glow);transform:rotate(45deg)}
.scene-creator .ring{position:absolute;top:431px;left:0px;width:18px;height:18px;border-radius:50%;border:1px solid var(--accent)}
.scene-creator .items{position:absolute;left:0;top:500px;width:256px}
.scene-creator .it{display:flex;align-items:center;gap:14px;height:54px;margin-bottom:8px}
.scene-creator .it .ic{width:44px;height:44px;border-radius:10px;flex:none;overflow:hidden;display:grid;place-items:center;background:var(--ground);border:1px solid var(--hairline-2);position:relative}
.scene-creator .it .ic img{width:100%;height:100%;display:block}
.scene-creator .it .n{font-size:20px;font-weight:600;color:var(--ink);white-space:nowrap;line-height:1.15}
.scene-creator .it .k.dom{text-transform:none;letter-spacing:.02em}
.scene-creator .it .k{font-family:var(--mono);font-size:18px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-top:3px}
.scene-creator .track{position:absolute;top:439px;height:2px;border-radius:2px;background:var(--hairline);transform-origin:0 50%}
.scene-creator .fill{position:absolute;top:438px;height:4px;border-radius:2px;transform-origin:0 50%;
  background:linear-gradient(90deg,rgba(6,207,239,.15),rgba(6,207,239,.55) 70%,var(--accent));box-shadow:0 0 12px rgba(6,207,239,.25)}
.scene-creator .dia{position:absolute;top:432px;width:16px;height:16px;margin-left:-8px;border-radius:2px;background:var(--accent);
  box-shadow:0 0 16px var(--accent-glow),0 0 0 4px rgba(6,207,239,.12);transform:rotate(45deg)}
`;
  const STAGES = [
    ['Practice', [['Strumly', 'Web', 'web'], ['Tuner & Studio', 'iOS', 'suede-guitar-tuner-studio'], ['FretPulse', 'iOS · Web', 'fretpulse'],
      ['GuitarHub', 'iOS · Web', 'guitarhub'], ['Suede Voice', 'iOS', 'suede-voice'], ['Suede Sing', 'Chrome · Web', 'suede-sing']]],
    ['Write', [['Studio Muse', 'iOS · Web', 'suede-studio-muse']]],
    ['Make', [['Create', 'app.suedeai.ai', 'web'], ['AI Generator', 'iOS', 'suede-ai-generator'], ['Studio Music', 'Web', 'web']]],
    ['Prove', [['IP Registry', 'ip.suedeai.ai', 'web']]],
    ['Release', [['Suede AI Distro', 'Web', 'web']]],
    ['Share', [['Suede Social', 'iOS · Web', 'suede-social']]],
  ];
  const X0 = 120, PITCH = 296, OFF = 9;
  Film.scene({
    id: 'creator', dur: 14, chapter: ['05', 'Creator flow'],
    build(root) {
      el('style', '', root, css);
      const hl = Film.lines(root, 'hl', 'One Suede account, from first chord <em>to release.</em>');
      const sx = i => X0 + i * PITCH + OFF;
      const track = el('div', 'track', root); track.style.left = sx(0) + 'px'; track.style.width = (sx(5) - sx(0)) + 'px';
      const fill = el('div', 'fill', root); fill.style.left = sx(0) + 'px'; fill.style.width = (sx(5) - sx(0)) + 'px';
      const st = STAGES.map(([name, items], i) => {
        const s = el('div', 'st', root); s.style.left = (X0 + i * PITCH) + 'px';
        const ix = el('div', 'ix', s, String(i + 1).padStart(2, '0'));
        const nm = el('div', 'nm', s);
        const off = el('span', '', nm, name), on = el('span', 'on', nm, name);
        const ring = el('div', 'ring', s);
        const dot = el('div', 'dot', s, '<i></i>');
        const box = el('div', 'items', s);
        const its = items.map(([n, k, ic]) => el('div', 'it', box,
          `<div class="ic">${ic === 'web' ? '<img src="../assets/mark.svg">' : `<img src="icons/${ic}.jpg">`}</div><div><div class="n">${n}</div><div class="k${k.includes('.') ? ' dom' : ''}">${k}</div></div>`));
        const stamp = i === 3 ? el('div', 'stamp', s) : null;
        return { s, ix, off, on, ring, dot, dotI: dot.firstChild, its, stamp };
      });
      const dia = el('div', 'dia', root);
      // arrival times per station
      const A = [1.7, 3.45, 5.2, 6.95, 8.7, 10.45], HOP = 1.1;
      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .8, .8);
        hl.set(t, .5);
        hl.out(prog(t, dur - 1.2, .4, E.in));
        // rail draws in
        const tr = prog(t, .6, 1.2, E.inOut);
        track.style.transform = `scaleX(${tr})`;
        // diamond position along stations
        let x = sx(0);
        for (let i = 1; i < 6; i++) {
          const p = prog(t, A[i] - HOP, HOP, E.inOut);
          if (p > 0) x = lerp(sx(i - 1), sx(i), p);
        }
        dia.style.left = x + 'px';
        const dIn = prog(t, A[0] - .5, .5, E.out);
        dia.style.opacity = dIn;
        dia.style.transform = `rotate(45deg) scale(${dIn * (1 + .25 * Math.max(0, 1 - Math.abs(t - A[3] - .25) / .45))})`;
        fill.style.transform = `scaleX(${(x - sx(0)) / (sx(5) - sx(0))})`;
        fill.style.opacity = dIn;
        st.forEach((o, i) => {
          const enter = prog(t, .7 + i * .09, .9, E.out);
          const arrived = prog(t, A[i] - .15, .3);
          const active = arrived * (i < 5 ? 1 - prog(t, A[i + 1] - HOP + .1, .35) : 1 - prog(t, 12.2, .5));
          const visited = arrived * (1 - active);
          o.ix.style.opacity = enter * lerp(.5, 1, arrived);
          o.off.style.opacity = enter * (1 - active) * lerp(.34, 1, visited);
          o.on.style.opacity = enter * active;
          o.off.style.transform = o.on.style.transform = `translateY(${(1 - enter) * 20}px)`;
          o.dot.style.opacity = prog(t, .6 + (sx(i) - sx(0)) / (sx(5) - sx(0)) * 1.0, .3);
          // Prove keeps a cyan diamond "stamp" once the proof has passed through it
          const st = o.stamp ? prog(t, A[4] - HOP + .15, .3) : 0;
          o.dotI.style.opacity = arrived * (1 - st);
          if (o.stamp) {
            const fin = Math.max(0, 1 - Math.abs(t - 11.9) / .6);
            o.stamp.style.opacity = st;
            o.stamp.style.transform = `rotate(45deg) scale(${st * (1 + .3 * fin)})`;
            o.stamp.style.boxShadow = `0 0 ${12 + 24 * fin}px rgba(6,207,239,${.35 + .3 * fin})`;
          }
          o.dot.style.borderColor = arrived > .5 ? 'var(--accent)' : 'var(--hairline-2)';
          o.dot.style.boxShadow = active > 0 ? `0 0 0 ${8 * active}px rgba(6,207,239,.08),0 0 ${44 * active}px rgba(6,207,239,${.4 * active})` : 'none';
          // one ping ring on arrival
          const pg = i === 3 && t > 11.5 ? clamp((t - 11.6) / .7) : clamp((t - A[i]) / .7);
          o.ring.style.opacity = (pg > 0 && pg < 1) ? .55 * (1 - pg) : 0;
          o.ring.style.transform = `scale(${1 + pg * 1.6})`;
          o.its.forEach((it, k) => {
            const p = prog(t, A[i] - .05 + k * .09, .7, E.out);
            it.style.opacity = p * lerp(1, .72, prog(t, (A[i + 1] || 99) - .2, .5) * (1 - prog(t, 12.2, .6)));
            it.style.transform = `translateY(${(1 - p) * -16}px)`;
          });
        });
      };
    },
  });
})();
