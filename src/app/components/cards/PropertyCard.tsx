interface PropertyCardProps {
  propertyName: string;
  owner: string;
  organization?: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed Use';
  accessNotes?: string;
  activeStatus: 'Active' | 'Inactive' | 'Under Maintenance';
}

export const PropertyCard = ({ propertyName, owner, organization, propertyType, accessNotes, activeStatus }: PropertyCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'Inactive':
        return 'bg-[#F8F9FB] text-[#6B7280]';
      case 'Under Maintenance':
        return 'bg-[#FFF4ED] text-[#F59E0B]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#FFF4ED] text-[#F59E0B]">
        {propertyName.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{propertyName}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {owner}{organization ? ` • ${organization}` : ''} • {propertyType}
        </p>
        {accessNotes && (
          <p className="text-[11px] text-[#9CA3AF] truncate">{accessNotes}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(activeStatus)}`}>
          {activeStatus}
        </span>
      </div>
    </div>
  );
};
