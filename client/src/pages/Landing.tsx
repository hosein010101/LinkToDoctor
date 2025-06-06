import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import logoPath from "@assets/logo_1749113951949.png";

export default function Landing() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Redirect to Replit Auth login
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" dir="rtl">
      {/* Left Column - Login Form */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#2D3748]">ورود به سامانه</h1>
            <p className="mt-2 text-sm text-gray-600">
              لطفاً اطلاعات خود را وارد کنید
            </p>
          </div>

          <div className="space-y-6">
            {/* Authentication Notice */}
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h3 className="text-sm font-medium text-[#2563EB] mb-2">نحوه ورود به سیستم:</h3>
              <p className="text-xs text-gray-600 mb-3">
                برای ورود کامل، باید احراز هویت Replit در تنظیمات پروژه فعال شود
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => window.location.href = '/api/login'}
                  className="flex-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2 text-sm"
                >
                  ورود با Replit Auth
                </Button>
                <Button
                  onClick={() => window.location.href = '/?bypass=true'}
                  variant="outline"
                  className="flex-1 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white py-2 text-sm"
                >
                  مشاهده دمو
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username/Email Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#2D3748] font-medium">
                  نام کاربری یا ایمیل
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-colors"
                  placeholder="نام کاربری یا ایمیل خود را وارد کنید"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#2D3748] font-medium">
                  رمز عبور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-colors pr-12"
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2563EB] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                    className="data-[state=checked]:bg-[#2563EB] data-[state=checked]:border-[#2563EB]"
                  />
                  <Label htmlFor="remember" className="text-sm text-[#2D3748] cursor-pointer">
                    مرا به خاطر بسپار
                  </Label>
                </div>
                <a 
                  href="#" 
                  className="text-sm text-[#22D3EE] hover:text-[#0891B2] transition-colors"
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 focus:ring-4 focus:ring-[#2563EB]/30"
              >
                ورود
              </Button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              © ۱۴۰۳ سامانه LinkToDoctor - دکتر حسین هدادی
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Branding */}
      <div className="hidden lg:flex flex-col items-center justify-center p-8 relative overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, #2563EB 0%, #22D3EE 100%)'
           }}>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white rounded-2xl transform rotate-12"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 border-4 border-white rounded-2xl transform -rotate-12"></div>
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 border-4 border-white rounded-2xl transform rotate-45"></div>
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border-4 border-white rounded-2xl transform -rotate-45"></div>
        </div>

        <div className="relative z-10 text-center text-white space-y-8">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logoPath} 
              alt="LinkToDoctor Logo" 
              className="h-16 w-auto mx-auto filter brightness-0 invert"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              سامانه جامع مدیریت سلامت الکترونیک
            </h2>
            <p className="text-xl opacity-90">
              راه‌حلی مدرن برای ارائه خدمات پزشکی در منزل
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mt-12">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-lg">مدیریت جامع آزمایشات پزشکی</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-lg">نمونه‌گیری حرفه‌ای در منزل</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-lg">گزارش‌گیری هوشمند و تحلیلی</span>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}