import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Plus, 
  Users, 
  ClipboardList, 
  TestTube, 
  Truck, 
  Package, 
  BarChart3, 
  Settings,
  UserPlus,
  Building2,
  Stethoscope,
  Microscope,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  History,
  Bell,
  Wrench,
  ChevronDown,
  ChevronLeft,
  Heart
} from "lucide-react";
import logoPath from "@assets/logo_1749113951949.png";

interface SidebarProps {
  collapsed: boolean;
  isMobile?: boolean;
}

interface NavItem {
  icon: any;
  label: string;
  path: string;
  color: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
  icon: any;
  color: string;
}

export default function Sidebar({ collapsed, isMobile }: SidebarProps) {
  const [location] = useLocation();
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (sectionIndex: number) => {
    if (collapsed) return;
    setExpandedSections(prev => 
      prev.includes(sectionIndex) 
        ? prev.filter(i => i !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };

  const navSections: NavSection[] = [
    {
      title: "اصلی",
      icon: LayoutDashboard,
      color: "text-blue-500",
      items: [
        { icon: LayoutDashboard, label: "داشبورد اصلی", path: "/", color: "text-blue-500" },
        { icon: ShoppingCart, label: "مدیریت سفارشات", path: "/orders", color: "text-emerald-500" },
        { icon: Plus, label: "ثبت سفارش جدید", path: "/new-order", color: "text-violet-500" },
      ]
    },
    {
      title: "بیماران",
      icon: Users,
      color: "text-teal-500",
      items: [
        { icon: Users, label: "بیماران و مراجعین", path: "/patients", color: "text-teal-500" },
        { icon: History, label: "سوابق و تاریخچه بیماران", path: "/history", color: "text-slate-500" },
        { icon: UserPlus, label: "مدیریت ارتباط با مشتریان (CRM)", path: "/crm", color: "text-orange-500" },
      ]
    },
    {
      title: "سازمان‌ها",
      icon: Building2,
      color: "text-indigo-500",
      items: [
        { icon: Building2, label: "معاینات سازمانی", path: "/organizational", color: "text-indigo-500" },
      ]
    },
    {
      title: "عملیات آزمایشگاه",
      icon: TestTube,
      color: "text-cyan-500",
      items: [
        { icon: ClipboardList, label: "مدیریت نمونه‌گیری", path: "/collection", color: "text-cyan-500" },
        { icon: Stethoscope, label: "مدیریت نمونه‌گیری پیشرفته", path: "/sample-collection", color: "text-pink-500" },
        { icon: Users, label: "پروفایل نمونه‌گیران", path: "/collectors", color: "text-amber-500" },
        { icon: TestTube, label: "مدیریت پکیج‌های آزمایشگاهی", path: "/test-packages", color: "text-emerald-500" },
        { icon: Microscope, label: "ورود نتایج آزمایش", path: "/results", color: "text-violet-500" },
        { icon: Truck, label: "تحویل نتایج", path: "/delivery", color: "text-rose-500" },
      ]
    },
    {
      title: "موجودی",
      icon: Package,
      color: "text-lime-500",
      items: [
        { icon: Package, label: "مدیریت موجودی", path: "/inventory", color: "text-lime-500" },
        { icon: Wrench, label: "تجهیزات آزمایشگاه", path: "/equipment", color: "text-slate-500" },
      ]
    },
    {
      title: "گزارشات",
      icon: BarChart3,
      color: "text-blue-600",
      items: [
        { icon: BarChart3, label: "گزارشات و تحلیل", path: "/reports", color: "text-blue-600" },
        { icon: FileText, label: "خروجی گزارشات (PDF/Excel)", path: "/exports", color: "text-green-600" },
        { icon: Bell, label: "اعلان‌ها و لاگ سیستم", path: "/notifications", color: "text-purple-600" },
      ]
    },
    {
      title: "منابع انسانی",
      icon: Users,
      color: "text-teal-600",
      items: [
        { icon: Users, label: "فهرست کارکنان", path: "/hr", color: "text-teal-600" },
        { icon: Calendar, label: "مدیریت شیفت‌ها", path: "/hr-shifts", color: "text-orange-600" },
        { icon: DollarSign, label: "حقوق و دستمزد", path: "/hr-payroll", color: "text-indigo-600" },
        { icon: TrendingUp, label: "ارزیابی عملکرد", path: "/hr-performance", color: "text-cyan-600" },
      ]
    },
    {
      title: "تنظیمات",
      icon: Settings,
      color: "text-gray-600",
      items: [
        { icon: Settings, label: "تنظیمات آزمایشگاه", path: "/settings", color: "text-gray-600" },
        { icon: Shield, label: "مدیریت دسترسی کاربران", path: "/access-management", color: "text-red-600" },
      ]
    }
  ];

  const sidebarVariants = {
    expanded: { width: 320 },
    collapsed: { width: 64 }
  };

  const contentVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: 20 }
  };

  return (
    <motion.div 
      className={`
        fixed top-0 right-0 h-screen bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 
        z-50 shadow-xl overflow-hidden
        ${isMobile && collapsed ? '-translate-x-full' : 'translate-x-0'}
      `}
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-l from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-center justify-center">
          {!collapsed ? (
            <motion.div 
              className="text-center"
              variants={contentVariants}
              animate={collapsed ? "collapsed" : "expanded"}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <div className="flex items-center justify-center mb-3">
                <img 
                  src={logoPath} 
                  alt="LinkToDoctor" 
                  className="h-12 w-auto max-w-full object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">سامانه جامع سلامت الکترونیک</p>
            </motion.div>
          ) : (
            <div className="w-12 h-12 rounded-xl flex items-center justify-center">
              <img 
                src={logoPath} 
                alt="LinkToDoctor" 
                className="h-8 w-auto max-w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-2">
        {navSections.map((section, sectionIndex) => {
          const SectionIcon = section.icon;
          const isExpanded = expandedSections.includes(sectionIndex);
          const hasActiveItem = section.items.some(item => location === item.path);
          
          return (
            <div key={sectionIndex} className="relative">
              {/* Section Header */}
              {!collapsed && (
                <motion.button
                  onClick={() => toggleSection(sectionIndex)}
                  className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 group
                    ${hasActiveItem 
                      ? 'bg-gradient-to-l from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800' 
                      : 'bg-gradient-to-l from-gray-50 via-slate-50 to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 hover:from-blue-50 hover:via-indigo-50 hover:to-purple-50 dark:hover:from-blue-900/10 dark:hover:via-indigo-900/10 dark:hover:to-purple-900/10'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                      ${hasActiveItem ? 'bg-white shadow-sm' : 'bg-white/60 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'}
                    `}>
                      <SectionIcon className={`w-4 h-4 ${section.color}`} />
                    </div>
                    <span className={`text-sm font-semibold ${hasActiveItem ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                      {section.title}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 0 : -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.div>
                </motion.button>
              )}

              {/* Section Items */}
              <AnimatePresence>
                {(collapsed || isExpanded) && (
                  <motion.div
                    initial={collapsed ? {} : { height: 0, opacity: 0 }}
                    animate={collapsed ? {} : { height: "auto", opacity: 1 }}
                    exit={collapsed ? {} : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={collapsed ? "space-y-1" : "mt-2 space-y-1 pr-4"}
                  >
                    {section.items.map((item, itemIndex) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;
                      
                      return (
                        <Link key={itemIndex} href={item.path}>
                          <motion.div 
                            className={`
                              group flex items-center p-3 rounded-lg transition-all duration-200 cursor-pointer relative
                              ${isActive 
                                ? 'bg-white dark:bg-gray-800 shadow-md border-r-4 border-blue-500' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                              }
                            `}
                            whileHover={{ scale: 1.02, x: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className={`
                              flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm
                              ${isActive 
                                ? 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30' 
                                : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600'
                              }
                            `}>
                              <Icon className={`w-5 h-5 ${item.color}`} />
                            </div>
                            
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.div 
                                  className="mr-3 flex-1 min-w-0"
                                  variants={contentVariants}
                                  animate="expanded"
                                  exit="collapsed"
                                  transition={{ duration: 0.2 }}
                                >
                                  <span className={`text-sm font-medium block truncate ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {item.label}
                                  </span>
                                  {isActive && (
                                    <motion.div 
                                      className="flex items-center mt-1 space-x-2 space-x-reverse"
                                      initial={{ opacity: 0, y: -5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: 0.1 }}
                                    >
                                      <div className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')} animate-pulse`}></div>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">فعال</span>
                                    </motion.div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {isActive && (
                              <motion.div
                                className="absolute left-2 top-1/2 -translate-y-1/2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              >
                                <ChevronLeft className="w-4 h-4 text-blue-500" />
                              </motion.div>
                            )}
                          </motion.div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Section Separator */}
              {!collapsed && sectionIndex < navSections.length - 1 && (
                <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Brand */}
      {!collapsed && (
        <motion.div 
          className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-l from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700"
          variants={contentVariants}
          animate="expanded"
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              طراحی شده برای دکتر حسین حدادی
            </p>
            <div className="flex items-center justify-center mt-2 space-x-1 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">سیستم آنلاین</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}