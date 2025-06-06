import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Stethoscope, Shield, Users, TrendingUp, Activity, Calendar, FileText, BarChart3, Clock, CheckCircle } from "lucide-react";
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
    
    if (formData.username === "haddadi" && formData.password === "Axayaco") {
      // Set authentication flag in localStorage for persistent login
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({
        id: 'haddadi',
        name: 'مهندس حسین حدادی',
        username: 'haddadi'
      }));
      
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      window.location.href = '/';
    } else {
      setError("نام کاربری یا رمز عبور اشتباه است");
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4" dir="rtl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/90">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25"></div>
                <img 
                  src={logoPath} 
                  alt="LinkToDoctor Logo" 
                  className="relative h-14 w-auto"
                />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ورود به سامانه
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2 text-lg">
                سامانه مدیریت جامع آزمایشگاه پزشکی
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-gray-700 font-semibold text-sm">
                  نام کاربری یا ایمیل
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                  placeholder="نام کاربری یا ایمیل خود را وارد کنید"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">
                  رمز عبور
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    placeholder="رمز عبور خود را وارد کنید"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                    className="w-5 h-5 rounded-md"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer font-medium">
                    مرا به خاطر بسپار
                  </Label>
                </div>
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  فراموشی رمز عبور
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
              >
                ورود به سامانه
              </Button>
            </form>

            <div className="text-center pt-4">
              <button
                onClick={() => setShowLogin(false)}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
              >
                بازگشت به صفحه اصلی
              </button>
            </div>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                © ۱۴۰۳ سامانه LinkToDoctor - مهندس حسین حدادی
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center mb-8">
              <img 
                src={logoPath} 
                alt="LinkToDoctor Logo" 
                className="h-32 w-auto"
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              سامانه LinkToDoctor
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              راه‌حلی مدرن و جامع برای مدیریت آزمایشگاه پزشکی و ارائه خدمات نمونه‌گیری در منزل
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => setShowLogin(true)}
              >
                ورود به سامانه
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-10 py-4 text-lg font-semibold rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                مشاهده دمو
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: Users, label: "کاربران فعال", value: "۲۵۰+" },
              { icon: Activity, label: "آزمایشات ماهانه", value: "۱۰۰۰+" },
              { icon: Clock, label: "زمان پاسخگویی", value: "۲۴ ساعت" },
              { icon: CheckCircle, label: "رضایت مشتریان", value: "۹۸%" }
            ].map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="text-center p-6">
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Users,
                title: "مدیریت منابع انسانی",
                description: "مدیریت کامل کارکنان، کلکترها و دسترسی‌های سیستم با امکانات پیشرفته",
                color: "from-green-400 to-emerald-600"
              },
              {
                icon: Stethoscope,
                title: "مدیریت آزمایشات",
                description: "ثبت سفارشات، نمونه‌گیری و ارائه نتایج آزمایشات با کیفیت بالا",
                color: "from-purple-400 to-violet-600"
              },
              {
                icon: BarChart3,
                title: "گزارش‌گیری پیشرفته",
                description: "داشبورد تحلیلی و گزارشات عملکرد سیستم با نمودارهای تعاملی",
                color: "from-orange-400 to-red-600"
              },
              {
                icon: Calendar,
                title: "برنامه‌ریزی هوشمند",
                description: "سیستم برنامه‌ریزی خودکار برای نمونه‌گیری و تحویل نتایج",
                color: "from-blue-400 to-cyan-600"
              },
              {
                icon: FileText,
                title: "مدیریت مدارک",
                description: "نگهداری و مدیریت دیجیتال تمامی مدارک و گواهینامه‌های پزشکی",
                color: "from-indigo-400 to-purple-600"
              },
              {
                icon: Shield,
                title: "امنیت پیشرفته",
                description: "حفاظت کامل از اطلاعات حساس با بالاترین استانداردهای امنیتی",
                color: "from-gray-400 to-gray-600"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-slate-900 text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* About Section */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-20">
            <CardContent className="text-center p-12">
              <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <CardTitle className="text-3xl font-bold mb-6">امنیت و اعتماد در سطح بین‌المللی</CardTitle>
              <p className="text-xl leading-relaxed max-w-4xl mx-auto opacity-90">
                سامانه LinkToDoctor با استفاده از جدیدترین تکنولوژی‌های امنیتی و رعایت کامل استانداردهای بین‌المللی پزشکی،
                محیطی کاملاً ایمن و قابل اعتماد برای مدیریت اطلاعات حساس بیماران و آزمایشات فراهم می‌کند.
                تمامی داده‌ها با رمزنگاری نظامی محافظت شده و دسترسی‌ها بر اساس سطوح مختلف کاربران کنترل می‌شود.
              </p>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t border-slate-200/50">
            <p className="text-slate-500 text-lg">
              © ۱۴۰۳ سامانه LinkToDoctor - مهندس حسین حدادی
            </p>
            <p className="text-slate-400 text-sm mt-2">
              ساخته شده با ❤️ برای بهبود خدمات درمانی
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}