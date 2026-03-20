import { useState, useRef, useEffect } from 'react';
import { X, Pin, Pencil, Trash2, GripVertical, PlusCircle, FileText, Filter, Sparkles } from 'lucide-react';

interface PinnedFilter {
  id: string;
  name: string;
  value: string;
  isPinned: boolean;
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anomalyFilter?: string | null;
  anomalyFilterLabel?: string;
  anomalyFilterCount?: number;
  onClearAnomalyFilter?: () => void;
}

export function FilterPanel({ isOpen, onClose, anomalyFilter, anomalyFilterLabel, anomalyFilterCount, onClearAnomalyFilter }: FilterPanelProps) {
  const [filterMode, setFilterMode] = useState<'AND' | 'OR'>('AND');
  const [pinnedFilters, setPinnedFilters] = useState<PinnedFilter[]>([
    { id: '1', name: 'Scheduled Date Range', value: '', isPinned: true },
    { id: '2', name: 'Job Priority', value: '', isPinned: true },
  ]);
  const [activeFilters, setActiveFilters] = useState<PinnedFilter[]>([]);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const addDropdownRef = useRef<HTMLDivElement>(null);

  const totalPinned = pinnedFilters.length;
  const activePinnedCount = pinnedFilters.filter(f => f.isPinned).length;

  const availableFilters = [
    'Status',
    'Category',
    'Customer',
    'Users / Teams',
    'Service Address',
    'Due Date',
    'Work Order Number',
    'Job Title',
    'Created Date',
  ];

  // Close add dropdown on outside click
  useEffect(() => {
    if (!showAddDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target as Node)) {
        setShowAddDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAddDropdown]);

  const handleRemovePinnedFilter = (id: string) => {
    setPinnedFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleTogglePin = (id: string) => {
    setPinnedFilters(prev =>
      prev.map(f => f.id === id ? { ...f, isPinned: !f.isPinned } : f)
    );
  };

  const handleAddFilter = (name: string) => {
    const newFilter: PinnedFilter = {
      id: Date.now().toString(),
      name,
      value: '',
      isPinned: false,
    };
    setActiveFilters(prev => [...prev, newFilter]);
    setShowAddDropdown(false);
  };

  const handleRemoveActiveFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div
      className="flex-shrink-0 flex flex-col"
      style={{
        width: isOpen ? '420px' : '0px',
        minWidth: isOpen ? '420px' : '0px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        borderLeft: isOpen ? '1px solid #E6E8EC' : 'none',
        background: '#FFFFFF',
        fontFamily: 'DM Sans, system-ui, sans-serif',
      }}
    >
      {isOpen && (
        <div className="flex flex-col h-full w-[420px]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E8EC] flex-shrink-0" style={{ background: '#FFFFFF' }}>
            <div className="flex items-center gap-3">
              <span className="text-[15px] text-[#1C1E21]" style={{ fontWeight: 600 }}>Filters</span>
              {/* AND / OR toggle */}
              <div className="flex items-center bg-[#F3F4F6] rounded-md p-0.5">
                <button
                  onClick={() => setFilterMode('AND')}
                  className={`px-2.5 py-0.5 rounded text-[11px] transition-all ${
                    filterMode === 'AND'
                      ? 'bg-white shadow-sm text-[#1C1E21]'
                      : 'text-[#6B7280] hover:text-[#1C1E21]'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  AND
                </button>
                <button
                  onClick={() => setFilterMode('OR')}
                  className={`px-2.5 py-0.5 rounded text-[11px] transition-all ${
                    filterMode === 'OR'
                      ? 'bg-white shadow-sm text-[#1C1E21]'
                      : 'text-[#6B7280] hover:text-[#1C1E21]'
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  OR
                </button>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {/* Pinned Filters Section */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>Pinned Filters</span>
                <span className="flex items-center gap-1 text-[12px] text-[#10B981]" style={{ fontWeight: 600 }}>
                  <Pin className="w-3 h-3" />
                  {activePinnedCount} / {totalPinned}
                </span>
              </div>

              {/* Pinned filter items */}
              <div className="space-y-3">
                {pinnedFilters.map((filter) => (
                  <div
                    key={filter.id}
                    className="bg-[#FAFBFC] border border-[#E6E8EC] rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-[#D1D5DB] cursor-grab flex-shrink-0" />
                        <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>
                          {filter.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <button
                          onClick={() => handleTogglePin(filter.id)}
                          className={`p-1 rounded hover:bg-[#E6E8EC] transition-colors ${
                            filter.isPinned ? 'text-[#10B981]' : 'text-[#9CA3AF]'
                          }`}
                          title={filter.isPinned ? 'Unpin' : 'Pin'}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-[#E6E8EC] transition-colors text-[#9CA3AF] hover:text-[#6B7280]"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemovePinnedFilter(filter.id)}
                          className="p-1 rounded hover:bg-[#FEE2E2] transition-colors text-[#EF4444]"
                          title="Remove"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="pl-[22px]">
                      <span className="text-[12px] text-[#9CA3AF]">Choose condition and value</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sense AI Filter (when active) */}
            {anomalyFilter && anomalyFilterLabel && (
              <>
                <div className="mx-6 my-4 border-t border-[#E6E8EC]" />
                <div className="px-6 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                      <span className="text-[13px] text-[#6B7280]" style={{ fontWeight: 500 }}>Sense AI Filter</span>
                    </div>
                    <span className="text-[11px] text-[#D97706]" style={{ fontWeight: 500 }}>Active</span>
                  </div>
                  <div
                    className="rounded-lg px-4 py-3"
                    style={{
                      background: 'linear-gradient(135deg, #FFF7ED, #FFFBEB)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(245, 158, 11, 0.15)' }}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                        </div>
                        <div>
                          <div className="text-[13px] text-[#92400E]" style={{ fontWeight: 600 }}>
                            {anomalyFilterLabel}
                          </div>
                          <div className="text-[11px] text-[#B45309]">
                            {anomalyFilterCount} job{anomalyFilterCount !== 1 ? 's' : ''} matched
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => onClearAnomalyFilter?.()}
                        className="p-1 rounded hover:bg-white/60 transition-colors text-[#92400E]"
                        title="Remove Sense filter"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="mx-6 my-4 border-t border-[#E6E8EC]" />

            {/* Filters Section */}
            <div className="px-6 pb-5">
              <span className="text-[13px] text-[#6B7280] block mb-4" style={{ fontWeight: 500 }}>Filters</span>

              {/* Active filters */}
              {activeFilters.length > 0 && (
                <div className="space-y-3 mb-4">
                  {activeFilters.map((filter) => (
                    <div
                      key={filter.id}
                      className="bg-[#FAFBFC] border border-[#E6E8EC] rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-3.5 h-3.5 text-[#D1D5DB] cursor-grab flex-shrink-0" />
                          <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>
                            {filter.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <button
                            className="p-1 rounded hover:bg-[#E6E8EC] transition-colors text-[#9CA3AF] hover:text-[#10B981]"
                            title="Pin"
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-[#E6E8EC] transition-colors text-[#9CA3AF] hover:text-[#6B7280]"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveActiveFilter(filter.id)}
                            className="p-1 rounded hover:bg-[#FEE2E2] transition-colors text-[#EF4444]"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="pl-[22px]">
                        <span className="text-[12px] text-[#9CA3AF]">Choose condition and value</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {activeFilters.length === 0 && (
                <div className="border border-dashed border-[#E6E8EC] rounded-lg py-10 px-5 flex flex-col items-center justify-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 text-[#9CA3AF]" />
                  </div>
                  <span className="text-[12px] text-[#9CA3AF] text-center leading-relaxed">
                    Add any relevant filters or drag in pinned filters
                  </span>
                </div>
              )}

              {/* Add Filter button */}
              <div className="relative" ref={addDropdownRef}>
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="flex items-center gap-2 text-[13px] text-[#10B981] hover:text-[#059669] transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <PlusCircle className="w-4 h-4" />
                  Add Filter
                </button>

                {/* Add filter dropdown */}
                {showAddDropdown && (
                  <div className="absolute bottom-full left-0 mb-1 w-[220px] bg-white rounded-lg border border-[#E6E8EC] shadow-lg py-1 z-10">
                    <div className="px-3 py-2 border-b border-[#E6E8EC]">
                      <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 600 }}>
                        Select a filter
                      </span>
                    </div>
                    <div className="max-h-[240px] overflow-y-auto scrollbar-thin">
                      {availableFilters.map((name) => {
                        const alreadyUsed =
                          pinnedFilters.some(f => f.name === name) ||
                          activeFilters.some(f => f.name === name);
                        return (
                          <button
                            key={name}
                            onClick={() => !alreadyUsed && handleAddFilter(name)}
                            disabled={alreadyUsed}
                            className={`w-full text-left px-3 py-2 text-[13px] transition-colors ${
                              alreadyUsed
                                ? 'text-[#D1D5DB] cursor-not-allowed'
                                : 'text-[#1C1E21] hover:bg-[#F8F9FB] cursor-pointer'
                            }`}
                            style={{ fontWeight: 400 }}
                          >
                            {name}
                            {alreadyUsed && <span className="text-[11px] text-[#D1D5DB] ml-2">(in use)</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
