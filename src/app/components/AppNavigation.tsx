import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  Briefcase, CalendarDays, UserCircle, Clock, Package, Wallet, BarChart3, MoreHorizontal,
  FolderOpen, Hammer, GitPullRequest, Camera, MessageCircle,
  Calendar, LayoutDashboard, Map,
  Users, Building2, Home, FileSignature, Shield,
  Clock4, CalendarOff, SlidersHorizontal, ClipboardList,
  ShoppingCart, Tag, ArrowLeftRight, BadgePercent, Truck,
  FileText, Receipt, DollarSign, CreditCard,
  PieChart, LayoutGrid,
  Workflow, Settings,
  Globe, Radar,
  type LucideIcon
} from 'lucide-react';
import { usePublishedPages } from './PublishedPagesContext';

interface SubMenuItem {
  icon: LucideIcon;
  label: string;
  pageId?: string;
  isRadarItem?: boolean;
}

interface NavigationItem {
  icon: LucideIcon | null;
  label: string;
  active: boolean;
  subItems?: SubMenuItem[];
  dividerAfter?: number | undefined;
}

const baseNavigationItems: NavigationItem[] = [
  { icon: null, label: 'Sense', active: true },
  {
    icon: Briefcase, label: 'Work', active: false,
    subItems: [
      { icon: FolderOpen, label: 'Projects' },
      { icon: Hammer, label: 'Jobs' },
      { icon: GitPullRequest, label: 'Request' },
      { icon: Camera, label: 'Photo Feed' },
      { icon: MessageCircle, label: 'Chats' },
    ]
  },
  {
    icon: CalendarDays, label: 'Schedule', active: false,
    subItems: [
      { icon: Calendar, label: 'Calendar' },
      { icon: LayoutDashboard, label: 'Dispatch Board' },
      { icon: Map, label: 'Maps' },
    ]
  },
  {
    icon: UserCircle, label: 'CRM', active: false,
    subItems: [
      { icon: Users, label: 'Customers' },
      { icon: Building2, label: 'Organizations' },
      { icon: Home, label: 'Properties' },
      { icon: FileSignature, label: 'Contracts' },
      { icon: Shield, label: 'Assets' },
    ]
  },
  {
    icon: Clock, label: 'Timesheets', active: false,
    subItems: [
      { icon: Clock4, label: 'Timesheets' },
      { icon: CalendarOff, label: 'Timeoff' },
      { icon: SlidersHorizontal, label: 'Shifts' },
      { icon: ClipboardList, label: 'Timelog Summary' },
    ]
  },
  {
    icon: Package, label: 'Inventory', active: false,
    subItems: [
      { icon: ShoppingCart, label: 'Purchase Orders' },
      { icon: Tag, label: 'Parts & Services' },
      { icon: ArrowLeftRight, label: 'Transfer Orders' },
      { icon: BadgePercent, label: 'Pricelists' },
      { icon: Truck, label: 'Vendors' },
    ]
  },
  {
    icon: Wallet, label: 'Finance', active: false,
    subItems: [
      { icon: FileText, label: 'Quotes' },
      { icon: Receipt, label: 'Invoices' },
      { icon: DollarSign, label: 'Payments' },
      { icon: CreditCard, label: 'Financing' },
    ]
  },
  {
    icon: BarChart3, label: 'Reporting', active: false,
    subItems: [
      { icon: PieChart, label: 'Legacy Reports' },
      { icon: LayoutGrid, label: 'Reports' },
    ]
  },
  {
    icon: MoreHorizontal, label: 'More', active: false,
    subItems: [
      { icon: Workflow, label: 'Workflows' },
      { icon: Settings, label: 'Settings' },
    ]
  },
];

