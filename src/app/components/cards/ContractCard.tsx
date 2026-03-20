interface ContractCardProps {
  contractName: string;
  customerOrg: string;
  startDate: string;
  endDate: string;
  contractValue: number;
  status: 'Active' | 'Pending' | 'Expired' | 'Terminated' | 'Renewed';
}

export const ContractCard = ({ contractName, customerOrg, startDate, endDate, contractValue, status }: ContractCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'Renewed':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Pending':
        return 'bg-[#FFF4ED] text-[#F59E0B]';
      case 'Expired':
      case 'Terminated':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#F5F3FF] text-[#8B5CF6]">
        {contractName.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{contractName}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {customerOrg} • ${contractValue.toLocaleString()}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {startDate} - {endDate}
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
