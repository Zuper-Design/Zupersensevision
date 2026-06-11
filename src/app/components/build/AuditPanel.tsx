import { motion } from 'motion/react';
import { X, History, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { AUDIT_LOG } from './buildData';

// Audit log surface — §4: every write logs { app, version, user, before/after, timestamp }
export function AuditPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }}
      transition={{ type: 'spring', damping: 32, stiffness: 320 }}
      className="absolute top-0 right-0 h-full w-[360px] bg-white border-l border-[rgba(0,0,0,0.08)] z-[50] flex flex-col"
      style={{ boxShadow: '-8px 0 24px rgba(0,0,0,0.06)' }}
    >
      <div className="h-12 flex items-center justify-between px-4 border-b border-[rgba(0,0,0,0.08)] flex-shrink-0">
        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-[#000000]">
          <History className="w-4 h-4 text-[#000000]" /> Write audit log
        </span>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[#F0F0F0] flex items-center justify-center text-[#959595]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-2.5 border-b border-[rgba(0,0,0,0.08)] bg-[#F0F0F0] flex items-start gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#636363] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#075985] leading-snug">Every write is logged with before/after and is reversible where possible.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {AUDIT_LOG.map(e => (
          <div key={e.id} className="rounded-xl border border-[rgba(0,0,0,0.08)] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-[#000000] bg-[#F0F0F0] px-1.5 py-0.5 rounded">v{e.version}</span>
              <span className="text-[10.5px] text-[#959595]">{e.timestamp}</span>
            </div>
            <p className="text-[12px] font-medium text-[#000000] font-mono break-all">{e.field}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11.5px]">
              <span className="px-1.5 py-0.5 rounded bg-[#F0F0F0] text-[#636363] line-through">{e.before}</span>
              <ArrowRight className="w-3 h-3 text-[#959595] flex-shrink-0" />
              <span className="px-1.5 py-0.5 rounded bg-[#F0F0F0] text-[#000000] font-medium">{e.after}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10.5px] text-[#959595]">by {e.user}</span>
              {e.reversible
                ? <button className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#000000] hover:underline">
                    <RotateCcw className="w-2.5 h-2.5" /> Revert
                  </button>
                : <span className="text-[10.5px] text-[#D9D9D9]">no-op</span>}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
