# Suede Ecosystem Film — Design Review (live)

Reviewer: design director. Rubric = design-brief §6 checklist. Source of truth for facts = STORYBOARD.md.
Statuses: 🔴 blocking · 🟡 polish · ✅ approved. Items marked ✅ stay listed once resolved.
Stills: `frames/review/r4/` (round 4; `t0xx` = global time, `<scene>_t` = scene-local), `frames/review/r4x/` (boundaries, global).
Timeline (round 4): open 0 · map 7.2 · ios 17.4 · chrome 32.6 · web 44.8 · creator 57.0 · agent 70.2 · economy 84.4 · finale 93.6 → **106.6s** ✅

## Global — round 4

**Facts:** ✅ no fact errors anywhere. 9 iOS · 3 Android, three x402 prices, Sing + Lens, 23 identities, 3 registries, Base & Avalanche for IP Registry: all as STORYBOARD.

1. Boundaries (the round-2/3 blocker), now per boundary:
   - ✅ open→map: spine hand-off, seamless.
   - ✅ map→ios: icons now emerge from the lit iOS card (`r4x/t017.8`). Real match cut.
   - 🔴 **ios→chrome (A)**: `r4x/t033.0`: the "9 iOS apps · +3 on Android" end card and the Android line are still at ~40% over the YouTube player. Only remaining double exposure in the film. ios text must finish exiting by local 15.2 (dur-0.8).
   - ✅ chrome→web: web's headline now waits; clean (`r4x/t045.2`).
   - ✅ web→creator (`r4x/t057.4`), ✅ agent→economy (`r4x/t084.8`): clean headline swap.
   - 🟡 creator→agent (`r4x/t070.6`): headline swap is clean, but agent's terminal outline (x 120–900, y 330–880) fades in under creator's Practice column. Delay the terminal's entrance to local ≥ 0.6.
   - ✅ economy→finale: the hub glides to centre and becomes the finale hub (`r4/economy_t008.8`, `r4x/t094.0`). This is exactly the match cut I asked for. Beautiful.
