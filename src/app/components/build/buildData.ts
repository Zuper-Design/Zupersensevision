// Seed data + App-definition model for Sense Build (App Builder).
// Mirrors Spec.md §2 (core App object) and §5 (Custom Dispatch Board flagship).

export type ElementType =
  | 'Container' | 'FilterBar' | 'Board' | 'JobCard' | 'TechLane'
  | 'Scheduler' | 'TimeAxis' | 'ResourceLane' | 'JobBlock' | 'BacklogTray'
  | 'Table' | 'Chart' | 'Metric' | 'Form' | 'Field' | 'Button' | 'Text';

export interface AppElement {
  id: string;
  type: ElementType;
  label: string;
  children?: AppElement[];
  // Inspector-facing props
  binding?: string;          // human-readable query summary
  fields?: string[];
  conditionalFormat?: string;
  action?: string;
  bindingBroken?: boolean;   // schema-drift demo
}

export type Lifecycle = 'personal' | 'published';

export interface BuildApp {
  id: string;
  name: string;
  icon: string;              // emoji
  module: string;
  owner: string;
  lifecycle: Lifecycle;
  version: number;
  updated: string;           // relative label
  description: string;
  readOnly?: boolean;
  elements?: AppElement[];
}

// ── User's existing apps (Build home list) ──────────────────────────────
export const MY_APPS: BuildApp[] = [
  {
    id: 'app-dispatch',
    name: 'HVAC Dispatch Board — TX',
    icon: '🗂️',
    module: 'Jobs',
    owner: 'Meera Joshi',
    lifecycle: 'published',
    version: 4,
    updated: '2h ago',
    description: 'Drag unassigned HVAC jobs onto technician lanes. Highlights overdue SLAs.',
  },
  {
    id: 'app-quote',
    name: 'Quote Follow-up Engine',
    icon: '📨',
    module: 'Quotes',
    owner: 'Meera Joshi',
    lifecycle: 'personal',
    version: 1,
    updated: 'yesterday',
    description: 'Surfaces quotes stuck in "sent" past 3 days and drafts nudges.',
  },
  {
    id: 'app-invoices',
    name: 'AR Collections Cockpit',
    icon: '💸',
    module: 'Invoices',
    owner: 'Meera Joshi',
    lifecycle: 'published',
    version: 2,
    updated: 'yesterday',
    description: 'Overdue invoices by aging bucket, send reminders, flag disputes.',
  },
  {
    id: 'app-assets',
    name: 'Asset Maintenance Tracker',
    icon: '🔧',
    module: 'Assets',
    owner: 'Meera Joshi',
    lifecycle: 'personal',
    version: 2,
    updated: '3 days ago',
    description: 'Assets with overdue service intervals, grouped by site.',
  },
  {
    id: 'app-schedule',
    name: 'Daily Schedule View',
    icon: '📅',
    module: 'Schedule',
    owner: 'Rahul G.',
    lifecycle: 'published',
    version: 3,
    updated: '1h ago',
    description: "Today's appointments laid out per technician with time slots and job types.",
  },
  {
    id: 'app-customers',
    name: 'At-Risk Customers',
    icon: '🏠',
    module: 'Customers',
    owner: 'Meera Joshi',
    lifecycle: 'personal',
    version: 1,
    updated: '5 days ago',
    description: 'Customers with open jobs older than 14 days, sorted by total open value.',
  },
  {
    id: 'app-revenue',
    name: 'Revenue Pipeline',
    icon: '📈',
    module: 'Quotes',
    owner: 'Rahul G.',
    lifecycle: 'published',
    version: 2,
    updated: '4h ago',
    description: 'Quote pipeline by stage showing conversion rates and projected close value.',
  },
  {
    id: 'app-sla',
    name: 'SLA Breach Monitor',
    icon: '⚠️',
    module: 'Jobs',
    owner: 'Meera Joshi',
    lifecycle: 'published',
    version: 1,
    updated: '30m ago',
    description: 'Jobs approaching or past SLA deadline, grouped by severity and technician.',
  },
  {
    id: 'app-parts',
    name: 'Parts & Inventory',
    icon: '📦',
    module: 'Inventory',
    owner: 'Meera Joshi',
    lifecycle: 'personal',
    version: 1,
    updated: '1 week ago',
    description: 'Low-stock parts across warehouses with reorder triggers and supplier contacts.',
  },
  {
    id: 'app-timesheet',
    name: 'Technician Timesheets',
    icon: '🕐',
    module: 'Schedule',
    owner: 'Rahul G.',
    lifecycle: 'personal',
    version: 1,
    updated: '2 days ago',
    description: 'Weekly hours per technician with overtime flags and approval workflow.',
  },
];

