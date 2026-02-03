import { NextResponse } from "next/server";
import { requireUser } from "@/src/lib/auth";

const AI_WEBHOOK_URL = process.env.AI_WEBHOOK_URL || "https://flow.promal.ir/webhook/ai";

function getAuthHeaders() {
  const user = process.env.AI_WEBHOOK_USERNAME;
  const pass = process.env.AI_WEBHOOK_PASSWORD;
  const headers = { "Content-Type": "application/json" };
  if (user && pass) {
    const encoded = Buffer.from(`${user}:${pass}`).toString("base64");
    headers.Authorization = `Basic ${encoded}`;
  }
  return headers;
}

/** استخراج متن پاسخ از خروجی وب‌هوک (پشتیبانی از body.text و ساختارهای رایج) */
function extractReplyText(data) {
  if (data == null) return "";
  if (typeof data === "string") return data;
  const obj = Array.isArray(data) ? data[0] : data;
  if (!obj || typeof obj !== "object") return "";
  return (
    obj.body?.text ??
    obj.text ??
    obj.reply ??
    obj.response ??
    obj.message ??
    obj.output ??
    (typeof obj.result === "string" ? obj.result : obj.result?.text) ??
    ""
  );
}

const SYSTEM_PROMPT = `تو یک دستیار دوستانه برای ساخت رزومه هستی. به کاربر کمک می‌کنی رزومه‌اش را کامل کند.
سوالات کوتاه و مرتبط بپرس: نام، عنوان شغلی، سابقه کاری، تحصیلات، مهارت‌ها، پروژه‌ها و در نهایت اطلاعات تماس.
جواب‌ها را خلاصه و مفید بده. وقتی اطلاعات کافی جمع شد، به کاربر بگو می‌تواند روی دکمه «پر کردن رزومه از چت» بزند تا کل رزومه از این مکالمه ساخته شود.`;

function buildPrompt(message, history = []) {
  const lines = [SYSTEM_PROMPT, "", "---", ""];
  for (const h of history) {
    lines.push(h.role === "user" ? `کاربر: ${h.content}` : `دستیار: ${h.content}`);
    lines.push("");
  }
  lines.push(`کاربر: ${message}`);
  lines.push("دستیار:");
  return lines.join("\n");
}

export async function POST(request) {
  try {
    await requireUser();
  } catch (e) {
    return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
  }

  try {
    const { message, history = [] } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "پیام الزامی است" }, { status: 400 });
    }

    const prompt = buildPrompt(message.trim(), history);
    const res = await fetch(AI_WEBHOOK_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text: prompt }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("AI webhook error", res.status, errText);
      return NextResponse.json(
        { error: "خطا در ارتباط با هوش مصنوعی. دوباره تلاش کنید." },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "";
    let reply = "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      reply = extractReplyText(data);
      if (!reply && typeof data === "object") reply = JSON.stringify(data);
    } else {
      reply = await res.text();
    }
    reply = (reply || "").trim();

    // اگر سرویس فقط «Workflow was started» برگرداند یعنی workflow به‌صورت ناهمگام است و جواب واقعی مدل در پاسخ نیست.
    if (reply === "Workflow was started" || reply.includes("Workflow was started")) {
      reply =
        "الان سرویس فقط تأیید شروع workflow را فرستاده، نه جواب مدل. در flow.promal.ir باید خروجی نود OpenRouter را به‌عنوان «پاسخ وب‌هوک» برگردانی: یک نود «Respond to Webhook» یا «پاسخ به وب‌هوک» اضافه کن و در بدنهٔ پاسخ مقدار {\"reply\": \"خروجی_مدل\"} بگذار تا جواب واقعی اینجا نمایش داده شود.";
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI chat error", err);
    return NextResponse.json(
      { error: err.message || "خطا در ارسال پیام" },
      { status: 500 }
    );
  }
}