function NavFlyout({
  subItems,
  dividerAfter,
  parentRef,
  onSubItemClick,
}: {
  subItems: SubMenuItem[];
  dividerAfter?: number;
  parentRef: React.RefObject<HTMLButtonElement | null>;
  onSubItemClick?: (sub: SubMenuItem) => void;
}) {
  const [top, setTop] = useState(0);
  const flyoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parentRef.current && flyoutRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const flyoutHeight = flyoutRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;

      let calculatedTop = parentRect.top;

      if (calculatedTop + flyoutHeight > viewportHeight - 8) {
        calculatedTop = viewportHeight - flyoutHeight - 8;
      }

      if (calculatedTop < 8) {
        calculatedTop = 8;
      }

      setTop(calculatedTop);
    }
  }, [parentRef]);

  return ReactDOM.createPortal(
    <div
      ref={flyoutRef}
      className="fixed left-[76px] bg-white rounded-xl shadow-lg border border-[#E6E8EC] py-2 min-w-[200px] z-50"
      style={{ top: `${top}px` }}
    >
      {subItems.map((sub, idx) => {
        const SubIcon = sub.icon;
        return (
          <div key={idx}>
            {dividerAfter !== undefined && idx === dividerAfter && (
              <div className="mx-3 my-1 border-t border-[#E6E8EC]" />
            )}
            <button
              onClick={() => onSubItemClick?.(sub)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left group/item ${
                sub.isRadarItem
                  ? 'hover:bg-[#FFF4ED] bg-[#FFFAF6]'
                  : 'hover:bg-[#FFF7ED]'
              }`}
            >
              <SubIcon className={`w-[18px] h-[18px] transition-colors flex-shrink-0 ${
                sub.isRadarItem
                  ? 'text-[#FD5000] group-hover/item:text-[#FD5000]'
                  : 'text-[#8B7355] group-hover/item:text-[#FF6B35]'
              }`} />
              <span className={`text-[14px] whitespace-nowrap ${
                sub.isRadarItem
                  ? 'text-[#FD5000]'
                  : 'text-[#1C1E21]'
              }`} style={sub.isRadarItem ? { fontWeight: 500 } : undefined}>{sub.label}</span>
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}

export function AppNavigation({ onSubItemNavigate, onSenseClick, currentUser, onRadarClick }: { onSubItemNavigate?: (label: string, parentLabel: string) => void; onSenseClick?: () => void; currentUser?: string; onRadarClick?: () => void }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { publishedPages, activePage, setActivePage } = usePublishedPages();

  // Modules that get radar workspace items for MJ user
  const mjRadarModules = ['Work', 'CRM', 'Finance'];

  // Merge published pages into navigation items
  const navigationItems = baseNavigationItems.map(item => {
    let mergedItem = { ...item, dividerAfter: undefined as number | undefined };

    // Add published pages
    const pagesForWorkspace = publishedPages.filter(p => p.workspace === item.label);
    if (pagesForWorkspace.length > 0) {
      const customSubItems: SubMenuItem[] = pagesForWorkspace.map(p => ({
        icon: Globe,
        label: p.name,
        pageId: p.id,
      }));
      mergedItem = {
        ...mergedItem,
        subItems: [...(mergedItem.subItems || []), ...customSubItems],
        dividerAfter: (mergedItem.subItems || []).length,
      };
    }

    // Add radar workspace item for MJ user on specific modules
    if (currentUser === 'MJ' && mjRadarModules.includes(item.label) && mergedItem.subItems) {
      const radarItem: SubMenuItem = {
        icon: Radar,
        label: `${item.label} Workspace`,
        isRadarItem: true,
      };
      const existingDivider = mergedItem.dividerAfter;
      const dividerPos = existingDivider !== undefined ? existingDivider : mergedItem.subItems.length;
      mergedItem = {
        ...mergedItem,
        subItems: [...mergedItem.subItems, radarItem],
        dividerAfter: dividerPos,
      };
    }

    return mergedItem;
  });

  const handleMouseEnterItem = (index: number) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredIndex(index);
  };

  const handleMouseLeaveItem = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
  };

  const handleMouseEnterFlyout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseLeaveFlyout = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
  };

  const handleSubItemClick = (sub: SubMenuItem, parentLabel?: string) => {
    if (sub.isRadarItem) {
      onRadarClick?.();
      setHoveredIndex(null);
    } else if (sub.pageId) {
      const page = publishedPages.find(p => p.id === sub.pageId);
      if (page) {
        setActivePage(page);
        setHoveredIndex(null);
      }
    } else if (onSubItemNavigate) {
      onSubItemNavigate(sub.label, parentLabel || '');
      setHoveredIndex(null);
    }
  };

  return (
    <div className="w-[72px] h-full flex flex-col items-center py-4 bg-[#F8F2EC] relative z-20">
      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1 w-full px-2 overflow-y-auto">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isHovered = hoveredIndex === index;
          const hasSubItems = item.subItems && item.subItems.length > 0;

          // Highlight the workspace nav item if its published page is active
          const hasActivePageInWorkspace = activePage && activePage.workspace === item.label;

          return (
            <div key={index} className="relative">
              <button
                ref={(el) => { buttonRefs.current[index] = el; }}
                className="w-full flex flex-col items-center justify-center py-2 px-2 gap-1 transition-all duration-200 group"
                aria-label={item.label}
                onMouseEnter={() => handleMouseEnterItem(index)}
                onMouseLeave={handleMouseLeaveItem}
                onClick={() => {
                  if (item.label === 'Sense') {
                    setActivePage(null);
                    onSenseClick?.();
                  }
                }}
              >
                <div className={`p-2 rounded-md transition-all duration-200 ${
                  item.active && !activePage
                    ? 'bg-white'
                    : hasActivePageInWorkspace
                      ? 'bg-white'
                      : 'group-hover:bg-white/60'
                }`}>
                  {item.label === 'Sense' ? (
                    <svg width="20" height="20" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                      <rect y="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                      <rect x="15.75" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                      <rect x="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                      <rect x="15.75" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                      <rect y="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                      <rect x="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                      <rect x="31.5" y="15.75" width="13.5" height="13.5" rx="3.375" fill="#F8D5C2" fillOpacity="0.7"/>
                      <rect x="31.5" y="31.5" width="13.5" height="13.5" rx="3.375" fill="#EB5D2A"/>
                    </svg>
                  ) : Icon ? (
                    <Icon className={`w-5 h-5 transition-colors ${
                      (item.active && !activePage) || hasActivePageInWorkspace
                        ? 'text-[#FF6B35]'
                        : 'text-[#8B7355] group-hover:text-[#FF6B35]'
                    }`} />
                  ) : null}
                </div>
                <span className={`text-[10px] font-medium ${
                  hasActivePageInWorkspace ? 'text-[#FF6B35]' : 'text-[#8B7355]'
                }`}>{item.label}</span>
              </button>

              {/* Flyout Menu */}
              {isHovered && hasSubItems && (
                <div
                  onMouseEnter={handleMouseEnterFlyout}
                  onMouseLeave={handleMouseLeaveFlyout}
                >
                  <NavFlyout
                    subItems={item.subItems!}
                    dividerAfter={item.dividerAfter}
                    parentRef={{ current: buttonRefs.current[index] }}
                    onSubItemClick={(sub) => handleSubItemClick(sub, item.label)}
                  />
                </div>
              )}

              {/* Radar nav item injected after Sense for AU user */}
              {item.label === 'Sense' && currentUser === 'AU' && (
                <button
                  className="w-full flex flex-col items-center justify-center py-2 px-2 gap-1 transition-all duration-200 group mt-1"
                  aria-label="Radar"
                  onClick={() => onRadarClick?.()}
                >
                  <div className="p-2 rounded-md transition-all duration-200 group-hover:bg-white/60">
                    <Radar className="w-5 h-5 text-[#8B7355] group-hover:text-[#FF6B35] transition-colors" />
                  </div>
                  <span className="text-[10px] font-medium text-[#8B7355]">Radar</span>
                </button>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}