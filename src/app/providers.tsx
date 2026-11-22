"use client";

import React, { useEffect } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { useLanguageStore, SupportedLocale } from "@/stores/language.store";

export function Providers({ children }: { children: React.ReactNode }) {
  const { setLocale } = useLanguageStore();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("starline_locale") as SupportedLocale | null;
      if (saved && (saved === "bn" || saved === "en")) {
        setLocale(saved);
        document.documentElement.lang = saved;
        document.documentElement.setAttribute("data-lang", saved);
      } else {
        document.documentElement.lang = "bn";
        document.documentElement.setAttribute("data-lang", "bn");
      }
    } catch {}
  }, [setLocale]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
