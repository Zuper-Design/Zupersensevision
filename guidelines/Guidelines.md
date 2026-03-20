**Overall vibe

Calm SaaS × AI assistant × operational intelligence
Think: confident, quiet, always-on helper

Color palette (inspired by your last image side nav)

Use warm neutral + soft accent, not loud AI gradients.

Base

Background: #F8F9FB

Main canvas card: #FFFFFF

Divider lines: #E6E8EC

Text

Primary text: #1C1E21

Secondary text: #6B7280

Muted labels: #9CA3AF

Accent (AI / focus color)

Primary accent: #FD5000 (vibrant orange – primary brand color)

Accent soft background: #FFF4ED

Success / insight positive: #10B981

Warning / attention: #EF4444

This keeps it calm but informative.

3. Layout restructuring (this is the big win)
Global layout
| Side Nav | Recent Conversations | Main AI Canvas |

Leftmost: App Navigation

Keep exactly like your last image (color + icons)

Width: 64–72px

This stays visually “utility only”

Left panel: Recent Conversations (NEW)

Inspired by ChatGPT, but calmer.

Width: 260–280px

Background: #FAFAFA

Sticky header: “Recent conversations”

Each item:

Title (1 line)

Muted timestamp or context

Active conversation:

Soft amber highlight (#FFF7ED)

Left border accent (2px, #F59E0B)

This makes the AI feel ongoing, not one-off.

Main AI Canvas (center)

Wrap everything in a large rounded container instead of floating content.

Max width: 960–1040px

Border radius: 16px

Padding: 48px top / 32px sides

Background: white

Subtle shadow (very light)

This immediately improves calmness.

4. Reworked content hierarchy (important)
1️⃣ Welcome section (lighter, not dominant)

Reduce its visual dominance.

“Welcome, JT” → keep bold

Subtext → lighter, smaller, more human:

Your assistant for running a smarter roofing business.

Spacing:

Tighten vertical gap (don’t waste space)

2️⃣ Chat input (hero, but refined)

Make this feel like “talk to your system”, not a search box.

Chat box

Height: ~56px

Soft border

Slight inner shadow

Placeholder:

“Ask anything about your business, jobs, or team…”

Voice button

Standalone circular button

Filled with accent color

Mic icon in white

Slight glow on hover

This is your primary CTA.

3️⃣ Prompt suggestions (reduce footprint)

Right now they’re too loud.

Change to:

Smaller pill buttons

Max 3 visible

Muted background

Secondary priority

Example layout:

[ How is my business doing? ] [ Team performance last week ] [ Key roofing metrics ]


No need for 4 unless space allows.

4️⃣ “Today’s Key Insights” (this is where AI shines)

This section should ground the AI in real data.

Place it below the chat, not above.

Layout

Section title: “Today’s key insights”

Horizontal cards (scrollable if needed)

Each card:

Icon

Short headline

One actionable line

CTA (text link style)

Example cards:

⚠️ 3 Quotes Stuck
Potential revenue: $84,000
→ Review & follow up

⏱ 4 Jobs Missing SLA
Mostly re-roofing jobs
→ View delays

This makes the AI feel proactive, not reactive.

5. AI-specific polish (small but powerful)

Add subtle AI cues, not gimmicks:

Chat input glow when active (very subtle)

Voice listening pill:

Bottom center

Soft pulsing ring

Text: “Listening…”

Microcopy under input:

You can ask in text or voice**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->