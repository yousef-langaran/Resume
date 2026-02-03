import "./globals.css";

// External styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/effect-creative";
import "swiper/css/effect-coverflow";
import "react-modern-drawer/dist/index.css";
import "react-circular-progressbar/dist/styles.css";
// import "tw-elements-react/dist/css/tw-elements-react.min.css";

import CustomCursor from "@/src/components/shared/CustomCursor";
import { Poppins } from "next/font/google";
import BackToTop from "@/src/components/shared/BackToTop";
import ModeSwitcher from "@/src/components/shared/ModeSwitcher";
import ResumeOnlyLanguageSwitcher from "@/src/components/shared/ResumeOnlyLanguageSwitcher";
import { ThemeProvider } from "../context/theme-provider";
import { ResumeProvider } from "../context/ResumeContext";
import { LanguageProvider } from "../context/LanguageContext";
import LanguageWrapper from "@/src/components/shared/LanguageWrapper";

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "رزومه‌ساز | ساخت رزومه آنلاین",
  description: "رزومه آنلاین حرفه‌ای با لینک اختصاصی. ثبت‌نام رایگان.",
};

export default async function RootLayout({ children }) {
  let initialResumeData = null;
  try {
    const { getResumeData } = await import("@/src/lib/getResumeData");
    initialResumeData = await getResumeData();
  } catch (e) {
    console.warn("Resume data load failed (run db:push & db:seed):", e?.message);
  }
  return (
    <html lang="en" suppressHydrationWarning={true} className="scroll-smooth">
      <body
        className={`${poppins.className} relative`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <ResumeProvider initialData={initialResumeData}>
              <LanguageWrapper>
                <main>
                  {children}
                  <CustomCursor />
                  <BackToTop />
                  <ModeSwitcher />
                  <ResumeOnlyLanguageSwitcher />
                </main>
              </LanguageWrapper>
            </ResumeProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
