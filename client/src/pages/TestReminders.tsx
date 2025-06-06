import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar, 
  Clock, 
  Bell, 
  User, 
  Phone, 
  Mail, 
  MessageSquare, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Timer,
  RefreshCw,
  Send,
  Settings,
  Target,
  Activity,
  TrendingUp,
  Users,
  Heart,
  Microscope,
  FileText,
  Download
} from "lucide-react";

interface TestReminder {
  id: number;
  patientId: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  testName: string;
  lastTestDate: Date;
  nextDueDate: Date;
  frequency: "weekly" | "monthly" | "quarterly" | "semi-annual" | "annual";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "sent" | "completed" | "overdue";
  reminderMethod: "sms" | "email" | "both" | "call";
  notes: string;
  remindersSent: number;
  lastReminderDate?: Date;
  condition: string;
}

interface ReminderTemplate {
  id: number;
  name: string;
  testType: string;
  frequency: string;
  message: string;
  isActive: boolean;
}

export default function TestReminders() {
  const [activeTab, setActiveTab] = useState("reminders");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedReminder, setSelectedReminder] = useState<TestReminder | null>(null);

  // Mock data for demonstration
  const reminders: TestReminder[] = [
    {
      id: 1,
      patientId: 1001,
      patientName: "احمد رضایی",
      patientPhone: "09123456789",
      patientEmail: "ahmad@email.com",
      testName: "HbA1c",
      lastTestDate: new Date(2024, 10, 15),
      nextDueDate: new Date(2025, 1, 15),
      frequency: "quarterly",
      priority: "high",
      status: "overdue",
      reminderMethod: "both",
      notes: "بیمار دیابتی نیاز به کنترل منظم دارد",
      remindersSent: 2,
      lastReminderDate: new Date(2025, 1, 10),
      condition: "دیابت نوع 2"
    },
    {
      id: 2,
      patientId: 1002,
      patientName: "فاطمه محمدی",
      patientPhone: "09987654321",
      patientEmail: "fateme@email.com",
      testName: "پروفایل لیپیدی",
      lastTestDate: new Date(2024, 9, 20),
      nextDueDate: new Date(2025, 3, 20),
      frequency: "semi-annual",
      priority: "medium",
      status: "pending",
      reminderMethod: "sms",
      notes: "کنترل کلسترول بعد از شروع دارو",
      remindersSent: 0,
      condition: "هیپرلیپیدمی"
    },
    {
      id: 3,
      patientId: 1003,
      patientName: "علی احمدی",
      patientPhone: "09111222333",
      patientEmail: "ali@email.com",
      testName: "TSH",
      lastTestDate: new Date(2024, 11, 1),
      nextDueDate: new Date(2025, 2, 1),
      frequency: "quarterly",
      priority: "medium",
      status: "sent",
      reminderMethod: "email",
      notes: "کنترل تیروئید بعد از تنظیم دوز دارو",
      remindersSent: 1,
      lastReminderDate: new Date(2025, 1, 25),
      condition: "هیپوتیروئیدیسم"
    },
    {
      id: 4,
      patientId: 1004,
      patientName: "زهرا حسینی",
      patientPhone: "09444555666",
      patientEmail: "zahra@email.com",
      testName: "کراتینین سرم",
      lastTestDate: new Date(2024, 8, 10),
      nextDueDate: new Date(2025, 1, 10),
      frequency: "monthly",
      priority: "urgent",
      status: "overdue",
      reminderMethod: "call",
      notes: "بیمار کلیوی نیاز به کنترل دقیق دارد",
      remindersSent: 3,
      lastReminderDate: new Date(2025, 1, 5),
      condition: "نارسایی کلیه"
    }
  ];

  const templates: ReminderTemplate[] = [
    {
      id: 1,
      name: "یادآور دیابت",
      testType: "HbA1c",
      frequency: "هر 3 ماه",
      message: "سلام {نام}، زمان کنترل HbA1c شما فرا رسیده است. لطفاً برای انجام آزمایش اقدام کنید.",
      isActive: true
    },
    {
      id: 2,
      name: "کنترل کلسترول",
      testType: "پروفایل لیپیدی",
      frequency: "هر 6 ماه",
      message: "سلام {نام}، برای کنترل کلسترول، زمان انجام پروفایل لیپیدی شما رسیده است.",
      isActive: true
    },
    {
      id: 3,
      name: "کنترل تیروئید",
      testType: "TSH",
      frequency: "هر 3 ماه",
      message: "سلام {نام}، لطفاً برای کنترل تیروئید، آزمایش TSH خود را انجام دهید.",
      isActive: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-blue-100 text-blue-800",
      sent: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    
    const labels = {
      pending: "در انتظار",
      sent: "ارسال شده",
      completed: "تکمیل شده",
      overdue: "عقب‌افتاده"
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-700",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700"
    };
    
    const labels = {
      low: "کم",
      medium: "متوسط",
      high: "بالا",
      urgent: "فوری"
    };

    return (
      <Badge className={variants[priority as keyof typeof variants]}>
        {labels[priority as keyof typeof labels]}
      </Badge>
    );
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      weekly: "هفتگی",
      monthly: "ماهانه",
      quarterly: "فصلی",
      "semi-annual": "شش‌ماهه",
      annual: "سالانه"
    };
    return labels[frequency as keyof typeof labels] || frequency;
  };

  const getReminderMethodIcon = (method: string) => {
    switch (method) {
      case "sms": return <MessageSquare className="w-4 h-4" />;
      case "email": return <Mail className="w-4 h-4" />;
      case "call": return <Phone className="w-4 h-4" />;
      case "both": return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR').format(date);
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const overdueReminders = reminders.filter(r => r.status === "overdue").length;
  const pendingReminders = reminders.filter(r => r.status === "pending").length;
  const totalReminders = reminders.length;
  const sentToday = reminders.filter(r => 
    r.lastReminderDate && 
    r.lastReminderDate.toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">یادآور آزمایشات</h1>
          <p className="text-gray-600 mt-2">مدیریت یادآوری آزمایشات برای بیماران نیازمند تکرار</p>
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            گزارش یادآورها
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 ml-2" />
            تنظیمات
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            یادآور جدید
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">عقب‌افتاده</p>
                <p className="text-2xl font-bold text-red-900">{overdueReminders}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">در انتظار</p>
                <p className="text-2xl font-bold text-blue-900">{pendingReminders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">ارسال امروز</p>
                <p className="text-2xl font-bold text-green-900">{sentToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">کل یادآورها</p>
                <p className="text-2xl font-bold text-purple-900">{totalReminders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reminders">یادآورهای فعال</TabsTrigger>
          <TabsTrigger value="templates">قالب‌های یادآور</TabsTrigger>
          <TabsTrigger value="analytics">آمار و گزارش</TabsTrigger>
        </TabsList>

        <TabsContent value="reminders" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[250px]">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="جستجو بیمار یا آزمایش..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                    <SelectItem value="pending">در انتظار</SelectItem>
                    <SelectItem value="sent">ارسال شده</SelectItem>
                    <SelectItem value="completed">تکمیل شده</SelectItem>
                    <SelectItem value="overdue">عقب‌افتاده</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="اولویت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه اولویت‌ها</SelectItem>
                    <SelectItem value="urgent">فوری</SelectItem>
                    <SelectItem value="high">بالا</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="low">کم</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 ml-2" />
                  بروزرسانی
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reminders List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reminders.map((reminder) => {
              const daysUntilDue = getDaysUntilDue(reminder.nextDueDate);
              const isOverdue = daysUntilDue < 0;
              
              return (
                <Card key={reminder.id} className={`${isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{reminder.patientName}</CardTitle>
                          <p className="text-sm text-gray-600">{reminder.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(reminder.status)}
                        {getPriorityBadge(reminder.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Microscope className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">{reminder.testName}</span>
                      </div>
                      <Badge variant="outline">{getFrequencyLabel(reminder.frequency)}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">آخرین آزمایش:</p>
                        <p className="font-medium">{formatDate(reminder.lastTestDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">موعد بعدی:</p>
                        <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                          {formatDate(reminder.nextDueDate)}
                        </p>
                      </div>
                    </div>

                    {isOverdue && (
                      <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-red-700">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {Math.abs(daysUntilDue)} روز عقب‌افتاده
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          {getReminderMethodIcon(reminder.reminderMethod)}
                          <span>
                            {reminder.reminderMethod === "both" ? "پیامک و ایمیل" :
                             reminder.reminderMethod === "sms" ? "پیامک" :
                             reminder.reminderMethod === "email" ? "ایمیل" : "تماس"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bell className="w-4 h-4" />
                          <span>{reminder.remindersSent} یادآور ارسال شده</span>
                        </div>
                      </div>
                    </div>

                    {reminder.notes && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">{reminder.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Send className="w-4 h-4 ml-2" />
                        ارسال یادآور
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 ml-2" />
                        ویرایش
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>قالب‌های یادآور</CardTitle>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 ml-2" />
                  قالب جدید
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline">{template.testType}</Badge>
                        <Badge variant="secondary">{template.frequency}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={template.isActive} />
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{template.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  نرخ پاسخ‌دهی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">نمودار نرخ پاسخ‌دهی به یادآورها</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  آمار بیماران
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>بیماران فعال</span>
                    <Badge className="bg-green-100 text-green-800">۴۲ نفر</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>نیاز به یادآور</span>
                    <Badge className="bg-blue-100 text-blue-800">۱۸ نفر</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>عقب‌افتاده</span>
                    <Badge className="bg-red-100 text-red-800">۵ نفر</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}