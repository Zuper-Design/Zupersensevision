// Sense Build — design tokens (DESIGN.md, "prism on white stationery").
// Single source of truth. Generated apps pull every visual value from here —
// no raw hex/px inside app components — which is how every app Sense Build
// produces ships from the same studio regardless of prompt quality.
//
// Near-achromatic by law: the gray ramp does the everyday work; chroma is
// reserved for real meaning (danger/--red) and AI activity (prism gradient).

export const token = {
  color: {
    brand: {
      primary: '#000000',                 // primary actions — the black pill
      subtle: 'rgba(0,0,0,0.05)',         // tints, selected rows
      hover: '#1A1A1A',
    },
    bg: {
      canvas: '#F8F8F8',                  // page background — white stationery
      surface: '#FFFFFF',                 // opaque card (perf-sensitive tables)
      glass: 'rgba(255,255,255,0.9)',     // frosted card (pair w/ blur(24px))
      muted: '#F0F0F0',                   // recessed wells, inactive controls
    },
    text: {
      primary: '#000000',                 // --ink
      secondary: '#636363',               // --ink-2
      muted: '#959595',                   // --ink-3
      faint: '#D9D9D9',                   // --ink-4
    },
    border: {
      default: 'rgba(0,0,0,0.08)',        // hairline — only where unavoidable
      strong: 'rgba(0,0,0,0.18)',
      hairline: 'rgba(0,0,0,0.06)',
    },
  },

  // Prism spectrum — AI activity ONLY (glow/sweep/refraction; never fills/text)
  prism: {
    pink: '#F6A0E4',
    red: '#FF7A6B',
    amber: '#FFC56B',
    lavender: '#C0AFFF',
    blue: '#6FA8FF',
    gradient:
      'linear-gradient(105deg, #F6A0E4 0%, #FF7A6B 26%, #FFC56B 50%, #C0AFFF 74%, #6FA8FF 100%)',
  },

  // §1.2 Semantic status — meaning carried by ink intensity + dot treatment
  // + the label itself (status is never color-only). Chroma is earned ONLY by
  // danger: overdue / SLA-breach / cancelled keep --red.
  status: {
    neutral: { fg: '#959595', bg: '#F0F0F0', dot: '#D9D9D9' },  // draft, unscheduled
    info:    { fg: '#636363', bg: '#F0F0F0', dot: '#959595' },  // scheduled, sent, in-progress
    success: { fg: '#000000', bg: '#F0F0F0', dot: '#000000' },  // completed, paid, accepted
    warning: { fg: '#636363', bg: '#ECECEC', dot: '#636363' },  // due soon, awaiting approval
    danger:  { fg: '#E5484D', bg: '#FBEAEA', dot: '#E5484D' },  // overdue, SLA breach, cancelled
  },

  // §1.2 Priority — ink ramp carries the scale; urgent (SLA-critical) earns red
  priority: {
    low:    { fg: '#959595', bg: '#F0F0F0', label: 'Low' },
    med:    { fg: '#636363', bg: '#F0F0F0', label: 'Medium' },
    high:   { fg: '#000000', bg: '#ECECEC', label: 'High' },
    urgent: { fg: '#FFFFFF', bg: '#E5484D', label: 'Urgent' },
  },

  // §1.3 Scale tokens (4px base)
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 },
  // Radius floor: nothing sharper than 10px; cards land on 30px
  radius: { sm: 10, md: 12, lg: 16, xl: 20, card: 30, pill: 9999 },
  elev: {
    0: 'none',
    1: '0 2px 8px rgba(0,0,0,0.08)',      // THE shadow — cards
    2: '0 2px 8px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.08)', // popover lift
  },
  // Frosted layering (apply with backdrop-filter: blur(24px))
  glassBlur: 'blur(24px)',

  // §1.3 Type ramp — DM Sans, three weights, nothing above 500.
  // Hierarchy comes from size + the light end (300 display signature).
  type: {
    display: { size: 26, weight: 300, tracking: '-0.03em' },
    h1:      { size: 20, weight: 300, tracking: '-0.025em' },
    h2:      { size: 16, weight: 500, tracking: '-0.01em' },
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
