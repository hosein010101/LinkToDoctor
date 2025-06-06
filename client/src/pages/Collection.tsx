import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Clock, User, MapPin, Truck, CheckCircle, AlertCircle } from "lucide-react";

interface CollectionOrder {
  id: number;
  orderNumber: string;
  patient: {
    name: string;
    phone: string;
  };
  services: Array<{
    serviceId: number;
  }>;
  status: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  collectionAddress: string;
  priority: string;
}

interface Collector {
  id: number;
  name: string;
  phone: string;
  status: string;
  isActive: boolean;
  currentLat?: string;
  currentLng?: string;
}

export default function Collection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingOrders, isLoading: ordersLoading } = useQuery<CollectionOrder[]>({
    queryKey: ["/api/lab-orders", { status: "registered" }],
  });

  const { data: scheduledOrders } = useQuery<CollectionOrder[]>({
    queryKey: ["/api/lab-orders", { status: "collection_scheduled" }],
  });

  const { data: collectors, isLoading: collectorsLoading } = useQuery<Collector[]>({
    queryKey: ["/api/collectors"],
  });

  const assignCollectorMutation = useMutation({
    mutationFn: async ({ orderId, collectorId }: { orderId: number; collectorId: number }) => {
      const response = await apiRequest("PATCH", `/api/lab-orders/${orderId}/assign-collector`, {
        collectorId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "نمونه‌گیر با موفقیت تخصیص داده شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در تخصیص نمونه‌گیر",
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/lab-orders/${orderId}/status`, {
        status,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "وضعیت سفارش به‌روزرسانی شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی وضعیت",
        variant: "destructive",
      });
    },
  });

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      urgent: { label: "فوری", variant: "destructive" as const },
      high: { label: "مهم", variant: "secondary" as const },
      normal: { label: "عادی", variant: "outline" as const },
      low: { label: "کم", variant: "outline" as const },
    };
    
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || priorityMap.normal;
    return (
      <Badge variant={priorityInfo.variant}>
        {priorityInfo.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4 text-medical-green" />;
      case "busy":
        return <Truck className="w-4 h-4 text-medical-orange" />;
      case "offline":
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  const availableCollectors = collectors?.filter(c => c.isActive && c.status === "available") || [];
  const activeCollectors = collectors?.filter(c => c.status === "busy") || [];

  if (ordersLoading || collectorsLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Collection Queue */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-medical-text">صف نمونه‌گیری</h3>
              <p className="text-sm text-gray-500">مدیریت سفارشات در انتظار نمونه‌گیری</p>
            </div>
            
            <div className="space-y-4">
              {pendingOrders?.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="w-12 h-12 bg-medical-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                        <Clock className="text-medical-orange w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse mb-1">
                          <p className="font-medium text-medical-text">{order.patient.name}</p>
                          {getPriorityBadge(order.priority)}
                        </div>
                        <p className="text-sm text-gray-500">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400">
                          {order.services.length} آزمایش
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-medical-text">
                        {order.scheduledTimeSlot}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        {formatDate(order.scheduledDate)}
                      </p>
                      <div className="flex items-center space-x-1 space-x-reverse mb-2">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate max-w-32">
                          {order.collectionAddress.substring(0, 30)}...
                        </span>
                      </div>
                      
                      {availableCollectors.length > 0 ? (
                        <Button
                          size="sm"
                          className="bg-medical-teal hover:bg-opacity-90 text-white"
                          onClick={() => {
                            assignCollectorMutation.mutate({
                              orderId: order.id,
                              collectorId: availableCollectors[0].id,
                            });
                          }}
                          disabled={assignCollectorMutation.isPending}
                        >
                          تخصیص نمونه‌گیر
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled className="bg-white border-gray-300 text-gray-600">
                          نمونه‌گیر در دسترس نیست
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  هیچ سفارشی در انتظار نمونه‌گیری نیست
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Collections */}
        {scheduledOrders && scheduledOrders.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-medical-text">نمونه‌گیری‌های برنامه‌ریزی شده</h3>
                <p className="text-sm text-gray-500">سفارشات تخصیص یافته به نمونه‌گیران</p>
              </div>
              
              <div className="space-y-4">
                {scheduledOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="w-12 h-12 bg-medical-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                          <Truck className="text-medical-blue w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-medical-text">{order.patient.name}</p>
                          <p className="text-sm text-gray-500">{order.orderNumber}</p>
                          <p className="text-xs text-gray-400">
                            {order.scheduledTimeSlot} - {formatDate(order.scheduledDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              status: "collected",
                            });
                          }}
                        >
                          تایید نمونه‌گیری
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Collectors Panel */}
      <div className="space-y-6">
        {/* Active Collections */}
        <Card>
          <CardContent className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-medical-text">نمونه‌گیری فعال</h3>
              <p className="text-sm text-gray-500">وضعیت نمونه‌گیران</p>
            </div>
            
            <div className="space-y-4">
              {activeCollectors.map((collector) => (
                <div key={collector.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-8 h-8 bg-medical-green bg-opacity-20 rounded-full flex items-center justify-center">
                      {getStatusIcon(collector.status)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-medical-text">{collector.name}</p>
                      <p className="text-xs text-gray-500">در حال نمونه‌گیری</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-medical-green rounded-full animate-pulse-green ml-2"></div>
                        <span className="text-xs text-gray-400">آنلاین</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {activeCollectors.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  هیچ نمونه‌گیر فعالی در حال کار نیست
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Available Collectors */}
        <Card>
          <CardContent className="p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-medical-text">نمونه‌گیران آماده</h3>
              <p className="text-sm text-gray-500">نمونه‌گیران در دسترس</p>
            </div>
            
            <div className="space-y-3">
              {availableCollectors.map((collector) => (
                <div key={collector.id} className="flex items-center space-x-3 space-x-reverse p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-6 h-6 bg-medical-teal bg-opacity-20 rounded-full flex items-center justify-center">
                    {getStatusIcon(collector.status)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-medical-text">{collector.name}</p>
                    <p className="text-xs text-gray-500">{collector.phone}</p>
                  </div>
                </div>
              ))}
              
              {availableCollectors.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  هیچ نمونه‌گیری در دسترس نیست
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-medical-text mb-4">آمار سریع</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">در انتظار:</span>
                <span className="text-sm font-medium text-medical-orange">
                  {pendingOrders?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">در حال انجام:</span>
                <span className="text-sm font-medium text-medical-blue">
                  {scheduledOrders?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">نمونه‌گیران فعال:</span>
                <span className="text-sm font-medium text-medical-green">
                  {activeCollectors.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">نمونه‌گیران آماده:</span>
                <span className="text-sm font-medium text-medical-teal">
                  {availableCollectors.length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
