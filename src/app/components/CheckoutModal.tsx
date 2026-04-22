import { ChevronLeft, ChevronDown, Lock } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { SenseLogo } from './SenseLogo';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onCancelVerification?: () => void;
}

const CARD_BRANDS = (
  <svg width="88" height="16" viewBox="0 0 88 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="26" height="16" rx="3" fill="#1A1F71" />
    <text x="5" y="11.5" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white">VISA</text>
    <rect x="30" width="26" height="16" rx="3" fill="#F3F4F6" />
    <circle cx="49" cy="8" r="5" fill="#F79E1B" />
    <circle cx="43" cy="8" r="5" fill="#EB001B" />
    <ellipse cx="46" cy="8" rx="2" ry="5" fill="#FF5F00" />
    <rect x="60" width="26" height="16" rx="3" fill="#E6EEF8" />
    <text x="64.5" y="11.5" fontFamily="Arial, sans-serif" fontSize="6.5" fontWeight="bold" fill="#2E77BC">AMEX</text>
  </svg>
);

const FOCUS_RING = '0 0 0 3px rgba(253,80,0,0.15)';
const INPUT_BASE: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #E6E8EC',
  color: '#1C1E21',
};

export function CheckoutModal({ isOpen, onClose, onSuccess, onCancelVerification }: CheckoutModalProps) {
  const [form, setForm] = useState({
    cardNumber: '', expiry: '', cvc: '',
    cardName: '',
    country: 'United States', address: '', city: '', zip: '',
  });
  const [verifying, setVerifying] = useState(false);
  const verifyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { if (!isOpen) { setForm({ cardNumber: '', expiry: '', cvc: '', cardName: '', country: 'United States', address: '', city: '', zip: '' }); setVerifying(false); if (verifyTimerRef.current) { clearTimeout(verifyTimerRef.current); verifyTimerRef.current = null; } } }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setVerifying(true);
    verifyTimerRef.current = setTimeout(() => {
      setVerifying(false);
      verifyTimerRef.current = null;
      onSuccess?.();
    }, 2400);
  };

  const handleCancelVerify = () => {
    if (verifyTimerRef.current) { clearTimeout(verifyTimerRef.current); verifyTimerRef.current = null; }
    setVerifying(false);
    onCancelVerification?.();
  };

  if (verifying) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white rounded-xl border border-[#E6E8EC]">
        <div className="flex flex-col items-center gap-5">
          <button
            onClick={handleCancelVerify}
            disabled={!onCancelVerification}
            style={{ background: 'none', border: 'none', padding: 0, cursor: onCancelVerification ? 'pointer' : 'default' }}
            aria-label="cancel verification"
          >
            <SenseLogo size={56} animated={true} />
          </button>
          <div className="text-center">
            <p style={{ fontSize: 18, fontWeight: 600, color: '#1C1E21', letterSpacing: '-0.01em', marginBottom: 6 }}>Verifying your payment</p>
            <p style={{ fontSize: 13, color: '#6B7280' }}>This will only take a moment — please don't refresh.</p>
          </div>
        </div>
      </div>
    );
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const formatCard = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + ' / ' + d.slice(2) : d;
  };

  const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.boxShadow = FOCUS_RING;
    e.currentTarget.style.borderColor = '#FD5000';
  };
  const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.borderColor = '#E6E8EC';
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-white rounded-xl border border-[#E6E8EC]">
      <div className="mx-auto w-full" style={{ maxWidth: 960 }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-8 pt-7 pb-4">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[13px] font-medium text-[#1C1E21] hover:text-[#000] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-10 px-8 pb-8">
            {/* ── Left: Form ── */}
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em', marginBottom: 6 }}>
                Subscribe to Sense
              </h2>
              <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 24 }}>
                Enter your payment details to activate your subscription.
              </p>

              {/* Card information */}
              <label style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 8 }}>Card information</label>
              <div className="rounded-lg overflow-hidden mb-4" style={{ border: '1px solid #E6E8EC', background: '#fff' }}>
                <div className="flex items-center">
                  <input
                    value={form.cardNumber}
                    onChange={e => setForm(f => ({ ...f, cardNumber: formatCard(e.target.value) }))}
                    placeholder="4242 4242 4242 4242"
                    className="flex-1 px-3.5 py-3 text-[14px] outline-none bg-transparent font-mono"
                    style={{ color: '#1C1E21', letterSpacing: '0.02em' }}
                  />
                  <div className="pr-3">{CARD_BRANDS}</div>
                </div>
                <div className="grid grid-cols-2 border-t border-[#E6E8EC]">
                  <input
                    value={form.expiry}
                    onChange={e => setForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM / YY"
                    className="px-3.5 py-3 text-[14px] outline-none bg-transparent font-mono"
                    style={{ color: '#1C1E21' }}
                  />
                  <input
                    value={form.cvc}
                    onChange={e => setForm(f => ({ ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="CVC"
                    className="px-3.5 py-3 text-[14px] outline-none bg-transparent font-mono border-l border-[#E6E8EC]"
                    style={{ color: '#1C1E21' }}
                  />
                </div>
              </div>

              {/* Cardholder name */}
              <label style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 8 }}>Cardholder name</label>
              <input
                value={form.cardName}
                onChange={set('cardName')}
                placeholder="Ravi Gupta"
                className="w-full px-3.5 py-3 rounded-lg text-[14px] outline-none mb-5"
                style={INPUT_BASE}
                onFocus={focusIn}
                onBlur={focusOut}
              />

              {/* Billing address */}
              <label style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 8 }}>Billing address</label>
              <div className="space-y-2.5">
                <div className="relative">
                  <select
                    value={form.country}
                    onChange={set('country')}
                    className="w-full appearance-none px-3.5 py-3 rounded-lg text-[14px] outline-none pr-9"
                    style={INPUT_BASE}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>India</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                </div>
                <input
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Street address"
                  className="w-full px-3.5 py-3 rounded-lg text-[14px] outline-none"
                  style={INPUT_BASE}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    value={form.city}
                    onChange={set('city')}
                    placeholder="City"
                    className="w-full px-3.5 py-3 rounded-lg text-[14px] outline-none"
                    style={INPUT_BASE}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  <input
                    value={form.zip}
                    onChange={set('zip')}
                    placeholder="ZIP"
                    className="w-full px-3.5 py-3 rounded-lg text-[14px] outline-none"
                    style={INPUT_BASE}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full mt-6 py-3.5 rounded-[12px] text-[14px] font-semibold text-white transition-all duration-150"
                style={{ background: 'linear-gradient(135deg, #221E1F 0%, #0f0d0e 100%)', boxShadow: '0 6px 18px rgba(0,0,0,0.18)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
              >
                Subscribe — $399 / month
              </button>
              <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Lock className="w-3 h-3" />
                Secured by 256-bit TLS encryption
              </p>
            </div>

            {/* ── Right: Order summary ── */}
            <div>
              <div
                className="rounded-[16px] p-5"
                style={{ background: '#FBF5EC', border: '1px solid #EFE3D2' }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Order summary</p>

                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ background: '#FFF1E6', border: '1px solid #F5E0CF' }}
                  >
                    <SenseLogo size={18} animated={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 15, fontWeight: 600, color: '#1C1E21' }}>Zuper Sense</p>
                    <p style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>Monthly subscription</p>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#1C1E21' }}>$399.00</p>
                </div>

                <div className="h-px" style={{ background: '#EFE3D2' }} />

                <div className="py-4 space-y-2">
                  <div className="flex justify-between">
                    <span style={{ fontSize: 13, color: '#6B7280' }}>Subtotal</span>
                    <span style={{ fontSize: 13, color: '#1C1E21', fontWeight: 500 }}>$399.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ fontSize: 13, color: '#6B7280' }}>Tax (est.)</span>
                    <span style={{ fontSize: 13, color: '#1C1E21', fontWeight: 500 }}>$0.00</span>
                  </div>
                </div>

                <div className="h-px" style={{ background: '#EFE3D2' }} />

                <div className="flex justify-between items-center pt-4">
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#1C1E21' }}>Due today</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em' }}>$399.00</span>
                </div>

                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginTop: 12 }}>
                  Renews monthly at $399.00. Cancel anytime from Subscription settings.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4 px-1">
                <span className="text-[12px] text-[#6B7280]">Secure checkout</span>
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{ background: 'rgba(253,80,0,0.10)', color: '#FD5000' }}
                >
                  Powered by Chargebee
                </span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
