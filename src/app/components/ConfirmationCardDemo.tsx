import React, { useState } from 'react';
import { ConfirmationCard } from './ConfirmationCard';
import { X } from 'lucide-react';

interface ConfirmationCardDemoProps {
  showDemo: boolean;
  setShowDemo: (show: boolean) => void;
}

export const ConfirmationCardDemo: React.FC<ConfirmationCardDemoProps> = ({ showDemo, setShowDemo }) => {
  const [activeDemo, setActiveDemo] = useState<string | null>('job');

  if (!showDemo) return null;

  const demos = [
    {
      id: 'job',
      type: 'job' as const,
      moduleName: 'Job',
      fields: [
        { label: 'Title', value: 'Roof Replacement - Main St', highlight: true },
        { label: 'Customer', value: 'John Smith' },
        { label: 'Organization', value: 'Smith Property Group' },
        { label: 'Scheduled', value: 'Feb 24, 2026 at 9:00 AM' },
        { label: 'Technician', value: 'Mike Johnson' },
        { label: 'Priority', value: 'High', highlight: true },
      ],
    },
    {
      id: 'customer',
      type: 'customer' as const,
      moduleName: 'Customer',
      fields: [
        { label: 'Name', value: 'Sarah Mitchell', highlight: true },
        { label: 'Phone', value: '+1 (555) 234-5678' },
        { label: 'Email', value: 'sarah.mitchell@email.com' },
        { label: 'Organization', value: 'Mitchell Enterprises' },
        { label: 'Status', value: 'Active' },
      ],
    },
    {
      id: 'organization',
      type: 'organization' as const,
      moduleName: 'Organization',
      fields: [
        { label: 'Name', value: 'Acme Construction Ltd.', highlight: true },
        { label: 'Primary Contact', value: 'Robert Chen' },
        { label: 'Phone', value: '+1 (555) 987-6543' },
        { label: 'Address', value: '123 Business Ave, San Francisco, CA 94105' },
        { label: 'Type', value: 'Commercial' },
      ],
    },
    {
      id: 'quote',
      type: 'quote' as const,
      moduleName: 'Quote',
      fields: [
        { label: 'Quote ID', value: 'QT-2026-0847', highlight: true },
        { label: 'Customer', value: 'Emily Rodriguez' },
        { label: 'Amount', value: '$12,450.00', highlight: true },
        { label: 'Valid Until', value: 'March 17, 2026' },
        { label: 'Items', value: '8 line items' },
      ],
    },
    {
      id: 'invoice',
      type: 'invoice' as const,
      moduleName: 'Invoice',
      fields: [
        { label: 'Invoice ID', value: 'INV-2026-1234', highlight: true },
        { label: 'Customer', value: 'David Park' },
        { label: 'Amount', value: '$8,750.00', highlight: true },
        { label: 'Due Date', value: 'March 3, 2026' },
        { label: 'Status', value: 'Sent' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[1200px] h-[90vh] bg-[#F8F9FB] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-[#E6E8EC] px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-[#1C1E21] mb-2">
              Confirmation Card Examples
            </h1>
            <p className="text-[14px] text-[#6B7280]">
              Premium enterprise SaaS confirmation cards for AI-assisted workflows
            </p>
          </div>
          <button
            onClick={() => setShowDemo(false)}
            className="w-10 h-10 rounded-lg bg-[#F8F9FB] hover:bg-[#E6E8EC] transition-colors flex items-center justify-center"
          >
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6 scrollbar-auto-hide">
          {/* Demo Selector */}
          <div className="flex flex-wrap gap-3 mb-8">
            {demos.map((demo) => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  activeDemo === demo.id
                    ? 'bg-[#FD5000] text-white'
                    : 'bg-white text-[#1C1E21] border border-[#E6E8EC] hover:border-[#FD5000]'
                }`}
              >
                {demo.moduleName}
              </button>
            ))}
          </div>

          {/* Active Demo Card */}
          {activeDemo && (
            <div className="flex justify-center mb-12">
              {demos
                .filter((demo) => demo.id === activeDemo)
                .map((demo) => (
                  <ConfirmationCard
                    key={demo.id}
                    moduleType={demo.type}
                    moduleName={demo.moduleName}
                    fields={demo.fields}
                    onViewDetails={() => alert(`View ${demo.moduleName} Details`)}
                    onSecondaryAction={() => alert(`Create Another ${demo.moduleName}`)}
                    secondaryActionLabel={
                      demo.id === 'job' || demo.id === 'customer'
                        ? 'Edit'
                        : 'Create Another'
                    }
                  />
                ))}
            </div>
          )}

          {/* Usage Instructions */}
          <div className="max-w-[720px] mx-auto">
            <div className="bg-white rounded-xl border border-[#E6E8EC] p-6">
              <h2 className="text-[16px] font-semibold text-[#1C1E21] mb-4">
                Usage Example
              </h2>
              <pre className="bg-[#F8F9FB] rounded-lg p-4 text-[12px] text-[#1C1E21] overflow-x-auto">
{`<ConfirmationCard
  moduleType="job"
  moduleName="Job"
  fields={[
    { label: 'Title', value: 'Roof Replacement', highlight: true },
    { label: 'Customer', value: 'John Smith' },
    { label: 'Scheduled', value: 'Feb 24, 2026' },
    { label: 'Priority', value: 'High', highlight: true },
  ]}
  onViewDetails={() => navigate('/jobs/123')}
  onSecondaryAction={() => navigate('/jobs/create')}
  secondaryActionLabel="Edit"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};