import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  type CSSProperties,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Type, Trash2, MousePointer2, SquareDashedMousePointer } from "lucide-react";
import { token } from "./tokens";

export type ElementKind =
  | "card" | "pane" | "header" | "lane" | "metric"
  | "column" | "table" | "row" | "field" | "chart";

export interface SelectedElement {
  id: string;
  kind: ElementKind;
  label: string;
  rect: { top: number; left: number; width: number; height: number };
}

type Tool = "cursor" | "edit";

interface EditCtx {
  active: boolean;       // editor is available (preview/ready, not viewer)
  tool: Tool;            // cursor → live interactions; edit → element selection
  selectedId: string | null;
  select: (el: SelectedElement | null) => void;
}

const Ctx = createContext<EditCtx | null>(null);
export function useEdit() {
  return useContext(Ctx);
}

// ── Provider — owns tool state, selection, the floating toolbar + popover ───
export function EditProvider({
  active,
  onApply,
  children,
}: {
  active: boolean;
  onApply: (el: SelectedElement, instruction: string) => void;
  children: ReactNode;
}) {
  const [tool, setTool] = useState<Tool>("cursor");
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const select = useCallback((el: SelectedElement | null) => setSelected(el), []);

  const ctx: EditCtx = {
    active,
    tool: active ? tool : "cursor",
    selectedId: selected?.id ?? null,
    select,
  };

  // popover placement: prefer right of the element, flip left if no room
  const POP_W = 232;
  const GAP = 16;
  let popLeft = 0, popTop = 0, side: "right" | "left" = "right";
  if (selected) {
    const c = containerRef.current?.getBoundingClientRect();
    const cw = c?.width ?? 0;
    const r = selected.rect;
    if (r.left + r.width + GAP + POP_W <= cw) {
      popLeft = r.left + r.width + GAP;
      side = "right";
    } else {
      popLeft = Math.max(8, r.left - GAP - POP_W);
      side = "left";
    }
    popTop = Math.max(8, r.top);
  }

  return (
    <Ctx.Provider value={ctx}>
      <div ref={containerRef} className="relative h-full">
        {children}

        {/* floating tool toolbar — cursor / edit */}
        {active && (
          <div
            className="absolute top-3 left-1/2 -translate-x-1/2 z-[260] flex items-center gap-1 p-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: `1px solid ${token.color.border.default}`,
              boxShadow: "0 8px 24px -12px rgba(28,30,33,0.3), 0 1px 2px rgba(28,30,33,0.06)",
              backdropFilter: "blur(8px)",
            }}
          >
            {(
              [
                ["cursor", MousePointer2, "Interact"],
                ["edit", SquareDashedMousePointer, "Edit elements"],
              ] as const
            ).map(([t, Icon, label]) => {
              const on = tool === t;
              return (
                <button
                  key={t}
                  onClick={() => { setTool(t); if (t === "cursor") setSelected(null); }}
                  title={label}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-medium transition-colors"
                  style={{
                    background: on ? "#111315" : "transparent",
                    color: on ? "#FFFFFF" : token.color.text.secondary,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* selection popover — beside the element, with a connector */}
        <AnimatePresence>
          {active && tool === "edit" && selected && (
            <>
              {/* light scrim to defocus the rest, click to dismiss */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.14 }}
                className="absolute inset-0 z-[250]"
                style={{ background: "rgba(255,255,255,0.28)" }}
                onClick={() => setSelected(null)}
              />

              {/* connector dot + line from element edge to popover */}
              <svg className="absolute inset-0 z-[270] pointer-events-none" style={{ overflow: "visible" }}>
                <line
                  x1={side === "right" ? selected.rect.left + selected.rect.width : selected.rect.left}
                  y1={selected.rect.top + 18}
                  x2={side === "right" ? popLeft : popLeft + POP_W}
                  y2={popTop + 18}
                  stroke={token.color.brand.primary}
                  strokeWidth={1.5}
                />
                <circle
                  cx={side === "right" ? selected.rect.left + selected.rect.width : selected.rect.left}
                  cy={selected.rect.top + 18}
                  r={3}
                  fill={token.color.brand.primary}
                />
              </svg>

              <motion.div
                initial={{ opacity: 0, scale: 0.97, x: side === "right" ? -6 : 6 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                className="absolute z-[280] rounded-[14px] overflow-hidden"
                style={{
                  left: popLeft,
                  top: popTop,
                  width: POP_W,
                  background: "#FFFFFF",
                  border: `1px solid ${token.color.border.default}`,
                  boxShadow: "0 12px 32px -12px rgba(28,30,33,0.28), 0 2px 6px -2px rgba(28,30,33,0.08)",
                  transformOrigin: side === "right" ? "left top" : "right top",
                }}
              >
                <div className="flex items-center justify-between px-3.5 h-9 border-b" style={{ borderColor: token.color.border.hairline }}>
                  <span className="text-[11px] font-semibold tracking-[-0.01em]" style={{ color: token.color.text.primary }}>{selected.label}</span>
                  <button onClick={() => setSelected(null)} className="w-5 h-5 rounded flex items-center justify-center text-[#9CA3AF] hover:text-[#374151] transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-1.5">
                  <MenuItem icon={Type} label="Edit text" onClick={() => { onApply(selected, "Edit text"); setSelected(null); }} />
                  <MenuItem icon={Sparkles} label="Edit with AI" accent onClick={() => { onApply(selected, "Edit with AI"); setSelected(null); }} />
                  <MenuItem icon={Trash2} label="Delete" danger onClick={() => { onApply(selected, "Delete"); setSelected(null); }} />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

function MenuItem({
  icon: Icon, label, onClick, accent, danger,
}: {
  icon: typeof Type; label: string; onClick: () => void; accent?: boolean; danger?: boolean;
}) {
  const color = danger ? token.status.danger.fg : accent ? token.color.brand.primary : token.color.text.primary;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-[10px] text-left transition-colors"
      style={{ color }}
      onMouseEnter={e => (e.currentTarget.style.background = danger ? token.status.danger.bg : token.color.bg.muted)}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-[12.5px] font-medium tracking-[-0.01em]">{label}</span>
    </button>
  );
}

// ── Editable — wraps a real canvas element ──────────────────────────────────
// Only intercepts clicks in edit tool. In cursor mode it's a transparent
// passthrough so live drag/click works untouched. Selection draws a thin
// outline only — no heavy ring or shadow.
export function Editable({
  id, kind, label, children, className, style,
}: {
  id: string; kind: ElementKind; label: string;
  children: ReactNode; className?: string; style?: CSSProperties;
}) {
  const ctx = useEdit();
  const ref = useRef<HTMLDivElement>(null);

  if (!ctx || !ctx.active || ctx.tool !== "edit") {
    return <div className={className} style={style}>{children}</div>;
  }

  const isSelected = ctx.selectedId === id;

  const pick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = ref.current;
    const container = el?.offsetParent as HTMLElement | null;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const c = container?.getBoundingClientRect() ?? { top: 0, left: 0 };
    ctx.select({
      id, kind, label,
      rect: { top: r.top - c.top, left: r.left - c.left, width: r.width, height: r.height },
    });
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        position: "relative",
        zIndex: isSelected ? 255 : undefined,
        // ring via box-shadow follows the element's own radius and adds no
        // layout box, so paddings/sizing stay exactly as the live element.
        boxShadow: isSelected
          ? `0 0 0 2px ${token.color.brand.primary}, 0 0 0 6px rgba(218,112,44,0.16)`
          : (style?.boxShadow as string) ?? "none",
        cursor: "pointer",
        transition: "box-shadow 120ms ease",
      }}
      onClick={pick}
      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.boxShadow = `0 0 0 1.5px rgba(218,112,44,0.5)`; }}
      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow = ((style?.boxShadow as string) ?? "none"); }}
    >
      {children}
    </div>
  );
}
