import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, Briefcase, Clock, Star } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
  CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';

// --- Data ---

const revenueData = [
  { month: 'Sep', revenue: 58200, lastYear: 49100 },
  { month: 'Oct', revenue: 67400, lastYear: 54300 },
  { month: 'Nov', revenue: 72100, lastYear: 58800 },
  { month: 'Dec', revenue: 63900, lastYear: 61200 },
  { month: 'Jan', revenue: 78500, lastYear: 55600 },
  { month: 'Feb', revenue: 84300, lastYear: 62400 },
  { month: 'Mar', revenue: 91200, lastYear: 68900 },
];

const jobsData = [
  { name: 'Re-roofing', completed: 18, inProgress: 7, color: '#EB5D2A' },
  { name: 'Repairs', completed: 24, inProgress: 4, color: '#F8A472' },
  { name: 'Inspections', completed: 31, inProgress: 2, color: '#10B981' },
  { name: 'Commercial', completed: 8, inProgress: 5, color: '#6366F1' },
  { name: 'Gutters', completed: 12, inProgress: 3, color: '#A78BFA' },
];

const crewData = [
  { name: 'Crew A', score: 94, jobs: 14, revenue: '$128K', color: '#10B981' },
  { name: 'Crew B', score: 87, jobs: 11, revenue: '$96K', color: '#EB5D2A' },
  { name: 'Crew C', score: 78, jobs: 9, revenue: '$72K', color: '#F59E0B' },
  { name: 'Crew D', score: 91, jobs: 12, revenue: '$114K', color: '#6366F1' },
];

const weeklyTrendData = [
  { day: 'Mon', jobs: 4, hours: 32 },
  { day: 'Tue', jobs: 6, hours: 42 },
  { day: 'Wed', jobs: 5, hours: 38 },
  { day: 'Thu', jobs: 7, hours: 48 },
  { day: 'Fri', jobs: 8, hours: 52 },
  { day: 'Sat', jobs: 3, hours: 18 },
];

const satisfactionData = [
  { name: '5 Stars', value: 42, fill: '#10B981' },
  { name: '4 Stars', value: 28, fill: '#6366F1' },
  { name: '3 Stars', value: 12, fill: '#F59E0B' },
  { name: '2 Stars', value: 3, fill: '#EF4444' },
  { name: '1 Star', value: 1, fill: '#9CA3AF' },
];

const overallScore = [{ name: 'Score', value: 87, fill: '#EB5D2A' }];

