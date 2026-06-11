import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  Clock,
  Download,
  FileText,
  Package,
  Receipt,
  Sparkles,
  Star,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { PUBLIC_APPS, type PublicApp } from "./buildData";
import { token } from "./tokens";
import { springs, easings } from "./motion";

interface Props {
  // Called when the user clicks "Use as template" — prefills the composer
  // prompt and attaches a thumbnail of the chosen template.
  onUseTemplate: (app: PublicApp) => void;
  // Optional list of app categories to filter the gallery by. Empty/undefined
  // shows every published app.
  filterCategories?: readonly string[];
  // Hide the built-in section header (title + description).
  hideHeader?: boolean;
}

// Small square preview of a template — used as an attachment chip in the
// composer prompt box once a template is picked.
export function TemplateThumb({
  app,
  className = "",
}: {
  app: PublicApp;
  className?: string;
}) {
  const t = themeFor(app.category);
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: t.grad }}
    >
      <div
        className="absolute -bottom-4 -right-3 h-16 w-16 rounded-full opacity-40 blur-xl"
        style={{ background: t.accent }}
      />
      {/* scaled-down mock so the full thumbnail fits the small square */}
      <div className="absolute inset-0 origin-top-left scale-[0.34]" style={{ width: "294%", height: "294%" }}>
        <Thumbnail module={app.category} />
      </div>
    </div>
  );
}

function installLabel(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(n);
}

// ── Module → archetype mapping for thumbnails (from the original gallery) ──
type Archetype = "dispatch" | "cockpit" | "kanban" | "table";

function archetypeFor(category: string): Archetype {
  switch (category) {
    case "Jobs":
    case "Schedule":
    case "Measurement":
      return "dispatch";
    case "Invoices":
    case "Customers":
    case "Commission":
      return "cockpit";
    case "Quotes":
      return "kanban";
    case "Assets":
    case "Inventory":
    default:
      return "table";
  }
}

// Per-module accent + soft gradient field behind the floating card.
interface ModuleTheme {
  accent: string;
  grad: string;
}
const MODULE_THEME: Record<string, ModuleTheme> = {
  Jobs:      { accent: "#000000", grad: "linear-gradient(135deg, #FBEEE8 0%, #FFF6F1 55%, #FFFFFF 100%)" },
  Schedule:  { accent: "#4A90D9", grad: "linear-gradient(135deg, #E8F0FA 0%, #F2F7FC 55%, #FFFFFF 100%)" },
  Invoices:  { accent: "#000000", grad: "linear-gradient(135deg, #E9F5EE 0%, #F3FAF6 55%, #FFFFFF 100%)" },
  Customers: { accent: "#636363", grad: "linear-gradient(135deg, #EFE9FB 0%, #F6F2FD 55%, #FFFFFF 100%)" },
  Quotes:    { accent: "#636363", grad: "linear-gradient(135deg, #F2E6F7 0%, #F9F1FC 55%, #FFFFFF 100%)" },
  Assets:    { accent: "#0891B2", grad: "linear-gradient(135deg, #E4F2F6 0%, #F0F8FB 55%, #FFFFFF 100%)" },
  Inventory: { accent: "#636363", grad: "linear-gradient(135deg, #F7F0DE 0%, #FBF7EC 55%, #FFFFFF 100%)" },
  Measurement: { accent: "#000000", grad: "linear-gradient(135deg, #FBEEE8 0%, #FFF6F1 55%, #FFFFFF 100%)" },
  Commission:  { accent: "#636363", grad: "linear-gradient(135deg, #EFE9FB 0%, #F6F2FD 55%, #FFFFFF 100%)" },
};
function themeFor(category: string): ModuleTheme {
  return MODULE_THEME[category] ?? MODULE_THEME.Jobs;
}

const MODULE_ICON: Record<string, typeof Truck> = {
  Jobs: Truck,
  Schedule: CalendarClock,
  Invoices: Receipt,
  Customers: Users,
  Quotes: FileText,
  Assets: Wrench,
  Inventory: Package,
};

// ── Rich composed thumbnails — floating glassy card on a gradient field ────

