import { useState, useRef, useEffect } from 'react';
import { X, Camera, Mic, Pause, Check } from 'lucide-react';

interface SendFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendFeedbackModal({ isOpen, onClose }: SendFeedbackModalProps) {
  const [description, setDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setDescription(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsPaused(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening && !isPaused) {
          recognitionRef.current?.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, isPaused]);

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

  const startDictation = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setIsPaused(false);
      recognitionRef.current.start();
    }
  };

  const pauseDictation = () => {
    if (recognitionRef.current) {
      setIsPaused(true);
      recognitionRef.current.stop();
    }
  };

  const resumeDictation = () => {
    if (recognitionRef.current) {
      setIsPaused(false);
      recognitionRef.current.start();
    }
  };

  const stopDictation = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      setIsPaused(false);
      recognitionRef.current.stop();
    }
  };

  const handleSubmit = () => {
    // Handle feedback submission here
    console.log('Feedback:', { description, image: uploadedImage, category: selectedCategory });
    
    // Stop dictation if active
    if (isListening) {
      stopDictation();
    }
    
    // Reset form
    setDescription('');
    setUploadedImage(null);
    setUploadedFileName(null);
    setSelectedCategory('');
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
            <h2 className="text-[20px] font-semibold text-[#1C1E21]">Help us improve</h2>
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
              <label htmlFor="feedback-description" className="block text-[15px] font-semibold text-[#1C1E21] mb-1.5">
                Share your feedback or report a bug
              </label>
              <p className="text-[14px] text-[#6B7280] mb-3">Tell us what you think</p>
              
              {/* Radio Options */}
              <div className="space-y-2 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-category"
                    value="bug"
                    checked={selectedCategory === 'bug'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-[#6366F1] border-[#E6E8EC] focus:ring-2 focus:ring-[#6366F1]/20"
                  />
                  <span className="text-[14px] text-[#1C1E21]">Bug Report</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-category"
                    value="feature"
                    checked={selectedCategory === 'feature'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-[#6366F1] border-[#E6E8EC] focus:ring-2 focus:ring-[#6366F1]/20"
                  />
                  <span className="text-[14px] text-[#1C1E21]">Feature Request</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-category"
                    value="improvement"
                    checked={selectedCategory === 'improvement'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-[#6366F1] border-[#E6E8EC] focus:ring-2 focus:ring-[#6366F1]/20"
                  />
                  <span className="text-[14px] text-[#1C1E21]">Improvement</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="feedback-category"
                    value="performance"
                    checked={selectedCategory === 'performance'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-[#6366F1] border-[#E6E8EC] focus:ring-2 focus:ring-[#6366F1]/20"
                  />
                  <span className="text-[14px] text-[#1C1E21]">Performance Issue</span>
                </label>
              </div>
            </div>

            {/* Describe Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="feedback-description" className="block text-[15px] font-semibold text-[#1C1E21]">
                  Describe your issue
                </label>
                <button
                  onClick={() => {
                    if (!isListening) {
                      startDictation();
                    } else {
                      stopDictation();
                    }
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 ${
                    isListening 
                      ? 'bg-[#FF6B35] hover:bg-[#E55A25]' 
                      : 'bg-[#F8F9FB] hover:bg-[#E6E8EC]'
                  }`}
                  title={isListening ? "Stop dictation" : "Start dictation"}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-[#6B7280]'}`} />
                  {isListening && (
                    <span className="absolute w-8 h-8 bg-[#FF6B35] rounded-full animate-ping opacity-20" />
                  )}
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  id="feedback-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isListening ? "Listening..." : "Type here..."}
                  rows={5}
                  className={`w-full px-3.5 py-3 text-[15px] leading-[1.5] text-[#1C1E21] placeholder:text-[#9CA3AF] bg-white border rounded-[8px] focus:outline-none focus:ring-2 resize-none transition-all duration-150 ${
                    isListening 
                      ? 'border-[#6366F1] ring-2 ring-[#6366F1]/10' 
                      : 'border-[#E6E8EC] focus:border-[#6366F1] focus:ring-[#6366F1]/10'
                  }`}
                />
                
                {/* Dictation Controls */}
                {isListening && description.trim() && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isPaused) {
                          resumeDictation();
                        } else {
                          pauseDictation();
                        }
                      }}
                      className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-white border border-[#E6E8EC] hover:bg-[#F8F9FB] transition-colors duration-150 shadow-sm"
                      title={isPaused ? "Resume" : "Pause"}
                    >
                      <Pause className="w-4 h-4 text-[#6B7280]" />
                    </button>
                    <button
                      onClick={stopDictation}
                      className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] transition-colors duration-150 shadow-sm"
                      title="Done"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Screenshot Section */}
            <div>
              <label className="block text-[15px] font-semibold text-[#1C1E21] mb-1.5">
                Screenshot
              </label>
              <p className="text-[14px] text-[#6B7280] mb-3">Help us understand better</p>

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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[14px] font-medium text-[#1C1E21] bg-white border border-[#E6E8EC] rounded-[8px] hover:bg-[#F8F9FB] transition-colors duration-150"
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
          <div className="flex items-center justify-end gap-3 px-6 pb-3 pt-3 border-t border-[#E6E8EC]">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-medium text-[#6B7280] hover:bg-[#F8F9FB] rounded-[8px] transition-colors duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!description.trim()}
              className="px-4 py-2 text-[14px] font-medium text-white bg-gradient-to-r from-[#221E1F] to-[#6D5F63] hover:from-[#0f0d0e] hover:to-[#4a3d40] rounded-[8px] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-[#221E1F] disabled:hover:to-[#6D5F63]"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
