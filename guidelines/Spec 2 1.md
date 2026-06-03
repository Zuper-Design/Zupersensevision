# Sense Build — App Generation & Design Guide

> The contract Sense follows when generating customer apps, so output looks and behaves like **native Zuper** — not generic AI UI. Applies to both the prompt-first lane (ops admins) and the editable canvas (power users), and to apps built directly against the exposed APIs.
> 
> **How to read this doc:** sections marked 🔌 are _plug-in points_ — replace the example values with Zuper's real design tokens / component names. Everything else is generation logic that holds regardless of the specific token values.

---

## 0. Operating principle

Generated apps must be **systematically consistent**, not individually expressive. This is the opposite of one-off creative UI: every app a customer builds should feel like it shipped from Zuper's own product team. That means:

- **Reuse the real component library** — never hand-roll a primitive (table, board, scheduler, status pill) that already exists. Reusing native components inherits Zuper's look, its RBAC behavior, and its accessibility for free.
- **One design system, applied uniformly** — no per-app font/theme variation, no bold/maximalist detours. Consistency is the feature.
- **Avoid the generic-AI tells** — no purple-gradient-on-white, no centered hero cards, no cookie-cutter dashboard-template look, no system-default fonts. Apps look like Zuper because they use Zuper's tokens, not because they're "designed" fresh.
- **Data leads, chrome recedes** — FSM users are dense-data, scan-heavy operators. Favor information density and legibility over whitespace and decoration.

---

## 1. 🔌 Design foundation (plug in Zuper's real system)

Sense pulls every visual value from tokens. **Replace the example column with Zuper's actual token values and names.** Do not let Sense emit raw hex/px — only tokens.

### 1.1 Color tokens

|Token|Role|Example (replace)|
|---|---|---|
|`color.brand.primary`|Primary actions, active nav|`#2F6BFF`|
|`color.brand.subtle`|Tints, selected rows|`#EAF1FF`|
|`color.bg.surface` / `color.bg.canvas`|Card vs page background|`#FFFFFF` / `#F6F7F9`|
|`color.text.primary` / `.secondary` / `.muted`|Text ramp|`#16191D` / `#5A6470` / `#8A929E`|
|`color.border.default` / `.strong`|Dividers, inputs|`#E3E6EA` / `#C7CCD3`|

### 1.2 🔌 Semantic status colors (FSM-specific — keep universal & consistent)

These are _not_ decorative. Every generated app maps status to the **same** color so a dispatcher reading two different apps never re-learns the legend.

|Meaning|Token|Typical use|
|---|---|---|
|Neutral / draft|`status.neutral` (grey)|Draft quote, unscheduled job|
|Scheduled / info|`status.info` (blue)|Scheduled, sent, in-progress|
|Success / done|`status.success` (green)|Completed, paid, accepted|
|At-risk / due|`status.warning` (amber)|Due soon, awaiting approval, partial|
|Critical / failed|`status.danger` (red)|Overdue, SLA breach, cancelled, failed|
|Priority scale|`priority.low/med/high/urgent`|Job/ticket priority|

> Rule: **overdue / SLA-breach is always `danger`; never repurpose a status color for decoration.**

### 1.3 Scale tokens

|Group|Tokens (example)|
|---|---|
|Spacing|`space.1=4` … `space.6=24` `space.8=32` (4px base)|
|Radius|`radius.sm=6` `radius.md=10` `radius.pill`|
|Elevation|`elev.0` (flat) `elev.1` (card) `elev.2` (popover)|
|Type ramp|`text.display / h1 / h2 / body / label / caption` + 🔌 Zuper's font family|
|Icon set|🔌 Zuper's icon library — one set only|

---

## 2. 🔌 Component inventory (generate from these, never invent)

Sense selects from this fixed palette. Each maps to a real Zuper component.

- **DataTable** — sortable/filterable rows; the default for record lists.
- **Scheduler / DispatchGrid** — resource rows × time axis; for anything time-based.
- **Board (Kanban)** — status columns + draggable cards; for status-based triage _only_.
- **Card / RecordCard** — compact summary of one record.
- **MetricStat** — single KPI with label, value, delta.
- **Chart** — bar / line / donut, drawing fills from status tokens.
- **Form / Field set** — typed inputs, inline validation.
- **Button** (`primary` / `secondary` / `ghost` / `danger`).
- **StatusPill / Badge** — status & priority, colored from §1.2.
- **FilterBar** — bound to query params.
- **Drawer / Modal** — record detail, write confirmation.
- **EmptyState / Skeleton / ErrorState / NoAccessState** — required states (§8).

