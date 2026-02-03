import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";
import { hashPassword, setUserSession, createUserSessionToken } from "@/src/lib/auth";

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-\u0600-\u06FF]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "user";
}

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: "ایمیل، رمز عبور و نام الزامی است" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "رمز عبور حداقل ۶ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "این ایمیل قبلاً ثبت شده است" },
        { status: 400 }
      );
    }

    let slug = slugify(name);
    let suffix = 0;
    while (true) {
      const taken = await prisma.user.findUnique({ where: { slug: suffix ? `${slug}-${suffix}` : slug } });
      if (!taken) break;
      suffix++;
    }
    const finalSlug = suffix ? `${slug}-${suffix}` : slug;

    const hashed = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        password: hashed,
        name: name.trim(),
        slug: finalSlug,
      },
    });

    const token = createUserSessionToken(user.id);
    await setUserSession(token);

    return NextResponse.json({
      success: true,
      message: "ثبت‌نام موفق",
      user: { id: user.id, email: user.email, name: user.name, slug: user.slug },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت‌نام" },
      { status: 500 }
    );
  }
}
