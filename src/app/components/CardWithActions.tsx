import { ReactNode } from 'react';
import { CardActionsMenu } from './CardActionsMenu';

interface CardWithActionsProps {
  children: ReactNode;
  onAddToRadar: () => void;
  onPin?: () => void;
  onCopy?: () => void;
  className?: string;
}

export function CardWithActions({ children, onAddToRadar, onPin, onCopy, className = '' }: CardWithActionsProps) {
  return (
    <div className={`relative group/card ${className}`} style={{ borderRadius: 'inherit' }}>
      {children}
      {/* Three-dot menu inside the card's top-right padding area */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover/card:opacity-100 transition-all duration-200">
        <CardActionsMenu
          onAddToRadar={onAddToRadar}
          onPin={onPin}
          onCopy={onCopy}
        />
      </div>
    </div>
  );
}