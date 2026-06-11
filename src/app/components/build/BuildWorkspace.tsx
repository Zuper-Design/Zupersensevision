import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  LayoutGroup,
} from "motion/react";
import {
  Plus,
  ArrowLeft,
  ChevronDown,
  History,
  ArrowRight,
  Loader2,
  Check,
  FileText,
  Trash2,
  Lock,
  Eye,
  Code2,
  Zap,
  Sparkles,
  LayoutGrid,
  Database,
  Wand2,
  ShieldCheck,
  Workflow,
  CheckCircle2,
  X,
  Folder,
  Ruler,
  Receipt,
  ListChecks,
  Wrench,
  Calendar,
  Users,
  Home,
  RotateCcw,
  PanelLeftClose,
  PanelLeftOpen,
  Star,
  Mic,
} from "lucide-react";
import { RoofDrawCanvas } from "./RoofDrawCanvas"; // measurement canvas
import { CommissionCalculator } from "./CommissionCalculator"; // calculator table
import { DispatchBoard } from "./DispatchBoard"; // kanban — Quote Follow-up triage board (§4c)
import { ArCockpit } from "./ArCockpit"; // operational cockpit (§4a)
import { PublishAppDialog } from "./PublishAppDialog";
import { AuditPanel } from "./AuditPanel";
import { AutomationPanel } from "./AutomationPanel";
import { TemplateThumb, AppPreviewThumb, PublicAppGallery } from "./PublicAppGallery";
import { ReasoningCard } from "./ReasoningCard";
import PrismGlow from "./PrismGlow";
import { EditProvider, type SelectedElement } from "./EditContext";
import { SenseLogo } from "../SenseLogo";
import BorderGlow from "./BorderGlow";
import {
  TEMPLATES,
  ROOFDRAW_PLAN,
  COMMISSION_PLAN,
  KANBAN_PLAN,
  CLARIFY,
  CLARIFY_REASONING,
  CLARIFY_PLAN,
  CLARIFY_QUESTIONS,
  COCKPIT_REASONING,
  COCKPIT_CLARIFY_PLAN,
  COCKPIT_QUESTIONS,
  COMMISSION_REASONING,
  COMMISSION_CLARIFY_PLAN,
  COMMISSION_QUESTIONS,
  ROOFDRAW_TREE,
  COMMISSION_TREE,
  COCKPIT_TREE,
  KANBAN_TREE,
  type BuildApp,
  type BuildTemplate,
  type PublicApp,
  MY_APPS,
} from "./buildData";

type Stage =
  | "home"
  | "apps"
  | "homeReasoning"
  | "homeClarify"
  | "homeThinking"
  | "clarify"
  | "generating"
  | "preview"
  | "viewer";
type CanvasMode = "preview" | "edit";
// §3 pipeline step 1 — classify intent → archetype (§4). Determines layout family.
type Archetype = "roofdraw" | "commission" | "cockpit" | "kanban";

// A conversation thread inside an app. Title auto-generates from first message.
interface BuildThread {
  id: string;
  title: string;
  createdAt: string;
}

// Cheap "AI" title — first ~5 meaningful words, title-cased. Stands in for a
// model-generated summary in the demo.
function deriveThreadTitle(msg: string): string {
  const stop = new Set([
    "the",
    "a",
    "an",
    "to",
    "for",
    "of",
    "and",
    "with",
    "my",
    "me",
    "i",
    "can",
    "show",
    "add",
  ]);
  const words = msg
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w && !stop.has(w.toLowerCase()))
    .slice(0, 5);
  if (!words.length) return msg.slice(0, 32);
  const t = words.join(" ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function classify(prompt: string): Archetype {
  const p = prompt.toLowerCase();
  if (/(roof|facet|pitch|measure|square|slope|waste|sketch|draw)/.test(p))
    return "roofdraw";
  if (/(commission|payout|rep|tier|margin|deal|bonus|earnings)/.test(p))
    return "commission";
  if (
    /(overdue|invoice|collection|aging|receivable|reminder|cockpit|dashboard)/.test(
      p,
    )
  )
    return "cockpit";
  if (/(quote|follow.?up|pipeline|stuck|triage|stage)/.test(p)) return "kanban";
  return "roofdraw";
}

// Per-archetype plan (shown in the Plan chip, §3 step 8)
const COCKPIT_PLAN: { label: string; detail: string }[] = [
  {
    label: "Archetype",
    detail:
      "Operational cockpit — MetricStat row → FilterBar → grouped DataTable (§4a)",
  },
  {
    label: "Entity",
    detail:
      "Invoices · status = overdue · grouped by aging bucket (0-30 / 31-60 / 61-90 / 90+)",
  },
  {
    label: "Columns",
    detail:
      "customer, amount, days-overdue → StatusPill, last-contact, dispute → Badge",
  },
  {
    label: "Actions",
    detail:
      'row "Send reminder" → write(contact log) · bulk danger-confirm on count',
  },
  {
    label: "Permissions",
    detail:
      "amount column redacted for roles without finance access (viewer-scoped)",
  },
];

interface Props {
  currentUser?: string;
  seededPrompt?: string | null; // Chat → Build handoff
  onConsumeSeed?: () => void;
  // open a built app straight into the editor (from the sidebar's Recent Apps)
  seededOpenAppId?: string | null;
  onConsumeOpenApp?: () => void;
  // land directly on the "My apps" listing (from the sidebar's "My apps" item)
  seededShowApps?: boolean;
  // bump to force the builder back to the home composer ("Create new")
  createNonce?: number;
  // fires true once the build leaves the home composer (planning/flow begins)
  onPlanningChange?: (active: boolean) => void;
  // leave the builder entirely (restores the app's top bar + nav rail)
  onExit?: () => void;
}

const GEN_STEPS_BY_ARCHETYPE: Record<Archetype, string[]> = {
  roofdraw: [
    "Resolving entities against your Zuper schema…",
    "Classified intent → measurement canvas (geometry present)",
    "Loaded RoofFacet model · pitch → slope factor",
    "Wiring totals — squares × waste factor…",
  ],
  commission: [
    "Resolving entities against your Zuper schema…",
    "Classified intent → commission calculator",
    "Found Deals · status = closed · margin bands",
    "Computing tiered payouts per rep…",
  ],
  cockpit: [
    "Resolving entities against your Zuper schema…",
    "Classified intent → operational cockpit",
    "Found Invoices · status = overdue · grouped by aging",
    "Pulling live data — 7 overdue accounts…",
  ],
  kanban: [
    "Resolving entities against your Zuper schema…",
    "Classified intent → status triage board",
    "Found Quotes · status = sent > 3 days",
    "Pulling live data — quotes by stage…",
  ],
};
const GEN_TITLE: Record<Archetype, string> = {
  roofdraw: "Building your roof measurement tool",
  commission: "Building your commission calculator",
  cockpit: "Building your collections cockpit",
  kanban: "Building your follow-up board",
};

// Full-screen generation overlay — vertically scrolling build phases.
// Each phase advances on a timer; the active one is centered + highlighted.
// Each phase rides one stop of the prism spectrum — the gradient is the
// signature of AI activity (DESIGN.md §4); the final phase resolves to the
// full spectrum as the app materializes.
const GEN_PHASES = [
  { icon: LayoutGrid,   label: "Reading your schema",        accent: "var(--prism-pink)" },
  { icon: Database,     label: "Querying jobs & quotes",     accent: "var(--prism-red)" },
  { icon: Workflow,     label: "Extracting tables",          accent: "var(--prism-amber)" },
  { icon: Wand2,        label: "Wiring live data",           accent: "var(--prism-lavender)" },
  { icon: ShieldCheck,  label: "Applying permissions",       accent: "var(--prism-blue)" },
  { icon: CheckCircle2, label: "Finishing the final polish", accent: "var(--gradient-prism)" },
] as const;

// Editorial starters — `phrase` uses *asterisks* to mark the words that carry
// the intent; everything else fades back so the meaning reads at a glance.
// idle refine suggestions — shown above the composer once the app is built
const REFINE_SUGGESTIONS = [
  "Add a summary card with total squares and waste",
  "Let me filter facets by pitch",
  "Export the measurement as a PDF",
];

// Sense logo mark — the 3×3 rounded-square glyph used in conversation headers.
function SenseMark({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="13.5" height="13.5" rx="3.375" fill="#000000" />
      <rect y="15.75" width="13.5" height="13.5" rx="3.375" fill="#B3B3B3" fillOpacity="0.7" />
      <rect x="15.75" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#B3B3B3" fillOpacity="0.7" />
      <rect x="15.75" width="13.5" height="13.5" rx="3.375" fill="#B3B3B3" fillOpacity="0.7" />
      <rect x="15.75" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#000000" />
      <rect y="31.5" width="13.5" height="13.5" rx="3.375" fill="#000000" />
      <rect x="31.5" width="13.5" height="13.5" rx="3.375" fill="#000000" />
      <rect x="31.5" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#B3B3B3" fillOpacity="0.7" />
      <rect x="31.5" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#000000" />
    </svg>
  );
}

// Refine thought-stream — a few plain-text lines (no checklist) that surface
// the AI's reasoning while a refine prompt is processing, before it lands the
// new version in the preview pane. Several variants so consecutive refines
// don't read identically; chosen deterministically by the refine index.
const REFINE_THOUGHT_SETS: {
  secs: number;
  lines: string[];
  summaryTitle: string;
  summary: string[];
}[] = [
  {
    secs: 10,
    lines: [
      "Reading your request against the current layout…",
      "Found where this fits — wiring it into the existing schema.",
      "Adjusting the affected components and re-checking the data bindings.",
      "Looks consistent. Applying the change and refreshing the preview.",
    ],
    summaryTitle: "Here's what I changed",
    summary: [
      "Added the requested element to the layout",
      "Wired it into the existing schema",
      "Re-checked every data binding so the rest of the app keeps working",
    ],
  },
  {
    secs: 7,
    lines: [
      "Parsing the change and locating the affected view…",
      "This touches the summary section — updating its bindings.",
      "Re-running validation to make sure nothing downstream breaks.",
      "All green. Shipping a new version to the preview.",
    ],
    summaryTitle: "Here's what I changed",
    summary: [
      "Updated the summary section to reflect your change",
      "Refreshed its bindings and validated dependent fields",
      "Confirmed nothing downstream broke",
    ],
  },
  {
    secs: 13,
    lines: [
      "Mapping your ask onto the existing component tree…",
      "Found two places this applies — reconciling both.",
      "Recomputing derived fields and checking permissions.",
      "Confirmed consistent. Rendering the updated version.",
    ],
    summaryTitle: "Here's what I changed",
    summary: [
      "Applied the change in both places it affected",
      "Recomputed the derived fields",
      "Confirmed permissions still hold and everything reconciles",
    ],
  },
  {
    secs: 8,
    lines: [
      "Interpreting the request in context of the current build…",
      "Slotting it into the data model without breaking existing rules.",
      "Verifying layout reflow and edge cases.",
      "Done — applying and refreshing the preview.",
    ],
    summaryTitle: "Here's what I changed",
    summary: [
      "Slotted the change into the data model",
      "Left your existing rules untouched",
      "Verified the layout reflows correctly across edge cases",
    ],
  },
];
// deterministic per-refine pick — stable across re-renders (no randomness)
const refineThoughtSet = (i: number) =>
  REFINE_THOUGHT_SETS[i % REFINE_THOUGHT_SETS.length];
// default set drives the streaming timer in runRefine (always the latest entry)
const REFINE_THOUGHTS = REFINE_THOUGHT_SETS[0].lines;

// Attachment preview — full card (thumbnail + name + "EXT, size" + trash) or,
// in editor mode, a compact thumbnail-only chip with the name in a tooltip.
function attExt(name: string) {
  const ext = name.includes(".") ? name.split(".").pop()! : "";
  const u = ext.toUpperCase();
  return u === "JPG" ? "JPEG" : u || "FILE";
}
function AttachmentCard({
  name,
  size,
  compact,
  onRemove,
}: {
  name: string;
  size: string;
  compact?: boolean;
  onRemove?: () => void;
}) {
  const ext = attExt(name);
  const thumb = (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-[10px] text-[9px] font-medium tracking-wide text-[#959595]"
      style={{
        width: compact ? 28 : 38,
        height: compact ? 28 : 38,
        background: "linear-gradient(135deg, #ECECEA 0%, #DFDFDC 100%)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      {ext.slice(0, 4)}
    </span>
  );

  if (compact) {
    return (
      <span title={name} className="inline-flex cursor-default">
        {thumb}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2.5 rounded-[14px] bg-white py-1.5 pl-1.5 pr-1.5"
      style={{
        boxShadow:
          "0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.05), 0 10px 24px -16px rgba(0,0,0,0.2)",
      }}
    >
      {thumb}
      <span className="min-w-0">
        <span className="block text-[11px] font-medium uppercase tracking-wide text-[#959595] leading-tight">
          {ext}, {size}
        </span>
        <span className="block max-w-[180px] truncate text-[13.5px] font-medium tracking-[-0.01em] text-[#000000] leading-tight">
          {name}
        </span>
      </span>
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F0F0] text-[#636363] transition-colors hover:bg-[rgba(0,0,0,0.08)] hover:text-[#000000] active:scale-[0.95]"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </span>
  );
}

// One version row. Current = green + filled check (no action). Past = grey;
// clicking the pill previews that version, the trailing restore icon restores it.
function VersionPill({
  label,
  version,
  current,
  onPreview,
  onRestore,
}: {
  label: string;
  version: number;
  current: boolean;
  onPreview: () => void;
  onRestore: () => void;
}) {
  return (
    <div
      role="button"
      onClick={onPreview}
      className="flex w-full items-center gap-2.5 rounded-[14px] px-3.5 py-2.5 cursor-pointer"
      style={
        current
          ? {
              background: "linear-gradient(180deg, #F0FBF3 0%, #E3F7EA 100%)",
              boxShadow:
                "inset 0 0 0 1px rgba(22,163,74,0.18), 0 1px 2px rgba(22,163,74,0.12), 0 6px 14px -8px rgba(22,163,74,0.4)",
            }
          : {
              background: "#F0F0F0",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.07)",
            }
      }
    >
      {current ? (
        <span className="w-[18px] h-[18px] flex-shrink-0 rounded-full bg-[#000000] flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestore();
          }}
          title={`Restore v${version}.0`}
          className="w-[22px] h-[22px] -ml-0.5 flex-shrink-0 rounded-full flex items-center justify-center text-[#959595] transition-colors hover:bg-[#FFF1E8] hover:text-[#000000]"
        >
          <RotateCcw className="w-[15px] h-[15px]" />
        </button>
      )}
      <span
        className="min-w-0 flex-1 truncate text-[13.5px] font-medium leading-tight"
        style={{ color: current ? "#000000" : "#636363" }}
      >
        {label}
      </span>
      <span
        className="flex-shrink-0 text-[12px] font-medium tabular-nums"
        style={{ color: current ? "#000000" : "#959595" }}
      >
        v{version}.0
      </span>
    </div>
  );
}

const HOME_STARTERS = [
  {
    id: "roofdraw",
    kicker: "Measurement",
    label: "Roof draw",
    chip: "*Sketch* a roof and total the squares",
    icon: Ruler,
    phrase:
      "*Sketch roof facets*, set the *pitch*, and *total the squares* with waste.",
    accent: "#000000",
    template: TEMPLATES[0],
  },
  {
    id: "receivables",
    kicker: "Invoices",
    label: "Accounts receivable",
    chip: "*Group* overdue invoices into aging buckets",
    icon: Receipt,
    phrase: "Group *overdue invoices* into *aging buckets* I can *act on*.",
    accent: "#000000",
    template: TEMPLATES[2],
  },
  {
    id: "quotes",
    kicker: "Quotes",
    label: "Quote triage board",
    chip: "*Surface* quotes stuck in sent 3+ days",
    icon: ListChecks,
    phrase: "Surface *quotes stuck in sent* for *3+ days*, *oldest first*.",
    accent: "#636363",
    template: TEMPLATES[1],
  },
  {
    id: "assets",
    kicker: "Assets",
    label: "Asset service due",
    chip: "*List* assets past their service date",
    icon: Wrench,
    phrase: "List *assets past* their *service date*, grouped by *site*.",
    accent: "#9333EA",
    template: TEMPLATES[3],
  },
  {
    id: "schedule",
    kicker: "Schedule",
    label: "Daily schedule",
    chip: "*Lay out* today's jobs per technician",
    icon: Calendar,
    phrase: "Lay out *today's appointments* per *technician* with time and job.",
    accent: "#0891B2",
    template: TEMPLATES[4],
  },
  {
    id: "customers",
    kicker: "Customers",
    label: "Customer health",
    chip: "*Flag* accounts with stale open jobs",
    icon: Users,
    phrase: "Flag *customers* with *open jobs* older than *14 days*.",
    accent: "#DB2777",
    template: TEMPLATES[5],
  },
] as const;

// Marked label: *starred* span is bold-dark, the rest sits muted. Used by the
// home starter prompt rows.
function ChipPhrase({ phrase }: { phrase: string }) {
  const parts = phrase.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <span className="inline whitespace-nowrap">
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="font-medium text-[#000000]">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i} className="font-normal text-[#636363]">
            {part}
          </span>
        ),
      )}
    </span>
  );
}

