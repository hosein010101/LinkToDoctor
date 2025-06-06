import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
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
import logoPath from "@assets/logo_1749306236433.png";

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
  const { t } = useLanguage();
  // Initialize with empty array - all sections collapsed by default
  const [expandedSections, setExpandedSections] = useState<number[]>(() => {
    // Try to load from localStorage, default to empty array
    try {
      const saved = localStorage.getItem('sidebar-expanded-sections');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save expanded sections to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sidebar-expanded-sections', JSON.stringify(expandedSections));
    } catch {
      // Ignore localStorage errors
    }
  }, [expandedSections]);

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
      title: t('sidebar.dashboard'),
      icon: LayoutDashboard,
      color: "#7dd3fc",
      items: [
        { icon: LayoutDashboard, label: t('sidebar.dashboard'), path: "/", color: "#7dd3fc" },
        { icon: ShoppingCart, label: t('sidebar.orders'), path: "/orders", color: "#6ee7b7" },
        { icon: Plus, label: t('orders.newOrder'), path: "/new-order", color: "#c4b5fd" },
      ]
    },
    {
      title: t('sidebar.patients'),
      icon: Users,
      color: "#5eead4",
      items: [
        { icon: Users, label: t('sidebar.patients'), path: "/patients", color: "#5eead4" },
        { icon: History, label: t('patients.title'), path: "/history", color: "#cbd5e1" },
        { icon: UserPlus, label: t('sidebar.crm'), path: "/crm", color: "#fdba74" },
        { icon: BarChart3, label: t('dashboard.recentOrders'), path: "/survey-reports", color: "#f472b6" },
      ]
    },
    {
      title: t('organizations.title') || "Organizations",
      icon: Building2,
      color: "#a5b4fc",
      items: [
        { icon: Building2, label: t('organizations.organizational') || "Organizational Checkups", path: "/organizational", color: "#a5b4fc" },
      ]
    },
    {
      title: t('services.title'),
      icon: TestTube,
      color: "#67e8f9",
      items: [
        { icon: Stethoscope, label: t('sidebar.collectors'), path: "/sample-collection", color: "#f9a8d4" },
        { icon: Users, label: t('collectors.title'), path: "/collector-profiles", color: "#fcd34d" },
        { icon: TestTube, label: t('services.title'), path: "/test-packages", color: "#6ee7b7" },
        { icon: Microscope, label: t('sidebar.results'), path: "/results", color: "#c4b5fd" },
        { icon: Truck, label: t('delivery.title') || "Delivery", path: "/delivery", color: "#fda4af" },
      ]
    },
    {
      title: t('sidebar.inventory'),
      icon: Package,
      color: "#bef264",
      items: [
        { icon: Package, label: t('inventory.title'), path: "/inventory", color: "#bef264" },
        { icon: Wrench, label: t('equipment.title') || "Equipment", path: "/equipment", color: "#cbd5e1" },
      ]
    },
    {
      title: t('reports.title') || "Reports",
      icon: BarChart3,
      color: "#60a5fa",
      items: [
        { icon: BarChart3, label: t('reports.simple') || "Simple Reports", path: "/reports", color: "#60a5fa" },
        { icon: Activity, label: t('reports.analytics') || "Analytics", path: "/reports-analytics", color: "#34d399" },
        { icon: TrendingUp, label: t('reports.performance') || "Performance", path: "/weekly-performance", color: "#8b5cf6" },
        { icon: Bell, label: t('sidebar.notifications'), path: "/notifications", color: "#d8b4fe" },
      ]
    },
    {
      title: t('tasks.title') || "Task Management",
      icon: CheckSquare,
      color: "#d8b4fe",
      items: [
        { icon: CheckSquare, label: t('tasks.list') || "Task List", path: "/tasks", color: "#d8b4fe" },
      ]
    },
    {
      title: t('hr.title') || "Human Resources",
      icon: Users,
      color: "#5eead4",
      items: [
        { icon: Users, label: t('hr.summary') || "HR Summary", path: "/hr", color: "#5eead4" },
        { icon: Users, label: t('hr.employees') || "Employee List", path: "/employee-list", color: "#60a5fa" },
        { icon: Calendar, label: t('hr.shifts') || "Shift Management", path: "/hr-shifts", color: "#fdba74" },
        { icon: DollarSign, label: t('hr.payroll') || "Payroll", path: "/hr-payroll", color: "#a5b4fc" },
        { icon: TrendingUp, label: t('hr.performance') || "Performance", path: "/hr-performance", color: "#67e8f9" },
      ]
    },
    {
      title: t('sidebar.ai'),
      icon: Activity,
      color: "#10b981",
      items: [
        { icon: Activity, label: t('sidebar.aiDiagnosis'), path: "/ai-diagnosis", color: "#10b981" },
        { icon: Calendar, label: t('sidebar.testReminders'), path: "/test-reminders", color: "#3b82f6" },
        { icon: Shield, label: t('sidebar.insuranceApi'), path: "/insurance-api", color: "#8b5cf6" },
      ]
    },
    {
      title: t('sidebar.settings'),
      icon: Settings,
      color: "#d1d5db",
      items: [
        { icon: Settings, label: t('settings.title'), path: "/settings", color: "#d1d5db" },
        { icon: Shield, label: t('settings.security'), path: "/access-management", color: "#fda4af" },
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
            {!collapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate={collapsed ? "collapsed" : "expanded"}
                className="flex flex-col items-center justify-center w-full"
              >
                <img 
                  src={logoPath} 
                  alt="LinkToDoctor Logo" 
                  className="h-16 w-auto object-contain mb-2"
                />
                <p className="text-xs text-gray-600 text-center leading-tight">
                  {t('header.systemName')}
                </p>
              </motion.div>
            )}
            {collapsed && (
              <img 
                src={logoPath} 
                alt="LinkToDoctor Logo" 
                className="w-10 h-10 object-contain"
              />
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