import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

/**
 * GET /api/resolve-domain?domain=resume.example.com
 * برای middleware: با دامنه شخصی، slug کاربر را برمی‌گرداند تا به /resume/[slug] ریدایرکت شود.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain")?.toLowerCase().trim();
    if (!domain) {
      return NextResponse.json({ error: "domain required" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { customDomain: domain },
      select: { slug: true },
    });
    if (!user) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ slug: user.slug });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
