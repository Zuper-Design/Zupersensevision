import { useState, useEffect, useRef } from 'react';
import { Mic, Sparkles, AlertCircle, Clock, TrendingUp, ArrowRight, ChevronLeft, ChevronRight, BarChart3, Users, Target, ArrowLeft, PanelLeftClose, PanelLeft, Plus, Search, Edit3, DollarSign, TrendingDown, Info, Pause, Check, ArrowUp, Radar, History, FlaskConical, Archive, X, Settings } from 'lucide-react';
import { ConversationView } from './ConversationView';
import { CreatedCardDisplay } from './CreatedCardDisplay';
import { LoadingScreen } from './LoadingScreen';
import logoCircles from '../../imports/logo-circles.svg';
import { SenseLogo } from './SenseLogo';
import { SavedCard } from './RadarContext';

interface ChatInterfaceProps {
  voiceMode: boolean;
  onToggleVoiceMode: () => void;
  activeView: 'chat' | 'radar';
  onViewChange: (view: 'chat' | 'radar') => void;
  pendingConversation?: { topic: string; fromCanvas: boolean; widgetId: string } | null;
  onConversationConsumed?: () => void;
  onOpenFeedback?: () => void;
  pendingRadarCard?: SavedCard | null;
  onRadarCardConsumed?: () => void;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isTrial?: boolean;
  isVp?: boolean;
  onUpgrade?: () => void;
  onSettingsClick?: () => void;
}

const promptSuggestions = [
  { icon: BarChart3, label: "Business health" },
  { icon: Users, label: "Create a new job" },
  { icon: Target, label: "Today's priorities" },
];

const recentConversations = [
  { 
    title: 'Team performance analysis', 
    timestamp: '2 hours ago',
    active: true 
  },
  { 
    title: 'Revenue tracking Q1', 
    timestamp: 'Yesterday',
    active: false 
  },
  { 
    title: 'Roofing metrics dashboard', 
    timestamp: '2 days ago',
    active: false 
  },
  { 
    title: 'Customer feedback review', 
    timestamp: '3 days ago',
    active: false 
  },
  { 
    title: 'Material cost optimization', 
    timestamp: '5 days ago',
    active: false 
  },
  { 
    title: 'Safety compliance check', 
    timestamp: '1 week ago',
    active: false 
  },
];

