import { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import type { EntryFormData, BibleEntry } from '@/types';

const BIBLE_BOOKS = [
  // Old Testament
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
  'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  // New Testament
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

interface EntryFormProps {
  onSubmit: (data: EntryFormData) => Promise<void> | void;
  initialDate: string;
  editingEntry?: BibleEntry | null;
  onCancelEdit?: () => void;
  lastReadBook?: string;
}

const inputClass =
  'flex h-9 sm:h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all';

const labelClass =
  'text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900';

export function EntryForm({ onSubmit, initialDate, editingEntry, onCancelEdit, lastReadBook }: EntryFormProps) {
  const [formData, setFormData] = useState<EntryFormData>({
    book: '',
    chapters: '',
    verses: '',
    date: initialDate,
  });
  const [submitting, setSubmitting] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update form when editing entry changes
  useEffect(() => {
    if (editingEntry) {
      setFormData({
        book: editingEntry.book,
        chapters: editingEntry.chapters,
        verses: editingEntry.verses || '',
        date: editingEntry.date,
      });
    } else {
      setFormData({
        book: '',
        chapters: '',
        verses: '',
        date: initialDate,
      });
    }
  }, [editingEntry, initialDate]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.book.trim() || !formData.chapters.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ ...formData, book: '', chapters: '', verses: '' });
      if (onCancelEdit) onCancelEdit();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Handle autocomplete for book field
    if (name === 'book') {
      if (value.trim()) {
        const matches = BIBLE_BOOKS.filter(book =>
          book.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredBooks(matches);
        setShowAutocomplete(matches.length > 0);
        setSelectedIndex(0);
      } else {
        setShowAutocomplete(false);
      }
    }
  };

  const handleBookSelect = (book: string) => {
    setFormData({ ...formData, book });
    setShowAutocomplete(false);
    setFilteredBooks([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || filteredBooks.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredBooks.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredBooks.length) % filteredBooks.length);
        break;
      case 'Enter':
        if (showAutocomplete) {
          e.preventDefault();
          handleBookSelect(filteredBooks[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        break;
    }
  };

  const handleCancel = () => {
    setFormData({ book: '', chapters: '', verses: '', date: initialDate });
    if (onCancelEdit) onCancelEdit();
  };

  const handleContinueFromLast = () => {
    if (lastReadBook) {
      setFormData({ ...formData, book: lastReadBook });
      // Focus on chapters field after setting the book
      setTimeout(() => {
        document.getElementById('chapters')?.focus();
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {/* Bible Book Input */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="book" className={labelClass}>
            Bible Book
          </label>
          {lastReadBook && !editingEntry && !formData.book && (
            <button
              type="button"
              onClick={handleContinueFromLast}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
            >
              <span>Continue from</span>
              <span className="font-semibold">{lastReadBook}</span>
            </button>
          )}
        </div>
        <div className="relative" ref={autocompleteRef}>
          <input
            ref={inputRef}
            id="book"
            name="book"
            type="text"
            value={formData.book}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Hebrews"
            className={inputClass}
            autoComplete="off"
          />
          {showAutocomplete && filteredBooks.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredBooks.map((book, index) => (
                <div
                  key={book}
                  onClick={() => handleBookSelect(book)}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {book}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Chapters Input */}
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="chapters" className={labelClass}>
            Chapters
          </label>
          <input
            id="chapters"
            name="chapters"
            type="text"
            value={formData.chapters}
            onChange={handleChange}
            placeholder="e.g. 1-3, 5"
            className={inputClass}
            autoComplete="off"
          />
        </div>

        {/* Verses Input */}
        <div className="space-y-1.5 sm:space-y-2">
          <label htmlFor="verses" className={labelClass}>
            Verses
          </label>
          <input
            id="verses"
            name="verses"
            type="text"
            value={formData.verses}
            onChange={handleChange}
            placeholder="e.g. 1-10"
            className={inputClass}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Date Read Input */}
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="date" className={labelClass}>
          Date Read
        </label>
        <div className="relative">
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={`${inputClass} appearance-none pr-10`}
          />
          <div className="absolute right-3 top-2 sm:top-2.5 pointer-events-none text-slate-500">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
      </div>

      <div className="pt-1 sm:pt-2 flex gap-2 sm:gap-3">
        {editingEntry && (
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 h-9 sm:h-10 px-4 py-2 w-full shadow-sm"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!formData.book.trim() || !formData.chapters.trim() || submitting}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 active:scale-95 h-9 sm:h-10 px-4 py-2 w-full shadow-sm"
        >
          {submitting ? 'Saving...' : editingEntry ? 'Update Entry' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}
