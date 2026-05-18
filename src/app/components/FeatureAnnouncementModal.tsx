import { useEffect } from 'react';
import { X, ArrowRight, Mic, Plus, TrendingUp, Star, Sparkles, Users, Check, Bell, Target } from 'lucide-react';
import { SenseLogo } from './SenseLogo';

interface FeatureAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onTrySense?: () => void;
  onExploreMore?: () => void;
}

const FEATURES = [
  {
    icon: Bell,
    title: 'Catches what’s about to break',
    desc: 'Sense watches your data and flags problems early—before they become incidents.',
  },
  {
    icon: Sparkles,
    title: 'Answers in plain English',
    desc: 'Ask anything. Get a chart back in seconds, not a 30-minute spreadsheet detour.',
  },
  {
    icon: Target,
    title: 'Your insights, on demand',
    desc: 'Pin any answer to Radar and check the numbers at a glance, anytime.',
  },
];

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

/* ====== Mini charts (sized for square cards) ====== */

function ChartBars() {
  const bars = [40, 65, 88, 52, 78];
  return (
    <div className="flex items-end gap-[3px] h-[34px] w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-[2px]"
          style={{
            height: `${h}%`,
            background: i === 2 ? 'linear-gradient(180deg,#FF8043,#FD5000)' : '#FFD9C2',
          }}
        />
      ))}
    </div>
  );
}

function ChartSentiment() {
  return (
    <div className="w-full">
      <div className="flex h-[6px] rounded-full overflow-hidden">
        <div className="h-full" style={{ width: '86%', background: 'linear-gradient(90deg,#FF8043,#FD5000)' }} />
        <div className="h-full" style={{ width: '10%', background: '#FFD9C2' }} />
        <div className="h-full" style={{ width: '4%', background: '#FFE9D6' }} />
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span className="inline-flex items-center gap-1 text-[9.5px] text-[#6B7280]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FD5000' }} />Positive
        </span>
        <span className="inline-flex items-center gap-1 text-[9.5px] text-[#9CA3AF]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#FFD9C2' }} />Neutral
        </span>
      </div>
    </div>
  );
}

