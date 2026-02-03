const steps = [
  {
    step: "۱",
    title: "ثبت‌نام کنید",
    description: "با ایمیل یک حساب رایگان بسازید و اسلاگ دلخواه برای آدرس رزومه خود انتخاب کنید.",
  },
  {
    step: "۲",
    title: "اطلاعات را پر کنید",
    description: "از داشبورد، پروفایل، سابقه کاری، مهارت‌ها، پروژه‌ها و بقیه بخش‌ها را تکمیل کنید.",
  },
  {
    step: "۳",
    title: "لینک را به اشتراک بگذارید",
    description: "یک لینک ثابت مثل yoursite.com/resume/your-name دارید؛ آن را در شبکه‌های اجتماعی یا برای کارفرما بفرستید.",
  },
];

export default function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            در سه قدم ساده
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            از ثبت‌نام تا لینک رزومه، کمتر از چند دقیقه.
          </p>
        </div>
        <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
          {steps.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-theme text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-theme/30 mb-5">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-xs">
                {item.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-8 -left-1/2 w-full h-0.5 bg-gradient-to-l from-theme/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
