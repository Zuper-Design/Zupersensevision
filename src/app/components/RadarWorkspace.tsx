import { ExternalLink, RefreshCw, FileText, Clock, AlertTriangle, Sparkles, ArrowRight, MoreHorizontal, Pencil, PinOff, GripVertical, LayoutGrid, Check, Palette, X, FlaskConical, Maximize2, Minimize2, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRadar, SavedCard } from './RadarContext';
import { DSOChartCard } from './DSOChartCard';
import { RevenueMTDCard, OverdueInvoicesCard, QuoteConversionCard, CrewUtilisationCard, JobsCompletedCard, JobsByPriorityCard, JobsByStatusCard, CompletedJobsByTechCard, MonthlyJobRevenueOrangeCard, MonthlyJobRevenueRedCard, RevenueVsCostCard, JobsTableCard, CustomerGrowthCard, RevenueMoMCard, RevenueTableCard, RenameProps, DateFilter } from './RadarCards';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { RadarThemeContext, RADAR_THEMES, useRadarTheme, RadarThemeConfig } from './RadarThemeContext';
import { RadarChatPanel } from './RadarChatPanel';
import React from 'react';

interface RadarWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  activeView?: 'chat' | 'radar';
  onViewChange?: (view: 'chat' | 'radar') => void;
  onOpenCard?: (card: SavedCard) => void;
  showBetaBanner?: boolean;
  onCloseBetaBanner?: () => void;
  onOpenCardChat?: (title: string) => void;
  isTrial?: boolean;
  isVp?: boolean;
  onUpgrade?: () => void;
}

// Mini chart helpers
const generateMiniBarData = () => [{ v: 35 }, { v: 52 }, { v: 41 }, { v: 68 }, { v: 55 }, { v: 72 }, { v: 48 }, { v: 63 }];
const generateMiniLineData = () => [{ v: 30 }, { v: 45 }, { v: 38 }, { v: 56 }, { v: 62 }, { v: 51 }, { v: 70 }, { v: 65 }];
const generateMiniAreaData = () => [{ v: 20 }, { v: 35 }, { v: 28 }, { v: 48 }, { v: 42 }, { v: 58 }, { v: 52 }, { v: 60 }];
const miniPieData = [{ name: 'A', value: 42 }, { name: 'B', value: 26 }, { name: 'C', value: 21 }, { name: 'D', value: 11 }];
const PIE_COLORS = ['#FD5000', '#3B82F6', '#10B981', '#F59E0B'];

