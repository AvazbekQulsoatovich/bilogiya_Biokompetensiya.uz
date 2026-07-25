"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "../i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  // Ensure i18n is loaded on the client side
  useEffect(() => {
    // i18n is initialized in the import above
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
