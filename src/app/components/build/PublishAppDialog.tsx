import { useMemo, useRef, useState, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X, Search, Check, ChevronDown, Globe, Briefcase, UserPlus } from 'lucide-react';

export type Role = 'Owner' | 'Admin' | 'Editor' | 'Viewer';
// roles a user can be assigned via the dropdown
const ROLE_OPTS: Role[] = ['Editor', 'Viewer'];

const WORKSPACES = ['Work', 'CRM', 'Finance', 'Field Service'];

export interface Member {
  id: string;
  name: string;
  handle: string;
  role: Role;
  color: string;       // avatar fallback tint
  you?: boolean;
}

const INITIAL_MEMBERS: Member[] = [
  { id: 'u-olivia',  name: 'Olivia Rhye',   handle: '@olivia',  role: 'Owner',  color: '#F4C7B5', you: true },
  { id: 'u-candice', name: 'Candice Wu',    handle: '@candice', role: 'Admin',  color: '#C7D2FE' },
  { id: 'u-orlando', name: 'Orlando Diggs', handle: '@orlando', role: 'Editor', color: '#FDE68A' },
  { id: 'u-andi',    name: 'Andi Lane',     handle: '@andi',    role: 'Editor', color: '#BBF7D0' },
];

// People who can be invited (not yet on the project).
const DIRECTORY: Member[] = [
  { id: 'u-meera',  name: 'Meera Joshi', handle: '@meera',  role: 'Editor', color: '#FBCFE8' },
  { id: 'u-rahul',  name: 'Rahul G.',    handle: '@rahul',  role: 'Editor', color: '#A7F3D0' },
  { id: 'u-carlos', name: 'Carlos Mendez', handle: '@carlos', role: 'Viewer', color: '#BAE6FD' },
  { id: 'u-dana',   name: 'Dana Wright', handle: '@dana',   role: 'Viewer', color: '#DDD6FE' },
];

interface Props {
  appName: string;
  onClose: () => void;
  onPublish: (opts: { name: string; workspace: string; slug: string; members: Member[] }) => void;
}

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[·—–]/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function Avatar({ m, size = 36 }: { m: Member; size?: number }) {
  return (
    <span
      className="flex flex-shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-[#1C1E21]"
      style={{ width: size, height: size, background: m.color }}
    >
      {initials(m.name)}
    </span>
  );
}

