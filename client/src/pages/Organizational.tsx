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
import { 
  Building2, 
  Users, 
  Upload, 
  Calendar, 
  BarChart3, 
  FileText,
  MapPin,
  Phone,
  Mail,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Filter,
  Search,
  FileSpreadsheet,
  CalendarDays,
  TrendingUp,
  DollarSign,
  Home,
  Navigation,
  MessageSquare,
  UserCheck,
  Target,
  Award,
  Shield,
  Camera,
  Settings,
  Send
} from "lucide-react";

interface Company {
  id: number;
  name: string;
  logo?: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  hrContact: {
    name: string;
    phone: string;
    email: string;
  };
  employeeCount: number;
  contractStatus: "active" | "pending" | "expired" | "suspended";
  lastCheckup: string;
  nextScheduled?: string;
  notes?: string;
}

interface Employee {
  id: number;
  name: string;
  nationalId: string;
  department: string;
  position: string;
  phone: string;
  email?: string;
  birthDate: string;
  joinDate: string;
  lastCheckup?: string;
  healthStatus: "healthy" | "requires_attention" | "critical" | "not_tested";
}

interface CheckupSchedule {
  id: number;
  companyId: number;
  companyName: string;
  date: string;
  timeSlot: string;
  type: "company_visit" | "home_sampling";
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  employeeCount: number;
  assignedCollector?: string;
  notes?: string;
}

interface HealthReport {
  id: number;
  companyId: number;
  companyName: string;
  reportDate: string;
  overallScore: number;
  departmentStats: Array<{
    department: string;
    totalEmployees: number;
    testedEmployees: number;
    healthyCount: number;
    requiresAttentionCount: number;
    criticalCount: number;
    score: number;
  }>;
  commonIssues: Array<{
    issue: string;
    count: number;
    percentage: number;
  }>;
  recommendations: string[];
  doctorComments?: string;
}

interface Contract {
  id: number;
  companyId: number;
  companyName: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: "active" | "pending" | "expired" | "terminated";
  paymentStatus: "paid" | "partial" | "pending" | "overdue";
  milestones: Array<{
    id: number;
    description: string;
    amount: number;
    dueDate: string;
    status: "pending" | "paid" | "overdue";
  }>;
  renewalDate?: string;
  documents: Array<{
    id: number;
    name: string;
    type: "contract" | "invoice" | "payment_receipt" | "report";
    url: string;
    uploadDate: string;
  }>;
}

