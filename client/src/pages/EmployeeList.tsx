import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { 
  Users, 
  UserPlus, 
  Calendar, 
  ClipboardList,
  Eye,
  Edit,
  FileText,
  Search,
  Plus,
  TrendingUp,
  Building2,
  Download,
  Trash2,
  Upload
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Employee {
  id: number;
  fullName: string;
  employeeId: string;
  nationalId: string;
  department: string;
  position: string;
  status: "فعال" | "در مرخصی" | "تعلیق";
  hireDate: string;
  phone: string;
  email: string;
  address: string;
  contractType: string;
  contractStartDate: string;
  contractEndDate: string;
}

interface Document {
  id: number;
  name: string;
  type: string;
  uploadDate: string;
}

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("همه");
  const [statusFilter, setStatusFilter] = useState("همه");
  
  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [editFormData, setEditFormData] = useState<Employee | null>(null);
  const [newEmployeeData, setNewEmployeeData] = useState({
    fullName: "",
    nationalId: "",
    department: "",
    position: "",
    status: "فعال" as Employee["status"],
    phone: "",
    email: "",
    address: "",
    contractType: "تمام وقت",
    contractStartDate: "",
    contractEndDate: ""
  });

  // KPI Data
  const kpis = [
    {
      title: "تعداد کل کارکنان",
      value: "۱۲۵",
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "استخدام جدید (این ماه)",
      value: "۷",
      icon: UserPlus,
      color: "bg-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "قراردادهای در شرف اتمام (۳۰ روز آتی)",
      value: "۳",
      icon: Calendar,
      color: "bg-red-500",
      bgColor: "bg-red-50"
    },
    {
      title: "درخواست‌های مرخصی معلق",
      value: "۵",
      icon: ClipboardList,
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  // Sample Employee Data
  const employees: Employee[] = [
    {
      id: 1,
      fullName: "دکتر علی احمدی",
      employeeId: "EMP001",
      nationalId: "0012345678",
      department: "بخش آزمایشگاه",
      position: "مدیر آزمایشگاه",
      status: "فعال",
      hireDate: "۱۴۰۰/۰۳/۱۵",
      phone: "۰۹۱۲۳۴۵۶۷۸۹",
      email: "ali.ahmadi@linktodoctor.ir",
      address: "تهران، خیابان ولیعصر، پلاک ۱۲۳",
      contractType: "تمام وقت",
      contractStartDate: "۱۴۰۰/۰۳/۱۵",
      contractEndDate: "۱۴۰۵/۰۳/۱۵"
    },
    {
      id: 2,
      fullName: "فاطمه محمدی",
      employeeId: "EMP002",
      nationalId: "0023456789",
      department: "نمونه‌گیری",
      position: "تکنسین آزمایشگاه",
      status: "فعال",
      hireDate: "۱۴۰۱/۰۷/۱۰",
      phone: "۰۹۳۵۱۲۳۴۵۶۷",
      email: "fatemeh.mohammadi@linktodoctor.ir",
      address: "مشهد، خیابان امام رضا، پلاک ۴۵",
      contractType: "تمام وقت",
      contractStartDate: "۱۴۰۱/۰۷/۱۰",
      contractEndDate: "۱۴۰۶/۰۷/۱۰"
    },
    {
      id: 3,
      fullName: "حسین رضایی",
      employeeId: "EMP003",
      nationalId: "0034567890",
      department: "اداری",
      position: "کارشناس منابع انسانی",
      status: "فعال",
      hireDate: "۱۳۹۹/۱۱/۲۲",
      phone: "۰۹۱۷۸۹۰۱۲۳۴",
      email: "hossein.rezaei@linktodoctor.ir",
      address: "شیراز، خیابان زند، پلاک ۶۷",
      contractType: "تمام وقت",
      contractStartDate: "۱۳۹۹/۱۱/۲۲",
      contractEndDate: "۱۴۰۴/۱۱/۲۲"
    },
    {
      id: 4,
      fullName: "مریم کریمی",
      employeeId: "EMP004",
      nationalId: "0045678901",
      department: "امور مالی",
      position: "حسابدار",
      status: "در مرخصی",
      hireDate: "۱۴۰۲/۰۲/۰۸",
      phone: "۰۹۱۲۲۳۴۵۶۷۸",
      email: "maryam.karimi@linktodoctor.ir",
      address: "اصفهان، خیابان چهارباغ، پلاک ۸۹",
      contractType: "پاره وقت",
      contractStartDate: "۱۴۰۲/۰۲/۰۸",
      contractEndDate: "۱۴۰۵/۰۲/۰۸"
    },
    {
      id: 5,
      fullName: "محمد حسینی",
      employeeId: "EMP005",
      nationalId: "0056789012",
      department: "پذیرش",
      position: "کارشناس پذیرش",
      status: "فعال",
      hireDate: "۱۴۰۱/۰۹/۱۲",
      phone: "۰۹۳۳۴۵۶۷۸۹۰",
      email: "mohammad.hosseini@linktodoctor.ir",
      address: "تبریز، خیابان شهریور، پلاک ۱۰۱",
      contractType: "تمام وقت",
      contractStartDate: "۱۴۰۱/۰۹/۱۲",
      contractEndDate: "۱۴۰۶/۰۹/۱۲"
    },
    {
      id: 6,
      fullName: "زهرا نوری",
      employeeId: "EMP006",
      nationalId: "0067890123",
      department: "بخش آزمایشگاه",
      position: "تکنسین ارشد",
      status: "تعلیق",
      hireDate: "۱۳۹۸/۰۵/۲۰",
      phone: "۰۹۱۵۶۷۸۹۰۱۲",
      email: "zahra.noori@linktodoctor.ir",
      address: "کرمان، خیابان جمهوری، پلاک ۱۲۳",
      contractType: "تمام وقت",
      contractStartDate: "۱۳۹۸/۰۵/۲۰",
      contractEndDate: "۱۴۰۳/۰۵/۲۰"
    },
    {
      id: 7,
      fullName: "رضا موسوی",
      employeeId: "EMP007",
      nationalId: "0078901234",
      department: "فناوری اطلاعات",
      position: "برنامه‌نویس",
      status: "فعال",
      hireDate: "۱۴۰۲/۰۱/۱۵",
      phone: "۰۹۱۹۰۱۲۳۴۵۶",
      email: "reza.mousavi@linktodoctor.ir",
      address: "قم، خیابان معلم، پلاک ۱۴۵",
      contractType: "تمام وقت",
      contractStartDate: "۱۴۰۲/۰۱/۱۵",
      contractEndDate: "۱۴۰۷/۰۱/۱۵"
    }
  ];

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.includes(searchTerm) || 
                         employee.employeeId.includes(searchTerm);
    const matchesDepartment = departmentFilter === "همه" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "همه" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "فعال":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-medium">فعال</Badge>;
      case "در مرخصی":
        return <Badge className="bg-red-50 text-red-700 hover:bg-red-50 font-bold border border-red-200">در مرخصی</Badge>;
      case "تعلیق":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 font-medium">تعلیق</Badge>;
      default:
        return <Badge variant="secondary" className="font-medium text-gray-800">{status}</Badge>;
    }
  };

  const handleAction = (action: string, employee: Employee) => {
    setSelectedEmployee(employee);
    
    if (action === 'view') {
      setActiveTab("profile");
      setIsViewModalOpen(true);
    } else if (action === 'edit') {
      setEditFormData({ ...employee });
      setIsEditModalOpen(true);
    } else if (action === 'document') {
      setActiveTab("documents");
      setIsViewModalOpen(true);
    }
    
    const actionName = action === 'view' ? 'مشاهده پروفایل' : 
                      action === 'edit' ? 'ویرایش اطلاعات' : 'مدیریت مدارک';
    console.log(`اقدام: ${actionName}، کد پرسنلی: ${employee.employeeId}، نام: ${employee.fullName}`);
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      console.log('ذخیره تغییرات:', editFormData);
      setIsEditModalOpen(false);
      setEditFormData(null);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditFormData(null);
  };

  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewEmployee = () => {
    if (newEmployeeData.fullName && newEmployeeData.nationalId) {
      const newEmployee: Employee = {
        ...newEmployeeData as Employee,
        id: Math.max(...employees.map(e => e.id)) + 1,
        employeeId: `EMP${String(Math.max(...employees.map(e => parseInt(e.employeeId.slice(3)))) + 1).padStart(3, '0')}`,
        hireDate: new Date().toLocaleDateString('fa-IR')
      };
      
      console.log('کارمند جدید اضافه شد:', newEmployee);
      setIsAddModalOpen(false);
      setNewEmployeeData({
        fullName: "",
        nationalId: "",
        department: "",
        position: "",
        status: "فعال",
        phone: "",
        email: "",
        address: "",
        contractType: "تمام وقت",
        contractStartDate: "",
        contractEndDate: ""
      });
    }
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    setNewEmployeeData({
      fullName: "",
      nationalId: "",
      department: "",
      position: "",
      status: "فعال",
      phone: "",
      email: "",
      address: "",
      contractType: "تمام وقت",
      contractStartDate: "",
      contractEndDate: ""
    });
  };

  const handleDocumentAction = (action: string, documentName: string) => {
    console.log(`${action}: ${documentName}`);
  };

  // Sample documents data
  const sampleDocuments: Document[] = [
    { id: 1, name: "قرارداد کاری.pdf", type: "pdf", uploadDate: "۱۴۰۲/۰۱/۱۵" },
    { id: 2, name: "اسکن شناسنامه.jpg", type: "image", uploadDate: "۱۴۰۲/۰۱/۱۶" },
    { id: 3, name: "گواهی تحصیلات.pdf", type: "pdf", uploadDate: "۱۴۰۲/۰۱/۱۷" },
    { id: 4, name: "معافیت نظام وظیفه.pdf", type: "pdf", uploadDate: "۱۴۰۲/۰۱/۱۸" }
  ];

  // Chart Data
  const departmentData = {
    labels: ['بخش آزمایشگاه', 'نمونه‌گیری', 'اداری', 'امور مالی', 'پذیرش', 'فناوری اطلاعات'],
    datasets: [
      {
        data: [3, 1, 1, 1, 1, 1],
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Orange
          '#8B5CF6', // Purple
          '#EF4444', // Red
          '#06B6D4', // Cyan
        ],
        borderWidth: 0,
      },
    ],
  };

  const hiringTrendData = {
    labels: ['دی', 'بهمن', 'اسفند', 'فروردین', 'اردیبهشت', 'خرداد'],
    datasets: [
      {
        label: 'تعداد استخدام',
        data: [2, 1, 3, 2, 4, 1],
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            family: 'IRANSans, Tahoma, Arial, sans-serif',
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        titleFont: {
          family: 'IRANSans, Tahoma, Arial, sans-serif',
        },
        bodyFont: {
          family: 'IRANSans, Tahoma, Arial, sans-serif',
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: 'IRANSans, Tahoma, Arial, sans-serif',
          },
        },
      },
      x: {
        ticks: {
          font: {
            family: 'IRANSans, Tahoma, Arial, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{kpi.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${kpi.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">فهرست کارکنان</CardTitle>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddEmployee}
            >
              <Plus className="w-4 h-4 ml-2" />
              افزودن کارمند جدید
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو بر اساس نام یا کد پرسنلی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="انتخاب واحد سازمانی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="همه">همه واحدها</SelectItem>
                <SelectItem value="بخش آزمایشگاه">بخش آزمایشگاه</SelectItem>
                <SelectItem value="نمونه‌گیری">نمونه‌گیری</SelectItem>
                <SelectItem value="اداری">اداری</SelectItem>
                <SelectItem value="امور مالی">امور مالی</SelectItem>
                <SelectItem value="پذیرش">پذیرش</SelectItem>
                <SelectItem value="فناوری اطلاعات">فناوری اطلاعات</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="همه">همه وضعیت‌ها</SelectItem>
                <SelectItem value="فعال">فعال</SelectItem>
                <SelectItem value="در مرخصی">در مرخصی</SelectItem>
                <SelectItem value="تعلیق">تعلیق</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-right p-4 font-semibold text-gray-900">نام کامل</th>
                  <th className="text-right p-4 font-semibold text-gray-900">کد پرسنلی</th>
                  <th className="text-right p-4 font-semibold text-gray-900">واحد سازمانی</th>
                  <th className="text-right p-4 font-semibold text-gray-900">سمت</th>
                  <th className="text-right p-4 font-semibold text-gray-900">وضعیت</th>
                  <th className="text-right p-4 font-semibold text-gray-900">تاریخ استخدام</th>
                  <th className="text-right p-4 font-semibold text-gray-900">اقدامات</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="p-4 font-medium text-gray-900">{employee.fullName}</td>
                    <td className="p-4 text-gray-600">{employee.employeeId}</td>
                    <td className="p-4 text-gray-600">{employee.department}</td>
                    <td className="p-4 text-gray-600">{employee.position}</td>
                    <td className="p-4">{getStatusBadge(employee.status)}</td>
                    <td className="p-4 text-gray-600">{employee.hireDate}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => handleAction('view', employee)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => handleAction('edit', employee)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-purple-600 hover:bg-purple-50"
                          onClick={() => handleAction('document', employee)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">هیچ کارمندی با معیارهای جستجو یافت نشد.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Visualization Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 ml-2 text-blue-600" />
              توزیع کارکنان بر اساس واحد سازمانی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Pie data={departmentData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Hiring Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 ml-2 text-green-600" />
              روند استخدام (۶ ماه گذشته)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Bar data={hiringTrendData} options={barChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View/Document Modal with Tabs */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedEmployee ? `${selectedEmployee.fullName} (${selectedEmployee.employeeId})` : ""}
        size="xl"
      >
        <div className="p-6" dir="rtl">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              پروفایل کارمند
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "documents"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("documents")}
            >
              مدیریت مدارک
            </button>
          </div>

          {/* Profile Tab Content */}
          {activeTab === "profile" && selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">اطلاعات پایه</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">نام کامل:</span>
                      <span className="font-medium">{selectedEmployee.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">کد پرسنلی:</span>
                      <span className="font-medium">{selectedEmployee.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">کد ملی:</span>
                      <span className="font-medium">{selectedEmployee.nationalId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">واحد سازمانی:</span>
                      <span className="font-medium">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">سمت:</span>
                      <span className="font-medium">{selectedEmployee.position}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">اطلاعات تماس</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">شماره تلفن:</span>
                      <span className="font-medium">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ایمیل:</span>
                      <span className="font-medium">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">آدرس:</span>
                      <span className="font-medium">{selectedEmployee.address}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contract Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">اطلاعات قرارداد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">نوع قرارداد:</span>
                      <span className="font-medium">{selectedEmployee.contractType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاریخ شروع:</span>
                      <span className="font-medium">{selectedEmployee.contractStartDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تاریخ پایان:</span>
                      <span className="font-medium">{selectedEmployee.contractEndDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Documents Tab Content */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">مدارک کارمند</h3>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleDocumentAction('آپلود', 'مدرک جدید')}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  آپلود مدرک جدید
                </Button>
              </div>

              <div className="space-y-3">
                {sampleDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">تاریخ آپلود: {doc.uploadDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50"
                        onClick={() => handleDocumentAction('دانلود', doc.name)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDocumentAction('حذف', doc.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCancelEdit}
        title="ویرایش اطلاعات کارمند"
        size="xl"
      >
        <div className="p-6" dir="rtl">
          {editFormData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام کامل</label>
                  <Input
                    value={editFormData.fullName}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
                  <Input
                    value={editFormData.nationalId}
                    onChange={(e) => setEditFormData({ ...editFormData, nationalId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">واحد سازمانی</label>
                  <Select 
                    value={editFormData.department} 
                    onValueChange={(value) => setEditFormData({ ...editFormData, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="بخش آزمایشگاه">بخش آزمایشگاه</SelectItem>
                      <SelectItem value="نمونه‌گیری">نمونه‌گیری</SelectItem>
                      <SelectItem value="اداری">اداری</SelectItem>
                      <SelectItem value="امور مالی">امور مالی</SelectItem>
                      <SelectItem value="پذیرش">پذیرش</SelectItem>
                      <SelectItem value="فناوری اطلاعات">فناوری اطلاعات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سمت</label>
                  <Input
                    value={editFormData.position}
                    onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
                  <Input
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                  <Input
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                <Input
                  value={editFormData.address}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع قرارداد</label>
                  <Select 
                    value={editFormData.contractType} 
                    onValueChange={(value) => setEditFormData({ ...editFormData, contractType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="تمام وقت">تمام وقت</SelectItem>
                      <SelectItem value="پاره وقت">پاره وقت</SelectItem>
                      <SelectItem value="پروژه‌ای">پروژه‌ای</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ شروع قرارداد</label>
                  <Input
                    value={editFormData.contractStartDate}
                    onChange={(e) => setEditFormData({ ...editFormData, contractStartDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ پایان قرارداد</label>
                  <Input
                    value={editFormData.contractEndDate}
                    onChange={(e) => setEditFormData({ ...editFormData, contractEndDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
                <Button variant="outline" onClick={handleCancelEdit}>
                  انصراف
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSaveEdit}>
                  ذخیره تغییرات
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add New Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCancelAdd}
        title="افزودن کارمند جدید"
        size="xl"
      >
        <div className="p-6" dir="rtl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام کامل *</label>
                <Input
                  value={newEmployeeData.fullName}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, fullName: e.target.value })}
                  placeholder="نام و نام خانوادگی کارمند"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی *</label>
                <Input
                  value={newEmployeeData.nationalId}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, nationalId: e.target.value })}
                  placeholder="کد ملی ۱۰ رقمی"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">واحد سازمانی *</label>
                <Select 
                  value={newEmployeeData.department} 
                  onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, department: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="انتخاب واحد سازمانی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="بخش آزمایشگاه">بخش آزمایشگاه</SelectItem>
                    <SelectItem value="نمونه‌گیری">نمونه‌گیری</SelectItem>
                    <SelectItem value="اداری">اداری</SelectItem>
                    <SelectItem value="امور مالی">امور مالی</SelectItem>
                    <SelectItem value="پذیرش">پذیرش</SelectItem>
                    <SelectItem value="فناوری اطلاعات">فناوری اطلاعات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">سمت شغلی *</label>
                <Input
                  value={newEmployeeData.position}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, position: e.target.value })}
                  placeholder="عنوان شغل"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">شماره تلفن</label>
                <Input
                  value={newEmployeeData.phone}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, phone: e.target.value })}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                <Input
                  type="email"
                  value={newEmployeeData.email}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, email: e.target.value })}
                  placeholder="example@linktodoctor.ir"
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
              <Input
                value={newEmployeeData.address}
                onChange={(e) => setNewEmployeeData({ ...newEmployeeData, address: e.target.value })}
                placeholder="آدرس کامل محل سکونت"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع قرارداد</label>
                <Select 
                  value={newEmployeeData.contractType} 
                  onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, contractType: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تمام وقت">تمام وقت</SelectItem>
                    <SelectItem value="پاره وقت">پاره وقت</SelectItem>
                    <SelectItem value="پروژه‌ای">پروژه‌ای</SelectItem>
                    <SelectItem value="آزمایشی">آزمایشی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ شروع قرارداد</label>
                <Input
                  value={newEmployeeData.contractStartDate}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, contractStartDate: e.target.value })}
                  placeholder="۱۴۰۳/۰۱/۰۱"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ پایان قرارداد</label>
                <Input
                  value={newEmployeeData.contractEndDate}
                  onChange={(e) => setNewEmployeeData({ ...newEmployeeData, contractEndDate: e.target.value })}
                  placeholder="۱۴۰۸/۰۱/۰۱"
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">وضعیت اولیه کارمند:</p>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Select 
                  value={newEmployeeData.status} 
                  onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, status: value as Employee["status"] })}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="فعال">فعال</SelectItem>
                    <SelectItem value="در مرخصی">در مرخصی</SelectItem>
                    <SelectItem value="تعلیق">تعلیق</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
              <Button variant="outline" onClick={handleCancelAdd}>
                انصراف
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={handleSaveNewEmployee}
                disabled={!newEmployeeData.fullName || !newEmployeeData.nationalId || !newEmployeeData.department || !newEmployeeData.position}
              >
                ثبت کارمند جدید
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}