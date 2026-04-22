import { X, ChevronDown, HelpCircle, Search, Bell, Settings, Palette, CreditCard } from 'lucide-react';
import { SenseLogo } from './SenseLogo';
import { useState, useRef, useEffect } from 'react';

interface Tab {
  id: string;
  type: 'job' | 'invoice' | 'customer' | 'quote';
  label: string;
  isActive: boolean;
}

interface TopNavigationProps {
  activeView: 'chat' | 'radar';
  onViewChange: (view: 'chat' | 'radar') => void;
  currentUser?: string;
  onUserChange?: (user: string) => void;
  onAskSense?: () => void;
  askSenseOpen?: boolean;
  onSettingsClick?: () => void;
  onPersonalizationClick?: () => void;
  onManageSubscriptionClick?: () => void;
}

export function TopNavigation({ activeView, onViewChange, currentUser = 'RG', onUserChange, onAskSense, askSenseOpen = false, onSettingsClick, onPersonalizationClick, onManageSubscriptionClick }: TopNavigationProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', type: 'job', label: 'Job -#JN-245...', isActive: true },
    { id: '2', type: 'invoice', label: 'Invoice- #7712...', isActive: false },
    { id: '3', type: 'invoice', label: 'Invoice- #7712...', isActive: false },
    { id: '4', type: 'invoice', label: 'Invoice- #7712...', isActive: false },
    { id: '5', type: 'invoice', label: 'Invoice- #7712...', isActive: false },
  ]);

  const handleTabClick = (tabId: string) => {
    setTabs(tabs.map(tab => ({ ...tab, isActive: tab.id === tabId })));
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    setTabs(tabs.filter(tab => tab.id !== tabId));
  };

  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const [askSenseHovered, setAskSenseHovered] = useState(false);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!avatarDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target as Node)) {
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [avatarDropdownOpen]);

  const users = [
    { initials: 'RG', name: 'Ravi Gupta', role: 'Owner', color: '#6B7280' },
    { initials: 'VP', name: 'Vikram Patel', role: 'Operations Manager', color: '#7C3AED' },
    { initials: 'AU', name: 'Anita Upadhyay', role: 'Field Supervisor', color: '#0891B2' },
    { initials: 'MJ', name: 'Meera Joshi', role: 'Business Analyst', color: '#D946EF' },
  ];

  const activeUserData = users.find(u => u.initials === currentUser) || users[0];

  return (
    <div className="h-[44px] flex items-center justify-between flex-shrink-0 bg-[#f8f2ec] px-4 py-1">
      {/* Left Side: Logo + Tabs */}
      <div className="flex items-center gap-3 flex-1 overflow-hidden px-[8px] py-[0px]">
        {/* Logo */}
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.3313 11.374L16.2031 17.8265H19.5327H20.5405H23.87L28.0005 11.374H20.3313Z" fill="#FD5000"/>
            <path d="M14.6525 4L9.93262 11.3736H20.3306L25.0505 4H14.6525Z" fill="#FD5000"/>
            <path d="M8.13041 14.1748L4 20.6272H11.6692L15.7996 14.1748H8.13041Z" fill="#2A292E"/>
            <path d="M11.67 20.626L6.9502 27.9995H17.3505L22.0703 20.626H11.67Z" fill="#2A292E"/>
          </svg>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 h-[32px] rounded text-[13px] font-medium transition-all duration-150 whitespace-nowrap flex-shrink-0 ${tab.isActive ? 'bg-white text-[#1C1E21] shadow-sm' : 'bg-transparent text-[#6B7280] hover:bg-white/50' } px-[16px] py-[0px]`}
            >
              <span>{tab.label}</span>
              <X
                className="w-3.5 h-3.5 opacity-60 hover:opacity-100"
                onClick={(e) => handleCloseTab(e, tab.id)}
              />
            </button>
          ))}
        </div>

        {/* All Tabs Dropdown */}
        <button className="flex items-center gap-1.5 px-3 h-[32px] rounded-md text-[13px] font-medium text-[#6B7280] hover:bg-white/50 transition-colors flex-shrink-0 ml-1">
          <span>All Tabs</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right Side: Action Buttons */}
      <div className="flex items-center gap-1.5 ml-4">
        {/* Ask Sense — animated logo on hover */}
        <button
          className="flex items-center h-[30px] px-2 rounded-lg transition-colors duration-150"
          style={{ background: askSenseOpen || askSenseHovered ? '#E8E3DC' : 'transparent' }}
          onMouseEnter={() => setAskSenseHovered(true)}
          onMouseLeave={() => setAskSenseHovered(false)}
          onClick={onAskSense}
        >
          <span className="mr-1.5 flex items-center">
            <SenseLogo size={13} animated={askSenseHovered} />
          </span>
          <span className="text-[12px] transition-colors duration-150" style={{ fontWeight: 500, color: askSenseOpen || askSenseHovered ? '#1C1E21' : '#374151' }}>Ask Sense</span>
        </button>

        <div className="w-px h-4 bg-[#E6E8EC] mx-0.5" />

        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 transition-colors">
          <HelpCircle className="w-4.5 h-4.5 text-[#6B7280]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 transition-colors">
          <Search className="w-4.5 h-4.5 text-[#6B7280]" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 transition-colors">
          <Bell className="w-4.5 h-4.5 text-[#6B7280]" />
        </button>

        <button
          onClick={onSettingsClick}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/50 transition-colors"
        >
          <Settings className="w-4.5 h-4.5 text-[#6B7280]" />
        </button>

        {/* User Avatar */}
        <div ref={avatarDropdownRef} className="relative">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white text-[11px] transition-colors ml-2"
            style={{ background: activeUserData.color, fontWeight: 600 }}
            onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
          >
            {activeUserData.initials}
          </button>
          {avatarDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 rounded-lg overflow-hidden z-50"
              style={{
                width: '200px',
                background: '#FFFFFF',
                border: '1px solid #E6E8EC',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="py-1">
                {users.map(user => (
                  <button
                    key={user.initials}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F8F9FB] transition-colors text-left ${user.initials === currentUser ? 'bg-[#F8F9FB]' : ''}`}
                    onClick={() => {
                      onUserChange?.(user.initials);
                      setAvatarDropdownOpen(false);
                    }}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-white text-[10px] flex-shrink-0"
                      style={{ background: user.color, fontWeight: 600 }}
                    >
                      {user.initials}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[13px] text-[#1C1E21] block truncate" style={{ fontWeight: 500 }}>{user.name}</span>
                      <span className="text-[11px] text-[#9CA3AF] block truncate">{user.role}</span>
                    </div>
                    {user.initials === currentUser && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10B981] flex-shrink-0" />
                    )}
                  </button>
                ))}
                <div className="mx-2 my-1 h-px bg-[#F0F0F2]" />
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F8F9FB] transition-colors text-left"
                  onClick={() => { setAvatarDropdownOpen(false); onPersonalizationClick?.(); }}
                >
                  <Palette className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
                  <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>Personalization</span>
                </button>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#F8F9FB] transition-colors text-left"
                  onClick={() => { setAvatarDropdownOpen(false); onManageSubscriptionClick?.(); }}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#6B7280] flex-shrink-0" />
                  <span className="text-[13px] text-[#1C1E21]" style={{ fontWeight: 500 }}>My subscription</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
