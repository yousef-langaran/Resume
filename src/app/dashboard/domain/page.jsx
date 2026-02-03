"use client";

import { useEffect, useState } from "react";

export default function DomainPage() {
  const [customDomain, setCustomDomain] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [userSlug, setUserSlug] = useState("");

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then((data) => {
        setCustomDomain(data.customDomain || "");
        setUserSlug(data.slug || "");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      const res = await fetch("/api/user/custom-domain", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customDomain: customDomain.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCustomDomain(data.customDomain || "");
        setMessage(data.customDomain ? "دامنه ذخیره شد." : "دامنه شخصی حذف شد.");
      } else {
        setMessage(data.error || "خطا");
      }
    } catch {
      setMessage("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse text-gray-500">در حال بارگذاری...</div>;

  return (
    <div className="max-w-2xl" dir="rtl">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        دامنه شخصی
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
        با وصل کردن یک دامنه (مثلاً resume.example.com) فقط رزومه شما روی آن آدرس نمایش داده می‌شود.
      </p>

      <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">لینک فعلی رزومه (روی همین سایت)</p>
        <a
          href={`/resume/${userSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-theme font-medium break-all hover:underline"
        >
          /resume/{userSlug}
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            دامنه شخصی (مثال: resume.example.com)
          </label>
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            placeholder="resume.example.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-theme/50 focus:border-theme outline-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            خالی بگذارید تا فقط از لینک اصلی استفاده شود.
          </p>
        </div>
        {message && (
          <p className={message.includes("خطا") ? "text-red-500" : "text-green-600 dark:text-green-400"}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-theme hover:bg-themeHover text-white font-medium disabled:opacity-50"
        >
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </form>

      {customDomain && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-200">
          <p className="font-medium mb-2">تنظیم DNS برای دامنه شخصی</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>در پنل دامنه (جایی که دامنه را خریده‌اید) یک رکورد <strong>CNAME</strong> اضافه کنید.</li>
            <li>نام/زیردامنه: <strong>{customDomain.split(".")[0]}</strong> (یا کل دامنه اگر ساب‌دامین نیست).</li>
            <li>مقدار/هدف: آدرس سرور این اپلیکیشن (مثلاً همان دامنه اصلی سایت رزومه‌ساز).</li>
            <li>بعد از انتشار DNS (چند دقیقه تا ۴۸ ساعت)، با باز کردن <strong>https://{customDomain}</strong> رزومه شما نمایش داده می‌شود.</li>
          </ol>
          <p className="mt-3 text-amber-700 dark:text-amber-300">
            روی هاستی که این پروژه را deploy کرده‌اید (مثلاً Vercel یا سرور خودتان) باید دامنه <strong>{customDomain}</strong> را هم به پروژه اضافه کنید تا درخواست‌ها به این سرور برسد.
          </p>
        </div>
      )}
    </div>
  );
}
