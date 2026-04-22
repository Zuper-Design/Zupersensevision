import { X, Check, Sparkles } from 'lucide-react';
import { SenseLogo } from './SenseLogo';

interface UpgradeSenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  isVp?: boolean;
  isTrial?: boolean;
  showSuccess?: boolean;
  onSubscribe?: () => void;
}

const FEATURES = [
  'Unlimited Sense conversations',
  'Real-time Radar dashboards',
  'Custom alerts and smart triggers',
  'Connect all your data sources',
  'Premium AI models for deeper insights',
  'Priority support from the Sense team',
];

const VP_FEATURES = [
  'Ask anything about your business in plain English',
  'Instant answers with charts, tables, and summaries',
  'Radar, your personal KPI dashboard, always up to date',
  'Daily sync with your JobNimbus data',
  'Unlimited queries',
];

export function UpgradeSenseModal({ isOpen, onClose, isVp, isTrial, showSuccess, onSubscribe }: UpgradeSenseModalProps) {
  const useSubscribeLayout = isVp || isTrial;

  if (!isOpen) return null;

  const overlayStyle = { top: 44, left: 72, right: 0, bottom: 0 };

  return (
    <>
      <div
        className="fixed bg-black/40 backdrop-blur-sm z-[200] transition-opacity duration-200"
        style={overlayStyle}
        onClick={onClose}
      />
      <div className="fixed z-[210] flex items-center justify-center p-4 pointer-events-none" style={overlayStyle}>
        <div
          className="bg-white rounded-[16px] shadow-[0_20px_60px_rgba(34,30,31,0.25)] w-full max-w-[440px] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {showSuccess ? (
            /* ── Success state ── */
            <div className="p-6 text-center">
              <div className="flex justify-center mb-5">
                <SenseLogo size={48} animated={false} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.03em', marginBottom: 10 }}>Thank you!</h2>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65, marginBottom: 28 }}>
                Start improving your business with Sense — your AI-powered operations partner is ready to go.
              </p>
              <button
                className="w-full py-3 rounded-[12px] text-[14px] font-semibold text-white active:scale-[0.97] transition-transform"
                style={{ background: 'linear-gradient(135deg, #221E1F 0%, #0f0d0e 100%)', boxShadow: '0 6px 18px rgba(0,0,0,0.18)', border: 'none', cursor: 'pointer' }}
                onClick={onClose}>
                Start using Sense
              </button>
            </div>
          ) : (
            /* ── Plan details state ── */
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {useSubscribeLayout && <SenseLogo size={18} animated={true} />}
                  <h2 className="text-[22px] font-semibold text-[#1C1E21]">Sense</h2>
                  {!useSubscribeLayout && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(253,80,0,0.10)', color: '#FD5000', fontSize: 11, fontWeight: 600 }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  )}
                </div>
                {!isVp && (
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F8F9FB] transition-colors duration-150 -mr-1 -mt-1"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </button>
                )}
              </div>
              <p className="text-[14px] text-[#6B7280] mb-5">
                {isVp ? (
                  'Your trial has ended. Subscribe to continue using Sense.'
                ) : isTrial ? (
                  "You're on a free trial. Subscribe to keep access after your trial ends."
                ) : (
                  <>For teams who run on <span className="font-semibold text-[#1C1E21]">insights, not spreadsheets.</span></>
                )}
              </p>

              <ul className="space-y-2.5 mb-5">
                {(useSubscribeLayout ? VP_FEATURES : FEATURES).map((f) => (
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
                style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFE4D2 45%, #FFD0BA 100%)', border: '1px solid rgba(253,80,0,0.20)' }}
              >
                <div className="absolute -top-6 -right-4 w-24 h-24 rounded-full" style={{ background: 'radial-gradient(circle, rgba(253,80,0,0.28) 0%, rgba(253,80,0,0) 70%)', filter: 'blur(8px)' }} />
                <div className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.22) 0%, rgba(236,72,153,0) 70%)', filter: 'blur(10px)' }} />
                <div className="flex items-center gap-3 relative z-10">
                  <span className="text-[44px] font-bold leading-none" style={{ background: 'linear-gradient(135deg, #FD5000 0%, #F97316 40%, #EC4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>${useSubscribeLayout ? '399' : '300'}</span>
                  <div className="text-[15px] text-[#1C1E21] leading-snug">
                    <p className="font-semibold">Charged monthly,</p>
                    <p>per workspace.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onSubscribe}
                className="w-full py-3 rounded-[12px] text-[14px] font-semibold text-white transition-all duration-150"
                style={{ background: 'linear-gradient(135deg, #221E1F 0%, #0f0d0e 100%)', boxShadow: '0 6px 18px rgba(0,0,0,0.18)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
              >
                {useSubscribeLayout ? 'Subscribe to Sense' : 'Upgrade to Sense'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
