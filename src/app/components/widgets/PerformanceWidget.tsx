export const PerformanceWidget = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 card-hover-elevate">
      <div className="mb-4">
        <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Q1 Roofing Performance</h3>
        <p className="text-[12px] text-[#6B7280]">January – February 2026</p>
      </div>

      <div className="space-y-3">
        {/* Revenue */}
        <div>
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">Total Revenue</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[24px] font-semibold text-[#1C1E21]">$347,200</span>
            <span className="text-[12px] text-[#10B981] font-medium">+18.6%</span>
          </div>
        </div>

        {/* Jobs Completed */}
        <div className="bg-[#F8F9FB] rounded-xl p-3">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">Jobs Completed</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-semibold text-[#1C1E21]">38</span>
            <span className="text-[12px] text-[#10B981] font-medium">+6 vs Q4</span>
          </div>
        </div>

        {/* Avg Job Value */}
        <div className="bg-[#F8F9FB] rounded-xl p-3">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">Avg Job Value</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-semibold text-[#1C1E21]">$9,137</span>
            <span className="text-[12px] text-[#10B981] font-medium">+$420</span>
          </div>
        </div>

        {/* Close Rate */}
        <div className="bg-[#F8F9FB] rounded-xl p-3">
          <p className="text-[11px] text-[#9CA3AF] uppercase tracking-wider mb-1.5">Quote Close Rate</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[20px] font-semibold text-[#1C1E21]">64%</span>
            <span className="text-[12px] text-[#EF4444] font-medium">-3%</span>
          </div>
        </div>
      </div>
    </div>
  );
};