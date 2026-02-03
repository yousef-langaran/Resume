"use client";

import { useEffect, useState } from "react";
import FormField from "@/src/components/admin/FormField";
import ImageUploadField from "@/src/components/admin/ImageUploadField";

export default function DashboardSkillsPage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", value: 80, image: "", order: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => {
    fetch("/api/user/skills")
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
      const url = editing ? `/api/user/skills/${editing.id}` : "/api/user/skills";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setEditing(null);
        setForm({ name: "", value: 80, image: "", order: 0 });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("حذف شود؟")) return;
    await fetch(`/api/user/skills/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (loading) return <div className="animate-pulse">در حال بارگذاری...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">مهارت‌ها</h1>
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="نام مهارت">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
              required
            />
          </FormField>
          <FormField label="درصد (0-100)">
            <input
              type="number"
              min="0"
              max="100"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white"
            />
          </FormField>
          <div className="col-span-2">
            <ImageUploadField
              label="تصویر مهارت (اختیاری)"
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
              uploadUrl="/api/user/upload"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-theme hover:bg-themeHover text-white rounded-lg disabled:opacity-50">
            {editing ? "ویرایش" : "افزودن"}
          </button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: "", value: 80, image: "", order: 0 }); }} className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white">انصراف</button>}
        </div>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div><strong className="text-gray-800 dark:text-white">{item.name}</strong> — {item.value}%</div>
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
