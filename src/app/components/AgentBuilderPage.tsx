import { useState, useRef } from 'react';
import {
  LayoutGrid, Bot, BookOpen, MessageSquare, Zap, Database, BarChart3, LifeBuoy, Plus,
  Search, MoreHorizontal, Play, Pencil, List, LayoutGrid as GridIcon, Star, Users,
  Clock, Mail, Webhook, Info, ArrowRight, Wrench, Globe, Layers, CheckCircle2, RefreshCw, Trash2, ChevronDown, X, Upload,
  AtSign, History, Maximize2, MoreVertical, Send, Share2, BarChart2, ChevronLeft, Mic, ArrowUp, Sparkles,
} from 'lucide-react';
import avatarBg from '../../imports/agents/avatar-bg.png';
import agent1 from '../../imports/agents/agent-1.png';
import agent2 from '../../imports/agents/agent-2.png';
import agent3 from '../../imports/agents/agent-3.png';

type Section = 'overview' | 'agents' | 'catalog' | 'chat' | 'skills' | 'knowledge' | 'usage';

const navItems: { key: Section; label: string; icon: any; soon?: boolean }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutGrid },
  { key: 'agents', label: 'My Agents', icon: Bot },
  { key: 'catalog', label: 'Catalog', icon: BookOpen },
  { key: 'chat', label: 'Chat', icon: MessageSquare },
  { key: 'skills', label: 'Skills', icon: Zap },
  { key: 'knowledge', label: 'Knowledge Base', icon: Database },
  { key: 'usage', label: 'Usage', icon: BarChart3, soon: true },
];

const recentAgents = [
  { name: 'Inside Sales Rep Agent', desc: '# Inside Sales Rep Agent The Inside Sales Rep Age...', status: 'Active', updated: '17 days ago', img: agent1 },
  { name: 'Customer Success Agent', desc: '# Customer Success Agent The Customer Success Age...', status: 'Active', updated: '17 days ago', img: agent2 },
  { name: 'Lead Qualification Agent', desc: '# Lead Qualification Agent The Lead Qualification...', status: 'Active', updated: '17 days ago', img: agent3 },
  { name: 'Sales Coach Agent', desc: '# Sales Coach Agent The Sales Coach Agent support...', status: 'Active', updated: '17 days ago', img: agent1 },
];

const recentActivity = [
  { agent: 'QBO Support Agent', kind: 'SCHEDULE', when: '3 minutes ago', task: 'Scheduled run', tokens: '21,769', duration: '22.7s', status: 'Completed' },
  { agent: 'QBO Support Agent', kind: 'SCHEDULE', when: 'about 22 hours ago', task: 'Scheduled run', tokens: '25,811', duration: '3579.2s', status: 'Failed' },
  { agent: 'QBO Support Agent', kind: 'SCHEDULE', when: '2 days ago', task: 'Scheduled run', tokens: '—', duration: '6574.4s', status: 'Failed' },
];

export function AgentBuilderPage({ onClose, currentUser }: { onClose?: () => void; currentUser?: string }) {
  const isVP = currentUser === 'VP';
  const [section, setSection] = useState<Section>(isVP ? 'agents' : 'overview');
  const visibleNavItems = isVP
    ? navItems.filter((i) => i.key !== 'catalog').map((i) => (i.key === 'agents' ? { ...i, label: 'Agents' } : i))
    : navItems;

  return (
    <div className="flex h-full w-full bg-white">
      {/* Left sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E6E8EC] flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-[#F0F1F3]">
          <div className="w-7 h-7 rounded-md bg-[#FFF4ED] border border-[#FFE2D1] flex items-center justify-center">
            <Bot className="w-[15px] h-[15px] text-[#FD5000]" strokeWidth={2} />
          </div>
          <h1 className="text-[16px] font-semibold text-[#1C1E21] tracking-tight">Agent Builder</h1>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => !item.soon && setSection(item.key)}
                disabled={item.soon}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#2563EB]'
                    : item.soon
                    ? 'text-[#C0C4CC] cursor-not-allowed'
                    : 'text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21]'
                }`}
              >
                <Icon className={`w-[15px] h-[15px] ${isActive ? 'text-[#2563EB]' : item.soon ? 'text-[#C0C4CC]' : 'text-[#6B7280]'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.soon && (
                  <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FFF4ED] text-[#FD5000]">SOON</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#F0F1F3]">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#4B5563] hover:bg-[#F8F9FB] transition">
            <LifeBuoy className="w-[15px] h-[15px] text-[#6B7280]" />
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 pt-8 pb-12">
          {section === 'agents' ? (
            isVP ? <VPAgentsView /> : <MyAgentsView />
          ) : section === 'catalog' ? (
            <CatalogView />
          ) : section === 'skills' ? (
            <SkillsView />
          ) : section === 'knowledge' ? (
            <KnowledgeBaseView />
          ) : section === 'chat' ? (
            <ChatView />
          ) : (
          <>
          {/* Header */}
          <div className="mb-7">
            <div className="flex items-center gap-2.5 mb-1">
              <LayoutGrid className="w-[18px] h-[18px] text-[#6B7280]" />
              <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight">Overview</h1>
            </div>
            <p className="text-[14px] text-[#6B7280]">Real-time performance and resource allocation across your agent fleet.</p>
          </div>

          {/* Workspace: stats + agents + kanban on left, live feed on right */}
          <OverviewWorkspace />
          </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sub, muted }: { icon: React.ReactNode; label: string; value: string; sub: string; muted?: boolean }) {
  return (
    <div className="bg-white border border-[#E6E8EC] rounded-xl p-5">
      <div className="flex items-center gap-1.5 mb-3">
        {icon}
        <span className="text-[12.5px] font-medium text-[#6B7280]">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-[28px] font-semibold leading-none tracking-tight ${muted ? 'text-[#C0C4CC]' : 'text-[#1C1E21]'}`}>{value}</span>
        <span className={`text-[12.5px] ${muted ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{sub}</span>
      </div>
    </div>
  );
}

type AgentTone = {
  bg: string;
  iconColor: string;
};

const tones: AgentTone[] = [
  { bg: '#EFF6FF', iconColor: '#3B82F6' },
  { bg: '#F5F3FF', iconColor: '#8B5CF6' },
  { bg: '#FDF2F8', iconColor: '#EC4899' },
  { bg: '#F0FDF4', iconColor: '#10B981' },
  { bg: '#FFF7ED', iconColor: '#F97316' },
  { bg: '#FFFBEB', iconColor: '#F59E0B' },
];

type AgentStatus = 'Active' | 'Draft' | 'Paused' | 'Error';
type AgentCategory = 'Sales' | 'Support' | 'Operations' | 'Finance' | 'Compliance';

const statusStyles: Record<AgentStatus, { bg: string; border: string; color: string; dot: string }> = {
  Active: { bg: '#ECFDF5', border: 'transparent', color: '#15803D', dot: '#10B981' },
  Draft: { bg: '#F3F4F6', border: 'transparent', color: '#4B5563', dot: '#9CA3AF' },
  Paused: { bg: '#FEF3C7', border: 'transparent', color: '#92400E', dot: '#F59E0B' },
  Error: { bg: '#FEE2E2', border: 'transparent', color: '#B91C1C', dot: '#EF4444' },
};

const myAgents: Array<{ name: string; desc: string; runs: number; lastRun: string; users: number; rating: number; reviews: number; price: string; skills: number; tools: number; status: AgentStatus; category: AgentCategory; img?: string }> = [
  { name: 'Sales Coach Agent', desc: 'Reviews call transcripts and interaction logs, surfacing coaching moments.', runs: 412, lastRun: '1d ago', users: 7, rating: 4.4, reviews: 4, price: 'Free', skills: 3, tools: 2, status: 'Active', category: 'Sales' },
  { name: 'Financial Agent', desc: 'Tracks job costs, generates invoices, and surfaces margin anomalies.', runs: 0, lastRun: '', users: 3, rating: 5.0, reviews: 1, price: '$25/mo', skills: 0, tools: 1, status: 'Draft', category: 'Finance' },
  { name: 'QBO Support Agent', desc: 'Answers user questions by searching and scraping Zuper documentation.', runs: 1872, lastRun: '8m ago', users: 32, rating: 4.7, reviews: 17, price: 'Free', skills: 4, tools: 3, status: 'Active', category: 'Support' },
  { name: 'Dispatch Optimizer Agent', desc: 'Optimizes daily routes and crew assignments to reduce drive time and overlaps.', runs: 564, lastRun: '40m ago', users: 14, rating: 4.7, reviews: 8, price: '$15/mo', skills: 5, tools: 4, status: 'Active', category: 'Operations' },
  { name: 'Estimate Generator Agent', desc: 'Drafts roofing estimates from intake notes and pulls in pricing automatically.', runs: 1024, lastRun: '3h ago', users: 22, rating: 4.5, reviews: 11, price: 'Free', skills: 3, tools: 2, status: 'Paused', category: 'Sales' },
  { name: 'Quote Follow-up Agent', desc: 'Sends polite, on-brand follow-ups to stalled quotes and tracks response rate.', runs: 740, lastRun: '6h ago', users: 19, rating: 4.6, reviews: 10, price: '$9/mo', skills: 2, tools: 3, status: 'Active', category: 'Sales' },
  { name: 'Safety Compliance Agent', desc: 'Reviews job-site checklists and flags missed safety steps before crew sign-off.', runs: 318, lastRun: '4h ago', users: 11, rating: 4.5, reviews: 6, price: 'Free', skills: 2, tools: 1, status: 'Error', category: 'Compliance' },
  { name: 'Material Order Agent', desc: 'Watches stock levels, drafts purchase orders, and pings vendors when supplies run low.', runs: 892, lastRun: '1h ago', users: 16, rating: 4.7, reviews: 9, price: '$14/mo', skills: 4, tools: 3, status: 'Active', category: 'Operations' },
  { name: 'Inside Sales Rep Agent', desc: 'Handles inbound inquiries from homeowners and businesses interested in roofing services.', runs: 1248, lastRun: '2h ago', users: 24, rating: 4.8, reviews: 12, price: 'Free', skills: 6, tools: 4, status: 'Active', category: 'Sales', img: agent1 },
  { name: 'Customer Success Agent', desc: 'Supports existing customers throughout their roofing project lifecycle and follow-ups.', runs: 832, lastRun: '5h ago', users: 18, rating: 4.6, reviews: 9, price: '$12/mo', skills: 5, tools: 3, status: 'Paused', category: 'Support', img: agent2 },
  { name: 'Lead Qualification Agent', desc: 'Evaluates inbound leads to determine readiness, budget fit, and timeline.', runs: 2104, lastRun: '12m ago', users: 41, rating: 4.9, reviews: 23, price: '$19/mo', skills: 7, tools: 5, status: 'Active', category: 'Sales', img: agent3 },
];

function MyAgentsView() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'All' | AgentStatus>('All');
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | AgentCategory>('All');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  if (creating) {
    return (
      <>
        <NewAgentForm onCancel={() => setCreating(false)} onDeploy={() => { setCreating(false); showToast('Agent deployed successfully'); }} />
        <Toast message={toast} />
      </>
    );
  }

  const filteredAgents = myAgents.filter((a) => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (pricingFilter === 'Free' && a.price !== 'Free') return false;
    if (pricingFilter === 'Paid' && a.price === 'Free') return false;
    if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
    return true;
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Bot className="w-[18px] h-[18px] text-[#6B7280]" />
            <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight">My Agents</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{myAgents.length}</span>
          </div>
          <p className="text-[14px] text-[#6B7280]">Manage and monitor your deployed AI agents.</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold shadow-[0_2px_6px_rgba(28,30,33,0.18)] transition-all"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Create Agent
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
          />
        </div>
        <div className="inline-flex items-center bg-white border border-[#E6E8EC] rounded-lg p-0.5">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition ${view === 'grid' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}
            aria-label="Grid view"
          >
            <GridIcon className="w-[15px] h-[15px]" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition ${view === 'list' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}
            aria-label="List view"
          >
            <List className="w-[15px] h-[15px]" />
          </button>
        </div>
      </div>

      {/* Cards */}
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <FilterGroup label="Status" value={statusFilter} options={['All', 'Active', 'Draft', 'Paused', 'Error']} onChange={(v) => setStatusFilter(v as any)} />
        <FilterGroup label="Pricing" value={pricingFilter} options={['All', 'Free', 'Paid']} onChange={(v) => setPricingFilter(v as any)} />
        <FilterGroup label="Category" value={categoryFilter} options={['All', 'Sales', 'Support', 'Operations', 'Finance', 'Compliance']} onChange={(v) => setCategoryFilter(v as any)} />
        {(statusFilter !== 'All' || pricingFilter !== 'All' || categoryFilter !== 'All') && (
          <button
            onClick={() => { setStatusFilter('All'); setPricingFilter('All'); setCategoryFilter('All'); }}
            className="text-[12px] font-medium text-[#6B7280] hover:text-[#1C1E21] underline ml-2 transition"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-[12px] text-[#9CA3AF]">{filteredAgents.length} of {myAgents.length} agents</span>
      </div>

      <div className={view === 'grid' ? 'grid grid-cols-3 gap-5' : 'space-y-3'}>
        {filteredAgents.map((a, i) => (
          <AgentCard key={a.name} agent={a} tone={tones[i % tones.length]} layout={view} />
        ))}
        <CreateAgentCard layout={view} />
      </div>
      <Toast message={toast} />
    </>
  );
}

function AgentCard({ agent, tone, layout }: { agent: typeof myAgents[number]; tone: AgentTone; layout: 'grid' | 'list' }) {
  if (layout === 'list') {
    return (
      <div className="flex items-center gap-5 pl-4 pr-5 py-4 rounded-2xl bg-white border border-[#E6E8EC] hover:border-[#FF6B35]/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all cursor-pointer">
        {agent.img ? (
          <div
            className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden relative"
            style={{ background: '#F3F4F6' }}
          >
            <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover object-top" />
          </div>
        ) : (
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: tone.bg }}
          >
            <Bot className="w-[26px] h-[26px]" style={{ color: tone.iconColor }} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-[14.5px] font-semibold text-[#1C1E21] truncate">{agent.name}</span>
            <span className="inline-flex items-center text-[11px] font-semibold flex-shrink-0" style={{ color: statusStyles[agent.status].color }}>
              {agent.status}
            </span>
          </div>
          <div className="text-[12.5px] text-[#6B7280] truncate leading-snug">{agent.desc}</div>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-[12.5px] flex-shrink-0 whitespace-nowrap">
          <span className="font-semibold text-[#1C1E21]">{agent.skills} {agent.skills === 1 ? 'skill' : 'skills'} · {agent.tools} {agent.tools === 1 ? 'tool' : 'tools'}</span>
          <span className="text-[#D1D5DB]">·</span>
          <span className="text-[#9CA3AF]">{agent.lastRun ? `Last run ${agent.lastRun}` : 'Ready to run'}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <button className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1C1E21] text-[13px] font-semibold transition-all">
            <Play className="w-[12px] h-[12px]" fill="currentColor" />
            Run
          </button>
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#4B5563] transition" aria-label="More">
            <MoreHorizontal className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>
    );
  }

  const neverRun = agent.runs === 0;

  return (
    <div className="group relative rounded-2xl bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all cursor-pointer overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        {/* Header: avatar + status tag */}
        <div className="flex items-start justify-between gap-3 mb-5">
          {agent.img ? (
            <div
              className="w-20 h-20 rounded-2xl flex-shrink-0 overflow-hidden relative"
              style={{ background: '#F3F4F6' }}
            >
              <img src={agent.img} alt={agent.name} className="absolute inset-0 w-full h-full object-cover object-top" />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: tone.bg }}
            >
              <Bot className="w-9 h-9" style={{ color: tone.iconColor }} strokeWidth={1.75} />
            </div>
          )}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold uppercase tracking-wide"
            style={{ background: statusStyles[agent.status].bg, color: statusStyles[agent.status].color }}
          >
            {agent.status}
          </span>
        </div>

        {/* Name */}
        <h3 className="text-[15.5px] font-semibold text-[#1C1E21] leading-snug mb-2">{agent.name}</h3>

        {/* Meta row: type · rating · users · price */}
        <div className="flex items-center gap-2 text-[12px] text-[#6B7280] mb-3 flex-wrap leading-none">
          <span className="font-medium text-[#4B5563]">Agent</span>
          <Sep />
          <span className="inline-flex items-center gap-1">
            <Star className="w-[12px] h-[12px] text-[#F59E0B] fill-[#F59E0B]" />
            <span className="font-semibold text-[#1C1E21]">{agent.rating.toFixed(1)}</span>
            <span className="text-[#9CA3AF]">({agent.reviews})</span>
          </span>
          <Sep />
          <span className="inline-flex items-center gap-1">
            <Users className="w-[12px] h-[12px] text-[#9CA3AF]" />
            <span className="font-medium text-[#4B5563]">{agent.users}</span>
          </span>
          <Sep />
          <span className={agent.price === 'Free' ? 'text-[#059669] font-semibold' : 'text-[#1C1E21] font-semibold'}>
            {agent.price}
          </span>
        </div>

        <p className="text-[13px] text-[#6B7280] leading-[1.55] line-clamp-2">{agent.desc}</p>
      </div>

      {/* Footer: meta + actions */}
      <div className="px-5 py-3.5 border-t border-[#F0F1F3] flex items-center justify-between gap-3">
        <span className="text-[12px] text-[#9CA3AF] leading-none">
          {neverRun ? 'Ready to run' : `Last run ${agent.lastRun}`}
        </span>
        <div className="flex items-center gap-1">
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] transition" aria-label="Chat" title="Chat">
            <MessageSquare className="w-[15px] h-[15px]" />
          </button>
          <button className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] transition" aria-label="Edit" title="Edit">
            <Pencil className="w-[15px] h-[15px]" />
          </button>
          <button className="ml-1 inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1C1E21] text-[13px] font-semibold transition-all" title="Run">
            <Play className="w-[12px] h-[12px]" fill="currentColor" />
            Run
          </button>
        </div>
      </div>
    </div>
  );
}

