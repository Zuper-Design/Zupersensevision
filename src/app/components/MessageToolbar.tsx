import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Radar } from 'lucide-react';

interface MessageToolbarProps {
  hideOnIdle?: boolean;
}

export function MessageToolbar({ hideOnIdle = false }: MessageToolbarProps) {
  return (
    <div className={`flex items-center justify-end mt-0.5 ${hideOnIdle ? 'opacity-0 hover:opacity-100 transition-opacity duration-200' : ''}`}>
      <div className="flex items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          
          <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Copy">
            <Copy className="w-[14px] h-[14px] text-[#9CA3AF]" />
          </button>
          <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Regenerate">
            <RefreshCw className="w-[14px] h-[14px] text-[#9CA3AF]" />
          </button>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Thumbs up">
            <ThumbsUp className="w-[14px] h-[14px] text-[#9CA3AF]" />
          </button>
          <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Thumbs down">
            <ThumbsDown className="w-[14px] h-[14px] text-[#9CA3AF]" />
          </button>
        </div>
      </div>
    </div>
  );
}