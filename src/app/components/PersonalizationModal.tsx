import { X, Check, BookOpen, Plus, Search, Trash2, MoreHorizontal, Pencil, Paperclip, FileText, ImageIcon, Sheet } from 'lucide-react';
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
  const [saved, setSaved] = useState(false);
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
  const [formUseWhen, setFormUseWhen] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddForm = () => {
    setEditingId(null);
    setFormTitle(''); setFormUseWhen(''); setFormBody(''); setFormEnabled(true); setFormFile(null);
    setFormOpen(true);
  };

  const openEditForm = (item: KnowledgeItem) => {
    setEditingId(item.id);
    setFormTitle(item.title); setFormUseWhen(item.useWhen); setFormBody(item.body); setFormEnabled(item.enabled); setFormFile(null);
    setFormOpen(true);
  };

  const handleFormSave = () => {
    if (!formTitle.trim()) return;
    if (editingId) {
      setKnowledgeItems(items => items.map(i => i.id === editingId ? { ...i, title: formTitle.trim(), useWhen: formUseWhen.trim(), body: formBody.trim(), enabled: formEnabled } : i));
    } else {
      setKnowledgeItems(items => [...items, { id: Date.now().toString(), title: formTitle.trim(), useWhen: formUseWhen.trim(), body: formBody.trim(), enabled: formEnabled }]);
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

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 1600); };

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
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[300]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }} onClick={onClose} />

          <motion.div className="fixed inset-0 z-[310] flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="pointer-events-auto w-full overflow-hidden"
              style={{ maxWidth: 780, borderRadius: 16, background: '#fff', boxShadow: '0 24px 80px rgba(20,20,30,0.20)', height: '82vh', maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
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

              {/* Underline tabs */}
              <div className="flex px-7" style={{ borderBottom: '1px solid #F0F2F5' }}>
                {(['profile', 'knowledge'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="relative pb-3 mr-6 text-[14px] font-medium capitalize transition-colors"
                    style={{ color: activeTab === tab ? '#1C1E21' : '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-line"
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                        style={{ background: '#FD5000' }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-7 pt-6 pb-0">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div key="profile"
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }} className="space-y-6">

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 6 }}>Nickname</label>
                          <input value={profile.nickname} onChange={setP('nickname')}
                            placeholder="What should Sense call you?"
                            style={inp} onFocus={onF} onBlur={onB} />
                        </div>
                        <div>
                          <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 6 }}>Occupation</label>
                          <input value={profile.occupation} onChange={setP('occupation')}
                            placeholder="e.g. Product Designer, Software Engineer"
                            style={inp} onFocus={onF} onBlur={onB} />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21' }}>More about you</label>
                          <span style={{ fontSize: 11, color: '#C4C8D0' }}>{profile.about.length} / 2000</span>
                        </div>
                        <textarea value={profile.about} onChange={setP('about')} rows={5}
                          placeholder="Your background, preferences, or location to help Sense understand you better"
                          style={inp} onFocus={onF} onBlur={onB} />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21' }}>Custom instructions</label>
                          <span style={{ fontSize: 11, color: '#C4C8D0' }}>{profile.instructions.length} / 5000</span>
                        </div>
                        <textarea value={profile.instructions} onChange={setP('instructions')} rows={5}
                          placeholder={`How would you like Sense to respond?\ne.g. "Focus on the best practices", "Maintain a professional tone", or "Always provide sources for important conclusions"`}
                          style={inp} onFocus={onF} onBlur={onB} />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'knowledge' && (
                    <motion.div key="knowledge"
                      initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }} className="space-y-3">
                      {/* Search + Add */}
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-2 px-3 rounded-lg" style={{ background: '#FFFFFF', border: '1px solid #E8E9EC' }}>
                          <Search style={{ width: 14, height: 14, color: '#B0B4BE', flexShrink: 0 }} />
                          <input value={knowledgeSearch} onChange={e => setKnowledgeSearch(e.target.value)}
                            placeholder="Search knowledge"
                            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: '#1C1E21', padding: '9px 0', fontFamily: 'inherit' }} />
                          {knowledgeSearch && (
                            <button onClick={() => setKnowledgeSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#B0B4BE' }}>
                              <X style={{ width: 13, height: 13 }} />
                            </button>
                          )}
                        </div>
                        <button onClick={openAddForm}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white active:scale-[0.97] transition-transform"
                          style={{ background: '#1C1E21', boxShadow: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          <Plus style={{ width: 14, height: 14 }} /> Add
                        </button>
                      </div>
                      {/* List */}
                      <div className="space-y-3">
                        <AnimatePresence>
                          {knowledgeItems
                            .filter(item => !knowledgeSearch || item.title.toLowerCase().includes(knowledgeSearch.toLowerCase()) || item.useWhen.toLowerCase().includes(knowledgeSearch.toLowerCase()) || item.body.toLowerCase().includes(knowledgeSearch.toLowerCase()))
                            .map(item => (
                              <motion.div key={item.id}
                                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.14 }}
                                className="flex items-center gap-6 px-4 rounded-xl"
                                style={{ border: '1px solid #EBEBED', background: item.enabled ? '#fff' : '#FAFAFA', opacity: item.enabled ? 1 : 0.55, height: 84 }}>
                                <div className="flex-1 min-w-0">
                                  <p style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.45, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>{item.useWhen || item.body}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 relative">
                                  <button onClick={() => setKnowledgeItems(items => items.map(i => i.id === item.id ? { ...i, enabled: !i.enabled } : i))}
                                    style={{ width: 30, height: 17, borderRadius: 9, border: 'none', cursor: 'pointer', flexShrink: 0, background: item.enabled ? '#1C1E21' : '#E5E7EB', position: 'relative', transition: 'background 0.2s', padding: 0 }}>
                                    <span style={{ position: 'absolute', top: 2.5, width: 12, height: 12, borderRadius: '50%', background: '#fff', transition: 'left 0.2s cubic-bezier(0.22,1,0.36,1)', left: item.enabled ? 16 : 2.5, boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                                  </button>
                                  <div className="relative">
                                    <button onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                      className="flex items-center justify-center rounded-md transition-colors"
                                      style={{ width: 24, height: 24, background: openMenuId === item.id ? '#F3F4F6' : 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
                                      onMouseEnter={e => { if (openMenuId !== item.id) (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
                                      onMouseLeave={e => { if (openMenuId !== item.id) (e.currentTarget as HTMLElement).style.background = 'none'; }}>
                                      <MoreHorizontal style={{ width: 14, height: 14 }} />
                                    </button>
                                    <AnimatePresence>
                                      {openMenuId === item.id && (
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.94, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: -4 }}
                                          transition={{ duration: 0.12 }}
                                          className="absolute right-0 top-full mt-1 z-50 overflow-hidden"
                                          style={{ background: '#fff', border: '1px solid #E8E9EC', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', minWidth: 140, padding: '4px' }}>
                                          <button
                                            onClick={() => { setOpenMenuId(null); openEditForm(item); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors"
                                            style={{ fontSize: 13, color: '#1C1E21', background: 'none', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F3F4F6'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}>
                                            <Pencil style={{ width: 13, height: 13 }} /> Edit
                                          </button>
                                          <button
                                            onClick={() => { setOpenMenuId(null); setKnowledgeItems(items => items.filter(i => i.id !== item.id)); }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors"
                                            style={{ fontSize: 13, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FEF2F2'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}>
                                            <Trash2 style={{ width: 13, height: 13 }} /> Delete
                                          </button>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                        {knowledgeItems.filter(item => !knowledgeSearch || item.title.toLowerCase().includes(knowledgeSearch.toLowerCase())).length === 0 && (
                          <div className="flex flex-col items-center py-12 gap-2">
                            <BookOpen style={{ width: 22, height: 22, color: '#D1D5DB' }} />
                            <p style={{ fontSize: 13, color: '#9CA3AF' }}>{knowledgeSearch ? 'No results found' : 'No knowledge added yet'}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-7 py-4" style={{ borderTop: '1px solid #F0F2F5' }}>
                <button onClick={onClose}
                  className="px-4 py-2 rounded-lg text-[14px] font-medium transition-colors"
                  style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
                <button onClick={handleSave}
                  className="px-5 py-2 rounded-lg text-[14px] font-semibold text-white flex items-center gap-1.5 active:scale-[0.97] transition-transform"
                  style={{
                    background: saved ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(to right, #221E1F, #6D5F63)',
                    boxShadow: saved ? '0 4px 12px rgba(16,185,129,0.28)' : '0 4px 12px rgba(0,0,0,0.18)',
                    transition: 'background 0.3s, box-shadow 0.3s',
                    border: 'none', cursor: 'pointer',
                  }}>
                  {saved ? <><Check className="w-3.5 h-3.5" strokeWidth={3} /> Saved</> : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Knowledge add/edit modal ── */}
          <AnimatePresence>
            {formOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-[320]"
                  style={{ background: 'rgba(0,0,0,0.25)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setFormOpen(false)}
                />
                <motion.div className="fixed inset-0 z-[330] flex items-center justify-center p-6 pointer-events-none">
                  <motion.div
                    className="pointer-events-auto w-full"
                    style={{ maxWidth: 480, borderRadius: 14, background: '#fff', boxShadow: '0 20px 60px rgba(20,20,30,0.22)', overflow: 'hidden' }}
                    initial={{ scale: 0.96, y: 8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, y: 8, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Modal header */}
                    <div className="flex items-center justify-between px-6 pt-5 pb-4" style={{ borderBottom: '1px solid #F0F2F5' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1C1E21', letterSpacing: '-0.02em' }}>{editingId ? 'Edit knowledge' : 'Add knowledge'}</h3>
                      <button onClick={() => setFormOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] transition-colors">
                        <X style={{ width: 14, height: 14, color: '#9CA3AF' }} />
                      </button>
                    </div>
                    {/* Fields */}
                    <div className="px-6 py-5 space-y-4">
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 6 }}>Name</label>
                        <input value={formTitle} onChange={e => setFormTitle(e.target.value)}
                          placeholder='e.g. "Booking Rate"'
                          style={inp} onFocus={onF} onBlur={onB} autoFocus />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 6 }}>Use when</label>
                        <input value={formUseWhen} onChange={e => setFormUseWhen(e.target.value)}
                          placeholder='e.g. "When someone asks about booking metrics"'
                          style={inp} onFocus={onF} onBlur={onB} />
                      </div>
                      <div>
                        <label style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', display: 'block', marginBottom: 6 }}>Content</label>
                        <textarea value={formBody} onChange={e => setFormBody(e.target.value)}
                          placeholder="Plain English definition or context..."
                          rows={4} style={inp} onFocus={onF} onBlur={onB} />
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="hidden"
                          accept="image/*,.xlsx,.xls,.csv,.pdf,.doc,.docx"
                          onChange={e => setFormFile(e.target.files?.[0] ?? null)}
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors"
                            style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', color: '#6B7280', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; }}
                          >
                            <Paperclip style={{ width: 11, height: 11 }} />
                            Upload
                          </button>
                          {formFile && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB', minWidth: 0 }}>
                              {formFile.name.match(/\.(xlsx|xls|csv)$/i) ? <Sheet style={{ width: 11, height: 11, color: '#16A34A', flexShrink: 0 }} /> : formFile.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? <ImageIcon style={{ width: 11, height: 11, color: '#6366F1', flexShrink: 0 }} /> : <FileText style={{ width: 11, height: 11, color: '#6B7280', flexShrink: 0 }} />}
                              <span style={{ fontSize: 11, color: '#374151', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formFile.name}</span>
                              <button onClick={() => { setFormFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                                <X style={{ width: 10, height: 10, color: '#9CA3AF' }} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 px-6 pb-5">
                      <button onClick={() => setFormOpen(false)}
                        className="px-4 py-2 rounded-lg text-[13px] font-medium transition-colors"
                        style={{ background: '#F3F4F6', color: '#6B7280', border: 'none', cursor: 'pointer' }}>
                        Cancel
                      </button>
                      <button onClick={handleFormSave}
                        className="px-5 py-2 rounded-lg text-[13px] font-semibold text-white active:scale-[0.97] transition-transform"
                        style={{ background: '#1C1E21', border: 'none', cursor: 'pointer' }}>
                        {editingId ? 'Update' : 'Save'}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
