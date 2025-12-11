import { useState, FormEvent, ChangeEvent } from 'react';
import { Calendar } from 'lucide-react';
import type { EntryFormData } from '@/types';

interface EntryFormProps {
  onSubmit: (data: EntryFormData) => Promise<void> | void;
  initialDate: string;
}

const inputClass =
  'flex h-9 sm:h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all';

const labelClass =
  'text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-900';

export function EntryForm({ onSubmit, initialDate }: EntryFormProps) {
  const [formData, setFormData] = useState<EntryFormData>({
    book: '',
    chapters: '',
    verses: '',
    date: initialDate,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.book.trim() || !formData.chapters.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ ...formData, book: '', chapters: '', verses: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {/* Bible Book Input */}
      <div className="space-y-1.5 sm:space-y-2">
        <label htmlFor="book" className={labelClass}>
          Bible Book
        </label>
        <input
          id="book"
          name="book"
          type="text"
          value={formData.book}
          onChange={handleChange}
          placeholder="e.g. Hebrews"
          className={inputClass}
          autoComplete="off"
        />
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

      <div className="pt-1 sm:pt-2">
        <button
          type="submit"
          disabled={!formData.book.trim() || !formData.chapters.trim() || submitting}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 active:scale-95 h-9 sm:h-10 px-4 py-2 w-full shadow-sm"
        >
          {submitting ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}
