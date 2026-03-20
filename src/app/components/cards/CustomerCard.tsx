interface CustomerCardProps {
  customerName: string;
  organization?: string;
  phone: string;
  email: string;
  serviceAddress: string;
  customerType: 'Residential' | 'Commercial';
}

export const CustomerCard = ({ customerName, organization, phone, email, serviceAddress, customerType }: CustomerCardProps) => {
  const getTypeColor = (type: string) => {
    return type === 'Commercial' 
      ? 'bg-[#EFF6FF] text-[#3B82F6]' 
      : 'bg-[#F0FDF4] text-[#10B981]';
  };

  const getInitials = (name: string) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#F0FDF4] text-[#10B981]">
        {getInitials(customerName)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{customerName}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {organization ? `${organization} • ` : ''}{phone} • {email}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">{serviceAddress}</p>
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getTypeColor(customerType)}`}>
          {customerType}
        </span>
      </div>
    </div>
  );
};
