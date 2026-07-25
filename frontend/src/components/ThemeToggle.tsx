"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-foreground/5 animate-pulse" />;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-3 rounded-xl transition-all duration-300 flex items-center justify-center hover:bg-white/10 bg-white/5 border border-white/10"
      title="Temani o'zgartirish"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <Sun 
          className={`absolute transition-all duration-500 text-yellow-500 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
        />
        <Moon 
          className={`absolute transition-all duration-500 text-blue-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
        />
      </div>
    </button>
  );
}
