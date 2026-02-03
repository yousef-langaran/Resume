import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireUser } from "@/src/lib/auth";

export async function GET() {
  try {
    const userId = await requireUser();
    const items = await prisma.education.findMany({
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
    const item = await prisma.education.create({ data: { ...data, userId } });
    return NextResponse.json(item);
  } catch (e) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
