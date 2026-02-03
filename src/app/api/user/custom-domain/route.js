import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireUser } from "@/src/lib/auth";

function isValidDomain(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.toLowerCase().trim();
  if (trimmed.length > 253) return false;
  const parts = trimmed.split(".");
  if (parts.length < 2) return false;
  const validLabel = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
  for (const part of parts) {
    if (part.length < 1 || part.length > 63) return false;
    if (!validLabel.test(part)) return false;
  }
  return true;
}

export async function GET() {
  try {
    const userId = await requireUser();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { customDomain: true },
    });
    return NextResponse.json({ customDomain: user?.customDomain ?? "" });
  } catch (e) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  let userId;
  try {
    userId = await requireUser();
  } catch (e) {
    return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
  }
  try {
    const body = await request.json();
    let customDomain = body.customDomain;
    if (customDomain !== undefined && customDomain !== null) {
      customDomain = String(customDomain).toLowerCase().trim();
      if (customDomain === "") {
        customDomain = null;
      } else if (!isValidDomain(customDomain)) {
        return NextResponse.json(
          { error: "فرمت دامنه معتبر نیست (مثال: resume.example.com)" },
          { status: 400 }
        );
      }
    } else {
      customDomain = null;
    }

    if (customDomain) {
      const existing = await prisma.user.findFirst({
        where: { customDomain },
      });
      if (existing && existing.id !== userId) {
        return NextResponse.json(
          { error: "این دامنه قبلاً توسط کاربر دیگری ثبت شده است." },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { customDomain },
      select: { customDomain: true, slug: true },
    });
    return NextResponse.json(user);
  } catch (e) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
