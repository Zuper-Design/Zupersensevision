import { ArrowUpDown } from 'lucide-react';

const jobs = [
  { title: '4-yr-job-test', date: '05-May-2026', wo: '23781', type: 'NEW', priority: 'URGENT' },
  { title: '3yr-job', date: '05-May-2026', wo: '26338', type: 'NEW', priority: 'LOW' },
  { title: '4-yr-job-test', date: '04-May-2026', wo: '23780', type: 'NEW', priority: 'URGENT' },
  { title: '3yr-job', date: '04-May-2026', wo: '26337', type: 'NEW', priority: 'LOW' },
  { title: 'week_mon_1yr', date: '04-May-2026', wo: '98500', type: 'NEW', priority: 'LOW' },
];

const columns = [
  { key: 'title', label: 'Job Title' },
  { key: 'date', label: 'Scheduled Start Date' },
  { key: 'wo', label: 'Work Order #', align: 'right' as const },
  { key: 'type', label: 'Job Type' },
  { key: 'priority', label: 'Job Priority' },
];

const priorityChip = (p: string) => {
  if (p === 'URGENT') return { bg: '#FEE2E2', color: '#B91C1C' };
  if (p === 'LOW') return { bg: '#DCFCE7', color: '#166534' };
  return { bg: '#FEF3C7', color: '#92400E' };
};

const typeChip = () => ({ bg: '#DCFCE7', color: '#166534' });

export function UnassignedJobsCard() {
  return (
    <div className="rounded-2xl border border-[#E6E8EC] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px] text-[#1C1E21]">
          <thead>
            <tr className="border-b border-[#F0F1F3]">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 font-medium text-[#6B7280] text-[12px] whitespace-nowrap"
                  style={{ textAlign: col.align ?? 'left' }}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3 h-3 text-[#C0C4CC]" />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((j, i) => {
              const pChip = priorityChip(j.priority);
              const tChip = typeChip();
              return (
                <tr key={i} className="border-b border-[#F0F1F3] last:border-b-0 hover:bg-[#FAFAFB] transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a className="text-[#2563EB] underline hover:text-[#1D4ED8]" href="#" onClick={(e) => e.preventDefault()}>{j.title}</a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[#1C1E21]">{j.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-[#1C1E21]">{j.wo}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ background: tChip.bg, color: tChip.color }}>
                      {j.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold" style={{ background: pChip.bg, color: pChip.color }}>
                      {j.priority}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
