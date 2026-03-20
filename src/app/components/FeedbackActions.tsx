import { MessageSquare, Radar } from 'lucide-react';

interface FeedbackActionsProps {
  onOpenFeedback: () => void;
  onOpenRadar?: () => void;
}

export function FeedbackActions({ onOpenFeedback, onOpenRadar }: FeedbackActionsProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
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
        className="group flex items-center justify-center gap-2 p-3 bg-white rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-[#E6E8EC] text-[13px] text-[#6B7280] hover:text-[#1C1E21] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:border-[#6366F1]/20 hover:px-4 hover:py-3 transition-all duration-200"
      >
        <MessageSquare className="w-5 h-5 flex-shrink-0" />
        <span className="font-medium max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[120px] transition-all duration-200">Help us improve</span>
      </button>
    </div>
  );
}