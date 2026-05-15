import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { RenameProps } from './RadarCards';

const data = [
  { month: 'Nov-2025', jobCount: 58, revenue: 0, completed: 110 },
  { month: 'Dec-2025', jobCount: 38, revenue: 0, completed: 30 },
  { month: 'Jan-2026', jobCount: 20, revenue: 0, completed: 10 },
  { month: 'Feb-2026', jobCount: 8, revenue: 0, completed: -20 },
  { month: 'Mar-2026', jobCount: 24, revenue: 0, completed: -45 },
  { month: 'Apr-2026', jobCount: 26, revenue: 130, completed: 30 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md min-w-[200px]">
        <p className="text-[12px] font-medium text-[#1C1E21] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-[11.5px]" style={{ color: p.stroke }}>
            {p.name}: <span className="font-medium text-[#1C1E21]">{p.value}%</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dot = ({ cx, cy, stroke }: any) => (
  <circle cx={cx} cy={cy} r={4} fill="white" stroke={stroke} strokeWidth={2} />
);

export function GrowthTrendsChartCard({ footer, renameProps }: { onAddToRadar?: () => void; footer?: React.ReactNode; renameProps?: RenameProps }) {
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
          <input ref={inputRef} value={renameProps.renameValue ?? ''} onChange={(e) => renameProps.onRenameChange?.(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') renameProps.onRenameSubmit?.(); if (e.key === 'Escape') renameProps.onRenameCancel?.(); }} onBlur={() => renameProps.onRenameSubmit?.()} className="text-[15px] font-semibold text-[#1C1E21] bg-transparent border-b border-[#E6E8EC] focus:outline-none focus:border-[#1C1E21]" />
        ) : (
          <>
            <h3 className="text-[15px] font-semibold text-[#1C1E21]">{renameProps?.title || 'Monthly Growth Trends'}</h3>
            {renameProps && <button onClick={() => renameProps.onStartRename?.()} className="opacity-0 group-hover/rename:opacity-100 text-[#9CA3AF] hover:text-[#1C1E21] transition" aria-label="Rename"><Pencil className="w-[12px] h-[12px]" /></button>}
          </>
        )}
      </div>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <ComposedChart data={data} margin={{ top: 8, right: 16, left: -4, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11.5, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11.5, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
            <Line type="monotone" dataKey="jobCount" name="Job Count MoM Growth" stroke="#E89F5C" strokeWidth={2.5} dot={<Dot />} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="revenue" name="Job Revenue MoM Growth" stroke="#4FAE85" strokeWidth={2.5} dot={<Dot />} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="completed" name="Completed Jobs MoM Growth" stroke="#7C7BC7" strokeWidth={2.5} dot={<Dot />} activeDot={{ r: 5 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {footer}
    </div>
  );
}
