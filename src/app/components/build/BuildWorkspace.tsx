import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "motion/react";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check,
  Briefcase,
  Users,
  FileText,
  Lock,
  Eye,
  Code2,
  Rocket,
  History,
  Zap,
  Sparkles,
  LayoutGrid,
  Database,
  Wand2,
  ShieldCheck,
  Workflow,
  CheckCircle2,
  X,
} from "lucide-react";
import { DispatchGrid } from "./DispatchGrid";
import { DispatchBoard } from "./DispatchBoard"; // kanban — now the Quote Follow-up triage board (§4c)
import { ArCockpit } from "./ArCockpit"; // operational cockpit (§4a)
import { ElementTreePane, InspectorPane } from "./CanvasInspector";
import { PublishAppDialog } from "./PublishAppDialog";
import { AuditPanel } from "./AuditPanel";
import { AutomationPanel } from "./AutomationPanel";
import { ChatThread } from "./ChatThread";
import { AppGallery } from "./AppGallery";
import { PublicAppGallery, TemplateThumb } from "./PublicAppGallery";
import { EditProvider, type SelectedElement } from "./EditContext";
import { SenseLogo } from "../SenseLogo";
import PixelBlast from "./PixelBlast";
import BorderGlow from "./BorderGlow";
import {
  TEMPLATES,
  DISPATCH_PLAN,
  KANBAN_PLAN,
  CLARIFY,
  CLARIFY_REASONING,
  CLARIFY_PLAN,
  CLARIFY_QUESTIONS,
  DISPATCH_TREE,
  COCKPIT_TREE,
  KANBAN_TREE,
  type BuildApp,
  type BuildTemplate,
  type PublicApp,
} from "./buildData";

type Stage =
  | "gallery"
  | "home"
  | "homeReasoning"
  | "homeClarify"
  | "homeThinking"
  | "clarify"
  | "generating"
  | "preview"
  | "viewer";
type CanvasMode = "preview" | "edit";
// §3 pipeline step 1 — classify intent → archetype (§4). Determines layout family.
type Archetype = "dispatch" | "cockpit" | "kanban";

// A conversation thread inside an app. Title auto-generates from first message.
interface BuildThread {
  id: string;
  title: string;
  createdAt: string;
}

// Cheap "AI" title — first ~5 meaningful words, title-cased. Stands in for a
// model-generated summary in the demo.
function deriveThreadTitle(msg: string): string {
  const stop = new Set(["the", "a", "an", "to", "for", "of", "and", "with", "my", "me", "i", "can", "show", "add"]);
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
  if (
    /(dispatch|drag.*tech|schedule|assign.*job|technician|time ?slot|lane)/.test(
      p,
    )
  )
    return "dispatch";
  if (
    /(overdue|invoice|collection|aging|receivable|reminder|cockpit|dashboard)/.test(
      p,
    )
  )
    return "cockpit";
  if (/(quote|follow.?up|pipeline|stuck|triage|stage)/.test(p)) return "kanban";
  return "dispatch";
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
}

const GEN_STEPS_BY_ARCHETYPE: Record<Archetype, string[]> = {
  dispatch: [
    "Resolving entities against your Zuper schema…",
    "Classified intent → dispatch scheduler (time axis present)",
    "Found Jobs · HVAC · TX · today",
    "Pulling live data — 5 unassigned, 3 technicians…",
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
  dispatch: "Building your dispatch scheduler",
  cockpit: "Building your collections cockpit",
  kanban: "Building your follow-up board",
};

// Full-screen generation overlay — vertically scrolling build phases.
// Each phase advances on a timer; the active one is centered + highlighted.
const GEN_PHASES = [
  { icon: LayoutGrid, label: "Building your structure", accent: "#C08552", tint: "#F3E8DC" },
  { icon: Database, label: "Wiring live data bindings", accent: "#4A90D9", tint: "#E1ECF8" },
  { icon: Workflow, label: "Adding your content", accent: "#FD5000", tint: "#FFE8DC" },
  { icon: Wand2, label: "Sharpening interactions", accent: "#7C5CE0", tint: "#ECE6FB" },
  { icon: ShieldCheck, label: "Applying permissions", accent: "#5B9BD5", tint: "#E3EFF9" },
  { icon: CheckCircle2, label: "Finishing the final polish", accent: "#7DAE6B", tint: "#EAF3E4" },
] as const;

// Editorial starters — `phrase` uses *asterisks* to mark the words that carry
// the intent; everything else fades back so the meaning reads at a glance.
const HOME_STARTERS = [
  {
    id: "dispatch",
    kicker: "Jobs",
    label: "Dispatch scheduler",
    phrase: "*Assign* this week's *HVAC jobs* to technicians and *flag* anything *overdue*.",
    accent: "#FD5000",
    template: TEMPLATES[0],
  },
  {
    id: "collections",
    kicker: "Invoices",
    label: "Collections cockpit",
    phrase: "Group *overdue invoices* into *aging buckets* I can *act on*.",
    accent: "#16A34A",
    template: TEMPLATES[2],
  },
  {
    id: "quotes",
    kicker: "Quotes",
    label: "Quote triage board",
    phrase: "Surface *quotes stuck in sent* for *3+ days*, *oldest first*.",
    accent: "#2563EB",
    template: TEMPLATES[1],
  },
] as const;

// Render a *marked* phrase: starred spans pop in primary; the rest fades.
function EmphasizedPhrase({ phrase }: { phrase: string }) {
  const parts = phrase.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <span className="block text-[17px] leading-[1.42] tracking-[-0.02em]">
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="font-semibold text-[#1C1E21]">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i} className="font-normal text-[#C0C5CC]">
            {part}
          </span>
        ),
      )}
    </span>
  );
}

// §4 publish gate — only roles with `publish_apps` permission can roll an app org-wide
const CAN_PUBLISH: Record<string, boolean> = {
  RG: true,
  MJ: true,
  VP: true,
  AU: false,
};

