import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IOSSwitch } from "@/components/ui/ios-switch";
import { 
  Package, 
  List, 
  DollarSign, 
  Edit, 
  Plus, 
  FileSpreadsheet,
  TestTube2,
  Search,
  Filter,
  Eye,
  Trash2,
  MoreHorizontal,
  Upload,
  Download,
  Image,
  Settings,
  Star,
  Building2,
  Palette,
  GripVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  RefreshCw,
  FileText,
  Tag,
  Shield,
  Target,
  Percent
} from "lucide-react";

interface LabPackage {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  isActive: boolean;
  isRecommended: boolean;
  isCorporateOnly: boolean;
  testsIncluded: string[];
  imageUrl?: string;
  notes?: string;
  createdAt: string;
}

interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  serviceCount: number;
  isActive: boolean;
  order: number;
}

interface LabService {
  id: number;
  name: string;
  code: string;
  description: string;
  category: string;
  basePrice: number;
  currentPrice: number;
  tags: string[];
  isVisible: boolean;
  instructionsPdf?: string;
  preparationInstructions?: string;
  sampleType: string;
  turnaroundTime: number;
}

interface Tariff {
  id: number;
  name: string;
  type: "insurance" | "organization" | "direct";
  organization?: string;
  discountPercentage: number;
  isActive: boolean;
  services: Array<{
    serviceId: number;
    serviceName: string;
    standardPrice: number;
    tariffPrice: number;
    discount: number;
  }>;
  validFrom: string;
  validTo?: string;
}

