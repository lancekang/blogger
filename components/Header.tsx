"use client";

import { Session } from "next-auth";
import DarkModeToggle from "./DarkModeToggle";

type HeaderProps = {
  session: Session | null;
  status: string;
  signOut: () => void;
};

export default function Header({ session, status, signOut }: HeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Blogger Agent Bridge</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-white">Blogger 포스팅 관리자</h1>
      </div>

      <div className="flex items-center gap-3">
        <DarkModeToggle />
        
        {status === "authenticated" ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-slate-600 sm:inline dark:text-slate-300">
              {session?.user?.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              로그아웃
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
