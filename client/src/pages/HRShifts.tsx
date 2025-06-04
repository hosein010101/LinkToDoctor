import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Calendar, 
  Users, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Coffee,
  Plus,
  Edit,
  MessageSquare,
  Eye,
  MoreHorizontal,
  Settings,
  Download,
  Upload,
  Filter,
  Search,
  LogIn,
  LogOut,
  Timer,
  BarChart3,
  PieChart,
  Target,
  Award,
  AlertCircle,
  User,
  Home,
  Briefcase,
  Heart,
  Zap,
  Activity,
  MapPin,
  Smartphone,
  Computer,
  Wifi,
  Save,
  RefreshCw,
  Bell
} from "lucide-react";

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  employeeId: string;
  isRemote: boolean;
  currentStatus: "checked-in" | "checked-out" | "on-break" | "offline";
  todayHours: number;
  monthlyHours: number;
  targetHours: number;
  onTimePercentage: number;
  averageStartTime: string;
  totalAbsences: number;
  leaveUsed: number;
  leaveBalance: number;
}

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakStart?: string;
  breakEnd?: string;
  totalHours: number;
  status: "present" | "late" | "absent" | "leave" | "sick" | "holiday";
  isApproved: boolean;
  comment?: string;
  managerComment?: string;
  location?: string;
  device?: string;
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  employeeName: string;
  type: "annual" | "sick" | "emergency" | "maternity" | "study";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
  approverComment?: string;
}

