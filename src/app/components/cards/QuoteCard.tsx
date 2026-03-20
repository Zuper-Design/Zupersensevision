interface QuoteCardProps {
  quoteTitle: string;
  customer: string;
  relatedJobProject?: string;
  totalAmount: number;
  validUntil: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Declined' | 'Expired';
}

export const QuoteCard = ({ quoteTitle, customer, relatedJobProject, totalAmount, validUntil, status }: QuoteCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'Sent':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Viewed':
        return 'bg-[#F5F3FF] text-[#8B5CF6]';
      case 'Draft':
        return 'bg-[#F8F9FB] text-[#6B7280]';
      case 'Declined':
      case 'Expired':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#F0FDF4] text-[#10B981]">
        {quoteTitle.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{quoteTitle}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {customer}{relatedJobProject ? ` • ${relatedJobProject}` : ''}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          ${totalAmount.toLocaleString()} • Valid until {validUntil}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
    </div>
  );
};
