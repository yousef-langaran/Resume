"use client";

import { useLocalizedResume } from "@/src/context/ResumeContext";
import { useTranslation } from "@/src/context/LanguageContext";
import { CiUser } from "react-icons/ci";
import UserDetail from "./UserDetail";
import ProjectExperience from "./ProjectExperience";

const AboutMe = () => {
  const resumeData = useLocalizedResume();
  const { t } = useTranslation();
  const profile = resumeData?.profile;
  if (!profile) return null;
  const hasIntro = !!(profile.introDescription || profile.introDescriptionFa);
  const userDetails = [
    { field: "Phone", value: profile.phone },
    { field: "Email", value: profile.email },
    { field: "GitHub", value: profile.github ? `github.com/${profile.github}` : "" },
    { field: "LinkedIn", value: profile.linkedin ? `linkedin.com/in/${profile.linkedin}` : "" },
  ].filter((i) => i.value);
  const hasUserDetails = userDetails.length > 0;
  const projectExperiences = resumeData?.projectStats?.length
    ? resumeData.projectStats.map((s) => ({ title: s.title, count: s.count, postFix: s.postFix }))
    : [];
  const hasProjectStats = projectExperiences.length > 0;
  if (!hasIntro && !hasUserDetails && !hasProjectStats) return null;

  return (
    <div
      data-scroll-index="1"
      id="about"
      className="py-3.5 max-w-content xl:max-2xl:max-w-50rem max-xl:mx-auto xl:ml-auto"
    >
      <div className="px-5 py-8 md:p-8 bg-white dark:bg-nightBlack rounded-2xl about-section lg:p-10 2xl:p-13">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wide text-black dark:text-white border lg:px-5 section-name border-platinum dark:border-greyBlack200 rounded-4xl">
          <CiUser className="text-theme" size={14} />
          {t("about.title")}
        </div>
        <div className="mt-7 md:mt-10 section-title">
          <h2 className="title text-[32px] md:text-4xl lg:text-5xl font-extralight text-black dark:text-white leading-1.27">
            {t("about.sectionTitle")} <span className="font-semibold text-theme">{t("about.me")}</span>
          </h2>
          {hasIntro && (
            <p className="max-w-2xl mt-4 md:mt-6 subtitle">
              {profile.introDescription || profile.introDescriptionFa}
            </p>
          )}
        </div>
        <div className="mt-6 section-content">
          {hasUserDetails && (
            <ul className="grid mt-4 mb-10 text-sm lg:mt-6 md:grid-cols-2 gap-x-8 gap-y-3">
              {userDetails.map((singlInfo, i) => (
                <UserDetail key={i} {...singlInfo} />
              ))}
            </ul>
          )}

          {hasProjectStats && (
            <ul className="grid grid-cols-2 gap-6 counters md:grid-cols-4 xl:gap-8">
              {projectExperiences.map((exp, i) => (
                <ProjectExperience key={i} {...exp} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
