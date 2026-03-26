import { useState, useEffect } from 'react';

interface SenseLogoProps {
  size?: number;
  animated?: boolean;
  animationType?: string; // For future expansion
  monochrome?: boolean; // For monochrome/grayscale version
}

// Predefined patterns - true = orange, false = gray
const PATTERNS = {
  // Letter patterns
  S: [true, false, true, false, true, false, true, false, true], // Original S shape
  L: [true, false, false, true, false, false, true, true, true], // L shape
  T: [true, true, true, false, true, false, false, true, false], // T shape
  C: [true, true, true, true, false, false, true, true, true], // C shape
  E: [true, true, true, true, true, false, true, true, true], // E shape
  H: [true, false, true, true, true, true, true, false, true], // H shape
  
  // Geometric patterns
  plus: [false, true, false, true, true, true, false, true, false], // + shape
  x: [true, false, true, false, true, false, true, false, true], // X / corners
  checkerboard: [true, false, true, false, true, false, true, false, true], // Checkerboard
  diagonal: [true, false, false, false, true, false, false, false, true], // Diagonal line
  border: [true, true, true, true, false, true, true, true, true], // Border/frame
  corners: [true, false, true, false, false, false, true, false, true], // Four corners
  center: [false, false, false, false, true, false, false, false, false], // Center only
  sides: [false, true, false, true, false, true, false, true, false], // Four sides
  topHeavy: [true, true, true, true, true, false, false, false, false], // Top heavy
  bottomHeavy: [false, false, false, false, true, true, true, true, true], // Bottom heavy
};

// Pattern cycle sequence for animation
const PATTERN_SEQUENCE = [
  'corners', 'plus', 'diagonal', 'x', 'border', 'checkerboard', 'center', 'sides', 'topHeavy', 'bottomHeavy'
];

export function SenseLogo({ size = 40, animated = false, animationType, monochrome = false }: SenseLogoProps) {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Define the 9 rectangles in a 3x3 grid
  const baseRectangles = [
    { x: 0, y: 0, id: 0 },        // Top left
    { x: 0, y: 15.75, id: 1 },   // Middle left
    { x: 0, y: 31.5, id: 2 },     // Bottom left
    { x: 15.75, y: 0, id: 3 },   // Top center
    { x: 15.75, y: 15.75, id: 4 }, // Middle center
    { x: 15.75, y: 31.5, id: 5 }, // Bottom center
    { x: 31.5, y: 0, id: 6 },      // Top right
    { x: 31.5, y: 15.75, id: 7 }, // Middle right
    { x: 31.5, y: 31.5, id: 8 },   // Bottom right
  ];

  // Get current pattern
  const currentPattern = isAnimating 
    ? PATTERNS[PATTERN_SEQUENCE[currentPatternIndex] as keyof typeof PATTERNS]
    : PATTERNS.S; // Default to S pattern when not animating

  // Apply current pattern
  const rectangles = baseRectangles.map((rect, index) => ({
    ...rect,
    initialOrange: currentPattern[index]
  }));

  // Trigger pattern cycling animation
  useEffect(() => {
    if (animated) {
      const runAnimation = () => {
        setIsAnimating(true);
        let cycleIndex = 0;
        
        // Cycle through patterns every 300ms
        const cycleInterval = setInterval(() => {
          cycleIndex = (cycleIndex + 1) % PATTERN_SEQUENCE.length;
          setCurrentPatternIndex(cycleIndex);
        }, 300);

        // Stop cycling after 3 seconds (10 patterns × 300ms) and return to S
        const stopTimeout = setTimeout(() => {
          clearInterval(cycleInterval);
          setIsAnimating(false);
          setCurrentPatternIndex(0); // Reset to S pattern
        }, 3000);

        return () => {
          clearInterval(cycleInterval);
          clearTimeout(stopTimeout);
        };
      };

      // Run animation immediately
      const cleanup = runAnimation();

      // Then repeat every 5.5 seconds (3s animation + 2.5s S pattern display)
      const loopInterval = setInterval(() => {
        runAnimation();
      }, 5500);

      return () => {
        cleanup?.();
        clearInterval(loopInterval);
        setIsAnimating(false);
        setCurrentPatternIndex(0);
      };
    }
  }, [animated]);

  const orangeColor = monochrome ? '#6B7280' : '#FD5000';
  const grayColor = monochrome ? '#D1D5DB' : '#FDDCC4';
  const rectSize = 11.5;
  const gap = 4.25;

  const viewBoxSize = rectSize * 3 + gap * 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {[0, 1, 2].map(row =>
        [0, 1, 2].map(col => {
          const index = row * 3 + col;
          const isOrange = rectangles[index]?.initialOrange;
          return (
            <rect
              key={`${row}-${col}`}
              x={col * (rectSize + gap)}
              y={row * (rectSize + gap)}
              width={rectSize}
              height={rectSize}
              rx={2}
              fill={isOrange ? orangeColor : grayColor}
              style={{
                transition: 'fill 0.2s ease',
              }}
            />
          );
        })
      )}
    </svg>
  );
}