import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Sep', revenue: 142000, jobsCompleted: 18 },
  { month: 'Oct', revenue: 168000, jobsCompleted: 22 },
  { month: 'Nov', revenue: 154000, jobsCompleted: 19 },
  { month: 'Dec', revenue: 128000, jobsCompleted: 14 },
  { month: 'Jan', revenue: 98000, jobsCompleted: 11 },
  { month: 'Feb', revenue: 175000, jobsCompleted: 24 },
];

export const RevenueChartWidget = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 min-h-[380px] card-hover-elevate">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-[#1C1E21] mb-1">Monthly Revenue</h3>
            <p className="text-[13px] text-[#6B7280]">6-month roofing revenue trend</p>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-semibold text-[#1C1E21]">$175K</p>
            <p className="text-[12px] text-[#10B981] font-medium">↑ 12.4% vs last month</p>
          </div>
        </div>
      </div>

      <div className="w-full h-[280px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid key="rc-grid" strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              key="rc-xaxis"
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              key="rc-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              key="rc-tooltip"
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #E6E8EC',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'revenue') return [`$${value.toLocaleString()}`, 'Revenue'];
                return [value, 'Jobs Completed'];
              }}
            />
            <Legend 
              key="rc-legend"
              wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}
              iconType="circle"
              iconSize={8}
              formatter={(value) => {
                if (value === 'revenue') return 'Revenue';
                if (value === 'jobsCompleted') return 'Jobs Completed';
                return value;
              }}
            />
            <Line 
              key="rc-line-revenue"
              type="monotone" 
              dataKey="revenue" 
              stroke="#FD5000" 
              strokeWidth={2}
              dot={{ fill: '#FD5000', strokeWidth: 2, r: 4, stroke: 'white' }}
              activeDot={{ r: 6 }}
            />
            <Line 
              key="rc-line-jobs"
              type="monotone" 
              dataKey="jobsCompleted" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4, stroke: 'white' }}
              activeDot={{ r: 6 }}
              yAxisId={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};