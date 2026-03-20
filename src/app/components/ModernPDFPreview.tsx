import { ZoomIn, ZoomOut, Download, Printer, Share2 } from 'lucide-react';
import { useState } from 'react';

export function ModernPDFPreview() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB]">
      {/* Toolbar */}
      <div className="h-14 bg-white border-b border-[#E6E8EC] flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#6B7280]">Page 1 of 2</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-[#F8F9FB] rounded-lg p-1">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1.5 rounded-md hover:bg-white transition-colors duration-150"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-[#6B7280]" />
            </button>
            <span className="text-[13px] text-[#1C1E21] font-medium px-2 min-w-[48px] text-center">
              {zoom}%
            </span>
            <button 
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="p-1.5 rounded-md hover:bg-white transition-colors duration-150"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          <div className="w-px h-6 bg-[#E6E8EC] mx-1" />

          {/* Action Buttons */}
          <button className="p-2 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150" aria-label="Download">
            <Download className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150" aria-label="Print">
            <Printer className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F8F9FB] transition-colors duration-150" aria-label="Share">
            <Share2 className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Document Viewer */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[900px] mx-auto space-y-6">
          {/* Page 1 */}
          <div 
            className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="aspect-[8.5/11] p-16">
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h1 className="text-4xl font-bold text-[#1C1E21] mb-2">Roofing Proposal</h1>
                    <p className="text-[15px] text-[#6B7280]">Premium Solutions Inc.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] text-[#9CA3AF] mb-1">Proposal #2024-0156</p>
                    <p className="text-[13px] text-[#9CA3AF]">February 17, 2026</p>
                  </div>
                </div>
                <div className="w-full h-px bg-[#E6E8EC]" />
              </div>

              {/* Client Information */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-[#1C1E21] mb-4">Client Information</h2>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="text-[14px] text-[#6B7280] w-32">Client Name:</span>
                    <span className="text-[14px] text-[#1C1E21] font-medium">John Anderson</span>
                  </div>
                  <div className="flex">
                    <span className="text-[14px] text-[#6B7280] w-32">Property:</span>
                    <span className="text-[14px] text-[#1C1E21] font-medium">2847 Oak Street, Austin TX 78701</span>
                  </div>
                  <div className="flex">
                    <span className="text-[14px] text-[#6B7280] w-32">Contact:</span>
                    <span className="text-[14px] text-[#1C1E21] font-medium">(512) 555-0147</span>
                  </div>
                </div>
              </div>

              {/* Project Overview */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-[#1C1E21] mb-4">Project Overview</h2>
                <p className="text-[14px] text-[#1C1E21] leading-relaxed mb-4">
                  Complete roof replacement including tear-off of existing asphalt shingles, installation of new 
                  underlayment, and premium architectural shingles. Project includes all necessary flashing, 
                  ridge vents, and gutter system upgrades.
                </p>
                <div className="bg-[#F8F9FB] rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[12px] text-[#6B7280] mb-1">Square Footage</p>
                      <p className="text-[16px] text-[#1C1E21] font-semibold">2,400 sq ft</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#6B7280] mb-1">Timeline</p>
                      <p className="text-[16px] text-[#1C1E21] font-semibold">3-5 days</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#6B7280] mb-1">Warranty</p>
                      <p className="text-[16px] text-[#1C1E21] font-semibold">25 years</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope of Work */}
              <div>
                <h2 className="text-xl font-semibold text-[#1C1E21] mb-4">Scope of Work</h2>
                <div className="space-y-3">
                  {[
                    'Complete tear-off of existing roofing materials',
                    'Inspection and repair of roof decking as needed',
                    'Installation of synthetic underlayment',
                    'Installation of premium architectural shingles',
                    'New ridge vent system for proper ventilation',
                    'Flashing replacement around chimneys and vents'
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#6366F1]" />
                      </div>
                      <span className="text-[14px] text-[#1C1E21]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 */}
          <div 
            className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-200"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            <div className="aspect-[8.5/11] p-16">
              {/* Cost Breakdown */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-[#1C1E21] mb-6">Cost Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-[#E6E8EC]">
                    <div>
                      <p className="text-[14px] text-[#1C1E21] font-medium">Materials</p>
                      <p className="text-[12px] text-[#6B7280]">Premium shingles, underlayment, flashing</p>
                    </div>
                    <span className="text-[15px] text-[#1C1E21] font-semibold">$8,500</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E6E8EC]">
                    <div>
                      <p className="text-[14px] text-[#1C1E21] font-medium">Labor</p>
                      <p className="text-[12px] text-[#6B7280]">Professional installation crew</p>
                    </div>
                    <span className="text-[15px] text-[#1C1E21] font-semibold">$6,200</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E6E8EC]">
                    <div>
                      <p className="text-[14px] text-[#1C1E21] font-medium">Disposal & Cleanup</p>
                      <p className="text-[12px] text-[#6B7280]">Old materials removal and site cleanup</p>
                    </div>
                    <span className="text-[15px] text-[#1C1E21] font-semibold">$1,100</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-[#E6E8EC]">
                    <div>
                      <p className="text-[14px] text-[#1C1E21] font-medium">Permits & Inspections</p>
                      <p className="text-[12px] text-[#6B7280]">City permits and final inspection</p>
                    </div>
                    <span className="text-[15px] text-[#1C1E21] font-semibold">$850</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t-2 border-[#1C1E21]">
                  <div className="flex items-center justify-between">
                    <span className="text-[18px] text-[#1C1E21] font-bold">Total Investment</span>
                    <span className="text-[24px] text-[#6366F1] font-bold">$16,650</span>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-[#1C1E21] mb-4">Payment Terms</h2>
                <div className="bg-[#F8F9FB] rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[14px] text-[#6B7280]">Deposit (30%)</span>
                    <span className="text-[14px] text-[#1C1E21] font-semibold">$4,995 - Upon signing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] text-[#6B7280]">Progress Payment (40%)</span>
                    <span className="text-[14px] text-[#1C1E21] font-semibold">$6,660 - Mid-project</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] text-[#6B7280]">Final Payment (30%)</span>
                    <span className="text-[14px] text-[#1C1E21] font-semibold">$4,995 - Upon completion</span>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="mt-16 pt-8 border-t border-[#E6E8EC]">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-6">Client Signature</p>
                    <div className="border-b border-[#1C1E21] pb-1 mb-2"></div>
                    <p className="text-[12px] text-[#6B7280]">Date: _______________</p>
                  </div>
                  <div>
                    <p className="text-[13px] text-[#6B7280] mb-6">Contractor Signature</p>
                    <div className="border-b border-[#1C1E21] pb-1 mb-2"></div>
                    <p className="text-[12px] text-[#6B7280]">Date: _______________</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-[#E6E8EC] text-center">
                <p className="text-[12px] text-[#9CA3AF]">
                  Premium Solutions Inc. | (555) 123-4567 | info@premiumsolutions.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
