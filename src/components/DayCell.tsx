import { BookOpen } from 'lucide-react';
import type { BibleEntry } from '@/types';

interface DayCellProps {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  isPast: boolean;
  entries: BibleEntry[];
  onClick: () => void;
}

function getDisplayString(entry: BibleEntry): string {
  if (entry.verse) return entry.verse;
  return `${entry.book} ${entry.chapters}${entry.verses ? ':' + entry.verses : ''}`;
}

export function DayCell({ day, isToday, isSelected, isPast, entries, onClick }: DayCellProps) {
  const hasData = entries.length > 0;

  let bgClass = "bg-white hover:bg-slate-50";
  if (isSelected) {
    bgClass = "bg-emerald-100/50";
  } else if (hasData) {
    bgClass = "bg-emerald-50/70 hover:bg-emerald-100/40";
  } else if (isPast) {
    bgClass = "bg-red-50/40 hover:bg-red-50/60";
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative flex flex-col justify-between
        h-20 sm:min-h-[100px] sm:h-28 md:h-40
        p-1.5 sm:p-2 md:p-3
        cursor-pointer transition-all duration-200 select-none group
        rounded-md sm:rounded-lg
        border border-slate-200 border-dashed
        ${bgClass}
        ${isToday ? 'border-solid border-2 border-emerald-500 z-20 shadow-lg shadow-emerald-100/30' : ''}
        ${isSelected ? 'z-10 ring-1 ring-inset ring-emerald-300' : ''}
        active:scale-95
      `}
    >
      <div className="flex justify-between items-start">
        <span
          className={`
            text-xs sm:text-sm md:text-base font-bold w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full transition-colors
            ${isToday
              ? 'bg-emerald-600 text-white'
              : isSelected
                ? 'bg-emerald-600/20 text-emerald-800'
                : 'text-slate-400 group-hover:text-emerald-600'}
          `}
        >
          {day}
        </span>
        {hasData && (
          <div
            className={`hidden md:flex
              text-[10px] font-bold px-1.5 py-0.5 rounded-md items-center gap-1
              ${isToday ? 'bg-emerald-50 text-emerald-700' : 'bg-white/80 text-emerald-600 shadow-sm'}
            `}
          >
            <BookOpen className="w-3 h-3" />
            {entries.length}
          </div>
        )}
        {/* Mobile/Small tablet indicator */}
        {hasData && (
          <div
            className={`md:hidden w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-0.5 sm:mt-1 ${isToday ? 'bg-emerald-500' : 'bg-emerald-400'}`}
          />
        )}
      </div>

      {/* Desktop view - show entry previews */}
      <div className="hidden md:flex flex-col gap-1 overflow-hidden mt-1">
        {entries.slice(0, 3).map((entry, idx) => (
          <div
            key={idx}
            className={`
              text-[10px] truncate rounded px-1.5 py-1 font-medium
              ${isToday
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-white/60 text-slate-600 border border-slate-100/50'}
            `}
          >
            {getDisplayString(entry)}
          </div>
        ))}
      </div>

      {/* Mobile/Small tablet view - show up to 3 entries */}
      <div className="md:hidden mt-0.5 sm:mt-1 flex flex-col gap-0.5">
        {hasData ? (
          <>
            {entries.slice(0, 3).map((entry, idx) => (
              <div
                key={idx}
                className={`text-[8px] sm:text-[9px] truncate leading-tight ${
                  isToday ? 'text-emerald-700 font-medium' : 'text-slate-500'
                }`}
              >
                {getDisplayString(entry)}
              </div>
            ))}
            {entries.length > 3 && (
              <div
                className={`text-[7px] sm:text-[8px] font-bold ${
                  isToday ? 'text-emerald-600' : 'text-emerald-500'
                }`}
              >
                +{entries.length - 3} more
              </div>
            )}
          </>
        ) : (
          <div className="h-2 sm:h-3" />
        )}
      </div>
    </div>
  );
}