// --- Tooltip ---

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-lg">
        <p className="text-[11px] text-[#9CA3AF] mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-[12px]" style={{ color: entry.color || entry.stroke }}>
            {entry.name}: <span className="font-semibold text-[#1C1E21]">
              {typeof entry.value === 'number' && entry.name?.toLowerCase().includes('revenue')
                ? `$${(entry.value / 1000).toFixed(1)}K`
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Sub-components ---

function KPICard({ icon: Icon, label, value, change, positive, color }: {
  icon: any; label: string; value: string; change: string; positive: boolean; color: string;
}) {
  return (
    <div className="flex-1 min-w-0 p-4 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0]">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}12` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-[22px] text-[#1C1E21] leading-none mb-1" style={{ fontWeight: 600 }}>{value}</p>
      <div className="flex items-center gap-1">
        {positive ? (
          <TrendingUp className="w-3 h-3 text-[#10B981]" />
        ) : (
          <TrendingDown className="w-3 h-3 text-[#EF4444]" />
        )}
        <span className={`text-[11px] font-medium ${positive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{change}</span>
        <span className="text-[11px] text-[#9CA3AF]">vs last period</span>
      </div>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EC] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Revenue Trend</h4>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Monthly comparison, this year vs last</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EB5D2A]" />
            <span className="text-[11px] text-[#6B7280]">This Year</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E6E8EC]" />
            <span className="text-[11px] text-[#6B7280]">Last Year</span>
          </div>
        </div>
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs key="defs">
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EB5D2A" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EB5D2A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lastYearGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid key="grid" strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
            <XAxis key="xaxis" dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={8} />
            <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v) => `$${v / 1000}K`} />
            <Tooltip key="tooltip" content={<ChartTooltip />} />
            <Area key="lastYear" type="monotone" dataKey="lastYear" name="Last Year Revenue" stroke="#D1D5DB" strokeWidth={1.5} fill="url(#lastYearGrad)" dot={false} />
            <Area key="revenue" type="monotone" dataKey="revenue" name="This Year Revenue" stroke="#EB5D2A" strokeWidth={2} fill="url(#revenueGrad)" dot={{ r: 3, fill: '#EB5D2A', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function JobDistributionChart() {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EC] p-5">
      <div className="mb-4">
        <h4 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Jobs by Category</h4>
        <p className="text-[12px] text-[#9CA3AF] mt-0.5">Completed vs in-progress this quarter</p>
      </div>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={jobsData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} barGap={2}>
            <CartesianGrid key="grid" strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
            <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={8} />
            <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <Tooltip key="tooltip" content={<ChartTooltip />} />
            <Bar key="completed" dataKey="completed" name="Completed" fill="#EB5D2A" radius={[4, 4, 0, 0]} barSize={16} />
            <Bar key="inProgress" dataKey="inProgress" name="In Progress" fill="#F8D5C2" radius={[4, 4, 0, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CrewPerformance() {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EC] p-5">
      <div className="mb-4">
        <h4 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Crew Performance</h4>
        <p className="text-[12px] text-[#9CA3AF] mt-0.5">Completion rate by crew</p>
      </div>
      <div className="space-y-3">
        {crewData.map((crew) => (
          <div key={crew.name} className="flex items-center gap-3">
            <span className="text-[12px] text-[#6B7280] w-[52px] flex-shrink-0">{crew.name}</span>
            <div className="flex-1 h-[22px] bg-[#F5F5F5] rounded-full overflow-hidden relative">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${crew.score}%`, backgroundColor: crew.color }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#6B7280]">{crew.score}%</span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-[11px] text-[#9CA3AF]">{crew.jobs} jobs</span>
              <span className="text-[11px] text-[#1C1E21] font-medium">{crew.revenue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeeklyActivityChart() {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EC] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Weekly Activity</h4>
          <p className="text-[12px] text-[#9CA3AF] mt-0.5">Jobs completed & hours logged this week</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
            <span className="text-[11px] text-[#6B7280]">Jobs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EB5D2A]" />
            <span className="text-[11px] text-[#6B7280]">Hours</span>
          </div>
        </div>
      </div>
      <div style={{ height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyTrendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid key="grid" strokeDasharray="0" stroke="#F5F5F5" vertical={false} />
            <XAxis key="xaxis" dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} dy={8} />
            <YAxis key="yaxis" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
            <Tooltip key="tooltip" content={<ChartTooltip />} />
            <Line key="jobs" type="monotone" dataKey="jobs" name="Jobs" stroke="#6366F1" strokeWidth={2} dot={{ r: 3, fill: '#6366F1', stroke: '#fff', strokeWidth: 2 }} />
            <Line key="hours" type="monotone" dataKey="hours" name="Hours" stroke="#EB5D2A" strokeWidth={2} dot={{ r: 3, fill: '#EB5D2A', stroke: '#fff', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OverallScoreGauge() {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EC] p-5 flex flex-col items-center">
      <h4 className="text-[14px] text-[#1C1E21] self-start" style={{ fontWeight: 600 }}>Overall Score</h4>
      <p className="text-[12px] text-[#9CA3AF] mt-0.5 self-start mb-2">Business health index</p>
      <div style={{ width: 140, height: 140 }}>
        <ResponsiveContainer>
          <RadialBarChart cx="50%" cy="50%" innerRadius="72%" outerRadius="100%" startAngle={90} endAngle={-270} data={overallScore} barSize={14}>
            <RadialBar background={{ fill: '#F5F5F5' }} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="-mt-[90px] flex flex-col items-center mb-4">
        <span className="text-[28px] text-[#1C1E21]" style={{ fontWeight: 700 }}>87</span>
        <span className="text-[11px] text-[#10B981] font-medium">+4 pts</span>
      </div>
    </div>
  );
}

function SatisfactionBreakdown() {
  return (
    <div className="bg-white rounded-xl border border-[#E6E8EC] p-5">
      <h4 className="text-[14px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Customer Satisfaction</h4>
      <p className="text-[12px] text-[#9CA3AF] mt-0.5 mb-4">Rating distribution from 86 reviews</p>
      <div className="flex items-center gap-4">
        <div style={{ width: 110, height: 110 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={satisfactionData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={50}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {satisfactionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {satisfactionData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
              <span className="text-[11px] text-[#6B7280] flex-1">{item.name}</span>
              <span className="text-[11px] text-[#1C1E21] font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---

interface MetricsChartCardsProps {
  variant?: 'full' | 'team' | 'revenue' | 'jobs';
}

export function MetricsChartCards({ variant = 'full' }: MetricsChartCardsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'team' | 'jobs'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'revenue' as const, label: 'Revenue' },
    { id: 'team' as const, label: 'Team' },
    { id: 'jobs' as const, label: 'Jobs' },
  ];

  // If a specific variant is requested, show that directly
  const effectiveTab = variant !== 'full' ? variant === 'team' ? 'team' : variant === 'revenue' ? 'revenue' : variant === 'jobs' ? 'jobs' : activeTab : activeTab;

  return (
    <div className="w-full bg-white rounded-[16px] border border-[#E6E8EC] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      {/* Header */}
      <div className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 700 }}>Performance Dashboard</h3>
          <span className="text-[11px] text-[#9CA3AF] bg-[#F8F9FB] px-2.5 py-1 rounded-full">Last 30 days</span>
        </div>
        <p className="text-[12px] text-[#9CA3AF] mb-4">Key metrics and trends across your business</p>

        {/* Tabs */}
        {variant === 'full' && (
          <div className="flex gap-0 border-b border-[#E6E8EC] -mx-5 px-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-[12px] font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-[#EB5D2A]'
                    : 'text-[#9CA3AF] hover:text-[#6B7280]'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EB5D2A] rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {effectiveTab === 'overview' && (
          <div className="space-y-4">
            {/* KPI Row */}
            <div className="flex gap-3">
              <KPICard icon={Briefcase} label="Revenue" value="$347K" change="+18.6%" positive={true} color="#EB5D2A" />
              <KPICard icon={Users} label="Jobs Done" value="93" change="+14%" positive={true} color="#6366F1" />
              <KPICard icon={Clock} label="Avg Time" value="2.4d" change="-12%" positive={true} color="#10B981" />
              <KPICard icon={Star} label="NPS" value="72" change="+5pts" positive={true} color="#F59E0B" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-2 gap-4">
              <RevenueChart />
              <JobDistributionChart />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <CrewPerformance />
              </div>
              <OverallScoreGauge />
            </div>
          </div>
        )}

        {effectiveTab === 'revenue' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <KPICard icon={Briefcase} label="Total Revenue" value="$347K" change="+18.6%" positive={true} color="#EB5D2A" />
              <KPICard icon={TrendingUp} label="Avg Job Value" value="$9,137" change="+$420" positive={true} color="#10B981" />
              <KPICard icon={Star} label="Close Rate" value="64%" change="-3%" positive={false} color="#F59E0B" />
            </div>
            <RevenueChart />
            <div className="grid grid-cols-2 gap-4">
              <JobDistributionChart />
              <SatisfactionBreakdown />
            </div>
          </div>
        )}

        {effectiveTab === 'team' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <KPICard icon={Users} label="Active Members" value="18" change="+2" positive={true} color="#6366F1" />
              <KPICard icon={Briefcase} label="Jobs / Member" value="5.2" change="+0.8" positive={true} color="#EB5D2A" />
              <KPICard icon={Clock} label="Utilization" value="86%" change="+4%" positive={true} color="#10B981" />
            </div>
            <CrewPerformance />
            <div className="grid grid-cols-2 gap-4">
              <WeeklyActivityChart />
              <SatisfactionBreakdown />
            </div>
          </div>
        )}

        {effectiveTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <KPICard icon={Briefcase} label="Total Jobs" value="93" change="+14%" positive={true} color="#EB5D2A" />
              <KPICard icon={Clock} label="On-Time Rate" value="89%" change="+3%" positive={true} color="#10B981" />
              <KPICard icon={Users} label="At Risk" value="7" change="+2" positive={false} color="#EF4444" />
            </div>
            <JobDistributionChart />
            <div className="grid grid-cols-2 gap-4">
              <WeeklyActivityChart />
              <CrewPerformance />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}