"use client";

import { comments as staticComments } from "@/src/staticData/blog/blog";
import { useState, useEffect } from "react";
import Input from "../ui/fields/Input";
import Textarea from "../ui/fields/TextArea";
import Image from "next/image";
import { motion } from "framer-motion";

const BlogComment = ({ slug }) => {
  const [comments, setComments] = useState(staticComments);
  const [formValues, setFormValues] = useState({ name: "", message: "" });
  const [replyFormIndices, setReplyFormIndices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  useEffect(() => {
    if (slug) {
      fetch(`/api/blog/${slug}/comments`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.comments?.length) {
            setComments(data.comments.map((c) => ({ author: { name: c.author?.name, imageSrc: c.author?.imageSrc || "/assets/img/blog/comment-author.png" }, date: c.date, text: c.text })));
          }
        })
        .catch(() => {});
    }
  }, [slug]);

  const handleReplyButtonClick = (index) => {
    if (replyFormIndices.includes(index)) {
      setReplyFormIndices(replyFormIndices.filter((i) => i !== index));
    } else {
      setReplyFormIndices([...replyFormIndices, index]);
    }
  };

  const { name, message } = formValues;

  const reset = () => setFormValues({ name: "", message: "" });

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);
    setSubmitMsg("");
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      if (data?.success && data?.comment) {
        const c = data.comment;
        setComments((prev) => [{ author: { name: c.author?.name, imageSrc: c.author?.imageSrc || "/assets/img/blog/comment-author.png" }, date: c.date, text: c.text }, ...prev]);
        reset();
        setSubmitMsg("نظر ثبت شد ✓");
      } else {
        setSubmitMsg(data?.error || "خطا");
      }
    } catch {
      setSubmitMsg("خطا در ارسال");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="comments">
        <h3 className="mb-5 text-2xl font-medium text-black dark:text-white">
          Comments ({comments?.length || 0})
        </h3>

        <ul className="comment-list">
          {comments?.map((comment, i) => (
            <li key={i} className="py-4 comment">
              <div className="flex gap-4 author">
                <div className="thumb">
                  <Image
                    width={50}
                    height={50}
                    src={comment?.author?.imageSrc}
                    className="rounded-full object-cover"
                    alt={comment?.author?.name}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="mb-1 text-lg font-medium text-black dark:text-white">
                    {comment?.author?.name}
                  </h4>
                  <p className="text-sm leading-1.875">{comment?.date}</p>
                </div>
              </div>
              <div className="description md:ml-16 md:pl-2">
                <p className="my-4 text-sm md:text-regular leading-1.875">
                  {comment?.text}
                </p>
                <p>
                  <button
                    className="text-sm font-medium dark:font-light text-black dark:text-white"
                    data-te-collapse-init
                    data-te-target={`#reply_form${i}`}
                    aria-label="Reply Comment"
                    onClick={() => handleReplyButtonClick(i)}
                  >
                    Reply
                  </button>
                </p>
                <motion.form
                  id={`reply_form${i}`}
                  className="mt-2 comment-form"
                  style={{
                    overflow: "hidden",
                  }}
                  initial={{
                    height: replyFormIndices.includes(i) ? "auto" : 0,
                    opacity: replyFormIndices.includes(i) ? 1 : 0,
                  }}
                  animate={{
                    height: replyFormIndices.includes(i) ? "auto" : 0,
                    opacity: replyFormIndices.includes(i) ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <textarea
                    name="replyComment"
                    rows="5"
                    className="w-full h-24 p-4 text-sm bg-transparent border border-platinum dark:border-greyBlack focus:border-theme dark:focus:border-theme rounded-lg outline-none resize-none"
                  ></textarea>
                  <div className="space-x-3 button-group text-end">
                    <button
                      type="reset"
                      className="px-4 py-2 text-sm font-light text-black dark:text-white border rounded-md border-platinum dark:border-greyBlack dark:hover:bg-greyBlack"
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-light text-white border rounded-md border-theme bg-theme"
                      aria-label="Reply Comment"
                    >
                      Reply
                    </button>
                  </div>
                </motion.form>
              </div>
            </li>
          ))}
        </ul>

        <form
          onSubmit={handleSubmit}
          action="#"
          method="post"
          className="mt-6 comment-form xl:mt-12"
        >
          <h5 className="mb-5 text-black dark:text-white font-regular">
            Leave a Comment
          </h5>
          {submitMsg && <p className={`mb-2 ${submitMsg.includes("✓") ? "text-green-600" : "text-red-500"}`}>{submitMsg}</p>}
          <div className="space-y-5 form-group">
            <Input
              type="text"
              name="name"
              className="w-full border rounded-md border-dashed border-platinum dark:border-greyBlack outline-none py-3.5 px-4 text-white text-regular focus:border-theme dark:focus:border-theme dark:placeholder:text-white/40"
              placeholder="Full Name"
              handleChange={handleChange}
              value={name}
            />
            <Textarea
              handleChange={handleChange}
              name="message"
              rows="5"
              className="w-full border rounded-md border-dashed border-platinum dark:border-greyBlack outline-none py-3.5 px-4 text-white text-regular focus:border-theme dark:focus:border-theme dark:placeholder:text-white/40 resize-none"
              placeholder="Your Message"
              value={message}
            />
            <button
              type="submit"
              disabled={submitting || !slug}
              className="inline-flex items-center gap-2 text-[15px] font-medium border border-theme bg-theme text-white py-4.5 px-9 rounded-4xl leading-none transition-all duration-300 hover:bg-themeHover hover:border-themeHover disabled:opacity-50"
              aria-label="Add Comment"
            >
              {submitting ? "در حال ارسال..." : "Add Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogComment;
