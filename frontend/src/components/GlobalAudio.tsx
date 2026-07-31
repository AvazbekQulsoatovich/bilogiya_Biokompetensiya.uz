"use client";

import { useEffect, useState } from "react";

export function GlobalAudio() {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    // Check initial state
    const musicEnabled = localStorage.getItem("bioedu_music") === "true";
    setPlay(musicEnabled);

    // Listen for changes from settings page
    const handleStorageChange = () => {
      const isEnabled = localStorage.getItem("bioedu_music") === "true";
      setPlay(isEnabled);
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event to catch changes in the same tab
    window.addEventListener("bioedu_music_changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("bioedu_music_changed", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    let audio = document.getElementById("global-bg-audio") as HTMLAudioElement;
    if (!audio) {
      audio = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
      audio.id = "global-bg-audio";
      audio.loop = true;
      audio.volume = 0.2;
      document.body.appendChild(audio);
    }

    if (play) {
      audio.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audio.pause();
    }
  }, [play]);

  return null;
}
