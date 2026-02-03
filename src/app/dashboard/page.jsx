"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const sections = [
  { href: "/dashboard/ai-resume", title: "ساخت رزومه با هوش مصنوعی", desc: "چت کنید، رزومه را خودکار بسازیم", icon: "ai" },
  { href: "/dashboard/profile", title: "پروفایل", desc: "نام، عنوان، عکس و معرفی", icon: "profile" },
  { href: "/dashboard/experiences", title: "سابقه کاری", desc: "تجربیات شغلی", icon: "work" },
  { href: "/dashboard/educations", title: "تحصیلات", desc: "مدارک و مراکز آموزشی", icon: "edu" },
  { href: "/dashboard/skills", title: "مهارت‌ها", desc: "مهارت‌ها و درصد", icon: "skills" },
  { href: "/dashboard/services", title: "خدمات", desc: "خدمات قابل ارائه", icon: "services" },
  { href: "/dashboard/projects", title: "پروژه‌ها", desc: "نمونه کارها", icon: "projects" },
  { href: "/dashboard/blogs", title: "مقالات", desc: "مقالات و نوشته‌ها", icon: "blog" },
  { href: "/dashboard/testimonials", title: "نظرات", desc: "نظرات دیگران", icon: "testimonials" },
  { href: "/dashboard/contact", title: "اطلاعات تماس", desc: "تلفن، ایمیل، آدرس", icon: "contact" },
  { href: "/dashboard/domain", title: "دامنه شخصی", desc: "اتصال رزومه به دامنه خودتان", icon: "domain" },
];

const CardIcon = ({ name }) => {
  const cls = "w-7 h-7 sm:w-8 sm:h-8";
  const icons = {
    profile: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    work: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    edu: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
    skills: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    services: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    projects: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
    blog: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6m4-4h-1.5a1.5 1.5 0 00-1.5 1.5v3a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-3A1.5 1.5 0 0016.5 4H15" /></svg>,
    testimonials: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    contact: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    ai: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    domain: <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  };
  return icons[name] || icons.profile;
};

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/user/me")
      .then((r) => r.json())
      .then(setUser)
      .catch(() => {});
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-4xl">
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-theme/20 flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-bold text-theme">{user.name?.charAt(0) || "?"}</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              سلام، {user.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
              از اینجا بخش‌های رزومه را مدیریت کنید
            </p>
          </div>
        </div>
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">لینک رزومه شما</p>
          <a
            href={`/resume/${user.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-theme font-medium break-all hover:underline"
          >
            /resume/{user.slug}
          </a>
        </div>
      </div>
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group block p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-theme/50 dark:hover:border-theme/50 shadow-sm hover:shadow-xl hover:shadow-theme/10 transition-all duration-300"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-theme/10 flex items-center justify-center text-theme mb-4 group-hover:scale-105 transition-transform">
              <CardIcon name={section.icon} />
            </div>
            <h2 className="font-bold text-gray-800 dark:text-white mb-1 group-hover:text-theme transition-colors">
              {section.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {section.desc}
            </p>
            <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-theme">
              ویرایش
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
