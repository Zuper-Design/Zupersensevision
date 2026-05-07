import { useMemo, useState } from 'react';
import { Check, X as XIcon, AlertTriangle, ArrowRight, Info } from 'lucide-react';

type Flags = {
  isTrial: boolean;
  daysLeft: number;
  isSubscribed: boolean;
  paymentFailed: boolean;
  cancelled: boolean;
};

type Resolved = {
  name: string;
  description: string;
  user: 'RG' | 'AU' | 'VP' | '—';
  tone: 'happy' | 'warning' | 'error' | 'neutral';
  valid: true;
} | {
  name: 'Invalid combination';
  description: string;
  user: '—';
  tone: 'invalid';
  valid: false;
};

function resolve(f: Flags): Resolved {
  // Mutually-exclusive sanity checks
  if (f.isTrial && f.isSubscribed) {
    return { name: 'Invalid combination', description: 'A user cannot be on a trial and subscribed at the same time.', user: '—', tone: 'invalid', valid: false };
  }
  if (f.paymentFailed && !f.isSubscribed && !f.cancelled && !f.isTrial) {
    // Allow payment failed during checkout flow representation only when paired
    return { name: 'Invalid combination', description: 'paymentFailed is only meaningful for an active subscription, or transiently during checkout.', user: '—', tone: 'invalid', valid: false };
  }
  if (f.cancelled && f.paymentFailed) {
    return { name: 'Invalid combination', description: 'Cancellation supersedes payment failure — clear paymentFailed when cancelling.', user: '—', tone: 'invalid', valid: false };
  }
  if (f.cancelled && f.isTrial) {
    return { name: 'Invalid combination', description: 'A trial user cannot be cancelled — they expire instead.', user: '—', tone: 'invalid', valid: false };
  }

  if (f.isTrial && f.daysLeft <= 0) {
    // trial flag true but days exhausted — treated as ended
    return { name: 'Trial Ended', description: 'Trial period elapsed. Access is read-only until the user upgrades.', user: 'VP', tone: 'error', valid: true };
  }

  if (f.isTrial && f.daysLeft <= 10) {
    return { name: 'Trial Ending Soon', description: 'Inside the 10-day warning window — show upgrade nudge banners.', user: 'AU', tone: 'warning', valid: true };
  }

  if (f.isTrial) {
    return { name: 'Trial Active', description: 'Full access during the 14-day evaluation period.', user: 'RG', tone: 'happy', valid: true };
  }

  if (f.isSubscribed && f.paymentFailed) {
    return { name: 'Past Due (Renewal Failed)', description: 'Active subscription whose renewal failed. 7-day grace period before cancellation.', user: '—', tone: 'error', valid: true };
  }

  if (f.isSubscribed) {
    return { name: 'Subscribed (Active)', description: 'Paid customer in good standing. Auto-renews monthly.', user: '—', tone: 'happy', valid: true };
  }

  if (f.cancelled) {
    return { name: 'Cancelled', description: 'Subscription has ended. User retains access until the current period closes; can resubscribe.', user: '—', tone: 'neutral', valid: true };
  }

  // Default: trial ended without explicit isVp flag — model it as no-access
  return { name: 'Trial Ended', description: 'No active trial, no subscription. Access is read-only until the user upgrades.', user: 'VP', tone: 'error', valid: true };
}

const toneColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  happy: { bg: '#ECFDF5', border: '#A7F3D0', text: '#15803D', dot: '#10B981' },
  warning: { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E', dot: '#F59E0B' },
  error: { bg: '#FEE2E2', border: '#FECACA', text: '#B91C1C', dot: '#EF4444' },
  neutral: { bg: '#F3F4F6', border: '#E5E7EB', text: '#4B5563', dot: '#9CA3AF' },
  invalid: { bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', dot: '#DC2626' },
};

const presets: { name: string; flags: Flags }[] = [
  { name: 'Trial Active', flags: { isTrial: true, daysLeft: 14, isSubscribed: false, paymentFailed: false, cancelled: false } },
  { name: 'Trial Ending Soon', flags: { isTrial: true, daysLeft: 10, isSubscribed: false, paymentFailed: false, cancelled: false } },
  { name: 'Trial Ended', flags: { isTrial: false, daysLeft: 0, isSubscribed: false, paymentFailed: false, cancelled: false } },
  { name: 'Subscribed', flags: { isTrial: false, daysLeft: 0, isSubscribed: true, paymentFailed: false, cancelled: false } },
  { name: 'Past Due', flags: { isTrial: false, daysLeft: 0, isSubscribed: true, paymentFailed: true, cancelled: false } },
  { name: 'Cancelled', flags: { isTrial: false, daysLeft: 0, isSubscribed: false, paymentFailed: false, cancelled: true } },
];

export function SubscriptionFlowPage({ onApply }: { onApply: (state: { user: 'RG' | 'AU' | 'VP'; isSubscribed: boolean; paymentFailed: boolean }) => void }) {
  const [flags, setFlags] = useState<Flags>(presets[0].flags);
  const resolved = useMemo(() => resolve(flags), [flags]);
  const tc = toneColors[resolved.tone];

  const apply = () => {
    if (!resolved.valid) return;
    let user: 'RG' | 'AU' | 'VP' = 'RG';
    if (resolved.user === 'AU') user = 'AU';
    if (resolved.user === 'VP') user = 'VP';
    if (resolved.name === 'Subscribed (Active)' || resolved.name === 'Past Due (Renewal Failed)') user = 'RG';
    onApply({
      user,
      isSubscribed: flags.isSubscribed,
      paymentFailed: flags.paymentFailed,
    });
  };

  return (
    <div className="h-full overflow-y-auto bg-[#FAFAFB]">
      <div className="max-w-[1200px] mx-auto px-8 pt-8 pb-16">
        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight">Subscription Flow Inspector</h1>
              <p className="text-[14px] text-[#6B7280] mt-1">Flip flags, preview the resolved state, and apply it to the live app.</p>
            </div>
            <a href="/subscription-flow.png" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] font-medium text-[#1C1E21] hover:bg-[#F8F9FB] transition">
              View flowchart PNG <ArrowRight className="w-[12px] h-[12px]" />
            </a>
          </div>
        </div>

        {/* Flowchart embed */}
        <div className="rounded-2xl border border-[#E6E8EC] bg-white p-4 mb-8 overflow-hidden">
          <img src="/subscription-flow.svg" alt="Subscription flow" className="w-full h-auto block" />
        </div>

        {/* Inspector + presets */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 360px' }}>
          {/* LEFT: Resolved state + flag controls */}
          <div className="space-y-5">
            {/* Resolved state */}
            <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6">
              <div className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF] mb-3">Resolved State</div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tc.bg, border: `1px solid ${tc.border}` }}>
                  {resolved.valid ? <Check className="w-5 h-5" style={{ color: tc.text }} /> : <AlertTriangle className="w-5 h-5" style={{ color: tc.text }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[18px] font-semibold text-[#1C1E21] tracking-tight">{resolved.name}</h3>
                    {resolved.valid ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold tracking-wide uppercase" style={{ background: tc.bg, color: tc.text }}>
                        Valid · user {resolved.user}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold tracking-wide uppercase" style={{ background: tc.bg, color: tc.text }}>
                        Invalid
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">{resolved.description}</p>
                </div>
              </div>
              <div className="border-t border-[#F0F1F3] mt-5 pt-5 flex items-center justify-end gap-2">
                <button
                  onClick={apply}
                  disabled={!resolved.valid}
                  className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-white text-[13px] font-semibold transition ${
                    resolved.valid ? 'bg-[#1C1E21] hover:bg-black shadow-[0_2px_6px_rgba(28,30,33,0.18)]' : 'bg-[#9CA3AF] cursor-not-allowed'
                  }`}
                >
                  Apply to app <ArrowRight className="w-[13px] h-[13px]" />
                </button>
              </div>
            </div>

            {/* Flag toggles */}
            <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6">
              <div className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF] mb-4">Flags</div>
              <div className="divide-y divide-[#F0F1F3]">
                <ToggleRow
                  label="isTrial"
                  desc="User is on the 14-day trial."
                  on={flags.isTrial}
                  onChange={(v) => setFlags((p) => ({ ...p, isTrial: v }))}
                />
                <SliderRow
                  label="daysLeft"
                  desc="Days remaining in trial. ≤10 → Ending Soon · ≤0 → Ended."
                  value={flags.daysLeft}
                  onChange={(v) => setFlags((p) => ({ ...p, daysLeft: v }))}
                  disabled={!flags.isTrial}
                />
                <ToggleRow
                  label="isSubscribed"
                  desc="Active paid subscription."
                  on={flags.isSubscribed}
                  onChange={(v) => setFlags((p) => ({ ...p, isSubscribed: v }))}
                />
                <ToggleRow
                  label="paymentFailed"
                  desc="Most recent payment failed (initial or renewal)."
                  on={flags.paymentFailed}
                  onChange={(v) => setFlags((p) => ({ ...p, paymentFailed: v }))}
                />
                <ToggleRow
                  label="cancelled"
                  desc="User has cancelled. Access remains until period end."
                  on={flags.cancelled}
                  onChange={(v) => setFlags((p) => ({ ...p, cancelled: v }))}
                />
              </div>
            </div>

            {/* Combinations table */}
            <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6">
              <div className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF] mb-4">Valid combinations</div>
              <div className="overflow-x-auto">
                <table className="w-full text-[12.5px]">
                  <thead>
                    <tr className="text-left text-[10.5px] font-semibold tracking-wide uppercase text-[#9CA3AF] border-b border-[#F0F1F3]">
                      <th className="py-2 pr-4">State</th>
                      <th className="py-2 px-2 text-center">isTrial</th>
                      <th className="py-2 px-2 text-center">isSubscribed</th>
                      <th className="py-2 px-2 text-center">paymentFailed</th>
                      <th className="py-2 px-2 text-center">cancelled</th>
                      <th className="py-2 pl-2">User</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1C1E21]">
                    <ComboRow state="Trial Active" isTrial isSubscribed={false} paymentFailed={false} cancelled={false} user="RG" />
                    <ComboRow state="Trial Ending Soon" isTrial isSubscribed={false} paymentFailed={false} cancelled={false} user="AU" />
                    <ComboRow state="Trial Ended" isTrial={false} isSubscribed={false} paymentFailed={false} cancelled={false} user="VP" />
                    <ComboRow state="Subscribed (Active)" isTrial={false} isSubscribed paymentFailed={false} cancelled={false} user="—" />
                    <ComboRow state="Past Due" isTrial={false} isSubscribed paymentFailed cancelled={false} user="—" />
                    <ComboRow state="Cancelled" isTrial={false} isSubscribed={false} paymentFailed={false} cancelled user="—" />
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-start gap-2 text-[12px] text-[#6B7280] leading-relaxed">
                <Info className="w-[13px] h-[13px] mt-0.5 flex-shrink-0 text-[#9CA3AF]" />
                <span>Any other combination (e.g., <code className="font-mono px-1 rounded bg-[#F3F4F6] text-[11.5px]">isTrial + isSubscribed</code> or <code className="font-mono px-1 rounded bg-[#F3F4F6] text-[11.5px]">cancelled + paymentFailed</code>) is treated as <span className="font-semibold text-[#B91C1C]">invalid</span>.</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Presets */}
          <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6 h-fit sticky top-4">
            <div className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF] mb-3">Presets</div>
            <div className="space-y-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setFlags(p.flags)}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl border border-[#E6E8EC] hover:border-[#1C1E21]/15 hover:bg-[#FAFAFB] transition"
                >
                  <div className="text-[13px] font-semibold text-[#1C1E21]">{p.name}</div>
                  <div className="text-[11px] text-[#9CA3AF] mt-0.5 font-mono">
                    {Object.entries(p.flags)
                      .filter(([, v]) => v !== false && v !== 0)
                      .map(([k, v]) => `${k}${typeof v === 'boolean' ? '' : `=${v}`}`)
                      .join(' · ') || 'all flags off'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, on, onChange }: { label: string; desc: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[13px] font-semibold text-[#1C1E21]">{label}</div>
        <div className="text-[11.5px] text-[#9CA3AF]">{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!on)}
        className={`relative inline-flex items-center w-[36px] h-[20px] p-0 rounded-full border-0 transition-colors flex-shrink-0 ${on ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
        aria-pressed={on}
      >
        <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${on ? 'left-[18px]' : 'left-[2px]'}`} />
      </button>
    </div>
  );
}

function SliderRow({ label, desc, value, onChange, disabled }: { label: string; desc: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className={`py-3 ${disabled ? 'opacity-40' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-mono text-[13px] font-semibold text-[#1C1E21]">{label}</div>
          <div className="text-[11.5px] text-[#9CA3AF]">{desc}</div>
        </div>
        <span className="font-mono text-[13px] font-semibold text-[#1C1E21]">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={14}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#1C1E21]"
      />
    </div>
  );
}

function ComboRow({ state, isTrial, isSubscribed, paymentFailed, cancelled, user }: { state: string; isTrial: boolean; isSubscribed: boolean; paymentFailed: boolean; cancelled: boolean; user: string }) {
  const Cell = ({ on }: { on: boolean }) => (
    <td className="py-2 px-2 text-center">
      {on ? <Check className="w-[14px] h-[14px] text-[#10B981] inline" /> : <XIcon className="w-[14px] h-[14px] text-[#D1D5DB] inline" />}
    </td>
  );
  return (
    <tr className="border-b border-[#F0F1F3] last:border-b-0">
      <td className="py-2 pr-4 font-medium">{state}</td>
      <Cell on={isTrial} />
      <Cell on={isSubscribed} />
      <Cell on={paymentFailed} />
      <Cell on={cancelled} />
      <td className="py-2 pl-2 font-mono text-[#6B7280]">{user}</td>
    </tr>
  );
}
