# AUDIT.md — Sense Build × DESIGN.md (prism on white stationery)

Walked every surface of the app and mapped it against the new system.
Verdicts: **KEEP** (already fits / untouched), **RESTYLE** (skin swap, structure
stays), **REBUILD** (the moment needs rethinking, not just repainting).
Status column tracks the transformation; updated as commits land.

## Current-state diagnosis (honest)

- **Palette:** warm-stationery world (`#F8F2EC` canvas, `#F4F3F0`/`#F7F7F5`
  surfaces) saturated with Zuper orange `#FD5000` as CTA/nav/selection/
  decoration, plus a full chromatic status ramp (green/blue/amber/red) and
  per-module pastel gradients in the gallery. → Collapse to gray ramp;
  prism gradient becomes the only chroma (AI activity); `--red`/`--blue`
  micro-accents where meaning is real.
- **Elevation:** ~6 bespoke shadow stacks (`0 14px 38px -34px…`,
  `0 12px 30px -26px…`, etc.), 1px `#E6E8EC` borders on almost everything.
  → One shadow, frosted layering, hairlines only.
- **Type:** `font-semibold`(600)-heavy hierarchy, system font stack. → DM Sans
  300/400/500, featherweight display signature.
- **Radius:** 6–24px scattered; some 3–8px (violates ≥10px). → Tailwind scale
  remapped ≥10px; cards 30px.
- **Motion:** good bones — consistent `cubic-bezier(0.23,1,0.32,1)`, two ad-hoc
  spring configs, `layoutId` already used on the composer. → Keep curves,
  centralize springs (`motion.ts`), add bouncy spring for zoom/shared elements.
- **AI states:** spinners + a removed PixelBlast experiment + flat gray
  thinking tray. → Prism glow/sweep everywhere the agent works.

## Surface map

| # | Surface | File(s) | Verdict | Notes | Status |
|---|---------|---------|---------|-------|--------|
| 0 | Design foundation | `styles/theme.css`, `styles/fonts.css`, `build/motion.ts`, `build/PrismGlow.tsx` | REBUILD | New @theme tokens, DM Sans, .glass, prism keyframes, spring presets | ⬜ pending |
| 1 | App shell + sidebar | `App.tsx`, `AppNavigation.tsx` | RESTYLE | Warm canvas → `#F8F8F8`; orange nav accents → ink ramp; sidebar frosted; Recent Apps rows neutral | ⬜ pending |
| 2 | Build home + composer | `BuildWorkspace.tsx` (home section) | RESTYLE | Hero "Build." → 300-weight display; composer frosted 30px; BorderGlow CTA → black pill; starter chips neutral; orange ambient washes → removed (idle = achromatic) | ⬜ pending |
| 3 | Thinking tray + frame | `BuildWorkspace.tsx` | REBUILD | Current flat-gray tray → frosted tray with prism breathing glow; frameTheme token object → prism activity frame; spinner stays only as micro-cue inside status pill | ⬜ pending |
| 4 | Conversation lane | `BuildWorkspace.tsx`, `ReasoningCard.tsx` | RESTYLE | Reasoning card chrome → glass; black check dots stay (achromatic ✓); clarify chips neutral; thought cards glass; summary bullets: orange dots → ink; version pills: green "current" → achromatic + dot icon | ⬜ pending |
| 5 | Materialization | `BuildWorkspace.tsx` `GenerationOverlay` | REBUILD | Stack-card overlay is good theatre — keep choreography, kill flat `#EEEDEA` field + per-phase accent colors; prism refraction sweep on active card, blur-to-sharp settle, gradient caption shimmer. Refine overlay: spinner card → prism materialization card | ⬜ pending |
| 6 | Generated app templates | `tokens.ts`, `ArCockpit.tsx`, `DispatchBoard.tsx`, `CommissionCalculator.tsx`, `RoofDrawCanvas.tsx`, `primitives.tsx` | RESTYLE | 65–93% token-driven already — rewrite `tokens.ts` to DESIGN.md; move DispatchBoard `PRIORITY_STYLE` + RoofDraw `EDGE_STYLE` into tokens; statuses → achromatic (danger keeps `--red`); priority → weight/ink ramp; RoofDraw edge colors are topology (data-viz) → grayscale + line-style differentiation | ⬜ pending |
| 7 | Gallery | `PublicAppGallery.tsx` | REBUILD | Per-module pastel gradient thumbs → frosted previews on prism under-glow (uniform studio look); modal pop → shared-element zoom (`layoutId` + bouncy spring); star amber → ink | ⬜ pending |
| 8 | Publish/share | `PublishAppDialog.tsx` | RESTYLE | Dialog glass 30px; mode tiles neutral; "Everyone" org-wide = blast radius → `--red` hairline + tinted confirm (the earned accent); publish CTA black pill | ⬜ pending |
| 9 | Side panels | `AuditPanel.tsx`, `AutomationPanel.tsx`, `CanvasInspector.tsx` | RESTYLE | Unified panel language: glass, hairlines, neutral pills; revert/orange → ink; audit before/after red/green → ink + strikethrough/weight; inspector active-orange → ink selection | ⬜ pending |
| 10 | ChatThread (in-app threads) | `ChatThread.tsx` | RESTYLE | PixelBlast orange tray → prism tray (shared treatment w/ #3); purple hover gradients → neutral; brand-orange pills → ink | ⬜ pending |
| 11 | Effects kit | `BorderGlow.tsx/.css`, `PixelBlast.tsx` | KEEP (repurposed) / RETIRE | BorderGlow: CSS prism-capable — kept for future use, off by default (CTA glow killed). PixelBlast (three.js): retired from UI; superseded by PrismGlow (cheaper, on-system) | ⬜ pending |
| 12 | Viewer + version preview chrome | `BuildWorkspace.tsx` | RESTYLE | Preview bar: orange Restore → black pill; viewer header neutral | ⬜ pending |
| 13 | Host chat app (ChatInterface, Radar, JobDetail, …) | `components/*.tsx` | KEEP (out of scope) | Brief targets Sense Build; host surfaces stay on legacy system except the shell (#1). Noted for a follow-up pass | — |

## Aceternity / effects decisions

- **Spotlight/hover cards (gallery):** custom `.glass` + prism under-glow beats
  a default Aceternity card — bent fully to DESIGN.md. Implemented natively.
- **Animated gradient backgrounds:** Aceternity's aurora/gradient patterns
  adapted into `PrismGlow` (pure CSS blobs + sweep keyframes, system tokens,
  no new deps — `motion/react`, `three`, `ogl` already present if shaders are
  needed later).
- **Text effects:** `.prism-text-shimmer` (masked gradient sweep) for streaming
  labels — Aceternity text-shimmer pattern, retokenized.
- **Existing custom components kept over kit swaps:** ReasoningCard, stacked
  GenerationOverlay choreography, drag-to-assign board — already better than
  generic replacements; restyled in place.

## Functionality guarantees (must not regress)

Conversation→canvas loop · clarify Q&A · cockpit parallel-preview clarify ·
refine thought-stream + summaries + version pills · version preview/restore ·
dual-lane editing (inspector/audit/automation) · Draft→Published→Shared
lifecycle + permission model · gallery browse/preview/use-template ·
threads · viewer RBAC redaction · reduced-motion paths.

Verified post-transform via production build + manual flow walk (see §Verify
in commit log).
