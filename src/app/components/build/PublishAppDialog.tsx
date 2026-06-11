import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Search, Check, ChevronDown, Globe, Users, Lock, CheckCircle2,
  Wallet, Ruler, Calculator, Mail, BarChart3, FolderKanban,
  Wrench, Calendar, Home, Package, Zap, Hammer,
  type LucideIcon,
} from 'lucide-react';

export type Role = 'Owner' | 'Admin' | 'Editor' | 'Viewer';

const WORKSPACES = ['Work', 'CRM', 'Finance', 'Field Service'];

// icon choices for the app — lucide glyphs, picked next to Name. The `key` is
// the stable string stored/emitted via onPublish; `Icon` is the rendered glyph.
const APP_ICONS: { key: string; Icon: LucideIcon }[] = [
  { key: 'wallet', Icon: Wallet },
  { key: 'ruler', Icon: Ruler },
  { key: 'calculator', Icon: Calculator },
  { key: 'mail', Icon: Mail },
  { key: 'chart', Icon: BarChart3 },
  { key: 'board', Icon: FolderKanban },
  { key: 'wrench', Icon: Wrench },
  { key: 'calendar', Icon: Calendar },
  { key: 'home', Icon: Home },
  { key: 'package', Icon: Package },
  { key: 'zap', Icon: Zap },
  { key: 'hammer', Icon: Hammer },
];
// legacy emoji icons (from buildData) → lucide key, so apps opened with an
// emoji icon still land on a sensible glyph in the picker.
const EMOJI_TO_KEY: Record<string, string> = {
  '💰': 'wallet', '💸': 'wallet', '📐': 'ruler', '🧮': 'calculator',
  '📨': 'mail', '📊': 'chart', '📈': 'chart', '🗂️': 'board', '🔧': 'wrench',
  '🛠️': 'hammer', '📅': 'calendar', '🏠': 'home', '📦': 'package', '⚡': 'zap',
};
const normalizeIconKey = (k: string): string =>
  APP_ICONS.some((i) => i.key === k) ? k : (EMOJI_TO_KEY[k] ?? 'wallet');
