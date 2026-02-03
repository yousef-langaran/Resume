"use client";

import Button from "../ui/Button";
import { useLocalizedResume } from "@/src/context/ResumeContext";
import { useTranslation } from "@/src/context/LanguageContext";
import Image from "next/image";
import { IoMdPaperPlane } from "react-icons/io";
import IntroduceJob from "./IntroduceJob";
import { BiCheckDouble } from "react-icons/bi";

const Hero = () => {
  const resumeData = useLocalizedResume();
  const { t, isRTL } = useTranslation();
  const profile = resumeData?.profile;
  if (!profile) return null;
  const hasHeading1 = !!(profile.introHeading1 || profile.introHeading1Fa);
  const hasHeading2 = !!(profile.introHeading2 || profile.introHeading2Fa);
  const hasDesc = !!(profile.introDescription || profile.introDescriptionFa);
  if (!hasHeading1 && !hasHeading2 && !hasDesc) return null;
  const introduce = resumeData?.introduce
    ? {
        heading: { ...resumeData.introduce?.heading },
        desc: (resumeData.introduce?.introDescription || resumeData.introduce?.introDescriptionFa) ? (
          <p>{resumeData.introduce.introDescription || resumeData.introduce?.introDescriptionFa}</p>
        ) : null,
      }
    : null;
  if (!introduce?.heading?.heading1 && !introduce?.heading?.heading2 && !introduce?.desc) return null;
  const userImage = profile.userImage || profile.userImageLight;

  return (
    <div
      data-scroll-index="0"
      id="home"
      className="py-5 xl:py-3.5 max-w-content xl:max-2xl:max-w-50rem max-xl:mx-auto xl:ml-auto"
    >
      <div className="px-5 py-8 bg-white dark:bg-nightBlack rounded-2xl hero-section md:p-8 lg:p-10 2xl:p-13">
        <div className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wide text-black dark:text-white border lg:px-5 section-name border-platinum dark:border-greyBlack200 rounded-4xl">
          {t("hero.introduce")}
        </div>
        <div className="items-center gap-6 hero-content md:flex xl:gap-10">
          <div className="text-content pt-7 lg:pt-8 max-lg:max-w-[30rem]">
            <h1 className="text-[32px] lg:text-5xl xl:text-4xl 2xl:text-5xl font-semibold text-black dark:text-white leading-1.27 lg:leading-1.27 xl:leading-1.27 2xl:leading-1.27 mb-4 lg:mb-5">
              {introduce?.heading?.heading1} {introduce?.heading?.heading2 && <><br /><span className="text-theme">{introduce.heading.heading2}</span></>}
            </h1>
            {introduce?.desc}
            <ul className={`flex items-center gap-3 sm:gap-6 mt-4 lg:mt-5 ${isRTL ? "flex-row-reverse" : ""}`}>
              <IntroduceJob title={t("hero.availableForWork")} icon={<BiCheckDouble size={25} className="text-theme" />} />
              <IntroduceJob title={t("hero.fullTimeJob")} icon={<BiCheckDouble size={25} className="text-theme" />} />
            </ul>
            <ul className="mt-7 buttons">
              <li data-scroll-nav="8">
                <Button text={t("hero.hireMe")} prefix={<IoMdPaperPlane size={18} />} />
              </li>
            </ul>
          </div>
          {userImage && (
            <div className="hero-image flex-[0_0_20.3rem] max-md:hidden">
              {profile.userImageLight && (
                <Image
                  src={profile.userImageLight}
                  width={350}
                  height={200}
                  alt=""
                  priority
                  className="dark:hidden w-full h-auto object-cover rounded-lg"
                  unoptimized={profile.userImageLight?.startsWith("/")}
                />
              )}
              {(profile.userImage || !profile.userImageLight) && (
                <Image
                  src={profile.userImage || profile.userImageLight}
                  width={350}
                  height={200}
                  alt=""
                  className={profile.userImageLight ? "hidden dark:block w-full h-auto object-cover rounded-lg" : "w-full h-auto object-cover rounded-lg"}
                  unoptimized={(profile.userImage || profile.userImageLight)?.startsWith("/")}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
