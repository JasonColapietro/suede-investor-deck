# Suede Ecosystem Film — Design Review (live)

Reviewer: design director. Rubric = design-brief §6 checklist. Source of truth for facts = STORYBOARD.md.
Statuses: 🔴 blocking · 🟡 polish · ✅ approved. Items marked ✅ stay listed once resolved.
Stills are mine, in `frames/review/` (scene-local times) and `frames/review/x/` (global times at boundaries).
Current timeline (round 2): open 0 · map 7.2 · ios 17.4 · web 32.6 · creator 43.8 · agent 57.0 · economy 71.2 · finale 80.4 → 92.9s (chrome.js scene not built yet; adds ~12s).

## Global — round 2

**Fact precedence (read first):** the design brief quotes deck numbers ("22 endpoints", "4 iOS apps", "Suede for Chrome").
STORYBOARD overrides: **9 iOS apps · 3 Android apps**, the three x402 prices (`/create-music` $0.50 · `/agent/video` $4.99 · `/agent/image` $0.15), extensions = **Suede Sing** + **Suede Lens**. No fact errors found on screen so far. ✅

1. 🔴 **Headline double-exposure at every B-scene boundary.** web, creator, agent and economy all put their serif headline at (120, ~200), and the 0.8s crossfade stacks two headlines on top of each other: see `x/t044.2.png` ("Create." under "One Suede account…"), `x/t057.4.png` ("Agents pay per call." over "One Suede account…"), `x/t071.6.png` ("Every stream" over "Agents build and sell"). This is the single most amateur-looking thing in the film right now. Fix (owner B, all four scenes): the outgoing scene's headline must **exit** (masked translateY 0→-30% + opacity→0, ease-exit, 0.4s) ending at `dur-0.8`; the incoming headline starts its masked rise at local `t≥0.45`. Same for other text that sits in the same spot (web's "ALSO ON THE WEB" list vs creator's Practice column). Reuse the same exit on every scene so it becomes a signature "headline swap".
2. 🔴 **economy → finale shows two hubs** (`x/t080.8.png`: economy hub at (1480,500), finale hub at (960,540), both visible). This is the best match-cut opportunity in the film: in economy's last ~1.2s, glide the "One Suede account" hub (ease-in-out) to (960,540) at the finale hub's size while cards/partners exit, and have finale start with its hub already there. (owner B)
3. 🟡 ios → next scene: `ios_t015.5` shows the Android line and "9 iOS apps" at 50% over the incoming browser. Same rule as item 1: clear text before the overlap window. (owner A; boundary will be ios→chrome once chrome.js exists)
4. ✅ open → map is seamless: the spine lands on y=560 and map's first frame shows the same line (`x/t007.5.png`). This is the standard every other boundary should meet.
5. 🟡 Shared system (base.css/components.js/chrome.js): sub-18px text (`.node .ds` 15, `.browser .url` 15, `.phone .sb` 14, `.pill` 17, `.fchrome` 17); radius drift (node 16 / card 18 / browser 14; brief = 12); `Film.link` packets are circles (creator/map already use diamonds and agent/economy use pills: good, keep bespoke).
6. 🟡 chrome.js: chapter label swaps instantly mid-crossfade and its text centre (y≈63) sits 4px above the lockup's (y≈67). Crossfade the label over 0.4s and align baselines. (owner A)
7. 🟡 **Narrative overlap web ↔ creator**: web tells Create→Prove→Release; creator (next) tells Practice→…→Share. Web should end on Agent Studio canvas + SEO (see web #1) so the two scenes don't repeat.
8. 🟡 **Cyan focal discipline.** Several frames have two cyan focal points (agent t=11: cyan em "build and sell." + cyan "23"; web t=4: cyan "Create." + cyan waveform + glowing card). Rule: one cyan hero per frame. The headline em can go ink-white once the scene's cyan hero (number, proof card, diamond) arrives, or the hero goes white.
9. ✅ Consistency wins to keep: headline at x=120/y≈200 across web/creator/agent/economy; section labels "DISCOVERY", "BUILD & SELL", "PARTNERS", "ALSO ON THE WEB" all use the same mono label + trailing hairline; gap-grid partner row; diamonds for proof and pills for payments.

## Coverage checklist (round 2)
| Surface | Where it appears | Status |
|---|---|---|
| 9 iOS apps (all named) | ios grid t=3, phones t=9, finale icons | ✅ |
| 3 Android apps (named) | ios t=14, finale "3 Android apps" | ✅ (hold longer, see ios #4) |
| Suede Sing ext | creator Practice (CHROME), finale icon | ✅ / chrome scene pending |
| Suede Lens + Page Passport | **chrome.js not built** | ⚠ owner A |
| suedeai.ai / suedeai.org | finale labels + end card | ✅ |
| app.suedeai.ai Create / Rewards / Developers / ERC-8004 dir | web | ✅ |
| Studio Music · Distro · IP Registry (Base & Avalanche) | web, creator, finale | ✅ |
| Agent Studio · SEO | agent (Agent Studio), web list, finale | ✅ (web wants a real canvas, see web #1) |
| Social · Strumly · Muse · GuitarHub · FretPulse · Voice | ios, creator | ✅ |
| x402 API: **3 prices** | only `/create-music $0.50` shown | ⚠ owner B: add `/agent/video $4.99` and `/agent/image $0.15` (agent #3) |
| Discovery (llms.txt · x402.json · A2A card · MCP) | agent | ✅ |
| SDKs (pip suede-ai · @suedeai/mcp-server · @suedeai/agents · @suedeai/plugin-suede) | agent t=13 | ✅ |
| **Stripe Agentic Commerce manifest** | nowhere | ⚠ owner B: economy, e.g. Stripe card sub-label "credits for humans & agents" |
| ERC-8004: Identity · Reputation · Validation + 23 identities | agent, map, finale | ✅ |
| Producer by Suede Labs on Virtuals ACP | agent, finale | ✅ |
| Stripe credits · x402 USDC · $SUEDE (Solana) | economy | ✅ |
| app.suedeai.ai/rewards | nowhere (economy says app.suedeai.ai) | 🟡 owner B: economy hub sub-label or $SUEDE card |
| Telegram · X @AISUEDE | finale | ✅ |
| 8 partners | economy | ✅ |

---

## open — owner A — round 2 — status: 🟡 polish
Working: draw-on, single pulse ring, masked rise with the cyan em landing last, and the bar→spine stretch that lands on map's hub line. Centering precise. Keep.
1. 🟡 t=4.5–6.0 dead hold (~1.7s, nothing moves). Add a 1.00→1.03 drift on the mark+copy group across the beat.
2. 🟡 t=4.0 group spans y=212–800 → optical centre y≈506 (34px high). Shift down ~24px.
3. 🟡 Fire the pulse ring when the bar lands (~2.2s), not at 1.9s.
4. ✅ Spine hand-off to map verified at global 7.5.
5. 🟡 Eyebrow in cyan + bar + em = three cyan elements; consider eyebrow text `--muted` with cyan rules only.

## map — owner A — round 2 — status: 🟡 polish
Working: the open→map line hand-off, the dashed orbit, hub → six cluster cards with diamonds travelling on the spokes, and ending on the iOS card lit (t=10.5) as a hand-off to the iOS chapter. Layout is mathematically symmetric (Economy/Web pair centre = 960; On-chain/iOS pair centre = 960). Strong.
1. 🟡 t=4–8: cards are a fixed 410px wide, so short content leaves dead space (iOS card: text ends x≈1545, card ends x≈1780; Web and Chrome similar). Fit card width to content (+ 28px padding), or give every card a two-part meta so they fill evenly.
2. 🟡 Counts: STORYBOARD wants clusters "with counts". iOS "9 apps" should read **"9 iOS · 3 Android"** (never let 9 stand alone as the mobile total). Web could be "app.suedeai.ai + 10 sites" only if you count them from STORYBOARD; otherwise leave the domain.
3. 🟡 t=10.5 → ios t=0.8: iOS card is lit, then the app icons arrive in a centred row with no spatial link to the card at (1575,560). Make the icons emerge from the iOS card position (scale from the card's icon tile, then travel to the grid): a real match cut instead of a crossfade.
4. 🟡 Hub label "ONE SUEDE ACCOUNT" (y=745) is the only type in the scene; there is no headline. That is fine for a map, but then the label must be clearly the focal text: raise it to 22px ink (currently muted) once all six cards land.
5. 🟡 Cards drift outward ~10px between t=4 and t=8 (e.g. On-chain x=155→138): good, felt-not-seen. Confirm easing is in-out, not linear (scrub next round).

## ios — owner A — round 2 — status: 🟡 polish
Working: the clustered grid with Practice/Write/Make/Share/Agents labels and the travelling cyan underline; the three rebuilt phone screens (Tuner 1/6 → 6/6 is lovely storytelling; Muse prompt; Agent Studio earnings) with name + exact STORYBOARD one-liner under each; the "9 iOS apps · +3 on Android" title with the 9-icon strip. All names and one-liners are verbatim. Best scene in the film so far.
1. 🟡 t=3–6: the grid block spans y≈360–640 and nothing sits above it; the top 250px is empty and the composition reads high. Either centre the block on y=540 or add a headline (e.g. serif "Nine apps. *One account.*" is NOT in STORYBOARD, so use the count only: "9 iOS apps" at 56px above the grid).
2. 🟡 t=3–6: the other six apps' one-liners never appear. When a cluster label lights (Practice, then Write…), show that cluster's one-liners under its icons (18–20px `--body`), so every STORYBOARD one-liner is on screen once.
3. 🟡 t=9: app icon under each phone starts at y≈790, only 10px below the phone's bottom edge (y≈780). Give it 24px.
4. 🟡 t=14: the Android names line appears at ~13.8 and the scene starts fading at 15.2: ~1.4s of legible hold. Bring it in by ~12.8 so it holds ≥ 2s.
5. 🟡 t=7: mid-transition the Muse icon sits over the ghosted phone screen at ~20% phone opacity, reading as a collision for ~0.3s. Keep icons above y≈560 or fade the phone in only after icons have left its footprint.
6. 🟡 Phone glow: the default `.phone` cyan glow is on all three phones. Only the phone being talked about should glow (or none).
7. ✅ Facts: 9 names, clusters, one-liners, Android names all match STORYBOARD.

## chrome — owner A — round 2 — status: ⏳ not built
Needs: Suede Sing side panel over a video with live pitch meter (range test, warmups, YouTube sing-along pitch meter); cut to Suede Lens v1.0 popup generating a **Page Passport** (rights, provenance, JSON-LD, AI-search signals). Remember Lens is a direct download at suedeai.ai/lens, not Chrome Web Store.

## web — owner B — round 2 — status: 🟡 polish (unchanged since round 1)
Working: cyan moving Create→Prove→Release; IP Registry card fields exact; dimming track card when proof takes focus.
1. 🟡 STORYBOARD beat "Agent Studio canvas; SEO" is only a text list at t=10. Replace with a 4th beat: URL pill → `agents.suedeai.ai`, body cross-fades to a small flow canvas (3–4 nodes → "x402 endpoint" pill). Keep a list to ≤ 4 items if you keep one.
2. 🟡 t=10: three headlines + 7-item list + 4-panel browser; ~25% negative space. Browser should step back (opacity .5 / scale .96) when anything new enters.
3. 🟡 t=10: list bullets at x=124 vs headline x=120. Align.
4. 🟡 t=4: cyan headline + ~60% cyan waveform + cyan border + glow. Drop the glow; cyan waveform ≤ 40% (playhead portion only).
5. 🟡 URL pill text 15px; override to 18px (it's a key fact).
6. 🟡 t=0–0.5: headline and browser enter together; stagger browser +0.45s.
7. 🔴 (see Global 1) headline exit before creator's headline enters; "ALSO ON THE WEB" list collides with creator's Practice column during the overlap.
8. ✅ Facts all match STORYBOARD.

## creator — owner B — round 2 — status: 🟡 polish
Working: headline "One Suede account, from first chord *to release.*" (factual: one account throughout), six numbered stations evenly spaced (dots at 142/438/734/1030/1326/1622, 296px pitch), diamond riding the rail, stage names turning white as passed, and surfaces dropping in with platform sub-labels. Every surface is correct for its station.
1. 🟡 **Prove is the wedge**, but at the end (t=11–13) Share is the only lit stage and Prove is plain white. Once the diamond passes Prove, leave Prove's dot as a small cyan diamond (the proof "stamp") so the end state reads "everything downstream carries the proof".
2. 🟡 Stage dots sit at x=142 while numbers/names start at x=120: the rail's visual column and the type column disagree by 22px. Put the dot centres on the text's left edge (x=120+6) or indent the text.
3. 🟡 Five web surfaces use the same generic browser glyph (Strumly, Create, Studio Music, IP Registry, Distro). Replace the glyph with the sub-label doing the work: e.g. "IP Registry / ip.suedeai.ai", "Create / app.suedeai.ai", or use the Suede mark tile for all web items so they read as first-party.
4. 🟡 Composition is left-heavy: Practice column has 6 items (y=516–890), everything else 1–3; bottom-right quadrant is empty. Acceptable, but consider two columns of 3 for Practice (x=120 and x=270) is worse; instead reduce icon rows to 60px pitch and centre the whole block on y≈600.
5. 🟡 Hold: last station lands ~t=10.5, scene ends 14: ~2.7s hold with only the diamond glow. Use 1s of it for the Prove-stamp (item 1) so the hold has one final idea.
6. 🔴 (Global 1) headline collision with web at entry and with agent at exit.

## agent — owner B — round 2 — status: 🟡 polish
Working: terminal sequence `POST /create-music` → `402 Payment Required` → `$0.50 USDC · Base` → signed → `202 · polling…` → `200 · track.mp3` matches STORYBOARD flow 2 exactly; payment pill with "$0.50 USDC" riding the Agent→x402 wire; headline swap "pay per call" → "build and sell"; build timeline CLI → Agent Studio → x402 endpoint → ERC-8004 (Identity, Reputation, Validation) → Producer on Virtuals ACP; 23 identities; SDK row. Content is complete and correct.
1. 🟡 t=7: the returning "track.mp3" pill overlaps the Agent card's right edge (pill x≈1222–1347, card edge x=1260). Fade the pill out by the time it reaches x≈1290, or end its path at the card port.
2. 🟡 t=11–13: one-idea-per-frame fails: terminal + 4 discovery chips + 5-step timeline + "23" + SDK row; negative space ~30%. When the "build and sell" beat starts, push the terminal out (slide left + fade, 0.5s) or scale it to 0.8 and dim to .25, and dim the discovery chips to .3.
3. 🟡 Coverage: STORYBOARD lists three priced endpoints. When `x402.json` lights (t≈3), show a 3-line manifest peek under the chips: `/create-music $0.50 · /agent/video $4.99 · /agent/image $0.15`. Then the terminal picks the first.
4. 🟡 Cyan: "23" (serif, cyan) and the em "build and sell." compete. Make "23" the hero (keep cyan) and let the em settle to ink once 23 lands, or vice versa.
5. 🟡 "23" block: label "AGENT IDENTITIES ON BASE" right-aligned at x≈1700 next to the number: good. Align its baseline with the ERC-8004 row (currently number centre y≈750 vs ERC-8004 title y≈732: close; snap to 732 so it reads as that row's metric).
6. 🔴 (Global 1) headline collision with economy at exit.

## economy — owner B — round 2 — status: 🟡 polish
Working: "Every stream, *one account.*"; three stream cards (People/Stripe credits, Agents/x402 USDC, Holders·Solana/$SUEDE rewards) with curves converging on the hub; payment pills on the curves; gap-grid partner row with all 8 partners. Clean and on-brief.
1. 🔴 (Global 2) hub-to-hub match cut into finale instead of two hubs on screen.
2. 🟡 Partners row reaches full opacity at ~t=8.5 and the scene exits at 9.2: under 1s legible. Start the partner stagger at ~t=5.5 so the row holds ≥ 2s.
3. 🟡 Stripe card icon is a generic serif "S". Use `../assets/partners/stripe.svg` rendered mono (brightness(0) invert(1), opacity .7) as in the deck.
4. 🟡 Coverage: add STORYBOARD's "Stripe Agentic Commerce manifest (credits for humans & agents)", e.g. Stripe card sub-label "Credits · humans & agents", and `app.suedeai.ai/rewards` on the $SUEDE card.
5. 🟡 t=3–7: all three curves are cyan at once plus the hub ring. Keep curves `--hairline-2` and light each one only while its pill travels (one at a time).

## finale — owner B — round 2 — status: 🟡 polish (first look)
Working: the constellation (hub + 9 app icons on an inner ring + ~22 labelled surfaces on an outer ring, lighting in sequence, diamonds on spokes) is exactly the "every surface lit" payoff; end card "The ownership layer for the *AI media era.*" + suedeai.ai with the floor glow is on-brand and holds ≥ 2s. Labels checked against STORYBOARD: all real.
1. 🟡 t=6: every label dot + every spoke is cyan at once. It's the climax so some excess is earned, but cap it: spokes `--hairline-2` with cyan only on the 3 carrying packets; dots cyan.
2. 🟡 Inner-ring app icons are unlabeled and several (orange Muse, blue Tuner, purple Agent Studio) sit right on top of outer spokes, e.g. Tuner icon at (1242,436) sits on the Studio Music spoke. Rotate the inner ring ~8° or route spokes between icons so no line passes under an icon.
3. 🟡 Layout: left labels end at x=147 ("3 Android apps") vs right at x=1753: 27px inside the left safe margin on one side only. Pull the left/right outermost labels in to x ≥ 160 symmetric.
4. 🟡 Constellation → end card (t≈7): make the constellation collapse into the hub and the hub become the end-card mark tile (same object, scales down/moves up) rather than a fade. Check that the mark tile at (960,340) is the same element as the hub tile at (960,540).
5. 🟡 Missing from the constellation (cheap to add as labels): A2A card, x402 manifest, Suede Lens (label the magnifier tile), Suede Sing (label its tile), Stripe Agentic Commerce.
