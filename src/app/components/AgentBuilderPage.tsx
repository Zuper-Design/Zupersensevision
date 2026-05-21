import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SenseLogo } from './SenseLogo';
import {
  LayoutGrid, Bot, BookOpen, MessageSquare, Zap, Database, BarChart3, LifeBuoy, Plus,
  Search, MoreHorizontal, Play, Pencil, List, LayoutGrid as GridIcon, Star, Users, Check, AlertTriangle,
  Clock, Mail, Webhook, Info, ArrowRight, Wrench, Globe, Layers, CheckCircle2, RefreshCw, Trash2, ChevronDown, X, Upload,
  AtSign, History, Maximize2, MoreVertical, Send, Share2, BarChart2, ChevronLeft, ChevronRight, Mic, ArrowUp, Sparkles, Wand2, FileText,
} from 'lucide-react';
import avatarBg from '../../imports/agents/avatar-bg.png';
import agentClassic1 from '../../imports/agents/agent-1.png';
import agentClassic2 from '../../imports/agents/agent-2.png';
import agentClassic3 from '../../imports/agents/agent-3.png';
import emptyToolkit from '../../imports/agents/empty-toolkit.png';
const agentDetective = '/agent-detective.png';
const agentCreator = '/agent-creator.png';
const agentMarketer = '/agent-marketer.png';
const agentSupport = '/agent-support.png';
const agentReviews = '/agent-reviews.png';
import CircularGallery from './CircularGallery';

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
  { name: 'Spark', desc: '# Inside Sales Rep Agent The Inside Sales Rep Age...', status: 'Active', updated: '17 days ago', img: agentMarketer },
  { name: 'Care', desc: '# Customer Success Agent The Customer Success Age...', status: 'Active', updated: '17 days ago', img: agentSupport },
  { name: 'Sift', desc: '# Lead Qualification Agent The Lead Qualification...', status: 'Active', updated: '17 days ago', img: agentDetective },
  { name: 'Coach', desc: '# Sales Coach Agent The Sales Coach Agent support...', status: 'Active', updated: '17 days ago', img: agentCreator },
];

const recentActivity = [
  { agent: 'Sage', kind: 'SCHEDULE', when: '3 minutes ago', task: 'Scheduled run', tokens: '21,769', duration: '22.7s', status: 'Completed' },
  { agent: 'Sage', kind: 'SCHEDULE', when: 'about 22 hours ago', task: 'Scheduled run', tokens: '25,811', duration: '3579.2s', status: 'Failed' },
  { agent: 'Sage', kind: 'SCHEDULE', when: '2 days ago', task: 'Scheduled run', tokens: '—', duration: '6574.4s', status: 'Failed' },
];

