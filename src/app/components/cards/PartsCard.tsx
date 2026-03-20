interface PartsCardProps {
  partName: string;
  skuCode: string;
  category: string;
  stockQuantity: number;
  reorderLevel: number;
  unitCost?: number;
}

export const PartsCard = ({ partName, skuCode, category, stockQuantity, reorderLevel, unitCost }: PartsCardProps) => {
  const getStockStatus = () => {
    if (stockQuantity === 0) {
      return { label: 'Out of Stock', color: 'bg-[#FEF2F2] text-[#EF4444]' };
    } else if (stockQuantity <= reorderLevel) {
      return { label: 'Low Stock', color: 'bg-[#FFF4ED] text-[#F59E0B]' };
    } else {
      return { label: 'In Stock', color: 'bg-[#F0FDF4] text-[#10B981]' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8F9FB] transition-colors cursor-pointer">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0 bg-[#F5F3FF] text-[#8B5CF6]">
        {partName.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1C1E21] truncate">{partName}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          SKU: {skuCode} • {category}
        </p>
        <p className="text-[11px] text-[#9CA3AF] truncate">
          Qty: {stockQuantity} • Reorder: {reorderLevel}{unitCost ? ` • $${unitCost.toFixed(2)}` : ''}
        </p>
      </div>
      <div className="flex-shrink-0">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${stockStatus.color}`}>
          {stockStatus.label}
        </span>
      </div>
    </div>
  );
};
