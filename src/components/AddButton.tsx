import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
}

export function AddButton({ onClick }: AddButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-30">
      <button
        onClick={onClick}
        className="bg-emerald-600 text-white p-3 sm:p-3.5 md:p-4 rounded-xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center group"
        aria-label="Add new entry"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
