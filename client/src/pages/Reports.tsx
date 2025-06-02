import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  TestTube, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Activity,
  Target,
  Filter
} from "lucide-react";
import type { OrderWithDetails, Collector, DashboardStats } from "@/lib/types";

export default function Reports() {
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");

  const { data: orders, isLoading: ordersLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders"],
  });

  const { data: collectors } = useQuery<Collector[]>({
    queryKey: ["/api/collectors"],
  });

  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  // Calculate analytics data
  const getAnalyticsData = () => {
    if (!orders) return null;

    const now = new Date();
    const daysAgo = parseInt(dateRange);
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    const filteredOrders = orders.filter(order => 
      new Date(order.createdAt) >= startDate
    );

    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(o => o.status === "delivered").length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Status distribution
    const statusDistribution = {
      registered: filteredOrders.filter(o => o.status === "registered").length,
      collection_scheduled: filteredOrders.filter(o => o.status === "collection_scheduled").length,
      collected: filteredOrders.filter(o => o.status === "collected").length,
      processing: filteredOrders.filter(o => o.status === "processing").length,
      completed: filteredOrders.filter(o => o.status === "completed").length,
      delivered: filteredOrders.filter(o => o.status === "delivered").length,
    };

    // Daily orders for the chart
    const dailyOrders = Array.from({ length: Math.min(daysAgo, 30) }, (_, i) => {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      return {
        date: new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(date),
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
      };
    }).reverse();

    // Collector performance
    const collectorPerformance = collectors?.map(collector => {
      const collectorOrders = filteredOrders.filter(o => o.collectorId === collector.id);
      return {
        name: collector.name,
        orders: collectorOrders.length,
        completed: collectorOrders.filter(o => o.status === "delivered").length,
        efficiency: collectorOrders.length > 0 ? 
          (collectorOrders.filter(o => o.status === "delivered").length / collectorOrders.length) * 100 : 0,
      };
    }) || [];

    return {
      totalOrders,
      completedOrders,
      totalRevenue,
      avgOrderValue,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
      statusDistribution,
      dailyOrders,
      collectorPerformance,
    };
  };

  const analyticsData = getAnalyticsData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      registered: "ثبت شده",
      collection_scheduled: "برنامه‌ریزی شده",
      collected: "نمونه‌گیری شده",
      processing: "در حال پردازش",
      completed: "آماده تحویل",
      delivered: "تحویل شده",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  if (ordersLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-medical-text">گزارشات و تحلیل</h3>
              <p className="text-sm text-gray-500 mt-1">تحلیل عملکرد و آمارهای آزمایشگاه</p>
            </div>
            <div className="flex space-x-3 space-x-reverse">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 روز گذشته</SelectItem>
                  <SelectItem value="30">30 روز گذشته</SelectItem>
                  <SelectItem value="90">90 روز گذشته</SelectItem>
                  <SelectItem value="365">1 سال گذشته</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="ml-2 w-4 h-4" />
                فیلترها
              </Button>
              <Button className="bg-medical-teal hover:bg-opacity-90 text-white">
                <Download className="ml-2 w-4 h-4" />
                خروجی PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">کل سفارشات</p>
                  <p className="text-2xl font-bold text-medical-text">{analyticsData.totalOrders}</p>
                  <p className="text-xs text-medical-teal mt-2">
                    <TrendingUp className="inline w-3 h-3 ml-1" />
                    {dateRange} روز گذشته
                  </p>
                </div>
                <div className="w-12 h-12 bg-medical-teal bg-opacity-20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-medical-teal" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">نرخ تکمیل</p>
                  <p className="text-2xl font-bold text-medical-green">
                    {analyticsData.completionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    <CheckCircle className="inline w-3 h-3 ml-1" />
                    {analyticsData.completedOrders} تحویل شده
                  </p>
                </div>
                <div className="w-12 h-12 bg-medical-green bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Target className="text-medical-green" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">کل درآمد</p>
                  <p className="text-2xl font-bold text-medical-orange">
                    {formatCurrency(analyticsData.totalRevenue)}
                  </p>
                  <p className="text-xs text-orange-600 mt-2">
                    <DollarSign className="inline w-3 h-3 ml-1" />
                    {dateRange} روز گذشته
                  </p>
                </div>
                <div className="w-12 h-12 bg-medical-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                  <DollarSign className="text-medical-orange" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">میانگین ارزش سفارش</p>
                  <p className="text-2xl font-bold text-medical-blue">
                    {formatCurrency(analyticsData.avgOrderValue)}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    <Activity className="inline w-3 h-3 ml-1" />
                    به ازای هر سفارش
                  </p>
                </div>
                <div className="w-12 h-12 bg-medical-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Activity className="text-medical-blue" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Reports */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">عملکرد کلی</TabsTrigger>
          <TabsTrigger value="collectors">نمونه‌گیران</TabsTrigger>
          <TabsTrigger value="services">خدمات</TabsTrigger>
          <TabsTrigger value="financial">مالی</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders Trend Chart */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-medical-text">روند سفارشات</h4>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative">
                  {analyticsData && (
                    <div className="w-full h-full p-4">
                      <div className="flex items-end justify-between h-full space-x-2 space-x-reverse">
                        {analyticsData.dailyOrders.slice(-10).map((day, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="bg-medical-teal rounded-t w-full min-h-2 transition-all"
                              style={{ 
                                height: `${Math.max(day.orders * 10, 8)}px`,
                                maxHeight: '200px'
                              }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                              {day.date}
                            </span>
                            <span className="text-xs font-medium text-medical-text mt-1">
                              {day.orders}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-medical-text mb-4">توزیع وضعیت سفارشات</h4>
                <div className="space-y-3">
                  {analyticsData && Object.entries(analyticsData.statusDistribution).map(([status, count]) => {
                    const percentage = analyticsData.totalOrders > 0 ? 
                      (count / analyticsData.totalOrders) * 100 : 0;
                    
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-3 h-3 bg-medical-teal rounded-full"></div>
                          <span className="text-sm text-gray-600">{getStatusLabel(status)}</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="text-sm font-medium text-medical-text">{count}</span>
                          <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="collectors" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-medical-text mb-6">عملکرد نمونه‌گیران</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نمونه‌گیر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        کل سفارشات
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تحویل شده
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نرخ موفقیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عملکرد
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData?.collectorPerformance.map((collector) => (
                      <tr key={collector.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-8 h-8 bg-medical-teal bg-opacity-20 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-medical-teal" />
                            </div>
                            <span className="text-sm font-medium text-medical-text">{collector.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {collector.orders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {collector.completed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-medical-green">
                            {collector.efficiency.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge 
                            variant="outline" 
                            className={
                              collector.efficiency >= 80 ? "bg-green-100 text-green-800" :
                              collector.efficiency >= 60 ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {collector.efficiency >= 80 ? "عالی" :
                             collector.efficiency >= 60 ? "خوب" : "نیاز به بهبود"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    
                    {!analyticsData?.collectorPerformance.length && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          داده‌ای برای نمایش وجود ندارد
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-medical-text mb-6">آمار خدمات</h4>
              <div className="text-center py-12">
                <TestTube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">گزارش خدمات</h3>
                <p className="text-sm text-gray-400">آمار تفصیلی خدمات آزمایشگاهی در حال توسعه است</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-medical-text mb-4">درآمد روزانه</h4>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative">
                  {analyticsData && (
                    <div className="w-full h-full p-4">
                      <div className="flex items-end justify-between h-full space-x-2 space-x-reverse">
                        {analyticsData.dailyOrders.slice(-7).map((day, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="bg-medical-orange rounded-t w-full min-h-2"
                              style={{ 
                                height: `${Math.max((day.revenue / 1000000) * 100, 8)}px`,
                                maxHeight: '200px'
                              }}
                            ></div>
                            <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                              {day.date}
                            </span>
                            <span className="text-xs font-medium text-medical-text mt-1">
                              {Math.round(day.revenue / 1000)}K
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold text-medical-text mb-4">خلاصه مالی</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">کل درآمد</span>
                    <span className="text-sm font-medium text-medical-text">
                      {analyticsData ? formatCurrency(analyticsData.totalRevenue) : '0 تومان'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">میانگین روزانه</span>
                    <span className="text-sm font-medium text-medical-text">
                      {analyticsData ? formatCurrency(analyticsData.totalRevenue / parseInt(dateRange)) : '0 تومان'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">میانگین سفارش</span>
                    <span className="text-sm font-medium text-medical-text">
                      {analyticsData ? formatCurrency(analyticsData.avgOrderValue) : '0 تومان'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
