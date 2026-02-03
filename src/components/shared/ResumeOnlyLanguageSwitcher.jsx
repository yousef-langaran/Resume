"use client";

import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * نمایش دکمه فارسی/انگلیسی فقط در صفحه نمایش رزومه (/resume/...)
 */
export default function ResumeOnlyLanguageSwitcher() {
  const pathname = usePathname();
  const isResumePage = pathname?.startsWith("/resume/");

  if (!isResumePage) return null;

  return <LanguageSwitcher />;
}
