import { useState } from 'react';
import {
  Layers, Database, Zap, Palette, ChevronRight, Plus, Trash2,
  Box, Filter, LayoutGrid, CreditCard, Columns3, Check, AlertTriangle,
  CalendarClock, Clock, Inbox, Rows3,
} from 'lucide-react';
import { ROOFDRAW_TREE, type AppElement, type ElementType } from './buildData';

const TYPE_ICON: Record<ElementType, typeof Box> = {
  Container: Box, FilterBar: Filter, Board: LayoutGrid, JobCard: CreditCard,
  TechLane: Columns3, Scheduler: CalendarClock, TimeAxis: Clock,
  ResourceLane: Rows3, JobBlock: CreditCard, BacklogTray: Inbox,
  Table: LayoutGrid, Chart: LayoutGrid, Metric: Box,
  Form: Box, Field: Box, Button: Box, Text: Box,
};

// ── Left pane: element tree ─────────────────────────────────────────────
function TreeNode({ el, depth, selectedId, onSelect }: {
  el: AppElement; depth: number; selectedId: string; onSelect: (id: string) => void;
}) {
  const Icon = TYPE_ICON[el.type] || Box;
  const active = selectedId === el.id;
  return (
    <div>
      <button
        onClick={() => onSelect(el.id)}
        className="w-full flex items-center gap-1.5 h-8 rounded-md text-left transition-colors"
        style={{ paddingLeft: 8 + depth * 14, paddingRight: 8, background: active ? '#F0F0F0' : 'transparent' }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#F0F0F0'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      >
        {el.children?.length ? <ChevronRight className="w-3 h-3 text-[#959595] flex-shrink-0" /> : <span className="w-3 flex-shrink-0" />}
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: active ? '#000000' : '#636363' }} />
        <span className="text-[12.5px] truncate" style={{ color: active ? '#000000' : '#636363', fontWeight: active ? 600 : 400 }}>{el.label}</span>
        {el.bindingBroken && <AlertTriangle className="w-3 h-3 ml-auto text-[#E5484D] flex-shrink-0" />}
      </button>
      {el.children?.map(c => <TreeNode key={c.id} el={c} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />)}
    </div>
  );
}