function Sep() {
  return <span className="w-[3px] h-[3px] rounded-full bg-[#D1D5DB] flex-shrink-0" />;
}

type OvAgent = { name: string; role: string; status: 'Working' | 'Standby' | 'Blocked'; tag: 'LEAD' | 'SPC' | 'INT'; toneIdx: number; img?: string };

const ovAgents: OvAgent[] = [
  { name: 'Bhanu', role: 'Founder', status: 'Working', tag: 'LEAD', toneIdx: 0 },
  { name: 'Fury', role: 'Customer Researcher', status: 'Working', tag: 'SPC', toneIdx: 2 },
  { name: 'Jarvis', role: 'Squad Lead', status: 'Working', tag: 'LEAD', toneIdx: 1 },
  { name: 'Vision', role: 'SEO Analyst', status: 'Working', tag: 'SPC', toneIdx: 3 },
  { name: 'Dheeraj', role: 'Co-Founder', status: 'Standby', tag: 'LEAD', toneIdx: 4 },
  { name: 'Loki', role: 'Content Writer', status: 'Standby', tag: 'SPC', toneIdx: 5 },
  { name: 'Quill', role: 'Social Media', status: 'Standby', tag: 'INT', toneIdx: 0 },
  { name: 'Shuri', role: 'Product Analyst', status: 'Blocked', tag: 'SPC', toneIdx: 1 },
  { name: 'Wanda', role: 'Designer', status: 'Standby', tag: 'SPC', toneIdx: 2 },
  { name: 'Wong', role: 'Notion Agent', status: 'Standby', tag: 'SPC', toneIdx: 3 },
];

const ovColumns = [
  { key: 'inbox', label: 'Inbox', count: 0, dot: '#9CA3AF' },
  { key: 'assigned', label: 'Assigned', count: 1, dot: '#10B981' },
  { key: 'progress', label: 'In Progress', count: 3, dot: '#F59E0B' },
  { key: 'review', label: 'Review', count: 0, dot: '#3B82F6' },
  { key: 'done', label: 'Done', count: 4, dot: '#8B5CF6' },
] as const;

const ovTasks: Record<string, { title: string; desc: string; agent: string; agentTone: number; ago: string; tags: string[]; accent?: string }[]> = {
  inbox: [],
  assigned: [
    { title: 'Customer Research – Tweet Material', desc: 'Pull real customer data and stories from Slack for tweet…', agent: 'Fury', agentTone: 2, ago: 'about 5 hours ago', tags: ['research', 'data', 'social'], accent: '#F59E0B' },
  ],
  progress: [
    { title: 'SiteGPT vs Zendesk AI Comparison', desc: 'Create detailed brief for Zendesk AI comparison page', agent: 'Vision', agentTone: 3, ago: 'about 3 hours ago', tags: ['competitor', 'seo', 'comparison'] },
    { title: 'SiteGPT vs Intercom Fin Comparison', desc: 'Create detailed brief for Intercom Fin comparison page', agent: 'Vision', agentTone: 3, ago: 'about 6 hours ago', tags: ['competitor', 'seo', 'comparison'] },
    { title: 'Mission Control UI', desc: 'Build real-time agent command center with React + Convex', agent: 'Jarvis', agentTone: 1, ago: 'about 3 hours ago', tags: ['internal', 'tooling', 'ui'], accent: '#EF4444' },
  ],
  review: [],
  done: [
    { title: 'Shopify Blog Landing Page', desc: 'Write copy for Shopify integration landing page – how SiteGPT help…', agent: 'Loki', agentTone: 5, ago: 'about 1 hour ago', tags: ['copy', 'landing-page', 'shopify'] },
    { title: 'SiteGPT vs Chatbase Comparison', desc: 'Complete comparison page with pricing research and feature…', agent: 'Vision', agentTone: 3, ago: 'about 1 hour ago', tags: ['competitor', 'seo', 'comparison'] },
    { title: 'Product Demo Video Script', desc: 'Create full script for SiteGPT product demo video with…', agent: 'Loki', agentTone: 5, ago: 'about 1 hour ago', tags: ['video', 'content', 'demo'], accent: '#F59E0B' },
    { title: 'Dashboard Redesign – Notion', desc: 'Redesign the SiteGPT Notion dashboard with color-coded…', agent: 'Wong', agentTone: 3, ago: 'about 4 hours ago', tags: ['notion', 'design', 'internal'] },
  ],
};

const ovFeed = [
  { who: 'Dheeraj', verb: 'joined the squad', target: '', ago: 'less than a minute ago', kind: 'Status' },
  { who: 'Vision', verb: 'commented on', target: 'SiteGPT vs Zendesk AI Comparison', ago: '5 minutes ago', kind: 'Comments' },
  { who: 'Loki', verb: 'commented on', target: 'SiteGPT vs Chatbase Comparison', ago: '11 minutes ago', kind: 'Comments' },
  { who: 'Loki', verb: 'commented on', target: 'SiteGPT vs Zendesk AI Comparison', ago: '11 minutes ago', kind: 'Comments' },
  { who: 'Shuri', verb: 'commented on', target: 'SiteGPT vs Zendesk AI Comparison', ago: '16 minutes ago', kind: 'Comments' },
  { who: 'Loki', verb: 'commented on', target: 'SiteGPT vs Zendesk AI Comparison', ago: '23 minutes ago', kind: 'Comments' },
  { who: 'Quill', verb: 'commented on', target: 'Customer Research – Tweet Material', ago: '26 minutes ago', kind: 'Comments' },
  { who: 'Fury', verb: 'commented on', target: 'Customer Research – Tweet Material', ago: '28 minutes ago', kind: 'Comments' },
  { who: 'Sam', verb: 'commented on', target: 'SiteGPT vs Zendesk AI Comparison', ago: '30 minutes ago', kind: 'Comments' },
];

