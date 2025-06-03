import { Card, CardContent } from "@/components/ui/card";
import { Building2, Upload, Calendar, MapPin, BarChart3, DollarSign } from "lucide-react";

export default function Organizational() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-elegant">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <Building2 className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">معاینات سازمانی</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              پروفایل کارفرما/شرکت، آپلود اکسل لیست کارکنان، زمان‌بندی نمونه‌گیری حضوری و منزل، گزارش سلامت گروهی و نمودارها، مالی و مدیریت قراردادها
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Building2 className="text-blue-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">پروفایل شرکت</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Upload className="text-green-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">آپلود لیست کارکنان</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar className="text-purple-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">زمان‌بندی نمونه‌گیری</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="text-orange-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">گزارش سلامت گروهی</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="text-red-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">مدیریت قراردادها</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <MapPin className="text-indigo-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">نمونه‌گیری حضوری</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}