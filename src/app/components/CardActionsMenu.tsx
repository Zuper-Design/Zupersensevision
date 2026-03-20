import { MoreHorizontal, Pin, Copy } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CardActionsMenuProps {
  onAddToRadar: () => void;
  onPin?: () => void;
  onCopy?: () => void;
}

function RadarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Center dot */}
      <circle cx="8" cy="8" r="1.8" fill="currentColor" />
      {/* Inner ring */}
      <path
        d="M8 4.5a3.5 3.5 0 0 1 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Outer ring */}
      <path
        d="M8 2a6 6 0 0 1 6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sweep line */}
      <line
        x1="8"
        y1="8"
        x2="12.5"
        y2="3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CardActionsMenu({ onAddToRadar, onPin, onCopy }: CardActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddToRadar = () => {
    setIsOpen(false);
    onAddToRadar();
  };

  const handlePin = () => {
    setIsOpen(false);
    onPin?.();
  };

  const handleCopy = () => {
    setIsOpen(false);
    onCopy?.();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/[0.06] active:bg-black/[0.1] transition-all duration-150"
        aria-label="More actions"
      >
        <MoreHorizontal className="w-4 h-4 text-[#9CA3AF] group-hover/card:text-[#6B7280]" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-full mt-1.5 w-[190px] bg-white rounded-xl border border-[#E6E8EC] shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-50"
            >
              <button
                onClick={handleAddToRadar}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[#FFF4ED] transition-colors duration-150 text-left group/radar"
              >
                <div className="w-5 h-5 rounded-md bg-[#FFF4ED] group-hover/radar:bg-[#FD5000]/15 flex items-center justify-center transition-colors duration-150">
                  <RadarIcon className="w-3.5 h-3.5 text-[#FD5000]" />
                </div>
                <span className="text-[13px] font-medium text-[#1C1E21]">Add to Radar</span>
              </button>

              <button
                onClick={handlePin}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[#F3F4F6] transition-colors duration-150 text-left"
              >
                <div className="w-5 h-5 rounded-md bg-[#F3F4F6] flex items-center justify-center">
                  <Pin className="w-3 h-3 text-[#6B7280]" />
                </div>
                <span className="text-[13px] text-[#1C1E21]">Pin to top</span>
              </button>

              <button
                onClick={handleCopy}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[#F3F4F6] transition-colors duration-150 text-left"
              >
                <div className="w-5 h-5 rounded-md bg-[#F3F4F6] flex items-center justify-center">
                  <Copy className="w-3 h-3 text-[#6B7280]" />
                </div>
                <span className="text-[13px] text-[#1C1E21]">Copy content</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}