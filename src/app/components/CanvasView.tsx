import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CollectionAgentWidget } from './widgets/CollectionAgentWidget';
import { RevenueChartWidget } from './widgets/RevenueChartWidget';
import { CustomersTableWidget } from './widgets/CustomersTableWidget';
import { TasksWidget } from './widgets/TasksWidget';
import { PerformanceWidget } from './widgets/PerformanceWidget';
import { AttentionCardWidget } from './widgets/AttentionCardWidget';
import { RevenueBarChartWidget } from './widgets/RevenueBarChartWidget';
import { DollarSign, Users, FileText, TrendingUp, HardHat, Clock } from 'lucide-react';

interface CanvasViewProps {
  activeView: 'chat' | 'radar';
  onViewChange: (view: 'chat' | 'radar') => void;
  onWidgetClick?: (conversationTopic: string, widgetId: string) => void;
}

const HoverHint = () => (
  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/widget:opacity-100 transition-opacity duration-200">
    <div className="flex items-center gap-1 px-2 py-1 bg-[#1C1E21]/80 backdrop-blur-sm rounded-md">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span className="text-[10px] text-white font-medium">Open chat</span>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, change, changeColor, iconBg }: {
  icon: any; label: string; value: string; change: string; changeColor: string; iconBg: string;
}) => (
  <div className="bg-white rounded-xl border border-[#E6E8EC] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] card-hover-elevate">
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-[20px] text-[#1C1E21]" style={{ fontWeight: 700 }}>{value}</p>
          <span className={`text-[11px] font-medium ${changeColor}`}>{change}</span>
        </div>
      </div>
    </div>
  </div>
);

export const CanvasView = ({ activeView, onViewChange, onWidgetClick }: CanvasViewProps) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex-1 overflow-y-auto bg-white rounded-xl scrollbar-auto-hide">
        <div className="min-h-full flex flex-col bg-white relative">
          {/* Top Header Bar with Canvas/Chat Switcher */}
          <div className="h-[56px] border-b border-[#E6E8EC] flex items-center justify-between px-6 flex-shrink-0 bg-white relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-[18px] h-[18px]"></div>
            </div>

            {/* Canvas/Chat Switcher - Centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="inline-flex items-center bg-[#F8F9FB] rounded-lg p-1 gap-1">
                <button
                  onClick={() => onViewChange('chat')}
                  className={`px-4 py-1.5 rounded-md text-[14px] font-medium transition-all duration-200 ${
                    activeView === 'chat'
                      ? 'bg-white text-[#1C1E21] shadow-sm'
                      : 'text-[#6B7280] hover:text-[#1C1E21]'
                  }`}
                >
                  Chat
                </button>
                <button
                  onClick={() => onViewChange('radar')}
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
              <div className="w-[18px] h-[18px]"></div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto scrollbar-auto-hide">
            <div className="max-w-[1400px] mx-auto px-10 py-8 pb-20">
              {/* Page Header */}
              <div className="mb-6">
                <h1 className="text-[22px] font-semibold text-[#1C1E21] mb-1">Dashboard Canvas</h1>
                <p className="text-[13px] text-[#6B7280]">Business overview and active agents · Click any card to open its conversation</p>
              </div>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <StatCard
                  icon={DollarSign}
                  label="Revenue (MTD)"
                  value="$214K"
                  change="+12.3%"
                  changeColor="text-[#10B981]"
                  iconBg="bg-[#10B981]"
                />
                <StatCard
                  icon={HardHat}
                  label="Active Jobs"
                  value="23"
                  change="+3 this week"
                  changeColor="text-[#10B981]"
                  iconBg="bg-[#3B82F6]"
                />
                <StatCard
                  icon={FileText}
                  label="Open Quotes"
                  value="$127K"
                  change="8 pending"
                  changeColor="text-[#F59E0B]"
                  iconBg="bg-[#F59E0B]"
                />
                <StatCard
                  icon={Users}
                  label="Crew Utilization"
                  value="87%"
                  change="+5% vs last wk"
                  changeColor="text-[#10B981]"
                  iconBg="bg-[#8B5CF6]"
                />
              </div>

              {/* Attention Alerts */}
              <div
                className="mb-6 cursor-pointer group/widget"
                onClick={() => onWidgetClick?.('Review & follow up on 3 stuck quotes worth $84,000', 'attention')}
              >
                <div className="relative rounded-2xl">
                  <HoverHint />
                  <AttentionCardWidget />
                </div>
              </div>

              {/* Collection Agent Widget - Featured Hero Card */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FD5000]"></div>
                  <h2 className="text-[14px] font-semibold text-[#1C1E21]">Active Agents</h2>
                </div>
                <div
                  className="cursor-pointer group/widget"
                  onClick={() => onWidgetClick?.('Show me the Collection Assistant Agent performance and DSO improvement', 'collection-agent')}
                >
                  <div className="relative rounded-2xl">
                    <HoverHint />
                    <CollectionAgentWidget />
                  </div>
                </div>
              </div>

              {/* Supporting Dashboard Widgets */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6B7280]"></div>
                <h2 className="text-[14px] font-semibold text-[#1C1E21]">Business Overview</h2>
              </div>
              <div className="grid grid-cols-12 gap-6 auto-rows-min items-start">
                {/* Revenue Chart */}
                <div
                  className="col-span-6 min-w-0 cursor-pointer group/widget"
                  onClick={() => onWidgetClick?.('How is our monthly roofing revenue trending?', 'line-chart')}
                >
                  <div className="relative rounded-2xl">
                    <HoverHint />
                    <RevenueChartWidget />
                  </div>
                </div>

                {/* Revenue Bar Chart */}
                <div
                  className="col-span-6 min-w-0 cursor-pointer group/widget"
                  onClick={() => onWidgetClick?.('Break down revenue and costs by job type', 'bar-chart')}
                >
                  <div className="relative rounded-2xl">
                    <HoverHint />
                    <RevenueBarChartWidget />
                  </div>
                </div>

                {/* Customers Table */}
                <div
                  className="col-span-6 min-w-0 cursor-pointer group/widget"
                  onClick={() => onWidgetClick?.('Show me active roofing jobs and customer status', 'customers')}
                >
                  <div className="relative rounded-2xl">
                    <HoverHint />
                    <CustomersTableWidget />
                  </div>
                </div>

                {/* Performance */}
                <div
                  className="col-span-6 min-w-0 cursor-pointer group/widget"
                  onClick={() => onWidgetClick?.('How did we perform this quarter on roofing jobs?', 'performance')}
                >
                  <div className="relative rounded-2xl">
                    <HoverHint />
                    <PerformanceWidget />
                  </div>
                </div>

                {/* Tasks */}
                <div
                  className="col-span-6 min-w-0 cursor-pointer group/widget"
                  onClick={() => onWidgetClick?.("What's on my checklist today?", 'tasks')}
                >
                  <div className="relative rounded-2xl">
                    <HoverHint />
                    <TasksWidget />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};