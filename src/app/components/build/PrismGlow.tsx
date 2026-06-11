// PrismGlow — the ambient spectrum field that signals AI activity
// (DESIGN.md §4/§7). Blurred prism blobs drifting beneath a frosted surface;
// never text color, never a fill. Pure CSS — no WebGL cost.

interface PrismGlowProps {
  /** 0–1 opacity multiplier for the whole field */
  intensity?: number;
  /** drift animation on/off (respect reduceMotion upstream) */
  animate?: boolean;
  /** blur radius in px — smaller for thin trays, larger for full overlays */
  blur?: number;
  className?: string;
  style?: React.CSSProperties;
}

const BLOBS: {
  color: string;
  left: string;
  top: string;
  w: string;
  h: string;
  dur: number;
  delay: number;
}[] = [
  { color: 'var(--prism-pink)',     left: '-12%', top: '-40%', w: '46%', h: '170%', dur: 7.5, delay: 0 },
  { color: 'var(--prism-red)',      left: '14%',  top: '-20%', w: '38%', h: '150%', dur: 6.2, delay: -1.8 },
  { color: 'var(--prism-amber)',    left: '34%',  top: '-45%', w: '42%', h: '180%', dur: 8.4, delay: -3.1 },
  { color: 'var(--prism-lavender)', left: '56%',  top: '-25%', w: '40%', h: '160%', dur: 6.8, delay: -2.2 },
  { color: 'var(--prism-blue)',     left: '76%',  top: '-40%', w: '44%', h: '175%', dur: 7.9, delay: -4.4 },
];

export default function PrismGlow({
  intensity = 1,
  animate = true,
  blur = 36,
  className = '',
  style,
}: PrismGlowProps) {
  return (
    <div
      aria-hidden
      className={'pointer-events-none absolute inset-0 overflow-hidden ' + className}
      style={style}
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            top: b.top,
            width: b.w,
            height: b.h,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at center, ${b.color} 0%, transparent 68%)`,
            filter: `blur(${blur}px)`,
            opacity: 0.65 * intensity,
            animation: animate
              ? `prism-drift ${b.dur}s ease-in-out ${b.delay}s infinite`
              : undefined,
            willChange: animate ? 'transform' : undefined,
          }}
        />
      ))}
    </div>
  );
}
