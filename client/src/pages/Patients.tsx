import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { 
  UserCheck, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Heart,
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Mail,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Pill,
  Stethoscope,
  FileImage,
  Plus,
  X,
  ChevronDown,
  Star,
  User,
  Phone as PhoneIcon,
  Home,
  Building,
  CreditCard,
  Calendar as CalendarIcon
} from "lucide-react";

// Patient data interface
interface Patient {
  id: number;
  name: string;
  nationalId: string;
  gender: "male" | "female";
  age: number;
  birthDate: string;
  phone: string;
  email?: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  insurance: {
    type: string;
    number: string;
    status: "active" | "expired" | "pending";
  };
  lastVisit: string;
  doctorInCharge: string;
  status: "critical" | "stable" | "recovering" | "healthy";
  medicalHistory: {
    chronicDiseases: string[];
    allergies: string[];
    currentMedications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      startDate: string;
    }>;
    hospitalizations: Array<{
      date: string;
      reason: string;
      hospital: string;
      duration: string;
    }>;
    vaccinations: Array<{
      name: string;
      date: string;
      nextDue?: string;
    }>;
  };
  testHistory: Array<{
    id: number;
    date: string;
    testName: string;
    result: string;
    status: "normal" | "abnormal" | "pending";
    doctor: string;
    reportUrl?: string;
  }>;
  visitLogs: Array<{
    id: number;
    date: string;
    type: "clinic" | "home" | "emergency";
    serviceType: string;
    doctor: string;
    notes: string;
    duration: string;
  }>;
  attachments: Array<{
    id: number;
    name: string;
    type: "prescription" | "scan" | "report" | "note";
    url: string;
    uploadDate: string;
    uploadedBy: string;
  }>;
}

