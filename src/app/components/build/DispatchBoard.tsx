import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GripVertical, Clock, MapPin, AlertTriangle, Check, X, ShieldCheck, Sparkles, SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
  UNASSIGNED_JOBS, TECHNICIANS, ASSIGNED_JOBS,
  type Job, type Technician, type Priority,
} from './buildData';

const PRIORITY_STYLE: Record<Priority, { bg: string; fg: string }> = {
  High: { bg: '#FEE2E2', fg: '#DC2626' },
  Medium: { bg: '#FEF3C7', fg: '#D97706' },
  Low: { bg: '#E0F2FE', fg: '#0369A1' },
};

interface CardProps {
  job: Job;
  onDragStart?: () => void;
  draggable?: boolean;
  showSkill?: boolean;          // power-user skill-match badge
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

function JobCard({ job, onDragStart, draggable, showSkill, selected, onSelect, compact }: CardProps) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onSelect}
      className="group rounded-[18px] bg-white p-2.5 cursor-pointer select-none"
      style={{
        border: selected ? '1.5px solid #FD5000' : job.overdue ? '1px solid #FCA5A5' : '1px solid #E6E8EC',
        boxShadow: selected ? '0 10px 26px -22px rgba(253,80,0,0.65)' : job.overdue ? '0 0 0 3px rgba(239,68,68,0.06)' : '0 1px 2px rgba(28,30,33,0.04)',
        background: job.overdue ? '#FFF5F5' : '#FFFFFF',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-[#1C1E21] truncate leading-tight">{job.customer}</p>
          <p className="text-[11px] text-[#6B7280] truncate mt-0.5">{job.jobType}</p>
        </div>
        {draggable && <GripVertical className="w-3.5 h-3.5 text-[#CBD0D6] flex-shrink-0 group-hover:text-[#9CA3AF]" />}
      </div>

      {!compact && (
        <div className="flex items-center gap-1 mt-2 text-[10.5px] text-[#9CA3AF]">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{job.address}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold"
          style={{ background: PRIORITY_STYLE[job.priority].bg, color: PRIORITY_STYLE[job.priority].fg }}>
          {job.priority}
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
          style={{ background: job.overdue ? '#FEE2E2' : '#F3F4F6', color: job.overdue ? '#DC2626' : '#6B7280' }}>
          {job.overdue ? <AlertTriangle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
          {job.sla}
        </span>
        {showSkill && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
            style={{ background: '#EEF2FF', color: '#4F46E5' }}>
            <Sparkles className="w-2.5 h-2.5" /> {job.skill}
          </span>
        )}
      </div>
    </div>
  );
}

interface Props {
  showSkillBadge?: boolean;       // toggled on in Edit when inspector adds it
  selectedJobId?: string | null;
  onSelectJob?: (id: string) => void;
  isViewer?: boolean;             // viewer experience: scoped writes
}

export function DispatchBoard({ showSkillBadge, selectedJobId, onSelectJob, isViewer }: Props) {
  const [tray, setTray] = useState<Job[]>(UNASSIGNED_JOBS);
  const [techs, setTechs] = useState<Technician[]>(TECHNICIANS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ job: Job; tech: Technician } | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const jobById = (id: string): Job | undefined =>
    tray.find(j => j.id === id) ||
    Object.values(ASSIGNED_JOBS).find(j => j.id === id);

  const requestAssign = (techId: string) => {
    if (!dragId) return;
    const job = jobById(dragId);
    const tech = techs.find(t => t.id === techId);
    setDragId(null);
    setDropTarget(null);
    if (!job || !tech) return;
    setConfirm({ job, tech });   // write preview / confirm (§3c)
  };

  const commitAssign = () => {
    if (!confirm) return;
    const { job, tech } = confirm;
    if (dryRun) {
      // dry-run: validate the write path without mutating any record (§3c)
      setConfirm(null);
      setToast(`Dry-run OK — ${job.id} → ${tech.name} would write 2 fields · no records changed`);
      setTimeout(() => setToast(null), 3600);
      return;
    }
    setTray(prev => prev.filter(j => j.id !== job.id));
    setTechs(prev => prev.map(t => t.id === tech.id ? { ...t, jobIds: [...t.jobIds, job.id] } : t));
    (ASSIGNED_JOBS as Record<string, Job>)[job.id] = job;
    setConfirm(null);
    setToast(`Assigned ${job.id} → ${tech.name} · write audited`);
    setTimeout(() => setToast(null), 3200);
  };

  return (
    <div className="h-full flex flex-col" style={{ background: '#F7F7F5' }}>
      {/* FilterBar — single compact filter expression, only what matters */}
      <div className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0">
        <span className="w-8 h-8 rounded-2xl bg-white border border-[#ECEEF1] inline-flex items-center justify-center text-[12px] font-semibold text-[#FD5000]"
          style={{ boxShadow: '0 10px 24px -22px rgba(28,30,33,0.5)' }}>
          Q
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-[-0.015em] text-[#1C1E21]">Quote follow-up</p>
          <p className="text-[11px] text-[#9CA3AF]">Status triage · review before send</p>
        </div>
        <button className="inline-flex items-center gap-2 h-8 pl-3 pr-2 rounded-full border border-[#E6E8EC] bg-white hover:border-[#1C1E21] transition-colors text-[11.5px] font-mono text-[#374151] ml-2">
          <SlidersHorizontal className="w-3 h-3 text-[#9CA3AF]" />
          TX · HVAC · this week
          <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
        </button>
        <span className="ml-auto text-[11.5px] text-[#9CA3AF]">
          <span className="font-medium text-[#374151]">{tray.length}</span> unassigned · <span className="font-medium text-[#374151]">{techs.length}</span> techs
          {isViewer && <span className="ml-2.5 inline-flex items-center gap-1 text-[#0891B2]"><ShieldCheck className="w-3 h-3" /> your access</span>}
        </span>
      </div>

      <div data-app-reveal className="flex-1 flex gap-3 p-3 pt-0 overflow-x-auto" style={{ background: '#F7F7F5' }}>
        {/* Unassigned tray */}
        <div className="w-[240px] flex-shrink-0 flex flex-col rounded-[24px] bg-white border border-white p-2"
          style={{ boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
          <div className="flex items-center gap-2 px-1 pb-2.5 h-6">
            <span className="text-[10.5px] font-mono uppercase tracking-wider text-[#9CA3AF]">Unassigned</span>
            <span className="text-[10.5px] font-mono text-[#CBD0D6]">{tray.length}</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto rounded-[18px] bg-[#F7F7F5] border border-[#F0F0F2] p-2">
            {tray.map(job => (
              <JobCard key={job.id} job={job} draggable
                showSkill={showSkillBadge}
                selected={selectedJobId === job.id}
                onSelect={() => onSelectJob?.(job.id)}
                onDragStart={() => setDragId(job.id)} />
            ))}
            {tray.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-[11.5px] text-[#9CA3AF] border border-dashed border-[#E6E8EC] rounded-[18px] py-8">
                All jobs assigned
              </div>
            )}
          </div>
        </div>

        {/* Technician lanes */}
        {techs.map(tech => {
          const matches = dragId ? tech.skills.includes(jobById(dragId)?.skill || '') : false;
          const isOver = dropTarget === tech.id;
          return (
            <div key={tech.id} className="w-[240px] flex-shrink-0 flex flex-col rounded-[24px] bg-white border border-white p-2"
              style={{ boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
              <div className="flex items-center gap-2 px-1 pb-2.5 h-6">
                <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0" style={{ background: tech.color }}>
                  {tech.initials}
                </div>
                <span className="text-[12px] font-medium text-[#374151] truncate">{tech.name}</span>
                <span className="ml-auto text-[10.5px] font-mono text-[#CBD0D6]">{tech.jobIds.length}</span>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDropTarget(tech.id); }}
                onDragLeave={() => setDropTarget(t => t === tech.id ? null : t)}
                onDrop={() => requestAssign(tech.id)}
                className="flex-1 flex flex-col gap-2 rounded-[18px] p-2 overflow-y-auto transition-colors"
                style={{
                  background: isOver ? (matches ? '#F0FDF4' : '#FFF4ED') : '#F7F7F5',
                  border: isOver ? `1.5px dashed ${matches ? '#10B981' : '#FD5000'}` : '1px solid #F0F0F2',
                  minHeight: 120,
                }}
              >
                {dragId && isOver && (
                  <div className="text-[10.5px] font-medium text-center py-1.5 rounded-md"
                    style={{ background: matches ? '#DCFCE7' : '#FFE2CC', color: matches ? '#15803D' : '#C2410C' }}>
                    {matches ? 'Skill match ✓ drop to assign' : 'No skill match — drop anyway?'}
                  </div>
                )}
                {tech.jobIds.map(id => {
                  const j = jobById(id);
                  return j ? <JobCard key={id} job={j} compact showSkill={showSkillBadge} /> : null;
                })}
                {tech.jobIds.length === 0 && !isOver && (
                  <div className="flex-1 flex items-center justify-center text-[11px] text-[#CBD0D6] py-6">Drop jobs here</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Write preview / confirm — drag-to-assign (§5d.5) */}
      <AnimatePresence>
        {confirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[400]" onClick={() => setConfirm(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[410] w-[400px] bg-white rounded-2xl p-5"
              style={{ boxShadow: '0 24px 60px rgba(30,34,60,0.22)' }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#FD5000]" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1C1E21]">Confirm write</h3>
                  <p className="text-[11.5px] text-[#9CA3AF]">Previewed before running · audited</p>
                </div>
              </div>
              <div className="rounded-xl bg-[#FAFAFA] border border-[#E6E8EC] p-3 text-[12.5px] space-y-1.5">
                <Row k="Job" v={`${confirm.job.id} · ${confirm.job.customer}`} />
                <Row k="Job.assigned_to" v={confirm.tech.name} mono />
                <Row k="Job.schedule" v="computed slot · this week" mono />
                {!confirm.tech.skills.includes(confirm.job.skill) && (
                  <div className="flex items-center gap-1.5 text-[11.5px] text-[#C2410C] pt-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {confirm.tech.name} lacks {confirm.job.skill} skill
                  </div>
                )}
              </div>
              {/* dry-run option for risky writes (§3c) */}
              <button onClick={() => setDryRun(v => !v)}
                className="w-full flex items-center gap-2 mt-3 px-2.5 h-8 rounded-lg text-left transition-colors"
                style={{ background: dryRun ? '#FFF4ED' : '#F8F9FB' }}>
                <span className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: dryRun ? '#FD5000' : '#FFF', border: dryRun ? 'none' : '1.5px solid #D1D5DB' }}>
                  {dryRun && <Check className="w-3 h-3 text-white" />}
                </span>
                <span className="text-[11.5px] text-[#374151]">Dry-run — validate the write without changing records</span>
              </button>
              <div className="flex items-center gap-2 mt-4">
                <button onClick={() => { setConfirm(null); setDryRun(false); }}
                  className="flex-1 h-9 rounded-xl text-[13px] font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E9EBEE] transition-colors">
                  Cancel
                </button>
                <button onClick={commitAssign}
                  className="flex-1 h-9 rounded-xl text-[13px] font-semibold text-white bg-[#FD5000] hover:bg-[#E04600] transition-colors inline-flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> {dryRun ? 'Run dry-run' : 'Assign & schedule'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Audit toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[420] flex items-center gap-2 px-4 h-10 rounded-full bg-[#1C1E21] text-white text-[12.5px] font-medium"
            style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.24)' }}
          >
            <Check className="w-4 h-4 text-[#34D399]" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[#9CA3AF]">{k}</span>
      <span className={`text-[#1C1E21] font-medium text-right ${mono ? 'font-mono text-[11.5px]' : ''}`}>{v}</span>
    </div>
  );
}
