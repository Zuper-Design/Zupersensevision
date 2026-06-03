import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Zap, ArrowRight, Plus } from 'lucide-react';
import { QUOTE_TRIGGERS, type Trigger } from './buildData';
import { token } from './tokens';

// Triggers / automation surface (Spec 1 §2 logic, §5e).
// `on event → action`; rules compile to Zuper's existing rules engine, not a parallel one.
export function AutomationPanel({ onClose }: { onClose: () => void }) {
  const [triggers, setTriggers] = useState<Trigger[]>(QUOTE_TRIGGERS);
  const toggle = (id: string) => setTriggers(ts => ts.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));

  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }}
      transition={{ type: 'spring', damping: 32, stiffness: 320 }}
      className="absolute top-0 right-0 h-full w-[360px] z-[50] flex flex-col"
      style={{ background: token.color.bg.surface, borderLeft: `1px solid ${token.color.border.default}`, boxShadow: '-8px 0 24px rgba(0,0,0,0.06)' }}>
      <div className="h-12 flex items-center justify-between px-4 border-b flex-shrink-0" style={{ borderColor: token.color.border.default }}>
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: token.color.text.primary }}>
          <Zap className="w-4 h-4" style={{ color: token.color.brand.primary }} /> Automations
        </span>
        <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ color: token.color.text.muted }}><X className="w-4 h-4" /></button>
      </div>

      <div className="px-4 py-2.5 border-b flex items-start gap-2" style={{ background: token.color.bg.muted, borderColor: token.color.border.hairline }}>
        <p className="text-[11px] leading-snug" style={{ color: token.color.text.muted }}>
          Triggers run on Zuper's existing rules engine — Build doesn't create a parallel automation system.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {triggers.map(tr => (
          <div key={tr.id} className="rounded-xl p-3" style={{ border: `1px solid ${token.color.border.default}`, background: tr.enabled ? token.color.bg.surface : token.color.bg.muted }}>
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wide mb-1" style={{ color: token.color.text.muted }}>
                  WHEN
                </div>
                <p className="text-[12.5px] leading-snug" style={{ color: token.color.text.primary }}>{tr.on}</p>
                <div className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wide mt-2 mb-1" style={{ color: token.color.text.muted }}>
                  <ArrowRight className="w-3 h-3" /> THEN
                </div>
                <p className="text-[12.5px] leading-snug" style={{ color: token.color.text.primary }}>{tr.then}</p>
              </div>
              <button onClick={() => toggle(tr.id)}
                className="w-9 h-5 rounded-full p-0.5 flex-shrink-0 transition-colors" style={{ background: tr.enabled ? token.color.brand.primary : token.color.border.strong }}>
                <span className="block w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: tr.enabled ? 'translateX(16px)' : 'translateX(0)' }} />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${token.color.border.hairline}` }}>
              <span className="text-[10.5px] font-mono" style={{ color: token.color.text.faint }}>{tr.compiledTo}</span>
              {tr.enabled && tr.runs > 0 && (
                <span className="ml-auto inline-flex items-center gap-1 text-[10.5px]" style={{ color: token.status.success.fg }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: token.status.success.dot }} /> {tr.runs} runs
                </span>
              )}
            </div>
          </div>
        ))}
        <button className="w-full h-9 rounded-lg text-[12px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors"
          style={{ border: `1px dashed ${token.color.border.default}`, color: token.color.text.muted }}>
          <Plus className="w-3.5 h-3.5" /> Add trigger
        </button>
      </div>
    </motion.div>
  );
}
