import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GripVertical, AlertTriangle, Clock, Check, ShieldCheck, X, History, MapPin } from 'lucide-react';
import {
  UNASSIGNED_JOBS, TECHNICIANS, ASSIGNED_JOBS, GRID_START, GRID_END,
  type Job, type Technician,
} from './buildData';
import { token, statusFor } from './tokens';
import { StatusPill, EmptyState } from './primitives';
import { Editable } from './EditContext';

const HOURS = Array.from({ length: GRID_END - GRID_START + 1 }, (_, i) => GRID_START + i);
const LANE_H = 64;        // px per technician row
const PX_PER_HOUR = 96;   // time-axis scale

const fmtHour = (h: number) => {
  const hr = Math.floor(h), m = Math.round((h - hr) * 60);
  const ap = hr >= 12 ? 'PM' : 'AM';
  const h12 = hr % 12 === 0 ? 12 : hr % 12;
  return m ? `${h12}:${String(m).padStart(2, '0')} ${ap}` : `${h12} ${ap}`;
};

const overlaps = (a: Job, b: Job) =>
  a.start != null && b.start != null &&
  a.start < b.start! + (b.duration ?? 1) && b.start! < a.start + (a.duration ?? 1);

interface Props {
  showSkillBadge?: boolean;
  selectedJobId?: string | null;
  onSelectJob?: (id: string) => void;
  isViewer?: boolean;
  onOpenAudit?: () => void;
}

