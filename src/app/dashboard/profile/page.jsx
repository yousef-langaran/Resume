"use client";

import { useEffect, useState } from "react";
import FormField from "@/src/components/admin/FormField";
import ImageUploadField from "@/src/components/admin/ImageUploadField";

export default function DashboardProfilePage() {
  const [data, setData] = useState({
    fullName: "",
    jobTitle: "",
    introHeading1: "",
    introHeading2: "",
    introDescription: "",
    designations: "",
    residence: "",
    city: "",
    age: "",
    phone: "",
    email: "",
    location: "",
    userImage: "",
    userImageLight: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const parseDesignations = (val) => {
    if (Array.isArray(val)) return val.join("، ");
    if (typeof val === "string" && val.startsWith("[")) {
      try { return JSON.parse(val).join("، "); } catch { return val; }
    }
    return val || "";
  };

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((p) => {
        if (p?.id) {
          setData({
            ...data,
            ...p,
            designations: parseDesignations(p.designations),
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          designations: JSON.stringify(
            (data.designations || "").split(/[،,]/).map((s) => s.trim()).filter(Boolean)
          ),
        }),
      });
      if (res.ok) setMessage("ذخیره شد ✓");
      else {
        const err = await res.json();
        setMessage(err.error || "خطا");
      }
    } catch {
      setMessage("خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse">در حال بارگذاری...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">پروفایل</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <FormField label="نام کامل">
          <input
            value={data.fullName}
            onChange={(e) => setData({ ...data, fullName: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            required
          />
        </FormField>
        <FormField label="عنوان شغلی">
          <input
            value={data.jobTitle}
            onChange={(e) => setData({ ...data, jobTitle: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="عنوان اول (صفحه اصلی)">
          <input
            value={data.introHeading1}
            onChange={(e) => setData({ ...data, introHeading1: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="عنوان دوم">
          <input
            value={data.introHeading2}
            onChange={(e) => setData({ ...data, introHeading2: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="توضیحات معرفی">
          <textarea
            value={data.introDescription}
            onChange={(e) => setData({ ...data, introDescription: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="سمت‌ها (با کاما جدا کنید)">
          <input
            value={data.designations}
            onChange={(e) => setData({ ...data, designations: e.target.value })}
            placeholder="توسعه‌دهنده وب، برنامه‌نویس"
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <ImageUploadField
          label="عکس پروفایل (حالت تیره)"
          value={data.userImage ?? ""}
          onChange={(url) => setData({ ...data, userImage: url })}
          uploadUrl="/api/user/upload"
        />
        <ImageUploadField
          label="عکس پروفایل (حالت روشن)"
          value={data.userImageLight ?? ""}
          onChange={(url) => setData({ ...data, userImageLight: url })}
          uploadUrl="/api/user/upload"
        />
        <FormField label="کشور">
          <input
            value={data.residence}
            onChange={(e) => setData({ ...data, residence: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="شهر">
          <input
            value={data.city}
            onChange={(e) => setData({ ...data, city: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="سن">
          <input
            value={data.age}
            onChange={(e) => setData({ ...data, age: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="تلفن">
          <input
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="ایمیل">
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        <FormField label="آدرس">
          <input
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
        </FormField>
        {message && (
          <p className={message.includes("✓") ? "text-green-600" : "text-red-500"}>{message}</p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-theme hover:bg-themeHover text-white rounded-lg disabled:opacity-50"
        >
          {saving ? "در حال ذخیره..." : "ذخیره"}
        </button>
      </form>
    </div>
  );
}