2. ✅ Chrome: lockup and chapter label now share a baseline (y≈67) and the chapter label crossfades. Fixed.
3. 🟡 **Punchline spent early (A, chrome)**: suedeai.ai page hero in chrome t=6.5–12 still reads "The ownership layer for the *AI media era.*", which is the finale's closing line. Replace it with skeleton bars / "SUEDE AI" lockup.
4. 🟡 Title system split by owner: B scenes open with a serif headline at (120,~200); A scenes don't; chrome eyebrow sits at x=240. At minimum put chrome's eyebrow on x=120.
5. 🟡 Shared base.css untouched: sub-18px (`.node .ds` 15, `.browser .url` 15, `.phone .sb` 14, `.pill` 17, `.fchrome` 17) and radius drift (16/18/14 vs 12). Low risk now that scenes override most of these, but the URL pills (15px) are still visible in chrome and web.
6. ✅ Cyan discipline improved: agent em goes ink when "23" lands; web waveform playhead-only; economy curves light per stream. Remaining offender: chrome t=11 (see chrome #4).
7. ✅ The film now tells one story: mark → spine → map with six clusters → each cluster opens (iOS, Chrome, Web) → journeys that cross them (creator, agent) → value converges on one account → the account hub becomes the constellation → tagline. The hub/spine object carries through open, map, economy and finale.

## Coverage checklist (round 4): ✅ complete
| Surface | Where | Status |
|---|---|---|
| 9 iOS apps with all 9 one-liners | ios t=3 (one-liners now shown under every icon) | ✅ |
| 3 Android apps (named) | map iOS card "+3 on Android", ios t=14, finale | ✅ |
| Suede Sing (4 features) | chrome, creator, finale | ✅ |
| Suede Lens v1.0 → Page Passport | chrome, finale | ✅ |
| suedeai.ai / suedeai.org | map, finale, end card | ✅ |
| app.suedeai.ai Create / Rewards / Developers / ERC-8004 | web | ✅ |
| Studio Music · Distro · IP Registry (Base & Avalanche) | web, creator | ✅ |
| Agent Studio canvas → x402 endpoint | web, agent | ✅ |
| Suede AI SEO | finale label | ✅ (chrome "→ Suede AI SEO" would make flow 5 explicit; optional) |
| Strumly · Muse · Social · GuitarHub · FretPulse · Voice (+ web versions) | ios, creator | ✅ |
| x402 three prices | agent t=3.5 manifest line | ✅ |
| Discovery ×4 · SDKs ×4 | agent | ✅ |
| Stripe Agentic Commerce | economy ("credits for humans & agents"), finale label | ✅ |
| ERC-8004 ×3 + 23 identities · Producer/Virtuals ACP | agent, map, finale | ✅ |
| Stripe credits · x402 USDC · $SUEDE (Solana) · app.suedeai.ai/rewards | economy | ✅ |
| Telegram · X @AISUEDE | finale | ✅ |
| 8 partners | economy t≈5.5–8.5 | ✅ |

---

## open — owner A — round 4 — status: ✅ approved
1. ✅ Drift added: headline grows 570–1348 → 558–1358 between t=4 and 5.8, felt not seen.
2. ✅ Group now optically centred (mark top y≈233, descender y≈835 → centre ≈534).
3. ✅ Pulse ring timing accepted.
4. ✅ Spine hand-off.
5. ✅ Eyebrow text muted, cyan rules only; "One spine." is the single cyan focal point.

## map — owner A — round 4 — status: 🟡 polish (minor)
1. ✅ Web card "suedeai.ai · suedeai.org".
2. ✅ iOS card "9 apps · +3 on Android"; cards now fit their content.
3. ✅ Icons emerge from the iOS card into ios.
4. ✅ "ONE SUEDE ACCOUNT" now ink.
5. 🟡 Symmetry regressed with content-fit widths (t=4, `r4/t012.0`): bottom pair inner edges are 198px (Agents & API, right edge x≈762) vs 228px (Chrome, left edge x≈1188) from the hub centre; top pair 167 vs 156. Anchor each card by its inner (port) edge at a fixed distance from x=960 so the spokes are mirror images.

## ios — owner A — round 4 — status: 🔴 blocking (exit only)
1. ✅ Grid block now vertically balanced (y≈350–715).
2. ✅ All nine one-liners shown under their icons, verbatim.
3. 🟡 Icon under each phone: still ~20px under the phone at t=7.6 (`r4/t025.0`); fine, consider 24px.
4. 🟡 Android line holds ≈1.4s; bring it in earlier or hold the scene longer.
5. 🔴 End card still visible at ~40% during chrome's first 0.8s (`r4x/t033.0`). Exit it (masked rise-out) between local 14.6 and 15.2.
6. 🟡 Phone glow on all three phones.
7. ✅ Facts.

## chrome — owner A — round 4 — status: 🟡 polish (file unchanged since round 3)
1. 🟡 Page hero = finale tagline (Global 3).
2. 🟡 Note label stays "A4 · 440 Hz" while the pitch trace moves across three lanes (`r4/chrome_t004.0`). Make the note name follow the lane, or keep the trace on one lane.
3. 🟡 During the wipe the URL still says youtube.com/watch over the suedeai.ai half; swap URL/toolbar icon as the wipe passes.
4. 🟡 t=11: popup's 4 cyan check discs + passport's 4 + progress bar + glow. Mute the popup once the Passport issues.
5. 🟡 Eyebrow at x=240 → x=120.
6. 🟡 Optional: "SUEDE LENS · V1.0 · SUEDEAI.AI/LENS" and a closing "→ Suede AI SEO" hand-off.
7. ✅ chrome→web boundary now clean.

## web — owner B — round 4 — status: ✅ approved
Create → Prove → Release → *Publish.* with the Agent Studio canvas is the right scene. Micro-polish only, optional: URL pill 15px → 18px; draw the Suede-node → x402-pill stem 0.3s before the pill lands.

## creator — owner B — round 4 — status: 🟡 polish (one item)
1. ✅ Prove stamp: a cyan diamond stays on Prove after the rider passes (`r4/creator_t012.5`). Exactly right.
2. ✅ Rail dots now at x≈128, close to the text edge.
3. ✅ Web items use the Suede mark tile with domains (app.suedeai.ai, ip.suedeai.ai).
4. ✅ Platform sub-labels.
5. 🟡 **New:** stage-name activation crossfades a cyan italic copy over the white roman copy; mid-transition both are visible and "Make" reads doubled/smeared (`r4/t063.0`, x≈712–815, y≈345–390). Either keep the roman face and tween only the colour, or run the swap as a masked rise (old out up, new in from below) in ≤ 0.3s.
6. ✅ Headline swap at both boundaries.

## agent — owner B — round 4 — status: ✅ approved
All round-2/3 items fixed: track.mp3 pill fades before the Agent card (`r4/agent_t007.0`); three priced endpoints under x402.json (`r4/agent_t003.5`); terminal dims/shrinks for "build and sell"; em settles to ink when "23" lands; 23 aligned to the ERC-8004 row. (Boundary with creator: see Global 1, terminal entrance timing.)

## economy — owner B — round 4 — status: ✅ approved
Hub-to-finale match cut; partners hold ≥ 2s (t≈5.5–8.5, `r4/economy_t007.5`); "credits for humans & agents", "pay-per-call on Base", "app.suedeai.ai/rewards" sub-labels cover the remaining STORYBOARD facts. Stripe tile matches the partner-row Stripe mark.

## finale — owner B — round 4 — status: ✅ approved
Constellation now labels Suede Sing and Suede Lens tiles and adds A2A card, x402.json and Stripe Agentic Commerce; left labels start at x≈154 (≥ 120 safe). End card holds ≥ 2.5s. Optional micro-polish: a few inner-ring icons still sit on outer spokes (e.g. Tuner icon on the Studio Music spoke at ~(1247,470)).