// ── Files / folders view — the app's structure as a file tree ────────────
// Container-ish elements render as folders; leaves as files. A read-only
// representation that pairs with the Preview ⇄ Files toggle.
const FOLDER_TYPES = new Set([
  "Container",
  "Board",
  "Scheduler",
  "Metric",
  "Table",
  "BacklogTray",
  "ResourceLane",
]);
const fileExt = (el: AppElementLite) =>
  el.type === "Button"
    ? "action"
    : el.type === "Field"
      ? "field"
      : el.type === "Chart"
        ? "chart"
        : "tsx";

interface AppElementLite {
  id: string;
  type: string;
  label: string;
  binding?: string;
  fields?: string[];
  conditionalFormat?: string;
  action?: string;
  children?: AppElementLite[];
}

function FileRow({
  el,
  depth,
  selectedId,
  onSelect,
}: {
  el: AppElementLite;
  depth: number;
  selectedId?: string;
  onSelect?: (el: AppElementLite) => void;
}) {
  const isFolder =
    !!(el.children && el.children.length) || FOLDER_TYPES.has(el.type);
  const on = selectedId === el.id;
  return (
    <>
      <button
        type="button"
        onClick={() => onSelect?.(el)}
        className="flex w-full items-center gap-2 h-8 rounded-lg px-2 text-left transition-colors hover:bg-[#F0F0F0]"
        style={{
          paddingLeft: 8 + depth * 18,
          background: on ? "#F0F0F0" : undefined,
        }}
      >
        {isFolder ? (
          <Folder className="w-3.5 h-3.5 flex-shrink-0 text-[#000000]" />
        ) : (
          <FileText className="w-3.5 h-3.5 flex-shrink-0 text-[#959595]" />
        )}
        <span
          className="text-[13px] truncate"
          style={{ color: on ? "#000000" : "#000000" }}
        >
          {el.label}
          {!isFolder && (
            <span style={{ color: on ? "#000000" : "#959595" }}>
              .{fileExt(el)}
            </span>
          )}
        </span>
      </button>
      {el.children?.map((c) => (
        <FileRow
          key={c.id}
          el={c}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

// file-extension → tinted badge
function extBadge(name: string) {
  const ext = (name.split(".").pop() ?? "").toLowerCase();
  const map: Record<string, { bg: string; fg: string }> = {
    pdf: { bg: "#FBEAEA", fg: "#E5484D" },
    csv: { bg: "#F0F0F0", fg: "#000000" },
    xlsx: { bg: "#F0F0F0", fg: "#000000" },
    png: { bg: "#EDE9FE", fg: "#6D28D9" },
    jpg: { bg: "#EDE9FE", fg: "#6D28D9" },
    jpeg: { bg: "#EDE9FE", fg: "#6D28D9" },
    json: { bg: "#F0F0F0", fg: "#636363" },
    fig: { bg: "#FFE8DC", fg: "#C2410C" },
  };
  return {
    ext: ext || "file",
    ...(map[ext] ?? { bg: "#EEF1F0", fg: "#636363" }),
  };
}

function FileTreeView({
  appName,
  uploads,
  onUpload,
  onRemove,
}: {
  appName: string;
  uploads: { id: string; name: string; size: string }[];
  onUpload: (files: FileList | null) => void;
  onRemove: (id: string) => void;
}) {
  const upRef = useRef<HTMLInputElement>(null);
  return (
    <div className="h-full overflow-y-auto bg-white">
      {/* header */}
      <div className="h-11 px-4 flex items-center gap-2 border-b border-[rgba(0,0,0,0.05)]">
        <Code2 className="w-4 h-4 text-[#636363]" />
        <span className="text-[13px] font-medium tracking-[-0.01em] text-[#000000]">
          {appName}
        </span>
        <span className="text-[11px] text-[#959595]">· code</span>
        <span className="ml-auto text-[11px] font-medium text-[#959595]">
          {uploads.length} {uploads.length === 1 ? "file" : "files"}
        </span>
      </div>

      {/* uploaded files — @-mentionable in chat */}
      <div className="p-3">
        <input
          ref={upRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            onUpload(e.target.files);
            e.target.value = "";
          }}
        />

        {uploads.length === 0 ? (
          <button
            onClick={() => upRef.current?.click()}
            className="group flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E1E3E6] py-10 text-center transition-colors hover:border-[rgba(0,0,0,0.18)] hover:bg-[#FAFAFA]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0F0F0] text-[#959595] transition-colors group-hover:bg-[#EEF1F0] group-hover:text-[#636363]">
              <Plus className="w-4 h-4" />
            </span>
            <span className="text-[13px] font-medium text-[#636363]">
              Upload files
            </span>
            <span className="max-w-[220px] text-[11.5px] leading-snug text-[#959595]">
              Reference them in chat by typing{" "}
              <span className="font-mono text-[#636363]">@</span>
            </span>
          </button>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)]">
              {uploads.map((f, i) => {
                const b = extBadge(f.name);
                return (
                  <div
                    key={f.id}
                    className={`group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[#FAFAFA] ${i > 0 ? "border-t border-[rgba(0,0,0,0.05)]" : ""}`}
                  >
                    <span
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[9px] font-medium uppercase tracking-tight"
                      style={{ background: b.bg, color: b.fg }}
                    >
                      {b.ext.slice(0, 4)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-[#000000]">
                        {f.name}
                      </span>
                      <span className="block text-[11px] text-[#959595]">
                        {f.size}
                      </span>
                    </span>
                    <button
                      onClick={() => onRemove(f.id)}
                      className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[#959595] opacity-0 transition-all hover:bg-[#EEF1F0] hover:text-[#000000] group-hover:opacity-100"
                      aria-label={`Remove ${f.name}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => upRef.current?.click()}
              className="mt-2 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12.5px] font-medium text-[#636363] transition-colors hover:bg-[#F0F0F0]"
            >
              <Plus className="w-3.5 h-3.5" /> Add files
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ── Code view — the app's element tree (left) + generated source (right) ──
const pascal = (s: string) =>
  s
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");

function genSource(el: AppElementLite): string {
  const comp = pascal(el.label) || "Element";
  const fields = el.fields && el.fields.length ? el.fields : undefined;
  const lines: string[] = [];
  lines.push(`import { useQuery } from "@zuper/sdk";`);
  lines.push(`import { ${el.type}, Field } from "@zuper/ui";`);
  lines.push("");
  if (el.binding) lines.push(`// data: ${el.binding}`);
  lines.push(`export function ${comp}() {`);
  if (el.binding)
    lines.push(`  const { data } = useQuery(${JSON.stringify(el.binding)});`);
  lines.push("");
  lines.push(`  return (`);
  lines.push(`    <${el.type}${el.binding ? " bind={data}" : ""}>`);
  if (fields)
    fields.forEach((f) =>
      lines.push(`      <Field name=${JSON.stringify(f)} />`),
    );
  else if (el.children?.length)
    el.children.forEach((c) => lines.push(`      <${pascal(c.label)} />`));
  else lines.push(`      {/* ${el.label} */}`);
  if (el.conditionalFormat)
    lines.push(`      {/* rule: ${el.conditionalFormat} */}`);
  if (el.action) lines.push(`      {/* action: ${el.action} */}`);
  lines.push(`    </${el.type}>`);
  lines.push(`  );`);
  lines.push(`}`);
  return lines.join("\n");
}

// minimal token highlighter for the demo code
function highlight(line: string) {
  if (line.trim().startsWith("//") || line.trim().startsWith("{/*"))
    return <span style={{ color: "#9AA0A6" }}>{line}</span>;
  const parts = line.split(
    /(\bimport\b|\bexport\b|\bfunction\b|\bconst\b|\breturn\b|"[^"]*")/g,
  );
  return parts.map((p, i) => {
    if (/^(import|export|function|const|return)$/.test(p))
      return (
        <span key={i} style={{ color: "#636363" }}>
          {p}
        </span>
      );
    if (/^".*"$/.test(p))
      return (
        <span key={i} style={{ color: "#000000" }}>
          {p}
        </span>
      );
    return <span key={i}>{p}</span>;
  });
}

function CodeView({
  appName,
  tree,
  archetype,
}: {
  appName: string;
  tree: AppElementLite;
  archetype: string;
}) {
  const [sel, setSel] = useState<AppElementLite>(tree);
  const src = genSource(sel);
  const fileName = `${pascal(sel.label)}.tsx`;
  return (
    <div className="h-full flex overflow-hidden bg-white">
      {/* file tree */}
      <div className="w-[220px] flex-shrink-0 border-r border-[rgba(0,0,0,0.05)] flex flex-col">
        <div className="h-11 px-4 flex items-center gap-2 border-b border-[rgba(0,0,0,0.05)]">
          <Code2 className="w-4 h-4 text-[#636363]" />
          <span className="text-[13px] font-medium tracking-[-0.01em] text-[#000000] truncate">
            {appName}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <FileRow el={tree} depth={0} selectedId={sel.id} onSelect={setSel} />
        </div>
      </div>
      {/* source */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-11 px-4 flex items-center gap-2 border-b border-[rgba(0,0,0,0.05)]">
          <FileText className="w-3.5 h-3.5 text-[#959595]" />
          <span className="text-[12.5px] font-medium text-[#636363]">
            {fileName}
          </span>
          <span className="ml-auto text-[10.5px] font-mono uppercase tracking-wider text-[#D9D9D9]">
            {archetype}
          </span>
        </div>
        <pre
          className="flex-1 overflow-auto p-4 text-[12.5px] leading-[1.7] font-mono"
          style={{ color: "#000000" }}
        >
          {src.split("\n").map((ln, i) => (
            <div key={i} className="flex">
              <span
                className="select-none pr-4 text-right text-[#D9D9D9]"
                style={{ minWidth: "2.5ch" }}
              >
                {i + 1}
              </span>
              <code className="whitespace-pre">{highlight(ln)}</code>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// rounded icon button for the editor pill toolbar
function ToolbarIcon({
  icon: Icon,
  title,
  active,
  onClick,
}: {
  icon: typeof Home;
  title: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
      style={{
        background: active ? "#F0F0F0" : "transparent",
        color: active ? "#000000" : "#636363",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#F0F0F0";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <Icon className="w-[18px] h-[18px]" />
    </button>
  );
}

// §4 publish gate — only roles with `publish_apps` permission can roll an app org-wide
const CAN_PUBLISH: Record<string, boolean> = {
  RG: true,
  MJ: true,
  VP: true,
  AU: false,
};

// ── Sense-logo dot field — a dense dot cloud sampled from the 3×3 brand mark.
// Dot positions stay fixed; the orange/light pattern cycles like the Sense logo.
const SENSE_ORANGE = "#E2632F";
const SENSE_LIGHT = "#F6DDCF";

// each pattern = which of the 9 squares are orange (row-major 3×3).
// clean, recognizable arrangements only — no random fills.
const SENSE_PATTERNS: number[][] = [
  [1, 0, 1, 0, 1, 0, 1, 0, 1], // X / checker (the Sense "S" mark)
  [0, 1, 0, 1, 1, 1, 0, 1, 0], // plus
  [1, 1, 1, 0, 0, 0, 1, 1, 1], // top + bottom rows
  [1, 0, 0, 1, 0, 0, 1, 0, 0], // left column
  [1, 1, 1, 1, 0, 1, 1, 1, 1], // ring / frame
  [0, 0, 1, 0, 1, 0, 1, 0, 0], // diagonal ↗
  [1, 0, 1, 0, 0, 0, 1, 0, 1], // four corners
];

function DragonField() {
  const reduceMotion = useReducedMotion();
  const SIZE = 150;
  const [pat, setPat] = useState(0);
  // two-phase recolor: clear all dots back to light, then fade the new pattern in
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let inner: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setClearing(true); // phase 1: fade orange → light
      inner = setTimeout(() => {
        setPat((p) => (p + 1) % SENSE_PATTERNS.length); // phase 2: fade new dots → orange
        setClearing(false);
      }, 520);
    }, 2800);
    return () => {
      clearInterval(id);
      clearTimeout(inner);
    };
  }, [reduceMotion]);

  // sample a fine dot grid; keep dots inside the 9 rounded squares, tag with cell index
  const dots = useMemo(() => {
    const cellPx = SIZE / 3;
    const padRatio = 0.12;
    const radius = cellPx * 0.26;
    const STEP = 5;
    const out: { x: number; y: number; cell: number }[] = [];
    const inRounded = (
      px: number,
      py: number,
      sx: number,
      sy: number,
      s: number,
    ) => {
      const lx = px - sx,
        ly = py - sy;
      if (lx < 0 || ly < 0 || lx > s || ly > s) return false;
      const cx = Math.min(lx, s - lx),
        cy = Math.min(ly, s - ly);
      if (cx < radius && cy < radius) {
        const dx = radius - cx,
          dy = radius - cy;
        return dx * dx + dy * dy <= radius * radius;
      }
      return true;
    };
    for (let py = STEP / 2; py < SIZE; py += STEP) {
      for (let px = STEP / 2; px < SIZE; px += STEP) {
        const gx = Math.floor(px / cellPx),
          gy = Math.floor(py / cellPx);
        if (gx > 2 || gy > 2) continue;
        const pad = cellPx * padRatio;
        const sx = gx * cellPx + pad,
          sy = gy * cellPx + pad,
          s = cellPx - pad * 2;
        if (inRounded(px, py, sx, sy, s))
          out.push({ x: px, y: py, cell: gy * 3 + gx });
      }
    }
    return { out, STEP };
  }, []);

  const pattern = SENSE_PATTERNS[pat];

  return (
    <div
      className="pointer-events-none select-none relative"
      aria-hidden="true"
      style={{ width: SIZE, height: SIZE }}
    >
      {dots.out.map((d, i) => {
        const solid = !clearing && pattern[d.cell] === 1; // clearing → everything light
        const order = (d.x + d.y) / (2 * SIZE); // diagonal stagger — the recolor sweeps across
        const delay = order * 0.5;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              left: d.x - (dots.STEP - 1) / 2,
              top: d.y - (dots.STEP - 1) / 2,
              width: dots.STEP - 1,
              height: dots.STEP - 1,
              willChange: "background-color, opacity",
            }}
            initial={
              reduceMotion
                ? { opacity: 0.7, backgroundColor: SENSE_LIGHT }
                : { opacity: 0, backgroundColor: SENSE_LIGHT }
            }
            animate={{
              backgroundColor: solid ? SENSE_ORANGE : SENSE_LIGHT,
              opacity: solid ? 0.95 : 0.55,
            }}
            transition={
              reduceMotion
                ? { duration: 0.3 }
                : {
                    backgroundColor: {
                      duration: 0.4,
                      delay,
                      ease: [0.22, 1, 0.36, 1],
                    },
                    opacity: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
                  }
            }
          />
        );
      })}
    </div>
  );
}

export function BuildWorkspace({
  currentUser = "MJ",
  seededPrompt,
  onConsumeSeed,
  seededOpenAppId,
  onConsumeOpenApp,
  seededShowApps,
  createNonce,
  onPlanningChange,
  onExit,
}: Props) {
  const canPublish = CAN_PUBLISH[currentUser] ?? true;
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("home");
  const [prompt, setPrompt] = useState("");
  const [canvasMode] = useState<CanvasMode>("preview"); // edit-element experience removed
  // editor body view: live preview vs. the app's file/folder structure
  const [editorView, setEditorView] = useState<"preview" | "code" | "files">(
    "preview",
  );
  const [selectedEl, setSelectedEl] = useState("el-card");
  const [skillBadge, setSkillBadge] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>("JN-2451");
  const [publishOpen, setPublishOpen] = useState(false);
  const [openedApp, setOpenedApp] = useState<BuildApp | null>(null);
  const [genStep, setGenStep] = useState(0);
  // true only when the build finished naturally; false if stopped mid-flow.
  const [buildComplete, setBuildComplete] = useState(false);
  const [published, setPublished] = useState(false);
  const [readOnlyPublish, setReadOnlyPublish] = useState(false); // §9 read-only toggle → hides write controls for viewers
  const [refineDraft, setRefineDraft] = useState("");
  const [refineLog, setRefineLog] = useState<string[]>([]);
  const [isRefining, setIsRefining] = useState(false);
  // how many refine thought-lines have streamed in for the current refine
  const [refineThoughtStep, setRefineThoughtStep] = useState(0);
  const refineThoughtTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // version history — initial build is v1, each applied refine adds a version
  const [historyOpen, setHistoryOpen] = useState(false);
  const [convoCollapsed, setConvoCollapsed] = useState(false);
  // when set, the right pane previews this version number (read-only)
  const [previewVersion, setPreviewVersion] = useState<number | null>(null);
  const [clarifyAnswer, setClarifyAnswer] = useState<string | null>(null);
  // multi-question clarify: per-question answers keyed by question id
  const [clarifyAnswers, setClarifyAnswers] = useState<Record<string, string>>(
    {},
  );
  // one-at-a-time clarify: index of the question currently being asked
  const [clarifyStep, setClarifyStep] = useState(0);
  // accordion: which answered-question row is expanded (-1 = none)
  const [clarifyOpenIdx, setClarifyOpenIdx] = useState(-1);
  // reasoning-state animation: which reasoning line + plan step is "done"
  const [reasonLine, setReasonLine] = useState(0);
  const [planStep, setPlanStep] = useState(0);
  const [planStarted, setPlanStarted] = useState(false); // gate step "loading" until plan phase begins
  const clarifyQuestionsRef = useRef<HTMLDivElement>(null); // scroll target when questions appear
  const convoScrollRef = useRef<HTMLDivElement>(null); // conversation pane scroll area
  const [auditOpen, setAuditOpen] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [, setEditLog] = useState<string[]>([]); // element-scoped edits applied
  const [archetype, setArchetype] = useState<Archetype>("roofdraw");
  // per-archetype clarify content — reasoning trace, plan checklist, questions.
  // cockpit/commission/roofdraw all run the reason→clarify flow; kanban skips it.
  const clarifyReasoning =
    archetype === "cockpit"
      ? COCKPIT_REASONING
      : archetype === "commission"
        ? COMMISSION_REASONING
        : CLARIFY_REASONING;
  const clarifyPlan =
    archetype === "cockpit"
      ? COCKPIT_CLARIFY_PLAN
      : archetype === "commission"
        ? COMMISSION_CLARIFY_PLAN
        : CLARIFY_PLAN;
  const clarifyQuestions =
    archetype === "cockpit"
      ? COCKPIT_QUESTIONS
      : archetype === "commission"
        ? COMMISSION_QUESTIONS
        : CLARIFY_QUESTIONS;
  const [homeStarter, setHomeStarter] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const appGalleryRef = useRef<HTMLDivElement>(null);
  const refineInputRef = useRef<HTMLInputElement>(null);
  const [refineFocused, setRefineFocused] = useState(false);
  // Free-text the user can type during the clarify "Waiting for input" state to
  // continue without answering every chip.
  const [followUpDraft, setFollowUpDraft] = useState("");
  // Template attached from a starter — shown as a thumbnail chip in the box.
  const [attachedTemplate, setAttachedTemplate] = useState<PublicApp | null>(
    null,
  );
  // Files the user uploads (first prompt + Code view). @-mentionable in chat.
  const [uploadedFiles, setUploadedFiles] = useState<
    { id: string; name: string; size: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next = Array.from(files).map((f, i) => ({
      id: `up-${uploadedFiles.length + i}-${f.name}`,
      name: f.name,
      size:
        f.size > 1024 * 1024
          ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
          : `${Math.max(1, Math.round(f.size / 1024))} KB`,
    }));
    setUploadedFiles((prev) => [...prev, ...next]);
  };
  const removeFile = (id: string) =>
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));

  // ── Conversation threads (per app) ──────────────────────────────────────
  // Each app can hold multiple threads. The active thread drives the left pane.
  // Titles auto-generate from the first message; until then they read
  // "New conversation".
  const [threads, setThreads] = useState<BuildThread[]>([
    { id: "th-1", title: "Overdue SLA escalation logic", createdAt: "2h ago" },
    {
      id: "th-2",
      title: "Filter by region + crew size",
      createdAt: "yesterday",
    },
    { id: "th-3", title: "New conversation", createdAt: "just now" },
  ]);
  const [activeThreadId, setActiveThreadId] = useState("th-3");

  const selectThread = (id: string) => {
    setActiveThreadId(id);
    setRefineLog([]);
    setRefineDraft("");
  };
  const activeThread =
    threads.find((t) => t.id === activeThreadId) ?? threads[0];

  // back / exit → the composer home (with My Apps)
  const resetBuild = () => {
    setStage("home");
    setOpenedApp(null);
    setPrompt("");
    setFollowUpDraft("");
    setRefineLog([]);
    setClarifyAnswer(null);
    setClarifyAnswers({});
    setClarifyStep(0);
    setSkillBadge(false);
    setPublished(false);
    setAuditOpen(false);
    setAutoOpen(false);
    setHistoryOpen(false);
    setPreviewVersion(null);
  };
  // "Build a new app" → the prompt composer (the old home screen)
  const openComposer = () => {
    setOpenedApp(null);
    setPrompt("");
    setAttachedTemplate(null);
    setRefineLog([]);
    setClarifyAnswer(null);
    setClarifyAnswers({});
    setClarifyStep(0);
    setSkillBadge(false);
    setPublished(false);
    setStage("home");
    setTimeout(() => taRef.current?.focus(), 60);
  };
  const refineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // one-shot materialization reveal — fires when a build lands or a refine
  // finishes, driving the prism sweep + blur-to-sharp over the canvas
  const [materializeNonce, setMaterializeNonce] = useState(0);
  const prevRefiningRef = useRef(false);
  useEffect(() => {
    if (prevRefiningRef.current && !isRefining) setMaterializeNonce((n) => n + 1);
    prevRefiningRef.current = isRefining;
  }, [isRefining]);
  const prevBuildCompleteRef = useRef(buildComplete);
  useEffect(() => {
    if (!prevBuildCompleteRef.current && buildComplete)
      setMaterializeNonce((n) => n + 1);
    prevBuildCompleteRef.current = buildComplete;
  }, [buildComplete]);
  // resume a build that was stopped mid-flow (canvas not finished yet)
  const resumeBuild = () => setStage("generating");
  // run a refine for a given prompt — used by the composer (sendRefine) and by
  // clicking a suggested prompt (fires immediately, no typing needed).
  const runRefine = (raw: string) => {
    const msg = raw.trim();
    if (!msg || stage !== "preview" || isRefining) return;
    setRefineLog((l) => [...l, msg]);
    setSkillBadge(true);
    setRefineDraft("");
    setIsRefining(true);
    // stream the thought-lines one at a time, then land the version in preview
    refineThoughtTimers.current.forEach(clearTimeout);
    refineThoughtTimers.current = [];
    setRefineThoughtStep(1);
    // each consecutive refine thinks a bit longer than the previous one —
    // the gap between thought-lines grows with the refine index.
    const refineIndex = refineLog.length; // index of the entry being added
    const THOUGHT_GAP = 850 + refineIndex * 500; // ms between thought-lines
    REFINE_THOUGHTS.forEach((_, i) => {
      if (i === 0) return; // first line shown immediately
      refineThoughtTimers.current.push(
        setTimeout(() => setRefineThoughtStep(i + 1), i * THOUGHT_GAP),
      );
    });
    const total = REFINE_THOUGHTS.length * THOUGHT_GAP + 400;
    refineTimer.current = setTimeout(() => setIsRefining(false), total);
    // auto-title an untitled thread from its first message
    setThreads((ts) =>
      ts.map((t) =>
        t.id === activeThreadId && t.title === "New conversation"
          ? { ...t, title: deriveThreadTitle(msg) }
          : t,
      ),
    );
  };
  const sendRefine = () => runRefine(refineDraft);
  // Stop the AI mid-process.
  // - Editor active (app already built → at preview/refine): just cancel, keep the editor.
  // - No editor yet (initial build flow): drop into the "Waiting for input" conversation.
  const stopProcessing = () => {
    if (refineTimer.current) {
      clearTimeout(refineTimer.current);
      refineTimer.current = null;
    }
    refineThoughtTimers.current.forEach(clearTimeout);
    refineThoughtTimers.current = [];
    setIsRefining(false);
    if (stage === "preview" || stage === "viewer") return; // editor active — keep it
    if (stage === "generating") {
      setStage("preview");
      return;
    } // canvas already up — settle into the editor
    if (stage === "homeReasoning" || stage === "homeThinking") {
      setGenStep(0);
      setStage("homeClarify"); // no canvas yet — back to waiting conversation
    }
  };

  // Chat → Build handoff: pre-seed the prompt box (§1)
  useEffect(() => {
    if (seededPrompt) {
      setPrompt(seededPrompt);
      onConsumeSeed?.();
      taRef.current?.focus();
    }
  }, [seededPrompt, onConsumeSeed]);

  // report planning/flow state up so the app can retain the chat sidebar on
  // the Build home and hide it once a conversation/planning flow begins.
  useEffect(() => {
    // "home" and "apps" are sidebar-reachable landing pages — keep the chat
    // sidebar + nav visible. Only a real planning/generation flow goes full screen.
    onPlanningChange?.(stage !== "home" && stage !== "apps");
  }, [stage, onPlanningChange]);

  // generating animation — drives both the left-pane trace and the
  // full-screen build overlay. Snappy: each phase holds ~620ms before
  // advancing, with a short tail before the preview reveals.
  useEffect(() => {
    if (stage !== "generating") return;
    setGenStep(0);
    setBuildComplete(false);
    const id = setInterval(
      () =>
        setGenStep((s) => {
          if (s >= GEN_PHASES.length - 1) {
            clearInterval(id);
            setTimeout(() => {
              setBuildComplete(true);
              setStage("preview");
            }, 700);
            return s;
          }
          return s + 1;
        }),
      1100,
    );
    return () => clearInterval(id);
  }, [stage, archetype]);

  useEffect(() => {
    if (stage !== "homeThinking") return;
    const id = setTimeout(() => setStage("generating"), 600);
    return () => clearTimeout(id);
  }, [stage]);

  // reasoning state — stream reasoning lines + resolve plan steps, then hand
  // off to the clarify questions once the AI has "gathered context".
  //
  // Each plan step gets a visible "resolving…" loading phase before it
  // completes, so the AI reads as genuinely working through each source.
  // Timeline (ms):  reasoning lines first → then steps start, each holding
  // ~1.7s in its loading state before the next begins.
  useEffect(() => {
    if (stage !== "homeReasoning") return;
    setReasonLine(0);
    setPlanStep(0);
    setPlanStarted(false);
    const timers: ReturnType<typeof setTimeout>[] = [];

    const START = 250; // initial beat before anything streams
    const REASON_GAP = 450; // gap between streamed reasoning lines
    const STEP_DUR = 650; // how long each plan step shows "resolving…"
    const reasonDone = START + clarifyReasoning.length * REASON_GAP;

    // 1. stream the reasoning lines
    clarifyReasoning.forEach((_, i) =>
      timers.push(
        setTimeout(() => setReasonLine(i + 1), START + i * REASON_GAP),
      ),
    );

    // 2. then resolve plan steps one-by-one — each holds STEP_DUR in its
    //    loading state (planStep === i) before completing (planStep > i).
    const stepsStart = reasonDone + 150;
    timers.push(setTimeout(() => setPlanStarted(true), stepsStart));
    clarifyPlan.forEach((_, i) =>
      timers.push(
        setTimeout(() => setPlanStep(i + 1), stepsStart + (i + 1) * STEP_DUR),
      ),
    );

    // 3. hand off once the last step has finished + a beat to read it
    const total = stepsStart + (clarifyPlan.length + 1) * STEP_DUR + 350;
    timers.push(setTimeout(() => setStage("homeClarify"), total));
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  // once questions appear, scroll the first one into view so it's obvious
  // the user needs to fill them in.
  useEffect(() => {
    if (stage !== "homeClarify") return;
    const id = setTimeout(() => {
      clarifyQuestionsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 420);
    return () => clearTimeout(id);
  }, [stage]);

  // when a build lands in preview (with the "Initial build v1" pill at the
  // bottom of the conversation), drop the convo pane to the latest message so
  // the version pill is in view rather than buried above the fold.
  useEffect(() => {
    if (stage !== "preview" || !buildComplete || historyOpen) return;
    const id = setTimeout(() => {
      const el = convoScrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }, 360);
    return () => clearTimeout(id);
  }, [stage, buildComplete, historyOpen, refineLog.length]);

  // keep URL hash in sync with build stage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash =
      stage === "home" ||
      stage === "apps" ||
      stage === "homeReasoning" ||
      stage === "homeClarify" ||
      stage === "homeThinking"
        ? "#build/new"
        : "#build/editor";
    if (window.location.hash !== hash) window.location.hash = hash;
  }, [stage]);

  const submitPrompt = () => {
    if (!prompt.trim()) return;
    const a = classify(prompt);
    setArchetype(a);
    setRefineLog([]);
    setBuildComplete(false); // fresh build — no version exists until it finishes
    setClarifyAnswer(null);
    setClarifyAnswers({});
    setClarifyStep(0);
    // roofdraw / cockpit / commission → reason (gather context) → clarify (ask questions)
    // kanban → generating immediately
    if (a === "roofdraw" || a === "cockpit" || a === "commission")
      setStage("homeReasoning");
    else {
      setStage("generating");
    }
  };

  // single-question clarify (still used by the in-build ChatThread composer)
  const answerClarify = (opt: string) => {
    setClarifyAnswer(opt);
    setStage("homeThinking");
  };

  // set one question's answer
  const setClarify = (id: string, value: string) =>
    setClarifyAnswers((prev) => ({ ...prev, [id]: value }));

  // one-at-a-time: advance to the next question, or submit on the last
  const advanceClarify = () => {
    if (clarifyStep < clarifyQuestions.length - 1) {
      setClarifyStep((s) => s + 1);
    } else {
      submitClarify();
    }
  };

  // go back to the previous question to change an answer
  const goBackClarify = () => {
    if (clarifyStep === 0) return;
    const prev = clarifyQuestions[clarifyStep - 1];
    // restore a typed (non-choice) answer into the box for editing
    setFollowUpDraft(
      prev && prev.kind !== "choice" ? clarifyAnswers[prev.id] || "" : "",
    );
    setClarifyStep((s) => s - 1);
  };

  // all required questions answered?
  const clarifyComplete = clarifyQuestions.every(
    (q) => q.optional || (clarifyAnswers[q.id] && clarifyAnswers[q.id].trim()),
  );

  // ready to generate once every required question is answered OR the user has
  // typed a free-text instruction to continue with.
  const canContinueClarify = clarifyComplete || !!followUpDraft.trim();

  // submit answers (+ any typed follow-up) → thinking → generating
  const submitClarify = () => {
    if (!canContinueClarify) return;
    const summary = [
      ...clarifyQuestions.map((q) => clarifyAnswers[q.id]).filter(Boolean),
      followUpDraft.trim(),
    ]
      .filter(Boolean)
      .join(" · ");
    setClarifyAnswer(summary);
    setFollowUpDraft("");
    setStage("homeThinking");
  };

  const useTemplate = (t: BuildTemplate) => {
    const starterIndex = HOME_STARTERS.findIndex((s) => s.template.id === t.id);
    if (starterIndex >= 0) setHomeStarter(starterIndex);
    setPrompt(t.prompt);
    setTimeout(() => taRef.current?.focus(), 50);
  };

  const scrollToAppGallery = () => {
    appGalleryRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const openApp = (app: BuildApp) => {
    setOpenedApp(app);
    setArchetype(
      app.id === "app-quote" || app.id === "app-revenue"
        ? "kanban"
        : app.id === "app-receivables" || app.id === "app-invoices"
          ? "cockpit"
          : app.id === "app-commission"
            ? "commission"
            : "roofdraw",
    );
    setSkillBadge(false);
    setBuildComplete(true);
    setStage("preview");
  };

  // Sidebar → Build: open a built app straight into the editor
  useEffect(() => {
    if (!seededOpenAppId) return;
    const app = MY_APPS.find((a) => a.id === seededOpenAppId);
    if (app) openApp(app);
    onConsumeOpenApp?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seededOpenAppId]);

  // Sidebar → Build: "My apps" lands on the listing.
  useEffect(() => {
    if (seededShowApps) setStage("apps");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seededShowApps]);

  // Sidebar → Build: "Create new" always returns to the home composer (the
  // creation landing), from any stage. Nonce bumps on every click so a repeat
  // tap re-triggers even if the value is otherwise unchanged.
  useEffect(() => {
    if (createNonce === undefined || createNonce === 0) return;
    setStage("home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createNonce]);

  const homeReasoningActive = stage === "homeReasoning";
  const homeFlowActive =
    stage === "homeReasoning" ||
    stage === "homeThinking" ||
    stage === "homeClarify";
  const homeClarifyActive = stage === "homeClarify";

  // White flash that bridges the blue↔orange color swap so neither hard-cuts.
  const [colorFlash, setColorFlash] = useState(false);
  const prevClarify = useRef(homeClarifyActive);
  useEffect(() => {
    if (homeFlowActive && prevClarify.current !== homeClarifyActive) {
      setColorFlash(true);
      const id = setTimeout(() => setColorFlash(false), 360);
      prevClarify.current = homeClarifyActive;
      return () => clearTimeout(id);
    }
    prevClarify.current = homeClarifyActive;
  }, [homeClarifyActive, homeFlowActive]);
  const activeStarter = HOME_STARTERS[homeStarter];

  // ── HOME · REASONING + CLARIFY CONVERSATION ─────────────────────────────
  // Submitting a dispatch prompt drops into a Sense-style conversation:
  //   1. homeReasoning — AI streams its reasoning + a live plan panel that
  //      "fetches records" from Jobs / Technicians / Quotes before it can ask.
  //   2. homeClarify  — Sense asks all 4 questions at once; user answers via
  //      chips + free text, then hits Generate.
  //   3. homeThinking — brief hand-off into the build.
  // Build view shell: a conversation column on the left + the canvas on the
  // right. The conversation drives reasoning → clarify → refine; the canvas
  // slides in beside it as the app builds — one continuous layout.
  // ── BUILDING — two-pane AI chat + canvas ────────────────────────────────
  // Left: the conversation (prompt → clarify → plan → refine).
  // Right: the canvas, which swipes in from the right once Sense starts building.
  const isViewer = stage === "viewer";
  const ARCHETYPE_NAME: Record<Archetype, string> = {
    roofdraw: "Measurement · Roof Draw",
    commission: "Commission Calculator",
    cockpit: "Accounts Receivable",
    kanban: "Quote Follow-up Engine",
  };
  const appName = openedApp?.name || ARCHETYPE_NAME[archetype];
  const ARCHETYPE_MODULE: Record<Archetype, string> = {
    roofdraw: "Measurement",
    commission: "Commission",
    cockpit: "Invoices",
    kanban: "Quotes",
  };
  const archetypeModule = openedApp?.module || ARCHETYPE_MODULE[archetype];
  const phase =
    stage === "clarify"
      ? "clarify"
      : stage === "generating"
        ? "generating"
        : "ready";
  const activePlan =
    archetype === "cockpit"
      ? COCKPIT_PLAN
      : archetype === "kanban"
        ? KANBAN_PLAN
        : archetype === "commission"
          ? COMMISSION_PLAN
          : ROOFDRAW_PLAN;
  const activeTree =
    archetype === "cockpit"
      ? COCKPIT_TREE
      : archetype === "kanban"
        ? KANBAN_TREE
        : archetype === "commission"
          ? COMMISSION_TREE
          : ROOFDRAW_TREE;

  const Canvas = (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "#F8F8F8" }}
    >
      {isViewer ? (
        /* viewer header — back arrow + breadcrumb + star */
        <div
          className="relative z-30 h-14 flex items-center gap-3 px-4 flex-shrink-0"
          style={{ background: "#F8F8F8" }}
        >
          <button
            onClick={() => setStage("preview")}
            title="Back"
            className="w-8 h-8 -ml-1 rounded-lg flex items-center justify-center text-[#636363] hover:bg-[#F0F0F0] hover:text-[#000000] transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[14px] font-medium text-[#636363]">Work</span>
            <span className="text-[#D9D9D9] text-[15px]">/</span>
            <span className="text-[14px] font-medium tracking-[-0.01em] text-[#000000] truncate">
              {appName.replace(/\s*·\s*/g, " ")}
            </span>
          </div>
          <button
            title="Favorite"
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-[#D9D9D9] hover:bg-[#F0F0F0] hover:text-[#000000] transition-colors flex-shrink-0"
          >
            <Star className="w-[18px] h-[18px]" />
          </button>
        </div>
      ) : (
        previewVersion !== null ? (
          /* preview mode — centered floating bar: version title + Restore.
             slides+fades down into the row (ease-out, under 300ms). */
          <div
            className="relative z-30 h-14 flex items-center justify-center px-3 flex-shrink-0 overflow-hidden"
            style={{ background: "#F8F8F8" }}
          >
            <motion.div
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -12, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-2 rounded-full bg-white pl-1.5 pr-1.5 py-1.5"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.06), 0 16px 40px -16px rgba(0,0,0,0.35)",
              }}
            >
              <button
                onClick={() => setPreviewVersion(null)}
                title="Exit preview"
                className="w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center text-[#636363] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000] active:scale-[0.95]"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="pr-1 text-[13.5px] font-medium tracking-[-0.01em] text-[#000000]">
                Preview of version {previewVersion}
              </span>
              <button
                onClick={() => setPreviewVersion(null)}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[12.5px] font-medium text-white transition-transform duration-150 ease-out active:scale-[0.97]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 35%, #000000 100%), #000000",
                  boxShadow:
                    "inset 0 1.5px 0 rgba(255,255,255,0.25), 0 0 0 1px #000000, 0 4px 7px rgba(253,80,0,0.3)",
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 text-white/90" />
                Restore
              </button>
            </motion.div>
          </div>
        ) : (
        /* board header — pill toolbar */
        <div
          className="relative z-30 h-14 flex items-center justify-between px-3 flex-shrink-0"
          style={{ background: "#F8F8F8" }}
        >
          {/* left: Preview/Code toggle pill */}
          <div className="flex items-center gap-2">
            {!openedApp && !isViewer && convoCollapsed && (
              <button
                onClick={() => setConvoCollapsed(false)}
                title="Expand panel"
                className="w-8 h-7 rounded-md flex items-center justify-center text-[#636363] bg-white transition-colors hover:text-[#000000]"
                style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
              </button>
            )}
            {!isViewer ? (
              <div
                className="inline-flex items-center gap-0.5 p-0.5 rounded-lg"
                style={{ background: "#ECECEC" }}
              >
                {(
                  [
                    ["preview", Eye, "Preview"],
                    ["code", Code2, "Code"],
                    ["files", Folder, "Files"],
                  ] as const
                ).map(([v, Icon, label]) => {
                  const on = editorView === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setEditorView(v)}
                      title={label}
                      className="inline-flex items-center justify-center h-7 w-8 rounded-md transition-colors"
                      style={{
                        background: on ? "#FFFFFF" : "transparent",
                        color: on ? "#000000" : "#959595",
                        boxShadow: on
                          ? "0 1px 2px rgba(0,0,0,0.08)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!on) e.currentTarget.style.color = "#000000";
                      }}
                      onMouseLeave={(e) => {
                        if (!on) e.currentTarget.style.color = "#959595";
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* right: actions */}
          <div className="flex items-center gap-1">
            {previewVersion === null && (
              <>
            {archetype === "kanban" && (
              <ToolbarIcon
                icon={Zap}
                title="Automations"
                active={autoOpen}
                onClick={() => setAutoOpen((o) => !o)}
              />
            )}
            <button
              onClick={() => canPublish && setPublishOpen(true)}
              disabled={!canPublish}
              title={
                canPublish ? "Publish app" : "Needs the publish_apps permission"
              }
              className="ml-1.5 inline-flex items-center gap-1.5 px-3.5 py-1.25 rounded-sm text-[12.5px] font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                textShadow: "0 4px 4px rgba(0,0,0,0.4)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.04) 35%, #000000 100%), #000000",
                boxShadow:
                  "inset 0 1.5px 0 rgba(255,255,255,0.15), 0 0 0 1px #000000, 0 4px 7px rgba(0,0,0,0.2)",
                transition:
                  "filter 160ms ease, box-shadow 160ms ease, transform 100ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(1.18)";
                e.currentTarget.style.boxShadow =
                  "inset 0 1.5px 0 rgba(255,255,255,0.2), 0 0 0 1px #000000, 0 6px 12px rgba(0,0,0,0.26)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.boxShadow =
                  "inset 0 1.5px 0 rgba(255,255,255,0.15), 0 0 0 1px #000000, 0 4px 7px rgba(0,0,0,0.2)";
                e.currentTarget.style.transform = "none";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.filter = "brightness(0.9)";
                e.currentTarget.style.boxShadow =
                  "inset 0 1.5px 0 rgba(255,255,255,0.1), 0 0 0 1px #000000, 0 2px 4px rgba(0,0,0,0.22)";
                e.currentTarget.style.transform = "translateY(1px)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.filter = "brightness(1.18)";
                e.currentTarget.style.boxShadow =
                  "inset 0 1.5px 0 rgba(255,255,255,0.2), 0 0 0 1px #000000, 0 6px 12px rgba(0,0,0,0.26)";
                e.currentTarget.style.transform = "none";
              }}
            >
              {canPublish ? (
                <Eye className="w-3.5 h-3.5 text-white/85" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-white/85" />
              )}
              Publish
            </button>
              </>
            )}
          </div>
        </div>
        )
      )}

      {/* body */}
      <div className="flex-1 flex overflow-hidden relative">
        <div
          className="flex-1 overflow-hidden p-3 pt-0"
          style={{ background: "#F8F8F8" }}
        >
          <motion.div
            // brief crossfade when entering/leaving a version preview so the
            // pane reads as a deliberate state change, not an instant swap
            key={previewVersion === null ? "current" : `preview-${previewVersion}`}
            initial={
              reduceMotion ? { opacity: 1 } : { opacity: 0.4, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="relative h-full overflow-hidden rounded-[20px] bg-white"
            style={{
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.03), 0 18px 44px -34px rgba(0,0,0,0.28)",
            }}
          >
            {phase === "generating" ? (
              <GenerationOverlay
                genStep={genStep}
                title={GEN_TITLE[archetype]}
                reduceMotion={!!reduceMotion}
              />
            ) : homeClarifyActive ? (
              /* waiting for the user — overlay parked on a "Waiting for input"
                 card once context is gathered (clarify questions are showing). */
              <GenerationOverlay
                mode="waiting"
                title="Waiting for your input…"
                reduceMotion={!!reduceMotion}
              />
            ) : archetype === "cockpit" && homeReasoningActive ? (
              /* cockpit mounts the preview during reasoning too — show
                 "Thinking…" while it gathers context, before clarify. */
              <GenerationOverlay
                mode="structure"
                title="Thinking…"
                reduceMotion={!!reduceMotion}
              />
            ) : homeFlowActive ? (
              /* reasoning — first build step only, "Building your structure" */
              <GenerationOverlay
                mode="structure"
                title="Building your structure…"
                reduceMotion={!!reduceMotion}
              />
            ) : !buildComplete && !isViewer ? (
              /* stopped mid-flow — app isn't finished; prompt the user to resume */
              <div
                className="h-full flex flex-col items-center justify-center px-8 text-center"
                style={{
                  backgroundColor: "#F8F8F8",
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white"
                  style={{
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.05), 0 10px 28px -18px rgba(0,0,0,0.4)",
                  }}
                >
                  <Sparkles className="w-5 h-5 text-[#000000]" />
                </span>
                <p className="mt-4 text-[15px] font-medium tracking-[-0.02em] text-[#000000]">
                  Build paused
                </p>
                <p className="mt-1.5 max-w-[280px] text-[13px] leading-[1.5] text-[#636363]">
                  You stopped before the app finished. Hit Generate to pick up
                  where Sense left off.
                </p>
              </div>
            ) : editorView === "files" && !isViewer ? (
              <FileTreeView
                appName={appName}
                uploads={uploadedFiles}
                onUpload={addFiles}
                onRemove={removeFile}
              />
            ) : editorView === "code" && !isViewer ? (
              <CodeView
                appName={appName}
                tree={activeTree}
                archetype={archetype}
              />
            ) : (
              <EditProvider
                active={false}
                onApply={(el: SelectedElement, instruction: string) => {
                  setEditLog((l) => [...l, `${el.label}: ${instruction}`]);
                  setSkillBadge(true);
                }}
              >
                {archetype === "kanban" ? (
                  /* status-triage kanban (§4c) — Quote Follow-up Engine */
                  <DispatchBoard
                    showSkillBadge={skillBadge}
                    selectedJobId={canvasMode === "edit" ? selectedJob : null}
                    onSelectJob={
                      canvasMode === "edit"
                        ? (id) => {
                            setSelectedJob(id);
                            setSelectedEl("el-card");
                          }
                        : undefined
                    }
                    isViewer={isViewer}
                  />
                ) : archetype === "cockpit" ? (
                  /* operational cockpit (§4a) — MetricStat + DataTable; amount redacted under viewer RBAC */
                  <ArCockpit
                    isViewer={isViewer}
                    canSeeFinancials={!(isViewer && currentUser === "AU")}
                    canWrite={
                      !(isViewer && (readOnlyPublish || currentUser === "AU"))
                    }
                    onOpenAudit={() => setAuditOpen(true)}
                  />
                ) : archetype === "commission" ? (
                  /* commission calculator — deals × tiered rates → payout */
                  <CommissionCalculator
                    isViewer={isViewer}
                    canSeeFinancials={!(isViewer && currentUser === "AU")}
                  />
                ) : (
                  /* roof-draw measurement canvas — facet sketch → area math */
                  <RoofDrawCanvas
                    isViewer={isViewer}
                    selectedFacetId={canvasMode === "edit" ? selectedJob : null}
                    onSelectFacet={
                      canvasMode === "edit"
                        ? (id) => {
                            setSelectedJob(id);
                            setSelectedEl("el-card");
                          }
                        : undefined
                    }
                  />
                )}
              </EditProvider>
            )}

            {/* refine materialization — frosted scrim; a single card floats
                over the app while the change refracts in (no spinner) */}
            <AnimatePresence>
              {isRefining && !isViewer && (
                <motion.div
                  key="refine-loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 z-30 flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <motion.div
                    initial={
                      reduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, y: 14, scale: 0.96 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={
                      reduceMotion
                        ? { duration: 0.2 }
                        : { type: "spring", stiffness: 300, damping: 24 }
                    }
                    className="relative flex items-center gap-3.5 overflow-hidden rounded-[20px]"
                    style={{
                      width: 360,
                      height: 80,
                      paddingLeft: 16,
                      paddingRight: 18,
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(24px)",
                      WebkitBackdropFilter: "blur(24px)",
                      boxShadow:
                        "0 2px 8px rgba(0,0,0,0.08), 0 32px 64px -24px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* the spectrum breathes beneath the frosted card */}
                    <PrismGlow intensity={0.5} blur={30} animate={!reduceMotion} />
                    <div
                      className="relative rounded-[13px] flex items-center justify-center flex-shrink-0"
                      style={{ width: 46, height: 46, background: "var(--gradient-prism)" }}
                    >
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={
                        "relative text-[16px] font-medium tracking-[-0.01em] " +
                        (reduceMotion ? "text-[#000000]" : "prism-text-shimmer")
                      }
                    >
                      Materializing changes…
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* materialization reveal — one-shot prism sweep + blur-to-sharp
                as the (re)built app refracts into existence */}
            <AnimatePresence>
              {materializeNonce > 0 && !reduceMotion && (
                <motion.div
                  key={`materialize-${materializeNonce}`}
                  className="absolute inset-0 z-40 pointer-events-none overflow-hidden"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.7, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* frosted veil fades — content sharpens into focus */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      background: "rgba(255,255,255,0.35)",
                    }}
                  />
                  {/* the prism band passes through once */}
                  <motion.div
                    className="absolute inset-y-0"
                    initial={{ x: "-80%" }}
                    animate={{ x: "180%" }}
                    transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
                    style={{ width: "55%" }}
                  >
                    <div
                      className="h-full w-full"
                      style={{
                        background:
                          "linear-gradient(100deg, transparent 0%, rgba(246,160,228,0.22) 18%, rgba(255,122,107,0.22) 34%, rgba(255,197,107,0.22) 50%, rgba(192,175,255,0.22) 66%, rgba(111,168,255,0.22) 82%, transparent 100%)",
                        filter: "blur(16px)",
                        transform: "skewX(-10deg)",
                      }}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        <AnimatePresence>
          {auditOpen && !isViewer && (
            <AuditPanel onClose={() => setAuditOpen(false)} />
          )}
          {autoOpen && !isViewer && (
            <AutomationPanel onClose={() => setAutoOpen(false)} />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {publishOpen && (
          <PublishAppDialog
            appName={appName}
            appIcon={openedApp?.icon}
            onClose={() => setPublishOpen(false)}
            onPublish={() => {
              setPublished(true);
              setPublishOpen(false);
              setStage("viewer");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );

  const inBuildView =
    homeFlowActive ||
    stage === "generating" ||
    stage === "preview" ||
    stage === "viewer";
  if (inBuildView) {
    const promptText = prompt.trim() || activeStarter.template.prompt;
    const answeredCount = clarifyQuestions.filter(
      (q) => clarifyAnswers[q.id] && clarifyAnswers[q.id].trim(),
    ).length;
    // current clarify question (one-at-a-time) + Enter/send handler
    const currentQ = homeClarifyActive
      ? clarifyQuestions[clarifyStep]
      : undefined;
    const submitClarifyStep = () => {
      if (currentQ && currentQ.kind !== "choice" && followUpDraft.trim()) {
        setClarify(currentQ.id, followUpDraft.trim());
        setFollowUpDraft("");
      }
      advanceClarify();
    };
    // cockpit runs reasoning + clarify with the preview pane already mounted,
    // so the user answers questions while the canvas shows a "Waiting for
    // input" card in parallel. Other archetypes keep the centered-convo flow.
    const clarifyWithPreview = archetype === "cockpit";
    // canvas (built app) shows once we leave reasoning/clarify — except cockpit,
    // which keeps it mounted through reasoning/clarify (showing the waiting card)
    const showCanvas =
      clarifyWithPreview || (!homeReasoningActive && !homeClarifyActive);
    // right pane appears only once we leave reasoning/clarify (→ "Building").
    // during reasoning + clarify the conversation column sits centered alone;
    // opening an existing app jumps straight to the canvas.
    const showRightPane = openedApp ? true : showCanvas;
    // conversation column shows for new builds; opening an existing app / viewer skips straight to canvas
    const showConversation = !openedApp && !isViewer;
    // building = reasoning/clarify/thinking OR generating → keep the status prompt box.
    // refine composer only appears once the app is actually ready.
    const isBuilding = homeFlowActive || stage === "generating";
    const conversationDone = !isBuilding; // app ready → refine input
    // PixelBlast frame also lights up while a refine prompt is processing
    const showFrame = isBuilding || isRefining;

    // neutral frame skin — every state (waiting / thinking / building) uses the
    // same gray treatment, no PixelBlast color, no gradient tinting.
    const frameTheme = {
      gradient: "linear-gradient(to bottom, #F0F0F0 0%, #EDEDEA 74%)",
      pixel: "#D6D6D2",
      dropShadow: "0 6px 18px -8px rgba(0,0,0,0.2)",
      innerGlow: "inset 0 0 2px 2px rgba(0,0,0,0.05)",
      flash: "#F0F0F0",
      label: "#000000",
      ring: "rgba(0,0,0,0.12)",
      spinTrack: "#E8E8E8",
      spinHead: "#636363",
    };

    // @-mention of uploaded files in the refine input
    const mentionMatch = conversationDone
      ? refineDraft.match(/(?:^|\s)@([\w.\-]*)$/)
      : null;
    const mentionHits = mentionMatch
      ? uploadedFiles.filter((f) =>
          f.name.toLowerCase().includes(mentionMatch[1].toLowerCase()),
        )
      : [];
    const showMentions = !!mentionMatch && mentionHits.length > 0;
    const pickMention = (fileName: string) => {
      setRefineDraft((v) => v.replace(/@([\w.\-]*)$/, `@${fileName} `));
      setTimeout(() => refineInputRef.current?.focus(), 0);
    };

    return (
      <div
        className="flex-1 flex overflow-hidden"
        style={{ background: "#F8F8F8" }}
      >
        {/* ── Left: conversation column ─────────────────────────────────── */}
        {showConversation && (
          <div
            className="relative z-10 flex flex-col flex-shrink-0 overflow-hidden bg-white"
            style={{
              width: convoCollapsed ? 0 : showRightPane ? 420 : "100%",
              opacity: convoCollapsed ? 0 : 1,
              // match the canvas card's 12px bottom gutter so both panes end on
              // the same line instead of the left sheet running 12px lower
              marginBottom: showRightPane && !convoCollapsed ? 12 : 0,
              borderRight:
                showRightPane && !convoCollapsed
                  ? "1px solid rgba(0,0,0,0.07)"
                  : "none",
              boxShadow:
                showRightPane && !convoCollapsed
                  ? "6px 0 18px -10px rgba(0,0,0,0.18)"
                  : "none",
              transition:
                "width 450ms cubic-bezier(0.32,0.72,0,1), opacity 300ms ease",
            }}
          >
            {/* breadcrumb bar — present whenever the conversation column is shown
                (centered clarify mode included), not only once the editor is up */}
            {showConversation && (
              <div className="relative z-30 h-14 flex-shrink-0 bg-white">
                {/* inner row aligns to the message column when centered (full width) */}
                <div
                  className={`h-full flex items-center gap-2 ${
                    showRightPane
                      ? "px-3"
                      : "w-full max-w-[720px] mx-auto px-8"
                  }`}
                >
                  <button
                    onClick={() => {
                      setConvoCollapsed(false);
                      resetBuild();
                    }}
                    title="Back"
                    className="w-7 h-7 -ml-1.5 rounded-lg flex items-center justify-center text-[#636363] hover:bg-[#F0F0F0] hover:text-[#000000] transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[13px] font-medium text-[#000000] truncate tracking-[-0.01em]">
                    {activeThread?.title ?? appName}
                  </span>
                  {buildComplete && (
                    <div className="ml-auto -mr-1 flex items-center gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => setHistoryOpen((v) => !v)}
                        title="Version history"
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          background: historyOpen ? "#F0F0F0" : "transparent",
                          color: historyOpen ? "#000000" : "#636363",
                        }}
                        onMouseEnter={(e) => {
                          if (!historyOpen)
                            e.currentTarget.style.background = "#F0F0F0";
                        }}
                        onMouseLeave={(e) => {
                          if (!historyOpen)
                            e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <History className="w-4 h-4" />
                      </button>
                      {showRightPane && (
                        <button
                          onClick={() => setConvoCollapsed(true)}
                          title="Collapse panel"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#636363] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000]"
                        >
                          <PanelLeftClose className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {/* fade — content dissolves beneath the header instead of a hard edge */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-full h-8 z-30"
                  style={{
                    background:
                      "linear-gradient(to bottom, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
                  }}
                />
              </div>
            )}
            {/* conversation scroll area */}
            <div
              ref={convoScrollRef}
              className="flex-1 overflow-y-auto scrollbar-auto-hide"
            >
              {historyOpen ? (
                /* version history — replaces the conversation; pick a version to return */
                <div className="w-full max-w-[720px] mx-auto px-8 py-8">
                  <p className="mb-3 text-[11px] font-medium tracking-[0.04em] uppercase text-[#959595]">
                    Version history
                  </p>
                  <div className="flex flex-col rounded-xl bg-white overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.07)" }}>
                    {[...refineLog.map((r, i) => ({ v: i + 2, label: r })), { v: 1, label: "Initial build" }]
                      .sort((a, b) => b.v - a.v)
                      .map((entry, row) => {
                        const isLatest = entry.v === refineLog.length + 1;
                        return (
                          <button
                            key={entry.v}
                            onClick={() => {
                              setHistoryOpen(false);
                              setPreviewVersion(
                                entry.v === refineLog.length + 1
                                  ? null
                                  : entry.v,
                              );
                            }}
                            className={`flex items-center gap-3 px-3.5 py-3 text-left transition-colors hover:bg-[#FAFAF9] ${row > 0 ? "border-t border-[#000000]/[0.06]" : ""}`}
                          >
                            <span className="inline-flex items-center h-6 px-2 rounded-md bg-[#F0F0F0] text-[11.5px] font-medium text-[#636363] flex-shrink-0">
                              v{entry.v}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[13.5px] text-[#000000]">
                              {entry.label}
                            </span>
                            {isLatest && (
                              <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#000000] flex-shrink-0">
                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                Current
                              </span>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </div>
              ) : (
              <div className="w-full max-w-[720px] mx-auto px-8 py-10 flex flex-col gap-8">
                {/* user message — right aligned bubble, with avatar + name */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-end"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] font-medium text-[#000000]">
                      You
                    </span>
                    <span className="w-5 h-5 rounded-full bg-[#000000] text-white text-[10px] font-medium flex items-center justify-center">
                      {currentUser}
                    </span>
                  </div>
                  <div className="inline-block max-w-[80%] bg-[#F0F0F0] rounded-[16px] px-5 py-3">
                    <p className="text-[15px] text-[#000000] font-normal whitespace-pre-wrap leading-[1.5]">
                      {promptText}
                    </p>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {uploadedFiles.map((f) => (
                          <AttachmentCard
                            key={f.id}
                            name={f.name}
                            size={f.size}
                            compact
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Sense response */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.34,
                    delay: 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col"
                >
                  {/* logo + label */}
                  <div className="flex items-center gap-2 mb-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 45 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#000000"
                      />
                      <rect
                        y="15.75"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#B3B3B3"
                        fillOpacity="0.7"
                      />
                      <rect
                        x="15.75"
                        y="31.5"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#B3B3B3"
                        fillOpacity="0.7"
                      />
                      <rect
                        x="15.75"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#B3B3B3"
                        fillOpacity="0.7"
                      />
                      <rect
                        x="15.75"
                        y="15.75"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#000000"
                      />
                      <rect
                        y="31.5"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#000000"
                      />
                      <rect
                        x="31.5"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#000000"
                      />
                      <rect
                        x="31.5"
                        y="15.75"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#B3B3B3"
                        fillOpacity="0.7"
                      />
                      <rect
                        x="31.5"
                        y="31.5"
                        width="13.5"
                        height="13.5"
                        rx="3.375"
                        fill="#000000"
                      />
                    </svg>
                    <span className="text-[14px] font-medium text-[#000000]">
                      Sense
                    </span>
                  </div>

                  {/* ── Reasoning card — live while reasoning, resolved after ── */}
                  <ReasoningCard
                    reasonLine={
                      homeReasoningActive
                        ? reasonLine
                        : clarifyReasoning.length
                    }
                    planStep={
                      homeReasoningActive ? planStep : clarifyPlan.length
                    }
                    planStarted={planStarted || !homeReasoningActive}
                    active={homeReasoningActive}
                    reduceMotion={!!reduceMotion}
                  />

                  {/* ── Clarify questions — all asked at once ── */}
                  {(homeClarifyActive ||
                    (!homeReasoningActive && clarifyAnswer)) && (
                    <motion.div
                      ref={clarifyQuestionsRef}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-5 scroll-mt-6"
                    >
                      <p className="text-[14px] text-[#000000] leading-relaxed mb-1">
                        I've pulled the records. A few things I can't infer —
                        answer these and I'll build it:
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium tracking-[0.04em] uppercase text-[#959595]">
                          {answeredCount} of {clarifyQuestions.length} answered
                        </span>
                      </div>

                      {/* answered questions — accordion, shown once all are answered */}
                      {clarifyComplete && (
                        <div className="mt-3 rounded-xl overflow-hidden bg-white border border-[#000000]/[0.07]">
                          {clarifyQuestions.map((q, i) => {
                            const val = clarifyAnswers[q.id] || "";
                            if (!val.trim()) return null;
                            const open = clarifyOpenIdx === i;
                            return (
                              <div
                                key={q.id}
                                className="border-b border-[#000000]/[0.06] last:border-b-0"
                              >
                                <button
                                  onClick={() =>
                                    setClarifyOpenIdx(open ? -1 : i)
                                  }
                                  className="flex w-full items-center gap-2.5 px-3.5 h-10 text-left transition-colors hover:bg-[#FAFAF9]"
                                >
                                  <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-[#EDEDEB] text-[10.5px] font-medium text-[#636363]">
                                    {i + 1}
                                  </span>
                                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#636363]">
                                    {q.prompt}
                                  </span>
                                  <ChevronDown
                                    className="w-3.5 h-3.5 flex-shrink-0 text-[#959595] transition-transform"
                                    style={{
                                      transform: open
                                        ? "rotate(180deg)"
                                        : "none",
                                    }}
                                  />
                                </button>
                                <AnimatePresence initial={false}>
                                  {open && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{
                                        duration: 0.22,
                                        ease: [0.23, 1, 0.32, 1],
                                      }}
                                      className="overflow-hidden"
                                    >
                                      <div className="flex items-center justify-between gap-2 px-3.5 pb-3 pl-[42px]">
                                        <span className="inline-flex items-center h-6 px-2 rounded-md bg-[#FFF1E8] text-[12px] font-medium text-[#000000]">
                                          {val}
                                        </span>
                                        {homeClarifyActive && (
                                          <button
                                            onClick={() => {
                                              setClarifyOpenIdx(-1);
                                              setFollowUpDraft(
                                                q.kind !== "choice" ? val : "",
                                              );
                                              setClarifyStep(i);
                                            }}
                                            className="text-[11.5px] font-medium text-[#636363] transition-colors hover:text-[#000000]"
                                          >
                                            Edit
                                          </button>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>

                {/* v1 — the initial build, shown once it's complete */}
                {buildComplete && (
                  <VersionPill
                    label="Initial build"
                    version={1}
                    current={refineLog.length === 0}
                    onPreview={() =>
                      setPreviewVersion(refineLog.length === 0 ? null : 1)
                    }
                    onRestore={() => setPreviewVersion(1)}
                  />
                )}

                {/* refine transcript — thinking → applied, in the scroll flow */}
                {conversationDone &&
                  refineLog.map((r, i) => {
                    const isLatest = i === refineLog.length - 1;
                    const thinking = isRefining && isLatest;
                    // every refine keeps its own thought-card. The latest reveals
                    // rows as they stream (refineThoughtStep); past refines are
                    // fully revealed. The version pill sits below each card.
                    const thoughtSet = refineThoughtSet(i);
                    const revealed = isLatest
                      ? refineThoughtStep
                      : thoughtSet.lines.length;
                    const showCard = revealed > 0;
                    return (
                      <div key={i} className="flex flex-col gap-3">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[14px] font-medium text-[#000000]">
                              You
                            </span>
                            <span className="w-5 h-5 rounded-full bg-[#000000] text-white text-[10px] font-medium flex items-center justify-center">
                              {currentUser}
                            </span>
                          </div>
                          <div className="inline-block max-w-[80%] bg-[#F0F0F0] rounded-[16px] px-4 py-2.5 text-[14px] text-[#000000] leading-[1.5]">
                            {r}
                          </div>
                        </div>
                        {showCard &&
                          /* thought-process card — same chrome as the reasoning
                             card, but rows show the AI's thoughts (no checklist).
                             Persists; the version pill lands below it. */
                          (() => {
                            const done = revealed >= thoughtSet.lines.length;
                            return (
                              <div className="flex flex-col">
                                {/* Sense wrote this — logo + name, like the
                                    first reasoning card */}
                                <div className="flex items-center gap-2 mb-3">
                                  <SenseMark size={20} />
                                  <span className="text-[14px] font-medium text-[#000000]">
                                    Sense
                                  </span>
                                </div>
                                <div
                                  className="rounded-[20px] px-px pb-px"
                                  style={{ background: "#F0F0F0" }}
                                >
                                <div className="flex items-center px-4 py-2.5">
                                  <p className="text-[12.5px] text-[#636363] leading-tight">
                                    <span
                                      className={
                                        "font-medium " +
                                        (done || reduceMotion
                                          ? "text-[#636363]"
                                          : "prism-text-shimmer")
                                      }
                                    >
                                      {done
                                        ? `Thought for ${thoughtSet.secs}s`
                                        : "Thinking…"}
                                    </span>
                                  </p>
                                </div>
                                <div
                                  className="flex flex-col gap-3.5 rounded-[19px] bg-white px-4 py-3.5"
                                  style={{
                                    boxShadow:
                                      "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04), 0 10px 24px -16px rgba(0,0,0,0.2)",
                                  }}
                                >
                                  <AnimatePresence initial={false}>
                                    {thoughtSet.lines.slice(
                                      0,
                                      revealed,
                                    ).map((t, ti) => {
                                      const isActiveRow =
                                        ti === revealed - 1 && !done;
                                      // only the first row carries an icon; the
                                      // rest are plain text
                                      const showIcon = ti === 0;
                                      return (
                                        <Fragment key={ti}>
                                        <motion.div
                                          initial={{ opacity: 0, y: 6 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            duration: 0.28,
                                            ease: [0.23, 1, 0.32, 1],
                                          }}
                                          className="flex items-start gap-2.5"
                                        >
                                          {showIcon && (
                                            <span className="relative mt-[3px] w-[22px] h-[22px] flex-shrink-0 rounded-full flex items-center justify-center bg-[#000000]">
                                              {isActiveRow ? (
                                                <Loader2
                                                  className={`w-3.5 h-3.5 text-white ${reduceMotion ? "" : "animate-spin"}`}
                                                />
                                              ) : (
                                                <Sparkles className="w-3 h-3 text-white" />
                                              )}
                                            </span>
                                          )}
                                          <span
                                            className={
                                              "text-[13.5px] tracking-[-0.01em] leading-[1.45] " +
                                              (isActiveRow
                                                ? "text-[#000000]"
                                                : "text-[#636363]")
                                            }
                                          >
                                            {t}
                                          </span>
                                        </motion.div>
                                        {ti === 0 && (
                                          <div className="h-px bg-[#000000]/[0.07]" />
                                        )}
                                        </Fragment>
                                      );
                                    })}
                                  </AnimatePresence>
                                </div>
                                </div>
                              </div>
                            );
                          })()}
                        {!thinking && (
                          <>
                            {/* summary — Sense recaps what it did, as plain
                                chat content (no card chrome) */}
                            <div>
                              <p className="text-[14px] font-medium tracking-[-0.01em] text-[#000000] mb-2">
                                {thoughtSet.summaryTitle}
                              </p>
                              <ul className="flex flex-col gap-1.5">
                                {thoughtSet.summary.map((s, si) => (
                                  <li
                                    key={si}
                                    className="flex items-start gap-2.5"
                                  >
                                    <span className="mt-[8px] w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#000000]" />
                                    <span className="text-[14px] leading-[1.55] text-[#000000]">
                                      {s}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <VersionPill
                              label={r}
                              version={i + 2}
                              current={i === refineLog.length - 1}
                              onPreview={() =>
                                setPreviewVersion(
                                  i === refineLog.length - 1 ? null : i + 2,
                                )
                              }
                              onRestore={() => setPreviewVersion(i + 2)}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
              </div>
              )}
            </div>

            {/* prompt box — pinned; persists through the whole flow (build → refine) */}
            <div
              className="relative pt-2 pb-5 flex-shrink-0"
              style={{
                paddingLeft: conversationDone ? 12 : 32,
                paddingRight: conversationDone ? 12 : 32,
                transition: "padding 240ms cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              {/* gradient fade — content dissolves into the footer instead of a hard edge */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-full h-12"
                style={{
                  background:
                    "linear-gradient(to top, #FFFFFF 0%, rgba(255,255,255,0) 100%)",
                }}
              />
              <div className="w-full max-w-[720px] mx-auto">
                {/* idle suggestions — like the main app's "Suggested follow-ups" */}
                <AnimatePresence initial={false}>
                  {conversationDone &&
                    buildComplete &&
                    !isRefining &&
                    !refineDraft.trim() && (
                      <motion.div
                        key="refine-suggestions"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
                        className="mb-2"
                      >
                        <div className="flex flex-wrap gap-1.5">
                          {REFINE_SUGGESTIONS.map((s) => (
                            <button
                              key={s}
                              onClick={() => runRefine(s)}
                              className="group inline-flex items-center gap-1.5 h-7 pl-2.5 pr-3 rounded-full bg-white text-[12.5px] text-[#636363] transition-colors hover:bg-[#FAFAF9]"
                              style={{
                                border: "1px solid rgba(0,0,0,0.1)",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                              }}
                            >
                              <Sparkles className="w-3 h-3 text-[#959595] group-hover:text-[#000000] transition-colors" />
                              {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
                {/* PixelBlast frame — wraps the box while building; label sits on the top gutter */}
                <motion.div
                  className="relative w-full"
                  animate={{
                    borderRadius: showFrame ? 22 : 18,
                    paddingTop: showFrame ? 38 : 0,
                    paddingLeft: showFrame ? 6 : 0,
                    paddingRight: showFrame ? 6 : 0,
                    paddingBottom: showFrame ? 6 : 0,
                  }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    // while framed, the gradient backdrop owns the visible
                    // edge — drop the outer gray border to avoid a doubled ring
                    border: showFrame
                      ? "1px solid transparent"
                      : `1px solid ${refineFocused ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.09)"}`,
                    boxShadow: refineFocused
                      ? "0 1px 2px rgba(0,0,0,0.04), 0 20px 48px -24px rgba(0,0,0,0.4)"
                      : "0 1px 2px rgba(0,0,0,0.03), 0 12px 32px -22px rgba(0,0,0,0.28)",
                    transition:
                      "box-shadow 280ms cubic-bezier(0.23,1,0.32,1), border-color 280ms ease",
                  }}
                >
                  {/* tinted PixelBlast backdrop fills the frame gutter */}
                  <AnimatePresence>
                    {showFrame && (
                      <motion.div
                        key="frame-blast"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.28,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        className="absolute inset-0 overflow-hidden"
                        style={{
                          borderRadius: 22,
                          background: frameTheme.gradient,
                          // outer drop shadow only — inner glow + border live on
                          // a top overlay below so child layers can't clip them
                          boxShadow: frameTheme.dropShadow,
                        }}
                      >
                        {/* spectrum breathes in the frame gutter while the
                            agent works; waiting (user's turn) stays calm */}
                        {!homeClarifyActive && (
                          <PrismGlow
                            intensity={0.5}
                            blur={22}
                            animate={!reduceMotion}
                          />
                        )}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: frameTheme.flash,
                            opacity: colorFlash ? 1 : 0,
                            transition: colorFlash
                              ? "opacity 90ms ease-out"
                              : "opacity 300ms cubic-bezier(0.23,1,0.32,1)",
                          }}
                        />
                        {/* inner glow + edge stroke — top-most so the PixelBlast
                            and flash layers below never clip it */}
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            borderRadius: 22,
                            boxShadow: frameTheme.innerGlow,
                            border: "1px solid rgba(0,0,0,0.1)",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* status label — pinned to the top gutter, readable with a drop shadow */}
                  <AnimatePresence>
                    {showFrame && (
                      <motion.div
                        key="frame-label"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{
                          duration: 0.22,
                          ease: [0.23, 1, 0.32, 1],
                        }}
                        className="absolute left-0 right-0 top-0 z-10 flex h-[38px] items-center justify-start pl-3 pointer-events-none"
                      >
                        <span
                          className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.92)",
                            boxShadow: `0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px ${frameTheme.ring}`,
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          <span
                            className={
                              (reduceMotion ? "" : "animate-spin ") +
                              "w-3 h-3 rounded-full border-2"
                            }
                            style={{
                              borderColor: frameTheme.spinTrack,
                              borderTopColor: frameTheme.spinHead,
                              ...(reduceMotion
                                ? {}
                                : { animationDuration: "0.7s" }),
                            }}
                          />
                          <span className="relative inline-flex items-center leading-none text-[12px] font-medium tracking-[-0.01em]">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={homeClarifyActive ? "waiting" : "thinking"}
                                initial={{ opacity: 0, filter: "blur(3px)" }}
                                animate={{ opacity: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, filter: "blur(3px)" }}
                                transition={{
                                  duration: 0.2,
                                  ease: [0.23, 1, 0.32, 1],
                                }}
                                className={
                                  "whitespace-nowrap leading-none " +
                                  (!homeClarifyActive && !reduceMotion
                                    ? "prism-text-shimmer"
                                    : "")
                                }
                                style={
                                  homeClarifyActive || reduceMotion
                                    ? { color: frameTheme.label }
                                    : undefined
                                }
                              >
                                {homeClarifyActive
                                  ? "Waiting for input"
                                  : homeReasoningActive || isRefining
                                    ? "Thinking..."
                                    : "Building..."}
                              </motion.span>
                            </AnimatePresence>
                          </span>
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div
                    className="relative z-[1] rounded-[18px] bg-white overflow-hidden"
                    style={{
                      border: showFrame
                        ? "1px solid rgba(0,0,0,0.06)"
                        : "none",
                      transition: "border-color 280ms ease",
                    }}
                  >
                    {/* clarify — one question at a time, inside the box above the input */}
                    <AnimatePresence initial={false}>
                      {homeClarifyActive &&
                        clarifyQuestions[clarifyStep] &&
                        (() => {
                          const q = clarifyQuestions[clarifyStep];
                          const val = clarifyAnswers[q.id] || "";
                          return (
                            <motion.div
                              key={q.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.26,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pt-3 pb-1">
                                <div className="mb-2 flex items-center gap-2">
                                  {clarifyStep > 0 && (
                                    <button
                                      onClick={goBackClarify}
                                      title="Previous question"
                                      className="inline-flex items-center gap-0.5 h-5 -ml-1 pl-1 pr-1.5 rounded-md text-[10.5px] font-medium uppercase tracking-[0.03em] text-[#636363] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000]"
                                    >
                                      <ArrowLeft className="w-3 h-3" />
                                      Back
                                    </button>
                                  )}
                                  <span className="text-[10.5px] font-medium tracking-[0.04em] uppercase text-[#959595]">
                                    {clarifyQuestions.length - answeredCount} of{" "}
                                    {clarifyQuestions.length} remaining
                                  </span>
                                </div>
                                <p className="mb-3 text-[13.5px] font-medium text-[#000000] leading-snug">
                                  {q.prompt}
                                  {q.optional && (
                                    <span className="text-[#959595] font-normal">
                                      {" "}
                                      · optional
                                    </span>
                                  )}
                                </p>
                                {q.kind === "choice" && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {q.options!.map((opt) => {
                                      const active = val === opt;
                                      return (
                                        <motion.button
                                          key={opt}
                                          onClick={() =>
                                            setClarify(q.id, active ? "" : opt)
                                          }
                                          whileTap={{ scale: 0.97 }}
                                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12.5px] font-medium transition-colors"
                                          style={{
                                            background: active
                                              ? "#FFF1E8"
                                              : "#F0F0F0",
                                            color: active
                                              ? "#000000"
                                              : "#636363",
                                          }}
                                          onMouseEnter={(e) => {
                                            if (!active)
                                              e.currentTarget.style.background =
                                                "#E9E9E6";
                                          }}
                                          onMouseLeave={(e) => {
                                            if (!active)
                                              e.currentTarget.style.background =
                                                "#F0F0F0";
                                          }}
                                        >
                                          {active && (
                                            <Check
                                              className="w-3 h-3"
                                              strokeWidth={3}
                                            />
                                          )}
                                          {opt}
                                        </motion.button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                              <div className="mx-4 border-t border-[#000000]/[0.06]" />
                            </motion.div>
                          );
                        })()}
                    </AnimatePresence>

                    {/* one input — compact (wide field + arrow-up icon) for clarify + refine */}
                    <div
                      className="relative flex items-center gap-2 px-3"
                      style={{
                        paddingTop: 8,
                        paddingBottom: 8,
                        transition: "padding 240ms cubic-bezier(0.23,1,0.32,1)",
                      }}
                    >
                      {/* @-mention suggestions — uploaded files */}
                      {showMentions && (
                        <div
                          className="absolute bottom-full left-3 right-3 mb-2 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white py-1"
                          style={{
                            boxShadow: "0 12px 28px -16px rgba(0,0,0,0.3)",
                          }}
                        >
                          <div className="px-3 pt-1 pb-0.5 text-[10.5px] font-medium uppercase tracking-wider text-[#959595]">
                            Uploaded files
                          </div>
                          {mentionHits.slice(0, 5).map((f) => (
                            <button
                              key={f.id}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                pickMention(f.name);
                              }}
                              className="flex w-full items-center gap-2 px-3 h-8 text-left hover:bg-[#F0F0F0] transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 flex-shrink-0 text-[#959595]" />
                              <span className="text-[12.5px] truncate text-[#000000]">
                                {f.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      <input
                        ref={refineInputRef}
                        type="text"
                        onFocus={() => setRefineFocused(true)}
                        onBlur={() => setRefineFocused(false)}
                        value={conversationDone ? refineDraft : followUpDraft}
                        onChange={(e) =>
                          conversationDone
                            ? setRefineDraft(e.target.value)
                            : setFollowUpDraft(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key !== "Enter") return;
                          if (showMentions) {
                            e.preventDefault();
                            pickMention(mentionHits[0].name);
                            return;
                          }
                          if (conversationDone) {
                            if (!buildComplete) {
                              e.preventDefault();
                              setRefineDraft("");
                              resumeBuild();
                            } else if (refineDraft.trim()) {
                              e.preventDefault();
                              sendRefine();
                            }
                          } else if (homeClarifyActive) {
                            e.preventDefault();
                            submitClarifyStep();
                          }
                        }}
                        readOnly={isBuilding && !homeClarifyActive}
                        placeholder={
                          conversationDone
                            ? buildComplete
                              ? "Adjust the app…"
                              : "Type to resume building…"
                            : homeClarifyActive
                              ? "Type anything to add or change…"
                              : "Sense is working…"
                        }
                        className="flex-1 bg-transparent text-[14px] text-[#000000] outline-none placeholder:text-[#959595] pl-1"
                        style={{
                          height: 28,
                          transition:
                            "height 240ms cubic-bezier(0.23,1,0.32,1)",
                        }}
                      />
                      {/* speech-to-text — present in every convo state */}
                      <button
                        type="button"
                        title="Dictate"
                        className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-[#636363] hover:bg-[#F0F0F0] hover:text-[#000000] transition-colors"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                      {/* button crossfades label↔icon — blur masks the swap */}
                      <AnimatePresence mode="wait" initial={false}>
                        {isRefining || (isBuilding && !homeClarifyActive) ? (
                          /* Stop — cancel AI processing (refine or build flow) */
                          <motion.button
                            key="stop"
                            initial={{
                              opacity: 0,
                              scale: 0.9,
                              filter: "blur(3px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.9,
                              filter: "blur(3px)",
                            }}
                            transition={{
                              duration: 0.18,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={stopProcessing}
                            title="Stop"
                            className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white bg-[#000000] hover:bg-black transition-colors"
                          >
                            <span className="w-2.5 h-2.5 rounded-[10px] bg-white" />
                          </motion.button>
                        ) : !conversationDone ? (
                          /* clarify — Skip (secondary) + Send (primary label) */
                          <motion.div
                            key="clarify-actions"
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(3px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(3px)" }}
                            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                            className="flex items-center gap-1.5 flex-shrink-0"
                          >
                            <button
                              onClick={advanceClarify}
                              title="Skip this question"
                              className="h-8 px-3 rounded-full text-[12.5px] font-medium text-[#636363] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000]"
                            >
                              Skip
                            </button>
                            <button
                              onClick={submitClarifyStep}
                              disabled={
                                !(
                                  currentQ &&
                                  (currentQ.optional ||
                                    (currentQ.kind === "choice"
                                      ? !!clarifyAnswers[currentQ.id]
                                      : !!followUpDraft.trim()))
                                )
                              }
                              title={
                                clarifyStep < clarifyQuestions.length - 1
                                  ? "Send"
                                  : "Generate"
                              }
                              className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white bg-[#000000] hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              <ArrowRight className="w-4 h-4 -rotate-90" />
                            </button>
                          </motion.div>
                        ) : (
                          /* arrow-up — refine "send" / resume build */
                          <motion.button
                            key="send-icon"
                            initial={{
                              opacity: 0,
                              scale: 0.9,
                              filter: "blur(3px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.9,
                              filter: "blur(3px)",
                            }}
                            transition={{
                              duration: 0.18,
                              ease: [0.23, 1, 0.32, 1],
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={
                              !buildComplete
                                ? () => {
                                    setRefineDraft("");
                                    resumeBuild();
                                  }
                                : sendRefine
                            }
                            disabled={!buildComplete ? false : !refineDraft.trim()}
                            title={!buildComplete ? "Resume build" : "Send"}
                            className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white bg-[#000000] hover:bg-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowRight className="w-4 h-4 -rotate-90" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* ── Right: canvas (built) or a "Waiting for input" placeholder ── */}
        <AnimatePresence>
          {showRightPane && (
            <motion.div
              key="build-canvas"
              initial={
                showConversation
                  ? { transform: "translateX(24px)", opacity: 0 }
                  : false
              }
              animate={{ transform: "translateX(0px)", opacity: 1 }}
              transition={{
                type: "tween",
                ease: [0.32, 0.72, 0, 1],
                duration: 0.4,
              }}
              style={{ willChange: "transform, opacity" }}
              className="flex-1 overflow-hidden relative"
            >
              {Canvas}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── HOME · BUILD COMPOSER ───────────────────────────────────────────────
  // Reached from the gallery's "Build App" CTA. Hero + prompt + starter tiles.
  if (stage === "home") {
    return (
      <div
        className="flex-1 relative overflow-hidden overflow-y-auto scroll-smooth"
        style={{
          backgroundColor: "#F8F8F8",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.035) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          // Reserve the scrollbar gutter so toggling between the short (cards)
          // and tall (apps) gallery states doesn't change the content width
          // and reflow the prompts / back button / cards.
          scrollbarGutter: "stable",
        }}
      >
        {/* faint ambient wash — kept subtle */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute"
            style={{
              top: -160,
              left: "50%",
              transform: "translateX(-50%)",
              width: 720,
              height: 420,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(253,80,0,0.05), transparent 70%)",
              filter: "blur(64px)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: 120,
              right: -140,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(253,80,0,0.04), transparent 70%)",
              filter: "blur(64px)",
            }}
          />
        </div>

        {/* composer (centered) + starter prompts */}
        <div className="relative flex min-h-full flex-col items-center justify-center px-6 py-6 sm:px-10 lg:px-14">
          <div className="relative w-full max-w-[780px]">
            {/* Hero row */}
            <motion.div
              className="flex items-start justify-between mb-6"
              animate={{
                opacity: homeFlowActive || homeClarifyActive ? 0 : 1,
                y: homeFlowActive || homeClarifyActive ? -16 : 0,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents:
                  homeFlowActive || homeClarifyActive ? "none" : "auto",
              }}
            >
              <div>
                <h1 className="flex items-baseline text-[56px] sm:text-[60px] leading-[0.82] font-medium tracking-[-0.04em] text-[#000000]">
                  <span>Build</span>
                  <span className="ml-1 text-[48px] sm:text-[52px] leading-none text-[#000000] tracking-[-0.08em]">
                    .
                  </span>
                </h1>
                <p className="text-[14px] sm:text-[15px] leading-[1.45] tracking-[-0.01em] text-[#636363] max-w-[420px] mt-4">
                  Describe the workflow in plain language. Sense turns it into a
                  native Zuper app — layout, data, actions, and permissions
                  wired in.
                </p>
              </div>
              <DragonField />
            </motion.div>

            {/* Clarify questions — above the prompt card */}
            <AnimatePresence>
              {homeClarifyActive && (
                <motion.div
                  key="clarify-questions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-5"
                >
                  <p className="text-[22px] font-medium tracking-[-0.03em] leading-snug text-[#000000] mb-4">
                    {CLARIFY.question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CLARIFY.options.map((opt) => (
                      <motion.button
                        key={opt}
                        onClick={() => answerClarify(opt)}
                        whileTap={{ scale: 0.96 }}
                        className="h-9 px-4 rounded-full text-[13px] font-medium tracking-[-0.01em] transition-all bg-white border border-[#DCDFE4] text-[#636363] hover:border-[#959595] hover:text-[#636363]"
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.07)" }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt box — compact, layoutId matches ChatThread refine composer */}
            <motion.div
              layoutId="build-prompt-card"
              layout
              transition={{
                layout: { duration: 0.2, ease: [0.23, 1, 0.32, 1] },
              }}
              className="rounded-[18px] bg-white mb-4 overflow-hidden w-full"
              style={{
                border: "1px solid rgba(0,0,0,0.14)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.03), 0 14px 36px -24px rgba(0,0,0,0.3)",
              }}
            >
              {/* Thinking tray — fade+slide, no height animation (height triggers layout) */}
              <AnimatePresence>
                {homeFlowActive && (
                  <motion.div
                    key="thinking-tray"
                    initial={{ opacity: 0, transform: "translateY(-8px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    exit={{ opacity: 0, transform: "translateY(-6px)" }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    className="relative overflow-hidden w-full"
                    style={{
                      height: 64,
                      // waiting = the user's turn (calm gray); thinking = the
                      // prism breathes beneath the frosted tray
                      background: homeClarifyActive ? "#F0F0F0" : "#FCFCFC",
                      transition:
                        "background-color 320ms cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >
                    {!homeClarifyActive && (
                      <PrismGlow
                        intensity={0.55}
                        blur={26}
                        animate={!reduceMotion}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="glass-soft inline-flex items-center gap-2 h-8 px-3.5 rounded-full"
                        style={{
                          boxShadow:
                            "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px -6px rgba(0,0,0,0.18)",
                        }}
                      >
                        {homeClarifyActive ? (
                          /* user's turn — quiet pulse dot */
                          <span
                            className={
                              (reduceMotion ? "" : "animate-pulse ") +
                              "w-2 h-2 rounded-full bg-[#959595]"
                            }
                          />
                        ) : (
                          /* AI working — spectrum bar, not a spinner */
                          <span
                            className="prism-sweep rounded-full"
                            style={{ width: 22, height: 5 }}
                          />
                        )}
                        {/* label crossfade — only the changing word swaps */}
                        <span
                          className="relative inline-flex text-[13px] font-medium tracking-[-0.02em]"
                          style={{ height: 17 }}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={homeClarifyActive ? "waiting" : "thinking"}
                              initial={{ opacity: 0, filter: "blur(3px)" }}
                              animate={{ opacity: 1, filter: "blur(0px)" }}
                              exit={{ opacity: 0, filter: "blur(3px)" }}
                              transition={{
                                duration: 0.2,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              className={
                                "whitespace-nowrap " +
                                (!homeClarifyActive && !reduceMotion
                                  ? "prism-text-shimmer"
                                  : "")
                              }
                              style={
                                homeClarifyActive || reduceMotion
                                  ? { color: "#000000" }
                                  : undefined
                              }
                            >
                              {homeClarifyActive
                                ? "Waiting for input"
                                : "Thinking..."}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prompt content */}
              <div className="p-4">
                <textarea
                  ref={taRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      submitPrompt();
                    }
                  }}
                  rows={2}
                  readOnly={homeFlowActive || homeClarifyActive}
                  placeholder={activeStarter.template.prompt}
                  className="w-full resize-none outline-none bg-transparent text-[15px] tracking-normal text-[#000000] placeholder:text-[#959595] leading-[1.5] px-1 pt-0.5 min-h-[48px]"
                />

                {/* Attached template — small square thumbnail chip */}
                <AnimatePresence>
                  {attachedTemplate &&
                    !(homeFlowActive || homeClarifyActive) && (
                      <motion.div
                        key={attachedTemplate.id}
                        initial={{ opacity: 0, scale: 0.9, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 4 }}
                        transition={{
                          duration: 0.18,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="mt-3 inline-flex items-center gap-2.5 rounded-2xl border border-[rgba(0,0,0,0.06)] bg-[#FAFAFA] py-1.5 pl-1.5 pr-3"
                      >
                        <div className="group relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-[rgba(0,0,0,0.06)]">
                          <TemplateThumb
                            app={attachedTemplate}
                            className="h-full w-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-medium tracking-[-0.01em] text-[#000000]">
                            {attachedTemplate.name}
                          </p>
                          <p className="truncate text-[11px] text-[#959595]">
                            Template · {attachedTemplate.company}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAttachedTemplate(null)}
                          className="ml-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[#959595] transition-colors hover:bg-[rgba(0,0,0,0.06)] hover:text-[#000000]"
                          aria-label="Remove template"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    )}
                </AnimatePresence>

                {/* uploaded-file preview chips */}
                {!(homeFlowActive || homeClarifyActive) &&
                  uploadedFiles.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {uploadedFiles.map((f) => (
                        <AttachmentCard
                          key={f.id}
                          name={f.name}
                          size={f.size}
                          onRemove={() => removeFile(f.id)}
                        />
                      ))}
                    </div>
                  )}

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />

                {/* speech-to-text — always present, even during flow/clarify */}
                {(homeFlowActive || homeClarifyActive) && (
                  <div className="flex items-center mt-2 pt-2.5 border-t border-[rgba(0,0,0,0.05)]">
                    <button
                      type="button"
                      title="Dictate"
                      className="w-7 h-7 rounded-full border border-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#959595] hover:text-[#000000] hover:border-[rgba(0,0,0,0.18)] transition-colors"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {!(homeFlowActive || homeClarifyActive) && (
                  <div className="flex items-center gap-2 mt-2 pt-2.5 border-t border-[rgba(0,0,0,0.05)]">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      title="Attach files"
                      className="w-7 h-7 rounded-full border border-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#959595] hover:text-[#000000] hover:border-[rgba(0,0,0,0.18)] transition-colors"
                      disabled={homeFlowActive || homeClarifyActive}
                      style={{
                        opacity: homeFlowActive || homeClarifyActive ? 0.35 : 1,
                        transition: "opacity 180ms",
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <span
                      className="ml-auto text-[11px] text-[#D9D9D9] font-mono"
                      style={{
                        opacity: homeFlowActive || homeClarifyActive ? 0 : 1,
                        transition: "opacity 150ms",
                      }}
                    >
                      ⌘ enter
                    </span>
                    <button
                      type="button"
                      title="Dictate"
                      className="w-7 h-7 rounded-full border border-[rgba(0,0,0,0.06)] flex items-center justify-center text-[#959595] hover:text-[#000000] hover:border-[rgba(0,0,0,0.18)] transition-colors"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <BorderGlow
                      animated
                      borderRadius={9999}
                      backgroundColor="#000000"
                      glowColor="0 0 100"
                      colors={["#ffffff", "#cccccc", "#ffffff"]}
                      glowIntensity={1.2}
                      glowRadius={24}
                      coneSpread={18}
                      edgeSensitivity={20}
                    >
                      <motion.button
                        onClick={submitPrompt}
                        disabled={
                          !prompt.trim() &&
                          !(homeFlowActive || homeClarifyActive)
                        }
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-white disabled:opacity-25 disabled:cursor-not-allowed text-[13px] font-medium tracking-[-0.01em]"
                        style={{
                          transition:
                            "transform 160ms cubic-bezier(0.23,1,0.32,1), opacity 200ms",
                        }}
                      >
                        <Sparkles
                          className={`w-3.5 h-3.5 flex-shrink-0 ${(homeFlowActive || homeClarifyActive) && !reduceMotion ? "animate-pulse" : ""}`}
                        />
                        <span>
                          {homeFlowActive || homeClarifyActive
                            ? "Generating..."
                            : "Send"}
                        </span>
                      </motion.button>
                    </BorderGlow>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Home browse — starter prompts only. */}
            <AnimatePresence>
              {!(homeFlowActive || homeClarifyActive) && (
                <motion.div
                  key="home-starters"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-7 w-full"
                >
                  <div className="flex flex-wrap justify-center gap-2.5">
                    {HOME_STARTERS.slice(0, 5).map((item, i) => {
                      const RowIcon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setArchetype(classify(item.template.prompt));
                            setPrompt(item.template.prompt);
                            setHomeStarter(i);
                            setTimeout(() => taRef.current?.focus(), 40);
                          }}
                          className="group inline-flex max-w-full items-center gap-2 rounded-[12px] border border-[#D4D7DD] bg-transparent py-2 pl-3 pr-3.5 text-left text-[13.25px] leading-none transition-all duration-200 hover:border-[#BFC3CB] hover:bg-white/40 active:scale-[0.99]"
                        >
                          <RowIcon
                            className="h-4 w-4 flex-shrink-0 text-[#959595] transition-colors group-hover:text-[#636363]"
                            strokeWidth={1.75}
                          />
                          <span className="min-w-0">
                            <ChipPhrase phrase={item.chip} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!(homeFlowActive || homeClarifyActive) && (
            <div className="flex justify-center pt-8">
              <button
                type="button"
                onClick={scrollToAppGallery}
                className="group relative flex w-full max-w-[420px] items-center gap-4 overflow-hidden rounded-[18px] border border-[rgba(0,0,0,0.08)] bg-white pl-5 pr-3 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4D7DD] active:scale-[0.995]"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 12px 30px -22px rgba(0,0,0,0.35)",
                }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-medium tracking-[-0.01em] text-[#000000]">
                    App Gallery
                  </p>
                  <p className="mt-0.5 text-[13px] leading-snug text-[#959595]">
                    Browse &amp; pick a template
                  </p>
                </div>

                {/* Decorative stacked-card thumbnail on the right */}
                <div className="relative h-[58px] w-[88px] flex-shrink-0">
                  <div className="absolute right-3 top-1 h-[50px] w-[64px] -rotate-[10deg] overflow-hidden rounded-[10px] ring-1 ring-black/[0.05] transition-transform duration-200 group-hover:-rotate-[14deg]">
                    <AppPreviewThumb module="Customers" className="h-full w-full" />
                  </div>
                  <div className="absolute right-0 top-0 h-[54px] w-[68px] rotate-[4deg] overflow-hidden rounded-[10px] bg-white p-1 shadow-[0_4px_12px_-6px_rgba(0,0,0,0.4)] ring-1 ring-black/[0.05] transition-transform duration-200 group-hover:rotate-[6deg]">
                    <AppPreviewThumb
                      module="Invoices"
                      className="h-full w-full rounded-[10px]"
                    />
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        <div
          ref={appGalleryRef}
          className="relative mx-auto min-h-screen w-full max-w-[1040px] scroll-mt-0 px-6 pt-[8vh] pb-16 sm:px-10 lg:px-14"
        >
          <PublicAppGallery
            hideHeader
            onUseTemplate={(app) => {
              setArchetype(classify(app.prompt));
              setPrompt(app.prompt);
              setAttachedTemplate(app);
              setTimeout(() => taRef.current?.focus(), 40);
            }}
          />
        </div>
      </div>
    );
  }

  // ─── "My apps" listing — full-width project gallery, reached from the
  // sidebar's "My apps" nav item. A rich preview thumbnail per app with the
  // name + "Edited …" below, like a design-tool project list.
  if (stage === "apps") {
    return (
      <div
        className="flex-1 relative overflow-hidden overflow-y-auto scroll-smooth"
        style={{
          backgroundColor: "#F8F8F8",
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.035) 1px, transparent 0)",
          backgroundSize: "22px 22px",
          scrollbarGutter: "stable",
        }}
      >
        <div className="relative mx-auto w-full max-w-[1180px] px-6 pt-[7vh] pb-16 sm:px-10 lg:px-14">
          <div className="mb-6 flex items-center gap-2">
            <Folder
              className="h-[20px] w-[20px] text-[#636363]"
              strokeWidth={2}
            />
            <h1 className="text-[22px] font-medium tracking-[-0.01em] text-[#000000]">
              Library
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MY_APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => openApp(app)}
                className="group overflow-hidden rounded-[18px] bg-white text-left transition-all duration-200 hover:-translate-y-1"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04), 0 10px 30px -20px rgba(0,0,0,0.25)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 1px rgba(253,80,0,0.18), 0 1px 2px rgba(0,0,0,0.04), 0 28px 56px -30px rgba(0,0,0,0.4)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 0 0 1px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04), 0 10px 30px -20px rgba(0,0,0,0.25)")
                }
              >
                {/* thumbnail — its own gradient field, padded on white */}
                <div className="p-2.5">
                  <AppPreviewThumb
                    module={app.module}
                    className="aspect-[4/3] w-full rounded-[10px] ring-1 ring-black/[0.04]"
                  />
                </div>
                {/* footer — title + edited date inside the same card */}
                <div className="border-t border-[#F0F0F0] px-4 py-3">
                  <p className="truncate text-[15px] font-medium tracking-[-0.01em] text-[#000000]">
                    {app.name}
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-[#959595]">
                    Edited {app.updated}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

// Full-screen build overlay — overlapping stacked cards (light mode).
// Replicates the reference moodboard: phase cards tuck behind each other,
// the active phase breaks out as a bright elevated white card, neighbours
// peek out and fade toward the edges.
function GenerationOverlay({
  genStep,
  title,
  reduceMotion,
  mode = "generating",
}: {
  genStep?: number;
  title: string;
  reduceMotion: boolean;
  // "structure" = first build step only (reasoning), "waiting" = paused on the
  // "Waiting for input" card (clarify), "generating" = driven by genStep.
  mode?: "structure" | "waiting" | "generating";
}) {
  // structure/waiting park on the first phase; generating is driven by genStep
  const step = mode === "generating" ? (genStep ?? 0) : 0;
  const waiting = mode === "waiting";

  const PEEK = 58; // visible slice of a tucked card
  const ACTIVE_GAP = 32; // extra breathing room around the active card
  const CARD_W = 380;
  const ease = "cubic-bezier(0.32, 0.72, 0, 1)";

  return (
    <div
      className="h-full w-full relative overflow-hidden flex items-center justify-center"
      style={{ background: "#F8F8F8" }}
    >
      {/* dotted halftone backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      {/* prism field — the interface breathes while the agent works; absent
          while waiting on the user (waiting is the user's turn, not AI work) */}
      {!waiting && (
        <PrismGlow intensity={0.4} blur={72} animate={!reduceMotion} />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, rgba(238,237,234,0) 35%, #F8F8F8 80%)",
        }}
      />

      {/* stacked module cards — each phase is a card centered on the active one.
          Completed cards recede + fade upward (with a check); upcoming cards
          peek below. The active card sits front with its module icon + spinner. */}
      <div className="relative z-10" style={{ width: CARD_W, height: 440 }}>
        {GEN_PHASES.map((phase, i) => {
          const dist = i - step; // 0 = active, <0 done (above), >0 pending (below)
          const isActive = dist === 0;
          const isPast = dist < 0;
          const Icon = phase.icon;

          let y = dist * PEEK;
          if (dist > 0) y += ACTIVE_GAP;
          if (dist < 0) y -= ACTIVE_GAP;

          const abs = Math.abs(dist);
          // structure/waiting → only the active card; the stack fades in once building
          const stackHidden = mode !== "generating";
          const opacity = isActive
            ? 1
            : stackHidden
              ? 0
              : Math.max(0, 1 - abs * 0.34);
          const scale = isActive ? 1 : 1 - 0.05 - abs * 0.025;

          return (
            <div
              key={phase.label}
              className="absolute left-1/2 top-1/2 flex items-center gap-3.5 rounded-[20px]"
              style={{
                width: CARD_W,
                height: isActive ? 80 : 66,
                paddingLeft: 16,
                paddingRight: 18,
                transform: `translate(-50%, -50%) translateY(${y}px) scale(${scale})`,
                transformOrigin: "center center",
                zIndex: isActive ? 50 : 40 - abs,
                opacity,
                background: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.6)",
                boxShadow: isActive
                  ? "0 2px 4px rgba(0,0,0,0.05), 0 40px 80px -40px rgba(0,0,0,0.45)"
                  : "0 1px 2px rgba(0,0,0,0.03)",
                backdropFilter: isActive ? "blur(24px)" : "blur(2px)",
                WebkitBackdropFilter: isActive ? "blur(24px)" : "blur(2px)",
                transition: reduceMotion
                  ? "none"
                  : `transform 600ms ${ease}, opacity 600ms ${ease}, height 500ms ${ease}, background 500ms ${ease}, box-shadow 500ms ${ease}`,
              }}
            >
              {/* refraction — a prism band drifts across the active card */}
              {isActive && !waiting && !reduceMotion && (
                <span
                  className="prism-sweep absolute inset-0 pointer-events-none"
                  style={{ borderRadius: 20, opacity: 0.12 }}
                />
              )}
              {/* module icon tile */}
              <div
                className="rounded-[13px] flex items-center justify-center flex-shrink-0"
                style={{
                  width: isActive ? 46 : 40,
                  height: isActive ? 46 : 40,
                  background: isActive
                    ? waiting
                      ? "#636363"
                      : phase.accent
                    : "#F0F0F0",
                  transition: reduceMotion ? "none" : `all 500ms ${ease}`,
                }}
              >
                <Icon
                  style={{
                    width: isActive ? 24 : 19,
                    height: isActive ? 24 : 19,
                    color: isActive ? "#FFFFFF" : "#959595",
                  }}
                />
              </div>

              {/* label */}
              <span
                className="truncate"
                style={{
                  fontSize: isActive ? 20 : 16,
                  letterSpacing: "-0.02em",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "#000000" : isPast ? "#959595" : "#959595",
                  transition: reduceMotion ? "none" : `all 400ms ${ease}`,
                }}
              >
                {isActive && waiting ? "Waiting for your input" : phase.label}
              </span>

              {/* trailing status — pulse / spinner / check */}
              {isActive && waiting ? (
                <span
                  className={
                    "ml-auto w-2.5 h-2.5 rounded-full flex-shrink-0 " +
                    (reduceMotion ? "" : "animate-pulse")
                  }
                  style={{ background: "#636363" }}
                />
              ) : isActive ? (
                /* no spinner — the spectrum itself is the progress signal */
                <span
                  className="prism-sweep ml-auto flex-shrink-0 rounded-full"
                  style={{ width: 28, height: 6 }}
                />
              ) : isPast ? (
                <CheckCircle2
                  className="ml-auto w-4 h-4 flex-shrink-0"
                  style={{ color: "#000000", opacity: 0.7 }}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* caption — streams with the spectrum while the agent works */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center px-6">
        <p
          className={
            "text-[12.5px] tracking-[-0.01em] " +
            (!waiting && !reduceMotion ? "prism-text-shimmer" : "text-[#636363]")
          }
        >
          {title}
        </p>
      </div>
    </div>
  );
}
