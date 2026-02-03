import { NextResponse } from "next/server";
import { getResumeData } from "@/src/lib/getResumeData";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug") || null;
    const data = await getResumeData(slug);
    return NextResponse.json(data || {});
  } catch (error) {
    console.error("Resume API error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت اطلاعات" },
      { status: 500 }
    );
  }
}
