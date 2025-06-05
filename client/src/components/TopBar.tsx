import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Shield,
  Activity,
  MessageSquare,
  Calendar,
  Clock,
  ChevronDown
} from "lucide-react";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications] = useState([
    { id: 1, title: "سفارش جدید ثبت شد", time: "2 دقیقه پیش", type: "order", unread: true },
    { id: 2, title: "نتایج آزمایش آماده است", time: "10 دقیقه پیش", type: "result", unread: true },
    { id: 3, title: "نمونه‌گیری تکمیل شد", time: "1 ساعت پیش", type: "sample", unread: false },
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900 border-b border-slate-200 dark:border-gray-700 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        {/* Right Side - Menu Button */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-medical-secondary hover:text-medical-primary hover:bg-blue-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medical-muted" />
            <Input
              placeholder="جستجو در سامانه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pr-10 border-slate-200 bg-white/70 backdrop-blur-sm focus:border-medical-info focus:ring-medical-info/20 transition-all duration-200"
            />
          </div>
        </div>



        {/* Left Side - User Actions */}
        <div className="flex items-center space-x-3 space-x-reverse">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-medical-secondary hover:text-medical-primary hover:bg-orange-100 dark:hover:bg-gray-800 transition-all duration-200">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -left-1 w-5 h-5 p-0 text-xs bg-medical-error text-white rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>اعلان‌ها</span>
                <Badge variant="secondary" className="text-xs">{unreadCount} جدید</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="p-3 cursor-pointer">
                  <div className="flex items-start space-x-3 space-x-reverse w-full">
                    <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center p-2">
                <Button variant="ghost" size="sm" className="w-full">
                  مشاهده همه اعلان‌ها
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-medical-secondary hover:text-medical-primary hover:bg-green-100 dark:hover:bg-gray-800 transition-all duration-200">
                <Activity className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>عملیات سریع</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Calendar className="w-4 h-4 ml-2" />
                تقویم نمونه‌گیری
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="w-4 h-4 ml-2" />
                پیام‌های جدید
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="w-4 h-4 ml-2" />
                گزارش امنیتی
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="text-medical-secondary hover:text-medical-primary hover:bg-purple-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-auto px-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Avatar className="h-8 w-8 border-2 border-blue-500">
                    <AvatarImage src="/avatars/dr-hadadi.jpg" alt="دکتر حسین حدادی" />
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      ح.ح
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-end text-sm">
                    <span className="font-medium text-gray-900 dark:text-gray-100">دکتر حسین حدادی</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">مدیر آزمایشگاه</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="text-center">
                <div className="flex flex-col items-center space-y-2 py-2">
                  <Avatar className="h-16 w-16 border-4 border-blue-500">
                    <AvatarImage src="/avatars/dr-hadadi.jpg" alt="دکتر حسین حدادی" />
                    <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                      ح.ح
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">دکتر حسین حدادی</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">مدیر آزمایشگاه</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      دسترسی کامل
                    </Badge>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 ml-2" />
                پروفایل کاربری
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 ml-2" />
                تنظیمات حساب
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="w-4 h-4 ml-2" />
                امنیت و حریم خصوصی
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Globe className="w-4 h-4 ml-2" />
                تغییر زبان
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="w-4 h-4 ml-2" />
                راهنما و پشتیبانی
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                <LogOut className="w-4 h-4 ml-2" />
                خروج از سامانه
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}