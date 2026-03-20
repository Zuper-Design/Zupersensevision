Here's the prompt:

---

**Prompt:**

Design the Radar page for Zuper Sense. Use the existing Radar page as the exact reference for all styling, spacing, typography, card anatomy, and page shell. Do not invent a new visual language — extend what already exists. The page is light theme, white background, clean and minimal.

---

**Page shell — reproduce exactly.**

Top bar: left side shows a lightning bolt icon in amber, bold text "My Workspace" followed by a "1" badge and a dropdown chevron. Centre of the top bar: three tab pills — "Canvas", "Chat", "Radar" — with "Radar" as the active tab, shown with a visible border or filled state matching the existing design. Right side: "Just now" text in muted grey with a circular refresh icon next to it.

Below the top bar, a page header section. Left side: the same amber lightning bolt icon at 32px, next to it the page title "My Workspace" in large bold dark text. Below the title, a subtitle in muted grey — "5 cards · Pinned insights and saved items". No other elements in the header.

---

**Card grid layout.**

All five cards follow the exact anatomy of the existing DSO card without exception: bold title top-left, muted grey subtitle below it, chart filling the middle section with generous vertical padding, a thin top-border separator, a four-stat summary row below the separator, and a footer in small muted grey showing "Mar 11 · From conversation". White background, rounded corners matching the existing card, same subtle border and shadow as the DSO card. Internal padding identical to the existing card.

Row 1: two cards side by side at equal width with a gap between them matching the existing card's margin from the page edge. Card 1 on the left, Card 2 on the right.

Row 2: two cards side by side at equal width, same gap. Card 3 on the left, Card 4 on the right.

Row 3: one full-width card spanning the entire content width. Card 5.

---

**Card 1 — Revenue MTD vs Target.**

Title: "Revenue MTD vs Target" in bold dark text.
Subtitle: "Daily cumulative revenue against monthly target pace" in muted grey.

Chart: Line chart identical in style to the DSO card. Two lines with dot markers at each data point. Line 1 — "Actual Revenue" — solid dark navy line. Line 2 — "Target Pace" — solid green line matching the Industry Avg green from the DSO card. X-axis shows day markers: 1, 7, 14, 21, 28. Y-axis shows dollar values: 0, 100k, 200k, 300k. Actual Revenue line starts lower and curves upward, crossing above Target Pace around day 18 and ending higher. Light green fill between the two lines where Actual is above Target. Legend below the chart identical to DSO card style: coloured square + label for each line — "Actual Revenue" and "Target Pace".

Stat row — four values in the same layout as the DSO card, separated by the thin top border:
- Label "Revenue MTD" · value "$284,500" in green
- Label "Monthly Target" · value "$260,000" in dark
- Label "Gap to Target" · value "+$24,500" in green
- Label "Days Remaining" · value "20" in muted grey

Footer: "Mar 11 · From conversation"

---

**Card 2 — Overdue Invoices.**

Title: "Overdue Invoices" in bold dark text.
Subtitle: "Invoice aging breakdown by overdue period" in muted grey.

Chart: Horizontal bar chart. Three bars stacked vertically with generous spacing between them. Each bar has a label on the left and a dollar value on the right. Bar heights are 10px, fully rounded ends, same border radius as the page's pill components. Bar 1: label "0–30 days" · bar in amber (#F59E0B) · value "$14,200". Bar 2: label "31–60 days" · bar in orange (#EA580C) · value "$11,800". Bar 3: label "60+ days" · bar in red (#DC2626) · value "$12,200". Bar widths are proportional to value — 60+ days bar is the longest. Background grid lines are the same light grey horizontal rules as the DSO chart. No Y-axis. X-axis shows dollar values at 0, 5k, 10k, 15k below the bars.

Stat row — four values:
- Label "Total Overdue" · value "$38,200" in red
- Label "Invoices" · value "14" in dark
- Label "Avg Days Overdue" · value "22 days" in amber
- Label "Collected MTD" · value "$197,400" in green

Footer: "Mar 11 · From conversation"

---

**Card 3 — Quote-to-Invoice Conversion.**

