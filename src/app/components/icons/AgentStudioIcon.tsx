import type { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
  /** 'purple' (default) or 'orange' (AU user). */
  variant?: 'purple' | 'orange';
  /** Accepted for call-site compatibility; ignored — the artwork is a fixed raster. */
  strokeWidth?: number | string;
  tile?: boolean;
};

/**
 * Agent Studio logo — the exact source artwork (transparent PNG).
 * Rendered as an <img> so it stays pixel-identical at every size.
 */
export function AgentStudioIcon({ className, style, variant = 'purple' }: Props) {
  return (
    <img
      src={variant === 'orange' ? '/agent-studio-au.png' : '/agent-studio.png'}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
      style={{ objectFit: 'contain', ...style }}
    />
  );
}
