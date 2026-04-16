import { X, ChevronDown, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CARD_BRANDS = (
  <svg width="88" height="16" viewBox="0 0 88 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Visa */}
    <rect width="26" height="16" rx="3" fill="#1A1F71" />
    <text x="5" y="11.5" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">VISA</text>
    {/* MC */}
    <rect x="30" width="26" height="16" rx="3" fill="#EB001B" />
    <circle cx="49" cy="8" r="5" fill="#F79E1B" />
    <circle cx="43" cy="8" r="5" fill="#EB001B" />
    <ellipse cx="46" cy="8" rx="2" ry="5" fill="#FF5F00" />
    {/* Amex */}
    <rect x="60" width="26" height="16" rx="3" fill="#2E77BC" />
    <text x="64.5" y="11.5" fontFamily="Arial, sans-serif" fontSize="6.5" fontWeight="bold" fill="white">AMEX</text>
  </svg>
);

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [payMethod, setPayMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '',
    city: '', state: '', country: 'United States',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  if (!isOpen) return null;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + '/' + d.slice(2) : d;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[300]" onClick={onClose} />
      <div className="fixed inset-0 z-[310] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full relative overflow-hidden"
          style={{
            maxWidth: 760,
            borderRadius: 20,
            background: '#EEF0FB',
            boxShadow: '0 24px 80px rgba(30,34,60,0.22)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/60 hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>

          <div className="flex gap-0">
            {/* ── Left: Form ── */}
            <div className="flex-1 px-8 py-7 overflow-y-auto" style={{ maxHeight: '90vh' }}>
              {/* Logo + heading */}
              <div className="flex items-center gap-2 mb-1">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path d="M20.3 11.4L16.2 17.8H23.9L28 11.4H20.3Z" fill="#FD5000"/>
                  <path d="M14.7 4L9.9 11.4H20.3L25.1 4H14.7Z" fill="#FD5000"/>
                  <path d="M8.1 14.2L4 20.6H11.7L15.8 14.2H8.1Z" fill="#2A292E"/>
                  <path d="M11.7 20.6L6.9 28H17.4L22.1 20.6H11.7Z" fill="#2A292E"/>
                </svg>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em' }}>Checkout</h2>
              </div>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 24 }}>Secure checkout powered by Zuper</p>

              {/* Shipping */}
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Shipping information</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>First name</label>
                  <input value={form.firstName} onChange={set('firstName')} placeholder="Ravi"
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none transition-shadow"
                    style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21' }}
                    onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)')}
                    onBlur={e => (e.target.style.boxShadow = 'none')}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Last name</label>
                  <input value={form.lastName} onChange={set('lastName')} placeholder="Gupta"
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none transition-shadow"
                    style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21' }}
                    onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)')}
                    onBlur={e => (e.target.style.boxShadow = 'none')}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Phone</label>
                <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #E2E8F0', background: '#fff' }}>
                  <div className="flex items-center gap-1.5 px-3 border-r border-[#E2E8F0] text-[13px] text-[#374151] select-none" style={{ background: '#F8F9FB' }}>
                    🇺🇸 <span style={{ fontSize: 12, color: '#6B7280' }}>+1</span>
                  </div>
                  <input value={form.phone} onChange={set('phone')} placeholder="(555) 000-0000"
                    className="flex-1 px-3 py-2.5 text-[13px] outline-none bg-transparent"
                    style={{ color: '#1C1E21' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>City</label>
                  <input value={form.city} onChange={set('city')} placeholder="San Francisco"
                    className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                    style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21' }}
                    onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)')}
                    onBlur={e => (e.target.style.boxShadow = 'none')}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>State</label>
                  <div className="relative">
                    <select value={form.state} onChange={set('state')}
                      className="w-full appearance-none px-3 py-2.5 rounded-lg text-[13px] outline-none pr-8"
                      style={{ background: '#fff', border: '1px solid #E2E8F0', color: form.state ? '#1C1E21' : '#9CA3AF' }}
                    >
                      <option value="">State</option>
                      <option>California</option><option>New York</option><option>Texas</option><option>Florida</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Country</label>
                <div className="relative">
                  <select value={form.country} onChange={set('country')}
                    className="w-full appearance-none px-3 py-2.5 rounded-lg text-[13px] outline-none pr-8"
                    style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21' }}
                  >
                    <option>United States</option><option>Canada</option><option>United Kingdom</option><option>Australia</option><option>India</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>

              {/* Payment */}
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Payment</p>

              {/* Method tabs */}
              <div className="flex gap-2 mb-4">
                {(['card', 'paypal', 'apple'] as const).map(m => (
                  <button key={m} onClick={() => setPayMethod(m)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[13px] transition-all"
                    style={{
                      background: payMethod === m ? '#fff' : 'transparent',
                      border: payMethod === m ? '1.5px solid #6366F1' : '1.5px solid #E2E8F0',
                      color: payMethod === m ? '#6366F1' : '#6B7280',
                      fontWeight: payMethod === m ? 600 : 400,
                      boxShadow: payMethod === m ? '0 1px 4px rgba(99,102,241,0.15)' : 'none',
                    }}
                  >
                    {m === 'card' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    )}
                    {m === 'paypal' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 00-.607-.541c1.379 5.24-1.96 9.41-7.534 9.41h-3.04l-1.173 7.44h3.332c.458 0 .85-.334.921-.787l.038-.197.733-4.647.047-.256a.928.928 0 01.921-.787h.58c3.757 0 6.698-1.527 7.557-5.946.36-1.847.174-3.388-.775-4.69z"/></svg>
                    )}
                    {m === 'apple' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                    )}
                    <span className="capitalize">{m === 'apple' ? 'Apple Pay' : m === 'paypal' ? 'PayPal' : 'Card'}</span>
                  </button>
                ))}
              </div>

              {payMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Card Holder's Name</label>
                    <input value={form.cardName} onChange={set('cardName')} placeholder="Ravi Gupta"
                      className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none"
                      style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21' }}
                      onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)')}
                      onBlur={e => (e.target.style.boxShadow = 'none')}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280' }}>Card number</label>
                      <div>{CARD_BRANDS}</div>
                    </div>
                    <input
                      value={form.cardNumber}
                      onChange={e => setForm(f => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none font-mono"
                      style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21', letterSpacing: '0.05em' }}
                      onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)')}
                      onBlur={e => (e.target.style.boxShadow = 'none')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>Expiration</label>
                      <input
                        value={form.expiry}
                        onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none font-mono"
                        style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21' }}
                        onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)')}
                        onBlur={e => (e.target.style.boxShadow = 'none')}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 500, color: '#6B7280', display: 'block', marginBottom: 4 }}>CVV</label>
                      <input
                        value={form.cvv}
                        onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="CVV"
                        className="w-full px-3 py-2.5 rounded-lg text-[13px] outline-none font-mono"
                        style={{ background: '#fff', border: '1px solid #E2E8F0', color: '#1C1E21' }}
                        onFocus={e => (e.target.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)')}
                        onBlur={e => (e.target.style.boxShadow = 'none')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {payMethod === 'paypal' && (
                <div className="flex items-center justify-center py-8 rounded-xl" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: 13, color: '#6B7280' }}>You'll be redirected to PayPal to complete payment.</p>
                </div>
              )}

              {payMethod === 'apple' && (
                <div className="flex items-center justify-center py-8 rounded-xl" style={{ background: '#000', border: '1px solid #000', borderRadius: 12 }}>
                  <p style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>Continue with ⌘ Apple Pay</p>
                </div>
              )}
            </div>

            {/* ── Right: Order summary ── */}
            <div className="w-[260px] flex-shrink-0 px-6 py-7 flex flex-col" style={{ borderLeft: '1px solid rgba(99,102,241,0.10)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1C1E21', marginBottom: 16, letterSpacing: '-0.01em' }}>Order summary</p>

              {/* Plan line */}
              <div className="rounded-xl p-3.5 mb-2" style={{ background: '#fff', border: '1px solid #E8E9F8' }}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21' }}>Personal Basic · Monthly</p>
                    <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>PLAN</p>
                  </div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EEF0FB' }}>
                    <RotateCcw className="w-3.5 h-3.5 text-[#6366F1]" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p style={{ fontSize: 11, color: '#6B7280' }}>4 × $190.00</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21' }}>$760.00</p>
                </div>
              </div>

              {/* Implementation fee */}
              <div className="rounded-xl p-3.5 mb-4" style={{ background: '#fff', border: '1px solid #E8E9F8' }}>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21' }}>Implementation Fee</p>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#F97316', background: '#FFF7ED', padding: '1px 5px', borderRadius: 4, letterSpacing: '0.05em' }}>ONE-TIME</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FFF7ED' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p style={{ fontSize: 11, color: '#6B7280' }}>2 × $100.00</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21' }}>$200.00</p>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Subtotal</span>
                  <span style={{ fontSize: 12, color: '#1C1E21', fontWeight: 500 }}>$960.00</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Taxes</span>
                  <span style={{ fontSize: 12, color: '#1C1E21', fontWeight: 500 }}>$47.50</span>
                </div>
                <div className="h-px bg-[#E8E9F8] my-1" />
                <div className="flex justify-between">
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1C1E21' }}>Total</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#1C1E21' }}>$1,007.50</span>
                </div>
              </div>

              {/* Submit */}
              <button
                className="w-full py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-150 mt-auto"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                onClick={onClose}
              >
                Submit
              </button>

              <p style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', marginTop: 10 }}>
                🔒 Secured by 256-bit SSL encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
