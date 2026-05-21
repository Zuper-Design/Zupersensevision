import { useState } from 'react';
import { X, ArrowUpRight, Rocket, Wrench, Sparkles, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      'Zuper Sense 2.6 is now generally available. This release ships three major surfaces: a refreshed Sense home, the new Radar dashboard, and chat answers that come back as charts.',
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

interface Highlight {
  key: string;
  image: string;
  alt: string;
  heading: string;
  paragraphs: string[];
}

const HIGHLIGHTS: Highlight[] = [
  {
    key: 'home',
    image: '/release-home.png',
    alt: 'Sense home with suggested prompts',
    heading: 'A calmer Sense home',
    paragraphs: [
      'The Sense home now greets you by name and surfaces six suggested prompts so you can get to an answer faster — no blank slate, no thinking about what to ask first.',
      'Threads from the last 30 days appear in the left rail, and trial status is always one glance away in the top right.',
    ],
  },
  {
    key: 'radar',
    image: '/release-radar.png',
    alt: 'Radar dashboard with charts',
    heading: 'Radar dashboard',
    paragraphs: [
      'Radar is the new place to pin the insights you check most often. Revenue vs target, overdue invoices, conversion trends and crew utilisation all live side-by-side in a single, refreshable view.',
      'Every card shows when it last updated, and the whole board refreshes with one click in the top right.',
    ],
  },
  {
    key: 'chat',
    image: '/release-chat.png',
    alt: 'Chat with embedded graphs',
    heading: 'Answers come back as charts',
    paragraphs: [
      'Ask about team performance, revenue or crews and Sense replies with a chart, not just a sentence. The new Performance Dashboard card pulls active members, jobs per member, and utilisation into one compact block, with a crew-level breakdown underneath.',
      'Sense now shows which data sources it analysed, so you always know where the numbers came from.',
    ],
  },
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
            style={{ inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed z-[310] flex items-center justify-center p-6 pointer-events-none"
            style={{ inset: 0 }}
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

                        {/* Stacked screenshot + text blocks — only for Releases */}
                        {section.key === 'releases' && (
                          <div className="mt-8 space-y-8">
                            {HIGHLIGHTS.map((h) => (
                              <div key={h.key}>
                                <div
                                  className="w-full rounded-xl overflow-hidden border border-[#EDEFF2] bg-[#FAFAFB]"
                                  style={{
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 8px 18px -10px rgba(28,30,33,0.12)',
                                  }}
                                >
                                  <img
                                    src={h.image}
                                    alt={h.alt}
                                    className="block w-full h-auto"
                                  />
                                </div>
                                <h4
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    color: '#1C1E21',
                                    letterSpacing: '-0.005em',
                                    marginTop: 14,
                                    marginBottom: 6,
                                  }}
                                >
                                  {h.heading}
                                </h4>
                                {h.paragraphs.map((p, i) => (
                                  <p key={i} style={{ fontSize: 13.5, color: '#4B5563', lineHeight: 1.6, marginBottom: 8 }}>
                                    {p}
                                  </p>
                                ))}
                              </div>
                            ))}
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
