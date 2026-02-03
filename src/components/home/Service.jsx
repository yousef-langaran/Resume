"use client";

import { services as staticServices } from "@/src/staticData/home/home";
import { useLocalizedResume } from "@/src/context/ResumeContext";
import { useTranslation } from "@/src/context/LanguageContext";
import SectionHeading from "../shared/SectionHeading";
import SingleService from "./SingleService";
import { FaBriefcase } from "react-icons/fa";

const Service = () => {
  const resumeData = useLocalizedResume();
  const { t, isRTL } = useTranslation();
  if (!resumeData?.services?.length) return null;
  const services = resumeData?.services?.length
    ? { ...staticServices, servicesData: resumeData.services.map((s, i) => ({ ...s, id: s.id || i + 1 })) }
    : staticServices;
  return (
    <div
      data-scroll-index="2"
      id="service"
      className="py-5 xl:py-3.5 max-w-content xl:max-2xl:max-w-50rem max-xl:mx-auto xl:ml-auto"
    >
      <div className="px-5 py-8 md:p-8 bg-white dark:bg-nightBlack rounded-2xl service-section lg:p-10 2xl:p-13">
        <SectionHeading
          icon={<FaBriefcase className="text-theme" />}
          titleKey="services.title"
          headingKey="services.my"
          coloredHeadingKey="services.services"
          descriptionKey="services.description"
        />

        <div className="grid gap-5 md:gap-6 service-card-wrapper sm:grid-cols-2 lg:gap-7 2xl:gap-8">
          {services?.servicesData?.map((service) => (
            <SingleService key={service?.id} {...service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
