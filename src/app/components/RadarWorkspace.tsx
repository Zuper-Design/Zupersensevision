import { Plus, Trash2, Inbox, ChevronDown, Check, ExternalLink, RefreshCw, FileText, Clock, AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRadar, SavedCard } from './RadarContext';
import { DSOChartCard } from './DSOChartCard';
import { ChatPreviewPanel } from './ChatPreviewPanel';
import { RevenueMTDCard, OverdueInvoicesCard, QuoteConversionCard, CrewUtilisationCard, JobsCompletedCard } from './RadarCards';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

interface RadarWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  activeView?: 'chat' | 'radar';
  onViewChange?: (view: 'chat' | 'radar') => void;
  onOpenCard?: (card: SavedCard) => void;
}

// Mini chart data generators for seed cards
const generateMiniBarData = () => [
  { v: 35 }, { v: 52 }, { v: 41 }, { v: 68 }, { v: 55 }, { v: 72 }, { v: 48 }, { v: 63 },
];
const generateMiniLineData = () => [
  { v: 30 }, { v: 45 }, { v: 38 }, { v: 56 }, { v: 62 }, { v: 51 }, { v: 70 }, { v: 65 },
];
const generateMiniAreaData = () => [
  { v: 20 }, { v: 35 }, { v: 28 }, { v: 48 }, { v: 42 }, { v: 58 }, { v: 52 }, { v: 60 },
];

const miniPieData = [
  { name: 'A', value: 42 },
  { name: 'B', value: 26 },
  { name: 'C', value: 21 },
  { name: 'D', value: 11 },
];
const PIE_COLORS = ['#FD5000', '#3B82F6', '#10B981', '#F59E0B'];

