import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireUser } from "@/src/lib/auth";

export async function PUT(request, { params }) {
  try {
    const userId = await requireUser();
    const data = await request.json();
    const existing = await prisma.testimonial.findFirst({ where: { id: params.id, userId } });
    if (!existing) return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    const item = await prisma.testimonial.update({
      where: { id: params.id },
      data: { ...data, userId },
    });
    return NextResponse.json(item);
  } catch (e) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = await requireUser();
    const existing = await prisma.testimonial.findFirst({ where: { id: params.id, userId } });
    if (!existing) return NextResponse.json({ error: "یافت نشد" }, { status: 404 });
    await prisma.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e.message === "UNAUTHORIZED") return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
