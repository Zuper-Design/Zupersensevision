import { ExternalLink, RefreshCw, FileText, Clock, AlertTriangle, Sparkles, ArrowRight, MoreHorizontal, Pencil, PinOff, GripVertical, LayoutGrid, Check, X, FlaskConical, Maximize2, Minimize2, TrendingUp } from 'lucide-react';
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
  isAU?: boolean;
  onUpgrade?: () => void;
  themeName?: 'clean' | 'rams' | 'neon';
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
      <div className="p-5 flex flex-col h-full">
        {/* Header: icon + label */}
        <div className="flex items-center gap-2.5">
          {icon && (
            <div
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `${accent}14`, color: accent }}
            >
              {icon}
            </div>
          )}
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: t.subtitleColor, textTransform: 'uppercase', margin: 0 }}>{title}</p>
        </div>

        {/* Value */}
        <p
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: t.valueColor,
            margin: '14px 0 0 0',
            lineHeight: 1,
            letterSpacing: '-0.025em',
          }}
        >
          {value}
          {valueUnit && (
            <span style={{ fontSize: 18, fontWeight: 600, marginLeft: 2, color: t.subtitleColor }}>{valueUnit}</span>
          )}
        </p>

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <span
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
              style={{ background: `${trendColor}1A`, color: trendColor, fontSize: 11, fontWeight: 600, lineHeight: 1 }}
            >
              {isUp ? '↑' : '↓'} {trend}
            </span>
            <span style={{ fontSize: 11, color: t.subtitleColor }}>vs last period</span>
          </div>
        )}
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
      <DateFilter size="sm" />

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

