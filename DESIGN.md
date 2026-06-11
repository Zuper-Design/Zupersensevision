# DESIGN.md — Sense Build · "Prism on White Stationery"

Adapted from the Dia Browser design system for a working product UI.
This file is law. Every visual value in the app traces back to a token here.
Tokens are enforced in code via `src/styles/theme.css` (Tailwind v4 `@theme`)
and `src/app/components/build/tokens.ts` (generated-app runtime tokens).

---

## 1. Surfaces & Elevation

One canvas, one card treatment, one shadow. No hard borders.

| Token | Value | Use |
|---|---|---|
| `--canvas` | `#F8F8F8` | Page/app background. Everything floats on this. |
| `--glass` | `rgba(255,255,255,0.9)` + `backdrop-blur(24px)` | Card surface. Apply via `.glass` utility. |
| `--surface` | `#FFFFFF` | Opaque card fallback (perf-sensitive areas, large tables). |
| `--recessed` | `rgba(0,0,0,0.04)` | Inset fields, wells, inactive segmented controls. |
| `--shadow-card` | `0 2px 8px rgba(0,0,0,0.08)` | THE shadow. The only one. |
| `--hairline` | `rgba(0,0,0,0.06)` | Where a divider is structurally unavoidable. Never a full card border. |

- Card radius: **30px** (`rounded-card`). Inner tiles/controls: 10–16px.
- **Nothing sharper than 10px anywhere.** Tailwind radius scale is remapped
  (`rounded-sm`→10px and up) so utility classes can't violate this.
- Elevation = frosted layering (glass over canvas over glass), not shadow ramps.
  The single shadow communicates "lifted"; blur communicates "above".

## 2. Typography

One family, three weights, nothing above 500.

- **Family:** `DM Sans` (300/400/500). *Adaptation note: the Dia reference uses
  ABC Oracle, which isn't freely licensed; DM Sans is the stand-in — closest
  freely-available match for its geometric-humanist light cuts.*
- **Weights:** 300 (display), 400 (body), 500 (emphasis/labels). 600/700 are
  banned; hierarchy comes from size + weight contrast at the light end.
- **Display signature:** featherweight 300 with tight negative tracking
  (`-0.03em` to `-0.05em`). Used for: Build home hero, gallery header,
  empty states, the materialization caption.
