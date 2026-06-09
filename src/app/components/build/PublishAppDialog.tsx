import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Check, ChevronDown, Globe, Users, Lock, CheckCircle2 } from 'lucide-react';

export type Role = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

const WORKSPACES = ['Work', 'CRM', 'Finance', 'Field Service'];

// icon choices for the app — emoji, picked next to Name
const APP_ICONS = ['💰', '📐', '🧮', '📨', '📊', '🗂️', '🔧', '📅', '🏠', '📦', '⚡', '🛠️'];

// ── People directory for the "selected users" checklist ─────────────────────
export interface Person {
  id: string;
  name: string;
  email: string;
  color: string;
  role?: 'Editor' | 'Viewer';
}

const PEOPLE: Person[] = [
  { id: 'u-olivia',  name: 'Olivia Rhye',   email: 'olivia@acme.co',    color: '#E7E4DF' },
  { id: 'u-candice', name: 'Candice Wu',    email: 'candice@acme.co',   color: '#E1E4EA' },
  { id: 'u-meera',   name: 'Meera Joshi',   email: 'meera@acme.co',     color: '#E8E2EC' },
  { id: 'u-rahul',   name: 'Rahul Gupta',   email: 'rahul@acme.co',     color: '#DEE8E2' },
  { id: 'u-carlos',  name: 'Carlos Mendez', email: 'carlos@vendor.io',  color: '#DFE6EC' },
  { id: 'u-dana',    name: 'Dana Wright',   email: 'dana@acme.co',      color: '#E6E2EC' },
  { id: 'u-aisha',   name: 'Aisha Khan',    email: 'aisha@acme.co',     color: '#ECE7DC' },
  { id: 'u-tomas',   name: 'Tomas Reyes',   email: 'tomas@partner.com', color: '#ECE0E0' },
];

// backward-compat exports
export type Member = Person;
export type Grantee = Person;

type Mode = 'me' | 'everyone' | 'selected';

