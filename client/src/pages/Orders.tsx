import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Truck,
  Users,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Eye,
  MoreHorizontal,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { OrderWithDetails, Patient, Collector } from "@/lib/types";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders"],
  });

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: collectors } = useQuery<Collector[]>({
    queryKey: ["/api/collectors"],
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/lab-orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "وضعیت سفارش به‌روزرسانی شد",
      });
    },
  });

  // Create enhanced orders with patient and collector data
  const enhancedOrders = orders?.map(order => {
    const patient = patients?.find(p => p.id === order.patientId);
    const collector = collectors?.find(c => c.id === order.collectorId);
    return {
      ...order,
      patient: patient || { id: order.patientId, name: `بیمار ${order.patientId}`, phone: "-", nationalId: "-", age: 0, address: order.collectionAddress, createdAt: "" },
      collector
    };
  }) || [];

  // Filter orders
  const filteredOrders = enhancedOrders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      registered: { label: "ثبت شده", class: "bg-blue-100 text-blue-800", icon: Package },
      collection_scheduled: { label: "زمان‌بندی شده", class: "bg-yellow-100 text-yellow-800", icon: Clock },
      collected: { label: "نمونه‌گیری شده", class: "bg-purple-100 text-purple-800", icon: Truck },
      processing: { label: "در حال پردازش", class: "bg-orange-100 text-orange-800", icon: AlertTriangle },
      completed: { label: "تکمیل شده", class: "bg-green-100 text-green-800", icon: CheckCircle },
      delivered: { label: "تحویل داده شده", class: "bg-gray-100 text-gray-800", icon: CheckCircle },
    } as const;
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.registered;
    const IconComponent = config.icon;
    
    return (
      <Badge className={`${config.class} hover:${config.class} flex items-center space-x-1 space-x-reverse`}>
        <IconComponent className="w-3 h-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      urgent: { label: "اورژانس", class: "bg-red-100 text-red-800" },
      high: { label: "مهم", class: "bg-orange-100 text-orange-800" },
      normal: { label: "عادی", class: "bg-gray-100 text-gray-800" },
      low: { label: "کم اهمیت", class: "bg-green-100 text-green-800" },
    } as const;
    
    const config = priorityMap[priority as keyof typeof priorityMap] || priorityMap.normal;
    
    return (
      <Badge variant="outline" className={config.class}>
        {config.label}
      </Badge>
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Package className="text-blue-600" size={24} />
          </div>
          <p className="text-lg font-medium text-gray-900">در حال بارگذاری سفارشات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت سفارشات</h1>
          <p className="text-gray-600 mt-1">
            {filteredOrders.length} سفارش از {enhancedOrders.length} سفارش کل
          </p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            گزارش
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            سفارش جدید
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل سفارشات</p>
                <p className="text-2xl font-bold text-gray-900">{enhancedOrders.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ثبت شده</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enhancedOrders.filter(o => o.status === "registered").length}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">زمان‌بندی شده</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enhancedOrders.filter(o => o.status === "collection_scheduled").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نمونه‌گیری شده</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enhancedOrders.filter(o => o.status === "collected").length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در حال پردازش</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enhancedOrders.filter(o => o.status === "processing").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">تکمیل شده</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enhancedOrders.filter(o => o.status === "completed" || o.status === "delivered").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجوی سفارش، بیمار یا شماره تماس..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="registered">ثبت شده</SelectItem>
                <SelectItem value="collection_scheduled">زمان‌بندی شده</SelectItem>
                <SelectItem value="collected">نمونه‌گیری شده</SelectItem>
                <SelectItem value="processing">در حال پردازش</SelectItem>
                <SelectItem value="completed">تکمیل شده</SelectItem>
                <SelectItem value="delivered">تحویل داده شده</SelectItem>
              </SelectContent>
            </Select>

            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger>
                <SelectValue placeholder="تعداد نمایش" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">۱۰ مورد</SelectItem>
                <SelectItem value="20">۲۰ مورد</SelectItem>
                <SelectItem value="50">۵۰ مورد</SelectItem>
                <SelectItem value="100">۱۰۰ مورد</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              <XCircle className="w-4 h-4 ml-2" />
              پاک کردن فیلترها
            </Button>

            <Button variant="outline">
              <Filter className="w-4 h-4 ml-2" />
              فیلترهای پیشرفته
            </Button>
          </div>
          
          {/* Pagination Info */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div>
              نمایش {startIndex + 1} تا {Math.min(endIndex, filteredOrders.length)} از {filteredOrders.length} سفارش
            </div>
            <div>
              صفحه {currentPage} از {totalPages}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.orderNumber}</h4>
                      <p className="text-sm text-gray-600">
                        ایجاد شده: {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                    {getPriorityBadge(order.priority)}
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 ml-1" />
                      جزئیات
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4 ml-1" />
                      ویرایش
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{order.patient.name}</p>
                      <p className="text-sm text-gray-600">{order.patient.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-900">{order.collectionAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.totalAmount.toLocaleString()} ریال
                      </p>
                      {order.collector && (
                        <p className="text-sm text-gray-600">نمونه‌گیر: {order.collector.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {order.scheduledDate && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      زمان نمونه‌گیری: {new Date(order.scheduledDate).toLocaleDateString('fa-IR')}
                      {order.scheduledTimeSlot && ` - ${order.scheduledTimeSlot}`}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {paginatedOrders.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">هیچ سفارشی یافت نشد</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  اول
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronRight className="w-4 h-4" />
                  قبلی
                </Button>
              </div>

              <div className="flex items-center space-x-1 space-x-reverse">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className={currentPage === pageNumber ? "bg-blue-600 text-white" : ""}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  بعدی
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  آخر
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}