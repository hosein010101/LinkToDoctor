import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Clock, 
  TestTube,
  Filter,
  Grid,
  List as ListIcon
} from "lucide-react";
import type { LabService } from "@/lib/types";

export default function Services() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: services, isLoading } = useQuery<LabService[]>({
    queryKey: ["/api/lab-services"],
  });

  const filteredServices = services?.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }) || [];

  const categories = [...new Set(services?.map(service => service.category) || [])];

  const getCategoryBadge = (category: string) => {
    const categoryMap = {
      "هماتولوژی": { label: "هماتولوژی", class: "bg-red-100 text-red-800" },
      "بیوشیمی": { label: "بیوشیمی", class: "bg-blue-100 text-blue-800" },
      "میکروبیولوژی": { label: "میکروبیولوژی", class: "bg-green-100 text-green-800" },
      "اورولوژی": { label: "اورولوژی", class: "bg-orange-100 text-orange-800" },
      "سرولوژی": { label: "سرولوژی", class: "bg-purple-100 text-purple-800" },
      "هورمون": { label: "هورمون", class: "bg-pink-100 text-pink-800" },
    };
    
    const categoryInfo = categoryMap[category as keyof typeof categoryMap] || 
                        { label: category, class: "bg-gray-100 text-gray-800" };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.class}`}>
        {categoryInfo.label}
      </span>
    );
  };

  const getSampleTypeBadge = (sampleType: string) => {
    const typeMap = {
      "خون": { label: "خون", class: "bg-medical-teal bg-opacity-20 text-medical-teal" },
      "ادرار": { label: "ادرار", class: "bg-medical-blue bg-opacity-20 text-medical-blue" },
      "سواب": { label: "سواب", class: "bg-medical-orange bg-opacity-20 text-medical-orange" },
      "مدفوع": { label: "مدفوع", class: "bg-medical-green bg-opacity-20 text-medical-green" },
    };
    
    const typeInfo = typeMap[sampleType as keyof typeof typeMap] || 
                    { label: sampleType, class: "bg-gray-100 text-gray-600" };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.class}`}>
        {typeInfo.label}
      </span>
    );
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fa-IR').format(parseFloat(price)) + ' تومان';
  };

  if (isLoading) {
    return <div className="p-6">{t('common.loading')}...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-medical-text">{t('services.title')}</h3>
            <Button className="bg-medical-teal hover:bg-opacity-90 text-white">
              <Plus className="ml-2 w-4 h-4" />
              {t('services.addService')}
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('common.search') + '...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={t('common.all') + ' ' + t('services.category')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="">همه دسته‌بندی‌ها</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center bg-white border-blue-500 text-blue-600 hover:bg-blue-50">
              <Filter className="ml-2 w-4 h-4" />
              فیلترهای بیشتر
            </Button>
            
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-none flex-1 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-none flex-1 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                <ListIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <TestTube className="w-5 h-5 text-medical-teal" />
              <span className="text-sm text-gray-600">
                {filteredServices.length} خدمت
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm text-gray-600">
                {categories.length} دسته‌بندی
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm text-gray-600">
                میانگین قیمت: {services ? 
                  formatPrice((services.reduce((sum, s) => sum + parseFloat(s.price), 0) / services.length).toString())
                  : '0 تومان'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                میانگین زمان: {services ? 
                  Math.round(services.reduce((sum, s) => sum + s.turnaroundTime, 0) / services.length)
                  : 0
                } ساعت
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Display */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-medical-text mb-1">{service.name}</h4>
                    <p className="text-sm text-gray-500 mb-2">{service.code}</p>
                    {getCategoryBadge(service.category)}
                  </div>
                  <div className="flex space-x-1 space-x-reverse">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">نوع نمونه:</span>
                    {getSampleTypeBadge(service.sampleType)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">زمان پاسخ:</span>
                    <span className="text-sm font-medium text-medical-text">
                      {service.turnaroundTime} ساعت
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">قیمت:</span>
                    <span className="text-sm font-bold text-medical-green">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>

                {service.preparationInstructions && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600">
                      <strong>دستورالعمل:</strong> {service.preparationInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      خدمت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      کد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      دسته‌بندی
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      نوع نمونه
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      زمان پاسخ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      قیمت
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-medical-text">{service.name}</div>
                          {service.preparationInstructions && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {service.preparationInstructions}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getCategoryBadge(service.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getSampleTypeBadge(service.sampleType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {service.turnaroundTime} ساعت
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-medical-green">
                        {formatPrice(service.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 space-x-reverse">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <TestTube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">خدمتی یافت نشد</h3>
                <p className="text-sm text-gray-400">هیچ خدمتی با این معیارها پیدا نشد</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
