import { motion } from 'motion/react';
import { X, History, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';
import { AUDIT_LOG } from './buildData';

// Audit log surface — §4: every write logs { app, version, user, before/after, timestamp }
export function AuditPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }}
      transition={{ type: 'spring', damping: 32, stiffness: 320 }}
      className="absolute top-0 right-0 h-full w-[360px] bg-white border-l border-[#E6E8EC] z-[50] flex flex-col"
      style={{ boxShadow: '-8px 0 24px rgba(0,0,0,0.06)' }}
    >
      <div className="h-12 flex items-center justify-between px-4 border-b border-[#E6E8EC] flex-shrink-0">
        <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#1C1E21]">
          <History className="w-4 h-4 text-[#FD5000]" /> Write audit log
        </span>
        <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-4 py-2.5 border-b border-[#E6E8EC] bg-[#F0F9FF] flex items-start gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0284C7] flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#075985] leading-snug">Every write is logged with before/after and is reversible where possible.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {AUDIT_LOG.map(e => (
          <div key={e.id} className="rounded-xl border border-[#E6E8EC] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-mono text-[#FD5000] bg-[#FFF4ED] px-1.5 py-0.5 rounded">v{e.version}</span>
              <span className="text-[10.5px] text-[#9CA3AF]">{e.timestamp}</span>
            </div>
            <p className="text-[12px] font-medium text-[#1C1E21] font-mono break-all">{e.field}</p>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11.5px]">
              <span className="px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280] line-through">{e.before}</span>
              <ArrowRight className="w-3 h-3 text-[#9CA3AF] flex-shrink-0" />
              <span className="px-1.5 py-0.5 rounded bg-[#ECFDF5] text-[#15803D] font-medium">{e.after}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10.5px] text-[#9CA3AF]">by {e.user}</span>
              {e.reversible
                ? <button className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#FD5000] hover:underline">
                    <RotateCcw className="w-2.5 h-2.5" /> Revert
                  </button>
                : <span className="text-[10.5px] text-[#CBD0D6]">no-op</span>}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
