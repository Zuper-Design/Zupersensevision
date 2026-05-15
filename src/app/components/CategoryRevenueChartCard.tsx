import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { RenameProps } from './RadarCards';

const data = [
  { month: 'Nov-2025', Plumbing: 1250000, Cleaning: 220000, 'Proper Category': 0, HVAC: 90000, Roofing: 70000, Heating: 30000, Other: 40000 },
  { month: 'Dec-2025', Plumbing: 0, Cleaning: 536300, 'Proper Category': 612100, HVAC: 446000, Roofing: 110000, Heating: 60000, Other: 50000 },
  { month: 'Jan-2026', Plumbing: 80000, Cleaning: 60000, 'Proper Category': 80000, HVAC: 30000, Roofing: 10000, Heating: 5000, Other: 10000 },
  { month: 'Feb-2026', Plumbing: 70000, Cleaning: 130000, 'Proper Category': 359000, HVAC: 50000, Roofing: 30000, Heating: 18000, Other: 20000 },
  { month: 'Mar-2026', Plumbing: 0, Cleaning: 0, 'Proper Category': 0, HVAC: 0, Roofing: 0, Heating: 0, Other: 0 },
  { month: 'Apr-2026', Plumbing: 0, Cleaning: 20000, 'Proper Category': 80000, HVAC: 10000, Roofing: 5000, Heating: 0, Other: 4000 },
];

const colors: Record<string, string> = {
  Plumbing: '#4FAE85',
  Cleaning: '#5BA3F0',
  'Proper Category': '#E89F5C',
  HVAC: '#E0B341',
  Roofing: '#A788CC',
  Heating: '#E26464',
  Other: '#7DB48E',
};

const formatMoney = (v: number) => {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000) return `${Math.round(v / 1_000)}K`;
  return `${v}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const filtered = payload.filter((p: any) => p.value > 0);
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md min-w-[180px]">
        <p className="text-[12px] font-medium text-[#1C1E21] mb-1">{label}</p>
        {filtered.map((p: any, i: number) => (
          <p key={i} className="text-[11.5px]" style={{ color: p.fill }}>
            {p.dataKey}: <span className="font-medium text-[#1C1E21]">${formatMoney(p.value)}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CategoryRevenueChartCard({ title, footer, renameProps }: { title?: string; onAddToRadar?: () => void; footer?: React.ReactNode; renameProps?: RenameProps }) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (renameProps?.isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renameProps?.isRenaming]);
  const keys = ['Plumbing', 'Cleaning', 'Proper Category', 'HVAC', 'Roofing', 'Heating', 'Other'];

  return (
    <div className="w-full bg-white rounded-xl border border-[#E6E8EC] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative group/card">
      <div className="mb-3 flex items-center gap-1.5 group/rename">
        {renameProps?.isRenaming ? (
          <input ref={inputRef} value={renameProps.renameValue ?? ''} onChange={(e) => renameProps.onRenameChange?.(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') renameProps.onRenameSubmit?.(); if (e.key === 'Escape') renameProps.onRenameCancel?.(); }} onBlur={() => renameProps.onRenameSubmit?.()} className="text-[15px] font-semibold text-[#1C1E21] bg-transparent border-b border-[#E6E8EC] focus:outline-none focus:border-[#1C1E21]" />
        ) : (
          <>
            <h3 className="text-[15px] font-semibold text-[#1C1E21]">{renameProps?.title || title || 'Monthly Job Revenue by Category'}</h3>
            {renameProps && <button onClick={() => renameProps.onStartRename?.()} className="opacity-0 group-hover/rename:opacity-100 text-[#9CA3AF] hover:text-[#1C1E21] transition" aria-label="Rename"><Pencil className="w-[12px] h-[12px]" /></button>}
          </>
        )}
      </div>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 16, left: -4, bottom: 28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11.5, fill: '#9CA3AF' }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
            <YAxis tick={{ fontSize: 11.5, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(28,30,33,0.04)' }} />
            <Legend wrapperStyle={{ fontSize: 11.5, paddingTop: 12 }} iconType="circle" iconSize={8} />
            {keys.map((k) => (
              <Bar key={k} dataKey={k} name={k} stackId="a" fill={colors[k]} maxBarSize={48} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      {footer}
    </div>
  );
}
