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
    'header.confirmLogout': 'تأیید خروج',
    'header.logoutConfirmation': 'آیا مطمئن هستید که می‌خواهید از سامانه خارج شوید؟',
    'header.cancel': 'لغو',
    
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
    'sidebar.testReminders': 'یادآور آزمایش‌ها',
    'sidebar.insuranceApi': 'API بیمه',
    
    // Dashboard
    'dashboard.title': 'داشبورد اصلی',
    'dashboard.todayOrders': 'سفارشات امروز',
    'dashboard.pendingCollection': 'در انتظار نمونه‌گیری',
    'dashboard.readyResults': 'نتایج آماده',
    'dashboard.monthlyRevenue': 'درآمد ماهانه',
    'dashboard.recentOrders': 'سفارشات اخیر',
    'dashboard.viewAll': 'مشاهده همه',
    'dashboard.orderNumber': 'شماره سفارش',
    'dashboard.patient': 'بیمار',
    'dashboard.status': 'وضعیت',
    'dashboard.amount': 'مبلغ',
    'dashboard.registered': 'ثبت شده',
    'dashboard.collectionScheduled': 'نمونه‌گیری برنامه‌ریزی شده',
    'dashboard.collected': 'نمونه‌گیری شده',
    'dashboard.processing': 'در حال پردازش',
    'dashboard.completed': 'تکمیل شده',
    'dashboard.delivered': 'تحویل داده شده',
    
    // Common
    'common.save': 'ذخیره',
    'common.cancel': 'لغو',
    'common.edit': 'ویرایش',
    'common.delete': 'حذف',
    'common.add': 'افزودن',
    'common.search': 'جستجو',
    'common.filter': 'فیلتر',
    'common.export': 'خروجی',
    'common.import': 'ورودی',
    'common.print': 'چاپ',
    'common.close': 'بستن',
    'common.confirm': 'تأیید',
    'common.back': 'بازگشت',
    'common.next': 'بعدی',
    'common.previous': 'قبلی',
    'common.loading': 'در حال بارگذاری...',
    'common.noData': 'داده‌ای یافت نشد',
    'common.error': 'خطا',
    'common.success': 'موفقیت',
    'common.warning': 'هشدار',
    'common.info': 'اطلاعات',
    
    // Patients
    'patients.title': 'مدیریت بیماران',
    'patients.addNew': 'افزودن بیمار جدید',
    'patients.name': 'نام',
    'patients.nationalId': 'کد ملی',
    'patients.phone': 'تلفن',
    'patients.email': 'ایمیل',
    'patients.address': 'آدرس',
    'patients.birthDate': 'تاریخ تولد',
    'patients.gender': 'جنسیت',
    'patients.male': 'مرد',
    'patients.female': 'زن',
    
    // Orders
    'orders.title': 'مدیریت سفارشات',
    'orders.newOrder': 'سفارش جدید',
    'orders.orderDetails': 'جزئیات سفارش',
    'orders.services': 'خدمات',
    'orders.totalAmount': 'مبلغ کل',
    'orders.collectionDate': 'تاریخ نمونه‌گیری',
    'orders.collectionAddress': 'آدرس نمونه‌گیری',
    'orders.notes': 'یادداشت‌ها',
    'orders.priority': 'اولویت',
    'orders.urgent': 'فوری',
    'orders.high': 'بالا',
    'orders.normal': 'عادی',
    'orders.low': 'پایین',
    
    // Services
    'services.title': 'خدمات آزمایشگاه',
    'services.addService': 'افزودن خدمات جدید',
    'services.serviceName': 'نام خدمات',
    'services.code': 'کد',
    'services.category': 'دسته‌بندی',
    'services.price': 'قیمت',
    'services.sampleType': 'نوع نمونه',
    'services.turnaroundTime': 'زمان تحویل',
    'services.preparationInstructions': 'دستورالعمل آماده‌سازی',
    
    // Results
    'results.title': 'نتایج آزمایش‌ها',
    'results.patientResults': 'نتایج بیمار',
    'results.testName': 'نام آزمایش',
    'results.result': 'نتیجه',
    'results.normalRange': 'محدوده طبیعی',
    'results.unit': 'واحد',
    'results.status': 'وضعیت',
    'results.enteredAt': 'تاریخ ثبت',
    'results.reviewedBy': 'بررسی شده توسط',
    'results.pending': 'در انتظار',
    'results.completed': 'تکمیل شده',
    'results.reviewed': 'بررسی شده',
    'results.validated': 'تأیید شده',
    
    // Collectors
    'collectors.title': 'نمونه‌گیران',
    'collectors.addCollector': 'افزودن نمونه‌گیر جدید',
    'collectors.collectorName': 'نام نمونه‌گیر',
    'collectors.phone': 'تلفن',
    'collectors.status': 'وضعیت',
    'collectors.available': 'در دسترس',
    'collectors.busy': 'مشغول',
    'collectors.offline': 'آفلاین',
    'collectors.location': 'موقعیت',
    'collectors.assignedOrders': 'سفارشات تخصیص یافته',
    
    // Inventory
    'inventory.title': 'مدیریت انبار',
    'inventory.addItem': 'افزودن کالا',
    'inventory.itemName': 'نام کالا',
    'inventory.category': 'دسته‌بندی',
    'inventory.currentStock': 'موجودی فعلی',
    'inventory.minThreshold': 'حداقل موجودی',
    'inventory.supplier': 'تأمین‌کننده',
    'inventory.unit': 'واحد',
    'inventory.lastRestocked': 'آخرین تأمین',
    'inventory.lowStock': 'موجودی کم',
    
    // Settings
    'settings.title': 'تنظیمات سامانه',
    'settings.general': 'تنظیمات عمومی',
    'settings.notifications': 'اعلانات',
    'settings.security': 'امنیت',
    'settings.backup': 'پشتیبان‌گیری',
    'settings.language': 'زبان',
    'settings.theme': 'پوسته',
    'settings.lightMode': 'حالت روشن',
    'settings.darkMode': 'حالت تاریک',
    
    // AI Tools
    'ai.diagnosis': 'تشخیص هوشمند',
    'ai.testReminders': 'یادآور آزمایش‌ها',
    'ai.insuranceIntegration': 'تجمیع بیمه',
    'ai.dataAnalysis': 'تحلیل داده‌ها',
    'ai.recommendations': 'پیشنهادات',
    
    // Additional Keys for Orders
    'orders.orderCount': 'سفارش',
    'orders.totalOrders': 'سفارش کل',
    'orders.addNew': 'سفارش جدید',
    'dashboard.reports': 'گزارشات',
    
    // Activities
    'activities.newOrder': 'سفارش جدید ثبت شد',
    'activities.testApproved': 'نتایج آزمایش تایید شد',
    'activities.sampleCollected': 'نمونه‌گیری تکمیل شد',
    'activities.paymentReceived': 'پرداخت انجام شد',
    'activities.urgentOrder': 'سفارش فوری ثبت شد',
    'activities.doctor': 'دکتر',
    'activities.patient': 'بیمار',
    'activities.minutesAgo': 'دقیقه پیش',
    'activities.area': 'منطقه',
    'activities.amount': 'مبلغ',
    'activities.order': 'سفارش',
    'activities.emergencyTests': 'آزمایش اورژانسی',
    'activities.medicalCenter': 'مرکز درمانی',
    
    // Performers
    'performers.internal': 'داخلی',
    'performers.cardiology': 'قلب و عروق',
    'performers.endocrine': 'غدد',
    'performers.gynecology': 'زنان',
    
    // Months
    'months.farvardin': 'فروردین',
    'months.ordibehesht': 'اردیبهشت',
    'months.khordad': 'خرداد',
    'months.tir': 'تیر',
    'months.mordad': 'مرداد',
    'months.shahrivar': 'شهریور',
    
    // Chart
    'chart.monthlyOrders': 'سفارشات ماهانه',
    'chart.monthlyOrdersTrend': 'روند سفارشات ماهانه',
    'chart.testTypesDistribution': 'توزیع انواع آزمایش',
    'chart.weeklyRevenue': 'درآمد هفتگی',
    'chart.performanceMetrics': 'شاخص‌های عملکرد',
    

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
    'header.confirmLogout': 'Confirm Logout',
    'header.logoutConfirmation': 'Are you sure you want to logout from the system?',
    'header.cancel': 'Cancel',
    
    // Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.patients': 'Patients',
    'sidebar.orders': 'Orders',
    'sidebar.collectors': 'Collectors',
    'sidebar.services': 'Lab Services',
    'sidebar.results': 'Test Results',
    'sidebar.inventory': 'Inventory & Equipment',
    'sidebar.notifications': 'Notifications',
    'sidebar.settings': 'Settings',
    'sidebar.ai': 'AI & Innovation Tools',
    'sidebar.aiDiagnosis': 'Smart Diagnosis & Interpretation',
    'sidebar.testReminders': 'Test Reminders',
    'sidebar.insuranceApi': 'Insurance API',
    
    // Dashboard
    'dashboard.title': 'Main Dashboard',
    'dashboard.todayOrders': "Today's Orders",
    'dashboard.pendingCollection': 'Pending Collection',
    'dashboard.readyResults': 'Ready Results',
    'dashboard.monthlyRevenue': 'Monthly Revenue',
    'dashboard.recentOrders': 'Recent Orders',
    'dashboard.viewAll': 'View All',
    'dashboard.orderNumber': 'Order Number',
    'dashboard.patient': 'Patient',
    'dashboard.status': 'Status',
    'dashboard.amount': 'Amount',
    'dashboard.registered': 'Registered',
    'dashboard.collectionScheduled': 'Collection Scheduled',
    'dashboard.collected': 'Collected',
    'dashboard.processing': 'Processing',
    'dashboard.completed': 'Completed',
    'dashboard.delivered': 'Delivered',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.print': 'Print',
    'common.close': 'Close',
    'common.confirm': 'Confirm',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.loading': 'Loading...',
    'common.noData': 'No data found',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Information',
    
    // Patients
    'patients.title': 'Patient Management',
    'patients.addNew': 'Add New Patient',
    'patients.name': 'Name',
    'patients.nationalId': 'National ID',
    'patients.phone': 'Phone',
    'patients.email': 'Email',
    'patients.address': 'Address',
    'patients.birthDate': 'Birth Date',
    'patients.gender': 'Gender',
    'patients.male': 'Male',
    'patients.female': 'Female',
    
    // Orders
    'orders.title': 'Order Management',
    'orders.newOrder': 'New Order',
    'orders.orderDetails': 'Order Details',
    'orders.services': 'Services',
    'orders.totalAmount': 'Total Amount',
    'orders.collectionDate': 'Collection Date',
    'orders.collectionAddress': 'Collection Address',
    'orders.notes': 'Notes',
    'orders.priority': 'Priority',
    'orders.urgent': 'Urgent',
    'orders.high': 'High',
    'orders.normal': 'Normal',
    'orders.low': 'Low',
    
    // Services
    'services.title': 'Laboratory Services',
    'services.addService': 'Add New Service',
    'services.serviceName': 'Service Name',
    'services.code': 'Code',
    'services.category': 'Category',
    'services.price': 'Price',
    'services.sampleType': 'Sample Type',
    'services.turnaroundTime': 'Turnaround Time',
    'services.preparationInstructions': 'Preparation Instructions',
    
    // Results
    'results.title': 'Test Results',
    'results.patientResults': 'Patient Results',
    'results.testName': 'Test Name',
    'results.result': 'Result',
    'results.normalRange': 'Normal Range',
    'results.unit': 'Unit',
    'results.status': 'Status',
    'results.enteredAt': 'Entered At',
    'results.reviewedBy': 'Reviewed By',
    'results.pending': 'Pending',
    'results.completed': 'Completed',
    'results.reviewed': 'Reviewed',
    'results.validated': 'Validated',
    
    // Collectors
    'collectors.title': 'Sample Collectors',
    'collectors.addCollector': 'Add New Collector',
    'collectors.collectorName': 'Collector Name',
    'collectors.phone': 'Phone',
    'collectors.status': 'Status',
    'collectors.available': 'Available',
    'collectors.busy': 'Busy',
    'collectors.offline': 'Offline',
    'collectors.location': 'Location',
    'collectors.assignedOrders': 'Assigned Orders',
    
    // Inventory
    'inventory.title': 'Inventory Management',
    'inventory.addItem': 'Add Item',
    'inventory.itemName': 'Item Name',
    'inventory.category': 'Category',
    'inventory.currentStock': 'Current Stock',
    'inventory.minThreshold': 'Min Threshold',
    'inventory.supplier': 'Supplier',
    'inventory.unit': 'Unit',
    'inventory.lastRestocked': 'Last Restocked',
    'inventory.lowStock': 'Low Stock',
    
    // Settings
    'settings.title': 'System Settings',
    'settings.general': 'General Settings',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.backup': 'Backup',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.lightMode': 'Light Mode',
    'settings.darkMode': 'Dark Mode',
    
    // AI Tools
    'ai.diagnosis': 'Smart Diagnosis',
    'ai.testReminders': 'Test Reminders',
    'ai.insuranceIntegration': 'Insurance Integration',
    'ai.dataAnalysis': 'Data Analysis',
    'ai.recommendations': 'Recommendations',
    
    // Recent Activities
    'activities.newOrder': 'New Order Registered',
    'activities.testApproved': 'Test Results Approved',
    'activities.sampleCollected': 'Sample Collection Completed',
    'activities.paymentReceived': 'Payment Received',
    'activities.urgentOrder': 'Urgent Order Registered',
    'activities.minutesAgo': 'minutes ago',
    'activities.doctor': 'Dr.',
    'activities.patient': 'Patient',
    'activities.area': 'Area',
    'activities.amount': 'Amount',
    'activities.order': 'Order',
    'activities.emergencyTests': 'Emergency Tests',
    'activities.medicalCenter': 'Medical Center',
    
    // Performers & Chart Labels
    'performers.topDoctors': 'Top Doctors',
    'performers.orders': 'Orders',
    'performers.specialty': 'Specialty',
    'performers.internal': 'Internal Medicine',
    'performers.cardiology': 'Cardiology',
    'performers.endocrine': 'Endocrinology',
    'performers.gynecology': 'Gynecology',
    
    // Persian Months in English
    'months.farvardin': 'March',
    'months.ordibehesht': 'April',
    'months.khordad': 'May',
    'months.tir': 'June',
    'months.mordad': 'July',
    'months.shahrivar': 'August',
    
    // Chart Labels
    'chart.monthlyOrders': 'Monthly Orders',
    'chart.weeklyRevenue': 'Weekly Revenue',
    'chart.testCategories': 'Test Categories',
    
    // Additional Keys for Orders  
    'orders.orderCount': 'order',
    'orders.totalOrders': 'total orders',
    'orders.addNew': 'New Order',
    'dashboard.reports': 'Reports',
    
    // Additional Keys for Patients
    'patients.description': 'View and manage patient information',
    'patients.healthyStatus': 'Healthy',
    'patients.stableStatus': 'Stable',
    'patients.recoveringStatus': 'Recovering',
    'patients.criticalStatus': 'Critical',
  },
  ar: {
    // Header
    'header.search': 'بحث',
    'header.notifications': 'إشعارات',
    'header.messages': 'رسائل',
    'header.quickActions': 'إجراءات سريعة',
    'header.languageSelect': 'اختر اللغة',
    'header.newNotifications': 'إشعارات جديدة',
    'header.newMessages': 'رسائل جديدة',
    
    // Sidebar
    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.patients': 'المرضى',
    'sidebar.orders': 'الطلبات',
    'sidebar.services': 'الخدمات',
    'sidebar.collectors': 'جامعو العينات',
    'sidebar.results': 'النتائج',
    'sidebar.inventory': 'المخزون',
    'sidebar.notifications': 'الإشعارات',
    'sidebar.settings': 'الإعدادات',
    'sidebar.aiTools': 'أدوات الذكاء الاصطناعي',
    
    // Common
    'common.loading': 'جاري التحميل',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.all': 'الكل',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.add': 'إضافة',
    'common.actions': 'إجراءات',
    'common.status': 'الحالة',
    'common.date': 'التاريخ',
    'common.time': 'الوقت',
    'common.name': 'الاسم',
    'common.phone': 'الهاتف',
    'common.email': 'البريد الإلكتروني',
    'common.address': 'العنوان',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.close': 'إغلاق',
    
    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.todayOrders': 'طلبات اليوم',
    'dashboard.pendingCollection': 'في انتظار الجمع',
    'dashboard.readyResults': 'النتائج جاهزة',
    'dashboard.monthlyRevenue': 'الإيرادات الشهرية',
    'dashboard.recentOrders': 'الطلبات الأخيرة',
    'dashboard.quickActions': 'إجراءات سريعة',
    'dashboard.viewAll': 'عرض الكل',
    
    // Patients
    'patients.title': 'إدارة المرضى',
    'patients.addNew': 'مريض جديد',
    'patients.searchPlaceholder': 'البحث في المرضى...',
    'patients.nationalId': 'رقم الهوية',
    'patients.age': 'العمر',
    'patients.gender': 'الجنس',
    'patients.male': 'ذكر',
    'patients.female': 'أنثى',
    'patients.lastVisit': 'آخر زيارة',
    'patients.doctor': 'الطبيب',
    'patients.healthyStatus': 'سليم',
    'patients.stableStatus': 'مستقر',
    'patients.recoveringStatus': 'في مرحلة الشفاء',
    'patients.criticalStatus': 'حرج',
    
    // Orders
    'orders.title': 'إدارة الطلبات',
    'orders.addNew': 'طلب جديد',
    'orders.orderNumber': 'رقم الطلب',
    'orders.patient': 'المريض',
    'orders.totalAmount': 'المبلغ الإجمالي',
    'orders.priority': 'الأولوية',
    'orders.scheduledDate': 'التاريخ المحدد',
    'orders.collector': 'جامع العينات',
    'orders.registered': 'مسجل',
    'orders.collectionScheduled': 'مجدول للجمع',
    'orders.collected': 'تم الجمع',
    'orders.processing': 'قيد المعالجة',
    'orders.completed': 'مكتمل',
    'orders.delivered': 'تم التسليم',
    'orders.urgent': 'عاجل',
    'orders.high': 'عالي',
    'orders.normal': 'عادي',
    'orders.low': 'منخفض',
    'orders.orderCount': 'طلب',
    'orders.totalOrders': 'إجمالي الطلبات',
    
    // Services
    'services.title': 'كتالوج الخدمات المختبرية',
    'services.addService': 'خدمة جديدة',
    'services.code': 'الكود',
    'services.category': 'الفئة',
    'services.price': 'السعر',
    'services.sampleType': 'نوع العينة',
    'services.turnaroundTime': 'وقت التسليم',
    'services.preparationInstructions': 'تعليمات التحضير',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.profile': 'الملف الشخصي',
    'settings.notifications': 'الإشعارات',
    'settings.security': 'الأمان',
    'settings.language': 'اللغة',
    'settings.theme': 'المظهر',
    'settings.lightMode': 'الوضع الفاتح',
    'settings.darkMode': 'الوضع الداكن',
    
    // AI Tools
    'ai.diagnosis': 'التشخيص الذكي',
    'ai.testReminders': 'تذكيرات الاختبارات',
    'ai.insuranceIntegration': 'تكامل التأمين',
    'ai.dataAnalysis': 'تحليل البيانات',
    'ai.recommendations': 'التوصيات',
    
    // Recent Activities
    'activities.newOrder': 'طلب جديد مسجل',
    'activities.testApproved': 'نتائج الفحص معتمدة',
    'activities.sampleCollected': 'اكتملت عملية جمع العينات',
    'activities.paymentReceived': 'تم استلام الدفع',
    'activities.urgentOrder': 'طلب عاجل مسجل',
    'activities.minutesAgo': 'دقائق مضت',
    'activities.doctor': 'دكتور',
    'activities.patient': 'مريض',
    'activities.area': 'منطقة',
    'activities.amount': 'مبلغ',
    'activities.order': 'طلب',
    'activities.emergencyTests': 'فحوصات طارئة',
    'activities.medicalCenter': 'مركز طبي',
    
    // Performers & Chart Labels
    'performers.topDoctors': 'أفضل الأطباء',
    'performers.orders': 'طلبات',
    'performers.specialty': 'التخصص',
    'performers.internal': 'باطنية',
    'performers.cardiology': 'قلب وأوعية',
    'performers.endocrine': 'غدد',
    'performers.gynecology': 'نساء',
    
    // Persian Months in Arabic
    'months.farvardin': 'فروردين',
    'months.ordibehesht': 'أورديبهشت',
    'months.khordad': 'خرداد',
    'months.tir': 'تير',
    'months.mordad': 'مرداد',
    'months.shahrivar': 'شهريور',
    
    // Chart Labels
    'chart.monthlyOrders': 'الطلبات الشهرية',
    'chart.weeklyRevenue': 'الإيرادات الأسبوعية',
    'chart.testCategories': 'فئات الفحوصات',
    
    // Additional Keys for Orders
    'dashboard.reports': 'التقارير',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('fa');

  // Save language preference to localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['fa', 'en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document direction
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return (translations[language] as any)?.[key] || key;
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