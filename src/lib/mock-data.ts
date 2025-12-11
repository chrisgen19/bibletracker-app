import type { EntriesMap } from '@/types';

export const generateMockData = (): EntriesMap => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDay = today.getDate();

  const getKey = (day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const data: EntriesMap = {};

  const addEntry = (dayOffset: number, entriesList: Array<{ book: string; chapters: string; verses: string }>) => {
    const targetDay = currentDay - dayOffset;
    if (targetDay > 0) {
      const dateKey = getKey(targetDay);
      data[dateKey] = entriesList.map((e, i) => ({
        id: `${targetDay}-${i}`,
        ...e,
        date: dateKey,
        timestamp: new Date(year, month, targetDay)
      }));
    }
  };

  addEntry(0, [{ book: "Revelation", chapters: "21", verses: "4" }]);
  addEntry(1, [{ book: "Genesis", chapters: "1", verses: "1" }]);
  addEntry(3, [
    { book: "Psalm", chapters: "23", verses: "1-6" },
    { book: "Proverbs", chapters: "3", verses: "5" }
  ]);
  addEntry(6, [
    { book: "John", chapters: "3", verses: "16" },
    { book: "Romans", chapters: "8", verses: "28" }
  ]);
  addEntry(14, [{ book: "Jeremiah", chapters: "29", verses: "11" }]);

  return data;
};
