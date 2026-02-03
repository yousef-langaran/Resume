import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { hashPassword, setUserSession, createUserSessionToken } from "@/src/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "ایمیل و رمز عبور الزامی است" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const hashedInput = hashPassword(password);
    if (hashedInput !== user.password) {
      return NextResponse.json(
        { success: false, error: "ایمیل یا رمز عبور اشتباه است" },
        { status: 401 }
      );
    }

    const token = createUserSessionToken(user.id);
    await setUserSession(token);

    return NextResponse.json({
      success: true,
      message: "ورود موفق",
      user: { id: user.id, email: user.email, name: user.name, slug: user.slug },
    });
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ورود" },
      { status: 500 }
    );
  }
}
