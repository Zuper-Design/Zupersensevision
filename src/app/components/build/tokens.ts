// Sense Build — design tokens (Spec 2 §1).
// Single source of truth. Generated apps pull every visual value from here —
// no raw hex/px inside app components. Values are Zuper's real palette
// (Guidelines.md + the warm Sense system used across the app), NOT the
// spec's blue placeholder examples.

export const token = {
  color: {
    brand: {
      primary: '#FD5000',   // primary actions, active nav  (color.brand.primary)
      subtle: '#FFF4ED',    // tints, selected rows          (color.brand.subtle)
      hover: '#E04600',
    },
    bg: {
      canvas: '#F8F2EC',    // page background (warm)        (color.bg.canvas)
      surface: '#FFFFFF',   // card background               (color.bg.surface)
      muted: '#FAFAFA',     // recessed surfaces
    },
    text: {
      primary: '#1C1E21',   // color.text.primary
      secondary: '#6B7280', // color.text.secondary
      muted: '#9CA3AF',     // color.text.muted
      faint: '#CBD0D6',
    },
    border: {
      default: '#E6E8EC',   // color.border.default
      strong: '#C9CDD4',    // color.border.strong
      hairline: '#F0F0F2',
    },
  },

  // §1.2 Semantic status — FSM-universal. Status is meaning, never decoration.
  // overdue / SLA-breach is ALWAYS danger. Never color-only (pair w/ icon+label).
  status: {
    neutral: { fg: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },  // draft, unscheduled
    info:    { fg: '#0369A1', bg: '#E0F2FE', dot: '#0EA5E9' },  // scheduled, sent, in-progress
    success: { fg: '#15803D', bg: '#DCFCE7', dot: '#10B981' },  // completed, paid, accepted
    warning: { fg: '#B45309', bg: '#FEF3C7', dot: '#F59E0B' },  // due soon, awaiting approval
    danger:  { fg: '#DC2626', bg: '#FEE2E2', dot: '#EF4444' },  // overdue, SLA breach, cancelled
  },

  // §1.2 Priority scale
  priority: {
    low:    { fg: '#0369A1', bg: '#E0F2FE', label: 'Low' },
    med:    { fg: '#B45309', bg: '#FEF3C7', label: 'Medium' },
    high:   { fg: '#DC2626', bg: '#FEE2E2', label: 'High' },
    urgent: { fg: '#FFFFFF', bg: '#DC2626', label: 'Urgent' },
  },

  // §1.3 Scale tokens (4px base)
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 },
  radius: { sm: 6, md: 10, lg: 14, pill: 9999 },
  elev: {
    0: 'none',
    1: '0 1px 2px rgba(28,30,33,0.04)',                          // card
    2: '0 8px 24px -8px rgba(28,30,33,0.12), 0 2px 6px -2px rgba(28,30,33,0.06)', // popover
  },

  // §1.3 Type ramp — one font family (system stack already loaded), mono for technical
  type: {
    display: { size: 26, weight: 600, tracking: '-0.025em' },
    h1:      { size: 20, weight: 600, tracking: '-0.02em' },
    h2:      { size: 16, weight: 600, tracking: '-0.01em' },
    body:    { size: 13, weight: 400 },
    label:   { size: 12, weight: 500 },
    caption: { size: 11, weight: 400 },
    mono:    { family: 'ui-monospace, SFMono-Regular, Menlo, monospace' },
  },
} as const;

// Status helper — returns the semantic bucket for a domain meaning.
export type StatusKey = keyof typeof token.status;
export function statusFor(meaning: string): StatusKey {
  const m = meaning.toLowerCase();
  if (/(overdue|breach|cancel|fail|reject|error)/.test(m)) return 'danger';
  if (/(due|await|pending|partial|at.?risk|soon)/.test(m)) return 'warning';
  if (/(complete|paid|accept|done|resolved|closed)/.test(m)) return 'success';
  if (/(schedul|sent|progress|assigned|active|online)/.test(m)) return 'info';
  return 'neutral';
}