// Dropdown whose menu portals to <body>, so it never affects the modal's
// scroll height or causes layout shift.
function Dropdown({
  value, options, onChange, disabled, menuWidth = 168, full = false,
}: { value: React.ReactNode; options: string[]; onChange: (v: string) => void; disabled?: boolean; menuWidth?: number; full?: boolean }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setPos({ top: r.bottom + 6, left: full ? r.left : r.right - menuWidth, width: full ? r.width : menuWidth });
  }, [open, full, menuWidth]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#E6E8EC] bg-white px-3 text-[13px] font-medium text-[#1C1E21] transition-colors hover:border-[#C9CDD4] disabled:opacity-60 disabled:cursor-default ${full ? 'w-full justify-between' : ''}`}
      >
        <span className="inline-flex items-center gap-1.5">{value}</span>
        {!disabled && <ChevronDown className="h-3.5 w-3.5 text-[#9CA3AF]" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />}
      </button>
      {open && !disabled && pos && createPortal(
        <>
          <div className="fixed inset-0 z-[490]" onClick={() => setOpen(false)} />
          <div
            className="fixed z-[500] overflow-hidden rounded-lg border border-[#E6E8EC] bg-white py-1"
            style={{ top: pos.top, left: pos.left, width: pos.width, boxShadow: '0 12px 32px -12px rgba(28,30,33,0.28)' }}
          >
            {options.map((r) => (
              <button key={r} onClick={() => { onChange(r); setOpen(false); }}
                className="flex w-full items-center justify-between gap-3 px-3 h-8 text-[13px] text-[#374151] transition-colors hover:bg-[#F4F4F2] hover:text-[#1C1E21]">
                {r}
                {r === value && <Check className="h-3.5 w-3.5 text-[#FD5000]" />}
              </button>
            ))}
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

export function PublishAppDialog({ appName, onClose, onPublish }: Props) {
  const [name, setName] = useState(appName);
  const [workspace, setWorkspace] = useState(WORKSPACES[0]);
  const [slug, setSlug] = useState<string | null>(null);
  const [workMenuOpen, setWorkMenuOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [query, setQuery] = useState('');
  const pageSlug = slug ?? slugify(name);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return DIRECTORY.filter(
      (d) => !members.some((m) => m.id === d.id) &&
        (d.name.toLowerCase().includes(q) || d.handle.toLowerCase().includes(q)),
    );
  }, [query, members]);

  const invite = (m: Member) => { setMembers((ms) => [...ms, m]); setQuery(''); };
  const setRole = (id: string, role: Role) => setMembers((ms) => ms.map((m) => (m.id === id ? { ...m, role } : m)));

  return createPortal(
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[450] bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.17, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-1/2 z-[460] w-[500px] max-w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[24px] bg-white"
        style={{ boxShadow: '0 0 0 1px rgba(180,151,207,0.16), 0 1px 2px rgba(28,30,33,0.04), 0 28px 80px -40px rgba(28,30,33,0.55)' }}
      >
        {/* header — icon badge, our dialog pattern */}
        <div className="flex items-center justify-between border-b border-[#F0F0F2] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFF4ED]">
              <Globe className="h-4 w-4 text-[#FD5000]" />
            </span>
            <div>
              <h3 className="text-[15px] font-semibold leading-tight tracking-[-0.01em] text-[#1C1E21]">Publish app</h3>
              <p className="text-[12px] text-[#9CA3AF]">Share it into a workspace menu</p>
            </div>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#1C1E21]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4" style={{ scrollbarGutter: 'stable' }}>
          {/* Name */}
          <label className="mb-1.5 block text-[12px] font-semibold text-[#374151]">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4 h-10 w-full rounded-xl border border-[#E6E8EC] bg-white px-3.5 text-[14px] text-[#1C1E21] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#FD5000]/50"
          />

          {/* Workspace — breadcrumb: Work dropdown / editable page URL */}
          <label className="mb-1.5 block text-[12px] font-semibold text-[#374151]">Workspace</label>
          <div className="mb-4 flex w-full items-center gap-1 h-10 pl-1.5 pr-2 rounded-lg bg-white border border-[#ECEEF1]" style={{ boxShadow: '0 1px 2px rgba(28,30,33,0.05)' }}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setWorkMenuOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 h-7 pl-1.5 pr-1 rounded-md text-[13px] font-medium text-[#1C1E21] transition-colors"
                style={{ background: workMenuOpen ? '#EFEFEC' : 'transparent' }}
                onMouseEnter={(e) => { if (!workMenuOpen) e.currentTarget.style.background = '#F4F4F2'; }}
                onMouseLeave={(e) => { if (!workMenuOpen) e.currentTarget.style.background = 'transparent'; }}
              >
                <Briefcase className="w-4 h-4 text-[#6B7280]" />
                {workspace}
                <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" style={{ transform: workMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease' }} />
              </button>
              {workMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[490]" onClick={() => setWorkMenuOpen(false)} />
                  <div className="absolute left-0 z-[500] mt-1.5 w-max min-w-[8rem] overflow-hidden rounded-lg border border-[#E6E8EC] bg-white py-1" style={{ boxShadow: '0 12px 32px -12px rgba(28,30,33,0.28)' }}>
                    {WORKSPACES.map((w) => (
                      <button key={w} onClick={() => { setWorkspace(w); setWorkMenuOpen(false); }}
                        className="flex w-full items-center gap-2 px-3 h-8 text-[13px] text-[#374151] hover:bg-[#F4F4F2] hover:text-[#1C1E21] transition-colors whitespace-nowrap">
                        <Briefcase className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                        {w}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="text-[#C4CAD4] text-[14px]">/</span>
            <input
              value={pageSlug}
              onChange={(e) => setSlug(e.target.value.replace(/\s+/g, '-').toLowerCase())}
              spellCheck={false}
              className="h-7 min-w-0 flex-1 bg-transparent text-[13px] font-medium text-[#1C1E21] tracking-[-0.01em] outline-none rounded-md px-1.5"
            />
          </div>

          {/* divider after Workspace */}
          <div className="mb-4 -mx-5 border-t border-[#F0F0F2]" />

          {/* Share with */}
          <label className="mb-1.5 block text-[12px] font-semibold text-[#374151]">Share with</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people to invite…"
              className="h-10 w-full rounded-xl border border-[#E6E8EC] bg-white pl-9 pr-3 text-[14px] text-[#1C1E21] outline-none transition-colors placeholder:text-[#9CA3AF] focus:border-[#FD5000]/50"
            />
          </div>

          {/* search results */}
          {matches.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-lg border border-[#E6E8EC]">
              {matches.map((m, i) => (
                <button key={m.id} onClick={() => invite(m)}
                  className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-[#F4F4F2] ${i > 0 ? 'border-t border-[#F0F0F2]' : ''}`}>
                  <Avatar m={m} size={32} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium text-[#1C1E21]">{m.name}</span>
                    <span className="block text-[12px] text-[#9CA3AF]">{m.handle}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#FD5000]">
                    <UserPlus className="h-3.5 w-3.5" /> Invite
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* member list */}
          <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">In this project</p>
          <div className="-mx-1">
            {members.map((m) => (
              <div key={m.id} className="flex items-center gap-3 rounded-lg px-1 py-2">
                <Avatar m={m} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-[14px] font-medium tracking-[-0.01em] text-[#1C1E21]">{m.name}</span>
                    {m.you && <span className="rounded-md bg-[#FFF4ED] px-1.5 py-0.5 text-[11px] font-medium text-[#C0410C]">You</span>}
                  </div>
                  <span className="block text-[12.5px] text-[#9CA3AF]">{m.handle}</span>
                </div>
                <Dropdown value={m.role} options={ROLE_OPTS} disabled={m.role === 'Owner'} onChange={(r) => setRole(m.id, r as Role)} />
              </div>
            ))}
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#F0F0F2] px-5 py-3.5">
          <button onClick={onClose}
            className="h-9 rounded-full border border-[#E6E8EC] bg-white px-4 text-[13px] font-medium text-[#374151] transition-colors hover:bg-[#F4F4F2]">
            Cancel
          </button>
          <button onClick={() => onPublish({ name, workspace, slug: pageSlug, members })}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#1C1E21] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#FD5000]">
            <Globe className="h-3.5 w-3.5" /> Publish to {workspace}
          </button>
        </div>
      </motion.div>
    </>,
    document.body,
  );
}
