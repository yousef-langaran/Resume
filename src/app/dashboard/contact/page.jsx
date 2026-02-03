"use client";

import { useEffect, useState } from "react";
import FormField from "@/src/components/admin/FormField";

export default function DashboardContactPage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ field: "", data: "", order: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchItems = () => {
    fetch("/api/user/contact-info")
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
      const url = editing ? `/api/user/contact-info/${editing.id}` : "/api/user/contact-info";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setEditing(null);
        setForm({ field: "", data: "", order: 0 });
        fetchItems();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("حذف شود؟")) return;
    await fetch(`/api/user/contact-info/${id}`, { method: "DELETE" });
    fetchItems();
  };

  if (loading) return <div className="animate-pulse">در حال بارگذاری...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">اطلاعات تماس</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">این موارد در بخش تماس رزومه شما نمایش داده می‌شوند (مثل تلفن، ایمیل، آدرس).</p>
      <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="نوع (مثال: Location, E-mail, Phone)">
            <input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" required />
          </FormField>
          <FormField label="مقدار">
            <input value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:text-white" required />
          </FormField>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-theme hover:bg-themeHover text-white rounded-lg disabled:opacity-50">{editing ? "ویرایش" : "افزودن"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setForm({ field: "", data: "", order: 0 }); }} className="px-4 py-2 border rounded-lg dark:border-gray-600 dark:text-white">انصراف</button>}
        </div>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl">
            <div><strong className="text-gray-800 dark:text-white">{item.field}</strong>: {item.data}</div>
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
