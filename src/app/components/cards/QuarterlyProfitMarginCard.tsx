import { useState } from 'react';

const data = [
  { label: 'Jan-2025', value: 0 },
  { label: 'Apr-2025', value: 0 },
  { label: 'Jul-2025', value: 0 },
  { label: 'Oct-2025', value: 71 },
];

export function QuarterlyProfitMarginCard() {
  const [hover, setHover] = useState<number | null>(null);
  const yMax = 80;
  const yTicks = [0, 20, 40, 60, 80];

  const W = 720;
  const H = 360;
  const padL = 60;
  const padR = 30;
  const padT = 30;
  const padB = 50;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const xAt = (i: number) => padL + (plotW * i) / (data.length - 1);
  const yAt = (v: number) => padT + plotH - (v / yMax) * plotH;

  const points = data.map((d, i) => ({ x: xAt(i), y: yAt(d.value) }));
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    path += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  return (
    <div className="rounded-2xl border border-[#E6E8EC] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-2">Quarterly Job Profit Margin</h3>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
          {yTicks.map(t => (
            <line key={t} x1={padL} x2={W - padR} y1={yAt(t)} y2={yAt(t)} stroke="#F0F1F3" strokeWidth={1} />
          ))}
          {yTicks.map(t => (
            <text key={t} x={padL - 12} y={yAt(t) + 4} textAnchor="end" fill="#9CA3AF" fontSize={13}>
              {t}
            </text>
          ))}
          {data.map((d, i) => (
            <text key={d.label} x={xAt(i)} y={H - padB + 24} textAnchor="middle" fill="#6B7280" fontSize={13}>
              {d.label}
            </text>
          ))}
          <path d={path} fill="none" stroke="#84CC16" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5.5} fill="#fff" stroke="#84CC16" strokeWidth={2.5} />
              <circle
                cx={p.x}
                cy={p.y}
                r={18}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          ))}
        </svg>
        {hover !== null && (
          <div
            className="absolute z-10 bg-white border border-[#E6E8EC] rounded-lg shadow-[0_8px_20px_rgba(0,0,0,0.08)] px-3 py-2 whitespace-nowrap pointer-events-none"
            style={{
              left: `${(points[hover].x / W) * 100}%`,
              top: `${(points[hover].y / H) * 100}%`,
              transform: 'translate(-50%, calc(-100% - 16px))',
            }}
          >
            <div className="text-[13px] font-semibold text-[#1C1E21] mb-1">{data[hover].label}</div>
            <div className="flex items-center gap-2 text-[12px]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#84CC16' }} />
              <span className="text-[#6B7280]">Profit margin</span>
              <span className="font-semibold text-[#1C1E21] ml-2">{data[hover].value}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
