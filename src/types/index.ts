export interface BibleEntry {
  id: string | number;
  book: string;
  chapters: string;
  verses?: string;
  timestamp: Date;
  // Fallback for old data structure
  verse?: string;
}

export interface EntryFormData {
  book: string;
  chapters: string;
  verses: string;
  date: string;
}

export type EntriesMap = Record<string, BibleEntry[]>;
