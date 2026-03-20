interface JobCardProps {
  title: string;
  customer: string;
  organization?: string;
  scheduledDate: string;
  scheduledTime: string;
  technician: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export const JobCard = ({ title, customer, organization, scheduledDate, scheduledTime, technician, priority }: JobCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      case 'High':
        return 'bg-[#FFF4ED] text-[#F59E0B]';
      case 'Medium':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Low':
        return 'bg-[#F8F9FB] text-[#6B7280]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#EFF6FF] text-[#3B82F6]">
        {title.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{title}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {customer}{organization ? ` • ${organization}` : ''}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {scheduledDate} at {scheduledTime} • {technician}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPriorityColor(priority)}`}>
          {priority}
        </span>
      </div>
    </div>
  );
};
