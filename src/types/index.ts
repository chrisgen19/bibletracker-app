export interface BibleEntry {
  id: string | number;
  book: string;
  chapters: string;
  verses?: string;
  date: string;
  timestamp: Date;
  // Fallback for old data structure
  verse?: string;
}

export interface BibleReading {
  id: string;
  userId: string;
  bibleBook: string;
  chapters: string;
  verses?: string;
  dateRead: Date;
  completed: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EntryFormData {
  book: string;
  chapters: string;
  verses: string;
  date: string;
}

export type EntriesMap = Record<string, BibleEntry[]>;
