import React, { useState, useRef, useEffect } from 'react';
import { X, Layout, Code, Eye, Settings, Share2, Sparkles, Search, Filter, MoreHorizontal, Mail, ChevronDown, ChevronUp, Copy, FileText, Printer, FileDown, Send, Pencil, Type, Palette, Move, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Minus, Plus, MousePointerClick, Check, ChevronRight } from 'lucide-react';
import { PublishModal } from './PublishModal';

interface Invoice {
  id: string;
  invoiceNo: string;
  customer: string;
  amount: number;
  dueDate: string;
  daysPastDue: number;
  status: 'overdue' | 'critical' | 'warning';
}

interface CustomerInfo {
  billingName: string;
  billingStreet: string;
  billingCity: string;
  billingState: string;
  billingZip: string;
  billingPhone: string;
  billingEmail: string;
  customerName: string;
  customerStreet: string;
  customerCity: string;
  customerState: string;
  customerZip: string;
  customerPhone: string;
  customerEmail: string;
  jobDescription: string;
}

const customerInfoMap: Record<string, CustomerInfo> = {
  '1': {
    billingName: 'Michael Carter',
    billingStreet: '4821 Riverside Drive',
    billingCity: 'Austin', billingState: 'TX', billingZip: '78701',
    billingPhone: '(512) 555-0142', billingEmail: 'michael.carter@email.com',
    customerName: 'Michael Carter',
    customerStreet: '4821 Riverside Drive',
    customerCity: 'Austin', customerState: 'TX', customerZip: '78701',
    customerPhone: '(512) 555-0142', customerEmail: 'michael.carter@email.com',
    jobDescription: 'Full roof replacement with architectural shingles and improved ventilation system.',
  },
  '2': {
    billingName: 'Thomas Riley',
    billingStreet: '238 Harbor View Blvd',
    billingCity: 'Portland', billingState: 'OR', billingZip: '97201',
    billingPhone: '(503) 555-0198', billingEmail: 'thomas.riley@email.com',
    customerName: 'Thomas Riley',
    customerStreet: '238 Harbor View Blvd',
    customerCity: 'Portland', customerState: 'OR', customerZip: '97201',
    customerPhone: '(503) 555-0198', customerEmail: 'thomas.riley@email.com',
    jobDescription: 'Emergency storm damage repair, partial shingle replacement, and gutter restoration.',
  },
  '3': {
    billingName: 'Sarah Mitchell',
    billingStreet: '1503 Pinecrest Lane',
    billingCity: 'Nashville', billingState: 'TN', billingZip: '37201',
    billingPhone: '(615) 555-0317', billingEmail: 'sarah.mitchell@email.com',
    customerName: 'Sarah Mitchell',
    customerStreet: '1503 Pinecrest Lane',
    customerCity: 'Nashville', customerState: 'TN', customerZip: '37201',
    customerPhone: '(615) 555-0317', customerEmail: 'sarah.mitchell@email.com',
    jobDescription: 'Flat roof membrane replacement with TPO system and improved drainage installation.',
  },
  '4': {
    billingName: 'Brian Sullivan',
    billingStreet: '872 Elmwood Court',
    billingCity: 'Denver', billingState: 'CO', billingZip: '80203',
    billingPhone: '(720) 555-0443', billingEmail: 'brian.sullivan@email.com',
    customerName: 'Brian Sullivan',
    customerStreet: '872 Elmwood Court',
    customerCity: 'Denver', customerState: 'CO', customerZip: '80203',
    customerPhone: '(720) 555-0443', customerEmail: 'brian.sullivan@email.com',
    jobDescription: 'Complete re-roofing project with metal panel system, insulation upgrade, and skylight installation.',
  },
  '5': {
    billingName: 'Amanda Foster',
    billingStreet: '2241 Sycamore Street',
    billingCity: 'Phoenix', billingState: 'AZ', billingZip: '85001',
    billingPhone: '(602) 555-0521', billingEmail: 'amanda.foster@email.com',
    customerName: 'Amanda Foster',
    customerStreet: '2241 Sycamore Street',
    customerCity: 'Phoenix', customerState: 'AZ', customerZip: '85001',
    customerPhone: '(602) 555-0521', customerEmail: 'amanda.foster@email.com',
    jobDescription: 'Tile roof repair and resealing with waterproofing treatment for desert climate.',
  },
  '6': {
    billingName: 'James Wilson',
    billingStreet: '350 Oakdale Ave, Suite 12',
    billingCity: 'Chicago', billingState: 'IL', billingZip: '60601',
    billingPhone: '(312) 555-0674', billingEmail: 'james.wilson@email.com',
    customerName: 'James Wilson',
    customerStreet: '350 Oakdale Ave, Suite 12',
    customerCity: 'Chicago', customerState: 'IL', customerZip: '60601',
    customerPhone: '(312) 555-0674', customerEmail: 'james.wilson@email.com',
    jobDescription: 'Commercial flat roof overhaul with built-up roofing system and drainage improvement.',
  },
  '7': {
    billingName: 'Lisa Thompson',
    billingStreet: '6714 Magnolia Drive',
    billingCity: 'Atlanta', billingState: 'GA', billingZip: '30301',
    billingPhone: '(404) 555-0789', billingEmail: 'lisa.thompson@email.com',
    customerName: 'Lisa Thompson',
    customerStreet: '6714 Magnolia Drive',
    customerCity: 'Atlanta', customerState: 'GA', customerZip: '30301',
    customerPhone: '(404) 555-0789', customerEmail: 'lisa.thompson@email.com',
    jobDescription: 'Residential shingle repair, ridge cap replacement, and flashing seal around chimney.',
  },
  '8': {
    billingName: 'Robert Johnson',
    billingStreet: '1122 Chestnut Street',
    billingCity: 'Seattle', billingState: 'WA', billingZip: '98101',
    billingPhone: '(206) 555-0836', billingEmail: 'robert.johnson@email.com',
    customerName: 'Robert Johnson',
    customerStreet: '1122 Chestnut Street',
    customerCity: 'Seattle', customerState: 'WA', customerZip: '98101',
    customerPhone: '(206) 555-0836', customerEmail: 'robert.johnson@email.com',
    jobDescription: 'Green roof system installation with waterproofing membrane and drainage mat.',
  },
  '9': {
    billingName: 'Nicole Brown',
    billingStreet: '498 Willow Way',
    billingCity: 'Dallas', billingState: 'TX', billingZip: '75201',
    billingPhone: '(214) 555-0912', billingEmail: 'nicole.brown@email.com',
    customerName: 'Nicole Brown',
    customerStreet: '498 Willow Way',
    customerCity: 'Dallas', customerState: 'TX', customerZip: '75201',
    customerPhone: '(214) 555-0912', customerEmail: 'nicole.brown@email.com',
    jobDescription: 'Full roof tear-off and replacement with impact-resistant shingles and new underlayment.',
  },
  '10': {
    billingName: 'Daniel Hayes',
    billingStreet: '3300 Harbor Blvd',
    billingCity: 'San Diego', billingState: 'CA', billingZip: '92101',
    billingPhone: '(619) 555-0056', billingEmail: 'daniel.hayes@email.com',
    customerName: 'Daniel Hayes',
    customerStreet: '3300 Harbor Blvd',
    customerCity: 'San Diego', customerState: 'CA', customerZip: '92101',
    customerPhone: '(619) 555-0056', customerEmail: 'daniel.hayes@email.com',
    jobDescription: 'Roof inspection, minor repairs, and full recoating with UV-resistant elastomeric coating.',
  },
};

