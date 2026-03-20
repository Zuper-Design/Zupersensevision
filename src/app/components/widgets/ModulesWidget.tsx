import { Briefcase, Users, FileText, Package, Wrench, Receipt, ClipboardList, Building2, MapPin, Truck, Box, Shield, HardHat } from 'lucide-react';

export const ModulesWidget = () => {
  const modules = [
    { icon: Briefcase, label: 'Jobs', count: 24, color: 'text-[#FD5000]', bg: 'bg-[#FFF4ED]' },
    { icon: ClipboardList, label: 'Projects', count: 8, color: 'text-[#3B82F6]', bg: 'bg-[#EFF6FF]' },
    { icon: Users, label: 'Customers', count: 156, color: 'text-[#10B981]', bg: 'bg-[#F0FDF4]' },
    { icon: Building2, label: 'Organizations', count: 42, color: 'text-[#8B5CF6]', bg: 'bg-[#F5F3FF]' },
    { icon: MapPin, label: 'Properties', count: 89, color: 'text-[#F59E0B]', bg: 'bg-[#FFF7ED]' },
    { icon: Truck, label: 'Vendors', count: 18, color: 'text-[#6366F1]', bg: 'bg-[#EEF2FF]' },
    { icon: Package, label: 'Materials', count: 5, color: 'text-[#EC4899]', bg: 'bg-[#FDF2F8]' },
    { icon: Box, label: 'Parts', count: 312, color: 'text-[#14B8A6]', bg: 'bg-[#F0FDFA]' },
    { icon: Wrench, label: 'Services', count: 15, color: 'text-[#F97316]', bg: 'bg-[#FFF7ED]' },
    { icon: FileText, label: 'Quotes', count: 31, color: 'text-[#0EA5E9]', bg: 'bg-[#F0F9FF]' },
    { icon: Receipt, label: 'Invoices', count: 67, color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]' },
    { icon: Shield, label: 'Contracts', count: 12, color: 'text-[#84CC16]', bg: 'bg-[#F7FEE7]' },
    { icon: HardHat, label: 'Assets', count: 45, color: 'text-[#A855F7]', bg: 'bg-[#FAF5FF]' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Business Modules</h3>
          <p className="text-[12px] text-[#6B7280]">Quick access to all entities</p>
        </div>
        <button className="text-[12px] font-medium text-[#221E1F] hover:underline">
          Manage
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.label}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer group text-left"
            >
              <div className={`w-8 h-8 rounded-lg ${mod.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${mod.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[#1C1E21]">{mod.label}</p>
                <p className="text-[10px] text-[#9CA3AF]">{mod.count} items</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
