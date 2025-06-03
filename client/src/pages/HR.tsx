import { Card, CardContent } from "@/components/ui/card";
import { UserCog, Users, FileText, Award, GraduationCap, Calendar } from "lucide-react";

export default function HR() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-elegant">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <UserCog className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">فهرست کارکنان</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              مدیریت جامع منابع انسانی - فهرست کارکنان (پزشک، پرستار، نمونه‌گیر، مالی و...)، پروفایل پرسنلی با مدارک و سوابق
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="text-blue-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">فهرست پرسنل</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="text-green-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">مدارک و سوابق</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Award className="text-purple-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">تخصص‌ها</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <GraduationCap className="text-orange-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">آموزش</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar className="text-red-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">سابقه کار</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <UserCog className="text-indigo-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">مدیریت پرسنل</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}