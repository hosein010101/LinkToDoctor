import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  Phone, 
  MapPin, 
  Calendar, 
  Activity, 
  FileText, 
  Edit, 
  MoreHorizontal, 
  Download, 
  Eye, 
  UserPlus,
  ChevronDown,
  Upload,
  FileImage,
  Heart,
  Shield,
  Clock,
  Pill,
  Stethoscope,
  FileHeart,
  Plus
} from "lucide-react";

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
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [selectedTestDetails, setSelectedTestDetails] = useState<any>(null);
  const [uploadFileType, setUploadFileType] = useState<string | null>(null);

  const samplePatient: Patient = {
    id: 1,
    name: "احمد رضایی",
    nationalId: "0123456789",
    gender: "male",
    age: 45,
    birthDate: "1979-05-15",
    phone: "09123456789",
    email: "ahmad.rezaei@email.com",
    address: "تهران، خیابان ولیعصر، پلاک 123",
    emergencyContact: {
      name: "فاطمه رضایی",
      phone: "09987654321",
      relation: "همسر"
    },
    insurance: {
      type: "تامین اجتماعی",
      number: "12345678901",
      status: "active"
    },
    lastVisit: "1403/05/20",
    doctorInCharge: "دکتر حسین حدادی",
    status: "stable",
    medicalHistory: {
      chronicDiseases: ["دیابت نوع 2", "فشار خون"],
      allergies: ["پنی‌سیلین", "بادام"],
      currentMedications: [
        { name: "متفورمین", dosage: "500mg", frequency: "دو بار در روز", startDate: "1402/03/10" },
        { name: "لوزارتان", dosage: "50mg", frequency: "روزی یک بار", startDate: "1402/01/15" }
      ],
      hospitalizations: [
        { date: "1402/08/12", reason: "کنترل قند خون", hospital: "بیمارستان میلاد", duration: "2 روز" }
      ],
      vaccinations: [
        { name: "واکسن آنفولانزا", date: "1402/07/20", nextDue: "1403/07/20" },
        { name: "واکسن کووید-19", date: "1401/02/10" }
      ]
    },
    testHistory: [
      { id: 1, date: "1403/05/20", testName: "آزمایش قند خون", result: "126 mg/dL", status: "normal", doctor: "دکتر حسین حدادی", reportUrl: "#" },
      { id: 2, date: "1403/05/15", testName: "آزمایش کلسترول", result: "180 mg/dL", status: "abnormal", doctor: "دکتر حسین حدادی" },
      { id: 3, date: "1403/05/10", testName: "آزمایش ادرار", result: "طبیعی", status: "normal", doctor: "دکتر نوری" }
    ],
    visitLogs: [
      { id: 1, date: "1403/05/20", type: "clinic", serviceType: "ویزیت عمومی", doctor: "دکتر حسین حدادی", notes: "کنترل دوره‌ای دیابت", duration: "30 دقیقه" },
      { id: 2, date: "1403/04/25", type: "home", serviceType: "نمونه‌گیری در منزل", doctor: "پرستار احمدی", notes: "نمونه‌گیری خون برای آزمایش", duration: "15 دقیقه" }
    ],
    attachments: [
      { id: 1, name: "نسخه آخرین ویزیت", type: "prescription", url: "#", uploadDate: "1403/05/20", uploadedBy: "دکتر حسین حدادی" },
      { id: 2, name: "گزارش سونوگرافی", type: "scan", url: "#", uploadDate: "1403/04/10", uploadedBy: "تکنسین رادیولوژی" }
    ]
  };

  const samplePatients: Patient[] = [
    { ...samplePatient, id: 1, name: "احمد رضایی", status: "stable" },
    { ...samplePatient, id: 2, name: "فاطمه احمدی", status: "healthy", gender: "female" },
    { ...samplePatient, id: 3, name: "محمد کریمی", status: "critical" },
    { ...samplePatient, id: 4, name: "زهرا حسینی", status: "recovering", gender: "female" }
  ];

  const getStatusBadge = (status: Patient["status"]) => {
    const statusConfig = {
      critical: { label: "بحرانی", color: "bg-red-100 text-red-800" },
      stable: { label: "پایدار", color: "bg-blue-100 text-blue-800" },
      recovering: { label: "در حال بهبود", color: "bg-orange-100 text-orange-800" },
      healthy: { label: "سالم", color: "bg-green-100 text-green-800" }
    };
    const config = statusConfig[status];
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const getTestStatusBadge = (status: "normal" | "abnormal" | "pending") => {
    const statusConfig = {
      normal: { label: "طبیعی", color: "bg-green-100 text-green-800" },
      abnormal: { label: "غیرطبیعی", color: "bg-red-100 text-red-800" },
      pending: { label: "در انتظار", color: "bg-orange-100 text-orange-800" }
    };
    const config = statusConfig[status];
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const filteredPatients = samplePatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.nationalId.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Patient List View
  if (!selectedPatient) {
    return (
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت بیماران</h1>
            <p className="text-gray-600 mt-1">مشاهده و مدیریت اطلاعات بیماران</p>
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowNewPatientForm(true)}
          >
            <UserPlus className="w-4 h-4 ml-2" />
            بیمار جدید
          </Button>
        </div>

        {/* Filters */}
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="جستجو در بیماران..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="وضعیت سلامت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="healthy">سالم</SelectItem>
                    <SelectItem value="stable">پایدار</SelectItem>
                    <SelectItem value="recovering">در حال بهبود</SelectItem>
                    <SelectItem value="critical">بحرانی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="card-professional hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/avatars/patient-${patient.id}.jpg`} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {patient.name.split(' ')[0][0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.nationalId}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setSelectedPatient(patient)}>
                        <Eye className="w-4 h-4 ml-2" />
                        مشاهده جزئیات
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedPatient(patient);
                        setIsEditingPatient(true);
                      }}>
                        <Edit className="w-4 h-4 ml-2" />
                        ویرایش اطلاعات
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0" onClick={() => setSelectedPatient(patient)}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">وضعیت:</span>
                    {getStatusBadge(patient.status)}
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>آخرین ویزیت: {patient.lastVisit}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                    <Stethoscope className="w-4 h-4" />
                    <span>{patient.doctorInCharge}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Patient Registration Modal */}
        {showNewPatientForm && (
          <Dialog open={showNewPatientForm} onOpenChange={setShowNewPatientForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-right text-xl font-bold">
                  ثبت بیمار جدید
                </DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
                  <TabsTrigger value="contact">اطلاعات تماس</TabsTrigger>
                  <TabsTrigger value="insurance">بیمه</TabsTrigger>
                  <TabsTrigger value="medical">سوابق پزشکی</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نام کامل *</label>
                      <Input placeholder="نام و نام خانوادگی" className="border-gray-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی *</label>
                      <Input placeholder="0000000000" className="border-gray-300" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">جنسیت *</label>
                      <Select>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">مرد</SelectItem>
                          <SelectItem value="female">زن</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ تولد *</label>
                      <Input type="date" className="border-gray-300" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                    <Button variant="outline" onClick={() => setShowNewPatientForm(false)}>
                      انصراف
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      ثبت بیمار
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <>
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
                <Button 
                  variant="outline" 
                  className="border-gray-200 hover:bg-gray-50"
                  onClick={() => setIsEditingPatient(true)}
                >
                  <Edit className="w-4 h-4 ml-2" />
                  ویرایش اطلاعات
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  سفارش جدید
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Avatar and Basic Info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={`/avatars/patient-${selectedPatient.id}.jpg`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      {selectedPatient.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPatient.name}</h2>
                  <p className="text-gray-600 mb-4">{selectedPatient.nationalId}</p>
                  {getStatusBadge(selectedPatient.status)}
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">سن</p>
                          <p className="font-semibold text-gray-900">{selectedPatient.age} سال</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Phone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">تلفن</p>
                          <p className="font-semibold text-gray-900">{selectedPatient.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Calendar className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">آخرین ویزیت</p>
                          <p className="font-semibold text-gray-900">{selectedPatient.lastVisit}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Stethoscope className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">پزشک معالج</p>
                          <p className="font-semibold text-gray-900">{selectedPatient.doctorInCharge}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">اطلاعات کلی</TabsTrigger>
            <TabsTrigger value="medical">سوابق پزشکی</TabsTrigger>
            <TabsTrigger value="tests">آزمایش‌ها</TabsTrigger>
            <TabsTrigger value="visits">ویزیت‌ها</TabsTrigger>
            <TabsTrigger value="medications">داروها</TabsTrigger>
            <TabsTrigger value="files">فایل‌ها</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>اطلاعات تماس</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">شماره تلفن</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">ایمیل</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.email || 'وارد نشده'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">آدرس</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Shield className="w-5 h-5 text-red-600" />
                    <span>تماس اضطراری</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">نام</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.emergencyContact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">شماره تلفن</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.emergencyContact.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">نسبت</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.emergencyContact.relation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card className="card-professional">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 space-x-reverse">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span>اطلاعات بیمه</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">نوع بیمه</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.insurance.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">شماره بیمه</label>
                      <p className="text-gray-900 font-semibold">{selectedPatient.insurance.number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">وضعیت</label>
                      <Badge className={`mt-1 ${
                        selectedPatient.insurance.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : selectedPatient.insurance.status === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedPatient.insurance.status === 'active' ? 'فعال' : 
                         selectedPatient.insurance.status === 'expired' ? 'منقضی' : 'در انتظار'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="medical" className="mt-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span>سوابق پزشکی</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="chronic-diseases">
                    <AccordionTrigger>بیماری‌های مزمن</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {selectedPatient.medicalHistory.chronicDiseases.map((disease, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2">
                            {disease}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="allergies">
                    <AccordionTrigger>حساسیت‌ها</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {selectedPatient.medicalHistory.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="mr-2 mb-2 bg-red-50 text-red-700">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="hospitalizations">
                    <AccordionTrigger>سوابق بستری</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {selectedPatient.medicalHistory.hospitalizations.map((hospitalization, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">تاریخ</label>
                                <p className="text-gray-900">{hospitalization.date}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">مدت زمان</label>
                                <p className="text-gray-900">{hospitalization.duration}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">بیمارستان</label>
                                <p className="text-gray-900">{hospitalization.hospital}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">علت</label>
                                <p className="text-gray-900">{hospitalization.reason}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="vaccinations">
                    <AccordionTrigger>واکسیناسیون</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {selectedPatient.medicalHistory.vaccinations.map((vaccination, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">نام واکسن</label>
                                <p className="text-gray-900">{vaccination.name}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">تاریخ تزریق</label>
                                <p className="text-gray-900">{vaccination.date}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-700">تاریخ بعدی</label>
                                <p className="text-gray-900">{vaccination.nextDue || 'تعریف نشده'}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tests" className="mt-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>تاریخچه آزمایش‌ها</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-right p-4 font-medium text-gray-700">تاریخ</th>
                        <th className="text-right p-4 font-medium text-gray-700">نام آزمایش</th>
                        <th className="text-right p-4 font-medium text-gray-700">نتیجه</th>
                        <th className="text-right p-4 font-medium text-gray-700">وضعیت</th>
                        <th className="text-right p-4 font-medium text-gray-700">پزشک</th>
                        <th className="text-right p-4 font-medium text-gray-700">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPatient.testHistory.map((test) => (
                        <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4">{formatDate(test.date)}</td>
                          <td className="p-4 font-medium">{test.testName}</td>
                          <td className="p-4">{test.result}</td>
                          <td className="p-4">{getTestStatusBadge(test.status)}</td>
                          <td className="p-4">{test.doctor}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedTestDetails(test)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {test.reportUrl && (
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="mt-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>تاریخچه ویزیت‌ها</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPatient.visitLogs.map((visit) => (
                    <div key={visit.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">تاریخ</label>
                          <p className="text-gray-900 font-semibold">{formatDate(visit.date)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">نوع ویزیت</label>
                          <Badge variant="outline" className={`mt-1 ${
                            visit.type === 'clinic' ? 'bg-blue-50 text-blue-700' :
                            visit.type === 'home' ? 'bg-green-50 text-green-700' :
                            'bg-red-50 text-red-700'
                          }`}>
                            {visit.type === 'clinic' ? 'کلینیک' : visit.type === 'home' ? 'منزل' : 'اورژانس'}
                          </Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">نوع خدمت</label>
                          <p className="text-gray-900">{visit.serviceType}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">مدت زمان</label>
                          <p className="text-gray-900">{visit.duration}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">پزشک/پرستار</label>
                          <p className="text-gray-900">{visit.doctor}</p>
                        </div>
                        <div className="md:col-span-3">
                          <label className="text-sm font-medium text-gray-700">یادداشت‌ها</label>
                          <p className="text-gray-900">{visit.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medications" className="mt-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 space-x-reverse">
                  <Pill className="w-5 h-5 text-purple-600" />
                  <span>داروهای فعلی</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPatient.medicalHistory.currentMedications.map((medication, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">نام دارو</label>
                          <p className="text-gray-900 font-semibold">{medication.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">دوز</label>
                            <p className="text-gray-900">{medication.dosage}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">تناوب</label>
                            <p className="text-gray-900">{medication.frequency}</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">تاریخ شروع</label>
                          <p className="text-gray-900">{medication.startDate}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FileImage className="w-5 h-5 text-blue-600" />
                    <span>فایل‌ها و ضمائم</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Upload className="w-4 h-4 ml-2" />
                        آپلود فایل
                        <ChevronDown className="w-4 h-4 mr-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setUploadFileType('prescription')}>
                        <FileText className="w-4 h-4 ml-2" />
                        نسخه پزشک
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUploadFileType('scan')}>
                        <FileImage className="w-4 h-4 ml-2" />
                        تصویربرداری
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUploadFileType('report')}>
                        <Activity className="w-4 h-4 ml-2" />
                        گزارش آزمایش
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setUploadFileType('note')}>
                        <Edit className="w-4 h-4 ml-2" />
                        یادداشت پزشکی
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedPatient.attachments.map((attachment) => (
                    <Card key={attachment.id} className="border border-gray-200 hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-lg ${
                            attachment.type === 'prescription' ? 'bg-blue-100' :
                            attachment.type === 'scan' ? 'bg-green-100' :
                            attachment.type === 'report' ? 'bg-purple-100' :
                            'bg-orange-100'
                          }`}>
                            {attachment.type === 'prescription' ? <FileText className="w-5 h-5 text-blue-600" /> :
                             attachment.type === 'scan' ? <FileImage className="w-5 h-5 text-green-600" /> :
                             attachment.type === 'report' ? <Activity className="w-5 h-5 text-purple-600" /> :
                             <FileHeart className="w-5 h-5 text-orange-600" />}
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 ml-2" />
                                مشاهده
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 ml-2" />
                                دانلود
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">{attachment.name}</h4>
                          <p className="text-sm text-gray-600">آپلود شده توسط: {attachment.uploadedBy}</p>
                          <p className="text-sm text-gray-600">{attachment.uploadDate}</p>
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

      {/* Edit Patient Modal */}
      <Dialog open={isEditingPatient} onOpenChange={setIsEditingPatient}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right text-xl font-bold">
              ویرایش اطلاعات بیمار: {selectedPatient?.name}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">اطلاعات پایه</TabsTrigger>
              <TabsTrigger value="contact">اطلاعات تماس</TabsTrigger>
              <TabsTrigger value="insurance">بیمه</TabsTrigger>
              <TabsTrigger value="medical">سوابق پزشکی</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام کامل</label>
                  <Input defaultValue={selectedPatient?.name} className="border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
                  <Input defaultValue={selectedPatient?.nationalId} className="border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">جنسیت</label>
                  <Select defaultValue={selectedPatient?.gender}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">مرد</SelectItem>
                      <SelectItem value="female">زن</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ تولد</label>
                  <Input type="date" defaultValue={selectedPatient?.birthDate} className="border-gray-300" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <Button variant="outline" onClick={() => setIsEditingPatient(false)}>
                  انصراف
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  ذخیره تغییرات
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
                  <Input defaultValue={selectedPatient?.phone} className="border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                  <Input defaultValue={selectedPatient?.email} className="border-gray-300" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                  <Input defaultValue={selectedPatient?.address} className="border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام تماس اضطراری</label>
                  <Input defaultValue={selectedPatient?.emergencyContact.name} className="border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تلفن تماس اضطراری</label>
                  <Input defaultValue={selectedPatient?.emergencyContact.phone} className="border-gray-300" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <Button variant="outline" onClick={() => setIsEditingPatient(false)}>
                  انصراف
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  ذخیره تغییرات
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="insurance" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع بیمه</label>
                  <Select defaultValue={selectedPatient?.insurance.type}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تامین اجتماعی">تامین اجتماعی</SelectItem>
                      <SelectItem value="بیمه سلامت">بیمه سلامت</SelectItem>
                      <SelectItem value="نیروهای مسلح">نیروهای مسلح</SelectItem>
                      <SelectItem value="خصوصی">خصوصی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شماره بیمه</label>
                  <Input defaultValue={selectedPatient?.insurance.number} className="border-gray-300" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <Button variant="outline" onClick={() => setIsEditingPatient(false)}>
                  انصراف
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  ذخیره تغییرات
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="mt-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">بیماری‌های مزمن</label>
                  <Input 
                    defaultValue={selectedPatient?.medicalHistory.chronicDiseases.join(', ')} 
                    className="border-gray-300" 
                    placeholder="بیماری‌ها را با کاما جدا کنید"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">حساسیت‌ها</label>
                  <Input 
                    defaultValue={selectedPatient?.medicalHistory.allergies.join(', ')} 
                    className="border-gray-300" 
                    placeholder="حساسیت‌ها را با کاما جدا کنید"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 space-x-reverse mt-6">
                <Button variant="outline" onClick={() => setIsEditingPatient(false)}>
                  انصراف
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  ذخیره تغییرات
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Test Details Modal */}
      {selectedTestDetails && (
        <Dialog open={!!selectedTestDetails} onOpenChange={() => setSelectedTestDetails(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                جزئیات آزمایش: {selectedTestDetails.testName}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">تاریخ آزمایش</label>
                  <p className="text-gray-900 font-semibold">{formatDate(selectedTestDetails.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">پزشک درخواست‌کننده</label>
                  <p className="text-gray-900 font-semibold">{selectedTestDetails.doctor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">نتیجه</label>
                  <p className="text-gray-900 font-semibold">{selectedTestDetails.result}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">وضعیت</label>
                  <div className="mt-1">
                    {getTestStatusBadge(selectedTestDetails.status)}
                  </div>
                </div>
              </div>
              
              {selectedTestDetails.reportUrl && (
                <div>
                  <label className="text-sm font-medium text-gray-700">گزارش آزمایش</label>
                  <div className="mt-2 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-900">گزارش PDF</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 ml-2" />
                        دانلود
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* File Upload Modal */}
      {uploadFileType && (
        <Dialog open={!!uploadFileType} onOpenChange={() => setUploadFileType(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                آپلود {uploadFileType === 'prescription' ? 'نسخه پزشک' : 
                       uploadFileType === 'scan' ? 'تصویربرداری' :
                       uploadFileType === 'report' ? 'گزارش آزمایش' : 'یادداشت پزشکی'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام فایل</label>
                <Input placeholder="نام فایل را وارد کنید" className="border-gray-300" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">انتخاب فایل</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">فایل را اینجا رها کنید یا کلیک کنید</p>
                  <Button variant="outline" size="sm">
                    انتخاب فایل
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 space-x-reverse">
                <Button variant="outline" onClick={() => setUploadFileType(null)}>
                  انصراف
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  آپلود
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}