import { MoreHorizontal, Pencil, PinOff } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CardActionsMenuProps {
  onEdit?: () => void;
  onUnpin?: () => void;
}

export function CardActionsMenu({ onEdit, onUnpin }: CardActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit?.();
  };

  const handleUnpin = () => {
    setIsOpen(false);
    onUnpin?.();
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
              className="absolute right-0 top-full mt-1.5 w-[150px] bg-white rounded-xl border border-[#E6E8EC] shadow-[0_8px_24px_rgba(0,0,0,0.12)] py-1.5 z-50"
            >
              <button
                onClick={handleEdit}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[#F3F4F6] transition-colors duration-150 text-left"
              >
                <div className="w-5 h-5 rounded-md bg-[#F3F4F6] flex items-center justify-center">
                  <Pencil className="w-3 h-3 text-[#6B7280]" />
                </div>
                <span className="text-[13px] text-[#1C1E21]">Edit</span>
              </button>

              <button
                onClick={handleUnpin}
                className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-[#FFF4F4] transition-colors duration-150 text-left"
              >
                <div className="w-5 h-5 rounded-md bg-[#FFF4F4] flex items-center justify-center">
                  <PinOff className="w-3 h-3 text-[#EF4444]" />
                </div>
                <span className="text-[13px] text-[#EF4444]">Unpin</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