Title: "Quote-to-Invoice Conversion" in bold dark text.
Subtitle: "Monthly conversion rate trend over the last 8 months" in muted grey.

Chart: Line chart identical in style and structure to the DSO card — two lines, dot markers, same axis style, same grid lines. X-axis months: Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb. Y-axis: 0, 25, 50, 75, 100 showing percentage. Line 1 — "Your Rate" — in red matching the DSO "Your DSO" line, showing values around 52, 55, 53, 58, 60, 59, 62, 61 — a gentle upward trend. Line 2 — "Industry Avg" — in green matching the DSO card, flat around 55 across all months. Legend below: "Your Rate" and "Industry Avg" in the same style as the DSO legend.

Stat row — four values:
- Label "Current Rate" · value "61%" in green
- Label "Industry Avg" · value "55%" in green
- Label "Quotes Sent MTD" · value "63" in dark
- Label "Quotes Won MTD" · value "38" in dark

Footer: "Mar 11 · From conversation"

---

**Card 4 — Crew Utilisation.**

Title: "Crew Utilisation" in bold dark text.
Subtitle: "Weekly utilisation rate by crew — target 80%" in muted grey.

Chart: Horizontal bar chart, four bars — one per crew. Same bar style as Card 2 — 10px height, rounded ends, label left, value right. Bar 1: "Crew A" · 86% · green bar. Bar 2: "Crew B" · 82% · green bar. Bar 3: "Crew C" · 71% · amber bar. Bar 4: "Crew D" · 64% · amber bar. A vertical dashed reference line sits at the 80% position across all four bars, labelled "Target 80%" in 10px muted grey at the top of the chart area. Bars are proportional to percentage. X-axis shows 0, 25, 50, 75, 100 percent markers. Same light grey horizontal grid lines as the other cards.

Stat row — four values:
- Label "Overall Utilisation" · value "74%" in amber
- Label "Above Target" · value "2 crews" in green
- Label "Below Target" · value "2 crews" in amber
- Label "Field Hours MTD" · value "1,248 hrs" in dark

Footer: "Mar 11 · From conversation"

---

**Card 5 — Jobs Completed vs At Risk.**

This card is full width — it spans the entire content area, same left and right edges as the two-card rows above it.

Title: "Jobs — Completed vs At Risk" in bold dark text.
Subtitle: "Weekly job completion and active risk flags — current week" in muted grey.

Chart: Line chart, two lines, same style and dot markers as the DSO card but wider since the card is full width. X-axis shows days of the current week: Mon, Tue, Wed, Thu, Fri, Sat, Sun. Y-axis shows job counts: 0, 10, 20, 30, 40. Line 1 — "Completed" — in green, trending upward across the week, values roughly 12, 18, 22, 28, 32, 35, 38. Line 2 — "At Risk" — in red, relatively flat with a slight uptick, values roughly 8, 7, 9, 8, 7, 8, 7. The contrast between the rising green line and the flat red line tells the operational story. Legend below the chart: "Completed" and "At Risk" in the same legend style.

Stat row — four values, same separator and layout:
- Label "Completed This Week" · value "134" in green
- Label "At Risk Right Now" · value "7" in amber
- Label "On-Time Rate" · value "91%" in dark
- Label "Avg Days to Complete" · value "3.2 days" in dark

Footer: "Mar 11 · From conversation"

---

**Style constraints.**

Reproduce the existing page shell, typography, card border, card shadow, chart grid lines, axis label style, dot marker style, legend style, stat row separator, and footer text style exactly from the reference DSO card. Do not introduce any new visual elements, colours, or components that are not already present in the existing Radar page. The only colours used across all charts are the existing red (#EF4444 or matching), green (#22C55E or matching), amber (#F59E0B) for the new amber states, and dark navy for neutral lines — all matching what already exists. The page should look like these five cards were always part of this Radar, designed by the same hand as the DSO card.

**Deliver one full-page frame at 1440px width** showing the complete Radar page — top bar with workspace switcher, page header, all five cards in the three-row grid layout described above. No artboard background colour — white page, white cards, light grey borders, exactly as the reference.