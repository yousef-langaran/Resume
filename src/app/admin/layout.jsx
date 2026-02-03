export const metadata = {
  title: "پنل ادمین - رزومه",
  description: "مدیریت اطلاعات رزومه",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900/95" dir="rtl">
      {children}
    </div>
  );
}
