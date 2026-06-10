import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Check, X, AlertTriangle, ShieldCheck, History, Lock } from 'lucide-react';
import { OVERDUE_INVOICES, type Invoice } from './buildData';
import { token } from './tokens';
import { MetricStat, DataTable, StatusPill, SkeletonRows, type Column } from './primitives';

const money = (n: number) => '$' + n.toLocaleString('en-US');
const bucketStatus = (b: Invoice['bucket']) => (b === '90+' || b === '61-90') ? 'danger' as const : 'warning' as const;

// Operational cockpit archetype (§4a) — proves the pipeline routes intent to a
// different layout than the dispatch scheduler. Demonstrates permission inversion:
// the financial column is redacted when the viewer's role can't see finances.
interface Props {
  isViewer?: boolean;
  canSeeFinancials?: boolean;   // viewer-scoped RBAC (§4 inversion)
  canWrite?: boolean;          // read-only toggle / viewer write scope
  onOpenAudit?: () => void;
}

export function ArCockpit({ isViewer, canSeeFinancials = true, canWrite = true, onOpenAudit }: Props) {
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ rows: Invoice[] } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  // §8 loading — skeleton shaped like the final layout while the binding resolves
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 280); return () => clearTimeout(t); }, []);

  const toggle = (id: string) => setSel(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const total = OVERDUE_INVOICES.reduce((s, i) => s + i.amount, 0);
  const avgDays = Math.round(OVERDUE_INVOICES.reduce((s, i) => s + i.daysOverdue, 0) / OVERDUE_INVOICES.length);

  const buckets: Invoice['bucket'][] = ['0-30', '31-60', '61-90', '90+'];
  const groups = buckets.map(b => ({
    label: `${b} days`,
    status: bucketStatus(b),
    rows: OVERDUE_INVOICES.filter(i => i.bucket === b),
  })).filter(g => g.rows.length);

  const commitSend = () => {
    if (!confirm) return;
    const ids = confirm.rows.map(r => r.id);
    setSent(prev => new Set([...prev, ...ids]));
    setSel(new Set());
    setToast(`Sent ${ids.length} reminder${ids.length > 1 ? 's' : ''} · contact logged · audited`);
    setConfirm(null);
    setTimeout(() => setToast(null), 3600);
  };

  // columns — amount is redacted under viewer RBAC (permission inversion)
  const columns: Column<Invoice>[] = [
    { key: 'customer', header: 'Customer', render: r => r.customer },
    {
      key: 'amount', header: 'Amount', align: 'right', mono: true,
      render: r => canSeeFinancials
        ? money(r.amount)
        : <span className="inline-flex items-center gap-1" style={{ color: token.color.text.faint }}><Lock className="w-3 h-3" />hidden</span>,
    },
    { key: 'days', header: 'Overdue', render: r => <StatusPill label={`${r.daysOverdue}d`} status={bucketStatus(r.bucket)} /> },
    { key: 'contact', header: 'Last contact', render: r => <span style={{ color: token.color.text.muted }}>{r.lastContact}</span> },
    { key: 'dispute', header: '', render: r => r.disputed ? <StatusPill label="Disputed" status="danger" /> : null },
  ];

  const rowAction = (r: Invoice) => {
    if (!canWrite) return null;
    return sent.has(r.id)
      ? <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: token.status.success.fg }}><Check className="w-3 h-3" />Sent</span>
      : (
        <button onClick={() => setConfirm({ rows: [r] })}
          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11.5px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ border: `1px solid ${token.color.border.default}`, color: token.color.text.primary }}>
          <Send className="w-3 h-3" /> Send reminder
        </button>
      );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#F7F7F5' }}>
      {/* FilterBar */}
      <div className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0">
        <span className="w-8 h-8 rounded-2xl bg-white border border-[#ECEEF1] inline-flex items-center justify-center text-[12px] font-semibold"
          style={{ color: token.status.danger.fg, boxShadow: '0 10px 24px -22px rgba(28,30,33,0.5)' }}>
          AR
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-[-0.015em]" style={{ color: token.color.text.primary }}>Collections</p>
          <p className="text-[11px]" style={{ color: token.color.text.muted }}>Overdue invoices · grouped by aging</p>
        </div>
        <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full text-[11.5px] font-mono ml-2" style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, color: token.color.text.secondary }}>
          status = overdue · grouped by aging
        </span>
        <span className="ml-auto text-[11.5px]" style={{ color: token.color.text.muted }}>
          <span className="font-medium" style={{ color: token.color.text.secondary }}>{OVERDUE_INVOICES.length}</span> invoices
          {isViewer && <span className="ml-2.5 inline-flex items-center gap-1" style={{ color: token.status.info.fg }}><ShieldCheck className="w-3 h-3" /> your access</span>}
        </span>
      </div>

      {loading ? (
        <div className="flex-1 overflow-hidden p-3 pt-0 space-y-3">
          <div className="flex gap-3">
            {[0, 1, 2].map(i => <div key={i} className="flex-1 h-[76px] rounded-[20px] animate-pulse" style={{ background: token.color.bg.surface, border: `1px solid ${token.color.border.default}` }} />)}
          </div>
          <div className="rounded-[24px] overflow-hidden bg-white" style={{ border: `1px solid #FFFFFF`, boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
            <SkeletonRows rows={6} />
          </div>
        </div>
      ) : (
      <div data-app-reveal className="flex-1 overflow-y-auto p-3 pt-0 space-y-3">
        {/* MetricStat row (§4a) */}
        <div className="flex gap-3">
          <MetricStat label="Total overdue" value={canSeeFinancials ? money(total) : '— hidden'} status="danger" />
          <MetricStat label="Accounts" value={String(OVERDUE_INVOICES.length)} delta={{ dir: 'up', text: '2', good: false }} />
          <MetricStat label="Avg days late" value={`${avgDays}d`} delta={{ dir: 'down', text: '4d', good: true }} />
        </div>

        {/* bulk action bar — appears on selection, danger-confirm on count (§9) */}
        {canWrite && sel.size > 0 && (
          <div className="flex items-center gap-3 px-3.5 h-11 rounded-xl" style={{ background: token.color.text.primary }}>
            <span className="text-[12.5px] font-medium text-white">{sel.size} selected</span>
            <button onClick={() => setConfirm({ rows: OVERDUE_INVOICES.filter(i => sel.has(i.id)) })}
              className="ml-auto inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg text-[12.5px] font-semibold text-white transition-colors" style={{ background: token.color.brand.primary }}>
              <Send className="w-3.5 h-3.5" /> Send {sel.size} reminders
            </button>
            <button onClick={() => setSel(new Set())} className="text-white/70 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* select-row affordance + DataTable */}
        <div className="relative">
          {canWrite && (
            <div className="absolute -left-0 top-0 bottom-0 flex flex-col pointer-events-none z-10" />
          )}
          <SelectableTable columns={columns} groups={groups} rowAction={rowAction} sel={sel} toggle={canWrite ? toggle : undefined} />
        </div>

        {/* guardrail note (§4 cost/performance) */}
        <p className="text-[11px] font-mono" style={{ color: token.color.text.faint }}>
          capped 200 rows · paginated · live refresh
        </p>
      </div>
      )}

      {/* Confirm Drawer (§9) — names what, how many, scope */}
      <AnimatePresence>
        {confirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400]" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => setConfirm(null)} />
            <motion.div initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }} transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="fixed top-0 right-0 h-full w-[380px] z-[410] flex flex-col" style={{ background: token.color.bg.surface, boxShadow: '-8px 0 24px rgba(0,0,0,0.12)' }}>
              <div className="h-12 flex items-center justify-between px-4 border-b" style={{ borderColor: token.color.border.default }}>
                <span className="text-[14px] font-semibold" style={{ color: token.color.text.primary }}>Send reminders</span>
                <button onClick={() => setConfirm(null)} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ color: token.color.text.muted }}><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-[13px] leading-relaxed" style={{ color: token.color.text.primary }}>
                  Send a payment reminder to <span className="font-semibold">{confirm.rows.length} account{confirm.rows.length > 1 ? 's' : ''}</span>? This logs a contact + promise-to-pay on each invoice.
                </p>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${token.color.border.default}` }}>
                  {confirm.rows.map(r => (
                    <div key={r.id} className="flex items-center justify-between px-3 h-9 text-[12px]" style={{ borderBottom: `1px solid ${token.color.border.hairline}` }}>
                      <span style={{ color: token.color.text.primary }}>{r.customer}</span>
                      <span className="font-mono text-[11px]" style={{ color: token.color.text.muted }}>{r.id}</span>
                    </div>
                  ))}
                </div>
                {confirm.rows.some(r => r.disputed) && (
                  <div className="flex items-start gap-1.5 text-[11.5px] px-1" style={{ color: token.status.warning.fg }}>
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-px" /> Includes a disputed invoice — review before contacting.
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: token.color.border.default }}>
                <button onClick={() => setConfirm(null)} className="flex-1 h-9 rounded-xl text-[13px] font-medium transition-colors" style={{ background: token.color.bg.muted, color: token.color.text.secondary }}>Cancel</button>
                <button onClick={commitSend} className="flex-1 h-9 rounded-xl text-[13px] font-semibold text-white inline-flex items-center justify-center gap-1.5 transition-colors"
                  style={{ background: confirm.rows.length > 3 ? token.status.danger.fg : token.color.brand.primary }}>
                  <Send className="w-4 h-4" /> Send {confirm.rows.length}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.button onClick={onOpenAudit}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[420] inline-flex items-center gap-3 px-3.5 h-12 rounded-[18px] text-[12.5px] font-medium"
            style={{ background: token.color.bg.surface, color: token.color.text.primary, border: `1px solid ${token.color.border.default}`, boxShadow: '0 16px 42px -22px rgba(28,30,33,0.42)' }}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: token.status.success.bg, color: token.status.success.fg }}>
              <Check className="w-4 h-4" />
            </span>
            <span>{toast}</span>
            <span className="inline-flex items-center gap-1 ml-1" style={{ color: token.color.text.muted }}><History className="w-3 h-3" /> View history</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// thin wrapper adding a checkbox column to DataTable when writes are allowed
function SelectableTable({ columns, groups, rowAction, sel, toggle }: any) {
  if (!toggle) return <DataTable columns={columns} groups={groups} rowAction={rowAction} />;
  const withSel: Column<Invoice>[] = [
    { key: '_sel', header: '', render: (r: Invoice) => (
      <button onClick={(e) => { e.stopPropagation(); toggle(r.id); }}
        className="w-4 h-4 rounded flex items-center justify-center" style={{ border: `1.5px solid ${sel.has(r.id) ? token.color.brand.primary : token.color.border.strong}`, background: sel.has(r.id) ? token.color.brand.primary : 'transparent' }}>
        {sel.has(r.id) && <Check className="w-3 h-3 text-white" />}
      </button>
    ) },
    ...columns,
  ];
  return <DataTable columns={withSel} groups={groups} rowAction={rowAction} />;
}
