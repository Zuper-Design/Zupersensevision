import { AlertCircle, TrendingUp, Clock, Receipt } from 'lucide-react';

export const AttentionCardWidget = () => {
  const alerts = [
    {
      title: 'Stuck Quotes',
      value: '3 quotes',
      subtitle: 'Potential revenue: $84,000 — oldest is 12 days',
      action: 'Review & follow up',
      color: 'bg-[#FFF4ED]',
      iconColor: 'text-[#F59E0B]',
      icon: AlertCircle,
    },
    {
      title: 'Jobs Behind SLA',
      value: '4 jobs',
      subtitle: 'Mostly re-roofing — avg 2.3 days overdue',
      action: 'View delays',
      color: 'bg-[#FEF2F2]',
      iconColor: 'text-[#EF4444]',
      icon: Clock,
    },
    {
      title: 'Pending Invoices',
      value: '$42,600',
      subtitle: '7 invoices overdue — 3 past 30 days',
      action: 'Collect payments',
      color: 'bg-[#F5F3FF]',
      iconColor: 'text-[#8B5CF6]',
      icon: Receipt,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {alerts.map((alert, index) => {
        const Icon = alert.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 transition-all cursor-pointer group card-hover-elevate"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full ${alert.color} flex items-center justify-center ${alert.iconColor} flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-[#1C1E21] mb-0.5">{alert.title}</h4>
                <p className="text-[18px] font-bold text-[#1C1E21] leading-tight">{alert.value}</p>
              </div>
            </div>
            <p className="text-[11px] text-[#6B7280] mb-3">{alert.subtitle}</p>
            <button className="text-[12px] font-semibold text-white bg-[#221E1F] px-3 py-1.5 rounded-lg hover:bg-[#3A3D42] transition-colors w-full">
              {alert.action}
            </button>
          </div>
        );
      })}
    </div>
  );
};