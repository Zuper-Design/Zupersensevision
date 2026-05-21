import { useEffect, useState } from 'react';
import { X, ChevronRight, ArrowUpRight, Rocket, Wrench, Sparkles, Code2 } from 'lucide-react';

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
  paragraphs: string[];
  bullets?: string[];
}

const SECTIONS: Section[] = [
  {
    key: 'releases',
    title: 'Releases',
    icon: Rocket,
    meta: 'v2.6.0 · 21 May 2026',
    paragraphs: [
      'Zuper Sense 2.6 is now generally available. The release introduces a redesigned Radar dashboard, faster answer generation across the chart engine, and a brand-new pinned-insight surface that makes it easier to keep an eye on the numbers that matter to your business.',
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

export function ReleasesModal({ open, onClose }: ReleasesModalProps) {
  const [active, setActive] = useState<SectionKey>('releases');

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
      className="fixed inset-0 z-[210] flex items-center justify-center p-6"
      style={{
        background: 'rgba(12,14,17,0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'rm_backdrop 220ms cubic-bezier(0.23,1,0.32,1) both',
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[860px] h-[560px] bg-white rounded-[20px] overflow-hidden flex"
        style={{
          boxShadow: '0 32px 80px -20px rgba(0,0,0,0.30), 0 10px 28px -10px rgba(0,0,0,0.14)',
          animation: 'rm_modalIn 300ms cubic-bezier(0.23,1,0.32,1) both',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-lg hover:bg-[#F3F4F6] active:scale-[0.94] flex items-center justify-center text-[#6B7280]"
          style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
        >
          <X className="w-[16px] h-[16px]" />
        </button>

        {/* LEFT — accordion sections */}
        <div className="w-[240px] flex-shrink-0 bg-[#FAFAFB] border-r border-[#EDEFF2] p-3 flex flex-col">
          <div className="px-2 pt-1 pb-3">
            <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#9CA3AF]">
              Changelog
            </span>
            <h2 className="text-[15px] font-semibold text-[#1C1E21] tracking-[-0.005em] mt-1">
              What shipped
            </h2>
          </div>

          <div className="flex-1 flex flex-col gap-1">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = s.key === active;
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(s.key)}
                  className="flex items-center gap-2 h-9 px-2 rounded-lg text-left active:scale-[0.985]"
                  style={{
                    background: isActive ? '#FFFFFF' : 'transparent',
                    boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.04), 0 4px 10px -6px rgba(28,30,33,0.08)' : 'none',
                    transition: 'background-color 180ms cubic-bezier(0.23,1,0.32,1), box-shadow 180ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)',
                  }}
                >
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: isActive ? '#FFF1E5' : '#F3F4F6',
                      color: isActive ? '#FD5000' : '#6B7280',
                      transition: 'background-color 180ms cubic-bezier(0.23,1,0.32,1), color 180ms cubic-bezier(0.23,1,0.32,1)',
                    }}
                  >
                    <Icon className="w-[13px] h-[13px]" strokeWidth={2.2} />
                  </span>
                  <span
                    className="text-[12.5px] font-medium flex-1 truncate"
                    style={{ color: isActive ? '#1C1E21' : '#4B5563' }}
                  >
                    {s.title}
                  </span>
                  <ChevronRight
                    className="w-3 h-3 flex-shrink-0"
                    style={{
                      color: isActive ? '#1C1E21' : '#9CA3AF',
                      transform: isActive ? 'translateX(2px)' : 'translateX(0)',
                      transition: 'color 180ms cubic-bezier(0.23,1,0.32,1), transform 180ms cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT — section detail */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto px-8 pt-12 pb-6">
            {SECTIONS.filter((s) => s.key === active).map((s) => (
              <div key={s.key}>
                <span className="inline-flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#FD5000]">
                  {s.meta}
                </span>
                <h3 className="text-[22px] font-semibold tracking-[-0.012em] text-[#1C1E21] mt-2 mb-4 leading-[1.15]">
                  {s.title}
                </h3>

                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-[13.5px] text-[#4B5563] leading-[1.6] mb-3">
                    {p}
                  </p>
                ))}

                {s.bullets && (
                  <ul className="mt-3 space-y-2.5">
                    {s.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#374151] leading-[1.55]">
                        <span
                          className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: '#FD5000' }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Footer with changelog link */}
          <div className="border-t border-[#EDEFF2] px-8 py-3 flex items-center justify-end">
            <a
              href="https://www.zuper.co/changelog"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#6B7280] hover:text-[#1C1E21]"
              style={{ transition: 'color 180ms cubic-bezier(0.23,1,0.32,1)' }}
            >
              Take me to changelog
              <ArrowUpRight className="w-[13px] h-[13px]" />
            </a>
          </div>
        </div>

        <style>{`
          @keyframes rm_backdrop { from { opacity: 0 } to { opacity: 1 } }
          @keyframes rm_modalIn {
            from { opacity: 0; transform: scale(0.96) translateY(8px) }
            to   { opacity: 1; transform: scale(1) translateY(0) }
          }
        `}</style>
      </div>
    </div>
  );
}