interface Props {
  appName: string;
  appIcon?: string;
  onClose: () => void;
  onPublish: (opts: {
    name: string; icon: string; workspace: string; slug: string;
    everyone: boolean; grantees: Person[];
  }) => void;
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[·—–]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function formatStamp(d: Date) {
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

// Workspace dropdown whose menu portals to <body> so it never gets clipped.
function WorkspaceMenu({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.left, width: Math.max(r.width, 160) });
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[13.5px] font-medium text-[#1C1E21] transition-colors hover:bg-[#F4F4F2]"
      >
        <Globe className="h-4 w-4 text-[#9CA3AF]" />
        {value}
        <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[1490]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[1500] overflow-hidden rounded-lg border border-[#E6E8EC] bg-white py-1"
            style={{ top: pos.top, left: pos.left, width: pos.width, boxShadow: '0 12px 32px -12px rgba(28,30,33,0.22)' }}
          >
            {WORKSPACES.map((w) => (
              <button key={w} onClick={() => { onChange(w); setOpen(false); }}
                className="flex w-full items-center justify-between gap-3 px-3 h-9 text-[13.5px] text-[#374151] transition-colors hover:bg-[#F4F4F2] hover:text-[#1C1E21]">
                <span className="inline-flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-[#9CA3AF]" />{w}</span>
                {w === value && <Check className="h-3.5 w-3.5 text-[#1C1E21]" />}
              </button>
            ))}
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

type Perm = 'Editor' | 'Viewer';
const PERMS: Perm[] = ['Editor', 'Viewer'];

// small permission dropdown, portaled so it isn't clipped by the scroll area
function RoleMenu({ value, onChange }: { value: Perm; onChange: (v: Perm) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const W = 120;

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: r.right - W });
  }, [open]);

  return (
    <>
      <button ref={btnRef} type="button" onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[12.5px] font-medium text-[#374151] transition-colors hover:bg-[#EFEFEC]">
        {value}
        <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[1490]" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="fixed z-[1500] overflow-hidden rounded-lg border border-[#E6E8EC] bg-white py-1"
            style={{ top: pos.top, left: pos.left, width: W, boxShadow: '0 12px 32px -12px rgba(28,30,33,0.22)' }}>
            {PERMS.map((p) => (
              <button key={p} onClick={(e) => { e.stopPropagation(); onChange(p); setOpen(false); }}
                className="flex w-full items-center justify-between gap-3 px-3 h-8 text-[13px] text-[#374151] transition-colors hover:bg-[#F4F4F2] hover:text-[#1C1E21]">
                {p}
                {p === value && <Check className="h-3.5 w-3.5 text-[#1C1E21]" />}
              </button>
            ))}
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

const MODES: { v: Mode; label: string; icon: typeof Lock }[] = [
  { v: 'me',       label: 'Only me',        icon: Lock },
  { v: 'everyone', label: 'Everyone',       icon: Globe },
  { v: 'selected', label: 'Selected users', icon: Users },
];

export function PublishAppDialog({ appName, appIcon = '💰', onClose, onPublish }: Props) {
  const [name, setName] = useState(appName);
  const [icon, setIcon] = useState(appIcon);
  const [iconOpen, setIconOpen] = useState(false);
  const iconBtnRef = useRef<HTMLButtonElement>(null);
  const [iconPos, setIconPos] = useState<{ top: number; left: number } | null>(null);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [slug, setSlug] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>('everyone');
  const [selected, setSelected] = useState<Set<string>>(new Set(['u-olivia', 'u-candice']));
  const [roles, setRoles] = useState<Record<string, Perm>>({ 'u-olivia': 'Editor', 'u-candice': 'Viewer' });
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchPos, setSearchPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [publishedAt, setPublishedAt] = useState<Date | null>(null);

  useLayoutEffect(() => {
    if (!searchOpen || !searchRef.current) return;
    const r = searchRef.current.getBoundingClientRect();
    setSearchPos({ top: r.bottom + 6, left: r.left, width: r.width });
  }, [searchOpen]);

  const pageSlug = slug ?? slugify(name);

  useLayoutEffect(() => {
    if (!iconOpen || !iconBtnRef.current) return;
    const r = iconBtnRef.current.getBoundingClientRect();
    setIconPos({ top: r.bottom + 8, left: r.left });
  }, [iconOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PEOPLE;
    return PEOPLE.filter((p) => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q));
  }, [query]);

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else { next.add(id); setRoles((r) => (r[id] ? r : { ...r, [id]: 'Viewer' })); }
      return next;
    });

  const setRole = (id: string, p: Perm) => setRoles((r) => ({ ...r, [id]: p }));
  const added = PEOPLE.filter((p) => selected.has(p.id));

  const everyone = mode === 'everyone';
  const isSelected = mode === 'selected';

  const submit = () => {
    const base = isSelected ? PEOPLE.filter((p) => selected.has(p.id)) : everyone ? PEOPLE : [];
    const grantees = base.map((p) => ({ ...p, role: roles[p.id] ?? 'Viewer' }));
    onPublish({ name, icon, workspace, slug: pageSlug, everyone, grantees });
    setPublishedAt(new Date());
  };

  const ctaLabel = publishedAt ? 'Publish changes' : 'Publish';

  return createPortal(
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[450] bg-[#1C1E21]/30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-1/2 z-[460] w-[480px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white"
        style={{ boxShadow: '0 0 0 1px rgba(28,30,33,0.07), 0 1px 2px rgba(28,30,33,0.04), 0 32px 90px -42px rgba(28,30,33,0.5)' }}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-[#F0F0F2] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F4F4F2] text-[16px]">{icon}</span>
            <div>
              <h3 className="text-[15.5px] font-semibold leading-tight tracking-[-0.01em] text-[#1C1E21]">Publish this app for</h3>
              <p className="text-[12.5px] text-[#9CA3AF]">Choose who can open and respond to this app</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1C1E21]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* published status */}
          <AnimatePresence initial={false}>
            {publishedAt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden">
                <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-[#E6E8EC] bg-[#F7F7F5] px-3.5 py-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#1C1E21]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold text-[#1C1E21]">Published</p>
                    <p className="text-[12px] text-[#9CA3AF]">Last published on {formatStamp(publishedAt)}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + icon */}
          <label className="mb-1.5 block text-[12px] font-semibold text-[#374151]">Name</label>
          <div className="mb-4 flex items-center gap-2">
            <button
              ref={iconBtnRef}
              type="button"
              onClick={() => setIconOpen((o) => !o)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[#E6E8EC] bg-white text-[18px] transition-colors hover:border-[#C9CDD4]"
              title="Choose an icon"
            >
              {icon}
            </button>
            {iconOpen && iconPos && createPortal(
              <>
                <div className="fixed inset-0 z-[1490]" onClick={() => setIconOpen(false)} />
                <div
                  className="fixed z-[1500] grid grid-cols-6 gap-1 rounded-lg border border-[#E6E8EC] bg-white p-2"
                  style={{ top: iconPos.top, left: iconPos.left, boxShadow: '0 12px 32px -12px rgba(28,30,33,0.22)' }}
                >
                  {APP_ICONS.map((e) => (
                    <button key={e} type="button" onClick={() => { setIcon(e); setIconOpen(false); }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[18px] transition-colors hover:bg-[#F4F4F2]"
                      style={{ background: e === icon ? '#EFEFEC' : 'transparent' }}>
                      {e}
                    </button>
                  ))}
                </div>
              </>,
              document.body,
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#E6E8EC] bg-white px-3.5 text-[14px] text-[#1C1E21] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#C9CDD4]"
            />
          </div>

          {/* Workspace — breadcrumb: Work / measurement-roof-draw */}
          <label className="mb-1.5 block text-[12px] font-semibold text-[#374151]">Workspace</label>
          <div className="mb-5 flex h-10 w-full items-center gap-1 rounded-lg border border-[#E6E8EC] bg-white pl-2 pr-2.5">
            <WorkspaceMenu value={workspace} onChange={setWorkspace} />
            <span className="text-[14px] text-[#C4CAD4]">/</span>
            <input
              value={pageSlug}
              onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
              spellCheck={false}
              className="h-7 min-w-0 flex-1 rounded-md bg-transparent px-1.5 text-[13.5px] font-medium tracking-[-0.01em] text-[#1C1E21] outline-none focus:bg-[#F7F7F5]"
            />
          </div>

          <div className="mb-5 border-t border-[#F0F0F2]" />

          {/* Share this App to — compact pill segmented toggle */}
          <label className="mb-1.5 block text-[12px] font-semibold text-[#374151]">Share this App to</label>
          <div className="flex w-full gap-0.5 rounded-full border border-[#E6E8EC] bg-[#F4F4F2] p-0.5">
            {MODES.map(({ v, label, icon: Ic }) => {
              const active = mode === v;
              return (
                <button key={v} type="button" onClick={() => setMode(v)}
                  className="relative flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium transition-colors"
                  style={{
                    background: active ? '#FFFFFF' : 'transparent',
                    color: active ? '#1C1E21' : '#6B7280',
                    boxShadow: active ? '0 1px 2px rgba(28,30,33,0.1), 0 0 0 1px rgba(28,30,33,0.04)' : 'none',
                  }}>
                  <Ic className="h-3.5 w-3.5" style={{ color: active ? '#1C1E21' : '#9CA3AF' }} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* search + people checklist — only for selected users */}
          <AnimatePresence initial={false}>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden">
                <div className="pt-4">
                  <div ref={searchRef} className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                      onFocus={() => setSearchOpen(true)}
                      placeholder="Search people to add"
                      className="h-10 w-full rounded-lg border border-[#E6E8EC] bg-white pl-9 pr-3 text-[14px] text-[#1C1E21] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#C9CDD4]"
                    />
                  </div>

                  {/* search results — floating overlay below the input */}
                  {searchOpen && searchPos && createPortal(
                    <>
                      <div className="fixed inset-0 z-[1490]" onClick={() => setSearchOpen(false)} />
                      <div className="fixed z-[1500] max-h-[260px] overflow-y-auto rounded-lg border border-[#E6E8EC] bg-white p-1.5"
                        style={{ top: searchPos.top, left: searchPos.left, width: searchPos.width, boxShadow: '0 16px 40px -16px rgba(28,30,33,0.28)' }}>
                        {filtered.map((p) => {
                          const checked = selected.has(p.id);
                          return (
                            <button key={p.id} type="button" onClick={() => toggle(p.id)}
                              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#F4F4F2]">
                              <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors"
                                style={{ borderColor: checked ? '#1C1E21' : '#D6D9DE', background: checked ? '#1C1E21' : '#FFFFFF' }}>
                                {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                              </span>
                              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-[#374151]" style={{ background: p.color }}>
                                {initials(p.name)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13.5px] font-medium tracking-[-0.01em] text-[#1C1E21]">{p.name}</span>
                                <span className="block truncate text-[12px] text-[#9CA3AF]">{p.email}</span>
                              </span>
                            </button>
                          );
                        })}
                        {filtered.length === 0 && (
                          <p className="px-2.5 py-6 text-center text-[12.5px] text-[#9CA3AF]">No people match “{query}”</p>
                        )}
                      </div>
                    </>,
                    document.body,
                  )}

                  {/* persistent list of who's selected + their permission */}
                  {added.length > 0 && (
                    <>
                      <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                        Selected users · {added.length}
                      </p>
                      <div className="rounded-lg border border-[#E6E8EC]">
                        {added.map((p, i) => (
                          <div key={p.id} className={`flex items-center gap-3 px-2.5 py-2 ${i > 0 ? 'border-t border-[#F0F0F2]' : ''}`}>
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11.5px] font-semibold text-[#374151]" style={{ background: p.color }}>
                              {initials(p.name)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13.5px] font-medium tracking-[-0.01em] text-[#1C1E21]">{p.name}</span>
                              <span className="block truncate text-[12px] text-[#9CA3AF]">{p.email}</span>
                            </span>
                            <RoleMenu value={roles[p.id] ?? 'Viewer'} onChange={(v) => setRole(p.id, v)} />
                            <button onClick={() => toggle(p.id)} title="Remove"
                              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#C4CAD4] transition-colors hover:bg-[#F3F4F6] hover:text-[#1C1E21]">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* footer — publish at bottom-right */}
        <div className="flex items-center justify-end gap-2 border-t border-[#F0F0F2] px-6 py-4">
          <button onClick={onClose}
            className="h-9 rounded-lg border border-[#E6E8EC] bg-white px-4 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F4F4F2]">
            Cancel
          </button>
          <button onClick={submit}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1C1E21] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2C2F33]">
            {publishedAt ? <CheckCircle2 className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            {ctaLabel}
          </button>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
