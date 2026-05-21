import { useState } from 'react';
import { X, ArrowUpRight, Rocket, Wrench, Sparkles, Code2, Home, MessageSquare, Compass, CreditCard, Mic, ArrowRight, Search, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SenseLogo } from './SenseLogo';

interface ReleasesModalProps {
  open: boolean;
  onClose: () => void;
}

type SectionKey = 'releases' | 'fixes' | 'improvements' | 'api';

interface Section {
  key: SectionKey;
  title: string;
  icon: typeof Rocket;
  meta: string;
  dotColor: string;
  paragraphs: string[];
  bullets?: string[];
}

const SECTIONS: Section[] = [
  {
    key: 'releases',
    title: 'Releases',
    icon: Rocket,
    meta: 'v2.6.0 · 21 May 2026',
    dotColor: '#FD5000',
    paragraphs: [
      'Zuper Sense 2.6 is now generally available, and this release ships four major surfaces: a refreshed Sense home, chat with charts, the new Radar dashboard, and a redesigned My Subscription page.',
      'Sense answers now stream in roughly 38% faster on average, and the new charts work natively in both light and dark themes.',
    ],
    bullets: [
      'Redesigned Radar dashboard with pinnable insights',
      'Stacked bar, donut, and composed-line chart cards',
      'Customer feedback sentiment view for any timeframe',
      'New onboarding announcement for first-time users',
    ],
  },
  {
    key: 'fixes',
    title: 'Fixes',
    icon: Wrench,
    meta: '7 fixes in this release',
    dotColor: '#10B981',
    paragraphs: [
      'We squashed a handful of bugs reported by the field this cycle. Most of these were edge cases around large invoice exports, but the radar filter race condition will be a relief for anyone running multi-region dashboards.',
    ],
    bullets: [
      'Fix radar filter race condition when switching regions quickly',
      'Resolve invoice export truncation for accounts with >5K rows',
      'Repair "Pin to Radar" toast appearing twice on the same action',
      'Fix dark-mode contrast issue on the customer feedback donut',
      'Correct timezone offset in MoM revenue trend lines',
    ],
  },
  {
    key: 'improvements',
    title: 'Improvements',
    icon: Sparkles,
    meta: 'Quality of life',
    dotColor: '#8B5CF6',
    paragraphs: [
      'A pass of small refinements based on feedback from the design partner program. Most are subtle — animations are calmer, surfaces are quieter, and the keyboard shortcuts you use daily got faster.',
    ],
    bullets: [
      'Faster chart pop-in (under 220ms) for streamed answers',
      'Lighter, softer shadows across cards and modals',
      '⌘K command palette now indexes pinned Radar cards',
      'Generate button sends with ⌘↵ from any prompt input',
      'Empty Radar dashboard now suggests three starter prompts',
    ],
  },
  {
    key: 'api',
    title: 'API',
    icon: Code2,
    meta: 'Public API v3',
    dotColor: '#0EA5E9',
    paragraphs: [
      'The public Sense API graduates to v3. Authentication now uses scoped API keys, and the /insights endpoint accepts a wider set of filters so you can replicate everything Radar can do in the UI.',
      'v2 keys continue to work until 01 Aug 2026. After that, generate a v3 key from Settings → Developers.',
    ],
    bullets: [
      'POST /v3/insights with `pinned`, `category`, `timeframe`',
      'New `since` cursor pagination on /v3/answers',
      'Webhook signature header renamed to `Sense-Signature`',
      'Rate limits raised: 600 req/min on read endpoints',
    ],
  },
];