---

## 3. Generation pipeline (prompt → app)

Sense runs these steps in order for every request:

1. **Classify intent → archetype** (§4). "Dispatch board," "AR cockpit," "customer portal" each resolve to a different layout family.
2. **Resolve data** — map to entities/fields/filters against the live schema; **ask back on ambiguity** rather than guessing. Bind to stable IDs, not labels.
3. **Pick layout archetype** — choose the canonical template for that archetype.
4. **Select components** (§5 decision logic) and bind each to its query.
5. **Apply tokens & states** — colors/spacing/type from §1; wire empty/loading/error.
6. **Wire actions** — reads and writes; writes get preview + confirm + audit.
7. **Scope to viewer permissions** — bindings re-run under the viewer's RBAC.
8. **Render preview + Plan chip** — show what was built and the query behind it.

---

## 4. Archetypes → layout patterns

The core mapping. Each archetype has a canonical layout, component set, and emphasis.

### 4a. Operational cockpit / dashboard

_(AR collections, owner morning-flash, branch scorecard)_ Layout: **MetricStat row across the top → FilterBar → one or two DataTables / Charts.** Reading order left→right by priority. Dense, scannable. Inline row actions for writes (send reminder, reassign). Emphasis: status pills and the most-actionable column first.

### 4b. Dispatch / scheduler board ⚠️ _not a kanban_

_(the canonical "build me a dispatch board")_ Layout: **resource rows (technicians) × horizontal time axis** (day-by-hour or week-by-day), jobs rendered as blocks positioned by scheduled start + duration, with an **Unassigned backlog tray** docked to the side. Dragging a job onto a lane at a time writes _both_ assignee and schedule slot. Must surface **overlap/double-booking, travel-gap, and utilization** — the things a column of cards cannot show. **Use `Scheduler/DispatchGrid`, never `Board`, whenever a time axis is involved.**

### 4c. Triage / kanban board

_(unscheduled-job triage, lead pipeline by stage)_ Layout: **status columns + draggable cards.** Use **only** when the organizing axis is _status_, not time. Dragging a card changes status/owner, not schedule.

### 4d. Process / pipeline tracker

_(solar install: survey→permit→install→inspection→PTO; quote→job)_ Layout: **horizontal stage lanes or a stepper**, count + value per stage, click-through to records. Emphasis on conversion and stuck-stage detection.

### 4e. Record mini-app / form

_(JSA capture, inspection checklist, intake form)_ Layout: **sectioned form**, logical grouping, inline validation, write-preview before submit. Conditional fields driven by data. Emphasis: clear single primary action.

### 4f. Report / analytics

_(first-time-fix, commission calc, utilization)_ Layout: **summary MetricStats → Charts → backing DataTable → export.** Charts pull fills from status tokens. Read-only by default.

### 4g. External-facing portal _(see §10)_

_(customer self-service, subcontractor, property-manager portal)_ Layout: **mobile-first, minimal chrome, one clear primary action per screen**, customer branding applied, trust/security cues. Stripped of internal ops density.

---

## 5. Component selection decision logic

Sense resolves the right primitive deterministically (this is what prevents the kanban-as-dispatch-board mistake):

- Organizing axis is **time / schedule**? → **Scheduler/DispatchGrid**.
- Organizing axis is **status**, items move between buckets? → **Board (Kanban)**.
- Organizing axis is **stage / funnel**, forward-only? → **Pipeline tracker**.
- Need to **scan/sort/filter many records** with multiple fields? → **DataTable**.
- A **single headline number**? → **MetricStat**. Trend/comparison? → **Chart**.
- **Create/edit one record**? → **Form**. View one record? → **Card / Drawer**.

When two fit, prefer the **densest legible** option for ops users and the **simplest** option for external portals.

---

## 6. Content & microcopy

- **Buttons are verbs**: "Assign," "Send reminder," "Approve," "Create invoice" — never "Submit"/"OK."
- **Write confirmations name the effect and scope**: "Assign 4 jobs to Maria for Tue 9–11am?" not "Are you sure?"
- **Empty states are instructive**, not blank: "No unassigned jobs this week. Jobs appear here when they're created without a technician."
- **Numbers carry units/currency/timezone**; dates respect the org's locale.
- Tone: plain, operational, confident. No marketing voice inside tools.

---

## 7. Accessibility & responsiveness

