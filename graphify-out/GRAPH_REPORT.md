# Graph Report - .  (2026-06-02)

## Corpus Check
- Large corpus: 175 files · ~818,701 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 980 nodes · 1578 edges · 77 communities (58 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 4,400 input · 1,270 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Agent Builder Page|Agent Builder Page]]
- [[_COMMUNITY_Form Inputs & Separators|Form Inputs & Separators]]
- [[_COMMUNITY_Asset & Contract Cards|Asset & Contract Cards]]
- [[_COMMUNITY_Accordion UI|Accordion UI]]
- [[_COMMUNITY_Customer Count Charts|Customer Count Charts]]
- [[_COMMUNITY_Circular Gallery|Circular Gallery]]
- [[_COMMUNITY_Radar Cards Shell|Radar Cards Shell]]
- [[_COMMUNITY_App Root & Chat Views|App Root & Chat Views]]
- [[_COMMUNITY_Filter Panel|Filter Panel]]
- [[_COMMUNITY_Radar Chart Primitives|Radar Chart Primitives]]
- [[_COMMUNITY_Badge & Checkbox UI|Badge & Checkbox UI]]
- [[_COMMUNITY_Alert Dialog UI|Alert Dialog UI]]
- [[_COMMUNITY_Add to Radar Modal|Add to Radar Modal]]
- [[_COMMUNITY_Canvas View|Canvas View]]
- [[_COMMUNITY_Chat Interface|Chat Interface]]
- [[_COMMUNITY_Command Palette UI|Command Palette UI]]
- [[_COMMUNITY_DSO Chart Card|DSO Chart Card]]
- [[_COMMUNITY_Metrics Chart Cards|Metrics Chart Cards]]
- [[_COMMUNITY_Menubar UI|Menubar UI]]
- [[_COMMUNITY_App Navigation|App Navigation]]
- [[_COMMUNITY_Context Menu UI|Context Menu UI]]
- [[_COMMUNITY_Dropdown Menu UI|Dropdown Menu UI]]
- [[_COMMUNITY_Radar Design Assets|Radar Design Assets]]
- [[_COMMUNITY_Carousel UI|Carousel UI]]
- [[_COMMUNITY_Form UI|Form UI]]
- [[_COMMUNITY_Invoice Preview Card|Invoice Preview Card]]
- [[_COMMUNITY_Feature Announcement Modal|Feature Announcement Modal]]
- [[_COMMUNITY_Chart Primitives|Chart Primitives]]
- [[_COMMUNITY_Drawer UI|Drawer UI]]
- [[_COMMUNITY_Select UI|Select UI]]
- [[_COMMUNITY_Customer Feedback Chart|Customer Feedback Chart]]
- [[_COMMUNITY_Invoice Builder Card|Invoice Builder Card]]
- [[_COMMUNITY_Subscription Flow Page|Subscription Flow Page]]
- [[_COMMUNITY_Navigation Menu UI|Navigation Menu UI]]
- [[_COMMUNITY_Confirmation Card|Confirmation Card]]
- [[_COMMUNITY_Manage Subscription Modal|Manage Subscription Modal]]
- [[_COMMUNITY_Research Display|Research Display]]
- [[_COMMUNITY_Releases Modal|Releases Modal]]
- [[_COMMUNITY_Toggle UI|Toggle UI]]
- [[_COMMUNITY_Unassigned Jobs Card|Unassigned Jobs Card]]
- [[_COMMUNITY_Card Actions Menu|Card Actions Menu]]
- [[_COMMUNITY_Category Revenue Chart|Category Revenue Chart]]
- [[_COMMUNITY_Revenue Trend Chart|Revenue Trend Chart]]
- [[_COMMUNITY_Suggested Follow-ups|Suggested Follow-ups]]
- [[_COMMUNITY_Jobs Site Map Widget|Jobs Site Map Widget]]
- [[_COMMUNITY_Agent Avatar Set|Agent Avatar Set]]
- [[_COMMUNITY_Agent Recommendation Card|Agent Recommendation Card]]
- [[_COMMUNITY_Aging Bucket Chart|Aging Bucket Chart]]
- [[_COMMUNITY_Upgrade Sense Modal|Upgrade Sense Modal]]
- [[_COMMUNITY_Alert UI|Alert UI]]
- [[_COMMUNITY_OTP Input UI|OTP Input UI]]
- [[_COMMUNITY_Monthly Invoice Revenue|Monthly Invoice Revenue]]
- [[_COMMUNITY_Profit Per Technician Card|Profit Per Technician Card]]
- [[_COMMUNITY_Checklist Card|Checklist Card]]
- [[_COMMUNITY_Draggable Widget|Draggable Widget]]
- [[_COMMUNITY_Email Editor Card|Email Editor Card]]
- [[_COMMUNITY_Radar Welcome Modal|Radar Welcome Modal]]
- [[_COMMUNITY_Weather Agent Visual Identity|Weather Agent Visual Identity]]
- [[_COMMUNITY_New Users By Month Card|New Users By Month Card]]
- [[_COMMUNITY_Quarterly Profit Margin Card|Quarterly Profit Margin Card]]
- [[_COMMUNITY_Conversation Sidebar|Conversation Sidebar]]
- [[_COMMUNITY_Message Toolbar|Message Toolbar]]
- [[_COMMUNITY_Radar Overlay|Radar Overlay]]
- [[_COMMUNITY_Radar Success Toast|Radar Success Toast]]
- [[_COMMUNITY_Streaming Text|Streaming Text]]
- [[_COMMUNITY_Thinking Logo|Thinking Logo]]
- [[_COMMUNITY_Tooltip|Tooltip]]
- [[_COMMUNITY_Top Navbar|Top Navbar]]
- [[_COMMUNITY_Typewriter Text|Typewriter Text]]
- [[_COMMUNITY_Agent Avatar Background|Agent Avatar Background]]
- [[_COMMUNITY_Dispatch & Toolkit Assets|Dispatch & Toolkit Assets]]
- [[_COMMUNITY_Review Agent Illustrations|Review Agent Illustrations]]
- [[_COMMUNITY_Agent Form Components|Agent Form Components]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 223 edges
2. `App` - 16 edges
3. `SenseLogo()` - 16 edges
4. `SavedCard` - 13 edges
5. `buttonVariants` - 9 edges
6. `RenameProps` - 8 edges
7. `Media` - 7 edges
8. `usePublishedPages()` - 7 edges
9. `useRadar()` - 7 edges
10. `useRadarTheme()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Abstract Shape SVG` --conceptually_related_to--> `Radar Page`  [AMBIGUOUS]
  src/imports/abstract-shape.svg → src/imports/pasted_text/radar-page.md
- `Logo Circles SVG` --conceptually_related_to--> `Radar Page`  [AMBIGUOUS]
  src/imports/logo-circles.svg → src/imports/pasted_text/radar-page.md
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Agent Avatar Series — Shared Visual Identity** —  [INFERRED 0.95]

## Communities (77 total, 19 thin omitted)

### Community 0 - "Agent Builder Page"
Cohesion: 0.03
Nodes (32): AgentCategory, AgentStatus, AgentTone, catalogItems, catalogOutcomes, catalogPersonas, catalogPitches, catalogQuotes (+24 more)

### Community 1 - "Form Inputs & Separators"
Cohesion: 0.05
Nodes (42): Input(), Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+34 more)

