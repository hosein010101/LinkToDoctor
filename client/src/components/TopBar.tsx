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
  ChevronDown,
  Languages
} from "lucide-react";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("fa");
  const [notifications] = useState([
    { id: 1, title: "سفارش جدید ثبت شد", time: "2 دقیقه پیش", type: "order", unread: true },
    { id: 2, title: "نتایج آزمایش آماده است", time: "10 دقیقه پیش", type: "result", unread: true },
    { id: 3, title: "نمونه‌گیری تکمیل شد", time: "1 ساعت پیش", type: "sample", unread: false },
  ]);

  const languages = [
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 shadow-sm backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
      <div className="flex items-center justify-between h-full px-6">
        {/* Right Side - Menu Button */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="جستجو در سامانه..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pr-10 border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 rounded-lg"
            />
          </div>
        </div>



        {/* Left Side - User Actions */}
        <div className="flex items-center space-x-3 space-x-reverse">
          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg flex items-center space-x-1 space-x-reverse">
                <Globe className="w-4 h-4" />
                <span className="text-xs font-medium hidden sm:block">
                  {languages.find(lang => lang.code === currentLanguage)?.flag}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="flex items-center space-x-2 space-x-reverse">
                <Languages className="w-4 h-4 text-blue-500" />
                <span>انتخاب زبان</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((language) => (
                <DropdownMenuItem 
                  key={language.code}
                  onClick={() => setCurrentLanguage(language.code)}
                  className={`cursor-pointer ${currentLanguage === language.code ? 'bg-blue-50 text-blue-700' : ''}`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse w-full">
                    <span className="text-lg">{language.flag}</span>
                    <span className="flex-1">{language.name}</span>
                    <span className="text-xs text-gray-500 uppercase">{language.code}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-orange-500 hover:text-orange-600 hover:bg-orange-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -left-1 w-5 h-5 p-0 text-xs bg-white text-red-500 border-2 border-red-500 rounded-full flex items-center justify-center animate-pulse shadow-sm">
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

          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600 hover:bg-green-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>پیام‌ها</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <MessageSquare className="w-4 h-4 ml-2" />
                پیام‌های جدید
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Activity className="w-4 h-4 ml-2" />
                گزارش‌های فوری
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Quick Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-purple-500 hover:text-purple-600 hover:bg-purple-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg">
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
            className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg"
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