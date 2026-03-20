interface ServicesCardProps {
  serviceName: string;
  category: string;
  duration: string;
  price: number;
  assignedTeamType: string;
  availabilityStatus: 'Available' | 'Unavailable' | 'Seasonal' | 'By Request';
}

export const ServicesCard = ({ serviceName, category, duration, price, assignedTeamType, availabilityStatus }: ServicesCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'Unavailable':
        return 'bg-[#F8F9FB] text-[#6B7280]';
      case 'Seasonal':
        return 'bg-[#FFF4ED] text-[#F59E0B]';
      case 'By Request':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#EFF6FF] text-[#3B82F6]">
        {serviceName.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{serviceName}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {category} • {duration} • ${price.toFixed(2)}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">{assignedTeamType}</p>
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(availabilityStatus)}`}>
          {availabilityStatus}
        </span>
      </div>
    </div>
  );
};
