import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Area, AreaChart, Cell,
} from 'recharts';
import React, { useState, useRef, useEffect } from 'react';
import { Pencil, ChevronDown, Calendar, RefreshCw } from 'lucide-react';
import { useRadarTheme } from './RadarThemeContext';

export interface RenameProps {
  customTitle?: string;
  isRenaming?: boolean;
  renameValue?: string;
  onRenameStart?: () => void;
  onRenameChange?: (v: string) => void;
  onRenameSubmit?: () => void;
  onRenameCancel?: () => void;
}

/* ─── Date Filter ─── */

const DATE_OPTIONS = ['15 days', '30 days', '1 month', '3 months', '6 months', 'Custom'] as const;

export function DateFilter({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const isSm = size === 'sm';
  const t = useRadarTheme();
  const [selected, setSelected] = useState<string>('30 days');
  const [isOpen, setIsOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowCustom(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative" style={{ fontFamily: t.fontFamily }}>
      <button
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); setShowCustom(false); }}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-[#E6E8EC] bg-white hover:bg-[#F3F4F6] transition-colors duration-150 font-medium ${
          isSm ? 'h-7 px-2.5 text-[12px] leading-none' : 'px-3 py-1.5 text-[13px]'
        }`}
        style={{ color: '#1C1E21' }}
      >
        <Calendar className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>{selected}</span>
        <ChevronDown className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden"
          style={{
            background: t.name === 'night' ? '#2A2A2A' : '#FFFFFF',
            border: `1px solid ${t.name === 'night' ? 'rgba(255,255,255,0.1)' : '#E6E8EC'}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            minWidth: showCustom ? 220 : 130,
          }}
        >
          {!showCustom ? (
            <div className="py-1">
              {DATE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (opt === 'Custom') {
                      setShowCustom(true);
                    } else {
                      setSelected(opt);
                      setIsOpen(false);
                    }
                  }}
                  className="w-full text-left px-3.5 py-2 transition-colors duration-100"
                  style={{
                    fontSize: 12,
                    fontWeight: selected === opt ? 600 : 400,
                    color: selected === opt ? (t.name === 'night' ? '#FFFFFF' : '#1C1E21') : t.subtitleColor,
                    background: selected === opt ? (t.name === 'night' ? 'rgba(255,255,255,0.06)' : '#F8F9FB') : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (selected !== opt) (e.target as HTMLElement).style.background = t.name === 'night' ? 'rgba(255,255,255,0.04)' : '#F8F9FB';
                  }}
                  onMouseLeave={(e) => {
                    if (selected !== opt) (e.target as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3" onClick={(e) => e.stopPropagation()}>
              <p style={{ fontSize: 11, fontWeight: 600, color: t.titleColor, marginBottom: 8 }}>Custom range</p>
              <div className="flex flex-col gap-2">
                <div>
                  <label style={{ fontSize: 10, color: t.subtitleColor, display: 'block', marginBottom: 3 }}>From</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="w-full rounded-md px-2 py-1.5 outline-none"
                    style={{
                      fontSize: 11,
                      color: t.titleColor,
                      background: t.name === 'night' ? 'rgba(255,255,255,0.06)' : '#F8F9FB',
                      border: `1px solid ${t.name === 'night' ? 'rgba(255,255,255,0.1)' : '#E6E8EC'}`,
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, color: t.subtitleColor, display: 'block', marginBottom: 3 }}>To</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="w-full rounded-md px-2 py-1.5 outline-none"
                    style={{
                      fontSize: 11,
                      color: t.titleColor,
                      background: t.name === 'night' ? 'rgba(255,255,255,0.06)' : '#F8F9FB',
                      border: `1px solid ${t.name === 'night' ? 'rgba(255,255,255,0.1)' : '#E6E8EC'}`,
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    if (customFrom && customTo) {
                      setSelected(`${customFrom} – ${customTo}`);
                    }
                    setIsOpen(false);
                    setShowCustom(false);
                  }}
                  className="w-full mt-1 py-1.5 rounded-lg text-white transition-all duration-150"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: 'linear-gradient(to right, #221E1F, #6D5F63)',
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Shared ─── */

const CustomDot = ({ cx, cy, stroke }: any) => (
  <circle cx={cx} cy={cy} r={4} fill="white" stroke={stroke} strokeWidth={2} />
);

const CardShell = ({
  title,
  subtitle,
  children,
  stats,
  footer,
  renameProps,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  stats: { label: string; value: string; color: string }[];
  footer?: React.ReactNode;
  renameProps?: RenameProps;
}) => {
  const t = useRadarTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    if (renameProps?.isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renameProps?.isRenaming]);

  useEffect(() => {
    const id = setInterval(() => forceTick(n => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const displayTitle = renameProps?.customTitle ?? title;

  const formatRelative = (d: Date) => {
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 10) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshing(true);
    setTimeout(() => {
      setLastRefreshed(new Date());
      setRefreshing(false);
    }, 600);
  };


  return (
    <div
      className="w-full relative group/card"
      style={{
        backgroundColor: t.cardBg,
        border: t.cardBorder,
        borderRadius: t.cardRadius,
        boxShadow: t.cardShadow,
        fontFamily: t.fontFamily,
        padding: '20px',
      }}
    >
      <div className="mb-4">
        <div className="flex items-center gap-1.5 group/rename">
          {renameProps?.isRenaming ? (
            <input
              ref={inputRef}
              value={renameProps.renameValue ?? ''}
              onChange={e => renameProps.onRenameChange?.(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') renameProps.onRenameSubmit?.();
                if (e.key === 'Escape') renameProps.onRenameCancel?.();
              }}
              onBlur={() => renameProps.onRenameSubmit?.()}
              style={{
                fontSize: 15, fontWeight: 700, color: t.titleColor,
                background: '#FFFFFF',
                border: `1.5px solid ${t.headerBorder || '#E6E8EC'}`,
                borderRadius: 6, outline: 'none',
                padding: '2px 8px', margin: 0,
                width: '100%', maxWidth: 400, fontFamily: t.fontFamily,
                boxShadow: `0 0 0 3px ${t.accentColor}22`,
              }}
            />
          ) : (
            <>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: t.titleColor, margin: 0 }}>{displayTitle}</h3>
              {renameProps?.onRenameStart && (
                <button
                  onClick={e => { e.stopPropagation(); renameProps.onRenameStart?.(); }}
                  className="opacity-0 group-hover/rename:opacity-100 transition-opacity duration-150 flex-shrink-0 p-0.5 rounded"
                  style={{ lineHeight: 0 }}
                >
                  <Pencil className="w-3 h-3" style={{ color: t.subtitleColor }} />
                </button>
              )}
            </>
          )}
        </div>
        <p style={{ fontSize: 13, color: t.subtitleColor, marginTop: 2, marginBottom: 0 }}>{subtitle}</p>
      </div>
      {children}
      <div
        className="flex items-center justify-between gap-3"
        style={{ marginTop: 14, paddingTop: 10, borderTop: `1px solid ${t.dividerColor}` }}
      >
        <div className="min-w-0">{footer}</div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span style={{ fontSize: 11, color: t.subtitleColor, fontFamily: t.fontFamily }}>
            Updated {formatRelative(lastRefreshed)}
          </span>
          <button
            onClick={handleRefresh}
            title="Refresh"
            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-[#E6E8EC] bg-white hover:bg-[#F3F4F6] transition-colors duration-150"
            style={{ color: t.subtitleColor }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SharedTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md">
        <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[12px]" style={{ color: entry.stroke || entry.fill }}>
            {entry.name}: <span className="font-medium text-[#1C1E21]">{unit === '$' ? `$${Number(entry.value).toLocaleString()}` : `${entry.value}${unit || ''}`}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/* ═══════════════════════════════════════════
   Card 1 — Revenue MTD vs Target
   ═══════════════════════════════════════════ */

const revenueMTDData = [
  { day: '1', actual: 12000, target: 9286 },
  { day: '7', actual: 68000, target: 65000 },
  { day: '14', actual: 148000, target: 130000 },
  { day: '21', actual: 232000, target: 195000 },
  { day: '28', actual: 284500, target: 260000 },
];

export function RevenueMTDCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell
      title="Revenue MTD vs Target"
      subtitle="Daily cumulative revenue against monthly target pace"
      renameProps={renameProps}
      stats={[
        { label: 'Revenue MTD', value: '$284,500', color: '#10B981' },
        { label: 'Monthly Target', value: '$260,000', color: '#1C1E21' },
        { label: 'Gap to Target', value: '+$24,500', color: '#10B981' },
        { label: 'Days Remaining', value: '20', color: '#9CA3AF' },
      ]}
      footer={footer}
    >
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={revenueMTDData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revAboveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid key="rev-grid" strokeDasharray="0" stroke="#F0F0F0" vertical={false} />
            <XAxis key="rev-xaxis" dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={8} />
            <YAxis
              key="rev-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 300000]}
              ticks={[0, 100000, 200000, 300000]}
              tickFormatter={(v) => `${v / 1000}k`}
              dx={-4}
            />
            <Tooltip key="rev-tooltip" content={<SharedTooltip unit="$" />} />
            <Legend
              key="rev-legend"
              verticalAlign="bottom"
              height={36}
              iconType="square"
              iconSize={10}
              formatter={(value: string) => <span style={{ color: '#6B7280', fontSize: 12 }}>{value}</span>}
            />
            <Area
              key="rev-area-actual"
              type="monotone"
              dataKey="actual"
              name="Actual Revenue"
              stroke="#1E293B"
              strokeWidth={2}
              fill="url(#revAboveFill)"
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#1E293B', stroke: 'white', strokeWidth: 2 }}
            />
            <Line
              key="rev-line-target"
              type="monotone"
              dataKey="target"
              name="Target Pace"
              stroke="#10B981"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════
   Card 2 — Overdue Invoices
   ═══════════════════════════════════════════ */

const overdueData = [
  { bucket: '0–30 days', amount: 14200, fill: '#F59E0B' },
  { bucket: '31–60 days', amount: 11800, fill: '#EA580C' },
  { bucket: '60+ days', amount: 12200, fill: '#DC2626' },
];

export function OverdueInvoicesCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell
      title="Overdue Invoices"
      subtitle="Invoice aging breakdown by overdue period"
      renameProps={renameProps}
      stats={[
        { label: 'Total Overdue', value: '$38,200', color: '#DC2626' },
        { label: 'Invoices', value: '14', color: '#1C1E21' },
        { label: 'Avg Days Overdue', value: '22 days', color: '#F59E0B' },
        { label: 'Collected MTD', value: '$197,400', color: '#10B981' },
      ]}
      footer={footer}
    >
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart
            data={overdueData}
            layout="vertical"
            margin={{ top: 10, right: 60, left: 10, bottom: 0 }}
            barSize={10}
          >
            <CartesianGrid key="od-grid" strokeDasharray="0" stroke="#F0F0F0" horizontal={false} />
            <XAxis
              key="od-xaxis"
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 15000]}
              ticks={[0, 5000, 10000, 15000]}
              tickFormatter={(v) => `${v / 1000}k`}
            />
            <YAxis
              key="od-yaxis"
              type="category"
              dataKey="bucket"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              width={85}
            />
            <Tooltip key="od-tooltip" content={<SharedTooltip unit="$" />} />
            <Bar
              key="od-bar"
              dataKey="amount"
              name="Amount"
              radius={[0, 5, 5, 0]}
              label={{ position: 'right', fontSize: 12, fill: '#6B7280', formatter: (v: number) => `$${(v / 1000).toFixed(1)}k` }}
            >
              {overdueData.map((entry, index) => (
                <Cell key={`overdue-cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════
   Card 3 — Quote-to-Invoice Conversion
   ═══════════════════════════════════════════ */

const quoteConvData = [
  { month: 'Jul', rate: 52, industry: 55 },
  { month: 'Aug', rate: 55, industry: 55 },
  { month: 'Sep', rate: 53, industry: 55 },
  { month: 'Oct', rate: 58, industry: 55 },
  { month: 'Nov', rate: 60, industry: 55 },
  { month: 'Dec', rate: 59, industry: 55 },
  { month: 'Jan', rate: 62, industry: 55 },
  { month: 'Feb', rate: 61, industry: 55 },
];

export function QuoteConversionCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell
      title="Quote-to-Invoice Conversion"
      subtitle="Monthly conversion rate trend over the last 8 months"
      renameProps={renameProps}
      stats={[
        { label: 'Current Rate', value: '61%', color: '#10B981' },
        { label: 'Industry Avg', value: '55%', color: '#10B981' },
        { label: 'Quotes Sent MTD', value: '63', color: '#1C1E21' },
        { label: 'Quotes Won MTD', value: '38', color: '#1C1E21' },
      ]}
      footer={footer}
    >
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={quoteConvData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid key="qc-grid" strokeDasharray="0" stroke="#F0F0F0" vertical={false} />
            <XAxis key="qc-xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={8} />
            <YAxis
              key="qc-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
              dx={-4}
            />
            <Tooltip key="qc-tooltip" content={<SharedTooltip unit="%" />} />
            <Legend
              key="qc-legend"
              verticalAlign="bottom"
              height={36}
              iconType="square"
              iconSize={10}
              formatter={(value: string) => <span style={{ color: '#6B7280', fontSize: 12 }}>{value}</span>}
            />
            <Line
              key="qc-line-rate"
              type="monotone"
              dataKey="rate"
              name="Your Rate"
              stroke="#EF4444"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#EF4444', stroke: 'white', strokeWidth: 2 }}
            />
            <Line
              key="qc-line-industry"
              type="monotone"
              dataKey="industry"
              name="Industry Avg"
              stroke="#10B981"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════
   Card 4 — Crew Utilisation
   ═══════════════════════════════════════════ */

const crewData = [
  { crew: 'Crew A', util: 86, fill: '#10B981' },
  { crew: 'Crew B', util: 82, fill: '#10B981' },
  { crew: 'Crew C', util: 71, fill: '#F59E0B' },
  { crew: 'Crew D', util: 64, fill: '#F59E0B' },
];

const CrewTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md">
        <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[12px]" style={{ color: entry.fill || entry.stroke }}>
            Utilisation: <span className="font-medium text-[#1C1E21]">{entry.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CrewUtilisationCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell
      title="Crew Utilisation"
      subtitle="Weekly utilisation rate by crew — target 80%"
      renameProps={renameProps}
      stats={[
        { label: 'Overall Utilisation', value: '74%', color: '#F59E0B' },
        { label: 'Above Target', value: '2 crews', color: '#10B981' },
        { label: 'Below Target', value: '2 crews', color: '#F59E0B' },
        { label: 'Field Hours MTD', value: '1,248 hrs', color: '#1C1E21' },
      ]}
      footer={footer}
    >
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart
            data={crewData}
            layout="vertical"
            margin={{ top: 20, right: 50, left: 10, bottom: 0 }}
            barSize={10}
          >
            <CartesianGrid key="cu-grid" strokeDasharray="0" stroke="#F0F0F0" horizontal={false} />
            <XAxis
              key="cu-xaxis"
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              key="cu-yaxis"
              type="category"
              dataKey="crew"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              width={60}
            />
            <Tooltip key="cu-tooltip" content={<CrewTooltip />} />
            <ReferenceLine
              key="cu-refline"
              x={80}
              stroke="#9CA3AF"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: 'Target 80%', position: 'top', fill: '#9CA3AF', fontSize: 10 }}
            />
            <Bar
              key="cu-bar"
              dataKey="util"
              name="Utilisation"
              radius={[0, 5, 5, 0]}
              label={{ position: 'right', fontSize: 12, fill: '#6B7280', formatter: (v: number) => `${v}%` }}
            >
              {crewData.map((entry, index) => (
                <Cell key={`crew-cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════
   Card 5 — Jobs Completed vs At Risk
   ═══════════════════════════════════════════ */

const jobsWeekData = [
  { day: 'Mon', completed: 12, atRisk: 8 },
  { day: 'Tue', completed: 18, atRisk: 7 },
  { day: 'Wed', completed: 22, atRisk: 9 },
  { day: 'Thu', completed: 28, atRisk: 8 },
  { day: 'Fri', completed: 32, atRisk: 7 },
  { day: 'Sat', completed: 35, atRisk: 8 },
  { day: 'Sun', completed: 38, atRisk: 7 },
];

export function JobsCompletedCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell
      title="Jobs — Completed vs At Risk"
      subtitle="Weekly job completion and active risk flags — current week"
      renameProps={renameProps}
      stats={[
        { label: 'Completed This Week', value: '134', color: '#10B981' },
        { label: 'At Risk Right Now', value: '7', color: '#F59E0B' },
        { label: 'On-Time Rate', value: '91%', color: '#1C1E21' },
        { label: 'Avg Days to Complete', value: '3.2 days', color: '#1C1E21' },
      ]}
      footer={footer}
    >
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={jobsWeekData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid key="jc-grid" strokeDasharray="0" stroke="#F0F0F0" vertical={false} />
            <XAxis key="jc-xaxis" dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={8} />
            <YAxis
              key="jc-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
              dx={-4}
            />
            <Tooltip key="jc-tooltip" content={<SharedTooltip />} />
            <Legend
              key="jc-legend"
              verticalAlign="bottom"
              height={36}
              iconType="square"
              iconSize={10}
              formatter={(value: string) => <span style={{ color: '#6B7280', fontSize: 12 }}>{value}</span>}
            />
            <Line
              key="jc-line-completed"
              type="monotone"
              dataKey="completed"
              name="Completed"
              stroke="#10B981"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
            />
            <Line
              key="jc-line-atrisk"
              type="monotone"
              dataKey="atRisk"
              name="At Risk"
              stroke="#EF4444"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#EF4444', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

/* ═══════════════════════════════════════════
   Extra cards
   ═══════════════════════════════════════════ */

const TEAL = '#14B8A6';
const ORANGE = '#F97316';
const RED = '#EF4444';
const INDIGO = '#6366F1';
const VIOLET = '#8B5CF6';
const PINK = '#EC4899';
const AMBER = '#F59E0B';
const EMERALD = '#10B981';
const SKY = '#0EA5E9';
const ROSE = '#F43F5E';

const PALETTE = [INDIGO, TEAL, VIOLET, AMBER, PINK, EMERALD, SKY, ROSE, ORANGE, RED];

const baseAxis = { fontSize: 11, fill: '#9CA3AF', fontWeight: 500 } as const;
const baseGrid = { stroke: '#F1F3F6' };

const SimpleTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md">
      <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} className="text-[12px] font-medium" style={{ color: e.color || e.fill }}>
          {e.name}: {typeof e.value === 'number' ? e.value.toLocaleString() : e.value}
        </p>
      ))}
    </div>
  );
};

const jobsByPriorityData = [
  { priority: 'LOW', jobs: 258 },
  { priority: 'MEDIUM', jobs: 72 },
  { priority: 'HIGH', jobs: 8 },
  { priority: 'URGENT', jobs: 6 },
];

export function JobsByPriorityCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  const [status, setStatus] = useState<'error' | 'loading' | 'loaded'>('error');

  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === 'loading') return;
    setStatus('loading');
    setTimeout(() => setStatus('loaded'), 1400);
  };

  return (
    <CardShell title="Jobs by Priority — Jan to Mar 2026" subtitle="Distribution of jobs across priority levels" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 260 }} onClick={(e) => { if (status !== 'loaded') e.stopPropagation(); }}>
        {status === 'error' ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="34" width="10" height="18" rx="2" fill="#E5E7EB" />
              <rect x="24" y="24" width="10" height="28" rx="2" fill="#E5E7EB" />
              <rect x="38" y="40" width="10" height="12" rx="2" fill="#E5E7EB" />
              <line x1="8" y1="54" x2="56" y2="54" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="48" cy="18" r="9" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1.5" />
              <line x1="48" y1="14" x2="48" y2="19" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="48" cy="22.5" r="1" fill="#DC2626" />
            </svg>
            <div className="text-center">
              <p style={{ fontSize: 13, fontWeight: 600, color: '#1C1E21', margin: 0 }}>Couldn't load data</p>
              <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Something went wrong fetching this chart.</p>
            </div>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#E6E8EC] bg-white hover:bg-[#F3F4F6] transition-colors duration-150"
              style={{ fontSize: 12, fontWeight: 500, color: '#1C1E21' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload</span>
            </button>
          </div>
        ) : status === 'loading' ? (
          <div className="w-full h-full flex flex-col justify-end px-2 pb-6">
            <div className="flex items-end justify-around gap-4" style={{ height: '85%' }}>
              {[78, 92, 45, 32].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-md skeleton-shimmer"
                  style={{ height: `${h}%`, maxWidth: 52 }}
                />
              ))}
            </div>
            <div className="flex justify-around gap-4 mt-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-2.5 w-10 rounded skeleton-shimmer" />
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={jobsByPriorityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
              <XAxis dataKey="priority" axisLine={false} tickLine={false} tick={baseAxis} dy={6} />
              <YAxis axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 280]} ticks={[0, 70, 140, 210, 280]} />
              <Tooltip content={<SimpleTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="jobs" name="Total Jobs" radius={[3, 3, 0, 0]} barSize={52} fill={INDIGO} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </CardShell>
  );
}

const jobsByStatusData = [
  { status: 'new', jobs: 840 },
  { status: 'on_my_way', jobs: 160 },
  { status: 'started', jobs: 135 },
  { status: 'completed', jobs: 70 },
  { status: 'closed', jobs: 45 },
  { status: 'on_hold', jobs: 30 },
  { status: 'scheduled', jobs: 28 },
  { status: 'paid', jobs: 20 },
  { status: 'other', jobs: 12 },
];

export function JobsByStatusCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Jobs by Status — Oct 2025 to Mar 2026" subtitle="Job volume across lifecycle statuses" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={jobsByStatusData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
            <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ ...baseAxis, fontSize: 10 }} angle={-28} textAnchor="end" height={50} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 1000]} ticks={[0, 250, 500, 750, 1000]} tickFormatter={(v) => v >= 1000 ? `${v / 1000}K` : `${v}`} />
            <Tooltip content={<SimpleTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
            <Bar dataKey="jobs" name="Total Jobs" radius={[3, 3, 0, 0]} barSize={28} fill={TEAL} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

const techData = [
  { name: 'Prashanth Ad...', jobs: 16 },
  { name: 'Raghav Gurum...', jobs: 14 },
  { name: 'James Smith', jobs: 13 },
  { name: 'Trevor Alan', jobs: 8 },
  { name: 'Miguel Diaz', jobs: 6 },
  { name: 'Sam J', jobs: 6 },
  { name: 'Prashanth FE', jobs: 5 },
  { name: 'Cristiano Ki...', jobs: 4 },
  { name: 'Jaxson Roy', jobs: 3 },
  { name: 'Aaron K', jobs: 3 },
];

export function CompletedJobsByTechCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Completed Jobs by Technician — Last 6 Months" subtitle="Top performers by completed job count" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 310 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={techData} margin={{ top: 10, right: 10, left: -10, bottom: 30 }}>
            <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ ...baseAxis, fontSize: 10 }} angle={-28} textAnchor="end" height={60} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 16]} ticks={[0, 4, 8, 12, 16]} />
            <Tooltip content={<SimpleTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
            <Bar dataKey="jobs" name="Total Jobs" radius={[3, 3, 0, 0]} barSize={26} fill={ORANGE} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

const monthlyRevenue2024 = [
  { month: 'Jan-2024', revenue: 20000 },
  { month: 'Feb-2024', revenue: 80000 },
  { month: 'Mar-2024', revenue: 15000 },
  { month: 'Apr-2024', revenue: 120000 },
  { month: 'May-2024', revenue: 1620000 },
  { month: 'Jun-2024', revenue: 18000 },
  { month: 'Jul-2024', revenue: 22000 },
  { month: 'Aug-2024', revenue: 26000 },
  { month: 'Sep-2024', revenue: 20000 },
  { month: 'Oct-2024', revenue: 18000 },
  { month: 'Nov-2024', revenue: 14000 },
  { month: 'Dec-2024', revenue: 12000 },
];

export function MonthlyJobRevenueOrangeCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Monthly Job Revenue — 2024" subtitle="Revenue trend across calendar year" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyRevenue2024} margin={{ top: 10, right: 15, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="grad-orange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity={0.35} />
                <stop offset="100%" stopColor={ORANGE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ ...baseAxis, fontSize: 10 }} angle={-28} textAnchor="end" height={50} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 1800000]} ticks={[0, 450000, 900000, 1400000, 1800000]} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${v / 1000}K` : `${v}`} />
            <Tooltip content={<SimpleTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Job Revenue" stroke={ORANGE} strokeWidth={2.5} fill="url(#grad-orange)" dot={<CustomDot />} activeDot={{ r: 6, fill: ORANGE, stroke: 'white', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

export function MonthlyJobRevenueRedCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Monthly Job Revenue — 2024" subtitle="Revenue trend across calendar year" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyRevenue2024} margin={{ top: 10, right: 15, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="grad-pink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PINK} stopOpacity={0.35} />
                <stop offset="100%" stopColor={PINK} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ ...baseAxis, fontSize: 10 }} angle={-28} textAnchor="end" height={50} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 1800000]} ticks={[0, 450000, 900000, 1400000, 1800000]} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${v / 1000}K` : `${v}`} />
            <Tooltip content={<SimpleTooltip />} />
            <Area type="monotone" dataKey="revenue" name="Job Revenue" stroke={PINK} strokeWidth={2.5} fill="url(#grad-pink)" dot={<CustomDot />} activeDot={{ r: 6, fill: PINK, stroke: 'white', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

const revVsCostData = [
  { month: 'Oct-2025', revenue: 140000, cost: 0 },
  { month: 'Nov-2025', revenue: 1980000, cost: 0 },
  { month: 'Dec-2025', revenue: 1640000, cost: 0 },
  { month: 'Jan-2026', revenue: 580000, cost: 0 },
  { month: 'Feb-2026', revenue: 820000, cost: 0 },
  { month: 'Mar-2026', revenue: 220000, cost: 2200 },
];

export function RevenueVsCostCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Monthly Revenue vs Total Cost — Oct 2025 to Mar 2026" subtitle="Revenue and cost comparison across 6 months" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 310 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revVsCostData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={INDIGO} stopOpacity={0.3} />
                <stop offset="100%" stopColor={INDIGO} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-cost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
                <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={baseAxis} dy={6} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 2000000]} ticks={[0, 500000, 1000000, 1500000, 2000000]} tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1).replace('.0','')}M` : `${v / 1000}K`} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 2200]} ticks={[0, 550, 1100, 1700, 2200]} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1).replace('.0','')}K` : `${v}`} />
            <Tooltip content={<SimpleTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#6B7280', fontSize: 12 }}>{v}</span>} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Job Revenue" stroke={INDIGO} strokeWidth={2.5} fill="url(#grad-rev)" dot={<CustomDot />} activeDot={{ r: 6, fill: INDIGO, stroke: 'white', strokeWidth: 2 }} />
            <Area yAxisId="right" type="monotone" dataKey="cost" name="Actual Total Cost" stroke={TEAL} strokeWidth={2.5} fill="url(#grad-cost)" dot={<CustomDot />} activeDot={{ r: 6, fill: TEAL, stroke: 'white', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

const jobsTableData = [
  { title: 'test', type: 'NEW', priority: 'LOW' },
  { title: 'New test job 4', type: 'NEW', priority: 'LOW' },
  { title: 'job ios test', type: 'NEW', priority: 'LOW' },
  { title: 'job ios test', type: 'REVISIT', priority: 'LOW' },
  { title: 'check July 2', type: 'NEW', priority: 'LOW' },
  { title: 'Job created July 2', type: 'NEW', priority: 'LOW' },
  { title: 'Maintenance', type: 'NEW', priority: 'LOW' },
  { title: 'Test', type: 'NEW', priority: 'LOW' },
  { title: 'tier4', type: 'NEW', priority: 'HIGH' },
  { title: 'tier5', type: 'NEW', priority: 'HIGH' },
];

function PriorityPill({ p }: { p: string }) {
  const isHigh = p === 'HIGH' || p === 'URGENT';
  return (
    <span
      className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full"
      style={{
        fontSize: 10,
        fontWeight: 600,
        background: isHigh ? '#FEE2E2' : '#DBEAFE',
        color: isHigh ? '#DC2626' : '#1D4ED8',
      }}
    >
      {p}
    </span>
  );
}

export function JobsTableCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Jobs" subtitle="Recent jobs across the workspace" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-auto">
        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E6E8EC' }}>
              <th className="py-2.5 pl-1 pr-3" style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Job Title</th>
              <th className="py-2.5 px-3" style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Job Type</th>
              <th className="py-2.5 px-3" style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Job Priority</th>
            </tr>
          </thead>
          <tbody>
            {jobsTableData.map((j, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td className="py-2.5 pl-1 pr-3">
                  <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1" style={{ fontSize: 12, color: '#2563EB', textDecoration: 'underline' }}>
                    {j.title} <span aria-hidden>↗</span>
                  </a>
                </td>
                <td className="py-2.5 px-3" style={{ fontSize: 12, color: '#1C1E21' }}>{j.type}</td>
                <td className="py-2.5 px-3"><PriorityPill p={j.priority} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardShell>
  );
}

const customerGrowthData = [
  { month: 'Apr-2025', customers: 62 },
  { month: 'May-2025', customers: 33 },
  { month: 'Jun-2025', customers: 40 },
  { month: 'Jul-2025', customers: 104 },
  { month: 'Aug-2025', customers: 30 },
  { month: 'Sep-2025', customers: 10 },
  { month: 'Oct-2025', customers: 16 },
  { month: 'Nov-2025', customers: 14 },
  { month: 'Dec-2025', customers: 80 },
  { month: 'Jan-2026', customers: 32 },
  { month: 'Feb-2026', customers: 8 },
];

export function CustomerGrowthCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Customer Growth Trend - Last 12 Months" subtitle="New customers added per month" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={customerGrowthData} margin={{ top: 10, right: 15, left: -10, bottom: 20 }}>
            <defs>
              <linearGradient id="grad-violet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={VIOLET} stopOpacity={0.35} />
                <stop offset="100%" stopColor={VIOLET} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ ...baseAxis, fontSize: 10 }} angle={-28} textAnchor="end" height={50} interval={0} />
            <YAxis axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
            <Tooltip content={<SimpleTooltip />} />
            <Area type="monotone" dataKey="customers" name="New Customers" stroke={VIOLET} strokeWidth={2.5} fill="url(#grad-violet)" dot={<CustomDot />} activeDot={{ r: 6, fill: VIOLET, stroke: 'white', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

/* — Monthly Job Revenue / MoM Growth / Cumulative — */
const momData = [
  { month: 'Dec-2024', revenue: 1781, mom: -77, cum: 1781 },
  { month: 'Jan-2025', revenue: 41245, mom: 2216, cum: 43026 },
  { month: 'Feb-2025', revenue: 42106, mom: 2, cum: 85132 },
  { month: 'Mar-2025', revenue: 56706, mom: 35, cum: 141838 },
  { month: 'Apr-2025', revenue: 237304, mom: 318, cum: 379142 },
  { month: 'May-2025', revenue: 23490953, mom: 9704, cum: 23870095 },
  { month: 'Jun-2025', revenue: 122509, mom: -99, cum: 23992604 },
  { month: 'Jul-2025', revenue: 188200, mom: 54, cum: 24180804 },
  { month: 'Aug-2025', revenue: 1212009, mom: 544, cum: 25392813 },
  { month: 'Sep-2025', revenue: 649475, mom: -46, cum: 26042288 },
  { month: 'Oct-2025', revenue: 800000, mom: 23, cum: 26842288 },
  { month: 'Nov-2025', revenue: 1100000, mom: 38, cum: 27942288 },
  { month: 'Dec-2025', revenue: 900000, mom: -18, cum: 28842288 },
];

export function RevenueMoMCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  return (
    <CardShell title="Monthly Job Revenue, MoM Growth, and Cumulative Revenue — Dec 2024 to Dec 2025" subtitle="Revenue, month-over-month change, and running total" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={momData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="0" {...baseGrid} vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ ...baseAxis, fontSize: 10 }} angle={-28} textAnchor="end" height={50} interval={0} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={baseAxis} domain={[0, 34000000]} ticks={[0, 8500000, 17000000, 26000000, 34000000]} tickFormatter={(v) => v >= 1000000 ? `${Math.round(v / 1000000)}M` : `${v / 1000}K`} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={baseAxis} domain={[-3500, 11000]} ticks={[-3500, 0, 3500, 7000, 11000]} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
            <Tooltip content={<SimpleTooltip />} />
            <Legend iconType="circle" iconSize={8} formatter={(v) => <span style={{ color: '#6B7280', fontSize: 12 }}>{v}</span>} />
            <Line yAxisId="left" type="monotone" dataKey="revenue" name="Job Revenue" stroke={TEAL} strokeWidth={2.5} dot={<CustomDot />} activeDot={{ r: 6, fill: TEAL, stroke: 'white', strokeWidth: 2 }} />
            <Line yAxisId="right" type="monotone" dataKey="mom" name="Job Revenue MoM Growth" stroke={INDIGO} strokeWidth={2.5} dot={<CustomDot />} activeDot={{ r: 6, fill: INDIGO, stroke: 'white', strokeWidth: 2 }} />
            <Line yAxisId="left" type="monotone" dataKey="cum" name="Cumulative Job Revenue" stroke={EMERALD} strokeWidth={2.5} dot={<CustomDot />} activeDot={{ r: 6, fill: EMERALD, stroke: 'white', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardShell>
  );
}

/* — Job Revenue Table — */
const revenueTableData = [
  { month: 'Dec-2024', revenue: 1781, mom: -77.13 },
  { month: 'Jan-2025', revenue: 41245, mom: 2215.83 },
  { month: 'Feb-2025', revenue: 42106, mom: 2.09 },
  { month: 'Mar-2025', revenue: 56706, mom: 34.67 },
  { month: 'Apr-2025', revenue: 237304, mom: 318.48 },
  { month: 'May-2025', revenue: 23490953, mom: 9703.83 },
  { month: 'Jun-2025', revenue: 122509, mom: -99.48 },
  { month: 'Jul-2025', revenue: 188200, mom: 53.62 },
  { month: 'Aug-2025', revenue: 1212009, mom: 544.00 },
  { month: 'Sep-2025', revenue: 649475, mom: -46.41 },
  { month: 'Oct-2025', revenue: 800000, mom: 23.18 },
  { month: 'Nov-2025', revenue: 1100000, mom: 37.50 },
  { month: 'Dec-2025', revenue: 900000, mom: -18.18 },
];

export function RevenueTableCard({ footer, renameProps }: { footer?: React.ReactNode; renameProps?: RenameProps }) {
  const [page, setPage] = useState(0);
  const pageSize = 10;
  const total = revenueTableData.length;
  const start = page * pageSize;
  const pageRows = revenueTableData.slice(start, start + pageSize);
  const fmtMoney = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <CardShell title="Monthly Job Revenue & MoM Growth" subtitle="Per-month revenue with growth percentage" renameProps={renameProps} stats={[]} footer={footer}>
      <div className="w-full min-w-0 overflow-auto">
        <table className="w-full text-left" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E6E8EC' }}>
              <th className="py-2.5 pl-1 pr-3" style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Job Created Date</th>
              <th className="py-2.5 px-3 text-right" style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Job Revenue</th>
              <th className="py-2.5 px-3 text-right" style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Job Revenue MoM Growth</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r) => (
              <tr key={r.month} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td className="py-2.5 pl-1 pr-3" style={{ fontSize: 12, color: '#1C1E21' }}>{r.month}</td>
                <td className="py-2.5 px-3 text-right" style={{ fontSize: 12, color: '#1C1E21', fontVariantNumeric: 'tabular-nums' }}>{fmtMoney(r.revenue)}</td>
                <td className="py-2.5 px-3 text-right" style={{ fontSize: 12, color: r.mom >= 0 ? '#10B981' : '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{r.mom.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3">
        <span style={{ fontSize: 12, color: '#6B7280' }}>Showing {start + 1}–{Math.min(start + pageSize, total)} of {total} results</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6E8EC] text-[#6B7280] hover:bg-[#F8F9FB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >‹</button>
          <button
            onClick={() => setPage((p) => (start + pageSize < total ? p + 1 : p))}
            disabled={start + pageSize >= total}
            className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E6E8EC] text-[#6B7280] hover:bg-[#F8F9FB] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >›</button>
        </div>
      </div>
    </CardShell>
  );
}