function PlusField() {
  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      <div
        className="grid"
        style={{ gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', width: 330, gap: '6px 4px' }}
      >
        {Array.from({ length: 88 }).map((_, i) => (
          <span
            key={i}
            className="flex items-center justify-center font-semibold leading-none"
            style={{
              fontSize: 18,
              color: i % 23 === 0 ? '#FD5000' : i % 5 === 0 ? '#111315' : '#D9DCE1',
              opacity: i % 23 === 0 ? 0.88 : i % 5 === 0 ? 0.44 : 0.5,
            }}
          >
            +
          </span>
        ))}
      </div>
    </div>
  );
}

export function BuildWorkspace({
  currentUser = "MJ",
  seededPrompt,
  onConsumeSeed,
}: Props) {
  const canPublish = CAN_PUBLISH[currentUser] ?? true;
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("gallery");
  const [prompt, setPrompt] = useState("");
  const [canvasMode, setCanvasMode] = useState<CanvasMode>("preview");
  const [selectedEl, setSelectedEl] = useState("el-card");
  const [skillBadge, setSkillBadge] = useState(false);
  const [selectedJob, setSelectedJob] = useState<string | null>("JN-2451");
  const [publishOpen, setPublishOpen] = useState(false);
  const [openedApp, setOpenedApp] = useState<BuildApp | null>(null);
  const [genStep, setGenStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [readOnlyPublish, setReadOnlyPublish] = useState(false); // §9 read-only toggle → hides write controls for viewers
  const [refineDraft, setRefineDraft] = useState("");
  const [refineLog, setRefineLog] = useState<string[]>([]);
  const [isRefining, setIsRefining] = useState(false);
  const [clarifyAnswer, setClarifyAnswer] = useState<string | null>(null);
  // multi-question clarify: per-question answers keyed by question id
  const [clarifyAnswers, setClarifyAnswers] = useState<Record<string, string>>({});
  // reasoning-state animation: which reasoning line + plan step is "done"
  const [reasonLine, setReasonLine] = useState(0);
  const [planStep, setPlanStep] = useState(0);
  const [planStarted, setPlanStarted] = useState(false); // gate step "loading" until plan phase begins
  const clarifyQuestionsRef = useRef<HTMLDivElement>(null); // scroll target when questions appear
  const [auditOpen, setAuditOpen] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [, setEditLog] = useState<string[]>([]); // element-scoped edits applied
  const [archetype, setArchetype] = useState<Archetype>("dispatch");
  const [homeStarter, setHomeStarter] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);
  // Scroll-snap sections on the composer page: composer ↕ app gallery.
  const composerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  // Template attached from the App gallery — shown as a thumbnail chip in the box.
  const [attachedTemplate, setAttachedTemplate] = useState<PublicApp | null>(null);

  // ── Conversation threads (per app) ──────────────────────────────────────
  // Each app can hold multiple threads. The active thread drives the left pane.
  // Titles auto-generate from the first message; until then they read
  // "New conversation".
  const [threads, setThreads] = useState<BuildThread[]>([
    { id: "th-1", title: "Overdue SLA escalation logic", createdAt: "2h ago" },
    { id: "th-2", title: "Filter by region + crew size", createdAt: "yesterday" },
    { id: "th-3", title: "New conversation", createdAt: "just now" },
  ]);
  const [activeThreadId, setActiveThreadId] = useState("th-3");

  const newThread = () => {
    const id = `th-${threads.length + 1}-${threads.length}`;
    setThreads((t) => [{ id, title: "New conversation", createdAt: "just now" }, ...t]);
    setActiveThreadId(id);
    setRefineLog([]);
    setRefineDraft("");
  };
  const selectThread = (id: string) => {
    setActiveThreadId(id);
    setRefineLog([]);
    setRefineDraft("");
  };
  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];

  // back / exit → the app listing
  const resetBuild = () => {
    setStage("gallery");
    setOpenedApp(null);
    setPrompt("");
    setRefineLog([]);
    setClarifyAnswer(null);
    setClarifyAnswers({});
    setSkillBadge(false);
    setPublished(false);
    setAuditOpen(false);
    setAutoOpen(false);
  };
  // "Build a new app" → the prompt composer (the old home screen)
  const openComposer = () => {
    setOpenedApp(null);
    setPrompt("");
    setAttachedTemplate(null);
    setRefineLog([]);
    setClarifyAnswer(null);
    setClarifyAnswers({});
    setSkillBadge(false);
    setPublished(false);
    setStage("home");
    setTimeout(() => taRef.current?.focus(), 60);
  };
  const sendRefine = () => {
    if (!refineDraft.trim() || stage !== "preview") return;
    const msg = refineDraft.trim();
    setRefineLog((l) => [...l, msg]);
    setSkillBadge(true);
    setRefineDraft("");
    setIsRefining(true);
    setTimeout(() => setIsRefining(false), 2000);
    // auto-title an untitled thread from its first message
    setThreads((ts) =>
      ts.map((t) =>
        t.id === activeThreadId && t.title === "New conversation"
          ? { ...t, title: deriveThreadTitle(msg) }
          : t,
      ),
    );
  };

  // Chat → Build handoff: pre-seed the prompt box (§1)
  useEffect(() => {
    if (seededPrompt) {
      setPrompt(seededPrompt);
      onConsumeSeed?.();
      taRef.current?.focus();
    }
  }, [seededPrompt, onConsumeSeed]);

  // generating animation — drives both the left-pane trace and the
  // full-screen build overlay. Each phase holds ~900ms before advancing.
  useEffect(() => {
    if (stage !== "generating") return;
    setGenStep(0);
    const id = setInterval(
      () =>
        setGenStep((s) => {
          if (s >= GEN_PHASES.length - 1) {
            clearInterval(id);
            setTimeout(() => setStage("preview"), 900);
            return s;
          }
          return s + 1;
        }),
      1400,
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

    const REASON_GAP = 1100;   // gap between streamed reasoning lines
    const STEP_DUR = 1700;     // how long each plan step shows "resolving…"
    const reasonDone = 600 + CLARIFY_REASONING.length * REASON_GAP;

    // 1. stream the reasoning lines
    CLARIFY_REASONING.forEach((_, i) =>
      timers.push(setTimeout(() => setReasonLine(i + 1), 600 + i * REASON_GAP)),
    );

    // 2. then resolve plan steps one-by-one — each holds STEP_DUR in its
    //    loading state (planStep === i) before completing (planStep > i).
    const stepsStart = reasonDone + 400;
    timers.push(setTimeout(() => setPlanStarted(true), stepsStart));
    CLARIFY_PLAN.forEach((_, i) =>
      timers.push(setTimeout(() => setPlanStep(i + 1), stepsStart + (i + 1) * STEP_DUR)),
    );

    // 3. hand off once the last step has finished + a beat to read it
    const total = stepsStart + (CLARIFY_PLAN.length + 1) * STEP_DUR + 900;
    timers.push(setTimeout(() => setStage("homeClarify"), total));
    return () => timers.forEach(clearTimeout);
  }, [stage]);

  // once questions appear, scroll the first one into view so it's obvious
  // the user needs to fill them in.
  useEffect(() => {
    if (stage !== "homeClarify") return;
    const id = setTimeout(() => {
      clarifyQuestionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 420);
    return () => clearTimeout(id);
  }, [stage]);

  // keep URL hash in sync with build stage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash =
      stage === "gallery"
        ? "#build"
        : stage === "home" ||
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
    setClarifyAnswer(null);
    setClarifyAnswers({});
    // dispatch → reason (gather context) → clarify (ask the 4 questions)
    // cockpit  → thinking (brief pause, then generate)
    // kanban   → generating immediately
    if (a === "dispatch") setStage("homeReasoning");
    else if (a === "cockpit") setStage("homeThinking");
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

  // all required questions answered?
  const clarifyComplete = CLARIFY_QUESTIONS.every(
    (q) => q.optional || (clarifyAnswers[q.id] && clarifyAnswers[q.id].trim()),
  );

  // submit all answers → thinking → generating
  const submitClarify = () => {
    if (!clarifyComplete) return;
    const summary = CLARIFY_QUESTIONS.map((q) => clarifyAnswers[q.id])
      .filter(Boolean)
      .join(" · ");
    setClarifyAnswer(summary);
    setStage("homeThinking");
  };

  const useTemplate = (t: BuildTemplate) => {
    const starterIndex = HOME_STARTERS.findIndex((s) => s.template.id === t.id);
    if (starterIndex >= 0) setHomeStarter(starterIndex);
    setPrompt(t.prompt);
    setTimeout(() => taRef.current?.focus(), 50);
  };

  const openApp = (app: BuildApp) => {
    setOpenedApp(app);
    setArchetype(
      app.id === "app-quote"
        ? "kanban"
        : app.id === "app-invoices"
          ? "cockpit"
          : "dispatch",
    );
    setSkillBadge(app.id === "app-dispatch");
    setStage("preview");
    setCanvasMode("preview");
  };

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

  // ── GALLERY · landing app listing ───────────────────────────────────────
  // The default Build landing is the listing of every app in the workspace.
  // "Build App" (header CTA + the dashed New-App card) opens the composer.
  if (stage === "gallery") {
    return (
      <div className="flex-1 rounded-xl border border-[#E1E3E6] relative overflow-hidden overflow-y-auto">
        <AppGallery onOpenApp={openApp} onNewApp={openComposer} />
      </div>
    );
  }

  // ── HOME · REASONING + CLARIFY CONVERSATION ─────────────────────────────
  // Submitting a dispatch prompt drops into a Sense-style conversation:
  //   1. homeReasoning — AI streams its reasoning + a live plan panel that
  //      "fetches records" from Jobs / Technicians / Quotes before it can ask.
  //   2. homeClarify  — Sense asks all 4 questions at once; user answers via
  //      chips + free text, then hits Generate.
  //   3. homeThinking — brief hand-off into the build.
  if (homeFlowActive) {
    const promptText = (prompt.trim() || activeStarter.template.prompt);
    const answeredCount = CLARIFY_QUESTIONS.filter(
      (q) => clarifyAnswers[q.id] && clarifyAnswers[q.id].trim(),
    ).length;
    return (
      <div
        className="flex-1 rounded-xl border border-[#E1E3E6] relative overflow-hidden flex flex-col bg-white"
      >
        {/* conversation scroll area */}
        <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
          <div className="w-full max-w-[720px] mx-auto px-8 py-10 flex flex-col gap-8">

            {/* user message — right aligned bubble */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-end"
            >
              <div className="inline-block max-w-[80%] bg-[#F3F4F6] rounded-[16px] px-5 py-3">
                <p className="text-[15px] text-[#1C1E21] font-normal whitespace-pre-wrap leading-[1.5]">
                  {promptText}
                </p>
              </div>
            </motion.div>

            {/* Sense response */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              {/* logo + label */}
              <div className="flex items-center gap-2 mb-3">
                <svg width="20" height="20" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                  <rect y="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                  <rect x="15.75" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                  <rect x="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                  <rect x="15.75" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                  <rect y="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                  <rect x="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                  <rect x="31.5" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                  <rect x="31.5" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                </svg>
                <span className="text-[14px] font-medium text-[#1C1E21]">Sense</span>
              </div>

              {/* ── Reasoning card — floating, elevated, warm (ref: Notion Create + Linear hues) ── */}
              {(() => {
                // per-module color theme — distinct hue per source (Linear-style)
                const MODULE_THEME: Record<string, { icon: typeof Database; tint: string; ink: string; ring: string }> = {
                  Schema:      { icon: Database,  tint: '#EDE9FE', ink: '#6D28D9', ring: 'rgba(109,40,217,0.18)' },
                  Jobs:        { icon: Briefcase, tint: '#FFE8DC', ink: '#C2410C', ring: 'rgba(194,65,12,0.18)' },
                  Technicians: { icon: Users,     tint: '#DBEAFE', ink: '#1D4ED8', ring: 'rgba(29,78,216,0.18)' },
                  Quotes:      { icon: FileText,  tint: '#D1FAE5', ink: '#047857', ring: 'rgba(4,120,87,0.18)' },
                };
                const pct = Math.round((Math.min(planStep, CLARIFY_PLAN.length) / CLARIFY_PLAN.length) * 100);
                return (
              <div
                className="relative rounded-[20px] bg-white overflow-hidden"
                style={{
                  boxShadow: '0 0 0 1px rgba(28,30,33,0.05), 0 1px 2px rgba(28,30,33,0.04), 0 24px 48px -28px rgba(28,30,33,0.28)',
                }}
              >
                {/* warm ambient wash behind the header */}
                <div
                  className="absolute inset-x-0 top-0 h-24 pointer-events-none"
                  style={{ background: homeReasoningActive
                    ? 'linear-gradient(180deg, #FFF4EC 0%, rgba(255,244,236,0) 100%)'
                    : 'linear-gradient(180deg, #EFF8EC 0%, rgba(239,248,236,0) 100%)' }}
                />

                {/* header — raised soft icon badge (ref: Staking Bot flame badge) */}
                <div className="relative flex items-center gap-3 px-4 pt-4 pb-3">
                  <span
                    className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-white"
                    style={{ boxShadow: '0 1px 1px rgba(28,30,33,0.04), 0 6px 14px -6px rgba(28,30,33,0.28), inset 0 0 0 1px rgba(28,30,33,0.04)' }}
                  >
                    {homeReasoningActive ? (
                      <Loader2 className={`w-[18px] h-[18px] text-[#FD5000] ${reduceMotion ? '' : 'animate-spin'}`} />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-[#EAF3E4] flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#5B8C3E]" strokeWidth={3} />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold tracking-[-0.02em] text-[#111315] leading-tight">
                      {homeReasoningActive ? 'Gathering context' : 'Context gathered'}
                    </p>
                    <p className="text-[12px] text-[#9CA3AF] leading-tight mt-0.5">
                      {homeReasoningActive
                        ? 'Reading your live Zuper data before I design anything'
                        : 'Grounded against 4 live sources — ready to build'}
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 inline-flex items-center justify-center min-w-[44px] h-7 px-2.5 rounded-full text-[11.5px] font-semibold tabular-nums"
                    style={{ background: '#F4F4F2', color: '#6B7280' }}
                  >
                    {Math.min(planStep, CLARIFY_PLAN.length)}/{CLARIFY_PLAN.length}
                  </span>
                </div>

                {/* thin progress bar */}
                <div className="relative h-[3px] mx-4 mb-3 rounded-full overflow-hidden bg-[#F0F0EE]">
                  <motion.div
                    className="h-full rounded-full"
                    initial={false}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: homeReasoningActive ? '#FD5000' : '#5B8C3E' }}
                  />
                </div>

                {/* reasoning lines (stream in) */}
                <div className="relative px-4 pb-1 flex flex-col gap-2">
                  {CLARIFY_REASONING.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: i < reasonLine ? 1 : 0, y: i < reasonLine ? 0 : 4 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[13px] leading-[1.55] text-[#6B7280]"
                      style={{ display: i < reasonLine ? 'block' : 'none' }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                {/* plan steps — each record fades in only once it starts resolving */}
                <div className="relative px-2.5 pt-3 pb-3 flex flex-col gap-1.5">
                  <AnimatePresence initial={false}>
                    {CLARIFY_PLAN.map((step, i) => {
                      const done = i < planStep;
                      const running = planStarted && i === planStep && homeReasoningActive;
                      // not yet reached → don't render at all (no disabled rows)
                      if (!done && !running) return null;
                      const t = MODULE_THEME[step.module];
                      const Icon = t.icon;
                      return (
                        <motion.div
                          key={step.label}
                          initial={{ opacity: 0, y: 6, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center gap-3 px-2.5 py-2 rounded-[14px] overflow-hidden"
                          style={{
                            background: running ? '#FFFFFF' : '#FBFBFA',
                            boxShadow: running
                              ? `0 0 0 1px ${t.ring}, 0 8px 18px -10px rgba(28,30,33,0.30)`
                              : '0 0 0 1px rgba(28,30,33,0.04)',
                            transition: 'box-shadow 280ms ease, background 280ms ease',
                          }}
                        >
                          {/* colored module tile */}
                          <span
                            className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0"
                            style={{ background: t.tint }}
                          >
                            <Icon className="w-[17px] h-[17px]" style={{ color: t.ink }} />
                          </span>

                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#1C1E21] leading-tight truncate">
                              {step.label}
                            </p>
                            <p className="text-[11.5px] leading-tight mt-0.5 truncate" style={{ color: running ? t.ink : '#9CA3AF' }}>
                              {running ? 'resolving…' : step.detail}
                            </p>
                          </div>

                          {done ? (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                              className="inline-flex items-center gap-1 h-6 pl-1.5 pr-2.5 rounded-full text-[11px] font-semibold flex-shrink-0"
                              style={{ background: t.tint, color: t.ink }}
                            >
                              <Check className="w-3 h-3" strokeWidth={3} /> {step.count}
                            </motion.span>
                          ) : (
                            <Loader2 className={`w-4 h-4 flex-shrink-0 ${reduceMotion ? '' : 'animate-spin'}`} style={{ color: t.ink }} />
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
                );
              })()}

              {/* ── Clarify questions — all asked at once ── */}
              {(homeClarifyActive || (!homeReasoningActive && clarifyAnswer)) && (
                <motion.div
                  ref={clarifyQuestionsRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-5 scroll-mt-6"
                >
                  <p className="text-[15px] text-[#1C1E21] leading-relaxed mb-1">
                    I've pulled the records. A few things I can't infer — answer these and I'll build it:
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11.5px] font-semibold tracking-[0.02em] uppercase text-[#A0522D]/70">
                      {answeredCount} of {CLARIFY_QUESTIONS.length} answered
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {CLARIFY_QUESTIONS.map((q, qi) => {
                      const val = clarifyAnswers[q.id] || '';
                      return (
                        <div key={q.id} className="rounded-2xl border border-[#ECEEF1] bg-white p-4" style={{ boxShadow: '0 1px 2px rgba(28,30,33,0.04)' }}>
                          <div className="flex items-start gap-2.5 mb-3">
                            <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[11px] font-bold" style={{ background: val ? '#EAF3E4' : '#F3F4F6', color: val ? '#5B8C3E' : '#9CA3AF' }}>
                              {val ? <Check className="w-3 h-3" strokeWidth={3} /> : qi + 1}
                            </span>
                            <p className="text-[14px] font-medium text-[#1C1E21] leading-snug">
                              {q.prompt}
                              {q.optional && <span className="text-[#9CA3AF] font-normal"> · optional</span>}
                            </p>
                          </div>
                          {q.kind === 'choice' ? (
                            <div className="flex flex-wrap gap-2 pl-7">
                              {q.options!.map((opt) => {
                                const active = val === opt;
                                return (
                                  <motion.button
                                    key={opt}
                                    onClick={() => setClarify(q.id, active ? '' : opt)}
                                    disabled={!homeClarifyActive}
                                    whileTap={{ scale: 0.97 }}
                                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[13px] font-medium transition-colors disabled:opacity-60"
                                    style={{
                                      background: active ? '#FFF1E8' : '#FFFFFF',
                                      border: `1px solid ${active ? '#FD5000' : '#E1E3E6'}`,
                                      color: active ? '#C0410C' : '#374151',
                                      boxShadow: active ? 'none' : '0 1px 2px rgba(28,30,33,0.04)',
                                    }}
                                  >
                                    {active && <Check className="w-3 h-3" strokeWidth={3} />}
                                    {opt}
                                  </motion.button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="pl-7">
                              <input
                                value={val}
                                readOnly={!homeClarifyActive}
                                onChange={(e) => setClarify(q.id, e.target.value)}
                                placeholder={q.placeholder}
                                className="w-full h-10 px-3.5 rounded-xl bg-[#FAFAFA] border border-[#ECEEF1] outline-none text-[13.5px] text-[#1C1E21] placeholder:text-[#B0B8C4] focus:border-[#FD5000]/40 focus:bg-white transition-colors"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* prompt box — pinned, PixelBlast tray + Generate action */}
        <div className="px-8 pt-2 pb-5 flex-shrink-0 bg-white">
          <div className="w-full max-w-[720px] mx-auto">
            <motion.div
              layoutId="build-prompt-card"
              layout
              transition={{ layout: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
              className="rounded-[24px] bg-white overflow-hidden"
              style={{ boxShadow: '0 0 0 1px rgba(180,151,207,0.18), 0 1px 2px rgba(28,30,33,0.04), 0 18px 54px -42px rgba(28,30,33,0.62)' }}
            >
              {/* PixelBlast status tray */}
              <div
                className="relative overflow-hidden w-full"
                style={{
                  height: 56,
                  background: homeClarifyActive ? '#EEF4FA' : '#FCF4EC',
                  transition: 'background-color 320ms cubic-bezier(0.23,1,0.32,1)',
                }}
              >
                <div className="absolute inset-0">
                  <PixelBlast
                    variant="square"
                    pixelSize={2}
                    color={homeClarifyActive ? '#A9CCE8' : '#F2B485'}
                    patternScale={2.5}
                    patternDensity={0.8}
                    enableRipples={false}
                    liquid={false}
                    speed={0.35}
                    edgeFade={0.28}
                    transparent
                  />
                </div>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: '#FFFFFF',
                    opacity: colorFlash ? 1 : 0,
                    transition: colorFlash ? 'opacity 90ms ease-out' : 'opacity 300ms cubic-bezier(0.23,1,0.32,1)',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full"
                    style={{
                      background: '#FFFFFF',
                      border: `1px solid ${homeClarifyActive ? 'rgba(67,133,190,0.24)' : 'rgba(236,139,73,0.24)'}`,
                      boxShadow: `0 4px 16px -2px ${homeClarifyActive ? 'rgba(67,133,190,0.32)' : 'rgba(236,139,73,0.34)'}, 0 1px 3px rgba(28,30,33,0.08)`,
                      transition: 'border-color 320ms ease, box-shadow 320ms ease',
                    }}
                  >
                    <span
                      className={(reduceMotion ? '' : 'animate-spin ') + 'w-3 h-3 rounded-full border-2'}
                      style={{
                        borderColor: homeClarifyActive ? '#CFE2F2' : '#F6E0CB',
                        borderTopColor: homeClarifyActive ? '#4385BE' : '#EC8B49',
                        transition: 'border-color 320ms ease',
                        ...(reduceMotion ? {} : { animationDuration: '0.7s' }),
                      }}
                    />
                    <span className="relative inline-flex text-[13px] font-semibold tracking-[-0.02em]" style={{ height: 17 }}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={homeClarifyActive ? 'waiting' : 'thinking'}
                          initial={{ opacity: 0, filter: 'blur(3px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, filter: 'blur(3px)' }}
                          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                          className="whitespace-nowrap"
                          style={{ color: homeClarifyActive ? '#205EA6' : '#A85A2A' }}
                        >
                          {homeClarifyActive ? 'Waiting for input' : homeReasoningActive ? 'Thinking...' : 'Building...'}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                </div>
              </div>

              {/* action row — Generate once all questions answered */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-[13px] text-[#9CA3AF] flex-1">
                  {homeClarifyActive
                    ? clarifyComplete
                      ? 'All set — generate your dispatch board.'
                      : `Answer the ${CLARIFY_QUESTIONS.length - answeredCount} remaining ${CLARIFY_QUESTIONS.length - answeredCount === 1 ? 'question' : 'questions'} above.`
                    : 'Pick an answer above or type something else to continue'}
                </span>
                <BorderGlow
                  animated
                  borderRadius={9999}
                  backgroundColor="#111315"
                  glowColor="0 0 100"
                  colors={['#ffffff', '#cccccc', '#ffffff']}
                  glowIntensity={1.2}
                  glowRadius={24}
                  coneSpread={18}
                  edgeSensitivity={20}
                >
                  <motion.button
                    onClick={submitClarify}
                    disabled={!homeClarifyActive || !clarifyComplete}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-white disabled:opacity-25 disabled:cursor-not-allowed text-[13.5px] font-semibold tracking-[-0.01em]"
                    style={{ transition: 'opacity 200ms' }}
                  >
                    <Sparkles className={`w-3.5 h-3.5 flex-shrink-0 ${!homeClarifyActive && !reduceMotion ? 'animate-pulse' : ''}`} />
                    <span>{homeClarifyActive ? 'Generate' : 'Generating...'}</span>
                  </motion.button>
                </BorderGlow>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // ── HOME · BUILD COMPOSER ───────────────────────────────────────────────
  // Reached from the gallery's "Build App" CTA. Hero + prompt + starter tiles.
  if (stage === 'home') {
    return (
      <div
        className={
          "flex-1 rounded-xl border border-[#E1E3E6] relative overflow-hidden overflow-y-auto scroll-smooth" +
          // snap only in the idle composer state; the conversation flow needs free scroll
          (!(homeFlowActive || homeClarifyActive) ? " snap-y snap-mandatory" : "")
        }
        style={{
          backgroundColor: '#F4F4F2',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(28,30,33,0.055) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      >
        {/* back to listing */}
        <button
          onClick={resetBuild}
          className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 h-9 pl-2.5 pr-3.5 rounded-full bg-white border border-[#E4E7EC] text-[13px] font-medium text-[#374151] hover:border-[#D5D9DE] transition-colors"
          style={{ boxShadow: '0 1px 3px rgba(28,30,33,0.06)' }}
        >
          <ArrowLeft className="w-4 h-4" /> All apps
        </button>

        {/* ── Snap section 1 · composer (one full viewport) ──────────────── */}
        <div ref={composerRef} className="flex flex-col items-center px-8 pt-[8vh] pb-12 min-h-full snap-start">
          <div className="relative w-full max-w-[780px]">

            {/* Hero row */}
            <motion.div
              className="flex items-start justify-between mb-10"
              animate={{ opacity: homeFlowActive || homeClarifyActive ? 0 : 1, y: homeFlowActive || homeClarifyActive ? -16 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ pointerEvents: homeFlowActive || homeClarifyActive ? 'none' : 'auto' }}
            >
              <div>
                <h1 className="flex items-baseline text-[72px] sm:text-[72px] leading-[0.82] font-semibold tracking-[-0.04em] text-[#111315]">
                  <span>Build</span>
                  <span className="ml-1 text-[60px] sm:text-[74px] leading-none text-[#FD5000] tracking-[-0.08em]">.</span>
                </h1>
                <p className="text-[16px] sm:text-[18px] leading-[1.3] tracking-[-0.02em] text-[#5F6670] max-w-[400px] mt-5">
                  Describe the workflow. Sense turns it into a native Zuper app with the right layout, data, actions, and permissions.
                </p>
              </div>
              <PlusField />
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
                  <p className="text-[22px] font-semibold tracking-[-0.03em] leading-snug text-[#111315] mb-4">{CLARIFY.question}</p>
                  <div className="flex flex-wrap gap-2">
                    {CLARIFY.options.map((opt) => (
                      <motion.button
                        key={opt}
                        onClick={() => answerClarify(opt)}
                        whileTap={{ scale: 0.96 }}
                        className="h-9 px-4 rounded-full text-[13px] font-medium tracking-[-0.01em] transition-all bg-white border border-[#DCDFE4] text-[#374151] hover:border-[#B497CF] hover:text-[#5B3D7A]"
                        style={{ boxShadow: '0 1px 3px rgba(28,30,33,0.07)' }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>


            {/* Prompt box — layoutId matches ChatThread refine composer so Framer flies it there */}
            <motion.div
              layoutId="build-prompt-card"
              layout
              transition={{ layout: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
              className="rounded-[32px] bg-white mb-4 overflow-hidden"
              style={{ boxShadow: '0 0 0 1px rgba(180,151,207,0.18), 0 1px 2px rgba(28,30,33,0.04), 0 28px 80px -48px rgba(28,30,33,0.72)' }}
            >
              {/* Thinking tray — fade+slide, no height animation (height triggers layout) */}
              <AnimatePresence>
                {homeFlowActive && (
                  <motion.div
                    key="thinking-tray"
                    initial={{ opacity: 0, transform: 'translateY(-8px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    exit={{ opacity: 0, transform: 'translateY(-6px)' }}
                    transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                    className="relative overflow-hidden w-full"
                    style={{
                      height: 64,
                      // bg crossfades between blue/orange instead of hard-swapping
                      background: homeClarifyActive ? '#EEF4FA' : '#FCF4EC',
                      transition: 'background-color 320ms cubic-bezier(0.23,1,0.32,1)',
                    }}
                  >
                    {/* single PixelBlast, one tone per state */}
                    <div className="absolute inset-0">
                      <PixelBlast
                        variant="square"
                        pixelSize={2}
                        color={homeClarifyActive ? '#A9CCE8' : '#F2B485'}
                        patternScale={2.5}
                        patternDensity={0.8}
                        enableRipples={false}
                        liquid={false}
                        speed={0.35}
                        edgeFade={0.28}
                        transparent
                      />
                    </div>
                    {/* white bridge flash at the color swap */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: '#FFFFFF',
                        opacity: colorFlash ? 1 : 0,
                        transition: colorFlash
                          ? 'opacity 90ms ease-out'
                          : 'opacity 300ms cubic-bezier(0.23,1,0.32,1)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="inline-flex items-center gap-2 h-8 px-3.5 rounded-full"
                        style={{
                          background: '#FFFFFF',
                          border: `1px solid ${homeClarifyActive ? 'rgba(67,133,190,0.24)' : 'rgba(236,139,73,0.24)'}`,
                          boxShadow: `0 4px 16px -2px ${homeClarifyActive ? 'rgba(67,133,190,0.32)' : 'rgba(236,139,73,0.34)'}, 0 1px 3px rgba(28,30,33,0.08)`,
                          transition: 'border-color 320ms ease, box-shadow 320ms ease',
                        }}
                      >
                        {/* spinner — color crossfades, never restarts */}
                        <span
                          className={(reduceMotion ? '' : 'animate-spin ') + 'w-3 h-3 rounded-full border-2'}
                          style={{
                            borderColor: homeClarifyActive ? '#CFE2F2' : '#F6E0CB',
                            borderTopColor: homeClarifyActive ? '#4385BE' : '#EC8B49',
                            transition: 'border-color 320ms ease',
                            ...(reduceMotion ? {} : { animationDuration: '0.7s' }),
                          }}
                        />
                        {/* label crossfade — only the changing word swaps */}
                        <span className="relative inline-flex text-[13px] font-semibold tracking-[-0.02em]" style={{ height: 17 }}>
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={homeClarifyActive ? 'waiting' : 'thinking'}
                              initial={{ opacity: 0, filter: 'blur(3px)' }}
                              animate={{ opacity: 1, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, filter: 'blur(3px)' }}
                              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                              className="whitespace-nowrap"
                              style={{ color: homeClarifyActive ? '#205EA6' : '#A85A2A' }}
                            >
                              {homeClarifyActive ? 'Waiting for input' : 'Thinking...'}
                            </motion.span>
                          </AnimatePresence>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prompt content */}
              <div className="p-5 sm:p-6">
                <textarea
                  ref={taRef}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submitPrompt(); } }}
                  rows={4}
                  readOnly={homeFlowActive || homeClarifyActive}
                  placeholder={activeStarter.template.prompt}
                  className="w-full resize-none outline-none bg-transparent text-[20px] tracking-normal text-[#111315] placeholder:text-[#B0B8C4] leading-[1.55] px-1 pt-1 min-h-[112px]"
                />

                {/* Attached template — small square thumbnail chip */}
                <AnimatePresence>
                  {attachedTemplate && !(homeFlowActive || homeClarifyActive) && (
                    <motion.div
                      key={attachedTemplate.id}
                      initial={{ opacity: 0, scale: 0.9, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 4 }}
                      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                      className="mt-3 inline-flex items-center gap-2.5 rounded-2xl border border-[#ECEEF1] bg-[#FAFAFA] py-1.5 pl-1.5 pr-3"
                    >
                      <div className="group relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl border border-[#ECEEF1]">
                        <TemplateThumb app={attachedTemplate} className="h-full w-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[12px] font-semibold tracking-[-0.01em] text-[#1C1E21]">
                          {attachedTemplate.name}
                        </p>
                        <p className="truncate text-[11px] text-[#9CA3AF]">
                          Template · {attachedTemplate.company}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedTemplate(null)}
                        className="ml-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#ECEEF1] hover:text-[#1C1E21]"
                        aria-label="Remove template"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!(homeFlowActive || homeClarifyActive) && <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0F0F2]">
                  <button
                    className="w-8 h-8 rounded-full border border-[#ECEEF1] flex items-center justify-center text-[#9CA3AF] hover:text-[#1C1E21] hover:border-[#D5D9DE] transition-colors"
                    disabled={homeFlowActive || homeClarifyActive}
                    style={{ opacity: homeFlowActive || homeClarifyActive ? 0.35 : 1, transition: 'opacity 180ms' }}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-[12px] text-[#9CA3AF] tracking-[-0.01em]" style={{ opacity: homeFlowActive || homeClarifyActive ? 0 : 1, transition: 'opacity 150ms' }}>
                    or try an example below
                  </span>
                  <span className="ml-auto text-[11px] text-[#C4CAD4] font-mono" style={{ opacity: homeFlowActive || homeClarifyActive ? 0 : 1, transition: 'opacity 150ms' }}>
                    ⌘ enter
                  </span>
                  <BorderGlow
                    animated
                    borderRadius={9999}
                    backgroundColor="#111315"
                    glowColor="0 0 100"
                    colors={['#ffffff', '#cccccc', '#ffffff']}
                    glowIntensity={1.2}
                    glowRadius={24}
                    coneSpread={18}
                    edgeSensitivity={20}
                  >
                    <motion.button
                      onClick={submitPrompt}
                      disabled={!prompt.trim() && !(homeFlowActive || homeClarifyActive)}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-white disabled:opacity-25 disabled:cursor-not-allowed text-[13.5px] font-semibold tracking-[-0.01em]"
                      style={{ transition: 'transform 160ms cubic-bezier(0.23,1,0.32,1), opacity 200ms' }}
                    >
                      <Sparkles className={`w-3.5 h-3.5 flex-shrink-0 ${(homeFlowActive || homeClarifyActive) && !reduceMotion ? 'animate-pulse' : ''}`} />
                      <span>{homeFlowActive || homeClarifyActive ? 'Generating...' : 'Generate'}</span>
                    </motion.button>
                  </BorderGlow>
                </div>}
              </div>
            </motion.div>

            {/* Example tiles — hidden during active states */}
            <AnimatePresence>
              {!(homeFlowActive || homeClarifyActive) && (
                <motion.div
                  key="home-tiles"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-10 w-full"
                >
                  <div className="flex min-w-0 gap-2.5 overflow-x-auto scrollbar-hide">
                    {HOME_STARTERS.map((item, i) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          const a = classify(item.template.prompt);
                          setArchetype(a);
                          setPrompt(item.template.prompt);
                          setHomeStarter(i);
                          setRefineLog([]); setClarifyAnswer(null); setClarifyAnswers({});
                          if (a === 'dispatch') setStage('homeReasoning');
                          else if (a === 'cockpit') setStage('homeThinking');
                          else setStage('generating');
                        }}
                        className="group relative flex flex-1 min-w-[240px] flex-col overflow-hidden rounded-[20px] border bg-white px-5 pb-5 pt-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          borderColor: i === homeStarter ? '#C9CDD4' : '#E6E8EC',
                          boxShadow: '0 1px 2px rgba(28,30,33,0.04)',
                        }}
                      >
                        {/* kicker — module identity dot + label */}
                        <span className="mb-3 inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.accent }} />
                          <span className="text-[10.5px] font-semibold uppercase tracking-[0.07em] text-[#9CA3AF]">
                            {item.kicker}
                          </span>
                        </span>

                        {/* editorial phrase — key words pop, connective words fade */}
                        <EmphasizedPhrase phrase={item.phrase} />

                        {/* arrow reveals on hover */}
                        <ArrowRight className="mt-4 h-4 w-4 -rotate-45 text-[#1C1E21] opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* scroll affordance — gallery is one scroll down */}
            <AnimatePresence>
              {!(homeFlowActive || homeClarifyActive) && (
                <motion.button
                  key="home-scroll-hint"
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.26 }}
                  onClick={() => galleryRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="mt-10 inline-flex w-full items-center justify-center gap-2 text-[12px] font-medium text-[#9CA3AF] transition-colors hover:text-[#1C1E21]"
                >
                  Browse the app gallery
                  <ArrowRight className="h-3.5 w-3.5 rotate-90" />
                </motion.button>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* ── Snap section 2 · app gallery (one full viewport) ───────────── */}
        <AnimatePresence>
          {!(homeFlowActive || homeClarifyActive) && (
            <motion.div
              key="home-gallery"
              ref={galleryRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="flex min-h-full snap-start flex-col items-center px-8 pb-12 pt-[8vh]"
            >
              <div className="w-full max-w-[1080px]">
                <PublicAppGallery
                  onUseTemplate={(app) => {
                    const a = classify(app.prompt);
                    setArchetype(a);
                    setPrompt(app.prompt);
                    setAttachedTemplate(app);
                    // jump back up to the composer (section 1) and focus it
                    composerRef.current?.scrollIntoView({ behavior: "smooth" });
                    setTimeout(() => taRef.current?.focus(), 420);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── BUILDING — two-pane AI chat + canvas ────────────────────────────────
  // Left: the conversation (prompt → clarify → plan → refine).
  // Right: the canvas, which swipes in from the right once Sense starts building.
  const isViewer = stage === "viewer";
  const ARCHETYPE_NAME: Record<Archetype, string> = {
    dispatch: "HVAC Dispatch Board — TX",
    cockpit: "AR Collections Cockpit",
    kanban: "Quote Follow-up Engine",
  };
  const appName = openedApp?.name || ARCHETYPE_NAME[archetype];
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
        : DISPATCH_PLAN;
  const activeTree =
    archetype === "cockpit"
      ? COCKPIT_TREE
      : archetype === "kanban"
        ? KANBAN_TREE
        : DISPATCH_TREE;
  // canvas is present (swiped in) from generating onward; viewer/opened-app skip the chat
  const canvasIn = stage !== "clarify";
  const chatVisible = !openedApp && !isViewer; // opening an existing app or viewing → canvas only

  const Canvas = (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ background: "#F4F4F2" }}
    >
      {/* board header — height + padding matched to the left chat pane header */}
      <div
        className="h-12 flex items-center justify-between pl-3 pr-4 border-b flex-shrink-0"
        style={{ background: "#F7F7F5", borderColor: "#E1E3E6" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={resetBuild}
            className="w-8 h-8 rounded-lg hover:bg-[#EFEFEC] flex items-center justify-center text-[#6B7280] flex-shrink-0 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[14px] font-semibold text-[#1C1E21] truncate tracking-[-0.01em]">
              {appName}
            </span>
            {published || openedApp?.lifecycle === "published" ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#15803D] bg-[#ECFDF5] px-2 h-5 rounded-full flex-shrink-0">
                published
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#6B7280] bg-white px-2 h-5 rounded-full border border-[#ECEEF1] flex-shrink-0">
                draft
              </span>
            )}
          </div>
        </div>

        {isViewer ? (
          <button
            onClick={() => setStage("preview")}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12.5px] font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E9EBEE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Exit viewer
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* quiet secondary actions — icon only */}
            {archetype === "kanban" && (
              <button
                onClick={() => setAutoOpen((o) => !o)}
                title="Automations"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border"
                style={{
                  borderColor: autoOpen ? "#FED7AA" : "#ECEEF1",
                  background: autoOpen ? "#FFF4ED" : "#FFFFFF",
                  color: autoOpen ? "#FD5000" : "#9CA3AF",
                }}
                onMouseEnter={(e) => {
                  if (!autoOpen) {
                    e.currentTarget.style.background = "#FAFAFA";
                    e.currentTarget.style.color = "#374151";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!autoOpen) {
                    e.currentTarget.style.background = "#FFFFFF";
                    e.currentTarget.style.color = "#9CA3AF";
                  }
                }}
              >
                <Zap className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setAuditOpen((o) => !o)}
              title="Write audit log"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors border"
              style={{
                borderColor: auditOpen ? "#FED7AA" : "#ECEEF1",
                background: auditOpen ? "#FFF4ED" : "#FFFFFF",
                color: auditOpen ? "#FD5000" : "#9CA3AF",
              }}
              onMouseEnter={(e) => {
                if (!auditOpen) {
                  e.currentTarget.style.background = "#FAFAFA";
                  e.currentTarget.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (!auditOpen) {
                  e.currentTarget.style.background = "#FFFFFF";
                  e.currentTarget.style.color = "#9CA3AF";
                }
              }}
            >
              <History className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-[#E1E3E6]" />
            <button
              onClick={() => canPublish && setPublishOpen(true)}
              disabled={!canPublish}
              title={
                canPublish ? "Publish app" : "Needs the publish_apps permission"
              }
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[12.5px] font-semibold text-white bg-[#111315] hover:bg-[#000] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#111315]"
            >
              {canPublish ? (
                <Rocket className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5" />
              )}{" "}
              Publish
            </button>
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex-1 flex overflow-hidden relative">
        {!isViewer && canvasMode === "edit" && (
          <ElementTreePane
            selectedId={selectedEl}
            onSelect={setSelectedEl}
            tree={activeTree}
          />
        )}
        <div
          className="flex-1 overflow-hidden p-3"
          style={{ background: "#F4F4F2" }}
        >
          <div
            className="relative h-full overflow-hidden rounded-[28px] bg-white border border-white"
            style={{ boxShadow: "0 18px 54px -42px rgba(28,30,33,0.62)" }}
          >
            {phase === "generating" ? (
              <GenerationOverlay genStep={genStep} title={GEN_TITLE[archetype]} reduceMotion={!!reduceMotion} />
            ) : (
              <EditProvider
                active={!isViewer && phase === "ready"}
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
                ) : (
                  /* dispatch scheduler (§4b): time axis ⇒ never kanban */
                  <DispatchGrid
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
                    onOpenAudit={() => setAuditOpen(true)}
                  />
                )}
              </EditProvider>
            )}
          </div>
        </div>
        {!isViewer && canvasMode === "edit" && (
          <InspectorPane
            selectedId={selectedEl}
            skillBadge={skillBadge}
            onToggleSkillBadge={() => setSkillBadge((v) => !v)}
            tree={activeTree}
          />
        )}
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
            onClose={() => setPublishOpen(false)}
            onPublish={({ readOnly }) => {
              setPublished(true);
              setReadOnlyPublish(readOnly);
              setPublishOpen(false);
              setStage("viewer");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );

  // Two-pane shell: chat left, canvas swipes in from the right.
  return (
    <LayoutGroup>
    <div className="flex-1 flex overflow-hidden rounded-xl border border-[#E6E8EC] bg-white">
      {chatVisible && (
        <div className="w-[360px] flex-shrink-0 border-r border-[#E6E8EC] overflow-hidden">
          <ChatThread
            prompt={prompt}
            phase={phase}
            archetype={archetype}
            clarifyQuestion={CLARIFY.question}
            clarifyOptions={CLARIFY.options}
            clarifyAnswer={clarifyAnswer}
            onClarify={answerClarify}
            genSteps={GEN_STEPS_BY_ARCHETYPE[archetype]}
            genStep={genStep}
            genTitle={GEN_TITLE[archetype]}
            plan={activePlan}
            refineDraft={refineDraft}
            onRefineChange={setRefineDraft}
            onRefineSend={sendRefine}
            refineLog={refineLog}
            onNewApp={resetBuild}
            isRefining={isRefining}
            threads={threads}
            activeThreadId={activeThreadId}
            onSelectThread={selectThread}
            onNewThread={newThread}
          />
        </div>
      )}

      {/* canvas pane — swipes in from the right (iOS drawer curve) */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {canvasIn ? (
            <motion.div
              key="canvas"
              initial={chatVisible ? { x: "100%", opacity: 0.6 } : false}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "tween",
                ease: [0.32, 0.72, 0, 1],
                duration: 0.42,
              }}
              className="absolute inset-0"
              style={{ willChange: "transform" }}
            >
              {Canvas}
            </motion.div>
          ) : (
            /* clarify: canvas hasn't built yet — quiet waiting state */
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ background: "#F4F4F2" }}
            >
              <div
                className="relative w-[148px] h-[116px] mb-5 rounded-[28px] bg-white border border-white overflow-hidden"
                style={{ boxShadow: "0 16px 44px -34px rgba(28,30,33,0.55)" }}
              >
                <div
                  className="absolute inset-5 grid grid-cols-7 gap-x-1.5 gap-y-1 text-[18px] leading-none font-semibold select-none"
                  aria-hidden="true"
                >
                  {Array.from({ length: 42 }).map((_, i) => (
                    <span
                      key={i}
                      style={{
                        color:
                          i % 9 === 0
                            ? "#FD5000"
                            : i % 4 === 0
                              ? "#1C1E21"
                              : "#D6D9DE",
                        opacity: i % 9 === 0 ? 0.45 : 1,
                      }}
                    >
                      +
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[12.5px]" style={{ color: "#6B7280" }}>
                Answer the question to start building
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </LayoutGroup>
  );
}

// Full-screen build overlay — overlapping stacked cards (light mode).
// Replicates the reference moodboard: phase cards tuck behind each other,
// the active phase breaks out as a bright elevated white card, neighbours
// peek out and fade toward the edges.
function GenerationOverlay({
  genStep,
  title,
  reduceMotion,
}: {
  genStep: number;
  title: string;
  reduceMotion: boolean;
}) {
  const PEEK = 56;        // visible slice of a tucked card
  const ACTIVE_GAP = 30;  // extra breathing room around the active card
  const CARD_W = 420;
  const ease = "cubic-bezier(0.32, 0.72, 0, 1)";

  return (
    <div
      className="h-full w-full relative overflow-hidden flex items-center justify-center"
      style={{ background: "#EEEDEA" }}
    >
      {/* ambient dot texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(28,30,33,0.045) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* stacked cards — each absolutely positioned, centered on the active one */}
      <div className="relative" style={{ width: CARD_W, height: 460 }}>
        {GEN_PHASES.map((phase, i) => {
          const dist = i - genStep;          // 0 = active, <0 above, >0 below
          const isActive = dist === 0;
          const isPast = dist < 0;
          const Icon = phase.icon;

          // vertical position: stack peeks, with a gap carved out for active
          let y = dist * PEEK;
          if (dist > 0) y += ACTIVE_GAP;
          if (dist < 0) y -= ACTIVE_GAP;

          // fade + recede the farther a card is from active.
          // tucked cards shrink in width via scale (keeps them centered).
          const abs = Math.abs(dist);
          const opacity = isActive ? 1 : Math.max(0.0, 1 - abs * 0.34);
          const scale = isActive ? 1 : 1 - 0.05 - abs * 0.025;

          return (
            <div
              key={phase.label}
              className="absolute left-1/2 top-1/2 flex items-center gap-4 rounded-[22px]"
              style={{
                width: CARD_W,
                height: isActive ? 86 : 72,
                paddingLeft: 20,
                paddingRight: 20,
                transform: `translate(-50%, -50%) translateY(${y}px) scale(${scale})`,
                transformOrigin: "center center",
                zIndex: isActive ? 50 : 40 - abs,
                opacity,
                background: isActive ? "#FFFFFF" : "rgba(255,255,255,0.66)",
                boxShadow: isActive
                  ? "0 2px 4px rgba(28,30,33,0.05), 0 40px 80px -40px rgba(28,30,33,0.45)"
                  : "0 1px 2px rgba(28,30,33,0.03)",
                backdropFilter: isActive ? "none" : "blur(2px)",
                transition: reduceMotion
                  ? "none"
                  : `transform 600ms ${ease}, opacity 600ms ${ease}, height 500ms ${ease}, background 500ms ${ease}, box-shadow 500ms ${ease}`,
              }}
            >
              <div
                className="rounded-[14px] flex items-center justify-center flex-shrink-0"
                style={{
                  width: isActive ? 44 : 40,
                  height: isActive ? 44 : 40,
                  background: isActive ? phase.accent : phase.tint,
                  transition: reduceMotion ? "none" : `all 500ms ${ease}`,
                }}
              >
                <Icon
                  style={{
                    width: isActive ? 22 : 19,
                    height: isActive ? 22 : 19,
                    color: isActive ? "#FFFFFF" : phase.accent,
                  }}
                />
              </div>
              <span
                className="truncate"
                style={{
                  fontSize: isActive ? 22 : 18,
                  letterSpacing: "-0.02em",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#111315" : isPast ? "#A3A8B0" : "#B6BAC2",
                  transition: reduceMotion ? "none" : `all 400ms ${ease}`,
                }}
              >
                {phase.label}
              </span>
              {isActive && !reduceMotion && (
                <span
                  className="ml-auto w-5 h-5 rounded-full border-2 flex-shrink-0 animate-spin"
                  style={{
                    borderColor: "rgba(28,30,33,0.1)",
                    borderTopColor: phase.accent,
                  }}
                />
              )}
              {isPast && (
                <CheckCircle2
                  className="ml-auto w-4 h-4 flex-shrink-0"
                  style={{ color: "#16A34A", opacity: 0.7 }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* caption */}
      <div className="absolute bottom-10 left-0 right-0 flex justify-center px-6">
        <p className="text-[12.5px] tracking-[-0.01em] text-[#6B7280]">{title}</p>
      </div>
    </div>
  );
}
