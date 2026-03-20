export const TaskTableWidget = () => {
  const tasks = [
    {
      task: 'Complete Martinez tear-off & underlayment',
      status: 'In Progress',
      priority: 'high',
      assignee: 'Crew A',
      dueDate: 'Feb 25',
      jobValue: '$18,500',
    },
    {
      task: 'Thompson flat roof — membrane install',
      status: 'In Progress',
      priority: 'Critical',
      assignee: 'Crew B',
      dueDate: 'Feb 26',
      jobValue: '$34,800',
    },
    {
      task: 'Final inspection — Davis re-roofing',
      status: 'Scheduled',
      priority: 'medium',
      assignee: 'Crew C',
      dueDate: 'Feb 25',
      jobValue: '$22,100',
    },
    {
      task: 'Anderson property — gutter replacement',
      status: 'Blocked',
      priority: 'medium',
      assignee: 'Crew D',
      dueDate: 'Feb 27',
      jobValue: '$8,400',
    },
    {
      task: 'Chen residence — shingle repair estimate',
      status: 'Todo',
      priority: 'high',
      assignee: 'Grace',
      dueDate: 'Feb 25',
      jobValue: '$12,200',
    },
    {
      task: 'Submit permit — Walker commercial build',
      status: 'Todo',
      priority: 'low',
      assignee: 'Sophie',
      dueDate: 'Feb 28',
      jobValue: '$56,000',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-[#F0FDF4] text-[#10B981]';
      case 'In Progress':
        return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Todo':
        return 'bg-[#F8F9FB] text-[#6B7280]';
      case 'Blocked':
        return 'bg-[#FEF2F2] text-[#EF4444]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-[#FEF2F2] text-[#DC2626]';
      case 'high':
        return 'bg-[#FFF4ED] text-[#EA580C]';
      case 'medium':
        return 'bg-[#FFF7ED] text-[#F59E0B]';
      case 'low':
        return 'bg-[#F0FDF4] text-[#10B981]';
      default:
        return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Active Jobs & Tasks</h3>
          <p className="text-[12px] text-[#6B7280]">Crew assignments and job deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#3B82F6] font-medium">2 in progress</span>
          <button className="text-[12px] font-medium text-[#221E1F] hover:underline">
            View all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E6E8EC]">
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider pb-3">
                Job / Task
              </th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider pb-3">
                Status
              </th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider pb-3">
                Priority
              </th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider pb-3">
                Assigned
              </th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider pb-3">
                Value
              </th>
              <th className="text-left text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider pb-3">
                Due
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="border-b border-[#E6E8EC] last:border-0 hover:bg-[#F8F9FB] transition-colors"
              >
                <td className="py-3 pr-4">
                  <p className="text-[13px] text-[#1C1E21]">{task.task}</p>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${getStatusStyle(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-[13px] text-[#1C1E21]">{task.assignee}</p>
                </td>
                <td className="py-3 pr-4">
                  <p className="text-[13px] font-medium text-[#1C1E21]">{task.jobValue}</p>
                </td>
                <td className="py-3">
                  <p className="text-[13px] text-[#6B7280]">{task.dueDate}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
