"use client";

import { useTranslation } from "@/src/context/LanguageContext";

const SectionHeading = ({
  icon,
  title,
  titleKey,
  heading,
  headingKey,
  coloredHeading,
  coloredHeadingKey,
  description,
  descriptionKey,
}) => {
  const { t } = useTranslation();

  const displayTitle = titleKey ? t(titleKey) : title;
  const displayHeading = headingKey ? t(headingKey) : heading;
  const displayColoredHeading = coloredHeadingKey ? t(coloredHeadingKey) : coloredHeading;
  const displayDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <div>
      {icon && displayTitle && (
        <div className="inline-flex items-center gap-2 px-4 py-2 text-xs tracking-wide text-black dark:text-white border lg:px-5 section-name border-platinum dark:border-greyBlack200 rounded-4xl">
          {icon}
          {displayTitle}
        </div>
      )}
      <div className="mb-8 mt-7 md:my-10 section-title">
        {displayHeading && displayColoredHeading && (
          <h2 className="title text-[32px] md:text-4xl lg:text-5xl font-extralight text-black dark:text-white leading-1.27">
            {displayHeading}{" "}
            <span className="font-semibold text-theme">{displayColoredHeading}</span>
          </h2>
        )}
        {displayDescription && <p className="max-w-xl mt-4 md:mt-6 subtitle">{displayDescription}</p>}
      </div>
    </div>
  );
};

export default SectionHeading;
