import { CloudLightning, Wind, ShieldAlert, Send, MapPin } from 'lucide-react';
import { useState } from 'react';

export const WeatherWidget = () => {
  const [alertSent, setAlertSent] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
          <span className="text-[12px] text-[#6B7280]">San Diego, CA</span>
        </div>
        <span className="text-[10px] text-[#9CA3AF]">Now</span>
      </div>

      {/* Current conditions */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <CloudLightning className="w-5 h-5 text-[#6B7280]" />
          <span className="text-[22px] font-semibold text-[#1C1E21] leading-none">58°</span>
        </div>
        <div className="h-6 w-px bg-[#E6E8EC]" />
        <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1"><Wind className="w-3 h-3" />32 mph</span>
          <span>H 62° · L 52°</span>
        </div>
      </div>

      {/* Storm alert */}
      <div className="flex items-start gap-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-2.5 mb-3">
        <div className="w-6 h-6 rounded-lg bg-[#EF4444] flex items-center justify-center flex-shrink-0">
          <ShieldAlert className="w-3 h-3 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[#991B1B] mb-0.5">Severe Storm Warning</p>
          <p className="text-[10px] text-[#B91C1C] leading-relaxed">
            Hail & 50+ mph winds Thu 6 PM – Fri 2 AM. <span className="font-medium">14 customers</span> in the path.
          </p>
        </div>
      </div>

      {/* Action */}
      {!alertSent ? (
        <button
          onClick={(e) => { e.stopPropagation(); setAlertSent(true); }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1C1E21] hover:bg-[#3A3D42] text-white rounded-xl transition-colors text-[12px] font-medium"
        >
          <Send className="w-3.5 h-3.5" />
          Alert 14 customers — roof protection
        </button>
      ) : (
        <div className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#F0FDF4] text-[#10B981] rounded-xl text-[12px] font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          Advisory sent to 14 customers
        </div>
      )}
    </div>
  );
};
