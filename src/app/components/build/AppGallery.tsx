import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  FileText,
  Layers3,
  Package,
  Plus,
  Receipt,
  Search,
  Truck,
  Users,
  Wrench,
} from "lucide-react";
import { MY_APPS, type BuildApp } from "./buildData";
import { token } from "./tokens";

interface AppGalleryProps {
  onOpenApp: (app: BuildApp) => void;
  onNewApp: () => void;
}

const MODULES = [
  "All",
  "Jobs",
  "Invoices",
  "Quotes",
  "Schedule",
  "Customers",
  "Assets",
  "Inventory",
] as const;

const MODULE_ICON: Record<string, typeof Truck> = {
  Jobs: Truck,
  Schedule: CalendarClock,
  Invoices: Receipt,
  Customers: Users,
  Quotes: FileText,
  Assets: Wrench,
  Inventory: Package,
};

const MODULE_ACCENT: Record<string, string> = {
  Jobs: "#FD5000",
  Schedule: "#2563EB",
  Invoices: "#059669",
  Customers: "#7C3AED",
  Quotes: "#DB2777",
  Assets: "#0891B2",
  Inventory: "#B45309",
};

function ownerInitials(owner: string) {
  return owner
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function moduleCount(module: string) {
  if (module === "All") return MY_APPS.length;
  return MY_APPS.filter((app) => app.module === module).length;
}

function AppRow({ app, onOpen }: { app: BuildApp; onOpen: () => void }) {
  const Icon = MODULE_ICON[app.module] ?? Layers3;
  const accent = MODULE_ACCENT[app.module] ?? "#FD5000";
  const isLive = app.lifecycle === "published";

  return (
    <tr
      onClick={onOpen}
      className="group cursor-pointer border-b border-[#F0F0F2] transition-colors last:border-0 hover:bg-[#FAFAFA]"
    >
      <td className="px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px]"
            style={{
              background: `color-mix(in srgb, ${accent} 12%, white)`,
              color: accent,
            }}
          >
            <Icon className="h-[18px] w-[18px]" strokeWidth={2.15} />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-medium tracking-[-0.01em] text-[#1C1E21]">
              {app.name}
            </div>
            <div className="truncate text-[12px] text-[#9CA3AF] sm:hidden">
              {app.module} · {app.owner}
            </div>
          </div>
        </div>
      </td>

      <td className="hidden px-5 py-3.5 text-[13px] text-[#6B7280] sm:table-cell">
        {app.module}
      </td>

      <td className="hidden px-5 py-3.5 md:table-cell">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1C1E21] text-[10px] font-semibold text-white">
            {ownerInitials(app.owner)}
          </span>
          <span className="text-[13px] text-[#6B7280]">{app.owner}</span>
        </div>
      </td>

      <td className="px-5 py-3.5">
        {/* Live = token.status.success · Draft = token.status.neutral */}
        <span
          className="inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium"
          style={{
            background: isLive ? token.status.success.bg : token.status.neutral.bg,
            color: isLive ? token.status.success.fg : token.status.neutral.fg,
          }}
        >
          {isLive ? "Live" : "Draft"}
        </span>
      </td>

      <td className="hidden px-5 py-3.5 text-[13px] text-[#9CA3AF] lg:table-cell">
        {app.updated}
      </td>

      <td className="px-5 py-3.5 text-right">
        <ArrowUpRight className="ml-auto h-[18px] w-[18px] text-[#1C1E21] opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
      </td>
    </tr>
  );
}

export function AppGallery({ onOpenApp, onNewApp }: AppGalleryProps) {
  const [query, setQuery] = useState("");
  const [activeModule, setActiveModule] = useState<string>("All");

  const liveCount = MY_APPS.filter((app) => app.lifecycle === "published").length;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return MY_APPS.filter((app) => {
      const moduleMatch = activeModule === "All" || app.module === activeModule;
      if (!moduleMatch) return false;
      if (!q) return true;

      return (
        app.name.toLowerCase().includes(q) ||
        app.module.toLowerCase().includes(q) ||
        app.owner.toLowerCase().includes(q)
      );
    });
  }, [activeModule, query]);

  const draftCount = MY_APPS.length - liveCount;
  const moduleSpan = new Set(MY_APPS.map((app) => app.module)).size;

  const summary: { label: string; value: number; hint: string; Icon: typeof Layers3 }[] = [
    { label: "Total apps", value: MY_APPS.length, hint: "Across all modules", Icon: Layers3 },
    { label: "Live", value: liveCount, hint: "Published to workspace", Icon: ArrowUpRight },
    { label: "Drafts", value: draftCount, hint: "Personal, not published", Icon: FileText },
    { label: "Modules", value: moduleSpan, hint: "Covered by your apps", Icon: Package },
  ];

  return (
    <main className="min-h-full bg-[#F4F4F2] px-4 py-6 text-[#1C1E21] sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-[1240px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="font-semibold leading-none text-[#1C1E21]"
              style={{ fontSize: token.type.display.size, letterSpacing: token.type.display.tracking }}
            >
              Apps
            </h1>
            <p className="mt-2 text-[13px] text-[#6B7280]">
              Operational tools for dispatch, revenue, customers, and field teams.
            </p>
          </div>
          <button
            type="button"
            onClick={onNewApp}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#1C1E21] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#FD5000]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.4} />
            New app
          </button>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {summary.map(({ label, value, hint, Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-[#E6E8EC] bg-white p-4"
              style={{ boxShadow: token.elev[1] }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-[#6B7280]">{label}</span>
                <Icon className="h-4 w-4 text-[#9CA3AF]" strokeWidth={2.1} />
              </div>
              <div className="mt-3 text-[28px] font-semibold leading-none tracking-[-0.045em] text-[#1C1E21]">
                {value}
              </div>
              <div className="mt-2 text-[11px] text-[#9CA3AF]">{hint}</div>
            </div>
          ))}
        </section>

        <section className="mt-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 lg:w-[320px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search apps"
                className="h-10 w-full rounded-full border border-[#E6E8EC] bg-white pl-10 pr-4 text-[13px] text-[#1C1E21] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#FD5000]/60"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {MODULES.map((module) => {
                const active = module === activeModule;

                return (
                  <button
                    key={module}
                    type="button"
                    onClick={() => setActiveModule(module)}
                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-[12px] font-medium transition-colors"
                    style={{
                      background: active ? "#1C1E21" : "#FFFFFF",
                      borderColor: active ? "#1C1E21" : "#E6E8EC",
                      color: active ? "#FFFFFF" : "#6B7280",
                    }}
                  >
                    {module}
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px]"
                      style={{
                        background: active ? "rgba(255,255,255,0.16)" : "#F3F4F6",
                        color: active ? "#FFFFFF" : "#6B7280",
                      }}
                    >
                      {moduleCount(module)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length > 0 ? (
            <div
              className="mt-5 overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white"
              style={{ boxShadow: token.elev[1] }}
            >
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[#F0F0F2] text-[11px] font-medium uppercase tracking-[0.04em] text-[#9CA3AF]">
                    <th className="px-5 py-3 font-medium">App</th>
                    <th className="hidden px-5 py-3 font-medium sm:table-cell">Module</th>
                    <th className="hidden px-5 py-3 font-medium md:table-cell">Owner</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="hidden px-5 py-3 font-medium lg:table-cell">Updated</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <AppRow key={app.id} app={app} onOpen={() => onOpenApp(app)} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-5 flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-[#C9CDD4] bg-white/65 px-5 text-center">
              <div>
                <div className="text-[15px] font-semibold tracking-[-0.02em] text-[#1C1E21]">
                  No matching apps
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActiveModule("All");
                  }}
                  className="mt-4 h-9 rounded-full border border-[#E6E8EC] px-4 text-[12px] font-medium text-[#6B7280] transition-colors hover:border-[#FD5000]/50 hover:text-[#FD5000]"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
