import { Briefcase, FileText, ChevronDown } from 'lucide-react';

const tabs = [
  { icon: Briefcase, label: 'Job - #JN-245678', active: true },
  { icon: FileText, label: 'Invoice- #771233', active: false },
  { icon: FileText, label: 'Invoice- #771233', active: false },
  { icon: FileText, label: 'Invoice- #771233', active: false },
  { icon: FileText, label: 'Invoice- #771233', active: false },
  { icon: FileText, label: 'Invoice- #771233', active: false },
];

export function TopNavbar() {
  return (
    <div className="px-6 py-4 flex items-center gap-3">
      {tabs.slice(0, 2).map((tab, index) => {
        const Icon = tab.icon;
        return (
          <button
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              tab.active
                ? 'bg-amber-100 text-neutral-900'
                : 'bg-white text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}