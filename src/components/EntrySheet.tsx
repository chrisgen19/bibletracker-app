import { X, Calendar as CalendarIcon } from 'lucide-react';
import { EntryForm } from './EntryForm';
import { SwipeableEntry } from './SwipeableEntry';
import { formatDateKey } from '@/lib/date-utils';
import type { BibleEntry, EntryFormData, EntriesMap } from '@/types';

interface EntrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  entries: EntriesMap;
  onAddEntry: (data: EntryFormData) => void;
  onRemoveEntry: (id: string | number) => void;
}

function getDisplayString(entry: BibleEntry): string {
  if (entry.verse) return entry.verse;
  return `${entry.book} ${entry.chapters}${entry.verses ? ':' + entry.verses : ''}`;
}

export function EntrySheet({
  isOpen,
  onClose,
  selectedDate,
  entries,
  onAddEntry,
  onRemoveEntry,
}: EntrySheetProps) {
  if (!isOpen || !selectedDate) return null;

  const dateKey = formatDateKey(selectedDate);
  const dayEntries = entries[dateKey] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-xl md:rounded-3xl rounded-t-3xl shadow-2xl z-10 transform transition-transform duration-300 flex flex-col max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-8 fade-in">
        {/* Mobile drag handle */}
        <div className="w-full flex justify-center pt-3 pb-2 md:hidden cursor-pointer" onClick={onClose}>
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b border-slate-50 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'long',
                day: 'numeric',
              })}
            </h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base">Daily Reflection</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-7 md:py-8 overflow-y-auto">
          <EntryForm
            onSubmit={onAddEntry}
            initialDate={dateKey}
          />

          <div className="mt-8 sm:mt-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">
                Readings
              </h3>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {dayEntries.length} {dayEntries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {dayEntries.length > 0 ? (
                dayEntries.map((entry) => (
                  <SwipeableEntry
                    key={entry.id}
                    entry={entry}
                    displayString={getDisplayString(entry)}
                    onDelete={onRemoveEntry}
                  />
                ))
              ) : (
                <div className="text-center py-8 sm:py-10 md:py-12 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-2xl sm:rounded-3xl">
                  <div className="bg-white w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-sm">
                    <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-medium text-sm sm:text-base">No verses recorded yet.</p>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1">Fill out the fields above to add one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
