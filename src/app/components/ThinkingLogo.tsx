interface ThinkingLogoProps {
  size?: number;
  animationType?: 'wave' | 'spiral' | 'pulse' | 'scan' | 'ripple' | 'snake';
}

export function ThinkingLogo({ size = 40, animationType = 'spiral' }: ThinkingLogoProps) {
  // 3x3 grid positions
  const squares = [
    // Row 0
    { x: 0, y: 0, index: 0 },
    { x: 14, y: 0, index: 1 },
    { x: 28, y: 0, index: 2 },
    // Row 1
    { x: 0, y: 14, index: 3 },
    { x: 14, y: 14, index: 4 },
    { x: 28, y: 14, index: 5 },
    // Row 2
    { x: 0, y: 28, index: 6 },
    { x: 14, y: 28, index: 7 },
    { x: 28, y: 28, index: 8 },
  ];

  return (
    <div className="thinking-logo-container" style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`thinking-logo thinking-${animationType}`}
      >
        {squares.map((square) => (
          <rect
            key={square.index}
            className={`square sq-${square.index}`}
            x={square.x}
            y={square.y}
            width="12"
            height="12"
            rx="3"
            fill="#D9D9D9"
          />
        ))}
      </svg>

      <style>{`
        /* Base animation keyframes */
        @keyframes thinkingPulse {
          0%, 100% {
            fill: #D9D9D9;
            opacity: 0.6;
          }
          50% {
            fill: #EB5D2A;
            opacity: 1;
          }
        }

        @keyframes thinkingGlow {
          0%, 100% {
            fill: #D9D9D9;
            opacity: 0.5;
            filter: brightness(1);
          }
          50% {
            fill: #EB5D2A;
            opacity: 1;
            filter: brightness(1.2);
          }
        }

        .thinking-logo .square {
          animation: thinkingPulse 2s ease-in-out infinite;
        }

        /* WAVE Animation - Left to Right */
        .thinking-wave .sq-0, .thinking-wave .sq-3, .thinking-wave .sq-6 {
          animation-delay: 0s;
        }
        .thinking-wave .sq-1, .thinking-wave .sq-4, .thinking-wave .sq-7 {
          animation-delay: 0.15s;
        }
        .thinking-wave .sq-2, .thinking-wave .sq-5, .thinking-wave .sq-8 {
          animation-delay: 0.3s;
        }

        /* SPIRAL Animation - From outside to center */
        .thinking-spiral .square {
          animation: thinkingGlow 2s ease-in-out infinite;
        }
        .thinking-spiral .sq-0 { animation-delay: 0s; }
        .thinking-spiral .sq-1 { animation-delay: 0.1s; }
        .thinking-spiral .sq-2 { animation-delay: 0.2s; }
        .thinking-spiral .sq-5 { animation-delay: 0.3s; }
        .thinking-spiral .sq-8 { animation-delay: 0.4s; }
        .thinking-spiral .sq-7 { animation-delay: 0.5s; }
        .thinking-spiral .sq-6 { animation-delay: 0.6s; }
        .thinking-spiral .sq-3 { animation-delay: 0.7s; }
        .thinking-spiral .sq-4 { animation-delay: 0.8s; }

        /* PULSE Animation - Random pulsing */
        .thinking-pulse .square {
          animation: thinkingPulse 1.6s ease-in-out infinite;
        }
        .thinking-pulse .sq-0 { animation-delay: 0.5s; }
        .thinking-pulse .sq-1 { animation-delay: 0.2s; }
        .thinking-pulse .sq-2 { animation-delay: 0.8s; }
        .thinking-pulse .sq-3 { animation-delay: 0.1s; }
        .thinking-pulse .sq-4 { animation-delay: 0.6s; }
        .thinking-pulse .sq-5 { animation-delay: 0.9s; }
        .thinking-pulse .sq-6 { animation-delay: 0.3s; }
        .thinking-pulse .sq-7 { animation-delay: 0.7s; }
        .thinking-pulse .sq-8 { animation-delay: 0.4s; }

        /* SCAN Animation - Horizontal scanning */
        .thinking-scan .square {
          animation: thinkingGlow 1.8s ease-in-out infinite;
        }
        .thinking-scan .sq-0, .thinking-scan .sq-1, .thinking-scan .sq-2 {
          animation-delay: 0s;
        }
        .thinking-scan .sq-3, .thinking-scan .sq-4, .thinking-scan .sq-5 {
          animation-delay: 0.3s;
        }
        .thinking-scan .sq-6, .thinking-scan .sq-7, .thinking-scan .sq-8 {
          animation-delay: 0.6s;
        }

        /* RIPPLE Animation - From center outward */
        .thinking-ripple .square {
          animation: thinkingPulse 2s ease-in-out infinite;
        }
        .thinking-ripple .sq-4 { animation-delay: 0s; } /* Center */
        .thinking-ripple .sq-1, .thinking-ripple .sq-3, .thinking-ripple .sq-5, .thinking-ripple .sq-7 {
          animation-delay: 0.2s;
        }
        .thinking-ripple .sq-0, .thinking-ripple .sq-2, .thinking-ripple .sq-6, .thinking-ripple .sq-8 {
          animation-delay: 0.4s;
        }

        /* SNAKE Animation - Following a path */
        .thinking-snake .square {
          animation: thinkingGlow 2.4s ease-in-out infinite;
        }
        .thinking-snake .sq-0 { animation-delay: 0s; }
        .thinking-snake .sq-3 { animation-delay: 0.15s; }
        .thinking-snake .sq-6 { animation-delay: 0.3s; }
        .thinking-snake .sq-7 { animation-delay: 0.45s; }
        .thinking-snake .sq-8 { animation-delay: 0.6s; }
        .thinking-snake .sq-5 { animation-delay: 0.75s; }
        .thinking-snake .sq-2 { animation-delay: 0.9s; }
        .thinking-snake .sq-1 { animation-delay: 1.05s; }
        .thinking-snake .sq-4 { animation-delay: 1.2s; }
      `}</style>
    </div>
  );
}