// ── Template gallery (per-module, blank-state solution) ─────────────────
export interface BuildTemplate {
  id: string;
  name: string;
  module: string;
  icon: string;
  blurb: string;
  prompt: string;
}

export const TEMPLATES: BuildTemplate[] = [
  { id: 't-dispatch', name: 'Dispatch Board', module: 'Jobs', icon: '🗂️',
    blurb: 'Drag-to-assign jobs across technician lanes.',
    prompt: 'Build a dispatch board for this week showing unassigned HVAC jobs in Texas as cards I can drag onto technicians, with SLA deadline and priority on each card, and highlight anything overdue.' },
  { id: 't-quote', name: 'Quote Follow-ups', module: 'Quotes', icon: '📨',
    blurb: 'Track quotes stuck in "sent" and nudge them.',
    prompt: 'Show me quotes still in "sent" status for more than 3 days, oldest first, with the customer, amount, and days waiting.' },
  { id: 't-invoice', name: 'Overdue Invoices', module: 'Invoices', icon: '💸',
    blurb: 'Aging buckets for receivables you can act on.',
    prompt: 'Build a board of overdue invoices grouped into 0-30 / 30-60 / 60+ day aging buckets with amount and customer.' },
  { id: 't-assets', name: 'Asset Service Due', module: 'Assets', icon: '🔧',
    blurb: 'Assets past their service interval, by site.',
    prompt: 'List assets whose next service date has passed, grouped by site, with last service date and assigned technician.' },
  { id: 't-sched', name: 'Daily Schedule', module: 'Schedule', icon: '📅',
    blurb: 'Today\'s appointments by technician.',
    prompt: 'Show today\'s scheduled appointments laid out per technician with time, customer, and job type.' },
  { id: 't-cust', name: 'Customer Health', module: 'Customers', icon: '🏠',
    blurb: 'At-risk accounts with open issues.',
    prompt: 'Build a table of customers with open jobs older than 14 days, sorted by total open value.' },
];

// ── Plan steps Sense shows for the dispatch-board prompt (Spec 2 §4b) ────
// Archetype = Scheduler/DispatchGrid (time axis present → never Kanban, §5).
export const DISPATCH_PLAN: { label: string; detail: string }[] = [
  { label: 'Archetype', detail: 'Dispatch scheduler — technician rows × hourly time axis (time present → grid, not board)' },
  { label: 'Entity', detail: 'Jobs · category = HVAC · region = TX · scheduled ∈ today · split assigned / unassigned' },
  { label: 'Layout', detail: 'Unassigned backlog tray + resource lanes positioned by scheduled start + duration' },
  { label: 'Surfaces', detail: 'double-booking overlap, travel gaps, per-tech utilization' },
  { label: 'Interaction', detail: 'drag job onto a lane at a time → write Job.assigned_to + Job.schedule slot' },
  { label: 'Rule', detail: 'SLA deadline < now → danger (overdue), labelled — never colour-only' },
];

export const KANBAN_PLAN: { label: string; detail: string }[] = [
  { label: 'Archetype', detail: 'Status triage board — quote follow-up by stage (§4c)' },
  { label: 'Entity', detail: 'Quotes · status = sent · no customer reply for 3+ days' },
  { label: 'Layout', detail: 'Status columns with compact quote cards; no time axis, so Kanban is valid' },
  { label: 'Actions', detail: 'drag between stages → update quote stage/owner; follow-up email drafts stay reviewable' },
  { label: 'Automation', detail: 'rules compile into Zuper Rules Engine with run counts and audit trail' },
  { label: 'Rule', detail: 'stale / disputed quotes use warning or danger labels, never color-only' },
];

// Clarifying question Sense asks before generating (schema-grounded, §3a)
export const CLARIFY = {
  question: 'By "this week" do you mean the dispatch calendar week (Mon–Sun) or a rolling 7 days?',
  options: ['Calendar week (Mon–Sun)', 'Rolling 7 days'],
};

