import { useState } from 'react';

const data = [
  { label: 'Jan-2025', value: 1.3 },
  { label: 'Feb-2025', value: 1.0 },
  { label: 'Mar-2025', value: 4.7 },
  { label: 'Apr-2025', value: 3.99 },
  { label: 'May-2025', value: 22.29 },
  { label: 'Jun-2025', value: 2.82 },
  { label: 'Jul-2025', value: 1.4 },
  { label: 'Aug-2025', value: 0.9 },
  { label: 'Sep-2025', value: 0.5 },
  { label: 'Oct-2025', value: 0.028 },
  { label: 'Nov-2025', value: 0.05 },
  { label: 'Dec-2025', value: 0.05 },
];

const fmt = (v: number) => v < 0.1 ? `$${(v * 1000).toFixed(1)}K` : `$${v.toFixed(2)}M`;

export function MonthlyInvoiceRevenueCard() {
  const [hover, setHover] = useState<number | null>(null);
  const yMax = 24;
  const yTicks = [0, 6, 12, 18, 24];

  const chartH = 360;
  const yAxisW = 60;

  return (
    <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-5">Monthly Invoice Revenue</h3>

      <div className="flex" style={{ height: chartH }}>
        <div className="flex flex-col justify-between text-right pr-3" style={{ width: yAxisW, height: chartH - 56 }}>
          {[...yTicks].reverse().map(v => (
            <span key={v} className="text-[11px] text-[#9CA3AF] leading-none">{v}M</span>
          ))}
        </div>

        <div className="flex-1 relative" style={{ height: chartH }}>
          <div className="absolute left-0 right-0 flex flex-col justify-between pointer-events-none" style={{ top: 0, height: chartH - 56 }}>
            {[...yTicks].reverse().map((_, i) => (
              <div key={i} className="h-px w-full bg-[#F0F1F3]" />
            ))}
          </div>

          <div className="absolute left-0 right-0 flex items-end justify-around" style={{ top: 0, height: chartH - 56 }}>
            {data.map((d, i) => {
              const isHover = hover === i;
              const pct = (d.value / yMax) * 100;
              return (
                <div
                  key={d.label}
                  className="relative flex-1 h-full flex justify-center items-end cursor-pointer"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {isHover && <div className="absolute inset-0 bg-[#F3F4F6]/80 pointer-events-none" />}
                  <div
                    className="rounded-t-sm transition-opacity"
                    style={{ height: `${Math.max(pct, 0.4)}%`, width: 38, background: '#3DB1C7', opacity: hover === null || isHover ? 1 : 0.85 }}
                  />
                  {isHover && (
                    <div
                      className="absolute z-10 bg-white border border-[#E6E8EC] rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.08)] px-3 py-2 whitespace-nowrap pointer-events-none"
                      style={{ bottom: `calc(${Math.max(pct, 1)}% + 12px)`, left: '50%', transform: 'translateX(-50%)' }}
                    >
                      <div className="text-[13px] font-semibold text-[#1C1E21] mb-1">{d.label}</div>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#3DB1C7' }} />
                        <span className="text-[#6B7280]">Invoice revenue</span>
                        <span className="font-semibold text-[#1C1E21] ml-2">{fmt(d.value)}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute left-0 right-0 bottom-0 flex justify-around items-start" style={{ height: 56, top: chartH - 56 }}>
            {data.map(d => (
              <span
                key={d.label}
                className="text-[11px] text-[#6B7280] origin-top-left whitespace-nowrap"
                style={{ transform: 'rotate(-35deg)', marginTop: 6 }}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
