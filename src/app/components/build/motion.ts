// Motion presets — DESIGN.md §6.
// Dia base: 0.2s ease micro-interactions + theatrical cubic-bezier sweeps.
// Documented override: spring physics for gestures, gallery zoom, and
// shared-element transitions, so the product feels alive.

export const springs = {
  /** Controls, toggles, small state flips */
  snappy: { type: 'spring', stiffness: 480, damping: 36 } as const,
  /** Panels, drawers, sheets */
  smooth: { type: 'spring', stiffness: 320, damping: 32 } as const,
  /** Gallery zoom, shared elements, gesture follow-through */
  bouncy: { type: 'spring', stiffness: 300, damping: 24 } as const,
};

export const easings = {
  /** Theatrical exit/reveal — gradient sweeps, overlays */
  exit: [0.23, 1, 0.32, 1] as const,
  /** General-purpose smooth */
  smooth: [0.22, 1, 0.36, 1] as const,
};

/** Dia micro-interaction duration */
export const MICRO = 0.2;
