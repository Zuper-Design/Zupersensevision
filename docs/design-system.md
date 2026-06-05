# Design System

Reference for the Zupersense / Agent Studio UI. Values are extracted from the actual
codebase (Tailwind arbitrary values + `src/styles/theme.css`), ranked by frequency.

> **Reality check:** `theme.css` ships shadcn semantic tokens (`--primary`, `--border`, …),
> but **almost all product UI hardcodes arbitrary hex values** (`bg-[#1C1E21]`, `border-[#E6E8EC]`).
> The shadcn tokens only drive the `ui/*` primitives. The tables below document the *real*
> hardcoded palette and propose canonical tokens to migrate toward.

---

## Color tokens

### Text / foreground
| Token | Value | Usage | Count |
| --- | --- | --- | --- |
| `text-primary` | `#1C1E21` | Primary text, dark buttons | 1517 |
| `text-secondary` | `#6B7280` | Secondary text, muted labels, icons | 801 |
| `text-tertiary` | `#9CA3AF` | Placeholder, captions, disabled-ish | 689 |
| `text-quaternary` | `#4B5563` | Secondary (darker) — overlaps `#6B7280` | 165 |
| `text-disabled` | `#C0C4CC` | Disabled placeholder (custom inputs) | 34 |

> ⚠️ `#6B7280` and `#4B5563` both serve "secondary text." **Canonical: `#6B7280`.**
> Brown-tinted text (`#6D5F63`, `#4A3D40`, `#221E1F`) belongs to the AU/Radar theme — keep scoped, don't use globally.

### Surfaces / backgrounds
| Token | Value | Usage |
| --- | --- | --- |
| `bg-base` | `#FFFFFF` | Cards, modals, inputs |
| `bg-subtle` | `#F8F9FB` | Hover fills, page tint |
| `bg-muted` | `#F3F4F6` | Icon-button hover, chips |
| `bg-row` | `#F0F1F3` | List-row / message bg, dividers |

> ⚠️ Hover fills split between `#F8F9FB` (cool) and `#F3F4F6` (slightly darker) and a stray `#EEEEEE`.
> **Canonical hover fill: `#F3F4F6`.**

### Borders
| Token | Value | Usage | Count |
| --- | --- | --- | --- |
| `border-default` | `#E6E8EC` | Cards, inputs, dividers | 821 |
| `border-subtle` | `#F0F1F3` | Faint dividers | 115 |
| `border-strong` | `#D1D5DB` | Emphasis / scrollbar hover | 67 |

> ⚠️ Near-duplicate border grays in the wild: `#ECEEF1`, `#EEF0F3`, `#E0E2E6`, `#E5E7EB`, `#C4C8D0`.
> **Canonical: `#E6E8EC`.** Collapse the others.

### Brand / accent
| Token | Value | Usage |
| --- | --- | --- |
| `brand` | `#FD5000` | Primary CTAs, brand badges (184×) |
| `brand-accent` | `#FF6B35` | Focus rings, hover tints (129×) |
| `brand-sense` | `#EB5D2A` | Sense logo squares only |

> ⚠️ **Three oranges.** `#FD5000` (action) and `#FF6B35` (focus/hover) are used interchangeably and
> are visibly different. **Canonical brand orange: `#FD5000`.** Use one orange at varying opacity
> for focus (`/10`–`/40`) rather than a second hue. `#EB5D2A` is logo-art, leave it.

### Semantic status
| Token | Value | Tint bg |
| --- | --- | --- |
| `success` | `#10B981` | `#ECFDF5` / `#F0FDF4` |
| `success-strong` | `#15803D` | — |
| `warning` | `#F59E0B` | `#FFF7ED` / `#FFF4ED` |
| `error` | `#EF4444` | `#FEF2F2` |
| `error-strong` | `#DC2626` | — |
| `info` | `#3B82F6` | `#EFF6FF` |
| `info-strong` | `#2563EB` | — |

> ⚠️ Error has **three reds**: `#EF4444` (88×), `#DC2626` (38×), `#D4183D` (theme `--destructive`).
> **Canonical: `#EF4444`** for fills, `#DC2626` for hover/pressed. Drop `#D4183D`.

### AI / Agent (purple family)
| Token | Value | Usage |
| --- | --- | --- |
| `ai` | `#6366F1` | Agent Studio, AI accents (83×) |
| `ai-alt` | `#7C3AED` / `#8B5CF6` | Gradients |
| tint bg | `#F5F3FF` | AI surface tint |

---

## Typography

Base: `--font-size: 16px`, weights `--font-weight-normal: 400`, `--font-weight-medium: 500`.

