import { FlaskConical, Radar } from 'lucide-react';

interface FeedbackActionsProps {
  onOpenFeedback: () => void;
  onOpenRadar?: () => void;
}

export function FeedbackActions({ onOpenFeedback, onOpenRadar }: FeedbackActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      <div className="flex items-center gap-3">
        {/* Radar Button */}
        {onOpenRadar && (
          <button
            onClick={onOpenRadar}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#6366F1] to-[#818CF8] rounded-full shadow-[0_4px_16px_rgba(99,102,241,0.4)] text-white hover:shadow-[0_6px_24px_rgba(99,102,241,0.5)] hover:scale-105 transition-all duration-200"
            aria-label="Open Radar"
          >
            <Radar className="w-5 h-5" />
          </button>
        )}

        {/* Help Us Improve Button */}
        <button
          onClick={onOpenFeedback}
          className="group flex items-center h-12 pl-3.5 pr-3.5 hover:pl-4 hover:pr-4 bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out"
          aria-label="Sense is in beta — Help us improve"
        >
          <FlaskConical className="w-5 h-5 flex-shrink-0 text-white" />
          <div className="max-w-0 overflow-hidden group-hover:max-w-[160px] group-hover:ml-2.5 transition-all duration-300 ease-in-out">
            <p className="text-[13px] font-bold text-white leading-tight whitespace-nowrap tracking-tight">Sense is in beta</p>
            <p className="text-[11px] font-normal text-white/50 leading-tight whitespace-nowrap tracking-wide">help us improve</p>
          </div>
        </button>
      </div>
    </div>
  );
}
