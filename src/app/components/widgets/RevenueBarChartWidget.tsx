import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export const RevenueBarChartWidget = () => {
  const data = [
    { type: 'Tear-Off', revenue: 68000, cost: 38000 },
    { type: 'Re-Roof', revenue: 52000, cost: 28000 },
    { type: 'Repair', revenue: 24000, cost: 10000 },
    { type: 'Flat Roof', revenue: 45000, cost: 25000 },
    { type: 'Commercial', revenue: 89000, cost: 48000 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 min-h-[380px] card-hover-elevate">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Revenue by Job Type</h3>
        <p className="text-[12px] text-[#6B7280]">Revenue vs material & labor costs</p>
      </div>

      <div className="w-full h-[280px] min-w-0">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data}>
            <CartesianGrid key="rbc-grid" strokeDasharray="3 3" stroke="#E6E8EC" vertical={false} />
            <XAxis 
              key="rbc-xaxis"
              dataKey="type" 
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: '#E6E8EC' }}
            />
            <YAxis 
              key="rbc-yaxis"
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E6E8EC' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              key="rbc-tooltip"
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E6E8EC',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number, name: string) => {
                const label = name === 'revenue' ? 'Revenue' : 'Costs';
                return [`$${value.toLocaleString()}`, label];
              }}
            />
            <Legend 
              key="rbc-legend"
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="circle"
              formatter={(value) => value === 'revenue' ? 'Revenue' : 'Costs'}
            />
            <Bar key="rbc-bar-revenue" dataKey="revenue" fill="#FD5000" radius={[4, 4, 0, 0]} />
            <Bar key="rbc-bar-cost" dataKey="cost" fill="#E6E8EC" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};