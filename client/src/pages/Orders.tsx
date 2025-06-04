import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Package,
  MapPin,
  Phone,
  Clock,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Truck,
  X,
  Plus,
  FileText,
  Camera,
  Navigation,
  Users,
  CreditCard,
  TestTube,
  Building,
  ChevronDown,
  Map,
  RefreshCw,
  Trash2,
  Copy,
  Star,
  Archive
} from "lucide-react";

interface OrderWithDetails {
  id: number;
  orderNumber: string;
  patient: {
    id: number;
    name: string;
    phone: string;
    nationalId: string;
    address: string;
  };
  doctor: {
    name: string;
    specialty: string;
    clinic: string;
  };
  collector?: {
    id: number;
    name: string;
    phone: string;
    status: string;
  };
  services: Array<{
    serviceId: number;
    serviceName: string;
    quantity: number;
    price: string;
  }>;
  status: string;
  paymentStatus: string;
  samplingStatus: string;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  createdAt: string;
  totalAmount: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  notes?: string;
  priority: "urgent" | "high" | "normal" | "low";
  organizationType?: "hospital" | "clinic" | "individual" | "corporate";
  organizationName?: string;
  documents?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
}

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [samplingFilter, setSamplingFilter] = useState("all");
  const [collectorFilter, setCollectorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapView, setMapView] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderWithDetails | null>(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const ordersPerPage = 10;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery<OrderWithDetails[]>({
    queryKey: ["/api/lab-orders", "detailed"],
  });

  const { data: collectors } = useQuery({
    queryKey: ["/api/collectors"],
  });

  // Enhanced sample data with priority and organization info
  const sampleOrders: OrderWithDetails[] = [
    {
      id: 1,
      orderNumber: "LAB-2024-001",
      patient: {
        id: 1,
        name: "زهرا احمدی",
        phone: "09123456789",
        nationalId: "1234567890",
        address: "تهران، خیابان ولیعصر، پلاک 123"
      },
      doctor: {
        name: "دکتر محمد رضایی",
        specialty: "داخلی",
        clinic: "کلینیک پارس"
      },
      collector: {
        id: 1,
        name: "علی محمدی",
        phone: "09121234567",
        status: "available"
      },
      services: [
        { serviceId: 1, serviceName: "آزمایش خون کامل", quantity: 1, price: "250000" },
        { serviceId: 2, serviceName: "تست تیروئید", quantity: 1, price: "180000" }
      ],
      status: "collection_scheduled",
      paymentStatus: "paid",
      samplingStatus: "pending",
      priority: "urgent",
      organizationType: "hospital",
      organizationName: "بیمارستان پارس",
      scheduledDate: "2024-06-05",
      scheduledTimeSlot: "09:00-10:00",
      createdAt: "2024-06-04T10:30:00Z",
      totalAmount: "430000",
      location: {
        address: "تهران، خیابان ولیعصر، پلاک 123",
        lat: 35.7219,
        lng: 51.3347
      },
      notes: "بیمار در طبقه دوم ساکن است",
      documents: [
        { type: "prescription", url: "/docs/prescription-1.pdf", name: "نسخه پزشک" },
        { type: "insurance", url: "/docs/insurance-1.jpg", name: "کارت بیمه" }
      ]
    },
    {
      id: 2,
      orderNumber: "LAB-2024-002",
      patient: {
        id: 2,
        name: "حسن کریمی",
        phone: "09134567890",
        nationalId: "0987654321",
        address: "مشهد، خیابان امام رضا، کوچه 15"
      },
      doctor: {
        name: "دکتر فاطمه نوری",
        specialty: "قلب و عروق",
        clinic: "بیمارستان رضوی"
      },
      services: [
        { serviceId: 3, serviceName: "پروفایل لیپید", quantity: 1, price: "320000" }
      ],
      status: "collected",
      paymentStatus: "pending",
      samplingStatus: "collected",
      priority: "normal",
      organizationType: "clinic",
      organizationName: "کلینیک قلب",
      createdAt: "2024-06-03T14:15:00Z",
      totalAmount: "320000",
      location: {
        address: "مشهد، خیابان امام رضا، کوچه 15",
        lat: 36.2605,
        lng: 59.6168
      }
    },
    {
      id: 3,
      orderNumber: "LAB-2024-003",
      patient: {
        id: 3,
        name: "مریم صالحی",
        phone: "09156789012",
        nationalId: "1122334455",
        address: "اصفهان، خیابان چهارباغ، شماره 45"
      },
      doctor: {
        name: "دکتر رضا موسوی",
        specialty: "غدد",
        clinic: "مطب تخصصی غدد"
      },
      collector: {
        id: 2,
        name: "سارا جعفری",
        phone: "09122345678",
        status: "busy"
      },
      services: [
        { serviceId: 4, serviceName: "HbA1c", quantity: 1, price: "150000" },
        { serviceId: 5, serviceName: "تست گلوکز", quantity: 1, price: "75000" }
      ],
      status: "processing",
      paymentStatus: "paid",
      samplingStatus: "completed",
      priority: "high",
      organizationType: "individual",
      createdAt: "2024-06-02T09:20:00Z",
      totalAmount: "225000",
      location: {
        address: "اصفهان، خیابان چهارباغ، شماره 45",
        lat: 32.6546,
        lng: 51.6680
      }
    },
    {
      id: 4,
      orderNumber: "LAB-2024-004",
      patient: {
        id: 4,
        name: "امیر حسینی",
        phone: "09171234567",
        nationalId: "5566778899",
        address: "شیراز، خیابان زند، کوچه 8"
      },
      doctor: {
        name: "دکتر نگار احمدی",
        specialty: "زنان و زایمان",
        clinic: "بیمارستان نمازی"
      },
      services: [
        { serviceId: 6, serviceName: "آزمایش ادرار کامل", quantity: 1, price: "85000" }
      ],
      status: "delivered",
      paymentStatus: "paid",
      samplingStatus: "completed",
      priority: "normal",
      organizationType: "corporate",
      organizationName: "شرکت پتروشیمی پارس",
      createdAt: "2024-06-01T16:45:00Z",
      totalAmount: "85000",
      location: {
        address: "شیراز، خیابان زند، کوچه 8",
        lat: 29.5918,
        lng: 52.5837
      }
    }
  ];

  const displayOrders = orders?.length ? orders : sampleOrders;

  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, updates }: { orderId: number; updates: any }) => {
      const response = await apiRequest("PATCH", `/api/lab-orders/${orderId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "سفارش به‌روزرسانی شد",
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await apiRequest("DELETE", `/api/lab-orders/${orderId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lab-orders"] });
      toast({
        title: "موفقیت",
        description: "سفارش حذف شد",
      });
    },
  });

  // Filter and sort logic
  const filteredOrders = displayOrders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.patient.phone.includes(searchTerm) ||
      order.doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    const matchesSampling = samplingFilter === "all" || order.samplingStatus === samplingFilter;
    const matchesCollector = collectorFilter === "all" || 
      (order.collector && order.collector.id.toString() === collectorFilter);
    const matchesDoctor = !doctorFilter || 
      order.doctor.name.toLowerCase().includes(doctorFilter.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesSampling && 
           matchesCollector && matchesDoctor && matchesDate;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aVal, bVal;
    
    switch (sortBy) {
      case "createdAt":
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      case "patient":
        aVal = a.patient.name;
        bVal = b.patient.name;
        break;
      case "totalAmount":
        aVal = parseFloat(a.totalAmount);
        bVal = parseFloat(b.totalAmount);
        break;
      default:
        aVal = a.orderNumber;
        bVal = b.orderNumber;
    }
    
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  const getStatusBadge = (status: string) => {
    const statusMap = {
      registered: { label: "ثبت شده", class: "bg-blue-100 text-blue-800 border-blue-200" },
      collection_scheduled: { label: "برنامه‌ریزی شده", class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      collected: { label: "نمونه‌گیری شده", class: "bg-purple-100 text-purple-800 border-purple-200" },
      processing: { label: "در حال پردازش", class: "bg-orange-100 text-orange-800 border-orange-200" },
      completed: { label: "آماده تحویل", class: "bg-green-100 text-green-800 border-green-200" },
      delivered: { label: "تحویل شده", class: "bg-gray-100 text-gray-800 border-gray-200" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
                      { label: status, class: "bg-gray-100 text-gray-800 border-gray-200" };
    
    return (
      <Badge className={`${statusInfo.class} border font-medium`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      urgent: { label: "فوری", class: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
      high: { label: "مهم", class: "bg-orange-100 text-orange-800 border-orange-200", icon: Star },
      normal: { label: "عادی", class: "bg-blue-100 text-blue-800 border-blue-200", icon: CheckCircle },
      low: { label: "کم", class: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock },
    };
    
    const priorityInfo = priorityMap[priority as keyof typeof priorityMap] || 
                        { label: priority, class: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock };
    
    const Icon = priorityInfo.icon;
    
    return (
      <Badge className={`${priorityInfo.class} border font-medium inline-flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {priorityInfo.label}
      </Badge>
    );
  };

  const getOrganizationBadge = (organizationType?: string, organizationName?: string) => {
    if (!organizationType) return null;
    
    const orgMap = {
      hospital: { label: "بیمارستان", class: "bg-purple-100 text-purple-800 border-purple-200", icon: Building },
      clinic: { label: "کلینیک", class: "bg-blue-100 text-blue-800 border-blue-200", icon: Building },
      corporate: { label: "شرکتی", class: "bg-green-100 text-green-800 border-green-200", icon: Building },
      individual: { label: "فردی", class: "bg-gray-100 text-gray-800 border-gray-200", icon: User },
    };
    
    const orgInfo = orgMap[organizationType as keyof typeof orgMap] || 
                   { label: organizationType, class: "bg-gray-100 text-gray-800 border-gray-200", icon: Building };
    
    const Icon = orgInfo.icon;
    
    return (
      <Badge className={`${orgInfo.class} border font-medium inline-flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {organizationName || orgInfo.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const paymentMap = {
      paid: { label: "پرداخت شده", class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      pending: { label: "در انتظار", class: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      failed: { label: "ناموفق", class: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    };
    
    const paymentInfo = paymentMap[paymentStatus as keyof typeof paymentMap] || 
                       { label: paymentStatus, class: "bg-gray-100 text-gray-800 border-gray-200", icon: AlertTriangle };
    
    const Icon = paymentInfo.icon;
    
    return (
      <Badge className={`${paymentInfo.class} border font-medium inline-flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {paymentInfo.label}
      </Badge>
    );
  };

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

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('fa-IR').format(parseInt(amount)) + ' تومان';
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(paginatedOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    if (confirm('آیا از حذف این سفارش مطمئن هستید؟')) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const handleCopyOrder = (order: OrderWithDetails) => {
    navigator.clipboard.writeText(JSON.stringify(order, null, 2));
    toast({
      title: "کپی شد",
      description: "اطلاعات سفارش در کلیپ‌بورد کپی شد",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setSamplingFilter("all");
    setCollectorFilter("all");
    setDateFilter("all");
    setDoctorFilter("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Package className="text-blue-600" size={24} />
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">در حال بارگذاری سفارشات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="card-professional shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">مدیریت سفارشات</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {filteredOrders.length} سفارش از {displayOrders.length} سفارش کل
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setMapView(!mapView)}
                className={`${mapView ? "bg-blue-50 text-blue-700 border-blue-200" : ""} hover:bg-blue-50`}
              >
                <Map className="ml-2 w-4 h-4" />
                نمای نقشه
              </Button>
              <Button variant="outline" className="hover:bg-gray-50">
                <Download className="ml-2 w-4 h-4" />
                خروجی Excel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="ml-2 w-4 h-4" />
                سفارش جدید
              </Button>
            </div>
          </div>

          {/* Search and Quick Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="جستجو در سفارشات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="وضعیت سفارش" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="registered">ثبت شده</SelectItem>
                <SelectItem value="collection_scheduled">برنامه‌ریزی شده</SelectItem>
                <SelectItem value="collected">نمونه‌گیری شده</SelectItem>
                <SelectItem value="processing">در حال پردازش</SelectItem>
                <SelectItem value="completed">آماده تحویل</SelectItem>
                <SelectItem value="delivered">تحویل شده</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="وضعیت پرداخت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه پرداخت‌ها</SelectItem>
                <SelectItem value="paid">پرداخت شده</SelectItem>
                <SelectItem value="pending">در انتظار</SelectItem>
                <SelectItem value="failed">ناموفق</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center justify-center border-gray-200 hover:bg-gray-50"
            >
              <Filter className="ml-2 w-4 h-4" />
              فیلتر پیشرفته
              <ChevronDown className={`mr-2 w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Advanced Filters Panel */}
          {filtersOpen && (
            <Card className="filter-section">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="sampling-filter" className="text-sm font-medium text-gray-700">وضعیت نمونه‌گیری</Label>
                    <Select value={samplingFilter} onValueChange={setSamplingFilter}>
                      <SelectTrigger className="mt-1 border-gray-200">
                        <SelectValue placeholder="وضعیت نمونه‌گیری" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                        <SelectItem value="pending">در انتظار</SelectItem>
                        <SelectItem value="collected">نمونه‌گیری شده</SelectItem>
                        <SelectItem value="in_transit">در حال انتقال</SelectItem>
                        <SelectItem value="completed">تکمیل شده</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="collector-filter" className="text-sm font-medium text-gray-700">نمونه‌گیر</Label>
                    <Select value={collectorFilter} onValueChange={setCollectorFilter}>
                      <SelectTrigger className="mt-1 border-gray-200">
                        <SelectValue placeholder="انتخاب نمونه‌گیر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه نمونه‌گیران</SelectItem>
                        <SelectItem value="1">علی محمدی</SelectItem>
                        <SelectItem value="2">سارا جعفری</SelectItem>
                        <SelectItem value="3">حسن رضایی</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date-filter" className="text-sm font-medium text-gray-700">بازه زمانی</Label>
                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="mt-1 border-gray-200">
                        <SelectValue placeholder="انتخاب تاریخ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه تاریخ‌ها</SelectItem>
                        <SelectItem value="today">امروز</SelectItem>
                        <SelectItem value="week">هفته گذشته</SelectItem>
                        <SelectItem value="month">ماه گذشته</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="doctor-filter" className="text-sm font-medium text-gray-700">پزشک ارجاع‌دهنده</Label>
                    <Input
                      id="doctor-filter"
                      placeholder="نام پزشک..."
                      value={doctorFilter}
                      onChange={(e) => setDoctorFilter(e.target.value)}
                      className="mt-1 border-gray-200"
                    />
                  </div>

                  <div className="flex items-end space-x-2 space-x-reverse">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <X className="ml-2 w-4 h-4" />
                      پاک کردن
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sort and View Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3 space-x-reverse">
              <span className="text-sm font-medium text-gray-700">مرتب‌سازی:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">تاریخ ثبت</SelectItem>
                  <SelectItem value="patient">نام بیمار</SelectItem>
                  <SelectItem value="totalAmount">مبلغ کل</SelectItem>
                  <SelectItem value="orderNumber">شماره سفارش</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="border-gray-200 hover:bg-gray-50"
              >
                {sortOrder === "asc" ? "صعودی" : "نزولی"}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
              <span>صفحه {currentPage} از {totalPages}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="card-professional shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    <Checkbox
                      checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    شماره سفارش
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    بیمار
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    پزشک
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    خدمات
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    نوع سازمان
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    اولویت
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    مبلغ کل
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{order.patient.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1 space-x-reverse">
                            <Phone className="w-3 h-3" />
                            <span>{order.patient.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.doctor.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{order.doctor.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {order.services.length} خدمت
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.services.slice(0, 2).map(service => service.serviceName).join("، ")}
                        {order.services.length > 2 && "..."}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(order.status)}
                        {getPaymentBadge(order.paymentStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getOrganizationBadge(order.organizationType, order.organizationName)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(order.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(order.totalAmount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={() => setSelectedOrderDetails(order)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="w-4 h-4" />
                            ویرایش سفارش
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleCopyOrder(order)}
                            className="flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            کپی اطلاعات
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Archive className="w-4 h-4" />
                            آرشیو سفارش
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="flex items-center gap-2 text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            حذف سفارش
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {paginatedOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">سفارشی یافت نشد</h3>
              <p className="text-sm text-gray-400">فیلترهای خود را تغییر دهید یا سفارش جدیدی ثبت کنید</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="card-professional shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                نمایش {((currentPage - 1) * ordersPerPage) + 1} تا {Math.min(currentPage * ordersPerPage, filteredOrders.length)} از {filteredOrders.length} سفارش
              </div>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  <ChevronRight className="w-4 h-4" />
                  قبلی
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + Math.max(1, currentPage - 2);
                  if (page > totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-blue-600 text-white" : "border-gray-200 hover:bg-gray-50"}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-200 hover:bg-gray-50"
                >
                  بعدی
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <Dialog open={!!selectedOrderDetails} onOpenChange={() => setSelectedOrderDetails(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                جزئیات سفارش {selectedOrderDetails.orderNumber}
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">اطلاعات کلی</TabsTrigger>
                <TabsTrigger value="services">خدمات</TabsTrigger>
                <TabsTrigger value="location">موقعیت</TabsTrigger>
                <TabsTrigger value="documents">اسناد</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2 space-x-reverse">
                        <User className="w-4 h-4" />
                        <span>اطلاعات بیمار</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">نام:</span>
                          <span className="font-medium text-gray-900">{selectedOrderDetails.patient.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">کد ملی:</span>
                          <span className="font-medium text-gray-900">{selectedOrderDetails.patient.nationalId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تلفن:</span>
                          <span className="font-medium text-gray-900">{selectedOrderDetails.patient.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">آدرس:</span>
                          <span className="font-medium text-gray-900 text-right">{selectedOrderDetails.patient.address}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2 space-x-reverse">
                        <Building className="w-4 h-4" />
                        <span>اطلاعات پزشک</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">نام:</span>
                          <span className="font-medium text-gray-900">{selectedOrderDetails.doctor.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تخصص:</span>
                          <span className="font-medium text-gray-900">{selectedOrderDetails.doctor.specialty}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">کلینیک:</span>
                          <span className="font-medium text-gray-900">{selectedOrderDetails.doctor.clinic}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {selectedOrderDetails.collector && (
                    <Card className="border border-gray-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2 space-x-reverse">
                          <Truck className="w-4 h-4" />
                          <span>نمونه‌گیر</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">نام:</span>
                            <span className="font-medium text-gray-900">{selectedOrderDetails.collector.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">تلفن:</span>
                            <span className="font-medium text-gray-900">{selectedOrderDetails.collector.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">وضعیت:</span>
                            <Badge className="bg-green-100 text-green-800">{selectedOrderDetails.collector.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2 space-x-reverse">
                        <Calendar className="w-4 h-4" />
                        <span>زمان‌بندی</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاریخ ثبت:</span>
                          <span className="font-medium text-gray-900">{formatDate(selectedOrderDetails.createdAt)}</span>
                        </div>
                        {selectedOrderDetails.scheduledDate && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-600">تاریخ نمونه‌گیری:</span>
                              <span className="font-medium text-gray-900">{new Intl.DateTimeFormat('fa-IR').format(new Date(selectedOrderDetails.scheduledDate))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">ساعت:</span>
                              <span className="font-medium text-gray-900">{selectedOrderDetails.scheduledTimeSlot}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {selectedOrderDetails.notes && (
                  <Card className="mt-6 border border-gray-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2 space-x-reverse">
                        <FileText className="w-4 h-4" />
                        <span>یادداشت‌ها</span>
                      </h4>
                      <p className="text-sm text-gray-700">{selectedOrderDetails.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2 space-x-reverse">
                      <TestTube className="w-4 h-4" />
                      <span>لیست خدمات</span>
                    </h4>
                    <div className="space-y-3">
                      {selectedOrderDetails.services.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div>
                            <div className="font-medium text-gray-900">{service.serviceName}</div>
                            <div className="text-sm text-gray-600">تعداد: {service.quantity}</div>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">
                              {formatCurrency(service.price)}
                            </div>
                            <div className="text-sm text-gray-600">
                              کل: {formatCurrency((parseInt(service.price) * service.quantity).toString())}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>مجموع کل:</span>
                      <span className="text-blue-600">{formatCurrency(selectedOrderDetails.totalAmount)}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2 space-x-reverse">
                      <MapPin className="w-4 h-4" />
                      <span>موقعیت نمونه‌گیری</span>
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">آدرس کامل</Label>
                        <p className="mt-1 p-3 bg-gray-50 rounded-lg text-sm border">
                          {selectedOrderDetails.location.address}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700">عرض جغرافیایی</Label>
                          <p className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono border">
                            {selectedOrderDetails.location.lat}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700">طول جغرافیایی</Label>
                          <p className="mt-1 p-2 bg-gray-50 rounded text-sm font-mono border">
                            {selectedOrderDetails.location.lng}
                          </p>
                        </div>
                      </div>
                      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <div className="text-center">
                          <Map className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">نقشه موقعیت</p>
                          <p className="text-xs text-gray-400 mt-1">نیاز به API نقشه</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2 space-x-reverse">
                      <FileText className="w-4 h-4" />
                      <span>اسناد و مدارک</span>
                    </h4>
                    {selectedOrderDetails.documents && selectedOrderDetails.documents.length > 0 ? (
                      <div className="space-y-3">
                        {selectedOrderDetails.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{doc.name}</div>
                                <div className="text-sm text-gray-600">{doc.type}</div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="hover:bg-gray-200">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p>هیچ سندی آپلود نشده است</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}