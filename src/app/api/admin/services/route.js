import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/api-auth";

export async function GET() {
  const items = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const item = await prisma.service.create({ data });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
