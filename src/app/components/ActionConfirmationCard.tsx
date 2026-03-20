import { CheckCircle, X } from 'lucide-react';

interface ActionConfirmationCardProps {
  action: string;
  details?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ActionConfirmationCard({ action, details, onConfirm, onCancel }: ActionConfirmationCardProps) {
  return (
    <div className="inline-flex items-center gap-3 bg-gradient-to-br from-[#6366F1]/5 to-white border border-[#6366F1]/20 rounded-[16px] px-4 py-3 shadow-[0_2px_12px_rgba(99,102,241,0.08)] max-w-[520px]">
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-[#6366F1]/10 rounded-full flex items-center justify-center">
        <CheckCircle className="w-[18px] h-[18px] text-[#6366F1]" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-[#1C1E21] leading-snug">
          {action}
        </p>
        {details && (
          <p className="text-[12px] text-[#6B7280] mt-0.5 leading-snug">
            {details}
          </p>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onConfirm}
          className="px-3 py-1.5 bg-[#6366F1] text-white text-[12px] font-medium rounded-lg hover:bg-[#5558E3] transition-colors duration-150"
        >
          Yes, proceed
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors duration-150"
          aria-label="Cancel"
        >
          <X className="w-[16px] h-[16px] text-[#6B7280]" />
        </button>
      </div>
    </div>
  );
}
