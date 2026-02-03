import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";
    
    // Fetch all resume data
    const profile = await prisma.profile.findFirst();
    const experiences = await prisma.experience.findMany({ orderBy: { order: "asc" } });
    const educations = await prisma.education.findMany({ orderBy: { order: "asc" } });
    const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Create simple HTML for PDF
    const html = `
<!DOCTYPE html>
<html dir="${lang === "fa" ? "rtl" : "ltr"}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${lang === "fa" ? (profile.fullNameFa || profile.fullName) : profile.fullName} - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: ${lang === "fa" ? "'Vazirmatn', sans-serif" : "Arial, sans-serif"};
      direction: ${lang === "fa" ? "rtl" : "ltr"};
      line-height: 1.6;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { color: #02B189; font-size: 32px; margin-bottom: 5px; }
    h2 { color: #02B189; font-size: 24px; margin: 30px 0 15px; border-bottom: 2px solid #02B189; padding-bottom: 5px; }
    h3 { color: #333; font-size: 18px; margin: 15px 0 5px; }
    .header { text-align: ${lang === "fa" ? "right" : "left"}; margin-bottom: 30px; }
    .subtitle { color: #666; font-size: 18px; margin-bottom: 10px; }
    .contact { margin: 15px 0; }
    .contact-item { display: inline-block; margin-${lang === "fa" ? "left" : "right"}: 20px; color: #666; }
    .section { margin-bottom: 30px; }
    .item { margin-bottom: 20px; padding-${lang === "fa" ? "right" : "left"}: 20px; border-${lang === "fa" ? "right" : "left"}: 3px solid #02B189; }
    .item-title { font-weight: bold; color: #333; }
    .item-subtitle { color: #02B189; font-size: 14px; margin-bottom: 5px; }
    .item-desc { color: #666; font-size: 14px; }
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
    .skill-item { padding: 8px 12px; background: #f0f0f0; border-radius: 5px; text-align: center; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${lang === "fa" ? (profile.fullNameFa || profile.fullName) : profile.fullName}</h1>
    <p class="subtitle">${lang === "fa" ? (profile.jobTitleFa || profile.jobTitle) : profile.jobTitle}</p>
    <div class="contact">
      ${profile.email ? `<span class="contact-item">📧 ${profile.email}</span>` : ""}
      ${profile.phone ? `<span class="contact-item">📱 ${profile.phone}</span>` : ""}
      ${profile.location || profile.locationFa ? `<span class="contact-item">📍 ${lang === "fa" ? (profile.locationFa || profile.location) : profile.location}</span>` : ""}
    </div>
    ${profile.github || profile.linkedin ? `
    <div class="contact">
      ${profile.github ? `<span class="contact-item">🔗 github.com/${profile.github}</span>` : ""}
      ${profile.linkedin ? `<span class="contact-item">🔗 linkedin.com/in/${profile.linkedin}</span>` : ""}
    </div>
    ` : ""}
  </div>

  ${profile.introDescription || profile.introDescriptionFa ? `
  <div class="section">
    <h2>${lang === "fa" ? "درباره من" : "About Me"}</h2>
    <p>${lang === "fa" ? (profile.introDescriptionFa || profile.introDescription) : profile.introDescription}</p>
  </div>
  ` : ""}

  ${experiences.length > 0 ? `
  <div class="section">
    <h2>${lang === "fa" ? "سوابق کاری" : "Work Experience"}</h2>
    ${experiences.map(exp => `
      <div class="item">
        <h3 class="item-title">${lang === "fa" ? (exp.positionFa || exp.position) : exp.position}</h3>
        <p class="item-subtitle">${lang === "fa" ? (exp.platformFa || exp.platform) : exp.platform} • ${lang === "fa" ? (exp.durationFa || exp.duration) : exp.duration}</p>
        <p class="item-desc">${lang === "fa" ? (exp.descriptionFa || exp.description) : exp.description}</p>
      </div>
    `).join("")}
  </div>
  ` : ""}

  ${educations.length > 0 ? `
  <div class="section">
    <h2>${lang === "fa" ? "تحصیلات" : "Education"}</h2>
    ${educations.map(edu => `
      <div class="item">
        <h3 class="item-title">${lang === "fa" ? (edu.degreeFa || edu.degree) : edu.degree}</h3>
        <p class="item-subtitle">${lang === "fa" ? (edu.institutionFa || edu.institution) : edu.institution} • ${lang === "fa" ? (edu.durationFa || edu.duration) : edu.duration}</p>
        <p class="item-desc">${lang === "fa" ? (edu.descriptionFa || edu.description) : edu.description}</p>
      </div>
    `).join("")}
  </div>
  ` : ""}

  ${skills.length > 0 ? `
  <div class="section">
    <h2>${lang === "fa" ? "مهارت‌ها" : "Skills"}</h2>
    <div class="skills-grid">
      ${skills.map(skill => `
        <div class="skill-item">
          <strong>${skill.name}</strong>: ${skill.value}%
        </div>
      `).join("")}
    </div>
  </div>
  ` : ""}

  ${services.length > 0 ? `
  <div class="section">
    <h2>${lang === "fa" ? "خدمات" : "Services"}</h2>
    ${services.map(service => `
      <div class="item">
        <h3 class="item-title">${lang === "fa" ? (service.titleFa || service.title) : service.title}</h3>
        <p class="item-desc">${lang === "fa" ? (service.descriptionFa || service.description) : service.description}</p>
      </div>
    `).join("")}
  </div>
  ` : ""}

  <div class="no-print" style="margin-top: 40px; text-align: center;">
    <button onclick="window.print()" style="padding: 12px 24px; background: #02B189; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
      ${lang === "fa" ? "چاپ / ذخیره PDF" : "Print / Save as PDF"}
    </button>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Resume generation error:", error);
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
  }
}
