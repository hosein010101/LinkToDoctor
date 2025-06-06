import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { IOSSwitch } from "@/components/ui/ios-switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  User, 
  Edit, 
  CheckCircle, 
  AlertCircle, 
  Truck,
  Clock
} from "lucide-react";
import type { Collector, LabOrder } from "@/lib/types";

export default function Collectors() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: collectors, isLoading } = useQuery<Collector[]>({
    queryKey: ["/api/collectors"],
  });

  const { data: orders } = useQuery<LabOrder[]>({
    queryKey: ["/api/lab-orders"],
  });

  const updateCollectorStatusMutation = useMutation({
    mutationFn: async ({ 
      collectorId, 
      status, 
      lat, 
      lng 
    }: { 
      collectorId: number; 
      status: string; 
      lat?: number; 
      lng?: number; 
    }) => {
      const response = await apiRequest("PATCH", `/api/collectors/${collectorId}/status`, {
        status,
        lat,
        lng,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/collectors"] });
      toast({
        title: "موفقیت",
        description: "وضعیت نمونه‌گیر به‌روزرسانی شد",
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

  const filteredCollectors = collectors?.filter((collector) =>
    collector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collector.phone.includes(searchTerm)
  ) || [];

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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      available: { label: "آماده", class: "bg-medical-green bg-opacity-20 text-medical-green" },
      busy: { label: "مشغول", class: "bg-medical-orange bg-opacity-20 text-medical-orange" },
      offline: { label: "آفلاین", class: "bg-gray-100 text-gray-600" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.offline;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getCollectorOrders = (collectorId: number) => {
    return orders?.filter(order => 
      order.collectorId === collectorId && 
      (order.status === "collection_scheduled" || order.status === "collected")
    ) || [];
  };

  const handleStatusChange = (collectorId: number, newStatus: string) => {
    updateCollectorStatusMutation.mutate({
      collectorId,
      status: newStatus,
    });
  };

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  const availableCollectors = filteredCollectors.filter(c => c.status === "available");
  const busyCollectors = filteredCollectors.filter(c => c.status === "busy");
  const offlineCollectors = filteredCollectors.filter(c => c.status === "offline");

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-medical-text">مدیریت نمونه‌گیران</h3>
            <Button className="bg-medical-teal hover:bg-opacity-90 text-white">
              <Plus className="ml-2 w-4 h-4" />
              نمونه‌گیر جدید
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="جستجوی نمونه‌گیر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">کل نمونه‌گیران</p>
                <p className="text-2xl font-bold text-medical-text">{filteredCollectors.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-teal bg-opacity-20 rounded-lg flex items-center justify-center">
                <User className="text-medical-teal" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">آماده</p>
                <p className="text-2xl font-bold text-medical-green">{availableCollectors.length}</p>
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
                <p className="text-sm text-gray-500 mb-1">مشغول</p>
                <p className="text-2xl font-bold text-medical-orange">{busyCollectors.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                <Truck className="text-medical-orange" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">آفلاین</p>
                <p className="text-2xl font-bold text-gray-600">{offlineCollectors.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-gray-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Collectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollectors.map((collector) => {
          const collectorOrders = getCollectorOrders(collector.id);
          return (
            <Card key={collector.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-medical-teal bg-opacity-20 rounded-full flex items-center justify-center">
                      {getStatusIcon(collector.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-medical-text">{collector.name}</h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Phone className="w-3 h-3 ml-1" />
                        {collector.phone}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">وضعیت:</span>
                    {getStatusBadge(collector.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">فعال:</span>
                    <IOSSwitch 
                      checked={collector.isActive}
                      onCheckedChange={(checked) => {
                        // Update collector active status
                        console.log(`Toggle active status for ${collector.id}: ${checked}`);
                      }}
                    />
                  </div>

                  {collector.currentLat && collector.currentLng && (
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">موقعیت ردیابی شده</span>
                    </div>
                  )}

                  {collectorOrders.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">سفارشات فعال:</span>
                        <Badge variant="outline">{collectorOrders.length}</Badge>
                      </div>
                      <div className="mt-2 space-y-1">
                        {collectorOrders.slice(0, 2).map((order) => (
                          <div key={order.id} className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 ml-1" />
                            {order.orderNumber}
                          </div>
                        ))}
                        {collectorOrders.length > 2 && (
                          <div className="text-xs text-gray-400">
                            و {collectorOrders.length - 2} سفارش دیگر...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2 space-x-reverse">
                    {collector.status === "available" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(collector.id, "busy")}
                        disabled={updateCollectorStatusMutation.isPending}
                      >
                        مشغول کردن
                      </Button>
                    )}
                    {collector.status === "busy" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(collector.id, "available")}
                        disabled={updateCollectorStatusMutation.isPending}
                      >
                        آماده کردن
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(
                        collector.id, 
                        collector.status === "offline" ? "available" : "offline"
                      )}
                      disabled={updateCollectorStatusMutation.isPending}
                    >
                      {collector.status === "offline" ? "آنلاین کردن" : "آفلاین کردن"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {filteredCollectors.length === 0 && (
          <div className="col-span-full text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">نمونه‌گیری یافت نشد</h3>
            <p className="text-sm text-gray-400">هیچ نمونه‌گیری با این معیارها پیدا نشد</p>
          </div>
        )}
      </div>
    </div>
  );
}
