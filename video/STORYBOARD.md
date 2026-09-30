# Suede Ecosystem Film — Storyboard & Source of Truth

1920×1080, 30fps, 1:28 (bar-locked at 120 BPM). Brand: Suede AI Navy + Cyan (see `base.css`; full motion brief in the design brief).
Every on-screen fact below was verified against live Suede sites / App Store / Chrome Web Store on 2026-09-30.
**Do not put anything on screen that is not in this file.**

## Deliverables & how to rebuild
| File | Format | Built by |
|---|---|---|
| `suede-ecosystem.mp4` | 1:28 · 1920×1080 · 30fps | `python3 score.py full` → `node render2.mjs` |
| `suede-ecosystem-30s.mp4` | 0:30 · 1920×1080 | `python3 score.py social` → `python3 cut_social.py <graded master> <out>` |
| `suede-ecosystem-vertical.mp4` | 0:30 · 1080×1920 | `node overlay_render.mjs <overlay.mov>` → `python3 cut_vertical.py <30s cut> <overlay.mov> <out>` |

Needs `pip install imageio-ffmpeg numpy scipy pyloudnorm`. `render2.mjs` renders with 4 parallel workers and a 2-sample
(180°) motion blur, then grades (bloom, contrast, vignette, grain). For the social cuts, re-run its final grade step
at a high quality setting to keep a graded master to cut from. Cut timing: `WARP` in `scenes/_order.js` maps each scene
start onto a 2s bar; chunk lists live in `cut_social.py` and `cut_vertical.py`. `render.mjs --stills` is for quick stills.

## Verified surfaces

**iOS (9, Suede-published, listed at suedeai.ai/ios)** — icons in `icons/`
| App | Icon | One-liner (on-screen) | Cluster |
|---|---|---|---|
| Suede AI Generator | suede-ai-generator.jpg | AI music ideas & saved creative records | Make |
| Suede Guitar Tuner & Studio | suede-guitar-tuner-studio.jpg | Polyphonic strobe tuner & session capture | Practice |
| Suede Voice | suede-voice.jpg | Vocal range test & warmups | Practice |
| FretPulse | fretpulse.jpg | Guitar practice with real-time notation | Practice |
| GuitarHub | guitarhub.jpg | 21 guided beginner lessons | Practice |
| Suede Studio Muse | suede-studio-muse.jpg | Nightly songwriting prompts | Write |
| Suede Social | suede-social.jpg | Guitar community forum | Share |
| Suede Agent Studio | suede-agent-studio.jpg | Track agents & their earnings | Agents |
| Agentix | agentix.jpg | AI agent portfolio dashboard | Agents |

**Android (3):** Suede: AI Music Generator · Suede: Guitar Forum & Gear · Suede AI Agents: Directory.
(On screen: "9 iOS apps · 3 Android apps". Never claim "11 iOS apps".)

**Chrome extensions (2)**
- **Suede Sing** (Chrome Web Store, icon `icons/suede-sing.jpg`): side-panel vocal tuner, range test, warmups, YouTube sing-along pitch meter.
- **Suede Lens** (v1.0, direct download at suedeai.ai/lens): audits a page's rights, provenance, JSON-LD and AI-search signals; exports a **Page Passport**.

**Web**
- suedeai.ai (company hub) · suedeai.org (thesis & investor reading)
- app.suedeai.ai — account app: **Create** (prompt → music/video, stems), **Rewards**, Developers, ERC-8004 directory
- Suede Studio Music · **Suede AI Distro** (release & distribution) · **IP Registry** ip.suedeai.ai (file fingerprint + wallet-signed claim + contributors + timestamp, on Base & Avalanche)
- **Agent Studio** agents.suedeai.ai (build agent flows → publish as x402 pay-per-call endpoints)
- **Suede AI SEO** seo.suedeai.ai (GEO/AI-search practice) · Suede Social · Strumly (AI guitar coach) · Muse · Suede Sing web · GuitarHub · FretPulse web

