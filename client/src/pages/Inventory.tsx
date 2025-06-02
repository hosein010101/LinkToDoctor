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
  Plus, 
  Search, 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  Edit, 
  Minus,
  Settings,
  Calendar,
  Truck
} from "lucide-react";
import type { InventoryItem } from "@/lib/types";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventory, isLoading } = useQuery<InventoryItem[]>({
    queryKey: showLowStock ? ["/api/inventory", { lowStock: "true" }] : ["/api/inventory"],
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await apiRequest("PATCH", `/api/inventory/${itemId}/stock`, {
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "موفقیت",
        description: "موجودی به‌روزرسانی شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در به‌روزرسانی موجودی",
        variant: "destructive",
      });
    },
  });

  const filteredInventory = inventory?.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier && item.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(inventory?.map(item => item.category) || [])];
  const lowStockItems = inventory?.filter(item => item.currentStock <= item.minThreshold) || [];

  const getCategoryBadge = (category: string) => {
    const categoryMap = {
      consumables: { label: "مصرفی", class: "bg-blue-100 text-blue-800" },
      equipment: { label: "تجهیزات", class: "bg-purple-100 text-purple-800" },
      reagents: { label: "معرف‌ها", class: "bg-green-100 text-green-800" },
    };
    
    const categoryInfo = categoryMap[category as keyof typeof categoryMap] || 
                        { label: category, class: "bg-gray-100 text-gray-800" };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.class}`}>
        {categoryInfo.label}
      </span>
    );
  };

  const getStockStatus = (item: InventoryItem) => {
    const ratio = item.currentStock / item.minThreshold;
    
    if (ratio <= 1) {
      return { label: "کمبود", class: "bg-red-100 text-red-800", icon: AlertTriangle };
    } else if (ratio <= 1.5) {
      return { label: "کم", class: "bg-yellow-100 text-yellow-800", icon: TrendingDown };
    } else {
      return { label: "مناسب", class: "bg-green-100 text-green-800", icon: Package };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "نامشخص";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  const handleStockUpdate = (itemId: number, quantity: number) => {
    updateStockMutation.mutate({ itemId, quantity });
  };

  if (isLoading) {
    return <div className="p-6">در حال بارگذاری...</div>;
  }

  const totalItems = inventory?.length || 0;
  const totalValue = inventory?.reduce((sum, item) => sum + (item.currentStock * 1000), 0) || 0; // Simplified calculation

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-medical-text">مدیریت موجودی</h3>
            <Button className="bg-medical-teal hover:bg-opacity-90 text-white">
              <Plus className="ml-2 w-4 h-4" />
              کالای جدید
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجوی کالا..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="همه دسته‌بندی‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">همه دسته‌بندی‌ها</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryBadge(category).props.children[1]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant={showLowStock ? "default" : "outline"}
              onClick={() => setShowLowStock(!showLowStock)}
              className={showLowStock ? "bg-medical-orange text-white" : ""}
            >
              <AlertTriangle className="ml-2 w-4 h-4" />
              کمبود موجودی ({lowStockItems.length})
            </Button>
            
            <Button variant="outline">
              <Settings className="ml-2 w-4 h-4" />
              تنظیمات
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Package className="w-5 h-5 text-medical-teal" />
              <span className="text-sm text-gray-600">
                {totalItems} قلم کالا
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <AlertTriangle className="w-5 h-5 text-medical-orange" />
              <span className="text-sm text-gray-600">
                {lowStockItems.length} کمبود موجودی
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm text-gray-600">
                {categories.length} دسته‌بندی
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm text-gray-600">
                ارزش کل: {new Intl.NumberFormat('fa-IR').format(totalValue)} تومان
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">کل موجودی</p>
                <p className="text-2xl font-bold text-medical-text">{totalItems}</p>
              </div>
              <div className="w-12 h-12 bg-medical-teal bg-opacity-20 rounded-lg flex items-center justify-center">
                <Package className="text-medical-teal" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">کمبود موجودی</p>
                <p className="text-2xl font-bold text-medical-orange">{lowStockItems.length}</p>
              </div>
              <div className="w-12 h-12 bg-medical-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-medical-orange" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">مصرفی</p>
                <p className="text-2xl font-bold text-medical-blue">
                  {inventory?.filter(i => i.category === "consumables").length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-blue bg-opacity-20 rounded-lg flex items-center justify-center">
                <Minus className="text-medical-blue" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">تجهیزات</p>
                <p className="text-2xl font-bold text-medical-green">
                  {inventory?.filter(i => i.category === "equipment").length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-medical-green bg-opacity-20 rounded-lg flex items-center justify-center">
                <Settings className="text-medical-green" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کالا
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    دسته‌بندی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    موجودی فعلی
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    حداقل مجاز
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تامین‌کننده
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    آخرین تامین
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-10 h-10 bg-medical-teal bg-opacity-20 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-medical-teal" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-medical-text">{item.itemName}</div>
                            <div className="text-xs text-gray-500">واحد: {item.unit}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(item.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-medical-text">
                          {new Intl.NumberFormat('fa-IR').format(item.currentStock)} {item.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat('fa-IR').format(item.minThreshold)} {item.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.class}`}>
                          <StatusIcon className="w-3 h-3 ml-1" />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.supplier || "نامشخص"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{formatDate(item.lastRestocked)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(item.id, 10)}
                            disabled={updateStockMutation.isPending}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStockUpdate(item.id, -5)}
                            disabled={updateStockMutation.isPending || item.currentStock <= 5}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Truck className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">کالایی یافت نشد</h3>
              <p className="text-sm text-gray-400">هیچ کالایی با این معیارها پیدا نشد</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
