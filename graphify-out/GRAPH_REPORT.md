# Graph Report - .  (2026-06-10)

## Corpus Check
- 158 files · ~181,655 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 944 nodes · 1533 edges · 68 communities (52 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Agent Builder & Marketplace|Agent Builder & Marketplace]]
- [[_COMMUNITY_shadcn Form Primitives|shadcn Form Primitives]]
- [[_COMMUNITY_Entity Detail Cards|Entity Detail Cards]]
- [[_COMMUNITY_shadcn Layout Primitives|shadcn Layout Primitives]]
- [[_COMMUNITY_Chat Canvas Widgets|Chat Canvas Widgets]]
- [[_COMMUNITY_Circular Gallery (WebGL)|Circular Gallery (WebGL)]]
- [[_COMMUNITY_Radar Dashboard Cards|Radar Dashboard Cards]]
- [[_COMMUNITY_App Shell & Modals|App Shell & Modals]]
- [[_COMMUNITY_shadcn BadgePopover Primitives|shadcn Badge/Popover Primitives]]
- [[_COMMUNITY_Radar Card Mock Data|Radar Card Mock Data]]
- [[_COMMUNITY_Chat Interface & Checkout|Chat Interface & Checkout]]
- [[_COMMUNITY_shadcn DialogButton|shadcn Dialog/Button]]
- [[_COMMUNITY_Filter Panel & Job Detail|Filter Panel & Job Detail]]
- [[_COMMUNITY_Add-to-Radar & Chat Preview|Add-to-Radar & Chat Preview]]
- [[_COMMUNITY_Canvas Agent Widgets|Canvas Agent Widgets]]
- [[_COMMUNITY_Invoice Page Builder|Invoice Page Builder]]
- [[_COMMUNITY_Command Palette & Dialog|Command Palette & Dialog]]
- [[_COMMUNITY_DSO & Radar Chat|DSO & Radar Chat]]
- [[_COMMUNITY_Metrics Chart Cards|Metrics Chart Cards]]
- [[_COMMUNITY_shadcn Menubar|shadcn Menubar]]
- [[_COMMUNITY_App Navigation & Published Pages|App Navigation & Published Pages]]
- [[_COMMUNITY_shadcn Context Menu|shadcn Context Menu]]
- [[_COMMUNITY_shadcn Dropdown Menu|shadcn Dropdown Menu]]
- [[_COMMUNITY_shadcn Carousel|shadcn Carousel]]
- [[_COMMUNITY_shadcn Form|shadcn Form]]
- [[_COMMUNITY_Feature Announcement Modal|Feature Announcement Modal]]
- [[_COMMUNITY_shadcn Chart|shadcn Chart]]
- [[_COMMUNITY_shadcn Drawer|shadcn Drawer]]
- [[_COMMUNITY_shadcn Select|shadcn Select]]
- [[_COMMUNITY_FeedbackGrowth Charts|Feedback/Growth Charts]]
- [[_COMMUNITY_Subscription Flow|Subscription Flow]]
- [[_COMMUNITY_shadcn Navigation Menu|shadcn Navigation Menu]]
- [[_COMMUNITY_Confirmation Card|Confirmation Card]]
- [[_COMMUNITY_Manage Subscription Modal|Manage Subscription Modal]]
- [[_COMMUNITY_Research Display|Research Display]]
- [[_COMMUNITY_Releases Modal|Releases Modal]]
- [[_COMMUNITY_shadcn Toggle|shadcn Toggle]]
- [[_COMMUNITY_Unassigned Jobs Card|Unassigned Jobs Card]]
- [[_COMMUNITY_Card Actions Menu|Card Actions Menu]]
- [[_COMMUNITY_Category Revenue Chart|Category Revenue Chart]]
- [[_COMMUNITY_Revenue Trend Chart|Revenue Trend Chart]]
- [[_COMMUNITY_Suggested Followups|Suggested Followups]]
- [[_COMMUNITY_Job Site Map Widget|Job Site Map Widget]]
- [[_COMMUNITY_Agent Recommendation Card|Agent Recommendation Card]]
- [[_COMMUNITY_Aging Bucket Chart|Aging Bucket Chart]]
- [[_COMMUNITY_shadcn Alert|shadcn Alert]]
- [[_COMMUNITY_shadcn Input OTP|shadcn Input OTP]]
- [[_COMMUNITY_Monthly Invoice Revenue|Monthly Invoice Revenue]]
- [[_COMMUNITY_Profit Per Technician|Profit Per Technician]]
- [[_COMMUNITY_Checklist Card|Checklist Card]]
- [[_COMMUNITY_Draggable Widget|Draggable Widget]]
- [[_COMMUNITY_Email Editor Card|Email Editor Card]]
- [[_COMMUNITY_Radar Welcome Modal|Radar Welcome Modal]]
- [[_COMMUNITY_Customers By City|Customers By City]]
- [[_COMMUNITY_New Users By Month|New Users By Month]]
- [[_COMMUNITY_Action Confirmation Card|Action Confirmation Card]]
- [[_COMMUNITY_Conversation Sidebar|Conversation Sidebar]]
- [[_COMMUNITY_Email Card|Email Card]]
- [[_COMMUNITY_Message Toolbar|Message Toolbar]]
- [[_COMMUNITY_Radar Overlay|Radar Overlay]]
- [[_COMMUNITY_Streaming Text|Streaming Text]]
- [[_COMMUNITY_Thinking Logo|Thinking Logo]]
- [[_COMMUNITY_Tooltip|Tooltip]]
- [[_COMMUNITY_Top Navbar|Top Navbar]]
- [[_COMMUNITY_New Agent Form|New Agent Form]]

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
- `AlertDialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts
- `AlertDialogContent()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts
- `AlertDialogTitle()` --calls--> `cn()`  [EXTRACTED]
  src/app/components/ui/alert-dialog.tsx → src/app/components/ui/utils.ts

