"use client";

import { useEffect } from "react";
import "../i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  // Ensure i18n is loaded on the client side
  useEffect(() => {
    // i18n is initialized in the import above
  }, []);

  return (
    <>
      {children}
    </>
  );
}
