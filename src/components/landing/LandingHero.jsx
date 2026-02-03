import Link from "next/link";

export default function LandingHero() {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16 px-4"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-theme/5 via-transparent to-theme/10 dark:from-theme/10 dark:to-theme/5" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-theme/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-theme/10 rounded-full blur-3xl" />
      <div className="relative max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-theme/15 text-theme dark:bg-theme/20 dark:text-theme mb-6">
          رزومه آنلاین حرفه‌ای در چند دقیقه
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
          رزومه خود را
          <span className="text-theme block sm:inline"> ساده و حرفه‌ای </span>
          بسازید
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          بدون نیاز به طراحی، با لینک اختصاصی و قالب آماده. پروفایل، سابقه کاری، مهارت‌ها و پروژه‌ها را آنلاین مدیریت کنید.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-theme hover:bg-themeHover text-white font-bold text-lg shadow-xl shadow-theme/30 transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            همین حالا شروع کنید
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-theme hover:text-theme transition"
          >
            نحوه کار
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
