import Link from "next/link";

export default function LandingCTA() {
  return (
    <section className="py-20 sm:py-28 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-theme to-themeHover p-10 sm:p-14 text-center shadow-2xl shadow-theme/30">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              آماده ساخت رزومه هستید؟
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              همین الان ثبت‌نام کنید و لینک اختصاصی رزومه خود را دریافت کنید.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-theme font-bold text-lg shadow-xl hover:bg-gray-100 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              ثبت‌نام رایگان
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
