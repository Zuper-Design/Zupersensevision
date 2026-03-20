import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const TasksWidget = () => {
  const tasks = [
    { title: 'Inspect Martinez tear-off progress', status: 'completed', time: '9:00 AM' },
    { title: 'Review Thompson permit status', status: 'in-progress', time: '10:30 AM' },
    { title: 'Call supplier re: shingle delivery', status: 'pending', time: '11:00 AM' },
    { title: 'Sign off Anderson final walkthrough', status: 'pending', time: '1:00 PM' },
    { title: 'Send crew schedules for next week', status: 'pending', time: '3:00 PM' },
    { title: 'Follow up on 3 pending quotes', status: 'pending', time: '4:00 PM' },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle2, color: 'text-[#10B981]', bg: 'bg-[#F0FDF4]' };
      case 'in-progress':
        return { icon: Clock, color: 'text-[#F59E0B]', bg: 'bg-[#FFF7ED]' };
      default:
        return { icon: AlertCircle, color: 'text-[#6B7280]', bg: 'bg-[#F8F9FB]' };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 card-hover-elevate">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Today's Checklist</h3>
          <p className="text-[12px] text-[#6B7280]">1 of 6 completed</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 bg-[#FFF4ED] rounded-lg">
          <span className="text-[11px] font-medium text-[#FD5000]">Feb 25</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tasks.map((task, index) => {
          const config = getStatusConfig(task.status);
          const Icon = config.icon;
          
          return (
            <div
              key={index}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors group cursor-pointer"
            >
              <div className={`w-7 h-7 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-3.5 h-3.5 ${config.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`text-[12px] font-medium ${task.status === 'completed' ? 'text-[#6B7280] line-through' : 'text-[#1C1E21]'}`}>
                  {task.title}
                </p>
                <p className="text-[10px] text-[#9CA3AF]">{task.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};