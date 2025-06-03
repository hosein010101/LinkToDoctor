import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Lock, Key, Settings, UserCheck } from "lucide-react";

export default function AccessManagement() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-elegant">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت دسترسی کاربران</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              تخصیص کاربران به گروه‌های مجوز، تعریف دسترسی هر گروه به ماژول‌ها/عملیات به تفصیل (خواندن، نوشتن، حذف)، نقشه‌بندی کاربران به نقش‌ها
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">گروه‌های کاربری</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Lock className="text-green-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">سطوح دسترسی</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Key className="text-purple-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">مجوزهای خاص</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="text-orange-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">نقش‌های کاربری</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Settings className="text-red-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">تنظیمات امنیتی</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="text-indigo-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">کنترل دسترسی</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}