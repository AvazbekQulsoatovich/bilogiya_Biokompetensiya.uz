"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getThemeBg = (path: string) => {
    if (path.startsWith("/dashboard")) return "bg-blue-50/40";
    if (path.startsWith("/profile")) return "bg-slate-50/40";
    if (path.startsWith("/topics")) return "bg-indigo-50/40";
    if (path.startsWith("/books")) return "bg-violet-50/40";
    if (path.startsWith("/labs")) return "bg-green-50/40";
    if (path.startsWith("/models")) return "bg-purple-50/40";
    if (path.startsWith("/quizzes")) return "bg-orange-50/40";
    if (path.startsWith("/extracurricular")) return "bg-teal-50/40";
    if (path.startsWith("/crosswords")) return "bg-cyan-50/40";
    if (path.startsWith("/games")) return "bg-pink-50/40";
    if (path.startsWith("/glossary")) return "bg-rose-50/40";
    if (path.startsWith("/facts")) return "bg-amber-50/40";
    if (path.startsWith("/progress")) return "bg-red-50/40";
    if (path.startsWith("/achievements")) return "bg-yellow-50/40";
    if (path.startsWith("/leaderboard")) return "bg-sky-50/40";
    if (path.startsWith("/goals")) return "bg-emerald-50/40";
    if (path.startsWith("/guide")) return "bg-fuchsia-50/40";
    if (path.startsWith("/settings")) return "bg-gray-100/40";
    return "bg-background";
  };

  return (
    <div className={`flex-1 flex flex-col transition-colors duration-500 ${getThemeBg(pathname)}`}>
      {children}
    </div>
  );
}
