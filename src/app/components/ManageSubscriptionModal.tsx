import { CreditCard, ChevronDown, Check, Calendar, Building2, Sparkles, Plus, Download, ChevronLeft, AlertTriangle, CheckCircle2, RotateCcw, Clock, MessageSquare, BarChart3, RefreshCw, Gauge } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVp?: boolean;
  isAU?: boolean;
  isMJ?: boolean;
  paymentFailed?: boolean;
  onUpgrade?: () => void;
}

const CARD_BRANDS = (
  <svg width="72" height="14" viewBox="0 0 72 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="22" height="14" rx="2.5" fill="#1A1F71" />
    <text x="4" y="10" fontFamily="Arial" fontSize="6.5" fontWeight="bold" fill="white">VISA</text>
    <rect x="26" width="22" height="14" rx="2.5" fill="#EB001B" />
    <circle cx="42" cy="7" r="4.5" fill="#F79E1B" />
    <circle cx="37" cy="7" r="4.5" fill="#EB001B" />
    <ellipse cx="39.5" cy="7" rx="1.8" ry="4.5" fill="#FF5F00" />
    <rect x="52" width="20" height="14" rx="2.5" fill="#2E77BC" />
    <text x="55.5" y="10" fontFamily="Arial" fontSize="5.5" fontWeight="bold" fill="white">AMEX</text>
  </svg>
);

const inputStyle: React.CSSProperties = {
  background: '#F8F9FB',
  border: '1px solid #E6E8EC',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#1C1E21',
  width: '100%',
  outline: 'none',
};

type InvoiceStatus = 'paid' | 'unpaid' | 'overdue';
const INVOICES: { id: string; status: InvoiceStatus; amount: string; created: string }[] = [
  { id: '97480976-0113', status: 'paid',    amount: '$399.00', created: 'Apr 20, 2026, 3:00 PM' },
  { id: '97480976-0112', status: 'paid',    amount: '$399.00', created: 'Mar 20, 2026, 4:36 AM' },
  { id: '97480976-0111', status: 'paid',    amount: '$399.00', created: 'Feb 20, 2026, 9:19 AM' },
  { id: '97480976-0110', status: 'unpaid',  amount: '$399.00', created: 'Jan 20, 2026, 4:31 PM' },
  { id: '97480976-0109', status: 'paid',    amount: '$399.00', created: 'Dec 20, 2025, 5:40 PM' },
  { id: '97480976-0108', status: 'paid',    amount: '$399.00', created: 'Nov 20, 2025, 12:33 PM' },
  { id: '97480976-0107', status: 'paid',    amount: '$399.00', created: 'Oct 20, 2025, 12:52 AM' },
  { id: '97480976-0106', status: 'overdue', amount: '$399.00', created: 'Sep 20, 2025, 3:32 PM' },
  { id: '97480976-0105', status: 'paid',    amount: '$399.00', created: 'Aug 20, 2025, 10:37 PM' },
  { id: '97480976-0104', status: 'paid',    amount: '$399.00', created: 'Jul 20, 2025, 6:39 PM' },
  { id: '97480976-0103', status: 'paid',    amount: '$399.00', created: 'Jun 20, 2025, 4:57 PM' },
];

const STATUS_STYLE: Record<InvoiceStatus, { bg: string; color: string; label: string }> = {
  paid:    { bg: 'rgba(16,185,129,0.10)', color: '#059669', label: 'Paid' },
  unpaid:  { bg: 'rgba(245,158,11,0.12)', color: '#B45309', label: 'Unpaid' },
  overdue: { bg: 'rgba(239,68,68,0.10)',  color: '#DC2626', label: 'Overdue' },
};

const PLAN_FEATURES = [
  'Ask anything about your business in plain English',
  'Instant answers with charts, tables, and summaries',
  'Radar, your personal KPI dashboard, always up to date',
  'Daily sync with your JobNimbus data',
];

type Tab = 'overview' | 'payment' | 'history' | 'billing';