export function ElementTreePane({ selectedId, onSelect, tree = ROOFDRAW_TREE }: { selectedId: string; onSelect: (id: string) => void; tree?: AppElement }) {
  return (
    <div className="w-[220px] flex-shrink-0 border-r border-[rgba(0,0,0,0.08)] bg-white flex flex-col">
      <div className="h-11 px-3 flex items-center justify-between border-b border-[rgba(0,0,0,0.08)]">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-[#636363]">
          <Layers className="w-3.5 h-3.5" /> Elements
        </span>
        <button className="w-6 h-6 rounded-md hover:bg-[#F0F0F0] flex items-center justify-center text-[#959595]">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-1.5">
        <TreeNode el={tree} depth={0} selectedId={selectedId} onSelect={onSelect} />
      </div>
    </div>
  );
}

// ── Right pane: inspector ───────────────────────────────────────────────
function findEl(el: AppElement, id: string): AppElement | null {
  if (el.id === id) return el;
  for (const c of el.children || []) { const f = findEl(c, id); if (f) return f; }
  return null;
}

const TABS = [
  { key: 'props', label: 'Props', icon: Box },
  { key: 'data', label: 'Data', icon: Database },
  { key: 'actions', label: 'Actions', icon: Zap },
  { key: 'style', label: 'Style', icon: Palette },
] as const;

export function InspectorPane({ selectedId, skillBadge, onToggleSkillBadge, tree = ROOFDRAW_TREE }: {
  selectedId: string; skillBadge: boolean; onToggleSkillBadge: () => void; tree?: AppElement;
}) {
  const [tab, setTab] = useState<typeof TABS[number]['key']>('data');
  const [rawQuery, setRawQuery] = useState(false);
  const [refresh, setRefresh] = useState<'Live' | 'Scheduled'>('Live');
  const el = findEl(tree, selectedId) || tree;
  const appKind = tree.type === 'Scheduler' ? 'dispatch' : tree.type === 'Board' ? 'kanban' : 'cockpit';
  const entity = appKind === 'cockpit' ? 'Invoices' : appKind === 'kanban' ? 'Quotes' : 'Jobs';
  const rawFilter = appKind === 'cockpit'
    ? `Invoices
  .where(status == "overdue")
  .groupBy(agingBucket)
  .sort(daysOverdue desc)
  .viewerScoped()`
    : appKind === 'kanban'
      ? `Quotes
  .where(status == "sent")
  .where(daysWaiting >= 3)
  .groupBy(followUpStage)
  .sort(daysWaiting desc)
  .viewerScoped()`
      : `Jobs
  .where(category == "HVAC")
  .where(region == "TX")
  .where(scheduled in thisWeek)
  .where(status == "unassigned")
  .sort(priority desc, sla asc)
  .viewerScoped()`;
  const visualFilters = appKind === 'cockpit'
    ? [['status', '= overdue'], ['group', '= aging bucket'], ['branch', '= viewer branch'], ['permission', '= finance scoped']]
    : appKind === 'kanban'
      ? [['status', '= sent'], ['age', '>= 3 days'], ['group', '= follow-up stage'], ['owner', '= viewer scope']]
      : [['category', '= HVAC'], ['region', '= TX'], ['scheduled', '∈ this week'], ['status', '= unassigned']];

  return (
    <div className="w-[300px] flex-shrink-0 border-l border-[rgba(0,0,0,0.08)] bg-white flex flex-col">
      <div className="px-3 pt-3 pb-2 border-b border-[rgba(0,0,0,0.08)]">
        <p className="text-[11px] uppercase tracking-wider text-[#959595] font-medium">Selected element</p>
        <p className="text-[14px] font-medium text-[#000000] mt-0.5">{el.label}</p>
        <p className="text-[11.5px] text-[#636363]">{el.type}</p>
      </div>

      <div className="flex border-b border-[rgba(0,0,0,0.08)]">
        {TABS.map(t => {
          const Icon = t.icon; const on = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 h-9 flex items-center justify-center gap-1 text-[11.5px] font-medium transition-colors relative"
              style={{ color: on ? '#000000' : '#636363' }}>
              <Icon className="w-3.5 h-3.5" /> {t.label}
              {on && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[#000000]" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* schema-drift: binding broken → fixable state, not silent drop (§4) */}
        {el.bindingBroken && (
          <div className="rounded-xl border border-[#F0B7B9] bg-[#FCF1F1] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#E5484D]" />
              <span className="text-[12px] font-medium text-[#C13539]">Binding broken</span>
            </div>
            <p className="text-[11px] text-[#E5484D] leading-snug mb-2.5">
              Field <span className="font-mono">{el.binding}</span> no longer exists. Data isn't dropped silently — remap or remove this element.
            </p>
            <div className="flex gap-1.5">
              <button className="flex-1 h-8 rounded-lg text-[11.5px] font-medium text-white bg-[#E5484D] hover:bg-[#E5484D] transition-colors">Remap field</button>
              <button className="flex-1 h-8 rounded-lg text-[11.5px] font-medium text-[#C13539] bg-white border border-[#F0B7B9] hover:bg-[#FEF2F2] transition-colors">Remove</button>
            </div>
          </div>
        )}
        {tab === 'data' && (
          <>
            <Field label="Entity"><Pill>{entity}</Pill></Field>
            <Field label="Bound query">
              <button onClick={() => setRawQuery(r => !r)} className="text-[11px] text-[#000000] font-medium hover:underline mb-1.5">
                {rawQuery ? 'Visual builder' : 'View raw filter'}
              </button>
              {rawQuery ? (
                <pre className="text-[11px] font-mono bg-[#000000] text-[#E5E7EB] rounded-lg p-2.5 overflow-x-auto leading-relaxed">{rawFilter}</pre>
              ) : (
                <div className="space-y-1.5">
                  {visualFilters.map(([f, op]) => (
                    <div key={f} className="flex items-center gap-1.5 text-[11.5px]">
                      <span className="px-1.5 py-1 rounded bg-[#F0F0F0] text-[#636363] font-medium">{f}</span>
                      <span className="text-[#959595]">{op}</span>
                    </div>
                  ))}
                </div>
              )}
            </Field>
            <Field label="Result cap"><Pill>200 rows · paginated</Pill></Field>
            <Field label="Refresh">
              <div className="flex gap-1.5">
                {(['Live', 'Scheduled'] as const).map(m => (
                  <button key={m} onClick={() => setRefresh(m)}
                    className="flex-1 h-8 rounded-md text-[11.5px] font-medium border transition-colors"
                    style={{ borderColor: refresh === m ? '#000000' : 'rgba(0,0,0,0.08)', color: refresh === m ? '#000000' : '#636363', background: refresh === m ? '#F0F0F0' : '#FFF' }}>{m}</button>
                ))}
              </div>
              <p className="text-[10.5px] text-[#959595] mt-1">
                {refresh === 'Live' ? 'Re-queries on every view — freshest, higher cost.' : 'Cached, refreshed every 15 min — cheaper under multi-tenant load.'}
              </p>
            </Field>
            <p className="text-[10.5px] text-[#959595] leading-snug flex items-start gap-1">
              <Database className="w-3 h-3 mt-0.5 flex-shrink-0" />
              Binds to stable field IDs — renaming a status in settings won't break this.
            </p>
          </>
        )}

        {tab === 'props' && (
          <>
            <Field label="Card fields">
              {(el.fields || ['customer', 'job type', 'SLA deadline', 'priority', 'address']).map(f => (
                <div key={f} className="flex items-center justify-between h-8 px-2 rounded-md hover:bg-[#F0F0F0] text-[12px] text-[#636363]">
                  {f}<Check className="w-3.5 h-3.5 text-[#000000]" />
                </div>
              ))}
              <button className="w-full mt-1 h-8 rounded-md border border-dashed border-[rgba(0,0,0,0.08)] text-[11.5px] text-[#959595] hover:border-[#000000] hover:text-[#000000] inline-flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Add field
              </button>
            </Field>
            <Field label="Skill-match badge">
              <button onClick={onToggleSkillBadge}
                className="w-full flex items-center justify-between h-9 px-3 rounded-lg border transition-colors"
                style={{ borderColor: skillBadge ? '#000000' : 'rgba(0,0,0,0.08)', background: skillBadge ? '#F0F0F0' : '#FFFFFF' }}>
                <span className="text-[12.5px] text-[#000000]">Show on cards</span>
                <span className="w-9 h-5 rounded-full p-0.5 transition-colors" style={{ background: skillBadge ? '#000000' : '#D1D5DB' }}>
                  <span className="block w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: skillBadge ? 'translateX(16px)' : 'translateX(0)' }} />
                </span>
              </button>
              <p className="text-[10.5px] text-[#959595] mt-1">Power-user extension — adds technician skill to each card.</p>
            </Field>
          </>
        )}

        {tab === 'actions' && (
          <>
            <Field label={appKind === 'cockpit' ? 'rowAction(invoice)' : appKind === 'kanban' ? 'onDrop(card, stage)' : 'onDrop(card, lane)'}>
              <div className="rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#FAFAFA] p-2.5 space-y-1.5">
                {appKind === 'cockpit' ? (
                  <>
                    <ActionRow icon={Zap} kind="write" text="ContactLog.create(invoice, template)" />
                    <ActionRow icon={Zap} kind="write" text="Invoice.last_contact = now" />
                  </>
                ) : appKind === 'kanban' ? (
                  <>
                    <ActionRow icon={Zap} kind="write" text="Quote.follow_up_stage = stage" />
                    <ActionRow icon={Zap} kind="write" text="EmailDraft.queueForReview()" />
                  </>
                ) : (
                  <>
                    <ActionRow icon={Zap} kind="write" text="Job.assigned_to = lane.tech" />
                    <ActionRow icon={Zap} kind="write" text="Job.schedule = computed slot" />
                  </>
                )}
              </div>
              <button className="w-full mt-2 h-8 rounded-md border border-dashed border-[rgba(0,0,0,0.08)] text-[11.5px] text-[#959595] hover:border-[#000000] hover:text-[#000000] inline-flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" /> Also notify technician
              </button>
            </Field>
            <Field label="Write safety">
              {['Preview before run', 'Confirm on conflict', 'Audited + reversible'].map(s => (
                <div key={s} className="flex items-center gap-1.5 text-[11.5px] text-[#636363] h-7">
                  <Check className="w-3.5 h-3.5 text-[#000000]" /> {s}
                </div>
              ))}
            </Field>
          </>
        )}

        {tab === 'style' && (
          <>
            <Field label="Conditional formatting">
              <div className="rounded-lg border border-[rgba(0,0,0,0.08)] p-2.5 flex items-center gap-2 text-[12px]">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: '#E5484D' }} />
                <span className="text-[#636363]">SLA deadline &lt; now → <span className="font-medium">red</span></span>
              </div>
            </Field>
            <Field label="Density">
              <div className="flex gap-1.5">
                {['Compact', 'Comfortable'].map((d, i) => (
                  <button key={d} className="flex-1 h-8 rounded-md text-[11.5px] font-medium border transition-colors"
                    style={{ borderColor: i === 1 ? '#000000' : 'rgba(0,0,0,0.08)', color: i === 1 ? '#000000' : '#636363', background: i === 1 ? '#F0F0F0' : '#FFF' }}>{d}</button>
                ))}
              </div>
            </Field>
          </>
        )}
      </div>

      <div className="p-3 border-t border-[rgba(0,0,0,0.08)]">
        <button className="w-full h-8 rounded-md text-[12px] font-medium text-[#E5484D] hover:bg-[#FEF2F2] inline-flex items-center justify-center gap-1.5 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Delete element
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-[#636363] mb-1.5">{label}</p>
      {children}
    </div>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center h-7 px-2.5 rounded-lg bg-[#F0F0F0] text-[12px] font-medium text-[#636363]">{children}</span>;
}
function ActionRow({ icon: Icon, kind, text }: { icon: typeof Zap; kind: string; text: string }) {
  return (
    <div className="flex items-center gap-2 text-[11.5px]">
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#FBEAEA] text-[#E5484D]">
        <Icon className="w-2.5 h-2.5" /> {kind}
      </span>
      <span className="font-mono text-[11px] text-[#000000] truncate">{text}</span>
    </div>
  );
}
