import { Trash2, Edit2 } from 'lucide-react';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import type { BibleEntry } from '@/types';

interface SwipeableEntryProps {
  entry: BibleEntry;
  displayString: string;
  onEdit?: (id: string | number) => void;
  onDelete: (id: string | number) => void;
}

export function SwipeableEntry({ entry, displayString, onEdit, onDelete }: SwipeableEntryProps) {
  const { swipeOffset, isAnimating, swipeAction, handlers } = useSwipeGesture({
    onEdit: onEdit ? () => onEdit(entry.id) : undefined,
    onDelete: () => onDelete(entry.id),
    editThreshold: 80,
    deleteThreshold: 150,
  });

  return (
    <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
      {/* Background action indicators */}
      <div className="absolute inset-0 flex items-center justify-end pr-4 sm:pr-6">
        {swipeAction === 'edit' && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">Edit</span>
          </div>
        )}
        {swipeAction === 'delete' && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-semibold text-sm sm:text-base">Delete</span>
          </div>
        )}
      </div>

      {/* Swipeable content */}
      <div
        {...handlers}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isAnimating ? 'transform 0.3s ease-out' : 'none',
          cursor: 'grab',
        }}
        className="group flex items-center justify-between bg-white p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all touch-pan-y active:cursor-grabbing"
      >
        <span className="font-medium text-slate-700 text-sm sm:text-base pr-2 break-words">
          {displayString}
        </span>
        <button
          onClick={() => onDelete(entry.id)}
          className="opacity-70 sm:opacity-0 group-hover:opacity-100 p-1.5 sm:p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
          aria-label="Delete entry"
        >
          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
