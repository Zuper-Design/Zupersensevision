import { Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';

interface RadarSuccessToastProps {
  isVisible: boolean;
  onClose: () => void;
  onGoToRadar: () => void;
}

export function RadarSuccessToast({ isVisible, onClose, onGoToRadar }: RadarSuccessToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="fixed bottom-5 right-5 z-[200]"
          style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}
        >
          <div
            className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white rounded-xl"
            style={{
              border: '1px solid #E6E8EC',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
          >
            {/* Check badge */}
            <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
            </div>

            {/* Text */}
            <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>
              Added to Radar
            </span>

            {/* Divider */}
            <span className="text-[#E6E8EC]">·</span>

            {/* View link */}
            <button
              onClick={() => { onGoToRadar(); onClose(); }}
              className="flex items-center gap-1 text-[13px] text-[#FD5000] hover:text-[#E04500] transition-colors"
              style={{ fontWeight: 500 }}
            >
              View
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
