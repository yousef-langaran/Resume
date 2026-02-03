"use client";

import { useLocalizedResume } from "@/src/context/ResumeContext";
import { useTranslation } from "@/src/context/LanguageContext";
import { FaFolderOpen } from "react-icons/fa";
import SectionHeading from "../shared/SectionHeading";
import SingleExperience from "./SingleExperience";
import SingleEducation from "./SingleEducation";

const Resume = () => {
  const resumeData = useLocalizedResume();
  const { isRTL } = useTranslation();
  if (!resumeData?.experiences?.length && !resumeData?.educations?.length) return null;

  const experiencesList = (resumeData?.experiences ?? []).map((e) => ({
    platform: e.platform,
    duration: e.duration,
    position: e.position,
    description: e.description,
  }));
  const educationsList = (resumeData?.educations ?? []).map((e) => ({
    institution: e.institution,
    duration: e.duration,
    degree: e.degree,
    description: e.description,
  }));

  const listClass = `space-y-5 md:space-y-11 relative md:before:content-[''] md:before:absolute ${isRTL ? "md:before:right-64 md:before:border-l" : "md:before:left-64 md:before:border-r"} md:before:border-platinum md:dark:before:border-metalBlack md:before:h-[calc(100%_-1.5rem)] md:before:top-1/2 md:before:-translate-y-1/2`;

  return (
    <div
      data-scroll-index="4"
      id="resume"
      className="py-5 xl:py-3.5 max-w-content xl:max-2xl:max-w-50rem max-xl:mx-auto xl:ml-auto"
    >
      <div className="px-5 py-8 md:p-8 bg-white dark:bg-nightBlack rounded-2xl service-section lg:p-10 2xl:p-13">
        <SectionHeading
          icon={<FaFolderOpen className="text-theme" />}
          titleKey="resume.title"
          headingKey="resume.work"
          coloredHeadingKey="resume.experience"
          descriptionKey="resume.description"
        />

        {experiencesList.length > 0 && (
          <div className="experience">
            <ul className={listClass}>
              {experiencesList.map((item, i) => (
                <SingleExperience key={i} {...item} />
              ))}
            </ul>
          </div>
        )}

        {educationsList.length > 0 && (
          <>
            {experiencesList.length > 0 && <br />}
            <SectionHeading
              headingKey="resume.my"
              coloredHeadingKey="resume.education"
            />
            <div className="experience">
              <ul className={listClass}>
                {educationsList.map((item, i) => (
                  <SingleEducation key={i} {...item} />
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Resume;
