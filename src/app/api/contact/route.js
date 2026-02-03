import { NextResponse } from "next/server";
import { Resend } from "resend";
import { saveContact } from "@/src/lib/contact";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, message } = body;

    if (!fullName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "لطفاً تمام فیلدها را پر کنید" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "ایمیل معتبر نیست" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { success: false, error: "پیام باید حداقل ۱۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const contactData = { fullName: fullName.trim(), email: email.trim(), message: message.trim() };

    // Send email if RESEND_API_KEY is set
    if (resend) {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: process.env.CONTACT_EMAIL || "youseflangaran65@gmail.com",
        replyTo: email,
        subject: `پیام جدید از ${fullName} - Portfolio`,
        html: `
          <h2>پیام جدید از فرم تماس</h2>
          <p><strong>نام:</strong> ${fullName}</p>
          <p><strong>ایمیل:</strong> ${email}</p>
          <p><strong>پیام:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return NextResponse.json(
          { success: false, error: "ارسال ایمیل با خطا مواجه شد. لطفاً دوباره تلاش کنید." },
          { status: 500 }
        );
      }
    } else {
      // Save to file when no Resend - برای ذخیره پیام‌ها در حالت توسعه
      saveContact(contactData);
    }

    return NextResponse.json({
      success: true,
      message: "پیام شما با موفقیت ارسال شد. به زودی با شما تماس می‌گیرم.",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "خطایی رخ داده است. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}
