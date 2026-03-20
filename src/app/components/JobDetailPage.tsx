import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Star, MoreHorizontal, Plus, Settings, ChevronDown, ChevronUp, ChevronRight,
  MapPin, Calendar, User, Tag, Clock, ExternalLink, ThumbsUp, ThumbsDown,
  MessageSquare, Share2, Sparkles, CheckCircle2, AlertTriangle, Circle,
  Building2, FileText, Phone, Mail, Mic, MicOff, ArrowUp, X
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SenseLogo } from './SenseLogo';

interface JobDetailPageProps {
  jobId: string;
  workOrderNumber: string;
  jobTitle: string;
  onBack: () => void;
}

// Mock detail data based on the reference image
function getJobDetail(workOrderNumber: string) {
  // Derive a stable number from the work order
  const num = parseInt(workOrderNumber.replace(/\D/g, ''), 10) || 245678;
  return {
    jobNumber: `#JN-${num}`,
    title: workOrderNumber === 'pre103598' ? 'Roof Replacement - Telnet' : `Roofing Job - ${workOrderNumber}`,
    status: 'On Going',
    address: '2847 Sunset Boulevard, Los Angeles, CA 90026',
    assignedTo: 'John Davis',
    customer: 'Craig Calzoni',
    schedule: '20- 24 Dec 2024 6:00 PM',
    createdBy: 'Tom Riddle',
    category: 'Installation',
    assignees: [
      { name: 'Sarah J', color: '#6366F1' },
      { name: 'Mike R', color: '#3B82F6' },
      { name: 'Lisa K', color: '#EC4899' },
    ],
    tags: ['Tag #1', 'Tag #2', 'Tag #3'],
    dueDate: '23 Oct 2025',
    jobValue: 10000,
    jobProfit: 1000,
    aiSummary: 'Residential roof replacement project for a 2,450 sq ft asphalt shingle roof with 6/12 slope. The job involves removing 2 layers of old shingles and installing new charcoal gray shingles with a 25-year warranty.',
    aiSummaryHighlights: 'Key highlights: Ice & water shield on valleys and eaves, synthetic underlayment, ridge vents for ventilation. Building permit approved (#BP-2024-1234).',
    aiSummaryDate: 'Dec 31, 2025',
    completionPct: 35,
    materialStatus: 'Ordered',
    permitStatus: 'Approved',
    permitNumber: '#BP-2024-1234',
    daysUntilDue: 12,
    roofArea: '2,450 sq ft',
    roofType: 'Asphalt Shingle',
    warrantyYears: 25,
    lastActivityDate: 'Mar 15, 2025',
    lastActivity: 'Contract signed and deposit received.',
    jobDescription: 'Build, manage and optimize with new ISP infrastructure. Ensure seamless connectivity for the client, troubleshoot network issues, and collaborate with cross-functional teams to enhance service delivery.',
    serviceAddress: {
      line1: '45 Maple Avenue, London, UK,',
      line2: 'England - SW1A 1AA',
      territory: 'San Jose Territory',
    },
    billingAddress: {
      line1: '123 Maple Avenue, Sunnyvale,',
      line2: 'CA, USA,',
      line3: 'California - 94086',
    },
    statusHistory: [
      { status: 'Sold', person: 'Andy Sam', date: 'Mar 15', description: 'Contract signed and deposit received.', detail: 'Customer has approved the final quote for', duration: '10 mins', color: '#10B981' },
      { status: 'Estimating', person: 'Andy Sam', date: 'Mar 13', description: 'Completed roof inspection and measurements.', detail: 'Preparing detailed quote with material costs.', duration: '', color: '#F59E0B' },
      { status: 'Lead', person: 'Andy Sam', date: 'Mar 12', description: '', detail: '', duration: '', color: '#3B82F6' },
    ],
    property: {
      name: 'Maven Roofing Property',
      jobs: 3,
      location: 'Los Angeles County, California, USA',
      associatedJobs: 3,
    },
    invoices: [
      {
        number: '#INV-2024-1234',
        customer: 'Sarah Johnson',
        organisation: 'Maven Roofing',
        dueOn: '15th Jan 2025',
        amount: '$8,450.00',
      },
    ],
    organization: {
      name: 'Maven Roofing Inc.',
      type: 'Roofing & Construction',
      location: 'Los Angeles, California, USA',
      contacts: 12,
    },
  };
}

const tabs = ['Overview', 'Notes', 'Tasks', 'Activity History', 'Files', 'Gallery', 'Zuper Connect'];

