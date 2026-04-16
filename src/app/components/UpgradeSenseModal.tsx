import { X, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { CheckoutModal } from './CheckoutModal';

interface UpgradeSenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FEATURES = [
  'Unlimited Sense conversations',
  'Real-time Radar dashboards',
  'Custom alerts and smart triggers',
  'Connect all your data sources',
  'Premium AI models for deeper insights',
  'Priority support from the Sense team',
];

export function UpgradeSenseModal({ isOpen, onClose }: UpgradeSenseModalProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-200"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(34,30,31,0.25)] w-full max-w-[440px] pointer-events-auto p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <div className="flex items-center gap-2">
              <h2 className="text-[22px] font-semibold text-[#1C1E21]">Sense</h2>
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(253,80,0,0.10)', color: '#FD5000', fontSize: 11, fontWeight: 600 }}
              >
                <Sparkles className="w-3 h-3" />
                Most Popular
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F8F9FB] transition-colors duration-150 -mr-1 -mt-1"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>
          <p className="text-[14px] text-[#6B7280] mb-5">
            For teams who run on <span className="font-semibold text-[#1C1E21]">insights, not spreadsheets.</span>
          </p>

          {/* Price card */}
          {/* Features */}
          <ul className="space-y-2.5 mb-5">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-2.5">
                <span
                  className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full flex-shrink-0"
                  style={{ border: '1.5px solid #FD5000' }}
                >
                  <Check className="w-2.5 h-2.5" style={{ color: '#FD5000' }} strokeWidth={3} />
                </span>
                <span className="text-[13.5px] text-[#374151]">{f}</span>
              </li>
            ))}
          </ul>

          <div
            className="relative rounded-[14px] px-5 py-4 mb-5 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFE4D2 45%, #FFD0BA 100%)',
              border: '1px solid rgba(253,80,0,0.20)',
            }}
          >
            <div className="absolute -top-6 -right-4 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(253,80,0,0.28) 0%, rgba(253,80,0,0) 70%)', filter: 'blur(8px)' }} />
            <div className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.22) 0%, rgba(236,72,153,0) 70%)', filter: 'blur(10px)' }} />
            <div className="flex items-center gap-3 relative z-10">
              <span
                className="text-[44px] font-bold leading-none"
                style={{
                  background: 'linear-gradient(135deg, #FD5000 0%, #F97316 40%, #EC4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >$300</span>
              <div className="text-[15px] text-[#1C1E21] leading-snug">
                <p className="font-semibold">Charged monthly,</p>
                <p>per workspace.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => setCheckoutOpen(true)}
            className="w-full py-3 rounded-[12px] text-[14px] font-semibold text-white transition-all duration-150"
            style={{
              background: 'linear-gradient(135deg, #221E1F 0%, #0f0d0e 100%)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
          >
            Upgrade to Sense
          </button>
        </div>
      </div>
      <CheckoutModal isOpen={checkoutOpen} onClose={() => { setCheckoutOpen(false); onClose(); }} />
    </>
  );
}
