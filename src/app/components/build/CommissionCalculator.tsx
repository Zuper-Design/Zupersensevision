import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { COMMISSION_DEALS, tierFor, type Deal } from './buildData';
import { token } from './tokens';
import { MetricStat, DataTable, StatusPill, SkeletonRows, type Column } from './primitives';

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const pct = (n: number) => `${Math.round(n * 100)}%`;

// Commission calculator archetype — deals × tiered rates → payout, grouped by
// rep. A second proof that the pipeline routes intent to a calculator/table
// layout. Tier is chosen by the deal's margin band; low-margin → warning.
interface Props {
  isViewer?: boolean;
  canSeeFinancials?: boolean;
}

function tierStatus(margin: number) {
  if (margin >= 0.4) return 'success' as const;
  if (margin >= 0.25) return 'info' as const;
  return 'warning' as const;
}

const commissionOf = (d: Deal) => d.amount * tierFor(d.margin).rate;

export function CommissionCalculator({ isViewer, canSeeFinancials = true }: Props) {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 280); return () => clearTimeout(t); }, []);

  const totalPayout = COMMISSION_DEALS.reduce((s, d) => s + commissionOf(d), 0);
  const totalSold = COMMISSION_DEALS.reduce((s, d) => s + d.amount, 0);

  const reps = Array.from(new Set(COMMISSION_DEALS.map((d) => d.rep)));
  const groups = reps.map((rep) => {
    const rows = COMMISSION_DEALS.filter((d) => d.rep === rep);
    const sub = rows.reduce((s, d) => s + commissionOf(d), 0);
    return { label: `${rep} · ${money(sub)}`, rows };
  });

  const columns: Column<Deal>[] = [
    { key: 'customer', header: 'Deal', render: (r) => r.customer },
    {
      key: 'amount', header: 'Closed', align: 'right', mono: true,
      render: (r) => (canSeeFinancials ? money(r.amount) : '— hidden'),
    },
    { key: 'margin', header: 'Margin', render: (r) => <StatusPill label={pct(r.margin)} status={tierStatus(r.margin)} /> },
    { key: 'tier', header: 'Tier', render: (r) => <span style={{ color: token.color.text.muted }}>{tierFor(r.margin).label} · {pct(tierFor(r.margin).rate)}</span> },
    {
      key: 'commission', header: 'Commission', align: 'right', mono: true,
      render: (r) => (canSeeFinancials
        ? <span style={{ color: token.color.text.primary, fontWeight: 600 }}>{money(commissionOf(r))}</span>
        : '— hidden'),
    },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: '#F7F7F5' }}>
      {/* header / filter row */}
      <div className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0">
        <span className="w-8 h-8 rounded-2xl bg-white border border-[#ECEEF1] inline-flex items-center justify-center text-[12px] font-semibold"
          style={{ color: token.color.brand.primary, boxShadow: '0 10px 24px -22px rgba(28,30,33,0.5)' }}>
          ﹩
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-[-0.015em]" style={{ color: token.color.text.primary }}>Commissions</p>
          <p className="text-[11px]" style={{ color: token.color.text.muted }}>Closed deals · tiered by margin · grouped by rep</p>
        </div>
        <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full text-[11.5px] font-mono ml-2" style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, color: token.color.text.secondary }}>
          status = closed · tier = margin band
        </span>
        <span className="ml-auto text-[11.5px]" style={{ color: token.color.text.muted }}>
          <span className="font-medium" style={{ color: token.color.text.secondary }}>{COMMISSION_DEALS.length}</span> deals
          {isViewer && <span className="ml-2.5 inline-flex items-center gap-1" style={{ color: token.status.info.fg }}><ShieldCheck className="w-3 h-3" /> your access</span>}
        </span>
      </div>

      {loading ? (
        <div className="flex-1 overflow-hidden p-3 pt-0 space-y-3">
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => <div key={i} className="flex-1 h-[76px] rounded-[20px] animate-pulse" style={{ background: token.color.bg.surface, border: `1px solid ${token.color.border.default}` }} />)}
          </div>
          <div className="rounded-[24px] overflow-hidden bg-white" style={{ border: '1px solid #FFFFFF', boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
            <SkeletonRows rows={6} />
          </div>
        </div>
      ) : (
        <div data-app-reveal className="flex-1 overflow-y-auto p-3 pt-0 space-y-3">
          <div className="flex gap-3">
            <MetricStat label="Total payout" value={canSeeFinancials ? money(totalPayout) : '— hidden'} status="success" />
            <MetricStat label="Deals closed" value={String(COMMISSION_DEALS.length)} delta={{ dir: 'up', text: '2', good: true }} />
            <MetricStat label="Total sold" value={canSeeFinancials ? money(totalSold) : '— hidden'} />
          </div>

          <DataTable columns={columns} groups={groups} />

          <p className="text-[11px] font-mono" style={{ color: token.color.text.faint }}>
            tiers: 40%+ → 10% · 25%+ → 7% · below → 4% · recomputes on rate change
          </p>
        </div>
      )}
    </div>
  );
}
