import { useEffect } from 'react';
import { X, ArrowRight, Mic, Plus, TrendingUp, Star } from 'lucide-react';
import { SenseLogo } from './SenseLogo';

interface FeatureAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onTrySense?: () => void;
  onExploreMore?: () => void;
}

const CAPABILITIES = ['Monitor', 'Analyze', 'Predict', 'Recommend', 'Act'];

function CursorIcon() {
  return (
    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.18))' }}>
      <path
        d="M2 2L17.5 11.5L10.5 13L7.5 20.5L2 2Z"
        fill="#1C1E21"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniBars() {
  const bars = [40, 70, 92, 55];
  return (
    <div className="flex items-end gap-1 h-[42px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: i === 2 ? 'linear-gradient(180deg,#FF8043,#FD5000)' : '#FFD9C2',
          }}
        />
      ))}
    </div>
  );
}

function MiniDonut() {
  return (
    <div className="relative w-[44px] h-[44px] mx-auto">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(#FD5000 0% 86%, #FFE0CC 86% 100%)' }}
      />
      <div className="absolute inset-[6px] rounded-full bg-white flex items-center justify-center">
        <span className="text-[9.5px] font-semibold text-[#1C1E21]">86%</span>
      </div>
    </div>
  );
}

function MiniLine() {
  return (
    <svg viewBox="0 0 100 40" className="w-full h-[42px]">
      <defs>
        <linearGradient id="ml_g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FD5000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FD5000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 30 L18 26 L34 22 L50 24 L66 14 L82 16 L100 6" fill="none" stroke="#FD5000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 30 L18 26 L34 22 L50 24 L66 14 L82 16 L100 6 L100 40 L0 40 Z" fill="url(#ml_g)" />
    </svg>
  );
}

function MiniCardA() {
  return (
    <>
      <div className="flex items-start justify-between mb-1">
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#9CA3AF]">Unpaid</span>
        <TrendingUp className="w-3 h-3 text-[#FD5000]" />
      </div>
      <div className="text-[15px] font-semibold text-[#1C1E21] leading-none mb-2">$24.5K</div>
      <MiniBars />
    </>
  );
}

function MiniCardB() {
  return (
    <>
      <div className="flex items-start justify-between mb-1">
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#9CA3AF]">Feedback</span>
        <Star className="w-3 h-3 text-[#FD5000]" fill="#FD5000" />
      </div>
      <div className="text-[10.5px] text-[#6B7280] mb-1.5">Positive sentiment</div>
      <MiniDonut />
    </>
  );
}

function MiniCardC() {
  return (
    <>
      <div className="flex items-start justify-between mb-1">
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-[#9CA3AF]">Revenue</span>
        <span className="text-[10px] font-semibold text-[#10B981]">+12%</span>
      </div>
      <div className="text-[15px] font-semibold text-[#1C1E21] leading-none mb-2">$148K</div>
      <MiniLine />
    </>
  );
}

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
        className="relative w-full max-w-[1140px] bg-white rounded-[24px] overflow-hidden"
        style={{
          boxShadow: '0 32px 80px -20px rgba(0,0,0,0.30), 0 10px 28px -10px rgba(0,0,0,0.14)',
          animation: 'fa_modalIn 320ms cubic-bezier(0.23,1,0.32,1) both',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-lg hover:bg-[#F3F4F6] active:scale-[0.94] flex items-center justify-center text-[#6B7280]"
        >
          <X className="w-[16px] h-[16px]" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr]">
          {/* LEFT — copy */}
          <div className="px-12 py-14 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-8 self-start">
              <SenseLogo size={16} animated={false} />
              <span className="text-[11px] font-semibold tracking-[0.20em] uppercase text-[#9CA3AF]">
                Introducing Zuper Sense
              </span>
            </div>

            <h2 className="text-[40px] font-semibold tracking-[-0.012em] leading-[1.05] text-[#1C1E21] mb-6">
              The intelligent command center for your roofing business.
            </h2>

            <p className="text-[15.5px] text-[#6B7280] leading-[1.55] mb-8 max-w-[480px]">
              Sense watches your business so you don't have to, catches what's about to break, and tells you what to do next.
            </p>

            <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mb-10">
              {CAPABILITIES.map((c, i) => (
                <span key={c} className="inline-flex items-center gap-3 text-[12.5px] font-medium text-[#4B5563]">
                  {c}
                  {i < CAPABILITIES.length - 1 && <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onTrySense}
                style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1)' }}
                className="inline-flex items-center gap-1.5 px-6 h-12 rounded-xl bg-[#1C1E21] hover:bg-black text-white text-[14px] font-semibold active:scale-[0.97] hover:shadow-[0_8px_22px_-8px_rgba(0,0,0,0.30)]"
              >
                Try Sense
                <ArrowRight className="w-[15px] h-[15px]" />
              </button>
              <button
                onClick={onExploreMore}
                style={{ transition: 'color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                className="inline-flex items-center gap-1 text-[14px] font-medium text-[#6B7280] hover:text-[#1C1E21]"
              >
                Explore more
                <ArrowRight className="w-[14px] h-[14px]" />
              </button>
            </div>
          </div>

          {/* RIGHT — animated demo stage */}
          <div
            className="relative overflow-hidden"
            style={{ background: '#FFF1E5', minHeight: 580 }}
          >
            <div className="relative w-full h-[580px] px-8 py-10">
              <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#9C5340] mb-3 block">
                Live preview
              </span>

              {/* Prompt card */}
              <div
                className="relative bg-white rounded-2xl border border-white px-5 py-4"
                style={{
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 14px 32px -18px rgba(253,80,0,0.30)',
                  animation: 'fa_promptIdle 7000ms cubic-bezier(0.23,1,0.32,1) infinite',
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg,#FF8043,#FD5000)' }}
                  >
                    <SenseLogo size={11} animated={false} />
                  </div>
                  <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1C1E21]">
                    Sense
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[10.5px] font-medium text-[#9C5340]">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="absolute inset-0 rounded-full bg-[#10B981] opacity-60" style={{ animation: 'fa_ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
                      <span className="relative w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    </span>
                    Live
                  </span>
                </div>
                <p className="text-[14.5px] text-[#1C1E21] leading-relaxed mb-5">
                  How much cash is stuck in unpaid invoices?
                </p>
                <div className="flex items-center justify-between">
                  <button className="text-[12.5px] font-medium text-[#9CA3AF]">Cancel</button>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-[#E6E8EC] text-[#4B5563]">
                      <Mic className="w-[12px] h-[12px]" />
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-white text-[12.5px] font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #FF8043 0%, #FD5000 100%)',
                        animation: 'fa_generatePress 7000ms cubic-bezier(0.23,1,0.32,1) infinite',
                        transformOrigin: 'center',
                      }}
                    >
                      Generate
                      <ArrowRight className="w-[12px] h-[12px]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards row */}
              <div className="mt-5 grid grid-cols-3 gap-3" style={{ height: 168 }}>
                {[
                  { key: 'a', anim: 'fa_cardA', body: <MiniCardA /> },
                  { key: 'b', anim: 'fa_cardB', body: <MiniCardB /> },
                  { key: 'c', anim: 'fa_cardC', body: <MiniCardC /> },
                ].map((card) => (
                  <div
                    key={card.key}
                    className="relative bg-white rounded-xl border border-[#F0E4D8] p-3 flex flex-col"
                    style={{
                      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 10px 24px -16px rgba(253,80,0,0.25)',
                      animation: `${card.anim} 7000ms cubic-bezier(0.23,1,0.32,1) infinite`,
                      transformOrigin: 'center bottom',
                      opacity: 0,
                    }}
                  >
                    <div className="flex-1">{card.body}</div>
                    <button
                      className="mt-2 inline-flex items-center justify-center gap-1 h-6 rounded-md bg-[#FFF1E5] text-[#9C5340] text-[10px] font-semibold border border-[#F5DCC4]"
                      style={
                        card.key === 'a'
                          ? { animation: 'fa_addBtnPress 7000ms cubic-bezier(0.23,1,0.32,1) infinite' }
                          : undefined
                      }
                    >
                      <Plus className="w-[10px] h-[10px]" />
                      Add to Radar
                    </button>
                  </div>
                ))}
              </div>

              {/* Radar rail */}
              <div className="mt-6">
                <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#9C5340] mb-2.5 block">
                  Pinned to Radar
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {/* Filled slot — content appears when card flies in */}
                  <div className="relative h-[80px] rounded-xl border border-[#F0E4D8] bg-white overflow-hidden">
                    {/* Empty state */}
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ animation: 'fa_slotEmpty 7000ms cubic-bezier(0.23,1,0.32,1) infinite' }}
                    >
                      <div className="w-6 h-6 rounded-md border border-dashed border-[#E6CDB1] flex items-center justify-center">
                        <Plus className="w-3 h-3 text-[#C9A37D]" />
                      </div>
                    </div>
                    {/* Filled state with Card A content */}
                    <div
                      className="absolute inset-0 p-3 flex flex-col justify-between"
                      style={{ animation: 'fa_slotFilled 7000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9.5px] font-semibold tracking-[0.08em] uppercase text-[#9CA3AF]">Unpaid</span>
                        <span className="text-[11px] font-semibold text-[#1C1E21]">$24.5K</span>
                      </div>
                      <MiniBars />
                    </div>
                  </div>

                  {/* Always empty slot */}
                  <div className="relative h-[80px] rounded-xl border border-dashed border-[#E6CDB1] bg-[#FFF8EF] flex items-center justify-center">
                    <div className="w-6 h-6 rounded-md border border-dashed border-[#E6CDB1] flex items-center justify-center">
                      <Plus className="w-3 h-3 text-[#C9A37D]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated cursor */}
              <div
                className="absolute z-20 pointer-events-none"
                style={{
                  top: 0,
                  left: 0,
                  animation: 'fa_cursor 7000ms cubic-bezier(0.5,0.05,0.2,1) infinite',
                  opacity: 0,
                }}
              >
                <CursorIcon />
              </div>
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
          @keyframes fa_ping {
            0% { transform: scale(1); opacity: 0.6 }
            70% { transform: scale(2.4); opacity: 0 }
            100% { transform: scale(2.4); opacity: 0 }
          }

          /* Cursor path — coordinates in px relative to right pane (528px wide x 580px tall) */
          /* Targets:
             - Generate btn  ≈ (412, 168)
             - Card A Add btn ≈ (108, 348)
             - Off-stage      ≈ (560, 620)
          */
          @keyframes fa_cursor {
            0%   { opacity: 0; transform: translate(520px, 600px); }
            8%   { opacity: 0; transform: translate(520px, 600px); }
            14%  { opacity: 1; transform: translate(412px, 168px); }
            20%  { opacity: 1; transform: translate(412px, 168px); }
            22%  { opacity: 1; transform: translate(412px, 168px) scale(0.85); }
            25%  { opacity: 1; transform: translate(412px, 168px) scale(1); }
            42%  { opacity: 1; transform: translate(412px, 168px) scale(1); }
            50%  { opacity: 1; transform: translate(108px, 348px); }
            54%  { opacity: 1; transform: translate(108px, 348px) scale(0.85); }
            58%  { opacity: 1; transform: translate(108px, 348px) scale(1); }
            74%  { opacity: 1; transform: translate(108px, 348px) scale(1); }
            82%  { opacity: 0; transform: translate(520px, 600px); }
            100% { opacity: 0; transform: translate(520px, 600px); }
          }

          /* Generate button press at ~22% */
          @keyframes fa_generatePress {
            0%, 20% { transform: scale(1); box-shadow: 0 0 0 0 rgba(253,80,0,0); }
            22%     { transform: scale(0.94); box-shadow: 0 0 0 6px rgba(253,80,0,0.18); }
            26%     { transform: scale(1); box-shadow: 0 0 0 0 rgba(253,80,0,0); }
            100%    { transform: scale(1); }
          }

          /* Prompt card subtle press echo */
          @keyframes fa_promptIdle {
            0%, 20% { transform: translateY(0) scale(1); }
            23%     { transform: translateY(0) scale(0.992); }
            28%     { transform: translateY(0) scale(1); }
            100%    { transform: translateY(0) scale(1); }
          }

          /* Cards stagger pop after Generate (~26%) */
          @keyframes fa_cardA {
            0%, 26%  { opacity: 0; transform: translateY(12px) scale(0.94); }
            32%      { opacity: 1; transform: translateY(0) scale(1); }
            50%      { opacity: 1; transform: translateY(0) scale(1); }
            54%      { opacity: 1; transform: translateY(0) scale(1.02); }
            58%      { opacity: 1; transform: translateY(0) scale(0.98); }
            /* fly to radar slot — approx (0px right, +260px down, scale 0.78) toward filled slot */
            66%      { opacity: 1; transform: translate(-46%, 220px) scale(0.55); }
            70%      { opacity: 0; transform: translate(-46%, 220px) scale(0.55); }
            100%     { opacity: 0; transform: translate(-46%, 220px) scale(0.55); }
          }
          @keyframes fa_cardB {
            0%, 28%  { opacity: 0; transform: translateY(12px) scale(0.94); }
            34%      { opacity: 1; transform: translateY(0) scale(1); }
            82%      { opacity: 1; transform: translateY(0) scale(1); }
            88%      { opacity: 0; transform: translateY(8px) scale(0.96); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.96); }
          }
          @keyframes fa_cardC {
            0%, 30%  { opacity: 0; transform: translateY(12px) scale(0.94); }
            36%      { opacity: 1; transform: translateY(0) scale(1); }
            82%      { opacity: 1; transform: translateY(0) scale(1); }
            88%      { opacity: 0; transform: translateY(8px) scale(0.96); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.96); }
          }

          /* Add to Radar button press at ~54% */
          @keyframes fa_addBtnPress {
            0%, 52% { transform: scale(1); background: #FFF1E5; }
            54%     { transform: scale(0.92); background: #FFE0CC; }
            58%     { transform: scale(1); background: #FFF1E5; }
            100%    { transform: scale(1); }
          }

          /* Radar slot empty → filled at ~64% */
          @keyframes fa_slotEmpty {
            0%, 62% { opacity: 1; }
            66%     { opacity: 0; }
            100%    { opacity: 0; }
          }
          @keyframes fa_slotFilled {
            0%, 64% { opacity: 0; transform: scale(0.96); }
            68%     { opacity: 1; transform: scale(1); }
            82%     { opacity: 1; transform: scale(1); }
            88%     { opacity: 0; transform: scale(0.98); }
            100%    { opacity: 0; transform: scale(0.98); }
          }

          @media (prefers-reduced-motion: reduce) {
            [style*="fa_cursor"], [style*="fa_cardA"], [style*="fa_cardB"], [style*="fa_cardC"],
            [style*="fa_slotEmpty"], [style*="fa_slotFilled"], [style*="fa_addBtnPress"],
            [style*="fa_generatePress"], [style*="fa_promptIdle"], [style*="fa_ping"] {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
