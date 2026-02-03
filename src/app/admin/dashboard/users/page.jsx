"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = () => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (user) => {
    if (!confirm(`کاربر «${user.name}» و تمام رزومه و داده‌هایش حذف شود؟`)) return;
    setDeletingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (res.ok) fetchUsers();
      else alert("خطا در حذف کاربر.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <svg className="animate-spin w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          مدیریت کاربران
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          لیست کاربران ثبت‌نام‌شده و لینک رزومه هر کاربر
        </p>
      </div>
      {users.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">هنوز کاربری ثبت‌نام نکرده است.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                    <th className="text-right p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">نام</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">ایمیل</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">اسلاگ رزومه</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">تاریخ ثبت‌نام</th>
                    <th className="text-right p-4 text-sm font-semibold text-gray-700 dark:text-gray-300">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                      <td className="p-4 font-medium text-gray-800 dark:text-white">{user.name}</td>
                      <td className="p-4">
                        <a href={`mailto:${user.email}`} className="text-amber-600 dark:text-amber-500 hover:underline">
                          {user.email}
                        </a>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/resume/${encodeURIComponent(user.slug)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-600 dark:text-amber-500 hover:underline"
                        >
                          {user.slug}
                        </Link>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400 text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("fa-IR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : ""}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end flex-wrap">
                          <Link
                            href={`/resume/${encodeURIComponent(user.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition"
                          >
                            مشاهده رزومه
                          </Link>
                          <button
                            onClick={() => handleDelete(user)}
                            disabled={deletingId === user.id}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl disabled:opacity-50 transition"
                          >
                            {deletingId === user.id ? "در حال حذف..." : "حذف"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="font-medium text-gray-800 dark:text-white mb-1">{user.name}</div>
                <a href={`mailto:${user.email}`} className="text-sm text-amber-600 dark:text-amber-500 hover:underline block mb-2">
                  {user.email}
                </a>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  اسلاگ:{" "}
                  <Link
                    href={`/resume/${encodeURIComponent(user.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 dark:text-amber-500"
                  >
                    {user.slug}
                  </Link>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/resume/${encodeURIComponent(user.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-xl"
                  >
                    مشاهده رزومه
                  </Link>
                  <button
                    onClick={() => handleDelete(user)}
                    disabled={deletingId === user.id}
                    className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl disabled:opacity-50"
                  >
                    {deletingId === user.id ? "..." : "حذف"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
