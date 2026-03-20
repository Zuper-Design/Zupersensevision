import { X, Radar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface RadarSuccessToastProps {
  isVisible: boolean;
  radarName: string;
  radarEmoji?: string;
  onClose: () => void;
  onGoToRadar: () => void;
}

export function RadarSuccessToast({ isVisible, radarName, radarEmoji, onClose, onGoToRadar }: RadarSuccessToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-6 right-6 z-[200] max-w-[360px]"
        >
          <div className="bg-white rounded-xl border border-[#E6E8EC] shadow-[0_8px_30px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Top progress bar that drains over 3s */}
            <div className="h-[2px] bg-[#F3F4F6] w-full relative overflow-hidden">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-[#FD5000] absolute left-0 top-0"
              />
            </div>

            <div className="px-4 py-3.5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF4ED] flex items-center justify-center flex-shrink-0">
                    <Radar className="w-4 h-4 text-[#FD5000]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 600 }}>
                      Added to Radar
                    </p>
                    <p className="text-[12px] text-[#6B7280] truncate mt-0.5">
                      Saved to {radarEmoji && <span className="mr-1">{radarEmoji}</span>}{radarName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors flex-shrink-0 mt-0.5"
                  aria-label="Dismiss"
                >
                  <X className="w-3.5 h-3.5 text-[#9CA3AF]" />
                </button>
              </div>

              {/* Hint + CTA */}
              <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
                <p className="text-[11px] text-[#9CA3AF]">
                  Switch to <span className="text-[#6B7280]" style={{ fontWeight: 500 }}>Radar</span> view in the top nav to see all saved cards
                </p>
                <button
                  onClick={() => {
                    onGoToRadar();
                    onClose();
                  }}
                  className="flex items-center gap-1 text-[12px] text-[#FD5000] hover:underline flex-shrink-0 ml-3 cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  View
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