export function ManageSubscriptionModal({ isOpen, onClose, isVp, isAU, isMJ, paymentFailed, onUpgrade }: ManageSubscriptionModalProps) {
  const [tab, setTab] = useState<Tab>('overview');
  const [editingCard, setEditingCard] = useState(false);
  const [cards, setCards] = useState<{ id: string; brand: 'visa' | 'mc'; last4: string; exp: string; isDefault: boolean }[]>([
    { id: 'c1', brand: 'visa', last4: '0965', exp: '08/2027', isDefault: true },
    { id: 'c2', brand: 'mc', last4: '6188', exp: '08/2025', isDefault: false },
  ]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [cardForm, setCardForm] = useState({
    firstName: '', lastName: '',
    address: '', city: '', state: '', zip: '',
    cardNumber: '', expiry: '', cvv: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const set = (k: keyof typeof cardForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCardForm(f => ({ ...f, [k]: e.target.value }));

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  const handleSaveCard = () => {
    setSaveSuccess(true);
    const last4 = cardForm.cardNumber.replace(/\s/g, '').slice(-4) || '0000';
    setCards(prev => [...prev, { id: 'c' + (prev.length + 1), brand: 'visa', last4, exp: cardForm.expiry || '01/2030', isDefault: false }]);
    setTimeout(() => { setSaveSuccess(false); setEditingCard(false); setCardForm({ firstName: '', lastName: '', address: '', city: '', state: '', zip: '', cardNumber: '', expiry: '', cvv: '' }); }, 1400);
  };

  const setDefault = (id: string) => setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
  const deleteCard = (id: string) => setCards(prev => prev.filter(c => c.id !== id));

  const [toastVisible, setToastVisible] = useState(false);
  const handleConfirmCancel = () => {
    setConfirmCancel(false);
    setCancelled(true);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'payment', label: 'Payment methods' },
    ...(!isMJ ? [{ id: 'history' as Tab, label: 'Billing history' }] : []),
    { id: 'billing', label: 'Billing information' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto bg-white rounded-xl border border-[#E6E8EC]">
      <div className="mx-auto w-full px-10 py-8" style={{ maxWidth: 1040 }}>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1 mb-5 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em', marginBottom: 22 }}>Subscription & billing</h1>

        {/* Tabs */}
        <div className="flex items-center gap-7 border-b" style={{ borderColor: '#E6E8EC' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="relative pb-3 pt-1 transition-colors"
              style={{
                fontSize: 14,
                fontWeight: tab === t.id ? 600 : 500,
                color: tab === t.id ? '#1C1E21' : '#9CA3AF',
                opacity: isAU && t.id !== 'overview' ? 0.45 : 1,
              }}
            >
              {t.label}
              {tab === t.id && (
                <motion.div
                  layoutId="sub-tab-underline"
                  className="absolute left-0 right-0 -bottom-px h-[2px]"
                  style={{ background: '#1C1E21' }}
                />
              )}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
          {paymentFailed && !isVp && (
            <div
              className="mt-6 flex items-start gap-3 rounded-xl p-4"
              style={{ background: '#FDECEC', border: '1px solid #F5C6C6' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B3261E' }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#7A1D1A' }}>Your last payment failed</p>
                <p style={{ fontSize: 13, color: '#9A302C', marginTop: 2 }}>Please update your payment method to avoid losing access.</p>
              </div>
            </div>
          )}
          <div className={`pt-8 grid ${paymentFailed && !isAU && !isVp ? 'grid-cols-[1fr_360px] gap-8' : 'grid-cols-1 gap-4'} items-stretch`}>
            {/* ── Left: Plan hero + billing info ── */}
            {!isAU && !isVp && !paymentFailed && !cancelled ? (
              /* Active paid (RG) — single unified surface, Manus-style heading + detail rows + inline billing history */
              <>
                <div className="rounded-xl bg-white overflow-hidden" style={{ border: '1px solid #E6E8EC' }}>
                  <div className="px-6 py-6">
                    {/* Row 1: name + pill (left) | Cancel subscription stroke button (right) */}
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1C1E21', letterSpacing: '-0.02em' }}>Zuper Sense</h2>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em' }}
                        >
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10B981' }} />
                          ACTIVE
                        </span>
                      </div>
                      <button
                        onClick={() => setConfirmCancel(true)}
                        className="inline-flex items-center px-3 h-8 rounded-md text-[12.5px] font-medium text-[#4B5563] flex-shrink-0 active:scale-[0.98]"
                        style={{ border: '1px solid #E6E8EC', background: '#FFFFFF', transition: 'border-color 140ms cubic-bezier(0.23,1,0.32,1), color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#DC2626'; (e.currentTarget as HTMLElement).style.color = '#DC2626'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E6E8EC'; (e.currentTarget as HTMLElement).style.color = '#4B5563'; }}
                      >
                        Cancel subscription
                      </button>
                    </div>

                    {/* Row 2: price + renewal date on one line */}
                    <div className="flex items-baseline gap-2 flex-wrap" style={{ fontSize: 13.5, color: '#6B7280' }}>
                      <span><span style={{ fontSize: 20, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em' }}>$399</span> <span style={{ fontWeight: 500 }}>USD / month</span></span>
                      <span style={{ color: '#C0C4CC' }}>·</span>
                      <span>Renews <span style={{ color: '#1C1E21', fontWeight: 500 }}>Jun 26, 2026</span> <span style={{ color: '#9CA3AF' }}>(in 31 days)</span></span>
                    </div>

                    {/* Row 3: payment method, minimal */}
                    <p style={{ fontSize: 12.5, color: '#9CA3AF', marginTop: 14 }}>
                      Paid with <span style={{ color: '#6B7280', fontWeight: 500, fontFamily: 'monospace', letterSpacing: '0.04em' }}>•••• {cards.find(c => c.isDefault)?.last4 || '0965'}</span>
                    </p>
                  </div>
                </div>

                {/* Billing history inline — MJ only (RG sees this in the Billing history tab) */}
                {isMJ && (
                <div className="mt-8">
                  <div className="flex items-end justify-between mb-4">
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1C1E21', letterSpacing: '-0.005em' }}>Billing history</h3>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{INVOICES.length} invoices</span>
                  </div>
                  {/* Column headers */}
                  <div className="px-1 h-9 flex items-center gap-4 border-b" style={{ borderColor: '#E6E8EC' }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 150px' }}>Invoice</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 110px' }}>Status</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 90px' }}>Amount</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', flex: 1 }}>Created</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 120px', textAlign: 'right' }}>Actions</span>
                  </div>
                  {/* Rows */}
                  {INVOICES.slice(0, 8).map((inv) => {
                    const style = STATUS_STYLE[inv.status];
                    const needsPay = inv.status === 'unpaid' || inv.status === 'overdue';
                    return (
                      <div
                        key={inv.id}
                        className="px-1 h-12 flex items-center gap-4 border-b"
                        style={{ borderColor: '#F0F1F3' }}
                      >
                        <span style={{ fontSize: 13, color: '#1C1E21', fontWeight: 500, fontFamily: 'monospace', flex: '0 0 150px' }}>{inv.id}</span>
                        <div style={{ flex: '0 0 110px' }}>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                            style={{ background: style.bg, color: style.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}
                          >
                            <span style={{ width: 4, height: 4, borderRadius: '50%', background: style.color }} />
                            {style.label.toUpperCase()}
                          </span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', fontVariantNumeric: 'tabular-nums', flex: '0 0 90px' }}>{inv.amount}</span>
                        <span style={{ fontSize: 13, color: '#6B7280', flex: 1 }}>{inv.created}</span>
                        <div className="flex items-center gap-1 flex-shrink-0 justify-end" style={{ flex: '0 0 120px' }}>
                          {needsPay && (
                            <button
                              className="inline-flex items-center px-2.5 h-7 rounded-md bg-[#1C1E21] hover:bg-black text-white text-[12px] font-semibold active:scale-[0.98]"
                              style={{ transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                            >
                              Pay now
                            </button>
                          )}
                          <button
                            className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#1C1E21] active:scale-[0.94]"
                            style={{ transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1), color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                            aria-label="Download invoice"
                          >
                            <Download className="w-[13px] h-[13px]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )}
              </>
            ) : isAU || isVp ? (
              <>
                {/* Status card */}
                <div className="rounded-xl bg-white overflow-hidden" style={{ border: '1px solid #E6E8EC' }}>
                  <div className="px-6 py-6">
                    <div className="flex items-center gap-2.5 min-w-0 mb-2">
                      <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1C1E21', letterSpacing: '-0.02em' }}>
                        {isVp ? 'Trial ended' : 'Free trial'}
                      </h2>
                      {isVp ? (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(220,38,38,0.10)', color: '#DC2626', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em' }}
                        >
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#DC2626' }} />
                          EXPIRED
                        </span>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(37,99,235,0.10)', color: '#1D4ED8', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em' }}
                        >
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563EB' }} />
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13.5, color: '#6B7280', lineHeight: 1.55 }}>
                      {isVp
                        ? <>Your trial ended on <span style={{ color: '#1C1E21', fontWeight: 500 }}>May 21, 2026</span>. Subscribe to restore access to Sense.</>
                        : <>Full access until <span style={{ color: '#1C1E21', fontWeight: 500 }}>May 21, 2026</span> <span style={{ color: '#9CA3AF' }}>(in 31 days)</span>. Subscribe anytime to keep going.</>}
                    </p>
                  </div>
                </div>

                {/* Plan section — open layout, hairline separators (no card chrome) */}
                <div className="mt-10 pt-8" style={{ borderTop: '1px solid #E6E8EC' }}>
                  {/* Title */}
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                    Subscribe to Zuper Sense for <span style={{ color: '#FD5000' }}>$399 / mo</span>
                  </h3>
                  <p style={{ fontSize: 13.5, color: '#6B7280', marginTop: 8, marginBottom: 22, lineHeight: 1.6 }}>
                    Turn your operations data into instant answers, live dashboards, and daily insights — built for teams that run on signals, not spreadsheets.
                  </p>

                  {/* Bare check list — no ring, just orange stroke */}
                  <ul className="space-y-3 mb-8">
                    {PLAN_FEATURES.map(f => (
                      <li key={f} className="flex items-center gap-3">
                        <Check className="w-[15px] h-[15px] flex-shrink-0" style={{ color: '#FD5000' }} strokeWidth={2.5} />
                        <span style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer row — trust line + compact CTA */}
                  <div className="flex items-center justify-between gap-3 pt-5" style={{ borderTop: '1px solid #E6E8EC' }}>
                    <p style={{ fontSize: 12, color: '#9CA3AF' }}>Cancel anytime · No hidden fees</p>
                    <button
                      onClick={onUpgrade}
                      className="inline-flex items-center justify-center px-5 h-10 rounded-lg text-[13.5px] font-semibold text-white active:scale-[0.98]"
                      style={{ background: '#1C1E21', transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#1C1E21')}
                    >
                      Subscribe to Sense
                    </button>
                  </div>
                </div>
              </>
            ) : cancelled ? (
              /* Cancelled — state copy on top, CANCELLED pill, full-width Reactivate CTA */
              <div className="rounded-xl bg-white px-7 py-7" style={{ border: '1px solid #E6E8EC' }}>
                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.55, marginBottom: 14 }}>
                  Your plan has been cancelled. You'll keep access until <span style={{ color: '#1C1E21', fontWeight: 600 }}>May 21, 2026</span>.
                </p>
                <div className="flex items-center gap-2.5 mb-3">
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1C1E21', letterSpacing: '-0.015em' }}>Zuper Sense</h2>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(180,83,9,0.10)', color: '#B45309', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em' }}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D97706' }} />
                    CANCELLED
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.03em', lineHeight: 1 }}>$399</span>
                  <span style={{ fontSize: 15, color: '#9CA3AF' }}>/ month</span>
                </div>
                <button
                  onClick={() => setCancelled(false)}
                  className="w-full inline-flex items-center justify-center gap-1.5 h-11 rounded-lg text-[14px] font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)', boxShadow: '0 6px 18px rgba(0,0,0,0.18)', transition: 'transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reactivate subscription
                </button>
              </div>
            ) : (
            <div
              className="rounded-2xl p-7"
              style={{ border: '1px solid #E6E8EC', background: '#FFFFFF' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current plan</p>
                {!isAU && !cancelled && <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D1D5DB' }} />}
                {isAU || cancelled ? null : isVp ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(220,38,38,0.10)', color: '#DC2626', fontSize: 11, fontWeight: 600, letterSpacing: '0.03em' }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />
                    TRIAL ENDED
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', fontSize: 11, fontWeight: 600, letterSpacing: '0.03em' }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    ACTIVE
                  </span>
                )}
              </div>

              {isAU ? (
                <div className="mb-6">
                  <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.025em', lineHeight: 1.15 }}>You're on a free trial</h2>
                  <p style={{ fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 1.55 }}>Full access to Sense until your trial ends. Subscribe anytime to keep going without interruption.</p>
                </div>
              ) : (
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: cancelled ? '#6B7280' : '#1C1E21', letterSpacing: '-0.01em', marginBottom: 4 }}>
                      {cancelled ? 'Your subscription ends on May 21, 2026' : 'Zuper Sense'}
                    </h2>
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: 40, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.035em', lineHeight: 1 }}>$399</span>
                      <span style={{ fontSize: 14, color: '#9CA3AF' }}>/ month</span>
                    </div>
                  </div>
                </div>
              )}

              {isAU ? (
                <div
                  className="rounded-xl flex items-center gap-3 px-5 py-4"
                  style={{ border: '1px solid #EEF0F3', background: '#FAFBFC' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#fff', border: '1px solid #E6E8EC' }}
                  >
                    <Calendar className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Trial ends</p>
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#1C1E21', letterSpacing: '-0.005em' }}>May 21, 2026</p>
                  </div>
                </div>
              ) : cancelled ? null : (
                <div className="rounded-xl flex items-center gap-3 px-5 py-4" style={{ border: '1px solid #EEF0F3', background: '#FAFBFC' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fff', border: '1px solid #E6E8EC' }}>
                    <Calendar className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Next billing date</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21' }}>May 21, 2026</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end">
                {isAU ? (
                  <button
                    onClick={onUpgrade}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Subscribe to Sense
                  </button>
                ) : isVp ? (
                  <button
                    onClick={onUpgrade}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Subscribe to Sense
                  </button>
                ) : paymentFailed ? (
                  <button
                    onClick={onUpgrade}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Update payment
                  </button>
                ) : !cancelled ? (
                  <button
                    onClick={() => setConfirmCancel(true)}
                    className="transition-colors"
                    style={{ fontSize: 13, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#DC2626')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#9CA3AF')}
                  >
                    Cancel subscription
                  </button>
                ) : (
                  <button
                    onClick={() => setCancelled(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reactivate subscription
                  </button>
                )}
              </div>
            </div>
            )}

            {/* ── Right: Plan includes card ── only for paymentFailed (AU/VP get it inline) */}
            {paymentFailed && !isAU && !isVp && !cancelled && (
            <div
              className="rounded-2xl p-6 relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #FFF7F0 0%, #FFF1E6 100%)', border: '1px solid #F5E0CF' }}
            >
              <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(253,80,0,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(253,80,0,0.12)' }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#FD5000' }} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21' }}>Plan includes</p>
                </div>
                <div className="space-y-3">
                  {PLAN_FEATURES.map(f => (
                    <div key={f} className="flex items-start gap-2.5">
                      <span
                        className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full flex-shrink-0 mt-0.5"
                        style={{ background: '#fff', border: '1px solid rgba(253,80,0,0.30)' }}
                      >
                        <Check className="w-2.5 h-2.5" style={{ color: '#FD5000' }} strokeWidth={3} />
                      </span>
                      <span className="text-[13px] text-[#374151] leading-snug">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}
          </div>
          </>
        )}

        {tab === 'payment' && isAU && (
          <div className="pt-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#F3F4F6' }}>
              <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1E21' }}>No payment methods</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Add one after you upgrade.</p>
          </div>
        )}

        {tab === 'payment' && !isAU && (
          <div className="pt-8">
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>Cards used to charge your Sense subscription.</p>

            {!editingCard && (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {cards.map(card => (
                    <div key={card.id} className="rounded-xl p-4" style={{ border: '1px solid #E6E8EC', background: '#FFFFFF' }}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {card.brand === 'visa' ? (
                            <div className="w-9 h-6 rounded-[5px] flex items-center justify-center flex-shrink-0" style={{ background: '#1A1F71' }}>
                              <span style={{ fontSize: 7, fontWeight: 700, color: '#fff', fontFamily: 'Arial' }}>VISA</span>
                            </div>
                          ) : (
                            <div className="w-9 h-6 rounded-[5px] flex items-center justify-center flex-shrink-0 relative" style={{ background: '#fff', border: '1px solid #E6E8EC' }}>
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EB001B', position: 'absolute', left: 7 }} />
                              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F79E1B', position: 'absolute', right: 7, opacity: 0.85 }} />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21', fontFamily: 'monospace', letterSpacing: '0.06em' }}>••••{card.last4}</p>
                            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Expires {card.exp}</p>
                          </div>
                        </div>
                        {card.isDefault && (
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background: '#F3F4F6', color: '#6B7280', fontSize: 11, fontWeight: 500 }}
                          >
                            Default
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {!card.isDefault && (
                          <button
                            onClick={() => setDefault(card.id)}
                            className="text-[12px] font-medium text-[#1C1E21] hover:text-black transition-colors"
                            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                          >
                            Set as default
                          </button>
                        )}
                        <button
                          onClick={() => deleteCard(card.id)}
                          className="text-[12px] font-medium transition-colors"
                          style={{ color: '#DC2626', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setEditingCard(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors"
                  style={{ background: '#F3F4F6', color: '#1C1E21', fontSize: 13, fontWeight: 500 }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#E5E7EB')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#F3F4F6')}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add payment method
                </button>
              </>
            )}
            <AnimatePresence>
              {editingCard && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>First name</label>
                        <input value={cardForm.firstName} onChange={set('firstName')} placeholder="Ravi" style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Last name</label>
                        <input value={cardForm.lastName} onChange={set('lastName')} placeholder="Gupta" style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Billing address</label>
                      <input value={cardForm.address} onChange={set('address')} placeholder="123 Main St" style={inputStyle} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>City</label>
                        <input value={cardForm.city} onChange={set('city')} placeholder="San Francisco" style={inputStyle} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>State</label>
                        <div style={{ position: 'relative' }}>
                          <select value={cardForm.state} onChange={set('state')} style={{ ...inputStyle, appearance: 'none', paddingRight: 28, color: cardForm.state ? '#1C1E21' : '#9CA3AF' }}>
                            <option value="">State</option>
                            <option>CA</option><option>NY</option><option>TX</option><option>FL</option>
                          </select>
                          <ChevronDown style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#9CA3AF', pointerEvents: 'none' }} />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>ZIP</label>
                        <input value={cardForm.zip} onChange={set('zip')} placeholder="94103" style={inputStyle} maxLength={5} />
                      </div>
                    </div>
                    <div style={{ height: 1, background: '#F0F2F5' }} />
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>Card number</label>
                        {CARD_BRANDS}
                      </div>
                      <input
                        value={cardForm.cardNumber}
                        onChange={e => setCardForm(f => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                        placeholder="1234 5678 9012 3456"
                        style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.05em' }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Expiration</label>
                        <input value={cardForm.expiry} onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))} placeholder="MM/YY"
                          style={{ ...inputStyle, fontFamily: 'monospace' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>CVV</label>
                        <input value={cardForm.cvv} onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="CVV"
                          style={{ ...inputStyle, fontFamily: 'monospace' }} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSaveCard}
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2"
                        style={{
                          background: saveSuccess ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #221E1F, #0f0d0e)',
                          boxShadow: saveSuccess ? '0 4px 14px rgba(16,185,129,0.3)' : '0 4px 14px rgba(0,0,0,0.18)',
                          transition: 'background 0.3s, box-shadow 0.3s',
                        }}>
                        {saveSuccess ? <><Check className="w-4 h-4" strokeWidth={3} /> Saved</> : <><CreditCard className="w-4 h-4" /> Save card</>}
                      </button>
                      <button onClick={() => setEditingCard(false)}
                        className="px-4 py-2.5 rounded-xl text-[13px] font-medium"
                        style={{ background: '#F3F4F6', color: '#6B7280' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {tab === 'history' && isAU && (
          <div className="pt-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#F3F4F6' }}>
              <Download className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1E21' }}>No invoices yet</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Billing history appears once you upgrade.</p>
          </div>
        )}

        {tab === 'history' && !isAU && (
          <div className="pt-8">
            <div className="flex items-end justify-between mb-4">
              <p style={{ fontSize: 13, color: '#9CA3AF' }}>Showing invoices within the past 12 months</p>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{INVOICES.length} invoices</span>
            </div>
            {/* Column headers */}
            <div className="px-1 h-9 flex items-center gap-4 border-b" style={{ borderColor: '#E6E8EC' }}>
              <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 150px' }}>Invoice</span>
              <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 110px' }}>Status</span>
              <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 90px' }}>Amount</span>
              <span style={{ fontSize: 12, color: '#9CA3AF', flex: 1 }}>Created</span>
              <span style={{ fontSize: 12, color: '#9CA3AF', flex: '0 0 120px', textAlign: 'right' }}>Actions</span>
            </div>
            {/* Rows */}
            {INVOICES.map((inv) => {
              const style = STATUS_STYLE[inv.status];
              const needsPay = inv.status === 'unpaid' || inv.status === 'overdue';
              return (
                <div
                  key={inv.id}
                  className="px-1 h-12 flex items-center gap-4 border-b"
                  style={{ borderColor: '#F0F1F3' }}
                >
                  <span style={{ fontSize: 13, color: '#1C1E21', fontWeight: 500, fontFamily: 'monospace', flex: '0 0 150px' }}>{inv.id}</span>
                  <div style={{ flex: '0 0 110px' }}>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ background: style.bg, color: style.color, fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}
                    >
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: style.color }} />
                      {style.label.toUpperCase()}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', fontVariantNumeric: 'tabular-nums', flex: '0 0 90px' }}>{inv.amount}</span>
                  <span style={{ fontSize: 13, color: '#6B7280', flex: 1 }}>{inv.created}</span>
                  <div className="flex items-center gap-1 flex-shrink-0 justify-end" style={{ flex: '0 0 120px' }}>
                    {needsPay && (
                      <button
                        className="inline-flex items-center px-2.5 h-7 rounded-md bg-[#1C1E21] hover:bg-black text-white text-[12px] font-semibold active:scale-[0.98]"
                        style={{ transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                      >
                        Pay now
                      </button>
                    )}
                    <button
                      className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#1C1E21] active:scale-[0.94]"
                      style={{ transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1), color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                      aria-label="Download invoice"
                    >
                      <Download className="w-[13px] h-[13px]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'billing' && isAU && (
          <div className="pt-16 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: '#F3F4F6' }}>
              <Building2 className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#1C1E21' }}>No billing information</p>
            <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>Add billing details after you upgrade.</p>
          </div>
        )}

        {tab === 'billing' && !isAU && (
          <div className="pt-8">
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 28 }}>
              Changes to these preferences will apply to future invoices only. If you need a past invoice reissued, please contact{' '}
              <a href="mailto:billing@zuper.co" style={{ color: '#FD5000', textDecoration: 'underline' }}>billing@zuper.co</a>.
            </p>

            <div className="grid grid-cols-2 gap-x-10 gap-y-7">
              {/* Left column */}
              <div className="space-y-7">
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 4 }}>Company name</label>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10 }}>If specified, this name will appear on invoices instead of your organization name.</p>
                  <input defaultValue="Zuper Inc" className="w-full px-3.5 py-2.5 rounded-lg text-[14px] outline-none" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }} />
                </div>

                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 4 }}>Purchase order (PO) number</label>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10 }}>Your PO number will be displayed on future invoices.</p>
                  <input className="w-full px-3.5 py-2.5 rounded-lg text-[14px] outline-none" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }} />
                </div>

                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 4 }}>Billing email</label>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10 }}>Invoices and other billing notifications will be sent here (in addition to being sent to the owners of your organization).</p>
                  <input defaultValue="finance@zuper.co" className="w-full px-3.5 py-2.5 rounded-lg text-[14px] outline-none" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }} />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-7">
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 4 }}>Primary business address</label>
                  <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10 }}>This is the physical address of the company purchasing Sense services and is used to calculate any applicable sales tax.</p>
                  <div className="space-y-2.5">
                    <div className="relative">
                      <select defaultValue="United States of America" className="w-full appearance-none px-3.5 py-2.5 rounded-lg text-[14px] outline-none pr-9" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }}>
                        <option>United States of America</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>India</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                    <input defaultValue="24754 NE 3RD PL" className="w-full px-3.5 py-2.5 rounded-lg text-[14px] outline-none" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }} />
                    <input placeholder="Address line 2" className="w-full px-3.5 py-2.5 rounded-lg text-[14px] outline-none" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }} />
                    <div className="grid grid-cols-2 gap-2.5">
                      <input defaultValue="SAMMAMISH" className="w-full px-3.5 py-2.5 rounded-lg text-[14px] outline-none" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }} />
                      <input defaultValue="98074" className="w-full px-3.5 py-2.5 rounded-lg text-[14px] outline-none" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }} />
                    </div>
                    <div className="relative">
                      <select defaultValue="Washington" className="w-full appearance-none px-3.5 py-2.5 rounded-lg text-[14px] outline-none pr-9" style={{ background: '#fff', border: '1px solid #E6E8EC', color: '#1C1E21' }}>
                        <option>Washington</option>
                        <option>California</option>
                        <option>New York</option>
                        <option>Texas</option>
                        <option>Florida</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-8">
              <button
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #221E1F 0%, #0f0d0e 100%)', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
              >
                Save changes
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {toastVisible && (
          <motion.div
            key="cancel-toast"
            className="fixed z-[500]"
            style={{ bottom: 84, right: 24 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{ background: '#1C1E21', color: '#fff', boxShadow: '0 12px 40px rgba(0,0,0,0.25)' }}
            >
              <CheckCircle2 className="w-4 h-4" style={{ color: '#10B981' }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>Subscription cancelled</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmCancel && !cancelled && (
          <>
            <motion.div
              className="fixed bg-black/40 backdrop-blur-sm z-[400]"
              style={{ inset: 0 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setConfirmCancel(false)}
            />
            <div className="fixed z-[410] flex items-center justify-center p-4 pointer-events-none" style={{ inset: 0 }}>
              <motion.div
                className="pointer-events-auto bg-white w-full"
                style={{ maxWidth: 460, borderRadius: 16, boxShadow: '0 24px 60px rgba(30,34,60,0.22)' }}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="p-6">
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.015em', marginBottom: 8 }}>Cancel your subscription?</h3>
                  <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.55, marginBottom: 18 }}>
                    You'll keep access until <span style={{ fontWeight: 600, color: '#1C1E21' }}>May 21, 2026</span>. After that, Sense stops working for this workspace and you'll lose:
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {[
                      { Icon: MessageSquare, label: 'Sense chat and instant answers' },
                      { Icon: BarChart3, label: 'Radar dashboards' },
                      { Icon: RefreshCw, label: 'Daily JobNimbus sync' },
                    ].map(({ Icon, label }) => (
                      <li key={label} className="flex items-center gap-3">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                          style={{ background: '#F3F4F6' }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: '#6B7280' }} strokeWidth={2} />
                        </span>
                        <span style={{ fontSize: 13.5, color: '#1C1E21', lineHeight: 1.4 }}>{label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)', transition: 'transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                    >
                      Keep subscription
                    </button>
                    <button
                      onClick={handleConfirmCancel}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold active:scale-[0.98]"
                      style={{ background: '#FEECEC', color: '#DC2626', border: 'none', transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FDDADA')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#FEECEC')}
                    >
                      Cancel subscription
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