### Community 2 - "Asset & Contract Cards"
Cohesion: 0.09
Nodes (30): AssetCard(), AssetCardProps, ContractCard(), ContractCardProps, CustomerCard(), CustomerCardProps, InvoiceCard(), InvoiceCardProps (+22 more)

### Community 3 - "Accordion UI"
Cohesion: 0.08
Nodes (36): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem() (+28 more)

### Community 4 - "Customer Count Charts"
Cohesion: 0.07
Nodes (21): CustomerCountCard(), cities, CustomersByCityCard(), EstimateConversionCard(), ActionConfirmationCard(), ActionConfirmationCardProps, ChecklistItem, DetailField (+13 more)

### Community 5 - "Circular Gallery"
Cohesion: 0.10
Nodes (7): App, autoBind(), createTextTexture(), debounce(), lerp(), Media, Title

### Community 6 - "Radar Cards Shell"
Cohesion: 0.08
Nodes (25): CardShell(), CompletedJobsByTechCard(), CustomerGrowthCard(), DateFilter(), JobsByPriorityCard(), JobsByStatusCard(), MonthlyJobRevenueOrangeCard(), MonthlyJobRevenueRedCard() (+17 more)

### Community 7 - "App Root & Chat Views"
Cohesion: 0.09
Nodes (19): AgentBuilderPage(), ExpandedChatView(), ExpandedChatViewProps, FeedbackActions(), FeedbackActionsProps, KnowledgeItem, PersonalizationModal(), PersonalizationModalProps (+11 more)

### Community 8 - "Filter Panel"
Cohesion: 0.09
Nodes (13): FilterPanel(), FilterPanelProps, PinnedFilter, getJobDetail(), JobDetailPage(), JobDetailPageProps, tabs, Job (+5 more)

### Community 9 - "Radar Chart Primitives"
Cohesion: 0.07
Nodes (21): baseAxis, baseGrid, crewData, customerGrowthData, DATE_OPTIONS, jobsByPriorityData, jobsByStatusData, JobsTableCard() (+13 more)

