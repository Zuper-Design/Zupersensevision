import React, { useState, useEffect } from 'react';

interface StreamingTextProps {
  text: string;
  onComplete?: () => void;
}

export const StreamingText: React.FC<StreamingTextProps> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 20); // 20ms per character

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      setTimeout(onComplete, 500);
    }
  }, [currentIndex, text, onComplete]);

  return (
    <div className="text-[15px] text-[#1C1E21] leading-relaxed space-y-4">
      {displayedText.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {currentIndex < text.length && (
        <span className="inline-block w-[2px] h-[20px] bg-[#6366F1] animate-pulse ml-0.5"></span>
      )}
    </div>
  );
};
