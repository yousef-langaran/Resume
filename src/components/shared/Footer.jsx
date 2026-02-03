import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-6 text-center lg:ml-auto footer-section max-w-content xl:max-2xl:max-w-50rem">
      <p className="mb-2">
        Copyright by
        <Link href="#" className="transition-colors">
          @domain.com
        </Link>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <Link href="/register" className="hover:text-theme transition">ثبت‌نام</Link>
        {" · "}
        <Link href="/login" className="hover:text-theme transition">ورود</Link>
        {" — رزومه خود را بسازید"}
      </p>
    </footer>
  );
};

export default Footer;
