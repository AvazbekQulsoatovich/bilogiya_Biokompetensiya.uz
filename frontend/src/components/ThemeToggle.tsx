"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className={`w-10 h-10 rounded-xl bg-surface-2 ${className}`} />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-10 h-10 rounded-xl flex items-center justify-center border border-line bg-surface text-ink-2 hover:bg-surface-2 transition-colors ${className}`}
      title={isDark ? "Yorugʻ mavzu" : "Qorongʻi mavzu"}
      aria-label={isDark ? "Yorugʻ mavzuga oʻtish" : "Qorongʻi mavzuga oʻtish"}
    >
      {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}
