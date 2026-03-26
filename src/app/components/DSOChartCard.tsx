import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { RenameProps } from './RadarCards';

const data = [
  { month: 'Jul', dso: 38, industryAvg: 45 },
  { month: 'Aug', dso: 35, industryAvg: 44 },
  { month: 'Sep', dso: 42, industryAvg: 43 },
  { month: 'Oct', dso: 52, industryAvg: 44 },
  { month: 'Nov', dso: 58, industryAvg: 44 },
  { month: 'Dec', dso: 64, industryAvg: 45 },
  { month: 'Jan', dso: 68, industryAvg: 44 },
  { month: 'Feb', dso: 72, industryAvg: 45 },
];

const CustomDot = ({ cx, cy, stroke }: any) => (
  <circle cx={cx} cy={cy} r={4} fill="white" stroke={stroke} strokeWidth={2} />
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md">
        <p className="text-[12px] text-[#6B7280] mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[12px]" style={{ color: entry.stroke }}>
            {entry.name}: <span className="font-medium text-[#1C1E21]">{entry.value} days</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function DSOChartCard({ onAddToRadar, footer, renameProps }: { onAddToRadar?: () => void; footer?: React.ReactNode; renameProps?: RenameProps }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renameProps?.isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renameProps?.isRenaming]);

  return (
    <div className="w-full bg-white rounded-xl border border-[#E6E8EC] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative group/card">
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
              className="text-[15px] text-[#1C1E21] w-full"
              style={{
                fontWeight: 700, background: '#FFFFFF',
                border: '1.5px solid #E6E8EC', borderRadius: 6,
                outline: 'none', padding: '2px 8px',
                width: '100%', maxWidth: 400,
                boxShadow: '0 0 0 3px rgba(253,80,0,0.08)',
              }}
            />
          ) : (
            <>
              <h3 className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 700, margin: 0 }}>
                {renameProps?.customTitle ?? 'Days Sales Outstanding (DSO)'}
              </h3>
              {renameProps?.onRenameStart && (
                <button
                  onClick={e => { e.stopPropagation(); renameProps.onRenameStart?.(); }}
                  className="opacity-0 group-hover/rename:opacity-100 transition-opacity duration-150 flex-shrink-0 p-0.5 rounded"
                  style={{ lineHeight: 0 }}
                >
                  <Pencil className="w-3 h-3 text-[#9CA3AF]" />
                </button>
              )}
            </>
          )}
        </div>
        <p className="text-[13px] text-[#6B7280] mt-0.5">
          Invoice collection trend over the last 8 months
        </p>
      </div>

      <div className="w-full min-w-0 overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid
              key="dso-grid"
              strokeDasharray="0"
              stroke="#F0F0F0"
              vertical={false}
            />
            <XAxis
              key="dso-xaxis"
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              dy={8}
            />
            <YAxis
              key="dso-yaxis"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              dx={-4}
            />
            <Tooltip key="dso-tooltip" content={<CustomTooltip />} />
            <Legend
              key="dso-legend"
              verticalAlign="bottom"
              height={36}
              iconType="square"
              iconSize={10}
              formatter={(value: string) => (
                <span style={{ color: '#6B7280', fontSize: 12 }}>{value}</span>
              )}
            />
            <Line
              key="dso-line-dso"
              type="monotone"
              dataKey="dso"
              name="Your DSO"
              stroke="#EF4444"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#EF4444', stroke: 'white', strokeWidth: 2 }}
            />
            <Line
              key="dso-line-avg"
              type="monotone"
              dataKey="industryAvg"
              name="Industry Avg"
              stroke="#10B981"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#10B981', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary row */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-[#F0F0F0]">
        <div>
          <p className="text-[11px] text-[#9CA3AF]">Current DSO</p>
          <p className="text-[16px] text-[#EF4444]" style={{ fontWeight: 600 }}>72 days</p>
        </div>
        <div>
          <p className="text-[11px] text-[#9CA3AF]">Industry Avg</p>
          <p className="text-[16px] text-[#10B981]" style={{ fontWeight: 600 }}>45 days</p>
        </div>
        <div>
          <p className="text-[11px] text-[#9CA3AF]">Overdue Amount</p>
          <p className="text-[16px] text-[#1C1E21]" style={{ fontWeight: 600 }}>$127,400</p>
        </div>
        <div>
          <p className="text-[11px] text-[#9CA3AF]">Overdue Invoices</p>
          <p className="text-[16px] text-[#1C1E21]" style={{ fontWeight: 600 }}>14</p>
        </div>
      </div>

      {/* Trend warning removed — now rendered as AI response in ConversationView */}

      {/* Optional footer (e.g. radar card metadata) */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
          {footer}
        </div>
      )}
    </div>
  );
}