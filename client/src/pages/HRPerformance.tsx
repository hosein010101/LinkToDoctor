import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function HRPerformance() {
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-elegant">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center mx-auto">
              <Star className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ارزیابی عملکرد</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
              ارزیابی عملکرد پرسنل و تنظیمات منابع انسانی
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}