## Import Cycles
- None detected.

## Communities (68 total, 16 thin omitted)

### Community 0 - "Agent Builder & Marketplace"
Cohesion: 0.03
Nodes (32): AgentCategory, AgentStatus, AgentTone, catalogItems, catalogOutcomes, catalogPersonas, catalogPitches, catalogQuotes (+24 more)

### Community 1 - "shadcn Form Primitives"
Cohesion: 0.05
Nodes (42): Input(), Separator(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+34 more)

### Community 2 - "Entity Detail Cards"
Cohesion: 0.09
Nodes (30): AssetCard(), AssetCardProps, ContractCard(), ContractCardProps, CustomerCard(), CustomerCardProps, InvoiceCard(), InvoiceCardProps (+22 more)

### Community 3 - "shadcn Layout Primitives"
Cohesion: 0.08
Nodes (36): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), BreadcrumbEllipsis(), BreadcrumbItem() (+28 more)

### Community 4 - "Chat Canvas Widgets"
Cohesion: 0.07
Nodes (21): CustomerCountCard(), EstimateConversionCard(), data, QuarterlyProfitMarginCard(), ChecklistItem, DetailField, getRadarCardMessages(), getRadarCardSentence() (+13 more)

### Community 5 - "Circular Gallery (WebGL)"
Cohesion: 0.10
Nodes (7): App, autoBind(), createTextTexture(), debounce(), lerp(), Media, Title

### Community 6 - "Radar Dashboard Cards"
Cohesion: 0.08
Nodes (25): CardShell(), CompletedJobsByTechCard(), CustomerGrowthCard(), DateFilter(), JobsByPriorityCard(), JobsByStatusCard(), MonthlyJobRevenueOrangeCard(), MonthlyJobRevenueRedCard() (+17 more)

### Community 7 - "App Shell & Modals"
Cohesion: 0.09
Nodes (19): AgentBuilderPage(), ExpandedChatView(), ExpandedChatViewProps, FeedbackActions(), FeedbackActionsProps, KnowledgeItem, PersonalizationModal(), PersonalizationModalProps (+11 more)

### Community 8 - "shadcn Badge/Popover Primitives"
Cohesion: 0.07
Nodes (12): Badge(), badgeVariants, Checkbox(), HoverCardContent(), Label(), PopoverContent(), Progress(), ResizableHandle() (+4 more)

### Community 9 - "Radar Card Mock Data"
Cohesion: 0.07
Nodes (21): baseAxis, baseGrid, crewData, customerGrowthData, DATE_OPTIONS, jobsByPriorityData, jobsByStatusData, JobsTableCard() (+13 more)

