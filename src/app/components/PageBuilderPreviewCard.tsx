import { useState } from 'react';
import { ChevronRight, Globe } from 'lucide-react';
import { PublishModal } from './PublishModal';

interface PageBuilderPreviewCardProps {
  onClick: () => void;
}

export function PageBuilderPreviewCard({ onClick }: PageBuilderPreviewCardProps) {
  const [showPublishModal, setShowPublishModal] = useState(false);

  return (
    <>
    <div 
      onClick={onClick}
      className="bg-white border border-[#E6E8EC] rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-all duration-200 cursor-pointer group w-full max-w-[700px] p-[0px] m-[0px]"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E6E8EC] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Globe Icon */}
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#ffffff] border border-[#E6E8EC]">
            <Globe className="w-5 h-5 text-[#1C1E21]" strokeWidth={2} />
          </div>
          
          {/* Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-[#1C1E21] leading-tight truncate">
              New Page
            </h3>
            <p className="text-[12px] text-[#6B7280] mt-0.5 truncate">
              Not published • 22 hours ago
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Publish Button */}
          <button 
            className="px-4 py-2 bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] text-white text-[13px] font-medium rounded-lg transition-all duration-150"
            onClick={(e) => { e.stopPropagation(); setShowPublishModal(true); }}
          >
            Publish
          </button>
          
          {/* Arrow to open */}
          <div className="flex-shrink-0">
            <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#1C1E21] group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={2} />
          </div>
        </div>
      </div>
      
      {/* Preview Content */}
      <div className="relative bg-[#F8F9FB] p-4 aspect-[21/9] overflow-hidden">
        <div className="bg-white rounded-md shadow-sm overflow-hidden h-full">
          {/* Mini Hero Section */}
          <div className="bg-gradient-to-br from-[#6B8DD6] to-[#5A7AC4] text-white p-6 text-center">
            <h1 className="text-[14px] font-bold mb-1">
              Welcome to Your New Landing Page
            </h1>
            <p className="text-[9px] mb-2 text-white/90">
              Build beautiful pages with AI assistance
            </p>
            <div className="inline-block px-3 py-1 bg-white text-[#6B8DD6] rounded text-[9px] font-medium">
              Get Started
            </div>
          </div>
          
          {/* Mini Features Section */}
          <div className="p-4 grid grid-cols-3 gap-2 bg-white">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-6 h-6 bg-[#F0F4F9] rounded-full flex items-center justify-center mx-auto mb-1">
                <div className="w-3 h-3 bg-[#6B8DD6] rounded-sm"></div>
              </div>
              <div className="text-[8px] font-semibold mb-0.5">Easy to Use</div>
              <div className="text-[7px] text-[#6B7280]">Build pages quickly</div>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-6 h-6 bg-[#F0F4F9] rounded-full flex items-center justify-center mx-auto mb-1">
                <div className="w-3 h-3 bg-[#6B8DD6] rounded-sm"></div>
              </div>
              <div className="text-[8px] font-semibold mb-0.5">Developer Friendly</div>
              <div className="text-[7px] text-[#6B7280]">Clean code</div>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-6 h-6 bg-[#F0F4F9] rounded-full flex items-center justify-center mx-auto mb-1">
                <div className="w-3 h-3 bg-[#6B8DD6] rounded-sm"></div>
              </div>
              <div className="text-[8px] font-semibold mb-0.5">Live Preview</div>
              <div className="text-[7px] text-[#6B7280]">Real-time changes</div>
            </div>
          </div>
          
          {/* Mini CTA Section */}
          <div className="bg-[#F8F9FB] p-4 text-center">
            <div className="text-[10px] font-bold mb-1">Ready to get started?</div>
            <div className="text-[7px] text-[#6B7280] mb-2">Create your first page in minutes</div>
            <div className="inline-block px-3 py-1 bg-[#6B8DD6] text-white rounded text-[8px] font-medium">
              Start Building
            </div>
          </div>
        </div>
      </div>
    </div>
    <PublishModal
      isOpen={showPublishModal}
      onClose={() => setShowPublishModal(false)}
      defaultPageName="New Page"
    />
    </>
  );
}