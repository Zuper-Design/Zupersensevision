import { Copy, RefreshCw, ThumbsUp, ThumbsDown, Crosshair } from 'lucide-react';

interface MessageToolbarProps {
  hideOnIdle?: boolean;
  onAddToRadar?: () => void;
}

export function MessageToolbar({ hideOnIdle = false, onAddToRadar }: MessageToolbarProps) {
  return (
    <div className="flex items-center mt-1.5">
      {/* Left: Add to Radar — always visible */}
      <div className="flex-1">
        {onAddToRadar && (
          <button
            onClick={onAddToRadar}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[12px] text-[#9CA3AF] hover:text-[#FD5000] hover:bg-[#FFF4ED] transition-all duration-150"
            style={{ fontWeight: 500 }}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Add to Radar</span>
          </button>
        )}
      </div>

      {/* Right: icon actions */}
      <div className="flex items-center gap-0.5">
        <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Copy">
          <Copy className="w-[14px] h-[14px] text-[#9CA3AF]" />
        </button>
        <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Regenerate">
          <RefreshCw className="w-[14px] h-[14px] text-[#9CA3AF]" />
        </button>
        <div className="w-px h-3 bg-[#E6E8EC] mx-1" />
        <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Thumbs up">
          <ThumbsUp className="w-[14px] h-[14px] text-[#9CA3AF]" />
        </button>
        <button className="p-1 rounded-md hover:bg-[#F3F4F6] transition-colors duration-150" aria-label="Thumbs down">
          <ThumbsDown className="w-[14px] h-[14px] text-[#9CA3AF]" />
        </button>
      </div>
    </div>
  );
}
