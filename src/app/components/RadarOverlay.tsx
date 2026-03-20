import { X, MapPin, CheckSquare, Cloud, Calendar, Users, AlertTriangle, GripVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RadarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RadarOverlay({ isOpen, onClose }: RadarOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Overlay Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-[75%] bg-white z-50 shadow-[-8px_0_32px_rgba(0,0,0,0.12)] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#E6E8EC] px-8 py-5 flex items-center justify-between z-10">
              <div>
                <h2 className="text-[20px] font-semibold text-[#1C1E21]">Radar</h2>
                <p className="text-[13px] text-[#6B7280] mt-0.5">Your pinned insights and widgets</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150"
                aria-label="Close Radar"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Weather Widget */}
                <div className="bg-white rounded-[12px] border border-[#E6E8EC]/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden group relative hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(255,107,53,0.08)]">
                  {/* Card Controls */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button className="p-1.5 rounded-md bg-white/90 hover:bg-white border border-[#E6E8EC] shadow-sm transition-colors duration-150 cursor-grab active:cursor-grabbing" aria-label="Rearrange">
                      <GripVertical className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button className="p-1.5 rounded-md bg-white/90 hover:bg-white border border-[#E6E8EC] shadow-sm transition-colors duration-150" aria-label="Remove" onClick={() => alert('Remove card')}>
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button>
                  </div>
                  
                  <div className="relative h-[240px] bg-gradient-to-br from-[#4A90E2] via-[#5FA3E8] to-[#7AB8EE] p-5">
                    {/* Weather background effect */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-16 h-16 bg-white/30 rounded-full blur-xl"></div>
                      <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
                    </div>
                    
                    <div className="relative flex flex-col h-full">
                      <div className="flex items-start justify-between mb-auto">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Cloud className="w-4 h-4 text-white/90" />
                            <span className="text-[12px] text-white/90 font-medium">Weather</span>
                          </div>
                          <p className="text-[14px] text-white/80">Brooklyn, NY</p>
                        </div>
                        <div className="text-white/70 text-[32px] leading-none">☁️</div>
                      </div>
                      
                      <div className="flex items-end gap-1">
                        <span className="text-[56px] font-light text-white leading-none">72</span>
                        <span className="text-[24px] text-white/80 mb-2">°F</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-white/70">H</span>
                          <span className="text-[14px] text-white font-medium">78°</span>
                        </div>
                        <div className="w-px h-3 bg-white/30"></div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] text-white/70">L</span>
                          <span className="text-[14px] text-white font-medium">64°</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 5-day forecast */}
                  <div className="p-4 flex items-center justify-between gap-2">
                    {[
                      { day: 'TUE', icon: '☀️', high: 78, low: 65 },
                      { day: 'WED', icon: '⛅', high: 81, low: 66 },
                      { day: 'THU', icon: '🌧️', high: 76, low: 62 },
                      { day: 'FRI', icon: '☀️', high: 80, low: 68 },
                      { day: 'SAT', icon: '⛅', high: 77, low: 64 },
                    ].map((day, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                        <span className="text-[11px] text-[#6B7280] font-medium">{day.day}</span>
                        <span className="text-[18px]">{day.icon}</span>
                        <div className="flex flex-col items-center">
                          <span className="text-[13px] text-[#1C1E21] font-medium">{day.high}°</span>
                          <span className="text-[12px] text-[#9CA3AF]">{day.low}°</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Jobs Checklist */}
                <div className="bg-white rounded-[12px] border border-[#E6E8EC]/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 group relative hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(255,107,53,0.08)]">
                  {/* Card Controls */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150 cursor-grab active:cursor-grabbing" aria-label="Rearrange">
                      <GripVertical className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150" aria-label="Remove" onClick={() => alert('Remove card')}>
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-[#6366F1]/10">
                      <CheckSquare className="w-4 h-4 text-[#6366F1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-[#1C1E21]">Today's Jobs</h3>
                      <p className="text-[12px] text-[#6B7280]">Tuesday, Feb 17</p>
                    </div>
                    <span className="text-[12px] text-[#6B7280] bg-[#F8F9FB] px-2 py-1 rounded-md">4/7</span>
                  </div>
                  
                  <div className="space-y-2.5">
                    {[
                      { title: 'Roof inspection - 245 Oak St', time: '9:00 AM', done: true, color: 'text-[#10B981]' },
                      { title: 'Shingle replacement - Main Ave', time: '11:30 AM', done: true, color: 'text-[#10B981]' },
                      { title: 'Client consultation - Downtown', time: '2:00 PM', done: true, color: 'text-[#10B981]' },
                      { title: 'Emergency repair - Elm Street', time: '3:30 PM', done: true, color: 'text-[#10B981]' },
                      { title: 'Team meeting', time: '5:00 PM', done: false, color: 'text-[#F59E0B]' },
                      { title: 'Quote review - Harbor Plaza', time: '6:00 PM', done: false, color: 'text-[#F59E0B]' },
                      { title: 'Material order follow-up', time: '7:00 PM', done: false, color: 'text-[#F59E0B]' },
                    ].map((job, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${job.done ? 'bg-[#10B981]' : 'bg-[#F59E0B]'}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-medium ${job.done ? 'text-[#9CA3AF] line-through' : 'text-[#1C1E21]'}`}>
                            {job.title}
                          </p>
                          <p className="text-[12px] text-[#9CA3AF]">{job.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Job Sites Map */}
                <div className="col-span-2 bg-white rounded-[12px] border border-[#E6E8EC]/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden group relative">
                  {/* Card Controls */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150 cursor-grab active:cursor-grabbing" aria-label="Rearrange">
                      <GripVertical className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150" aria-label="Remove" onClick={() => alert('Remove card')}>
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button>
                  </div>
                  
                  <div className="p-5 border-b border-[#E6E8EC]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#6366F1]/10">
                        <MapPin className="w-4 h-4 text-[#6366F1]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[14px] font-semibold text-[#1C1E21]">Active Job Sites</h3>
                        <p className="text-[12px] text-[#6B7280]">12 locations today</p>
                      </div>
                      <button className="text-[13px] text-[#6366F1] hover:text-[#5558E3] font-medium">
                        View Map
                      </button>
                    </div>
                  </div>
                  
                  {/* Mock Map */}
                  <div className="relative h-[320px] bg-gradient-to-br from-[#E8EEF7] to-[#F3F6FC]">
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                        {Array.from({ length: 64 }).map((_, i) => (
                          <div key={i} className="border border-[#6366F1]/10"></div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Location markers */}
                    <div className="absolute top-[20%] left-[30%] w-8 h-8 bg-[#EF4444] rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-[45%] left-[55%] w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-[65%] left-[25%] w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-[30%] left-[70%] w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute top-[55%] left-[80%] w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center shadow-lg">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    
                    {/* Status overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                      <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-[#E6E8EC]/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                          <span className="text-[12px] text-[#1C1E21] font-medium">5 Complete</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-[#E6E8EC]/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#6366F1]"></div>
                          <span className="text-[12px] text-[#1C1E21] font-medium">4 In Progress</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-[#E6E8EC]/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                          <span className="text-[12px] text-[#1C1E21] font-medium">2 Delayed</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-[#E6E8EC]/50">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#EF4444]"></div>
                          <span className="text-[12px] text-[#1C1E21] font-medium">1 Urgent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weather Alert Card */}
                <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-[12px] border border-[#F59E0B]/20 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 group relative">
                  {/* Card Controls */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150 cursor-grab active:cursor-grabbing" aria-label="Rearrange">
                      <GripVertical className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150" aria-label="Remove" onClick={() => alert('Remove card')}>
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white/80">
                      <AlertTriangle className="w-5 h-5 text-[#F59E0B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-[#92400E] mb-1">Weather Alert</h3>
                      <p className="text-[13px] text-[#78350F] leading-relaxed mb-3">
                        Storm may impact Job #482 tomorrow 2 PM
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#78350F]"></div>
                          <span className="text-[12px] text-[#78350F]">High wind risk at Site B</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-[#10B981]"></div>
                          <span className="text-[12px] text-[#78350F]">Safe work window: 7 AM – 1 PM</span>
                        </div>
                      </div>
                      <button className="mt-3 text-[12px] text-[#92400E] font-semibold hover:text-[#78350F] transition-colors">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team Status Card */}
                <div className="bg-white rounded-[12px] border border-[#E6E8EC]/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 group relative hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(255,107,53,0.08)]">
                  {/* Card Controls */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150 cursor-grab active:cursor-grabbing" aria-label="Rearrange">
                      <GripVertical className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150" aria-label="Remove" onClick={() => alert('Remove card')}>
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-[#6366F1]/10">
                      <Users className="w-4 h-4 text-[#6366F1]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[14px] font-semibold text-[#1C1E21]">Team Status</h3>
                      <p className="text-[12px] text-[#6B7280]">12 team members</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#6B7280]">On site</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-[#F8F9FB] rounded-full overflow-hidden">
                          <div className="h-full w-[75%] bg-[#10B981] rounded-full"></div>
                        </div>
                        <span className="text-[13px] font-medium text-[#1C1E21]">9</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#6B7280]">Available</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-[#F8F9FB] rounded-full overflow-hidden">
                          <div className="h-full w-[25%] bg-[#6366F1] rounded-full"></div>
                        </div>
                        <span className="text-[13px] font-medium text-[#1C1E21]">3</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#6B7280]">Off duty</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 bg-[#F8F9FB] rounded-full overflow-hidden">
                          <div className="h-full w-0 bg-[#9CA3AF] rounded-full"></div>
                        </div>
                        <span className="text-[13px] font-medium text-[#1C1E21]">0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Feature Implementation Plan Card */}
                <div className="bg-white rounded-[12px] border border-[#E6E8EC]/70 shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6 group relative hover:border-[#FF6B35]/40 hover:bg-[#FFF4ED] transition-all duration-150 hover:shadow-[0_4px_12px_rgba(255,107,53,0.08)]">
                  {/* Card Controls */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150 cursor-grab active:cursor-grabbing" aria-label="Rearrange">
                      <GripVertical className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button className="p-1.5 rounded-md bg-white hover:bg-[#F8F9FB] border border-[#E6E8EC] shadow-sm transition-colors duration-150" aria-label="Remove" onClick={() => alert('Remove card')}>
                      <Trash2 className="w-4 h-4 text-[#EF4444]" />
                    </button>
                  </div>
                  
                  <div className="mb-5">
                    <h3 className="text-[15px] font-semibold text-[#1C1E21] mb-1">Feature Implementation Plan</h3>
                    <p className="text-[13px] text-[#9CA3AF]">Step-by-step guide for implementing the new authentication system</p>
                  </div>
                  
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[13px] text-[#6B7280]">2 of 8 complete</span>
                      <span className="text-[13px] text-[#6B7280]">25%</span>
                    </div>
                    <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                      <div className="h-full w-[25%] bg-[#6366F1] rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { title: 'Review existing auth flow', done: true },
                      { title: 'Design new token structure', done: true },
                      { title: 'Update API endpoints', done: false },
                      { title: 'Implement refresh tokens', done: false },
                    ].map((task, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[#F9FAFB]">
                        {task.done ? (
                          <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-[#D1D5DB] flex-shrink-0"></div>
                        )}
                        <span className={`text-[14px] ${task.done ? 'text-[#1C1E21]' : 'text-[#6B7280]'} font-medium`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Empty State for Pinned Items */}
              <div className="mt-8 bg-white rounded-[12px] border border-dashed border-[#E6E8EC] p-8 text-center">
                <div className="w-12 h-12 bg-[#F8F9FB] rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-5 h-5 text-[#9CA3AF]" />
                </div>
                <h3 className="text-[14px] font-medium text-[#1C1E21] mb-1">No pinned items yet</h3>
                <p className="text-[13px] text-[#6B7280]">
                  Pin important insights from conversations to keep them handy
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}