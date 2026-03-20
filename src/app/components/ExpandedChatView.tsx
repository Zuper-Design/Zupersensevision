import { X, Send, Mic, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface ExpandedChatViewProps {
  onClose: () => void;
}

export function ExpandedChatView({ onClose }: ExpandedChatViewProps) {
  // Mock conversation data
  const messages = [
    {
      id: 1,
      type: 'user' as const,
      text: 'How is my business doing?',
      timestamp: '2:34 PM',
    },
    {
      id: 2,
      type: 'ai' as const,
      text: "Here's a comprehensive overview of your business performance:",
      timestamp: '2:34 PM',
      hasData: true,
    },
  ];

  // Mock chart data
  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 40000 },
    { month: 'Feb', revenue: 52000, target: 45000 },
    { month: 'Mar', revenue: 48000, target: 50000 },
    { month: 'Apr', revenue: 61000, target: 55000 },
    { month: 'May', revenue: 58000, target: 60000 },
    { month: 'Jun', revenue: 72000, target: 65000 },
  ];

  const jobsData = [
    { day: 'Mon', completed: 12, pending: 5 },
    { day: 'Tue', completed: 15, pending: 3 },
    { day: 'Wed', completed: 8, pending: 7 },
    { day: 'Thu', completed: 14, pending: 4 },
    { day: 'Fri', completed: 18, pending: 2 },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#E6E8EC] px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[#1C1E21] font-semibold text-lg">Voice Conversation</h1>
          <p className="text-[#6B7280] text-sm">Today at 2:34 PM</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-[#F8F9FB] hover:bg-[#E6E8EC] transition-all duration-200"
          aria-label="Close conversation"
        >
          <X className="w-5 h-5 text-[#6B7280]" />
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 scrollbar-auto-hide">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                // User message
                <div className="flex justify-end">
                  <div className="max-w-[70%]">
                    <div className="bg-[#FF6B35] text-white rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-sm">
                      <p className="text-[15px]">{message.text}</p>
                    </div>
                    <p className="text-[#9CA3AF] text-xs mt-1.5 text-right">{message.timestamp}</p>
                  </div>
                </div>
              ) : (
                // AI message
                <div className="flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FD5000] to-[#DC4600] flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">S</span>
                      </div>
                      <span className="text-[#6B7280] text-sm font-medium">Sense</span>
                      <span className="text-[#9CA3AF] text-xs">{message.timestamp}</span>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm border border-[#E6E8EC]">
                      <div className="text-[#1C1E21] text-[15px] leading-relaxed space-y-3 mb-4">
                        <p>Great question! Let me walk you through your business performance this month. Overall, you're in a strong position with some important areas to focus on.</p>
                        
                        <p><strong className="text-[#1C1E21]">Revenue Performance:</strong> Your June revenue hit $72,000, which is an 18% increase from May. This is excellent news—you've exceeded your target of $65,000 by $7,000. Looking at the trend over the last 6 months, you've shown consistent growth, with only a small dip in March when you came in $2,000 below target. The upward trajectory is strong, and you're averaging about 8% monthly growth.</p>
                        
                        <p><strong className="text-[#1C1E21]">Job Completion:</strong> You've completed 67 jobs this month, with 12 jobs finished just this week alone. Your team's productivity is trending upward, especially on Fridays when you're averaging 18 completions. However, I notice that Wednesdays are your slowest days with only 8 completions, and there's a spike in pending jobs mid-week.</p>
                        
                        <p><strong className="text-[#1C1E21]">Areas of Concern:</strong> You currently have 21 pending jobs, and 3 of those are overdue. This represents about $84,000 in potential revenue at risk. Most of these are re-roofing jobs that have been delayed due to material shortages and scheduling conflicts. If we can address these quickly, you'll see another significant revenue boost.</p>
                      </div>
                      
                      {message.hasData && (
                        <div className="space-y-4 mt-6">
                          {/* Key Metrics Cards */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-[#F8F9FB] rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-lg bg-[#10B981]/10">
                                  <TrendingUp className="w-4 h-4 text-[#10B981]" />
                                </div>
                                <span className="text-[#6B7280] text-xs">Revenue</span>
                              </div>
                              <p className="text-[#1C1E21] font-semibold text-xl">$72,000</p>
                              <p className="text-[#10B981] text-xs mt-1">+18% from last month</p>
                            </div>
                            
                            <div className="bg-[#F8F9FB] rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-lg bg-[#FF6B35]/10">
                                  <DollarSign className="w-4 h-4 text-[#FF6B35]" />
                                </div>
                                <span className="text-[#6B7280] text-xs">Jobs Completed</span>
                              </div>
                              <p className="text-[#1C1E21] font-semibold text-xl">67</p>
                              <p className="text-[#10B981] text-xs mt-1">+12 this week</p>
                            </div>
                            
                            <div className="bg-[#F8F9FB] rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 rounded-lg bg-[#EF4444]/10">
                                  <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                                </div>
                                <span className="text-[#6B7280] text-xs">Pending</span>
                              </div>
                              <p className="text-[#1C1E21] font-semibold text-xl">21</p>
                              <p className="text-[#6B7280] text-xs mt-1">3 overdue</p>
                            </div>
                          </div>

                          {/* Revenue Chart */}
                          <div className="bg-[#F8F9FB] rounded-xl p-5 min-w-0">
                            <h3 className="text-[#1C1E21] font-medium text-sm mb-4">Revenue Trend (Last 6 Months)</h3>
                            <ResponsiveContainer width="100%" height={200} minWidth={0}>
                              <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EC" />
                                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #E6E8EC',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }} 
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#FD5000" strokeWidth={2} dot={{ fill: '#FD5000' }} />
                                <Line type="monotone" dataKey="target" stroke="#9CA3AF" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#9CA3AF' }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Jobs Chart */}
                          <div className="bg-[#F8F9FB] rounded-xl p-5 min-w-0">
                            <h3 className="text-[#1C1E21] font-medium text-sm mb-4">Jobs This Week</h3>
                            <ResponsiveContainer width="100%" height={180} minWidth={0}>
                              <BarChart data={jobsData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E6E8EC" />
                                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #E6E8EC',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }} 
                                />
                                <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" fill="#FD5000" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Additional Analysis */}
                          <div className="text-[#1C1E21] text-[15px] leading-relaxed space-y-3 mt-4">
                            <p><strong className="text-[#1C1E21]">Team Performance:</strong> Your crew productivity has been stellar this month. The completion rate increased by 12 jobs compared to last week, and you're maintaining an average of 13.4 jobs per day. However, the mid-week slowdown on Wednesdays suggests there might be a scheduling or resource allocation issue worth investigating.</p>
                            
                            <p><strong className="text-[#1C1E21]">Customer Satisfaction:</strong> Your average project completion time is 4.2 days, which is right on target for the industry standard. The 3 overdue jobs are affecting your on-time completion rate, bringing it down to 87% this month from your usual 95%.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Suggested Action Pills - Outside conversation card */}
          <div className="mt-6">
            <p className="text-[#6B7280] text-sm font-medium mb-3">Suggested Actions</p>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2.5 bg-white border border-[#E6E8EC] rounded-full text-[#1C1E21] text-sm font-medium hover:border-[#FD5000] hover:bg-[#FFF4ED] transition-all duration-200 hover:scale-105 hover:shadow-md">
                Address 3 Overdue Jobs ($28K)
              </button>
              
              <button className="px-4 py-2.5 bg-white border border-[#E6E8EC] rounded-full text-[#1C1E21] text-sm font-medium hover:border-[#FD5000] hover:bg-[#FFF4ED] transition-all duration-200 hover:scale-105 hover:shadow-md">
                Optimize Wednesday Scheduling
              </button>
              
              <button className="px-4 py-2.5 bg-white border border-[#E6E8EC] rounded-full text-[#1C1E21] text-sm font-medium hover:border-[#FD5000] hover:bg-[#FFF4ED] transition-all duration-200 hover:scale-105 hover:shadow-md">
                Follow Up on 18 Pending Quotes
              </button>
              
              <button className="px-4 py-2.5 bg-white border border-[#E6E8EC] rounded-full text-[#1C1E21] text-sm font-medium hover:border-[#FD5000] hover:bg-[#FFF4ED] transition-all duration-200 hover:scale-105 hover:shadow-md">
                Set July Target at $80K
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="bg-white border-t border-[#E6E8EC] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#F8F9FB] rounded-2xl px-5 py-3 flex items-center gap-3 border border-[#E6E8EC] focus-within:border-[#FD5000] transition-colors">
            <input
              type="text"
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-transparent outline-none text-[#1C1E21] placeholder:text-[#9CA3AF] text-[15px]"
            />
            <button
              className="p-2 rounded-lg bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] transition-all duration-200 hover:scale-105"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
            <button
              className="p-2 rounded-lg bg-white hover:bg-[#E6E8EC] transition-all duration-200 hover:scale-105 border border-[#E6E8EC]"
              aria-label="Voice input"
            >
              <Mic className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
          <p className="text-[#9CA3AF] text-xs text-center mt-2">You can ask in text or voice</p>
        </div>
      </div>
    </div>
  );
}