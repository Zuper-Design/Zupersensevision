import { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, FileText, ArrowRight, ArrowUp, Mic, MicOff } from 'lucide-react';
import { SenseLogo } from './SenseLogo';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

function getCardResponse(cardTitle: string): string {
  const t = cardTitle.toLowerCase();
  if (t.includes('revenue') || t.includes('mtd')) {
    return `Revenue MTD is at $284,500 — that's $24,500 ahead of the $260,000 monthly target. You're on pace for a strong close. Top performing category this month is residential re-roofing at 62% of revenue mix.`;
  }
  if (t.includes('overdue') || t.includes('invoice')) {
    return `You have $38,200 in overdue invoices across 14 accounts. The oldest bucket (60+ days) holds $12,200 — I'd recommend prioritising those first. Collected MTD is $197,400 so overall AR health is stable.`;
  }
  if (t.includes('quote') || t.includes('conversion')) {
    return `Quote-to-invoice conversion is at 61% this month, up from 59% last month and above the 55% industry benchmark. You sent 63 quotes MTD and won 38. The 3 stuck quotes flagged in Sense Alerts are your biggest recovery opportunity.`;
  }
  if (t.includes('crew') || t.includes('utilisation') || t.includes('utilization')) {
    return `Overall crew utilisation is 74% this week. Crew A and B are above the 80% target. Crew C (71%) and Crew D (64%) have capacity — worth checking if they can absorb the 4 jobs behind SLA flagged in alerts.`;
  }
  if (t.includes('job') || t.includes('completed') || t.includes('risk')) {
    return `134 jobs completed this week with a 91% on-time rate. 7 jobs are currently at risk — mostly re-roofing projects delayed by weather and a crew scheduling conflict. Average completion time is 3.2 days.`;
  }
  if (t.includes('dso') || t.includes('days sales outstanding')) {
    return `Current DSO is 42 days, which is 5 days above your 37-day target. 3 invoices are past 60 days ($84,000 total). Johnson Roofing is the largest at $32,400 overdue 67 days. DSO did improve 3 days from last month.`;
  }
  return `Here's a summary for "${cardTitle}": this card is tracking a key business metric. Ask me anything specific about the numbers, trends, or what actions to take.`;
}

function getCardSuggestions(cardTitle: string): { icon: 'msg' | 'doc'; text: string }[] {
  const t = cardTitle.toLowerCase();
  if (t.includes('revenue') || t.includes('mtd')) {
    return [
      { icon: 'msg', text: 'Change time frame to last 30 days' },
      { icon: 'msg', text: 'Compare to previous quarter' },
      { icon: 'msg', text: 'Break down by service category' },
      { icon: 'doc', text: 'Show monthly revenue trend' },
    ];
  }
  if (t.includes('overdue') || t.includes('invoice')) {
    return [
      { icon: 'msg', text: 'Filter invoices 60+ days overdue' },
      { icon: 'msg', text: 'Show by customer' },
      { icon: 'msg', text: 'Compare to last month' },
      { icon: 'doc', text: 'Sort by outstanding amount' },
    ];
  }
  if (t.includes('quote') || t.includes('conversion')) {
    return [
      { icon: 'msg', text: 'Show last 90 days' },
      { icon: 'msg', text: 'Filter by sales rep' },
      { icon: 'msg', text: 'Show only lost quotes' },
      { icon: 'doc', text: 'Compare to industry benchmark' },
    ];
  }
  if (t.includes('crew') || t.includes('utilis') || t.includes('utiliz')) {
    return [
      { icon: 'msg', text: 'Filter by individual crew' },
      { icon: 'msg', text: 'Compare this week vs last week' },
      { icon: 'msg', text: 'Highlight underutilised crews' },
      { icon: 'doc', text: 'Break down by job type' },
    ];
  }
  if (t.includes('job') || t.includes('at risk') || t.includes('completed')) {
    return [
      { icon: 'msg', text: 'Show at-risk jobs only' },
      { icon: 'msg', text: 'Filter by crew' },
      { icon: 'msg', text: 'Change to last 7 days' },
      { icon: 'doc', text: 'Break down by job category' },
    ];
  }
  if (t.includes('dso') || t.includes('days sales')) {
    return [
      { icon: 'msg', text: 'Show 6-month trend' },
      { icon: 'msg', text: 'Filter by customer' },
      { icon: 'msg', text: 'Highlight accounts over 60 days' },
      { icon: 'doc', text: 'Compare to last quarter' },
    ];
  }
  return [
    { icon: 'msg', text: 'Change the time frame' },
    { icon: 'msg', text: 'Filter by category' },
    { icon: 'msg', text: 'Compare to previous period' },
    { icon: 'doc', text: 'Show trend over time' },
  ];
}

