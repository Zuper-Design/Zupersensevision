import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import React, { useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { RenameProps } from './RadarCards';

const data = [
  { name: 'HAPPY', value: 26, color: '#4FAE85' },
  { name: 'NEUTRAL', value: 2, color: '#E0B341' },
  { name: 'UNHAPPY', value: 2, color: '#E26464' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const p = payload[0];
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md">
        <p className="text-[12px] font-medium text-[#1C1E21]">{p.name}: <span className="font-semibold">{p.value} jobs</span></p>
        <p className="text-[11px] text-[#9CA3AF]">{Math.round((p.value / 30) * 100)}% of total</p>
      </div>
    );
  }
  return null;
};

export function CustomerFeedbackChartCard({ onAddToRadar, footer, renameProps }: { onAddToRadar?: () => void; footer?: React.ReactNode; renameProps?: RenameProps }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renameProps?.isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renameProps?.isRenaming]);

  return (
    <div className="w-full bg-white rounded-xl border border-[#E6E8EC] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative group/card">
      <div className="mb-3 flex items-center gap-1.5 group/rename">
        {renameProps?.isRenaming ? (
          <input
            ref={inputRef}
            value={renameProps.renameValue ?? ''}
            onChange={(e) => renameProps.onRenameChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') renameProps.onRenameSubmit?.();
              if (e.key === 'Escape') renameProps.onRenameCancel?.();
            }}
            onBlur={() => renameProps.onRenameSubmit?.()}
            className="text-[15px] font-semibold text-[#1C1E21] bg-transparent border-b border-[#E6E8EC] focus:outline-none focus:border-[#1C1E21]"
          />
        ) : (
          <>
            <h3 className="text-[15px] font-semibold text-[#1C1E21]">{renameProps?.title || 'Customer Feedback Breakdown'}</h3>
            {renameProps && (
              <button
                onClick={() => renameProps.onStartRename?.()}
                className="opacity-0 group-hover/rename:opacity-100 text-[#9CA3AF] hover:text-[#1C1E21] transition"
                aria-label="Rename"
              >
                <Pencil className="w-[12px] h-[12px]" />
              </button>
            )}
          </>
        )}
      </div>
      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={1} stroke="white" strokeWidth={2}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span style={{ color: '#1C1E21', fontWeight: 500, fontSize: 11.5, letterSpacing: '0.04em' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {footer}
    </div>
  );
}
