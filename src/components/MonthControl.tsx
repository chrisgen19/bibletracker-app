import { ChevronLeft, ChevronRight } from 'lucide-react';
import { monthNames } from '@/lib/date-utils';

interface MonthControlProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function MonthControl({ currentDate, onPrevMonth, onNextMonth }: MonthControlProps) {
  return (
    <div className="w-full py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
        <span className="text-base sm:text-lg font-bold min-w-[120px] sm:min-w-[140px] select-none text-slate-800">
          {monthNames[currentDate.getMonth()]}{' '}
          <span className="text-slate-400 font-normal">{currentDate.getFullYear()}</span>
        </span>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={onPrevMonth}
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-all active:scale-95 text-slate-500 hover:text-emerald-600"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-all active:scale-95 text-slate-500 hover:text-emerald-600"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
