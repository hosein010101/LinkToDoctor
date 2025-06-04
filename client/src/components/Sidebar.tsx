import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { 
  ChartLine, 
  ClipboardList, 
  PlusCircle, 
  Truck, 
  Users, 
  TestTube2, 
  FileText, 
  Send, 
  History, 
  Package, 
  BarChart3, 
  Settings,
  Heart,
  UserCheck,
  MessageSquare,
  Bell,
  Building2,
  Calendar,
  MapPin,
  Stethoscope,
  Shield,
  UserCog,
  Briefcase,
  Clock,
  Star,
  Target,
  Workflow,
  Archive,
  Database,
  Activity
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  isMobile?: boolean;
}

const navigationSections = [
  {
    title: "داشبورد و مدیریت اصلی",
    items: [
      { path: "/", icon: ChartLine, label: "داشبورد اصلی", module: "dashboard", color: "text-blue-600", bgColor: "bg-blue-50" },
      { path: "/orders", icon: ClipboardList, label: "مدیریت سفارشات", module: "orders", color: "text-purple-600", bgColor: "bg-purple-50" },
      { path: "/new-order", icon: PlusCircle, label: "ثبت سفارش جدید", module: "new-order", color: "text-green-600", bgColor: "bg-green-50" },
    ]
  },
  {
    title: "بیماران و مراجعین",
    items: [
      { path: "/patients", icon: UserCheck, label: "سوابق و تاریخچه بیماران", module: "patients", color: "text-emerald-600", bgColor: "bg-emerald-50" },
      { path: "/crm", icon: MessageSquare, label: "مدیریت ارتباط با مشتریان (CRM)", module: "crm", color: "text-pink-600", bgColor: "bg-pink-50" },
      { path: "/organizational", icon: Building2, label: "معاینات سازمانی", module: "organizational", color: "text-indigo-600", bgColor: "bg-indigo-50" },
    ]
  },
  {
    title: "عملیات آزمایشگاه",
    items: [
      { path: "/collection", icon: Truck, label: "مدیریت نمونه‌گیری", module: "collection", color: "text-orange-600", bgColor: "bg-orange-50" },
      { path: "/sample-collection", icon: MapPin, label: "مدیریت نمونه‌گیری پیشرفته", module: "sample-collection", color: "text-rose-600", bgColor: "bg-rose-50" },
      { path: "/collectors", icon: Users, label: "پروفایل نمونه‌گیران", module: "collectors", color: "text-cyan-600", bgColor: "bg-cyan-50" },
      { path: "/test-packages", icon: TestTube2, label: "مدیریت پکیج‌های آزمایشگاهی", module: "test-packages", color: "text-violet-600", bgColor: "bg-violet-50" },
      { path: "/results", icon: FileText, label: "ورود نتایج آزمایش", module: "results", color: "text-teal-600", bgColor: "bg-teal-50" },
      { path: "/delivery", icon: Send, label: "تحویل نتایج", module: "delivery", color: "text-red-600", bgColor: "bg-red-50" },
    ]
  },
  {
    title: "موجودی و تجهیزات",
    items: [
      { path: "/inventory", icon: Package, label: "مدیریت موجودی", module: "inventory", color: "text-amber-600", bgColor: "bg-amber-50" },
      { path: "/equipment", icon: Stethoscope, label: "تجهیزات آزمایشگاه", module: "equipment", color: "text-slate-600", bgColor: "bg-slate-50" },
    ]
  },
  {
    title: "گزارشات و تحلیل",
    items: [
      { path: "/reports", icon: BarChart3, label: "گزارشات و تحلیل", module: "reports", color: "text-blue-700", bgColor: "bg-blue-50" },
      { path: "/exports", icon: Archive, label: "خروجی گزارشات (PDF/Excel)", module: "exports", color: "text-green-700", bgColor: "bg-green-50" },
      { path: "/notifications", icon: Bell, label: "اعلان‌ها و لاگ سیستم", module: "notifications", color: "text-yellow-600", bgColor: "bg-yellow-50" },
    ]
  },
  {
    title: "منابع انسانی",
    items: [
      { path: "/hr", icon: UserCog, label: "فهرست کارکنان", module: "hr", color: "text-indigo-700", bgColor: "bg-indigo-50" },
      { path: "/hr-shifts", icon: Clock, label: "مدیریت شیفت‌ها", module: "hr-shifts", color: "text-purple-700", bgColor: "bg-purple-50" },
      { path: "/hr-payroll", icon: Briefcase, label: "حقوق و دستمزد", module: "hr-payroll", color: "text-emerald-700", bgColor: "bg-emerald-50" },
      { path: "/hr-performance", icon: Star, label: "ارزیابی عملکرد", module: "hr-performance", color: "text-orange-700", bgColor: "bg-orange-50" },
    ]
  },
  {
    title: "تنظیمات سیستم",
    items: [
      { path: "/settings", icon: Settings, label: "تنظیمات آزمایشگاه", module: "settings", color: "text-gray-600", bgColor: "bg-gray-50" },
      { path: "/access-management", icon: Shield, label: "مدیریت دسترسی کاربران", module: "access-management", color: "text-red-700", bgColor: "bg-red-50" },
    ]
  }
];

export default function Sidebar({ collapsed, isMobile }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={`bg-white dark:bg-gray-900 shadow-elegant transition-all duration-300 min-h-screen border-l border-gray-200 dark:border-gray-700 ${
      isMobile 
        ? `fixed top-0 right-0 z-50 h-full ${collapsed ? '-translate-x-full' : 'translate-x-0'} w-80`
        : `${collapsed ? 'w-16' : 'w-80'}`
    }`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <Heart className="text-white" size={24} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">سامانه LinkToDoctor</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">مدیریت آزمایشگاه پیشرفته</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <div className={`group flex items-center p-3 rounded-xl transition-all duration-200 hover-lift cursor-pointer sidebar-item ${
                      isActive 
                        ? `${item.bgColor} ${item.color} shadow-md border border-current/20 active` 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}>
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isActive 
                          ? 'bg-white/80 shadow-sm' 
                          : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-600 dark:text-gray-400'}`} />
                      </div>
                      {!collapsed && (
                        <div className="mr-3 flex-1 min-w-0">
                          <span className="text-sm font-medium block truncate">{item.label}</span>
                          {isActive && (
                            <Badge variant="secondary" className="text-xs mt-1 bg-white/60">
                              فعال
                            </Badge>
                          )}
                        </div>
                      )}
                      {!collapsed && isActive && (
                        <div className="flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Status */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex-shrink-0">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 dark:text-white">سیستم آنلاین</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                آخرین بروزرسانی: {new Intl.DateTimeFormat('fa-IR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }).format(new Date())}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}