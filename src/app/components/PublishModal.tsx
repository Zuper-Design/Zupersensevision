import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check, FileText } from 'lucide-react';
import { usePublishedPages } from './PublishedPagesContext';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPageName?: string;
}

const workspaceOptions = [
  'Work',
  'Schedule',
  'CRM',
  'Timesheets',
  'Inventory',
  'Finance',
  'Reporting',
];

export function PublishModal({ isOpen, onClose, defaultPageName = '' }: PublishModalProps) {
  const [pageName, setPageName] = useState(defaultPageName);
  const [selectedWorkspace, setSelectedWorkspace] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addPublishedPage } = usePublishedPages();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPageName(defaultPageName);
      setSelectedWorkspace('');
      setIsDropdownOpen(false);
      setIsPublishing(false);
      setIsPublished(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultPageName]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handlePublish = () => {
    if (!pageName.trim() || !selectedWorkspace) return;

    setIsPublishing(true);
    // Simulate brief publish delay
    setTimeout(() => {
      addPublishedPage({
        name: pageName.trim(),
        workspace: selectedWorkspace,
      });
      setIsPublishing(false);
      setIsPublished(true);
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] w-[420px]">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-[#E6E8EC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FFF4ED] flex items-center justify-center">
              <FileText className="w-[18px] h-[18px] text-[#FD5000]" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-[#1C1E21]">Publish Page</h2>
              <p className="text-[12px] text-[#9CA3AF]">Add this page to a workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Page Name */}
          <div>
            <label className="text-[13px] font-medium text-[#1C1E21] mb-1.5 block">
              Page Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              placeholder="Enter a name for your page..."
              className="w-full px-3.5 py-2.5 bg-[#F8F9FB] border border-[#E6E8EC] rounded-lg text-[14px] text-[#1C1E21] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#FD5000]/20 focus:border-[#FD5000]/40 transition-all"
            />
          </div>

          {/* Workspace Dropdown */}
          <div ref={dropdownRef} className="relative">
            <label className="text-[13px] font-medium text-[#1C1E21] mb-1.5 block">
              Workspace
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-3.5 py-2.5 bg-[#F8F9FB] border rounded-lg text-[14px] text-left flex items-center justify-between transition-all ${
                isDropdownOpen
                  ? 'border-[#FD5000]/40 ring-2 ring-[#FD5000]/20'
                  : 'border-[#E6E8EC] hover:border-[#D1D5DB]'
              }`}
            >
              <span className={selectedWorkspace ? 'text-[#1C1E21]' : 'text-[#9CA3AF]'}>
                {selectedWorkspace || 'Select a workspace...'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#6B7280] transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Options */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E6E8EC] rounded-xl shadow-lg z-10 py-1 max-h-[220px] overflow-y-auto">
                {workspaceOptions.map((ws) => (
                  <button
                    key={ws}
                    onClick={() => {
                      setSelectedWorkspace(ws);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 text-left text-[14px] flex items-center justify-between transition-colors ${
                      selectedWorkspace === ws
                        ? 'bg-[#FFF4ED] text-[#FD5000]'
                        : 'text-[#1C1E21] hover:bg-[#F8F9FB]'
                    }`}
                  >
                    <span>{ws}</span>
                    {selectedWorkspace === ws && (
                      <Check className="w-4 h-4 text-[#FD5000]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6E8EC] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors rounded-lg hover:bg-[#F8F9FB]"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!pageName.trim() || !selectedWorkspace || isPublishing || isPublished}
            className={`px-5 py-2 text-[13px] font-medium rounded-lg transition-all flex items-center gap-2 ${
              isPublished
                ? 'bg-[#10B981] text-white'
                : !pageName.trim() || !selectedWorkspace
                  ? 'bg-[#E6E8EC] text-[#9CA3AF] cursor-not-allowed'
                  : 'bg-[#1C1E21] text-white hover:bg-[#2A2D31] shadow-sm'
            }`}
          >
            {isPublishing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : isPublished ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Published!
              </>
            ) : (
              'Publish'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}