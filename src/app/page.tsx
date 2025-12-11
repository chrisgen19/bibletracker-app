'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MonthControl } from '@/components/MonthControl';
import { CalendarGrid } from '@/components/CalendarGrid';
import { EntrySheet } from '@/components/EntrySheet';
import { AddButton } from '@/components/AddButton';
import { useStickyState } from '@/hooks/useStickyState';
import { useCalendarGestures } from '@/hooks/useCalendarGestures';
import { generateMockData } from '@/lib/mock-data';
import { formatDateKey } from '@/lib/date-utils';
import type { EntryFormData, EntriesMap } from '@/types';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entries, setEntries] = useStickyState<EntriesMap>(
    generateMockData(),
    'bible-tracker-entries-v4'
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const { dragOffset, handlers: gestureHandlers } = useCalendarGestures(nextMonth, prevMonth);

  const addEntry = (entryData: EntryFormData) => {
    const dateObj = new Date(entryData.date);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);

    const key = formatDateKey(adjustedDate);
    const current = entries[key] || [];

    setEntries({
      ...entries,
      [key]: [
        ...current,
        {
          id: Date.now(),
          book: entryData.book,
          chapters: entryData.chapters,
          verses: entryData.verses,
          timestamp: new Date(),
        },
      ],
    });
  };

  const removeEntry = (entryId: string | number) => {
    if (!selectedDate) return;
    const key = formatDateKey(selectedDate);
    const current = entries[key] || [];
    setEntries({
      ...entries,
      [key]: current.filter((e) => e.id !== entryId),
    });
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  };

  const handleAddButtonClick = () => {
    setSelectedDate(new Date());
    setIsSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-slate-800 font-sans selection:bg-emerald-100 flex flex-col">
      <Header />

      <MonthControl currentDate={currentDate} onPrevMonth={prevMonth} onNextMonth={nextMonth} />

      <CalendarGrid
        currentDate={currentDate}
        selectedDate={selectedDate}
        entries={entries}
        onDayClick={handleDayClick}
        dragOffset={dragOffset}
        gestureHandlers={gestureHandlers}
      />

      <AddButton onClick={handleAddButtonClick} />

      <EntrySheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        selectedDate={selectedDate}
        entries={entries}
        onAddEntry={addEntry}
        onRemoveEntry={removeEntry}
      />
    </div>
  );
}