function OverviewWorkspace() {
  const [feedFilter, setFeedFilter] = useState<'All' | 'Tasks' | 'Comments' | 'Decisions' | 'Docs' | 'Status'>('All');
  const filteredFeed = ovFeed.filter((f) => feedFilter === 'All' ? true : f.kind === feedFilter);

  const statusColor = (s: OvAgent['status']) =>
    s === 'Working' ? '#10B981' : s === 'Blocked' ? '#EF4444' : '#9CA3AF';

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 320px' }}>
      {/* LEFT COLUMN: stats + agents + kanban */}
      <div className="space-y-6 min-w-0">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={<Bot className="w-[15px] h-[15px] text-[#6B7280]" />} label="Total Agents" value="8" sub="8 active" />
          <StatCard icon={<Zap className="w-[15px] h-[15px] text-[#6B7280]" />} label="Total Runs" value="76" sub="8 completed" />
          <StatCard icon={<MessageSquare className="w-[15px] h-[15px] text-[#6B7280]" />} label="Active Threads" value="—" sub="Coming soon" muted />
        </div>

      {/* AGENTS — horizontal carousel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Agents
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] text-[10.5px] font-semibold">{ovAgents.length}</span>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-auto-hide">
          {/* All Agents pill */}
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-[#E6E8EC] flex-shrink-0 min-w-[200px]">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1C1E21] to-[#3F3F46] flex items-center justify-center flex-shrink-0">
              <Bot className="w-[16px] h-[16px] text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-[#1C1E21]">All Agents</div>
              <div className="text-[11px] text-[#9CA3AF]">{ovAgents.filter(a => a.status === 'Working').length} active · {ovAgents.length} total</div>
            </div>
          </div>

          {ovAgents.map((a) => {
            const tone = tones[a.toneIdx % tones.length];
            return (
              <div
                key={a.name}
                draggable
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/15 transition cursor-grab active:cursor-grabbing flex-shrink-0 min-w-[220px]"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tone.bg }}>
                  <Bot className="w-[16px] h-[16px]" style={{ color: tone.iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#1C1E21] truncate">{a.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] text-[9px] font-bold tracking-wide flex-shrink-0">{a.tag}</span>
                  </div>
                  <div className="text-[11px] text-[#9CA3AF] truncate">{a.role}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide flex-shrink-0" style={{ color: statusColor(a.status) }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(a.status) }} />
                  {a.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MISSION QUEUE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FD5000]" />
            Mission Queue
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] text-[10.5px] font-semibold">7 active</span>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {ovColumns.map((col) => (
            <div key={col.key} className="rounded-xl bg-[#FAFAFB] border border-[#F0F1F3] p-3 min-h-[140px]">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase text-[#6B7280]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: col.dot }} />
                  {col.label}
                </span>
                <span className="text-[10.5px] font-semibold text-[#9CA3AF]">{col.count}</span>
              </div>
              <div className="space-y-2.5">
                {ovTasks[col.key].map((t, i) => {
                  const tone = tones[t.agentTone % tones.length];
                  return (
                    <div
                      key={i}
                      className="relative rounded-lg bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/15 hover:shadow-[0_2px_6px_rgba(0,0,0,0.04)] transition px-3 py-3 cursor-grab active:cursor-grabbing"
                    >
                      {t.accent && <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full" style={{ background: t.accent }} />}
                      <h4 className="text-[12.5px] font-semibold text-[#1C1E21] leading-snug mb-1.5">{t.title}</h4>
                      <p className="text-[11px] text-[#6B7280] leading-snug mb-3 line-clamp-2">{t.desc}</p>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: tone.bg }}>
                          <Bot className="w-[9px] h-[9px]" style={{ color: tone.iconColor }} />
                        </div>
                        <span className="text-[10px] font-medium text-[#1C1E21]">{t.agent}</span>
                        <span className="text-[10px] text-[#9CA3AF] truncate">{t.ago}</span>
                      </div>
                      {t.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {t.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-[#F3F4F6] text-[#6B7280] text-[9.5px] font-medium">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      {/* end LEFT column */}

      {/* RIGHT COLUMN: LIVE FEED */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Live Feed
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {[
            { key: 'All', n: ovFeed.length },
            { key: 'Tasks', n: 7 },
            { key: 'Comments', n: ovFeed.filter(f => f.kind === 'Comments').length },
            { key: 'Decisions', n: 3 },
            { key: 'Docs', n: 2 },
            { key: 'Status', n: ovFeed.filter(f => f.kind === 'Status').length },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFeedFilter(f.key as any)}
              className={`inline-flex items-center gap-1 px-2 h-6 rounded-full border text-[10.5px] font-medium transition ${
                feedFilter === f.key
                  ? 'bg-[#1C1E21] border-[#1C1E21] text-white'
                  : 'bg-white border-[#E6E8EC] text-[#4B5563] hover:border-[#1C1E21]/20'
              }`}
            >
              {f.key}
              <span className={feedFilter === f.key ? 'text-white/70' : 'text-[#9CA3AF]'}>{f.n}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFeed.map((e, i) => (
            <div key={i} className="flex items-start gap-2.5 text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FD5000] mt-1.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-[#1C1E21] leading-snug">
                  <span className="font-semibold">{e.who}</span>{' '}
                  <span className="text-[#6B7280]">{e.verb}</span>
                  {e.target && (
                    <>
                      {' '}<span className="font-semibold">"{e.target}"</span> <span className="text-[#9CA3AF]">›</span>
                    </>
                  )}
                </div>
                <div className="text-[11.5px] text-[#9CA3AF] mt-0.5">
                  <span className="font-medium text-[#6B7280]">{e.who}</span> · {e.ago}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChatView() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2.5 mb-1">
          <MessageSquare className="w-[18px] h-[18px] text-[#6B7280]" />
          <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight">Chat</h1>
        </div>
        <p className="text-[14px] text-[#6B7280]">Talk to your deployed agents and test prompts in real conversations.</p>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6 items-start" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Sidebar */}
        <div className="h-full flex flex-col">
          <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#9CA3AF] mb-3">Conversations</div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-9 pr-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1C1E21]/30 transition"
            />
          </div>
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {myAgents.slice(0, 9).map((a, i) => {
              const tone = tones[i % tones.length];
              const isActive = selected === a.name;
              return (
                <button
                  key={a.name}
                  onClick={() => setSelected(a.name)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-left border ${
                    isActive
                      ? 'bg-white border-[#1C1E21]/15 shadow-[0_2px_6px_rgba(0,0,0,0.04)]'
                      : 'bg-white border-[#E6E8EC] hover:border-[#1C1E21]/15'
                  }`}
                >
                  {a.img ? (
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden bg-[#F3F4F6]">
                      <img src={a.img} alt={a.name} className="w-full h-full object-cover object-top" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tone.bg }}>
                      <Bot className="w-[20px] h-[20px]" style={{ color: tone.iconColor }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-[#1C1E21] truncate mb-0.5">{a.name}</div>
                    <div className="text-[11.5px] font-medium" style={{ color: statusStyles[a.status].color }}>{a.status}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat area */}
        <ChatPanel selectedName={selected} onClose={() => setSelected(null)} />
      </div>
    </>
  );
}

function ChatPanel({ selectedName, onClose }: { selectedName: string | null; onClose: () => void }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([]);
  const [mentionType, setMentionType] = useState<'agent' | 'skill' | null>(null);
  const [mentionFilter, setMentionFilter] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const agent = selectedName ? myAgents.find(a => a.name === selectedName) : null;
  const agentIdx = agent ? myAgents.indexOf(agent) : 0;
  const tone = tones[agentIdx % tones.length];

  const handleInputChange = (val: string) => {
    setInput(val);
    const cursor = val.length;
    const before = val.slice(0, cursor);
    const atMatch = before.match(/(?:^|\s)@([\w-]*)$/);
    const slashMatch = before.match(/(?:^|\s)\/([\w-]*)$/);
    if (atMatch) {
      setMentionType('agent');
      setMentionFilter(atMatch[1].toLowerCase());
    } else if (slashMatch) {
      setMentionType('skill');
      setMentionFilter(slashMatch[1].toLowerCase());
    } else {
      setMentionType(null);
      setMentionFilter('');
    }
  };

  const insertMention = (label: string, type: 'agent' | 'skill') => {
    const symbol = type === 'agent' ? '@' : '/';
    const re = type === 'agent' ? /(?:^|\s)@[\w-]*$/ : /(?:^|\s)\/[\w-]*$/;
    const m = input.match(re);
    const insertText = `${symbol}${label.replace(/\s+/g, '-')} `;
    if (m) {
      const idx = input.lastIndexOf(m[0]);
      const prefix = input.slice(0, idx) + (m[0].startsWith(' ') ? ' ' : '');
      setInput(prefix + insertText);
    } else {
      setInput(input + insertText);
    }
    setMentionType(null);
    setMentionFilter('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const filteredAgents = myAgents.filter(a => a.name.toLowerCase().includes(mentionFilter)).slice(0, 6);
  const filteredSkills = [
    ...skillsList.map(s => ({ name: s.name, kind: 'Skill' as const, Icon: Zap })),
    ...skillTools.map(t => ({ name: t.name, kind: 'Tool' as const, Icon: t.Icon })),
  ].filter(s => s.name.toLowerCase().includes(mentionFilter)).slice(0, 6);

  const send = () => {
    if (!input.trim() || !agent) return;
    setMessages((prev) => [...prev, { role: 'user', text: input.trim() }]);
    setInput('');
    setMentionType(null);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'agent', text: `Hi — I'm ${agent.name}. ${agent.desc.split('.')[0]}. How can I help?` }]);
    }, 600);
  };

  if (!selectedName || !agent) {
    return (
      <div className="h-full rounded-2xl border border-[#E6E8EC] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-[#9CA3AF]" />
          </div>
          <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-1">Select an agent to start a conversation</h3>
          <p className="text-[13px] text-[#9CA3AF]">Choose from the sidebar or click "Message" on an agent card.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full rounded-2xl border border-[#E6E8EC] bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0F1F3] flex-shrink-0">
        <div className="flex items-center gap-3">
          {agent.img ? (
            <div className="w-9 h-9 rounded-lg flex-shrink-0 overflow-hidden bg-[#F3F4F6]">
              <img src={agent.img} alt={agent.name} className="w-full h-full object-cover object-top" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tone.bg }}>
              <Bot className="w-[18px] h-[18px]" style={{ color: tone.iconColor }} />
            </div>
          )}
          <div>
            <div className="text-[14px] font-semibold text-[#1C1E21]">{agent.name}</div>
            <div className="text-[11.5px] font-medium" style={{ color: statusStyles[agent.status].color }}>{agent.status}</div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-md hover:bg-[#F3F4F6] transition" aria-label="Close">
          <X className="w-[16px] h-[16px] text-[#6B7280]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            {agent.img ? (
              <div className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden bg-[#F3F4F6] mb-4">
                <img src={agent.img} alt={agent.name} className="w-full h-full object-cover object-top" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: tone.bg }}>
                <Bot className="w-7 h-7" style={{ color: tone.iconColor }} strokeWidth={1.75} />
              </div>
            )}
            <h3 className="text-[18px] font-semibold text-[#1C1E21] tracking-tight mb-1">Chat with {agent.name}</h3>
            <p className="text-[13px] text-[#9CA3AF] max-w-[360px] leading-relaxed mb-6">{agent.desc}</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-[480px]">
              {['Show me a recent example', 'What can you do?', 'How are you configured?'].map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-3 h-8 rounded-full bg-white border border-[#E6E8EC] text-[12.5px] font-medium text-[#4B5563] hover:border-[#1C1E21]/20 hover:text-[#1C1E21] transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-[640px] mx-auto space-y-5">
            {messages.map((m, i) => (
              m.role === 'user' ? (
                <div key={i} className="flex justify-end">
                  <div className="inline-block bg-[#F3F4F6] rounded-2xl px-4 py-2.5 max-w-[80%] text-[14px] text-[#1C1E21] leading-relaxed">{m.text}</div>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: tone.bg }}>
                    <Bot className="w-[14px] h-[14px]" style={{ color: tone.iconColor }} />
                  </div>
                  <div className="flex-1 text-[14px] text-[#1C1E21] leading-relaxed">{m.text}</div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-5 flex-shrink-0">
        <div className="max-w-[720px] mx-auto">
          {/* Hint */}
          <div className="flex items-center gap-2 text-[10.5px] text-[#9CA3AF] mb-1.5 px-1">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-px rounded bg-[#F3F4F6] text-[#4B5563] font-mono text-[10px]">@</kbd>
              mention an agent
            </span>
            <span className="text-[#D1D5DB]">·</span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1 py-px rounded bg-[#F3F4F6] text-[#4B5563] font-mono text-[10px]">/</kbd>
              for skills & tools
            </span>
          </div>

          <div className="relative rounded-2xl border border-[#E6E8EC] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.03)] focus-within:border-[#1C1E21]/20 focus-within:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all">
            {/* Mention dropdown */}
            {mentionType && (
              <div className="absolute bottom-full left-0 mb-2 w-[300px] max-h-[260px] overflow-y-auto rounded-xl bg-white border border-[#E6E8EC] shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1.5 z-10">
                <div className="px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase text-[#9CA3AF] border-b border-[#F0F1F3]">
                  {mentionType === 'agent' ? 'Agents' : 'Skills & Tools'}
                </div>
                {mentionType === 'agent' ? (
                  filteredAgents.length === 0 ? (
                    <div className="px-3 py-3 text-[12px] text-[#9CA3AF]">No agents match</div>
                  ) : filteredAgents.map((a, i) => {
                    const t = tones[myAgents.indexOf(a) % tones.length];
                    return (
                      <button
                        key={a.name}
                        onClick={() => insertMention(a.name, 'agent')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAFAFB] transition text-left"
                      >
                        <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: t.bg }}>
                          <Bot className="w-[13px] h-[13px]" style={{ color: t.iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-semibold text-[#1C1E21] truncate">{a.name}</div>
                          <div className="text-[11px] text-[#9CA3AF] truncate">{a.category}</div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  filteredSkills.length === 0 ? (
                    <div className="px-3 py-3 text-[12px] text-[#9CA3AF]">No skills or tools match</div>
                  ) : filteredSkills.map((s) => {
                    const Icon = s.Icon;
                    const isTool = s.kind === 'Tool';
                    return (
                      <button
                        key={s.name}
                        onClick={() => insertMention(s.name, 'skill')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAFAFB] transition text-left"
                      >
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: isTool ? '#F0FDF4' : '#EFF6FF' }}
                        >
                          <Icon className="w-[12px] h-[12px]" style={{ color: isTool ? '#059669' : '#2563EB' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] font-semibold text-[#1C1E21] truncate">{s.name}</div>
                          <div className="text-[10.5px] font-semibold tracking-wide uppercase text-[#9CA3AF]">{s.kind}</div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setMentionType(null); return; }
                if (e.key === 'Enter' && !e.shiftKey && !mentionType) { e.preventDefault(); send(); }
              }}
              placeholder={`Message ${agent.name}...`}
              rows={1}
              className="w-full px-4 pt-3 pb-1 bg-transparent text-[14px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none resize-none"
            />
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-1">
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F3F4F6] transition" aria-label="Attach">
                  <Plus className="w-[16px] h-[16px] text-[#6B7280]" />
                </button>
                <button className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F3F4F6] transition" aria-label="Mic">
                  <Mic className="w-[15px] h-[15px] text-[#6B7280]" />
                </button>
              </div>
              <button
                onClick={send}
                disabled={!input.trim()}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition ${
                  input.trim() ? 'bg-[#1C1E21] hover:bg-black text-white' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
                }`}
                aria-label="Send"
              >
                <ArrowUp className="w-[14px] h-[14px]" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const kbStats = [
  { label: 'Total Sources', value: '2', sub: '1 predefined, 1 custom', Icon: Database, iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { label: 'Total Chunks', value: '102', sub: 'Indexed vectors', Icon: Layers, iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { label: 'Files Indexed', value: '0', sub: 'PDF, DOCX, TXT, CSV', Icon: BookOpen, iconBg: '#F0FDF4', iconColor: '#10B981' },
  { label: 'Web Pages', value: '2', sub: 'URLs scraped', Icon: Globe, iconBg: '#FFFBEB', iconColor: '#F59E0B' },
];

const kbSources = [
  {
    name: 'Zuper Documentation',
    url: 'https://docs.zuper.co',
    typeTags: [
      { label: 'PREDEFINED', bg: '#DBEAFE', color: '#2563EB' },
      { label: 'MCP', bg: '#FEF3C7', color: '#92400E' },
    ],
    status: 'Connected',
    updated: 'about 1 month ago',
    chunks: 0,
    showActions: false,
  },
  {
    name: 'Quickbooks API Error',
    url: 'https://developer.intuit.com/app/developer/qbo/docs/d…',
    typeTags: [{ label: 'WEB', bg: '#F3F4F6', color: '#4B5563' }],
    status: 'Ready',
    updated: 'about 1 month ago',
    chunks: 102,
    showActions: true,
  },
];

function KnowledgeBaseView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };
  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Database className="w-[18px] h-[18px] text-[#6B7280]" />
            <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight">Knowledge Base</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{kbSources.length}</span>
          </div>
          <p className="text-[14px] text-[#6B7280]">Connect data sources to give your agents domain knowledge.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold shadow-[0_2px_6px_rgba(28,30,33,0.18)] transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          Add Knowledge
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kbStats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-[#E6E8EC] p-5">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#9CA3AF]">{s.label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.iconBg }}>
                <s.Icon className="w-[14px] h-[14px]" style={{ color: s.iconColor }} />
              </div>
            </div>
            <div className="text-[28px] font-semibold text-[#1C1E21] leading-none tracking-tight mb-1.5">{s.value}</div>
            <div className="text-[12px] text-[#9CA3AF]">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="rounded-xl bg-white border border-[#E6E8EC] overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#F0F1F3]">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search knowledge bases..."
              className="w-full pl-9 pr-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#4B5563] font-medium hover:border-[#1C1E21]/30 transition">
            All Types
            <ChevronDown className="w-[13px] h-[13px] text-[#9CA3AF]" />
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-[#F0F1F3]">
              <th className="text-left px-5 py-3 text-[10.5px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Name</th>
              <th className="text-left px-3 py-3 text-[10.5px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Type</th>
              <th className="text-left px-3 py-3 text-[10.5px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Status</th>
              <th className="text-left px-3 py-3 text-[10.5px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Updated</th>
              <th className="text-left px-3 py-3 text-[10.5px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Chunks</th>
              <th className="text-right px-5 py-3 text-[10.5px] font-semibold tracking-wider uppercase text-[#9CA3AF]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {kbSources.map((s, i) => (
              <tr key={i} className={`${i !== kbSources.length - 1 ? 'border-b border-[#F0F1F3]' : ''} hover:bg-[#FAFAFB] transition`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <Globe className="w-[16px] h-[16px] text-[#3B82F6]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#1C1E21]">{s.name}</div>
                      <div className="text-[12px] text-[#9CA3AF] truncate max-w-[280px]">{s.url}</div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {s.typeTags.map((t) => (
                      <span key={t.label} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold tracking-wide uppercase" style={{ background: t.bg, color: t.color }}>
                        {t.label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-4">
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#10B981]">
                    <CheckCircle2 className="w-[14px] h-[14px]" />
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-[12.5px] text-[#6B7280]">{s.updated}</td>
                <td className="px-3 py-4 text-[13px] font-medium text-[#1C1E21]">{s.chunks}</td>
                <td className="px-5 py-4 text-right">
                  {s.showActions ? (
                    <div className="inline-flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-[#F3F4F6] transition" aria-label="Sync">
                        <RefreshCw className="w-[14px] h-[14px] text-[#9CA3AF]" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-[#FEE2E2] transition group" aria-label="Delete">
                        <Trash2 className="w-[14px] h-[14px] text-[#9CA3AF] group-hover:text-[#EF4444]" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[#D1D5DB] text-[13px]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && <AddKnowledgeModal onClose={() => setModalOpen(false)} onSave={() => { setModalOpen(false); showToast('Knowledge added'); }} />}
      <Toast message={toast} />
    </>
  );
}

function AddKnowledgeModal({ onClose, onSave }: { onClose: () => void; onSave?: () => void }) {
  const [tab, setTab] = useState<'url' | 'file'>('url');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[480px] max-w-[92vw] max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#E6E8EC] shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-[16px] font-semibold text-[#1C1E21] tracking-tight">Add Knowledge</h2>
            <p className="text-[12.5px] text-[#6B7280] mt-1">Add a web URL or upload a file to create a new knowledge base.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-[#F3F4F6] transition flex-shrink-0" aria-label="Close">
            <X className="w-[16px] h-[16px] text-[#9CA3AF]" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#F3F4F6]">
            <button
              onClick={() => setTab('url')}
              className={`inline-flex items-center justify-center gap-1.5 h-8 rounded-md text-[12.5px] font-medium transition ${
                tab === 'url' ? 'bg-white text-[#1C1E21] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              <Globe className="w-[13px] h-[13px]" />
              Web URL
            </button>
            <button
              onClick={() => setTab('file')}
              className={`inline-flex items-center justify-center gap-1.5 h-8 rounded-md text-[12.5px] font-medium transition ${
                tab === 'file' ? 'bg-white text-[#1C1E21] shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              <Upload className="w-[13px] h-[13px]" />
              File Upload
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pt-5 pb-5 space-y-4">
          <div>
            <label className="block text-[12.5px] font-medium text-[#1C1E21] mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Product Documentation"
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
            />
          </div>

          {tab === 'url' ? (
            <div>
              <label className="block text-[12.5px] font-medium text-[#1C1E21] mb-1.5">URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://docs.example.com"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[12.5px] font-medium text-[#1C1E21] mb-1.5">File</label>
              <label className="flex flex-col items-center justify-center h-[140px] rounded-lg border border-dashed border-[#D1D5DB] hover:border-[#1C1E21]/30 hover:bg-[#FAFAFB] transition cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <Upload className="w-5 h-5 text-[#9CA3AF] mb-2" />
                <span className="text-[12.5px] text-[#1C1E21] font-medium">{file ? file.name : 'Click or drag a file here'}</span>
                <span className="text-[11px] text-[#9CA3AF] mt-1">PDF, DOCX, TXT, CSV up to 25 MB</span>
              </label>
            </div>
          )}

          <div>
            <label className="block text-[12.5px] font-medium text-[#1C1E21] mb-1.5">Description <span className="text-[#9CA3AF] font-normal">(optional)</span></label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Brief description of this data source..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition resize-y leading-relaxed"
            />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 pb-6">
          <button
            onClick={onSave || onClose}
            className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold shadow-[0_2px_6px_rgba(28,30,33,0.18)] transition-all"
          >
            {tab === 'url' ? 'Add Source' : 'Upload & Index'}
          </button>
        </div>
      </div>
    </div>
  );
}

const skillsList: { name: string; desc: string; type: 'Predefined' | 'Custom' }[] = [
  { name: 'Create Job', desc: 'Gather job details from conversation, validate required fields, and create a new job in Zuper.', type: 'Predefined' },
  { name: 'Create Customer', desc: 'Collect customer information, validate, and create a new customer record in Zuper.', type: 'Predefined' },
  { name: 'Add Job Note', desc: 'Identify a job, compose a contextual note, and attach it to the job in Zuper.', type: 'Predefined' },
  { name: 'Create Invoice', desc: 'Gather invoice details from job and customer context, validate line items, and create in Zuper.', type: 'Predefined' },
  { name: 'Write Executive Summary', desc: 'Fetch job details and compose a structured professional executive summary.', type: 'Predefined' },
  { name: 'Find Zuper Customer by Name', desc: 'Search Zuper customers by name keyword and classify the result as a single match, multiple ambiguous candidates, or none.', type: 'Predefined' },
];

function SkillsView() {
  const [tab, setTab] = useState<'All' | 'Predefined' | 'Custom'>('All');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const filtered = skillsList.filter((s) => (tab === 'All' ? true : s.type === tab));

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  if (creating) {
    return (
      <>
        <NewSkillForm onCancel={() => setCreating(false)} onSave={() => { setCreating(false); showToast('Skill saved'); }} />
        <Toast message={toast} />
      </>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Zap className="w-[18px] h-[18px] text-[#6B7280]" />
            <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight">Skills</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{skillsList.length}</span>
          </div>
          <p className="text-[14px] text-[#6B7280]">Reusable instruction sets paired with tools.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search skills..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
            />
          </div>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold shadow-[0_2px_6px_rgba(28,30,33,0.18)] transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New Skill
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E6E8EC] mb-6">
        {(['All', 'Predefined', 'Custom'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-3 text-[13px] font-medium transition ${
              tab === t ? 'text-[#2563EB]' : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
          >
            {t}
            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-full" />}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.name}
            className="rounded-xl bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/15 hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all cursor-pointer p-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-[14.5px] font-semibold text-[#1C1E21]">{s.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-semibold tracking-wide uppercase ${
                s.type === 'Predefined'
                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                  : 'bg-[#F3F4F6] text-[#4B5563]'
              }`}>
                {s.type}
              </span>
            </div>
            <p className="text-[12.5px] text-[#6B7280] leading-relaxed line-clamp-2">{s.desc}</p>
          </div>
        ))}
      </div>
      <Toast message={toast} />
    </>
  );
}

const skillTools = [
  { key: 'email', name: 'Send Email', desc: 'Send an email to a specified recipient with subject and body.', Icon: Mail },
  { key: 'slack', name: 'Send Slack Message', desc: 'Send a message to a Slack channel via webhook.', Icon: MessageSquare },
  { key: 'search', name: 'Web Search', desc: 'Search the web and return relevant results with extracted content.', Icon: Search },
  { key: 'weather', name: 'Get Weather', desc: 'Fetch a daily weather forecast for given lat/lon coordinates via Open-Meteo.', Icon: Wrench },
  { key: 'reviews', name: 'Fetch Google Reviews', desc: 'Fetch new Google reviews for a Place ID since a given timestamp.', Icon: Wrench },
];

function NewSkillForm({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [instructions, setInstructions] = useState('');
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>({});
  const canSave = name.trim().length > 0;

  const enabledCount = Object.values(enabledTools).filter(Boolean).length;

  return (
    <div className="max-w-[860px] mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[14px] font-normal leading-none mb-4" aria-label="Breadcrumb">
        <button onClick={onCancel} className="text-[#9CA3AF] hover:text-[#6B7280] transition leading-none">Skills</button>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-[#6B7280] leading-none">New Skill</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-6">
        <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight leading-tight">Create a new skill</h1>
        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          <button
            onClick={onCancel}
            className="px-4 h-9 rounded-lg border border-[#E6E8EC] bg-white text-[#1C1E21] text-[13px] font-medium hover:bg-[#F8F9FB] transition"
          >
            Cancel
          </button>
          <button
            onClick={canSave ? onSave : undefined}
            disabled={!canSave}
            className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-white text-[13px] font-semibold transition-all ${
              canSave
                ? 'bg-[#1C1E21] hover:bg-black shadow-[0_2px_6px_rgba(28,30,33,0.18)] cursor-pointer'
                : 'bg-[#9CA3AF] cursor-not-allowed'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save Skill
          </button>
        </div>
      </div>

      {/* Section 1: Basics */}
      <FormSection
        step={1}
        title="Basics"
        subtitle="Give your skill a clear name and a short summary that teammates will see."
      >
        <div className="grid grid-cols-1 gap-5">
          <Field label="Name" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Digest Emailer"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
            />
          </Field>
          <Field label="Description">
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Short description shown on skill cards"
              className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
            />
          </Field>
        </div>
      </FormSection>

      {/* Section 2: Instructions */}
      <FormSection
        step={2}
        title="Instructions"
        subtitle="Tell the agent exactly what to do when this skill is active. This is injected into the agent's prompt."
      >
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder={`Example:\n• Read the latest email from the customer\n• Identify the job ID mentioned\n• Draft a polite reply confirming the appointment time\n• Wait for approval before sending`}
          rows={10}
          className="w-full px-3.5 py-3 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition resize-y leading-relaxed font-mono"
        />
        <p className="mt-2 text-[11.5px] text-[#9CA3AF]">{instructions.length} characters</p>
      </FormSection>

      {/* Section 3: Tools */}
      <FormSection
        step={3}
        title="Tools"
        subtitle={
          <>
            <span className="font-semibold text-[#1C1E21]">Tools</span> let your skill take action — send messages, fetch data, or call external services. Toggle on the ones this skill needs.
          </>
        }
      >
        <div className="space-y-2">
          {skillTools.map((t) => {
            const enabled = !!enabledTools[t.key];
            return (
              <div
                key={t.key}
                onClick={() => setEnabledTools((prev) => ({ ...prev, [t.key]: !enabled }))}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition cursor-pointer ${
                  enabled
                    ? 'border-[#1C1E21]/20 bg-[#FAFAFB]'
                    : 'border-[#E6E8EC] hover:border-[#1C1E21]/15 hover:bg-[#FAFAFB]'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                  <t.Icon className="w-[16px] h-[16px] text-[#6B7280]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13.5px] font-semibold text-[#1C1E21] mb-0.5 tracking-tight">{t.name}</div>
                  <div className="text-[12px] text-[#6B7280] leading-snug">{t.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setEnabledTools((prev) => ({ ...prev, [t.key]: !enabled })); }}
                  className={`relative inline-flex items-center w-[36px] h-[20px] p-0 rounded-full border-0 transition-colors flex-shrink-0 ${enabled ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
                  aria-pressed={enabled}
                  aria-label={`Toggle ${t.name}`}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${enabled ? 'left-[18px]' : 'left-[2px]'}`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </FormSection>
    </div>
  );
}

function NewAgentForm({ onCancel, onDeploy }: { onCancel: () => void; onDeploy: () => void }) {
  const [tab, setTab] = useState<'identity' | 'skills' | 'knowledge' | 'triggers' | 'advanced'>('identity');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [instructions, setInstructions] = useState('');
  const [triggers, setTriggers] = useState({ mention: true, dm: true, task: true });
  const [enabledSkills, setEnabledSkills] = useState<Record<string, boolean>>({});
  const [enabledTools, setEnabledAgentTools] = useState<Record<string, boolean>>({});
  const [enabledKB, setEnabledKB] = useState<Record<string, boolean>>({});
  const [trigState, setTrigState] = useState({ scheduled: false, mention: false, webhook: false });
  const [model, setModel] = useState<'lite' | 'pro'>('lite');
  const [temperature, setTemperature] = useState(0.7);
  const [scheduleFreq, setScheduleFreq] = useState<'hour' | 'day' | 'week' | 'month' | 'weekdays' | 'custom'>('week');
  const [scheduleHour, setScheduleHour] = useState(9);
  const [scheduleMin, setScheduleMin] = useState(0);
  const [mentionScopes, setMentionScopes] = useState<Record<string, boolean>>({ chat: true, comments: true, dm: false });
  const canDeploy = name.trim().length > 0 && instructions.trim().length > 0;

  const tabs: { key: typeof tab; label: string }[] = [
    { key: 'identity', label: 'Identity & Role' },
    { key: 'skills', label: 'Skills & Tools' },
    { key: 'knowledge', label: 'Knowledge' },
    { key: 'triggers', label: 'Triggers' },
    { key: 'advanced', label: 'Advanced' },
  ];

  return (
    <div className="-mx-8 -mt-8 -mb-12 grid grid-cols-[1fr_440px] min-h-[calc(100vh-32px)]">
      {/* LEFT: form content */}
      <div className="px-8 pt-8 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[14px] font-normal leading-none mb-3" aria-label="Breadcrumb">
          <button onClick={onCancel} className="text-[#9CA3AF] hover:text-[#6B7280] transition leading-none">My Agents</button>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-[#6B7280] leading-none">New Agent</span>
        </nav>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight">New Agent</h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FFF4ED] text-[#C2410C] text-[10.5px] font-semibold tracking-wide uppercase">
                Draft
              </span>
            </div>
            <p className="text-[13.5px] text-[#6B7280] mt-1">Configure identity, tools, and behavior.</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={onCancel}
              className="px-4 h-9 rounded-lg border border-[#E6E8EC] bg-white text-[#1C1E21] text-[13px] font-medium hover:bg-[#F8F9FB] transition"
            >
              Cancel
            </button>
            <button
              onClick={canDeploy ? onDeploy : undefined}
              disabled={!canDeploy}
              className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-white text-[13px] font-semibold transition-all ${
                canDeploy
                  ? 'bg-[#1C1E21] hover:bg-black shadow-[0_2px_6px_rgba(28,30,33,0.18)] cursor-pointer'
                  : 'bg-[#9CA3AF] cursor-not-allowed'
              }`}
            >
              <Play className="w-[12px] h-[12px]" fill="currentColor" />
              Deploy Agent
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-7 border-b border-[#E6E8EC] mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative pb-3 text-[13px] font-medium transition ${
                tab === t.key ? 'text-[#2563EB]' : 'text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB] rounded-full" />}
            </button>
          ))}
        </div>

        <div>
          {tab === 'identity' && (
            <>
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="w-[16px] h-[16px] text-[#2563EB]" />
                  <h3 className="text-[15px] font-semibold text-[#1C1E21] tracking-tight">Agent Identity</h3>
                </div>
                <div className="rounded-2xl bg-white border border-[#E6E8EC] p-6">
                  <label className="block text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#6B7280] mb-2">Agent Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Customer Support Hero"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[15px] font-semibold text-[#1C1E21] tracking-tight mb-3">System Instructions</h3>
                <div className="rounded-2xl bg-white border border-[#E6E8EC] p-6">
                  <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] mb-4">
                    <Info className="w-[14px] h-[14px] text-[#2563EB] mt-0.5 flex-shrink-0" />
                    <p className="text-[12.5px] text-[#1E40AF] leading-relaxed">Instructions define how the agent behaves, its tone, and its constraints.</p>
                  </div>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="You are a helpful assistant that..."
                    rows={12}
                    className="w-full px-3.5 py-3 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#FF6B35]/40 focus:ring-2 focus:ring-[#FF6B35]/10 transition resize-y leading-relaxed font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {tab === 'skills' && (
            <>
              {/* Skills */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Zap className="w-[16px] h-[16px] text-[#2563EB]" />
                    <h3 className="text-[15px] font-semibold text-[#1C1E21] tracking-tight">Skills</h3>
                  </div>
                  <button className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1C1E21] text-[12.5px] font-medium transition">
                    <Plus className="w-[13px] h-[13px]" strokeWidth={2.25} />
                    Create New Skill
                  </button>
                </div>
                <p className="text-[12.5px] text-[#9CA3AF] mb-4">Instruction sets with built-in tools that give your agent specific abilities.</p>
                <div className="grid grid-cols-2 gap-4">
                  {skillsList.map((s) => {
                    const on = !!enabledSkills[s.name];
                    return (
                      <div
                        key={s.name}
                        onClick={() => setEnabledSkills((p) => ({ ...p, [s.name]: !on }))}
                        className={`relative rounded-xl bg-white border p-4 cursor-pointer transition ${
                          on ? 'border-[#1C1E21]/20 bg-[#FAFAFB]' : 'border-[#E6E8EC] hover:border-[#1C1E21]/15'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-[13.5px] font-semibold text-[#1C1E21]">{s.name}</h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] text-[10.5px] font-semibold tracking-wide uppercase">{s.type}</span>
                          </div>
                          <Toggle on={on} onClick={(e) => { e.stopPropagation(); setEnabledSkills((p) => ({ ...p, [s.name]: !on })); }} />
                        </div>
                        <p className="text-[11.5px] text-[#6B7280] leading-relaxed line-clamp-2">{s.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Standalone Tools */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wrench className="w-[16px] h-[16px] text-[#2563EB]" />
                  <h3 className="text-[15px] font-semibold text-[#1C1E21] tracking-tight">Standalone Tools</h3>
                </div>
                <p className="text-[12.5px] text-[#9CA3AF] mb-4">General-purpose tools your agent can use independently.</p>
                <div className="grid grid-cols-2 gap-4">
                  {skillTools.map((t) => {
                    const on = !!enabledTools[t.key];
                    return (
                      <div
                        key={t.key}
                        onClick={() => setEnabledAgentTools((p) => ({ ...p, [t.key]: !on }))}
                        className={`relative rounded-xl bg-white border p-4 cursor-pointer transition ${
                          on ? 'border-[#1C1E21]/20 bg-[#FAFAFB]' : 'border-[#E6E8EC] hover:border-[#1C1E21]/15'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <t.Icon className="w-[14px] h-[14px] text-[#6B7280]" />
                            <h4 className="text-[13.5px] font-semibold text-[#1C1E21]">{t.name}</h4>
                          </div>
                          <Toggle on={on} onClick={(e) => { e.stopPropagation(); setEnabledAgentTools((p) => ({ ...p, [t.key]: !on })); }} />
                        </div>
                        <p className="text-[11.5px] text-[#6B7280] leading-relaxed line-clamp-2">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {tab === 'knowledge' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Database className="w-[16px] h-[16px] text-[#2563EB]" />
                  <h3 className="text-[15px] font-semibold text-[#1C1E21] tracking-tight">Knowledge</h3>
                </div>
                <button className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#1C1E21] text-[12.5px] font-medium transition">
                  <Plus className="w-[13px] h-[13px]" strokeWidth={2.25} />
                  Add Knowledge
                </button>
              </div>
              <p className="text-[12.5px] text-[#9CA3AF] mb-4">Connect data sources to give your agent domain knowledge.</p>

              <div className="rounded-xl bg-white border border-[#E6E8EC] overflow-hidden">
                {kbSources.map((s, i) => {
                  const on = !!enabledKB[s.name];
                  return (
                    <div
                      key={s.name}
                      onClick={() => setEnabledKB((p) => ({ ...p, [s.name]: !on }))}
                      className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition ${
                        i !== kbSources.length - 1 ? 'border-b border-[#F0F1F3]' : ''
                      } ${on ? 'bg-[#FAFAFB]' : 'hover:bg-[#FAFAFB]'}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                        <Globe className="w-[16px] h-[16px] text-[#3B82F6]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="text-[13.5px] font-semibold text-[#1C1E21]">{s.name}</span>
                          {s.typeTags.map((t) => (
                            <span key={t.label} className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase" style={{ background: t.bg, color: t.color }}>
                              {t.label}
                            </span>
                          ))}
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981]">
                            <CheckCircle2 className="w-[11px] h-[11px]" />
                            {s.status}
                          </span>
                        </div>
                        <div className="text-[12px] text-[#9CA3AF] truncate">{s.url}</div>
                      </div>
                      <Toggle on={on} onClick={(e) => { e.stopPropagation(); setEnabledKB((p) => ({ ...p, [s.name]: !on })); }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'triggers' && (
            <div className="space-y-3">
              {/* Scheduled Execution */}
              <div className={`rounded-2xl border bg-white transition ${trigState.scheduled ? 'border-[#1C1E21]/15' : 'border-[#E6E8EC]'}`}>
                <div className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                    <Clock className="w-[16px] h-[16px] text-[#2563EB]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-semibold text-[#1C1E21] mb-0.5">Scheduled Execution</h4>
                    <p className="text-[12.5px] text-[#6B7280]">Run this agent on a recurring schedule.</p>
                  </div>
                  <Toggle on={trigState.scheduled} onClick={(e) => { e.stopPropagation(); setTrigState((p) => ({ ...p, scheduled: !p.scheduled })); }} />
                </div>
                {trigState.scheduled && (
                  <div className="px-4 pb-4 pt-1 space-y-4 border-t border-[#E6E8EC]">
                    <div className="pt-4">
                      <div className="text-[12px] font-medium text-[#1C1E21] mb-2">Frequency</div>
                      <div className="flex flex-wrap gap-1.5">
                        {([
                          ['hour', 'Every hour'],
                          ['day', 'Every day'],
                          ['week', 'Every week'],
                          ['month', 'Every month'],
                          ['weekdays', 'Weekdays'],
                          ['custom', 'Custom'],
                        ] as const).map(([k, label]) => (
                          <button
                            key={k}
                            onClick={() => setScheduleFreq(k)}
                            className={`px-3 h-7 rounded-full text-[12px] font-medium transition border ${
                              scheduleFreq === k
                                ? 'bg-[#1C1E21] border-[#1C1E21] text-white'
                                : 'bg-white border-[#E6E8EC] text-[#4B5563] hover:border-[#1C1E21]/20'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[12px] font-medium text-[#1C1E21] mb-2">Time</div>
                      <div className="flex items-center gap-2">
                        <select
                          value={scheduleHour}
                          onChange={(e) => setScheduleHour(Number(e.target.value))}
                          className="px-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] focus:outline-none focus:border-[#FF6B35]/40"
                        >
                          {Array.from({ length: 24 }, (_, i) => (<option key={i} value={i}>{String(i).padStart(2, '0')}</option>))}
                        </select>
                        <span className="text-[#9CA3AF]">:</span>
                        <select
                          value={scheduleMin}
                          onChange={(e) => setScheduleMin(Number(e.target.value))}
                          className="px-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] focus:outline-none focus:border-[#FF6B35]/40"
                        >
                          {[0, 15, 30, 45].map((m) => (<option key={m} value={m}>{String(m).padStart(2, '0')}</option>))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8F9FB] text-[#4B5563] text-[12.5px]">
                      <Info className="w-[14px] h-[14px] text-[#9CA3AF]" />
                      Runs <span className="font-semibold text-[#1C1E21]">{frequencyLabel(scheduleFreq)}</span> at <span className="font-semibold text-[#1C1E21]">{String(scheduleHour).padStart(2, '0')}:{String(scheduleMin).padStart(2, '0')}</span>
                    </div>

                    <div className="flex items-center justify-between text-[12.5px]">
                      <div className="inline-flex items-center gap-1.5 text-[#6B7280]">
                        <Globe className="w-[13px] h-[13px]" />
                        Timezone: <span className="font-medium text-[#1C1E21]">Asia/Calcutta</span>
                      </div>
                      <button className="inline-flex items-center gap-1 text-[11.5px] text-[#6B7280] hover:text-[#1C1E21] transition">
                        Advanced cron expression
                        <ChevronDown className="w-[12px] h-[12px]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mention */}
              <div className={`rounded-2xl border bg-white transition ${trigState.mention ? 'border-[#1C1E21]/15' : 'border-[#E6E8EC]'}`}>
                <div className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                    <AtSign className="w-[16px] h-[16px] text-[#10B981]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-semibold text-[#1C1E21] mb-0.5">Mention</h4>
                    <p className="text-[12.5px] text-[#6B7280]">Trigger this agent when mentioned in a conversation.</p>
                  </div>
                  <Toggle on={trigState.mention} onClick={(e) => { e.stopPropagation(); setTrigState((p) => ({ ...p, mention: !p.mention })); }} />
                </div>
                {trigState.mention && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[#E6E8EC]">
                    <div className="pt-4">
                      <div className="text-[12px] font-medium text-[#1C1E21] mb-1">Where to listen</div>
                      <p className="text-[11.5px] text-[#9CA3AF] mb-2">By default the agent responds to <code className="px-1 py-0.5 rounded bg-[#F3F4F6] text-[#1C1E21] font-mono text-[11px]">@{(name || 'agent').toLowerCase().replace(/\s+/g, '-')}</code> across these surfaces.</p>
                      <div className="space-y-1.5">
                        {[
                          { key: 'chat', label: 'Chat threads', desc: 'In any chat where the agent is added' },
                          { key: 'comments', label: 'Comments on jobs & tasks', desc: 'Mentions inside record comments' },
                          { key: 'dm', label: 'Direct messages', desc: 'When users DM the agent directly' },
                        ].map((opt) => {
                          const on = !!mentionScopes[opt.key];
                          return (
                            <div
                              key={opt.key}
                              onClick={() => setMentionScopes((p) => ({ ...p, [opt.key]: !on }))}
                              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-white border border-transparent hover:border-[#E6E8EC] transition cursor-pointer"
                            >
                              <div className="min-w-0">
                                <div className="text-[12.5px] font-medium text-[#1C1E21]">{opt.label}</div>
                                <div className="text-[11.5px] text-[#9CA3AF]">{opt.desc}</div>
                              </div>
                              <Toggle on={on} onClick={(e) => { e.stopPropagation(); setMentionScopes((p) => ({ ...p, [opt.key]: !on })); }} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Webhook */}
              <div className={`rounded-2xl border bg-white transition ${trigState.webhook ? 'border-[#1C1E21]/15' : 'border-[#E6E8EC]'}`}>
                <div className="flex items-start gap-3 p-4">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                    <Webhook className="w-[16px] h-[16px] text-[#D97706]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-semibold text-[#1C1E21] mb-0.5">Webhook</h4>
                    <p className="text-[12.5px] text-[#6B7280]">Trigger this agent from any external tool via a signed HTTPS POST.</p>
                  </div>
                  <Toggle on={trigState.webhook} onClick={(e) => { e.stopPropagation(); setTrigState((p) => ({ ...p, webhook: !p.webhook })); }} />
                </div>
                {trigState.webhook && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-[#E6E8EC]">
                    <div className="pt-4 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#F8F9FB] text-[#4B5563] text-[12px] leading-relaxed">
                      <Info className="w-[14px] h-[14px] flex-shrink-0 mt-0.5 text-[#9CA3AF]" />
                      <div>
                        <span className="font-semibold text-[#1C1E21]">Deploy this agent first</span> — the webhook URL and signing secret are generated when the trigger is attached, and the secret is shown exactly once.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'advanced' && (
            <div className="space-y-7">
              {/* Model & Behavior */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-[16px] h-[16px] text-[#6B7280]" />
                  <h3 className="text-[15px] font-semibold text-[#1C1E21] tracking-tight">Model & Behavior</h3>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {/* Model dropdown */}
                  <div>
                    <label className="block text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#9CA3AF] mb-2">Model</label>
                    <div className="relative">
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value as 'lite' | 'pro')}
                        className="w-full appearance-none px-3 pr-9 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] focus:outline-none focus:border-[#1C1E21]/30 transition"
                      >
                        <option value="lite">Zuper Lite</option>
                        <option value="pro">Zuper Pro</option>
                      </select>
                      <ChevronDown className="w-[14px] h-[14px] text-[#9CA3AF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <p className="text-[11.5px] text-[#9CA3AF] mt-2">Larger models reason better but cost more per run.</p>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#9CA3AF]">Temperature</label>
                      <span className="text-[14px] font-semibold text-[#1C1E21]">{temperature.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={temperature}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full accent-[#1C1E21]"
                    />
                    <div className="flex justify-between text-[11px] text-[#9CA3AF] mt-1">
                      <span><span className="font-medium text-[#4B5563]">0.0</span> · precise</span>
                      <span>creative · <span className="font-medium text-[#4B5563]">1.0</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Memory */}
              <div>
                <h3 className="text-[15px] font-semibold text-[#1C1E21] tracking-tight mb-4">Memory</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: MessageSquare, name: 'Recent Messages', desc: 'Last 20 messages per thread, used as conversational context.' },
                    { icon: Database, name: 'Working Memory', desc: 'User preferences and session context the agent learns over time.' },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div key={m.name} className="rounded-xl bg-white border border-[#E6E8EC] p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon className="w-[15px] h-[15px] text-[#6B7280]" />
                            <h4 className="text-[13.5px] font-semibold text-[#1C1E21]">{m.name}</h4>
                          </div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#15803D] text-[10.5px] font-semibold tracking-wide uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                            Enabled
                          </span>
                        </div>
                        <p className="text-[12px] text-[#6B7280] leading-relaxed">{m.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab !== 'identity' && tab !== 'skills' && tab !== 'knowledge' && tab !== 'triggers' && tab !== 'advanced' && (
            <div className="rounded-2xl bg-white border border-[#E6E8EC] p-12 text-center">
              <div className="text-[14px] text-[#9CA3AF]">{tabs.find(t => t.key === tab)?.label} configuration coming soon.</div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Agent Live Preview as side panel */}
      <LiveAgentPreview name={name} instructions={instructions} model={model} temperature={temperature} />
    </div>
  );
}

function frequencyLabel(f: 'hour' | 'day' | 'week' | 'month' | 'weekdays' | 'custom') {
  switch (f) {
    case 'hour': return 'every hour';
    case 'day': return 'every day';
    case 'week': return 'every Monday';
    case 'month': return 'on the 1st';
    case 'weekdays': return 'weekdays';
    case 'custom': return 'on custom schedule';
  }
}

function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-24 right-6 z-50 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1C1E21] text-white text-[13px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.18)] animate-[fadeUpRight_0.18s_ease-out]">
      <CheckCircle2 className="w-[16px] h-[16px] text-[#10B981]" />
      {message}
      <style>{`
        @keyframes fadeUpRight {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center w-[32px] h-[18px] p-0 rounded-full border-0 transition-colors flex-shrink-0 ${on ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
      aria-pressed={on}
    >
      <span className={`absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-[left] duration-200 ${on ? 'left-[16px]' : 'left-[2px]'}`} />
    </button>
  );
}

function TriggerRow({ icon: Icon, label, sub, enabled, onToggle }: { icon: any; label: string; sub?: string; enabled: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <Icon className="w-[14px] h-[14px] text-[#6B7280] flex-shrink-0" />
      <span className="text-[#1C1E21] font-medium">{label}</span>
      {sub && <span className="text-[#9CA3AF] truncate flex-1">· {sub}</span>}
      <div className="flex-1" />
      <button
        type="button"
        onClick={onToggle}
        className={`relative inline-flex items-center w-[36px] h-[20px] p-0 rounded-full border-0 transition-colors flex-shrink-0 ${enabled ? 'bg-[#7C3AED]' : 'bg-[#E5E7EB]'}`}
      >
        <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${enabled ? 'left-[18px]' : 'left-[2px]'}`} />
      </button>
    </div>
  );
}

function LiveAgentPreview({ name, instructions, model = 'lite', temperature = 0.7 }: { name: string; instructions: string; model?: 'lite' | 'pro'; temperature?: number }) {
  const displayName = name.trim() || 'Untitled Agent';
  const nameSet = name.trim().length > 0;
  const instructionsSet = instructions.trim().length > 0;
  const showInstructions = instructions.trim().length > 0;

  return (
    <aside
      className="rounded-2xl overflow-hidden flex flex-col sticky top-4 my-4 mr-4 bg-white border border-[#E6E8EC] shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
      style={{ maxHeight: 'calc(100vh - 64px)' }}
    >
      <div className="flex flex-col overflow-hidden h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F0F1F3] flex-shrink-0 bg-white">
        <span className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF]">Live Preview</span>
        <span className="inline-flex items-center text-[10.5px] font-semibold tracking-wider uppercase text-[#10B981]">
          In Sync
        </span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Agent Identity */}
        <div className="px-5 pt-5 pb-5">
          {/* Avatar with ring + status dot */}
          <div className="relative w-[64px] h-[64px] mb-3">
            <div className="absolute inset-0 rounded-full p-[2px]" style={{ background: 'conic-gradient(from 180deg, #FFEDD5, #FED7AA, #FEF3C7, #FFEDD5)' }}>
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: '#FFEDD5' }}>
                  <Bot className="w-[28px] h-[28px]" style={{ color: '#F97316' }} strokeWidth={1.75} />
                </div>
              </div>
            </div>
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
          </div>

          {/* Name + status */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[18px] font-semibold text-[#1C1E21] leading-tight tracking-tight truncate">{displayName}</h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FFF4ED] text-[#C2410C] text-[10.5px] font-semibold tracking-wide uppercase flex-shrink-0">
              Draft
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280] leading-snug mb-2">Configure your agent's behavior to get started.</p>
          <p className="text-[12px] text-[#9CA3AF] leading-snug">
            <span className="font-medium text-[#6B7280]">Public</span>
            <span className="mx-1.5">·</span>
            <span className="inline-flex items-center gap-1 align-middle">
              <span className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] text-white text-[8px] font-bold flex items-center justify-center">V</span>
              Managed by <span className="font-medium text-[#1C1E21] ml-0.5">Vignesh Pillai</span>
            </span>
          </p>
        </div>

        <div className="border-t border-[#F0F1F3]" />

        {/* Instructions */}
        <div className="px-5 py-4">
          <h3 className="text-[14px] font-semibold text-[#1C1E21] tracking-tight mb-3">Instructions</h3>
          <div className="rounded-xl bg-[#F3F4F6] p-4 text-[12.5px] text-[#1C1E21] leading-relaxed whitespace-pre-wrap break-words font-mono max-h-[260px] overflow-y-auto">
            {showInstructions ? instructions : <span className="font-sans not-italic text-[#9CA3AF]">Your instructions will appear here as you type them.</span>}
          </div>
        </div>

        <div className="border-t border-[#F0F1F3]" />

        {/* Configuration */}
        <div className="px-5 py-4">
          <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF] mb-2">Configuration</div>
          <div className="divide-y divide-[#F0F1F3]">
            <div className="py-2.5"><PreviewRow icon={Zap} label="Skills" value="0 active" valueDot="#F97316" /></div>
            <div className="py-2.5"><PreviewRow icon={Wrench} label="Tools" value="0 attached" valueDot="#F97316" /></div>
            <div className="py-2.5"><PreviewRow icon={Database} label="Knowledge" value="None linked" valueDot="#F97316" /></div>
            <div className="py-2.5"><PreviewRow icon={Clock} label="Schedule" value="On demand" /></div>
            <div className="py-2.5"><PreviewRow icon={Bot} label="Model" value={`${model === 'pro' ? 'Zuper Pro' : 'Zuper Lite'} · T=${temperature.toFixed(2)}`} /></div>
          </div>
        </div>

        <div className="border-t border-[#F0F1F3]" />

        {/* Pre-deploy Checks */}
        <div className="px-5 py-4">
          <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF] mb-2">Pre-deploy Checks</div>
          <div className="divide-y divide-[#F0F1F3]">
            <div className="py-2.5"><CheckRow label="Name is set" status={nameSet ? 'PASS' : 'FAIL'} /></div>
            <div className="py-2.5"><CheckRow label="Instructions are clear" status={instructionsSet ? 'PASS' : 'NOTE'} /></div>
            <div className="py-2.5"><CheckRow label="At least one capability" status="NOTE" /></div>
          </div>
        </div>
      </div>
      </div>
    </aside>
  );
}

function PreviewRow({ icon: Icon, label, value, valueDot, mono }: { icon: any; label: string; value: string; valueDot?: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12.5px]">
      <div className="flex items-center gap-2 text-[#4B5563]">
        <Icon className="w-[13px] h-[13px] text-[#9CA3AF]" />
        <span>{label}</span>
      </div>
      <span className={`${mono ? 'font-mono text-[11.5px]' : ''} text-[#1C1E21] font-medium`}>
        {value}
      </span>
    </div>
  );
}

function CheckRow({ label, status }: { label: string; status: 'PASS' | 'FAIL' | 'NOTE' }) {
  const statusStyle = status === 'PASS'
    ? { dot: '#10B981', color: '#15803D' }
    : status === 'FAIL'
    ? { dot: '#EF4444', color: '#B91C1C' }
    : { dot: '#F97316', color: '#C2410C' };

  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <span className="text-[#4B5563]">{label}</span>
      <span className="text-[10.5px] font-bold tracking-wider uppercase" style={{ color: statusStyle.color }}>{status}</span>
    </div>
  );
}

function FormSection({ step, title, subtitle, meta, children }: { step: number; title: string; subtitle: React.ReactNode; meta?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-[#E6E8EC] p-7 mt-5">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[12px] font-semibold flex-shrink-0">
            {step}
          </span>
          <div>
            <h3 className="text-[15.5px] font-semibold text-[#1C1E21] leading-tight tracking-tight">{title}</h3>
            <p className="text-[12.5px] text-[#6B7280] mt-1 leading-relaxed">{subtitle}</p>
          </div>
        </div>
        {meta && (
          <span className="text-[11px] font-semibold tracking-wider uppercase text-[#9CA3AF] flex-shrink-0 mt-1.5">{meta}</span>
        )}
      </div>
      <div className="pl-10">{children}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1 text-[13px] font-medium text-[#1C1E21] mb-2">
        {label}
        {required && <span className="text-[#EF4444]">*</span>}
      </label>
      {children}
    </div>
  );
}

const catalogItems = [
  {
    title: 'Daily Weather Forecast',
    role: 'Operations Assistant',
    desc: 'Wakes up before your crews and emails a multi-city forecast so jobs get rescheduled before rain hits.',
    saves: 'Saves 3h/week',
    rating: 4.8,
    hires: 142,
    featured: true,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: Mail, label: 'Email' }],
    img: agent1,
    tint: 'linear-gradient(180deg, #FEF3C7 0%, #FFFBEB 100%)',
    accent: '#F59E0B',
  },
  {
    title: 'Google Review Digest',
    role: 'Customer Insights',
    desc: 'Pulls fresh Google reviews, matches them to customers, and flags anything below 4 stars for follow-up.',
    saves: 'Saves 2h/week',
    rating: 4.9,
    hires: 218,
    featured: true,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: Mail, label: 'Email' }],
    img: agent2,
    tint: 'linear-gradient(180deg, #FFE4E6 0%, #FFF1F2 100%)',
    accent: '#F43F5E',
  },
  {
    title: 'Lead Intake',
    role: 'Sales Assistant',
    desc: 'Captures inbound leads via webhook and turns them into Zuper jobs with the right tags and crew assigned.',
    saves: 'Saves 6h/week',
    rating: 4.7,
    hires: 312,
    tags: [{ icon: Webhook, label: 'Webhook' }, { icon: Zap, label: 'Auto-create' }],
    img: agent3,
    tint: 'linear-gradient(180deg, #FCE7F3 0%, #FDF2F8 100%)',
    accent: '#EC4899',
  },
  {
    title: 'Quote Reminder',
    role: 'Sales Closer',
    desc: 'Politely nudges customers with open quotes so they don\'t go cold — and tells you which ones converted.',
    saves: 'Saves 4h/week',
    rating: 4.6,
    hires: 96,
    tags: [{ icon: Clock, label: 'Scheduled' }, { icon: Mail, label: 'Email' }],
    img: agent1,
    tint: 'linear-gradient(180deg, #DBEAFE 0%, #EFF6FF 100%)',
    accent: '#3B82F6',
  },
  {
    title: 'Crew Daily Brief',
    role: 'Field Coordinator',
    desc: 'Texts each crew their full schedule, drive routes, and parts list every morning before they roll out.',
    saves: 'Saves 5h/week',
    rating: 4.8,
    hires: 174,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: MessageSquare, label: 'SMS' }],
    img: agent2,
    tint: 'linear-gradient(180deg, #D1FAE5 0%, #ECFDF5 100%)',
    accent: '#10B981',
  },
  {
    title: 'Invoice Aging Watcher',
    role: 'Collections Assistant',
    desc: 'Spots invoices past 30 days, drafts a friendly collection email, and tracks who has and hasn\'t paid.',
    saves: 'Saves 7h/week',
    rating: 4.9,
    hires: 256,
    featured: true,
    tags: [{ icon: Clock, label: 'Scheduled' }, { icon: Mail, label: 'Email' }],
    img: agent3,
    tint: 'linear-gradient(180deg, #E9D5FF 0%, #F5F3FF 100%)',
    accent: '#8B5CF6',
  },
];

function CatalogView() {
  const [activeCat, setActiveCat] = useState<string>('All');
  const categories = ['All', 'Sales', 'Operations', 'Customer', 'Finance', 'Field'];

  return (
    <>
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl mb-8 border border-[#FFE2D1]" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFE9D6 50%, #FEF3C7 100%)' }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-50" style={{ background: 'radial-gradient(circle, rgba(253,80,0,0.25) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, rgba(252,211,77,0.30) 0%, transparent 70%)' }} />

        <div className="relative px-8 py-9 flex items-start justify-between gap-8">
          <div className="flex-1 max-w-[640px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/70 border border-[#FFD9C2] mb-4 backdrop-blur-sm">
              <Sparkles className="w-[12px] h-[12px] text-[#F59E0B]" fill="currentColor" />
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C2410C]">Sense Agents Marketplace</span>
            </div>
            <h2 className="text-[28px] font-semibold text-[#1C1E21] tracking-tight leading-tight mb-2">
              Hire pre-built agents.<br />
              Ship in minutes, not weeks.
            </h2>
            <p className="text-[14px] text-[#6B7280] leading-relaxed mb-5 max-w-[560px]">
              <span className="font-semibold text-[#1C1E21]">Sense Agents</span> are autonomous teammates that run inside Zuper — they read your data, take action with tools, and learn over time. The <span className="font-semibold text-[#1C1E21]">Catalog</span> is a curated library of ready-to-deploy agents you can hire with one click and customize for your business.
            </p>
            <div className="flex items-center gap-5 text-[12.5px] text-[#6B7280]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span><span className="font-semibold text-[#1C1E21]">{catalogItems.length}+</span> agents available</span>
              </span>
              <span className="text-[#D1D5DB]">·</span>
              <span><span className="font-semibold text-[#1C1E21]">Free</span> starter agents</span>
              <span className="text-[#D1D5DB]">·</span>
              <span>Deploys in <span className="font-semibold text-[#1C1E21]">under 24h</span></span>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center gap-2 flex-shrink-0 pt-1">
            <div className="flex -space-x-3">
              {[agent1, agent2, agent3].map((src, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl border-2 border-white overflow-hidden bg-[#F3F4F6] shadow-[0_4px_10px_rgba(0,0,0,0.06)]" style={{ zIndex: 3 - i }}>
                  <img src={src} alt="" className="w-full h-full object-cover object-top" draggable={false} />
                </div>
              ))}
            </div>
            <span className="text-[11px] text-[#9CA3AF]">Featured agents</span>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <BookOpen className="w-[18px] h-[18px] text-[#6B7280]" />
            <h1 className="text-[20px] font-semibold text-[#1C1E21] tracking-tight">Browse Catalog</h1>
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{catalogItems.length}</span>
          </div>
          <p className="text-[13px] text-[#6B7280]">Pick one, customize it, deploy.</p>
        </div>
        <div className="relative w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full pl-9 pr-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1C1E21]/30 transition"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-auto-hide">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCat(c)}
            className={`px-3.5 h-8 rounded-full text-[12.5px] font-medium transition border whitespace-nowrap ${
              activeCat === c
                ? 'bg-[#1C1E21] border-[#1C1E21] text-white'
                : 'bg-white border-[#E6E8EC] text-[#4B5563] hover:border-[#1C1E21]/20'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-7">
        {catalogItems.map((item) => (
          <div
            key={item.title}
            className="group rounded-2xl bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/15 hover:shadow-[0_10px_28px_rgba(0,0,0,0.07)] transition-all cursor-pointer overflow-hidden flex flex-col"
          >
            {/* Hero with avatar */}
            <div
              className="relative h-[160px] overflow-hidden"
              style={{ background: item.tint }}
            >
              <img
                src={item.img}
                alt={item.title}
                className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[100%] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
                draggable={false}
              />
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${item.accent}40, transparent 70%)` }} />
              {item.featured && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] text-[10.5px] font-semibold tracking-wide uppercase">
                  <Star className="w-[10px] h-[10px] text-[#F59E0B] fill-[#F59E0B]" />
                  Featured
                </span>
              )}
              <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#15803D] text-[10.5px] font-semibold tracking-wide uppercase">
                <Zap className="w-[10px] h-[10px]" fill="currentColor" />
                {item.saves}
              </span>
            </div>

            {/* Content */}
            <div className="px-4 pt-4 pb-3 flex-1 flex flex-col">
              <div className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#9CA3AF] mb-1">{item.role}</div>
              <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-1.5">{item.title}</h3>
              <p className="text-[12.5px] text-[#6B7280] leading-relaxed line-clamp-3 mb-3 flex-1">{item.desc}</p>

              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t, i) => {
                  const Icon = t.icon;
                  return (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563]">
                      <Icon className="w-[11px] h-[11px] text-[#9CA3AF]" />
                      {t.label}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-[#F0F1F3] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[12px]">
                <Star className="w-[12px] h-[12px] text-[#F59E0B] fill-[#F59E0B]" />
                <span className="font-semibold text-[#1C1E21]">{item.rating.toFixed(1)}</span>
                <span className="text-[#9CA3AF]">· {item.hires.toLocaleString()} hires</span>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12px] font-semibold shadow-[0_2px_6px_rgba(28,30,33,0.18)] transition-all">
                Hire
                <ArrowRight className="w-[12px] h-[12px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FilterGroup({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12.5px] font-medium transition ${
          value !== 'All'
            ? 'bg-[#1C1E21] border-[#1C1E21] text-white'
            : 'bg-white border-[#E6E8EC] text-[#4B5563] hover:border-[#1C1E21]/30'
        }`}
      >
        <span>{label}{value !== 'All' ? `: ${value}` : ''}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute z-20 top-full left-0 mt-1.5 bg-white border border-[#E6E8EC] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.08)] py-1 min-w-[140px]">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-[12.5px] transition ${
                  value === opt ? 'text-[#1C1E21] font-semibold bg-[#F8F9FB]' : 'text-[#4B5563] hover:bg-[#F8F9FB]'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CreateAgentCard({ layout }: { layout: 'grid' | 'list' }) {
  if (layout === 'list') {
    return (
      <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl bg-white border border-dashed border-[#D1D5DB] hover:border-[#1C1E21]/30 hover:bg-[#FAFAFB] transition-all cursor-pointer group">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#F8F9FB] border border-dashed border-[#D1D5DB] group-hover:border-[#1C1E21]/30">
          <Plus className="w-6 h-6 text-[#9CA3AF] group-hover:text-[#1C1E21]" strokeWidth={2} />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[14.5px] font-semibold text-[#1C1E21]">Create New Agent</div>
          <div className="text-[12.5px] text-[#6B7280]">Deploy a custom agent with specific tools and instructions.</div>
        </div>
      </button>
    );
  }
  return (
    <button className="rounded-2xl bg-white border border-dashed border-[#D1D5DB] hover:border-[#1C1E21]/30 hover:bg-[#FAFAFB] transition-all cursor-pointer group flex flex-col items-center justify-center text-center px-6 py-12 min-h-[280px]">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[#F3F4F6] group-hover:bg-[#E5E7EB] transition">
        <Plus className="w-6 h-6 text-[#6B7280] group-hover:text-[#1C1E21]" strokeWidth={2} />
      </div>
      <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-1.5">Create New Agent</h3>
      <p className="text-[12.5px] text-[#6B7280] leading-relaxed max-w-[220px]">Deploy a custom agent with specific tools and instructions.</p>
    </button>
  );
}

const categoryTint: Record<string, { tint: string; accent: string }> = {
  Sales: { tint: 'linear-gradient(180deg, #DBEAFE 0%, #EFF6FF 100%)', accent: '#3B82F6' },
  Operations: { tint: 'linear-gradient(180deg, #FEF3C7 0%, #FFFBEB 100%)', accent: '#F59E0B' },
  Support: { tint: 'linear-gradient(180deg, #D1FAE5 0%, #ECFDF5 100%)', accent: '#10B981' },
  Finance: { tint: 'linear-gradient(180deg, #E9D5FF 0%, #F5F3FF 100%)', accent: '#8B5CF6' },
  Compliance: { tint: 'linear-gradient(180deg, #FFE4E6 0%, #FFF1F2 100%)', accent: '#F43F5E' },
};

type VPCardData = {
  title: string;
  role: string;
  desc: string;
  saves: string;
  rating: number;
  hires: number;
  featured?: boolean;
  hired?: boolean;
  tags: { icon: any; label: string }[];
  img: string;
  tint: string;
  accent: string;
};

function VPAgentsView() {
  const hiredCards: VPCardData[] = myAgents
    .filter((a) => a.status === 'Active')
    .map((a) => {
      const t = categoryTint[a.category] || { tint: 'linear-gradient(180deg, #F3F4F6 0%, #FAFAFA 100%)', accent: '#9CA3AF' };
      return {
        title: a.name,
        role: a.category,
        desc: a.desc,
        saves: `${a.runs.toLocaleString()} runs`,
        rating: a.rating,
        hires: a.users,
        hired: true,
        tags: [
          { icon: Users, label: `${a.users} users` },
          { icon: RefreshCw, label: a.lastRun || 'Idle' },
        ],
        img: a.img || agent1,
        tint: t.tint,
        accent: t.accent,
      };
    });

  const catalogCards: VPCardData[] = catalogItems.map((c) => ({
    title: c.title,
    role: c.role,
    desc: c.desc,
    saves: c.saves,
    rating: c.rating,
    hires: c.hires,
    featured: c.featured,
    hired: false,
    tags: c.tags,
    img: c.img,
    tint: c.tint,
    accent: c.accent,
  }));

  const allCards: VPCardData[] = [...hiredCards, ...catalogCards];
  const [activeIdx, setActiveIdx] = useState(Math.floor(allCards.length / 2));
  const next = () => setActiveIdx((i) => Math.min(i + 1, allCards.length - 1));
  const prev = () => setActiveIdx((i) => Math.max(i - 1, 0));

  return (
    <div className="w-full">
      <div className="mb-10 text-center max-w-[640px] mx-auto">
        <div className="inline-flex items-center gap-2.5 mb-2">
          <Bot className="w-[20px] h-[20px] text-[#6B7280]" />
          <h1 className="text-[32px] font-semibold text-[#1C1E21] tracking-tight">Agents</h1>
          <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{allCards.length}</span>
        </div>
        <p className="text-[14px] text-[#6B7280] leading-relaxed">Your active teammates and the catalog of agents ready to hire. Browse, pick one, deploy in minutes.</p>
      </div>

      <div className="relative w-full overflow-hidden" style={{ height: 540 }}>
        <div className="relative w-full h-full">
          {allCards.map((card, i) => {
            const offset = i - activeIdx;
            const abs = Math.abs(offset);
            if (abs > 2) return null;
            const translateX = offset * 300;
            const scale = offset === 0 ? 1 : abs === 1 ? 0.82 : 0.66;
            const opacity = offset === 0 ? 1 : abs === 1 ? 0.55 : 0.18;
            const zIndex = 10 - abs;
            const focused = offset === 0;
            return (
              <div
                key={card.title}
                onClick={() => !focused && setActiveIdx(i)}
                className="absolute top-1/2 left-1/2 transition-all duration-500 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  pointerEvents: abs > 1 ? 'none' : 'auto',
                  cursor: focused ? 'default' : 'pointer',
                }}
              >
                <VPAgentCard card={card} focused={focused} />
              </div>
            );
          })}
        </div>

        <button
          onClick={prev}
          disabled={activeIdx === 0}
          aria-label="Previous agent"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#E6E8EC] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-[#FAFAFB] hover:border-[#1C1E21]/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-5 h-5 text-[#1C1E21]" />
        </button>
        <button
          onClick={next}
          disabled={activeIdx === allCards.length - 1}
          aria-label="Next agent"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#E6E8EC] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-[#FAFAFB] hover:border-[#1C1E21]/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-5 h-5 text-[#1C1E21]" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-2">
        {allCards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            aria-label={`Go to agent ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIdx ? 'w-6 bg-[#1C1E21]' : 'w-1.5 bg-[#D1D5DB] hover:bg-[#9CA3AF]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function VPAgentCard({ card, focused = false }: { card: VPCardData; focused?: boolean }) {
  return (
    <div
      className={`group rounded-2xl bg-white border overflow-hidden flex flex-col w-[360px] transition-all duration-500 ${
        focused
          ? 'border-[#1C1E21]/15 shadow-[0_24px_60px_rgba(0,0,0,0.14),0_8px_20px_rgba(0,0,0,0.06)]'
          : 'border-[#E6E8EC] shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="relative h-[180px] overflow-hidden" style={{ background: card.tint }}>
        <img
          src={card.img}
          alt={card.title}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[100%] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          draggable={false}
        />
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${card.accent}40, transparent 70%)` }} />
        {card.hired ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#15803D] text-[10.5px] font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Active
          </span>
        ) : card.featured ? (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] text-[10.5px] font-semibold tracking-wide uppercase">
            <Star className="w-[10px] h-[10px] text-[#F59E0B] fill-[#F59E0B]" />
            Featured
          </span>
        ) : null}
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#15803D] text-[10.5px] font-semibold tracking-wide uppercase">
          <Zap className="w-[10px] h-[10px]" fill="currentColor" />
          {card.saves}
        </span>
      </div>
      <div className="px-4 pt-4 pb-3 flex-1 flex flex-col">
        <div className="text-[10.5px] font-semibold tracking-[0.12em] uppercase text-[#9CA3AF] mb-1">{card.role}</div>
        <h3 className="text-[16px] font-semibold text-[#1C1E21] mb-1.5 leading-snug">{card.title}</h3>
        <p className="text-[12.5px] text-[#6B7280] leading-relaxed line-clamp-3 mb-3 flex-1">{card.desc}</p>
        <div className="flex flex-wrap gap-1.5">
          {card.tags.map((t, i) => {
            const Icon = t.icon;
            return (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[11px] font-medium text-[#4B5563]">
                <Icon className="w-[11px] h-[11px] text-[#9CA3AF]" />
                {t.label}
              </span>
            );
          })}
        </div>
      </div>
      <div className="border-t border-[#F0F1F3] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12px]">
          <Star className="w-[12px] h-[12px] text-[#F59E0B] fill-[#F59E0B]" />
          <span className="font-semibold text-[#1C1E21]">{card.rating.toFixed(1)}</span>
          <span className="text-[#9CA3AF]">· {card.hires.toLocaleString()} {card.hired ? 'users' : 'hires'}</span>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12px] font-semibold shadow-[0_2px_6px_rgba(28,30,33,0.18)] transition-all">
          {card.hired ? 'Open' : 'Hire'}
          <ArrowRight className="w-[12px] h-[12px]" />
        </button>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: 'Completed' | 'Failed' }) {
  const styles = status === 'Completed'
    ? { bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' }
    : { bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' };
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11.5px] font-semibold" style={{ background: styles.bg, color: styles.color }}>
      {status}
    </span>
  );
}
