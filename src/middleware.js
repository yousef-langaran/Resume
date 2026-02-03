import { NextResponse } from "next/server";

/**
 * وقتی کاربر با دامنه شخصی (custom domain) وارد شود، درخواست به /resume/[slug] همان کاربر بازنویسی می‌شود.
 * در .env متغیر SITE_URL را با آدرس اصلی سایت پر کن (مثلاً https://yoursite.com)
 */
export async function middleware(request) {
  const host = request.nextUrl.hostname;
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
  if (!siteUrl) return NextResponse.next();

  let mainHost;
  try {
    mainHost = new URL(siteUrl).hostname;
  } catch {
    return NextResponse.next();
  }

  if (host === mainHost) return NextResponse.next();

  const base = siteUrl.replace(/\/$/, "");
  let res;
  try {
    res = await fetch(`${base}/api/resolve-domain?domain=${encodeURIComponent(host)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
  } catch {
    return NextResponse.next();
  }

  if (!res.ok) return NextResponse.next();

  let data;
  try {
    data = await res.json();
  } catch {
    return NextResponse.next();
  }

  const slug = data?.slug;
  if (!slug) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/resume/${encodeURIComponent(slug)}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
