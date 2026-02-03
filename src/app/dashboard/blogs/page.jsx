"use client";

import { useEffect, useState } from "react";
import FormField from "@/src/components/admin/FormField";
import ImageUploadField from "@/src/components/admin/ImageUploadField";

const slugify = (s) => (s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF\-]+/g, "").replace(/-+/g, "-") || "";

export default function DashboardBlogsPage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", slug: "", category: "", date: "", thumbnail: "", image: "", postedBy: "", description: "", order: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => {
    fetch("/api/user/blogs")
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editing ? `/api/user/blogs/${editing.id}` : "/api/user/blogs";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title) }),
      });
      if (res.ok) {
        setEditing(null);
        setForm({ title: "", slug: "", category: "", date: "", thumbnail: "", image: "", postedBy: "", description: "", order: 0 });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("حذف شود؟")) return;
    await fetch(`/api/user/blogs/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (loading) return <div className="animate-pulse">در حال بارگذاری...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">مقالات</h1>
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="عنوان">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" required />
          </FormField>
          <FormField label="اسلاگ">
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="خودکار" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" />
          </FormField>
          <FormField label="دسته‌بندی">
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" />
          </FormField>
          <FormField label="تاریخ">
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="03 May 2023" className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" />
          </FormField>
          <FormField label="نویسنده">
            <input value={form.postedBy} onChange={(e) => setForm({ ...form, postedBy: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" />
          </FormField>
          <div className="col-span-2">
            <ImageUploadField label="تصویر مقاله" value={form.image} onChange={(url) => setForm({ ...form, image: url, thumbnail: form.thumbnail || url })} uploadUrl="/api/user/upload" />
          </div>
          <div className="col-span-2">
            <ImageUploadField label="تصویر کوچک" value={form.thumbnail} onChange={(url) => setForm({ ...form, thumbnail: url })} uploadUrl="/api/user/upload" />
          </div>
          <FormField label="توضیحات" className="col-span-2">
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" />
          </FormField>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-theme hover:bg-themeHover text-white rounded-lg disabled:opacity-50">{editing ? "ویرایش" : "افزودن"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ title: "", slug: "", category: "", date: "", thumbnail: "", image: "", postedBy: "", description: "", order: 0 }); }} className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white">انصراف</button>}
        </div>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div><strong className="text-gray-800 dark:text-white">{item.title}</strong> — {item.slug}</div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(item); setForm(item); }} className="px-3 py-1 text-theme rounded">ویرایش</button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1 text-red-500 rounded">حذف</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
