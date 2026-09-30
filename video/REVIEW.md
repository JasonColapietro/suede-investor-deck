# Suede Ecosystem Film — Design Review (live)

Reviewer: design director. Rubric = design-brief §6 checklist. Source of truth for facts = STORYBOARD.md.
Statuses: 🔴 blocking · 🟡 polish · ✅ approved. Items marked ✅ stay listed once resolved.

## Global — round 0 (pre-scene, shared system)

**Fact precedence (read first):** the design brief §2/§6 quotes deck numbers ("22 endpoints", "4 iOS apps", "Suede for Chrome").
STORYBOARD overrides it: on screen it is **9 iOS apps · 3 Android apps**, the x402 prices are the **three** listed endpoints
(`/create-music` $0.50 · `/agent/video` $4.99 · `/agent/image` $0.15), and the extensions are **Suede Sing** and **Suede Lens**.
Never show "22 endpoints", "4 iOS apps", "11 iOS apps" or "Suede for Chrome".

Shared-component issues in base.css / components.js (anyone may raise; whoever touches shared files should fix, or override per scene):
1. 🟡 `.node .ds` is 15px, `.browser .url` 15px, `.phone .sb` 14px, `.pill` 17px, `.fchrome` 17px: all under the 18px floor. The brief's floor is 18px for anything meant to be read (ideally 20px labels). UI texture inside devices can stay small only if it is not meant to be read.
2. 🟡 Card radius drift: `.node` 16px, `.card` 18px, `.browser`/`.popup` 14px, brief says 12px for all cards/panels (14px phone screen). Pick one (12px) and use it everywhere.
3. 🟡 `Film.link` packets are white-core circles. Brief §3.6: proof = 10px cyan diamond (rotated square), payment = 60x6 pill. Use the right shape for the story (creator flow = diamond; agent/economy = pill). Max 3 in flight on screen.
4. 🟡 `.node.lit` = cyan border + 1px cyan ring + cyan glow. Fine for the one hot node; never more than one or two lit at once (cyan budget ≤8%).
5. 🟡 Chrome chapter label swaps text instantly at scene start (`chap.innerHTML` each frame). It will hard-cut mid-crossfade. Crossfade/rise the chapter label over ~0.4s at each boundary (builder A owns chrome.js).
6. 🟡 `.phone` has a cyan outer glow on every phone (`0 0 80px -40px var(--accent-glow)`). Glow = live only; a fan of 3 phones will all glow. Consider dropping it on non-hero phones.
7. 🟡 `E.in` for exits is (.55,0,1,.45); brief exit is (.4,0,1,1). Minor, just be consistent.

Consistency targets I will check in every scene:
- Eyebrow top-left at x=120 (chrome lockup is at y=52, so scene eyebrows should start ≥ y=150 to not crowd it). Headline serif, one cyan `em` max.
- ≤ 3 type sizes per frame, ≥ 40% empty ground, 120px side margins.
- Node cards identical across map / creator / finale.
- Every scene fades its own root in/out (0.8s overlap), no hard pops at boundaries.

## Coverage checklist (updated each round)
| Surface | Where it appears | Status |
|---|---|---|
| 9 iOS apps (all named) | ios (planned) | pending |
| 3 Android apps | ios (planned) | pending |
| Suede Sing ext | chrome (planned) | pending |
| Suede Lens + Page Passport | chrome (planned) | pending |
| suedeai.ai / suedeai.org | ? | pending |
| app.suedeai.ai Create / Rewards / Developers / ERC-8004 dir | web (planned) | pending |
| Studio Music · Distro · IP Registry | web / creator (planned) | pending |
| Agent Studio · SEO · Social · Strumly · Muse · Sing web · GuitarHub · FretPulse web | web / creator (planned) | pending |
| x402 API + 3 prices | agent (planned) | pending |
| Discovery (llms.txt · x402 manifest · A2A card · MCP) | agent (planned) | pending |
| SDKs (pip suede-ai · @suedeai/mcp-server · @suedeai/agents · plugin-suede) | agent (planned) | pending |
| Stripe Agentic Commerce manifest | economy (planned) | pending |
| ERC-8004 3 registries + 23 identities | agent / map (planned) | pending |
| Producer on Virtuals ACP | agent (planned) | pending |
| Stripe credits · x402 USDC · $SUEDE (Solana) rewards · Telegram · X | economy (planned) | pending |
| 8 partners | economy (planned) | pending |

(No scenes rendered yet.)
