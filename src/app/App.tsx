import { useState, useEffect } from 'react';
import { X, FlaskConical } from 'lucide-react';
import { RadarChatPanel } from './components/RadarChatPanel';
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
import { SenseLogo } from './components/SenseLogo';
import { PublishedPagesProvider, usePublishedPages } from './components/PublishedPagesContext';
import { RadarProvider } from './components/RadarContext';
import { SavedCard } from './components/RadarContext';
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

  const handleUserChange = (user: string) => {
    setCurrentUser(user);
    // VP lands on radar first when opening Sense
    if (user === 'VP') {
      setActiveView('radar');
      setActiveSubPage(null);
      setActivePage(null);
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
                  <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden border border-[#E6E8EC]">
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
                  />
                ) : null}
              </>
            )}
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
                  <RadarChatPanel title="Ask Sense" onClose={() => setAskSenseOpen(false)} />
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