// ── Dispatch board live data ────────────────────────────────────────────
export type Priority = 'High' | 'Medium' | 'Low';

export interface Job {
  id: string;
  customer: string;
  jobType: string;
  address: string;
  priority: Priority;
  sla: string;          // display label
  overdue: boolean;
  skill: string;        // for power-user skill-match badge
  // scheduling (§4b) — assigned jobs occupy a slot on the time axis
  start?: number;       // hour (24h, fractional ok) e.g. 13.5 = 1:30pm
  duration?: number;    // hours
  slaHour?: number;     // SLA deadline as hour, for overlap/at-risk math
}

// Dispatch grid hour window (08:00–18:00)
export const GRID_START = 8;
export const GRID_END = 18;

export interface Technician {
  id: string;
  name: string;
  initials: string;
  color: string;
  region: string;
  skills: string[];
  jobIds: string[];     // assigned jobs
}

export const UNASSIGNED_JOBS: Job[] = [
  { id: 'JN-2451', customer: 'Riverside Apartments', jobType: 'AC Compressor Repair', address: '1820 Riverside Dr, Austin', priority: 'High', sla: 'Due 2:00 PM', slaHour: 14, overdue: true, skill: 'HVAC-Senior', duration: 2 },
  { id: 'JN-2453', customer: 'Lone Star Diner', jobType: 'Rooftop Unit Service', address: '441 Congress Ave, Austin', priority: 'High', sla: 'Due 4:30 PM', slaHour: 16.5, overdue: false, skill: 'HVAC-Senior', duration: 1.5 },
  { id: 'JN-2458', customer: 'Maple Grove HOA', jobType: 'Thermostat Install', address: '92 Maple Grove, Round Rock', priority: 'Medium', sla: 'Due 5:00 PM', slaHour: 17, overdue: false, skill: 'HVAC-Junior', duration: 1 },
  { id: 'JN-2460', customer: 'Tech Park Tower B', jobType: 'Chiller Inspection', address: '700 Innovation Blvd, Austin', priority: 'High', sla: 'Overdue 11:00 AM', slaHour: 11, overdue: true, skill: 'HVAC-Senior', duration: 2 },
  { id: 'JN-2462', customer: 'Sunset Retail Plaza', jobType: 'Filter Replacement', address: '15 Sunset Way, Pflugerville', priority: 'Low', sla: 'Due 5:30 PM', slaHour: 17.5, overdue: false, skill: 'HVAC-Junior', duration: 1 },
];

export const TECHNICIANS: Technician[] = [
  { id: 'tech-1', name: 'Carlos Mendez', initials: 'CM', color: '#0891B2', region: 'TX', skills: ['HVAC-Senior', 'HVAC-Junior'], jobIds: ['JN-2440'] },
  { id: 'tech-2', name: 'Dana Wright', initials: 'DW', color: '#7C3AED', region: 'TX', skills: ['HVAC-Junior'], jobIds: [] },
  { id: 'tech-3', name: 'Sam Okafor', initials: 'SO', color: '#D946EF', region: 'TX', skills: ['HVAC-Senior'], jobIds: ['JN-2438', 'JN-2444'] },
];

// Jobs already scheduled on lanes — positioned by start + duration on the time axis.
// JN-2438 (13:00–14:30) and JN-2444 (14:00–15:30) overlap → double-booking the grid surfaces.
export const ASSIGNED_JOBS: Record<string, Job> = {
  'JN-2440': { id: 'JN-2440', customer: 'Greenfield Office', jobType: 'AC Tune-up', address: '88 Greenfield Rd, Austin', priority: 'Medium', sla: 'Due 3:00 PM', slaHour: 15, overdue: false, skill: 'HVAC-Junior', start: 9, duration: 1.5 },
  'JN-2438': { id: 'JN-2438', customer: 'Harbor Medical', jobType: 'Ventilation Repair', address: '210 Harbor St, Austin', priority: 'High', sla: 'Due 1:30 PM', slaHour: 13.5, overdue: false, skill: 'HVAC-Senior', start: 13, duration: 1.5 },
  'JN-2444': { id: 'JN-2444', customer: 'Cedar Heights School', jobType: 'Boiler Service', address: '5 Cedar Heights, Cedar Park', priority: 'Medium', sla: 'Due 5:00 PM', slaHour: 17, overdue: false, skill: 'HVAC-Senior', start: 14, duration: 1.5 },
};

