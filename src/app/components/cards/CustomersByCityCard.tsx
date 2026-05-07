import { useState } from 'react';

const cities = [
  { name: 'New York', count: 612 },
  { name: 'Los Angeles', count: 548 },
  { name: 'Chicago', count: 421 },
  { name: 'Houston', count: 312 },
  { name: 'Phoenix', count: 268 },
  { name: 'Philadelphia', count: 214 },
  { name: 'San Diego', count: 178 },
];

export function CustomersByCityCard() {
  const [hover, setHover] = useState<number | null>(null);
  const dataMax = Math.max(...cities.map(c => c.count));
  const yMax = Math.ceil(dataMax / 100) * 100;
  const yTicks = [0, yMax * 0.25, yMax * 0.5, yMax * 0.75, yMax];

  const chartH = 280;
  const yAxisW = 44;

  return (
    <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-[15px] font-semibold text-[#1C1E21]">New customers by city</h3>
        <span className="text-[12px] text-[#9CA3AF]">Last 6 months</span>
      </div>
      <p className="text-[12px] text-[#6B7280] mb-5">2,553 customers across {cities.length} cities</p>

      <div className="flex" style={{ height: chartH }}>
        <div className="flex flex-col justify-between text-right pr-3" style={{ width: yAxisW, height: chartH - 28 }}>
          {[...yTicks].reverse().map(v => (
            <span key={v} className="text-[11px] text-[#9CA3AF] leading-none">{Math.round(v).toLocaleString()}</span>
          ))}
        </div>

        <div className="flex-1 relative" style={{ height: chartH }}>
          <div className="absolute left-0 right-0 flex flex-col justify-between pointer-events-none" style={{ top: 0, height: chartH - 28 }}>
            {[...yTicks].reverse().map((_, i) => (
              <div key={i} className="h-px w-full bg-[#F0F1F3]" />
            ))}
          </div>

          <div className="absolute left-0 right-0 flex items-end justify-around" style={{ top: 0, height: chartH - 28 }}>
            {cities.map((c, i) => {
              const isHover = hover === i;
              const pct = (c.count / yMax) * 100;
              return (
                <div
                  key={c.name}
                  className="relative flex-1 h-full flex justify-center items-end cursor-pointer"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {isHover && <div className="absolute inset-0 bg-[#F3F4F6]/80 pointer-events-none" />}
                  <div
                    className="rounded-t-sm transition-opacity"
                    style={{ height: `${pct}%`, width: 56, background: '#10B981', opacity: hover === null || isHover ? 1 : 0.85 }}
                  />
                  {isHover && (
                    <div
                      className="absolute z-10 bg-white border border-[#E6E8EC] rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.08)] px-3 py-2 whitespace-nowrap pointer-events-none"
                      style={{ bottom: `calc(${pct}% + 12px)`, left: '50%', transform: 'translateX(-50%)' }}
                    >
                      <div className="text-[13px] font-semibold text-[#1C1E21] mb-1">{c.name}</div>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#10B981' }} />
                        <span className="text-[#6B7280]">New customers</span>
                        <span className="font-semibold text-[#1C1E21] ml-2">{c.count.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute left-0 right-0 bottom-0 flex justify-around items-center" style={{ height: 28 }}>
            {cities.map(c => (
              <span key={c.name} className="text-[11px] text-[#6B7280] text-center px-0.5" style={{ width: 80 }} title={c.name}>
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
