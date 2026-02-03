import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { requireUser } from "@/src/lib/auth";

function parseDesignations(val) {
  if (typeof val === "string" && val.startsWith("[")) {
    try { return JSON.parse(val); } catch { return []; }
  }
  if (typeof val === "string") return val.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

export async function GET() {
  try {
    const userId = await requireUser();
    const profile = await prisma.profile.findFirst({
      where: { userId },
    });
    return NextResponse.json(profile || null);
  } catch (e) {
    if (e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
    }
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const userId = await requireUser();
  } catch (e) {
    return NextResponse.json({ error: "وارد شوید" }, { status: 401 });
  }
  try {
    const userId = await requireUser();
    const data = await request.json();
    const { id, ...rest } = data;
    const payload = {
      ...rest,
      userId,
      designations: typeof rest.designations === "string" ? rest.designations : JSON.stringify(parseDesignations(rest.designations) || []),
      designationsFa: typeof rest.designationsFa === "string" ? rest.designationsFa : JSON.stringify(parseDesignations(rest.designationsFa) || []),
    };
    let profile = await prisma.profile.findFirst({ where: { userId } });
    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: payload,
      });
    } else {
      profile = await prisma.profile.create({ data: payload });
    }
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
