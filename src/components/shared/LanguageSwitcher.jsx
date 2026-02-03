"use client";

import { useLanguage } from "@/src/context/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, toggleLocale, mounted } = useLanguage();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleLocale}
      className="fixed top-4 left-4 z-[999] flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-nightBlack border border-platinum dark:border-greyBlack rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      aria-label="Toggle Language"
    >
      <span className={locale === "fa" ? "opacity-50" : "font-semibold"}>EN</span>
      <span className="text-theme">/</span>
      <span className={locale === "en" ? "opacity-50" : "font-semibold"}>فا</span>
    </button>
  );
}
