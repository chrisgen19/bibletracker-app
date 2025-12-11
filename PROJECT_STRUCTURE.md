# Bible Tracker - Project Structure

A Next.js application for tracking daily Bible readings with a beautiful calendar interface.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main application page (client component)
│   └── globals.css         # Global styles with Tailwind
│
├── components/
│   ├── Header.tsx          # App header with logo and user info
│   ├── MonthControl.tsx    # Month navigation controls
│   ├── CalendarGrid.tsx    # Main calendar grid with gesture support
│   ├── DayCell.tsx         # Individual day cell component
│   ├── EntrySheet.tsx      # Modal sheet for viewing/editing entries
│   ├── EntryForm.tsx       # Form for adding new Bible entries
│   ├── AddButton.tsx       # Floating action button
│   └── index.ts            # Component exports
│
├── hooks/
│   ├── useStickyState.ts   # Custom hook for localStorage persistence
│   ├── useCalendarGestures.ts  # Touch/mouse gesture handling
│   └── index.ts            # Hook exports
│
├── lib/
│   ├── date-utils.ts       # Date manipulation utilities
│   └── mock-data.ts        # Mock data generator
│
└── types/
    └── index.ts            # TypeScript type definitions
```

## Component Hierarchy

```
Home (page.tsx)
├── Header
├── MonthControl
├── CalendarGrid
│   └── DayCell (multiple)
├── AddButton
└── EntrySheet
    ├── EntryForm
    └── Entry List
```

## Key Features

- **Responsive Design**: Works on mobile and desktop
- **Touch Gestures**: Swipe to navigate months on mobile
- **Local Storage**: Automatic data persistence
- **TypeScript**: Full type safety
- **Tailwind CSS v4**: Modern styling with the latest Tailwind

## Data Structure

```typescript
interface BibleEntry {
  id: string | number;
  book: string;
  chapters: string;
  verses?: string;
  timestamp: Date;
}

type EntriesMap = Record<string, BibleEntry[]>;
```

Entries are stored in localStorage with the key `bible-tracker-entries-v4`.

## Running the Application

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server
```

The app will be available at http://localhost:3000
