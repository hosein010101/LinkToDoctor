import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Shield, 
  Clock, 
  Activity,
  HelpCircle,
  Settings,
  FileText,
  Users
} from "lucide-react";

export default function Footer() {
  const currentTime = new Date().toLocaleTimeString('fa-IR', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });
  
  const currentDate = new Date().toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <footer className="dashboard-footer">
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Company Info */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="text-white w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">سامانه LinkToDoctor</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">مدیریت آزمایشگاه پیشرفته</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600 dark:text-gray-300">
              <Phone className="w-3 h-3" />
              <span>۰۲۱-۴۴۵۶۷۸۹۰</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600 dark:text-gray-300">
              <Mail className="w-3 h-3" />
              <span>support@linktodoctor.ir</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600 dark:text-gray-300">
              <MapPin className="w-3 h-3" />
              <span>تهران، خیابان ولیعصر</span>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">سیستم آنلاین</span>
              <Badge variant="outline" className="text-xs">
                <Activity className="w-3 h-3 ml-1" />
                فعال
              </Badge>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500 dark:text-gray-400">
              <Globe className="w-3 h-3" />
              <span>ساعت: {currentTime}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-end space-x-2 space-x-reverse">
            <Button size="sm" variant="ghost" className="text-xs h-8 px-2">
              <HelpCircle className="w-3 h-3 ml-1" />
              راهنما
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-8 px-2">
              <FileText className="w-3 h-3 ml-1" />
              مستندات
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-8 px-2">
              <Users className="w-3 h-3 ml-1" />
              پشتیبانی
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-8 px-2">
              <Settings className="w-3 h-3 ml-1" />
              تنظیمات
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-8 px-2">
              <Shield className="w-3 h-3 ml-1" />
              امنیت
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4 space-x-reverse">
            <span>© ۱۴۰۳ سامانه LinkToDoctor - دکتر حسین حدادی</span>
            <span>نسخه ۲.۱.۰</span>
            <Badge variant="outline" className="text-xs">
              SSL محافظت شده
            </Badge>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <span>کاربران آنلاین: ۱۲</span>
            <span>آخرین بروزرسانی: ۱۴۰۳/۰۶/۱۵</span>
            <span>پایگاه داده: متصل</span>
          </div>
        </div>
      </div>
    </footer>
  );
}