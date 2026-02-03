import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireAuth } from "@/src/lib/api-auth";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst();
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  try {
    const data = await request.json();
    const { id, ...rest } = data;
    let profile;
    if (id) {
      profile = await prisma.profile.update({
        where: { id },
        data: rest,
      });
    } else {
      const existing = await prisma.profile.findFirst();
      if (existing) {
        profile = await prisma.profile.update({
          where: { id: existing.id },
          data: rest,
        });
      } else {
        profile = await prisma.profile.create({ data: rest });
      }
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
