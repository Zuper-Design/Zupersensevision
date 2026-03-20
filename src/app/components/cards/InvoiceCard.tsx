interface InvoiceCardProps {
  invoiceNumber: string;
  customer: string;
  relatedJobProject?: string;
  amount: number;
  dueDate: string;
  paymentStatus: 'Paid' | 'Pending' | 'Overdue' | 'Partial' | 'Cancelled';
}

export const InvoiceCard = ({ invoiceNumber, customer, relatedJobProject, amount, dueDate, paymentStatus }: InvoiceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'Pending':
        return 'bg-[#FFF4ED] text-[#F59E0B]';
      case 'Partial':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Overdue':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      case 'Cancelled':
        return 'bg-[#F8F9FB] text-[#6B7280]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#EFF6FF] text-[#3B82F6]">
        {invoiceNumber.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{invoiceNumber}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {customer}{relatedJobProject ? ` • ${relatedJobProject}` : ''}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          ${amount.toLocaleString()} • Due {dueDate}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(paymentStatus)}`}>
          {paymentStatus}
        </span>
      </div>
    </div>
  );
};