### Community 10 - "Badge & Checkbox UI"
Cohesion: 0.08
Nodes (11): Badge(), badgeVariants, Checkbox(), HoverCardContent(), PopoverContent(), Progress(), ResizableHandle(), ResizablePanelGroup() (+3 more)

### Community 11 - "Alert Dialog UI"
Cohesion: 0.10
Nodes (18): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+10 more)

### Community 12 - "Add to Radar Modal"
Cohesion: 0.11
Nodes (20): AddToRadarModal(), AddToRadarModalProps, CardSeed, radarTemplates, templateSeedCards, ChatInterfaceProps, ChatPreviewPanel(), ChatPreviewPanelProps (+12 more)

### Community 13 - "Canvas View"
Cohesion: 0.11
Nodes (12): CanvasView(), CanvasViewProps, AttentionCardWidget(), activityLog, CollectionAgentWidget(), dsoData, CustomersTableWidget(), PerformanceWidget() (+4 more)

### Community 14 - "Chat Interface"
Cohesion: 0.12
Nodes (16): ChatInterface(), keyInsights, placeholderTexts, promptSuggestions, recentConversations, CheckoutModal(), CheckoutModalProps, INPUT_BASE (+8 more)

### Community 15 - "Command Palette UI"
Cohesion: 0.12
Nodes (14): Command(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut(), Dialog() (+6 more)

### Community 16 - "DSO Chart Card"
Cohesion: 0.13
Nodes (11): data, DSOChartCard(), CrewUtilisationCard(), JobsCompletedCard(), OverdueInvoicesCard(), QuoteConversionCard(), RevenueMTDCard(), getCardSuggestions() (+3 more)

### Community 17 - "Metrics Chart Cards"
Cohesion: 0.12
Nodes (8): crewData, jobsData, MetricsChartCards(), MetricsChartCardsProps, overallScore, revenueData, satisfactionData, weeklyTrendData

### Community 18 - "Menubar UI"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 19 - "App Navigation"
Cohesion: 0.15
Nodes (12): AppContent(), AppNavigation(), baseNavigationItems, NavigationItem, SubMenuItem, PublishedPage, PublishedPagesContext, PublishedPagesContextType (+4 more)

### Community 20 - "Context Menu UI"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 21 - "Dropdown Menu UI"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 22 - "Radar Design Assets"
Cohesion: 0.19
Nodes (14): Abstract Shape SVG, Logo Circles SVG, Card 4 — Crew Utilisation, Card Grid Layout, Card 5 — Jobs Completed vs At Risk, Card 2 — Overdue Invoices, Card 3 — Quote-to-Invoice Conversion, Card 1 — Revenue MTD vs Target (+6 more)

### Community 23 - "Carousel UI"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 24 - "Form UI"
Cohesion: 0.20
Nodes (11): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+3 more)

### Community 25 - "Invoice Preview Card"
Cohesion: 0.19
Nodes (9): InvoicePageBuilderPreviewCard(), InvoicePageBuilderPreviewCardProps, PageBuilderCard(), PageBuilderCardProps, PageBuilderPreviewCard(), PageBuilderPreviewCardProps, PublishModal(), PublishModalProps (+1 more)

### Community 26 - "Feature Announcement Modal"
Cohesion: 0.18
Nodes (3): FeatureAnnouncementModal(), FeatureAnnouncementModalProps, FEATURES

### Community 27 - "Chart Primitives"
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 28 - "Drawer UI"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 29 - "Select UI"
Cohesion: 0.18
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 30 - "Customer Feedback Chart"
Cohesion: 0.20
Nodes (5): CustomerFeedbackChartCard(), data, data, GrowthTrendsChartCard(), RenameProps

### Community 31 - "Invoice Builder Card"
Cohesion: 0.22
Nodes (9): CustomerInfo, customerInfoMap, EDITABLE_ELEMENTS, EditableElementInfo, formatCurrency(), Invoice, InvoicePageBuilderCard(), InvoicePageBuilderCardProps (+1 more)

### Community 32 - "Subscription Flow Page"
Cohesion: 0.20
Nodes (5): Flags, presets, Resolved, SubscriptionFlowPage(), toneColors

### Community 33 - "Navigation Menu UI"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 34 - "Confirmation Card"
Cohesion: 0.25
Nodes (7): ConfirmationCard(), ConfirmationCardProps, DetailField, moduleConfig, ModuleType, ConfirmationCardDemo(), ConfirmationCardDemoProps

### Community 35 - "Manage Subscription Modal"
Cohesion: 0.22
Nodes (8): inputStyle, INVOICES, InvoiceStatus, ManageSubscriptionModal(), ManageSubscriptionModalProps, PLAN_FEATURES, STATUS_STYLE, Tab

