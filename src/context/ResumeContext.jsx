"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useLanguage } from "./LanguageContext";

const ResumeContext = createContext(null);

export function ResumeProvider({ children, initialData }) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (!initialData) {
      fetch("/api/resume")
        .then((r) => r.json())
        .then((res) => {
          if (res?.profile || (res?.experiences && res.experiences.length > 0)) {
            setData(res);
          }
        })
        .catch(() => {});
    }
  }, [initialData]);

  return (
    <ResumeContext.Provider value={data}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}

// Get localized field value
function getLocalizedField(obj, field, locale) {
  if (!obj) return "";
  if (locale === "fa") {
    const faKey = `${field}Fa`;
    return obj[faKey] || obj[field] || "";
  }
  return obj[field] || "";
}

// Hook to get localized resume data
export function useLocalizedResume() {
  const resumeData = useContext(ResumeContext);
  let locale = "en";
  
  try {
    const { locale: contextLocale } = useLanguage();
    locale = contextLocale;
  } catch {
    // LanguageContext might not be available during SSR
  }

  return useMemo(() => {
    if (!resumeData) return null;

    const isFa = locale === "fa";

    return {
      ...resumeData,
      profile: resumeData.profile ? {
        ...resumeData.profile,
        fullName: getLocalizedField(resumeData.profile, "fullName", locale),
        jobTitle: getLocalizedField(resumeData.profile, "jobTitle", locale),
        introHeading1: getLocalizedField(resumeData.profile, "introHeading1", locale),
        introHeading2: getLocalizedField(resumeData.profile, "introHeading2", locale),
        introDescription: getLocalizedField(resumeData.profile, "introDescription", locale),
        designations: isFa ? (resumeData.profile.designationsFa?.length ? resumeData.profile.designationsFa : resumeData.profile.designations) : resumeData.profile.designations,
        residence: getLocalizedField(resumeData.profile, "residence", locale),
        city: getLocalizedField(resumeData.profile, "city", locale),
        location: getLocalizedField(resumeData.profile, "location", locale),
      } : null,
      introduce: resumeData.introduce ? {
        heading: {
          heading1: isFa ? (resumeData.introduce.heading.heading1Fa || resumeData.introduce.heading.heading1) : resumeData.introduce.heading.heading1,
          heading2: isFa ? (resumeData.introduce.heading.heading2Fa || resumeData.introduce.heading.heading2) : resumeData.introduce.heading.heading2,
        },
        introDescription: isFa ? (resumeData.introduce.introDescriptionFa || resumeData.introduce.introDescription) : resumeData.introduce.introDescription,
        designations: isFa ? (resumeData.introduce.designationsFa?.length ? resumeData.introduce.designationsFa : resumeData.introduce.designations) : resumeData.introduce.designations,
      } : null,
      userDetailsSidebar: resumeData.userDetailsSidebar ? {
        ...resumeData.userDetailsSidebar,
        userName: isFa ? (resumeData.userDetailsSidebar.userNameFa || resumeData.userDetailsSidebar.userName) : resumeData.userDetailsSidebar.userName,
        designations: isFa ? (resumeData.userDetailsSidebar.designationsFa?.length ? resumeData.userDetailsSidebar.designationsFa : resumeData.userDetailsSidebar.designations) : resumeData.userDetailsSidebar.designations,
        basicInfo: (resumeData.userDetailsSidebar.basicInfo || []).map(item => ({
          ...item,
          field: isFa ? (item.fieldFa || item.field) : item.field,
          value: isFa ? (item.valueFa || item.value) : item.value,
        })),
      } : null,
      experiences: (resumeData.experiences || []).map(exp => ({
        ...exp,
        platform: getLocalizedField(exp, "platform", locale),
        duration: getLocalizedField(exp, "duration", locale),
        position: getLocalizedField(exp, "position", locale),
        description: getLocalizedField(exp, "description", locale),
      })),
      educations: (resumeData.educations || []).map(edu => ({
        ...edu,
        institution: getLocalizedField(edu, "institution", locale),
        duration: getLocalizedField(edu, "duration", locale),
        degree: getLocalizedField(edu, "degree", locale),
        description: getLocalizedField(edu, "description", locale),
      })),
      services: (resumeData.services || []).map(srv => ({
        ...srv,
        title: getLocalizedField(srv, "title", locale),
        description: getLocalizedField(srv, "description", locale),
      })),
      projects: (resumeData.projects || []).map(proj => ({
        ...proj,
        title: getLocalizedField(proj, "title", locale),
        type: getLocalizedField(proj, "type", locale),
        client: getLocalizedField(proj, "client", locale),
        services: getLocalizedField(proj, "services", locale),
        duration: getLocalizedField(proj, "duration", locale),
        description: getLocalizedField(proj, "description", locale),
      })),
      blogs: (resumeData.blogs || []).map(blog => ({
        ...blog,
        title: getLocalizedField(blog, "title", locale),
        category: getLocalizedField(blog, "category", locale),
        date: getLocalizedField(blog, "date", locale),
        postedBy: getLocalizedField(blog, "postedBy", locale),
        description: getLocalizedField(blog, "description", locale),
      })),
      testimonials: (resumeData.testimonials || []).map(test => ({
        ...test,
        name: getLocalizedField(test, "name", locale),
        position: getLocalizedField(test, "position", locale),
        text: getLocalizedField(test, "text", locale),
      })),
      projectStats: (resumeData.projectStats || []).map(stat => ({
        ...stat,
        title: getLocalizedField(stat, "title", locale),
      })),
      contactInfos: (resumeData.contactInfos || []).map(info => ({
        ...info,
        field: getLocalizedField(info, "field", locale),
        data: getLocalizedField(info, "data", locale),
      })),
    };
  }, [resumeData, locale]);
}
