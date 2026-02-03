import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireUser } from "@/src/lib/auth";

function slugify(s) {
  return (s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\u0600-\u06FF\-]+/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "") || "blog";
}

export async function GET() {
  try {
    const userId = await requireUser();
    const items = await prisma.blog.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(items);
  } catch (e) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await requireUser();
    const data = await request.json();
    let slug = data.slug || slugify(data.title) || "blog";
    let suffix = 0;
    while (true) {
      const taken = await prisma.blog.findUnique({ where: { slug: suffix ? `${slug}-${suffix}` : slug } });
      if (!taken) break;
      suffix++;
    }
    slug = suffix ? `${slug}-${suffix}` : slug;
    const item = await prisma.blog.create({
      data: { ...data, userId, slug },
    });
    return NextResponse.json(item);
  } catch (e) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
