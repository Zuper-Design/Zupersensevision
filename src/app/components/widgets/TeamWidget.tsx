import { Users, HardHat, Star, Clock } from 'lucide-react';

export const TeamWidget = () => {
  const crews = [
    { name: 'Crew A – Marcus', members: 5, activeJob: 'Martinez Tear-Off', status: 'On Site', rating: 4.8 },
    { name: 'Crew B – Dennis', members: 4, activeJob: 'Thompson Flat Roof', status: 'On Site', rating: 4.6 },
    { name: 'Crew C – Ken', members: 4, activeJob: 'Anderson Re-Roof', status: 'On Site', rating: 4.9 },
    { name: 'Crew D – Sophie', members: 3, activeJob: '—', status: 'Available', rating: 4.5 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Crew Overview</h3>
          <p className="text-[12px] text-[#6B7280]">16 members across 4 crews</p>
        </div>
      </div>

      <div className="space-y-3">
        {crews.map((crew, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FB] hover:bg-[#F3F4F6] transition-colors cursor-pointer">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
              crew.status === 'On Site' ? 'bg-[#FFF4ED]' : 'bg-[#F0FDF4]'
            }`}>
              <HardHat className={`w-5 h-5 ${crew.status === 'On Site' ? 'text-[#FD5000]' : 'text-[#10B981]'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium text-[#1C1E21]">{crew.name}</p>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-[10px] text-[#6B7280]">{crew.rating}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#9CA3AF]">
                  <Users className="w-3 h-3 inline mr-0.5" />{crew.members} members
                </span>
                <span className="text-[11px] text-[#9CA3AF]">·</span>
                <span className="text-[11px] text-[#9CA3AF]">{crew.activeJob}</span>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
              crew.status === 'On Site' 
                ? 'bg-[#FFF4ED] text-[#FD5000]' 
                : 'bg-[#F0FDF4] text-[#10B981]'
            }`}>
              {crew.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
