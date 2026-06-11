import { useState, useEffect, useRef } from 'react';
import { X, FlaskConical, Search, Plus, PanelLeftClose, Palette, CreditCard, Check, ArrowRight, ArrowLeft, HelpCircle, MoreHorizontal, Pencil, Archive, Blocks,
  Wallet, Ruler, Calculator, Mail, BarChart3, FolderKanban, Wrench, Calendar, Home, Package, Clock, type LucideIcon } from 'lucide-react';
import { AgentStudioIcon } from './components/icons/AgentStudioIcon';
import { SenseLogo } from './components/SenseLogo';
import { ReleasesModal } from './components/ReleasesModal';
import { WhatsNewFloater } from './components/WhatsNewFloater';
import { RadarChatPanel } from './components/RadarChatPanel';
import { UpgradeSenseModal } from './components/UpgradeSenseModal';
import { CheckoutModal } from './components/CheckoutModal';
import { motion, AnimatePresence } from 'motion/react';
import { AppNavigation } from './components/AppNavigation';
import { ChatInterface } from './components/ChatInterface';
import { FeatureAnnouncementModal } from './components/FeatureAnnouncementModal';
import { VoiceListeningIndicator } from './components/VoiceListeningIndicator';
import { ExpandedChatView } from './components/ExpandedChatView';
import { ReportBugModal } from './components/ReportBugModal';
import { SendFeedbackModal } from './components/SendFeedbackModal';
import { FeedbackActions } from './components/FeedbackActions';
import { ConfirmationCardDemo } from './components/ConfirmationCardDemo';
import { RadarWorkspace } from './components/RadarWorkspace';
import { ViewToggle } from './components/ViewToggle';
import { CanvasView } from './components/CanvasView';
import { TopNavigation } from './components/TopNavigation';
import { RADAR_THEMES } from './components/RadarThemeContext';
import { PublishedPagesProvider, usePublishedPages } from './components/PublishedPagesContext';
import { RadarProvider } from './components/RadarContext';
import { SavedCard } from './components/RadarContext';
import { ManageSubscriptionModal } from './components/ManageSubscriptionModal';
import { PersonalizationModal } from './components/PersonalizationModal';
import { InvoicePageBuilderCard } from './components/InvoicePageBuilderCard';
import { JobListingPage } from './components/JobListingPage';
import { AgentBuilderPage } from './components/AgentBuilderPage';
import { SubscriptionFlowPage } from './components/SubscriptionFlowPage';
import { BuildWorkspace } from './components/build/BuildWorkspace';
import { MY_APPS } from './components/build/buildData';

// map the legacy emoji app icons (buildData) → lucide glyphs for the sidebar
const APP_EMOJI_ICON: Record<string, LucideIcon> = {
  '💰': Wallet, '💸': Wallet, '📐': Ruler, '🧮': Calculator, '📨': Mail,
  '📊': BarChart3, '📈': BarChart3, '🗂️': FolderKanban, '🔧': Wrench,
  '📅': Calendar, '🏠': Home, '📦': Package, '🕐': Clock,
};
const appIconFor = (emoji: string): LucideIcon => APP_EMOJI_ICON[emoji] ?? Blocks;