function MiniBarChart() {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <BarChart data={generateMiniBarData()} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Bar dataKey="v" fill="#FD5000" radius={[2, 2, 0, 0]} opacity={0.8} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function MiniLineChart({ color = '#3B82F6' }: { color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={generateMiniLineData()} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MiniAreaChart({ color = '#10B981' }: { color?: string }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
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

function MiniPieChart() {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <PieChart>
        <Pie data={miniPieData} cx="50%" cy="50%" innerRadius={18} outerRadius={35} dataKey="value" stroke="none">
          {miniPieData.map((_, index) => (
            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

// Determine which mini chart to show based on card content
function getCardChart(card: SavedCard) {
  const chartType = card.content?.chartType;
  if (chartType === 'pie') return <MiniPieChart />;
  if (chartType === 'line') return <MiniLineChart color={card.type === 'widget' ? '#10B981' : '#3B82F6'} />;
  if (chartType === 'bar') return <MiniBarChart />;
  if (chartType === 'gauge') return <MiniAreaChart color="#F59E0B" />;
  // Default based on type
  if (card.type === 'chart') return <MiniLineChart />;
  if (card.type === 'widget') return <MiniAreaChart />;
  return null;
}

function isDSOChart(card: SavedCard) {
  return card.title?.toLowerCase().includes('dso') || card.title?.toLowerCase().includes('days sales outstanding');
}

// Radar Anomaly Card — proactive AI insight card with subtle gradient
function RadarAnomalyCard({ icon, iconBg, title, value, valueLabel, subtitle, cta }: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: string;
  valueLabel: string;
  subtitle: string;
  cta: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="relative rounded-xl overflow-hidden cursor-pointer group/anomaly"
      style={{
        background: hovered
          ? 'linear-gradient(135deg, #FFFAF5 0%, #FFF7ED 40%, #FFF3E6 100%)'
          : 'linear-gradient(135deg, #FFFFFF 0%, #FEFEFE 50%, #FDFCFB 100%)',
        border: hovered ? '1px solid rgba(253,80,0,0.18)' : '1px solid #E6E8EC',
        boxShadow: hovered
          ? '0 4px 16px rgba(253,80,0,0.07), 0 1px 3px rgba(0,0,0,0.04)'
          : '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top shimmer line */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: '2px',
          background: hovered
            ? 'linear-gradient(90deg, transparent 0%, rgba(253,80,0,0.20) 20%, rgba(253,140,0,0.15) 50%, rgba(253,80,0,0.20) 80%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(253,80,0,0.06) 30%, rgba(253,140,0,0.04) 70%, transparent 100%)',
          transition: 'background 0.3s ease',
        }}
      />
      {/* Sparkle indicator */}
      <div className="absolute top-2.5 right-3 pointer-events-none" style={{ opacity: hovered ? 0.6 : 0.2, transition: 'opacity 0.2s ease' }}>
        <Sparkles className="w-3 h-3" style={{ color: hovered ? '#FD5000' : '#B0ADB8' }} />
      </div>

      <div className="p-5">
        {/* Icon + Title */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-lg"
            style={{ width: '36px', height: '36px', backgroundColor: iconBg }}
          >
            {icon}
          </div>
          <div>
            <div className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{title}</div>
          </div>
        </div>

        {/* Value highlight */}
        <div className="mb-2">
          <span className="text-[20px] text-[#1C1E21]" style={{ fontWeight: 700 }}>{value}</span>
          <span className="text-[12px] text-[#9CA3AF] ml-1.5">{valueLabel}</span>
        </div>

        {/* Subtitle */}
        <p className="text-[12px] text-[#6B7280] mb-4 leading-relaxed">{subtitle}</p>

        {/* CTA */}
        <div
          className="flex items-center gap-1.5 text-[12px] transition-colors duration-150"
          style={{
            color: hovered ? '#FD5000' : '#9CA3AF',
            fontWeight: hovered ? 600 : 500,
          }}
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>{hovered ? cta : cta}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function RadarWorkspace({ isOpen, onClose, activeView = 'radar', onViewChange, onOpenCard }: RadarWorkspaceProps) {
  const { radars, activeRadarId, setActiveRadar, removeCardFromRadar, addRadar } = useRadar();
  const [selectedRadarId, setSelectedRadarId] = useState<string | null>(activeRadarId || (radars.length > 0 ? radars[0].id : null));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [previewCard, setPreviewCard] = useState<SavedCard | null>(null);

  const selectedRadar = radars.find((r) => r.id === selectedRadarId);

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setIsRefreshing(false);
    }, 800);
  }, [isRefreshing]);

  const formatLastRefreshed = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 5) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleSelectRadar = (radarId: string) => {
    setSelectedRadarId(radarId);
    setActiveRadar(radarId);
    setIsDropdownOpen(false);
  };

  const handleOpenCard = (card: SavedCard) => {
    setPreviewCard(card);
  };

  const handleExpandFullScreen = (card: SavedCard) => {
    setPreviewCard(null);
    if (onOpenCard) {
      onOpenCard(card);
    } else {
      onViewChange?.('chat');
    }
  };

  const handleClosePreview = () => {
    setPreviewCard(null);
  };

  const handleNewRadar = () => {
    const newId = addRadar({ name: 'New Radar', emoji: '📌' });
    setSelectedRadarId(newId);
    setActiveRadar(newId);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-xl" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      {/* Top Header Bar with Canvas/Chat/Radar Switcher */}
      <div className="h-[56px] border-b border-[#E6E8EC] flex items-center justify-between px-6 flex-shrink-0 bg-white relative z-10">
        {/* Left: Radar Dropdown Selector */}
        <div className="flex items-center gap-3" ref={dropdownRef}>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150"
            >
              <span className="text-[18px]">{selectedRadar?.emoji || '⚡'}</span>
              <span className="text-[14px] font-medium text-[#1C1E21]">{selectedRadar?.name || 'Select Radar'}</span>
              <span className="text-[12px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-md">{selectedRadar?.cardCount || 0}</span>
              <ChevronDown className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1 w-[260px] bg-white rounded-xl border border-[#E6E8EC] shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-2 z-50"
                >
                  <div className="px-3 pb-2 pt-1">
                    <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">Your Radars</p>
                  </div>
                  {radars.map((radar) => (
                    <button
                      key={radar.id}
                      onClick={() => handleSelectRadar(radar.id)}
                      className={`w-full px-3 py-2 flex items-center gap-3 transition-colors duration-100 ${
                        selectedRadarId === radar.id
                          ? 'bg-[#FFF4ED]'
                          : 'hover:bg-[#F8F9FB]'
                      }`}
                    >
                      <span className="text-[16px]">{radar.emoji}</span>
                      <div className="flex-1 text-left">
                        <p className="text-[13px] font-medium text-[#1C1E21]">{radar.name}</p>
                      </div>
                      <span className="text-[11px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded-md">{radar.cardCount}</span>
                      {selectedRadarId === radar.id && (
                        <Check className="w-4 h-4 text-[#FD5000]" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-[#E6E8EC] mt-2 pt-2 px-3">
                    <button
                      onClick={handleNewRadar}
                      className="w-full px-2 py-2 rounded-lg hover:bg-[#FFF4ED] transition-colors duration-150 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4 text-[#FD5000]" />
                      <span className="text-[13px] text-[#FD5000] font-medium">New Radar</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center: Chat/Radar Switcher */}
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#9CA3AF]">
              {formatLastRefreshed(lastRefreshed)}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg hover:bg-[#F8F9FB] transition-all duration-150 group/refresh disabled:opacity-50"
              aria-label="Refresh radar"
              title="Refresh radar"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#6B7280] group-hover/refresh:text-[#FD5000] transition-colors ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cards Content */}
      <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
        <div className="max-w-[1400px] mx-auto px-10 py-8 pb-20">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-[28px]">{selectedRadar?.emoji}</span>
              <div>
                <h1 className="text-[22px] font-semibold text-[#1C1E21]">{selectedRadar?.name || 'Select a Radar'}</h1>
                <p className="text-[13px] text-[#6B7280]">
                  {(selectedRadar?.cardCount || 0) + 5} {((selectedRadar?.cardCount || 0) + 5) === 1 ? 'card' : 'cards'} · Pinned insights and saved items
                </p>
              </div>
            </div>
          </div>

          {/* ── Sense AI Anomaly Alerts ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#FD5000]" />
              <span className="text-[12px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 600 }}>Sense Alerts</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RadarAnomalyCard
                icon={<FileText className="w-4.5 h-4.5 text-[#D97706]" />}
                iconBg="#FEF3C7"
                title="3 Stuck Quotes"
                value="$84,000"
                valueLabel="potential revenue"
                subtitle="Quotes sent but no response in 7+ days"
                cta="Review & follow up"
              />
              <RadarAnomalyCard
                icon={<Clock className="w-4.5 h-4.5 text-[#DC2626]" />}
                iconBg="#FEE2E2"
                title="4 Jobs Behind SLA"
                value="4 jobs"
                valueLabel="mostly re-roofing"
                subtitle="Overdue by 2–5 days, SLA breach risk"
                cta="View delays"
              />
              <RadarAnomalyCard
                icon={<AlertTriangle className="w-4.5 h-4.5 text-[#EA580C]" />}
                iconBg="#FFF4ED"
                title="6 Pending Invoices"
                value="$42,600"
                valueLabel="unbilled revenue"
                subtitle="Jobs completed but invoices not sent"
                cta="Generate invoices"
              />
            </div>
          </motion.div>

          {/* ── User-saved cards from context (newest first, at top) ── */}
          {selectedRadar && selectedRadar.cards.length > 0 && (
            <motion.div
              key={refreshKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
            >
              {selectedRadar.cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-white rounded-xl border border-[#E6E8EC] hover:border-[#D1D5DB] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-200 group relative shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden ${
                    isDSOChart(card) ? 'col-span-1 md:col-span-2' : ''
                  }`}
                >
                  {isDSOChart(card) ? (
                    /* Full DSO Chart rendering */
                    <div className="relative">
                      {/* Remove button */}
                      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeCardFromRadar(selectedRadarId!, card.id);
                          }}
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-[#FEE2E2] border border-[#E6E8EC] transition-all duration-150"
                          aria-label="Remove card"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-red-500" />
                        </button>
                      </div>
                      {/* Actual DSO Chart with footer inside */}
                      <DSOChartCard
                        footer={
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-[#9CA3AF]">
                              {new Date(card.timestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                              {card.sourceThreadId && (
                                <span className="ml-2 text-[#D1D5DB]">·</span>
                              )}
                              {card.sourceThreadId && (
                                <span className="ml-2 text-[#9CA3AF]">From conversation</span>
                              )}
                            </span>
                            <button
                              onClick={() => handleOpenCard(card)}
                              className="flex items-center gap-1.5 text-[12px] text-[#FD5000] font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 hover:underline cursor-pointer"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open in Chat
                            </button>
                          </div>
                        }
                      />
                    </div>
                  ) : (
                    /* Standard card with inline mini chart */
                    <div className="p-5">
                      {/* Card Type Badge & Actions */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                          card.type === 'chart' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
                          card.type === 'widget' ? 'bg-[#F0FDF4] text-[#10B981]' :
                          card.type === 'card' ? 'bg-[#FFF4ED] text-[#FD5000]' :
                          'bg-[#F3F4F6] text-[#6B7280]'
                        }`}>
                          {card.type}
                        </span>
                        <button
                          onClick={() => removeCardFromRadar(selectedRadarId!, card.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[#FEE2E2] transition-all duration-150"
                          aria-label="Remove card"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-red-500" />
                        </button>
                      </div>

                      {/* Inline Mini Chart for chart/widget types */}
                      {(card.type === 'chart' || card.type === 'widget') && card.content?.chartType && (
                        <div className="mb-3 -mx-1 rounded-lg bg-[#FAFBFC] border border-[#F3F4F6] overflow-hidden">
                          {getCardChart(card)}
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="mb-3">
                        <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1.5">{card.title}</h3>
                        {card.preview && (
                          <p className="text-[12px] text-[#6B7280] leading-relaxed line-clamp-3">{card.preview}</p>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                        <span className="text-[11px] text-[#9CA3AF]">
                          {new Date(card.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {card.sourceThreadId && (
                            <>
                              <span className="ml-2 text-[#D1D5DB]">·</span>
                              <span className="ml-2 text-[#9CA3AF]">From conversation</span>
                            </>
                          )}
                        </span>
                        <button
                          onClick={() => handleOpenCard(card)}
                          className="flex items-center gap-1.5 text-[11px] text-[#FD5000] font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open →
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── Pinned Insight Cards (always visible) ── */}
          <motion.div
            key={`pinned-${refreshKey}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-5 mb-8"
          >
            {/* Row 1: Revenue MTD + Overdue Invoices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
                <RevenueMTDCard
                  footer={<span className="text-[11px] text-[#9CA3AF]">Mar 11 · From conversation</span>}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                <OverdueInvoicesCard
                  footer={<span className="text-[11px] text-[#9CA3AF]">Mar 11 · From conversation</span>}
                />
              </motion.div>
            </div>

            {/* Row 2: Quote Conversion + Crew Utilisation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
                <QuoteConversionCard
                  footer={<span className="text-[11px] text-[#9CA3AF]">Mar 11 · From conversation</span>}
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                <CrewUtilisationCard
                  footer={<span className="text-[11px] text-[#9CA3AF]">Mar 11 · From conversation</span>}
                />
              </motion.div>
            </div>

            {/* Row 3: Jobs Completed (full width) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
              <JobsCompletedCard
                footer={<span className="text-[11px] text-[#9CA3AF]">Mar 11 · From conversation</span>}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Chat Preview Panel */}
      {previewCard && (
        <ChatPreviewPanel
          card={previewCard}
          onClose={handleClosePreview}
          onExpandFullScreen={handleExpandFullScreen}
        />
      )}
    </div>
  );
}