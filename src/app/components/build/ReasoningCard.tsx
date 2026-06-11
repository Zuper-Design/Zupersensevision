import { motion, AnimatePresence } from "motion/react";
import {
  Loader2,
  Check,
  Database,
  Briefcase,
  Users,
  FileText,
  LayoutGrid,
  Package,
} from "lucide-react";
import { CLARIFY_PLAN } from "./buildData";

// monochrome icon per module — the reference keeps icons neutral, not tinted
const MODULE_ICON: Record<string, typeof Database> = {
  Schema: Database,
  Jobs: Briefcase,
  Technicians: Users,
  Quotes: FileText,
  Measurement: LayoutGrid,
  Materials: Package,
  Templates: LayoutGrid,
};
const moduleIcon = (m: string) => MODULE_ICON[m] ?? Database;

// Flat reasoning step-list. Renders a lead "Context gathered" row plus one row
// per plan step, each in a done / active / pending visual state — no card chrome.
// `active` = still gathering (the lead row spins); false = fully resolved.
export function ReasoningCard({
  planStep,
  planStarted,
  active,
  reduceMotion = false,
}: {
  reasonLine?: number;
  planStep: number;
  planStarted: boolean;
  active: boolean;
  reduceMotion?: boolean;
}) {
  // build the row list: a lead status row + each plan step
  const total = CLARIFY_PLAN.length;
  const leadDone = !active || planStep >= total;
  const passed = Math.min(planStep, total);
  const checkingDone = passed >= total;

  type RowState = "done" | "active" | "pending";

  return (
    // outer container — subtle fill, 1px top/left/right, more padding at bottom
    // so the "Gathering context" footer sits inside the same surface.
    <div
      className="rounded-[20px] px-px pb-px"
      style={{ background: "#F0F0F0" }}
    >
      {/* status row — at the top, indented to match the inner card rows */}
      <div className="flex items-center px-4 py-2.5">
        <p className="text-[12.5px] text-[#636363] leading-tight">
          <span
            className={
              "font-medium " +
              (checkingDone || reduceMotion
                ? "text-[#636363]"
                : "text-shimmer")
            }
          >
            {checkingDone ? "Gathered context" : "Gathering context"}
          </span>
          {" — "}
          {passed} of {total} sources read
        </p>
      </div>

      {/* inner container — white, rounded, drop shadow; houses the step list */}
      <div
        className="flex flex-col gap-3.5 rounded-[19px] bg-white px-4 py-3.5"
        style={{ boxShadow: "0 0 0 1px rgba(28,30,33,0.04), 0 1px 2px rgba(28,30,33,0.04), 0 10px 24px -16px rgba(28,30,33,0.2)" }}
      >
        {/* lead row — overall gather status */}
        <Row
          label={leadDone ? "Context gathered" : "Gathering context…"}
          state={leadDone ? "done" : "active"}
          delayIndex={0}
          animateIn={active}
          reduceMotion={reduceMotion}
        />

        {CLARIFY_PLAN.map((step, i) => {
          const state: RowState =
            i < planStep
              ? "done"
              : planStarted && i === planStep && active
                ? "active"
                : "pending";
          const Icon = moduleIcon(step.module);
          return (
            <Row
              key={step.label}
              label={step.label}
              boldPart={step.boldPart}
              state={state}
              Icon={Icon}
              delayIndex={i + 1}
              animateIn={active}
              reduceMotion={reduceMotion}
            />
          );
        })}
      </div>
    </div>
  );
}

// split a label so only `part` is bold; renders the rest in normal weight
function renderActiveLabel(label: string, part?: string) {
  if (!part) return <span className="font-medium">{label}</span>;
  const idx = label.indexOf(part);
  if (idx === -1) return <span className="font-medium">{label}</span>;
  return (
    <>
      {label.slice(0, idx)}
      <span className="font-medium text-[#000000]">{part}</span>
      {label.slice(idx + part.length)}
    </>
  );
}

function Row({
  label,
  boldPart,
  state,
  Icon,
  delayIndex = 0,
  animateIn = true,
  reduceMotion,
}: {
  label: string;
  boldPart?: string;
  state: "done" | "active" | "pending";
  Icon?: typeof Database;
  delayIndex?: number;
  animateIn?: boolean;
  reduceMotion?: boolean;
}) {
  // Only cascade rows in while context is actively gathering. A resolved card
  // (revisited / already done) renders instantly — no replayed stagger.
  const entrance =
    animateIn && !reduceMotion
      ? {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.28,
            ease: [0.23, 1, 0.32, 1] as const,
            delay: Math.min(delayIndex * 0.05, 0.3),
          },
        }
      : { initial: false as const, animate: { opacity: 1, y: 0 } };

  return (
    <motion.div {...entrance} className="flex items-center gap-2.5">
      {/* status dot — a single morphing circle (color animates between states),
          with only the inner glyph crossfading. The row owns the entrance, so
          the dot never runs a competing mount animation. */}
      <motion.span
        className="relative w-[22px] h-[22px] flex-shrink-0 rounded-full flex items-center justify-center"
        initial={false}
        animate={{
          backgroundColor:
            state === "done"
              ? "#000000"
              : state === "active"
                ? "#000000"
                : "#FFFFFF",
          boxShadow:
            state === "pending"
              ? "inset 0 0 0 1.5px rgba(0,0,0,0.08)"
              : "inset 0 0 0 0px rgba(227,229,232,0)",
        }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      >
        <AnimatePresence initial={false} mode="wait">
          {state === "done" ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.span>
          ) : state === "active" ? (
            <motion.span
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <Loader2
                className={`w-3.5 h-3.5 text-white ${reduceMotion ? "" : "animate-spin"}`}
              />
            </motion.span>
          ) : (
            <motion.span
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              {Icon ? (
                <Icon className="w-3 h-3 text-[#D9D9D9]" />
              ) : (
                <span className="block w-1.5 h-1.5 rounded-full bg-[#D9D9D9]" />
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>

      {/* label — active row bolds only the loading focus phrase */}
      <span
        className={
          "text-[13.5px] tracking-[-0.01em] leading-tight font-normal transition-colors duration-300 " +
          (state === "active"
            ? "text-[#000000]"
            : state === "done"
              ? "text-[#636363]"
              : "text-[#959595]")
        }
      >
        {state === "active" ? renderActiveLabel(label, boldPart) : label}
      </span>
    </motion.div>
  );
}