function MiniBarChart({ color }: { color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={64}>
      <BarChart data={generateMiniBarData()} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Bar dataKey="v" fill={color || '#FD5000'} radius={[2, 2, 0, 0]} opacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}
function MiniLineChart({ color = '#3B82F6' }: { color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={64}>
      <LineChart data={generateMiniLineData()} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
function MiniAreaChart({ color = '#10B981' }: { color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={64}>
      <AreaChart data={generateMiniAreaData()} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <defs>
          <linearGradient id={`area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#area-${color.replace('#', '')})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
function MiniPieChart({ colors }: { colors?: string[] }) {
  const c = colors || PIE_COLORS;
  return (
    <ResponsiveContainer width="100%" height={64}>
      <PieChart>
        <Pie data={miniPieData} cx="50%" cy="50%" innerRadius={14} outerRadius={28} dataKey="value" stroke="none">
          {miniPieData.map((_, i) => <Cell key={i} fill={c[i % c.length]} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

function getCardChart(card: SavedCard, accent: string) {
  const chartType = card.content?.chartType;
  if (chartType === 'pie') return <MiniPieChart colors={[accent, '#3B82F6', '#10B981', '#F59E0B']} />;
  if (chartType === 'line') return <MiniLineChart color={card.type === 'widget' ? '#10B981' : accent} />;
  if (chartType === 'bar') return <MiniBarChart color={accent} />;
  if (chartType === 'gauge') return <MiniAreaChart color="#F59E0B" />;
  if (card.type === 'chart') return <MiniLineChart color={accent} />;
  if (card.type === 'widget') return <MiniAreaChart color={accent} />;
  return null;
}

function isDSOChart(card: SavedCard) {
  return card.title?.toLowerCase().includes('dso') || card.title?.toLowerCase().includes('days sales outstanding');
}

// Sense Alert Card — KPI metric tile
function SenseAlertCard({ title, value, valueUnit, icon, accent = '#6366F1', trend, trendDirection = 'up' }: {
  title: string;
  dateRange?: string;
  value: string;
  valueUnit?: string;
  icon?: React.ReactNode;
  accent?: string;
  trend?: string;
  trendDirection?: 'up' | 'down';
  spark?: number[];
}) {
  const t = useRadarTheme();
  const isUp = trendDirection === 'up';
  const trendColor = isUp ? '#10B981' : '#EF4444';
  return (
    <div
      className="relative flex-1 min-w-0 flex flex-col cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: t.cardBg,
        border: t.cardBorder,
        borderRadius: t.cardRadius,
        boxShadow: t.cardShadow,
        fontFamily: t.fontFamily,
        minHeight: 130,
      }}
      onMouseEnter={e => { (e.currentTarget.style.boxShadow = t.cardHoverShadow); (e.currentTarget.style.transform = 'translateY(-2px)'); }}
      onMouseLeave={e => { (e.currentTarget.style.boxShadow = t.cardShadow); (e.currentTarget.style.transform = 'translateY(0)'); }}
    >
      <div className="px-5 pt-5 pb-5">
        <div className="flex items-center justify-between gap-3">
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: t.subtitleColor, textTransform: 'uppercase', margin: 0 }}>{title}</p>
          {icon && (
            <div
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${accent}14`, color: accent }}
            >
              {icon}
            </div>
          )}
        </div>
        <div className="flex items-end gap-2 mt-3">
          <p style={{ fontSize: 36, fontWeight: 600, color: t.valueColor, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>
            {value}{valueUnit && <span style={{ fontSize: 18, fontWeight: 600, marginLeft: 1, color: t.subtitleColor }}>{valueUnit}</span>}
          </p>
          {trend && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded-md mb-1"
              style={{ background: `${trendColor}1A`, color: trendColor, fontSize: 11, fontWeight: 600 }}
            >
              {isUp ? '+' : '-'}{trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Card hover actions
function CardHoverActions({ onOpenInChat, onEdit, onUnpin, onResize, isFullWidth }: {
  onOpenInChat?: () => void;
  onEdit?: () => void;
  onUnpin?: () => void;
  onResize?: () => void;
  isFullWidth?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useRadarTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const btnClass = "flex items-center justify-center h-7 rounded-lg border border-[#E6E8EC] bg-white hover:bg-[#F8F9FB] transition-all duration-150";
  const btnStyle = { color: '#6B7280' };

  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150">
      <DateFilter />

      <button
        onClick={(e) => { e.stopPropagation(); onOpenInChat?.(); }}
        className={`${btnClass} gap-1.5 px-2.5`}
        style={{ ...btnStyle, fontSize: 12, fontWeight: 500 }}
      >
        <ExternalLink className="w-3 h-3" />
        <span>Open Chat</span>
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
          className={`${btnClass} w-7`}
          style={btnStyle}
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-full mt-1 w-[130px] py-1 z-50"
              style={{ background: '#FFFFFF', border: '1px solid #E6E8EC', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setShowRemoveConfirm(true); }}
                className="w-full px-3 py-2 flex items-center gap-2.5 transition-colors duration-100 text-left hover:bg-[#FEF2F2]"
              >
                <X className="w-3.5 h-3.5 text-[#DC2626]" />
                <span style={{ fontSize: 13, color: '#DC2626' }}>Remove</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Remove Confirmation Dialog */}
      {showRemoveConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={(e) => { e.stopPropagation(); setShowRemoveConfirm(false); }}
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="w-full max-w-[380px] pointer-events-auto"
              style={{ background: '#FFFFFF', borderRadius: 14, boxShadow: '0 16px 48px rgba(0,0,0,0.16)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 pt-6 pb-5">
                <h3 className="text-[17px] font-bold text-[#1C1E21] mb-2">Remove from Radar?</h3>
                <p className="text-[14px] text-[#6B7280] leading-relaxed">Are you sure you want to remove this card? You can always add it back from the conversation.</p>
              </div>
              <div className="flex items-center justify-end gap-2.5 px-6 pb-5">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowRemoveConfirm(false); }}
                  className="px-5 py-2 text-[13px] font-medium text-[#1C1E21] bg-white border border-[#E6E8EC] hover:bg-[#F8F9FB] rounded-lg transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowRemoveConfirm(false); onUnpin?.(); }}
                  className="px-5 py-2 text-[13px] font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-lg transition-colors duration-150"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Unified card item type
type UnifiedCardItem =
  | { kind: 'saved'; data: SavedCard }
  | { kind: 'pinned'; id: string; title: string; Component: React.ComponentType<{ footer?: React.ReactNode; renameProps?: RenameProps }>; fullWidth?: boolean };

const PINNED_DEFS: UnifiedCardItem[] = [
  { kind: 'pinned', id: 'revenue',    title: 'Revenue MTD vs Target',       Component: RevenueMTDCard },
  { kind: 'pinned', id: 'overdue',    title: 'Overdue Invoices',             Component: OverdueInvoicesCard },
  { kind: 'pinned', id: 'conversion', title: 'Quote-to-Invoice Conversion',  Component: QuoteConversionCard },
  { kind: 'pinned', id: 'crew',       title: 'Crew Utilisation',             Component: CrewUtilisationCard },
  { kind: 'pinned', id: 'jobs',       title: 'Jobs Completed vs At Risk',    Component: JobsCompletedCard, fullWidth: true },
  { kind: 'pinned', id: 'jobsByPriority',  title: 'Jobs by Priority',              Component: JobsByPriorityCard },
  { kind: 'pinned', id: 'jobsByStatus',    title: 'Jobs by Status',                Component: JobsByStatusCard },
  { kind: 'pinned', id: 'jobsByTech',      title: 'Completed Jobs by Technician',  Component: CompletedJobsByTechCard },
  { kind: 'pinned', id: 'monthlyRevOrange',title: 'Monthly Job Revenue (Orange)',  Component: MonthlyJobRevenueOrangeCard },
  { kind: 'pinned', id: 'monthlyRevRed',   title: 'Monthly Job Revenue (Red)',     Component: MonthlyJobRevenueRedCard },
  { kind: 'pinned', id: 'revVsCost',       title: 'Monthly Revenue vs Total Cost', Component: RevenueVsCostCard, fullWidth: true },
  { kind: 'pinned', id: 'jobsTable',       title: 'Jobs Table',                    Component: JobsTableCard, fullWidth: true },
  { kind: 'pinned', id: 'customerGrowth',  title: 'Customer Growth Trend',         Component: CustomerGrowthCard },
  { kind: 'pinned', id: 'revenueMoM',      title: 'Monthly Revenue, MoM, Cumulative', Component: RevenueMoMCard, fullWidth: true },
  { kind: 'pinned', id: 'revenueTable',    title: 'Monthly Job Revenue Table',     Component: RevenueTableCard, fullWidth: true },
];

export function RadarWorkspace({ isOpen, onClose, activeView = 'radar', onViewChange, onOpenCard, showBetaBanner, onCloseBetaBanner, onOpenCardChat, isTrial, isVp, onUpgrade }: RadarWorkspaceProps) {
  const { radars, activeRadarId, removeCardFromRadar } = useRadar();
  const [selectedRadarId] = useState<string | null>(activeRadarId || (radars.length > 0 ? radars[0].id : null));
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [chatCardTitle, setChatCardTitle] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [cardWidths, setCardWidths] = useState<Record<string, boolean>>({});
  const [cardNames, setCardNames] = useState<Record<string, string>>({});
  const [renamingCardId, setRenamingCardId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');
  const [themeName, setThemeName] = useState<'clean' | 'rams' | 'neon'>('clean');
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const themePanelRef = useRef<HTMLDivElement>(null);

  const selectedRadar = radars.find(r => r.id === selectedRadarId);
  const t = RADAR_THEMES[themeName];

  // Build unified card list: saved cards first, then pinned
  const [cardOrder, setCardOrder] = useState<UnifiedCardItem[]>(() => {
    const saved = (selectedRadar?.cards || []).map(data => ({ kind: 'saved' as const, data }));
    return [...saved, ...PINNED_DEFS];
  });

  // Sync new saved cards into the unified list
  useEffect(() => {
    if (!selectedRadar) return;
    setCardOrder(prev => {
      const existingIds = new Set(
        prev.filter(c => c.kind === 'saved').map(c => (c as { kind: 'saved'; data: SavedCard }).data.id)
      );
      const newItems: UnifiedCardItem[] = selectedRadar.cards
        .filter(sc => !existingIds.has(sc.id))
        .map(data => ({ kind: 'saved' as const, data }));
      if (newItems.length === 0) return prev;
      const pinned = prev.filter(c => c.kind === 'pinned');
      const saved = prev.filter(c => c.kind === 'saved');
      return [...saved, ...newItems, ...pinned];
    });
  }, [selectedRadar?.cards.length]);

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshKey(k => k + 1);
    setTimeout(() => { setLastRefreshed(new Date()); setIsRefreshing(false); }, 800);
  }, [isRefreshing]);

  const formatLastRefreshed = (date: Date) => {
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diffSec < 5) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Theme panel outside click
  useEffect(() => {
    if (!showThemePanel) return;
    const handler = (e: MouseEvent) => {
      if (themePanelRef.current && !themePanelRef.current.contains(e.target as Node)) setShowThemePanel(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showThemePanel]);

  // Drag handlers
  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); };
  const handleDrop = (toIdx: number) => {
    if (draggedIdx === null || draggedIdx === toIdx) { setDraggedIdx(null); setDragOverIdx(null); return; }
    setCardOrder(prev => {
      const next = [...prev];
      const [item] = next.splice(draggedIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
    setDraggedIdx(null); setDragOverIdx(null);
  };

  const getCardId = (item: UnifiedCardItem) =>
    item.kind === 'saved' ? `saved-${item.data.id}` : `pinned-${item.id}`;

  const getDisplayTitle = (item: UnifiedCardItem) => {
    const id = getCardId(item);
    return cardNames[id] || (item.kind === 'pinned' ? item.title : item.data.title || '');
  };

  const startRename = (item: UnifiedCardItem) => {
    const id = getCardId(item);
    setRenamingCardId(id);
    setRenameInputValue(getDisplayTitle(item));
  };

  const submitRename = (item: UnifiedCardItem) => {
    const id = getCardId(item);
    if (renameInputValue.trim()) {
      setCardNames(prev => ({ ...prev, [id]: renameInputValue.trim() }));
    }
    setRenamingCardId(null);
  };

  const cancelRename = () => setRenamingCardId(null);

  if (!isOpen) return null;

  const isFullWidth = (item: UnifiedCardItem) => {
    const id = getCardId(item);
    if (id in cardWidths) return cardWidths[id];
    if (item.kind === 'saved') return isDSOChart(item.data);
    return !!item.fullWidth;
  };

  const toggleCardWidth = (item: UnifiedCardItem) => {
    const id = getCardId(item);
    setCardWidths(prev => ({ ...prev, [id]: !isFullWidth(item) }));
  };

  const removePinnedCard = (pinnedId: string) => {
    setCardOrder(prev => prev.filter(c => !(c.kind === 'pinned' && c.id === pinnedId)));
  };

  return (
    <RadarThemeContext.Provider value={t}>
      <div
        className="flex-1 flex overflow-hidden gap-2"
        style={{ fontFamily: t.fontFamily }}
      >
        {/* Main section */}
        <div
          className="flex-1 flex flex-col overflow-hidden min-w-0"
          style={{ background: t.pageBg }}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex flex-col bg-white">
            {/* Row 1: switcher + refreshed timestamp — matches chat header exactly */}
            <div className="h-[56px] flex items-center justify-between px-6 flex-shrink-0 border-b border-[#E6E8EC] relative">
              <div className="w-[120px]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="inline-flex items-center bg-[#F8F9FB] rounded-lg p-1 gap-1">
                  <button
                    onClick={() => onViewChange?.('chat')}
                    className={`px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200 ${activeView === 'chat' ? 'bg-white text-[#1C1E21] shadow-sm' : 'text-[#6B7280] hover:text-[#1C1E21]'}`}
                  >Chat</button>
                  <button
                    onClick={() => onViewChange?.('radar')}
                    className={`px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200 ${activeView === 'radar' ? 'bg-white text-[#1C1E21] shadow-sm' : 'text-[#6B7280] hover:text-[#1C1E21]'}`}
                  >Radar</button>
                </div>
              </div>
              <div className="w-auto flex items-center justify-end gap-3">
                {isTrial && (
                  <button onClick={onUpgrade} className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full bg-white border border-[#E6E8EC] hover:border-[#D1D5DB] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FD5000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span className="text-[12px] font-medium text-[#44403C]">Trial ends in 10 days</span>
                  </button>
                )}
                {isVp && (
                  <button onClick={onUpgrade} className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full bg-white border border-[#E6E8EC] hover:border-[#D1D5DB] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span className="text-[12px] font-medium text-[#44403C]">Trial period has ended</span>
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: toolbar — no border below, line above comes from Row 1's border-b */}
            <div className="flex items-center justify-end px-5 pt-3 pb-3 gap-1.5">
              <div className="flex items-center gap-1.5">
                <DateFilter />
                <div className="relative" ref={themePanelRef}>
                  <button
                    onClick={() => setShowThemePanel(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors duration-150"
                    style={{ background: showThemePanel ? t.controlHoverBg : t.headerBg, borderColor: t.headerBorder, color: t.controlColor }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = showThemePanel ? '#F3F4F6' : t.headerBg; }}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Theme</span>
                  </button>
                  <AnimatePresence>
                    {showThemePanel && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-1.5 p-1.5 z-50 w-[210px]"
                        style={{ background: '#FFFFFF', border: '1px solid #E6E8EC', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
                      >
                        {([
                          { key: 'clean', desc: 'Minimal & light' },
                          { key: 'rams',  desc: 'Braun · Less but better' },
                          { key: 'neon',  desc: 'Dark · Electric glow' },
                        ] as const).map(({ key: tn, desc }) => {
                          const th = RADAR_THEMES[tn];
                          return (
                            <button
                              key={tn}
                              onClick={() => { setThemeName(tn); setShowThemePanel(false); }}
                              className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg transition-colors text-left"
                              style={{ background: themeName === tn ? '#F3F4F6' : 'transparent' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#F3F4F6')}
                              onMouseLeave={e => (e.currentTarget.style.background = themeName === tn ? '#F3F4F6' : 'transparent')}
                            >
                              {/* Swatch */}
                              <div
                                className="w-10 h-10 flex-shrink-0 flex flex-col gap-0.5 items-center justify-center overflow-hidden"
                                style={{
                                  background: th.pageBg,
                                  border: tn === 'rams' ? '1.5px solid #0A0A0A' : tn === 'neon' ? '1px solid #2A2A6A' : '1px solid #E6E8EC',
                                  borderRadius: tn === 'rams' ? '0px' : tn === 'neon' ? '4px' : '8px',
                                  boxShadow: tn === 'neon' ? '0 0 8px rgba(123,63,255,0.4)' : 'none',
                                }}
                              >
                                <div className="w-6 h-2" style={{ background: th.cardBg, border: tn === 'rams' ? '1px solid #0A0A0A' : tn === 'neon' ? '1px solid #7B3FFF' : '1px solid #E6E8EC', borderRadius: tn === 'rams' ? '0' : tn === 'neon' ? '2px' : '3px' }} />
                                <div className="w-6 h-0.5" style={{ background: th.accentColor, opacity: 0.9 }} />
                              </div>
                              <div className="min-w-0">
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', margin: 0 }}>{th.name}</p>
                                <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{desc}</p>
                              </div>
                              {themeName === tn && <Check className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-[#1C1E21]" />}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors duration-150 disabled:opacity-50"
                  style={{ background: t.headerBg, borderColor: t.headerBorder, color: t.controlColor }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = t.headerBg; }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
            <div className="max-w-[1400px] mx-auto px-8 pt-4 pb-20">

              {/* ── Cards ── */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <SenseAlertCard
                    title="Stuck Quotes"
                    dateRange="Sent 7+ days, no response"
                    label="STUCK VALUE"
                    value="$84"
                    valueUnit="K"
                    accent="#F59E0B"
                    icon={<FileText className="w-4 h-4" />}
                    trend="12%"
                    trendDirection="up"
                    spark={[3, 4, 3, 5, 6, 5, 7, 8]}
                  />
                  <SenseAlertCard
                    title="Jobs Behind SLA"
                    dateRange="Overdue 2–5 days"
                    label="JOBS"
                    value="4"
                    accent="#EF4444"
                    icon={<Clock className="w-4 h-4" />}
                    trend="8%"
                    trendDirection="up"
                    spark={[1, 2, 2, 3, 2, 3, 4, 4]}
                  />
                  <SenseAlertCard
                    title="Pending Invoices"
                    dateRange="Jobs done, not invoiced"
                    label="PENDING VALUE"
                    value="$42.6"
                    valueUnit="K"
                    accent="#EA580C"
                    icon={<AlertTriangle className="w-4 h-4" />}
                    trend="5%"
                    trendDirection="down"
                    spark={[6, 5, 6, 4, 5, 4, 3, 4]}
                  />
                  <SenseAlertCard
                    title="Revenue Today"
                    value="$12.4"
                    valueUnit="K"
                    accent="#10B981"
                    icon={<TrendingUp className="w-4 h-4" />}
                    trend="9%"
                    trendDirection="up"
                  />
                </div>
              </div>

              <div>

                <motion.div
                  key={refreshKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {cardOrder.map((item, idx) => {
                    const fw = isFullWidth(item);
                    const isDragging = draggedIdx === idx;
                    const isDragTarget = dragOverIdx === idx && draggedIdx !== idx;
                    const itemKey = item.kind === 'saved' ? `saved-${item.data.id}` : `pinned-${item.id}`;
                    const cardTitle = item.kind === 'saved' ? (item.data.title || '') : item.title;
                    const isActiveInChat = chatCardTitle !== null && cardTitle === chatCardTitle;

                    return (
                      <motion.div
                        key={itemKey}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        className={`relative group/card transition-all duration-200 ${fw ? 'md:col-span-2' : ''}`}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={e => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
                        onClick={() => { setChatCardTitle(cardTitle); onOpenCardChat?.(cardTitle); }}
                        style={{
                          opacity: isDragging ? 0.35 : 1,
                          outline: isDragTarget ? `2px solid ${t.accentColor}` : isActiveInChat ? '2px solid #6D5F63' : 'none',
                          outlineOffset: '2px',
                          borderRadius: t.cardRadius,
                          cursor: 'pointer',
                          boxShadow: isActiveInChat ? '0 0 0 4px rgba(109,95,99,0.12)' : undefined,
                        }}
                      >
                        {/* Hover reorder grip */}
                        <div
                          className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center h-5 w-8 rounded-full cursor-grab opacity-0 group-hover/card:opacity-100 transition-opacity duration-150"
                          style={{ background: '#FFFFFF', border: `1px solid ${t.headerBorder || '#E6E8EC'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
                          onClick={(e) => e.stopPropagation()}
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-3 h-3" style={{ color: t.subtitleColor }} />
                        </div>

                        {/* Right edge resize handle */}
                        <div
                          className="absolute top-0 -right-[6px] w-3 h-full z-30 cursor-col-resize flex items-center justify-center opacity-0 group-hover/card:opacity-60 hover:!opacity-100 transition-opacity duration-150"
                          onClick={(e) => { e.stopPropagation(); toggleCardWidth(item); }}
                          title={isFullWidth(item) ? 'Shrink' : 'Expand'}
                        >
                          <div className="w-1 h-10 rounded-full" style={{ background: t.subtitleColor }} />
                        </div>
                        {/* Bottom-right corner resize */}
                        <div
                          className="absolute -bottom-[6px] -right-[6px] w-4 h-4 z-30 cursor-nwse-resize opacity-0 group-hover/card:opacity-60 hover:!opacity-100 transition-opacity duration-150"
                          onClick={(e) => { e.stopPropagation(); toggleCardWidth(item); }}
                          title={isFullWidth(item) ? 'Shrink' : 'Expand'}
                        >
                          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 rounded-[1px]" style={{ borderColor: t.subtitleColor }} />
                        </div>

                        {/* Card content */}
                        {item.kind === 'saved' ? (
                          <>
                            {true && (
                              <CardHoverActions
                                onOpenInChat={() => { const ttl = item.data.title || 'this card'; setChatCardTitle(ttl); onOpenCardChat?.(ttl); }}
                                onEdit={() => onOpenCard?.(item.data)}
                                onUnpin={() => removeCardFromRadar(selectedRadarId!, item.data.id)}
                                onResize={() => toggleCardWidth(item)}
                                isFullWidth={isFullWidth(item)}
                              />
                            )}
                            {isDSOChart(item.data) ? (
                              <DSOChartCard
                                footer={
                                  <span style={{ fontSize: 11, color: t.subtitleColor }}>
                                    {(() => {
                                      const end = new Date(item.data.timestamp);
                                      const start = new Date(end);
                                      start.setMonth(start.getMonth() - 3);
                                      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                      return `${fmt(start)} – ${fmt(end)}`;
                                    })()}
                                  </span>
                                }
                                renameProps={{
                                  customTitle: cardNames[getCardId(item)] || undefined,
                                  isRenaming: renamingCardId === getCardId(item),
                                  renameValue: renameInputValue,
                                  onRenameStart: () => startRename(item),
                                  onRenameChange: setRenameInputValue,
                                  onRenameSubmit: () => submitRename(item),
                                  onRenameCancel: cancelRename,
                                }}
                              />
                            ) : (
                              <div className="group/card" style={{ background: t.cardBg, border: t.cardBorder, borderRadius: t.cardRadius, boxShadow: t.cardShadow, padding: 16 }}>
                                {(item.data.type === 'chart' || item.data.type === 'widget') && item.data.content?.chartType && (
                                  <div className="mb-3 rounded-lg overflow-hidden" style={{ background: t.pageBg }}>
                                    {getCardChart(item.data, t.accentColor)}
                                  </div>
                                )}
                                <div className="flex items-center gap-1.5 mb-1 group/rename">
                                  {renamingCardId === getCardId(item) ? (
                                    <input
                                      autoFocus
                                      value={renameInputValue}
                                      onChange={e => setRenameInputValue(e.target.value)}
                                      onKeyDown={e => {
                                        if (e.key === 'Enter') submitRename(item);
                                        if (e.key === 'Escape') cancelRename();
                                      }}
                                      onBlur={() => submitRename(item)}
                                      style={{
                                        fontSize: 13, fontWeight: 600, color: t.titleColor,
                                        background: '#FFFFFF',
                                        border: `1.5px solid ${t.headerBorder || '#E6E8EC'}`,
                                        borderRadius: 6, outline: 'none',
                                        padding: '2px 8px', width: '100%', maxWidth: 400,
                                        fontFamily: t.fontFamily,
                                        boxShadow: `0 0 0 3px ${t.accentColor}22`,
                                      }}
                                    />
                                  ) : (
                                    <>
                                      <h3 style={{ fontSize: 13, fontWeight: 600, color: t.titleColor, margin: 0 }}>{getDisplayTitle(item)}</h3>
                                      <button
                                        onClick={e => { e.stopPropagation(); startRename(item); }}
                                        className="opacity-0 group-hover/rename:opacity-100 transition-opacity duration-150 flex-shrink-0 p-0.5 rounded"
                                        style={{ lineHeight: 0 }}
                                      >
                                        <Pencil className="w-3 h-3" style={{ color: t.subtitleColor }} />
                                      </button>
                                    </>
                                  )}
                                </div>
                                {item.data.preview && (
                                  <p style={{ fontSize: 12, color: t.subtitleColor, margin: 0, lineHeight: 1.5 }} className="line-clamp-2">{item.data.preview}</p>
                                )}
                                <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${t.dividerColor}` }}>
                                  <span style={{ fontSize: 11, color: t.subtitleColor }}>
                                    {(() => {
                                      const end = new Date(item.data.timestamp);
                                      const start = new Date(end);
                                      start.setMonth(start.getMonth() - 3);
                                      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                      return `${fmt(start)} – ${fmt(end)}`;
                                    })()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {true && (
                              <CardHoverActions
                                onOpenInChat={() => { setChatCardTitle(item.title); onOpenCardChat?.(item.title); }}
                                onEdit={() => onOpenCard?.({ id: item.id, type: 'card', content: {}, timestamp: new Date(), title: item.title })}
                                onUnpin={() => removePinnedCard(item.id)}
                                onResize={() => toggleCardWidth(item)}
                                isFullWidth={isFullWidth(item)}
                              />
                            )}
                            <item.Component
                              footer={<span style={{ fontSize: 11, color: t.subtitleColor }}>Dec 11 – Mar 11</span>}
                              renameProps={{
                                customTitle: cardNames[getCardId(item)] || undefined,
                                isRenaming: renamingCardId === getCardId(item),
                                renameValue: renameInputValue,
                                onRenameStart: () => startRename(item),
                                onRenameChange: setRenameInputValue,
                                onRenameSubmit: () => submitRename(item),
                                onRenameCancel: cancelRename,
                              }}
                            />
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </RadarThemeContext.Provider>
  );
}
