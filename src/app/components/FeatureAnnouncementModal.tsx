import { useEffect } from 'react';
import { X, ArrowRight, Mic } from 'lucide-react';
import { SenseLogo } from './SenseLogo';

interface FeatureAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onTrySense?: () => void;
  onExploreMore?: () => void;
}

const CAPABILITIES = ['Monitor', 'Analyze', 'Predict', 'Recommend', 'Act'];

export function FeatureAnnouncementModal({ open, onClose, onTrySense, onExploreMore }: FeatureAnnouncementModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{
        background: 'rgba(12,14,17,0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'fa_backdrop 220ms cubic-bezier(0.23,1,0.32,1) both',
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[960px] bg-white rounded-[20px] overflow-hidden"
        style={{
          boxShadow: '0 28px 64px -16px rgba(0,0,0,0.28), 0 8px 24px -8px rgba(0,0,0,0.14)',
          animation: 'fa_modalIn 320ms cubic-bezier(0.23,1,0.32,1) both',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg hover:bg-[#F3F4F6] active:scale-[0.94] flex items-center justify-center text-[#6B7280]"
        >
          <X className="w-[16px] h-[16px]" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
          {/* LEFT — copy */}
          <div className="px-10 py-12 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 mb-7 self-start">
              <SenseLogo size={14} animated={false} />
              <span className="text-[10.5px] font-semibold tracking-[0.20em] uppercase text-[#9CA3AF]">
                Introducing Zuper Sense
              </span>
            </div>

            <h2 className="text-[34px] font-semibold tracking-[-0.01em] leading-[1.05] text-[#1C1E21] mb-5">
              The intelligent command center for your roofing business.
            </h2>

            <p className="text-[14.5px] text-[#6B7280] leading-[1.55] mb-7 max-w-[440px]">
              Sense watches your business so you don't have to, catches what's about to break, and tells you what to do next.
            </p>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mb-9">
              {CAPABILITIES.map((c, i) => (
                <span key={c} className="inline-flex items-center gap-3 text-[12px] font-medium text-[#4B5563]">
                  {c}
                  {i < CAPABILITIES.length - 1 && <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onTrySense}
                style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1)' }}
                className="inline-flex items-center gap-1.5 px-5 h-11 rounded-xl bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold active:scale-[0.97] hover:shadow-[0_8px_22px_-8px_rgba(0,0,0,0.30)]"
              >
                Try Sense
                <ArrowRight className="w-[14px] h-[14px]" />
              </button>
              <button
                onClick={onExploreMore}
                style={{ transition: 'color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                className="inline-flex items-center gap-1 text-[13.5px] font-medium text-[#6B7280] hover:text-[#1C1E21]"
              >
                Explore more
                <ArrowRight className="w-[13px] h-[13px]" />
              </button>
            </div>
          </div>

          {/* RIGHT — prompt preview */}
          <div
            className="relative px-8 py-12 flex flex-col justify-center"
            style={{ background: 'linear-gradient(180deg, #FAFAFB 0%, #FFFFFF 100%)' }}
          >
            {/* Subtle dot grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.55]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="faDots" width="18" height="18" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.7" fill="#1C1E21" opacity="0.07" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#faDots)" />
            </svg>

            <div className="relative">
              <span className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF] mb-3 block">
                Try a prompt
              </span>
              <div
                className="relative bg-white rounded-2xl border border-[#E6E8EC] px-5 py-4"
                style={{
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 12px 28px -16px rgba(253,80,0,0.18)',
                }}
              >
                <p className="text-[14.5px] text-[#1C1E21] leading-relaxed mb-7">
                  How much cash is stuck in unpaid invoices?
                </p>
                <div className="flex items-center justify-between">
                  <button
                    style={{ transition: 'color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                    className="text-[12.5px] font-medium text-[#9CA3AF] hover:text-[#1C1E21]"
                  >
                    Cancel
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                      className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/30 text-[#4B5563] text-[12.5px] font-medium active:scale-[0.96]"
                    >
                      <Mic className="w-[12px] h-[12px]" />
                      Voice
                    </button>
                    <button
                      onClick={onTrySense}
                      style={{
                        transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1)',
                        background: 'linear-gradient(135deg, #FF8043 0%, #FD5000 100%)',
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-white text-[12.5px] font-semibold active:scale-[0.96] hover:shadow-[0_6px_16px_-6px_rgba(253,80,0,0.50)]"
                    >
                      Generate
                      <ArrowRight className="w-[12px] h-[12px]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* hint */}
              <p className="text-[11.5px] text-[#9CA3AF] mt-3 text-center">
                Sense answers with the right chart in seconds.
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fa_backdrop {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes fa_modalIn {
            from { opacity: 0; transform: scale(0.96) translateY(8px) }
            to { opacity: 1; transform: scale(1) translateY(0) }
          }
        `}</style>
      </div>
    </div>
  );
}
