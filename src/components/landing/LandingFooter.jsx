import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer id="contact" className="py-12 px-4 bg-gray-900 dark:bg-black text-gray-400" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-theme flex items-center justify-center text-white">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <span className="font-bold text-white">رزومه‌ساز</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/" className="hover:text-theme transition">صفحه اصلی</Link>
            <a href="#features" className="hover:text-theme transition">ویژگی‌ها</a>
            <a href="#how-it-works" className="hover:text-theme transition">نحوه کار</a>
            <Link href="/register" className="hover:text-theme transition">ثبت‌نام</Link>
            <Link href="/login" className="hover:text-theme transition">ورود</Link>
          </nav>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>
            رزومه خود را آنلاین بسازید و با یک لینک به اشتراک بگذارید.
          </p>
          <p className="mt-2 text-gray-500">
            © {new Date().getFullYear()} رزومه‌ساز. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
