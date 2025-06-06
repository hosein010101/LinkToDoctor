import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Send, 
  Download, 
  Eye, 
  CheckCircle, 
  Phone, 
  Mail, 
  User, 
  FileText,
  Calendar,
  Clock,
  Truck,
  AlertCircle,
  Filter,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
  MessageSquare,
  Star,
  Activity,
  TestTube
} from "lucide-react";
import type { OrderWithDetails } from "@/lib/types";

export default function Delivery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders"],
  });

  const deliverResultMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiRequest("PATCH", `/api/lab-orders/${orderId}/status`, {
        status: "delivered",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "نتیجه با موفقیت تحویل داده شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در تحویل نتیجه",
        variant: "destructive",
      });
    },
  });

  // Filter orders
  const readyOrders = orders?.filter(order => order.status === "completed") || [];
  const deliveredOrders = orders?.filter(order => order.status === "delivered") || [];
  const allDeliveryOrders = [...readyOrders, ...deliveredOrders];

  const filteredOrders = allDeliveryOrders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "ready" && order.status === "completed") ||
      (statusFilter === "delivered" && order.status === "delivered");
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDelivery = (orderId: number) => {
    deliverResultMutation.mutate(orderId);
  };

  const handleBulkDelivery = () => {
    selectedOrders.forEach(orderId => {
      deliverResultMutation.mutate(orderId);
    });
    setSelectedOrders([]);
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAllOrders = () => {
    const readyOrderIds = paginatedOrders.filter(order => order.status === "completed").map(order => order.id);
    setSelectedOrders(readyOrderIds);
  };

  const clearSelection = () => {
    setSelectedOrders([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">آماده تحویل</Badge>;
      case "delivered":
        return <Badge className="bg-green-100 text-green-800 border-green-200">تحویل شده</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Stats calculations
  const todayDelivered = deliveredOrders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.updatedAt);
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const weeklyDelivered = deliveredOrders.filter(order => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const orderDate = new Date(order.updatedAt);
    return orderDate >= weekAgo;
  }).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری نتایج...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">تحویل نتایج بیماران</h1>
            <p className="text-gray-600 text-sm">مدیریت تحویل نتایج آزمایش به بیماران</p>
          </div>
        </div>
        {selectedOrders.length > 0 && (
          <div className="flex items-center space-x-2 space-x-reverse">
            <Button variant="outline" onClick={clearSelection} size="sm">
              انصراف
            </Button>
            <Button 
              onClick={handleBulkDelivery}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={deliverResultMutation.isPending}
            >
              <Send className="w-4 h-4 ml-2" />
              تحویل گروهی ({selectedOrders.length})
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">آماده تحویل</p>
                <p className="text-2xl font-bold" style={{color: '#4299E1'}}>{readyOrders.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  نیاز به تحویل فوری
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#EBF8FF'}}>
                <Package className="w-6 h-6" style={{color: '#4299E1'}} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">تحویل امروز</p>
                <p className="text-2xl font-bold text-green-600">{todayDelivered}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <ArrowUpRight className="w-3 h-3 inline mr-1" />
                  +{((todayDelivered / Math.max(weeklyDelivered, 1)) * 100).toFixed(0)}% این هفته
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">این هفته</p>
                <p className="text-2xl font-bold text-blue-600">{weeklyDelivered}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <Activity className="w-3 h-3 inline mr-1" />
                  میانگین روزانه: {Math.round(weeklyDelivered / 7)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">کل تحویل شده</p>
                <p className="text-2xl font-bold text-purple-600">{deliveredOrders.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <Star className="w-3 h-3 inline mr-1" />
                  کیفیت عالی
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجوی بیمار، سفارش یا شماره تماس..."
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
                <SelectItem value="ready">آماده تحویل</SelectItem>
                <SelectItem value="delivered">تحویل شده</SelectItem>
              </SelectContent>
            </Select>

            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
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

            <div className="flex space-x-2 space-x-reverse">
              <Button variant="outline" onClick={selectAllOrders} size="sm">
                <CheckCircle className="w-4 h-4 ml-1" />
                انتخاب همه
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 ml-1" />
                فیلتر پیشرفته
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, filteredOrders.length)} از {filteredOrders.length} نتیجه
            </div>
            <div>
              صفحه {currentPage} از {totalPages}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    {order.status === "completed" && (
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleOrderSelection(order.id)}
                      />
                    )}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      order.status === "completed" 
                        ? "bg-orange-100" 
                        : "bg-green-100"
                    }`}>
                      {order.status === "completed" ? (
                        <Package className={`w-6 h-6 text-orange-600`} />
                      ) : (
                        <CheckCircle className={`w-6 h-6 text-green-600`} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <h5 className="font-semibold text-gray-900">{order.patient.name}</h5>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.orderNumber}</p>
                      <div className="flex items-center space-x-4 space-x-reverse mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Phone className="w-3 h-3" />
                          <span>{order.patient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <TestTube className="w-3 h-3" />
                          <span>{order.services.length} آزمایش</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                      مشاهده
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                      دانلود
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                      اطلاع‌رسانی
                    </Button>
                    {order.status === "completed" && (
                      <Button 
                        size="sm"
                        onClick={() => handleDelivery(order.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={deliverResultMutation.isPending}
                      >
                        <Send className="w-4 h-4 ml-1" />
                        تحویل
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {order.status === "delivered" && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>تحویل شده در {formatDate(order.updatedAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {paginatedOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500 mb-2">نتیجه‌ای یافت نشد</h4>
                <p className="text-sm text-gray-400">با فیلترهای مختلف جستجو کنید</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  اول
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
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
                      onClick={() => setCurrentPage(pageNumber)}
                      style={currentPage === pageNumber ? {backgroundColor: '#4A90E2', color: 'white', border: 'none'} : {}}
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
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  بعدی
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
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