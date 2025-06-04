import { Card, CardContent } from "@/components/ui/card";
import { UserCheck, Phone, MapPin, Calendar, FileText, Heart } from "lucide-react";

export default function Patients() {
  return (
    <div className="space-y-6">
      <Card className="card-professional">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto">
              <UserCheck className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">سوابق و تاریخچه بیماران</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              مدیریت جامع اطلاعات بیماران، سوابق پزشکی، و تاریخچه آزمایشات
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="text-blue-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">سوابق پزشکی</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar className="text-green-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">تاریخچه مراجعات</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="text-purple-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">وضعیت سلامت</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Phone className="text-orange-600 w-6 h-6" />
                </div>
                <span className="text-sm text-gray-600">اطلاعات تماس</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}