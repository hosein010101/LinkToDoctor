import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, TrendingUp, TrendingDown, Users, TestTube, Clock, 
  Calendar, Download, Filter, Eye, FileText, PieChart, LineChart,
  Activity, DollarSign, Target, AlertCircle, CheckCircle, XCircle,
  MapPin, Phone, Mail, Star, Award, Timer, Zap
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  Area,
  AreaChart
} from 'recharts';

export default function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedReport, setSelectedReport] = useState("overview");
  const [dateRange, setDateRange] = useState({ from: "1403/05/01", to: "1403/05/30" });

  // نمونه داده‌های گزارش‌گیری
  const monthlyStats = {
    totalTests: 2847,
    completedTests: 2695,
    pendingTests: 152,
    revenue: 85420000,
    avgTimePerTest: 24,
    customerSatisfaction: 4.7,
    growthRate: 12.5,
    regionCoverage: 8
  };

  const weeklyData = [
    { name: 'شنبه', tests: 120, revenue: 3600000, satisfaction: 4.8 },
    { name: 'یکشنبه', tests: 95, revenue: 2850000, satisfaction: 4.6 },
    { name: 'دوشنبه', tests: 145, revenue: 4350000, satisfaction: 4.7 },
    { name: 'سه‌شنبه', tests: 165, revenue: 4950000, satisfaction: 4.9 },
    { name: 'چهارشنبه', tests: 180, revenue: 5400000, satisfaction: 4.8 },
    { name: 'پنج‌شنبه', tests: 155, revenue: 4650000, satisfaction: 4.6 },
    { name: 'جمعه', tests: 85, revenue: 2550000, satisfaction: 4.5 }
  ];

  const monthlyTrends = [
    { month: 'فروردین', tests: 2245, revenue: 67350000, growth: 8.2 },
    { month: 'اردیبهشت', tests: 2367, revenue: 71010000, growth: 5.4 },
    { month: 'خرداد', tests: 2489, revenue: 74670000, growth: 5.2 },
    { month: 'تیر', tests: 2634, revenue: 79020000, growth: 5.8 },
    { month: 'مرداد', tests: 2789, revenue: 83670000, growth: 5.9 },
    { month: 'شهریور', tests: 2847, revenue: 85410000, growth: 2.1 }
  ];

  const testTypeDistribution = [
    { name: 'آزمایش خون', value: 35, count: 997 },
    { name: 'آزمایش ادرار', value: 22, count: 626 },
    { name: 'آزمایش هورمونی', value: 18, count: 512 },
    { name: 'آزمایش میکروبی', value: 12, count: 341 },
    { name: 'آزمایش ژنتیک', value: 8, count: 227 },
    { name: 'سایر آزمایش‌ها', value: 5, count: 142 }
  ];

  const regionPerformance = [
    { region: 'تهران شمال', tests: 756, revenue: 22680000, satisfaction: 4.8, collectors: 12 },
    { region: 'تهران جنوب', tests: 642, revenue: 19260000, satisfaction: 4.6, collectors: 10 },
    { region: 'تهران غرب', tests: 589, revenue: 17670000, satisfaction: 4.7, collectors: 9 },
    { region: 'تهران شرق', tests: 478, revenue: 14340000, satisfaction: 4.5, collectors: 8 },
    { region: 'تهران مرکز', tests: 382, revenue: 11460000, satisfaction: 4.4, collectors: 6 }
  ];

  const collectorPerformance = [
    { name: 'فاطمه احمدی', tests: 167, success: 96.2, satisfaction: 9.1, efficiency: 94.5 },
    { name: 'مریم حسینی', tests: 158, success: 97.1, satisfaction: 9.3, efficiency: 96.8 },
    { name: 'علی محمدی', tests: 142, success: 94.8, satisfaction: 8.7, efficiency: 91.2 },
    { name: 'زهرا نوری', tests: 0, success: 95.6, satisfaction: 8.9, efficiency: 93.7 },
    { name: 'حسن کاظمی', tests: 98, success: 92.4, satisfaction: 8.4, efficiency: 89.1 }
  ];

  const timeAnalysis = [
    { hour: '8:00', tests: 45, efficiency: 92 },
    { hour: '9:00', tests: 67, efficiency: 95 },
    { hour: '10:00', tests: 89, efficiency: 97 },
    { hour: '11:00', tests: 78, efficiency: 94 },
    { hour: '12:00', tests: 56, efficiency: 88 },
    { hour: '13:00', tests: 34, efficiency: 85 },
    { hour: '14:00', tests: 45, efficiency: 89 },
    { hour: '15:00', tests: 67, efficiency: 93 },
    { hour: '16:00', tests: 54, efficiency: 91 },
    { hour: '17:00', tests: 43, efficiency: 87 },
    { hour: '18:00', tests: 32, efficiency: 84 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (rate < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">گزارشات و تحلیل</h1>
          <p className="text-gray-600 mt-1">تحلیل عملکرد و آمارهای جامع آزمایشگاه</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <Filter className="w-4 h-4 ml-2" />
            فیلتر پیشرفته
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4 ml-2" />
            دانلود گزارش
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">دوره زمانی</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">هفته جاری</SelectItem>
                  <SelectItem value="month">ماه جاری</SelectItem>
                  <SelectItem value="quarter">سه ماهه</SelectItem>
                  <SelectItem value="year">سال جاری</SelectItem>
                  <SelectItem value="custom">دوره دلخواه</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">نوع گزارش</label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">نمای کلی</SelectItem>
                  <SelectItem value="financial">مالی</SelectItem>
                  <SelectItem value="operational">عملیاتی</SelectItem>
                  <SelectItem value="quality">کیفیت خدمات</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">از تاریخ</label>
              <Input 
                value={dateRange.from} 
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
                placeholder="1403/05/01" 
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">تا تاریخ</label>
              <Input 
                value={dateRange.to} 
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
                placeholder="1403/05/30" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل آزمایش‌ها</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.totalTests.toLocaleString('fa-IR')}</p>
                <div className="flex items-center space-x-1 space-x-reverse mt-1">
                  {getGrowthIcon(monthlyStats.growthRate)}
                  <span className="text-sm text-green-600">+{monthlyStats.growthRate}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TestTube className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">درآمد ماهانه</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyStats.revenue)}</p>
                <div className="flex items-center space-x-1 space-x-reverse mt-1">
                  {getGrowthIcon(8.3)}
                  <span className="text-sm text-green-600">+8.3%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">رضایت مشتریان</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.customerSatisfaction}/5</p>
                <div className="flex items-center space-x-1 space-x-reverse mt-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm text-gray-600">عالی</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">زمان میانگین</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyStats.avgTimePerTest} دقیقه</p>
                <div className="flex items-center space-x-1 space-x-reverse mt-1">
                  {getGrowthIcon(-2.1)}
                  <span className="text-sm text-green-600">-2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">نمای کلی</TabsTrigger>
          <TabsTrigger value="financial">تحلیل مالی</TabsTrigger>
          <TabsTrigger value="operational">عملیاتی</TabsTrigger>
          <TabsTrigger value="quality">کیفیت</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Trends */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <LineChart className="w-5 h-5 text-blue-600" />
                  <span>روند هفتگی آزمایش‌ها</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => [value, name === 'tests' ? 'آزمایش‌ها' : name === 'revenue' ? 'درآمد' : 'رضایت']} />
                      <Legend />
                      <Line type="monotone" dataKey="tests" stroke="#3b82f6" strokeWidth={2} name="آزمایش‌ها" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Test Type Distribution */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <PieChart className="w-5 h-5 text-green-600" />
                  <span>توزیع انواع آزمایش</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={testTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {testTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span>روند ماهانه آزمایش‌ها و درآمد</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="tests" fill="#3b82f6" name="آزمایش‌ها" />
                    <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="درآمد" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>تحلیل درآمد منطقه‌ای</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionPerformance.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{region.region}</p>
                          <p className="text-sm text-gray-600">{region.tests} آزمایش</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900">{formatCurrency(region.revenue)}</p>
                        <p className="text-sm text-gray-600">{region.collectors} نمونه‌گیر</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>روند درآمد ماهانه</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>عملکرد نمونه‌گیران</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collectorPerformance.map((collector, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {collector.name.split(' ')[0][0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{collector.name}</p>
                          <p className="text-sm text-gray-600">{collector.tests} آزمایش</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-green-600">{collector.success}%</p>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-600">{collector.satisfaction}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>تحلیل ساعتی عملکرد</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={timeAnalysis}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tests" fill="#3b82f6" name="تعداد آزمایش" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>نرخ موفقیت</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-green-600">
                        {((monthlyStats.completedTests / monthlyStats.totalTests) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {monthlyStats.completedTests} از {monthlyStats.totalTests} آزمایش موفق
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>رضایت مشتریان</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`w-6 h-6 ${i < Math.floor(monthlyStats.customerSatisfaction) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {monthlyStats.customerSatisfaction}/5
                  </p>
                  <p className="text-sm text-gray-600">امتیاز میانگین</p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle>زمان پاسخ‌گویی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {monthlyStats.avgTimePerTest}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">دقیقه میانگین</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="card-professional">
            <CardHeader>
              <CardTitle>تحلیل کیفیت خدمات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>آزمایش‌های موفق</span>
                    </div>
                    <span className="font-bold text-green-600">{monthlyStats.completedTests}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <span>در انتظار</span>
                    </div>
                    <span className="font-bold text-yellow-600">{monthlyStats.pendingTests}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span>رضایت بالای 4.5</span>
                    </div>
                    <span className="font-bold text-blue-600">94%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Timer className="w-5 h-5 text-purple-600" />
                      <span>سرعت عملکرد</span>
                    </div>
                    <span className="font-bold text-purple-600">عالی</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Zap className="w-5 h-5 text-indigo-600" />
                      <span>بهره‌وری</span>
                    </div>
                    <span className="font-bold text-indigo-600">92%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Target className="w-5 h-5 text-pink-600" />
                      <span>هدف‌گیری</span>
                    </div>
                    <span className="font-bold text-pink-600">105%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}