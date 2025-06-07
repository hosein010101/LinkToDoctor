import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function Organizational() {
  const [activeTab, setActiveTab] = useState("companies");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showEmployeeUpload, setShowEmployeeUpload] = useState(false);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const sampleCompanies: Company[] = [
    {
      id: 1,
      name: "شرکت پتروشیمی ایران",
      logo: "/api/placeholder/80/80",
      contactPerson: "مهندس احمد رضایی",
      phone: "021-88776655",
      email: "ahmad.rezaei@iranpetro.com",
      address: "تهران، منطقه ویژه اقتصادی پتروشیمی",
      hrContact: {
        name: "خانم زهرا محمدی",
        phone: "021-88776656",
        email: "hr@iranpetro.com"
      },
      employeeCount: 250,
      contractStatus: "active",
      lastCheckup: "1403/03/15",
      nextScheduled: "1403/06/15",
      notes: "قرارداد سالانه تمدید شده"
    },
    {
      id: 2,
      name: "بانک ملی شعبه مرکزی",
      logo: "/api/placeholder/80/80",
      contactPerson: "آقای علی حسینی",
      phone: "021-44332211",
      email: "ali.hosseini@bankmelli.ir",
      address: "تهران، خیابان فردوسی، پلاک 100",
      hrContact: {
        name: "آقای محمد قاسمی",
        phone: "021-44332212",
        email: "hr@bankmelli.ir"
      },
      employeeCount: 180,
      contractStatus: "active",
      lastCheckup: "1403/02/20",
      nextScheduled: "1403/05/20"
    },
    {
      id: 3,
      name: "شرکت آریا سازان",
      logo: "/api/placeholder/80/80",
      contactPerson: "مهندس سارا کریمی",
      phone: "021-55443322",
      email: "sara.karimi@ariasazan.com",
      address: "تهران، خیابان ولیعصر، برج میلاد",
      hrContact: {
        name: "خانم مریم رضوی",
        phone: "021-55443323",
        email: "hr@ariasazan.com"
      },
      employeeCount: 120,
      contractStatus: "pending",
      lastCheckup: "1403/02/10",
      notes: "در انتظار تمدید قرارداد"
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      active: { color: "bg-green-500", label: "فعال" },
      pending: { color: "bg-yellow-500", label: "در انتظار" },
      expired: { color: "bg-red-500", label: "منقضی" },
      suspended: { color: "bg-gray-500", label: "متوقف" }
    };
    const config = statusConfig[status] || { color: "bg-gray-500", label: status };
    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  const filteredCompanies = sampleCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || company.contractStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-20">
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

      <div className="w-full mb-8">
        <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-2xl p-3 shadow-lg border border-blue-100">
          <div className="grid grid-cols-6 gap-2">
            <button
              onClick={() => setActiveTab("companies")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-3 py-3 rounded-xl 
                transition-all duration-300 font-semibold text-xs relative overflow-hidden
                ${activeTab === "companies" 
                  ? "bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 text-cyan-800 shadow-lg transform scale-105 border-2 border-cyan-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:shadow-md"
                }
              `}
            >
              <Building2 className="w-4 h-4" />
              <span>پروفایل شرکت‌ها</span>
            </button>
            
            <button
              onClick={() => setActiveTab("employees")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-3 py-3 rounded-xl 
                transition-all duration-300 font-semibold text-xs relative overflow-hidden
                ${activeTab === "employees" 
                  ? "bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 text-emerald-800 shadow-lg transform scale-105 border-2 border-emerald-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 hover:shadow-md"
                }
              `}
            >
              <Users className="w-4 h-4" />
              <span>آپلود کارکنان</span>
            </button>
            
            <button
              onClick={() => setActiveTab("schedule")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-3 py-3 rounded-xl 
                transition-all duration-300 font-semibold text-xs relative overflow-hidden
                ${activeTab === "schedule" 
                  ? "bg-gradient-to-br from-purple-100 via-violet-100 to-indigo-100 text-purple-800 shadow-lg transform scale-105 border-2 border-purple-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-purple-50 hover:to-violet-50 hover:text-purple-700 hover:shadow-md"
                }
              `}
            >
              <Calendar className="w-4 h-4" />
              <span>زمان‌بندی نمونه‌گیری</span>
            </button>
            
            <button
              onClick={() => setActiveTab("reports")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-3 py-3 rounded-xl 
                transition-all duration-300 font-semibold text-xs relative overflow-hidden
                ${activeTab === "reports" 
                  ? "bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-100 text-amber-800 shadow-lg transform scale-105 border-2 border-amber-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700 hover:shadow-md"
                }
              `}
            >
              <BarChart3 className="w-4 h-4" />
              <span>گزارش سلامت گروهی</span>
            </button>
            
            <button
              onClick={() => setActiveTab("contracts")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-3 py-3 rounded-xl 
                transition-all duration-300 font-semibold text-xs relative overflow-hidden
                ${activeTab === "contracts" 
                  ? "bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 text-rose-800 shadow-lg transform scale-105 border-2 border-rose-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 hover:shadow-md"
                }
              `}
            >
              <FileText className="w-4 h-4" />
              <span>قرارداد و مالی</span>
            </button>
            
            <button
              onClick={() => setActiveTab("sampling")}
              className={`
                flex items-center justify-center space-x-2 space-x-reverse px-3 py-3 rounded-xl 
                transition-all duration-300 font-semibold text-xs relative overflow-hidden
                ${activeTab === "sampling" 
                  ? "bg-gradient-to-br from-indigo-100 via-blue-100 to-violet-100 text-indigo-800 shadow-lg transform scale-105 border-2 border-indigo-200" 
                  : "text-slate-600 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-blue-50 hover:text-indigo-700 hover:shadow-md"
                }
              `}
            >
              <Home className="w-4 h-4" />
              <span>نمونه‌گیری منزل</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "companies" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="جستجو در شرکت‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
                <div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="border-gray-200">
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
                  <Button variant="outline" className="w-full border-gray-200">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={company.logo} alt={company.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {company.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-500">{company.employeeCount} کارمند</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getStatusBadge(company.contractStatus)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedCompany(company)}>
                            <Eye className="w-4 h-4 ml-2" />
                            مشاهده جزئیات
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 ml-2" />
                      <span>{company.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 ml-2" />
                      <span>{company.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 ml-2" />
                      <span className="line-clamp-2">{company.address}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">آخرین چکاپ:</span>
                        <p className="font-medium">{company.lastCheckup}</p>
                      </div>
                      {company.nextScheduled && (
                        <div>
                          <span className="text-gray-500">بعدی:</span>
                          <p className="font-medium text-blue-600">{company.nextScheduled}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 space-x-reverse pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setShowScheduleForm(true)}
                    >
                      <Calendar className="w-4 h-4 ml-1" />
                      زمان‌بندی
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 border-gray-200"
                    >
                      <BarChart3 className="w-4 h-4 ml-1" />
                      گزارش
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "employees" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>آپلود فایل اکسل کارکنان</span>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setShowEmployeeUpload(true)}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  شروع آپلود
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                <FileSpreadsheet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">آپلود فایل اکسل کارکنان</h3>
                <p className="text-gray-500 mb-4">
                  فایل اکسل حاوی اطلاعات کارکنان شرکت را آپلود کنید
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowEmployeeUpload(true)}
                >
                  انتخاب فایل
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "schedule" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>زمان‌بندی نمونه‌گیری سازمانی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CalendarDays className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">زمان‌بندی نمونه‌گیری</h3>
                <p className="text-gray-500 mb-4">
                  برنامه‌ریزی و زمان‌بندی نمونه‌گیری برای شرکت‌ها
                </p>
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
        </div>
      )}

      {activeTab === "reports" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>گزارش سلامت گروهی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">آنالیز سلامت سازمانی</h3>
                <p className="text-gray-500 mb-4">
                  گزارش‌های جامع سلامت کارکنان شرکت‌ها
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <TrendingUp className="w-4 h-4 ml-2" />
                  مشاهده گزارش‌ها
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "contracts" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>مدیریت قراردادها و امور مالی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 mx-auto text-rose-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">قراردادها و مالی</h3>
                <p className="text-gray-500 mb-4">
                  مدیریت قراردادها، صورتحساب‌ها و امور مالی
                </p>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white">
                  <FileText className="w-4 h-4 ml-2" />
                  مشاهده قراردادها
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "sampling" && (
        <div className="space-y-6">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>نمونه‌گیری در منزل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Home className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">خدمات نمونه‌گیری منزل</h3>
                <p className="text-gray-500 mb-4">
                  مدیریت نمونه‌گیری در محل سکونت کارکنان
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Navigation className="w-4 h-4 ml-2" />
                  برنامه‌ریزی نمونه‌گیری
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Company Details Modal */}
      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                جزئیات شرکت: {selectedCompany.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">اطلاعات کلی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><strong>نام شرکت:</strong> {selectedCompany.name}</div>
                  <div><strong>نماینده:</strong> {selectedCompany.contactPerson}</div>
                  <div><strong>تلفن:</strong> {selectedCompany.phone}</div>
                  <div><strong>ایمیل:</strong> {selectedCompany.email}</div>
                  <div><strong>تعداد کارکنان:</strong> {selectedCompany.employeeCount}</div>
                  <div><strong>وضعیت قرارداد:</strong> {getStatusBadge(selectedCompany.contractStatus)}</div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">اطلاعات منابع انسانی</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div><strong>نماینده HR:</strong> {selectedCompany.hrContact.name}</div>
                  <div><strong>تلفن HR:</strong> {selectedCompany.hrContact.phone}</div>
                  <div><strong>ایمیل HR:</strong> {selectedCompany.hrContact.email}</div>
                  <div><strong>آخرین چکاپ:</strong> {selectedCompany.lastCheckup}</div>
                  {selectedCompany.nextScheduled && (
                    <div><strong>بعدی:</strong> {selectedCompany.nextScheduled}</div>
                  )}
                  {selectedCompany.notes && (
                    <div><strong>یادداشت:</strong> {selectedCompany.notes}</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}