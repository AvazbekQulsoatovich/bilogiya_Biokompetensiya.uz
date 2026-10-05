"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const TITLES: Record<string, string> = {
  dashboard: "Asosiy sahifa", topics: "Mavzular", books: "Darsliklar", glossary: "Lugʻat", facts: "Qiziqarli faktlar",
  labs: "Virtual laboratoriyalar", models: "3D modellar", extracurricular: "Darsdan tashqari",
  quizzes: "Test topshiriqlari", crosswords: "Krossvordlar", games: "Interaktiv oʻyinlar",
};

export function Topbar() {
  const [music, setMusic] = useState(false);
  const seg = (usePathname() || "").split("/")[1] || "dashboard";
  const title = TITLES[seg];

  useEffect(() => {
    try {
      setMusic(localStorage.getItem("bioedu_music") === "true");
    } catch {}
  }, []);

  const toggleMusic = () => {
    const next = !music;
    setMusic(next);
    try {
      localStorage.setItem("bioedu_music", String(next));
    } catch {}
    window.dispatchEvent(new Event("bioedu_music_changed"));
  };

  return (
    <div className="print-hide hidden md:flex sticky top-0 z-30 h-16 items-center justify-between gap-2 px-6 lg:px-10 bg-bg/80 backdrop-blur-md border-b border-line">
      <nav aria-label="Joylashuv" className="flex items-center gap-2 text-sm font-semibold text-muted min-w-0">
        <Link href="/dashboard" className="hover:text-ink transition-colors">Biokompetensiya</Link>
        {title && seg !== "dashboard" && (
          <>
            <span aria-hidden className="opacity-50">/</span>
            <span className="text-ink truncate">{title}</span>
          </>
        )}
      </nav>
      <div className="flex items-center gap-2">
      <button
        onClick={toggleMusic}
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-line bg-surface text-ink-2 hover:bg-surface-2 transition-colors"
        title={music ? "Fon musiqasini oʻchirish" : "Fon musiqasini yoqish"}
        aria-label={music ? "Fon musiqasini oʻchirish" : "Fon musiqasini yoqish"}
        aria-pressed={music}
      >
        {music ? <Volume2 className="w-[18px] h-[18px]" /> : <VolumeX className="w-[18px] h-[18px]" />}
      </button>
      <ThemeToggle />
      </div>
    </div>
  );
}
