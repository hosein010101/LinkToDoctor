import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, Bell, Target, BarChart3, Mail } from "lucide-react";

export default function CRM() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-elegant">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <MessageSquare className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت ارتباط با مشتریان (CRM)</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              فهرست مخاطبین، پیگیری‌ها، پیامک‌های انبوه و شخصی، تحلیل چرخه زندگی مشتری، مدیریت بیماران VIP، تیکت پشتیبانی، کمپین‌های خودکار، گزارش عملکرد اپراتورها
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">فهرست مخاطبین</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Bell className="text-green-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">پیامک انبوه</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="text-purple-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">بیماران VIP</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="text-orange-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">تحلیل مشتری</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Mail className="text-red-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">کمپین خودکار</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="text-indigo-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">تیکت پشتیبانی</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}