# Zuper Sense — App Builder Spec ("Sense Build")

> Working spec for promoting Zuper Sense from a standalone AI assistant into a multi-mode surface, and adding a prompt-based App Builder that ops admins and power users both use to build live, Zuper-native tools.
> 
> Scope of this doc: the three pillars to mock up first — **(1)** the builder UX & dual prompt↔canvas experience, **(2)** governance & publishing, and **(3)** a flagship app built end-to-end (the Custom Dispatch Board).

---

## 0. Context & goal

**Today.** Zuper Sense exists as a standalone AI assistant. It can pull data from Zuper and answer questions in chat. It is essentially read-only and conversational.

**Target.** Promote Sense into a moded surface — the same pattern as Claude's _Chat / Cowork / Code_ — and add **Build** alongside the existing **Chat**. Build is a prompt-based App Builder that generates live, Zuper-native tools (dashboards, workflows, interactive mini-apps, reports) operating on real data with read + write and the ability to define new custom entities.

**Two audiences, one artifact.** This is the core design bet:

- **Ops admins** stay in a conversational, prompt-first flow.
- **Power users** open the _same_ artifact as an editable element canvas — query, properties, bindings, logic — for fine-grained control.

Both lanes edit one underlying object. Prompting and direct-editing operate on the same definition, the way Claude Code lets you both chat about and directly edit the same files. That shared object is what keeps the two experiences coherent instead of forking into two products.

**The one-liner.** _Lovable/Retool for field service, except Sense already understands your jobs, quotes, dispatch, and assets out of the box._ The differentiator is not "AI builds UI" — it is that Sense is grounded in the Zuper schema and domain, so what it generates is correct, permission-safe, and already wired to live data instead of a blank canvas.

---

## 1. Where it lives — Sense as a moded surface

- Add a mode switcher inside Sense: **Chat | Build** (architected to add more modes later).
- **Chat** = the existing assistant, unchanged. It simply becomes one mode.
- **Build** = a workspace listing the user's apps, a "New app" prompt box, and a template gallery seeded per Zuper module.
- **Chat → Build handoff.** When Chat answers something like "show me overdue invoices," it offers a _"Turn this into an app →"_ action that hands the resolved query to Build pre-seeded. This makes the upgrade path obvious and reuses the data-pull the assistant already does today — the cheapest possible bridge from the product that exists to the product we're adding.

---

## 2. The core object — an "App"

Defining this precisely is what makes the dual experience possible. Both the prompt lane and the canvas lane read and write this one structure.

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

- **Element** — a typed UI node: `Table`, `Board`, `Chart`, `Metric`, `Form`, `Field`, `Button`, `Container`, `Text`, `FilterBar`. Has props, an optional data binding, and optional actions.
- **Binding** — a query against a Zuper entity (Jobs, Quotes, Estimates, Invoices, Assets, Customers, Schedule, or a Custom Entity): filters, sort, selected fields. **Bindings reference stable entity/field IDs, never labels**, so renaming a status in settings doesn't silently break apps.
- **Action** — `read` (refresh / filter) or `write` (update field, create record, trigger workflow). Writes are _declared and typed_, so they can be permission-checked and audited before they run.
- **Trigger** — optional automation (`on event → action`). These compile to entries in Zuper's **existing** automation/rules engine, not a parallel one.

---

## 3. Pillar 1 — Builder UX (the dual experience)

### 3a. Prompt-first lane (ops admins)

Loop: **prompt → plan → live preview → conversational refine.**

- Sense is **schema-grounded**: it resolves entities, fields, statuses, and custom fields against the real model, and **asks back on ambiguity rather than guessing** (e.g. _"By 'this week' do you mean the dispatch calendar week or a rolling 7 days?"_).
- Every generation surfaces a **Plan chip** showing the query/structure Sense built, so the admin can trust (and correct) it.
- The preview is **populated with real data**, not a mockup — that's the "wow."
- Refinement stays conversational: _"add an SLA column," "color overdue red," "let me bulk reassign."_
- Blank-state is solved with a **per-module template gallery** + example prompts.

### 3b. Power-user / canvas lane

Toggling **Preview → Edit** opens a three-pane canvas:

- **Left — Element tree:** the hierarchy of the app; add, reorder, nest, delete.
- **Center — Canvas:** live preview, directly selectable.
- **Right — Inspector:** props, **data binding** (visual query builder + a raw filter view), **actions** (wire a button → write or workflow), conditional formatting, and style.

Power users can edit the query directly, bind custom fields, set conditional formatting, and define what a button writes. Crucially, **canvas edits update the same App definition Sense reasons over**, so a user can prompt _on top of_ hand-edits ("now group this board by region") and Sense respects what was changed by hand.

**Progressive disclosure:** ops admins never see the canvas unless they open Edit; power users live in it. Same artifact, two depths.

### 3c. Data & write model

- **Read:** bindings run live queries, scoped to the _viewer's_ permissions (see §4).
- **Write:** every write is **previewed** before it runs; bulk/destructive writes require explicit confirm; all writes are **audited** and reversible where possible; a **dry-run** option is available for risky ones.

---

## 4. Pillar 2 — Governance & publishing