export default function HRShifts() {
  const [selectedMonth, setSelectedMonth] = useState("1403/06");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showManagerPanel, setShowManagerPanel] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sample employees with Persian names
  const sampleEmployees: Employee[] = [
    {
      id: 1,
      name: "علی رضایی",
      role: "توسعه‌دهنده فرانت‌اند",
      department: "فناوری اطلاعات",
      employeeId: "IT001",
      isRemote: true,
      currentStatus: "checked-in",
      todayHours: 7.5,
      monthlyHours: 165,
      targetHours: 176,
      onTimePercentage: 92,
      averageStartTime: "08:15",
      totalAbsences: 2,
      leaveUsed: 8,
      leaveBalance: 12
    },
    {
      id: 2,
      name: "ناهید صادقی",
      role: "طراح UI/UX",
      department: "طراحی",
      employeeId: "DES002",
      isRemote: true,
      currentStatus: "on-break",
      todayHours: 4.2,
      monthlyHours: 158,
      targetHours: 176,
      onTimePercentage: 88,
      averageStartTime: "08:45",
      totalAbsences: 3,
      leaveUsed: 6,
      leaveBalance: 14
    },
    {
      id: 3,
      name: "محمد کریمی",
      role: "مدیر پروژه",
      department: "مدیریت",
      employeeId: "MGT003",
      isRemote: false,
      currentStatus: "checked-out",
      todayHours: 8.5,
      monthlyHours: 172,
      targetHours: 176,
      onTimePercentage: 95,
      averageStartTime: "07:50",
      totalAbsences: 1,
      leaveUsed: 4,
      leaveBalance: 16
    },
    {
      id: 4,
      name: "مریم احمدی",
      role: "کارشناس CRM",
      department: "فروش و بازاریابی",
      employeeId: "CRM004",
      isRemote: true,
      currentStatus: "checked-in",
      todayHours: 6.8,
      monthlyHours: 162,
      targetHours: 176,
      onTimePercentage: 85,
      averageStartTime: "09:20",
      totalAbsences: 4,
      leaveUsed: 10,
      leaveBalance: 10
    },
    {
      id: 5,
      name: "حسین موسوی",
      role: "تحلیل‌گر داده",
      department: "فناوری اطلاعات",
      employeeId: "IT005",
      isRemote: true,
      currentStatus: "offline",
      todayHours: 0,
      monthlyHours: 145,
      targetHours: 176,
      onTimePercentage: 78,
      averageStartTime: "09:45",
      totalAbsences: 6,
      leaveUsed: 12,
      leaveBalance: 8
    }
  ];

  // Generate sample attendance data for the month
  const generateMonthlyAttendance = () => {
    const daysInMonth = 30;
    const records: AttendanceRecord[] = [];
    
    sampleEmployees.forEach(employee => {
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `1403/06/${day.toString().padStart(2, '0')}`;
        const isWeekend = day % 7 === 5 || day % 7 === 6; // Friday and Saturday
        
        let status: AttendanceRecord['status'];
        let checkIn: string | undefined;
        let checkOut: string | undefined;
        let totalHours = 0;
        
        if (isWeekend) {
          status = "holiday";
        } else {
          const randomFactor = Math.random();
          if (randomFactor < 0.05) {
            status = "absent";
          } else if (randomFactor < 0.1) {
            status = "leave";
          } else if (randomFactor < 0.15) {
            status = "sick";
          } else if (randomFactor < 0.25) {
            status = "late";
            checkIn = `${8 + Math.floor(Math.random() * 2)}:${30 + Math.floor(Math.random() * 30)}`;
            checkOut = `${17 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60)}`;
            totalHours = 7 + Math.random() * 2;
          } else {
            status = "present";
            checkIn = `${8}:${Math.floor(Math.random() * 30)}`;
            checkOut = `${17}:${Math.floor(Math.random() * 60)}`;
            totalHours = 8 + Math.random();
          }
        }
        
        records.push({
          id: employee.id * 100 + day,
          employeeId: employee.id,
          date,
          checkIn,
          checkOut,
          totalHours,
          status,
          isApproved: Math.random() > 0.1,
          comment: Math.random() > 0.8 ? "کار از منزل" : undefined,
          location: employee.isRemote ? "منزل" : "دفتر مرکزی",
          device: employee.isRemote ? "لپ‌تاپ شخصی" : "کامپیوتر دفتر"
        });
      }
    });
    
    return records;
  };

  const attendanceData = generateMonthlyAttendance();

  const sampleLeaveRequests: LeaveRequest[] = [
    {
      id: 1,
      employeeId: 2,
      employeeName: "ناهید صادقی",
      type: "annual",
      startDate: "1403/06/15",
      endDate: "1403/06/17",
      days: 3,
      reason: "سفر خانوادگی",
      status: "pending",
      requestDate: "1403/06/01"
    },
    {
      id: 2,
      employeeId: 4,
      employeeName: "مریم احمدی",
      type: "sick",
      startDate: "1403/06/08",
      endDate: "1403/06/09",
      days: 2,
      reason: "بیماری",
      status: "approved",
      requestDate: "1403/06/07",
      approverComment: "تایید شد. سلامتی مهم است."
    }
  ];

  const getStatusColor = (status: AttendanceRecord['status']) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "late":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      case "leave":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sick":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "holiday":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: AttendanceRecord['status']) => {
    switch (status) {
      case "present":
        return "حاضر";
      case "late":
        return "تاخیر";
      case "absent":
        return "غایب";
      case "leave":
        return "مرخصی";
      case "sick":
        return "بیماری";
      case "holiday":
        return "تعطیل";
      default:
        return "نامشخص";
    }
  };

  const getStatusIcon = (status: Employee['currentStatus']) => {
    switch (status) {
      case "checked-in":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "checked-out":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      case "on-break":
        return <Coffee className="w-4 h-4 text-orange-600" />;
      case "offline":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCurrentStatusLabel = (status: Employee['currentStatus']) => {
    switch (status) {
      case "checked-in":
        return "در حال کار";
      case "checked-out":
        return "پایان کار";
      case "on-break":
        return "استراحت";
      case "offline":
        return "آفلاین";
      default:
        return "نامشخص";
    }
  };

  const filteredEmployees = sampleEmployees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getDaysInMonth = () => {
    return Array.from({ length: 30 }, (_, i) => i + 1);
  };

  const getEmployeeAttendanceForDay = (employeeId: number, day: number) => {
    const date = `1403/06/${day.toString().padStart(2, '0')}`;
    return attendanceData.find(record => record.employeeId === employeeId && record.date === date);
  };

  // Calculate summary statistics
  const totalEmployees = sampleEmployees.length;
  const remoteEmployees = sampleEmployees.filter(e => e.isRemote).length;
  const checkedInEmployees = sampleEmployees.filter(e => e.currentStatus === "checked-in").length;
  const averageHours = Math.round(sampleEmployees.reduce((sum, emp) => sum + emp.monthlyHours, 0) / totalEmployees);

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">حضور و غیاب پرسنل دورکار</h1>
            <p className="text-gray-600 mt-1">
              مدیریت حضور و غیاب، ساعات کاری و درخواست مرخصی
            </p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="text-right">
              <p className="text-sm text-gray-600">زمان فعلی</p>
              <p className="font-medium text-gray-900">
                {currentTime.toLocaleTimeString('fa-IR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              گزارش حضور
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowManagerPanel(true)}
            >
              <Settings className="w-4 h-4 ml-2" />
              پنل مدیریت
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">کل پرسنل</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                  <p className="text-sm text-blue-600">{remoteEmployees} نفر دورکار</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">در حال کار</p>
                  <p className="text-2xl font-bold text-green-600">{checkedInEmployees}</p>
                  <p className="text-sm text-green-600">
                    {Math.round((checkedInEmployees / totalEmployees) * 100)}% فعال
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">میانگین ساعت کار</p>
                  <p className="text-2xl font-bold text-purple-600">{averageHours}</p>
                  <p className="text-sm text-purple-600">ساعت در ماه</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">درخواست مرخصی</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {sampleLeaveRequests.filter(r => r.status === "pending").length}
                  </p>
                  <p className="text-sm text-yellow-600">در انتظار تایید</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Status Overview */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>وضعیت فعلی پرسنل</span>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Input
                  placeholder="جستجو نام یا کد پرسنلی..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 search-input"
                />
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="بخش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه بخش‌ها</SelectItem>
                    <SelectItem value="فناوری اطلاعات">فناوری اطلاعات</SelectItem>
                    <SelectItem value="طراحی">طراحی</SelectItem>
                    <SelectItem value="مدیریت">مدیریت</SelectItem>
                    <SelectItem value="فروش و بازاریابی">فروش و بازاریابی</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <div key={employee.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      {getStatusIcon(employee.currentStatus)}
                      {employee.isRemote && <Home className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">وضعیت:</span>
                      <span className="font-medium">{getCurrentStatusLabel(employee.currentStatus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ساعت امروز:</span>
                      <span className="font-medium">{employee.todayHours} ساعت</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">پیشرفت ماهانه:</span>
                      <span className="font-medium">
                        {Math.round((employee.monthlyHours / employee.targetHours) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(employee.monthlyHours / employee.targetHours) * 100} 
                      className="h-2 mt-2" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Attendance Table */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>جدول حضور و غیاب ماهانه - {selectedMonth}</span>
              <div className="flex items-center space-x-3 space-x-reverse">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1403/06">شهریور 1403</SelectItem>
                    <SelectItem value="1403/05">مرداد 1403</SelectItem>
                    <SelectItem value="1403/04">تیر 1403</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 ml-1" />
                  بروزرسانی
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right p-3 font-medium text-gray-700 sticky right-0 bg-white min-w-40">
                      پرسنل
                    </th>
                    {getDaysInMonth().map(day => (
                      <th key={day} className="text-center p-2 font-medium text-gray-700 min-w-12">
                        {day}
                      </th>
                    ))}
                    <th className="text-center p-3 font-medium text-gray-700">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 sticky right-0 bg-white border-l border-gray-200">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900 text-xs">{employee.name}</p>
                            <p className="text-xs text-gray-600">{employee.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      {getDaysInMonth().map(day => {
                        const attendance = getEmployeeAttendanceForDay(employee.id, day);
                        return (
                          <td key={day} className="p-1 text-center">
                            {attendance && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div 
                                    className={`w-8 h-8 rounded border cursor-pointer flex items-center justify-center ${getStatusColor(attendance.status)}`}
                                    onClick={() => {
                                      setSelectedEmployee(employee);
                                      setShowAttendanceModal(true);
                                    }}
                                  >
                                    {attendance.status === "present" && <CheckCircle className="w-3 h-3" />}
                                    {attendance.status === "late" && <Clock className="w-3 h-3" />}
                                    {attendance.status === "absent" && <XCircle className="w-3 h-3" />}
                                    {attendance.status === "leave" && <Calendar className="w-3 h-3" />}
                                    {attendance.status === "sick" && <Heart className="w-3 h-3" />}
                                    {attendance.status === "holiday" && <Home className="w-3 h-3" />}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs">
                                    <p>{getStatusLabel(attendance.status)}</p>
                                    {attendance.checkIn && <p>ورود: {attendance.checkIn}</p>}
                                    {attendance.checkOut && <p>خروج: {attendance.checkOut}</p>}
                                    {attendance.totalHours > 0 && <p>ساعات: {attendance.totalHours.toFixed(1)}</p>}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3 text-center">
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
                              <MessageSquare className="w-4 h-4 ml-2" />
                              افزودن نظر
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="w-4 h-4 ml-2" />
                              درخواست مرخصی
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 ml-2" />
                              ویرایش زمان
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

        {/* Employee Summary Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Attendance Trends Chart */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>روند حضور و غیاب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEmployees.map((employee) => (
                    <div key={employee.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{employee.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {employee.onTimePercentage}% به موقع
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">ساعت کار</p>
                          <p className="font-bold text-blue-600">{employee.monthlyHours}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">غیبت</p>
                          <p className="font-bold text-red-600">{employee.totalAbsences}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">مرخصی مصرفی</p>
                          <p className="font-bold text-yellow-600">{employee.leaveUsed}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">مرخصی باقی</p>
                          <p className="font-bold text-green-600">{employee.leaveBalance}</p>
                        </div>
                      </div>
                      <Progress 
                        value={(employee.monthlyHours / employee.targetHours) * 100} 
                        className="h-2 mt-3" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Alerts */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 ml-2" />
                  هشدارها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">ساعت کم</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      حسین موسوی کمتر از حد مطلوب کار کرده
                    </p>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Clock className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">تاخیر مکرر</span>
                    </div>
                    <p className="text-xs text-yellow-600 mt-1">
                      مریم احمدی اخیراً دیر شروع کرده
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">درخواست مرخصی</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      ناهید صادقی درخواست مرخصی داده
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leave Requests */}
            <Card className="card-professional">
              <CardHeader>
                <CardTitle>درخواست‌های مرخصی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleLeaveRequests.map((request) => (
                    <div key={request.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{request.employeeName}</span>
                        <Badge className={
                          request.status === "approved" ? "bg-green-100 text-green-800" :
                          request.status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {request.status === "approved" ? "تایید شده" :
                           request.status === "rejected" ? "رد شده" : "در انتظار"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {request.startDate} تا {request.endDate} ({request.days} روز)
                      </p>
                      <p className="text-xs text-gray-600">{request.reason}</p>
                      {request.status === "pending" && (
                        <div className="flex space-x-2 space-x-reverse mt-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs">
                            تایید
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs">
                            رد
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Attendance Detail Modal */}
        <Dialog open={showAttendanceModal} onOpenChange={setShowAttendanceModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-right">
                جزئیات حضور و غیاب - {selectedEmployee?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">زمان ورود</label>
                    <Input defaultValue="08:30" className="border-gray-300" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">زمان خروج</label>
                    <Input defaultValue="17:30" className="border-gray-300" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نظر کارمند</label>
                  <Textarea 
                    placeholder="توضیحات اضافی..."
                    className="border-gray-300 min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نظر مدیر</label>
                  <Textarea 
                    placeholder="نظر مدیر..."
                    className="border-gray-300 min-h-[60px]"
                  />
                </div>

                <div className="flex justify-end space-x-3 space-x-reverse">
                  <Button variant="outline" onClick={() => setShowAttendanceModal(false)}>
                    انصراف
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Save className="w-4 h-4 ml-2" />
                    ذخیره
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Manager Panel */}
        <Dialog open={showManagerPanel} onOpenChange={setShowManagerPanel}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">پنل مدیریت حضور و غیاب</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">اعمال سریع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="w-4 h-4 ml-2" />
                      تایید همه حضورها
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 ml-2" />
                      گزارش ماهانه
                    </Button>
                    <Button variant="outline">
                      <Bell className="w-4 h-4 ml-2" />
                      ارسال یادآوری
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">موارد نیازمند تایید</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendanceData
                      .filter(record => !record.isApproved)
                      .slice(0, 5)
                      .map((record) => {
                        const employee = sampleEmployees.find(e => e.id === record.employeeId);
                        return (
                          <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                  {employee?.name.split(' ').map(n => n[0]).join('') || 'N/A'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{employee?.name}</p>
                                <p className="text-xs text-gray-600">
                                  {record.date} - {getStatusLabel(record.status)}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2 space-x-reverse">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                تایید
                              </Button>
                              <Button size="sm" variant="outline">
                                ویرایش
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}