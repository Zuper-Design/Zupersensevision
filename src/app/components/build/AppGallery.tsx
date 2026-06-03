import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  CalendarClock,
  Truck,
  AlertTriangle,
  Receipt,
  Users,
  FileText,
  Wrench,
  Package,
  Clock,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { MY_APPS, type BuildApp } from "./buildData";

interface AppGalleryProps {
  onOpenApp: (app: BuildApp) => void;
  onNewApp: () => void;
}

// ── Module → archetype mapping for thumbnails ───────────────────────────
type Archetype = "dispatch" | "cockpit" | "kanban" | "table";

function archetypeFor(module: string): Archetype {
  switch (module) {
    case "Jobs":
    case "Schedule":
      return "dispatch";
    case "Invoices":
    case "Customers":
      return "cockpit";
    case "Quotes":
      return "kanban";
    case "Assets":
    case "Inventory":
    default:
      return "table";
  }
}

// ── Filter pills ─────────────────────────────────────────────────────────
const MODULES = [
  "All",
  "Jobs",
  "Invoices",
  "Quotes",
  "Assets",
  "Schedule",
  "Customers",
  "Inventory",
] as const;

// Per-module accent + soft gradient field behind the floating card.
interface ModuleTheme {
  accent: string;
  iconBg: string;
  grad: string; // background gradient for thumbnail field
}
const MODULE_THEME: Record<string, ModuleTheme> = {
  Jobs:      { accent: "#FD5000", iconBg: "#FFEDE4", grad: "linear-gradient(135deg, #FBEEE8 0%, #FFF6F1 55%, #FFFFFF 100%)" },
  Schedule:  { accent: "#4A90D9", iconBg: "#E4EFFA", grad: "linear-gradient(135deg, #E8F0FA 0%, #F2F7FC 55%, #FFFFFF 100%)" },
  Invoices:  { accent: "#16A34A", iconBg: "#E4F6EC", grad: "linear-gradient(135deg, #E9F5EE 0%, #F3FAF6 55%, #FFFFFF 100%)" },
  Customers: { accent: "#7C5CE0", iconBg: "#ECE6FB", grad: "linear-gradient(135deg, #EFE9FB 0%, #F6F2FD 55%, #FFFFFF 100%)" },
  Quotes:    { accent: "#C026D3", iconBg: "#F7E4FB", grad: "linear-gradient(135deg, #F2E6F7 0%, #F9F1FC 55%, #FFFFFF 100%)" },
  Assets:    { accent: "#0891B2", iconBg: "#DEF3F8", grad: "linear-gradient(135deg, #E4F2F6 0%, #F0F8FB 55%, #FFFFFF 100%)" },
  Inventory: { accent: "#CA8A04", iconBg: "#FAF1D9", grad: "linear-gradient(135deg, #F7F0DE 0%, #FBF7EC 55%, #FFFFFF 100%)" },
};
function themeFor(module: string): ModuleTheme {
  return MODULE_THEME[module] ?? MODULE_THEME.Jobs;
}
function accentFor(module: string): string {
  return themeFor(module).accent;
}

// Module → lucide icon for the in-thumbnail content rows
const MODULE_ICON: Record<string, typeof Truck> = {
  Jobs: Truck,
  Schedule: CalendarClock,
  Invoices: Receipt,
  Customers: Users,
  Quotes: FileText,
  Assets: Wrench,
  Inventory: Package,
};

// ── Rich composed thumbnails — floating glassy card on a gradient field ─────

