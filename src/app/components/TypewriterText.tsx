import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypewriterText({ text, speed = 18, onComplete }: TypewriterTextProps) {
  const [displayedLength, setDisplayedLength] = useState(0);

  useEffect(() => {
    if (displayedLength < text.length) {
      const timeout = setTimeout(() => {
        // Skip ahead faster through markdown bold markers
        let next = displayedLength + 1;
        if (text[displayedLength] === '*' && text[displayedLength + 1] === '*') {
          next = displayedLength + 2;
        }
        setDisplayedLength(next);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [displayedLength, text, speed, onComplete]);

  const visible = text.slice(0, displayedLength);

  // Simple bold markdown rendering
  const parts = visible.split(/(\*\*[^*]*\*?\*?)/g);

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <span key={i} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</span>;
        }
        // Handle partial bold (still typing inside **)
        if (part.startsWith('**')) {
          return <span key={i} style={{ fontWeight: 600 }}>{part.slice(2)}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
      {displayedLength < text.length && (
        <span className="inline-block w-[2px] h-[14px] bg-[#1C1E21] ml-[1px] align-middle animate-pulse" />
      )}
    </span>
  );
}
