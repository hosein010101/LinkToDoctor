import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Truck, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Eye, 
  Edit, 
  Download,
  MoreHorizontal,
  MapPin,
  ChartBar
} from "lucide-react";

interface DashboardStats {
  todayOrders: number;
  pendingCollection: number;
  readyResults: number;
  monthlyRevenue: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  patient: {
    name: string;
  };
  services: Array<{
    serviceId: number;
  }>;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery<RecentOrder[]>({
    queryKey: ["/api/lab-orders"],
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      registered: { label: "ثبت شده", class: "bg-blue-100 text-blue-800" },
      collection_scheduled: { label: "در انتظار نمونه‌گیری", class: "bg-yellow-100 text-yellow-800" },
      collected: { label: "نمونه‌گیری شده", class: "bg-orange-100 text-orange-800" },
      processing: { label: "در حال پردازش", class: "bg-purple-100 text-purple-800" },
      completed: { label: "آماده تحویل", class: "bg-green-100 text-green-800" },
      delivered: { label: "تحویل داده شده", class: "bg-gray-100 text-gray-800" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.registered;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  if (statsLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">سفارشات امروز</p>
                <p className="text-2xl font-bold text-medical-text">{stats?.todayOrders || 0}</p>
                <p className="text-xs text-medical-green mt-2">
                  <TrendingUp className="inline w-3 h-3 ml-1" />
                  12% افزایش نسبت به دیروز
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-teal bg-opacity-20 rounded-lg flex items-center justify-center">
                <ClipboardList className="text-medical-teal" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">نمونه‌گیری در انتظار</p>
                <p className="text-2xl font-bold text-medical-text">{stats?.pendingCollection || 0}</p>
                <p className="text-xs text-medical-orange mt-2">
                  <Clock className="inline w-3 h-3 ml-1" />
                  8 مورد اولویت دار
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                <Truck className="text-medical-blue" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">نتایج آماده تحویل</p>
                <p className="text-2xl font-bold text-medical-text">{stats?.readyResults || 0}</p>
                <p className="text-xs text-medical-green mt-2">
                  <CheckCircle className="inline w-3 h-3 ml-1" />
                  95% تایید شده
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-green bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileText className="text-medical-green" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">درآمد ماهانه</p>
                <p className="text-2xl font-bold text-medical-text">
                  {stats?.monthlyRevenue ? formatCurrency(stats.monthlyRevenue) : '0 تومان'}
                </p>
                <p className="text-xs text-medical-green mt-2">
                  <TrendingUp className="inline w-3 h-3 ml-1" />
                  تومان
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="text-medical-orange" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-medical-text">آمار سفارشات هفتگی</h3>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <ChartBar className="w-16 h-16 mx-auto mb-2" />
                <p>نمودار آمار سفارشات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-medical-text">وضعیت نمونه‌گیران</h3>
              <Button variant="ghost" size="sm">
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center relative">
              <div className="absolute inset-4 bg-medical-teal bg-opacity-10 rounded-lg">
                <div className="absolute top-8 right-12 w-3 h-3 bg-medical-green rounded-full animate-pulse-green"></div>
                <div className="absolute top-16 right-24 w-3 h-3 bg-medical-orange rounded-full animate-pulse"></div>
                <div className="absolute bottom-16 right-16 w-3 h-3 bg-medical-green rounded-full animate-pulse-green"></div>
                <div className="absolute bottom-8 left-12 w-3 h-3 bg-medical-blue rounded-full animate-pulse"></div>
              </div>
              <div className="text-center text-gray-500 z-10">
                <MapPin className="w-16 h-16 mx-auto mb-2" />
                <p>نقشه ردیابی نمونه‌گیران</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-medical-text">آخرین سفارشات</h3>
            <Button variant="ghost" className="text-medical-teal hover:text-medical-blue text-sm font-medium">
              مشاهده همه
              <TrendingUp className="mr-2 w-4 h-4" />
            </Button>
          </div>
          
          {ordersLoading ? (
            <div className="text-center py-8">در حال بارگذاری...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      شماره سفارش
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نام بیمار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع آزمایش
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      وضعیت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاریخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders?.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-medical-text">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.patient?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.services?.length || 0} آزمایش
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {order.status === "completed" && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        هیچ سفارشی یافت نشد
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
