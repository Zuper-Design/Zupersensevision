Design Radar page, Zuper Sense. Use existing Radar page as exact ref for all styling, spacing, typography, card anatomy, page shell. No new visual language — extend what exists. Light theme, white bg, clean minimal.

---

**Page shell — reproduce exactly.**

Top bar: left = amber lightning bolt icon, bold "My Workspace" + "1" badge + dropdown chevron. Centre: three tab pills — "Canvas", "Chat", "Radar" — "Radar" active, visible border/filled state matching existing design. Right: "Just now" muted grey + circular refresh icon.

Below top bar, page header. Left: amber lightning bolt 32px, page title "My Workspace" large bold dark. Below title, muted grey subtitle — "5 cards · Pinned insights and saved items". No other elements.

---

**Card grid layout.**

All five cards follow exact anatomy of existing DSO card: bold title top-left, muted grey subtitle below, chart filling middle with generous vertical padding, thin top-border separator, four-stat summary row below separator, footer small muted grey "Mar 11 · From conversation". White bg, rounded corners matching existing card, same subtle border/shadow as DSO card. Internal padding identical.

Row 1: two cards side-by-side equal width, gap matching existing card margin. Card 1 left, Card 2 right.
Row 2: two cards side-by-side equal width, same gap. Card 3 left, Card 4 right.
Row 3: one full-width card spanning entire content width. Card 5.

---

**Card 1 — Revenue MTD vs Target.**

Title: "Revenue MTD vs Target" bold dark.
Subtitle: "Daily cumulative revenue against monthly target pace" muted grey.

Chart: Line chart identical in style to DSO card. Two lines, dot markers each data point. Line 1 — "Actual Revenue" — solid dark navy. Line 2 — "Target Pace" — solid green matching Industry Avg green from DSO card. X-axis day markers: 1, 7, 14, 21, 28. Y-axis dollar values: 0, 100k, 200k, 300k. Actual Revenue starts lower, curves upward, crosses above Target Pace ~day 18, ends higher. Light green fill between lines where Actual > Target. Legend below chart identical DSO style: coloured square + label — "Actual Revenue", "Target Pace".

Stat row — four values, thin top border separator:
- "Revenue MTD" · "$284,500" green
- "Monthly Target" · "$260,000" dark
- "Gap to Target" · "+$24,500" green
- "Days Remaining" · "20" muted grey

Footer: "Mar 11 · From conversation"

---

**Card 2 — Overdue Invoices.**

Title: "Overdue Invoices" bold dark.
Subtitle: "Invoice aging breakdown by overdue period" muted grey.

Chart: Horizontal bar chart. Three bars, generous spacing, label left, dollar value right. Bars 10px height, fully rounded ends, same border radius as page pill components. Bar 1: "0–30 days" · amber (#F59E0B) · "$14,200". Bar 2: "31–60 days" · orange (#EA580C) · "$11,800". Bar 3: "60+ days" · red (#DC2626) · "$12,200". Widths proportional — 60+ days longest. Light grey horizontal grid lines same as DSO chart. No Y-axis. X-axis: 0, 5k, 10k, 15k below bars.

Stat row:
- "Total Overdue" · "$38,200" red
- "Invoices" · "14" dark
- "Avg Days Overdue" · "22 days" amber
- "Collected MTD" · "$197,400" green

Footer: "Mar 11 · From conversation"

---

**Card 3 — Quote-to-Invoice Conversion.**

Title: "Quote-to-Invoice Conversion" bold dark.
Subtitle: "Monthly conversion rate trend over the last 8 months" muted grey.

Chart: Line chart, identical structure to DSO card — two lines, dot markers, same axis/grid style. X-axis months: Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb. Y-axis: 0, 25, 50, 75, 100 (percentage). Line 1 — "Your Rate" — red matching DSO "Your DSO" line, values ~52, 55, 53, 58, 60, 59, 62, 61, gentle upward trend. Line 2 — "Industry Avg" — green matching DSO card, flat ~55 all months. Legend: "Your Rate", "Industry Avg" same DSO legend style.

Stat row:
- "Current Rate" · "61%" green
- "Industry Avg" · "55%" green
- "Quotes Sent MTD" · "63" dark
- "Quotes Won MTD" · "38" dark

Footer: "Mar 11 · From conversation"

---

**Card 4 — Crew Utilisation.**

Title: "Crew Utilisation" bold dark.
Subtitle: "Weekly utilisation rate by crew — target 80%" muted grey.

Chart: Horizontal bar chart, four bars one per crew. Same bar style as Card 2 — 10px height, rounded ends, label left, value right. Bar 1: "Crew A" · 86% · green. Bar 2: "Crew B" · 82% · green. Bar 3: "Crew C" · 71% · amber. Bar 4: "Crew D" · 64% · amber. Vertical dashed reference line at 80%, labelled "Target 80%" 10px muted grey at top of chart area. Bars proportional. X-axis: 0, 25, 50, 75, 100%. Same light grey horizontal grid lines.

Stat row:
- "Overall Utilisation" · "74%" amber
- "Above Target" · "2 crews" green
- "Below Target" · "2 crews" amber
- "Field Hours MTD" · "1,248 hrs" dark

Footer: "Mar 11 · From conversation"

---

**Card 5 — Jobs Completed vs At Risk.**

Full width — spans entire content area, same left/right edges as two-card rows above.

Title: "Jobs — Completed vs At Risk" bold dark.
Subtitle: "Weekly job completion and active risk flags — current week" muted grey.

Chart: Line chart, two lines, same style/dot markers as DSO card, wider due to full-width card. X-axis: Mon, Tue, Wed, Thu, Fri, Sat, Sun. Y-axis: 0, 10, 20, 30, 40. Line 1 — "Completed" — green, trending upward: ~12, 18, 22, 28, 32, 35, 38. Line 2 — "At Risk" — red, flat with slight uptick: ~8, 7, 9, 8, 7, 8, 7. Rising green vs flat red tells operational story. Legend: "Completed", "At Risk" same legend style.

Stat row:
- "Completed This Week" · "134" green
- "At Risk Right Now" · "7" amber
- "On-Time Rate" · "91%" dark
- "Avg Days to Complete" · "3.2 days" dark

Footer: "Mar 11 · From conversation"

---

**Style constraints.**

Reproduce existing page shell, typography, card border, card shadow, chart grid lines, axis label style, dot marker style, legend style, stat row separator, footer text style exactly from DSO card ref. No new visual elements, colours, components not already in existing Radar page. Only colours across all charts: red (#EF4444 or matching), green (#22C55E or matching), amber (#F59E0B), dark navy for neutral lines — all matching existing. Five cards must look like they were always part of this Radar, designed by same hand as DSO card.

**Deliver one full-page frame at 1440px width** — complete Radar page: top bar with workspace switcher, page header, all five cards in three-row grid. No artboard bg — white page, white cards, light grey borders, exactly as reference.