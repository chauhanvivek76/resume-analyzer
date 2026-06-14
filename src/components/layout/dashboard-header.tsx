"use client";

import { Bell, Menu, Search } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
}

export function DashboardHeader({
  title,
  description,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white sm:text-xl">{title}</h1>
            {description && (
              <p className="hidden text-sm text-slate-400 sm:block">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-lg border border-slate-700 bg-slate-900/80 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
            />
          </div>
          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-violet-500" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-medium text-white">
            VC
          </div>
        </div>
      </div>
    </header>
  );
}
