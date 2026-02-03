import { NextResponse } from "next/server";
import { requireUser } from "@/src/lib/auth";
import { prisma } from "@/src/lib/db";

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

/** استخراج متن پاسخ از خروجی وب‌هوک (هماهنگ با chat route) */
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

const RESUME_JSON_SCHEMA = `
خروجی را فقط و فقط به صورت یک آبجکت JSON معتبر بده. هیچ متن دیگری قبل یا بعد از JSON ننویس.
ساختار دقیق (همه فیلدها رشته هستند مگر value و order که عدد هستند):

{
  "profile": {
    "fullName": "نام کامل",
    "jobTitle": "عنوان شغلی",
    "introHeading1": "عنوان اول معرفی",
    "introHeading2": "عنوان دوم",
    "introDescription": "پاراگراف معرفی",
    "designations": "سمت۱، سمت۲",
    "residence": "کشور",
    "city": "شهر",
    "age": "سن",
    "phone": "تلفن",
    "email": "ایمیل",
    "location": "آدرس"
  },
  "experiences": [
    { "platform": "نام شرکت", "duration": "۱۴۰۰-۱۴۰۲", "position": "سمت", "description": "توضیح", "order": 0 }
  ],
  "educations": [
    { "institution": "نام دانشگاه", "duration": "۱۴۰۰-۱۴۰۴", "degree": "مدرک", "description": "توضیح", "order": 0 }
  ],
  "skills": [
    { "name": "نام مهارت", "value": 85, "order": 0 }
  ],
  "services": [
    { "number": "01", "title": "عنوان خدمت", "description": "توضیح", "order": 0 }
  ],
  "projects": [
    { "title": "عنوان پروژه", "slug": "project-slug", "type": "نوع", "client": "کارفرما", "duration": "مدت", "description": "توضیح", "order": 0 }
  ],
  "testimonials": [
    { "name": "نام", "position": "سمت", "text": "متن نظر", "order": 0 }
  ],
  "contactInfos": [
    { "field": "Phone", "data": "شماره", "order": 0 },
    { "field": "E-mail", "data": "ایمیل", "order": 1 },
    { "field": "Location", "data": "آدرس", "order": 2 }
  ]
}

فقط بخش‌هایی که از مکالمه استخراج می‌کنی را پر کن. برای هر آرایه اگر چیزی نداری آرایه خالی [] بگذار.
`;

function extractJson(text) {
  const trimmed = (text || "").trim();
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = codeBlock ? codeBlock[1].trim() : trimmed;
  try {
    return JSON.parse(raw);
  } catch {
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
      } catch {
        //
      }
    }
    return null;
  }
}

function parseDesignations(val) {
  if (typeof val === "string" && val.startsWith("[")) {
    try {
      return JSON.parse(val);
    } catch {
      //
    }
  }
  if (typeof val === "string") return val.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
  return Array.isArray(val) ? val : [];
}

