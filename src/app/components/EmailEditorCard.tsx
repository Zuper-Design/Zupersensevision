import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Bold, Italic, Underline, List, Link2, 
  Image, Paperclip, AlignLeft, AlignCenter,
  Type, ChevronDown, Undo2, Redo2, 
  Smile, Send, MoreHorizontal, Layout, Code, Eye, Sparkles, Share2, Settings, Mail, Save
} from 'lucide-react';

type EditorMode = 'email' | 'pdf' | 'page-builder';

interface EmailEditorCardProps {
  data: {
    subject: string;
    to: string;
    body: string;
    type: 'email' | 'message';
  };
  onChange: (data: { subject: string; to: string; body: string; type: 'email' | 'message' }) => void;
  onClose: () => void;
  onApply: () => void;
  mode?: EditorMode;
}

export const EmailEditorCard: React.FC<EmailEditorCardProps> = ({
  data,
  onChange,
  onClose,
  onApply,
  mode = 'email'
}) => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [activeFormat, setActiveFormat] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'design' | 'code'>('design');
  const [showAllRecipients, setShowAllRecipients] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.focus();
    }
  }, []);

  const toggleFormat = (format: string) => {
    setActiveFormat(prev => {
      const next = new Set(prev);
      if (next.has(format)) next.delete(format);
      else next.add(format);
      return next;
    });
    document.execCommand(format, false);
  };

  const isEmail = data.type === 'email';

  return (
    <div className="w-full h-full bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-2.5 bg-white flex items-center justify-between gap-4 border-b border-[#E6E8EC]">
        {mode === 'email' ? (
          // Email Mode Header
          <>
            {/* Left: Edit email title */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FD5000]" />
              <span className="text-[13px] text-[#1C1E21] font-medium">{isEmail ? 'Edit email' : 'Edit message'}</span>
            </div>

            {/* Right: Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </>
        ) : mode === 'page-builder' ? (
          // Page Builder Mode Header
          <>
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
              <span className="text-[#6B7280] flex-shrink-0">/</span>
              <span className="text-[13px] text-[#1C1E21] truncate">
                landing-page
              </span>
              <span className="text-[11px] text-[#6B7280] bg-white px-2 py-0.5 rounded flex-shrink-0 shadow-sm">
                Draft
              </span>
            </div>

            {/* Right: Page Builder Controls */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC] transition-colors" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC] transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#1C1E21] text-[13px] font-medium hover:bg-[#F3F4F6] transition-colors border border-[#E6E8EC]">
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          </>
        ) : (
          // PDF Mode Header
          <>
            {/* Left: PDF Icon */}
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#1C1E21] font-medium">PDF Preview</span>
            </div>

            {/* Middle: Document Name */}
            <div className="flex-1 flex items-center gap-2 bg-[#F8F9FB] rounded-lg px-3 py-1.5 min-w-0">
              <span className="text-[13px] text-[#1C1E21] truncate">
                Document.pdf
              </span>
            </div>

            {/* Right: PDF Controls */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-[#F8F9FB] text-[#6B7280] hover:text-[#1C1E21] hover:bg-[#E6E8EC] transition-colors" title="Share">
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#F8F9FB] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Compact formatting toolbar - only for emails */}
      {isEmail && (
      <div className="px-3 py-1.5 border-b border-[#F0F1F3] flex items-center gap-0.5 bg-[#FAFAFA]">
        <button onClick={() => toggleFormat('undo')} className="p-1 rounded hover:bg-white transition-colors" title="Undo">
          <Undo2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
        <button onClick={() => toggleFormat('redo')} className="p-1 rounded hover:bg-white transition-colors" title="Redo">
          <Redo2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>

        <div className="w-px h-3.5 bg-[#E6E8EC] mx-1" />

        <button className="flex items-center gap-1 px-1.5 py-1 rounded hover:bg-white transition-colors">
          <Type className="w-3 h-3 text-[#9CA3AF]" />
          <span className="text-[10px] text-[#9CA3AF]">Sans</span>
          <ChevronDown className="w-2.5 h-2.5 text-[#C9CDD3]" />
        </button>

        <div className="w-px h-3.5 bg-[#E6E8EC] mx-1" />

        <button 
          onClick={() => toggleFormat('bold')}
          className={`p-1 rounded transition-colors ${activeFormat.has('bold') ? 'bg-[#FFF4ED] text-[#FD5000]' : 'hover:bg-white text-[#9CA3AF]'}`}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => toggleFormat('italic')}
          className={`p-1 rounded transition-colors ${activeFormat.has('italic') ? 'bg-[#FFF4ED] text-[#FD5000]' : 'hover:bg-white text-[#9CA3AF]'}`}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={() => toggleFormat('underline')}
          className={`p-1 rounded transition-colors ${activeFormat.has('underline') ? 'bg-[#FFF4ED] text-[#FD5000]' : 'hover:bg-white text-[#9CA3AF]'}`}
          title="Underline"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <div className="w-px h-3.5 bg-[#E6E8EC] mx-1" />

        <button className="p-1 rounded hover:bg-white transition-colors" title="Align Left">
          <AlignLeft className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
        <button className="p-1 rounded hover:bg-white transition-colors" title="Align Center">
          <AlignCenter className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>

        <div className="w-px h-3.5 bg-[#E6E8EC] mx-1" />

        <button className="p-1 rounded hover:bg-white transition-colors" title="List">
          <List className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
        <button className="p-1 rounded hover:bg-white transition-colors" title="Link">
          <Link2 className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
        <button className="p-1 rounded hover:bg-white transition-colors" title="Image">
          <Image className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>

        <div className="flex-1" />

        <button className="p-1 rounded hover:bg-white transition-colors" title="More">
          <MoreHorizontal className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </button>
      </div>
      )}

      {/* Email fields */}
      <div className="border-b border-[#F0F1F3]">
        {/* From - only for emails */}
        {isEmail && (
        <div className="px-4 py-2 border-b border-[#F0F1F3]/60 flex items-center gap-2.5">
          <span className="text-[11px] text-[#9CA3AF] w-[40px] flex-shrink-0">From</span>
          <span className="text-[12px] text-[#1C1E21]">sarah.mitchell@acme.co</span>
        </div>
        )}

        {/* To */}
        <div className="px-4 py-2 border-b border-[#F0F1F3]/60 flex items-start gap-2.5">
          <span className="text-[11px] text-[#9CA3AF] w-[40px] flex-shrink-0 mt-0.5">To</span>
          <div className="flex-1 flex items-center gap-1 flex-wrap">
            {(() => {
              const recipients = data.to.split(',').filter(r => r.trim());
              const displayedRecipients = showAllRecipients ? recipients : recipients.slice(0, 1);
              const remainingCount = recipients.length - 1;
              
              return (
                <>
                  {displayedRecipients.map((recipient, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-[#F3F4F6] rounded text-[11px] text-[#1C1E21]"
                    >
                      {recipient.trim()}
                      <button className="hover:text-[#EF4444] transition-colors ml-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                  {!showAllRecipients && remainingCount > 0 && (
                    <button
                      onClick={() => setShowAllRecipients(true)}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-[#9CA3AF] hover:text-[#FD5000] hover:bg-[#FFF4ED] transition-colors"
                    >
                      +{remainingCount} more
                    </button>
                  )}
                  {showAllRecipients && remainingCount > 0 && (
                    <button
                      onClick={() => setShowAllRecipients(false)}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] text-[#9CA3AF] hover:text-[#FD5000] hover:bg-[#FFF4ED] transition-colors"
                    >
                      Show less
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder="Add..."
                    className="flex-1 min-w-[60px] text-[12px] text-[#1C1E21] bg-transparent focus:outline-none placeholder:text-[#C9CDD3]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                        const val = (e.target as HTMLInputElement).value.trim();
                        onChange({ ...data, to: data.to ? `${data.to}, ${val}` : val });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </>
              );
            })()}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isEmail && !showCc && (
              <button onClick={() => setShowCc(true)} className="text-[10px] text-[#9CA3AF] hover:text-[#FD5000] transition-colors">Cc</button>
            )}
            {isEmail && !showBcc && (
              <button onClick={() => setShowBcc(true)} className="text-[10px] text-[#9CA3AF] hover:text-[#FD5000] transition-colors">Bcc</button>
            )}
          </div>
        </div>

        {/* Cc */}
        {isEmail && showCc && (
          <div className="px-4 py-2 border-b border-[#F0F1F3]/60 flex items-center gap-2.5">
            <span className="text-[11px] text-[#9CA3AF] w-[40px] flex-shrink-0">Cc</span>
            <input
              type="text"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="Add Cc..."
              className="flex-1 text-[12px] text-[#1C1E21] bg-transparent focus:outline-none placeholder:text-[#C9CDD3]"
            />
            <button onClick={() => { setShowCc(false); setCc(''); }} className="p-0.5 hover:bg-[#F3F4F6] rounded transition-colors">
              <X className="w-3 h-3 text-[#9CA3AF]" />
            </button>
          </div>
        )}

        {/* Bcc */}
        {isEmail && showBcc && (
          <div className="px-4 py-2 border-b border-[#F0F1F3]/60 flex items-center gap-2.5">
            <span className="text-[11px] text-[#9CA3AF] w-[40px] flex-shrink-0">Bcc</span>
            <input
              type="text"
              value={bcc}
              onChange={(e) => setBcc(e.target.value)}
              placeholder="Add Bcc..."
              className="flex-1 text-[12px] text-[#1C1E21] bg-transparent focus:outline-none placeholder:text-[#C9CDD3]"
            />
            <button onClick={() => { setShowBcc(false); setBcc(''); }} className="p-0.5 hover:bg-[#F3F4F6] rounded transition-colors">
              <X className="w-3 h-3 text-[#9CA3AF]" />
            </button>
          </div>
        )}

        {/* Subject */}
        {isEmail && (
          <div className="px-4 py-2 flex items-center gap-2.5">
            <span className="text-[11px] text-[#9CA3AF] w-[40px] flex-shrink-0">Subject</span>
            <input
              type="text"
              value={data.subject}
              onChange={(e) => onChange({ ...data, subject: e.target.value })}
              placeholder="Enter subject..."
              className="flex-1 text-[12px] text-[#1C1E21] bg-transparent focus:outline-none font-medium placeholder:text-[#C9CDD3] placeholder:font-normal"
            />
          </div>
        )}
      </div>

      {/* Body editor */}
      <div className={`px-4 ${isEmail ? 'py-3' : 'py-4'} flex-1 overflow-y-auto scrollbar-auto-hide`}>
        {!isEmail && (
          <p className="text-[11px] text-[#9CA3AF] mb-2">Message</p>
        )}
        <div
          ref={bodyRef}
          contentEditable
          suppressContentEditableWarning
          className={`min-h-[160px] h-full text-[13px] text-[#1C1E21] leading-[1.7] focus:outline-none whitespace-pre-wrap ${!isEmail ? 'bg-[#F8F9FB] rounded-lg p-3 border border-[#E6E8EC] focus-within:border-[#FD5000]/30' : ''}`}
          style={{ wordBreak: 'break-word' }}
          dangerouslySetInnerHTML={{ __html: data.body.replace(/\n/g, '<br>') }}
          onInput={(e) => {
            const text = (e.target as HTMLDivElement).innerText;
            onChange({ ...data, body: text });
          }}
        />
      </div>

      {/* Footer with actions */}
      <div className="px-4 py-2.5 border-t border-[#E6E8EC] flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {isEmail && (
          <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <Paperclip className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
          )}
          <button className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors">
            <Smile className="w-3.5 h-3.5 text-[#9CA3AF]" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-[12px] font-medium text-[#6B7280] hover:bg-[#F3F4F6] transition-colors"
          >
            Discard
          </button>
          <button
            onClick={onApply}
            className="px-4 py-1.5 bg-[#FD5000] rounded-lg text-[12px] font-medium text-white hover:bg-[#E54800] transition-colors shadow-sm"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};