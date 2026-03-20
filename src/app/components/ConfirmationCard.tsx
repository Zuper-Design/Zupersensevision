import React, { useState } from 'react';
import { Check, Briefcase, Users, Building2, FileText, Receipt, ArrowRight, Edit3, Copy, RefreshCw, ThumbsUp, ThumbsDown, MoreVertical, ExternalLink, X, FolderKanban, Home, Truck, PackageSearch, Package, Wrench, FileSignature, Monitor, Radar } from 'lucide-react';

type ModuleType = 'job' | 'customer' | 'organization' | 'quote' | 'invoice' | 'project' | 'property' | 'vendor' | 'material request' | 'part' | 'service' | 'contract' | 'asset';

interface DetailField {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ConfirmationCardProps {
  moduleType: ModuleType;
  moduleName: string;
  fields: DetailField[];
  onViewDetails: () => void;
  onSecondaryAction: () => void;
  secondaryActionLabel?: string;
}

const moduleConfig = {
  job: {
    icon: Briefcase,
    color: '#6366F1',
    bgColor: '#EEF2FF',
  },
  customer: {
    icon: Users,
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  organization: {
    icon: Building2,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
  quote: {
    icon: FileText,
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
  },
  invoice: {
    icon: Receipt,
    color: '#EF4444',
    bgColor: '#FEF2F2',
  },
  project: {
    icon: FolderKanban,
    color: '#6366F1',
    bgColor: '#EEF2FF',
  },
  property: {
    icon: Home,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
  vendor: {
    icon: Truck,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
  'material request': {
    icon: PackageSearch,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
  part: {
    icon: Package,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
  service: {
    icon: Wrench,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
  contract: {
    icon: FileSignature,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
  asset: {
    icon: Monitor,
    color: '#F59E0B',
    bgColor: '#FFF7ED',
  },
};

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  moduleType,
  moduleName,
  fields,
  onViewDetails,
  onSecondaryAction,
  secondaryActionLabel = 'Create Another',
}) => {
  const config = moduleConfig[moduleType];
  const Icon = config.icon;
  const [showMenu, setShowMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="w-full max-w-[480px] bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#E6E8EC]">
          <div className="flex items-center justify-between">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-2.5">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: config.bgColor }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: config.color }} />
              </div>
              <h3 className="text-[15px] font-semibold text-[#1C1E21]">
                {fields.find(f => f.highlight || f.label.toLowerCase().includes('name') || f.label.toLowerCase().includes('title'))?.value || moduleName}
              </h3>
            </div>

            {/* Right: Active Chip + Menu + Expand */}
            <div className="flex items-center gap-2">
              {/* Active Chip */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#ECFDF5] rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                <span className="text-[11px] font-medium text-[#10B981]">Active</span>
              </div>

              {/* Three Dots Menu */}
              <div className="relative">
                

                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-[#E6E8EC] shadow-lg py-1 z-20">
                      <button className="w-full px-4 py-2 text-left text-[13px] text-[#1C1E21] hover:bg-[#F8F9FB] transition-colors">
                        Add to canvas
                      </button>
                      <button className="w-full px-4 py-2 text-left text-[13px] text-[#EF4444] hover:bg-[#FEF2F2] transition-colors">
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Expand Button */}
              <button
                onClick={() => setIsExpanded(true)}
                className="p-1.5 hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        

        {/* Body - Compact Key Details */}
        <div className="px-5 py-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {fields
              .filter(field => {
                // Exclude the title/name field since it's shown in the header
                const isTitleField = field.label.toLowerCase().includes('name') || 
                                   field.label.toLowerCase().includes('title') ||
                                   field.highlight;
                return !isTitleField;
              })
              .map((field, index) => (
              <div key={index} className="flex flex-col gap-1.5">
                <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wide">
                  {field.label}
                </span>
                <span className="text-[14px] text-[#1C1E21]">
                  {field.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded View Panel */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/20"
            onClick={() => setIsExpanded(false)}
          />
          
          {/* Panel */}
          <div className="relative w-[75%] h-full bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="px-6 py-4 border-b border-[#E6E8EC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.bgColor }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div>
                  <h2 className="text-[17px] font-semibold text-[#1C1E21]">
                    {moduleName} Details
                  </h2>
                  <p className="text-[12px] text-[#6B7280]">View and edit information</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-auto-hide">
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2 pb-6 border-b border-[#E6E8EC]">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] rounded-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                    <span className="text-[12px] font-medium text-[#10B981]">Active</span>
                  </div>
                </div>

                {/* Fields Display */}
                <div className="space-y-5">
                  <h3 className="text-[15px] font-semibold text-[#1C1E21]">Information</h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                    {fields.map((field, index) => (
                      <div key={index} className="space-y-1.5">
                        <label className="text-[12px] text-[#6B7280] font-medium">
                          {field.label}
                        </label>
                        <div className="px-4 py-2.5 bg-[#F8F9FB] border border-[#E6E8EC] rounded-lg">
                          <p className={`text-[14px] ${
                            field.highlight 
                              ? 'font-semibold text-[#1C1E21]' 
                              : 'text-[#1C1E21]'
                          }`}>
                            {field.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="space-y-5 pt-6 border-t border-[#E6E8EC]">
                  <h3 className="text-[15px] font-semibold text-[#1C1E21]">Additional Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] text-[#6B7280] font-medium">
                        Notes
                      </label>
                      <div className="px-4 py-3 bg-[#F8F9FB] border border-[#E6E8EC] rounded-lg min-h-[100px]">
                        <p className="text-[14px] text-[#6B7280]">No notes added</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="px-6 py-4 border-t border-[#E6E8EC] flex items-center justify-between bg-[#F8F9FB]">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white border border-[#E6E8EC] rounded-lg text-[13px] font-medium text-[#1C1E21] hover:bg-[#F8F9FB] transition-colors">
                  Edit
                </button>
                <button className="px-4 py-2 bg-[#6366F1] rounded-lg text-[13px] font-medium text-white hover:bg-[#5558E3] transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};