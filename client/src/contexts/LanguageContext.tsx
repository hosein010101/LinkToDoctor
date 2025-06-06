import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fa' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  fa: {
    // Header
    'header.search': 'جستجو در سامانه...',
    'header.notifications': 'اعلان‌ها',
    'header.messages': 'پیام‌ها',
    'header.quickActions': 'عملیات سریع',
    'header.languageSelect': 'انتخاب زبان',
    'header.newNotifications': 'جدید',
    'header.newMessages': 'جدید',
    'header.viewAllNotifications': 'مشاهده همه اعلان‌ها',
    'header.viewAllMessages': 'مشاهده همه پیام‌ها',
    'header.samplingCalendar': 'تقویم نمونه‌گیری',
    'header.newMessages2': 'پیام‌های جدید',
    'header.securityReport': 'گزارش امنیتی',
    'header.userProfile': 'پروفایل کاربری',
    'header.accountSettings': 'تنظیمات حساب',
    'header.securityPrivacy': 'امنیت و حریم خصوصی',
    'header.changeLanguage': 'تغییر زبان',
    'header.helpSupport': 'راهنما و پشتیبانی',
    'header.logout': 'خروج از سامانه',
    'header.fullAccess': 'دسترسی کامل',
    'header.labManager': 'مدیر آزمایشگاه',
    
    // Sidebar
    'sidebar.dashboard': 'داشبورد',
    'sidebar.patients': 'بیماران',
    'sidebar.orders': 'سفارشات',
    'sidebar.collectors': 'نمونه‌گیران',
    'sidebar.services': 'خدمات آزمایشگاه',
    'sidebar.results': 'نتایج آزمایش',
    'sidebar.inventory': 'انبار و تجهیزات',
    'sidebar.notifications': 'اعلانات',
    'sidebar.settings': 'تنظیمات',
    'sidebar.ai': 'ابزار های هوش مصنوعی و نواورانه',
    'sidebar.aiDiagnosis': 'تشخیص و تفسیر هوشمند',
    'sidebar.testReminders': 'یادآوری آزمایش‌های تکراری',
    'sidebar.insuranceAPI': 'مدیریت API بیمه',
    
    // Dashboard
    'dashboard.title': 'داشبورد مدیریت',
    'dashboard.todayOrders': 'سفارشات امروز',
    'dashboard.pendingCollection': 'در انتظار نمونه‌گیری',
    'dashboard.readyResults': 'نتایج آماده',
    'dashboard.monthlyRevenue': 'درآمد ماهانه',
    'dashboard.recentOrders': 'سفارشات اخیر',
    'dashboard.orderNumber': 'شماره سفارش',
    'dashboard.patient': 'بیمار',
    'dashboard.status': 'وضعیت',
    'dashboard.amount': 'مبلغ',
    'dashboard.actions': 'عملیات',
    'dashboard.view': 'مشاهده',
    'dashboard.edit': 'ویرایش',
    'dashboard.delete': 'حذف',
    'dashboard.registered': 'ثبت شده',
    'dashboard.collectionScheduled': 'زمان‌بندی شده',
    'dashboard.collected': 'نمونه‌گیری شده',
    'dashboard.processing': 'در حال پردازش',
    'dashboard.completed': 'تکمیل شده',
    'dashboard.delivered': 'تحویل داده شده',
    
    // Common
    'common.toman': 'تومان',
    'common.save': 'ذخیره',
    'common.cancel': 'لغو',
    'common.confirm': 'تأیید',
    'common.close': 'بستن',
    'common.loading': 'در حال بارگذاری...',
    'common.search': 'جستجو',
    'common.filter': 'فیلتر',
    'common.add': 'افزودن',
    'common.edit': 'ویرایش',
    'common.delete': 'حذف',
    'common.view': 'مشاهده',
    'common.name': 'نام',
    'common.phone': 'تلفن',
    'common.email': 'ایمیل',
    'common.address': 'آدرس',
    'common.date': 'تاریخ',
    'common.time': 'زمان',
    'common.price': 'قیمت',
    'common.total': 'مجموع',
    'common.yes': 'بله',
    'common.no': 'خیر',
  },
  en: {
    // Header
    'header.search': 'Search in system...',
    'header.notifications': 'Notifications',
    'header.messages': 'Messages',
    'header.quickActions': 'Quick Actions',
    'header.languageSelect': 'Select Language',
    'header.newNotifications': 'New',
    'header.newMessages': 'New',
    'header.viewAllNotifications': 'View All Notifications',
    'header.viewAllMessages': 'View All Messages',
    'header.samplingCalendar': 'Sampling Calendar',
    'header.newMessages2': 'New Messages',
    'header.securityReport': 'Security Report',
    'header.userProfile': 'User Profile',
    'header.accountSettings': 'Account Settings',
    'header.securityPrivacy': 'Security & Privacy',
    'header.changeLanguage': 'Change Language',
    'header.helpSupport': 'Help & Support',
    'header.logout': 'Logout',
    'header.fullAccess': 'Full Access',
    'header.labManager': 'Lab Manager',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.patients': 'Patients',
    'sidebar.orders': 'Orders',
    'sidebar.collectors': 'Collectors',
    'sidebar.services': 'Lab Services',
    'sidebar.results': 'Test Results',
    'sidebar.inventory': 'Inventory',
    'sidebar.notifications': 'Notifications',
    'sidebar.settings': 'Settings',
    'sidebar.ai': 'AI & Innovation Tools',
    'sidebar.aiDiagnosis': 'Smart Diagnosis & Interpretation',
    'sidebar.testReminders': 'Recurring Test Reminders',
    'sidebar.insuranceAPI': 'Insurance API Management',
    
    // Dashboard
    'dashboard.title': 'Management Dashboard',
    'dashboard.todayOrders': "Today's Orders",
    'dashboard.pendingCollection': 'Pending Collection',
    'dashboard.readyResults': 'Ready Results',
    'dashboard.monthlyRevenue': 'Monthly Revenue',
    'dashboard.recentOrders': 'Recent Orders',
    'dashboard.orderNumber': 'Order Number',
    'dashboard.patient': 'Patient',
    'dashboard.status': 'Status',
    'dashboard.amount': 'Amount',
    'dashboard.actions': 'Actions',
    'dashboard.view': 'View',
    'dashboard.edit': 'Edit',
    'dashboard.delete': 'Delete',
    'dashboard.registered': 'Registered',
    'dashboard.collectionScheduled': 'Collection Scheduled',
    'dashboard.collected': 'Collected',
    'dashboard.processing': 'Processing',
    'dashboard.completed': 'Completed',
    'dashboard.delivered': 'Delivered',
    
    // Common
    'common.toman': 'Toman',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
    'common.name': 'Name',
    'common.phone': 'Phone',
    'common.email': 'Email',
    'common.address': 'Address',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.price': 'Price',
    'common.total': 'Total',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  ar: {
    // Header
    'header.search': 'البحث في النظام...',
    'header.notifications': 'الإشعارات',
    'header.messages': 'الرسائل',
    'header.quickActions': 'العمليات السريعة',
    'header.languageSelect': 'اختيار اللغة',
    'header.newNotifications': 'جديد',
    'header.newMessages': 'جديد',
    'header.viewAllNotifications': 'عرض جميع الإشعارات',
    'header.viewAllMessages': 'عرض جميع الرسائل',
    'header.samplingCalendar': 'تقويم أخذ العينات',
    'header.newMessages2': 'رسائل جديدة',
    'header.securityReport': 'تقرير الأمان',
    'header.userProfile': 'الملف الشخصي',
    'header.accountSettings': 'إعدادات الحساب',
    'header.securityPrivacy': 'الأمان والخصوصية',
    'header.changeLanguage': 'تغيير اللغة',
    'header.helpSupport': 'المساعدة والدعم',
    'header.logout': 'تسجيل الخروج',
    'header.fullAccess': 'وصول كامل',
    'header.labManager': 'مدير المختبر',
    
    // Sidebar
    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.patients': 'المرضى',
    'sidebar.orders': 'الطلبات',
    'sidebar.collectors': 'جامعي العينات',
    'sidebar.services': 'خدمات المختبر',
    'sidebar.results': 'نتائج الفحوصات',
    'sidebar.inventory': 'المخزون',
    'sidebar.notifications': 'الإشعارات',
    'sidebar.settings': 'الإعدادات',
    'sidebar.ai': 'أدوات الذكاء الاصطناعي والابتكار',
    'sidebar.aiDiagnosis': 'التشخيص والتفسير الذكي',
    'sidebar.testReminders': 'تذكيرات الفحوصات المتكررة',
    'sidebar.insuranceAPI': 'إدارة واجهة برمجة التأمين',
    
    // Dashboard
    'dashboard.title': 'لوحة الإدارة',
    'dashboard.todayOrders': 'طلبات اليوم',
    'dashboard.pendingCollection': 'في انتظار جمع العينة',
    'dashboard.readyResults': 'النتائج الجاهزة',
    'dashboard.monthlyRevenue': 'الإيرادات الشهرية',
    'dashboard.recentOrders': 'الطلبات الأخيرة',
    'dashboard.orderNumber': 'رقم الطلب',
    'dashboard.patient': 'المريض',
    'dashboard.status': 'الحالة',
    'dashboard.amount': 'المبلغ',
    'dashboard.actions': 'العمليات',
    'dashboard.view': 'عرض',
    'dashboard.edit': 'تحرير',
    'dashboard.delete': 'حذف',
    'dashboard.registered': 'مسجل',
    'dashboard.collectionScheduled': 'مجدول الجمع',
    'dashboard.collected': 'تم الجمع',
    'dashboard.processing': 'قيد المعالجة',
    'dashboard.completed': 'مكتمل',
    'dashboard.delivered': 'تم التسليم',
    
    // Common
    'common.toman': 'تومان',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.close': 'إغلاق',
    'common.loading': 'جاري التحميل...',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.add': 'إضافة',
    'common.edit': 'تحرير',
    'common.delete': 'حذف',
    'common.view': 'عرض',
    'common.name': 'الاسم',
    'common.phone': 'الهاتف',
    'common.email': 'البريد الإلكتروني',
    'common.address': 'العنوان',
    'common.date': 'التاريخ',
    'common.time': 'الوقت',
    'common.price': 'السعر',
    'common.total': 'المجموع',
    'common.yes': 'نعم',
    'common.no': 'لا',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('fa');

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['fa', 'en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language to localStorage and update document direction
    localStorage.setItem('language', language);
    const dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  const dir = language === 'en' ? 'ltr' : 'rtl';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}