export default function TestPackages() {
  const [activeTab, setActiveTab] = useState("packages");
  const [selectedPackage, setSelectedPackage] = useState<LabPackage | null>(null);
  const [selectedService, setSelectedService] = useState<LabService | null>(null);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTariffForm, setShowTariffForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currency, setCurrency] = useState("rial");

  // Sample data
  const samplePackages: LabPackage[] = [
    {
      id: 1,
      name: "پکیج چکاپ کامل",
      description: "شامل آزمایش‌های خون کامل، ادرار، قند و کلسترول",
      category: "چکاپ عمومی",
      price: 850000,
      originalPrice: 1200000,
      isActive: true,
      isRecommended: true,
      isCorporateOnly: false,
      testsIncluded: ["CBC", "FBS", "Cholesterol", "Urine Analysis"],
      imageUrl: "/packages/checkup.jpg",
      notes: "پکیج محبوب برای چکاپ سالانه",
      createdAt: "1403/05/15"
    },
    {
      id: 2,
      name: "پکیج دیابت",
      description: "مجموعه آزمایش‌های تخصصی برای کنترل دیابت",
      category: "تخصصی",
      price: 650000,
      originalPrice: 750000,
      isActive: true,
      isRecommended: false,
      isCorporateOnly: false,
      testsIncluded: ["FBS", "HbA1c", "Fructosamine"],
      notes: "مناسب برای بیماران دیابتی",
      createdAt: "1403/05/10"
    },
    {
      id: 3,
      name: "پکیج سازمانی پتروشیمی",
      description: "پکیج ویژه کارکنان صنایع پتروشیمی",
      category: "سازمانی",
      price: 1200000,
      isActive: true,
      isRecommended: false,
      isCorporateOnly: true,
      testsIncluded: ["CBC", "Liver Function", "Kidney Function", "Toxicology"],
      notes: "شامل آزمایش‌های سم‌شناسی",
      createdAt: "1403/04/25"
    }
  ];

  const sampleCategories: ServiceCategory[] = [
    {
      id: 1,
      name: "آزمایش‌های خون",
      description: "تمامی آزمایش‌های مربوط به خون",
      icon: "🩸",
      color: "bg-red-100 text-red-800",
      serviceCount: 45,
      isActive: true,
      order: 1
    },
    {
      id: 2,
      name: "آزمایش‌های ادرار",
      description: "آزمایش‌های مختلف ادرار",
      icon: "🧪",
      color: "bg-yellow-100 text-yellow-800",
      serviceCount: 12,
      isActive: true,
      order: 2
    },
    {
      id: 3,
      name: "آزمایش‌های هورمونی",
      description: "آزمایش‌های غدد و هورمون‌ها",
      icon: "⚗️",
      color: "bg-purple-100 text-purple-800",
      serviceCount: 28,
      isActive: true,
      order: 3
    },
    {
      id: 4,
      name: "آزمایش‌های میکروب‌شناسی",
      description: "آزمایش‌های باکتری و قارچ",
      icon: "🦠",
      color: "bg-green-100 text-green-800",
      serviceCount: 15,
      isActive: true,
      order: 4
    }
  ];

  const sampleServices: LabService[] = [
    {
      id: 1,
      name: "خون کامل (CBC)",
      code: "CBC001",
      description: "شمارش کامل سلول‌های خون",
      category: "آزمایش‌های خون",
      basePrice: 85000,
      currentPrice: 85000,
      tags: ["خون", "کامل", "شمارش"],
      isVisible: true,
      preparationInstructions: "ناشتا نیست",
      sampleType: "خون ورید",
      turnaroundTime: 4
    },
    {
      id: 2,
      name: "قند خون ناشتا (FBS)",
      code: "FBS001",
      description: "اندازه‌گیری قند خون در حالت ناشتا",
      category: "آزمایش‌های خون",
      basePrice: 45000,
      currentPrice: 45000,
      tags: ["قند", "ناشتا", "دیابت"],
      isVisible: true,
      preparationInstructions: "12 ساعت ناشتا",
      sampleType: "خون ورید",
      turnaroundTime: 2
    },
    {
      id: 3,
      name: "کلسترول کامل",
      code: "CHOL001",
      description: "اندازه‌گیری چربی‌های خون",
      category: "آزمایش‌های خون",
      basePrice: 120000,
      currentPrice: 120000,
      tags: ["چربی", "کلسترول", "قلب"],
      isVisible: true,
      preparationInstructions: "12 ساعت ناشتا",
      sampleType: "خون ورید",
      turnaroundTime: 6
    }
  ];

  const sampleTariffs: Tariff[] = [
    {
      id: 1,
      name: "تعرفه تامین اجتماعی",
      type: "insurance",
      organization: "تامین اجتماعی",
      discountPercentage: 15,
      isActive: true,
      services: [
        {
          serviceId: 1,
          serviceName: "خون کامل (CBC)",
          standardPrice: 85000,
          tariffPrice: 72250,
          discount: 15
        },
        {
          serviceId: 2,
          serviceName: "قند خون ناشتا",
          standardPrice: 45000,
          tariffPrice: 38250,
          discount: 15
        }
      ],
      validFrom: "1403/01/01",
      validTo: "1403/12/29"
    },
    {
      id: 2,
      name: "تعرفه شرکت پتروشیمی",
      type: "organization",
      organization: "شرکت پتروشیمی ایران",
      discountPercentage: 25,
      isActive: true,
      services: [
        {
          serviceId: 1,
          serviceName: "خون کامل (CBC)",
          standardPrice: 85000,
          tariffPrice: 63750,
          discount: 25
        }
      ],
      validFrom: "1403/03/01",
      validTo: "1404/03/01"
    }
  ];

  const formatCurrency = (amount: number) => {
    if (currency === "toman") {
      return new Intl.NumberFormat('fa-IR').format(amount / 10) + ' تومان';
    }
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">فعال</Badge> :
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">غیرفعال</Badge>;
  };

  const filteredPackages = samplePackages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || pkg.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مدیریت محتوا اپلیکیشن</h1>
          <p className="text-gray-600 mt-1">مدیریت پکیج‌ها، خدمات، قیمت‌گذاری و تعرفه‌ها</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button 
            variant="outline"
            onClick={() => setShowPackageForm(true)}
          >
            <Plus className="w-4 h-4 ml-2" />
            پکیج جدید
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowServiceForm(true)}
          >
            <Plus className="w-4 h-4 ml-2" />
            خدمت جدید
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="packages" className="flex items-center space-x-2 space-x-reverse">
            <Package className="w-4 h-4" />
            <span>پکیج‌های آزمایش</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2 space-x-reverse">
            <List className="w-4 h-4" />
            <span>دسته‌بندی خدمات</span>
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center space-x-2 space-x-reverse">
            <DollarSign className="w-4 h-4" />
            <span>مدیریت قیمت</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center space-x-2 space-x-reverse">
            <Edit className="w-4 h-4" />
            <span>ویرایش خدمات</span>
          </TabsTrigger>
          <TabsTrigger value="new-package" className="flex items-center space-x-2 space-x-reverse">
            <Plus className="w-4 h-4" />
            <span>پکیج جدید</span>
          </TabsTrigger>
          <TabsTrigger value="tariffs" className="flex items-center space-x-2 space-x-reverse">
            <FileSpreadsheet className="w-4 h-4" />
            <span>مدیریت تعرفه</span>
          </TabsTrigger>
        </TabsList>

        {/* Lab Packages Tab */}
        <TabsContent value="packages" className="mt-6">
          <div className="space-y-6">
            {/* Filters */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input
                      placeholder="جستجو در پکیج‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه دسته‌ها</SelectItem>
                        <SelectItem value="چکاپ عمومی">چکاپ عمومی</SelectItem>
                        <SelectItem value="تخصصی">تخصصی</SelectItem>
                        <SelectItem value="سازمانی">سازمانی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button variant="outline" className="w-full">
                      <Filter className="w-4 h-4 ml-2" />
                      فیلترهای پیشرفته
                    </Button>
                  </div>
                  <div>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      <Download className="w-4 h-4 ml-2" />
                      صدور گزارش
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="card-professional hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        {pkg.imageUrl ? (
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={pkg.imageUrl} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              <Package className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                          <p className="text-sm text-gray-600">{pkg.category}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setSelectedPackage(pkg)}>
                            <Eye className="w-4 h-4 ml-2" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="w-4 h-4 ml-2" />
                            تغییر تصویر
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{pkg.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">وضعیت:</span>
                        {getStatusBadge(pkg.isActive)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">قیمت:</span>
                        <div className="text-right">
                          <span className="font-semibold text-green-600">{formatCurrency(pkg.price)}</span>
                          {pkg.originalPrice && (
                            <span className="text-xs text-gray-500 line-through mr-2">
                              {formatCurrency(pkg.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">آزمایش‌ها:</span>
                        <span className="text-sm font-medium">{pkg.testsIncluded.length} مورد</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {pkg.isRecommended && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 ml-1" />
                            پیشنهادی
                          </Badge>
                        )}
                        {pkg.isCorporateOnly && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Building2 className="w-3 h-3 ml-1" />
                            سازمانی
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <IOSSwitch checked={pkg.isActive} />
                        <span className="text-xs text-gray-500">فعال/غیرفعال</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Service Categories Tab */}
        <TabsContent value="categories" className="mt-6">
          <div className="space-y-6">
            {/* Categories Header */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">دسته‌بندی خدمات</h3>
                    <p className="text-gray-600">مدیریت و سازماندهی دسته‌بندی‌های خدمات آزمایشگاه</p>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowCategoryForm(true)}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    دسته جدید
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleCategories.map((category) => (
                <Card key={category.id} className="card-professional hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="text-2xl">{category.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.serviceCount} خدمت</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button variant="ghost" size="sm">
                          <GripVertical className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Palette className="w-4 h-4 ml-2" />
                              تغییر رنگ
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={category.color}>{category.name}</Badge>
                        {getStatusBadge(category.isActive)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">ترتیب:</span>
                        <span className="text-sm font-medium">#{category.order}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Pricing Management Tab */}
        <TabsContent value="pricing" className="mt-6">
          <div className="space-y-6">
            {/* Pricing Header */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">مدیریت قیمت‌گذاری</h3>
                    <p className="text-gray-600">ویرایش قیمت‌های خدمات و آزمایش‌ها</p>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rial">ریال</SelectItem>
                        <SelectItem value="toman">تومان</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <RefreshCw className="w-4 h-4 ml-2" />
                      به‌روزرسانی همه
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Percent className="w-4 h-4 ml-2" />
                      تغییر گروهی
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Pricing Table */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>قیمت‌گذاری خدمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right p-4 font-medium text-gray-700">کد خدمت</th>
                        <th className="text-right p-4 font-medium text-gray-700">نام خدمت</th>
                        <th className="text-right p-4 font-medium text-gray-700">دسته‌بندی</th>
                        <th className="text-right p-4 font-medium text-gray-700">قیمت پایه</th>
                        <th className="text-right p-4 font-medium text-gray-700">قیمت فعلی</th>
                        <th className="text-right p-4 font-medium text-gray-700">وضعیت</th>
                        <th className="text-right p-4 font-medium text-gray-700">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleServices.map((service) => (
                        <tr key={service.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium">{service.code}</td>
                          <td className="p-4">{service.name}</td>
                          <td className="p-4">{service.category}</td>
                          <td className="p-4">{formatCurrency(service.basePrice)}</td>
                          <td className="p-4">
                            <Input 
                              defaultValue={service.currentPrice}
                              className="w-32 text-center"
                              type="number"
                            />
                          </td>
                          <td className="p-4">{getStatusBadge(service.isVisible)}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Button variant="ghost" size="sm">
                                <Save className="w-4 h-4" />
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Edit Services Tab */}
        <TabsContent value="services" className="mt-6">
          <div className="space-y-6">
            {/* Services List */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>ویرایش خدمات آزمایشگاه</span>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowServiceForm(true)}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    خدمت جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleServices.map((service) => (
                    <div key={service.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 space-x-reverse mb-2">
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <Badge variant="outline">{service.code}</Badge>
                            {service.isVisible ? (
                              <Badge className="bg-green-100 text-green-800">نمایش در اپ</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">مخفی</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                          <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                            <span>دسته: {service.category}</span>
                            <span>•</span>
                            <span>قیمت: {formatCurrency(service.currentPrice)}</span>
                            <span>•</span>
                            <span>زمان پاسخ: {service.turnaroundTime} ساعت</span>
                          </div>
                          <div className="flex items-center space-x-2 space-x-reverse mt-2">
                            {service.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 ml-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <IOSSwitch checked={service.isVisible} />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedService(service)}
                          >
                            <Edit className="w-4 h-4 ml-1" />
                            ویرایش
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Upload className="w-4 h-4 ml-2" />
                                آپلود دستورالعمل
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="w-4 h-4 ml-2" />
                                مشاهده PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Add New Package Tab */}
        <TabsContent value="new-package" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Package Form */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>ایجاد پکیج جدید</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام پکیج *</label>
                    <Input placeholder="نام پکیج آزمایشی" className="border-gray-300" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی *</label>
                    <Select>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">چکاپ عمومی</SelectItem>
                        <SelectItem value="specialized">تخصصی</SelectItem>
                        <SelectItem value="corporate">سازمانی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">آزمایش‌های شامل *</label>
                    <div className="border border-gray-300 rounded-md p-3 max-h-40 overflow-y-auto">
                      {sampleServices.map((service) => (
                        <div key={service.id} className="flex items-center space-x-2 space-x-reverse mb-2">
                          <input type="checkbox" id={`service-${service.id}`} className="rounded" />
                          <label htmlFor={`service-${service.id}`} className="text-sm text-gray-700">
                            {service.name} - {formatCurrency(service.currentPrice)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">قیمت پکیج *</label>
                    <Input placeholder="مبلغ به ریال" type="number" className="border-gray-300" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">تصویر پکیج</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 mb-2">تصویر پکیج را آپلود کنید</p>
                      <Button variant="outline" size="sm">
                        انتخاب تصویر
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                    <Textarea 
                      placeholder="توضیحات کامل پکیج..."
                      className="border-gray-300 min-h-[100px]"
                    />
                  </div>

                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <input type="checkbox" id="recommended" className="rounded" />
                      <label htmlFor="recommended" className="text-sm text-gray-700">پکیج پیشنهادی</label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <input type="checkbox" id="corporate" className="rounded" />
                      <label htmlFor="corporate" className="text-sm text-gray-700">مخصوص سازمان‌ها</label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 space-x-reverse">
                    <Button variant="outline">
                      انصراف
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      ایجاد پکیج
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>پیش‌نمایش پکیج</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900">نام پکیج</h3>
                    <p className="text-sm text-gray-600">دسته‌بندی</p>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">توضیحات پکیج در اینجا نمایش داده می‌شود...</p>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">آزمایش‌های شامل:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• آزمایش نمونه 1</li>
                        <li>• آزمایش نمونه 2</li>
                        <li>• آزمایش نمونه 3</li>
                      </ul>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-green-600">قیمت نهایی</span>
                        <span className="text-xs text-gray-500 line-through">قیمت اصلی</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 ml-1" />
                        پیشنهادی
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tariff Management Tab */}
        <TabsContent value="tariffs" className="mt-6">
          <div className="space-y-6">
            {/* Tariffs Header */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">مدیریت تعرفه‌ها</h3>
                    <p className="text-gray-600">تعرفه‌های بیمه‌ها، سازمان‌ها و مشتریان مستقیم</p>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Button variant="outline">
                      <Download className="w-4 h-4 ml-2" />
                      دانلود Excel
                    </Button>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 ml-2" />
                      آپلود Excel
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setShowTariffForm(true)}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      تعرفه جدید
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tariffs List */}
            <div className="space-y-4">
              {sampleTariffs.map((tariff) => (
                <Card key={tariff.id} className="card-professional">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2 space-x-reverse">
                          <span>{tariff.name}</span>
                          {tariff.type === "insurance" && <Shield className="w-5 h-5 text-blue-600" />}
                          {tariff.type === "organization" && <Building2 className="w-5 h-5 text-purple-600" />}
                          {tariff.type === "direct" && <Target className="w-5 h-5 text-green-600" />}
                        </CardTitle>
                        <p className="text-gray-600">
                          {tariff.organization} - تخفیف {tariff.discountPercentage}%
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {getStatusBadge(tariff.isActive)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="w-4 h-4 ml-2" />
                              صدور Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-right p-2 text-sm font-medium text-gray-700">خدمت</th>
                            <th className="text-right p-2 text-sm font-medium text-gray-700">قیمت استاندارد</th>
                            <th className="text-right p-2 text-sm font-medium text-gray-700">قیمت تعرفه</th>
                            <th className="text-right p-2 text-sm font-medium text-gray-700">تخفیف</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tariff.services.map((service, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="p-2 text-sm">{service.serviceName}</td>
                              <td className="p-2 text-sm">{formatCurrency(service.standardPrice)}</td>
                              <td className="p-2 text-sm font-medium text-green-600">
                                {formatCurrency(service.tariffPrice)}
                              </td>
                              <td className="p-2 text-sm">
                                <Badge className="bg-red-100 text-red-800">
                                  {service.discount}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                      <span>اعتبار: {tariff.validFrom} تا {tariff.validTo || 'نامحدود'}</span>
                      <span>{tariff.services.length} خدمت</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Package Details Modal */}
      {selectedPackage && (
        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                جزئیات پکیج: {selectedPackage.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">نام پکیج</label>
                  <p className="text-gray-900 font-semibold">{selectedPackage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">دسته‌بندی</label>
                  <p className="text-gray-900 font-semibold">{selectedPackage.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">قیمت</label>
                  <p className="text-gray-900 font-semibold text-green-600">
                    {formatCurrency(selectedPackage.price)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">وضعیت</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedPackage.isActive)}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">توضیحات</label>
                <p className="text-gray-900 mt-1">{selectedPackage.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">آزمایش‌های شامل</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {selectedPackage.testsIncluded.map((test, index) => (
                    <Badge key={index} variant="outline">{test}</Badge>
                  ))}
                </div>
              </div>
              
              {selectedPackage.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">یادداشت‌ها</label>
                  <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded">{selectedPackage.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Service Edit Modal */}
      {selectedService && (
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                ویرایش خدمت: {selectedService.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام خدمت *</label>
                <Input defaultValue={selectedService.name} className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">کد خدمت *</label>
                <Input defaultValue={selectedService.code} className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی *</label>
                <Select defaultValue={selectedService.category}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت پایه *</label>
                <Input 
                  defaultValue={selectedService.basePrice} 
                  type="number" 
                  className="border-gray-300" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                <Textarea 
                  defaultValue={selectedService.description}
                  className="border-gray-300 min-h-[80px]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">دستورالعمل آماده‌سازی</label>
                <Textarea 
                  defaultValue={selectedService.preparationInstructions}
                  className="border-gray-300 min-h-[80px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع نمونه</label>
                <Input defaultValue={selectedService.sampleType} className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">زمان پاسخ (ساعت)</label>
                <Input 
                  defaultValue={selectedService.turnaroundTime} 
                  type="number" 
                  className="border-gray-300" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">فایل دستورالعمل PDF</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">آپلود فایل PDF دستورالعمل</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    انتخاب فایل
                  </Button>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <IOSSwitch defaultChecked={selectedService.isVisible} />
                  <label className="text-sm text-gray-700">نمایش در اپلیکیشن</label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse mt-6">
              <Button variant="outline" onClick={() => setSelectedService(null)}>
                انصراف
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                ذخیره تغییرات
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}