### Community 36 - "Research Display"
Cohesion: 0.22
Nodes (6): iconMap, ResearchDisplay(), ResearchDisplayProps, ResearchStep, ResearchTopic, style

### Community 37 - "Releases Modal"
Cohesion: 0.25
Nodes (7): Highlight, HIGHLIGHTS, ReleasesModal(), ReleasesModalProps, Section, SectionKey, SECTIONS

### Community 38 - "Toggle UI"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 39 - "Unassigned Jobs Card"
Cohesion: 0.33
Nodes (3): columns, jobs, UnassignedJobsCard()

### Community 40 - "Card Actions Menu"
Cohesion: 0.40
Nodes (3): CardActionsMenu(), CardActionsMenuProps, CardWithActionsProps

### Community 41 - "Category Revenue Chart"
Cohesion: 0.33
Nodes (3): CategoryRevenueChartCard(), colors, data

### Community 43 - "Suggested Follow-ups"
Cohesion: 0.40
Nodes (5): getDefaultSuggestions(), getFollowupSuggestions(), SuggestedFollowups(), SuggestedFollowupsProps, Suggestion

### Community 44 - "Jobs Site Map Widget"
Cohesion: 0.33
Nodes (4): JobSite, jobSites, JobStatus, statusConfig

### Community 45 - "Agent Avatar Set"
Cohesion: 1.00
Nodes (5): Agent 1 Avatar — Female with Headset and Cape, Agent 2 Avatar — Female with Headband, Headphones and Cape, Agent 3 Avatar — Bearded Male with Headset and Cape, Agent Avatar Set — 3D Cartoon AI Agent Characters, App Builder Design System

### Community 46 - "Agent Recommendation Card"
Cohesion: 0.40
Nodes (4): AgentRecommendationCard(), AgentRecommendationCardProps, DeployPhase, deploySteps

### Community 47 - "Aging Bucket Chart"
Cohesion: 0.50
Nodes (4): AgingBucketChartCard(), CustomTooltip(), data, formatMoney()

### Community 48 - "Upgrade Sense Modal"
Cohesion: 0.40
Nodes (4): FEATURES, UpgradeSenseModal(), UpgradeSenseModalProps, VP_FEATURES

### Community 50 - "Alert UI"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 51 - "OTP Input UI"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 53 - "Profit Per Technician Card"
Cohesion: 0.50
Nodes (3): ProfitPerTechnicianCard(), techs, yTicks

### Community 54 - "Checklist Card"
Cohesion: 0.50
Nodes (3): ChecklistCard(), ChecklistCardProps, ChecklistItem

### Community 56 - "Email Editor Card"
Cohesion: 0.50
Nodes (3): EditorMode, EmailEditorCard(), EmailEditorCardProps

### Community 59 - "Weather Agent Visual Identity"
Cohesion: 1.00
Nodes (3): Field Worker / Superhero Agent Role, Weather Lead Agent Illustration, 3D Cartoon Character Style

## Ambiguous Edges - Review These
- `Radar Page` → `Abstract Shape SVG`  [AMBIGUOUS]
  src/imports/abstract-shape.svg · relation: conceptually_related_to
- `Radar Page` → `Logo Circles SVG`  [AMBIGUOUS]
  src/imports/logo-circles.svg · relation: conceptually_related_to

## Knowledge Gaps
- **242 isolated node(s):** `ActionConfirmationCardProps`, `radarTemplates`, `CardSeed`, `templateSeedCards`, `Section` (+237 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Radar Page` and `Abstract Shape SVG`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Radar Page` and `Logo Circles SVG`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `Accordion UI` to `Form Inputs & Separators`, `Navigation Menu UI`, `Toggle UI`, `Badge & Checkbox UI`, `Alert Dialog UI`, `Command Palette UI`, `Alert UI`, `OTP Input UI`, `Context Menu UI`, `Dropdown Menu UI`, `Menubar UI`, `Carousel UI`, `Form UI`, `Chart Primitives`, `Drawer UI`, `Select UI`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `SenseLogo()` connect `Chat Interface` to `Agent Builder Page`, `Manage Subscription Modal`, `Customer Count Charts`, `Research Display`, `App Root & Chat Views`, `Filter Panel`, `Add to Radar Modal`, `DSO Chart Card`, `Upgrade Sense Modal`, `Feature Announcement Modal`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **What connects `ActionConfirmationCardProps`, `radarTemplates`, `CardSeed` to the rest of the system?**
  _242 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Agent Builder Page` be split into smaller, more focused modules?**
  _Cohesion score 0.02531645569620253 - nodes in this community are weakly interconnected._
- **Should `Form Inputs & Separators` be split into smaller, more focused modules?**
  _Cohesion score 0.05279034690799397 - nodes in this community are weakly interconnected._