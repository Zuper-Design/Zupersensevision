import { useState } from 'react';
import { motion } from 'motion/react';
import { X, Globe, Lock, ShieldCheck, History, Check, Eye, RotateCcw, GitCompare } from 'lucide-react';
import { VERSION_HISTORY } from './buildData';

interface Props {
  appName: string;
  onClose: () => void;
  onPublish: (opts: { readOnly: boolean }) => void;
}

const ROLES = ['Dispatchers', 'Operations team', 'Entire org'];

export function PublishAppDialog({ appName, onClose, onPublish }: Props) {
  const [scope, setScope] = useState('Dispatchers');
  const [readOnly, setReadOnly] = useState(false);
  const [note, setNote] = useState('Added skill-match badge to job cards');

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/35 backdrop-blur-[2px] z-[450]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.17, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[460] w-[460px] bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 70px rgba(30,34,60,0.25)' }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#E6E8EC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FFF4ED] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#FD5000]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1C1E21] leading-tight">Publish app</h3>
              <p className="text-[11.5px] text-[#9CA3AF]">{appName}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md hover:bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* personal → published transition */}
          <div className="flex items-center gap-2 text-[12px]">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#F3F4F6] text-[#6B7280]"><Lock className="w-3 h-3" /> Personal</span>
            <span className="text-[#9CA3AF]">→</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#FFF4ED] text-[#FD5000] font-medium"><Globe className="w-3 h-3" /> Published v{VERSION_HISTORY[0].v + 1}</span>
          </div>

          {/* scope */}
          <div>
            <p className="text-[12px] font-semibold text-[#374151] mb-1.5">Share with</p>
            <div className="grid grid-cols-3 gap-1.5">
              {ROLES.map(r => (
                <button key={r} onClick={() => setScope(r)}
                  className="h-9 rounded-lg text-[11.5px] font-medium border transition-colors"
                  style={{ borderColor: scope === r ? '#FD5000' : '#E6E8EC', color: scope === r ? '#FD5000' : '#6B7280', background: scope === r ? '#FFF4ED' : '#FFF' }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* version note */}
          <div>
            <p className="text-[12px] font-semibold text-[#374151] mb-1.5">Version note</p>
            <input value={note} onChange={e => setNote(e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-[#E6E8EC] text-[12.5px] text-[#1C1E21] outline-none focus:border-[#FD5000]" />
          </div>

          {/* read-only toggle */}
          <button onClick={() => setReadOnly(v => !v)}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl border transition-colors text-left"
            style={{ borderColor: readOnly ? '#FD5000' : '#E6E8EC', background: readOnly ? '#FFF4ED' : '#FFF' }}>
            <Eye className="w-4 h-4 flex-shrink-0" style={{ color: readOnly ? '#FD5000' : '#9CA3AF' }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-[#1C1E21]">Read-only board</p>
              <p className="text-[10.5px] text-[#9CA3AF]">Distribute for visibility — hides the drag-to-assign write surface.</p>
            </div>
            <span className="w-9 h-5 rounded-full p-0.5 transition-colors flex-shrink-0" style={{ background: readOnly ? '#FD5000' : '#D1D5DB' }}>
              <span className="block w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: readOnly ? 'translateX(16px)' : 'translateX(0)' }} />
            </span>
          </button>

          {/* permissions inversion notice (§4) */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD]">
            <ShieldCheck className="w-4 h-4 text-[#0284C7] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#075985] leading-snug">
              Published board runs under <span className="font-semibold">each viewer's permissions</span>. Columns a viewer can't see stay hidden — no data leaks past RBAC. Writes are limited to what the viewer is allowed to do.
            </p>
          </div>

          {/* version history */}
          <details className="rounded-xl border border-[#E6E8EC] overflow-hidden">
            <summary className="flex items-center gap-2 px-3 h-9 text-[12px] font-medium text-[#374151] cursor-pointer hover:bg-[#FAFAFA]">
              <History className="w-3.5 h-3.5 text-[#9CA3AF]" /> Version history · {VERSION_HISTORY.length} versions
            </summary>
            <div className="px-3 pb-2 pt-1 space-y-0.5">
              {VERSION_HISTORY.map((v, i) => (
                <div key={v.v} className="group flex items-center gap-2 py-1 text-[11.5px]">
                  <span className="font-mono text-[#9CA3AF] w-7">v{v.v}</span>
                  <span className="text-[#374151] flex-1 truncate">{v.note}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button title="Diff vs published" className="inline-flex items-center gap-0.5 text-[10.5px] text-[#6B7280] hover:text-[#FD5000]">
                      <GitCompare className="w-2.5 h-2.5" /> Diff
                    </button>
                    {i !== 0 && (
                      <button title="Rollback to this version" className="inline-flex items-center gap-0.5 text-[10.5px] text-[#6B7280] hover:text-[#FD5000]">
                        <RotateCcw className="w-2.5 h-2.5" /> Rollback
                      </button>
                    )}
                  </div>
                  <span className="text-[#9CA3AF] group-hover:hidden">{v.when}</span>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="flex items-center gap-2 px-5 py-3.5 border-t border-[#E6E8EC] bg-[#FAFAFA]">
          <button onClick={onClose} className="flex-1 h-9 rounded-xl text-[13px] font-medium text-[#374151] bg-white border border-[#E6E8EC] hover:bg-[#F3F4F6] transition-colors">
            Cancel
          </button>
          <button onClick={() => onPublish({ readOnly })}
            className="flex-1 h-9 rounded-xl text-[13px] font-semibold text-white bg-[#FD5000] hover:bg-[#E04600] transition-colors inline-flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4" /> Publish to {scope}
          </button>
        </div>
      </motion.div>
    </>
  );
}
