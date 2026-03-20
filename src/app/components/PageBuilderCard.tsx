import React, { useState } from 'react';
import { X, Layout, Code, Eye, Settings, Share2, Wand2, MousePointerClick, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { PublishModal } from './PublishModal';

interface PageBuilderCardProps {
  onClose: () => void;
  pageName?: string;
  workspace?: string;
}

export const PageBuilderCard: React.FC<PageBuilderCardProps> = ({ onClose, pageName, workspace }) => {
  const [viewMode, setViewMode] = useState<'design' | 'code'>('design');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [expandedOptions, setExpandedOptions] = useState<string[]>(['colors']);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    if (isEditMode) {
      e.stopPropagation();
      setSelectedElement(elementId);
      setEditPrompt('');
    }
  };

  const closeEditModal = () => {
    setSelectedElement(null);
    setEditPrompt('');
  };

  const toggleOption = (option: string) => {
    setExpandedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const editableClass = isEditMode 
    ? 'cursor-pointer hover:ring-2 hover:ring-[#3B82F6] hover:ring-dashed hover:ring-offset-1 transition-all' 
    : '';

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 bg-white flex items-center justify-between gap-4 border-b border-[#E6E8EC]">
        {/* Left: Design/Code Switcher */}
        <div className="flex items-center gap-1 bg-[#F8F9FB] rounded-lg p-1">
          <button
            className={`px-2 py-1.5 rounded-md transition-colors ${
              viewMode === 'design' 
                ? 'bg-white text-[#1C1E21] shadow-sm' 
                : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
            title="Design"
            onClick={() => setViewMode('design')}
          >
            <Layout className="w-4 h-4" />
          </button>
          <button
            className={`px-2 py-1.5 rounded-md transition-colors ${
              viewMode === 'code' 
                ? 'bg-white text-[#1C1E21] shadow-sm' 
                : 'text-[#6B7280] hover:text-[#1C1E21]'
            }`}
            title="Code"
            onClick={() => setViewMode('code')}
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Middle: URL Section */}
        <div className="flex-1 flex items-center gap-2 bg-[#F8F9FB] rounded-lg px-3 py-1.5 min-w-0">
          <button className="flex-shrink-0 p-1 hover:bg-[#E6E8EC] rounded transition-colors" title="Home">
            <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <span className="text-[#6B7280] flex-shrink-0">/</span>
          <span className="text-[13px] text-[#1C1E21] truncate">
            {pageName ? `${workspace?.toLowerCase() ?? 'pages'}/${pageName.toLowerCase().replace(/\s+/g, '-')}` : 'landing-page'}
          </span>
          <div className="ml-auto flex items-center gap-1 flex-shrink-0">
            <button className="p-1 hover:bg-[#E6E8EC] rounded transition-colors" title="Reload">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button className="p-1 hover:bg-[#E6E8EC] rounded transition-colors" title="Open in new tab">
              <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right: Page Builder Controls */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC] transition-colors" title="Settings">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC] transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            className={`p-2 rounded-lg transition-colors ${
              isEditMode 
                ? 'bg-[#FD5000] text-white' 
                : 'bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC]'
            }`}
            title="Point and edit"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1E21] text-white text-[13px] font-medium hover:bg-[#2A2D31] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Publish
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#6B7280] hover:text-[#1C1E21] transition-colors" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto bg-[#F8F9FB] p-8 relative">
        <div className="max-w-[1200px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative">
            <div 
              className={`bg-gradient-to-br from-[#6B8DD6] to-[#5A7AC4] text-white p-16 text-center ${editableClass}`}
              onClick={(e) => handleElementClick(e, 'hero-container')}
            >
              <h1 
                className={`text-5xl font-bold mb-4 ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'hero-title')}
              >
                Welcome to Your New Landing Page
              </h1>
              <p 
                className={`text-xl mb-8 text-white/90 ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'hero-subtitle')}
              >
                Build beautiful pages with AI assistance
              </p>
              <button 
                className={`px-8 py-3 bg-white text-[#6B8DD6] rounded-lg font-medium text-lg hover:bg-gray-100 transition-colors ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'hero-button')}
              >
                Get Started
              </button>
            </div>
            
            {/* Edit Card - Shows for any hero element */}
            {(selectedElement?.startsWith('hero-') || selectedElement === 'hero-container') && (
              <div className="bg-white border border-[#E6E8EC] shadow-lg mx-4 -mt-2 mb-4 rounded-lg relative z-10">
                {/* Modal Header */}
                <div className="p-4 border-b border-[#E6E8EC] flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Describe a change"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="flex-1 text-[15px] text-[#1C1E21] placeholder:text-[#9CA3AF] outline-none"
                    autoFocus
                  />
                  <button onClick={closeEditModal} className="p-1 hover:bg-[#F8F9FB] rounded transition-colors">
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="px-4 pt-4 flex gap-4 border-b border-[#E6E8EC]">
                  <button className="pb-2 text-[13px] font-medium text-[#1C1E21] border-b-2 border-[#1C1E21]">
                    Style
                  </button>
                  <button className="pb-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21]">
                    Layout
                  </button>
                </div>

                {/* Options */}
                <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                  {/* Colors */}
                  <div>
                    <button
                      onClick={() => toggleOption('colors')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Colors</span>
                      {expandedOptions.includes('colors') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                    {expandedOptions.includes('colors') && (
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="text-[12px] text-[#6B7280] mb-1">Background</div>
                          <div className="flex items-center gap-2 p-2 bg-[#F8F9FB] rounded">
                            <div className="w-6 h-6 bg-black rounded border border-[#E6E8EC]"></div>
                            <span className="text-[13px] text-[#1C1E21]">#000000</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Border */}
                  <div>
                    <button
                      onClick={() => toggleOption('border')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Border</span>
                      {expandedOptions.includes('border') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                  </div>

                  {/* Display */}
                  <div>
                    <button
                      onClick={() => toggleOption('display')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Display</span>
                      {expandedOptions.includes('display') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#E6E8EC] flex justify-end gap-2">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-[13px] font-medium bg-[#FD5000] text-white rounded-lg hover:bg-[#E54800] transition-colors"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="relative">
            <div 
              className={`p-16 grid grid-cols-3 gap-8 ${editableClass}`}
              onClick={(e) => handleElementClick(e, 'features-container')}
            >
              {/* Feature Card 1 */}
              <div 
                className={`text-center ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'feature-card-1')}
              >
                <div 
                  className={`w-16 h-16 bg-[#F0F4F9] rounded-full flex items-center justify-center mx-auto mb-4 ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-icon-1')}
                >
                  <Layout className="w-8 h-8 text-[#6B8DD6]" />
                </div>
                <h3 
                  className={`text-xl font-semibold mb-2 ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-title-1')}
                >
                  Easy to Use
                </h3>
                <p 
                  className={`text-[#6B7280] ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-desc-1')}
                >
                  Build pages quickly with our intuitive interface
                </p>
              </div>
              
              {/* Feature Card 2 */}
              <div 
                className={`text-center ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'feature-card-2')}
              >
                <div 
                  className={`w-16 h-16 bg-[#F0F4F9] rounded-full flex items-center justify-center mx-auto mb-4 ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-icon-2')}
                >
                  <Code className="w-8 h-8 text-[#6B8DD6]" />
                </div>
                <h3 
                  className={`text-xl font-semibold mb-2 ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-title-2')}
                >
                  Developer Friendly
                </h3>
                <p 
                  className={`text-[#6B7280] ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-desc-2')}
                >
                  Clean code that's easy to customize
                </p>
              </div>
              
              {/* Feature Card 3 */}
              <div 
                className={`text-center ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'feature-card-3')}
              >
                <div 
                  className={`w-16 h-16 bg-[#F0F4F9] rounded-full flex items-center justify-center mx-auto mb-4 ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-icon-3')}
                >
                  <Eye className="w-8 h-8 text-[#6B8DD6]" />
                </div>
                <h3 
                  className={`text-xl font-semibold mb-2 ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-title-3')}
                >
                  Live Preview
                </h3>
                <p 
                  className={`text-[#6B7280] ${editableClass}`}
                  onClick={(e) => handleElementClick(e, 'feature-desc-3')}
                >
                  See your changes in real-time
                </p>
              </div>
            </div>

            {/* Edit Card for Features */}
            {(selectedElement?.startsWith('feature-') || selectedElement === 'features-container') && (
              <div className="bg-white border border-[#E6E8EC] shadow-lg mx-4 -mt-2 mb-4 rounded-lg relative z-10">
                {/* Modal Header */}
                <div className="p-4 border-b border-[#E6E8EC] flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Describe a change"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="flex-1 text-[15px] text-[#1C1E21] placeholder:text-[#9CA3AF] outline-none"
                    autoFocus
                  />
                  <button onClick={closeEditModal} className="p-1 hover:bg-[#F8F9FB] rounded transition-colors">
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="px-4 pt-4 flex gap-4 border-b border-[#E6E8EC]">
                  <button className="pb-2 text-[13px] font-medium text-[#1C1E21] border-b-2 border-[#1C1E21]">
                    Style
                  </button>
                  <button className="pb-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21]">
                    Layout
                  </button>
                </div>

                {/* Options */}
                <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                  {/* Colors */}
                  <div>
                    <button
                      onClick={() => toggleOption('colors')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Colors</span>
                      {expandedOptions.includes('colors') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                    {expandedOptions.includes('colors') && (
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="text-[12px] text-[#6B7280] mb-1">Background</div>
                          <div className="flex items-center gap-2 p-2 bg-[#F8F9FB] rounded">
                            <div className="w-6 h-6 bg-black rounded border border-[#E6E8EC]"></div>
                            <span className="text-[13px] text-[#1C1E21]">#000000</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Border */}
                  <div>
                    <button
                      onClick={() => toggleOption('border')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Border</span>
                      {expandedOptions.includes('border') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                  </div>

                  {/* Display */}
                  <div>
                    <button
                      onClick={() => toggleOption('display')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Display</span>
                      {expandedOptions.includes('display') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#E6E8EC] flex justify-end gap-2">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-[13px] font-medium bg-[#FD5000] text-white rounded-lg hover:bg-[#E54800] transition-colors"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="relative">
            <div 
              className={`bg-[#F8F9FB] p-16 text-center ${editableClass}`}
              onClick={(e) => handleElementClick(e, 'cta-container')}
            >
              <h2 
                className={`text-3xl font-bold mb-4 ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'cta-title')}
              >
                Ready to get started?
              </h2>
              <p 
                className={`text-[#6B7280] mb-8 ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'cta-subtitle')}
              >
                Create your first page in minutes
              </p>
              <button 
                className={`px-8 py-3 bg-[#6B8DD6] text-white rounded-lg font-medium hover:bg-[#5A7AC4] transition-colors ${editableClass}`}
                onClick={(e) => handleElementClick(e, 'cta-button')}
              >
                Start Building
              </button>
            </div>

            {/* Edit Card for CTA */}
            {(selectedElement?.startsWith('cta-') || selectedElement === 'cta-container') && (
              <div className="bg-white border border-[#E6E8EC] shadow-lg mx-4 -mt-2 mb-4 rounded-lg relative z-10">
                {/* Modal Header */}
                <div className="p-4 border-b border-[#E6E8EC] flex items-center justify-between">
                  <input
                    type="text"
                    placeholder="Describe a change"
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    className="flex-1 text-[15px] text-[#1C1E21] placeholder:text-[#9CA3AF] outline-none"
                    autoFocus
                  />
                  <button onClick={closeEditModal} className="p-1 hover:bg-[#F8F9FB] rounded transition-colors">
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="px-4 pt-4 flex gap-4 border-b border-[#E6E8EC]">
                  <button className="pb-2 text-[13px] font-medium text-[#1C1E21] border-b-2 border-[#1C1E21]">
                    Style
                  </button>
                  <button className="pb-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21]">
                    Layout
                  </button>
                </div>

                {/* Options */}
                <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                  {/* Colors */}
                  <div>
                    <button
                      onClick={() => toggleOption('colors')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Colors</span>
                      {expandedOptions.includes('colors') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                    {expandedOptions.includes('colors') && (
                      <div className="mt-2 space-y-2">
                        <div>
                          <div className="text-[12px] text-[#6B7280] mb-1">Background</div>
                          <div className="flex items-center gap-2 p-2 bg-[#F8F9FB] rounded">
                            <div className="w-6 h-6 bg-black rounded border border-[#E6E8EC]"></div>
                            <span className="text-[13px] text-[#1C1E21]">#000000</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Border */}
                  <div>
                    <button
                      onClick={() => toggleOption('border')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Border</span>
                      {expandedOptions.includes('border') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                  </div>

                  {/* Display */}
                  <div>
                    <button
                      onClick={() => toggleOption('display')}
                      className="w-full flex items-center justify-between py-2 text-[13px] font-medium text-[#1C1E21]"
                    >
                      <span>Display</span>
                      {expandedOptions.includes('display') ? (
                        <ChevronUp className="w-4 h-4 text-[#6B7280]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#E6E8EC] flex justify-end gap-2">
                  <button
                    onClick={closeEditModal}
                    className="px-4 py-2 text-[13px] font-medium text-[#6B7280] hover:text-[#1C1E21] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-[13px] font-medium bg-[#FD5000] text-white rounded-lg hover:bg-[#E54800] transition-colors"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        defaultPageName="New Landing Page"
      />
    </div>
  );
};