function ChartLine() {
  return (
    <svg viewBox="0 0 100 34" preserveAspectRatio="none" className="w-full h-[34px]">
      <defs>
        <linearGradient id="ch_line_g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FD5000" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FD5000" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 28 L14 24 L28 18 L42 22 L56 12 L70 16 L84 8 L100 4" fill="none" stroke="#FD5000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d="M0 28 L14 24 L28 18 L42 22 L56 12 L70 16 L84 8 L100 4 L100 34 L0 34 Z" fill="url(#ch_line_g)" />
      <circle cx="100" cy="4" r="2.4" fill="#FD5000" stroke="#fff" strokeWidth="1.2" />
    </svg>
  );
}

function ChartProgress({ value = 92 }: { value?: number }) {
  return (
    <div className="w-full">
      <div className="relative h-1.5 w-full rounded-full bg-[#FFE9D6] overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${value}%`, background: 'linear-gradient(90deg,#FF8043,#FD5000)' }} />
      </div>
      <div className="flex items-center justify-between mt-2 text-[9.5px] text-[#6B7280]">
        <span>14 crews active</span>
        <span className="text-[#1C1E21] font-semibold">{value}%</span>
      </div>
    </div>
  );
}

/* ====== Grid Card ====== */

function GridCard({
  icon,
  label,
  value,
  chart,
  delta,
  deltaDir = 'up',
  addBtnAnim,
  ringAnim,
  pinnedBadgeAnim,
  iconBg = '#FFF1E5',
  iconColor = '#FD5000',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  chart: React.ReactNode;
  delta?: string;
  deltaDir?: 'up' | 'down';
  addBtnAnim?: string;
  ringAnim?: string;
  pinnedBadgeAnim?: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div
      className="relative bg-white rounded-2xl border border-[#EDE5DA] p-4 aspect-square flex flex-col"
      style={{
        boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 10px 28px -20px rgba(28,30,33,0.20)',
        ...(ringAnim ? { animation: `${ringAnim} 10000ms cubic-bezier(0.23,1,0.32,1) infinite` } : {}),
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <button
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#F8F4EE] text-[#9C5340]"
          style={addBtnAnim ? { animation: `${addBtnAnim} 10000ms cubic-bezier(0.23,1,0.32,1) infinite` } : undefined}
          aria-label="Add to Radar"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2.4} />
        </button>
      </div>

      <div className="mt-auto">
        <div className="text-[9.5px] font-semibold tracking-[0.12em] uppercase text-[#9CA3AF] mb-1">
          {label}
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-[22px] font-semibold text-[#1C1E21] leading-none tracking-[-0.01em]">{value}</span>
          {delta && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-semibold leading-none pb-[3px]"
              style={{ color: deltaDir === 'up' ? '#10B981' : '#EF4444' }}
            >
              <TrendingUp className="w-2.5 h-2.5" style={deltaDir === 'down' ? { transform: 'rotate(180deg)' } : undefined} />
              {delta}
            </span>
          )}
        </div>
        {chart}
      </div>

      {pinnedBadgeAnim && (
        <span
          className="absolute -top-2 right-3 inline-flex items-center gap-1 h-5 px-2 rounded-full bg-[#10B981] text-white text-[9.5px] font-semibold z-10"
          style={{
            animation: `${pinnedBadgeAnim} 10000ms cubic-bezier(0.23,1,0.32,1) infinite`,
            opacity: 0,
            boxShadow: '0 4px 10px -4px rgba(16,185,129,0.45)',
          }}
        >
          <Check className="w-[10px] h-[10px]" strokeWidth={3} />
          Pinned
        </span>
      )}
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="aspect-square rounded-2xl border border-dashed border-[#E6CDB1] bg-[#FFF8EF]/60 flex items-center justify-center">
      <div className="text-center">
        <div className="w-7 h-7 rounded-lg border border-dashed border-[#E6CDB1] flex items-center justify-center mx-auto mb-1.5 bg-white/40">
          <Plus className="w-3.5 h-3.5 text-[#C9A37D]" />
        </div>
        <span className="text-[9.5px] font-semibold tracking-[0.06em] text-[#C9A37D]">Pin insight</span>
      </div>
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
          {/* LEFT */}
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

            <div className="flex flex-col gap-4 mb-10 max-w-[460px]">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#FFF1E5', color: '#FD5000' }}>
                      <Icon className="w-[16px] h-[16px]" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14.5px] font-semibold text-[#1C1E21] tracking-[-0.005em] leading-snug mb-0.5">
                        {f.title}
                      </div>
                      <div className="text-[13.5px] text-[#6B7280] leading-[1.5]">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
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

          {/* RIGHT — animated stage */}
          <div
            className="relative overflow-hidden"
            style={{ background: '#FFF1E5', minHeight: 620 }}
          >
            <div className="relative w-full h-[620px]">
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
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#FF8043,#FD5000)' }}>
                      <SenseLogo size={11} animated={false} />
                    </div>
                    <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1C1E21]">Sense</span>
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

              {/* ============ SCENE 2: Generating (2×2 grid) ============ */}
              <div
                className="absolute inset-0 px-8 py-10"
                style={{ animation: 'fa_scene2 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
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
                  Here are 4 insights based on your data.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div style={{ animation: 'fa_streamCard1 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}>
                    <GridCard
                      icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={2.4} />}
                      label="Unpaid invoices"
                      value="$24.5K"
                      delta="+8%"
                      deltaDir="up"
                      chart={<ChartBars />}
                      addBtnAnim="fa_addBtnPress"
                      ringAnim="fa_cardRing"
                      pinnedBadgeAnim="fa_pinnedBadge"
                    />
                  </div>
                  <div style={{ animation: 'fa_streamCard2 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}>
                    <GridCard
                      icon={<Star className="w-3.5 h-3.5" fill="currentColor" />}
                      label="Customer feedback"
                      value="86%"
                      delta="+4pp"
                      deltaDir="up"
                      chart={<ChartSentiment />}
                    />
                  </div>
                  <div style={{ animation: 'fa_streamCard3 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}>
                    <GridCard
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                      label="Revenue MoM"
                      value="$148K"
                      delta="+12%"
                      deltaDir="up"
                      chart={<ChartLine />}
                    />
                  </div>
                  <div style={{ animation: 'fa_streamCard4 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}>
                    <GridCard
                      icon={<Users className="w-3.5 h-3.5" strokeWidth={2.4} />}
                      label="Crew utilization"
                      value="92%"
                      delta="+3pp"
                      deltaDir="up"
                      chart={<ChartProgress value={92} />}
                    />
                  </div>
                </div>
              </div>

              {/* ============ SCENE 3: Pinned dashboard (2×2 grid) ============ */}
              <div
                className="absolute inset-0 px-8 py-10"
                style={{ animation: 'fa_scene3 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#9C5340]">
                    Radar dashboard
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#10B981]">
                    <Check className="w-3 h-3" strokeWidth={3} />
                    Pinned
                  </span>
                </div>

                <p className="text-[12.5px] text-[#6B7280] leading-relaxed mb-4">
                  Insights you pin show up here automatically.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div style={{ animation: 'fa_pinnedLand 10000ms cubic-bezier(0.23,1,0.32,1) infinite', opacity: 0, transformOrigin: 'center top' }}>
                    <GridCard
                      icon={<TrendingUp className="w-3.5 h-3.5" strokeWidth={2.4} />}
                      label="Unpaid invoices"
                      value="$24.5K"
                      delta="+8%"
                      deltaDir="up"
                      chart={<ChartBars />}
                    />
                  </div>
                  <EmptySlot />
                  <EmptySlot />
                  <EmptySlot />
                </div>
              </div>

              {/* ============ Cursor ============ */}
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
          @keyframes fa_backdrop { from { opacity: 0 } to { opacity: 1 } }
          @keyframes fa_modalIn {
            from { opacity: 0; transform: scale(0.96) translateY(8px) }
            to   { opacity: 1; transform: scale(1) translateY(0) }
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

          /* ===== Scenes (10s loop) ===== */
          @keyframes fa_scene1 {
            0%   { opacity: 1; transform: translateY(0); }
            20%  { opacity: 1; transform: translateY(0); }
            26%  { opacity: 0; transform: translateY(-8px); }
            93%  { opacity: 0; transform: translateY(8px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fa_scene2 {
            0%   { opacity: 0; transform: translateY(8px); }
            22%  { opacity: 0; transform: translateY(8px); }
            28%  { opacity: 1; transform: translateY(0); }
            64%  { opacity: 1; transform: translateY(0); }
            70%  { opacity: 0; transform: translateY(-8px); }
            100% { opacity: 0; transform: translateY(8px); }
          }
          @keyframes fa_scene3 {
            0%   { opacity: 0; transform: translateY(8px); }
            66%  { opacity: 0; transform: translateY(8px); }
            72%  { opacity: 1; transform: translateY(0); }
            90%  { opacity: 1; transform: translateY(0); }
            96%  { opacity: 0; transform: translateY(-8px); }
            100% { opacity: 0; transform: translateY(8px); }
          }

          /* ===== Cursor path =====
             Scene 1 Generate ≈ (412, 340).
             Scene 2 Card A "+" ≈ (218, 280). */
          @keyframes fa_cursor {
            0%   { opacity: 0; transform: translate(520px, 640px); }
            8%   { opacity: 0; transform: translate(520px, 640px); }
            13%  { opacity: 1; transform: translate(412px, 340px) scale(1); }
            17%  { opacity: 1; transform: translate(412px, 340px) scale(0.85); }
            20%  { opacity: 1; transform: translate(412px, 340px) scale(1); }
            22%  { opacity: 0; transform: translate(412px, 340px); }
            48%  { opacity: 0; transform: translate(520px, 640px); }
            55%  { opacity: 1; transform: translate(218px, 280px) scale(1); }
            58%  { opacity: 1; transform: translate(218px, 280px) scale(0.85); }
            61%  { opacity: 1; transform: translate(218px, 280px) scale(1); }
            64%  { opacity: 0; transform: translate(218px, 280px); }
            100% { opacity: 0; transform: translate(520px, 640px); }
          }

          /* ===== Scene 1 Generate press ===== */
          @keyframes fa_generatePress {
            0%, 15% { transform: scale(1); box-shadow: 0 0 0 0 rgba(253,80,0,0); }
            17%     { transform: scale(0.94); box-shadow: 0 0 0 6px rgba(253,80,0,0.18); }
            21%     { transform: scale(1); box-shadow: 0 0 0 0 rgba(253,80,0,0); }
            100%    { transform: scale(1); }
          }

          /* ===== Scene 2 card stagger (top-left, top-right, bottom-left, bottom-right) ===== */
          @keyframes fa_streamCard1 {
            0%, 30%  { opacity: 0; transform: translateY(8px) scale(0.97); }
            34%      { opacity: 1; transform: translateY(0) scale(1); }
            66%      { opacity: 1; transform: translateY(0) scale(1); }
            70%      { opacity: 0; transform: translateY(-8px) scale(0.98); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.97); }
          }
          @keyframes fa_streamCard2 {
            0%, 33%  { opacity: 0; transform: translateY(8px) scale(0.97); }
            37%      { opacity: 1; transform: translateY(0) scale(1); }
            66%      { opacity: 1; transform: translateY(0) scale(1); }
            70%      { opacity: 0; transform: translateY(-4px) scale(0.98); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.97); }
          }
          @keyframes fa_streamCard3 {
            0%, 37%  { opacity: 0; transform: translateY(8px) scale(0.97); }
            41%      { opacity: 1; transform: translateY(0) scale(1); }
            66%      { opacity: 1; transform: translateY(0) scale(1); }
            70%      { opacity: 0; transform: translateY(-4px) scale(0.98); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.97); }
          }
          @keyframes fa_streamCard4 {
            0%, 41%  { opacity: 0; transform: translateY(8px) scale(0.97); }
            45%      { opacity: 1; transform: translateY(0) scale(1); }
            66%      { opacity: 1; transform: translateY(0) scale(1); }
            70%      { opacity: 0; transform: translateY(-4px) scale(0.98); }
            100%     { opacity: 0; transform: translateY(8px) scale(0.97); }
          }

          /* Card 1 ring highlight on pin */
          @keyframes fa_cardRing {
            0%, 56%  { box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 28px -20px rgba(28,30,33,0.20); border-color: #EDE5DA; }
            60%      { box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 28px -20px rgba(28,30,33,0.20), 0 0 0 3px rgba(16,185,129,0.20); border-color: #10B981; }
            66%      { box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 28px -20px rgba(28,30,33,0.20), 0 0 0 0 rgba(16,185,129,0); border-color: #10B981; }
            70%      { box-shadow: 0 1px 2px rgba(0,0,0,0.04), 0 10px 28px -20px rgba(28,30,33,0.20); border-color: #EDE5DA; }
            100%     { border-color: #EDE5DA; }
          }
          @keyframes fa_addBtnPress {
            0%, 56% { transform: scale(1); background: #F8F4EE; color: #9C5340; }
            58%     { transform: scale(0.88); background: #FFE0CC; }
            61%     { transform: scale(1); background: #10B981; color: #fff; }
            66%     { transform: scale(1); background: #10B981; color: #fff; }
            100%    { transform: scale(1); background: #F8F4EE; color: #9C5340; }
          }
          @keyframes fa_pinnedBadge {
            0%, 60%  { opacity: 0; transform: translateY(4px) scale(0.92); }
            63%      { opacity: 1; transform: translateY(0) scale(1); }
            68%      { opacity: 1; transform: translateY(0) scale(1); }
            100%     { opacity: 0; transform: translateY(-4px) scale(0.96); }
          }

          /* ===== Scene 3 pinned card land ===== */
          @keyframes fa_pinnedLand {
            0%, 70% { opacity: 0; transform: scale(0.94) translateY(8px); }
            76%     { opacity: 1; transform: scale(1) translateY(0); }
            92%     { opacity: 1; transform: scale(1) translateY(0); }
            100%    { opacity: 0; transform: scale(0.96) translateY(-4px); }
          }

          /* ===== Progress dots ===== */
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
            0%, 66%   { opacity: 0.25; transform: scale(1); }
            72%, 92%  { opacity: 1; transform: scale(1.15); }
            96%, 100% { opacity: 0.25; transform: scale(1); }
          }

          @media (prefers-reduced-motion: reduce) {
            [style*="fa_scene1"], [style*="fa_scene2"], [style*="fa_scene3"],
            [style*="fa_cursor"], [style*="fa_streamCard"], [style*="fa_addBtnPress"],
            [style*="fa_pinnedBadge"], [style*="fa_pinnedLand"], [style*="fa_cardRing"],
            [style*="fa_generatePress"], [style*="fa_ping"], [style*="fa_thinking"],
            [style*="fa_dot1"], [style*="fa_dot2"], [style*="fa_dot3"] {
              animation: none !important;
            }
            [style*="fa_scene2"], [style*="fa_scene3"], [style*="fa_streamCard"],
            [style*="fa_pinnedBadge"], [style*="fa_pinnedLand"], [style*="fa_cursor"] {
              opacity: 0 !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
