import { NextResponse } from "next/server";
import { clearUserSession } from "@/src/lib/auth";

export async function POST() {
  await clearUserSession();
  return NextResponse.json({ success: true });
}