// ── Element tree for the dispatch scheduler (Spec 2 §4b) ────────────────
export const DISPATCH_TREE: AppElement = {
  id: 'el-root', type: 'Scheduler', label: 'DispatchGrid',
  children: [
    { id: 'el-filter', type: 'FilterBar', label: 'FilterBar', binding: 'region, category, date' },
    { id: 'el-tray', type: 'BacklogTray', label: 'UnassignedTray', binding: 'Jobs where status = unassigned',
      children: [
        { id: 'el-card', type: 'JobBlock', label: 'JobBlock', binding: 'Jobs · HVAC · TX · today',
          fields: ['customer', 'job type', 'SLA deadline', 'priority', 'address'],
          conditionalFormat: 'overdue → danger' },
        { id: 'el-warranty', type: 'Field', label: 'Warranty tier', binding: 'Jobs.warranty_tier (field removed in Settings)',
          bindingBroken: true },
      ] },
    { id: 'el-axis', type: 'TimeAxis', label: 'TimeAxis', binding: '08:00–18:00 · hourly' },
    { id: 'el-lanes', type: 'ResourceLane', label: 'ResourceLane[]', binding: 'active technicians in region',
      action: 'onDrop(job, lane@time) → write Job.assigned_to + Job.schedule slot' },
  ],
};

export const COCKPIT_TREE: AppElement = {
  id: 'el-root', type: 'Container', label: 'AR Collections Cockpit',
  children: [
    { id: 'el-metrics', type: 'Metric', label: 'MetricStat row', binding: 'Invoices where status = overdue',
      children: [
        { id: 'el-total-overdue', type: 'Metric', label: 'Total overdue', binding: 'Invoices.amount sum', fields: ['amount'], },
        { id: 'el-account-count', type: 'Metric', label: 'Accounts count', binding: 'Invoices count by viewer scope' },
        { id: 'el-avg-days', type: 'Metric', label: 'Average days late', binding: 'Invoices.days_overdue avg' },
      ] },
    { id: 'el-filter', type: 'FilterBar', label: 'FilterBar', binding: 'agingBucket, branch' },
    { id: 'el-table', type: 'Table', label: 'Grouped DataTable', binding: 'Invoices · overdue · grouped by aging',
      children: [
        { id: 'el-card', type: 'Field', label: 'Amount column', binding: 'Invoices.amount (RBAC-protected)', fields: ['amount'] },
        { id: 'el-days-pill', type: 'Field', label: 'Days overdue StatusPill', binding: 'Invoices.days_overdue → warning/danger' },
        { id: 'el-dispute', type: 'Field', label: 'Dispute badge', binding: 'Invoices.dispute_flag' },
        { id: 'el-send', type: 'Button', label: 'Send reminder', binding: 'write ContactLog + reminder template', action: 'preview + confirm + audit' },
      ] },
  ],
};

export const KANBAN_TREE: AppElement = {
  id: 'el-root', type: 'Board', label: 'Quote Follow-up Board',
  children: [
    { id: 'el-filter', type: 'FilterBar', label: 'FilterBar', binding: 'stage, owner, age' },
    { id: 'el-board', type: 'Board', label: 'Status columns', binding: 'Quotes grouped by follow-up stage',
      children: [
        { id: 'el-card', type: 'JobCard', label: 'QuoteCard', binding: 'Quotes · sent > 3 days',
          fields: ['customer', 'amount', 'days waiting', 'owner'] },
        { id: 'el-followup', type: 'Button', label: 'Draft follow-up', binding: 'Rules Engine · draft email', action: 'queue for review' },
      ] },
    { id: 'el-auto', type: 'Button', label: 'Automation rules', binding: 'Quote triggers compiled to Rules Engine', action: 'enable / disable workflow' },
  ],
};

// Audit log — every write logged { app, version, user, before/after, timestamp } (§4)
export interface AuditEntry {
  id: string;
  app: string;
  version: number;
  user: string;
  field: string;
  before: string;
  after: string;
  timestamp: string;
  reversible: boolean;
}

