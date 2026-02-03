"use client";

import { useRef, useState } from "react";
import FormField from "./FormField";

export default function ImageUploadField({ label, value, onChange, accept = "image/*", hint, uploadUrl = "/api/admin/upload" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در آپلود");
        return;
      }
      if (data.url) onChange(data.url);
    } catch {
      setError("خطا در آپلود");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <FormField label={label} error={error}>
      <div className="flex flex-wrap items-start gap-4">
        {value && (
          <div className="shrink-0">
            <img
              src={value}
              alt="پیش‌نمایش"
              className="h-20 w-20 rounded-lg object-cover border border-gray-300 dark:border-gray-600"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-white file:cursor-pointer disabled:opacity-50"
          />
          {value && (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/uploads/..."
              className="mt-2 w-full px-4 py-2 rounded-lg border dark:bg-gray-800 dark:border-gray-600 text-sm"
              dir="ltr"
            />
          )}
          {uploading && <p className="text-sm text-amber-600 mt-1">در حال آپلود...</p>}
          {hint && <p className="text-sm text-gray-500 mt-1">{hint}</p>}
        </div>
      </div>
    </FormField>
  );
}
