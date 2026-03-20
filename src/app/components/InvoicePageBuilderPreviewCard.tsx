import { useState } from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { PublishModal } from './PublishModal';

interface InvoicePageBuilderPreviewCardProps {
  onClick: () => void;
}

export function InvoicePageBuilderPreviewCard({ onClick }: InvoicePageBuilderPreviewCardProps) {
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
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#FFF4ED] border border-[#FD5000]/15">
            <FileText className="w-5 h-5 text-[#FD5000]" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-[#1C1E21] leading-tight truncate">
              Overdue Invoices Page
            </h3>
            <p className="text-[12px] text-[#6B7280] mt-0.5 truncate">
              Not published &middot; Just now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="px-4 py-2 bg-[#1C1E21] text-white text-[13px] font-medium rounded-lg hover:bg-[#2A2D31] transition-colors"
            onClick={(e) => { e.stopPropagation(); setShowPublishModal(true); }}
          >
            Publish
          </button>
          <div className="flex-shrink-0">
            <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#1C1E21] group-hover:translate-x-0.5 transition-all duration-200" strokeWidth={2} />
          </div>
        </div>
      </div>

      {/* Preview Content - Invoice List + Detail miniature */}
      <div className="relative bg-[#F8F9FB] p-4 aspect-[21/9] overflow-hidden">
        <div className="bg-white rounded-md shadow-sm overflow-hidden h-full flex">
          {/* Mini Invoice List */}
          <div className="w-[35%] border-r border-[#E6E8EC] flex flex-col">
            <div className="px-3 py-2 border-b border-[#E6E8EC]">
              <div className="text-[8px] font-semibold text-[#1C1E21]">Overdue Invoices</div>
              <div className="text-[6px] text-[#9CA3AF]">10 invoices past due</div>
            </div>
            {[
              { name: 'Sesha Madhav', amount: '$3,762k', active: true },
              { name: 'Marcus Chen', amount: '$12,450', active: false },
              { name: 'Sarah Mitchell', amount: '$8,750', active: false },
              { name: 'David Park', amount: '$15,200', active: false },
            ].map((item, i) => (
              <div
                key={i}
                className={`px-3 py-1.5 border-b border-[#F3F4F6] ${item.active ? 'bg-[#FFF7ED] border-l-2 border-l-[#FD5000]' : 'border-l-2 border-l-transparent'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[7px] font-medium text-[#1C1E21]">{item.name}</div>
                  <div className="text-[7px] text-[#1C1E21] font-medium">{item.amount}</div>
                </div>
                <div className="text-[6px] text-[#9CA3AF]">Past due</div>
              </div>
            ))}
          </div>

          {/* Mini Invoice Detail */}
          <div className="flex-1 p-2 overflow-hidden">
            {/* Mini CTA Bar */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-[7px] text-[#6B7280]">Invoice #02-26-10489</div>
              <div className="bg-[#FD5000] text-white text-[6px] px-2 py-0.5 rounded font-medium">Send Email</div>
            </div>
            {/* Mini Invoice Card */}
            <div className="border border-[#E6E8EC] rounded p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="bg-[#1C1E21] text-white px-1.5 py-0.5 rounded text-[6px] font-bold">ACME</div>
                <div className="bg-[#3B82F6] text-white px-1.5 py-0.5 rounded text-[5px] font-semibold">SENT</div>
              </div>
              <div className="flex gap-2 mb-2">
                <div className="flex-1 border border-[#E6E8EC] rounded p-1.5">
                  <div className="text-[5px] text-[#FD5000] font-semibold mb-0.5">Billing</div>
                  <div className="text-[6px] text-[#1C1E21]">Sesha</div>
                  <div className="text-[5px] text-[#9CA3AF]">Paruthipattu, India</div>
                </div>
                <div className="flex-1 border border-[#E6E8EC] rounded p-1.5">
                  <div className="text-[5px] text-[#FD5000] font-semibold mb-0.5">Customer</div>
                  <div className="text-[6px] text-[#1C1E21]">Sesha Madhav</div>
                  <div className="text-[5px] text-[#9CA3AF]">Chennai, TN</div>
                </div>
                <div className="w-[60px] bg-[#FEE2E2]/50 border border-[#FECACA] rounded p-1.5 text-center">
                  <div className="text-[5px] text-[#9CA3AF]">Amount Due</div>
                  <div className="text-[8px] font-bold text-[#EF4444]">$3,762k</div>
                </div>
              </div>
              {/* Mini table rows */}
              <div className="space-y-0.5">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-1 bg-[#FAFAFA] rounded px-1 py-0.5">
                    <div className="w-3 h-3 bg-[#EEF2FF] rounded flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-[#6366F1] rounded-sm"></div>
                    </div>
                    <div className="text-[5px] text-[#6B7280] flex-1">Product item {i + 1}</div>
                    <div className="text-[5px] text-[#1C1E21]">$500.00</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PublishModal
      isOpen={showPublishModal}
      onClose={() => setShowPublishModal(false)}
      defaultPageName="Overdue Invoices Page"
    />
    </>
  );
}