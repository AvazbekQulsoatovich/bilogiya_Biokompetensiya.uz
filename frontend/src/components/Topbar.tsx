"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar() {
  const [music, setMusic] = useState(false);

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
    <div className="print-hide hidden md:flex sticky top-0 z-30 h-16 items-center justify-end gap-2 px-6 lg:px-10 bg-bg/80 backdrop-blur-md border-b border-line">
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
  );
}
