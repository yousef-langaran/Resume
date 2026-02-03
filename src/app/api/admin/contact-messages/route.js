import { NextResponse } from "next/server";
import { requireAuth } from "@/src/lib/api-auth";
import { getContacts } from "@/src/lib/contact";

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
  }
  try {
    const messages = getContacts();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