function AppContent() {
  const [showDemo, setShowDemo] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'radar' | 'build'>(() => {
    if (typeof window === 'undefined') return 'chat';
    const h = window.location.hash;
    if (h === '#build' || h.startsWith('#build/')) return 'build';
    return 'chat';
  });
  const [buildSeedPrompt, setBuildSeedPrompt] = useState<string | null>(null);
  const [buildOpenAppId, setBuildOpenAppId] = useState<string | null>(null);
  const [buildShowApps, setBuildShowApps] = useState(false);
  const [buildCreateNonce, setBuildCreateNonce] = useState(0);
  const [pendingConversation, setPendingConversation] = useState<{ topic: string; fromCanvas: boolean; widgetId: string } | null>(null);
  const [pendingRadarCard, setPendingRadarCard] = useState<SavedCard | null>(null);
  const { activePage, setActivePage } = usePublishedPages();
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
  const demoMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('demo') === '1';
  const [currentUser, setCurrentUser] = useState('RG');
  const [announcementOpen, setAnnouncementOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (new URLSearchParams(window.location.search).get('demo') === '1') return false;
    // show once — suppress on every later refresh
    return localStorage.getItem('sense.announcementSeen') !== '1';
  });
  const closeAnnouncement = () => {
    setAnnouncementOpen(false);
    try { localStorage.setItem('sense.announcementSeen', '1'); } catch { /* ignore */ }
  };
  const [releasesOpen, setReleasesOpen] = useState(false);
  const [showBetaBanner, setShowBetaBanner] = useState(true);
  const [askSenseOpen, setAskSenseOpen] = useState(false);
  const [radarCardChatTitle, setRadarCardChatTitle] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [checkoutPageOpen, setCheckoutPageOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [paymentFailedModalOpen, setPaymentFailedModalOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const openUpgrade = () => { setPurchaseSuccess(false); setUpgradeModalOpen(true); };
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // In Build/Apps, keep the chat-thread sidebar until the planning flow begins.
  const [buildPlanning, setBuildPlanning] = useState(false);
  const [themeName, setThemeName] = useState<'clean' | 'rams' | 'neon'>('clean');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarSearchOpen, setSidebarSearchOpen] = useState(false);
  const sidebarSearchRef = useRef<HTMLInputElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [manageSubOpen, setManageSubOpen] = useState(false);
  const [personalizationOpen, setPersonalizationOpen] = useState(false);
  const [agentBuilderOpen, setAgentBuilderOpen] = useState(false);
  const [subFlowOpen, setSubFlowOpen] = useState(typeof window !== 'undefined' && window.location.hash === '#sub-flow');

  useEffect(() => {
    const onHash = () => {
      setSubFlowOpen(window.location.hash === '#sub-flow');
      const h = window.location.hash;
      if (h === '#build' || h.startsWith('#build/')) setActiveView('build');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Clear the #build hash when navigating away from the build view
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const h = window.location.hash;
    if (activeView !== 'build' && (h === '#build' || h.startsWith('#build/'))) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [activeView]);

  const [threadHistory, setThreadHistory] = useState<{ id: number; title: string; active: boolean; archived?: boolean; ts: number }[]>(() => {
    const now = Date.now();
    const MIN = 60_000, HR = 3_600_000, DAY = 86_400_000;
    const seed: { id: number; title: string; active: boolean; ts: number }[] = [
      { id: 1, title: 'Q4 Performance Analysis', active: true, ts: now - 8 * MIN },
      { id: 2, title: 'Create new customer - ABC Roofing', active: false, ts: now - 2 * HR },
      { id: 3, title: 'Team performance last week', active: false, ts: now - 5 * HR },
      { id: 4, title: 'Revenue breakdown by project type', active: false, ts: now - 1 * DAY },
      { id: 5, title: 'Outstanding invoices review', active: false, ts: now - 1 * DAY - 3 * HR },
      { id: 7, title: 'Material request for North Ave project', active: false, ts: now - 2 * DAY },
      { id: 8, title: 'Weekly team schedule review', active: false, ts: now - 3 * DAY },
      { id: 9, title: 'Quote follow-up automation', active: false, ts: now - 4 * DAY },
      { id: 10, title: 'Customer satisfaction analysis', active: false, ts: now - 6 * DAY },
      { id: 11, title: 'Inventory status check', active: false, ts: now - 8 * DAY },
      { id: 12, title: 'Project timeline updates', active: false, ts: now - 12 * DAY },
      { id: 13, title: 'Vendor payment processing', active: false, ts: now - 18 * DAY },
      { id: 14, title: 'Safety compliance checklist', active: false, ts: now - 25 * DAY },
      { id: 15, title: 'Monthly revenue report', active: false, ts: now - 34 * DAY },
    ];
    return seed;
  });
  const [threadMenuId, setThreadMenuId] = useState<number | null>(null);
  const [renameThreadId, setRenameThreadId] = useState<number | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const renameInputRef = useRef<HTMLTextAreaElement>(null);
  const threadMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = renameInputRef.current;
    if (!el || renameThreadId === null) return;
    el.style.height = '0px';
    el.style.height = `${el.scrollHeight}px`;
  }, [renameDraft, renameThreadId]);
  useEffect(() => {
    if (threadMenuId === null) return;
    const onClick = (e: MouseEvent) => {
      if (threadMenuRef.current && !threadMenuRef.current.contains(e.target as Node)) setThreadMenuId(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [threadMenuId]);
  const renameThread = (id: number) => {
    const t = threadHistory.find(x => x.id === id);
    if (!t) return;
    setRenameThreadId(id);
    setRenameDraft(t.title);
    setThreadMenuId(null);
  };
  const archiveThread = (id: number) => {
    setThreadHistory(prev => prev.map(t => t.id === id ? { ...t, archived: true } : t));
    setThreadMenuId(null);
  };
  const openThread = (id: number) => {
    setThreadHistory(prev => prev.map(t => ({ ...t, active: t.id === id })));
    setActivePage(null);
    setAgentBuilderOpen(false);
  };
  const saveRename = () => {
    if (renameThreadId === null) return;
    const next = renameDraft.trim();
    if (next.length === 0) { setRenameThreadId(null); return; }
    setThreadHistory(prev => prev.map(t => t.id === renameThreadId ? { ...t, title: next } : t));
    setRenameThreadId(null);
  };

  const handleUserChange = (user: string) => {
    setCurrentUser(user);
    if (user === 'VP') {
      setActiveView('chat');
      setActiveSubPage(null);
      setActivePage(null);
      setSidebarOpen(true);
    }
  };

  // Simulate transcription for demo purposes
  useEffect(() => {
    if (!voiceMode) {
      setTranscribedText('');
      return;
    }

    // Simulate gradual transcription
    const phrases = [
      'How is',
      'How is my business',
      'How is my business doing',
      'How is my business doing this week',
      'How is my business doing this week compared to last month',
    ];

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < phrases.length) {
        setTranscribedText(phrases[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, 800);

    return () => clearInterval(intervalId);
  }, [voiceMode]);

  // Handle Cmd/Ctrl + V keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        setVoiceMode((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExpandConversation = () => {
    setIsExpanded(true);
  };

  const handleCloseExpanded = () => {
    setIsExpanded(false);
  };

  const handleWidgetClick = (conversationTopic: string, widgetId: string) => {
    setPendingConversation({ topic: conversationTopic, fromCanvas: true, widgetId });
    setActiveView('chat');
  };

  const handleConversationConsumed = () => {
    setPendingConversation(null);
  };

  const handleOpenRadarCard = (card: SavedCard) => {
    // Map card title to a conversation topic that triggers the right content
    let topic = card.title;
    if (card.title.toLowerCase().includes('dso') || card.title.toLowerCase().includes('days sales outstanding')) {
      topic = 'overdue invoices';
    }
    setPendingRadarCard(card);
    setPendingConversation({ topic, fromCanvas: false, widgetId: '' });
    setActiveView('chat');
  };

  const handleRadarCardConsumed = () => {
    setPendingRadarCard(null);
  };

  // Show expanded chat view if expanded
  if (isExpanded) {
    return <ExpandedChatView onClose={handleCloseExpanded} />;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-[#F8F8F8] relative">
      <FeatureAnnouncementModal
        open={announcementOpen}
        onClose={closeAnnouncement}
        onTrySense={closeAnnouncement}
        onExploreMore={() => window.open('https://www.zuper.co/book-a-demo', '_blank', 'noopener,noreferrer')}
      />
      <ReleasesModal open={releasesOpen} onClose={() => setReleasesOpen(false)} />
{/* Top Navigation — hidden only inside the active builder flow, not the Apps listing */}
      {!(activeView === 'build' && buildPlanning) && <TopNavigation
        activeView={activeView}
        onViewChange={setActiveView}
        currentUser={currentUser}
        onUserChange={demoMode ? () => {} : handleUserChange}
        onAskSense={() => setAskSenseOpen((prev) => !prev)}
        askSenseOpen={askSenseOpen}
        onSettingsClick={demoMode ? () => {} : () => setSettingsOpen(v => !v)}
        onManageSubscriptionClick={demoMode ? () => {} : () => setManageSubOpen(true)}
        demoMode={demoMode}
      />}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Far Left: Compact App Navigation — hidden only inside the active builder flow */}
        {!demoMode && !(activeView === 'build' && buildPlanning) && <AppNavigation
          onSubItemNavigate={(label) => {
            setActiveSubPage(label);
            setActivePage(null);
          }}
          onSenseClick={() => { setActiveSubPage(null); setAgentBuilderOpen(false); setActiveView('chat'); }}
          onAgentBuilderClick={() => { setActiveSubPage(null); setActivePage(null); setAgentBuilderOpen(true); }}
          agentBuilderActive={agentBuilderOpen}
          currentUser={currentUser}
          onRadarClick={() => {
            setActiveView('radar');
            setActiveSubPage(null);
            setActivePage(null);
          }}
        />}

        {/* Content + Ask Sense Panel */}
        <div className="flex-1 flex overflow-hidden pb-2 pr-2 gap-2">
          {/* Thread Sidebar — inside content area */}
          <div className="flex-1 flex overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-white relative">
            {!demoMode && currentUser === 'RG' && !sidebarOpen && (
              <WhatsNewFloater
                onOpenAnnouncement={() => setAnnouncementOpen(true)}
                onOpenReleases={() => setReleasesOpen(true)}
              />
            )}
          <div
            className={`transition-all duration-300 bg-[#FAFAFA] flex-shrink-0 overflow-hidden border-r border-[rgba(0,0,0,0.08)] ${
              sidebarOpen && !agentBuilderOpen && (activeView === 'chat' || (activeView === 'build' && !buildPlanning)) ? 'w-[230px]' : 'w-0 border-r-0'
            }`}
          >
            <div className="h-full flex flex-col w-[230px]">
              {/* Toggle / header row — in build mode it becomes "Go Back" */}
              {activeView === 'build' ? (
                <div className="h-[56px] px-3 flex items-center flex-shrink-0">
                  <button
                    onClick={() => { setBuildPlanning(false); setActiveView('chat'); if (typeof window !== 'undefined') window.location.hash = ''; }}
                    className="flex items-center gap-2 px-2 py-1.5 -ml-0.5 rounded-md hover:bg-[#EEEEEE] transition-colors active:scale-[0.99]"
                  >
                    <ArrowLeft className="w-4 h-4 text-[#636363]" />
                    <span className="text-[14px] font-medium text-[#000000]">Go Back</span>
                  </button>
                </div>
              ) : (
                <div className="h-[56px] px-4 flex items-center justify-between flex-shrink-0">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#636363]">Sense</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-md hover:bg-[#EEEEEE] transition-colors"
                  >
                    <PanelLeftClose className="w-[18px] h-[18px] text-[#959595]" />
                  </button>
                </div>
              )}

              {/* Actions — only in non-build mode (build header carries Go Back) */}
              {activeView === 'build' ? null : (
              <div className="px-2 pb-0.5 flex flex-col">
                {(currentUser === 'MJ' || currentUser === 'AU') && (
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-[#EEEEEE] rounded-md transition-colors">
                    <Plus className="w-3.5 h-3.5 text-[#000000]" />
                    <span className="text-[14px] font-normal text-[#000000]">New thread</span>
                  </button>
                )}
                {sidebarSearchOpen ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-[rgba(0,0,0,0.08)]">
                    <Search className="w-3.5 h-3.5 text-[#959595] flex-shrink-0" />
                    <input
                      ref={sidebarSearchRef}
                      autoFocus
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      placeholder="Search threads..."
                      className="flex-1 text-[14px] text-[#000000] placeholder:text-[#959595] bg-transparent outline-none"
                    />
                    <button onClick={() => { setSidebarSearchOpen(false); setSidebarSearch(''); }} className="p-0.5 hover:bg-[#F0F0F0] rounded">
                      <X className="w-3 h-3 text-[#959595]" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setSidebarSearchOpen(true); setTimeout(() => sidebarSearchRef.current?.focus(), 50); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-[#EEEEEE] rounded-md transition-colors">
                    <Search className="w-3.5 h-3.5 text-[#000000]" />
                    <span className="text-[14px] font-normal text-[#000000]">Search</span>
                  </button>
                )}
                {(currentUser === 'MJ' || currentUser === 'AU') && (
                  <button
                    onClick={() => { setActiveSubPage(null); setActivePage(null); setAgentBuilderOpen(true); }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-[#EEEEEE] rounded-md transition-colors"
                  >
                    <AgentStudioIcon className="w-[15px] h-[15px]" variant={currentUser === 'AU' ? 'orange' : 'purple'} />
                    <span className="text-[14px] font-normal text-[#000000]">Agent Studio</span>
                  </button>
                )}
                <button
                  onClick={() => { setActiveView('build'); setActiveSubPage(null); setActivePage(null); setAgentBuilderOpen(false); if (typeof window !== 'undefined') window.location.hash = '#build'; }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 text-left rounded-md transition-colors"
                  style={{ background: activeView === 'build' ? '#E8E8E8' : 'transparent' }}
                  onMouseEnter={(e) => { if (activeView !== 'build') e.currentTarget.style.background = '#EEEEEE'; }}
                  onMouseLeave={(e) => { if (activeView !== 'build') e.currentTarget.style.background = 'transparent'; }}
                >
                  <Blocks className="w-3.5 h-3.5" style={{ color: activeView === 'build' ? '#000000' : '#000000' }} />
                  <span className="text-[14px] font-normal" style={{ color: activeView === 'build' ? '#000000' : '#000000', fontWeight: activeView === 'build' ? 500 : 400 }}>Apps</span>
                  <span className="ml-auto text-[9px] font-medium px-1 py-px rounded bg-[#F0F0F0] text-[#000000]">Beta</span>
                </button>
                {currentUser !== 'MJ' && currentUser !== 'AU' && (
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-[#EEEEEE] rounded-md transition-colors">
                    <Plus className="w-3.5 h-3.5 text-[#000000]" />
                    <span className="text-[14px] font-normal text-[#000000]">New thread</span>
                  </button>
                )}
              </div>
              )}

              {activeView !== 'build' && currentUser !== 'MJ' && currentUser !== 'AU' && <div className="mx-2 my-1.5 border-t border-[rgba(0,0,0,0.08)]" />}

              {/* sidebar body — swaps between the build menu and the thread list,
                  sliding right → left on the swap (ease-out, under 300ms) */}
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait" initial={false}>
                {activeView === 'build' ? (
                  <motion.div
                    key="build-menu"
                    initial={{ x: 24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -24, opacity: 0 }}
                    transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-0 overflow-y-auto scrollbar-auto-hide px-2 pt-2 pb-2"
                  >
                    {([
                      { id: 'create', label: 'Create new', icon: Plus },
                      { id: 'apps', label: 'Library', icon: Blocks },
                    ] as const).map((item) => {
                      const Icon = item.icon;
                      const active = item.id === 'apps' ? buildShowApps : item.id === 'create' ? !buildShowApps : false;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveView('build');
                            if (item.id === 'apps') setBuildShowApps(true);
                            else if (item.id === 'create') { setBuildShowApps(false); setBuildCreateNonce((n) => n + 1); }
                            if (typeof window !== 'undefined') window.location.hash = '#build';
                          }}
                          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-colors active:scale-[0.99]"
                          style={{ background: active ? '#E8E8E8' : 'transparent' }}
                          onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#EEEEEE'; }}
                          onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? '#000000' : '#636363' }} />
                          <span className="text-[14px]" style={{ color: '#000000', fontWeight: active ? 500 : 400 }}>{item.label}</span>
                        </button>
                      );
                    })}

                    <div className="mx-2 my-2 border-t border-[rgba(0,0,0,0.08)]" />
                    <p className="px-2 pt-1 pb-2 text-[11px] font-medium text-[#959595] uppercase tracking-[0.06em]">Recent Apps</p>
                    {MY_APPS.map((app) => {
                      const AppIcon = appIconFor(app.icon);
                      return (
                      <button
                        key={app.id}
                        onClick={() => { setBuildOpenAppId(app.id); setBuildShowApps(false); setActiveView('build'); if (typeof window !== 'undefined') window.location.hash = '#build'; }}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors hover:bg-[#EEEEEE] active:scale-[0.99]"
                      >
                        <AppIcon className="w-4 h-4 flex-shrink-0 text-[#636363]" />
                        <span className="text-[14px] text-[#636363] truncate">{app.name}</span>
                      </button>
                      );
                    })}
                  </motion.div>
                ) : (
                <motion.div
                  key="thread-list"
                  initial={{ x: 24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -24, opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute inset-0 overflow-y-auto scrollbar-auto-hide px-2 pb-2"
                >
                {(currentUser === 'MJ' || currentUser === 'AU') && (
                  <p className="px-2 pt-4 pb-2 text-[11px] font-medium text-[#959595] uppercase tracking-[0.06em]">Recent threads</p>
                )}
                {threadHistory
                  .filter((t) => !t.archived)
                  .filter((t) => !sidebarSearch || t.title.toLowerCase().includes(sidebarSearch.toLowerCase()))
                  .slice(0, demoMode ? 3 : undefined)
                  .map((thread) => {
                    const menuOpen = threadMenuId === thread.id;
                    const editing = renameThreadId === thread.id;
                    // no thread is "active" outside the chat view (e.g. on Apps/Build)
                    const threadActive = thread.active && activeView === 'chat';
                    const rowBg = threadActive ? '#E8E8E8' : '#EEEEEE';
                    return (
                      <div
                        key={thread.id}
                        className={`relative group w-full rounded-md transition-colors ${(currentUser === 'MJ' || currentUser === 'AU') ? 'mb-1' : 'mb-0.5'} ${
                          threadActive && !editing ? 'bg-[#E8E8E8]' : !editing ? 'hover:bg-[#EEEEEE]' : ''
                        }`}
                        style={{ zIndex: menuOpen || editing ? 60 : 'auto' }}
                      >
                        <button onClick={() => openThread(thread.id)} className="block w-full text-left px-2 py-1.5" style={{ visibility: editing ? 'hidden' : 'visible' }}>
                          <p className={`text-[14px] truncate ${threadActive ? 'text-[#000000] font-medium' : 'text-[#636363] font-normal'}`}>
                            {thread.title}
                          </p>
                        </button>
                        {editing && (
                          <textarea
                            ref={renameInputRef}
                            autoFocus
                            rows={1}
                            value={renameDraft}
                            onChange={(e) => setRenameDraft(e.target.value)}
                            onBlur={saveRename}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveRename(); }
                              else if (e.key === 'Escape') setRenameThreadId(null);
                            }}
                            className="absolute left-0 right-0 top-0 block w-full text-left text-[14px] font-medium text-[#000000] outline-none resize-none overflow-hidden rounded-md"
                            style={{
                              padding: '8px 10px',
                              lineHeight: 1.4,
                              background: '#FFFFFF',
                              border: '1px solid #000000',
                              boxShadow: '0 8px 24px -8px rgba(0,0,0,0.12), 0 2px 6px -2px rgba(0,0,0,0.06)',
                              zIndex: 70,
                            }}
                          />
                        )}
                        <div
                          className={`absolute top-1/2 -translate-y-1/2 right-1 flex items-center pl-6 pr-0 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 group-hover:opacity-100 group-hover:pointer-events-auto pointer-events-none'}`}
                          style={{
                            background: `linear-gradient(to right, transparent 0%, ${rowBg} 40%, ${rowBg} 100%)`,
                            transition: 'opacity 140ms cubic-bezier(0.23,1,0.32,1)',
                          }}
                          ref={menuOpen ? threadMenuRef : undefined}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); setThreadMenuId(menuOpen ? null : thread.id); }}
                            className="w-6 h-6 rounded-md flex items-center justify-center text-[#636363] hover:bg-[#DCDCDC] hover:text-[#000000] active:scale-[0.94]"
                            style={{ transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1), color 140ms cubic-bezier(0.23,1,0.32,1), transform 140ms cubic-bezier(0.23,1,0.32,1)' }}
                            aria-label="Thread options"
                          >
                            <MoreHorizontal className="w-[14px] h-[14px]" strokeWidth={2.2} />
                          </button>
                          {menuOpen && (
                            <div
                              className="absolute right-0 top-full mt-1 min-w-[160px] rounded-lg py-1"
                              style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 24px -8px rgba(0,0,0,0.12), 0 2px 6px -2px rgba(0,0,0,0.06)', zIndex: 100 }}
                            >
                              <button
                                onClick={() => renameThread(thread.id)}
                                className="w-full flex items-center gap-2 px-3 h-9 text-[12.5px] font-medium text-[#000000] text-left hover:bg-[#F0F0F0]"
                                style={{ transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1)' }}
                              >
                                <Pencil className="w-[13px] h-[13px]" strokeWidth={2} />
                                Rename thread
                              </button>
                              <button
                                onClick={() => archiveThread(thread.id)}
                                className="w-full flex items-center gap-2 px-3 h-9 text-[12.5px] font-medium text-[#000000] text-left hover:bg-[#F0F0F0]"
                                style={{ transition: 'background-color 140ms cubic-bezier(0.23,1,0.32,1)' }}
                              >
                                <Archive className="w-[13px] h-[13px]" strokeWidth={2} />
                                Archive
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {sidebarSearch && threadHistory.filter((t) => !t.archived && t.title.toLowerCase().includes(sidebarSearch.toLowerCase())).length === 0 && (
                  <p className="text-[12px] text-[#959595] text-center py-4">No threads found</p>
                )}
                </motion.div>
                )}
                </AnimatePresence>
              </div>

              {/* Plan / trial card — bottom of side nav */}
              <div className="px-3 pb-3 pt-2 flex-shrink-0">
                {/* Settings dropdown (fixed, triggered from header gear icon) */}
                <div>
                  <AnimatePresence>
                    {settingsOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -4 }}
                        transition={{ duration: 0.13, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed z-[500]"
                        style={{ top: 48, right: 56, width: 224, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', padding: '6px' }}
                      >
                        <p style={{ fontSize: 11, fontWeight: 500, color: '#959595', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 4px 10px' }}>Theme</p>
                        {([
                          { key: 'clean', desc: 'Minimal & light' },
                          { key: 'rams',  desc: 'Braun · Less but better' },
                          { key: 'neon',  desc: 'Dark · Electric glow' },
                        ] as const).map(({ key: tn, desc }) => {
                          const th = RADAR_THEMES[tn];
                          return (
                            <button
                              key={tn}
                              onClick={() => { setThemeName(tn); setSettingsOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-left"
                              style={{ background: themeName === tn ? '#F0F0F0' : 'transparent' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#F0F0F0')}
                              onMouseLeave={e => (e.currentTarget.style.background = themeName === tn ? '#F0F0F0' : 'transparent')}
                            >
                              <div
                                className="w-7 h-7 flex-shrink-0 flex flex-col gap-0.5 items-center justify-center overflow-hidden"
                                style={{
                                  background: th.pageBg,
                                  border: tn === 'rams' ? '1.5px solid #0A0A0A' : tn === 'neon' ? '1px solid #2A2A6A' : '1px solid rgba(0,0,0,0.08)',
                                  borderRadius: tn === 'rams' ? '0px' : tn === 'neon' ? '3px' : '6px',
                                  boxShadow: tn === 'neon' ? '0 0 6px rgba(123,63,255,0.4)' : 'none',
                                }}
                              >
                                <div className="w-4 h-1.5" style={{ background: th.cardBg, border: tn === 'rams' ? '1px solid #0A0A0A' : tn === 'neon' ? '1px solid #7B3FFF' : '1px solid rgba(0,0,0,0.08)', borderRadius: tn === 'rams' ? '0' : tn === 'neon' ? '1px' : '2px' }} />
                                <div className="w-4 h-0.5" style={{ background: th.accentColor, opacity: 0.9 }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p style={{ fontSize: 12, fontWeight: 500, color: '#000000', margin: 0 }}>{th.name}</p>
                                <p style={{ fontSize: 10, color: '#636363', margin: 0 }}>{desc}</p>
                              </div>
                              {themeName === tn && <Check className="w-3 h-3 ml-auto flex-shrink-0 text-[#000000]" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {demoMode ? null : currentUser === 'RG' ? (
                  <div className="group rounded-xl bg-white border border-[rgba(0,0,0,0.08)] overflow-hidden">
                    {/* Hover-revealed chat illustration header */}
                    <div
                      className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr]"
                      style={{ transition: 'grid-template-rows 300ms cubic-bezier(0.23,1,0.32,1)' }}
                    >
                      <div className="overflow-hidden">
                        <div
                          className="relative h-[124px]"
                          style={{ background: 'linear-gradient(180deg, #FFCFA8 0%, #FFE2C5 45%, #FFF1E0 80%, #FFFFFF 100%)' }}
                        >
                          {/* Dashboard window */}
                          <div
                            className="absolute inset-x-[12px] top-[12px] bottom-[12px] bg-white rounded-[10px] overflow-hidden opacity-0 group-hover:opacity-100"
                            style={{
                              boxShadow:
                                '0 1px 2px rgba(28,30,33,0.04), 0 10px 24px -12px rgba(28,30,33,0.18), 0 18px 32px -20px rgba(253,80,0,0.30)',
                              transition:
                                'opacity 280ms cubic-bezier(0.23,1,0.32,1) 80ms, transform 280ms cubic-bezier(0.23,1,0.32,1) 80ms',
                            }}
                          >
                            {/* Window title strip */}
                            <div className="flex items-center justify-between px-2 pt-[7px] pb-1">
                              <div className="h-[3px] w-[34%] rounded-full bg-[rgba(0,0,0,0.08)]" />
                              <div className="flex items-center gap-[3px]">
                                <span className="w-[3px] h-[3px] rounded-full bg-[#000000]" />
                                <span className="w-[3px] h-[3px] rounded-full bg-[#D9D9D9]" />
                                <span className="w-[3px] h-[3px] rounded-full bg-[#ECECEC]" />
                              </div>
                            </div>

                            {/* 2x2 widget grid */}
                            <div className="grid grid-cols-2 gap-[5px] px-[6px] pb-[6px]">
                              {/* TL — horizontal bars */}
                              <div className="rounded-md px-[7px] py-[6px] flex flex-col gap-[3px] justify-center" style={{ background: '#FFF6EC', height: 34 }}>
                                <div className="h-[3px] w-[78%] rounded-full" style={{ background: 'linear-gradient(90deg, #BFBFBF, #000000)' }} />
                                <div className="h-[3px] w-[55%] rounded-full bg-[#D9D9D9]" />
                                <div className="h-[3px] w-[42%] rounded-full bg-[#FFC4A0]" />
                              </div>

                              {/* TR — donut + legend */}
                              <div className="rounded-md px-[7px] py-[6px] flex items-center gap-[5px]" style={{ background: '#FFF6EC', height: 34 }}>
                                <div className="relative w-[20px] h-[20px] flex-shrink-0">
                                  <div
                                    className="absolute inset-0 rounded-full"
                                    style={{ background: 'conic-gradient(#000000 0% 55%, #D9D9D9 55% 78%, #ECECEC 78% 100%)' }}
                                  />
                                  <div className="absolute inset-[3px] rounded-full bg-white" />
                                </div>
                                <div className="flex-1 flex flex-col gap-[2px]">
                                  <div className="h-[2.5px] w-[80%] rounded-full bg-[#ECECEC]" />
                                  <div className="h-[2.5px] w-[60%] rounded-full bg-[#ECECEC]" />
                                  <div className="h-[2.5px] w-[70%] rounded-full bg-[#ECECEC]" />
                                </div>
                              </div>

                              {/* BL — vertical bars */}
                              <div className="rounded-md px-[7px] py-[6px] flex items-end gap-[3px] justify-center" style={{ background: '#FFF6EC', height: 34 }}>
                                <div className="w-[4px] rounded-sm bg-[#FFC4A0]" style={{ height: '40%' }} />
                                <div className="w-[4px] rounded-sm bg-[#D9D9D9]" style={{ height: '70%' }} />
                                <div className="w-[4px] rounded-sm" style={{ height: '95%', background: 'linear-gradient(180deg, #BFBFBF, #000000)' }} />
                                <div className="w-[4px] rounded-sm bg-[#D9D9D9]" style={{ height: '55%' }} />
                                <div className="w-[4px] rounded-sm bg-[#FFC4A0]" style={{ height: '75%' }} />
                              </div>

                              {/* BR — big metric */}
                              <div className="rounded-md px-[7px] py-[5px] flex flex-col justify-center" style={{ background: '#FFF6EC', height: 34 }}>
                                <div className="h-[2.5px] w-[60%] rounded-full bg-[#ECECEC] mb-[3px]" />
                                <div className="flex items-baseline gap-[3px]">
                                  <span className="text-[11px] font-medium text-[#000000] leading-none tracking-[-0.02em]">$24.5K</span>
                                  <span className="text-[8px] font-medium leading-none" style={{ color: '#000000' }}>+8%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-2.5 py-2">
                      {/* Inline icon + title */}
                      <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#636363' }} strokeWidth={2} />
                        <p className="text-[11.5px] font-medium text-[#000000] leading-none">What's new</p>
                      </div>

                      {/* Expanding subtitle + button on hover */}
                      <div
                        className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr]"
                        style={{ transition: 'grid-template-rows 280ms cubic-bezier(0.23,1,0.32,1)' }}
                      >
                        <div className="overflow-hidden">
                          <p
                            className="text-[10.5px] text-[#636363] leading-tight mt-1.5 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
                            style={{ transition: 'opacity 220ms cubic-bezier(0.23,1,0.32,1) 60ms, transform 220ms cubic-bezier(0.23,1,0.32,1) 60ms' }}
                          >
                            Sense is now available with smarter answers and pinned insights.
                          </p>
                          <button
                            onClick={() => setAnnouncementOpen(true)}
                            className="w-full py-1 rounded-md text-[11px] font-medium text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] mt-2 opacity-0 group-hover:opacity-100 active:scale-[0.98]"
                            style={{ transition: 'background-color 200ms cubic-bezier(0.23,1,0.32,1), opacity 220ms cubic-bezier(0.23,1,0.32,1) 100ms, transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                          >
                            View update
                          </button>
                          <button
                            onClick={() => setReleasesOpen(true)}
                            className="w-full py-1 rounded-md text-[11px] font-medium text-[#000000] bg-white border border-[rgba(0,0,0,0.08)] hover:bg-[#FAFAFA] hover:border-[#D1D5DB] mt-1.5 opacity-0 group-hover:opacity-100 active:scale-[0.98]"
                            style={{ transition: 'background-color 180ms cubic-bezier(0.23,1,0.32,1), border-color 180ms cubic-bezier(0.23,1,0.32,1), opacity 220ms cubic-bezier(0.23,1,0.32,1) 140ms, transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
                          >
                            Releases
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : currentUser === 'AU' ? (
                  <div className="rounded-xl p-3 bg-white border border-[rgba(0,0,0,0.08)]">
                    <div className="flex items-start gap-2.5">
                      <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#F0F0F0' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#636363" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-[#000000] leading-snug">Subscription ends<br />May 17, 2026</p>
                        <p className="text-[11px] text-[#636363] leading-snug mt-1">Activate to continue using Sense</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl p-3 bg-white border border-[rgba(0,0,0,0.08)]">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FBEAEA' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E5484D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-[#000000] leading-tight">Your trial has ended</p>
                        <p className="text-[11px] text-[#636363] leading-tight mt-0.5">Upgrade to keep your insights flowing</p>
                      </div>
                    </div>
                    <button onClick={openUpgrade} className="w-full py-1.5 rounded-lg text-[12px] font-medium text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] transition-colors">
                      Upgrade Sense
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            {subFlowOpen ? (
              <SubscriptionFlowPage
                onApply={(s) => {
                  setCurrentUser(s.user);
                  setIsSubscribed(s.isSubscribed);
                  setPaymentFailed(s.paymentFailed);
                  if (typeof window !== 'undefined') {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                  }
                  setSubFlowOpen(false);
                }}
              />
            ) : agentBuilderOpen ? (
              <AgentBuilderPage onClose={() => setAgentBuilderOpen(false)} currentUser={currentUser} />
            ) : activeSubPage === 'Jobs' ? (
              <JobListingPage onBack={() => setActiveSubPage(null)} />
            ) : activePage ? (
              <div className="flex-1 overflow-hidden">
                <InvoicePageBuilderCard
                  key={activePage.id}
                  onClose={() => setActivePage(null)}
                  pageName={activePage.name}
                  workspace={activePage.workspace}
                  isPublishedView={true}
                />
              </div>
            ) : checkoutPageOpen ? (
              <div className="flex-1 overflow-hidden">
                <CheckoutModal
                  isOpen={true}
                  onClose={() => { setCheckoutPageOpen(false); setUpgradeModalOpen(true); }}
                  onSuccess={() => { setCheckoutPageOpen(false); setPurchaseSuccess(true); setIsSubscribed(true); setPaymentFailed(false); }}
                  onCancelVerification={currentUser === 'RG' ? () => { setCheckoutPageOpen(false); setPurchaseSuccess(true); setPaymentFailed(true); setPaymentFailedModalOpen(true); } : undefined}
                />
              </div>
            ) : purchaseSuccess && currentUser === 'RG' ? (
              <div className="flex-1 overflow-hidden">
                <div className="w-full h-full overflow-y-auto bg-white rounded-xl border border-[rgba(0,0,0,0.08)] flex items-center justify-center p-8">
                  <div className="flex flex-col items-center text-center max-w-[440px]">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{ background: 'rgba(16,185,129,0.10)', border: '2px solid rgba(16,185,129,0.25)' }}
                    >
                      <Check className="w-8 h-8" style={{ color: '#000000' }} strokeWidth={2.5} />
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 500, color: '#000000', letterSpacing: '-0.02em', marginBottom: 10 }}>You're all set!</h2>
                    <p style={{ fontSize: 14, color: '#636363', lineHeight: 1.65, marginBottom: 28 }}>
                      Welcome to Sense. Ask anything about your JobNimbus data in plain English.
                    </p>
                    <button
                      onClick={() => setPurchaseSuccess(false)}
                      className="px-8 py-3 rounded-[12px] text-[14px] font-medium text-white transition-all duration-150"
                      style={{ background: 'linear-gradient(135deg, #221E1F 0%, #0f0d0e 100%)', boxShadow: '0 6px 18px rgba(0,0,0,0.18)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'translateY(0)')}
                    >
                      Start using Sense
                    </button>
                  </div>
                </div>
              </div>
            ) : manageSubOpen ? (
              <div className="flex-1 overflow-hidden">
                <ManageSubscriptionModal isOpen={true} onClose={() => { setManageSubOpen(false); setActiveView('chat'); setActiveSubPage(null); setActivePage(null); }} isVp={currentUser === 'VP'} isAU={currentUser === 'AU'} isMJ={currentUser === 'MJ'} paymentFailed={paymentFailed} onUpgrade={() => { setManageSubOpen(false); setPurchaseSuccess(false); setCheckoutPageOpen(true); }} />
              </div>
            ) : (
              <>
                {activeView === 'chat' ? (
                  <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <ChatInterface
                      voiceMode={voiceMode}
                      onToggleVoiceMode={() => setVoiceMode((prev) => !prev)}
                      activeView={activeView}
                      onViewChange={setActiveView}
                      pendingConversation={pendingConversation}
                      onConversationConsumed={handleConversationConsumed}
                      onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                      pendingRadarCard={pendingRadarCard}
                      onRadarCardConsumed={handleRadarCardConsumed}
                      sidebarOpen={sidebarOpen}
                      onToggleSidebar={() => setSidebarOpen(o => !o)}
                      isTrial={!demoMode && currentUser === 'RG'}
                      isVp={currentUser === 'VP'}
                      onUpgrade={openUpgrade}
                      onOpenAgentBuilder={() => { setActiveSubPage(null); setActivePage(null); setAgentBuilderOpen(true); }}
                      onPersonalizationClick={() => setPersonalizationOpen(true)}
                      onTurnIntoApp={(p) => { setBuildSeedPrompt(p); setActiveView('build'); }}
                      demoMode={demoMode}
                    />
                  </div>
                ) : activeView === 'build' ? (
                  <div className="flex-1 flex overflow-hidden p-0">
                    <BuildWorkspace
                      currentUser={currentUser}
                      seededPrompt={buildSeedPrompt}
                      onConsumeSeed={() => setBuildSeedPrompt(null)}
                      seededOpenAppId={buildOpenAppId}
                      onConsumeOpenApp={() => setBuildOpenAppId(null)}
                      seededShowApps={buildShowApps}
                      createNonce={buildCreateNonce}
                      onPlanningChange={setBuildPlanning}
                      onExit={() => { setBuildPlanning(false); setActiveView('chat'); }}
                    />
                  </div>
                ) : activeView === 'radar' ? (
                  <RadarWorkspace
                    isOpen={true}
                    onClose={() => setActiveView('chat')}
                    activeView={activeView}
                    onViewChange={setActiveView}
                    onOpenCard={handleOpenRadarCard}
                    showBetaBanner={showBetaBanner}
                    onCloseBetaBanner={() => setShowBetaBanner(false)}
                    onOpenCardChat={(title) => setRadarCardChatTitle(title)}
                    isTrial={!demoMode && currentUser === 'RG'}
                    isVp={currentUser === 'VP'}
                    isAU={currentUser === 'AU'}
                    onUpgrade={openUpgrade}
                    onOpenAgentBuilder={() => { setActiveSubPage(null); setActivePage(null); setAgentBuilderOpen(true); }}
                    themeName={themeName}
                    demoMode={demoMode}
                    onPersonalizationClick={() => setPersonalizationOpen(true)}
                  />
                ) : null}
              </>
            )}
          </div>
          </div>

          {/* Ask Sense panel — flex sibling, pushes main content */}
          <AnimatePresence>
            {askSenseOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 420, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 32, stiffness: 300 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="h-full w-[420px] bg-white rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                  <RadarChatPanel title="Ask Sense" onClose={() => setAskSenseOpen(false)} isVp={currentUser === 'VP'} onUpgrade={openUpgrade} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Radar card chat panel — same slide-in behavior as Ask Sense */}
          <AnimatePresence>
            {radarCardChatTitle !== null && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 420, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 32, stiffness: 300 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="h-full w-[420px] bg-white rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                  <RadarChatPanel
                    key={radarCardChatTitle}
                    initialCardTitle={radarCardChatTitle}
                    title={radarCardChatTitle}
                    onClose={() => setRadarCardChatTitle(null)}
                    isVp={currentUser === 'VP'}
                    onUpgrade={openUpgrade}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Persistent Voice Listening Indicator Pill */}
      <VoiceListeningIndicator 
        isListening={voiceMode}
        onClose={() => setVoiceMode(false)}
        onExpand={handleExpandConversation}
        transcribedText={transcribedText}
      />

      {settingsOpen && <div className="fixed inset-0 z-[499]" onClick={() => setSettingsOpen(false)} />}
      <UpgradeSenseModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        isVp={currentUser === 'VP'}
        isTrial={!demoMode && currentUser === 'RG'}
        onSubscribe={() => { setUpgradeModalOpen(false); setCheckoutPageOpen(true); }}
      />
      <PersonalizationModal isOpen={personalizationOpen} onClose={() => setPersonalizationOpen(false)} />

      {paymentFailedModalOpen && (
        <>
          <div className="fixed bg-black/40 backdrop-blur-sm z-[400]" style={{ inset: 0 }} onClick={() => setPaymentFailedModalOpen(false)} />
          <div className="fixed z-[410] flex items-center justify-center p-4 pointer-events-none" style={{ inset: 0 }}>
            <div className="pointer-events-auto bg-white w-full p-6" style={{ maxWidth: 420, borderRadius: 16, boxShadow: '0 24px 60px rgba(30,34,60,0.22)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FDECEC' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E5484D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 500, color: '#000000', letterSpacing: '-0.01em' }}>Payment failed</h3>
              </div>
              <p style={{ fontSize: 13.5, color: '#636363', lineHeight: 1.55, marginBottom: 18 }}>
                We couldn't process your card. Please update your payment method and try again to keep access to Sense.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setPaymentFailedModalOpen(false); setPurchaseSuccess(false); setManageSubOpen(true); }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                  style={{ background: '#F0F0F0', color: '#636363' }}
                >
                  Close
                </button>
                <button
                  onClick={() => { setPaymentFailedModalOpen(false); setPurchaseSuccess(false); setCheckoutPageOpen(true); }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white"
                  style={{ background: 'linear-gradient(135deg, #221E1F, #0f0d0e)' }}
                >
                  Update payment
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Report Bug Modal */}
      <ReportBugModal
        isOpen={isBugModalOpen}
        onClose={() => setIsBugModalOpen(false)}
      />

      {/* Floating Help Us Improve Button */}
      <FeedbackActions onOpenFeedback={() => setIsFeedbackModalOpen(true)} />

      {/* Send Feedback Modal */}
      <SendFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />

      {/* Confirmation Card Demo */}
      <ConfirmationCardDemo
        showDemo={showDemo}
        setShowDemo={setShowDemo}
      />

      {/* View Toggle */}
      <ViewToggle
        activeView={activeView}
        onToggle={setActiveView}
      />

      {/* Sense Logo Demo - Bottom Right */}
    </div>
  );
}

export default function App() {
  return (
    <PublishedPagesProvider>
      <RadarProvider>
        <AppContent />
      </RadarProvider>
    </PublishedPagesProvider>
  );
}