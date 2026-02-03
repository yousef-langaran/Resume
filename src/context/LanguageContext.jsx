"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import faTranslations from "@/src/locales/fa.json";
import enTranslations from "@/src/locales/en.json";

const translations = { fa: faTranslations, en: enTranslations };

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("fa");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("locale");
    if (saved && (saved === "fa" || saved === "en")) {
      setLocale(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("locale", locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
    }
  }, [locale, mounted]);

  const t = useCallback(
    (key) => {
      const keys = key.split(".");
      let value = translations[locale];
      for (const k of keys) {
        value = value?.[k];
        if (!value) break;
      }
      return value || key;
    },
    [locale]
  );

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "fa" ? "en" : "fa"));
  }, []);

  const isRTL = locale === "fa";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, toggleLocale, isRTL, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, locale, isRTL } = useLanguage();
  return { t, locale, isRTL };
}
