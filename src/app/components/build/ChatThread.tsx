import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, ArrowRight, Check, Plus, Database, ShieldCheck, LayoutTemplate, Activity, ChevronDown, MessageSquarePlus, MessagesSquare, FileText } from 'lucide-react';
import { token } from './tokens';
import PrismGlow from './PrismGlow';
import { ReasoningCard } from './ReasoningCard';
import { CLARIFY_PLAN, CLARIFY_REASONING } from './buildData';

const PLAN_COUNT = CLARIFY_PLAN.length;
const REASONING_COUNT = CLARIFY_REASONING.length;

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
  // uploaded files that can be @-mentioned in the refine composer
  mentionables?: { id: string; name: string }[];
  // conversation threads
  threads?: BuildThread[];
  activeThreadId?: string;
  onSelectThread?: (id: string) => void;
  onNewThread?: () => void;
}

export function ChatThread(p: ThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [threadMenuOpen, setThreadMenuOpen] = useState(false);

  // ── @-mention of uploaded files ─────────────────────────────────────────
  const files = p.mentionables ?? [];
  // active @-token at the caret → null when not mentioning
  const mention = (() => {
    if (p.phase !== 'ready') return null;
    const v = p.refineDraft;
    const m = v.match(/(?:^|\s)@([\w.\-]*)$/);
    if (!m) return null;
    const q = m[1].toLowerCase();
    const hits = files.filter(f => f.name.toLowerCase().includes(q));
    return hits.length ? { query: m[1], hits } : null;
  })();
  const pickMention = (name: string) => {
    const v = p.refineDraft.replace(/@([\w.\-]*)$/, `@${name} `);
    p.onRefineChange(v);
    setTimeout(() => taRef.current?.focus(), 0);
  };
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [p.phase, p.genStep, p.refineLog.length, p.clarifyAnswer]);

  const threads = p.threads ?? [];
  const activeThread = threads.find(t => t.id === p.activeThreadId);
  const title = activeThread?.title ?? 'New conversation';

  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F8F8' }}>
      {/* header — thread title dropdown + new-thread button */}
      <div className="h-12 flex items-center gap-1 px-3 border-b flex-shrink-0 relative" style={{ borderColor: '#E1E3E6' }}>
        <button
          onClick={() => setThreadMenuOpen(o => !o)}
          className="flex items-center gap-1.5 min-w-0 h-8 px-2 rounded-lg transition-colors"
          style={{ color: token.color.text.primary }}
          onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
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
          onMouseEnter={e => { e.currentTarget.style.background = '#F0F0F0'; e.currentTarget.style.color = token.color.text.primary; }}
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
                  boxShadow: '0 8px 24px -8px rgba(0,0,0,0.18), 0 2px 6px -2px rgba(0,0,0,0.08)',
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
        {/* 1:1 with the conversation flow — user prompt → Sense reasoning card → clarify answer */}
        {p.phase === 'ready' && <Msg from="user">{p.prompt}</Msg>}

        {(p.phase === 'generating' || p.phase === 'ready') && (
          <Msg from="sense">
            <ReasoningCard reasonLine={REASONING_COUNT} planStep={PLAN_COUNT} planStarted active={false} />
          </Msg>
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
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-medium" style={{ background: token.color.brand.subtle, color: token.color.brand.primary }}>
                <Check className="w-3 h-3" /> {p.clarifyAnswer}
              </div>
            )}
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
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#959595'; e.currentTarget.style.color = '#636363'; }}
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
          style={{ border: `1px solid ${token.color.border.default}`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
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
            style={{ height: 36, background: '#FCFCFC' }}
          >
            {/* the spectrum breathes while the agent works — shared treatment
                with the home composer tray (DESIGN.md §7); WebGL retired */}
            <PrismGlow intensity={0.55} blur={18} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className="glass-soft inline-flex items-center gap-2 h-6 px-3 rounded-full"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px -6px rgba(0,0,0,0.18)' }}
              >
                <span className="prism-sweep rounded-full" style={{ width: 20, height: 4 }} />
                <span className="prism-text-shimmer text-[12px] font-medium tracking-[-0.02em]">Thinking...</span>
              </div>
            </div>
          </motion.div>
          )}
          </AnimatePresence>

          {/* @-mention suggestions */}
          {mention && (
            <div className="mx-2 mb-1 overflow-hidden rounded-xl border bg-white" style={{ borderColor: token.color.border.default, boxShadow: '0 12px 28px -16px rgba(0,0,0,0.3)' }}>
              <div className="px-3 pt-2 pb-1 text-[10.5px] font-medium uppercase tracking-wider" style={{ color: token.color.text.muted }}>Uploaded files</div>
              {mention.hits.slice(0, 5).map(f => (
                <button key={f.id} onClick={() => pickMention(f.name)}
                  className="flex w-full items-center gap-2 px-3 h-8 text-left hover:bg-[#F0F0F0] transition-colors">
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: token.color.text.muted }} />
                  <span className="text-[12.5px] truncate" style={{ color: token.color.text.primary }}>{f.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input row */}
          <div className="flex items-end gap-2 p-2">
            <button className="w-7 h-7 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0" style={{ borderColor: token.color.border.default, color: token.color.text.muted }}>
              <Plus className="w-3.5 h-3.5" />
            </button>
            <textarea
              ref={taRef}
              value={p.phase === 'ready' ? p.refineDraft : p.prompt}
              onChange={e => p.onRefineChange(e.target.value)}
              onKeyDown={e => {
                if (mention && e.key === 'Enter') { e.preventDefault(); pickMention(mention.hits[0].name); return; }
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); p.onRefineSend(); }
              }}
              rows={1}
              disabled={p.phase !== 'ready'}
              placeholder={p.phase === 'ready' ? 'Adjust the app — type @ to reference a file' : 'Building...'}
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
      style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, boxShadow: '0 12px 32px -30px rgba(0,0,0,0.5)' }}
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
          <div key={k} className="rounded-2xl px-2 py-1.5" style={{ background: '#F8F8F8', border: `1px solid ${token.color.border.hairline}` }}>
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
          style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, color: token.color.text.primary, boxShadow: '0 10px 28px -26px rgba(0,0,0,0.55)' }}>{children}</motion.div>
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
