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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Truck, 
  MapPin, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Bell,
  RefreshCw,
  Download,
  Upload,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  Building,
  Thermometer,
  ShoppingCart,
  Zap,
  Settings,
  BarChart3,
  Users,
  Target,
  DollarSign,
  Boxes,
  TestTube2,
  Syringe,
  Archive,
  Smartphone,
  Shield,
  Workflow
} from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: "sampling_kits" | "collection_tubes" | "transport_containers" | "safety_equipment" | "mobile_devices" | "consumables";
  subcategory: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  unit: string;
  unitCost: number;
  supplier: string;
  supplierContact: string;
  lastRestocked: string;
  expirationDate?: string;
  batchNumber?: string;
  location: string;
  isActive: boolean;
  autoReorder: boolean;
  leadTime: number; // days
  usageRate: number; // per day
  description: string;
  serialNumbers?: string[];
  temperatureRequirement?: string;
  storageConditions: string;
}

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  reliability: "excellent" | "good" | "average" | "poor";
  paymentTerms: string;
  deliveryTime: number;
  minimumOrder: number;
  isPreferred: boolean;
  categories: string[];
}

interface StockMovement {
  id: number;
  itemId: number;
  itemName: string;
  type: "incoming" | "outgoing" | "adjustment" | "transfer" | "expired";
  quantity: number;
  date: string;
  reason: string;
  performedBy: string;
  location: string;
  batchNumber?: string;
  notes?: string;
}

interface CollectorKit {
  id: number;
  collectorId: number;
  collectorName: string;
  kitItems: Array<{
    itemId: number;
    itemName: string;
    quantity: number;
    condition: "good" | "needs_maintenance" | "damaged";
  }>;
  lastCheck: string;
  nextCheck: string;
  status: "active" | "maintenance" | "inactive";
  location: string;
}

