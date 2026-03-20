import { useState, useEffect } from 'react';
import { X, Maximize2, Pause, Play } from 'lucide-react';

interface VoiceListeningIndicatorProps {
  isListening: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  transcribedText?: string;
}

type VoiceState = 'waiting' | 'listening' | 'processing' | 'responding';

export function VoiceListeningIndicator({ isListening, onClose, onExpand, transcribedText = '' }: VoiceListeningIndicatorProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('waiting');
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Simulate state changes for demo purposes
  useEffect(() => {
    if (!isListening) return;

    setVoiceState('waiting');
    
    // Demo: cycle through states
    const timer1 = setTimeout(() => setVoiceState('listening'), 3000);
    const timer2 = setTimeout(() => setVoiceState('processing'), 12000);
    const timer3 = setTimeout(() => setVoiceState('responding'), 14000);
    const timer4 = setTimeout(() => setVoiceState('waiting'), 20000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isListening]);

  // Handle mouse drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!isListening) return null;

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start dragging if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const stateConfig = {
    waiting: {
      label: 'Waiting',
      color: 'bg-[#9CA3AF]',
      ringColor: 'bg-[#9CA3AF]',
    },
    listening: {
      label: 'Listening',
      color: 'bg-[#FD5000]',
      ringColor: 'bg-[#FD5000]',
    },
    processing: {
      label: 'Processing',
      color: 'bg-amber-400',
      ringColor: 'bg-amber-500',
    },
    responding: {
      label: 'Responding',
      color: 'bg-[#10B981]',
      ringColor: 'bg-[#10B981]',
    },
  };

  const currentState = stateConfig[voiceState];

  return (
    <div 
      className="fixed z-50 transition-all duration-500 ease-out" 
      style={{ 
        left: position.x ? `${position.x}px` : '50%', 
        top: position.y ? `${position.y}px` : 'auto',
        bottom: position.y ? 'auto' : '2rem',
        transform: position.x ? 'none' : 'translateX(-50%)',
      }}
    >
      <div className="relative">
        {/* Main pill container */}
        
      </div>
    </div>
  );
}