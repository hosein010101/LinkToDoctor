import { Card, CardContent } from "@/components/ui/card";
import { TestTube2, Package, Edit, Plus, List, Target } from "lucide-react";

export default function TestPackages() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-elegant">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <TestTube2 className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت پکیج‌های آزمایشگاهی</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              ایجاد و ویرایش همه پکیج‌های آزمایش و دسته‌بندی‌ها، مدیریت تعرفه‌ها و قیمت‌گذاری خدمات آزمایشگاه
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Package className="text-blue-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">پکیج‌های آزمایش</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <List className="text-green-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">دسته‌بندی خدمات</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="text-purple-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">قیمت‌گذاری</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Edit className="text-orange-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">ویرایش خدمات</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Plus className="text-red-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">افزودن پکیج جدید</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TestTube2 className="text-indigo-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">مدیریت تعرفه</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}