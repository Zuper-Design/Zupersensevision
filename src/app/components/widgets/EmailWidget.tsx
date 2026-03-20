import { Mail, Star, Paperclip } from 'lucide-react';

export const EmailWidget = () => {
  const emails = [
    {
      from: 'John Martinez',
      subject: 'Re: Roofing project proposal',
      preview: 'Thanks for the detailed quote. I have a few questions about the timeline...',
      time: '10m ago',
      unread: true,
      starred: false,
      hasAttachment: true,
    },
    {
      from: 'Sarah Chen',
      subject: 'Invoice #1247 - Payment Confirmation',
      preview: 'Payment has been processed successfully for the recent roofing work...',
      time: '1h ago',
      unread: true,
      starred: true,
      hasAttachment: false,
    },
    {
      from: 'Mike Thompson',
      subject: 'Question about warranty',
      preview: 'Hi, I wanted to ask about the warranty coverage for the new roof installation...',
      time: '2h ago',
      unread: false,
      starred: false,
      hasAttachment: false,
    },
    {
      from: 'Lisa Anderson',
      subject: 'Scheduling next week',
      preview: 'Can we schedule the roof inspection for next Tuesday or Wednesday?',
      time: '3h ago',
      unread: false,
      starred: false,
      hasAttachment: false,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-[#6B7280]" />
          <h3 className="text-[14px] font-semibold text-[#1C1E21]">Recent Messages</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FEF2F2] text-[#EF4444] font-medium">
            2 new
          </span>
        </div>
        <button className="text-[12px] font-medium text-[#221E1F] hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-2">
        {emails.map((email, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer border ${
              email.unread ? 'border-[#E6E8EC] bg-[#FAFBFC]' : 'border-transparent'
            }`}
          >
            <div className="flex items-start gap-2 mb-1.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className={`text-[13px] ${email.unread ? 'font-semibold text-[#1C1E21]' : 'font-medium text-[#6B7280]'}`}>
                    {email.from}
                  </p>
                  {email.starred && <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />}
                  {email.hasAttachment && <Paperclip className="w-3 h-3 text-[#6B7280]" />}
                </div>
                <p className={`text-[12px] mb-1 ${email.unread ? 'font-medium text-[#1C1E21]' : 'text-[#6B7280]'}`}>
                  {email.subject}
                </p>
                <p className="text-[11px] text-[#9CA3AF] line-clamp-1">{email.preview}</p>
              </div>
              <span className="text-[10px] text-[#9CA3AF] whitespace-nowrap">{email.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
