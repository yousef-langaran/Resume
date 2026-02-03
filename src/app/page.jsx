import LandingHeader from "@/src/components/landing/LandingHeader";
import LandingHero from "@/src/components/landing/LandingHero";
import LandingFeatures from "@/src/components/landing/LandingFeatures";
import LandingHowItWorks from "@/src/components/landing/LandingHowItWorks";
import LandingCTA from "@/src/components/landing/LandingCTA";
import LandingFooter from "@/src/components/landing/LandingFooter";

export const metadata = {
  title: "رزومه‌ساز | ساخت رزومه آنلاین حرفه‌ای",
  description: "رزومه خود را آنلاین بسازید. لینک اختصاصی، ویرایش آسان، قالب حرفه‌ای. ثبت‌نام رایگان.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-power__black font-vazir" dir="rtl">
      <LandingHeader />
      <LandingHero />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
