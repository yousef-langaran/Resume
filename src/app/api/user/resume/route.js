import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { getResumeData } from "@/src/lib/getResumeData";
import { getCurrentUserId } from "@/src/lib/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { slug: true },
    });
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }
    const data = await getResumeData(user.slug);
    return NextResponse.json(data || {});
  } catch (error) {
    console.error("User resume API error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات" },
      { status: 500 }
    );
  }
}