function ListCardThumb({ module }: { module: string }) {
  const Icon = MODULE_ICON[module] ?? Truck;
  const rowAccents = ["#4A90D9", "#000000", "#000000"];
  return (
    <div
      className="absolute left-7 right-3 top-7 rounded-[16px] bg-white/85 px-3.5 py-3 backdrop-blur-sm"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 18px 36px -22px rgba(0,0,0,0.4)" }}
    >
      <p className="mb-2.5 text-[12px] font-medium tracking-[-0.02em] text-[#1C2A3A]">
        {module === "Schedule" ? "Today" : "Activity"}
      </p>
      <div className="space-y-2">
        {[0, 1, 2].map((i) => {
          const RowIcon = i === 0 ? Icon : i === 1 ? Users : Clock;
          return (
            <div key={i} className="flex items-center gap-2.5">
              <RowIcon className="h-3.5 w-3.5 flex-shrink-0" style={{ color: rowAccents[i] }} />
              <span className="h-1.5 rounded-full bg-[#E5E7EB]" style={{ width: `${[62, 78, 46][i]}%` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricCardThumb({ module }: { module: string }) {
  const t = themeFor(module);
  const metric =
    module === "Invoices" ? "$3.9M overdue"
    : module === "Customers" ? "12 at-risk"
    : module === "Inventory" ? "7 low-stock"
    : "9 due soon";
  return (
    <div
      className="absolute left-5 right-5 top-6 rounded-[16px] bg-white/85 px-4 py-3.5 backdrop-blur-sm"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 18px 36px -22px rgba(0,0,0,0.4)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: `radial-gradient(circle at 30% 30%, ${t.accent}, ${t.accent}99)` }}
        >
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#959595]">Since yesterday</span>
      </div>
      <p className="text-[16px] font-medium leading-tight tracking-[-0.03em] text-[#1C2A3A]">
        {metric}
      </p>
      <div
        className="mt-2.5 inline-flex h-6 items-center gap-1 rounded-full bg-white px-2.5"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
      >
        <span className="text-[10px] font-medium text-[#636363]">Get details</span>
        <ArrowUpRight className="h-3 w-3 text-[#959595]" />
      </div>
    </div>
  );
}

function ChatCardThumb({ module }: { module: string }) {
  const t = themeFor(module);
  return (
    <>
      <div className="absolute right-3 top-6 h-6 rounded-full bg-white/55 backdrop-blur-sm" style={{ width: "62%" }} />
      <div className="absolute right-3 top-[52px] h-6 rounded-full bg-white/75 backdrop-blur-sm" style={{ width: "74%" }} />
      <div
        className="absolute left-6 right-5 top-[78px] flex h-9 items-center gap-2.5 rounded-full bg-white px-3"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 14px 30px -18px rgba(124,92,224,0.5)" }}
      >
        <Sparkles className="h-3.5 w-3.5 flex-shrink-0" style={{ color: t.accent }} />
        <span className="h-4 w-px bg-[#E5E7EB]" />
        <span className="text-[11px] font-medium" style={{ color: t.accent }}>Generating reply…</span>
      </div>
    </>
  );
}

function Thumbnail({ module }: { module: string }) {
  const a = archetypeFor(module);
  if (a === "kanban") return <ChatCardThumb module={module} />;
  if (a === "cockpit" || a === "table") return <MetricCardThumb module={module} />;
  return <ListCardThumb module={module} />;
}

// Full-size preview thumbnail (gradient field + composed mock) keyed on the
// app's module/category — reused for the "My apps" project cards.
export function AppPreviewThumb({
  module,
  className = "",
}: {
  module: string;
  className?: string;
}) {
  const t = themeFor(module);
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: t.grad }}>
      <div
        className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{ background: t.accent }}
      />
      <Thumbnail module={module} />
    </div>
  );
}

function PublicAppCard({ app, onOpen }: { app: PublicApp; onOpen: () => void }) {
  const t = themeFor(app.category);
  return (
    <div className="group relative">
      {/* prism under-glow — the gallery floats on soft spectrum light;
          brightens as the card lifts */}
      <div
        aria-hidden
        className="absolute -inset-x-2 bottom-0 top-6 -z-[1] rounded-[28px] opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-55"
        style={{ background: "var(--gradient-prism)" }}
      />
      <motion.button
        type="button"
        onClick={onOpen}
        layoutId={`pub-card-${app.id}`}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.985 }}
        transition={springs.bouncy}
        className="w-full overflow-hidden rounded-2xl text-left"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: token.elev[1],
          borderRadius: 20,
        }}
      >
      {/* Thumbnail — gradient field with a floating glassy card */}
      <motion.div
        layoutId={`pub-thumb-${app.id}`}
        className="relative h-[150px] w-full overflow-hidden border-b border-[rgba(0,0,0,0.05)]"
        style={{ background: t.grad }}
      >
        <div
          className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full opacity-40 blur-2xl"
          style={{ background: t.accent }}
        />
        <Thumbnail module={app.category} />
      </motion.div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex-shrink-0 text-base leading-none">{app.icon}</span>
          <span className="truncate text-[14px] font-medium leading-tight tracking-[-0.01em] text-[#000000]">
            {app.name}
          </span>
        </div>
        <p className="text-[11px] text-[#959595]">by {app.company}</p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-[#636363]">
          {app.blurb}
        </p>
        <div className="mt-3 flex items-center gap-2 border-t border-[rgba(0,0,0,0.05)] pt-3 text-[10.5px] text-[#959595]">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#000000] text-[#000000]" />
            {app.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Download className="h-3 w-3" />
            {installLabel(app.installs)}
          </span>
          <span className="ml-auto">{app.category}</span>
        </div>
      </div>
      </motion.button>
    </div>
  );
}

