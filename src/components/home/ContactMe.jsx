"use client";

import { contactInfo as staticContactInfo } from "@/src/staticData/home/home";
import { useLocalizedResume } from "@/src/context/ResumeContext";
import { useTranslation } from "@/src/context/LanguageContext";
import LocationIcon from "../icons/home/LocationIcon";
import EmailIcon from "../icons/home/EmailIcon";
import PhoneIcon from "../icons/home/PhoneIcon";
import { FaRegEnvelopeOpen } from "react-icons/fa";
import { useState } from "react";
import Input from "../ui/fields/Input";
import Textarea from "../ui/fields/TextArea";
import SectionHeading from "../shared/SectionHeading";
import ContactInfo from "./ContactInfo";

const iconMap = { Location: LocationIcon, "E-mail": EmailIcon, Email: EmailIcon, Phone: PhoneIcon };

const ContactMe = () => {
  const resumeData = useLocalizedResume();
  const { t, isRTL } = useTranslation();
  if (!resumeData?.contactInfos?.length) return null;
  const contactInfo = resumeData?.contactInfos?.length
    ? {
        ...staticContactInfo,
        contactInfoData: resumeData.contactInfos.map((c, i) => {
          const IconComponent = iconMap[c.field] || LocationIcon;
          return { id: c.id || i + 1, field: c.field, data: c.data, Icon: <IconComponent /> };
        }),
      }
    : staticContactInfo;
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const { fullName, email, message } = formValues;

  const reset = () => {
    setFormValues({ fullName: "", email: "", message: "" });
  };

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitMessage(data.message || "پیام ارسال شد ✓");
        reset();
      } else {
        setSubmitMessage(data.error || "خطا در ارسال");
      }
    } catch {
      setSubmitMessage("خطا در اتصال به سرور");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      data-scroll-index="8"
      id="contact"
      className="py-5 xl:py-3.5 max-w-content xl:max-2xl:max-w-50rem max-xl:mx-auto xl:ml-auto"
    >
      <div className="px-5 py-8 bg-white dark:bg-nightBlack rounded-2xl contact-section lg:p-13">
        <SectionHeading
          icon={<FaRegEnvelopeOpen className="text-theme" />}
          titleKey="contact.title"
          headingKey="contact.contact"
          coloredHeadingKey="contact.me"
          descriptionKey="contact.description"
        />

        <div className="grid gap-12 mt-8 mb-10 md:my-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <ul className="space-y-6 md:space-y-10 2xl:space-y-12 contact-info">
              {contactInfo?.contactInfoData?.map((item) => (
                <ContactInfo key={item?.id} {...item} />
              ))}
            </ul>
          </div>

          <div className="md:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-group">
                <Input handleChange={handleChange} value={fullName} placeholder={t("contact.name")} className="w-full p-5 text-sm outline-none h-13 focus:border-theme dark:focus:border-theme dark:placeholder:text-white/40" />
              </div>
              <div className="form-group">
                <Input
                  type="email"
                  placeholder={t("contact.emailAddress")}
                  handleChange={handleChange}
                  name="email"
                  value={email}
                  className="w-full p-5 text-sm outline-none h-13 focus:border-theme dark:focus:border-theme dark:placeholder:text-white/40"
                />
              </div>
              <div className="form-group">
                <Textarea
                  handleChange={handleChange}
                  name="message"
                  value={message}
                  placeholder={t("contact.message")}
                  className="w-full px-5 py-4 text-sm outline-none focus:border-theme dark:placeholder:text-white/40"
                />
              </div>
              {submitMessage && (
                <p className={submitMessage.includes("✓") ? "text-green-600" : "text-red-500"}>{submitMessage}</p>
              )}
              <div className=" form-group">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 text-[15px] font-medium border border-theme bg-theme text-white py-4.5 px-9 rounded-4xl leading-none transition-all duration-300 hover:bg-themeHover hover:border-themeHover disabled:opacity-50"
                  aria-label="Send Message"
                >
                  {submitting ? t("contact.sending") : t("contact.sendMessage")}
                </button>
              </div>
            </form>
          </div>
        </div>
        <iframe
          className="w-full overflow-hidden border-10 border-platinum dark:border-greyBlack embed-map h-80 2xl:h-96 rounded-2xl"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25908.703277839155!2d-74.18208878159237!3d40.640176526919696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1699271377092!5m2!1sen!2sbd"
          aria-label="Contact Map"
        />
      </div>
    </div>
  );
};

export default ContactMe;
