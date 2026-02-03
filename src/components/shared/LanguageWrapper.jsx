"use client";

import { useLanguage } from "@/src/context/LanguageContext";
import { useEffect } from "react";

export default function LanguageWrapper({ children }) {
  const { locale, isRTL, mounted } = useLanguage();

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRTL ? "rtl" : "ltr";
    }
  }, [locale, isRTL, mounted]);

  return <div className={isRTL ? "font-vazir" : ""}>{children}</div>;
}
