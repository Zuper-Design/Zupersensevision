import React, { useState } from 'react';
import { Check, ListChecks } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface ChecklistCardProps {
  title: string;
  items: ChecklistItem[];
}

export const ChecklistCard: React.FC<ChecklistCardProps> = ({
  title,
  items: initialItems,
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;

  return (
    <div className="w-full max-w-[480px] bg-white rounded-2xl border border-[#E6E8EC] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header - Compact */}
      <div className="px-5 py-3 border-b border-[#E6E8EC]">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#EEF2FF]">
            <ListChecks className="w-3.5 h-3.5 text-[#6366F1]" />
          </div>
          <h3 className="text-[14px] font-semibold text-[#1C1E21]">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-[#F1F3F5] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#6366F1] transition-all duration-300 rounded-full"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-[#6B7280] font-medium">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="px-5 py-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className="flex items-start gap-3 cursor-pointer group"
            >
              {/* Checkbox */}
              <div
                className={`
                  flex items-center justify-center w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 mt-0.5
                  ${item.completed 
                    ? 'bg-[#6366F1] border-[#6366F1]' 
                    : 'border-[#D1D5DB] group-hover:border-[#6366F1]'
                  }
                `}
              >
                {item.completed && (
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                )}
              </div>

              {/* Text */}
              <span
                className={`
                  text-[14px] leading-relaxed transition-all
                  ${item.completed 
                    ? 'text-[#9CA3AF] line-through' 
                    : 'text-[#1C1E21] group-hover:text-[#6366F1]'
                  }
                `}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};