export const AUDIT_LOG: AuditEntry[] = [
  { id: 'a-1', app: 'HVAC Dispatch Board — TX', version: 4, user: 'Anita Upadhyay', field: 'Job JN-2440.assigned_to', before: '—', after: 'Carlos Mendez', timestamp: 'Today 9:42 AM', reversible: true },
  { id: 'a-2', app: 'HVAC Dispatch Board — TX', version: 4, user: 'Anita Upadhyay', field: 'Job JN-2440.schedule', before: '—', after: 'Today 1:00–3:00 PM', timestamp: 'Today 9:42 AM', reversible: true },
  { id: 'a-3', app: 'HVAC Dispatch Board — TX', version: 3, user: 'Vikram Patel', field: 'Job JN-2438.assigned_to', before: 'Sam Okafor', after: 'Sam Okafor', timestamp: 'Yesterday 4:15 PM', reversible: false },
  { id: 'a-4', app: 'HVAC Dispatch Board — TX', version: 3, user: 'Meera Joshi', field: 'Job JN-2444.assigned_to', before: '—', after: 'Sam Okafor', timestamp: 'Yesterday 2:08 PM', reversible: true },
];

// ── AR Collections Cockpit data (Spec 2 §4a / §12 worked example) ───────
export interface Invoice {
  id: string;
  customer: string;
  amount: number;        // financial — hidden from roles without finance permission
  daysOverdue: number;
  bucket: '0-30' | '31-60' | '61-90' | '90+';
  lastContact: string;
  disputed?: boolean;
}

export const OVERDUE_INVOICES: Invoice[] = [
  { id: 'INV-7741', customer: 'Riverside Apartments', amount: 12400, daysOverdue: 8, bucket: '0-30', lastContact: '3 days ago' },
  { id: 'INV-7702', customer: 'Lone Star Diner', amount: 4820, daysOverdue: 21, bucket: '0-30', lastContact: '1 week ago' },
  { id: 'INV-7689', customer: 'Maple Grove HOA', amount: 9100, daysOverdue: 44, bucket: '31-60', lastContact: '2 weeks ago', disputed: true },
  { id: 'INV-7655', customer: 'Tech Park Tower B', amount: 27600, daysOverdue: 58, bucket: '31-60', lastContact: '3 weeks ago' },
  { id: 'INV-7610', customer: 'Sunset Retail Plaza', amount: 6300, daysOverdue: 73, bucket: '61-90', lastContact: 'never' },
  { id: 'INV-7588', customer: 'Cedar Heights School', amount: 18950, daysOverdue: 96, bucket: '90+', lastContact: '1 month ago', disputed: true },
  { id: 'INV-7540', customer: 'Harbor Medical', amount: 41200, daysOverdue: 112, bucket: '90+', lastContact: 'never' },
];

// ── Triggers / automation (Spec 1 §2 logic, §5e Quote Follow-up) ────────
// `on event → action` rules. Compile to entries in Zuper's existing rules engine.
export interface Trigger {
  id: string;
  on: string;          // event
  then: string;        // action
  enabled: boolean;
  runs: number;        // fired count (proves it's live)
  compiledTo: string;  // existing rules-engine ref
}

export const QUOTE_TRIGGERS: Trigger[] = [
  { id: 'tr-1', on: 'Quote in "sent" with no reply for 3 days', then: 'Draft follow-up email + queue for review', enabled: true, runs: 47, compiledTo: 'Rules Engine · WF-1182' },
  { id: 'tr-2', on: 'Quote accepted', then: 'Convert to job + notify owner', enabled: true, runs: 12, compiledTo: 'Rules Engine · WF-0904' },
  { id: 'tr-3', on: 'No reply for 7 days after follow-up', then: 'Flag for manual call + lower stage', enabled: false, runs: 0, compiledTo: 'Rules Engine · WF-1190' },
];

// Publish dialog version notes (§5f)
export const VERSION_HISTORY: { v: number; note: string; when: string; by: string }[] = [
  { v: 4, note: 'Added skill-match badge to job cards', when: '2h ago', by: 'Meera Joshi' },
  { v: 3, note: 'Overdue highlight + priority sort', when: 'yesterday', by: 'Meera Joshi' },
  { v: 2, note: 'Technician lanes by region', when: '3 days ago', by: 'Meera Joshi' },
  { v: 1, note: 'Initial board from prompt', when: '4 days ago', by: 'Meera Joshi' },
];
