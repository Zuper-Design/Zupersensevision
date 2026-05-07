import { useState } from 'react';

const data = [
  { label: 'Jan-2025', value: 19 },
  { label: 'Feb-2025', value: 12 },
  { label: 'Mar-2025', value: 16 },
  { label: 'Apr-2025', value: 15 },
  { label: 'May-2025', value: 8 },
  { label: 'Jun-2025', value: 14 },
  { label: 'Jul-2025', value: 9 },
  { label: 'Aug-2025', value: 7 },
  { label: 'Sep-2025', value: 2 },
  { label: 'Oct-2025', value: 5 },
];

export function NewUsersByMonthCard() {
  const [hover, setHover] = useState<number | null>(null);
  const yMax = 20;
  const yTicks = [0, 5, 10, 15, 20];

  const W = 900;
  const H = 460;
  const padL = 60;
  const padR = 30;
  const padT = 30;
  const padB = 90;
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
          {data.map((d, i) => {
            const cx = xAt(i);
            const cy = padT + plotH + 18;
            return (
              <text key={d.label} x={cx} y={cy} textAnchor="end" fill="#6B7280" fontSize={13} transform={`rotate(-35 ${cx} ${cy})`}>
                {d.label}
              </text>
            );
          })}
          <path d={path} fill="none" stroke="#7C6FFF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={5.5} fill="#fff" stroke="#7C6FFF" strokeWidth={2.5} />
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
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#7C6FFF' }} />
              <span className="text-[#6B7280]">New users</span>
              <span className="font-semibold text-[#1C1E21] ml-2">{data[hover].value}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
