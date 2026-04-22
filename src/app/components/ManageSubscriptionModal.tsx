import { CreditCard, ChevronDown, Check, Calendar, Building2, Sparkles, Plus, Download, ChevronLeft, AlertTriangle, CheckCircle2, RotateCcw, Clock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVp?: boolean;
  isAU?: boolean;
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
  'Unlimited queries',
];

type Tab = 'overview' | 'payment' | 'history' | 'billing';

export function ManageSubscriptionModal({ isOpen, onClose, isVp, isAU, paymentFailed, onUpgrade }: ManageSubscriptionModalProps) {
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
    { id: 'history', label: 'Billing history' },
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
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em', marginBottom: 22 }}>My subscription</h1>

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
          {isVp && (
            <div
              className="mt-6 flex items-start gap-3 rounded-xl p-4"
              style={{ background: '#FDECEC', border: '1px solid #F5C6C6' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#B3261E' }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#7A1D1A' }}>Your trial has ended</p>
                <p style={{ fontSize: 13, color: '#9A302C', marginTop: 2 }}>Subscribe to restore access to Sense.</p>
              </div>
            </div>
          )}
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
          {cancelled && !isVp && (
            <div
              className="mt-6 flex items-start gap-3 rounded-xl p-4"
              style={{ background: '#FBF3E2', border: '1px solid #F0E3C1' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#8B6A1A' }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#6B4F15' }}>Your subscription ends on May 21, 2026</p>
                <p style={{ fontSize: 13, color: '#8B6A1A', marginTop: 2 }}>You can reactivate anytime before then to continue using Sense.</p>
              </div>
            </div>
          )}
          <div className="pt-8 grid grid-cols-[1fr_360px] gap-8 items-start">
            {/* ── Left: Plan hero + billing info ── */}
            <div
              className="rounded-2xl p-7"
              style={{ border: '1px solid #E6E8EC', background: '#FFFFFF' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current plan</p>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D1D5DB' }} />
                {isAU ? (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(253,80,0,0.10)', color: '#FD5000', fontSize: 11, fontWeight: 600, letterSpacing: '0.03em' }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FD5000', display: 'inline-block' }} />
                    FREE TRIAL
                  </span>
                ) : isVp ? (
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

              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em', marginBottom: 4 }}>Zuper Sense</h2>
                  {isAU ? (
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: 40, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.035em', lineHeight: 1 }}>Free</span>
                      <span style={{ fontSize: 14, color: '#9CA3AF' }}>during trial</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: 40, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.035em', lineHeight: 1 }}>$399</span>
                      <span style={{ fontSize: 14, color: '#9CA3AF' }}>/ month</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #EEF0F3', background: '#FAFBFC' }}>
                <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid #EEF0F3' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fff', border: '1px solid #E6E8EC' }}>
                    <Calendar className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>{isAU ? 'Trial ends' : 'Next billing date'}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21' }}>May 21, 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fff', border: '1px solid #E6E8EC' }}>
                    <Clock className="w-4 h-4 text-[#6B7280]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 2 }}>Subscription started on</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21' }}>Mar 20, 2025</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 flex items-center justify-end" style={{ borderTop: '1px solid #F0F2F5' }}>
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

            {/* ── Right: Plan includes card ── */}
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
            <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 14 }}>Showing invoices within the past 12 months</p>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E6E8EC', background: '#fff' }}>
              <div
                className="grid items-center px-6 py-3"
                style={{ gridTemplateColumns: 'minmax(150px, 1.3fr) minmax(90px, 0.7fr) minmax(90px, 0.7fr) minmax(180px, 1.4fr) 80px 110px', columnGap: 16, background: '#FAFBFC', borderBottom: '1px solid #EDEFF2' }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.09em', textAlign: 'left' }}>Invoice</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.09em', textAlign: 'left' }}>Status</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.09em', textAlign: 'left' }}>Amount</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.09em', textAlign: 'left' }}>Created</span>
                <span />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.09em', textAlign: 'right' }}>Actions</span>
              </div>
              {INVOICES.map((inv, i) => {
                const s = STATUS_STYLE[inv.status];
                return (
                  <div
                    key={inv.id}
                    className="grid items-center px-6 py-2.5 transition-colors"
                    style={{
                      gridTemplateColumns: 'minmax(150px, 1.3fr) minmax(90px, 0.7fr) minmax(90px, 0.7fr) minmax(180px, 1.4fr) 100px 110px',
                      columnGap: 24,
                      borderBottom: i === INVOICES.length - 1 ? 'none' : '1px solid #F2F3F5',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FAFBFC')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <span style={{ fontSize: 13, color: '#1C1E21', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>{inv.id}</span>
                    <span className="flex">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                        style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600 }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, opacity: 0.8 }} />
                        {s.label}
                      </span>
                    </span>
                    <span style={{ fontSize: 13, color: '#1C1E21', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{inv.amount}</span>
                    <span style={{ fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>{inv.created}</span>
                    <span className="flex">
                      {(inv.status === 'unpaid' || inv.status === 'overdue') && (
                        <button
                          className="px-3 py-1 rounded-lg text-[12px] font-semibold text-white transition-colors"
                          style={{ background: '#1C1E21' }}
                          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#000')}
                          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#1C1E21')}
                        >
                          Pay now
                        </button>
                      )}
                    </span>
                    <span className="flex items-center gap-1 justify-end">
                      <button
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
                        title="Download invoice"
                      >
                        <Download className="w-3.5 h-3.5 text-[#6B7280]" />
                      </button>
                      <button
                        className="px-2.5 py-1 rounded-lg text-[13px] font-medium text-[#1C1E21] hover:bg-[#F3F4F6] transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        View
                      </button>
                    </span>
                  </div>
                );
              })}
            </div>
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
          <div className="pt-8 max-w-[720px]">
            <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 28 }}>
              Changes to these preferences will apply to future invoices only. If you need a past invoice reissued, please contact{' '}
              <a href="mailto:billing@zuper.co" style={{ color: '#FD5000', textDecoration: 'underline' }}>billing@zuper.co</a>.
            </p>

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

              <div className="flex justify-end pt-2">
                <button
                  className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #221E1F 0%, #0f0d0e 100%)', boxShadow: '0 4px 14px rgba(0,0,0,0.18)' }}
                >
                  Save changes
                </button>
              </div>
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
              style={{ top: 44, left: 72, right: 0, bottom: 0 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setConfirmCancel(false)}
            />
            <div className="fixed z-[410] flex items-center justify-center p-4 pointer-events-none" style={{ top: 44, left: 72, right: 0, bottom: 0 }}>
              <motion.div
                className="pointer-events-auto bg-white w-full"
                style={{ maxWidth: 460, borderRadius: 16, boxShadow: '0 24px 60px rgba(30,34,60,0.22)' }}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="p-6">
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.01em', marginBottom: 8 }}>Cancel your subscription?</h3>
                  <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.55, marginBottom: 16 }}>
                    Are you sure you want to cancel? You'll keep access until <span style={{ fontWeight: 600, color: '#1C1E21' }}>May 21, 2026</span>, then Sense will stop working for this workspace.
                  </p>
                  <div
                    className="rounded-lg p-3.5 mb-5"
                    style={{ background: '#FFF7F0', border: '1px solid #F5E0CF' }}
                  >
                    <p style={{ fontSize: 13, color: '#6B4A2B', lineHeight: 1.5 }}>
                      You'll lose unlimited queries, Radar dashboards, and daily JobNimbus sync.
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setConfirmCancel(false)}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white"
                      style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)' }}
                    >
                      Keep subscription
                    </button>
                    <button
                      onClick={handleConfirmCancel}
                      className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
                      style={{ background: '#FEECEC', color: '#DC2626', border: 'none' }}
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