function PreviewModal({
  app,
  onClose,
  onUseTemplate,
}: {
  app: PublicApp;
  onClose: () => void;
  onUseTemplate: () => void;
}) {
  const t = themeFor(app.category);
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: easings.exit }}
        className="fixed inset-0 z-[450] bg-black/25 backdrop-blur-[6px]"
        onClick={onClose}
      />
      {/* flex container centers the panel without translate transforms so the
          shared-element layout zoom from the gallery card stays continuous */}
      <div
        className="pointer-events-none fixed inset-0 z-[460] flex items-center justify-center p-4"
      >
      <motion.div
        layoutId={`pub-card-${app.id}`}
        transition={springs.bouncy}
        className="pointer-events-auto w-[480px] max-w-[calc(100vw-32px)] overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 32px 90px rgba(0,0,0,0.22)",
          borderRadius: 30,
        }}
      >
        {/* Hero thumbnail — same shared element as the card's thumb */}
        <motion.div
          layoutId={`pub-thumb-${app.id}`}
          transition={springs.bouncy}
          className="relative h-[140px] w-full overflow-hidden border-b border-[rgba(0,0,0,0.05)]"
          style={{ background: t.grad }}
        >
          <div
            className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full opacity-40 blur-2xl"
            style={{ background: t.accent }}
          />
          <Thumbnail module={app.category} />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-white/80 text-[#636363] backdrop-blur-sm hover:bg-white"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, delay: 0.06 }}
          className="max-h-[52vh] space-y-4 overflow-y-auto p-5"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{app.icon}</span>
              <h3 className="text-[16px] font-medium leading-tight tracking-[-0.01em] text-[#000000]">
                {app.name}
              </h3>
            </div>
            <p className="mt-1 text-[12px] text-[#959595]">
              by {app.company} · {app.author}
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11.5px] text-[#959595]">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-[#000000] text-[#000000]" />
              {app.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Download className="h-3.5 w-3.5" />
              {installLabel(app.installs)} installs
            </span>
            {/* category = token.status.neutral */}
            <span className="rounded-full bg-[#F0F0F0] px-2 py-0.5 text-[#636363]">
              {app.category}
            </span>
          </div>

          <p className="text-[13px] leading-[1.55] text-[#636363]">
            {app.description}
          </p>

          <div>
            <p className="mb-2 text-[12px] font-medium text-[#000000]">What it does</p>
            <ul className="space-y-1.5">
              {app.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[12.5px] text-[#636363]">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#000000]" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-[#FAFAFA] p-3">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.04em] text-[#959595]">
              Starting prompt
            </p>
            <p className="text-[12.5px] leading-[1.5] text-[#636363]">{app.prompt}</p>
          </div>
        </motion.div>

        <div className="flex items-center justify-end gap-2 border-t border-[rgba(0,0,0,0.08)] px-5 py-3.5">
          <button
            onClick={onClose}
            className="h-9 rounded-full px-4 text-[13px] font-medium text-[#636363] transition-colors hover:text-[#000000]"
          >
            Cancel
          </button>
          <button
            onClick={onUseTemplate}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#000000] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#000000]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Use as template
          </button>
        </div>
      </motion.div>
      </div>
    </>
  );
}

export function PublicAppGallery({
  onUseTemplate,
  filterCategories,
  hideHeader,
}: Props) {
  const [preview, setPreview] = useState<PublicApp | null>(null);

  const apps =
    filterCategories && filterCategories.length
      ? PUBLIC_APPS.filter((a) => filterCategories.includes(a.category))
      : PUBLIC_APPS;

  return (
    <div className="w-full">
      {!hideHeader && (
        /* Section header — Sense `display` type token (26px / -0.025em), not
           the Build. hero treatment. No accent dot. */
        <div className="mb-7 border-b border-[rgba(0,0,0,0.05)] pb-5">
          <h2
            className="font-medium text-[#000000]"
            style={{ fontSize: token.type.display.size, letterSpacing: token.type.display.tracking }}
          >
            Or choose from our app gallery
          </h2>
          <p className="mt-1.5 max-w-[58ch] text-[13px] leading-[1.45] text-[#636363]">
            Ready-made apps published by other teams — preview one and make it
            your own in a click.
          </p>
        </div>
      )}

      {apps.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-[#959595]">
          No published apps in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {apps.map((app) => (
            <PublicAppCard
              key={app.id}
              app={app}
              onOpen={() => setPreview(app)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {preview && (
          <PreviewModal
            app={preview}
            onClose={() => setPreview(null)}
            onUseTemplate={() => {
              onUseTemplate(preview);
              setPreview(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
