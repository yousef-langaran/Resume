"use client";

import Link from "next/link";

const cards = [
  {
    href: "/admin/dashboard/users",
    label: "مدیریت کاربران",
    description: "مشاهده، ویرایش و حذف کاربران و رزومه‌ها",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-500/10 dark:bg-amber-500/10",
  },
  {
    href: "/admin/dashboard/messages",
    label: "پیام‌های تماس",
    description: "پیام‌های ارسالی از فرم تماس",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-500/10 dark:bg-emerald-500/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          پنل ادمین
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          به پنل مدیریت خوش آمدید. از کارت‌های زیر به بخش‌های مختلف دسترسی دارید.
        </p>
      </div>
      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group block p-6 sm:p-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-2xl ${card.bgLight} flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform`}>
              {card.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
              {card.label}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {card.description}
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-amber-600 dark:text-amber-500">
              ورود به بخش
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