const keyInsights = [
  {
    icon: AlertCircle,
    title: '3 Quotes Stuck',
    description: 'Potential revenue: $84,000',
    action: 'Review & follow up',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Clock,
    title: '4 Jobs Missing SLA',
    description: 'Mostly re-roofing jobs',
    action: 'View delays',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Up 12%',
    description: 'Compared to last month',
    action: 'View details',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
];

const placeholderTexts = [
  "What's the revenue for this quarter?",
  "Show me team performance metrics...",
  "Which jobs are behind schedule?",
  "How many quotes are pending?",
  "What's our top performing service?",
  "Show me customer satisfaction scores...",
];

export function ChatInterface({ voiceMode, onToggleVoiceMode, activeView, onViewChange, pendingConversation, onConversationConsumed, onOpenFeedback, pendingRadarCard, onRadarCardConsumed, sidebarOpen, onToggleSidebar, isTrial, isVp, onUpgrade, onSettingsClick }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

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
  const [inputFocused, setInputFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdCard, setCreatedCard] = useState<{ type: string; data: any } | null>(null);
  const [isFromCanvas, setIsFromCanvas] = useState(false);
  const [canvasWidgetId, setCanvasWidgetId] = useState<string | null>(null);
  const [activeRadarCard, setActiveRadarCard] = useState<SavedCard | null>(null);
  const listeningTimerRef = useRef<any>(null);
  const typewriterTimerRef = useRef<any>(null);
  const currentSegmentRef = useRef<number>(0);

  // Mock dictation text - split into segments
  const mockDictationSegments = [
    "Show me the team performance metrics for this quarter and highlight any areas that need attention. ",
    "Also include a comparison with the previous quarter. ",
    "Focus on the top performers and identify any training needs."
  ];

  // Detect "create" commands and extract entity type
  const detectCreateCommand = (text: string): string | null => {
    const lowerText = text.toLowerCase().trim();
    
    // Match patterns like "create [entity]" or "create a [entity]" or "create new [entity]"
    const createPattern = /^create\s+(a\s+|an\s+|new\s+)?(.+)$/i;
    const match = lowerText.match(createPattern);
    
    if (match) {
      const entityText = match[2].trim();
      
      // Map user input to entity types
      const entityMap: Record<string, string> = {
        'job': 'job',
        'jobs': 'job',
        'project': 'project',
        'projects': 'project',
        'customer': 'customer',
        'customers': 'customer',
        'organization': 'organization',
        'org': 'organization',
        'organizations': 'organization',
        'property': 'property',
        'properties': 'property',
        'vendor': 'vendor',
        'vendors': 'vendor',
        'material request': 'material request',
        'material': 'material request',
        'materials': 'material request',
        'part': 'part',
        'parts': 'part',
        'service': 'service',
        'services': 'service',
        'quote': 'quote',
        'quotes': 'quote',
        'invoice': 'invoice',
        'invoices': 'invoice',
        'contract': 'contract',
        'contracts': 'contract',
        'asset': 'asset',
        'assets': 'asset',
      };
      
      return entityMap[entityText] || null;
    }
    
    return null;
  };

  const handleMessageSubmit = (text: string) => {
    if (!text.trim()) return;
    const entityType = detectCreateCommand(text);
    
    // Show loading screen
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      if (entityType) {
        // Pass to conversation view with entity type
        setCurrentQuestion(`create ${entityType}`);
        setConversationActive(true);
        setMessage('');
        setInputFocused(false);
        setIsLoading(false);
      } else {
        // Normal conversation
        setCurrentQuestion(text);
        setConversationActive(true);
        setMessage('');
        setInputFocused(false);
        setIsLoading(false);
      }
    }, 1500); // 1.5 seconds loading
  };

  const handlePromptClick = (questionText: string) => {
    // Show loading screen
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      setCurrentQuestion(questionText);
      setConversationActive(true);
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading
  };

  // Start mock dictation
  const startDictation = () => {
    setInputFocused(true); // Expand the input field
    setIsListening(true);
    setIsPaused(false);
    
    // After 3 seconds, start typing the mock text
    listeningTimerRef.current = setTimeout(() => {
      if (!isPaused) {
        typeMessage();
      }
    }, 3000);
  };

  // Type message with animation
  const typeMessage = () => {
    setIsTyping(true); // Start typing

    const allSegmentsText = mockDictationSegments.slice(0, currentSegmentRef.current + 1).join('');
    const startIndex = message.length;
    let currentCharIndex = startIndex;

    const typeNextChar = () => {
      if (currentCharIndex < allSegmentsText.length) {
        setMessage(allSegmentsText.slice(0, currentCharIndex + 1));
        currentCharIndex++;
        
        // Variable speed to simulate natural speech
        // Faster for letters, slower for spaces and punctuation
        const currentChar = allSegmentsText[currentCharIndex - 1];
        let delay;
        
        if (currentChar === ' ') {
          // Pause at spaces (like breathing between words)
          delay = Math.random() * 80 + 100; // 100-180ms
        } else if (currentChar === '.' || currentChar === ',' || currentChar === '!') {
          // Longer pause at punctuation
          delay = Math.random() * 150 + 250; // 250-400ms
        } else {
          // Variable speed for regular characters
          delay = Math.random() * 40 + 30; // 30-70ms
        }
        
        typewriterTimerRef.current = setTimeout(typeNextChar, delay);
      } else {
        // Finished typing this segment
        setIsTyping(false);
        // Don't automatically move to next segment - wait for user to resume
      }
    };

    typeNextChar();
  };

  // Pause dictation
  const pauseDictation = () => {
    setIsPaused(true);
    setIsTyping(false);
    if (listeningTimerRef.current) {
      clearTimeout(listeningTimerRef.current);
    }
    if (typewriterTimerRef.current) {
      clearTimeout(typewriterTimerRef.current);
    }
  };

  // Resume dictation
  const resumeDictation = () => {
    setIsPaused(false);
    
    // Check if current segment is fully typed
    const currentSegmentText = mockDictationSegments.slice(0, currentSegmentRef.current + 1).join('');
    const isCurrentSegmentComplete = message.length >= currentSegmentText.length;
    
    // If current segment is complete and there are more segments, move to next
    if (isCurrentSegmentComplete && currentSegmentRef.current < mockDictationSegments.length - 1) {
      currentSegmentRef.current++;
    }
    
    // Continue typing
    typeMessage();
  };

  // Done with dictation - submit/generate
  const doneDictation = () => {
    setIsListening(false);
    setIsPaused(false);
    if (listeningTimerRef.current) {
      clearTimeout(listeningTimerRef.current);
    }
    if (typewriterTimerRef.current) {
      clearTimeout(typewriterTimerRef.current);
    }
    
    // If there's a message, trigger chat generation
    if (message) {
      console.log('Generating chat response for:', message);
      // Here you would trigger your chat generation logic
    }
  };

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (listeningTimerRef.current) {
        clearTimeout(listeningTimerRef.current);
      }
      if (typewriterTimerRef.current) {
        clearTimeout(typewriterTimerRef.current);
      }
    };
  }, []);

  // Typewriter effect for placeholder with backspace
  useEffect(() => {
    if (message || inputFocused) {
      setTypedPlaceholder('');
      return;
    }

    const targetText = placeholderTexts[placeholderIndex];
    let currentIndex = 0;
    let isDeleting = false;
    setTypedPlaceholder('');

    const typewriterInterval = setInterval(() => {
      if (!isDeleting) {
        // Typing phase
        if (currentIndex < targetText.length) {
          setTypedPlaceholder(targetText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          // Finished typing, wait then start deleting
          clearInterval(typewriterInterval);
          setTimeout(() => {
            isDeleting = true;
            const deleteInterval = setInterval(() => {
              if (currentIndex > 0) {
                currentIndex--;
                setTypedPlaceholder(targetText.slice(0, currentIndex));
              } else {
                // Finished deleting, move to next placeholder
                clearInterval(deleteInterval);
                setPlaceholderIndex((prev) => (prev + 1) % placeholderTexts.length);
              }
            }, 50); // Delete at 50ms per character
          }, 3000); // Wait 3 seconds before deleting
        }
      }
    }, 80); // Type at 80ms per character

    return () => clearInterval(typewriterInterval);
  }, [placeholderIndex, message, inputFocused]);

  useEffect(() => {
    if (pendingConversation) {
      if (pendingConversation.fromCanvas) {
        // From canvas: skip loading, directly open conversation
        setIsFromCanvas(true);
        setCanvasWidgetId(pendingConversation.widgetId);
        setCurrentQuestion(pendingConversation.topic);
        setConversationActive(true);
        setMessage('');
        setInputFocused(false);
      } else if (pendingRadarCard) {
        // From radar: skip loading, directly open conversation
        setIsFromCanvas(false);
        setCanvasWidgetId(null);
        setCurrentQuestion(pendingConversation.topic);
        setActiveRadarCard(pendingRadarCard);
        setConversationActive(true);
        setMessage('');
        setInputFocused(false);
      } else {
        handleMessageSubmit(pendingConversation.topic);
      }
      if (onConversationConsumed) {
        onConversationConsumed();
      }
    }
  }, [pendingConversation, onConversationConsumed]);

  useEffect(() => {
    if (pendingRadarCard) {
      if (onRadarCardConsumed) {
        onRadarCardConsumed();
      }
    }
  }, [pendingRadarCard, onRadarCardConsumed]);

  return (
    <>
      {/* Loading Screen */}
      {isLoading && <LoadingScreen />}
      
      <div className="flex-1 overflow-y-auto bg-white scrollbar-auto-hide">
        <div className="bg-white h-full overflow-hidden flex rounded-xl">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto relative scrollbar-auto-hide">
            {!conversationActive ? (
              // Welcome Screen
              <div className="min-h-full flex flex-col bg-white relative">
                {/* Top Header Bar */}
                <div className="h-[56px] border-b border-[#E6E8EC] flex items-center justify-between px-6 flex-shrink-0 bg-white relative z-10">
                  <div className="flex items-center gap-3">
                    {!sidebarOpen && onToggleSidebar && (
                      <button
                        onClick={onToggleSidebar}
                        className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150 -ml-2"
                      >
                        <PanelLeftClose className="w-[18px] h-[18px] text-[#6B7280] rotate-180" />
                      </button>
                    )}
                  </div>
                  
                  {/* Canvas/Chat Switcher - Centered */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="inline-flex items-center bg-[#F8F9FB] rounded-lg p-1 gap-1">
                      <button
                        onClick={() => onViewChange('chat')}
                        className={`px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200 ${
                          activeView === 'chat'
                            ? 'bg-white text-[#1C1E21] shadow-sm'
                            : 'text-[#6B7280] hover:text-[#1C1E21]'
                        }`}
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => onViewChange('radar')}
                        className={`px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200 ${
                          activeView === 'radar'
                            ? 'bg-white text-[#1C1E21] shadow-sm'
                            : 'text-[#6B7280] hover:text-[#1C1E21]'
                        }`}
                      >
                        Radar
                      </button>
                    </div>
                  </div>
                  
                  {/* Right side */}
                  <div className="flex items-center gap-2">
                    {isTrial && (
                      <button onClick={onUpgrade} className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full border transition-colors" style={{ background: '#FFF8F2', borderColor: '#F5E0CF' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FD5000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        <span className="text-[12px] font-medium text-[#44403C]">Trial ends in 10 days</span>
                      </button>
                    )}
                    <button
                      onClick={onSettingsClick}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    >
                      <Settings className="w-4 h-4 text-[#6B7280]" />
                    </button>
                  </div>
                </div>

                {/* Welcome Content */}
                <div className="flex-1 flex items-center justify-center py-16 px-8">
                <div className="w-full max-w-[1100px] flex flex-col items-center gap-5 relative z-10">
                  {/* Welcome Header with Logo */}
                  <div className="text-center w-full mb-0">
                    <div className="flex items-center justify-center gap-3 mb-1">
                      {/* Logo - New Sense Logo (Smaller) */}
                      <div className="animated-logo-img relative w-9 h-9">
                        <SenseLogo size={28} animated={true} />
                      </div>
                      <h2 className="font-normal text-[24px] bg-gradient-to-r from-[#1F2937] to-[#A96B65] text-transparent bg-clip-text">
                        Good evening JT
                      </h2>
                    </div>
                    <h1 className="text-[32px] font-semibold leading-tight bg-gradient-to-r from-[#1F2937] to-[#A96B65] text-transparent bg-clip-text">
                      What would you like to do today?
                    </h1>
                  </div>

                  {/* Chat Input - Hero Element */}
                  <div className="w-full max-w-[680px]">
                    <div
                      style={isVp ? { opacity: 0.35, filter: 'grayscale(1)', pointerEvents: 'none', cursor: 'not-allowed' } : undefined}
                      className={`relative w-full bg-white rounded-[16px] transition-all duration-300 ${
                        inputFocused && !voiceMode
                          ? 'border border-[#FF6B35]/30 shadow-[0_0_0_3px_rgba(255,107,53,0.12),0_8px_24px_rgba(255,107,53,0.15)]'
                          : 'border border-[#E6E8EC] shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'
                      }`}
                    >
                      {/* Input Area */}
                      <div className={`flex items-center relative transition-all duration-500 ease-out ${ inputFocused ? 'pt-3 pb-2' : 'py-2.5' } px-[16px] py-[8px]`}>
                        {!inputFocused && (
                          <Search className="w-[19px] h-[19px] mr-2.5 flex-shrink-0 transition-colors duration-500 ease-out text-[#6B7280]" />
                        )}
                        
                        {/* Custom placeholder with cursor */}
                        {!message && !inputFocused && (
                          <div className="absolute left-[48px] pointer-events-none flex items-center text-[15px] text-[#9CA3AF]">
                            <span className="font-light">{isListening ? "Listening..." : typedPlaceholder}</span>
                            {!isListening && typedPlaceholder && (
                              <span className="ml-[4px] inline-block w-[2px] h-[18px] bg-[#FF6B35]"></span>
                            )}
                          </div>
                        )}
                        
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onFocus={() => setInputFocused(true)}
                          onBlur={(e) => {
                            // Only blur if clicking outside the container
                            const currentTarget = e.currentTarget;
                            setTimeout(() => {
                              if (!currentTarget.contains(document.activeElement)) {
                                setInputFocused(false);
                              }
                            }, 0);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                              e.preventDefault();
                              handleMessageSubmit(message.trim());
                            }
                          }}
                          placeholder={isListening ? "Listening..." : ""}
                          rows={inputFocused ? 4 : 1}
                          className="flex-1 bg-transparent text-[#1C1E21] focus:outline-none text-[15px] transition-all duration-500 ease-out resize-none overflow-hidden placeholder:text-[#9CA3AF]"
                          style={{ lineHeight: '1.5' }}
                        />
                        
                        {!inputFocused && !isListening && !message && (
                          <button
                            onClick={startDictation}
                            className="ml-3.5 flex-shrink-0 p-2 rounded-lg transition-all duration-200 hover:bg-[#F8F9FB]"
                            aria-label="Voice Dictation"
                          >
                            <Mic className="w-[19px] h-[19px] transition-colors duration-300 text-[#6B7280]" />
                          </button>
                        )}
                        
                        {!inputFocused && !isListening && message && (
                          <button
                            onClick={() => handleMessageSubmit(message.trim())}
                            className="ml-3.5 flex-shrink-0 p-2 rounded-lg transition-all duration-200 bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40]"
                            aria-label="Generate"
                          >
                            <ArrowUp className="w-[19px] h-[19px] text-white" />
                          </button>
                        )}
                        
                        {!inputFocused && isListening && (
                          <div className="ml-3.5 flex items-center gap-2">
                            <button
                              onClick={isPaused ? resumeDictation : pauseDictation}
                              className="flex-shrink-0 px-3 py-1.5 rounded-lg transition-all duration-200 bg-[#F8F9FB] hover:bg-[#E6E8EC] border border-[#E6E8EC]"
                              aria-label={isPaused ? "Resume Dictating" : "Pause Dictating"}
                            >
                              <span className="text-[13px] font-medium text-[#1C1E21]">{isPaused ? "Resume" : "Pause"}</span>
                            </button>
                            <button
                              onClick={doneDictation}
                              className="flex-shrink-0 px-3 py-1.5 rounded-lg transition-all duration-200 bg-[#F8F9FB] hover:bg-[#E6E8EC] border border-[#E6E8EC]"
                              aria-label="Done Dictating"
                            >
                              <span className="text-[13px] font-medium text-[#1C1E21]">Done</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Only visible when focused */}
                      {inputFocused && (
                        <div className="flex items-center justify-between px-4 pb-4 pt-1">
                          <button 
                            onClick={() => {
                              setMessage('');
                              setInputFocused(false);
                              setIsListening(false);
                              setIsPaused(false);
                              if (listeningTimerRef.current) {
                                clearTimeout(listeningTimerRef.current);
                              }
                              if (typewriterTimerRef.current) {
                                clearTimeout(typewriterTimerRef.current);
                              }
                            }}
                            className="text-[13px] text-[#6B7280] hover:text-[#1C1E21] transition-colors duration-150 font-medium"
                          >
                            Cancel
                          </button>
                          
                          {isListening ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={isPaused ? resumeDictation : pauseDictation}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] hover:border-[#FF6B35]/30 hover:bg-[#FF6B35]/[0.02] transition-all duration-150"
                                aria-label={isPaused ? "Resume Dictating" : "Pause Dictating"}
                              >
                                {isPaused ? (
                                  <Mic className="w-[14px] h-[14px] text-[#6B7280]" />
                                ) : (
                                  <Pause className="w-[14px] h-[14px] text-[#6B7280]" />
                                )}
                                <span className="text-[13px] text-[#1C1E21] font-medium">{isPaused ? "Resume" : "Pause"}</span>
                              </button>
                              
                              {isPaused ? (
                                <button
                                  onClick={doneDictation}
                                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#1a1617] hover:to-[#5a4d51] text-white transition-all duration-150 shadow-[0_2px_8px_rgba(34,30,31,0.3)]"
                                >
                                  <Check className="w-[14px] h-[14px]" />
                                  <span className="text-[13px] font-medium">Done</span>
                                </button>
                              ) : (
                                <button 
                                  onClick={isTyping ? undefined : doneDictation}
                                  disabled={isTyping}
                                  className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] text-white shadow-[0_2px_8px_rgba(34,30,31,0.3)] transition-all duration-150 ${
                                    isTyping ? 'w-10 h-[34px] cursor-default' : 'gap-1.5 px-4 py-1.5 cursor-pointer'
                                  }`}
                                >
                                  <style>{`
                                    @keyframes soundwave-button-active {
                                      0%, 100% { height: 10px; }
                                      50% { height: 14px; }
                                    }
                                    .soundwave-button-bar-active {
                                      animation: soundwave-button-active 1s ease-in-out infinite;
                                    }
                                    .soundwave-button-bar-active:nth-child(1) { animation-delay: 0s; }
                                    .soundwave-button-bar-active:nth-child(2) { animation-delay: 0.15s; }
                                    .soundwave-button-bar-active:nth-child(3) { animation-delay: 0.3s; }
                                  `}</style>
                                  {isTyping ? (
                                    <div className="flex items-center gap-[2px]">
                                      <div className="soundwave-button-bar-active w-[2px] bg-white rounded-full"></div>
                                      <div className="soundwave-button-bar-active w-[2px] bg-white rounded-full"></div>
                                      <div className="soundwave-button-bar-active w-[2px] bg-white rounded-full"></div>
                                    </div>
                                  ) : (
                                    <>
                                      <Check className="w-[14px] h-[14px]" />
                                      <span className="text-[13px] font-medium">Done</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={onToggleVoiceMode}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] hover:border-[#FF6B35]/30 hover:bg-[#FF6B35]/[0.02] transition-all duration-150"
                                aria-label="Voice Mode"
                              >
                                <Mic className="w-[15px] h-[15px] text-[#6B7280]" />
                                <span className="text-[13px] text-[#1C1E21] font-medium">Voice</span>
                              </button>
                              
                              <button
                                onClick={() => handleMessageSubmit(message.trim())}
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] text-white transition-all duration-150 shadow-[0_2px_8px_rgba(34,30,31,0.3)]"
                              >
                                <span className="text-[13px] font-medium">Generate</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                  </div>

                  {isVp && (
                    <div className="w-full max-w-[680px] flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#F3F4F6] -mt-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#1C1E21]">Your trial has ended</p>
                        <p className="text-[12px] text-[#6B7280] mt-0.5">Upgrade Sense to continue asking questions.</p>
                      </div>
                      <button onClick={onUpgrade} className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] transition-colors">
                        Upgrade Sense
                      </button>
                    </div>
                  )}

                  {/* Suggested Prompts Section */}
                  <div className="w-full max-w-[1000px] mt-8">
                    <div className="flex flex-col items-center">
                      <h2 className="text-base font-medium text-[#1C1E21] mb-3">Suggested prompts</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                        <button 
                          onClick={() => handlePromptClick('Team Performance')}
                          className="group p-3.5 bg-white/70 border border-[#E6E8EC]/70 hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] rounded-[10px] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(255,107,53,0.08)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-[13px] font-medium text-[#1C1E21] leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">Team Performance</h3>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">Operations</p>
                            </div>
                            <div className="flex-shrink-0">
                              <Users className="w-[18px] h-[18px] text-[#FF6B35]" />
                            </div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handlePromptClick('Revenue Analysis')}
                          className="group p-3.5 bg-white/70 border border-[#E6E8EC]/70 hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] rounded-[10px] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(255,107,53,0.08)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-[13px] font-medium text-[#1C1E21] leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">Revenue Analysis</h3>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">Finance</p>
                            </div>
                            <div className="flex-shrink-0">
                              <DollarSign className="w-[18px] h-[18px] text-[#FF6B35]" />
                            </div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handlePromptClick('Efficiency Metrics')}
                          className="group p-3.5 bg-white/70 border border-[#E6E8EC]/70 hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] rounded-[10px] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(255,107,53,0.08)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-[13px] font-medium text-[#1C1E21] leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">Efficiency Metrics</h3>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">Performance</p>
                            </div>
                            <div className="flex-shrink-0">
                              <Clock className="w-[18px] h-[18px] text-[#FF6B35]" />
                            </div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handlePromptClick('Growth trends')}
                          className="group p-3.5 bg-white/70 border border-[#E6E8EC]/70 hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] rounded-[10px] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(255,107,53,0.08)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-[13px] font-medium text-[#1C1E21] leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">Growth trends</h3>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">Analytics</p>
                            </div>
                            <div className="flex-shrink-0">
                              <TrendingUp className="w-[18px] h-[18px] text-[#FF6B35]" />
                            </div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handlePromptClick('Customer Feedback')}
                          className="group p-3.5 bg-white/70 border border-[#E6E8EC]/70 hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] rounded-[10px] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(255,107,53,0.08)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-[13px] font-medium text-[#1C1E21] leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">Customer Feedback</h3>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">Service</p>
                            </div>
                            <div className="flex-shrink-0">
                              <BarChart3 className="w-[18px] h-[18px] text-[#FF6B35]" />
                            </div>
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => handlePromptClick('Resource Utilization')}
                          className="group p-3.5 bg-white/70 border border-[#E6E8EC]/70 hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] rounded-[10px] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(255,107,53,0.08)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-[13px] font-medium text-[#1C1E21] leading-tight mb-1 whitespace-nowrap overflow-hidden text-ellipsis">Resource Utilization</h3>
                              <p className="text-[12px] text-[#9CA3AF] font-medium">Operations</p>
                            </div>
                            <div className="flex-shrink-0">
                              <BarChart3 className="w-[18px] h-[18px] text-[#FF6B35]" />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            ) : (
              // Conversation View
              <ConversationView
                question={currentQuestion}
                onBack={() => {
                  setConversationActive(false);
                  setIsFromCanvas(false);
                  setCanvasWidgetId(null);
                  setActiveRadarCard(null);
                }}
                activeView={activeView}
                onViewChange={onViewChange}
                fromCanvas={isFromCanvas}
                widgetId={canvasWidgetId}
                onOpenFeedback={onOpenFeedback}
                radarCard={activeRadarCard}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={onToggleSidebar}
                isTrial={isTrial}
                isVp={isVp}
                onUpgrade={onUpgrade}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Created Card Display */}
      {createdCard && <CreatedCardDisplay card={createdCard} />}
    </>
  );
}