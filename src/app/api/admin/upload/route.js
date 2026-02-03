import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAuth } from "@/src/lib/api-auth";

const UPLOAD_DIR = "public/uploads";
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

function getExt(mime) {
  const map = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
  };
  return map[mime] || ".jpg";
}

export async function POST(request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "فایلی ارسال نشده است" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mime = file.type || "";
    if (!ALLOWED_TYPES.includes(mime)) {
      return NextResponse.json(
        { error: "نوع فایل مجاز نیست. فقط تصویر (jpg, png, gif, webp, svg)" },
        { status: 400 }
      );
    }

    const ext = getExt(mime);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    const dir = path.join(process.cwd(), UPLOAD_DIR);
    await mkdir(dir, { recursive: true });
    const filePath = path.join(dir, name);
    await writeFile(filePath, buffer);

    const url = `/uploads/${name}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "خطا در آپلود" },
      { status: 500 }
    );
  }
}
