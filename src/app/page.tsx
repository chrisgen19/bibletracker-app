'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MonthControl } from '@/components/MonthControl';
import { CalendarGrid } from '@/components/CalendarGrid';
import { EntrySheet } from '@/components/EntrySheet';
import { AddButton } from '@/components/AddButton';
import { useCalendarGestures } from '@/hooks/useCalendarGestures';
import { formatDateKey } from '@/lib/date-utils';
import type { EntryFormData, EntriesMap, BibleReading } from '@/types';

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [entries, setEntries] = useState<EntriesMap>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const { dragOffset, handlers: gestureHandlers } = useCalendarGestures(nextMonth, prevMonth);

  // Fetch readings from database on mount
  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      const response = await fetch('/api/readings');
      if (response.ok) {
        const data = await response.json();
        convertReadingsToEntries(data.readings);
      }
    } catch (error) {
      console.error('Failed to fetch readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertReadingsToEntries = (readings: BibleReading[]) => {
    const entriesMap: EntriesMap = {};

    readings.forEach((reading) => {
      const dateKey = formatDateKey(new Date(reading.dateRead));
      if (!entriesMap[dateKey]) {
        entriesMap[dateKey] = [];
      }

      entriesMap[dateKey].push({
        id: reading.id,
        book: reading.bibleBook,
        chapters: reading.chapters,
        verses: reading.verses || '',
        date: dateKey,
        timestamp: new Date(reading.createdAt),
      });
    });

    setEntries(entriesMap);
  };

  const addEntry = async (entryData: EntryFormData) => {
    try {
      console.log('Adding entry:', entryData);

      // Keep the date as-is, just set time to noon to avoid timezone issues
      const [year, month, day] = entryData.date.split('-').map(Number);
      const dateRead = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

      const payload = {
        bibleBook: entryData.book,
        chapters: entryData.chapters,
        verses: entryData.verses,
        dateRead: dateRead.toISOString(),
      };

      console.log('Sending payload:', payload);

      const response = await fetch('/api/readings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (response.ok) {
        // Refresh readings from database
        await fetchReadings();
      } else {
        console.error('Failed to add reading:', data);
        alert(`Error: ${data.error || 'Failed to add reading'}`);
      }
    } catch (error) {
      console.error('Error adding reading:', error);
      alert('An error occurred while saving');
    }
  };

  const editEntry = async (entryId: string | number, entryData: EntryFormData) => {
    try {
      // Keep the date as-is, just set time to noon to avoid timezone issues
      const [year, month, day] = entryData.date.split('-').map(Number);
      const dateRead = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

      const payload = {
        book: entryData.book,
        chapters: entryData.chapters,
        verses: entryData.verses,
        date: dateRead.toISOString(),
      };

      const response = await fetch(`/api/readings/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Refresh readings from database
        await fetchReadings();
      } else {
        const data = await response.json();
        console.error('Failed to update reading:', data);
        alert(`Error: ${data.error || 'Failed to update reading'}`);
      }
    } catch (error) {
      console.error('Error updating reading:', error);
      alert('An error occurred while updating');
    }
  };

  const removeEntry = async (entryId: string | number) => {
    try {
      const response = await fetch(`/api/readings/${entryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh readings from database
        await fetchReadings();
      } else {
        console.error('Failed to delete reading');
      }
    } catch (error) {
      console.error('Error deleting reading:', error);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsSheetOpen(true);
  };

  const handleAddButtonClick = () => {
    setSelectedDate(new Date());
    setIsSheetOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="text-slate-600">Loading your readings...</div>
      </div>
    );
  }

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
        onEditEntry={editEntry}
        onRemoveEntry={removeEntry}
      />
    </div>
  );
}
