import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { hashPassword, setSession, createSessionToken } from "@/src/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const hashedInput = hashPassword(password);
    if (hashedInput !== admin.password) {
      return NextResponse.json(
        { success: false, error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = createSessionToken(admin.email);
    await setSession(token);

    return NextResponse.json({
      success: true,
      message: "ورود موفق",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ورود" },
      { status: 500 }
    );
  }
}