### Community 10 - "Chat Interface & Checkout"
Cohesion: 0.10
Nodes (20): ChatInterface(), keyInsights, placeholderTexts, promptSuggestions, recentConversations, CheckoutModal(), CheckoutModalProps, INPUT_BASE (+12 more)

### Community 11 - "shadcn Dialog/Button"
Cohesion: 0.10
Nodes (18): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+10 more)

### Community 12 - "Filter Panel & Job Detail"
Cohesion: 0.09
Nodes (12): FilterPanel(), FilterPanelProps, PinnedFilter, getJobDetail(), JobDetailPage(), JobDetailPageProps, tabs, Job (+4 more)

### Community 13 - "Add-to-Radar & Chat Preview"
Cohesion: 0.11
Nodes (20): AddToRadarModal(), AddToRadarModalProps, CardSeed, radarTemplates, templateSeedCards, ChatInterfaceProps, ChatPreviewPanel(), ChatPreviewPanelProps (+12 more)

### Community 14 - "Canvas Agent Widgets"
Cohesion: 0.11
Nodes (12): CanvasView(), CanvasViewProps, AttentionCardWidget(), activityLog, CollectionAgentWidget(), dsoData, CustomersTableWidget(), PerformanceWidget() (+4 more)

### Community 15 - "Invoice Page Builder"
Cohesion: 0.11
Nodes (18): CustomerInfo, customerInfoMap, EDITABLE_ELEMENTS, EditableElementInfo, formatCurrency(), Invoice, InvoicePageBuilderCard(), InvoicePageBuilderCardProps (+10 more)

