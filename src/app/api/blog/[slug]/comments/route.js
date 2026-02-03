import { NextResponse } from "next/server";
import { getCommentsBySlug, addComment } from "@/src/lib/comments";

export async function GET(request, { params }) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    const comments = getCommentsBySlug(slug);
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در دریافت نظرات" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, message } = body;

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "لطفاً نام و پیام را وارد کنید" },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return NextResponse.json(
        { success: false, error: "پیام باید حداقل ۵ کاراکتر باشد" },
        { status: 400 }
      );
    }

    const newComment = addComment(slug, { name: name.trim(), message: message.trim() });
    return NextResponse.json({
      success: true,
      message: "نظر شما با موفقیت ثبت شد",
      comment: newComment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json(
      { success: false, error: "خطا در ثبت نظر" },
      { status: 500 }
    );
  }
}
