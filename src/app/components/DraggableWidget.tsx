import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { GripVertical } from 'lucide-react';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

interface DraggableWidgetProps {
  id: string;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  index,
  moveWidget,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'widget',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveWidget(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'widget',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={`relative group/drag transition-all duration-200 ${
        isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100'
      }`}
    >
      {/* Drag handle */}
      <div
        ref={(node) => { drag(node); }}
        className="absolute top-2 left-2 z-20 opacity-0 group-hover/drag:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-0.5 px-1.5 py-1 bg-white/90 backdrop-blur-sm rounded-md shadow-sm border border-[#E6E8EC]">
          <GripVertical className="w-3.5 h-3.5 text-[#9CA3AF]" />
        </div>
      </div>
      {children}
    </div>
  );
};
