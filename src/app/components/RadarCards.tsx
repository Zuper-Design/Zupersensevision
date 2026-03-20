import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ReferenceLine, Area, AreaChart, Cell,
} from 'recharts';
import React from 'react';

/* ─── Shared ─── */

const CustomDot = ({ cx, cy, stroke }: any) => (
  <circle cx={cx} cy={cy} r={4} fill="white" stroke={stroke} strokeWidth={2} />
);

const StatRow = ({ stats }: { stats: { label: string; value: string; color: string }[] }) => (
  <div className="flex items-center gap-6 mt-4 pt-3 border-t border-[#F0F0F0]">
    {stats.map((s) => (
      <div key={s.label}>
        <p className="text-[11px] text-[#9CA3AF]">{s.label}</p>
        <p className="text-[16px]" style={{ fontWeight: 600, color: s.color }}>{s.value}</p>
      </div>
    ))}
  </div>
);

const CardFooter = ({ footer }: { footer?: React.ReactNode }) =>
  footer ? <div className="mt-4 pt-3 border-t border-[#F0F0F0]">{footer}</div> : null;

const CardShell = ({
  title,
  subtitle,
  children,
  stats,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  stats: { label: string; value: string; color: string }[];
  footer?: React.ReactNode;
}) => (
  <div className="w-full bg-white rounded-xl border border-[#E6E8EC] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative group/card">
    <div className="mb-4">
      <h3 className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 700 }}>{title}</h3>
      <p className="text-[13px] text-[#6B7280] mt-0.5">{subtitle}</p>
    </div>
    {children}
    <StatRow stats={stats} />
    <CardFooter footer={footer} />
  </div>
);

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

export function RevenueMTDCard({ footer }: { footer?: React.ReactNode }) {
  return (
    <CardShell
      title="Revenue MTD vs Target"
      subtitle="Daily cumulative revenue against monthly target pace"
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

export function OverdueInvoicesCard({ footer }: { footer?: React.ReactNode }) {
  return (
    <CardShell
      title="Overdue Invoices"
      subtitle="Invoice aging breakdown by overdue period"
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

export function QuoteConversionCard({ footer }: { footer?: React.ReactNode }) {
  return (
    <CardShell
      title="Quote-to-Invoice Conversion"
      subtitle="Monthly conversion rate trend over the last 8 months"
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

export function CrewUtilisationCard({ footer }: { footer?: React.ReactNode }) {
  return (
    <CardShell
      title="Crew Utilisation"
      subtitle="Weekly utilisation rate by crew — target 80%"
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

export function JobsCompletedCard({ footer }: { footer?: React.ReactNode }) {
  return (
    <CardShell
      title="Jobs — Completed vs At Risk"
      subtitle="Weekly job completion and active risk flags — current week"
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