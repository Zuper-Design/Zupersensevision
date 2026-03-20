import { Home, Sparkles, FolderOpen, Settings, Calculator, Truck, BarChart3, MoreHorizontal } from 'lucide-react';

const recentConversations = [
  { 
    title: 'Team performance analysis', 
    timestamp: '2 hours ago',
    active: true 
  },
  { 
    title: 'Revenue tracking Q1', 
    timestamp: 'Yesterday',
    active: false 
  },
  { 
    title: 'Roofing metrics dashboard', 
    timestamp: '2 days ago',
    active: false 
  },
  { 
    title: 'Customer feedback review', 
    timestamp: '3 days ago',
    active: false 
  },
  { 
    title: 'Material cost optimization', 
    timestamp: '5 days ago',
    active: false 
  },
  { 
    title: 'Safety compliance check', 
    timestamp: '1 week ago',
    active: false 
  },
];

export function ConversationSidebar() {
  return (
    <div className="w-[280px] bg-[#FAFAFA] h-full flex flex-col border-r border-[#E6E8EC]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E6E8EC]">
        <h2 className="text-sm font-semibold text-[#1C1E21]">Recent conversations</h2>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-auto-hide">
        {recentConversations.map((conversation, index) => (
          <button
            key={index}
            className={`w-full text-left px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
              conversation.active
                ? 'bg-[#FFE8DC] border-l-2 border-[#FF6B35]'
                : 'hover:bg-white'
            }`}
          >
            <div className={`text-sm mb-1 line-clamp-1 ${\
              conversation.active ? 'text-[#0F1113] font-medium' : 'text-[#1C1E21]'\
            }`}>
              {conversation.title}
            </div>
            <div className="text-xs text-[#9CA3AF]">{conversation.timestamp}</div>
          </button>
        ))}
      </div>
    </div>
  );
}