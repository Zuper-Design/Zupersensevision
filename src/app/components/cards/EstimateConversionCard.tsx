export function EstimateConversionCard() {
  // Monthly conversion %, trending up across 2025
  const points = [62, 68, 71, 74, 78, 80, 82, 83, 84, 85, 86, 87];
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const w = 380;
  const h = 110;
  const stepX = w / (points.length - 1);
  const path = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${h - ((v - min) / range) * (h * 0.85) - 8}`)
    .join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E6E8EC] bg-white p-5 max-w-[420px] shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="absolute bottom-0 right-0 w-[70%] h-[60%] pointer-events-none"
      >
        <defs>
          <linearGradient id="conv-sparkfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#conv-sparkfill)" />
        <path d={path} fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="relative">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#9CA3AF] uppercase">Estimate to Job Conversion</p>
        <div className="mt-1.5 flex items-baseline gap-2.5">
          <span className="text-[44px] font-semibold text-[#1C1E21] leading-none tracking-tight">82.87%</span>
          <span className="px-1.5 py-0.5 rounded-md bg-[#10B981]/12 text-[#059669] text-[12px] font-semibold">+6.2%</span>
        </div>
        <p className="mt-2 text-[11px] text-[#9CA3AF]">2025 YTD</p>
      </div>
    </div>
  );
}