const iconForKey = (key: string): LucideIcon =>
  APP_ICONS.find((i) => i.key === key)?.Icon ?? Wallet;

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
        className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[13.5px] font-medium text-[#000000] transition-colors hover:bg-[#F0F0F0]"
      >
        <Globe className="h-4 w-4 text-[#959595]" />
        {value}
        <ChevronDown className="h-3.5 w-3.5 text-[#959595]" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[1490]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[1500] overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] bg-white py-1"
            style={{ top: pos.top, left: pos.left, width: pos.width, boxShadow: '0 12px 32px -12px rgba(0,0,0,0.22)' }}
          >
            {WORKSPACES.map((w) => (
              <button key={w} onClick={() => { onChange(w); setOpen(false); }}
                className="flex w-full items-center justify-between gap-3 px-3 h-9 text-[13.5px] text-[#636363] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000]">
                <span className="inline-flex items-center gap-2"><Globe className="h-3.5 w-3.5 text-[#959595]" />{w}</span>
                {w === value && <Check className="h-3.5 w-3.5 text-[#000000]" />}
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
        className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-[12.5px] font-medium text-[#636363] transition-colors hover:bg-[#F0F0F0]">
        {value}
        <ChevronDown className="h-3.5 w-3.5 text-[#959595]" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
      </button>
      {open && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[1490]" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div className="fixed z-[1500] overflow-hidden rounded-lg border border-[rgba(0,0,0,0.08)] bg-white py-1"
            style={{ top: pos.top, left: pos.left, width: W, boxShadow: '0 12px 32px -12px rgba(0,0,0,0.22)' }}>
            {PERMS.map((p) => (
              <button key={p} onClick={(e) => { e.stopPropagation(); onChange(p); setOpen(false); }}
                className="flex w-full items-center justify-between gap-3 px-3 h-8 text-[13px] text-[#636363] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000]">
                {p}
                {p === value && <Check className="h-3.5 w-3.5 text-[#000000]" />}
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

export function PublishAppDialog({ appName, appIcon = 'wallet', onClose, onPublish }: Props) {
  const [name, setName] = useState(appName);
  const [icon, setIcon] = useState(normalizeIconKey(appIcon));
  const IconCmp = iconForKey(icon);
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

  const ctaLabel = publishedAt
    ? 'Publish changes'
    : everyone
      ? 'Publish to everyone'
      : 'Publish';

  return createPortal(
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[450] bg-[#000000]/30" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-1/2 z-[460] w-[480px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white"
        style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04), 0 32px 90px -42px rgba(0,0,0,0.5)' }}
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-[rgba(0,0,0,0.05)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0F0F0]"><IconCmp className="h-[18px] w-[18px] text-[#000000]" /></span>
            <div>
              <h3 className="text-[15.5px] font-medium leading-tight tracking-[-0.01em] text-[#000000]">Publish this app</h3>
              <p className="text-[12.5px] text-[#959595]">Choose who can open and respond to this app</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-[#959595] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000]">
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
                <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#F8F8F8] px-3.5 py-3">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#000000]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-[#000000]">Published</p>
                    <p className="text-[12px] text-[#959595]">Last published on {formatStamp(publishedAt)}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name + icon */}
          <label className="mb-1.5 block text-[12px] font-medium text-[#636363]">Name</label>
          <div className="mb-4 flex items-center gap-2">
            <button
              ref={iconBtnRef}
              type="button"
              onClick={() => setIconOpen((o) => !o)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.08)] bg-white transition-colors hover:border-[rgba(0,0,0,0.18)]"
              title="Choose an icon"
            >
              <IconCmp className="h-5 w-5 text-[#000000]" />
            </button>
            {iconOpen && iconPos && createPortal(
              <>
                <div className="fixed inset-0 z-[1490]" onClick={() => setIconOpen(false)} />
                <div
                  className="fixed z-[1500] grid grid-cols-6 gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-2"
                  style={{ top: iconPos.top, left: iconPos.left, boxShadow: '0 12px 32px -12px rgba(0,0,0,0.22)' }}
                >
                  {APP_ICONS.map(({ key, Icon }) => (
                    <button key={key} type="button" onClick={() => { setIcon(key); setIconOpen(false); }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F0F0F0]"
                      style={{ background: key === icon ? '#F0F0F0' : 'transparent' }}>
                      <Icon className="h-[18px] w-[18px] text-[#000000]" />
                    </button>
                  ))}
                </div>
              </>,
              document.body,
            )}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-3.5 text-[14px] text-[#000000] outline-none transition-colors placeholder:text-[#959595] focus:border-[rgba(0,0,0,0.18)]"
            />
          </div>

          {/* Workspace — breadcrumb: Work / measurement-roof-draw */}
          <label className="mb-1.5 block text-[12px] font-medium text-[#636363]">Workspace</label>
          <div className="mb-5 flex h-10 w-full items-center gap-1 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white pl-2 pr-2.5">
            <WorkspaceMenu value={workspace} onChange={setWorkspace} />
            <span className="text-[14px] text-[#D9D9D9]">/</span>
            <input
              value={pageSlug}
              onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
              spellCheck={false}
              className="h-7 min-w-0 flex-1 rounded-md bg-transparent px-1.5 text-[13.5px] font-medium tracking-[-0.01em] text-[#000000] outline-none focus:bg-[#F8F8F8]"
            />
          </div>

          <div className="mb-5 border-t border-[rgba(0,0,0,0.05)]" />

          {/* Share this App to — compact pill segmented toggle */}
          <label className="mb-1.5 block text-[12px] font-medium text-[#636363]">Share this App to</label>
          <div className="flex w-full gap-0.5 rounded-full border border-[rgba(0,0,0,0.08)] bg-[#F0F0F0] p-0.5">
            {MODES.map(({ v, label, icon: Ic }) => {
              const active = mode === v;
              return (
                <button key={v} type="button" onClick={() => setMode(v)}
                  className="relative flex h-7 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium transition-colors"
                  style={{
                    background: active ? '#FFFFFF' : 'transparent',
                    color: active ? '#000000' : '#636363',
                    boxShadow: active ? '0 1px 2px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)' : 'none',
                  }}>
                  <Ic className="h-3.5 w-3.5" style={{ color: active ? '#000000' : '#959595' }} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* blast radius — publishing org-wide is the one moment chrome earns
              color: a calm, unmissable --red micro-accent strip */}
          <AnimatePresence initial={false}>
            {everyone && !publishedAt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="overflow-hidden"
              >
                <div
                  className="mt-3 flex items-start gap-2.5 rounded-xl px-3.5 py-3"
                  style={{
                    background: 'rgba(229,72,77,0.05)',
                    boxShadow: 'inset 0 0 0 1px rgba(229,72,77,0.25)',
                  }}
                >
                  <Globe className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#E5484D' }} />
                  <p className="text-[12.5px] leading-[1.5] text-[#636363]">
                    <span className="font-medium text-[#000000]">
                      This publishes to your entire organization.
                    </span>{' '}
                    All <span className="font-medium" style={{ color: '#E5484D' }}>142 people</span> at
                    Acme Co will be able to open and respond to this app the
                    moment you publish.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* search + people checklist — only for selected users */}
          <AnimatePresence initial={false}>
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden">
                <div className="pt-4">
                  <div ref={searchRef} className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#959595]" />
                    <input
                      value={query}
                      onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
                      onFocus={() => setSearchOpen(true)}
                      placeholder="Search people to add"
                      className="h-10 w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-white pl-9 pr-3 text-[14px] text-[#000000] outline-none transition-colors placeholder:text-[#959595] focus:border-[rgba(0,0,0,0.18)]"
                    />
                  </div>

                  {/* search results — floating overlay below the input */}
                  {searchOpen && searchPos && createPortal(
                    <>
                      <div className="fixed inset-0 z-[1490]" onClick={() => setSearchOpen(false)} />
                      <div className="fixed z-[1500] max-h-[260px] overflow-y-auto rounded-lg border border-[rgba(0,0,0,0.08)] bg-white p-1.5"
                        style={{ top: searchPos.top, left: searchPos.left, width: searchPos.width, boxShadow: '0 16px 40px -16px rgba(0,0,0,0.28)' }}>
                        {filtered.map((p) => {
                          const checked = selected.has(p.id);
                          return (
                            <button key={p.id} type="button" onClick={() => toggle(p.id)}
                              className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[#F0F0F0]">
                              <span className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-[10px] border-2 transition-colors"
                                style={{ borderColor: checked ? '#000000' : '#D9D9D9', background: checked ? '#000000' : '#FFFFFF' }}>
                                {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                              </span>
                              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-medium text-[#636363]" style={{ background: p.color }}>
                                {initials(p.name)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13.5px] font-medium tracking-[-0.01em] text-[#000000]">{p.name}</span>
                                <span className="block truncate text-[12px] text-[#959595]">{p.email}</span>
                              </span>
                            </button>
                          );
                        })}
                        {filtered.length === 0 && (
                          <p className="px-2.5 py-6 text-center text-[12.5px] text-[#959595]">No people match “{query}”</p>
                        )}
                      </div>
                    </>,
                    document.body,
                  )}

                  {/* persistent list of who's selected + their permission */}
                  {added.length > 0 && (
                    <>
                      <p className="mb-1 mt-4 text-[11px] font-medium uppercase tracking-wider text-[#959595]">
                        Selected users · {added.length}
                      </p>
                      <div className="rounded-lg border border-[rgba(0,0,0,0.08)]">
                        {added.map((p, i) => (
                          <div key={p.id} className={`flex items-center gap-3 px-2.5 py-2 ${i > 0 ? 'border-t border-[rgba(0,0,0,0.05)]' : ''}`}>
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11.5px] font-medium text-[#636363]" style={{ background: p.color }}>
                              {initials(p.name)}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[13.5px] font-medium tracking-[-0.01em] text-[#000000]">{p.name}</span>
                              <span className="block truncate text-[12px] text-[#959595]">{p.email}</span>
                            </span>
                            <RoleMenu value={roles[p.id] ?? 'Viewer'} onChange={(v) => setRole(p.id, v)} />
                            <button onClick={() => toggle(p.id)} title="Remove"
                              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-[#D9D9D9] transition-colors hover:bg-[#F0F0F0] hover:text-[#000000]">
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
        <div className="flex items-center justify-end gap-2 border-t border-[rgba(0,0,0,0.05)] px-6 py-4">
          <button onClick={onClose}
            className="h-9 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white px-4 text-[13px] font-medium text-[#636363] transition-colors hover:bg-[#F0F0F0]">
            Cancel
          </button>
          <button onClick={submit}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#000000] px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#2C2F33]">
            {publishedAt ? <CheckCircle2 className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
            {ctaLabel}
          </button>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