- Status is **never color-only** — always pair with a label/icon (colorblind safety).
- Tables and boards are **keyboard-navigable**; drag actions have a keyboard fallback.
- Contrast meets WCAG AA against `color.text.*` tokens.
- Touch targets ≥ 44px on portals/mobile; ops grids may be denser on desktop.

---

## 8. Required states (every app)

Sense always generates these, matched to the layout:

- **Loading** — skeletons shaped like the final layout (table rows, board columns).
- **Empty** — instructive copy + the relevant create action if permitted.
- **Error** — readable message + retry, never a raw stack trace.
- **No-access** — when the viewer lacks permission to a binding (per inversion rule).
- **Binding-broken** — when a field/entity changed; show a fixable prompt, don't drop data silently.

---

## 9. Write-safety presentation

- Destructive/bulk writes use the **`danger` button** + a confirm Drawer summarizing _what, how many, scope_.
- Show **optimistic UI** with rollback on failure.
- Surface an **audit affordance** ("View change history") where writes occur.
- Honor the app-level **read-only toggle** by hiding all write controls.

---

## 10. External-facing portal rules (apps for the customer's customers)

These differ sharply from internal tools:

- **Branding override**: apply the _customer's_ logo and accent within Zuper's layout primitives — their identity, our structure and safety.
- **Minimal chrome, mobile-first**, one primary action per screen.
- **Strip internal data** — never expose margins, internal notes, tech comp, or other records (enforced by viewer-scoped RBAC, reinforced by design: no dense ops grids).
- **Trust cues** on anything involving payment or approval; clear status of _their_ job/quote/invoice only.

---

## 11. What Sense must NOT do

- Invent a primitive that already exists in the inventory.
- Emit raw colors/spacing instead of tokens.
- Use a status color decoratively, or status by color alone.
- Produce generic-AI layouts (purple gradients, hero cards, default fonts).
- Use a Kanban where a time axis exists (use the Scheduler).
- Render a field the viewer isn't permitted to see, or write without preview.
- Vary fonts/themes per app — consistency is mandatory.

---

## 12. Worked example — "AR collections cockpit"

**Prompt:** "Build me a collections screen for overdue invoices — group by how late they are, let me send reminders, and flag anything in dispute."

**Pipeline:**

1. **Archetype:** Operational cockpit (§4a).
2. **Data:** Invoices where `status = overdue`; fields: customer, amount, days-overdue, last-contact, dispute-flag. Ask-back resolved: "late" = days past due date.
3. **Layout:** MetricStat row (Total overdue $, # accounts, avg days late) → FilterBar (aging bucket, branch) → DataTable grouped by aging bucket (0–30 / 31–60 / 61–90 / 90+).
4. **Components:** `MetricStat ×3`, `FilterBar`, `DataTable` with `StatusPill` (aging→`warning`/`danger`), row `Button` "Send reminder," dispute `Badge`.
5. **Tokens/states:** danger for 90+ and disputes; skeleton rows on load; empty state "No overdue invoices 🎉" with instruction.
6. **Actions:** "Send reminder" → write (logs contact + promise-to-pay), preview shows recipient and template; bulk select → "Send 12 reminders?" confirm.
7. **Permissions:** a branch collector sees only their branch; amounts hidden if their role can't view financials.
8. **Preview + Plan chip:** "Invoices · status=overdue · grouped by aging · 1 write action (send reminder)."

**Resulting element tree:**

```
Cockpit
├─ MetricRow [ TotalOverdue, AccountsCount, AvgDaysLate ]
├─ FilterBar [ agingBucket, branch ]
└─ DataTable (Invoices: status=overdue, viewerScoped)
     • group: agingBucket
     • columns: customer, amount, daysOverdue→StatusPill, lastContact, dispute→Badge
     • rowAction: Button "Send reminder" → write(contactLog) [preview+audit]
     • bulkAction: "Send reminders" (danger-confirm on count)
     • states: skeleton / empty / no-access / binding-broken
```

---

## Appendix — implementation checklist for the mockup

- [ ] 🔌 Real Zuper tokens loaded (§1) — no hardcoded values anywhere.
- [ ] 🔌 Component inventory mapped to real Zuper components (§2).
- [ ] Archetype templates built (§4), Scheduler ≠ Kanban enforced (§5).
- [ ] All five states present per app (§8).
- [ ] Write actions show preview/confirm/audit (§9).
- [ ] Viewer-scoped RBAC on every binding (§10, §11).
- [ ] Portal mode: branding override + stripped chrome (§10).