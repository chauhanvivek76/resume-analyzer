import Link from "next/link";
import { Brain } from "lucide-react";
import { APP_NAME, SIDEBAR_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="mt-4 text-sm text-slate-400">
              AI-powered placement assistant to help you land your dream job with
              confidence.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Tools</h4>
            <ul className="mt-4 space-y-2">
              {SIDEBAR_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#features" className="text-sm text-slate-400 hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-sm text-slate-400 hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
