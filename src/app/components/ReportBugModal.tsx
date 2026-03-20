import { useState, useRef } from 'react';
import { X, Camera, Info } from 'lucide-react';

interface ReportBugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportBugModal({ isOpen, onClose }: ReportBugModalProps) {
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    // Handle bug report submission here
    console.log('Bug report:', { description, image: uploadedImage });
    
    // Reset form
    setDescription('');
    setUploadedImage(null);
    setUploadedFileName(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] w-full max-w-[440px] pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-5 border-b border-[#E6E8EC]">
            <h2 className="text-[20px] font-semibold text-[#1C1E21]">Report a Bug</h2>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#F8F9FB] transition-colors duration-150"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Description Section */}
            <div className="mb-6">
              <label htmlFor="bug-description" className="block text-[15px] font-semibold text-[#1C1E21] mb-1.5">
                Describe your bug
              </label>
              <p className="text-[14px] text-[#6B7280] mb-3">Tell us what prompted this feedback</p>
              <textarea
                id="bug-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type here..."
                rows={5}
                className="w-full px-3.5 py-3 text-[15px] leading-[1.5] text-[#1C1E21] placeholder:text-[#9CA3AF] bg-white border border-[#E6E8EC] rounded-[8px] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 resize-none transition-all duration-150"
              />
            </div>

            {/* Info Text */}
            

            {/* Screenshot Section */}
            <div>
              <label className="block text-[15px] font-semibold text-[#1C1E21] mb-1.5">
                Screenshot
              </label>
              <p className="text-[14px] text-[#6B7280] mb-3">Help us understand the issue better</p>

              {/* Uploaded Image Preview */}
              {uploadedImage ? (
                <div>
                  <div className="mb-3">
                    <div className="relative border border-[#E6E8EC] rounded-[8px] overflow-hidden">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded screenshot" 
                        className="w-full h-40 object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-[#6B7280] truncate">{uploadedFileName}</span>
                    <button
                      onClick={handleRemoveImage}
                      className="text-[13px] font-medium text-[#6366F1] hover:text-[#5558E3] transition-colors duration-150"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                /* Capture Screenshot Button */
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-medium text-[#1C1E21] bg-white border border-[#E6E8EC] rounded-[8px] hover:bg-[#F8F9FB] transition-colors duration-150"
                >
                  <Camera className="w-4 h-4" />
                  Add Image
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2 border-t border-[#E6E8EC]">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-[14px] font-medium text-[#6B7280] hover:bg-[#F8F9FB] rounded-[8px] transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!description.trim()}
              className="px-5 py-2.5 text-[14px] font-medium text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] rounded-[8px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-[#221E1F] disabled:hover:to-[#6D5F63]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}