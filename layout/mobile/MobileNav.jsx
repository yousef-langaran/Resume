"use client";
import { siteSettings } from "@/src/staticData/siteSettings";
import { useTranslation } from "@/src/context/LanguageContext";
import Link from "next/link";
import Drawer from "react-modern-drawer";
import { LiaTimesSolid } from "react-icons/lia";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navTranslationKeys = {
  Home: "nav.home",
  About: "nav.about",
  Service: "nav.service",
  Skills: "nav.skills",
  Resume: "nav.resume",
  Portfolio: "nav.portfolio",
  Blog: "nav.blog",
  Testimonial: "nav.testimonial",
  Contact: "nav.contact",
};

const MobileNav = ({ isOpen, toggleDrawer }) => {
  const pathname = usePathname();
  const [active, setActive] = useState(1);
  const { t, isRTL } = useTranslation();

  return (
    <Drawer
      customIdSuffix
      open={isOpen}
      onClose={toggleDrawer}
      direction={isRTL ? "left" : "right"}
      overlayOpacity="0.6"
    >
      <div className="mobile-menu fixed top-0 w-full  bg-flashWhite dark:bg-nightBlack z-999 h-full xl:hidden transition-all duration-300 [&.is-menu-open]:right-0 py-12 px-8 overflow-y-scroll">
        <button
          className="absolute flex items-center justify-center w-9 h-9 text-sm text-white rounded-full close-menu top-4 right-4 bg-greyBlack"
          aria-label="Close Menu"
          onClick={toggleDrawer}
        >
          <LiaTimesSolid size={18} />
        </button>
        <div className="mb-6 text-lg font-medium text-black dark:text-white menu-title">
          {isRTL ? "منو" : "Menu"}
        </div>
        <ul className="space-y-5 font-normal main-menu">
          {siteSettings?.headersMenu?.map((menu, i) => (
            <li
              data-scroll-nav={i}
              className="relative group"
              key={menu?.id}
              onClick={() => {
                toggleDrawer();
                setActive(menu?.id);
              }}
            >
              <Link
                href={pathname === "/" ? menu?.selector : `/${menu?.selector}`}
                className="flex items-center space-x-2 group"
              >
                <span
                  className={`w-5 text-black dark:text-white ${
                    active === menu?.id ? "text-theme dark:text-theme" : ""
                  }`}
                >
                  {menu?.Icon}
                </span>
                <span
                  className={`group-hover:text-theme transition-colors ${
                    active === menu?.id ? "text-theme dark:text-white" : ""
                  }`}
                >
                  {navTranslationKeys[menu?.title] ? t(navTranslationKeys[menu?.title]) : menu?.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <br />
        <div className="mb-4 font-medium text-black dark:text-white menu-title text-md">
          {isRTL ? "ارتباط با ما" : "Get in Touch"}
        </div>
        <div className="flex items-center space-x-4 social-icons">
          {siteSettings?.socialMedias?.map((item, i) => (
            <Link
              href={item?.url}
              className="flex transition duration-200 hover:text-white"
              title={item?.tooltip}
              key={i}
            >
              {item?.Icon}
            </Link>
          ))}
        </div>
      </div>
    </Drawer>
  );
};

export default MobileNav;
