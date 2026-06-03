import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowRight, Check, Plus, Database, ShieldCheck, LayoutTemplate, Activity, ChevronDown, MessageSquarePlus, MessagesSquare } from 'lucide-react';
import { token } from './tokens';
import PixelBlast from './PixelBlast';

type Phase = 'clarify' | 'generating' | 'ready';

export interface BuildThread {
  id: string;
  title: string;
  createdAt: string;
}

export interface ThreadProps {
  prompt: string;
  phase: Phase;
  archetype: string;
  // clarify
  clarifyQuestion?: string;
  clarifyOptions?: string[];
  clarifyAnswer?: string | null;
  onClarify?: (opt: string) => void;
  // generating
  genSteps: string[];
  genStep: number;
  genTitle: string;
  // plan
  plan: { label: string; detail: string }[];
  // refine composer
  refineDraft: string;
  onRefineChange: (v: string) => void;
  onRefineSend: () => void;
  refineLog: string[];
  onNewApp: () => void;
  isRefining?: boolean;
  // conversation threads
  threads?: BuildThread[];
  activeThreadId?: string;
  onSelectThread?: (id: string) => void;
  onNewThread?: () => void;
}

export function ChatThread(p: ThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [threadMenuOpen, setThreadMenuOpen] = useState(false);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [p.phase, p.genStep, p.refineLog.length, p.clarifyAnswer]);

  const threads = p.threads ?? [];
  const activeThread = threads.find(t => t.id === p.activeThreadId);
  const title = activeThread?.title ?? 'New conversation';

  return (
    <div className="h-full flex flex-col" style={{ background: '#F7F7F5' }}>
      {/* header — thread title dropdown + new-thread button */}
      <div className="h-12 flex items-center gap-1 px-3 border-b flex-shrink-0 relative" style={{ borderColor: '#E1E3E6' }}>
        <button
          onClick={() => setThreadMenuOpen(o => !o)}
          className="flex items-center gap-1.5 min-w-0 h-8 px-2 rounded-lg transition-colors"
          style={{ color: token.color.text.primary }}
          onMouseEnter={e => (e.currentTarget.style.background = '#EFEFEC')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span className="text-[13px] font-medium tracking-[-0.01em] truncate max-w-[220px]">{title}</span>
          <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: token.color.text.muted, transform: threadMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }} />
        </button>
        <button
          onClick={p.onNewThread}
          title="New conversation"
          className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0"
          style={{ color: token.color.text.muted }}
          onMouseEnter={e => { e.currentTarget.style.background = '#EFEFEC'; e.currentTarget.style.color = token.color.text.primary; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = token.color.text.muted; }}
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* thread dropdown */}
        <AnimatePresence>
          {threadMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setThreadMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                className="absolute left-3 top-11 z-50 w-[296px] rounded-2xl overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid ${token.color.border.default}`,
                  boxShadow: '0 8px 24px -8px rgba(28,30,33,0.18), 0 2px 6px -2px rgba(28,30,33,0.08)',
                  transformOrigin: 'top left',
                }}
              >
                <div className="px-3 pt-3 pb-1.5 flex items-center gap-1.5">
                  <MessagesSquare className="w-3.5 h-3.5" style={{ color: token.color.text.muted }} />
                  <span className="text-[10.5px] font-mono uppercase tracking-wider" style={{ color: token.color.text.muted }}>Conversations</span>
                </div>
                <div className="max-h-[280px] overflow-y-auto px-1.5 pb-1.5">
                  {threads.map(t => {
                    const active = t.id === p.activeThreadId;
                    return (
                      <button
                        key={t.id}
                        onClick={() => { p.onSelectThread?.(t.id); setThreadMenuOpen(false); }}
                        className="w-full text-left px-2.5 py-2 rounded-xl transition-colors flex items-center gap-2.5"
                        style={{ background: active ? token.color.brand.subtle : 'transparent' }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F6F6F4'; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: active ? token.color.brand.primary : token.color.border.strong }} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-medium tracking-[-0.01em] truncate" style={{ color: active ? token.color.brand.primary : token.color.text.primary }}>{t.title}</span>
                          <span className="block text-[10.5px] mt-0.5" style={{ color: token.color.text.muted }}>{t.createdAt}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t px-1.5 py-1.5" style={{ borderColor: token.color.border.hairline }}>
                  <button
                    onClick={() => { p.onNewThread?.(); setThreadMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-colors"
                    style={{ color: token.color.text.primary }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F6F6F4')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <MessageSquarePlus className="w-4 h-4" style={{ color: token.color.brand.primary }} />
                    <span className="text-[12.5px] font-medium tracking-[-0.01em]">New conversation</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {p.phase === 'ready' && <Msg from="user">{p.prompt}</Msg>}

        {(p.phase === 'generating' || p.phase === 'ready') && (
          <BuildTrace archetype={p.archetype} phase={p.phase} />
        )}

        {(p.phase === 'clarify' || p.clarifyAnswer) && p.clarifyQuestion && (
          <Msg from="sense">
            <p className="text-[13px] leading-relaxed" style={{ color: token.color.text.primary }}>{p.clarifyQuestion}</p>
            <p className="text-[11.5px] mt-1" style={{ color: token.color.text.muted }}>This changes the records that land in the app.</p>
            {!p.clarifyAnswer ? (
              <div className="flex flex-col gap-1.5 mt-3">
                {p.clarifyOptions?.map((o, i) => (
                  <button key={o} onClick={() => p.onClarify?.(o)}
                    className="group flex items-center gap-2.5 h-10 px-3 rounded-2xl text-[12.5px] text-left transition-colors"
                    style={{ border: `1px solid ${token.color.border.default}`, background: token.color.bg.surface, color: token.color.text.primary }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = token.color.text.primary)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = token.color.border.default)}>
                    <span className="w-4.5 h-4.5 rounded-md flex items-center justify-center text-[10px] font-mono flex-shrink-0" style={{ background: token.color.bg.muted, color: token.color.text.muted }}>{i + 1}</span>
                    {o}
                    <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: token.color.text.faint }} />
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11.5px]" style={{ background: token.color.brand.subtle, color: token.color.brand.primary }}>
                <Check className="w-3 h-3" /> {p.clarifyAnswer}
              </div>
            )}
          </Msg>
        )}

        {(p.phase === 'generating' || p.phase === 'ready') && (
          <Msg from="sense">
            <p className="text-[13px] font-medium mb-2.5" style={{ color: token.color.text.primary }}>{p.genTitle}</p>
            <div className="space-y-1.5 mb-3">
              {p.genSteps.map((s, i) => {
                const done = p.phase === 'ready' || i < p.genStep;
                const active = p.phase === 'generating' && i === p.genStep;
                return (
                  <div key={s} className="flex items-center gap-2 text-[12px]" style={{ opacity: done || active ? 1 : 0.3 }}>
                    {done ? <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: token.status.success.fg }} />
                      : active ? <span className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin flex-shrink-0" style={{ borderColor: token.color.brand.primary, borderTopColor: 'transparent' }} />
                      : <span className="w-3.5 h-3.5 rounded-full border flex-shrink-0" style={{ borderColor: token.color.border.default }} />}
                    <span style={{ color: done || active ? token.color.text.secondary : token.color.text.muted }}>{s}</span>
                  </div>
                );
              })}
            </div>
            <div className="rounded-[20px] overflow-hidden" style={{ border: `1px solid ${token.color.border.default}`, background: token.color.bg.surface }}>
              <div className="flex items-center gap-2 px-3 h-9" style={{ borderBottom: `1px solid ${token.color.border.hairline}` }}>
                <span className="text-[10.5px] font-mono uppercase tracking-wider" style={{ color: token.color.text.muted }}>Plan</span>
                {p.phase === 'ready' && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-medium" style={{ color: token.status.success.fg }}>
                    <Check className="w-3 h-3" /> ready
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                {p.plan.map(pl => (
                  <div key={pl.label} className="flex gap-3 text-[11.5px]">
                    <span className="w-[64px] flex-shrink-0 text-[10px] font-mono uppercase tracking-wide pt-px" style={{ color: token.color.text.muted }}>{pl.label}</span>
                    <span className="leading-relaxed" style={{ color: token.color.text.secondary }}>{pl.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </Msg>
        )}

        {p.refineLog.map((r, i) => (
          <div key={i} className="space-y-4">
            <Msg from="user">{r}</Msg>
            <Msg from="sense"><span className="inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: token.color.text.secondary }}><Check className="w-3.5 h-3.5" style={{ color: token.status.success.fg }} /> Applied to the canvas.</span></Msg>
          </div>
        ))}
      </div>

      {/* Suggested prompts — idle state only, hide when typing */}
      {p.phase === 'ready' && !p.refineDraft.trim() && !p.isRefining && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {[
            'Show overdue invoices',
            'Route unassigned jobs',
            'Quotes stuck 3+ days',
            'Assets past service date',
          ].map((s) => (
            <button
              key={s}
              onClick={() => p.onRefineChange(s)}
              className="h-6 px-2.5 rounded-full text-[11px] tracking-[-0.01em] transition-colors"
              style={{
                color: token.color.text.muted,
                border: `1px solid ${token.color.border.default}`,
                background: token.color.bg.surface,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#B497CF'; e.currentTarget.style.color = '#5B3D7A'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = token.color.border.default; e.currentTarget.style.color = token.color.text.muted; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* refine composer */}
      <div className="p-3 border-t flex-shrink-0" style={{ borderColor: '#E1E3E6' }}>
        <motion.div
          layoutId="build-prompt-card"
          layout
          transition={{ layout: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
          className="rounded-[20px] bg-white overflow-hidden"
          style={{ border: `1px solid ${token.color.border.default}`, boxShadow: '0 12px 30px -26px rgba(28,30,33,0.5)' }}
        >
          {/* Thinking tray — shown during generating and after refine send */}
          <AnimatePresence>
          {(p.isRefining || p.phase === 'generating') && (
          <motion.div
            key="refine-tray"
            initial={{ opacity: 0, transform: 'translateY(-6px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            exit={{ opacity: 0, transform: 'translateY(-4px)' }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            className="relative overflow-hidden w-full"
            style={{ height: 36, background: '#FCF4EC' }}
          >
            <div className="absolute inset-0">
              <PixelBlast
                variant="square"
                pixelSize={2}
                color="#F2B485"
                patternScale={2.5}
                patternDensity={0.8}
                enableRipples={false}
                liquid={false}
                speed={0.35}
                edgeFade={0.28}
                transparent
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="inline-flex items-center gap-2 h-6 px-3 rounded-full"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(236,139,73,0.24)',
                  boxShadow: '0 4px 16px -2px rgba(236,139,73,0.34), 0 1px 3px rgba(28,30,33,0.08)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span className="w-3 h-3 rounded-full border-2 border-[#F6E0CB] border-t-[#EC8B49] animate-spin" style={{ animationDuration: '0.7s' }} />
                <span className="text-[12px] font-semibold tracking-[-0.02em] text-[#A85A2A]">Thinking...</span>
              </div>
            </div>
          </motion.div>
          )}
          </AnimatePresence>

          {/* Input row */}
          <div className="flex items-end gap-2 p-2">
            <button className="w-7 h-7 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0" style={{ borderColor: token.color.border.default, color: token.color.text.muted }}>
              <Plus className="w-3.5 h-3.5" />
            </button>
            <textarea
              value={p.phase === 'ready' ? p.refineDraft : p.prompt}
              onChange={e => p.onRefineChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); p.onRefineSend(); } }}
              rows={1}
              disabled={p.phase !== 'ready'}
              placeholder={p.phase === 'ready' ? 'Adjust the app...' : 'Building...'}
              className="flex-1 resize-none outline-none bg-transparent text-[12.5px] leading-relaxed py-1"
              style={{ color: token.color.text.primary }}
            />
            <button onClick={p.onRefineSend} disabled={!p.refineDraft.trim() || p.phase !== 'ready'}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors disabled:opacity-30"
              style={{ background: token.color.brand.primary }}>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BuildTrace({ archetype, phase }: { archetype: string; phase: Phase }) {
  const label = archetype === 'cockpit' ? 'Cockpit' : archetype === 'kanban' ? 'Kanban' : 'Scheduler';
  const items = [
    { icon: LayoutTemplate, label: 'Intent', value: label },
    { icon: Database, label: 'Data', value: archetype === 'cockpit' ? 'Invoices' : archetype === 'kanban' ? 'Quotes' : 'Jobs' },
    { icon: ShieldCheck, label: 'RBAC', value: 'viewer-scoped' },
    { icon: Activity, label: 'States', value: '5 wired' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-[20px] p-2.5"
      style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, boxShadow: '0 12px 32px -30px rgba(28,30,33,0.5)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10.5px] font-mono uppercase tracking-wider" style={{ color: token.color.text.muted }}>Checks</span>
        <span className="inline-flex items-center gap-1 text-[10.5px]" style={{ color: phase === 'ready' ? token.status.success.fg : token.color.brand.primary }}>
          {phase === 'ready' ? <Check className="w-3 h-3" /> : <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: token.color.brand.primary }} />}
          {phase === 'ready' ? 'resolved' : 'resolving'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {items.map(({ icon: Icon, label: k, value }) => (
          <div key={k} className="rounded-2xl px-2 py-1.5" style={{ background: '#F7F7F5', border: `1px solid ${token.color.border.hairline}` }}>
            <div className="flex items-center gap-1.5">
              <Icon className="w-3 h-3" style={{ color: token.color.text.faint }} />
              <span className="text-[9.5px] font-mono uppercase tracking-wide" style={{ color: token.color.text.muted }}>{k}</span>
            </div>
            <p className="text-[11.5px] font-medium mt-0.5 truncate" style={{ color: token.color.text.primary }}>{value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Msg({ from, children }: { from: 'user' | 'sense'; children: React.ReactNode }) {
  const isUser = from === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      {isUser ? (
        <motion.div className="max-w-[88%] rounded-[22px] px-3.5 py-2.5 text-[13px] leading-relaxed"
          style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, color: token.color.text.primary, boxShadow: '0 10px 28px -26px rgba(28,30,33,0.55)' }}>{children}</motion.div>
      ) : (
        <div className="flex gap-2 max-w-[92%]">
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: token.color.brand.primary }} />
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      )}
    </motion.div>
  );
}
