"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, LogOut, X } from "lucide-react";
import { APP_NAME, SIDEBAR_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-white">{APP_NAME}</span>
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-violet-500/10 text-violet-400"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-medium">{link.label}</span>
                <p className="text-xs text-slate-500">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-slate-800/60 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
        {content}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-slate-950">
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
