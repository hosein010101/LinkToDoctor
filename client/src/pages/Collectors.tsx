import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  const [activeTab, setActiveTab] = useState("overview");
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
      return response;
    },
    onSuccess: () => {
      toast({
        title: "موفقیت",
        description: "وضعیت نمونه‌گیر بروزرسانی شد",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/collectors"] });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در بروزرسانی وضعیت",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  const filteredCollectors = (collectors || []).filter((collector) =>
    collector.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="text-green-600" size={20} />;
      case "busy":
        return <Truck className="text-orange-500" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      available: { color: "bg-green-500", label: "آماده" },
      busy: { color: "bg-orange-500", label: "مشغول" },
      offline: { color: "bg-gray-500", label: "آفلاین" }
    };
    const statusInfo = statusConfig[status] || { color: "bg-gray-500", label: status };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${statusInfo.color}`}>
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

  const availableCollectors = filteredCollectors.filter(c => c.status === "available");
  const busyCollectors = filteredCollectors.filter(c => c.status === "busy");
  const offlineCollectors = filteredCollectors.filter(c => c.status === "offline");

  const getCollectorsToShow = () => {
    switch (activeTab) {
      case "available":
        return availableCollectors;
      case "busy":
        return busyCollectors;
      case "offline":
        return offlineCollectors;
      default:
        return filteredCollectors;
    }
  };

  const collectorsToShow = getCollectorsToShow();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت نمونه‌گیران</h1>
          <p className="text-gray-600 mt-1">نظارت و مدیریت تیم نمونه‌گیری</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="جستجوی نمونه‌گیر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-64 border-gray-200"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="ml-2 w-4 h-4" />
            نمونه‌گیر جدید
          </Button>
        </div>
      </div>

      <div className="w-full mb-8">
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-3 shadow-lg border border-blue-100">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => setActiveTab("overview")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "overview" 
                  ? "bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 text-cyan-800 shadow-lg transform scale-105 border-2 border-cyan-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:shadow-md"
                }
              `}
            >
              <User className="w-5 h-5" />
              <span>نمای کلی</span>
            </button>
            
            <button
              onClick={() => setActiveTab("available")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "available" 
                  ? "bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 text-emerald-800 shadow-lg transform scale-105 border-2 border-emerald-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 hover:shadow-md"
                }
              `}
            >
              <CheckCircle className="w-5 h-5" />
              <span>آماده ({availableCollectors.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab("busy")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "busy" 
                  ? "bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 text-amber-800 shadow-lg transform scale-105 border-2 border-amber-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700 hover:shadow-md"
                }
              `}
            >
              <Truck className="w-5 h-5" />
              <span>مشغول ({busyCollectors.length})</span>
            </button>
            
            <button
              onClick={() => setActiveTab("offline")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-4 py-4 rounded-xl 
                transition-all duration-300 font-semibold text-sm relative overflow-hidden
                ${activeTab === "offline" 
                  ? "bg-gradient-to-br from-gray-100 via-slate-100 to-gray-200 text-gray-800 shadow-lg transform scale-105 border-2 border-gray-300" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-gray-50 hover:to-slate-50 hover:text-gray-700 hover:shadow-md"
                }
              `}
            >
              <AlertCircle className="w-5 h-5" />
              <span>آفلاین ({offlineCollectors.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">کل نمونه‌گیران</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredCollectors.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">آماده</p>
                  <p className="text-2xl font-bold text-green-600">{availableCollectors.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">مشغول</p>
                  <p className="text-2xl font-bold text-orange-600">{busyCollectors.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Truck className="text-orange-600" size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
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
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectorsToShow.map((collector) => {
          const collectorOrders = getCollectorOrders(collector.id);
          return (
            <Card key={collector.id} className="border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {getStatusIcon(collector.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{collector.name}</h4>
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
                    <Switch 
                      checked={collector.isActive}
                      onCheckedChange={(checked) => {
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
                        className="border-gray-200"
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
                        className="border-gray-200"
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
                      className="border-gray-200"
                    >
                      {collector.status === "offline" ? "آنلاین کردن" : "آفلاین کردن"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {collectorsToShow.length === 0 && (
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