### Size scale (`text-[Npx]`, by frequency)
| Token | px | Usage | Count |
| --- | --- | --- | --- |
| `text-xs` | 11 | Captions, eyebrows, meta | 259 |
| `text-sm` | 12 | Compact labels, chips | 393 |
| `text-base` | 13 | **Default body / button text** | 448 |
| `text-md` | 14 | Body, list items, sidebar | 332 |
| `text-lg` | 15 | Chat input, emphasis | 86 |
| `text-xl` | 18 | Section titles | 29 |
| `text-2xl` | 20 | Page headings | 26 |
| `text-3xl` | 22–24 | Hero headings | 34 |

> ⚠️ Sub-10px sizes (`text-[5–9px]`, ~50× total) are mostly decorative micro-labels — fine, but
> below 11px fails accessibility for real content. Also seen: `13.5px`, `12.5px` one-offs → snap to the scale.

### Weights
| Token | Value | Count |
| --- | --- | --- |
| `font-normal` | 400 | 21 |
| `font-medium` | 500 | 489 |
| `font-semibold` | 600 | 659 |
| `font-bold` | 700 | 73 |

> `font-semibold` is the de-facto default for labels/buttons; `font-medium` for body emphasis.

---

## Spacing

Standard Tailwind 4px scale. Dominant gaps: `gap-2` (8px, 333×), `gap-1.5` (6px, 289×),
`gap-3` (12px, 179×), `gap-1` (4px, 127×). Common paddings: `px-3 py-2`, `px-4 py-2.5`, `p-5`, `px-6 py-6`.

> Default control gap = **`gap-2`**; tight icon+label = **`gap-1.5`**.

---

## Border radius

`--radius: 0.625rem` (10px) in theme; product code uses fixed Tailwind steps.

| Token | Value | Usage | Count |
| --- | --- | --- | --- |
| `rounded-md` | 6px | shadcn primitives (inputs, buttons) | 274 |
| `rounded-lg` | 8px | **Buttons, inputs, small cards** | 617 |
| `rounded-xl` | 12px | **Cards, tiles, list rows** | 223 |
| `rounded-2xl` | 16px | Modals, large cards | — |
| `rounded-full` | pill | Pills, avatars, icon buttons | 442 |

> ⚠️ `rounded-[12px]` is used redundantly alongside `rounded-xl` (identical). And `rounded-[16px]`
> duplicates `rounded-2xl`. **Use the named steps**, drop arbitrary px radii.
> Canonical ladder: control **8px**, card **12px**, modal **16px**.

---

## Shadows

