import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { Bot, Send, DollarSign, Clock, AlertTriangle, TrendingDown, CheckCircle, ArrowRight } from 'lucide-react';

const dsoData = [
  { month: 'Jun', before: 38, after: null as number | null },
  { month: 'Jul', before: 40, after: null as number | null },
  { month: 'Aug', before: 43, after: null as number | null },
  { month: 'Sep', before: 47, after: null as number | null },
  { month: 'Oct', before: 52, after: null as number | null },
  { month: 'Nov', before: 58, after: null as number | null },
  { month: 'Dec', before: 58, after: 58 },
  { month: 'Jan', before: null as number | null, after: 51 },
  { month: 'Feb', before: null as number | null, after: 44 },
];

const activityLog = [
  { time: '2h ago', action: 'Payment reminder sent to Marcus Renovations', type: 'reminder' as const },
  { time: '3h ago', action: '$4,200 collected from Greenfield Roofing Co.', type: 'collected' as const },
  { time: '5h ago', action: 'Follow-up #3 sent to Hillside Construction', type: 'reminder' as const },
  { time: '6h ago', action: '$8,750 collected from Summit Properties', type: 'collected' as const },
  { time: '1d ago', action: 'Escalation flag set for Cedar Valley Builders', type: 'escalation' as const },
  { time: '1d ago', action: '$2,100 collected from Oakridge Homes', type: 'collected' as const },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg shadow-lg px-3 py-2">
        <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-[13px]" style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value} days</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CollectionAgentWidget() {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');

  return (
    <div className="bg-white border border-[#E6E8EC] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] card-hover-elevate">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[#E6E8EC]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFF4ED] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#FD5000]" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1C1E21]">Collection Assistant Agent</h2>
              <p className="text-[12px] text-[#6B7280]">Activated Dec 15, 2025 · Running for 72 days</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] text-[#10B981] text-[12px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              Active
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-[#F8F9FB] text-[#1C1E21]'
                : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
              activeTab === 'activity'
                ? 'bg-[#F8F9FB] text-[#1C1E21]'
                : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
          >
            Activity Log
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-4 gap-0 border-b border-[#E6E8EC]">
            <div className="px-5 py-4 border-r border-[#E6E8EC]">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-3.5 h-3.5 text-[#FD5000]" />
                <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wide font-medium">Reminders Sent</span>
              </div>
              <p className="text-[28px] text-[#1C1E21] leading-none mb-1">147</p>
              <p className="text-[12px] text-[#10B981] font-medium">+23 this week</p>
            </div>
            <div className="px-5 py-4 border-r border-[#E6E8EC]">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wide font-medium">Cash Collected</span>
              </div>
              <p className="text-[28px] text-[#1C1E21] leading-none mb-1">$84.2K</p>
              <p className="text-[12px] text-[#10B981] font-medium">+$12.4K this week</p>
            </div>
            <div className="px-5 py-4 border-r border-[#E6E8EC]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wide font-medium">DSO Reduction</span>
              </div>
              <p className="text-[28px] text-[#1C1E21] leading-none mb-1">-14 days</p>
              <p className="text-[12px] text-[#10B981] font-medium">58 → 44 days</p>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wide font-medium">Invoices Cleared</span>
              </div>
              <p className="text-[28px] text-[#1C1E21] leading-none mb-1">38</p>
              <p className="text-[12px] text-[#10B981] font-medium">89% success rate</p>
            </div>
          </div>

          {/* DSO Trend Chart */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-semibold text-[#1C1E21]">DSO Trend — Before vs After Agent</h3>
                <p className="text-[12px] text-[#9CA3AF] mt-0.5">Days Sales Outstanding over time</p>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-[2px] bg-[#EF4444] rounded-full"></div>
                  <span className="text-[#6B7280]">Before agent</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-[2px] bg-[#10B981] rounded-full"></div>
                  <span className="text-[#6B7280]">After agent</span>
                </div>
              </div>
            </div>
            <div className="w-full h-[260px] min-w-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart data={dsoData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid key="ca-grid" strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis
                    key="ca-xaxis"
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={{ stroke: '#E6E8EC' }}
                    tickLine={false}
                  />
                  <YAxis
                    key="ca-yaxis"
                    tick={{ fontSize: 12, fill: '#9CA3AF' }}
                    axisLine={false}
                    tickLine={false}
                    domain={[30, 65]}
                    tickFormatter={(v) => `${v}d`}
                  />
                  <Tooltip key="ca-tooltip" content={<CustomTooltip />} />
                  <ReferenceLine
                    key="ca-refline"
                    x="Dec"
                    stroke="#FD5000"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{
                      value: 'Agent activated',
                      position: 'top',
                      fill: '#FD5000',
                      fontSize: 11,
                      fontWeight: 500,
                    }}
                  />
                  <Line
                    key="ca-line-before"
                    type="monotone"
                    dataKey="before"
                    stroke="#EF4444"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#EF4444', strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                    name="Before agent"
                    connectNulls={false}
                  />
                  <Line
                    key="ca-line-after"
                    type="monotone"
                    dataKey="after"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                    name="After agent"
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Stats Bar */}
          <div className="px-6 py-3 border-t border-[#E6E8EC] bg-[#FAFAFA] flex items-center justify-between">
            <div className="flex items-center gap-4 text-[12px] text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span><span className="font-medium text-[#1C1E21]">5</span> invoices flagged for escalation</span>
              </div>
              <span className="text-[#E6E8EC]">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Next batch in <span className="font-medium text-[#1C1E21]">4h 22m</span></span>
              </div>
            </div>
            <button className="flex items-center gap-1 text-[12px] font-medium text-[#FD5000] hover:text-[#E04800] transition-colors">
              View all invoices
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      ) : (
        /* Activity Log Tab */
        <div className="px-6 py-4">
          <div className="space-y-0">
            {activityLog.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-[#F3F4F6] last:border-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.type === 'collected' ? 'bg-[#ECFDF5]' :
                  item.type === 'escalation' ? 'bg-[#FEF3C7]' :
                  'bg-[#FFF4ED]'
                }`}>
                  {item.type === 'collected' ? (
                    <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
                  ) : item.type === 'escalation' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                  ) : (
                    <Send className="w-3.5 h-3.5 text-[#FD5000]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#1C1E21]">{item.action}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}