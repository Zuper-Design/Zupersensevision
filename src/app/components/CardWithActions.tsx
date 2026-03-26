import { ReactNode } from 'react';
import { Crosshair } from 'lucide-react';
import { CardActionsMenu } from './CardActionsMenu';

interface CardWithActionsProps {
  children: ReactNode;
  onAddToRadar: () => void;
  onEdit?: () => void;
  onUnpin?: () => void;
  className?: string;
}

export function CardWithActions({ children, onAddToRadar, onEdit, onUnpin, className = '' }: CardWithActionsProps) {
  return (
    <div className={`relative group/card ${className}`} style={{ borderRadius: 'inherit' }}>
      {children}
      {/* Hover actions: Add to Radar button + three-dot menu */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover/card:opacity-100 transition-all duration-200 flex items-center gap-1">
        <button
          onClick={onAddToRadar}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-transparent text-[#9CA3AF] hover:bg-white hover:border-[#E6E8EC] hover:text-[#FD5000] hover:shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-150 text-[12px]"
          style={{ fontWeight: 500 }}
        >
          <Crosshair className="w-3 h-3" />
          <span>Add to Radar</span>
        </button>
        <CardActionsMenu onEdit={onEdit} onUnpin={onUnpin} />
      </div>
    </div>
  );
}