interface RadarChatPanelProps {
  initialCardTitle?: string;
  onClose: () => void;
  title?: string;
}

export function RadarChatPanel({ initialCardTitle, onClose, title = 'Sense' }: RadarChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [listening, setListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Pre-load context when opened from a card
  useEffect(() => {
    if (initialCardTitle) {
      setMessages([{ role: 'user', text: `Tell me about ${initialCardTitle}` }]);
      setProcessing(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'ai', text: getCardResponse(initialCardTitle) }]);
        setProcessing(false);
      }, 700);
    }
  }, [initialCardTitle]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, processing]);

  const handleSubmit = () => {
    const text = query.trim();
    if (!text || processing) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setQuery('');
    setProcessing(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: getCardResponse(text) }]);
      setProcessing(false);
    }, 800);
  };

  // 3 card-specific suggestions shown below the conversation
  const cardSuggestions = initialCardTitle ? getCardSuggestions(initialCardTitle).slice(0, 3) : [];

  const genericSuggestions = [
    { icon: 'msg' as const, text: 'How is revenue tracking this month?' },
    { icon: 'msg' as const, text: 'Which jobs are behind on SLA?' },
    { icon: 'doc' as const, text: 'Show me overdue invoices summary.' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: '#FAFBFC', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 flex-shrink-0"
        style={{ background: '#FFFFFF', borderBottom: '1px solid #ECEEF1' }}
      >
        <div className="flex items-center gap-2.5">
          <SenseLogo size={20} animated={processing} />
          <span className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 600 }}>{title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors"
        >
          <X className="w-4 h-4 text-[#9CA3AF]" />
        </button>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ background: '#FFFFFF' }}>
        {messages.length === 0 && !processing && (
          <div className="flex flex-col h-full">
            {/* Welcome */}
            <div className="flex flex-col items-center pt-8 pb-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5"
                style={{ background: 'linear-gradient(135deg, #FFF7ED, #FFF1E3)', border: '1px solid rgba(253,80,0,0.10)' }}
              >
                <SenseLogo size={24} animated={false} />
              </div>
              <p className="text-[14px] text-[#1C1E21] mb-0.5" style={{ fontWeight: 600 }}>How can I help?</p>
              <p className="text-[12px] text-[#9CA3AF]">Ask about your data or insights.</p>
            </div>

            {/* Generic suggestions (empty state only) */}
            <div className="flex flex-col w-full">
              <p className="text-[11px] text-[#B0B8C4] uppercase tracking-wider mb-2 px-1" style={{ fontWeight: 500, letterSpacing: '0.04em' }}>Suggestions</p>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #ECEEF1', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                {genericSuggestions.map((s, idx) => (
                  <button
                    key={s.text}
                    onClick={() => {
                      setMessages([{ role: 'user', text: s.text }]);
                      setProcessing(true);
                      setTimeout(() => {
                        setMessages((prev) => [...prev, { role: 'ai', text: getCardResponse(s.text) }]);
                        setProcessing(false);
                      }, 800);
                    }}
                    className="group/sg flex items-center gap-3 w-full px-4 py-3.5 text-left transition-all duration-150 hover:bg-[#F8F9FB]"
                    style={{ background: '#FFFFFF', borderBottom: idx < genericSuggestions.length - 1 ? '1px solid #F0F1F3' : 'none' }}
                  >
                    {s.icon === 'doc' ? (
                      <FileText className="w-[15px] h-[15px] text-[#C8CCD4] flex-shrink-0 group-hover/sg:text-[#9CA3AF] transition-colors" />
                    ) : (
                      <MessageSquare className="w-[15px] h-[15px] text-[#C8CCD4] flex-shrink-0 group-hover/sg:text-[#9CA3AF] transition-colors" />
                    )}
                    <span className="flex-1 text-[13px] text-[#4B5563] group-hover/sg:text-[#1C1E21] transition-colors" style={{ fontWeight: 420 }}>
                      {s.text}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D1D5DB] group-hover/sg:text-[#9CA3AF] flex-shrink-0 transition-colors opacity-60 group-hover/sg:opacity-100" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {(messages.length > 0 || processing) && (
          <div className="space-y-5">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.role === 'user' && (
                  <div className="flex justify-end">
                    <div
                      className="max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] text-[#1C1E21] leading-relaxed"
                      style={{ background: '#F0F1F3', fontWeight: 400 }}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.role === 'ai' && (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <SenseLogo size={15} animated={false} />
                      <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
                    </div>
                    <p className="text-[13px] text-[#1C1E21] leading-relaxed" style={{ fontWeight: 400 }}>{msg.text}</p>
                  </div>
                )}
              </div>
            ))}

            {processing && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <SenseLogo size={15} animated={true} />
                  <span className="text-[12.5px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Sense</span>
                </div>
                <div className="flex gap-1.5 pl-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4C8D0]" style={{ animation: 'sensePulse 1.2s ease-in-out infinite' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4C8D0]" style={{ animation: 'sensePulse 1.2s ease-in-out 0.2s infinite' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C4C8D0]" style={{ animation: 'sensePulse 1.2s ease-in-out 0.4s infinite' }} />
                </div>
              </div>
            )}

            {/* Card-specific suggestions below the conversation */}
            {!processing && cardSuggestions.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] text-[#B0B8C4] uppercase tracking-wider mb-2" style={{ fontWeight: 500, letterSpacing: '0.04em' }}>Try asking</p>
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #ECEEF1' }}>
                  {cardSuggestions.map((s, idx) => (
                    <button
                      key={s.text}
                      onClick={() => {
                        setMessages((prev) => [...prev, { role: 'user', text: s.text }]);
                        setProcessing(true);
                        setTimeout(() => {
                          setMessages((prev) => [...prev, { role: 'ai', text: getCardResponse(s.text) }]);
                          setProcessing(false);
                        }, 800);
                      }}
                      className="group/sg flex items-center gap-3 w-full px-4 py-3 text-left transition-all duration-150 hover:bg-[#F8F9FB]"
                      style={{ background: '#FFFFFF', borderBottom: idx < cardSuggestions.length - 1 ? '1px solid #F0F1F3' : 'none' }}
                    >
                      {s.icon === 'doc' ? (
                        <FileText className="w-[14px] h-[14px] text-[#C8CCD4] flex-shrink-0 group-hover/sg:text-[#9CA3AF] transition-colors" />
                      ) : (
                        <MessageSquare className="w-[14px] h-[14px] text-[#C8CCD4] flex-shrink-0 group-hover/sg:text-[#9CA3AF] transition-colors" />
                      )}
                      <span className="flex-1 text-[12.5px] text-[#4B5563] group-hover/sg:text-[#1C1E21] transition-colors">{s.text}</span>
                      <ArrowRight className="w-3 h-3 text-[#D1D5DB] group-hover/sg:text-[#9CA3AF] flex-shrink-0 opacity-60 group-hover/sg:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3" style={{ background: '#FFFFFF', borderTop: '1px solid #ECEEF1' }}>
        <div
          className="flex items-center gap-2 rounded-xl px-3.5 py-2.5"
          style={{
            background: '#FFFFFF',
            border: inputFocused ? '1px solid rgba(253,80,0,0.30)' : '1px solid #E2E4E8',
            boxShadow: inputFocused
              ? '0 0 0 3px rgba(253,80,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'
              : '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'border 0.2s, box-shadow 0.2s',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about your data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
            disabled={processing}
            className="flex-1 text-[13px] text-[#1C1E21] placeholder-[#B0B8C4] bg-transparent outline-none"
            style={{ fontWeight: 400 }}
          />
          <button
            className="p-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors"
            onClick={() => setListening((l) => !l)}
          >
            {listening ? (
              <MicOff className="w-4 h-4 text-[#FD5000]" />
            ) : (
              <Mic className="w-4 h-4 text-[#C4C8D0]" />
            )}
          </button>
          <button
            onClick={handleSubmit}
            disabled={processing || !query.trim()}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: query.trim() ? 'linear-gradient(135deg, #FD5000, #E04500)' : '#ECEEF1' }}
          >
            <ArrowUp className={`w-3.5 h-3.5 ${query.trim() ? 'text-white' : 'text-[#B0B8C4]'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-[10px] text-[#C4C8D0]">Text or voice</span>
          <span className="text-[10px] text-[#C4C8D0] flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded text-[9px] text-[#9CA3AF]" style={{ fontWeight: 600, backgroundColor: '#ECEEF1' }}>Esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
