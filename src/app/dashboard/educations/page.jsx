"use client";

import { useEffect, useState } from "react";
import FormField from "@/src/components/admin/FormField";

export default function DashboardEducationsPage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ institution: "", duration: "", degree: "", description: "", order: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => {
    fetch("/api/user/educations")
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
      const url = editing ? `/api/user/educations/${editing.id}` : "/api/user/educations";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setEditing(null);
        setForm({ institution: "", duration: "", degree: "", description: "", order: 0 });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("حذف شود؟")) return;
    await fetch(`/api/user/educations/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (loading) return <div className="animate-pulse">در حال بارگذاری...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">تحصیلات</h1>
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl space-y-4">
        <h2 className="text-lg font-medium text-gray-800 dark:text-white">{editing ? "ویرایش" : "افزودن"}</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="مرکز آموزشی">
            <input
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
              required
            />
          </FormField>
          <FormField label="مدت">
            <input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="۱۴۰۰ - ۱۴۰۴"
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            />
          </FormField>
          <FormField label="مدرک">
            <input
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            />
          </FormField>
          <FormField label="توضیحات" className="col-span-2">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            />
          </FormField>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-theme hover:bg-themeHover text-white rounded-lg disabled:opacity-50">
            {editing ? "ویرایش" : "افزودن"}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setForm({ institution: "", duration: "", degree: "", description: "", order: 0 }); }} className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white">
              انصراف
            </button>
          )}
        </div>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div><strong className="text-gray-800 dark:text-white">{item.institution}</strong> — {item.degree}</div>
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
