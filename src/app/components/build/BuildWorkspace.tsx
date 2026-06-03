import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from "motion/react";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
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
import { EditProvider, type SelectedElement } from "./EditContext";
import { SenseLogo } from "../SenseLogo";
import PixelBlast from "./PixelBlast";
import BorderGlow from "./BorderGlow";
import {
  TEMPLATES,
  DISPATCH_PLAN,
  KANBAN_PLAN,
  CLARIFY,
  DISPATCH_TREE,
  COCKPIT_TREE,
  KANBAN_TREE,
  type BuildApp,
  type BuildTemplate,
} from "./buildData";

type Stage =
  | "home"
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

const HOME_STARTERS = [
  {
    id: "dispatch",
    label: "Dispatch scheduler",
    outcome: "Needs one detail",
    outcomeColor: "#92400E",
    outcomeBg: "#FEF3C7",
    accent: "#FD5000",
    template: TEMPLATES[0],
  },
  {
    id: "collections",
    label: "Collections cockpit",
    outcome: "Thinking…",
    outcomeColor: "#5B3D7A",
    outcomeBg: "#F0EAFA",
    accent: "#16A34A",
    template: TEMPLATES[2],
  },
  {
    id: "quotes",
    label: "Quote triage board",
    outcome: "Builds right away",
    outcomeColor: "#1E3A5F",
    outcomeBg: "#EFF6FF",
    accent: "#2563EB",
    template: TEMPLATES[1],
  },
] as const;

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
  const [stage, setStage] = useState<Stage>("home");
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
  const [auditOpen, setAuditOpen] = useState(false);
  const [autoOpen, setAutoOpen] = useState(false);
  const [, setEditLog] = useState<string[]>([]); // element-scoped edits applied
  const [archetype, setArchetype] = useState<Archetype>("dispatch");
  const [homeStarter, setHomeStarter] = useState(0);
  const taRef = useRef<HTMLTextAreaElement>(null);

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

  const resetBuild = () => {
    setStage("home");
    setOpenedApp(null);
    setPrompt("");
    setRefineLog([]);
    setClarifyAnswer(null);
    setSkillBadge(false);
    setPublished(false);
    setAuditOpen(false);
    setAutoOpen(false);
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

  // keep URL hash in sync with build stage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash =
      stage === "home" || stage === "homeClarify" || stage === "homeThinking"
        ? "#build"
        : "#build/editor";
    if (window.location.hash !== hash) window.location.hash = hash;
  }, [stage]);

  const submitPrompt = () => {
    if (!prompt.trim()) return;
    const a = classify(prompt);
    setArchetype(a);
    setRefineLog([]);
    setClarifyAnswer(null);
    // dispatch → clarify (needs one detail)
    // cockpit  → thinking (brief pause, then generate)
    // kanban   → generating immediately
    if (a === "dispatch") setStage("homeClarify");
    else if (a === "cockpit") setStage("homeThinking");
    else {
      setStage("generating");
    }
  };

  const answerClarify = (opt: string) => {
    setClarifyAnswer(opt);
    setStage("homeThinking"); // brief thinking state keeps home block mounted for layout animation
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

  const homeFlowActive = stage === "homeThinking" || stage === "homeClarify";
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

  // ── HOME ───────────────────────────────────────────────────────────────
  if (stage === 'home' || stage === 'homeClarify' || stage === 'homeThinking') {
    return (
      <div
        className="flex-1 rounded-xl border border-[#E1E3E6] relative overflow-hidden overflow-y-auto snap-y snap-mandatory"
        style={{
          backgroundColor: '#F4F4F2',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(28,30,33,0.055) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="flex flex-col items-center px-8 pt-[8vh] pb-4 min-h-full snap-start snap-always">
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
                  className="w-full"
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
                          setRefineLog([]); setClarifyAnswer(null);
                          if (a === 'dispatch') setStage('homeClarify');
                          else if (a === 'cockpit') setStage('homeThinking');
                          else setStage('generating');
                        }}
                        className="group relative flex-1 min-w-[220px] overflow-hidden rounded-[20px] border bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        style={{
                          borderColor: i === homeStarter ? '#D4D8DF' : '#E8EAEE',
                          boxShadow: '0 1px 3px rgba(28,30,33,0.06)',
                        }}
                      >
                        <span className="block h-1 w-full" style={{ background: item.accent, opacity: 0.7 }} />
                        <span className="block px-4 py-3.5">
                          <span
                            className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.01em] uppercase rounded-full px-2.5 py-1 mb-2.5"
                            style={{ color: item.outcomeColor, background: item.outcomeBg }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.outcomeColor }} />
                            {item.outcome}
                          </span>
                          <span className="block text-[13px] font-medium leading-[1.4] tracking-[-0.01em] text-[#374151] line-clamp-3">
                            {item.template.prompt}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Marketplace scroll hint */}
            {!(homeFlowActive || homeClarifyActive) && (
              <div className="flex justify-center mt-10 mb-1">
                <div
                  className="inline-flex items-center gap-1.5 h-7 px-3.5 rounded-full text-[11.5px] font-medium tracking-[-0.01em] select-none animate-bounce"
                  style={{
                    background: 'rgba(28,30,33,0.07)',
                    color: '#6B7280',
                    border: '1px solid rgba(28,30,33,0.09)',
                    animationDuration: '2s',
                  }}
                >
                  <span>↓</span>
                  App Gallery
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── App Gallery snap section ── */}
        {!(homeFlowActive || homeClarifyActive) && (
          <div className="snap-start snap-always min-h-full">
            <AppGallery onOpenApp={openApp} onNewApp={resetBuild} />
          </div>
        )}
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
