import { HelpCircle } from 'lucide-react';

interface WhatsNewFloaterProps {
  onOpenAnnouncement: () => void;
  onOpenReleases: () => void;
}

export function WhatsNewFloater({ onOpenAnnouncement, onOpenReleases }: WhatsNewFloaterProps) {
  return (
    <div
      className="group absolute left-3 bottom-3 z-30"
      style={{
        width: 40,
        height: 40,
        transition: 'width 320ms cubic-bezier(0.23,1,0.32,1), height 320ms cubic-bezier(0.23,1,0.32,1), border-radius 320ms cubic-bezier(0.23,1,0.32,1)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.width = '232px';
        el.style.height = 'auto';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.width = '40px';
        el.style.height = '40px';
      }}
    >
      <div
        className="bg-white border border-[#E6E8EC] overflow-hidden group-hover:rounded-xl"
        style={{
          borderRadius: 9999,
          transition: 'border-radius 320ms cubic-bezier(0.23,1,0.32,1)',
          boxShadow: '0 1px 2px rgba(28,30,33,0.04), 0 10px 28px -14px rgba(28,30,33,0.18)',
        }}
      >
        {/* Hover-revealed dashboard illustration */}
        <div
          className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr]"
          style={{ transition: 'grid-template-rows 300ms cubic-bezier(0.23,1,0.32,1)' }}
        >
          <div className="overflow-hidden">
            <div
              className="relative h-[124px]"
              style={{ background: 'linear-gradient(180deg, #FFCFA8 0%, #FFE2C5 45%, #FFF1E0 80%, #FFFFFF 100%)' }}
            >
              <div
                className="absolute inset-x-[12px] top-[12px] bottom-[12px] bg-white rounded-[10px] overflow-hidden opacity-0 group-hover:opacity-100"
                style={{
                  boxShadow:
                    '0 1px 2px rgba(28,30,33,0.04), 0 10px 24px -12px rgba(28,30,33,0.18), 0 18px 32px -20px rgba(253,80,0,0.30)',
                  transition: 'opacity 280ms cubic-bezier(0.23,1,0.32,1) 80ms',
                }}
              >
                {/* Title strip */}
                <div className="flex items-center justify-between px-2 pt-[7px] pb-1">
                  <div className="h-[3px] w-[34%] rounded-full bg-[#E6E8EC]" />
                  <div className="flex items-center gap-[3px]">
                    <span className="w-[3px] h-[3px] rounded-full bg-[#FD5000]" />
                    <span className="w-[3px] h-[3px] rounded-full bg-[#FFAB7E]" />
                    <span className="w-[3px] h-[3px] rounded-full bg-[#FFD9C2]" />
                  </div>
                </div>

                {/* 2x2 widget grid */}
                <div className="grid grid-cols-2 gap-[5px] px-[6px] pb-[6px]">
                  <div className="rounded-md px-[7px] py-[6px] flex flex-col gap-[3px] justify-center" style={{ background: '#FFF6EC', height: 34 }}>
                    <div className="h-[3px] w-[78%] rounded-full" style={{ background: 'linear-gradient(90deg, #FF8043, #FD5000)' }} />
                    <div className="h-[3px] w-[55%] rounded-full bg-[#FFAB7E]" />
                    <div className="h-[3px] w-[42%] rounded-full bg-[#FFC4A0]" />
                  </div>
                  <div className="rounded-md px-[7px] py-[6px] flex items-center gap-[5px]" style={{ background: '#FFF6EC', height: 34 }}>
                    <div className="relative w-[20px] h-[20px] flex-shrink-0">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{ background: 'conic-gradient(#FD5000 0% 55%, #FFAB7E 55% 78%, #FFD9C2 78% 100%)' }}
                      />
                      <div className="absolute inset-[3px] rounded-full bg-white" />
                    </div>
                    <div className="flex-1 flex flex-col gap-[2px]">
                      <div className="h-[2.5px] w-[80%] rounded-full bg-[#FFD9C2]" />
                      <div className="h-[2.5px] w-[60%] rounded-full bg-[#FFD9C2]" />
                      <div className="h-[2.5px] w-[70%] rounded-full bg-[#FFD9C2]" />
                    </div>
                  </div>
                  <div className="rounded-md px-[7px] py-[6px] flex items-end gap-[3px] justify-center" style={{ background: '#FFF6EC', height: 34 }}>
                    <div className="w-[4px] rounded-sm bg-[#FFC4A0]" style={{ height: '40%' }} />
                    <div className="w-[4px] rounded-sm bg-[#FFAB7E]" style={{ height: '70%' }} />
                    <div className="w-[4px] rounded-sm" style={{ height: '95%', background: 'linear-gradient(180deg, #FF8043, #FD5000)' }} />
                    <div className="w-[4px] rounded-sm bg-[#FFAB7E]" style={{ height: '55%' }} />
                    <div className="w-[4px] rounded-sm bg-[#FFC4A0]" style={{ height: '75%' }} />
                  </div>
                  <div className="rounded-md px-[7px] py-[5px] flex flex-col justify-center" style={{ background: '#FFF6EC', height: 34 }}>
                    <div className="h-[2.5px] w-[60%] rounded-full bg-[#FFD9C2] mb-[3px]" />
                    <div className="flex items-baseline gap-[3px]">
                      <span className="text-[11px] font-semibold text-[#1C1E21] leading-none tracking-[-0.02em]">$24.5K</span>
                      <span className="text-[8px] font-semibold leading-none" style={{ color: '#10B981' }}>+8%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          className="px-0 py-0 group-hover:px-2.5 group-hover:py-2"
          style={{ transition: 'padding 280ms cubic-bezier(0.23,1,0.32,1)' }}
        >
          {/* Icon + collapsed pill */}
          <div className="flex items-center justify-center group-hover:justify-start gap-1.5 h-[38px] group-hover:h-[20px]"
            style={{ transition: 'height 280ms cubic-bezier(0.23,1,0.32,1)' }}
          >
            <HelpCircle
              className="flex-shrink-0 w-[20px] h-[20px] group-hover:w-[14px] group-hover:h-[14px]"
              style={{ color: '#374151', transition: 'width 220ms cubic-bezier(0.23,1,0.32,1), height 220ms cubic-bezier(0.23,1,0.32,1)' }}
              strokeWidth={2}
            />
            <p
              className="text-[11.5px] font-semibold text-[#1C1E21] leading-none opacity-0 group-hover:opacity-100 whitespace-nowrap"
              style={{ transition: 'opacity 200ms cubic-bezier(0.23,1,0.32,1) 80ms' }}
            >
              What's new
            </p>
          </div>

          {/* Expanding subtitle + button on hover */}
          <div
            className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr]"
            style={{ transition: 'grid-template-rows 280ms cubic-bezier(0.23,1,0.32,1)' }}
          >
            <div className="overflow-hidden">
              <p
                className="text-[10.5px] text-[#6B7280] leading-tight mt-1.5 opacity-0 group-hover:opacity-100 -translate-y-0.5 group-hover:translate-y-0"
                style={{ transition: 'opacity 220ms cubic-bezier(0.23,1,0.32,1) 60ms, transform 220ms cubic-bezier(0.23,1,0.32,1) 60ms' }}
              >
                Sense is now available with smarter answers and pinned insights.
              </p>
              <button
                onClick={onOpenAnnouncement}
                className="w-full py-1 rounded-md text-[11px] font-semibold text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] mt-2 opacity-0 group-hover:opacity-100 active:scale-[0.98]"
                style={{ transition: 'background-color 200ms cubic-bezier(0.23,1,0.32,1), opacity 220ms cubic-bezier(0.23,1,0.32,1) 100ms, transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              >
                View update
              </button>
              <button
                onClick={onOpenReleases}
                className="w-full py-1 rounded-md text-[11px] font-semibold text-[#1C1E21] bg-white border border-[#E6E8EC] hover:bg-[#FAFAFA] hover:border-[#D1D5DB] mt-1.5 opacity-0 group-hover:opacity-100 active:scale-[0.98]"
                style={{ transition: 'background-color 180ms cubic-bezier(0.23,1,0.32,1), border-color 180ms cubic-bezier(0.23,1,0.32,1), opacity 220ms cubic-bezier(0.23,1,0.32,1) 140ms, transform 160ms cubic-bezier(0.23,1,0.32,1)' }}
              >
                Releases
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
