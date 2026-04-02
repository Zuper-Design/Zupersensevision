import { Mic, ArrowUp, ArrowLeft, Plus, SquareArrowOutUpRight, MessageSquare, Pencil, Star, PanelLeftClose, PanelLeftOpen, X, ChevronLeft, ChevronRight, Archive, Edit3, FlaskConical, ImagePlus } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ResearchDisplay } from './ResearchDisplay';
import { ConfirmationCard } from './ConfirmationCard';

import { ChecklistCard } from './ChecklistCard';
import { ModernPDFPreview } from './ModernPDFPreview';
import { ActionConfirmationCard } from './ActionConfirmationCard';
import { DSOChartCard } from './DSOChartCard';
import { RevenueMTDCard, OverdueInvoicesCard, QuoteConversionCard, CrewUtilisationCard, JobsCompletedCard } from './RadarCards';
import { AgentRecommendationCard } from './AgentRecommendationCard';
import { TypewriterText } from './TypewriterText';
import { MessageToolbar } from './MessageToolbar';
import { RadarSuccessToast } from './RadarSuccessToast';
import { SavedCard, useRadar } from './RadarContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Line } from 'recharts';
import { SuggestedFollowups, getFollowupSuggestions } from './SuggestedFollowups';
import { AttentionCardWidget } from './widgets/AttentionCardWidget';
import { WeatherWidget } from './widgets/WeatherWidget';
import { CustomersTableWidget } from './widgets/CustomersTableWidget';
import { RevenueChartWidget } from './widgets/RevenueChartWidget';
import { RevenueBarChartWidget } from './widgets/RevenueBarChartWidget';
import { EmailWidget } from './widgets/EmailWidget';
import { TaskTableWidget } from './widgets/TaskTableWidget';
import { PerformanceWidget } from './widgets/PerformanceWidget';
import { TeamWidget } from './widgets/TeamWidget';
import { ReportsWidget } from './widgets/ReportsWidget';
import { TasksWidget } from './widgets/TasksWidget';
import { ModulesWidget } from './widgets/ModulesWidget';
import { PageBuilderCard } from './PageBuilderCard';
import { Tooltip } from './Tooltip';
import { PageBuilderPreviewCard } from './PageBuilderPreviewCard';
import { InvoicePageBuilderCard } from './InvoicePageBuilderCard';
import { InvoicePageBuilderPreviewCard } from './InvoicePageBuilderPreviewCard';
import { SenseLogo } from './SenseLogo';
import { EmailCard } from './EmailCard';
import { EmailEditorCard } from './EmailEditorCard';
import { MetricsChartCards } from './MetricsChartCards';

type ModuleType = 'job' | 'customer' | 'organization' | 'quote' | 'invoice' | 'project' | 'property' | 'vendor' | 'material request' | 'part' | 'service' | 'contract' | 'asset';

interface DetailField {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  showResearch?: boolean;
  canvasWidgetId?: string;
  confirmationCard?: {
    moduleType: ModuleType;
    moduleName: string;
    fields: DetailField[];
  };

  checklistCard?: {
    title: string;
    items: ChecklistItem[];
  };
  actionConfirmationCard?: {
    action: string;
    details?: string;
  };
  dsoChart?: boolean;
  metricsCharts?: 'full' | 'team' | 'revenue' | 'jobs';
  radarCardView?: SavedCard;
  typewriter?: boolean;
  emailCard?: {
    type: 'email' | 'message';
    subject: string;
    from: string;
    to: string | string[];
    body: string;
  };
  imageUrl?: string;
  generatedChart?: boolean;
}

function getRadarCardSentence(card: SavedCard): string {
  const t = card.title.toLowerCase();
  if (t.includes('revenue') || t.includes('mtd')) return "Here's your Revenue MTD vs Target card — tracking at $156K of a $200K goal.";
  if (t.includes('overdue') || t.includes('dso') || t.includes('days sales')) return "Here are your overdue invoices — 14 open, totalling $127,400.";
  if (t.includes('quote') || t.includes('conversion')) return "Here's your Quote-to-Invoice Conversion — at 64% this month.";
  if (t.includes('crew') || t.includes('utilis') || t.includes('utiliz')) return "Here's your Crew Utilisation — currently at 71% across all teams.";
  if (t.includes('job') || t.includes('at risk') || t.includes('completed')) return "Here's your Jobs overview — 48 completed, 3 at risk this month.";
  return `Here's your "${card.title}" card.`;
}

function getRadarCardMessages(card: SavedCard): { responseText: string; extras: Partial<Message> } {
  return { responseText: getRadarCardSentence(card), extras: { radarCardView: card } };
}

interface ConversationViewProps {
  question: string;
  onBack?: () => void;
  activeView?: 'chat' | 'radar';
  onViewChange?: (view: 'chat' | 'radar') => void;
  fromCanvas?: boolean;
  widgetId?: string | null;
  onOpenFeedback?: () => void;
  radarCard?: SavedCard | null;
}

// Widget response text mapping
const widgetResponseText: Record<string, string> = {
  'weather': "Here's the current weather forecast for your job sites this week:",
  'customers': "Here's your customer overview with recent activity:",
  'email': "Here's your email dashboard with recent messages:",
  'line-chart': "Here's your revenue trend analysis:",
  'bar-chart': "Here's your monthly revenue breakdown:",
  'tasks-table': "Here are your current tasks and their status:",
  'modules': "Here's your business modules overview with entity counts:",
  'performance': "Here are your key performance metrics:",
  'team': "Here's your team overview and availability:",
  'tasks': "Here's your task checklist for today:",
  'reports': "Here are your recent reports:",
  'attention': "Here are the items that need your immediate attention:",
};