**Agents & developers**
- **x402 API** (app.suedeai.ai/.well-known/x402.json): `POST /create-music` $0.50 · `/agent/video` $4.99 · `/agent/image` $0.15 — USDC on Base
- Discovery: llms.txt · x402 manifest · A2A agent card · MCP (suedeai.ai/mcp)
- SDKs: `pip install suede-ai` · `@suedeai/mcp-server` · `@suedeai/agents` (`suede` CLI) · `@suedeai/plugin-suede` (ElizaOS)
- Stripe Agentic Commerce manifest (credits for humans & agents)
- **ERC-8004 on Base**: Identity · Reputation · Validation registries — **23 agent identities**
- **Producer by Suede AI** — hireable agent on Virtuals ACP

**Economy & community**: Stripe credits & plans · **$SUEDE** (Solana) holder rewards at app.suedeai.ai/rewards · Telegram t.me/suedeai · X @AISUEDE
**Partners (logos in ../assets/partners)**: Base · Stripe · Chainlink · LayerZero · Virtuals · AgentCash · Google Cloud · ChainGPT

## Integration flows (the "how it fits together")
1. **Creator journey:** Practice (Strumly, Tuner & Studio, FretPulse, GuitarHub, Voice, Sing ext) → Write (Muse) → Make (Create, AI Generator, Studio Music) → **Prove** (IP Registry) → Release (Distro) → Share (Social). One Suede account throughout.
2. **Agent buys media:** discover (llms.txt / x402.json / agent card / MCP) → `POST /create-music` → **HTTP 402 + price** → signs USDC on Base → 202 + poll → MP3.
3. **Build & sell an agent:** `suede` CLI → Agent Studio → published as x402 endpoint → registered in ERC-8004 identity → owner monitors in Agent Studio / Agentix iOS.
4. **Trust:** ERC-8004 identity + reputation + validation; Producer hired via Virtuals ACP uses the same endpoints.
5. **Visibility:** Suede Lens → Page Passport → Suede AI SEO repair work.
6. **Value:** Stripe credits (humans) + x402 USDC (agents) + $SUEDE rewards (holders) → all against one account.

## Scene plan (files in `scenes/`, order in `scenes/_order.js`)
| # | id | ~dur | Chapter | Beat |
|---|---|---|---|---|
| 1 | `open` | 8 | — (no chrome) | Mark draws on; "Every surface. *One spine.*" |
| 2 | `map` | 11 | 01 · The map | Hub + six orbit clusters (Web · iOS · Chrome · Agents & API · On-chain · Economy) with counts; lines draw out from hub |
| 3 | `ios` | 16 | 02 · iOS | 9 real app icons land into a grid grouped Practice / Write / Make / Share / Agents; 3 phones fan with rebuilt screens; Android row "+3 on Android" |
| 4 | `chrome` | 13 | 03 · Chrome | Browser window: Suede Sing side panel over a video with live pitch meter; cut to Suede Lens popup generating a Page Passport |
| 5 | `web` | 12 | 04 · Web | app.suedeai.ai: Create → IP Registry proof card → Distro; Agent Studio canvas; SEO |
| 6 | `creator` | 14 | 05 · Creator flow | Horizontal rail Practice→Write→Make→Prove→Release→Share, surface icons dropping onto each station, a cyan "proof" diamond riding the rail |
| 7 | `agent` | 15 | 06 · Agent flow | Terminal: `POST /create-music` → `402 Payment Required $0.50` → USDC on Base → `200` MP3; side: CLI → Agent Studio → ERC-8004 ID #, Producer on Virtuals |
| 8 | `economy` | 10 | 07 · Value | Three streams (Stripe credits · x402 USDC · $SUEDE rewards) converge into one account; partner logo row |
| 9 | `finale` | 12 | — | Full constellation, every surface lit and connected, packets flowing; "The ownership layer for the AI media era." suedeai.ai |

## Engine contract
- `Film.scene({id, dur, overlap?, chapter:['02','iOS apps'], chrome?:false, build(root){...; return (t,dur)=>{...}}})`
- Everything must be a pure function of local time `t`. No CSS transitions/animations, no Date/Math.random (use `Film.rand(seed)`).
- Scenes crossfade: handle your own fade-in over the first ~0.8s and fade-out over the last ~0.8s (use `Film.env(t,0,dur)` on root opacity).
- Helpers in `components.js`: `node`, `phone`, `browser`, `layer`, `link` (draw + packets), `lines` (masked text rise), `type`.
- Layout: 120px safe margins, keep 40%+ negative space, text ≥18px, cyan ≤ ~8% of frame, one idea per beat.