function MockHome() {
  return (
    <div className="absolute inset-0 bg-[#F8F2EC] p-2 flex flex-col">
      <div className="flex items-center gap-1 mb-1.5">
        <div className="w-2 h-2 rounded-sm" style={{ background: '#FD5000' }} />
        <div className="h-1.5 w-10 rounded-sm bg-[#1C1E21]/15" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-1.5">
        <SenseLogo size={20} animated={false} />
        <div className="h-1.5 w-20 rounded-full bg-[#1C1E21]/12" />
        <div className="h-1.5 w-14 rounded-full bg-[#1C1E21]/8" />
      </div>
      <div className="bg-white rounded-md h-7 flex items-center px-1.5 gap-1" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <Search className="w-2 h-2 text-[#9CA3AF]" />
        <div className="h-1 w-12 rounded-full bg-[#E6E8EC]" />
        <span className="ml-auto inline-flex items-center justify-center w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg,#FF8043,#FD5000)' }}>
          <ArrowRight className="w-2 h-2 text-white" strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

function MockChat() {
  const bars = [40, 60, 88, 55, 72];
  return (
    <div className="absolute inset-0 bg-[#F8F2EC] p-2 flex flex-col gap-1.5">
      {/* User message */}
      <div className="ml-auto bg-[#1C1E21] rounded-md px-1.5 py-1 max-w-[70%]">
        <div className="h-1 w-12 rounded-full bg-white/40" />
      </div>
      {/* Sense reply card */}
      <div className="bg-white rounded-md p-1.5 flex flex-col gap-1" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg,#FF8043,#FD5000)' }}>
            <SenseLogo size={6} animated={false} />
          </span>
          <div className="h-1 w-8 rounded-full bg-[#E6E8EC]" />
        </div>
        <div className="flex items-end gap-[2px] h-6 px-0.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-[1px]"
              style={{
                height: `${h}%`,
                background: i === 2 ? 'linear-gradient(180deg,#FF8043,#FD5000)' : '#FFD9C2',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MockRadar() {
  return (
    <div className="absolute inset-0 bg-[#F8F2EC] p-2">
      <div className="flex items-center gap-1 mb-1.5">
        <Compass className="w-2 h-2 text-[#FD5000]" strokeWidth={2.4} />
        <div className="h-1.5 w-10 rounded-full bg-[#1C1E21]/15" />
      </div>
      <div className="grid grid-cols-2 gap-1">
        {/* Bars card */}
        <div className="bg-white rounded-sm p-1 flex flex-col gap-0.5" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)', height: 28 }}>
          <div className="h-1 w-6 rounded-full bg-[#E6E8EC]" />
          <div className="flex items-end gap-[1.5px] h-3 mt-auto">
            <div className="flex-1 rounded-[1px] bg-[#FFD9C2]" style={{ height: '50%' }} />
            <div className="flex-1 rounded-[1px] bg-[#FFAB7E]" style={{ height: '80%' }} />
            <div className="flex-1 rounded-[1px]" style={{ height: '100%', background: 'linear-gradient(180deg,#FF8043,#FD5000)' }} />
          </div>
        </div>
        {/* Donut card */}
        <div className="bg-white rounded-sm p-1 flex items-center gap-1" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)', height: 28 }}>
          <div className="relative w-3.5 h-3.5 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: 'conic-gradient(#FD5000 0% 70%, #FFD9C2 70% 100%)' }}
            />
            <div className="absolute inset-[2px] rounded-full bg-white" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <div className="h-1 w-6 rounded-full bg-[#E6E8EC]" />
            <div className="h-1 w-4 rounded-full bg-[#F0F0F2]" />
          </div>
        </div>
        {/* Line card */}
        <div className="bg-white rounded-sm p-1 flex flex-col gap-0.5" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)', height: 28 }}>
          <div className="h-1 w-7 rounded-full bg-[#E6E8EC]" />
          <svg viewBox="0 0 60 16" preserveAspectRatio="none" className="w-full h-3 mt-auto">
            <path d="M0 12 L12 9 L24 10 L36 5 L48 6 L60 2" fill="none" stroke="#FD5000" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        {/* Metric card */}
        <div className="bg-white rounded-sm p-1 flex flex-col justify-center" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04)', height: 28 }}>
          <div className="h-1 w-5 rounded-full bg-[#E6E8EC] mb-0.5" />
          <div className="text-[7.5px] font-semibold text-[#1C1E21] leading-none">$24K</div>
        </div>
      </div>
    </div>
  );
}

function MockSubscription() {
  return (
    <div className="absolute inset-0 bg-[#F8F2EC] p-2 flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <CreditCard className="w-2 h-2 text-[#FD5000]" strokeWidth={2.4} />
        <div className="h-1.5 w-14 rounded-full bg-[#1C1E21]/15" />
      </div>
      {/* Plan card */}
      <div className="bg-white rounded-md p-1.5 flex flex-col gap-1" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div className="flex items-center justify-between">
          <div className="h-1 w-8 rounded-full bg-[#E6E8EC]" />
          <span className="inline-flex items-center px-1 h-2.5 rounded-sm text-[6px] font-semibold text-white" style={{ background: 'linear-gradient(135deg,#FF8043,#FD5000)' }}>PRO</span>
        </div>
        <div className="text-[10px] font-semibold text-[#1C1E21] leading-none">$29<span className="text-[6px] font-medium text-[#9CA3AF]">/mo</span></div>
        <div className="h-[1px] bg-[#F0F0F2] my-0.5" />
        <div className="flex items-center justify-between">
          <div className="h-1 w-10 rounded-full bg-[#F0F0F2]" />
          <Star className="w-2 h-2 text-[#FD5000]" fill="#FD5000" strokeWidth={0} />
        </div>
      </div>
      {/* CTA */}
      <div className="rounded-sm h-3.5 flex items-center justify-center gap-1" style={{ background: '#1C1E21' }}>
        <div className="h-0.5 w-6 rounded-full bg-white/50" />
      </div>
    </div>
  );
}

const HIGHLIGHTS = [
  { key: 'home', label: 'Sense home', desc: 'Cleaner start screen', mock: MockHome },
  { key: 'chat', label: 'Chat with charts', desc: 'Answers as graphs', mock: MockChat },
  { key: 'radar', label: 'Radar dashboard', desc: 'Pin & monitor', mock: MockRadar },
  { key: 'subscription', label: 'My subscription', desc: 'Plan & billing', mock: MockSubscription },
];

export function ReleasesModal({ open, onClose }: ReleasesModalProps) {
  const [active, setActive] = useState<SectionKey>('releases');
  const section = SECTIONS.find((s) => s.key === active)!;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed bg-black/40 backdrop-blur-sm z-[300]"
            style={{ top: 44, left: 72, right: 0, bottom: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-[310] flex items-center justify-center p-6 pointer-events-none"
            style={{ top: 44, left: 72, right: 0, bottom: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="pointer-events-auto w-full overflow-hidden"
              style={{
                maxWidth: 980,
                borderRadius: 16,
                background: '#fff',
                boxShadow: '0 24px 80px rgba(20,20,30,0.20)',
                height: '70vh',
                maxHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
              }}
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-7 pt-6 pb-4">
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.025em', marginBottom: 3 }}>
                    What's new in Sense
                  </h2>
                  <p style={{ fontSize: 14, color: '#9CA3AF' }}>
                    Releases, fixes, improvements, and API updates
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors"
                >
                  <X className="w-4 h-4 text-[#9CA3AF]" />
                </button>
              </div>

              {/* Body — two columns */}
              <div className="flex-1 min-h-0 flex">
                {/* LEFT — nav */}
                <div className="w-[220px] flex-shrink-0 px-3 py-2 overflow-y-auto" style={{ borderRight: '1px solid #F0F2F5' }}>
                  <div className="flex flex-col gap-0.5">
                    {SECTIONS.map((s) => {
                      const Icon = s.icon;
                      const isActive = s.key === active;
                      return (
                        <button
                          key={s.key}
                          onClick={() => setActive(s.key)}
                          className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-left active:scale-[0.985] transition-colors"
                          style={{
                            background: isActive ? '#F5F6F8' : 'transparent',
                          }}
                          onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#FAFAFB'; }}
                          onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <Icon
                            className="w-[14px] h-[14px] flex-shrink-0"
                            style={{ color: isActive ? '#1C1E21' : '#9CA3AF' }}
                            strokeWidth={2}
                          />
                          <span
                            className="text-[13px] flex-1 truncate"
                            style={{
                              fontWeight: isActive ? 600 : 500,
                              color: isActive ? '#1C1E21' : '#4B5563',
                            }}
                          >
                            {s.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RIGHT — content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex-1 overflow-y-auto px-7 py-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={section.key}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.14 }}
                      >
                        {/* Cover banner — only for Releases */}
                        {section.key === 'releases' && (
                          <div
                            className="relative rounded-xl overflow-hidden mb-5 flex items-center justify-center"
                            style={{
                              height: 132,
                              background:
                                'linear-gradient(135deg, #FFD2B3 0%, #FFAB7E 45%, #FF8043 100%)',
                              boxShadow:
                                '0 1px 2px rgba(0,0,0,0.04), 0 14px 28px -18px rgba(253,80,0,0.45)',
                            }}
                          >
                            {/* Soft highlight */}
                            <span
                              className="absolute pointer-events-none"
                              style={{
                                top: -40,
                                right: -30,
                                width: 200,
                                height: 140,
                                borderRadius: '50%',
                                background:
                                  'radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)',
                                filter: 'blur(10px)',
                              }}
                            />
                            {/* Bottom soft fade */}
                            <span
                              className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
                              style={{
                                background:
                                  'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 100%)',
                              }}
                            />
                            {/* Logo tile */}
                            <div
                              className="relative w-14 h-14 rounded-2xl bg-white flex items-center justify-center"
                              style={{
                                boxShadow:
                                  '0 1px 2px rgba(0,0,0,0.04), 0 12px 24px -10px rgba(253,80,0,0.55), 0 0 0 1px rgba(255,255,255,0.4)',
                              }}
                            >
                              <SenseLogo size={28} animated={false} />
                            </div>
                          </div>
                        )}

                        <span style={{ fontSize: 11, fontWeight: 500, color: '#B0B4BE', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                          {section.meta}
                        </span>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em', marginTop: 4, marginBottom: 16, lineHeight: 1.2 }}>
                          {section.title}
                        </h3>

                        {section.paragraphs.map((p, i) => (
                          <p key={i} style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, marginBottom: 12 }}>
                            {p}
                          </p>
                        ))}

                        {section.bullets && (
                          <ul className="mt-4 space-y-2.5">
                            {section.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2.5" style={{ fontSize: 13.5, color: '#374151', lineHeight: 1.55 }}>
                                <span
                                  className="mt-[8px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ background: section.dotColor }}
                                />
                                {b}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* 4 highlight screenshots — only for Releases */}
                        {section.key === 'releases' && (
                          <div className="mt-7">
                            <span style={{ fontSize: 11, fontWeight: 500, color: '#B0B4BE', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                              The 4 major releases
                            </span>
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              {HIGHLIGHTS.map(({ key, label, desc, mock: Mock }) => (
                                <div key={key}>
                                  <div
                                    className="relative w-full rounded-lg overflow-hidden border border-[#EDEFF2]"
                                    style={{
                                      aspectRatio: '4 / 3',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 6px 14px -8px rgba(28,30,33,0.10)',
                                    }}
                                  >
                                    <Mock />
                                  </div>
                                  <div className="mt-1.5 flex items-baseline gap-1.5">
                                    <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1C1E21' }}>{label}</span>
                                    <span style={{ fontSize: 11.5, color: '#9CA3AF' }}>{desc}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Footer */}
                  <div className="px-7 py-3 flex items-center justify-end" style={{ borderTop: '1px solid #F0F2F5' }}>
                    <a
                      href="https://www.zuper.co/changelog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 transition-colors"
                      style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#1C1E21')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#6B7280')}
                    >
                      Take me to changelog
                      <ArrowUpRight className="w-[13px] h-[13px]" />
                    </a>
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