export function DispatchGrid({ showSkillBadge, selectedJobId, onSelectJob, isViewer, onOpenAudit }: Props) {
  const [tray, setTray] = useState<Job[]>(UNASSIGNED_JOBS);
  const [techs, setTechs] = useState<Technician[]>(TECHNICIANS);
  const [dragId, setDragId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ tech: string; hour: number } | null>(null);
  const [confirm, setConfirm] = useState<{ job: Job; tech: Technician; start: number } | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const jobById = (id: string): Job | undefined =>
    tray.find(j => j.id === id) || Object.values(ASSIGNED_JOBS).find(j => j.id === id);

  // jobs currently on a tech's lane
  const laneJobs = (t: Technician) => t.jobIds.map(id => jobById(id)).filter((j): j is Job => !!j && j.start != null);

  // per-tech utilization across the visible window
  const utilization = (t: Technician) => {
    const busy = laneJobs(t).reduce((s, j) => s + (j.duration ?? 0), 0);
    return Math.min(100, Math.round((busy / (GRID_END - GRID_START)) * 100));
  };
  const hasDoubleBooking = (t: Technician) => {
    const js = laneJobs(t);
    return js.some((a, i) => js.some((b, k) => k > i && overlaps(a, b)));
  };

  const requestAssign = (techId: string, hour: number) => {
    if (!dragId) return;
    const job = jobById(dragId); const tech = techs.find(t => t.id === techId);
    setDragId(null); setHover(null);
    if (job && tech) setConfirm({ job, tech, start: hour });
  };

  const commitAssign = () => {
    if (!confirm) return;
    const { job, tech, start } = confirm;
    if (dryRun) {
      setConfirm(null);
      setToast(`Dry-run OK — ${job.id} → ${tech.name} @ ${fmtHour(start)} · no records changed`);
      setTimeout(() => setToast(null), 3600); return;
    }
    const scheduled = { ...job, start, duration: job.duration ?? 1.5 };
    (ASSIGNED_JOBS as Record<string, Job>)[job.id] = scheduled;
    setTray(prev => prev.filter(j => j.id !== job.id));
    setTechs(prev => prev.map(t => t.id === tech.id ? { ...t, jobIds: [...t.jobIds, job.id] } : t));
    setConfirm(null);
    setToast(`Scheduled ${job.id} → ${tech.name}, ${fmtHour(start)}–${fmtHour(start + (job.duration ?? 1.5))} · audited`);
    setTimeout(() => setToast(null), 3600);
  };

  const conflictAtDrop = confirm
    ? laneJobs(confirm.tech).some(j => j.start! < confirm.start + (confirm.job.duration ?? 1.5) && confirm.start < j.start! + (j.duration ?? 1))
    : false;
  const skillMiss = confirm ? !confirm.tech.skills.includes(confirm.job.skill) : false;

  return (
    <div className="h-full flex flex-col" style={{ background: '#F7F7F5' }}>
      {/* FilterBar — single compact expression */}
      <Editable id="el-header" kind="header" label="Filter bar" className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0">
        <span className="w-8 h-8 rounded-2xl bg-white border border-[#ECEEF1] inline-flex items-center justify-center text-[12px] font-semibold"
          style={{ color: token.color.brand.primary, boxShadow: '0 10px 24px -22px rgba(28,30,33,0.5)' }}>
          09
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-semibold tracking-[-0.015em]" style={{ color: token.color.text.primary }}>Today</p>
          <p className="text-[11px]" style={{ color: token.color.text.muted }}>Dispatch grid · Texas HVAC</p>
        </div>
        <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full text-[11.5px] font-mono ml-2"
          style={{ background: '#FFFFFF', border: `1px solid ${token.color.border.default}`, color: token.color.text.secondary }}>
          TX · HVAC · today
        </span>
        <span className="ml-auto text-[11.5px]" style={{ color: token.color.text.muted }}>
          <span className="font-medium" style={{ color: token.color.text.secondary }}>{tray.length}</span> unassigned · <span className="font-medium" style={{ color: token.color.text.secondary }}>{techs.length}</span> techs
          {isViewer && <span className="ml-2.5 inline-flex items-center gap-1" style={{ color: token.status.info.fg }}><ShieldCheck className="w-3 h-3" /> your access</span>}
        </span>
      </Editable>

      <div className="flex-1 flex overflow-hidden gap-3 p-3 pt-0" style={{ background: '#F7F7F5' }}>
        {/* ── Unassigned backlog tray (docked left, §4b) ── */}
        <Editable id="el-backlog" kind="pane" label="Unassigned jobs pane"
          className="w-[236px] flex-shrink-0 flex flex-col rounded-[24px] bg-white border border-white overflow-hidden"
          style={{ boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
          <div className="flex items-center gap-2 px-3 h-10 border-b flex-shrink-0" style={{ borderColor: token.color.border.hairline }}>
            <span className="text-[10.5px] font-mono uppercase tracking-wider" style={{ color: token.color.text.muted }}>Unassigned</span>
            <span className="text-[10.5px] font-mono" style={{ color: token.color.text.faint }}>{tray.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {tray.length === 0
              ? <EmptyState title="All jobs scheduled" hint="Jobs appear here when they're created without a technician or slot." />
              : tray.map(job => (
                <Editable key={job.id} id={`el-card-${job.id}`} kind="card" label="Job card">
                  <BacklogCard job={job} showSkill={showSkillBadge}
                    selected={selectedJobId === job.id}
                    onSelect={() => onSelectJob?.(job.id)}
                    onDragStart={() => setDragId(job.id)} />
                </Editable>
              ))}
          </div>
        </Editable>

        {/* ── Scheduler grid: resource rows × time axis ── */}
        <div className="flex-1 overflow-auto rounded-[24px] bg-white border border-white"
          style={{ boxShadow: '0 14px 38px -34px rgba(28,30,33,0.55)' }}>
          <div style={{ width: 180 + HOURS.length * PX_PER_HOUR }}>
            {/* time-axis header */}
            <div className="flex sticky top-0 z-20" style={{ background: token.color.bg.surface, borderBottom: `1px solid ${token.color.border.default}` }}>
              <div className="w-[180px] flex-shrink-0 h-9 flex items-center px-3 border-r" style={{ borderColor: token.color.border.hairline }}>
                <span className="text-[10.5px] font-mono uppercase tracking-wider" style={{ color: token.color.text.muted }}>Technician</span>
              </div>
              {HOURS.map(h => (
                <div key={h} className="flex-shrink-0 h-9 flex items-center pl-1.5" style={{ width: PX_PER_HOUR }}>
                  <span className="text-[10.5px] font-mono" style={{ color: token.color.text.muted }}>{fmtHour(h)}</span>
                </div>
              ))}
            </div>

            {/* technician lanes */}
            {techs.map(tech => {
              const util = utilization(tech);
              const dbl = hasDoubleBooking(tech);
              return (
                <Editable key={tech.id} id={`el-lane-${tech.id}`} kind="lane" label="Technician lane" className="flex border-b" style={{ borderColor: token.color.border.hairline }}>
                  {/* resource cell */}
                  <div className="w-[180px] flex-shrink-0 flex items-center gap-2 px-3 border-r" style={{ height: LANE_H, borderColor: token.color.border.hairline, background: token.color.bg.surface }}>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0" style={{ background: tech.color }}>{tech.initials}</div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium truncate" style={{ color: token.color.text.primary }}>{tech.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: token.color.border.hairline }}>
                          <div className="h-full rounded-full" style={{ width: `${util}%`, background: util > 85 ? token.status.warning.dot : token.status.success.dot }} />
                        </div>
                        <span className="text-[9.5px] font-mono" style={{ color: token.color.text.faint }}>{util}%</span>
                        {dbl && <span className="inline-flex items-center gap-0.5 text-[9px] font-medium" style={{ color: token.status.danger.fg }}><AlertTriangle className="w-2.5 h-2.5" />2×</span>}
                      </div>
                    </div>
                  </div>

                  {/* time track */}
                  <div className="relative flex-1" style={{ height: LANE_H }}>
                    {/* hour drop cells */}
                    {HOURS.map(h => {
                      const isHover = hover?.tech === tech.id && hover?.hour === h;
                      const match = dragId ? tech.skills.includes(jobById(dragId)?.skill || '') : false;
                      return (
                        <div key={h}
                          onDragOver={e => { e.preventDefault(); setHover({ tech: tech.id, hour: h }); }}
                          onDrop={() => requestAssign(tech.id, h)}
                          className="absolute top-0 bottom-0 border-l"
                          style={{
                            left: (h - GRID_START) * PX_PER_HOUR, width: PX_PER_HOUR,
                            borderColor: token.color.border.hairline,
                            background: isHover ? (match ? token.status.success.bg : token.color.brand.subtle) : 'transparent',
                          }} />
                      );
                    })}
                    {/* scheduled job blocks */}
                    {laneJobs(tech).map(job => {
                      const conflict = laneJobs(tech).some(o => o.id !== job.id && overlaps(o, job));
                      const s = token.status[job.overdue ? 'danger' : statusFor('scheduled')];
                      return (
                        <button key={job.id}
                          onClick={() => onSelectJob?.(job.id)}
                          className="absolute top-1.5 bottom-1.5 rounded-[14px] px-2 py-1 text-left overflow-hidden transition-shadow hover:shadow-md"
                          style={{
                            left: (job.start! - GRID_START) * PX_PER_HOUR + 2,
                            width: (job.duration ?? 1) * PX_PER_HOUR - 4,
                            background: token.color.bg.surface,
                            border: `1.5px solid ${conflict ? token.status.danger.fg : selectedJobId === job.id ? token.color.brand.primary : token.color.border.default}`,
                            boxShadow: conflict ? `0 0 0 3px ${token.status.danger.bg}` : token.elev[1],
                          }}>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: job.overdue ? token.status.danger.dot : s.dot }} />
                            <span className="text-[11px] font-semibold truncate" style={{ color: token.color.text.primary }}>{job.customer}</span>
                          </div>
                          <p className="text-[10px] truncate mt-0.5" style={{ color: token.color.text.muted }}>{job.jobType}</p>
                          {conflict && <span className="inline-flex items-center gap-0.5 text-[9px] font-medium mt-0.5" style={{ color: token.status.danger.fg }}><AlertTriangle className="w-2.5 h-2.5" />Double-booked</span>}
                        </button>
                      );
                    })}
                    {dragId && hover?.tech === tech.id && (
                      <div className="absolute top-1.5 bottom-1.5 rounded-lg pointer-events-none flex items-center justify-center"
                        style={{
                          left: (hover.hour - GRID_START) * PX_PER_HOUR + 2,
                          width: (jobById(dragId)?.duration ?? 1.5) * PX_PER_HOUR - 4,
                          border: `1.5px dashed ${tech.skills.includes(jobById(dragId)?.skill || '') ? token.status.success.dot : token.color.brand.primary}`,
                          background: tech.skills.includes(jobById(dragId)?.skill || '') ? token.status.success.bg : token.color.brand.subtle,
                        }}>
                        <span className="text-[9.5px] font-medium" style={{ color: tech.skills.includes(jobById(dragId)?.skill || '') ? token.status.success.fg : token.color.brand.primary }}>
                          {fmtHour(hover.hour)}
                        </span>
                      </div>
                    )}
                  </div>
                </Editable>
              );
            })}
          </div>
        </div>
      </div>

      {/* Write-confirm drawer (§9) — names what, scope, effect */}
      <AnimatePresence>
        {confirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[400]" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={() => { setConfirm(null); setDryRun(false); }} />
            <motion.div initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }} transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="fixed top-0 right-0 h-full w-[380px] z-[410] flex flex-col" style={{ background: token.color.bg.surface, boxShadow: '-8px 0 24px rgba(0,0,0,0.12)' }}>
              <div className="h-12 flex items-center justify-between px-4 border-b" style={{ borderColor: token.color.border.default }}>
                <span className="text-[14px] font-semibold" style={{ color: token.color.text.primary }}>Confirm schedule</span>
                <button onClick={() => { setConfirm(null); setDryRun(false); }} className="w-7 h-7 rounded-md flex items-center justify-center" style={{ color: token.color.text.muted }}><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-[13px] leading-relaxed" style={{ color: token.color.text.primary }}>
                  Assign <span className="font-semibold">{confirm.job.customer}</span> ({confirm.job.id}) to <span className="font-semibold">{confirm.tech.name}</span> for <span className="font-semibold">{fmtHour(confirm.start)}–{fmtHour(confirm.start + (confirm.job.duration ?? 1.5))}</span>?
                </p>
                <div className="rounded-xl p-3 space-y-1.5 text-[12px]" style={{ background: token.color.bg.muted, border: `1px solid ${token.color.border.default}` }}>
                  <Row k="Job.assigned_to" v={confirm.tech.name} />
                  <Row k="Job.schedule" v={`${fmtHour(confirm.start)} · ${confirm.job.duration ?? 1.5}h`} />
                </div>
                {conflictAtDrop && <Flag text={`Overlaps an existing job on ${confirm.tech.name}'s lane — double-booking.`} />}
                {skillMiss && <Flag text={`${confirm.tech.name} lacks the ${confirm.job.skill} skill.`} />}
                <button onClick={() => setDryRun(v => !v)} className="w-full flex items-center gap-2 h-8 px-2.5 rounded-lg text-left transition-colors" style={{ background: dryRun ? token.color.brand.subtle : token.color.bg.muted }}>
                  <span className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0" style={{ background: dryRun ? token.color.brand.primary : token.color.bg.surface, border: dryRun ? 'none' : `1.5px solid ${token.color.border.strong}` }}>{dryRun && <Check className="w-3 h-3 text-white" />}</span>
                  <span className="text-[11.5px]" style={{ color: token.color.text.secondary }}>Dry-run — validate without writing</span>
                </button>
              </div>
              <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: token.color.border.default }}>
                <button onClick={() => { setConfirm(null); setDryRun(false); }} className="flex-1 h-9 rounded-xl text-[13px] font-medium transition-colors" style={{ background: token.color.bg.muted, color: token.color.text.secondary }}>Cancel</button>
                <button onClick={commitAssign} className="flex-1 h-9 rounded-xl text-[13px] font-semibold text-white inline-flex items-center justify-center gap-1.5 transition-colors"
                  style={{ background: (conflictAtDrop && !dryRun) ? token.status.danger.fg : token.color.brand.primary }}>
                  <Check className="w-4 h-4" /> {dryRun ? 'Run dry-run' : conflictAtDrop ? 'Schedule anyway' : 'Assign & schedule'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Audit toast */}
      <AnimatePresence>
        {toast && (
          <motion.button onClick={onOpenAudit}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[420] inline-flex items-center gap-3 px-3.5 h-12 rounded-[18px] text-[12.5px] font-medium"
            style={{ background: token.color.bg.surface, color: token.color.text.primary, border: `1px solid ${token.color.border.default}`, boxShadow: '0 16px 42px -22px rgba(28,30,33,0.42)' }}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: token.status.success.bg, color: token.status.success.fg }}>
              <Check className="w-4 h-4" />
            </span>
            <span>{toast}</span>
            <span className="inline-flex items-center gap-1 ml-1" style={{ color: token.color.text.muted }}><History className="w-3 h-3" /> View history</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function BacklogCard({ job, showSkill, selected, onSelect, onDragStart }: {
  job: Job; showSkill?: boolean; selected?: boolean; onSelect?: () => void; onDragStart?: () => void;
}) {
  return (
    <div draggable onDragStart={onDragStart} onClick={onSelect}
      className="group rounded-[18px] p-2.5 cursor-pointer select-none transition-shadow hover:shadow-sm"
      style={{
        background: token.color.bg.surface,
        border: `1px solid ${selected ? token.color.brand.primary : job.overdue ? '#FCA5A5' : token.color.border.default}`,
        boxShadow: selected ? '0 10px 26px -22px rgba(253,80,0,0.65)' : token.elev[1],
      }}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold truncate leading-tight" style={{ color: token.color.text.primary }}>{job.customer}</p>
          <p className="text-[11px] truncate mt-0.5" style={{ color: token.color.text.secondary }}>{job.jobType}</p>
        </div>
        <GripVertical className="w-3.5 h-3.5 flex-shrink-0" style={{ color: token.color.text.faint }} />
      </div>
      <div className="flex items-center gap-1 mt-1.5 text-[10.5px]" style={{ color: token.color.text.muted }}>
        <MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{job.address}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <StatusPill label={job.priority} status={job.priority === 'High' ? 'danger' : job.priority === 'Medium' ? 'warning' : 'info'} />
        {job.overdue
          ? <StatusPill label={job.sla} status="danger" icon={<AlertTriangle className="w-2.5 h-2.5" />} />
          : <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: token.color.bg.muted, color: token.color.text.secondary }}><Clock className="w-2.5 h-2.5" />{job.sla}</span>}
        {showSkill && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: token.color.bg.muted, color: token.color.text.secondary }}>{job.skill}</span>}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex items-center justify-between gap-3"><span className="font-mono text-[11px]" style={{ color: token.color.text.muted }}>{k}</span><span className="font-medium text-right" style={{ color: token.color.text.primary }}>{v}</span></div>;
}
function Flag({ text }: { text: string }) {
  return <div className="flex items-start gap-1.5 text-[11.5px] px-1" style={{ color: token.status.warning.fg }}><AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />{text}</div>;
}