| Token | Value | Usage |
| --- | --- | --- |
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.04)` | Resting card (39×) |
| `shadow-card-sm` | `0 2px 8px rgba(0,0,0,0.04)` | Resting card alt (7×) |
| `shadow-hover` | `0 4px 12px rgba(0,0,0,0.10)` | Card/button hover (26×) |
| `shadow-pop` | `0 8px 20px rgba(0,0,0,0.08)` | Popovers, lifted cards |
| `shadow-modal` | `0 20px 60px rgba(0,0,0,0.15)` | Modal panels |
| `focus-ring-brand` | `0 0 0 3px rgba(255,107,53,0.1)` | Input focus glow |

> ⚠️ Resting-card shadow has ~6 micro-variants (`0_1px_2px`, `0_2px_8px`, `0_2px_12px`,
> `0_1px_4px`…). **Canonical resting: `0 1px 3px rgba(0,0,0,0.04)`; hover: `0 4px 12px rgba(0,0,0,0.10)`.**

---

## Breakpoints

Tailwind defaults; usage is sparse — this is a desktop-first app.
`md:` (34×) is the main responsive lever, then `sm:` (24×), `lg:` (12×), `xl:` (3×).

| Token | Min width |
| --- | --- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

---

## Component patterns

### Buttons
Source of truth is `ui/button.tsx` (cva), but product code overwhelmingly uses inline classes.

| Variant | Canonical recipe |
| --- | --- |
| **Primary (solid)** | `bg-[#1C1E21] hover:bg-black text-white rounded-lg px-4 py-2.5 text-[13px] font-semibold hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] active:scale-[0.98]` |
| **Brand CTA** | `bg-[#FD5000] hover:bg-[#E04800] text-white rounded-lg shadow-[0_4px_12px_rgba(253,80,0,0.3)]` |
| **Secondary / outline** | `bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/30 text-[#1C1E21] rounded-lg h-9 px-3 text-[13px] font-medium active:scale-[0.98]` |
| **Ghost** | `rounded-lg hover:bg-[#F3F4F6] transition-colors` |
| **Icon-only** | `w-9 h-9 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#4B5563] hover:bg-[#F3F4F6]` |
| **Destructive** | `bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-lg` |

States: `disabled:opacity-50 disabled:pointer-events-none`; press `active:scale-[0.97–0.98]`
with `transition: transform 140ms cubic-bezier(0.23,1,0.32,1)`.

> ⚠️ Inconsistencies: dark-primary uses `#1C1E21`, some CTAs use `#FD5000`, some use a
> `#221E1F → #0f0d0e` gradient. Press-scale & hover-shadow applied unevenly.
> **Canonical:** dark neutral primary = `#1C1E21`; brand CTA = `#FD5000`; always include `active:scale-[0.98]`.

### Inputs
| Property | Canonical | shadcn primitive | Custom (AgentBuilder) |
| --- | --- | --- | --- |
| Height | `h-10` (40px) | `h-9` (36px) | `h-10` |
| Radius | `rounded-lg` (8px) | `rounded-md` (6px) | `rounded-lg` |
| Border | `border-[#E6E8EC]` | `border-input` | `#E6E8EC` |
| Text | `text-[13px] text-[#1C1E21]` | `text-base` | `text-[13px]` |
| Placeholder | `text-[#9CA3AF]` | `text-muted-foreground` | `#C0C4CC` |
| Focus | `border-[#FD5000]/40 ring-2 ring-[#FD5000]/10` | `ring-ring/50 ring-[3px]` | `border-[#1C1E21]` |
| Disabled | `opacity-50 cursor-not-allowed` | same | — |

Search field: `relative` wrapper + abs icon `left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]` + input `pl-9`.

> ⚠️ Three focus treatments coexist: orange ring (chat/search), solid `#1C1E21` border
> (AgentBuilder), shadcn ring. Heights 32/36/40px all appear.
> **Canonical: `h-10`, `rounded-lg`, `#E6E8EC` border, brand-orange focus ring.**

### Cards
| Property | Canonical |
| --- | --- |
| Container | `bg-white border border-[#E6E8EC] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)]` |
| Padding | `p-5` (content card) / `px-6 py-6` (large) / `p-2.5` (list row) |
| Hover (interactive) | `hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]` |
| Hover (list row) | bg only: `hover:bg-[#F8F9FB]` |
| Active | `active:scale-[0.985] active:translate-y-0` |

> ⚠️ Borders drift across `#E6E8EC` / `#ECEEF1` / `#EEF0F3` / `#E0E2E6`; radii across
> `rounded-xl` / `rounded-2xl` / `rounded-[12px]`; resting shadows have ~6 variants.
> **Canonical: `#E6E8EC` border, `rounded-xl` (12px), `shadow-card` resting / `shadow-hover` on hover.**

### Modals
| Property | Canonical |
| --- | --- |
| Backdrop | `fixed inset-0 bg-black/50 backdrop-blur-sm` |
| Panel | `bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6` |
| Header | `px-6 py-5 border-b border-[#E6E8EC]` — title `text-[16px] font-semibold`, subtitle `text-[12px] text-[#9CA3AF]` |
| Close button | `p-1.5 rounded-lg hover:bg-[#F3F4F6]` (top-right) |
| Footer | `px-6 py-4 border-t border-[#E6E8EC] flex justify-end gap-3` |
| Enter anim | backdrop fade 160ms; panel `scale 0.96→1, y 10→0` 200ms `cubic-bezier(0.22,1,0.36,1)` |
| Drawer (sheet) | slide from right, `w-3/4 sm:max-w-sm`, 500ms in / 300ms out |

> ⚠️ Backdrop opacity ranges `/30`–`/60`; z-index jumps `50 / 100 / 200 / 300`; radius
> `rounded-lg` / `rounded-2xl` / `[16px]`; max-widths from 420px to 980px.
> **Canonical:** backdrop `bg-black/50 backdrop-blur-sm`; panel `rounded-2xl`,
> `shadow-[0_20px_60px_rgba(0,0,0,0.15)]`. **Z-index ladder:** primitives `50`, standard modal `100`,
> elevated/nested `200`, top-most (personalization/releases) `300`.

---

## Top inconsistencies to fix (priority order)
1. **Brand orange** — collapse `#FD5000` / `#FF6B35` → **`#FD5000`** (use opacity for focus).
2. **Border grays** — 6 near-duplicates → **`#E6E8EC`**.
3. **Radius arbitrary px** — `rounded-[12px]/[16px]` → named `rounded-xl` / `rounded-2xl`.
4. **Resting card shadow** — 6 variants → **`0 1px 3px rgba(0,0,0,0.04)`**.
5. **Error red** — `#EF4444` / `#DC2626` / `#D4183D` → **`#EF4444`** (+ `#DC2626` hover).
6. **Input focus** — 3 treatments → brand-orange ring everywhere.
7. **Modal z-index / backdrop / radius** — adopt the ladder + canonical panel above.
8. **Secondary text** — `#6B7280` vs `#4B5563` → **`#6B7280`**.
</content>
</invoke>
