"use client";

import BlogComment from "@/src/components/blog/BlogComment";
import BlogDescription from "@/src/components/blog/BlogDescription";
import BlogHero from "@/src/components/blog/BlogHero";
import Footer from "@/src/components/shared/Footer";
import Layout from "@/layout/Layout";
import { blogs as staticBlogs } from "@/src/staticData/home/home";
import { useResume } from "@/src/context/ResumeContext";
import { useEffect, useState } from "react";

export default function SingleBlog({ params }) {
  const [blog, setBlog] = useState({});
  const resumeData = useResume();
  const blogs = resumeData?.blogs?.length
    ? { blogsData: resumeData.blogs.map((b) => ({ ...b, image: { thumbnail: b.thumbnail || b.image, image: b.image } })) }
    : staticBlogs;

  useEffect(() => {
    const found = blogs?.blogsData?.find((b) => b?.slug === params?.slug);
    setBlog(found || {});
  }, [params?.slug, blogs]);

  return (
    <Layout>
      <div
        className="py-3.5 max-w-content xl:max-2xl:max-w-50rem max-xl:mx-auto xl:ml-auto"
        id="blog"
      >
        <div className="px-5 py-8 md:p-8 bg-white dark:bg-nightBlack rounded-2xl lg:p-10 2xl:p-13">
          <BlogHero blog={blog} />

          <BlogDescription blog={blog} />
          <BlogComment slug={params?.slug} />
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