export default function Organizational() {
  const [activeTab, setActiveTab] = useState("companies");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showEmployeeUpload, setShowEmployeeUpload] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample data
  const sampleCompanies: Company[] = [
    {
      id: 1,
      name: "شرکت پتروشیمی ایران",
      contactPerson: "مهندس احمد رضایی",
      phone: "021-88776655",
      email: "info@petroiran.com",
      address: "تهران، میدان ونک، برج میلاد",
      hrContact: {
        name: "خانم فاطمه احمدی",
        phone: "021-88776656",
        email: "hr@petroiran.com"
      },
      employeeCount: 450,
      contractStatus: "active",
      lastCheckup: "1403/03/15",
      nextScheduled: "1403/06/15",
      notes: "شرکت بزرگ با نیاز به چکاپ فصلی"
    },
    {
      id: 2,
      name: "بانک ملی شعبه مرکزی",
      contactPerson: "آقای محمد کریمی",
      phone: "021-44556677",
      email: "central@bankmelli.ir",
      address: "تهران، خیابان فردوسی، ساختمان مرکزی",
      hrContact: {
        name: "آقای علی نوری",
        phone: "021-44556678",
        email: "hr@bankmelli.ir"
      },
      employeeCount: 280,
      contractStatus: "active",
      lastCheckup: "1403/04/20",
      nextScheduled: "1403/07/20",
      notes: "چکاپ ماهانه طبق قرارداد"
    },
    {
      id: 3,
      name: "شرکت ساختمانی آریا",
      contactPerson: "مهندس سارا حسینی",
      phone: "021-33445566",
      email: "info@ariasazan.com",
      address: "تهران، خیابان کریمخان، مجتمع تجاری آریا",
      hrContact: {
        name: "خانم مریم رضوی",
        phone: "021-33445567",
        email: "hr@ariasazan.com"
      },
      employeeCount: 120,
      contractStatus: "pending",
      lastCheckup: "1403/02/10",
      notes: "در انتظار تمدید قرارداد"
    }
  ];

  const sampleEmployees: Employee[] = [
    {
      id: 1,
      name: "احمد رضایی",
      nationalId: "0123456789",
      department: "مهندسی",
      position: "مهندس ارشد",
      phone: "09123456789",
      email: "ahmad.rezaei@company.com",
      birthDate: "1365/05/15",
      joinDate: "1400/01/10",
      lastCheckup: "1403/03/15",
      healthStatus: "healthy"
    },
    {
      id: 2,
      name: "فاطمه احمدی",
      nationalId: "9876543210",
      department: "منابع انسانی",
      position: "کارشناس HR",
      phone: "09987654321",
      email: "fateme.ahmadi@company.com",
      birthDate: "1370/08/20",
      joinDate: "1401/03/05",
      lastCheckup: "1403/03/15",
      healthStatus: "requires_attention"
    }
  ];

  const sampleSchedules: CheckupSchedule[] = [
    {
      id: 1,
      companyId: 1,
      companyName: "شرکت پتروشیمی ایران",
      date: "1403/06/15",
      timeSlot: "08:00-12:00",
      type: "company_visit",
      status: "confirmed",
      employeeCount: 50,
      assignedCollector: "تیم نمونه‌گیری شماره 1",
      notes: "چکاپ فصلی - بخش مهندسی"
    },
    {
      id: 2,
      companyId: 2,
      companyName: "بانک ملی شعبه مرکزی",
      date: "1403/06/18",
      timeSlot: "14:00-18:00",
      type: "home_sampling",
      status: "pending",
      employeeCount: 25,
      notes: "نمونه‌گیری در منزل برای مدیران ارشد"
    }
  ];

  const sampleReports: HealthReport[] = [
    {
      id: 1,
      companyId: 1,
      companyName: "شرکت پتروشیمی ایران",
      reportDate: "1403/03/20",
      overallScore: 85,
      departmentStats: [
        {
          department: "مهندسی",
          totalEmployees: 120,
          testedEmployees: 115,
          healthyCount: 95,
          requiresAttentionCount: 18,
          criticalCount: 2,
          score: 87
        },
        {
          department: "اداری",
          totalEmployees: 80,
          testedEmployees: 78,
          healthyCount: 65,
          requiresAttentionCount: 12,
          criticalCount: 1,
          score: 83
        }
      ],
      commonIssues: [
        { issue: "فشار خون بالا", count: 25, percentage: 12.5 },
        { issue: "دیابت", count: 18, percentage: 9.0 },
        { issue: "چربی خون", count: 32, percentage: 16.0 }
      ],
      recommendations: [
        "برگزاری دوره‌های آموزشی تغذیه سالم",
        "راه‌اندازی باشگاه ورزشی شرکتی",
        "کنترل دوره‌ای فشار خون کارکنان"
      ],
      doctorComments: "وضعیت کلی سلامت کارکنان مطلوب است. توصیه می‌شود برنامه‌های پیشگیری تقویت شود."
    }
  ];

  const sampleContracts: Contract[] = [
    {
      id: 1,
      companyId: 1,
      companyName: "شرکت پتروشیمی ایران",
      contractNumber: "CTR-2024-001",
      startDate: "1403/01/01",
      endDate: "1403/12/29",
      amount: 25000000,
      status: "active",
      paymentStatus: "paid",
      milestones: [
        {
          id: 1,
          description: "پرداخت اولیه",
          amount: 10000000,
          dueDate: "1403/01/15",
          status: "paid"
        },
        {
          id: 2,
          description: "پرداخت میانی",
          amount: 10000000,
          dueDate: "1403/06/15",
          status: "pending"
        }
      ],
      renewalDate: "1403/10/01",
      documents: [
        {
          id: 1,
          name: "قرارداد اصلی",
          type: "contract",
          url: "#",
          uploadDate: "1403/01/01"
        }
      ]
    }
  ];

  const getStatusBadge = (status: string, type: "contract" | "payment" | "schedule" | "health") => {
    const configs = {
      contract: {
        active: { label: "فعال", color: "bg-green-100 text-green-800" },
        pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
        expired: { label: "منقضی", color: "bg-red-100 text-red-800" },
        suspended: { label: "متوقف", color: "bg-gray-100 text-gray-800" }
      },
      payment: {
        paid: { label: "پرداخت شده", color: "bg-green-100 text-green-800" },
        partial: { label: "پرداخت جزئی", color: "bg-orange-100 text-orange-800" },
        pending: { label: "در انتظار", color: "bg-blue-100 text-blue-800" },
        overdue: { label: "سررسید گذشته", color: "bg-red-100 text-red-800" }
      },
      schedule: {
        pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
        confirmed: { label: "تایید شده", color: "bg-blue-100 text-blue-800" },
        in_progress: { label: "در حال انجام", color: "bg-purple-100 text-purple-800" },
        completed: { label: "تکمیل شده", color: "bg-green-100 text-green-800" },
        cancelled: { label: "لغو شده", color: "bg-red-100 text-red-800" }
      },
      health: {
        healthy: { label: "سالم", color: "bg-green-100 text-green-800" },
        requires_attention: { label: "نیاز به توجه", color: "bg-yellow-100 text-yellow-800" },
        critical: { label: "بحرانی", color: "bg-red-100 text-red-800" },
        not_tested: { label: "تست نشده", color: "bg-gray-100 text-gray-800" }
      }
    };
    
    const config = configs[type][status as keyof typeof configs[typeof type]];
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredCompanies = sampleCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || company.contractStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">چکاپ‌های سازمانی</h1>
          <p className="text-gray-600 mt-1">مدیریت چکاپ‌های سازمان‌ها و شرکت‌ها</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button 
            variant="outline"
            onClick={() => setShowEmployeeUpload(true)}
          >
            <Upload className="w-4 h-4 ml-2" />
            آپلود کارکنان
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowCompanyForm(true)}
          >
            <Plus className="w-4 h-4 ml-2" />
            شرکت جدید
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="companies" className="flex items-center space-x-2 space-x-reverse">
            <Building2 className="w-4 h-4" />
            <span>پروفایل شرکت‌ها</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center space-x-2 space-x-reverse">
            <Users className="w-4 h-4" />
            <span>آپلود کارکنان</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center space-x-2 space-x-reverse">
            <Calendar className="w-4 h-4" />
            <span>زمان‌بندی نمونه‌گیری</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2 space-x-reverse">
            <BarChart3 className="w-4 h-4" />
            <span>گزارش سلامت گروهی</span>
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center space-x-2 space-x-reverse">
            <FileText className="w-4 h-4" />
            <span>قرارداد و مالی</span>
          </TabsTrigger>
          <TabsTrigger value="sampling" className="flex items-center space-x-2 space-x-reverse">
            <Home className="w-4 h-4" />
            <span>نمونه‌گیری منزل</span>
          </TabsTrigger>
        </TabsList>

        {/* Companies Tab */}
        <TabsContent value="companies" className="mt-6">
          <div className="space-y-6">
            {/* Filters */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input
                      placeholder="جستجو در شرکت‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="وضعیت قرارداد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                        <SelectItem value="active">فعال</SelectItem>
                        <SelectItem value="pending">در انتظار</SelectItem>
                        <SelectItem value="expired">منقضی</SelectItem>
                        <SelectItem value="suspended">متوقف</SelectItem>
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
                      <FileSpreadsheet className="w-4 h-4 ml-2" />
                      صدور گزارش
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="card-professional hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={company.logo} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {company.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{company.name}</h3>
                          <p className="text-sm text-gray-600">{company.contactPerson}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setSelectedCompany(company)}>
                            <Eye className="w-4 h-4 ml-2" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 ml-2" />
                            ویرایش
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Calendar className="w-4 h-4 ml-2" />
                            زمان‌بندی چکاپ
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
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{company.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{company.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{company.employeeCount} کارمند</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">وضعیت:</span>
                        {getStatusBadge(company.contractStatus, "contract")}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">آخرین چکاپ:</span>
                        <span className="text-sm font-medium">{company.lastCheckup}</span>
                      </div>
                      {company.nextScheduled && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">چکاپ بعدی:</span>
                          <span className="text-sm font-medium text-blue-600">{company.nextScheduled}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="mt-6">
          <div className="space-y-6">
            {/* Upload Section */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>آپلود فایل اکسل کارکنان</span>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setShowEmployeeUpload(true)}
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    آپلود فایل جدید
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">آپلود فایل اکسل کارکنان</h3>
                  <p className="text-gray-600 mb-4">فایل Excel شامل نام، کد ملی، بخش و سمت کارکنان</p>
                  <div className="flex items-center justify-center space-x-4 space-x-reverse">
                    <Button variant="outline">
                      <Download className="w-4 h-4 ml-2" />
                      دانلود نمونه فایل
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Upload className="w-4 h-4 ml-2" />
                      انتخاب فایل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Employees Table */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>لیست کارکنان آپلود شده</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right p-4 font-medium text-gray-700">نام</th>
                        <th className="text-right p-4 font-medium text-gray-700">کد ملی</th>
                        <th className="text-right p-4 font-medium text-gray-700">بخش</th>
                        <th className="text-right p-4 font-medium text-gray-700">سمت</th>
                        <th className="text-right p-4 font-medium text-gray-700">تلفن</th>
                        <th className="text-right p-4 font-medium text-gray-700">وضعیت سلامت</th>
                        <th className="text-right p-4 font-medium text-gray-700">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium">{employee.name}</td>
                          <td className="p-4">{employee.nationalId}</td>
                          <td className="p-4">{employee.department}</td>
                          <td className="p-4">{employee.position}</td>
                          <td className="p-4">{employee.phone}</td>
                          <td className="p-4">{getStatusBadge(employee.healthStatus, "health")}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
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

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6">
          <div className="space-y-6">
            {/* Schedule Header */}
            <Card className="card-professional">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">برنامه نمونه‌گیری</h3>
                    <p className="text-gray-600">مدیریت زمان‌بندی چکاپ‌های سازمانی</p>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setShowScheduleForm(true)}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    برنامه جدید
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Schedule Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleSchedules.map((schedule) => (
                <Card key={schedule.id} className="card-professional">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{schedule.companyName}</h3>
                        <p className="text-sm text-gray-600">{schedule.date} - {schedule.timeSlot}</p>
                      </div>
                      {getStatusBadge(schedule.status, "schedule")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-gray-700">
                          {schedule.type === "company_visit" ? "بازدید شرکت" : "نمونه‌گیری منزل"}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm">
                        <Users className="w-4 h-4 text-green-600" />
                        <span className="text-gray-700">{schedule.employeeCount} نفر</span>
                      </div>
                      {schedule.assignedCollector && (
                        <div className="flex items-center space-x-2 space-x-reverse text-sm">
                          <UserCheck className="w-4 h-4 text-purple-600" />
                          <span className="text-gray-700">{schedule.assignedCollector}</span>
                        </div>
                      )}
                      {schedule.notes && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {schedule.notes}
                        </div>
                      )}
                      <div className="flex items-center space-x-2 space-x-reverse pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 ml-1" />
                          ویرایش
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="w-4 h-4 ml-1" />
                          پیامک
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <div className="space-y-6">
            {sampleReports.map((report) => (
              <Card key={report.id} className="card-professional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{report.companyName}</CardTitle>
                      <p className="text-gray-600">گزارش تاریخ: {report.reportDate}</p>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getHealthScoreColor(report.overallScore)}`}>
                          {report.overallScore}
                        </div>
                        <div className="text-sm text-gray-600">امتیاز کلی</div>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 ml-1" />
                          PDF
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileSpreadsheet className="w-4 h-4 ml-1" />
                          Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Department Stats */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">آمار بخش‌ها</h4>
                      <div className="space-y-3">
                        {report.departmentStats.map((dept, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{dept.department}</h5>
                              <div className={`text-lg font-bold ${getHealthScoreColor(dept.score)}`}>
                                {dept.score}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">کل کارکنان:</span>
                                <span className="font-medium mr-1">{dept.totalEmployees}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">تست شده:</span>
                                <span className="font-medium mr-1">{dept.testedEmployees}</span>
                              </div>
                              <div className="text-green-600">
                                <span>سالم:</span>
                                <span className="font-medium mr-1">{dept.healthyCount}</span>
                              </div>
                              <div className="text-yellow-600">
                                <span>نیاز به توجه:</span>
                                <span className="font-medium mr-1">{dept.requiresAttentionCount}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common Issues */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">مشکلات شایع</h4>
                      <div className="space-y-3">
                        {report.commonIssues.map((issue, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span className="text-gray-900">{issue.issue}</span>
                            <div className="text-right">
                              <div className="font-medium text-gray-900">{issue.count} نفر</div>
                              <div className="text-sm text-gray-600">{issue.percentage}%</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-3">توصیه‌ها</h4>
                        <ul className="space-y-2">
                          {report.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start space-x-2 space-x-reverse text-sm">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {report.doctorComments && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">نظر پزشک</h4>
                          <p className="text-blue-800 text-sm">{report.doctorComments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="mt-6">
          <div className="space-y-6">
            {sampleContracts.map((contract) => (
              <Card key={contract.id} className="card-professional">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{contract.companyName}</CardTitle>
                      <p className="text-gray-600">شماره قرارداد: {contract.contractNumber}</p>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      {getStatusBadge(contract.status, "contract")}
                      {getStatusBadge(contract.paymentStatus, "payment")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contract Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">جزئیات قرارداد</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">تاریخ شروع:</span>
                          <span className="font-medium">{contract.startDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">تاریخ پایان:</span>
                          <span className="font-medium">{contract.endDate}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">مبلغ کل:</span>
                          <span className="font-medium text-green-600">{formatCurrency(contract.amount)}</span>
                        </div>
                        {contract.renewalDate && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">تاریخ تمدید:</span>
                            <span className="font-medium text-blue-600">{contract.renewalDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Payment Milestones */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">مراحل پرداخت</h4>
                      <div className="space-y-3">
                        {contract.milestones.map((milestone) => (
                          <div key={milestone.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{milestone.description}</span>
                              {getStatusBadge(milestone.status, "payment")}
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">مبلغ: {formatCurrency(milestone.amount)}</span>
                              <span className="text-gray-600">سررسید: {milestone.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">اسناد و مدارک</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {contract.documents.map((doc) => (
                        <div key={doc.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                          <div className="flex items-center space-x-2 space-x-reverse mb-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-gray-900">{doc.name}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <div>نوع: {
                              doc.type === 'contract' ? 'قرارداد' :
                              doc.type === 'invoice' ? 'فاکتور' :
                              doc.type === 'payment_receipt' ? 'رسید پرداخت' : 'گزارش'
                            }</div>
                            <div>تاریخ: {doc.uploadDate}</div>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="w-4 h-4 ml-1" />
                            دانلود
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Home Sampling Tab */}
        <TabsContent value="sampling" className="mt-6">
          <div className="space-y-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>مدیریت نمونه‌گیری در منزل</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Navigation className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">ردیابی GPS</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">مشاهده موقعیت آنلاین نمونه‌گیران</p>
                      <Button variant="outline" className="w-full">
                        <MapPin className="w-4 h-4 ml-2" />
                        مشاهده نقشه
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="font-semibold">انتخاب زمان</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">تعیین بازه زمانی نمونه‌گیری</p>
                      <Button variant="outline" className="w-full">
                        <CalendarDays className="w-4 h-4 ml-2" />
                        تنظیم زمان
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 space-x-reverse mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">تایید پیامکی</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">ارسال پیامک تایید به کارکنان</p>
                      <Button variant="outline" className="w-full">
                        <Send className="w-4 h-4 ml-2" />
                        ارسال پیامک
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Company Form Modal */}
      <Dialog open={showCompanyForm} onOpenChange={setShowCompanyForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              ثبت شرکت جدید
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام شرکت *</label>
              <Input placeholder="نام کامل شرکت" className="border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام رابط *</label>
              <Input placeholder="نام و نام خانوادگی رابط" className="border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تلفن شرکت *</label>
              <Input placeholder="021-12345678" className="border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
              <Input placeholder="info@company.com" className="border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">آدرس *</label>
              <Input placeholder="آدرس کامل شرکت" className="border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نام رابط HR *</label>
              <Input placeholder="نام رابط منابع انسانی" className="border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تلفن HR *</label>
              <Input placeholder="09123456789" className="border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">یادداشت‌ها</label>
              <Textarea 
                placeholder="توضیحات اضافی در مورد شرکت..."
                className="border-gray-300 min-h-[100px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 space-x-reverse mt-6">
            <Button variant="outline" onClick={() => setShowCompanyForm(false)}>
              انصراف
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              ثبت شرکت
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Upload Modal */}
      <Dialog open={showEmployeeUpload} onOpenChange={setShowEmployeeUpload}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              آپلود فایل کارکنان
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب شرکت</label>
              <Select>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="شرکت را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {sampleCompanies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">فایل اکسل</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-2">فایل Excel خود را اینجا رها کنید</p>
                <Button variant="outline" size="sm">
                  انتخاب فایل
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                فرمت مورد قبول: .xlsx, .xls | ستون‌های مورد نیاز: نام، کد ملی، بخش، سمت
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 space-x-reverse">
              <Button variant="outline" onClick={() => setShowEmployeeUpload(false)}>
                انصراف
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                آپلود و بررسی
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Form Modal */}
      <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              ایجاد برنامه نمونه‌گیری جدید
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">شرکت *</label>
              <Select>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="انتخاب شرکت" />
                </SelectTrigger>
                <SelectContent>
                  {sampleCompanies.map(company => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع نمونه‌گیری *</label>
              <Select>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="انتخاب نوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company_visit">بازدید شرکت</SelectItem>
                  <SelectItem value="home_sampling">نمونه‌گیری منزل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ *</label>
              <Input type="date" className="border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">بازه زمانی *</label>
              <Select>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="انتخاب زمان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00-12:00">08:00-12:00</SelectItem>
                  <SelectItem value="13:00-17:00">13:00-17:00</SelectItem>
                  <SelectItem value="14:00-18:00">14:00-18:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">تعداد کارکنان</label>
              <Input placeholder="تعداد تقریبی" className="border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نمونه‌گیر</label>
              <Select>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="انتخاب نمونه‌گیر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="team1">تیم نمونه‌گیری شماره 1</SelectItem>
                  <SelectItem value="team2">تیم نمونه‌گیری شماره 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <Textarea 
                placeholder="توضیحات اضافی..."
                className="border-gray-300 min-h-[80px]"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 space-x-reverse mt-6">
            <Button variant="outline" onClick={() => setShowScheduleForm(false)}>
              انصراف
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              ثبت برنامه
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Company Details Modal */}
      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                جزئیات شرکت: {selectedCompany.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">اطلاعات تماس</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">نام رابط</label>
                    <p className="text-gray-900">{selectedCompany.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">تلفن</label>
                    <p className="text-gray-900">{selectedCompany.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ایمیل</label>
                    <p className="text-gray-900">{selectedCompany.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">آدرس</label>
                    <p className="text-gray-900">{selectedCompany.address}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">اطلاعات HR</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">نام رابط HR</label>
                    <p className="text-gray-900">{selectedCompany.hrContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">تلفن HR</label>
                    <p className="text-gray-900">{selectedCompany.hrContact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">ایمیل HR</label>
                    <p className="text-gray-900">{selectedCompany.hrContact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">تعداد کارکنان</label>
                    <p className="text-gray-900">{selectedCompany.employeeCount} نفر</p>
                  </div>
                </div>
              </div>
              
              {selectedCompany.notes && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">یادداشت‌ها</h4>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedCompany.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}