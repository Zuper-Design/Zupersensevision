import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Plus, MoreHorizontal, RotateCw, Download, List, LayoutGrid, Columns3, Filter,
  X, ArrowLeft, Tag,
  AlertCircle, Clock, Bell, MessageSquare, Copy,
  Mic, MicOff, ArrowUp, ArrowRight, Sparkles, Command,
  FileText, UserX, Pause, Bookmark, Check, CheckCircle2, Pin, PinOff
} from 'lucide-react';
import { FilterPanel } from './FilterPanel';
import { SenseLogo } from './SenseLogo';
import { JobDetailPage } from './JobDetailPage';

// ─── Sense message types ───
type SenseMessage =
  | { role: 'user' | 'ai'; type?: 'text'; text: string }
  | {
      role: 'ai';
      type: 'save-view-prompt';
      filterKey: string;
      filterLabel: string;
      matchCount: number;
      resolved?: boolean;
      dismissed?: boolean;
      savedViewName?: string;
    };

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    'Started': 'bg-[#FFF4ED] text-[#EA580C] border border-[#FDBA74]',
    'On My Way': 'bg-[#EFF6FF] text-[#2563EB] border border-[#93C5FD]',
    'On my way': 'bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC]',
    'Address check': 'bg-[#FFFBEB] text-[#D97706] border border-[#FCD34D]',
    'Copy Field': 'bg-[#F5F3FF] text-[#7C3AED] border border-[#C4B5FD]',
    'New': 'bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC]',
  };
  if (!status) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] whitespace-nowrap ${styles[status] || 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'}`} style={{ fontWeight: 500 }}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === 'Medium' ? 'text-[#D97706]' : priority === 'High' ? 'text-[#DC2626]' : 'text-[#6B7280]';
  return <span className={`text-[13px] ${color}`}>{priority}</span>;
}

// Avatar component
function UserAvatar({ name, color, image }: { name: string; color?: string; image?: string }) {
  if (image) {
    return (
      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 border border-white shadow-sm">
        <div className="w-full h-full bg-[#E5E7EB] flex items-center justify-center text-[10px] text-[#6B7280]" style={{ fontWeight: 600 }}>
          {name.charAt(0)}
        </div>
      </div>
    );
  }
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0 border border-white shadow-sm"
      style={{ backgroundColor: color || '#6B7280', fontWeight: 600 }}
    >
      {name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
    </div>
  );
}

// Icon badges for job features
function JobIcons({ icons }: { icons: string[] }) {
  return (
    <span className="inline-flex gap-1 ml-1.5">
      {icons.includes('comment') && <MessageSquare className="w-3.5 h-3.5 text-[#9CA3AF]" />}
      {icons.includes('alert') && <AlertCircle className="w-3.5 h-3.5 text-[#9CA3AF]" />}
      {icons.includes('clock') && <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />}
      {icons.includes('bell') && <Bell className="w-3.5 h-3.5 text-[#9CA3AF]" />}
      {icons.includes('copy') && <Copy className="w-3.5 h-3.5 text-[#9CA3AF]" />}
    </span>
  );
}

interface Job {
  id: string;
  workOrderNumber: string;
  jobTitle: string;
  customer: string;
  users: { name: string; color?: string }[];
  usersLabel: string;
  category: string;
  serviceAddress: string;
  status: string;
  priority: string;
  scheduledDate: string;
  dueDate: string;
  icons?: string[];
  commentCount?: number;
  anomalyTags?: string[]; // 'no-invoice' | 'no-tech' | 'stalled'
}

const mockJobs: Job[] = [
  {
    id: '1', workOrderNumber: 'pre103598', jobTitle: 'validation release', customer: '',
    users: [{ name: 'Prashanth M', color: '#6366F1' }], usersLabel: 'Prashanth ...',
    category: 'Service Category', serviceAddress: 'Daniel Street, Ramap...',
    status: 'Started', priority: 'Low', scheduledDate: '03/11/2026 02:00 PM...', dueDate: '03/11/2026',
    icons: [], anomalyTags: ['no-invoice']
  },
  {
    id: '2', workOrderNumber: 'pre103597', jobTitle: 'Visit for 1 Arlene - 1 ...', customer: '1 Arlene - 1 ...',
    users: [{ name: 'John Doe', color: '#3B82F6' }], usersLabel: 'John Doe',
    category: 'Home Cleaning', serviceAddress: 'Chennai, India, nkl, T...',
    status: 'On My Way', priority: 'Low', scheduledDate: '03/11/2026 01:07 PM...', dueDate: '03/11/2026',
    icons: ['alert'], commentCount: 1, anomalyTags: ['no-invoice']
  },
  {
    id: '3', workOrderNumber: 'pre103596', jobTitle: 'Visit for A&A', customer: '',
    users: [{ name: 'Raghav Gu', color: '#8B5CF6' }], usersLabel: 'Raghav Gu...',
    category: 'Gen IOS', serviceAddress: 'A N A Roofing LLC, ...',
    status: '', priority: 'Low', scheduledDate: 'Not Yet Scheduled', dueDate: '03/28/2026',
    icons: ['comment'], commentCount: 2, anomalyTags: ['no-invoice', 'stalled']
  },
  {
    id: '4', workOrderNumber: 'pre103595', jobTitle: 'Roofing & Gutters for...', customer: 'Akashraj K',
    users: [{ name: 'Richard H', color: '#EF4444' }], usersLabel: 'Richard H...',
    category: 'Proper Category', serviceAddress: 'Chennai International...',
    status: 'Address check', priority: 'Low', scheduledDate: '03/11/2026 12:30 PM...', dueDate: '03/15/2026',
    icons: ['alert'], commentCount: 7, anomalyTags: ['no-invoice']
  },
  {
    id: '5', workOrderNumber: 'pre103594', jobTitle: 'Roofing For House', customer: 'Akashraj K',
    users: [{ name: 'FieldExecu', color: '#A855F7' }], usersLabel: 'FieldExecu...',
    category: 'Proper Category', serviceAddress: 'Chennai International...',
    status: 'Address check', priority: 'Medium', scheduledDate: '03/11/2026 12:00 PM...', dueDate: '03/11/2026',
    icons: ['bell'], anomalyTags: ['no-invoice']
  },
  {
    id: '6', workOrderNumber: 'pre103593', jobTitle: 'Roofing For House', customer: 'Akashraj K',
    users: [{ name: 'RT', color: '#EF4444' }, { name: 'T', color: '#10B981' }], usersLabel: 'R T 21',
    category: 'Proper Category', serviceAddress: 'Chennai International...',
    status: 'Copy Field', priority: 'Low', scheduledDate: '03/11/2026 10:00 PM...', dueDate: '03/11/2026',
    icons: ['alert'], commentCount: 1, anomalyTags: ['no-invoice']
  },
  {
    id: '7', workOrderNumber: 'pre103592', jobTitle: 'Roofing for Sparky', customer: 'Bharath Sparky',
    users: [], usersLabel: 'No Users / Te...',
    category: 'Proper Category', serviceAddress: 'Seattle, WA, USA, Se...',
    status: 'On my way', priority: 'Low', scheduledDate: '03/11/2026 12:00 AM...', dueDate: '03/11/2026',
    icons: [], anomalyTags: ['no-tech', 'no-invoice']
  },
  {
    id: '8', workOrderNumber: 'pre103591', jobTitle: 'hhhh', customer: '',
    users: [{ name: 'Heidi S', color: '#F59E0B' }], usersLabel: 'Heidi S',
    category: 'Equipment Repair', serviceAddress: 'nerur, Karur, Tamil N...',
    status: 'Started', priority: 'Low', scheduledDate: 'Not Yet Scheduled', dueDate: '',
    icons: [], anomalyTags: ['stalled']
  },
  {
    id: '9', workOrderNumber: 'pre103590', jobTitle: 'Roofing and Gutters ...', customer: '1 Arlene - 1 ...',
    users: [], usersLabel: 'No Users / Te...',
    category: 'Roofing', serviceAddress: 'Thiruvanmiyur, Chen...',
    status: 'New', priority: 'Low', scheduledDate: '03/10/2026 08:00 A...', dueDate: '03/10/2026',
    icons: [], anomalyTags: ['no-tech', 'no-invoice']
  },
  {
    id: '10', workOrderNumber: 'pre103589', jobTitle: 'Visit to Totoro Test', customer: 'Totoro Test',
    users: [{ name: 'Heidi S', color: '#F59E0B' }], usersLabel: 'Heidi S',
    category: 'Home Cleaning', serviceAddress: 'Turyaa Chennai, Old ...',
    status: 'New', priority: 'Low', scheduledDate: '04/10/2026 03:14 P...', dueDate: '',
    icons: [], anomalyTags: ['no-invoice']
  },
  {
    id: '11', workOrderNumber: 'pre103588', jobTitle: 'Visit Task test', customer: '1 Arlene - 1 ...',
    users: [{ name: 'John Doe', color: '#3B82F6' }], usersLabel: 'John Doe',
    category: 'Home Cleaning', serviceAddress: 'Chennai, India, nkl, T...',
    status: 'New', priority: 'Low', scheduledDate: '03/10/2026 03:10 PM...', dueDate: '03/10/2026',
    icons: [], anomalyTags: ['no-invoice']
  },
  {
    id: '12', workOrderNumber: 'pre103582', jobTitle: 'MAR_10_chll_job_test', customer: '',
    users: [], usersLabel: 'No Users / Te...',
    category: 'android test', serviceAddress: 'Guindy Railway Stati...',
    status: '', priority: 'Low', scheduledDate: '03/11/2026 11:00 AM ...', dueDate: '',
    icons: ['copy', 'bell'], anomalyTags: ['no-tech', 'stalled']
  },
  {
    id: '13', workOrderNumber: 'pre103581', jobTitle: 'MAR_10_chll_job_test', customer: '',
    users: [], usersLabel: 'No Users / Te...',
    category: 'android test', serviceAddress: 'Guindy Railway Stati...',
    status: '', priority: 'Low', scheduledDate: '03/11/2026 11:00 AM...', dueDate: '',
    icons: ['copy'], anomalyTags: ['no-tech']
  },
  {
    id: '14', workOrderNumber: 'pre103574', jobTitle: 'MAR_10_chll_job_test', customer: '',
    users: [], usersLabel: 'No Users / Te...',
    category: 'android test', serviceAddress: 'Guindy Railway Stati...',
    status: '', priority: 'Low', scheduledDate: '03/10/2026 10:00 AM...', dueDate: '',
    icons: ['copy'], anomalyTags: ['no-tech']
  },
  {
    id: '15', workOrderNumber: 'pre103573', jobTitle: 'Proposal for Sesha ...', customer: 'Sesha Mad...',
    users: [], usersLabel: 'No Users / Te...',
    category: 'Proper Category', serviceAddress: 'M. A. Chidambaram ...',
    status: 'Address check', priority: 'Low', scheduledDate: 'Not Yet Scheduled', dueDate: '03/31/2026',
    icons: [], anomalyTags: ['no-tech', 'stalled']
  },
];

interface JobListingPageProps {
  onBack: () => void;
}

export function JobListingPage({ onBack }: JobListingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);
  const rowsDropdownRef = useRef<HTMLDivElement>(null);
  const [senseQuery, setSenseQuery] = useState('');
  const [senseInputFocused, setSenseInputFocused] = useState(false);
  const [anomalyFilter, setAnomalyFilter] = useState<string | null>(null); // 'no-invoice' | 'no-tech' | 'stalled' | null
  const [senseOpen, setSenseOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [senseProcessing, setSenseProcessing] = useState(false);
  const [senseResult, setSenseResult] = useState<string | null>(null);
  const senseInputRef = useRef<HTMLInputElement>(null);
  const [senseListening, setSenseListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [senseMessages, setSenseMessages] = useState<SenseMessage[]>([]);
  const senseChatEndRef = useRef<HTMLDivElement>(null);
  const [activeJobDetail, setActiveJobDetail] = useState<Job | null>(null);
  const [savedViews, setSavedViews] = useState<{id: string; name: string; filterKey: string; query: string; pinned: boolean}[]>([]);
  const [pendingSaveViewName, setPendingSaveViewName] = useState('');
  const [savedViewsDropdownOpen, setSavedViewsDropdownOpen] = useState(false);
  const savedViewsDropdownRef = useRef<HTMLDivElement>(null);
  const savedViewsBtnRef = useRef<HTMLButtonElement>(null);
  const [savedViewsDropdownPos, setSavedViewsDropdownPos] = useState<{ top: number; left: number } | null>(null);

  // Row-level anomaly flags
  const amberFlaggedRows = new Set(['3', '7', '12']); // pre103596, pre103592, pre103582
  const redFlaggedRows = new Set(['8']); // pre103591

  const totalJobs = 2096;
  const totalPages = Math.ceil(totalJobs / rowsPerPage);

  // Cleanup speech recognition on unmount or palette close
  useEffect(() => {
    if (!senseOpen && recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      setSenseListening(false);
    }
  }, [senseOpen]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Start / stop voice recognition
  const toggleVoiceInput = () => {
    if (senseListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setSenseListening(false);
      return;
    }

    // Simulated voice fallback for environments without mic permissions
    const startSimulatedVoice = () => {
      setSenseListening(true);
      const demoQueries = [
        'show me jobs with no invoice',
        'which jobs have no tech assigned',
        'stalled jobs this week',
      ];
      const chosen = demoQueries[Math.floor(Math.random() * demoQueries.length)];
      const words = chosen.split(' ');
      let currentIndex = 0;

      const wordInterval = setInterval(() => {
        currentIndex++;
        setSenseQuery(words.slice(0, currentIndex).join(' '));
        if (currentIndex >= words.length) {
          clearInterval(wordInterval);
          setTimeout(() => {
            setSenseListening(false);
            setTimeout(() => {
              handleSenseSubmit();
            }, 300);
          }, 600);
        }
      }, 220);

      recognitionRef.current = {
        abort: () => { clearInterval(wordInterval); setSenseListening(false); },
        stop: () => { clearInterval(wordInterval); setSenseListening(false); },
      };
    };

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      startSimulatedVoice();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setSenseListening(true);
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSenseQuery(transcript);
    };

    recognition.onend = () => {
      setSenseListening(false);
      recognitionRef.current = null;
      setTimeout(() => {
        const input = senseInputRef.current;
        if (input && input.value.trim()) {
          handleSenseSubmit();
        }
      }, 300);
    };

    recognition.onerror = () => {
      setSenseListening(false);
      recognitionRef.current = null;
      startSimulatedVoice();
    };

    try {
      recognition.start();
    } catch {
      startSimulatedVoice();
    }
  };

  // Close rows dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rowsDropdownRef.current && !rowsDropdownRef.current.contains(e.target as Node)) {
        setRowsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Hotkey: Cmd+K / Ctrl+K to toggle Sense command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSenseOpen(prev => {
          if (!prev) {
            // Opening — clear previous results, close filter
            setSenseResult(null);
            setSenseProcessing(false);
            setFilterOpen(false);
          }
          return !prev;
        });
      }
      if (e.key === 'Escape' && senseOpen) {
        setSenseOpen(false);
        setSenseResult(null);
        setSenseProcessing(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [senseOpen]);

  // Auto-focus input when command palette opens
  useEffect(() => {
    if (senseOpen && senseInputRef.current) {
      setTimeout(() => senseInputRef.current?.focus(), 100);
    }
  }, [senseOpen]);

  // Natural language parsing for Sense queries
  const parseSenseQuery = (query: string): { filterKey: string | null; label: string } => {
    const q = query.toLowerCase().trim();

    // Invoice-related
    if (q.includes('no invoice') || q.includes('without invoice') || q.includes('missing invoice') || q.includes('uninvoiced') || q.includes('not invoiced')) {
      return { filterKey: 'no-invoice', label: 'No invoice' };
    }

    // Tech/assignment-related
    if (q.includes('no tech') || q.includes('unassigned') || q.includes('not assigned') || q.includes('no technician') || q.includes('missing tech') || q.includes('without tech') || q.includes('no one assigned')) {
      return { filterKey: 'no-tech', label: 'No tech assigned' };
    }

    // Stalled-related
    if (q.includes('stalled') || q.includes('stuck') || q.includes('no update') || q.includes('no progress') || q.includes('inactive') || q.includes('no status')) {
      return { filterKey: 'stalled', label: 'Stalled 5+ days' };
    }

    return { filterKey: null, label: '' };
  };

  const handleSenseSubmit = () => {
    if (!senseQuery.trim()) return;
    const userMsg = senseQuery.trim();
    setSenseMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setSenseQuery('');
    setSenseProcessing(true);
    setSenseResult(null);

    setTimeout(() => {
      const { filterKey, label } = parseSenseQuery(userMsg);
      setSenseProcessing(false);

      if (filterKey) {
        const matchCount = mockJobs.filter(j => j.anomalyTags?.includes(filterKey)).length;
        setSenseMessages(prev => [...prev, {
          role: 'ai', type: 'text',
          text: `Got it — filtering to ${matchCount} job${matchCount !== 1 ? 's' : ''} with "${label}".`,
        }]);
        setSenseResult(`Applied filter: ${label}`);
        setAnomalyFilter(filterKey);
        setCurrentPage(1);
        setSelectedJobs(new Set());
        setSelectAll(false);
        // Show save-view prompt in chat
        setTimeout(() => {
          setPendingSaveViewName(label);
          setSenseMessages(prev => [...prev, {
            role: 'ai', type: 'save-view-prompt', filterKey, filterLabel: label, matchCount,
          }]);
        }, 420);
      } else {
        setSenseMessages(prev => [...prev, {
          role: 'ai', type: 'text',
          text: 'I couldn\'t match a filter for that. Try asking about "jobs with no invoice", "unassigned jobs", or "stalled jobs".',
        }]);
        setSenseResult(null);
      }
    }, 800);
  };

  // Auto-scroll chat
  useEffect(() => {
    senseChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [senseMessages, senseProcessing]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedJobs(new Set());
    } else {
      setSelectedJobs(new Set(mockJobs.map(j => j.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectJob = (id: string) => {
    const newSelected = new Set(selectedJobs);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedJobs(newSelected);
    setSelectAll(newSelected.size === mockJobs.length);
  };

  // Anomaly filter labels
  const anomalyFilterLabels: Record<string, string> = {
    'no-invoice': 'No invoice',
    'no-tech': 'No tech assigned',
    'stalled': 'Stalled 5+ days',
  };

  // Shared helper: inject AI "filter applied" + save-view-prompt messages into chat
  const injectFilterMessages = (filterKey: string, label: string, matchCount: number) => {
    setSenseOpen(true);
    setFilterOpen(false);
    setTimeout(() => {
      setSenseMessages(prev => [
        ...prev,
        { role: 'ai', type: 'text', text: `Filter applied — showing ${matchCount} job${matchCount !== 1 ? 's' : ''} with "${label}".` },
      ]);
      setTimeout(() => {
        setPendingSaveViewName(label);
        setSenseMessages(prev => [
          ...prev,
          { role: 'ai', type: 'save-view-prompt', filterKey, filterLabel: label, matchCount },
        ]);
      }, 420);
    }, 280);
  };

  const handleAnomalyCardClick = (filterKey: string) => {
    const isActivating = anomalyFilter !== filterKey;
    setAnomalyFilter(prev => prev === filterKey ? null : filterKey);
    setCurrentPage(1);
    setSelectedJobs(new Set());
    setSelectAll(false);
    if (isActivating) {
      const label = anomalyFilterLabels[filterKey];
      const matchCount = mockJobs.filter(j => j.anomalyTags?.includes(filterKey)).length;
      injectFilterMessages(filterKey, label, matchCount);
    }
  };

  // Save a view from the chat prompt
  const handleSaveView = (msgIndex: number, filterKey: string, viewName: string) => {
    const name = (viewName || '').trim() || anomalyFilterLabels[filterKey];
    setSavedViews(prev => [
      ...prev,
      { id: Date.now().toString(), name, filterKey, query: name, pinned: false },
    ]);
    setSenseMessages(prev =>
      prev.map((msg, i) =>
        i === msgIndex && msg.type === 'save-view-prompt'
          ? { ...msg, resolved: true, dismissed: false, savedViewName: name }
          : msg
      )
    );
    setPendingSaveViewName('');
  };

  const savedViewsPortalRef = useRef<HTMLDivElement | null>(null);

  // Close saved views dropdown on outside click
  useEffect(() => {
    if (!savedViewsDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideBtn = savedViewsDropdownRef.current?.contains(target);
      const insidePortal = savedViewsPortalRef.current?.contains(target);
      if (!insideBtn && !insidePortal) {
        setSavedViewsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [savedViewsDropdownOpen]);

  // Dismiss the save-view prompt
  const handleDismissSaveView = (msgIndex: number) => {
    setSenseMessages(prev =>
      prev.map((msg, i) =>
        i === msgIndex && msg.type === 'save-view-prompt'
          ? { ...msg, resolved: true, dismissed: true }
          : msg
      )
    );
    setPendingSaveViewName('');
  };

  // Apply both search and anomaly filters
  let filteredJobs = mockJobs;
  if (anomalyFilter) {
    filteredJobs = filteredJobs.filter(j => j.anomalyTags?.includes(anomalyFilter));
  }
  if (searchQuery) {
    filteredJobs = filteredJobs.filter(j =>
      j.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.workOrderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // If a job detail is active, show the detail page
  if (activeJobDetail) {
    return (
      <JobDetailPage
        jobId={activeJobDetail.id}
        workOrderNumber={activeJobDetail.workOrderNumber}
        jobTitle={activeJobDetail.jobTitle}
        onBack={() => setActiveJobDetail(null)}
      />
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden bg-white rounded-xl border border-[#E6E8EC]" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header - matches detail page style */}
      <div className="flex-shrink-0 bg-white">
        {/* Top row: Title + Actions */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[#1C1E21]" style={{ fontSize: '16px', fontWeight: 600 }}>Jobs</h1>
            <span className="bg-[#10B981] text-white text-[11px] px-2 py-0.5 rounded-md" style={{ fontWeight: 600 }}>
              {anomalyFilter ? filteredJobs.length.toLocaleString() : totalJobs.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg border border-[#E6E8EC] hover:bg-[#F8F9FB] transition-colors text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>
              <RotateCw className="w-3.5 h-3.5 text-[#1C1E21]" />
              Recurring Jobs
            </button>
            <button className="flex items-center gap-1.5 h-[32px] px-3 rounded-lg bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] transition-all duration-150 text-white text-[13px]" style={{ fontWeight: 600 }}>
              <Plus className="w-3.5 h-3.5" />
              New Job
            </button>
          </div>
        </div>
      </div>

      {/* === Sense Anomaly Cards === */}
      <div className="px-6 py-2.5 flex-shrink-0 flex items-center gap-3">
        <SenseAnomalyCard
          icon={<FileText className="w-4 h-4 text-[#D97706]" />}
          iconBg="#FEF3C7"
          title="11 Jobs · No Invoice"
          subtitle="Potential revenue at risk"
          onClick={() => handleAnomalyCardClick('no-invoice')}
          active={anomalyFilter === 'no-invoice'}
        />
        <SenseAnomalyCard
          icon={<UserX className="w-4 h-4 text-[#D97706]" />}
          iconBg="#FEF3C7"
          title="6 Jobs · No Tech"
          subtitle="Unassigned, needs attention"
          onClick={() => handleAnomalyCardClick('no-tech')}
          active={anomalyFilter === 'no-tech'}
        />
        <SenseAnomalyCard
          icon={<Pause className="w-4 h-4 text-[#DC2626]" />}
          iconBg="#FEE2E2"
          title="4 Jobs · Stalled 5+ Days"
          subtitle="No progress or updates"
          onClick={() => handleAnomalyCardClick('stalled')}
          active={anomalyFilter === 'stalled'}
        />
      </div>

      {/* Filter bar */}
      <div className="px-6 pt-0 pb-0 flex-shrink-0 bg-white" style={{ position: 'relative', zIndex: 40 }}>
        <div className="flex items-center gap-3 py-3 border-b border-[#E6E8EC] min-w-0">
          {/* Left scrollable chips zone */}
          <div
            className="filter-scroll-zone flex items-center gap-2 flex-1 min-w-0 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
            {/* All Jobs dropdown */}
            <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] hover:bg-[#F8F9FB] transition-colors text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>
              All Jobs
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>

            {/* Filter button */}
            <button
              onClick={() => { setFilterOpen(prev => !prev); setSenseOpen(false); }}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-[13px] ${
                filterOpen
                  ? 'border-[#FD5000] bg-[#FFF4ED] text-[#FD5000]'
                  : 'border-[#E6E8EC] hover:bg-[#F8F9FB] text-[#6B7280]'
              }`}
              style={{ fontWeight: 500 }}
            >
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>

            {/* Tags button */}
            <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] hover:bg-[#F8F9FB] transition-colors text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>
              <Tag className="w-3.5 h-3.5 text-[#9CA3AF]" />
              Tags
            </button>

            {/* Job Priority */}
            <button className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] hover:bg-[#F8F9FB] transition-colors text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
              Job Priority
            </button>

            {/* Pinned saved view chips */}
            {savedViews.filter(v => v.pinned).map(view => (
              <div
                key={view.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setAnomalyFilter(view.filterKey);
                  setCurrentPage(1);
                  setSelectedJobs(new Set());
                  setSelectAll(false);
                }}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { setAnomalyFilter(view.filterKey); setCurrentPage(1); } }}
                className="group/view flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-[12px] cursor-pointer select-none"
                style={{
                  fontWeight: 600,
                  background: anomalyFilter === view.filterKey
                    ? 'linear-gradient(135deg, #EEF2FF, #E0E7FF)'
                    : '#F8F9FB',
                  border: anomalyFilter === view.filterKey
                    ? '1px solid rgba(99, 102, 241, 0.30)'
                    : '1px solid #E6E8EC',
                  color: anomalyFilter === view.filterKey ? '#4338CA' : '#6B7280',
                }}
              >
                <Pin className="w-3 h-3" style={{ color: anomalyFilter === view.filterKey ? '#6366F1' : '#9CA3AF' }} />
                {view.name}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSavedViews(prev => prev.map(v => v.id === view.id ? { ...v, pinned: false } : v));
                  }}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setSavedViews(prev => prev.map(v => v.id === view.id ? { ...v, pinned: false } : v)); } }}
                  className="ml-0.5 p-0.5 rounded opacity-0 group-hover/view:opacity-100 hover:bg-white/60 transition-all cursor-pointer"
                  title="Unpin"
                >
                  <X className="w-2.5 h-2.5" />
                </span>
              </div>
            ))}

          </div>{/* end left scrollable zone */}

          {/* Saved Views dropdown — portal-rendered so overflow:hidden parents don't clip it */}
          {savedViews.length > 0 && (
            <div className="flex-shrink-0" ref={savedViewsDropdownRef}>
              <button
                ref={savedViewsBtnRef}
                onClick={() => {
                  if (!savedViewsDropdownOpen) {
                    const rect = savedViewsBtnRef.current?.getBoundingClientRect();
                    if (rect) setSavedViewsDropdownPos({ top: rect.bottom + 6, left: rect.left });
                  }
                  setSavedViewsDropdownOpen(o => !o);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-[12px] select-none"
                style={{
                  fontWeight: 600,
                  background: savedViewsDropdownOpen ? '#F3F4F6' : '#F8F9FB',
                  border: savedViewsDropdownOpen ? '1px solid #D1D5DB' : '1px solid #E6E8EC',
                  color: '#6B7280',
                }}
              >
                <Bookmark className="w-3 h-3 text-[#9CA3AF]" />
                Saved Views
                <span
                  className="ml-0.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] text-white"
                  style={{ background: '#6366F1', fontWeight: 700 }}
                >
                  {savedViews.length}
                </span>
                <ChevronDown className={`w-3 h-3 text-[#9CA3AF] transition-transform ${savedViewsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {savedViewsDropdownOpen && savedViewsDropdownPos && ReactDOM.createPortal(
                <div
                  ref={savedViewsPortalRef}
                  style={{
                    position: 'fixed',
                    top: savedViewsDropdownPos.top,
                    left: savedViewsDropdownPos.left,
                    width: '260px',
                    zIndex: 9999,
                    background: '#fff',
                    border: '1px solid #E6E8EC',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
                    fontFamily: 'DM Sans, system-ui, sans-serif',
                  }}
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between">
                    <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 700 }}>Saved Views</span>
                    <span className="text-[11px] text-[#9CA3AF]">{savedViews.length} view{savedViews.length !== 1 ? 's' : ''}</span>
                  </div>

                  {/* View list */}
                  <div className="py-1.5 max-h-[320px] overflow-y-auto">
                    {savedViews.map(view => (
                      <div
                        key={view.id}
                        className="group flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#F8F9FB] transition-colors"
                      >
                        {/* Clickable label */}
                        <button
                          className="flex-1 flex items-center gap-2 text-left min-w-0"
                          onClick={() => {
                            setAnomalyFilter(view.filterKey);
                            setCurrentPage(1);
                            setSelectedJobs(new Set());
                            setSelectAll(false);
                            setSavedViewsDropdownOpen(false);
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ background: anomalyFilter === view.filterKey ? '#EEF2FF' : '#F3F4F6' }}
                          >
                            <Bookmark className="w-3 h-3" style={{ color: anomalyFilter === view.filterKey ? '#6366F1' : '#9CA3AF' }} />
                          </div>
                          <span
                            className="text-[13px] truncate"
                            style={{
                              fontWeight: anomalyFilter === view.filterKey ? 600 : 500,
                              color: anomalyFilter === view.filterKey ? '#4338CA' : '#1C1E21',
                            }}
                          >
                            {view.name}
                          </span>
                          {anomalyFilter === view.filterKey && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] flex-shrink-0" />
                          )}
                        </button>

                        {/* Action buttons — visible on hover */}
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => setSavedViews(prev => prev.map(v => v.id === view.id ? { ...v, pinned: !v.pinned } : v))}
                            className="p-1 rounded-md hover:bg-[#E6E8EC] transition-colors"
                            title={view.pinned ? 'Unpin from bar' : 'Pin to filter bar'}
                          >
                            {view.pinned
                              ? <PinOff className="w-3 h-3 text-[#6366F1]" />
                              : <Pin className="w-3 h-3 text-[#9CA3AF]" />
                            }
                          </button>
                          <button
                            onClick={() => {
                              setSavedViews(prev => prev.filter(v => v.id !== view.id));
                              if (anomalyFilter === view.filterKey) {
                                setAnomalyFilter(null);
                                setCurrentPage(1);
                              }
                            }}
                            className="p-1 rounded-md hover:bg-[#FEE2E2] transition-colors"
                            title="Delete view"
                          >
                            <X className="w-3 h-3 text-[#9CA3AF]" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer hint */}
                  <div className="px-4 py-2.5 border-t border-[#F3F4F6] bg-[#FAFBFC]">
                    <p className="text-[11px] text-[#C4C8D0]" style={{ fontWeight: 500 }}>
                      <Pin className="w-2.5 h-2.5 inline mr-1 mb-0.5" />
                      Pin a view to keep it on the filter bar
                    </p>
                  </div>
                </div>,
                document.body
              )}
            </div>
          )}

            {/* Sense anomaly filter chip */}
            {anomalyFilter && (
              <button
                onClick={() => { setAnomalyFilter(null); setCurrentPage(1); }}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-[12px]"
                style={{
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#92400E',
                }}
              >
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                {anomalyFilterLabels[anomalyFilter]}
                <span
                  className="flex items-center justify-center w-4 h-4 rounded-full text-[10px] text-white"
                  style={{ fontWeight: 700, background: '#D97706' }}
                >
                  {filteredJobs.length}
                </span>
                <X className="w-3 h-3 text-[#B45309] ml-0.5" />
              </button>
            )}

          {/* Right group */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Create New View */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] hover:bg-[#F8F9FB] transition-colors text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>
              <Plus className="w-3.5 h-3.5" />
              Create New View
            </button>

            {/* Search */}
            <div className="relative flex items-center rounded-lg border border-[#E6E8EC] hover:border-[#D1D5DB] transition-colors" style={{ width: '190px' }}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-[13px] text-[#1C1E21] placeholder-[#9CA3AF] w-full bg-transparent focus:outline-none rounded-lg"
              />
            </div>

            {/* Columns */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] hover:bg-[#F8F9FB] transition-colors text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>
              <Columns3 className="w-3.5 h-3.5" />
              Columns
            </button>

            {/* View toggle */}
            <div className="flex items-center bg-[#F3F4F6] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              >
                <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-[#1C1E21]' : 'text-[#9CA3AF]'}`} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
              >
                <LayoutGrid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-[#1C1E21]' : 'text-[#9CA3AF]'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sense keyframe styles for slider */}
      <style>{`
        @keyframes sensePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.15); }
          50% { box-shadow: 0 0 0 8px rgba(245, 166, 35, 0); }
        }
        .filter-scroll-zone::-webkit-scrollbar { display: none; }
      `}</style>



      {/* Table */}
      <div className="flex-1 overflow-auto mt-1">
        <table className="w-full min-w-[1200px]">
          <thead className="sticky top-0 z-10 bg-[#FAFBFC]">
            <tr className="border-b border-[#E6E8EC]">
              <th className="w-[40px] px-3 py-3">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="appearance-none w-4 h-4 rounded border border-[#D1D5DB] bg-white checked:bg-[#FD5000] checked:border-[#FD5000] focus:ring-2 focus:ring-[#FD5000]/20 cursor-pointer transition-colors"
                  />
                  {selectAll && (
                    <svg className="absolute w-3 h-3 text-white pointer-events-none" viewBox="0 0 12 12" fill="none">
                      <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Work Order Nu...
                <ChevronDown className="w-3 h-3 inline-block ml-1 text-[#9CA3AF]" />
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Job Title
                <ChevronDown className="w-3 h-3 inline-block ml-1 text-[#9CA3AF]" />
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Customer
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Users / Teams Assi...
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Category
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Service Address
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Status
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Priority
                <ChevronDown className="w-3 h-3 inline-block ml-1 text-[#9CA3AF]" />
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Scheduled Date
                <ChevronDown className="w-3 h-3 inline-block ml-1 text-[#9CA3AF]" />
              </th>
              <th className="px-3 py-3 text-left text-[12px] text-[#6B7280] whitespace-nowrap" style={{ fontWeight: 500 }}>
                Due Date
              </th>
              <th className="w-[40px] px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => {
              const isAmber = amberFlaggedRows.has(job.id);
              const isRed = redFlaggedRows.has(job.id);
              const isFlagged = isAmber || isRed;
              return (
              <tr
                key={job.id}
                onClick={() => setActiveJobDetail(job)}
                className={`border-b border-[#F3F4F6] hover:bg-[#FAFBFC] transition-colors group cursor-pointer`}
                style={{
                  ...(isFlagged ? {
                    borderLeft: `3px solid ${isRed ? '#E8553A' : '#F5A623'}`,
                    backgroundColor: isRed ? 'rgba(232, 85, 58, 0.02)' : 'rgba(245, 166, 35, 0.03)',
                  } : {}),
                }}
              >
                <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedJobs.has(job.id)}
                      onChange={() => handleSelectJob(job.id)}
                      className="appearance-none w-4 h-4 rounded border border-[#D1D5DB] bg-white checked:bg-[#FD5000] checked:border-[#FD5000] focus:ring-2 focus:ring-[#FD5000]/20 cursor-pointer transition-colors"
                    />
                    {selectedJobs.has(job.id) && (
                      <svg className="absolute w-3 h-3 text-white pointer-events-none" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveJobDetail(job)}
                      className="text-[13px] text-[#1C1E21] hover:underline transition-colors cursor-pointer"
                      style={{ fontWeight: 500 }}
                    >
                      {job.workOrderNumber}
                    </button>
                    {job.icons && job.icons.length > 0 && <JobIcons icons={job.icons} />}
                    {job.commentCount && (
                      <span className="text-[11px] text-[#9CA3AF] ml-0.5">{job.commentCount}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="text-[13px] text-[#1C1E21] max-w-[160px] truncate block">{job.jobTitle}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-[13px] text-[#1C1E21] max-w-[120px] truncate block">{job.customer}</span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    {job.users.length > 0 ? (
                      <>
                        <div className="flex -space-x-1.5">
                          {job.users.map((user, i) => (
                            <UserAvatar key={i} name={user.name} color={user.color} />
                          ))}
                        </div>
                        <span className="text-[13px] text-[#1C1E21] truncate max-w-[100px]">{job.usersLabel}</span>
                      </>
                    ) : (
                      <span className="text-[13px] text-[#9CA3AF]">{job.usersLabel}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="text-[13px] text-[#1C1E21] max-w-[140px] truncate block">{job.category}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-[13px] text-[#6B7280] max-w-[160px] truncate block">{job.serviceAddress}</span>
                </td>
                <td className="px-3 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-3 py-3">
                  <PriorityBadge priority={job.priority} />
                </td>
                <td className="px-3 py-3">
                  <span className={`text-[13px] max-w-[160px] truncate block ${job.scheduledDate === 'Not Yet Scheduled' ? 'text-[#9CA3AF]' : 'text-[#1C1E21]'}`}>
                    {job.scheduledDate}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className="text-[13px] text-[#1C1E21]">{job.dueDate}</span>
                </td>
                <td className="px-3 py-3">
                  <button className="p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#F3F4F6] transition-all">
                    <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#E6E8EC] bg-white flex-shrink-0">
        <div className="flex items-center gap-2 relative" ref={rowsDropdownRef}>
          <span className="text-[13px] text-[#6B7280]">Rows per page</span>
          <button
            onClick={() => setRowsDropdownOpen(!rowsDropdownOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-md border border-[#E6E8EC] hover:bg-[#F8F9FB] text-[13px] text-[#1C1E21] transition-colors"
            style={{ fontWeight: 500 }}
          >
            {rowsPerPage}
            <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
          </button>
          {rowsDropdownOpen && (
            <div className="absolute bottom-full left-12 mb-1 bg-white rounded-lg border border-[#E6E8EC] shadow-lg py-1 z-50">
              {[10, 15, 25, 50, 100].map(n => (
                <button
                  key={n}
                  onClick={() => { setRowsPerPage(n); setRowsDropdownOpen(false); setCurrentPage(1); }}
                  className={`w-full px-4 py-1.5 text-left text-[13px] hover:bg-[#F8F9FB] transition-colors ${n === rowsPerPage ? 'text-[#FD5000]' : 'text-[#1C1E21]'}`}
                  style={{ fontWeight: n === rowsPerPage ? 600 : 400 }}
                >
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[13px] text-[#6B7280]">
            Page <span className="text-[#1C1E21]" style={{ fontWeight: 500 }}>{currentPage}</span> of <span className="text-[#1C1E21]" style={{ fontWeight: 500 }}>{totalPages.toLocaleString()}</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft className="w-4 h-4 text-[#6B7280]" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#6B7280]" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </div>

    {/* === Filter Right Slider Panel === */}
    <FilterPanel
      isOpen={filterOpen}
      onClose={() => setFilterOpen(false)}
      anomalyFilter={anomalyFilter}
      anomalyFilterLabel={anomalyFilter ? anomalyFilterLabels[anomalyFilter] : undefined}
      anomalyFilterCount={anomalyFilter ? filteredJobs.length : undefined}
      onClearAnomalyFilter={() => { setAnomalyFilter(null); setCurrentPage(1); }}
    />

    {/* === Sense Right Slider Panel === */}
    <div
      className="flex-shrink-0 flex flex-col"
      style={{
        width: senseOpen ? '420px' : '0px',
        minWidth: senseOpen ? '420px' : '0px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        borderLeft: senseOpen ? '1px solid #ECEEF1' : 'none',
      }}
    >
      {senseOpen && (
        <div className="flex flex-col h-full w-[420px]" style={{ background: '#FAFBFC' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ background: '#FFFFFF', borderBottom: '1px solid #ECEEF1' }}>
            <div className="flex items-center gap-2.5">
              <SenseLogo size={20} animated={senseProcessing} />
              <span className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
            </div>
            <button
              onClick={() => {
                setSenseOpen(false);
                setSenseResult(null);
                setSenseProcessing(false);
              }}
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
            >
              <X className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: '#FFFFFF' }}>
            {senseMessages.length === 0 && !senseProcessing && (
              <div className="flex flex-col h-full">
                {/* Top welcome section */}
                <div className="flex flex-col items-center pt-8 pb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5"
                    style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFF1E3)', border: '1px solid rgba(253, 80, 0, 0.10)' }}
                  >
                    <SenseLogo size={24} animated={false} />
                  </div>
                  <p className="text-[14px] text-[#1C1E21] mb-0.5" style={{ fontWeight: 600 }}>How can I help?</p>
                  <p className="text-[12px] text-[#9CA3AF]">
                    Ask about your jobs, data, or insights.
                  </p>
                </div>

                {/* Suggested prompts — premium card style */}
                <div className="flex flex-col w-full">
                  <p className="text-[11px] text-[#B0B8C4] uppercase tracking-wider mb-2 px-1" style={{ fontWeight: 500, letterSpacing: '0.04em' }}>Suggestions</p>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid #ECEEF1', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
                  >
                    {[
                      { icon: 'msg', text: 'Show me all jobs missing an invoice.' },
                      { icon: 'msg', text: 'Which jobs have no technician assigned?' },
                      { icon: 'doc', text: 'Show stalled jobs from this week.' },
                    ].map((suggestion, idx) => (
                      <button
                        key={suggestion.text}
                        onClick={() => {
                          setSenseMessages(prev => [...prev, { role: 'user', text: suggestion.text }]);
                          setSenseProcessing(true);
                          setSenseResult(null);
                          setSenseQuery('');
                          setTimeout(() => {
                            const { filterKey, label } = parseSenseQuery(suggestion.text);
                            setSenseProcessing(false);
                            if (filterKey) {
                              const matchCount = mockJobs.filter(j => j.anomalyTags?.includes(filterKey)).length;
                              setSenseMessages(prev => [...prev, {
                                role: 'ai', type: 'text',
                                text: `Got it — filtering to ${matchCount} job${matchCount !== 1 ? 's' : ''} with "${label}".`,
                              }]);
                              setSenseResult(`Applied filter: ${label}`);
                              setAnomalyFilter(filterKey);
                              setCurrentPage(1);
                              setSelectedJobs(new Set());
                              setSelectAll(false);
                              setTimeout(() => {
                                setPendingSaveViewName(label);
                                setSenseMessages(prev => [...prev, {
                                  role: 'ai', type: 'save-view-prompt', filterKey, filterLabel: label, matchCount,
                                }]);
                              }, 420);
                            } else {
                              setSenseMessages(prev => [...prev, {
                                role: 'ai', type: 'text',
                                text: 'I couldn\'t match a filter. Try asking about invoices, technicians, or stalled jobs.',
                              }]);
                            }
                          }, 800);
                        }}
                        className="group/sg flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all duration-150 hover:bg-[#F8F9FB]"
                        style={{
                          background: '#FFFFFF',
                          borderBottom: idx < 2 ? '1px solid #F0F1F3' : 'none',
                        }}
                      >
                        {suggestion.icon === 'doc' ? (
                          <FileText className="w-[15px] h-[15px] text-[#C8CCD4] flex-shrink-0 group-hover/sg:text-[#9CA3AF] transition-colors" />
                        ) : (
                          <MessageSquare className="w-[15px] h-[15px] text-[#C8CCD4] flex-shrink-0 group-hover/sg:text-[#9CA3AF] transition-colors" />
                        )}
                        <span className="flex-1 text-[13px] text-[#4B5563] group-hover/sg:text-[#1C1E21] transition-colors" style={{ fontWeight: 420 }}>
                          {suggestion.text}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D1D5DB] group-hover/sg:text-[#9CA3AF] flex-shrink-0 transition-colors opacity-60 group-hover/sg:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {senseMessages.length > 0 && (
              <div className="space-y-5">
                {senseMessages.map((msg, i) => (
                  <div key={i}>
                    {/* ── User message ── */}
                    {msg.role === 'user' && (
                      <div className="flex justify-end">
                        <div
                          className="max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] text-[#1C1E21] leading-relaxed"
                          style={{ background: '#F0F1F3', fontWeight: 400 }}
                        >
                          {'text' in msg ? msg.text : ''}
                        </div>
                      </div>
                    )}

                    {/* ── AI text message ── */}
                    {msg.role === 'ai' && msg.type !== 'save-view-prompt' && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <SenseLogo size={15} animated={false} />
                          <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
                        </div>
                        <p className="text-[13px] text-[#1C1E21] leading-relaxed" style={{ fontWeight: 400 }}>
                          {'text' in msg ? msg.text : ''}
                        </p>
                      </div>
                    )}

                    {/* ── Save-view prompt card ── */}
                    {msg.role === 'ai' && msg.type === 'save-view-prompt' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <SenseLogo size={15} animated={false} />
                          <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
                        </div>
                        {!msg.resolved ? (
                          <div
                            className="rounded-xl px-4 py-3.5"
                            style={{ background: '#F8F9FB', border: '1px solid #ECEEF1' }}
                          >
                            <p className="text-[12.5px] text-[#1C1E21] mb-3" style={{ fontWeight: 500 }}>
                              Save <span style={{ color: '#6B7280' }}>"{msg.filterLabel}"</span> as a view?
                            </p>
                            <input
                              type="text"
                              placeholder={msg.filterLabel}
                              value={pendingSaveViewName}
                              onChange={e => setPendingSaveViewName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveView(i, msg.filterKey, pendingSaveViewName);
                              }}
                              className="w-full rounded-lg px-3 py-2 text-[12.5px] text-[#1C1E21] placeholder-[#C4C8D0] outline-none mb-2.5"
                              style={{ background: '#FFFFFF', border: '1px solid #E2E4E8', fontWeight: 500 }}
                              autoFocus
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveView(i, msg.filterKey, pendingSaveViewName)}
                                className="flex-1 py-2 rounded-lg text-[12px] text-white transition-all hover:opacity-80"
                                style={{ fontWeight: 600, background: 'linear-gradient(180deg, #2D3036 0%, #1C1E21 100%)' }}
                              >
                                Save View
                              </button>
                              <button
                                onClick={() => handleDismissSaveView(i)}
                                className="flex-1 py-2 rounded-lg text-[12px] text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
                                style={{ fontWeight: 500 }}
                              >
                                Not now
                              </button>
                            </div>
                          </div>
                        ) : msg.dismissed ? (
                          <p className="text-[13px] text-[#9CA3AF]" style={{ fontWeight: 400 }}>
                            Sure — you can save it anytime from the filter bar.
                          </p>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#10B981' }}>
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                            <p className="text-[13px] text-[#6B7280]" style={{ fontWeight: 400 }}>
                              View <span className="text-[#1C1E21]" style={{ fontWeight: 500 }}>"{msg.savedViewName}"</span> saved to filter bar.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {senseProcessing && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <SenseLogo size={15} animated={true} />
                      <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
                    </div>
                    <div className="flex gap-1.5 pl-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C4C8D0]" style={{ animation: 'sensePulse 1.2s ease-in-out infinite' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C4C8D0]" style={{ animation: 'sensePulse 1.2s ease-in-out 0.2s infinite' }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C4C8D0]" style={{ animation: 'sensePulse 1.2s ease-in-out 0.4s infinite' }} />
                    </div>
                  </div>
                )}
                <div ref={senseChatEndRef} />
              </div>
            )}
          </div>

          {/* Bottom input */}
          <div className="flex-shrink-0 px-4 py-3" style={{ background: '#FFFFFF', borderTop: '1px solid #ECEEF1' }}>
            <div
              className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
              style={{
                background: '#FFFFFF',
                border: senseInputFocused ? '1px solid rgba(253, 80, 0, 0.30)' : '1px solid #E2E4E8',
                boxShadow: senseInputFocused
                  ? '0 0 0 3px rgba(253, 80, 0, 0.06), 0 1px 3px rgba(0,0,0,0.04)'
                  : '0 1px 3px rgba(0,0,0,0.03)',
                transition: 'border 0.2s, box-shadow 0.2s',
              }}
            >
              <input
                ref={senseInputRef}
                type="text"
                placeholder="Ask about your jobs..."
                value={senseQuery}
                onChange={e => setSenseQuery(e.target.value)}
                onFocus={() => setSenseInputFocused(true)}
                onBlur={() => setSenseInputFocused(false)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !senseProcessing) handleSenseSubmit();
                }}
                disabled={senseProcessing}
                className="flex-1 text-[13px] text-[#1C1E21] placeholder-[#B0B8C4] bg-transparent outline-none"
                style={{ fontWeight: 400 }}
              />
              <button
                className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors relative"
                title={senseListening ? 'Stop listening' : 'Voice input'}
                onClick={toggleVoiceInput}
              >
                {senseListening ? (
                  <MicOff className="w-4 h-4 text-[#FD5000]" />
                ) : (
                  <Mic className="w-4 h-4 text-[#C4C8D0]" />
                )}
              </button>
              <button
                onClick={handleSenseSubmit}
                disabled={senseProcessing || !senseQuery.trim()}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: senseQuery.trim() ? 'linear-gradient(135deg, #FD5000, #E04500)' : '#ECEEF1',
                }}
              >
                <ArrowUp className={`w-3.5 h-3.5 ${senseQuery.trim() ? 'text-white' : 'text-[#B0B8C4]'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-[10px] text-[#C4C8D0]">Text or voice</span>
              <span className="text-[10px] text-[#C4C8D0] flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded text-[9px] text-[#9CA3AF]" style={{ fontWeight: 600, backgroundColor: '#ECEEF1' }}>Esc</kbd>
                close
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

// Sense Anomaly Card component — subtle AI gradient feel
function SenseAnomalyCard({ icon, iconBg, title, subtitle, onClick, active }: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick: () => void;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const getBackground = () => {
    if (active) return 'linear-gradient(135deg, #FFFAF5 0%, #FFF7ED 50%, #FFF5F0 100%)';
    if (hovered) return 'linear-gradient(135deg, #FFFFFF 0%, #FFFCFA 40%, #FFF9F5 100%)';
    return 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 50%, #FDFCFB 100%)';
  };

  const getBorder = () => {
    if (active) return '1px solid rgba(253, 80, 0, 0.25)';
    if (hovered) return '1px solid rgba(253, 80, 0, 0.12)';
    return '1px solid #E6E8EC';
  };

  const getShadow = () => {
    if (active) return '0 0 0 1px rgba(253,80,0,0.05), 0 2px 8px rgba(253,80,0,0.06)';
    if (hovered) return '0 2px 12px rgba(253,80,0,0.05), 0 1px 3px rgba(0,0,0,0.04)';
    return '0 1px 2px rgba(0,0,0,0.03)';
  };

  return (
    <button
      className="relative flex items-center gap-3 flex-1 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 text-left overflow-hidden"
      style={{
        background: getBackground(),
        border: getBorder(),
        boxShadow: getShadow(),
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Subtle AI shimmer accent — top edge */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '1px',
          background: active
            ? 'linear-gradient(90deg, transparent 0%, rgba(253,80,0,0.25) 25%, rgba(253,140,0,0.18) 50%, rgba(253,80,0,0.25) 75%, transparent 100%)'
            : hovered
            ? 'linear-gradient(90deg, transparent 0%, rgba(253,80,0,0.10) 30%, rgba(253,140,0,0.08) 70%, transparent 100%)'
            : 'transparent',
          transition: 'background 0.3s ease',
        }}
      />
      {/* Spark micro-label */}
      <div className="absolute top-1.5 right-2 flex items-center gap-0.5 pointer-events-none" style={{ opacity: active ? 0.7 : hovered ? 0.45 : 0.25, transition: 'opacity 0.2s ease' }}>
        <Sparkles className="w-2.5 h-2.5" style={{ color: active ? '#FD5000' : '#B0ADB8' }} />
      </div>
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-lg"
        style={{
          width: '36px',
          height: '36px',
          backgroundColor: iconBg,
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[#1C1E21] truncate" style={{ fontWeight: 600 }}>
          {title}
        </div>
        <div
          className="text-[12px] truncate transition-colors duration-150"
          style={{
            color: hovered ? '#FD5000' : '#6B7280',
            fontWeight: hovered ? 500 : 400,
          }}
        >
          {hovered ? 'View Jobs →' : subtitle}
        </div>
      </div>
      {active && (
        <X className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#6B7280] flex-shrink-0 transition-colors" />
      )}
    </button>
  );
}