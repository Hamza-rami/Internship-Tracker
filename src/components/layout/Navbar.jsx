import React from 'react';
import { Menu, Sun, Moon, Plus, LogOut, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar({ onOpenSidebar, onOpenAddModal }) {
  const { theme, toggleTheme, currentUser, logout } = useApp();

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold text-slate-200">
            {currentUser ? `${currentUser.fullName}'s Internship Workspace` : 'Internship Dashboard'}
          </h1>
          <p className="text-xs text-slate-400">
            {currentUser ? `@${currentUser.username} • ${currentUser.campus || '1337'}` : '100% private & offline-ready'}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* User quick badge */}
        {currentUser && (
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="w-5 h-5 rounded-lg bg-indigo-600/30 text-indigo-400 font-bold flex items-center justify-center text-[10px] uppercase">
              {currentUser.fullName ? currentUser.fullName.slice(0, 1) : 'U'}
            </div>
            <span className="font-medium text-slate-300">{currentUser.fullName.split(' ')[0]}</span>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Primary Add Application Button */}
        <button
          type="button"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>

        {/* Quick Log out */}
        {currentUser && (
          <button
            type="button"
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors border border-slate-800 sm:hidden"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
