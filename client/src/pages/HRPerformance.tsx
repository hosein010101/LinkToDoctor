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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Star, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Calendar,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  MoreHorizontal,
  Settings,
  Download,
  Upload,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Heart,
  UserCheck,
  MessageSquare,
  Zap,
  Briefcase,
  Shield,
  BookOpen,
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Save,
  RefreshCw
} from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  department: string;
  overallScore: number;
  patientSatisfaction: number;
  attendance: number;
  teamParticipation: number;
  evaluationStatus: "excellent" | "good" | "average" | "poor";
  avatar?: string;
  employeeId: string;
  joinDate: string;
  lastEvaluation: string;
  scores: {
    technical: number;
    communication: number;
    teamwork: number;
    punctuality: number;
    initiative: number;
    patientCare: number;
  };
  performanceHistory: Array<{
    month: string;
    score: number;
  }>;
  managerFeedback?: string;
  goals: string[];
  achievements: string[];
}

interface EvaluationCriteria {
  id: number;
  name: string;
  description: string;
  weight: number;
  isActive: boolean;
  category: "technical" | "behavioral" | "performance";
}

export default function HRPerformance() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  // Sample data with Persian names
  const sampleStaff: StaffMember[] = [
    {
      id: 1,
      name: "دکتر علی رضایی",
      role: "پزشک متخصص",
      department: "قلب و عروق",
      overallScore: 92,
      patientSatisfaction: 95,
      attendance: 88,
      teamParticipation: 90,
      evaluationStatus: "excellent",
      employeeId: "DOC001",
      joinDate: "1401/03/15",
      lastEvaluation: "1403/06/10",
      scores: {
        technical: 95,
        communication: 90,
        teamwork: 88,
        punctuality: 85,
        initiative: 92,
        patientCare: 96
      },
      performanceHistory: [
        { month: "فروردین", score: 88 },
        { month: "اردیبهشت", score: 90 },
        { month: "خرداد", score: 92 },
        { month: "تیر", score: 89 },
        { month: "مرداد", score: 94 },
        { month: "شهریور", score: 92 }
      ],
      managerFeedback: "عملکرد فوق‌العاده در بخش قلب. نیاز به بهبود در حضور و غیاب.",
      goals: ["بهبود حضور به موقع", "شرکت در دوره‌های آموزشی", "همکاری بیشتر با تیم"],
      achievements: ["دریافت جایزه بهترین پزشک ماه", "موفقیت در 15 عمل پیچیده"]
    },
    {
      id: 2,
      name: "نرگس محمدی",
      role: "پرستار ارشد",
      department: "مراقبت‌های ویژه",
      overallScore: 87,
      patientSatisfaction: 93,
      attendance: 95,
      teamParticipation: 85,
      evaluationStatus: "excellent",
      employeeId: "NUR002",
      joinDate: "1400/08/20",
      lastEvaluation: "1403/06/08",
      scores: {
        technical: 88,
        communication: 95,
        teamwork: 90,
        punctuality: 95,
        initiative: 80,
        patientCare: 92
      },
      performanceHistory: [
        { month: "فروردین", score: 85 },
        { month: "اردیبهشت", score: 87 },
        { month: "خرداد", score: 89 },
        { month: "تیر", score: 86 },
        { month: "مرداد", score: 88 },
        { month: "شهریور", score: 87 }
      ],
      managerFeedback: "پرستار نمونه با مهارت‌های فوق‌العاده در ارتباط با بیماران.",
      goals: ["ارتقاء مهارت‌های تکنیکال", "رهبری تیم در شیفت شب"],
      achievements: ["دریافت تشکر از خانواده‌های بیماران", "آموزش پرستاران جدید"]
    },
    {
      id: 3,
      name: "محمد صادقی",
      role: "تکنسین آزمایشگاه",
      department: "آزمایشگاه مرکزی",
      overallScore: 78,
      patientSatisfaction: 82,
      attendance: 90,
      teamParticipation: 75,
      evaluationStatus: "good",
      employeeId: "LAB003",
      joinDate: "1402/01/10",
      lastEvaluation: "1403/06/05",
      scores: {
        technical: 85,
        communication: 72,
        teamwork: 75,
        punctuality: 90,
        initiative: 70,
        patientCare: 80
      },
      performanceHistory: [
        { month: "فروردین", score: 75 },
        { month: "اردیبهشت", score: 77 },
        { month: "خرداد", score: 78 },
        { month: "تیر", score: 76 },
        { month: "مرداد", score: 80 },
        { month: "شهریور", score: 78 }
      ],
      managerFeedback: "مهارت‌های فنی خوب، نیاز به تقویت مهارت‌های ارتباطی.",
      goals: ["شرکت در دوره ارتباط مؤثر", "بهبود کیفیت گزارش‌نویسی"],
      achievements: ["کسب گواهینامه تخصصی آزمایشگاه", "کاهش خطاهای آزمایشگاهی"]
    },
    {
      id: 4,
      name: "مریم حسینی",
      role: "کارشناس CRM",
      department: "ارتباط با مشتریان",
      overallScore: 85,
      patientSatisfaction: 88,
      attendance: 92,
      teamParticipation: 82,
      evaluationStatus: "good",
      employeeId: "CRM004",
      joinDate: "1401/11/05",
      lastEvaluation: "1403/06/12",
      scores: {
        technical: 82,
        communication: 90,
        teamwork: 85,
        punctuality: 92,
        initiative: 88,
        patientCare: 85
      },
      performanceHistory: [
        { month: "فروردین", score: 82 },
        { month: "اردیبهشت", score: 84 },
        { month: "خرداد", score: 85 },
        { month: "تیر", score: 83 },
        { month: "مرداد", score: 87 },
        { month: "شهریور", score: 85 }
      ],
      managerFeedback: "عملکرد قابل تحسین در مدیریت ارتباط با بیماران و خانواده‌ها.",
      goals: ["تسلط بر سیستم جدید CRM", "افزایش نرخ رضایت مشتریان"],
      achievements: ["افزایش 15% رضایت مشتریان", "پیاده‌سازی سیستم پیگیری جدید"]
    },
    {
      id: 5,
      name: "احمد کریمی",
      role: "نمونه‌گیر",
      department: "نمونه‌گیری منزل",
      overallScore: 70,
      patientSatisfaction: 75,
      attendance: 85,
      teamParticipation: 68,
      evaluationStatus: "average",
      employeeId: "COL005",
      joinDate: "1402/09/12",
      lastEvaluation: "1403/06/07",
      scores: {
        technical: 78,
        communication: 70,
        teamwork: 65,
        punctuality: 85,
        initiative: 68,
        patientCare: 72
      },
      performanceHistory: [
        { month: "فروردین", score: 68 },
        { month: "اردیبهشت", score: 70 },
        { month: "خرداد", score: 72 },
        { month: "تیر", score: 69 },
        { month: "مرداد", score: 71 },
        { month: "شهریور", score: 70 }
      ],
      managerFeedback: "نیاز به بهبود در مهارت‌های ارتباطی و همکاری تیمی.",
      goals: ["بهبود تعامل با بیماران", "کاهش زمان نمونه‌گیری", "افزایش دقت"],
      achievements: ["تکمیل دوره آموزش نمونه‌گیری", "کاهش شکایات بیماران"]
    }
  ];

  const sampleCriteria: EvaluationCriteria[] = [
    {
      id: 1,
      name: "مهارت‌های فنی",
      description: "تسلط بر وظایف شغلی و مهارت‌های تخصصی",
      weight: 25,
      isActive: true,
      category: "technical"
    },
    {
      id: 2,
      name: "ارتباطات",
      description: "مهارت در برقراری ارتباط مؤثر با همکاران و بیماران",
      weight: 20,
      isActive: true,
      category: "behavioral"
    },
    {
      id: 3,
      name: "کار تیمی",
      description: "همکاری و مشارکت در فعالیت‌های گروهی",
      weight: 15,
      isActive: true,
      category: "behavioral"
    },
    {
      id: 4,
      name: "وقت‌شناسی",
      description: "حضور به موقع و رعایت مواعید کاری",
      weight: 15,
      isActive: true,
      category: "performance"
    },
    {
      id: 5,
      name: "ابتکار عمل",
      description: "خلاقیت و پیشنهاد راه‌حل‌های نوآورانه",
      weight: 15,
      isActive: true,
      category: "behavioral"
    },
    {
      id: 6,
      name: "مراقبت از بیمار",
      description: "کیفیت خدمات ارائه شده به بیماران",
      weight: 10,
      isActive: true,
      category: "performance"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "average":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "عالی";
      case "good":
        return "خوب";
      case "average":
        return "متوسط";
      case "poor":
        return "ضعیف";
      default:
        return "نامشخص";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredStaff = sampleStaff.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleStats = sampleStaff.reduce((acc, staff) => {
    if (!acc[staff.role]) {
      acc[staff.role] = { total: 0, avgScore: 0, count: 0 };
    }
    acc[staff.role].total += staff.overallScore;
    acc[staff.role].count += 1;
    acc[staff.role].avgScore = Math.round(acc[staff.role].total / acc[staff.role].count);
    return acc;
  }, {} as Record<string, { total: number; avgScore: number; count: number }>);

  return (
    <TooltipProvider>
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ارزیابی عملکرد پرسنل</h1>
            <p className="text-gray-600 mt-1">مدیریت و ارزیابی عملکرد کارکنان بیمارستان</p>
          </div>
          <div className="flex items-center space-x-3 space-x-reverse">
            <Button variant="outline">
              <Download className="w-4 h-4 ml-2" />
              گزارش عملکرد
            </Button>
            <Button 
              variant="outline"
              onClick={() => setShowSettingsPanel(true)}
            >
              <Settings className="w-4 h-4 ml-2" />
              تنظیمات ارزیابی
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 ml-2" />
              ارزیابی جدید
            </Button>
          </div>
        </div>

        {/* Summary Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">کل پرسنل</p>
                  <p className="text-2xl font-bold text-gray-900">{sampleStaff.length}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 ml-1" />
                    +5% نسبت به ماه قبل
                  </p>
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
                  <p className="text-sm text-gray-600">میانگین عملکرد</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(sampleStaff.reduce((sum, s) => sum + s.overallScore, 0) / sampleStaff.length)}
                  </p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 ml-1" />
                    +3% بهبود
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">عملکرد عالی</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sampleStaff.filter(s => s.evaluationStatus === "excellent").length}
                  </p>
                  <p className="text-sm text-gray-600">از {sampleStaff.length} نفر</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">رضایت بیماران</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(sampleStaff.reduce((sum, s) => sum + s.patientSatisfaction, 0) / sampleStaff.length)}%
                  </p>
                  <p className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-3 h-3 ml-1" />
                    +2% بهبود
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance by Role Chart */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle>عملکرد بر اساس نقش شغلی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(roleStats).map(([role, stats]) => (
                <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{role}</h4>
                      <p className="text-sm text-gray-600">{stats.count} نفر</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getScoreColor(stats.avgScore)}`}>
                      {stats.avgScore}
                    </p>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${stats.avgScore >= 90 ? 'bg-green-500' : 
                          stats.avgScore >= 80 ? 'bg-blue-500' : 
                          stats.avgScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${stats.avgScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="card-professional">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="جستجو نام یا کد پرسنلی..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="نقش شغلی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه نقش‌ها</SelectItem>
                    <SelectItem value="پزشک متخصص">پزشک متخصص</SelectItem>
                    <SelectItem value="پرستار ارشد">پرستار ارشد</SelectItem>
                    <SelectItem value="تکنسین آزمایشگاه">تکنسین آزمایشگاه</SelectItem>
                    <SelectItem value="کارشناس CRM">کارشناس CRM</SelectItem>
                    <SelectItem value="نمونه‌گیر">نمونه‌گیر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="بازه زمانی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">هفته گذشته</SelectItem>
                    <SelectItem value="month">ماه گذشته</SelectItem>
                    <SelectItem value="quarter">سه ماه گذشته</SelectItem>
                    <SelectItem value="year">سال گذشته</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 ml-2" />
                  فیلترهای پیشرفته
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance Table */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle>جدول عملکرد پرسنل</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-right p-4 font-medium text-gray-700">پرسنل</th>
                    <th className="text-right p-4 font-medium text-gray-700">نقش</th>
                    <th className="text-center p-4 font-medium text-gray-700">امتیاز کلی</th>
                    <th className="text-center p-4 font-medium text-gray-700">رضایت بیمار</th>
                    <th className="text-center p-4 font-medium text-gray-700">حضور و غیاب</th>
                    <th className="text-center p-4 font-medium text-gray-700">مشارکت تیمی</th>
                    <th className="text-center p-4 font-medium text-gray-700">وضعیت ارزیابی</th>
                    <th className="text-center p-4 font-medium text-gray-700">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{staff.name}</p>
                            <p className="text-sm text-gray-600">{staff.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{staff.role}</p>
                          <p className="text-sm text-gray-600">{staff.department}</p>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`text-lg font-bold ${getScoreColor(staff.overallScore)}`}>
                            {staff.overallScore}
                          </span>
                          <Progress value={staff.overallScore} className="w-16 h-2 mt-1" />
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1 space-x-reverse">
                          <span className={`font-medium ${getScoreColor(staff.patientSatisfaction)}`}>
                            {staff.patientSatisfaction}%
                          </span>
                          {staff.patientSatisfaction >= 90 ? (
                            <Smile className="w-4 h-4 text-green-600" />
                          ) : staff.patientSatisfaction >= 70 ? (
                            <User className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <Frown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-medium ${getScoreColor(staff.attendance)}`}>
                            {staff.attendance}%
                          </span>
                          <div className="flex items-center mt-1">
                            {staff.attendance >= 90 ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : staff.attendance >= 80 ? (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-medium ${getScoreColor(staff.teamParticipation)}`}>
                          {staff.teamParticipation}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Badge className={getStatusColor(staff.evaluationStatus)}>
                          {getStatusLabel(staff.evaluationStatus)}
                        </Badge>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-1 space-x-reverse">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setShowEvaluationModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>مشاهده جزئیات</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ویرایش ارزیابی</p>
                            </TooltipContent>
                          </Tooltip>
                          {staff.evaluationStatus === "poor" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <AlertTriangle className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>هشدار عملکرد</p>
                              </TooltipContent>
                            </Tooltip>
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

        {/* Detailed Evaluation Modal */}
        {selectedStaff && (
          <Dialog open={showEvaluationModal} onOpenChange={setShowEvaluationModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-right text-xl font-bold">
                  جزئیات ارزیابی: {selectedStaff.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Staff Info */}
                <div className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {selectedStaff.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedStaff.name}</h3>
                    <p className="text-gray-600">{selectedStaff.role} - {selectedStaff.department}</p>
                    <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500 mt-1">
                      <span>کد پرسنلی: {selectedStaff.employeeId}</span>
                      <span>تاریخ شروع: {selectedStaff.joinDate}</span>
                      <span>آخرین ارزیابی: {selectedStaff.lastEvaluation}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{selectedStaff.overallScore}</p>
                    <p className="text-sm text-gray-600">امتیاز کلی</p>
                  </div>
                </div>

                {/* Individual Scores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">امتیازات فردی</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(selectedStaff.scores).map(([key, value]) => {
                          const labels = {
                            technical: "مهارت‌های فنی",
                            communication: "ارتباطات",
                            teamwork: "کار تیمی",
                            punctuality: "وقت‌شناسی",
                            initiative: "ابتکار عمل",
                            patientCare: "مراقبت از بیمار"
                          };
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{labels[key as keyof typeof labels]}</span>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <span className={`font-medium ${getScoreColor(value)}`}>{value}</span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${value >= 90 ? 'bg-green-500' : 
                                      value >= 80 ? 'bg-blue-500' : 
                                      value >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${value}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance History Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">روند عملکرد</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedStaff.performanceHistory.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">{item.month}</span>
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <span className={`font-medium ${getScoreColor(item.score)}`}>
                                {item.score}
                              </span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${item.score >= 90 ? 'bg-green-500' : 
                                    item.score >= 80 ? 'bg-blue-500' : 
                                    item.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${item.score}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Goals and Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Target className="w-4 h-4 ml-2" />
                        اهداف
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedStaff.goals.map((goal, index) => (
                          <li key={index} className="flex items-center space-x-2 space-x-reverse text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <Award className="w-4 h-4 ml-2" />
                        دستاوردها
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedStaff.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center space-x-2 space-x-reverse text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Manager Feedback */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <MessageSquare className="w-4 h-4 ml-2" />
                      بازخورد مدیر
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      defaultValue={selectedStaff.managerFeedback}
                      placeholder="بازخورد و پیشنهادات مدیر..."
                      className="border-gray-300 min-h-[100px]"
                    />
                    <div className="flex justify-end mt-4">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Save className="w-4 h-4 ml-2" />
                        ذخیره بازخورد
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Evaluation Settings Panel */}
        <Dialog open={showSettingsPanel} onOpenChange={setShowSettingsPanel}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-right text-xl font-bold">
                تنظیمات ارزیابی عملکرد
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">معیارهای ارزیابی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sampleCriteria.map((criteria) => (
                      <div key={criteria.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <Switch checked={criteria.isActive} />
                            <div>
                              <h4 className="font-medium text-gray-900">{criteria.name}</h4>
                              <p className="text-sm text-gray-600">{criteria.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{criteria.category}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">وزن در ارزیابی</span>
                            <span className="text-sm font-medium">{criteria.weight}%</span>
                          </div>
                          <Slider
                            value={[criteria.weight]}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 ml-2" />
                      معیار جدید
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره تنظیمات
                    </Button>
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