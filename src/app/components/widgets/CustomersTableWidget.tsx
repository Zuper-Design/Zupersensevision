export const CustomersTableWidget = () => {
  const customers = [
    { name: 'John Martinez', avatar: 'JM', status: 'Active Job', value: '$18,500', period: 'Full Tear-Off', address: '4521 Oak Ridge Dr' },
    { name: 'Sarah Chen', avatar: 'SC', status: 'Quote Sent', value: '$12,200', period: 'Shingle Repair', address: '892 Elm Street' },
    { name: 'Mike Thompson', avatar: 'MT', status: 'Scheduled', value: '$34,800', period: 'Commercial Flat', address: '1200 Commerce Blvd' },
    { name: 'Lisa Anderson', avatar: 'LA', status: 'Inspection', value: '$8,400', period: 'Leak Repair', address: '567 Maple Ave' },
    { name: 'Robert Davis', avatar: 'RD', status: 'Completed', value: '$22,100', period: 'Re-Roofing', address: '3345 Pine Creek Rd' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active Job':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'Quote Sent':
        return 'bg-[#FFF4ED] text-[#F59E0B]';
      case 'Scheduled':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Inspection':
        return 'bg-[#F5F3FF] text-[#8B5CF6]';
      case 'Completed':
        return 'bg-[#F8F9FB] text-[#6B7280]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  const getInitialsColor = (index: number) => {
    const colors = [
      'bg-[#EFF6FF] text-[#3B82F6]',
      'bg-[#FFF4ED] text-[#F59E0B]',
      'bg-[#F0FDF4] text-[#10B981]',
      'bg-[#FEF2F2] text-[#EF4444]',
      'bg-[#F5F3FF] text-[#8B5CF6]',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 card-hover-elevate">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Recent Customers</h3>
          <p className="text-[12px] text-[#6B7280]">Active roofing jobs & quotes</p>
        </div>
        <button className="text-[12px] font-medium text-[#221E1F] hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {customers.map((customer, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 ${getInitialsColor(index)}`}>
              {customer.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#1C1E21]">{customer.name}</p>
              <p className="text-[11px] text-[#9CA3AF]">{customer.period} · {customer.address}</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-[#1C1E21] mb-1">{customer.value}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(customer.status)}`}>
                {customer.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};