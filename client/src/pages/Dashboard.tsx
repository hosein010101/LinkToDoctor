import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import logoPath from "@assets/logo_1749120300661.png";
import { SampleCollectionIcon, TopDoctorsIcon } from "@/components/ui/custom-icons";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  TestTube2, 
  Calendar, 
  DollarSign,
  Clock,
  MapPin,
  Heart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Package,
  Truck,
  FileText,
  BarChart3,
  Eye,
  Plus,
  ArrowRight,
  Star,
  Target,
  Zap,
  Shield,
  PieChart,
  LineChart
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);
import type { DashboardStats, OrderWithDetails } from "@/lib/types";

interface QuickStat {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: any;
  color: string;
  bgColor: string;
}

interface RecentActivity {
  id: number;
  type: "order" | "result" | "collection" | "payment";
  title: string;
  description: string;
  time: string;
  status: "success" | "warning" | "error" | "info";
  user?: string;
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: orders } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders"],
  });

  // Enhanced demo data for comprehensive dashboard
  const quickStats: QuickStat[] = [
    {
      title: t('dashboard.todayOrders'),
      value: "142",
      change: "+12.5%",
      changeType: "increase",
      icon: TestTube2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: t('dashboard.pendingCollection'),
      value: "28",
      change: "-8.2%",
      changeType: "decrease",
      icon: Truck,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: t('dashboard.readyResults'),
      value: "76",
      change: "+15.3%",
      changeType: "increase",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: t('dashboard.monthlyRevenue'),
      value: "۲,۸۴۰,۰۰۰ تومان",
      change: "+9.1%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "order",
      title: "سفارش جدید ثبت شد",
      description: "دکتر احمد رضایی - بیمار: زهرا محمدی",
      time: "2 دقیقه پیش",
      status: "info",
      user: "دکتر احمد رضایی"
    },
    {
      id: 2,
      type: "result",
      title: "نتایج آزمایش تایید شد",
      description: "آزمایش خون کامل - کد: LAB-2024-156",
      time: "8 دقیقه پیش",
      status: "success",
      user: "دکتر فاطمه نوری"
    },
    {
      id: 3,
      type: "collection",
      title: "نمونه‌گیری تکمیل شد",
      description: "علی حسینی - منطقه: تهران شمال",
      time: "15 دقیقه پیش",
      status: "success",
      user: "محمد تقوی"
    },
    {
      id: 4,
      type: "payment",
      title: "پرداخت انجام شد",
      description: "مبلغ: ۴۵۰,۰۰۰ تومان - سفارش #۱۲۳",
      time: "25 دقیقه پیش",
      status: "success"
    },
    {
      id: 5,
      type: "order",
      title: "سفارش فوری ثبت شد",
      description: "بیمارستان پارس - ۳ آزمایش اورژانسی",
      time: "35 دقیقه پیش",
      status: "warning",
      user: "مرکز درمانی پارس"
    }
  ];

  const topPerformers = [
    { name: "دکتر محمد رضایی", orders: 45, avatar: "م.ر", specialty: "داخلی" },
    { name: "دکتر فاطمه نوری", orders: 38, avatar: "ف.ن", specialty: "قلب و عروق" },
    { name: "دکتر علی احمدی", orders: 32, avatar: "ع.ا", specialty: "غدد" },
    { name: "دکتر سارا جعفری", orders: 28, avatar: "س.ج", specialty: "زنان" }
  ];

  // Chart Data for Professional Dashboard
  const monthlyOrdersData = {
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور'],
    datasets: [
      {
        label: 'سفارشات ماهانه',
        data: [420, 380, 465, 520, 480, 540],
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const testTypesData = {
    labels: ['آزمایش خون', 'آزمایش ادرار', 'آزمایش هورمونی', 'آزمایش میکروبی', 'سایر'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const weeklyRevenueData = {
    labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
    datasets: [
      {
        label: 'درآمد روزانه (میلیون تومان)',
        data: [4.2, 3.8, 5.1, 4.6, 5.5, 4.9, 3.2],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: 'Vazirmatn, Inter, sans-serif',
            size: 12
          }
        }
      },
      tooltip: {
        titleFont: {
          family: 'Vazirmatn, Inter, sans-serif'
        },
        bodyFont: {
          family: 'Vazirmatn, Inter, sans-serif'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: 'Vazirmatn, Inter, sans-serif'
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: 'Vazirmatn, Inter, sans-serif'
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'Vazirmatn, Inter, sans-serif',
            size: 11
          },
          padding: 15
        }
      },
      tooltip: {
        titleFont: {
          family: 'Vazirmatn, Inter, sans-serif'
        },
        bodyFont: {
          family: 'Vazirmatn, Inter, sans-serif'
        }
      }
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order": return TestTube2;
      case "result": return FileText;
      case "collection": return Truck;
      case "payment": return DollarSign;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50";
      case "warning": return "text-orange-600 bg-orange-50";
      case "error": return "text-red-600 bg-red-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  if (statsLoading) {
    return (
      <div className="dashboard-loading">
        <div className="main-icon">
          <img 
            src={logoPath} 
            alt="LinkToDoctor Logo" 
            className="w-16 h-16 object-contain site-logo"
          />
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-semibold text-gray-900">سامانه LinkToDoctor</p>
          <p className="text-sm text-gray-600">در حال بارگذاری داشبورد...</p>
          <div className="flex items-center justify-center space-x-1 space-x-reverse mt-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="card-professional p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 space-x-reverse">
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                خوش آمدید، دکتر حسین حدادی
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                مدیریت سامانه LinkToDoctor - آزمایشگاه پیشرفته
              </p>
              <div className="flex items-center space-x-6 space-x-reverse text-sm">
                <div className="flex items-center space-x-2 space-x-reverse text-green-600">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>سیستم آنلاین</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-gray-600 dark:text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Intl.DateTimeFormat('fa-IR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(currentTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3 space-x-reverse">
            <Button className="bg-gradient-primary text-white hover:shadow-lg">
              <Plus className="w-4 h-4 ml-2" />
              سفارش جدید
            </Button>
            <Button variant="outline" className="hover:shadow-md">
              <BarChart3 className="w-4 h-4 ml-2" />
              گزارشات
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-professional hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`${stat.color} w-6 h-6`} />
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : stat.changeType === "decrease" ? (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    ) : null}
                    <span className={`text-sm font-medium ${
                      stat.changeType === "increase" ? "text-green-600" : 
                      stat.changeType === "decrease" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Monthly Orders Trend */}
        <Card className="card-professional lg:col-span-2 xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <LineChart className="w-5 h-5 text-blue-600" />
              <span>روند سفارشات ماهانه</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={monthlyOrdersData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Test Types Distribution */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <PieChart className="w-5 h-5 text-purple-600" />
              <span>توزیع انواع آزمایش</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Pie data={testTypesData} options={pieOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Revenue and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Revenue */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>درآمد هفتگی</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={weeklyRevenueData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Target className="w-5 h-5 text-orange-600" />
              <span>شاخص‌های عملکرد</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">نرخ تکمیل سفارشات</span>
                <span className="text-lg font-bold text-green-600">94.2%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '94.2%'}}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">رضایت مشتریان</span>
                <span className="text-lg font-bold text-blue-600">8.7/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '87%'}}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">زمان پاسخ میانگین</span>
                <span className="text-lg font-bold text-purple-600">2.4 ساعت</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '76%'}}></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">دقت نتایج</span>
                <span className="text-lg font-bold text-emerald-600">99.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{width: '99.1%'}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="card-professional">
            <CardContent className="p-0">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2 space-x-reverse">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>فعالیت‌های اخیر</span>
                  </h3>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4 ml-2" />
                    مشاهده همه
                  </Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="p-6 border-b border-gray-50 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start space-x-4 space-x-reverse">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(activity.status)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 space-x-reverse mt-2">
                            <span className="text-xs text-gray-500">{activity.time}</span>
                            {activity.user && (
                              <span className="text-xs text-blue-600 font-medium">{activity.user}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Top Performing Doctors */}
          <Card className="card-professional">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2 space-x-reverse">
                <TopDoctorsIcon className="w-6 h-6 star-icon adaptive-icon" />
                <span>پزشکان برتر ماه</span>
              </h3>
              <div className="space-y-4">
                {topPerformers.map((doctor, index) => (
                  <div key={index} className="flex items-center space-x-3 space-x-reverse p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-sm font-bold text-gray-400 w-4">#{index + 1}</span>
                      <Avatar className="w-10 h-10 border-2 border-blue-200">
                        <AvatarFallback className="bg-gradient-primary text-white text-sm font-bold">
                          {doctor.avatar}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {doctor.name}
                      </p>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {doctor.orders} سفارش
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="card-professional">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2 space-x-reverse">
                <Shield className="w-5 h-5 text-green-600" />
                <span>وضعیت سیستم</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">سرور اصلی</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">آنلاین</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">پایگاه داده</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">فعال</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">نمونه‌گیران</span>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-600">۸ نفر آنلاین</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">آخرین بکاپ</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">۲ ساعت پیش</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 shadow-elegant text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2 space-x-reverse">
                <Zap className="w-5 h-5" />
                <span>عملیات سریع</span>
              </h3>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                  <Plus className="w-4 h-4 ml-2" />
                  ثبت سفارش فوری
                </Button>
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                  <Calendar className="w-4 h-4 ml-2" />
                  برنامه‌ریزی نمونه‌گیری
                </Button>
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-0">
                  <FileText className="w-4 h-4 ml-2" />
                  ورود نتایج
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Performance Chart */}
      <Card className="bg-white dark:bg-gray-900 border-0 shadow-elegant">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2 space-x-reverse">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>عملکرد هفتگی</span>
            </h3>
            <Button variant="outline" size="sm">
              <ArrowRight className="w-4 h-4 ml-2" />
              گزارش تفصیلی
            </Button>
          </div>
          <div className="h-64 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">نمودار عملکرد هفتگی</p>
              <p className="text-sm text-gray-400">برای نمایش نمودارهای تعاملی، کتابخانه Chart.js یا Recharts نیاز است</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}