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
  Heart,
  CheckSquare,
  Activity
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
  const [expandedSections, setExpandedSections] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8]);

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
      color: "#7dd3fc",
      items: [
        { icon: LayoutDashboard, label: "داشبورد اصلی", path: "/", color: "#7dd3fc" },
        { icon: ShoppingCart, label: "مدیریت سفارشات", path: "/orders", color: "#6ee7b7" },
        { icon: Plus, label: "ثبت سفارش جدید", path: "/new-order", color: "#c4b5fd" },
      ]
    },
    {
      title: "بیماران",
      icon: Users,
      color: "#5eead4",
      items: [
        { icon: Users, label: "بیماران و مراجعین", path: "/patients", color: "#5eead4" },
        { icon: History, label: "سوابق و تاریخچه بیماران", path: "/history", color: "#cbd5e1" },
        { icon: UserPlus, label: "مدیریت ارتباط با مشتریان (CRM)", path: "/crm", color: "#fdba74" },
        { icon: BarChart3, label: "گزارش نظرسنجی و پیگیری مشتریان", path: "/survey-reports", color: "#f472b6" },
      ]
    },
    {
      title: "سازمان‌ها",
      icon: Building2,
      color: "#a5b4fc",
      items: [
        { icon: Building2, label: "معاینات سازمانی", path: "/organizational", color: "#a5b4fc" },
      ]
    },
    {
      title: "عملیات آزمایشگاه",
      icon: TestTube,
      color: "#67e8f9",
      items: [
        { icon: Stethoscope, label: "مدیریت نمونه‌گیری پیشرفته", path: "/sample-collection", color: "#f9a8d4" },
        { icon: Users, label: "پروفایل نمونه‌گیران", path: "/collector-profiles", color: "#fcd34d" },
        { icon: TestTube, label: "مدیریت پکیج‌های آزمایشگاهی", path: "/test-packages", color: "#6ee7b7" },
        { icon: Microscope, label: "ورود نتایج آزمایش", path: "/results", color: "#c4b5fd" },
        { icon: Truck, label: "تحویل نتایج", path: "/delivery", color: "#fda4af" },
      ]
    },
    {
      title: "موجودی",
      icon: Package,
      color: "#bef264",
      items: [
        { icon: Package, label: "مدیریت موجودی", path: "/inventory", color: "#bef264" },
        { icon: Wrench, label: "تجهیزات آزمایشگاه", path: "/equipment", color: "#cbd5e1" },
      ]
    },
    {
      title: "گزارشات",
      icon: BarChart3,
      color: "#60a5fa",
      items: [
        { icon: BarChart3, label: "گزارشات ساده", path: "/reports", color: "#60a5fa" },
        { icon: Activity, label: "گزارشات و تحلیل پیشرفته", path: "/reports-analytics", color: "#34d399" },
        { icon: TrendingUp, label: "عملکرد هفتگی", path: "/weekly-performance", color: "#8b5cf6" },
        { icon: FileText, label: "خروجی گزارشات (PDF/Excel)", path: "/exports", color: "#86efac" },
        { icon: Bell, label: "اعلان‌ها و لاگ سیستم", path: "/notifications", color: "#d8b4fe" },
      ]
    },
    {
      title: "مدیریت وظایف",
      icon: CheckSquare,
      color: "#d8b4fe",
      items: [
        { icon: CheckSquare, label: "فهرست وظایف", path: "/tasks", color: "#d8b4fe" },
      ]
    },
    {
      title: "منابع انسانی",
      icon: Users,
      color: "#5eead4",
      items: [
        { icon: Users, label: "خلاصه منابع انسانی", path: "/hr", color: "#5eead4" },
        { icon: Users, label: "فهرست کارکنان", path: "/employee-list", color: "#60a5fa" },
        { icon: Calendar, label: "مدیریت شیفت‌ها", path: "/hr-shifts", color: "#fdba74" },
        { icon: DollarSign, label: "حقوق و دستمزد", path: "/hr-payroll", color: "#a5b4fc" },
        { icon: TrendingUp, label: "ارزیابی عملکرد", path: "/hr-performance", color: "#67e8f9" },
      ]
    },
    {
      title: "تنظیمات",
      icon: Settings,
      color: "#d1d5db",
      items: [
        { icon: Settings, label: "تنظیمات آزمایشگاه", path: "/settings", color: "#d1d5db" },
        { icon: Shield, label: "مدیریت دسترسی کاربران", path: "/access-management", color: "#fda4af" },
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
        fixed right-0 top-0 h-full bg-white shadow-lg z-50 border-l border-gray-200
        ${isMobile ? 'absolute' : 'relative'}
      `}
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate={collapsed ? "collapsed" : "expanded"}
                className="mr-3"
              >
                <h1 className="text-lg font-bold text-gray-900">LinkToDoctor</h1>
                <p className="text-xs text-gray-500">سامانه آزمایشگاه</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-2 px-2">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-1 mb-6">
                {/* Separator Line */}
                {sectionIndex > 0 && !collapsed && (
                  <div className="border-t border-gray-200 my-4"></div>
                )}
                {/* Section Header */}
                {!collapsed && (
                  <motion.button
                    variants={contentVariants}
                    initial="collapsed"
                    animate={collapsed ? "collapsed" : "expanded"}
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex items-center justify-between p-4 text-base font-extrabold text-gray-800 hover:text-gray-900 transition-colors"
                  >
                    <div className="flex items-center group">
                      <section.icon className="w-6 h-6 ml-3 transition-all duration-300 group-hover:scale-110 group-hover:brightness-125 group-hover:drop-shadow-lg group-hover:animate-pulse" style={{color: section.color}} />
                      <span className="sidebar-section-header" data-section={section.title}>{section.title}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        expandedSections.includes(sectionIndex) ? 'rotate-180' : ''
                      }`}
                    />
                  </motion.button>
                )}

                {/* Section Items */}
                <AnimatePresence>
                  {(collapsed || expandedSections.includes(sectionIndex)) && (
                    <motion.div
                      initial={collapsed ? {} : { height: 0, opacity: 0 }}
                      animate={collapsed ? {} : { height: "auto", opacity: 1 }}
                      exit={collapsed ? {} : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 mt-2 pl-6 border-r-2 border-gray-100"
                    >
                      {section.items.map((item, itemIndex) => {
                        const Icon = item.icon;
                        const isActive = location === item.path;
                        
                        return (
                          <Link key={itemIndex} href={item.path}>
                            <motion.div
                              className={`
                                flex items-center p-2 rounded-lg cursor-pointer transition-all duration-200
                                ${isActive 
                                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                                  : 'hover:bg-gray-50'
                                }
                                ${collapsed ? 'justify-center' : 'justify-start'}
                              `}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <Icon className="w-5 h-5 transition-colors" style={{color: item.color}} />
                                {!collapsed && (
                                  <motion.span
                                    variants={contentVariants}
                                    initial="collapsed"
                                    animate={collapsed ? "collapsed" : "expanded"}
                                    className={`text-sm font-medium ${
                                      isActive ? 'text-blue-600' : 'text-gray-700'
                                    }`}
                                  >
                                    {item.label}
                                  </motion.span>
                                )}
                              </div>
                            </motion.div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          {!collapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate={collapsed ? "collapsed" : "expanded"}
              className="text-center"
            >
              <p className="text-xs text-gray-500">سامانه LinkToDoctor</p>
              <p className="text-xs text-gray-400">نسخه ۱.۰.۰</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}