const mockInvoices: Invoice[] = [
  { id: '1', invoiceNo: '#02-26-10489', customer: 'Michael Carter', amount: 3762000, dueDate: '01/29/2026', daysPastDue: 29, status: 'critical' },
  { id: '2', invoiceNo: '#02-26-10490', customer: 'Thomas Riley', amount: 12450, dueDate: '02/01/2026', daysPastDue: 26, status: 'critical' },
  { id: '3', invoiceNo: '#02-26-10491', customer: 'Sarah Mitchell', amount: 8750, dueDate: '02/05/2026', daysPastDue: 22, status: 'critical' },
  { id: '4', invoiceNo: '#02-26-10492', customer: 'Brian Sullivan', amount: 15200, dueDate: '02/10/2026', daysPastDue: 17, status: 'overdue' },
  { id: '5', invoiceNo: '#02-26-10493', customer: 'Amanda Foster', amount: 6300, dueDate: '02/12/2026', daysPastDue: 15, status: 'overdue' },
  { id: '6', invoiceNo: '#02-26-10494', customer: 'James Wilson', amount: 22100, dueDate: '02/14/2026', daysPastDue: 13, status: 'overdue' },
  { id: '7', invoiceNo: '#02-26-10495', customer: 'Lisa Thompson', amount: 4500, dueDate: '02/17/2026', daysPastDue: 10, status: 'warning' },
  { id: '8', invoiceNo: '#02-26-10496', customer: 'Robert Johnson', amount: 9800, dueDate: '02/18/2026', daysPastDue: 9, status: 'warning' },
  { id: '9', invoiceNo: '#02-26-10497', customer: 'Nicole Brown', amount: 18600, dueDate: '02/20/2026', daysPastDue: 7, status: 'warning' },
  { id: '10', invoiceNo: '#02-26-10498', customer: 'Daniel Hayes', amount: 7250, dueDate: '02/22/2026', daysPastDue: 5, status: 'warning' },
];

interface InvoicePageBuilderCardProps {
  onClose: () => void;
  pageName?: string;
  workspace?: string;
  isPublishedView?: boolean;
}

const formatCurrency = (amount: number) => {
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
};

// Element metadata for point-and-edit
interface EditableElementInfo {
  id: string;
  label: string;
  type: 'text' | 'button' | 'card' | 'badge' | 'table' | 'section' | 'image';
  category: string;
}

const EDITABLE_ELEMENTS: Record<string, EditableElementInfo> = {
  'company-logo': { id: 'company-logo', label: 'Company Logo', type: 'image', category: 'Header' },
  'status-badge': { id: 'status-badge', label: 'Status Badge', type: 'badge', category: 'Header' },
  'billing-address': { id: 'billing-address', label: 'Billing Address', type: 'card', category: 'Addresses' },
  'customer-address': { id: 'customer-address', label: 'Customer Address', type: 'card', category: 'Addresses' },
  'amount-due-card': { id: 'amount-due-card', label: 'Amount Due', type: 'card', category: 'Summary' },
  'invoice-meta': { id: 'invoice-meta', label: 'Invoice Details', type: 'section', category: 'Details' },
  'line-items-table': { id: 'line-items-table', label: 'Line Items Table', type: 'table', category: 'Items' },
  'totals-section': { id: 'totals-section', label: 'Totals Section', type: 'section', category: 'Summary' },
  'financing-note': { id: 'financing-note', label: 'Financing Note', type: 'text', category: 'Footer' },
  'payment-details': { id: 'payment-details', label: 'Payment Details', type: 'section', category: 'Footer' },
  'description-section': { id: 'description-section', label: 'Description', type: 'text', category: 'Footer' },
  'remarks-text': { id: 'remarks-text', label: 'Remarks', type: 'text', category: 'Footer' },
  'sync-banner': { id: 'sync-banner', label: 'Sync Status Banner', type: 'section', category: 'Status' },
  'job-quote-status': { id: 'job-quote-status', label: 'Job / Quote / Status', type: 'section', category: 'Status' },
  'action-bar': { id: 'action-bar', label: 'Action Buttons Bar', type: 'section', category: 'Actions' },
  'btn-print': { id: 'btn-print', label: 'Print Button', type: 'button', category: 'Actions' },
  'btn-pdf': { id: 'btn-pdf', label: 'PDF Button', type: 'button', category: 'Actions' },
  'btn-send': { id: 'btn-send', label: 'Send Button', type: 'button', category: 'Actions' },
  'btn-edit': { id: 'btn-edit', label: 'Edit Button', type: 'button', category: 'Actions' },
  'btn-more': { id: 'btn-more', label: 'More Actions Button', type: 'button', category: 'Actions' },
  'breadcrumb': { id: 'breadcrumb', label: 'Breadcrumb Navigation', type: 'text', category: 'Navigation' },
  'subtotal-text': { id: 'subtotal-text', label: 'Sub-Total', type: 'text', category: 'Summary' },
  'discount-text': { id: 'discount-text', label: 'Discount', type: 'text', category: 'Summary' },
  'tax-text': { id: 'tax-text', label: 'Tax (RT)', type: 'text', category: 'Summary' },
  'total-text': { id: 'total-text', label: 'Total', type: 'text', category: 'Summary' },
  'amount-due-text': { id: 'amount-due-text', label: 'Amount Due Total', type: 'text', category: 'Summary' },
};

