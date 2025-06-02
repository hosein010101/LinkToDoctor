import { Link, useLocation } from "wouter";
import { 
  ChartLine, 
  ClipboardList, 
  PlusCircle, 
  Truck, 
  Users, 
  List, 
  FileText, 
  Send, 
  History, 
  Package, 
  BarChart3, 
  Settings,
  FlaskRound
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

const navigationItems = [
  { path: "/", icon: ChartLine, label: "داشبورد اصلی", module: "dashboard" },
  { path: "/orders", icon: ClipboardList, label: "مدیریت سفارشات", module: "orders" },
  { path: "/new-order", icon: PlusCircle, label: "ثبت سفارش جدید", module: "new-order" },
  { path: "/collection", icon: Truck, label: "مدیریت نمونه‌گیری", module: "collection" },
  { path: "/collectors", icon: Users, label: "پروفایل نمونه‌گیران", module: "collectors" },
  { path: "/services", icon: List, label: "کاتالوگ خدمات", module: "services" },
  { path: "/results", icon: FileText, label: "ورود نتایج آزمایش", module: "results" },
  { path: "/delivery", icon: Send, label: "تحویل نتایج", module: "delivery" },
  { path: "/history", icon: History, label: "تاریخچه بیماران", module: "history" },
  { path: "/inventory", icon: Package, label: "مدیریت موجودی", module: "inventory" },
  { path: "/reports", icon: BarChart3, label: "گزارشات و تحلیل", module: "reports" },
  { path: "/settings", icon: Settings, label: "تنظیمات آزمایشگاه", module: "settings" },
];

export default function Sidebar({ collapsed }: SidebarProps) {
  const [location] = useLocation();

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 min-h-screen border-l border-gray-200 ${
      collapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-medical-teal rounded-lg flex items-center justify-center">
            <FlaskRound className="text-white" size={20} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-medical-text">آزمایشگاه پارس</h1>
              <p className="text-sm text-gray-500">سیستم مدیریت جامع</p>
            </div>
          )}
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <a className={`flex items-center p-3 rounded-lg hover:bg-medical-teal hover:text-white transition-colors ${
                isActive 
                  ? 'bg-medical-teal text-white' 
                  : 'text-gray-700'
              }`}>
                <Icon className={`w-5 h-5 ${collapsed ? '' : 'ml-3'}`} />
                {!collapsed && <span>{item.label}</span>}
              </a>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
