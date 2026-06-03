# Zuper Sense — App Builder Spec ("Sense Build")

> Spec: promote Zuper Sense from standalone AI assistant → multi-mode surface + prompt-based App Builder for ops admins & power users to build live, Zuper-native tools.
>
> Scope: 3 pillars to mock first — **(1)** builder UX & dual prompt↔canvas, **(2)** governance & publishing, **(3)** flagship app (Custom Dispatch Board).

---

## 0. Context & goal

**Today.** Sense = standalone AI assistant. Pulls Zuper data, answers chat questions. Read-only + conversational.

**Target.** Promote Sense to moded surface — same pattern as Claude's _Chat / Cowork / Code_ — add **Build** alongside existing **Chat**. Build = prompt-based App Builder generating live, Zuper-native tools (dashboards, workflows, mini-apps, reports) on real data with read + write + custom entity definitions.

**Two audiences, one artifact.** Core design bet:

- **Ops admins** — conversational, prompt-first flow.
- **Power users** — same artifact as editable element canvas (query, props, bindings, logic) for fine-grained control.

Both lanes edit one underlying object. Prompting + direct-editing operate on same definition — like Claude Code letting you both chat about and directly edit the same files. Shared object keeps two experiences coherent instead of forking into two products.

**One-liner.** _Lovable/Retool for field service, except Sense already understands jobs, quotes, dispatch, assets out of the box._ Differentiator isn't "AI builds UI" — Sense is grounded in Zuper schema + domain, so output is correct, permission-safe, wired to live data instead of blank canvas.

---

## 1. Where it lives — Sense as moded surface

- Add mode switcher in Sense: **Chat | Build** (architected for more modes later).
- **Chat** = existing assistant, unchanged. Becomes one mode.
- **Build** = workspace listing user's apps + "New app" prompt box + template gallery seeded per Zuper module.
- **Chat → Build handoff.** When Chat answers "show me overdue invoices," offers _"Turn this into an app →"_ action → hands resolved query to Build pre-seeded. Obvious upgrade path, reuses data-pull assistant already does — cheapest bridge from existing product to new.

---

## 2. Core object — an "App"

Defining precisely = makes dual experience possible. Both prompt lane and canvas lane read/write this one structure.

```
App {
  id, name, icon, module, owner
  lifecycle: "personal" | "published"
  version
  elements: Element[]        // the UI tree
  bindings: Binding[]        // data sources
  logic: Trigger[]           // optional automations
  permissions: { writeEnabled, viewerScoped, requiredRole }
}
```

- **Element** — typed UI node: `Table`, `Board`, `Chart`, `Metric`, `Form`, `Field`, `Button`, `Container`, `Text`, `FilterBar`. Has props, optional data binding, optional actions.
- **Binding** — query against Zuper entity (Jobs, Quotes, Estimates, Invoices, Assets, Customers, Schedule, Custom Entity): filters, sort, selected fields. **Reference stable entity/field IDs, never labels** — renaming a status in settings doesn't silently break apps.
- **Action** — `read` (refresh/filter) or `write` (update field, create record, trigger workflow). Writes are _declared + typed_ → permission-checked + audited before running.
- **Trigger** — optional automation (`on event → action`). Compile to entries in Zuper's **existing** automation/rules engine, not parallel one.

---

## 3. Pillar 1 — Builder UX (dual experience)

### 3a. Prompt-first lane (ops admins)

Loop: **prompt → plan → live preview → conversational refine.**

- Sense is **schema-grounded**: resolves entities, fields, statuses, custom fields against real model, **asks back on ambiguity rather than guessing** (e.g. _"By 'this week' do you mean dispatch calendar week or rolling 7 days?"_).
- Every generation surfaces **Plan chip** showing query/structure Sense built — admin can trust + correct it.
- Preview **populated with real data**, not mockup — that's the wow.
- Refinement stays conversational: _"add SLA column," "color overdue red," "let me bulk reassign."_
- Blank-state solved with **per-module template gallery** + example prompts.

### 3b. Power-user / canvas lane

Toggle **Preview → Edit** → three-pane canvas:

- **Left — Element tree:** app hierarchy; add, reorder, nest, delete.
- **Center — Canvas:** live preview, directly selectable.
- **Right — Inspector:** props, **data binding** (visual query builder + raw filter view), **actions** (wire button → write or workflow), conditional formatting, style.

Power users edit query directly, bind custom fields, set conditional formatting, define button writes. Crucially, **canvas edits update same App definition Sense reasons over** — prompt _on top of_ hand-edits ("now group this board by region") and Sense respects hand-edits.

**Progressive disclosure:** ops admins never see canvas unless they open Edit; power users live in it. Same artifact, two depths.

### 3c. Data & write model

- **Read:** bindings run live queries, scoped to _viewer's_ permissions (§4).
- **Write:** every write **previewed** before running; bulk/destructive writes require explicit confirm; all writes **audited** + reversible where possible; **dry-run** option for risky ones.

---

## 4. Pillar 2 — Governance & publishing

Read-only assistants = low-stakes. Apps that **write records + create custom entities** → governance = first-class feature, not afterthought.

- **Two lifecycle states.**
    - _Personal_ — draft, visible only to builder, fast + disposable. No gate.
    - _Published_ — shared to team/role, versioned, owned. Requires publish action.
