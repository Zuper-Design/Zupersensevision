import { ExternalLink, RefreshCw, FileText, Clock, AlertTriangle, Sparkles, ArrowRight, MoreHorizontal, Pencil, PinOff, GripVertical, LayoutGrid, Check, Palette, X, FlaskConical, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRadar, SavedCard } from './RadarContext';
import { DSOChartCard } from './DSOChartCard';
import { RevenueMTDCard, OverdueInvoicesCard, QuoteConversionCard, CrewUtilisationCard, JobsCompletedCard, RenameProps } from './RadarCards';
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

// Sense Alert Card — horizontal card style
function SenseAlertCard({ icon, iconBg, iconColor, title, value, subtitle, cta }: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  subtitle: string;
  cta: string;
}) {
  const t = useRadarTheme();
  return (
    <div
      className="flex-1 min-w-0 flex flex-col gap-3 p-4 cursor-pointer group/alert transition-all duration-150"
      style={{
        backgroundColor: t.cardBg,
        border: t.cardBorder,
        borderRadius: t.cardRadius,
        boxShadow: t.cardShadow,
        fontFamily: t.fontFamily,
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = t.cardHoverShadow)}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = t.cardShadow)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
            <div style={{ color: iconColor }}>{icon}</div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.titleColor }}>{title}</span>
        </div>
        <button
          className="flex items-center gap-1 flex-shrink-0 transition-colors"
          style={{ fontSize: 11, fontWeight: 600, color: t.accentColor, background: t.accentBg, padding: '3px 8px', borderRadius: 6 }}
        >
          {cta} <ArrowRight className="w-2.5 h-2.5" />
        </button>
      </div>
      <div>
        <p style={{ fontSize: 20, fontWeight: 700, color: t.valueColor, margin: 0, lineHeight: 1.2 }}>{value}</p>
        <p style={{ fontSize: 11, color: t.subtitleColor, margin: 0, marginTop: 2 }}>{subtitle}</p>
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
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useRadarTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-150">
      <button
        onClick={(e) => { e.stopPropagation(); onOpenInChat?.(); }}
        className="flex items-center gap-1.5 px-2.5 h-7 rounded-lg border border-transparent transition-all duration-150"
        style={{ fontSize: 12, fontWeight: 500, color: t.subtitleColor, background: t.cardBg }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = t.headerBorder;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
        }}
      >
        <ExternalLink className="w-3 h-3" />
        <span>Open in Chat</span>
      </button>

      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o); }}
          className="flex items-center justify-center h-7 w-7 rounded-lg border border-transparent transition-all duration-150"
          style={{ color: t.subtitleColor, background: t.cardBg }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.borderColor = t.headerBorder;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
          }}
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
              style={{ background: t.cardBg, border: t.cardBorder, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); onEdit?.(); setMenuOpen(false); }}
                className="w-full px-3 py-2 flex items-center gap-2.5 transition-colors duration-100 text-left"
                style={{ color: t.titleColor }}
                onMouseEnter={e => (e.currentTarget.style.background = t.controlBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Pencil className="w-3.5 h-3.5" style={{ color: t.subtitleColor }} />
                <span style={{ fontSize: 13 }}>Start new</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onResize?.(); setMenuOpen(false); }}
                className="w-full px-3 py-2 flex items-center gap-2.5 transition-colors duration-100 text-left"
                style={{ color: t.titleColor }}
                onMouseEnter={e => (e.currentTarget.style.background = t.controlBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {isFullWidth
                  ? <Minimize2 className="w-3.5 h-3.5" style={{ color: t.subtitleColor }} />
                  : <Maximize2 className="w-3.5 h-3.5" style={{ color: t.subtitleColor }} />
                }
                <span style={{ fontSize: 13 }}>{isFullWidth ? 'Half' : 'Full row'}</span>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onUnpin?.(); setMenuOpen(false); }}
                className="w-full px-3 py-2 flex items-center gap-2.5 transition-colors duration-100 text-left"
                onMouseEnter={e => (e.currentTarget.style.background = '#FEF2F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <PinOff className="w-3.5 h-3.5 text-red-500" />
                <span style={{ fontSize: 13, color: '#DC2626' }}>Unpin</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
];

export function RadarWorkspace({ isOpen, onClose, activeView = 'radar', onViewChange, onOpenCard, showBetaBanner, onCloseBetaBanner }: RadarWorkspaceProps) {
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

  return (
    <RadarThemeContext.Provider value={t}>
      <div
        className="flex-1 flex overflow-hidden gap-2"
        style={{ fontFamily: t.fontFamily }}
      >
        {/* Main section */}
        <div
          className="flex-1 flex flex-col overflow-hidden rounded-xl min-w-0"
          style={{ background: t.pageBg, border: `1px solid ${t.headerBorder}` }}
        >
          {/* Header */}
          <div className="flex-shrink-0 flex flex-col bg-white">
            {/* Beta banner */}
            {showBetaBanner && (
              <div className="flex-shrink-0 relative flex items-center justify-center px-10 py-2" style={{ background: '#1C1E21' }}>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#FD5000' }} />
                  <p className="text-[12px]" style={{ color: '#E5E7EB', fontFamily: 'DM Sans, system-ui, sans-serif', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Sense is in Beta</span>
                    <span style={{ color: '#9CA3AF' }}> — you're one of the first. Expect changes; your feedback shapes what's next.</span>
                  </p>
                </div>
                <button
                  onClick={onCloseBetaBanner}
                  className="absolute right-3 p-1 rounded transition-colors duration-150 hover:bg-white/10"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5" style={{ color: '#6B7280' }} />
                </button>
              </div>
            )}
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
              <div className="w-[120px] flex justify-end">
                <span className="text-[11px] text-[#9CA3AF]">
                  Refreshed {formatLastRefreshed(lastRefreshed)}
                </span>
              </div>
            </div>

            {/* Row 2: toolbar — no border below, line above comes from Row 1's border-b */}
            <div className="flex items-center justify-end px-5 pt-3 pb-3 gap-1.5">
                <button
                  onClick={() => setIsEditMode(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-medium transition-colors duration-150"
                  style={{
                    background: isEditMode ? t.accentColor : t.headerBg,
                    borderColor: isEditMode ? t.accentColor : t.headerBorder,
                    color: isEditMode ? '#FFFFFF' : t.controlColor,
                  }}
                  onMouseEnter={e => { if (!isEditMode) (e.currentTarget as HTMLElement).style.background = '#F3F4F6'; }}
                  onMouseLeave={e => { if (!isEditMode) (e.currentTarget as HTMLElement).style.background = t.headerBg; }}
                >
                  {isEditMode ? <Check className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
                  <span>{isEditMode ? 'Done' : 'Edit'}</span>
                </button>

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

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
            <div className="max-w-[1400px] mx-auto px-8 pt-4 pb-20">

              {/* ── Sense Alerts ── */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: t.accentColor }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: t.labelColor }}>Sense Alerts</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: t.badgeBg, color: t.badgeColor }}>3</span>
                </div>
                <div className="flex gap-4">
                  <SenseAlertCard
                    icon={<FileText className="w-3.5 h-3.5" />}
                    iconBg="#FEF3C7" iconColor="#D97706"
                    title="3 Stuck Quotes"
                    value="$84,000"
                    subtitle="Sent 7+ days, no response"
                    cta="Review"
                  />
                  <SenseAlertCard
                    icon={<Clock className="w-3.5 h-3.5" />}
                    iconBg="#FEE2E2" iconColor="#DC2626"
                    title="4 Jobs Behind SLA"
                    value="4 jobs"
                    subtitle="Overdue 2–5 days"
                    cta="View"
                  />
                  <SenseAlertCard
                    icon={<AlertTriangle className="w-3.5 h-3.5" />}
                    iconBg="#FFF4ED" iconColor="#EA580C"
                    title="6 Pending Invoices"
                    value="$42,600"
                    subtitle="Jobs done, not invoiced"
                    cta="Generate"
                  />
                </div>
              </div>

              {/* ── Pinned Cards (all cards) ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: t.labelColor }}>Pinned Cards</span>
                    <span className="text-[11px]" style={{ color: t.subtitleColor }}>· {cardOrder.length} cards</span>
                  </div>
                  {isEditMode && (
                    <span className="text-[11px] italic" style={{ color: t.subtitleColor }}>Drag to reorder</span>
                  )}
                </div>

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

                    return (
                      <motion.div
                        key={itemKey}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.03 }}
                        className={`relative group/card transition-all duration-200 ${fw ? 'md:col-span-2' : ''}`}
                        draggable={isEditMode}
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={e => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
                        style={{
                          opacity: isDragging ? 0.35 : 1,
                          outline: isDragTarget ? `2px solid ${t.accentColor}` : 'none',
                          outlineOffset: '2px',
                          borderRadius: t.cardRadius,
                          cursor: isEditMode ? 'grab' : 'default',
                        }}
                      >
                        {/* Drag handle — top-right in edit mode */}
                        {isEditMode && (
                          <div className="absolute top-3 right-3 z-20 p-1 rounded-md" style={{ background: t.controlBg, opacity: 0.8 }}>
                            <GripVertical className="w-4 h-4" style={{ color: t.subtitleColor }} />
                          </div>
                        )}

                        {/* Card content */}
                        {item.kind === 'saved' ? (
                          <>
                            {!isEditMode && (
                              <CardHoverActions
                                onOpenInChat={() => setChatCardTitle(item.data.title || 'this card')}
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
                                    {new Date(item.data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {item.data.sourceThreadId && ' · From conversation'}
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
                                    {new Date(item.data.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {item.data.sourceThreadId && ' · From conversation'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {!isEditMode && (
                              <CardHoverActions
                                onOpenInChat={() => setChatCardTitle(item.title)}
                                onEdit={() => onOpenCard?.({ id: item.id, type: 'card', content: {}, timestamp: new Date(), title: item.title })}
                                onResize={() => toggleCardWidth(item)}
                                isFullWidth={isFullWidth(item)}
                              />
                            )}
                            <item.Component
                              footer={<span style={{ fontSize: 11, color: t.subtitleColor }}>Mar 11 · From conversation</span>}
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

        {/* Chat panel */}
        <AnimatePresence>
          {chatCardTitle !== null && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 420, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="flex-shrink-0 overflow-hidden"
            >
              <div className="h-full w-[420px] bg-white rounded-xl overflow-hidden" style={{ border: `1px solid ${t.headerBorder}`, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
                <RadarChatPanel
                  key={chatCardTitle}
                  initialCardTitle={chatCardTitle}
                  onClose={() => setChatCardTitle(null)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </RadarThemeContext.Provider>
  );
}
