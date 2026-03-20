import React, { useState, useRef, useEffect } from 'react';
import { Mail, ChevronDown, MessageSquare, Check, Edit3 } from 'lucide-react';

interface EmailCardProps {
  subject: string;
  from: string;
  to: string | string[];
  body: string;
  onSend: () => void;
  onCancel: () => void;
  type?: 'email' | 'message';
  onOpenEdit?: () => void;
}

export const EmailCard: React.FC<EmailCardProps> = ({
  subject,
  from,
  to,
  body,
  onSend,
  onCancel,
  type = 'email',
  onOpenEdit,
}) => {
  // Handle multiple recipients
  const recipients = Array.isArray(to) ? to : [to];
  const firstRecipient = recipients[0];
  const remainingCount = recipients.length - 1;

  // Read more functionality
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Countdown and sending states
  const [sendState, setSendState] = useState<'ready' | 'countdown' | 'sent'>('ready');
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 12; // 12 lines
      const actualHeight = contentRef.current.scrollHeight;
      setShowReadMore(actualHeight > maxHeight);
    }
  }, [body]);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  // Handle countdown
  useEffect(() => {
    if (sendState === 'countdown') {
      if (countdown > 0) {
        countdownIntervalRef.current = setTimeout(() => {
          setCountdown(countdown - 1);
        }, 1000);
      } else {
        // Countdown finished, mark as sent
        setSendState('sent');
        onSend();
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearTimeout(countdownIntervalRef.current);
      }
    };
  }, [sendState, countdown, onSend]);

  const handleSendClick = () => {
    setSendState('countdown');
    setCountdown(5);
  };

  const handleUndo = () => {
    setSendState('ready');
    setCountdown(5);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  };

  // Get icon and color based on type
  const iconConfig = type === 'email' 
    ? { Icon: Mail, bgColor: 'bg-[#EEF2FF]', iconColor: 'text-[#6366F1]' }
    : { Icon: MessageSquare, bgColor: 'bg-[#F0FDF4]', iconColor: 'text-[#10B981]' };

  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header - Compact */}
      <div className="px-5 py-3 border-b border-[#E6E8EC]">
        <div className="flex items-center justify-between gap-2.5 mb-0.5">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconConfig.bgColor}`}>
              <iconConfig.Icon className={`w-3.5 h-3.5 ${iconConfig.iconColor}`} />
            </div>
            <h3 className="text-[14px] font-semibold text-[#1C1E21]">
              {type === 'email' ? subject : 'Send message'}
            </h3>
          </div>
          {onOpenEdit && (
            <button
              onClick={onOpenEdit}
              className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors group"
              aria-label="Edit"
            >
              <Edit3 className="w-4 h-4 text-[#6B7280] group-hover:text-[#1C1E21]" />
            </button>
          )}
        </div>
      </div>

      {/* Email Body */}
      <div className="px-5 py-4">
        <div 
          ref={contentRef}
          className={`text-[14px] text-[#1C1E21] leading-relaxed whitespace-pre-line transition-all duration-300 ease-in-out ${!isExpanded && showReadMore ? 'line-clamp-[12]' : ''}`}
        >
          {body}
        </div>
        {showReadMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 w-full py-1.5 flex items-center justify-center gap-1 text-[13px] font-medium text-[#1C1E21] hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            {isExpanded ? 'Show less' : 'Read more'}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3 border-t border-[#E6E8EC] flex items-center justify-end gap-2">
        {sendState === 'ready' && (
          <>
            {/* Cancel Button */}
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-white border border-[#E6E8EC] rounded-lg text-[12px] font-medium text-[#6B7280] hover:bg-[#F8F9FB] transition-colors"
            >
              Cancel
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendClick}
              className="px-4 py-2 bg-[#221E1F] rounded-lg text-[12px] font-medium text-white hover:bg-[#6D5F63] transition-colors"
            >
              Send
            </button>
          </>
        )}

        {sendState === 'countdown' && (
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#6B7280]">
              Sending in {countdown}s
            </span>
            <button
              onClick={handleUndo}
              className="px-4 py-2 bg-white border border-[#E6E8EC] rounded-lg text-[12px] font-medium text-[#6B7280] hover:bg-[#F8F9FB] transition-colors"
            >
              Undo
            </button>
          </div>
        )}

        {sendState === 'sent' && (
          <div className="flex items-center gap-2 text-[#6B7280]">
            <span className="text-[13px]">
              Sent at {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
            <Check className="w-4 h-4 text-[#10B981]" />
          </div>
        )}
      </div>
    </div>
  );
};