// Dispatch / Schedule: a list card with brand icon rows (ref #2 "Activity")
function ListCardThumb({ app }: { app: BuildApp }) {
  const t = themeFor(app.module);
  const Icon = MODULE_ICON[app.module] ?? Truck;
  const rowAccents = ["#4A90D9", "#16A34A", "#FD5000"];
  return (
    <div
      className="absolute left-7 right-3 top-7 rounded-[16px] bg-white/85 backdrop-blur-sm px-3.5 py-3"
      style={{ boxShadow: "0 1px 2px rgba(28,30,33,0.05), 0 18px 36px -22px rgba(28,30,33,0.4)" }}
    >
      <p className="text-[12px] font-semibold tracking-[-0.02em] text-[#1C2A3A] mb-2.5">
        {app.module === "Schedule" ? "Today" : "Activity"}
      </p>
      <div className="space-y-2">
        {[0, 1, 2].map((i) => {
          const RowIcon = i === 0 ? Icon : i === 1 ? Users : Clock;
          return (
            <div key={i} className="flex items-center gap-2.5">
              <RowIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: rowAccents[i] }} />
              <span className="h-1.5 rounded-full bg-[#E5E7EB]" style={{ width: `${[62, 78, 46][i]}%` }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Invoices / Customers / Inventory / Assets: a metric "wallet" card (ref #3)
function MetricCardThumb({ app }: { app: BuildApp }) {
  const t = themeFor(app.module);
  const metric =
    app.module === "Invoices" ? "$3.9M overdue"
    : app.module === "Customers" ? "12 at-risk"
    : app.module === "Inventory" ? "7 low-stock"
    : "9 due soon";
  return (
    <div
      className="absolute left-5 right-5 top-6 rounded-[16px] bg-white/85 backdrop-blur-sm px-4 py-3.5"
      style={{ boxShadow: "0 1px 2px rgba(28,30,33,0.05), 0 18px 36px -22px rgba(28,30,33,0.4)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: `radial-gradient(circle at 30% 30%, ${t.accent}, ${t.accent}99)` }}
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#9CA3AF]">Since yesterday</span>
      </div>
      <p className="text-[16px] font-semibold tracking-[-0.03em] text-[#1C2A3A] leading-tight">
        {metric}
      </p>
      <div className="mt-2.5 inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-white"
        style={{ boxShadow: "0 1px 2px rgba(28,30,33,0.08)" }}>
        <span className="text-[10px] font-medium text-[#374151]">Get details</span>
        <ArrowUpRight className="w-3 h-3 text-[#9CA3AF]" />
      </div>
    </div>
  );
}

// Quotes: an AI "generating" chat card (ref #1 "Reply suggestions")
function ChatCardThumb({ app }: { app: BuildApp }) {
  const t = themeFor(app.module);
  return (
    <>
      {/* faded prior bubbles */}
      <div className="absolute right-3 top-6 h-6 rounded-full bg-white/55 backdrop-blur-sm" style={{ width: "62%" }} />
      <div className="absolute right-3 top-[52px] h-6 rounded-full bg-white/75 backdrop-blur-sm" style={{ width: "74%" }} />
      {/* generating pill */}
      <div
        className="absolute left-6 right-5 top-[78px] h-9 rounded-full bg-white flex items-center gap-2.5 px-3"
        style={{ boxShadow: "0 1px 2px rgba(28,30,33,0.06), 0 14px 30px -18px rgba(124,92,224,0.5)" }}
      >
        <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: t.accent }} />
        <span className="w-px h-4 bg-[#E5E7EB]" />
        <span className="text-[11px] font-medium" style={{ color: t.accent }}>Generating reply…</span>
      </div>
    </>
  );
}

function Thumbnail({ app }: { app: BuildApp }) {
  const a = archetypeFor(app.module);
  if (a === "kanban") return <ChatCardThumb app={app} />;
  if (a === "cockpit" || a === "table") return <MetricCardThumb app={app} />;
  return <ListCardThumb app={app} />;
}

// ── App card ───────────────────────────────────────────────────────────────
function AppCard({ app, onOpen }: { app: BuildApp; onOpen: () => void }) {
  const t = themeFor(app.module);
  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-[24px] bg-white border border-[#E8EAEE] overflow-hidden hover:-translate-y-1 transition-all duration-200"
      style={{ boxShadow: "0 1px 3px rgba(28,30,33,0.06)" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(28,30,33,0.06), 0 24px 48px -28px rgba(28,30,33,0.35)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(28,30,33,0.06)")}
    >
      {/* Thumbnail — gradient field with a floating glassy card */}
      <div
        className="relative h-[150px] w-full overflow-hidden border-b border-[#EEF0F3]"
        style={{ background: t.grad }}
      >
        {/* soft ambient blob */}
        <div
          className="absolute -bottom-8 -right-6 w-32 h-32 rounded-full opacity-40 blur-2xl"
          style={{ background: t.accent }}
        />
        <Thumbnail app={app} />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base leading-none flex-shrink-0">{app.icon}</span>
          <span className="text-[14px] font-semibold tracking-[-0.01em] text-[#111315] leading-tight truncate">
            {app.name}
          </span>
        </div>
        <p className="text-[11px] font-mono text-[#9CA3AF]">
          {app.module} · v{app.version}
        </p>
        <p className="text-[12px] text-[#6B7280] leading-snug line-clamp-2 mt-1">
          {app.description}
        </p>
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F0F2F4]">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: app.lifecycle === "published" ? "#ECFDF5" : "#F3F4F6",
              color: app.lifecycle === "published" ? "#15803D" : "#6B7280",
            }}
          >
            {app.lifecycle}
          </span>
          <span className="ml-auto text-[10.5px] text-[#9CA3AF]">{app.updated}</span>
        </div>
      </div>
    </button>
  );
}

// ── New App card ─────────────────────────────────────────────────────────
function NewAppCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center gap-3 rounded-[24px] bg-white/40 border-2 border-dashed border-[#D4D8DF] min-h-[260px] hover:-translate-y-1 hover:border-[#FD5000] hover:bg-white transition-all duration-200"
    >
      <span className="w-12 h-12 rounded-full border border-[#E4E7EC] bg-white flex items-center justify-center text-[#9CA3AF] group-hover:text-[#FD5000] group-hover:border-[#FD5000] transition-colors">
        <Plus className="w-5 h-5" />
      </span>
      <span className="text-[13px] font-semibold tracking-[-0.01em] text-[#374151]">
        Build a new app
      </span>
    </button>
  );
}

// ── Gallery ────────────────────────────────────────────────────────────────
export function AppGallery({ onOpenApp, onNewApp }: AppGalleryProps) {
  const [query, setQuery] = useState("");
  const [activeModule, setActiveModule] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MY_APPS.filter((app) => {
      const moduleMatch = activeModule === "All" || app.module === activeModule;
      if (!moduleMatch) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeModule]);

  return (
    <div
      className="min-h-full flex flex-col px-8 pt-10 pb-12"
      style={{
        backgroundColor: "#F4F4F2",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(28,30,33,0.055) 1px, transparent 0)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="w-full max-w-[1080px] mx-auto flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-[#111315]">
              App Gallery
            </h2>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              Every app in your workspace
            </p>
          </div>
          <div className="relative w-[280px] max-w-[40vw]">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search apps…"
              className="w-full h-10 pl-10 pr-4 rounded-full bg-white border border-[#E4E7EC] text-[13px] text-[#111315] placeholder:text-[#B0B8C4] outline-none focus:border-[#B497CF] transition-colors"
              style={{ boxShadow: "0 1px 3px rgba(28,30,33,0.06)" }}
            />
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-7">
          {MODULES.map((m) => {
            const active = m === activeModule;
            return (
              <button
                key={m}
                onClick={() => setActiveModule(m)}
                className="h-8 px-3.5 rounded-full text-[12.5px] font-medium tracking-[-0.01em] transition-all"
                style={{
                  background: active ? "#111315" : "#FFFFFF",
                  color: active ? "#FFFFFF" : "#6B7280",
                  border: active ? "1px solid #111315" : "1px solid #E4E7EC",
                  boxShadow: active ? "none" : "0 1px 2px rgba(28,30,33,0.05)",
                }}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <p className="text-[15px] font-semibold tracking-[-0.02em] text-[#374151]">
              No apps match your search
            </p>
            <p className="text-[13px] text-[#9CA3AF] mt-1">
              Try a different keyword or clear the filter.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setActiveModule("All");
              }}
              className="mt-4 h-8 px-4 rounded-full text-[12.5px] font-medium text-[#374151] bg-white border border-[#E4E7EC] hover:border-[#B497CF] hover:text-[#5B3D7A] transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <NewAppCard onClick={onNewApp} />
            {filtered.map((app) => (
              <AppCard key={app.id} app={app} onOpen={() => onOpenApp(app)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