- **App-density ramp** (Dia's 72px marketing heroes translated down):

| Role | Size / weight / tracking |
|---|---|
| Display (hero, empty states) | 44–56px · 300 · -0.04em |
| Title (section, dialog) | 20–26px · 300 · -0.03em |
| Heading (card) | 15–16px · 500 · -0.01em |
| Body | 13.5–14px · 400 |
| Label / meta | 11–12.5px · 500 · `--ink-2` |
| Micro / mono | 10.5–11px · 400 |

## 3. Color — Near-Achromatic

The gray ramp does all the everyday work:

| Token | Value | Use |
|---|---|---|
| `--ink` | `#000000` | Primary text, primary (dark) buttons |
| `--ink-2` | `#636363` | Secondary text, icons |
| `--ink-3` | `#959595` | Muted text, placeholders, inactive icons |
| `--ink-4` | `#D9D9D9` | Faint text, neutral button fill, disabled |

**Rationalized away:** the legacy Zuper orange `#FD5000` as UI chrome, all
decorative pastels, the green/blue/amber status palette. Status is now carried
by the gray ramp + icons + labels (a filled black dot reads "done", an outline
dot reads "pending") — color never does the work alone.

**Permitted chroma (micro-accents only, never fills/buttons/text-color-at-size):**

| Token | Value | Earned by |
|---|---|---|
| `--red` | `#E5484D` | Errors, destructive confirms, the org-wide blast-radius moment |
| `--blue` | `#3E63DD` | Rare informational accent (live/share state) |

## 4. The Prism Gradient — the Only Chromatic Element

The spectrum gradient is the signature of **AI activity** and nothing else.
When the agent thinks, streams, or materializes components, the gradient is
how the interface breathes.

```css
--prism-pink:     #F6A0E4;
--prism-red:      #FF7A6B;
--prism-amber:    #FFC56B;
--prism-lavender: #C0AFFF;
--prism-blue:     #6FA8FF;
--gradient-prism: linear-gradient(105deg, var(--prism-pink), var(--prism-red),
                  var(--prism-amber), var(--prism-lavender), var(--prism-blue));
```

Rules:
- Appears as **ambient glow, sweep animation, refraction, under-light** —
  blurred, low-opacity, behind or beneath frosted surfaces.
- **Never** as text color, button fill, icon tint, or border at rest.
- Idle interface = fully achromatic. Gradient present ⇒ the AI is working.
- Implemented via `PrismGlow` (ambient blob field), `.prism-sweep`
  (animated gradient band), and `.prism-text-shimmer` (streaming-label
  treatment, masked to text but transient).

## 5. Buttons & Controls

- **Primary:** black pill (`--ink`, white label, 400/500 weight). *Adaptation:
  Dia's marketing pages get away with only neutral buttons; a working tool
  needs one unambiguous primary affordance — black is the loudest value the
  achromatic ramp allows.*
- **Secondary:** `--ink-4` neutral pill or ghost pill (transparent, hairline).
- **Destructive:** ghost with `--red` text — fills only at the confirm step.
- No colored CTAs. No orange. Pills everywhere (radius ≥ 10px).

## 6. Motion

Base (per Dia): `0.2s ease` for micro-interactions; theatrical
`cubic-bezier(0.23, 1, 0.32, 1)` for gradient sweeps and reveals.

**Deliberate departure from the Dia doc** (documented override): Dia is
smooth-curves-only; this product layers **spring physics** on top so it feels
alive — liquid glass, bouncy, Apple-y:

```ts
// src/app/components/build/motion.ts
springs.snappy  = { type: 'spring', stiffness: 480, damping: 36 }  // controls, toggles
springs.smooth  = { type: 'spring', stiffness: 320, damping: 32 }  // panels, drawers
springs.bouncy  = { type: 'spring', stiffness: 300, damping: 22 }  // gallery zoom, shared elements, gestures
easings.exit    = [0.23, 1, 0.32, 1]                                // sweeps, reveals
```

- Springs: gestures, gallery zoom, shared-element transitions, drawers.
- Eased curves: opacity, gradient sweeps, color crossfades.
- Reduced-motion is always respected (existing `reduceMotion` plumbing kept).

## 7. AI Moments (the product-defining states)

- **Thinking:** prism glow breathes beneath the frosted composer tray; label
  uses `.prism-text-shimmer` while streaming, settles to `--ink-2` when done.
- **Materialization:** components refract into existence — prism light sweep
  + blur-to-sharp + spring settle. Spinners are banned at signature moments;
  the gradient *is* the progress indicator.
- **Gallery:** frosted preview cards with a soft prism under-glow on hover;
  gallery→preview is one continuous shared-element zoom (`springs.bouncy`).
- **Blast radius:** publishing org-wide renders calm but unmissable — `--red`
  hairline + tinted confirm, the one place chrome earns color.

## 8. Generated Apps Inherit the System

Everything Sense Build outputs reads from `tokens.ts`, which mirrors this file:
same canvas, glass, single shadow, gray ramp, banned-bold typography. Every
generated app ships from the same studio regardless of prompt quality.

## 9. Adaptations Log (Dia doc → product UI)

1. ABC Oracle → **DM Sans** 300/400/500 (license).
2. 72px heroes / 120px gaps → 44–56px display, 12–24px working rhythm.
3. Buttons: added **black primary pill** to Dia's neutral-only set (tool needs
   one primary affordance).
4. Motion: added **spring layer** for gestures/zoom/shared elements (override
   §6); Dia curves kept for sweeps/micro.
5. Status: collapsed to achromatic + iconography; `--red`/`--blue` reserved
   per §3.
6. Frosted glass budget: `backdrop-blur(24px)` only on floating layers
   (cards over content, dialogs, overlays) — large static tables use opaque
   `--surface` to keep scroll performance.
