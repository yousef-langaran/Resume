"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "سلام! برای ساخت رزومه با هم همراه می‌شویم. بگو نام و عنوان شغلی‌ات چیست؟ بعد سراغ سابقه کاری، تحصیلات، مهارت‌ها و در نهایت اطلاعات تماس می‌رویم. وقتی حس کردی اطلاعات کافی دادی، روی دکمه «پر کردن رزومه از چت» بزن تا کل رزومه از این مکالمه ساخته و ذخیره شود.",
};

export default function AiResumePage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [building, setBuilding] = useState(false);
  const [buildResult, setBuildResult] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setBuildResult(null);
    try {
      const history = [...messages, userMsg].slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      if (data.error) {
        setMessages((prev) => [...prev, { role: "assistant", content: "خطا: " + data.error }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "پاسخی دریافت نشد." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "خطا در ارسال. دوباره تلاش کنید." }]);
    } finally {
      setLoading(false);
    }
  };

  const buildResume = async () => {
    if (messages.length < 2 || building) return;
    setBuilding(true);
    setBuildResult(null);
    try {
      const conversation = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/ai/build-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });
      const data = await res.json();
      if (data.success) {
        setBuildResult({ ok: true, message: data.message, errors: data.errors });
      } else {
        setBuildResult({ ok: false, message: data.error || "خطا در ساخت رزومه" });
      }
    } catch (err) {
      setBuildResult({ ok: false, message: err.message || "خطا در ارتباط با سرور" });
    } finally {
      setBuilding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto" dir="rtl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          ساخت رزومه با هوش مصنوعی
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
          در چت زیر درباره خودت بگو؛ بعد با یک کلیک کل رزومه را از همین مکالمه می‌سازیم و در پنلت ذخیره می‌کنیم.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
        <div
          ref={listRef}
          className="h-[380px] sm:h-[420px] overflow-y-auto p-4 space-y-4"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-theme text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                }`}
              >
                <p className="text-sm sm:text-base whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-end">
              <div className="rounded-2xl px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500">
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">در حال فکر کردن</span>
                  <span className="animate-bounce">...</span>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-theme/50 focus:border-theme outline-none"
            disabled={loading}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-xl bg-theme hover:bg-themeHover text-white font-medium disabled:opacity-50 transition"
          >
            ارسال
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={buildResume}
          disabled={building || messages.length < 2}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/25 disabled:opacity-50 transition"
        >
          {building ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              در حال ساخت رزومه...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              پر کردن رزومه از چت
            </>
          )}
        </button>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          بعد از گفتگو، این دکمه کل رزومه را از مکالمه استخراج و در پروفایل، سابقه کاری، مهارت‌ها و بقیه بخش‌ها ذخیره می‌کند.
        </p>
      </div>

      {buildResult && (
        <div
          className={`mt-6 p-4 rounded-2xl ${
            buildResult.ok
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
          }`}
        >
          <p className="font-medium">{buildResult.message}</p>
          {buildResult.errors && buildResult.errors.length > 0 && (
            <ul className="mt-2 text-sm list-disc list-inside opacity-90">
              {buildResult.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
          {buildResult.ok && (
            <Link
              href="/dashboard"
              className="inline-block mt-3 text-sm font-medium underline"
            >
              رفتن به داشبورد و مشاهده بخش‌ها
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
