import { useEffect } from 'react';
import { X, ArrowRight, Mic, Plus, TrendingUp, Star, Sparkles, Check } from 'lucide-react';
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

function MiniBars({ accent = '#FD5000' }: { accent?: string }) {
  const bars = [40, 70, 92, 55];
  return (
    <div className="flex items-end gap-[3px] h-[28px] w-[58px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: i === 2 ? accent : '#FFD9C2',
          }}
        />
      ))}
    </div>
  );
}

function MiniDonut() {
  return (
    <div className="relative w-[30px] h-[30px]">
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(#FD5000 0% 86%, #FFE0CC 86% 100%)' }}
      />
      <div className="absolute inset-[5px] rounded-full bg-white" />
    </div>
  );
}

function MiniLine() {
  return (
    <svg viewBox="0 0 100 32" className="w-[58px] h-[28px]">
      <defs>
        <linearGradient id="ml_g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FD5000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FD5000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 26 L18 22 L34 18 L50 20 L66 10 L82 12 L100 4" fill="none" stroke="#FD5000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 26 L18 22 L34 18 L50 20 L66 10 L82 12 L100 4 L100 32 L0 32 Z" fill="url(#ml_g2)" />
    </svg>
  );
}

function StreamCard({
  icon,
  title,
  meta,
  chart,
  addBtnAnim,
  showPinned,
}: {
  icon: React.ReactNode;
  title: string;
  meta: string;
  chart: React.ReactNode;
  addBtnAnim?: string;
  showPinned?: string;
}) {
  return (
    <div
      className="relative bg-white rounded-xl border border-[#F0E4D8] px-3.5 py-3 flex items-center gap-3"
      style={{
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 8px 20px -14px rgba(253,80,0,0.20)',
      }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FFF1E5', color: '#FD5000' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-[#1C1E21] leading-tight">{title}</div>
        <div className="text-[10.5px] text-[#6B7280] mt-0.5">{meta}</div>
      </div>
      <div className="flex-shrink-0">{chart}</div>
      <button
        className="flex-shrink-0 inline-flex items-center justify-center gap-1 h-7 px-2 rounded-md bg-[#FFF1E5] text-[#9C5340] text-[10.5px] font-semibold border border-[#F5DCC4]"
        style={addBtnAnim ? { animation: `${addBtnAnim} 10000ms cubic-bezier(0.23,1,0.32,1) infinite` } : undefined}
      >
        <Plus className="w-[10px] h-[10px]" />
        Add
      </button>
      {showPinned && (
        <span
          className="absolute -top-1.5 right-3 inline-flex items-center gap-0.5 h-4 px-1.5 rounded-full bg-[#10B981] text-white text-[8.5px] font-semibold"
          style={{
            animation: `${showPinned} 10000ms cubic-bezier(0.23,1,0.32,1) infinite`,
            opacity: 0,
          }}
        >
          <Check className="w-[8px] h-[8px]" strokeWidth={3} />
          Pinned
        </span>
      )}
    </div>
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

          {/* RIGHT — multi-scene animated stage */}
          <div
            className="relative overflow-hidden"
            style={{ background: '#FFF1E5', minHeight: 580 }}
          >
            <div className="relative w-full h-[580px]">
              {/* ============ SCENE 1: Prompt ============ */}
              <div
                className="absolute inset-0 px-8 py-10 flex flex-col justify-center"
                style={{ animation: 'fa_scene1 10000ms cubic-bezier(0.23,1,0.32,1) infinite' }}
              >
                <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#9C5340] mb-4 block">
                  Try a prompt
                </span>

                <div
                  className="relative bg-white rounded-2xl border border-white px-5 py-5"
                  style={{
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 14px 32px -18px rgba(253,80,0,0.30)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3.5">
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
                  <p className="text-[15px] text-[#1C1E21] leading-relaxed mb-6">
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
                          animation: 'fa_generatePress 10000ms cubic-bezier(0.23,1,0.32,1) infinite',
                          transformOrigin: 'center',
                        }}
                      >
                        Generate
                        <ArrowRight className="w-[12px] h-[12px]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ SCENE 2: Generating (cards stream) ============ */}
              <div
                className="absolute inset-0 px-8 py-10"
                style={{ animation: 'fa_scene2 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#FF8043,#FD5000)' }}>
                      <SenseLogo size={11} animated={false} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1C1E21]">Sense</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-[10.5px] font-medium text-[#9C5340]">
                    <span style={{ animation: 'fa_thinking 1.4s cubic-bezier(0.4,0,0.6,1) infinite' }}>•</span>
                    <span style={{ animation: 'fa_thinking 1.4s cubic-bezier(0.4,0,0.6,1) infinite 0.2s' }}>•</span>
                    <span style={{ animation: 'fa_thinking 1.4s cubic-bezier(0.4,0,0.6,1) infinite 0.4s' }}>•</span>
                    <span className="ml-1">Generating</span>
                  </div>
                </div>

                <p className="text-[12.5px] text-[#6B7280] leading-relaxed mb-4">
                  Here are 3 insights for unpaid invoices.
                </p>

                <div className="space-y-2.5">
                  <div style={{ animation: 'fa_streamCard1 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}>
                    <StreamCard
                      icon={<TrendingUp className="w-3.5 h-3.5" />}
                      title="Unpaid invoices"
                      meta="$24.5K stuck across 18 customers"
                      chart={<MiniBars />}
                      addBtnAnim="fa_addBtnPress"
                      showPinned="fa_pinnedBadge"
                    />
                  </div>
                  <div style={{ animation: 'fa_streamCard2 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}>
                    <StreamCard
                      icon={<Star className="w-3.5 h-3.5" fill="currentColor" />}
                      title="Customer feedback"
                      meta="86% positive sentiment this month"
                      chart={<MiniDonut />}
                    />
                  </div>
                  <div style={{ animation: 'fa_streamCard3 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}>
                    <StreamCard
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                      title="Revenue trend"
                      meta="+12% month-over-month"
                      chart={<MiniLine />}
                    />
                  </div>
                </div>
              </div>

              {/* ============ SCENE 3: Pinned Dashboard ============ */}
              <div
                className="absolute inset-0 px-8 py-10"
                style={{ animation: 'fa_scene3 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#9C5340]">
                    Radar dashboard
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#10B981]">
                    <Check className="w-3 h-3" strokeWidth={3} />
                    Pinned
                  </span>
                </div>

                {/* Hero pinned widget */}
                <div
                  className="relative bg-white rounded-xl border border-[#F0E4D8] p-4 mb-3"
                  style={{
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 16px 36px -22px rgba(253,80,0,0.32)',
                    animation: 'fa_pinnedLand 10000ms cubic-bezier(0.23,1,0.32,1) infinite',
                    transformOrigin: 'center top',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[10.5px] font-semibold tracking-[0.10em] uppercase text-[#9CA3AF] mb-1">Unpaid invoices</div>
                      <div className="text-[20px] font-semibold text-[#1C1E21] leading-none">$24.5K</div>
                      <div className="text-[10.5px] text-[#6B7280] mt-1">18 customers · 7 day delta</div>
                    </div>
                    <div className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#FD5000] bg-[#FFF1E5] px-2 h-5 rounded-md">
                      <TrendingUp className="w-3 h-3" />
                      +8%
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5 h-[42px]">
                    {[35, 52, 68, 48, 80, 92, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: i === 5 ? 'linear-gradient(180deg,#FF8043,#FD5000)' : '#FFD9C2',
                          animation: `fa_barGrow 10000ms cubic-bezier(0.23,1,0.32,1) infinite`,
                          animationDelay: `${i * 30}ms`,
                          transformOrigin: 'bottom',
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Secondary slots */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-[78px] rounded-xl border border-dashed border-[#E6CDB1] bg-[#FFF8EF] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-6 h-6 rounded-md border border-dashed border-[#E6CDB1] flex items-center justify-center mx-auto mb-1">
                        <Plus className="w-3 h-3 text-[#C9A37D]" />
                      </div>
                      <span className="text-[9.5px] font-medium text-[#C9A37D]">Pin next</span>
                    </div>
                  </div>
                  <div className="h-[78px] rounded-xl border border-dashed border-[#E6CDB1] bg-[#FFF8EF] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-6 h-6 rounded-md border border-dashed border-[#E6CDB1] flex items-center justify-center mx-auto mb-1">
                        <Plus className="w-3 h-3 text-[#C9A37D]" />
                      </div>
                      <span className="text-[9.5px] font-medium text-[#C9A37D]">Pin next</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ============ Cursor (above all scenes) ============ */}
              <div
                className="absolute z-30 pointer-events-none top-0 left-0"
                style={{
                  animation: 'fa_cursor 10000ms cubic-bezier(0.5,0.05,0.2,1) infinite',
                  opacity: 0,
                }}
              >
                <CursorIcon />
              </div>

              {/* ============ Scene progress dots ============ */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9C5340]" style={{ animation: 'fa_dot1 10000ms linear infinite', opacity: 0.25 }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9C5340]" style={{ animation: 'fa_dot2 10000ms linear infinite', opacity: 0.25 }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#9C5340]" style={{ animation: 'fa_dot3 10000ms linear infinite', opacity: 0.25 }} />
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
          @keyframes fa_thinking {
            0%, 100% { opacity: 0.3 }
            50%      { opacity: 1 }
          }

          /* ============ SCENE CROSSFADES (10s loop) ============ */
          /* Scene 1: 0–22% live, 22–28% out, 94–100% back in */
          @keyframes fa_scene1 {
            0%      { opacity: 1; transform: translateY(0); }
            20%     { opacity: 1; transform: translateY(0); }
            26%     { opacity: 0; transform: translateY(-8px); }
            93%     { opacity: 0; transform: translateY(8px); }
            100%    { opacity: 1; transform: translateY(0); }
          }
          /* Scene 2: 22% start in, 28% live, 66% out */
          @keyframes fa_scene2 {
            0%      { opacity: 0; transform: translateY(8px); }
            22%     { opacity: 0; transform: translateY(8px); }
            28%     { opacity: 1; transform: translateY(0); }
            64%     { opacity: 1; transform: translateY(0); }
            70%     { opacity: 0; transform: translateY(-8px); }
            100%    { opacity: 0; transform: translateY(8px); }
          }
          /* Scene 3: 66% start in, 72% live, 92% out */
          @keyframes fa_scene3 {
            0%      { opacity: 0; transform: translateY(8px); }
            66%     { opacity: 0; transform: translateY(8px); }
            72%     { opacity: 1; transform: translateY(0); }
            90%     { opacity: 1; transform: translateY(0); }
            96%     { opacity: 0; transform: translateY(-8px); }
            100%    { opacity: 0; transform: translateY(8px); }
          }

          /* ============ CURSOR PATH ============ */
          /* Scene 1 Generate target ≈ (412, 320). Scene 2 Card A Add target ≈ (412, 230). */
          @keyframes fa_cursor {
            0%      { opacity: 0; transform: translate(520px, 600px) scale(1); }
            8%      { opacity: 0; transform: translate(520px, 600px); }
            13%     { opacity: 1; transform: translate(412px, 320px) scale(1); }
            17%     { opacity: 1; transform: translate(412px, 320px) scale(0.85); }
            20%     { opacity: 1; transform: translate(412px, 320px) scale(1); }
            22%     { opacity: 0; transform: translate(412px, 320px); }
            /* hidden during card streaming */
            48%     { opacity: 0; transform: translate(520px, 600px); }
            55%     { opacity: 1; transform: translate(412px, 230px) scale(1); }
            58%     { opacity: 1; transform: translate(412px, 230px) scale(0.85); }
            61%     { opacity: 1; transform: translate(412px, 230px) scale(1); }
            64%     { opacity: 0; transform: translate(412px, 230px); }
            100%    { opacity: 0; transform: translate(520px, 600px); }
          }

          /* ============ SCENE 1 — Generate press ============ */
          @keyframes fa_generatePress {
            0%, 15% { transform: scale(1); box-shadow: 0 0 0 0 rgba(253,80,0,0); }
            17%     { transform: scale(0.94); box-shadow: 0 0 0 6px rgba(253,80,0,0.18); }
            21%     { transform: scale(1); box-shadow: 0 0 0 0 rgba(253,80,0,0); }
            100%    { transform: scale(1); }
          }

          /* ============ SCENE 2 — Card stream (stagger) ============ */
          /* Card 1: enters at 32%, gets pinned at 58–62%, fades at 66% */
          @keyframes fa_streamCard1 {
            0%, 30%  { opacity: 0; transform: translateY(8px) scale(0.97); }
            34%      { opacity: 1; transform: translateY(0) scale(1); }
            56%      { opacity: 1; transform: translateY(0) scale(1); }
            60%      { opacity: 1; transform: translateY(0) scale(1.02); }
            64%      { opacity: 1; transform: translateY(0) scale(1); }
            68%      { opacity: 0; transform: translateY(-8px) scale(0.98); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.97); }
          }
          @keyframes fa_streamCard2 {
            0%, 36%  { opacity: 0; transform: translateY(8px) scale(0.97); }
            40%      { opacity: 1; transform: translateY(0) scale(1); }
            66%      { opacity: 1; transform: translateY(0) scale(1); }
            70%      { opacity: 0; transform: translateY(-4px) scale(0.98); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.97); }
          }
          @keyframes fa_streamCard3 {
            0%, 42%  { opacity: 0; transform: translateY(8px) scale(0.97); }
            46%      { opacity: 1; transform: translateY(0) scale(1); }
            66%      { opacity: 1; transform: translateY(0) scale(1); }
            70%      { opacity: 0; transform: translateY(-4px) scale(0.98); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.97); }
          }
          @keyframes fa_addBtnPress {
            0%, 56% { transform: scale(1); background: #FFF1E5; color: #9C5340; }
            58%     { transform: scale(0.9); background: #FFE0CC; }
            61%     { transform: scale(1); background: #10B981; color: #fff; }
            66%     { transform: scale(1); background: #10B981; color: #fff; }
            100%    { transform: scale(1); background: #FFF1E5; color: #9C5340; }
          }
          @keyframes fa_pinnedBadge {
            0%, 60%  { opacity: 0; transform: translateY(4px) scale(0.92); }
            63%      { opacity: 1; transform: translateY(0) scale(1); }
            68%      { opacity: 1; transform: translateY(0) scale(1); }
            100%     { opacity: 0; transform: translateY(-4px) scale(0.96); }
          }

          /* ============ SCENE 3 — Pinned dashboard ============ */
          @keyframes fa_pinnedLand {
            0%, 70% { opacity: 0; transform: scale(0.94) translateY(8px); }
            76%     { opacity: 1; transform: scale(1) translateY(0); }
            92%     { opacity: 1; transform: scale(1) translateY(0); }
            100%    { opacity: 0; transform: scale(0.96) translateY(-4px); }
          }
          @keyframes fa_barGrow {
            0%, 72% { transform: scaleY(0.2); opacity: 0.3; }
            80%     { transform: scaleY(1); opacity: 1; }
            92%     { transform: scaleY(1); opacity: 1; }
            100%    { transform: scaleY(0.2); opacity: 0.3; }
          }

          /* ============ Progress dots ============ */
          @keyframes fa_dot1 {
            0%, 22%, 94%, 100% { opacity: 1; transform: scale(1.15); }
            28%, 92%           { opacity: 0.25; transform: scale(1); }
          }
          @keyframes fa_dot2 {
            0%, 22%   { opacity: 0.25; transform: scale(1); }
            28%, 66%  { opacity: 1; transform: scale(1.15); }
            70%, 100% { opacity: 0.25; transform: scale(1); }
          }
          @keyframes fa_dot3 {
            0%, 66%    { opacity: 0.25; transform: scale(1); }
            72%, 92%   { opacity: 1; transform: scale(1.15); }
            96%, 100%  { opacity: 0.25; transform: scale(1); }
          }

          @media (prefers-reduced-motion: reduce) {
            [style*="fa_scene1"], [style*="fa_scene2"], [style*="fa_scene3"],
            [style*="fa_cursor"], [style*="fa_streamCard"], [style*="fa_addBtnPress"],
            [style*="fa_pinnedBadge"], [style*="fa_pinnedLand"], [style*="fa_barGrow"],
            [style*="fa_generatePress"], [style*="fa_ping"], [style*="fa_thinking"],
            [style*="fa_dot1"], [style*="fa_dot2"], [style*="fa_dot3"] {
              animation: none !important;
            }
            [style*="fa_scene2"], [style*="fa_scene3"], [style*="fa_streamCard"],
            [style*="fa_pinnedBadge"], [style*="fa_cursor"] {
              opacity: 0 !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
