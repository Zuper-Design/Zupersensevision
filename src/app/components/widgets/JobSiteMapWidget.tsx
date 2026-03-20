import { MapPin, LayoutGrid, Map } from 'lucide-react';
import { useState } from 'react';

type JobStatus = 'complete' | 'inProgress' | 'delayed' | 'urgent';

interface JobSite {
  id: number;
  x: number;
  y: number;
  address: string;
  crew: string;
  type: string;
  status: JobStatus;
}

const jobSites: JobSite[] = [
  { id: 1, x: 30, y: 22, address: '4521 Mesa Ridge Dr', crew: 'Crew Alpha', type: 'Re-roof', status: 'delayed' },
  { id: 2, x: 55, y: 42, address: '1287 Pacific Hwy', crew: 'Crew Bravo', type: 'Commercial Flat', status: 'complete' },
  { id: 3, x: 68, y: 25, address: '890 Sunset Cliffs Blvd', crew: 'Crew Charlie', type: 'Storm Repair', status: 'inProgress' },
  { id: 4, x: 78, y: 52, address: '3345 El Cajon Blvd', crew: 'Crew Delta', type: 'Tile Replace', status: 'complete' },
  { id: 5, x: 25, y: 58, address: '2100 Garnet Ave', crew: 'Crew Alpha', type: 'Inspection', status: 'urgent' },
  { id: 6, x: 42, y: 72, address: '7722 Miramar Rd', crew: 'Crew Bravo', type: 'Tear-off', status: 'complete' },
  { id: 7, x: 82, y: 72, address: '445 Broadway', crew: 'Crew Echo', type: 'Gutter Install', status: 'inProgress' },
  { id: 8, x: 60, y: 65, address: '1560 India St', crew: 'Crew Charlie', type: 'Leak Repair', status: 'complete' },
  { id: 9, x: 15, y: 40, address: '3200 Rosecrans St', crew: 'Crew Delta', type: 'Re-roof', status: 'inProgress' },
  { id: 10, x: 48, y: 15, address: '920 Kline St', crew: 'Crew Echo', type: 'Repair', status: 'complete' },
  { id: 11, x: 88, y: 38, address: '6640 Mission Gorge', crew: 'Crew Alpha', type: 'Inspection', status: 'inProgress' },
  { id: 12, x: 35, y: 48, address: '1455 Fern St', crew: 'Crew Bravo', type: 'Shingle Replace', status: 'delayed' },
];

const statusConfig: Record<JobStatus, { color: string; ring: string; label: string }> = {
  complete:   { color: '#10B981', ring: '#10B98130', label: 'Complete' },
  inProgress: { color: '#6366F1', ring: '#6366F130', label: 'In Progress' },
  delayed:    { color: '#F59E0B', ring: '#F59E0B30', label: 'Delayed' },
  urgent:     { color: '#EF4444', ring: '#EF444430', label: 'Urgent' },
};

export const JobSiteMapWidget = () => {
  const [hoveredSite, setHoveredSite] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('map');

  const counts = {
    complete: jobSites.filter(s => s.status === 'complete').length,
    inProgress: jobSites.filter(s => s.status === 'inProgress').length,
    delayed: jobSites.filter(s => s.status === 'delayed').length,
    urgent: jobSites.filter(s => s.status === 'urgent').length,
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#EEF2FF] flex items-center justify-center">
            <MapPin className="w-[18px] h-[18px] text-[#6366F1]" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-[#1C1E21] leading-tight">Active Job Sites</h3>
            <p className="text-[12px] text-[#9CA3AF]">{jobSites.length} locations today</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#F8F9FB] rounded-lg p-0.5 border border-[#E6E8EC]">
            <button
              onClick={(e) => { e.stopPropagation(); setViewMode('grid'); }}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setViewMode('map'); }}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}
            >
              <Map className="w-3.5 h-3.5 text-[#6B7280]" />
            </button>
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-[12px] font-medium text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            View Map
          </button>
        </div>
      </div>

      {/* Map area */}
      <div className="relative mx-4 mb-4 h-[200px] bg-[#F8FAFB] rounded-xl overflow-hidden border border-[#F0F1F3]">
        {/* Subtle grid */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {[...Array(6)].map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={`${(i + 1) * 16.66}%`} x2="100%" y2={`${(i + 1) * 16.66}%`} stroke="#E9ECEF" strokeWidth="0.8" />
          ))}
          {[...Array(8)].map((_, i) => (
            <line key={`v-${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke="#E9ECEF" strokeWidth="0.8" />
          ))}
        </svg>

        {/* Job site pins */}
        {jobSites.map((site) => {
          const cfg = statusConfig[site.status];
          const isHovered = hoveredSite === site.id;
          return (
            <div
              key={site.id}
              className="absolute z-10"
              style={{ left: `${site.x}%`, top: `${site.y}%`, transform: 'translate(-50%, -50%)' }}
              onMouseEnter={(e) => { e.stopPropagation(); setHoveredSite(site.id); }}
              onMouseLeave={(e) => { e.stopPropagation(); setHoveredSite(null); }}
            >
              {/* Outer ring */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform"
                style={{
                  backgroundColor: cfg.ring,
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                {/* Inner circle with icon */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: cfg.color }}
                >
                  <MapPin className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none">
                  <div className="bg-[#1C1E21] text-white rounded-lg px-3 py-2 shadow-xl min-w-[150px]">
                    <p className="text-[10px] font-semibold mb-0.5">{site.address}</p>
                    <p className="text-[9px] opacity-70 mb-1">{site.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] opacity-60">{site.crew}</span>
                      <span
                        className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${cfg.color}30`, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1C1E21]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom legend */}
      <div className="border-t border-[#E6E8EC]">
        <div className="grid grid-cols-4 divide-x divide-[#E6E8EC]">
          {([
            { status: 'complete' as const, count: counts.complete },
            { status: 'inProgress' as const, count: counts.inProgress },
            { status: 'delayed' as const, count: counts.delayed },
            { status: 'urgent' as const, count: counts.urgent },
          ]).map((item) => {
            const cfg = statusConfig[item.status];
            return (
              <div key={item.status} className="flex items-center gap-2 px-4 py-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
                <span className="text-[12px] text-[#1C1E21]">
                  <span className="font-semibold">{item.count}</span>{' '}
                  <span className="text-[#6B7280]">{cfg.label}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
