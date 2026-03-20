import { ReactNode, useState } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-3 py-1.5 bg-[#1C1E21] text-white text-sm rounded-lg whitespace-nowrap pointer-events-none z-50">
          {content}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-[#1C1E21]"></div>
        </div>
      )}
    </div>
  );
}