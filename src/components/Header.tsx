'use client';

import { BookOpen, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSettingsClick = () => {
    router.push('/profile');
  };

  return (
    <header className="w-full pt-4 sm:pt-6 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between z-20 gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2 sm:gap-3">
            <div className="bg-emerald-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
            <span className="truncate">Scripture Log</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 border-dashed">
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <span className="text-sm font-medium text-slate-600">
              {user ? `${user.firstName} ${user.lastName}` : 'John Doe'}
            </span>
          </div>
          <button
            onClick={handleSettingsClick}
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
