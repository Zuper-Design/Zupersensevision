import { X, CreditCard, ChevronDown, AlertTriangle, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ManageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
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

const FEATURES = [
  'Unlimited Sense conversations',
  'Real-time Radar dashboards',
  'Custom alerts & smart triggers',
  'Priority support',
  'All data source integrations',
  'Premium AI models',
];

export function ManageSubscriptionModal({ isOpen, onClose }: ManageSubscriptionModalProps) {
  const [editingCard, setEditingCard] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [cardForm, setCardForm] = useState({
    firstName: '', lastName: '',
    address: '', city: '', state: '', zip: '',
    cardNumber: '', expiry: '', cvv: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    setTimeout(() => { setSaveSuccess(false); setEditingCard(false); }, 1400);
  };

  const handleConfirmCancel = () => {
    setCancelled(true);
    setTimeout(() => { setCancelled(false); setConfirmCancel(false); onClose(); }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-[310] flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto bg-white overflow-hidden w-full"
              style={{ maxWidth: 860, borderRadius: 20, boxShadow: '0 24px 80px rgba(30,34,60,0.18)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid #F0F2F5' }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em', marginBottom: 2 }}>Manage subscription</h2>
                  <p style={{ fontSize: 12, color: '#9CA3AF' }}>Billing & payment settings</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors">
                  <X className="w-4 h-4 text-[#6B7280]" />
                </button>
              </div>

              {/* Two-column body */}
              <div className="flex flex-1 overflow-hidden">

                {/* LEFT — Plan info */}
                <div className="flex flex-col gap-5 p-7 overflow-y-auto" style={{ width: 340, flexShrink: 0, borderRight: '1px solid #F0F2F5' }}>

                  {/* Active plan card */}
                  <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E8E9F8' }}>
                    <div className="px-5 pt-5 pb-4" style={{ background: 'linear-gradient(135deg, #EEF0FB 0%, #E8EAFF 100%)' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#6366F1', background: 'rgba(99,102,241,0.12)', padding: '2px 8px', borderRadius: 20, letterSpacing: '0.05em', display: 'inline-block', marginBottom: 10 }}>ACTIVE</span>
                      <div className="flex items-end justify-between">
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Sense Plan</p>
                          <p style={{ fontSize: 13, color: '#6366F1', fontWeight: 500, marginTop: 2 }}>Monthly</p>
                        </div>
                        <div className="text-right">
                          <p style={{ fontSize: 28, fontWeight: 800, color: '#1C1E21', letterSpacing: '-0.03em', lineHeight: 1 }}>$300</p>
                          <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>/month</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-5 py-3" style={{ background: '#FAFBFF', borderTop: '1px solid #E8E9F8' }}>
                      <div className="grid grid-cols-2 gap-y-3">
                        {[
                          { label: 'Plan', value: 'Sense Plan' },
                          { label: 'Billing', value: 'Monthly' },
                          { label: 'Seats', value: '4 users' },
                          { label: 'Next charge', value: 'Jun 16, 2026' },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                            <p style={{ fontSize: 12, color: '#374151', fontWeight: 500, marginTop: 2 }}>{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* What's included */}
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>What's included</p>
                    <div className="flex flex-col gap-2.5">
                      {FEATURES.map(f => (
                        <div key={f} className="flex items-center gap-2.5">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.10)', border: '1.5px solid #6366F1' }}>
                            <Check className="w-2.5 h-2.5 text-[#6366F1]" strokeWidth={3} />
                          </div>
                          <span style={{ fontSize: 13, color: '#374151' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT — Payment & cancel */}
                <div className="flex-1 flex flex-col gap-5 p-7 overflow-y-auto">

                  {/* Payment method */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Payment method</p>
                      <button
                        onClick={() => setEditingCard(!editingCard)}
                        style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {editingCard ? 'Cancel' : 'Update card'}
                      </button>
                    </div>

                    {!editingCard && (
                      <div className="flex items-center justify-between p-4 rounded-xl" style={{ border: '1px solid #E6E8EC', background: '#FAFBFC' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: '#1A1F71' }}>
                            <span style={{ fontSize: 7, fontWeight: 700, color: '#fff', fontFamily: 'Arial' }}>VISA</span>
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: '#1C1E21' }}>Visa ending in <span style={{ fontFamily: 'monospace' }}>4242</span></p>
                            <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>Expires 08/27</p>
                          </div>
                        </div>
                        <button
                          style={{ fontSize: 12, fontWeight: 500, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                          onClick={() => setConfirmCancel(true)}
                        >
                          Remove
                        </button>
                      </div>
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
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>First name</label>
                                <input value={cardForm.firstName} onChange={set('firstName')} placeholder="Ravi" style={inputStyle}
                                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                  onBlur={e => (e.target.style.boxShadow = 'none')} />
                              </div>
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Last name</label>
                                <input value={cardForm.lastName} onChange={set('lastName')} placeholder="Gupta" style={inputStyle}
                                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                  onBlur={e => (e.target.style.boxShadow = 'none')} />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Billing address</label>
                              <input value={cardForm.address} onChange={set('address')} placeholder="123 Main St" style={inputStyle}
                                onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                onBlur={e => (e.target.style.boxShadow = 'none')} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>City</label>
                                <input value={cardForm.city} onChange={set('city')} placeholder="San Francisco" style={inputStyle}
                                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                  onBlur={e => (e.target.style.boxShadow = 'none')} />
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
                                <input value={cardForm.zip} onChange={set('zip')} placeholder="94103" style={inputStyle} maxLength={5}
                                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                  onBlur={e => (e.target.style.boxShadow = 'none')} />
                              </div>
                            </div>

                            <div style={{ height: 1, background: '#F0F2F5', margin: '4px 0' }} />

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
                                onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                onBlur={e => (e.target.style.boxShadow = 'none')}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Expiration</label>
                                <input
                                  value={cardForm.expiry}
                                  onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                                  placeholder="MM/YY"
                                  style={{ ...inputStyle, fontFamily: 'monospace' }}
                                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                  onBlur={e => (e.target.style.boxShadow = 'none')}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>CVV</label>
                                <input
                                  value={cardForm.cvv}
                                  onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                                  placeholder="CVV"
                                  style={{ ...inputStyle, fontFamily: 'monospace' }}
                                  onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.22)')}
                                  onBlur={e => (e.target.style.boxShadow = 'none')}
                                />
                              </div>
                            </div>

                            <button
                              onClick={handleSaveCard}
                              className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-white flex items-center justify-center gap-2"
                              style={{
                                background: saveSuccess ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                                boxShadow: saveSuccess ? '0 4px 14px rgba(16,185,129,0.3)' : '0 4px 14px rgba(99,102,241,0.3)',
                                transition: 'background 0.3s, box-shadow 0.3s',
                              }}
                            >
                              {saveSuccess ? (
                                <><Check className="w-4 h-4" strokeWidth={3} /> Saved</>
                              ) : (
                                <><CreditCard className="w-4 h-4" /> Save payment method</>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Spacer pushes cancel to bottom */}
                  <div className="flex-1" />

                  {/* Cancel subscription */}
                  <div className="rounded-2xl px-5 py-4" style={{ border: '1px solid #FEE2E2', background: '#FFFAFA' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                        <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', marginBottom: 2 }}>Cancel subscription</p>
                        <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
                          Removing your card will cancel your subscription. Access ends on <strong>June 16, 2026</strong>.
                        </p>
                        <AnimatePresence mode="wait">
                          {!confirmCancel && !cancelled && (
                            <motion.button
                              key="cancel-btn"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              onClick={() => setConfirmCancel(true)}
                              className="mt-3 px-4 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                              style={{ background: '#FEE2E2', color: '#EF4444', border: '1px solid #FECACA' }}
                              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#FECACA')}
                              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#FEE2E2')}
                            >
                              Remove card &amp; cancel
                            </motion.button>
                          )}
                          {confirmCancel && !cancelled && (
                            <motion.div
                              key="confirm"
                              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-2 mt-3"
                            >
                              <p style={{ fontSize: 12, color: '#EF4444', fontWeight: 500 }}>Are you sure?</p>
                              <button onClick={handleConfirmCancel}
                                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                                style={{ background: '#EF4444' }}>
                                Yes, remove &amp; cancel
                              </button>
                              <button onClick={() => setConfirmCancel(false)}
                                className="px-3 py-1.5 rounded-lg text-[12px] font-medium"
                                style={{ background: '#F3F4F6', color: '#374151' }}>
                                Keep plan
                              </button>
                            </motion.div>
                          )}
                          {cancelled && (
                            <motion.p
                              key="cancelled"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              style={{ fontSize: 12, color: '#10B981', fontWeight: 500, marginTop: 8 }}
                            >
                              ✓ Card removed. Access ends June 16, 2026.
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
