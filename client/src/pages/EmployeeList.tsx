import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Building2
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
  department: string;
  position: string;
  status: "فعال" | "در مرخصی" | "تعلیق";
  hireDate: string;
}

export default function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("همه");
  const [statusFilter, setStatusFilter] = useState("همه");

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
      color: "bg-orange-500",
      bgColor: "bg-orange-50"
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
      department: "بخش آزمایشگاه",
      position: "مدیر آزمایشگاه",
      status: "فعال",
      hireDate: "۱۴۰۰/۰۳/۱۵"
    },
    {
      id: 2,
      fullName: "فاطمه محمدی",
      employeeId: "EMP002",
      department: "نمونه‌گیری",
      position: "تکنسین آزمایشگاه",
      status: "فعال",
      hireDate: "۱۴۰۱/۰۷/۱۰"
    },
    {
      id: 3,
      fullName: "حسین رضایی",
      employeeId: "EMP003",
      department: "اداری",
      position: "کارشناس منابع انسانی",
      status: "در مرخصی",
      hireDate: "۱۳۹۹/۱۱/۲۲"
    },
    {
      id: 4,
      fullName: "مریم کریمی",
      employeeId: "EMP004",
      department: "امور مالی",
      position: "حسابدار",
      status: "فعال",
      hireDate: "۱۴۰۲/۰۲/۰۸"
    },
    {
      id: 5,
      fullName: "محمد حسینی",
      employeeId: "EMP005",
      department: "پذیرش",
      position: "کارشناس پذیرش",
      status: "فعال",
      hireDate: "۱۴۰۱/۰۹/۱۲"
    },
    {
      id: 6,
      fullName: "زهرا نوری",
      employeeId: "EMP006",
      department: "بخش آزمایشگاه",
      position: "تکنسین ارشد",
      status: "تعلیق",
      hireDate: "۱۳۹۸/۰۵/۲۰"
    },
    {
      id: 7,
      fullName: "رضا موسوی",
      employeeId: "EMP007",
      department: "فناوری اطلاعات",
      position: "برنامه‌نویس",
      status: "فعال",
      hireDate: "۱۴۰۲/۰۱/۱۵"
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
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 font-medium">در مرخصی</Badge>;
      case "تعلیق":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 font-medium">تعلیق</Badge>;
      default:
        return <Badge variant="secondary" className="font-medium text-gray-800">{status}</Badge>;
    }
  };

  const handleAction = (action: string, employee: Employee) => {
    const actionName = action === 'view' ? 'مشاهده پروفایل' : 
                      action === 'edit' ? 'ویرایش اطلاعات' : 'مدیریت مدارک';
    console.log(`اقدام: ${actionName}، کد پرسنلی: ${employee.employeeId}، نام: ${employee.fullName}`);
  };

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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
    </div>
  );
}