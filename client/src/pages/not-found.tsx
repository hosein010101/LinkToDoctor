import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowRight, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-lg mx-auto border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              صفحه پیدا نشد
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              متأسفانه صفحه‌ای که دنبال آن هستید وجود ندارد یا منتقل شده است.
              لطفاً آدرس را بررسی کنید یا به صفحه اصلی بازگردید.
            </p>
          </div>
          
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Home className="ml-2 w-4 h-4" />
                بازگشت به داشبورد
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full border-gray-200 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              onClick={() => window.history.back()}
            >
              <ArrowRight className="ml-2 w-4 h-4" />
              بازگشت به صفحه قبل
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              کد خطا: 404 | سامانه LinkToDoctor
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