export const InvoicePageBuilderCard: React.FC<InvoicePageBuilderCardProps> = ({ onClose, pageName, workspace, isPublishedView = false }) => {
  const [viewMode, setViewMode] = useState<'design' | 'code'>('design');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(mockInvoices[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [sentInvoiceIds, setSentInvoiceIds] = useState<Set<string>>(new Set());

  // Point-and-edit state
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [expandedOptions, setExpandedOptions] = useState<string[]>(['style']);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [editPanelPosition, setEditPanelPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const editPanelRef = useRef<HTMLDivElement>(null);
  const [appliedChanges, setAppliedChanges] = useState<Set<string>>(new Set());

  const customerInfo = customerInfoMap[selectedInvoice.id] ?? customerInfoMap['1'];

  const handleSendEmail = (invoiceId: string) => {
    setSentInvoiceIds(prev => new Set(prev).add(invoiceId));
  };

  const isInvoiceSent = (invoiceId: string) => sentInvoiceIds.has(invoiceId);

  const filteredInvoices = mockInvoices.filter(inv =>
    inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNo.includes(searchQuery)
  );

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'critical': return { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]', label: 'Critical' };
      case 'overdue': return { bg: 'bg-[#FFF4ED]', text: 'text-[#FD5000]', label: 'Overdue' };
      case 'warning': return { bg: 'bg-[#FEF9C3]', text: 'text-[#CA8A04]', label: 'Warning' };
    }
  };

  const lineItems = [
    { id: 1, name: '#ZP - 1BD - Feb 27 - Part 1', unitCost: '$100.000', markup: '-', location: '100', brand: '', spec: '---', qty: 2, price: '$500.000' },
    { id: 2, name: '#ZP - 2BD - Feb 27 - Part 2', unitCost: '$100.000', markup: '-', location: '100', brand: '', spec: '---', qty: 2, price: '$200.000' },
    { id: 3, name: '#ZP - 4BD - Feb 27 - Fixed Bundle', unitCost: '$100.000', markup: '-', location: '---', brand: '', spec: '---', qty: 2, price: '$500.000', subItems: '2 Item(s)' },
    { id: 4, name: '#ZP - 3BD - Feb 27 - Rollup Bundle', unitCost: '$200.000', markup: '-', location: '---', brand: '', spec: '---', qty: 2, price: '$700.000', subItems: '2 Item(s)' },
  ];

  // Point-and-edit handlers
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    if (!isEditMode) return;
    e.stopPropagation();
    e.preventDefault();

    const target = e.currentTarget as HTMLElement;
    const panelEl = rightPanelRef.current;
    if (panelEl) {
      const panelRect = panelEl.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      setEditPanelPosition({
        top: targetRect.bottom - panelRect.top + panelEl.scrollTop + 8,
        left: 16,
        width: panelRect.width - 32,
      });
    }

    setSelectedElement(elementId);
    setEditPrompt('');
  };

  const handleElementHover = (elementId: string) => {
    if (isEditMode) setHoveredElement(elementId);
  };

  const handleElementLeave = () => {
    if (isEditMode) setHoveredElement(null);
  };

  const closeEditPanel = () => {
    setSelectedElement(null);
    setEditPrompt('');
    setEditPanelPosition(null);
  };

  const toggleOption = (option: string) => {
    setExpandedOptions(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleApplyChanges = () => {
    if (selectedElement) {
      setAppliedChanges(prev => new Set(prev).add(selectedElement));
    }
    closeEditPanel();
  };

  // Close panel on click outside
  useEffect(() => {
    if (!selectedElement) return;
    const handleClick = (e: MouseEvent) => {
      if (editPanelRef.current && !editPanelRef.current.contains(e.target as Node)) {
        // Only close if clicking on the background, not on another editable
        const target = e.target as HTMLElement;
        if (!target.closest('[data-editable]')) {
          closeEditPanel();
        }
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [selectedElement]);

  // When edit mode is turned off, clear selection
  useEffect(() => {
    if (!isEditMode) {
      closeEditPanel();
      setHoveredElement(null);
    }
  }, [isEditMode]);

  const getEditableProps = (elementId: string) => {
    if (!isEditMode) return {};
    const isSelected = selectedElement === elementId;
    const isHovered = hoveredElement === elementId;
    return {
      'data-editable': elementId,
      onClick: (e: React.MouseEvent) => handleElementClick(e, elementId),
      onMouseEnter: () => handleElementHover(elementId),
      onMouseLeave: handleElementLeave,
      className: `relative cursor-pointer transition-all duration-150 ${
        isSelected
          ? 'ring-2 ring-[#6B8DD6] ring-offset-2 rounded-lg'
          : isHovered
            ? 'ring-2 ring-[#6B8DD6]/50 ring-dashed ring-offset-1 rounded-lg'
            : ''
      }`,
      style: { position: 'relative' as const },
    };
  };

  // Helper to merge editable props with existing className
  const mergeEditableClass = (elementId: string, baseClass: string) => {
    if (!isEditMode) return baseClass;
    const isSelected = selectedElement === elementId;
    const isHovered = hoveredElement === elementId;
    const editClass = isSelected
      ? 'ring-2 ring-[#6B8DD6] ring-offset-2 rounded-lg cursor-pointer'
      : isHovered
        ? 'ring-2 ring-[#6B8DD6]/50 ring-dashed ring-offset-1 rounded-lg cursor-pointer'
        : 'cursor-pointer';
    return `${baseClass} transition-all duration-150 ${editClass}`;
  };

  const elementInfo = selectedElement ? EDITABLE_ELEMENTS[selectedElement] : null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="w-3.5 h-3.5" />;
      case 'button': return <MousePointerClick className="w-3.5 h-3.5" />;
      case 'card': return <Layout className="w-3.5 h-3.5" />;
      case 'badge': return <Palette className="w-3.5 h-3.5" />;
      case 'table': return <AlignLeft className="w-3.5 h-3.5" />;
      case 'section': return <Move className="w-3.5 h-3.5" />;
      case 'image': return <Eye className="w-3.5 h-3.5" />;
      default: return <Type className="w-3.5 h-3.5" />;
    }
  };

  // Quick suggestion pills based on element type
  const getQuickSuggestions = (elementId: string): string[] => {
    const info = EDITABLE_ELEMENTS[elementId];
    if (!info) return [];
    switch (info.type) {
      case 'text':
        return ['Change text content', 'Make text larger', 'Change font color'];
      case 'button':
        return ['Change button color', 'Update button text', 'Make it rounded'];
      case 'card':
        return ['Change background color', 'Add border shadow', 'Adjust padding'];
      case 'badge':
        return ['Change badge color', 'Update badge text', 'Make it pill-shaped'];
      case 'table':
        return ['Add striped rows', 'Change header style', 'Adjust column widths'];
      case 'section':
        return ['Rearrange layout', 'Change background', 'Adjust spacing'];
      case 'image':
        return ['Change logo', 'Resize image', 'Add border radius'];
      default:
        return ['Change style', 'Update content', 'Adjust layout'];
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
      {/* Header - hidden when viewing published page from sidebar */}
      {!isPublishedView && <div className="px-4 py-2.5 bg-white flex items-center justify-between gap-4 border-b border-[#E6E8EC]">
        {/* Left: Design/Code Switcher */}
        <div className="flex items-center gap-1 bg-[#F8F9FB] rounded-lg p-1">
          <button
            className={`px-2 py-1.5 rounded-md transition-colors ${
              viewMode === 'design'
                ? 'bg-white text-[#1C1E21] shadow-sm'
                : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
            title="Design"
            onClick={() => setViewMode('design')}
          >
            <Layout className="w-4 h-4" />
          </button>
          <button
            className={`px-2 py-1.5 rounded-md transition-colors ${
              viewMode === 'code'
                ? 'bg-white text-[#1C1E21] shadow-sm'
                : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
            title="Code"
            onClick={() => setViewMode('code')}
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Middle: URL Section */}
        <div className="flex-1 flex items-center gap-2 bg-[#F8F9FB] rounded-lg px-3 py-1.5 min-w-0">
          <button className="flex-shrink-0 p-1 hover:bg-[#E6E8EC] rounded transition-colors" title="Home">
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <span className="text-[#6B7280] flex-shrink-0">/</span>
          <span className="text-[13px] text-[#1C1E21] truncate">
            {pageName ? `${workspace?.toLowerCase() ?? 'pages'}/${pageName.toLowerCase().replace(/\s+/g, '-')}` : 'invoices/overdue'}
          </span>
          <div className="ml-auto flex items-center gap-1 flex-shrink-0">
            <button className="p-1 hover:bg-[#E6E8EC] rounded transition-colors" title="Reload">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button className="p-1 hover:bg-[#E6E8EC] rounded transition-colors" title="Open in new tab">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC] transition-colors" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC] transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          {/* Point and Edit Toggle */}
          <button
            className={`p-2 rounded-lg transition-colors ${
              isEditMode
                ? 'bg-[#6B8DD6] text-white shadow-md'
                : 'bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC]'
            }`}
            title="Point and edit"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1E21] text-white text-[13px] font-medium hover:bg-[#2A2D31] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Publish
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>}

      {/* Edit Mode Banner */}
      {isEditMode && !isPublishedView && (
        <div className="px-4 py-2 bg-[#EEF2FF] border-b border-[#C7D2FE] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#6B8DD6] rounded-full animate-pulse"></div>
          <span className="text-[12px] font-medium text-[#4338CA]">Point & Edit Mode</span>
          <span className="text-[12px] text-[#6366F1]">- Click on any element to select and edit it</span>
          <button
            onClick={() => setIsEditMode(false)}
            className="ml-auto text-[12px] text-[#6366F1] hover:text-[#4338CA] font-medium transition-colors"
          >
            Exit Edit Mode
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex overflow-hidden bg-[#F8F9FB]">
        {viewMode === 'design' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Invoice List */}
            <div className="w-[340px] flex-shrink-0 bg-white border-r border-[#E6E8EC] flex flex-col overflow-hidden">
              {/* List Header */}
              <div className="px-4 pt-4 pb-3 border-b border-[#E6E8EC]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#1C1E21]">Overdue Invoices</h2>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">{mockInvoices.length} invoices past due</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-md hover:bg-[#F8F9FB] transition-colors">
                      <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-[#F8F9FB] transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-[#6B7280]" />
                    </button>
                  </div>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="w-full pl-8 pr-3 py-2 bg-[#F8F9FB] rounded-lg text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#FD5000]/30 border border-transparent focus:border-[#FD5000]/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Invoice List */}
              <div className="flex-1 overflow-y-auto">
                {filteredInvoices.map((invoice) => {
                  const statusStyle = getStatusColor(invoice.status);
                  const isSelected = selectedInvoice.id === invoice.id;
                  return (
                    <button
                      key={invoice.id}
                      onClick={() => !isEditMode && setSelectedInvoice(invoice)}
                      className={`w-full px-4 py-3.5 text-left border-b border-[#F3F4F6] transition-colors ${
                        isSelected
                          ? 'bg-[#FFF7ED] border-l-2 border-l-[#FD5000]'
                          : 'hover:bg-[#FAFAFA] border-l-2 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-medium text-[#1C1E21] truncate">{invoice.customer}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                              {statusStyle.label}
                            </span>
                          </div>
                          <p className="text-[12px] text-[#6B7280]">Invoice {invoice.invoiceNo}</p>
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">{invoice.daysPastDue} days past due</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-[13px] font-semibold text-[#1C1E21]">{formatCurrency(invoice.amount)}</p>
                          <p className="text-[11px] text-[#9CA3AF] mt-0.5">Due {invoice.dueDate}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* List Footer Summary */}
              <div className="px-4 py-3 border-t border-[#E6E8EC] bg-[#FAFAFA]">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#6B7280]">Total Outstanding</span>
                  <span className="text-[13px] font-semibold text-[#EF4444]">$3,868,950.000</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Invoice Detail */}
            <div ref={rightPanelRef} className="flex-1 overflow-y-auto bg-[#F8F9FB] p-4 relative">
              {/* Action Bar */}
              <div
                data-editable="action-bar"
                onMouseEnter={() => handleElementHover('action-bar')}
                onMouseLeave={handleElementLeave}
                onClick={(e) => handleElementClick(e, 'action-bar')}
                className={mergeEditableClass('action-bar', 'bg-white rounded-xl border border-[#E6E8EC] shadow-sm mb-4 px-4 py-3 flex items-center justify-between')}
              >
                {/* Breadcrumb */}
                <div
                  data-editable="breadcrumb"
                  onMouseEnter={(e) => { e.stopPropagation(); handleElementHover('breadcrumb'); }}
                  onMouseLeave={(e) => { e.stopPropagation(); handleElementLeave(); }}
                  onClick={(e) => { e.stopPropagation(); handleElementClick(e, 'breadcrumb'); }}
                  className={mergeEditableClass('breadcrumb', 'flex items-center gap-2')}
                >
                  <span className="text-[13px] text-[#6B7280]">Invoices</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                  <span className="text-[13px] text-[#6B7280]">{selectedInvoice.customer}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                  <span className="text-[13px] font-medium text-[#1C1E21]">{selectedInvoice.invoiceNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    data-editable="btn-print"
                    onMouseEnter={(e) => { e.stopPropagation(); handleElementHover('btn-print'); }}
                    onMouseLeave={(e) => { e.stopPropagation(); handleElementLeave(); }}
                    onClick={(e) => { if (isEditMode) { e.stopPropagation(); handleElementClick(e, 'btn-print'); } }}
                    className={mergeEditableClass('btn-print', 'flex items-center justify-center w-8 h-8 text-[#1C1E21] hover:bg-[#F8F9FB] rounded-lg transition-colors border border-[#E6E8EC] bg-white')}
                    title="Print"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#6B7280]" />
                  </button>
                  <button
                    data-editable="btn-pdf"
                    onMouseEnter={(e) => { e.stopPropagation(); handleElementHover('btn-pdf'); }}
                    onMouseLeave={(e) => { e.stopPropagation(); handleElementLeave(); }}
                    onClick={(e) => { if (isEditMode) { e.stopPropagation(); handleElementClick(e, 'btn-pdf'); } }}
                    className={mergeEditableClass('btn-pdf', 'flex items-center justify-center w-8 h-8 text-[#1C1E21] hover:bg-[#F8F9FB] rounded-lg transition-colors border border-[#E6E8EC] bg-white')}
                    title="PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#6B7280]" />
                  </button>
                  <button
                    data-editable="btn-send"
                    onMouseEnter={(e) => { e.stopPropagation(); handleElementHover('btn-send'); }}
                    onMouseLeave={(e) => { e.stopPropagation(); handleElementLeave(); }}
                    onClick={(e) => {
                      if (isEditMode) { e.stopPropagation(); handleElementClick(e, 'btn-send'); }
                      else handleSendEmail(selectedInvoice.id);
                    }}
                    className={mergeEditableClass('btn-send', 'flex items-center gap-1.5 px-3 py-2 text-[13px] text-white font-medium bg-[#FD5000] hover:bg-[#E54800] rounded-lg transition-colors shadow-sm')}
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    Send
                  </button>
                  <button
                    data-editable="btn-edit"
                    onMouseEnter={(e) => { e.stopPropagation(); handleElementHover('btn-edit'); }}
                    onMouseLeave={(e) => { e.stopPropagation(); handleElementLeave(); }}
                    onClick={(e) => { if (isEditMode) { e.stopPropagation(); handleElementClick(e, 'btn-edit'); } }}
                    className={mergeEditableClass('btn-edit', 'flex items-center justify-center w-8 h-8 text-[#1C1E21] hover:bg-[#F8F9FB] rounded-lg transition-colors border border-[#E6E8EC] bg-white')}
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#6B7280]" />
                  </button>
                  <button
                    data-editable="btn-more"
                    onMouseEnter={(e) => { e.stopPropagation(); handleElementHover('btn-more'); }}
                    onMouseLeave={(e) => { e.stopPropagation(); handleElementLeave(); }}
                    onClick={(e) => { if (isEditMode) { e.stopPropagation(); handleElementClick(e, 'btn-more'); } }}
                    className={mergeEditableClass('btn-more', 'flex items-center justify-center w-8 h-8 text-[#1C1E21] hover:bg-[#F8F9FB] rounded-lg transition-colors border border-[#E6E8EC] bg-white')}
                    title="More Actions"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/* Sync Status Banner */}
              <div
                data-editable="sync-banner"
                onMouseEnter={() => handleElementHover('sync-banner')}
                onMouseLeave={handleElementLeave}
                onClick={(e) => handleElementClick(e, 'sync-banner')}
                className={mergeEditableClass('sync-banner', 'bg-white rounded-xl border border-[#E6E8EC] shadow-sm mb-4 px-4 py-3')}
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-[#ECFDF5] text-[#10B981] text-[11px] font-medium rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse"></span>
                    Syncing
                  </span>
                  <div className="w-4 h-4 border-2 border-[#E6E8EC] border-t-[#6B7280] rounded-full animate-spin"></div>
                  <span className="text-[13px] text-[#6B7280]">The Invoice is being synchronized with QuickBooks Online.</span>
                </div>
              </div>

              {/* Job / Quote / Status Row */}
              <div
                data-editable="job-quote-status"
                onMouseEnter={() => handleElementHover('job-quote-status')}
                onMouseLeave={handleElementLeave}
                onClick={(e) => handleElementClick(e, 'job-quote-status')}
                className={mergeEditableClass('job-quote-status', 'bg-white rounded-xl border border-[#E6E8EC] shadow-sm mb-4')}
              >
                <div className="grid grid-cols-3 divide-x divide-[#E6E8EC]">
                  <div className="px-5 py-4">
                    <p className="text-[12px] font-medium text-[#1C1E21] mb-1">Job</p>
                    <p className="text-[13px] text-[#9CA3AF]">---</p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[12px] font-medium text-[#1C1E21] mb-1">Quote</p>
                    <p className="text-[13px] text-[#3B82F6] cursor-pointer hover:underline">1000013953</p>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-[12px] font-medium text-[#1C1E21] mb-1">Status</p>
                    <select className="text-[13px] text-[#1C1E21] bg-white border border-[#E6E8EC] rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#FD5000]/30">
                      <option>Sent</option>
                      <option>Paid</option>
                      <option>Draft</option>
                      <option>Void</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Invoice Document Card */}
              <div className="bg-white rounded-xl border border-[#E6E8EC] shadow-sm mb-4 overflow-hidden">
                {/* Invoice Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    {/* Company Logo */}
                    <div
                      data-editable="company-logo"
                      onMouseEnter={() => handleElementHover('company-logo')}
                      onMouseLeave={handleElementLeave}
                      onClick={(e) => handleElementClick(e, 'company-logo')}
                      className={mergeEditableClass('company-logo', 'flex items-center')}
                    >
                      <div className="bg-[#1C1E21] text-white px-3 py-2 rounded">
                        <span className="text-[16px] font-black tracking-tight leading-none block">ACME</span>
                        <span className="text-[7px] tracking-[0.15em] uppercase block mt-0.5">Corporation</span>
                      </div>
                    </div>
                    {/* Status Badge */}
                    <div
                      data-editable="status-badge"
                      onMouseEnter={() => handleElementHover('status-badge')}
                      onMouseLeave={handleElementLeave}
                      onClick={(e) => handleElementClick(e, 'status-badge')}
                      className={mergeEditableClass('status-badge', `${isInvoiceSent(selectedInvoice.id) ? 'bg-[#3B82F6]' : 'bg-[#F59E0B]'} text-white px-4 py-1.5 rounded-md text-[12px] font-semibold uppercase tracking-wide`)}
                    >
                      {isInvoiceSent(selectedInvoice.id) ? 'SENT' : 'DRAFT'}
                    </div>
                  </div>

                  {/* Address Cards Row */}
                  <div className="flex gap-4 mb-6">
                    {/* Billing Address */}
                    <div
                      data-editable="billing-address"
                      onMouseEnter={() => handleElementHover('billing-address')}
                      onMouseLeave={handleElementLeave}
                      onClick={(e) => handleElementClick(e, 'billing-address')}
                      className={mergeEditableClass('billing-address', 'flex-1 border border-[#E6E8EC] rounded-lg p-4')}
                    >
                      <p className="text-[12px] font-semibold text-[#FD5000] mb-2">Billing Address</p>
                      <p className="text-[13px] text-[#1C1E21] font-medium">{customerInfo.billingName}</p>
                      <p className="text-[12px] text-[#6B7280] leading-relaxed">
                        {customerInfo.billingStreet}<br />
                        {customerInfo.billingCity}, {customerInfo.billingState} {customerInfo.billingZip}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-[12px] text-[#6B7280] flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                          {customerInfo.billingPhone}
                        </p>
                        <p className="text-[12px] text-[#6B7280] flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          {customerInfo.billingEmail}
                        </p>
                      </div>
                    </div>

                    {/* Customer Address */}
                    <div
                      data-editable="customer-address"
                      onMouseEnter={() => handleElementHover('customer-address')}
                      onMouseLeave={handleElementLeave}
                      onClick={(e) => handleElementClick(e, 'customer-address')}
                      className={mergeEditableClass('customer-address', 'flex-1 border border-[#E6E8EC] rounded-lg p-4')}
                    >
                      <p className="text-[12px] font-semibold text-[#FD5000] mb-2">Customer Address</p>
                      <p className="text-[13px] text-[#1C1E21] font-medium">{customerInfo.customerName}</p>
                      <p className="text-[12px] text-[#6B7280] leading-relaxed">
                        {customerInfo.customerStreet}<br />
                        {customerInfo.customerCity}, {customerInfo.customerState} {customerInfo.customerZip}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-[12px] text-[#6B7280] flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                          {customerInfo.customerPhone}
                        </p>
                        <p className="text-[12px] text-[#6B7280] flex items-center gap-1.5">
                          <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                          {customerInfo.customerEmail}
                        </p>
                      </div>
                    </div>

                    {/* Amount Due */}
                    <div
                      data-editable="amount-due-card"
                      onMouseEnter={() => handleElementHover('amount-due-card')}
                      onMouseLeave={handleElementLeave}
                      onClick={(e) => handleElementClick(e, 'amount-due-card')}
                      className={mergeEditableClass('amount-due-card', 'w-[200px] flex-shrink-0')}
                    >
                      <div className="bg-[#FEE2E2]/50 border border-[#FECACA] rounded-lg p-4 text-center">
                        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide mb-1">Amount Due</p>
                        <p className="text-[24px] font-bold text-[#EF4444]">{formatCurrency(selectedInvoice.amount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Invoice Meta */}
                  <div
                    data-editable="invoice-meta"
                    onMouseEnter={() => handleElementHover('invoice-meta')}
                    onMouseLeave={handleElementLeave}
                    onClick={(e) => handleElementClick(e, 'invoice-meta')}
                    className={mergeEditableClass('invoice-meta', 'grid grid-cols-2 gap-x-8 gap-y-2 max-w-[400px] ml-auto')}
                  >
                    <div className="flex justify-between">
                      <span className="text-[12px] font-medium text-[#3B82F6]">Invoice No</span>
                      <span className="text-[12px] text-[#1C1E21]">{selectedInvoice.invoiceNo}</span>
                    </div>
                    <div></div>
                    <div className="flex justify-between">
                      <span className="text-[12px] font-medium text-[#3B82F6]">Invoice Date</span>
                      <span className="text-[12px] text-[#1C1E21]">02/27/2026</span>
                    </div>
                    <div></div>
                    <div className="flex justify-between">
                      <span className="text-[12px] font-medium text-[#3B82F6]">Due Date</span>
                      <span className="text-[12px] text-[#1C1E21]">{selectedInvoice.dueDate}</span>
                    </div>
                    <div></div>
                    <div className="flex justify-between">
                      <span className="text-[12px] font-medium text-[#3B82F6]">Created By</span>
                      <span className="text-[12px] text-[#1C1E21]">{selectedInvoice.customer}</span>
                    </div>
                  </div>

                  {/* Copy Icon */}
                  <div className="flex justify-end mt-2">
                    <button className="p-1.5 rounded hover:bg-[#F8F9FB] transition-colors">
                      <Copy className="w-4 h-4 text-[#9CA3AF]" />
                    </button>
                  </div>
                </div>

                {/* Line Items Table */}
                <div
                  data-editable="line-items-table"
                  onMouseEnter={() => handleElementHover('line-items-table')}
                  onMouseLeave={handleElementLeave}
                  onClick={(e) => handleElementClick(e, 'line-items-table')}
                  className={mergeEditableClass('line-items-table', 'border-t border-[#E6E8EC]')}
                >
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#E6E8EC] bg-[#FAFAFA]">
                        <th className="px-4 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wide w-[40px]">#</th>
                        <th className="px-4 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">Product / Service</th>
                        <th className="px-4 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">Unit Cost</th>
                        <th className="px-4 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">Markup</th>
                        <th className="px-4 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">Location</th>
                        <th className="px-4 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">Brand</th>
                        <th className="px-4 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">Specification</th>
                        <th className="px-4 py-3 text-right text-[11px] font-medium text-[#6B7280] uppercase tracking-wide">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((item) => (
                        <tr key={item.id} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                          <td className="px-4 py-3.5 text-[12px] text-[#6B7280]">{item.id}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-[#EEF2FF] rounded flex items-center justify-center flex-shrink-0">
                                <FileText className="w-4 h-4 text-[#6366F1]" />
                              </div>
                              <div>
                                <p className="text-[12px] text-[#1C1E21] font-medium">{item.name}</p>
                                {item.subItems && (
                                  <p className="text-[11px] text-[#3B82F6] mt-0.5 cursor-pointer hover:underline">{item.subItems}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-[12px] text-[#1C1E21]">{item.unitCost}</td>
                          <td className="px-4 py-3.5 text-[12px] text-[#6B7280]">{item.markup}</td>
                          <td className="px-4 py-3.5 text-[12px] text-[#1C1E21]">{item.location}</td>
                          <td className="px-4 py-3.5 text-[12px] text-[#6B7280]"></td>
                          <td className="px-4 py-3.5 text-[12px] text-[#6B7280]">{item.spec}</td>
                          <td className="px-4 py-3.5 text-right text-[12px] text-[#1C1E21]">{item.qty} x {item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals Section */}
                <div
                  data-editable="totals-section"
                  onMouseEnter={() => handleElementHover('totals-section')}
                  onMouseLeave={handleElementLeave}
                  onClick={(e) => handleElementClick(e, 'totals-section')}
                  className={mergeEditableClass('totals-section', 'border-t-2 border-[#FD5000]')}
                >
                  <div className="flex justify-end p-5">
                    <div className="w-[300px] space-y-2">
                      <div className="flex justify-between text-[12px]">
                        <span className="font-medium text-[#1C1E21]">Sub-Total</span>
                        <span className="text-[#1C1E21]">$3,800.000</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="font-medium text-[#1C1E21]">DISCOUNT-5PER (10%)</span>
                        <span className="text-[#1C1E21]">$380.000</span>
                      </div>
                      <div className="flex justify-between text-[12px]">
                        <span className="font-medium text-[#1C1E21]">RT (10%)</span>
                        <span className="text-[#1C1E21]">$342.000</span>
                      </div>
                      <div className="border-t border-[#E6E8EC] pt-2 mt-2">
                        <div className="flex justify-between text-[13px]">
                          <span className="font-semibold text-[#1C1E21]">Total</span>
                          <span className="font-semibold text-[#1C1E21]">{formatCurrency(selectedInvoice.amount)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-[13px]">
                        <span className="font-semibold text-[#EF4444]">Amount Due</span>
                        <span className="font-semibold text-[#EF4444]">{formatCurrency(selectedInvoice.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financing Note */}
                <div
                  data-editable="financing-note"
                  onMouseEnter={() => handleElementHover('financing-note')}
                  onMouseLeave={handleElementLeave}
                  onClick={(e) => handleElementClick(e, 'financing-note')}
                  className={mergeEditableClass('financing-note', 'px-6 py-4 border-t border-[#E6E8EC] bg-[#FAFAFA]')}
                >
                  <p className="text-[11px] text-[#6B7280] leading-relaxed">
                    * Financing Option Available From <span className="font-semibold text-[#1C1E21]">$171.69/month</span> at 8.90% APR for 24 months, totaling $4120.64*.
                  </p>
                  <p className="text-[11px] text-[#6B7280] leading-relaxed mt-1">
                    *All financing is subject to credit approval. Your terms may vary. Payment options through Wisetack are provided by our lending partners. See http://www.wisetack.com/lenders. See additional terms at http://www.wisetack.com/faqs.
                  </p>
                </div>

                {/* Payment Details */}
                <div
                  data-editable="payment-details"
                  onMouseEnter={() => handleElementHover('payment-details')}
                  onMouseLeave={handleElementLeave}
                  onClick={(e) => handleElementClick(e, 'payment-details')}
                  className={mergeEditableClass('payment-details', 'border-t border-[#E6E8EC] px-6 py-4')}
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-[12px] font-medium text-[#3B82F6] mb-1">Payment Term</p>
                      <p className="text-[12px] text-[#1C1E21]">Month</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#3B82F6] mb-1">Invoice Template</p>
                      <p className="text-[12px] text-[#1C1E21]">Invoice - 1</p>
                    </div>
                    <div>
                      <p className="text-[12px] font-medium text-[#3B82F6] mb-1">Trade Type</p>
                      <p className="text-[12px] text-[#9CA3AF]">---</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-[12px] font-medium text-[#FD5000] mb-1">Remarks</p>
                    <p className="text-[12px] text-[#1C1E21]">Payment due within 30 days of invoice date. Late payments subject to 1.5% monthly interest.</p>
                  </div>
                </div>

                {/* Description Section */}
                <div
                  data-editable="description-section"
                  onMouseEnter={() => handleElementHover('description-section')}
                  onMouseLeave={handleElementLeave}
                  onClick={(e) => handleElementClick(e, 'description-section')}
                  className={mergeEditableClass('description-section', 'border-t border-[#E6E8EC] bg-[#FAFAFA] px-6 py-4')}
                >
                  <h3 className="text-[14px] font-semibold text-[#1C1E21]">Description</h3>
                  <p className="text-[12px] text-[#6B7280] mt-2">{customerInfo.jobDescription}</p>
                </div>
              </div>

              {/* Floating Edit Panel */}
              {selectedElement && editPanelPosition && isEditMode && (
                <div
                  ref={editPanelRef}
                  className="absolute z-50 bg-white border border-[#E6E8EC] shadow-[0_4px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] rounded-xl overflow-hidden"
                  style={{
                    top: editPanelPosition.top,
                    left: editPanelPosition.left,
                    width: editPanelPosition.width,
                    maxWidth: '480px',
                  }}
                >
                  {/* Panel Header */}
                  <div className="px-4 py-2.5 bg-[#FAFAFA] border-b border-[#E6E8EC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-[#1C1E21] flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-[13px] font-medium text-[#1C1E21]">{elementInfo?.label}</span>
                    </div>
                    <button onClick={closeEditPanel} className="p-1 hover:bg-[#E6E8EC] rounded transition-colors">
                      <X className="w-3.5 h-3.5 text-[#9CA3AF]" />
                    </button>
                  </div>

                  {/* Describe Change Input */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-2 bg-[#F8F9FB] rounded-lg px-3 py-2.5 border border-[#E6E8EC] focus-within:border-[#1C1E21] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(28,30,33,0.08)] transition-all">
                      <Sparkles className="w-3.5 h-3.5 text-[#9CA3AF] flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Describe a change..."
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        className="flex-1 text-[13px] text-[#1C1E21] placeholder:text-[#9CA3AF] outline-none bg-transparent"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && editPrompt.trim()) {
                            handleApplyChanges();
                          }
                        }}
                      />
                    </div>
                    {/* Quick Suggestion Pills */}
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {selectedElement && getQuickSuggestions(selectedElement).map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setEditPrompt(suggestion)}
                          className="px-2.5 py-1 text-[11px] text-[#1C1E21] bg-[#F8F9FB] hover:bg-[#E6E8EC] rounded-full transition-colors border border-[#E6E8EC]"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mx-4 border-t border-[#E6E8EC]" />

                  {/* Color & Spacing */}
                  <div className="px-4 py-3 space-y-3">
                    {/* Colors */}
                    <div>
                      <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-2">Color</div>
                      <div className="flex gap-2">
                        {['#FFFFFF', '#F8F9FB', '#1C1E21', '#FD5000', '#3B82F6', '#10B981', '#EF4444', '#F59E0B'].map(color => (
                          <button key={color} className="w-7 h-7 rounded-full border-2 border-[#E6E8EC] hover:border-[#1C1E21] hover:scale-110 transition-all" style={{ backgroundColor: color }} title={color}></button>
                        ))}
                      </div>
                    </div>

                    {/* Spacing */}
                    <div>
                      <div className="text-[11px] font-medium text-[#6B7280] uppercase tracking-wider mb-2">Spacing</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#6B7280]">Padding</span>
                          <div className="flex items-center gap-0.5 bg-[#F8F9FB] rounded-lg p-0.5">
                            <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"><Minus className="w-2.5 h-2.5 text-[#6B7280]" /></button>
                            <span className="text-[12px] text-[#1C1E21] w-7 text-center font-medium">16</span>
                            <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"><Plus className="w-2.5 h-2.5 text-[#6B7280]" /></button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#6B7280]">Radius</span>
                          <div className="flex items-center gap-0.5 bg-[#F8F9FB] rounded-lg p-0.5">
                            <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"><Minus className="w-2.5 h-2.5 text-[#6B7280]" /></button>
                            <span className="text-[12px] text-[#1C1E21] w-7 text-center font-medium">8</span>
                            <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white hover:shadow-sm transition-all"><Plus className="w-2.5 h-2.5 text-[#6B7280]" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 border-t border-[#E6E8EC] bg-[#FAFAFA] flex justify-between items-center">
                    <button
                      onClick={closeEditPanel}
                      className="px-3 py-1.5 text-[12px] text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleApplyChanges}
                      className="px-5 py-1.5 text-[12px] font-medium bg-[#1C1E21] text-white rounded-lg hover:bg-[#2A2D31] transition-colors shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {/* Hover Label Tooltip */}
              {isEditMode && hoveredElement && !selectedElement && (
                <div className="fixed z-[9999] pointer-events-none" style={{ display: 'none' }}>
                  {/* This is handled via CSS hover labels on each element */}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Code View */
          <div className="flex-1 bg-[#1E1E2E] p-6 overflow-auto font-mono text-[13px] text-[#CDD6F4] leading-relaxed">
            <pre>{`// Overdue Invoices Page - Generated by Sense AI
import React, { useState } from 'react';

interface Invoice {
  id: string;
  invoiceNo: string;
  customer: string;
  amount: number;
  dueDate: string;
  daysPastDue: number;
  status: 'overdue' | 'critical' | 'warning';
}

export function OverdueInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  
  return (
    <div className="flex h-full">
      {/* Left: Invoice List */}
      <InvoiceList onSelect={setSelectedInvoice} />
      
      {/* Right: Invoice Detail */}
      {selectedInvoice && (
        <InvoiceDetail invoice={selectedInvoice} />
      )}
    </div>
  );
}`}</pre>
          </div>
        )}
      </div>
      {showPublishModal && <PublishModal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)} defaultPageName="Overdue Invoices" />}
    </div>
  );
};
