import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Shield, Users, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Stethoscope className="h-12 w-12 text-blue-600 ml-3" />
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              سامانه LinkToDoctor
            </h1>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            سیستم جامع مدیریت آزمایشگاه پزشکی برای ارائه خدمات نمونه‌گیری در منزل
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => window.location.href = '/api/login'}
          >
            ورود به سامانه
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-slate-900 dark:text-white">مدیریت منابع انسانی</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                مدیریت کامل کارکنان، کلکترها و دسترسی‌های سیستم
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Stethoscope className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-slate-900 dark:text-white">مدیریت آزمایشات</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                ثبت سفارشات، نمونه‌گیری و ارائه نتایج آزمایشات
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-slate-900 dark:text-white">گزارش‌گیری پیشرفته</CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300">
                داشبورد تحلیلی و گزارشات عملکرد سیستم
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* About Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-slate-900 dark:text-white">امنیت و اعتماد</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed max-w-3xl mx-auto">
              سامانه LinkToDoctor با استفاده از جدیدترین تکنولوژی‌های امنیتی و رعایت کامل استانداردهای پزشکی،
              محیطی ایمن و قابل اعتماد برای مدیریت اطلاعات حساس بیماران و آزمایشات فراهم می‌کند.
              تمامی داده‌ها با رمزنگاری پیشرفته محافظت شده و دسترسی‌ها بر اساس نقش کاربران کنترل می‌شود.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400">
            © ۱۴۰۳ سامانه LinkToDoctor - دکتر حسین هدادی
          </p>
        </div>
      </div>
    </div>
  );
}