interface AutoReorderRule {
  id: number;
  itemId: number;
  itemName: string;
  triggerLevel: number;
  orderQuantity: number;
  preferredSupplier: string;
  isActive: boolean;
  lastTriggered?: string;
  averageUsage: number;
  seasonalFactor: number;
}

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample data optimized for home sampling startup
  const sampleInventory: InventoryItem[] = [
    {
      id: 1,
      name: "کیت نمونه‌گیری خون کامل",
      category: "sampling_kits",
      subcategory: "Blood Collection",
      currentStock: 45,
      minThreshold: 20,
      maxCapacity: 100,
      unit: "کیت",
      unitCost: 35000,
      supplier: "شرکت تجهیزات پزشکی آریا",
      supplierContact: "021-88123456",
      lastRestocked: "1403/06/10",
      expirationDate: "1405/06/10",
      batchNumber: "BL2403-001",
      location: "انبار اصلی - قفسه A1",
      isActive: true,
      autoReorder: true,
      leadTime: 3,
      usageRate: 15,
      description: "شامل سرنگ، لوله‌های خون، برچسب و دستکش استریل",
      temperatureRequirement: "2-8°C",
      storageConditions: "خشک و خنک"
    },
    {
      id: 2,
      name: "لوله‌های آزمایش ادرار",
      category: "collection_tubes",
      subcategory: "Urine Collection",
      currentStock: 180,
      minThreshold: 50,
      maxCapacity: 300,
      unit: "عدد",
      unitCost: 8500,
      supplier: "شرکت تجهیزات پزشکی آریا",
      supplierContact: "021-88123456",
      lastRestocked: "1403/06/05",
      expirationDate: "1406/06/05",
      batchNumber: "UR2403-002",
      location: "انبار اصلی - قفسه B2",
      isActive: true,
      autoReorder: true,
      leadTime: 2,
      usageRate: 25,
      description: "لوله‌های استریل با درپوش محکم برای نمونه ادرار",
      storageConditions: "دمای اتاق"
    },
    {
      id: 3,
      name: "یخدان حمل نمونه",
      category: "transport_containers",
      subcategory: "Cold Storage",
      currentStock: 8,
      minThreshold: 3,
      maxCapacity: 15,
      unit: "دستگاه",
      unitCost: 2500000,
      supplier: "تجهیزات سرمایی پارس",
      supplierContact: "021-77654321",
      lastRestocked: "1403/05/20",
      location: "انبار تجهیزات - ردیف C",
      isActive: true,
      autoReorder: false,
      leadTime: 7,
      usageRate: 0.5,
      description: "یخدان پرتابل با کنترل دمای دیجیتال",
      temperatureRequirement: "-20 to +8°C",
      storageConditions: "محیط خشک",
      serialNumbers: ["ICE001", "ICE002", "ICE003", "ICE004", "ICE005", "ICE006", "ICE007", "ICE008"]
    },
    {
      id: 4,
      name: "دستکش نیتریل یکبار مصرف",
      category: "safety_equipment",
      subcategory: "Personal Protection",
      currentStock: 2400,
      minThreshold: 500,
      maxCapacity: 5000,
      unit: "جفت",
      unitCost: 2500,
      supplier: "شرکت تجهیزات ایمنی کوشا",
      supplierContact: "021-44556677",
      lastRestocked: "1403/06/12",
      expirationDate: "1408/06/12",
      batchNumber: "NT2403-003",
      location: "انبار اصلی - قفسه D1",
      isActive: true,
      autoReorder: true,
      leadTime: 1,
      usageRate: 80,
      description: "دستکش نیتریل بدون پودر، مقاوم در برابر مواد شیمیایی",
      storageConditions: "دمای اتاق، دور از نور مستقیم"
    },
    {
      id: 5,
      name: "تبلت نمونه‌گیری اندروید",
      category: "mobile_devices",
      subcategory: "Data Collection",
      currentStock: 12,
      minThreshold: 5,
      maxCapacity: 20,
      unit: "دستگاه",
      unitCost: 8500000,
      supplier: "فناوری اطلاعات پردازش",
      supplierContact: "021-99887766",
      lastRestocked: "1403/04/15",
      location: "دفتر مدیریت - کمد امانات",
      isActive: true,
      autoReorder: false,
      leadTime: 14,
      usageRate: 0.1,
      description: "تبلت مقاوم با اپلیکیشن اختصاصی نمونه‌گیری",
      storageConditions: "محیط خشک و امن",
      serialNumbers: ["TAB001", "TAB002", "TAB003", "TAB004", "TAB005", "TAB006", "TAB007", "TAB008", "TAB009", "TAB010", "TAB011", "TAB012"]
    },
    {
      id: 6,
      name: "برچسب بارکد نمونه",
      category: "consumables",
      subcategory: "Labeling",
      currentStock: 8500,
      minThreshold: 2000,
      maxCapacity: 15000,
      unit: "عدد",
      unitCost: 850,
      supplier: "چاپ و بسته‌بندی آوید",
      supplierContact: "021-33445566",
      lastRestocked: "1403/06/08",
      batchNumber: "LB2403-004",
      location: "انبار اصلی - قفسه E1",
      isActive: true,
      autoReorder: true,
      leadTime: 2,
      usageRate: 120,
      description: "برچسب ضد آب با بارکد یکتا برای شناسایی نمونه‌ها",
      storageConditions: "دمای اتاق، دور از رطوبت"
    }
  ];

  const sampleSuppliers: Supplier[] = [
    {
      id: 1,
      name: "شرکت تجهیزات پزشکی آریا",
      contact: "مهندس احمدی",
      email: "info@ariamedical.ir",
      phone: "021-88123456",
      address: "تهران، خیابان ولیعصر، پلاک 1234",
      rating: 4.8,
      reliability: "excellent",
      paymentTerms: "30 روز نقدی",
      deliveryTime: 2,
      minimumOrder: 1000000,
      isPreferred: true,
      categories: ["sampling_kits", "collection_tubes", "safety_equipment"]
    },
    {
      id: 2,
      name: "تجهیزات سرمایی پارس",
      contact: "مهندس رضایی",
      email: "sales@parscold.com",
      phone: "021-77654321",
      address: "تهران، شهرک صنعتی، خیابان صنعت، پلاک 567",
      rating: 4.5,
      reliability: "good",
      paymentTerms: "45 روز نقدی",
      deliveryTime: 5,
      minimumOrder: 5000000,
      isPreferred: true,
      categories: ["transport_containers"]
    },
    {
      id: 3,
      name: "فناوری اطلاعات پردازش",
      contact: "مهندس موسوی",
      email: "support@itprocess.ir",
      phone: "021-99887766",
      address: "تهران، خیابان آزادی، برج تجارت، طبقه 15",
      rating: 4.2,
      reliability: "good",
      paymentTerms: "60 روز نقدی",
      deliveryTime: 10,
      minimumOrder: 10000000,
      isPreferred: false,
      categories: ["mobile_devices"]
    }
  ];

  const sampleMovements: StockMovement[] = [
    {
      id: 1,
      itemId: 1,
      itemName: "کیت نمونه‌گیری خون کامل",
      type: "outgoing",
      quantity: 15,
      date: "1403/06/15",
      reason: "تحویل به نمونه‌گیر",
      performedBy: "علی محمدی",
      location: "محل مشتری",
      batchNumber: "BL2403-001",
      notes: "تحویل برای پروژه شرکت نفت"
    },
    {
      id: 2,
      itemId: 4,
      itemName: "دستکش نیتریل یکبار مصرف",
      type: "outgoing",
      quantity: 200,
      date: "1403/06/14",
      reason: "مصرف روزانه نمونه‌گیری",
      performedBy: "سارا احمدی",
      location: "کیت‌های نمونه‌گیران",
      batchNumber: "NT2403-003"
    },
    {
      id: 3,
      itemId: 2,
      itemName: "لوله‌های آزمایش ادرار",
      type: "incoming",
      quantity: 500,
      date: "1403/06/05",
      reason: "خرید جدید",
      performedBy: "مهدی رضایی",
      location: "انبار اصلی",
      batchNumber: "UR2403-002",
      notes: "سفارش اضطراری"
    }
  ];

  const sampleCollectorKits: CollectorKit[] = [
    {
      id: 1,
      collectorId: 1,
      collectorName: "محمد تقوی",
      kitItems: [
        { itemId: 1, itemName: "کیت نمونه‌گیری خون", quantity: 5, condition: "good" },
        { itemId: 2, itemName: "لوله ادرار", quantity: 10, condition: "good" },
        { itemId: 4, itemName: "دستکش نیتریل", quantity: 50, condition: "good" },
        { itemId: 5, itemName: "تبلت نمونه‌گیری", quantity: 1, condition: "good" }
      ],
      lastCheck: "1403/06/10",
      nextCheck: "1403/06/20",
      status: "active",
      location: "منطقه شمال تهران"
    },
    {
      id: 2,
      collectorId: 2,
      collectorName: "فاطمه احمدی",
      kitItems: [
        { itemId: 1, itemName: "کیت نمونه‌گیری خون", quantity: 3, condition: "good" },
        { itemId: 2, itemName: "لوله ادرار", quantity: 8, condition: "good" },
        { itemId: 4, itemName: "دستکش نیتریل", quantity: 30, condition: "needs_maintenance" },
        { itemId: 5, itemName: "تبلت نمونه‌گیری", quantity: 1, condition: "good" }
      ],
      lastCheck: "1403/06/08",
      nextCheck: "1403/06/18",
      status: "active",
      location: "منطقه جنوب تهران"
    }
  ];

  const sampleAutoReorders: AutoReorderRule[] = [
    {
      id: 1,
      itemId: 1,
      itemName: "کیت نمونه‌گیری خون کامل",
      triggerLevel: 20,
      orderQuantity: 50,
      preferredSupplier: "شرکت تجهیزات پزشکی آریا",
      isActive: true,
      averageUsage: 15,
      seasonalFactor: 1.2
    },
    {
      id: 2,
      itemId: 4,
      itemName: "دستکش نیتریل یکبار مصرف",
      triggerLevel: 500,
      orderQuantity: 1000,
      preferredSupplier: "شرکت تجهیزات ایمنی کوشا",
      isActive: true,
      lastTriggered: "1403/05/25",
      averageUsage: 80,
      seasonalFactor: 1.0
    }
  ];

  const getStockStatus = (item: InventoryItem) => {
    const ratio = item.currentStock / item.minThreshold;
    if (ratio <= 1) {
      return { label: "کمبود شدید", color: "bg-red-100 text-red-800", progress: (item.currentStock / item.minThreshold) * 100 };
    } else if (ratio <= 1.5) {
      return { label: "کم", color: "bg-yellow-100 text-yellow-800", progress: (item.currentStock / item.minThreshold) * 100 };
    } else {
      return { label: "مناسب", color: "bg-green-100 text-green-800", progress: Math.min((item.currentStock / item.maxCapacity) * 100, 100) };
    }
  };

  const getCategoryIcon = (category: string) => {
    const iconMap = {
      "sampling_kits": TestTube2,
      "collection_tubes": Syringe,
      "transport_containers": Archive,
      "safety_equipment": Shield,
      "mobile_devices": Smartphone,
      "consumables": Package
    };
    return iconMap[category as keyof typeof iconMap] || Package;
  };

  const getCategoryColor = (category: string) => {
    const colorMap = {
      "sampling_kits": "bg-blue-100 text-blue-800",
      "collection_tubes": "bg-green-100 text-green-800",
      "transport_containers": "bg-purple-100 text-purple-800",
      "safety_equipment": "bg-red-100 text-red-800",
      "mobile_devices": "bg-indigo-100 text-indigo-800",
      "consumables": "bg-gray-100 text-gray-800"
    };
    return colorMap[category as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' ریال';
  };

  const filteredInventory = sampleInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "low" && item.currentStock <= item.minThreshold) ||
                         (filterStatus === "normal" && item.currentStock > item.minThreshold);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValue = sampleInventory.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const lowStockItems = sampleInventory.filter(item => item.currentStock <= item.minThreshold);
  const criticalItems = sampleInventory.filter(item => item.currentStock <= item.minThreshold * 0.5);

  return (
    <div className="space-y-6 pb-20">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل موجودی</p>
                <p className="text-2xl font-bold text-gray-900">{sampleInventory.length}</p>
                <p className="text-sm text-green-600">آیتم</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Boxes className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ارزش کل</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(totalValue / 1000000).toFixed(1)}
                </p>
                <p className="text-sm text-green-600">میلیون ریال</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کمبود موجودی</p>
                <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                <p className="text-sm text-red-600">آیتم</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نمونه‌گیران فعال</p>
                <p className="text-2xl font-bold text-gray-900">{sampleCollectorKits.filter(k => k.status === "active").length}</p>
                <p className="text-sm text-blue-600">کیت فعال</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalItems.length > 0 && (
        <Card className="card-professional border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-medium text-red-800">هشدار: کمبود شدید موجودی</h3>
                <p className="text-sm text-red-600">
                  {criticalItems.length} آیتم نیاز به تأمین فوری دارند
                </p>
              </div>
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white mr-auto">
                سفارش اضطراری
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2 space-x-reverse">
            <BarChart3 className="w-4 h-4" />
            <span>نمای کلی</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center space-x-2 space-x-reverse">
            <Package className="w-4 h-4" />
            <span>مدیریت موجودی</span>
          </TabsTrigger>
          <TabsTrigger value="kits" className="flex items-center space-x-2 space-x-reverse">
            <Home className="w-4 h-4" />
            <span>کیت‌های نمونه‌گیری</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center space-x-2 space-x-reverse">
            <Truck className="w-4 h-4" />
            <span>تأمین‌کنندگان</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center space-x-2 space-x-reverse">
            <Workflow className="w-4 h-4" />
            <span>خودکارسازی</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stock Status Chart */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>وضعیت موجودی بر اساس دسته‌بندی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(sampleInventory.map(item => item.category))).map(category => {
                    const categoryItems = sampleInventory.filter(item => item.category === category);
                    const totalItems = categoryItems.length;
                    const lowStockCount = categoryItems.filter(item => item.currentStock <= item.minThreshold).length;
                    const IconComponent = getCategoryIcon(category);
                    
                    return (
                      <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {category === "sampling_kits" && "کیت‌های نمونه‌گیری"}
                              {category === "collection_tubes" && "لوله‌های جمع‌آوری"}
                              {category === "transport_containers" && "ظروف حمل"}
                              {category === "safety_equipment" && "تجهیزات ایمنی"}
                              {category === "mobile_devices" && "دستگاه‌های همراه"}
                              {category === "consumables" && "مواد مصرفی"}
                            </h4>
                            <p className="text-sm text-gray-600">{totalItems} آیتم</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {lowStockCount > 0 && (
                            <Badge className="bg-red-100 text-red-800 mb-1">
                              {lowStockCount} کمبود
                            </Badge>
                          )}
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${lowStockCount > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${((totalItems - lowStockCount) / totalItems) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Movements */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>حرکات اخیر موجودی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleMovements.slice(0, 5).map(movement => (
                    <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          movement.type === "incoming" ? "bg-green-100" : 
                          movement.type === "outgoing" ? "bg-red-100" : "bg-blue-100"
                        }`}>
                          {movement.type === "incoming" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : movement.type === "outgoing" ? (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{movement.itemName}</p>
                          <p className="text-xs text-gray-600">{movement.reason}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium text-sm ${
                          movement.type === "incoming" ? "text-green-600" : "text-red-600"
                        }`}>
                          {movement.type === "incoming" ? "+" : "-"}{movement.quantity}
                        </p>
                        <p className="text-xs text-gray-600">{movement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventory Management Tab */}
        <TabsContent value="inventory" className="mt-6">
          <div className="space-y-6">
            {/* Filters */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <Input
                      placeholder="جستجو در موجودی..."
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
                        <SelectItem value="sampling_kits">کیت‌های نمونه‌گیری</SelectItem>
                        <SelectItem value="collection_tubes">لوله‌های جمع‌آوری</SelectItem>
                        <SelectItem value="transport_containers">ظروف حمل</SelectItem>
                        <SelectItem value="safety_equipment">تجهیزات ایمنی</SelectItem>
                        <SelectItem value="mobile_devices">دستگاه‌های همراه</SelectItem>
                        <SelectItem value="consumables">مواد مصرفی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="وضعیت موجودی" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                        <SelectItem value="low">کمبود موجودی</SelectItem>
                        <SelectItem value="normal">موجودی مناسب</SelectItem>
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
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      آیتم جدید
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                const IconComponent = getCategoryIcon(item.category);
                
                return (
                  <Card key={item.id} className="card-professional hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                            <p className="text-xs text-gray-600">{item.subcategory}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedItem(item)}>
                              <Eye className="w-4 h-4 ml-2" />
                              مشاهده جزئیات
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setShowMovementForm(true)}>
                              <RefreshCw className="w-4 h-4 ml-2" />
                              حرکت موجودی
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش
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
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">موجودی فعلی:</span>
                          <span className="font-medium">{item.currentStock} {item.unit}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>حداقل: {item.minThreshold}</span>
                            <span>حداکثر: {item.maxCapacity}</span>
                          </div>
                          <Progress value={stockStatus.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">وضعیت:</span>
                          <Badge className={stockStatus.color}>{stockStatus.label}</Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">قیمت واحد:</span>
                          <span className="text-sm font-medium">{formatCurrency(item.unitCost)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">ارزش کل:</span>
                          <span className="text-sm font-medium text-green-600">
                            {formatCurrency(item.currentStock * item.unitCost)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">محل:</span>
                          <span className="text-xs">{item.location}</span>
                        </div>

                        {item.expirationDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">انقضا:</span>
                            <span className="text-xs text-orange-600">{item.expirationDate}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 space-x-reverse pt-2">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category === "sampling_kits" && "کیت نمونه‌گیری"}
                            {item.category === "collection_tubes" && "لوله جمع‌آوری"}
                            {item.category === "transport_containers" && "ظروف حمل"}
                            {item.category === "safety_equipment" && "تجهیزات ایمنی"}
                            {item.category === "mobile_devices" && "دستگاه همراه"}
                            {item.category === "consumables" && "مواد مصرفی"}
                          </Badge>
                          {item.autoReorder && (
                            <Badge className="bg-blue-100 text-blue-800">
                              <Zap className="w-3 h-3 ml-1" />
                              خودکار
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* Collector Kits Tab */}
        <TabsContent value="kits" className="mt-6">
          <div className="space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>کیت‌های نمونه‌گیران</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 ml-2" />
                    کیت جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleCollectorKits.map((kit) => (
                    <div key={kit.id} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {kit.collectorName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900">{kit.collectorName}</h3>
                            <p className="text-sm text-gray-600">
                              <MapPin className="w-4 h-4 inline ml-1" />
                              {kit.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Badge className={
                            kit.status === "active" ? "bg-green-100 text-green-800" :
                            kit.status === "maintenance" ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }>
                            {kit.status === "active" && "فعال"}
                            {kit.status === "maintenance" && "تعمیر"}
                            {kit.status === "inactive" && "غیرفعال"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 ml-2" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <RefreshCw className="w-4 h-4 ml-2" />
                                بررسی کیت
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Package className="w-4 h-4 ml-2" />
                                تکمیل کیت
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kit.kitItems.map((kitItem, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{kitItem.itemName}</span>
                              <Badge className={
                                kitItem.condition === "good" ? "bg-green-100 text-green-800" :
                                kitItem.condition === "needs_maintenance" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"
                              }>
                                {kitItem.condition === "good" && "سالم"}
                                {kitItem.condition === "needs_maintenance" && "نیاز به تعمیر"}
                                {kitItem.condition === "damaged" && "آسیب دیده"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">تعداد: {kitItem.quantity}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <div>
                          <Clock className="w-4 h-4 inline ml-1" />
                          آخرین بررسی: {kit.lastCheck}
                        </div>
                        <div>
                          <Calendar className="w-4 h-4 inline ml-1" />
                          بررسی بعدی: {kit.nextCheck}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="mt-6">
          <div className="space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>تأمین‌کنندگان</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 ml-2" />
                    تأمین‌کننده جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleSuppliers.map((supplier) => (
                    <div key={supplier.id} className="p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{supplier.name}</h3>
                            <p className="text-sm text-gray-600">{supplier.contact}</p>
                          </div>
                        </div>
                        {supplier.isPreferred && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="w-3 h-3 ml-1" />
                            ترجیحی
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">امتیاز:</span>
                          <div className="flex items-center space-x-1 space-x-reverse">
                            <span className="font-medium">{supplier.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-xs ${i < Math.floor(supplier.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">قابلیت اطمینان:</span>
                          <Badge className={
                            supplier.reliability === "excellent" ? "bg-green-100 text-green-800" :
                            supplier.reliability === "good" ? "bg-blue-100 text-blue-800" :
                            supplier.reliability === "average" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }>
                            {supplier.reliability === "excellent" && "عالی"}
                            {supplier.reliability === "good" && "خوب"}
                            {supplier.reliability === "average" && "متوسط"}
                            {supplier.reliability === "poor" && "ضعیف"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">زمان تحویل:</span>
                          <span>{supplier.deliveryTime} روز</span>
                        </div>

                        <div>
                          <span className="text-gray-600">دسته‌بندی‌ها:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {supplier.categories.map((cat, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cat === "sampling_kits" && "کیت نمونه‌گیری"}
                                {cat === "collection_tubes" && "لوله جمع‌آوری"}
                                {cat === "transport_containers" && "ظروف حمل"}
                                {cat === "safety_equipment" && "تجهیزات ایمنی"}
                                {cat === "mobile_devices" && "دستگاه همراه"}
                                {cat === "consumables" && "مواد مصرفی"}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>حداقل سفارش: {formatCurrency(supplier.minimumOrder)}</span>
                            <span>شرایط: {supplier.paymentTerms}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="mt-6">
          <div className="space-y-6">
            {/* Auto-reorder Rules */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>قوانین سفارش خودکار</span>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 ml-2" />
                    قانون جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleAutoReorders.map((rule) => (
                    <div key={rule.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 space-x-reverse mb-2">
                            <h3 className="font-semibold text-gray-900">{rule.itemName}</h3>
                            <Switch checked={rule.isActive} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">سطح آستانه:</span>
                              <p className="font-medium">{rule.triggerLevel} واحد</p>
                            </div>
                            <div>
                              <span className="text-gray-600">مقدار سفارش:</span>
                              <p className="font-medium">{rule.orderQuantity} واحد</p>
                            </div>
                            <div>
                              <span className="text-gray-600">تأمین‌کننده:</span>
                              <p className="font-medium">{rule.preferredSupplier}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">مصرف روزانه:</span>
                              <p className="font-medium">{rule.averageUsage} واحد</p>
                            </div>
                          </div>
                          {rule.lastTriggered && (
                            <p className="text-xs text-gray-500 mt-2">
                              آخرین اجرا: {rule.lastTriggered}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش قانون
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Zap className="w-4 h-4 ml-2" />
                              اجرای دستی
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 ml-2" />
                              حذف قانون
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Smart Predictions */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>پیش‌بینی هوشمند موجودی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-3">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-blue-900">پیش‌بینی تقاضا</h3>
                    </div>
                    <p className="text-sm text-blue-700 mb-2">
                      بر اساس روند مصرف، کیت‌های نمونه‌گیری خون تا 5 روز آینده تمام خواهد شد.
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      سفارش پیشنهادی
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-medium text-green-900">بهینه‌سازی موجودی</h3>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      با کاهش 15% موجودی دستکش، می‌توان 2.5 میلیون ریال در کاهش هزینه صرفه‌جویی کرد.
                    </p>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-700">
                      اعمال تغییرات
                    </Button>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse mb-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-medium text-yellow-900">هشدار انقضا</h3>
                    </div>
                    <p className="text-sm text-yellow-700 mb-2">
                      3 آیتم طی 30 روز آینده منقضی خواهند شد. برنامه‌ریزی مصرف پیشنهاد می‌شود.
                    </p>
                    <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-700">
                      مشاهده جزئیات
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Item Details Modal */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                جزئیات آیتم: {selectedItem.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">نام آیتم</label>
                  <p className="text-gray-900 font-semibold">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">دسته‌بندی</label>
                  <p className="text-gray-900">{selectedItem.subcategory}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">توضیحات</label>
                  <p className="text-gray-900">{selectedItem.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">تأمین‌کننده</label>
                  <p className="text-gray-900">{selectedItem.supplier}</p>
                  <p className="text-sm text-gray-600">{selectedItem.supplierContact}</p>
                </div>
                {selectedItem.batchNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">شماره بچ</label>
                    <p className="text-gray-900">{selectedItem.batchNumber}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">موجودی فعلی</label>
                    <p className="text-gray-900 font-semibold">{selectedItem.currentStock} {selectedItem.unit}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">حداقل موجودی</label>
                    <p className="text-gray-900">{selectedItem.minThreshold} {selectedItem.unit}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">قیمت واحد</label>
                    <p className="text-gray-900">{formatCurrency(selectedItem.unitCost)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ارزش کل</label>
                    <p className="text-gray-900 font-semibold text-green-600">
                      {formatCurrency(selectedItem.currentStock * selectedItem.unitCost)}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">محل نگهداری</label>
                  <p className="text-gray-900">{selectedItem.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">شرایط نگهداری</label>
                  <p className="text-gray-900">{selectedItem.storageConditions}</p>
                </div>
                {selectedItem.expirationDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">تاریخ انقضا</label>
                    <p className="text-orange-600 font-semibold">{selectedItem.expirationDate}</p>
                  </div>
                )}
                {selectedItem.serialNumbers && selectedItem.serialNumbers.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">شماره‌های سریال</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedItem.serialNumbers.map((serial, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {serial}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}