interface MaterialRequestCardProps {
  requestTitle: string;
  requestedBy: string;
  relatedJobProject: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  neededByDate: string;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Received' | 'Cancelled';
}

export const MaterialRequestCard = ({ requestTitle, requestedBy, relatedJobProject, priority, neededByDate, status }: MaterialRequestCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Received':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'Ordered':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Approved':
        return 'bg-[#F5F3FF] text-[#8B5CF6]';
      case 'Pending':
        return 'bg-[#FFF4ED] text-[#F59E0B]';
      case 'Cancelled':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  const getPriorityBadge = (priority: string) => {
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
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#FFF4ED] text-[#F59E0B]">
        {requestTitle.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{requestTitle}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          {requestedBy} • {relatedJobProject}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          Needed by {neededByDate}
        </p>
      </div>
      <div className="flex-shrink-0 flex flex-col gap-1 items-end">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(status)}`}>
          {status}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPriorityBadge(priority)}`}>
          {priority}
        </span>
      </div>
    </div>
  );
};
