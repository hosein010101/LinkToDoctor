import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Menu,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
  Shield,
  Activity,
  Calendar,
  Clock,
  ChevronDown,
  Search,
  Bell,
  MessageSquare,
  User,
  Settings,
  Globe,
  Languages
} from "lucide-react";
import { 
  NotificationBellIcon,
  SearchIcon,
  MessagesIcon,
  UserProfileIcon,
  SettingsIcon,
  ThemeToggleIcon,
  LanguageIcon
} from "@/components/ui/custom-icons";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export default function TopBar({ onToggleSidebar }: TopBarProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage, t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const notifications = [
    { id: 1, title: t('notifications.newOrderRegistered'), time: t('notifications.twoMinutesAgo'), type: "order", unread: true },
    { id: 2, title: t('notifications.testResultsReady'), time: t('notifications.tenMinutesAgo'), type: "result", unread: true },
    { id: 3, title: t('notifications.samplingCompleted'), time: t('notifications.oneHourAgo'), type: "sample", unread: false },
  ];

  const languages = [
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  const messageCount = 5; // تعداد پیام‌های جدید

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
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 search-icon adaptive-icon" />
            <Input
              placeholder={t('header.search')}
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
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg flex items-center space-x-2 space-x-reverse px-3 py-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                  {languages.find(lang => lang.code === language)?.code.toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-2">
              <DropdownMenuLabel className="flex items-center space-x-2 space-x-reverse px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">
                <Languages className="w-4 h-4 text-blue-500" />
                <span>{t('header.languageSelect')}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-700" />
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className={`cursor-pointer m-1 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-sm ${
                    language === lang.code 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse w-full">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="flex-1 font-medium">{lang.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">{lang.code}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-red-600 hover:text-red-700 hover:bg-red-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg">
                <div className="relative">
                  <Bell className="w-5 h-5" fill="#FF0000" stroke="#FF0000" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-red-600 text-[10px] font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-3">
              <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">
                <span>{t('header.notifications')}</span>
                <Badge variant="secondary" className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">{unreadCount} {t('header.newNotifications')}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-700" />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="p-3 m-1 cursor-pointer rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                    <div className="flex items-start space-x-3 space-x-reverse w-full">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        notification.unread 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm' 
                          : 'bg-gray-300 dark:bg-gray-600'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          notification.unread 
                            ? 'text-gray-900 dark:text-gray-100' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-700" />
              <DropdownMenuItem className="text-center p-2 m-1">
                <Button variant="ghost" size="sm" className="w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
                  {t('header.viewAllNotifications')}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600 hover:bg-green-50 hover:shadow-sm dark:hover:bg-gray-800 transition-all duration-300 rounded-lg">
                <div className="relative">
                  <MessagesIcon className="w-5 h-5" />
                  {messageCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-green-600 text-[10px] font-bold">
                      {messageCount > 99 ? '99+' : messageCount}
                    </span>
                  )}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-3">
              <DropdownMenuLabel className="flex items-center justify-between px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">
                <span>{t('header.messages')}</span>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{messageCount} {t('header.newMessages')}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-700" />
              <Link href="/messages">
                <DropdownMenuItem className="m-1 px-3 py-3 cursor-pointer rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-sm transition-all duration-200">
                  <MessagesIcon className="w-5 h-5 ml-3 text-green-500" />
                  <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">{t('header.newMessages2')}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </DropdownMenuItem>
              </Link>
              <Link href="/reports">
                <DropdownMenuItem className="m-1 px-3 py-3 cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-sm transition-all duration-200">
                  <Activity className="w-5 h-5 ml-3 text-blue-500" />
                  <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">گزارش‌های فوری</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-700" />
              <DropdownMenuItem className="text-center p-2 m-1">
                <Button variant="ghost" size="sm" className="w-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  {t('header.viewAllMessages')}
                </Button>
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
            <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-3">
              <DropdownMenuLabel className="px-3 py-2 text-gray-900 dark:text-gray-100 font-semibold">{t('header.quickActions')}</DropdownMenuLabel>
              <DropdownMenuSeparator className="my-2 bg-gray-100 dark:bg-gray-700" />
              <DropdownMenuItem className="m-1 px-3 py-3 cursor-pointer rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-sm transition-all duration-200">
                <Calendar className="w-5 h-5 ml-3 text-purple-500" />
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">{t('header.samplingCalendar')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="m-1 px-3 py-3 cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-sm transition-all duration-200">
                <MessageSquare className="w-5 h-5 ml-3 text-blue-500" />
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">{t('header.newMessages2')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="m-1 px-3 py-3 cursor-pointer rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 hover:shadow-sm transition-all duration-200">
                <Shield className="w-5 h-5 ml-3 text-green-500" />
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">{t('header.securityReport')}</span>
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
                    <span className="font-medium text-gray-900 dark:text-gray-100">{user?.name || 'مهندس حسین حدادی'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('header.labManager')}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-4">
              {/* User Info Header */}
              <div className="flex items-center space-x-4 space-x-reverse p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl mb-4">
                <Avatar className="w-14 h-14 border-3 border-white shadow-lg">
                  <AvatarImage src="/avatars/dr-hadadi.jpg" alt="مهندس حسین حدادی" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">ح.ح</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{user?.name || 'مهندس حسین حدادی'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('header.labManager')}</p>
                  <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded-full">
                    {t('header.fullAccess')}
                  </Badge>
                </div>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                <Link href="/profile" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-xl transition-all duration-200 group w-full">
                  <UserProfileIcon className="w-5 h-5 text-blue-500 group-hover:text-blue-600 ml-3" />
                  <span className="flex-1 text-right">{t('header.userProfile')}</span>
                </Link>
                
                <Link href="/account-settings" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-xl transition-all duration-200 group w-full">
                  <SettingsIcon className="w-5 h-5 text-purple-500 group-hover:text-purple-600 ml-3" />
                  <span className="flex-1 text-right">{t('header.accountSettings')}</span>
                </Link>
                
                <Link href="/security-privacy" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 rounded-xl transition-all duration-200 group w-full">
                  <Shield className="w-5 h-5 text-green-500 group-hover:text-green-600 ml-3" />
                  <span className="flex-1 text-right">{t('header.securityPrivacy')}</span>
                </Link>
                
                <Link href="/account-settings" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300 rounded-xl transition-all duration-200 group w-full">
                  <LanguageIcon className="w-5 h-5 text-orange-500 group-hover:text-orange-600 ml-3" />
                  <span className="flex-1 text-right">{t('header.changeLanguage')}</span>
                </Link>
                
                <Link href="/help-support" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-700 dark:hover:text-indigo-300 rounded-xl transition-all duration-200 group w-full">
                  <HelpCircle className="w-5 h-5 text-indigo-500 group-hover:text-indigo-600 ml-3" />
                  <span className="flex-1 text-right">{t('header.helpSupport')}</span>
                </Link>
              </div>

              {/* Separator */}
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>

              {/* Logout Item */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-xl transition-all duration-200 group w-full">
                    <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-600 ml-3" />
                    <span className="flex-1 text-right">{t('header.logout')}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t('header.confirmLogout')}</DialogTitle>
                    <DialogDescription>
                      {t('header.logoutConfirmation')}
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex-row-reverse space-x-2 space-x-reverse">
                    <Button variant="outline">{t('header.cancel')}</Button>
                    <Button variant="destructive" onClick={logout}>
                      {t('header.logout')}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}