Read-only assistants are low-stakes. The moment apps **write records and create custom entities**, governance becomes a first-class feature, not an afterthought.

- **Two lifecycle states.**
    - _Personal_ — draft, visible only to the builder, fast and disposable. No gate.
    - _Published_ — shared to a team/role, versioned, owned. Requires a publish action.
- **Publish gate.** Only roles holding a `publish_apps` permission can roll an app org-wide. Personal apps need no approval.
- **Permissions inversion (critical).** A published app enforces **the viewer's** RBAC, not the builder's. Bindings re-run under the viewer's scope; if the viewer can't see margins, that column is hidden/empty for them. This prevents an admin from accidentally building a backdoor that exposes data the viewer was never allowed to see.
- **Write authorization** follows the same rule: an app can only perform writes the _viewer_ is permitted to perform. An app-level **read-only toggle** lets a builder distribute a board for visibility without any write surface.
- **Versioning.** Each publish creates an immutable version; rollback and draft-vs-published diff are supported.
- **Audit.** Every write logs `{ app, version, user, before/after, timestamp }`.
- **Schema-drift resilience.** Because bindings use stable IDs, a removed/renamed field surfaces as a fixable _"binding broken"_ state on the element rather than silently dropping data.
- **Cost / performance guardrails.** Result caps, pagination, and a choice between live vs scheduled-refresh, so a naive _"all jobs ever"_ prompt can't melt the database in a multi-tenant environment.

---

## 5. Pillar 3 — Flagship app end-to-end: Custom Dispatch Board

Chosen because it's the most demo-able, exercises **live read + write + drag interaction + filtering** in one screen, and "create a dispatch board" is the canonical ask.

### 5a. The generating prompt

> "Build a dispatch board for this week showing unassigned HVAC jobs in Texas as cards I can drag onto technicians, with SLA deadline and priority on each card, and highlight anything overdue."

### 5b. Sense's plan (shown to the user)

- **Entity:** Jobs → `category = HVAC`, `region = TX`, `scheduled ∈ this week`, split by `assigned / unassigned`.
- **Layout:** an _Unassigned tray_ + _technician columns_ (lanes).
- **Card fields:** customer, job type, SLA deadline, priority, address.
- **Interaction:** drag a card onto a tech → write `Job.assigned_to` + schedule slot.
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

A power user could open the Inspector on `JobCard` to add a _skill-match badge_, or extend the `onDrop` action to also notify the technician.

### 5d. Mockup screens to produce (this effort)

1. **Sense Build home** — app list + new-app prompt + template gallery.
2. **Prompt → generating/plan state** — Plan chip visible.
3. **Live board preview** — ops admin view, populated.
4. **Edit / canvas view** — three-pane with the `JobCard` Inspector open.
5. **Drag-to-assign** — interaction + write-confirm.
6. **Publish dialog** — personal → team, version note, read/write toggle.
7. **Viewer experience** — a dispatcher using the published board under _their own_ permissions.

### 5e. Secondary candidate (build next)

**Quote Follow-up Engine** — surfaces quotes stuck in "sent" past N days, auto-drafts nudges, and tracks conversion. It exercises the **workflow/automation** dimension and reuses the disposition-routing model from the call-campaign redesign (_"when [no reply after 3 days], then [draft follow-up]"_). A strong second demo to prove Build isn't only dashboards.

---

## 6. Integration points with existing Zuper

> Assumptions to confirm against the real codebase.

- **Surface:** web back-office (React assumed). Sense Chat already lives here → add the Build mode beside it.
- **Read data:** reuse the entity/query APIs the Sense assistant already calls today.
- **Write data:** route through existing record-update + scheduling APIs.
- **RBAC:** reuse the existing role/permission system for both build-time and viewer-time checks (powers the permissions-inversion rule).
- **Automation:** Build's triggers compile to existing automation/rules-engine entries.
- **Custom entities:** extend the existing custom objects/fields system — no new store.
- **Net-new backend:** an `apps` table storing the App definition JSON + version history. Likely the only genuinely new persistence.

---

## 7. Mockup-first build plan (phased)

|Phase|Deliverable|
|---|---|
|**0 — Mockup (this effort)**|Realistic static screens of §5d on seeded data. Element model + Inspector clickable. Prompt box returns a canned board down the demo path. No real writes.|
|**1 — Live reads**|Real read bindings (live queries, RBAC-scoped). Boards/reports actually populate.|
|**2 — Writes**|Write actions with preview / confirm / audit. Drag-to-assign goes live.|
|**3 — Governance**|Personal vs published, publish gate, versioning, permissions inversion.|
|**4 — Logic**|Triggers/workflows into the existing engine + custom entities.|
|**5 — Handoff**|Chat → Build "turn this into an app."|

---

## 8. Open decisions

- **Default lifecycle** and **who holds `publish_apps`.**
- **Canvas fidelity for v1:** full freeform vs constrained, module-aware templates. _Recommendation: constrained first_ — freeform invites broken layouts and harder RBAC.
- **Render layer:** does Build emit **real Zuper UI components** (apps look native, RBAC reused) or its own renderer? _Recommendation: reuse native components_ for visual consistency and to inherit permission behavior for free.
- **Multi-tenant query cost ceilings** and default live-vs-scheduled refresh.