"use client";

import { create } from "zustand";

export type SupportedLocale = "bn" | "en";

interface LanguageState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  toggleLocale: () => void;
  t: (bn: string, en: string) => string;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  locale: "bn",
  setLocale: (locale) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("starline_locale", locale);
        document.documentElement.lang = locale;
        document.documentElement.setAttribute("data-lang", locale);
      } catch {}
    }
    set({ locale });
  },
  toggleLocale: () => {
    const next = get().locale === "bn" ? "en" : "bn";
    get().setLocale(next);
  },
  t: (bn, en) => {
    return get().locale === "bn" ? bn : en;
  },
}));