export function RadarWorkspace({ isOpen, onClose, activeView = 'radar', onViewChange, onOpenCard, showBetaBanner, onCloseBetaBanner, onOpenCardChat, isTrial, isVp, isAU, onUpgrade, themeName: themeNameProp = 'clean' }: RadarWorkspaceProps) {
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
  const themeName = themeNameProp;
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const tmr = setTimeout(() => setLoading(false), 4000);
    return () => clearTimeout(tmr);
  }, []);

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
              <div className="w-auto flex items-center justify-end gap-2">
                {isTrial && (
                  <button onClick={onUpgrade} className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full border transition-colors" style={{ background: '#FFF8F2', borderColor: '#F5E0CF' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FD5000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span className="text-[12px] font-medium text-[#44403C]">Trial ends in 10 days</span>
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: toolbar — no border below, line above comes from Row 1's border-b */}
            <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between px-8 pt-3 pb-3 gap-1.5">
              <div className="flex items-center gap-1.5">
                <DateFilter />
                {isVp && (
                  <button onClick={onUpgrade} className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors">
                    <span className="text-[13px] font-medium text-[#1C1E21]">Your trial has ended.</span>
                    <span className="text-[13px] text-[#6B7280] ml-1">Upgrade Sense to continue asking questions.</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-neutral-400 whitespace-nowrap">
                  {isRefreshing ? 'Updating…' : `Updated ${formatLastRefreshed(lastRefreshed)}`}
                </span>

                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  aria-label="Refresh"
                  title="Refresh"
                  className="flex items-center justify-center w-9 h-9 rounded-lg border transition-colors duration-150 disabled:opacity-50"
                  style={{ background: t.headerBg, borderColor: t.headerBorder, color: '#1C1E21' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = t.headerBg; }}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
            <div className="max-w-[1400px] mx-auto px-8 pt-4 pb-20">

{/* skeleton shimmer keyframes */}
              <style>{`
                @keyframes radar-shimmer { 0% { background-position: -600px 0; } 100% { background-position: 600px 0; } }
                .radar-skel { background: linear-gradient(90deg, #D1D5DB 0%, #F3F4F6 50%, #D1D5DB 100%); background-size: 1200px 100%; animation: radar-shimmer 1.6s linear infinite; }
              `}</style>

              {isAU ? (
                <RadarEmptyState onCTA={() => onViewChange?.('chat')} accentColor={t.accentColor} theme={t} />
              ) : (
                <div>

              {/* ── Cards ── */}
              <div className="mb-8">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[0,1,2,3].map(i => (
                      <div key={i} className="rounded-xl border border-[#E6E8EC] bg-white p-5 animate-pulse" style={{ minHeight: 130 }}>
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-7 h-7 rounded-lg radar-skel" />
                          <div className="h-2.5 w-24 rounded radar-skel" />
                        </div>
                        <div className="h-7 w-28 rounded radar-skel mb-3" />
                        <div className="h-3 w-32 rounded radar-skel" />
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
              </div>

              <div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cardOrder.map((it, i) => {
                      const fw = isFullWidth(it);
                      return (
                        <div key={i} className={`rounded-xl border border-[#E6E8EC] bg-white p-5 animate-pulse ${fw ? 'md:col-span-2' : ''}`} style={{ minHeight: 320 }}>
                          <div className="h-3 w-40 rounded radar-skel mb-2" />
                          <div className="h-2.5 w-56 rounded radar-skel mb-6" />
                          <div className="h-[220px] rounded-lg radar-skel" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
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
                )}
              </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </RadarThemeContext.Provider>
  );
}

function RadarEmptyState({ onCTA, accentColor = '#FD5000', theme }: { onCTA?: () => void; accentColor?: string; theme?: RadarThemeConfig }) {
  const t = theme;

  // Detect dark theme from page background luminance
  const pageBgHex = (t?.pageBg ?? '#FFFFFF').replace('#', '');
  const isDark = parseInt(pageBgHex.slice(0, 2), 16) < 100;

  // Card surface
  const cardFill = t?.cardBg ?? '#FFFFFF';
  const cardStroke = t ? t.cardBorder.replace(/^[\d.]+px\s+solid\s+/, '') : '#E2E8F0';
  const cardStrokeW = t ? parseFloat(t.cardBorder.split('px')[0]) * 0.6 : 0.75;

  // Text
  const textPrimary = t?.titleColor ?? '#0F172A';

  // Derived illustration palette (light vs dark branch, with warm offset for rams)
  const isWarm = !isDark && parseInt(pageBgHex.slice(4, 6), 16) < parseInt(pageBgHex.slice(0, 2), 16);
  const skelColor  = isDark ? '#252558' : isWarm ? '#C4BEB0' : '#DCE3ED';
  const gridColor  = isDark ? '#141445' : isWarm ? '#D0C8BC' : '#EEF0F4';
  const gridAxis   = isDark ? '#1E1E50' : isWarm ? '#C0B8A8' : '#E2E8F0';
  const dotColor   = isDark ? '#222268' : isWarm ? '#B8B0A0' : '#CBD5E1';

  // Button gradient
  const btnBg = isDark
    ? `linear-gradient(135deg, ${t?.accentColor ?? '#7B3FFF'}, ${t?.accentColor ?? '#7B3FFF'}BB)`
    : 'linear-gradient(to right, #221E1F, #6D5F63)';

  return (
    <div className="w-full flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 220px)', paddingTop: 24, paddingBottom: 64 }}>
      <div className="relative" style={{ width: 500, height: 380 }}>
        <svg width="500" height="380" viewBox="-20 -20 500 380" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* dot grid pattern */}
            <pattern id="rdGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.7" fill={dotColor} />
            </pattern>
            {/* background radial atmosphere — uses accent color as subtle wash */}
            <radialGradient id="rdBg" cx="50%" cy="38%" r="58%">
              <stop offset="0%" stopColor={accentColor} stopOpacity={isDark ? 0.1 : 0.06} />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
            </radialGradient>
            {/* card subtle gradient */}
            <linearGradient id="rdCard" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={cardFill} />
              <stop offset="100%" stopColor={cardFill} stopOpacity="0.96" />
            </linearGradient>
            {/* bar gradient — regular */}
            <linearGradient id="rdBarA" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.06" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.52" />
            </linearGradient>
            {/* bar gradient — highlighted (tallest bar) */}
            <linearGradient id="rdBarB" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.12" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.78" />
            </linearGradient>
            {/* area fill */}
            <linearGradient id="rdAreaA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
            {/* KPI card shadow */}
            <filter id="rdShadow" x="-24%" y="-24%" width="148%" height="148%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#1E293B" floodOpacity="0.07" />
            </filter>
            {/* chart card shadow — slightly deeper */}
            <filter id="rdShadowLg" x="-20%" y="-16%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="10" floodColor="#1E293B" floodOpacity="0.09" />
            </filter>
          </defs>

          {/* Background: dot grid texture */}
          <rect x="-20" y="-20" width="500" height="380" fill="url(#rdGrid)" opacity="0.22" />
          {/* Background: soft radial light */}
          <rect x="-20" y="-20" width="500" height="380" fill="url(#rdBg)" />

          {/* ── KPI tile 1 — revenue / green ── */}
          <g filter="url(#rdShadow)" className="rd-tile rd-t1">
            <rect x="8" y="8" width="142" height="92" rx="13" fill="url(#rdCard)" stroke={cardStroke} strokeWidth={cardStrokeW} />
            {/* colored category badge */}
            <rect x="20" y="20" width="50" height="14" rx="7" fill="#10B981" opacity="0.1" />
            <rect x="27" y="25.5" width="36" height="3" rx="1.5" fill="#10B981" opacity="0.55" />
            {/* subtitle line */}
            <rect x="20" y="41" width="54" height="3" rx="1.5" fill={skelColor} />
            {/* metric value */}
            <text x="20" y="70" fontFamily="system-ui, -apple-system, sans-serif" fontSize="22" fontWeight="700" fill={textPrimary} letterSpacing="-0.5">$284K</text>
            {/* up-arrow + delta bar */}
            <polygon points="23,83 20,88 26,88" fill="#10B981" />
            <rect x="30" y="81" width="38" height="3" rx="1.5" fill="#10B981" opacity="0.4" />
            {/* mini sparkline — uptrend */}
            <path d="M102 86 L110 79 L118 83 L126 74 L134 77" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
          </g>

          {/* ── KPI tile 2 — tickets / red ── */}
          <g filter="url(#rdShadow)" className="rd-tile rd-t2">
            <rect x="160" y="8" width="142" height="92" rx="13" fill="url(#rdCard)" stroke={cardStroke} strokeWidth={cardStrokeW} />
            <rect x="172" y="20" width="50" height="14" rx="7" fill="#EF4444" opacity="0.1" />
            <rect x="179" y="25.5" width="36" height="3" rx="1.5" fill="#EF4444" opacity="0.5" />
            <rect x="172" y="41" width="54" height="3" rx="1.5" fill={skelColor} />
            <text x="172" y="70" fontFamily="system-ui, -apple-system, sans-serif" fontSize="22" fontWeight="700" fill={textPrimary} letterSpacing="-0.5">12</text>
            {/* down-arrow + delta bar */}
            <polygon points="175,88 172,83 178,83" fill="#EF4444" />
            <rect x="182" y="81" width="36" height="3" rx="1.5" fill="#EF4444" opacity="0.4" />
            {/* mini sparkline — downtrend */}
            <path d="M250 76 L258 80 L266 77 L274 83 L282 87" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
          </g>

          {/* ── KPI tile 3 — conversion / accent ── */}
          <g filter="url(#rdShadow)" className="rd-tile rd-t3">
            <rect x="312" y="8" width="140" height="92" rx="13" fill="url(#rdCard)" stroke={cardStroke} strokeWidth={cardStrokeW} />
            <rect x="324" y="20" width="50" height="14" rx="7" fill={accentColor} opacity="0.1" />
            <rect x="331" y="25.5" width="36" height="3" rx="1.5" fill={accentColor} opacity="0.5" />
            <rect x="324" y="41" width="54" height="3" rx="1.5" fill={skelColor} />
            <text x="324" y="70" fontFamily="system-ui, -apple-system, sans-serif" fontSize="22" fontWeight="700" fill={textPrimary} letterSpacing="-0.5">91%</text>
            {/* up-arrow + delta bar */}
            <polygon points="327,83 324,88 330,88" fill={accentColor} />
            <rect x="334" y="81" width="42" height="3" rx="1.5" fill={accentColor} opacity="0.38" />
            {/* mini sparkline — uptrend steep */}
            <path d="M398 86 L406 81 L414 75 L422 71 L430 67" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
          </g>

          {/* ── Bar chart card ── */}
          <g filter="url(#rdShadowLg)" className="rd-tile rd-t4">
            <rect x="8" y="112" width="220" height="220" rx="14" fill="url(#rdCard)" stroke={cardStroke} strokeWidth={cardStrokeW} />
            {/* header */}
            <rect x="20" y="127" width="96" height="6" rx="3" fill={textPrimary} opacity="0.75" />
            <rect x="20" y="140" width="70" height="4" rx="2" fill={skelColor} />
            {/* chart-type mini icon (bar chart) */}
            <rect x="196" y="124" width="18" height="18" rx="5" fill={skelColor} opacity="0.6" />
            <rect x="199" y="134" width="3" height="5" rx="1" fill={textPrimary} opacity="0.25" />
            <rect x="204" y="130" width="3" height="9" rx="1" fill={textPrimary} opacity="0.25" />
            <rect x="209" y="136" width="3" height="3" rx="1" fill={textPrimary} opacity="0.25" />
            {/* gridlines — 32px even intervals, axis at 288 */}
            <line x1="22" y1="160" x2="216" y2="160" stroke={gridColor} strokeWidth="1" />
            <line x1="22" y1="192" x2="216" y2="192" stroke={gridColor} strokeWidth="1" />
            <line x1="22" y1="224" x2="216" y2="224" stroke={gridColor} strokeWidth="1" />
            <line x1="22" y1="256" x2="216" y2="256" stroke={gridColor} strokeWidth="1" />
            <line x1="22" y1="288" x2="216" y2="288" stroke={gridAxis} strokeWidth="1" />
            {/* bars — 5 bars, bar 4 is tallest and uses stronger gradient rdBarB */}
            <rect x="38"  y="220" width="24" height="68"  rx="4" fill="url(#rdBarA)" style={{ animation: 'rd-bar 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite',          transformOrigin: '50px 288px' }} />
            <rect x="74"  y="186" width="24" height="102" rx="4" fill="url(#rdBarA)" style={{ animation: 'rd-bar 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite 0.18s',     transformOrigin: '86px 288px' }} />
            <rect x="110" y="234" width="24" height="54"  rx="4" fill="url(#rdBarA)" style={{ animation: 'rd-bar 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite 0.36s',     transformOrigin: '122px 288px' }} />
            <rect x="146" y="172" width="24" height="116" rx="4" fill="url(#rdBarB)" style={{ animation: 'rd-bar 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite 0.54s',     transformOrigin: '158px 288px' }} />
            <rect x="182" y="206" width="24" height="82"  rx="4" fill="url(#rdBarA)" style={{ animation: 'rd-bar 2.2s cubic-bezier(0.45, 0, 0.55, 1) infinite 0.72s',     transformOrigin: '194px 288px' }} />
            {/* footer divider + labels */}
            <line x1="20" y1="304" x2="216" y2="304" stroke={gridAxis} strokeWidth="1" />
            <rect x="20" y="312" width="56" height="3" rx="1.5" fill={skelColor} />
            <rect x="20" y="318" width="36" height="3" rx="1.5" fill={gridColor} />
            {/* refresh badge */}
            <rect x="188" y="308" width="20" height="16" rx="5" fill={skelColor} opacity="0.4" stroke={cardStroke} strokeWidth={cardStrokeW} />
            <circle cx="198" cy="316" r="3" fill="none" stroke={textPrimary} strokeWidth="1.2" opacity="0.3" />
          </g>

          {/* ── Line/area chart card ── */}
          <g filter="url(#rdShadowLg)" className="rd-tile rd-t5">
            <rect x="238" y="112" width="214" height="220" rx="14" fill="url(#rdCard)" stroke={cardStroke} strokeWidth={cardStrokeW} />
            {/* header */}
            <rect x="250" y="127" width="104" height="6" rx="3" fill={textPrimary} opacity="0.75" />
            <rect x="250" y="140" width="76" height="4" rx="2" fill={skelColor} />
            {/* chart-type mini icon (line chart) */}
            <rect x="420" y="124" width="18" height="18" rx="5" fill={skelColor} opacity="0.6" />
            <path d="M423 137 L427 132 L431 134 L435 129" fill="none" stroke={textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
            {/* gridlines — x2=440 matches inner right */}
            <line x1="252" y1="182" x2="440" y2="182" stroke={gridColor} strokeWidth="1" />
            <line x1="252" y1="216" x2="440" y2="216" stroke={gridColor} strokeWidth="1" />
            <line x1="252" y1="250" x2="440" y2="250" stroke={gridColor} strokeWidth="1" />
            <line x1="252" y1="284" x2="440" y2="284" stroke={gridAxis} strokeWidth="1" />
            {/* area fill */}
            <path d="M256 256 L284 226 L312 240 L340 198 L368 214 L396 178 L424 196 L424 284 L256 284 Z" fill="url(#rdAreaA)" />
            {/* line */}
            <path d="M256 256 L284 226 L312 240 L340 198 L368 214 L396 178 L424 196"
              fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="320" strokeDashoffset="320"
              style={{ animation: 'rd-line-loop 6s linear infinite 0.34s' }} />
            {/* peak highlight dot */}
            <circle cx="396" cy="178" r="3.5" fill="white" stroke="#3B82F6" strokeWidth="1.5" opacity="0.85" />
            {/* end dot — animated */}
            <circle cx="424" cy="196" r="4" fill="#3B82F6" style={{ animation: 'rd-dot 1.8s ease-in-out infinite', transformBox: 'fill-box', transformOrigin: 'center' }} />
            {/* footer divider + labels */}
            <line x1="250" y1="304" x2="440" y2="304" stroke={gridAxis} strokeWidth="1" />
            <rect x="250" y="312" width="56" height="3" rx="1.5" fill={skelColor} />
            <rect x="250" y="318" width="36" height="3" rx="1.5" fill={gridColor} />
            {/* refresh badge — right-aligned with inner right (440) */}
            <rect x="418" y="308" width="20" height="16" rx="5" fill={skelColor} opacity="0.4" stroke={cardStroke} strokeWidth={cardStrokeW} />
            <circle cx="428" cy="316" r="3" fill="none" stroke={textPrimary} strokeWidth="1.2" opacity="0.3" />
          </g>

          {/* ── Decorative accents ── */}
          {/* top-right sparkle */}
          <circle cx="450" cy="7" r="3" fill={accentColor} opacity="0.5">
            <animate attributeName="opacity" values="0.18;0.85;0.18" dur="2.4s" repeatCount="indefinite" />
          </circle>
          {/* bottom-left sparkle */}
          <circle cx="8" cy="332" r="3" fill="#3B82F6" opacity="0.38">
            <animate attributeName="opacity" values="0.12;0.65;0.12" dur="2.8s" repeatCount="indefinite" begin="0.6s" />
          </circle>
          {/* cross accent — right gutter */}
          <line x1="455" y1="194" x2="455" y2="204" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.32" />
          <line x1="450" y1="199" x2="460" y2="199" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.32" />
          {/* small connector dots between KPI tiles */}
          <circle cx="154" cy="54" r="1.8" fill="#94A3B8" opacity="0.28" />
          <circle cx="308" cy="54" r="1.8" fill="#94A3B8" opacity="0.28" />
        </svg>
        <style>{`
          @keyframes rd-bar { 0%, 100% { transform: scaleY(0.82); } 50% { transform: scaleY(1.0); } }
          @keyframes rd-line-loop {
            0%, 17%  { stroke-dashoffset: 320; animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
            52%      { stroke-dashoffset: 0; animation-timing-function: linear; }
            82%      { stroke-dashoffset: 0; animation-timing-function: linear; }
            100%     { stroke-dashoffset: 320; }
          }
          @keyframes rd-dot { 0%, 100% { opacity: 0.3; transform: scale(0.75); } 50% { opacity: 1; transform: scale(1.35); } }

          .rd-tile {
            opacity: 0;
            transform-box: fill-box;
            transform-origin: center;
            animation-fill-mode: both;
            animation-duration: 6s;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
          }
          /* 0–18% assemble (~1.1s, eased), 18–82% hold with gentle float, 82–100% disassemble (~1.1s, eased) */
          @keyframes rd-assemble-tl {
            0%   { opacity: 0; transform: translate(-90px, -60px) scale(0.85) rotate(-6deg); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
            18%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            50%  { opacity: 1; transform: translate(-1px, -5px) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            82%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.64, 0, 0.78, 0); }
            100% { opacity: 0; transform: translate(-90px, -60px) scale(0.85) rotate(-6deg); }
          }
          @keyframes rd-assemble-t {
            0%   { opacity: 0; transform: translate(0, -90px) scale(0.85); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
            18%  { opacity: 1; transform: translate(0, 0) scale(1); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            50%  { opacity: 1; transform: translate(0, -6px) scale(1); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            82%  { opacity: 1; transform: translate(0, 0) scale(1); animation-timing-function: cubic-bezier(0.64, 0, 0.78, 0); }
            100% { opacity: 0; transform: translate(0, -90px) scale(0.85); }
          }
          @keyframes rd-assemble-tr {
            0%   { opacity: 0; transform: translate(90px, -60px) scale(0.85) rotate(6deg); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
            18%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            50%  { opacity: 1; transform: translate(1px, -5px) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            82%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.64, 0, 0.78, 0); }
            100% { opacity: 0; transform: translate(90px, -60px) scale(0.85) rotate(6deg); }
          }
          @keyframes rd-assemble-bl {
            0%   { opacity: 0; transform: translate(-100px, 70px) scale(0.85) rotate(-4deg); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
            18%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            50%  { opacity: 1; transform: translate(-1px, -4px) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            82%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.64, 0, 0.78, 0); }
            100% { opacity: 0; transform: translate(-100px, 70px) scale(0.85) rotate(-4deg); }
          }
          @keyframes rd-assemble-br {
            0%   { opacity: 0; transform: translate(100px, 70px) scale(0.85) rotate(4deg); animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
            18%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            50%  { opacity: 1; transform: translate(1px, -4px) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.45, 0, 0.55, 1); }
            82%  { opacity: 1; transform: translate(0, 0) scale(1) rotate(0); animation-timing-function: cubic-bezier(0.64, 0, 0.78, 0); }
            100% { opacity: 0; transform: translate(100px, 70px) scale(0.85) rotate(4deg); }
          }

          .rd-t1 { animation-name: rd-assemble-tl; animation-delay: 0.05s; }
          .rd-t2 { animation-name: rd-assemble-t;  animation-delay: 0.18s; }
          .rd-t3 { animation-name: rd-assemble-tr; animation-delay: 0.10s; }
          .rd-t4 { animation-name: rd-assemble-bl; animation-delay: 0.28s; }
          .rd-t5 { animation-name: rd-assemble-br; animation-delay: 0.34s; }
        `}</style>
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 700, color: textPrimary, marginTop: 24, marginBottom: 8, letterSpacing: '-0.01em' }}>
        Welcome to Radar
      </h2>
      <p style={{ fontSize: 15, color: t?.subtitleColor ?? '#6B7280', maxWidth: 460, lineHeight: 1.55, margin: 0 }}>
        Your always-on view of what matters in the business. Pin charts, KPIs, and answers from Sense. Radar keeps them updated so you spot what's working and what needs a nudge.
      </p>

      <button
        onClick={onCTA}
        className="inline-flex items-center gap-2 mt-7 px-5 py-2.5 rounded-xl text-white transition-transform duration-150 hover:-translate-y-[1px] active:scale-[0.97] active:translate-y-0"
        style={{
          fontSize: 14,
          fontWeight: 600,
          background: btnBg,
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        }}
      >
        Ask Sense to build your Radar
      </button>
    </div>
  );
}
