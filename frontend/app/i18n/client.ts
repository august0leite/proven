"use client";

import { useEffect, useState } from "react";
import translationData from "./proven.json";
import workspaceTranslationData from "./workspace.json";
import { readSession, setSessionLocale } from "@/lib/session";

const mergedTranslations = {
  en: {
    ...translationData.en,
    ...workspaceTranslationData.en,
  },
  pt: {
    ...translationData.pt,
    ...workspaceTranslationData.pt,
  },
} as const;

type TranslationSchema = typeof mergedTranslations.en;

export const translations = mergedTranslations as Record<"en" | "pt", TranslationSchema>;

export type Locale = keyof typeof translations;

export function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "pt";
}

export function useStoredLocale(initialLocale: Locale = "pt") {
  const [locale, setLocale] = useState<Locale>(initialLocale);

  useEffect(() => {
    const sessionLocale = readSession().locale;
    const storedLocale = window.localStorage.getItem("proven-locale");

    if (isLocale(storedLocale)) {
      setLocale(storedLocale);
      return;
    }

    setLocale(sessionLocale);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("proven-locale", locale);
    setSessionLocale(locale);
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  return { locale, setLocale };
}
