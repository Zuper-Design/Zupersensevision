import { useState, useEffect, useRef } from 'react';
import { X, FlaskConical, Search, Plus, PanelLeftClose, Palette, CreditCard, Check } from 'lucide-react';
import { RadarChatPanel } from './components/RadarChatPanel';
import { UpgradeSenseModal } from './components/UpgradeSenseModal';
import { motion, AnimatePresence } from 'motion/react';
import { AppNavigation } from './components/AppNavigation';
import { ChatInterface } from './components/ChatInterface';
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
import { SenseLogo } from './components/SenseLogo';
import { PublishedPagesProvider, usePublishedPages } from './components/PublishedPagesContext';
import { RadarProvider } from './components/RadarContext';
import { SavedCard } from './components/RadarContext';
import { ManageSubscriptionModal } from './components/ManageSubscriptionModal';
import { PersonalizationModal } from './components/PersonalizationModal';
import { InvoicePageBuilderCard } from './components/InvoicePageBuilderCard';
import { JobListingPage } from './components/JobListingPage';

function AppContent() {
  const [showDemo, setShowDemo] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'radar'>('chat');
  const [pendingConversation, setPendingConversation] = useState<{ topic: string; fromCanvas: boolean; widgetId: string } | null>(null);
  const [pendingRadarCard, setPendingRadarCard] = useState<SavedCard | null>(null);
  const { activePage, setActivePage } = usePublishedPages();
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState('RG');
  const [showBetaBanner, setShowBetaBanner] = useState(true);
  const [askSenseOpen, setAskSenseOpen] = useState(false);
  const [radarCardChatTitle, setRadarCardChatTitle] = useState<string | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const openUpgrade = () => setUpgradeModalOpen(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [themeName, setThemeName] = useState<'clean' | 'rams' | 'neon'>('clean');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [sidebarSearchOpen, setSidebarSearchOpen] = useState(false);
  const sidebarSearchRef = useRef<HTMLInputElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [manageSubOpen, setManageSubOpen] = useState(false);
  const [personalizationOpen, setPersonalizationOpen] = useState(false);

  const threadHistory = [
    { id: 1, title: 'Q4 Performance Analysis', active: true },
    { id: 2, title: 'Create new customer - ABC Roofing', active: false },
    { id: 3, title: 'Team performance last week', active: false },
    { id: 4, title: 'Revenue breakdown by project type', active: false },
    { id: 5, title: 'Outstanding invoices review', active: false },
    { id: 7, title: 'Material request for North Ave project', active: false },
    { id: 8, title: 'Weekly team schedule review', active: false },
    { id: 9, title: 'Quote follow-up automation', active: false },
    { id: 10, title: 'Customer satisfaction analysis', active: false },
    { id: 11, title: 'Inventory status check', active: false },
    { id: 12, title: 'Project timeline updates', active: false },
    { id: 13, title: 'Vendor payment processing', active: false },
    { id: 14, title: 'Safety compliance checklist', active: false },
    { id: 15, title: 'Monthly revenue report', active: false },
  ];

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
    <div className="w-full h-screen flex flex-col bg-[#F8F2EC] relative">
{/* Top Navigation with Canvas/Chat Options */}
      <TopNavigation
        activeView={activeView}
        onViewChange={setActiveView}
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onAskSense={() => setAskSenseOpen((prev) => !prev)}
        askSenseOpen={askSenseOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Far Left: Compact App Navigation */}
        <AppNavigation
          onSubItemNavigate={(label) => {
            setActiveSubPage(label);
            setActivePage(null);
          }}
          onSenseClick={() => setActiveSubPage(null)}
          currentUser={currentUser}
          onRadarClick={() => {
            setActiveView('radar');
            setActiveSubPage(null);
            setActivePage(null);
          }}
        />

        {/* Content + Ask Sense Panel */}
        <div className="flex-1 flex overflow-hidden pb-2 pr-2 gap-2">
          {/* Thread Sidebar — inside content area */}
          <div className="flex-1 flex overflow-hidden rounded-xl border border-[#E6E8EC] bg-white">
          <div
            className={`transition-all duration-300 bg-[#FAFAFA] flex-shrink-0 overflow-hidden border-r border-[#E6E8EC] ${
              sidebarOpen && activeView !== 'radar' ? 'w-[230px]' : 'w-0 border-r-0'
            }`}
          >
            <div className="h-full flex flex-col w-[230px]">
              {/* Toggle */}
              <div className="h-[56px] px-4 flex items-center justify-between flex-shrink-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4B5563]">Sense</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-md hover:bg-[#EEEEEE] transition-colors"
                >
                  <PanelLeftClose className="w-[18px] h-[18px] text-[#9CA3AF]" />
                </button>
              </div>

              {/* Actions */}
              <div className="px-2 pb-0.5 flex flex-col">
                {sidebarSearchOpen ? (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-[#E6E8EC]">
                    <Search className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                    <input
                      ref={sidebarSearchRef}
                      autoFocus
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      placeholder="Search threads..."
                      className="flex-1 text-[14px] text-[#1C1E21] placeholder:text-[#9CA3AF] bg-transparent outline-none"
                    />
                    <button onClick={() => { setSidebarSearchOpen(false); setSidebarSearch(''); }} className="p-0.5 hover:bg-[#F3F4F6] rounded">
                      <X className="w-3 h-3 text-[#9CA3AF]" />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => { setSidebarSearchOpen(true); setTimeout(() => sidebarSearchRef.current?.focus(), 50); }} className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-[#EEEEEE] rounded-md transition-colors">
                    <Search className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    <span className="text-[14px] font-normal text-[#9CA3AF]">Search</span>
                  </button>
                )}
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-[#EEEEEE] rounded-md transition-colors">
                  <Plus className="w-3.5 h-3.5 text-[#1C1E21]" />
                  <span className="text-[14px] font-normal text-[#1C1E21]">New thread</span>
                </button>
              </div>

              <div className="mx-2 my-1.5 border-t border-[#E6E8EC]" />

              {/* Thread list */}
              <div className="flex-1 overflow-y-auto scrollbar-auto-hide px-2 pb-2">
                {threadHistory
                  .filter((t) => !sidebarSearch || t.title.toLowerCase().includes(sidebarSearch.toLowerCase()))
                  .map((thread) => (
                  <button
                    key={thread.id}
                    className={`w-full px-2 py-1.5 text-left rounded-md transition-colors mb-0.5 ${
                      thread.active ? 'bg-[#E8E8E8]' : 'hover:bg-[#EEEEEE]'
                    }`}
                  >
                    <p className={`text-[14px] truncate ${thread.active ? 'text-[#1C1E21] font-medium' : 'text-[#4B5563] font-normal'}`}>
                      {thread.title}
                    </p>
                  </button>
                ))}
                {sidebarSearch && threadHistory.filter((t) => t.title.toLowerCase().includes(sidebarSearch.toLowerCase())).length === 0 && (
                  <p className="text-[12px] text-[#9CA3AF] text-center py-4">No threads found</p>
                )}
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
                        style={{ top: 102, right: 16, width: 224, background: '#FFFFFF', border: '1px solid #E6E8EC', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.10)', padding: '6px' }}
                      >
                        <button
                          onClick={() => { setSettingsOpen(false); setPersonalizationOpen(true); }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-left"
                        >
                          <Palette className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
                          <span className="text-[13px] font-medium text-[#1C1E21]">Personalization</span>
                        </button>
                        <button
                          onClick={() => { setSettingsOpen(false); setManageSubOpen(true); }}
                          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-left"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
                          <span className="text-[13px] font-medium text-[#1C1E21]">Manage subscription</span>
                        </button>
                        <div className="mx-2 my-1 h-px bg-[#F0F0F2]" />
                        <p style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '4px 0 4px 10px' }}>Theme</p>
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
                              style={{ background: themeName === tn ? '#F3F4F6' : 'transparent' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
                              onMouseLeave={e => (e.currentTarget.style.background = themeName === tn ? '#F3F4F6' : 'transparent')}
                            >
                              <div
                                className="w-7 h-7 flex-shrink-0 flex flex-col gap-0.5 items-center justify-center overflow-hidden"
                                style={{
                                  background: th.pageBg,
                                  border: tn === 'rams' ? '1.5px solid #0A0A0A' : tn === 'neon' ? '1px solid #2A2A6A' : '1px solid #E6E8EC',
                                  borderRadius: tn === 'rams' ? '0px' : tn === 'neon' ? '3px' : '6px',
                                  boxShadow: tn === 'neon' ? '0 0 6px rgba(123,63,255,0.4)' : 'none',
                                }}
                              >
                                <div className="w-4 h-1.5" style={{ background: th.cardBg, border: tn === 'rams' ? '1px solid #0A0A0A' : tn === 'neon' ? '1px solid #7B3FFF' : '1px solid #E6E8EC', borderRadius: tn === 'rams' ? '0' : tn === 'neon' ? '1px' : '2px' }} />
                                <div className="w-4 h-0.5" style={{ background: th.accentColor, opacity: 0.9 }} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#1C1E21', margin: 0 }}>{th.name}</p>
                                <p style={{ fontSize: 10, color: '#6B7280', margin: 0 }}>{desc}</p>
                              </div>
                              {themeName === tn && <Check className="w-3 h-3 ml-auto flex-shrink-0 text-[#1C1E21]" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {currentUser === 'RG' ? (
                  <div className="rounded-xl p-3 bg-white border border-[#E6E8EC]">
                    <div className="flex items-center gap-2.5 mb-3">
                      <svg width="26" height="26" viewBox="0 0 26 26">
                        <circle cx="13" cy="13" r="10" fill="none" stroke="#E6E8EC" strokeWidth="2.5" />
                        <circle cx="13" cy="13" r="10" fill="none" stroke="#10B981" strokeWidth="2.5" strokeDasharray={`${(10 / 14) * 62.8} 62.8`} strokeLinecap="round" transform="rotate(-90 13 13)" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-[#1C1E21] leading-tight">You're on a free trial</p>
                        <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">10 days left</p>
                      </div>
                    </div>
                    <button onClick={openUpgrade} className="w-full py-1.5 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] transition-colors">
                      Upgrade Sense
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl p-3 bg-white border border-[#E6E8EC]">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FEE2E2' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold text-[#1C1E21] leading-tight">Your trial has ended</p>
                        <p className="text-[11px] text-[#6B7280] leading-tight mt-0.5">Upgrade to keep your insights flowing</p>
                      </div>
                    </div>
                    <button onClick={openUpgrade} className="w-full py-1.5 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] transition-colors">
                      Upgrade Sense
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            {activeSubPage === 'Jobs' ? (
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
                      isTrial={currentUser === 'RG'}
                      isVp={currentUser === 'VP'}
                      onUpgrade={openUpgrade}
                      onSettingsClick={() => setSettingsOpen(v => !v)}
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
                    isTrial={currentUser === 'RG'}
                    isVp={currentUser === 'VP'}
                    isAU={currentUser === 'AU'}
                    onUpgrade={openUpgrade}
                    themeName={themeName}
                    onSettingsClick={() => setSettingsOpen(v => !v)}
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
                <div className="h-full w-[420px] bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E6E8EC', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
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
                <div className="h-full w-[420px] bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E6E8EC', boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
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
      <UpgradeSenseModal isOpen={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
      <ManageSubscriptionModal isOpen={manageSubOpen} onClose={() => setManageSubOpen(false)} />
      <PersonalizationModal isOpen={personalizationOpen} onClose={() => setPersonalizationOpen(false)} />

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