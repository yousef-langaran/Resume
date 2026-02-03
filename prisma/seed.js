const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@youseflangaran.com";

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashPassword(adminPassword),
    },
  });

  const profileCount = await prisma.profile.count();
  if (profileCount === 0) {
    await prisma.profile.create({
      data: {
        fullName: "Yousef Langaran",
        fullNameFa: "یوسف لنگران",
        jobTitle: "Senior FullStack Developer",
        jobTitleFa: "توسعه‌دهنده فول‌استک ارشد",
        introHeading1: "I Craft The",
        introHeading1Fa: "من سازنده",
        introHeading2: "Digital Landscape",
        introHeading2Fa: "دنیای دیجیتال هستم",
        introDescription:
          "I am a Frontend Developer at heart and, i create features that are best suited for the job at hand.",
        introDescriptionFa:
          "من یک توسعه‌دهنده فرانت‌اند هستم و ویژگی‌هایی ایجاد می‌کنم که بهترین گزینه برای کار مورد نظر هستند.",
        userImage: "/assets/img/user-sidebar-thumb.png",
        userImageLight: "/assets/img/user-sidebar-thumb-light.png",
        designations: JSON.stringify(["Web Developer", "FullStack Developer"]),
        designationsFa: JSON.stringify(["توسعه‌دهنده وب", "توسعه‌دهنده فول‌استک"]),
        residence: "Iran",
        residenceFa: "ایران",
        city: "Mashhad",
        cityFa: "مشهد",
        age: "25",
        phone: "09351141940",
        email: "youseflangaran65@gmail.com",
        github: "youseflangaran",
        linkedin: "yousef7997",
        location: "Mashhad, Iran",
        locationFa: "مشهد، ایران",
      },
    });
  }

  const experienceCount = await prisma.experience.count();
  if (experienceCount === 0) {
    await prisma.experience.createMany({
      data: [
        {
          platform: "Utravs",
          platformFa: "شرکت یوتراوز",
          duration: "2020 - 2025",
          durationFa: "۱۳۹۹ - ۱۴۰۴",
          position: "Frontend Developer",
          positionFa: "توسعه‌دهنده فرانت‌اند",
          description: "Web and application development",
          descriptionFa: "توسعه وب و اپلیکیشن",
          order: 1,
        },
        {
          platform: "Delta Tech",
          platformFa: "دلتا تک",
          duration: "۱۳۹۹ - ۱۴۰۱",
          position: "Web Developer",
          description: "توسعه وب و سئو",
          order: 2,
        },
      ],
    });
  }

  const educationCount = await prisma.education.count();
  if (educationCount === 0) {
    await prisma.education.createMany({
      data: [
        {
          institution: "دانشگاه",
          duration: "۱۳۹۶-۱۴۰۰",
          degree: "کارشناسی",
          description: "رشته کامپیوتر",
          order: 1,
        },
      ],
    });
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({
      data: [
        { name: "React", value: 95, image: "/assets/img/skill/js.svg", order: 1 },
        { name: "Next.js", value: 90, image: "/assets/img/skill/html.svg", order: 2 },
        { name: "Node.js", value: 85, image: "/assets/img/skill/css.svg", order: 3 },
        { name: "TypeScript", value: 90, image: "/assets/img/skill/tailwind.svg", order: 4 },
        { name: "Tailwind", value: 95, image: "/assets/img/skill/tailwind.svg", order: 5 },
      ],
    });
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          number: "01",
          title: "UI/UX Design",
          description: "طراحی رابط کاربری حرفه‌ای",
          order: 1,
        },
        {
          number: "02",
          title: "Web Development",
          description: "توسعه وب با تکنولوژی‌های مدرن",
          order: 2,
        },
        {
          number: "03",
          title: "SEO / Marketing",
          description: "بهینه‌سازی موتورهای جستجو",
          order: 3,
        },
        {
          number: "04",
          title: "Branding & Strategy",
          description: "برندینگ و استراتژی دیجیتال",
          order: 4,
        },
      ],
    });
  }

  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.createMany({
      data: [
        {
          title: "پروژه نمونه ۱",
          slug: "design-branding-project-1",
          type: "Branding",
          thumbnail: "/assets/img/portfolio/portfolio-img1.png",
          image: "/assets/img/portfolio/portfolio-img1.png",
          client: "Envato Theme",
          services: "Tips & Tricks, Design",
          duration: "108 hrs",
          description: "توضیحات پروژه...",
          order: 1,
        },
        {
          title: "پروژه نمونه ۲",
          slug: "design-branding-project-2",
          type: "Branding",
          thumbnail: "/assets/img/portfolio/portfolio-img2.png",
          image: "/assets/img/portfolio/portfolio-img2.png",
          client: "Envato Theme",
          services: "Design",
          duration: "108 hrs",
          description: "توضیحات پروژه...",
          order: 2,
        },
      ],
    });
  }

  const blogCount = await prisma.blog.count();
  if (blogCount === 0) {
    await prisma.blog.createMany({
      data: [
        {
          title: "مقاله نمونه ۱",
          slug: "elevate-your-mornings-with-perfectly-brewed-coffee",
          category: "UI Design",
          date: "03 May 2023",
          thumbnail: "/assets/img/blog/article1.png",
          image: "/assets/img/blog/article1.png",
          postedBy: "یوسف لنگران",
          description: "محتوای مقاله...",
          order: 1,
        },
      ],
    });
  }

  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          name: "Alex Johnson",
          position: "Developer",
          image: "/assets/img/testimonial/author1.png",
          text: "همکاری با یوسف عالی بود. مهارت و تعهد بالایی دارد.",
          order: 1,
        },
      ],
    });
  }

  const statCount = await prisma.projectStat.count();
  if (statCount === 0) {
    await prisma.projectStat.createMany({
      data: [
        { title: "Years Of Experience", count: 7, postFix: true, order: 1 },
        { title: "Handled Projects", count: 12, postFix: true, order: 2 },
        { title: "Open Source Libraries", count: 5, postFix: true, order: 3 },
        { title: "Awards Won", count: 18, postFix: false, order: 4 },
      ],
    });
  }

  const contactCount = await prisma.contactInfo.count();
  if (contactCount === 0) {
    await prisma.contactInfo.createMany({
      data: [
        { field: "Location", data: "مشهد، ایران", order: 1 },
        { field: "E-mail", data: "youseflangaran65@gmail.com", order: 2 },
        { field: "Phone", data: "۰۹۳۵۱۱۴۱۹۴۰", order: 3 },
      ],
    });
  }

  console.log("✅ Seed completed successfully!");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
