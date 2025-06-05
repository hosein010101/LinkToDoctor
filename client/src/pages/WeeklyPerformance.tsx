import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3, LineChart, TrendingUp, TrendingDown, Users, TestTube2, 
  DollarSign, Clock, Target, Activity, Calendar, Download, Filter,
  Star, Award, Zap, CheckCircle, AlertTriangle
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';

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

interface WeeklyMetric {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: any;
  color: string;
  bgColor: string;
}

interface DepartmentPerformance {
  department: string;
  orders: number;
  revenue: number;
  satisfaction: number;
  efficiency: number;
  growth: string;
}

export default function WeeklyPerformance() {
  const [selectedWeek, setSelectedWeek] = useState("این هفته");

  // Weekly Performance Metrics
  const weeklyMetrics: WeeklyMetric[] = [
    {
      title: "سفارشات هفتگی",
      value: "847",
      change: "+18.2%",
      changeType: "increase",
      icon: TestTube2,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "درآمد هفتگی",
      value: "32.4M تومان",
      change: "+12.7%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "میانگین زمان پاسخ",
      value: "1.8 ساعت",
      change: "-24.5%",
      changeType: "increase",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "رضایت مشتریان",
      value: "8.9/10",
      change: "+3.1%",
      changeType: "increase",
      icon: Star,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // Department Performance Data
  const departmentData: DepartmentPerformance[] = [
    {
      department: "آزمایش خون",
      orders: 342,
      revenue: 14.2,
      satisfaction: 9.1,
      efficiency: 95.2,
      growth: "+15.3%"
    },
    {
      department: "آزمایش هورمونی",
      orders: 186,
      revenue: 8.7,
      satisfaction: 8.8,
      efficiency: 92.1,
      growth: "+8.9%"
    },
    {
      department: "آزمایش میکروبی",
      orders: 124,
      revenue: 5.1,
      satisfaction: 8.6,
      efficiency: 89.4,
      growth: "+12.1%"
    },
    {
      department: "آزمایش ادرار",
      orders: 195,
      revenue: 4.4,
      satisfaction: 9.0,
      efficiency: 94.8,
      growth: "+6.7%"
    }
  ];

  // Chart Data
  const dailyOrdersData = {
    labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
    datasets: [
      {
        label: 'سفارشات روزانه',
        data: [125, 142, 158, 134, 167, 121, 0],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(37, 99, 235, 0.8)',
          'rgba(156, 163, 175, 0.8)'
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(156, 163, 175, 1)'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  const revenueComparisonData = {
    labels: ['هفته گذشته', 'این هفته', 'پیش‌بینی هفته آینده'],
    datasets: [
      {
        label: 'درآمد (میلیون تومان)',
        data: [28.7, 32.4, 35.1],
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6
      }
    ]
  };

  const customerSatisfactionData = {
    labels: ['ممتاز (9-10)', 'خوب (7-8)', 'متوسط (5-6)', 'ضعیف (1-4)'],
    datasets: [
      {
        data: [68, 24, 6, 2],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(37, 99, 235, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(239, 68, 68, 0.9)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2
      }
    ]
  };

  const hourlyActivityData = {
    labels: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    datasets: [
      {
        label: 'سفارشات دریافتی',
        data: [15, 28, 45, 52, 38, 22, 8],
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'نتایج تحویل شده',
        data: [12, 22, 35, 48, 42, 28, 12],
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
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

  const doughnutOptions = {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">عملکرد هفتگی</h1>
          <p className="text-gray-600 mt-1">تحلیل جامع عملکرد و آمار هفته جاری</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <select 
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="این هفته">این هفته</option>
            <option value="هفته گذشته">هفته گذشته</option>
            <option value="2 هفته پیش">2 هفته پیش</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            فیلتر
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 ml-2" />
            خروجی گزارش
          </Button>
        </div>
      </div>

      {/* Weekly Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {weeklyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="card-professional hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`${metric.color} w-6 h-6`} />
                  </div>
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {metric.changeType === "increase" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      metric.changeType === "increase" ? "text-green-600" : "text-red-600"
                    }`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Orders */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>سفارشات روزانه</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={dailyOrdersData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Revenue Comparison */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <LineChart className="w-5 h-5 text-green-600" />
              <span>مقایسه درآمد</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={revenueComparisonData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Satisfaction */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Star className="w-5 h-5 text-orange-600" />
              <span>توزیع رضایت مشتریان</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={customerSatisfactionData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Hourly Activity */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Activity className="w-5 h-5 text-purple-600" />
              <span>فعالیت ساعتی</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={hourlyActivityData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance Table */}
      <Card className="card-professional">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Target className="w-5 h-5 text-indigo-600" />
            <span>عملکرد بخش‌ها</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-900">بخش</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">سفارشات</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">درآمد (M)</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">رضایت</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">کارایی</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">رشد</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{dept.department}</td>
                    <td className="py-3 px-4 text-gray-600">{dept.orders}</td>
                    <td className="py-3 px-4 text-gray-600">{dept.revenue}M</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium text-gray-900">{dept.satisfaction}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{width: `${dept.efficiency}%`}}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{dept.efficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-600 font-medium">{dept.growth}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 ml-1" />
                        عالی
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-professional border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">بهترین عملکرد</h3>
                <p className="text-sm text-gray-600">آزمایش خون با 342 سفارش</p>
                <p className="text-lg font-bold text-green-600">+15.3% رشد</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">سریع‌ترین پاسخ</h3>
                <p className="text-sm text-gray-600">میانگین 1.8 ساعت</p>
                <p className="text-lg font-bold text-blue-600">24% بهبود</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">بالاترین رضایت</h3>
                <p className="text-sm text-gray-600">آزمایش خون با امتیاز 9.1</p>
                <p className="text-lg font-bold text-orange-600">68% ممتاز</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}