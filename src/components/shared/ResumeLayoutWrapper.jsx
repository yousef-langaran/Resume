"use client";

import { ResumeProvider } from "@/src/context/ResumeContext";

export default function ResumeLayoutWrapper({ initialData, children }) {
  return <ResumeProvider initialData={initialData}>{children}</ResumeProvider>;
}