export async function POST(request) {
  let userId;
  try {
    userId = await requireUser();
  } catch (e) {
    return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
  }

  try {
    const { conversation = [] } = await request.json();
    const conversationText =
      typeof conversation === "string"
        ? conversation
        : Array.isArray(conversation)
          ? conversation
              .map((m) => `${m.role === "user" ? "کاربر" : "دستیار"}: ${m.content}`)
              .join("\n")
          : "";

    const prompt = `${RESUME_JSON_SCHEMA}

مکالمه کاربر با دستیار:
${conversationText}

بر اساس مکالمه بالا، یک آبجکت JSON با ساختار دقیق بالا بساز و فقط همان JSON را برگردان (بدون توضیح و بدون markdown).`;

    const res = await fetch(AI_WEBHOOK_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ text: prompt }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("AI build-resume webhook error", res.status, errText);
      return NextResponse.json(
        { error: "خطا در ارتباط با هوش مصنوعی." },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "";
    let rawText = "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      rawText = extractReplyText(data);
      if (!rawText && typeof data === "object") rawText = JSON.stringify(data);
    } else {
      rawText = await res.text();
    }
    rawText = (rawText || "").trim();

    if (rawText === "Workflow was started" || rawText.includes("Workflow was started")) {
      return NextResponse.json(
        {
          error:
            "سرویس فقط «Workflow was started» برگردانده. در flow.promal.ir خروجی نود OpenRouter را به‌عنوان پاسخ وب‌هوک برگردان (نود Respond to Webhook با body مثل {\"reply\": \"...\"}).",
        },
        { status: 502 }
      );
    }

    const data = extractJson(rawText);
    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "خروجی هوش مصنوعی قابل تفسیر نبود. لطفاً بیشتر در چت توضیح بدهید و دوباره امتحان کنید." },
        { status: 400 }
      );
    }

    const errors = [];

    if (data.profile && typeof data.profile === "object") {
      try {
        const p = data.profile;
        const payload = {
          fullName: p.fullName || "نام",
          jobTitle: p.jobTitle || "",
          introHeading1: p.introHeading1 || p.fullName || "",
          introHeading2: p.introHeading2 || p.jobTitle || "",
          introDescription: p.introDescription || "",
          designations: JSON.stringify(parseDesignations(p.designations)),
          residence: p.residence || "",
          city: p.city || "",
          age: p.age || "",
          phone: p.phone || "",
          email: p.email || "",
          location: p.location || "",
          userId,
        };
        let profile = await prisma.profile.findFirst({ where: { userId } });
        if (profile) {
          await prisma.profile.update({ where: { id: profile.id }, data: payload });
        } else {
          await prisma.profile.create({ data: payload });
        }
      } catch (e) {
        errors.push("پروفایل: " + e.message);
      }
    }

    if (Array.isArray(data.experiences)) {
      for (let i = 0; i < data.experiences.length; i++) {
        try {
          const e = data.experiences[i];
          await prisma.experience.create({
            data: {
              userId,
              platform: e.platform || "",
              duration: e.duration || "",
              position: e.position || "",
              description: e.description || "",
              order: typeof e.order === "number" ? e.order : i,
            },
          });
        } catch (e) {
          errors.push("سابقه " + (i + 1) + ": " + e.message);
        }
      }
    }

    if (Array.isArray(data.educations)) {
      for (let i = 0; i < data.educations.length; i++) {
        try {
          const e = data.educations[i];
          await prisma.education.create({
            data: {
              userId,
              institution: e.institution || "",
              duration: e.duration || "",
              degree: e.degree || "",
              description: e.description || "",
              order: typeof e.order === "number" ? e.order : i,
            },
          });
        } catch (err) {
          errors.push("تحصیلات " + (i + 1) + ": " + err.message);
        }
      }
    }

    if (Array.isArray(data.skills)) {
      for (let i = 0; i < data.skills.length; i++) {
        try {
          const s = data.skills[i];
          await prisma.skill.create({
            data: {
              userId,
              name: s.name || "",
              value: typeof s.value === "number" ? Math.min(100, Math.max(0, s.value)) : 80,
              order: typeof s.order === "number" ? s.order : i,
            },
          });
        } catch (err) {
          errors.push("مهارت " + (i + 1) + ": " + err.message);
        }
      }
    }

    if (Array.isArray(data.services)) {
      for (let i = 0; i < data.services.length; i++) {
        try {
          const s = data.services[i];
          await prisma.service.create({
            data: {
              userId,
              number: String(s.number || String(i + 1).padStart(2, "0")),
              title: s.title || "",
              description: s.description || "",
              order: typeof s.order === "number" ? s.order : i,
            },
          });
        } catch (err) {
          errors.push("خدمات " + (i + 1) + ": " + err.message);
        }
      }
    }

    if (Array.isArray(data.projects)) {
      for (let i = 0; i < data.projects.length; i++) {
        try {
          const p = data.projects[i];
          const slug = (p.slug || (p.title || "").toLowerCase().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF-]/g, "") || "project-" + i);
          const existing = await prisma.project.findFirst({ where: { slug, userId } });
          const finalSlug = existing ? slug + "-" + Date.now() : slug;
          await prisma.project.create({
            data: {
              userId,
              title: p.title || "پروژه",
              slug: finalSlug,
              type: p.type || "پروژه",
              client: p.client || "",
              duration: p.duration || "",
              description: p.description || "",
              order: typeof p.order === "number" ? p.order : i,
            },
          });
        } catch (err) {
          errors.push("پروژه " + (i + 1) + ": " + err.message);
        }
      }
    }

    if (Array.isArray(data.testimonials)) {
      for (let i = 0; i < data.testimonials.length; i++) {
        try {
          const t = data.testimonials[i];
          await prisma.testimonial.create({
            data: {
              userId,
              name: t.name || "",
              position: t.position || "",
              text: t.text || "",
              order: typeof t.order === "number" ? t.order : i,
            },
          });
        } catch (err) {
          errors.push("نظر " + (i + 1) + ": " + err.message);
        }
      }
    }

    if (Array.isArray(data.contactInfos)) {
      for (let i = 0; i < data.contactInfos.length; i++) {
        try {
          const c = data.contactInfos[i];
          await prisma.contactInfo.create({
            data: {
              userId,
              field: c.field || "Info",
              data: c.data || "",
              order: typeof c.order === "number" ? c.order : i,
            },
          });
        } catch (err) {
          errors.push("تماس " + (i + 1) + ": " + err.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: errors.length > 0 ? "رزومه ذخیره شد با چند خطا: " + errors.join("؛ ") : "رزومه با موفقیت از چت ساخته و ذخیره شد.",
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Build resume error", err);
    return NextResponse.json(
      { error: err.message || "خطا در ساخت رزومه" },
      { status: 500 }
    );
  }
}
