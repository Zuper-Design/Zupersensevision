import { useState } from 'react';

const techs = [
  { name: 'James Bond', value: 9693 },
  { name: 'Mike Johnson', value: 3120 },
  { name: 'Sarah Chen', value: 850 },
  { name: 'David Patel', value: 620 },
  { name: 'Lisa Romero', value: 480 },
  { name: 'Tom Nguyen', value: 320 },
  { name: 'Emma Brooks', value: 180 },
  { name: 'Jessica Park', value: -240 },
];

const yMin = -3500;
const yMax = 11000;
const yTicks = [11000, 8000, 3500, 0, -3500];

export function ProfitPerTechnicianCard() {
  const [hover, setHover] = useState<number | null>(null);
  const chartH = 360;
  const yAxisW = 56;

  const range = yMax - yMin;
  const zeroPct = ((yMax - 0) / range) * 100;

  return (
    <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="text-[15px] font-semibold text-[#1C1E21]">Avg profit per job by technician</h3>
        <span className="text-[12px] text-[#9CA3AF]">Last 6 months</span>
      </div>
      <p className="text-[12px] text-[#6B7280] mb-5">USD per job, top 8 technicians</p>

      <div className="flex" style={{ height: chartH }}>
        <div className="flex flex-col justify-between text-right pr-3 pt-1" style={{ width: yAxisW, height: chartH - 32 }}>
          {yTicks.map(v => (
            <span key={v} className="text-[11px] text-[#9CA3AF] leading-none">
              {v < 0 ? `-${Math.abs(v / 1000).toFixed(v % 1000 ? 1 : 0)}K` : `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}K`}
            </span>
          ))}
        </div>

        <div className="flex-1 relative" style={{ height: chartH }}>
          <div className="absolute left-0 right-0 flex flex-col justify-between pointer-events-none" style={{ top: 0, height: chartH - 32 }}>
            {yTicks.map((_, i) => (
              <div key={i} className="h-px w-full bg-[#F0F1F3]" />
            ))}
          </div>

          {/* Bars */}
          <div className="absolute left-0 right-0 flex items-stretch justify-around" style={{ top: 0, height: chartH - 32 }}>
            {techs.map((t, i) => {
              const isHover = hover === i;
              const valuePct = (t.value / range) * 100;
              const barAbsHeightPct = Math.abs(valuePct);
              const barTop = t.value >= 0 ? `${zeroPct - valuePct}%` : `${zeroPct}%`;
              return (
                <div
                  key={t.name}
                  className="relative flex-1 h-full flex justify-center cursor-pointer"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {/* Hover column highlight */}
                  {isHover && (
                    <div className="absolute inset-0 bg-[#F3F4F6]/80 pointer-events-none" />
                  )}
                  <div
                    className="absolute rounded-md transition-opacity"
                    style={{
                      width: 36,
                      top: barTop,
                      height: `${barAbsHeightPct}%`,
                      background: '#7C6FFF',
                      opacity: hover === null || isHover ? 1 : 0.85,
                    }}
                  />
                  {/* Tooltip */}
                  {isHover && (
                    <div
                      className="absolute z-10 bg-white border border-[#E6E8EC] rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.08)] px-3 py-2 whitespace-nowrap pointer-events-none"
                      style={{
                        bottom: `calc(${100 - zeroPct}% + 12px)`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className="text-[13px] font-semibold text-[#1C1E21] mb-1">{t.name}</div>
                      <div className="flex items-center gap-2 text-[12px]">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#7C6FFF' }} />
                        <span className="text-[#6B7280]">Average Profit Per Job</span>
                        <span className="font-semibold text-[#1C1E21] ml-2">{t.value.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="absolute left-0 right-0 bottom-0 flex justify-around items-center" style={{ height: 32 }}>
            {techs.map(t => (
              <span
                key={t.name}
                className="text-[11px] text-[#6B7280] text-center px-0.5"
                style={{ width: 84 }}
                title={t.name}
              >
                {t.name.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
