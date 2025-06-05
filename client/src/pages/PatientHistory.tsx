import { useState } from "react";
import { 
  Users, Search, Calendar, FileText, Download, Eye, 
  Activity, Heart, Droplets, Thermometer, User,
  Phone, Mail, MapPin, Clock, TrendingUp, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PatientRecord {
  id: number;
  nationalId: string;
  name: string;
  age: number;
  gender: "مرد" | "زن";
  phone: string;
  email?: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string[];
  chronicDiseases: string[];
  lastVisit: string;
  totalTests: number;
  registrationDate: string;
}

interface TestHistory {
  id: number;
  patientId: number;
  testName: string;
  testType: string;
  orderDate: string;
  sampleDate: string;
  resultDate: string;
  status: "completed" | "pending" | "cancelled";
  results: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    status: "normal" | "high" | "low" | "critical";
  }[];
  doctorNotes?: string;
  reportUrl?: string;
}

export default function PatientHistory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [filterGender, setFilterGender] = useState("all");
  const [filterBloodType, setFilterBloodType] = useState("all");

  const patientRecords: PatientRecord[] = [
    {
      id: 1,
      nationalId: "0123456789",
      name: "مریم احمدی",
      age: 34,
      gender: "زن",
      phone: "09123456789",
      email: "maryam.ahmadi@email.com",
      address: "تهران، خیابان ولیعصر، پلاک 145",
      emergencyContact: "09987654321",
      bloodType: "A+",
      allergies: ["پنی‌سیلین", "آجیل"],
      chronicDiseases: ["دیابت نوع 2"],
      lastVisit: "1403/05/15",
      totalTests: 24,
      registrationDate: "1401/03/12"
    },
    {
      id: 2,
      nationalId: "9876543210",
      name: "علی حسینی",
      age: 45,
      gender: "مرد",
      phone: "09987654321",
      email: "ali.hosseini@email.com",
      address: "تهران، خیابان کریمخان، پلاک 89",
      emergencyContact: "09123456789",
      bloodType: "O-",
      allergies: [],
      chronicDiseases: ["فشار خون بالا", "کلسترول بالا"],
      lastVisit: "1403/05/20",
      totalTests: 18,
      registrationDate: "1400/08/05"
    },
    {
      id: 3,
      nationalId: "1357924680",
      name: "فاطمه کریمی",
      age: 28,
      gender: "زن",
      phone: "09111222333",
      email: "fateme.karimi@email.com",
      address: "تهران، خیابان فردوسی، پلاک 67",
      emergencyContact: "09444555666",
      bloodType: "B+",
      allergies: ["لاکتوز"],
      chronicDiseases: [],
      lastVisit: "1403/05/18",
      totalTests: 8,
      registrationDate: "1402/01/15"
    },
    {
      id: 4,
      nationalId: "2468013579",
      name: "محمد رضایی",
      age: 52,
      gender: "مرد",
      phone: "09777888999",
      email: "mohammad.rezaei@email.com",
      address: "تهران، خیابان نیاوران، پلاک 234",
      emergencyContact: "09333444555",
      bloodType: "AB+",
      allergies: ["آسپرین"],
      chronicDiseases: ["آسم", "آرتریت"],
      lastVisit: "1403/05/22",
      totalTests: 35,
      registrationDate: "1399/11/28"
    },
    {
      id: 5,
      nationalId: "3691470258",
      name: "زهرا محمودی",
      age: 38,
      gender: "زن",
      phone: "09555666777",
      email: "zahra.mahmoudi@email.com",
      address: "تهران، خیابان پاسداران، پلاک 178",
      emergencyContact: "09222333444",
      bloodType: "A-",
      allergies: ["سولفا"],
      chronicDiseases: ["میگرن"],
      lastVisit: "1403/05/19",
      totalTests: 15,
      registrationDate: "1401/07/03"
    }
  ];

  const testHistories: TestHistory[] = [
    {
      id: 1,
      patientId: 1,
      testName: "آزمایش خون کامل (CBC)",
      testType: "خون‌شناسی",
      orderDate: "1403/05/10",
      sampleDate: "1403/05/11",
      resultDate: "1403/05/12",
      status: "completed",
      results: [
        { parameter: "هموگلوبین", value: "12.5", unit: "g/dL", normalRange: "12-15.5", status: "normal" },
        { parameter: "گلبول‌های سفید", value: "8200", unit: "/μL", normalRange: "4500-11000", status: "normal" },
        { parameter: "پلاکت", value: "310000", unit: "/μL", normalRange: "150000-450000", status: "normal" },
        { parameter: "هماتوکریت", value: "38", unit: "%", normalRange: "36-46", status: "normal" }
      ],
      doctorNotes: "نتایج در محدوده طبیعی. ادامه درمان دیابت.",
      reportUrl: "/reports/patient1_cbc_20240511.pdf"
    },
    {
      id: 2,
      patientId: 1,
      testName: "آزمایش قند خون ناشتا",
      testType: "بیوشیمی",
      orderDate: "1403/05/10",
      sampleDate: "1403/05/11",
      resultDate: "1403/05/12",
      status: "completed",
      results: [
        { parameter: "گلوکز ناشتا", value: "145", unit: "mg/dL", normalRange: "70-100", status: "high" },
        { parameter: "HbA1c", value: "7.2", unit: "%", normalRange: "4-6", status: "high" }
      ],
      doctorNotes: "کنترل قند خون نیاز به بهبود دارد. تغییر دوز انسولین توصیه می‌شود.",
      reportUrl: "/reports/patient1_glucose_20240511.pdf"
    },
    {
      id: 3,
      patientId: 2,
      testName: "پروفایل لیپید",
      testType: "بیوشیمی",
      orderDate: "1403/05/15",
      sampleDate: "1403/05/16",
      resultDate: "1403/05/17",
      status: "completed",
      results: [
        { parameter: "کلسترول کل", value: "240", unit: "mg/dL", normalRange: "<200", status: "high" },
        { parameter: "LDL", value: "165", unit: "mg/dL", normalRange: "<100", status: "high" },
        { parameter: "HDL", value: "35", unit: "mg/dL", normalRange: ">40", status: "low" },
        { parameter: "تری‌گلیسرید", value: "220", unit: "mg/dL", normalRange: "<150", status: "high" }
      ],
      doctorNotes: "پروفایل لیپید نامطلوب. شروع درمان دارویی و رژیم غذایی ضروری است.",
      reportUrl: "/reports/patient2_lipid_20240516.pdf"
    },
    {
      id: 4,
      patientId: 3,
      testName: "آزمایش تیروئید",
      testType: "هورمونی",
      orderDate: "1403/05/12",
      sampleDate: "1403/05/13",
      resultDate: "1403/05/14",
      status: "completed",
      results: [
        { parameter: "TSH", value: "2.1", unit: "mIU/L", normalRange: "0.4-4.0", status: "normal" },
        { parameter: "T4 آزاد", value: "1.3", unit: "ng/dL", normalRange: "0.8-1.8", status: "normal" },
        { parameter: "T3 آزاد", value: "3.2", unit: "pg/mL", normalRange: "2.3-4.2", status: "normal" }
      ],
      doctorNotes: "عملکرد تیروئید طبیعی است.",
      reportUrl: "/reports/patient3_thyroid_20240513.pdf"
    },
    {
      id: 5,
      patientId: 4,
      testName: "آزمایش کبد",
      testType: "بیوشیمی",
      orderDate: "1403/05/18",
      sampleDate: "1403/05/19",
      resultDate: "1403/05/20",
      status: "completed",
      results: [
        { parameter: "ALT", value: "85", unit: "U/L", normalRange: "7-45", status: "high" },
        { parameter: "AST", value: "78", unit: "U/L", normalRange: "8-40", status: "high" },
        { parameter: "بیلی‌روبین کل", value: "1.8", unit: "mg/dL", normalRange: "0.3-1.2", status: "high" },
        { parameter: "آلکالین فسفاتاز", value: "120", unit: "U/L", normalRange: "44-147", status: "normal" }
      ],
      doctorNotes: "علائم التهاب کبد خفیف. نیاز به پیگیری و تکرار آزمایش.",
      reportUrl: "/reports/patient4_liver_20240519.pdf"
    }
  ];

  const getPatientTests = (patientId: number) => {
    return testHistories.filter(test => test.patientId === patientId);
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      completed: { label: "تکمیل شده", color: "bg-green-100 text-green-800" },
      pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-800" },
      cancelled: { label: "لغو شده", color: "bg-red-100 text-red-800" }
    } as const;
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return <Badge className={`${config.color} hover:${config.color}`}>{config.label}</Badge>;
  };

  const getResultStatusBadge = (status: string) => {
    const configs = {
      normal: { label: "طبیعی", color: "bg-green-100 text-green-800" },
      high: { label: "بالا", color: "bg-red-100 text-red-800" },
      low: { label: "پایین", color: "bg-blue-100 text-blue-800" },
      critical: { label: "بحرانی", color: "bg-red-100 text-red-800" }
    } as const;
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return <Badge className={`${config.color} hover:${config.color} text-xs`}>{config.label}</Badge>;
  };

  const filteredPatients = patientRecords.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.nationalId.includes(searchTerm) ||
                         patient.phone.includes(searchTerm);
    const matchesGender = filterGender === "all" || patient.gender === filterGender;
    const matchesBloodType = filterBloodType === "all" || patient.bloodType === filterBloodType;
    return matchesSearch && matchesGender && matchesBloodType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تاریخچه بیماران</h1>
          <p className="text-gray-600 mt-1">مشاهده سوابق آزمایشگاهی بیماران</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline">
            <Download className="w-4 h-4 ml-2" />
            دانلود گزارش
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="w-4 h-4 ml-2" />
            گزارش جامع
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="card-professional">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="جستجو بر اساس نام، کد ملی یا تلفن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div>
              <Select value={filterGender} onValueChange={setFilterGender}>
                <SelectTrigger>
                  <SelectValue placeholder="جنسیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="مرد">مرد</SelectItem>
                  <SelectItem value="زن">زن</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={filterBloodType} onValueChange={setFilterBloodType}>
                <SelectTrigger>
                  <SelectValue placeholder="گروه خونی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه گروه‌ها</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" className="w-full">
                <Search className="w-4 h-4 ml-2" />
                جستجوی پیشرفته
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="card-professional hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`/avatars/patient-${patient.id}.jpg`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {patient.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">کد ملی: {patient.nationalId}</p>
                    <div className="flex items-center space-x-4 space-x-reverse mt-2">
                      <Badge variant="outline" className="text-xs">
                        {patient.age} ساله
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {patient.gender}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                        {patient.bloodType}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedPatient(patient);
                    setShowHistory(true);
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Eye className="w-4 h-4 ml-1" />
                  مشاهده سوابق
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>آخرین مراجعه: {patient.lastVisit}</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{patient.totalTests} آزمایش</span>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>عضویت: {patient.registrationDate}</span>
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">حساسیت‌ها:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map((allergy, index) => (
                        <Badge key={index} className="text-xs bg-red-50 text-red-700">
                          <AlertCircle className="w-3 h-3 ml-1" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {patient.chronicDiseases.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">بیماری‌های مزمن:</p>
                    <div className="flex flex-wrap gap-1">
                      {patient.chronicDiseases.map((disease, index) => (
                        <Badge key={index} className="text-xs bg-orange-50 text-orange-700">
                          <Activity className="w-3 h-3 ml-1" />
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Patient History Modal */}
      {showHistory && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`/avatars/patient-${selectedPatient.id}.jpg`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {selectedPatient.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h2>
                    <p className="text-gray-600">سوابق آزمایشگاهی</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowHistory(false)}
                >
                  بستن
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="space-y-6">
                {getPatientTests(selectedPatient.id).map((test) => (
                  <Card key={test.id} className="border border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                          <p className="text-sm text-gray-600">{test.testType}</p>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          {getStatusBadge(test.status)}
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 ml-1" />
                            دانلود گزارش
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">تاریخ سفارش:</span>
                          <p className="font-medium">{test.orderDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">تاریخ نمونه‌گیری:</span>
                          <p className="font-medium">{test.sampleDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">تاریخ نتیجه:</span>
                          <p className="font-medium">{test.resultDate}</p>
                        </div>
                      </div>

                      {/* Test Results */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">نتایج آزمایش:</h4>
                        <div className="grid gap-3">
                          {test.results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <span className="font-medium text-gray-900">{result.parameter}</span>
                                <p className="text-sm text-gray-600">محدوده طبیعی: {result.normalRange}</p>
                              </div>
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <div className="text-right">
                                  <p className="font-bold text-lg">{result.value}</p>
                                  <p className="text-xs text-gray-500">{result.unit}</p>
                                </div>
                                {getResultStatusBadge(result.status)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Doctor Notes */}
                      {test.doctorNotes && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2">توضیحات پزشک:</h4>
                          <p className="text-blue-800">{test.doctorNotes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}