import { getResumeData } from "@/src/lib/getResumeData";
import { notFound } from "next/navigation";
import ResumeLayoutWrapper from "@/src/components/shared/ResumeLayoutWrapper";

function normalizeSlug(slug) {
  if (!slug || typeof slug !== "string") return "";
  try {
    return decodeURIComponent(slug.trim());
  } catch {
    return slug.trim();
  }
}

export async function generateMetadata({ params }) {
  const resolved = typeof params.then === "function" ? await params : params;
  const slug = normalizeSlug(resolved?.slug);
  const data = await getResumeData(slug);
  const name = data?.profile?.fullName || data?.profile?.fullNameFa || "رزومه";
  return {
    title: `رزومه ${name}`,
    description: data?.profile?.introDescription || data?.profile?.introDescriptionFa || "رزومه آنلاین",
  };
}

export default async function ResumeSlugLayout({ children, params }) {
  const resolved = typeof params.then === "function" ? await params : params;
  const slug = normalizeSlug(resolved?.slug);
  const data = await getResumeData(slug);
  if (!data) notFound();
  return <ResumeLayoutWrapper initialData={data}>{children}</ResumeLayoutWrapper>;
}