- **Publish gate.** Only roles with `publish_apps` permission can roll app org-wide. Personal apps need no approval.
- **Permissions inversion (critical).** Published app enforces **viewer's** RBAC, not builder's. Bindings re-run under viewer's scope; if viewer can't see margins, column hidden/empty for them. Prevents admin accidentally building backdoor exposing data viewer was never allowed to see.
- **Write authorization** follows same rule: app can only perform writes _viewer_ is permitted to perform. App-level **read-only toggle** lets builder distribute board for visibility without write surface.
- **Versioning.** Each publish = immutable version; rollback + draft-vs-published diff supported.
- **Audit.** Every write logs `{ app, version, user, before/after, timestamp }`.
- **Schema-drift resilience.** Bindings use stable IDs → removed/renamed field surfaces as fixable _"binding broken"_ state on element instead of silently dropping data.
- **Cost/performance guardrails.** Result caps, pagination, live vs scheduled-refresh choice — naive _"all jobs ever"_ prompt can't melt DB in multi-tenant env.

---

## 5. Pillar 3 — Flagship app end-to-end: Custom Dispatch Board

Chosen: most demo-able, exercises **live read + write + drag + filtering** in one screen. "Create a dispatch board" = canonical ask.

### 5a. Generating prompt

> "Build a dispatch board for this week showing unassigned HVAC jobs in Texas as cards I can drag onto technicians, with SLA deadline and priority on each card, and highlight anything overdue."

### 5b. Sense's plan (shown to user)

- **Entity:** Jobs → `category = HVAC`, `region = TX`, `scheduled ∈ this week`, split by `assigned / unassigned`.
- **Layout:** _Unassigned tray_ + technician columns (lanes).
- **Card fields:** customer, job type, SLA deadline, priority, address.
- **Interaction:** drag card onto tech → write `Job.assigned_to` + schedule slot.
- **Rule:** `SLA deadline < now` → card highlighted red.

### 5c. Element tree (concrete)

```
Container (board layout)
├─ FilterBar            → bound to query params (region, category, date range)
├─ UnassignedTray (Board column)
│    └─ JobCard[]       → binding: Jobs where status = unassigned
│         • fields: customer, job type, SLA, priority, address
│         • conditionalFormat: overdue → red
│         • drag handle
└─ TechLane[]           → binding: active technicians in region
     • dropTarget: accepts JobCard
     • onDrop(card, lane) → ACTION write:
          Job.assigned_to = lane.tech
          Job.schedule    = computed slot
          (optimistic UI, confirm on conflict, audited)
```

Power user can open Inspector on `JobCard` to add _skill-match badge_, or extend `onDrop` action to also notify technician.

### 5d. Mockup screens (this effort)

1. **Sense Build home** — app list + new-app prompt + template gallery.
2. **Prompt → generating/plan state** — Plan chip visible.
3. **Live board preview** — ops admin view, populated.
4. **Edit / canvas view** — three-pane with `JobCard` Inspector open.
5. **Drag-to-assign** — interaction + write-confirm.
6. **Publish dialog** — personal → team, version note, read/write toggle.
7. **Viewer experience** — dispatcher using published board under _their own_ permissions.

### 5e. Secondary candidate (build next)

**Quote Follow-up Engine** — surfaces quotes stuck in "sent" past N days, auto-drafts nudges, tracks conversion. Exercises **workflow/automation** dimension, reuses disposition-routing model from call-campaign redesign (_"when [no reply after 3 days], then [draft follow-up]"_). Strong second demo — proves Build isn't only dashboards.

---

## 6. Integration points with existing Zuper

> Assumptions to confirm against real codebase.

- **Surface:** web back-office (React assumed). Sense Chat already here → add Build mode beside it.
- **Read data:** reuse entity/query APIs Sense assistant already calls today.
- **Write data:** route through existing record-update + scheduling APIs.
- **RBAC:** reuse existing role/permission system for build-time + viewer-time checks (powers permissions-inversion rule).
- **Automation:** Build's triggers compile to existing automation/rules-engine entries.
- **Custom entities:** extend existing custom objects/fields system — no new store.
- **Net-new backend:** `apps` table storing App definition JSON + version history. Likely only genuinely new persistence.

---

## 7. Mockup-first build plan (phased)

|Phase|Deliverable|
|---|---|
|**0 — Mockup (this effort)**|Realistic static screens of §5d on seeded data. Element model + Inspector clickable. Prompt box returns canned board down demo path. No real writes.|
|**1 — Live reads**|Real read bindings (live queries, RBAC-scoped). Boards/reports actually populate.|
|**2 — Writes**|Write actions with preview / confirm / audit. Drag-to-assign goes live.|
|**3 — Governance**|Personal vs published, publish gate, versioning, permissions inversion.|
|**4 — Logic**|Triggers/workflows into existing engine + custom entities.|
|**5 — Handoff**|Chat → Build "turn this into an app."|

---

## 8. Open decisions

- **Default lifecycle** + **who holds `publish_apps`.**
- **Canvas fidelity for v1:** full freeform vs constrained, module-aware templates. _Recommendation: constrained first_ — freeform invites broken layouts + harder RBAC.
- **Render layer:** does Build emit **real Zuper UI components** (apps look native, RBAC reused) or own renderer? _Recommendation: reuse native components_ for visual consistency + inherit permission behavior free.
- **Multi-tenant query cost ceilings** + default live-vs-scheduled refresh.