export function AgentBuilderPage({ onClose, currentUser }: { onClose?: () => void; currentUser?: string }) {
  const isVP = currentUser === 'VP';
  const isAU = currentUser === 'AU' || currentUser === 'MJ';
  const [section, setSection] = useState<Section>('agents');
  const [auAgentOpen, setAuAgentOpen] = useState(true);
  const [vpCreateOpen, setVpCreateOpen] = useState(false);
  const [auActiveAgent, setAuActiveAgent] = useState<string | null>(null);
  const [customAgents, setCustomAgents] = useState<typeof myAgents>([]);
  const [agentVisits, setAgentVisits] = useState<Record<string, number>>({});
  const addCustomAgent = (a: typeof myAgents[number]) => {
    setCustomAgents((prev) => [a, ...prev.filter((x) => x.name !== a.name)]);
  };
  const openAgent = (name: string) => {
    setAgentVisits((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
    setAuActiveAgent(name);
  };
  const visibleNavItems = isVP
    ? navItems.filter((i) => i.key !== 'catalog').map((i) => (i.key === 'agents' ? { ...i, label: 'Agents' } : i))
    : navItems;

  if (isVP && vpCreateOpen) {
    return (
      <div className="h-full w-full bg-white">
        <VPCreateAgentView onClose={() => setVpCreateOpen(false)} />
      </div>
    );
  }

  if (isAU && section === 'catalog') {
    return (
      <motion.div
        key="au-marketplace"
        initial={{ opacity: 0, y: 24, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full bg-white"
      >
        <AUMarketplaceView
          onBack={() => setSection('agents')}
          onHire={(a) => { addCustomAgent(a); setSection('agents'); }}
          onChatWith={(name) => { setSection('agents'); openAgent(name); }}
        />
      </motion.div>
    );
  }

  return (
    <div className="flex h-full w-full bg-white">
      {/* Left sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E6E8EC] flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-[#F0F1F3]">
          <div className="w-7 h-7 rounded-md bg-[#FFF4ED] border border-[#FFE2D1] flex items-center justify-center">
            <Wand2 className="w-[15px] h-[15px] text-[#FD5000]" strokeWidth={2} />
          </div>
          <h1 className="text-[16px] font-semibold text-[#1C1E21] tracking-tight">AI Studio</h1>
        </div>

        {isAU ? (
          <nav className="flex-1 p-3 space-y-0.5">
            {/* Overview */}
            <button
              onClick={() => setSection('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                section === 'overview' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21]'
              }`}
            >
              <LayoutGrid className={`w-[15px] h-[15px] ${section === 'overview' ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
              <span className="flex-1 text-left">Overview</span>
            </button>

            {/* Agent group */}
            <button
              onClick={() => setAuAgentOpen((v) => !v)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                section === 'agents' || section === 'catalog' ? 'text-[#1C1E21]' : 'text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21]'
              }`}
            >
              <Bot className="w-[15px] h-[15px] text-[#6B7280]" />
              <span className="flex-1 text-left">Agent</span>
              <ChevronDown className={`w-[14px] h-[14px] text-[#9CA3AF] transition-transform ${auAgentOpen ? '' : '-rotate-90'}`} />
            </button>
            {auAgentOpen && (
              <div className="ml-7 space-y-0.5 mt-0.5">
                <button
                  onClick={() => setSection('agents')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition ${
                    section === 'agents' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#6B7280] hover:bg-[#F8F9FB] hover:text-[#1C1E21]'
                  }`}
                >
                  <span className="flex-1 text-left">My agents</span>
                </button>
                <button
                  onClick={() => setSection('catalog')}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition ${
                    section === 'catalog' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#6B7280] hover:bg-[#F8F9FB] hover:text-[#1C1E21]'
                  }`}
                >
                  <span className="flex-1 text-left">Marketplace</span>
                </button>
              </div>
            )}

            {/* Skills */}
            <button
              onClick={() => setSection('skills')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                section === 'skills' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21]'
              }`}
            >
              <Zap className={`w-[15px] h-[15px] ${section === 'skills' ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
              <span className="flex-1 text-left">Skills</span>
            </button>

            {/* Knowledge Base */}
            <button
              onClick={() => setSection('knowledge')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 ${
                section === 'knowledge' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21]'
              }`}
            >
              <Database className={`w-[15px] h-[15px] ${section === 'knowledge' ? 'text-[#2563EB]' : 'text-[#6B7280]'}`} />
              <span className="flex-1 text-left">Knowledge Base</span>
            </button>

            {/* Usage (soon) */}
            <button
              disabled
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#C0C4CC] cursor-not-allowed"
            >
              <BarChart3 className="w-[15px] h-[15px] text-[#C0C4CC]" />
              <span className="flex-1 text-left">Usage</span>
              <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FFF4ED] text-[#FD5000]">SOON</span>
            </button>
          </nav>
        ) : (
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
        )}

        <div className="p-3 border-t border-[#F0F1F3]">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#4B5563] hover:bg-[#F8F9FB] transition">
            <LifeBuoy className="w-[15px] h-[15px] text-[#6B7280]" />
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      {isAU && auActiveAgent && [...customAgents, ...myAgents].find((a) => a.name === auActiveAgent) ? (
        <motion.main
          key={`au-agent-${auActiveAgent}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 overflow-hidden"
        >
          <AUCreateAgentForm
            mode="live"
            seedAgent={[...customAgents, ...myAgents].find((a) => a.name === auActiveAgent)!}
            visitCount={agentVisits[auActiveAgent] || 0}
            onCancel={() => setAuActiveAgent(null)}
            onDeploy={(record) => {
              if (record) {
                setCustomAgents((prev) => {
                  const exists = prev.some((a) => a.name === auActiveAgent);
                  if (exists) {
                    return prev.map((a) => a.name === auActiveAgent ? { ...a, ...record } : a);
                  }
                  return [record, ...prev];
                });
              }
              setAuActiveAgent(null);
            }}
            onForkAgent={(_, fork) => {
              setCustomAgents((prev) => [fork, ...prev]);
              setAuActiveAgent(fork.name);
            }}
          />
        </motion.main>
      ) : (
      <main className="flex-1 overflow-y-auto relative">
        <div className="px-8 pt-8 pb-12">
          {section === 'agents' ? (
            isVP ? <VPAgentsView onOpenCreate={() => setVpCreateOpen(true)} /> : isAU ? <AUMyAgentsView onEnterMarketplace={() => setSection('catalog')} onOpenAgent={openAgent} customAgents={customAgents} onAddCustomAgent={addCustomAgent} /> : <MyAgentsView />
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
      )}
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
  { name: 'Coach', desc: 'Reviews call transcripts and interaction logs, surfacing coaching moments.', runs: 412, lastRun: '1d ago', users: 7, rating: 4.4, reviews: 4, price: 'Free', skills: 3, tools: 2, status: 'Active', category: 'Sales', img: agentCreator },
  { name: 'Ledger', desc: 'Tracks job costs, generates invoices, and surfaces margin anomalies.', runs: 0, lastRun: '', users: 3, rating: 5.0, reviews: 1, price: '$25/mo', skills: 0, tools: 1, status: 'Draft', category: 'Finance', img: agentReviews },
  { name: 'Sage', desc: 'Answers user questions by searching and scraping Zuper documentation.', runs: 1872, lastRun: '8m ago', users: 32, rating: 4.7, reviews: 17, price: 'Free', skills: 4, tools: 3, status: 'Active', category: 'Support', img: agentSupport },
  { name: 'Compass', desc: 'Optimizes daily routes and crew assignments to reduce drive time and overlaps.', runs: 564, lastRun: '40m ago', users: 14, rating: 4.7, reviews: 8, price: '$15/mo', skills: 5, tools: 4, status: 'Active', category: 'Operations', img: agentDetective },
  { name: 'Pitch', desc: 'Drafts roofing estimates from intake notes and pulls in pricing automatically.', runs: 1024, lastRun: '3h ago', users: 22, rating: 4.5, reviews: 11, price: 'Free', skills: 3, tools: 2, status: 'Paused', category: 'Sales', img: agentCreator },
  { name: 'Nudge', desc: 'Sends polite, on-brand follow-ups to stalled quotes and tracks response rate.', runs: 740, lastRun: '6h ago', users: 19, rating: 4.6, reviews: 10, price: '$9/mo', skills: 2, tools: 3, status: 'Active', category: 'Sales', img: agentSupport },
  { name: 'Guard', desc: 'Reviews job-site checklists and flags missed safety steps before crew sign-off.', runs: 318, lastRun: '4h ago', users: 11, rating: 4.5, reviews: 6, price: 'Free', skills: 2, tools: 1, status: 'Error', category: 'Compliance', img: agentReviews },
  { name: 'Stock', desc: 'Watches stock levels, drafts purchase orders, and pings vendors when supplies run low.', runs: 892, lastRun: '1h ago', users: 16, rating: 4.7, reviews: 9, price: '$14/mo', skills: 4, tools: 3, status: 'Active', category: 'Operations', img: agentCreator },
  { name: 'Spark', desc: 'Handles inbound inquiries from homeowners and businesses interested in roofing services.', runs: 1248, lastRun: '2h ago', users: 24, rating: 4.8, reviews: 12, price: 'Free', skills: 6, tools: 4, status: 'Active', category: 'Sales', img: agentMarketer },
  { name: 'Care', desc: 'Supports existing customers throughout their roofing project lifecycle and follow-ups.', runs: 832, lastRun: '5h ago', users: 18, rating: 4.6, reviews: 9, price: '$12/mo', skills: 5, tools: 3, status: 'Paused', category: 'Support', img: agentDetective },
  { name: 'Sift', desc: 'Evaluates inbound leads to determine readiness, budget fit, and timeline.', runs: 2104, lastRun: '12m ago', users: 41, rating: 4.9, reviews: 23, price: '$19/mo', skills: 7, tools: 5, status: 'Active', category: 'Sales', img: agentSupport },
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
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
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

function AgentReadyModal({
  open,
  name,
  role,
  avatar,
  avatarTint,
  accent,
  onChat,
  onMarketplace,
  onClose,
  primaryLabel = 'Chat with',
  secondaryLabel = 'Go to marketplace',
}: {
  open: boolean;
  name: string;
  role: string;
  avatar: string;
  avatarTint: string;
  accent: string;
  onChat: () => void;
  onMarketplace: () => void;
  onClose: () => void;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        background: 'rgba(12,14,17,0.55)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        animation: 'agentReadyBackdrop 240ms cubic-bezier(0.23,1,0.32,1) both',
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[480px] mx-4 bg-white rounded-3xl overflow-hidden"
        style={{
          boxShadow: '0 24px 64px -16px rgba(0,0,0,0.30), 0 8px 24px -8px rgba(0,0,0,0.18)',
          animation: 'agentReadyModalIn 420ms cubic-bezier(0.23,1,0.32,1) both',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg bg-white/80 backdrop-blur hover:bg-white active:scale-[0.94] flex items-center justify-center text-[#4B5563]"
          aria-label="Close"
        >
          <X className="w-[15px] h-[15px]" />
        </button>

        {/* Avatar pane with celebration */}
        <div className="relative overflow-hidden" style={{ background: avatarTint, height: 280 }}>
          {/* Soft glow blobs */}
          <div className="absolute pointer-events-none" style={{ top: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${accent}55, transparent 70%)`, filter: 'blur(36px)' }} />
          <div className="absolute pointer-events-none" style={{ bottom: -80, right: -40, width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle, ${accent}33, transparent 70%)`, filter: 'blur(40px)' }} />

          {/* Orbit sparkles — 4 dots, decorative */}
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
              style={{
                top: '50%',
                left: '50%',
                background: accent,
                opacity: 0,
                animation: `sparkleOrbit${i} 2400ms cubic-bezier(0.23,1,0.32,1) ${i * 120 + 400}ms both`,
              }}
            />
          ))}

          {/* Breathing ring behind avatar */}
          <span
            className="absolute pointer-events-none rounded-full"
            style={{
              top: '50%',
              left: '50%',
              width: 240,
              height: 240,
              transform: 'translate(-50%, -50%)',
              border: `1px solid ${accent}66`,
              animation: 'agentReadyRing 2800ms cubic-bezier(0.23,1,0.32,1) infinite',
            }}
          />

          {/* Avatar */}
          <img
            src={avatar}
            alt=""
            className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[260px] w-auto object-contain"
            style={{
              animation: 'agentReadyAvatar 520ms cubic-bezier(0.34,1.56,0.64,1) 80ms both',
              filter: `drop-shadow(0 16px 24px ${accent}55)`,
            }}
            draggable={false}
          />

          {/* On duty pill */}
          <div
            className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#15803D] text-[10.5px] font-bold uppercase tracking-wide"
            style={{ animation: 'agentReadyChip 280ms cubic-bezier(0.23,1,0.32,1) 320ms both' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70 bg-[#10B981]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
            </span>
            On duty
          </div>
        </div>

        {/* Content */}
        <div className="px-7 pt-6 pb-7 text-center">
          <div
            className="text-[11.5px] font-medium uppercase tracking-[0.12em] mb-2"
            style={{ color: accent, animation: 'agentReadyText 320ms cubic-bezier(0.23,1,0.32,1) 380ms both' }}
          >
            {role || 'New agent'}
          </div>
          <h2
            className="text-[26px] font-semibold text-[#1C1E21] tracking-tight leading-[1.15] mb-2"
            style={{ animation: 'agentReadyText 360ms cubic-bezier(0.23,1,0.32,1) 440ms both' }}
          >
            <span style={{ color: accent }}>{name || 'Your agent'}</span> is ready
          </h2>
          <p
            className="text-[13.5px] text-[#6B7280] leading-relaxed mb-6 max-w-[340px] mx-auto"
            style={{ animation: 'agentReadyText 400ms cubic-bezier(0.23,1,0.32,1) 520ms both' }}
          >
            Deployed and standing by. {name?.split(' ')[0] || 'They'}'ll start handling work the moment you say go.
          </p>

          <div
            className="flex items-stretch gap-2.5"
            style={{ animation: 'agentReadyText 400ms cubic-bezier(0.23,1,0.32,1) 600ms both' }}
          >
            <button
              onClick={onMarketplace}
              style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), border-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-white border border-[#E6E8EC] text-[#1C1E21] text-[13px] font-semibold hover:border-[#1C1E21]/30 active:scale-[0.98]"
            >
              {secondaryLabel}
            </button>
            <button
              onClick={onChat}
              style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold active:scale-[0.98] hover:shadow-[0_8px_22px_-8px_rgba(0,0,0,0.30)]"
            >
              <MessageSquare className="w-[14px] h-[14px]" />
              {primaryLabel} {name?.split(' ')[0] || 'them'}
            </button>
          </div>
        </div>

        <style>{`
          @keyframes agentReadyBackdrop {
            from { opacity: 0 }
            to { opacity: 1 }
          }
          @keyframes agentReadyModalIn {
            from { opacity: 0; transform: scale(0.94) translateY(8px) }
            to { opacity: 1; transform: scale(1) translateY(0) }
          }
          @keyframes agentReadyAvatar {
            from { opacity: 0; transform: translateX(-50%) translateY(24px) scale(0.92) }
            to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1) }
          }
          @keyframes agentReadyChip {
            from { opacity: 0; transform: translateY(-4px) }
            to { opacity: 1; transform: translateY(0) }
          }
          @keyframes agentReadyText {
            from { opacity: 0; transform: translateY(6px) }
            to { opacity: 1; transform: translateY(0) }
          }
          @keyframes agentReadyRing {
            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.92) }
            50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.08) }
          }
          @keyframes sparkleOrbit0 {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) translateX(90px) }
            30% { opacity: 1 }
            100% { opacity: 0; transform: translate(-50%, -50%) rotate(180deg) translateX(110px) }
          }
          @keyframes sparkleOrbit1 {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(90deg) translateX(90px) }
            30% { opacity: 1 }
            100% { opacity: 0; transform: translate(-50%, -50%) rotate(270deg) translateX(110px) }
          }
          @keyframes sparkleOrbit2 {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(180deg) translateX(90px) }
            30% { opacity: 1 }
            100% { opacity: 0; transform: translate(-50%, -50%) rotate(360deg) translateX(110px) }
          }
          @keyframes sparkleOrbit3 {
            0% { opacity: 0; transform: translate(-50%, -50%) rotate(270deg) translateX(90px) }
            30% { opacity: 1 }
            100% { opacity: 0; transform: translate(-50%, -50%) rotate(450deg) translateX(110px) }
          }
        `}</style>
      </div>
    </div>
  );
}

function AUCreateAgentForm({
  onCancel,
  onDeploy,
  seedAgent,
  mode = 'create',
  visitCount = 0,
  onForkAgent,
}: {
  onCancel: () => void;
  onDeploy: (record?: typeof myAgents[number], openChat?: boolean) => void;
  seedAgent?: typeof myAgents[number];
  mode?: 'create' | 'live';
  visitCount?: number;
  onForkAgent?: (name: string, fork: typeof myAgents[number]) => void;
}) {
  const isLive = mode === 'live';
  const seedName = seedAgent?.name || '';
  const seedDesc = seedAgent?.desc || '';
  const seedTrigger: 'manual' | 'mention' | 'schedule' =
    seedAgent?.lastRun?.match(/d ago/) ? 'schedule' : 'manual';
  const [name, setName] = useState(seedName);
  const [instructions, setInstructions] = useState(seedDesc);
  const [trigger, setTrigger] = useState<'manual' | 'mention' | 'schedule'>(seedTrigger);
  const skillCatalog: { key: string; label: string; desc: string; icon: any; tint: string; group?: string }[] = [
    { key: 'Read Zuper jobs & contacts', label: 'Read Zuper data', desc: 'Jobs, contacts, schedules', icon: Database, tint: '#EFF6FF', group: 'Zuper core' },
    { key: 'Send branded emails', label: 'Send emails', desc: 'Drafts on-brand, sends on approval', icon: Mail, tint: '#FFF1E5', group: 'Communication' },
    { key: 'Send SMS', label: 'Send SMS', desc: 'Text customers with templates', icon: MessageSquare, tint: '#FFF1E5', group: 'Communication' },
    { key: 'Trigger workflows', label: 'Trigger workflows', desc: 'Kick off Zuper automations', icon: Zap, tint: '#FEF3C7', group: 'Automation' },
    { key: 'Schedule jobs', label: 'Schedule jobs', desc: 'Auto-create or reschedule', icon: Clock, tint: '#FEF3C7', group: 'Automation' },
    { key: 'Web search & enrichment', label: 'Web search', desc: 'Look up & enrich records', icon: Globe, tint: '#ECFDF5', group: 'Research' },
    { key: 'Summarize threads', label: 'Summarize threads', desc: 'Roll up long convos', icon: BookOpen, tint: '#ECFDF5', group: 'Research' },
    { key: 'Analyze metrics', label: 'Analyze metrics', desc: 'Spot anomalies & trends', icon: BarChart3, tint: '#EFF6FF', group: 'Insights' },
  ];
  const kbCatalog: { key: string; label: string; desc: string; icon: any; tint: string; group?: string }[] = [
    { key: 'Zuper Help Center', label: 'Help Center', desc: 'Public docs & guides', icon: BookOpen, tint: '#EFF6FF', group: 'Zuper' },
    { key: 'Internal SOPs', label: 'Internal SOPs', desc: 'Your private playbooks', icon: FileText, tint: '#FFF1E5', group: 'Internal' },
    { key: 'Customer history', label: 'Customer history', desc: 'Past tickets & calls', icon: History, tint: '#ECFDF5', group: 'Internal' },
    { key: 'Pricing book', label: 'Pricing book', desc: 'Quotes & rate cards', icon: FileText, tint: '#FFF1E5', group: 'Internal' },
    { key: 'Safety policies', label: 'Safety policies', desc: 'Crew & site checklists', icon: FileText, tint: '#FFF1E5', group: 'Internal' },
  ];

  const [skills, setSkills] = useState<Record<string, boolean>>({
    'Read Zuper jobs & contacts': true,
    'Send branded emails': false,
    'Trigger workflows': false,
    'Web search & enrichment': false,
  });
  const [kb, setKb] = useState<Record<string, boolean>>({
    'Zuper Help Center': true,
    'Internal SOPs': false,
    'Customer history': false,
  });
  const [avatarIdx, setAvatarIdx] = useState(() => {
    if (seedAgent?.img) {
      const candidates = [agentDetective, agentMarketer, agentCreator];
      const idx = candidates.findIndex((c) => c === seedAgent.img);
      if (idx >= 0) return idx;
    }
    return 0;
  });
  const [stepIdx, setStepIdx] = useState(0);
  const [input, setInput] = useState('');
  const liveRecap = isLive && seedAgent
    ? `Welcome back. Here's what I did since you last visited:\n\n• Ran ${Math.max(3, visitCount * 4)} times — no escalations\n• Handled ${Math.max(6, visitCount * 5)} ${seedAgent.category === 'Sales' ? 'leads' : seedAgent.category === 'Support' ? 'tickets' : 'items'}\n• Last action ${seedAgent.lastRun || 'just now'}\n\nWant me to keep going as I have been, or tweak something on the right?`
    : null;
  type ChatMessage = {
    from: 'agent' | 'user';
    text: string;
    summary?: { trigger: string; skillCount: number; kbCount: number };
  };
  const [messages, setMessages] = useState<ChatMessage[]>(
    isLive
      ? [{ from: 'agent', text: liveRecap || `Hi — I'm ${seedName || 'your agent'}. Ready to keep running. What would you like to do?` }]
      : [{ from: 'agent', text: "Hey, I'll help you build a new agent in 4 quick steps. Let's start — what's a good name for them?" }]
  );
  const [thinking, setThinking] = useState(false);
  const [readyOpen, setReadyOpen] = useState(false);
  const canDeploy = name.trim().length > 0 && instructions.trim().length > 0;

  const avatars = [agentDetective, agentCreator, agentMarketer, agentSupport, agentReviews, agentClassic1, agentClassic2, agentClassic3];
  const avatarTints: { tint: string; accent: string }[] = [
    { tint: 'linear-gradient(180deg, #FCE4E6 0%, #FDF1F3 100%)', accent: '#E48A98' },
    { tint: 'linear-gradient(180deg, #E3D6F1 0%, #EFE5F7 100%)', accent: '#A788CC' },
    { tint: 'linear-gradient(180deg, #DCEFE2 0%, #ECF5EF 100%)', accent: '#7DB48E' },
    { tint: 'linear-gradient(180deg, #FDE9CC 0%, #FEF4E0 100%)', accent: '#E89F5C' },
    { tint: 'linear-gradient(180deg, #DCE9F5 0%, #EAF1F8 100%)', accent: '#7DA1C9' },
    { tint: 'linear-gradient(180deg, #FEF6D6 0%, #FEFAE5 100%)', accent: '#CFA64D' },
  ];
  const avatar = avatars[avatarIdx % avatars.length];
  const avatarTint = avatarTints[avatarIdx % avatarTints.length];
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarTriggerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!avatarOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!avatarTriggerRef.current?.contains(e.target as Node)) setAvatarOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setAvatarOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [avatarOpen]);

  const steps = [
    { key: 'identity', label: 'Identity', icon: Bot, done: !!name && !!instructions },
    { key: 'trigger', label: 'Triggers', icon: Zap, done: !!trigger },
    { key: 'skills', label: 'Skills', icon: Wrench, done: Object.values(skills).some(Boolean) },
    { key: 'knowledge', label: 'Knowledge', icon: Database, done: Object.values(kb).some(Boolean) },
  ];
  const completed = steps.filter((s) => s.done).length;

  const persona = { name: name.trim() || 'New Agent', color: avatarTint.accent };

  // Infer triggers/skills/KB defaults from the instruction text
  const autoConfigure = (instr: string) => {
    const t = instr.toLowerCase();
    let inferredTrigger: 'manual' | 'mention' | 'schedule' = 'manual';
    const summaryLines: string[] = [];

    if (/daily|every day|each morning|each night|nightly|schedule|weekly|monday|monthly|7am|8am|9am/.test(t)) {
      inferredTrigger = 'schedule';
      summaryLines.push('runs on a daily schedule');
    } else if (/mention|@|when (i|someone) ask|on demand|whenever/.test(t)) {
      inferredTrigger = /mention|@/.test(t) ? 'mention' : 'manual';
      summaryLines.push(inferredTrigger === 'mention' ? 'fires on @mention' : 'runs on demand');
    } else {
      // Sensible default
      summaryLines.push('runs on demand');
    }
    setTrigger(inferredTrigger);

    const nextSkills: Record<string, boolean> = { ...skills };
    const nextKb: Record<string, boolean> = { ...kb };

    // Always read Zuper data — every agent needs context
    nextSkills['Read Zuper jobs & contacts'] = true;

    if (/email|follow.?up|nudge|remind/.test(t)) nextSkills['Send branded emails'] = true;
    if (/sms|text|message/.test(t)) nextSkills['Send SMS'] = true;
    if (/workflow|automat|kick off/.test(t)) nextSkills['Trigger workflows'] = true;
    if (/schedule|reschedule|reroute|crew/.test(t)) nextSkills['Schedule jobs'] = true;
    if (/web|search|enrich|lookup/.test(t)) nextSkills['Web search & enrichment'] = true;
    if (/summari[sz]e|thread|recap/.test(t)) nextSkills['Summarize threads'] = true;
    if (/metric|analy|trend|kpi/.test(t)) nextSkills['Analyze metrics'] = true;

    if (/support|ticket|help|customer/.test(t)) {
      nextKb['Zuper Help Center'] = true;
      nextKb['Customer history'] = true;
    }
    if (/sop|policy|playbook|procedure/.test(t)) nextKb['Internal SOPs'] = true;
    if (/quote|price|cost|invoice/.test(t)) nextKb['Pricing book'] = true;
    if (/safety|crew|site/.test(t)) nextKb['Safety policies'] = true;

    setSkills(nextSkills);
    setKb(nextKb);

    const skillCount = Object.values(nextSkills).filter(Boolean).length;
    const kbCount = Object.values(nextKb).filter(Boolean).length;
    return { inferredTrigger, summaryLines, skillCount, kbCount };
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setThinking(true);
    setTimeout(() => {
      let reply = '';
      let summary: ChatMessage['summary'] | undefined;
      if (!name) {
        const picked = text.split(' ').slice(0, 2).join(' ');
        setName(picked);
        reply = `Nice — I'll call them "${picked}". Now, in a sentence or two, what should they do?`;
      } else if (!instructions) {
        setInstructions(text);
        const cfg = autoConfigure(text);
        const trigName = cfg.inferredTrigger === 'schedule' ? 'Scheduled' : cfg.inferredTrigger === 'mention' ? '@mention' : 'On demand';
        reply = `Done — I read your instructions and set everything up. You can tweak anything on the right, or hit Deploy when you're ready.`;
        summary = { trigger: `${trigName} · ${cfg.summaryLines[0]}`, skillCount: cfg.skillCount, kbCount: cfg.kbCount };
      } else {
        const t = text.toLowerCase();
        if (t.includes('mention')) { setTrigger('mention'); reply = 'Switched to @mention. Anything else?'; }
        else if (t.includes('schedule') || t.includes('daily')) { setTrigger('schedule'); reply = 'Switched to scheduled. Anything else?'; }
        else if (t.includes('manual') || t.includes('on demand') || t.includes('ask')) { setTrigger('manual'); reply = 'Switched to on demand. Anything else?'; }
        else if (t.includes('deploy') || t.includes('ship') || t.includes('ready') || t.includes('good to go')) {
          reply = canDeploy ? `Great. Hit the Deploy button on the right whenever you're ready.` : `Add a name and instructions first — then we're good to go.`;
        }
        else reply = `Got it. Anything else to tweak, or are you good to deploy?`;
      }
      setMessages((m) => [...m, { from: 'agent', text: reply, summary }]);
      setThinking(false);
    }, 600);
  };

  const suggestions = isLive
    ? ['Show me the last 5 runs', 'Pause for the weekend', 'Switch to scheduled', 'Run now']
    : !name
    ? ['Call it Mia, Lead Concierge', "Skip — I'll type in the form"]
    : !instructions
    ? ['Draft polite quote follow-ups', 'Triage inbound support tickets', 'Watch invoices past 30 days']
    : ['Switch to @mention', 'Run daily at 7am', "I'm good to deploy"];

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <div className="relative grid grid-cols-1 lg:grid-cols-2 bg-white h-full">
      {/* MIDDLE — chat (Sense-style, no bubbles for AI) */}
      <div className="flex flex-col bg-white border-r border-[#F0F1F3] min-h-0">
        <div className="flex items-center justify-between px-8 h-14 border-b border-[#F0F1F3] flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="w-8 h-8 -ml-2 rounded-lg hover:bg-[#F3F4F6] active:scale-[0.94] flex items-center justify-center text-[#6B7280]"
              aria-label="Back"
            >
              <ChevronLeft className="w-[16px] h-[16px]" />
            </button>
            <h1 className="text-[14px] font-medium text-[#1C1E21] tracking-tight">{isLive ? `Chat with ${name || 'your agent'}` : 'Create agent'}</h1>
          </div>
          <span className="text-[12px] text-[#9CA3AF]">{isLive ? 'Tweak anything on the right' : `Step ${Math.min(completed + 1, steps.length)} of ${steps.length}`}</span>
        </div>

        <div className="flex-1 min-h-0 px-8 py-8 flex flex-col">
          <div className="max-w-[720px] mx-auto space-y-7">
            {messages.map((m, i) => (
              m.from === 'agent' ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3.5"
                >
                  {isLive ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: avatarTint.tint }}>
                      <img src={avatar} alt="" className="h-9 w-auto object-contain" draggable={false} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#FFF4ED] border border-[#FFE2D1] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Wand2 className="w-[15px] h-[15px] text-[#FD5000]" strokeWidth={2} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-[0.10em] mb-1">{isLive ? (name || 'Agent') : 'Coach'}</div>
                    <p className="text-[14.5px] text-[#1C1E21] leading-[1.65] whitespace-pre-line">{m.text}</p>
                    {m.summary && (
                      <div
                        className="mt-3 rounded-2xl bg-white border border-[#E6E8EC] overflow-hidden max-w-[460px]"
                        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 4px 14px -8px rgba(0,0,0,0.08)' }}
                      >
                        <div className="px-4 pt-3.5 pb-3 space-y-2.5">
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-[#FFF1E5] flex items-center justify-center flex-shrink-0">
                              <Zap className="w-[13px] h-[13px] text-[#E66B52]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10.5px] font-medium uppercase tracking-[0.10em] text-[#9CA3AF]">Trigger</div>
                              <div className="text-[13px] font-medium text-[#1C1E21]">{m.summary.trigger}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                              <Wrench className="w-[13px] h-[13px] text-[#2563EB]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10.5px] font-medium uppercase tracking-[0.10em] text-[#9CA3AF]">Skills</div>
                              <div className="text-[13px] font-medium text-[#1C1E21]">{m.summary.skillCount} {m.summary.skillCount === 1 ? 'skill enabled' : 'skills enabled'}</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                              <Database className="w-[13px] h-[13px] text-[#15803D]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10.5px] font-medium uppercase tracking-[0.10em] text-[#9CA3AF]">Knowledge</div>
                              <div className="text-[13px] font-medium text-[#1C1E21]">{m.summary.kbCount} {m.summary.kbCount === 1 ? 'source linked' : 'sources linked'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-[#F0F1F3] px-4 py-3 flex items-center justify-between bg-[#FAFAFB]">
                          <span className="text-[11.5px] text-[#6B7280]">Ready to ship?</span>
                          <button
                            onClick={() => canDeploy && setReadyOpen(true)}
                            disabled={!canDeploy}
                            style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1)' }}
                            className={`inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-white text-[12.5px] font-semibold active:scale-[0.97] ${canDeploy ? 'bg-[#1C1E21] hover:bg-black hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]' : 'bg-[#9CA3AF] cursor-not-allowed'}`}
                          >
                            <Play className="w-[11px] h-[11px]" fill="currentColor" />
                            Deploy agent
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex justify-end">
                  <div className="max-w-[520px] rounded-2xl rounded-br-md bg-[#EEF2FF] text-[#1C1E21] border border-[#E0E7FF] px-4 py-2.5 text-[13.5px] leading-relaxed">{m.text}</div>
                </motion.div>
              )
            ))}
            {thinking && (
              <div className="flex items-start gap-3.5">
                {isLive ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: avatarTint.tint }}>
                    <img src={avatar} alt="" className="h-9 w-auto object-contain" draggable={false} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#FFEDD5] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-[15px] h-[15px] text-[#F97316]" />
                  </div>
                )}
                <div className="flex items-center gap-2 text-[13px] text-[#9CA3AF] pt-1.5">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '240ms' }} />
                  </span>
                  thinking
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-[#F0F1F3] bg-white px-8 py-5 flex-shrink-0">
          <div className="max-w-[720px] mx-auto">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1), background-color 160ms cubic-bezier(0.23,1,0.32,1), color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                  className="inline-flex items-center px-3 h-7 rounded-full bg-[#FFF4ED] border border-[#FFE2D1] text-[12px] font-medium text-[#9C5340] hover:bg-[#FFEDDC] hover:border-[#FD5000]/40 hover:text-[#C2410C] active:scale-[0.97]"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-[#E6E8EC] bg-white focus-within:border-[#1C1E21]/30 transition">
              <div className="flex items-center gap-2 px-3.5 py-2.5">
                <button className="w-7 h-7 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]" aria-label="Attach">
                  <Plus className="w-[14px] h-[14px]" />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) { send(input.trim()); setInput(''); } }}
                  placeholder={isLive ? `Ask ${name || 'your agent'} anything…` : 'Tell Coach what to build…'}
                  className="flex-1 bg-transparent text-[13.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none"
                />
                <button
                  onClick={() => { if (input.trim()) { send(input.trim()); setInput(''); } }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${input.trim() ? 'bg-[#1C1E21] text-white hover:bg-black' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}
                  aria-label="Send"
                >
                  <ArrowUp className="w-[14px] h-[14px]" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — agent card (avatar + identity + skills + KB) */}
      <aside className="relative bg-white flex flex-col overflow-y-auto min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between px-7 h-14 border-b border-[#F0F1F3] flex-shrink-0">
          <div className="flex items-center gap-2">
            {isLive ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#ECFDF5] text-[#15803D] text-[10px] font-bold uppercase tracking-wide">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70 bg-[#10B981]" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]" />
                  </span>
                  Live
                </span>
                <span className="text-[12px] text-[#9CA3AF]">{seedAgent?.lastRun ? `Ran ${seedAgent.lastRun}` : 'Running…'}</span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#FFF4ED] text-[#C2410C] text-[10px] font-bold uppercase tracking-wide">Draft</span>
                <span className="text-[12px] text-[#9CA3AF]">Building…</span>
              </>
            )}
          </div>
          <button
            onClick={
              !canDeploy
                ? undefined
                : isLive
                  ? () => {
                      // Save in place
                      const record: typeof myAgents[number] = {
                        ...(seedAgent as typeof myAgents[number]),
                        name: name.trim(),
                        desc: instructions.trim().split('.')[0] || 'Custom agent.',
                        skills: Object.values(skills).filter(Boolean).length,
                        img: avatar,
                      };
                      onDeploy(record, false);
                    }
                  : () => setReadyOpen(true)
            }
            disabled={!canDeploy}
            className={`inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg text-white text-[12px] font-semibold transition-all ${canDeploy ? 'bg-[#1C1E21] hover:bg-black hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]' : 'bg-[#9CA3AF] cursor-not-allowed'}`}
          >
            {isLive ? <Check className="w-[11px] h-[11px]" strokeWidth={3} /> : <Play className="w-[11px] h-[11px]" fill="currentColor" />}
            {isLive ? 'Save changes' : 'Deploy'}
          </button>
        </div>

        {/* Identity strip — large avatar (click to choose) + name */}
        <div className="relative px-7 pt-7 pb-6 border-b border-[#F0F1F3]">
          <div className="absolute inset-0 pointer-events-none" style={{ background: avatarTint.tint, opacity: 0.35 }} />
          <div className="relative z-10 flex items-center gap-5">
          <div ref={avatarTriggerRef} className="relative flex-shrink-0">
            <button
              onClick={() => setAvatarOpen((v) => !v)}
              style={{
                background: avatarTint.tint,
                transition: 'transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1)',
                boxShadow: avatarOpen ? '0 0 0 3px #1C1E21' : '0 0 0 1px rgba(0,0,0,0.06)',
              }}
              className="relative w-[88px] h-[88px] rounded-full overflow-hidden active:scale-[0.96] hover:shadow-[0_0_0_2px_#1C1E21]"
              aria-label="Change avatar"
              aria-expanded={avatarOpen}
            >
              <img src={avatar} alt="" className="absolute left-1/2 -translate-x-1/2 top-1 h-[100px] w-auto object-contain" draggable={false} />
            </button>
            {/* Edit chip */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-white border border-[#E6E8EC] flex items-center justify-center pointer-events-none"
              style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
            >
              <Pencil className="w-[12px] h-[12px] text-[#1C1E21]" />
            </span>

            {avatarOpen && (
              <div
                className="absolute left-0 top-full mt-2 z-20 w-[280px] bg-white border border-[#E6E8EC] rounded-xl overflow-hidden p-3"
                style={{
                  boxShadow: '0 12px 32px -8px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.08)',
                  transformOrigin: 'top left',
                  animation: 'avatarPickerIn 200ms cubic-bezier(0.23,1,0.32,1) both',
                }}
              >
                <div className="text-[10.5px] font-medium uppercase tracking-[0.10em] text-[#9CA3AF] mb-2 px-1">Choose avatar</div>
                <div className="grid grid-cols-3 gap-2">
                  {avatarTints.map((t, i) => {
                    const a = avatars[i % avatars.length];
                    const sel = i === avatarIdx;
                    return (
                      <button
                        key={i}
                        onClick={() => { setAvatarIdx(i); setAvatarOpen(false); }}
                        style={{
                          background: t.tint,
                          transition: 'transform 160ms cubic-bezier(0.23,1,0.32,1), box-shadow 160ms cubic-bezier(0.23,1,0.32,1)',
                          boxShadow: sel ? '0 0 0 2px #1C1E21' : '0 0 0 1px rgba(0,0,0,0.06)',
                        }}
                        className="relative aspect-square rounded-full overflow-hidden active:scale-[0.94]"
                        aria-label={`Avatar ${i + 1}`}
                      >
                        <img src={a} alt="" className="absolute left-1/2 -translate-x-1/2 top-0.5 h-[110%] w-auto object-contain" draggable={false} />
                        {sel && (
                          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#1C1E21] flex items-center justify-center">
                            <Check className="w-[10px] h-[10px] text-white" strokeWidth={3} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <button
                  style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1), color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 h-8 rounded-lg border border-dashed border-[#D1D5DB] text-[11.5px] font-medium text-[#6B7280] hover:border-[#1C1E21]/40 hover:text-[#1C1E21] active:scale-[0.99]"
                >
                  <Upload className="w-[11px] h-[11px]" />
                  Upload custom
                </button>
                <style>{`@keyframes avatarPickerIn { from { opacity: 0; transform: scale(0.96) translateY(-4px) } to { opacity: 1; transform: scale(1) translateY(0) } }`}</style>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[20px] font-semibold text-[#1C1E21] leading-tight tracking-tight truncate">{persona.name}</h2>
            <p className="text-[12.5px] text-[#6B7280] mt-1 line-clamp-2">{instructions.trim().length > 0 ? instructions : 'Add a short instruction to describe what this agent does.'}</p>
          </div>
          </div>
        </div>

        {/* Step strip — quiet breadcrumb */}
        <div className="flex items-center gap-2 px-7 py-3.5 border-b border-[#F0F1F3] overflow-x-auto scrollbar-auto-hide">
          {steps.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStepIdx(i)}
              style={{ transition: 'color 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className={`relative inline-flex items-center gap-1.5 px-1 py-1.5 text-[12px] font-medium whitespace-nowrap ${
                stepIdx === i ? 'text-[#1C1E21]' : s.done ? 'text-[#15803D]' : 'text-[#9CA3AF] hover:text-[#4B5563]'
              }`}
            >
              {s.done ? <CheckCircle2 className="w-[12px] h-[12px]" /> : <span className={`w-4 h-4 rounded-full inline-flex items-center justify-center text-[9.5px] font-semibold ${stepIdx === i ? 'bg-[#1C1E21] text-white' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>{i + 1}</span>}
              {s.label}
              {stepIdx === i && <span className="absolute left-1 right-1 -bottom-px h-[2px] rounded-full bg-[#1C1E21]" />}
              {i < steps.length - 1 && <span className="text-[#D1D5DB] ml-1">·</span>}
            </button>
          ))}
        </div>

        {/* Identity — instructions only (name + avatar already up top) */}
        <div className="px-7 py-6 border-b border-[#F0F1F3]">
          <h3 className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#9CA3AF] mb-3">Identity</h3>
          <label className="block text-[12px] font-medium text-[#1C1E21] mb-1.5">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mia, Lead Concierge"
            style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1)' }}
            className="w-full px-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#C0C4CC] focus:outline-none focus:border-[#1C1E21] mb-4"
          />
          <label className="block text-[12px] font-medium text-[#1C1E21] mb-1.5">Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="What should this agent do? Tone, constraints, anything else worth knowing."
            rows={4}
            style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1)' }}
            className="w-full px-3 py-2 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] leading-relaxed placeholder:text-[#C0C4CC] focus:outline-none focus:border-[#1C1E21] resize-none"
          />
        </div>

        {/* Triggers — picker cards */}
        <div className="px-7 py-6 border-b border-[#F0F1F3]">
          <div className="flex items-baseline justify-between mb-3">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#9CA3AF]">Triggers</h3>
            <span className="text-[11.5px] text-[#9CA3AF]">choose 1</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {([
              { key: 'manual', label: 'On demand', desc: 'You ask, it runs', icon: Play, tint: '#EFF6FF' },
              { key: 'mention', label: '@mention', desc: 'Pings the agent in Zuper', icon: AtSign, tint: '#FFF1E5' },
              { key: 'schedule', label: 'Scheduled', desc: 'Daily at a set time', icon: Clock, tint: '#ECFDF5' },
            ] as const).map((t) => {
              const selected = trigger === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTrigger(t.key)}
                  style={{
                    transition: 'box-shadow 160ms cubic-bezier(0.23,1,0.32,1), background-color 160ms cubic-bezier(0.23,1,0.32,1), border-color 160ms cubic-bezier(0.23,1,0.32,1)',
                    boxShadow: selected ? '0 0 0 1px #1C1E21, 0 4px 14px -6px rgba(28,30,33,0.18)' : 'none',
                  }}
                  className={`group relative flex items-center gap-3.5 px-4 py-3 rounded-xl border text-left active:scale-[0.99] ${
                    selected ? 'border-transparent bg-[#FAFAFB]' : 'border-[#E6E8EC] bg-white hover:border-[#1C1E21]/30'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: t.tint }}>
                    <t.icon className="w-[15px] h-[15px] text-[#1C1E21]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-[#1C1E21]">{t.label}</div>
                    <div className="text-[11.5px] text-[#6B7280]">{t.desc}</div>
                  </div>
                  <span
                    className={`w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 ${selected ? 'bg-[#1C1E21]' : 'border-2 border-[#D1D5DB]'}`}
                    style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), border-color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                  >
                    {selected && <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills & Tools — selected only, dropdown picker for the rest */}
        <SelectedListSection
          label="Skills & Tools"
          count={Object.values(skills).filter(Boolean).length}
          total={skillCatalog.length}
          emptyHint="No skills yet — give the agent a way to act."
          addLabel="Add skill"
          catalog={skillCatalog}
          selectedMap={skills}
          onToggle={(k) => setSkills((st) => ({ ...st, [k]: !st[k] }))}
          items={skillCatalog.filter((s) => skills[s.key])}
          onRemove={(k) => setSkills((st) => ({ ...st, [k]: false }))}
        />

        {/* Knowledge Base — same pattern */}
        <SelectedListSection
          label="Knowledge Base"
          count={Object.values(kb).filter(Boolean).length}
          total={kbCatalog.length}
          emptyHint="No knowledge linked — the agent will only know what you tell it."
          addLabel="Link source"
          catalog={kbCatalog}
          selectedMap={kb}
          onToggle={(k) => setKb((st) => ({ ...st, [k]: !st[k] }))}
          items={kbCatalog.filter((s) => kb[s.key])}
          onRemove={(k) => setKb((st) => ({ ...st, [k]: false }))}
          noBorder
        />

      </aside>
      </div>

      <AgentReadyModal
        open={readyOpen}
        name={name.trim() || 'Your agent'}
        role="New agent"
        avatar={avatar}
        avatarTint={avatarTint.tint}
        accent={avatarTint.accent}
        primaryLabel="Chat with"
        secondaryLabel="Back to My Agents"
        onChat={() => {
          setReadyOpen(false);
          const record: typeof myAgents[number] = {
            name: name.trim(),
            desc: instructions.trim().split('.')[0] || 'Custom agent.',
            runs: 0,
            lastRun: 'just now',
            users: 1,
            rating: 5.0,
            reviews: 0,
            price: 'Free',
            skills: Object.values(skills).filter(Boolean).length,
            tools: Object.values(skills).filter(Boolean).length,
            status: 'Active',
            category: 'Operations',
            img: avatar,
          };
          onDeploy(record, true);
        }}
        onMarketplace={() => {
          setReadyOpen(false);
          const record: typeof myAgents[number] = {
            name: name.trim(),
            desc: instructions.trim().split('.')[0] || 'Custom agent.',
            runs: 0,
            lastRun: 'just now',
            users: 1,
            rating: 5.0,
            reviews: 0,
            price: 'Free',
            skills: Object.values(skills).filter(Boolean).length,
            tools: Object.values(skills).filter(Boolean).length,
            status: 'Active',
            category: 'Operations',
            img: avatar,
          };
          onDeploy(record, false);
        }}
        onClose={() => setReadyOpen(false)}
      />
    </div>
  );
}

function SelectedListSection({
  label,
  count,
  total,
  items,
  catalog,
  selectedMap,
  onToggle,
  onRemove,
  addLabel,
  emptyHint,
  noBorder,
}: {
  label: string;
  count: number;
  total: number;
  items: { key: string; label: string; desc: string; icon: any; tint: string }[];
  catalog: { key: string; label: string; desc: string; icon: any; tint: string; group?: string }[];
  selectedMap: Record<string, boolean>;
  onToggle: (key: string) => void;
  onRemove: (key: string) => void;
  addLabel: string;
  emptyHint: string;
  noBorder?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!triggerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const filtered = catalog.filter((c) =>
    !search || `${c.label} ${c.desc}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`px-6 py-5 ${noBorder ? '' : 'border-b border-[#F0F1F3]'}`}>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[11px] font-medium uppercase tracking-[0.10em] text-[#9CA3AF]">{label}</h3>
        <span className="text-[11.5px] text-[#9CA3AF] tabular-nums">{count}/{total}</span>
      </div>

      <div ref={triggerRef} className="relative">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#E6E8EC] px-3 py-4 text-center">
            <p className="text-[12px] text-[#9CA3AF] mb-2">{emptyHint}</p>
            <button
              onClick={() => { setOpen((v) => !v); setSearch(''); }}
              style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12px] font-semibold active:scale-[0.97]"
            >
              <Plus className="w-[12px] h-[12px]" />
              {addLabel}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((s) => (
              <div
                key={s.key}
                className="group flex items-center gap-3.5 px-4 py-3 rounded-xl bg-[#FAFAFB]"
                style={{ boxShadow: '0 0 0 1px #1C1E21, 0 4px 14px -6px rgba(28,30,33,0.18)' }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.tint }}>
                  <s.icon className="w-[14px] h-[14px] text-[#1C1E21]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold text-[#1C1E21] leading-tight truncate">{s.label}</div>
                  <div className="text-[11px] text-[#6B7280] truncate">{s.desc}</div>
                </div>
                <span className="w-[18px] h-[18px] rounded-full bg-[#1C1E21] flex items-center justify-center flex-shrink-0 group-hover:hidden">
                  <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                </span>
                <button
                  onClick={() => onRemove(s.key)}
                  style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                  className="hidden group-hover:flex w-[18px] h-[18px] rounded-full bg-[#1C1E21] text-white items-center justify-center"
                  aria-label={`Remove ${s.label}`}
                >
                  <X className="w-[11px] h-[11px]" strokeWidth={3} />
                </button>
              </div>
            ))}
            <button
              onClick={() => { setOpen((v) => !v); setSearch(''); }}
              style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1), color 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-dashed border-[#D1D5DB] text-[12.5px] font-medium text-[#6B7280] hover:border-[#1C1E21]/40 hover:text-[#1C1E21] active:scale-[0.99]"
            >
              <Plus className="w-[13px] h-[13px]" />
              {addLabel}
            </button>
          </div>
        )}

        {open && (
          <div
            className="absolute left-0 right-0 top-full mt-2 z-20 bg-white border border-[#E6E8EC] rounded-xl overflow-hidden"
            style={{
              boxShadow: '0 12px 32px -8px rgba(0,0,0,0.18), 0 4px 12px -4px rgba(0,0,0,0.08)',
              transformOrigin: 'top center',
              animation: 'dropdownIn 200ms cubic-bezier(0.23,1,0.32,1) both',
            }}
          >
            <div className="px-3 py-2 border-b border-[#F0F1F3]">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-[#9CA3AF]" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1)' }}
                  className="w-full pl-8 pr-2 h-8 rounded-md bg-white border border-transparent text-[13px] text-[#1C1E21] placeholder:text-[#C0C4CC] focus:outline-none focus:border-[#E6E8EC]"
                />
              </div>
            </div>
            <div className="max-h-[280px] overflow-y-auto py-1.5">
              {filtered.length === 0 && (
                <div className="px-3 py-6 text-center text-[12px] text-[#9CA3AF]">Nothing matches "{search}".</div>
              )}
              {filtered.map((s) => {
                const sel = !!selectedMap[s.key];
                return (
                  <button
                    key={s.key}
                    onClick={() => onToggle(s.key)}
                    style={{ transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)' }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#FAFAFB] text-left"
                  >
                    <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: s.tint }}>
                      <s.icon className="w-[13px] h-[13px] text-[#1C1E21]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-[#1C1E21] leading-tight truncate">{s.label}</div>
                      <div className="text-[11px] text-[#9CA3AF] truncate">{s.desc}</div>
                    </div>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${sel ? 'bg-[#1C1E21]' : 'border border-[#D1D5DB]'}`}
                      style={{ transition: 'background-color 120ms cubic-bezier(0.23,1,0.32,1)' }}
                    >
                      {sel && <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <style>{`@keyframes dropdownIn { from { opacity: 0; transform: scale(0.96) translateY(-4px) } to { opacity: 1; transform: scale(1) translateY(0) } }`}</style>
          </div>
        )}
      </div>
    </div>
  );
}

function AUMyAgentsView({ onEnterMarketplace, onOpenAgent, customAgents = [], onAddCustomAgent }: { onEnterMarketplace?: () => void; onOpenAgent?: (name: string) => void; customAgents?: typeof myAgents; onAddCustomAgent?: (a: typeof myAgents[number]) => void }) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'All' | AgentStatus>('All');
  const [pricingFilter, setPricingFilter] = useState<'All' | 'Free' | 'Paid'>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | AgentCategory>('All');
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [firstTime, setFirstTime] = useState(true);
  const hasCustom = customAgents.length > 0;
  const isEmpty = firstTime && !hasCustom;
  const visibleCount = isEmpty ? 0 : Math.min(6, customAgents.length + 6);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  if (creating) {
    return (
      <>
        <AUCreateAgentForm
          onCancel={() => setCreating(false)}
          onDeploy={(record, openChat) => {
            setCreating(false);
            setFirstTime(false);
            if (record) {
              onAddCustomAgent?.(record);
              if (openChat) {
                // Defer to next tick so the parent has the agent in state before opening
                setTimeout(() => onOpenAgent?.(record.name), 0);
              }
            }
            showToast('Agent deployed successfully');
          }}
        />
        <Toast message={toast} />
      </>
    );
  }

  const filtered = myAgents.filter((a) => {
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (pricingFilter === 'Free' && a.price !== 'Free') return false;
    if (pricingFilter === 'Paid' && a.price === 'Free') return false;
    if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const marketplaceBanner = (
    <div
      className="relative"
      style={{
        borderRadius: 18,
        padding: '20px 28px',
        minHeight: 150,
        background: 'linear-gradient(135deg, #FFF0E2 0%, #FFE8D4 22%, #FFD9C2 50%, #FFE0CC 78%, #FFEEDB 100%)',
        border: '1px solid rgba(255, 120, 80, 0.18)',
      }}
    >
        {/* Bg layers clipped to banner */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ borderRadius: 18, zIndex: 1 }}>
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auMpDots" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#B8410E" opacity="0.22" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auMpDots)" />
          </svg>
          <div className="absolute" style={{ top: -40, left: -20, width: 220, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #FFFAF3 0%, #FFF1E5 50%, transparent 75%)', opacity: 0.85, filter: 'blur(20px)' }} />
          <div className="absolute" style={{ bottom: -60, left: -50, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, #FFD089 0%, #FFC56B 40%, transparent 72%)', opacity: 0.5, filter: 'blur(32px)' }} />
          <div className="absolute" style={{ bottom: -80, left: '18%', width: 460, height: 380, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, #FFB5A0 0%, #FF9E8E 35%, #FFAFA0 60%, transparent 78%)', opacity: 0.55, filter: 'blur(40px)' }} />
          <div className="absolute" style={{ top: -80, right: -160, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle at 35% 40%, #FFB68C 0%, #FF9968 35%, #FF8455 55%, transparent 75%)', opacity: 0.55, filter: 'blur(44px)' }} />
        </div>

        <div className="relative flex items-center justify-between gap-6" style={{ zIndex: 10 }}>
          <div className="flex-1 max-w-[600px]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3" style={{ background: 'linear-gradient(135deg, #F8A88B 0%, #F08465 100%)' }}>
              <Sparkles className="w-[11px] h-[11px] text-white" fill="currentColor" />
              <span className="text-[10.5px] font-semibold tracking-[0.10em] uppercase text-white">Sense Agents Marketplace</span>
            </div>
            <h2 className="text-[22px] font-semibold tracking-tight leading-[1.15] mb-2">
              <span className="text-[#1C1E21]">Hire pre-built agents.</span>{' '}
              <span style={{ color: '#E66B52' }}>Ship in minutes, not weeks.</span>
            </h2>
            <p className="text-[12.5px] text-[#1C1E21] leading-relaxed mb-3 max-w-[520px]">
              <span className="font-semibold">Sense Agents</span> are autonomous teammates that run inside Zuper.
            </p>
            <div className="flex items-center gap-3 text-[11.5px] text-[#1C1E21] mb-4 flex-wrap">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span><span className="font-semibold">13+ agents</span> available</span>
              </span>
              <span className="text-[#C9B0A0]">·</span>
              <span><span className="font-semibold">Free</span> starter agents</span>
              <span className="text-[#C9B0A0]">·</span>
              <span>Deploys in <span className="font-semibold">under 24h</span></span>
            </div>
            <button
              onClick={onEnterMarketplace}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12.5px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
            >
              Enter Marketplace
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="hidden md:flex items-end -space-x-16 flex-shrink-0 self-end" style={{ height: 150 }}>
            <img
              src={agentMarketer}
              alt=""
              className="relative h-[170px] w-auto object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.16)]"
              style={{ marginBottom: -20, zIndex: 11 }}
              draggable={false}
            />
            <img
              src={agentSupport}
              alt=""
              className="relative h-[200px] w-auto object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.18)]"
              style={{ marginBottom: -20, zIndex: 13 }}
              draggable={false}
            />
            <img
              src={agentReviews}
              alt=""
              className="relative h-[180px] w-auto object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.16)]"
              style={{ marginBottom: -20, zIndex: 12 }}
              draggable={false}
            />
          </div>
        </div>
      </div>
  );

  const marketplaceBannerCompact = (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: 14,
        background: 'linear-gradient(135deg, #FFF0E2 0%, #FFE8D4 35%, #FFE0CC 70%, #FFEEDB 100%)',
        border: '1px solid rgba(255, 120, 80, 0.22)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.4 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="auMpDotsCompact" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#B8410E" opacity="0.18" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#auMpDotsCompact)" />
        </svg>
        <div className="absolute" style={{ top: -40, right: -60, width: 240, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #FFB68C 0%, #FF9968 45%, transparent 75%)', opacity: 0.45, filter: 'blur(30px)' }} />
        <div className="absolute" style={{ bottom: -60, left: -40, width: 240, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #FFD089 0%, transparent 70%)', opacity: 0.4, filter: 'blur(28px)' }} />
      </div>

      <div className="relative flex items-center justify-between gap-4 px-5 py-4" style={{ zIndex: 10 }}>
        <div className="flex items-center gap-3.5 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #F8A88B 0%, #F08465 100%)',
              boxShadow: '0 4px 10px -4px rgba(232, 108, 80, 0.45)',
            }}
          >
            <Sparkles className="w-[18px] h-[18px] text-white" fill="currentColor" />
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <h3 className="text-[14.5px] font-semibold tracking-tight text-[#1C1E21] leading-none">
              Sense Agents Marketplace
            </h3>
            <span className="px-1.5 py-0.5 rounded bg-white/70 text-[#B8410E] text-[9.5px] font-bold tracking-wide uppercase">New</span>
          </div>
        </div>
        <button
          onClick={onEnterMarketplace}
          className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12.5px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] flex-shrink-0"
        >
          Enter Marketplace
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isEmpty && <div className="mb-8">{marketplaceBanner}</div>}

      {/* My Agents header + search + create */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Bot className="w-[18px] h-[18px] text-[#6B7280]" />
            <h1 className="text-[22px] font-semibold text-[#1C1E21] tracking-tight">My Agents</h1>
            {!isEmpty && <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{visibleCount}</span>}
          </div>
          <p className="text-[13px] text-[#6B7280]">Manage and monitor your deployed AI agents.</p>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#9CA3AF]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agents…"
                className="w-full pl-9 pr-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1C1E21]/30 transition"
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Create Agent
            </button>
          </div>
        )}
      </div>


      {isEmpty ? (
        <div className="relative flex flex-col items-center text-center pt-16 pb-16">
          {/* Soft halo */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 520,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(255,180,140,0.22) 0%, rgba(255,180,140,0.10) 40%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Toolkit illustration — click to populate agents */}
          <motion.img
            src={emptyToolkit}
            alt=""
            onClick={() => setFirstTime(false)}
            title="Populate with starter agents"
            className="relative h-[110px] w-auto object-contain mx-auto mb-4 drop-shadow-[0_12px_20px_rgba(0,0,0,0.10)] cursor-pointer hover:scale-105 transition-transform duration-200"
            initial={{ y: 16, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32 }}
            className="relative"
          >
            <h2 className="text-[22px] font-semibold text-[#1C1E21] tracking-tight mb-2">Build your AI workforce</h2>
            <p className="text-[13.5px] text-[#6B7280] max-w-[440px] mx-auto leading-relaxed mb-6">
              Create your first Sense Agent — an autonomous teammate that plugs into Zuper and handles work in the background.
            </p>

            <button
              onClick={() => setCreating(true)}
              className="inline-flex items-center gap-1.5 px-5 h-10 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Create Agent
            </button>
          </motion.div>
        </div>
      ) : view === 'grid' ? (
        (() => {
            const seedAgents = filtered.slice(0, 6).map((a, i) => ({ ...a, runs: [7, 4, 9, 12, 5, 18][i] ?? a.runs }));
            const gridAgents = [...customAgents, ...seedAgents].slice(0, 6);
            return (
              <>
                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 pt-3">
                  {gridAgents.map((a) => (
                    <AUAgentCardCompact key={a.name} agent={a} onOpen={() => onOpenAgent?.(a.name)} />
                  ))}
                  <CreateAgentCard layout="grid" />
                </div>
                <div className="mt-6">
                  {marketplaceBannerCompact}
                </div>
              </>
            );
          })()
        ) : (
          <div className="space-y-3">
            {filtered.map((a, i) => (
              <AgentCard key={a.name} agent={a} tone={tones[i % tones.length]} layout={view} />
            ))}
            <CreateAgentCard layout={view} />
          </div>
      )}
      <Toast message={toast} />
    </>
  );
}

function AUAgentCardCompact({ agent, onOpen }: { agent: typeof myAgents[number]; onOpen?: () => void }) {
  const status = agent.status;
  const statusStyle = statusStyles[status];
  const tint = categoryTint[agent.category] || { tint: 'linear-gradient(180deg, #FCE4E6 0%, #FDF1F3 100%)', accent: '#E48A98' };

  return (
    <div
      onClick={onOpen}
      className="group relative rounded-xl border border-[#E6E8EC] transition-all duration-300 ease-out cursor-pointer overflow-hidden flex flex-col hover:-translate-y-1"
      style={{
        // Hover styles applied dynamically via Tailwind arbitrary not possible for accent — use inline + group-hover override below
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 18px 38px -16px rgba(0,0,0,0.14), 0 0 0 3px ${tint.accent}22, 0 0 14px ${tint.accent}33`;
        e.currentTarget.style.borderColor = `${tint.accent}66`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = '';
      }}
    >
      {/* Tinted top area with avatar */}
      <div className="relative flex items-end justify-center overflow-hidden pt-6" style={{ background: tint.tint, height: 200 }}>
        <img
          src={agent.img || agentDetective}
          alt={agent.name}
          className="h-[170px] w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.10)] transition-transform duration-400 ease-out group-hover:-translate-y-1 group-hover:scale-[1.06]"
          draggable={false}
        />
      </div>

      {/* Bottom info block — name + status + 2-line description */}
      <div className="bg-white px-4 pt-4 pb-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[13.5px] font-semibold text-[#1C1E21] leading-none truncate flex-1">{agent.name}</h3>
          <span
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] font-bold tracking-wide uppercase flex-shrink-0"
            style={{ background: statusStyle.bg, color: statusStyle.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusStyle.dot }} />
            {status}
          </span>
        </div>
        <p
          className="text-[11.5px] text-[#6B7280] leading-snug overflow-hidden"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {agent.desc}
        </p>
      </div>
    </div>
  );
}

function AUAgentDetailView({
  agent,
  visitCount = 0,
  onBack,
  onUpdateAgent,
  onForkAgent,
}: {
  agent: typeof myAgents[number];
  visitCount?: number;
  onBack: () => void;
  onUpdateAgent?: (name: string, patch: Partial<typeof myAgents[number]>) => void;
  onForkAgent?: (name: string, fork: typeof myAgents[number]) => void;
}) {
  const persona = hiredPersonas[agent.name] || { name: agent.name.replace(' Agent', '').split(' — ')[0], pronouns: 'it/its' };
  const tint = categoryTint[agent.category] || { tint: 'linear-gradient(180deg, #FCE4E6 0%, #FDF1F3 100%)', accent: '#E48A98' };
  const statusStyle = statusStyles[agent.status];
  const outcome = hiredOutcomes[agent.name] || `${persona.name} keeps the work running quietly in the background.`;
  const quote = hiredQuotes[agent.name] || 'I plug into your Zuper workspace and quietly handle the work so your team can focus on customers.';
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'brain' | 'activity'>('brain');
  const [editedStatus, setEditedStatus] = useState<AgentStatus>(agent.status);
  const isDirty = editedStatus !== agent.status;
  const isReturning = visitCount > 1;

  const skills = [
    { icon: Wrench, label: 'Read Zuper jobs & contacts' },
    { icon: Mail, label: 'Send branded emails' },
    { icon: Webhook, label: 'Trigger workflows' },
    { icon: Globe, label: 'Web search & enrichment' },
  ].slice(0, Math.max(2, agent.skills));

  const triggers = [
    { icon: Play, label: 'Run now', desc: 'Manual trigger from chat' },
    { icon: AtSign, label: `Mention @${persona.name}`, desc: 'In Zuper comments or updates' },
    { icon: Clock, label: 'Daily at 7:00 AM', desc: 'Scheduled run' },
  ];

  return (
    <div className="relative flex flex-col h-full w-full bg-[#FAFAFB]">
      {/* Top header */}
      <div className="flex items-center justify-between px-5 h-14 bg-white border-b border-[#E6E8EC] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] transition"
            aria-label="Back"
          >
            <ChevronLeft className="w-[18px] h-[18px]" />
          </button>
          <div
            className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
            style={{ background: tint.tint }}
          >
            <img src={agent.img || agentDetective} alt="" className="h-7 w-auto object-contain" draggable={false} />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-[#1C1E21]">{persona.name}, {agent.name.replace(' Agent', '')}</h1>
            <span className="px-1.5 py-0.5 rounded-md bg-[#F3F4F6] text-[#4B5563] text-[10px] font-semibold uppercase tracking-wide">Beta</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditedStatus((s) => s === 'Active' ? 'Paused' : 'Active')}
            className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12.5px] font-semibold transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
          >
            {editedStatus === 'Active' ? 'Pause' : 'Activate'}
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] transition" aria-label="More">
            <MoreHorizontal className="w-[16px] h-[16px]" />
          </button>
          <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] transition" aria-label="Close">
            <X className="w-[16px] h-[16px]" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center: Chat */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-8 pt-6 pb-3 flex items-center justify-between border-b border-[#F0F1F3]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF] mb-0.5">Conversation</div>
              <h2 className="text-[16px] font-semibold text-[#1C1E21]">Chat with {persona.name}</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] transition" aria-label="History">
                <History className="w-[15px] h-[15px]" />
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280] transition" aria-label="New chat">
                <Pencil className="w-[14px] h-[14px]" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-6">
            {isReturning && (
              <div className="flex items-start gap-3 mb-6">
                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: tint.tint }}>
                  <img src={agent.img || agentDetective} alt="" className="h-8 w-auto object-contain" draggable={false} />
                </div>
                <div className="max-w-[560px]">
                  <div className="text-[12px] font-semibold text-[#1C1E21] mb-1">{persona.name}</div>
                  <div className="rounded-2xl rounded-tl-md bg-[#F8F9FB] border border-[#F0F1F3] px-4 py-3 text-[13.5px] text-[#1C1E21] leading-relaxed">
                    Welcome back. Since you last visited:
                  </div>
                  <div className="mt-2 rounded-xl bg-white border border-[#E6E8EC] px-4 py-3 text-[12.5px] text-[#1C1E21] leading-relaxed">
                    <ul className="space-y-1.5">
                      <li className="flex items-baseline gap-2">
                        <CheckCircle2 className="w-[12px] h-[12px] text-[#10B981] flex-shrink-0 translate-y-0.5" />
                        Ran <span className="font-semibold tabular-nums">{Math.max(1, visitCount * 3)}</span> times — no escalations
                      </li>
                      <li className="flex items-baseline gap-2">
                        <CheckCircle2 className="w-[12px] h-[12px] text-[#10B981] flex-shrink-0 translate-y-0.5" />
                        Processed <span className="font-semibold tabular-nums">{Math.max(2, visitCount * 4)}</span> {agent.category === 'Sales' ? 'leads' : agent.category === 'Support' ? 'tickets' : 'items'} on your behalf
                      </li>
                      <li className="flex items-baseline gap-2">
                        <Clock className="w-[12px] h-[12px] text-[#9CA3AF] flex-shrink-0 translate-y-0.5" />
                        Last action <span className="font-medium">{agent.lastRun || '8m ago'}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Greeting */}
            <div className="flex items-start gap-3 mb-6">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: tint.tint }}>
                <img src={agent.img || agentDetective} alt="" className="h-8 w-auto object-contain" draggable={false} />
              </div>
              <div className="max-w-[560px]">
                <div className="text-[12px] font-semibold text-[#1C1E21] mb-1">{persona.name}</div>
                <div className="rounded-2xl rounded-tl-md bg-[#F8F9FB] border border-[#F0F1F3] px-4 py-3 text-[13.5px] text-[#1C1E21] leading-relaxed">
                  {isReturning ? `Anything to tweak, or want me to keep going as I have been?` : `Hi — I'm ${persona.name}. ${outcome} Want me to run now, or ask me something?`}
                </div>
              </div>
            </div>

            {/* User message */}
            <div className="flex justify-end mb-6">
              <button className="px-3.5 py-2 rounded-2xl rounded-br-md bg-[#1C1E21] text-white text-[13px] font-medium shadow-[0_2px_6px_rgba(28,30,33,0.18)]">
                Run now
              </button>
            </div>

            {/* Thinking */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: tint.tint }}>
                <img src={agent.img || agentDetective} alt="" className="h-8 w-auto object-contain" draggable={false} />
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-md bg-[#F8F9FB] border border-[#F0F1F3] px-4 py-3 text-[13px] text-[#6B7280]">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '120ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '240ms' }} />
                </span>
                Thinking…
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="px-8 pb-6">
            <div className="rounded-2xl border border-[#E6E8EC] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-within:border-[#1C1E21]/30 transition">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${persona.name}…`}
                rows={2}
                className="w-full resize-none bg-transparent px-4 pt-3 pb-1 text-[13.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none"
              />
              <div className="flex items-center justify-between px-3 pb-2">
                <button className="w-7 h-7 rounded-full hover:bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]" aria-label="Attach">
                  <Plus className="w-[15px] h-[15px]" />
                </button>
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${input.trim() ? 'bg-[#1C1E21] text-white hover:bg-black' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}
                  aria-label="Send"
                >
                  <ArrowUp className="w-[15px] h-[15px]" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — blends with chat */}
        <aside className="w-[440px] flex-shrink-0 bg-white overflow-y-auto" style={{ boxShadow: 'inset 1px 0 0 #F0F1F3' }}>
          {/* Agent card — minimal & fancy */}
          <div className="px-5 pt-5 pb-2">
            <div
              className="relative rounded-[20px] overflow-hidden"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${tint.accent}26 0%, ${tint.accent}10 35%, #FFFFFF 75%)`,
                border: `1px solid ${tint.accent}26`,
                boxShadow: `0 24px 50px -24px ${tint.accent}55, 0 4px 12px -4px rgba(0,0,0,0.06)`,
              }}
            >
              {/* Decorative soft halo behind avatar */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: 30,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 240,
                  height: 240,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${tint.accent}30 0%, transparent 65%)`,
                  filter: 'blur(8px)',
                }}
              />

              {/* Status pill — animated */}
              <div
                className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.06em] uppercase bg-white/95 backdrop-blur z-10"
                style={{ color: statusStyle.color }}
              >
                <span className="relative flex h-2 w-2">
                  {agent.status === 'Active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: statusStyle.dot }} />}
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: statusStyle.dot }} />
                </span>
                {agent.status}
              </div>

              {/* Pricing pill */}
              <div className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold tracking-tight bg-white/95 backdrop-blur text-[#1C1E21] z-10">
                {agent.price === 'Free' && <Sparkles className="w-[10px] h-[10px] text-[#F59E0B]" fill="#F59E0B" />}
                {agent.price}
              </div>

              {/* Avatar — large, dramatic */}
              <div className="relative flex items-end justify-center pt-10" style={{ height: 290 }}>
                <img
                  src={agent.img || agentDetective}
                  alt=""
                  className="relative h-[280px] w-auto object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.18)]"
                  style={{ marginBottom: -8 }}
                  draggable={false}
                />
              </div>

              {/* Body — minimal */}
              <div className="relative px-5 pt-3 pb-5 text-center">
                <h3 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight leading-none mb-1.5">{persona.name}</h3>
                <div className="inline-flex items-center gap-1.5 text-[12.5px] text-[#6B7280]">
                  <span>{agent.name.replace(' Agent', '')}</span>
                  <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                  <span className="inline-flex items-center gap-1">
                    <Star className="w-[11px] h-[11px] text-[#F59E0B]" fill="#F59E0B" />
                    <span className="font-medium text-[#4B5563]">{agent.rating}</span>
                  </span>
                </div>

                {/* Quote */}
                <p className="text-[13px] text-[#4B5563] leading-relaxed italic mt-3.5 mb-4 px-1">
                  "{quote}"
                </p>

                {/* CTA */}
                <button
                  className="group/cta w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-xl text-white text-[13px] font-semibold transition-all duration-200 hover:translate-y-[-1px]"
                  style={{
                    background: `linear-gradient(135deg, ${tint.accent} 0%, #1C1E21 100%)`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 6px 16px -4px ${tint.accent}66`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}
                >
                  <Sparkles className="w-[13px] h-[13px]" fill="currentColor" />
                  Try {persona.name} now
                  <ArrowRight className="w-[13px] h-[13px] transition-transform group-hover/cta:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4">
            <div className="flex items-center gap-4 border-b border-[#E6E8EC]">
              <button
                onClick={() => setActiveTab('brain')}
                className={`relative pb-2.5 text-[13px] font-semibold transition ${activeTab === 'brain' ? 'text-[#1C1E21]' : 'text-[#9CA3AF] hover:text-[#4B5563]'}`}
              >
                Brain
                {activeTab === 'brain' && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#1C1E21] rounded-full" />}
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`relative pb-2.5 text-[13px] font-semibold transition ${activeTab === 'activity' ? 'text-[#1C1E21]' : 'text-[#9CA3AF] hover:text-[#4B5563]'}`}
              >
                Activity
                {activeTab === 'activity' && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#1C1E21] rounded-full" />}
              </button>
            </div>
          </div>

          {activeTab === 'brain' ? (
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Description */}
              <DetailBlock title="Description" icon={Info}>
                <p className="text-[12.5px] text-[#4B5563] leading-relaxed">{agent.desc}</p>
              </DetailBlock>

              {/* Metrics */}
              <DetailBlock title="Metrics" icon={BarChart2}>
                <div className="grid grid-cols-2 gap-2">
                  <Metric label="Runs" value={agent.runs.toLocaleString()} />
                  <Metric label="Users" value={String(agent.users)} />
                  <Metric label="Rating" value={`${agent.rating}★`} sub={`${agent.reviews} reviews`} />
                  <Metric label="Last run" value={agent.lastRun || '—'} />
                </div>
              </DetailBlock>

              {/* Triggers */}
              <DetailBlock title="Triggers" icon={Zap}>
                <div className="space-y-1.5">
                  {triggers.map((t) => (
                    <div key={t.label} className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg bg-white border border-[#F0F1F3]">
                      <div className="w-7 h-7 rounded-md bg-[#F8F9FB] flex items-center justify-center flex-shrink-0">
                        <t.icon className="w-[13px] h-[13px] text-[#4B5563]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-medium text-[#1C1E21] leading-tight">{t.label}</div>
                        <div className="text-[11px] text-[#9CA3AF] mt-0.5">{t.desc}</div>
                      </div>
                    </div>
                  ))}
                  <button className="w-full mt-1 inline-flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition">
                    <Plus className="w-[12px] h-[12px]" />
                    Add trigger
                  </button>
                </div>
              </DetailBlock>

              {/* Skills */}
              <DetailBlock title="Skills" icon={Wrench}>
                <div className="space-y-1.5">
                  {skills.map((s) => (
                    <div key={s.label} className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-white border border-[#F0F1F3]">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: tint.tint }}>
                        <s.icon className="w-[13px] h-[13px]" style={{ color: tint.accent }} />
                      </div>
                      <span className="text-[12.5px] font-medium text-[#1C1E21]">{s.label}</span>
                      <CheckCircle2 className="w-[13px] h-[13px] text-[#10B981] ml-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </DetailBlock>
            </div>
          ) : (
            <div className="px-4 pt-4 pb-6 space-y-2">
              {[
                { when: '2m ago', task: 'Scheduled run', status: 'Completed', tokens: '4.2k' },
                { when: '1h ago', task: 'Manual run', status: 'Completed', tokens: '3.8k' },
                { when: '4h ago', task: 'Scheduled run', status: 'Completed', tokens: '5.1k' },
                { when: '1d ago', task: 'Triggered by @mention', status: 'Completed', tokens: '2.4k' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white border border-[#F0F1F3]">
                  <div className="w-7 h-7 rounded-md bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-[13px] h-[13px] text-[#10B981]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] font-medium text-[#1C1E21] truncate">{r.task}</div>
                    <div className="text-[11px] text-[#9CA3AF]">{r.when} · {r.tokens} tokens</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {isDirty && (
        <div
          className="absolute left-1/2 bottom-6 -translate-x-1/2 z-40 inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1C1E21] text-white"
          style={{
            boxShadow: '0 16px 40px -12px rgba(0,0,0,0.30), 0 6px 16px -6px rgba(0,0,0,0.18)',
            animation: 'saveBarIn 280ms cubic-bezier(0.23,1,0.32,1) both',
          }}
        >
          <span className="text-[12.5px] font-medium pl-1">You changed {persona.name} to <span className="font-semibold">{editedStatus}</span>.</span>
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={() => setEditedStatus(agent.status)}
              style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="px-3 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/10 text-[12.5px] font-medium active:scale-[0.97]"
            >
              Discard
            </button>
            <button
              onClick={() => {
                const forkName = `${agent.name.split(' — ')[0]} (copy)`;
                onForkAgent?.(agent.name, { ...agent, name: forkName, status: editedStatus });
              }}
              style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="px-3 h-8 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[12.5px] font-medium active:scale-[0.97]"
            >
              Save as new agent
            </button>
            <button
              onClick={() => { onUpdateAgent?.(agent.name, { status: editedStatus }); }}
              style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-white text-[#1C1E21] text-[12.5px] font-semibold active:scale-[0.97]"
            >
              <Check className="w-[12px] h-[12px]" strokeWidth={3} />
              Save changes
            </button>
          </div>
          <style>{`@keyframes saveBarIn { from { opacity: 0; transform: translate(-50%, 12px) } to { opacity: 1; transform: translate(-50%, 0) } }`}</style>
        </div>
      )}
    </div>
  );
}

function DetailBlock({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
        <Icon className="w-[12px] h-[12px]" />
        {title}
      </div>
      {children}
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-3 py-2.5 rounded-lg bg-white border border-[#F0F1F3]">
      <div className="text-[10px] uppercase tracking-[0.1em] text-[#9CA3AF] font-semibold mb-0.5">{label}</div>
      <div className="text-[15px] font-semibold text-[#1C1E21] tabular-nums leading-tight">{value}</div>
      {sub && <div className="text-[10.5px] text-[#9CA3AF] mt-0.5">{sub}</div>}
    </div>
  );
}

function TryAgentView({ agent, onBack, onHire, onChatWith }: { agent: typeof catalogItems[number]; onBack: () => void; onHire?: (a: typeof myAgents[number]) => void; onChatWith?: (name: string) => void }) {
  const persona = catalogPersonas[agent.title] || hiredPersonas[agent.title] || { name: agent.title.split(' ')[0], pronouns: 'it/its' };
  const rL = agent.role.toLowerCase();
  const catKey: keyof typeof categoryTint =
    /sales|closer/.test(rL) ? 'Sales' :
    /operations/.test(rL) ? 'Operations' :
    /customer|support/.test(rL) ? 'Support' :
    /finance|collection/.test(rL) ? 'Finance' :
    /field|coordinator/.test(rL) ? 'Compliance' :
    'Sales';
  const tint = categoryTint[catKey];
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'agent' | 'user'; text: string; rich?: string }[]>([
    { from: 'agent', text: `Hey — I'm ${persona.name}. ${catalogOutcomes[agent.title] || agent.desc} Ask me anything below, or pick one of those quick prompts.` },
  ]);
  const [sending, setSending] = useState(false);
  const [hiredOpen, setHiredOpen] = useState(false);

  const price = agent.featured ? 'Free' : '$12/mo';
  const saves = agent.saves.replace('Saves ', '');
  const tools = ['Zuper', 'Gmail', 'Slack', 'Webhooks'];
  const capabilities = [
    { icon: Wrench, title: 'Reads your Zuper data', desc: 'Jobs, contacts, schedules, invoices — all in context.' },
    { icon: Zap, title: 'Triggers automatically', desc: 'Schedules, mentions, webhooks. I show up exactly when needed.' },
    { icon: Mail, title: 'Sends on-brand replies', desc: 'Drafts emails and SMS in your voice. Sends only when you approve.' },
  ];
  const suggestions = [
    'What exactly do you do?',
    'How long is setup?',
    'What tools do you connect to?',
    'Show me a sample run',
  ];
  const richReplies: Record<string, { text: string; rich?: string }> = {
    'What exactly do you do?': {
      text: `${catalogPitches[agent.title]?.body || agent.desc} I run on autopilot and only ping you when there's a real decision to make.`,
    },
    'How long is setup?': {
      text: 'Under 24 hours. You connect your Zuper workspace, I sample real data, then I propose how I should run — no code, no migrations.',
      rich: '1. Connect (2 min)  →  2. Sample run on real data (4–6h)  →  3. Approve & go live',
    },
    'What tools do you connect to?': {
      text: `Out of the box I plug into ${tools.join(', ')}. Need something else? Tell me and I'll add it before launch.`,
    },
    'Show me a sample run': {
      text: 'Here\'s what my last 24h looked like:',
      rich: `• ${agent.hires} customers using me today\n• ${saves} of work taken off plate\n• 0 missed escalations`,
    },
  };

  const ask = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { from: 'user', text: q }]);
    setSending(true);
    setTimeout(() => {
      const r = richReplies[q] || { text: `Great question. ${catalogOutcomes[agent.title] || agent.desc}` };
      setMessages((m) => [...m, { from: 'agent', text: r.text, rich: r.rich }]);
      setSending(false);
    }, 700);
  };

  return (
    <div className="flex h-full w-full bg-white">
      {/* AI Studio left sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E6E8EC] flex flex-col">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-[#F0F1F3]">
          <div className="w-7 h-7 rounded-md bg-[#FFF4ED] border border-[#FFE2D1] flex items-center justify-center">
            <Wand2 className="w-[15px] h-[15px] text-[#FD5000]" strokeWidth={2} />
          </div>
          <h1 className="text-[16px] font-semibold text-[#1C1E21] tracking-tight">AI Studio</h1>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          <button onClick={onBack} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21] transition">
            <LayoutGrid className="w-[15px] h-[15px] text-[#6B7280]" />
            <span className="flex-1 text-left">Overview</span>
          </button>
          <div>
            <div className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#1C1E21]">
              <Bot className="w-[15px] h-[15px] text-[#6B7280]" />
              <span className="flex-1 text-left">Agent</span>
              <ChevronDown className="w-[14px] h-[14px] text-[#9CA3AF]" />
            </div>
            <div className="ml-7 space-y-0.5 mt-0.5">
              <button onClick={onBack} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#6B7280] hover:bg-[#F8F9FB] hover:text-[#1C1E21] transition">
                <span className="flex-1 text-left">My agents</span>
              </button>
              <button onClick={onBack} className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium bg-[#EFF6FF] text-[#2563EB] transition">
                <span className="flex-1 text-left">Marketplace</span>
              </button>
            </div>
          </div>
          <button onClick={onBack} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21] transition">
            <Zap className="w-[15px] h-[15px] text-[#6B7280]" />
            <span className="flex-1 text-left">Skills</span>
          </button>
          <button onClick={onBack} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#4B5563] hover:bg-[#F8F9FB] hover:text-[#1C1E21] transition">
            <Database className="w-[15px] h-[15px] text-[#6B7280]" />
            <span className="flex-1 text-left">Knowledge Base</span>
          </button>
          <button disabled className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#C0C4CC] cursor-not-allowed">
            <BarChart3 className="w-[15px] h-[15px] text-[#C0C4CC]" />
            <span className="flex-1 text-left">Usage</span>
            <span className="text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FFF4ED] text-[#FD5000]">SOON</span>
          </button>
        </nav>
        <div className="p-3 border-t border-[#F0F1F3]">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium text-[#4B5563] hover:bg-[#F8F9FB] transition">
            <LifeBuoy className="w-[15px] h-[15px] text-[#6B7280]" />
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col bg-[#FAFAFB] overflow-y-auto">
      {/* Top header */}
      <div className="flex items-center justify-between px-5 h-14 bg-white/95 backdrop-blur border-b border-[#E6E8EC] flex-shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] transition" aria-label="Back">
            <ChevronLeft className="w-[18px] h-[18px]" />
          </button>
          <div className="w-7 h-7 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: tint.tint }}>
            <img src={agent.img} alt="" className="h-6 w-auto object-contain" draggable={false} />
          </div>
          <h1 className="text-[14px] font-semibold text-[#1C1E21]">{persona.name}, {agent.title}</h1>
          <span className="px-1.5 py-0.5 rounded-md bg-[#F3F4F6] text-[#4B5563] text-[10px] font-semibold uppercase tracking-wide">Preview</span>
        </div>
        <button onClick={onBack} className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center text-[#4B5563] transition" aria-label="Close">
          <X className="w-[16px] h-[16px]" />
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-6 py-6 pb-24 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="flex flex-col gap-4">
        {/* Hero card — agent pitches itself */}
        <div className="relative rounded-3xl border border-[#E6E8EC] overflow-hidden bg-white">
          <div className="grid grid-cols-[300px_1fr] items-stretch">
            <div className="relative overflow-hidden flex items-end justify-center" style={{ background: tint.tint, minHeight: 360 }}>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute" style={{ top: -60, left: -40, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${tint.accent}55, transparent 70%)`, filter: 'blur(36px)' }} />
                <div className="absolute" style={{ bottom: -80, right: -40, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${tint.accent}33, transparent 72%)`, filter: 'blur(36px)' }} />
              </div>
              <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#15803D] text-[10.5px] font-bold uppercase tracking-wide z-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 bg-[#10B981]" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>
                Online
              </span>
              <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white text-[#1C1E21] text-[10.5px] font-bold uppercase tracking-wide z-10">
                {price === 'Free' && <Sparkles className="w-[10px] h-[10px] text-[#F59E0B]" fill="#F59E0B" />}
                {price}
              </span>
              <motion.img
                src={agent.img}
                alt=""
                className="relative h-[300px] w-auto object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.18)]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                draggable={false}
              />
            </div>

            <div className="px-7 py-7 flex flex-col">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-3 w-fit" style={{ background: `${tint.accent}1A`, color: tint.accent }}>
                <Sparkles className="w-[10px] h-[10px]" fill="currentColor" />
                <span className="text-[10px] font-bold tracking-[0.14em] uppercase">{agent.role}</span>
              </div>
              <h2 className="text-[28px] font-semibold text-[#1C1E21] tracking-tight leading-[1.1]">
                I'm <span style={{ color: tint.accent }}>{persona.name}</span>,
              </h2>
              <h3 className="text-[20px] font-semibold text-[#1C1E21] tracking-tight leading-tight mb-3">
                {agent.title.toLowerCase()} that runs while you sleep.
              </h3>
              <p className="text-[13.5px] text-[#4B5563] leading-relaxed mb-5 max-w-[460px]">
                {catalogOutcomes[agent.title] || agent.desc}
              </p>

              {/* Stat tiles */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="rounded-xl bg-[#FAFAFB] border border-[#F0F1F3] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#9CA3AF] mb-0.5">Saves</div>
                  <div className="text-[18px] font-semibold text-[#1C1E21] leading-none">{saves}</div>
                </div>
                <div className="rounded-xl bg-[#FAFAFB] border border-[#F0F1F3] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#9CA3AF] mb-0.5">Rating</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[18px] font-semibold text-[#1C1E21] leading-none">{agent.rating.toFixed(1)}</span>
                    <Star className="w-[13px] h-[13px] text-[#F59E0B] fill-[#F59E0B]" />
                  </div>
                </div>
                <div className="rounded-xl bg-[#FAFAFB] border border-[#F0F1F3] px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#9CA3AF] mb-0.5">Hires</div>
                  <div className="text-[18px] font-semibold text-[#1C1E21] leading-none tabular-nums">{agent.hires.toLocaleString()}</div>
                </div>
              </div>

              {/* Tools row */}
              <div className="flex items-center gap-2 mb-5">
                <span className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#9CA3AF]">Connects to</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tools.map((t) => (
                    <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-md bg-white border border-[#E6E8EC] text-[11px] font-medium text-[#4B5563]">{t}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <button
                  onClick={() => setHiredOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-5 h-11 rounded-xl bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                >
                  <Sparkles className="w-[14px] h-[14px]" fill="currentColor" />
                  Hire {persona.name} — {price}
                  <ArrowRight className="w-[14px] h-[14px]" />
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 h-11 rounded-xl text-[#4B5563] hover:text-[#1C1E21] text-[13px] font-semibold transition">
                  See sample run
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chat — the agent speaking */}
        <div className="rounded-2xl bg-white border border-[#E6E8EC] flex flex-col min-h-[620px] overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -16px rgba(0,0,0,0.08)' }}>
          <div className="flex items-center justify-between gap-3 px-6 h-16 border-b border-[#F0F1F3]">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: tint.tint }}>
                <img src={agent.img} alt="" className="h-9 w-auto object-contain" draggable={false} />
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-semibold text-[#1C1E21] tracking-tight leading-tight">Chat with {persona.name}</div>
                <div className="text-[12px] text-[#6B7280] mt-0.5">Ask anything · {persona.name} replies in their own voice</div>
              </div>
            </div>
            <span className="text-[11px] text-[#9CA3AF]">No data saved · preview</span>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="max-w-[640px] mx-auto space-y-7">
            {messages.map((m, i) => (
              m.from === 'agent' ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-start gap-4"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: tint.tint }}>
                    <img src={agent.img} alt="" className="h-8 w-auto object-contain" draggable={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-medium uppercase tracking-[0.10em] mb-1.5" style={{ color: tint.accent }}>{persona.name}</div>
                    <p className="text-[14.5px] text-[#1C1E21] leading-[1.65]">{m.text}</p>
                    {m.rich && (
                      <div className="mt-3 rounded-xl bg-[#FAFAFB] border border-[#F0F1F3] px-4 py-3 text-[12.5px] text-[#1C1E21] font-mono whitespace-pre-line leading-relaxed">
                        {m.rich}
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="flex justify-end"
                >
                  <div className="max-w-[520px] rounded-2xl rounded-br-md bg-[#EEF2FF] text-[#1C1E21] border border-[#E0E7FF] px-4 py-2.5 text-[14px] leading-relaxed">{m.text}</div>
                </motion.div>
              )
            ))}
            {sending && (
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: tint.tint }}>
                  <img src={agent.img} alt="" className="h-8 w-auto object-contain" draggable={false} />
                </div>
                <div className="flex items-center gap-2 text-[13.5px] text-[#9CA3AF] pt-2">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce" style={{ animationDelay: '240ms' }} />
                  </span>
                  {persona.name} is typing
                </div>
              </div>
            )}
            </div>
          </div>

          <div className="border-t border-[#F0F1F3] px-8 py-5">
            <div className="max-w-[640px] mx-auto">
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1), color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                    className="inline-flex items-center px-3 h-8 rounded-full bg-white border border-[#E6E8EC] text-[12.5px] font-medium text-[#4B5563] hover:border-[#1C1E21]/30 hover:text-[#1C1E21] active:scale-[0.97]"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div
                className="rounded-2xl border border-[#E6E8EC] bg-white focus-within:border-[#1C1E21]"
                style={{ transition: 'border-color 160ms cubic-bezier(0.23,1,0.32,1)' }}
              >
                <div className="flex items-center gap-2 px-3.5 py-2.5">
                  <button
                    style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                    className="w-7 h-7 rounded-full hover:bg-[#F3F4F6] active:scale-[0.94] flex items-center justify-center text-[#6B7280]"
                    aria-label="Attach"
                  >
                    <Plus className="w-[14px] h-[14px]" />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) { ask(input.trim()); setInput(''); } }}
                    placeholder={`Ask ${persona.name} anything…`}
                    className="flex-1 bg-transparent text-[14px] text-[#1C1E21] placeholder:text-[#C0C4CC] focus:outline-none"
                  />
                  <button
                    onClick={() => { if (input.trim()) { ask(input.trim()); setInput(''); } }}
                    style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-[0.94] ${input.trim() ? 'bg-[#1C1E21] text-white hover:bg-black' : 'bg-[#F3F4F6] text-[#9CA3AF]'}`}
                    aria-label="Send"
                  >
                    <ArrowUp className="w-[14px] h-[14px]" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Right sidebar — capabilities + agent quote */}
        <aside className="flex flex-col gap-3">
          {/* Quote card — dark */}
          <div className="relative rounded-2xl overflow-hidden border border-[#1C1E21]" style={{ background: 'linear-gradient(160deg, #1C1E21 0%, #16181B 100%)' }}>
            <div className="absolute" style={{ top: -50, right: -40, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${tint.accent}66, transparent 70%)`, filter: 'blur(36px)' }} />
            <div className="absolute" style={{ bottom: -60, left: -30, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle, ${tint.accent}33, transparent 70%)`, filter: 'blur(36px)' }} />
            <div className="relative p-4">
              <div className="text-[32px] leading-none font-serif italic mb-1" style={{ color: tint.accent }}>"</div>
              <p className="text-[13.5px] text-white leading-relaxed font-medium italic mb-3 -mt-2">
                {catalogQuotes[agent.title] || hiredQuotes[agent.title] || `I plug into your Zuper workspace and quietly handle the work so your team can focus on customers.`}
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ background: tint.tint }}>
                  <img src={agent.img} alt="" className="h-6 w-auto object-contain" draggable={false} />
                </div>
                <div className="leading-tight">
                  <div className="text-[12px] font-semibold text-white">— {persona.name}</div>
                  <div className="text-[10.5px] text-[#9CA3AF]">{agent.role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          {capabilities.map((cap) => (
            <div key={cap.title} className="rounded-2xl bg-white border border-[#E6E8EC] p-4 hover:border-[#1C1E21]/15 transition">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2.5" style={{ background: `${tint.accent}1A` }}>
                <cap.icon className="w-[16px] h-[16px]" style={{ color: tint.accent }} />
              </div>
              <h4 className="text-[13.5px] font-semibold text-[#1C1E21] mb-1">{cap.title}</h4>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </aside>
      </div>

      </div>

      <AgentReadyModal
        open={hiredOpen}
        name={persona.name}
        role={agent.role}
        avatar={agent.img}
        avatarTint={tint.tint}
        accent={tint.accent}
        primaryLabel="Chat with"
        secondaryLabel="Back to marketplace"
        onChat={() => {
          setHiredOpen(false);
          const record: typeof myAgents[number] = {
            name: `${persona.name} — ${agent.title}`,
            desc: agent.desc,
            runs: 0,
            lastRun: 'just now',
            users: 1,
            rating: agent.rating,
            reviews: 0,
            price,
            skills: skillsCount,
            tools: 0,
            status: 'Active',
            category: catKey === 'Compliance' ? 'Compliance' : catKey === 'Support' ? 'Support' : catKey === 'Finance' ? 'Finance' : catKey === 'Operations' ? 'Operations' : 'Sales',
            img: agent.img,
          };
          onHire?.(record);
          onChatWith?.(record.name);
        }}
        onMarketplace={() => {
          setHiredOpen(false);
          const record: typeof myAgents[number] = {
            name: `${persona.name} — ${agent.title}`,
            desc: agent.desc,
            runs: 0,
            lastRun: 'just now',
            users: 1,
            rating: agent.rating,
            reviews: 0,
            price,
            skills: skillsCount,
            tools: 0,
            status: 'Active',
            category: catKey === 'Compliance' ? 'Compliance' : catKey === 'Support' ? 'Support' : catKey === 'Finance' ? 'Finance' : catKey === 'Operations' ? 'Operations' : 'Sales',
            img: agent.img,
          };
          onHire?.(record);
          onBack();
        }}
        onClose={() => setHiredOpen(false)}
      />
    </div>
  );
}

function AUMarketplaceView({ onBack, onHire, onChatWith }: { onBack: () => void; onHire?: (a: typeof myAgents[number]) => void; onChatWith?: (name: string) => void }) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [heroIdx, setHeroIdx] = useState(0);
  const [catalogIdx, setCatalogIdx] = useState(0);
  const wheelLockRef = useRef(false);
  const dragRef = useRef<{ startX: number; startIdx: number; dragging: boolean }>({ startX: 0, startIdx: 0, dragging: false });
  const [triedAgent, setTriedAgent] = useState<typeof catalogItems[number] | null>(null);

  if (triedAgent) {
    return (
      <TryAgentView
        agent={triedAgent}
        onBack={() => setTriedAgent(null)}
        onHire={onHire}
        onChatWith={onChatWith}
      />
    );
  }
  const heroPrev = () => setHeroIdx((i) => (i - 1 + catalogItems.length) % catalogItems.length);
  const heroNext = () => setHeroIdx((i) => (i + 1) % catalogItems.length);
  const categories = ['All', 'Sales', 'Operations', 'Customer', 'Finance', 'Field'];

  const matchesCat = (role: string, cat: string) => {
    if (cat === 'All') return true;
    const r = role.toLowerCase();
    const c = cat.toLowerCase();
    if (c === 'field') return r.includes('field') || r.includes('coordinator');
    if (c === 'finance') return r.includes('collection') || r.includes('finance');
    return r.includes(c);
  };

  const filtered = catalogItems.filter((c) => {
    if (!matchesCat(c.role, activeCat)) return false;
    if (search && !`${c.title} ${c.role}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="h-full w-full flex flex-col overflow-y-auto scrollbar-auto-hide">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[#E6E8EC] flex-shrink-0">
        <div className="max-w-[1280px] mx-auto px-8 py-3 flex items-center justify-between gap-4">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1C1E21] hover:text-black transition">
            <ChevronLeft className="w-4 h-4" />
            Back to AI Studio
          </button>
        </div>
      </div>

      {/* Compact gradient cover banner */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{
          minHeight: 240,
          background: '#FFF8F2',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Dot grid */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.32 }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="auMpHeroDots" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#B8410E" opacity="0.22" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auMpHeroDots)" />
          </svg>
          {/* Animated gradient blobs — anchored to ends, middle stays clear */}
          <motion.div
            className="absolute"
            style={{ top: '-30%', left: '-10%', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(255,150,110,0.75), rgba(255,120,90,0.40) 45%, transparent 72%)', filter: 'blur(70px)' }}
            animate={{ x: [0, 40, -20, 0], y: [0, 30, 60, 0], scale: [1, 1.08, 0.95, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute"
            style={{ bottom: '-40%', left: '-12%', width: 460, height: 420, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(244,120,150,0.60), rgba(244,140,170,0.30) 50%, transparent 78%)', filter: 'blur(70px)' }}
            animate={{ x: [0, 30, -10, 0], y: [0, -20, -10, 0], scale: [1, 1.06, 0.92, 1] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute"
            style={{ top: '-30%', right: '-10%', width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, rgba(216,170,232,0.60), rgba(190,150,225,0.32) 50%, transparent 75%)', filter: 'blur(75px)' }}
            animate={{ x: [0, -30, 20, 0], y: [0, 30, 50, 0], scale: [1, 1.06, 0.95, 1] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute"
            style={{ bottom: '-40%', right: '-12%', width: 460, height: 420, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 50%, rgba(255,170,140,0.55), rgba(255,140,120,0.30) 50%, transparent 78%)', filter: 'blur(70px)' }}
            animate={{ x: [0, -30, 10, 0], y: [0, -20, -30, 0], scale: [1, 1.05, 0.93, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Sparkle accents */}
          <svg className="absolute" style={{ top: 50, right: '8%', width: 18, height: 18 }} viewBox="0 0 24 24" fill="#E63946" opacity="0.7">
            <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" />
          </svg>
          <svg className="absolute" style={{ top: '40%', right: '40%', width: 12, height: 12 }} viewBox="0 0 24 24" fill="#FFC857" opacity="0.65">
            <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" />
          </svg>
          <svg className="absolute" style={{ bottom: 80, right: '15%', width: 14, height: 14 }} viewBox="0 0 24 24" fill="#FF8A4C" opacity="0.6">
            <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" />
          </svg>
        </div>

        <div className="relative max-w-[1280px] mx-auto px-10 py-10 flex flex-col items-center text-center min-h-full justify-center">
          <motion.div
            className="relative z-10 max-w-[760px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4"
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(230, 107, 82, 0.22)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Bot className="w-[12px] h-[12px] text-[#E66B52]" strokeWidth={2.2} />
              <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-[#9C5340]">
                Sense Agents Marketplace
              </span>
            </div>
            <h1 className="text-[40px] font-semibold tracking-tight leading-[1.05] text-[#1C1E21] mb-3">
              Hire the <span style={{ color: '#E66B52' }}>agents</span> doing the work for you.
            </h1>
            <p className="text-[14.5px] text-[#3C2A1F] leading-relaxed max-w-[560px] mx-auto mb-5">
              Pre-built AI teammates that plug into Zuper. Pick one, deploy in minutes — they handle the work, you keep control.
            </p>
            <button className="inline-flex items-center gap-1.5 px-5 h-10 rounded-xl bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Create agent
            </button>
          </motion.div>
        </div>
      </div>

      {/* Browse Catalog section */}
      <div className="max-w-[1280px] mx-auto px-10 pt-12 pb-20 w-full">
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-[18px] h-[18px] text-[#6B7280]" />
              <h2 className="text-[22px] font-semibold text-[#1C1E21] tracking-tight">Browse Catalog</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold tabular-nums">6</span>
            </div>
            <p className="text-[13px] text-[#6B7280] mt-1">Pick one, customize it, deploy.</p>
          </div>
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#9CA3AF]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents…"
              className="w-full pl-9 pr-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1C1E21]/30 transition"
            />
          </div>
        </div>


        {/* Peek carousel — rich agent cards */}
        {(() => {
          const filteredCatalog = catalogItems.filter((c) => {
            if (search && !`${c.title} ${c.role}`.toLowerCase().includes(search.toLowerCase())) return false;
            if (activeCat === 'All') return true;
            const r = c.role.toLowerCase();
            const cat = activeCat.toLowerCase();
            if (cat === 'field') return r.includes('field') || r.includes('coordinator');
            if (cat === 'finance') return r.includes('collection') || r.includes('finance');
            return r.includes(cat);
          }).slice(0, 6);
          if (filteredCatalog.length === 0) {
            return (
              <div className="rounded-2xl border border-dashed border-[#E6E8EC] py-14 text-center">
                <div className="text-[13.5px] font-semibold text-[#1C1E21] mb-1">No agents match "{search}"</div>
                <div className="text-[12.5px] text-[#6B7280]">Try a different keyword or category.</div>
              </div>
            );
          }
          const VISIBLE = 3;
          const maxIdx = Math.max(0, filteredCatalog.length - VISIBLE);
          const idx = Math.min(catalogIdx, maxIdx);
          const prev = () => setCatalogIdx((i) => Math.max(0, i - 1));
          const next = () => setCatalogIdx((i) => Math.min(maxIdx, i + 1));

          const CARD_W = 380;
          const GAP = 28;
          const STEP = CARD_W + GAP;

          const handleWheel = (e: React.WheelEvent) => {
            const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            const delta = horizontal ? e.deltaX : e.deltaY;
            const abs = Math.abs(delta);
            if (abs < 4) return;
            if (wheelLockRef.current) return;
            wheelLockRef.current = true;
            // Steps scale with scroll strength: gentle = 1, hard = up to 4
            const steps = Math.min(4, Math.max(1, Math.round(abs / 60)));
            setTimeout(() => { wheelLockRef.current = false; }, 800 + steps * 100);
            const dir = delta > 0 ? 1 : -1;
            setCatalogIdx((i) => ((i + dir * steps) % filteredCatalog.length + filteredCatalog.length) % filteredCatalog.length);
          };
          const onMouseDown = (e: React.MouseEvent) => {
            dragRef.current = { startX: e.clientX, startIdx: idx, dragging: true };
          };
          const onMouseMove = (e: React.MouseEvent) => {
            if (!dragRef.current.dragging) return;
            const dx = e.clientX - dragRef.current.startX;
            const stepDelta = Math.round(-dx / (STEP * 0.6));
            const target = ((dragRef.current.startIdx + stepDelta) % filteredCatalog.length + filteredCatalog.length) % filteredCatalog.length;
            if (target !== idx) setCatalogIdx(target);
          };
          const onMouseUp = () => { dragRef.current.dragging = false; };
          return (
            <div className="relative">
              {/* Left arrow */}
              <button
                onClick={prev}
                disabled={idx === 0}
                aria-label="Previous"
                style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E6E8EC] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-[#FAFAFB] hover:border-[#1C1E21]/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#1C1E21] active:scale-[0.96]"
              >
                <ChevronLeft className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </button>
              {/* Right arrow */}
              <button
                onClick={next}
                disabled={idx >= maxIdx}
                aria-label="Next"
                style={{ transition: 'background-color 160ms cubic-bezier(0.23,1,0.32,1), transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E6E8EC] shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-[#FAFAFB] hover:border-[#1C1E21]/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#1C1E21] active:scale-[0.96]"
              >
                <ChevronRight className="w-[18px] h-[18px]" strokeWidth={2.2} />
              </button>

              <div
                className="relative overflow-hidden pt-6 pb-8 select-none cursor-grab active:cursor-grabbing px-14"
                onWheel={handleWheel}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
              >
                <div
                  className="flex transition-transform duration-[520ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{
                    gap: `${GAP}px`,
                    transform: `translateX(-${idx * STEP}px)`,
                  }}
                >
                  {filteredCatalog.map((c, i) => {
                    const isActive = i === idx;
                    const persona = catalogPersonas[c.title] || hiredPersonas[c.title] || { name: c.title.split(' ')[0], pronouns: 'it/its' };
                    const users = 8 + ((i * 7) % 36);
                    const lastRun = ['2m ago', '8m ago', '24m ago', '1h ago', '3h ago'][i % 5];
                    const offset = i - idx;
                    const dist = Math.abs(offset);
                    const sc = isActive ? 1 : 0.96;
                    const isAdded = i % 3 === 0;
                    const rL = c.role.toLowerCase();
                    const catKey: keyof typeof categoryTint =
                      /sales|closer/.test(rL) ? 'Sales' :
                      /operations/.test(rL) ? 'Operations' :
                      /customer|support/.test(rL) ? 'Support' :
                      /finance|collection/.test(rL) ? 'Finance' :
                      /field|coordinator/.test(rL) ? 'Compliance' :
                      'Sales';
                    const tintInfo = categoryTint[catKey];
                    return (
                      <article
                        key={c.title}
                        onClick={() => setCatalogIdx(i)}
                        className="rounded-2xl bg-white border border-[#E6E8EC] cursor-pointer overflow-hidden flex flex-col flex-shrink-0"
                        style={{
                          width: CARD_W,
                          transform: `scale(${sc})`,
                          transformOrigin: '50% 50%',
                          opacity: dist > 3 ? 0 : isActive ? 1 : 0.7,
                          boxShadow: isActive
                            ? '0 22px 48px -18px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.04)'
                            : '0 8px 22px -16px rgba(0,0,0,0.10)',
                          transition:
                            'transform 520ms cubic-bezier(0.23,1,0.32,1), opacity 360ms cubic-bezier(0.23,1,0.32,1), box-shadow 360ms cubic-bezier(0.23,1,0.32,1)',
                        }}
                      >
                        {/* Hero with avatar — pure pastel, no overlays */}
                        <div
                          className="relative overflow-hidden"
                          style={{ background: tintInfo.tint, height: 320 }}
                        >
                          {isAdded ? (
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white text-[10px] font-bold tracking-wide uppercase text-[#15803D] z-10">
                              <CheckCircle2 className="w-[12px] h-[12px] text-[#10B981]" fill="#10B981" stroke="white" strokeWidth={2.4} />
                              Added
                            </span>
                          ) : c.featured ? (
                            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white text-[10px] font-bold tracking-wide uppercase text-[#92400E] z-10">
                              <Star className="w-[11px] h-[11px] text-[#F59E0B] fill-[#F59E0B]" />
                              Featured
                            </span>
                          ) : null}
                          <img
                            src={c.img}
                            alt={c.title}
                            className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[100%] w-auto object-contain"
                            draggable={false}
                          />
                        </div>

                        {/* Content */}
                        <div className="px-5 pt-4 pb-3 flex-1 flex flex-col">
                          <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#9CA3AF] mb-1">{c.role.split(' ')[0]}</div>
                          <h3 className="text-[18px] font-semibold text-[#1C1E21] leading-tight mb-1">{c.title}</h3>
                          <div className="flex items-baseline gap-1.5 mb-3">
                            <span className="text-[13px] font-semibold" style={{ color: tintInfo.accent }}>{persona.name}</span>
                            <span className="text-[11.5px] text-[#9CA3AF]">{persona.pronouns}</span>
                          </div>
                          <p className="text-[12.5px] text-[#4B5563] leading-relaxed mb-3 line-clamp-2">{c.desc}</p>

                          <div className="flex items-center gap-1.5 mt-auto">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F3F4F6] text-[11.5px] font-semibold text-[#1C1E21]">
                              <Users className="w-[11px] h-[11px] text-[#6B7280]" />
                              {users} users
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F3F4F6] text-[11.5px] font-semibold text-[#1C1E21]">
                              <RefreshCw className="w-[11px] h-[11px] text-[#6B7280]" />
                              {lastRun}
                            </span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-[#F0F1F3] px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[12.5px]">
                            <Star className="w-[13px] h-[13px] text-[#F59E0B] fill-[#F59E0B]" />
                            <span className="font-semibold text-[#1C1E21]">{c.rating.toFixed(1)}</span>
                            <span className="text-[#9CA3AF]">· {users} users</span>
                          </div>
                          {isAdded ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); setTriedAgent(c); }}
                              className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg bg-[#ECFDF5] text-[#15803D] text-[12.5px] font-semibold transition-all hover:bg-[#D1FAE5]"
                            >
                              <CheckCircle2 className="w-[13px] h-[13px]" fill="#10B981" stroke="white" strokeWidth={2.4} />
                              Added
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setTriedAgent(c); }}
                              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12.5px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                            >
                              <Sparkles className="w-[12px] h-[12px]" fill="currentColor" />
                              Try me
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })()}

      </div>

    </div>
  );
}

function NetflixRow({ label, icon: Icon, accent, items }: { label: string; icon: any; accent: string; items: typeof catalogItems }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 560, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-[16px] h-[16px]" style={{ color: accent }} fill={Icon === Star ? accent : 'none'} />
          <h3 className="text-[15.5px] font-semibold text-[#1C1E21] tracking-tight">{label}</h3>
          <span className="text-[11px] text-[#9CA3AF] font-medium">{items.length}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollBy(-1)}
            className="w-7 h-7 rounded-full bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/20 flex items-center justify-center text-[#4B5563] transition"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-[14px] h-[14px]" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="w-7 h-7 rounded-full bg-white border border-[#E6E8EC] hover:border-[#1C1E21]/20 flex items-center justify-center text-[#4B5563] transition"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-[14px] h-[14px]" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Edge fade — left */}
        <div className="absolute top-0 left-0 bottom-0 w-8 pointer-events-none z-10" style={{ background: 'linear-gradient(90deg, #FFFFFF 0%, transparent 100%)' }} />
        {/* Edge fade — right */}
        <div className="absolute top-0 right-0 bottom-0 w-8 pointer-events-none z-10" style={{ background: 'linear-gradient(-90deg, #FFFFFF 0%, transparent 100%)' }} />

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-auto-hide pb-2 -mx-2 px-2 scroll-smooth">
          {items.map((c) => (
            <NetflixCard key={`${label}-${c.title}`} c={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function NetflixCard({ c }: { c: typeof catalogItems[number] }) {
  return (
    <article
      className="group relative rounded-xl bg-white border border-[#E6E8EC] overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.05)] hover:border-[#1C1E21]/15"
      style={{ width: 240 }}
    >
      {/* Poster — taller, agent prominent */}
      <div className="relative h-[260px] overflow-hidden" style={{ background: c.tint }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.28 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`nflxDots-${c.title}`} width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill={c.accent} opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#nflxDots-${c.title})`} />
        </svg>
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-50" style={{ background: `radial-gradient(circle, ${c.accent}55, transparent 70%)`, filter: 'blur(16px)' }} />

        <img
          src={c.img}
          alt={c.title}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[100%] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.06] group-hover:-translate-y-1"
          draggable={false}
        />

        {/* Badges */}
        {c.featured && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur text-[9.5px] font-bold tracking-wide uppercase" style={{ color: '#92400E' }}>
            <Star className="w-[9px] h-[9px] text-[#F59E0B] fill-[#F59E0B]" />
            Featured
          </span>
        )}
        <span className="absolute top-2.5 right-2.5 inline-flex items-center px-1.5 py-0.5 rounded-md bg-[#1C1E21]/90 backdrop-blur text-white text-[9.5px] font-bold tracking-wide uppercase">
          {c.saves.replace('Saves ', '')}
        </span>

        {/* Hover reveal — Hire button */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/65 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-lg bg-white text-[#1C1E21] text-[12px] font-semibold transition hover:bg-white">
            <Play className="w-[11px] h-[11px] fill-current" />
            Hire now
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3.5 pt-2.5 pb-3">
        <div className="text-[9.5px] font-semibold tracking-[0.10em] uppercase text-[#9CA3AF] mb-0.5 truncate">{c.role}</div>
        <h4 className="text-[13.5px] font-semibold text-[#1C1E21] tracking-tight leading-tight truncate">{c.title}</h4>
        <div className="flex items-center justify-between mt-1.5 text-[11px]">
          <span className="inline-flex items-center gap-1">
            <Star className="w-[10px] h-[10px] text-[#F59E0B] fill-[#F59E0B]" />
            <span className="font-semibold text-[#1C1E21]">{c.rating.toFixed(1)}</span>
          </span>
          <span className="text-[#9CA3AF]">{c.hires.toLocaleString()} hires</span>
        </div>
      </div>
    </article>
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
          className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] flex-shrink-0"
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
            className="w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
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
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
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
  // ── Operations (5) ──
  {
    title: 'Skyline',
    role: 'Operations Assistant',
    desc: 'Wakes up before your crews and emails a multi-city forecast so jobs get rescheduled before rain hits.',
    saves: 'Saves 3h/week',
    rating: 4.8,
    hires: 142,
    featured: true,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: Mail, label: 'Email' }],
    img: agentDetective,
    tint: 'linear-gradient(180deg, #FDE9CC 0%, #FEF4E0 100%)',
    accent: '#E89F5C',
  },
  {
    title: 'Atlas',
    role: 'Operations Assistant',
    desc: 'Rebuilds tomorrow\'s routes overnight to cut drive time and balance crew workload across the day.',
    saves: 'Saves 6h/week',
    rating: 4.7,
    hires: 188,
    tags: [{ icon: Clock, label: 'Nightly' }, { icon: Zap, label: 'Auto-route' }],
    img: agentSupport,
    tint: 'linear-gradient(180deg, #FDE6CC 0%, #FEEFDA 100%)',
    accent: '#E89F5C',
  },
  {
    title: 'Watch',
    role: 'Operations Assistant',
    desc: 'Monitors active jobs for missed response or arrival windows and pings the right manager early.',
    saves: 'Saves 4h/week',
    rating: 4.6,
    hires: 121,
    tags: [{ icon: Clock, label: 'Realtime' }, { icon: MessageSquare, label: 'Slack' }],
    img: agentClassic1,
    tint: 'linear-gradient(180deg, #FFEAD5 0%, #FFF3E5 100%)',
    accent: '#E89F5C',
  },
  {
    title: 'Stockpile',
    role: 'Operations Assistant',
    desc: 'Tracks consumable usage per job and drafts purchase orders before crews hit empty shelves.',
    saves: 'Saves 5h/week',
    rating: 4.7,
    hires: 165,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: Mail, label: 'Email' }],
    img: agentCreator,
    tint: 'linear-gradient(180deg, #FCE4D6 0%, #FDEEE2 100%)',
    accent: '#E89F5C',
  },
  {
    title: 'Tag',
    role: 'Operations Assistant',
    desc: 'Reads new jobs, applies the right service codes and crew tags so dispatchers don\'t have to.',
    saves: 'Saves 3h/week',
    rating: 4.5,
    hires: 92,
    tags: [{ icon: Webhook, label: 'On-create' }, { icon: Zap, label: 'Auto-tag' }],
    img: agentMarketer,
    tint: 'linear-gradient(180deg, #FFE5C9 0%, #FFF1DC 100%)',
    accent: '#E89F5C',
  },

  // ── Customer (5) ──
  {
    title: 'Echo',
    role: 'Customer Insights',
    desc: 'Pulls fresh Google reviews, matches them to customers, and flags anything below 4 stars for follow-up.',
    saves: 'Saves 2h/week',
    rating: 4.9,
    hires: 218,
    featured: true,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: Mail, label: 'Email' }],
    img: agentReviews,
    tint: 'linear-gradient(180deg, #FCE4E6 0%, #FDF1F3 100%)',
    accent: '#E48A98',
  },
  {
    title: 'Pulse',
    role: 'Customer Insights',
    desc: 'Sends a 1-question NPS after each completed job and clusters responses into recurring themes.',
    saves: 'Saves 3h/week',
    rating: 4.7,
    hires: 144,
    tags: [{ icon: Mail, label: 'Email' }, { icon: BarChart3, label: 'Cluster' }],
    img: agentClassic2,
    tint: 'linear-gradient(180deg, #FBD9DD 0%, #FDE9EC 100%)',
    accent: '#E48A98',
  },
  {
    title: 'Loyal',
    role: 'Customer Insights',
    desc: 'Watches contract renewals, complaints and ticket volume to flag accounts likely to churn.',
    saves: 'Saves 5h/week',
    rating: 4.8,
    hires: 176,
    tags: [{ icon: Clock, label: 'Weekly' }, { icon: AlertTriangle, label: 'Alert' }],
    img: agentCreator,
    tint: 'linear-gradient(180deg, #FCDDE0 0%, #FDECEE 100%)',
    accent: '#E48A98',
  },
  {
    title: 'Wave',
    role: 'Customer Insights',
    desc: 'Sends a personal thank-you SMS 24h after job completion and asks for a Google review when timing is right.',
    saves: 'Saves 4h/week',
    rating: 4.6,
    hires: 128,
    tags: [{ icon: Clock, label: 'Triggered' }, { icon: MessageSquare, label: 'SMS' }],
    img: agentMarketer,
    tint: 'linear-gradient(180deg, #FCD9DC 0%, #FDE7EA 100%)',
    accent: '#E48A98',
  },
  {
    title: 'Triage',
    role: 'Customer Insights',
    desc: 'Reads inbound complaint emails, classifies severity, and routes the urgent ones to a human first.',
    saves: 'Saves 6h/week',
    rating: 4.7,
    hires: 156,
    tags: [{ icon: Mail, label: 'Inbox' }, { icon: AlertTriangle, label: 'Triage' }],
    img: agentSupport,
    tint: 'linear-gradient(180deg, #FDDFE2 0%, #FEEEEF 100%)',
    accent: '#E48A98',
  },

  // ── Sales (5) ──
  {
    title: 'Catch',
    role: 'Sales Assistant',
    desc: 'Captures inbound leads via webhook and turns them into Zuper jobs with the right tags and crew assigned.',
    saves: 'Saves 6h/week',
    rating: 4.7,
    hires: 312,
    tags: [{ icon: Webhook, label: 'Webhook' }, { icon: Zap, label: 'Auto-create' }],
    img: agentCreator,
    tint: 'linear-gradient(180deg, #FEF6D6 0%, #FEFAE5 100%)',
    accent: '#CFA64D',
  },
  {
    title: 'Remind',
    role: 'Sales Closer',
    desc: 'Politely nudges customers with open quotes so they don\'t go cold — and tells you which ones converted.',
    saves: 'Saves 4h/week',
    rating: 4.6,
    hires: 96,
    tags: [{ icon: Clock, label: 'Scheduled' }, { icon: Mail, label: 'Email' }],
    img: agentReviews,
    tint: 'linear-gradient(180deg, #DCE9F5 0%, #EAF1F8 100%)',
    accent: '#7DA1C9',
  },
  {
    title: 'Scout',
    role: 'Sales Assistant',
    desc: 'Scores every inbound lead by budget, timeline and fit so closers only see the hot ones.',
    saves: 'Saves 7h/week',
    rating: 4.8,
    hires: 264,
    featured: true,
    tags: [{ icon: Zap, label: 'Scored' }, { icon: Webhook, label: 'Webhook' }],
    img: agentSupport,
    tint: 'linear-gradient(180deg, #FEF1C7 0%, #FEF7DA 100%)',
    accent: '#CFA64D',
  },
  {
    title: 'Brief',
    role: 'Sales Assistant',
    desc: 'Compiles a weekly pipeline summary by stage and rep, sent to managers every Monday at 8am.',
    saves: 'Saves 3h/week',
    rating: 4.5,
    hires: 78,
    tags: [{ icon: Clock, label: 'Weekly' }, { icon: BarChart3, label: 'Report' }],
    img: agentClassic3,
    tint: 'linear-gradient(180deg, #FEF5C7 0%, #FFFAE0 100%)',
    accent: '#CFA64D',
  },
  {
    title: 'Revive',
    role: 'Sales Closer',
    desc: 'Re-engages dormant leads with personalized check-ins and a fresh offer based on past interest.',
    saves: 'Saves 5h/week',
    rating: 4.7,
    hires: 132,
    tags: [{ icon: Clock, label: 'Monthly' }, { icon: Mail, label: 'Email' }],
    img: agentDetective,
    tint: 'linear-gradient(180deg, #DCE9F5 0%, #ECF2F8 100%)',
    accent: '#7DA1C9',
  },

  // ── Finance (5) ──
  {
    title: 'Collect',
    role: 'Collections Assistant',
    desc: 'Spots invoices past 30 days, drafts a friendly collection email, and tracks who has and hasn\'t paid.',
    saves: 'Saves 7h/week',
    rating: 4.9,
    hires: 256,
    featured: true,
    tags: [{ icon: Clock, label: 'Scheduled' }, { icon: Mail, label: 'Email' }],
    img: agentMarketer,
    tint: 'linear-gradient(180deg, #E3D6F1 0%, #EFE5F7 100%)',
    accent: '#A788CC',
  },
  {
    title: 'Margin',
    role: 'Finance Assistant',
    desc: 'Flags jobs running below target margin in realtime and shows where the cost crept in.',
    saves: 'Saves 4h/week',
    rating: 4.8,
    hires: 162,
    tags: [{ icon: Clock, label: 'Realtime' }, { icon: AlertTriangle, label: 'Alert' }],
    img: agentClassic1,
    tint: 'linear-gradient(180deg, #DDD0EE 0%, #EBE0F4 100%)',
    accent: '#A788CC',
  },
  {
    title: 'Sort',
    role: 'Finance Assistant',
    desc: 'Reads card transactions and receipts, applies your chart of accounts, and pushes to QuickBooks.',
    saves: 'Saves 6h/week',
    rating: 4.7,
    hires: 198,
    tags: [{ icon: Webhook, label: 'QBO sync' }, { icon: Zap, label: 'Auto-tag' }],
    img: agentReviews,
    tint: 'linear-gradient(180deg, #E0D2F0 0%, #EBE0F4 100%)',
    accent: '#A788CC',
  },
  {
    title: 'Forecast',
    role: 'Finance Assistant',
    desc: 'Projects 30 / 60 / 90-day cash position from open quotes, jobs and aged receivables.',
    saves: 'Saves 5h/week',
    rating: 4.8,
    hires: 145,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: BarChart3, label: 'Forecast' }],
    img: agentSupport,
    tint: 'linear-gradient(180deg, #DCCBEF 0%, #ECE0F5 100%)',
    accent: '#A788CC',
  },
  {
    title: 'Chase',
    role: 'Collections Assistant',
    desc: 'Auto-sends friendly reminders at 7, 14 and 30 days past due — escalates if still unpaid.',
    saves: 'Saves 4h/week',
    rating: 4.6,
    hires: 109,
    tags: [{ icon: Clock, label: 'Scheduled' }, { icon: Mail, label: 'Email' }],
    img: agentDetective,
    tint: 'linear-gradient(180deg, #E5D8F1 0%, #EFE6F7 100%)',
    accent: '#A788CC',
  },

  // ── Field (5) ──
  {
    title: 'Roster',
    role: 'Field Coordinator',
    desc: 'Texts each crew their full schedule, drive routes, and parts list every morning before they roll out.',
    saves: 'Saves 5h/week',
    rating: 4.8,
    hires: 174,
    tags: [{ icon: Clock, label: 'Daily' }, { icon: MessageSquare, label: 'SMS' }],
    img: agentClassic2,
    tint: 'linear-gradient(180deg, #DCEFE2 0%, #ECF5EF 100%)',
    accent: '#7DB48E',
  },
  {
    title: 'Inspect',
    role: 'Field Coordinator',
    desc: 'Reviews job-site checklists and flags missed safety steps before crew sign-off.',
    saves: 'Saves 3h/week',
    rating: 4.7,
    hires: 122,
    tags: [{ icon: Clock, label: 'Per-job' }, { icon: AlertTriangle, label: 'Flag' }],
    img: agentCreator,
    tint: 'linear-gradient(180deg, #D6EADD 0%, #E8F2EB 100%)',
    accent: '#7DB48E',
  },
  {
    title: 'Audit',
    role: 'Field Coordinator',
    desc: 'Checks crew-uploaded job photos for required angles, lighting and brand-mark presence.',
    saves: 'Saves 4h/week',
    rating: 4.6,
    hires: 86,
    tags: [{ icon: Clock, label: 'Per-job' }, { icon: Zap, label: 'Image AI' }],
    img: agentMarketer,
    tint: 'linear-gradient(180deg, #DCEFE2 0%, #ECF5EF 100%)',
    accent: '#7DB48E',
  },
  {
    title: 'Recoup',
    role: 'Field Coordinator',
    desc: 'Detects unconfirmed appointments, texts the customer 1h before, and reschedules if needed.',
    saves: 'Saves 6h/week',
    rating: 4.8,
    hires: 198,
    tags: [{ icon: Clock, label: 'Realtime' }, { icon: MessageSquare, label: 'SMS' }],
    img: agentSupport,
    tint: 'linear-gradient(180deg, #D8EDDE 0%, #EAF4ED 100%)',
    accent: '#7DB48E',
  },
  {
    title: 'Sync',
    role: 'Field Coordinator',
    desc: 'Updates dispatchers when crews finish early or run late, so the next job slot fills automatically.',
    saves: 'Saves 5h/week',
    rating: 4.7,
    hires: 134,
    tags: [{ icon: Clock, label: 'Realtime' }, { icon: Webhook, label: 'Auto-fill' }],
    img: agentClassic3,
    tint: 'linear-gradient(180deg, #DEEEE3 0%, #EDF4EF 100%)',
    accent: '#7DB48E',
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
              {[agentDetective, agentMarketer, agentCreator].map((src, i) => (
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
              <button className="inline-flex items-center gap-1.5 px-3.5 h-8 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[12px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
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
  Sales: { tint: 'linear-gradient(180deg, #FCE4E6 0%, #FDF1F3 100%)', accent: '#E48A98' },
  Operations: { tint: 'linear-gradient(180deg, #FDE9CC 0%, #FEF4E0 100%)', accent: '#E89F5C' },
  Support: { tint: 'linear-gradient(180deg, #DCEFE2 0%, #ECF5EF 100%)', accent: '#7DB48E' },
  Finance: { tint: 'linear-gradient(180deg, #E3D6F1 0%, #EFE5F7 100%)', accent: '#A788CC' },
  Compliance: { tint: 'linear-gradient(180deg, #DCE9F5 0%, #EAF1F8 100%)', accent: '#7DA1C9' },
};

type VPCardData = {
  persona: string;
  pronouns: string;
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
  stats: { label: string; value: string }[];
  highlights: string[];
  quote: string;
  pitch: { metric: string; body: string };
  outcome: string;
  isCreate?: boolean;
};

const hiredPersonas: Record<string, { name: string; pronouns: string }> = {
  'Coach': { name: 'Marcus', pronouns: 'he/him' },
  'Ledger': { name: 'Emma', pronouns: 'she/her' },
  'Sage': { name: 'Henry', pronouns: 'he/him' },
  'Compass': { name: 'Olivia', pronouns: 'she/her' },
  'Pitch': { name: 'Jacob', pronouns: 'he/him' },
  'Nudge': { name: 'Oliver', pronouns: 'he/him' },
  'Guard': { name: 'Sarah', pronouns: 'she/her' },
  'Stock': { name: 'Ethan', pronouns: 'he/him' },
  'Spark': { name: 'Chloe', pronouns: 'she/her' },
  'Care': { name: 'Grace', pronouns: 'she/her' },
  'Sift': { name: 'Logan', pronouns: 'he/him' },
};

const hiredOutcomes: Record<string, string> = {
  'Coach': "Win rate climbs back within two weeks. I review every call and surface what to fix — without slowing your team down.",
  'Sage': "Customer questions get answered in seconds, 24/7. I escalate to your team only when it's actually needed.",
  'Compass': "Crews finish four hours earlier and drive less. I rebuild the day's routes overnight.",
  'Nudge': "Stalled quotes warm back up within 24h. I draft on-brand follow-ups and tell you who's ready to sign.",
  'Stock': "No more empty trucks. I draft POs the moment stock dips and ping the right vendor.",
  'Spark': "Every inbound lead gets a personal hello in under a minute. I qualify, route, and log it all in Zuper.",
  'Sift': "Closers stop sifting through cold leads. I score every inbound and only the hot ones hit their queue.",
};

const catalogOutcomes: Record<string, string> = {
  'Skyline': "No more jobs lost to surprise rain. I read the forecast, find the at-risk jobs, and reschedule them before 7am.",
  'Echo': "Unhappy customers get caught before they post. Your rating starts climbing again within the month.",
  'Catch': "Every inbound lead becomes a Zuper job in under a minute — auto-tagged, auto-assigned, and ready for crew.",
  'Remind': "Open quotes never go cold again. Conversion lifts ~15% in the first 30 days.",
  'Roster': "Crews start the day knowing exactly what's ahead. No more 7am scrambles or wrong-address visits.",
  'Collect': "Cash flow improves in week one. Past-due invoices get chased on day 30, 60, and 90 — automatically.",
};

const hiredPitches: Record<string, { metric: string; body: string }> = {
  'Coach': { metric: 'Win rate dipped 12% this quarter', body: "if the slide continues, you'll miss target by Q-end — Marcus has already flagged 7 coachable calls." },
  'Sage': { metric: 'Support tickets up 28% this month', body: 'volume is outpacing your team — Henry quietly resolved 142 of them without an escalation.' },
  'Compass': { metric: 'Drive time crept up 18 min per job', body: 'crews are burning daylight — Olivia trimmed 4 hours off yesterday\'s routes.' },
  'Nudge': { metric: 'Quote follow-up gap widened to 4.2 days', body: 'open quotes go cold fast past 72h — Oliver is pulling it back toward 14 hours.' },
  'Stock': { metric: 'Stock-outs hit 6 SKUs this week', body: "crews keep arriving empty-handed — Ethan caught 14 low-stock items before they ran out." },
  'Spark': { metric: 'Inbound response slipped to 22 min', body: "industry hot-lead window is 5 min — Chloe is greeting in 38 seconds on average." },
  'Sift': { metric: 'Lead-to-quote time jumped 32%', body: 'closers are buried in noise — Logan filters fast so only the hot ones reach them.' },
};

const catalogPitches: Record<string, { metric: string; body: string }> = {
  'Skyline': { metric: '3 jobs got rained out this month', body: "weather is costing you $4.2K per cancelled day — Skyler would have rescheduled them at 6am." },
  'Echo': { metric: 'Rating dropped 0.3★ in 30 days', body: "every 0.1★ costs you ~2 inbound leads/week — Maya would catch unhappy customers before they post." },
  'Catch': { metric: 'Inbound leads sit 2.4 days before assignment', body: 'every hour past hour 1 cuts conversion ~7% — Leo creates the Zuper job in 60 seconds.' },
  'Remind': { metric: '$48K in open quotes are 3+ days cold', body: 'past 72h quotes convert at half the rate — Quinn warms them up before they go ice.' },
  'Roster': { metric: 'Crews miss 12% of route changes', body: 'last-minute swaps cost an avg 38 min/crew/day — Claire SMS each one before sunrise.' },
  'Collect': { metric: 'Overdue invoices crossed $24K this week', body: "if this trend continues, collections may fall 2–3 months behind — Ivy chases what's slipped past 30 days." },
};

const hiredQuotes: Record<string, string> = {
  'Coach': 'Every rep wants to close. I show them which call they almost won — and what to say next.',
  'Sage': "Customers don't read docs. I read them so they don't have to.",
  'Compass': 'I know which crew is closest, freest, and best for the job. Every minute saved is a margin point.',
  'Nudge': 'Open quotes go cold fast. I keep yours warm — and tell you which ones are ready to close.',
  'Stock': "I watch your stock so you don't have to. When something's running low, I draft the PO and ping the vendor.",
  'Spark': 'Inbound leads need a fast hello. I greet, qualify, and route — before they bounce.',
  'Sift': "Not every lead is worth your time. I weigh budget, timeline, and fit, then hand off only the hot ones.",
};

const catalogQuotes: Record<string, string> = {
  'Skyline': 'I wake up before your crews and email a multi-city forecast so jobs get rescheduled before rain hits.',
  'Echo': 'I pull every new Google review, match it to a customer, and flag anything under 4 stars.',
  'Catch': 'I catch every web form and webhook. Tag, score, and turn each one into a Zuper job — automatically.',
  'Remind': "Open quotes need a nudge. I send a polite follow-up, then tell you who's ready to sign.",
  'Roster': 'Every crew gets their day on their phone — schedule, drive route, parts — before they roll out.',
  'Collect': "Past due invoices add up fast. I find them, draft the email, and track who's paid.",
};

const highlightsByCategory: Record<string, string[]> = {
  Sales: ['Qualifies leads in under 60 seconds', 'Hands off hot leads to closers', 'Logs every touchpoint in Zuper'],
  Support: ['Answers FAQs from your docs', 'Escalates complex issues to humans', 'Available 24/7 across channels'],
  Operations: ['Watches data in real-time', 'Sends actionable digests, not noise', 'Connects to your existing tools'],
  Finance: ['Reads invoices + receipts on its own', 'Flags margin anomalies early', 'Exports clean to QuickBooks'],
  Compliance: ['Checks every job-site sign-off', 'Logs evidence with timestamps', 'Flags missed steps before closeout'],
};

const catalogPersonas: Record<string, { name: string; pronouns: string }> = {
  'Skyline': { name: 'Skyler', pronouns: 'she/her' },
  'Echo': { name: 'Maya', pronouns: 'she/her' },
  'Catch': { name: 'Leo', pronouns: 'he/him' },
  'Remind': { name: 'Quinn', pronouns: 'they/them' },
  'Roster': { name: 'Claire', pronouns: 'she/her' },
  'Collect': { name: 'Ivy', pronouns: 'she/her' },
};

function VPAgentsView({ onOpenCreate }: { onOpenCreate?: () => void }) {
  const hiredCards: VPCardData[] = myAgents
    .filter((a) => a.status === 'Active')
    .map((a) => {
      const t = categoryTint[a.category] || { tint: 'linear-gradient(180deg, #F3F4F6 0%, #FAFAFA 100%)', accent: '#9CA3AF' };
      const p = hiredPersonas[a.name] || { name: 'Sense Agent', pronouns: 'it/its' };
      return {
        persona: p.name,
        pronouns: p.pronouns,
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
        img: a.img || agentDetective,
        tint: t.tint,
        accent: t.accent,
        stats: [
          { label: 'Skills', value: String(a.skills) },
          { label: 'Tools', value: String(a.tools) },
          { label: 'Runs', value: a.runs.toLocaleString() },
        ],
        highlights: highlightsByCategory[a.category] || ['Connected to your Zuper data', 'Runs on your schedule', 'Learns from every interaction'],
        quote: hiredQuotes[a.name] || 'I plug into your Zuper workspace and quietly handle the work so your team can focus on customers.',
        pitch: hiredPitches[a.name] || { metric: `Running ${a.runs.toLocaleString()} times this month`, body: `${p.name} is already saving your team hours each week — keep momentum going.` },
        outcome: hiredOutcomes[a.name] || `${p.name} keeps doing the work in the background so your team can stay focused on customers.`,
      };
    });

  const catalogHighlights: Record<string, string[]> = {
    'Skyline': ['Pulls hourly multi-city forecasts', 'Auto-reschedules at-risk jobs', 'Morning digest before crews roll out'],
    'Echo': ['Tracks every new Google review', 'Auto-matches reviews to customers', 'Flags ratings under 4★ for follow-up'],
    'Catch': ['Captures web + webhook leads', 'Auto-tags by source + service', 'Creates Zuper job with crew assigned'],
    'Remind': ['Watches open quotes >3 days', 'Sends on-brand follow-up emails', 'Reports conversion lift weekly'],
    'Roster': ['Personal SMS per crew member', 'Includes drive route + parts list', 'Sent 45m before shift start'],
    'Collect': ['Scans invoices past 30/60/90 days', 'Drafts collection email per stage', 'Tracks who has + hasn\'t paid'],
  };

  const catalogCards: VPCardData[] = catalogItems.map((c) => {
    const p = catalogPersonas[c.title] || { name: 'Sense Agent', pronouns: 'it/its' };
    return ({
    persona: p.name,
    pronouns: p.pronouns,
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
    stats: [
      { label: 'Setup', value: '<5m' },
      { label: 'Tools', value: String(c.tags.length + 2) },
      { label: 'Hires', value: c.hires.toLocaleString() },
    ],
    highlights: catalogHighlights[c.title] || ['Plug-and-play setup', 'Customizable instructions', 'Free 7-day trial'],
    quote: catalogQuotes[c.title] || 'I run inside Zuper and take a recurring chore off your plate.',
    pitch: catalogPitches[c.title] || { metric: 'Recurring work is piling up', body: `${p.name} can take this off your plate today.` },
    outcome: catalogOutcomes[c.title] || `${p.name} takes this recurring chore off your plate — set up once and done.`,
  });
  });

  const createCard: VPCardData = {
    persona: 'Build your own',
    pronouns: 'custom',
    title: 'Custom Agent',
    role: 'Your design',
    desc: 'Start from a blank slate or duplicate any agent above. Pick the tools, write the instructions, set the schedule.',
    saves: 'Made by you',
    rating: 0,
    hires: 0,
    hired: false,
    tags: [{ icon: Wrench, label: 'Any tool' }, { icon: Sparkles, label: 'Any schedule' }],
    img: agentDetective,
    tint: 'linear-gradient(180deg, #F3F4F6 0%, #FAFAFA 100%)',
    accent: '#1C1E21',
    stats: [
      { label: 'Templates', value: '6' },
      { label: 'Tools', value: '20+' },
      { label: 'Setup', value: '10m' },
    ],
    highlights: [
      'Pick from 6 templates or start blank',
      'Connect any tool in your stack',
      'Test in a sandbox before going live',
    ],
    quote: "I don't exist yet — but I could. Tell me what you need automated and I'll show up tomorrow.",
    pitch: { metric: 'A custom problem deserves a custom agent', body: 'Build your own from a blank slate or remix an existing one.' },
    outcome: 'Build your own teammate from a blank slate. Pick the tools, write the instructions, ship in under an hour.',
    isCreate: true,
  };

  const allCards: VPCardData[] = [...hiredCards, ...catalogCards, createCard];
  const recommendedTitles = ['Coach', 'Compass', 'Echo', 'Skyline'];
  const recommendedCards: VPCardData[] = recommendedTitles
    .map((t) => allCards.find((c) => c.title === t))
    .filter((c): c is VPCardData => !!c);
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [profileAgent, setProfileAgent] = useState<VPCardData | null>(null);
  const setCreateOpen = (v: boolean) => { if (v) onOpenCreate?.(); };
  const [viewMode, setViewMode] = useState<'carousel' | 'catalog'>('carousel');
  const [catalogCat, setCatalogCat] = useState('All');
  const [catalogSearch, setCatalogSearch] = useState('');
  const catalogCategories = ['All', 'My agents', 'Sales', 'Operations', 'Support', 'Customer', 'Finance', 'Field'];
  const catalogGridCards = allCards.filter((c) => !c.isCreate).filter((c) => {
    if (catalogCat === 'My agents') {
      if (!c.hired) return false;
    } else if (catalogCat !== 'All' && !c.role.toLowerCase().includes(catalogCat.toLowerCase())) {
      return false;
    }
    if (catalogSearch && !`${c.persona} ${c.title} ${c.role}`.toLowerCase().includes(catalogSearch.toLowerCase())) return false;
    return true;
  });
  const next = () => { setDirection(1); setActiveIdx((i) => Math.min(i + 1, recommendedCards.length - 1)); };
  const prev = () => { setDirection(-1); setActiveIdx((i) => Math.max(i - 1, 0)); };
  const goTo = (i: number) => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i); };

  const panelOpen = false;

  if (profileAgent) {
    return <VPAgentProfilePage card={profileAgent} onBack={() => setProfileAgent(null)} />;
  }

  return (
    <div className="relative w-full">
      {/* Subtle off-white page background */}
      <div className="absolute inset-0 -mx-8 -mt-8 -mb-12 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FDFCFA 0%, #FBF8F4 50%, #F9F4EE 100%)' }} />
        <motion.div
          className="absolute"
          style={{ width: 820, height: 540, top: '-8%', left: '-10%', background: 'radial-gradient(ellipse at center, rgba(252,220,200,0.30), transparent 70%)', filter: 'blur(90px)', borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%' }}
          animate={{ x: [0, 80, -40, 0], y: [0, 60, 100, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute"
          style={{ width: 700, height: 480, top: '15%', right: '-12%', background: 'radial-gradient(ellipse at center, rgba(248,205,195,0.28), transparent 70%)', filter: 'blur(90px)', borderRadius: '45% 55% 60% 40% / 60% 45% 55% 40%' }}
          animate={{ x: [0, -90, -30, 0], y: [0, 80, 40, 0] }}
          transition={{ duration: 44, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute"
          style={{ width: 640, height: 420, bottom: '-8%', left: '25%', background: 'radial-gradient(ellipse at center, rgba(250,215,200,0.24), transparent 70%)', filter: 'blur(90px)', borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%' }}
          animate={{ x: [0, 100, -50, 0], y: [0, -50, -30, 0] }}
          transition={{ duration: 46, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><circle cx=%222%22 cy=%222%22 r=%220.8%22 fill=%22rgba(170,120,100,0.10)%22/></svg>")',
            backgroundSize: '24px 24px',
            filter: 'blur(1px)',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-10">
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Bot className="w-[20px] h-[20px] text-[#6B7280]" />
              <h1 className="text-[28px] font-semibold text-[#1C1E21] tracking-tight">Agents</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{allCards.length}</span>
            </div>
            <p className="text-[14px] text-[#6B7280] leading-relaxed">Your active teammates and the catalog of agents ready to hire. Browse, pick one, deploy in minutes.</p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] flex-shrink-0"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Create Agent
          </button>
        </div>

        {/* Marketplace hero banner — sense gradient composition */}
        <div
          className="relative overflow-hidden mb-12"
          style={{
            borderRadius: 18,
            padding: '36px 44px',
            minHeight: 260,
            background: 'linear-gradient(135deg, #FFF0E2 0%, #FFE8D4 22%, #FFD9C2 50%, #FFE0CC 78%, #FFEEDB 100%)',
            border: '1px solid rgba(255, 120, 80, 0.22)',
            boxShadow:
              '0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 0 0 1px rgba(255, 138, 76, 0.08), 0 22px 50px -22px rgba(220, 90, 50, 0.26), 0 8px 18px -10px rgba(220, 90, 50, 0.14)',
          }}
        >
          {/* Layer 1 — dot grid (z 1) */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full"
            style={{ opacity: 0.45, zIndex: 1 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="senseDots" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#B8410E" opacity="0.22" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#senseDots)" />
          </svg>

          {/* Layer 2 — top-left soft highlight (z 2) */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: -40,
              left: -20,
              width: 220,
              height: 180,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFFAF3 0%, #FFF1E5 50%, transparent 75%)',
              opacity: 0.85,
              filter: 'blur(20px)',
              zIndex: 2,
            }}
          />

          {/* Layer 3 — amber glow bottom-left (z 3) */}
          <div
            className="pointer-events-none absolute"
            style={{
              bottom: -60,
              left: -50,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFD089 0%, #FFC56B 40%, transparent 72%)',
              opacity: 0.5,
              filter: 'blur(32px)',
              zIndex: 3,
            }}
          />

          {/* Layer 4 — coral-pink mid orb (z 4) */}
          <div
            className="pointer-events-none absolute"
            style={{
              bottom: -80,
              left: '18%',
              width: 460,
              height: 380,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 50% 50%, #FFB5A0 0%, #FF9E8E 35%, #FFAFA0 60%, transparent 78%)',
              opacity: 0.55,
              filter: 'blur(40px)',
              zIndex: 4,
            }}
          />

          {/* Layer 5 — dominant tangerine orb top-right (z 5) */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: -80,
              right: -160,
              width: 480,
              height: 480,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 40%, #FFB68C 0%, #FF9968 35%, #FF8455 55%, transparent 75%)',
              opacity: 0.55,
              filter: 'blur(44px)',
              zIndex: 5,
            }}
          />

          {/* Layer 6 — sparkles (z 6) */}
          <svg
            className="pointer-events-none absolute"
            style={{ top: 28, right: 56, width: 22, height: 22, zIndex: 6 }}
            viewBox="0 0 24 24"
            fill="#E63946"
          >
            <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" />
          </svg>
          <svg
            className="pointer-events-none absolute"
            style={{ top: 96, right: 132, width: 12, height: 12, zIndex: 6 }}
            viewBox="0 0 24 24"
            fill="#FFC857"
          >
            <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" />
          </svg>
          <svg
            className="pointer-events-none absolute"
            style={{ bottom: 56, right: 180, width: 14, height: 14, zIndex: 6 }}
            viewBox="0 0 24 24"
            fill="#FF8A4C"
          >
            <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" />
          </svg>

          {/* Content (z 10) */}
          <div className="relative" style={{ zIndex: 10 }}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-6" style={{ background: 'linear-gradient(135deg, #F8A88B 0%, #F08465 100%)' }}>
              <Sparkles className="w-[12px] h-[12px] text-white" fill="currentColor" />
              <span className="text-[11.5px] font-semibold tracking-[0.10em] uppercase text-white">Sense Agents Marketplace</span>
            </div>
            <h2 className="text-[34px] font-semibold tracking-tight leading-[1.1] mb-5">
              <span className="text-[#1C1E21]">Hire pre-built agents.</span><br />
              <span style={{ color: '#E66B52' }}>Ship in minutes, not weeks.</span>
            </h2>
            <p className="text-[14.5px] text-[#1C1E21] leading-relaxed mb-6 max-w-[600px]">
              <span className="font-semibold">Sense Agents</span> are autonomous teammates that run inside Zuper — they read your data, take action, and learn over time.
            </p>
            <div className="flex items-center gap-5 text-[13px] text-[#1C1E21]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <span><span className="font-semibold">{catalogGridCards.length}+ agents</span> available</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="font-semibold">Free</span><span>starter agents</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span>Deploys in</span><span className="font-semibold">under 24h</span>
              </span>
            </div>
          </div>
        </div>

        <div className="px-24 mb-3 max-w-[1320px] mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-[18px] h-[18px] text-[#F59E0B]" fill="currentColor" />
            <h2 className="text-[20px] font-semibold text-[#1C1E21] tracking-tight">Recommended for you</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{recommendedCards.length}</span>
          </div>
          <p className="text-[13px] text-[#6B7280] mt-0.5">Picked by Sense based on your team's recent activity.</p>
        </div>

        <div className="relative w-full flex items-center" style={{ minHeight: 620 }}>
          <button
            onClick={prev}
            disabled={activeIdx === 0}
            aria-label="Previous agent"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#E6E8EC] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-[#FAFAFB] hover:border-[#1C1E21]/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5 text-[#1C1E21]" />
          </button>
          <button
            onClick={next}
            disabled={activeIdx === recommendedCards.length - 1}
            aria-label="Next agent"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#E6E8EC] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center hover:bg-[#FAFAFB] hover:border-[#1C1E21]/30 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5 text-[#1C1E21]" />
          </button>

          <div className="relative z-10 w-full max-w-[1320px] mx-auto px-24">
            <div className="relative rounded-3xl bg-white border border-[#E6E8EC] px-12 py-10 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
            {(() => {
              const card = recommendedCards[activeIdx];
              if (!card) return null;
              const hour = new Date().getHours();
              const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
              const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
              return (
                <motion.div
                  key={card.title}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-12 items-center"
                >
                  {/* LEFT: contextual recommendation */}
                  <div className="min-w-0">
                    {/* Personalized header */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11.5px] font-semibold tracking-[0.16em] uppercase text-[#9CA3AF]">{today}</span>
                        <span className="w-1 h-1 rounded-full bg-[#D1D5DB]" />
                        <span className="text-[11.5px] font-semibold tracking-[0.16em] uppercase" style={{ color: card.accent }}>
                          {card.hired ? 'Working for you' : 'Pick of the day'}
                        </span>
                      </div>
                      <h2 className="text-[28px] font-semibold text-[#1C1E21] leading-tight tracking-tight">
                        {greeting}, VP — <span style={{ color: card.accent }}>{card.persona}</span> can help you today.
                      </h2>
                    </div>

                    {/* Why this agent — data-grounded pitch */}
                    <div className="rounded-xl border border-[#FCD7D7] bg-[#FFFBFA] p-4 mb-6">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-[18px] h-[18px] text-[#F59E0B] fill-[#FEF3C7] flex-shrink-0 mt-0.5" strokeWidth={2.25} />
                        <p className="text-[14px] text-[#1C1E21] leading-relaxed">
                          <span className="font-semibold text-[#DC2626]">{card.pitch.metric}</span>
                          <span className="text-[#374151]"> — {card.pitch.body}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex mb-6">
                      <div className="w-[3px] rounded-full self-stretch flex-shrink-0" style={{ background: card.accent }} />
                      <p className="pl-4 italic text-[20px] text-[#1C1E21] leading-snug tracking-tight">“{card.quote}”</p>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-3">{card.persona} can help you with:</h3>
                    <ul className="space-y-2 mb-7">
                      {card.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[14px] text-[#374151] leading-snug">
                          <CheckCircle2 className="w-[15px] h-[15px] text-[#10B981] flex-shrink-0 mt-[2px]" strokeWidth={2.5} />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setProfileAgent(card)}
                        className="inline-flex items-center gap-1.5 px-5 h-11 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
                      >
                        {`Hire ${card.persona}`}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setProfileAgent(card)}
                        className="inline-flex items-center gap-1.5 px-4 h-11 rounded-lg border border-[#E6E8EC] bg-white text-[#1C1E21] text-[13.5px] font-medium hover:bg-[#F8F9FB] transition"
                      >
                        Learn more
                      </button>
                    </div>
                  </div>

                  {/* RIGHT: big card */}
                  <div className="flex justify-center lg:justify-end">
                    <VPAgentCard card={card} focused minimal onSelect={() => setProfileAgent(card)} />
                  </div>
                </motion.div>
              );
            })()}
            </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4 mb-1">
          {recommendedCards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to agent ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-6 bg-[#1C1E21]' : 'w-1.5 bg-[#D1D5DB] hover:bg-[#9CA3AF]'
              }`}
            />
          ))}
        </div>

        {/* CATALOG GRID — below recommended */}
        <div className="flex flex-col gap-6 mt-12">
            {/* Title + search */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-[18px] h-[18px] text-[#6B7280]" />
                  <h2 className="text-[20px] font-semibold text-[#1C1E21] tracking-tight">Browse Catalog</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold">{catalogGridCards.length}</span>
                </div>
                <p className="text-[13px] text-[#6B7280] mt-0.5">Pick one, customize it, deploy.</p>
              </div>
              <div className="relative w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-[#9CA3AF]" />
                <input
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search agents..."
                  className="w-full pl-9 pr-3 h-9 rounded-lg bg-white border border-[#E6E8EC] text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#1C1E21]/30 transition"
                />
              </div>
            </div>

            {/* Category chips */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-auto-hide -mt-2">
              {catalogCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCatalogCat(c)}
                  className={`px-3.5 h-8 rounded-full text-[12.5px] font-medium transition border whitespace-nowrap ${
                    catalogCat === c
                      ? 'bg-[#1C1E21] border-[#1C1E21] text-white'
                      : 'bg-white border-[#E6E8EC] text-[#4B5563] hover:border-[#1C1E21]/20'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
              {catalogGridCards.map((card) => (
                <div key={card.title} className="w-full min-w-0">
                  <VPAgentCard
                    card={card}
                    focused
                    compact
                    selected={profileAgent?.title === card.title}
                    onSelect={() => setProfileAgent(card)}
                  />
                </div>
              ))}
              {catalogGridCards.length === 0 && (
                <div className="col-span-full text-center py-12 text-[13px] text-[#9CA3AF]">No agents match your filters.</div>
              )}
            </div>
        </div>
      </div>
      </div>
    </div>
  );
}

function VPAgentDetailPanel({ card, onClose }: { card: VPCardData; onClose: () => void }) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'agent' | 'user'; text: string }[]>([
    { from: 'agent', text: `Hi! I'm ${card.persona}. Ask me anything about what I can do for your team.` },
  ]);

  const send = () => {
    const t = chatInput.trim();
    if (!t) return;
    setMessages((m) => [...m, { from: 'user', text: t }]);
    setChatInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'agent', text: `Great question — here's how I'd handle that: ${card.highlights[0].toLowerCase()}. I'd also keep a log so you stay in the loop.` }]);
    }, 600);
  };

  const onboarding = [
    { step: '01', title: 'Connect your data', desc: 'I plug into your Zuper workspace + the tools listed below. Takes under 5 minutes.' },
    { step: '02', title: 'Tune my instructions', desc: 'Tweak how I write, who I escalate to, and when I should pause for human review.' },
    { step: '03', title: 'I start working', desc: 'I run on the schedule you pick and report back. You can pause or change settings anytime.' },
  ];

  return (
    <div className="w-[420px] flex-shrink-0 rounded-2xl bg-white border border-[#E6E8EC] shadow-[0_18px_40px_-18px_rgba(28,30,33,0.18),0_4px_12px_-8px_rgba(28,30,33,0.08)] overflow-hidden flex flex-col self-stretch">
      {/* Hero */}
      <div className="relative h-[140px] flex-shrink-0" style={{ background: card.tint }}>
        <img src={card.img} alt={card.persona} className="absolute right-2 bottom-0 h-[100%] w-auto object-contain" draggable={false} />
        <button
          onClick={onClose}
          aria-label="Close panel"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur border border-[#E6E8EC] flex items-center justify-center hover:bg-white transition z-10"
        >
          <X className="w-4 h-4 text-[#1C1E21]" />
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[26px] font-semibold text-[#1C1E21] leading-none tracking-tight">{card.persona}</h2>
            <span className="text-[11.5px] text-[#4B5563] font-medium">{card.pronouns}</span>
          </div>
          <div className="text-[12px] text-[#374151] mt-1">
            <span className="font-medium">{card.title}</span>
            <span className="text-[#9CA3AF]"> · {card.role}</span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-auto-hide min-h-0">
        <div className="px-5 py-4 space-y-5">
          {/* About */}
          <section>
            <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2">About</div>
            <p className="text-[13px] text-[#4B5563] leading-relaxed">{card.desc}</p>
          </section>

          {/* Stats */}
          <section>
            <div className="grid grid-cols-3 rounded-xl bg-[#FAFAFB] border border-[#F0F1F3] overflow-hidden">
              {card.stats.map((s, i) => (
                <div key={i} className={`px-3 py-3 ${i < card.stats.length - 1 ? 'border-r border-[#F0F1F3]' : ''}`}>
                  <div className="text-[18px] font-semibold text-[#1C1E21] leading-none tabular-nums">{s.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.1em] text-[#9CA3AF] mt-1.5 font-semibold">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Capabilities */}
          <section>
            <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2.5">What {card.persona} can do</div>
            <ul className="space-y-2">
              {card.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-[#374151] leading-snug">
                  <CheckCircle2 className="w-[14px] h-[14px] text-[#10B981] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Onboarding */}
          <section>
            <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2.5">When you hire {card.persona}</div>
            <ol className="space-y-3">
              {onboarding.map((o) => (
                <li key={o.step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#1C1E21] text-white text-[11px] font-semibold flex items-center justify-center tabular-nums">{o.step}</span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold text-[#1C1E21] leading-snug">{o.title}</div>
                    <p className="text-[12px] text-[#6B7280] leading-relaxed mt-0.5">{o.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Tools */}
          <section>
            <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2.5">Tools & triggers</div>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((t, i) => {
                const Icon = t.icon;
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[12px] font-medium text-[#4B5563]">
                    <Icon className="w-[12px] h-[12px] text-[#9CA3AF]" />
                    {t.label}
                  </span>
                );
              })}
            </div>
          </section>

          {/* Chat */}
          <section>
            <div className="text-[10.5px] font-semibold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2.5">Chat with {card.persona}</div>
            <div className="rounded-xl border border-[#E6E8EC] overflow-hidden bg-[#FAFAFB]">
              <div className="p-3 space-y-2 max-h-[180px] overflow-y-auto scrollbar-auto-hide">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-[12.5px] leading-snug ${
                        m.from === 'user'
                          ? 'bg-[#1C1E21] text-white'
                          : 'bg-white border border-[#E6E8EC] text-[#1C1E21]'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 px-2.5 py-2 border-t border-[#E6E8EC] bg-white">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={`Ask ${card.persona} anything...`}
                  className="flex-1 bg-transparent text-[12.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] outline-none px-1"
                />
                <button
                  onClick={send}
                  disabled={!chatInput.trim()}
                  className="w-8 h-8 rounded-lg bg-[#1C1E21] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition"
                  aria-label="Send"
                >
                  <ArrowUp className="w-[14px] h-[14px]" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 py-3.5 border-t border-[#F0F1F3] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <Star className="w-[13px] h-[13px] text-[#F59E0B] fill-[#F59E0B]" />
          <span className="font-semibold text-[#1C1E21] tabular-nums">{card.rating.toFixed(1)}</span>
          <span className="text-[#9CA3AF]">· {card.hires.toLocaleString()} {card.hired ? 'users' : 'hires'}</span>
        </div>
        <button className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
          {`Hire ${card.persona}`}
          <ArrowRight className="w-[13px] h-[13px]" />
        </button>
      </div>
    </div>
  );
}

function VPAgentCard({ card, focused = false, selected = false, onSelect, compact = false, minimal = false }: { card: VPCardData; focused?: boolean; selected?: boolean; onSelect?: () => void; compact?: boolean; minimal?: boolean }) {
  const widthCls = compact ? 'w-full' : 'w-[460px]';
  if (card.isCreate) {
    return (
      <div
        onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
        className={`group rounded-2xl bg-gradient-to-br from-[#FAFAFB] to-[#F3F4F6] overflow-hidden flex flex-col items-center justify-center ${widthCls} h-full transition-all duration-500 cursor-pointer ${
          focused
            ? 'border-2 border-dashed border-[#1C1E21]/40 shadow-[0_24px_48px_-20px_rgba(28,30,33,0.18)]'
            : 'border-2 border-dashed border-[#D1D5DB] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
        }`}
        style={{ minHeight: 540 }}
      >
        <div className="flex flex-col items-center text-center px-8 py-10">
          <div className="w-20 h-20 rounded-2xl bg-white border border-[#E6E8EC] shadow-[0_6px_16px_rgba(0,0,0,0.06)] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
            <Plus className="w-10 h-10 text-[#1C1E21]" strokeWidth={2} />
          </div>
          <h3 className="text-[22px] font-semibold text-[#1C1E21] mb-2 tracking-tight">Build your own</h3>
          <p className="text-[13px] text-[#6B7280] leading-relaxed mb-6 max-w-[300px]">Start blank or remix any agent. Pick the tools, write the instructions, ship in under an hour.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#E6E8EC] text-[11.5px] font-medium text-[#4B5563]">
              <Wrench className="w-[11px] h-[11px] text-[#9CA3AF]" />
              Any tool
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#E6E8EC] text-[11.5px] font-medium text-[#4B5563]">
              <Sparkles className="w-[11px] h-[11px] text-[#9CA3AF]" />
              Any schedule
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#E6E8EC] text-[11.5px] font-medium text-[#4B5563]">
              <Layers className="w-[11px] h-[11px] text-[#9CA3AF]" />
              6 templates
            </span>
          </div>
          <button
            className="inline-flex items-center gap-1.5 px-5 h-10 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Create Agent
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`group rounded-2xl bg-white overflow-hidden flex flex-col ${widthCls} transition-all duration-500 ${
        selected
          ? 'border-2 border-[#1C1E21] shadow-[0_24px_48px_-20px_rgba(28,30,33,0.28),0_0_0_4px_rgba(28,30,33,0.06)]'
          : minimal
          ? 'border border-[#E6E8EC]'
          : focused
          ? 'border border-[#E6E8EC] shadow-[0_24px_48px_-20px_rgba(28,30,33,0.18),0_6px_16px_-8px_rgba(28,30,33,0.08)]'
          : 'border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="relative h-[280px] overflow-hidden flex-shrink-0" style={{ background: card.tint }}>
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${card.accent}40, transparent 70%)` }} />
        {/* Noise grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.18] mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
          }}
        />
        <img
          src={card.img}
          alt={card.title}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[100%] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          draggable={false}
        />
        {card.hired ? (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[#15803D] text-[11px] font-bold tracking-[0.14em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Active
          </span>
        ) : card.featured ? (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm text-[#B45309] text-[11px] font-bold tracking-[0.14em] uppercase">
            <Star className="w-[11px] h-[11px] text-[#F59E0B] fill-[#F59E0B]" />
            Featured
          </span>
        ) : null}
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#ECFDF5] text-[#15803D] text-[11px] font-bold tracking-[0.14em] uppercase">
          <Zap className="w-[11px] h-[11px]" fill="currentColor" />
          {card.saves}
        </span>
      </div>

      <div className="px-5 pt-5 pb-5 flex-1 flex flex-col">
        <div className="text-[10.5px] font-bold tracking-[0.16em] uppercase text-[#9CA3AF] mb-1.5">{card.role}</div>
        <h3 className="text-[20px] font-semibold text-[#1C1E21] leading-snug tracking-tight">{card.title}</h3>
        {!minimal && !card.isCreate && (
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[13.5px] font-semibold" style={{ color: card.accent }}>{card.persona}</span>
            <span className="text-[11px] text-[#9CA3AF]">{card.pronouns}</span>
          </div>
        )}
        {!minimal && (
          <>
            <p className="text-[13px] text-[#374151] leading-relaxed mt-3 mb-3">{card.outcome}</p>
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {card.tags.map((t, i) => {
                const Icon = t.icon;
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[11.5px] font-medium text-[#4B5563]">
                    <Icon className="w-[11px] h-[11px] text-[#9CA3AF]" />
                    {t.label}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="border-t border-[#F0F1F3] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[12.5px]">
          <Star className="w-[13px] h-[13px] text-[#F59E0B] fill-[#F59E0B]" />
          <span className="font-semibold text-[#1C1E21] tabular-nums">{card.rating.toFixed(1)}</span>
          <span className="text-[#9CA3AF]">· {card.hires.toLocaleString()} {card.hired ? 'users' : 'hires'}</span>
        </div>
        {minimal ? (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
            className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#1C1E21] hover:text-black transition"
          >
            View profile
            <ArrowRight className="w-[12px] h-[12px]" />
          </button>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); onSelect?.(); }}
            className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]"
          >
            {card.hired ? 'Open' : `Hire ${card.persona}`}
            <ArrowRight className="w-[13px] h-[13px]" />
          </button>
        )}
      </div>
    </div>
  );
}


function VPAgentProfilePage({ card, onBack }: { card: VPCardData; onBack: () => void }) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<{ from: 'agent' | 'user'; text: string }[]>([
    { from: 'agent', text: `Hi! I'm ${card.persona}. Ask me what I do, how I'm set up, or what would change in your first week with me.` },
  ]);

  const send = (text?: string) => {
    const t = (text ?? chatInput).trim();
    if (!t) return;
    setMessages((m) => [...m, { from: 'user', text: t }]);
    setChatInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'agent', text: `Short version: ${card.highlights[0].toLowerCase()}. I also ${card.highlights[1]?.toLowerCase() || 'log everything so you stay in the loop'}, and I flag edge cases for human review.` }]);
    }, 600);
  };

  const suggestedQs = [
    'What exactly do you do?',
    'How long is setup?',
    'What tools do you connect to?',
    'Show me a sample run',
  ];

  const onboardingSteps = [
    { num: '01', title: 'Connect', desc: 'One-click auth to your Zuper workspace. Under 60 seconds.' },
    { num: '02', title: 'Tune', desc: 'Tell me when to act, when to ask, and what to never touch.' },
    { num: '03', title: 'Ship', desc: 'I run on your schedule and report back. Pause anytime.' },
  ];

  return (
    <div className="relative w-full" style={{ marginTop: -32, marginLeft: -32, marginRight: -32, marginBottom: -48, minHeight: 'calc(100vh - 0px)' }}>
      {/* Subtle off-white page background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #FDFCFA 0%, #FBF8F4 50%, #F9F4EE 100%)' }} />
        <motion.div
          className="absolute"
          style={{ width: 820, height: 540, top: '-8%', left: '-10%', background: 'radial-gradient(ellipse at center, rgba(252,220,200,0.30), transparent 70%)', filter: 'blur(90px)', borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%' }}
          animate={{ x: [0, 80, -40, 0], y: [0, 60, 100, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute"
          style={{ width: 700, height: 480, top: '15%', right: '-12%', background: 'radial-gradient(ellipse at center, rgba(248,205,195,0.28), transparent 70%)', filter: 'blur(90px)', borderRadius: '45% 55% 60% 40% / 60% 45% 55% 40%' }}
          animate={{ x: [0, -90, -30, 0], y: [0, 80, 40, 0] }}
          transition={{ duration: 44, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute"
          style={{ width: 640, height: 420, bottom: '-8%', left: '25%', background: 'radial-gradient(ellipse at center, rgba(250,215,200,0.24), transparent 70%)', filter: 'blur(90px)', borderRadius: '55% 45% 50% 50% / 45% 55% 45% 55%' }}
          animate={{ x: [0, 100, -50, 0], y: [0, -50, -30, 0] }}
          transition={{ duration: 46, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><circle cx=%222%22 cy=%222%22 r=%220.8%22 fill=%22rgba(170,120,100,0.10)%22/></svg>")',
            backgroundSize: '24px 24px',
            filter: 'blur(1px)',
          }}
        />
      </div>

      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[#E6E8EC]">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-3">
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1C1E21] hover:text-black transition">
            <ChevronLeft className="w-4 h-4" />
            Back to Agents
          </button>
          <div className="flex items-center gap-2">
            <button className="px-3 h-9 rounded-lg border border-[#E6E8EC] bg-white text-[#1C1E21] text-[13px] font-medium hover:bg-[#F8F9FB] transition inline-flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
              {`Hire ${card.persona}`}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
        <div className="min-w-0 space-y-6">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-2xl border border-[#E6E8EC]" style={{ background: card.tint }}>
            <div className="absolute -top-20 -right-20 w-[360px] h-[360px] rounded-full opacity-40" style={{ background: `radial-gradient(circle, ${card.accent}50, transparent 70%)` }} />
            <div className="absolute -bottom-24 -left-16 w-[320px] h-[320px] rounded-full opacity-25" style={{ background: `radial-gradient(circle, ${card.accent}40, transparent 70%)` }} />
            <div className="absolute inset-0 opacity-[0.14] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")' }} />
            <div className="relative grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 px-7 pt-8 pb-7 items-end">
              <div>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {card.hired ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#15803D] text-[10.5px] font-bold tracking-[0.14em] uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      Active in your workspace
                    </span>
                  ) : card.featured ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#92400E] text-[10.5px] font-bold tracking-[0.14em] uppercase">
                      <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                      Featured
                    </span>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#15803D] text-[10.5px] font-bold tracking-[0.14em] uppercase">
                    <Zap className="w-3 h-3" fill="currentColor" />
                    {card.saves}
                  </span>
                </div>
                <div className="text-[11px] font-bold tracking-[0.16em] uppercase mb-2" style={{ color: card.accent }}>{card.role}</div>
                <h1 className="text-[40px] font-semibold text-[#1C1E21] tracking-tight leading-[1.05] mb-1">{card.persona}</h1>
                <div className="text-[14px] text-[#374151] mb-4">
                  Your <span className="font-semibold text-[#1C1E21]">{card.title}</span>
                  <span className="text-[#9CA3AF]"> · {card.pronouns}</span>
                </div>
                <p className="text-[15px] text-[#374151] leading-relaxed max-w-[440px]">{card.outcome}</p>
              </div>
              <div className="hidden md:flex items-end justify-center">
                <img src={card.img} alt={card.persona} className="h-[250px] w-auto object-contain" draggable={false} />
              </div>
            </div>
          </section>

          {/* Vital stats strip */}
          <section className="rounded-2xl border border-[#E6E8EC] bg-white px-6 py-5">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 divide-x divide-[#F0F1F3]">
              <div className="md:pr-2">
                <div className="flex items-baseline gap-1">
                  <Star className="w-[14px] h-[14px] text-[#F59E0B] fill-[#F59E0B] self-center" />
                  <span className="text-[22px] font-semibold text-[#1C1E21] tabular-nums leading-none">{card.rating.toFixed(1)}</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-[#9CA3AF] font-semibold mt-1.5">Avg rating</div>
              </div>
              {card.stats.map((s, i) => (
                <div key={i} className="md:px-2">
                  <div className="text-[22px] font-semibold text-[#1C1E21] leading-none tabular-nums">{s.value}</div>
                  <div className="text-[11px] uppercase tracking-[0.1em] text-[#9CA3AF] font-semibold mt-1.5">{s.label}</div>
                </div>
              ))}
              <div className="md:pl-2">
                <div className="text-[22px] font-semibold text-[#1C1E21] leading-none tabular-nums">{card.hires.toLocaleString()}</div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-[#9CA3AF] font-semibold mt-1.5">{card.hired ? 'Teams' : 'Hires'}</div>
              </div>
            </div>
          </section>

          {/* What it does */}
          <section className="rounded-2xl border border-[#E6E8EC] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-[16px] h-[16px]" style={{ color: card.accent }} />
              <h2 className="text-[18px] font-semibold text-[#1C1E21] tracking-tight">What {card.persona} does</h2>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {card.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-[#1C1E21] leading-snug">
                  <CheckCircle2 className="w-[15px] h-[15px] text-[#10B981] flex-shrink-0 mt-[2px]" strokeWidth={2.5} />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Quote */}
          <section className="relative rounded-2xl bg-[#1C1E21] text-white p-7 overflow-hidden">
            <div className="absolute inset-0 opacity-[0.10] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")' }} />
            <div className="relative">
              <Star className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B] mb-3" />
              <p className="text-[18px] font-medium leading-relaxed italic text-white/95">"{card.quote}"</p>
              <div className="text-[12px] text-white/55 mt-3 tracking-wide uppercase font-semibold">— {card.persona}, in their own words</div>
            </div>
          </section>

          {/* How it works */}
          <section className="rounded-2xl border border-[#E6E8EC] bg-white p-6">
            <div className="flex items-center gap-2 mb-5">
              <RefreshCw className="w-[16px] h-[16px]" style={{ color: card.accent }} />
              <h2 className="text-[18px] font-semibold text-[#1C1E21] tracking-tight">How it works</h2>
            </div>
            <ol className="space-y-4">
              {onboardingSteps.map((o) => (
                <li key={o.num} className="flex items-start gap-3.5">
                  <span className="flex-shrink-0 w-9 h-9 rounded-lg text-white text-[12px] font-semibold flex items-center justify-center tabular-nums" style={{ background: card.accent }}>{o.num}</span>
                  <div className="min-w-0 pt-1">
                    <div className="text-[14.5px] font-semibold text-[#1C1E21] leading-snug">{o.title}</div>
                    <p className="text-[13px] text-[#6B7280] leading-relaxed mt-0.5">{o.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Tools */}
          <section className="rounded-2xl border border-[#E6E8EC] bg-white p-6">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-[16px] h-[16px]" style={{ color: card.accent }} />
              <h2 className="text-[18px] font-semibold text-[#1C1E21] tracking-tight">Tools & triggers</h2>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {card.tags.map((t, i) => {
                const Icon = t.icon;
                return (
                  <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#F3F4F6] text-[12.5px] font-medium text-[#1C1E21]">
                    <Icon className="w-[13px] h-[13px] text-[#6B7280]" />
                    {t.label}
                  </span>
                );
              })}
            </div>
          </section>

          {/* Testimonial */}
          <section className="rounded-2xl border border-[#E6E8EC] bg-white p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1C1E21] text-white text-[13px] font-semibold flex items-center justify-center flex-shrink-0">JR</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-2">
                  {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />)}
                </div>
                <p className="text-[14px] text-[#1C1E21] leading-relaxed mb-2">"Felt like adding a teammate, not a tool. Set {card.persona} up on a Tuesday — by Friday she'd handled work I forgot about."</p>
                <div className="text-[12px] text-[#9CA3AF]">Jamie Rivera · Ops Lead, Coastal Roofing · 4 weeks ago</div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="relative overflow-hidden rounded-2xl border border-[#E6E8EC]" style={{ background: card.tint }}>
            <div className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full opacity-50" style={{ background: `radial-gradient(circle, ${card.accent}40, transparent 70%)` }} />
            <div className="absolute inset-0 opacity-[0.14] mix-blend-multiply pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")' }} />
            <div className="relative px-7 py-7">
              <h2 className="text-[24px] font-semibold text-[#1C1E21] tracking-tight leading-tight mb-1">Ready to hire {card.persona}?</h2>
              <p className="text-[14px] text-[#374151] mb-5 leading-relaxed">Setup takes under 5 minutes. Cancel anytime — no contracts.</p>
              <button className="inline-flex items-center gap-1.5 px-5 h-11 rounded-xl bg-[#1C1E21] hover:bg-black text-white text-[14px] font-semibold transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)]">
                {`Hire ${card.persona}`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT: persistent chat panel */}
        <aside className="lg:sticky lg:top-[72px] self-start">
          <div className="rounded-2xl border border-[#E6E8EC] bg-white overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 100px)', minHeight: 560 }}>
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F0F1F3] bg-[#FAFAFB] flex-shrink-0">
              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ background: card.tint }}>
                <img src={card.img} alt={card.persona} className="absolute inset-0 w-full h-full object-cover object-top" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#10B981] border-2 border-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold text-[#1C1E21] leading-tight">Chat with {card.persona}</div>
                <div className="text-[11.5px] text-[#10B981] font-medium">● Online · responds instantly</div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-auto-hide p-4 space-y-3 min-h-0">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.from === 'agent' && (
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-auto" style={{ background: card.tint }}>
                      <img src={card.img} alt="" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${m.from === 'user' ? 'bg-[#1C1E21] text-white rounded-br-sm' : 'bg-[#F3F4F6] text-[#1C1E21] rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#F0F1F3] p-3 bg-white flex-shrink-0">
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {suggestedQs.map((q) => (
                  <button key={q} onClick={() => send(q)} className="px-2.5 py-1 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[11.5px] text-[#4B5563] font-medium transition">
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E6E8EC] bg-white focus-within:border-[#1C1E21]/30 transition">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={`Ask ${card.persona} anything...`}
                  className="flex-1 bg-transparent text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] outline-none"
                />
                <button onClick={() => send()} disabled={!chatInput.trim()} className="w-8 h-8 rounded-lg bg-[#1C1E21] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition flex-shrink-0" aria-label="Send">
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function VPCreateAgentView({ onClose }: { onClose: () => void }) {
  const steps = [
    { key: 'profile', label: 'Agent profile' },
    { key: 'powers', label: 'Superpowers' },
    { key: 'knowledge', label: 'Knowledge base' },
    { key: 'route', label: 'Add to route' },
    { key: 'advanced', label: 'Advanced' },
  ] as const;
  type StepKey = typeof steps[number]['key'];

  const [step, setStep] = useState<StepKey>('profile');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [tone, setTone] = useState('');
  const [voice, setVoice] = useState('');
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [skills, setSkills] = useState<Record<string, boolean>>({});
  const [knowledge, setKnowledge] = useState<Record<string, boolean>>({});
  const [questions, setQuestions] = useState<Record<string, { on: boolean; required: boolean }>>({
    q1: { on: false, required: false },
    q2: { on: false, required: false },
    q3: { on: false, required: false },
  });
  const [freq, setFreq] = useState<'hour' | 'day' | 'week' | 'month' | 'weekdays' | 'custom'>('week');
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [trigState, setTrigState] = useState({ scheduled: false, mention: false, webhook: false });
  const [mentionScope, setMentionScope] = useState({ chat: true, comments: true, dm: false });
  const [standaloneTools, setStandaloneTools] = useState<Record<string, boolean>>({});
  const [model, setModel] = useState<'lite' | 'pro'>('lite');
  const [temperature, setTemperature] = useState(0.7);
  const [memory, setMemory] = useState({ recent: false, working: false });
  const [mode, setMode] = useState<'create' | 'chat'>('create');
  const [chatInput, setChatInput] = useState('');
  type ChatStage = 'task' | 'name' | 'desc' | 'tone' | 'voice' | 'skills' | 'knowledge' | 'triggers' | 'model' | 'done';
  const [chatStage, setChatStage] = useState<ChatStage>('task');
  const [chatMessages, setChatMessages] = useState<{ from: 'agent' | 'user'; text: string }[]>([
    { from: 'agent', text: "Hi! I'll help you build your agent in a few steps — just answer in plain English. To kick off: what task would you like to automate?" },
  ]);

  const taskSuggestions = [
    'Follow up on stalled quotes',
    'Catch unhappy customers before they post a review',
    'Reschedule jobs when weather changes',
    'Chase overdue invoices automatically',
    'Send daily route briefs to my crew',
    'Qualify inbound leads in 60 seconds',
  ];
  const toneOptions = ['Friendly & Approachable', 'Professional', 'Concise & Direct', 'Warm & Empathetic'];
  const voiceOptions = ['Nova (Female)', 'Atlas (Male)', 'Sage (Neutral)'];
  const skillSuggestions = ['Create Job', 'Create Customer', 'Add Job Note', 'Create Invoice'];
  const knowledgeOptions = ['Zuper Documentation', 'Quickbooks API', 'Both', 'Skip for now'];
  const triggerOptions = ['Scheduled run', 'On mention', 'Webhook', 'All of the above'];
  const modelOptions = ['Zuper Lite (faster, cheaper)', 'Zuper Pro (smarter, costlier)'];

  const stageSuggestions: Record<ChatStage, string[]> = {
    task: taskSuggestions,
    name: ['Nova', 'Atlas', 'Sage', 'Ivy'],
    desc: [],
    tone: toneOptions,
    voice: voiceOptions,
    skills: skillSuggestions,
    knowledge: knowledgeOptions,
    triggers: triggerOptions,
    model: modelOptions,
    done: [],
  };

  const stagePrompt: Record<ChatStage, string> = {
    task: 'what task would you like to automate?',
    name: 'great — what should we name this agent?',
    desc: 'in one sentence, how would you describe what they do?',
    tone: 'how should they sound when talking to customers?',
    voice: 'pick a voice for them.',
    skills: 'which skills should they have? you can pick more than one.',
    knowledge: 'which knowledge source should they read from?',
    triggers: 'when should they jump in?',
    model: 'last one — which model should power them?',
    done: '',
  };

  const advanceStage = (stage: ChatStage): ChatStage => {
    const order: ChatStage[] = ['task', 'name', 'desc', 'tone', 'voice', 'skills', 'knowledge', 'triggers', 'model', 'done'];
    return order[Math.min(order.indexOf(stage) + 1, order.length - 1)];
  };

  const sendChat = (text?: string) => {
    const t = (text ?? chatInput).trim();
    if (!t) return;
    setChatMessages((m) => [...m, { from: 'user', text: t }]);
    setChatInput('');

    // Apply input to form state based on current stage
    if (chatStage === 'task') {
      setDesc(t);
    } else if (chatStage === 'name') {
      setName(t);
    } else if (chatStage === 'desc') {
      setDesc(t);
    } else if (chatStage === 'tone') {
      setTone(t);
    } else if (chatStage === 'voice') {
      setVoice(t);
    } else if (chatStage === 'skills') {
      const key = t.toLowerCase().replace(/[^a-z]/g, '').replace('createjob', 'createJob').replace('createcustomer', 'createCustomer').replace('addjobnote', 'addJobNote').replace('createinvoice', 'createInvoice');
      const map: Record<string, string> = { 'Create Job': 'createJob', 'Create Customer': 'createCustomer', 'Add Job Note': 'addJobNote', 'Create Invoice': 'createInvoice' };
      const k = map[t] || key;
      if (k) setSkills((p) => ({ ...p, [k]: true }));
    } else if (chatStage === 'knowledge') {
      if (t.toLowerCase().includes('zuper')) setKnowledge((p) => ({ ...p, zuperDocs: true }));
      if (t.toLowerCase().includes('quickbooks') || t.toLowerCase().includes('both')) setKnowledge((p) => ({ ...p, qbo: true }));
      if (t.toLowerCase().includes('both')) setKnowledge((p) => ({ ...p, zuperDocs: true, qbo: true }));
    } else if (chatStage === 'triggers') {
      const lower = t.toLowerCase();
      const next = { ...trigState };
      if (lower.includes('scheduled') || lower.includes('all')) next.scheduled = true;
      if (lower.includes('mention') || lower.includes('all')) next.mention = true;
      if (lower.includes('webhook') || lower.includes('all')) next.webhook = true;
      setTrigState(next);
    } else if (chatStage === 'model') {
      setModel(t.toLowerCase().includes('pro') ? 'pro' : 'lite');
    }

    const next = advanceStage(chatStage);
    setChatStage(next);

    setTimeout(() => {
      if (next === 'done') {
        setChatMessages((m) => [
          ...m,
          { from: 'agent', text: `All set 🎉 Your agent is ready. Here's a quick summary:` },
          { from: 'agent', text: `• Name: ${name || (chatStage === 'name' ? t : '—')}\n• Voice: ${voice || (chatStage === 'voice' ? t : '—')}\n• Tone: ${tone || (chatStage === 'tone' ? t : '—')}\n• Skills, knowledge, and triggers are configured.\n\nSwitch to Create view to fine-tune anything, or hit Deploy.` },
        ]);
      } else {
        const intro = chatStage === 'task' ? `Got it — "${t}". ` : 'Nice. ';
        setChatMessages((m) => [...m, { from: 'agent', text: `${intro}${stagePrompt[next].charAt(0).toUpperCase() + stagePrompt[next].slice(1)}` }]);
      }
    }, 600);
  };

  const chatSuggestions = stageSuggestions[chatStage] || [];

  const avatars = [agentDetective, agentCreator, agentMarketer, agentSupport, agentReviews, agentClassic1, agentClassic2, agentClassic3];
  const shuffleAvatar = () => setAvatarIdx((i) => (i + 1) % avatars.length);
  const currentAvatar = avatars[avatarIdx];

  const stepIdx = steps.findIndex((s) => s.key === step);
  const goNext = () => {
    if (stepIdx < steps.length - 1) setStep(steps[stepIdx + 1].key);
    else onClose();
  };
  const goBack = () => {
    if (stepIdx > 0) setStep(steps[stepIdx - 1].key);
    else onClose();
  };

  const skillList = [
    { key: 'createJob', name: 'Create Job', desc: 'Gather job details from conversation, validate required fields, and create a new job in Zuper.', Icon: Plus, predefined: true },
    { key: 'createCustomer', name: 'Create Customer', desc: 'Collect customer information, validate, and create a new customer record in Zuper.', Icon: Users, predefined: true },
    { key: 'addJobNote', name: 'Add Job Note', desc: 'Identify a job, compose a contextual note, and attach it to the job in Zuper.', Icon: Pencil, predefined: true },
    { key: 'createInvoice', name: 'Create Invoice', desc: 'Gather invoice details from job and customer context, validate line items, and create in Zuper.', Icon: Mail, predefined: true },
    { key: 'execSummary', name: 'Write Executive Summary', desc: 'Fetch job details and compose a structured professional executive summary.', Icon: Sparkles, predefined: true },
    { key: 'findCustomer', name: 'Find Zuper Customer by Name', desc: 'Search Zuper customers by name keyword and classify the result as a single match, multiple ambiguous candidates, or none.', Icon: Search, predefined: true },
  ];

  const comingSoonSkills: { key: string; name: string; desc: string; Icon: any }[] = [];

  const standaloneToolList = [
    { key: 'sendEmail', name: 'Send Email', desc: 'Send an email to a specified recipient with subject and body.', Icon: Mail },
    { key: 'sendSlack', name: 'Send Slack Message', desc: 'Send a message to a Slack channel via webhook.', Icon: MessageSquare },
    { key: 'webSearch', name: 'Web Search', desc: 'Search the web and return relevant results with extracted content.', Icon: Search },
    { key: 'getWeather', name: 'Get Weather', desc: 'Fetch a daily weather forecast for given lat/lon coordinates via Open-Meteo.', Icon: Wrench },
  ];

  const questionList = [
    { key: 'q1', label: 'Can I get your name and the service address?' },
    { key: 'q2', label: 'What issue are you facing today?' },
    { key: 'q3', label: 'When is a convenient time to visit?' },
  ];

  const kbList = [
    { key: 'zuperDocs', name: 'Zuper Documentation', url: 'https://docs.zuper.co', badges: ['PREDEFINED', 'MCP'], status: 'Connected' },
    { key: 'qbo', name: 'Quickbooks API Error', url: 'https://developer.intuit.com/app/developer/qbo/docs/d...', badges: ['WEB'], status: 'Ready' },
  ];

  const frequencies: { key: typeof freq; label: string }[] = [
    { key: 'hour', label: 'Every hour' },
    { key: 'day', label: 'Every day' },
    { key: 'week', label: 'Every week' },
    { key: 'month', label: 'Every month' },
    { key: 'weekdays', label: 'Weekdays' },
    { key: 'custom', label: 'Custom' },
  ];

  const activeSkillKey = Object.keys(skills).find((k) => skills[k]) || skillList[0].key;
  const activeSkill = skillList.find((s) => s.key === activeSkillKey) || skillList[0];
  const selectAll = () => {
    const all: Record<string, boolean> = {};
    skillList.forEach((s) => (all[s.key] = true));
    setSkills(all);
  };

  const stepHints: Record<StepKey, string> = {
    profile: 'Give your agent a name, voice, and personality.',
    powers: 'Pick the skills and tools they can use.',
    knowledge: 'Connect the data sources they should know.',
    route: 'Decide when and where they jump in.',
    advanced: 'Fine-tune the model and memory.',
  };

  return (
    <div className="w-full h-full flex items-stretch overflow-hidden">
      {/* LEFT: vertical progress sidebar */}
      <aside className="w-[240px] flex-shrink-0 border-r border-[#E6E8EC] bg-[#FAFAFB] flex flex-col">
        <div className="px-5 pt-6 pb-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1C1E21] hover:text-[#000] transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Agents
          </button>
        </div>
        <div className="px-5 pb-2">
          <div className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-[#9CA3AF] mb-3">Build your agent</div>
        </div>
        <nav className="px-3 flex-1 overflow-y-auto scrollbar-auto-hide">
          {steps.map((s, i) => {
            const active = s.key === step;
            const done = i < stepIdx;
            return (
              <button
                key={s.key}
                onClick={() => setStep(s.key)}
                className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition mb-0.5 ${
                  active ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#E6E8EC]' : 'hover:bg-white'
                }`}
              >
                <span
                  className={`relative w-[20px] h-[20px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition ${
                    active ? 'bg-[#1C1E21]' : done ? 'bg-[#10B981]' : 'border-2 border-[#D1D5DB] bg-white'
                  }`}
                >
                  {active && <span className="text-white text-[11px] font-semibold tabular-nums">{i + 1}</span>}
                  {done && <Check className="w-[12px] h-[12px] text-white" strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className={`text-[13.5px] font-semibold leading-tight ${active ? 'text-[#1C1E21]' : done ? 'text-[#15803D]' : 'text-[#9CA3AF]'}`}>{s.label}</div>
                  {active && (
                    <div className="text-[11.5px] text-[#6B7280] leading-snug mt-1">{stepHints[s.key]}</div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-[#E6E8EC] flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-[#E6E8EC] overflow-hidden">
            <div className="h-full bg-[#1C1E21] transition-all duration-300" style={{ width: `${((stepIdx + 1) / steps.length) * 100}%` }} />
          </div>
          <span className="text-[11px] font-semibold text-[#6B7280] tabular-nums">{stepIdx + 1}/{steps.length}</span>
        </div>
      </aside>

      {/* CENTER: form */}
      <div className="flex-1 min-w-0 overflow-y-auto scrollbar-auto-hide px-10 pt-8 pb-10 bg-white">
        {/* Mode switcher */}
        <div className="inline-flex items-center bg-[#F3F4F6] rounded-lg p-0.5 mb-6">
          <button
            onClick={() => setMode('create')}
            className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-md text-[13px] font-semibold transition ${
              mode === 'create' ? 'bg-white text-[#1C1E21] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            Create
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-md text-[13px] font-semibold transition ${
              mode === 'chat' ? 'bg-white text-[#1C1E21] shadow-[0_1px_3px_rgba(0,0,0,0.06)]' : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>
        </div>

        {mode === 'chat' ? (
          <div className="max-w-[640px] flex flex-col" style={{ minHeight: 'calc(100vh - 240px)' }}>
            <div className="mb-1">
              <h2 className="text-[26px] font-semibold text-[#1C1E21] tracking-tight mb-1">Describe your agent</h2>
              <p className="text-[14px] text-[#6B7280] mb-6">Tell me what task you'd like to automate and I'll suggest the right agent for you.</p>
            </div>

            <div className="flex-1 space-y-3 mb-4">
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.from === 'agent' && (
                    <div className="w-8 h-8 rounded-full bg-white border border-[#E6E8EC] flex items-center justify-center flex-shrink-0 mr-2.5 mt-auto shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                      <SenseLogo size={16} animated={false} />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${m.from === 'user' ? 'bg-[#1C1E21] text-white rounded-br-sm' : 'bg-[#F3F4F6] text-[#1C1E21] rounded-bl-sm'}`}>{m.text}</div>
                </div>
              ))}
            </div>

            {chatSuggestions.length > 0 && chatStage !== 'done' && (
              <div className="mb-4">
                <div className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2.5">
                  {chatStage === 'task' ? 'Suggested prompts' : 'Quick replies'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {chatSuggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendChat(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E6E8EC] text-[12.5px] font-medium text-[#1C1E21] hover:border-[#1C1E21]/30 hover:bg-[#FAFAFB] transition"
                    >
                      <Sparkles className="w-[11px] h-[11px] text-[#F08465]" fill="currentColor" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatStage === 'done' && (
              <div className="mb-4 rounded-xl border border-[#E6E8EC] bg-[#FAFAFB] p-4">
                <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2">All set</div>
                <button
                  onClick={() => setMode('create')}
                  className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13px] font-semibold transition"
                >
                  Review in Create view
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E6E8EC] bg-white focus-within:border-[#1C1E21]/30 transition">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                placeholder="Describe what you need automated…"
                className="flex-1 bg-transparent text-[13.5px] text-[#1C1E21] placeholder:text-[#9CA3AF] outline-none"
              />
              <button
                onClick={() => sendChat()}
                disabled={!chatInput.trim()}
                className="w-9 h-9 rounded-lg bg-[#1C1E21] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition flex-shrink-0"
                aria-label="Send"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
        <>
        <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >

        {/* Step content */}
        {step === 'profile' && (
          <div className="max-w-[560px]">
            <h2 className="text-[26px] font-semibold text-[#1C1E21] tracking-tight mb-1">About agent</h2>
            <p className="text-[14px] text-[#6B7280] mb-7">Configure your agent's personality and voice</p>

            {/* Avatar tile */}
            <div className="relative w-[88px] h-[88px] rounded-xl overflow-hidden mb-6" style={{ background: 'linear-gradient(180deg, #DBEAFE 0%, #EFF6FF 100%)' }}>
              <img src={currentAvatar} alt="Agent avatar" className="absolute inset-0 w-full h-full object-cover object-top" />
              <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
                <button className="w-7 h-7 rounded-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-[#F8F9FB] transition" aria-label="Edit avatar">
                  <Pencil className="w-3 h-3 text-[#1C1E21]" />
                </button>
                <button onClick={shuffleAvatar} className="w-7 h-7 rounded-md bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex items-center justify-center hover:bg-[#F8F9FB] transition" aria-label="Shuffle avatar">
                  <RefreshCw className="w-3 h-3 text-[#1C1E21]" />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[13px] font-medium text-[#4B5563] mb-1.5">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] focus:outline-none focus:border-[#1C1E21]/30 focus:ring-2 focus:ring-[#1C1E21]/10 transition"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#4B5563] mb-1.5">Description</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] focus:outline-none focus:border-[#1C1E21]/30 focus:ring-2 focus:ring-[#1C1E21]/10 transition"
                />
              </div>
              <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-[13px] font-medium text-[#4B5563] mb-1.5">Communication tone</label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] focus:outline-none focus:border-[#1C1E21]/30 transition"
                    >
                      <option value="">Pick a tone…</option>
                      <option>Friendly & Approachable</option>
                      <option>Professional</option>
                      <option>Concise & Direct</option>
                      <option>Warm & Empathetic</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#4B5563] mb-1.5">Voice</label>
                  <div className="relative">
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] focus:outline-none focus:border-[#1C1E21]/30 transition"
                    >
                      <option value="">Pick a voice…</option>
                      <option>Nova (Female)</option>
                      <option>Atlas (Male)</option>
                      <option>Sage (Neutral)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full border-2 border-[#7C3AED] flex items-center justify-center hover:bg-[#F5F3FF] transition" aria-label="Play voice sample">
                  <Play className="w-4 h-4 text-[#7C3AED] ml-0.5" fill="#7C3AED" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'powers' && (
          <div className="max-w-[640px]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[26px] font-semibold text-[#1C1E21] tracking-tight mb-1">Superpowers</h2>
                <p className="text-[14px] text-[#6B7280]">Configure your agent's skills and capabilities</p>
              </div>
              <button
                onClick={selectAll}
                className="px-4 h-9 rounded-lg border border-[#E6E8EC] bg-white text-[#1C1E21] text-[13px] font-medium hover:bg-[#F8F9FB] transition flex-shrink-0"
              >
                Select All
              </button>
            </div>

            {/* Skills */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-[16px] h-[16px] text-[#2563EB]" />
                <h3 className="text-[15px] font-semibold text-[#1C1E21]">Skills</h3>
              </div>
              <p className="text-[12.5px] text-[#6B7280] mb-3">Instruction sets with built-in tools that give your agent specific abilities.</p>
              <div className="grid grid-cols-2 gap-3">
                {skillList.map((s) => {
                  const on = !!skills[s.key];
                  return (
                    <div
                      key={s.key}
                      onClick={() => setSkills((p) => ({ ...p, [s.key]: !on }))}
                      className={`p-3.5 rounded-2xl border-2 transition cursor-pointer ${
                        on ? 'border-[#10B981]/30 bg-[#ECFDF5]' : 'border-[#E6E8EC] bg-white hover:border-[#1C1E21]/15'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${on ? 'bg-[#10B981]' : 'bg-[#1C1E21]'}`}>
                          <s.Icon className="w-[15px] h-[15px] text-white" strokeWidth={2.25} />
                        </div>
                        <span className={`relative inline-flex items-center w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 ${on ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}>
                          <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${on ? 'left-[18px]' : 'left-[2px]'}`} />
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <span className="text-[14px] font-semibold text-[#1C1E21]">{s.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#DBEAFE] text-[#2563EB]">PREDEFINED</span>
                      </div>
                      <div className="text-[12px] text-[#6B7280] leading-snug">{s.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standalone Tools */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-[16px] h-[16px] text-[#2563EB]" />
                <h3 className="text-[15px] font-semibold text-[#1C1E21]">Standalone Tools</h3>
              </div>
              <p className="text-[12.5px] text-[#6B7280] mb-3">General-purpose tools your agent can use independently.</p>
              <div className="grid grid-cols-2 gap-3">
                {standaloneToolList.map((t) => {
                  const on = !!standaloneTools[t.key];
                  return (
                    <div
                      key={t.key}
                      onClick={() => setStandaloneTools((p) => ({ ...p, [t.key]: !on }))}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        on ? 'border-[#1C1E21]/20 bg-[#FAFAFB]' : 'border-[#E6E8EC] bg-white hover:border-[#1C1E21]/15'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                          <t.Icon className="w-[15px] h-[15px] text-[#6B7280]" />
                        </div>
                        <span className={`relative inline-flex items-center w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 ${on ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}>
                          <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${on ? 'left-[18px]' : 'left-[2px]'}`} />
                        </span>
                      </div>
                      <div className="text-[14px] font-semibold text-[#1C1E21] mb-0.5">{t.name}</div>
                      <div className="text-[12px] text-[#6B7280] leading-snug">{t.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Questions */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-[18px] font-semibold text-[#1C1E21] tracking-tight">What {name} should ask customer</h3>
                  <p className="text-[13px] text-[#6B7280] mt-0.5">Add questions you would like {name} to get from customer</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-[#F3F4F6] text-[#4B5563] text-[11.5px] font-semibold tabular-nums flex-shrink-0">{Object.values(questions).filter(q => q.on).length}/14</span>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 text-[13px] text-[#1C1E21] font-medium mb-3">
                  <Mail className="w-[14px] h-[14px] text-[#6B7280]" />
                  Questions for "{activeSkill.name}" skill
                </div>
                <div className="space-y-2 pl-2 border-l-2 border-[#E6E8EC]">
                  {questionList.map((q) => {
                    const state = questions[q.key];
                    return (
                      <div key={q.key} className="ml-3 p-3 rounded-lg border border-[#E6E8EC] bg-white">
                        <div className="flex items-start gap-2.5 mb-2">
                          <div className="w-7 h-7 rounded-md bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                            <span className="text-[11px] font-bold text-[#6B7280]">Aa</span>
                          </div>
                          <div className="flex-1 text-[13px] text-[#1C1E21] leading-snug pt-1">{q.label}</div>
                        </div>
                        <div className="flex items-center gap-2 ml-9">
                          <span
                            onClick={() => setQuestions((p) => ({ ...p, [q.key]: { ...p[q.key], required: !p[q.key].required } }))}
                            className={`relative inline-flex items-center w-[32px] h-[18px] rounded-full transition-colors flex-shrink-0 cursor-pointer ${state.required ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
                          >
                            <span className={`absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${state.required ? 'left-[16px]' : 'left-[2px]'}`} />
                          </span>
                          <span className="text-[12px] text-[#6B7280]">Required</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'knowledge' && (
          <div className="max-w-[640px]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-[26px] font-semibold text-[#1C1E21] tracking-tight mb-1">Knowledge base</h2>
                <p className="text-[14px] text-[#6B7280]">Connect data sources to give your agent domain knowledge.</p>
              </div>
              <button className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg border border-[#E6E8EC] bg-white text-[#1C1E21] text-[13px] font-medium hover:bg-[#F8F9FB] transition flex-shrink-0">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                Add Knowledge
              </button>
            </div>

            <div className="rounded-xl border border-[#E6E8EC] bg-white overflow-hidden divide-y divide-[#F0F1F3]">
              {kbList.map((k) => {
                const on = !!knowledge[k.key];
                return (
                  <div key={k.key} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                      <Globe className="w-[18px] h-[18px] text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[14px] font-semibold text-[#1C1E21]">{k.name}</span>
                        {k.badges.map((b) => (
                          <span
                            key={b}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              b === 'PREDEFINED' ? 'bg-[#DBEAFE] text-[#2563EB]' : b === 'MCP' ? 'bg-[#FEF3C7] text-[#92400E]' : 'bg-[#F3F4F6] text-[#4B5563]'
                            }`}
                          >
                            {b}
                          </span>
                        ))}
                        <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#15803D]">
                          <CheckCircle2 className="w-[12px] h-[12px]" />
                          {k.status}
                        </span>
                      </div>
                      <div className="text-[12px] text-[#6B7280] truncate">{k.url}</div>
                    </div>
                    <span
                      onClick={() => setKnowledge((p) => ({ ...p, [k.key]: !on }))}
                      className={`relative inline-flex items-center w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 cursor-pointer ${on ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
                    >
                      <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${on ? 'left-[18px]' : 'left-[2px]'}`} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 'route' && (
          <div className="max-w-[640px]">
            <h2 className="text-[26px] font-semibold text-[#1C1E21] tracking-tight mb-1">Add to route</h2>
            <p className="text-[14px] text-[#6B7280] mb-6">When should {name} jump in?</p>

            {/* Scheduled */}
            <div className="rounded-xl border border-[#E6E8EC] bg-white overflow-hidden mb-3">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-[18px] h-[18px] text-[#2563EB]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#1C1E21]">Scheduled Execution</div>
                  <div className="text-[12px] text-[#6B7280]">Run this agent on a recurring schedule.</div>
                </div>
                <span
                  onClick={() => setTrigState((p) => ({ ...p, scheduled: !p.scheduled }))}
                  className={`relative inline-flex items-center w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 cursor-pointer ${trigState.scheduled ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
                >
                  <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${trigState.scheduled ? 'left-[18px]' : 'left-[2px]'}`} />
                </span>
              </div>
              {trigState.scheduled && (
                <div className="border-t border-[#F0F1F3] p-4 space-y-4">
                  <div>
                    <div className="text-[13px] font-medium text-[#1C1E21] mb-2">Frequency</div>
                    <div className="flex flex-wrap gap-2">
                      {frequencies.map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setFreq(f.key)}
                          className={`px-3 h-8 rounded-full text-[12.5px] font-medium border transition ${
                            freq === f.key ? 'bg-[#1C1E21] border-[#1C1E21] text-white' : 'bg-white border-[#E6E8EC] text-[#4B5563] hover:border-[#1C1E21]/30'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[#1C1E21] mb-2">Time</div>
                    <div className="flex items-center gap-2">
                      <select value={hour} onChange={(e) => setHour(Number(e.target.value))} className="px-3 py-1.5 rounded-lg border border-[#E6E8EC] bg-white text-[13px] text-[#1C1E21]">
                        {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                      </select>
                      <span className="text-[#6B7280]">:</span>
                      <select value={minute} onChange={(e) => setMinute(Number(e.target.value))} className="px-3 py-1.5 rounded-lg border border-[#E6E8EC] bg-white text-[13px] text-[#1C1E21]">
                        {[0, 15, 30, 45].map((m) => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F8F9FB] text-[12.5px] text-[#4B5563]">
                    <Info className="w-[14px] h-[14px] text-[#9CA3AF]" />
                    <span>Runs <span className="font-semibold text-[#1C1E21]">{freq === 'week' ? 'every Monday' : freq === 'day' ? 'every day' : freq === 'hour' ? 'every hour' : freq === 'month' ? 'on the 1st' : freq === 'weekdays' ? 'Mon-Fri' : 'on schedule'}</span> at <span className="font-semibold text-[#1C1E21] tabular-nums">{String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}</span></span>
                  </div>
                  <div className="flex items-center justify-between text-[12.5px]">
                    <div className="flex items-center gap-1.5 text-[#6B7280]"><Globe className="w-[13px] h-[13px]" /> Timezone: <span className="font-semibold text-[#1C1E21]">Asia/Calcutta</span></div>
                    <button className="text-[#6B7280] hover:text-[#1C1E21] inline-flex items-center gap-1">Advanced cron expression <ChevronDown className="w-3 h-3" /></button>
                  </div>
                </div>
              )}
            </div>

            {/* Mention */}
            <div className="rounded-xl border border-[#E6E8EC] bg-white overflow-hidden mb-3">
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                  <AtSign className="w-[18px] h-[18px] text-[#15803D]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-[#1C1E21]">Mention</div>
                  <div className="text-[12px] text-[#6B7280]">Trigger this agent when mentioned in a conversation.</div>
                </div>
                <span
                  onClick={() => setTrigState((p) => ({ ...p, mention: !p.mention }))}
                  className={`relative inline-flex items-center w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 cursor-pointer ${trigState.mention ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
                >
                  <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${trigState.mention ? 'left-[18px]' : 'left-[2px]'}`} />
                </span>
              </div>
              {trigState.mention && (
                <div className="border-t border-[#F0F1F3] p-4">
                  <div className="text-[13px] font-semibold text-[#1C1E21] mb-1">Where to listen</div>
                  <p className="text-[12px] text-[#6B7280] mb-3">By default the agent responds to <code className="px-1 py-0.5 rounded bg-[#F3F4F6] text-[11px] text-[#1C1E21]">@agent</code> across these surfaces.</p>
                  {[
                    { key: 'chat', name: 'Chat threads', desc: 'In any chat where the agent is added' },
                    { key: 'comments', name: 'Comments on jobs & tasks', desc: 'Mentions inside record comments' },
                    { key: 'dm', name: 'Direct messages', desc: 'When users DM the agent directly' },
                  ].map((s) => {
                    const on = mentionScope[s.key as keyof typeof mentionScope];
                    return (
                      <div key={s.key} className="flex items-center justify-between py-2 border-t border-[#F0F1F3] first:border-t-0">
                        <div>
                          <div className="text-[13px] font-medium text-[#1C1E21]">{s.name}</div>
                          <div className="text-[12px] text-[#6B7280]">{s.desc}</div>
                        </div>
                        <span
                          onClick={() => setMentionScope((p) => ({ ...p, [s.key]: !on }))}
                          className={`relative inline-flex items-center w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 cursor-pointer ${on ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
                        >
                          <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${on ? 'left-[18px]' : 'left-[2px]'}`} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Webhook */}
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-[#E6E8EC] bg-white">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <Webhook className="w-[18px] h-[18px] text-[#92400E]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[#1C1E21]">Webhook</div>
                <div className="text-[12px] text-[#6B7280]">Trigger this agent from any external tool via a signed HTTPS POST.</div>
              </div>
              <span
                onClick={() => setTrigState((p) => ({ ...p, webhook: !p.webhook }))}
                className={`relative inline-flex items-center w-[36px] h-[20px] rounded-full transition-colors flex-shrink-0 cursor-pointer ${trigState.webhook ? 'bg-[#1C1E21]' : 'bg-[#E5E7EB]'}`}
              >
                <span className={`absolute top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${trigState.webhook ? 'left-[18px]' : 'left-[2px]'}`} />
              </span>
            </div>
          </div>
        )}

        {step === 'advanced' && (
          <div className="max-w-[720px]">
            <h2 className="text-[26px] font-semibold text-[#1C1E21] tracking-tight mb-1">Advanced</h2>
            <p className="text-[14px] text-[#6B7280] mb-6">Fine-tune the model, behavior, and memory for {name}.</p>

            {/* Model & Behavior */}
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="w-[16px] h-[16px] text-[#6B7280]" />
                <h3 className="text-[15px] font-semibold text-[#1C1E21]">Model & Behavior</h3>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF] mb-2">Model</div>
                  <div className="relative">
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value as 'lite' | 'pro')}
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 rounded-lg bg-white border border-[#E6E8EC] text-[13.5px] text-[#1C1E21] focus:outline-none focus:border-[#1C1E21]/30 transition"
                    >
                      <option value="lite">Zuper Lite</option>
                      <option value="pro">Zuper Pro</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[11.5px] text-[#9CA3AF] mt-1.5">Larger models reason better but cost more per run.</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10.5px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">Temperature</span>
                    <span className="text-[14px] font-semibold text-[#1C1E21] tabular-nums">{temperature.toFixed(2)}</span>
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
                  <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] mt-1">
                    <span>0.0 · precise</span>
                    <span>creative · 1.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memory */}
            <div>
              <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-3">Memory</h3>
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setMemory((p) => ({ ...p, recent: !p.recent }))}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                    memory.recent ? 'border-[#10B981]/30 bg-white' : 'border-[#E6E8EC] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-[15px] h-[15px] text-[#1C1E21]" />
                      <span className="text-[14px] font-semibold text-[#1C1E21]">Recent Messages</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${memory.recent ? 'bg-[#ECFDF5] text-[#15803D]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${memory.recent ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                      {memory.recent ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6B7280] leading-relaxed">Last 20 messages per thread, used as conversational context.</p>
                </div>
                <div
                  onClick={() => setMemory((p) => ({ ...p, working: !p.working }))}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer ${
                    memory.working ? 'border-[#10B981]/30 bg-white' : 'border-[#E6E8EC] bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-[15px] h-[15px] text-[#1C1E21]" />
                      <span className="text-[14px] font-semibold text-[#1C1E21]">Working Memory</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${memory.working ? 'bg-[#ECFDF5] text-[#15803D]' : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${memory.working ? 'bg-[#10B981]' : 'bg-[#9CA3AF]'}`} />
                      {memory.working ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#6B7280] leading-relaxed">User preferences and session context the agent learns over time.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center gap-3 mt-10 max-w-[640px]">
          <button
            onClick={goBack}
            className="px-6 h-11 rounded-lg border border-[#E6E8EC] bg-white text-[#1C1E21] text-[13.5px] font-medium hover:bg-[#F8F9FB] transition flex-1"
          >
            Go back
          </button>
          <button
            onClick={goNext}
            className="px-6 h-11 rounded-lg bg-[#1C1E21] hover:bg-black text-white text-[13.5px] font-semibold transition hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] flex-1"
          >
            {stepIdx === steps.length - 1 ? 'Create agent' : 'Continue'}
          </button>
        </div>
        </motion.div>
        </AnimatePresence>
        </>
        )}
      </div>

      {/* RIGHT: live preview */}
      <div
        className="w-[620px] flex-shrink-0 flex flex-col items-center gap-3 relative overflow-y-auto scrollbar-auto-hide py-10 px-10"
        style={{ background: 'radial-gradient(circle at 62% 35%, #FFC7D9 0%, #FFD9C4 35%, #FBE9D4 65%, #FCF1E6 100%)' }}
      >
        {/* Grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>")',
          }}
        />
        <div className="relative w-[400px] rounded-3xl bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.20)] overflow-hidden">
          <div className="relative h-[400px] m-3.5 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #DBEAFE 0%, #EFF6FF 100%)' }}>
            <img src={currentAvatar} alt={name} className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[100%] w-auto object-contain" draggable={false} />
          </div>
          <div className="px-5 pb-5 pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-[20px] font-semibold text-[#1C1E21] tracking-tight">{name || 'Your agent'}</h3>
              <span className="px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#15803D] text-[10.5px] font-semibold">Z-{134 + avatarIdx}</span>
            </div>
            <p className="text-[13px] text-[#6B7280] leading-relaxed">{desc || 'Describe your agent.'}</p>
          </div>
        </div>

        {/* Live selection chips reflecting form state */}
        <div className="relative w-[400px] space-y-2">
          {tone && (
            <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-[14px] h-[14px] text-[#B45309]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">Tone</div>
                <div className="text-[13px] font-semibold text-[#1C1E21] truncate">{tone}</div>
              </div>
            </div>
          )}
          {voice && (
            <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center flex-shrink-0">
                <Play className="w-[12px] h-[12px] text-[#7C3AED] ml-0.5" fill="#7C3AED" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">Voice</div>
                <div className="text-[13px] font-semibold text-[#1C1E21] truncate">{voice}</div>
              </div>
            </div>
          )}
          {Object.values(skills).filter(Boolean).length > 0 && (
            <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                <Zap className="w-[14px] h-[14px] text-[#15803D]" fill="currentColor" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">Skills</div>
                <div className="text-[13px] font-semibold text-[#1C1E21] truncate">{Object.values(skills).filter(Boolean).length} active · {Object.values(standaloneTools).filter(Boolean).length} tools</div>
              </div>
            </div>
          )}
          {Object.values(knowledge).filter(Boolean).length > 0 && (
            <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                <Database className="w-[14px] h-[14px] text-[#2563EB]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">Knowledge</div>
                <div className="text-[13px] font-semibold text-[#1C1E21] truncate">{Object.values(knowledge).filter(Boolean).length} source{Object.values(knowledge).filter(Boolean).length === 1 ? '' : 's'} connected</div>
              </div>
            </div>
          )}
          {(trigState.scheduled || trigState.mention || trigState.webhook) && (
            <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
                <Clock className="w-[14px] h-[14px] text-[#C2410C]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">Triggers</div>
                <div className="text-[13px] font-semibold text-[#1C1E21] truncate flex items-center gap-1.5">
                  {trigState.scheduled && <span>Scheduled</span>}
                  {trigState.mention && (trigState.scheduled ? <span className="text-[#D1D5DB]">·</span> : null)}
                  {trigState.mention && <span>Mention</span>}
                  {trigState.webhook && ((trigState.scheduled || trigState.mention) ? <span className="text-[#D1D5DB]">·</span> : null)}
                  {trigState.webhook && <span>Webhook</span>}
                </div>
              </div>
            </div>
          )}
          {step === 'advanced' && (
            <div className="rounded-xl bg-white/80 backdrop-blur-sm shadow-[0_4px_12px_-4px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                <Bot className="w-[14px] h-[14px] text-[#1C1E21]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#9CA3AF]">Model</div>
                <div className="text-[13px] font-semibold text-[#1C1E21] truncate">Zuper {model === 'lite' ? 'Lite' : 'Pro'} · temp {temperature.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
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
