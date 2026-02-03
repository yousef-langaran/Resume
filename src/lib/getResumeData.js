import { prisma } from "./db";

function parseDesignations(d) {
  try {
    if (typeof d === "string" && d.startsWith("[")) return JSON.parse(d);
    if (typeof d === "string") return d.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
    return [];
  } catch {
    return [];
  }
}

function getLocalizedField(obj, field, locale = "en") {
  if (locale === "fa") {
    const faField = `${field}Fa`;
    return obj?.[faField] || obj?.[field] || "";
  }
  return obj?.[field] || "";
}

/**
 * Get resume data for a user by slug, or "default" (first user or legacy null userId).
 * @param {string|null} slug - User slug (e.g. "john-doe"). If null, uses default (first user or legacy data).
 */
export async function getResumeData(slug = null) {
  try {
    let userId = null;
    if (slug) {
      const normalizedSlug = typeof slug === "string" ? slug.trim().normalize("NFC") : "";
      const user = await prisma.user.findUnique({ where: { slug: normalizedSlug } });
      if (!user) return null;
      userId = user.id;
    } else {
      const firstUser = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
      if (firstUser) userId = firstUser.id;
    }

    const whereUser = userId ? { userId } : { userId: null };

    const [
      profile,
      experiences,
      educations,
      skills,
      services,
      projects,
      blogs,
      testimonials,
      projectStats,
      contactInfos,
    ] = await Promise.all([
      prisma.profile.findFirst({ where: whereUser }),
      prisma.experience.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.education.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.skill.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.service.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.project.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.blog.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.projectStat.findMany({ where: whereUser, orderBy: { order: "asc" } }),
      prisma.contactInfo.findMany({ where: whereUser, orderBy: { order: "asc" } }),
    ]);

    if (!profile && experiences.length === 0) return null;

    // Return raw data - locale transformation happens on client side
    return {
      profile: profile ? {
        ...profile,
        designations: parseDesignations(profile.designations),
        designationsFa: parseDesignations(profile.designationsFa),
      } : null,
      introduce: profile
        ? {
            heading: {
              heading1: profile.introHeading1,
              heading2: profile.introHeading2,
              heading1Fa: profile.introHeading1Fa,
              heading2Fa: profile.introHeading2Fa,
            },
            introDescription: profile.introDescription,
            introDescriptionFa: profile.introDescriptionFa,
            designations: parseDesignations(profile.designations),
            designationsFa: parseDesignations(profile.designationsFa),
          }
        : null,
      userDetailsSidebar: profile
        ? {
            userName: profile.fullName,
            userNameFa: profile.fullNameFa,
            designations: parseDesignations(profile.designations),
            designationsFa: parseDesignations(profile.designationsFa),
            userImage: profile.userImage,
            userImageLight: profile.userImageLight,
            basicInfo: [
              { field: "Residence", fieldFa: "کشور", value: profile.residence, valueFa: profile.residenceFa },
              { field: "City", fieldFa: "شهر", value: profile.city, valueFa: profile.cityFa },
              { field: "Age", fieldFa: "سن", value: profile.age, valueFa: profile.age },
            ].filter((i) => i.value),
            residence: profile.residence,
            residenceFa: profile.residenceFa,
            city: profile.city,
            cityFa: profile.cityFa,
            age: profile.age,
          }
        : null,
      experiences,
      educations,
      skills,
      services,
      projects,
      blogs,
      testimonials,
      projectStats,
      contactInfos,
    };
  } catch (error) {
    console.error("getResumeData error:", error);
    return null;
  }
}

export { getLocalizedField };
