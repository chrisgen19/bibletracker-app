import { useRef } from 'react';
import { DayCell } from './DayCell';
import { getDaysInMonth, getFirstDayOfMonth, formatDateKey, isDatePast } from '@/lib/date-utils';
import type { EntriesMap } from '@/types';

interface CalendarGridProps {
  currentDate: Date;
  selectedDate: Date | null;
  entries: EntriesMap;
  onDayClick: (date: Date) => void;
  dragOffset: number;
  gestureHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weekdaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function CalendarGrid({
  currentDate,
  selectedDate,
  entries,
  onDayClick,
  dragOffset,
  gestureHandlers,
}: CalendarGridProps) {
  const calendarRef = useRef<HTMLElement>(null);
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const isToday = (day: number): boolean => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return formatDateKey(today) === formatDateKey(checkDate);
  };

  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return formatDateKey(selectedDate) === formatDateKey(checkDate);
  };

  return (
    <main
      ref={calendarRef}
      className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-20 sm:pb-8 relative touch-pan-y overflow-hidden"
      {...gestureHandlers}
    >
      <div
        className="transition-transform duration-300 ease-out h-full flex flex-col"
        style={{ transform: `translateX(${dragOffset}px)` }}
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-1 sm:mb-2 border-b border-slate-200 border-dashed pb-1 sm:pb-2">
          {/* Mobile: Single letter */}
          {weekdaysShort.map((day, idx) => (
            <div
              key={`short-${idx}`}
              className="sm:hidden text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
          {/* Desktop: Full abbreviation */}
          {weekdays.map((day) => (
            <div
              key={day}
              className="hidden sm:block text-center text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-[1px] sm:gap-[2px]">
          {/* Padding for days before month start */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div
              key={`pad-${i}`}
              className="h-20 sm:h-28 md:h-40 rounded-md sm:rounded-lg border border-slate-200 border-dashed bg-slate-50/30"
            />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dateKey = formatDateKey(dateObj);
            const dayEntries = entries[dateKey] || [];

            return (
              <DayCell
                key={day}
                day={day}
                isToday={isToday(day)}
                isSelected={isSelected(day)}
                isPast={isDatePast(currentDate, day)}
                entries={dayEntries}
                onClick={() => onDayClick(dateObj)}
              />
            );
          })}

          {/* Padding for days after month end */}
          {Array.from({ length: (7 - ((daysInMonth + firstDay) % 7)) % 7 }).map((_, i) => (
            <div
              key={`end-pad-${i}`}
              className="h-20 sm:h-28 md:h-40 rounded-md sm:rounded-lg border border-slate-200 border-dashed bg-slate-50/30"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