### Community 16 - "Command Palette & Dialog"
Cohesion: 0.12
Nodes (14): Command(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut(), Dialog() (+6 more)

### Community 17 - "DSO & Radar Chat"
Cohesion: 0.13
Nodes (11): data, DSOChartCard(), CrewUtilisationCard(), JobsCompletedCard(), OverdueInvoicesCard(), QuoteConversionCard(), RevenueMTDCard(), getCardSuggestions() (+3 more)

### Community 18 - "Metrics Chart Cards"
Cohesion: 0.12
Nodes (8): crewData, jobsData, MetricsChartCards(), MetricsChartCardsProps, overallScore, revenueData, satisfactionData, weeklyTrendData

### Community 19 - "shadcn Menubar"
Cohesion: 0.12
Nodes (11): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarRadioItem(), MenubarSeparator(), MenubarShortcut() (+3 more)

### Community 20 - "App Navigation & Published Pages"
Cohesion: 0.15
Nodes (12): AppContent(), AppNavigation(), baseNavigationItems, NavigationItem, SubMenuItem, PublishedPage, PublishedPagesContext, PublishedPagesContextType (+4 more)

### Community 21 - "shadcn Context Menu"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 22 - "shadcn Dropdown Menu"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 23 - "shadcn Carousel"
Cohesion: 0.19
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 24 - "shadcn Form"
Cohesion: 0.23
Nodes (10): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext, FormItemContextValue, FormLabel() (+2 more)

### Community 25 - "Feature Announcement Modal"
Cohesion: 0.18
Nodes (3): FeatureAnnouncementModal(), FeatureAnnouncementModalProps, FEATURES

### Community 26 - "shadcn Chart"
Cohesion: 0.22
Nodes (8): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartTooltipContent(), THEMES, useChart()

### Community 27 - "shadcn Drawer"
Cohesion: 0.18
Nodes (6): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerTitle()

### Community 28 - "shadcn Select"
Cohesion: 0.18
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 29 - "Feedback/Growth Charts"
Cohesion: 0.20
Nodes (5): CustomerFeedbackChartCard(), data, data, GrowthTrendsChartCard(), RenameProps

### Community 30 - "Subscription Flow"
Cohesion: 0.20
Nodes (5): Flags, presets, Resolved, SubscriptionFlowPage(), toneColors

### Community 31 - "shadcn Navigation Menu"
Cohesion: 0.22
Nodes (9): NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger(), navigationMenuTriggerStyle (+1 more)

### Community 32 - "Confirmation Card"
Cohesion: 0.25
Nodes (7): ConfirmationCard(), ConfirmationCardProps, DetailField, moduleConfig, ModuleType, ConfirmationCardDemo(), ConfirmationCardDemoProps

### Community 33 - "Manage Subscription Modal"
Cohesion: 0.22
Nodes (8): inputStyle, INVOICES, InvoiceStatus, ManageSubscriptionModal(), ManageSubscriptionModalProps, PLAN_FEATURES, STATUS_STYLE, Tab

### Community 34 - "Research Display"
Cohesion: 0.22
Nodes (6): iconMap, ResearchDisplay(), ResearchDisplayProps, ResearchStep, ResearchTopic, style

### Community 35 - "Releases Modal"
Cohesion: 0.25
Nodes (7): Highlight, HIGHLIGHTS, ReleasesModal(), ReleasesModalProps, Section, SectionKey, SECTIONS

### Community 36 - "shadcn Toggle"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

### Community 37 - "Unassigned Jobs Card"
Cohesion: 0.33
Nodes (3): columns, jobs, UnassignedJobsCard()

### Community 38 - "Card Actions Menu"
Cohesion: 0.40
Nodes (3): CardActionsMenu(), CardActionsMenuProps, CardWithActionsProps

### Community 39 - "Category Revenue Chart"
Cohesion: 0.33
Nodes (3): CategoryRevenueChartCard(), colors, data

### Community 41 - "Suggested Followups"
Cohesion: 0.40
Nodes (5): getDefaultSuggestions(), getFollowupSuggestions(), SuggestedFollowups(), SuggestedFollowupsProps, Suggestion

### Community 42 - "Job Site Map Widget"
Cohesion: 0.33
Nodes (4): JobSite, jobSites, JobStatus, statusConfig

### Community 43 - "Agent Recommendation Card"
Cohesion: 0.40
Nodes (4): AgentRecommendationCard(), AgentRecommendationCardProps, DeployPhase, deploySteps

### Community 44 - "Aging Bucket Chart"
Cohesion: 0.50
Nodes (4): AgingBucketChartCard(), CustomTooltip(), data, formatMoney()

### Community 45 - "shadcn Alert"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 46 - "shadcn Input OTP"
Cohesion: 0.40
Nodes (3): InputOTP(), InputOTPGroup(), InputOTPSlot()

### Community 48 - "Profit Per Technician"
Cohesion: 0.50
Nodes (3): ProfitPerTechnicianCard(), techs, yTicks

### Community 49 - "Checklist Card"
Cohesion: 0.50
Nodes (3): ChecklistCard(), ChecklistCardProps, ChecklistItem

### Community 51 - "Email Editor Card"
Cohesion: 0.50
Nodes (3): EditorMode, EmailEditorCard(), EmailEditorCardProps

## Knowledge Gaps
- **235 isolated node(s):** `ActionConfirmationCardProps`, `radarTemplates`, `CardSeed`, `templateSeedCards`, `Section` (+230 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `shadcn Layout Primitives` to `shadcn Form Primitives`, `shadcn Toggle`, `shadcn Badge/Popover Primitives`, `shadcn Dialog/Button`, `shadcn Alert`, `shadcn Input OTP`, `Command Palette & Dialog`, `shadcn Menubar`, `shadcn Context Menu`, `shadcn Dropdown Menu`, `shadcn Carousel`, `shadcn Form`, `shadcn Chart`, `shadcn Drawer`, `shadcn Select`, `shadcn Navigation Menu`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `SenseLogo()` connect `Chat Interface & Checkout` to `Agent Builder & Marketplace`, `Manage Subscription Modal`, `Research Display`, `Chat Canvas Widgets`, `App Shell & Modals`, `Filter Panel & Job Detail`, `Add-to-Radar & Chat Preview`, `DSO & Radar Chat`, `Feature Announcement Modal`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `ActionConfirmationCardProps`, `radarTemplates`, `CardSeed` to the rest of the system?**
  _235 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Agent Builder & Marketplace` be split into smaller, more focused modules?**
  _Cohesion score 0.02531645569620253 - nodes in this community are weakly interconnected._
- **Should `shadcn Form Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.05279034690799397 - nodes in this community are weakly interconnected._
- **Should `Entity Detail Cards` be split into smaller, more focused modules?**
  _Cohesion score 0.0858843537414966 - nodes in this community are weakly interconnected._
- **Should `shadcn Layout Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.07729468599033816 - nodes in this community are weakly interconnected._