import { motion, AnimatePresence } from "motion/react";
import { Loader2, Check, Database, Briefcase, Users, FileText, LayoutGrid, Package } from "lucide-react";
import { CLARIFY_REASONING, CLARIFY_PLAN } from "./buildData";

// per-module color theme — distinct hue per source (Linear-style)
const MODULE_THEME: Record<string, { icon: typeof Database; tint: string; ink: string; ring: string }> = {
  Schema:      { icon: Database,   tint: "#EDE9FE", ink: "#6D28D9", ring: "rgba(109,40,217,0.18)" },
  Jobs:        { icon: Briefcase,  tint: "#FFE8DC", ink: "#C2410C", ring: "rgba(194,65,12,0.18)" },
  Technicians: { icon: Users,      tint: "#DBEAFE", ink: "#1D4ED8", ring: "rgba(29,78,216,0.18)" },
  Quotes:      { icon: FileText,   tint: "#D1FAE5", ink: "#047857", ring: "rgba(4,120,87,0.18)" },
  Measurement: { icon: LayoutGrid, tint: "#FFE8DC", ink: "#C2410C", ring: "rgba(194,65,12,0.18)" },
  Materials:   { icon: Package,    tint: "#FEF3C7", ink: "#B45309", ring: "rgba(180,83,9,0.18)" },
  Templates:   { icon: LayoutGrid, tint: "#DBEAFE", ink: "#1D4ED8", ring: "rgba(29,78,216,0.18)" },
};
const moduleTheme = (m: string) => MODULE_THEME[m] ?? MODULE_THEME.Schema;

// The "Gathering context" reasoning card. Shared between the live conversation
// flow and the editor's chat pane so both show the identical elements.
// `active` = still gathering (orange, spinner); false = resolved (green, done).
export function ReasoningCard({
  reasonLine,
  planStep,
  planStarted,
  active,
  reduceMotion = false,
}: {
  reasonLine: number;
  planStep: number;
  planStarted: boolean;
  active: boolean;
  reduceMotion?: boolean;
}) {
  const pct = Math.round((Math.min(planStep, CLARIFY_PLAN.length) / CLARIFY_PLAN.length) * 100);
  return (
    <div
      className="relative rounded-[20px] bg-white overflow-hidden"
      style={{ boxShadow: "0 0 0 1px rgba(28,30,33,0.05), 0 1px 2px rgba(28,30,33,0.04), 0 24px 48px -28px rgba(28,30,33,0.28)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{ background: active
          ? "linear-gradient(180deg, #FFF4EC 0%, rgba(255,244,236,0) 100%)"
          : "linear-gradient(180deg, #EFF8EC 0%, rgba(239,248,236,0) 100%)" }}
      />

      {/* header */}
      <div className="relative flex items-center gap-3 px-4 pt-4 pb-3">
        <span
          className="w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 bg-white"
          style={{ boxShadow: "0 1px 1px rgba(28,30,33,0.04), 0 6px 14px -6px rgba(28,30,33,0.28), inset 0 0 0 1px rgba(28,30,33,0.04)" }}
        >
          {active ? (
            <Loader2 className={`w-[18px] h-[18px] text-[#FD5000] ${reduceMotion ? "" : "animate-spin"}`} />
          ) : (
            <span className="w-7 h-7 rounded-full bg-[#EAF3E4] flex items-center justify-center">
              <Check className="w-4 h-4 text-[#5B8C3E]" strokeWidth={3} />
            </span>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold tracking-[-0.02em] text-[#111315] leading-tight">
            {active ? "Gathering context" : "Context gathered"}
          </p>
          <p className="text-[12px] text-[#9CA3AF] leading-tight mt-0.5">
            {active
              ? "Reading your live Zuper data before I design anything"
              : "Grounded against 4 live sources — ready to build"}
          </p>
        </div>
        <span
          className="flex-shrink-0 inline-flex items-center justify-center min-w-[44px] h-7 px-2.5 rounded-full text-[11.5px] font-semibold tabular-nums"
          style={{ background: "#F4F4F2", color: "#6B7280" }}
        >
          {Math.min(planStep, CLARIFY_PLAN.length)}/{CLARIFY_PLAN.length}
        </span>
      </div>

      {/* progress bar */}
      <div className="relative h-[3px] mx-4 mb-3 rounded-full overflow-hidden bg-[#F0F0EE]">
        <motion.div
          className="h-full rounded-full"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: active ? "#FD5000" : "#5B8C3E" }}
        />
      </div>

      {/* reasoning lines */}
      <div className="relative px-4 pb-1 flex flex-col gap-2">
        {CLARIFY_REASONING.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: i < reasonLine ? 1 : 0, y: i < reasonLine ? 0 : 4 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="text-[13px] leading-[1.55] text-[#6B7280]"
            style={{ display: i < reasonLine ? "block" : "none" }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* plan steps */}
      <div className="relative px-2.5 pt-3 pb-3 flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {CLARIFY_PLAN.map((step, i) => {
            const done = i < planStep;
            const running = planStarted && i === planStep && active;
            if (!done && !running) return null;
            const t = moduleTheme(step.module);
            const Icon = t.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 6, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto", marginTop: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 px-2.5 py-2 rounded-[14px] overflow-hidden"
                style={{
                  background: running ? "#FFFFFF" : "#FBFBFA",
                  boxShadow: running
                    ? `0 0 0 1px ${t.ring}, 0 8px 18px -10px rgba(28,30,33,0.30)`
                    : "0 0 0 1px rgba(28,30,33,0.04)",
                  transition: "box-shadow 280ms ease, background 280ms ease",
                }}
              >
                <span className="w-9 h-9 rounded-[11px] flex items-center justify-center flex-shrink-0" style={{ background: t.tint }}>
                  <Icon className="w-[17px] h-[17px]" style={{ color: t.ink }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold tracking-[-0.01em] text-[#1C1E21] leading-tight truncate">{step.label}</p>
                  <p className="text-[11.5px] leading-tight mt-0.5 truncate" style={{ color: running ? t.ink : "#9CA3AF" }}>
                    {running ? "resolving…" : step.detail}
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
                  <Loader2 className={`w-4 h-4 flex-shrink-0 ${reduceMotion ? "" : "animate-spin"}`} style={{ color: t.ink }} />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