// Canvas widget renderer
const CanvasWidgetInChat = ({ widgetId }: { widgetId: string }) => {
  const widgetMap: Record<string, React.ReactNode> = {
    'weather': <WeatherWidget />,
    'customers': <CustomersTableWidget />,
    'email': <EmailWidget />,
    'line-chart': <RevenueChartWidget />,
    'bar-chart': <RevenueBarChartWidget />,
    'tasks-table': <TaskTableWidget />,
    'modules': <ModulesWidget />,
    'performance': <PerformanceWidget />,
    'team': <TeamWidget />,
    'tasks': <TasksWidget />,
    'reports': <ReportsWidget />,
    'attention': <AttentionCardWidget />,
  };

  return (
    <div className="w-full max-w-[720px] min-w-0 overflow-hidden">
      {/* From Canvas badge */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#FFF4ED] border border-[#FD5000]/15 rounded-full">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FD5000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          <span className="text-[10px] font-medium text-[#FD5000]">From Canvas</span>
        </div>
      </div>
      {widgetMap[widgetId] || <p className="text-[14px] text-[#6B7280]">Widget not found</p>}
    </div>
  );
};

function RadarCardInChat({ card }: { card: SavedCard }) {
  const t = card.title.toLowerCase();
  if (t.includes('revenue') || t.includes('mtd')) return <RevenueMTDCard />;
  if (t.includes('overdue') || t.includes('dso') || t.includes('days sales')) return <OverdueInvoicesCard />;
  if (t.includes('quote') || t.includes('conversion')) return <QuoteConversionCard />;
  if (t.includes('crew') || t.includes('utilis') || t.includes('utiliz')) return <CrewUtilisationCard />;
  if (t.includes('job') || t.includes('at risk') || t.includes('completed')) return <JobsCompletedCard />;
  // Saved card fallback — render card preview
  return (
    <div style={{ background: '#FFFFFF', border: '1px solid #E6E8EC', borderRadius: 12, padding: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#1C1E21', margin: 0, marginBottom: 4 }}>{card.title}</h3>
      {card.preview && <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{card.preview}</p>}
    </div>
  );
}

function GeneratedChartCard() {
  const data = [
    { month: 'Jan', revenue: 42000, target: 38000, profit: 12000 },
    { month: 'Feb', revenue: 48000, target: 40000, profit: 15000 },
    { month: 'Mar', revenue: 45000, target: 42000, profit: 13000 },
    { month: 'Apr', revenue: 56000, target: 44000, profit: 19000 },
    { month: 'May', revenue: 52000, target: 46000, profit: 17000 },
    { month: 'Jun', revenue: 61000, target: 48000, profit: 22000 },
    { month: 'Jul', revenue: 58000, target: 50000, profit: 20000 },
    { month: 'Aug', revenue: 67000, target: 52000, profit: 25000 },
  ];

  return (
    <div className="w-full max-w-[560px] bg-white border border-[#E6E8EC] rounded-xl p-5" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      <div className="mb-4">
        <h3 className="text-[15px] font-bold text-[#1C1E21] mb-0.5">Generated Chart</h3>
        <p className="text-[12px] text-[#9CA3AF]">Built from your uploaded image</p>
      </div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
            <defs>
              <linearGradient id="genRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6D5F63" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6D5F63" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="genProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `$${v / 1000}k`} />
            <RechartsTooltip
              contentStyle={{ background: '#fff', border: '1px solid #E6E8EC', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, undefined]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#221E1F" strokeWidth={2} fill="url(#genRevenue)" name="Revenue" />
            <Area type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={2} fill="url(#genProfit)" name="Profit" />
            <Line type="monotone" dataKey="target" stroke="#E6E8EC" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-5 mt-3 pt-3 border-t border-[#F0F1F3]">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#221E1F]" /><span className="text-[11px] text-[#6B7280]">Revenue</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" /><span className="text-[11px] text-[#6B7280]">Profit</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 border-t border-dashed border-[#D1D5DB]" style={{ width: 10 }} /><span className="text-[11px] text-[#6B7280]">Target</span></div>
      </div>
    </div>
  );
}

export function ConversationView({ question, onBack, activeView = 'chat', onViewChange, fromCanvas = false, widgetId, onOpenFeedback, radarCard }: ConversationViewProps) {
  const { radars, activeRadarId, addCardToRadar } = useRadar();
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [chatName, setChatName] = useState(question);
  const [tempChatName, setTempChatName] = useState(question);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'radar'>('chat');
  const [isStarred, setIsStarred] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isConversationsExpanded, setIsConversationsExpanded] = useState(true);
  const [isResearchComplete, setIsResearchComplete] = useState(fromCanvas || !!radarCard || question.toLowerCase().includes('revenue growth') ? true : false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(question);

  const [isThreadHistoryOpen, setIsThreadHistoryOpen] = useState(false);
  const [isPageBuilderOpen, setIsPageBuilderOpen] = useState(false);
  const [pageBuilderWasOpened, setPageBuilderWasOpened] = useState(false);
  const [isPageBuilderLoading, setIsPageBuilderLoading] = useState(false);
  const [isInvoicePageBuilderOpen, setIsInvoicePageBuilderOpen] = useState(false);
  const [invoicePageBuilderWasOpened, setInvoicePageBuilderWasOpened] = useState(false);
  const [isInvoicePageBuilderLoading, setIsInvoicePageBuilderLoading] = useState(false);
  const [isEmailEditorOpen, setIsEmailEditorOpen] = useState(false);
  const [emailEditorData, setEmailEditorData] = useState<{ subject: string; to: string; body: string; type: 'email' | 'message' }>({
    subject: '',
    to: '',
    body: '',
    type: 'email'
  });
  const [activeThreadId, setActiveThreadId] = useState(1); // Track which thread is active
  const [threadStatuses, setThreadStatuses] = useState<{ [key: number]: 'idle' | 'building' | 'completed' }>({});
  const [radarToastVisible, setRadarToastVisible] = useState(false);

  
  // Mock thread history data
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
  const [messages, setMessages] = useState<Message[]>(() => {
    if (fromCanvas && widgetId) {
      return [
        { role: 'user', content: question },
        { role: 'assistant', content: widgetResponseText[widgetId] || 'Here are the details from your canvas:', canvasWidgetId: widgetId }
      ];
    }
    if (radarCard) {
      const { responseText, extras } = getRadarCardMessages(radarCard);
      return [
        { role: 'user', content: question },
        { role: 'assistant', content: responseText, ...extras } as Message
      ];
    }
    if (question.toLowerCase().includes('revenue growth')) {
      return [
        { role: 'user', content: question },
        { role: 'assistant', content: "Here's your revenue growth analysis — tracking monthly trends, year-over-year comparisons, and key growth drivers.", metricsCharts: 'revenue' }
      ];
    }
    return [
      { role: 'user', content: question },
      { role: 'assistant', content: '', showResearch: true }
    ];
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  
  // Detect if the question is about sending an email or message
  const detectEmailMessage = (text: string): { isEmail: boolean; isMessage: boolean; data?: any } => {
    const lowerText = text.toLowerCase();
    
    // Check for message (but not email)
    if (lowerText.includes('send') && lowerText.includes('message') && !lowerText.includes('email')) {
      return {
        isEmail: false,
        isMessage: true,
        data: {
          type: 'message',
          subject: 'Quick update on API integration',
          from: 'JT (You)',
          to: '@Alex Rivera',
          body: `Hey Alex, just wanted to check in on the API integration. The client asked if we're still on track for the Thursday demo. No pressure if things shifted - just want to give them an accurate update.`
        }
      };
    }
    
    // Check for email
    if (lowerText.includes('send') && lowerText.includes('email')) {
      return {
        isEmail: true,
        isMessage: false,
        data: {
          type: 'email',
          subject: 'Updated proposal attached',
          from: 'sarah.mitchell@acme.co',
          to: [
            'marcus.chen@acme.co',
            'jessica.wong@acme.co',
            'david.park@acme.co',
            'emily.rodriguez@acme.co',
            'john.smith@acme.co',
            'lisa.thompson@acme.co',
            'robert.johnson@acme.co',
            'maria.garcia@acme.co',
            'kevin.lee@acme.co',
            'nicole.brown@acme.co',
            'steven.miller@acme.co',
            'amanda.davis@acme.co'
          ],
          body: `Hi Marcus,

I've attached the revised proposal with the changes we discussed. The new timeline reflects the Q2 launch date, and I've adjusted the budget breakdown in section 3.

Our team has reviewed the following key areas:
- Project scope and deliverables for the upcoming quarter
- Resource allocation across all departments
- Risk assessment and mitigation strategies
- Budget considerations and cost optimization opportunities
- Timeline milestones and critical path dependencies

The proposal includes updated sections on market analysis, competitive positioning, and go-to-market strategy. I've also incorporated feedback from the stakeholder review session last week.

Please review the attached documents at your earliest convenience. We should discuss the implementation timeline before our meeting with the executive team next Tuesday.

If you need any clarification on specific sections or would like to schedule a call to walk through the changes, I'm available Monday afternoon or Tuesday morning.

Looking forward to your feedback.

Best,
Sarah`
        }
      };
    }
    
    return { isEmail: false, isMessage: false };
  };
  
  // Detect if the question is about creating a checklist
  const detectChecklist = (text: string): { isChecklist: boolean; data?: any } => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('checklist') || (lowerText.includes('create') && lowerText.includes('list'))) {
      return {
        isChecklist: true,
        data: {
          title: 'Pre-Installation Roof Inspection',
          items: [
            { id: '1', text: 'Inspect roof deck for structural damage or rot', completed: false },
            { id: '2', text: 'Check all flashings around chimneys and vents', completed: false },
            { id: '3', text: 'Verify proper attic ventilation is in place', completed: false },
            { id: '4', text: 'Document existing damage with photos', completed: false },
            { id: '5', text: 'Measure roof pitch and confirm materials needed', completed: false },
            { id: '6', text: 'Review building codes and permit requirements', completed: false },
            { id: '7', text: 'Schedule waste removal and delivery of materials', completed: false },
          ]
        }
      };
    }
    
    return { isChecklist: false };
  };
  
  // Detect if the question is about overdue invoices / DSO
  const detectOverdueInvoices = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return (lowerText.includes('overdue') && lowerText.includes('invoice')) ||
           (lowerText.includes('dso')) ||
           (lowerText.includes('days sales outstanding')) ||
           (lowerText.includes('overdue') && lowerText.includes('payment'));
  };

  // Detect if the question is about building an overdue invoices page
  const detectInvoicePageBuilder = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return (lowerText.includes('overdue') && lowerText.includes('invoice') && lowerText.includes('page'));
  };

  // Detect if the question is about building a page
  const detectPageBuilder = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    // Exclude invoice page builder from generic page builder
    if (detectInvoicePageBuilder(text)) return false;
    return (lowerText.includes('build') && lowerText.includes('page')) ||
           (lowerText.includes('create') && lowerText.includes('page')) ||
           lowerText.includes('page builder') ||
           (lowerText.includes('build') && lowerText.includes('website')) ||
           (lowerText.includes('create') && lowerText.includes('landing page'));
  };

  // Detect if the question asks for a confirmation
  const detectActionConfirmation = (text: string): { isActionConfirmation: boolean; data?: any } => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('ask for a confirmation') || lowerText.includes('ask for confirmation')) {
      return {
        isActionConfirmation: true,
        data: {
          action: 'Should I proceed with this action?',
          details: 'This will update your records in the system.'
        }
      };
    }
    
    return { isActionConfirmation: false };
  };

  // Detect if the question is about performance, metrics, or analytics
  const detectMetricsQuery = (text: string): { isMetrics: boolean; variant: 'full' | 'team' | 'revenue' | 'jobs' } => {
    const lower = text.toLowerCase();
    
    // Team-specific
    if ((lower.includes('team') || lower.includes('crew') || lower.includes('staff') || lower.includes('employee')) &&
        (lower.includes('performance') || lower.includes('metric') || lower.includes('how') || lower.includes('doing') || lower.includes('report') || lower.includes('stats') || lower.includes('analytics') || lower.includes('analysis'))) {
      return { isMetrics: true, variant: 'team' };
    }
    
    // Revenue-specific
    if ((lower.includes('revenue') || lower.includes('income') || lower.includes('earnings') || lower.includes('sales') || lower.includes('financial')) &&
        (lower.includes('performance') || lower.includes('metric') || lower.includes('trend') || lower.includes('report') || lower.includes('how') || lower.includes('stats') || lower.includes('analytics') || lower.includes('breakdown') || lower.includes('analysis'))) {
      return { isMetrics: true, variant: 'revenue' };
    }
    
    // Jobs-specific
    if ((lower.includes('job') || lower.includes('project') || lower.includes('work order')) &&
        (lower.includes('performance') || lower.includes('metric') || lower.includes('status') || lower.includes('stats') || lower.includes('analytics') || lower.includes('report') || lower.includes('how') || lower.includes('analysis'))) {
      return { isMetrics: true, variant: 'jobs' };
    }
    
    // General performance / metrics / analytics / dashboard / KPI
    if (lower.includes('performance') || lower.includes('metrics') || lower.includes('analytics') || 
        lower.includes('dashboard') || lower.includes('kpi') || lower.includes('key indicators') ||
        lower.includes('how is my business') || lower.includes('business health') || lower.includes('business doing') ||
        lower.includes('overview of my business') || lower.includes('show me stats') ||
        lower.includes('how are we doing') || lower.includes('overall performance') || lower.includes('business report') ||
        (lower.includes('show') && lower.includes('graph')) || (lower.includes('show') && lower.includes('chart'))) {
      return { isMetrics: true, variant: 'full' };
    }
    
    return { isMetrics: false, variant: 'full' };
  };
  
  // Detect if the question is about creating a module
  const detectModuleCreation = (text: string): { isCreation: boolean; moduleType?: ModuleType; data?: any } => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('create') && lowerText.includes('job')) {
      return {
        isCreation: true,
        moduleType: 'job',
        data: {
          fields: [
            { label: 'Title', value: 'Roof Replacement - Main St', highlight: true },
            { label: 'Customer', value: 'John Smith' },
            { label: 'Organization', value: 'Smith Property Group' },
            { label: 'Scheduled', value: 'Feb 24, 2026 at 9:00 AM' },
            { label: 'Technician', value: 'Mike Johnson' },
            { label: 'Priority', value: 'High', highlight: true },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('customer')) {
      return {
        isCreation: true,
        moduleType: 'customer',
        data: {
          fields: [
            { label: 'Name', value: 'Sarah Mitchell', highlight: true },
            { label: 'Phone', value: '+1 (555) 234-5678' },
            { label: 'Email', value: 'sarah.mitchell@email.com' },
            { label: 'Organization', value: 'Mitchell Enterprises' },
            { label: 'Status', value: 'Active' },
          ]
        }
      };
    } else if (lowerText.includes('create') && (lowerText.includes('organization') || lowerText.includes('organisation'))) {
      return {
        isCreation: true,
        moduleType: 'organization',
        data: {
          fields: [
            { label: 'Name', value: 'Acme Construction Ltd.', highlight: true },
            { label: 'Primary Contact', value: 'Robert Chen' },
            { label: 'Phone', value: '+1 (555) 987-6543' },
            { label: 'Address', value: '123 Business Ave, San Francisco, CA 94105' },
            { label: 'Type', value: 'Commercial' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('quote')) {
      return {
        isCreation: true,
        moduleType: 'quote',
        data: {
          fields: [
            { label: 'Quote ID', value: 'QT-2026-0847', highlight: true },
            { label: 'Customer', value: 'Emily Rodriguez' },
            { label: 'Amount', value: '$12,450.00', highlight: true },
            { label: 'Valid Until', value: 'March 17, 2026' },
            { label: 'Items', value: '8 line items' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('invoice')) {
      return {
        isCreation: true,
        moduleType: 'invoice',
        data: {
          fields: [
            { label: 'Invoice ID', value: 'INV-2026-1234', highlight: true },
            { label: 'Customer', value: 'David Park' },
            { label: 'Amount', value: '$8,750.00', highlight: true },
            { label: 'Due Date', value: 'March 3, 2026' },
            { label: 'Status', value: 'Sent' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('project')) {
      return {
        isCreation: true,
        moduleType: 'project',
        data: {
          fields: [
            { label: 'Name', value: 'Commercial Building Renovation', highlight: true },
            { label: 'Category', value: 'Commercial Roofing' },
            { label: 'Schedule', value: 'March 1 - June 30, 2026' },
            { label: 'Priority', value: 'High', highlight: true },
            { label: 'Customer', value: 'ABC Corporation' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('property')) {
      return {
        isCreation: true,
        moduleType: 'property',
        data: {
          fields: [
            { label: 'Property Name', value: '789 Oak Street, Springfield', highlight: true },
            { label: 'Owner', value: 'Michael Chen' },
            { label: 'Property Type', value: 'Commercial' },
            { label: 'Access Notes', value: 'Gate code: 1234. Contact security.' },
            { label: 'Status', value: 'Active' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('vendor')) {
      return {
        isCreation: true,
        moduleType: 'vendor',
        data: {
          fields: [
            { label: 'Vendor Name', value: 'Superior Roofing Supplies', highlight: true },
            { label: 'Contact Person', value: 'James Wilson' },
            { label: 'Phone', value: '+1 (555) 456-7890' },
            { label: 'Email', value: 'james@superiorroofing.com' },
            { label: 'Service Category', value: 'Materials Supplier' },
            { label: 'Status', value: 'Preferred', highlight: true },
          ]
        }
      };
    } else if (lowerText.includes('create') && (lowerText.includes('material request') || lowerText.includes('material'))) {
      return {
        isCreation: true,
        moduleType: 'material request',
        data: {
          fields: [
            { label: 'Request Title', value: 'Asphalt Shingles - 20 Squares', highlight: true },
            { label: 'Requested By', value: 'Tom Anderson' },
            { label: 'Related Job/Project', value: 'Roof Replacement - Main St' },
            { label: 'Priority', value: 'High', highlight: true },
            { label: 'Needed By', value: 'Feb 24, 2026' },
            { label: 'Status', value: 'Pending' },
          ]
        }
      };
    } else if (lowerText.includes('create') && (lowerText.includes('part') || lowerText.includes('parts'))) {
      return {
        isCreation: true,
        moduleType: 'part',
        data: {
          fields: [
            { label: 'Part Name', value: 'Ridge Cap Shingles', highlight: true },
            { label: 'SKU/Code', value: 'RCS-2024' },
            { label: 'Category', value: 'Roofing Materials' },
            { label: 'Stock Quantity', value: '50 units' },
            { label: 'Reorder Level', value: '10 units' },
            { label: 'Unit Cost', value: '$28.50' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('service')) {
      return {
        isCreation: true,
        moduleType: 'service',
        data: {
          fields: [
            { label: 'Service Name', value: 'Emergency Roof Repair', highlight: true },
            { label: 'Category', value: 'Emergency Services' },
            { label: 'Duration', value: '2-4 hours' },
            { label: 'Price', value: '$450.00', highlight: true },
            { label: 'Assigned Team', value: 'Emergency Response' },
            { label: 'Availability', value: 'Available' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('contract')) {
      return {
        isCreation: true,
        moduleType: 'contract',
        data: {
          fields: [
            { label: 'Contract Name', value: 'Annual Maintenance Agreement', highlight: true },
            { label: 'Customer/Org', value: 'Tech Park Plaza' },
            { label: 'Start Date', value: 'March 1, 2026' },
            { label: 'End Date', value: 'February 28, 2027' },
            { label: 'Contract Value', value: '$24,000.00', highlight: true },
            { label: 'Status', value: 'Active' },
          ]
        }
      };
    } else if (lowerText.includes('create') && lowerText.includes('asset')) {
      return {
        isCreation: true,
        moduleType: 'asset',
        data: {
          fields: [
            { label: 'Asset Name', value: 'Pneumatic Nail Gun Pro 3000', highlight: true },
            { label: 'Asset Type', value: 'Power Tool' },
            { label: 'Location', value: 'Main Warehouse' },
            { label: 'Assigned To', value: 'Crew Team A' },
            { label: 'Serial Number', value: 'PNG-3000-2024-0123' },
            { label: 'Status', value: 'Active' },
          ]
        }
      };
    }
    
    return { isCreation: false };
  };
  
  // Mock research data - dynamically adjust based on prompt
  const getResearchTopics = () => {
    const isCreation = detectModuleCreation(question).isCreation;
    const emailMessageData = detectEmailMessage(question);
    const isEmail = emailMessageData.isEmail;
    const isMessage = emailMessageData.isMessage;
    const isChecklist = detectChecklist(question).isChecklist;
    const isOverdue = detectOverdueInvoices(question);
    const isInvoicePage = detectInvoicePageBuilder(question);
    const metricsData = detectMetricsQuery(question);
    
    if (isInvoicePage) {
      return [
        {
          id: 'invoices-query',
          title: 'Querying overdue invoices',
          status: 'completed' as const,
          steps: [
            {
              id: '1',
              text: 'Accessing Invoices module — filtering for overdue and past-due status',
              icon: 'database' as const
            },
            {
              id: '2',
              text: 'Found 10 overdue invoices totaling $3,868,950 across multiple customers',
              icon: 'dot' as const
            }
          ]
        },
        {
          id: 'page-build',
          title: 'Building invoices page',
          status: 'completed' as const,
          steps: [
            {
              id: '3',
              text: 'Generating invoice list view with search, filters, and status indicators',
              icon: 'globe' as const,
              tags: ['invoice-list', 'detail-view']
            },
            {
              id: '4',
              text: 'Building invoice detail panel with line items, totals, and send email CTA',
              icon: 'zap' as const
            }
          ]
        }
      ];
    }

    if (isOverdue) {
      return [
        {
          id: 'invoices',
          title: 'Querying invoices',
          status: 'completed' as const,
          steps: [
            {
              id: '1',
              text: 'Accessing Invoices module — filtering for overdue status',
              icon: 'database' as const
            },
            {
              id: '2',
              text: 'Found 14 invoices past due date across 9 customers',
              icon: 'dot' as const
            }
          ]
        },
        {
          id: 'dso',
          title: 'Calculating DSO metrics',
          status: 'completed' as const,
          steps: [
            {
              id: '3',
              text: 'Computing Days Sales Outstanding trend over 8-month window',
              icon: 'globe' as const,
              tags: ['accounts-receivable', 'collections']
            },
            {
              id: '4',
              text: 'Benchmarking against industry average (45 days) — your DSO is 72 days',
              icon: 'zap' as const
            }
          ]
        }
      ];
    }
    
    if (isChecklist) {
      // Research steps for checklist creation
      return [
        {
          id: 'analyzing',
          title: 'Analyzing requirements',
          status: 'completed' as const,
          steps: [
            {
              id: '1',
              text: 'Understanding task scope and workflow needs',
              icon: 'lock' as const
            },
            {
              id: '2',
              text: 'Identifying critical steps and dependencies',
              icon: 'database' as const
            }
          ]
        },
        {
          id: 'building',
          title: 'Building checklist',
          status: 'completed' as const,
          steps: [
            {
              id: '3',
              text: 'Organizing items by priority and sequence',
              icon: 'globe' as const
            },
            {
              id: '4',
              text: 'Checklist ready for use',
              icon: 'zap' as const
            }
          ]
        }
      ];
    }
    
    if (isEmail || isMessage) {
      // Research steps for email/message sending
      const messageType = isMessage ? 'message' : 'email';
      return [
        {
          id: 'drafting',
          title: 'Drafting message',
          status: 'completed' as const,
          steps: [
            {
              id: '1',
              text: 'Analyzing context and extracting key information',
              icon: 'lock' as const
            },
            {
              id: '2',
              text: `Composing professional ${messageType} with appropriate tone`,
              icon: 'database' as const,
              tags: isMessage ? ['@Alex Rivera'] : ['sarah.mitchell@acme.co']
            }
          ]
        },
        {
          id: 'validation',
          title: 'Validating recipients',
          status: 'completed' as const,
          steps: [
            {
              id: '3',
              text: `Verifying ${messageType === 'message' ? 'recipient' : 'email addresses'} and contact information`,
              icon: 'globe' as const
            },
            {
              id: '4',
              text: 'Message ready to send',
              icon: 'zap' as const
            }
          ]
        }
      ];
    }
    
    if (metricsData.isMetrics && !isCreation) {
      const variantLabels: Record<string, string> = {
        'full': 'business performance',
        'team': 'team performance',
        'revenue': 'revenue analytics',
        'jobs': 'job analytics',
      };
      return [
        {
          id: 'metrics-data',
          title: `Gathering ${variantLabels[metricsData.variant]} data`,
          status: 'completed' as const,
          steps: [
            {
              id: '1',
              text: 'Accessing Jobs, Quotes, and Invoices modules for performance data',
              icon: 'database' as const,
              tags: ['jobs', 'quotes', 'invoices']
            },
            {
              id: '2',
              text: 'Pulling team activity logs and crew completion records',
              icon: 'users' as const,
              tags: ['crew-a', 'crew-b', 'crew-c', 'crew-d']
            }
          ]
        },
        {
          id: 'metrics-analysis',
          title: 'Analyzing trends',
          status: 'completed' as const,
          steps: [
            {
              id: '3',
              text: 'Computing revenue trends, job distribution, and crew performance scores',
              icon: 'globe' as const
            },
            {
              id: '4',
              text: 'Generating visual charts and performance dashboard',
              icon: 'zap' as const
            }
          ]
        }
      ];
    }

    if (isCreation) {
      // Research steps for module creation
      return [
        {
          id: 'validation',
          title: 'Validating input',
          status: 'completed' as const,
          steps: [
            {
              id: '1',
              text: 'Checking required fields and data integrity',
              icon: 'lock' as const
            },
            {
              id: '2',
              text: 'Validating customer information and organization linkage',
              icon: 'database' as const,
              tags: ['john.smith@zuper.com']
            }
          ]
        },
        {
          id: 'creation',
          title: 'Creating record',
          status: 'completed' as const,
          steps: [
            {
              id: '3',
              text: 'Generating unique identifier and setting up record structure',
              icon: 'globe' as const
            },
            {
              id: '4',
              text: 'Associating with relevant modules and updating cross-references',
              icon: 'users' as const,
              tags: ['Customer', 'Organization']
            },
            {
              id: '5',
              text: 'Successfully created and persisted to database',
              icon: 'zap' as const
            }
          ]
        }
      ];
    }
    
    // Default research topics for analysis queries
    return [
      {
        id: 'data-gathering',
        title: 'Accessing modules',
        status: 'completed' as const,
        steps: [
          {
            id: '1',
            text: 'Accessing Jobs module',
            icon: 'lock' as const
          },
          {
            id: '2',
            text: 'Querying job records for last year\'s performance data across all teams',
            icon: 'database' as const,
            tags: ['john.smith@zuper.com', 'sarah.johnson@zuper.com']
          }
        ]
      },
      {
        id: 'analysis',
        title: 'Analyzing data',
        status: 'completed' as const,
        steps: [
          {
            id: '3',
            text: 'Accessing Customer module to correlate job completion with customer satisfaction scores',
            icon: 'globe' as const,
            tags: ['mike.chen@zuper.com', 'emma.wilson@zuper.com', '2 more']
          },
          {
            id: '4',
            text: 'Found 964 total jobs across all departments. Breaking down by status: 1 completed, 963 with other statuses (in progress, pending, cancelled).',
            icon: 'dot' as const
          },
          {
            id: '5',
            text: 'Calculating completion metrics. The completion rate of 0.104% is significantly below industry standards (85-95%). This indicates potential process bottlenecks.',
            icon: 'dot' as const
          },
          {
            id: '6',
            text: 'Cross-referencing with Organisation module to identify team workload distribution patterns',
            icon: 'users' as const,
            tags: ['james.brown@zuper.com']
          }
        ]
      },
      {
        id: 'quotes',
        title: 'Checking quotes',
        status: 'completed' as const,
        steps: [
          {
            id: '7',
            text: 'Accessing Quotes module to analyze conversion rates and identify bottlenecks in the sales pipeline',
            icon: 'globe' as const,
            tags: ['lisa.anderson@zuper.com', 'robert.davis@zuper.com']
          },
          {
            id: '8',
            text: 'Identified key areas for improvement: workflow optimization, job status tracking accuracy, and team resource allocation.',
            icon: 'zap' as const
          }
        ]
      }
    ];
  };

  const mockResearchTopics = getResearchTopics();
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle thread switching
  const handleThreadSwitch = (threadId: number) => {
    if ((isPageBuilderOpen || isInvoicePageBuilderOpen) && threadId !== activeThreadId) {
      // Mark the thread we're leaving as building
      setThreadStatuses(prev => ({
        ...prev,
        [activeThreadId]: 'building'
      }));

      // Simulate completion after 5 seconds for the thread we just left
      const currentThread = activeThreadId;
      setTimeout(() => {
        setThreadStatuses(prev => ({
          ...prev,
          [currentThread]: 'completed'
        }));
      }, 5000);
    }
    setActiveThreadId(threadId);
  };
  
  const handleSaveRename = () => {
    if (tempChatName.trim()) {
      setChatName(tempChatName.trim());
      setIsRenameModalOpen(false);
    }
  };
  
  const handleCancelRename = () => {
    setTempChatName(chatName);
    setIsRenameModalOpen(false);
  };
  
  const handleOpenRename = () => {
    setTempChatName(chatName);
    setIsRenameModalOpen(true);
  };
  
  const handleStartEdit = () => {
    setEditedName(chatName);
    setIsEditingName(true);
  };
  
  const handleSaveEdit = () => {
    if (editedName.trim()) {
      setChatName(editedName.trim());
    }
    setIsEditingName(false);
  };
  
  const handleCancelEdit = () => {
    setEditedName(chatName);
    setIsEditingName(false);
  };
  
  const openEmailEditor = (emailData: { type: 'email' | 'message'; subject: string; from: string; to: string | string[]; body: string }) => {
    const toStr = Array.isArray(emailData.to) ? emailData.to.join(', ') : emailData.to;
    setEmailEditorData({
      subject: emailData.subject,
      to: toStr,
      body: emailData.body,
      type: emailData.type
    });
    setIsEmailEditorOpen(true);
  };

  const handleAddToRadar = (cardData: Omit<SavedCard, 'id' | 'timestamp'>) => {
    const targetRadar = radars.find(r => r.id === activeRadarId) || radars[0];
    if (targetRadar) {
      addCardToRadar(targetRadar.id, { ...cardData, sourceThreadId: activeThreadId });
    }
  };

  const handleAddToRadarComplete = () => {
    setRadarToastVisible(true);
    setTimeout(() => setRadarToastVisible(false), 3000);
  };

  const handleViewInRadar = () => {
    onViewChange?.('radar');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setUploadedImageName(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleSendMessage = () => {
    if (!message.trim() && !uploadedImage) return;

    // Add user message
    const userMessage = message.trim();
    const lowerMessage = userMessage.toLowerCase();
    const currentImage = uploadedImage;

    // Detect if user wants to preview something
    if (lowerMessage.includes('preview') && !isPreviewMode) {
      setIsPreviewMode(true);
    }

    setMessages(prev => [...prev, { role: 'user', content: userMessage, imageUrl: currentImage || undefined }]);
    setMessage('');
    setUploadedImage(null);
    setUploadedImageName(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    
    // Stop listening if active
    if (isListening) {
      setIsListening(false);
    }
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      // Detect chart building from uploaded image
      const isBuildChart = currentImage && (lowerMessage.includes('chart') || lowerMessage.includes('graph') || lowerMessage.includes('build') || lowerMessage.includes('create') || lowerMessage.includes('generate'));
      if (isBuildChart) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I've analyzed the image and built a chart based on the data pattern. Here's your generated chart:",
          generatedChart: true
        }]);
        return;
      }
      if (detectInvoicePageBuilder(userMessage)) {
        // Trigger invoice page builder
        setIsInvoicePageBuilderLoading(true);
        setTimeout(() => {
          setIsInvoicePageBuilderLoading(false);
          setIsInvoicePageBuilderOpen(true);
          setInvoicePageBuilderWasOpened(true);
        }, 3000);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I've built your overdue invoices page with a list of all past-due invoices on the left and a detailed invoice view on the right. You can click any invoice to see its full details, and use the **Send Email** button to follow up with customers directly."
        }]);
      } else if (detectOverdueInvoices(userMessage)) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "I've analyzed your invoice collection data. Your Days Sales Outstanding (DSO) has been trending upward over the past 8 months, now sitting at **72 days** — well above the industry average of 45 days. You currently have **14 overdue invoices** totaling **$127,400** in outstanding receivables.\n\nHere's the DSO trend breakdown:",
          dsoChart: true
        }]);
      } else if (detectEmailMessage(userMessage).isEmail || detectEmailMessage(userMessage).isMessage) {
        const emailData = detectEmailMessage(userMessage);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: emailData.isEmail
            ? "I've drafted an email for you. Please review the content below before sending:"
            : "I've drafted a message for you. Please review the content below before sending:",
          emailCard: emailData.data
        }]);
      } else {
        // Check for metrics/performance queries
        const metricsResult = detectMetricsQuery(userMessage);
        if (metricsResult.isMetrics) {
          const variantMessages: Record<string, string> = {
            'full': "Here's an updated overview of your business performance across all key areas:",
            'team': "Here's your team performance breakdown with crew-level analytics:",
            'revenue': "Here's your revenue analytics with trends and comparisons:",
            'jobs': "Here's your job analytics dashboard with category breakdowns:",
          };
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: variantMessages[metricsResult.variant] || variantMessages['full'],
            metricsCharts: metricsResult.variant
          }]);
        } else {
          // Generate a contextual follow-up response based on keywords
          const response = generateFollowUpResponse(userMessage);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: response
          }]);
        }
      }
    }, 1000);
  };

  const generateFollowUpResponse = (text: string): string => {
    const lower = text.toLowerCase();

    // Note: metrics-specific queries (with "performance", "metrics", etc.) are already 
    // handled by detectMetricsQuery before this function is called.
    // These responses are for simpler queries without explicit performance keywords.
    
    if (lower.includes('revenue') || lower.includes('income') || lower.includes('earnings') || lower.includes('sales')) {
      return "Here's a quick revenue snapshot: Total revenue this quarter is **$847,300**, up **12.4%** from last quarter. Your top-performing service line is **Commercial Re-roofing** at $312K, followed by **Residential Repairs** at $198K. Would you like a detailed breakdown by month or service category?";
    }
    if (lower.includes('team') || lower.includes('crew') || lower.includes('staff') || lower.includes('employee')) {
      return "Your team currently has **18 active members** across 4 crews. Crew A is leading with a **94% job completion rate**, while Crew C has dropped to **78%** — mainly due to 2 members out on leave. I'd recommend redistributing their upcoming jobs to Crews A and B. Want me to draft a reassignment plan?";
    }
    if (lower.includes('job') || lower.includes('project') || lower.includes('work order')) {
      return "You have **47 active jobs** right now. **12 are on track**, **28 are in progress**, and **7 are flagged as at-risk** due to scheduling conflicts or material delays. The biggest bottleneck is the **North Ave commercial project** — it's 3 days behind schedule. Should I dig into the at-risk jobs?";
    }
    if (lower.includes('customer') || lower.includes('client') || lower.includes('satisfaction')) {
      return "Customer satisfaction is sitting at an **NPS of 72**, up 5 points from last quarter. You received **14 five-star reviews** this month, mostly praising response time. However, there are **3 open complaints** — 2 related to scheduling delays and 1 about material quality. Want me to pull up the complaint details?";
    }
    if (lower.includes('quote') || lower.includes('estimate') || lower.includes('bid')) {
      return "You currently have **23 open quotes** totaling **$412,500** in potential revenue. **8 quotes** are older than 14 days and at risk of going cold. Your quote-to-close rate this quarter is **34%**, which is slightly below the industry average of **40%**. Would you like me to identify the stale quotes so you can follow up?";
    }
    if (lower.includes('schedule') || lower.includes('calendar') || lower.includes('upcoming')) {
      return "Here's your schedule overview: **6 jobs** are scheduled for this week across all crews. Monday and Tuesday are fully booked, but Wednesday afternoon has a **2-hour gap** for Crew B. There's also a weather advisory for Thursday that might impact the **Elm Street roof replacement**. Want me to suggest rescheduling options?";
    }
    if (lower.includes('material') || lower.includes('inventory') || lower.includes('supply') || lower.includes('stock')) {
      return "Inventory check: You're running low on **architectural shingles** (12 squares remaining — about 2 jobs' worth) and **ridge cap** (estimated 3-day supply). Your last order from Superior Roofing Supplies was delivered on Feb 28. I'd recommend placing a reorder this week to avoid delays. Should I draft a material request?";
    }
    if (lower.includes('compare') || lower.includes('vs') || lower.includes('versus') || lower.includes('last month') || lower.includes('last quarter') || lower.includes('trend')) {
      return "Comparing this month to last: Revenue is up **8%** ($289K vs $267K), job volume increased by **3 jobs**, and average ticket size grew from **$6,200 to $6,850**. The main driver was 2 large commercial contracts. However, your overhead costs also rose **5%** due to material price increases. Want a deeper dive into any of these metrics?";
    }
    if (lower.includes('help') || lower.includes('what can you') || lower.includes('how do')) {
      return "I can help you with a wide range of tasks:\n\n• **Business analytics** — revenue, performance metrics, trends\n• **Job management** — schedules, status updates, crew assignments\n• **Customer insights** — satisfaction scores, open complaints, follow-ups\n• **Financial tracking** — invoices, quotes, DSO analysis\n• **Team management** — workload distribution, availability, performance\n• **Create records** — jobs, customers, quotes, invoices, and more\n\nJust ask naturally, like \"How's my revenue this quarter?\" or \"Create a new job for tomorrow.\"";
    }
    // Default contextual response
    return `Good question. Based on your current data, here's what I found:\n\nYour business is tracking **$847K in quarterly revenue** with **47 active jobs** and **18 team members**. The overall trajectory is positive, though there are a few areas worth attention — specifically **7 at-risk jobs** and **3 customer complaints** that could use follow-up.\n\nWould you like me to focus on any specific area, or should I pull up a detailed breakdown?`;
  };
  
  // Simulated dictation - in real app, this would use Web Speech API
  useEffect(() => {
    if (isListening) {
      const phrases = [
        "How many jobs did we complete last month?",
        "What's the average revenue per job?",
        "Show me the team performance metrics.",
        "Which projects are overdue?",
        "Give me a summary of pending quotes."
      ];
      
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        if (currentIndex < randomPhrase.length) {
          setMessage(randomPhrase.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          // Don't auto-stop listening - user must click again
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isListening]);
  
  const toggleDictation = () => {
    if (!isListening) {
      setMessage('');
      setIsListening(true);
    } else {
      setIsListening(false);
    }
  };

  const handleResearchComplete = useCallback(() => {
    const creationData = detectModuleCreation(question);
    const checklistData = detectChecklist(question);
    const actionConfirmationData = detectActionConfirmation(question);
    const emailMessageData = detectEmailMessage(question);
    const isOverdueInvoices = detectOverdueInvoices(question);
    const isPageBuilder = detectPageBuilder(question);
    const isInvoicePage = detectInvoicePageBuilder(question);
    const metricsQueryData = detectMetricsQuery(question);
    
    // Open invoice page builder if detected
    if (isInvoicePage) {
      setIsInvoicePageBuilderLoading(true);
      setTimeout(() => {
        setIsInvoicePageBuilderLoading(false);
        setIsInvoicePageBuilderOpen(true);
        setInvoicePageBuilderWasOpened(true);
      }, 3000);
    }
    // Open page builder if detected
    else if (isPageBuilder) {
      setIsPageBuilderLoading(true);
      // Show loading state for 3 seconds before showing the page builder
      setTimeout(() => {
        setIsPageBuilderLoading(false);
        setIsPageBuilderOpen(true);
        setPageBuilderWasOpened(true);
      }, 3000);
    }
    
    // Update chat name based on the entity being created
    if (creationData.isCreation && creationData.data?.fields) {
      // Find the name/title field (usually the first highlighted field or first field)
      const nameField = creationData.data.fields.find((f: DetailField) => 
        f.label.toLowerCase().includes('name') || 
        f.label.toLowerCase().includes('title') ||
        f.highlight
      ) || creationData.data.fields[0];
      
      if (nameField) {
        setChatName(nameField.value);
        setEditedName(nameField.value);
        setTempChatName(nameField.value);
      }
    }
    
    // When research completes, add response content
    setTimeout(() => {
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[1]) {
          if (actionConfirmationData.isActionConfirmation) {
            // For action confirmation, show action confirmation card
            newMessages[1] = {
              ...newMessages[1],
              content: `Before I proceed, I want to make sure this is what you want:`,
              actionConfirmationCard: actionConfirmationData.data
            };
          } else if (emailMessageData.isEmail || emailMessageData.isMessage) {
            // For email/message, show email card
            const msgType = emailMessageData.isEmail ? 'email' : 'message';
            newMessages[1] = {
              ...newMessages[1],
              content: emailMessageData.isEmail
                ? `I've drafted an email for you. Please review the content below before sending:`
                : `I've drafted a message for you. Please review the content below before sending:`,
              emailCard: emailMessageData.data
            };
          } else if (checklistData.isChecklist) {
            // For checklist, show checklist card
            newMessages[1] = {
              ...newMessages[1],
              content: `I've created a checklist for you:`,
              checklistCard: checklistData.data
            };
          } else if (isInvoicePage) {
            // For invoice page builder
            newMessages[1] = {
              ...newMessages[1],
              content: "I've built your overdue invoices page with a list of all past-due invoices on the left and a detailed invoice view on the right. You can click any invoice to see its full details, and use the **Send Email** button to follow up with customers directly."
            };
          } else if (isOverdueInvoices) {
            // For overdue invoices, show DSO chart
            newMessages[1] = {
              ...newMessages[1],
              content: "I've analyzed your invoice collection data. Your Days Sales Outstanding (DSO) has been trending upward over the past 8 months, now sitting at **72 days** — well above the industry average of 45 days. You currently have **14 overdue invoices** totaling **$127,400** in outstanding receivables.\n\nHere's the DSO trend breakdown:",
              dsoChart: true
            };
          } else if (creationData.isCreation && creationData.moduleType) {
            // For module creation, show confirmation card
            // Find the entity name from the fields
            const nameField = creationData.data.fields.find((f: DetailField) => 
              f.label.toLowerCase().includes('name') || 
              f.label.toLowerCase().includes('title') ||
              f.highlight
            ) || creationData.data.fields[0];
            
            const entityName = nameField?.value || creationData.moduleType;
            
            newMessages[1] = {
              ...newMessages[1],
              content: `I've successfully created ${entityName}. Here are the details:`,
              confirmationCard: {
                moduleType: creationData.moduleType,
                moduleName: creationData.moduleType.charAt(0).toUpperCase() + creationData.moduleType.slice(1),
                fields: creationData.data.fields
              }
            };
          } else if (isPageBuilder) {
            // For page builder, show relevant message
            newMessages[1] = {
              ...newMessages[1],
              content: "I've built the page for you. Go ahead and customize it based on your preferences using the page builder on the right."
            };
          } else if (metricsQueryData.isMetrics) {
            // For metrics/performance queries, show charts dashboard
            const variantMessages: Record<string, string> = {
              'full': "Here's a comprehensive overview of your business performance. Revenue is up **18.6%** this quarter with **93 jobs completed** across all crews. Your overall business health score is **87/100**.",
              'team': "Here's your team performance breakdown. **Crew A** is leading with a **94% completion rate**, while **Crew C** has dropped to **78%** — mainly due to 2 members on leave. Your team utilization is at **86%**, up 4% from last month.",
              'revenue': "Here's your revenue analytics. Total revenue this quarter is **$347K**, up **18.6%** compared to last quarter. Your average job value has grown to **$9,137**, though your quote close rate dipped slightly to **64%**.",
              'jobs': "Here's your job analytics dashboard. You've completed **93 jobs** this quarter, a **14% increase**. On-time completion rate is **89%**, but there are **7 at-risk jobs** that need attention.",
            };
            newMessages[1] = {
              ...newMessages[1],
              content: variantMessages[metricsQueryData.variant] || variantMessages['full'],
              metricsCharts: metricsQueryData.variant
            };
          } else {
            // Default response for non-creation queries
            newMessages[1] = {
              ...newMessages[1],
              content: "Your team's performance last year saw a total of 964 jobs counted, with only 1 job completed, which yields a job completion percentage of 0%. This minimal completion suggests significant challenges in fulfilling tasks effectively throughout the year, highlighting areas that may need improvement.\n\nNow, I'll present this data visually for a clearer understanding."
            };
          }
        }
        return newMessages;
      });
      // Set research complete to trigger data card display after research collapses
      setTimeout(() => {
        setIsResearchComplete(true);
      }, 1500);
    }, 500);
  }, [question]);

  const conversationHistory = [
    'Team Performance Overview for Last Year',
    'Job Completion Analysis for 2026',
    'Business Analytics Assistant Introduction',
    'Team Performance Overview for Last Year',
    'Overdue Jobs Report',
    'Job Completion Analysis for 2026',
    'Analysis of Growth Trends for 2026',
    'Inquiry on Growth Trends for 2026',
    'Team Performance Overview - 2025',
  ];

  return (
    <div className="flex h-full bg-white">
      {/* Thread History Sidebar - Left Most */}
      <div 
        className={`transition-all duration-300 border-r border-[#E6E8EC] bg-[#FAFAFA] flex-shrink-0 ${
          isThreadHistoryOpen ? 'w-[260px]' : 'w-0'
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* New Thread Button */}
          <div className="px-3 pt-3 pb-3">
            <button className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-[#E8E8E8] rounded-md transition-colors">
              <span className="text-[20px] text-[#1C1E21]">+</span>
              <span className="text-[14px] text-[#1C1E21]">New Thread</span>
            </button>
          </div>
          
          {/* Thread List */}
          <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
            <div className="px-3">
              {threadHistory.map((thread) => {
                const threadStatus = threadStatuses[thread.id];
                const isBuilding = threadStatus === 'building';
                const isCompleted = threadStatus === 'completed';
                
                return (
                  <button
                    key={thread.id}
                    onClick={() => handleThreadSwitch(thread.id)}
                    className={`w-full px-3 py-2.5 text-left rounded-md transition-colors mb-1 group flex items-center gap-2 ${
                      thread.id === activeThreadId ? 'bg-[#E8E8E8]' : 'hover:bg-[#E8E8E8]'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <p className="text-[14px] text-[#1C1E21] truncate flex-1">
                        {thread.title}
                      </p>
                      
                      {/* Building indicator - monochrome animated logo */}
                      {isBuilding && (
                        <div className="flex-shrink-0">
                          <SenseLogo size={16} animated={true} monochrome={true} />
                        </div>
                      )}
                      
                      {/* Completed indicator - red dot */}
                      {isCompleted && !isBuilding && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#EF4444]" />
                      )}
                    </div>
                    
                    {/* Archive icon - only show when not building/completed */}
                    {!isBuilding && !isCompleted && (
                      <Archive className="w-4 h-4 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Everything else */}
      <div className="flex flex-col flex-1 overflow-hidden">
      {/* Top Header - Full Width */}
      <div className="h-[56px] border-b border-[#E6E8EC] flex items-center justify-between px-6 flex-shrink-0 bg-white relative z-10">
        <div className="flex items-center gap-3">
          {/* Chat Expand Icon */}
          <button
            onClick={() => setIsThreadHistoryOpen(!isThreadHistoryOpen)}
            className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150 -ml-2"
            aria-label={isThreadHistoryOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <PanelLeftClose className={`w-[18px] h-[18px] text-[#6B7280] transition-transform duration-200 ${isThreadHistoryOpen ? '' : 'rotate-180'}`} />
          </button>
          
          {/* Separator */}
          <div className="w-px h-[56px] bg-[#E6E8EC]"></div>
          
          {/* Back Arrow */}
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150"
            aria-label="Go back"
          >
            <ArrowLeft className="w-[18px] h-[18px] text-[#6B7280]" />
          </button>
          
          {/* Chat Name */}
          <div className="flex items-center gap-1.5 group/chatname">
            {isEditingName ? (
              <input
                autoFocus
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                onBlur={handleSaveEdit}
                className="text-[15px] font-medium text-[#1C1E21] outline-none rounded-md"
                style={{ width: 360, background: '#FFFFFF', border: '1.5px solid #E6E8EC', padding: '2px 8px', boxShadow: '0 0 0 3px rgba(253,80,0,0.08)' }}
              />
            ) : (
              <>
                <h1 className="text-[15px] font-medium text-[#1C1E21]">{chatName}</h1>
                <button
                  onClick={handleStartEdit}
                  className="opacity-0 group-hover/chatname:opacity-100 transition-opacity duration-150 p-0.5 rounded flex-shrink-0"
                  style={{ lineHeight: 0 }}
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#9CA3AF]" />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Canvas/Chat Switcher */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="inline-flex items-center bg-[#F8F9FB] rounded-lg p-1 gap-1">
            <button
              onClick={() => onViewChange?.('chat')}
              className={`px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200 ${
                activeView === 'chat'
                  ? 'bg-white text-[#1C1E21] shadow-sm'
                  : 'text-[#6B7280] hover:text-[#1C1E21]'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => onViewChange?.('radar')}
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
        
        {/* Beta Label */}
        <div className="flex items-center gap-2">
                  </div>
        
      </div>

      {/* Content Below Header */}
      <div className="flex flex-1 overflow-hidden">
      
      {/* Left Sidebar - Conversation History */}
      <div 
        className={`flex-shrink-0 border-r border-[#E6E8EC] flex flex-col transition-all duration-300 ease-in-out ${ isSidebarCollapsed ? 'w-0 opacity-0' : isConversationsExpanded ? 'w-[260px]' : 'w-[60px]' } bg-white`}
        style={{ 
          overflow: isSidebarCollapsed ? 'hidden' : (isConversationsExpanded ? 'visible' : 'hidden')
        }}
      >
        {/* Logo and Brand */}
        {/* Header with Controls */}
        <div className={`py-3 flex items-center border-b border-[#E6E8EC] transition-all duration-300 ${
          isConversationsExpanded ? 'px-3 justify-between' : 'px-2 justify-center'
        }`}>
          
          
          {/* Collapse Button */}
          <button
            className="p-1.5 rounded-md hover:bg-white transition-colors duration-150 flex-shrink-0"
            aria-label={isConversationsExpanded ? "Collapse conversations" : "Expand conversations"}
            onClick={() => setIsConversationsExpanded(!isConversationsExpanded)}
          >
            {isConversationsExpanded ? (
              <PanelLeftClose className="w-4 h-4 text-[#6B7280]" />
            ) : (
              <PanelLeftOpen className="w-4 h-4 text-[#6B7280]" />
            )}
          </button>
          
          {/* New Thread Button - Right side when expanded */}
          {isConversationsExpanded && (
            <button 
              className="p-1.5 rounded-md hover:bg-white transition-colors duration-150 flex-shrink-0"
              aria-label="Create new thread"
            >
              <Plus className="w-4 h-4 text-[#6B7280]" />
            </button>
          )}
        </div>

        {/* Conversation History List */}
        {isConversationsExpanded && (
          <div className="flex-1 overflow-y-auto px-3 pt-3 pb-3 scrollbar-auto-hide">
            {conversationHistory.map((item, index) => (
              <button
                key={index}
                className={`w-full px-3 py-2.5 text-left text-[13px] transition-colors duration-150 rounded-lg mb-1 ${
                  index === 0
                    ? 'bg-white text-[#1C1E21] font-medium'
                    : 'text-[#6B7280] font-normal hover:bg-white hover:text-[#1C1E21]'
                }`}
              >
                <div className="truncate">{item}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-row transition-all duration-500 ease-in-out">
        {/* Chat Section */}
        <div className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          isPreviewMode 
            ? 'w-[20%] border-r border-[#E6E8EC]' 
            : isPageBuilderOpen || isPageBuilderLoading || isInvoicePageBuilderOpen || isInvoicePageBuilderLoading
            ? 'w-[40%]'
            : isEmailEditorOpen
            ? 'w-[50%]'
            : 'flex-1'
        }`}>
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-white scrollbar-auto-hide" ref={scrollRef}>
          <div className="flex h-full bg-white">
            {/* Main Conversation Area */}
            <div className="flex-1 py-8 px-8">
            <div className="w-full max-w-[720px] mx-auto flex flex-col gap-8">
              {messages.map((msg, index) => (
                <div key={index} className={msg.role === 'user' ? 'flex justify-end' : 'relative flex flex-col group'}>
                  {msg.role === 'user' ? (
                    <div className="inline-block bg-[#F3F4F6] rounded-[16px] px-5 py-3 max-w-[80%]">
                      {msg.imageUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-[#E6E8EC]">
                          <img src={msg.imageUrl} alt="Uploaded" className="max-w-full max-h-[200px] object-contain" />
                        </div>
                      )}
                      <p className="text-[15px] text-[#1C1E21] font-normal whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-6">
                      {/* Research Display - show if this message has research */}
                      {msg.showResearch && index === 1 && (
                        <div className="mb-6">
                          <ResearchDisplay 
                            topics={mockResearchTopics} 
                            isActive={true}
                            onComplete={handleResearchComplete}
                            forceCollapse={!!msg.content}
                          />
                        </div>
                      )}
                      
                      {/* Response Text - only show after content is added */}
                      {msg.content && (
                        <>
                          {/* Logo + "Sense" Label */}
                          <div className="flex items-center gap-2 mb-3">
                            <svg width="20" height="20" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                              <rect y="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                              <rect x="15.75" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                              <rect x="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                              <rect x="15.75" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                              <rect y="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                              <rect x="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                              <rect x="31.5" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                              <rect x="31.5" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                            </svg>
                            <span className="text-[14px] font-medium text-[#1C1E21]">Sense</span>
                          </div>
                          
                          <div className="text-[15px] text-[#1C1E21] leading-relaxed space-y-4">
                            {msg.typewriter ? (
                              <p><TypewriterText text={msg.content} speed={18} /></p>
                            ) : (
                              msg.content.split('\n\n').map((paragraph, pIndex) => (
                                <p key={pIndex}>{paragraph}</p>
                              ))
                            )}
                          </div>
                        </>
                      )}

                      {/* Show confirmation card or data cards after research completes */}
                      {index === 1 && isResearchComplete && (
                        <>
                          {msg.canvasWidgetId ? (
                            /* Show Canvas Widget Card */
                            <>
                              <div className="w-full min-w-0">
                                <CanvasWidgetInChat widgetId={msg.canvasWidgetId} />
                              </div>
                              <MessageToolbar onAddToRadarComplete={handleAddToRadarComplete} onViewInRadar={handleViewInRadar} onAddToRadar={() => handleAddToRadar({ type: 'card', content: msg, title: `Canvas: ${msg.canvasWidgetId}`, preview: msg.content.substring(0, 100) })} />
                            </>
                          ) : msg.actionConfirmationCard ? (
                            /* Show Action Confirmation Card */
                            <>
                              <div className="flex justify-start">
                                <ActionConfirmationCard
                                  action={msg.actionConfirmationCard.action}
                                  details={msg.actionConfirmationCard.details}
                                  onConfirm={() => alert('Action confirmed! Proceeding...')}
                                  onCancel={() => alert('Action cancelled.')}
                                />
                              </div>
                              <MessageToolbar />
                            </>
                          ) : msg.checklistCard ? (
                            /* Show Checklist Card */
                            <>
                              <div className="flex justify-start">
                                <ChecklistCard
                                  title={msg.checklistCard.title}
                                  items={msg.checklistCard.items}
                                />
                              </div>
                              <MessageToolbar />
                            </>
                          ) : msg.emailCard ? (
                            /* Show Email/Message Card */
                            <>
                              <div className="flex justify-start">
                                <EmailCard
                                  subject={msg.emailCard.subject}
                                  from={msg.emailCard.from}
                                  to={msg.emailCard.to}
                                  body={msg.emailCard.body}
                                  type={msg.emailCard.type}
                                  onSend={() => console.log('Email/message sent')}
                                  onCancel={() => console.log('Email/message cancelled')}
                                  onOpenEdit={() => openEmailEditor(msg.emailCard!)}
                                />
                              </div>
                              <MessageToolbar />
                            </>
                          ) : msg.confirmationCard ? (
                            /* Show Confirmation Card for module creation */
                            <>
                              <div className="flex justify-start">
                                <ConfirmationCard
                                  moduleType={msg.confirmationCard.moduleType}
                                  moduleName={msg.confirmationCard.moduleName}
                                  fields={msg.confirmationCard.fields}
                                  onViewDetails={() => alert(`View ${msg.confirmationCard?.moduleName} Details`)}
                                  onSecondaryAction={() => alert(`Create Another ${msg.confirmationCard?.moduleName}`)}
                                  secondaryActionLabel="Deny"
                                />
                              </div>
                              <MessageToolbar />
                            </>
                          ) : msg.radarCardView ? (
                            /* Show exact radar card */
                            <>
                              <div className="flex justify-start min-w-0 overflow-hidden">
                                <div className="w-full max-w-[520px] min-w-0">
                                  <RadarCardInChat card={msg.radarCardView} />
                                </div>
                              </div>
                              <MessageToolbar onAddToRadarComplete={handleAddToRadarComplete} onViewInRadar={handleViewInRadar} onAddToRadar={() => handleAddToRadar({ type: 'card', content: msg, title: msg.radarCardView!.title, preview: msg.radarCardView!.preview || msg.radarCardView!.title })} />
                            </>
                          ) : msg.metricsCharts ? (
                            /* Show Metrics Charts Dashboard */
                            <>
                              <div className="flex justify-start min-w-0 overflow-hidden">
                                <div className="w-full min-w-0">
                                  <MetricsChartCards variant={msg.metricsCharts} />
                                </div>
                              </div>
                              <MessageToolbar onAddToRadarComplete={handleAddToRadarComplete} onViewInRadar={handleViewInRadar} onAddToRadar={() => handleAddToRadar({ type: 'card', content: msg, title: 'Metrics Dashboard', preview: msg.content.substring(0, 100) })} />
                            </>
                          ) : msg.generatedChart ? (
                            /* Show Generated Chart from image */
                            <>
                              <div className="flex justify-start min-w-0 overflow-hidden">
                                <div className="w-full min-w-0">
                                  <GeneratedChartCard />
                                </div>
                              </div>
                              <MessageToolbar onAddToRadarComplete={handleAddToRadarComplete} onViewInRadar={handleViewInRadar} onAddToRadar={() => handleAddToRadar({ type: 'chart', content: msg, title: 'Generated Chart', preview: 'Chart built from uploaded image' })} />
                            </>
                          ) : msg.dsoChart ? (
                            /* Show DSO Chart for overdue invoices */
                            <>
                              <div className="flex justify-start min-w-0 overflow-hidden">
                                <div className="w-full max-w-[600px] min-w-0">
                                  <DSOChartCard />
                                  <MessageToolbar hideOnIdle onAddToRadarComplete={handleAddToRadarComplete} onViewInRadar={handleViewInRadar} onAddToRadar={() => handleAddToRadar({ type: 'chart', content: msg, title: 'DSO Chart', preview: 'Days Sales Outstanding trend — Current: 72 days, Industry Avg: 45 days' })} />
                                </div>
                              </div>
                              {/* Trend warning as AI response */}
                              <div className="flex justify-start mt-3">
                                <div className="flex items-start gap-2.5 max-w-[600px]">
                                  <span className="text-[16px] mt-0.5 flex-shrink-0">⚠️</span>
                                  <p className="text-[#1C1E21] leading-relaxed text-[15px]">
                                    DSO has increased <span style={{ fontWeight: 600, color: '#EF4444' }}>60% in 6 months</span> — if this trend continues, collections may fall behind industry standards within <span style={{ fontWeight: 600 }}>2–3 months</span>.
                                  </p>
                                </div>
                              </div>
                              <div className="flex justify-start min-w-0 overflow-hidden mt-3">
                                <div className="w-full max-w-[600px] min-w-0">
                                  <AgentRecommendationCard onHireAgent={() => {
                                  setMessages(prev => [...prev, { role: 'user', content: 'Start the collection assistant agent to bring my DSO down' }]);
                                  setTimeout(() => {
                                    setMessages(prev => [...prev, { role: 'assistant', content: 'The **Collection Assistant Agent** is now active and running. It will automatically follow up on overdue invoices and flag high-risk accounts. You can check its work in progress in **Canvas**.', typewriter: true }]);
                                  }, 1200);
                                }} />
                                </div>
                              </div>
                              <MessageToolbar />
                            </>
                          ) : invoicePageBuilderWasOpened && !isInvoicePageBuilderOpen ? (
                            /* Show Invoice Page Builder Preview Card when builder was opened but is now closed */
                            <>
                              <div className="flex justify-start">
                                <InvoicePageBuilderPreviewCard onClick={() => setIsInvoicePageBuilderOpen(true)} />
                              </div>
                              <MessageToolbar />
                            </>
                          ) : pageBuilderWasOpened && !isPageBuilderOpen ? (
                            /* Show Page Builder Preview Card when builder was opened but is now closed */
                            <>
                              <div className="flex justify-start">
                                <PageBuilderPreviewCard onClick={() => setIsPageBuilderOpen(true)} />
                              </div>
                              <MessageToolbar />
                            </>
                          ) : !isPageBuilderOpen && !pageBuilderWasOpened && !isPageBuilderLoading && !isInvoicePageBuilderOpen && !invoicePageBuilderWasOpened && !isInvoicePageBuilderLoading ? (
                            /* Show Data Cards for analysis queries (but not when page builder is/was open or loading) */
                            <>
                              <div className="bg-white border border-[#E6E8EC] rounded-[20px] overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.06)]">
                                {/* Header */}
                                <div className="px-6 pt-6 pb-5 border-b border-[#E6E8EC]">
                                  <h3 className="text-[16px] font-semibold text-[#1C1E21] mb-0.5">Q4 Performance</h3>
                                  <p className="text-[13px] text-[#6B7280]">October through December 2024</p>
                                </div>
                                
                                {/* Metrics Quadrant Grid */}
                                <div className="grid grid-cols-2">
                                  {/* Total Revenue */}
                                  <div className="relative p-6 border-r border-b border-[#E6E8EC] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/8 via-[#10B981]/3 to-transparent"></div>
                                    <div className="relative">
                                      <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide mb-2">Revenue</p>
                                      <div className="flex items-baseline gap-2 mb-1">
                                        <p className="text-[32px] text-[#1C1E21] leading-none">$847,300</p>
                                      </div>
                                      <span className="text-[12px] font-semibold text-[#10B981]">
                                        +12.4%
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Active Users */}
                                  <div className="relative p-6 border-b border-[#E6E8EC] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/8 via-[#6366F1]/3 to-transparent"></div>
                                    <div className="relative">
                                      <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide mb-2">Active Users</p>
                                      <div className="flex items-baseline gap-2 mb-1">
                                        <p className="text-[32px] text-[#1C1E21] leading-none">25<span className="text-[20px]">k</span></p>
                                      </div>
                                      <span className="text-[12px] font-semibold text-[#10B981]">
                                        +8.2%
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Churn Rate */}
                                  <div className="relative p-6 border-r border-[#E6E8EC] overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#A78BFA]/8 via-[#A78BFA]/3 to-transparent"></div>
                                    <div className="relative">
                                      <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide mb-2">Churn Rate</p>
                                      <div className="flex items-baseline gap-2 mb-1">
                                        <p className="text-[32px] text-[#1C1E21] leading-none">2.1<span className="text-[20px]">%</span></p>
                                      </div>
                                      <span className="text-[12px] font-semibold text-[#10B981]">
                                        ↓ -0.8%
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* NPS Score */}
                                  <div className="relative p-6 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/8 via-[#F59E0B]/3 to-transparent"></div>
                                    <div className="relative">
                                      <p className="text-[11px] text-[#9CA3AF] font-medium uppercase tracking-wide mb-2">NPS Score</p>
                                      <div className="flex items-baseline gap-2 mb-1">
                                        <p className="text-[32px] text-[#1C1E21] leading-none">72</p>
                                      </div>
                                      <span className="text-[12px] font-semibold text-[#10B981]">
                                        +5%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Icons - All in one row */}
                              <MessageToolbar />
                            </>
                          ) : null}
                        </>
                      )}

                      {/* Cards for follow-up messages (index > 1) */}
                      {index > 1 && msg.role === 'assistant' && (
                        <>
                          {msg.emailCard && (
                            <>
                              <div className="flex justify-start">
                                <EmailCard
                                  subject={msg.emailCard.subject}
                                  from={msg.emailCard.from}
                                  to={msg.emailCard.to}
                                  body={msg.emailCard.body}
                                  type={msg.emailCard.type}
                                  onSend={() => console.log('Email/message sent')}
                                  onCancel={() => console.log('Email/message cancelled')}
                                  onOpenEdit={() => openEmailEditor(msg.emailCard!)}
                                />
                              </div>
                              <MessageToolbar />
                            </>
                          )}
                          {msg.metricsCharts && (
                            <>
                              <div className="flex justify-start min-w-0 overflow-hidden">
                                <div className="w-full min-w-0">
                                  <MetricsChartCards variant={msg.metricsCharts} />
                                </div>
                              </div>
                              <MessageToolbar onAddToRadarComplete={handleAddToRadarComplete} onViewInRadar={handleViewInRadar} onAddToRadar={() => handleAddToRadar({ type: 'card', content: msg, title: 'Metrics Dashboard', preview: msg.content.substring(0, 100) })} />
                            </>
                          )}
                          {msg.dsoChart && (
                            <>
                              <div className="flex justify-start min-w-0 overflow-hidden">
                                <div className="w-full max-w-[600px] min-w-0">
                                  <DSOChartCard />
                                  <MessageToolbar hideOnIdle onAddToRadarComplete={handleAddToRadarComplete} onViewInRadar={handleViewInRadar} onAddToRadar={() => handleAddToRadar({ type: 'card', content: msg, title: 'DSO Chart', preview: 'Days Sales Outstanding trend' })} />
                                </div>
                              </div>
                            </>
                          )}
                        </>
                      )}

                      {/* Suggested follow-ups after last assistant message */}
                      {msg.content && index === messages.length - 1 && (
                        <SuggestedFollowups
                          suggestions={getFollowupSuggestions(msg.content, {
                            dsoChart: msg.dsoChart,
                            confirmationCard: msg.confirmationCard,
                            checklistCard: msg.checklistCard,
                            actionConfirmationCard: msg.actionConfirmationCard,
                            canvasWidgetId: msg.canvasWidgetId,
                          })}
                          onSelect={(text) => {
                            setMessages(prev => [...prev, { role: 'user', content: text }]);
                            setTimeout(() => {
                              if (detectInvoicePageBuilder(text)) {
                                setIsInvoicePageBuilderLoading(true);
                                setTimeout(() => {
                                  setIsInvoicePageBuilderLoading(false);
                                  setIsInvoicePageBuilderOpen(true);
                                  setInvoicePageBuilderWasOpened(true);
                                }, 3000);
                                setMessages(prev => [...prev, {
                                  role: 'assistant',
                                  content: "I've built your overdue invoices page with a list of all past-due invoices on the left and a detailed invoice view on the right. You can click any invoice to see its full details, and use the **Send Email** button to follow up with customers directly."
                                }]);
                              } else if (detectOverdueInvoices(text)) {
                                setMessages(prev => [...prev, {
                                  role: 'assistant',
                                  content: "I've analyzed your invoice collection data. Your Days Sales Outstanding (DSO) has been trending upward over the past 8 months, now sitting at **72 days** — well above the industry average of 45 days. You currently have **14 overdue invoices** totaling **$127,400** in outstanding receivables.\n\nHere's the DSO trend breakdown:",
                                  dsoChart: true
                                }]);
                              } else if (detectEmailMessage(text).isEmail || detectEmailMessage(text).isMessage) {
                                const emailData = detectEmailMessage(text);
                                setMessages(prev => [...prev, {
                                  role: 'assistant',
                                  content: emailData.isEmail
                                    ? "I've drafted an email for you. Please review the content below before sending:"
                                    : "I've drafted a message for you. Please review the content below before sending:",
                                  emailCard: emailData.data
                                }]);
                              } else {
                                const metricsResult = detectMetricsQuery(text);
                                if (metricsResult.isMetrics) {
                                  const variantMessages: Record<string, string> = {
                                    'full': "Here's an updated overview of your business performance across all key areas:",
                                    'team': "Here's your team performance breakdown with crew-level analytics:",
                                    'revenue': "Here's your revenue analytics with trends and comparisons:",
                                    'jobs': "Here's your job analytics dashboard with category breakdowns:",
                                  };
                                  setMessages(prev => [...prev, {
                                    role: 'assistant',
                                    content: variantMessages[metricsResult.variant] || variantMessages['full'],
                                    metricsCharts: metricsResult.variant
                                  }]);
                                } else {
                                  const response = generateFollowUpResponse(text);
                                  setMessages(prev => [...prev, {
                                    role: 'assistant',
                                    content: response
                                  }]);
                                }
                              }
                            }, 1000);
                          }}
                        />
                      )}
                    </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* Minimal Input at Bottom - Fixed */}
        <div className="bg-white px-8 py-4 flex-shrink-0 bg-white">
          <div className="w-full max-w-[720px] mx-auto">
            <div className={`w-full bg-white rounded-[20px] border transition-all duration-200 shadow-sm ${
              isListening ? 'border-[#FF6B35]/40 shadow-[0_0_0_3px_rgba(255,107,53,0.1)]' : 'border-[#E6E8EC] hover:border-[#FF6B35]/40 hover:shadow-[0_0_0_3px_rgba(255,107,53,0.1)] focus-within:border-[#FF6B35]/40 focus-within:shadow-[0_0_0_3px_rgba(255,107,53,0.1)]'
            }`}>
              <div className="flex flex-col px-4 py-3 gap-3">
                {/* Image preview */}
                {uploadedImage && (
                  <div className="flex items-center gap-2 px-1">
                    <div className="relative rounded-lg overflow-hidden border border-[#E6E8EC] w-16 h-16 flex-shrink-0">
                      <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover" />
                      <button
                        onClick={removeUploadedImage}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                    <span className="text-[12px] text-[#9CA3AF] truncate">{uploadedImageName}</span>
                  </div>
                )}
                {/* Hidden file input */}
                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {/* First line: Textarea */}
                <textarea
                  placeholder="Send a message..."
                  rows={1}
                  className="w-full bg-transparent text-[#1C1E21] focus:outline-none text-[15px] placeholder:text-[#9CA3AF] resize-none max-h-[120px] leading-[1.5]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  ref={textareaRef}
                />
                
                {/* Second line: Mic and Send buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => imageInputRef.current?.click()}
                      className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#F8F9FB] transition-all duration-200 flex-shrink-0"
                      aria-label="Upload image"
                    >
                      <ImagePlus className="w-[18px] h-[18px] text-[#6B7280]" />
                    </button>
                    <button
                      className={`relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 ${
                        isListening
                          ? 'bg-white mic-pulse'
                          : 'hover:bg-[#F8F9FB]'
                      }`}
                      onClick={toggleDictation}
                    aria-label={isListening ? "Stop dictation" : "Start dictation"}
                  >
                    <style>{`
                      @keyframes pulse-slow {
                        0%, 100% {
                          transform: scale(1);
                          opacity: 0.6;
                        }
                        50% {
                          transform: scale(2.5);
                          opacity: 0;
                        }
                      }
                      .mic-pulse::before {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: 50%;
                        background: rgba(255, 107, 53, 0.5);
                        animation: pulse-slow 3.5s ease-out infinite;
                      }
                      .mic-pulse::after {
                        content: '';
                        position: absolute;
                        inset: 0;
                        border-radius: 50%;
                        background: rgba(255, 107, 53, 0.3);
                        animation: pulse-slow 3.5s ease-out infinite;
                        animation-delay: 1.75s;
                      }
                    `}</style>
                    <Mic className={`w-[18px] h-[18px] relative z-10 ${isListening ? 'text-[#FF6B35]' : 'text-[#6B7280]'}`} />
                    </button>
                  </div>

                  <button
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 flex-shrink-0 ${
                      (message.trim() || uploadedImage)
                        ? 'bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40]'
                        : 'bg-[#E6E8EC] cursor-not-allowed'
                    }`}
                    aria-label="Send message"
                    disabled={!message.trim() && !uploadedImage}
                    onClick={handleSendMessage}
                  >
                    <ArrowUp className={`w-[18px] h-[18px] ${(message.trim() || uploadedImage) ? 'text-white' : 'text-[#9CA3AF]'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Preview Panel - shows when preview mode is active */}
        {isPreviewMode && (
          <div className="flex-1 flex flex-col bg-white transition-all duration-500 ease-in-out">
            {/* Modern PDF Preview */}
            <ModernPDFPreview />
          </div>
        )}

        {/* Page Builder Panel - Right side, 60% width when active */}
        {isPageBuilderLoading && (
          <div className="w-[60%] flex flex-col bg-[#F8F9FB] p-3 transition-all duration-300 ease-in-out">
            <div className="w-full h-full bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center">
              <SenseLogo size={80} animated={true} />
              <p className="text-[15px] text-[#6B7280] mt-6">Building your page...</p>
            </div>
          </div>
        )}
        {isPageBuilderOpen && !isPageBuilderLoading && (
          <div className="w-[60%] flex flex-col bg-[#F8F9FB] p-3 transition-all duration-300 ease-in-out">
            <PageBuilderCard onClose={() => setIsPageBuilderOpen(false)} />
          </div>
        )}

        {/* Invoice Page Builder Panel - Right side, 60% width when active */}
        {isInvoicePageBuilderLoading && (
          <div className="w-[60%] flex flex-col bg-[#F8F9FB] p-3 transition-all duration-300 ease-in-out">
            <div className="w-full h-full bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex flex-col items-center justify-center">
              <SenseLogo size={80} animated={true} />
              <p className="text-[15px] text-[#6B7280] mt-6">Building your invoices page...</p>
            </div>
          </div>
        )}
        {isInvoicePageBuilderOpen && !isInvoicePageBuilderLoading && (
          <div className="w-[60%] flex flex-col bg-[#F8F9FB] p-3 transition-all duration-300 ease-in-out">
            <InvoicePageBuilderCard onClose={() => setIsInvoicePageBuilderOpen(false)} />
          </div>
        )}

        {/* Email Editor Panel - Right side */}
        {isEmailEditorOpen && (
          <div className="w-[50%] flex flex-col bg-[#F8F9FB] p-3 transition-all duration-300 ease-in-out">
            <EmailEditorCard
              data={emailEditorData}
              onChange={(data) => setEmailEditorData(data)}
              onClose={() => setIsEmailEditorOpen(false)}
              onApply={() => {
                // Update the email card in messages with edited data
                setMessages(prev => prev.map(msg => {
                  if (msg.emailCard) {
                    return {
                      ...msg,
                      emailCard: {
                        ...msg.emailCard,
                        subject: emailEditorData.subject,
                        to: emailEditorData.to.split(',').map(s => s.trim()).filter(Boolean),
                        body: emailEditorData.body,
                        type: emailEditorData.type
                      }
                    };
                  }
                  return msg;
                }));
                setIsEmailEditorOpen(false);
              }}
            />
          </div>
        )}
      </div>
      </div> {/* End Content Below Header */}
      
      {/* Rename Modal */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[16px] w-[420px] p-6 shadow-2xl">
            <h2 className="text-[17px] font-semibold text-[#1C1E21] mb-4">Rename chat</h2>
            <input
              type="text"
              className="w-full bg-white text-[#1C1E21] text-[15px] px-4 py-2.5 rounded-lg border border-[#E6E8EC] focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all duration-150"
              value={tempChatName}
              onChange={(e) => setTempChatName(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveRename();
                } else if (e.key === 'Escape') {
                  handleCancelRename();
                }
              }}
            />
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-[14px] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#F8F9FB] transition-colors duration-150 rounded-lg font-medium"
                onClick={handleCancelRename}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-[14px] bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] text-white font-medium rounded-lg transition-colors duration-150 shadow-sm"
                onClick={handleSaveRename}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Radar Success Toast */}
      <RadarSuccessToast
        isVisible={radarToastVisible}
        onClose={() => setRadarToastVisible(false)}
        onGoToRadar={() => {
          setRadarToastVisible(false);
          onViewChange?.('radar');
        }}
      />

    </div>
    </div>
  );
}