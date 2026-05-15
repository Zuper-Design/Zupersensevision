import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import React, { useRef, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { RenameProps } from './RadarCards';

const data = [
  { bucket: '1 - 30 Days', amount: 2010000, avgDaysPastDue: 14, invoices: 18, maxDaysPastDue: 30 },
  { bucket: '31 - 60 Days', amount: 1610000, avgDaysPastDue: 44, invoices: 9, maxDaysPastDue: 60 },
  { bucket: '61 - 90 Days', amount: 308000, avgDaysPastDue: 76, invoices: 3, maxDaysPastDue: 90 },
];

const formatMoney = (v: number) => {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}K`;
  return `${v}`;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const row = payload[0].payload;
    return (
      <div className="bg-white border border-[#E6E8EC] rounded-lg px-3 py-2 shadow-md min-w-[180px]">
        <p className="text-[12px] font-medium text-[#1C1E21] mb-1.5">{label}</p>
        <div className="space-y-0.5">
          <p className="text-[11.5px] text-[#6B7280]">Amount Overdue: <span className="font-medium text-[#1C1E21]">${formatMoney(row.amount)}</span></p>
          <p className="text-[11.5px] text-[#6B7280]">Overdue Invoices: <span className="font-medium text-[#1C1E21]">{row.invoices}</span></p>
          <p className="text-[11.5px] text-[#6B7280]">Avg Days Past Due: <span className="font-medium text-[#1C1E21]">{row.avgDaysPastDue}</span></p>
          <p className="text-[11.5px] text-[#6B7280]">Max Days Past Due: <span className="font-medium text-[#1C1E21]">{row.maxDaysPastDue}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export function AgingBucketChartCard({ onAddToRadar, footer, renameProps }: { onAddToRadar?: () => void; footer?: React.ReactNode; renameProps?: RenameProps }) {
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
              <h3 className="text-[15px] font-semibold text-[#1C1E21]">{renameProps?.title || 'Overdue Invoices by Aging Bucket'}</h3>
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
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F1F3" vertical={false} />
            <XAxis dataKey="bucket" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatMoney(v)} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(28,30,33,0.04)' }} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
              payload={[
                { value: 'Amount Overdue', type: 'circle', color: '#60A5FA' },
                { value: 'Avg Days Past Due', type: 'circle', color: '#10B981' },
                { value: 'Overdue Invoices', type: 'circle', color: '#F59E0B' },
                { value: 'Max Days Past Due', type: 'circle', color: '#EF4444' },
              ]}
            />
            <Bar dataKey="amount" name="Amount Overdue" radius={[4, 4, 0, 0]} maxBarSize={56}>
              {data.map((_, i) => (
                <Cell key={i} fill="#60A5FA" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {footer}
    </div>
  );
}
