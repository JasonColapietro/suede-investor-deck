// Scene 7 · Agent flow — an agent buys a track over x402, then the build & sell chain.
(function () {
  const { el, prog, clamp, lerp, E } = Film;
  const css = `
.scene-agent .hl{position:absolute;left:120px;top:168px;height:72px;width:1200px}
.scene-agent .hl .h{position:absolute;left:0;top:0;font-family:var(--serif);font-size:64px;line-height:1.05;letter-spacing:-.015em;white-space:nowrap}
.scene-agent .hl em{font-style:italic;color:var(--accent)}
.scene-agent .term{position:absolute;left:120px;top:296px;width:780px;height:562px;border-radius:12px;background:#070b1a;border:1px solid var(--hairline);
  box-shadow:0 30px 60px -30px rgba(0,0,0,.7);overflow:hidden;transform-origin:0 50%}
.scene-agent .term .bar{height:52px;display:flex;align-items:center;gap:8px;padding:0 20px;border-bottom:1px solid var(--hairline);background:#0b1024}
.scene-agent .term .bar i{width:12px;height:12px;border-radius:50%;background:var(--hairline-2)}
.scene-agent .term .bar span{margin-left:14px;font-family:var(--mono);font-size:18px;color:var(--muted);letter-spacing:.04em}
.scene-agent .term .body{padding:30px 34px;font-family:var(--mono);font-size:24px;line-height:1;color:var(--body)}
.scene-agent .ln{height:56px;display:flex;align-items:center;white-space:pre}
.scene-agent .ln .a{color:var(--muted)} .scene-agent .ln .w{color:var(--ink)} .scene-agent .ln .c{color:var(--accent)}
.scene-agent .ln .caret{display:inline-block;width:12px;height:26px;background:var(--accent);margin-left:2px}
.scene-agent .player{margin-top:22px;height:76px;border-radius:12px;background:var(--surface);border:1px solid var(--hairline);display:flex;align-items:center;gap:18px;padding:0 20px}
.scene-agent .player .pl{width:40px;height:40px;border-radius:50%;background:#fff;display:grid;place-items:center;flex:none}
.scene-agent .player .wv{flex:1;height:36px;display:flex;align-items:center;gap:3px}
.scene-agent .player .wv i{flex:1;border-radius:1px;background:var(--hairline-2)}
.scene-agent .player .f{font-family:var(--mono);font-size:20px;color:var(--ink)}
.scene-agent .side{position:absolute;left:1000px;top:296px;width:800px}
.scene-agent .lab{font-family:var(--mono);font-size:18px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:16px}
.scene-agent .lab::after{content:"";flex:1;height:1px;background:var(--hairline)}
.scene-agent .chips{display:flex;gap:12px;margin-top:22px}
.scene-agent .chip{display:inline-flex;align-items:center;gap:10px;height:44px;padding:0 18px;border-radius:999px;border:1px solid var(--hairline-2);background:rgba(12,17,39,.6);
  font-family:var(--mono);font-size:20px;color:var(--body)}
.scene-agent .chip::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--muted)}
.scene-agent .chip.cy{border-color:rgba(6,207,239,.4);background:var(--accent-soft);color:var(--accent)}
.scene-agent .chip.cy::before{background:var(--accent)}
.scene-agent .peek{margin-top:18px;display:flex;gap:14px;font-family:var(--mono);font-size:18px;color:var(--muted);white-space:nowrap}
.scene-agent .peek b{font-weight:400;color:var(--ink)} .scene-agent .peek s{text-decoration:none;color:var(--hairline-2)}
.scene-agent .chain{position:absolute;left:1000px;top:436px;width:800px}
.scene-agent .vline{position:absolute;left:1015px;top:470px;width:2px;background:var(--hairline-2);transform-origin:50% 0;border-radius:2px}
.scene-agent .vfill{position:absolute;left:1015px;top:470px;width:2px;background:linear-gradient(180deg,rgba(6,207,239,.2),var(--accent));transform-origin:50% 0;border-radius:2px}
.scene-agent .step{position:absolute;left:0;height:62px;width:800px;display:flex;align-items:flex-start}
.scene-agent .step .d{position:absolute;left:6px;top:14px;width:20px;height:20px;border-radius:50%;background:var(--surface);border:1px solid var(--hairline-2)}
.scene-agent .step .d i{position:absolute;inset:5px;border-radius:50%;background:var(--accent)}
.scene-agent .step .tx{margin-left:64px}
.scene-agent .step .n{font-size:26px;font-weight:600;color:var(--ink);letter-spacing:-.01em;line-height:1.1}
.scene-agent .step .n code{font-family:var(--mono);font-weight:500;font-size:26px;color:var(--ink)}
.scene-agent .step .m{font-family:var(--mono);font-size:18px;color:var(--muted);letter-spacing:.06em;margin-top:6px}
.scene-agent .ctr{position:absolute;right:0;top:0;display:flex;align-items:center;gap:22px}
.scene-agent .ctr .num{order:2;font-family:var(--serif);font-size:76px;line-height:.9;letter-spacing:-.02em;color:var(--accent);font-variant-numeric:tabular-nums}
.scene-agent .ctr .cl{font-family:var(--mono);font-size:18px;line-height:1.35;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);text-align:right}
.scene-agent .sdk{position:absolute;left:120px;right:120px;top:912px;display:flex;align-items:center;gap:22px;font-family:var(--mono);font-size:20px;color:var(--body);white-space:nowrap}
.scene-agent .sdk .k{font-weight:500;font-size:18px;letter-spacing:.16em;color:var(--muted);text-transform:uppercase}
.scene-agent .sdk b{font-weight:400;color:var(--ink)}
.scene-agent .sdk s{text-decoration:none;color:var(--hairline-2)}
.scene-agent .fl{position:absolute;left:1000px;top:522px;width:800px;height:200px}
.scene-agent .fn{position:absolute;top:0;width:260px;padding:22px 24px;border-radius:12px;background:var(--surface);border:1px solid var(--hairline);box-shadow:0 30px 60px -30px rgba(0,0,0,.7)}
.scene-agent .fn.hot{border-color:rgba(6,207,239,.4);background:var(--surface-2);box-shadow:0 0 0 8px rgba(6,207,239,.06),0 0 44px rgba(6,207,239,.25),0 30px 60px -30px rgba(0,0,0,.7)}
.scene-agent .fn .n{font-size:26px;font-weight:600;letter-spacing:-.01em}
.scene-agent .fn .m{font-family:var(--mono);font-size:18px;color:var(--muted);letter-spacing:.04em;margin-top:8px}
.scene-agent .fline{position:absolute;left:260px;top:52px;width:280px;height:2px;background:var(--hairline-2);transform-origin:0 50%}
.scene-agent .pay{position:absolute;top:50px;width:60px;height:6px;margin-left:-30px;border-radius:3px;background:radial-gradient(closest-side,#fff,var(--accent),transparent)}
.scene-agent .plab{position:absolute;top:14px;transform:translateX(-50%);font-family:var(--mono);font-size:18px;color:var(--body);white-space:nowrap}
.scene-agent .rchip{position:absolute;top:35px;transform:translateX(-50%);font-family:var(--mono);font-size:18px;color:var(--ink);white-space:nowrap;
  height:34px;display:flex;align-items:center;padding:0 14px;border-radius:999px;border:1px solid var(--hairline-2);background:var(--ground)}
`;
  const STEPS = [
    [`<code>suede</code> CLI`, '@suedeai/agents'],
    ['Agent Studio', 'agents.suedeai.ai'],
    ['x402 endpoint', 'pay-per-call · USDC on Base'],
    ['ERC-8004 Identity', 'Reputation · Validation'],
    ['Producer by Suede AI', 'Hireable on Virtuals ACP'],
  ];
  Film.scene({
    id: 'agent', dur: 15, chapter: ['06', 'Agent flow'],
    build(root) {
      el('style', '', root, css);
      const hl = el('div', 'hl', root);
      const h1 = Film.lines(hl, 'h', 'Agents <em>pay per call.</em>');
      const h2 = Film.lines(hl, 'h', 'Agents <em>build and sell.</em>');
      const h2em = h2.el.querySelector('em');

      // terminal
      const term = el('div', 'term', root);
      el('div', 'bar', term, '<i></i><i></i><i></i><span>agent · app.suedeai.ai</span>');
      const body = el('div', 'body', term);
      const L = Array.from({ length: 6 }, () => el('div', 'ln', body));
      const player = el('div', 'player', body, `<div class="pl"><svg width="14" height="16" viewBox="0 0 14 16"><path d="M1 1l12 7-12 7z" fill="#0c1127"/></svg></div><div class="wv"></div><div class="f">track.mp3</div>`);
      const wv = player.querySelector('.wv'); const rr = Film.rand(7);
      const pbars = Array.from({ length: 44 }, (_, i) => { const b = el('i', '', wv); b.style.height = (6 + 30 * Math.sin(Math.PI * (i + .5) / 44) ** .5 * (.35 + .65 * rr())) + 'px'; return b; });

      // discovery
      const side = el('div', 'side', root);
      const dlab = el('div', 'lab', side, 'Discovery');
      const chipsWrap = el('div', 'chips', side);
      const chips = ['llms.txt', 'x402.json', 'A2A card', 'MCP'].map(c => el('span', 'chip', chipsWrap, c));
      const peek = el('div', 'peek', side, `<b>/create-music $0.50</b><s>·</s>/agent/video $4.99<s>·</s>/agent/image $0.15`);

      // beat-1 flow: agent ⇄ x402 API
      const fl = el('div', 'fl', root);
      const fA = el('div', 'fn', fl, `<div class="n">Agent</div><div class="m">USDC on Base</div>`); fA.style.left = '0px';
      const fB = el('div', 'fn', fl, `<div class="n">x402 API</div><div class="m">app.suedeai.ai</div>`); fB.style.left = '540px';
      const fline = el('div', 'fline', fl);
      const pill = el('div', 'pay', fl), plab = el('div', 'plab', fl, '$0.50 USDC'), rchip = el('div', 'rchip', fl, 'track.mp3');

      // build & sell chain
      const clab = el('div', 'lab', root, 'Build &amp; sell'); Object.assign(clab.style, { position: 'absolute', left: '1000px', top: '428px', width: '800px' });
      const Y0 = 484, SP = 78;
      const vline = el('div', 'vline', root), vfill = el('div', 'vfill', root);
      const H = SP * 4; vline.style.height = vfill.style.height = H + 'px'; vline.style.top = vfill.style.top = (Y0 + 24) + 'px';
      const steps = STEPS.map(([n, m], i) => {
        const s = el('div', 'step', root);
        Object.assign(s.style, { left: '1000px', top: (Y0 + i * SP) + 'px' });
        const d = el('div', 'd', s, '<i></i>');
        el('div', 'tx', s, `<div class="n">${n}</div><div class="m">${m}</div>`);
        return { s, d, di: d.firstChild };
      });
      const ctr = el('div', 'ctr', steps[3].s, `<div class="num">0</div><div class="cl">agent identities<br>on Base</div>`);
      ctr.style.top = '-20px';
      const num = ctr.querySelector('.num');

      const sdk = el('div', 'sdk', root, `<span class="k">SDKs</span><b>pip install suede-ai</b><s>·</s><b>@suedeai/mcp-server</b><s>·</s><b>@suedeai/agents</b><s>·</s><b>@suedeai/plugin-suede</b>`);

      const typeLine = (node, pre, txt, p, cls = 'w', caret) =>
        node.innerHTML = `<span class="a">${pre}</span><span class="${cls}">${txt.slice(0, Math.round(txt.length * clamp(p)))}</span>${caret ? '<span class="caret"></span>' : ''}`;

      const B2 = 7.6; // beat 2 start
      return (t, dur) => {
        root.style.opacity = Film.env(t, 0, dur, .8, .8);
        // headlines
        h1.set(t, .5);
        const o1 = prog(t, B2 - .45, .4, E.in);
        h1.out(o1);
        h2.set(t, B2);
        h2.el.style.opacity = t > B2 - .05 ? 1 - prog(t, dur - 1.2, .4, E.in) : 0;
        h2.el.style.transform = `translateY(${-20 * prog(t, dur - 1.2, .4, E.in)}px)`;
        // once "23" lands, the em settles to ink so the number is the single cyan hero
        const settle = prog(t, B2 + 3.6, .8, E.inOut);
        h2em.style.color = `rgb(${lerp(6, 255, settle)},${lerp(207, 255, settle)},${lerp(239, 255, settle)})`;

        // terminal enter
        const tp = prog(t, .7, 1.0, E.out);
        const tb = prog(t, B2, .6, E.inOut);
        term.style.opacity = tp * lerp(1, .22, tb);
        term.style.transform = `translateY(${(1 - tp) * 30}px) scale(${1 - .04 * tb})`;
        // discovery chips
        dlab.style.opacity = prog(t, .8, .45) * lerp(1, .3, prog(t, B2, .6));
        chips.forEach((c, i) => {
          const p = prog(t, .95 + i * .09, .7, E.out);
          c.style.opacity = p * lerp(1, .3, prog(t, B2, .6)); c.style.transform = `translateY(${(1 - p) * 10}px)`;
          c.classList.toggle('cy', i === 1 && t > 2.9 && t < B2 + .3);
        });

        const pk = prog(t, 2.95, .5, E.out) * (1 - prog(t, B2 - .4, .4, E.in));
        peek.style.opacity = pk; peek.style.transform = `translateY(${(1 - Math.min(1, prog(t, 2.95, .5, E.out))) * 8}px)`;
        // terminal lines
        const blink = Math.floor(t * 2.2) % 2 === 0;
        const t1 = clamp((t - 1.8) / .6);
        typeLine(L[0], '→ ', 'POST /create-music', t1, 'w', t < 2.8 && (t1 < 1 || blink) && t > 1.3);
        L[0].style.opacity = prog(t, 1.2, .3);
        L[1].innerHTML = `<span class="a">← </span><span class="w">402</span>&nbsp;Payment Required`;
        L[2].innerHTML = `<span class="a">  </span><span class="c">$0.50 USDC · Base</span>`;
        [[1, 2.9], [2, 3.25]].forEach(([k, a]) => { const p = prog(t, a, .4); L[k].style.opacity = p; L[k].style.transform = `translateY(${(1 - p) * 8}px)`; });
        const sp = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'[Math.floor(t * 12) % 10];
        L[3].innerHTML = t < 4.9 ? `<span class="a">→ </span>signing payment… <span class="c">${sp}</span>` : `<span class="a">→ </span>signing payment… <span class="c">✓ signed</span>`;
        const p3 = prog(t, 3.8, .4); L[3].style.opacity = p3; L[3].style.transform = `translateY(${(1 - p3) * 8}px)`;
        const dots = '.'.repeat(1 + Math.floor(t * 4) % 3);
        L[4].innerHTML = `<span class="a">← </span><span class="w">202</span>&nbsp;· polling${t < 6.2 ? dots : '…'}`;
        const p4 = prog(t, 5.2, .4); L[4].style.opacity = p4; L[4].style.transform = `translateY(${(1 - p4) * 8}px)`;
        L[5].innerHTML = `<span class="a">← </span><span class="c">200</span>&nbsp;· <span class="w">track.mp3</span>`;
        const p5 = prog(t, 6.3, .4); L[5].style.opacity = p5; L[5].style.transform = `translateY(${(1 - p5) * 8}px)`;
        const pp = prog(t, 6.55, .7, E.out); player.style.opacity = pp; player.style.transform = `translateY(${(1 - pp) * 12}px)`;
        pbars.forEach((b, i) => { b.style.background = i < 44 * prog(t, 6.8, 5.5, E.linear) ? '#06cfef' : '#3a4670'; });

        // beat-1 flow
        const fo = 1 - prog(t, B2 - .6, .45, E.in);
        const fa = prog(t, 1.0, .8, E.out), fb = prog(t, 1.15, .8, E.out);
        fA.style.opacity = fa * fo; fA.style.transform = `translateY(${(1 - fa) * 16}px)`;
        fB.style.opacity = fb * fo; fB.style.transform = `translateY(${(1 - fb) * 16}px)`;
        fline.style.transform = `scaleX(${prog(t, 1.5, 1.0, E.inOut)})`; fline.style.opacity = fo;
        fA.classList.toggle('hot', t > 3.8 && t < 5.4);
        fB.classList.toggle('hot', (t > 5.3 && t < 6.9));
        const pm = prog(t, 4.45, 1.1, E.inOut);
        const px = 260 + 280 * pm, pvis = clamp(Math.min(pm, 1 - pm) * 12) * (t > 4.45 ? 1 : 0);
        pill.style.left = plab.style.left = px + 'px';
        pill.style.opacity = pvis * fo; plab.style.opacity = pvis * fo;
        const rm = prog(t, 6.2, 1.0, E.inOut);
        rchip.style.left = (540 - 200 * rm) + 'px';
        rchip.style.opacity = (t > 6.2 && rm < 1 ? clamp(rm * 8) * (1 - prog(rm, .6, .4, E.linear)) : 0) * fo;

        // beat 2: build & sell chain
        clab.style.opacity = prog(t, B2 + .1, .45);
        const dr = prog(t, B2 + .3, 2.6, E.inOut);
        vline.style.transform = `scaleY(${dr})`;
        vfill.style.transform = `scaleY(${dr})`;
        vfill.style.opacity = .9;
        steps.forEach((o, i) => {
          const a = B2 + .3 + i * .6;
          const p = prog(t, a, .8, E.out);
          o.s.style.opacity = p; o.s.style.transform = `translateY(${(1 - p) * 16}px)`;
          const lit = prog(t, a + .1, .3);
          o.di.style.opacity = lit;
          o.d.style.borderColor = lit > .5 ? 'var(--accent)' : 'var(--hairline-2)';
          const hot = Math.max(0, 1 - Math.abs(t - (a + .5)) / .7);
          o.d.style.boxShadow = `0 0 0 ${8 * hot}px rgba(6,207,239,.08),0 0 ${30 * hot}px rgba(6,207,239,${.4 * hot})`;
        });
        const cp = prog(t, B2 + 2.2, 1.3, E.out);
        num.textContent = Math.round(23 * cp);
        ctr.style.opacity = prog(t, B2 + 2.1, .4);
        // SDK line
        const sp2 = prog(t, B2 + 3.6, .8, E.out);
        sdk.style.opacity = sp2; sdk.style.transform = `translateY(${(1 - sp2) * 12}px)`;
      };
    },
  });
})();
