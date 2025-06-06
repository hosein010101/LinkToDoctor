import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Stethoscope, Shield, Users, TrendingUp } from "lucide-react";
import logoPath from "@assets/logo.png";

export default function Landing() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Simple credential check for demo
    if (formData.username === "haddadi" && formData.password === "Axayaco") {
      window.location.href = '/?bypass=true';
    } else {
      setError("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={logoPath} 
                alt="LinkToDoctor Logo" 
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">ورود به سامانه</CardTitle>
            <CardDescription className="text-gray-600">
              لطفاً اطلاعات خود را وارد کنید
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">
                  نام کاربری یا ایمیل
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="نام کاربری یا ایمیل خود را وارد کنید"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  رمز عبور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-11 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="رمز عبور خود را وارد کنید"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                    مرا به خاطر بسپار
                  </Label>
                </div>
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                ورود
              </Button>
            </form>

            <div className="text-center mt-6">
              <button
                onClick={() => setShowLogin(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                © ۱۴۰۳ سامانه LinkToDoctor - دکتر حسین هدادی
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <img 
              src={logoPath} 
              alt="LinkToDoctor Logo" 
              className="h-16 w-auto ml-4"
            />
          </div>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            سیستم جامع مدیریت آزمایشگاه پزشکی برای ارائه خدمات نمونه‌گیری در منزل
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => setShowLogin(true)}
          >
            ورود به سامانه
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-slate-900">مدیریت منابع انسانی</CardTitle>
              <CardDescription className="text-slate-600">
                مدیریت کامل کارکنان، کلکترها و دسترسی‌های سیستم
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <Stethoscope className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-slate-900">مدیریت آزمایشات</CardTitle>
              <CardDescription className="text-slate-600">
                ثبت سفارشات، نمونه‌گیری و ارائه نتایج آزمایشات
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-slate-900">گزارش‌گیری پیشرفته</CardTitle>
              <CardDescription className="text-slate-600">
                داشبورد تحلیلی و گزارشات عملکرد سیستم
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* About Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-slate-900">امنیت و اعتماد</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto">
              سامانه LinkToDoctor با استفاده از جدیدترین تکنولوژی‌های امنیتی و رعایت کامل استانداردهای پزشکی،
              محیطی ایمن و قابل اعتماد برای مدیریت اطلاعات حساس بیماران و آزمایشات فراهم می‌کند.
              تمامی داده‌ها با رمزنگاری پیشرفته محافظت شده و دسترسی‌ها بر اساس نقش کاربران کنترل می‌شود.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-500">
            © ۱۴۰۳ سامانه LinkToDoctor - دکتر حسین هدادی
          </p>
        </div>
      </div>
    </div>
  );
}