export default function Patients() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [testTypeFilter, setTestTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Sample patient data
  const samplePatient: Patient = {
    id: 1,
    name: "زهرا احمدی",
    nationalId: "1234567890",
    gender: "female",
    age: 35,
    birthDate: "1988-05-15",
    phone: "09123456789",
    email: "zahra.ahmadi@email.com",
    address: "تهران، خیابان ولیعصر، پلاک 123، واحد 45",
    emergencyContact: {
      name: "محمد احمدی",
      phone: "09121234567",
      relation: "همسر"
    },
    insurance: {
      type: "تامین اجتماعی",
      number: "9876543210",
      status: "active"
    },
    lastVisit: "2024-06-01",
    doctorInCharge: "دکتر حسین حدادی",
    status: "stable",
    medicalHistory: {
      chronicDiseases: ["دیابت نوع 2", "فشار خون بالا"],
      allergies: ["پنی‌سیلین", "بادام زمینی"],
      currentMedications: [
        {
          name: "متفورمین",
          dosage: "500mg",
          frequency: "دو بار در روز",
          startDate: "2023-01-15"
        },
        {
          name: "آملودیپین",
          dosage: "5mg",
          frequency: "یک بار در روز",
          startDate: "2023-03-10"
        }
      ],
      hospitalizations: [
        {
          date: "2023-08-15",
          reason: "کنترل قند خون",
          hospital: "بیمارستان پارس",
          duration: "3 روز"
        }
      ],
      vaccinations: [
        {
          name: "واکسن کووید-19",
          date: "2023-01-20",
          nextDue: "2024-01-20"
        },
        {
          name: "واکسن آنفلوآنزا",
          date: "2023-10-15",
          nextDue: "2024-10-15"
        }
      ]
    },
    testHistory: [
      {
        id: 1,
        date: "2024-06-01",
        testName: "آزمایش خون کامل",
        result: "طبیعی",
        status: "normal",
        doctor: "دکتر حسین حدادی",
        reportUrl: "/reports/cbc-001.pdf"
      },
      {
        id: 2,
        date: "2024-05-15",
        testName: "تست هموگلوبین A1C",
        result: "7.2%",
        status: "abnormal",
        doctor: "دکتر حسین حدادی",
        reportUrl: "/reports/hba1c-001.pdf"
      },
      {
        id: 3,
        date: "2024-05-01",
        testName: "پروفایل لیپید",
        result: "در حال بررسی",
        status: "pending",
        doctor: "دکتر سارا نوری"
      }
    ],
    visitLogs: [
      {
        id: 1,
        date: "2024-06-01",
        type: "clinic",
        serviceType: "ویزیت عمومی",
        doctor: "دکتر حسین حدادی",
        notes: "کنترل دوره‌ای دیابت، تنظیم دارو",
        duration: "30 دقیقه"
      },
      {
        id: 2,
        date: "2024-05-15",
        type: "home",
        serviceType: "نمونه‌گیری خانگی",
        doctor: "تکنسین علی محمدی",
        notes: "نمونه‌گیری برای آزمایش HbA1c",
        duration: "15 دقیقه"
      }
    ],
    attachments: [
      {
        id: 1,
        name: "نسخه پزشک",
        type: "prescription",
        url: "/files/prescription-001.pdf",
        uploadDate: "2024-06-01",
        uploadedBy: "دکتر حسین حدادی"
      },
      {
        id: 2,
        name: "سونوگرافی شکم",
        type: "scan",
        url: "/files/ultrasound-001.jpg",
        uploadDate: "2024-05-20",
        uploadedBy: "دکتر سارا نوری"
      }
    ]
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      critical: { label: "وضعیت بحرانی", class: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
      stable: { label: "پایدار", class: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      recovering: { label: "در حال بهبود", class: "bg-blue-100 text-blue-800 border-blue-200", icon: Activity },
      healthy: { label: "سالم", class: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: Heart },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
                      { label: status, class: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock };
    
    const Icon = statusInfo.icon;
    
    return (
      <Badge className={`${statusInfo.class} border font-medium inline-flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  const getTestStatusBadge = (status: string) => {
    const statusMap = {
      normal: { label: "طبیعی", class: "bg-green-100 text-green-800 border-green-200" },
      abnormal: { label: "غیرطبیعی", class: "bg-red-100 text-red-800 border-red-200" },
      pending: { label: "در انتظار", class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
                      { label: status, class: "bg-gray-100 text-gray-800 border-gray-200" };
    
    return (
      <Badge className={`${statusInfo.class} border font-medium`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getInsuranceStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "فعال", class: "bg-green-100 text-green-800 border-green-200" },
      expired: { label: "منقضی", class: "bg-red-100 text-red-800 border-red-200" },
      pending: { label: "در انتظار تایید", class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || 
                      { label: status, class: "bg-gray-100 text-gray-800 border-gray-200" };
    
    return (
      <Badge className={`${statusInfo.class} border font-medium`}>
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (!selectedPatient) {
    return (
      <div className="space-y-6">
        {/* Patient Selection Header */}
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">سوابق و تاریخچه بیماران</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  مدیریت جامع اطلاعات بیماران و سوابق پزشکی
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="ml-2 w-4 h-4" />
                بیمار جدید
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="جستجو بیمار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="وضعیت سلامت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="critical">بحرانی</SelectItem>
                  <SelectItem value="stable">پایدار</SelectItem>
                  <SelectItem value="recovering">در حال بهبود</SelectItem>
                  <SelectItem value="healthy">سالم</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="آخرین ویزیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه تاریخ‌ها</SelectItem>
                  <SelectItem value="today">امروز</SelectItem>
                  <SelectItem value="week">هفته گذشته</SelectItem>
                  <SelectItem value="month">ماه گذشته</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Download className="ml-2 w-4 h-4" />
                خروجی Excel
              </Button>
            </div>

            {/* Sample Patient Card */}
            <Card className="card-professional hover:shadow-lg transition-all duration-200 cursor-pointer" 
                  onClick={() => setSelectedPatient(samplePatient)}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Avatar className="h-16 w-16 border-2 border-blue-500">
                    <AvatarImage src="/avatars/patient-001.jpg" alt="زهرا احمدی" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">
                      ز.ا
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        زهرا احمدی
                      </h3>
                      {getStatusBadge(samplePatient.status)}
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <User className="w-4 h-4" />
                        <span>کد ملی: {samplePatient.nationalId}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <CalendarIcon className="w-4 h-4" />
                        <span>سن: {samplePatient.age} سال</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{samplePatient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Stethoscope className="w-4 h-4" />
                        <span>آخرین ویزیت: {formatDate(samplePatient.lastVisit)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Patient Overview Header */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setSelectedPatient(null)} className="hover:bg-gray-100">
              <ChevronDown className="w-4 h-4 ml-2 rotate-90" />
              بازگشت به فهرست
            </Button>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <Edit className="w-4 h-4 ml-2" />
                ویرایش
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 ml-2" />
                ویزیت جدید
              </Button>
            </div>
          </div>

          {/* Patient Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start space-x-6 space-x-reverse">
                <Avatar className="h-24 w-24 border-4 border-blue-500">
                  <AvatarImage src="/avatars/patient-001.jpg" alt={selectedPatient.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                    ز.ا
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      {selectedPatient.name}
                    </h2>
                    {getStatusBadge(selectedPatient.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">کد ملی</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.nationalId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">جنسیت</label>
                      <p className="text-gray-900 dark:text-white font-semibold">
                        {selectedPatient.gender === 'female' ? 'زن' : 'مرد'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">سن</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.age} سال</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">تاریخ تولد</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{formatDate(selectedPatient.birthDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">آخرین ویزیت</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{formatDate(selectedPatient.lastVisit)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">پزشک معالج</label>
                      <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.doctorInCharge}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insurance Info */}
            <Card className="card-professional">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center space-x-2 space-x-reverse">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>اطلاعات بیمه</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نوع بیمه</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.insurance.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره بیمه</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.insurance.number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">وضعیت</label>
                  <div className="mt-1">
                    {getInsuranceStatusBadge(selectedPatient.insurance.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="history" className="space-y-6">
        <Card className="card-professional">
          <CardContent className="p-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="history">سوابق پزشکی</TabsTrigger>
              <TabsTrigger value="tests">آزمایشات</TabsTrigger>
              <TabsTrigger value="visits">ویزیت‌ها</TabsTrigger>
              <TabsTrigger value="contact">اطلاعات تماس</TabsTrigger>
              <TabsTrigger value="files">فایل‌ها</TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        {/* Medical History Tab */}
        <TabsContent value="history">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>سوابق پزشکی و تاریخچه درمان</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="chronic">
                  <AccordionTrigger className="text-lg font-semibold">
                    بیماری‌های مزمن
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {selectedPatient.medicalHistory.chronicDiseases.map((disease, index) => (
                        <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="allergies">
                  <AccordionTrigger className="text-lg font-semibold">
                    حساسیت‌ها
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {selectedPatient.medicalHistory.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="medications">
                  <AccordionTrigger className="text-lg font-semibold">
                    داروهای در حال استفاده
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {selectedPatient.medicalHistory.currentMedications.map((med, index) => (
                        <Card key={index} className="border border-gray-200 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">نام دارو</label>
                              <p className="font-semibold text-gray-900">{med.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">دوز</label>
                              <p className="font-semibold text-gray-900">{med.dosage}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">فرکانس</label>
                              <p className="font-semibold text-gray-900">{med.frequency}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">تاریخ شروع</label>
                              <p className="font-semibold text-gray-900">{formatDate(med.startDate)}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hospitalizations">
                  <AccordionTrigger className="text-lg font-semibold">
                    سوابق بستری
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {selectedPatient.medicalHistory.hospitalizations.map((hosp, index) => (
                        <Card key={index} className="border border-gray-200 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">تاریخ</label>
                              <p className="font-semibold text-gray-900">{formatDate(hosp.date)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">علت</label>
                              <p className="font-semibold text-gray-900">{hosp.reason}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">بیمارستان</label>
                              <p className="font-semibold text-gray-900">{hosp.hospital}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">مدت</label>
                              <p className="font-semibold text-gray-900">{hosp.duration}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="vaccinations">
                  <AccordionTrigger className="text-lg font-semibold">
                    واکسیناسیون
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {selectedPatient.medicalHistory.vaccinations.map((vaccine, index) => (
                        <Card key={index} className="border border-gray-200 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-700">واکسن</label>
                              <p className="font-semibold text-gray-900">{vaccine.name}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">تاریخ تزریق</label>
                              <p className="font-semibold text-gray-900">{formatDate(vaccine.date)}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-700">تاریخ بعدی</label>
                              <p className="font-semibold text-gray-900">
                                {vaccine.nextDue ? formatDate(vaccine.nextDue) : "ندارد"}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test History Tab */}
        <TabsContent value="tests">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>تاریخچه آزمایشات</span>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                    <SelectTrigger className="w-48 border-gray-200">
                      <SelectValue placeholder="نوع آزمایش" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه آزمایشات</SelectItem>
                      <SelectItem value="blood">آزمایش خون</SelectItem>
                      <SelectItem value="urine">آزمایش ادرار</SelectItem>
                      <SelectItem value="imaging">تصویربرداری</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                    <Download className="w-4 h-4 ml-2" />
                    خروجی
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        تاریخ
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        نام آزمایش
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        نتیجه
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        وضعیت
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        پزشک
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedPatient.testHistory.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(test.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {test.testName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {test.result}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTestStatusBadge(test.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {test.doctor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              {test.reportUrl && (
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Download className="w-4 h-4" />
                                  دانلود گزارش
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Copy className="w-4 h-4" />
                                کپی اطلاعات
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visit Logs Tab */}
        <TabsContent value="visits">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 space-x-reverse">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span>تاریخچه ویزیت‌ها</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        تاریخ
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        نوع ویزیت
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        نوع خدمت
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        پزشک/تکنسین
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        مدت
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                        یادداشت‌ها
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {selectedPatient.visitLogs.map((visit) => (
                      <tr key={visit.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(visit.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={
                            visit.type === 'clinic' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            visit.type === 'home' ? 'bg-green-100 text-green-800 border-green-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }>
                            {visit.type === 'clinic' ? 'کلینیک' : 
                             visit.type === 'home' ? 'خانگی' : 'اورژانسی'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {visit.serviceType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {visit.doctor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {visit.duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs truncate">
                          {visit.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>اطلاعات تماس</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره تلفن</label>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.phone}</p>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {selectedPatient.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">ایمیل</label>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.email}</p>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">آدرس</label>
                  <div className="flex items-start justify-between mt-1">
                    <p className="text-gray-900 dark:text-white font-semibold leading-relaxed">
                      {selectedPatient.address}
                    </p>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100 mt-1">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>تماس اضطراری</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نام</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.emergencyContact.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره تلفن</label>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.emergencyContact.phone}</p>
                    <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">نسبت</label>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedPatient.emergencyContact.relation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Files & Attachments Tab */}
        <TabsContent value="files">
          <Card className="card-professional">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <FileImage className="w-5 h-5 text-blue-600" />
                  <span>فایل‌ها و ضمائم</span>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="w-4 h-4 ml-2" />
                  آپلود فایل
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedPatient.attachments.map((file) => (
                  <Card key={file.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className={`w-8 h-8 rounded flex items-center justify-center ${
                            file.type === 'prescription' ? 'bg-blue-100 text-blue-600' :
                            file.type === 'scan' ? 'bg-green-100 text-green-600' :
                            file.type === 'report' ? 'bg-purple-100 text-purple-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {file.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {file.type === 'prescription' ? 'نسخه پزشک' :
                               file.type === 'scan' ? 'تصویربرداری' :
                               file.type === 'report' ? 'گزارش' : 'یادداشت'}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              مشاهده
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              دانلود
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>آپلود: {formatDate(file.uploadDate)}</p>
                        <p>توسط: {file.uploadedBy}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}