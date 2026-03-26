import { useState } from 'react';
import { X, Maximize2, Send, Mic, ExternalLink, MessageSquare } from 'lucide-react';
import { SavedCard } from './RadarContext';
import { SenseLogo } from './SenseLogo';

interface ChatPreviewPanelProps {
  card: SavedCard;
  onClose: () => void;
  onExpandFullScreen: (card: SavedCard) => void;
}

// Generate contextual AI response based on card content
function getCardConversation(card: SavedCard): { question: string; answer: string; details?: string[] } {
  const title = card.title?.toLowerCase() || '';

  if (title.includes('dso') || title.includes('days sales outstanding')) {
    return {
      question: 'Show me our overdue invoices and DSO trends',
      answer: 'Your current DSO is 42 days, which is 5 days above your 37-day target. Here\'s what I found:',
      details: [
        '3 invoices are past 60 days ($84,000 total)',
        'Top overdue: Johnson Roofing – $32,400 (67 days)',
        'DSO improved 3 days from last month',
        'Recommended: Send follow-up to top 3 accounts'
      ]
    };
  }
  if (title.includes('quote') || title.includes('stuck')) {
    return {
      question: 'Which quotes are stuck and need follow-up?',
      answer: 'I found 3 quotes that haven\'t moved in over 14 days, representing $84,000 in potential revenue.',
      details: [
        'Martinez Residence – $34,200 (21 days stale)',
        'Oak Park Commercial – $28,800 (18 days stale)',
        'Riverside Repair – $21,000 (15 days stale)',
        'All three had initial positive responses'
      ]
    };
  }
  if (title.includes('sla') || title.includes('delay') || title.includes('missing')) {
    return {
      question: 'Which jobs are missing their SLA targets?',
      answer: '4 jobs are currently outside SLA, mostly re-roofing projects in the northwest region.',
      details: [
        '2 re-roofing jobs delayed by weather',
        '1 gutter replacement waiting on materials',
        '1 inspection delayed – crew scheduling conflict',
        'Average delay: 2.3 days past SLA'
      ]
    };
  }
  if (title.includes('revenue') || title.includes('money') || title.includes('income')) {
    return {
      question: 'How is revenue tracking this month?',
      answer: 'Monthly revenue is at $142,500, which is 78% of your $182,000 target with 9 days remaining.',
      details: [
        'On pace to hit ~$168K by month end',
        'Residential jobs driving 62% of revenue',
        'Average job value up 8% vs last month',
      ]
    };
  }
  if (title.includes('team') || title.includes('performance') || title.includes('crew')) {
    return {
      question: 'How is team performance looking?',
      answer: 'Overall team utilization is at 84% this week. Here are the highlights:',
      details: [
        'Richard\'s crew: 94% utilization (top performer)',
        'New hire onboarding completing Friday',
        '2 crews available for emergency jobs tomorrow',
      ]
    };
  }

  // Generic fallback
  return {
    question: `Tell me about ${card.title}`,
    answer: card.preview || 'Here\'s what I found based on your business data:',
    details: [
      'Analysis is based on the latest available data',
      'Click "View full screen" for detailed breakdown'
    ]
  };
}

export function ChatPreviewPanel({ card, onClose, onExpandFullScreen }: ChatPreviewPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const conversation = getCardConversation(card);

  return (
    <div
      className="h-full flex flex-col bg-white"
      style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
    >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6E8EC] flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-3.5 h-3.5 text-[#FD5000]" />
            </div>
            <span className="text-[13px] text-[#1C1E21] truncate" style={{ fontWeight: 500 }}>
              {card.title}
            </span>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button
              onClick={() => onExpandFullScreen(card)}
              className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
              title="Open full screen"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <>
          <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 space-y-5 bg-white">
              {/* Source badge */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FFF4ED] text-[#FD5000]" style={{ fontWeight: 600 }}>
                  From Radar
                </span>
                {card.sourceThreadId && (
                  <span className="text-[10px] text-[#9CA3AF]">Thread #{card.sourceThreadId}</span>
                )}
              </div>

              {/* User question bubble — grey like Sense chat */}
              <div className="flex justify-end">
                <div className="max-w-[85%] bg-[#F3F4F6] rounded-[16px] px-5 py-3">
                  <p className="text-[14px] text-[#1C1E21] leading-relaxed">{conversation.question}</p>
                </div>
              </div>

              {/* AI response — white bg like Sense chat */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FFF4ED] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <SenseLogo size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>Sense</span>
                  </div>
                  <p className="text-[14px] text-[#1C1E21] leading-relaxed mb-3">{conversation.answer}</p>
                  
                  {/* Detail items */}
                  {conversation.details && conversation.details.length > 0 && (
                    <div className="bg-[#F8F9FB] rounded-xl border border-[#F3F4F6] p-3.5 space-y-2.5">
                      {conversation.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FD5000] mt-[7px] flex-shrink-0" />
                          <span className="text-[13px] text-[#374151] leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Expand CTA */}
                  <button
                    onClick={() => onExpandFullScreen(card)}
                    className="flex items-center gap-1.5 mt-3 text-[12px] text-[#FD5000] hover:underline transition-colors cursor-pointer"
                    style={{ fontWeight: 500 }}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View full conversation
                  </button>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-[#E6E8EC] px-4 py-3 flex items-center gap-2 flex-shrink-0 bg-white">
              <input
                type="text"
                placeholder="Continue this conversation..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 text-[13px] text-[#1C1E21] placeholder-[#9CA3AF] bg-transparent outline-none"
              />
              <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
                <Mic className="w-4 h-4 text-[#9CA3AF]" />
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors ${
                  inputValue.trim()
                    ? 'bg-[#FD5000] hover:bg-[#E54800]'
                    : 'bg-[#F3F4F6]'
                }`}
              >
                <Send className={`w-4 h-4 ${inputValue.trim() ? 'text-white' : 'text-[#9CA3AF]'}`} />
              </button>
            </div>
        </>
    </div>
  );
}