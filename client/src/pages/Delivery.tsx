import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Clock
} from "lucide-react";
import type { OrderWithDetails } from "@/lib/types";

export default function Delivery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  
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

  // Filter orders that are ready for delivery (completed status)
  const readyOrders = orders?.filter(order => order.status === "completed") || [];
  const deliveredOrders = orders?.filter(order => order.status === "delivered") || [];

  const filteredReadyOrders = readyOrders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patient.phone.includes(searchTerm)
  );

  const filteredDeliveredOrders = deliveredOrders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.patient.phone.includes(searchTerm)
  );

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

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-medical-text">تحویل نتایج بیماران</h3>
              <p className="text-sm text-gray-500 mt-1">مدیریت تحویل نتایج آزمایش به بیماران</p>
            </div>
            {selectedOrders.length > 0 && (
              <Button 
                onClick={handleBulkDelivery}
                className="bg-medical-green hover:bg-opacity-90 text-white"
              >
                <Send className="ml-2 w-4 h-4" />
                تحویل گروهی ({selectedOrders.length})
              </Button>
            )}
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="جستجوی بیمار یا سفارش..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">آماده تحویل</p>
                <p className="text-2xl font-bold text-medical-orange">{readyOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                <FileText className="text-medical-orange" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">تحویل شده امروز</p>
                <p className="text-2xl font-bold text-medical-green">
                  {deliveredOrders.filter(order => {
                    const today = new Date();
                    const orderDate = new Date(order.updatedAt);
                    return orderDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-green bg-opacity-20 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-medical-green" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">کل تحویل شده</p>
                <p className="text-2xl font-bold text-medical-text">{deliveredOrders.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-teal bg-opacity-20 rounded-lg flex items-center justify-center">
                <Send className="text-medical-teal" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ready for Delivery */}
      <Card>
        <CardContent className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h4 className="text-lg font-semibold text-medical-text">آماده تحویل</h4>
            <p className="text-sm text-gray-500">نتایج آماده برای تحویل به بیماران</p>
          </div>

          {filteredReadyOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredReadyOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="w-4 h-4 text-medical-teal focus:ring-medical-teal border-gray-300 rounded"
                      />
                      <div className="w-12 h-12 bg-medical-green bg-opacity-20 rounded-lg flex items-center justify-center">
                        <FileText className="text-medical-green w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-medium text-medical-text">{order.patient.name}</h5>
                        <p className="text-sm text-gray-500">{order.orderNumber}</p>
                        <div className="flex items-center space-x-4 space-x-reverse mt-1">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{order.patient.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{formatDate(order.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                        مشاهده
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                        دانلود
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4" />
                        ایمیل
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleDelivery(order.id)}
                        className="bg-medical-green hover:bg-opacity-90 text-white"
                        disabled={deliverResultMutation.isPending}
                      >
                        <Send className="w-4 h-4" />
                        تحویل
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {order.services.length} آزمایش • 
                        {order.results?.filter(r => r.status === "validated").length || 0} تایید شده
                      </span>
                      <Badge variant="outline" className="bg-medical-green bg-opacity-20 text-medical-green">
                        آماده تحویل
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-500 mb-2">نتیجه‌ای آماده تحویل نیست</h4>
              <p className="text-sm text-gray-400">هیچ نتیجه‌ای برای تحویل آماده نشده است</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recently Delivered */}
      <Card>
        <CardContent className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h4 className="text-lg font-semibold text-medical-text">تحویل‌های اخیر</h4>
            <p className="text-sm text-gray-500">نتایج تحویل داده شده</p>
          </div>

          {filteredDeliveredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredDeliveredOrders.slice(0, 10).map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="text-medical-green w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-medium text-medical-text">{order.patient.name}</h5>
                        <p className="text-sm text-gray-500">{order.orderNumber}</p>
                        <div className="flex items-center space-x-4 space-x-reverse mt-1">
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">تحویل شده: {formatDate(order.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                        مشاهده
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                        دانلود مجدد
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {order.services.length} آزمایش
                      </span>
                      <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        تحویل شده
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredDeliveredOrders.length > 10 && (
                <div className="text-center pt-4">
                  <Button variant="outline">
                    مشاهده بیشتر ({filteredDeliveredOrders.length - 10} مورد)
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">هیچ تحویل اخیری یافت نشد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
