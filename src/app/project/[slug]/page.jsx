"use client";

import { useEffect, useState } from "react";
import ProjectDescription from "@/src/components/project/ProjectDescription";
import ProjectHero from "@/src/components/project/ProjectHero";
import Layout from "@/layout/Layout";
import { portfolio as staticPortfolio } from "@/src/staticData/home/home";
import { useResume } from "@/src/context/ResumeContext";
import Footer from "@/src/components/shared/Footer";

export default function SingleProject({ params }) {
  const [project, setProject] = useState({});
  const resumeData = useResume();
  const portfolio = resumeData?.projects?.length
    ? { projectsData: resumeData.projects.map((p) => ({ ...p, image: { thumbnail: p.thumbnail || p.image, image: p.image, thumbnailText1: "Design", thumbnailText2: "Specialization" } })) }
    : staticPortfolio;

  useEffect(() => {
    const found = portfolio?.projectsData?.find((p) => p?.slug === params?.slug);
    setProject(found || {});
  }, [params?.slug, portfolio]);

  return (
    <Layout>
      <div
        className="py-3.5 max-w-content xl:max-2xl:max-w-50rem max-xl:mx-auto xl:ml-auto"
        id="portfolio"
      >
        <div className="px-5 py-8 md:p-8 bg-white dark:bg-nightBlack rounded-2xl lg:p-10 2xl:p-13">
          <ProjectHero project={project} />
          <ProjectDescription project={project} />
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
