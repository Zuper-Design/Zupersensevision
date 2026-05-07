import { X, Check, BookOpen, Plus, Search, Trash2, MoreHorizontal, Pencil, Paperclip, FileText, ImageIcon, Sheet, ChevronLeft, Link2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface KnowledgeItem {
  id: string;
  title: string;
  useWhen: string;
  body: string;
  enabled: boolean;
}

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PersonalizationModal({ isOpen, onClose }: PersonalizationModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'knowledge'>('profile');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [clearConfirm, setClearConfirm] = useState(false);
  const [profile, setProfile] = useState({ nickname: '', occupation: '', about: '', instructions: '' });
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([
    { id: '1', title: 'Business overview', useWhen: 'When someone asks about the company or operations', body: 'We are an HVAC service company based in Dallas, Texas. ~40 jobs/week across 3 service zones.', enabled: true },
    { id: '2', title: 'Customer profile', useWhen: 'When someone asks about our customers or market', body: 'Primary customers are residential homeowners. Average job value $350.', enabled: true },
    { id: '3', title: 'Top priorities', useWhen: 'When someone asks about KPIs or performance goals', body: 'First-visit resolution rate and cash flow are our top KPIs.', enabled: false },
  ]);
  const [knowledgeSearch, setKnowledgeSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formUrls, setFormUrls] = useState<string[]>([]);
  const [formBody, setFormBody] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddForm = () => {
    setEditingId(null);
    setFormTitle(''); setFormUrls([]); setFormBody(''); setFormEnabled(true); setFormFile(null);
    setFormOpen(true);
  };

  const openEditForm = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setFormTitle(item.title); setFormUrls(item.useWhen ? item.useWhen.split('\n').filter(Boolean) : []); setFormBody(item.body); setFormEnabled(item.enabled); setFormFile(null);
    setFormOpen(true);
  };

  const handleFormSave = () => {
    const hasContent = formBody.trim() || formFile || formUrls.some(u => u.trim());
    if (!formTitle.trim() && !hasContent) return;
    const finalTitle = formTitle.trim() || (formFile?.name ?? formUrls.find(u => u.trim()) ?? formBody.trim().slice(0, 40)) || 'Untitled';
    if (editingId) {
      setKnowledgeItems(items => items.map(i => i.id === editingId ? { ...i, title: finalTitle, useWhen: formUrls.map(u => u.trim()).filter(Boolean).join('\n'), body: formBody.trim(), enabled: formEnabled } : i));
    } else {
      setKnowledgeItems(items => [...items, { id: Date.now().toString(), title: finalTitle, useWhen: formUrls.map(u => u.trim()).filter(Boolean).join('\n'), body: formBody.trim(), enabled: formEnabled }]);
    }
    setFormOpen(false);
  };

  useEffect(() => {
    if (!openMenuId) return;
    const close = (e: MouseEvent) => { setOpenMenuId(null); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openMenuId]);

  const setP = (k: keyof typeof profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile(p => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    if (saveState !== 'idle') return;
    setSaveState('saving');
    setTimeout(() => setSaveState('saved'), 900);
    setTimeout(() => setSaveState('idle'), 3000);
  };

  const inp: React.CSSProperties = {
    width: '100%', outline: 'none', resize: 'none',
    background: '#FFFFFF', border: '1px solid #E8E9EC',
    borderRadius: 8, padding: '9px 12px',
    fontSize: 14, color: '#1C1E21', lineHeight: 1.55,
    fontFamily: 'inherit',
  };
  const onF = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.boxShadow = '0 0 0 2.5px rgba(253,80,0,0.18)', e.target.style.borderColor = 'rgba(253,80,0,0.35)');
  const onB = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.target.style.boxShadow = '', e.target.style.borderColor = '#E8E9EC');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed bg-black/40 backdrop-blur-sm z-[300]"
            style={{ top: 44, left: 72, right: 0, bottom: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }} onClick={onClose} />

          <motion.div className="fixed z-[310] flex items-center justify-center p-6 pointer-events-none"
            style={{ top: 44, left: 72, right: 0, bottom: 0 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="pointer-events-auto w-full overflow-hidden"
              style={{ maxWidth: 980, borderRadius: 16, background: '#fff', boxShadow: '0 24px 80px rgba(20,20,30,0.20)', height: '70vh', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
              initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-7 pt-6 pb-4">
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.025em', marginBottom: 3 }}>Personalization</h2>
                  <p style={{ fontSize: 14, color: '#9CA3AF' }}>Manage who you are and what Sense remembers</p>
                </div>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors">
                  <X className="w-4 h-4 text-[#9CA3AF]" />
                </button>
              </div>


              {/* Body */}
              <div className="flex-1 overflow-y-auto px-7 pt-6 pb-0">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div key="profile"
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }} className="space-y-6">

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21' }}>About you & how Sense should respond</label>
                          <span style={{ fontSize: 11, color: '#C4C8D0' }}>{profile.instructions.length} / 5000</span>
                        </div>
                        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E6E8EC', background: '#fff' }}>
                          <textarea value={profile.instructions} onChange={setP('instructions')} rows={15}
                            placeholder={`e.g. "I'm a product designer at a fintech startup. I prefer concise, direct responses. Always cite sources for important conclusions and maintain a professional tone."`}
                            style={{ ...inp, border: 'none', borderRadius: 0, resize: 'none', width: '100%', paddingBottom: 8, boxShadow: 'none' }} />
                          <div className="flex items-center justify-end gap-2 px-3 py-2.5" style={{ borderTop: '1px solid #F0F2F5' }}>
                            {clearConfirm ? (
                              <div className="flex items-center gap-2">
                                <span style={{ fontSize: 12, color: '#6B7280' }}>Clear all content?</span>
                                <button
                                  onClick={() => { setP('instructions')({ target: { value: '' } } as any); setClearConfirm(false); }}
                                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                                  style={{ background: '#EF4444', border: 'none', color: '#fff', cursor: 'pointer' }}>
                                  Yes, clear
                                </button>
                                <button
                                  onClick={() => setClearConfirm(false)}
                                  className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                                  style={{ background: 'none', border: '1px solid #E6E8EC', color: '#6B7280', cursor: 'pointer' }}>
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setClearConfirm(true)}
                                className="px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all"
                                style={{ background: 'none', border: '1px solid #E6E8EC', color: '#6B7280', cursor: profile.instructions ? 'pointer' : 'default', opacity: profile.instructions ? 1 : 0.3, pointerEvents: profile.instructions ? 'auto' : 'none' }}>
                                Clear
                              </button>
                            )}
                            <button
                              onClick={handleSave}
                              disabled={saveState !== 'idle'}
                              className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white active:scale-[0.97] transition-all duration-300 flex items-center gap-1.5"
                              style={{
                                background: saveState === 'saved' ? '#10B981' : '#1C1E21',
                                border: 'none', cursor: saveState === 'idle' ? 'pointer' : 'default',
                                minWidth: 64, justifyContent: 'center',
                                transition: 'background 0.3s',
                              }}>
                              {saveState === 'saving' && (
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ animation: 'spin 0.7s linear infinite' }}>
                                  <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                                  <path d="M6.5 1.5a5 5 0 0 1 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                </svg>
                              )}
                              {saveState === 'saved' && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                              {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : 'Save'}
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p style={{ fontSize: 11, fontWeight: 500, color: '#B0B4BE', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Try one of these</p>
                          <div className="flex items-center gap-2">
                            {[
                              { label: 'I own and run a roofing company', value: `I own and operate a roofing company. I oversee everything from estimating jobs to managing crews and customer relationships. Keep responses practical and business-focused. I care about margins, efficiency, and growth. Skip the jargon — give me clear, actionable advice I can use on the ground.` },
                              { label: 'I manage roofing crews and job schedules', value: `I manage roofing crews, job schedules, and day-to-day field operations. My focus is on getting jobs done on time, coordinating teams, and keeping customers updated. Keep responses short and to the point. I'm often on the move, so prioritise clarity over detail.` },
                              { label: 'I handle estimates, sales, and customer follow-ups', value: `I handle sales, quotes, and customer follow-ups for a roofing business. I spend my time measuring roofs, preparing proposals, and closing deals. Help me communicate clearly with customers and create compelling estimates. I prefer structured responses with clear next steps.` },
                            ].map(({ label, value }) => (
                              <button key={label}
                                onClick={() => setP('instructions')({ target: { value } } as any)}
                                className="px-3 py-1.5 rounded-lg transition-all"
                                style={{ background: '#F5F6F8', border: '1px solid #E6E8EC', color: '#6B7280', fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EBEBED'; (e.currentTarget as HTMLElement).style.color = '#1C1E21'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F5F6F8'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}>
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </motion.div>
          </motion.div>

        </>
      )}
    </AnimatePresence>
  );
}