export function JobDetailPage({ jobId, workOrderNumber, jobTitle, onBack }: JobDetailPageProps) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [aboutExpanded, setAboutExpanded] = useState(true);
  const [statusHistoryExpanded, setStatusHistoryExpanded] = useState(true);
  const [propertyExpanded, setPropertyExpanded] = useState(true);
  const [invoicesExpanded, setInvoicesExpanded] = useState(true);
  const [organizationExpanded, setOrganizationExpanded] = useState(true);
  const [starred, setStarred] = useState(false);
  const [rightPanel, setRightPanel] = useState<'details' | 'comments' | 'sense' | null>('details');
  const [senseQuery, setSenseQuery] = useState('');
  const [senseProcessing, setSenseProcessing] = useState(false);
  const [senseResult, setSenseResult] = useState<string | null>(null);
  const [senseListening, setSenseListening] = useState(false);
  const senseInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const [senseDropdownOpen, setSenseDropdownOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryTab, setSummaryTab] = useState<'summary' | 'next-steps' | 'risks'>('summary');
  const [sensePanelTab, setSensePanelTab] = useState<'chat' | 'summary'>('chat');
  const [senseInputFocused, setSenseInputFocused] = useState(false);
  const [senseMessages, setSenseMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [summaryAccordion, setSummaryAccordion] = useState<{ summary: boolean; nextSteps: boolean; risks: boolean }>({ summary: true, nextSteps: false, risks: false });
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const senseDropdownRef = useRef<HTMLDivElement>(null);

  const detail = getJobDetail(workOrderNumber);

  // Auto-focus sense input when panel opens
  useEffect(() => {
    if (rightPanel === 'sense' && sensePanelTab === 'chat' && senseInputRef.current) {
      setTimeout(() => senseInputRef.current?.focus(), 100);
    }
  }, [rightPanel, sensePanelTab]);

  // Cleanup speech recognition on unmount or panel close
  useEffect(() => {
    if (rightPanel !== 'sense' && recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      setSenseListening(false);
    }
  }, [rightPanel]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Hotkey: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (rightPanel === 'sense') {
          setRightPanel(null);
        } else {
          setRightPanel('sense');
          setSensePanelTab('chat');
        }
      }
      if (e.key === 'Escape') {
        if (rightPanel === 'sense') { setRightPanel(null); }
        if (summaryOpen) { setSummaryOpen(false); }
        if (senseDropdownOpen) { setSenseDropdownOpen(false); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [rightPanel, summaryOpen, senseDropdownOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!senseDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (senseDropdownRef.current && !senseDropdownRef.current.contains(e.target as Node)) {
        setSenseDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [senseDropdownOpen]);

  const handleSenseSubmit = () => {
    if (!senseQuery.trim()) return;
    const userMsg = senseQuery.trim();
    setSenseMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setSenseQuery('');
    setSenseProcessing(true);
    setSenseResult(null);
    setTimeout(() => {
      setSenseProcessing(false);
      const q = userMsg.toLowerCase();
      let aiResponse = '';
      if (q.includes('profit')) {
        aiResponse = 'The profit margin on this job is 10% ($1,000 on $10,000 job value).';
      } else if (q.includes('schedule') || q.includes('conflict')) {
        aiResponse = 'No scheduling conflicts detected. Crew is available for the scheduled dates.';
      } else if (q.includes('summar') || q.includes('activity')) {
        aiResponse = 'Recent activity: Roof inspection completed, materials ordered, crew scheduling in progress.';
      } else {
        aiResponse = 'Based on the current data, this job is on track. The team is progressing as planned.';
      }
      setSenseResult(aiResponse);
      setSenseMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 800);
  };

  const toggleVoiceInput = () => {
    if (senseListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setSenseListening(false);
      return;
    }
    // Simulated voice
    setSenseListening(true);
    const demoQueries = ['what is the profit margin', 'any scheduling conflicts', 'summarize recent activity'];
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
          setTimeout(() => handleSenseSubmit(), 300);
        }, 600);
      }
    }, 220);
    recognitionRef.current = {
      abort: () => { clearInterval(wordInterval); setSenseListening(false); },
      stop: () => { clearInterval(wordInterval); setSenseListening(false); },
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
      {/* Top breadcrumb bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-[#E6E8EC]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#1C1E21] transition-colors px-2 py-1 rounded-md hover:bg-[#F3F4F6]"
            style={{ fontWeight: 500 }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Jobs
          </button>
          <span className="text-[#D1D5DB] text-[13px]">/</span>
          <span className="text-[13px] text-[#1C1E21] px-1" style={{ fontWeight: 600 }}>{detail.jobNumber}</span>
          <button onClick={() => setStarred(!starred)} className="p-1.5 hover:bg-[#F3F4F6] rounded-md transition-colors">
            <Star className={`w-3.5 h-3.5 ${starred ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#C4C8D0]'}`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRightPanel('sense'); setSensePanelTab('chat'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #FFF7ED 0%, #FFF3E6 100%)',
              border: '1px solid rgba(253,80,0,0.18)',
              boxShadow: '0 1px 3px rgba(253,80,0,0.06)',
            }}
            title="Ask Sense"
          >
            <SenseLogo size={13} animated={false} />
            <span className="text-[12px] text-[#D2600A]" style={{ fontWeight: 600 }}>Ask Sense</span>
          </button>
          <div className="h-4 w-px bg-[#E6E8EC]" />
          <div className="flex items-center gap-0.5 text-[12px] text-[#9CA3AF]">
            <span>1 / 30</span>
            <button className="p-1 hover:bg-[#F3F4F6] rounded transition-colors">
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:bg-[#F3F4F6] rounded transition-colors">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <button className="p-1.5 hover:bg-[#F3F4F6] rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
          </button>
        </div>
      </div>

      {/* Header with title and status */}
      <div className="px-6 pt-5 pb-5 bg-white border-b border-[#E6E8EC]">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC]" style={{ fontWeight: 600 }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                {detail.status}
              </span>
              <span className="text-[12px] text-[#9CA3AF]" style={{ fontWeight: 500 }}>{detail.jobNumber}</span>
            </div>
            <h1 className="text-[#1C1E21] leading-tight truncate" style={{ fontSize: '22px', fontWeight: 700 }}>{detail.title}</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] text-white transition-all hover:opacity-90"
              style={{ fontWeight: 600, background: '#1C1E21', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
            >
              Update Status
            </button>
            <button className="p-2 rounded-lg border border-[#E6E8EC] hover:bg-[#F3F4F6] transition-colors">
              <Plus className="w-4 h-4 text-[#6B7280]" />
            </button>
            <button className="p-2 rounded-lg border border-[#E6E8EC] hover:bg-[#F3F4F6] transition-colors">
              <Settings className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-[12px] text-[#6B7280] bg-[#F8F9FB] border border-[#E6E8EC] px-3 py-1.5 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
            <span className="truncate max-w-[260px]">{detail.address}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#6B7280] bg-[#F8F9FB] border border-[#E6E8EC] px-3 py-1.5 rounded-lg">
            <div className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-[8px] flex-shrink-0" style={{ fontWeight: 700 }}>JD</div>
            {detail.assignedTo}
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#6B7280] bg-[#F8F9FB] border border-[#E6E8EC] px-3 py-1.5 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
            Due {detail.dueDate}
          </span>
        </div>
      </div>

      {/* Three-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-[280px] flex-shrink-0 border-r border-[#E6E8EC] bg-white overflow-y-auto">
          {/* About this job */}
          <div className="px-5 pt-6 pb-5">
            <button
              onClick={() => setAboutExpanded(!aboutExpanded)}
              className="flex items-center justify-between w-full mb-4 group"
            >
              <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>About this job</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#C4C8D0] transition-transform ${aboutExpanded ? '' : '-rotate-90'}`} />
            </button>

            {aboutExpanded && (
              <>
                {/* Job photo */}
                <div className="w-full h-[148px] rounded-xl overflow-hidden mb-5 bg-[#F3F4F6]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1758899183445-1c20011cbab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb29maW5nJTIwY29uc3RydWN0aW9uJTIwaG91c2V8ZW58MXx8fHwxNzczMjg1OTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Job site"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info rows */}
                <div className="space-y-4">
                  <InfoRow icon={<User className="w-3.5 h-3.5 text-[#B0B8C4]" />} label="Customer" value={detail.customer} />
                  <InfoRow icon={<Calendar className="w-3.5 h-3.5 text-[#B0B8C4]" />} label="Schedule" value={detail.schedule} />
                  <InfoRow icon={<User className="w-3.5 h-3.5 text-[#B0B8C4]" />} label="Created by" value={detail.createdBy} />
                  <div className="flex items-start gap-3">
                    <Tag className="w-3.5 h-3.5 text-[#B0B8C4] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[#9CA3AF] block mb-1.5" style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Category</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] bg-[#F3F4F6] text-[#1C1E21] border border-[#E6E8EC]" style={{ fontWeight: 500 }}>{detail.category}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-3.5 h-3.5 text-[#B0B8C4] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[#9CA3AF] block mb-1.5" style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Assignees</span>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {detail.assignees.map((a, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] border-2 border-white"
                              style={{ backgroundColor: a.color, fontWeight: 700 }}
                            >
                              {a.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          ))}
                        </div>
                        <span className="text-[11px] text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>+2</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-3.5 h-3.5 text-[#B0B8C4] mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-[#9CA3AF] block mb-1.5" style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {detail.tags.map(tag => (
                          <span key={tag} className="px-2.5 py-0.5 rounded-md text-[11px] bg-[#F3F4F6] text-[#6B7280] border border-[#E6E8EC]" style={{ fontWeight: 500 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-[#E6E8EC] mx-5" />

          {/* Status History */}
          <div className="px-5 pt-5 pb-6">
            <button
              onClick={() => setStatusHistoryExpanded(!statusHistoryExpanded)}
              className="flex items-center justify-between w-full mb-4"
            >
              <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Status History</span>
              <ChevronDown className={`w-3.5 h-3.5 text-[#C4C8D0] transition-transform ${statusHistoryExpanded ? '' : '-rotate-90'}`} />
            </button>

            {statusHistoryExpanded && (
              <>
                {/* Status selector */}
                <div className="mb-5">
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#E6E8EC] bg-[#FAFBFC] cursor-pointer hover:border-[#D1D5DB] transition-colors">
                    <span className="text-[12px] text-[#9CA3AF]">Select status</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#C4C8D0]" />
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative pl-4">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-[#E6E8EC] rounded-full" />

                  <div className="space-y-5">
                    {detail.statusHistory.map((item, index) => (
                      <div key={index} className="relative pl-5">
                        {/* Dot */}
                        <div
                          className="absolute left-[-9px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: item.color, boxShadow: `0 0 0 1px ${item.color}22` }}
                        />

                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-[11px] px-2 py-0.5 rounded-md"
                            style={{
                              fontWeight: 600,
                              backgroundColor: item.color === '#10B981' ? '#F0FDF4' : item.color === '#F59E0B' ? '#FFFBEB' : '#EFF6FF',
                              color: item.color === '#10B981' ? '#16A34A' : item.color === '#F59E0B' ? '#D97706' : '#2563EB',
                            }}
                          >
                            {item.status}
                          </span>
                          <span className="text-[11px] text-[#C4C8D0]">{item.date}</span>
                        </div>

                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="w-4 h-4 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                            <User className="w-2.5 h-2.5 text-[#9CA3AF]" />
                          </div>
                          <span className="text-[11px] text-[#6B7280]">{item.person}</span>
                        </div>

                        {item.description && (
                          <p className="text-[12px] text-[#6B7280] leading-relaxed">{item.description}</p>
                        )}
                        {item.detail && (
                          <p className="text-[12px] text-[#9CA3AF] leading-relaxed">{item.detail}</p>
                        )}
                        {item.duration && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock className="w-3 h-3 text-[#C4C8D0]" />
                            <span className="text-[11px] text-[#9CA3AF]">{item.duration}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-[820px] mx-auto py-7 px-6">
            {/* Tabs */}
            <div className="flex items-center gap-0 border-b border-[#E6E8EC] mb-7 bg-white rounded-t-xl px-2" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-3 text-[13px] transition-colors relative whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-[#1C1E21]'
                      : 'text-[#9CA3AF] hover:text-[#6B7280]'
                  }`}
                  style={{ fontWeight: activeTab === tab ? 600 : 400 }}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#1C1E21] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatCard
                icon={<Calendar className="w-4 h-4 text-[#EF4444]" />}
                iconBg="#FEE2E2"
                label="Job Due Date"
                value={detail.dueDate}
              />
              <StatCard
                icon={<span className="text-[14px]" style={{ fontWeight: 700, color: '#16A34A' }}>$</span>}
                iconBg="#F0FDF4"
                label="Job Value"
                value={`$${detail.jobValue.toLocaleString()}`}
              />
              <StatCard
                icon={<span className="text-[12px]" style={{ fontWeight: 700, color: '#16A34A' }}>↗</span>}
                iconBg="#F0FDF4"
                label="Job Profit"
                value={`$${detail.jobProfit.toLocaleString()}`}
                valueColor="#16A34A"
              />
            </div>

            {/* AI Job Summary */}
            <div className="bg-white rounded-xl border border-[#E6E8EC] overflow-hidden mb-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFF1E3)', border: '1px solid rgba(253,80,0,0.12)' }}>
                    <SenseLogo size={15} animated={false} />
                  </div>
                  <span className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 700 }}>Sense AI Overview</span>
                </div>
                <span className="text-[11px] text-[#C4C8D0]">Updated {detail.aiSummaryDate}</span>
              </div>
              <div className="p-6">
                <button
                  onClick={() => { setRightPanel('sense'); setSensePanelTab('summary'); setSummaryAccordion({ summary: true, nextSteps: false, risks: false }); }}
                  className="w-full text-left rounded-xl p-5 mb-4 transition-all group cursor-pointer hover:shadow-md"
                  style={{ background: 'linear-gradient(135deg, #FFFCF7, #FFF8F0)', border: '1px solid rgba(253, 150, 40, 0.18)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: '#FFF4ED' }}>
                      <FileText className="w-3.5 h-3.5 text-[#FD5000]" />
                    </div>
                    <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Summary</span>
                    <span className="text-[11px] text-[#C4C8D0] ml-auto">Generated {detail.aiSummaryDate}</span>
                  </div>
                  <p className="text-[13px] text-[#374151] leading-relaxed mb-2">{detail.aiSummary}</p>
                  <p className="text-[12px] text-[#9CA3AF] leading-relaxed">{detail.aiSummaryHighlights}</p>
                  <span className="inline-flex items-center gap-1 mt-3 text-[12px] text-[#FD5000] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 500 }}>
                    View full summary <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
                <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#C4C8D0]" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                      <ThumbsDown className="w-3.5 h-3.5 text-[#C4C8D0]" />
                    </button>
                  </div>
                  <button
                    onClick={() => { setRightPanel('sense'); setSensePanelTab('chat'); }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] transition-all hover:shadow-sm"
                    style={{ fontWeight: 600, color: '#FD5000', background: '#FFF4ED', border: '1px solid rgba(253, 80, 0, 0.20)' }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Open Sense
                  </button>
                </div>
              </div>
            </div>

            {/* Job description */}
            <div className="bg-white rounded-xl border border-[#E6E8EC] overflow-hidden mb-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="px-6 py-4 border-b border-[#F3F4F6]">
                <h3 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 700 }}>Job Description</h3>
              </div>
              <div className="px-6 py-5">
                <p className="text-[13px] text-[#6B7280] leading-relaxed">{detail.jobDescription}</p>
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-white rounded-xl border border-[#E6E8EC] overflow-hidden mb-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="px-6 py-4 border-b border-[#F3F4F6]">
                <h3 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 700 }}>Addresses</h3>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-[#E6E8EC] p-4 bg-[#FAFBFC]">
                    <span className="text-[11px] text-[#9CA3AF] block mb-2.5" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Service Address</span>
                    <p className="text-[13px] text-[#1C1E21] leading-relaxed">{detail.serviceAddress.line1}</p>
                    <p className="text-[13px] text-[#1C1E21] leading-relaxed mb-3">{detail.serviceAddress.line2}</p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] bg-[#FEE2E2] text-[#DC2626]" style={{ fontWeight: 600 }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                      {detail.serviceAddress.territory}
                    </span>
                  </div>
                  <div className="rounded-xl border border-[#E6E8EC] p-4 bg-[#FAFBFC]">
                    <span className="text-[11px] text-[#9CA3AF] block mb-2.5" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Billing Address</span>
                    <p className="text-[13px] text-[#1C1E21] leading-relaxed">{detail.billingAddress.line1}</p>
                    <p className="text-[13px] text-[#1C1E21] leading-relaxed">{detail.billingAddress.line2}</p>
                    <p className="text-[13px] text-[#1C1E21] leading-relaxed mb-3">{detail.billingAddress.line3}</p>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E8EC] text-[12px] text-[#6B7280] hover:bg-white transition-colors" style={{ fontWeight: 500 }}>
                      <ExternalLink className="w-3 h-3" />
                      Show in maps
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Tasks */}
            <div className="bg-white rounded-xl border border-[#E6E8EC] overflow-hidden mb-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#B0B8C4]" />
                  <h3 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 700 }}>Open Tasks</h3>
                </div>
                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] text-white transition-all hover:opacity-90" style={{ fontWeight: 600, background: '#1C1E21', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
                  <Plus className="w-3.5 h-3.5" />
                  Add Task
                </button>
              </div>
              <div className="px-6 py-4 space-y-1.5">
                <TaskRow title="Inspect roof damage on east side" assignee="Sarah J" dueDate="Mar 20" priority="High" />
                <TaskRow title="Order materials from supplier" assignee="Mike R" dueDate="Mar 22" priority="Medium" />
                <TaskRow title="Schedule crew for installation" assignee="Tom R" dueDate="Mar 24" priority="Low" />
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar + icon rail */}
        <div className="flex flex-shrink-0 h-full">
          {/* Expandable content panel */}
          {rightPanel && (
            <div className={`w-[420px] flex-shrink-0 border-l border-[#E6E8EC] bg-white ${rightPanel === 'sense' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`} style={{ boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.04)' }}>
              {rightPanel === 'details' && (
                <>
                  {/* Property */}
                  <div className="px-6 pt-6 pb-5 border-b border-[#F3F4F6]">
                    <button
                      onClick={() => setPropertyExpanded(!propertyExpanded)}
                      className="flex items-center justify-between w-full mb-5 group"
                    >
                      <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Property</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#C4C8D0] transition-transform ${propertyExpanded ? '' : '-rotate-90'}`} />
                    </button>

                    {propertyExpanded && (
                      <>
                        <div className="rounded-xl border border-[#E6E8EC] overflow-hidden mb-3 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div className="flex items-start gap-3.5 p-4">
                            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-[#9CA3AF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="text-[13px] text-[#1C1E21] leading-tight" style={{ fontWeight: 600 }}>{detail.property.name}</span>
                                <button className="p-1 hover:bg-[#F3F4F6] rounded-md transition-colors flex-shrink-0 mt-0.5">
                                  <ExternalLink className="w-3 h-3 text-[#C4C8D0]" />
                                </button>
                              </div>
                              <span className="inline-flex items-center gap-1 text-[11px] text-[#9CA3AF]" style={{ fontWeight: 500 }}>
                                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                {detail.property.jobs} Jobs
                              </span>
                              <p className="text-[12px] text-[#9CA3AF] mt-1">{detail.property.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F3F4F6] bg-[#FAFBFC]">
                            <span className="text-[12px] text-[#9CA3AF]">Associated jobs</span>
                            <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 700 }}>{detail.property.associatedJobs}</span>
                          </div>
                        </div>
                        <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#F8F9FB] transition-colors text-[12px] text-[#9CA3AF] hover:text-[#6B7280]" style={{ fontWeight: 500 }}>
                          View all associated Property
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Invoices */}
                  <div className="px-6 pt-5 pb-5 border-b border-[#F3F4F6]">
                    <button
                      onClick={() => setInvoicesExpanded(!invoicesExpanded)}
                      className="flex items-center justify-between w-full mb-5 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Invoices</span>
                        <span className="text-[10px] bg-[#F3F4F6] text-[#6B7280] px-1.5 py-0.5 rounded-md" style={{ fontWeight: 600 }}>{detail.invoices.length}</span>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#C4C8D0] transition-transform ${invoicesExpanded ? '' : '-rotate-90'}`} />
                    </button>

                    {invoicesExpanded && (
                      <>
                        {detail.invoices.map((inv, i) => (
                          <div key={i} className="rounded-xl border border-[#E6E8EC] overflow-hidden mb-3 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F3F4F6]">
                              <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{inv.number}</span>
                              <button className="p-1 hover:bg-[#F3F4F6] rounded-md transition-colors">
                                <ExternalLink className="w-3 h-3 text-[#C4C8D0]" />
                              </button>
                            </div>
                            <div className="px-4 py-3 space-y-2.5">
                              <InvoiceRow label="Customer" value={inv.customer} />
                              <InvoiceRow label="Organisation" value={inv.organisation} />
                              <InvoiceRow label="Due on" value={inv.dueOn} />
                              <InvoiceRow label="Amount" value={inv.amount} bold />
                            </div>
                          </div>
                        ))}
                        <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#F8F9FB] transition-colors text-[12px] text-[#9CA3AF] hover:text-[#6B7280]" style={{ fontWeight: 500 }}>
                          View all associated Invoices
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Organization */}
                  <div className="px-6 pt-5 pb-6">
                    <button
                      onClick={() => setOrganizationExpanded(!organizationExpanded)}
                      className="flex items-center justify-between w-full mb-5 group"
                    >
                      <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Organization</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#C4C8D0] transition-transform ${organizationExpanded ? '' : '-rotate-90'}`} />
                    </button>

                    {organizationExpanded && (
                      <>
                        <div className="rounded-xl border border-[#E6E8EC] overflow-hidden mb-3 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div className="flex items-start gap-3.5 p-4">
                            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-[#9CA3AF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <span className="text-[13px] text-[#1C1E21] leading-tight" style={{ fontWeight: 600 }}>{detail.organization.name}</span>
                                <button className="p-1 hover:bg-[#F3F4F6] rounded-md transition-colors flex-shrink-0 mt-0.5">
                                  <ExternalLink className="w-3 h-3 text-[#C4C8D0]" />
                                </button>
                              </div>
                              <span className="text-[11px] text-[#9CA3AF]" style={{ fontWeight: 500 }}>{detail.organization.type}</span>
                              <p className="text-[12px] text-[#9CA3AF] mt-1">{detail.organization.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#F3F4F6] bg-[#FAFBFC]">
                            <span className="text-[12px] text-[#9CA3AF]">Associated contacts</span>
                            <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 700 }}>{detail.organization.contacts}</span>
                          </div>
                        </div>
                        <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#F8F9FB] transition-colors text-[12px] text-[#9CA3AF] hover:text-[#6B7280]" style={{ fontWeight: 500 }}>
                          View all Organizations
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}

              {rightPanel === 'comments' && (
                <div className="p-5">
                  <h3 className="text-[14px] text-[#1C1E21] mb-4" style={{ fontWeight: 600 }}>Comments</h3>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-[#E6E8EC] p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-[9px]" style={{ fontWeight: 600 }}>SJ</div>
                        <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 500 }}>Sarah J</span>
                        <span className="text-[11px] text-[#9CA3AF]">2h ago</span>
                      </div>
                      <p className="text-[12px] text-[#6B7280] leading-relaxed">Roof inspection complete. Found some damage on the east side that needs attention before we proceed.</p>
                    </div>
                    <div className="rounded-lg border border-[#E6E8EC] p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-[9px]" style={{ fontWeight: 600 }}>MR</div>
                        <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 500 }}>Mike R</span>
                        <span className="text-[11px] text-[#9CA3AF]">5h ago</span>
                      </div>
                      <p className="text-[12px] text-[#6B7280] leading-relaxed">Materials ordered. Expected delivery by Thursday.</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#E6E8EC]">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-[#E6E8EC] bg-white">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 text-[12px] text-[#1C1E21] placeholder-[#B0B8C4] bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {rightPanel === 'sense' && (
                <div className="flex flex-col h-full w-full" style={{ background: '#FAFBFC' }}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E8EC' }}>
                    <div className="flex items-center gap-2.5">
                      <SenseLogo size={20} animated={senseProcessing} />
                      <span className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
                    </div>
                    <button
                      onClick={() => setRightPanel(null)}
                      className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    >
                      <X className="w-4 h-4 text-[#9CA3AF]" />
                    </button>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex items-center bg-white px-3 flex-shrink-0" style={{ borderBottom: '1px solid #E6E8EC' }}>
                    {([
                      { key: 'chat' as const, label: 'Chat' },
                      { key: 'summary' as const, label: 'Summary' },
                    ]).map(tab => (
                      <button
                        key={tab.key}
                        onClick={() => setSensePanelTab(tab.key)}
                        className="px-4 py-2.5 text-[13px] transition-all relative"
                        style={{
                          fontWeight: sensePanelTab === tab.key ? 600 : 450,
                          color: sensePanelTab === tab.key ? '#1C1E21' : '#9CA3AF',
                        }}
                      >
                        {tab.label}
                        {sensePanelTab === tab.key && (
                          <div className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full" style={{ background: '#FD5000' }} />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* === Chat Tab === */}
                  {sensePanelTab === 'chat' && (
                    <>
                      {/* Chat area */}
                      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: '#FFFFFF' }}>
                        {senseMessages.length === 0 && !senseProcessing && (
                          <div className="flex flex-col h-full justify-center px-1">
                            {/* Welcome section */}
                            <div className="flex flex-col items-center pb-5">
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5"
                                style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFF1E3)', border: '1px solid rgba(253, 80, 0, 0.10)' }}
                              >
                                <SenseLogo size={24} animated={false} />
                              </div>
                              <p className="text-[14px] text-[#1C1E21] mb-0.5" style={{ fontWeight: 600 }}>How can I help?</p>
                              <p className="text-[12px] text-[#9CA3AF]">
                                Ask anything about this job.
                              </p>
                            </div>

                            {/* Suggested prompts */}
                            <div className="flex flex-col w-full pb-5">
                              <div className="space-y-0.5">
                                {[
                                  `What's the profit margin?`,
                                  `Is ${detail.assignedTo}'s crew on track?`,
                                  `What materials are needed?`,
                                ].map((text) => (
                                  <button
                                    key={text}
                                    onClick={() => {
                                      setSenseMessages(prev => [...prev, { role: 'user', text }]);
                                      setSenseProcessing(true);
                                      setSenseResult(null);
                                      setSenseQuery('');
                                      setTimeout(() => {
                                        const q = text.toLowerCase();
                                        let aiResponse = '';
                                        if (q.includes('profit')) {
                                          aiResponse = `The profit margin on this job is ${Math.round((detail.jobProfit / detail.jobValue) * 100)}% ($${detail.jobProfit.toLocaleString()} on $${detail.jobValue.toLocaleString()} job value).`;
                                        } else if (q.includes('track') || q.includes('crew')) {
                                          aiResponse = `${detail.assignedTo}'s crew is currently on track. No scheduling conflicts detected for the ${detail.dueDate} deadline.`;
                                        } else {
                                          aiResponse = `For the ${detail.category.toLowerCase()} at ${detail.serviceAddress.line1.split(',')[0]}, you'll need asphalt shingles, synthetic underlayment, ice & water shield, ridge vents, and flashing.`;
                                        }
                                        setSenseProcessing(false);
                                        setSenseResult(aiResponse);
                                        setSenseMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
                                      }, 800);
                                    }}
                                    className="w-full flex items-center gap-2 px-2 py-2 text-left rounded-lg hover:bg-[#F8F9FB] transition-colors group"
                                  >
                                    <span className="text-[#D1D5DB] group-hover:text-[#B0B8C4] transition-colors text-[12px]">→</span>
                                    <span className="text-[12px] text-[#B0B8C4] group-hover:text-[#6B7280] transition-colors" style={{ fontWeight: 420 }}>
                                      {text}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Catch me up card */}
                            <div>
                              <button
                                onClick={() => setSensePanelTab('summary')}
                                className="w-full flex items-center gap-3 p-3.5 rounded-xl hover:shadow-sm transition-all text-left group bg-white"
                                style={{ border: '1px solid rgba(253, 80, 0, 0.15)' }}
                              >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FFF4ED' }}>
                                  <Sparkles className="w-4 h-4 text-[#FD5000]" style={{ opacity: 0.6 }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Catch me up</span>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] text-[#FD5000] bg-[#FFF4ED]" style={{ fontWeight: 600 }}>New</span>
                                  </div>
                                  <p className="text-[11px] text-[#9CA3AF]" style={{ fontWeight: 450 }}>Get a summary of what's happened on this job.</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#9CA3AF] transition-colors flex-shrink-0" />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Chat messages */}
                        {senseMessages.length > 0 && (
                          <div className="space-y-5">
                            {senseMessages.map((msg, i) => (
                              <div key={i}>
                                {/* User message */}
                                {msg.role === 'user' && (
                                  <div className="flex justify-end">
                                    <div
                                      className="max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] text-[#1C1E21] leading-relaxed"
                                      style={{ background: '#F0F1F3', fontWeight: 400 }}
                                    >
                                      {msg.text}
                                    </div>
                                  </div>
                                )}
                                {/* AI message */}
                                {msg.role === 'ai' && (
                                  <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2">
                                      <SenseLogo size={15} animated={false} />
                                      <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
                                    </div>
                                    <p className="text-[13px] text-[#1C1E21] leading-relaxed" style={{ fontWeight: 400 }}>
                                      {msg.text}
                                    </p>
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
                          </div>
                        )}
                      </div>

                      {/* Bottom input */}
                      <div className="flex-shrink-0 px-4 py-3" style={{ background: '#FFFFFF', borderTop: '1px solid #E6E8EC' }}>
                        <div
                          className="rounded-xl px-3.5 pt-3 pb-2.5"
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
                            placeholder="Send a message..."
                            value={senseQuery}
                            onChange={e => setSenseQuery(e.target.value)}
                            onFocus={() => setSenseInputFocused(true)}
                            onBlur={() => setSenseInputFocused(false)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && !senseProcessing) handleSenseSubmit();
                            }}
                            disabled={senseProcessing}
                            className="w-full text-[13px] text-[#1C1E21] placeholder-[#B0B8C4] bg-transparent outline-none mb-2"
                            style={{ fontWeight: 400 }}
                          />
                          <div className="flex items-center justify-between">
                            <button
                              className="p-1 rounded-lg hover:bg-[#F5F5F5] transition-colors"
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
                              className="w-7 h-7 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                              style={{
                                background: senseQuery.trim() ? '#1C1E21' : '#E6E8EC',
                              }}
                            >
                              <ArrowUp className={`w-3.5 h-3.5 ${senseQuery.trim() ? 'text-white' : 'text-[#B0B8C4]'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* === Summary Tab === */}
                  {sensePanelTab === 'summary' && (
                    <div className="flex-1 overflow-y-auto" style={{ background: '#FFFFFF' }}>
                      <div className="px-5 pt-5 pb-8">

                        {/* ── Header row ── */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1.5">
                            <SenseLogo size={14} animated={false} />
                            <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense Overview</span>
                          </div>
                          <span className="text-[11px] text-[#9CA3AF]">{detail.aiSummaryDate}</span>
                        </div>

                        {/* ── Progress ── */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] text-[#9CA3AF]">Progress</span>
                            <span className="text-[11px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{detail.completionPct}%</span>
                          </div>
                          <div className="h-1 rounded-full bg-[#F0F1F3] overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${detail.completionPct}%`, background: 'linear-gradient(90deg, #FD5000, #FF8C42)' }} />
                          </div>
                          <div className="flex items-center gap-3 mt-2.5">
                            <span className="flex items-center gap-1 text-[11px] text-[#6B7280]"><span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />{detail.status}</span>
                            <span className="text-[11px] text-[#6B7280]">Permit {detail.permitStatus}</span>
                            <span className="text-[11px] text-[#6B7280]">{detail.daysUntilDue}d left</span>
                          </div>
                        </div>

                        {/* ── Section: Summary ── */}
                        <SummarySection label="Summary" isOpen={summaryAccordion.summary} onToggle={() => setSummaryAccordion(prev => ({ ...prev, summary: !prev.summary }))}>
                          <p className="text-[13px] text-[#374151] leading-relaxed">{detail.aiSummary}</p>
                          <p className="text-[12px] text-[#9CA3AF] leading-relaxed mt-2">{detail.aiSummaryHighlights}</p>
                          <div className="flex items-center gap-4 mt-4 pt-3.5" style={{ borderTop: '1px solid #F0F1F3' }}>
                            {[
                              { label: 'Value', value: `$${detail.jobValue.toLocaleString()}` },
                              { label: 'Profit', value: `$${detail.jobProfit.toLocaleString()}` },
                              { label: 'Margin', value: `${Math.round((detail.jobProfit / detail.jobValue) * 100)}%` },
                            ].map((m, i) => (
                              <div key={m.label} className={`flex-1 ${i > 0 ? 'pl-4 border-l border-[#F0F1F3]' : ''}`}>
                                <span className="text-[10px] text-[#9CA3AF] block" style={{ fontWeight: 500 }}>{m.label}</span>
                                <span className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{m.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4 pt-3.5" style={{ borderTop: '1px solid #F0F1F3' }}>
                            {[
                              { label: 'Roof Area', value: detail.roofArea },
                              { label: 'Roof Type', value: detail.roofType },
                              { label: 'Permit', value: detail.permitNumber },
                              { label: 'Warranty', value: `${detail.warrantyYears}-year` },
                              { label: 'Materials', value: detail.materialStatus },
                              { label: 'Category', value: detail.category },
                            ].map(item => (
                              <div key={item.label}>
                                <span className="text-[10px] text-[#9CA3AF] block" style={{ fontWeight: 500 }}>{item.label}</span>
                                <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{item.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2.5 mt-4 pt-3.5" style={{ borderTop: '1px solid #F0F1F3' }}>
                            {[
                              { label: 'Customer', value: detail.customer },
                              { label: 'Assigned', value: detail.assignedTo },
                              { label: 'Scheduled', value: detail.schedule },
                              { label: 'Location', value: detail.serviceAddress.line1.replace(/,$/, '') },
                            ].map(item => (
                              <div key={item.label} className="flex items-baseline gap-2">
                                <span className="text-[11px] text-[#9CA3AF] w-16 flex-shrink-0" style={{ fontWeight: 500 }}>{item.label}</span>
                                <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{item.value}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3.5" style={{ borderTop: '1px solid #F0F1F3' }}>
                            <span className="text-[10px] text-[#9CA3AF]" style={{ fontWeight: 500 }}>Last activity · {detail.lastActivityDate}</span>
                            <p className="text-[12.5px] text-[#6B7280] leading-relaxed mt-1">{detail.lastActivity}</p>
                          </div>
                        </SummarySection>

                        {/* ── Section: Next Steps ── */}
                        <SummarySection
                          label="Next Steps"
                          badge={String(3 - completedSteps.size)}
                          isOpen={summaryAccordion.nextSteps}
                          onToggle={() => setSummaryAccordion(prev => ({ ...prev, nextSteps: !prev.nextSteps }))}
                        >
                          <div className="space-y-1">
                            {[
                              { title: 'Confirm material delivery', owner: detail.assignedTo, due: 'Tomorrow', priority: 'High' as const, action: 'Log update' },
                              { title: 'Finalize crew schedule for installation week', owner: detail.createdBy, due: 'In 2 days', priority: 'High' as const, action: 'Open schedule' },
                              { title: `Send pre-walkthrough checklist to ${detail.customer}`, owner: detail.assignedTo, due: 'This week', priority: 'Medium' as const, action: 'Send now' },
                            ].map((step, i) => {
                              const done = completedSteps.has(i);
                              const dotColor = step.priority === 'High' ? '#EF4444' : step.priority === 'Medium' ? '#F59E0B' : '#10B981';
                              return (
                                <div
                                  key={i}
                                  className="group flex items-start gap-3 rounded-lg px-2.5 py-2.5 -mx-2.5 transition-colors hover:bg-[#F8F9FB]"
                                >
                                  {/* Checkbox circle */}
                                  <button
                                    onClick={() => setCompletedSteps(prev => {
                                      const next = new Set(prev);
                                      done ? next.delete(i) : next.add(i);
                                      return next;
                                    })}
                                    className="flex-shrink-0 mt-[2px] w-4 h-4 rounded-full border transition-all flex items-center justify-center"
                                    style={{
                                      borderColor: done ? '#10B981' : '#D1D5DB',
                                      background: done ? '#10B981' : 'transparent',
                                    }}
                                  >
                                    {done && (
                                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    )}
                                  </button>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p
                                        className="text-[12.5px] leading-snug transition-colors"
                                        style={{
                                          fontWeight: 500,
                                          color: done ? '#9CA3AF' : '#1C1E21',
                                          textDecoration: done ? 'line-through' : 'none',
                                        }}
                                      >
                                        {step.title}
                                      </p>
                                      {/* Action button — visible on hover or when not done */}
                                      {!done && (
                                        <button
                                          className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[10.5px] px-2 py-0.5 rounded-md whitespace-nowrap"
                                          style={{
                                            color: '#FD5000',
                                            background: '#FFF4ED',
                                            fontWeight: 600,
                                          }}
                                        >
                                          {step.action}
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {!done && (
                                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                                      )}
                                      <p className="text-[11px] text-[#9CA3AF]">{step.owner} · {step.due}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/* Add step */}
                          <button
                            className="mt-3 flex items-center gap-1.5 text-[11.5px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                            style={{ fontWeight: 500 }}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            Add step
                          </button>
                        </SummarySection>

                        {/* ── Section: Risks ── */}
                        <SummarySection label="Risks" badge="2" badgeColor="#EF4444" isOpen={summaryAccordion.risks} onToggle={() => setSummaryAccordion(prev => ({ ...prev, risks: !prev.risks }))}>
                          <div className="space-y-4">
                            {[
                              { severity: 'Critical', accentColor: '#EF4444', title: 'No invoice generated', description: `$${detail.jobValue.toLocaleString()} job value has no invoice attached. Revenue is at risk until invoiced.`, action: 'Create Invoice' },
                              { severity: 'Warning', accentColor: '#F59E0B', title: 'Material delivery unconfirmed', description: 'Materials were ordered 5 days ago with no confirmation. Risk of crew arriving without materials.', action: 'Contact Supplier' },
                            ].map((risk, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="w-0.5 rounded-full flex-shrink-0 self-stretch" style={{ background: risk.accentColor, minHeight: '48px' }} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px]" style={{ color: risk.accentColor, fontWeight: 600 }}>{risk.severity}</span>
                                    <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{risk.title}</span>
                                  </div>
                                  <p className="text-[12px] text-[#6B7280] leading-relaxed">{risk.description}</p>
                                  <button className="mt-2 text-[11.5px] transition-opacity hover:opacity-70" style={{ color: risk.accentColor, fontWeight: 600 }}>{risk.action} →</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </SummarySection>

                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          )}

          {/* Icon rail - rightmost edge */}
          <div className="w-[48px] flex-shrink-0 border-l border-[#E6E8EC] bg-white flex flex-col items-center pt-3 gap-1">
            <button
              onClick={() => setRightPanel(rightPanel === 'details' ? null : 'details')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                rightPanel === 'details'
                  ? 'bg-[#F3F4F6] border border-[#E6E8EC]'
                  : 'hover:bg-[#F8F9FB]'
              }`}
              title="Details"
            >
              {/* Properties/list icon matching the reference */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 4.5h4.5v4.5H3V4.5z" stroke={rightPanel === 'details' ? '#1C1E21' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 5.25H15M10.5 8.25H13.5M3 12.75H15M3 15.75H12" stroke={rightPanel === 'details' ? '#1C1E21' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setRightPanel(rightPanel === 'comments' ? null : 'comments')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                rightPanel === 'comments'
                  ? 'bg-[#F3F4F6] border border-[#E6E8EC]'
                  : 'hover:bg-[#F8F9FB]'
              }`}
              title="Comments"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M15 9.75A6.75 6.75 0 1 1 9 3a6.75 6.75 0 0 1 6 3.75" stroke={rightPanel === 'comments' ? '#1C1E21' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 15.75c-1.5 0-3.75-.75-5.25-2.25L2.25 15.75" stroke={rightPanel === 'comments' ? '#1C1E21' : '#9CA3AF'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="relative" ref={senseDropdownRef}>
              <button
                onClick={() => setRightPanel(rightPanel === 'sense' ? null : 'sense')}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  rightPanel === 'sense'
                    ? 'bg-[#FFF7ED] border border-[rgba(245,166,35,0.20)]'
                    : 'hover:bg-[#F8F9FB]'
                }`}
                title="Sense AI"
              >
                <SenseLogo size={16} animated={false} />
              </button>
              {rightPanel === 'sense' && (
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-0.5 text-[10px] text-[#D2600A] whitespace-nowrap" style={{ fontWeight: 600 }}>Sense</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === Summarize Job Floating Card (legacy) === */}
      {false && summaryOpen && (
        <>
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setSummaryOpen(false)}
          />
          <div
            className="fixed z-[70] left-1/2 bottom-8"
            style={{
              transform: 'translateX(-50%)',
              width: '680px',
              maxWidth: 'calc(100vw - 48px)',
              animation: 'senseSlideUp 0.25s ease-out',
            }}
          >
            <style>{`
              @keyframes senseSlideUp {
                from { opacity: 0; transform: translateX(-50%) translateY(20px); }
                to { opacity: 1; transform: translateX(-50%) translateY(0); }
              }
              @keyframes senseGlow {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
              }
            `}</style>

            {/* Warm glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: '-80px -120px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(253, 80, 0, 0.12) 0%, rgba(245, 166, 35, 0.08) 30%, rgba(217, 119, 6, 0.04) 55%, transparent 75%)',
                animation: 'senseGlow 3s ease-in-out infinite',
                filter: 'blur(20px)',
                zIndex: -1,
              }}
            />

            <div
              className="rounded-2xl overflow-hidden relative"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFCF9 100%)',
                border: '1px solid rgba(245, 166, 35, 0.20)',
                boxShadow: '0 0 0 1px rgba(245, 166, 35, 0.06), 0 8px 48px rgba(253, 80, 0, 0.14), 0 4px 20px rgba(245, 166, 35, 0.10), 0 20px 60px rgba(0, 0, 0, 0.12)',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 pt-4 pb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
                    border: '1px solid rgba(245, 166, 35, 0.20)',
                  }}
                >
                  <SenseLogo size={22} animated={false} />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-[#C4712B] block" style={{ fontWeight: 600, letterSpacing: '0.02em' }}>SENSE</span>
                  <span className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Job Summary — {detail.jobNumber}</span>
                </div>
                <button
                  onClick={() => setSummaryOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
                >
                  <X className="w-4 h-4 text-[#9CA3AF]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-5 pb-0">
                {([
                  { key: 'summary' as const, label: 'Summary', icon: <FileText className="w-3.5 h-3.5" /> },
                  { key: 'next-steps' as const, label: 'Next Steps', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
                  { key: 'risks' as const, label: 'Risks & Attention', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
                ]).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setSummaryTab(tab.key)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg text-[12px] transition-all relative"
                    style={{
                      fontWeight: summaryTab === tab.key ? 600 : 450,
                      color: summaryTab === tab.key ? '#1C1E21' : '#9CA3AF',
                      background: summaryTab === tab.key ? '#FFFFFF' : 'transparent',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.key === 'risks' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] flex-shrink-0" />
                    )}
                    {summaryTab === tab.key && (
                      <div className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full" style={{ background: '#FD5000' }} />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="border-t border-[#F3F4F6]">
                <div className="px-5 py-4 max-h-[380px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {/* Summary Tab */}
                  {summaryTab === 'summary' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[13px] text-[#1C1E21] mb-2" style={{ fontWeight: 600 }}>Overview</h4>
                        <p className="text-[13px] text-[#4B5563] leading-relaxed">{detail.aiSummary}</p>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-1 rounded-lg p-3" style={{ background: '#F0FDF4', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                          <span className="text-[11px] text-[#6B7280] block mb-1" style={{ fontWeight: 500 }}>Job Value</span>
                          <span className="text-[16px] text-[#065F46]" style={{ fontWeight: 700 }}>${detail.jobValue.toLocaleString()}</span>
                        </div>
                        <div className="flex-1 rounded-lg p-3" style={{ background: '#EFF6FF', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                          <span className="text-[11px] text-[#6B7280] block mb-1" style={{ fontWeight: 500 }}>Profit</span>
                          <span className="text-[16px] text-[#1E40AF]" style={{ fontWeight: 700 }}>${detail.jobProfit.toLocaleString()}</span>
                        </div>
                        <div className="flex-1 rounded-lg p-3" style={{ background: '#FFFBEB', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
                          <span className="text-[11px] text-[#6B7280] block mb-1" style={{ fontWeight: 500 }}>Margin</span>
                          <span className="text-[16px] text-[#92400E]" style={{ fontWeight: 700 }}>{Math.round((detail.jobProfit / detail.jobValue) * 100)}%</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[13px] text-[#1C1E21] mb-2" style={{ fontWeight: 600 }}>Key Details</h4>
                        <p className="text-[13px] text-[#4B5563] leading-relaxed">{detail.aiSummaryHighlights}</p>
                      </div>

                      <div className="rounded-lg p-3" style={{ background: 'linear-gradient(135deg, #F8FAFC, #F1F5F9)', border: '1px solid #E2E8F0' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                          <span className="text-[12px] text-[#6B7280]" style={{ fontWeight: 500 }}>Service Location</span>
                        </div>
                        <p className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{detail.address}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2.5">
                          <User className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[11px] text-[#9CA3AF] block">Customer</span>
                            <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{detail.customer}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <User className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[11px] text-[#9CA3AF] block">Assigned To</span>
                            <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{detail.assignedTo}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[11px] text-[#9CA3AF] block">Scheduled</span>
                            <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{detail.schedule}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Tag className="w-3.5 h-3.5 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[11px] text-[#9CA3AF] block">Category</span>
                            <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{detail.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Steps Tab */}
                  {summaryTab === 'next-steps' && (
                    <div className="space-y-3">
                      <p className="text-[13px] text-[#6B7280] leading-relaxed mb-1">Based on the current status and job data, here are the recommended actions:</p>

                      {[
                        {
                          priority: 'high',
                          title: 'Confirm material delivery date',
                          description: 'Shingles and underlayment are ordered but delivery confirmation is pending. Contact supplier to lock in a date before crew scheduling.',
                          due: 'By tomorrow',
                          assignee: detail.assignedTo,
                        },
                        {
                          priority: 'high',
                          title: 'Schedule crew for installation',
                          description: `${detail.assignees.length} team members are assigned but the crew schedule hasn't been finalized. Confirm availability for ${detail.schedule}.`,
                          due: 'Within 2 days',
                          assignee: detail.createdBy,
                        },
                        {
                          priority: 'medium',
                          title: 'Send pre-job walkthrough reminder',
                          description: `Notify ${detail.customer} about the pre-installation walkthrough. Confirm access to the property and discuss any special requirements.`,
                          due: 'This week',
                          assignee: detail.assignedTo,
                        },
                        {
                          priority: 'medium',
                          title: 'Generate and send invoice',
                          description: `No invoice has been created yet for this $${detail.jobValue.toLocaleString()} job. Draft the invoice and send for approval.`,
                          due: 'Before job start',
                          assignee: 'Billing Team',
                        },
                        {
                          priority: 'low',
                          title: 'Update permit documentation',
                          description: 'Building permit #BP-2024-1234 is approved. Upload the permit copy to the job file for inspector reference.',
                          due: 'Before inspection',
                          assignee: detail.createdBy,
                        },
                      ].map((step, i) => (
                        <div
                          key={i}
                          className="rounded-lg p-3.5 transition-all hover:shadow-sm"
                          style={{
                            background: '#FFFFFF',
                            border: `1px solid ${step.priority === 'high' ? 'rgba(239, 68, 68, 0.15)' : step.priority === 'medium' ? 'rgba(245, 158, 11, 0.15)' : '#E6E8EC'}`,
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 mt-0.5" style={{
                              background: step.priority === 'high' ? '#FEE2E2' : step.priority === 'medium' ? '#FEF3C7' : '#F3F4F6',
                            }}>
                              <span className="text-[10px]" style={{
                                fontWeight: 700,
                                color: step.priority === 'high' ? '#DC2626' : step.priority === 'medium' ? '#D97706' : '#6B7280',
                              }}>
                                {i + 1}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{step.title}</span>
                                <span className="px-1.5 py-0.5 rounded text-[10px]" style={{
                                  fontWeight: 600,
                                  background: step.priority === 'high' ? '#FEE2E2' : step.priority === 'medium' ? '#FEF3C7' : '#F3F4F6',
                                  color: step.priority === 'high' ? '#DC2626' : step.priority === 'medium' ? '#D97706' : '#6B7280',
                                }}>
                                  {step.priority.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-[12px] text-[#6B7280] leading-relaxed mb-2">{step.description}</p>
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                                  <Clock className="w-3 h-3" />
                                  {step.due}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
                                  <User className="w-3 h-3" />
                                  {step.assignee}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Risks & Attention Tab */}
                  {summaryTab === 'risks' && (
                    <div className="space-y-3">
                      <p className="text-[13px] text-[#6B7280] leading-relaxed mb-1">Sense detected the following risks and items needing attention:</p>

                      {[
                        {
                          severity: 'critical',
                          title: 'No invoice generated',
                          description: `This $${detail.jobValue.toLocaleString()} job has no invoice. Revenue at risk if work begins without billing documentation in place.`,
                          action: 'Create invoice now',
                          icon: <FileText className="w-4 h-4" />,
                        },
                        {
                          severity: 'warning',
                          title: 'Material delivery unconfirmed',
                          description: 'Shingles and underlayment were ordered 5 days ago but delivery has not been confirmed. This may delay the scheduled start date.',
                          action: 'Contact supplier',
                          icon: <AlertTriangle className="w-4 h-4" />,
                        },
                        {
                          severity: 'warning',
                          title: 'Crew availability conflict possible',
                          description: `2 of ${detail.assignees.length} assigned team members have overlapping jobs on the scheduled dates. Verify crew allocation to prevent delays.`,
                          action: 'Check schedule',
                          icon: <Clock className="w-4 h-4" />,
                        },
                        {
                          severity: 'info',
                          title: 'Low profit margin',
                          description: `Current margin is ${Math.round((detail.jobProfit / detail.jobValue) * 100)}% ($${detail.jobProfit.toLocaleString()} profit on $${detail.jobValue.toLocaleString()}). Industry average for this job type is 15-20%. Review material costs.`,
                          action: 'Review costs',
                          icon: <Sparkles className="w-4 h-4" />,
                        },
                        {
                          severity: 'info',
                          title: 'Customer follow-up overdue',
                          description: `No communication with ${detail.customer} in the last 7 days. Proactive updates improve satisfaction and reduce cancellations.`,
                          action: 'Send update',
                          icon: <MessageSquare className="w-4 h-4" />,
                        },
                      ].map((risk, i) => (
                        <div
                          key={i}
                          className="rounded-lg overflow-hidden transition-all hover:shadow-sm"
                          style={{
                            border: `1px solid ${risk.severity === 'critical' ? 'rgba(239, 68, 68, 0.25)' : risk.severity === 'warning' ? 'rgba(245, 158, 11, 0.20)' : '#E6E8EC'}`,
                          }}
                        >
                          <div
                            className="flex items-center gap-2 px-3.5 py-2"
                            style={{
                              background: risk.severity === 'critical' ? 'linear-gradient(135deg, #FEF2F2, #FEE2E2)' : risk.severity === 'warning' ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : '#F8F9FB',
                            }}
                          >
                            <span style={{ color: risk.severity === 'critical' ? '#DC2626' : risk.severity === 'warning' ? '#D97706' : '#6B7280' }}>
                              {risk.icon}
                            </span>
                            <span className="text-[13px] flex-1" style={{
                              fontWeight: 600,
                              color: risk.severity === 'critical' ? '#991B1B' : risk.severity === 'warning' ? '#92400E' : '#1C1E21',
                            }}>
                              {risk.title}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px]" style={{
                              fontWeight: 700,
                              background: risk.severity === 'critical' ? '#FCA5A5' : risk.severity === 'warning' ? '#FCD34D' : '#E5E7EB',
                              color: risk.severity === 'critical' ? '#7F1D1D' : risk.severity === 'warning' ? '#78350F' : '#374151',
                            }}>
                              {risk.severity === 'critical' ? 'CRITICAL' : risk.severity === 'warning' ? 'WARNING' : 'INFO'}
                            </span>
                          </div>
                          <div className="px-3.5 py-3 bg-white">
                            <p className="text-[12px] text-[#6B7280] leading-relaxed mb-2.5">{risk.description}</p>
                            <button
                              className="flex items-center gap-1.5 text-[12px] transition-colors hover:opacity-80"
                              style={{
                                fontWeight: 600,
                                color: risk.severity === 'critical' ? '#DC2626' : risk.severity === 'warning' ? '#D97706' : '#FD5000',
                              }}
                            >
                              {risk.action} →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 px-5 py-3 border-t border-[#F3F4F6]">
                  <span className="text-[11px] text-[#C4C8D0]">
                    AI-generated summary based on job data · Last updated {detail.aiSummaryDate}
                  </span>
                  <div className="flex-1" />
                  <span className="text-[11px] text-[#C4C8D0] flex items-center gap-1">
                    <kbd className="px-1 py-0.5 rounded bg-[#F3F4F6] text-[10px] text-[#9CA3AF]" style={{ fontWeight: 600 }}>Esc</kbd>
                    to close
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}


    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <span className="text-[11px] text-[#9CA3AF] block mb-0.5" style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
        <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 500 }}>{value}</span>
      </div>
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, valueColor }: { icon: React.ReactNode; iconBg: string; label: string; value: string; valueColor?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EC] px-5 py-4 flex flex-col" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <span className="text-[11px] text-[#9CA3AF] mb-1" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      <span className="text-[17px]" style={{ fontWeight: 700, color: valueColor || '#1C1E21', letterSpacing: '-0.02em' }}>{value}</span>
    </div>
  );
}

function TaskRow({ title, assignee, dueDate, priority }: { title: string; assignee: string; dueDate: string; priority: string }) {
  const priorityColor = priority === 'High' ? '#DC2626' : priority === 'Medium' ? '#D97706' : '#6B7280';
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#F3F4F6] hover:border-[#E6E8EC] hover:bg-[#FAFBFC] transition-all group cursor-pointer">
      <Circle className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#C4C8D0] flex-shrink-0 transition-colors" />
      <span className="flex-1 text-[13px] text-[#1C1E21] truncate" style={{ fontWeight: 500 }}>{title}</span>
      <span className="text-[11px] text-[#C4C8D0] flex-shrink-0">{assignee}</span>
      <span className="text-[11px] text-[#C4C8D0] flex-shrink-0">{dueDate}</span>
      <span className="text-[11px] flex-shrink-0 px-1.5 py-0.5 rounded-md" style={{ fontWeight: 600, color: priorityColor, backgroundColor: priorityColor + '18' }}>{priority}</span>
    </div>
  );
}

function InvoiceRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] text-[#9CA3AF]" style={{ fontWeight: 500 }}>{label}</span>
      <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: bold ? 700 : 500 }}>{value}</span>
    </div>
  );
}

function SummarySection({
  label,
  badge,
  badgeColor,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  badge?: string;
  badgeColor?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-1" style={{ borderTop: '1px solid #F0F1F3' }}>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 group"
      >
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{label}</span>
          {badge && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                background: badgeColor ? `${badgeColor}15` : '#F3F4F6',
                color: badgeColor ?? '#6B7280',
                fontWeight: 600,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 text-[#C4C8D0] transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
      </button>
      {isOpen && (
        <div className="pb-4">
          {children}
        </div>
      )}
    </div>
  );
}