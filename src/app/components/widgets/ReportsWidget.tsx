import { FileText, Download, Eye } from 'lucide-react';

export const ReportsWidget = () => {
  const reports = [
    { name: 'February P&L Statement', date: 'Feb 20, 2026', size: '1.4 MB', type: 'Financial' },
    { name: 'Crew Productivity Report', date: 'Feb 18, 2026', size: '2.1 MB', type: 'Operations' },
    { name: 'Material Cost Analysis', date: 'Feb 15, 2026', size: '980 KB', type: 'Procurement' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Financial': return 'bg-[#FFF4ED] text-[#FD5000]';
      case 'Operations': return 'bg-[#EFF6FF] text-[#3B82F6]';
      case 'Procurement': return 'bg-[#F0FDF4] text-[#10B981]';
      default: return 'bg-[#F8F9FB] text-[#6B7280]';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[#1C1E21] mb-1">Recent Reports</h3>
          <p className="text-[12px] text-[#6B7280]">Business reports & analytics</p>
        </div>
        <button className="text-[12px] font-medium text-[#221E1F] hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {reports.map((report, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FB] hover:bg-[#F3F4F6] transition-colors group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-[#FD5000]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#1C1E21] truncate">{report.name}</p>
              <div className="flex items-center gap-2">
                <p className="text-[11px] text-[#6B7280]">{report.date} · {report.size}</p>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${getTypeColor(report.type)}`}>
                  {report.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center">
                <Eye className="w-4 h-4 text-[#6B7280]" />
              </button>
              <button className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center">
                <Download className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
