// Shared Build primitives (Spec 2 §2 inventory, §7 a11y, §8 states).
// Generated apps compose from these — never hand-roll a status pill or empty state.
import { AlertTriangle, RefreshCw, Lock, Inbox, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { token, statusFor, type StatusKey } from './tokens';

// ── MetricStat (§2) — single KPI: label, value, delta ─────────────────────
export function MetricStat({ label, value, delta, status }: { label: string; value: string; delta?: { dir: 'up' | 'down'; text: string; good?: boolean }; status?: StatusKey }) {
  const accent = status ? token.status[status] : null;
  return (
    <div className="rounded-[20px] p-3.5 flex-1 min-w-0" style={{ background: token.color.bg.surface, border: '1px solid #FFFFFF', boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
      <p className="text-[11px] font-medium truncate" style={{ color: token.color.text.muted }}>{label}</p>
      <div className="flex items-baseline gap-2 mt-1.5">
        <span className="text-[22px] font-medium tracking-[-0.02em]" style={{ color: accent ? accent.fg : token.color.text.primary }}>{value}</span>
        {delta && (
          <span className="inline-flex items-center gap-0.5 text-[11px] font-medium" style={{ color: delta.good ? token.status.success.fg : token.status.danger.fg }}>
            {delta.dir === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{delta.text}
          </span>
        )}
      </div>
    </div>
  );
}

// ── DataTable (§2) — the default record-list primitive ────────────────────
export interface Column<T> { key: string; header: string; render: (row: T) => React.ReactNode; align?: 'left' | 'right'; mono?: boolean; }
export function DataTable<T extends { id: string }>({ columns, groups, rowAction }: {
  columns: Column<T>[];
  groups: { label: string; status?: StatusKey; rows: T[] }[];
  rowAction?: (row: T) => React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] overflow-hidden" style={{ background: token.color.bg.surface, border: '1px solid #FFFFFF', boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
      <div className="grid items-center px-3 h-9 border-b text-[10.5px] font-mono uppercase tracking-wide"
        style={{ gridTemplateColumns: `${columns.map(c => '1fr').join(' ')}${rowAction ? ' 120px' : ''}`, borderColor: token.color.border.hairline, color: token.color.text.muted }}>
        {columns.map(c => <span key={c.key} className={c.align === 'right' ? 'text-right' : ''}>{c.header}</span>)}
        {rowAction && <span />}
      </div>
      {groups.map(g => (
        <div key={g.label}>
          <div className="flex items-center gap-2 px-3 h-7" style={{ background: token.color.bg.muted, borderBottom: `1px solid ${token.color.border.hairline}` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: g.status ? token.status[g.status].dot : token.color.text.faint }} />
            <span className="text-[11px] font-medium" style={{ color: token.color.text.secondary }}>{g.label}</span>
            <span className="text-[10.5px] font-mono" style={{ color: token.color.text.faint }}>{g.rows.length}</span>
          </div>
          {g.rows.map(row => (
            <div key={row.id} className="grid items-center px-3 h-11 group hover:bg-[#FAFAFA] transition-colors"
              style={{ gridTemplateColumns: `${columns.map(() => '1fr').join(' ')}${rowAction ? ' 120px' : ''}`, borderBottom: `1px solid ${token.color.border.hairline}` }}>
              {columns.map(c => (
                <span key={c.key} className={`text-[12.5px] truncate ${c.align === 'right' ? 'text-right' : ''} ${c.mono ? 'font-mono text-[11.5px]' : ''}`} style={{ color: token.color.text.primary }}>{c.render(row)}</span>
              ))}
              {rowAction && <span className="text-right">{rowAction(row)}</span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── StatusPill / Badge (§1.2, §7: never color-only — always icon + label) ──
export function StatusPill({ label, status, icon }: { label: string; status?: StatusKey; icon?: React.ReactNode }) {
  const s = token.status[status ?? statusFor(label)];
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
      style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {icon}{label}
    </span>
  );
}

// ── Required states (§8) — shaped to the layout they replace ──────────────
export function SkeletonRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="p-4 space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 rounded-lg" style={{ background: token.color.border.hairline }} />
      ))}
    </div>
  );
}

export function EmptyState({ title, hint, action, onAction }: { title: string; hint: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: token.color.bg.muted, border: `1px solid ${token.color.border.default}` }}>
        <Inbox className="w-5 h-5" style={{ color: token.color.text.muted }} />
      </div>
      <p className="text-[14px] font-medium" style={{ color: token.color.text.primary }}>{title}</p>
      <p className="text-[12.5px] mt-1 max-w-[340px] leading-relaxed" style={{ color: token.color.text.muted }}>{hint}</p>
      {action && (
        <button onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12.5px] font-medium text-white transition-colors"
          style={{ background: token.color.text.primary }}>
          <Plus className="w-3.5 h-3.5" /> {action}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: token.status.danger.bg }}>
        <AlertTriangle className="w-5 h-5" style={{ color: token.status.danger.fg }} />
      </div>
      <p className="text-[14px] font-medium" style={{ color: token.color.text.primary }}>Couldn't load this view</p>
      <p className="text-[12.5px] mt-1 max-w-[340px]" style={{ color: token.color.text.muted }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12.5px] font-medium transition-colors"
          style={{ border: `1px solid ${token.color.border.default}`, color: token.color.text.primary }}>
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      )}
    </div>
  );
}

export function NoAccessState({ what }: { what: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: token.color.bg.muted, border: `1px solid ${token.color.border.default}` }}>
        <Lock className="w-5 h-5" style={{ color: token.color.text.muted }} />
      </div>
      <p className="text-[14px] font-medium" style={{ color: token.color.text.primary }}>Not available to you</p>
      <p className="text-[12.5px] mt-1 max-w-[340px] leading-relaxed" style={{ color: token.color.text.muted }}>
        {what} is hidden under your permissions. This board runs scoped to each viewer's RBAC.
      </p>
    </div>
  );
}

// Binding-broken (§8) — inline, fixable, never silent.
export function BindingBroken({ field, onRemap, onRemove }: { field: string; onRemap?: () => void; onRemove?: () => void }) {
  return (
    <div className="rounded-xl p-3" style={{ background: token.status.danger.bg, border: `1px solid #F0B7B9` }}>
      <div className="flex items-center gap-1.5 mb-1">
        <AlertTriangle className="w-3.5 h-3.5" style={{ color: token.status.danger.fg }} />
        <span className="text-[12px] font-medium" style={{ color: '#C13539' }}>Binding broken</span>
      </div>
      <p className="text-[11px] leading-snug mb-2.5" style={{ color: '#E5484D' }}>
        <span className="font-mono">{field}</span> no longer exists in the schema. Data isn't dropped silently — remap or remove.
      </p>
      <div className="flex gap-1.5">
        <button onClick={onRemap} className="flex-1 h-8 rounded-lg text-[11.5px] font-medium text-white transition-colors" style={{ background: token.status.danger.fg }}>Remap field</button>
        <button onClick={onRemove} className="flex-1 h-8 rounded-lg text-[11.5px] font-medium bg-white transition-colors" style={{ color: '#C13539', border: '1px solid #F0B7B9' }}>Remove</button>
      </div>
    </div>
  );
}
